import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const regioes = ["Porto Central", "Vale do Sul", "Região Central", "Litoral Leste", "Serra Alta", "Planalto Oeste"];

/** [mínimo, Q1, mediana, Q3, máximo] das notas de NPS por macrorregião */
export const caixas: number[][] = [
  [42, 58, 68, 78, 92],
  [38, 54, 66, 76, 88],
  [30, 48, 60, 72, 86],
  [44, 60, 71, 82, 94],
  [34, 52, 63, 74, 90],
  [26, 44, 57, 68, 82],
];

/** [índice da região, valor discrepante] */
export const outliers: number[][] = [
  [0, 12],
  [1, 8],
  [2, 100],
  [4, 6],
  [5, 100],
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { seriesType: string; name: string; value: number[]; dataIndex: number };
      if (params.seriesType === "scatter") {
        return `${regioes[params.value[0]]}<br/>Discrepante: <strong>${formatarNumero(params.value[1])}</strong>`;
      }
      const v = params.value;
      return `<strong>${regioes[params.dataIndex]}</strong><br/>Máximo: ${formatarNumero(v[5])}<br/>Q3: ${formatarNumero(v[4])}<br/>Mediana: ${formatarNumero(v[3])}<br/>Q1: ${formatarNumero(v[2])}<br/>Mínimo: ${formatarNumero(v[1])}`;
    },
  },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 40, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: regioes, axisLabel: { rotate: 20 } },
  yAxis: { type: "value", name: "Nota NPS", min: 0, max: 100 },
  series: [
    {
      name: "Distribuição do NPS",
      type: "boxplot",
      data: caixas,
      itemStyle: { color: readToken("--primary", 0.18), borderColor: palette[0], borderWidth: 2 },
      emphasis: { itemStyle: { borderColor: palette[1] } },
    },
    {
      name: "Discrepantes",
      type: "scatter",
      data: outliers,
      symbolSize: 8,
      itemStyle: { color: palette[4] },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const regioes = ["Porto Central", "Vale do Sul", "Região Central", "Litoral Leste", "Serra Alta", "Planalto Oeste"];
const caixas = [
  [42, 58, 68, 78, 92], [38, 54, 66, 76, 88], [30, 48, 60, 72, 86],
  [44, 60, 71, 82, 94], [34, 52, 63, 74, 90], [26, 44, 57, 68, 82],
];
const outliers = [[0, 12], [1, 8], [2, 100], [4, 6], [5, 100]];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 40, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: regioes, axisLabel: { rotate: 20 } },
  yAxis: { type: "value", name: "Nota NPS", min: 0, max: 100 },
  series: [
    {
      name: "Distribuição do NPS",
      type: "boxplot",
      data: caixas,
      itemStyle: { color: readToken("--primary", 0.18), borderColor: palette[0], borderWidth: 2 },
    },
    { name: "Discrepantes", type: "scatter", data: outliers, symbolSize: 8, itemStyle: { color: palette[4] } },
  ],
};

export function NpsBoxplotChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Boxplot das notas de NPS por macrorregião. Litoral Leste tem a maior mediana, 71, e Planalto Oeste a menor, 57. Há cinco notas discrepantes, entre 6 e 100."
    />
  );
}`;

export const boxplot: ChartPreset = {
  id: "boxplot",
  nome: "Boxplot com Discrepantes",
  categoria: "distribuicao",
  descricao:
    "Distribuição das notas de NPS por macrorregião, com quartis, mediana e série de valores discrepantes sobreposta em scatter.",
  tags: ["boxplot", "quartis", "NPS", "outliers"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar a dispersão de uma métrica entre grupos, não apenas a média",
    "Evidenciar assimetria e presença de valores extremos",
    "Pesquisas de satisfação, tempos de atendimento, notas de avaliação",
  ],
  quandoNaoUsar: [
    "Públicos sem familiaridade estatística sem legenda explicativa",
    "Amostras muito pequenas (menos de ~10 observações por grupo)",
    "Quando o interesse é apenas o total ou a média — prefira barras",
  ],
  acessibilidade: [
    "Explique em texto o que representa a caixa, a mediana e os discrepantes",
    "Tooltip deve nomear cada estatística (mínimo, Q1, mediana, Q3, máximo)",
    "Ofereça tabela com as cinco estatísticas por grupo como alternativa",
  ],
  ariaLabel:
    "Boxplot das notas de NPS por macrorregião. Litoral Leste tem a maior mediana, 71, e Planalto Oeste a menor, 57. Há cinco notas discrepantes, entre 6 e 100.",
  altura: 380,
};

export default boxplot;
