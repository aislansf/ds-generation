// Fase 1 dos estilos visuais (docs/PLANO-ESTILOS.md): liga ao CSS os aspectos de "forma" do DS que hoje
// usam valores fixos do Tailwind (raio, sombra, espessura de borda, peso, duração) e expõe ganchos
// estáveis para a camada CSS do estilo (data-ds, data-variant, data-surface).
//
// Todos os valores padrão reproduzem o visual atual: aplicar o patch não muda nenhum pixel do DS.
// O patch é idempotente e roda no fim da extração (tools/extract-template.mjs). Quando a origem
// passar a ter os tokens, as âncoras deixam de casar e cada edição vira no-op.
import fs from "node:fs";
import path from "node:path";
import { ganchosNoArquivo } from "./ganchos.mjs";

/** Tokens de pele com os valores do estilo "corporativo" (o visual de sempre). */
export const TOKENS_PELE = [
  ["--border-width", "1px"],
  ["--border-width-strong", "2px"],
  ["--card-border-width", "var(--border-width)"],
  ["--control-border-width", "var(--border-width)"],
  ["--radius-3xl", "1.5rem"],
  ["--radius-card", "var(--radius)"],
  ["--radius-control", "calc(var(--radius) - 2px)"],
  ["--radius-control-brand", "var(--radius)"],
  // Sombras dos componentes (shadow-*): os valores padrão do Tailwind 3. --shadow-ui vem antes de
  // --shadow-ui-xs para o build-figma-tokens montar shadow.ui sem perder os filhos.
  ["--shadow-ui", "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"],
  ["--shadow-ui-xs", "0 0 #0000"],
  ["--shadow-ui-sm", "0 1px 2px 0 rgb(0 0 0 / 0.05)"],
  ["--shadow-ui-md", "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"],
  ["--shadow-ui-lg", "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"],
  ["--shadow-ui-xl", "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"],
  ["--shadow-ui-2xl", "0 25px 50px -12px rgb(0 0 0 / 0.25)"],
  ["--shadow-ui-inner", "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"],
  ["--shadow-inset", "none"],
  ["--shadow-hover", "var(--shadow-ui-md)"],
  ["--shadow-brand", "0 10px 15px -3px hsl(var(--primary) / 0.2), 0 4px 6px -4px hsl(var(--primary) / 0.2)"],
  ["--card-alpha", "1"],
  ["--surface-blur", "0px"],
  ["--surface-pattern", "none"],
  ["--font-black", "900"],
  ["--heading-transform", "none"],
  ["--icon-stroke", "2"],
  ["--duration-default", "150ms"],
  ["--ease-emphasis", "cubic-bezier(0.4, 0, 0.2, 1)"],
  ["--deco-hero", "none"],
  ["--deco-divider", "none"],
  ["--deco-pattern", "none"],
  ["--deco-texture", "none"],
  ["--chart-line-width", "2"],
  ["--chart-bar-radius", "0"],
  ["--chart-smooth", "0"],
  ["--chart-tooltip-radius", "8"],
];

/**
 * Cores dos campos de formulário (R2 do plano). O DS de referência fixa a borda, o hover/foco e o placeholder
 * dos campos em HEX no CSS base e no Input/Textarea; viram tokens com os mesmos valores. São HEX, e não
 * triplets HSL, para a recoloração da marca dar o mesmo pixel que dava nas classes. Os estilos que definem
 * --input fazem os campos seguirem os tokens semânticos (scripts/lib/estilos.mjs).
 */
export const TOKENS_CAMPOS = [
  ["--control-border", "#95ADFF"],
  ["--control-border-hover", "#2A4FDA"],
  ["--control-placeholder", "#96A1C0"],
  // Input/Textarea do DS: texto e placeholder no mesmo cinza, um tom diferente do placeholder dos campos crus
  ["--control-foreground", "#98A2C1"],
  ["--control-placeholder-input", "#98A2C1"],
];

