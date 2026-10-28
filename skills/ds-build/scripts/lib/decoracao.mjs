// Decoração gerada (nível 3 dos estilos visuais, seção 7 de docs/PLANO-ESTILOS.md).
//
// Cada estilo de nível 3 tem um decoracao.json que escolhe, por slot, um gerador e os parâmetros. Os geradores
// devolvem SVGs determinísticos nas cores finais da marca: a semente é o slug do briefing, então a mesma marca
// gera sempre a mesma decoração. Nenhum SVG tem texto. Os arquivos vão para public/estilo/ e os tokens --deco-*
// apontam para eles; a camada CSS só os usa em superfícies de marca ([data-surface="marca"]).
import { hslToHex } from "./color.mjs";

/** Slots do decoracao.json → token e arquivo. */
export const SLOTS = {
  hero: { token: "--deco-hero", arquivo: "hero.svg" },
  divisoria: { token: "--deco-divider", arquivo: "divisoria.svg" },
  padrao: { token: "--deco-pattern", arquivo: "padrao.svg" },
  textura: { token: "--deco-texture", arquivo: "textura.svg" },
  mascara: { token: "--deco-mask", arquivo: "mascara.svg" },
};

/** Limite de tamanho da decoração de um DS (seção 7). */
export const LIMITE_BYTES = 200 * 1024;

