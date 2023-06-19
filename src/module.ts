import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";
import { version, name } from "../package.json";

// Module options TypeScript interface definition
export interface ModuleOptions {}

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
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/pdfmake.client"));

    // Add devtools tab
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
