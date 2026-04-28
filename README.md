# Nuxt PDFMake

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Easily add <a target="_blank" href="http://pdfmake.org/#/">pdfMake</a> to your Nuxt application.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [📖 &nbsp;Documentation](https://nuxt-pdfmake.behonbaker.com/)

## Features

- `usePDFMake` composable auto-imported on the client
- Server-side PDF generation via `createPDFBuffer`, `createPDFBase64`, and `useServerPDFMake`
- Pre-built `POST /_pdfmake/generate` API endpoint (dev only by default)
- Font management — embed custom fonts, load Google Fonts at build time, or reference CDN URLs
- Nuxt DevTools panel to inspect fonts and module config

## Quick Setup

```bash
# Using bun
bun add -D nuxt-pdfmake

# Using pnpm
pnpm add -D nuxt-pdfmake

# Using yarn
yarn add --dev nuxt-pdfmake

# Using npm
npm install --save-dev nuxt-pdfmake
```

Add `nuxt-pdfmake` to the `modules` section of `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-pdfmake"],
});
```

That's it! You can now use Nuxt PDFMake in your Nuxt app ✨

## Usage

### Client-side

Use the auto-imported `usePDFMake` composable inside a Vue component:

```ts
const pdfMake = usePDFMake();

const doc = pdfMake!.createPdf({ content: ["Hello, world!"] });
doc.open(); // opens in a new browser tab
doc.download("my-file.pdf");
```

Or access the instance directly via the Nuxt app plugin:

```ts
const { $pdfMake } = useNuxtApp();
```

### Server-side (Nitro handlers)

Use the server utilities inside `server/api/` or `server/routes/`:

```ts
// server/api/report.get.ts
export default defineEventHandler(async (event) => {
  const buffer = await createPDFBuffer({ content: ["Hello from the server!"] });
  setHeader(event, "Content-Type", "application/pdf");
  return buffer;
});
```

| Utility | Returns | Description |
|---|---|---|
| `createPDFBuffer(docDefinition)` | `Promise<Buffer>` | Generate a PDF as a Node.js Buffer |
| `createPDFBase64(docDefinition)` | `Promise<string>` | Generate a PDF as a base64 string |
| `useServerPDFMake()` | pdfmake instance | Access the raw server-side pdfmake instance |

### Pre-built API endpoint

A `POST /_pdfmake/generate` endpoint is included and enabled in development. Send a `docDefinition` in the request body to receive a PDF:

```ts
const { data } = await useFetch("/_pdfmake/generate", {
  method: "POST",
  body: { docDefinition: { content: ["Hello, PDF!"] } },
  responseType: "blob",
});
```

> To enable in production, set `enableApiRoute: true` in your module options and add your own auth middleware.

## Font Configuration

Configure fonts via the `pdfmake` key in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-pdfmake"],
  pdfmake: {
    fonts: {
      // Local font files (embedded as base64 at build time — ~270 KB per variant)
      custom: {
        MyFont: {
          normal: "assets/fonts/MyFont-Regular.ttf",
          bold: "assets/fonts/MyFont-Bold.ttf",
        },
      },

      // Google Fonts downloaded and cached at build time (~1 MB per family)
      googleFonts: ["Roboto", "Lato"],

      // CDN/HTTP URLs fetched at PDF-creation time
      cdn: {
        OpenSans: {
          normal: "https://fonts.example.com/OpenSans-Regular.ttf",
        },
      },

      // Set to false to opt out of the default Roboto font
      useDefaultRoboto: true,
    },
  },
});
```

> When no fonts are configured, the default Roboto font from the pdfmake CDN is used automatically.

## Module Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Enable or disable the module |
| `enableComposable` | `boolean` | `true` | Auto-import `usePDFMake` and server utilities |
| `enableDevtools` | `boolean` | `true` | Show the PDFMake panel in Nuxt DevTools |
| `enableApiRoute` | `boolean` | `true` (dev only) | Expose `POST /_pdfmake/generate` |
| `fonts.custom` | `Record<string, TFontFamilyTypes>` | — | Local font files embedded at build time |
| `fonts.googleFonts` | `string[]` | — | Google Font family names fetched at build time |
| `fonts.cdn` | `Record<string, TFontFamilyTypes>` | — | CDN font URLs passed directly to pdfmake |
| `fonts.useDefaultRoboto` | `boolean` | `true` (when no fonts set) | Include pdfmake's default Roboto CDN font |

## Development

```bash
# Install dependencies
bun install

# Generate type stubs
bun run dev:prepare

# Develop with the playground
bun run dev

# Build the playground
bun run dev:build

# Run linter
bun run lint

# Run tests
bun run test
bun run test:watch

# Build the module
bun run prepack

# Release a new version
bun run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-pdfmake/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-pdfmake
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-pdfmake.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-pdfmake
[license-src]: https://img.shields.io/npm/l/nuxt-pdfmake.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-pdfmake
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
