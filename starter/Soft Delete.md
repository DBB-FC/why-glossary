---
en: "Soft Delete"
es: "Eliminación lógica"
aliases: ["Eliminación lógica"]
dominio: "04 · Datos y bases de datos"
simple_es: "Reversible y auditable; a cambio, todas las consultas tienen que recordar filtrarla."
tecnica_es: "Marcar una fila como eliminada en vez de borrarla."
simple_en: "Reversible and auditable; in return every query must remember to filter it."
tecnica_en: "Marking a row as deleted instead of removing it."
ejemplo_es: "Con eliminación lógica pudimos recuperar el cliente."
ejemplo_en: "With a soft delete we were able to recover the customer."
ver_tambien: [136, 156]
n: 165
verificar: false
---
# Soft Delete · Eliminación lógica

**En simple.** Reversible y auditable; a cambio, todas las consultas tienen que recordar filtrarla.

**Técnica.** Marcar una fila como eliminada en vez de borrarla.

**Ejemplo de uso.** _Con eliminación lógica pudimos recuperar el cliente._

---

**In simple.** Reversible and auditable; in return every query must remember to filter it.

**Technical.** Marking a row as deleted instead of removing it.

**Example.** _With a soft delete we were able to recover the customer._

**Ver también.** [[Row - Record|Row / Record ↔ Fila / registro]] · [[Data Retention|Data Retention ↔ Retención de datos]]
