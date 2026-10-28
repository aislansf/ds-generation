#!/usr/bin/env node
/**
 * matriz-estilos.mjs — gera o DS de uma marca de teste em cada estilo visual e confere cada um.
 *
 * Uso:
 *   node tools/matriz-estilos.mjs --node-modules <pasta> [--estilos a,b,c] [--brief <json>] [--sem-build] [--capturas] [--chromium <exe>]
 *
 * Para cada estilo: gera com --estilo, roda `npm run build` (typecheck, tokens do Figma, checagens e vite build)
 * e `vitest run`, e lê os ajustes e avisos de contraste do GERACAO.md. Com --capturas, serve o dist e captura
 * / e /componentes em light e dark, montando uma galeria HTML para revisão humana.
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
const OUT = path.join(os.tmpdir(), "ds-generation-matriz");
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
    const rel = fs.readFileSync(path.join(dir, "GERACAO.md"), "utf8");
    const bloco = /## Estilo visual[\s\S]*?(?=\n## )/.exec(rel)?.[0] ?? "";
    linha.ajustes = (bloco.match(/^\s{2}- /gm) ?? []).length;
    linha.avisos = (/## Avisos\n\n([\s\S]*?)\n\n## /.exec(rel)?.[1] ?? "").split("\n").filter((l) => l.startsWith("- ") && !l.includes("(nenhum)") && /contraste|:1/.test(l)).length;
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
  console.log(`${linha.gerar && linha.build !== false && !/falha/.test(linha.testes ?? "") ? "✅" : "❌"} ${id.padEnd(14)} gerar=${st(linha.gerar)} build=${st(linha.build)} testes=${linha.testes ?? "—"} ajustes=${linha.ajustes}${linha.erro ? ` — ${linha.erro.slice(0, 200)}` : ""}`);
}

// ---------- Galeria ----------
if (args.capturas && !args["sem-build"]) {
  const { chromium } = createRequire(path.join(NM, "noop.js"))("playwright");
  const browser = await chromium.launch(args.chromium ? { executablePath: path.resolve(args.chromium) } : {});
  const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json" };
  const cards = [];
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
        for (const rota of ["/", "/componentes"]) {
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
      srv.close();
      cards.push(`<section><h2>${nome} <code>${id}</code></h2><div class="g">${imgs.map((i) => `<figure><a href="${i.file}"><img src="${i.file}" loading="lazy"></a><figcaption>${i.legenda}</figcaption></figure>`).join("")}</div></section>`);
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, "galeria.html"), `<!doctype html><meta charset="utf-8"><title>Matriz de estilos</title>
<style>body{font:14px system-ui;margin:24px;background:#f4f4f5}section{margin-bottom:32px}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}img{width:100%;border:1px solid #ccc}figure{margin:0}figcaption{color:#555}</style>
<h1>Matriz de estilos — ${path.basename(BRIEF)}</h1>${cards.join("\n")}`);
  console.log(`\nGaleria: ${path.join(OUT, "galeria.html")}`);
}

const falhas = linhas.filter((l) => !l.gerar || l.build === false || /falha/.test(l.testes ?? ""));
console.log(falhas.length ? `\n${falhas.length} estilo(s) falharam: ${falhas.map((l) => l.id).join(", ")}` : `\n${linhas.length} estilo(s) passaram. Saídas em ${OUT}`);
process.exit(falhas.length ? 1 : 0);
