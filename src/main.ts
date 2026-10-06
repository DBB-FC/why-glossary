import { App, ItemView, Modal, Notice, Plugin, PluginSettingTab, Setting, SuggestModal, TFile, setIcon, WorkspaceLeaf } from "obsidian";
import {
  ABC, Index, Lang, Session, Term, agrupaAZ, buildDeck, clave, dominioCorto, ejemplo, letra, norm,
  NuevoTermino, nombreArchivo, notaDeTermino, parseFrontmatter, recorta, simple, summarize, tecnica, termFromFrontmatter,
} from "./lib";

declare const __STARTER__: { file: string; content: string }[];

interface Settings { carpeta: string; idioma: Lang; hover: boolean; abrirAlInicio: boolean; baseInstalada: boolean; mazo: number; historial: Session[]; falladas: string[]; }
const DEFAULTS: Settings = { carpeta: "Why Glossary", idioma: "es", hover: true, abrirAlInicio: true, baseInstalada: false, mazo: 10, historial: [], falladas: [] };
const VIEW_PANEL = "why-glossary-panel";
const VIEW_MAIN = "why-glossary-main";

export default class WhyGlossary extends Plugin {
  settings: Settings = { ...DEFAULTS };
  index = new Index([]);
  private byPath = new Map<string, Term>();
  private hoverRe: RegExp | null = null;
  private hoverMap = new Map<string, Term>();
  private tip: HTMLElement | null = null;

  async onload() {
    const saved = await this.loadData();
    this.settings = Object.assign({}, DEFAULTS, saved, { historial: saved?.historial ?? [], falladas: saved?.falladas ?? [] });
    this.registerView(VIEW_PANEL, leaf => new PanelView(leaf, this));
    this.registerView(VIEW_MAIN, leaf => new MainView(leaf, this));
    this.addRibbonIcon("book-a", "Why Glossary: abrir glosario", () => this.abrirGlosario());
    this.addCommand({ id: "glosario", name: "Abrir glosario", callback: () => this.abrirGlosario() });
    this.addCommand({ id: "buscar", name: "Buscar término", callback: () => this.buscar() });
    this.addCommand({ id: "panel", name: "Abrir panel del glosario", callback: () => this.abrirPanel() });
    this.addCommand({ id: "estudiar", name: "Modo estudio", callback: () => this.estudiar() });
    this.addCommand({ id: "agregar", name: "Ingresá tus términos (agregar uno nuevo)", callback: () => this.agregar() });
    this.addCommand({ id: "base", name: "Instalar el glosario base", callback: () => this.instalarBase(true) });
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
      if (this.settings.abrirAlInicio && !this.app.workspace.getLeavesOfType(VIEW_MAIN).length) this.abrirGlosario();
    });
    const dentro = (f: TFile) => f.path.startsWith(this.settings.carpeta.replace(/\/$/, "") + "/");
    for (const ev of ["modify", "create", "delete", "rename"] as const)
      this.registerEvent((this.app.vault as any).on(ev, (f: TFile) => { if (f instanceof TFile && dentro(f)) this.recargarPronto(); }));
  }

  onunload() { this.ocultaTip(); }
  async saveSettings() { await this.saveData(this.settings); }

  private t: number | undefined;
  recargarPronto() { window.clearTimeout(this.t); this.t = window.setTimeout(() => this.recargar(), 800); }

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
    if (avisar) new Notice(nuevas ? `Why Glossary: ${nuevas} términos instalados.` : "Why Glossary: el glosario base ya estaba instalado.");
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
    this.hoverRe = keys.length ? new RegExp("(?<![\\p{L}\\p{N}])(" + keys.join("|") + ")(?![\\p{L}\\p{N}])", "giu") : null;
    for (const type of [VIEW_PANEL, VIEW_MAIN]) this.app.workspace.getLeavesOfType(type).forEach(l => (l.view as unknown as GlossaryLeaf).refrescar());
  }

  private sinTerminos() {
    if (this.index.size) return false;
    new Notice(`Why Glossary: la carpeta «${this.settings.carpeta}» no tiene términos. Usa «Ingresá tus términos» o «Instalar el glosario base».`);
    return true;
  }
  buscar() { if (!this.sinTerminos()) new SearchModal(this.app, this).open(); }
  estudiar() { if (!this.sinTerminos()) new StudyModal(this.app, this).open(); }
  async abrirGlosario() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_MAIN)[0];
    if (!leaf) { leaf = this.app.workspace.getLeaf(true); await leaf.setViewState({ type: VIEW_MAIN, active: true }); }
    this.app.workspace.revealLeaf(leaf);
  }
  async abrirPanel() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_PANEL)[0];
    if (!leaf) { leaf = this.app.workspace.getRightLeaf(false)!; await leaf.setViewState({ type: VIEW_PANEL, active: true }); }
    this.app.workspace.revealLeaf(leaf);
  }
  ficha(t: Term) { new CardModal(this.app, this, t).open(); }
  abrirNota(t: Term) {
    const f = this.app.vault.getAbstractFileByPath(t.path);
    if (f instanceof TFile) this.app.workspace.getLeaf(false).openFile(f);
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
        const t = this.hoverMap.get(norm(m[1])); if (!t) continue;
        frag ??= document.createDocumentFragment();
        frag.append(txt.slice(last, m.index));
        const s = createSpan({ cls: "wg-term", text: m[1] });
        s.dataset.wg = t.path; s.tabIndex = 0; s.setAttr("role", "button");
        frag.append(s);
        last = m.index + m[1].length;
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
    tip.createDiv({ cls: "wg-tip-foot", text: `${dominioCorto(t.dominio)} · clic abre la entrada · Tab también` });
    const r = s.getBoundingClientRect();
    tip.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 316)) + "px";
    const abajo = r.bottom + 8, alto = tip.offsetHeight;
    tip.style.top = (abajo + alto > window.innerHeight ? Math.max(8, r.top - alto - 8) : abajo) + "px";
  }
  private ocultaTip() { this.tip?.remove(); this.tip = null; }
}

