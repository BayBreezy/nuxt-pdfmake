import NuxtFonts from "@nuxt/fonts";

import PdfmakeModule from "../../../src/module";

export default defineNuxtConfig({
  modules: [NuxtFonts, PdfmakeModule],
  fonts: {
    local: {
      dirs: ["../../../node_modules/pdfmake/fonts/Roboto"],
    },
    families: [
      {
        name: "Roboto",
        provider: "local",
        weights: [400, 500],
        styles: ["normal", "italic"],
        global: true,
      },
    ],
  },
  pdfmake: {
    enableApiRoute: true,
    enableDevtools: false,
    fonts: {
      nuxtFonts: true,
      useDefaultRoboto: false,
    },
  },
});
