import type { FontObjectV2 } from "google-font-metadata";
import type { TFontFamilyTypes } from "pdfmake/interfaces";

export interface ModuleOptions {
  /**
   * Enable the module
   * @default true
   */
  enabled?: boolean;
  /**
   * Enable auto-imported composables (usePDFMake) and server utilities
   * (createPDFBuffer, createPDFBase64, useServerPDFMake)
   * @default true
   */
  enableComposable?: boolean;
  /**
   * Enable the Nuxt DevTools panel
   * @default true
   */
  enableDevtools?: boolean;
  /**
   * Expose a pre-built POST endpoint at `/_pdfmake/generate`.
   *
   * Automatically disabled in production unless explicitly set to true.
   * @default true (dev only)
   */
  enableApiRoute?: boolean;
  /**
   * Font configuration for pdfmake. All fields are optional.
   *
   * Sensible defaults are used when not provided.
   */
  fonts?: {
    /**
     * Local font files resolved relative to the project root.
     *
     * Files are read at build time and embedded as base64 — no FS access at runtime.
     *
     * ⚠️ Each TTF variant adds ~270 KB to your bundle.
     */
    custom?: Record<string, TFontFamilyTypes>;
    /**
     * Google Font family names to download and cache at build time.
     *
     * Downloaded once, cached in `.nuxt/pdfmake-fonts-cache/`.
     *
     * ⚠️ Each font family adds ~1 MB to your bundle (4 variants).
     */
    googleFonts?: string[];
    /**
     * CDN or HTTP font URLs passed directly to pdfmake.
     * Fetched at PDF-creation time on the client.
     *
     * On the server, requires calling `pdfMake.setUrlAccessPolicy(() => true)`.
     */
    cdn?: Record<string, TFontFamilyTypes>;
    /**
     * Include the default Roboto font that ships with pdfmake via CDN.
     *
     * Defaults to true when no other fonts are configured.
     */
    useDefaultRoboto?: boolean;
  };
}

export type GoogleFont = FontObjectV2[string];
export type PdfmakeFontVariant = keyof TFontFamilyTypes;
export type FontVfs = Record<string, string>;
export type FontDescriptors = Record<string, TFontFamilyTypes>;
export type FontSizeMap = Record<string, number>;

export interface GoogleFontVariantRequest {
  variant: PdfmakeFontVariant;
  weight: "400" | "700";
  style: "normal" | "italic";
}

export interface ProcessedFonts {
  vfs: FontVfs;
  descriptors: FontDescriptors;
  sizes: FontSizeMap;
}

export interface PdfmakeDevtoolsRuntimeConfig {
  embedded: string[];
  cdn: string[];
  googleFonts: string[];
  fontSizesKB: FontSizeMap;
  embeddedKB: number;
  useDefaultRoboto: boolean;
  apiEnabled: boolean;
}
