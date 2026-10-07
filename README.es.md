<div align="center">

<img src="docs/imagenes/icono.svg" alt="" width="76">

# Why Glossary

**Un glosario de bolsillo que habla los dos idiomas: busca un término en inglés o en español y léelo en palabras simples.**

casi 400 términos listos · agrega los tuyos · funciona con cualquier vault

[![versión](https://img.shields.io/github/v/release/DBB-FC/why-glossary-bilingual?label=versi%C3%B3n&color=1FC8B4&style=flat-square)](https://github.com/DBB-FC/why-glossary-bilingual/releases/latest)
[![Obsidian 1.8.7+](https://img.shields.io/badge/Obsidian-1.8.7+-B79CFF?style=flat-square)](https://obsidian.md)
[![escritorio y celular](https://img.shields.io/badge/escritorio-%2B%20celular-5B95FF?style=flat-square)](#instalar)
[![MIT](https://img.shields.io/badge/licencia-MIT-F7931A?style=flat-square)](LICENSE)
[![sin telemetría](https://img.shields.io/badge/telemetr%C3%ADa-ninguna-2A3566?style=flat-square)](#todo-lo-dem%C3%A1s)

*Español · [Read in English](README.md)*

<a href="https://www.buymeacoffee.com/DbbLabs" target="_blank"><img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20beer&emoji=%F0%9F%8D%BA&slug=DbbLabs&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" alt="Invítame una cerveza" height="46"></a>

<img src="docs/imagenes/01-glosario.webp" alt="Why Glossary: la pantalla A–Z con el buscador y los términos bilingües" width="60%">

<sub>Capturas reales de una bóveda real, sin maquetas. Busca en español o en inglés; cada término muestra los dos nombres y la definición simple.</sub>

</div>

---

La mitad de las palabras de tecnología, producto y datos están en inglés, y casi todas las
explicaciones suponen que ya las conoces. Why Glossary pone la respuesta a una tecla de distancia,
en los dos idiomas: **una definición en palabras simples, una técnica y un ejemplo** — del término
que escribiste, en el idioma en que lo escribiste.

No es una página web. No es una suposición de una IA. Son notas de tu propio vault, que puedes
leer, editar y ampliar.

|   |   |
|---|---|
| **[Qué hace](#qué-hace)** · las cuatro cosas que te da | **[Instalar](#instalar)** · dos minutos |
| **[La primera vez](#la-primera-vez-en-un-minuto)** · nada que configurar | **[Agrega tus términos](#agrega-tus-términos)** · *Ingresá tus términos* |
| **[Qué trae el glosario base](#qué-trae-el-glosario-base)** · lee esto antes de instalar | **[Todo lo demás](#todo-lo-demás)** · ajustes, privacidad, build |

## Qué hace

<table>
<tr><td width="50%"><img src="docs/imagenes/01-glosario.webp" alt="La pantalla A–Z, con el buscador arriba"></td><td width="50%"><img src="docs/imagenes/04-vista-previa.webp" alt="El panel de vista previa del término que apuntas"></td></tr>
<tr><td><b>Una pantalla, dos idiomas.</b> Escribe <code>latency</code> o <code>latencia</code>: el resultado muestra los dos nombres, la definición simple y los términos relacionados.</td><td><b>Vista previa sin abrir.</b> Haz clic en cualquier fila y el panel de la derecha muestra la versión simple, la técnica y el ejemplo.</td></tr>
<tr><td><img src="docs/imagenes/02-ficha-es.webp" alt="Ficha de un término en español"></td><td><img src="docs/imagenes/03-ficha-en.webp" alt="La misma ficha en inglés"></td></tr>
<tr><td><b>Primero lo simple.</b> Una explicación de una línea que cualquiera sigue, un botón para copiarla a tu nota, y después la versión técnica y un ejemplo.</td><td><b>Cambia de idioma con un clic.</b> La misma ficha, con las definiciones en español o en inglés; los términos relacionados son enlaces.</td></tr>
</table>

<img src="docs/imagenes/05-termino-del-dia.webp" alt="Tarjeta del término del día" width="100%">

<sub><b>Término del día.</b> Una tarjeta en la pantalla del glosario trae un término al día, para que el glosario enseñe también cuando no buscas nada.</sub>

- **Busca en cualquiera de los dos idiomas.** Escribe `latency` o `latencia`, con o sin tildes.
  Un resultado muestra ambos nombres y la definición en el idioma que elegiste.
- **Dos niveles de definición.** Una *simple* que cualquiera puede seguir, una *técnica* para cuando
  necesitas la versión precisa, y un ejemplo en contexto. Los términos relacionados quedan a un clic.
- **Pasa el cursor en modo lectura.** Los términos del glosario aparecen subrayados en tus notas;
  apunta uno y aparece su tarjeta, sin salir de la página.
- **Modo estudio.** Tarjetas de tu propio glosario, en sesiones del tamaño que elijas, y las que
  fallaste vuelven primero.

<details>
<summary><b>Más vistas</b></summary>

<img src="docs/imagenes/06-lista-az.webp" alt="La lista A–Z con la selección del teclado resaltada" width="100%">

<sub>La lista A–Z: la fila oscura es la selección con el teclado, y cada fila muestra los dos nombres y la definición simple.</sub>

</details>

Y además: una pantalla A–Z con filtros por dominio · un panel lateral que sigue abierto mientras
escribes · **español e inglés**, un solo ajuste · **el celular**, mismas pantallas, sin una build aparte.

## Instalar

**Desde el directorio de la comunidad** — Complementos de la comunidad → Explorar → busca **Why Glossary** → Instalar → Activar.

<details>
<summary>Las otras dos formas: BRAT, o a mano</summary>

### Con BRAT — se instala y se mantiene al día solo

1. Instala **Obsidian42 - BRAT** desde los complementos de la comunidad.
2. Paleta de comandos → **BRAT: Add a beta plugin for testing**.
3. Pega `DBB-FC/why-glossary-bilingual`.

BRAT lo instala, lo activa y lo actualiza en cada release.

### A mano

Descarga `main.js`, `manifest.json` y `styles.css` desde el
[último release](https://github.com/DBB-FC/why-glossary-bilingual/releases/latest) a
`<vault>/.obsidian/plugins/why-glossary-bilingual/` y actívalo en Ajustes → Complementos de la comunidad.
No hace falta nada más: esos tres archivos son todo el plugin.

</details>

Ábrelo con el comando **Abrir glosario** (`Cmd/Ctrl+P`) o con el ícono del libro en la barra lateral izquierda.

## La primera vez, en un minuto

1. **Activa el plugin.** El glosario base se instala solo en una carpeta `Why Glossary/` —
   casi 400 notas, sin asistente, sin clave, sin red.
2. **Abre el glosario** desde la barra lateral y escribe cualquier palabra: `chargeback`, `contracargo`, `latency`.
3. **Haz clic en un resultado** para leer la definición simple, la técnica y el ejemplo.
4. **Apunta un término subrayado** en cualquier nota en modo lectura para ver su tarjeta.

Eso es todo. No hace falta configurar nada para lo anterior.

## Agrega tus términos

El glosario base es un punto de partida; el glosario útil es el tuyo. Tres formas de entrar, todas
lo mismo por debajo:

- el comando **Ingresá tus términos** (`Cmd/Ctrl+P`),
- el botón de la pantalla del glosario,
- la fila *Tus términos* en los ajustes del plugin.

Solo se piden el nombre en inglés y el nombre en español. Tu término se guarda como una nota en
`Why Glossary/Mis términos/`. También puedes escribir la nota a mano:

```yaml
---
en: "Chargeback"
es: "Contracargo"
aliases: ["Disputa de pago"]
dominio: "Mis términos"
simple_es: "Cuando un cliente reclama un cobro a su banco y el banco le devuelve la plata."
simple_en: "When a customer disputes a charge with their bank and the bank returns the money."
tecnica_es: "…"
tecnica_en: "…"
ejemplo_es: "…"
ejemplo_en: "…"
ver_tambien: ["Refund"]
---
```

Todos los campos menos `en` y `es` son opcionales.

## Qué trae el glosario base

**Casi 400 términos** en once áreas: agentes de IA y economía de tokens, desarrollo web y arquitectura de
software, trabajo comercial y de consultoría, datos y bases de datos, seguridad y privacidad, nube y
DevOps, IA y automatización, producto y diseño, pagos, QA, y SaaS e integraciones.

Las definiciones están escritas para valerse por sí solas, para público general, y **no reemplazan a
un especialista**: la versión simple simplifica a propósito. Los términos con `verificar: true` en su
frontmatter son aquellos cuya traducción merece una segunda mirada; si ves un error,
[abre un issue](https://github.com/DBB-FC/why-glossary-bilingual/issues).

El glosario base nunca pisa tus notas: edita un término y se queda tu versión. *Instalar el
glosario base* en los ajustes repone lo que hayas borrado.

## Todo lo demás

<details>
<summary><b>Ajustes</b></summary>

- **Carpeta del glosario** — dónde viven las notas de los términos (por defecto `Why Glossary`).
- **Idioma de las definiciones** — inglés o español; si falta una, se muestra la otra.
- **Ver definición al pasar el cursor** — las tarjetas en modo lectura.
- **Abrir el glosario al iniciar Obsidian** — la pantalla del glosario se abre con el vault.
- **Tus términos** y **Glosario base** — agregar un término; instalar o reponer los términos base.
- **Tarjetas por sesión de estudio** — el tamaño de una sesión.

</details>

<details>
<summary><b>Privacidad</b></summary>

No hay telemetría, ni analítica, ni cuenta, ni servidor: el plugin **no hace ninguna petición de
red**. Solo lee y escribe las notas de su propia carpeta. Tu historial de estudio y las tarjetas
que fallaste se guardan en el archivo de ajustes del propio plugin.

</details>

<details>
<summary><b>Compilar desde el código</b></summary>

```bash
npm install
npm test         # compila un bundle de prueba y corre las pruebas unitarias
npm run typecheck
npm run build    # → main.js
```

El glosario base vive en `starter/` y se empaqueta dentro de `main.js` al compilar. `main.js` es el
resultado de la compilación y no se versiona: los releases lo llevan.

</details>

<details>
<summary><b>Licencia</b></summary>

[MIT](LICENSE). Libre para cualquier uso —personal o comercial— y puedes bifurcarlo, cambiarlo y
redistribuirlo, conservando el aviso de copyright. El plugin no cobra nada y no tiene plan de pago.

</details>

## Soporte

Errores e ideas: [issues de GitHub](https://github.com/DBB-FC/why-glossary-bilingual/issues). Incluye tu
versión de Obsidian y tu plataforma.

[Cómo contribuir](CONTRIBUTING.es.md) · [Código de conducta](CODE_OF_CONDUCT.es.md) · [Seguridad](SECURITY.es.md) · [Licencia MIT](LICENSE)

---

<div align="center">

<a href="https://dontbuybuild.cl">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/imagenes/dbb-labs-oscuro.svg">
    <img alt="DBB Labs" src="docs/imagenes/dbb-labs-claro.svg" height="26">
  </picture>
</a>

Hecho por **Felipe Córdova** · Impulsado por **[DBB Labs](https://dontbuybuild.cl)**

### Don't Buy. Build.

<sub>Es el nombre de la empresa, no un eslogan: un estudio de sistemas a la medida.<br>Compra lo estándar. Construye lo estratégico.</sub>

<sub>Libre, MIT, sin plan de pago. Si el glosario te ahorró una búsqueda, una cerveza es bienvenida —
y si no, el plugin funciona exactamente igual.</sub>

<a href="https://www.buymeacoffee.com/DbbLabs" target="_blank"><img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20beer&emoji=%F0%9F%8D%BA&slug=DbbLabs&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" alt="Invítame una cerveza" height="46"></a>

</div>
