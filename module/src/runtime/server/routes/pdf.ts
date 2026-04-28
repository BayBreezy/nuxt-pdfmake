import { createError, defineEventHandler, readBody, setHeader } from "h3";

/**
 * Pre-built PDF generation endpoint: POST /_pdfmake/generate
 *
 * Enabled in development by default. Set `enableApiRoute: true` in module options to enable in production (add your own auth middleware if you do).
 *
 * @example
 * ```ts
 * const { data } = await useFetch('/_pdfmake/generate', {
 *   method: 'POST',
 *   body: { docDefinition: { content: ['Hello, PDF!'] } },
 *   responseType: 'blob',
 * });
 * ```
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ docDefinition?: unknown }>(event);

  if (!body?.docDefinition || typeof body.docDefinition !== "object") {
    throw createError({
      statusCode: 400,
      message: "Request body must include a docDefinition object.",
    });
  }

  const buffer = await createPDFBuffer(body.docDefinition as never);

  setHeader(event, "Content-Type", "application/pdf");
  setHeader(event, "Content-Disposition", 'inline; filename="document.pdf"');
  return buffer;
});
