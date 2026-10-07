---
en: "Salt"
es: "Sal criptográfica"
aliases: ["Sal criptográfica"]
dominio: "07 · Ciberseguridad, identidad y privacidad"
simple_es: "Es un valor aleatorio que se agrega a una contraseña antes de convertirla en hash, para que dos contraseñas iguales no den el mismo resultado. Dificulta ataques con tablas de hashes ya conocidos."
tecnica_es: "Valor aleatorio añadido antes de hashear para que dos contraseñas iguales no produzcan el mismo hash."
simple_en: "A random value added to a password before it is hashed, so that two identical passwords do not give the same result. It makes attacks with tables of known hashes harder."
tecnica_en: "A random value added before hashing so two identical passwords don't produce the same hash."
ejemplo_es: "La sal hace que dos claves iguales tengan hashes distintos."
ejemplo_en: "The salt makes two identical passwords have different hashes."
ver_tambien: [241, 238]
n: 249
verificar: false
---
# Salt · Sal criptográfica

**En simple.** Es un valor aleatorio que se agrega a una contraseña antes de convertirla en hash, para que dos contraseñas iguales no den el mismo resultado. Dificulta ataques con tablas de hashes ya conocidos.

**Técnica.** Valor aleatorio añadido antes de hashear para que dos contraseñas iguales no produzcan el mismo hash.

**Ejemplo de uso.** _La sal hace que dos claves iguales tengan hashes distintos._

---

**In simple.** A random value added to a password before it is hashed, so that two identical passwords do not give the same result. It makes attacks with tables of known hashes harder.

**Technical.** A random value added before hashing so two identical passwords don't produce the same hash.

**Example.** _The salt makes two identical passwords have different hashes._

**Ver también.** [[Hashing|Hashing ↔ Hash (resumen criptográfico)]] · [[Encryption|Encryption ↔ Cifrado]]
