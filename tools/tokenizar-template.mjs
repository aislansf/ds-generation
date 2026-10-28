#!/usr/bin/env node
/**
 * tokenizar-template.mjs — aplica a Fase 1 dos estilos visuais (tokens de pele e ganchos) a um template.
 *
 * Uso:
 *   node tools/tokenizar-template.mjs [--template <pasta>]   (padrão: skills/ds-build/assets/template)
 *
 * A extração (tools/extract-template.mjs) já roda este patch no fim; este comando serve para aplicá-lo
 * ao template versionado sem reextrair. Idempotente: rodar de novo não muda nada.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokenizar } from "./lib/tokenizar.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const i = process.argv.indexOf("--template");
const dir = path.resolve(i > 0 ? process.argv[i + 1] : path.join(ROOT, "skills", "ds-build", "assets", "template"));

const r = tokenizar(dir);
console.log(`Tokenização de ${path.relative(process.cwd(), dir) || "."}: ${r.aplicadas.length} edição(ões), ${r.jaAplicadas} já aplicada(s)`);
for (const a of r.aplicadas) console.log(`  + ${a}`);
if (r.faltando.length) {
  console.log(`  âncoras que não casaram (${r.faltando.length}):\n    ${r.faltando.join("\n    ")}`);
  process.exit(1);
}
