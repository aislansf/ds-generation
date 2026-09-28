#!/usr/bin/env node
/**
 * validar-briefing.mjs — lista as perguntas do briefing que ainda não têm resposta válida.
 *
 * Uso:
 *   node scripts/validar-briefing.mjs <briefing.json>
 *
 * Sai com código 1 enquanto houver pendência. O generate-ds.mjs faz a mesma checagem e se recusa a gerar.
 */
import fs from "node:fs";
import path from "node:path";
import { validarBriefing, formatarPendencias, PERGUNTAS } from "./lib/briefing.mjs";

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
if (pendencias.length) {
  console.error(`Briefing incompleto: ${pendencias.length} de ${PERGUNTAS.length} pergunta(s) sem resposta válida.\n`);
  console.error(formatarPendencias(pendencias));
  console.error("\nPergunte ao usuário. Não invente respostas nem preencha padrões sem que ele escolha.");
  process.exit(1);
}
console.log(`Briefing completo: ${PERGUNTAS.length} perguntas respondidas e confirmadas.`);
