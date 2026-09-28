#!/usr/bin/env node
/**
 * Audita o contraste WCAG dos pares de tokens (texto × fundo) em light e dark.
 *
 * Uso:
 *   node scripts/validar-contraste.mjs <caminho/para/src/index.css> [--strict]
 *
 * --strict: sai com código 1 se algum par ficar abaixo de 4.5:1 (AA para texto normal).
 */
import fs from "node:fs";
import { auditContrast, contrastTable } from "./lib/contrast.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node validar-contraste.mjs <src/index.css> [--strict]");
  process.exit(1);
}
const rows = auditContrast(fs.readFileSync(file, "utf8"));
console.log(contrastTable(rows));
const falhas = rows.filter((r) => r.ratio < 4.5);
console.log(`\n${rows.length} pares avaliados · ${falhas.length} abaixo de AA (4.5:1)`);
if (falhas.length && process.argv.includes("--strict")) process.exit(1);
