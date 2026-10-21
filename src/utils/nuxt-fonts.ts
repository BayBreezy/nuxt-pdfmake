import { createHash } from "node:crypto";
import { extname } from "node:path";

import { logger } from "@nuxt/kit";
import type { ModuleDependencies } from "@nuxt/schema";

import { PDFMAKE_FONT_VARIANT_FALLBACKS, PDFMAKE_FONT_VARIANTS } from "../constants";
import type {
  FontDescriptors,
  NuxtFontClientManifest,
  NuxtFontFaceData,
  NuxtFontServerManifest,
  NuxtFontSource,
  PdfmakeFontVariant,
  ResolvedNuxtFontDetails,
  ResolvedNuxtFontFile,
} from "../types";

export interface FontCandidate {
  face: NuxtFontFaceData;
  url: string;
  format: string;
  /** Absent for remote (http/https) sources, which pdfmake fetches by URL instead of packaging. */
  file?: ResolvedNuxtFontFile;
}

const REMOTE_URL_RE = /^https?:\/\//i;

export interface SelectedNuxtFonts {
  client: NuxtFontClientManifest;
  server: NuxtFontServerManifest;
  files: Map<string, ResolvedNuxtFontFile>;
}

function getWeightRange(weight: NuxtFontFaceData["weight"]): [number, number] {
  if (Array.isArray(weight)) return [Number(weight[0]), Number(weight[1])];

  const values = String(weight ?? 400)
    .match(/\d+(?:\.\d+)?/g)
    ?.map(Number)
    .filter(Number.isFinite);

  if (!values?.length) return [400, 400];
  return [Math.min(...values), Math.max(...values)];
}

function getWeightDistance(face: NuxtFontFaceData, target: number) {
  const [min, max] = getWeightRange(face.weight);
  if (target >= min && target <= max) return 0;
  return Math.min(Math.abs(target - min), Math.abs(target - max));
}

function coversBasicLatin(unicodeRanges: string[] | undefined) {
  if (!unicodeRanges?.length) return false;

  return unicodeRanges.some((range) => {
    const match = range.match(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/i);
    if (!match) return false;
    const startHex = match[1];
    if (!startHex) return false;
    const start = Number.parseInt(startHex, 16);
    const end = Number.parseInt(match[2] ?? startHex, 16);
    return start <= 0x20 && end >= 0x7e;
  });
}

function getSubsetRank(face: NuxtFontFaceData) {
  if (face.meta?.subset?.toLowerCase() === "latin") return 0;
  if (coversBasicLatin(face.unicodeRange)) return 1;
  if (!face.meta?.subset && !face.unicodeRange?.length) return 2;
  return 3;
}

function isMatchingStyle(face: NuxtFontFaceData, target: string) {
  const style = (face.style ?? "normal").toLowerCase();
  return target === "italic" ? style === "italic" || style === "oblique" : style === "normal";
}

function getSourceFormat(source: NuxtFontSource) {
  const format = source.format ?? extname(source.url ?? "").slice(1);
  return format.toLowerCase();
}

/** Lower is better. fontkit can't subset WOFF2 faces whose `glyf` table is transformed, which is nearly all of them. */
function getFormatRank(format: string) {
  if (["ttf", "truetype", "otf", "opentype"].includes(format)) return 0;
  if (format === "woff") return 1;
  return format === "woff2" ? 3 : 2;
}

export function isWoff2Candidate(candidate: FontCandidate) {
  return getSourceFormat({ url: candidate.url, format: candidate.format }) === "woff2";
}

function findCandidate(
  face: NuxtFontFaceData,
  files: Map<string, ResolvedNuxtFontFile>,
): FontCandidate | undefined {
  let best: (FontCandidate & { rank: number }) | undefined;

  for (const source of face.src) {
    if (!source.url) continue;
    const file = files.get(source.url);
    if (!file && !REMOTE_URL_RE.test(source.url)) continue;

    const format = getSourceFormat(source);
    const rank = getFormatRank(format);
    if (!best || rank < best.rank) best = { face, url: source.url, file, format, rank };
  }

  return best;
}

/**
 * `fonts:resolved` can fire several times for one family with different face sets.
 * Merge them so earlier faces and files aren't lost, deduplicating by URL.
 */
export function mergeResolvedNuxtFont(
  existing: ResolvedNuxtFontDetails | undefined,
  incoming: ResolvedNuxtFontDetails,
): ResolvedNuxtFontDetails {
  if (!existing) return incoming;

  const faceKey = (face: NuxtFontFaceData) => JSON.stringify(face);
  const faces = new Map(existing.fonts.map((face) => [faceKey(face), face]));
  for (const face of incoming.fonts) faces.set(faceKey(face), face);

  const files = new Map(existing.files.map((file) => [file.url, file]));
  for (const file of incoming.files) files.set(file.url, file);

  return { ...incoming, fonts: [...faces.values()], files: [...files.values()] };
}

function pickCandidate(candidates: FontCandidate[], targetWeight: number, targetStyle: string) {
  const matchingStyle = candidates.filter(({ face }) => isMatchingStyle(face, targetStyle));
  if (!matchingStyle.length) return undefined;

  return matchingStyle.toSorted((a, b) => {
    return (
      getSubsetRank(a.face) - getSubsetRank(b.face) ||
      (a.face.meta?.priority ?? 0) - (b.face.meta?.priority ?? 0) ||
      getWeightDistance(a.face, targetWeight) - getWeightDistance(b.face, targetWeight)
    );
  })[0];
}

