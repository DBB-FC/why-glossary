# Seguridad

*Español · [Read in English](SECURITY.md)*

## Reportar una vulnerabilidad

Abre un [aviso de seguridad privado](https://github.com/DBB-FC/why-glossary/security/advisories/new)
en este repositorio. Por favor, no abras un issue público por una vulnerabilidad.

La primera respuesta llega dentro de una semana. No hay programa de recompensas.

## Qué hace el plugin con tus datos

- **No hace ninguna llamada a la red.** Sin telemetría, sin analítica, sin cuenta, sin servidor, sin
  proveedor de IA y sin llave de API.
- Lee y escribe solo las notas dentro de su propia carpeta (`Why Glossary/` por defecto) y su propio
  `data.json`.
- El glosario base viene empaquetado dentro de `main.js`; al instalarlo se escriben notas en esa
  carpeta y nunca se sobrescribe una nota que editaste.
- Tu historial de estudio y las tarjetas que fallaste quedan en el archivo de ajustes del plugin,
  dentro de tu vault.
- Las notas de términos son markdown simple. El texto de una nota se muestra como texto, no como HTML.
