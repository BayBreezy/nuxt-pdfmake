# Nuxt PDFMake

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Easily add <a target="_blank" href="http://pdfmake.org/#/">pdfMake</a> to your Nuxt 3 application.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  <!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-pdfmake?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Documentation

See the documentation here: [Nuxt PDFMake](https://nuxt-pdfmake.behonbaker.com/)

## Quick Setup

1. Add `nuxt-pdfmake` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-pdfmake

# Using yarn
yarn add --dev nuxt-pdfmake

# Using npm
npm install --save-dev nuxt-pdfmake
```

2. Add `nuxt-pdfmake` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["nuxt-pdfmake"],
});
```

That's it! You can now use Nuxt PDFMake in your Nuxt app ✨.

## Usage

You can use the `$pdfMake` variable inside a function

```ts
const { $pdfMake } = useNuxtApp();
```

Or you can use the `usePDFMake` composable

```ts
const pdfMake = usePDFMake();
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
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
