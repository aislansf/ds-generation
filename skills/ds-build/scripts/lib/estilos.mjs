// Estilos visuais do DS (docs/PLANO-ESTILOS.md). A marca define cor, fonte, logo e voz;
// o estilo define forma, profundidade, peso e ritmo.
//
// Cada estilo é um preset versionado em assets/estilos/<id>/ (preset.json + estilo.css opcional).
// O gerador aplica o preset de forma determinística, depois da recoloração da marca e antes
// dos ajustes de contraste: os valores podem usar as cores finais da marca ({primaria.h}, {neon}…).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blockBodies } from "./contrast.mjs";
import { parseTriplet, hslToRgb, contrastRatio } from "./color.mjs";
import { gerarDecoracao, SLOTS, GERADORES, LIMITE_BYTES } from "./decoracao.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ESTILOS_DIR = path.resolve(HERE, "../../assets/estilos");
export const ESTILO_PADRAO = "corporativo";

const SCHEMA = JSON.parse(fs.readFileSync(path.join(ESTILOS_DIR, "_schema.json"), "utf8"));
const permitido = (() => {
  const def = SCHEMA.definitions.tokenPermitido;
  const nomes = new Set(def.anyOf.find((d) => d.enum).enum);
  const padroes = def.anyOf.filter((d) => d.pattern).map((d) => new RegExp(d.pattern));
  return (nome) => nomes.has(nome) || padroes.some((re) => re.test(nome));
})();

/** Ids dos presets disponíveis, em ordem de catálogo (campo "ordem"). */
export function listarEstilos() {
  return fs
    .readdirSync(ESTILOS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(ESTILOS_DIR, e.name, "preset.json")))
    .map((e) => carregarEstilo(e.name))
    .sort((a, b) => a.ordem - b.ordem)
    .map((p) => p.id);
}

/** Lê o preset e confere o formato. Lança erro com a lista de problemas. */
export function carregarEstilo(id) {
  const file = path.join(ESTILOS_DIR, id, "preset.json");
  if (!fs.existsSync(file)) throw new Error(`Estilo "${id}" não existe em assets/estilos/.`);
  const preset = JSON.parse(fs.readFileSync(file, "utf8"));
  const erros = validarPreset(preset, id);
  if (erros.length) throw new Error(`Preset ${id} inválido:\n  - ${erros.join("\n  - ")}`);
  return preset;
}

/** Validação equivalente ao _schema.json (a skill não leva dependências). */
export function validarPreset(p, id = p?.id) {
  const erros = [];
  for (const k of SCHEMA.required) if (!(k in p)) erros.push(`campo obrigatório ausente: ${k}`);
  if (p.id !== id) erros.push(`id "${p.id}" diferente da pasta "${id}"`);
  if (!SCHEMA.properties.grupo.enum.includes(p.grupo)) erros.push(`grupo inválido: ${p.grupo}`);
  if (!["light", "dark"].includes(p.tema_padrao)) erros.push(`tema_padrao inválido: ${p.tema_padrao}`);
  if (!SCHEMA.properties.layout.enum.includes(p.layout)) erros.push(`layout inválido: ${p.layout}`);
  for (const [sel, vars] of Object.entries(p.tokens ?? {})) {
    if (![":root", ".dark"].includes(sel)) { erros.push(`seletor não permitido em tokens: ${sel}`); continue; }
    for (const [nome, valor] of Object.entries(vars)) {
      if (!permitido(nome)) erros.push(`${sel} ${nome}: o estilo não pode alterar este token (marca e cores semânticas são da marca)`);
      // Chaves só nas expressões de cor ({primaria.h}, {neon}…); ponto e vírgula nunca
      if (typeof valor !== "string" || !valor.trim() || /[;{}]/.test(valor.replace(EXPRESSAO, ""))) erros.push(`${sel} ${nome}: valor inválido`);
    }
  }
  if (p.css && !fs.existsSync(path.join(ESTILOS_DIR, p.id, p.css))) erros.push(`css "${p.css}" não existe na pasta do preset`);
  if (p.decoracao) {
    const arq = path.join(ESTILOS_DIR, p.id, p.decoracao);
    if (!fs.existsSync(arq)) erros.push(`decoracao "${p.decoracao}" não existe na pasta do preset`);
    else {
      const cfg = JSON.parse(fs.readFileSync(arq, "utf8"));
      for (const [slot, o] of Object.entries(cfg.slots ?? {})) {
        if (!SLOTS[slot]) erros.push(`decoração: slot desconhecido "${slot}"`);
        if (!GERADORES[o?.gerador]) erros.push(`decoração: gerador desconhecido "${o?.gerador}" no slot ${slot}`);
      }
    }
  }
  if ((p.nivel === 3) !== !!p.decoracao) erros.push("nível 3 é o nível com decoração: só ele (e todo ele) declara \"decoracao\"");
  for (const par of p.contraste?.pares_extras ?? []) {
    if (!Array.isArray(par) || par.length !== 3 || typeof par[2] !== "number") erros.push(`par de contraste inválido: ${JSON.stringify(par)}`);
  }
  return erros;
}

