/**
 * Catálogo de design tokens exibido em /tokens.
 *
 * A fonte da verdade dos VALORES vive em `src/index.css` (blocos `:root` e `.dark`).
 * Este arquivo apenas espelha esses valores para renderização na documentação.
 *
 * Para evitar divergências, o validador em
 * `src/data/__tests__/tokenGroups.validator.test.ts` compara cada entrada
 * desta lista com o CSS e falha se algo sair de sincronia.
 */

export type ColorToken = {
  name: string;
  lightValue: string;
  darkValue: string;
  lightHex: string;
  darkHex: string;
};

export type ScalarToken = { name: string; value: string };

export type TokenGroup = {
  id: string;
  title: string;
  description?: string;
  tokens: ColorToken[] | ScalarToken[];
};

export const tokenGroups: TokenGroup[] = [
  {
    id: "cores",
    title: "Cores",
    description:
      "As cores semânticas se adaptam automaticamente entre os modos claro e escuro. Sempre utilize os tokens em vez de valores fixos.",
    tokens: [
      { name: "--background", lightValue: "210 25% 99%", darkValue: "210 25% 8%", lightHex: "#FCFCFD", darkHex: "#0F141A" },
      { name: "--foreground", lightValue: "228 60% 12%", darkValue: "210 20% 90%", lightHex: "#0C1431", darkHex: "#E0E6EB" },
      { name: "--primary", lightValue: "228 70% 51%", darkValue: "228 75% 62%", lightHex: "#2B4EDA", darkHex: "#5572E7" },
      { name: "--primary-foreground", lightValue: "0 0% 100%", darkValue: "0 0% 100%", lightHex: "#FFFFFF", darkHex: "#FFFFFF" },
      { name: "--secondary", lightValue: "196 85% 45%", darkValue: "196 80% 55%", lightHex: "#11A0D4", darkHex: "#30B7E8" },
      { name: "--secondary-foreground", lightValue: "0 0% 100%", darkValue: "0 0% 100%", lightHex: "#FFFFFF", darkHex: "#FFFFFF" },
      { name: "--muted", lightValue: "220 15% 94%", darkValue: "210 18% 18%", lightHex: "#EDEFF2", darkHex: "#262E36" },
      { name: "--muted-foreground", lightValue: "228 12% 42%", darkValue: "210 15% 60%", lightHex: "#5E6378", darkHex: "#8A99A8" },
      { name: "--accent", lightValue: "228 90% 96%", darkValue: "228 50% 22%", lightHex: "#ECEFFE", darkHex: "#1C2754" },
      { name: "--accent-foreground", lightValue: "228 70% 25%", darkValue: "228 60% 85%", lightHex: "#13256C", darkHex: "#C2CBF0" },
      { name: "--card", lightValue: "0 0% 100%", darkValue: "210 22% 12%", lightHex: "#FFFFFF", darkHex: "#181F25" },
      { name: "--border", lightValue: "220 18% 88%", darkValue: "210 18% 22%", lightHex: "#DBDFE6", darkHex: "#2E3842" },
      { name: "--success", lightValue: "145 63% 32%", darkValue: "145 55% 42%", lightHex: "#1E8549", darkHex: "#30A661" },
      { name: "--warning", lightValue: "38 92% 50%", darkValue: "38 88% 58%", lightHex: "#F59F0A", darkHex: "#F2AD36" },
      { name: "--error", lightValue: "0 78% 52%", darkValue: "0 72% 58%", lightHex: "#E42525", darkHex: "#E14747" },
      { name: "--info", lightValue: "228 70% 60%", darkValue: "228 70% 65%", lightHex: "#526EE0", darkHex: "#6780E4" },
    ],
  },
  {
    id: "tipografia",
    title: "Tipografia",
    tokens: [
      { name: "--text-xs", value: "0.8125rem (13px)" },
      { name: "--text-sm", value: "0.9375rem (15px)" },
      { name: "--text-base", value: "1.0625rem (17px)" },
      { name: "--text-lg", value: "1.1875rem (19px)" },
      { name: "--text-xl", value: "1.375rem (22px)" },
      { name: "--text-2xl", value: "1.625rem (26px)" },
      { name: "--text-3xl", value: "2rem (32px)" },
      { name: "--text-4xl", value: "2.5rem (40px)" },
      { name: "--text-5xl", value: "3.25rem (52px)" },
      { name: "--text-6xl", value: "4rem (64px)" },
      { name: "--text-7xl", value: "4.75rem (76px)" },
      { name: "--font-light", value: "300" },
      { name: "--font-regular", value: "400" },
      { name: "--font-medium", value: "500" },
      { name: "--font-semibold", value: "600" },
      { name: "--font-bold", value: "700" },
      { name: "--font-extrabold", value: "800" },
      { name: "--leading-tight", value: "1.2" },
      { name: "--leading-snug", value: "1.35" },
      { name: "--leading-normal", value: "1.6" },
      { name: "--leading-relaxed", value: "1.75" },
      { name: "--leading-loose", value: "1.9" },
    ],
  },
  {
    id: "espacamento",
    title: "Espaçamento",
    tokens: [
      { name: "--space-0", value: "0" },
      { name: "--space-px", value: "1px" },
      { name: "--space-0-5", value: "0.125rem (2px)" },
      { name: "--space-1", value: "0.25rem (4px)" },
      { name: "--space-1-5", value: "0.375rem (6px)" },
      { name: "--space-2", value: "0.5rem (8px)" },
      { name: "--space-3", value: "0.75rem (12px)" },
      { name: "--space-4", value: "1rem (16px)" },
      { name: "--space-5", value: "1.25rem (20px)" },
      { name: "--space-6", value: "1.5rem (24px)" },
      { name: "--space-8", value: "2rem (32px)" },
      { name: "--space-10", value: "2.5rem (40px)" },
      { name: "--space-12", value: "3rem (48px)" },
      { name: "--space-14", value: "3.5rem (56px)" },
      { name: "--space-16", value: "4rem (64px)" },
      { name: "--space-20", value: "5rem (80px)" },
      { name: "--space-24", value: "6rem (96px)" },
      { name: "--space-32", value: "8rem (128px)" },
    ],
  },
  {
    id: "sombras",
    title: "Sombras",
    description:
      "As sombras se adaptam automaticamente ao tema. No modo escuro, usam opacidades mais altas para manter a percepção de profundidade.",
    tokens: [
      { name: "--shadow-xs", value: "0 1px 2px 0 hsl(228 70% 30% / 0.05)" },
      { name: "--shadow-sm", value: "0 1px 3px 0 hsl(228 70% 30% / 0.07), 0 1px 2px -1px hsl(228 70% 30% / 0.06)" },
      { name: "--shadow-md", value: "0 4px 6px -1px hsl(228 70% 30% / 0.08), 0 2px 4px -2px hsl(228 70% 30% / 0.05)" },
      { name: "--shadow-lg", value: "0 10px 15px -3px hsl(228 70% 30% / 0.09), 0 4px 6px -4px hsl(228 70% 30% / 0.05)" },
      { name: "--shadow-xl", value: "0 20px 25px -5px hsl(228 70% 30% / 0.12), 0 8px 10px -6px hsl(228 70% 30% / 0.05)" },
    ],
  },
  {
    id: "zindex",
    title: "Z-index",
    description:
      "Camadas de empilhamento padronizadas para garantir que dropdowns, modais e toasts apareçam sempre na ordem correta.",
    tokens: [
      { name: "--z-dropdown", value: "100" },
      { name: "--z-sticky", value: "200" },
      { name: "--z-overlay", value: "300" },
      { name: "--z-modal", value: "400" },
      { name: "--z-toast", value: "500" },
    ],
  },
  {
    id: "breakpoints",
    title: "Breakpoints",
    description:
      "Pontos de quebra que definem quando o layout se adapta entre celular, tablet e desktop. Trabalhamos mobile-first: o estilo base vale para telas pequenas e os prefixos (sm:, md:, lg:, xl:) acrescentam ajustes conforme a largura aumenta.",
    tokens: [
      { name: "--bp-sm", value: "640px — celular landscape / tablet pequeno" },
      { name: "--bp-md", value: "768px — tablet" },
      { name: "--bp-lg", value: "1024px — desktop / notebook" },
      { name: "--bp-xl", value: "1280px — desktop amplo" },
    ],
  },
];

/** Tokens de duração e easing exibidos abaixo da tabela principal. */
export const motionTokens: ScalarToken[] = [
  { name: "--duration-fast", value: "100ms" },
  { name: "--duration-normal", value: "200ms" },
  { name: "--duration-slow", value: "300ms" },
  { name: "--duration-slower", value: "500ms" },
  { name: "--ease-default", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { name: "--ease-in", value: "cubic-bezier(0.4, 0, 1, 1)" },
  { name: "--ease-out", value: "cubic-bezier(0, 0, 0.2, 1)" },
];