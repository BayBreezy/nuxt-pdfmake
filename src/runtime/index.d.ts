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

export {};
