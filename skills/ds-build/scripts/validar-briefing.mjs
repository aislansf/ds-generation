#!/usr/bin/env node
/**
 * validar-briefing.mjs — lista as perguntas do briefing que ainda não têm resposta válida.
 *
 * Uso:
 *   node scripts/validar-briefing.mjs <briefing.json>
 *
 * Sai com código 1 enquanto houver pendência. O generate-ds.mjs faz a mesma checagem e se recusa a gerar.
 * O estilo visual sem resposta não é pendência: vale o padrão (corporativo), e o script avisa.
 */
import fs from "node:fs";
import path from "node:path";
import { validarBriefing, formatarPendencias, estiloPadrao, PERGUNTAS } from "./lib/briefing.mjs";
import { ESTILO_PADRAO } from "./lib/estilos.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node validar-briefing.mjs <briefing.json>");
  process.exit(1);
}
const BRIEF_PATH = path.resolve(file);
let brief;
try {
  brief = JSON.parse(fs.readFileSync(BRIEF_PATH, "utf8"));
} catch (e) {
  console.error(`Não consegui ler ${BRIEF_PATH}: ${e.message}`);
  process.exit(1);
}

const pendencias = validarBriefing(brief, path.dirname(BRIEF_PATH));
// Estilo é a única pergunta com padrão: avisa, mas não é pendência
if (estiloPadrao(brief)) console.log(`Estilo não informado: será usado o padrão (${ESTILO_PADRAO}).`);
if (pendencias.length) {
  console.error(`Briefing incompleto: ${pendencias.length} de ${PERGUNTAS.length} pergunta(s) sem resposta válida.\n`);
  console.error(formatarPendencias(pendencias));
  console.error("\nPergunte ao usuário. Não invente respostas nem preencha padrões sem que ele escolha.");
  process.exit(1);
}
console.log(`Briefing completo: ${PERGUNTAS.length} perguntas respondidas e confirmadas.`);
