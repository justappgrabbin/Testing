# Morph OS · Coherent Unified Release

This package has one canonical runtime core and multiple entry points:

- **Canonical kernel:** `kernel/*`
- **CLI:** `morph-cli.js` -> `cli/morph-cli.js`
- **Browser:** `index.html` / `browser/morph-system.html`
- **Admin bridge:** `bridge/admin`, consuming `../../kernel`
- **Expo app:** `apps/TridentApp-Expo`

## Quick verification

```bash
npm run smoke
```

This checks structure, boots the kernel, runs the CLI test suite, and verifies that the admin bridge points at the canonical kernel.

## Browser runtime

Open:

```txt
index.html
```

## Node CLI / kernel

```bash
npm run init
npm run test
npm run cli:pipeline
npm run kernel:boot
```

## Admin bridge

```bash
npm run admin:install
npm run admin:check
npm run admin:start
```

Then open:

```txt
http://localhost:8787/admin/morph
```

## Expo app

```bash
npm run expo:install
npm run expo:start
```

The Expo app is intentionally a separate mobile client. It does not pretend to be the browser runtime or Node kernel.

## Architecture lock

Kernel files live in `kernel/` only. Root files are shims for command convenience. The admin bridge imports the canonical kernel instead of carrying a private fork. Runtime memory defaults to `memory/` at repo root and can be overridden with `MORPH_MEMORY_DIR`.
