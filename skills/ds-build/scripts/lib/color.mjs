// Utilitários de cor usados pelo gerador de Design System.
// Sem dependências: conversão HEX/HSL, contraste WCAG, escalas e recoloração por família de matiz.

export function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }) {
  const c = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 };
}

/**
 * Conversão idêntica à de src/data/__tests__/tokenGroups.validator.test.ts —
 * usada para reescrever lightHex/darkHex em tokenGroups.ts sem divergir do teste.
 */
export function tripletToHexStrict(triplet) {
  const m = /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/.exec(triplet.trim());
  if (!m) return null;
  const h = parseFloat(m[1]) / 360, s = parseFloat(m[2]) / 100, l = parseFloat(m[3]) / 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) r = g = b = l;
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const hexToHsl = (hex) => rgbToHsl(hexToRgb(hex));
export const hslToHex = (hsl) => rgbToHex(hslToRgb(hsl));

/** Formata como triplet usado nos tokens shadcn: "228 70% 51%". */
export function hslTriplet({ h, s, l }) {
  return `${Math.round(h) % 360} ${Math.round(s)}% ${Math.round(l)}%`;
}

export function parseTriplet(str) {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/.exec(str);
  return m ? { h: +m[1], s: +m[2], l: +m[3] } : null;
}

export function relativeLuminance({ r, g, b }) {
  const ch = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function contrastRatio(rgbA, rgbB) {
  const a = relativeLuminance(rgbA), b = relativeLuminance(rgbB);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const hueDist = (a, b) => {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
};
const hueDelta = (from, to) => {
  let d = ((to - from) % 360 + 360) % 360;
  return d > 180 ? d - 360 : d;
};

/**
 * Escala 50–700 no mesmo padrão da escala institucional de referência
 * (luminosidades fixas, saturação relativa à cor base).
 * Retorna também a versão ajustada para dark mode.
 */
const LIGHT_STEPS = [
  [50, 97, 1.28], [100, 92, 1.21], [200, 82, 1.14], [300, 70, 1.07],
  [400, 60, 1.03], [500, null, 1], [600, 42, 1.03], [700, 32, 1.07],
];
const DARK_STEPS = [
  [50, 14, 0.57], [100, 20, 0.64], [200, 30, 0.71], [300, 45, 0.86],
  [400, 55, 1], [500, 65, 1.07], [600, 75, 1.11], [700, 85, 1.14],
];

export function buildScale(hex) {
  const base = hexToHsl(hex);
  const light = {}, dark = {};
  for (const [step, l, sMul] of LIGHT_STEPS) {
    light[step] = step === 500 ? { ...base } : { h: base.h, s: clamp(base.s * sMul, 0, 100), l };
  }
  for (const [step, l, sMul] of DARK_STEPS) {
    dark[step] = { h: base.h, s: clamp(base.s * sMul, 0, 100), l };
  }
  return { base, light, dark };
}

/**
 * Recoloração por família de matiz.
 * Uma família descreve uma cor da marca de origem (hue/sat/light) e a janela de matiz
 * que pertence a ela. Qualquer cor dentro da janela (e saturada o suficiente) é
 * transportada para a cor-alvo preservando a estrutura de luminosidade.
 */
export function makeRecolorer(families) {
  // families: [{ name, source:{h,s,l,hex}, target:{h,s,l,hex}, window:[min,max] | {center, radius}, minSat, lightRange? }]
  function familyOf({ h, s, l }) {
    for (const f of families) {
      if (!f.target) continue;
      const minSat = (l >= 90 || l <= 15) ? Math.max(f.minSat ?? 30, 45) : (f.minSat ?? 30);
      if (s < minSat) continue;
      if (f.lightRange && (l < f.lightRange[0] || l > f.lightRange[1])) continue;
      const inWindow = Array.isArray(f.window)
        ? h >= f.window[0] && h < f.window[1]
        : hueDist(h, f.window.center) <= f.window.radius;
      if (inWindow) return f;
    }
    return null;
  }

  function mapHsl(hsl) {
    const f = familyOf(hsl);
    if (!f) return null;
    const { source: src, target: tgt } = f;
    const offset = hueDelta(src.h, hsl.h);
    const h = ((tgt.h + offset) % 360 + 360) % 360;
    const sRatio = src.s > 0 ? tgt.s / src.s : 1;
    let s = clamp(hsl.s * sRatio, 0, 100);
    if (hsl.l <= 20) s = Math.min(s, Math.max(hsl.s, 60));
    const w = clamp(1 - Math.abs(hsl.l - src.l) / 40, 0, 1);
    const l = clamp(hsl.l + (tgt.l - src.l) * w, 0, 100);
    return { h, s, l, family: f.name };
  }

  function mapHex(hex) {
    const up = hex.toUpperCase();
    for (const f of families) {
      if (f.target && f.source.hex && f.source.hex.toUpperCase() === up) return f.target.hex.toUpperCase();
    }
    const m = mapHsl(hexToHsl(hex));
    return m ? hslToHex(m) : null;
  }

  function mapTriplet({ h, s, l }) {
    for (const f of families) {
      if (!f.target) continue;
      const exact = Math.round(f.source.h) === Math.round(h) && Math.round(f.source.s) === Math.round(s) && Math.round(f.source.l) === Math.round(l);
      if (exact) return { ...f.target };
    }
    return mapHsl({ h, s, l });
  }

  return { mapHex, mapTriplet, familyOf };
}

const HEX_RE = /#([0-9a-fA-F]{6})\b/g;
// Triplet HSL (formato shadcn): "228 70% 51%" — também dentro de hsl(228 70% 30% / 0.05)
const TRIPLET_RE = /(?<![\d.#-])(\d{1,3}(?:\.\d+)?) (\d{1,3}(?:\.\d+)?)% (\d{1,3}(?:\.\d+)?)%/g;

/** Aplica a recoloração a um texto qualquer (CSS, TSX, TS, HTML). */
export function recolorText(text, recolorer, stats) {
  let out = text.replace(HEX_RE, (m) => {
    const mapped = recolorer.mapHex(m);
    if (!mapped || mapped === m.toUpperCase()) return m;
    if (stats) stats.hex++;
    // Preserva a caixa original
    return m === m.toLowerCase() ? mapped.toLowerCase() : mapped;
  });
  out = out.replace(TRIPLET_RE, (m, h, s, l) => {
    const hsl = { h: +h, s: +s, l: +l };
    if (hsl.h > 360 || hsl.s > 100 || hsl.l > 100) return m;
    const mapped = recolorer.mapTriplet(hsl);
    if (!mapped) return m;
    const t = hslTriplet(mapped);
    if (t !== m && stats) stats.hsl++;
    return t;
  });
  return out;
}