function termEl(e: Event): HTMLElement | null {
  return ((e.target as HTMLElement)?.closest?.(".wg-term") as HTMLElement | null) ?? null;
}

interface GlossaryLeaf { refrescar(): void; }

function copiar(texto: string) {
  navigator.clipboard.writeText(texto).then(() => new Notice("Copiado"), () => new Notice("No se pudo copiar"));
}
/** «Chargeback ↔ Contracargo» con la flecha en lima. */
function par(el: HTMLElement, t: Term, primero: Lang = "en") {
  const [a, b] = primero === "en" ? [t.en, t.es] : [t.es, t.en];
  el.append(a + " ", createSpan({ cls: "wg-arrow", text: "↔" }), " " + b);
}
function verTambien(el: HTMLElement, rel: Term[], onPick?: (t: Term) => void) {
  const fila = el.createDiv({ cls: "wg-see" });
  fila.createSpan({ cls: "wg-lbl", text: "Ver también" });
  for (const r of rel) {
    if (onPick) { const b = fila.createEl("button", { cls: "wg-pill" }); par(b, r); b.onclick = () => onPick(r); }
    else fila.createSpan({ cls: "wg-pill", text: `${r.en} ↔ ${r.es}` });
  }
}

// ---------- Ficha ----------
class CardModal extends Modal {
  private lang: Lang;
  private copiado = false;
  constructor(app: App, private p: WhyGlossary, private t: Term) { super(app); this.lang = p.settings.idioma; }
  onOpen() { this.modalEl.addClass("wg-modal", "wg-ficha", "wg-scope"); this.pinta(); }
  private ir(t: Term) { this.t = t; this.copiado = false; this.pinta(); }
  private pinta() {
    const { t, lang } = this, es = lang === "es", el = this.contentEl; el.empty();
    const cab = el.createDiv({ cls: "wg-head" });
    const fila = cab.createDiv({ cls: "wg-row-top" });
    fila.createSpan({ cls: "wg-mono wg-mut", text: dominioCorto(t.dominio).toUpperCase() });
    fila.createSpan({ cls: "wg-mono wg-mut wg-push", text: "DEFINICIONES EN" });
    for (const l of ["es", "en"] as Lang[]) {
      const b = fila.createEl("button", { cls: "wg-toggle wg-mono", text: l.toUpperCase() });
      b.setAttr("aria-pressed", String(l === lang)); b.toggleClass("on", l === lang);
      b.onclick = () => { this.lang = l; this.copiado = false; this.pinta(); };
    }
    if (t.verificar) cab.createDiv({ cls: "wg-warn", text: "Traducción por verificar" });
    const pares = cab.createDiv({ cls: "wg-terms" });
    const lado = (tag: string, txt: string) => { const d = pares.createDiv({ cls: "wg-side" }); d.createSpan({ cls: "wg-tag", text: tag }); d.createDiv({ cls: "wg-big", text: txt }); };
    lado("ES", t.es); pares.createDiv({ cls: "wg-big wg-arrow wg-mid", text: "↔" }); lado("EN", t.en);

    const cuerpo = el.createDiv({ cls: "wg-body" });
    const caja = cuerpo.createDiv({ cls: "wg-simple" });
    caja.createDiv({ cls: "wg-lbl wg-acc", text: es ? "En simple" : "In plain words" });
    caja.createDiv({ cls: "wg-simple-text", text: simple(t, lang) });
    const acc = caja.createDiv({ cls: "wg-actions" });
    const bc = acc.createEl("button", { cls: "wg-primary", text: this.copiado ? "Copiado ✓" : es ? "Copiar explicación simple" : "Copy simple explanation" });
    bc.onclick = () => { copiar(simple(t, lang)); this.copiado = true; bc.setText("Copiado ✓"); };
    acc.createSpan({ cls: "wg-hint", text: es ? "Pega el texto listo en tu nota o mensaje" : "Paste the ready text into your note or message" });

    const sec = (h: string, txt: string, cls = "") => { if (!txt) return; const d = cuerpo.createDiv({ cls: "wg-sec" }); d.createDiv({ cls: "wg-lbl wg-mut", text: h }); d.createDiv({ cls: "wg-sec-text " + cls, text: txt }); };
    sec(es ? "Técnica" : "Technical", tecnica(t, lang));
    sec(es ? "Ejemplo de uso" : "Usage example", ejemplo(t, lang), "wg-ital");
    const rel = this.p.index.relacionados(t);
    if (rel.length) verTambien(cuerpo, rel, r => this.ir(r));

    const pie = el.createDiv({ cls: "wg-foot" });
    const bt = pie.createEl("button", { cls: "wg-ghost", text: es ? "Copiar técnica" : "Copy technical" }); bt.onclick = () => copiar(tecnica(t, lang));
    pie.createEl("button", { cls: "wg-ghost", text: es ? "Abrir nota" : "Open note" }).onclick = () => { this.close(); this.p.abrirNota(t); };
    const v = pie.createEl("button", { cls: "wg-link wg-mono wg-push", text: es ? "← VOLVER AL GLOSARIO" : "← BACK TO GLOSSARY" });
    v.onclick = () => { this.close(); this.p.abrirGlosario(); };
  }
}

