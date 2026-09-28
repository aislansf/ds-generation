#!/usr/bin/env node
/**
 * extract-template.mjs — transforma o DS de origem em um template neutro com placeholders,
 * gravado em skills/ds-build/assets/template/. Ferramenta de manutenção: não faz parte da skill instalada.
 *
 * Uso:
 *   node tools/extract-template.mjs --source <pasta-frontend> [--brief origem/ds-sebrae.json] [--out <pasta>]
 *
 * O que faz:
 *   1. Copia a pasta de origem (sem node_modules, dist, lockfiles bun e itens de "origem.excluir").
 *   2. Renomeia arquivos (prefixo da marca → brand, "origem.substituicoes_caminho").
 *   3. Aplica as regras de texto (conteúdo da origem, domínios, nomes, fontes, identificadores) → placeholders __X__.
 *   4. Troca o cabeçalho de fontes do index.css pelo marcador de imports.
 *   5. Reescreve os .asset.json (ponteiros para o CDN do projeto de origem) como ponteiros locais neutros.
 *   6. Aplica origem/overrides/ por cima (logos neutros, imagens genéricas, README…) e grava template.manifest.json.
 *   7. Falha (exit 1) se sobrar qualquer termo da origem (nome, marcas proibidas, termos_especificos).
 *
 * As cores NÃO viram placeholder: o template guarda as cores de origem e o gerador
 * recolore por família de matiz (ver skills/ds-build/scripts/lib/color.mjs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { PLACEHOLDERS } from "../skills/ds-build/scripts/lib/rules.mjs";
import { buildExtractionRules, buildPathRules, applyRules, residualMatchers } from "./lib/regras-extracao.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = path.join(ROOT, "skills", "ds-build");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") ? true : all[i + 1] ?? true]);
    return acc;
  }, []),
);
if (!args.source) {
  console.error("Uso: node tools/extract-template.mjs --source <pasta-frontend> [--brief <json>] [--out <pasta>]");
  process.exit(1);
}

const SOURCE = path.resolve(args.source);
const BRIEF_PATH = path.resolve(args.brief ?? path.join(ROOT, "origem", "ds-sebrae.json"));
const OUT = path.resolve(args.out ?? path.join(SKILL, "assets", "template"));
const OVERRIDES = path.join(path.dirname(BRIEF_PATH), "overrides");
const brief = JSON.parse(fs.readFileSync(BRIEF_PATH, "utf8"));
if (!brief.origem) throw new Error(`O briefing ${BRIEF_PATH} não tem o bloco "origem".`);

const TEXT_EXT = /\.(tsx?|jsx?|mjs|cjs|css|scss|html?|json|md|txt|xml|svg|ya?ml|toml)$/i;
const SKIP_TEXT_RULES = (rel) =>
  rel.endsWith(".asset.json") || rel === "package-lock.json" || /(^|\/)marca\/[^/]+\.svg$/.test(rel) || /logo[^/]*\.svg$/.test(rel);

// Globs simples de exclusão: "public/images/marca-antiga-*" ou nomes de pasta/arquivo
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
  if (rel.endsWith(".asset.json")) {
    // Ponteiro para o CDN do projeto de origem (nome de arquivo e IDs da origem) → ponteiro local neutro.
    // O gerador troca todos eles de novo: logos por /marca/*.svg, o resto por placeholders locais.
    const meta = JSON.parse(fs.readFileSync(path.join(SOURCE, rel), "utf8"));
    const base = path.basename(newRel).replace(/\.asset\.json$/, "");
    const neutral = { version: 1, url: `/placeholders/${base.replace(/\.[a-z0-9]+$/i, "")}.svg`, original_filename: base, content_type: meta.content_type ?? "image/svg+xml" };
    fs.writeFileSync(dest, JSON.stringify(neutral, null, 2) + "\n");
  } else if (TEXT_EXT.test(rel) && !SKIP_TEXT_RULES(rel)) {
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

// Overrides: arquivos do template que precisam de versão própria (logos neutros, imagens genéricas, README…)
const overridden = new Set();
if (fs.existsSync(OVERRIDES)) {
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      const rel = path.relative(OVERRIDES, full);
      fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
      fs.copyFileSync(full, path.join(OUT, rel));
      overridden.add(rel.split(path.sep).join("/"));
    }
  })(OVERRIDES);
}
const overrides = overridden.size;

// Arquivos de código trocados inteiros por versões neutras: se a origem mudou desde a versão neutra,
// a mudança não chegaria ao template sem ninguém perceber. O hash registrado obriga a revisar.
const codeOverrideDrift = [];
for (const [rel, hash] of Object.entries(brief.origem.overrides_de_codigo ?? {})) {
  const src = path.join(SOURCE, rel);
  const atual = fs.existsSync(src) ? createHash("sha256").update(fs.readFileSync(src)).digest("hex").slice(0, 16) : "ausente";
  if (!overridden.has(rel)) codeOverrideDrift.push(`${rel}: falta a versão neutra em origem/overrides/${rel}`);
  else if (atual !== hash) {
    codeOverrideDrift.push(`${rel}: mudou na origem (hash ${atual}, registrado ${hash}). Leve a mudança para origem/overrides/${rel} e atualize "overrides_de_codigo"`);
  }
}

// O manifesto vai junto com a skill: só dados neutros (cores de origem, exemplos genéricos), nenhum nome da origem.
const manifest = {
  gerado_em: new Date().toISOString(),
  origem: {
    commit: (() => {
      try {
        return execSync("git log -1 --format=%h%x20%cs -- .", { cwd: SOURCE, stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null;
      } catch {
        return null;
      }
    })(),
    conteudo_exemplo: brief.origem.conteudo_exemplo ?? [],
  },
  familias: brief.origem.familias,
  placeholders: Object.values(PLACEHOLDERS),
  arquivos: files.length,
};
fs.writeFileSync(path.join(OUT, "template.manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

// Remanescentes da marca de origem: texto, nomes de arquivo e imagens copiadas sem revisão
const matchers = residualMatchers(brief);
const revisadas = new Set(brief.origem.imagens_revisadas ?? []);
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|ico|svg|avif)$/i;
const leftovers = [...codeOverrideDrift];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(OUT, full).split(path.sep).join("/");
    for (const m of matchers) if (m.re.test(entry.name)) leftovers.push(`${rel}: nome de arquivo contém "${m.termo}"`);
    if (entry.isDirectory()) { walk(full); continue; }
    // Imagens podem mostrar logos e fachadas da origem: só passam as de origem/overrides/ ou as revisadas como genéricas
    if (IMAGE_EXT.test(rel) && !overridden.has(rel) && !revisadas.has(rel)) {
      leftovers.push(`${rel}: imagem da origem sem revisão (adicione uma versão genérica em origem/overrides/ ou revise e liste em "imagens_revisadas")`);
    }
    if (!TEXT_EXT.test(rel) || rel === "package-lock.json") continue;
    fs.readFileSync(full, "utf8").split("\n").forEach((line, i) => {
      for (const m of matchers) if (m.re.test(line)) leftovers.push(`${rel}:${i + 1}: [${m.termo}] ${line.trim().slice(0, 120)}`);
    });
  }
})(OUT);

console.log(`Template gerado em ${path.relative(process.cwd(), OUT) || "."}`);
console.log(`  arquivos: ${files.length} | renomeados: ${renamed.length} | overrides: ${overrides}`);
console.log(`  substituições: ${Object.entries(stats).map(([k, v]) => `${k}=${v}`).join(", ")}`);
if (renamed.length) console.log("  renomeados:\n    " + renamed.join("\n    "));
console.log(`  remanescentes da origem: ${leftovers.length}`);
if (leftovers.length) {
  console.log("    " + leftovers.slice(0, 80).join("\n    ") + (leftovers.length > 80 ? `\n    … e mais ${leftovers.length - 80}` : ""));
  process.exit(1);
}
