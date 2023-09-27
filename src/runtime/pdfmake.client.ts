import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  const pdfMake = window?.pdfMake as typeof import("pdfmake/build/pdfmake");
  return {
    provide: {
      pdfMake,
    },
  };
});
