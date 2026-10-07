import { App, ItemView, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, SuggestModal, TAbstractFile, TFile, ViewStateResult, setIcon, WorkspaceLeaf } from "obsidian";
import {
  ABC, Index, Lang, Session, Term, agrupaAZ, buildDeck, clave, dominioNombre, ejemplo, letra, norm,
  Conservado, NuevoTermino, nombreArchivo, notaDeTermino, parseFrontmatter, recorta, simple, summarize, tecnica, termFromFrontmatter,
} from "./lib";

declare const __STARTER__: { file: string; content: string }[];

interface Settings { carpeta: string; idioma: Lang; hover: boolean; abrirAlInicio: boolean; tarjeta: boolean; baseInstalada: boolean; mazo: number; historial: Session[]; falladas: string[]; }
const tr = (l: Lang, es: string, en: string) => (l === "en" ? en : es);
const DEFAULTS: Settings = { carpeta: "Why Glossary", idioma: "es", hover: true, abrirAlInicio: true, tarjeta: true, baseInstalada: false, mazo: 10, historial: [], falladas: [] };
const VIEW_PANEL = "why-glossary-panel";
const VIEW_MAIN = "why-glossary-main";
const VIEW_TERM = "why-glossary-term";

export default class WhyGlossary extends Plugin {
  settings: Settings = { ...DEFAULTS };
  index = new Index([]);
  private byPath = new Map<string, Term>();
  private hoverRe: RegExp | null = null;
  private hoverMap = new Map<string, Term>();
  private tip: HTMLElement | null = null;

  async onload() {
    const saved = (await this.loadData()) as Partial<Settings> | null;
    this.settings = Object.assign({}, DEFAULTS, saved, { historial: saved?.historial ?? [], falladas: saved?.falladas ?? [] });
    this.registerView(VIEW_PANEL, leaf => new PanelView(leaf, this));
    this.registerView(VIEW_MAIN, leaf => new MainView(leaf, this));
    this.registerView(VIEW_TERM, leaf => new TermView(leaf, this));
    this.addRibbonIcon("book-a", this.tx("Abrir glosario", "Open glossary"), () => { void this.abrirGlosario(); });
    this.addCommand({ id: "glosario", name: this.tx("Abrir glosario", "Open glossary"), callback: () => { void this.abrirGlosario(); } });
    this.addCommand({ id: "buscar", name: this.tx("Buscar término", "Search term"), callback: () => this.buscar() });
    this.addCommand({ id: "panel", name: this.tx("Abrir panel del glosario", "Open glossary panel"), callback: () => { void this.abrirPanel(); } });
    this.addCommand({ id: "estudiar", name: this.tx("Modo estudio", "Study mode"), callback: () => this.estudiar() });
    this.addCommand({ id: "agregar", name: this.tx("Ingresá tus términos (agregar uno nuevo)", "Add your terms (new term)"), callback: () => { void this.agregar(); } });
    this.addCommand({ id: "tarjeta", name: this.tx("Ver la nota actual como tarjeta", "View the current note as a card"), callback: () => this.verComoTarjeta() });
    this.addCommand({ id: "base", name: this.tx("Instalar el glosario base", "Install the base glossary"), callback: () => { void this.instalarBase(true); } });
    this.registerEvent(this.app.workspace.on("file-open", f => { void this.alAbrir(f); }));
    this.app.workspace.onLayoutReady(() => { const f = this.app.workspace.getActiveFile(); if (f) window.setTimeout(() => { void this.alAbrir(f); }, 600); });
    this.addSettingTab(new SettingsTab(this.app, this));
    this.registerMarkdownPostProcessor(el => this.marcarTerminos(el));

    // Hover: ratón y teclado (Tab) muestran la definición; clic o Enter abren la entrada.
    this.registerDomEvent(document, "mouseover", e => { const s = termEl(e); if (s) this.muestraTip(s); });
    this.registerDomEvent(document, "mouseout", e => { if (termEl(e)) this.ocultaTip(); });
    this.registerDomEvent(document, "focusin", e => { const s = termEl(e); if (s) this.muestraTip(s); });
    this.registerDomEvent(document, "focusout", e => { if (termEl(e)) this.ocultaTip(); });
    this.registerDomEvent(document, "keydown", e => {
      if (e.key === "Escape") this.ocultaTip();
      if (e.key === "Enter") { const s = termEl(e); const t = s && this.byPath.get(s.dataset.wg ?? ""); if (t) { e.preventDefault(); this.ocultaTip(); this.ficha(t); } }
    });
    this.registerDomEvent(document, "click", e => {
      const s = termEl(e); const t = s && this.byPath.get(s.dataset.wg ?? "");
      if (t) { e.preventDefault(); this.ocultaTip(); this.ficha(t); }
    });

    this.app.workspace.onLayoutReady(async () => {
      // Primer arranque: si la carpeta está vacía, el glosario base se instala solo y funciona al primer clic.
      if (!this.settings.baseInstalada) { this.settings.baseInstalada = true; await this.saveSettings(); if (!this.notasDelGlosario().length) await this.instalarBase(false); }
      await this.recargar();
      // Instala y abre: el glosario aparece solo al iniciar Obsidian.
      if (this.settings.abrirAlInicio && !this.app.workspace.getLeavesOfType(VIEW_MAIN).length) await this.abrirGlosario();
    });
    const dentro = (f: TFile) => f.path.startsWith(this.settings.carpeta.replace(/\/$/, "") + "/");
    for (const ev of ["modify", "create", "delete", "rename"] as const)
      this.registerEvent(this.app.vault.on(ev as "modify", (f: TAbstractFile) => { if (f instanceof TFile && dentro(f)) this.recargarPronto(); }));
  }

  onunload() { this.ocultaTip(); }
  tx(es: string, en: string) { return tr(this.settings.idioma, es, en); }
  refrescaVistas() { for (const type of [VIEW_PANEL, VIEW_MAIN, VIEW_TERM]) this.app.workspace.getLeavesOfType(type).forEach(l => (l.view as unknown as GlossaryLeaf).refrescar()); }
  async cambiaIdioma(l: Lang) { this.settings.idioma = l; await this.saveSettings(); this.refrescaVistas(); }
  async saveSettings() { await this.saveData(this.settings); }

  private t: number | undefined;
  recargarPronto() { window.clearTimeout(this.t); this.t = window.setTimeout(() => { void this.recargar(); }, 800); }

