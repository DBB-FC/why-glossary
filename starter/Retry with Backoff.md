---
en: "Retry with Backoff"
es: "Reintento con espera creciente"
aliases: ["Reintento con backoff", "Reintento con espera creciente"]
dominio: "10 · Pagos, dinero y conciliación"
simple_es: "Es volver a intentar una operación que falló esperando un poco más cada vez. Así no se satura un servicio que está caído."
tecnica_es: "Reintento de una operación con esperas crecientes entre intentos."
simple_en: "Trying a failed operation again while waiting a little longer each time. This avoids overloading a service that is down."
tecnica_en: "Retrying an operation with increasing waits between attempts."
ejemplo_es: "Reintentamos con espera creciente tras el error 429."
ejemplo_en: "We retry with backoff after the 429 error."
ver_tambien: [321, 322]
n: 324
verificar: false
---
# Retry with Backoff · Reintento con espera creciente

**En simple.** Es volver a intentar una operación que falló esperando un poco más cada vez. Así no se satura un servicio que está caído.

**Técnica.** Reintento de una operación con esperas crecientes entre intentos.

**Ejemplo de uso.** _Reintentamos con espera creciente tras el error 429._

---

**In simple.** Trying a failed operation again while waiting a little longer each time. This avoids overloading a service that is down.

**Technical.** Retrying an operation with increasing waits between attempts.

**Example.** _We retry with backoff after the 429 error._

**Ver también.** [[Idempotence (321)|Idempotence ↔ Idempotencia]] · [[Idempotency Key|Idempotency Key ↔ Clave de idempotencia]]