const CSS_CAMPOS_ANCORA = "    --chart-tooltip-radius: 8;\n";
const CSS_CAMPOS = `${CSS_CAMPOS_ANCORA}    /* Campos de formulário: borda, hover e foco, placeholder e texto do Input/Textarea */
${TOKENS_CAMPOS.map(([k, v]) => `    ${k}: ${v};`).join("\n")}
`;
const TG_CAMPOS_ANCORA = '      { name: "--chart-tooltip-radius", value: "8" },\n';
const TG_CAMPOS = `${TG_CAMPOS_ANCORA}${TOKENS_CAMPOS.map(([k, v]) => `      { name: "${k}", value: "${v}" },`).join("\n")}\n`;

const CSS_BASE_CAMPOS_ANTES = `  /* Form fields — default border #95ADFF, hover #2A4FDA, placeholder #96A1C0 */
  input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]),
  select,
  textarea {
    border-color: #95ADFF;
    transition: border-color 0.15s ease;
  }
  input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):hover,
  select:hover,
  textarea:hover {
    border-color: #2A4FDA;
  }
  input::placeholder,
  textarea::placeholder,
  select {
    color: #96A1C0;
  }

  /* Checkbox e Radio — mesmas cores de linha do Select/Input */
  input[type="checkbox"],
  input[type="radio"] {
    border: 1px solid #95ADFF;
    accent-color: #2A4FDA;
    transition: border-color 0.15s ease;
  }
  input[type="checkbox"]:hover,
  input[type="radio"]:hover {
    border-color: #2A4FDA;
  }`;
const CSS_BASE_CAMPOS_DEPOIS = `  /* Form fields — borda (--control-border), hover (--control-border-hover) e placeholder (--control-placeholder) */
  input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]),
  select,
  textarea {
    border-color: var(--control-border);
    transition: border-color 0.15s ease;
  }
  input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):hover,
  select:hover,
  textarea:hover {
    border-color: var(--control-border-hover);
  }
  input::placeholder,
  textarea::placeholder,
  select {
    color: var(--control-placeholder);
  }

  /* Checkbox e Radio — mesmas cores de linha do Select/Input */
  input[type="checkbox"],
  input[type="radio"] {
    border: 1px solid var(--control-border);
    accent-color: var(--control-border-hover);
    transition: border-color 0.15s ease;
  }
  input[type="checkbox"]:hover,
  input[type="radio"]:hover {
    border-color: var(--control-border-hover);
  }`;

// Classes de cor do Input e do Textarea (iguais nos dois)
const CAMPO_CORES_ANTES = "border-[#95ADFF] bg-background px-3 py-2 text-base text-[#98A2C1] ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#98A2C1] hover:border-[#95ADFF] focus:border-[#2A4FDA] focus-visible:border-[#2A4FDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A4FDA]";
const CAMPO_CORES_DEPOIS = "border-[color:var(--control-border)] bg-background px-3 py-2 text-base text-[color:var(--control-foreground)] ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[color:var(--control-placeholder-input)] hover:border-[color:var(--control-border)] focus:border-[color:var(--control-border-hover)] focus-visible:border-[color:var(--control-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--control-border-hover)]";
const TEXTAREA_CORES_ANTES = CAMPO_CORES_ANTES.replace(" text-base text-[#98A2C1]", " text-sm text-[#98A2C1]").replace(" file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground", "");
const TEXTAREA_CORES_DEPOIS = CAMPO_CORES_DEPOIS.replace(" text-base text-[color:", " text-sm text-[color:").replace(" file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground", "");

const TAILWIND_RADIUS_ANTES = `      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },`;
const TAILWIND_RADIUS_DEPOIS = `      // Raio, sombra, espessura de borda e duração vêm dos tokens de pele (src/index.css): o estilo visual
      // do DS troca esses valores e as páginas acompanham sem editar classe nenhuma.
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "max(0px, calc(var(--radius) - 4px))",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        xs: "var(--shadow-ui-xs)",
        sm: "var(--shadow-ui-sm)",
        DEFAULT: "var(--shadow-ui)",
        md: "var(--shadow-ui-md)",
        lg: "var(--shadow-ui-lg)",
        xl: "var(--shadow-ui-xl)",
        "2xl": "var(--shadow-ui-2xl)",
        inner: "var(--shadow-ui-inner)",
        none: "none",
      },
      borderWidth: {
        DEFAULT: "var(--border-width)",
        2: "var(--border-width-strong)",
      },
      transitionDuration: {
        DEFAULT: "var(--duration-default)",
        100: "var(--duration-fast)",
        200: "var(--duration-normal)",
        300: "var(--duration-slow)",
        500: "var(--duration-slower)",
      },`;

