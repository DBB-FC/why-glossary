---
cssclasses: ["wg-nota"]
en: "Idempotency Key"
es: "Clave de idempotencia"
aliases: ["Clave de idempotencia"]
dominio: "10 · Pagos, dinero y conciliación"
simple_es: "Es un identificador único que el cliente envía junto con una petición. Si el servidor la recibe otra vez, reconoce el reintento y no crea un segundo cobro."
tecnica_es: "Identificador único que el cliente envía para que el servidor reconozca un reintento del mismo cobro."
simple_en: "A unique identifier the client sends with a request. If the server receives it again, it recognizes the retry and does not create a second charge."
tecnica_en: "A unique identifier the client sends so the server recognizes a retry of the same charge."
ejemplo_es: "Cada cobro lleva su clave de idempotencia."
ejemplo_en: "Every charge carries its idempotency key."
ver_tambien: [321, 324]
n: 322
verificar: false
---
# Idempotency Key · Clave de idempotencia

**En simple.** Es un identificador único que el cliente envía junto con una petición. Si el servidor la recibe otra vez, reconoce el reintento y no crea un segundo cobro.

**Técnica.** Identificador único que el cliente envía para que el servidor reconozca un reintento del mismo cobro.

**Ejemplo de uso.** _Cada cobro lleva su clave de idempotencia._

---

**In simple.** A unique identifier the client sends with a request. If the server receives it again, it recognizes the retry and does not create a second charge.

**Technical.** A unique identifier the client sends so the server recognizes a retry of the same charge.

**Example.** _Every charge carries its idempotency key._

**Ver también.** [[Idempotence (321)|Idempotence ↔ Idempotencia]] · [[Retry with Backoff|Retry with Backoff ↔ Reintento con espera creciente]]
