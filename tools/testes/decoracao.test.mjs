// Testes da decoração gerada (skills/ds-build/scripts/lib/decoracao.mjs) e das camadas CSS de nível 3 (Fase 4).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { gerarDecoracao, GERADORES, paleta, aleatorio, LIMITE_BYTES } from "../../skills/ds-build/scripts/lib/decoracao.mjs";
import { listarEstilos, carregarEstilo, validarPreset, aplicarEstilo, lerVar, ESTILOS_DIR } from "../../skills/ds-build/scripts/lib/estilos.mjs";

const VERDE = { primaria: { h: 155, s: 85, l: 25 }, secundaria: { h: 190, s: 70, l: 40 }, destaque: { h: 48, s: 90, l: 60 }, realce: null };
const VIOLETA = { primaria: { h: 250, s: 85, l: 55 }, secundaria: { h: 20, s: 95, l: 55 }, destaque: { h: 50, s: 95, l: 60 }, realce: { h: 340, s: 80, l: 50 } };
const NIVEL3 = listarEstilos().filter((id) => carregarEstilo(id).nivel === 3);
const cfgDe = (id) => JSON.parse(fs.readFileSync(path.join(ESTILOS_DIR, id, carregarEstilo(id).decoracao), "utf8"));

test("há 9 estilos de nível 3 e todos declaram decoração válida", () => {
  assert.deepEqual(NIVEL3, ["maximalista", "grunge", "art-nouveau", "bauhaus", "construtivismo", "retro", "organico", "ilustrativo", "colagem"]);
  for (const id of NIVEL3) assert.deepEqual(validarPreset(carregarEstilo(id), id), [], id);
});

test("validarPreset recusa nível 3 sem decoração, decoração fora do nível 3 e gerador desconhecido", () => {
  const p = carregarEstilo("bauhaus");
  assert.ok(validarPreset({ ...p, decoracao: undefined }, "bauhaus").some((e) => e.includes("nível 3")));
  assert.ok(validarPreset({ ...carregarEstilo("flat"), decoracao: "decoracao.json" }, "flat").some((e) => e.includes("nível 3") || e.includes("não existe")));
});

test("a decoração é determinística: mesma marca, mesmos SVGs; outra marca, outra composição", () => {
  for (const id of NIVEL3) {
    const a = gerarDecoracao(cfgDe(id), VERDE, "agencia-verde");
    const b = gerarDecoracao(cfgDe(id), VERDE, "agencia-verde");
    assert.deepEqual([...a.arquivos], [...b.arquivos], id);
  }
  const x = gerarDecoracao(cfgDe("bauhaus"), VERDE, "agencia-verde").arquivos.get("public/estilo/hero.svg");
  const y = gerarDecoracao(cfgDe("bauhaus"), VERDE, "outra-marca").arquivos.get("public/estilo/hero.svg");
  assert.notEqual(x, y);
});

test("SVGs sem texto, nas cores da marca, e decoração de cada estilo ≤ 200 KB nas duas marcas de exemplo", () => {
  for (const cores of [VERDE, VIOLETA]) {
    for (const id of NIVEL3) {
      const P = paleta(cores, { dessaturar: cfgDe(id).dessaturar ?? 0 });
      const d = gerarDecoracao(cfgDe(id), cores, "teste");
      assert.ok(d.bytes <= LIMITE_BYTES, `${id}: ${d.bytes} bytes`);
      for (const [arq, s] of d.arquivos) {
        assert.match(s, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[^>]*>[\s\S]*<\/svg>\n$/, `${id} ${arq}`);
        assert.doesNotMatch(s, /<text|<script|href=/, `${id} ${arq}`);
      }
      // A composição do hero usa alguma cor da marca (exceto a máscara e a textura, que são neutras)
      const hero = d.arquivos.get("public/estilo/hero.svg");
      assert.ok(P.todas.filter(Boolean).some((c) => hero.includes(c)), `${id}: hero sem cor da marca`);
    }
  }
});

test("a textura nunca passa de 6% de opacidade", () => {
  const s = GERADORES.ruido({ opacidade: 0.3 });
  assert.match(s, /opacity="0\.06"/);
});

test("dessaturação: o retrô usa as cores da marca desbotadas", () => {
  const forte = paleta(VIOLETA).primaria, desbotada = paleta(VIOLETA, { dessaturar: 15 }).primaria;
  assert.notEqual(forte, desbotada);
  const hero = gerarDecoracao(cfgDe("retro"), VIOLETA, "x").arquivos.get("public/estilo/hero.svg");
  assert.ok(!hero.includes(forte));
});

