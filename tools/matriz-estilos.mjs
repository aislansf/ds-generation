#!/usr/bin/env node
/**
 * matriz-estilos.mjs — gera o DS de uma marca de teste em cada estilo visual e confere cada um.
 *
 * Uso:
 *   node tools/matriz-estilos.mjs --node-modules <pasta> [--estilos a,b,c] [--brief <json>] [--sem-build] [--capturas]
 *                                 [--chromium <exe>] [--saida <pasta>] [--rotas /,/componentes]
 *
 * Para cada estilo: gera com --estilo, roda `npm run build` (typecheck, tokens do Figma, checagens e vite build)
 * e `vitest run`, e lê os ajustes de contraste e os avisos do estilo em public/design-system/estilo.json. Com --capturas, serve o dist e captura
 * a Home, /componentes e três templates (ou as rotas de --rotas) em light e dark, montando uma galeria HTML
 * para revisão humana.
 *
 * Com --capturas, os estilos cuja camada CSS responde a movimento ou transparência reduzidos também são conferidos
 * com essas preferências ligadas: o hover que desloca ou aumenta (neobrutalismo, claymorfismo) precisa sumir com
 * prefers-reduced-motion, e o vidro (glassmorfismo) precisa ficar opaco com prefers-reduced-transparency.
 * As capturas dessas preferências entram na galeria.
 *
 * --saida: pasta das saídas (padrão: <tmp>/ds-generation-matriz). Pastas diferentes permitem rodar duas marcas ao mesmo tempo.
 * Sai uma tabela-resumo e o código 1 se algum estilo falhar.
 */
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { listarEstilos, carregarEstilo } from "../skills/ds-build/scripts/lib/estilos.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args[a.slice(2)] = process.argv[i + 1]?.startsWith("--") ? true : process.argv[++i] ?? true;
}
if (!args["node-modules"]) {
  console.error("Uso: node tools/matriz-estilos.mjs --node-modules <pasta> [--estilos a,b] [--brief <json>] [--sem-build] [--capturas]");
  process.exit(1);
}
const NM = path.resolve(args["node-modules"]);
const BRIEF = path.resolve(args.brief ?? path.join(ROOT, "skills/ds-build/assets/examples/exemplo-verde.json"));
const ESTILOS = args.estilos ? String(args.estilos).split(",") : listarEstilos();
// Rotas da galeria: a vitrine de componentes e três templates montados à mão (onde os ganchos do R1 agem)
const ROTAS_GALERIA = typeof args.rotas === "string" ? args.rotas.split(",") : ["/", "/componentes", "/templates/pagina-autenticacao", "/templates/tela-listagem", "/templates/dashboard-analitico"];
const OUT = path.resolve(typeof args.saida === "string" ? args.saida : path.join(os.tmpdir(), "ds-generation-matriz"));
fs.mkdirSync(OUT, { recursive: true });

