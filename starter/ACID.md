---
cssclasses: ["wg-nota"]
en: "ACID"
es: "ACID (atomicidad, consistencia, aislamiento, durabilidad)"
aliases: ["ACID (atomicidad, consistencia, aislamiento, durabilidad)"]
dominio: "04 · Datos y bases de datos"
simple_es: "Son cuatro garantías que hacen confiable una transacción en una base de datos: se completa entera o nada, deja los datos válidos, no se mezcla con otras y, una vez confirmada, no se pierde."
tecnica_es: "Atomicidad, Consistencia, Aislamiento y Durabilidad: garantías de una transacción."
simple_en: "Four guarantees that make a database transaction reliable: it completes entirely or not at all, leaves the data valid, does not mix with others and, once confirmed, is not lost."
tecnica_en: "Atomicity, Consistency, Isolation and Durability: the guarantees of a transaction."
ejemplo_es: "Postgres cumple ACID, así que el saldo no queda a medias."
ejemplo_en: "Postgres is ACID-compliant, so a balance is never left half-updated."
ver_tambien: [157, 159, 168]
n: 158
verificar: false
---
# ACID · ACID (atomicidad, consistencia, aislamiento, durabilidad)

**En simple.** Son cuatro garantías que hacen confiable una transacción en una base de datos: se completa entera o nada, deja los datos válidos, no se mezcla con otras y, una vez confirmada, no se pierde.

**Técnica.** Atomicidad, Consistencia, Aislamiento y Durabilidad: garantías de una transacción.

**Ejemplo de uso.** _Postgres cumple ACID, así que el saldo no queda a medias._

---

**In simple.** Four guarantees that make a database transaction reliable: it completes entirely or not at all, leaves the data valid, does not mix with others and, once confirmed, is not lost.

**Technical.** Atomicity, Consistency, Isolation and Durability: the guarantees of a transaction.

**Example.** _Postgres is ACID-compliant, so a balance is never left half-updated._

**Ver también.** [[Transaction|Transaction ↔ Transacción]] · [[Rollback (DB)|Rollback (DB) ↔ Reversión (base de datos)]] · [[Eventual Consistency|Eventual Consistency ↔ Consistencia eventual]]
