#!/usr/bin/env node
/**
 * extract-template.mjs — transforma o DS de origem (ex.: frontend/ do ds-sebrae)
 * em um template neutro com placeholders, dentro de assets/template/.
 *
 * Uso:
 *   node scripts/extract-template.mjs --source <pasta-frontend> [--brief assets/examples/sebrae-ce.json] [--out assets/template]
 *
 * O que faz:
 *   1. Copia a pasta de origem (sem node_modules, dist, lockfiles bun e itens de "origem.excluir").
 *   2. Renomeia arquivos com o prefixo da marca (sebrae-cor.svg → brand-cor.svg, SebraeLogo.tsx → BrandLogo.tsx).
 *   3. Aplica as regras de texto (domínios, nomes, fontes, identificadores) → placeholders __X__.
 *   4. Troca o cabeçalho de fontes do index.css pelo marcador de imports.
 *   5. Aplica assets/overrides/ por cima e grava template.manifest.json (famílias de cor de origem etc.).
 *   6. Relata ocorrências remanescentes da marca de origem (devem ser só termos_especificos).
 *
 * As cores NÃO viram placeholder: o template guarda as cores de origem e o gerador
 * recolore por família de matiz (ver lib/color.mjs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { buildExtractionRules, buildPathRules, applyRules, PLACEHOLDERS } from "./lib/rules.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.resolve(HERE, "..");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") ? true : all[i + 1] ?? true]);
    return acc;
  }, []),
);
if (!args.source) {
  console.error("Uso: node extract-template.mjs --source <pasta-frontend> [--brief <json>] [--out <pasta>]");
  process.exit(1);
}

const SOURCE = path.resolve(args.source);
const BRIEF_PATH = path.resolve(args.brief ?? path.join(SKILL, "assets/examples/sebrae-ce.json"));
const OUT = path.resolve(args.out ?? path.join(SKILL, "assets/template"));
const brief = JSON.parse(fs.readFileSync(BRIEF_PATH, "utf8"));
if (!brief.origem) throw new Error(`O briefing ${BRIEF_PATH} não tem o bloco "origem".`);

const TEXT_EXT = /\.(tsx?|jsx?|mjs|cjs|css|scss|html?|json|md|txt|xml|svg|ya?ml|toml)$/i;
const SKIP_TEXT_RULES = (rel) =>
  rel.endsWith(".asset.json") || rel === "package-lock.json" || /(^|\/)marca\/[^/]+\.svg$/.test(rel) || /logo[^/]*\.svg$/.test(rel);

// Globs simples de exclusão: "public/images/fnde-*" ou nomes de pasta/arquivo
const excl = (brief.origem.excluir ?? []).map((g) => new RegExp("^" + g.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*") + "(/|$)"));
const isExcluded = (rel) => excl.some((re) => re.test(rel) || re.test(path.basename(rel)));

const textRules = buildExtractionRules(brief);
const pathRules = buildPathRules(brief);
const stats = {};

if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(SOURCE, full).split(path.sep).join("/");
    if (isExcluded(rel)) continue;
    if (entry.isDirectory()) walk(full);
    else files.push(rel);
  }
})(SOURCE);

const renamed = [];
for (const rel of files) {
  const newRel = applyRules(rel, pathRules);
  if (newRel !== rel) renamed.push(`${rel} → ${newRel}`);
  const dest = path.join(OUT, newRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (TEXT_EXT.test(rel) && !SKIP_TEXT_RULES(rel)) {
    let text = fs.readFileSync(path.join(SOURCE, rel), "utf8");
    if (rel === "src/index.css") {
      // Cabeçalho de fontes (comentário + @import + @font-face) → marcador único
      const idx = text.indexOf("@tailwind base;");
      if (idx > 0) text = `${PLACEHOLDERS.FONT_IMPORTS}\n\n${text.slice(idx)}`;
    }
    text = applyRules(text, textRules, stats);
    fs.writeFileSync(dest, text);
  } else {
    fs.copyFileSync(path.join(SOURCE, rel), dest);
  }
}

// Overrides: arquivos do template que precisam de versão própria (README, check-legacy-brand…)
const OVERRIDES = path.join(SKILL, "assets/overrides");
let overrides = 0;
if (fs.existsSync(OVERRIDES)) {
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      const rel = path.relative(OVERRIDES, full);
      fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
      fs.copyFileSync(full, path.join(OUT, rel));
      overrides++;
    }
  })(OVERRIDES);
}

const manifest = {
  gerado_em: new Date().toISOString(),
  origem: {
    pasta: `${path.basename(path.dirname(SOURCE))}/${path.basename(SOURCE)}`,
    commit: (() => {
      try {
        return execSync("git log -1 --format=%h%x20%cs -- .", { cwd: SOURCE, stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null;
      } catch {
        return null;
      }
    })(),
    briefing: path.relative(SKILL, BRIEF_PATH).split(path.sep).join("/"),
    nome: brief.nome,
    prefixo_codigo: brief.origem.prefixo_codigo,
    termos: [brief.origem.prefixo_codigo, brief.nome_curto, brief.nome, ...(brief.origem.variantes_nome ?? [])].filter(Boolean),
    termos_especificos: brief.origem.termos_especificos ?? [],
  },
  familias: brief.origem.familias,
  placeholders: Object.values(PLACEHOLDERS),
  arquivos: files.length,
};
fs.writeFileSync(path.join(OUT, "template.manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

// Remanescentes da marca de origem (útil para ajustar regras)
const leftoverRe = new RegExp(brief.origem.prefixo_codigo, "i");
const leftovers = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(OUT, full).split(path.sep).join("/");
    if (entry.isDirectory()) { walk(full); continue; }
    if (!TEXT_EXT.test(rel) || SKIP_TEXT_RULES(rel) || rel === "template.manifest.json") continue;
    fs.readFileSync(full, "utf8").split("\n").forEach((line, i) => {
      if (leftoverRe.test(line)) leftovers.push(`${rel}:${i + 1}: ${line.trim().slice(0, 140)}`);
    });
  }
})(OUT);

console.log(`Template gerado em ${path.relative(process.cwd(), OUT) || "."}`);
console.log(`  arquivos: ${files.length} | renomeados: ${renamed.length} | overrides: ${overrides}`);
console.log(`  substituições: ${Object.entries(stats).map(([k, v]) => `${k}=${v}`).join(", ")}`);
if (renamed.length) console.log("  renomeados:\n    " + renamed.join("\n    "));
console.log(`  remanescentes de "${brief.origem.prefixo_codigo}": ${leftovers.length}`);
if (leftovers.length) console.log("    " + leftovers.slice(0, 60).join("\n    "));