// ---------- Aleatório determinístico ----------

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
/** mulberry32: mesma semente, mesma sequência. */
export function aleatorio(semente) {
  let a = hash(String(semente));
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v) => Number(v.toFixed(1));
const svg = (w, h, corpo, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>${corpo}</svg>\n`;

/** Paleta da decoração a partir das cores finais da marca (HEX), com dessaturação opcional. */
export function paleta(cores, { dessaturar = 0 } = {}) {
  const hex = (c) => (c ? hslToHex({ h: c.h, s: Math.max(0, c.s - dessaturar), l: c.l }) : null);
  const p = {
    primaria: hex(cores.primaria),
    secundaria: hex(cores.secundaria),
    destaque: hex(cores.destaque),
    realce: hex(cores.realce) ?? hex(cores.secundaria),
  };
  return { ...p, todas: [p.primaria, p.secundaria, p.destaque, p.realce] };
}

// ---------- Geradores ----------

/** Ladrilho de padrão: bolinhas, listras ou ziguezague (maximalista; colagem usa a retícula). */
function padrao({ tipo = "bolinhas", tamanho = 32, cor = "primaria", opacidade = 0.35 }, P) {
  const c = P[cor] ?? P.primaria;
  const t = tamanho;
  if (tipo === "listras") {
    return svg(t, t, `<path d="M0 ${t} L${t} 0 M${-t / 2} ${t / 2} L${t / 2} ${-t / 2} M${t / 2} ${t * 1.5} L${t * 1.5} ${t / 2}" stroke="${c}" stroke-width="${n(t / 6)}" opacity="${opacidade}"/>`);
  }
  if (tipo === "ziguezague") {
    return svg(t, t / 2, `<path d="M0 ${t / 2} L${t / 4} 0 L${t / 2} ${t / 2} L${(3 * t) / 4} 0 L${t} ${t / 2}" fill="none" stroke="${c}" stroke-width="${n(t / 10)}" opacity="${opacidade}"/>`);
  }
  return svg(t, t, `<circle cx="${t / 4}" cy="${t / 4}" r="${n(t / 10)}" fill="${c}" opacity="${opacidade}"/><circle cx="${(3 * t) / 4}" cy="${(3 * t) / 4}" r="${n(t / 10)}" fill="${c}" opacity="${opacidade}"/>`);
}

/** Composição de faixas de padrões nas cores da marca (hero do maximalista). */
function camadas(_cfg, P, rnd) {
  const defs = [
    `<pattern id="a" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="3" fill="${P.destaque}"/><circle cx="18" cy="18" r="3" fill="${P.destaque}"/></pattern>`,
    `<pattern id="b" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="20" fill="${P.secundaria}"/></pattern>`,
    `<pattern id="c" width="32" height="16" patternUnits="userSpaceOnUse"><path d="M0 16 L8 0 L16 16 L24 0 L32 16" fill="none" stroke="${P.realce}" stroke-width="4"/></pattern>`,
  ];
  const formas = [];
  const ordem = ["a", "b", "c"];
  for (let i = 0; i < 5; i++) {
    const r = n(60 + rnd() * 90);
    formas.push(`<circle cx="${n(80 + rnd() * 240)}" cy="${n(40 + rnd() * 320)}" r="${r}" fill="url(#${ordem[i % 3]})"/>`);
  }
  formas.push(`<rect x="${n(20 + rnd() * 120)}" y="${n(rnd() * 200)}" width="160" height="160" rx="24" fill="${P.primaria}" opacity="0.5" transform="rotate(${n(-12 + rnd() * 24)} 200 200)"/>`);
  return svg(400, 400, `<defs>${defs.join("")}</defs>${formas.join("")}`);
}

/** Ruído de papel (feTurbulence), com opacidade baixa: nunca passa de 6%. */
function ruido({ opacidade = 0.05, frequencia = 0.9 }) {
  const o = Math.min(0.06, opacidade);
  return svg(200, 200, `<filter id="r"><feTurbulence type="fractalNoise" baseFrequency="${frequencia}" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter><rect width="200" height="200" filter="url(#r)" opacity="${o}"/>`);
}

/** Máscara com borda irregular (grunge, colagem): a superfície ganha bordas rasgadas de poucos pixels. */
function bordaIrregular({ amplitude = 8, passos = 40 }, _P, rnd) {
  const W = 1000, H = 1000, a = amplitude;
  const pts = [];
  for (let i = 0; i <= passos; i++) pts.push([n((W * i) / passos), n(rnd() * a)]);
  for (let i = 1; i <= passos; i++) pts.push([n(W - rnd() * a), n((H * i) / passos)]);
  for (let i = passos - 1; i >= 0; i--) pts.push([n((W * i) / passos), n(H - rnd() * a)]);
  for (let i = passos - 1; i > 0; i--) pts.push([n(rnd() * a), n((H * i) / passos)]);
  return svg(W, H, `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="#000"/>`, ' preserveAspectRatio="none"');
}

/** Curva "chicote" e folhas (art nouveau): composição do hero ou divisória horizontal. */
function ornamento({ forma = "composicao", opacidade = 0.4 }, P, rnd) {
  const c = P.primaria, d = P.secundaria;
  if (forma === "divisoria") {
    const w = 240;
    return svg(w, 24, `<path d="M0 12 C40 ${n(2 + rnd() * 4)}, 80 22, 120 12 S200 ${n(2 + rnd() * 4)}, 240 12" fill="none" stroke="${c}" stroke-width="1.5" opacity="${opacidade + 0.3}"/><circle cx="120" cy="12" r="3" fill="${d}" opacity="${opacidade + 0.3}"/>`);
  }
  const folhas = [];
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const x = n(120 + 160 * t + rnd() * 20), y = n(380 - 340 * t);
    const ang = n(-60 + rnd() * 120);
    folhas.push(`<path d="M0 0 C12 -18, 36 -18, 48 0 C36 18, 12 18, 0 0 Z" transform="translate(${x} ${y}) rotate(${ang})" fill="${i % 2 ? d : c}" opacity="${opacidade}"/>`);
  }
  return svg(400, 400, `<path d="M120 400 C60 300, 260 260, 200 160 S 360 60, 300 0" fill="none" stroke="${c}" stroke-width="3" opacity="${opacidade + 0.2}"/><path d="M160 400 C120 320, 300 280, 240 180" fill="none" stroke="${d}" stroke-width="1.5" opacity="${opacidade}"/>${folhas.join("")}<rect x="8" y="8" width="384" height="384" rx="40" fill="none" stroke="${c}" stroke-width="1" opacity="${opacidade}"/><rect x="16" y="16" width="368" height="368" rx="34" fill="none" stroke="${c}" stroke-width="1" opacity="${opacidade / 2}"/>`);
}

/** Círculo, quadrado e triângulo em grid assimétrico (bauhaus). */
function geometrico(_cfg, P, rnd) {
  const g = 100, formas = [];
  const cores = [P.primaria, P.secundaria, P.realce, P.destaque];
  const celulas = [[0, 0], [1, 0], [2, 1], [1, 1], [0, 2], [2, 3], [3, 2], [1, 3]];
  celulas.forEach(([cx, cy], i) => {
    const x = cx * g, y = cy * g, cor = cores[Math.floor(rnd() * cores.length)];
    const tipo = (i + Math.floor(rnd() * 3)) % 3;
    if (tipo === 0) formas.push(`<circle cx="${x + g / 2}" cy="${y + g / 2}" r="${g / 2}" fill="${cor}"/>`);
    else if (tipo === 1) formas.push(`<rect x="${x}" y="${y}" width="${g}" height="${g}" fill="${cor}"/>`);
    else formas.push(`<path d="M${x} ${y + g} L${x + g / 2} ${y} L${x + g} ${y + g} Z" fill="${cor}"/>`);
  });
  formas.push(`<path d="M0 ${n(rnd() * 400)} H400" stroke="#111" stroke-width="6"/>`);
  return svg(400, 400, formas.join(""));
}

/** Faixas diagonais, seta e barras (construtivismo): só primária e preto. */
function diagonais(_cfg, P, rnd) {
  const ang = n(-28 + rnd() * 8);
  return svg(400, 400, `<g transform="rotate(${ang} 200 200)"><rect x="-100" y="150" width="600" height="70" fill="${P.primaria}"/><rect x="-100" y="240" width="600" height="18" fill="#111"/><path d="M60 110 H300 V80 L380 130 L300 180 V150 H60 Z" fill="#111"/></g><circle cx="${n(280 + rnd() * 60)}" cy="${n(300 + rnd() * 50)}" r="46" fill="${P.primaria}"/>`);
}

/** Raios de sol e listras arredondadas (retrô), nas cores dessaturadas. */
function raiosDeSol({ raios = 14 }, P) {
  const cx = 200, cy = 400, out = [];
  for (let i = 0; i < raios; i++) {
    if (i % 2) continue;
    const a1 = Math.PI + (Math.PI * i) / raios, a2 = Math.PI + (Math.PI * (i + 1)) / raios;
    out.push(`<path d="M${cx} ${cy} L${n(cx + 400 * Math.cos(a1))} ${n(cy + 400 * Math.sin(a1))} L${n(cx + 400 * Math.cos(a2))} ${n(cy + 400 * Math.sin(a2))} Z" fill="${P.destaque}" opacity="0.55"/>`);
  }
  const listras = [P.primaria, P.secundaria, P.realce].map((c, i) => `<path d="M${40 + i * 30} 400 A${160 - i * 30} ${160 - i * 30} 0 0 1 ${360 - i * 30} 400" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round"/>`);
  return svg(400, 400, out.join("") + listras.join(""));
}

