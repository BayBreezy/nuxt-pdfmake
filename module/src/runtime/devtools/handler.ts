import { defineEventHandler, setHeader } from "h3";

import { useRuntimeConfig } from "#imports";

/**
 * Serves the PDFMake DevTools UI at /_pdfmake/devtools.
 * Self-contained HTML page that communicates with the /_pdfmake/generate
 * endpoint and displays font configuration.
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const dt = (config.pdfmakeDevtools as Record<string, unknown>) ?? {};

  const embedded: string[] = (dt.embedded as string[]) ?? [];
  const cdn: string[] = (dt.cdn as string[]) ?? [];
  const googleFonts: string[] = (dt.googleFonts as string[]) ?? [];
  const fontSizesKB = (dt.fontSizesKB as Record<string, number>) ?? {};
  const embeddedKB: number = (dt.embeddedKB as number) ?? (dt.estimatedKB as number) ?? 0;
  const useDefaultRoboto: boolean = (dt.useDefaultRoboto as boolean) ?? true;
  const apiEnabled: boolean = (dt.apiEnabled as boolean) ?? false;
  const googleFontSet = new Set(googleFonts);
  const fallbackEmbeddedKB = Math.round(embeddedKB / Math.max(embedded.length, 1));

  const fontRows = [
    ...embedded.map(
      (f) =>
        `<tr><td>${f}</td><td><span class="badge ${googleFontSet.has(f) ? "google" : "embedded"}">${googleFontSet.has(f) ? "Google" : "Embedded"}</span></td><td>${fontSizesKB[f] ?? fallbackEmbeddedKB} KB</td></tr>`,
    ),
    ...cdn.map(
      (f) => `<tr><td>${f}</td><td><span class="badge cdn">CDN</span></td><td>—</td></tr>`,
    ),
    ...googleFonts
      .filter((f) => !embedded.includes(f))
      .map(
        (f) => `<tr><td>${f}</td><td><span class="badge google">Google</span></td><td>—</td></tr>`,
      ),
    useDefaultRoboto
      ? `<tr><td>Roboto</td><td><span class="badge cdn">Default CDN</span></td><td>—</td></tr>`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const noFonts =
    embedded.length === 0 && cdn.length === 0 && googleFonts.length === 0 && !useDefaultRoboto;

  setHeader(event, "Content-Type", "text/html; charset=utf-8");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PDFMake DevTools</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      background: #0f0f10;
      color: #e4e4e7;
      padding: 24px;
      line-height: 1.5;
    }
    h1 { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: #f4f4f5; }
    h2 { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: .05em; }
    .section { margin-bottom: 28px; }
    .meta { color: #71717a; font-size: 12px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-weight: 500; color: #a1a1aa; font-size: 12px; padding: 6px 10px; border-bottom: 1px solid #27272a; }
    td { padding: 8px 10px; border-bottom: 1px solid #1c1c1e; }
    tr:last-child td { border-bottom: none; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: 500; }
    .badge.embedded { background: #1e3a5f; color: #60a5fa; }
    .badge.cdn { background: #1a2e22; color: #4ade80; }
    .badge.google { background: #2e1a2e; color: #c084fc; }
    .empty { color: #52525b; font-style: italic; padding: 12px 0; }
    label { display: block; margin-bottom: 6px; font-size: 12px; color: #a1a1aa; font-weight: 500; }
    textarea {
      width: 100%; height: 160px; background: #18181b; border: 1px solid #27272a;
      color: #e4e4e7; border-radius: 6px; padding: 10px; font-family: monospace;
      font-size: 13px; resize: vertical;
    }
    textarea:focus { outline: none; border-color: #3b82f6; }
    button {
      margin-top: 10px; padding: 8px 16px; background: #3b82f6; color: #fff;
      border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;
    }
    button:hover { background: #2563eb; }
    button:disabled { background: #27272a; color: #52525b; cursor: not-allowed; }
    #pdf-frame { width: 100%; height: 400px; border: 1px solid #27272a; border-radius: 6px; margin-top: 12px; background: #fff; }
    #error { color: #f87171; font-size: 12px; margin-top: 8px; }
    .warning { color: #fbbf24; background: #292218; border: 1px solid #3d2e00; border-radius: 6px; padding: 10px 14px; font-size: 12px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>🗒 PDFMake</h1>
  <p class="meta">nuxt-pdfmake v1.0.0 — Font configuration &amp; PDF generator</p>

  <div class="section">
    <h2>Registered Fonts</h2>
    ${
      noFonts
        ? `<p class="empty">No fonts configured. Add <code>fonts</code> to your pdfmake module options.</p>`
        : `<table>
          <thead><tr><th>Family</th><th>Source</th><th>Bundle Impact</th></tr></thead>
          <tbody>${fontRows}</tbody>
        </table>
        ${embeddedKB > 0 ? `<p style="margin-top:8px;font-size:12px;color:#71717a;">Total embedded: ${embeddedKB} KB</p>` : ""}`
    }
  </div>

  <div class="section">
    <h2>Test Generator</h2>
    ${
      !apiEnabled
        ? `<p class="warning">⚠ The <code>/_pdfmake/generate</code> API route is disabled. Set <code>enableApiRoute: true</code> in module options to enable it.</p>`
        : `<label for="dd">Document definition (JSON)</label>
        <textarea id="dd">{
  "content": [
    { "text": "Hello from nuxt-pdfmake!", "fontSize": 22, "bold": true },
    { "text": "This PDF was generated on the server via Nitro.", "margin": [0, 12, 0, 0] }
  ]
}</textarea>
        <button id="gen-btn">Generate PDF</button>
        <div id="error"></div>
        <iframe id="pdf-frame" style="display:none"></iframe>
        <script>
          document.getElementById('gen-btn').addEventListener('click', async () => {
            const btn = document.getElementById('gen-btn');
            const err = document.getElementById('error');
            const frame = document.getElementById('pdf-frame');
            err.textContent = '';
            btn.disabled = true;
            btn.textContent = 'Generating…';
            try {
              const dd = JSON.parse(document.getElementById('dd').value);
              const res = await fetch('/_pdfmake/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ docDefinition: dd }),
              });
              if (!res.ok) {
                const t = await res.text();
                throw new Error(t);
              }
              const blob = await res.blob();
              frame.src = URL.createObjectURL(blob);
              frame.style.display = 'block';
            } catch (e) {
              err.textContent = e.message;
            } finally {
              btn.disabled = false;
              btn.textContent = 'Generate PDF';
            }
          });
        </script>`
    }
  </div>
</body>
</html>`;
});
