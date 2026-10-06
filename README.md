# Why Glossary

Bilingual **EN ↔ ES** pocket glossary for Obsidian. Search a term in either language and get a plain-words
definition, a technical one and an example, in both languages.

## What you get

- **392 ready-made terms** (technology, product and design, data, cloud, security, AI) installed on first run.
- **Add your own terms** — *Ingresá tus términos*: button in the glossary screen, command palette, or settings.
- Search in English or Spanish (accent-insensitive), A–Z browsing, domain filters.
- Hover definitions in reading mode, side panel, and a study mode with flash cards.

Everything is stored as plain Markdown notes in your vault (`Why Glossary/` by default). Delete, edit or
move them like any other note. No network access, no account.

## Install

Once approved: *Settings → Community plugins → Browse → Why Glossary*.
Manual: copy `main.js`, `manifest.json` and `styles.css` to `<vault>/.obsidian/plugins/why-glossary/`.

## Your own terms

Command **Ingresá tus términos**, or create a note in `Why Glossary/` with this frontmatter:

```yaml
---
en: "Chargeback"
es: "Contracargo"
dominio: "My terms"
simple_es: "…"
simple_en: "…"
---
```

## Develop

`npm install` · `npm test` · `npm run typecheck` · `npm run build`. The base glossary lives in `starter/`
and is bundled into `main.js` at build time.

## License

MIT
