import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v) => formatarPercentual(v as number),
  },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: ["1º tri", "2º tri", "3º tri", "4º tri"] },
  yAxis: {
    type: "value",
    max: 100,
    name: "Participação",
    axisLabel: { formatter: (v: number) => formatarPercentual(v, 0) },
  },
  series: [
    { name: "Empreender", type: "bar", stack: "share", data: [42, 40, 37, 35], itemStyle: { color: palette[0] } },
    { name: "AGI", type: "bar", stack: "share", data: [30, 31, 33, 34], itemStyle: { color: palette[1] } },
    { name: "Programa Inova", type: "bar", stack: "share", data: [18, 19, 20, 21], itemStyle: { color: palette[2] } },
    { name: "Visita Técnica", type: "bar", stack: "share", data: [10, 10, 10, 10], itemStyle: { color: palette[3] } },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => formatarPercentual(v as number) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: ["1º tri", "2º tri", "3º tri", "4º tri"] },
  yAxis: { type: "value", max: 100, name: "Participação", axisLabel: { formatter: (v: number) => formatarPercentual(v, 0) } },
  series: [
    { name: "Empreender", type: "bar", stack: "share", data: [42, 40, 37, 35], itemStyle: { color: palette[0] } },
    { name: "AGI", type: "bar", stack: "share", data: [30, 31, 33, 34], itemStyle: { color: palette[1] } },
    { name: "Programa Inova", type: "bar", stack: "share", data: [18, 19, 20, 21], itemStyle: { color: palette[2] } },
    { name: "Visita Técnica", type: "bar", stack: "share", data: [10, 10, 10, 10], itemStyle: { color: palette[3] } },
  ],
};

export function ParticipacaoTrimestralChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Colunas empilhadas em 100 por cento mostrando a participação de cada programa nos atendimentos por trimestre: Empreender cai de 42 para 35 por cento e AGI sobe de 30 para 34 por cento."
    />
  );
}`;

export const barrasEmpilhadas100: ChartPreset = {
  id: "barras-empilhadas-100",
  nome: "Barras Empilhadas 100%",
  categoria: "barras",
  descricao:
    "Empilhamento normalizado em 100% para comparar a composição relativa entre trimestres, com eixo e tooltip em percentual.",
  tags: ["barras", "empilhado 100%", "participação", "percentual"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar a composição relativa entre períodos, ignorando diferenças de volume total",
    "Acompanhar ganho ou perda de participação (share) de um programa",
    "Quando o total de cada coluna não é o dado relevante",
  ],
  quandoNaoUsar: [
    "Quando o volume absoluto importa — o gráfico esconde crescimento e queda do total",
    "Séries com muitas categorias pequenas, que viram faixas invisíveis",
    "Quando é preciso comparar valores exatos entre categorias intermediárias",
  ],
  acessibilidade: [
    "Deixe explícito no eixo e no tooltip que os valores são percentuais",
    "Cite no ariaLabel a variação de participação das principais séries",
    "Nunca use apenas a cor: mantenha a legenda e a ordem das séries estável entre gráficos",
  ],
  ariaLabel:
    "Colunas empilhadas em 100 por cento mostrando a participação de cada programa nos atendimentos por trimestre: Empreender cai de 42 para 35 por cento e AGI sobe de 30 para 34 por cento.",
  altura: 340,
};

export default barrasEmpilhadas100;
