---
en: "Idempotency Key"
es: "Clave de idempotencia"
aliases: ["Clave de idempotencia"]
dominio: "10 · Pagos, dinero y conciliación"
simple_es: "Un identificador que evita que repetir una petición cree un cobro duplicado."
tecnica_es: "Identificador único que el cliente envía para que el servidor reconozca un reintento del mismo cobro."
simple_en: "An identifier that stops a repeated request from creating a duplicate charge."
tecnica_en: "A unique identifier the client sends so the server recognizes a retry of the same charge."
ejemplo_es: "Cada cobro lleva su clave de idempotencia."
ejemplo_en: "Every charge carries its idempotency key."
ver_tambien: [321, 324]
n: 322
verificar: false
---
# Idempotency Key · Clave de idempotencia

**En simple.** Un identificador que evita que repetir una petición cree un cobro duplicado.

**Técnica.** Identificador único que el cliente envía para que el servidor reconozca un reintento del mismo cobro.

**Ejemplo de uso.** _Cada cobro lleva su clave de idempotencia._

---

**In simple.** An identifier that stops a repeated request from creating a duplicate charge.

**Technical.** A unique identifier the client sends so the server recognizes a retry of the same charge.

**Example.** _Every charge carries its idempotency key._

**Ver también.** [[Idempotence (321)|Idempotence ↔ Idempotencia]] · [[Retry with Backoff|Retry with Backoff ↔ Reintento con espera creciente]]