const CSS_ANCORA = "    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);\n";
const CSS_TOKENS = `${CSS_ANCORA}
    /* === Estilo visual: tokens de pele ===
     * Forma, profundidade, peso e ritmo do DS. Os valores abaixo são os do estilo "corporativo"
     * (o visual padrão); o ds-build troca os que o estilo escolhido define. A marca continua
     * definindo as cores: nenhum estilo altera a escala da marca nem as cores semânticas. */
${TOKENS_PELE.map(([k, v]) => `    ${k}: ${v};`).join("\n")}
`;

const CSS_GANCHOS = `
/* === Estilo visual: ganchos ===
 * Traço dos ícones Lucide pelo token (só os que usam o traço padrão, 2). A camada do estilo
 * fica em src/styles/estilo.css, importada depois deste arquivo em src/main.tsx. */
@layer base {
  svg.lucide[stroke-width="2"] {
    stroke-width: var(--icon-stroke);
  }
}
`;

const ESTILO_CSS = `/* Camada CSS do estilo visual do DS.
 *
 * Vazia no estilo "corporativo" (padrão). O ds-build grava aqui o CSS do estilo escolhido:
 * o que os tokens de pele (src/index.css) não expressam, como blur, sombra interna em campos
 * ou hover que desloca o elemento.
 *
 * Ganchos estáveis dos componentes:
 *   [data-ds="button|card|input|textarea|select-trigger|checkbox|radio|switch|badge|alert|dialog|
 *              popover|dropdown|tabs-list|tabs-trigger|table|toast|tooltip|sidebar|header"]
 *   [data-ds="button"][data-variant="default|brand|outline|secondary|ghost|link|…"]
 *   [data-surface="marca"]  superfícies de marca (decoração só aparece nelas)
 */
`;

const ESTILO_TS = `/**
 * Estilo visual do DS (gerado pelo ds-build).
 *
 * A marca define cor, fonte, logo e voz; o estilo define forma, profundidade, peso e ritmo.
 * Os valores do estilo ficam nos tokens de pele de src/index.css e na camada src/styles/estilo.css.
 */
export const ESTILO = {
  id: "corporativo",
  nome: "Corporativo",
  temaPadrao: "light",
  layout: "padrao",
} as const;
`;

const INDEX_HTML_TEMA = `  <script>
    // Aplica o tema antes da primeira pintura (sem "piscar" quando o estilo abre em dark).
    // O padrão vem do estilo visual (src/config/estilo.ts); a escolha salva pelo usuário vence.
    (function () {
      var padrao = "light";
      try {
        var salvo = localStorage.getItem("brand-ds-theme");
        if ((salvo || padrao) === "dark") document.documentElement.classList.add("dark");
      } catch (e) {}
    })();
  </script>
`;

const USE_THEME_TEST = `import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Estilo que abre em dark (ex.: cyberpunk). O tema salvo pelo usuário continua vencendo.
vi.mock("@/config/estilo", () => ({
  ESTILO: { id: "teste", nome: "Teste", temaPadrao: "dark", layout: "padrao" },
}));

import { useTheme } from "../useTheme";

const KEY = "brand-ds-theme";

describe("useTheme com o tema padrão do estilo em dark", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("abre em dark quando não há tema salvo", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  it("a escolha salva vence o padrão do estilo", () => {
    localStorage.setItem(KEY, "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("valor salvo inválido cai no padrão do estilo", () => {
    localStorage.setItem(KEY, "sepia");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("alternar grava a escolha", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem(KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
`;

