---
cssclasses: ["wg-nota"]
en: "RLS (Row-Level Security)"
es: "Seguridad a nivel de fila"
aliases: ["RLS", "Seguridad a nivel de fila"]
dominio: "07 · Ciberseguridad, identidad y privacidad"
simple_es: "Es una regla de la base de datos que decide qué filas puede ver o modificar cada usuario, de modo que un cliente vea solo sus registros y no los de otro."
tecnica_es: "Row Level Security: políticas que restringen acceso a filas de una base según contexto/usuario."
simple_en: "A database rule that decides which rows each user can see or modify, so that a customer sees only their own records and not another's."
tecnica_en: "Row Level Security: policies that restrict access to rows of a database by context or user."
ejemplo_es: "Con RLS cada cliente solo ve sus pedidos."
ejemplo_en: "With RLS each customer only sees their own orders."
ver_tambien: [235, 236, 247]
n: 237
verificar: false
---
# RLS (Row-Level Security) · Seguridad a nivel de fila

**En simple.** Es una regla de la base de datos que decide qué filas puede ver o modificar cada usuario, de modo que un cliente vea solo sus registros y no los de otro.

**Técnica.** Row Level Security: políticas que restringen acceso a filas de una base según contexto/usuario.

**Ejemplo de uso.** _Con RLS cada cliente solo ve sus pedidos._

---

**In simple.** A database rule that decides which rows each user can see or modify, so that a customer sees only their own records and not another's.

**Technical.** Row Level Security: policies that restrict access to rows of a database by context or user.

**Example.** _With RLS each customer only sees their own orders._

**Ver también.** [[RBAC|RBAC ↔ Control de acceso basado en roles]] · [[Least Privilege|Least Privilege ↔ Mínimo privilegio]] · [[Claim|Claim ↔ Declaración (claim)]]
