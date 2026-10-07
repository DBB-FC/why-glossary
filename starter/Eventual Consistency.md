---
cssclasses: ["wg-nota"]
en: "Eventual Consistency"
es: "Consistencia eventual"
aliases: ["Consistencia eventual"]
dominio: "04 · Datos y bases de datos"
simple_es: "Es un modelo en que las copias de los datos no se actualizan al mismo instante y tardan un poco en coincidir. Sirve para un contador de visitas, no para un saldo."
tecnica_es: "Modelo donde las réplicas converger toma tiempo."
simple_en: "A model where copies of the data are not updated at the same instant and take a little while to match. It works for a visit counter, not for a balance."
tecnica_en: "A model where replicas take time to converge."
ejemplo_es: "La consistencia eventual basta para el contador de visitas."
ejemplo_en: "Eventual consistency is enough for the visit counter."
ver_tambien: [158, 134]
n: 168
verificar: false
---
# Eventual Consistency · Consistencia eventual

**En simple.** Es un modelo en que las copias de los datos no se actualizan al mismo instante y tardan un poco en coincidir. Sirve para un contador de visitas, no para un saldo.

**Técnica.** Modelo donde las réplicas converger toma tiempo.

**Ejemplo de uso.** _La consistencia eventual basta para el contador de visitas._

---

**In simple.** A model where copies of the data are not updated at the same instant and take a little while to match. It works for a visit counter, not for a balance.

**Technical.** A model where replicas take time to converge.

**Example.** _Eventual consistency is enough for the visit counter._

**Ver también.** [[ACID|ACID ↔ ACID (atomicidad, consistencia, aislamiento, durabilidad)]] · [[NoSQL|NoSQL ↔ NoSQL]]
