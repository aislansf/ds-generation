// Regras de extração (marca de origem → placeholders) e de geração (placeholders → marca nova).
// A ordem importa: domínios e URLs primeiro (contêm o prefixo da marca), depois nomes,
// fontes e, por último, identificadores de código.

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
  FONT_PRIMARY: "__FONT_PRIMARY__",
  FONT_DISPLAY: "__FONT_DISPLAY__",
  FONT_SYSTEM: "__FONT_SYSTEM__",
  FONT_IMPORTS: "/* __FONT_IMPORTS__ */",
};

/** Regras que transformam o código da marca de origem em template neutro. */
export function buildExtractionRules(src) {
  const o = src.origem;
  const p = o.prefixo_codigo; // ex.: "sebrae"
  const P = cap(p);
  const rules = [];
  const add = (re, rep, label) => rules.push({ re, rep, label });

  // 0. Conteúdo de exemplo específico da origem (ex.: nomes de programas)
  for (const [from, to] of Object.entries(o.substituicoes_conteudo ?? {})) add(new RegExp(esc(from), "g"), to, "conteudo");

  // 1. URLs e domínios (do mais específico para o mais genérico)
  for (const url of o.urls_manual ?? []) add(new RegExp(esc(url), "g"), PLACEHOLDERS.BRAND_MANUAL_URL, "manual");
  if (o.og_image) add(new RegExp(esc(o.og_image), "g"), PLACEHOLDERS.OG_IMAGE_URL, "og-image");
  const d = src.dominios ?? {};
  if (d.ds) add(new RegExp(esc(d.ds), "g"), PLACEHOLDERS.DS_DOMAIN, "dominio-ds");
  if (d.org) add(new RegExp(esc(d.org), "g"), PLACEHOLDERS.ORG_DOMAIN, "dominio-org");
  if (d.org_raiz) add(new RegExp(`(?<![\\w.-])${esc(d.org_raiz)}`, "g"), PLACEHOLDERS.ORG_ROOT_DOMAIN, "dominio-org-raiz");

  // 2. Slogan, nome completo e variantes do nome
  if (src.slogan) add(new RegExp(esc(src.slogan), "g"), PLACEHOLDERS.BRAND_SLOGAN, "slogan");
  if (src.nome_completo) add(new RegExp(esc(src.nome_completo), "g"), PLACEHOLDERS.BRAND_FULL_NAME, "nome-completo");
  // variantes mais longas primeiro
  const nomes = [...new Set([src.nome, ...(o.variantes_nome ?? [])])].sort((a, b) => b.length - a.length);
  for (const n of nomes) add(new RegExp(`(?<![\\w-])${esc(n)}(?![\\w])`, "g"), PLACEHOLDERS.BRAND_NAME, "nome");

  // 3. Fontes
  const f = src.fontes ?? {};
  const fontRule = (nome, ph) => nome && add(new RegExp(`\\b${esc(nome)}\\b`, "g"), ph, "fonte");
  fontRule(f.primaria?.nome, PLACEHOLDERS.FONT_PRIMARY);
  fontRule(f.display?.nome, PLACEHOLDERS.FONT_DISPLAY);
  fontRule(f.sistema?.nome, PLACEHOLDERS.FONT_SYSTEM);

  // 4. Aliases de código explícitos (ex.: sebrae-blue → brand-primary)
  for (const [from, to] of Object.entries(o.aliases_codigo ?? {})) {
    add(new RegExp(`(?<![\\w])${esc(from)}(?![a-z])`, "g"), to, "alias");
  }

  // 5. Nome curto como texto (SEBRAE, Sebrae) — não toca identificadores como SebraeLogo
  for (const n of [...new Set([src.nome_curto, ...(o.variantes_nome_curto ?? [])])]) {
    add(new RegExp(`(?<![\\w-])${esc(n)}(?![\\w])`, "g"), PLACEHOLDERS.BRAND_SHORT, "nome-curto");
  }

  // 6. Identificadores: sebrae-card → brand-card, sebraeCor → brandCor, SebraeLogo → BrandLogo
  add(new RegExp(`(?<![A-Za-z])${p}(?![a-z])`, "g"), "brand", "id-lower");
  add(new RegExp(`(?<![A-Za-z])${P}(?=[A-Z0-9])`, "g"), "Brand", "id-pascal");
  add(new RegExp(`(?<=[a-z])${P}(?![a-z])`, "g"), "Brand", "id-camel");

  return rules;
}

/** Regras só para nomes de arquivo/pasta. */
export function buildPathRules(src) {
  const p = src.origem.prefixo_codigo;
  const P = cap(p);
  return [
    { re: new RegExp(`(?<![A-Za-z])${p}(?![a-z])`, "g"), rep: "brand" },
    { re: new RegExp(`(?<![A-Za-z])${P}(?=[A-Z0-9])`, "g"), rep: "Brand" },
  ];
}

export function applyRules(text, rules, stats) {
  let out = text;
  for (const r of rules) {
    out = out.replace(r.re, (...args) => {
      if (stats) stats[r.label ?? "path"] = (stats[r.label ?? "path"] ?? 0) + 1;
      return r.rep;
    });
  }
  return out;
}

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
    [PLACEHOLDERS.FONT_PRIMARY]: prim,
    [PLACEHOLDERS.FONT_DISPLAY]: f.display?.nome || prim,
    [PLACEHOLDERS.FONT_SYSTEM]: f.sistema?.nome || prim,
  };
}

/** Bloco de @import/@font-face que abre o index.css gerado. */
export function fontImportsBlock(brief) {
  const f = brief.fontes ?? {};
  const lines = [
    "/* === Tipografia da marca (gerado pelo ds-generator) ===",
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
    if (font.google !== false && !font.url_woff2) {
      const pesos = font.pesos ?? (key === "display" ? [400, 700, 900] : [300, 400, 500, 600, 700, 800, 900]);
      lines.push(`@import url('https://fonts.googleapis.com/css2?family=${font.nome.replace(/ /g, "+")}:wght@${pesos.join(";")}&display=swap');`);
    }
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