  private notasDelGlosario(): TFile[] {
    const prefijo = this.settings.carpeta.replace(/\/$/, "") + "/";
    return this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(prefijo));
  }

  /** Copia el glosario base a la carpeta; nunca pisa una nota que ya exista (tus cambios se conservan). */
  async instalarBase(avisar: boolean) {
    const dir = this.settings.carpeta.replace(/\/$/, "") + "/Glosario base";
    if (!this.app.vault.getAbstractFileByPath(dir)) await this.app.vault.createFolder(dir).catch(() => {});
    let nuevas = 0;
    for (const { file, content } of __STARTER__) {
      const ruta = `${dir}/${file}`;
      if (this.app.vault.getAbstractFileByPath(ruta)) continue;
      await this.app.vault.create(ruta, content); nuevas++;
    }
    await this.recargar();
    if (avisar) new Notice(nuevas ? this.tx(`Why Glossary: ${nuevas} términos instalados.`, `Why Glossary: ${nuevas} terms installed.`) : this.tx("Why Glossary: el glosario base ya estaba instalado.", "Why Glossary: the base glossary was already installed."));
  }

  agregar() { new AddTermModal(this.app, this).open(); }

  async crearTermino(t: NuevoTermino): Promise<TFile> {
    const dir = this.settings.carpeta.replace(/\/$/, "") + "/Mis términos";
    if (!this.app.vault.getAbstractFileByPath(dir)) await this.app.vault.createFolder(dir).catch(() => {});
    const n = Math.max(0, ...this.index.all().map(x => x.n)) + 1;
    const { nombre, contenido } = notaDeTermino(t, n);
    let ruta = `${dir}/${nombre}`, i = 2;
    while (this.app.vault.getAbstractFileByPath(ruta)) ruta = `${dir}/${nombre.replace(/\.md$/, "")} ${i++}.md`;
    const f = await this.app.vault.create(ruta, contenido);
    await this.recargar();
    return f;
  }

  async recargar() {
    const terms: Term[] = [];
    for (const f of this.notasDelGlosario()) {
      const fm = parseFrontmatter(await this.app.vault.cachedRead(f));
      const t = fm && termFromFrontmatter(f.path, fm);
      if (t) terms.push(t);
    }
    this.index = new Index(terms);
    this.byPath = new Map(terms.map(t => [t.path, t]));
    this.hoverMap = this.index.hoverMap();
    const keys = [...this.hoverMap.keys()].sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+"));
    this.hoverRe = keys.length ? new RegExp("(^|[^\\p{L}\\p{N}])(" + keys.join("|") + ")(?![\\p{L}\\p{N}])", "giu") : null;
    for (const type of [VIEW_PANEL, VIEW_MAIN, VIEW_TERM]) this.app.workspace.getLeavesOfType(type).forEach(l => (l.view as unknown as GlossaryLeaf).refrescar());
  }

  private sinTerminos() {
    if (this.index.size) return false;
    new Notice(this.tx(`Why Glossary: la carpeta «${this.settings.carpeta}» no tiene términos. Usa «Ingresá tus términos» o «Instalar el glosario base».`, `Why Glossary: the folder "${this.settings.carpeta}" has no terms. Use "Add your terms" or "Install the base glossary".`));
    return true;
  }
  buscar() { if (!this.sinTerminos()) new SearchModal(this.app, this).open(); }
  estudiar() { if (!this.sinTerminos()) new StudyModal(this.app, this).open(); }
  async abrirGlosario() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_MAIN)[0];
    if (!leaf) { leaf = this.app.workspace.getLeaf(true); await leaf.setViewState({ type: VIEW_MAIN, active: true }); }
    await this.app.workspace.revealLeaf(leaf);
  }
  async abrirPanel() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_PANEL)[0];
    if (!leaf) { leaf = this.app.workspace.getRightLeaf(false)!; await leaf.setViewState({ type: VIEW_PANEL, active: true }); }
    await this.app.workspace.revealLeaf(leaf);
  }
  ficha(t: Term) { new CardModal(this.app, this, t).open(); }
  termPorRuta(ruta: string) { return this.byPath.get(ruta); }
  /** Abre la nota como texto (sin convertirla en tarjeta). */
  abrirNota(t: Term) {
    const f = this.app.vault.getAbstractFileByPath(t.path);
    if (!(f instanceof TFile)) return;
    this.comoTexto.add(f.path);
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TERM).find(l => (l.view as TermView).getState().file === f.path) ?? this.app.workspace.getLeaf(false);
    void leaf.openFile(f);
  }
  private comoTexto = new Set<string>();
  /** Nivel 3: al abrir la nota de un término, se muestra como tarjeta. */
  private async alAbrir(f: TFile | null) {
    if (!f) return;
    if (this.comoTexto.delete(f.path)) return;
    if (!this.settings.tarjeta || !f.path.startsWith(this.settings.carpeta.replace(/\/$/, "") + "/")) return;
    try {
      if (!this.byPath.has(f.path)) { new Notice(this.tx(`Why Glossary: «${f.basename}» no está en el índice (${this.byPath.size} términos cargados).`, `Why Glossary: "${f.basename}" is not in the index (${this.byPath.size} terms loaded).`)); return; }
      await this.comoTarjeta(f);
    } catch (e) { new Notice(this.tx("Why Glossary: la tarjeta falló: ", "Why Glossary: the card failed: ") + (e instanceof Error ? e.message : String(e))); console.error(e); }
  }
  /** Convierte en tarjeta la pestaña de texto que muestra esta nota (la activa si hay varias). */
  private async comoTarjeta(f: TFile) {
    const hojas = this.app.workspace.getLeavesOfType("markdown").filter(l => (l.view as MarkdownView).file?.path === f.path);
    if (!hojas.length && this.app.workspace.getLeavesOfType(VIEW_TERM).some(l => (l.view as TermView).getState().file === f.path)) return;
    if (!hojas.length) { new Notice(this.tx(`Why Glossary: no encontré la pestaña de «${f.basename}» (${this.app.workspace.getLeavesOfType("markdown").length} pestañas de texto).`, `Why Glossary: I could not find the tab for "${f.basename}" (${this.app.workspace.getLeavesOfType("markdown").length} text tabs).`)); return; }
    const activa = this.app.workspace.getMostRecentLeaf();
    const hoja = hojas.find(l => l === activa) ?? hojas[0];
    await hoja.setViewState({ type: VIEW_TERM, state: { file: f.path }, active: true });
  }
  /** Comando de respaldo: muestra como tarjeta la nota abierta. */
  verComoTarjeta() {
    const f = this.app.workspace.getActiveFile();
    if (!f || !this.byPath.has(f.path)) { new Notice(this.tx("Esta nota no es un término del glosario.", "This note is not a glossary term.")); return; }
    void this.comoTarjeta(f);
  }
  editar(t: Term) { new AddTermModal(this.app, this, t).open(); }
  /** Reescribe la nota de un término conservando su numeración, alias y «ver también». */
  async guardarEdicion(t: Term, v: NuevoTermino) {
    const f = this.app.vault.getAbstractFileByPath(t.path);
    if (!(f instanceof TFile)) throw new Error("Nota no encontrada");
    const vinculos = this.index.relacionados(t).map(r => `[[${r.path.replace(/^.*\//, "").replace(/\.md$/, "")}|${r.en} ↔ ${r.es}]]`).join(" · ");
    const c: Conservado = { aliases: t.aliases, ver_tambien: t.ver_tambien, verificar: t.verificar, vinculos };
    await this.app.vault.modify(f, notaDeTermino(v, t.n, c).contenido);
    await this.recargar();
  }

  // ---- Hover (modo lectura) ----
  private marcarTerminos(el: HTMLElement) {
    if (!this.settings.hover || !this.hoverRe) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentElement?.closest("code, pre, a, .wg-term, h1, h2, h3, h4, h5, h6")) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const nodos: Text[] = [];
    while (walker.nextNode()) nodos.push(walker.currentNode as Text);
    for (const n of nodos) {
      const txt = n.data; this.hoverRe.lastIndex = 0;
      let m: RegExpExecArray | null, last = 0, frag: DocumentFragment | null = null;
      while ((m = this.hoverRe.exec(txt))) {
        const t = this.hoverMap.get(norm(m[2])); if (!t) continue;
        const ini = m.index + m[1].length;
        frag ??= createFragment();
        frag.append(txt.slice(last, ini));
        const s = createSpan({ cls: "wg-term", text: m[2] });
        s.dataset.wg = t.path; s.tabIndex = 0; s.setAttr("role", "button");
        frag.append(s);
        last = ini + m[2].length;
      }
      if (frag) { frag.append(txt.slice(last)); n.replaceWith(frag); }
    }
  }
  private muestraTip(s: HTMLElement) {
    const t = this.byPath.get(s.dataset.wg ?? ""); if (!t) return;
    this.ocultaTip();
    const tip = (this.tip = document.body.createDiv({ cls: "wg-scope wg-tip" }));
    const par = tip.createDiv({ cls: "wg-tip-pair" });
    par.append(t.en + " ", createSpan({ cls: "wg-arrow", text: "↔" }), " " + t.es);
    tip.createDiv({ cls: "wg-tip-text", text: recorta(simple(t, this.settings.idioma)) });
    tip.createDiv({ cls: "wg-tip-foot", text: `${dominioNombre(t.dominio, this.settings.idioma)} · ${this.tx("clic abre la entrada · Tab también", "click opens the entry · Tab too")}` });
    const r = s.getBoundingClientRect();
    tip.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 316)) + "px";
    const abajo = r.bottom + 8, alto = tip.offsetHeight;
    tip.style.top = (abajo + alto > window.innerHeight ? Math.max(8, r.top - alto - 8) : abajo) + "px";
  }
  private ocultaTip() { this.tip?.remove(); this.tip = null; }
}

