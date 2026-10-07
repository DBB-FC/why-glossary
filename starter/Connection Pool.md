---
en: "Connection Pool"
es: "Grupo de conexiones"
aliases: ["Grupo de conexiones"]
dominio: "04 · Datos y bases de datos"
simple_es: "Es un conjunto de conexiones a la base de datos que se mantienen abiertas y se reutilizan, porque abrir una nueva en cada petición es lento y puede agotarlas."
tecnica_es: "Conjunto de conexiones reutilizadas hacia la base."
simple_en: "A set of database connections that are kept open and reused, because opening a new one for every request is slow and can exhaust them."
tecnica_en: "A set of reused connections to the database."
ejemplo_es: "Agotamos el grupo de conexiones en la campaña."
ejemplo_en: "We exhausted the connection pool during the campaign."
ver_tambien: [170, 107]
n: 171
verificar: false
---
# Connection Pool · Grupo de conexiones

**En simple.** Es un conjunto de conexiones a la base de datos que se mantienen abiertas y se reutilizan, porque abrir una nueva en cada petición es lento y puede agotarlas.

**Técnica.** Conjunto de conexiones reutilizadas hacia la base.

**Ejemplo de uso.** _Agotamos el grupo de conexiones en la campaña._

---

**In simple.** A set of database connections that are kept open and reused, because opening a new one for every request is slow and can exhaust them.

**Technical.** A set of reused connections to the database.

**Example.** _We exhausted the connection pool during the campaign._

**Ver también.** [[ORM|ORM ↔ Mapeo objeto-relacional]] · [[Performance|Performance ↔ Rendimiento]]
