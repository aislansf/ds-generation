// Testes da Fase 6: catálogo de estilos, recaptura de miniaturas e seção "Estilo visual" do DS.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { SECAO_NOVOS, SECAO_TROCAS } from "../lib/estilo-secao.mjs";
import { tokenizar } from "../lib/tokenizar.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCRIPTS = path.join(ROOT, "skills/ds-build/scripts");
const TEMPLATE = path.join(ROOT, "skills/ds-build/assets/template");
const node = (script, argv) => spawnSync(process.execPath, [path.join(SCRIPTS, script), ...argv], { encoding: "utf8" });
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "fase6-"));

test("catalogo-estilos: uma página só, com iframe por estilo e a decoração embutida", () => {
  const dir = tmp();
  try {
    const out = path.join(dir, "catalogo.html");
    const r = node("catalogo-estilos.mjs", ["--out", out, "--estilos", "corporativo,neobrutalismo,grunge"]);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    const html = fs.readFileSync(out, "utf8");
    assert.equal((html.match(/<iframe /g) ?? []).length, 3);
    // Autocontido: a decoração do grunge (public/estilo/*.svg) vira data URI, e nada aponta para o servidor do DS
    assert.ok(html.includes("data:image/svg+xml;base64,"));
    assert.ok(!/url\((&quot;|["']?)\/estilo\//.test(html));
    // A camada CSS do estilo e o gancho que ela usa vão no iframe
    assert.ok(html.includes("translate(-2px, -2px)"));
    assert.ok(html.includes('data-ds=&quot;button&quot;'));
    assert.ok(r.stdout.includes("Ousados: Neobrutalismo (neobrutalismo), Grunge (grunge)"));
    assert.ok(r.stdout.includes("cor primária"), "avisa que usou a marca de exemplo");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("catalogo-estilos: usa as cores válidas do briefing, mesmo incompleto, e ignora o resto", () => {
  const dir = tmp();
  try {
    const brief = path.join(dir, "briefing.json");
    // Pergunta 13 vem antes das cores: o briefing ainda tem PREENCHER e uma cor inválida
    fs.writeFileSync(brief, JSON.stringify({ nome: "Estúdio Teste", cores: { primaria: "#7C3AED", secundaria: "PREENCHER", destaque: "#12" }, estilo: "PREENCHER" }));
    const out = path.join(dir, "catalogo.html");
    const r = node("catalogo-estilos.mjs", ["--brief", brief, "--out", out, "--estilos", "flat"]);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    const html = fs.readFileSync(out, "utf8");
    assert.ok(html.includes("Estúdio Teste"));
    assert.ok(!r.stdout.includes("cor primária"), "a primária do briefing é válida");
    // violeta (matiz 262): a primária do exemplo (verde, 155) não pode aparecer nos tokens
    assert.match(html, /--primary:\s*26\d /);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("catalogo-estilos recusa estilo inexistente e saída ausente", () => {
  assert.equal(node("catalogo-estilos.mjs", []).status, 1);
  const r = node("catalogo-estilos.mjs", ["--out", path.join(os.tmpdir(), "x.html"), "--estilos", "nao-existe"]);
  assert.equal(r.status, 1);
  assert.ok(r.stderr.includes("nao-existe"));
});

test("capturar-miniaturas recusa pasta que não é um DS gerado e miniatura desconhecida", () => {
  assert.equal(node("capturar-miniaturas.mjs", []).status, 1);
  const dir = tmp();
  try {
    const r = node("capturar-miniaturas.mjs", ["--ds", dir]);
    assert.equal(r.status, 1);
    assert.ok(r.stderr.includes("não parece um DS gerado"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a seção Estilo visual está no template e o patch é idempotente", () => {
  const r = tokenizar(TEMPLATE);
  assert.deepEqual(r.aplicadas, [], "o template versionado já tem todas as trocas");
  assert.deepEqual(r.faltando, []);
  for (const [rel, conteudo] of SECAO_NOVOS) assert.equal(fs.readFileSync(path.join(TEMPLATE, rel), "utf8"), conteudo, rel);
  const pagina = fs.readFileSync(path.join(TEMPLATE, "src/pages/FundamentosPage.tsx"), "utf8");
  assert.ok(pagina.includes("<EstiloVisualSection />"));
  assert.ok(pagina.indexOf("<EstiloVisualSection />") < pagina.indexOf('id="elevacao"'));
  assert.ok(SECAO_TROCAS.length >= 4);
});

test("a seção some no corporativo: o componente devolve null e o menu só ganha o item nos outros estilos", () => {
  const componente = fs.readFileSync(path.join(TEMPLATE, "src/components/EstiloVisualSection.tsx"), "utf8");
  assert.match(componente, /\(ESTILO\.id as string\) === "corporativo"\) return null/);
  const menu = fs.readFileSync(path.join(TEMPLATE, "src/components/DSLayout.tsx"), "utf8");
  assert.match(menu, /\(ESTILO\.id as string\) !== "corporativo" \? \[\{ label: "Estilo visual"/);
});
