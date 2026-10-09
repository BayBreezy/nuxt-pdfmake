import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { logger } from "@nuxt/kit";
import { APIv2 } from "google-font-metadata";

import {
  GOOGLE_FONTS_USER_AGENT,
  PDFMAKE_FONT_VARIANT_FALLBACKS,
  PDFMAKE_FONT_VARIANTS,
} from "../constants";
import type { GoogleFont, ModuleOptions, PdfmakeFontVariant, ProcessedFonts } from "../types";

const googleFonts = APIv2 as Record<string, GoogleFont>;

/**
 * Fetches a binary resource from the given URL and returns it as a Buffer.
 */
async function fetchBinary(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": GOOGLE_FONTS_USER_AGENT } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Normalizes a Google Font family name into a consistent ID format.
 *
 * E.g. "Open Sans" -> "open-sans"
 */
export function normalizeGoogleFontId(family: string) {
  return family
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Resolves a Google Font by family name, returning null if not found.
 *
 * Performs a case-insensitive search and normalization to handle common variations in font naming.
 */
export function resolveGoogleFont(family: string): GoogleFont | null {
  const normalized = normalizeGoogleFontId(family);
  return (
    googleFonts[normalized] ??
    Object.values(googleFonts).find(
      (font) => font.family.toLowerCase() === family.trim().toLowerCase(),
    ) ??
    null
  );
}

/**
 * Resolves the URL of a specific font variant for a given Google Font, applying fallbacks if necessary.
 *
 * Returns null if no suitable variant is found.
 */
export function resolveGoogleFontVariantUrl(
  font: GoogleFont,
  weight: string,
  style: string,
): string | null {
  const subsetMap = font.variants[weight]?.[style];
  if (!subsetMap) return null;

  const subset = subsetMap[font.defSubset] ?? Object.values(subsetMap)[0];
  return subset?.url.truetype ?? null;
}

/**
 * Given a Google Font, returns a map of available pdfmake font variants to their corresponding URLs, applying fallbacks as needed.
 *
 * Only includes variants that have a valid TrueType URL.
 */
export function getGoogleFontVariantUrls(font: GoogleFont) {
  const availableVariants = new Map<PdfmakeFontVariant, string>();

  for (const { variant, weight, style } of PDFMAKE_FONT_VARIANTS) {
    const fontUrl = resolveGoogleFontVariantUrl(font, weight, style);
    if (fontUrl) availableVariants.set(variant, fontUrl);
  }

  return availableVariants;
}

/**
 * Given a set of available font variants, determines the best fallback mapping for all pdfmake variants based on the defined fallback rules.
 */
export function resolvePdfmakeFontVariantFallbacks(
  availableVariants: Map<PdfmakeFontVariant, string>,
) {
  const resolved = new Map<PdfmakeFontVariant, PdfmakeFontVariant>();

  for (const { variant } of PDFMAKE_FONT_VARIANTS) {
    const sourceVariant = PDFMAKE_FONT_VARIANT_FALLBACKS[variant].find((fallbackVariant) =>
      availableVariants.has(fallbackVariant),
    );
    if (sourceVariant) resolved.set(variant, sourceVariant);
  }

  return resolved;
}

/**
 * Creates a unique cache key for a Google Font variant based on its family, variant, and source URL.
 *
 * This is used to cache downloaded font files and avoid redundant downloads.
 */
export function createGoogleFontCacheKey(
  family: string,
  variant: PdfmakeFontVariant,
  fontUrl: string,
) {
  return createHash("sha1").update(`${family}:${variant}:${fontUrl}`).digest("hex");
}

export async function downloadGoogleFont(
  family: string,
  cacheDir: string,
  processed: ProcessedFonts,
) {
  const font = resolveGoogleFont(family);
  if (!font) {
    logger.warn(`[nuxt-pdfmake] Google Font not found: "${family}"`);
    return;
  }

  const availableVariants = getGoogleFontVariantUrls(font);
  if (availableVariants.size === 0) {
    logger.warn(`[nuxt-pdfmake] Google Font "${font.family}" has no TrueType variants.`);
    return;
  }

  const vfsKeys = new Map<PdfmakeFontVariant, string>();
  const fallbacks: string[] = [];

  async function registerVariant(variant: PdfmakeFontVariant) {
    const existingVfsKey = vfsKeys.get(variant);
    if (existingVfsKey) return existingVfsKey;

    const fontUrl = availableVariants.get(variant);
    if (!fontUrl) return null;

    const cacheKey = createGoogleFontCacheKey(font!.family, variant, fontUrl);
    const cacheFile = resolve(cacheDir, `${cacheKey}.ttf`);
    const vfsKey = `${font!.family}-${variant}.ttf`;

    let fontBuffer: Buffer;
    if (existsSync(cacheFile)) {
      fontBuffer = readFileSync(cacheFile);
    } else {
      fontBuffer = await fetchBinary(fontUrl);
      writeFileSync(cacheFile, fontBuffer);
    }

    processed.vfs[vfsKey] = fontBuffer.toString("base64");
    processed.sizes[font!.family] = (processed.sizes[font!.family] ?? 0) + fontBuffer.byteLength;
    vfsKeys.set(variant, vfsKey);
    return vfsKey;
  }

  const descriptor = (processed.descriptors[font!.family] ??= {});
  const resolvedVariants = resolvePdfmakeFontVariantFallbacks(availableVariants);

  for (const { variant } of PDFMAKE_FONT_VARIANTS) {
    const sourceVariant = resolvedVariants.get(variant);
    if (!sourceVariant) continue;

    const vfsKey = await registerVariant(sourceVariant);
    if (!vfsKey) continue;

    descriptor[variant] = vfsKey;
    if (sourceVariant !== variant) {
      fallbacks.push(`${variant} -> ${sourceVariant}`);
    }
  }

  if (fallbacks.length > 0) {
    logger.warn(
      `[nuxt-pdfmake] Google Font "${font.family}" is missing some TrueType variants; using fallbacks: ${fallbacks.join(", ")}.`,
    );
  }
}

/**
 * Processes custom font files specified in the module options, embedding them into the processed fonts object for pdfmake.
 *
 * Reads each specified font file, encodes it as base64, and updates the virtual file system (vfs), size map, and descriptors accordingly.
 *
 * Logs warnings for any missing files or issues encountered during processing.
 */
export function processCustomFonts(
  customFonts: NonNullable<ModuleOptions["fonts"]>["custom"],
  rootDir: string,
  processed: ProcessedFonts,
) {
  for (const [family, variants] of Object.entries(customFonts ?? {})) {
    for (const [variant, filePath] of Object.entries(variants) as [PdfmakeFontVariant, string][]) {
      const abs = resolve(rootDir, filePath);
      if (!existsSync(abs)) {
        logger.warn(`[nuxt-pdfmake] Font file not found: ${abs}`);
        continue;
      }

      const vfsKey = `${family}-${variant}.ttf`;
      const fontBuffer = readFileSync(abs);
      processed.vfs[vfsKey] = fontBuffer.toString("base64");
      processed.sizes[family] = (processed.sizes[family] ?? 0) + fontBuffer.byteLength;
      const descriptor = (processed.descriptors[family] ??= {});
      descriptor[variant] = vfsKey;
    }
  }
}

/**
 * Fetches and processes Google Fonts specified in the module options, embedding them into the processed fonts object for pdfmake.
 *
 * For each specified Google Font family, attempts to resolve the font, determine available variants, and download the necessary font files.
 *
 * Applies fallbacks for missing variants as needed.
 *
 * Logs warnings for any fonts that cannot be resolved or downloaded.
 */
export async function processGoogleFonts(
  googleFontFamilies: string[] | undefined,
  buildDir: string,
  processed: ProcessedFonts,
) {
  if (!googleFontFamilies?.length) return;

  const cacheDir = resolve(buildDir, "pdfmake-fonts-cache");
  mkdirSync(cacheDir, { recursive: true });

  await Promise.all(
    googleFontFamilies.map((family) =>
      downloadGoogleFont(family, cacheDir, processed).catch((e) => {
        logger.warn(`[nuxt-pdfmake] Failed to download Google Font "${family}": ${e.message}`);
      }),
    ),
  );
}

/**
 * Converts a byte size into kilobytes, rounded to the nearest whole number.
 */
export function bytesToKB(bytes: number) {
  return Math.round(bytes / 1024);
}

/**
 * Calculates the total size of embedded fonts in kilobytes based on the provided font size map.
 *
 * Sums the byte sizes of all fonts and converts the total to KB.
 */
export function calculateEmbeddedFontSizeKB(sizes: ProcessedFonts["sizes"]) {
  return bytesToKB(Object.values(sizes).reduce((sum, bytes) => sum + bytes, 0));
}

/**
 * Generates a map of font family names to their sizes in kilobytes for all processed fonts, based on the provided font size map.
 *
 * This is useful for reporting the size of each embedded font family in a more human-readable format.
 */
export function getFontSizeMapKB(sizes: ProcessedFonts["sizes"]) {
  return Object.fromEntries(
    Object.entries(sizes).map(([family, bytes]) => [family, bytesToKB(bytes)]),
  );
}

/**
 * Creates a template for pdfmake fonts, including virtual file system (vfs), font descriptors, CDN fonts, and the default Roboto usage flag.
 *
 * This template is used to generate the final font configuration for pdfmake.
 */
export function createPdfmakeFontsTemplate(
  processed: ProcessedFonts,
  cdnFonts: NonNullable<ModuleOptions["fonts"]>["cdn"],
  useDefaultRoboto: boolean,
) {
  return [
    "// Auto-generated by nuxt-pdfmake. Do not edit.",
    `export const fontVfs = ${JSON.stringify(processed.vfs)};`,
    `export const fontDescriptors = ${JSON.stringify(processed.descriptors)};`,
    `export const cdnFonts = ${JSON.stringify(cdnFonts ?? {})};`,
    `export const useDefaultRoboto = ${JSON.stringify(useDefaultRoboto)};`,
  ].join("\n");
}