class SearchModal extends SuggestModal<Term> {
  constructor(app: App, private p: WhyGlossary) { super(app); this.setPlaceholder("Buscar en inglés o español…"); }
  getSuggestions(q: string) { return this.p.index.search(q); }
  renderSuggestion(t: Term, el: HTMLElement) {
    el.createDiv({ text: `${t.en} ↔ ${t.es}` });
    el.createEl("small", { text: dominioCorto(t.dominio) });
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
  private dom = ""; private orden: Lang = "en"; private letraSel = ""; private q = "";
  private inp!: HTMLInputElement;
  private lateral!: HTMLElement; private cab!: HTMLElement; private az!: HTMLElement; private lista!: HTMLElement; private prev!: HTMLElement; private sel: Term | null = null;
  constructor(leaf: WorkspaceLeaf, private p: WhyGlossary) { super(leaf); }
  getViewType() { return VIEW_MAIN; }
  getDisplayText() { return "Glosario"; }
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

  private muestra(t: Term | null, kicker: string) {
    const el = this.prev; el.empty(); if (!t) return;
    if (kicker === "VISTA PREVIA") this.sel = t;
    const lang = this.p.settings.idioma; const v = dominioVisual(t.dominio);
    el.style.setProperty("--dc", v.color);
    const top = el.createDiv({ cls: "wg-prev-top" });
    setIcon(top.createSpan({ cls: "wg-dico wg-dico-lg" }), v.icon);
    const meta = top.createDiv({ cls: "wg-prev-meta" });
    meta.createDiv({ cls: "wg-mono wg-prev-kick", text: kicker });
    meta.createDiv({ cls: "wg-mono wg-mut", text: dominioCorto(t.dominio).toUpperCase() });
    el.createDiv({ cls: "wg-prev-en", text: t.en });
    el.createDiv({ cls: "wg-prev-es", text: t.es });
    const box = el.createDiv({ cls: "wg-prev-simple" });
    box.createDiv({ cls: "wg-lbl wg-prev-lbl", text: lang === "en" ? "In plain words" : "En simple" });
    box.createDiv({ text: simple(t, lang) });
    const tec = t.tecnica_es || t.tecnica_en;
    if (tec) { el.createDiv({ cls: "wg-lbl wg-mut", text: lang === "en" ? "Technical" : "Técnica" }); el.createDiv({ cls: "wg-prev-tec", text: (lang === "en" && t.tecnica_en) || t.tecnica_es }); }
    const ej = ejemplo(t, lang);
    if (ej) { el.createDiv({ cls: "wg-lbl wg-mut", text: lang === "en" ? "Example" : "Ejemplo" }); el.createDiv({ cls: "wg-prev-ej", text: ej }); }
    const btn = el.createEl("button", { cls: "wg-primary wg-prev-open", text: "Abrir entrada →" });
    btn.onclick = () => this.p.ficha(t);
  }

  private pinta() {
    const todos = this.p.index.all();
    // Dominios
    const lat = this.lateral; lat.empty();
    lat.createDiv({ cls: "wg-lbl wg-mut wg-side-title", text: "Dominios" });
    const item = (valor: string, texto: string, n: number) => {
      const b = lat.createEl("button", { cls: "wg-dom-btn" }); b.toggleClass("on", this.dom === valor);
      const v = valor ? dominioVisual(valor) : { icon: "library", color: "#c6f432" };
      b.style.setProperty("--dc", v.color);
      setIcon(b.createSpan({ cls: "wg-dico" }), v.icon);
      b.createSpan({ cls: "wg-dom-name", text: texto }); b.createSpan({ cls: "wg-mono wg-mut", text: String(n) });
      b.onclick = () => { this.dom = valor; this.letraSel = ""; this.pinta(); };
    };
    item("", "Todos", todos.length);
    for (const d of this.p.index.dominios()) item(d, dominioCorto(d), todos.filter(t => t.dominio === d).length);

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
      tit.createDiv({ cls: "wg-title", text: "Entiende cualquier término, en dos idiomas." });
      const nuevo = marca.createEl("button", { cls: "wg-primary wg-add-btn", text: "＋ Ingresá tus términos" });
      nuevo.onclick = () => this.p.agregar();
      const ord = marca.createDiv({ cls: "wg-order" });
      ord.createSpan({ cls: "wg-lbl wg-mut", text: "Orden" });
      for (const l of ["en", "es"] as Lang[]) {
        const b = ord.createEl("button", { cls: "wg-toggle wg-mono wg-ord-" + l, text: l.toUpperCase() });
        b.onclick = () => { this.orden = l; this.letraSel = ""; this.pinta(); };
      }
      const caja = h.createDiv({ cls: "wg-searchbox" });
      caja.createSpan({ cls: "wg-search-ico", text: "⌕" });
      const inp = (this.inp = caja.createEl("input", { cls: "wg-input wg-search", type: "search", placeholder: "Busca en inglés o español…" }));
      caja.createSpan({ cls: "wg-kbd", text: "/" });
      inp.setAttr("aria-label", "Buscar términos");
      inp.oninput = () => { this.q = inp.value; this.letraSel = ""; this.pinta(); };
      inp.onkeydown = e => {
        if (e.key === "Enter") { const t = this.primero(); if (t) this.p.ficha(t); }
        else if (e.key === "ArrowDown") { e.preventDefault(); (this.lista.querySelector(".wg-entry") as HTMLElement | null)?.focus(); }
        else if (e.key === "Escape" && inp.value) { inp.value = ""; this.q = ""; this.pinta(); }
      };
      h.createDiv({ cls: "wg-mono wg-mut wg-count" });
      this.registerDomEvent(this.contentEl, "keydown", (e: KeyboardEvent) => {
        const a = document.activeElement;
        if (e.key === "/" && !(a instanceof HTMLInputElement)) { e.preventDefault(); inp.focus(); }
      });
      window.setTimeout(() => inp.focus(), 50);
    }
    h.querySelector(".wg-count")!.setText(`${this.dom || this.q ? `${lista.length} DE ${todos.length}` : todos.length} TÉRMINOS · ORDENADO POR ${this.orden === "en" ? "INGLÉS" : "ESPAÑOL"}`);
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
      e.createDiv({ text: "Tu glosario está vacío." });
      const b1 = e.createEl("button", { cls: "wg-primary", text: "Ingresá tus términos" }); b1.onclick = () => this.p.agregar();
      const b2 = e.createEl("button", { cls: "wg-toggle", text: "Instalar el glosario base" }); b2.onclick = () => this.p.instalarBase(true);
    } else if (!visibles.length) this.lista.createDiv({ cls: "wg-empty", text: "Sin resultados." });
    if (!this.sel || !todos.includes(this.sel)) {
      const d = new Date(); this.sel = todos.length ? todos[(d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % todos.length] : null;
      this.muestra(this.sel, "TÉRMINO DEL DÍA");
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
        top.createSpan({ cls: "wg-mono wg-mut wg-dom-tag", text: dominioCorto(t.dominio).toUpperCase() });
        r.createDiv({ cls: "wg-entry-simple", text: simple(t, this.p.settings.idioma) });
        const rel = this.p.index.relacionados(t);
        if (rel.length) {
          const v = r.createDiv({ cls: "wg-mono wg-mut wg-entry-see", text: "VER TAMBIÉN · " });
          v.createSpan({ cls: "wg-acc", text: rel.map(x => (this.orden === "en" ? x.en : x.es)).join(" · ") });
        }
        const abre = () => this.p.ficha(t);
        r.onclick = abre;
        r.onmouseenter = () => this.muestra(t, "VISTA PREVIA");
        r.onfocus = () => this.muestra(t, "VISTA PREVIA");
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
  getDisplayText() { return "Why Glossary"; }
  getIcon() { return "book-a"; }
  async onOpen() { this.refrescar(); }

  refrescar() {
    const root = this.contentEl; root.empty(); root.addClass("wg-scope", "wg-panel");
    const cab = root.createDiv({ cls: "wg-panel-head" });
    const t = cab.createDiv({ cls: "wg-panel-title" });
    t.createSpan({ cls: "wg-panel-name", text: "Why Glossary" });
    this.cuenta = t.createSpan({ cls: "wg-mono wg-mut" });
    const inp = cab.createEl("input", { cls: "wg-input", type: "search", placeholder: "Filtrar el glosario" });
    inp.setAttr("aria-label", "Buscar en el panel"); inp.value = this.q;
    inp.oninput = () => { this.q = inp.value; this.pinta(); };
    const fila = cab.createDiv({ cls: "wg-dom-row" });
    fila.createEl("label", { cls: "wg-mono wg-mut", text: "DOMINIO" });
    const doms = this.p.index.dominios();
    const sel = fila.createEl("select", { cls: "wg-select" });
    sel.createEl("option", { text: `Todos (${doms.length})`, value: "" });
    for (const d of doms) sel.createEl("option", { text: dominioCorto(d), value: d });
    sel.value = this.dom; sel.onchange = () => { this.dom = sel.value; this.pinta(); };
    this.az = cab.createDiv({ cls: "wg-mono wg-az-strip" });
    this.lista = root.createDiv({ cls: "wg-panel-list" });
    this.det = root.createDiv({ cls: "wg-panel-detail" });
    this.pinta();
  }

  private pinta() {
    const todos = this.p.index.all();
    this.cuenta.setText(`${todos.length} TÉRMINOS`);
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
    if (!res.length) this.lista.createDiv({ cls: "wg-empty", text: "Sin resultados." });
    for (const t of res) {
      const row = this.lista.createDiv({ cls: "wg-prow" }); row.toggleClass("on", t === this.sel);
      row.tabIndex = 0; row.setAttr("role", "button"); par(row, t);
      row.onclick = () => { this.sel = t; this.copiado = false; this.pinta(); };
      row.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); row.click(); } };
      if (t === this.sel) window.setTimeout(() => row.scrollIntoView({ block: "nearest" }), 0);
    }

