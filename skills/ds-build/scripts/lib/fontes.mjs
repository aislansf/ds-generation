// Textos de tipografia que dependem da origem de cada fonte (Google Fonts ou proprietária).
// O template descreve a primária e a sistêmica como Google Fonts e a display como proprietária;
// aqui eles passam a seguir o briefing. Roda sobre o texto do template, antes dos placeholders.
import { PLACEHOLDERS, isGoogleFont, googleCssUrl } from "./rules.mjs";

const PAPEIS = [
  { key: "primaria", ph: PLACEHOLDERS.FONT_PRIMARY, papel: "primária" },
  { key: "display", ph: PLACEHOLDERS.FONT_DISPLAY, papel: "secundária" },
  { key: "sistema", ph: PLACEHOLDERS.FONT_SYSTEM, papel: "sistêmica" },
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Nos snippets (template literals de uma linha) a quebra de linha é o texto "\n"
const NL = "\\n";

/** Fonte efetiva de cada papel: display e sistema sem resposta usam a primária. */
function fontesEfetivas(brief) {
  const f = brief.fontes ?? {};
  return { primaria: f.primaria, display: f.display || f.primaria, sistema: f.sistema || f.primaria };
}

function fontFace(ph, font, indent = "", nl = "\n") {
  return [
    `${indent}@font-face {`,
    `${indent}  font-family: '${ph}';`,
    `${indent}  src: url('${font.url_woff2}') format('woff2');`,
    `${indent}  font-weight: ${font.peso ?? 700};`,
    `${indent}  font-display: swap;`,
    `${indent}}`,
  ].join(nl);
}

function downloads(ph, font, key, eol) {
  const item = (label, url, note) => `            { label: ${JSON.stringify(label)}, url: ${JSON.stringify(url)}, note: ${JSON.stringify(note)} },`;
  const linhas = isGoogleFont(font)
    ? [
        item("Google Fonts — página oficial (download .zip com TTF)", `https://fonts.google.com/specimen/${font.nome.replace(/ /g, "+")}`, "Arquivos TTF para Power BI, Office e Adobe. Licença SIL Open Font 1.1."),
        item("CSS hospedado (CDN Google Fonts)", googleCssUrl(font, key), "Pronto para <link rel=\"stylesheet\">."),
      ]
    : [
        item(`${ph} (WOFF2) — CDN oficial da marca`, font.url_woff2, `Arquivo carregado pelo DS. Para produção, hospede uma cópia em /public/fonts/.`),
        item(`Solicitação interna — Marca ${PLACEHOLDERS.BRAND_SHORT}`, `mailto:marca@${PLACEHOLDERS.ORG_ROOT_DOMAIN}?subject=Solicitação%20da%20fonte%20${font.nome.replace(/ /g, "%20")}%20(TTF/OTF)`, "Para receber o pacote completo (TTF/OTF) com todos os pesos — uso em Power BI, PowerPoint e impressos."),
      ];
  return `downloads={[${eol}${linhas.join(eol)}${eol}          ]}`;
}

function ajustarCard(card, { key, ph }, font, fallback) {
  const google = isGoogleFont(font);
  const eol = card.includes("\r\n") ? "\r\n" : "\n";
  card = card.replace(/source="[^"]*"/, `source="${google ? "Google Fonts · Open Source" : `Proprietária ${PLACEHOLDERS.BRAND_SHORT} · CDN da marca`}"`);
  card = card.replace(/downloads=\{\[[\s\S]*?\n\s*\]\}/, () => downloads(ph, font, key, eol));
  card = card.replace(
    /footnote="[^"]*"/,
    `footnote="${google
      ? `${ph} é distribuída pelo Google Fonts (licença SIL Open Font 1.1). Se não carregar, o sistema usa ${fallback} como fallback automático.`
      : `${ph} é proprietária do ${PLACEHOLDERS.BRAND_SHORT} e é carregada da CDN da marca. Se o arquivo não carregar, o sistema usa ${fallback} como fallback automático.`}"`,
  );
  const googleLinks = (url) =>
    [`<link rel="preconnect" href="https://fonts.googleapis.com">`, `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, `<link href="${url}" rel="stylesheet">`].join(NL);
  if (google) {
    const url = googleCssUrl(font, key);
    // @font-face de arquivo próprio → @import / <link> do Google Fonts
    card = card.replace(/(cssSnippet=\{`[^`]*?)@font-face \{\\n.*?\\n\}/, (m, pre) => `${pre}@import url('${url}');`);
    card = card.replace(/(htmlSnippet=\{`[^`]*?)<style>\\n {2}@font-face \{.*?\\n {2}\}\\n<\/style>/, (m, pre) => `${pre}${googleLinks(url)}`);
  } else {
    // <link> do Google Fonts → @font-face com o arquivo da marca; @font-face existente → arquivo e peso do briefing
    const style = `<style>${NL}${fontFace(ph, font, "  ", NL)}${NL}</style>`;
    const re = new RegExp(`(htmlSnippet=\\{\`[^\`]*?)<link rel="preconnect"[^>]*>\\\\n<link rel="preconnect"[^>]*>\\\\n<link href="https://fonts\\.googleapis\\.com/[^"]*" rel="stylesheet">`);
    card = card.replace(re, (m, pre) => `${pre}${style}`);
    card = card.replace(/(htmlSnippet=\{`[^`]*?)<style>\\n {2}@font-face \{.*?\\n {2}\}\\n<\/style>/, (m, pre) => `${pre}${style}`);
    card = card.replace(/(cssSnippet=\{`[^`]*?)@font-face \{\\n.*?\\n\}/, (m, pre) => `${pre}${fontFace(ph, font, "", NL)}`);
  }
  return card;
}

function ajustarFundamentos(text, brief, avisos) {
  const fontes = fontesEfetivas(brief);
  const fallbackDe = (key) => (fontes[key].nome === fontes.primaria.nome ? "system-ui" : PLACEHOLDERS.FONT_PRIMARY);

  text = text.replace(/<FontFamilyCard\b[\s\S]*?\n\s*\/>/g, (card) => {
    const papel = PAPEIS.find((p) => card.includes(`name="${p.ph}"`));
    if (!papel || !fontes[papel.key]) return card;
    const novo = ajustarCard(card, papel, fontes[papel.key], fallbackDe(papel.key));
    const google = isGoogleFont(fontes[papel.key]);
    if (google ? /propriet|\.woff2/i.test(novo) : /fonts\.googleapis/.test(novo)) {
      avisos.push(`FundamentosPage: o card da fonte ${fontes[papel.key].nome} ainda cita ${google ? "fonte proprietária" : "o Google Fonts"}. Revise os textos de tipografia.`);
    }
    return novo;
  });

  if (isGoogleFont(fontes.display)) text = text.replace("(secundária, display proprietária)", "(secundária, display)");

  // Bloco "Uso da tipografia": como cada fonte é carregada
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  for (const { key, ph, papel } of PAPEIS) {
    const font = fontes[key];
    const re = new RegExp(`/\\* ${esc(ph)} \\(${papel}\\) — [^*]*\\*/\\r?\\n(?:@import url\\('[^']*'\\);|@font-face \\{\\r?\\n[\\s\\S]*?\\r?\\n\\})`);
    text = text.replace(re, () =>
      isGoogleFont(font)
        ? `/* ${ph} (${papel}) — Google Fonts */${eol}@import url('${googleCssUrl(font, key)}');`
        : `/* ${ph} (${papel}) — fonte proprietária ${PLACEHOLDERS.BRAND_SHORT} */${eol}${fontFace(ph, font, "", eol)}`,
    );
  }
  return text;
}

/** index.html: o preload do Google Fonts só para as fontes que vêm de lá. */
function ajustarIndexHtml(text, brief) {
  const fontes = fontesEfetivas(brief);
  const preload = (ph) => new RegExp(`\\r?\\n\\s*<link\\s+rel="preload"\\s+as="style"\\s+href="https://fonts\\.googleapis\\.com/css2\\?family=${esc(ph)}[^"]*"\\s*>`, "g");
  // Preload só das fontes do Google, sem repetir a primária quando a sistêmica é ela mesma
  const mantidos = [];
  for (const { key, ph, papel } of PAPEIS.filter((p) => p.key !== "display")) {
    const repetida = key === "sistema" && fontes.sistema.nome === fontes.primaria.nome;
    if (isGoogleFont(fontes[key]) && !repetida) {
      mantidos.push(`${ph} ${papel}`);
      // Mesma URL (e pesos) que o index.css importa, senão o preload não é aproveitado
      const url = googleCssUrl(fontes[key], key);
      text = text.replace(preload(ph), (m) => m.replace(/href="[^"]*"/, `href="${url}"`));
    } else text = text.replace(preload(ph), "");
  }

  // Comentários citam só as fontes que vêm do Google; sem nenhuma, o preconnect sai junto
  const doGoogle = [...new Map(PAPEIS.filter((p) => isGoogleFont(fontes[p.key])).map((p) => [fontes[p.key].nome, p.ph])).values()];
  text = doGoogle.length
    ? text.replace(/(<!-- Tipografia oficial [^:]*: preconnect para Google Fonts )\([^)]*\)( -->)/, (m, a, b) => `${a}(${doGoogle.join(" + ")})${b}`)
    : text.replace(/\r?\n\s*<!-- Tipografia oficial [^:]*: preconnect para Google Fonts \([^)]*\) -->(?:\r?\n\s*<link rel="preconnect" href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"[^>]*>)*/, "");
  text = mantidos.length
    ? text.replace(/(<!-- Preload das fontes Google )\([^)]*\)( -->)/, (m, a, b) => `${a}(${mantidos.join(" + ")})${b}`)
    : text.replace(/\r?\n\s*<!-- Preload das fontes Google \([^)]*\) -->/, "");
  return text;
}

/** Ajusta os textos de tipografia de um arquivo do template à origem das fontes do briefing. */
export function ajustarFontes(rel, text, brief, avisos) {
  if (rel === "src/pages/FundamentosPage.tsx") return ajustarFundamentos(text, brief, avisos);
  if (rel === "index.html") return ajustarIndexHtml(text, brief);
  return text;
}