function termEl(e: Event): HTMLElement | null {
  return (e.target as HTMLElement)?.closest?.<HTMLElement>(".wg-term") ?? null;
}

interface GlossaryLeaf { refrescar(): void; }

function copiar(texto: string, lang: Lang) {
  navigator.clipboard.writeText(texto).then(() => new Notice(tr(lang, "Copiado", "Copied")), () => new Notice(tr(lang, "No se pudo copiar", "Could not copy")));
}
/** «Chargeback ↔ Contracargo» con la flecha en lima. */
function par(el: HTMLElement, t: Term, primero: Lang = "en") {
  const [a, b] = primero === "en" ? [t.en, t.es] : [t.es, t.en];
  el.append(a + " ", createSpan({ cls: "wg-arrow", text: "↔" }), " " + b);
}
function verTambien(el: HTMLElement, rel: Term[], lang: Lang, onPick?: (t: Term) => void) {
  const fila = el.createDiv({ cls: "wg-see" });
  fila.createSpan({ cls: "wg-lbl", text: tr(lang, "Ver también", "See also") });
  for (const r of rel) {
    if (onPick) { const b = fila.createEl("button", { cls: "wg-pill" }); par(b, r); b.onclick = () => onPick(r); }
    else fila.createSpan({ cls: "wg-pill", text: `${r.en} ↔ ${r.es}` });
  }
}

// ---------- Ficha ----------
interface FichaEstado { lang: Lang; copiado: boolean; }
interface FichaAcciones { redibujar(): void; ir(t: Term): void; pie(pie: HTMLElement, es: boolean): void; }

/** La ficha completa de un término; la comparten la ventana emergente y la vista de tarjeta. */
function pintaFicha(el: HTMLElement, p: WhyGlossary, t: Term, st: FichaEstado, a: FichaAcciones) {
  const lang = st.lang, es = lang === "es"; el.empty();
  const cab = el.createDiv({ cls: "wg-head" });
  const fila = cab.createDiv({ cls: "wg-row-top" });
  fila.createSpan({ cls: "wg-mono wg-mut", text: dominioNombre(t.dominio, lang).toUpperCase() });
  fila.createSpan({ cls: "wg-mono wg-mut wg-push", text: es ? "DEFINICIONES EN" : "DEFINITIONS IN" });
  for (const l of ["es", "en"] as Lang[]) {
    const b = fila.createEl("button", { cls: "wg-toggle wg-mono", text: l.toUpperCase() });
    b.setAttr("aria-pressed", String(l === lang)); b.toggleClass("on", l === lang);
    b.onclick = () => { st.lang = l; st.copiado = false; a.redibujar(); };
  }
  if (t.verificar) cab.createDiv({ cls: "wg-warn", text: es ? "Traducción por verificar" : "Translation to be verified" });
  const pares = cab.createDiv({ cls: "wg-terms" });
  const lado = (tag: string, txt: string) => { const d = pares.createDiv({ cls: "wg-side" }); d.createSpan({ cls: "wg-tag", text: tag }); d.createDiv({ cls: "wg-big", text: txt }); };
  lado("ES", t.es); pares.createDiv({ cls: "wg-big wg-arrow wg-mid", text: "↔" }); lado("EN", t.en);

  const cuerpo = el.createDiv({ cls: "wg-body" });
  const caja = cuerpo.createDiv({ cls: "wg-simple" });
  caja.createDiv({ cls: "wg-lbl wg-acc", text: es ? "En simple" : "In plain words" });
  caja.createDiv({ cls: "wg-simple-text", text: simple(t, lang) });
  const acc = caja.createDiv({ cls: "wg-actions" });
  const bc = acc.createEl("button", { cls: "wg-primary", text: st.copiado ? (es ? "Copiado ✓" : "Copied ✓") : es ? "Copiar explicación simple" : "Copy simple explanation" });
  bc.onclick = () => { copiar(simple(t, lang), lang); st.copiado = true; bc.setText(es ? "Copiado ✓" : "Copied ✓"); };
  acc.createSpan({ cls: "wg-hint", text: es ? "Pega el texto listo en tu nota o mensaje" : "Paste the ready text into your note or message" });

  const sec = (h: string, txt: string, cls = "") => { if (!txt) return; const d = cuerpo.createDiv({ cls: "wg-sec" }); d.createDiv({ cls: "wg-lbl wg-mut", text: h }); d.createDiv({ cls: "wg-sec-text " + cls, text: txt }); };
  sec(es ? "Técnica" : "Technical", tecnica(t, lang));
  sec(es ? "Ejemplo de uso" : "Usage example", ejemplo(t, lang), "wg-ital");
  const rel = p.index.relacionados(t);
  if (rel.length) verTambien(cuerpo, rel, lang, r => a.ir(r));

  const pie = el.createDiv({ cls: "wg-foot" });
  pie.createEl("button", { cls: "wg-ghost", text: es ? "Copiar técnica" : "Copy technical" }).onclick = () => copiar(tecnica(t, lang), lang);
  a.pie(pie, es);
}

