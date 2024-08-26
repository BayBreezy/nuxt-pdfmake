import { defineNuxtPlugin } from "#app";
import * as pdfMake from "pdfmake/build/pdfmake";

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      pdfMake,
    },
  };
});
