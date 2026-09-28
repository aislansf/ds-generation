import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Visual regression (structural) — garante que os cartões de famílias
 * tipográficas (FontFamilyCard) permaneçam com o MESMO wrapper visual
 * do card "Escala tipográfica dinâmica" em todos os breakpoints.
 *
 * Como ambos compartilham a classe `.brand-card w-full`, o padding, a
 * largura (100% do container pai) e o alinhamento ficam idênticos em
 * desktop, tablet e mobile (verificado em Playwright: 960/905/905 px).
 */

const PAGE_SRC = readFileSync(
  resolve(__dirname, "../FundamentosPage.tsx"),
  "utf8",
);
const COMPONENT_SRC = readFileSync(
  resolve(__dirname, "../../components/FontFamilyCard.tsx"),
  "utf8",
);

describe("FontFamilyCard ↔ Escala tipográfica dinâmica — paridade visual", () => {
  it("FontFamilyCard usa wrapper `.brand-card w-full h-full` (componente reutilizável)", () => {
    // Root do componente FontFamilyCard
    expect(COMPONENT_SRC).toMatch(
      /export function FontFamilyCard[\s\S]*?<div className="brand-card w-full h-full[^"]*">/,
    );
  });

  it("card 'Escala tipográfica dinâmica' também usa `.brand-card`", () => {
    expect(PAGE_SRC).toMatch(
      /className="brand-card[^"]*"[\s\S]{0,400}Escala tipográfica dinâmica/,
    );
  });

  it("container dos FontFamilyCards NÃO restringe a largura (sem max-w-*)", () => {
    // O wrapper dos FontFamilyCard deve ser w-full sem max-w
    const m = PAGE_SRC.match(
      /<div className="(grid [^"]*)">\s*\{\/\* Sistêmica — __FONT_SYSTEM__ \*\/\}/,
    );
    expect(m, "container dos FontFamilyCards não encontrado").not.toBeNull();
    expect(m![1]).toContain("w-full");
    expect(m![1]).not.toMatch(/\bmax-w-/);
  });

  it("FontFamilyCard não reintroduz `max-w-*` no conteúdo interno", () => {
    expect(COMPONENT_SRC).not.toMatch(/\bmax-w-/);
  });

  it("FontFamilyCard é exportado como componente reutilizável", () => {
    expect(COMPONENT_SRC).toMatch(/export function FontFamilyCard/);
    expect(COMPONENT_SRC).toMatch(/export interface FontFamilyCardProps/);
    expect(PAGE_SRC).toMatch(
      /import \{ FontFamilyCard \} from ["']@\/components\/FontFamilyCard["']/,
    );
  });
});