class CardModal extends Modal {
  private st: FichaEstado;
  constructor(app: App, private p: WhyGlossary, private t: Term) { super(app); this.st = { lang: p.settings.idioma, copiado: false }; }
  onOpen() { this.modalEl.addClass("wg-modal", "wg-ficha", "wg-scope"); this.pinta(); }
  private pinta() {
    pintaFicha(this.contentEl, this.p, this.t, this.st, {
      redibujar: () => this.pinta(),
      ir: r => { this.t = r; this.st.copiado = false; this.pinta(); },
      pie: (pie, es) => {
        pie.createEl("button", { cls: "wg-ghost", text: es ? "Abrir nota" : "Open note" }).onclick = () => { this.close(); this.p.abrirNota(this.t); };
        const v = pie.createEl("button", { cls: "wg-link wg-mono wg-push", text: es ? "← VOLVER AL GLOSARIO" : "← BACK TO GLOSSARY" });
        v.onclick = () => { this.close(); void this.p.abrirGlosario(); };
      },
    });
  }
}

/** Nivel 3: la nota del término se abre como tarjeta dentro de la pestaña, con edición. */
class TermView extends ItemView implements GlossaryLeaf {
  private ruta = "";
  private st: FichaEstado;
  constructor(leaf: WorkspaceLeaf, private p: WhyGlossary) { super(leaf); this.st = { lang: p.settings.idioma, copiado: false }; }
  getViewType() { return VIEW_TERM; }
  getIcon() { return "book-a"; }
  getDisplayText() { const t = this.p.termPorRuta(this.ruta); return t ? t.en : this.p.tx("Término", "Term"); }
  getState() { return { file: this.ruta }; }
  async setState(state: unknown, result: ViewStateResult) {
    this.ruta = (state as { file?: string } | null)?.file ?? "";
    await super.setState(state, result);
    this.pinta();
  }
  onOpen() { this.contentEl.addClass("wg-scope", "wg-termview"); return Promise.resolve(); }
  refrescar() { this.pinta(); }
  private pinta() {
    const el = this.contentEl; el.empty();
    const t = this.p.termPorRuta(this.ruta);
    const barra = el.createDiv({ cls: "wg-tv-bar" });
    barra.createSpan({ cls: "wg-mono wg-mut wg-tv-path", text: this.ruta });
    const cuando = (txt: string, fn: () => void) => barra.createEl("button", { cls: "wg-ghost", text: txt }).onclick = fn;
    if (t) cuando(this.p.tx("Editar", "Edit"), () => this.p.editar(t));
    cuando(this.p.tx("+ Nuevo término", "+ New term"), () => this.p.agregar());
    if (t) cuando(this.p.tx("Abrir la nota en texto", "Open the note as text"), () => this.p.abrirNota(t));
    const tarjeta = el.createDiv({ cls: "wg-tv-card" });
    if (!t) { tarjeta.createDiv({ cls: "wg-hint", text: this.p.tx("Esta nota no es un término del glosario, o el glosario aún se está cargando.", "This note is not a glossary term, or the glossary is still loading.") }); return; }
    pintaFicha(tarjeta, this.p, t, this.st, {
      redibujar: () => this.pinta(),
      ir: r => { this.st.copiado = false; void this.leaf.setViewState({ type: VIEW_TERM, state: { file: r.path }, active: true }); },
      pie: (pie, es) => { pie.createSpan({ cls: "wg-mono wg-mut wg-push", text: es ? `Término ${t.n} · Why Glossary` : `Term ${t.n} · Why Glossary` }); },
    });
  }
}

class SearchModal extends SuggestModal<Term> {
  constructor(app: App, private p: WhyGlossary) { super(app); this.setPlaceholder(p.tx("Buscar en inglés o español…", "Search in English or Spanish…")); }
  getSuggestions(q: string) { return this.p.index.search(q); }
  renderSuggestion(t: Term, el: HTMLElement) {
    el.createDiv({ text: `${t.en} ↔ ${t.es}` });
    el.createEl("small", { text: dominioNombre(t.dominio, this.p.settings.idioma) });
  }
  onChooseSuggestion(t: Term) { this.p.ficha(t); }
}

// ---------- Vista principal: glosario A–Z ----------
const VISUAL: Record<string, [string, string]> = {
  "01": ["handshake", "#ffb454"], "02": ["pen-tool", "#ff7eb6"], "03": ["code-xml", "#62b0ff"], "04": ["database", "#22d3c5"],
  "05": ["cloud", "#8bd3ff"], "06": ["bug", "#ff8a5b"], "07": ["shield-check", "#ff6b6b"], "08": ["blocks", "#a58bff"],
  "09": ["sparkles", "#e879f9"], "10": ["wallet", "#4ade80"], "11": ["landmark", "#f2d46b"], "12": ["bot", "#c6f432"],
};
function dominioVisual(d: string): { icon: string; color: string } {
  const [icon, color] = VISUAL[d.slice(0, 2)] ?? ["book-a", "#c6f432"];
  return { icon, color };
}

class MainView extends ItemView implements GlossaryLeaf {
  private dom = ""; private get orden(): Lang { return this.p.settings.idioma; } private letraSel = ""; private q = "";
  private inp!: HTMLInputElement;
  private lateral!: HTMLElement; private cab!: HTMLElement; private az!: HTMLElement; private lista!: HTMLElement; private prev!: HTMLElement; private sel: Term | null = null;
  constructor(leaf: WorkspaceLeaf, private p: WhyGlossary) { super(leaf); }
  getViewType() { return VIEW_MAIN; }
  getDisplayText() { return this.p.tx("Glosario", "Glossary"); }
  getIcon() { return "book-a"; }
  async onOpen() { this.refrescar(); }

  private primero(): Term | undefined { return agrupaAZ(this.filtrados(), this.orden)[0]?.items[0]; }

  private filtrados(): Term[] {
    const base = this.q.trim() ? this.p.index.search(this.q, this.dom || undefined, 1000) : this.p.index.all().filter(t => !this.dom || t.dominio === this.dom);
    return base;
  }

  refrescar() {
    const root = this.contentEl; root.empty(); root.addClass("wg-scope", "wg-main");
    this.lateral = root.createEl("aside", { cls: "wg-side-nav" });
    const col = root.createDiv({ cls: "wg-col" });
    this.cab = col.createEl("header", { cls: "wg-main-head" });
    this.az = col.createDiv({ cls: "wg-az" });
    this.lista = col.createDiv({ cls: "wg-entries" });
    this.prev = root.createEl("aside", { cls: "wg-preview" });
    this.sel = null;
    this.pinta();
  }

