---
en: "Race Condition"
es: "Condición de carrera"
aliases: ["Condición de carrera"]
dominio: "04 · Datos y bases de datos"
simple_es: "Es un error que ocurre cuando dos operaciones simultáneas dependen del orden en que se ejecutan, como dos retiros sobre el mismo saldo. Se evita con bloqueos, no con suerte."
tecnica_es: "Fallo que depende del orden en que dos operaciones concurrentes se ejecutan."
simple_en: "An error that occurs when two simultaneous operations depend on the order in which they run, such as two withdrawals on the same balance. It is avoided with locks, not luck."
tecnica_en: "A failure that depends on the order in which two concurrent operations run."
ejemplo_es: "Una condición de carrera cobró dos veces."
ejemplo_en: "A race condition charged twice."
ver_tambien: [167, 157]
n: 166
verificar: false
---
# Race Condition · Condición de carrera

**En simple.** Es un error que ocurre cuando dos operaciones simultáneas dependen del orden en que se ejecutan, como dos retiros sobre el mismo saldo. Se evita con bloqueos, no con suerte.

**Técnica.** Fallo que depende del orden en que dos operaciones concurrentes se ejecutan.

**Ejemplo de uso.** _Una condición de carrera cobró dos veces._

---

**In simple.** An error that occurs when two simultaneous operations depend on the order in which they run, such as two withdrawals on the same balance. It is avoided with locks, not luck.

**Technical.** A failure that depends on the order in which two concurrent operations run.

**Example.** _A race condition charged twice._

**Ver también.** [[Deadlock|Deadlock ↔ Interbloqueo]] · [[Transaction|Transaction ↔ Transacción]]
