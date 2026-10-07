---
cssclasses: ["wg-nota"]
en: "Rollback (DB)"
es: "Reversión (base de datos)"
aliases: ["Rollback (BD)", "Reversión (base de datos)"]
dominio: "04 · Datos y bases de datos"
simple_es: "Es deshacer una transacción de la base de datos antes de confirmarla, para que no quede nada a medias. No es lo mismo que el rollback de un despliegue, que vuelve una versión."
tecnica_es: "Reversión de una transacción antes de confirmarla."
simple_en: "Undoing a database transaction before it is confirmed, so nothing is left half done. It is not the same as a deployment rollback, which returns a version."
tecnica_en: "Reversal of a transaction before it is committed."
ejemplo_es: "Ante el error, la base hizo rollback de la transacción."
ejemplo_en: "On the error, the database rolled the transaction back."
ver_tambien: [157, 158]
n: 159
verificar: false
---
# Rollback (DB) · Reversión (base de datos)

**En simple.** Es deshacer una transacción de la base de datos antes de confirmarla, para que no quede nada a medias. No es lo mismo que el rollback de un despliegue, que vuelve una versión.

**Técnica.** Reversión de una transacción antes de confirmarla.

**Ejemplo de uso.** _Ante el error, la base hizo rollback de la transacción._

---

**In simple.** Undoing a database transaction before it is confirmed, so nothing is left half done. It is not the same as a deployment rollback, which returns a version.

**Technical.** Reversal of a transaction before it is committed.

**Example.** _On the error, the database rolled the transaction back._

**Ver también.** [[Transaction|Transaction ↔ Transacción]] · [[ACID|ACID ↔ ACID (atomicidad, consistencia, aislamiento, durabilidad)]]