  private muestra(t: Term | null, kicker: string, fija = false) {
    const el = this.prev; el.empty(); if (!t) return;
    if (fija) this.sel = t;
    const lang = this.p.settings.idioma; const v = dominioVisual(t.dominio);
    el.style.setProperty("--dc", v.color);
    const top = el.createDiv({ cls: "wg-prev-top" });
    setIcon(top.createSpan({ cls: "wg-dico wg-dico-lg" }), v.icon);
    const meta = top.createDiv({ cls: "wg-prev-meta" });
    meta.createDiv({ cls: "wg-mono wg-prev-kick", text: kicker });
    meta.createDiv({ cls: "wg-mono wg-mut", text: dominioNombre(t.dominio, this.p.settings.idioma).toUpperCase() });
    el.createDiv({ cls: "wg-prev-en", text: t.en });
    el.createDiv({ cls: "wg-prev-es", text: t.es });
    const box = el.createDiv({ cls: "wg-prev-simple" });
    box.createDiv({ cls: "wg-lbl wg-prev-lbl", text: lang === "en" ? "In plain words" : "En simple" });
    box.createDiv({ text: simple(t, lang) });
    const tec = t.tecnica_es || t.tecnica_en;
    if (tec) { el.createDiv({ cls: "wg-lbl wg-mut", text: lang === "en" ? "Technical" : "Técnica" }); el.createDiv({ cls: "wg-prev-tec", text: (lang === "en" && t.tecnica_en) || t.tecnica_es }); }
    const ej = ejemplo(t, lang);
    if (ej) { el.createDiv({ cls: "wg-lbl wg-mut", text: lang === "en" ? "Example" : "Ejemplo" }); el.createDiv({ cls: "wg-prev-ej", text: ej }); }
    const btn = el.createEl("button", { cls: "wg-primary wg-prev-open", text: this.p.tx("Abrir entrada →", "Open entry →") });
    btn.onclick = () => this.p.ficha(t);
  }

  private pinta() {
    const todos = this.p.index.all();
    // Dominios
    const lat = this.lateral; lat.empty();
    lat.createDiv({ cls: "wg-lbl wg-mut wg-side-title", text: this.p.tx("Dominios", "Domains") });
    const item = (valor: string, texto: string, n: number) => {
      const b = lat.createEl("button", { cls: "wg-dom-btn" }); b.toggleClass("on", this.dom === valor);
      const v = valor ? dominioVisual(valor) : { icon: "library", color: "#c6f432" };
      b.style.setProperty("--dc", v.color);
      setIcon(b.createSpan({ cls: "wg-dico" }), v.icon);
      b.createSpan({ cls: "wg-dom-name", text: texto }); b.createSpan({ cls: "wg-mono wg-mut", text: String(n) });
      b.onclick = () => { this.dom = valor; this.letraSel = ""; this.pinta(); };
    };
    item("", this.p.tx("Todos", "All"), todos.length);
    for (const d of this.p.index.dominios()) item(d, dominioNombre(d, this.p.settings.idioma), todos.filter(t => t.dominio === d).length);

    const lista = this.filtrados();
    const grupos = agrupaAZ(lista, this.orden);
    const presentes = new Set(grupos.map(g => g.letra));
    if (this.letraSel && !presentes.has(this.letraSel)) this.letraSel = "";

    // Cabecera (el input se conserva para no perder el foco al teclear)
    const h = this.cab;
    if (!h.childElementCount) {
      const marca = h.createDiv({ cls: "wg-brand" });
      const tit = marca.createDiv({ cls: "wg-grow" });
      tit.createDiv({ cls: "wg-kicker", text: "WHY GLOSSARY · EN ↔ ES" });
      tit.createDiv({ cls: "wg-title", text: this.p.tx("Entiende cualquier término, en dos idiomas.", "Understand any term, in two languages.") });
      const nuevo = marca.createEl("button", { cls: "wg-primary wg-add-btn", text: this.p.tx("＋ Ingresá tus términos", "＋ Add your terms") });
      nuevo.onclick = () => { void this.p.agregar(); };
      const ord = marca.createDiv({ cls: "wg-order" });
      ord.createSpan({ cls: "wg-lbl wg-mut", text: this.p.tx("Idioma", "Language") });
      for (const l of ["en", "es"] as Lang[]) {
        const b = ord.createEl("button", { cls: "wg-toggle wg-mono wg-ord-" + l, text: l.toUpperCase() });
        b.onclick = () => { this.letraSel = ""; void this.p.cambiaIdioma(l); };
      }
      const caja = h.createDiv({ cls: "wg-searchbox" });
      caja.createSpan({ cls: "wg-search-ico", text: "⌕" });
      const inp = (this.inp = caja.createEl("input", { cls: "wg-input wg-search", type: "search", placeholder: this.p.tx("Busca en inglés o español…", "Search in English or Spanish…") }));
      caja.createSpan({ cls: "wg-kbd", text: "/" });
      inp.setAttr("aria-label", this.p.tx("Buscar términos", "Search terms"));
      inp.oninput = () => { this.q = inp.value; this.letraSel = ""; this.pinta(); };
      inp.onkeydown = e => {
        if (e.key === "Enter") { const t = this.primero(); if (t) this.p.ficha(t); }
        else if (e.key === "ArrowDown") { e.preventDefault(); this.lista.querySelector<HTMLElement>(".wg-entry")?.focus(); }
        else if (e.key === "Escape" && inp.value) { inp.value = ""; this.q = ""; this.pinta(); }
      };
      h.createDiv({ cls: "wg-mono wg-mut wg-count" });
      this.registerDomEvent(this.contentEl, "keydown", (e: KeyboardEvent) => {
        const a = document.activeElement;
        if (e.key === "/" && !(a instanceof HTMLInputElement)) { e.preventDefault(); inp.focus(); }
      });
      window.setTimeout(() => inp.focus(), 50);
    }
    h.querySelector(".wg-count")!.setText(this.p.tx(`${this.dom || this.q ? `${lista.length} DE ${todos.length}` : todos.length} TÉRMINOS · ORDENADO POR ${this.orden === "en" ? "INGLÉS" : "ESPAÑOL"}`, `${this.dom || this.q ? `${lista.length} OF ${todos.length}` : todos.length} TERMS · SORTED BY ${this.orden === "en" ? "ENGLISH" : "SPANISH"}`));
    for (const l of ["en", "es"] as Lang[]) {
      const b = h.querySelector(".wg-ord-" + l) as HTMLElement; b.toggleClass("on", this.orden === l); b.setAttr("aria-pressed", String(this.orden === l));
    }

    // Barra A–Z
    this.az.empty();
    for (const l of ABC) {
      const b = this.az.createEl("button", { cls: "wg-az-btn wg-mono", text: l });
      b.toggleClass("has", presentes.has(l)); b.toggleClass("on", this.letraSel === l);
      if (!presentes.has(l)) b.disabled = true;
      b.onclick = () => { this.letraSel = this.letraSel === l ? "" : l; this.pinta(); };
    }

    // Entradas agrupadas
    this.lista.empty();
    const visibles = this.letraSel ? grupos.filter(g => g.letra === this.letraSel) : grupos;
    if (!todos.length) {
      const e = this.lista.createDiv({ cls: "wg-empty" });
      e.createDiv({ text: this.p.tx("Tu glosario está vacío.", "Your glossary is empty.") });
      const b1 = e.createEl("button", { cls: "wg-primary", text: this.p.tx("Ingresá tus términos", "Add your terms") }); b1.onclick = () => { void this.p.agregar(); };
      const b2 = e.createEl("button", { cls: "wg-toggle", text: this.p.tx("Instalar el glosario base", "Install the base glossary") }); b2.onclick = () => { void this.p.instalarBase(true); };
    } else if (!visibles.length) this.lista.createDiv({ cls: "wg-empty", text: this.p.tx("Sin resultados.", "No results.") });
    if (!this.sel || !todos.includes(this.sel)) {
      const d = new Date(); this.sel = todos.length ? todos[(d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % todos.length] : null;
      this.muestra(this.sel, this.p.tx("TÉRMINO DEL DÍA", "TERM OF THE DAY"));
    }
    for (const g of visibles) {
      const hd = this.lista.createDiv({ cls: "wg-letter-row" });
      hd.createSpan({ cls: "wg-letter", text: g.letra }); hd.createSpan({ cls: "wg-rule" });
      for (const t of g.items) {
        const r = this.lista.createDiv({ cls: "wg-entry" });
        r.tabIndex = 0; r.setAttr("role", "button");
        const vis = dominioVisual(t.dominio); r.style.setProperty("--dc", vis.color);
        setIcon(r.createSpan({ cls: "wg-dico" }), vis.icon);
        const top = r.createDiv({ cls: "wg-entry-top" });
        const a = top.createSpan({ cls: "wg-first", text: clave(t, this.orden) });
        top.append(a, createSpan({ cls: "wg-arrow", text: "↔" }), createSpan({ cls: "wg-second", text: clave(t, this.orden === "en" ? "es" : "en") }));
        top.createSpan({ cls: "wg-mono wg-mut wg-dom-tag", text: dominioNombre(t.dominio, this.p.settings.idioma).toUpperCase() });
        r.createDiv({ cls: "wg-entry-simple", text: simple(t, this.p.settings.idioma) });
        const rel = this.p.index.relacionados(t);
        if (rel.length) {
          const v = r.createDiv({ cls: "wg-mono wg-mut wg-entry-see", text: this.p.tx("VER TAMBIÉN · ", "SEE ALSO · ") });
          v.createSpan({ cls: "wg-acc", text: rel.map(x => (this.orden === "en" ? x.en : x.es)).join(" · ") });
        }
        const abre = () => this.p.ficha(t);
        r.onclick = abre;
        r.onmouseenter = () => this.muestra(t, this.p.tx("VISTA PREVIA", "PREVIEW"), true);
        r.onfocus = () => this.muestra(t, this.p.tx("VISTA PREVIA", "PREVIEW"), true);
        r.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abre(); } };
      }
    }
  }
}

