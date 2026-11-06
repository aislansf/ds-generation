#!/usr/bin/env node
/**
 * neumorfismo-depara.mjs — gera docs/NEUMORFISMO-DEPARA.md a partir de docs/neumorfismo-depara.json.
 *
 * Uso:
 *   node tools/neumorfismo-depara.mjs            grava o markdown e imprime o resumo
 *   node tools/neumorfismo-depara.mjs --check    sai com 1 se o markdown estiver desatualizado
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTE = path.join(ROOT, "docs/neumorfismo-depara.json");
const SAIDA = path.join(ROOT, "docs/NEUMORFISMO-DEPARA.md");

export const STATUS = {
  trocado: { icone: "✅", rotulo: "Trocado", ajuda: "estilo do anexo aplicado no equivalente do DS" },
  parcial: { icone: "🟡", rotulo: "Parcial", ajuda: "equivalente trocado, faltam variações ou detalhes" },
  pendente: { icone: "⏳", rotulo: "Pendente", ajuda: "equivalente existe, ainda não foi trocado" },
  "sem-similar": { icone: "❌", rotulo: "Sem similar", ajuda: "não existe no DS" },
};

export function carregar() {
  return JSON.parse(fs.readFileSync(FONTE, "utf8"));
}

export function contar(itens) {
  const n = Object.fromEntries(Object.keys(STATUS).map((s) => [s, 0]));
  for (const i of itens) n[i.status]++;
  return n;
}

const cel = (s) => String(s ?? "").replace(/\|/g, "\|") || "—";

export function renderizar({ anexo, itens }) {
  const n = contar(itens);
  const total = itens.length;
  const faltam = total - n.trocado;
  const barra = (v, t, larg = 30) => "█".repeat(Math.round((v / t) * larg)).padEnd(larg, "░");
  const grupos = [...new Set(itens.map((i) => i.grupo))];
  const L = [];
  L.push("# Neumorfismo: de-para do anexo para o DS", "");
  L.push("> Gerado por `npm run depara:neumorfismo` a partir de `docs/neumorfismo-depara.json`. Não edite este arquivo à mão.", "");
  L.push(`Anexo: ${anexo}. Cada componente do anexo aponta para o equivalente do DS (a vitrine \`/componentes\`, os \`ui/*\` e os templates) e leva um status.`, "");
  L.push("## Quanto falta trocar", "");
  L.push(`**${n.trocado} de ${total} trocados. Faltam ${faltam}.**`, "");
  L.push("```", `${barra(n.trocado, total)}  ${Math.round((n.trocado / total) * 100)}%`, "```", "");
  L.push("| Status | Quantos | O que significa |", "|---|---:|---|");
  for (const [k, v] of Object.entries(STATUS)) L.push(`| ${v.icone} ${v.rotulo} | ${n[k]} | ${v.ajuda} |`);
  L.push("");
  L.push("| Grupo | Trocados | Faltam |", "|---|---:|---:|");
  for (const g of grupos) {
    const d = itens.filter((i) => i.grupo === g);
    const t = d.filter((i) => i.status === "trocado").length;
    L.push(`| ${g} | ${t} de ${d.length} | ${d.length - t} |`);
  }
  L.push("");
  L.push("## O que falta", "");
  for (const k of ["sem-similar", "pendente", "parcial"]) {
    const d = itens.filter((i) => i.status === k);
    if (!d.length) continue;
    L.push(`### ${STATUS[k].icone} ${STATUS[k].rotulo} (${d.length})`, "");
    for (const i of d) L.push(`- [ ] **${i.componente}** → ${i.ds}${i.nota ? `. ${i.nota}` : ""}`);
    L.push("");
  }
  L.push("## De-para completo", "");
  for (const g of grupos) {
    L.push(`### ${g}`, "", "| | Componente do anexo | Origem | Equivalente no DS | Nota |", "|---|---|---|---|---|");
    for (const i of itens.filter((x) => x.grupo === g)) {
      L.push(`| ${STATUS[i.status].icone} | ${cel(i.componente)} | ${cel(i.origem)} | ${cel(i.ds)} | ${cel(i.nota)} |`);
    }
    L.push("");
  }
  L.push("## Como o estilo entra", "",
    "A camada `skills/ds-build/assets/estilos/neumorfismo/estilo.css` usa, nesta ordem: os ganchos `data-ds` dos componentes, papéis ARIA (`tablist`, `menu`, `dialog`, `progressbar`, `aria-current`, `aria-expanded`) e poucos elementos nativos. As sombras de `shadow-*` vêm dos tokens do preset, por isso peças montadas à mão já ganham relevo sem gancho. O que ainda está como Parcial ou Pendente é onde nenhum desses seletores alcança a peça: a solução é pôr o gancho no template (patch em `tools/lib/ganchos.mjs` ou `tools/lib/tokenizar.mjs`), não mexer na origem.", "");
  return L.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dados = carregar();
  const md = renderizar(dados);
  if (process.argv.includes("--check")) {
    const atual = fs.existsSync(SAIDA) ? fs.readFileSync(SAIDA, "utf8") : "";
    if (atual !== md) { console.error("docs/NEUMORFISMO-DEPARA.md está desatualizado: rode `npm run depara:neumorfismo`."); process.exit(1); }
  } else {
    fs.writeFileSync(SAIDA, md);
  }
  const n = contar(dados.itens);
  console.log(`${n.trocado} de ${dados.itens.length} trocados · parcial ${n.parcial} · pendente ${n.pendente} · sem similar ${n["sem-similar"]}`);
}
