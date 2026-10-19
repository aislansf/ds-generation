import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const faixas = [
  "até 30 mil",
  "30–60 mil",
  "60–90 mil",
  "90–120 mil",
  "120–180 mil",
  "180–240 mil",
  "240–360 mil",
  "acima de 360 mil",
];
export const frequencias = [180, 420, 610, 540, 380, 210, 120, 65];
const total = frequencias.reduce((a, b) => a + b, 0);

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return `Faturamento ${p.name}<br/><strong>${formatarNumero(p.value)}</strong> empresas (${formatarPercentual((p.value / total) * 100)})`;
    },
  },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    data: faixas,
    name: "Faixa de faturamento anual",
    nameLocation: "middle",
    nameGap: 52,
    axisLabel: { rotate: 28, fontSize: 11 },
  },
  yAxis: { type: "value", name: "Empresas" },
  series: [
    {
      name: "Empresas por faixa",
      type: "bar",
      barCategoryGap: "0%",
      data: frequencias,
      itemStyle: { color: palette[0], borderColor: palette[0], borderWidth: 1 },
      label: { show: true, position: "top", fontSize: 10, formatter: (p) => formatarNumero(p.value as number) },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();
const faixas = ["até 30 mil", "30–60 mil", "60–90 mil", "90–120 mil", "120–180 mil", "180–240 mil", "240–360 mil", "acima de 360 mil"];
const frequencias = [180, 420, 610, 540, 380, 210, 120, 65];
const total = frequencias.reduce((a, b) => a + b, 0);

const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return "Faturamento " + p.name + "<br/><strong>" + formatarNumero(p.value) + "</strong> empresas (" + formatarPercentual((p.value / total) * 100) + ")";
    },
  },
  grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: faixas, name: "Faixa de faturamento anual", nameLocation: "middle", nameGap: 52, axisLabel: { rotate: 28, fontSize: 11 } },
  yAxis: { type: "value", name: "Empresas" },
  series: [{
    name: "Empresas por faixa",
    type: "bar",
    barCategoryGap: "0%",
    data: frequencias,
    itemStyle: { color: palette[0], borderColor: palette[0], borderWidth: 1 },
    label: { show: true, position: "top", fontSize: 10, formatter: (p) => formatarNumero(p.value as number) },
  }],
};

export function HistogramaFaturamentoChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Histograma da distribuição de faturamento anual de 2.525 empresas atendidas. A faixa mais frequente é de 60 a 90 mil reais, com 610 empresas, e a distribuição é assimétrica à direita."
    />
  );
}`;

export const histograma: ChartPreset = {
  id: "histograma",
  nome: "Histograma",
  categoria: "distribuicao",
  descricao:
    "Distribuição de faturamento anual em faixas, com barras coladas (barCategoryGap zero) e percentual no tooltip.",
  tags: ["histograma", "distribuição", "faixas", "frequência"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar a forma da distribuição de uma variável numérica",
    "Identificar assimetria, concentração e cauda longa",
    "Definir faixas de segmentação a partir do dado real",
  ],
  quandoNaoUsar: [
    "Comparar categorias nominais — as barras devem ter espaçamento",
    "Poucas observações, em que as faixas ficam instáveis",
    "Quando o interesse é evolução temporal",
  ],
  acessibilidade: [
    "Nomeie o eixo com a variável e a unidade das faixas",
    "Rótulo numérico visível no topo de cada barra",
    "Descreva no ariaLabel a faixa modal e o formato da distribuição",
  ],
  ariaLabel:
    "Histograma da distribuição de faturamento anual de 2.525 empresas atendidas. A faixa mais frequente é de 60 a 90 mil reais, com 610 empresas, e a distribuição é assimétrica à direita.",
  altura: 360,
};

export default histograma;
