import { resolve } from "node:path";

import { addCustomTab } from "@nuxt/devtools-kit";
import {
  addImports,
  addPlugin,
  addServerHandler,
  addServerImportsDir,
  addServerPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  logger,
  addServerTemplate,
} from "@nuxt/kit";
import { defu } from "defu";

import { name, version } from "../package.json";
import type { ModuleOptions, PdfmakeDevtoolsRuntimeConfig, ProcessedFonts } from "./types";
import {
  calculateEmbeddedFontSizeKB,
  createPdfmakeFontsTemplate,
  getFontSizeMapKB,
  processCustomFonts,
  processGoogleFonts,
} from "./utils/fonts";

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
    const useDefaultRoboto = options.fonts?.useDefaultRoboto ?? !hasAnyFont;

    addTemplate({
      filename: "pdfmake-fonts.mjs",
      write: true,
      getContents: () =>
        createPdfmakeFontsTemplate(processedFonts, options.fonts?.cdn, useDefaultRoboto),
    });
    addServerTemplate({
      filename: "pdfmake-fonts.mjs",
      getContents: () =>
        createPdfmakeFontsTemplate(processedFonts, options.fonts?.cdn, useDefaultRoboto),
    });
    nuxt.options.alias["#pdfmake-fonts"] = resolve(nuxt.options.buildDir, "pdfmake-fonts.mjs");

    addPlugin(resolver.resolve("./runtime/pdfmake.client"));
    addServerPlugin(resolver.resolve("./runtime/pdfmake.server"));

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

    if (!options.enableDevtools) return;

    const pdfmakeDevtools: PdfmakeDevtoolsRuntimeConfig = {
      embedded: Object.keys(processedFonts.descriptors),
      cdn: Object.keys(options.fonts?.cdn ?? {}),
      googleFonts: options.fonts?.googleFonts ?? [],
      fontSizesKB: getFontSizeMapKB(processedFonts.sizes),
      embeddedKB,
      useDefaultRoboto,
      apiEnabled,
    };
    (nuxt.options.runtimeConfig as Record<string, unknown>).pdfmakeDevtools = pdfmakeDevtools;

    addCustomTab({
      name: "pdfmake",
      title: "PDFMake",
      icon: "i-vscode-icons-file-type-pdf2",
      view: {
        type: "iframe",
        src: "/_pdfmake/devtools",
      },
    });

    addServerHandler({
      route: "/_pdfmake/devtools",
      handler: resolver.resolve("./runtime/devtools/handler"),
    });
  },
});
