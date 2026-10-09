import NuxtPDFMake from "../src/module";

const url = process.env.NUXT_SITE_URL || "https://nuxt-pdfmake.behonbaker.com";
const name = process.env.NUXT_SITE_NAME || "Nuxt PDFMake";
const description = "Easily add pdfMake to your Nuxt application";
const locale = "en";

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@baybreezy/docd"],
  modules: [NuxtPDFMake, "@vite-pwa/nuxt"],
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
  nitro: {
    prerender: {
      // Write /examples/basic.html (not /examples/basic/index.html) so Netlify serves the
      // slashless URLs used by canonical tags, the sitemap and llms.txt without a 301
      autoSubfolderIndex: false,
      // The sitemap is a server route; prerender it so the static build ships /sitemap.xml
      routes: ["/sitemap.xml"],
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@faker-js/faker"],
    },
  },
  site: {
    name,
    url,
    description,
    defaultLocale: locale,
  },
  compatibilityDate: "latest",
});
