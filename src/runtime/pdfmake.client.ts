import { defineNuxtPlugin } from "#app";
import "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";

export default defineNuxtPlugin(() => {
  const pdfMake = window?.pdfMake;
  return {
    provide: {
      pdfMake,
    },
  };
});
