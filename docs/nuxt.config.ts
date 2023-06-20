import pdfMake from "../src/module";
export default defineNuxtConfig({
  // https://github.com/nuxt-themes/docus
  extends: "@nuxt-themes/docus",
  modules: ["@nuxt/devtools", "@nuxthq/ui", pdfMake],

  css: ["~/assets/main.css"],
  app: {
    head: {
      link: [
        // Inter font
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      ],
    },
  },
});
