#!/usr/bin/env node
/**
 * Verificação de regressão do gerador. Rode antes de publicar uma nova versão da skill.
 *
 * Uso:
 *   node tools/verificar.mjs [--source <ds-sebrae>/frontend] [--node-modules <pasta>]
 *
 *   --source        reextrai o template a partir do DS de origem antes de testar
 *   --node-modules  também roda build + testes no DS gerado (junction para esse node_modules)
 *
 * Checagens:
 *   1. (com --source) extração sem remanescentes da marca de origem
 *   2. ida e volta: gerar com o briefing de origem não altera nenhuma cor (hex=0 hsl=0)
 *   3. marca de teste: sem marcas proibidas nem placeholders não resolvidos
 *   4. (com --node-modules) npm run build e vitest passam no DS da marca de teste
 */
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = path.join(ROOT, "skills", "ds-generator");
const OUT = path.join(os.tmpdir(), "ds-generation-verificar");

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args[a.slice(2)] = process.argv[i + 1]?.startsWith("--") ? true : process.argv[++i] ?? true;
}

let falhas = 0;
function run(cmd, argv, cwd = SKILL) {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8", shell: process.platform === "win32" && (cmd === "npm" || cmd === "npx") });
  return { ok: r.status === 0, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "✅" : "❌"} ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  if (!ok) falhas++;
}

if (args.source) {
  const r = run("node", ["scripts/extract-template.mjs", "--source", path.resolve(args.source)]);
  const m = /remanescentes de "[^"]+": (\d+)/.exec(r.out);
  check("Extração do template", r.ok && m?.[1] === "0", m ? `${m[1]} remanescente(s)` : r.out.slice(0, 300));
}

{
  const r = run("node", ["scripts/generate-ds.mjs", "--brief", "assets/examples/sebrae-ce.json", "--out", path.join(OUT, "sebrae"), "--force"]);
  const m = /hex=(\d+) hsl=(\d+)/.exec(r.out);
  check("Ida e volta (origem → origem)", r.ok && m?.[1] === "0" && m?.[2] === "0", m ? `hex=${m[1]} hsl=${m[2]}` : r.out.slice(0, 300));
}

const verde = path.join(OUT, "verde");
{
  const argv = ["scripts/generate-ds.mjs", "--brief", "assets/examples/exemplo-verde.json", "--out", verde, "--force"];
  if (args["node-modules"]) argv.push("--node-modules", path.resolve(args["node-modules"]));
  const r = run("node", argv);
  const proib = /marcas proibidas: (\d+)/.exec(r.out)?.[1];
  const ph = /placeholders: (\d+)/.exec(r.out)?.[1];
  check("Geração da marca de teste", r.ok && proib === "0" && ph === "0", `marcas proibidas=${proib} placeholders=${ph}`);
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
