---
en: "Deadlock"
es: "Interbloqueo"
aliases: ["Interbloqueo"]
dominio: "04 · Datos y bases de datos"
simple_es: "Ninguna avanza y la base mata una."
tecnica_es: "Bloqueo mutuo donde dos transacciones se esperan entre sí."
simple_en: "Neither moves forward and the database kills one."
tecnica_en: "A mutual lock where two transactions wait for each other."
ejemplo_es: "El interbloqueo canceló una de las dos transacciones."
ejemplo_en: "The deadlock cancelled one of the two transactions."
ver_tambien: [166, 157]
n: 167
verificar: false
---
# Deadlock · Interbloqueo

**En simple.** Ninguna avanza y la base mata una.

**Técnica.** Bloqueo mutuo donde dos transacciones se esperan entre sí.

**Ejemplo de uso.** _El interbloqueo canceló una de las dos transacciones._

---

**In simple.** Neither moves forward and the database kills one.

**Technical.** A mutual lock where two transactions wait for each other.

**Example.** _The deadlock cancelled one of the two transactions._

**Ver también.** [[Race Condition|Race Condition ↔ Condición de carrera]] · [[Transaction|Transaction ↔ Transacción]]
