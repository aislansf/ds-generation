// Questionário obrigatório do briefing. Toda pergunta precisa de resposta explícita do usuário:
// campos opcionais aceitam uma resposta de "não se aplica" (false, "derivar", "manter", []), mas nunca ficar em branco.
// Usado por generate-ds.mjs (recusa gerar com pendências) e por validar-briefing.mjs (lista o que falta perguntar).
import fs from "node:fs";
import path from "node:path";

const HEX = /^#[0-9a-fA-F]{6}$/;
const DOMINIO = /^(?!https?:\/\/)[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
const URL_RE = /^https?:\/\/\S+$/i;
const IMAGEM = /\.(svg|png|jpe?g|webp)$/i;

const isStr = (v) => typeof v === "string" && v.trim() !== "";
const isFont = (v) => v && typeof v === "object" && isStr(v.nome) && (v.google === true || (v.google === false && URL_RE.test(v.url_woff2 ?? "")));

/**
 * Perguntas na ordem em que devem ser feitas. `ok(valor, ctx)` devolve true se a resposta é válida;
 * `aceita` descreve as respostas possíveis (vai para a mensagem de pendência).
 */
export const PERGUNTAS = [
  { campo: "nome", pergunta: "Qual é o nome de exibição da marca?", aceita: "texto", ok: isStr },
  { campo: "nome_curto", pergunta: "Qual é o nome curto ou sigla?", aceita: "texto (repita o nome se não houver sigla)", ok: isStr },
  { campo: "nome_completo", pergunta: "Qual é a razão social ou o nome por extenso?", aceita: "texto", ok: isStr },
  { campo: "genero", pergunta: "O nome da marca é masculino (\"do/no/o …\") ou feminino (\"da/na/a …\")?", aceita: "\"m\" ou \"f\"", ok: (v) => v === "m" || v === "f" },
  { campo: "slug", pergunta: "Qual identificador usar em arquivos e pacotes?", aceita: "minúsculas, números e hífen", ok: (v) => isStr(v) && /^[a-z0-9-]+$/.test(v) },
  { campo: "slogan", pergunta: "Qual é o slogan ou frase-assinatura da marca?", aceita: "texto", ok: isStr },
  { campo: "descricao", pergunta: "Em uma frase, para que serve este Design System?", aceita: "texto", ok: isStr },

  { campo: "dominios.ds", pergunta: "Em qual domínio o DS será publicado?", aceita: "domínio, ex.: ds.minhamarca.com.br", ok: (v) => isStr(v) && DOMINIO.test(v) },
  { campo: "dominios.org", pergunta: "Qual é o domínio institucional (usado em e-mails de exemplo)?", aceita: "domínio", ok: (v) => isStr(v) && DOMINIO.test(v) },
  { campo: "dominios.org_raiz", pergunta: "O portal principal usa outro domínio, diferente do institucional?", aceita: "domínio, ou false se for o mesmo", ok: (v) => v === false || (isStr(v) && DOMINIO.test(v)) },
  { campo: "manual_marca_url", pergunta: "Qual é a URL do manual de marca/brandbook?", aceita: "URL http(s), ou false se não houver", ok: (v) => v === false || (isStr(v) && URL_RE.test(v)) },
  { campo: "og_image_url", pergunta: "Qual imagem usar no compartilhamento em redes (Open Graph)?", aceita: "URL http(s), ou false para usar o favicon", ok: (v) => v === false || (isStr(v) && URL_RE.test(v)) },

  { campo: "cores.primaria", pergunta: "Qual é a cor primária (institucional)?", aceita: "#RRGGBB", ok: (v) => HEX.test(v ?? "") },
  { campo: "cores.secundaria", pergunta: "Qual é a cor secundária (apoio)?", aceita: "#RRGGBB, ou \"derivar\" para calcular a partir da primária", ok: (v) => v === "derivar" || HEX.test(v ?? "") },
  { campo: "cores.destaque", pergunta: "Qual cor usar para destaque/texto sobre a primária?", aceita: "#RRGGBB, ou \"derivar\" para um tom claro da primária", ok: (v) => v === "derivar" || HEX.test(v ?? "") },
  { campo: "cores.realce", pergunta: "Qual cor usar para chamadas pontuais (asterisco obrigatório, links de ação)?", aceita: "#RRGGBB, ou \"manter\" para o laranja do template", ok: (v) => v === "manter" || HEX.test(v ?? "") },

  { campo: "fontes.primaria", pergunta: "Qual é a fonte primária (corpo e UI)? É do Google Fonts?", aceita: "{ \"nome\", \"google\": true } ou { \"nome\", \"google\": false, \"url_woff2\" }", ok: isFont },
  { campo: "fontes.display", pergunta: "Qual fonte usar em títulos de impacto (display)?", aceita: "fonte como a primária, ou false para usar a primária", ok: (v) => v === false || isFont(v) },
  { campo: "fontes.sistema", pergunta: "Qual fonte usar em legendas e leitura prolongada (sistema)?", aceita: "fonte como a primária, ou false para usar a primária", ok: (v) => v === false || isFont(v) },

  { campo: "logos.cor", pergunta: "Onde está o logo em cores (SVG de preferência)?", aceita: "caminho de arquivo existente, ou false se não houver (gera logotipo provisório)", ok: arquivoOuFalse },
  { campo: "logos.branco", pergunta: "Onde está o logo monocromático branco?", aceita: "caminho de arquivo existente, ou false se não houver", ok: arquivoOuFalse },
  { campo: "logos.preto", pergunta: "Onde está o logo monocromático preto?", aceita: "caminho de arquivo existente, ou false se não houver", ok: arquivoOuFalse },
  { campo: "favicon", pergunta: "Onde está o favicon?", aceita: "caminho de .png ou .svg existente, ou false para gerar um monograma", ok: (v, ctx) => v === false || (arquivoOuFalse(v, ctx) && /\.(png|svg)$/i.test(v)) },

  { campo: "termos_proibidos", pergunta: "Há marcas ou nomes antigos que não podem aparecer no DS?", aceita: "lista de textos, ou [] se não houver", ok: (v) => Array.isArray(v) && v.every(isStr) },

  { campo: "conteudo.tom_de_voz", pergunta: "Como a marca fala (tom de voz)?", aceita: "texto", ok: isStr },
  { campo: "conteudo.publico", pergunta: "Quem usa os produtos digitais da marca?", aceita: "texto", ok: isStr },
  { campo: "conteudo.paleta_estendida", pergunta: "O manual define cores de apoio além das principais (nome, HEX e uso)?", aceita: "lista de { \"nome\", \"hex\", \"uso\" }, ou [] se não houver", ok: (v) => Array.isArray(v) && v.every((c) => isStr(c?.nome) && HEX.test(c?.hex ?? "") && isStr(c?.uso)) },
  { campo: "conteudo.regras_de_marca", pergunta: "Quais regras de uso do logo o manual define (área de proteção, tamanho mínimo, usos proibidos)?", aceita: "lista de textos, ou [] se não houver", ok: (v) => Array.isArray(v) && v.every(isStr) },

  { campo: "modulos.modelos_bi", pergunta: "O DS deve manter a seção Modelos de BI (Radar Estratégico, Planejamento, MPI, Gestão de Pessoas)?", aceita: "true ou false", ok: (v) => typeof v === "boolean" },

  { campo: "confirmado_pelo_usuario", pergunta: "O usuário revisou o resumo de todas as respostas e confirmou?", aceita: "true, só depois da confirmação explícita", ok: (v) => v === true },
];

function arquivoOuFalse(v, ctx) {
  if (v === false) return true;
  return isStr(v) && IMAGEM.test(v) && fs.existsSync(path.resolve(ctx.dir, v));
}

const get = (obj, campo) => campo.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** Valor ainda com o texto-modelo do brand-brief.template.json. */
const naoPreenchido = (v) =>
  (typeof v === "string" && /^PREENCHER/i.test(v.trim())) || (v && typeof v === "object" && JSON.stringify(v).includes("PREENCHER"));

/**
 * Confere o briefing inteiro. Devolve a lista de pendências (vazia = pode gerar).
 * @param {object} brief  briefing lido do JSON
 * @param {string} dir    pasta do JSON (caminhos de logo e favicon são relativos a ela)
 */
export function validarBriefing(brief, dir) {
  const pendencias = [];
  for (const q of PERGUNTAS) {
    const v = get(brief, q.campo);
    let motivo = null;
    if (v === undefined || v === null || v === "") motivo = "sem resposta";
    else if (naoPreenchido(v)) motivo = "ainda com o texto do modelo";
    else if (!q.ok(v, { dir, brief })) motivo = `resposta inválida (${JSON.stringify(v).slice(0, 80)})`;
    if (motivo) pendencias.push({ ...q, motivo });
  }
  return pendencias;
}

export function formatarPendencias(pendencias) {
  return pendencias.map((p, i) => `  ${i + 1}. ${p.campo} — ${p.motivo}\n     Pergunte: ${p.pergunta}\n     Aceita: ${p.aceita}`).join("\n");
}

/**
 * Converte as respostas de "não se aplica" no formato que o gerador usa (campo ausente = usar o padrão).
 * Só chame depois de validarBriefing sem pendências.
 */
export function normalizarBriefing(brief) {
  const b = structuredClone(brief);
  const drop = (obj, k, ...vals) => { if (obj && vals.includes(obj[k])) delete obj[k]; };
  drop(b.dominios, "org_raiz", false);
  drop(b, "manual_marca_url", false);
  drop(b, "og_image_url", false);
  drop(b.cores, "secundaria", "derivar");
  drop(b.cores, "destaque", "derivar");
  drop(b.cores, "realce", "manter");
  drop(b.fontes, "display", false);
  drop(b.fontes, "sistema", false);
  for (const k of ["cor", "branco", "preto"]) drop(b.logos, k, false);
  drop(b, "favicon", false);
  return b;
}
