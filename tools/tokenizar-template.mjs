#!/usr/bin/env node
/**
 * tokenizar-template.mjs — aplica a Fase 1 dos estilos visuais (tokens de pele e ganchos) a um template.
 *
 * Uso:
 *   node tools/tokenizar-template.mjs [--template <pasta>] [--relatorio <arquivo.md>]
 *
 *   --template   pasta do template (padrão: skills/ds-build/assets/template)
 *   --relatorio  grava o relatório dos ganchos nos elementos montados à mão: o que casou, por gancho e por
 *                arquivo, e a lista de revisão do que ficou de fora (padrão: só o resumo no terminal)
 *
 * A extração (tools/extract-template.mjs) já roda este patch no fim; este comando serve para aplicá-lo
 * ao template versionado sem reextrair. Idempotente: rodar de novo não muda nada.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokenizar } from "./lib/tokenizar.mjs";
import { contarGanchos } from "./lib/ganchos.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (nome) => { const i = process.argv.indexOf(`--${nome}`); return i > 0 ? process.argv[i + 1] : null; };
const dir = path.resolve(arg("template") ?? path.join(ROOT, "skills", "ds-build", "assets", "template"));

const r = tokenizar(dir);
console.log(`Tokenização de ${path.relative(process.cwd(), dir) || "."}: ${r.aplicadas.length} edição(ões), ${r.jaAplicadas} já aplicada(s)`);
for (const a of r.aplicadas) console.log(`  + ${a}`);

// Cobertura: elementos com data-ds em todo o src (componentes, páginas e templates), depois do patch
const cobertura = {};
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== "__tests__") walk(f); continue; }
    if (!e.name.endsWith(".tsx") || /\.(test|spec)\.tsx$/.test(e.name)) continue;
    for (const [k, n] of Object.entries(contarGanchos(fs.readFileSync(f, "utf8")))) cobertura[k] = (cobertura[k] ?? 0) + n;
  }
})(path.join(dir, "src"));

const { casou, revisar, ignorados } = r.ganchos;
const conta = (lista, chave) => lista.reduce((m, x) => { const k = chave(x); m[k] = (m[k] ?? 0) + 1; return m; }, {});
const porGancho = conta(casou, (c) => (c.variante ? `${c.ds} (${c.variante})` : c.ds));
const porMotivo = conta(revisar, (x) => `<${x.tag}>: ${x.motivo}`);
const porIgnorado = conta(ignorados, (x) => `<${x.tag}>: ${x.motivo}`);
const linhas = (m) => Object.entries(m).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
console.log(`  ganchos novos nos elementos montados à mão: ${casou.length}; para revisão: ${revisar.length}; fora do escopo de propósito: ${ignorados.length}`);
console.log(`  elementos com data-ds no template: ${Object.values(cobertura).reduce((a, b) => a + b, 0)} (${linhas(cobertura).map(([k, n]) => `${k} ${n}`).join(", ")})`);

if (arg("relatorio")) {
  const md = `# Ganchos data-ds nos elementos montados à mão

Relatório gerado por \`node tools/tokenizar-template.mjs --relatorio\` (codemod de \`tools/lib/ganchos.mjs\`, R1 de \`docs/PLANO-ESTILOS.md\`).
Os elementos da lista de revisão não ganharam gancho: o padrão de classes não decide sozinho o que eles são.
Os "fora do escopo" também não, mas de propósito: a camada CSS dos estilos não tem o que pintar neles (item de menu lateral, fundo do menu móvel, barra com bg-card, campo dentro de um contêiner com borda, botão só de layout).
Para cobrir um elemento, ajuste as regras de \`tools/lib/ganchos.mjs\` (nunca o template à mão) e rode de novo.

## Elementos com data-ds no template

| Gancho | Elementos |
|---|---|
${linhas(cobertura).map(([k, n]) => `| \`${k}\` | ${n} |`).join("\n")}

## Ganchos acrescentados nesta execução (${casou.length})

| Gancho (variante) | Elementos |
|---|---|
${linhas(porGancho).map(([k, n]) => `| ${k} | ${n} |`).join("\n") || "| — | 0 |"}

## Fora do escopo, de propósito (${ignorados.length})

| Motivo | Elementos |
|---|---|
${linhas(porIgnorado).map(([k, n]) => `| ${k.replace(/</g, "\\<")} | ${n} |`).join("\n") || "| — | 0 |"}

## Lista de revisão (${revisar.length})

| Motivo | Elementos |
|---|---|
${linhas(porMotivo).map(([k, n]) => `| ${k.replace(/</g, "\\<")} | ${n} |`).join("\n") || "| — | 0 |"}

| Arquivo | Elemento | Motivo | Classes |
|---|---|---|---|
${revisar.map((x) => `| \`${x.arquivo}:${x.linha}\` | \`<${x.tag}>\` | ${x.motivo} | \`${x.classes.replace(/\|/g, "\\|") || "—"}\` |`).join("\n")}
`;
  fs.writeFileSync(path.resolve(arg("relatorio")), md);
  console.log(`  relatório: ${arg("relatorio")}`);
}

if (r.faltando.length) {
  console.log(`  âncoras que não casaram (${r.faltando.length}):\n    ${r.faltando.join("\n    ")}`);
  process.exit(1);
}
