#!/usr/bin/env node
/**
 * Garante que todos os <h1> renderizados na Homepage herdam a cor
 * institucional #005EB8 definida globalmente em src/index.css.
 *
 * Estratégia (estática, sem runtime):
 *  1. Confirma que src/index.css contém a regra global `h1 { color: #005EB8 }`.
 *  2. Varre HomePage.tsx + componentes que ela usa (PageHeader em
 *     DSComponents.tsx) procurando tags <h1 ...> e falha se algum
 *     className contiver utilitário de cor que sobrescreva o padrão.
 *
 * Sai com código 1 em divergência — pronto para o pipeline de CI.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const TARGET_COLOR = "#005EB8";
const FILES = [
  "src/index.css",
  "src/pages/HomePage.tsx",
  "src/components/DSComponents.tsx",
];

const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const errors = [];

// 1. Regra global presente em index.css
const css = read("src/index.css").replace(/\s+/g, " ");
const hasGlobalRule = new RegExp(
  `h1\\s*{[^}]*color:\\s*${TARGET_COLOR}`,
  "i",
).test(css);
if (!hasGlobalRule) {
  errors.push(
    `src/index.css: regra global \`h1 { color: ${TARGET_COLOR} }\` não encontrada.`,
  );
}

// 2. Nenhum <h1> com classe de cor sobrescrevendo o padrão
const FORBIDDEN = [
  /\btext-white\b/,
  /\btext-black\b/,
  /\btext-foreground\b/,
  /\btext-muted(?:-foreground)?\b/,
  /\btext-primary(?:-foreground)?\b/,
  /\btext-secondary(?:-foreground)?\b/,
  /\btext-destructive(?:-foreground)?\b/,
  /\btext-accent(?:-foreground)?\b/,
  /\btext-\[[^\]]+\]/, // arbitrary text-[#...]
];

for (const file of FILES.filter((f) => f.endsWith(".tsx"))) {
  const src = read(file);
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    const match = line.match(/<h1\b[^>]*className=(?:"([^"]*)"|{`([^`]*)`})/);
    if (!match) return;
    const classes = match[1] ?? match[2] ?? "";
    for (const rx of FORBIDDEN) {
      if (rx.test(classes)) {
        errors.push(
          `${file}:${i + 1} — <h1> usa classe que sobrescreve a cor global (${rx}): "${classes}"`,
        );
      }
    }
  });
}

if (errors.length) {
  console.error("\n✗ Homepage H1 color check FAILED:\n");
  for (const e of errors) console.error("  - " + e);
  console.error(`\nEsperado: todos os <h1> herdarem ${TARGET_COLOR}.\n`);
  process.exit(1);
}

console.log(`✓ Homepage H1 color check OK (${TARGET_COLOR}).`);