export default defineNuxtConfig({
  // https://github.com/nuxt-themes/docus
  extends: "@nuxt-themes/docus",
  modules: ["@nuxt/devtools", "nuxt-pdfmake", "@nuxtjs/tailwindcss"],
  tailwindcss: { exposeConfig: true },

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
