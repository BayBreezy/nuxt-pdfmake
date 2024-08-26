import { defineNuxtPlugin } from "#app";
import pdfMake from "pdfmake";

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      pdfMake,
    },
  };
});

declare module "#app" {
  interface NuxtApp {
    $pdfMake: typeof import("pdfmake/build/pdfmake");
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $pdfMake: typeof import("pdfmake/build/pdfmake");
  }
}
