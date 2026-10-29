// Fase 6 dos estilos visuais (docs/PLANO-ESTILOS.md): seção "Estilo visual" na página Fundamentos.
//
// A seção lê o estilo escolhido (src/config/estilo.ts) e o resumo gravado pelo gerador
// (public/design-system/estilo.json). Como o resto da tokenização, entra como patch idempotente no fim da
// extração (tokenizar.mjs usa SECAO_NOVOS e SECAO_TROCAS daqui); nada muda na origem.
//
// Garantia de identidade: no estilo `corporativo` o componente devolve null e o item do menu lateral não
// existe, então /fundamentos e a navegação ficam idênticos aos de antes.
import fs from "node:fs";

const lerPatch = (nome) => fs.readFileSync(new URL(`./patch/${nome}`, import.meta.url), "utf8");

/** Arquivos novos: [caminho no template, conteúdo]. O teste fica ao lado do componente. */
export const SECAO_NOVOS = [
  ["src/components/EstiloVisualSection.tsx", lerPatch("EstiloVisualSection.tsx")],
  ["src/components/__tests__/EstiloVisualSection.test.tsx", lerPatch("EstiloVisualSection.test.tsx")],
];

/** Trocas literais: [arquivo, antes, depois, marca?] (mesmo formato de TROCAS em tokenizar.mjs). */
export const SECAO_TROCAS = [
  ["src/pages/FundamentosPage.tsx", 'import GridSection from "@/components/GridSection";\n',
    'import GridSection from "@/components/GridSection";\nimport EstiloVisualSection from "@/components/EstiloVisualSection";\n'],
  // Entre Grid e Elevação: o estilo é o que dá forma às sombras, aos raios e ao movimento mostrados depois
  ["src/pages/FundamentosPage.tsx", "      {/* Elevation */}\n", "      <EstiloVisualSection />\n\n      {/* Elevation */}\n"],
  // Menu lateral: o item só existe nos estilos diferentes do corporativo
  ["src/components/DSLayout.tsx", 'import { useTheme } from "@/hooks/useTheme";\n', 'import { useTheme } from "@/hooks/useTheme";\nimport { ESTILO } from "@/config/estilo";\n'],
  ["src/components/DSLayout.tsx", '      { label: "Elevação e Sombras", path: "/fundamentos#elevacao" },\n',
    '      { label: "Elevação e Sombras", path: "/fundamentos#elevacao" },\n      ...((ESTILO.id as string) !== "corporativo" ? [{ label: "Estilo visual", path: "/fundamentos#estilo" }] : []),\n'],
];
