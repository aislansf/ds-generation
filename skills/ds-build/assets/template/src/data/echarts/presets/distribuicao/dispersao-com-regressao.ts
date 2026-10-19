import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

/** [horas de consultoria, variação de faturamento em %] */
export const pontos: [number, number][] = [
  [4, 2], [6, 3], [8, 5], [10, 4], [12, 7], [14, 8], [16, 9], [18, 8],
  [20, 12], [22, 11], [24, 14], [26, 13], [28, 17], [30, 16], [32, 19],
  [34, 18], [36, 22], [38, 21], [40, 25], [44, 26], [48, 29], [52, 31],
];

/** Regressão linear simples (mínimos quadrados). */
function regressao(dados: [number, number][]) {
  const n = dados.length;
  const sx = dados.reduce((s, p) => s + p[0], 0);
  const sy = dados.reduce((s, p) => s + p[1], 0);
  const sxy = dados.reduce((s, p) => s + p[0] * p[1], 0);
  const sxx = dados.reduce((s, p) => s + p[0] * p[0], 0);
  const a = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const b = (sy - a * sx) / n;
  return { a, b };
}

const { a, b } = regressao(pontos);
const xMin = 0;
const xMax = 56;

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: [number, number] }).value;
      return `Consultoria: ${formatarNumero(v[0])} h<br/>Variação de faturamento: ${formatarNumero(v[1], 1)}%`;
    },
  },
  grid: { left: 8, right: 24, top: 32, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "Horas de consultoria", min: xMin, max: xMax },
  yAxis: { type: "value", name: "Variação de faturamento (%)" },
  series: [
    {
      name: "Empresas atendidas",
      type: "scatter",
      symbolSize: 10,
      itemStyle: { color: readToken("--primary", 0.75) },
      emphasis: { focus: "series", itemStyle: { color: readToken("--primary") } },
      data: pontos,
      markLine: {
        symbol: ["none", "none"],
        silent: true,
        lineStyle: { color: readToken("--error"), width: 2, type: "dashed" },
        label: {
          show: true,
          position: "end",
          formatter: "Tendência",
          color: readToken("--error"),
          fontSize: 11,
        },
        data: [
          [
            { coord: [xMin, a * xMin + b] },
            { coord: [xMax, a * xMax + b] },
          ],
        ],
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";

const pontos: [number, number][] = [[4, 2], [8, 5], [12, 7], [20, 12], [28, 17], [36, 22], [48, 29]];

function regressao(dados: [number, number][]) {
  const n = dados.length;
  const sx = dados.reduce((s, p) => s + p[0], 0);
  const sy = dados.reduce((s, p) => s + p[1], 0);
  const sxy = dados.reduce((s, p) => s + p[0] * p[1], 0);
  const sxx = dados.reduce((s, p) => s + p[0] * p[0], 0);
  const a = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { a, b: (sy - a * sx) / n };
}
const { a, b } = regressao(pontos);

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  xAxis: { type: "value", name: "Horas de consultoria", min: 0, max: 56 },
  yAxis: { type: "value", name: "Variação de faturamento (%)" },
  series: [{
    name: "Empresas atendidas",
    type: "scatter",
    symbolSize: 10,
    itemStyle: { color: readToken("--primary", 0.75) },
    data: pontos,
    markLine: {
      symbol: ["none", "none"], silent: true,
      lineStyle: { color: readToken("--error"), width: 2, type: "dashed" },
      label: { show: true, position: "end", formatter: "Tendência" },
      data: [[{ coord: [0, b] }, { coord: [56, a * 56 + b] }]],
    },
  }],
};

export function ConsultoriaRegressaoChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Dispersão de horas de consultoria contra variação de faturamento, com linha de tendência crescente."
    />
  );
}`;

export const dispersaoComRegressao: ChartPreset = {
  id: "dispersao-com-regressao",
  nome: "Dispersão com Tendência",
  categoria: "distribuicao",
  descricao:
    "Scatter de horas de consultoria contra variação de faturamento, com reta de tendência calculada por mínimos quadrados e desenhada via markLine.",
  tags: ["dispersão", "regressão", "markLine", "correlação"],
  option,
  codigoReact,
  quandoUsar: [
    "Investigar correlação entre duas variáveis numéricas",
    "Sustentar a hipótese de efeito de um programa sobre um resultado",
    "Amostras de 20 a algumas centenas de pontos",
  ],
  quandoNaoUsar: [
    "Variáveis categóricas",
    "Poucos pontos: a tendência não é confiável",
    "Quando a relação é claramente não linear",
  ],
  acessibilidade: [
    "Linha de tendência rotulada em texto, além do estilo tracejado",
    "Tooltip informa as duas coordenadas com unidade e formatação pt-BR",
    "Nomes de eixo explicitam variável e unidade",
  ],
  ariaLabel:
    "Dispersão de 22 empresas atendidas relacionando horas de consultoria e variação de faturamento. A relação é positiva: de cerca de 2% com 4 horas até 31% com 52 horas, com linha de tendência crescente.",
  altura: 340,
};

export default dispersaoComRegressao;
