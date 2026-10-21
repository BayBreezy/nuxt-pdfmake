declare module "#pdfmake-nuxt-fonts" {
  import type { TFontFamilyTypes } from "pdfmake/interfaces";

  export const nuxtFontClientManifest: {
    version: 1;
    fonts: Record<string, TFontFamilyTypes>;
  };
  export const nuxtFontServerManifest: {
    fonts: Record<string, TFontFamilyTypes>;
    files: Record<string, string>;
  };
}