function blob(cx, cy, r, rnd, pontos = 7) {
  const pts = [];
  for (let i = 0; i < pontos; i++) {
    const a = (2 * Math.PI * i) / pontos, rr = r * (0.75 + rnd() * 0.5);
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  // Curva fechada suave (Catmull-Rom → Bézier)
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < pontos; i++) {
    const p0 = pts[(i - 1 + pontos) % pontos], p1 = pts[i], p2 = pts[(i + 1) % pontos], p3 = pts[(i + 2) % pontos];
    d += ` C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d + " Z";
}

/** Formas orgânicas (orgânico): blobs sobrepostos nas cores dessaturadas. */
function blobs(_cfg, P, rnd) {
  const cores = [P.primaria, P.secundaria, P.destaque];
  const formas = cores.map((c, i) => `<path d="${blob(200 + (rnd() - 0.5) * 120, 200 + (rnd() - 0.5) * 160, 110 - i * 15, rnd)}" fill="${c}" opacity="${[0.35, 0.3, 0.45][i]}"/>`);
  return svg(400, 400, formas.join(""));
}

/** Divisória em onda (orgânico). */
function onda({ amplitude = 6 }, P) {
  return svg(160, 24, `<path d="M0 12 Q20 ${12 - amplitude} 40 12 T80 12 T120 12 T160 12" fill="none" stroke="${P.primaria}" stroke-width="2" opacity="0.6"/>`);
}

/** Faixa de cor simples, usada como divisória por estilos geométricos. */
function faixa({ cores = ["primaria", "secundaria", "realce"] }, P) {
  const lista = cores.map((c) => P[c] ?? (/^#[0-9A-Fa-f]{6}$/.test(c) ? c : P.primaria));
  const w = 24 * lista.length;
  return svg(w, 8, lista.map((c, i) => `<rect x="${i * 24}" width="24" height="8" fill="${c}"/>`).join(""));
}

/** Retícula (halftone) em gradiente de tamanho (colagem). */
function reticula({ cor = "primaria", opacidade = 0.25 }, P) {
  const c = P[cor] ?? P.primaria, out = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) out.push(`<circle cx="${x * 8 + 4}" cy="${y * 8 + 4}" r="${n(0.6 + (y / 7) * 2.6)}" fill="${c}"/>`);
  return svg(64, 64, `<g opacity="${opacidade}">${out.join("")}</g>`);
}

/** Recortes de papel com fita adesiva (colagem): formas levemente rotacionadas, sem texto. */
function recortes(_cfg, P, rnd) {
  const cores = [P.primaria, P.secundaria, P.destaque];
  const out = cores.map((c, i) => {
    const r = n(-6 + rnd() * 12);
    return `<g transform="rotate(${r} 200 200)"><rect x="${60 + i * 50}" y="${50 + i * 70}" width="${200 - i * 20}" height="${140 - i * 10}" fill="${c}" opacity="0.8"/><rect x="${120 + i * 50}" y="${40 + i * 70}" width="60" height="18" fill="#fff" opacity="0.55" transform="rotate(${n(-8 + rnd() * 16)} ${150 + i * 50} ${50 + i * 70})"/></g>`;
  });
  return svg(400, 400, out.join(""));
}

/** Placeholder de ilustração (ilustrativo): moldura tracejada com uma cena simples, sem texto. */
function placeholderIlustracao({ tema = "hero" }, P, rnd) {
  const sol = `<circle cx="${n(260 + rnd() * 60)}" cy="${n(90 + rnd() * 30)}" r="34" fill="${P.destaque}"/>`;
  const colinas = `<path d="M20 330 Q120 ${n(200 + rnd() * 40)} 220 300 T380 ${n(250 + rnd() * 40)} V380 H20 Z" fill="${P.primaria}" opacity="0.7"/><path d="M20 350 Q160 ${n(270 + rnd() * 30)} 380 340 V380 H20 Z" fill="${P.secundaria}" opacity="0.7"/>`;
  const extra = {
    vazio: `<rect x="140" y="170" width="120" height="90" rx="10" fill="none" stroke="${P.primaria}" stroke-width="4"/>`,
    "erro-404": `<circle cx="200" cy="210" r="46" fill="none" stroke="${P.primaria}" stroke-width="6"/><path d="M232 242 L270 280" stroke="${P.primaria}" stroke-width="8" stroke-linecap="round"/>`,
    "erro-500": `<path d="M200 160 L250 250 H150 Z" fill="none" stroke="${P.primaria}" stroke-width="6" stroke-linejoin="round"/>`,
  }[tema] ?? "";
  return svg(400, 400, `<rect x="6" y="6" width="388" height="388" rx="28" fill="none" stroke="${P.primaria}" stroke-width="3" stroke-dasharray="10 8" opacity="0.6"/>${sol}${colinas}${extra}`);
}

export const GERADORES = { padrao, camadas, ruido, bordaIrregular, ornamento, geometrico, diagonais, raiosDeSol, blobs, onda, faixa, reticula, recortes, placeholderIlustracao };

/**
 * Gera a decoração de um estilo.
 * @param {object} cfg    decoracao.json do preset: { dessaturar?, slots: { hero: { gerador, ... }, ... }, ilustracoes?: [tema] }
 * @param {object} cores  cores finais da marca ({ h, s, l })
 * @param {string} semente slug da marca
 * @returns { arquivos: Map(caminho em public/ → svg), tokens: { "--deco-*": valor }, bytes }
 */
export function gerarDecoracao(cfg, cores, semente) {
  const P = paleta(cores, { dessaturar: cfg.dessaturar ?? 0 });
  const arquivos = new Map();
  const tokens = {};
  for (const [slot, opcoes] of Object.entries(cfg.slots ?? {})) {
    const destino = SLOTS[slot];
    const gerador = GERADORES[opcoes.gerador];
    if (!destino) throw new Error(`Slot de decoração desconhecido: ${slot}`);
    if (!gerador) throw new Error(`Gerador de decoração desconhecido: ${opcoes.gerador}`);
    arquivos.set(`public/estilo/${destino.arquivo}`, gerador(opcoes, P, aleatorio(`${semente}:${slot}`)));
    tokens[destino.token] = `url("/estilo/${destino.arquivo}")`;
  }
  for (const tema of cfg.ilustracoes ?? []) {
    arquivos.set(`public/estilo/ilustracoes/${tema}.svg`, placeholderIlustracao({ tema }, P, aleatorio(`${semente}:ilustracao:${tema}`)));
  }
  const bytes = [...arquivos.values()].reduce((s, v) => s + Buffer.byteLength(v), 0);
  return { arquivos, tokens, bytes };
}
