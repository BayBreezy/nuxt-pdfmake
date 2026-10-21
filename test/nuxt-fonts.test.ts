import { logger } from "@nuxt/kit";
import { describe, expect, it, vi } from "vitest";

import { mergeFontDescriptors, resolveRuntimeFontUrl } from "../src/runtime/utils/fonts";
import type { NuxtFontFaceData, ResolvedNuxtFontDetails } from "../src/types";
import {
  getNuxtFontsDependencyDefaults,
  mergeResolvedNuxtFont,
  selectNuxtFontFamily,
  selectNuxtFonts,
} from "../src/utils/nuxt-fonts";

function resolvedFamily(fontFamily: string, fonts: NuxtFontFaceData[]): ResolvedNuxtFontDetails {
  const urls = fonts.flatMap((font) =>
    font.src.flatMap((source) => (source.url ? [source.url] : [])),
  );
  return {
    fontFamily,
    fonts,
    files: [...new Set(urls)].map((url) => ({
      url,
      readFont: vi.fn(async () => Buffer.from(url)),
    })),
  };
}

function face(
  url: string,
  weight: NuxtFontFaceData["weight"],
  style = "normal",
  subset = "latin",
): NuxtFontFaceData {
  return { src: [{ url }], weight, style, meta: { subset } };
}