function getAssetName(url: string) {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 20);
  let extension = ".font";

  try {
    extension = extname(new URL(url, "https://nuxt-pdfmake.local").pathname) || extension;
  } catch {
    // The URL is supplied by @nuxt/fonts. A generic extension is safe because
    // fontkit detects supported fonts from their binary contents.
  }

  return `${hash}${extension}`;
}

function describeSubsets(font: ResolvedNuxtFontDetails) {
  return new Set(
    font.fonts.map((face) => face.meta?.subset).filter((value): value is string => !!value),
  );
}

export function selectNuxtFontFamily(font: ResolvedNuxtFontDetails) {
  const availableFiles = new Map(font.files.map((file) => [file.url, file]));
  const candidates = font.fonts.flatMap((face) => {
    const candidate = findCandidate(face, availableFiles);
    return candidate ? [candidate] : [];
  });
  const selected = new Map<PdfmakeFontVariant, FontCandidate>();

  for (const { variant, weight, style } of PDFMAKE_FONT_VARIANTS) {
    const candidate = pickCandidate(candidates, Number(weight), style);
    if (candidate) selected.set(variant, candidate);
  }

  const resolved = new Map<PdfmakeFontVariant, FontCandidate>();
  for (const { variant } of PDFMAKE_FONT_VARIANTS) {
    const fallback = PDFMAKE_FONT_VARIANT_FALLBACKS[variant].find((item) => selected.has(item));
    if (fallback) resolved.set(variant, selected.get(fallback)!);
  }

  if ([...resolved.values()].some(isWoff2Candidate)) {
    logger.warn(
      `[nuxt-pdfmake] @nuxt/fonts resolved "${font.fontFamily}" as WOFF2, which PDFMake cannot subset reliably (PDFs may fail with "Offset is outside the bounds of the DataView" or render broken glyphs). Add \`formats: ["woff"]\` (or \`["ttf"]\`) to this family in the \`fonts.families\` option of @nuxt/fonts.`,
    );
  }

  const subsets = describeSubsets(font);
  if (subsets.size > 1 && resolved.size > 0) {
    logger.warn(
      `[nuxt-pdfmake] @nuxt/fonts resolved multiple subsets for "${font.fontFamily}" (${[...subsets].join(", ")}). PDFMake can use only one file per variant; the Latin-compatible subset was preferred.`,
    );
  }

  if (resolved.size === 0 && font.fonts.length > 0) {
    logger.warn(
      `[nuxt-pdfmake] @nuxt/fonts family "${font.fontFamily}" has no URL-backed faces that PDFMake can register.`,
    );
  }

  return resolved;
}

export function selectNuxtFonts(fonts: Iterable<ResolvedNuxtFontDetails>): SelectedNuxtFonts {
  const clientFonts: FontDescriptors = {};
  const serverFonts: FontDescriptors = {};
  const serverFiles: Record<string, string> = {};
  const selectedFiles = new Map<string, ResolvedNuxtFontFile>();

  for (const font of fonts) {
    const selected = selectNuxtFontFamily(font);
    if (!selected.size) continue;

    const clientDescriptor = (clientFonts[font.fontFamily] ??= {});
    const serverDescriptor = (serverFonts[font.fontFamily] ??= {});

    for (const [variant, candidate] of selected) {
      clientDescriptor[variant] = candidate.url;

      if (!candidate.file) {
        // Remote URL: nothing to package. The server needs pdfmake's URL access policy, like `fonts.cdn`.
        serverDescriptor[variant] = candidate.url;
        continue;
      }

      const assetName = getAssetName(candidate.url);
      const vfsKey = `nuxt-fonts/${assetName}`;
      serverDescriptor[variant] = vfsKey;
      serverFiles[vfsKey] = assetName;
      selectedFiles.set(assetName, candidate.file);
    }
  }

  return {
    client: { version: 1, fonts: clientFonts },
    server: { fonts: serverFonts, files: serverFiles },
    files: selectedFiles,
  };
}

/**
 * `@nuxt/fonts` options to merge in when `fonts.nuxtFonts` is on. PDFMake can't subset the WOFF2
 * files `@nuxt/fonts` serves by default, so default the font format to WOFF. Anything the user
 * configured (`fonts.defaults.formats`, or `formats` on a family) is left untouched; Nuxt merges
 * these as defaults, below the user's own config.
 */
export function getNuxtFontsDependencyDefaults(
  pdfmakeOptions: { enabled?: boolean; fonts?: { nuxtFonts?: boolean } } | undefined,
  fontsOptions: { defaults?: { formats?: unknown[] } } | undefined,
): ModuleDependencies {
  if (pdfmakeOptions?.enabled === false || pdfmakeOptions?.fonts?.nuxtFonts !== true) return {};
  if (fontsOptions?.defaults?.formats) return {};

  return { "@nuxt/fonts": { optional: true, defaults: { defaults: { formats: ["woff"] } } } };
}
