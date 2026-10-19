import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const partes = [
  { nome: "Empreender", valor: 34.2, cor: palette[0] },
  { nome: "AGI", valor: 26.8, cor: palette[1] },
  { nome: "Programa Inova", valor: 18.4, cor: palette[2] },
  { nome: "Visita Técnica", valor: 12.9, cor: palette[3] },
  { nome: "Empreender Mais", valor: 7.7, cor: palette[6] },
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => `${p.seriesName as string}: <strong>${formatarPercentual(p.value as number)}</strong>`,
  },
  legend: { top: 0, left: "left", itemHeight: 10, itemWidth: 10 },
  grid: { left: 0, right: 0, top: 52, bottom: 0, height: 28, containLabel: true },
  xAxis: { type: "value", max: 100, show: false },
  yAxis: { type: "category", data: ["Composição"], show: false },
  series: partes.map((p, i) => ({
    name: p.nome,
    type: "bar" as const,
    stack: "composicao",
    barWidth: 28,
    data: [p.valor],
    itemStyle: {
      color: p.cor,
      borderRadius:
        i === 0
          ? ([6, 0, 0, 6] as [number, number, number, number])
          : i === partes.length - 1
            ? ([0, 6, 6, 0] as [number, number, number, number])
            : 0,
    },
    label: {
      show: p.valor >= 10,
      position: "inside" as const,
      formatter: () => formatarPercentual(p.valor, 0),
      fontSize: 11,
    },
  })),
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const partes = [
  { nome: "Empreender", valor: 34.2, cor: palette[0] },
  { nome: "AGI", valor: 26.8, cor: palette[1] },
  { nome: "Programa Inova", valor: 18.4, cor: palette[2] },
  { nome: "Visita Técnica", valor: 12.9, cor: palette[3] },
  { nome: "Empreender Mais", valor: 7.7, cor: palette[6] },
];

const option: EChartsOption = {
  tooltip: { trigger: "item", formatter: (p) => p.seriesName + ": <strong>" + formatarPercentual(p.value as number) + "</strong>" },
  legend: { top: 0, left: "left", itemHeight: 10, itemWidth: 10 },
  grid: { left: 0, right: 0, top: 52, bottom: 0, height: 28, containLabel: true },
  xAxis: { type: "value", max: 100, show: false },
  yAxis: { type: "category", data: ["Composição"], show: false },
  series: partes.map((p, i) => ({
    name: p.nome,
    type: "bar" as const,
    stack: "composicao",
    barWidth: 28,
    data: [p.valor],
    itemStyle: {
      color: p.cor,
      borderRadius: i === 0 ? [6, 0, 0, 6] : i === partes.length - 1 ? [0, 6, 6, 0] : 0,
    },
    label: { show: p.valor >= 10, position: "inside" as const, formatter: () => formatarPercentual(p.valor, 0), fontSize: 11 },
  })),
};

export function ComposicaoKpiChart() {
  return (
    <BrandChart
      option={option}
      height={120}
      ariaLabel="Barra horizontal única de composição percentual dos atendimentos: Empreender 34,2 por cento, AGI 26,8 por cento, Programa Inova 18,4 por cento, Visita Técnica 12,9 por cento e Empreender Mais 7,7 por cento."
    />
  );
}`;

export const barraProgressoEmpilhada: ChartPreset = {
  id: "barra-progresso-empilhada",
  nome: "Barra de Composição 100%",
  categoria: "proporcao",
  descricao:
    "Barra horizontal única empilhada em 100%, com cantos arredondados nas extremidades — ideal para cartões de KPI compactos.",
  tags: ["barra", "composição", "100%", "KPI", "compacto"],
  option,
  codigoReact,
  quandoUsar: [
    "Cartões de KPI com pouco espaço vertical que precisam mostrar composição",
    "Composição de um único total com até 6 categorias",
    "Quando a leitura aproximada da participação é suficiente",
  ],
  quandoNaoUsar: [
    "Comparar composições de vários grupos — use barras empilhadas 100% com várias linhas",
    "Categorias muito numerosas ou com participações mínimas",
    "Evolução no tempo",
  ],
  acessibilidade: [
    "Oculte rótulos de fatias pequenas e garanta que o valor esteja no tooltip",
    "Mantenha a legenda, pois os segmentos não têm eixo de referência",
    "Liste todos os percentuais no ariaLabel, em ordem decrescente",
  ],
  ariaLabel:
    "Barra horizontal única de composição percentual dos atendimentos: Empreender 34,2 por cento, AGI 26,8 por cento, Programa Inova 18,4 por cento, Visita Técnica 12,9 por cento e Empreender Mais 7,7 por cento.",
  altura: 120,
};

export default barraProgressoEmpilhada;
