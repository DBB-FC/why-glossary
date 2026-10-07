# Security

*English · [Leer en español](SECURITY.es.md)*

## Reporting a vulnerability

Open a [private security advisory](https://github.com/DBB-FC/why-glossary-bilingual/security/advisories/new)
on this repository. Please do not open a public issue for a vulnerability.

Expect a first answer within a week. There is no bounty programme.

## What the plugin does with your data

- **It makes no network request at all.** No telemetry, no analytics, no account, no server, no AI
  provider and no API key.
- It reads and writes only the notes inside its own folder (`Why Glossary/` by default) and its own
  `data.json`.
- The base glossary is bundled inside `main.js`; installing it writes notes into that folder and
  never overwrites a note you edited.
- Your study history and the cards you missed are stored in the plugin's own settings file, which
  stays in your vault.
- Term notes are plain markdown. Text from a note is rendered as text, not as HTML.
