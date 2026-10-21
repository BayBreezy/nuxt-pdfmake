import { defineEventHandler, setHeader } from "h3";

import { useRuntimeConfig } from "#imports";
import { nuxtFontClientManifest } from "#pdfmake-nuxt-fonts";

type BadgeVariant = "default" | "secondary" | "outline";

interface FontRow {
  family: string;
  source: string;
  variant: BadgeVariant;
  details: string;
  impact: string;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** `woff · normal, bold, italics, bolditalics` for a Nuxt Fonts descriptor. */
function describeNuxtFont(descriptor: Record<string, unknown>) {
  const slots = Object.entries(descriptor).filter(([, url]) => typeof url === "string");
  const formats = new Set(
    slots.map(([, url]) => {
      const path = String(url).split(/[?#]/)[0] ?? "";
      return path.slice(path.lastIndexOf(".") + 1).toLowerCase();
    }),
  );
  return `${[...formats].join(", ")} · ${slots.map(([slot]) => slot).join(", ")}`;
}

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
  const nuxtFontsEnabled = dt.nuxtFonts === true;
  const fontSizesKB = (dt.fontSizesKB as Record<string, number>) ?? {};
  const embeddedKB: number = (dt.embeddedKB as number) ?? (dt.estimatedKB as number) ?? 0;
  const useDefaultRoboto: boolean = (dt.useDefaultRoboto as boolean) ?? true;
  const apiEnabled: boolean = (dt.apiEnabled as boolean) ?? false;
  const googleFontSet = new Set(googleFonts);
  const fallbackEmbeddedKB = Math.round(embeddedKB / Math.max(embedded.length, 1));

  // The families @nuxt/fonts resolves aren't known when runtimeConfig is built, so read the
  // generated manifest, the same data the client and server register for PDFs.
  const nuxtFonts = nuxtFontsEnabled ? Object.entries(nuxtFontClientManifest.fonts) : [];

  const rows: FontRow[] = [
    ...embedded.map((family) => ({
      family,
      source: googleFontSet.has(family) ? "Google" : "Embedded",
      variant: "secondary" as const,
      details: "base64 in bundle",
      impact: `${fontSizesKB[family] ?? fallbackEmbeddedKB} KB`,
    })),
    ...cdn.map((family) => ({
      family,
      source: "CDN",
      variant: "outline" as const,
      details: "fetched when a PDF is created",
      impact: "—",
    })),
    ...googleFonts
      .filter((family) => !embedded.includes(family))
      .map((family) => ({
        family,
        source: "Google",
        variant: "secondary" as const,
        details: "—",
        impact: "—",
      })),
    ...nuxtFonts.map(([family, descriptor]) => ({
      family,
      source: "Nuxt Fonts",
      variant: "default" as const,
      details: describeNuxtFont(descriptor as Record<string, unknown>),
      impact: "Runtime asset",
    })),
    ...(useDefaultRoboto
      ? [
          {
            family: "Roboto",
            source: "Default",
            variant: "outline" as const,
            details: "bundled with pdfmake",
            impact: "—",
          },
        ]
      : []),
  ];

  const fontRows = rows
    .map(
      (row) =>
        `<tr><td class="font-medium">${escapeHtml(row.family)}</td><td><span class="badge badge-${row.variant}">${row.source}</span></td><td class="muted">${escapeHtml(row.details)}</td><td class="muted">${row.impact}</td></tr>`,
    )
    .join("\n");

  const familyNames = [...new Set(rows.map((row) => row.family))];
  const familyOptions = familyNames
    .map((family) => `<option value="${escapeHtml(family)}">${escapeHtml(family)}</option>`)
    .join("");
  // Safe to embed in a <script> block: "<" can't end the tag, U+2028/9 can't end the string
  const familiesJson = JSON.stringify(familyNames)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  const emptyHint =
    nuxtFontsEnabled && nuxtFonts.length === 0
      ? `<p class="muted note"><code>fonts.nuxtFonts</code> is on, but <code>@nuxt/fonts</code> has not resolved any families yet. Mark PDF-only families with <code>global: true</code> and restart the dev server.</p>`
      : "";

  setHeader(event, "Content-Type", "text/html; charset=utf-8");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <title>PDFMake DevTools</title>
  <style>
    /* shadcn/ui "zinc" theme tokens */
    :root {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%;
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --accent: 240 4.8% 95.9%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 240 10% 3.9%;
      --radius: 0.5rem;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --background: 240 10% 3.9%;
        --foreground: 0 0% 98%;
        --card: 240 10% 3.9%;
        --card-foreground: 0 0% 98%;
        --primary: 0 0% 98%;
        --primary-foreground: 240 5.9% 10%;
        --secondary: 240 3.7% 15.9%;
        --secondary-foreground: 0 0% 98%;
        --muted: 240 3.7% 15.9%;
        --muted-foreground: 240 5% 64.9%;
        --accent: 240 3.7% 15.9%;
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 0 0% 98%;
        --border: 240 3.7% 15.9%;
        --input: 240 3.7% 15.9%;
        --ring: 240 4.9% 83.9%;
      }
    }

    *, *::before, *::after { box-sizing: border-box; border-color: hsl(var(--border)); }
    body {
      margin: 0;
      padding: 24px;
      max-width: 960px;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.5;
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      -webkit-font-smoothing: antialiased;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      background: hsl(var(--muted));
      padding: 1px 5px;
      border-radius: calc(var(--radius) - 4px);
    }
    h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em; }
    .muted { color: hsl(var(--muted-foreground)); }
    .meta { margin: 4px 0 24px; font-size: 14px; }