    const d = this.det; d.empty();
    const t = this.sel; if (!t) return;
    d.createDiv({ cls: "wg-mono wg-acc wg-label-lg", text: "EN SIMPLE" });
    d.createDiv({ cls: "wg-panel-text", text: simple(t, this.p.settings.idioma) });
    const rel = this.p.index.relacionados(t);
    if (rel.length) { const v = d.createDiv({ cls: "wg-mono wg-mut wg-entry-see", text: "VER TAMBIÉN · " }); v.createSpan({ cls: "wg-acc", text: rel.map(x => x.en).join(" · ") }); }
    const b = d.createDiv({ cls: "wg-actions" });
    const bc = b.createEl("button", { cls: "wg-primary", text: this.copiado ? "Copiado ✓" : "Copiar explicación simple" });
    bc.onclick = () => { copiar(simple(t, this.p.settings.idioma)); this.copiado = true; bc.setText("Copiado ✓"); };
    b.createEl("button", { cls: "wg-ghost", text: "Abrir entrada" }).onclick = () => this.p.ficha(t);
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
    fila.createSpan({ text: "Modo estudio · todos los dominios" });
    fila.createSpan({ cls: "wg-acc wg-push", text: `${Math.min(this.i + 1, n)} / ${n}` });
    const barra = cab.createDiv({ cls: "wg-progress" }); barra.setAttr("role", "progressbar");
    barra.createDiv({ cls: "wg-progress-fill" }).style.width = (n ? (this.i / n) * 100 : 0) + "%";
    const cuerpo = el.createDiv({ cls: "wg-card" });
    if (fin) return void this.final(cuerpo);

