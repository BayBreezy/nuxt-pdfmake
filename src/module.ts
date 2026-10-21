import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { onDevtoolsReady, NUXT_DEVTOOLS_GROUP_ID } from "@nuxt/devtools-kit";
import {
  addImports,
  addPlugin,
  addServerHandler,
  addServerImportsDir,
  addServerPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  hasNuxtModuleCompatibility,
  logger,
  addServerTemplate,
} from "@nuxt/kit";
import type { ModuleDependencies } from "@nuxt/schema";
import { defu } from "defu";
import type { Nitro } from "nitropack/types";

import { name, version } from "../package.json";
import type {
  ModuleOptions,
  NuxtFontClientManifest,
  NuxtFontServerManifest,
  PdfmakeDevtoolsRuntimeConfig,
  ProcessedFonts,
  ResolvedNuxtFontDetails,
} from "./types";
import {
  calculateEmbeddedFontSizeKB,
  createPdfmakeFontsTemplate,
  getFontSizeMapKB,
  processCustomFonts,
  processGoogleFonts,
  resolveUseDefaultRoboto,
} from "./utils/fonts";
import { withoutPdfmakeAnnotationWarnings } from "./utils/nitro-warnings";
import {
  getNuxtFontsDependencyDefaults,
  mergeResolvedNuxtFont,
  selectNuxtFonts,
} from "./utils/nuxt-fonts";

