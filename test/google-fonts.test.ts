import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { logger } from "@nuxt/kit";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ProcessedFonts } from "../module/src/types";
import {
  calculateEmbeddedFontSizeKB,
  createPdfmakeFontsTemplate,
  downloadGoogleFont,
  normalizeGoogleFontId,
  resolveGoogleFont,
  resolvePdfmakeFontVariantFallbacks,
} from "../module/src/utils/fonts";

const ttfBuffer = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x66, 0x61, 0x6b, 0x65]);

describe("Google Fonts TTF downloads", () => {
  let cacheDir: string | null = null;

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    if (cacheDir) {
      rmSync(cacheDir, { recursive: true, force: true });
      cacheDir = null;
    }
  });

  it("resolves Google Font names from metadata", () => {
    expect(normalizeGoogleFontId(" Open Sans ")).toBe("open-sans");
    expect(resolveGoogleFont("Lato")?.family).toBe("Lato");
    expect(resolveGoogleFont("Open Sans")?.family).toBe("Open Sans");
    expect(resolveGoogleFont("Missing Font Family")).toBeNull();
  });

  it("resolves pdfmake variant fallbacks from available variants", () => {
    expect(resolvePdfmakeFontVariantFallbacks(new Map([["normal", "font.ttf"]]))).toEqual(
      new Map([
        ["normal", "normal"],
        ["bold", "normal"],
        ["italics", "normal"],
        ["bolditalics", "normal"],
      ]),
    );
  });

  it("creates the virtual font template content", () => {
    const processed = {
      vfs: { "Example-normal.ttf": Buffer.from("font").toString("base64") },
      descriptors: { Example: { normal: "Example-normal.ttf" } },
      sizes: { Example: 1536 },
    };

    expect(calculateEmbeddedFontSizeKB(processed.sizes)).toBe(2);
    expect(createPdfmakeFontsTemplate(processed, undefined, true)).toContain(
      'export const fontDescriptors = {"Example":{"normal":"Example-normal.ttf"}};',
    );
  });

  it("downloads Lato TrueType variants into the VFS descriptor shape", async () => {
    cacheDir = mkdtempSync(join(tmpdir(), "nuxt-pdfmake-fonts-"));
    const fetchMock = vi.fn(async () => new Response(ttfBuffer));
    vi.stubGlobal("fetch", fetchMock);

    const processed: ProcessedFonts = { vfs: {}, descriptors: {}, sizes: {} };

    await downloadGoogleFont("Lato", cacheDir, processed);

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(processed.descriptors).toEqual({
      Lato: {
        normal: "Lato-normal.ttf",
        bold: "Lato-bold.ttf",
        italics: "Lato-italics.ttf",
        bolditalics: "Lato-bolditalics.ttf",
      },
    });
    expect(Object.keys(processed.vfs).sort()).toEqual([
      "Lato-bold.ttf",
      "Lato-bolditalics.ttf",
      "Lato-italics.ttf",
      "Lato-normal.ttf",
    ]);
    expect(processed.sizes).toEqual({ Lato: ttfBuffer.byteLength * 4 });

    const cacheFiles = readdirSync(cacheDir);
    expect(cacheFiles).toHaveLength(4);
    for (const file of cacheFiles) {
      expect(file.endsWith(".ttf")).toBe(true);
      expect(readFileSync(join(cacheDir, file)).subarray(0, 4)).toEqual(ttfBuffer.subarray(0, 4));
    }
  });

  it("warns and skips missing Google Font families", async () => {
    cacheDir = mkdtempSync(join(tmpdir(), "nuxt-pdfmake-fonts-"));
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => undefined);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const processed: ProcessedFonts = { vfs: {}, descriptors: {}, sizes: {} };

    await downloadGoogleFont("Missing Font Family", cacheDir, processed);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(processed).toEqual({ vfs: {}, descriptors: {}, sizes: {} });
    expect(warn).toHaveBeenCalledWith(
      '[nuxt-pdfmake] Google Font not found: "Missing Font Family"',
    );
  });

  it("falls back missing font styles to an available TrueType variant", async () => {
    cacheDir = mkdtempSync(join(tmpdir(), "nuxt-pdfmake-fonts-"));
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => undefined);
    const fetchMock = vi.fn(async () => new Response(ttfBuffer));
    vi.stubGlobal("fetch", fetchMock);

    const processed: ProcessedFonts = { vfs: {}, descriptors: {}, sizes: {} };

    await downloadGoogleFont("Parisienne", cacheDir, processed);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(processed.descriptors).toEqual({
      Parisienne: {
        normal: "Parisienne-normal.ttf",
        bold: "Parisienne-normal.ttf",
        italics: "Parisienne-normal.ttf",
        bolditalics: "Parisienne-normal.ttf",
      },
    });
    expect(Object.keys(processed.vfs)).toEqual(["Parisienne-normal.ttf"]);
    expect(processed.sizes).toEqual({ Parisienne: ttfBuffer.byteLength });
    expect(readdirSync(cacheDir)).toHaveLength(1);
    expect(warn).toHaveBeenCalledWith(
      '[nuxt-pdfmake] Google Font "Parisienne" is missing some TrueType variants; using fallbacks: bold -> normal, italics -> normal, bolditalics -> normal.',
    );
  });
});
