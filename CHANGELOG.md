# Changelog · Historial de cambios

Format: [Keep a Changelog](https://keepachangelog.com). Versions follow the release tags.
*Formato Keep a Changelog; las versiones son las etiquetas de cada release.*

## 0.1.6 — 2026-10-09

- **Mobile / Móvil:** the main screen scrolls on phones and the header stacks (title, full-width add button, language toggle). *La pantalla principal se desplaza en el celular y la cabecera se apila.*
- **Settings / Ajustes:** declarative settings API (Obsidian 1.13+), with the classic panel kept as fallback. *API declarativa de ajustes, con el panel clásico como respaldo.*
- **Review fixes / Revisión de Obsidian:** no `!important`, no `builtin-modules` dependency. *Sin `!important` y sin la dependencia `builtin-modules`.*
- **Release:** built in GitHub Actions with signed build-provenance attestation for `main.js`, `manifest.json` and `styles.css`. *Release construido en Actions con atestación de procedencia.*

## 0.1.5 — 2026-10-07

- Repository renamed to `why-glossary-bilingual`; dev-only `moment` override (Dependabot #1). *Repo renombrado; override de `moment` (solo desarrollo).*

## 0.1.4 — 2026-10-07

- New plugin id `why-glossary-bilingual`. *Nuevo id del plugin.*
- Repo hygiene: CI, issue/PR templates, official Obsidian ESLint. *Higiene: CI, plantillas y linter oficial.*

## 0.1.3 — 2026-10-07

- Removed the `setViewState` monkey-patch and diagnostic notices. *Se quita el monkey-patch de `setViewState` y los avisos de diagnóstico.*

## 0.1.2 — 2026-10-06

- Whole-app language: the EN/ES toggle translates the interface and the domains. *El botón EN/ES traduce toda la interfaz y los dominios.*
- Term card: single paint, faster open, better button contrast, `wg-nota` note style. *Tarjeta del término más rápida y con mejor contraste.*

## 0.1.1 — 2026-10-06

- Passes the official Obsidian linter; adds `versions.json`; plain-words definitions rewritten. *Pasa el linter oficial; definiciones «En simple» reescritas.*

## 0.1.0 — 2026-10-06

- First release: ~400 bilingual terms, A–Z screen, preview, hover cards, study mode, add your own terms. *Primera versión.*