const ESTILO_TEST = `import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ESTILO } from "../estilo";

// O index.html aplica o tema antes da primeira pintura com o mesmo padrão do estilo: se os dois
// divergirem, o DS "pisca" do tema do index.html para o do useTheme no primeiro carregamento.
describe("estilo visual", () => {
  it("o tema padrão do index.html é o do estilo", () => {
    const html = readFileSync(resolve(__dirname, "../../../index.html"), "utf8");
    expect(/var padrao = "(light|dark)";/.exec(html)?.[1]).toBe(ESTILO.temaPadrao);
  });
});
`;

/** [arquivo, âncora da string de classes, nome do gancho]: data-ds entra antes do className={cn( da âncora. */
const GANCHOS = [
  ["src/components/ui/card.tsx", '"rounded-[var(--radius-card)] border-[length:var(--card-border-width)] bg-card', "card"],
  ["src/components/ui/input.tsx", '"flex h-10 w-full', "input"],
  ["src/components/ui/textarea.tsx", '"flex min-h-[80px] w-full', "textarea"],
  ["src/components/ui/select.tsx", '"flex h-10 w-full items-center justify-between', "select-trigger"],
  ["src/components/ui/select.tsx", '"relative z-50 max-h-96', "popover"],
  ["src/components/ui/checkbox.tsx", '"peer h-4 w-4 shrink-0', "checkbox"],
  ["src/components/ui/radio-group.tsx", '"aspect-square h-4 w-4', "radio"],
  ["src/components/ui/switch.tsx", '"peer inline-flex h-6 w-11', "switch"],
  ["src/components/ui/dialog.tsx", '"fixed left-[50%] top-[50%] z-50 grid', "dialog"],
  ["src/components/ui/popover.tsx", '"z-50 w-72', "popover"],
  ["src/components/ui/dropdown-menu.tsx", '"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', "dropdown"],
  ["src/components/ui/tabs.tsx", '"inline-flex h-10 items-center justify-center', "tabs-list"],
  ["src/components/ui/tabs.tsx", '"inline-flex items-center justify-center whitespace-nowrap', "tabs-trigger"],
  ["src/components/ui/table.tsx", '"w-full caption-bottom', "table"],
  ["src/components/ui/tooltip.tsx", '"z-50 overflow-hidden rounded-md border bg-popover', "tooltip"],
];

/**
 * Trocas literais por arquivo: [arquivo, antes, depois, marca?]. A troca conta como aplicada quando o arquivo
 * já tem o "depois" ou, se houver, a "marca": blocos que trocas seguintes completam (tokens de campo dentro
 * do bloco de tokens de pele) deixam de ser iguais ao "depois", mas não podem entrar de novo.
 */
