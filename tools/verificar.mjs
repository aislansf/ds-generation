#!/usr/bin/env node
/**
 * Verificação de regressão do gerador. Rode antes de publicar uma nova versão da skill.
 *
 * Uso:
 *   node tools/verificar.mjs [--source <ds-origem>/frontend] [--node-modules <pasta>]
 *
 *   --source        reextrai o template a partir do DS de origem antes de testar
 *   --node-modules  também roda build + testes no DS gerado (junction para esse node_modules)
 *
 * Checagens:
 *   1. (com --source) extração sem remanescentes da origem (texto, nomes de arquivo, imagens sem revisão)
 *   2. briefing incompleto é recusado (o modelo com PREENCHER não gera nada)
 *   3. ida e volta: gerar com o briefing de origem não altera nenhuma cor (hex=0 hsl=0)
 *   4. marca de teste: sem marcas proibidas nem placeholders não resolvidos
 *   5. marca de teste: nenhum termo da origem no DS gerado
 *   5b. marca de teste: H1 (light e dark), validadores e ColorSection na cor do briefing; textos de fonte e dependências corretos
 *   5c. estilos visuais: presets válidos, sem estilo = corporativo byte a byte, estilo inválido é pendência,
 *       briefing com estilo aplica a camada CSS
 *   (identidade visual pixel a pixel: tools/verificar-identidade.mjs; build e testes por estilo: tools/matriz-estilos.mjs)
 *   6. (com --node-modules) npm run build e vitest passam no DS da marca de teste
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { residualMatchers, termoPermitido } from "./lib/regras-extracao.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = path.join(ROOT, "skills", "ds-build");
const ORIGEM = path.join(ROOT, "origem", "ds-sebrae.json");
const OUT = path.join(os.tmpdir(), "ds-generation-verificar");

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args[a.slice(2)] = process.argv[i + 1]?.startsWith("--") ? true : process.argv[++i] ?? true;
}

let falhas = 0;
function run(cmd, argv, cwd = ROOT) {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8", shell: process.platform === "win32" && (cmd === "npm" || cmd === "npx") });
  return { ok: r.status === 0, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "✅" : "❌"} ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  if (!ok) falhas++;
}
const GEN = path.join(SKILL, "scripts", "generate-ds.mjs");

if (args.source) {
  const r = run("node", ["tools/extract-template.mjs", "--source", path.resolve(args.source)]);
  const m = /remanescentes da origem: (\d+)/.exec(r.out);
  check("Extração do template", r.ok && m?.[1] === "0", m ? `${m[1]} remanescente(s)` : r.out.slice(0, 300));
}

{
  const r = run("node", [GEN, "--brief", path.join(SKILL, "assets", "brand-brief.template.json"), "--out", path.join(OUT, "incompleto"), "--force"]);
  const n = /(\d+) pergunta\(s\) sem resposta/.exec(r.out)?.[1];
  check("Briefing incompleto é recusado", !r.ok && !!n && !fs.existsSync(path.join(OUT, "incompleto", "package.json")), n ? `${n} pendência(s)` : r.out.slice(0, 300));
}

{
  const r = run("node", [GEN, "--brief", ORIGEM, "--out", path.join(OUT, "origem"), "--force"]);
  const m = /hex=(\d+) hsl=(\d+)/.exec(r.out);
  check("Ida e volta (origem → origem)", r.ok && m?.[1] === "0" && m?.[2] === "0", m ? `hex=${m[1]} hsl=${m[2]}` : r.out.slice(0, 300));
}

const verde = path.join(OUT, "verde");
{
  const argv = [GEN, "--brief", path.join(SKILL, "assets", "examples", "exemplo-verde.json"), "--out", verde, "--force"];
  if (args["node-modules"]) argv.push("--node-modules", path.resolve(args["node-modules"]));
  const r = run("node", argv);
  const proib = /marcas proibidas: (\d+)/.exec(r.out)?.[1];
  const ph = /placeholders: (\d+)/.exec(r.out)?.[1];
  check("Geração da marca de teste", r.ok && proib === "0" && ph === "0", `marcas proibidas=${proib} placeholders=${ph}`);
}

{
  const origem = JSON.parse(fs.readFileSync(ORIGEM, "utf8"));
  const matchers = residualMatchers(origem);
  const hits = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", "dist"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!/\.(tsx?|jsx?|mjs|css|html?|json|md|txt|xml|svg)$/i.test(entry.name) || entry.name === "package-lock.json") continue;
      const text = fs.readFileSync(full, "utf8");
      const rel = path.relative(verde, full).split(path.sep).join("/");
      for (const m of matchers) if (m.re.test(text) && !termoPermitido(origem, rel, m.termo)) hits.push(`${rel} [${m.termo}]`);
    }
  })(verde);
  check("Nenhum termo da origem no DS gerado", hits.length === 0, hits.slice(0, 5).join(", "));
}

{
  // Cor institucional (H1 e validadores), ColorSection, textos de fonte e dependências seguem o briefing
  const brief = JSON.parse(fs.readFileSync(path.join(SKILL, "assets", "examples", "exemplo-verde.json"), "utf8"));
  const prim = brief.cores.primaria.toUpperCase();
  const rgb = `rgb(${[1, 3, 5].map((i) => parseInt(prim.slice(i, i + 2), 16)).join(", ")})`;
  const ler = (rel) => fs.readFileSync(path.join(verde, rel), "utf8");
  const problemas = [];
  if (!new RegExp(`h1\\s*\\{\\s*color:\\s*${prim}`, "i").test(ler("src/index.css"))) problemas.push("H1 do index.css");
  if (!/\.dark h1\s*\{\s*color:\s*#[0-9A-F]{6}/i.test(ler("src/index.css"))) problemas.push("H1 sem cor própria no dark mode");
  if (!ler("scripts/check-homepage-h1-color.mjs").includes(`TARGET_COLOR = "${prim}"`)) problemas.push("check-homepage-h1-color");
  const computed = ler("scripts/check-homepage-h1-computed.mjs");
  if (!computed.includes(`PRIMARY_HEX = "${prim}"`) || !computed.includes(`PRIMARY_RGB = "${rgb}"`)) problemas.push("check-homepage-h1-computed");
  if (!ler("src/components/ColorSection.tsx").includes(`Cor primária <strong>${prim}</strong>`)) problemas.push("ColorSection sem a primária do briefing");
  if (/propriet/i.test(ler("src/pages/FundamentosPage.tsx"))) problemas.push("FundamentosPage cita fonte proprietária (todas são do Google Fonts)");
  if (!JSON.parse(ler("package.json")).devDependencies?.["@testing-library/dom"]) problemas.push("package.json sem @testing-library/dom");
  check("Cores, fontes e dependências seguem o briefing", problemas.length === 0, problemas.join("; "));
}

// ---------- Estilos visuais ----------
{
  const { listarEstilos, carregarEstilo } = await import("../skills/ds-build/scripts/lib/estilos.mjs");
  const erros = [];
  for (const id of listarEstilos()) {
    try { carregarEstilo(id); } catch (e) { erros.push(e.message.split("\n")[0]); }
  }
  check("Presets de estilo válidos", erros.length === 0, erros.length ? erros.join("; ") : `${listarEstilos().length} estilos`);
}

{
  // Regra do padrão: sem "estilo" no briefing = corporativo, byte a byte
  const corp = path.join(OUT, "verde-corporativo");
  const r = run("node", [GEN, "--brief", path.join(SKILL, "assets", "examples", "exemplo-verde.json"), "--out", corp, "--force", "--estilo", "corporativo"]);
  const hashes = (dir) => {
    const out = new Map();
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (["node_modules", "dist"].includes(e.name)) continue;
        const full = path.join(d, e.name);
        if (e.isDirectory()) { walk(full); continue; }
        let text = fs.readFileSync(full);
        if (e.name === "GERACAO.md") text = Buffer.from(text.toString("utf8").replace(/^Gerado em \S+/m, ""));
        out.set(path.relative(dir, full), text.toString("base64"));
      }
    })(dir);
    return out;
  };
  const a = hashes(verde), b = hashes(corp);
  const dif = [...new Set([...a.keys(), ...b.keys()])].filter((k) => a.get(k) !== b.get(k));
  check("Sem estilo = corporativo (byte a byte)", r.ok && dif.length === 0, dif.slice(0, 5).join(", "));
}

{
  // Estilo que não existe é pendência (o usuário respondeu algo); ausente não é
  const tmpBrief = path.join(OUT, "brief-estilo-invalido.json");
  const brief = JSON.parse(fs.readFileSync(path.join(SKILL, "assets", "examples", "exemplo-verde.json"), "utf8"));
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(tmpBrief, JSON.stringify({ ...brief, estilo: "art-deco" }));
  const r = run("node", [path.join(SKILL, "scripts", "validar-briefing.mjs"), tmpBrief]);
  check("Estilo inválido vira pendência", !r.ok && /estilo — resposta inválida/.test(r.out), r.ok ? "aceitou art-deco" : "");
}

{
  const r = run("node", [GEN, "--brief", path.join(SKILL, "assets", "examples", "exemplo-neobrutalismo.json"), "--out", path.join(OUT, "neobrutalismo"), "--force"]);
  const css = r.ok ? fs.readFileSync(path.join(OUT, "neobrutalismo", "src", "styles", "estilo.css"), "utf8") : "";
  check("Briefing com estilo (neobrutalismo)", r.ok && /estilo: neobrutalismo/.test(r.out) && css.includes("translate(-2px, -2px)"), r.ok ? "" : r.out.slice(0, 300));
}

if (args["node-modules"]) {
  const b = run("npm", ["run", "build"], verde);
  check("Build do DS gerado", b.ok, b.ok ? "" : b.out.split("\n").filter((l) => /error|❌/i.test(l)).slice(0, 5).join(" | "));
  const t = run("npx", ["vitest", "run"], verde);
  const m = /Tests\s+(?:\S+\s+)?(\d+) passed/.exec(t.out.replace(/\x1b\[[0-9;]*m/g, ""));
  check("Testes do DS gerado", t.ok, m ? `${m[1]} testes` : "");
}

console.log(falhas ? `\n${falhas} verificação(ões) falharam. Saídas em ${OUT}` : `\nTudo certo. Saídas em ${OUT}`);
process.exit(falhas ? 1 : 0);