    const c = this.deck[this.i], t = c.term, lang = this.p.settings.idioma;
    const otro: Lang = c.frontLang === "en" ? "es" : "en";
    cuerpo.createDiv({ cls: "wg-lbl wg-mut", text: "¿Qué significa?" });
    const f = cuerpo.createDiv({ cls: "wg-card-front" });
    f.createSpan({ cls: "wg-tag", text: c.frontLang.toUpperCase() }); f.createSpan({ cls: "wg-huge", text: clave(t, c.frontLang) });
    if (!this.volteada) {
      const b = cuerpo.createEl("button", { cls: "wg-primary", text: "Mostrar respuesta" });
      b.onclick = () => { this.volteada = true; this.paint(); }; b.focus();
      return;
    }
    const r = cuerpo.createDiv({ cls: "wg-answer" });
    const rt = r.createDiv({ cls: "wg-answer-top" });
    rt.createSpan({ cls: "wg-tag", text: otro.toUpperCase() }); rt.createSpan({ cls: "wg-answer-term", text: clave(t, otro) });
    r.createDiv({ text: simple(t, lang) });
    const b = cuerpo.createDiv({ cls: "wg-actions wg-center" });
    const sig = (acierto: boolean) => { if (acierto) this.ok++; else this.falladas.push(t.path); this.i++; this.volteada = false; this.paint(); };
    b.createEl("button", { cls: "wg-ghost", text: "No la sabía" }).onclick = () => sig(false);
    const si = b.createEl("button", { cls: "wg-primary", text: "La sabía" }); si.onclick = () => sig(true); si.focus();
  }
  private async final(el: HTMLElement) {
    const s: Session = { date: new Date().toISOString().slice(0, 10), total: this.deck.length, correct: this.ok };
    this.p.settings.historial.push(s); this.p.settings.falladas = this.falladas; await this.p.saveSettings();
    const r = summarize(this.p.settings.historial), num = (x: number) => String(x).replace(".", ",");
    el.createDiv({ cls: "wg-lbl wg-mut", text: "Sesión terminada" });
    const sc = el.createDiv({ cls: "wg-score", text: String(s.correct) });
    sc.createSpan({ cls: "wg-score-of", text: ` de ${s.total}` });
    el.createDiv({ cls: "wg-hint wg-narrow", text: this.falladas.length ? "Las que fallaste vuelven primero en la próxima sesión." : "No fallaste ninguna. La próxima sesión es de términos nuevos." });
    el.createDiv({ cls: "wg-mono wg-stats", text: `${r.sessions} ${r.sessions === 1 ? "SESIÓN" : "SESIONES"} · PROMEDIO ${num(r.promedio)} DE 10 · MEJOR ${r.mejor}` });
    const b = el.createEl("button", { cls: "wg-primary", text: "Otra sesión" }); b.onclick = () => this.nueva(); b.focus();
  }
}