const TROCAS = [
  // Card, botões e campos: raio e borda pelos tokens (mesmos valores de antes no corporativo)
  ["src/components/ui/card.tsx", '"rounded-lg border bg-card', '"rounded-[var(--radius-card)] border-[length:var(--card-border-width)] bg-card'],
  ["src/components/ui/button.tsx", '"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ', '"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] '],
  ["src/components/ui/button.tsx", '"border border-input bg-background hover:bg-accent', '"border-[length:var(--control-border-width)] border-input bg-background hover:bg-accent'],
  ["src/components/ui/button.tsx", '"rounded-lg border-2 border-primary bg-primary', '"rounded-[var(--radius-control-brand)] border-2 border-primary bg-primary'],
  ["src/components/ui/button.tsx", '"h-9 rounded-md px-3"', '"h-9 rounded-[var(--radius-control)] px-3"'],
  ["src/components/ui/button.tsx", '"h-11 rounded-md px-8"', '"h-11 rounded-[var(--radius-control)] px-8"'],
  ["src/components/ui/button.tsx", "return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;",
    'return <Comp data-ds="button" data-variant={variant ?? "default"} className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;'],
  ["src/components/ui/input.tsx", '"flex h-10 w-full rounded-md border border-[', '"flex h-10 w-full rounded-[var(--radius-control)] border-[length:var(--control-border-width)] border-['],
  ["src/components/ui/textarea.tsx", '"flex min-h-[80px] w-full rounded-md border border-[', '"flex min-h-[80px] w-full rounded-[var(--radius-control)] border-[length:var(--control-border-width)] border-['],
  ["src/components/ui/select.tsx", "justify-between rounded-md border border-input bg-background", "justify-between rounded-[var(--radius-control)] border-[length:var(--control-border-width)] border-input bg-background"],
  ["src/components/ui/dialog.tsx", "data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", "data-[state=open]:slide-in-from-top-[48%] sm:rounded-[var(--radius-card)]"],
  ["src/components/ui/badge.tsx", "return <div className={cn(badgeVariants({ variant }), className)} {...props} />;", 'return <div data-ds="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;'],
  ["src/components/ui/alert.tsx", '<div ref={ref} role="alert" className=', '<div ref={ref} role="alert" data-ds="alert" className='],
  ["src/components/ui/toast.tsx", "return <ToastPrimitives.Root ref={ref} className=", 'return <ToastPrimitives.Root ref={ref} data-ds="toast" className='],
  // Sombra colorida: shadow-primary/20 não funciona com sombras em var(); vira um token próprio
  ["src/pages/FundamentosPage.tsx", "text-xs font-bold shadow-lg shadow-primary/20", "text-xs font-bold shadow-[var(--shadow-brand)]"],
  ["src/pages/ErrorPageTemplate.tsx", "transition-all shadow-lg shadow-primary/20", "transition-all shadow-[var(--shadow-brand)]"],
  // Casca do DS: header (superfície de marca) e menu lateral
  ["src/components/DSLayout.tsx", '<header className="h-[92px]', '<header data-ds="header" data-surface="marca" className="h-[92px]', 'data-ds="header"'],
  ["src/components/DSLayout.tsx", '<aside id="mobile-sidebar" ', '<aside id="mobile-sidebar" data-ds="sidebar" '],
  ["src/components/DSLayout.tsx", '<aside id="desktop-sidebar" ', '<aside id="desktop-sidebar" data-ds="sidebar" '],
  // Tema: padrão vem do estilo, a escolha salva vence
  ["src/hooks/useTheme.ts", 'import { useState, useEffect, useCallback } from "react";\n', 'import { useState, useEffect, useCallback } from "react";\nimport { ESTILO } from "@/config/estilo";\n'],
  ["src/hooks/useTheme.ts", 'return stored === "dark" ? "dark" : "light";\n    }\n    return "light";', 'return stored === "dark" || stored === "light" ? stored : ESTILO.temaPadrao;\n    }\n    return ESTILO.temaPadrao;'],
  ["src/main.tsx", 'import "./index.css";\n', 'import "./index.css";\nimport "./styles/estilo.css";\n'],
  ["tailwind.config.ts", TAILWIND_RADIUS_ANTES, TAILWIND_RADIUS_DEPOIS],
  ["tailwind.config.ts", 'black:    "900",', 'black:    "var(--font-black)",'],
  ["src/index.css", CSS_ANCORA, CSS_TOKENS, "/* === Estilo visual: tokens de pele ==="],
  // Cores de campo: tokens logo depois dos tokens de pele (âncora que só existe depois da troca acima)
  ["src/index.css", CSS_CAMPOS_ANCORA, CSS_CAMPOS],
  ["src/index.css", CSS_BASE_CAMPOS_ANTES, CSS_BASE_CAMPOS_DEPOIS],
  ["src/components/ui/input.tsx", CAMPO_CORES_ANTES, CAMPO_CORES_DEPOIS],
  ["src/components/ui/textarea.tsx", TEXTAREA_CORES_ANTES, TEXTAREA_CORES_DEPOIS],
  ["index.html", "\n</head>", `\n${INDEX_HTML_TEMA}</head>`],
  // Gráficos: linha, barra e tooltip seguem o estilo
  ["src/lib/echarts/brandTheme.ts", "export function buildBrandTheme(mode: BrandThemeMode): BrandEchartsTheme {\n",
    `/** Lê um token numérico (px ou sem unidade) dos tokens de pele do estilo visual. */
function readNumber(name: string, fallback: number): number {
  if (typeof window === "undefined" || typeof document === "undefined") return fallback;
  const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(n) ? n : fallback;
}

export function buildBrandTheme(mode: BrandThemeMode): BrandEchartsTheme {
  const lineWidth = readNumber("--chart-line-width", 2);
  const barRadius = readNumber("--chart-bar-radius", 0);
  const smooth = readNumber("--chart-smooth", 0) > 0;
`],
  ["src/lib/echarts/brandTheme.ts", "      borderWidth: 1,\n      borderRadius: 8,\n", '      borderWidth: readNumber("--card-border-width", 1),\n      borderRadius: readNumber("--chart-tooltip-radius", 8),\n'],
  ["src/lib/echarts/brandTheme.ts", '    bar: { emphasis: { focus: "series", itemStyle: { shadowBlur: 10, shadowColor: shadow } } },\n    line: { emphasis: { focus: "series" } },',
    `    bar: {
      ...(barRadius > 0 ? { itemStyle: { borderRadius: barRadius } } : {}),
      emphasis: { focus: "series", itemStyle: { shadowBlur: 10, shadowColor: shadow } },
    },
    line: {
      ...(lineWidth !== 2 ? { lineStyle: { width: lineWidth } } : {}),
      ...(smooth ? { smooth: true } : {}),
      emphasis: { focus: "series" },
    },`],
  // Catálogo /tokens: grupo dos tokens de pele
  ["src/data/tokenGroups.ts", '  {\n    id: "zindex",', `  {
    id: "estilo",
    title: "Estilo visual",
    description:
      "Forma, profundidade e ritmo do DS: espessura de borda, raios de componentes, sombras de interface e traço de ícones. O estilo visual escolhido na geração define estes valores; a marca continua definindo as cores.",
    tokens: [
${TOKENS_PELE.filter(([k]) => !k.startsWith("--deco-")).map(([k, v]) => `      { name: "${k}", value: "${v}" },`).join("\n")}
    ],
  },
  {
    id: "zindex",`, 'id: "estilo",'],
  ["src/data/tokenGroups.ts", TG_CAMPOS_ANCORA, TG_CAMPOS],
  // Figma (DTCG): espessuras e blur como dimensão, alpha e traço como número; manifesto com o estilo
  ["scripts/build-figma-tokens.mjs", 'const isDim = (n) => /^(space|text|radius|bp)-/.test(n) || n === "radius";',
    'const isDim = (n) => /^(space|text|radius|bp)-/.test(n) || n === "radius" || /border-width/.test(n) || n === "surface-blur";\nconst isNum = (n) => n === "card-alpha" || n === "icon-stroke" || n.startsWith("chart-");'],
  ["scripts/build-figma-tokens.mjs", '  if (isZ(n)) return "number";\n', '  if (isZ(n)) return "number";\n  if (isNum(n)) return "number";\n'],
  ["scripts/build-figma-tokens.mjs", "const manifest = {\n  name: \"__BRAND_NAME__ Design System\",\n",
    `// Estilo visual do DS (src/config/estilo.ts)
const estiloTs = readFileSync(resolve(ROOT, "src/config/estilo.ts"), "utf8");
const estilo = { id: /id: "([^"]+)"/.exec(estiloTs)?.[1] ?? "corporativo", nome: /nome: "([^"]+)"/.exec(estiloTs)?.[1] ?? "Corporativo" };

const manifest = {
  name: "__BRAND_NAME__ Design System",
  estilo,
`],
];

