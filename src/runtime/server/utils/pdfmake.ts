import { useNitroApp } from "nitropack/runtime";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

declare module "nitropack/types" {
  interface NitroApp {
    $pdfMake: typeof import("pdfmake/build/pdfmake");
  }
}

export function useServerPDFMake() {
  return useNitroApp().$pdfMake;
}

/**
 * Creates a PDF buffer from a given document definition using the server-side pdfMake instance.
 *
 * This is intended for use in Nitro route handlers or other server-side contexts where pdfMake is not available as a composable.
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
export function createPDFBuffer(docDefinition: TDocumentDefinitions): Promise<Buffer> {
  return useServerPDFMake().createPdf(docDefinition).getBuffer() as Promise<Buffer>;
}

/**
 * Creates a PDF as a base64 string from a given document definition using the server-side pdfMake instance.
 *
 * This can be useful for embedding PDFs in data URIs or sending them in JSON responses.
 *
 * @example Get PDF as base64 string:
 * ```ts
 * const base64 = await createPDFBase64({ content: ['Hello'] });
 * console.log(`data:application/pdf;base64,${base64}`);
 * ```
 */
export function createPDFBase64(docDefinition: TDocumentDefinitions): Promise<string> {
  return useServerPDFMake().createPdf(docDefinition).getBase64() as Promise<string>;
}
