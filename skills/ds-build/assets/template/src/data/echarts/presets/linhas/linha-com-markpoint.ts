import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 24, top: 32, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  },
  yAxis: {
    type: "value",
    name: "NPS",
    min: 0,
    max: 100,
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    {
      name: "NPS",
      type: "line",
      smooth: true,
      symbolSize: 6,
      data: [64, 68, 61, 72, 76, 71, 80, 83, 78, 86, 84, 88],
      lineStyle: { width: 2.5, color: palette[0] },
      itemStyle: { color: palette[0] },
      markPoint: {
        symbolSize: 52,
        label: { formatter: (p) => formatarNumero(p.value as number), fontSize: 11 },
        data: [
          { type: "max", name: "Máximo" },
          { type: "min", name: "Mínimo" },
        ],
      },
      markLine: {
        silent: true,
        symbol: "none",
        label: { formatter: "Média" },
        lineStyle: { color: readToken("--muted-foreground"), type: "dashed" },
        data: [{ type: "average" }],
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 24, top: 32, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] },
  yAxis: { type: "value", name: "NPS", min: 0, max: 100, axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    {
      name: "NPS",
      type: "line",
      smooth: true,
      symbolSize: 6,
      data: [64, 68, 61, 72, 76, 71, 80, 83, 78, 86, 84, 88],
      lineStyle: { width: 2.5, color: palette[0] },
      itemStyle: { color: palette[0] },
      markPoint: {
        symbolSize: 52,
        label: { formatter: (p) => formatarNumero(p.value as number), fontSize: 11 },
        data: [{ type: "max", name: "Máximo" }, { type: "min", name: "Mínimo" }],
      },
      markLine: {
        silent: true,
        symbol: "none",
        label: { formatter: "Média" },
        lineStyle: { color: readToken("--muted-foreground"), type: "dashed" },
        data: [{ type: "average" }],
      },
    },
  ],
};

export function NpsAnualChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Linha do NPS mensal ao longo do ano, com destaque no mínimo de 61 em março e no máximo de 88 em dezembro, e linha tracejada da média anual em torno de 76."
    />
  );
}`;

export const linhaComMarkpoint: ChartPreset = {
  id: "linha-com-markpoint",
  nome: "Linha com Máximo, Mínimo e Média",
  categoria: "linhas",
  descricao:
    "Série de NPS com markPoint de máximo e mínimo e markLine de média, para leitura imediata dos extremos.",
  tags: ["linhas", "markPoint", "markLine", "extremos", "NPS"],
  option,
  codigoReact,
  quandoUsar: [
    "Quando os pontos extremos e a média são a mensagem do gráfico",
    "Indicadores de satisfação, qualidade e desempenho acompanhados mês a mês",
    "Reuniões de resultado em que o pico e o vale precisam ser citados",
  ],
  quandoNaoUsar: [
    "Muitas séries no mesmo gráfico — os marcadores se acumulam e poluem",
    "Séries muito ruidosas, cujo máximo é apenas um outlier pontual",
    "Quando não há referência estatística útil (dados categóricos)",
  ],
  acessibilidade: [
    "Rotule os marcadores com o valor, para não depender apenas da posição",
    "Nomeie a markLine (Média) em texto visível, não só no tooltip",
    "Cite no ariaLabel o mínimo, o máximo e a média com seus períodos",
  ],
  ariaLabel:
    "Linha do NPS mensal ao longo do ano, com destaque no mínimo de 61 em março e no máximo de 88 em dezembro, e linha tracejada da média anual em torno de 76.",
  altura: 340,
};

export default linhaComMarkpoint;
