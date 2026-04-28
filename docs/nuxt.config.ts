const url = process.env.NUXT_SITE_URL || "http://localhost:3000";
const name = process.env.NUXT_SITE_NAME || "Nuxt PDFMake";
const description = "Easily add pdfMake to your Nuxt application";
const locale = "en";

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@baybreezy/docd"],
  modules: ["../module/src", "@vite-pwa/nuxt"],
  llms: {
    domain: url,
    title: name,
    description,
    full: {
      title: name!,
      description,
    },
  },
  pwa: {
    client: { installPrompt: false },
    includeAssets: ["favicon.ico", "robots.txt"],
    manifest: {
      name,
      short_name: name,
      description,
      theme_color: "#3b82f6",
      lang: locale,
      icons: [
        {
          src: "/icons/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icons/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icons/pwa-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/icons/pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  },

  pdfmake: {
    fonts: {
      useDefaultRoboto: true,
      googleFonts: ["Inter", "Merriweather", "Montserrat", "Nunito", "Playfair Display"],
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@faker-js/faker"],
    },
  },
  compatibilityDate: "latest",
});
