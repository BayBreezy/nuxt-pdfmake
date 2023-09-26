import * as pdfMake from "pdfmake/build/pdfmake";

/**
 * A composable that returns the pdfMake instance.
 * @returns The pdfMake instance.
 * @example
 * ```ts
 * const pdfMake = usePDFMake();
 * // The full signature of createPdf looks like this.
 * // tableLayouts, fonts and vfs are all optional - falsy values will cause
 * // pdfMake.tableLayouts, pdfMake.fonts or pdfMake.vfs to be used.
 * pdfMake.createPdf(docDefinition, tableLayouts, fonts, vfs)
 * ```
 * @see https://pdfmake.github.io/docs/0.1/getting-started/client-side/methods/
 */
export const usePDFMake = () => {
  return pdfMake;
};
