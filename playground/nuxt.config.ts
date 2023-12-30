import pdfMakeMopdule from "../src/module";

export default defineNuxtConfig({
  modules: [
    pdfMakeMopdule,
    "@nuxt/devtools",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-icon",
  ],

  app: {
    head: {
      link: [
        // Inter font
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      ],
    },
  },

  pdfmake: {},

  tailwindcss: {
    exposeConfig: true,
  },

  colorMode: {
    classSuffix: "",
  },

  typescript: {
    shim: false,
  },

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },
});