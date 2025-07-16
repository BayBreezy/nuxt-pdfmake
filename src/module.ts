import {
  addImports,
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  logger,
} from "@nuxt/kit";

import { name, version } from "../package.json";

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable the module
   * @default true
   */
  enabled?: boolean;
  /**
   * Enable the composable injection. This adds both the `usePDFMake` & `useFontPresets` composables
   * @default true
   */
  enableComposable?: boolean;
  /**
   * Enable the devtools tab
   * @default true
   */
  enableDevtools?: boolean;
  /**
   * Whether to include the default font presets in the module
   * @default true
   */
  includeFontPresets?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "pdfmake",
    compatibility: {
      nuxt: "^3.0.0 || ^4.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
    enableComposable: true,
    enableDevtools: true,
    includeFontPresets: true,
  },
  setup(options, nuxt) {
    // Do nothing if the module is disabled
    if (!options.enabled) {
      logger.info("[nuxt-pdfmake] Module is disabled");
    }
    const resolver = createResolver(import.meta.url);
    const runtimeDir = resolver.resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.alias["#pdfmake"] = runtimeDir;

    nuxt.options.app.head.script ||= [];
    nuxt.options.app.head.script.push(
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js",
        defer: true,
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.min.js",
        defer: true,
      }
    );
    // Add plugin
    addPlugin(resolver.resolve("./runtime/pdfmake.client"));

    // Add composable if enabled
    if (options.enableComposable) {
      addImports({
        from: resolver.resolve("./runtime/composables/usePDFMake"),
        name: "usePDFMake",
      });
    }
    // Add if the font presets are included
    if (options.includeFontPresets) {
      addImports({
        from: resolver.resolve("./runtime/composables/fontPresets"),
        name: "useFontPresets",
      });
    }
    // Add devtools tab
    if (!options.enableDevtools) return;
    nuxt.hook("devtools:customTabs", (iframeTabs) => {
      iframeTabs.push({
        name: "pdfmake",
        title: "PDFMake",
        icon: "i-vscode-icons-file-type-pdf2",
        view: {
          type: "iframe",
          src: "https://pdfmake.github.io/docs/0.1/getting-started/client-side/",
        },
      });
    });
  },
});
