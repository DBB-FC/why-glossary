// Lógica pura (sin Obsidian): normalización, índice, búsqueda, tarjetas de estudio.
export interface Term {
  path: string;
  en: string;
  es: string;
  aliases: string[];
  dominio: string;
  simple_es: string;
  tecnica_es: string;
  simple_en: string;
  tecnica_en: string;
  ejemplo_es: string;
  ejemplo_en: string;
  ver_tambien: number[];
  n: number;
  verificar: boolean;
}

/** Minúsculas, sin tildes ni signos: «Contracargo» y «contracargó» comparan igual salvo el sufijo. */
export function norm(s: string): string {
  return (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
}

export function keysOf(t: Term): string[] {
  const out = new Set<string>();
  for (const k of [t.en, t.es, ...t.aliases]) {
    const n = norm(k);
    if (n) out.add(n);
    // «Chargeback (contracargo)» también debe encontrarse por la parte entre paréntesis y la de fuera
    const m = (k ?? "").match(/^(.*?)\s*\((.*)\)\s*$/);
    if (m) { for (const p of [m[1], m[2]]) { const x = norm(p); if (x) out.add(x); } }
  }
  return [...out];
}

export interface Hit { term: Term; score: number; }

/** 0 = sin coincidencia. Exacto > empieza por > palabra empieza por > contiene. */
export function scoreTerm(keys: string[], q: string): number {
  let best = 0;
  for (const k of keys) {
    let s = 0;
    if (k === q) s = 100;
    else if (k.startsWith(q)) s = 80;
    else if (k.split(" ").some(w => w.startsWith(q))) s = 60;
    else if (q.length >= 3 && k.includes(q)) s = 40;
    if (s > best) best = s;
  }
  return best;
}

export class Index {
  private items: { term: Term; keys: string[] }[] = [];
  private porN = new Map<number, Term>();
  constructor(terms: Term[]) {
    this.items = terms.map(t => ({ term: t, keys: keysOf(t) }));
    for (const t of terms) if (t.n >= 0) this.porN.set(t.n, t);
  }
  /** Términos de «Ver también» que existen en el índice, en el orden de la nota. */
  relacionados(t: Term): Term[] { return t.ver_tambien.map(n => this.porN.get(n)).filter((x): x is Term => !!x); }
  get size() { return this.items.length; }
  all(): Term[] { return this.items.map(i => i.term); }
  dominios(): string[] { return [...new Set(this.items.map(i => i.term.dominio))].sort(); }
  search(query: string, dominio?: string, limit = 50): Term[] {
    const q = norm(query);
    const pool = dominio ? this.items.filter(i => i.term.dominio === dominio) : this.items;
    if (!q) return pool.slice(0, limit).map(i => i.term);
    const hits: Hit[] = [];
    for (const i of pool) { const score = scoreTerm(i.keys, q); if (score) hits.push({ term: i.term, score }); }
    hits.sort((a, b) => b.score - a.score || a.term.en.localeCompare(b.term.en));
    return hits.slice(0, limit).map(h => h.term);
  }
  /** Mapa clave normalizada → término, para el hover. Claves cortas (<minLen) se omiten por ruido. */
  hoverMap(minLen = 4): Map<string, Term> {
    const m = new Map<string, Term>();
    for (const i of this.items) for (const k of i.keys) if (k.length >= minLen && !m.has(k)) m.set(k, i.term);
    return m;
  }
}

export type Lang = "es" | "en";
/** Definición en el idioma pedido; si falta, cae al español (E2 llena el inglés). */
export function simple(t: Term, lang: Lang) { return (lang === "en" && t.simple_en) || t.simple_es; }
export function tecnica(t: Term, lang: Lang) { return (lang === "en" && t.tecnica_en) || t.tecnica_es; }
export function ejemplo(t: Term, lang: Lang) { return (lang === "en" && t.ejemplo_en) || t.ejemplo_es; }
/** Recorta en el último espacio antes de `max` y agrega «…»; el hover nunca pasa de 150 caracteres. */
export function recorta(s: string, max = 150): string {
  if (s.length <= max) return s;
  const corte = s.slice(0, max - 1), sp = corte.lastIndexOf(" ");
  return (sp > max * 0.6 ? corte.slice(0, sp) : corte).replace(/[\s,;:.]+$/, "") + "…";
}
export function dominioCorto(d: string) { return d.replace(/^\d+\s*·\s*/, ""); }

/** Parsea el frontmatter simple que genera scripts/generar_notas.py (clave: valor JSON o booleano). */
export function parseFrontmatter(text: string): Record<string, unknown> | null {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(": ");
    if (i < 0) continue;
    const raw = line.slice(i + 2).trim();
    try { fm[line.slice(0, i)] = JSON.parse(raw); } catch { fm[line.slice(0, i)] = raw; }
  }
  return fm;
}

const str = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" || typeof v === "boolean" ? String(v) : "");

export function termFromFrontmatter(path: string, fm: Record<string, unknown>): Term | null {
  if (!fm?.en || !fm?.es) return null;
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(str) : typeof v === "string" && v ? [v] : []);
  return {
    path, en: str(fm.en), es: str(fm.es), aliases: arr(fm.aliases), dominio: str(fm.dominio),
    simple_es: str(fm.simple_es), tecnica_es: str(fm.tecnica_es),
    simple_en: str(fm.simple_en), tecnica_en: str(fm.tecnica_en),
    ejemplo_es: str(fm.ejemplo_es), ejemplo_en: str(fm.ejemplo_en),
    ver_tambien: Array.isArray(fm.ver_tambien) ? (fm.ver_tambien as unknown[]).map(Number).filter(Number.isInteger) : [],
    n: typeof fm.n === "number" && Number.isInteger(fm.n) ? fm.n : -1, verificar: fm.verificar === true,
  };
}

