---
en: "Idempotence"
es: "Idempotencia"
aliases: ["Idempotencia"]
dominio: "10 · Pagos, dinero y conciliación"
simple_es: "Lo que impide cobrar dos veces si el cliente insiste o la red reintenta."
tecnica_es: "Propiedad de una operación que produce el mismo resultado se ejecute una o muchas veces."
simple_en: "What prevents charging twice if the customer insists or the network retries."
tecnica_en: "A property of an operation that yields the same result whether executed once or many times."
ejemplo_es: "Hicimos el cobro idempotente para que un reintento no duplique."
ejemplo_en: "We made the charge idempotent so a retry doesn't duplicate it."
ver_tambien: [322, 324, 323, 209]
n: 321
verificar: false
---
# Idempotence · Idempotencia

**En simple.** Lo que impide cobrar dos veces si el cliente insiste o la red reintenta.

**Técnica.** Propiedad de una operación que produce el mismo resultado se ejecute una o muchas veces.

**Ejemplo de uso.** _Hicimos el cobro idempotente para que un reintento no duplique._

---

**In simple.** What prevents charging twice if the customer insists or the network retries.

**Technical.** A property of an operation that yields the same result whether executed once or many times.

**Example.** _We made the charge idempotent so a retry doesn't duplicate it._

**Ver también.** [[Idempotency Key|Idempotency Key ↔ Clave de idempotencia]] · [[Retry with Backoff|Retry with Backoff ↔ Reintento con espera creciente]] · [[Payment Webhook|Payment Webhook ↔ Webhook de pago]] · [[Idempotence|Idempotence ↔ Idempotencia]]
