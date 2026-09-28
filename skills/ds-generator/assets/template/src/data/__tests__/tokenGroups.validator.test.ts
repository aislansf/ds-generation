import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  tokenGroups,
  motionTokens,
  type ColorToken,
  type ScalarToken,
} from "../tokenGroups";

/**
 * Validador automático de design tokens.
 *
 * Lê src/index.css como fonte da verdade e garante que cada token exposto
 * na página /tokens (src/data/tokenGroups.ts) bate com o valor real
 * declarado nos blocos `:root` (light) e `.dark` (dark).
 *
 * Falha o teste com uma mensagem específica para cada divergência —
 * útil para travar regressões no CI.
 */

const CSS_PATH = resolve(__dirname, "../../index.css");
const CSS = readFileSync(CSS_PATH, "utf8");
const CSS_REL = "src/index.css";

/** Cada declaração CSS captura seu valor e a linha (1-based) onde aparece. */
type CssVar = { value: string; line: number };

/** Localiza um bloco `selector { ... }` e devolve seu conteúdo + offset inicial. */
function extractBlock(
  source: string,
  selector: string,
): { body: string; offset: number } {
  const re = new RegExp(`${selector.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*\\{`);
  const m = re.exec(source);
  if (!m) throw new Error(`Selector "${selector}" não encontrado em ${CSS_REL}`);
  let depth = 1;
  let i = m.index + m[0].length;
  const start = i;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }
  return { body: source.slice(start, i - 1), offset: start };
}

/** Constrói um mapa nome → { valor, linha } a partir de um bloco CSS. */
function parseVars(
  source: string,
  block: { body: string; offset: number },
): Map<string, CssVar> {
  const map = new Map<string, CssVar>();
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block.body)) !== null) {
    // Pula declarações dentro de comentários
    const absoluteIdx = block.offset + m.index;
    const before = source.lastIndexOf("/*", absoluteIdx);
    const closed = source.lastIndexOf("*/", absoluteIdx);
    if (before > closed) continue;
    const line = source.slice(0, absoluteIdx).split("\n").length;
    map.set(m[1], {
      value: m[2].trim().replace(/\s+/g, " "),
      line,
    });
  }
  return map;
}

const ROOT = parseVars(CSS, extractBlock(CSS, ":root"));
const DARK = parseVars(CSS, extractBlock(CSS, ".dark"));

/** Localiza a linha de uma declaração `--token: ...;` dentro de um bloco
 *  específico, mesmo quando o token está faltando do mapa (para mensagens). */
function locateInBlock(blockName: ":root" | ".dark", token: string): string {
  const map = blockName === ":root" ? ROOT : DARK;
  const hit = map.get(token);
  if (hit) return `${CSS_REL}:${hit.line} (${blockName})`;
  return `${CSS_REL} (${blockName}, token ausente)`;
}

/** HSL "H S% L%" → "#RRGGBB" (uppercase) */
function hslToHex(hsl: string): string {
  const m = /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/.exec(hsl.trim());
  if (!m) throw new Error(`HSL inválido: "${hsl}"`);
  const h = parseFloat(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) =>
    Math.round(x * 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Remove sufixos descritivos no fim do valor exibido na UI, como
 *  " (16px)" ou " — tablet". Mantém parênteses que fazem parte do
 *  valor real (ex.: `cubic-bezier(...)`). */
function normalizeScalar(value: string): string {
  return value
    .replace(/\s+—\s+.*$/u, "")
    .replace(/\s+\([^)]*\)\s*$/u, "")
    .trim();
}

function isColorToken(t: ColorToken | ScalarToken): t is ColorToken {
  return (t as ColorToken).lightValue !== undefined;
}

describe("Design tokens — sincronia com src/index.css", () => {
  for (const group of tokenGroups) {
    describe(`grupo "${group.id}"`, () => {
      for (const token of group.tokens) {
        it(`${token.name} bate com index.css`, () => {
          const light = ROOT.get(token.name);
          expect(
            light,
            `[${CSS_REL}] token "${token.name}" não foi declarado no bloco :root. ` +
              `Esperado pela documentação em src/data/tokenGroups.ts (grupo "${group.id}").`,
          ).toBeDefined();

          if (isColorToken(token)) {
            expect(
              light!.value,
              `Divergência em ${locateInBlock(":root", token.name)} → token "${token.name}" (light)\n` +
                `  CSS  : ${light!.value}\n` +
                `  Docs : ${token.lightValue}`,
            ).toBe(token.lightValue);

            const dark = DARK.get(token.name);
            expect(
              dark,
              `[${CSS_REL}] token "${token.name}" não foi declarado no bloco .dark.`,
            ).toBeDefined();
            expect(
              dark!.value,
              `Divergência em ${locateInBlock(".dark", token.name)} → token "${token.name}" (dark)\n` +
                `  CSS  : ${dark!.value}\n` +
                `  Docs : ${token.darkValue}`,
            ).toBe(token.darkValue);

            expect(
              hslToHex(token.lightValue),
              `Hex (light) de "${token.name}" não bate com o HSL declarado em ${locateInBlock(":root", token.name)}`,
            ).toBe(token.lightHex.toUpperCase());
            expect(
              hslToHex(token.darkValue),
              `Hex (dark) de "${token.name}" não bate com o HSL declarado em ${locateInBlock(".dark", token.name)}`,
            ).toBe(token.darkHex.toUpperCase());
          } else {
            expect(
              light!.value,
              `Divergência em ${locateInBlock(":root", token.name)} → token "${token.name}"\n` +
                `  CSS  : ${light!.value}\n` +
                `  Docs : ${normalizeScalar(token.value)}`,
            ).toBe(normalizeScalar(token.value));
          }
        });
      }
    });
  }

  describe('grupo "motion"', () => {
    for (const token of motionTokens) {
      it(`${token.name} bate com index.css`, () => {
        const css = ROOT.get(token.name);
        expect(
          css,
          `[${CSS_REL}] token "${token.name}" não foi declarado no bloco :root.`,
        ).toBeDefined();
        expect(
          css!.value,
          `Divergência em ${locateInBlock(":root", token.name)} → token "${token.name}"\n` +
            `  CSS  : ${css!.value}\n` +
            `  Docs : ${normalizeScalar(token.value)}`,
        ).toBe(normalizeScalar(token.value));
      });
    }
  });
});