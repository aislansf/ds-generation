#!/usr/bin/env node
/**
 * Gera artefatos do DS __BRAND_SHORT__ para consumo pelo Figma e demais ferramentas.
 * Fonte da verdade: src/index.css (:root e .dark).
 * Saídas em public/design-system/:
 *  - tokens.json (W3C DTCG)
 *  - tokens.css  (snapshot)
 *  - tailwind.config.json
 *  - components.json
 *  - manifest.json (índice)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "public/design-system");
mkdirSync(OUT, { recursive: true });

const css = readFileSync(resolve(ROOT, "src/index.css"), "utf8");

function extractBlock(scope) {
  const re = new RegExp(scope + "\\s*\\{([\\s\\S]*?)\\n\\s*\\}", "m");
  const match = css.match(re);
  if (!match) throw new Error("Bloco CSS nao encontrado: " + scope);
  const tokens = {};
  const varRe = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = varRe.exec(match[1]))) tokens[m[1]] = m[2].trim();
  return tokens;
}
const light = extractBlock(":root");
const dark = extractBlock("\\.dark");

function hslTripleToHex(triple) {
  const parts = triple.split(/\s+/).map((p) => p.replace("%", ""));
  if (parts.length < 3) return null;
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  if ([h, s, l].some(Number.isNaN)) return null;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v) => Math.round((v + mm) * 255).toString(16).padStart(2, "0");
  return ("#" + to(r) + to(g) + to(b)).toUpperCase();
}
const HSL_RE = /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/;

const isColor = (n, v) => HSL_RE.test(v) || v.startsWith("#") || v.startsWith("rgb");
const isDim = (n) => /^(space|text|radius|bp)-/.test(n) || n === "radius";
const isShadow = (n) => n.startsWith("shadow-");
const isDur = (n) => n.startsWith("duration-");
const isEase = (n) => n.startsWith("ease");
const isFW = (n) => n.startsWith("font-");
const isLH = (n) => n.startsWith("leading-");
const isLS = (n) => n.startsWith("tracking-");
const isZ = (n) => n.startsWith("z-");

function typeOf(n, v) {
  if (isShadow(n)) return "shadow";
  if (isDur(n)) return "duration";
  if (isEase(n)) return "cubicBezier";
  if (isFW(n)) return "fontWeight";
  if (isLH(n)) return "number";
  if (isLS(n)) return "dimension";
  if (isZ(n)) return "number";
  if (isDim(n)) return "dimension";
  if (isColor(n, v)) return "color";
  return "string";
}
function toValue(t, v) {
  if (t === "color" && HSL_RE.test(v)) return hslTripleToHex(v);
  return v;
}

const dtcg = { $schema: "https://tr.designtokens.org/format/", brand: {} };
function set(path, node) {
  let cur = dtcg.brand;
  for (let i = 0; i < path.length - 1; i++) {
    cur[path[i]] ??= {};
    cur = cur[path[i]];
  }
  cur[path[path.length - 1]] = node;
}
for (const [name, val] of Object.entries(light)) {
  const t = typeOf(name, val);
  const node = { $type: t, $value: toValue(t, val), $description: "--" + name };
  const dv = dark[name];
  if (dv && dv !== val) node.$extensions = { "com.brand.themes": { dark: toValue(t, dv) } };
  set(name.split("-"), node);
}

const cssSnapshot =
  "/* __BRAND_SHORT__ DS - snapshot gerado automaticamente. Nao edite. */\n:root {\n" +
  Object.entries(light).map(([k, v]) => "  --" + k + ": " + v + ";").join("\n") +
  "\n}\n.dark {\n" +
  Object.entries(dark).map(([k, v]) => "  --" + k + ": " + v + ";").join("\n") +
  "\n}\n";

const tailwind = {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["__FONT_PRIMARY__", "system-ui", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["__FONT_SYSTEM__", "__FONT_PRIMARY__", "system-ui", "sans-serif"],
        display: ["__FONT_SYSTEM__", "__FONT_PRIMARY__", "system-ui", "sans-serif"],
        lato: ["__FONT_SYSTEM__", "system-ui", "sans-serif"],
      },
      colors: Object.fromEntries(
        Object.entries(light).filter(([k, v]) => isColor(k, v)).map(([k]) => [k, "hsl(var(--" + k + "))"])
      ),
      spacing: Object.fromEntries(
        Object.entries(light).filter(([k]) => k.startsWith("space-")).map(([k]) => [k.replace("space-", ""), "var(--" + k + ")"])
      ),
      fontSize: Object.fromEntries(
        Object.entries(light).filter(([k]) => k.startsWith("text-")).map(([k]) => [k.replace("text-", ""), "var(--" + k + ")"])
      ),
      borderRadius: Object.fromEntries(
        Object.entries(light).filter(([k]) => k.startsWith("radius")).map(([k]) => [k.replace(/^radius-?/, "") || "DEFAULT", "var(--" + k + ")"])
      ),
    },
  },
};

