#!/usr/bin/env node
/**
 * imagens-neutras.mjs — produz as imagens genéricas do template em origem/overrides/.
 *
 * Uso:
 *   node tools/imagens-neutras.mjs --source <ds-origem>/frontend --node-modules <pasta node_modules com vite e playwright>
 *
 * 1. Vetores: logo neutro ("Sua Marca") em cor/branco/preto e placeholder.svg.
 * 2. Rasters (Chromium do Playwright): favicon.png, marca-parceiro.png e a imagem lateral de login.
 * 3. Miniaturas da página Templates: extrai o template num diretório temporário, gera o DS da
 *    tools/marca-neutra.json, sobe o Vite e captura cada tela.
 *
 * Depois rode tools/extract-template.mjs normalmente: os overrides entram no template.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OVR = path.join(ROOT, "origem", "overrides");
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args[a.slice(2)] = process.argv[i + 1]?.startsWith("--") ? true : process.argv[++i] ?? true;
}
if (!args.source || !args["node-modules"]) {
  console.error("Uso: node tools/imagens-neutras.mjs --source <ds-origem>/frontend --node-modules <pasta>");
  process.exit(1);
}
const NM = path.resolve(args["node-modules"]);
const { chromium } = createRequire(path.join(NM, "noop.js"))("playwright");
const write = (rel, data) => {
  const file = path.join(OVR, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  console.log(`  ${rel}`);
};

// ---------- 1. Vetores ----------
const INK = "#334155";
function logo(fill, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 160" role="img" aria-label="Sua Marca">
  <defs>
    <mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
      <rect width="160" height="160" fill="#fff"/>
      <path d="M38 118 L72 46 L106 118 Z" fill="#000"/>
      <circle cx="112" cy="54" r="14" fill="#000"/>
    </mask>
  </defs>
  <rect x="8" y="8" width="144" height="144" rx="36" fill="${fill}" mask="url(#${id})"/>
  <text x="180" y="103" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" letter-spacing="-1" fill="${fill}">Sua Marca</text>
</svg>
`;
}
console.log("Vetores:");
write("src/assets/marca/brand-cor.svg", logo(INK, "sm-cor"));
write("src/assets/marca/brand-white.svg", logo("#FFFFFF", "sm-branco"));
write("src/assets/marca/brand-black.svg", logo("#111111", "sm-preto"));
write("src/assets/brand-logo-white.svg", logo("#FFFFFF", "sm-branco-2"));
write("src/assets/brand-logo-white-header.svg", logo("#FFFFFF", "sm-branco-3"));
write("public/placeholder.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#E2E8F0"/>
  <g fill="none" stroke="#94A3B8" stroke-width="20" stroke-linejoin="round" stroke-linecap="round">
    <rect x="420" y="270" width="360" height="260" rx="24"/>
    <path d="M450 500 L560 380 L640 470 L690 420 L760 500"/>
  </g>
  <circle cx="700" cy="340" r="26" fill="#94A3B8"/>
</svg>
`);

// ---------- 2. Rasters ----------
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="512" height="512">
  <defs><mask id="f" maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="160"><rect width="160" height="160" fill="#fff"/><path d="M38 118 L72 46 L106 118 Z" fill="#000"/><circle cx="112" cy="54" r="14" fill="#000"/></mask></defs>
  <rect x="8" y="8" width="144" height="144" rx="36" fill="${INK}" mask="url(#f)"/>
</svg>`;
const parceiro = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 798 348" width="798" height="348">
  <rect x="6" y="6" width="786" height="336" rx="40" fill="#FFFFFF" stroke="#94A3B8" stroke-width="6"/>
  <circle cx="150" cy="174" r="78" fill="#64748B"/>
  <rect x="112" y="136" width="76" height="76" rx="12" fill="#FFFFFF"/>
  <text x="270" y="170" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="700" fill="#334155">MARCA</text>
  <text x="274" y="238" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="400" letter-spacing="10" fill="#64748B">PARCEIRA</text>
</svg>`;
const login = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1084 1224" width="1084" height="1224">
  <defs>
    <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2E8F0"/><stop offset="1" stop-color="#94A3B8"/></linearGradient>
    <pattern id="jan" width="40" height="48" patternUnits="userSpaceOnUse"><rect x="10" y="12" width="20" height="26" rx="2" fill="#FFFFFF" opacity="0.28"/></pattern>
  </defs>
  <rect width="1084" height="1224" fill="url(#ceu)"/>
  <circle cx="820" cy="250" r="170" fill="#FFFFFF" opacity="0.4"/>
  <circle cx="220" cy="420" r="250" fill="#FFFFFF" opacity="0.16"/>
  <rect x="80" y="660" width="230" height="564" fill="#64748B"/><rect x="80" y="660" width="230" height="564" fill="url(#jan)"/>
  <rect x="340" y="470" width="270" height="754" fill="#475569"/><rect x="340" y="470" width="270" height="754" fill="url(#jan)"/>
  <rect x="640" y="570" width="210" height="654" fill="#334155"/><rect x="640" y="570" width="210" height="654" fill="url(#jan)"/>
  <rect x="880" y="720" width="170" height="504" fill="#52606F"/><rect x="880" y="720" width="170" height="504" fill="url(#jan)"/>
  <rect y="1170" width="1084" height="54" fill="#1E293B"/>
</svg>`;

const browser = await chromium.launch();
try {
  console.log("Rasters:");
  async function raster(svg, w, h, type) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", '<svg style="display:block;width:100%;height:100%" ')}</body></html>`);
    const buf = await page.screenshot({ type, omitBackground: type === "png", ...(type === "jpeg" ? { quality: 85 } : {}) });
    await page.close();
    return buf;
  }
  write("public/favicon.png", await raster(favicon, 512, 512, "png"));
  write("src/assets/marca-parceiro.png", await raster(parceiro, 798, 348, "png"));
  const loginJpg = await raster(login, 1084, 1224, "jpeg");
  write("src/assets/exemplo-imagem-login.jpg", loginJpg);
  write("src/assets/exemplo-imagem-login-2.jpg", loginJpg);

  // ---------- 3. Miniaturas ----------
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "ds-miniaturas-"));
  const tpl = path.join(TMP, "template"), ds = path.join(TMP, "ds");
  const run = (argv) => spawnSync(process.execPath, argv, { cwd: ROOT, encoding: "utf8" });
  // A extração falha enquanto as miniaturas não existem nos overrides; o template sai completo mesmo assim
  run(["tools/extract-template.mjs", "--source", path.resolve(args.source), "--out", tpl]);
  const g = run(["skills/ds-build/scripts/generate-ds.mjs", "--brief", "tools/marca-neutra.json", "--out", ds, "--template", tpl, "--node-modules", NM]);
  if (g.status !== 0) throw new Error(`Falha ao gerar o DS neutro:\n${g.stdout}${g.stderr}`);

  const PORT = 5199;
  const vite = spawn(process.execPath, [path.join(NM, "vite", "bin", "vite.js"), "--port", String(PORT), "--strictPort", "--host", "127.0.0.1"], { cwd: ds, stdio: "ignore" });
  try {
    const base = `http://127.0.0.1:${PORT}`;
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(base)).ok) break; } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }
    console.log("Miniaturas:");
    const shots = [
      ["thumb-tela-listagem.jpg", "/templates/tela-listagem", 720],
      ["thumb-tela-formulario.jpg", "/templates/tela-formulario", 800],
      ["thumb-pagina-autenticacao.jpg", "/templates/pagina-autenticacao", 800],
      ["thumb-radar-estrategico.jpg", "/templates/radar-estrategico", 800],
      ["thumb-pagina-erro.jpg", "/templates/pagina-erro", 800],
      ["thumb-modal-acesso.jpg", "/templates/modal-acesso", 800],
    ];
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "light" });
    for (const [file, route, h] of shots) {
      const page = await ctx.newPage();
      await page.setViewportSize({ width: 1280, height: h });
      await page.goto(base + route, { waitUntil: "networkidle", timeout: 120000 });
      await page.waitForTimeout(1500);
      write(`src/assets/${file}`, await page.screenshot({ type: "jpeg", quality: 85 }));
      await page.close();
    }
  } finally {
    vite.kill();
  }
  // node_modules do DS temporário é uma junction: desfaz antes de apagar, nunca apaga o alvo
  const link = path.join(ds, "node_modules");
  try { if (fs.lstatSync(link).isSymbolicLink()) fs.unlinkSync(link); } catch {}
  if (fs.existsSync(link)) console.warn(`  (não apaguei ${TMP}: o link para node_modules continua lá)`);
  else fs.rmSync(TMP, { recursive: true, force: true });
} finally {
  await browser.close();
}
console.log("Pronto. Rode tools/extract-template.mjs para levar as imagens ao template.");
