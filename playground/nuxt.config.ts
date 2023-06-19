import pdfMakeMopdule from "../src/module";
export default defineNuxtConfig({
  modules: ["@nuxthq/ui", pdfMakeMopdule, "@nuxt/devtools"],
  app: {
    head: {
      link: [
        // Inter font
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      ],
    },
  },
  pdfmake: {},
});
