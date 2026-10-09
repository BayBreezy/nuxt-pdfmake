# Contributing

Thanks for helping improve `nuxt-pdfmake`.

## Setup

Use Bun from the repository root:

```sh
bun install
(cd docs && bun install)
bun run dev
```

The module lives at the repo root (`src/`, `test/`). `docs/` is the documentation site and doubles as the local dev app; it loads the module from `../src/module` and has its own `package.json` and lockfile.

## Development

All commands run from the repository root:

```sh
bun run dev            # stub-build the module, then start the docs dev server
bun run test           # vitest
bun run test:types     # vue-tsc
bun run lint           # oxlint
bun run fmt            # oxfmt
bun run fmt:check      # oxfmt --check
bun run prepack        # build module dist/
bun run dev:build      # build the docs site
bun run dev:preview    # generate the static docs and serve them locally
bun run clean          # wipe node_modules/.nuxt/lockfiles and reinstall
```

## Pull Requests

Keep changes focused. Include tests or docs when behavior changes. Before opening a PR, run:

```sh
bun run lint && bun run fmt:check && bun run test && bun run test:types
```

Use Conventional Commit style for commit messages when practical, for example `feat: add server utility` or `fix: register fonts in nitro`.

## Releases

Releases are cut locally from `main` with Changelogen:

```sh
bun run release
```

This lints, checks formatting, runs the tests, builds the module, then runs `changelogen --release` (bumps the version, updates `CHANGELOG.md`, commits and tags), `npm publish` and `git push --follow-tags`.
