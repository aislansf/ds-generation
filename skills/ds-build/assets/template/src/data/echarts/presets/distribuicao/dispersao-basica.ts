import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarMoeda, formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

/** [horas de consultoria, faturamento anual, nome da empresa] */
export const pontos: [number, number, string][] = [
  [8, 62000, "Padaria Vila Nova"],
  [12, 84000, "Costura Vale do Sul"],
  [16, 121000, "Mecânica Serra Alta"],
  [20, 152000, "Doces do Sertão"],
  [24, 198000, "Café Serra Azul"],
  [28, 216000, "Malharia Lagoa Seca"],
  [32, 288000, "Móveis Litoral"],
  [36, 305000, "Tech Porto Central"],
  [40, 372000, "Agro Planalto Oeste"],
  [44, 410000, "Turismo Litoral"],
  [18, 96000, "Salão Beleza Centro"],
  [26, 154000, "Pescados Porto do Norte"],
  [34, 244000, "Gráfica Central"],
  [42, 318000, "Confecções Serra Verde"],
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: [number, number, string] }).value;
      return `<strong>${v[2]}</strong><br/>Horas de consultoria: ${formatarNumero(v[0])}<br/>Faturamento: ${formatarMoeda(v[1], 0)}`;
    },
  },
  legend: { show: false },
  grid: { left: 8, right: 24, top: 32, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "Horas de consultoria", min: 0 },
  yAxis: {
    type: "value",
    name: "Faturamento (R$)",
    axisLabel: { formatter: (v: number) => formatarNumero(v / 1000) + " mil" },
  },
  series: [
    {
      name: "Empresas atendidas",
      type: "scatter",
      symbolSize: (d) => 8 + ((d as number[])[0] as number) / 3,
      itemStyle: { color: palette[0], opacity: 0.85 },
      emphasis: { focus: "series", itemStyle: { color: palette[1] } },
      data: pontos,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarMoeda, formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const pontos: [number, number, string][] = [
  [8, 62000, "Padaria Vila Nova"], [12, 84000, "Costura Vale do Sul"], [16, 121000, "Mecânica Serra Alta"],
  [20, 152000, "Doces do Sertão"], [24, 198000, "Café Serra Azul"], [28, 216000, "Malharia Lagoa Seca"],
  [32, 288000, "Móveis Litoral"], [36, 305000, "Tech Porto Central"], [40, 372000, "Agro Planalto Oeste"],
  [44, 410000, "Turismo Litoral"],
];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: [number, number, string] }).value;
      return "<strong>" + v[2] + "</strong><br/>Horas: " + formatarNumero(v[0]) + "<br/>Faturamento: " + formatarMoeda(v[1], 0);
    },
  },
  grid: { left: 8, right: 24, top: 32, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "Horas de consultoria", min: 0 },
  yAxis: { type: "value", name: "Faturamento (R$)", axisLabel: { formatter: (v: number) => formatarNumero(v / 1000) + " mil" } },
  series: [{
    name: "Empresas atendidas",
    type: "scatter",
    symbolSize: (d) => 8 + (d as number[])[0] / 3,
    itemStyle: { color: palette[0], opacity: 0.85 },
    data: pontos,
  }],
};

export function HorasVsFaturamentoChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Dispersão de 14 empresas atendidas relacionando horas de consultoria e faturamento anual: a tendência é crescente, de 8 horas com 62 mil reais até 44 horas com 410 mil reais."
    />
  );
}`;

export const dispersaoBasica: ChartPreset = {
  id: "dispersao-basica",
  nome: "Dispersão Básica",
  categoria: "distribuicao",
  descricao:
    "Scatter relacionando horas de consultoria e faturamento anual das empresas atendidas, com símbolo proporcional à carga de consultoria.",
  tags: ["dispersão", "scatter", "correlação", "duas variáveis"],
  option,
  codigoReact,
  quandoUsar: [
    "Investigar correlação entre duas variáveis numéricas contínuas",
    "Identificar agrupamentos e pontos fora do padrão",
    "Quando cada ponto representa uma unidade real (empresa, atendimento)",
  ],
  quandoNaoUsar: [
    "Comparar categorias discretas — prefira barras",
    "Séries temporais contínuas — prefira linhas",
    "Poucos pontos (menos de 8): a nuvem não comunica tendência",
  ],
  acessibilidade: [
    "Descreva no ariaLabel o sentido da relação (crescente, decrescente, sem relação)",
    "Tooltip deve identificar a unidade pelo nome, não apenas pelas coordenadas",
    "Nomeie os dois eixos com unidade explícita",
  ],
  ariaLabel:
    "Dispersão de 14 empresas atendidas relacionando horas de consultoria e faturamento anual: a tendência é crescente, de 8 horas com 62 mil reais até 44 horas com 410 mil reais.",
  altura: 360,
};

export default dispersaoBasica;
