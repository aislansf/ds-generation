// Testes unitários do motor de estilos (skills/ds-build/scripts/lib/estilos.mjs), seção 10.4 do plano.
// Rodam com o test runner do Node, sem dependências: npm test (ou node --test "tools/testes/*.test.mjs").
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  listarEstilos, carregarEstilo, validarPreset, corNeon, resolverValor, definirVar, lerVar,
  aplicarEstilo, contrasteDoEstilo, ESTILO_PADRAO,
} from "../../skills/ds-build/scripts/lib/estilos.mjs";
import { contrastRatio, hslToRgb, parseTriplet } from "../../skills/ds-build/scripts/lib/color.mjs";

const CORES = {
  primaria: { h: 150, s: 60, l: 30 },
  secundaria: { h: 40, s: 90, l: 50 },
  destaque: { h: 200, s: 30, l: 80 },
  realce: { h: 340, s: 70, l: 45 },
};

const CSS = `@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 9%;
    --input: 220 13% 91%;
    --input-hover: 220 13% 80%;
    /* --border: 1 1% 1%; */
    --border: 220 13% 91%;
    --brand-header-grad-start: 150 60% 30%;
    --brand-header-grad-end: 200 60% 40%;
    --shadow-ui: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --input: 217 33% 18%;
  }
}
`;

function fixture(css = CSS) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-estilos-teste-"));
  fs.mkdirSync(path.join(dir, "src/config"), { recursive: true });
  fs.mkdirSync(path.join(dir, "src/styles"), { recursive: true });
  fs.writeFileSync(path.join(dir, "src/index.css"), css);
  fs.writeFileSync(path.join(dir, "src/styles/estilo.css"), "/* vazio */\n");
  fs.writeFileSync(path.join(dir, "src/config/estilo.ts"), `export const ESTILO = {\n  id: "corporativo",\n  nome: "Corporativo",\n  temaPadrao: "light",\n  layout: "padrao",\n} as const;\n`);
  fs.writeFileSync(path.join(dir, "index.html"), `<script>\n  var padrao = "light";\n</script>\n`);
  return { dir, ler: (rel) => fs.readFileSync(path.join(dir, rel), "utf8"), limpar: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

const preset = (extra) => ({
  id: "teste", nome: "Teste", grupo: "limpos", nivel: 1, ordem: 99, descricao: "Preset de teste.",
  tema_padrao: "light", layout: "padrao", degrade: true, fontes_sugeridas: {}, faca: [], evite: [], tokens: {}, ...extra,
});

// ---------- Presets ----------

test("todos os presets do catálogo são válidos e o padrão é o corporativo, sem tokens", () => {
  const ids = listarEstilos();
  assert.ok(ids.length >= 12);
  assert.equal(ids[0], ESTILO_PADRAO);
  for (const id of ids) assert.equal(carregarEstilo(id).id, id);
  assert.deepEqual(carregarEstilo(ESTILO_PADRAO).tokens, {});
});

test("validarPreset recusa tokens da marca, cores semânticas, seletores e valores inválidos", () => {
  const erros = validarPreset(preset({
    tokens: {
      ":root": { "--brand-primary-500": "0 0% 0%", "--success": "0 0% 0%", "--radius": "1rem; color: red", "--border": "" },
      "body": { "--radius": "0" },
    },
  }));
  assert.ok(erros.some((e) => e.includes("--brand-primary-500")));
  assert.ok(erros.some((e) => e.includes("--success")));
  assert.ok(erros.some((e) => e.includes("--radius: valor inválido")));
  assert.ok(erros.some((e) => e.includes("--border: valor inválido")));
  assert.ok(erros.some((e) => e.includes("seletor não permitido em tokens: body")));
});

test("validarPreset aceita expressões de cor nos valores e recusa chaves soltas", () => {
  assert.deepEqual(validarPreset(preset({ tokens: { ":root": { "--border": "{primaria.h} 10% 90%", "--ring": "{neon}" } } })), []);
  assert.ok(validarPreset(preset({ tokens: { ":root": { "--border": "{outra} 10% 90%" } } })).some((e) => e.includes("valor inválido")));
});

// ---------- Expressões ----------

test("resolverValor troca canais e cores completas pelas cores da marca", () => {
  assert.equal(resolverValor("{primaria.h} 10% 92%", CORES), "150 10% 92%");
  assert.equal(resolverValor("{secundaria}", CORES), "40 90% 50%");
  assert.equal(resolverValor("{realce.s}% {destaque.l}%", CORES), "70% 80%");
  assert.equal(resolverValor("4px 4px 0 hsl({primaria} / 0.4)", CORES), "4px 4px 0 hsl(150 60% 30% / 0.4)");
});

test("resolverValor mantém var(--…) e valores sem expressão", () => {
  assert.equal(resolverValor("var(--shadow-ui-md)", CORES), "var(--shadow-ui-md)");
  assert.equal(resolverValor("0.5rem", CORES), "0.5rem");
});

test("resolverValor falha quando a cor não existe (realce ausente)", () => {
  assert.throws(() => resolverValor("{realce.h} 50% 50%", { ...CORES, realce: null }), /realce/);
});

test("{neon} é a cor mais saturada (primária, secundária, destaque) em L 60% e S ≥ 80%", () => {
  assert.deepEqual(corNeon(CORES), { h: 40, s: 90, l: 60, fraca: false });
  assert.equal(resolverValor("{neon}", CORES), "40 90% 60%");
  // O realce não entra na escolha, mesmo sendo o mais saturado
  assert.equal(corNeon({ ...CORES, realce: { h: 0, s: 100, l: 50 } }).h, 40);
});

test("{neon} de uma marca sem cor saturada sobe para S 80% e é marcado como fraco", () => {
  const cinza = { primaria: { h: 210, s: 10, l: 40 }, secundaria: { h: 30, s: 20, l: 50 }, destaque: { h: 90, s: 5, l: 85 } };
  assert.deepEqual(corNeon(cinza), { h: 30, s: 80, l: 60, fraca: true });
});

// ---------- definirVar / lerVar ----------

test("definirVar troca o valor em :root e em .dark sem mexer no outro bloco", () => {
  let css = definirVar(CSS, ":root", "--input", "0 0% 7%");
  css = definirVar(css, ".dark", "--input", "0 0% 92%");
  assert.equal(lerVar(css, ":root", "--input"), "0 0% 7%");
  assert.equal(lerVar(css, ".dark", "--input"), "0 0% 92%");
  assert.equal(lerVar(css, ":root", "--background"), "0 0% 100%");
});

test("definirVar não confunde prefixos (--input × --input-hover) nem declarações comentadas", () => {
  let css = definirVar(CSS, ":root", "--input", "1 1% 1%");
  assert.equal(lerVar(css, ":root", "--input-hover"), "220 13% 80%");
  css = definirVar(css, ":root", "--border", "2 2% 2%");
  assert.ok(css.includes("/* --border: 1 1% 1%; */"), "o comentário fica como está");
  assert.equal(lerVar(css, ":root", "--border"), "2 2% 2%");
});

test("definirVar acrescenta o token no bloco quando ele não existe, com o mesmo recuo", () => {
  const css = definirVar(CSS, ".dark", "--card", "240 25% 8%");
  assert.equal(lerVar(css, ".dark", "--card"), "240 25% 8%");
  assert.match(css, /\n    --card: 240 25% 8%;\n  \}/);
  assert.throws(() => definirVar(CSS, ".inexistente", "--x", "1"), /não encontrado/);
});

