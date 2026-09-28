// Placeholders do template e os valores que eles recebem na geração (placeholders → marca nova).
import { hexToHsl } from "./color.mjs";

export const PLACEHOLDERS = {
  BRAND_NAME: "__BRAND_NAME__",
  BRAND_SHORT: "__BRAND_SHORT__",
  BRAND_FULL_NAME: "__BRAND_FULL_NAME__",
  DS_DOMAIN: "__DS_DOMAIN__",
  ORG_DOMAIN: "__ORG_DOMAIN__",
  ORG_ROOT_DOMAIN: "__ORG_ROOT_DOMAIN__",
  BRAND_MANUAL_URL: "__BRAND_MANUAL_URL__",
  OG_IMAGE_URL: "__OG_IMAGE_URL__",
  BRAND_SLOGAN: "__BRAND_SLOGAN__",
  BRAND_PRIMARY_HUE: "__BRAND_PRIMARY_HUE__",
  FONT_PRIMARY: "__FONT_PRIMARY__",
  FONT_DISPLAY: "__FONT_DISPLAY__",
  FONT_SYSTEM: "__FONT_SYSTEM__",
  FONT_DISPLAY_URL: "__FONT_DISPLAY_URL__",
  FONT_IMPORTS: "/* __FONT_IMPORTS__ */",
};

/** Valores que substituem os placeholders na geração. */
export function placeholderValues(brief) {
  const d = brief.dominios ?? {};
  const f = brief.fontes ?? {};
  const prim = f.primaria?.nome || "Inter";
  return {
    [PLACEHOLDERS.BRAND_NAME]: brief.nome,
    [PLACEHOLDERS.BRAND_SHORT]: brief.nome_curto || brief.nome,
    [PLACEHOLDERS.BRAND_FULL_NAME]: brief.nome_completo || brief.nome,
    [PLACEHOLDERS.DS_DOMAIN]: d.ds || `ds.${brief.slug}.example`,
    [PLACEHOLDERS.ORG_DOMAIN]: d.org || d.org_raiz || `${brief.slug}.example`,
    [PLACEHOLDERS.ORG_ROOT_DOMAIN]: d.org_raiz || d.org || `${brief.slug}.example`,
    [PLACEHOLDERS.BRAND_MANUAL_URL]: brief.manual_marca_url || "#",
    [PLACEHOLDERS.OG_IMAGE_URL]: brief.og_image_url || `https://${d.ds || `ds.${brief.slug}.example`}/favicon.svg`,
    [PLACEHOLDERS.BRAND_SLOGAN]: brief.slogan || brief.descricao || brief.nome,
    [PLACEHOLDERS.BRAND_PRIMARY_HUE]: String(Math.round(hexToHsl(brief.cores.primaria).h) % 360),
    [PLACEHOLDERS.FONT_PRIMARY]: prim,
    [PLACEHOLDERS.FONT_DISPLAY]: f.display?.nome || prim,
    [PLACEHOLDERS.FONT_SYSTEM]: f.sistema?.nome || prim,
    [PLACEHOLDERS.FONT_DISPLAY_URL]: (f.display || f.primaria)?.url_woff2 || "/fonts/display-bold.woff2",
  };
}

/** A fonte vem do Google Fonts? (proprietária = google false ou url_woff2 própria) */
export const isGoogleFont = (font) => font?.google !== false && !font?.url_woff2;

/** URL do CSS do Google Fonts com os pesos da fonte (ou os padrões do papel dela). */
export function googleCssUrl(font, key) {
  const pesos = font.pesos ?? (key === "display" ? [400, 700, 900] : [300, 400, 500, 600, 700, 800, 900]);
  return `https://fonts.googleapis.com/css2?family=${font.nome.replace(/ /g, "+")}:wght@${pesos.join(";")}&display=swap`;
}

/** Bloco de @import/@font-face que abre o index.css gerado. */
export function fontImportsBlock(brief) {
  const f = brief.fontes ?? {};
  const lines = [
    "/* === Tipografia da marca (gerado pelo ds-build) ===",
    ` * Primária: ${f.primaria?.nome} — corpo, UI, H1/H3.`,
    ` * Display:  ${f.display?.nome || f.primaria?.nome} — H2 e títulos de impacto.`,
    ` * Sistema:  ${f.sistema?.nome || f.primaria?.nome} — legendas e leitura prolongada.`,
    " */",
  ];
  const seen = new Set();
  for (const key of ["primaria", "display", "sistema"]) {
    const font = f[key];
    if (!font?.nome || seen.has(font.nome)) continue;
    seen.add(font.nome);
    if (isGoogleFont(font)) lines.push(`@import url('${googleCssUrl(font, key)}');`);
  }
  for (const key of ["primaria", "display", "sistema"]) {
    const font = f[key];
    if (!font?.url_woff2) continue;
    lines.push(
      "",
      `@font-face {`,
      `  font-family: '${font.nome}';`,
      `  src: url('${font.url_woff2}') format('woff2');`,
      `  font-weight: ${font.peso ?? 700};`,
      `  font-style: normal;`,
      `  font-display: swap;`,
      `}`,
    );
  }
  return lines.join("\n");
}
