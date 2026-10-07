---
cssclasses: ["wg-nota"]
en: "Migration Idempotence"
es: "Idempotencia de migración"
aliases: ["Idempotencia de migración"]
dominio: "04 · Datos y bases de datos"
simple_es: "Es la propiedad de una migración que se puede ejecutar varias veces sin dar error ni duplicar datos: la segunda vez no cambia nada."
tecnica_es: "Que aplicar la misma migración dos veces no rompa."
simple_en: "The property of a migration that can be run several times without errors or duplicated data: the second time it changes nothing."
tecnica_en: "Applying the same migration twice must not break anything."
ejemplo_es: "La migración es idempotente: la segunda vez no hace nada."
ejemplo_en: "The migration is idempotent: the second time it does nothing."
ver_tambien: [143, 128, 164]
n: 174
verificar: false
---
# Migration Idempotence · Idempotencia de migración

**En simple.** Es la propiedad de una migración que se puede ejecutar varias veces sin dar error ni duplicar datos: la segunda vez no cambia nada.

**Técnica.** Que aplicar la misma migración dos veces no rompa.

**Ejemplo de uso.** _La migración es idempotente: la segunda vez no hace nada._

---

**In simple.** The property of a migration that can be run several times without errors or duplicated data: the second time it changes nothing.

**Technical.** Applying the same migration twice must not break anything.

**Example.** _The migration is idempotent: the second time it does nothing._

**Ver también.** [[Migration|Migration ↔ Migración]] · [[Deployment Idempotence|Deployment Idempotence ↔ Idempotencia de despliegue]] · [[Upsert|Upsert ↔ Insertar o actualizar (upsert)]]