const components = {
  meta: {
    name: "__BRAND_NAME__ DS - Components",
    baseUrl: "https://__DS_DOMAIN__",
    description: "Manifesto de componentes com variantes, estados e tokens usados.",
  },
  primitives: [
    { id: "button", name: "Button", ref: "/componentes#botao", variants: ["primary","secondary","diversificado","ghost","link","loading","icon"], colors: ["default","azul","laranja","verde","escuro"], states: ["default","hover","focus","active","disabled"], tokens: ["--primary","--primary-foreground","--secondary","--radius-md","--shadow-sm"] },
    { id: "input", name: "Input", ref: "/componentes#input", states: ["default","hover","focus","error","disabled"], tokens: ["--border","--input","--ring","--foreground","--muted-foreground"] },
    { id: "select", name: "Select", ref: "/componentes#select", states: ["default","hover","focus","open","disabled"] },
    { id: "checkbox", name: "Checkbox", ref: "/componentes#checkbox", states: ["default","hover","checked","disabled"] },
    { id: "radio", name: "Radio", ref: "/componentes#checkbox", states: ["default","hover","checked","disabled"] },
    { id: "switch", name: "Switch", ref: "/componentes#switch", states: ["off","on","disabled"] },
    { id: "badge", name: "Badge", ref: "/componentes#badge", variants: ["default","outline","success","warning","error","info"] },
    { id: "alert", name: "Alert", ref: "/componentes#alert", variants: ["info","success","warning","error"] },
    { id: "card", name: "Card", ref: "/componentes#card", tokens: ["--card","--card-foreground","--border","--shadow-sm","--shadow-lg"] },
    { id: "table", name: "Table", ref: "/componentes#tabela", variants: ["default","striped","compact"] },
    { id: "accordion", name: "Accordion", ref: "/componentes#accordion", states: ["collapsed","expanded"] },
    { id: "tabs", name: "Tabs", ref: "/componentes#tabs", states: ["default","active","hover","disabled"] },
    { id: "modal", name: "Modal / Dialog", ref: "/componentes#modal", tokens: ["--card","--z-modal","--shadow-xl"] },
    { id: "toast", name: "Toast", ref: "/componentes#toast", variants: ["default","success","warning","error"], tokens: ["--z-toast","--shadow-lg"] },
    { id: "breadcrumb", name: "Breadcrumb", ref: "/componentes#breadcrumb" },
    { id: "pagination", name: "Pagination", ref: "/componentes#paginacao", states: ["default","hover","active","disabled"] },
    { id: "tooltip", name: "Tooltip", ref: "/componentes#tooltip", tokens: ["--popover","--z-overlay"] },
    { id: "skeleton", name: "Skeleton", ref: "/componentes#skeleton" },
    { id: "spinner", name: "Spinner", ref: "/componentes#spinner" },
    { id: "empty-state", name: "Empty State", ref: "/componentes#empty-state" },
    { id: "dropdown", name: "Dropdown Menu", ref: "/componentes#dropdown", tokens: ["--popover","--z-dropdown"] },
    { id: "datepicker", name: "DatePicker (DD/MM/AAAA)", ref: "/componentes#datepicker" },
    { id: "stepper", name: "Stepper", ref: "/componentes#steps", states: ["pending","current","done"] },
    { id: "kpi", name: "Big Numbers / KPI", ref: "/componentes#big-numbers" },
  ],
  composed: [
    { id: "header-institucional", name: "Header Institucional", ref: "/templates#header", height: "56px", tokens: ["--header-surface","--header-surface-foreground","--header-surface-border"] },
    { id: "header-negocios", name: "Header - Composicao visual (negocios)", ref: "/templates#header", bannerHeight: "36-52px" },
    { id: "sidebar", name: "Menu Lateral", ref: "/templates#menu-lateral", states: ["expanded","collapsed","mobile"], tokens: ["--sidebar-background","--sidebar-foreground","--sidebar-accent","--sidebar-primary","--sidebar-border"] },
    { id: "footer", name: "Footer Institucional", ref: "/templates#footer", variants: ["claro","escuro","compacto"] },
    { id: "auth-login", name: "Pagina de Autenticacao", ref: "/templates/pagina-autenticacao" },
    { id: "auth-signup", name: "Cadastro", ref: "/templates/cadastro" },
    { id: "auth-2fa", name: "Autenticacao 2FA", ref: "/templates/autenticacao-2fa" },
    { id: "modal-acesso", name: "Modal de Acesso", ref: "/templates/modal-acesso" },
    { id: "error-404", name: "Pagina de Erro (404)", ref: "/templates/pagina-erro" },
    { id: "dashboard-institucional", name: "Dashboard Institucional", ref: "/templates/dashboard-institucional" },
    { id: "dashboard-bi", name: "Dashboard BI", ref: "/templates/dashboard-bi" },
    { id: "radar-estrategico", name: "Radar Estrategico (BI)", ref: "/modelos-bi/radar-estrategico" },
    { id: "listagem", name: "Tela de Listagem", ref: "/templates/tela-listagem" },
    { id: "formulario", name: "Tela de Formulario", ref: "/templates/tela-formulario" },
    { id: "filtros-tabela", name: "Pagina com Filtros e Tabela", ref: "/templates/pagina-filtros-tabela" },
    { id: "hub-paineis", name: "Hub de Paineis", ref: "/templates#hub-paineis" },
  ],
};

