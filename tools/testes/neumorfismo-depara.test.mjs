import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { carregar, renderizar, contar, STATUS } from "../neumorfismo-depara.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("de-para do neumorfismo: status válidos, componentes únicos e equivalente em tudo que não é sem-similar", () => {
  const { itens } = carregar();
  const vistos = new Set();
  for (const i of itens) {
    assert.ok(STATUS[i.status], `status inválido em "${i.componente}": ${i.status}`);
    assert.ok(!vistos.has(i.componente), `componente repetido: ${i.componente}`);
    vistos.add(i.componente);
    if (i.status !== "sem-similar") assert.notEqual(i.ds, "—", `"${i.componente}" precisa de um equivalente no DS`);
    if (i.status === "parcial" || i.status === "pendente") assert.ok(i.nota, `"${i.componente}" precisa dizer o que falta`);
  }
  const n = contar(itens);
  assert.equal(Object.values(n).reduce((a, b) => a + b, 0), itens.length);
});

test("docs/NEUMORFISMO-DEPARA.md está em dia com o JSON", () => {
  const md = fs.readFileSync(path.join(ROOT, "docs/NEUMORFISMO-DEPARA.md"), "utf8");
  assert.equal(md, renderizar(carregar()));
});
