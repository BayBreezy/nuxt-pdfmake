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

## Key files

| Path                                    | Purpose                                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/module.ts`                         | Module entry — options, async font processing, virtual module generation, plugin/handler registration |
| `src/runtime/pdfmake.client.ts`         | Client plugin — imports pdfmake from npm, registers embedded fonts                                    |
| `src/runtime/pdfmake.server.ts`         | Nitro plugin — registers embedded fonts for server-side use                                           |
| `src/runtime/composables/usePDFMake.ts` | Client composable (`null` on server)                                                                  |
| `src/runtime/server/utils/pdfmake.ts`   | Server utilities: `useServerPDFMake`, `createPDFBuffer`, `createPDFBase64`                            |
| `src/runtime/server/routes/pdf.ts`      | Pre-built `POST /_pdfmake/generate` handler                                                           |
| `src/runtime/devtools/handler.ts`       | DevTools UI served at `/_pdfmake/devtools`                                                            |
| `docs/` | Documentation site (Nuxt Content, own `package.json` + `bun.lock`); loads the module from `../src/module` |

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

- **[oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)** — formatter (`bun run fmt` → `oxfmt`, `bun run fmt:check`)
- **[oxlint](https://oxc.rs/docs/guide/usage/linter.html)** — linter (`bun run lint` → `oxlint src/ test/`)
- **lint-staged** — runs both on staged files before each commit (configured in `package.json`)
- **commitlint** — conventional commit messages enforced by `.husky/commit-msg`
- Pre-commit hook: `.husky/pre-commit` runs `bunx lint-staged`

## Repo layout

The module lives at the repo root (`src/`, `test/`, `dist/` when built). `docs/` is a separate Bun project with its own `package.json` and `bun.lock`; it is the docs site and the local dev app, and imports the module straight from `../src/module`. Root `bun install` and `docs` `bun install` are independent. Run everything from the repo root.

## Development

```bash
bun install
(cd docs && bun install)
bun run dev            # stub-build module + docs dev server
bun run dev:prepare    # stub-build module + generate .nuxt types (root and docs)
bun run test           # vitest
bun run test:types     # vue-tsc --noEmit
bun run lint           # oxlint
bun run fmt            # oxfmt
bun run fmt:check      # oxfmt --check
bun run prepack        # build module dist/
bun run dev:build      # build the docs site only (SSR build, not what Netlify deploys)
bun run dev:preview    # generate the static docs (what Netlify deploys) and serve them locally
bun run netlify        # full Netlify build: install, stub build, module build, static docs generate
bun run clean          # delete node_modules/.nuxt/lockfiles, then reinstall
bun run release        # lint + fmt:check + test + build, then changelogen --release + npm publish + git push --follow-tags
```

## Deployment

Docs deploy to Netlify via [netlify.toml](./netlify.toml) (`base = "docs"`, command `cd .. && bun run netlify`, publish `dist`; the docs are generated statically, so no Netlify function is needed).

## License

MIT — see [LICENSE.md](./LICENSE.md)
