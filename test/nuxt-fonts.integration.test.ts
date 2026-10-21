import { fileURLToPath } from "node:url";

import { $fetch, setup } from "@nuxt/test-utils";
import { describe, expect, it } from "vitest";

describe("@nuxt/fonts integration", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/nuxt-fonts", import.meta.url)),
  });

  it("serves a URL-only client manifest", async () => {
    const manifest = await $fetch<{
      version: number;
      fonts: Record<string, Record<string, string>>;
    }>("/_pdfmake/fonts/manifest.json");

    expect(manifest.version).toBe(1);
    expect(manifest.fonts.Roboto).toMatchObject({
      normal: expect.stringContaining("/_nuxt/fonts/"),
      bold: expect.stringContaining("/_nuxt/fonts/"),
      italics: expect.stringContaining("/_nuxt/fonts/"),
      bolditalics: expect.stringContaining("/_nuxt/fonts/"),
    });
    expect(JSON.stringify(manifest)).not.toContain("base64");
  });

  it("generates a server PDF with the resolved family", async () => {
    const pdf = await $fetch<ArrayBuffer>("/_pdfmake/generate", {
      method: "POST",
      body: {
        docDefinition: {
          defaultStyle: { font: "Roboto" },
          content: [
            { text: "Nuxt Fonts regular" },
            { text: "Nuxt Fonts bold", bold: true },
            { text: "Nuxt Fonts italic", italics: true },
          ],
        },
      },
      responseType: "arrayBuffer",
    });

    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(1_000);
  });
});