    .card {
      margin-bottom: 24px;
      background: hsl(var(--card));
      color: hsl(var(--card-foreground));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
    .card-header { padding: 20px 24px 0; }
    .card-title { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.025em; }
    .card-description { margin: 4px 0 0; font-size: 14px; color: hsl(var(--muted-foreground)); }
    .card-content { padding: 20px 24px 24px; }

    .table-wrap { border: 1px solid hsl(var(--border)); border-radius: calc(var(--radius) - 2px); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th {
      height: 40px; padding: 0 16px; text-align: left; vertical-align: middle;
      font-weight: 500; color: hsl(var(--muted-foreground));
      border-bottom: 1px solid hsl(var(--border));
    }
    td { padding: 12px 16px; vertical-align: middle; border-bottom: 1px solid hsl(var(--border)); }
    tbody tr:last-child td { border-bottom: 0; }
    tbody tr:hover { background: hsl(var(--muted) / 0.5); }
    .font-medium { font-weight: 500; }
    .note { margin: 12px 0 0; font-size: 13px; }

    .badge {
      display: inline-flex; align-items: center;
      padding: 2px 10px; border-radius: 9999px;
      border: 1px solid transparent;
      font-size: 12px; font-weight: 600; line-height: 16px; white-space: nowrap;
    }
    .badge-default { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
    .badge-secondary { background: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); }
    .badge-outline { color: hsl(var(--foreground)); border-color: hsl(var(--border)); }

    label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; line-height: 1; }
    .field { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .field label { margin: 0; white-space: nowrap; }
    select {
      height: 40px; min-width: 220px; padding: 0 12px; font: inherit;
      color: hsl(var(--foreground)); background: transparent;
      border: 1px solid hsl(var(--input)); border-radius: calc(var(--radius) - 2px);
    }
    select option { background: hsl(var(--background)); color: hsl(var(--foreground)); }
    select:focus-visible { outline: 2px solid hsl(var(--ring)); outline-offset: 2px; }
    textarea {
      display: block; width: 100%; min-height: 160px; padding: 8px 12px; resize: vertical;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px;
      color: hsl(var(--foreground)); background: transparent;
      border: 1px solid hsl(var(--input)); border-radius: calc(var(--radius) - 2px);
    }
    textarea:focus-visible, button:focus-visible {
      outline: 2px solid hsl(var(--ring)); outline-offset: 2px;
    }
    button {
      display: inline-flex; align-items: center; justify-content: center;
      height: 40px; margin-top: 16px; padding: 0 16px; cursor: pointer;
      font: inherit; font-weight: 500;
      color: hsl(var(--primary-foreground)); background: hsl(var(--primary));
      border: 0; border-radius: calc(var(--radius) - 2px);
      transition: background-color .15s;
    }
    button:hover { background: hsl(var(--primary) / 0.9); }
    button:disabled { opacity: .5; pointer-events: none; }

    #pdf-frame {
      width: 100%; height: 480px; margin-top: 16px; background: #fff;
      border: 1px solid hsl(var(--border)); border-radius: calc(var(--radius) - 2px);
    }
    #error { margin-top: 12px; font-size: 13px; color: hsl(var(--destructive)); white-space: pre-wrap; }
    .alert {
      padding: 12px 16px; font-size: 14px;
      border: 1px solid hsl(var(--border)); border-radius: calc(var(--radius) - 2px);
    }
    .alert-title { margin: 0 0 4px; font-weight: 500; line-height: 1; }
  </style>
</head>
<body>
  <h1>PDFMake</h1>
  <p class="meta muted">nuxt-pdfmake v1.0.0 — Font configuration &amp; PDF generator</p>

  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Registered fonts</h2>
      <p class="card-description">Families available to <code>createPdf</code> on the client and the server.</p>
    </div>
    <div class="card-content">
      ${
        rows.length === 0
          ? `<p class="muted">No fonts configured. Add <code>fonts</code> to your pdfmake module options.</p>${emptyHint}`
          : `<div class="table-wrap">
        <table>
          <thead><tr><th>Family</th><th>Source</th><th>Details</th><th>Bundle impact</th></tr></thead>
          <tbody>${fontRows}</tbody>
        </table>
      </div>
      ${embeddedKB > 0 ? `<p class="muted note">Total embedded: ${embeddedKB} KB</p>` : ""}
      ${emptyHint}`
      }
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Test generator</h2>
      <p class="card-description">Posts a document definition to <code>/_pdfmake/generate</code> and previews the result.</p>
    </div>
    <div class="card-content">
    ${
      !apiEnabled
        ? `<div class="alert"><p class="alert-title">API route disabled</p><p class="muted" style="margin:0">The <code>/_pdfmake/generate</code> route is disabled. Set <code>enableApiRoute: true</code> in module options to enable it.</p></div>`
        : `<div class="field">
          <label for="font">Font family</label>
          <select id="font"><option value="">Default (pdfmake)</option>${familyOptions}</select>
        </div>
        <label for="dd">Document definition (JSON)</label>
        <textarea id="dd" spellcheck="false">{
  "content": [
    { "text": "Hello from nuxt-pdfmake!", "fontSize": 22, "bold": true },
    { "text": "This PDF was generated on the server via Nitro.", "margin": [0, 12, 0, 0] },
    { "text": "Regular, " },
    { "text": "bold, ", "bold": true },
    { "text": "italic and ", "italics": true },
    { "text": "bold italic.", "bold": true, "italics": true }
  ]
}</textarea>
        <button id="gen-btn">Generate PDF</button>
        <div id="error"></div>
        <iframe id="pdf-frame" style="display:none"></iframe>
        <script>
          const families = ${familiesJson};
          const fontSelect = document.getElementById('font');
          const docInput = document.getElementById('dd');

          // Picking a family writes it to defaultStyle.font so the JSON stays the source of truth
          fontSelect.addEventListener('change', () => {
            const err = document.getElementById('error');
            try {
              const dd = JSON.parse(docInput.value);
              if (fontSelect.value) dd.defaultStyle = { ...dd.defaultStyle, font: fontSelect.value };
              else if (dd.defaultStyle) {
                delete dd.defaultStyle.font;
                if (!Object.keys(dd.defaultStyle).length) delete dd.defaultStyle;
              }
              docInput.value = JSON.stringify(dd, null, 2);
              err.textContent = '';
            } catch (e) {
              err.textContent = 'Fix the JSON before choosing a font: ' + e.message;
              fontSelect.value = '';
            }
          });

          // ...and typing a family into defaultStyle.font updates the picker
          docInput.addEventListener('input', () => {
            try {
              const font = JSON.parse(docInput.value).defaultStyle?.font;
              fontSelect.value = families.includes(font) ? font : '';
            } catch {}
          });

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
  </div>
</body>
</html>`;
});
