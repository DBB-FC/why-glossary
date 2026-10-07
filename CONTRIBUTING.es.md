# Cómo contribuir

*Español · [Read in English](CONTRIBUTING.md)*

Los issues y los pull requests son bienvenidos. El plugin tiene licencia MIT, así que también puedes
hacer un fork y seguir tu propio camino, sin pedir permiso.

## Antes de abrir un pull request

```bash
npm install
npm test            # compila un bundle de prueba y corre las pruebas unitarias
npm run typecheck   # tsc --noEmit: tiene que quedar en 0 errores
```

## Agregar o corregir términos

El glosario base vive en `starter/`, una nota por término, y se empaqueta dentro de `main.js` al
compilar. Solo `en` y `es` son obligatorios; el resto de los campos es opcional (mira el ejemplo YAML
del README). Unas pocas reglas lo mantienen útil:

- Escribe definiciones que se sostengan solas, para un público general. La versión simple simplifica a propósito.
- Entrega los dos idiomas. Si no estás seguro de una traducción, agrega `verificar: true` al
  frontmatter en vez de adivinar.
- No pises un término que alguien pudo haber editado: el plugin nunca reemplaza las notas de la
  persona, y un cambio al starter tampoco debería.

## Lo que el plugin promete, y tiene que seguir prometiendo

Tres reglas son el producto. Un cambio que debilite una de ellas no se va a integrar:

1. **Sin telemetría, sin servidor, sin llamadas a la red.** El plugin lee y escribe solo las notas
   dentro de su propia carpeta.
2. **Tus notas nunca se sobrescriben.** Instalar o restaurar el glosario base agrega lo que falta y
   deja tus ediciones en paz.
3. **Funciona en el celular.** Solo la API de Obsidian: nada de APIs de Node ni estilos en línea.

## Convenciones

- Mantén el estilo del código y de los comentarios que rodean tu cambio.
- Todo texto visible va en inglés y en español. Nunca un texto suelto.
- `src/` es el código fuente. El `main.js` de la raíz es el resultado de la compilación y no se
  versiona; los releases lo llevan.
