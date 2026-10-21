import { Buffer } from "node:buffer";

import { defineNitroPlugin, useStorage } from "nitropack/runtime";
import pdfMake from "pdfmake/build/pdfmake";
import type { TFontFamilyTypes } from "pdfmake/interfaces";

import { cdnFonts, fontDescriptors, fontVfs, useDefaultRoboto } from "#pdfmake-fonts";
import { nuxtFontServerManifest } from "#pdfmake-nuxt-fonts";

import { mergeFontDescriptors } from "./utils/fonts";

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

  const nuxtFontVfs: Record<string, string> = {};
  const fontAssetStorage = useStorage("assets:pdfmake-fonts");
  for (const [vfsKey, assetName] of Object.entries(
    nuxtFontServerManifest.files as Record<string, string>,
  )) {
    const raw = await fontAssetStorage.getItemRaw(assetName);
    if (raw == null) {
      throw new Error(`[nuxt-pdfmake] Missing packaged @nuxt/fonts asset: ${assetName}`);
    }
    nuxtFontVfs[vfsKey] = Buffer.from(raw as Uint8Array).toString("base64");
  }
  if (Object.keys(nuxtFontVfs).length > 0) {
    pdfMake.addVirtualFileSystem(nuxtFontVfs);
  }

  const allFonts = mergeFontDescriptors(
    fontDescriptors as Record<string, TFontFamilyTypes>,
    cdnFonts as Record<string, TFontFamilyTypes>,
    nuxtFontServerManifest.fonts as Record<string, TFontFamilyTypes>,
    useDefaultRoboto,
  );

  pdfMake.addFonts(allFonts);

  // Attach to nitroApp so useNitroApp().$pdfMake resolves in server utilities
  nitroApp.$pdfMake = pdfMake;
});