/** Arquivos novos (não sobrescreve se já existirem). */
/**
 * Superfícies de marca (seção 5.4 do plano; Fase 4): [arquivo, âncora que começa em "<tag", papel].
 * Recebem data-surface="marca" e data-marca="<papel>", em todas as ocorrências da âncora. A decoração gerada
 * (nível 3) só aparece nelas, e o papel escolhe onde ela entra: arte à direita do hero, do painel e da capa;
 * faixa no header, no rodapé e nos estados vazios; padrão de fundo nas páginas de erro.
 */
const SUPERFICIES_MARCA = [
  ["src/components/DSLayout.tsx", '<header data-ds="header" data-surface="marca" className="h-[92px]', "header"],
  ["src/pages/HomePage.tsx", '<div className="rounded-xl bg-primary text-primary-foreground p-8 md:p-10 mb-10">', "hero"],
  ["src/pages/PaginaAutenticacaoPage.tsx", '<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted">', "painel"],
  ["src/pages/CadastroPage.tsx", '<div className="hidden lg:flex lg:w-1/2 relative bg-[#2A4FDA] overflow-hidden">', "painel"],
  ["src/pages/TwoFactorPage.tsx", '<div className="hidden lg:flex lg:w-1/2 relative bg-[#2A4FDA] overflow-hidden">', "painel"],
  ["src/pages/ModalAcessoTemplatePage.tsx", '<div className="bg-primary text-primary-foreground p-6 flex flex-col items-center gap-2">', "painel"],
  ["src/pages/ErrorPageTemplate.tsx", '<div className="min-h-screen bg-brand-primary-50 flex flex-col items-center justify-center p-4">', "erro"],
  ["src/pages/NotFound.tsx", '<div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4', "erro"],
  ["src/components/templates/FooterTemplate.tsx", "<footer className={`${bgClass} border-t", "rodape"],
  ["src/components/templates/HubPaineisTemplate.tsx", '<header className="bg-[#2A4FDA] text-white">', "capa"],
  ["src/pages/ComponentesPage.tsx", '<div className="text-center py-12 border border-dashed border-border rounded-lg">', "vazio"],
];

