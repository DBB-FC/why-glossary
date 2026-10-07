---
cssclasses: ["wg-nota"]
en: "Cold Start"
es: "Arranque en frío"
aliases: ["Arranque en frío"]
dominio: "03 · Desarrollo web y arquitectura de software"
simple_es: "Es la demora que se nota cuando una función que llevaba tiempo sin usarse tiene que despertarse para responder. Afecta solo a la primera persona en llegar."
tecnica_es: "Demora de la primera ejecución de una función que estaba inactiva."
simple_en: "The delay you notice when a function that had been unused for a while has to wake up to respond. It only affects the first person to arrive."
tecnica_en: "The delay of the first execution of a function that was idle."
ejemplo_es: "El cold start sumó dos segundos a la primera visita."
ejemplo_en: "The cold start added two seconds to the first visit."
ver_tambien: [88, 122]
n: 123
verificar: false
---
# Cold Start · Arranque en frío

**En simple.** Es la demora que se nota cuando una función que llevaba tiempo sin usarse tiene que despertarse para responder. Afecta solo a la primera persona en llegar.

**Técnica.** Demora de la primera ejecución de una función que estaba inactiva.

**Ejemplo de uso.** _El cold start sumó dos segundos a la primera visita._

---

**In simple.** The delay you notice when a function that had been unused for a while has to wake up to respond. It only affects the first person to arrive.

**Technical.** The delay of the first execution of a function that was idle.

**Example.** _The cold start added two seconds to the first visit._

**Ver también.** [[Serverless|Serverless ↔ Sin servidor]] · [[Edge|Edge ↔ Borde de la red (edge)]]
