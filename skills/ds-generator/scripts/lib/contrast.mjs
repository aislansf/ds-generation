// Auditoria de contraste WCAG dos pares de tokens declarados em src/index.css.
import { parseTriplet, hslToRgb, contrastRatio } from "./color.mjs";

/** Pares [texto, fundo] que o DS promete legíveis. */
export const PAIRS = [
  ["--foreground", "--background"],
  ["--card-foreground", "--card"],
  ["--popover-foreground", "--popover"],
  ["--primary-foreground", "--primary"],
  ["--secondary-foreground", "--secondary"],
  ["--muted-foreground", "--background"],
  ["--muted-foreground", "--muted"],
  ["--accent-foreground", "--accent"],
  ["--destructive-foreground", "--destructive"],
  ["--card-icon-foreground", "--card-icon"],
  ["--success", "--success-bg"],
  ["--warning-foreground", "--warning"],
  ["--error", "--error-bg"],
  ["--info", "--info-bg"],
  ["--brand-btn-fg", "--primary"],
  ["--sidebar-foreground", "--sidebar-background"],
  ["--sidebar-primary-foreground", "--sidebar-primary"],
  ["--header-surface-foreground", "--header-surface"],
];

/** Conteúdo de todos os blocos `selector { ... }` (concatenados). */
export function blockBodies(css, selector) {
  const out = [];
  const re = new RegExp(`(^|[\\s}])${selector.replace(/[.]/g, "\\.")}\\s*\\{`, "g");
  let m;
  while ((m = re.exec(css))) {
    let depth = 1, i = m.index + m[0].length;
    const start = i;
    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }
    out.push({ start, end: i - 1, body: css.slice(start, i - 1) });
  }
  return out;
}

export function parseVars(css, selector) {
  const vars = new Map();
  for (const { body } of blockBodies(css, selector)) {
    const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of clean.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) vars.set(m[1], m[2].trim());
  }
  return vars;
}

export function auditContrast(css) {
  const light = parseVars(css, ":root");
  const darkOnly = parseVars(css, ".dark");
  const dark = new Map([...light, ...darkOnly]);
  const rows = [];
  for (const [mode, vars] of [["light", light], ["dark", dark]]) {
    for (const [fg, bg] of PAIRS) {
      const a = parseTriplet(vars.get(fg) ?? ""), b = parseTriplet(vars.get(bg) ?? "");
      if (!a || !b) continue;
      const ratio = contrastRatio(hslToRgb(a), hslToRgb(b));
      rows.push({ mode, fg, bg, ratio, nivel: ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA grande" : "FALHA" });
    }
  }
  return rows;
}

export function contrastTable(rows) {
  const head = "| Modo | Texto | Fundo | Razão | Nível |\n|---|---|---|---|---|";
  return [head, ...rows.map((r) => `| ${r.mode} | \`${r.fg}\` | \`${r.bg}\` | ${r.ratio.toFixed(2)}:1 | ${r.nivel === "FALHA" ? "**FALHA**" : r.nivel} |`)].join("\n");
}
