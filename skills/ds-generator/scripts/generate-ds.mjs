#!/usr/bin/env node
/**
 * generate-ds.mjs — gera um Design System completo para uma marca a partir do template.
 *
 * Uso:
 *   node scripts/generate-ds.mjs --brief <briefing.json> --out <pasta> [--force] [--node-modules <pasta>]
 *
 *   --force          apaga a pasta de saída se já existir
 *   --node-modules   cria um link (junction) para um node_modules existente, para testar o build sem npm install
 *
 * Etapas:
 *   1. Copia assets/template para --out
 *   2. Substitui placeholders (__BRAND_NAME__, __FONT_PRIMARY__…) e monta os @import de fontes
 *   3. Recolore todas as cores por família de matiz (primária, secundária, destaque, realce)
 *   4. Reescreve os HEX de src/data/tokenGroups.ts a partir dos HSL (mantém o teste de tokens verde)
 *   5. Corrige pares de contraste críticos (texto sobre a primária)
 *   6. Instala logos, favicon e placeholders para imagens hospedadas no CDN da Lovable
 *   7. Remove módulos opcionais (modelos de BI) conforme o briefing
 *   8. Grava scripts/legacy-brand.config.json e GERACAO.md (relatório com pendências)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  hexToHsl, hslToHex, hslTriplet, parseTriplet, makeRecolorer, recolorText,
  tripletToHexStrict, hslToRgb, contrastRatio,
} from "./lib/color.mjs";
import { PLACEHOLDERS, placeholderValues, fontImportsBlock } from "./lib/rules.mjs";
import { auditContrast, contrastTable, blockBodies } from "./lib/contrast.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.resolve(HERE, "..");

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args[a.slice(2)] = next && !next.startsWith("--") ? (i++, next) : true;
}
if (!args.brief || !args.out) {
  console.error("Uso: node generate-ds.mjs --brief <briefing.json> --out <pasta> [--force] [--node-modules <pasta>]");
  process.exit(1);
}

const BRIEF_PATH = path.resolve(args.brief);
const BRIEF_DIR = path.dirname(BRIEF_PATH);
const TEMPLATE = path.resolve(args.template ?? path.join(SKILL, "assets/template"));
const OUT = path.resolve(args.out);
const brief = JSON.parse(fs.readFileSync(BRIEF_PATH, "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(TEMPLATE, "template.manifest.json"), "utf8"));
const warnings = [];

// ---------- 0. Validação do briefing ----------
const HEX = /^#[0-9a-fA-F]{6}$/;
const erros = [];
if (!brief.nome) erros.push("nome");
if (!brief.slug || !/^[a-z0-9-]+$/.test(brief.slug)) erros.push("slug (minúsculas, números e hífen)");
if (!HEX.test(brief.cores?.primaria ?? "")) erros.push("cores.primaria (#RRGGBB)");
if (!brief.fontes?.primaria?.nome) erros.push("fontes.primaria.nome");
for (const k of ["secundaria", "destaque", "realce"]) {
  const v = brief.cores?.[k];
  if (v && !HEX.test(v)) erros.push(`cores.${k} (#RRGGBB)`);
}
if (erros.length) {
  console.error(`Briefing inválido — campos obrigatórios/malformados: ${erros.join(", ")}`);
  process.exit(1);
}

if (fs.existsSync(OUT) && fs.readdirSync(OUT).length) {
  if (!args.force) {
    console.error(`A pasta ${OUT} já existe e não está vazia. Use --force para sobrescrever.`);
    process.exit(1);
  }
  // node_modules pode ser uma junction criada por --node-modules: desfaz o link antes, nunca apaga o alvo
  const nm = path.join(OUT, "node_modules");
  try {
    if (fs.lstatSync(nm).isSymbolicLink()) fs.unlinkSync(nm);
  } catch {}
  fs.rmSync(OUT, { recursive: true, force: true });
}

// ---------- 1. Famílias de cor ----------
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fromHex = (hex) => {
  const { h, s, l } = hexToHsl(hex);
  return { h: Math.round(h), s: Math.round(s), l: Math.round(l), hex: hex.toUpperCase() };
};
const withHex = (hsl) => ({ ...hsl, hex: hslToHex(hsl) });
const tPrim = fromHex(brief.cores.primaria);
const srcFam = Object.fromEntries(manifest.familias.map((f) => [f.nome, f]));
const srcPrim = srcFam.primaria;

const targets = {
  primaria: tPrim,
  secundaria: brief.cores.secundaria
    ? fromHex(brief.cores.secundaria)
    : withHex({
        h: ((tPrim.h + (srcFam.secundaria.hsl[0] - srcPrim.hsl[0])) % 360 + 360) % 360,
        s: clamp(Math.round(tPrim.s * (srcFam.secundaria.hsl[1] / srcPrim.hsl[1])), 20, 95),
        l: srcFam.secundaria.hsl[2],
      }),
  destaque: brief.cores.destaque ? fromHex(brief.cores.destaque) : withHex({ h: tPrim.h, s: clamp(tPrim.s + 10, 30, 90), l: 90 }),
  realce: brief.cores.realce ? fromHex(brief.cores.realce) : null,
};

// Famílias extras declaradas na origem recebem a cor de mesmo nome do briefing, se houver
for (const f of manifest.familias) {
  if (!(f.nome in targets) && HEX.test(brief.cores?.[f.nome] ?? "")) targets[f.nome] = fromHex(brief.cores[f.nome]);
}

// Se a cor-alvo for a própria cor de origem, usa o HSL exato do CSS de origem (ida e volta = identidade)
for (const f of manifest.familias) {
  const t = targets[f.nome];
  if (t && f.hex && t.hex === f.hex.toUpperCase()) targets[f.nome] = { h: f.hsl[0], s: f.hsl[1], l: f.hsl[2], hex: t.hex };
}

const families = manifest.familias.map((f) => ({
  name: f.nome,
  source: { h: f.hsl[0], s: f.hsl[1], l: f.hsl[2], hex: f.hex },
  target: targets[f.nome] ?? null,
  window: f.janela,
  minSat: f.saturacao_minima,
}));
const recolorer = makeRecolorer(families);

// ---------- 2. Cópia + placeholders + recoloração ----------
const TEXT_EXT = /\.(tsx?|jsx?|mjs|cjs|css|scss|html?|json|md|txt|xml|svg|ya?ml|toml)$/i;
const NO_RECOLOR = (rel) => rel.endsWith(".asset.json") || rel === "package-lock.json" || /(^|\/)marca\//.test(rel) || /logo[^/]*\.svg$/.test(rel);
const values = placeholderValues(brief);
const fontBlock = fontImportsBlock(brief);
const stats = { arquivos: 0, hex: 0, hsl: 0 };

// Concordância de gênero antes do nome da marca (o template foi escrito para "o SEBRAE")
const FEM = { do: "da", no: "na", pelo: "pela", ao: "à", o: "a", Do: "Da", No: "Na", Pelo: "Pela", Ao: "À", O: "A" };
const BRAND_PH = "__BRAND_(?:NAME|SHORT|FULL_NAME)__";
function agreeGender(text) {
  if (brief.genero !== "f") return text;
  const re = new RegExp(`(?<![\\wÀ-ú])(do|no|pelo|ao|o|Do|No|Pelo|Ao|O)(\\s+)(${BRAND_PH})`, "g");
  return text.replace(re, (m, art, sp, ph) => `${FEM[art]}${sp}${ph}`);
}

function fillPlaceholders(text) {
  text = agreeGender(text);
  // Nomes de fonte em URLs do Google Fonts usam "+" no lugar de espaço
  for (const ph of [PLACEHOLDERS.FONT_PRIMARY, PLACEHOLDERS.FONT_DISPLAY, PLACEHOLDERS.FONT_SYSTEM]) {
    text = text.split(`family=${ph}`).join(`family=${values[ph].replace(/ /g, "+")}`);
  }
  text = text.split(PLACEHOLDERS.FONT_IMPORTS).join(fontBlock);
  for (const [ph, v] of Object.entries(values)) text = text.split(ph).join(v);
  return text;
}

(function copy(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(TEMPLATE, full).split(path.sep).join("/");
    if (rel === "template.manifest.json") continue;
    const dest = path.join(OUT, rel);
    if (entry.isDirectory()) { fs.mkdirSync(dest, { recursive: true }); copy(full); continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (TEXT_EXT.test(rel)) {
      let text = fillPlaceholders(fs.readFileSync(full, "utf8"));
      if (!NO_RECOLOR(rel)) text = recolorText(text, recolorer, stats);
      fs.writeFileSync(dest, text);
    } else {
      fs.copyFileSync(full, dest);
    }
    stats.arquivos++;
  }
})(TEMPLATE);

const P = (rel) => path.join(OUT, rel);
const read = (rel) => fs.readFileSync(P(rel), "utf8");
const write = (rel, text) => { fs.mkdirSync(path.dirname(P(rel)), { recursive: true }); fs.writeFileSync(P(rel), text); };

// ---------- 3. Contraste: texto sobre a primária ----------
const CSS_REL = "src/index.css";
let css = read(CSS_REL);

function setVar(cssText, selector, name, value) {
  const blocks = blockBodies(cssText, selector);
  for (const b of blocks) {
    const re = new RegExp(`(${name}\\s*:\\s*)([^;]+)(;)`);
    if (re.test(b.body)) {
      const body = b.body.replace(re, `$1${value}$3`);
      return cssText.slice(0, b.start) + body + cssText.slice(b.end);
    }
  }
  return cssText;
}
const getVar = (cssText, selector, name) => {
  for (const b of blockBodies(cssText, selector)) {
    const m = new RegExp(`${name}\\s*:\\s*([^;]+);`).exec(b.body.replace(/\/\*[\s\S]*?\*\//g, ""));
    if (m) return m[1].trim();
  }
  return null;
};
const ratio = (a, b) => contrastRatio(hslToRgb(parseTriplet(a)), hslToRgb(parseTriplet(b)));
const ajustes = [];
// Só corrige pares que ficaram PIORES que na marca de origem: o que já era decisão de design da origem fica como está
const srcCss = fs.readFileSync(path.join(TEMPLATE, CSS_REL), "utf8");
const srcRatio = (selector, fgName, bgName) => {
  const fg = getVar(srcCss, selector, fgName) ?? getVar(srcCss, ":root", fgName);
  const bg = getVar(srcCss, selector, bgName) ?? getVar(srcCss, ":root", bgName);
  return fg && bg && parseTriplet(fg) && parseTriplet(bg) ? ratio(fg, bg) : 21;
};
const degraded = (r, selector, fgName, bgName, min) => r < min && r < srcRatio(selector, fgName, bgName) - 0.05;

for (const selector of [":root", ".dark"]) {
  const primary = getVar(css, selector, "--primary");
  const fg = getVar(css, selector, "--primary-foreground");
  const dark = getVar(css, ":root", "--foreground");
  if (primary && fg && degraded(ratio(fg, primary), selector, "--primary-foreground", "--primary", 4.5) && ratio(dark, primary) > ratio(fg, primary)) {
    css = setVar(css, selector, "--primary-foreground", dark);
    ajustes.push(`${selector} --primary-foreground → ${dark} (branco não atingia 4.5:1 sobre a primária)`);
  }
  const sec = getVar(css, selector, "--secondary");
  const secFg = getVar(css, selector, "--secondary-foreground");
  if (sec && secFg && degraded(ratio(secFg, sec), selector, "--secondary-foreground", "--secondary", 3) && ratio(dark, sec) > ratio(secFg, sec)) {
    css = setVar(css, selector, "--secondary-foreground", dark);
    ajustes.push(`${selector} --secondary-foreground → ${dark}`);
  }
}
{
  const primary = getVar(css, ":root", "--primary");
  const btnFg = getVar(css, ":root", "--brand-btn-fg");
  const primFg = getVar(css, ":root", "--primary-foreground");
  if (primary && btnFg && degraded(ratio(btnFg, primary), ":root", "--brand-btn-fg", "--primary", 4.5)) {
    css = setVar(css, ":root", "--brand-btn-fg", primFg);
    ajustes.push(`:root --brand-btn-fg → ${primFg} (destaque sem contraste sobre a primária)`);
  }
}
write(CSS_REL, css);

// ---------- 4. tokenGroups.ts: espelho dos valores do CSS ----------
const TG_REL = "src/data/tokenGroups.ts";
if (fs.existsSync(P(TG_REL))) {
  const lightVars = new Map(), darkVars = new Map();
  for (const [sel, map] of [[":root", lightVars], [".dark", darkVars]]) {
    for (const b of blockBodies(css, sel)) {
      for (const m of b.body.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) map.set(m[1], m[2].trim());
    }
  }
  let tg = read(TG_REL);
  tg = tg.replace(
    /\{ name: "(--[a-z0-9-]+)", lightValue: "([^"]+)", darkValue: "([^"]+)", lightHex: "#[0-9A-Fa-f]{6}", darkHex: "#[0-9A-Fa-f]{6}" \}/g,
    (m, name, lv, dv) => {
      const lightValue = lightVars.get(name) ?? lv;
      const darkValue = darkVars.get(name) ?? lightVars.get(name) ?? dv;
      const lh = tripletToHexStrict(lightValue), dh = tripletToHexStrict(darkValue);
      if (!lh || !dh) return m;
      return `{ name: "${name}", lightValue: "${lightValue}", darkValue: "${darkValue}", lightHex: "${lh}", darkHex: "${dh}" }`;
    },
  );
  write(TG_REL, tg);
}

// ---------- 5. Logos, favicon e imagens ----------
const resolveBrief = (p) => (p ? path.resolve(BRIEF_DIR, p) : null);
const fontDisplay = brief.fontes.display?.nome || brief.fontes.primaria.nome;
const short = brief.nome_curto || brief.nome;

function wordmark(fill) {
  const w = Math.max(240, Math.round(short.length * 62 + 40));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 140" role="img" aria-label="${short}">
  <text x="20" y="100" font-family="${fontDisplay}, ${brief.fontes.primaria.nome}, Arial, sans-serif" font-weight="800" font-size="96" letter-spacing="-2" fill="${fill}">${short}</text>
</svg>
`;
}
function asSvg(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".svg") return fs.readFileSync(file, "utf8");
  const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  const b64 = fs.readFileSync(file).toString("base64");
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 400"><image width="1000" height="400" preserveAspectRatio="xMidYMid meet" href="data:${mime};base64,${b64}"/></svg>\n`;
}

const logoKinds = { cor: { file: "brand-cor", fill: tPrim.hex }, branco: { file: "brand-white", fill: "#FFFFFF" }, preto: { file: "brand-black", fill: "#111111" } };
const logos = {};
for (const [kind, { file, fill }] of Object.entries(logoKinds)) {
  const src = resolveBrief(brief.logos?.[kind]);
  let svg;
  if (src && fs.existsSync(src)) svg = asSvg(src);
  else {
    if (src) warnings.push(`Logo "${kind}" não encontrado em ${src} — usei um logotipo tipográfico provisório.`);
    else warnings.push(`Logo "${kind}" não informado — usei um logotipo tipográfico provisório.`);
    svg = wordmark(fill);
  }
  logos[kind] = svg;
  write(`public/marca/${file}.svg`, svg);
  write(`src/assets/marca/${file}.svg`, svg);
  write(`src/assets/marca/${file}.svg.asset.json`, JSON.stringify({ version: 1, url: `/marca/${file}.svg`, original_filename: `${file}.svg`, content_type: "image/svg+xml" }, null, 2) + "\n");
}
// Logos importados diretamente pelo código
for (const [rel, kind] of [["src/assets/brand-logo-white.svg", "branco"], ["src/assets/brand-logo-white-header.svg", "branco"]]) {
  if (fs.existsSync(P(rel))) write(rel, logos[kind]);
}

// Demais .asset.json apontam para o CDN da Lovable do projeto de origem → placeholders locais
const placeholders = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!entry.name.endsWith(".asset.json")) continue;
    const rel = path.relative(OUT, full).split(path.sep).join("/");
    if (rel.startsWith("src/assets/marca/")) continue;
    const base = entry.name.replace(/\.asset\.json$/, "");
    const stem = base.replace(/\.[a-z0-9]+$/i, "");
    let url;
    if (/logo/i.test(stem)) {
      url = "/marca/brand-cor.svg";
    } else {
      url = `/placeholders/${stem}.svg`;
      const label = stem.replace(/[-_]/g, " ");
      write(`public/placeholders/${stem}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tPrim.hex}"/><stop offset="1" stop-color="${targets.secundaria.hex}"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <text x="800" y="470" text-anchor="middle" font-family="${brief.fontes.primaria.nome}, Arial, sans-serif" font-size="44" fill="#FFFFFF" opacity="0.85">${label}</text>
</svg>
`);
      placeholders.push(`${rel} → public${url}`);
    }
    write(rel, JSON.stringify({ version: 1, url, original_filename: base, content_type: "image/svg+xml" }, null, 2) + "\n");
  }
})(P("src"));

// Favicon
const favSrc = resolveBrief(brief.favicon);
if (favSrc && fs.existsSync(favSrc) && path.extname(favSrc).toLowerCase() === ".png") {
  fs.copyFileSync(favSrc, P("public/favicon.png"));
} else {
  const letter = short.charAt(0).toUpperCase();
  write("public/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${tPrim.hex}"/><text x="32" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="38" fill="#FFFFFF">${letter}</text></svg>\n`);
  if (fs.existsSync(P("public/favicon.png"))) fs.rmSync(P("public/favicon.png"));
  for (const rel of ["index.html", "src/components/SEO.tsx"]) {
    if (!fs.existsSync(P(rel))) continue;
    write(rel, read(rel).replace(/type="image\/png" href="\/favicon\.png"/g, 'type="image/svg+xml" href="/favicon.svg"').replace(/\/favicon\.png/g, "/favicon.svg"));
  }
  if (!favSrc) warnings.push("Favicon não informado — gerei um monograma em public/favicon.svg.");
}
// index.html: idioma e autor
if (fs.existsSync(P("index.html"))) {
  write("index.html", read("index.html").replace('<html lang="en">', '<html lang="pt-BR">').replace('content="Lovable"', `content="${brief.nome}"`));
}

// ---------- 6. Módulos opcionais ----------
const removidos = [];
if (brief.modulos?.modelos_bi === false) {
  const BI = /\/modelos-bi|ModelosBIPage|PlanejaBIPage|MPIBIPage|GestaoPessoasBIPage|FarolEstrategicoHubPage|FarolEstrategicoDocsPage/;
  for (const rel of ["src/App.tsx", "src/utils/prefetchRoutes.ts", "public/llms.txt", "public/sitemap.xml"]) {
    if (!fs.existsSync(P(rel))) continue;
    const lines = read(rel).split("\n");
    const kept = lines.filter((l) => !BI.test(l));
    if (kept.length !== lines.length) { write(rel, kept.join("\n")); removidos.push(`${rel}: ${lines.length - kept.length} linha(s)`); }
  }
  // Menu lateral: remove o objeto { label: "Modelos de BI", ... } inteiro
  const NAV = "src/components/DSLayout.tsx";
  if (fs.existsSync(P(NAV))) {
    const src = read(NAV);
    const at = src.indexOf('path: "/modelos-bi"');
    if (at > 0) {
      const start = src.lastIndexOf("{", at);
      let depth = 0, i = start;
      for (; i < src.length; i++) {
        if (src[i] === "{") depth++;
        else if (src[i] === "}" && --depth === 0) break;
      }
      let end = i + 1;
      if (src[end] === ",") end++;
      const lineStart = src.lastIndexOf("\n", start) + 1;
      const lineEnd = src.indexOf("\n", end);
      write(NAV, src.slice(0, lineStart) + src.slice(lineEnd + 1));
      removidos.push(`${NAV}: item "Modelos de BI" do menu`);
    }
  }
  for (const rel of ["src/pages/ModelosBIPage.tsx", "src/pages/modelos-bi", "src/pages/FarolEstrategicoDocsPage.tsx"]) {
    if (fs.existsSync(P(rel))) { fs.rmSync(P(rel), { recursive: true, force: true }); removidos.push(rel); }
  }
}

// ---------- 7. package.json e marcas proibidas ----------
if (fs.existsSync(P("package.json"))) {
  const pkg = JSON.parse(read("package.json"));
  pkg.name = `${brief.slug}-design-system`;
  write("package.json", JSON.stringify(pkg, null, 2) + "\n");
}
const propria = [brief.nome, brief.nome_curto, brief.slug, brief.nome_completo, ...Object.values(brief.dominios ?? {})].filter(Boolean).join(" ").toLowerCase();
const termos = [...new Set([manifest.origem.prefixo_codigo, ...(brief.termos_proibidos ?? [])].map((t) => t.toLowerCase()))]
  .filter((t) => !propria.includes(t));
write("scripts/legacy-brand.config.json", JSON.stringify({ termos }, null, 2) + "\n");

// ---------- 8. Relatório ----------
function scan(re) {
  const hits = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", "dist", "reports"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      const rel = path.relative(OUT, full).split(path.sep).join("/");
      if (!TEXT_EXT.test(rel) || rel === "scripts/legacy-brand.config.json" || rel === "package-lock.json") continue;
      fs.readFileSync(full, "utf8").split("\n").forEach((line, i) => {
        if (re.test(line)) hits.push(`${rel}:${i + 1}`);
      });
    }
  })(OUT);
  return hits;
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const legados = termos.length ? scan(new RegExp(termos.map(esc).join("|"), "i")) : [];
const especificos = manifest.origem.termos_especificos.length
  ? scan(new RegExp(manifest.origem.termos_especificos.map(esc).join("|")))
  : [];
const sobras = scan(/__[A-Z_]+__/);
const fotos = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) fotos.push(path.relative(OUT, full).split(path.sep).join("/"));
  }
})(P("src/assets"));

const contraste = auditContrast(css);
const falhas = contraste.filter((r) => r.ratio < 4.5);
const lista = (arr, max = 40) => (arr.length ? arr.slice(0, max).map((x) => `- ${x}`).join("\n") + (arr.length > max ? `\n- … e mais ${arr.length - max}` : "") : "- (nenhum)");
const agrupar = (hits) => {
  const m = new Map();
  for (const h of hits) { const f = h.split(":")[0]; m.set(f, (m.get(f) ?? 0) + 1); }
  return [...m].map(([f, n]) => `${f} (${n})`);
};

const relatorio = `# Geração do DS ${brief.nome}

Gerado em ${new Date().toISOString()} a partir do template de **${manifest.origem.nome}**.

## Resumo

| Item | Valor |
|---|---|
| Arquivos | ${stats.arquivos} |
| Cores HEX recoloridas | ${stats.hex} |
| Cores HSL recoloridas | ${stats.hsl} |
| Primária | ${tPrim.hex} (\`${hslTriplet(tPrim)}\`) |
| Secundária | ${targets.secundaria.hex} (\`${hslTriplet(targets.secundaria)}\`)${brief.cores.secundaria ? "" : " — derivada"} |
| Destaque | ${targets.destaque.hex}${brief.cores.destaque ? "" : " — derivado"} |
| Realce | ${targets.realce ? targets.realce.hex : "mantido do template"} |
| Fontes | ${brief.fontes.primaria.nome} / ${fontDisplay} / ${brief.fontes.sistema?.nome || brief.fontes.primaria.nome} |
| Termos proibidos (build falha) | ${termos.join(", ") || "—"} |

## Ajustes automáticos de contraste

${lista(ajustes)}

## Avisos

${lista(warnings)}

## Módulos removidos

${lista(removidos)}

## Pendências para revisão (etapa do agente)

### 1. Ocorrências de marcas proibidas (${legados.length}) — o build falha enquanto houver
${lista(agrupar(legados))}

### 2. Conteúdo de exemplo da marca de origem (${especificos.length})
Nomes de programas, diretorias e produtos da origem usados em dados fictícios. Troque por exemplos do universo da nova marca.
${lista(agrupar(especificos))}

### 3. Placeholders não resolvidos (${sobras.length})
${lista(sobras)}

### 4. Imagens herdadas do template (${fotos.length})
Fotos e miniaturas ainda mostram a identidade de origem. Substitua ou recapture as miniaturas com o DS novo rodando.
${lista(fotos)}

### 5. Placeholders de imagem gerados (${placeholders.length})
${lista(placeholders)}

### 6. Textos que precisam de reescrita semântica
Veja \`references/reescrita-semantica.md\` na skill: MarcaPage, ColorSection (paleta estendida), FundamentosPage (tipografia/iconografia), HomePage, ConteudoPage (tom de voz), AcessibilidadePage, public/llms.txt.

## Contraste (${contraste.length} pares, ${falhas.length} abaixo de AA)

${contrastTable(contraste)}
`;
write("GERACAO.md", relatorio);

// ---------- 9. node_modules (opcional, para testar o build) ----------
if (args["node-modules"]) {
  const nm = path.resolve(args["node-modules"]);
  try {
    fs.symlinkSync(nm, P("node_modules"), "junction");
  } catch (e) {
    warnings.push(`Não consegui linkar node_modules: ${e.message}`);
  }
}

console.log(`DS "${brief.nome}" gerado em ${OUT}`);
console.log(`  arquivos=${stats.arquivos} hex=${stats.hex} hsl=${stats.hsl} ajustes=${ajustes.length} removidos=${removidos.length}`);
console.log(`  marcas proibidas: ${legados.length} · conteúdo de origem: ${especificos.length} · placeholders: ${sobras.length} · contraste < AA: ${falhas.length}`);
if (warnings.length) console.log("  avisos:\n    " + warnings.join("\n    "));
console.log(`  relatório: ${path.join(OUT, "GERACAO.md")}`);
