#!/usr/bin/env node
/**
 * Gera a escala 50–700 (light e dark) a partir de uma cor, no formato dos tokens do DS.
 *
 * Uso:
 *   node scripts/gerar-escala.mjs "#2A4FDA" [--nome brand-primary]
 */
import { buildScale, hslTriplet, hslToHex, hexToRgb, contrastRatio } from "./lib/color.mjs";

const hex = process.argv[2];
if (!/^#?[0-9a-fA-F]{6}$/.test(hex ?? "")) {
  console.error('Uso: node gerar-escala.mjs "#RRGGBB" [--nome brand-primary]');
  process.exit(1);
}
const i = process.argv.indexOf("--nome");
const nome = i > 0 ? process.argv[i + 1] : "brand-primary";
const { base, light, dark } = buildScale(hex.startsWith("#") ? hex : `#${hex}`);

const white = { r: 255, g: 255, b: 255 };
console.log(`/* ${nome} — base ${hex.toUpperCase()} (${hslTriplet(base)}) · contraste com branco ${contrastRatio(hexToRgb(hex), white).toFixed(2)}:1 */`);
console.log(":root {");
console.log(`  --${nome}: ${hslTriplet(base)};`);
for (const [step, hsl] of Object.entries(light)) console.log(`  --${nome}-${step}: ${hslTriplet(hsl)}; /* ${hslToHex(hsl)} */`);
console.log("}\n.dark {");
for (const [step, hsl] of Object.entries(dark)) console.log(`  --${nome}-${step}: ${hslTriplet(hsl)}; /* ${hslToHex(hsl)} */`);
console.log("}");
