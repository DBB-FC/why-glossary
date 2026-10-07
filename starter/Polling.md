---
en: "Polling"
es: "Sondeo"
aliases: ["Sondeo"]
dominio: "03 · Desarrollo web y arquitectura de software"
simple_es: "Es preguntar una y otra vez a otro sistema si hubo cambios, en vez de esperar a que él avise. Se usa cuando no hay webhook; es más costoso y llega más tarde."
tecnica_es: "Preguntar repetidamente por cambios en vez de esperar un aviso."
simple_en: "Asking another system over and over whether anything changed, instead of waiting for it to notify you. It is used when there is no webhook; it costs more and arrives later."
tecnica_en: "Repeatedly asking for changes instead of waiting for a notice."
ejemplo_es: "Hacemos polling cada minuto porque no hay webhook."
ejemplo_en: "We poll every minute because there is no webhook."
ver_tambien: [97, 115]
n: 117
verificar: false
---
# Polling · Sondeo

**En simple.** Es preguntar una y otra vez a otro sistema si hubo cambios, en vez de esperar a que él avise. Se usa cuando no hay webhook; es más costoso y llega más tarde.

**Técnica.** Preguntar repetidamente por cambios en vez de esperar un aviso.

**Ejemplo de uso.** _Hacemos polling cada minuto porque no hay webhook._

---

**In simple.** Asking another system over and over whether anything changed, instead of waiting for it to notify you. It is used when there is no webhook; it costs more and arrives later.

**Technical.** Repeatedly asking for changes instead of waiting for a notice.

**Example.** _We poll every minute because there is no webhook._

**Ver también.** [[Webhook|Webhook ↔ Webhook (aviso automático entre sistemas)]] · [[WebSocket|WebSocket ↔ WebSocket]]
