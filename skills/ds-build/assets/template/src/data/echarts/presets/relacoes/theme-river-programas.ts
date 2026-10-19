import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPaletteEstendida();

const meses = [
  "2025-01-01", "2025-02-01", "2025-03-01", "2025-04-01", "2025-05-01", "2025-06-01",
  "2025-07-01", "2025-08-01", "2025-09-01", "2025-10-01", "2025-11-01", "2025-12-01",
];

const series: Record<string, number[]> = {
  Empreender: [42, 48, 55, 61, 70, 66, 78, 84, 80, 92, 101, 58],
  AGI: [64, 70, 82, 88, 95, 104, 99, 112, 108, 120, 131, 76],
  "Programa Inova": [30, 36, 41, 38, 52, 60, 66, 71, 68, 74, 82, 46],
  "Visita Técnica": [120, 128, 118, 140, 152, 146, 164, 175, 168, 182, 196, 128],
  "Empreender Mais": [22, 26, 31, 29, 36, 42, 48, 52, 49, 58, 64, 38],
};

export const dados: [string, number, string][] = Object.entries(series).flatMap(([nome, valores]) =>
  valores.map((v, i) => [meses[i], v, nome] as [string, number, string]),
);

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "line", lineStyle: { color: readToken("--border"), width: 1 } },
    valueFormatter: (v) => formatarNumero(v as number),
  },
  legend: { top: 0, left: "left", data: Object.keys(series) },
  color: palette.slice(10),
  singleAxis: {
    top: 56,
    bottom: 24,
    left: 8,
    right: 16,
    type: "time",
    axisLabel: {
      color: readToken("--muted-foreground"),
      fontSize: 11,
      formatter: (valor: number) => {
        const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return nomes[new Date(valor).getUTCMonth()];
      },
    },
    axisTick: { lineStyle: { color: readToken("--border") } },
    axisLine: { lineStyle: { color: readToken("--border") } },
  },
  series: [
    {
      type: "themeRiver",
      data: dados,
      emphasis: { focus: "series", itemStyle: { shadowBlur: 12, shadowColor: readToken("--primary", 0.35) } },
      label: { show: false },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPaletteEstendida();
const meses = ["2025-01-01", "2025-02-01", "2025-03-01", "2025-04-01", "2025-05-01", "2025-06-01"];
const series: Record<string, number[]> = {
  Empreender: [42, 48, 55, 61, 70, 66],
  AGI: [64, 70, 82, 88, 95, 104],
  "Programa Inova": [30, 36, 41, 38, 52, 60],
  "Visita Técnica": [120, 128, 118, 140, 152, 146],
  "Empreender Mais": [22, 26, 31, 29, 36, 42],
};
const dados = Object.entries(series).flatMap(([nome, valores]) => valores.map((v, i) => [meses[i], v, nome]));

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left", data: Object.keys(series) },
  color: palette.slice(10),
  singleAxis: {
    top: 56, bottom: 24, left: 8, right: 16, type: "time",
    axisLabel: { color: readToken("--muted-foreground"), fontSize: 11 },
  },
  series: [{ type: "themeRiver", data: dados, emphasis: { focus: "series" }, label: { show: false } }],
};

export function ProgramasThemeRiverChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Theme river de cinco programas ao longo de doze meses, com cores da paleta estendida."
    />
  );
}`;

export const themeRiverProgramas: ChartPreset = {
  id: "theme-river-programas",
  nome: "Theme River de Programas",
  categoria: "relacoes",
  descricao:
    "ThemeRiver de cinco programas ao longo de doze meses usando as cores complementares da paleta estendida.",
  tags: ["themeRiver", "programas", "paleta estendida", "12 meses"],
  option,
  codigoReact,
  quandoUsar: [
    "Evolução da participação de cinco ou mais programas no tempo",
    "Narrativas visuais de ganho e perda de espaço relativo",
    "Doze ou mais períodos",
  ],
  quandoNaoUsar: [
    "Leitura precisa de valores — prefira áreas empilhadas",
    "Poucos períodos",
    "Séries com zeros ou valores negativos",
  ],
  acessibilidade: [
    "Legenda obrigatória: a faixa é identificada apenas pela cor",
    "Tooltip por eixo com todos os programas do mês em pt-BR",
    "Cores complementares escolhidas por diferença de matiz entre vizinhas",
  ],
  ariaLabel:
    "Theme river de cinco programas ao longo de 2025. Visita Técnica mantém a faixa mais larga, com pico de 196 em novembro; todos os programas recuam em dezembro.",
  altura: 380,
};

export default themeRiverProgramas;
