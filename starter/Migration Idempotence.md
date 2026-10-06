---
en: "Migration Idempotence"
es: "Idempotencia de migración"
aliases: ["Idempotencia de migración"]
dominio: "04 · Datos y bases de datos"
simple_es: "Poder correr una migración de base de datos varias veces sin errores ni duplicados."
tecnica_es: "Que aplicar la misma migración dos veces no rompa."
simple_en: "Being able to run a database migration several times without errors or duplicates."
tecnica_en: "Applying the same migration twice must not break anything."
ejemplo_es: "La migración es idempotente: la segunda vez no hace nada."
ejemplo_en: "The migration is idempotent: the second time it does nothing."
ver_tambien: [143, 128, 164]
n: 174
verificar: false
---
# Migration Idempotence · Idempotencia de migración

**En simple.** Poder correr una migración de base de datos varias veces sin errores ni duplicados.

**Técnica.** Que aplicar la misma migración dos veces no rompa.

**Ejemplo de uso.** _La migración es idempotente: la segunda vez no hace nada._

---

**In simple.** Being able to run a database migration several times without errors or duplicates.

**Technical.** Applying the same migration twice must not break anything.

**Example.** _The migration is idempotent: the second time it does nothing._

**Ver también.** [[Migration|Migration ↔ Migración]] · [[Deployment Idempotence|Deployment Idempotence ↔ Idempotencia de despliegue]] · [[Upsert|Upsert ↔ Insertar o actualizar (upsert)]]
