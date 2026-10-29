#!/usr/bin/env node
/**
 * capturar-miniaturas.mjs — recaptura, no DS gerado, as miniaturas da página Templates.
 *
 * Uso:
 *   node scripts/capturar-miniaturas.mjs --ds <pasta do DS gerado> [--node-modules <pasta>] [--chromium <exe>]
 *                                        [--tema padrao|light|dark] [--so a,b] [--sem-relatorio]
 *
 *   --ds             pasta do DS gerado por generate-ds.mjs (precisa de node_modules com vite e playwright, no próprio DS
 *                    ou em --node-modules)
 *   --node-modules   node_modules com vite e playwright, se o DS ainda não tiver o seu
 *   --chromium       Chromium já baixado, quando o da versão instalada do Playwright não estiver disponível
 *   --tema           tema das capturas: o padrão do estilo (padrao, o valor omitido), claro (light) ou escuro (dark)
 *   --so             só estas miniaturas (nomes dos arquivos, sem .jpg, ex.: thumb-tela-listagem)
 *   --sem-relatorio  não mexe no GERACAO.md
 *
 * O template traz as miniaturas capturadas com a marca neutra e o estilo padrão. Num DS com marca e estilo próprios elas
 * ficam desatualizadas: este script sobe o Vite no DS, abre cada template e grava as imagens em src/assets/, no mesmo
 * nome e tamanho. Depois tira a pendência "miniaturas da página Templates" da seção do estilo no GERACAO.md.
 * É a etapa de revisão visual: rode com o DS já com as cores, fontes e textos finais.
 */
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args[a.slice(2)] = next && !next.startsWith("--") ? (i++, next) : true;
}
if (!args.ds || args.ds === true) {
  console.error("Uso: node capturar-miniaturas.mjs --ds <pasta do DS> [--node-modules <pasta>] [--chromium <exe>] [--tema padrao|light|dark] [--so a,b]");
  process.exit(1);
}
const DS = path.resolve(args.ds);
if (!fs.existsSync(path.join(DS, "package.json")) || !fs.existsSync(path.join(DS, "src/assets"))) {
  console.error(`${DS} não parece um DS gerado (sem package.json ou src/assets).`);
  process.exit(1);
}
const NM = path.resolve(typeof args["node-modules"] === "string" ? args["node-modules"] : path.join(DS, "node_modules"));
if (!fs.existsSync(path.join(NM, "vite")) || !fs.existsSync(path.join(NM, "playwright"))) {
  console.error(`Não achei vite e playwright em ${NM}. Rode npm install no DS ou passe --node-modules.`);
  process.exit(1);
}
const { chromium } = createRequire(path.join(NM, "noop.js"))("playwright");

/** [arquivo, rota, altura da captura]: as mesmas oito telas, tamanhos e nomes que a página Templates usa. */
const MINIATURAS = [
  ["thumb-tela-listagem", "/templates/tela-listagem", 720],
  ["thumb-tela-formulario", "/templates/tela-formulario", 800],
  ["thumb-pagina-autenticacao", "/templates/pagina-autenticacao", 800],
  ["thumb-radar-estrategico", "/templates/radar-estrategico", 800],
  ["thumb-pagina-erro", "/templates/pagina-erro", 800],
  ["thumb-modal-acesso", "/templates/modal-acesso", 800],
  ["thumb-dashboard-analitico", "/templates/dashboard-analitico", 800],
  ["thumb-tela-bi", "/templates/tela-bi", 800],
];
const so = typeof args.so === "string" ? args.so.split(",").map((s) => s.trim().replace(/\.jpg$/, "")) : null;
const alvo = so ? MINIATURAS.filter(([nome]) => so.includes(nome)) : MINIATURAS;
if (so && alvo.length !== so.length) {
  console.error(`Miniatura(s) desconhecida(s): ${so.filter((n) => !MINIATURAS.some(([m]) => m === n)).join(", ")}. Disponíveis: ${MINIATURAS.map(([n]) => n).join(", ")}`);
  process.exit(1);
}

// Tema: o padrão do estilo (src/config/estilo.ts) a menos que --tema diga outro
const estiloTs = fs.readFileSync(path.join(DS, "src/config/estilo.ts"), "utf8");
const estiloId = /id: "([^"]+)"/.exec(estiloTs)?.[1] ?? "corporativo";
const temaDoEstilo = /temaPadrao: "(light|dark)"/.exec(estiloTs)?.[1] ?? "light";
const tema = args.tema === "light" || args.tema === "dark" ? args.tema : temaDoEstilo;

const portaLivre = () => new Promise((resolve, reject) => {
  const s = net.createServer();
  s.once("error", reject);
  s.listen(0, "127.0.0.1", () => { const { port } = s.address(); s.close(() => resolve(port)); });
});
const PORT = await portaLivre();
const vite = spawn(process.execPath, [path.join(NM, "vite", "bin", "vite.js"), "--port", String(PORT), "--strictPort", "--host", "127.0.0.1"], { cwd: DS, stdio: "ignore" });
const base = `http://127.0.0.1:${PORT}`;
let browser;
let falhou = 0;
try {
  let no_ar = false;
  for (let i = 0; i < 90 && !no_ar; i++) {
    try { no_ar = (await fetch(base)).ok; } catch {}
    if (!no_ar) await new Promise((r) => setTimeout(r, 1000));
  }
  if (!no_ar) throw new Error("O Vite não subiu em 90 s. Confira o npm install do DS.");

  browser = await chromium.launch(args.chromium ? { executablePath: path.resolve(args.chromium) } : {});
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: tema });
  await ctx.addInitScript((t) => { try { localStorage.setItem("brand-ds-theme", t); } catch {} }, tema);
  console.log(`Miniaturas de ${estiloId} (tema ${tema}):`);
  for (const [nome, rota, altura] of alvo) {
    const page = await ctx.newPage();
    try {
      await page.setViewportSize({ width: 1280, height: altura });
      await page.goto(base + rota, { waitUntil: "networkidle", timeout: 120000 });
      await page.waitForTimeout(1500);
      fs.writeFileSync(path.join(DS, "src/assets", `${nome}.jpg`), await page.screenshot({ type: "jpeg", quality: 85 }));
      console.log(`  ✔ src/assets/${nome}.jpg  (${rota})`);
    } catch (e) {
      falhou++;
      console.error(`  ✖ ${nome} (${rota}): ${String(e.message).split("\n")[0]}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser?.close();
  vite.kill();
}

// O estilo deixa de ter a pendência das miniaturas quando todas foram recapturadas
const geracao = path.join(DS, "GERACAO.md");
if (!args["sem-relatorio"] && !so && !falhou && fs.existsSync(geracao)) {
  const antes = fs.readFileSync(geracao, "utf8");
  const depois = antes
    .replace(/(- Pendências do estilo: )miniaturas da página Templates \(capturadas no estilo padrão\)(?:; )?/, "$1")
    .replace(/(- Pendências do estilo: )(\r?\n)/, "$1(nenhuma)$2");
  if (depois !== antes) {
    fs.writeFileSync(geracao, depois);
    console.log("GERACAO.md: pendência das miniaturas removida da seção do estilo.");
  }
}
console.log(falhou ? `${falhou} miniatura(s) falharam.` : "Pronto. Confira as imagens e o DS no navegador antes de publicar.");
process.exit(falhou ? 1 : 0);
