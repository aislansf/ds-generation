// R1 do plano de estilos (docs/PLANO-ESTILOS.md): ganchos data-ds nos elementos montados à mão.
//
// Os componentes de src/components/ui/ já expõem data-ds (tokenizar.mjs), mas as páginas e os templates montam
// quase tudo com <button>, <input> e <div className="… bg-card …">. Este codemod acrescenta data-ds (e data-variant
// nos botões) a esses elementos, por padrão de classe, para a camada CSS do estilo alcançá-los.
//
// Determinístico e idempotente: só mexe em JSX de verdade (um lexer pula strings, template literals, comentários
// e regex, então os exemplos de código das páginas de documentação ficam como estão), nunca em elemento que já
// tem data-ds, e devolve o relatório do que casou e a lista de revisão do que ficou de fora.
// No estilo "corporativo" a camada CSS é vazia: os atributos não mudam nenhum pixel.

// ---------- Lexer de TSX ----------

const ID = /[A-Za-z0-9_$]/;
// Palavras depois das quais vem uma expressão (um "<" ali abre JSX, uma "/" abre regex)
const PALAVRAS_EXPRESSAO = new Set(["return", "typeof", "case", "default", "in", "of", "delete", "void", "new", "throw", "yield", "await", "else", "do"]);

/**
 * Percorre um arquivo TSX e devolve os elementos JSX de abertura:
 * { tag, inicio, fimNome, fimAbertura, linha, attrs: Map(nome → { tipo: "string"|"expr"|"bool", texto }) }.
 * "inicio" aponta para o "<", "fimNome" para o fim do nome da tag.
 */
export function elementosJsx(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  const linhaDe = (pos) => { let l = 1; for (let k = 0; k < pos; k++) if (src[k] === "\n") l++; return l; };

  // Último caractere significativo de código e se ele permite iniciar uma expressão
  function inicioDeExpressao(pos) {
    let k = pos - 1;
    while (k >= 0 && /\s/.test(src[k])) k--;
    if (k < 0) return true;
    const c = src[k];
    if (c === ">" && src[k - 1] === "=") return true; // =>
    if ("([{,;:=!&|?+-*%~^<".includes(c)) return true;
    if (c === "}") return true; // fim de bloco
    if (ID.test(c)) {
      let a = k;
      while (a > 0 && ID.test(src[a - 1])) a--;
      return PALAVRAS_EXPRESSAO.has(src.slice(a, k + 1));
    }
    return false;
  }

  function pularString(q) {
    i++;
    while (i < n && src[i] !== q) { if (src[i] === "\\") i++; i++; }
    i++;
  }
  function pularTemplate() {
    i++;
    while (i < n && src[i] !== "`") {
      if (src[i] === "\\") { i += 2; continue; }
      if (src[i] === "$" && src[i + 1] === "{") { i += 2; codigo("}"); i++; continue; }
      i++;
    }
    i++;
  }
  function pularRegex() {
    i++;
    let classe = false;
    while (i < n && src[i] !== "\n") {
      const c = src[i];
      if (c === "\\") { i += 2; continue; }
      if (c === "[") classe = true;
      else if (c === "]") classe = false;
      else if (c === "/" && !classe) break;
      i++;
    }
    i++;
    while (i < n && /[a-z]/.test(src[i])) i++;
  }

  // Código até o fechamento "fim" (")" "]" "}") no mesmo nível, ou até o fim do arquivo
  function codigo(fim) {
    const pilha = [];
    while (i < n) {
      const c = src[i];
      if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
      if (c === "/" && src[i + 1] === "*") { const e = src.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; continue; }
      if (c === '"' || c === "'") { pularString(c); continue; }
      if (c === "`") { pularTemplate(); continue; }
      if (c === "/" && inicioDeExpressao(i)) { pularRegex(); continue; }
      if (c === "<" && /[A-Za-z>]/.test(src[i + 1] ?? "") && inicioDeExpressao(i)) { jsx(); continue; }
      if (c === "(" || c === "[" || c === "{") { pilha.push(c); i++; continue; }
      if (c === ")" || c === "]" || c === "}") {
        if (!pilha.length) { if (c === fim) return; i++; continue; }
        pilha.pop();
        i++;
        continue;
      }
      i++;
    }
  }

  // Elemento JSX a partir do "<"; consome até o fim do elemento (com filhos)
  function jsx() {
    const inicio = i;
    i++;
    if (src[i] === ">") { i++; filhos(""); return; } // fragmento <>…</>
    let a = i;
    while (i < n && /[A-Za-z0-9_$.:-]/.test(src[i])) i++;
    const tag = src.slice(a, i);
    const fimNome = i;
    const attrs = new Map();
    // Atributos
    while (i < n) {
      while (i < n && /\s/.test(src[i])) i++;
      if (src[i] === "/" && src[i + 1] === ">") {
        i += 2;
        out.push({ tag, inicio, fimNome, fimAbertura: i, attrs });
        return;
      }
      if (src[i] === ">") { i++; break; }
      if (src[i] === "{") { i++; codigo("}"); i++; continue; } // {...spread}
      a = i;
      while (i < n && /[A-Za-z0-9_$:-]/.test(src[i])) i++;
      const nome = src.slice(a, i);
      if (!nome) { i++; continue; }
      while (i < n && /\s/.test(src[i])) i++;
      if (src[i] !== "=") { attrs.set(nome, { tipo: "bool", texto: "" }); continue; }
      i++;
      while (i < n && /\s/.test(src[i])) i++;
      if (src[i] === '"' || src[i] === "'") {
        const q = src[i];
        const e = src.indexOf(q, i + 1);
        attrs.set(nome, { tipo: "string", texto: src.slice(i + 1, e) });
        i = e + 1;
      } else if (src[i] === "{") {
        const ini = i + 1;
        i++;
        codigo("}");
        attrs.set(nome, { tipo: "expr", texto: src.slice(ini, i) });
        i++;
      }
    }
    out.push({ tag, inicio, fimNome, fimAbertura: i, attrs });
    filhos(tag);
  }

  // Filhos até </tag>: texto (sem strings: aspas no texto não abrem nada), {expressões} e elementos
  function filhos(tag) {
    while (i < n) {
      const c = src[i];
      if (c === "{") { i++; codigo("}"); i++; continue; }
      if (c === "<") {
        if (src[i + 1] === "/") {
          const e = src.indexOf(">", i);
          i = e < 0 ? n : e + 1;
          return;
        }
        jsx();
        continue;
      }
      i++;
    }
  }

  codigo(null);
  for (const el of out) el.linha = linhaDe(el.inicio);
  return out;
}

