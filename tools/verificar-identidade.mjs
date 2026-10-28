#!/usr/bin/env node
/**
 * verificar-identidade.mjs — prova que uma mudança na skill não altera o DS gerado.
 *
 * Uso:
 *   node tools/verificar-identidade.mjs --node-modules <pasta> [--base <ref-git>] [--estilo <id>] [--sem-capturas] [--bytes]
 *                                       [--marcas verde,neutra] [--rotas /,/componentes] [--tempo-rota <s>] [--tempos] [--saida <pasta>]
 *
 *   --base          versão de referência da skill (padrão: HEAD). É a linha de base: sai do git, não de binários versionados
 *   --node-modules  node_modules com vite e playwright (o mesmo do --node-modules do generate-ds.mjs)
 *   --estilo        gera a versão atual com --estilo <id> (ex.: corporativo) e a base sem estilo
 *   --sem-capturas  só compara os arquivos
 *   --bytes         falha se algum arquivo gerado diferir (sem a flag, a diferença de arquivos é só informativa)
 *   --chromium      executável do Chromium, se o da versão do Playwright não estiver baixado
 *   --marcas        só estes briefings (verde, neutra); padrão: os dois
 *   --rotas         só estas rotas, separadas por vírgula (ex.: /,/templates/dashboard-analitico); padrão: as 8 rotas-chave
 *   --tempo-rota    tempo limite de cada captura, em segundos (padrão: 180); a rota que estoura falha como "sem captura"
 *   --tempos        imprime quanto cada rota levou
 *   --saida         pasta de trabalho (padrão: <tmp>/ds-generation-identidade); é apagada no início
 *
 * Para cada briefing (exemplo-verde e marca-neutra):
 *   1. gera o DS com a skill da base (git archive) e com a skill atual;
 *   2. compara os arquivos byte a byte (o carimbo de data do GERACAO.md é ignorado);
 *   3. compila os dois (vite build), serve o dist e captura as rotas-chave em light e dark com o Chromium do Playwright;
 *   4. falha se alguma captura diferir em um pixel que seja, de forma estável: a rota é recapturada até 3 vezes,
 *      e a diferença só conta se a base, capturada duas vezes, for idêntica a si mesma (senão é ruído de captura).
 */
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args[a.slice(2)] = process.argv[i + 1]?.startsWith("--") ? true : process.argv[++i] ?? true;
}
if (!args["node-modules"]) {
  console.error("Uso: node tools/verificar-identidade.mjs --node-modules <pasta> [--base <ref>] [--estilo <id>] [--sem-capturas] [--bytes]");
  process.exit(1);
}
const NM = path.resolve(args["node-modules"]);
const BASE_REF = args.base ?? "HEAD";
const TMP = path.resolve(typeof args.saida === "string" ? args.saida : path.join(os.tmpdir(), "ds-generation-identidade"));
const lista = (v) => (typeof v === "string" ? v.split(",").map((x) => x.trim()).filter(Boolean) : null);
const BRIEFS = [
  ["verde", path.join(ROOT, "skills/ds-build/assets/examples/exemplo-verde.json")],
  ["neutra", path.join(ROOT, "tools/marca-neutra.json")],
].filter(([nome]) => !lista(args.marcas) || lista(args.marcas).includes(nome));
const ROTAS = lista(args.rotas) ?? ["/", "/fundamentos", "/componentes", "/templates", "/graficos/barras", "/templates/pagina-autenticacao", "/templates/tela-listagem", "/templates/dashboard-analitico"];
const TEMPO_ROTA = Number(args["tempo-rota"] ?? 180) * 1000;
if (!BRIEFS.length || !ROTAS.every((r) => r.startsWith("/")) || !(TEMPO_ROTA > 0)) {
  console.error("--marcas, --rotas ou --tempo-rota inválidos (marcas: verde, neutra; rotas começam com /; tempo em segundos).");
  process.exit(1);
}

class TempoEsgotado extends Error {}

