import type { GoogleFontVariantRequest, PdfmakeFontVariant } from "./types";

export const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const PDFMAKE_FONT_VARIANTS: GoogleFontVariantRequest[] = [
  { variant: "normal", weight: "400", style: "normal" },
  { variant: "bold", weight: "700", style: "normal" },
  { variant: "italics", weight: "400", style: "italic" },
  { variant: "bolditalics", weight: "700", style: "italic" },
];

export const PDFMAKE_FONT_VARIANT_FALLBACKS: Record<PdfmakeFontVariant, PdfmakeFontVariant[]> = {
  normal: ["normal", "bold", "italics", "bolditalics"],
  bold: ["bold", "normal", "bolditalics", "italics"],
  italics: ["italics", "normal", "bolditalics", "bold"],
  bolditalics: ["bolditalics", "italics", "bold", "normal"],
};
