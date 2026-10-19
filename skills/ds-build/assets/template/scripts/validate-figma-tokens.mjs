#!/usr/bin/env node
/**
 * Valida os artefatos gerados em public/design-system/ contra os
 * JSON Schemas em schemas/. Falha o build caso o Figma receba um
 * formato divergente.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "public/design-system");
const SCHEMAS = resolve(ROOT, "schemas");

const targets = [
  { file: "tokens.json", schema: "tokens.schema.json" },
  { file: "components.json", schema: "components.schema.json" },
  { file: "tailwind.config.json", schema: "tailwind.schema.json" },
];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let hasError = false;
for (const { file, schema } of targets) {
  const dataPath = resolve(OUT, file);
  const schemaPath = resolve(SCHEMAS, schema);
  let data, schemaJson;
  try {
    data = JSON.parse(readFileSync(dataPath, "utf8"));
    schemaJson = JSON.parse(readFileSync(schemaPath, "utf8"));
  } catch (err) {
    console.error("ERRO ao ler " + file + " ou " + schema + ": " + err.message);
    hasError = true;
    continue;
  }
  const validate = ajv.compile(schemaJson);
  const ok = validate(data);
  if (!ok) {
    hasError = true;
    console.error("\n[schema] " + file + " FALHOU contra " + schema + ":");
    for (const err of validate.errors ?? []) {
      console.error("  - " + (err.instancePath || "(root)") + " " + err.message);
    }
  } else {
    console.log("[schema] " + file + " OK contra " + schema);
  }
}

if (hasError) {
  console.error("\nValidacao de schema falhou. Nao publicar artefatos.");
  process.exit(1);
}
console.log("\nTodos os artefatos do DS estao consistentes.");
