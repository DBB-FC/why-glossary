---
en: "Cursor Pagination"
es: "Paginación por cursor"
aliases: ["Paginación por cursor"]
dominio: "04 · Datos y bases de datos"
simple_es: "Estable cuando se insertan filas mientras se pagina; OFFSET no lo es."
tecnica_es: "Recorrer resultados usando un puntero en vez de un número de página."
simple_en: "Stable when rows are inserted while paging; OFFSET isn't."
tecnica_en: "Walking through results using a pointer instead of a page number."
ejemplo_es: "La paginación por cursor evita repetir filas."
ejemplo_en: "Cursor pagination avoids repeating rows."
ver_tambien: [141, 142]
n: 172
verificar: false
---
# Cursor Pagination · Paginación por cursor

**En simple.** Estable cuando se insertan filas mientras se pagina; OFFSET no lo es.

**Técnica.** Recorrer resultados usando un puntero en vez de un número de página.

**Ejemplo de uso.** _La paginación por cursor evita repetir filas._

---

**In simple.** Stable when rows are inserted while paging; OFFSET isn't.

**Technical.** Walking through results using a pointer instead of a page number.

**Example.** _Cursor pagination avoids repeating rows._

**Ver también.** [[Query|Query ↔ Consulta]] · [[Index|Index ↔ Índice]]
