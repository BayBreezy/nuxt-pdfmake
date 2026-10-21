import type { TFontFamilyTypes } from "pdfmake/interfaces";

const DEFAULT_ROBOTO: TFontFamilyTypes = {
  normal: "Roboto-Regular.ttf",
  bold: "Roboto-Medium.ttf",
  italics: "Roboto-Italic.ttf",
  bolditalics: "Roboto-MediumItalic.ttf",
};

export function mergeFontDescriptors(
  embedded: Record<string, TFontFamilyTypes>,
  cdn: Record<string, TFontFamilyTypes>,
  nuxtFonts: Record<string, TFontFamilyTypes>,
  useDefaultRoboto: boolean,
) {
  const fonts = { ...embedded, ...cdn };
  if (useDefaultRoboto) fonts.Roboto ??= DEFAULT_ROBOTO;
  return Object.assign(fonts, nuxtFonts);
}

export function resolveRuntimeFontUrl(
  fontUrl: string,
  baseURL: string,
  cdnURL: string,
  origin: string,
) {
  if (/^https?:\/\//i.test(fontUrl)) return fontUrl;

  if (cdnURL) {
    const normalizedBase = `/${baseURL.replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");
    const relative =
      normalizedBase && fontUrl.startsWith(`${normalizedBase}/`)
        ? fontUrl.slice(normalizedBase.length + 1)
        : fontUrl.replace(/^\/+/, "");
    return new URL(relative, cdnURL.endsWith("/") ? cdnURL : `${cdnURL}/`).href;
  }

  return new URL(fontUrl, origin).href;
}
