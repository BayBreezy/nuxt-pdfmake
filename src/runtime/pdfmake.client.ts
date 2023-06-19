import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  const pdfMake = window?.pdfMake;
  return {
    provide: {
      pdfMake,
    },
  };
});