// ---------- Classes ----------

/**
 * Classes de um className: { fixas, condicionais, dinamico }.
 * "fixas" são as que sempre se aplicam (string literal, primeiro argumento string de cn()/clsx(), partes literais
 * de um template sem ${}); "condicionais" são as que aparecem em ternários, &&, ${} ou outros argumentos.
 */
export function classesDe(attr) {
  if (!attr) return { fixas: [], condicionais: [], dinamico: false };
  if (attr.tipo === "string") return { fixas: attr.texto.split(/\s+/).filter(Boolean), condicionais: [], dinamico: false };
  const t = attr.texto.trim();
  const literais = (s) => [...s.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)].map((m) => m[1] ?? m[2] ?? m[3]);
  const split = (s) => s.split(/\s+/).filter((c) => c && !c.includes("${"));
  // Template literal inteiro: o texto fora de ${} é fixo, o de dentro é condicional
  if (/^`[^`]*`$/.test(t)) {
    const corpo = t.slice(1, -1);
    const dentro = [...corpo.matchAll(/\$\{([^}]*)\}/g)].map((m) => m[1]).join(" ");
    return { fixas: split(corpo.replace(/\$\{[^}]*\}/g, " ")), condicionais: literais(dentro).flatMap(split), dinamico: true };
  }
  const m = /^(?:cn|clsx|classNames|twMerge)\(\s*(["'`])([^"'`]*)\1\s*([,)])/.exec(t);
  if (m) {
    const resto = t.slice(m[0].length);
    return { fixas: split(m[2]), condicionais: literais(resto).flatMap(split), dinamico: true };
  }
  return { fixas: [], condicionais: literais(t).flatMap(split), dinamico: true };
}

// ---------- Regras ----------

const BG_NEUTRO = /^bg-(background|card|transparent|white|muted)(\/\d+)?$/;
const BG_QUALQUER = /^bg-(?!opacity|clip|origin|cover|contain|center|no-repeat|fixed|gradient|none\b)/;
const BORDA = /^border(-(2|border|input|primary|foreground|muted|\[#[0-9A-Fa-f]{3,8}\]))?$/;
const SEM_BORDA = /^border-(0|none|transparent)$/;
const ARREDONDADO = /^rounded(-(sm|md|lg|xl|2xl|3xl|\[[^\]]+\]))?$/;
const PADDING_CARD = /^p-(3|4|5|6|7|8|10)$/;
// Classes que decidem a regra: se aparecem só numa parte condicional, o elemento vai para revisão
const DECISIVAS = [BG_QUALQUER, BORDA, /^hover:bg-/];

const tem = (lista, re) => lista.some((c) => re.test(c));

// Botão sobre superfície escura de marca (header azul dos templates): hover e texto em branco
const SOBRE_MARCA = /^(hover:bg-(white|primary-foreground)\/\d+|text-(white|primary-foreground)(\/\d+)?)$/;

/** Variante de um botão pelas classes, ou null se não casar. */
export function varianteBotao(cl) {
  if (tem(cl, /^bg-primary(\/(90|95|100))?$/) || tem(cl, /^bg-\[#[0-9A-Fa-f]{6}\]$/)) return "default";
  if (tem(cl, /^bg-secondary(\/(80|90))?$/)) return "secondary";
  if (tem(cl, /^bg-destructive$/)) return "destructive";
  if (tem(cl, /^bg-(success|warning|foreground)(\/90)?$/)) return "default";
  // Fundo tingido ou neutro sólido (chips, botão "suave"): o papel do secondary do shadcn
  if (tem(cl, /^bg-(primary|secondary|accent)\/(5|10|15|20)$/) || tem(cl, /^bg-(muted|accent)(\/\d+)?$/)) return "secondary";
  const bg = cl.filter((c) => BG_QUALQUER.test(c));
  const borda = tem(cl, BORDA) && !tem(cl, SEM_BORDA);
  if (borda && bg.every((c) => BG_NEUTRO.test(c))) return "outline";
  if (bg.length || borda) return null;
  if (tem(cl, /^(hover:)?underline$/)) return "link";
  if (tem(cl, /^hover:(bg|text)-/) && !tem(cl, SOBRE_MARCA)) return "ghost";
  return null;
}

/**
 * Botão de vitrine montado a partir de uma tabela: className={`… ${v.base}`} dentro de
 * {[ { name: "…", base: "bg-…" }, … ].map((v) => …)}. Lê as linhas da tabela (um objeto por linha, só strings)
 * e classifica cada uma. Devolve { variante } se todas concordam, { porValor, chave } se diferem, ou null se a
 * tabela não tiver esse formato ou alguma linha não casar.
 */
function tabelaDeVariantes(src, el, cls) {
  const t = el.attrs.get("className")?.texto.trim() ?? "";
  const refs = [...t.matchAll(/\$\{\s*([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*\}/g)];
  const interpolacoes = (t.match(/\$\{/g) ?? []).length;
  if (!refs.length || refs.length !== interpolacoes) return null;
  const nome = refs[0][1];
  if (refs.some((r) => r[1] !== nome)) return null;
  const antes = src.slice(0, el.inicio);
  const maps = [...antes.matchAll(new RegExp(`\\]\\s*\\.map\\(\\s*\\(?\\s*${nome}\\b`, "g"))];
  if (!maps.length) return null;
  // Linhas de objeto imediatamente acima do "].map(": { chave: "…", … },
  const linhas = antes.slice(0, maps[maps.length - 1].index).split("\n");
  const objetos = [];
  for (let k = linhas.length - 1; k >= 0; k--) {
    const l = linhas[k].trim();
    if (l === "" && !objetos.length) continue;
    if (/^\{.*\},?$/.test(l)) { objetos.unshift(l); continue; }
    if (/\[$/.test(l)) break;
    return null;
  }
  if (!objetos.length) return null;
  const props = [...new Set(refs.map((r) => r[2]))];
  const porValor = {};
  for (const o of objetos) {
    const valores = props.map((pr) => new RegExp(`\\b${pr}:\\s*"([^"]*)"`).exec(o)?.[1]);
    if (valores.some((v) => v === undefined)) return null;
    const v = varianteBotao([...cls.fixas, ...valores.join(" ").split(/\s+/).filter(Boolean)]);
    if (!v) return null;
    porValor[valores[0]] = v;
  }
  const distintas = [...new Set(Object.values(porValor))];
  return distintas.length === 1 ? { variante: distintas[0] } : { porValor, chave: `${nome}.${props[0]}` };
}

const ehCard = (cl) => tem(cl, /^bg-card$/) && tem(cl, BORDA) && !tem(cl, SEM_BORDA) && tem(cl, ARREDONDADO);

/**
 * Decide o gancho de um elemento: { ds, variante } ou { revisar: motivo } ou null (fora do escopo).
 * "src" (o arquivo inteiro) só é usado para ler tabelas de variantes.
 */
export function classificar(el, src = "") {
  if (el.attrs.has("data-ds")) return null;
  const tag = el.tag;
  const cls = classesDe(el.attrs.get("className"));
  const fixas = cls.fixas;
  if (tem(fixas, /^(sr-only|hidden)$/)) return null;

  if (tag === "input" || tag === "textarea" || tag === "select") {
    const tipo = el.attrs.get("type");
    if (tag === "input" && tipo?.tipo === "string" && /^(checkbox|radio|range|color|file|hidden|submit|button|reset|image)$/.test(tipo.texto)) return null;
    if (tag === "input" && tipo?.tipo === "expr") return { revisar: "type dinâmico" };
    // Campo interno de um contêiner com borda (busca, campo com ícone): o contêiner é que parece o campo
    if (tem(fixas, SEM_BORDA) || (tem(fixas, /^bg-transparent$/) && !tem(fixas, BORDA))) return { revisar: "campo sem borda própria (dentro de um contêiner)" };
    if (!fixas.length && !cls.condicionais.length) return { revisar: "sem className" };
    return { ds: tag === "input" ? "input" : tag === "textarea" ? "textarea" : "select-trigger" };
  }

  if (tag === "button") {
    if (ehCard(fixas) && tem(fixas, PADDING_CARD)) return { ds: "card" };
    const tabela = src ? tabelaDeVariantes(src, el, cls) : null;
    if (tabela) return { ds: "button", ...tabela };
    const v = varianteBotao(fixas);
    const ambigua = DECISIVAS.some((re) => tem(cls.condicionais, re));
    if (v && !ambigua) return { ds: "button", variante: v };
    if (!v && !ambigua && tem(fixas, SOBRE_MARCA)) return { revisar: "botão sobre superfície de marca" };
    if (!fixas.length && !cls.condicionais.length) return { revisar: "sem className" };
    return { revisar: ambigua ? "fundo ou borda condicional" : "classes sem padrão de botão" };
  }

  if (tag === "div" || tag === "a" || tag === "Link" || tag === "section" || tag === "article" || tag === "li") {
    if (ehCard(fixas)) return { ds: "card" };
    // bg-card só numa parte condicional: card que muda de aparência
    if (tem(fixas, /^bg-card$/) || tem(cls.condicionais, /^bg-card$/)) {
      if (tem(fixas, /^bg-card$/) && !tem(fixas, BORDA)) return null; // superfície sem borda (fundo de seção): não é card
      return { revisar: "bg-card com borda ou raio condicional" };
    }
    return null;
  }
  return null;
}

/**
 * Aplica os ganchos a um arquivo. Devolve { texto, casou: [{ linha, tag, ds, variante }], revisar: [{ linha, tag, motivo, classes }] }.
 */
export function ganchosNoArquivo(src) {
  const casou = [], revisar = [];
  const insercoes = [];
  for (const el of elementosJsx(src)) {
    const r = classificar(el, src);
    if (!r) continue;
    if (r.revisar) {
      const cls = classesDe(el.attrs.get("className"));
      revisar.push({ linha: el.linha, tag: el.tag, motivo: r.revisar, classes: [...cls.fixas, ...cls.condicionais].join(" ").slice(0, 140) });
      continue;
    }
    casou.push({ linha: el.linha, tag: el.tag, ds: r.ds, variante: r.variante ?? (r.porValor ? "tabela" : null) });
    // Tabela com variantes diferentes: a variante sai da própria linha da tabela, pelo valor da classe
    const lookup = r.porValor && Object.entries(r.porValor).map(([k, v]) => `${JSON.stringify(k)}: "${v}"`).join(", ");
    const variante = r.porValor ? ` data-variant={({ ${lookup} } as Record<string, string>)[${r.chave}]}` : r.variante ? ` data-variant="${r.variante}"` : "";
    insercoes.push([el.fimNome, ` data-ds="${r.ds}"${variante}`]);
  }
  let texto = src;
  for (const [pos, s] of insercoes.sort((a, b) => b[0] - a[0])) texto = texto.slice(0, pos) + s + texto.slice(pos);
  return { texto, casou, revisar };
}

/** Elementos que já têm data-ds (cobertura atual de um arquivo), por gancho. */
export function contarGanchos(src) {
  const c = {};
  for (const el of elementosJsx(src)) {
    const a = el.attrs.get("data-ds");
    if (a?.tipo === "string") c[a.texto] = (c[a.texto] ?? 0) + 1;
  }
  return c;
}
