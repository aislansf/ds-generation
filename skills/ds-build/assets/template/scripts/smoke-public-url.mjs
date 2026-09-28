#!/usr/bin/env node
/**
 * Smoke test pós-deploy.
 * Valida em duas camadas:
 *   1. HTTP: a URL pública entrega o HTML com o bundle do Vite e os
 *      chunk(s) JS principais carregam com 200 + Content-Type de JS.
 *   2. Render (--render): abre a página em Chromium headless (Playwright),
 *      garante que #root recebeu conteúdo e que não houve erro de runtime.
 *
 * Uso:
 *   node scripts/smoke-public-url.mjs [url] [--render]
 *   SMOKE_URL=https://__DS_DOMAIN__ npm run test:smoke
 *   npm run test:smoke:render
 */

const DEFAULT_URL = "https://__DS_DOMAIN__/";
const args = process.argv.slice(2);
const renderMode = args.includes("--render") || process.env.SMOKE_RENDER === "1";
const url = args.find((a) => !a.startsWith("--")) || process.env.SMOKE_URL || DEFAULT_URL;
const TIMEOUT_MS = 15_000;

function fail(msg) {
  console.error(`✗ Smoke test falhou: ${msg}`);
  process.exit(1);
}

async function fetchWithTimeout(target, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(target, { ...init, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(t);
  }
}

const base = new URL(url);
console.log(`→ Smoke test em ${base.href}`);

const res = await fetchWithTimeout(base).catch((e) => fail(`não foi possível buscar ${base.href}: ${e.message}`));
if (!res.ok) fail(`HTML respondeu ${res.status} ${res.statusText}`);
const html = await res.text();

// 1) Shell HTML mínimo
if (!/<div\s+id=["']root["']/i.test(html)) fail('elemento <div id="root"> ausente');
if (!/<head[\s>]/i.test(html) || !/<\/head>/i.test(html)) fail("<head> ausente no HTML servido (deploy provavelmente stale)");
if (!/<title[^>]*>[^<]+<\/title>/i.test(html)) fail("<title> ausente");

// 2) Bundle do Vite referenciado
const scriptMatches = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js)["']/gi)].map((m) => m[1]);
if (scriptMatches.length === 0) fail("nenhum <script src=*.js> encontrado no HTML (bundle do Vite não embutido)");

// 3) Bundles carregam com 200 + JS Content-Type
const checked = [];
for (const src of scriptMatches) {
  const assetUrl = new URL(src, base).href;
  const r = await fetchWithTimeout(assetUrl).catch((e) => fail(`erro ao buscar ${assetUrl}: ${e.message}`));
  if (!r.ok) fail(`bundle ${assetUrl} respondeu ${r.status}`);
  const ct = (r.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("javascript") && !ct.includes("ecmascript")) fail(`bundle ${assetUrl} com Content-Type inesperado: ${ct}`);
  const body = await r.text();
  if (body.length < 100) fail(`bundle ${assetUrl} suspeito (tamanho ${body.length} bytes)`);
  checked.push(assetUrl);
}

console.log(`✓ HTML OK · ${scriptMatches.length} bundle(s) carregado(s):`);
for (const u of checked) console.log(`  · ${u}`);

if (!renderMode) {
  console.log("✓ Smoke test (HTTP) concluído com sucesso.");
  process.exit(0);
}

// ---- Render check via Playwright ----
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  fail("Playwright não está instalado. Rode `npm i -D playwright` ou omita --render.");
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const runtimeErrors = [];
page.on("pageerror", (e) => runtimeErrors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") runtimeErrors.push(`console.error: ${m.text()}`);
});

try {
  await page.goto(base.href, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => (document.getElementById("root")?.innerHTML.length || 0) > 50, null, {
    timeout: 10_000,
  });
  const rootLen = await page.evaluate(() => document.getElementById("root")?.innerHTML.length || 0);
  const visibleText = (await page.evaluate(() => document.body.innerText || "")).trim();
  if (rootLen < 50) fail(`#root vazio após render (length=${rootLen})`);
  if (visibleText.length < 10) fail("nenhum texto visível renderizado no body");
  if (runtimeErrors.length) fail(`erros de runtime detectados:\n  - ${runtimeErrors.join("\n  - ")}`);
  console.log(`✓ Render OK · #root=${rootLen} chars · texto visível: ${visibleText.slice(0, 80).replace(/\s+/g, " ")}…`);
} finally {
  await browser.close();
}

console.log("✓ Smoke test (HTTP + render) concluído com sucesso.");