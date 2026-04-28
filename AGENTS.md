## Repo Overview

This repo is a [Nuxt Module](https://nuxt.com/docs/4.x/guide/modules/getting-started) (v1.0.0) that lets developers use [pdfmake](https://github.com/bpampuch/pdfmake) seamlessly in their Nuxt projects — on both the **client** and the **server (Nitro)**.

The module handles all the hard parts: font loading, VFS registration, and exposing a consistent API regardless of where the PDF is generated.

## What this module does

- **Universal PDF generation** — `usePDFMake()` works on the client; `createPDFBuffer()` / `createPDFBase64()` are auto-imported server utilities for Nitro route handlers.
- **Three font delivery modes** (configurable via `pdfmake` in `nuxt.config.ts`):
  - `fonts.custom` — local font files (TTF/OTF) resolved at build time and embedded as base64 in a virtual module (`#pdfmake-fonts`). Both client and server use the same embedded data.
  - `fonts.googleFonts` — Google Font family names downloaded and cached in `.nuxt/pdfmake-fonts-cache/` at build time, then embedded the same way as custom fonts.
  - `fonts.cdn` — raw CDN/HTTP URLs passed directly to pdfmake; fetched at PDF-creation time on the client. Server-side CDN font usage requires `setUrlAccessPolicy(() => true)`.
  - `fonts.useDefaultRoboto` — toggles the default Roboto font that ships with pdfmake (default: `true` when no other fonts are configured).
- **Pre-built API endpoint** — `POST /_pdfmake/generate` (enabled in dev by default; `enableApiRoute: true` to enable in production) accepts a `{ docDefinition }` JSON body and returns a PDF binary.
- **Nuxt DevTools panel** — accessible via the DevTools "PDFMake" tab; shows registered fonts, estimated bundle impact, and a live test PDF generator backed by the API endpoint.
- **Live playground editor** — `/_editor` route in the playground: split-pane JSON editor with real-time PDF preview.

## Key files

| Path                                    | Purpose                                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `module/src/module.ts`                         | Module entry — options, async font processing, virtual module generation, plugin/handler registration |
| `module/src/runtime/pdfmake.client.ts`         | Client plugin — imports pdfmake from npm, registers embedded fonts                                    |
| `module/src/runtime/pdfmake.server.ts`         | Nitro plugin — registers embedded fonts for server-side use                                           |
| `module/src/runtime/composables/usePDFMake.ts` | Client composable (`null` on server)                                                                  |
| `module/src/runtime/server/utils/pdfmake.ts`   | Server utilities: `useServerPDFMake`, `createPDFBuffer`, `createPDFBase64`                            |
| `module/src/runtime/server/routes/pdf.ts`      | Pre-built `POST /_pdfmake/generate` handler                                                           |
| `module/src/runtime/devtools/handler.ts`       | DevTools UI served at `/_pdfmake/devtools`                                                            |
| `playground/app/pages/editor.vue`       | Live split-pane PDF editor                                                                            |

## Virtual font module (`#pdfmake-fonts`)

Generated at build time into `.nuxt/pdfmake-fonts.mjs`. Exports:

- `fontVfs` — flat map of `{ "FamilyName-variant.ttf": "<base64>" }` for embedded fonts
- `fontDescriptors` — pdfmake font descriptor map `{ FamilyName: { normal, bold, italics, bolditalics } }`
- `cdnFonts` — CDN font descriptor map (passed through as-is)
- `useDefaultRoboto` — boolean

Both `pdfmake.client.ts` and `pdfmake.server.ts` import from this alias to keep font registration identical on both sides.

## Package Manager

- **Bun** is the package manager for this repo (`bun install`, `bun run <script>`).
- Use `bunx` to run local binaries (e.g. `bunx nuxi`, `bunx lint-staged`).

## Formatting & Linting

- **[oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)** — formatter (`bun run format` → `oxfmt --write .`)
- **[oxlint](https://oxc.rs/docs/guide/usage/linter.html)** — linter (`bun run lint` → `oxlint .`)
- **lint-staged** — runs both on staged files before each commit (configured in `package.json`)
- Pre-commit hook: `.husky/pre-commit` runs `bunx lint-staged`

## Development

```bash
bun install
bun run dev:prepare   # stub build + prepare playground
bun run dev           # start playground dev server
bun run test          # run vitest
bun run prepack       # build the module dist/
```

## License

MIT — see [LICENSE.md](./LICENSE.md)
