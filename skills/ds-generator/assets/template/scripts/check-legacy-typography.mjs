#!/usr/bin/env node
/**
 * check-legacy-typography.mjs
 * Varre src/ procurando <p> que ainda usam classes tipográficas antigas
 * (text-xs|sm|base|lg|xl|2xl|leading-*) e NÃO aplicam um dos tokens do DS:
 *   .ds-body-lead | .ds-body | .ds-body-small
 *
 * Saída:
 *   - Console: tabela com arquivo:linha + trecho.
 *   - reports/legacy-typography-report.txt
 *
 * Modo baseline:
 *   --update-baseline grava reports/legacy-typography-baseline.json com o
 *   total atual. Em execuções seguintes o script falha apenas se o número
 *   de ocorrências ULTRAPASSAR o baseline (regressão).
 *
 * Exit code: 1 se houver regressão (ou se não houver baseline e existirem
 * ocorrências em modo --strict), 0 caso contrário.
 */
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(process.cwd(), "src");
const OUT_DIR = join(process.cwd(), "reports");
const OUT_FILE = join(OUT_DIR, "legacy-typography-report.txt");
const BASELINE_FILE = join(OUT_DIR, "legacy-typography-baseline.json");
const ARGS = new Set(process.argv.slice(2));

const EXT = /\.(tsx?|jsx?)$/;
const LEGACY = /\b(text-(?:xs|sm|base|lg|xl|2xl|3xl)|leading-(?:none|tight|snug|normal|relaxed|loose|3|4|5|6|7|8|9|10))\b/;
const DS_TOKEN = /\bds-body(?:-lead|-small)?\b/;
const P_TAG = /<p\b[^>]*>/g;

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (/node_modules|__tests__|\.test\./.test(full)) continue;
      walk(full, acc);
    } else if (EXT.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

const hits = [];
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const matches = line.match(P_TAG);
    if (!matches) return;
    for (const m of matches) {
      if (LEGACY.test(m) && !DS_TOKEN.test(m)) {
        hits.push({ file: relative(process.cwd(), file), line: i + 1, snippet: line.trim() });
      }
    }
  });
}

mkdirSync(OUT_DIR, { recursive: true });
const header = `Relatório de tipografia legada — ${new Date().toISOString()}\nTotal: ${hits.length} ocorrências\n${"=".repeat(72)}\n`;
const body = hits.map(h => `${h.file}:${h.line}\n  ${h.snippet}`).join("\n\n");
writeFileSync(OUT_FILE, header + body + "\n");

if (ARGS.has("--update-baseline")) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ count: hits.length, updatedAt: new Date().toISOString() }, null, 2) + "\n");
  console.log(`✓ Baseline atualizado: ${hits.length} ocorrência(s).`);
  process.exit(0);
}

const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, "utf8")).count : 0;

if (hits.length === 0) {
  console.log("✓ Nenhum <p> com tipografia legada sem token DS encontrado.");
  process.exit(0);
}

if (hits.length <= baseline) {
  console.log(`✓ ${hits.length} ocorrência(s) — dentro do baseline (${baseline}). Relatório: ${relative(process.cwd(), OUT_FILE)}`);
  process.exit(0);
}

console.log(`✗ Regressão: ${hits.length} ocorrência(s), baseline = ${baseline}.`);
console.log(`Novas amostras:`);
for (const h of hits.slice(0, 20)) console.log(`  ${h.file}:${h.line}  ${h.snippet.slice(0, 120)}`);
console.log(`\nRelatório completo: ${relative(process.cwd(), OUT_FILE)}`);
console.log(`Para aceitar o novo total como baseline: npm run check:legacy-typography -- --update-baseline`);
process.exit(1);