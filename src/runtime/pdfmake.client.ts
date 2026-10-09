import pdfMake from "pdfmake/build/pdfmake";
import type { TFontFamilyTypes } from "pdfmake/interfaces";

import { defineNuxtPlugin } from "#app";
import { cdnFonts, fontDescriptors, fontVfs, useDefaultRoboto } from "#build/pdfmake-fonts.mjs";

export default defineNuxtPlugin(async () => {
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

  const allFonts = {
    ...(fontDescriptors as Record<string, TFontFamilyTypes>),
    ...(cdnFonts as Record<string, TFontFamilyTypes>),
  };

  if (useDefaultRoboto) {
    (allFonts as Record<string, TFontFamilyTypes>).Roboto ??= {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    };
  }

  pdfMake.addFonts(allFonts);

  return {
    provide: { pdfMake },
  };
});

declare module "#app" {
  interface NuxtApp {
    $pdfMake: typeof import("pdfmake/build/pdfmake");
  }
}