class AddTermModal extends Modal {
  private v: NuevoTermino = { en: "", es: "", dominio: "", simple_es: "", simple_en: "", tecnica_es: "", tecnica_en: "", ejemplo_es: "", ejemplo_en: "" };
  constructor(app: App, private p: WhyGlossary) { super(app); }
  onOpen() {
    const el = this.contentEl; el.empty(); el.addClass("wg-scope", "wg-add");
    this.titleEl.setText("Ingresá tus términos");
    el.createDiv({ cls: "wg-hint", text: "Cada término es una nota en tu carpeta del glosario. Solo el nombre en inglés y en español es obligatorio." });
    const campo = (k: keyof NuevoTermino, etiqueta: string, ph: string, largo = false) => {
      const w = el.createDiv({ cls: "wg-field" });
      w.createEl("label", { cls: "wg-lbl wg-mut", text: etiqueta });
      const i = largo ? w.createEl("textarea", { cls: "wg-input", attr: { rows: "2", placeholder: ph } }) : w.createEl("input", { cls: "wg-input", type: "text", placeholder: ph });
      i.oninput = () => { this.v[k] = i.value; };
      return i;
    };
    const primero = campo("en", "Término en inglés", "Chargeback");
    campo("es", "Término en español", "Contracargo");
    const dl = el.createDiv({ cls: "wg-field" });
    dl.createEl("label", { cls: "wg-lbl wg-mut", text: "Dominio (opcional)" });
    const dom = dl.createEl("input", { cls: "wg-input", type: "text", placeholder: "Mis términos", attr: { list: "wg-dominios" } });
    const lista = dl.createEl("datalist", { attr: { id: "wg-dominios" } });
    for (const d of this.p.index.dominios()) lista.createEl("option", { value: d });
    dom.oninput = () => { this.v.dominio = dom.value; };
    campo("simple_es", "En simple (español)", "Una explicación que entienda cualquiera", true);
    campo("simple_en", "In plain words (English)", "Optional", true);
    campo("tecnica_es", "Técnica (español)", "Opcional", true);
    campo("ejemplo_es", "Ejemplo de uso (español)", "Opcional");
    const btn = el.createEl("button", { cls: "wg-primary", text: "Guardar término" });
    btn.onclick = async () => {
      if (!this.v.en.trim() || !this.v.es.trim()) { new Notice("Escribe el término en inglés y en español."); return; }
      const f = await this.p.crearTermino({ ...this.v, en: this.v.en.trim(), es: this.v.es.trim() });
      new Notice(`«${nombreArchivo(this.v.en)}» agregado a tu glosario.`);
      this.close(); this.p.app.workspace.getLeaf(false).openFile(f);
    };
    window.setTimeout(() => primero.focus(), 50);
  }
  onClose() { this.contentEl.empty(); }
}