// ---------- Panel lateral ----------
class PanelView extends ItemView implements GlossaryLeaf {
  private dom = ""; private q = ""; private sel: Term | null = null; private copiado = false;
  private lista!: HTMLElement; private az!: HTMLElement; private det!: HTMLElement; private cuenta!: HTMLElement;
  constructor(leaf: WorkspaceLeaf, private p: WhyGlossary) { super(leaf); }
  getViewType() { return VIEW_PANEL; }
  getDisplayText() { return "Why glossary"; }
  getIcon() { return "book-a"; }
  async onOpen() { this.refrescar(); }

  refrescar() {
    const root = this.contentEl; root.empty(); root.addClass("wg-scope", "wg-panel");
    const cab = root.createDiv({ cls: "wg-panel-head" });
    const t = cab.createDiv({ cls: "wg-panel-title" });
    t.createSpan({ cls: "wg-panel-name", text: "Why Glossary" });
    this.cuenta = t.createSpan({ cls: "wg-mono wg-mut" });
    const inp = cab.createEl("input", { cls: "wg-input", type: "search", placeholder: this.p.tx("Filtrar el glosario", "Filter the glossary") });
    inp.setAttr("aria-label", this.p.tx("Buscar en el panel", "Search the panel")); inp.value = this.q;
    inp.oninput = () => { this.q = inp.value; this.pinta(); };
    const fila = cab.createDiv({ cls: "wg-dom-row" });
    fila.createEl("label", { cls: "wg-mono wg-mut", text: this.p.tx("DOMINIO", "DOMAIN") });
    const doms = this.p.index.dominios();
    const sel = fila.createEl("select", { cls: "wg-select" });
    sel.createEl("option", { text: `${this.p.tx("Todos", "All")} (${doms.length})`, value: "" });
    for (const d of doms) sel.createEl("option", { text: dominioNombre(d, this.p.settings.idioma), value: d });
    sel.value = this.dom; sel.onchange = () => { this.dom = sel.value; this.pinta(); };
    this.az = cab.createDiv({ cls: "wg-mono wg-az-strip" });
    this.lista = root.createDiv({ cls: "wg-panel-list" });
    this.det = root.createDiv({ cls: "wg-panel-detail" });
    this.pinta();
  }

  private pinta() {
    const todos = this.p.index.all();
    this.cuenta.setText(`${todos.length} ${this.p.tx("TÉRMINOS", "TERMS")}`);
    const base = this.q.trim() ? this.p.index.search(this.q, this.dom || undefined, 1000) : todos.filter(t => !this.dom || t.dominio === this.dom);
    const grupos = agrupaAZ(base, "en"), res = grupos.flatMap(g => g.items);
    if (!this.sel || !res.includes(this.sel)) { this.sel = res[0] ?? null; this.copiado = false; }
    const actual = this.sel ? letra(this.sel.en) : "";
    const presentes = new Set(grupos.map(g => g.letra));

    this.az.empty();
    for (const l of ABC) {
      const s = this.az.createEl("button", { cls: "wg-az-mini", text: l });
      s.toggleClass("has", presentes.has(l)); s.toggleClass("on", l === actual);
      if (!presentes.has(l)) s.disabled = true;
      s.onclick = () => { const t = grupos.find(g => g.letra === l)?.items[0]; if (t) { this.sel = t; this.copiado = false; this.pinta(); } };
    }

    this.lista.empty();
    if (!res.length) this.lista.createDiv({ cls: "wg-empty", text: this.p.tx("Sin resultados.", "No results.") });
    for (const t of res) {
      const row = this.lista.createDiv({ cls: "wg-prow" }); row.toggleClass("on", t === this.sel);
      row.tabIndex = 0; row.setAttr("role", "button"); par(row, t);
      row.onclick = () => { this.sel = t; this.copiado = false; this.pinta(); };
      row.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); row.click(); } };
      if (t === this.sel) window.setTimeout(() => row.scrollIntoView({ block: "nearest" }), 0);
    }

    const d = this.det; d.empty();
    const t = this.sel; if (!t) return;
    d.createDiv({ cls: "wg-mono wg-acc wg-label-lg", text: this.p.tx("EN SIMPLE", "IN PLAIN WORDS") });
    d.createDiv({ cls: "wg-panel-text", text: simple(t, this.p.settings.idioma) });
    const rel = this.p.index.relacionados(t);
    if (rel.length) { const v = d.createDiv({ cls: "wg-mono wg-mut wg-entry-see", text: this.p.tx("VER TAMBIÉN · ", "SEE ALSO · ") }); v.createSpan({ cls: "wg-acc", text: rel.map(x => x.en).join(" · ") }); }
    const b = d.createDiv({ cls: "wg-actions" });
    const bc = b.createEl("button", { cls: "wg-primary", text: this.copiado ? this.p.tx("Copiado ✓", "Copied ✓") : this.p.tx("Copiar explicación simple", "Copy simple explanation") });
    bc.onclick = () => { copiar(simple(t, this.p.settings.idioma), this.p.settings.idioma); this.copiado = true; bc.setText(this.p.tx("Copiado ✓", "Copied ✓")); };
    b.createEl("button", { cls: "wg-ghost", text: this.p.tx("Abrir entrada", "Open entry") }).onclick = () => this.p.ficha(t);
  }
}

