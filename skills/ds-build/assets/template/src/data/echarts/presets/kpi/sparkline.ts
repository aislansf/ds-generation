import type { EChartsOption } from "echarts";
import * as echarts from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

export const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export const valores = [420, 448, 462, 455, 498, 520, 545, 572, 560, 598, 640, 612];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "none" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return `${p.name}<br/><strong>${formatarNumero(p.value)}</strong> atendimentos`;
    },
  },
  legend: { show: false },
  grid: { left: 2, right: 2, top: 8, bottom: 2, containLabel: false },
  xAxis: { type: "category", data: meses, show: false, boundaryGap: false },
  yAxis: { type: "value", show: false, min: (v) => v.min * 0.9 },
  series: [
    {
      name: "Atendimentos mensais",
      type: "line",
      data: valores,
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2.5, color: readToken("--primary") },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: readToken("--primary", 0.32) },
          { offset: 1, color: readToken("--primary", 0) },
        ]),
      },
      markPoint: {
        symbolSize: 8,
        data: [{ type: "max", name: "Máximo", itemStyle: { color: readToken("--success") }, label: { show: false } }],
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import * as echarts from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const valores = [420, 448, 462, 455, 498, 520, 545, 572, 560, 598, 640, 612];

const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "none" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return p.name + "<br/><strong>" + formatarNumero(p.value) + "</strong> atendimentos";
    },
  },
  grid: { left: 2, right: 2, top: 8, bottom: 2, containLabel: false },
  xAxis: { type: "category", data: meses, show: false, boundaryGap: false },
  yAxis: { type: "value", show: false, min: (v) => v.min * 0.9 },
  series: [{
    name: "Atendimentos mensais",
    type: "line",
    data: valores,
    smooth: true,
    symbol: "none",
    lineStyle: { width: 2.5, color: readToken("--primary") },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: readToken("--primary", 0.32) },
        { offset: 1, color: readToken("--primary", 0) },
      ]),
    },
    markPoint: { symbolSize: 8, data: [{ type: "max", itemStyle: { color: readToken("--success") }, label: { show: false } }] },
  }],
};

export function AtendimentosSparkline() {
  return (
    <BrandChart
      option={option}
      height={72}
      ariaLabel="Sparkline dos atendimentos mensais em 2025, de 420 em janeiro a 612 em dezembro, com pico de 640 em novembro."
    />
  );
}`;

export const sparkline: ChartPreset = {
  id: "sparkline",
  nome: "Sparkline",
  categoria: "kpi",
  descricao:
    "Linha minimalista sem eixos, grid ou legenda, para embutir em Big Numbers e cards de KPI. Destaque de máximo por markPoint.",
  tags: ["sparkline", "big number", "tendência", "card"],
  option,
  codigoReact,
  quandoUsar: [
    "Complementar um número grande com a tendência recente",
    "Tabelas com uma microtendência por linha",
    "Espaços muito reduzidos, com 60 a 90 pixels de altura",
  ],
  quandoNaoUsar: [
    "Quando o usuário precisa ler valores exatos",
    "Séries com muitas quebras ou dados faltantes",
    "Mais de uma série no mesmo sparkline",
  ],
  acessibilidade: [
    "Sempre acompanhe o sparkline do valor atual e da variação em texto",
    "ariaLabel deve informar valor inicial, final e pico",
    "Não use o sparkline como única fonte da informação",
  ],
  ariaLabel:
    "Sparkline dos atendimentos mensais em 2025, de 420 em janeiro a 612 em dezembro, com pico de 640 em novembro.",
  altura: 96,
};

export default sparkline;
