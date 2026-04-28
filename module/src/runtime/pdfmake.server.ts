import { defineNitroPlugin } from "nitropack/runtime";
import pdfMake from "pdfmake/build/pdfmake";
import type { TFontFamilyTypes } from "pdfmake/interfaces";

import { cdnFonts, fontDescriptors, fontVfs, useDefaultRoboto } from "#pdfmake-fonts";

declare module "nitropack/types" {
  interface NitroApp {
    $pdfMake: typeof import("pdfmake/build/pdfmake");
  }
}

export default defineNitroPlugin(async (nitroApp) => {
  if (Object.keys(fontVfs as Record<string, string>).length > 0) {
    pdfMake.addVirtualFileSystem(fontVfs as Record<string, string>);
  }

  if (useDefaultRoboto) {
    // vfs_fonts is a CJS module; Nitro's interop wraps module.exports as .default
    const vfsFontsModule = (await import("pdfmake/build/vfs_fonts.js")) as unknown as
      | { default?: Record<string, string> }
      | Record<string, string>;
    const vfsData =
      (vfsFontsModule as { default?: Record<string, string> }).default ??
      (vfsFontsModule as Record<string, string>);
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

  // Attach to nitroApp so useNitroApp().$pdfMake resolves in server utilities
  nitroApp.$pdfMake = pdfMake;
});
