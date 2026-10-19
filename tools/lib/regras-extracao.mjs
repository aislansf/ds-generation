// Regras de extração: marca de origem → template neutro com placeholders.
// A ordem importa: conteúdo específico da origem primeiro (pode conter o nome da marca),
// depois domínios e URLs (contêm o prefixo), nomes, fontes e, por último, identificadores de código.
import { PLACEHOLDERS } from "../../skills/ds-build/scripts/lib/rules.mjs";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const WORD = /[\p{L}\p{N}_]/u;

/** Literal com bordas de palavra onde a chave começa/termina em letra ou número ("ALI" não casa com "ALIMENTOS"). */
function literal(from) {
  const start = WORD.test(from.at(0)) ? "(?<![\\p{L}\\p{N}_])" : "";
  const end = WORD.test(from.at(-1)) ? "(?![\\p{L}\\p{N}_])" : "";
  return new RegExp(start + esc(from) + end, "gu");
}

/** Regras que transformam o código da marca de origem em template neutro. */
export function buildExtractionRules(src) {
  const o = src.origem;
  const p = o.prefixo_codigo;
  const P = cap(p);
  const rules = [];
  const add = (re, rep, label) => rules.push({ re, rep, label });

  // 0. Conteúdo específico da origem: programas, unidades, endereços, slogans de campanha…
  for (const [from, to] of Object.entries(o.substituicoes_conteudo ?? {})) add(literal(from), to, "conteudo");
  // 0b. Padrões (identificadores e variações de caixa): [regex, substituição]
  for (const [re, to] of o.substituicoes_regex ?? []) add(new RegExp(re, "g"), to, "conteudo-regex");
  // 0c. Lugares (municípios e regiões da origem → nomes fictícios), com e sem acento, os mais longos primeiro
  for (const [from, to] of formasLugares(o)) add(literal(from), to, "lugar");

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

  // 4. Aliases de código explícitos (ex.: <prefixo>-blue → brand-primary)
  for (const [from, to] of Object.entries(o.aliases_codigo ?? {})) {
    add(new RegExp(`(?<![\\w])${esc(from)}(?![a-z])`, "g"), to, "alias");
  }

  // 5. Nome curto como texto — não toca identificadores como <Prefixo>Logo
  for (const n of [...new Set([src.nome_curto, ...(o.variantes_nome_curto ?? [])])]) {
    add(new RegExp(`(?<![\\w-])${esc(n)}(?![\\w])`, "g"), PLACEHOLDERS.BRAND_SHORT, "nome-curto");
  }

  // 6. Identificadores: <prefixo>-card → brand-card, <prefixo>Cor → brandCor, <Prefixo>Logo → BrandLogo
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
    ...(src.origem.substituicoes_caminho ?? []).map(([re, rep]) => ({ re: new RegExp(re, "g"), rep })),
    { re: new RegExp(`(?<![A-Za-z])${p}(?![a-z])`, "g"), rep: "brand" },
    { re: new RegExp(`(?<![A-Za-z])${P}(?=[A-Z0-9])`, "g"), rep: "Brand" },
  ];
}

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");

/** [forma na origem, nome fictício]: cada lugar com e sem acento, dos nomes mais longos para os mais curtos. */
function formasLugares(o) {
  const formas = new Map();
  for (const [from, to] of Object.entries(o.substituicoes_lugares ?? {})) {
    formas.set(from, to);
    formas.set(semAcento(from), to);
  }
  return [...formas].sort(([a], [b]) => b.length - a.length);
}

/** Regras de um arquivo específico (aplicadas antes de todas as outras): [regex, substituição], com flags "gm". */
export function buildFileRules(src, rel) {
  return (src.origem.substituicoes_por_arquivo?.[rel] ?? []).map(([re, rep]) => ({ re: new RegExp(re, "gm"), rep, label: "por-arquivo" }));
}

/** Termos que um arquivo pode manter (ex.: o nome de uma UF no GeoJSON do Brasil). */
export function termoPermitido(src, rel, termo) {
  return (src.origem.remanescentes_permitidos?.[rel] ?? []).includes(termo);
}

export function applyRules(text, rules, stats) {
  let out = text;
  for (const r of rules) {
    out = out.replace(r.re, () => {
      if (stats) stats[r.label ?? "path"] = (stats[r.label ?? "path"] ?? 0) + 1;
      return r.rep;
    });
  }
  return out;
}

/**
 * Termos que não podem sobrar no template: nomes da marca de origem (substring, sem caixa)
 * e nomes específicos do universo dela (palavra inteira, com caixa).
 */
export function residualMatchers(src) {
  const o = src.origem;
  const subs = [o.prefixo_codigo, ...(o.termos_proibidos_template ?? [])].filter(Boolean);
  const matchers = subs.map((t) => ({ termo: t, re: new RegExp(esc(t), "i") }));
  const especificos = new Set([...(o.termos_especificos ?? []), ...formasLugares(o).map(([from]) => from)]);
  for (const t of especificos) matchers.push({ termo: t, re: new RegExp(literal(t).source, "u") });
  return matchers;
}
