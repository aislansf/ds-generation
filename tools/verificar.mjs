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
 *   6. (com --node-modules) npm run build e vitest passam no DS da marca de teste
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { residualMatchers } from "./lib/regras-extracao.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = path.join(ROOT, "skills", "ds-generator");
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
  const matchers = residualMatchers(JSON.parse(fs.readFileSync(ORIGEM, "utf8")));
  const hits = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", "dist"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!/\.(tsx?|jsx?|mjs|css|html?|json|md|txt|xml|svg)$/i.test(entry.name) || entry.name === "package-lock.json") continue;
      const text = fs.readFileSync(full, "utf8");
      for (const m of matchers) if (m.re.test(text)) hits.push(`${path.relative(verde, full)} [${m.termo}]`);
    }
  })(verde);
  check("Nenhum termo da origem no DS gerado", hits.length === 0, hits.slice(0, 5).join(", "));
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
