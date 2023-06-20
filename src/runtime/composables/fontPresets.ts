/**
 * Returns a set of predefined fonts that can be used with pdfMake.
 * Just call the composable and use it in you document definition.
 *
 * @example
 * ```ts
 *  const pdfMake = usePDFMake();
 *  const presetFonts = useFontPresets();
 * // The full signature of createPdf looks like this.
 * // tableLayouts, fonts and vfs are all optional - falsy values will cause
 * // pdfMake.tableLayouts, pdfMake.fonts or pdfMake.vfs to be used.
 * pdfMake.createPdf(docDefinition, tableLayouts, presetFonts, vfs)
 * ```
 * @see https://pdfmake.github.io/docs/0.1/fonts/custom-fonts-client-side/vfs/#3-specify-the-font-in-your-doc-definition
 */
export const useFontPresets = () => {
  return {
    Roboto: {
      normal:
        "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-400.woff",
      bold: "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-700.woff",
      italics:
        "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-400italic.woff",
      bolditalics:
        "https://cdn.jsdelivr.net/npm/typeface-roboto@1.1.13/files/roboto-latin-700italic.woff",
    },
    Inter: {
      normal:
        "https://cdn.jsdelivr.net/npm/typeface-inter@3.18.1/Inter Web/Inter-Regular.woff",
      bold: "https://cdn.jsdelivr.net/npm/typeface-inter@3.18.1/Inter Web/Inter-Bold.woff",
      italics:
        "https://cdn.jsdelivr.net/npm/typeface-inter@3.18.1/Inter Web/Inter-Italic.woff",
      bolditalics:
        "https://cdn.jsdelivr.net/npm/typeface-inter@3.18.1/Inter Web/Inter-BoldItalic.woff",
    },
    Poppins: {
      normal:
        "https://cdn.jsdelivr.net/npm/typeface-poppins@1.1.13/files/poppins-latin-400.woff",
      bold: "https://cdn.jsdelivr.net/npm/typeface-poppins@1.1.13/files/poppins-latin-700.woff",
      italics:
        "https://cdn.jsdelivr.net/npm/typeface-poppins@1.1.13/files/poppins-latin-400italic.woff",
      bolditalics:
        "https://cdn.jsdelivr.net/npm/typeface-poppins@1.1.13/files/poppins-latin-700italic.woff",
    },
    Lora: {
      normal:
        "https://cdn.jsdelivr.net/npm/typeface-lora@1.1.13/files/lora-latin-400.woff",
      bold: "https://cdn.jsdelivr.net/npm/typeface-lora@1.1.13/files/lora-latin-700.woff",
      italics:
        "https://cdn.jsdelivr.net/npm/typeface-lora@1.1.13/files/lora-latin-400italic.woff",
      bolditalics:
        "https://cdn.jsdelivr.net/npm/typeface-lora@1.1.13/files/lora-latin-700italic.woff",
    },
  };
};
