---
en: "Salt"
es: "Sal criptográfica"
aliases: ["Sal criptográfica"]
dominio: "07 · Ciberseguridad, identidad y privacidad"
simple_es: "Sin salt, una tabla de hashes conocidos revienta las contraseñas fáciles."
tecnica_es: "Valor aleatorio añadido antes de hashear para que dos contraseñas iguales no produzcan el mismo hash."
simple_en: "Without salt, a table of known hashes cracks easy passwords."
tecnica_en: "A random value added before hashing so two identical passwords don't produce the same hash."
ejemplo_es: "La sal hace que dos claves iguales tengan hashes distintos."
ejemplo_en: "The salt makes two identical passwords have different hashes."
ver_tambien: [241, 238]
n: 249
verificar: false
---
# Salt · Sal criptográfica

**En simple.** Sin salt, una tabla de hashes conocidos revienta las contraseñas fáciles.

**Técnica.** Valor aleatorio añadido antes de hashear para que dos contraseñas iguales no produzcan el mismo hash.

**Ejemplo de uso.** _La sal hace que dos claves iguales tengan hashes distintos._

---

**In simple.** Without salt, a table of known hashes cracks easy passwords.

**Technical.** A random value added before hashing so two identical passwords don't produce the same hash.

**Example.** _The salt makes two identical passwords have different hashes._

**Ver también.** [[Hashing|Hashing ↔ Hash (resumen criptográfico)]] · [[Encryption|Encryption ↔ Cifrado]]
