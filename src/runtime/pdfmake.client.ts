import { defineNuxtPlugin } from "#app";
import * as pdfMake from "pdfmake/build/pdfmake";

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

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $pdfMake: typeof import("pdfmake/build/pdfmake");
  }
}