// ---------- Estudio ----------
class StudyModal extends Modal {
  private deck = buildDeck([], 0); private i = 0; private ok = 0; private volteada = false; private falladas: string[] = [];
  constructor(app: App, private p: WhyGlossary) { super(app); }
  onOpen() { this.modalEl.addClass("wg-modal", "wg-study", "wg-scope"); this.nueva(); }
  private nueva() {
    this.deck = buildDeck(this.p.index.all(), this.p.settings.mazo, Math.random, this.p.settings.falladas);
    this.i = 0; this.ok = 0; this.volteada = false; this.falladas = []; this.paint();
  }
  private paint() {
    const el = this.contentEl; el.empty();
    const n = this.deck.length, fin = this.i >= n;
    const cab = el.createDiv({ cls: "wg-head" });
    const fila = cab.createDiv({ cls: "wg-row-top wg-lbl wg-mut" });
    fila.createSpan({ text: this.p.tx("Modo estudio · todos los dominios", "Study mode · all domains") });
    fila.createSpan({ cls: "wg-acc wg-push", text: `${Math.min(this.i + 1, n)} / ${n}` });
    const barra = cab.createDiv({ cls: "wg-progress" }); barra.setAttr("role", "progressbar");
    barra.createDiv({ cls: "wg-progress-fill" }).style.width = (n ? (this.i / n) * 100 : 0) + "%";
    const cuerpo = el.createDiv({ cls: "wg-card" });
    if (fin) return void this.final(cuerpo);

    const c = this.deck[this.i], t = c.term, lang = this.p.settings.idioma;
    const otro: Lang = c.frontLang === "en" ? "es" : "en";
    cuerpo.createDiv({ cls: "wg-lbl wg-mut", text: this.p.tx("¿Qué significa?", "What does it mean?") });
    const f = cuerpo.createDiv({ cls: "wg-card-front" });
    f.createSpan({ cls: "wg-tag", text: c.frontLang.toUpperCase() }); f.createSpan({ cls: "wg-huge", text: clave(t, c.frontLang) });
    if (!this.volteada) {
      const b = cuerpo.createEl("button", { cls: "wg-primary", text: this.p.tx("Mostrar respuesta", "Show answer") });
      b.onclick = () => { this.volteada = true; this.paint(); }; b.focus();
      return;
    }
    const r = cuerpo.createDiv({ cls: "wg-answer" });
    const rt = r.createDiv({ cls: "wg-answer-top" });
    rt.createSpan({ cls: "wg-tag", text: otro.toUpperCase() }); rt.createSpan({ cls: "wg-answer-term", text: clave(t, otro) });
    r.createDiv({ text: simple(t, lang) });
    const b = cuerpo.createDiv({ cls: "wg-actions wg-center" });
    const sig = (acierto: boolean) => { if (acierto) this.ok++; else this.falladas.push(t.path); this.i++; this.volteada = false; this.paint(); };
    b.createEl("button", { cls: "wg-ghost", text: this.p.tx("No la sabía", "I did not know it") }).onclick = () => sig(false);
    const si = b.createEl("button", { cls: "wg-primary", text: this.p.tx("La sabía", "I knew it") }); si.onclick = () => sig(true); si.focus();
  }
  private async final(el: HTMLElement) {
    const s: Session = { date: new Date().toISOString().slice(0, 10), total: this.deck.length, correct: this.ok };
    this.p.settings.historial.push(s); this.p.settings.falladas = this.falladas; await this.p.saveSettings();
    const r = summarize(this.p.settings.historial), num = (x: number) => String(x).replace(".", ",");
    el.createDiv({ cls: "wg-lbl wg-mut", text: this.p.tx("Sesión terminada", "Session finished") });
    const sc = el.createDiv({ cls: "wg-score", text: String(s.correct) });
    sc.createSpan({ cls: "wg-score-of", text: this.p.tx(` de ${s.total}`, ` of ${s.total}`) });
    el.createDiv({ cls: "wg-hint wg-narrow", text: this.falladas.length ? this.p.tx("Las que fallaste vuelven primero en la próxima sesión.", "The ones you missed come back first next session.") : this.p.tx("No fallaste ninguna. La próxima sesión es de términos nuevos.", "You missed none. Next session has new terms.") });
    el.createDiv({ cls: "wg-mono wg-stats", text: this.p.tx(`${r.sessions} ${r.sessions === 1 ? "SESIÓN" : "SESIONES"} · PROMEDIO ${num(r.promedio)} DE 10 · MEJOR ${r.mejor}`, `${r.sessions} ${r.sessions === 1 ? "SESSION" : "SESSIONS"} · AVERAGE ${r.promedio} OF 10 · BEST ${r.mejor}`) });
    const b = el.createEl("button", { cls: "wg-primary", text: this.p.tx("Otra sesión", "Another session") }); b.onclick = () => this.nueva(); b.focus();
  }
}

