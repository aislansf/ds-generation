import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPaletteEstendida } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPaletteEstendida();

export const comercio: [number, number][] = [
  [12, 6], [16, 8], [20, 9], [24, 12], [28, 11], [32, 15], [36, 14], [40, 18],
];
export const servicos: [number, number][] = [
  [10, 10], [14, 13], [18, 15], [22, 18], [26, 20], [30, 23], [34, 26], [38, 28],
];
export const industria: [number, number][] = [
  [18, 4], [22, 6], [26, 7], [30, 9], [34, 10], [38, 13], [42, 15], [46, 16],
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const item = p as { seriesName: string; value: [number, number] };
      return `<strong>${item.seriesName}</strong><br/>Consultoria: ${formatarNumero(item.value[0])} h<br/>Variação: ${formatarNumero(item.value[1], 1)}%`;
    },
  },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 24, top: 48, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "Horas de consultoria" },
  yAxis: { type: "value", name: "Variação de faturamento (%)" },
  series: [
    { name: "Comércio", type: "scatter", symbolSize: 10, itemStyle: { color: palette[10] }, emphasis: { focus: "series" }, data: comercio },
    { name: "Serviços", type: "scatter", symbolSize: 10, itemStyle: { color: palette[11] }, emphasis: { focus: "series" }, data: servicos },
    { name: "Indústria", type: "scatter", symbolSize: 10, itemStyle: { color: palette[12] }, emphasis: { focus: "series" }, data: industria },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPaletteEstendida } from "@/lib/echarts/brandTheme";

const palette = getBrandPaletteEstendida();

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { top: 0, left: "left" },
  xAxis: { type: "value", name: "Horas de consultoria" },
  yAxis: { type: "value", name: "Variação de faturamento (%)" },
  series: [
    { name: "Comércio", type: "scatter", symbolSize: 10, itemStyle: { color: palette[10] }, data: [[12, 6], [20, 9], [28, 11], [36, 14]] },
    { name: "Serviços", type: "scatter", symbolSize: 10, itemStyle: { color: palette[11] }, data: [[10, 10], [18, 15], [26, 20], [34, 26]] },
    { name: "Indústria", type: "scatter", symbolSize: 10, itemStyle: { color: palette[12] }, data: [[18, 4], [26, 7], [34, 10], [42, 15]] },
  ],
};

export function SetoresDispersaoChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Dispersão com três séries por setor relacionando horas de consultoria e variação de faturamento."
    />
  );
}`;

export const dispersaoMultiplasSeries: ChartPreset = {
  id: "dispersao-multiplas-series",
  nome: "Dispersão com Múltiplas Séries",
  categoria: "distribuicao",
  descricao:
    "Scatter com três séries setoriais e legenda, usando as cores complementares da paleta estendida para máxima separação.",
  tags: ["dispersão", "múltiplas séries", "setores", "paleta estendida"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar o comportamento de grupos na mesma relação de variáveis",
    "Identificar clusters e sobreposições entre setores",
    "Até 4 ou 5 séries",
  ],
  quandoNaoUsar: [
    "Muitas séries: os pontos se confundem",
    "Alta densidade sem transparência ou símbolos distintos",
    "Variáveis categóricas",
  ],
  acessibilidade: [
    "Legenda obrigatória e tooltip que nomeia a série do ponto",
    "Cores da paleta estendida escolhidas para contraste entre si",
    "Nomes de eixo com unidade explícita",
  ],
  ariaLabel:
    "Dispersão com três séries setoriais relacionando horas de consultoria e variação de faturamento. Serviços apresenta a maior inclinação, chegando a 28%; Indústria tem o retorno mais discreto, até 16%.",
  altura: 340,
};

export default dispersaoMultiplasSeries;
