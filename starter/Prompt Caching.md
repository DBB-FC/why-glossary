---
en: "Prompt Caching"
es: "Caché de instrucciones"
aliases: ["Caché de instrucciones"]
dominio: "12 · Agentes de IA, MCP y economía de tokens"
simple_es: "Es reutilizar el procesamiento de la parte repetida de una instrucción entre llamadas, en vez de recalcularla. Abarata mucho un contexto grande que no cambia."
tecnica_es: "Reutilización del procesamiento de un prefijo repetido entre llamadas."
simple_en: "Reusing the processing of the repeated part of an instruction across calls, instead of recalculating it. It makes a large, unchanging context much cheaper."
tecnica_en: "Reusing the processing of a prefix repeated across calls."
ejemplo_es: "El caché de instrucciones abarató el contexto fijo."
ejemplo_en: "Prompt caching made the fixed context cheaper."
ver_tambien: [432, 433, 434]
n: 399
verificar: false
---
# Prompt Caching · Caché de instrucciones

**En simple.** Es reutilizar el procesamiento de la parte repetida de una instrucción entre llamadas, en vez de recalcularla. Abarata mucho un contexto grande que no cambia.

**Técnica.** Reutilización del procesamiento de un prefijo repetido entre llamadas.

**Ejemplo de uso.** _El caché de instrucciones abarató el contexto fijo._

---

**In simple.** Reusing the processing of the repeated part of an instruction across calls, instead of recalculating it. It makes a large, unchanging context much cheaper.

**Technical.** Reusing the processing of a prefix repeated across calls.

**Example.** _Prompt caching made the fixed context cheaper._

**Ver también.** [[Prefix Cache|Prefix Cache ↔ Caché de prefijo]] · [[Cache Hit - Miss|Cache Hit / Miss ↔ Acierto / fallo de caché]] · [[Cache TTL|Cache TTL ↔ Tiempo de vida del caché]]
