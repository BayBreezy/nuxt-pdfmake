import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
} from "@nuxt/kit";
import { version, name } from "../package.json";

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
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "pdfmake",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
    enableComposable: true,
    enableDevtools: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (!options.enabled) return;

    nuxt.options.app.head.script ||= [];
    nuxt.options.app.head.script.push(
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js",
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.min.js",
      }
    );
    // Add plugin
    addPlugin(resolver.resolve("./runtime/pdfmake.client"));

    // Add composable
    if (options.enableComposable) {
      addImportsDir(resolver.resolve("./runtime/composables"));
    }

    // Add devtools tab
    if (!options.enableDevtools) return;
    //@ts-ignore
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