// ---------- Vista A–Z ----------
export const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
/** Texto por el que se ordena y agrupa un término según el idioma elegido. */
export function clave(t: Term, orden: Lang) { return orden === "en" ? t.en : t.es; }
export function letra(s: string): string {
  const c = norm(s).charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
}
export interface Grupo { letra: string; items: Term[]; }
export function agrupaAZ(terms: Term[], orden: Lang): Grupo[] {
  const a = [...terms].sort((x, y) => norm(clave(x, orden)).localeCompare(norm(clave(y, orden))));
  const out: Grupo[] = [];
  for (const t of a) {
    const l = letra(clave(t, orden));
    const g = out[out.length - 1];
    if (g && g.letra === l) g.items.push(t); else out.push({ letra: l, items: [t] });
  }
  // «#» (cifras y siglas con número) va primero, como en un glosario impreso
  return out.sort((x, y) => (x.letra === "#" ? -1 : y.letra === "#" ? 1 : x.letra.localeCompare(y.letra)));
}

// ---------- Estudio ----------
export interface Card { term: Term; frontLang: Lang; }
/** Las `falladas` (rutas de la sesión anterior) van primero; el resto se completa al azar. */
export function buildDeck(terms: Term[], n: number, rnd: () => number = Math.random, falladas: string[] = []): Card[] {
  const a = [...terms];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  const f = new Set(falladas);
  const orden = [...a.filter(t => f.has(t.path)), ...a.filter(t => !f.has(t.path))];
  return orden.slice(0, n).map(term => ({ term, frontLang: rnd() < 0.5 ? "en" : "es" }));
}
export interface Session { date: string; total: number; correct: number; }
export function summarize(history: Session[]) {
  const total = history.reduce((s, h) => s + h.total, 0), correct = history.reduce((s, h) => s + h.correct, 0);
  const sobre10 = history.map(h => (h.total ? (h.correct / h.total) * 10 : 0));
  const mejor = sobre10.length ? Math.round(Math.max(...sobre10)) : 0;
  const promedio = sobre10.length ? Math.round((sobre10.reduce((a, b) => a + b, 0) / sobre10.length) * 10) / 10 : 0;
  return { sessions: history.length, total, correct, pct: total ? Math.round((correct / total) * 100) : 0, promedio, mejor };
}

// ---------- Términos propios ----------
export interface NuevoTermino { en: string; es: string; dominio: string; simple_es: string; simple_en: string; tecnica_es: string; tecnica_en: string; ejemplo_es: string; ejemplo_en: string; }

/** Nombre de archivo seguro (sin caracteres que Obsidian o el sistema rechazan). */
export function nombreArchivo(s: string): string {
  return s.replace(/[\\/:*?"<>|#^[\]]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100) || "Término";
}

/** Datos que una edición conserva de la nota original (el formulario no los muestra). */
export interface Conservado { aliases: string[]; ver_tambien: number[]; verificar: boolean; vinculos: string; }

/** Nota con el mismo formato que las del glosario base; `n` sigue la numeración existente. */
export function notaDeTermino(t: NuevoTermino, n: number, c?: Conservado): { nombre: string; contenido: string } {
  const j = JSON.stringify;
  const dominio = t.dominio.trim() || "Mis términos";
  const fm = [
    "---", `cssclasses: ["wg-nota"]`, `en: ${j(t.en)}`, `es: ${j(t.es)}`, `aliases: ${j(c?.aliases ?? [])}`, `dominio: ${j(dominio)}`,
    `simple_es: ${j(t.simple_es)}`, `tecnica_es: ${j(t.tecnica_es)}`, `simple_en: ${j(t.simple_en)}`, `tecnica_en: ${j(t.tecnica_en)}`,
    `ejemplo_es: ${j(t.ejemplo_es)}`, `ejemplo_en: ${j(t.ejemplo_en)}`, `ver_tambien: ${j(c?.ver_tambien ?? [])}`, `n: ${n}`, `verificar: ${c?.verificar ? "true" : "false"}`, "---",
  ];
  const cuerpo = [`# ${t.en} · ${t.es}`, ""];
  if (t.simple_es) cuerpo.push(`**En simple.** ${t.simple_es}`, "");
  if (t.tecnica_es) cuerpo.push(`**Técnica.** ${t.tecnica_es}`, "");
  if (t.ejemplo_es) cuerpo.push(`**Ejemplo de uso.** _${t.ejemplo_es}_`, "");
  if (t.simple_en || t.tecnica_en || t.ejemplo_en) cuerpo.push("---", "");
  if (t.simple_en) cuerpo.push(`**In simple.** ${t.simple_en}`, "");
  if (t.tecnica_en) cuerpo.push(`**Technical.** ${t.tecnica_en}`, "");
  if (t.ejemplo_en) cuerpo.push(`**Example.** _${t.ejemplo_en}_`, "");
  if (c?.vinculos) cuerpo.push(`**Ver también.** ${c.vinculos}`, "");
  return { nombre: nombreArchivo(t.en) + ".md", contenido: fm.join("\n") + "\n" + cuerpo.join("\n").trimEnd() + "\n" };
}
