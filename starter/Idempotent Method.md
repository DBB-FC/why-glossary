---
en: "Idempotent Method"
es: "Método idempotente"
aliases: ["Método idempotente"]
dominio: "03 · Desarrollo web y arquitectura de software"
simple_es: "POST no lo es, y por eso los cobros necesitan clave de idempotencia."
tecnica_es: "Verbo HTTP cuya repetición no cambia el resultado: GET, PUT, DELETE."
simple_en: "POST is not, which is why payments need an idempotency key."
tecnica_en: "An HTTP verb whose repetition does not change the result: GET, PUT, DELETE."
ejemplo_es: "Reintentar un PUT es seguro porque es idempotente."
ejemplo_en: "Retrying a PUT is safe because it is idempotent."
ver_tambien: [128, 91]
n: 118
verificar: false
---
# Idempotent Method · Método idempotente

**En simple.** POST no lo es, y por eso los cobros necesitan clave de idempotencia.

**Técnica.** Verbo HTTP cuya repetición no cambia el resultado: GET, PUT, DELETE.

**Ejemplo de uso.** _Reintentar un PUT es seguro porque es idempotente._

---

**In simple.** POST is not, which is why payments need an idempotency key.

**Technical.** An HTTP verb whose repetition does not change the result: GET, PUT, DELETE.

**Example.** _Retrying a PUT is safe because it is idempotent._

**Ver también.** [[Deployment Idempotence|Deployment Idempotence ↔ Idempotencia de despliegue]] · [[REST API|REST API ↔ API REST]]
