---
en: "Deadlock"
es: "Interbloqueo"
aliases: ["Interbloqueo"]
dominio: "04 · Datos y bases de datos"
simple_es: "Dos procesos se esperan mutuamente y ninguno avanza, hasta que la base cancela uno."
tecnica_es: "Bloqueo mutuo donde dos transacciones se esperan entre sí."
simple_en: "Two processes wait for each other and neither moves on, until the database cancels one."
tecnica_en: "A mutual lock where two transactions wait for each other."
ejemplo_es: "El interbloqueo canceló una de las dos transacciones."
ejemplo_en: "The deadlock cancelled one of the two transactions."
ver_tambien: [166, 157]
n: 167
verificar: false
---
# Deadlock · Interbloqueo

**En simple.** Dos procesos se esperan mutuamente y ninguno avanza, hasta que la base cancela uno.

**Técnica.** Bloqueo mutuo donde dos transacciones se esperan entre sí.

**Ejemplo de uso.** _El interbloqueo canceló una de las dos transacciones._

---

**In simple.** Two processes wait for each other and neither moves on, until the database cancels one.

**Technical.** A mutual lock where two transactions wait for each other.

**Example.** _The deadlock cancelled one of the two transactions._

**Ver también.** [[Race Condition|Race Condition ↔ Condición de carrera]] · [[Transaction|Transaction ↔ Transacción]]
