import esbuild from "esbuild";
import { builtinModules as builtins } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
const test = process.argv[2] === "test";
// Glosario base: las notas de starter/ viajan dentro de main.js (no hay descarga ni carpeta aparte).
const starter = readdirSync("starter").filter(f => f.endsWith(".md")).sort().map(f => ({ file: f, content: readFileSync("starter/" + f, "utf8") }));
await esbuild.build(test
  ? { entryPoints: ["src/lib.ts"], bundle: true, format: "cjs", platform: "node", outfile: "test/lib.cjs" }
  : { entryPoints: ["src/main.ts"], bundle: true, external: ["obsidian", "electron", "@codemirror/*", "@lezer/*", ...builtins],
      format: "cjs", target: "es2020", outfile: "main.js", logLevel: "info", define: { __STARTER__: JSON.stringify(starter) } });
