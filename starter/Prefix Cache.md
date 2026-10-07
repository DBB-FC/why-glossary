---
en: "Prefix Cache"
es: "Caché de prefijo"
aliases: ["Caché de prefijo"]
dominio: "12 · Agentes de IA, MCP y economía de tokens"
simple_es: "Es la parte inicial de lo que se envía al modelo que ya fue procesada y se guarda para reutilizarla entre llamadas. Un contexto grande y estable se vuelve barato."
tecnica_es: "Caché del prefijo ya procesado, reutilizable entre llamadas."
simple_en: "The initial part of what is sent to the model that has already been processed and is stored for reuse between calls. A large, stable context becomes cheap."
tecnica_en: "A cache of the already-processed prefix, reusable across calls."
ejemplo_es: "El caché de prefijo abarató el contexto del manual."
ejemplo_en: "The prefix cache made the manual's context cheaper."
ver_tambien: [399, 433, 434]
n: 432
verificar: false
---
# Prefix Cache · Caché de prefijo

**En simple.** Es la parte inicial de lo que se envía al modelo que ya fue procesada y se guarda para reutilizarla entre llamadas. Un contexto grande y estable se vuelve barato.

**Técnica.** Caché del prefijo ya procesado, reutilizable entre llamadas.

**Ejemplo de uso.** _El caché de prefijo abarató el contexto del manual._

---

**In simple.** The initial part of what is sent to the model that has already been processed and is stored for reuse between calls. A large, stable context becomes cheap.

**Technical.** A cache of the already-processed prefix, reusable across calls.

**Example.** _The prefix cache made the manual's context cheaper._

**Ver también.** [[Prompt Caching|Prompt Caching ↔ Caché de instrucciones]] · [[Cache Hit - Miss|Cache Hit / Miss ↔ Acierto / fallo de caché]] · [[Cache TTL|Cache TTL ↔ Tiempo de vida del caché]]