test("aleatorio é reprodutível pela semente", () => {
  const a = aleatorio("s"), b = aleatorio("s");
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
});

// ---------- Camadas CSS ----------

/** Regras de um CSS: { seletor, corpo, media } (um nível de @media). */
function regras(css) {
  const out = [];
  const limpo = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  const bloco = (ini) => { let d = 0, k = ini; for (; k < limpo.length; k++) { if (limpo[k] === "{") d++; else if (limpo[k] === "}" && --d === 0) break; } return k; };
  while (i < limpo.length) {
    const a = limpo.indexOf("{", i);
    if (a < 0) break;
    const cab = limpo.slice(i, a).trim();
    const f = bloco(a);
    const corpo = limpo.slice(a + 1, f);
    if (cab.startsWith("@media")) for (const r of regras(corpo)) out.push({ ...r, media: cab });
    else if (!cab.startsWith("@keyframes")) out.push({ seletor: cab, corpo, media: null });
    i = f + 1;
  }
  return out;
}

const camadaDe = (id) => {
  const p = carregarEstilo(id);
  return [p.decoracao && fs.readFileSync(path.join(ESTILOS_DIR, "_decoracao.css"), "utf8"), p.css && fs.readFileSync(path.join(ESTILOS_DIR, id, p.css), "utf8")].filter(Boolean).join("\n");
};

test("decoração só em superfícies de marca: toda regra com --deco-* ou url() fica em [data-surface=\"marca\"]", () => {
  for (const id of listarEstilos()) {
    for (const r of regras(camadaDe(id))) {
      if (!/--deco-|url\(/.test(r.corpo)) continue;
      for (const sel of r.seletor.split(/,(?![^(]*\))/)) {
        assert.match(sel, /\[data-surface="marca"\]/, `${id}: "${sel.trim()}" usa decoração fora de superfície de marca`);
      }
    }
  }
});

test("animação e rotação só com prefers-reduced-motion: no-preference", () => {
  for (const id of listarEstilos()) {
    for (const r of regras(camadaDe(id))) {
      const anima = /(^|;)\s*animation(-name)?\s*:/.test(r.corpo) || /rotate\(/.test(r.corpo);
      if (!anima) continue;
      assert.match(r.media ?? "", /prefers-reduced-motion:\s*no-preference/, `${id}: "${r.seletor}" anima sem respeitar movimento reduzido`);
    }
  }
});

test("aplicarEstilo de nível 3 grava os SVGs, os tokens --deco-* e a camada comum antes da do estilo", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-deco-teste-"));
  try {
    fs.mkdirSync(path.join(dir, "src/config"), { recursive: true });
    fs.mkdirSync(path.join(dir, "src/styles"), { recursive: true });
    fs.writeFileSync(path.join(dir, "src/index.css"), `:root {\n    --deco-hero: none;\n    --deco-mask: none;\n  }\n  .dark {\n    --background: 0 0% 5%;\n  }\n`);
    fs.writeFileSync(path.join(dir, "src/config/estilo.ts"), `export const ESTILO = { id: "corporativo", nome: "Corporativo", temaPadrao: "light", layout: "padrao" } as const;\n`);
    const res = aplicarEstilo(dir, carregarEstilo("grunge"), VERDE, { semente: "agencia-verde" });
    assert.deepEqual(res.decoracao.arquivos.sort(), ["public/estilo/divisoria.svg", "public/estilo/hero.svg", "public/estilo/mascara.svg", "public/estilo/padrao.svg", "public/estilo/textura.svg"]);
    for (const a of res.decoracao.arquivos) assert.ok(fs.existsSync(path.join(dir, a)), a);
    const css = fs.readFileSync(path.join(dir, "src/index.css"), "utf8");
    assert.equal(lerVar(css, ":root", "--deco-hero"), 'url("/estilo/hero.svg")');
    assert.equal(lerVar(css, ":root", "--deco-mask"), 'url("/estilo/mascara.svg")');
    const camada = fs.readFileSync(path.join(dir, "src/styles/estilo.css"), "utf8");
    assert.ok(camada.indexOf("Decoração gerada") < camada.indexOf("Estilo visual: Grunge"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
