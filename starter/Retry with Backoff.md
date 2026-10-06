---
en: "Retry with Backoff"
es: "Reintento con espera creciente"
aliases: ["Reintento con backoff", "Reintento con espera creciente"]
dominio: "10 · Pagos, dinero y conciliación"
simple_es: "Evita golpear un servicio caído y es lo que pide un 429."
tecnica_es: "Reintento de una operación con esperas crecientes entre intentos."
simple_en: "Avoids hammering a service that is down, and is what a 429 asks for."
tecnica_en: "Retrying an operation with increasing waits between attempts."
ejemplo_es: "Reintentamos con espera creciente tras el error 429."
ejemplo_en: "We retry with backoff after the 429 error."
ver_tambien: [321, 322]
n: 324
verificar: false
---
# Retry with Backoff · Reintento con espera creciente

**En simple.** Evita golpear un servicio caído y es lo que pide un 429.

**Técnica.** Reintento de una operación con esperas crecientes entre intentos.

**Ejemplo de uso.** _Reintentamos con espera creciente tras el error 429._

---

**In simple.** Avoids hammering a service that is down, and is what a 429 asks for.

**Technical.** Retrying an operation with increasing waits between attempts.

**Example.** _We retry with backoff after the 429 error._

**Ver también.** [[Idempotence (321)|Idempotence ↔ Idempotencia]] · [[Idempotency Key|Idempotency Key ↔ Clave de idempotencia]]