test("definirVar é idempotente", () => {
  const uma = definirVar(CSS, ":root", "--radius", "0.5rem");
  assert.equal(definirVar(uma, ":root", "--radius", "0.5rem"), uma);
});

// ---------- aplicarEstilo ----------

test("aplicarEstilo grava tokens em :root e .dark, a camada CSS e o tema padrão", () => {
  const f = fixture();
  try {
    const res = aplicarEstilo(f.dir, carregarEstilo("cyberpunk"), CORES);
    assert.equal(res.camada, true);
    assert.equal(res.tokens[":root"], Object.keys(carregarEstilo("cyberpunk").tokens[":root"]).length);
    const css = f.ler("src/index.css");
    assert.equal(lerVar(css, ".dark", "--ring"), "40 90% 60%");
    assert.equal(lerVar(css, ":root", "--border"), "40 70% 30%");
    assert.match(f.ler("src/config/estilo.ts"), /id: "cyberpunk"[\s\S]*temaPadrao: "dark"/);
    assert.match(f.ler("index.html"), /var padrao = "dark";/);
    assert.doesNotMatch(f.ler("src/styles/estilo.css"), /\{(primaria|secundaria|destaque|realce|neon)/);
    assert.deepEqual(res.avisos, []);
  } finally { f.limpar(); }
});

test("aplicarEstilo resolve as expressões da camada CSS", () => {
  const f = fixture();
  const camadas = listarEstilos().filter((id) => carregarEstilo(id).css);
  assert.ok(camadas.length >= 6);
  try {
    for (const id of camadas) {
      aplicarEstilo(f.dir, carregarEstilo(id), CORES);
      assert.doesNotMatch(f.ler("src/styles/estilo.css"), /\{(primaria|secundaria|destaque|realce|neon)(\.[hsl])?\}/, id);
    }
  } finally { f.limpar(); }
});

test("sombra \"none\" vira 0 0 #0000 (as sombras compõem uma lista com o anel de foco)", () => {
  const f = fixture();
  try {
    aplicarEstilo(f.dir, preset({ tokens: { ":root": { "--shadow-ui": "none", "--shadow-hover": " none ", "--shadow-inset": "none" } } }), CORES);
    const css = f.ler("src/index.css");
    assert.equal(lerVar(css, ":root", "--shadow-ui"), "0 0 #0000");
    assert.equal(lerVar(css, ":root", "--shadow-hover"), "0 0 #0000");
    // --shadow-inset não entra em lista com o anel: "none" é válido e fica
    assert.equal(lerVar(css, ":root", "--shadow-inset"), "none");
  } finally { f.limpar(); }
});

test("degradê desligado: o fim do degradê do header vira a cor inicial", () => {
  const f = fixture();
  try {
    aplicarEstilo(f.dir, preset({ degrade: false }), CORES);
    assert.equal(lerVar(f.ler("src/index.css"), ":root", "--brand-header-grad-end"), "150 60% 30%");
    const g = fixture();
    aplicarEstilo(g.dir, preset({ degrade: true }), CORES);
    assert.equal(lerVar(g.ler("src/index.css"), ":root", "--brand-header-grad-end"), "200 60% 40%");
    g.limpar();
  } finally { f.limpar(); }
});

test("o corporativo não altera o index.css", () => {
  const f = fixture();
  try {
    const res = aplicarEstilo(f.dir, carregarEstilo(ESTILO_PADRAO), CORES);
    assert.equal(f.ler("src/index.css"), CSS);
    assert.deepEqual(res.tokens, { ":root": 0, ".dark": 0 });
    assert.equal(res.camada, false);
  } finally { f.limpar(); }
});

test("cyberpunk com marca sem cor saturada avisa que o neon foi forçado", () => {
  const f = fixture();
  try {
    const cinza = { primaria: { h: 210, s: 10, l: 40 }, secundaria: { h: 30, s: 20, l: 50 }, destaque: { h: 90, s: 5, l: 85 }, realce: null };
    const res = aplicarEstilo(f.dir, carregarEstilo("cyberpunk"), cinza);
    assert.equal(res.avisos.length, 1);
    assert.match(res.avisos[0], /neon/);
  } finally { f.limpar(); }
});

// ---------- Contraste do estilo ----------

const razao = (css, sel, a, b) => {
  const v = (n) => parseTriplet(lerVar(css, sel, n) ?? lerVar(css, ":root", n));
  return contrastRatio(hslToRgb(v(a)), hslToRgb(v(b)));
};

test("contrasteDoEstilo leva a borda de campo do estilo a 3:1 em :root e .dark e registra os ajustes", () => {
  const p = preset({ tokens: { ":root": { "--input": "0 0% 90%" } } });
  const css = definirVar(CSS, ":root", "--input", "0 0% 90%");
  const r = contrasteDoEstilo(css, p, new Set(["--input"]), CORES);
  assert.ok(razao(r.css, ":root", "--input", "--background") >= 3);
  assert.ok(razao(r.css, ".dark", "--input", "--background") >= 3);
  // :root escurece (fundo claro), .dark clareia (fundo escuro)
  assert.ok(parseTriplet(lerVar(r.css, ":root", "--input")).l < 90);
  assert.ok(parseTriplet(lerVar(r.css, ".dark", "--input")).l > 18);
  assert.deepEqual(r.ajustes.map((a) => a.split(" → ")[0]), [":root --input", ".dark --input"]);
  assert.deepEqual(r.avisos, []);
});

test("contrasteDoEstilo não mexe em pares que o estilo não tocou", () => {
  const css = definirVar(CSS, ":root", "--input", "0 0% 99%");
  const r = contrasteDoEstilo(css, preset(), new Set(["--radius"]), CORES);
  assert.equal(r.css, css);
  assert.deepEqual(r.ajustes, []);
});