let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "✅" : "❌"} ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  if (!ok) falhas++;
}
function run(cmd, argv, cwd = ROOT) {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(" ")} falhou:\n${r.stdout}${r.stderr}`);
  return r.stdout;
}
function unlinkNodeModules(dir) {
  const nm = path.join(dir, "node_modules");
  try { if (fs.lstatSync(nm).isSymbolicLink()) fs.unlinkSync(nm); } catch {}
}
function limpar(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir)) unlinkNodeModules(path.join(dir, e));
  fs.rmSync(dir, { recursive: true, force: true });
}

// ---------- 1. Skill da base, direto do git ----------
limpar(TMP);
fs.mkdirSync(TMP, { recursive: true });
const baseRoot = path.join(TMP, "base-skill");
fs.mkdirSync(baseRoot);
const tar = path.join(TMP, "base.tar");
fs.writeFileSync(tar, spawnSync("git", ["archive", BASE_REF, "skills/ds-build", "tools/marca-neutra.json", "origem/overrides"], { cwd: ROOT, maxBuffer: 1 << 30 }).stdout);
// Caminhos relativos: o tar do Git Bash lê "C:" como host remoto
run("tar", ["-xf", path.basename(tar), "-C", path.basename(baseRoot)], TMP);
const commit = run("git", ["rev-parse", "--short", BASE_REF]).trim();
console.log(`Base: ${BASE_REF} (${commit})${args.estilo ? ` · atual com --estilo ${args.estilo}` : ""} · marcas: ${BRIEFS.map(([n]) => n).join(", ")} · ${ROTAS.length} rota(s)\n`);

// ---------- 2. Geração e comparação de arquivos ----------
function listar(dir) {
  const out = new Map();
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === "dist") continue;
      const full = path.join(d, e.name);
      if (e.isDirectory()) { walk(full); continue; }
      const rel = path.relative(dir, full).split(path.sep).join("/");
      let buf = fs.readFileSync(full);
      if (rel === "GERACAO.md") buf = Buffer.from(buf.toString("utf8").replace(/^Gerado em \S+/m, "Gerado em <data>"));
      out.set(rel, createHash("sha256").update(buf).digest("hex"));
    }
  })(dir);
  return out;
}

const pares = [];
for (const [nome, brief] of BRIEFS) {
  const baseOut = path.join(TMP, `${nome}-base`), atualOut = path.join(TMP, `${nome}-atual`);
  // O briefing da base sai do próprio archive (caminhos de logo relativos a ele)
  const briefBase = path.join(baseRoot, path.relative(ROOT, brief));
  run("node", [path.join(baseRoot, "skills/ds-build/scripts/generate-ds.mjs"), "--brief", briefBase, "--out", baseOut, "--force", "--node-modules", NM]);
  const extra = args.estilo ? ["--estilo", String(args.estilo)] : [];
  run("node", [path.join(ROOT, "skills/ds-build/scripts/generate-ds.mjs"), "--brief", brief, "--out", atualOut, "--force", "--node-modules", NM, ...extra]);
  const a = listar(baseOut), b = listar(atualOut);
  const dif = [...new Set([...a.keys(), ...b.keys()])].filter((k) => a.get(k) !== b.get(k)).sort();
  const detalhe = dif.length ? `${dif.length} arquivo(s): ${dif.slice(0, 8).join(", ")}${dif.length > 8 ? "…" : ""}` : "idênticos";
  if (args.bytes) check(`Arquivos (${nome})`, dif.length === 0, detalhe);
  else console.log(`ℹ️  Arquivos (${nome}) — ${detalhe}`);
  pares.push({ nome, baseOut, atualOut });
}

// ---------- 3. Capturas ----------
if (!args["sem-capturas"]) {
  const { chromium } = createRequire(path.join(NM, "noop.js"))("playwright");
  const vite = path.join(NM, "vite", "bin", "vite.js");
  const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".woff2": "font/woff2", ".txt": "text/plain" };
  function servir(dist) {
    const srv = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(dist, url);
      if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, "index.html");
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    return new Promise((resolve) => srv.listen(0, "127.0.0.1", () => resolve(srv)));
  }
  // --chromium <exe>: usa um Chromium já baixado quando o da versão instalada do Playwright não estiver disponível
  const browser = await chromium.launch(args.chromium ? { executablePath: path.resolve(args.chromium) } : {});
  try {
    for (const { nome, baseOut, atualOut } of pares) {
      for (const dir of [baseOut, atualOut]) run("node", [vite, "build", "--logLevel", "error"], dir);
      const [sb, sa] = await Promise.all([servir(path.join(baseOut, "dist")), servir(path.join(atualOut, "dist"))]);
      const url = (s) => `http://127.0.0.1:${s.address().port}`;
      const diferentes = [], instaveis = [], semCaptura = [];
      for (const tema of ["light", "dark"]) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
        // useTheme lê o tema salvo nessa chave (a mesma em todo DS gerado)
        await ctx.addInitScript((t) => { try { localStorage.setItem("brand-ds-theme", t); } catch {} }, tema);
        // Cada captura tem tempo limite: uma página que nunca fica ociosa (imagem lazy, requisição pendurada)
        // travava a execução inteira. Ao estourar, a página é fechada e a rota falha como "sem captura".
        const shot = async (base, rota) => {
          const page = await ctx.newPage();
          let timer;
          const limite = new Promise((_, rej) => { timer = setTimeout(() => rej(new TempoEsgotado()), TEMPO_ROTA); });
          try {
            return await Promise.race([capturar(page, base, rota), limite]);
          } finally {
            clearTimeout(timer);
            await page.close().catch(() => {});
          }
        };
        const capturar = async (page, base, rota) => {
          await page.goto(base + rota, { waitUntil: "networkidle", timeout: TEMPO_ROTA });
          // Rola a página inteira para disparar as imagens lazy e espera todas carregarem
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 600) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 40));
            }
            window.scrollTo(0, 0);
            // Imagem lazy fora da tela pode nunca disparar load: espera no máximo 5 s
            const imagens = Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
            await Promise.race([imagens, new Promise((r) => setTimeout(r, 5000))]);
            await document.fonts.ready;
          });
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1500);
          return page.screenshot({ fullPage: true, animations: "disabled" });
        };
        // Conta os pixels diferentes num canvas (as duas imagens podem ter alturas diferentes)
        const contar = async (x, y) => {
          if (x.equals(y)) return 0;
          const page = await ctx.newPage();
          const px = await page.evaluate(async ([a, b]) => {
            const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = s; });
            const [ia, ib] = await Promise.all([load(a), load(b)]);
            if (ia.width !== ib.width || ia.height !== ib.height) return `tamanho ${ia.width}×${ia.height} → ${ib.width}×${ib.height}`;
            const c = document.createElement("canvas"); c.width = ia.width; c.height = ia.height;
            const g = c.getContext("2d");
            g.drawImage(ia, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data;
            g.clearRect(0, 0, c.width, c.height); g.drawImage(ib, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data;
            let n = 0; for (let i = 0; i < da.length; i += 4) if (da[i] !== db[i] || da[i + 1] !== db[i + 1] || da[i + 2] !== db[i + 2] || da[i + 3] !== db[i + 3]) n++;
            return n;
          }, [`data:image/png;base64,${x.toString("base64")}`, `data:image/png;base64,${y.toString("base64")}`]);
          await page.close();
          return px;
        };
        // Páginas longas têm ruído de captura (imagens lazy, antialiasing, animação dos gráficos). Uma rota só
        // falha se diferir nas 3 tentativas enquanto a base, capturada duas vezes, fica idêntica a si mesma.
        for (const rota of ROTAS) {
          let px = 0, ruido = 0, x, y;
          const inicio = Date.now();
          try {
            for (let tentativa = 0; tentativa < 3; tentativa++) {
              [x, y] = [await shot(url(sb), rota), await shot(url(sa), rota)];
              px = await contar(x, y);
              if (px === 0) break;
              if ((await contar(x, await shot(url(sb), rota))) !== 0) ruido++;
            }
          } catch (e) {
            if (!(e instanceof TempoEsgotado)) throw e;
            semCaptura.push(`${tema} ${rota} (passou de ${TEMPO_ROTA / 1000} s)`);
            continue;
          }
          if (args.tempos) console.log(`   ${nome} ${tema} ${rota}: ${((Date.now() - inicio) / 1000).toFixed(1)} s`);
          if (px === 0) continue;
          const slug = `${nome}-${tema}${rota.replace(/\//g, "_")}`;
          fs.writeFileSync(path.join(TMP, `${slug}-base.png`), x);
          fs.writeFileSync(path.join(TMP, `${slug}-atual.png`), y);
          const desc = `${tema} ${rota} (${typeof px === "number" ? `${px} px` : px})`;
          if (ruido) instaveis.push(desc);
          else diferentes.push(desc);
        }
        await ctx.close();
      }
      sb.close(); sa.close();
      check(`Capturas (${nome}, ${ROTAS.length} rotas × light/dark)`, diferentes.length === 0, diferentes.join("; "));
      if (semCaptura.length) check(`Rotas sem captura (${nome})`, false, semCaptura.join("; "));
      if (instaveis.length) console.log(`⚠️  Capturas instáveis (${nome}): a base também variou entre capturas, confira à mão — ${instaveis.join("; ")}`);
    }
  } finally {
    await browser.close();
  }
}

for (const { baseOut, atualOut } of pares) { unlinkNodeModules(baseOut); unlinkNodeModules(atualOut); }
console.log(falhas ? `\n${falhas} verificação(ões) falharam. Saídas e capturas em ${TMP}` : `\nIdentidade preservada. Saídas em ${TMP}`);
process.exit(falhas ? 1 : 0);
