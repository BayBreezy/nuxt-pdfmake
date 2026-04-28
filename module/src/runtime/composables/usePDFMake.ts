import { useNuxtApp } from "#imports";

/**
 * Returns the configured pdfmake instance on the client.
 *
 * On the server (SSR page context) this returns null — use
 * `createPDFBuffer()` or `createPDFBase64()` inside Nitro route handlers instead.
 *
 * @example Client usage in a Vue component:
 * ```ts
 * const pdfMake = usePDFMake();
 * const doc = pdfMake!.createPdf({ content: ['Hello'] });
 * doc.open(); // opens in a new browser tab
 * ```
 *
 * @example Server-side PDF in a Nitro handler (server/api/report.get.ts):
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const buffer = await createPDFBuffer({ content: ['Hello'] });
 *   setHeader(event, 'Content-Type', 'application/pdf');
 *   return buffer;
 * });
 * ```
 */
export const usePDFMake = () => {
  if (import.meta.client) {
    return useNuxtApp().$pdfMake;
  }
  // Server (SSR): pdfMake is not available as a composable.
  // Use createPDFBuffer() or createPDFBase64() in Nitro route handlers.
  return null;
};
