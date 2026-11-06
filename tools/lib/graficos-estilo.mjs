// Gráficos que seguem o estilo além do tema ECharts (docs/PLANO-ESTILOS.md, seção 6.11): símbolos de série do Bauhaus.
//
// O tema (brandTheme.ts) não consegue alternar o símbolo entre séries: ele vale igual para todas. A alternância é feita
// pelo BrandChart, antes do setOption, lendo o token --chart-symbol-variety. Com o token em 0 (todos os estilos, menos o
// Bauhaus) o option passa inalterado. Patch idempotente no fim da extração, como o resto (tokenizar.mjs).
import fs from "node:fs";

const lerPatch = (nome) => fs.readFileSync(new URL(`./patch/${nome}`, import.meta.url), "utf8");

export const GRAFICOS_NOVOS = [
  ["src/lib/echarts/simbolos.ts", lerPatch("simbolos.ts")],
  ["src/lib/echarts/__tests__/simbolos.test.ts", lerPatch("simbolos.test.ts")],
  ["src/lib/echarts/estiloSeries.ts", lerPatch("estiloSeries.ts")],
  ["src/lib/echarts/__tests__/estiloSeries.test.ts", lerPatch("estiloSeries.test.ts")],
  ["src/lib/echarts/temaCores.ts", lerPatch("temaCores.ts")],
  ["src/lib/echarts/__tests__/temaCores.test.ts", lerPatch("temaCores.test.ts")],
];

