---
en: "Cache Hit / Miss"
es: "Acierto / fallo de caché"
aliases: ["Cache Hit", "Acierto / fallo de caché", "Miss", "Acierto", "fallo de caché"]
dominio: "12 · Agentes de IA, MCP y economía de tokens"
simple_es: "Es si lo que se envía al modelo ya estaba guardado en la caché (acierto) o hubo que procesarlo de cero (fallo). Un acierto cuesta mucho menos."
tecnica_es: "Que el prefijo estuviera en caché o no."
simple_en: "Whether what is sent to the model was already stored in the cache (hit) or had to be processed from scratch (miss). A hit costs much less."
tecnica_en: "Whether the prefix was in the cache or not."
ejemplo_es: "Un acierto de caché cuesta mucho menos que un fallo."
ejemplo_en: "A cache hit costs far less than a miss."
ver_tambien: [432, 434, 399]
n: 433
verificar: false
---
# Cache Hit / Miss · Acierto / fallo de caché

**En simple.** Es si lo que se envía al modelo ya estaba guardado en la caché (acierto) o hubo que procesarlo de cero (fallo). Un acierto cuesta mucho menos.

**Técnica.** Que el prefijo estuviera en caché o no.

**Ejemplo de uso.** _Un acierto de caché cuesta mucho menos que un fallo._

---

**In simple.** Whether what is sent to the model was already stored in the cache (hit) or had to be processed from scratch (miss). A hit costs much less.

**Technical.** Whether the prefix was in the cache or not.

**Example.** _A cache hit costs far less than a miss._

**Ver también.** [[Prefix Cache|Prefix Cache ↔ Caché de prefijo]] · [[Cache TTL|Cache TTL ↔ Tiempo de vida del caché]] · [[Prompt Caching|Prompt Caching ↔ Caché de instrucciones]]