export type { ModuleOptions } from "./types";
export {
  bytesToKB,
  calculateEmbeddedFontSizeKB,
  createGoogleFontCacheKey,
  createPdfmakeFontsTemplate,
  getFontSizeMapKB,
  getGoogleFontVariantUrls,
  normalizeGoogleFontId,
  resolveGoogleFont,
  resolveGoogleFontVariantUrl,
  resolvePdfmakeFontVariantFallbacks,
  resolveUseDefaultRoboto,
} from "./utils/fonts";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "pdfmake",
    compatibility: { nuxt: ">=3.0.x" },
  },
  defaults: {
    enabled: true,
    enableComposable: true,
    enableDevtools: true,
    enableApiRoute: undefined, // resolved to process.env.NODE_ENV !== 'production'
  },
  // Runs before any module is set up, so it works whatever the order in `modules`.
  moduleDependencies: (nuxt): ModuleDependencies => {
    const config = nuxt.options as unknown as Record<string, unknown>;
    return getNuxtFontsDependencyDefaults(
      config.pdfmake as Parameters<typeof getNuxtFontsDependencyDefaults>[0],
      config.fonts as Parameters<typeof getNuxtFontsDependencyDefaults>[1],
    );
  },
  async setup(options, nuxt) {
    if (!options.enabled) {
      logger.info("[nuxt-pdfmake] Module is disabled");
      return;
    }

    const resolver = createResolver(import.meta.url);
    const runtimeDir = resolver.resolve("./runtime");
    // Only transpile our own runtime, not pdfmake itself — we use the
    // pre-built bundles (pdfmake/build/pdfmake) which don't need transpilation.
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.alias["#pdfmake"] = runtimeDir;
    // Extend Vite config
    nuxt.options.vite.optimizeDeps = defu(nuxt.options.vite.optimizeDeps, {
      include: ["pdfmake/build/pdfmake", "pdfmake/build/vfs_fonts"],
    });

    const processedFonts: ProcessedFonts = {
      vfs: {},
      descriptors: {},
      sizes: {},
    };

    processCustomFonts(options.fonts?.custom, nuxt.options.rootDir, processedFonts);
    await processGoogleFonts(options.fonts?.googleFonts, nuxt.options.buildDir, processedFonts);

    const nuxtFontsEnabled = options.fonts?.nuxtFonts === true;
    // `fonts:resolved` is declared by @nuxt/fonts, an optional peer, so it isn't in our hook types.
    const onFontsResolved = (listener: (font: ResolvedNuxtFontDetails) => void) =>
      nuxt.hook("fonts:resolved" as never, listener as never);
    const resolvedNuxtFonts = new Map<string, ResolvedNuxtFontDetails>();
    let nuxtFontClientManifest: NuxtFontClientManifest = { version: 1, fonts: {} };
    let nuxtFontServerManifest: NuxtFontServerManifest = { fonts: {}, files: {} };

    if (nuxtFontsEnabled) {
      const nuxtFontAssetsDir = resolve(nuxt.options.buildDir, "pdfmake-nuxt-fonts");
      // Only holds manifest.json; the font files themselves are served by @nuxt/fonts.
      const publicAssetsDir = resolve(nuxtFontAssetsDir, "public");
      const serverAssetsDir = resolve(nuxtFontAssetsDir, "server");

      onFontsResolved((font) => {
        resolvedNuxtFonts.set(
          font.fontFamily,
          mergeResolvedNuxtFont(resolvedNuxtFonts.get(font.fontFamily), font),
        );
      });

      nuxt.hook("modules:done", async () => {
        if (!hasNuxtModule("@nuxt/fonts", nuxt)) {
          throw new Error(
            "[nuxt-pdfmake] fonts.nuxtFonts requires @nuxt/fonts to be registered in the Nuxt modules array.",
          );
        }
        if (!(await hasNuxtModuleCompatibility("@nuxt/fonts", ">=1.0.0", nuxt))) {
          throw new Error("[nuxt-pdfmake] fonts.nuxtFonts requires @nuxt/fonts v1.0.0 or newer.");
        }
      });

      nuxt.hook("nitro:config", (nitroConfig) => {
        nitroConfig.publicAssets ||= [];
        nitroConfig.publicAssets.push({
          dir: publicAssetsDir,
          baseURL: "/_pdfmake/fonts",
          maxAge: 0,
        });
        nitroConfig.serverAssets ||= [];
        nitroConfig.serverAssets.push({
          dir: serverAssetsDir,
          baseName: "pdfmake-fonts",
        });
      });

      nuxt.hook("nitro:build:before", async () => {
        await rm(nuxtFontAssetsDir, { recursive: true, force: true });
        await Promise.all([
          mkdir(publicAssetsDir, { recursive: true }),
          mkdir(serverAssetsDir, { recursive: true }),
        ]);

        const selected = selectNuxtFonts(resolvedNuxtFonts.values());
        nuxtFontClientManifest = selected.client;
        nuxtFontServerManifest = selected.server;

        const unpackagedFamilies = [...resolvedNuxtFonts.keys()].filter(
          (family) => !selected.client.fonts[family],
        );
        if (!nuxt.options.dev && unpackagedFamilies.length > 0) {
          throw new Error(
            `[nuxt-pdfmake] Could not package these @nuxt/fonts families because they have no URL-backed font faces: ${unpackagedFamilies.join(", ")}.`,
          );
        }

        if (resolvedNuxtFonts.size === 0) {
          logger.warn(
            "[nuxt-pdfmake] fonts.nuxtFonts is enabled, but @nuxt/fonts did not resolve any families. Configure PDF-only families with global: true.",
          );
        }

        await Promise.all(
          [...selected.files].map(async ([assetName, file]) => {
            let contents: Buffer;
            try {
              contents = await file.readFont();
            } catch (error) {
              throw new Error(
                `[nuxt-pdfmake] Failed to package @nuxt/fonts asset "${file.url}": ${error instanceof Error ? error.message : String(error)}`,
                { cause: error },
              );
            }
            await writeFile(resolve(serverAssetsDir, assetName), contents);
          }),
        );

        await writeFile(
          resolve(publicAssetsDir, "manifest.json"),
          JSON.stringify(nuxtFontClientManifest),
          "utf8",
        );
      });
    }

    const embeddedKB = calculateEmbeddedFontSizeKB(processedFonts.sizes);
    if (embeddedKB > 0) {
      logger.warn(
        `[nuxt-pdfmake] Embedded fonts add ${embeddedKB} KB to your bundle. ` +
          `Use fonts.cdn for URL-based fonts to keep the bundle lean.`,
      );
    }

    const hasAnyFont =
      Object.keys(processedFonts.descriptors).length > 0 ||
      Object.keys(options.fonts?.cdn ?? {}).length > 0;
    const useDefaultRoboto = resolveUseDefaultRoboto(options.fonts?.useDefaultRoboto, hasAnyFont);

    addTemplate({
      filename: "pdfmake-fonts.mjs",
      write: true,
      getContents: () =>
        createPdfmakeFontsTemplate(
          processedFonts,
          options.fonts?.cdn,
          useDefaultRoboto,
          nuxtFontsEnabled,
        ),
    });
    addServerTemplate({
      filename: "pdfmake-fonts.mjs",
      getContents: () =>
        createPdfmakeFontsTemplate(
          processedFonts,
          options.fonts?.cdn,
          useDefaultRoboto,
          nuxtFontsEnabled,
        ),
    });
    addServerTemplate({
      filename: "#pdfmake-nuxt-fonts",
      getContents: () =>
        [
          `export const nuxtFontClientManifest = ${JSON.stringify(nuxtFontClientManifest)};`,
          `export const nuxtFontServerManifest = ${JSON.stringify(nuxtFontServerManifest)};`,
        ].join("\n"),
    });
    nuxt.options.alias["#pdfmake-fonts"] = resolve(nuxt.options.buildDir, "pdfmake-fonts.mjs");

    addPlugin(resolver.resolve("./runtime/pdfmake.client"));
    addServerPlugin(resolver.resolve("./runtime/pdfmake.server"));

    // The server plugin bundles pdfmake's prebuilt file, which makes Rollup log dozens of harmless warnings.
    // The prerenderer builds its own Nitro instance, so it needs the same wrapper.
    const muteAnnotationWarnings = (nitro: Pick<Nitro, "hooks">) => {
      nitro.hooks.hook("rollup:before", (_nitro, config) => {
        config.onwarn = withoutPdfmakeAnnotationWarnings(config.onwarn as never) as never;
      });
    };
    nuxt.hook("nitro:init", (nitro) => {
      muteAnnotationWarnings(nitro);
      nitro.hooks.hook("prerender:init", muteAnnotationWarnings);
    });

    if (options.enableComposable) {
      addImports({
        from: resolver.resolve("./runtime/composables/usePDFMake"),
        name: "usePDFMake",
      });
      addServerImportsDir(resolver.resolve("./runtime/server/utils"));
    }

    const isDev = nuxt.options.dev;
    const apiEnabled = options.enableApiRoute ?? isDev;
    if (apiEnabled) {
      addServerHandler({
        route: "/_pdfmake/generate",
        handler: resolver.resolve("./runtime/server/routes/pdf"),
      });
    }

    if (nuxtFontsEnabled && isDev) {
      addServerHandler({
        route: "/_pdfmake/fonts/manifest.json",
        handler: resolver.resolve("./runtime/server/routes/fonts"),
      });
    }

    // DevTools only exist while developing; don't ship the panel route in production builds
    if (!options.enableDevtools || !isDev) return;

    const pdfmakeDevtools: PdfmakeDevtoolsRuntimeConfig = {
      embedded: Object.keys(processedFonts.descriptors),
      cdn: Object.keys(options.fonts?.cdn ?? {}),
      googleFonts: options.fonts?.googleFonts ?? [],
      nuxtFonts: nuxtFontsEnabled,
      fontSizesKB: getFontSizeMapKB(processedFonts.sizes),
      embeddedKB,
      useDefaultRoboto,
      apiEnabled,
    };
    (nuxt.options.runtimeConfig as Record<string, unknown>).pdfmakeDevtools = pdfmakeDevtools;

    // Nuxt DevTools v3 (bundled with Nuxt 4) reads `devtools:customTabs`; v4 emits `devtools:ready`
    // and registers docks. Register through whichever one fires, never both.
    let registeredCustomTab = false;
    nuxt.hook("devtools:customTabs", (tabs) => {
      registeredCustomTab = true;
      tabs.push({
        name: "pdfmake",
        title: "PDFMake",
        icon: "i-vscode-icons-file-type-pdf2",
        view: { type: "iframe", src: "/_pdfmake/devtools" },
      });
    });
    onDevtoolsReady((ctx) => {
      if (registeredCustomTab) return;
      ctx.docks.register({
        id: "pdfmake",
        title: "PDFMake",
        icon: "i-vscode-icons-file-type-pdf2",
        type: "iframe",
        url: "/_pdfmake/devtools",
        groupId: NUXT_DEVTOOLS_GROUP_ID,
      });
    });

    addServerHandler({
      route: "/_pdfmake/devtools",
      handler: resolver.resolve("./runtime/devtools/handler"),
    });
  },
});
