import { defineEventHandler, setHeader } from "h3";

import { nuxtFontClientManifest } from "#pdfmake-nuxt-fonts";

export default defineEventHandler((event) => {
  setHeader(event, "Cache-Control", "no-store");
  return nuxtFontClientManifest;
});
