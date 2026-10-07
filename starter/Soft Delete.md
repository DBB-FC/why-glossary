---
en: "Soft Delete"
es: "Eliminación lógica"
aliases: ["Eliminación lógica"]
dominio: "04 · Datos y bases de datos"
simple_es: "Es marcar un registro como eliminado en vez de borrarlo de verdad. Se puede recuperar y deja rastro, a cambio de que cada consulta recuerde filtrarlo."
tecnica_es: "Marcar una fila como eliminada en vez de borrarla."
simple_en: "Marking a record as deleted instead of actually erasing it. It can be recovered and leaves a trace, at the cost of every query having to remember to filter it out."
tecnica_en: "Marking a row as deleted instead of removing it."
ejemplo_es: "Con eliminación lógica pudimos recuperar el cliente."
ejemplo_en: "With a soft delete we were able to recover the customer."
ver_tambien: [136, 156]
n: 165
verificar: false
---
# Soft Delete · Eliminación lógica

**En simple.** Es marcar un registro como eliminado en vez de borrarlo de verdad. Se puede recuperar y deja rastro, a cambio de que cada consulta recuerde filtrarlo.

**Técnica.** Marcar una fila como eliminada en vez de borrarla.

**Ejemplo de uso.** _Con eliminación lógica pudimos recuperar el cliente._

---

**In simple.** Marking a record as deleted instead of actually erasing it. It can be recovered and leaves a trace, at the cost of every query having to remember to filter it out.

**Technical.** Marking a row as deleted instead of removing it.

**Example.** _With a soft delete we were able to recover the customer._

**Ver también.** [[Row - Record|Row / Record ↔ Fila / registro]] · [[Data Retention|Data Retention ↔ Retención de datos]]
