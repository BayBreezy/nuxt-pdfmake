import { defineNuxtPlugin } from "#app";
import * as pdfMake from "pdfmake/build/pdfmake";

export default defineNuxtPlugin(() => {
  if (process.client) {
    // @ts-ignore
    pdfMake.fonts = {
      Roboto: {
        normal:
          "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-400.woff",
        bold: "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-700.woff",
        italics:
          "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-400italic.woff",
        bolditalics:
          "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-700italic.woff",
      },
    };
  }
  return {
    provide: {
      pdfMake,
    },
  };
});