/** Expressões de cor permitidas nos valores do preset e na camada CSS. */
const EXPRESSAO = /\{(primaria|secundaria|destaque|realce|neon)(?:\.(h|s|l))?\}/g;

const fmt = ({ h, s, l }) => `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;

/**
 * Cor "neon" do cyberpunk: a mais saturada entre primária, secundária e destaque,
 * levada a L 60% e S ≥ 80%. Devolve também se alguma era saturada o bastante (S ≥ 50%).
 */
export function corNeon(cores) {
  const cand = ["primaria", "secundaria", "destaque"].map((k) => cores[k]).filter(Boolean);
  const base = cand.reduce((a, b) => (b.s > a.s ? b : a));
  return { h: base.h, s: Math.max(80, base.s), l: 60, fraca: base.s < 50 };
}

/** Troca {primaria.h}, {secundaria}, {neon}… pelas cores finais da marca. var(--…) fica como está. */
export function resolverValor(valor, cores) {
  const neon = corNeon(cores);
  return valor.replace(EXPRESSAO, (m, nome, canal) => {
    const c = nome === "neon" ? neon : cores[nome];
    if (!c) throw new Error(`Cor ${nome} indisponível para resolver ${m}`);
    return canal ? String(Math.round(c[canal])) : fmt(c);
  });
}

/** Define --nome no primeiro bloco do seletor que o declara; se nenhum declara, acrescenta no primeiro bloco. */
export function definirVar(css, selector, nome, valor) {
  const blocos = blockBodies(css, selector);
  if (!blocos.length) throw new Error(`Bloco ${selector} não encontrado em src/index.css`);
  const re = new RegExp(`(^|[\\s;{])(${nome.replace(/[-]/g, "\\-")}\\s*:\\s*)([^;]+)(;)`);
  for (const b of blocos) {
    const semComentarios = b.body.replace(/\/\*[\s\S]*?\*\//g, (c) => " ".repeat(c.length));
    const m = re.exec(semComentarios);
    if (!m) continue;
    const ini = b.start + m.index + m[1].length + m[2].length;
    return css.slice(0, ini) + valor + css.slice(ini + m[3].length);
  }
  const b = blocos[0];
  const recuo = /\n([ \t]+)--/.exec(b.body)?.[1] ?? "    ";
  const fim = b.body.replace(/\s*$/, "").length + b.start;
  return css.slice(0, fim) + `\n${recuo}${nome}: ${valor};` + css.slice(fim);
}

export function lerVar(css, selector, nome) {
  for (const b of blockBodies(css, selector)) {
    const m = new RegExp(`(?:^|[\\s;{])${nome}\\s*:\\s*([^;]+);`).exec(b.body.replace(/\/\*[\s\S]*?\*\//g, ""));
    if (m) return m[1].trim();
  }
  return null;
}

/**
 * Campos de formulário (--control-*): no corporativo, as cores fixas do DS de referência, recoloridas pela marca.
 * Quando o estilo define --input, os campos passam a seguir os tokens semânticos do estilo (borda = --input,
 * hover e foco = --ring, placeholder = --muted-foreground, texto = --foreground), a menos que o preset defina
 * o token de campo ele mesmo.
 */
export const CAMPOS_DO_ESTILO = [
  ["--control-border", "hsl(var(--input))"],
  ["--control-border-hover", "hsl(var(--ring))"],
  ["--control-placeholder", "hsl(var(--muted-foreground))"],
  ["--control-placeholder-input", "hsl(var(--muted-foreground))"],
  ["--control-foreground", "hsl(var(--foreground))"],
];

/**
 * Aplica o estilo a um DS já recolorido.
 * @param {string} out    pasta do DS gerado
 * @param {object} preset preset carregado
 * @param {object} cores  { primaria, secundaria, destaque, realce } em { h, s, l } (cores finais)
 * @param {object} [opcoes] { semente }: semente da decoração (o slug da marca)
 * @returns relatório { tokens: { ":root": n, ".dark": n }, alterados: Set, camada, campos, decoracao, avisos }
 */
export function aplicarEstilo(out, preset, cores, { semente = "ds" } = {}) {
  const P = (rel) => path.join(out, rel);
  const avisos = [];
  const alterados = new Set();
  const contagem = { ":root": 0, ".dark": 0 };

  // 4a/4b. Tokens de pele em :root e .dark
  let css = fs.readFileSync(P("src/index.css"), "utf8");
  for (const sel of [":root", ".dark"]) {
    for (const [nome, bruto] of Object.entries(preset.tokens?.[sel] ?? {})) {
      let valor = resolverValor(bruto, cores);
      // As sombras de componente entram numa lista com o anel de foco (--tw-ring-shadow): "none" invalidaria a lista
      if (/^--shadow-(ui|hover)/.test(nome) && valor.trim() === "none") valor = "0 0 #0000";
      css = definirVar(css, sel, nome, valor);
      alterados.add(nome);
      contagem[sel]++;
    }
  }
  // Campos acompanham o --input do estilo (só em :root: as referências resolvem em cada tema)
  const definidos = { ...preset.tokens?.[":root"], ...preset.tokens?.[".dark"] };
  const campos = "--input" in definidos;
  if (campos) {
    for (const [nome, valor] of CAMPOS_DO_ESTILO) {
      if (nome in definidos) continue;
      css = definirVar(css, ":root", nome, valor);
      alterados.add(nome);
      contagem[":root"]++;
    }
  }
  // 4d. Decoração gerada (nível 3): SVGs em public/estilo/ e os tokens --deco-* apontando para eles
  let decoracao = null;
  if (preset.decoracao) {
    const cfg = JSON.parse(fs.readFileSync(path.join(ESTILOS_DIR, preset.id, preset.decoracao), "utf8"));
    const d = gerarDecoracao(cfg, cores, semente);
    for (const [rel, conteudo] of d.arquivos) {
      fs.mkdirSync(path.dirname(P(rel)), { recursive: true });
      fs.writeFileSync(P(rel), conteudo);
    }
    for (const [nome, valor] of Object.entries(d.tokens)) {
      css = definirVar(css, ":root", nome, valor);
      alterados.add(nome);
      contagem[":root"]++;
    }
    decoracao = { arquivos: [...d.arquivos.keys()], bytes: d.bytes };
    if (d.bytes > LIMITE_BYTES) avisos.push(`Decoração com ${Math.round(d.bytes / 1024)} KB, acima do limite de ${LIMITE_BYTES / 1024} KB.`);
  }
  // 4f. Sem degradê: o header degradê vira cor sólida (a cor inicial)
  if (preset.degrade === false) {
    const inicio = lerVar(css, ":root", "--brand-header-grad-start");
    if (inicio) css = definirVar(css, ":root", "--brand-header-grad-end", inicio);
  }
  fs.writeFileSync(P("src/index.css"), css);

  // 4c. Camada CSS do estilo
  // Estilos com decoração levam antes a camada comum de posicionamento (assets/estilos/_decoracao.css)
  let camada = null;
  if (preset.css || preset.decoracao) {
    const partes = [];
    if (preset.decoracao) partes.push(fs.readFileSync(path.join(ESTILOS_DIR, "_decoracao.css"), "utf8"));
    if (preset.css) partes.push(fs.readFileSync(path.join(ESTILOS_DIR, preset.id, preset.css), "utf8"));
    camada = partes.join("\n");
    fs.writeFileSync(P("src/styles/estilo.css"), camada.replace(EXPRESSAO, (m) => resolverValor(m, cores)));
  }

  // 4e. Configuração lida pelo app (tema padrão, layout) e pelo build-figma-tokens (manifesto)
  fs.writeFileSync(P("src/config/estilo.ts"), fs.readFileSync(P("src/config/estilo.ts"), "utf8")
    .replace(/id: "[^"]*"/, `id: "${preset.id}"`)
    .replace(/nome: "[^"]*"/, `nome: "${preset.nome}"`)
    .replace(/temaPadrao: "[^"]*"/, `temaPadrao: "${preset.tema_padrao}"`)
    .replace(/layout: "[^"]*"/, `layout: "${preset.layout}"`));
  if (fs.existsSync(P("index.html"))) {
    const html = fs.readFileSync(P("index.html"), "utf8");
    fs.writeFileSync(P("index.html"), html.replace(/var padrao = "(light|dark)";/, `var padrao = "${preset.tema_padrao}";`));
  }

  if (preset.id === "cyberpunk" && corNeon(cores).fraca) {
    avisos.push("Nenhuma cor da marca é saturada o bastante para o neon do cyberpunk (S < 50%): o neon foi saturado a 80% a partir da cor mais viva, e pode destoar da marca.");
  }
  return { tokens: contagem, alterados, camada: !!camada, campos, decoracao, avisos };
}

/** Superfícies que um ajuste de contraste leva junto quando o preset as declara na mesma família de cor. */
const SUPERFICIES = ["--background", "--card", "--popover", "--muted"];

/** Pares mínimos de todo estilo (seção 10.3 do plano): [frente, fundo, mínimo]. */
const PARES_ESTILO = [
  ["--foreground", "--background", 4.5],
  ["--card-foreground", "--card", 4.5],
  ["--foreground", "--muted", 4.5],
  ["--muted-foreground", "--background", 4.5],
  ["--muted-foreground", "--card", 4.5],
  ["--popover-foreground", "--popover", 4.5],
  ["--sidebar-foreground", "--sidebar-background", 4.5],
  ["--header-surface-foreground", "--header-surface", 4.5],
  ["--input", "--background", 3],
  ["--ring", "--background", 3],
];

/**
 * Mínimos de contraste do estilo. Quando um par falha e um dos tokens foi definido pelo estilo,
 * ajusta só esse token (luminosidade, afastando do outro) e registra; se não conseguir, só avisa.
 * Pares que o estilo não tocou ficam com a regra da marca ("só corrige o que piorou").
 */
export function contrasteDoEstilo(css, preset, alterados, cores, { cssBase = null } = {}) {
  const ajustes = [], avisos = [];
  const pares = [...PARES_ESTILO, ...(preset.contraste?.pares_extras ?? [])];
  // Um token é do estilo naquele tema se o preset o define no bloco, ou em :root sem o template redefinir no .dark
  // (um --background só de :root não muda o fundo do dark, que o template declara).
  const doEstilo = (sel, nome) => {
    if (!alterados.has(nome)) return false;
    if (!preset.tokens?.[":root"]?.[nome] && !preset.tokens?.[".dark"]?.[nome]) return true;
    if (preset.tokens?.[sel]?.[nome] !== undefined) return true;
    return sel === ".dark" && preset.tokens?.[":root"]?.[nome] !== undefined && lerVar(css, ".dark", nome) === null;
  };
  for (const sel of [":root", ".dark"]) {
    const valor = (n) => lerVar(css, sel, n) ?? lerVar(css, ":root", n);
    for (const [fg, bg, min] of pares) {
      if (!doEstilo(sel, fg) && !doEstilo(sel, bg)) continue;
      const a = parseTriplet(valor(fg) ?? ""), b = parseTriplet(valor(bg) ?? "");
      if (!a || !b) continue;
      const r = contrastRatio(hslToRgb(a), hslToRgb(b));
      if (r >= min) continue;
      // O estilo só trocou a superfície e o par já ficava abaixo do mínimo no template (ex.: borda de campo clara
      // sobre o branco): é decisão do template, e mover o fundo do estilo dezenas de pontos não é a correção certa
      if (cssBase && !doEstilo(sel, fg)) {
        const vb = (n) => lerVar(cssBase, sel, n) ?? lerVar(cssBase, ":root", n);
        const ab = parseTriplet(vb(fg) ?? ""), bb = parseTriplet(vb(bg) ?? "");
        if (ab && bb && contrastRatio(hslToRgb(ab), hslToRgb(bb)) < min) continue;
      }
      // Ajusta o token do estilo; se os dois são do estilo, o de frente (texto, borda, foco)
      const alvo = doEstilo(sel, fg) ? fg : bg;
      const fixo = alvo === fg ? b : a;
      const mover = alvo === fg ? { ...a } : { ...b };
      const fixoL = (() => { const [r1, g1, b1] = Object.values(hslToRgb(fixo)); return (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255; })();
      const passo = fixoL > 0.5 ? -1 : 1;
      let ok = false;
      for (let i = 0; i < 100 && mover.l >= 0 && mover.l <= 100; i++) {
        if (contrastRatio(hslToRgb(mover), hslToRgb(fixo)) >= min) { ok = true; break; }
        mover.l += passo;
      }
      const atual = valor(alvo);
      const alfa = /\/\s*[\d.]+%?\s*$/.exec(atual)?.[0] ?? "";
      if (ok) {
        const novo = `${Math.round(mover.h)} ${Math.round(mover.s)}% ${Math.round(mover.l)}%${alfa ? ` ${alfa.trim()}` : ""}`;
        css = definirVar(css, sel, alvo, novo);
        // Superfícies da mesma família (mesma matiz e saturação no preset) andam juntas: o neumorfismo declara
        // fundo, card, popover e muted na mesma cor (ou um passo acima), e o relevo some se só uma delas mudar.
        const junto = [];
        const original = parseTriplet(atual);
        if (SUPERFICIES.includes(alvo) && original) {
          const delta = Math.round(mover.l) - original.l;
          for (const outro of SUPERFICIES) {
            if (outro === alvo || !(outro in (preset.tokens?.[sel] ?? {}))) continue;
            const t = parseTriplet(lerVar(css, sel, outro) ?? "");
            if (!t || t.h !== original.h || t.s !== original.s) continue;
            css = definirVar(css, sel, outro, `${t.h} ${t.s}% ${Math.max(0, Math.min(100, t.l + delta))}%`);
            junto.push(outro);
          }
        }
        ajustes.push(`${sel} ${alvo} → ${novo} (${fg} sobre ${bg} tinha ${r.toFixed(2)}:1, mínimo ${min}:1)${junto.length ? `; junto: ${junto.join(", ")}` : ""}`);
      } else {
        avisos.push(`${sel} ${fg} sobre ${bg}: ${r.toFixed(2)}:1, abaixo de ${min}:1, e o ajuste do estilo não resolveu.`);
      }
    }
  }
  // Vidro: o texto do card é lido sobre o card translúcido composto com o fundo. Pior caso: o fundo coberto
  // pela cor mais forte da malha (--surface-pattern: cores da marca com até 40% de opacidade no light e
  // primária e secundária com até 22% no dark).
  if (alterados.has("--card-alpha")) {
    const MALHA = { ":root": { cores: ["primaria", "secundaria", "destaque"], opacidade: 0.4 }, ".dark": { cores: ["primaria", "secundaria"], opacidade: 0.22 } };
    const mistura = (a, b, t) => ({ r: a.r * t + b.r * (1 - t), g: a.g * t + b.g * (1 - t), b: a.b * t + b.b * (1 - t) });
    for (const sel of [":root", ".dark"]) {
      const valor = (n) => lerVar(css, sel, n) ?? lerVar(css, ":root", n);
      const rgb = (n) => { const t = parseTriplet(valor(n) ?? ""); return t ? hslToRgb(t) : null; };
      const fundo = rgb("--background"), card = rgb("--card");
      if (!fundo || !card) continue;
      const fundos = [fundo, ...MALHA[sel].cores.map((k) => cores[k]).filter(Boolean).map((c) => mistura(hslToRgb(c), fundo, MALHA[sel].opacidade))];
      const textos = ["--card-foreground", "--muted-foreground"].map(rgb).filter(Boolean);
      const pior = (alfa) => Math.min(...fundos.flatMap((f) => textos.map((t) => contrastRatio(t, mistura(card, f, alfa)))));
      let alfa = parseFloat(valor("--card-alpha"));
      const inicial = alfa;
      while (pior(alfa) < 4.5 && alfa < 0.95) alfa = Math.round((alfa + 0.05) * 100) / 100;
      if (alfa !== inicial) {
        css = definirVar(css, sel, "--card-alpha", String(alfa));
        ajustes.push(`${sel} --card-alpha → ${alfa} (texto sobre o vidro ficava abaixo de 4.5:1 no ponto mais forte do fundo)`);
      }
      if (pior(alfa) < 4.5) avisos.push(`${sel} texto sobre o vidro: ${pior(alfa).toFixed(2)}:1 no pior ponto do fundo, mesmo com --card-alpha ${alfa}.`);
    }
  }
  return { css, ajustes, avisos };
}
