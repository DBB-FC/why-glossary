import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const L = createRequire(import.meta.url)("./lib.cjs");
const PACK = fileURLToPath(new URL("../starter/", import.meta.url));
const terms = readdirSync(PACK).filter(f => f.endsWith(".md")).map(f => L.termFromFrontmatter(f, L.parseFrontmatter(readFileSync(join(PACK, f), "utf8"))));
const idx = new L.Index(terms);

test("carga todas las notas del glosario base", () => { assert.equal(idx.size, readdirSync(PACK).filter(f => f.endsWith(".md")).length); assert.ok(idx.size > 300); });
test("norm quita tildes y mayúsculas", () => assert.equal(L.norm("Conciliación"), "conciliacion"));
test("«contracargo» y «chargeback» abren la misma ficha (listo de E1)", () => {
  const a = idx.search("contracargo")[0], b = idx.search("chargeback")[0];
  assert.ok(a && b, "ambas búsquedas devuelven algo");
  assert.equal(a.path, b.path);
});
test("busca sin tildes", () => assert.equal(idx.search("conciliacion")[0].path, idx.search("conciliación")[0].path));
test("busca en inglés y español: Refund / Devolución", () => assert.equal(idx.search("refund")[0].path, idx.search("devolucion")[0].path));
test("filtro por dominio", () => { const d = idx.dominios()[0]; assert.ok(idx.search("", d, 999).every(t => t.dominio === d)); });
test("la definición en inglés cae al español si falta", () => { const t = { ...terms[0], simple_en: "" }; assert.equal(L.simple(t, "en"), t.simple_es); });
test("todos los términos del glosario base traen definición en inglés", () => assert.ok(terms.every(t => t.simple_en && t.tecnica_en)));
test("mazo de 10 tarjetas", () => assert.equal(L.buildDeck(terms, 10).length, 10));
test("resumen de sesiones", () => assert.deepEqual(L.summarize([{ date: "x", total: 10, correct: 7 }]), { sessions: 1, total: 10, correct: 7, pct: 70, promedio: 7, mejor: 7 }));

test("el hover nunca pasa de 150 caracteres", () => {
  assert.ok(terms.every(t => L.recorta(L.simple(t, "es")).length <= 150 && L.recorta(L.simple(t, "en")).length <= 150));
  assert.equal(L.recorta("a".repeat(200)).length, 150);
});
test("todos los «ver también» resuelven a un término", () => {
  for (const t of terms) assert.equal(idx.relacionados(t).length, t.ver_tambien.length, t.en);
  assert.ok(terms.every(t => t.ejemplo_es && t.ejemplo_en && t.n >= 0));
});
test("A–Z: cada término aparece una vez, en grupos ordenados", () => {
  for (const o of ["en", "es"]) {
    const g = L.agrupaAZ(terms, o);
    assert.equal(g.reduce((s, x) => s + x.items.length, 0), terms.length);
    assert.ok(g.every(x => x.items.every(t => L.letra(L.clave(t, o)) === x.letra)));
  }
});
test("las falladas abren la sesión siguiente", () => {
  const f = [terms[5].path, terms[9].path];
  const d = L.buildDeck(terms, 10, Math.random, f).map(c => c.term.path);
  assert.ok(f.every(p => d.slice(0, 2).includes(p)));
});

test("el glosario base es público: sin marcas internas, regulación local ni cifras fechadas", () => {
  const prohibido = /dbb|don buy|kapa|chile|mercado pago|transbank|cerebro|\bCMF\b|\bUAF\b|20[12]\d|US\$/i;
  for (const f of readdirSync(PACK)) assert.ok(!prohibido.test(readFileSync(join(PACK, f), "utf8")), f);
});
test("un término propio se guarda con el formato del glosario y se vuelve a leer", () => {
  const t = { en: "Tax / Fee", es: "Tarifa", dominio: "", simple_es: "Lo que cobra.", simple_en: "", tecnica_es: "", tecnica_en: "", ejemplo_es: "Subió la tarifa.", ejemplo_en: "" };
  const { nombre, contenido } = L.notaDeTermino(t, 7);
  assert.equal(nombre, "Tax Fee.md");
  const r = L.termFromFrontmatter(nombre, L.parseFrontmatter(contenido));
  assert.equal(r.es, "Tarifa"); assert.equal(r.dominio, "Mis términos"); assert.equal(r.n, 7);
  assert.ok(new L.Index([r]).search("tarifa").length);
});
test("al editar un término se conservan alias, vínculos y marca de verificación", () => {
  const t = { en: "Chargeback", es: "Contracargo", dominio: "Pagos", simple_es: "Nuevo.", simple_en: "", tecnica_es: "", tecnica_en: "", ejemplo_es: "", ejemplo_en: "" };
  const c = { aliases: ["CB"], ver_tambien: [3, 9], verificar: true, vinculos: "[[Refund|Refund ↔ Reembolso]]" };
  const { contenido } = L.notaDeTermino(t, 5, c);
  const r = L.termFromFrontmatter("Chargeback.md", L.parseFrontmatter(contenido));
  assert.deepEqual(r.aliases, ["CB"]); assert.deepEqual(r.ver_tambien, [3, 9]); assert.equal(r.verificar, true);
  assert.ok(contenido.includes("**Ver también.** [[Refund|Refund ↔ Reembolso]]"));
});

test("los dominios del glosario base se traducen al inglés y los propios no", () => {
  const doms = new Set(readdirSync(PACK).filter(f => f.endsWith(".md")).map(f => readFileSync(join(PACK, f), "utf8").match(/^dominio: "(.*)"$/m)?.[1]));
  for (const d of doms) {
    const en = L.dominioNombre(d, "en");
    assert.notEqual(en, L.dominioCorto(d), `sin traducción: ${d}`);
    assert.equal(L.dominioNombre(d, "es"), L.dominioCorto(d));
  }
  assert.equal(L.dominioNombre("Mis términos", "en"), "Mis términos");
});
