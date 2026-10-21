import pdfMake from "pdfmake/build/pdfmake";
import type { TFontFamilyTypes } from "pdfmake/interfaces";

import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import {
  cdnFonts,
  fontDescriptors,
  fontVfs,
  nuxtFontsEnabled,
  useDefaultRoboto,
} from "#build/pdfmake-fonts.mjs";

import { mergeFontDescriptors, resolveRuntimeFontUrl } from "./utils/fonts";

interface NuxtFontManifest {
  version: 1;
  fonts: Record<string, TFontFamilyTypes>;
}

async function loadNuxtFonts(app: { baseURL?: string; cdnURL?: string }) {
  const baseURL = String(app.baseURL || "/");
  const cdnURL = String(app.cdnURL || "");
  const manifestURL = resolveRuntimeFontUrl(
    `${baseURL.replace(/\/$/, "")}/_pdfmake/fonts/manifest.json`,
    baseURL,
    cdnURL,
    window.location.origin,
  );
  const response = await fetch(manifestURL);
  if (!response.ok) {
    throw new Error(
      `Failed to load the @nuxt/fonts manifest (${response.status} ${response.statusText}).`,
    );
  }

  const manifest = (await response.json()) as NuxtFontManifest;
  return Object.fromEntries(
    Object.entries(manifest.fonts).map(([family, descriptor]) => [
      family,
      Object.fromEntries(
        Object.entries(descriptor).map(([variant, url]) => [
          variant,
          typeof url === "string"
            ? resolveRuntimeFontUrl(url, baseURL, cdnURL, window.location.origin)
            : url,
        ]),
      ),
    ]),
  ) as Record<string, TFontFamilyTypes>;
}

export default defineNuxtPlugin(async () => {
  const { app } = useRuntimeConfig();

  // Register embedded (base64) fonts via addVirtualFileSystem
  if (Object.keys(fontVfs as Record<string, string>).length > 0) {
    pdfMake.addVirtualFileSystem(fontVfs as Record<string, string>);
  }

  if (useDefaultRoboto) {
    // vfs_fonts is a CJS module — dynamic import wraps module.exports as .default
    const vfsFontsModule = await import("pdfmake/build/vfs_fonts");
    const vfsData =
      (vfsFontsModule as unknown as { default?: Record<string, string> }).default ??
      (vfsFontsModule as unknown as Record<string, string>);
    pdfMake.addVirtualFileSystem(vfsData);
  }

  pdfMake.addFonts(
    mergeFontDescriptors(
      fontDescriptors as Record<string, TFontFamilyTypes>,
      cdnFonts as Record<string, TFontFamilyTypes>,
      {},
      useDefaultRoboto,
    ),
  );

  if (nuxtFontsEnabled) {
    // The manifest is a tiny URL-only JSON file. Load it in the background so a slow or failed
    // request never blocks hydration; the font files themselves are fetched by pdfmake on demand.
    void loadNuxtFonts(app)
      .then((nuxtFonts) => pdfMake.addFonts(nuxtFonts))
      .catch((error) => {
        console.warn("[nuxt-pdfmake] Could not load @nuxt/fonts families for PDFs.", error);
      });
  }

  return {
    provide: { pdfMake },
  };
});

declare module "#app" {
  interface NuxtApp {
    $pdfMake: typeof import("pdfmake/build/pdfmake");
  }
}
