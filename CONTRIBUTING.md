# Contributing

*English · [Leer en español](CONTRIBUTING.es.md)*

Issues and pull requests are welcome. The plugin is MIT licensed, so you may also fork it
and do your own thing — no permission needed.

## Before you open a pull request

```bash
npm install
npm test            # builds a test bundle and runs the unit tests
npm run typecheck   # tsc --noEmit: it must stay at 0 errors
```

## Adding or fixing terms

The base glossary lives in `starter/`, one note per term, and is bundled into `main.js` at build
time. Only `en` and `es` are required; every other field is optional (see the YAML example in the
README). A few rules keep it useful:

- Write definitions that stand on their own, for a general audience. The plain version simplifies
  on purpose.
- Give both languages. If you are unsure of a translation, add `verificar: true` to the
  frontmatter instead of guessing.
- Do not overwrite a term someone may have edited: the plugin never replaces the user's notes, and
  neither should a change to the starter.

## What the plugin promises, and must keep promising

Three rules are the product. A change that weakens one of them will not be merged:

1. **No telemetry, no server, no network request.** The plugin reads and writes only the notes
   inside its own folder.
2. **Your notes are never overwritten.** Installing or restoring the base glossary adds what is
   missing and leaves your edits alone.
3. **Works on phones.** Use the Obsidian API only: no Node APIs, no inline styles.

## Conventions

- Keep the style of the surrounding code and comments.
- User-visible text comes in English and Spanish. Never a bare string.
- `src/` is the source. `main.js` at the root is the build output and is not committed; releases
  carry it.