class SettingsTab extends PluginSettingTab {
  constructor(app: App, private p: WhyGlossary) { super(app, p); }
  display() {
    const el = this.containerEl; el.empty();
    new Setting(el).setName("Carpeta del glosario").setDesc("Carpeta de la bóveda con las notas de los términos.")
      .addText(t => t.setValue(this.p.settings.carpeta).onChange(async v => { this.p.settings.carpeta = v.trim() || "Why Glossary"; await this.p.saveSettings(); this.p.recargarPronto(); }));
    new Setting(el).setName("Idioma de las definiciones").setDesc("Si falta la definición en inglés, se muestra la de español.")
      .addDropdown(d => d.addOption("es", "Español").addOption("en", "English").setValue(this.p.settings.idioma).onChange(async v => { this.p.settings.idioma = v as Lang; await this.p.saveSettings(); this.p.recargarPronto(); }));
    new Setting(el).setName("Ver definición al pasar el cursor").setDesc("Subraya los términos del glosario en modo lectura.")
      .addToggle(t => t.setValue(this.p.settings.hover).onChange(async v => { this.p.settings.hover = v; await this.p.saveSettings(); }));
    new Setting(el).setName("Abrir el glosario al iniciar Obsidian").setDesc("La pantalla del glosario aparece sola al abrir la bóveda.")
      .addToggle(t => t.setValue(this.p.settings.abrirAlInicio).onChange(async v => { this.p.settings.abrirAlInicio = v; await this.p.saveSettings(); }));
    new Setting(el).setName("Tus términos").setDesc("Agrega un término propio. Se guarda como una nota en «Mis términos», dentro de la carpeta del glosario.")
      .addButton(b => b.setButtonText("Ingresá tus términos").setCta().onClick(() => this.p.agregar()));
    new Setting(el).setName("Glosario base").setDesc("Instala o repone los términos generales (tecnología, negocio, diseño). No pisa tus notas ni tus cambios.")
      .addButton(b => b.setButtonText("Instalar glosario base").onClick(() => this.p.instalarBase(true)));
    new Setting(el).setName("Tarjetas por sesión de estudio")
      .addSlider(s => s.setLimits(5, 30, 5).setValue(this.p.settings.mazo).setDynamicTooltip().onChange(async v => { this.p.settings.mazo = v; await this.p.saveSettings(); }));
  }
}
