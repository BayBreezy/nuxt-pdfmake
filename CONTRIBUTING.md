# Contributing

Thanks for helping improve `nuxt-pdfmake`.

## Setup

Use Bun from the repository root:

```sh
bun install
bun run dev:prepare
```

The repo is a Bun workspace:

- `module` is the publishable Nuxt module package.
- `playground` is the local development app.
- `docs` is the documentation app.

## Development

Common commands:

```sh
bun run dev          # playground
bun run dev:docs     # docs app
bun run test         # vitest
bun run lint         # oxlint
bun run format       # oxfmt
bun run validate     # format check, lint, test, module build
```

Dependencies shared by workspaces should be versioned through the root `workspaces.catalog` field and referenced with `catalog:` in package manifests.

## Pull Requests

Keep changes focused. Include tests or docs when behavior changes. Before opening a PR, run:

```sh
bun run validate
```

Use Conventional Commit style for commit messages when practical, for example `feat: add server utility` or `fix: register fonts in nitro`.

## Releases

Releases are handled from the `module` workspace with Changelogen and Bun:

```sh
bun run release
```

Changelogen updates the root `CHANGELOG.md` and `module/package.json`. `bun publish` is used for npm publishing because it resolves `catalog:` dependencies before packing.
