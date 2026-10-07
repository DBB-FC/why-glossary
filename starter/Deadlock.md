---
en: "Deadlock"
es: "Interbloqueo"
aliases: ["Interbloqueo"]
dominio: "04 · Datos y bases de datos"
simple_es: "Es cuando dos procesos se esperan mutuamente y ninguno puede avanzar. La base de datos lo detecta y cancela uno de los dos para destrabarlo."
tecnica_es: "Bloqueo mutuo donde dos transacciones se esperan entre sí."
simple_en: "When two processes wait for each other and neither can move forward. The database detects it and cancels one of them to break the lock."
tecnica_en: "A mutual lock where two transactions wait for each other."
ejemplo_es: "El interbloqueo canceló una de las dos transacciones."
ejemplo_en: "The deadlock cancelled one of the two transactions."
ver_tambien: [166, 157]
n: 167
verificar: false
---
# Deadlock · Interbloqueo

**En simple.** Es cuando dos procesos se esperan mutuamente y ninguno puede avanzar. La base de datos lo detecta y cancela uno de los dos para destrabarlo.

**Técnica.** Bloqueo mutuo donde dos transacciones se esperan entre sí.

**Ejemplo de uso.** _El interbloqueo canceló una de las dos transacciones._

---

**In simple.** When two processes wait for each other and neither can move forward. The database detects it and cancels one of them to break the lock.

**Technical.** A mutual lock where two transactions wait for each other.

**Example.** _The deadlock cancelled one of the two transactions._

**Ver también.** [[Race Condition|Race Condition ↔ Condición de carrera]] · [[Transaction|Transaction ↔ Transacción]]