function run(cmd, argv, cwd) {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8", maxBuffer: 1 << 28, shell: process.platform === "win32" && (cmd === "npm" || cmd === "npx") });
  return { ok: r.status === 0, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

const linhas = [];
for (const id of ESTILOS) {
  const dir = path.join(OUT, id);
  const g = run("node", [path.join(ROOT, "skills/ds-build/scripts/generate-ds.mjs"), "--brief", BRIEF, "--out", dir, "--force", "--estilo", id, "--node-modules", NM], ROOT);
  const linha = { id, nome: carregarEstilo(id).nome, gerar: g.ok, build: null, testes: null, ajustes: 0, avisos: 0, erro: "" };
  if (!g.ok) linha.erro = g.out.split("\n").slice(0, 3).join(" ");
  else {
    // Resumo estruturado gravado pelo gerador (ajustes e avisos do estilo)
    const resumo = JSON.parse(fs.readFileSync(path.join(dir, "public/design-system/estilo.json"), "utf8"));
    linha.ajustes = resumo.ajustes_contraste.length;
    linha.avisos = resumo.avisos.length;
    if (!args["sem-build"]) {
      const b = run("npm", ["run", "build"], dir);
      linha.build = b.ok;
      if (!b.ok) linha.erro = b.out.split("\n").filter((l) => /error|❌|FAIL/i.test(l)).slice(0, 3).join(" | ");
      const t = run("npx", ["vitest", "run"], dir);
      const m = /Tests\s+(?:(\d+) failed \|\s+)?(\d+) passed/.exec(t.out.replace(/\x1b\[[0-9;]*m/g, ""));
      linha.testes = t.ok ? `${m?.[2] ?? "?"} ok` : `${m?.[1] ?? "?"} falha(s)`;
      if (!t.ok && !linha.erro) linha.erro = t.out.replace(/\x1b\[[0-9;]*m/g, "").split("\n").filter((l) => /FAIL|AssertionError|Expected/.test(l)).slice(0, 3).join(" | ");
    }
  }
  linhas.push(linha);
  const st = (v) => (v === null ? "—" : v ? "ok" : "FALHOU");
  console.log(`${linha.gerar && linha.build !== false && !/falha/.test(linha.testes ?? "") ? "✅" : "❌"} ${id.padEnd(14)} gerar=${st(linha.gerar)} build=${st(linha.build)} testes=${linha.testes ?? "—"} ajustes=${linha.ajustes} avisos=${linha.avisos}${linha.erro ? ` — ${linha.erro.slice(0, 200)}` : ""}`);
}

// ---------- Galeria ----------
if (args.capturas && !args["sem-build"]) {
  const { chromium } = createRequire(path.join(NM, "noop.js"))("playwright");
  const browser = await chromium.launch(args.chromium ? { executablePath: path.resolve(args.chromium) } : {});
  const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json" };
  const cards = [];
  const reduzidos = [];
  // Preferências de acessibilidade: movimento reduzido pelo Playwright; transparência reduzida pelo DevTools
  // Protocol (o Playwright ainda não emula prefers-reduced-transparency).
  async function abrir(base, rota, { movimento = "no-preference", transparencia = false } = {}) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: movimento });
    await ctx.addInitScript(() => { try { localStorage.setItem("brand-ds-theme", "light"); } catch {} });
    const page = await ctx.newPage();
    if (transparencia) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
    }
    await page.goto(base + rota, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(800);
    return { ctx, page };
  }
  const BOTAO = '[data-ds="button"]:not([data-variant="link"]):not([data-variant="ghost"])';
  // Transform do primeiro botão com gancho visível em hover (a transição dura no máximo --duration-normal).
  // Procura em /componentes e, se lá não houver, num template que usa o <Button> do DS.
  async function transformNoHover(base, movimento) {
    let ctx, page, botao;
    for (const rota of ["/componentes", "/templates/dashboard-analitico"]) {
      ({ ctx, page } = await abrir(base, rota, { movimento }));
      botao = page.locator(BOTAO).filter({ visible: true }).first();
      if (await botao.count()) break;
      await ctx.close();
      botao = null;
    }
    if (!botao) return { transform: "sem botão com data-ds visível", shot: null };
    await botao.scrollIntoViewIfNeeded();
    await botao.hover();
    await page.waitForTimeout(500);
    const transform = await botao.evaluate((el) => getComputedStyle(el).transform);
    const c = await botao.boundingBox();
    const shot = await page.screenshot({ type: "jpeg", quality: 80, clip: { x: Math.max(0, c.x - 80), y: Math.max(0, c.y - 60), width: Math.min(640, c.width + 160), height: c.height + 120 } });
    await ctx.close();
    return { transform, shot };
  }
  async function vidro(base, transparencia) {
    const { ctx, page } = await abrir(base, "/", { transparencia });
    // O header tem o gancho em toda rota; o card, quando a página tiver um com gancho
    const r = await page.evaluate(() => {
      const medir = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { backdrop: cs.backdropFilter, fundo: cs.backgroundColor };
      };
      return {
        suportado: matchMedia("(prefers-reduced-transparency: reduce)").matches,
        superficies: Object.fromEntries(["header", "card"].map((k) => [k, medir(`[data-ds="${k}"]`)]).filter(([, v]) => v)),
      };
    });
    const shot = await page.screenshot({ type: "jpeg", quality: 80 });
    await ctx.close();
    return { ...r, shot };
  }
  // rgb(…) ou rgba(…, 1) / color(… / 1): sem transparência
  const opaco = (cor) => !!cor && !/(,\s*|\/\s*)0?\.\d+\)$/.test(cor);
  try {
    for (const { id, nome, build } of linhas) {
      if (!build) continue;
      const dist = path.join(OUT, id, "dist");
      const srv = http.createServer((req, res) => {
        let file = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
        if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, "index.html");
        res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
        fs.createReadStream(file).pipe(res);
      });
      await new Promise((r) => srv.listen(0, "127.0.0.1", r));
      const base = `http://127.0.0.1:${srv.address().port}`;
      const imgs = [];
      for (const tema of ["light", "dark"]) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
        await ctx.addInitScript((t) => { try { localStorage.setItem("brand-ds-theme", t); } catch {} }, tema);
        for (const rota of ROTAS_GALERIA) {
          const page = await ctx.newPage();
          await page.goto(base + rota, { waitUntil: "networkidle", timeout: 120000 });
          await page.waitForTimeout(1200);
          const file = `${id}-${tema}${rota === "/" ? "-home" : rota.replace(/\//g, "-")}.jpg`;
          await page.screenshot({ path: path.join(OUT, file), type: "jpeg", quality: 80 });
          imgs.push({ file, legenda: `${rota} · ${tema}` });
          await page.close();
        }
        await ctx.close();
      }
      // Movimento e transparência reduzidos, só nos estilos cuja camada responde a eles
      const preset = carregarEstilo(id);
      const camada = preset.css ? fs.readFileSync(path.join(ROOT, "skills/ds-build/assets/estilos", id, preset.css), "utf8") : "";
      if (camada.includes("prefers-reduced-motion")) {
        const normal = await transformNoHover(base, "no-preference");
        const reduzido = await transformNoHover(base, "reduce");
        const ok = !!normal.shot && normal.transform !== "none" && reduzido.transform === "none";
        reduzidos.push({ id, pref: "prefers-reduced-motion", ok, detalhe: `botão em hover: ${normal.transform} → com a preferência: ${reduzido.transform}` });
        for (const [k, v] of [["movimento", normal], ["movimento-reduzido", reduzido]]) {
          if (!v.shot) continue;
          fs.writeFileSync(path.join(OUT, `${id}-${k}.jpg`), v.shot);
          imgs.push({ file: `${id}-${k}.jpg`, legenda: `botão em hover · ${k === "movimento" ? "movimento normal" : "prefers-reduced-motion"} (${v.transform})` });
        }
      }
      if (camada.includes("prefers-reduced-transparency")) {
        const normal = await vidro(base, false);
        const reduzido = await vidro(base, true);
        const nomes = Object.keys(normal.superficies);
        const ok = reduzido.suportado && nomes.length > 0 && nomes.every((k) => {
          const [a, b] = [normal.superficies[k], reduzido.superficies[k]];
          return a.backdrop !== "none" && b?.backdrop === "none" && opaco(b?.fundo);
        });
        const detalhe = !reduzido.suportado ? "o Chromium não emulou a preferência"
          : nomes.map((k) => `${k}: ${normal.superficies[k].backdrop} sobre ${normal.superficies[k].fundo} → ${reduzido.superficies[k]?.backdrop} sobre ${reduzido.superficies[k]?.fundo}`).join("; ") || "nenhuma superfície com gancho";
        reduzidos.push({ id, pref: "prefers-reduced-transparency", ok, detalhe });
        fs.writeFileSync(path.join(OUT, `${id}-transparencia-reduzida.jpg`), reduzido.shot);
        imgs.push({ file: `${id}-transparencia-reduzida.jpg`, legenda: "/ · light · prefers-reduced-transparency" });
      }
      srv.close();
      cards.push(`<section><h2>${nome} <code>${id}</code></h2><div class="g">${imgs.map((i) => `<figure><a href="${i.file}"><img src="${i.file}" loading="lazy"></a><figcaption>${i.legenda}</figcaption></figure>`).join("")}</div></section>`);
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, "galeria.html"), `<!doctype html><meta charset="utf-8"><title>Matriz de estilos</title>
<style>body{font:14px system-ui;margin:24px;background:#f4f4f5}section{margin-bottom:32px}.g{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}img{width:100%;border:1px solid #ccc}figure{margin:0}figcaption{color:#555}</style>
<h1>Matriz de estilos — ${path.basename(BRIEF)}</h1>${cards.join("\n")}`);
  if (reduzidos.length) console.log("");
  for (const r of reduzidos) {
    console.log(`${r.ok ? "✅" : "❌"} ${r.id.padEnd(14)} ${r.pref} — ${r.detalhe}`);
    if (!r.ok) linhas.find((l) => l.id === r.id).reduzido = false;
  }
  console.log(`\nGaleria: ${path.join(OUT, "galeria.html")}`);
}

const falhas = linhas.filter((l) => !l.gerar || l.build === false || /falha/.test(l.testes ?? "") || l.reduzido === false);
console.log(falhas.length ? `\n${falhas.length} estilo(s) falharam: ${falhas.map((l) => l.id).join(", ")}` : `\n${linhas.length} estilo(s) passaram. Saídas em ${OUT}`);
process.exit(falhas.length ? 1 : 0);