class AddTermModal extends Modal {
  private v: NuevoTermino;
  constructor(app: App, private p: WhyGlossary, private editando?: Term) {
    super(app);
    const t = editando;
    this.v = t
      ? { en: t.en, es: t.es, dominio: t.dominio, simple_es: t.simple_es, simple_en: t.simple_en, tecnica_es: t.tecnica_es, tecnica_en: t.tecnica_en, ejemplo_es: t.ejemplo_es, ejemplo_en: t.ejemplo_en }
      : { en: "", es: "", dominio: "", simple_es: "", simple_en: "", tecnica_es: "", tecnica_en: "", ejemplo_es: "", ejemplo_en: "" };
  }
  onOpen() {
    const el = this.contentEl; el.empty(); el.addClass("wg-scope", "wg-add");
    this.titleEl.setText(this.editando ? this.p.tx("Editar término", "Edit term") : this.p.tx("Ingresá tus términos", "Add your terms"));
    el.createDiv({ cls: "wg-hint", text: this.editando
      ? this.p.tx("Se guarda en la misma nota. Solo el nombre en inglés y en español es obligatorio; el resto es opcional.", "It is saved in the same note. Only the English and Spanish names are required; the rest is optional.")
      : this.p.tx("Cada término es una nota en tu carpeta del glosario. Solo el nombre en inglés y en español es obligatorio.", "Each term is a note in your glossary folder. Only the English and Spanish names are required.") });
    const campo = (k: keyof NuevoTermino, etiqueta: string, ph: string, largo = false) => {
      const w = el.createDiv({ cls: "wg-field" });
      w.createEl("label", { cls: "wg-lbl wg-mut", text: etiqueta });
      const i = largo ? w.createEl("textarea", { cls: "wg-input", attr: { rows: "2", placeholder: ph } }) : w.createEl("input", { cls: "wg-input", type: "text", placeholder: ph });
      i.value = this.v[k]; i.oninput = () => { this.v[k] = i.value; };
      return i;
    };
    const primero = campo("en", this.p.tx("Término en inglés", "Term in English"), "Chargeback");
    campo("es", this.p.tx("Término en español", "Term in Spanish"), "Contracargo");
    const dl = el.createDiv({ cls: "wg-field" });
    dl.createEl("label", { cls: "wg-lbl wg-mut", text: this.p.tx("Dominio (opcional)", "Domain (optional)") });
    const dom = dl.createEl("input", { cls: "wg-input", type: "text", placeholder: "Mis términos", attr: { list: "wg-dominios" } });
    dom.value = this.v.dominio;
    const lista = dl.createEl("datalist", { attr: { id: "wg-dominios" } });
    for (const d of this.p.index.dominios()) lista.createEl("option", { value: d });
    dom.oninput = () => { this.v.dominio = dom.value; };
    campo("simple_es", this.p.tx("En simple (español)", "In plain words (Spanish)"), this.p.tx("Una explicación que entienda cualquiera", "An explanation anyone can follow"), true);
    campo("simple_en", this.p.tx("En simple (inglés)", "In plain words (English)"), this.p.tx("Opcional", "Optional"), true);
    campo("tecnica_es", this.p.tx("Técnica (español)", "Technical (Spanish)"), this.p.tx("Opcional", "Optional"), true);
    campo("tecnica_en", this.p.tx("Técnica (inglés)", "Technical (English)"), this.p.tx("Opcional", "Optional"), true);
    campo("ejemplo_es", this.p.tx("Ejemplo de uso (español)", "Usage example (Spanish)"), this.p.tx("Opcional", "Optional"));
    campo("ejemplo_en", this.p.tx("Ejemplo de uso (inglés)", "Usage example (English)"), this.p.tx("Opcional", "Optional"));
    const acc = el.createDiv({ cls: "wg-actions" });
    const btn = acc.createEl("button", { cls: "wg-primary", text: this.editando ? this.p.tx("Guardar cambios", "Save changes") : this.p.tx("Guardar término", "Save term") });
    acc.createEl("button", { cls: "wg-ghost", text: this.p.tx("Cancelar", "Cancel") }).onclick = () => this.close();
    btn.onclick = async () => {
      if (!this.v.en.trim() || !this.v.es.trim()) { new Notice(this.p.tx("Escribe el término en inglés y en español.", "Enter the term in English and Spanish.")); return; }
      const v = { ...this.v, en: this.v.en.trim(), es: this.v.es.trim() };
      if (this.editando) {
        await this.p.guardarEdicion(this.editando, v);
        new Notice(this.p.tx(`«${v.en}» actualizado.`, `"${v.en}" updated.`)); this.close(); return;
      }
      const f = await this.p.crearTermino(v);
      new Notice(this.p.tx(`«${nombreArchivo(v.en)}» agregado a tu glosario.`, `"${nombreArchivo(v.en)}" added to your glossary.`));
      this.close(); void this.p.app.workspace.getLeaf(false).openFile(f);
    };
    window.setTimeout(() => primero.focus(), 50);
  }
  onClose() { this.contentEl.empty(); }
}

class SettingsTab extends PluginSettingTab {
  constructor(app: App, private p: WhyGlossary) { super(app, p); }
  display() {
    const el = this.containerEl; el.empty(); const x = (es: string, en: string) => this.p.tx(es, en);
    new Setting(el).setName(x("Carpeta del glosario", "Glossary folder")).setDesc(x("Carpeta de la bóveda con las notas de los términos.", "Vault folder with the term notes."))
      .addText(t => t.setValue(this.p.settings.carpeta).onChange(async v => { this.p.settings.carpeta = v.trim() || "Why Glossary"; await this.p.saveSettings(); this.p.recargarPronto(); }));
    new Setting(el).setName(x("Idioma", "Language")).setDesc(x("Idioma de toda la interfaz y de las definiciones. Si falta una definición en inglés, se muestra la de español.", "Language of the whole interface and the definitions. If an English definition is missing, the Spanish one is shown."))
      .addDropdown(d => d.addOption("es", "Español").addOption("en", "English").setValue(this.p.settings.idioma).onChange(async v => { this.p.settings.idioma = v as Lang; await this.p.saveSettings(); this.p.recargarPronto(); this.display(); }));
    new Setting(el).setName(x("Ver definición al pasar el cursor", "Show definition on hover")).setDesc(x("Subraya los términos del glosario en modo lectura.", "Underlines glossary terms in reading mode."))
      .addToggle(t => t.setValue(this.p.settings.hover).onChange(async v => { this.p.settings.hover = v; await this.p.saveSettings(); }));
    new Setting(el).setName(x("Abrir el glosario al iniciar Obsidian", "Open the glossary when Obsidian starts")).setDesc(x("La pantalla del glosario aparece sola al abrir la bóveda.", "The glossary screen opens by itself when you open the vault."))
      .addToggle(t => t.setValue(this.p.settings.abrirAlInicio).onChange(async v => { this.p.settings.abrirAlInicio = v; await this.p.saveSettings(); }));
    new Setting(el).setName(x("Abrir las notas del glosario como tarjeta", "Open glossary notes as a card")).setDesc(x("Al abrir la nota de un término se ve como tarjeta, con cambio de idioma y botón para editar. «Abrir la nota en texto» siempre está disponible.", "Opening a term note shows it as a card, with a language switch and an edit button. \"Open the note as text\" is always available."))
      .addToggle(t => t.setValue(this.p.settings.tarjeta).onChange(async v => { this.p.settings.tarjeta = v; await this.p.saveSettings(); }));
    new Setting(el).setName(x("Tus términos", "Your terms")).setDesc(x("Agrega un término propio. Se guarda como una nota en «Mis términos», dentro de la carpeta del glosario.", "Add your own term. It is saved as a note in \"Mis términos\", inside the glossary folder."))
      .addButton(b => b.setButtonText(x("Ingresá tus términos", "Add your terms")).setCta().onClick(() => { void this.p.agregar(); }));
    new Setting(el).setName(x("Glosario base", "Base glossary")).setDesc(x("Instala o repone los términos generales (tecnología, negocio, diseño). No pisa tus notas ni tus cambios.", "Installs or restores the general terms (technology, business, design). It never overwrites your notes or your changes."))
      .addButton(b => b.setButtonText(x("Instalar glosario base", "Install base glossary")).onClick(() => { void this.p.instalarBase(true); }));
    new Setting(el).setName(x("Tarjetas por sesión de estudio", "Cards per study session"))
      .addSlider(s => s.setLimits(5, 30, 5).setValue(this.p.settings.mazo).onChange(async v => { this.p.settings.mazo = v; await this.p.saveSettings(); }));
  }
}
