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
];

/** [arquivo, antes, depois, marca?] (mesmo formato de TROCAS em tokenizar.mjs). */
export const GRAFICOS_TROCAS = [
  // Token novo no CSS e no catálogo /tokens (o template já tokenizado não passa de novo pela lista TOKENS_PELE)
  ["src/index.css", "    --chart-smooth: 0;\n", "    --chart-smooth: 0;\n    --chart-symbol-variety: 0;\n", "--chart-symbol-variety"],
  ["src/data/tokenGroups.ts", '      { name: "--chart-smooth", value: "0" },\n', '      { name: "--chart-smooth", value: "0" },\n      { name: "--chart-symbol-variety", value: "0" },\n', "--chart-symbol-variety"],
  ["src/components/charts/BrandChart.tsx", 'import { cn } from "@/lib/utils";\n', 'import { cn } from "@/lib/utils";\nimport { aplicarSimbolos } from "@/lib/echarts/simbolos";\n'],
  ["src/components/charts/BrandChart.tsx", "chart.setOption({ ...option, animation: reduced ? false : option.animation ?? true }, notMerge);",
    "chart.setOption(aplicarSimbolos({ ...option, animation: reduced ? false : option.animation ?? true }), notMerge);"],
];
