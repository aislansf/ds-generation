#!/usr/bin/env node
/**
 * catalogo-estilos.mjs — página única que mostra a mesma tela em cada estilo visual, com as cores da marca.
 *
 * Uso:
 *   node scripts/catalogo-estilos.mjs [--brief <briefing.json>] --out <catalogo-estilos.html> [--estilos a,b,c] [--manter]
 *
 *   --brief    briefing da marca, mesmo incompleto (a pergunta 13 vem antes das cores). Só usa o que estiver válido:
 *              as cores em HEX, o nome e a fonte primária. O resto vem da marca de exemplo (assets/examples/exemplo-verde.json).
 *   --out      arquivo HTML de saída (autocontido: sem rede, exceto a fonte do Google, se a marca tiver uma)
 *   --estilos  só estes ids (padrão: todos, em ordem de catálogo)
 *   --manter   não apaga os DS temporários (para inspecionar)
 *
 * Como funciona: para cada estilo roda o próprio gerador (generate-ds.mjs --estilo <id>) numa pasta temporária e
 * lê dali os tokens já resolvidos (:root e .dark de src/index.css), a camada CSS (src/styles/estilo.css) e a
 * decoração (public/estilo/*.svg). Cada estilo vira um iframe com a tela de exemplo (header, destaque, card de saldo,
 * botões, campo, badges e tabela) montada com os mesmos ganchos data-ds do DS, então a camada CSS age como no DS real.
 * Nada é compilado: não precisa de node_modules.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { blockBodies } from "./lib/contrast.mjs";
import { listarEstilos, carregarEstilo, ESTILO_PADRAO } from "./lib/estilos.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.resolve(HERE, "..");

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args[a.slice(2)] = next && !next.startsWith("--") ? (i++, next) : true;
}
if (!args.out || args.out === true) {
  console.error("Uso: node catalogo-estilos.mjs [--brief <briefing.json>] --out <catalogo-estilos.html> [--estilos a,b] [--manter]");
  process.exit(1);
}

const HEX = /^#[0-9a-fA-F]{6}$/;
const valido = (v) => typeof v === "string" && v.trim() && !/PREENCHER/i.test(v);

// ---------- Marca: o que o briefing já respondeu, sobre a marca de exemplo ----------
const exemplo = JSON.parse(fs.readFileSync(path.join(SKILL, "assets/examples/exemplo-verde.json"), "utf8"));
let usuario = {};
if (args.brief && args.brief !== true) {
  const arq = path.resolve(args.brief);
  if (!fs.existsSync(arq)) { console.error(`Briefing não encontrado: ${arq}`); process.exit(1); }
  usuario = JSON.parse(fs.readFileSync(arq, "utf8"));
}
const marca = structuredClone(exemplo);
const notas = [];
const cores = usuario.cores ?? {};
const coresInformadas = [];
for (const k of ["primaria", "secundaria", "destaque", "realce"]) {
  if (typeof cores[k] === "string" && HEX.test(cores[k])) { marca.cores[k] = cores[k]; coresInformadas.push(k); }
}
if (!coresInformadas.includes("primaria")) notas.push("O briefing ainda não tem a cor primária: a página usa as cores da marca de exemplo (verde).");
else if (!coresInformadas.includes("secundaria")) notas.push("Sem cor secundária no briefing: ela é derivada da primária, como na geração.");
if (valido(usuario.nome)) { marca.nome = usuario.nome; marca.nome_curto = valido(usuario.nome_curto) ? usuario.nome_curto : usuario.nome; }
const fontePrimaria = valido(usuario.fontes?.primaria?.nome) ? usuario.fontes.primaria : null;
if (fontePrimaria) marca.fontes.primaria = { nome: fontePrimaria.nome, google: fontePrimaria.google !== false };
delete marca.estilo;
// Com a primária do briefing, o que faltar é derivado dela, como na geração ("derivar" e "manter" são as respostas válidas)
if (coresInformadas.includes("primaria")) {
  for (const k of ["secundaria", "destaque"]) if (!coresInformadas.includes(k)) marca.cores[k] = "derivar";
  if (!coresInformadas.includes("realce")) marca.cores.realce = "manter";
}

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "ds-catalogo-"));
const BRIEF_TMP = path.join(TMP, "briefing.json");
fs.writeFileSync(BRIEF_TMP, JSON.stringify(marca, null, 2));

const todos = listarEstilos();
const ids = args.estilos && args.estilos !== true ? String(args.estilos).split(",").map((s) => s.trim()) : todos;
const invalidos = ids.filter((id) => !todos.includes(id));
if (invalidos.length) { console.error(`Estilo(s) inexistente(s): ${invalidos.join(", ")}. Disponíveis: ${todos.join(", ")}`); process.exit(1); }

// ---------- Gera o DS de cada estilo (4 de cada vez) ----------
function gerar(id) {
  return new Promise((resolve) => {
    const dir = path.join(TMP, id);
    const p = spawn(process.execPath, [path.join(HERE, "generate-ds.mjs"), "--brief", BRIEF_TMP, "--out", dir, "--estilo", id, "--force"], { stdio: ["ignore", "pipe", "pipe"] });
    let saida = "";
    p.stdout.on("data", (d) => (saida += d));
    p.stderr.on("data", (d) => (saida += d));
    p.on("close", (code) => resolve({ id, dir, ok: code === 0, saida }));
  });
}
const gerados = new Map();
{
  const fila = [...ids];
  await Promise.all(Array.from({ length: Math.min(4, fila.length) }, async () => {
    for (let id; (id = fila.shift()); ) {
      const r = await gerar(id);
      gerados.set(id, r);
      process.stdout.write(`${r.ok ? "." : "x"}`);
    }
  }));
  process.stdout.write("\n");
}
const falharam = ids.filter((id) => !gerados.get(id).ok);
for (const id of falharam) console.error(`Falhou ao gerar o estilo ${id}:\n${gerados.get(id).saida.split("\n").slice(0, 6).join("\n")}`);

// ---------- Lê o que o gerador resolveu ----------
const MIME = { ".svg": "image/svg+xml", ".png": "image/png" };
const lerSeExiste = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
/** Troca url("/estilo/x.svg") por data URI: a página é um arquivo só, e o iframe não tem servidor. */
function embutirDecoracao(css, dir) {
  return css.replace(/url\((['"]?)\/estilo\/([^'")]+)\1\)/g, (m, _q, rel) => {
    const arq = path.join(dir, "public/estilo", rel);
    if (!fs.existsSync(arq)) return m;
    return `url("data:${MIME[path.extname(arq)] ?? "application/octet-stream"};base64,${fs.readFileSync(arq).toString("base64")}")`;
  });
}
const bloco = (css, sel) => blockBodies(css, sel).map((b) => b.body).join("\n");

// ---------- Tela de exemplo ----------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fonte = fontePrimaria?.nome && fontePrimaria.google !== false ? fontePrimaria.nome : null;
const FAMILIA = fonte ? `'${fonte.replace(/'/g, "")}', system-ui, sans-serif` : "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONTE_LINK = fonte ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonte).replace(/%20/g, "+")}:wght@400;500;600;700;800&display=swap">` : "";

// Componentes mínimos, escritos com os mesmos tokens que o DS usa nas classes dos componentes de src/components/ui/
const BASE_CSS = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font:400 14px/1.5 ${FAMILIA};background-color:hsl(var(--background));color:hsl(var(--foreground))}
h1,h2,h3,p{margin:0}
h1,h2,h3{font-weight:var(--font-bold,700);text-transform:var(--heading-transform,none)}
svg.lucide[stroke-width="2"]{stroke-width:var(--icon-stroke,2)}
.hd{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;color:#fff;background-image:linear-gradient(90deg,var(--brand-header-grad-start),var(--brand-header-grad-end))}
.hd strong{font-weight:var(--font-bold,700)}
.hd span{font-size:12px;opacity:.85}
.tela{padding:16px;display:grid;gap:14px}
.hero{border-radius:var(--radius-xl,.75rem);background-color:hsl(var(--primary));color:hsl(var(--primary-foreground));padding:16px 18px;min-height:96px}
.hero h1{font-size:20px;line-height:1.2}
.hero p{margin-top:4px;font-size:13px;opacity:.92;max-width:62%}
.card{background-color:hsl(var(--card));color:hsl(var(--card-foreground));border:var(--card-border-width) solid hsl(var(--border));border-radius:var(--radius-card);box-shadow:var(--shadow-ui-sm);padding:16px}
.card .rot{color:hsl(var(--muted-foreground));font-size:12px}
.saldo{font-size:26px;line-height:1.2;font-weight:var(--font-bold,700);margin:2px 0 8px}
.linha{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px}
.badge{display:inline-flex;align-items:center;border-radius:9999px;padding:2px 10px;font-size:12px;font-weight:var(--font-semibold,600);background-color:hsl(var(--primary));color:hsl(var(--primary-foreground))}
.badge.sec{background-color:hsl(var(--secondary));color:hsl(var(--secondary-foreground))}
.btn{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;font:inherit;font-weight:var(--font-medium,500);border:0 solid transparent;border-radius:var(--radius-control);cursor:pointer;transition:background-color var(--duration-normal,150ms)}
.btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}
.btn.pri{background-color:hsl(var(--primary));color:hsl(var(--primary-foreground))}
.btn.pri:hover{background-color:hsl(var(--primary)/.9)}
.btn.out{border:var(--control-border-width) solid hsl(var(--input));background-color:hsl(var(--background));color:hsl(var(--foreground))}
.btn.out:hover{background-color:hsl(var(--accent));color:hsl(var(--accent-foreground))}
.btn.gho{background:transparent;color:hsl(var(--foreground))}
.btn.gho:hover{background-color:hsl(var(--accent));color:hsl(var(--accent-foreground))}
label{display:block;font-size:13px;font-weight:var(--font-medium,500);margin-bottom:6px}
.campo{display:block;width:100%;height:40px;padding:0 12px;font:inherit;font-size:14px;background-color:hsl(var(--background));color:var(--control-foreground);border:var(--control-border-width) solid var(--control-border);border-radius:var(--radius-control)}
.campo::placeholder{color:var(--control-placeholder-input)}
.campo:hover{border-color:var(--control-border-hover)}
.campo:focus-visible{outline:2px solid hsl(var(--ring));outline-offset:2px}
.btn:focus-visible{outline:2px solid hsl(var(--ring));outline-offset:2px}
table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px}
th{text-align:left;font-weight:var(--font-medium,500);color:hsl(var(--muted-foreground));padding:6px 8px;border-bottom:1px solid hsl(var(--border))}
td{padding:7px 8px;border-bottom:1px solid hsl(var(--border))}
td:last-child,th:last-child{text-align:right}
.bento .tela{grid-template-columns:repeat(2,1fr)}
.bento .hero,.bento .card.saldo-card{grid-column:span 2}
`;

function tela(nome, nomeCurto, bento) {
  const icone = '<svg class="lucide" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  return `<header class="hd" data-ds="header" data-surface="marca" data-marca="header"><strong>${esc(nomeCurto)}</strong><span>Design System</span></header>
<main class="tela">
  <section class="hero${bento ? " bento-hero" : ""}" data-surface="marca" data-marca="hero"><h1>${esc(nome)}</h1><p>Padrões de interface para os serviços digitais.</p></section>
  <div class="card saldo-card" data-ds="card"><p class="rot">Saldo disponível</p><p class="saldo">R$ 12.480,50</p>
    <span class="badge" data-ds="badge">+4,2% no mês</span> <span class="badge sec" data-ds="badge">Conta ativa</span>
    <div class="linha"><button class="btn pri" data-ds="button" data-variant="default" type="button">Transferir ${icone}</button><button class="btn out" data-ds="button" data-variant="outline" type="button">Extrato</button><button class="btn gho" data-ds="button" data-variant="ghost" type="button">Ajuda</button></div>
  </div>
  <div class="card" data-ds="card"><label for="chave">Chave de destino</label><input id="chave" class="campo" data-ds="input" placeholder="CPF, e-mail ou celular" type="text">
    <table data-ds="table"><thead><tr><th>Data</th><th>Descrição</th><th>Valor</th></tr></thead><tbody>
      <tr><td>12/03</td><td>Mensalidade</td><td>R$ 320,00</td></tr><tr><td>10/03</td><td>Repasse</td><td>R$ 1.890,00</td></tr><tr><td>07/03</td><td>Tarifa</td><td>R$ 14,90</td></tr></tbody></table>
  </div>
</main>`;
}

function documento({ preset, dir }) {
  const index = fs.readFileSync(path.join(dir, "src/index.css"), "utf8");
  const camada = embutirDecoracao(lerSeExiste(path.join(dir, "src/styles/estilo.css")), dir);
  const raiz = embutirDecoracao(bloco(index, ":root"), dir);
  const escuro = bloco(index, ".dark");
  const bento = preset.layout === "bento";
  return `<!doctype html><html lang="pt-BR" class="${preset.tema_padrao === "dark" ? "dark" : ""}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${FONTE_LINK}<style>
:root{${raiz}}
.dark{${escuro}}
${BASE_CSS}
${camada}
</style></head><body class="${bento ? "bento" : ""}">${tela(marca.nome, marca.nome_curto, bento)}</body></html>`;
}

// ---------- Página ----------
const GRUPOS = { limpos: "Limpos e funcionais", ousados: "Ousados", epocas: "Inspirados em épocas", digitais: "Digitais e de interface", organicos: "Orgânicos e artesanais" };
const NIVEIS = { 0: "padrão", 1: "só tokens", 2: "tokens e camada CSS", 3: "com decoração", 4: "com layout" };
const presets = ids.filter((id) => gerados.get(id).ok).map((id) => ({ preset: carregarEstilo(id), dir: gerados.get(id).dir }));

const secoes = Object.entries(GRUPOS).map(([grupo, titulo]) => {
  const itens = presets.filter(({ preset }) => preset.grupo === grupo);
  if (!itens.length) return "";
  const cards = itens.map(({ preset, dir }) => {
    const resumo = JSON.parse(lerSeExiste(path.join(dir, "public/design-system/estilo.json")) || "{}");
    const avisos = (resumo.avisos ?? []).length;
    const ajustes = (resumo.ajustes_contraste ?? []).length;
    return `<article class="estilo" id="${esc(preset.id)}">
  <header><h3>${esc(preset.nome)}${preset.id === ESTILO_PADRAO ? ' <span class="tag padrao">padrão</span>' : ""}</h3><code>${esc(preset.id)}</code></header>
  <p class="desc">${esc(preset.descricao)}</p>
  <p class="meta"><span class="tag">${esc(NIVEIS[preset.nivel] ?? "")}</span> <span class="tag">abre em ${preset.tema_padrao === "dark" ? "escuro" : "claro"}</span>${ajustes ? ` <span class="tag" title="O gerador ajustou ${ajustes} token(s) do estilo para manter o contraste">${ajustes} ajuste(s) de contraste</span>` : ""}${avisos ? ` <span class="tag aviso" title="${esc((resumo.avisos ?? []).join(" | "))}">${avisos} aviso(s)</span>` : ""}</p>
  <iframe title="${esc(preset.nome)}" data-tema="${preset.tema_padrao}" sandbox="allow-same-origin" loading="lazy" srcdoc="${esc(documento({ preset, dir }))}"></iframe>
</article>`;
  }).join("\n");
  return `<section><h2>${titulo}</h2><div class="grade">${cards}</div></section>`;
}).join("\n");

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Estilos visuais — ${esc(marca.nome)}</title>
<style>
:root{color-scheme:light dark;--bg:#f4f4f5;--fg:#18181b;--mut:#52525b;--card:#fff;--bd:#d4d4d8}
@media (prefers-color-scheme:dark){:root{--bg:#18181b;--fg:#f4f4f5;--mut:#a1a1aa;--card:#27272a;--bd:#3f3f46}}
*{box-sizing:border-box}
body{margin:0;font:15px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;background:var(--bg);color:var(--fg)}
.topo{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--bd);padding:12px 24px;display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center}
.topo h1{font-size:18px;margin:0}
.topo p{margin:0;color:var(--mut);font-size:13px}
.tema{margin-left:auto;display:flex;gap:6px}
.tema button{font:inherit;font-size:13px;padding:5px 12px;border:1px solid var(--bd);border-radius:6px;background:var(--card);color:var(--fg);cursor:pointer}
.tema button[aria-pressed="true"]{background:var(--fg);color:var(--bg)}
main{padding:8px 24px 48px;max-width:1500px;margin:0 auto}
.nota{margin:16px 0;padding:10px 14px;border:1px solid var(--bd);border-radius:8px;background:var(--card);color:var(--mut);font-size:13px}
section h2{margin:32px 0 12px;font-size:16px}
.grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px}
.estilo{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px}
.estilo header{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.estilo h3{margin:0;font-size:15px}
.estilo code{font-size:12px;color:var(--mut)}
.desc{margin:0;font-size:13px;color:var(--mut)}
.meta{margin:0;display:flex;flex-wrap:wrap;gap:4px}
.tag{font-size:11px;padding:1px 8px;border:1px solid var(--bd);border-radius:9999px;color:var(--mut)}
.tag.padrao{color:var(--fg);border-color:var(--fg)}
.tag.aviso{border-color:#b45309;color:#b45309}
iframe{width:100%;height:640px;border:1px solid var(--bd);border-radius:8px;background:#fff;margin-top:6px}
.como{margin-top:40px;font-size:13px;color:var(--mut)}
</style></head><body>
<div class="topo"><div><h1>Estilos visuais — ${esc(marca.nome)}</h1><p>A mesma tela em cada estilo, com as cores da marca. Responda com o nome ou o id do estilo.</p></div>
<div class="tema" role="group" aria-label="Tema das telas"><button type="button" data-tema="padrao" aria-pressed="true">Tema de cada estilo</button><button type="button" data-tema="light" aria-pressed="false">Claro</button><button type="button" data-tema="dark" aria-pressed="false">Escuro</button></div></div>
<main>
${notas.map((n) => `<p class="nota">${esc(n)}</p>`).join("\n")}
${falharam.length ? `<p class="nota">Não foi possível gerar: ${esc(falharam.join(", "))}.</p>` : ""}
${secoes}
<p class="como">Cada quadro usa os tokens e a camada CSS que o gerador aplica ao DS (<code>generate-ds.mjs --estilo &lt;id&gt;</code>). O DS gerado leva só o estilo escolhido; “corporativo” é o estilo atual e o padrão quando nada é informado.</p>
</main>
<script>
(function () {
  var botoes = document.querySelectorAll(".tema button");
  function aplicar(modo) {
    botoes.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.tema === modo)); });
    document.querySelectorAll("iframe").forEach(function (f) {
      var tema = modo === "padrao" ? f.dataset.tema : modo;
      var raiz = f.contentDocument && f.contentDocument.documentElement;
      if (raiz) raiz.classList.toggle("dark", tema === "dark");
    });
  }
  function ajustarAltura(f) {
    var d = f.contentDocument;
    if (!d || !d.body) return;
    f.style.height = "100px"; // scrollHeight nunca é menor que a altura do iframe: encolhe antes de medir
    f.style.height = Math.ceil(d.documentElement.scrollHeight) + 2 + "px";
  }
  botoes.forEach(function (b) { b.addEventListener("click", function () { aplicar(b.dataset.tema); }); });
  document.querySelectorAll("iframe").forEach(function (f) {
    f.addEventListener("load", function () {
      var p = document.querySelector('.tema button[aria-pressed="true"]');
      if (p && p.dataset.tema !== "padrao") aplicar(p.dataset.tema);
      ajustarAltura(f);
    });
  });
})();
</script>
</body></html>
`;

const saida = path.resolve(args.out);
fs.mkdirSync(path.dirname(saida), { recursive: true });
fs.writeFileSync(saida, html);
if (!args.manter) fs.rmSync(TMP, { recursive: true, force: true });
else console.log(`DS temporários em ${TMP}`);

// Lista agrupada para o agente mostrar junto da página
console.log(`Catálogo: ${saida} (${presets.length} estilo(s), ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
for (const [grupo, titulo] of Object.entries(GRUPOS)) {
  const itens = presets.filter(({ preset }) => preset.grupo === grupo);
  if (itens.length) console.log(`  ${titulo}: ${itens.map(({ preset }) => `${preset.nome} (${preset.id})`).join(", ")}`);
}
for (const n of notas) console.log(`  nota: ${n}`);
process.exit(falharam.length ? 1 : 0);
