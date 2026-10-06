---
en: "Rollback (DB)"
es: "Reversión (base de datos)"
aliases: ["Rollback (BD)", "Reversión (base de datos)"]
dominio: "04 · Datos y bases de datos"
simple_es: "Distinto del rollback de un despliegue: aquí se deshacen datos, no versiones."
tecnica_es: "Reversión de una transacción antes de confirmarla."
simple_en: "Unlike a deployment rollback: here data is undone, not versions."
tecnica_en: "Reversal of a transaction before it is committed."
ejemplo_es: "Ante el error, la base hizo rollback de la transacción."
ejemplo_en: "On the error, the database rolled the transaction back."
ver_tambien: [157, 158]
n: 159
verificar: false
---
# Rollback (DB) · Reversión (base de datos)

**En simple.** Distinto del rollback de un despliegue: aquí se deshacen datos, no versiones.

**Técnica.** Reversión de una transacción antes de confirmarla.

**Ejemplo de uso.** _Ante el error, la base hizo rollback de la transacción._

---

**In simple.** Unlike a deployment rollback: here data is undone, not versions.

**Technical.** Reversal of a transaction before it is committed.

**Example.** _On the error, the database rolled the transaction back._

**Ver también.** [[Transaction|Transaction ↔ Transacción]] · [[ACID|ACID ↔ ACID (atomicidad, consistencia, aislamiento, durabilidad)]]