describe("@nuxt/fonts mapping", () => {
  it("maps exact normal and italic 400/700 faces", () => {
    const font = resolvedFamily("Inter", [
      face("/regular.woff2", 400),
      face("/bold.woff2", 700),
      face("/italic.woff2", 400, "italic"),
      face("/bold-italic.woff2", 700, "italic"),
    ]);

    expect(Object.fromEntries(selectNuxtFontFamily(font))).toMatchObject({
      normal: { url: "/regular.woff2" },
      bold: { url: "/bold.woff2" },
      italics: { url: "/italic.woff2" },
      bolditalics: { url: "/bold-italic.woff2" },
    });
  });

  it("supports variable ranges, oblique styles, and missing-face fallbacks", () => {
    const variable = resolvedFamily("Variable", [
      face("/upright.woff2", [100, 900]),
      face("/oblique.woff2", "100 900", "oblique"),
    ]);
    const regularOnly = resolvedFamily("Regular Only", [face("/regular.woff2", 400)]);

    expect(new Set([...selectNuxtFontFamily(variable).values()].map((item) => item.url))).toEqual(
      new Set(["/upright.woff2", "/oblique.woff2"]),
    );
    expect(
      [...selectNuxtFontFamily(regularOnly).values()].every(
        (item) => item.url === "/regular.woff2",
      ),
    ).toBe(true);
  });

  it("prefers Latin-compatible faces and warns when other subsets are skipped", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => undefined);
    const font = resolvedFamily("Subset Font", [
      face("/cyrillic.woff2", 400, "normal", "cyrillic"),
      face("/latin.woff2", 400, "normal", "latin"),
    ]);

    expect(selectNuxtFontFamily(font).get("normal")?.url).toBe("/latin.woff2");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("multiple subsets"));
    warn.mockRestore();
  });

  it("deduplicates selected assets without reading them", () => {
    const font = resolvedFamily("Inter", [face("/_nuxt/fonts/inter.woff2", [100, 900])]);
    const selected = selectNuxtFonts([font]);

    expect(selected.files.size).toBe(1);
    expect(font.files[0]!.readFont).not.toHaveBeenCalled();
    expect(selected.client.fonts.Inter).toEqual({
      normal: "/_nuxt/fonts/inter.woff2",
      bold: "/_nuxt/fonts/inter.woff2",
      italics: "/_nuxt/fonts/inter.woff2",
      bolditalics: "/_nuxt/fonts/inter.woff2",
    });
    expect(JSON.stringify(selected.server)).not.toContain("base64");
  });

  it("normalizes base and CDN URLs", () => {
    expect(
      resolveRuntimeFontUrl("/app/_nuxt/fonts/a.woff2", "/app/", "", "https://site.test"),
    ).toBe("https://site.test/app/_nuxt/fonts/a.woff2");
    expect(
      resolveRuntimeFontUrl(
        "/app/_nuxt/fonts/a.woff2",
        "/app/",
        "https://cdn.test/assets/",
        "https://site.test",
      ),
    ).toBe("https://cdn.test/assets/_nuxt/fonts/a.woff2");
    expect(
      resolveRuntimeFontUrl("https://fonts.test/a.woff2", "/app/", "", "https://site.test"),
    ).toBe("https://fonts.test/a.woff2");
  });

  it("gives Nuxt Fonts precedence over embedded, CDN, and default descriptors", () => {
    const nuxtRoboto = { normal: "nuxt-roboto.woff2" };
    const fonts = mergeFontDescriptors(
      { Roboto: { normal: "embedded.ttf" }, Inter: { normal: "embedded-inter.ttf" } },
      { Inter: { normal: "cdn-inter.ttf" } },
      { Roboto: nuxtRoboto, Inter: { normal: "nuxt-inter.woff2" } },
      true,
    );

    expect(fonts.Roboto).toBe(nuxtRoboto);
    expect(fonts.Inter).toEqual({ normal: "nuxt-inter.woff2" });
  });

  it("merges repeated resolutions of one family instead of overwriting", () => {
    const regular = resolvedFamily("Inter", [face("/regular.woff2", 400)]);
    const bold = resolvedFamily("Inter", [face("/bold.woff2", 700), face("/regular.woff2", 400)]);
    const merged = mergeResolvedNuxtFont(regular, bold);

    expect(merged.fonts).toHaveLength(2);
    expect(merged.files.map((file) => file.url).toSorted()).toEqual([
      "/bold.woff2",
      "/regular.woff2",
    ]);
    expect(selectNuxtFontFamily(merged).get("bold")?.url).toBe("/bold.woff2");
  });

  it("passes remote font URLs straight through without packaging a file", () => {
    const font: ResolvedNuxtFontDetails = {
      fontFamily: "Remote",
      fonts: [face("https://fonts.test/remote.woff2", 400)],
      files: [],
    };
    const selected = selectNuxtFonts([font]);

    expect(selected.files.size).toBe(0);
    expect(selected.client.fonts.Remote?.normal).toBe("https://fonts.test/remote.woff2");
    expect(selected.server.fonts.Remote?.normal).toBe("https://fonts.test/remote.woff2");
    expect(selected.server.files).toEqual({});
  });

  it("prefers a subsettable format over WOFF2 and warns when only WOFF2 is available", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => undefined);
    const multi: NuxtFontFaceData = {
      src: [
        { url: "/inter.woff2", format: "woff2" },
        { url: "/inter.woff", format: "woff" },
      ],
      weight: 400,
      style: "normal",
    };
    const both = resolvedFamily("Both", [multi]);
    expect(selectNuxtFontFamily(both).get("normal")?.url).toBe("/inter.woff");
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("WOFF2"));

    const only = resolvedFamily("Only", [
      { ...face("/only.woff2", 400), src: [{ url: "/only.woff2", format: "woff2" }] },
    ]);
    expect(selectNuxtFontFamily(only).get("normal")?.url).toBe("/only.woff2");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("cannot subset"));
    warn.mockRestore();
  });

  it("defaults @nuxt/fonts to WOFF only when nuxtFonts is on and the user set no format", () => {
    const on = { fonts: { nuxtFonts: true } };

    expect(getNuxtFontsDependencyDefaults(on, undefined)).toEqual({
      "@nuxt/fonts": { optional: true, defaults: { defaults: { formats: ["woff"] } } },
    });
    expect(getNuxtFontsDependencyDefaults(on, { defaults: { formats: ["ttf"] } })).toEqual({});
    expect(getNuxtFontsDependencyDefaults({ fonts: { nuxtFonts: false } }, undefined)).toEqual({});
    expect(getNuxtFontsDependencyDefaults(undefined, undefined)).toEqual({});
    expect(getNuxtFontsDependencyDefaults({ enabled: false, ...on }, undefined)).toEqual({});
  });
});
