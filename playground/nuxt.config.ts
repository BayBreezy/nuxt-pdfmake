import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "nuxt-pdfmake",
    "@nuxt/devtools",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    "@nuxt/icon",
    "@nuxt/fonts",
  ],
  devtools: { enabled: true },
  pdfmake: {
    // enableApiRoute is true by default in dev — exposes POST /_pdfmake/generate
    fonts: {
      // useDefaultRoboto defaults to true when no other fonts are configured
      useDefaultRoboto: true,

      // Example: embed local custom fonts (paths relative to project root)
      // custom: {
      //   MyFont: {
      //     normal: './assets/fonts/MyFont-Regular.ttf',
      //     bold:   './assets/fonts/MyFont-Bold.ttf',
      //   },
      // },
      custom: {
        Playwrite: {
          normal: "./app/assets/fonts/PlaywriteHU.ttf",
          bold: "./app/assets/fonts/PlaywriteHU.ttf",
          italics: "./app/assets/fonts/PlaywriteHU.ttf",
          bolditalics: "./app/assets/fonts/PlaywriteHU.ttf",
        },
      },

      // Example: download and embed Google Fonts at build time
      googleFonts: ["Open Sans", "Lato", "Parisienne"],

      // Example: CDN fonts fetched at PDF-creation time (client only by default)
      // cdn: {
      //   Roboto: {
      //     normal: 'https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-400.woff',
      //     bold:   'https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-700.woff',
      //   },
      // },
    },
  },

  compatibilityDate: "latest",

  imports: {
    imports: [
      { from: "tailwind-variants", name: "tv" },
      { from: "tailwind-variants", name: "VariantProps", type: true },
    ],
  },

  colorMode: { storageKey: "playground-color-mode", classSuffix: "" },

  icon: {
    clientBundle: { scan: true, sizeLimitKb: 0 },
    mode: "svg",
    class: "shrink-0",
    fetchTimeout: 2000,
    serverBundle: "local",
  },

  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});