function sha(s) { return createHash("sha256").update(s).digest("hex"); }
function writeJson(name, data) {
  const body = JSON.stringify(data, null, 2) + "\n";
  writeFileSync(resolve(OUT, name), body);
  return { file: name, bytes: body.length, sha256: sha(body) };
}
const files = [
  writeJson("tokens.json", dtcg),
  writeJson("tailwind.config.json", tailwind),
  writeJson("components.json", components),
];
writeFileSync(resolve(OUT, "tokens.css"), cssSnapshot);
files.push({ file: "tokens.css", bytes: cssSnapshot.length, sha256: sha(cssSnapshot) });

const manifest = {
  name: "__BRAND_NAME__ Design System",
  version: "latest",
  generatedAt: new Date().toISOString(),
  source: "https://__DS_DOMAIN__",
  usage: {
    figmaTokensStudio: "Import -> URL -> /design-system/tokens.json",
    tailwind: "Consuma /design-system/tailwind.config.json ou copie tokens.css",
    componentes: "/design-system/components.json aponta cada componente para a URL de referencia",
  },
  endpoints: {
    tokens: "/design-system/tokens.json",
    tokensCss: "/design-system/tokens.css",
    tailwind: "/design-system/tailwind.config.json",
    components: "/design-system/components.json",
    bridge: "/design-system/figma",
  },
  files,
};
writeFileSync(resolve(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log("OK - artefatos gerados:");
for (const f of files) console.log("  - " + f.file + " (" + f.bytes + " bytes)");
console.log("  - manifest.json");