/** [arquivo, antes, depois, marca?] (mesmo formato de TROCAS em tokenizar.mjs). */
export const GRAFICOS_TROCAS = [
  // Token novo no CSS e no catálogo /tokens (o template já tokenizado não passa de novo pela lista TOKENS_PELE)
  ["src/index.css", "    --chart-smooth: 0;\n", "    --chart-smooth: 0;\n    --chart-symbol-variety: 0;\n", "--chart-symbol-variety"],
  ["src/data/tokenGroups.ts", '      { name: "--chart-smooth", value: "0" },\n', '      { name: "--chart-smooth", value: "0" },\n      { name: "--chart-symbol-variety", value: "0" },\n', "--chart-symbol-variety"],
  // --chart-grid-soft: grade contínua e suave no lugar da tracejada (Neumorfismo). Em 0 o tema fica como era.
  ["src/index.css", "    --chart-symbol-variety: 0;\n", "    --chart-symbol-variety: 0;\n    --chart-grid-soft: 0;\n", "--chart-grid-soft"],
  ["src/data/tokenGroups.ts", '      { name: "--chart-symbol-variety", value: "0" },\n', '      { name: "--chart-symbol-variety", value: "0" },\n      { name: "--chart-grid-soft", value: "0" },\n', "--chart-grid-soft"],
  ["src/lib/echarts/brandTheme.ts", '  const smooth = readNumber("--chart-smooth", 0) > 0;\n', '  const smooth = readNumber("--chart-smooth", 0) > 0;\n  const gridSoft = readNumber("--chart-grid-soft", 0) > 0;\n', "gridSoft"],
  ["src/lib/echarts/brandTheme.ts", '  const splitLine = { show: true, lineStyle: { color: border, type: "dashed" as const } };\n',
    '  const splitLine = {\n    show: true,\n    lineStyle: gridSoft ? { color: readToken("--border", 0.3), type: "solid" as const, width: 1 } : { color: border, type: "dashed" as const },\n  };\n'],
  ["src/components/charts/BrandChart.tsx", 'import { cn } from "@/lib/utils";\n', 'import { cn } from "@/lib/utils";\nimport { aplicarSimbolos } from "@/lib/echarts/simbolos";\n'],
  ["src/components/charts/BrandChart.tsx", "chart.setOption({ ...option, animation: reduced ? false : option.animation ?? true }, notMerge);",
    "chart.setOption(aplicarSimbolos({ ...option, animation: reduced ? false : option.animation ?? true }), notMerge);", "aplicarSimbolos("],
  // Camada 2 dos gráficos (Neumorfismo): trilha das barras e dos medidores, área em degradê, vão e cantos da rosca.
  // Os três tokens são numéricos: --chart-track e --chart-area-gradient ligam (1) ou desligam (0); --chart-pie-gap é o vão em graus.
  ["src/index.css", "    --chart-grid-soft: 0;\n", "    --chart-grid-soft: 0;\n    --chart-track: 0;\n    --chart-area-gradient: 0;\n    --chart-pie-gap: 0;\n", "--chart-track"],
  ["src/data/tokenGroups.ts", '      { name: "--chart-grid-soft", value: "0" },\n',
    '      { name: "--chart-grid-soft", value: "0" },\n      { name: "--chart-track", value: "0" },\n      { name: "--chart-area-gradient", value: "0" },\n      { name: "--chart-pie-gap", value: "0" },\n', "--chart-track"],
  ["src/lib/echarts/brandTheme.ts", '  const gridSoft = readNumber("--chart-grid-soft", 0) > 0;\n', '  const gridSoft = readNumber("--chart-grid-soft", 0) > 0;\n  const pieGap = readNumber("--chart-pie-gap", 0);\n', "pieGap"],
  ["src/lib/echarts/brandTheme.ts", "    pie: {\n      emphasis: {\n", "    pie: {\n      ...(pieGap > 0 ? { padAngle: pieGap, itemStyle: { borderRadius: barRadius } } : {}),\n      emphasis: {\n"],
  ["src/components/charts/BrandChart.tsx", 'import { aplicarSimbolos } from "@/lib/echarts/simbolos";\n', 'import { aplicarSimbolos } from "@/lib/echarts/simbolos";\nimport { aplicarEstiloSeries } from "@/lib/echarts/estiloSeries";\n', "aplicarEstiloSeries"],
  ["src/components/charts/BrandChart.tsx", "chart.setOption(aplicarSimbolos({ ...option, animation: reduced ? false : option.animation ?? true }), notMerge);",
    "chart.setOption(aplicarEstiloSeries(aplicarSimbolos({ ...option, animation: reduced ? false : option.animation ?? true })), notMerge);", "aplicarEstiloSeries("],
  // Tema vivo (Neumorfismo): as cores de token que os presets guardam no carregamento do módulo são lidas de novo a cada
  // troca de tema. brandTheme.ts lembra de qual token veio cada cor; temaCores.ts troca antes do setOption.
  // --chart-theme-sync liga (1) ou desliga (0).
  ["src/index.css", "    --chart-pie-gap: 0;\n", "    --chart-pie-gap: 0;\n    --chart-theme-sync: 0;\n", "--chart-theme-sync"],
  ["src/data/tokenGroups.ts", '      { name: "--chart-pie-gap", value: "0" },\n', '      { name: "--chart-pie-gap", value: "0" },\n      { name: "--chart-theme-sync", value: "0" },\n', "--chart-theme-sync"],
  ["src/lib/echarts/brandTheme.ts",
    "  const [r, g, b] = hslTokenToRgb(value);\n  return alpha === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;\n}\n",
    "  const [r, g, b] = hslTokenToRgb(value);\n  const cor = alpha === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;\n  CORES_LIDAS.set(cor, { token: key, alpha });\n  return cor;\n}\n\n/** Cores devolvidas por readToken e o token de cada uma: temaCores.ts usa isto para ler de novo quando o tema muda. */\nconst CORES_LIDAS = new Map<string, { token: string; alpha?: number }>();\nexport const tokenDaCor = (cor: string) => CORES_LIDAS.get(cor);\n",
    "CORES_LIDAS"],
  ["src/components/charts/BrandChart.tsx", 'import { aplicarEstiloSeries } from "@/lib/echarts/estiloSeries";\n', 'import { aplicarEstiloSeries } from "@/lib/echarts/estiloSeries";\nimport { aplicarTemaVivo } from "@/lib/echarts/temaCores";\n', "aplicarTemaVivo"],
  ["src/components/charts/BrandChart.tsx", "chart.setOption(aplicarEstiloSeries(aplicarSimbolos({ ...option, animation: reduced ? false : option.animation ?? true })), notMerge);",
    "chart.setOption(aplicarEstiloSeries(aplicarSimbolos(aplicarTemaVivo({ ...option, animation: reduced ? false : option.animation ?? true }))), notMerge);"],
  // useTheme() tem estado próprio em cada chamada: o BrandChart não vê o botão de tema do cabeçalho. Com o token ligado
  // o tema vem da classe do <html>.
  ["src/components/charts/BrandChart.tsx", 'import { aplicarTemaVivo } from "@/lib/echarts/temaCores";\n', 'import { aplicarTemaVivo, useTemaDoDocumento } from "@/lib/echarts/temaCores";\n', "useTemaDoDocumento }"],
  // Camada 3 dos gráficos (Neumorfismo): relevo nas marcas. --chart-mark-depth é o desfoque da sombra em px (0 desliga).
  ["src/index.css", "    --chart-theme-sync: 0;\n", "    --chart-theme-sync: 0;\n    --chart-mark-depth: 0;\n", "--chart-mark-depth"],
  ["src/data/tokenGroups.ts", '      { name: "--chart-theme-sync", value: "0" },\n', '      { name: "--chart-theme-sync", value: "0" },\n      { name: "--chart-mark-depth", value: "0" },\n', "--chart-mark-depth"],
  ["src/components/charts/BrandChart.tsx", "  const { theme } = useTheme();\n", "  const { theme: temaSalvo } = useTheme();\n  const theme = useTemaDoDocumento(temaSalvo);\n", "useTemaDoDocumento(temaSalvo)"],
];
