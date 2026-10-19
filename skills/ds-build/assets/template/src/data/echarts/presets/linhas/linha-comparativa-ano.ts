import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  },
  yAxis: {
    type: "value",
    name: "MEIs formalizados",
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    {
      name: "2025 (atual)",
      type: "line",
      smooth: true,
      symbolSize: 6,
      data: [1420, 1510, 1480, 1620, 1740, 1810, 1890, 1960, 2040, 2120, 2210, 2300],
      lineStyle: { width: 2.5, color: palette[0] },
      itemStyle: { color: palette[0] },
    },
    {
      name: "2024 (anterior)",
      type: "line",
      smooth: true,
      showSymbol: false,
      data: [1280, 1310, 1360, 1400, 1470, 1520, 1580, 1610, 1690, 1740, 1800, 1870],
      lineStyle: { width: 2, color: palette[0], type: "dashed", opacity: 0.55 },
      itemStyle: { color: palette[0], opacity: 0.55 },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] },
  yAxis: { type: "value", name: "MEIs formalizados", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    { name: "2025 (atual)", type: "line", smooth: true, symbolSize: 6, data: [1420, 1510, 1480, 1620, 1740, 1810, 1890, 1960, 2040, 2120, 2210, 2300], lineStyle: { width: 2.5, color: palette[0] }, itemStyle: { color: palette[0] } },
    { name: "2024 (anterior)", type: "line", smooth: true, showSymbol: false, data: [1280, 1310, 1360, 1400, 1470, 1520, 1580, 1610, 1690, 1740, 1800, 1870], lineStyle: { width: 2, color: palette[0], type: "dashed", opacity: 0.55 }, itemStyle: { color: palette[0], opacity: 0.55 } },
  ],
};

export function ComparativoAnualChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Comparação mensal de MEIs formalizados entre 2025, em linha cheia, e 2024, em linha tracejada mais clara. O ano atual fica acima do anterior em todos os meses, fechando 2.300 contra 1.870."
    />
  );
}`;

export const linhaComparativaAno: ChartPreset = {
  id: "linha-comparativa-ano",
  nome: "Comparativo Ano Atual x Anterior",
  categoria: "linhas",
  descricao:
    "Duas séries do mesmo indicador em anos distintos, com o ano anterior tracejado e em opacidade reduzida para funcionar como referência.",
  tags: ["linhas", "comparativo", "ano anterior", "referência"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar desempenho mês a mês contra o mesmo período do ano anterior",
    "Avaliar sazonalidade recorrente do indicador",
    "Painéis de acompanhamento de metas anuais",
  ],
  quandoNaoUsar: [
    "Mais de três anos sobrepostos, que viram emaranhado de linhas",
    "Períodos com bases muito diferentes de cálculo, o que invalida a comparação",
    "Quando o interesse é apenas o acumulado — prefira barras ou cartão de KPI",
  ],
  acessibilidade: [
    "Use a mesma matiz para o indicador e diferencie o período por tracejado e opacidade",
    "Deixe explícito na legenda qual série é a referência (anterior)",
    "Cite no ariaLabel o fechamento dos dois períodos comparados",
  ],
  ariaLabel:
    "Comparação mensal de MEIs formalizados entre 2025, em linha cheia, e 2024, em linha tracejada mais clara. O ano atual fica acima do anterior em todos os meses, fechando 2.300 contra 1.870.",
  altura: 340,
};

export default linhaComparativaAno;
