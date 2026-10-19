import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarMoeda } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarMoeda(v as number, 0) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
  },
  yAxis: {
    type: "value",
    name: "Teto de crédito",
    axisLabel: { formatter: (v: number) => formatarMoeda(v, 0) },
  },
  series: [
    {
      name: "Teto por operação",
      type: "line",
      step: "start",
      data: [15000, 15000, 20000, 20000, 20000, 30000, 30000, 30000],
      lineStyle: { width: 2.5, color: palette[0] },
      itemStyle: { color: palette[0] },
    },
    {
      name: "Ticket médio contratado",
      type: "line",
      step: "start",
      data: [11200, 12400, 15800, 16100, 17300, 22600, 24100, 25800],
      lineStyle: { width: 2, color: palette[7], type: "dashed" },
      itemStyle: { color: palette[7] },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarMoeda } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarMoeda(v as number, 0) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"] },
  yAxis: { type: "value", name: "Teto de crédito", axisLabel: { formatter: (v: number) => formatarMoeda(v, 0) } },
  series: [
    { name: "Teto por operação", type: "line", step: "start", data: [15000, 15000, 20000, 20000, 20000, 30000, 30000, 30000], lineStyle: { width: 2.5, color: palette[0] }, itemStyle: { color: palette[0] } },
    { name: "Ticket médio contratado", type: "line", step: "start", data: [11200, 12400, 15800, 16100, 17300, 22600, 24100, 25800], lineStyle: { width: 2, color: palette[7], type: "dashed" }, itemStyle: { color: palette[7] } },
  ],
};

export function TetoCreditoChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Linha em degraus do teto de crédito por operação, que sobe de 15 mil para 20 mil reais em março e para 30 mil em junho, acompanhada do ticket médio contratado, que vai de 11.200 a 25.800 reais."
    />
  );
}`;

export const linhaDegraus: ChartPreset = {
  id: "linha-degraus",
  nome: "Linha em Degraus (Step)",
  categoria: "linhas",
  descricao:
    "Step line com step start para grandezas que mudam em patamares, como tetos, tarifas e regras vigentes por período.",
  tags: ["linhas", "step", "patamares", "vigência"],
  option,
  codigoReact,
  quandoUsar: [
    "Valores que permanecem constantes até uma mudança de regra (tetos, tarifas, metas)",
    "Quando interpolar entre pontos seria factualmente errado",
    "Comparar um limite em degraus com uma série contínua real",
  ],
  quandoNaoUsar: [
    "Grandezas que variam continuamente — a escada sugere estabilidade inexistente",
    "Muitos pontos com mudanças a cada período, o que gera serrilhado ilegível",
    "Composição de um total — prefira áreas empilhadas",
  ],
  acessibilidade: [
    "Explique no ariaLabel em que períodos ocorreram as mudanças de patamar",
    "Diferencie as séries por tracejado além da cor",
    "Formate o eixo na unidade correta (moeda em pt-BR) para evitar leitura ambígua",
  ],
  ariaLabel:
    "Linha em degraus do teto de crédito por operação, que sobe de 15 mil para 20 mil reais em março e para 30 mil em junho, acompanhada do ticket médio contratado, que vai de 11.200 a 25.800 reais.",
  altura: 340,
};

export default linhaDegraus;