const NOVOS = [
  ["src/styles/estilo.css", ESTILO_CSS],
  ["src/config/estilo.ts", ESTILO_TS],
  ["src/hooks/__tests__/useTheme.test.ts", USE_THEME_TEST],
  ["src/config/__tests__/estilo.test.ts", ESTILO_TEST],
];

/** .tsx de src/, fora de src/components/ui/ (os componentes já têm ganchos próprios) e dos testes, em ordem estável. */
function arquivosTsx(dir) {
  const out = [];
  (function walk(rel) {
    const abs = path.join(dir, rel);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) { if (r !== "src/components/ui" && e.name !== "__tests__") walk(r); continue; }
      if (e.name.endsWith(".tsx") && !/\.(test|spec)\.tsx$/.test(e.name)) out.push(r);
    }
  })("src");
  return out;
}

/**
 * Aplica o patch em uma pasta de template (ou no frontend de origem).
 * Devolve { aplicadas, jaAplicadas, faltando, ganchos }: "faltando" lista âncoras que não casaram e cujo
 * resultado também não está no arquivo (a origem mudou: revise a troca); "ganchos" traz os elementos montados
 * à mão que ganharam data-ds ({ casou }) e os que ficaram para revisão ({ revisar }).
 */
export function tokenizar(dir) {
  const res = { aplicadas: [], jaAplicadas: 0, faltando: [] };
  const P = (rel) => path.join(dir, rel);
  const cache = new Map();
  const ler = (rel) => {
    if (!cache.has(rel)) cache.set(rel, fs.existsSync(P(rel)) ? fs.readFileSync(P(rel), "utf8") : null);
    return cache.get(rel);
  };
  // Arquivos com CRLF: as âncoras são escritas com \n
  const eol = (text) => (text.includes("\r\n") ? "\r\n" : "\n");

  for (const [rel, antes, depois, marca] of TROCAS) {
    let text = ler(rel);
    if (text === null) { res.faltando.push(`${rel}: arquivo não existe`); continue; }
    const nl = eol(text);
    const a = antes.split("\n").join(nl), d = depois.split("\n").join(nl);
    if (text.includes(d) || (marca && text.includes(marca))) { res.jaAplicadas++; continue; }
    if (!text.includes(a)) { res.faltando.push(`${rel}: âncora não encontrada (${antes.split("\n")[0].slice(0, 70)})`); continue; }
    cache.set(rel, text.replace(a, d));
    res.aplicadas.push(rel);
  }

  for (const [rel, ancora, nome] of GANCHOS) {
    const text = ler(rel);
    if (text === null) { res.faltando.push(`${rel}: arquivo não existe`); continue; }
    const at = text.indexOf(ancora);
    if (at < 0) { res.faltando.push(`${rel}: âncora do gancho ${nome} não encontrada`); continue; }
    const cn = text.lastIndexOf("className={cn(", at);
    const inicio = text.lastIndexOf("<", cn);
    if (cn < 0 || text.slice(inicio, cn).includes(`data-ds="${nome}"`)) { res.jaAplicadas++; continue; }
    // className sozinho na linha: o gancho vai numa linha própria, com o mesmo recuo; senão, na mesma linha
    const inicioLinha = text.lastIndexOf("\n", cn) + 1;
    const recuo = text.slice(inicioLinha, cn);
    const gancho = /^\s*$/.test(recuo) ? `data-ds="${nome}"${eol(text)}${recuo}` : `data-ds="${nome}" `;
    cache.set(rel, text.slice(0, cn) + gancho + text.slice(cn));
    res.aplicadas.push(`${rel} [data-ds="${nome}"]`);
  }

  // Ganchos de CSS no fim do index.css
  {
    const rel = "src/index.css";
    const text = ler(rel);
    if (text !== null && !text.includes("svg.lucide[stroke-width=")) {
      cache.set(rel, text.replace(/\s*$/, "\n") + CSS_GANCHOS.split("\n").join(eol(text)));
      res.aplicadas.push(`${rel} [ganchos]`);
    } else if (text !== null) res.jaAplicadas++;
  }

  for (const [rel, conteudo] of NOVOS) {
    if (fs.existsSync(P(rel))) { res.jaAplicadas++; continue; }
    cache.set(rel, conteudo);
    res.aplicadas.push(`${rel} (novo)`);
  }

  // Superfícies de marca: data-surface e data-marca em todas as ocorrências da âncora
  for (const [rel, ancora, papel] of SUPERFICIES_MARCA) {
    let text = ler(rel);
    if (text === null) { res.faltando.push(`${rel}: arquivo não existe`); continue; }
    const tag = /^<([A-Za-z]+)/.exec(ancora)[1];
    const marcado = `<${tag} data-surface="marca" data-marca="${papel}"`;
    const semMarca = ancora.replace(` data-surface="marca"`, "");
    const ancoraMarcada = semMarca.replace(`<${tag}`, marcado);
    if (!text.includes(ancora) && !text.includes(ancoraMarcada)) { res.faltando.push(`${rel}: superfície de marca "${papel}" não encontrada`); continue; }
    if (!text.includes(ancora)) { res.jaAplicadas++; continue; }
    cache.set(rel, text.split(ancora).join(ancoraMarcada));
    res.aplicadas.push(`${rel} [data-marca="${papel}"]`);
  }

  // Ganchos nos elementos montados à mão (R1): <button>, campos e cards das páginas e templates
  res.ganchos = { casou: [], revisar: [] };
  for (const rel of arquivosTsx(dir)) {
    const text = ler(rel);
    const g = ganchosNoArquivo(text);
    for (const c of g.casou) res.ganchos.casou.push({ arquivo: rel, ...c });
    for (const r of g.revisar) res.ganchos.revisar.push({ arquivo: rel, ...r });
    if (g.texto !== text) {
      cache.set(rel, g.texto);
      res.aplicadas.push(`${rel} [${g.casou.length} gancho(s)]`);
    }
  }

  for (const [rel, text] of cache) {
    if (text === null) continue;
    fs.mkdirSync(path.dirname(P(rel)), { recursive: true });
    if (!fs.existsSync(P(rel)) || fs.readFileSync(P(rel), "utf8") !== text) fs.writeFileSync(P(rel), text);
  }
  return res;
}
