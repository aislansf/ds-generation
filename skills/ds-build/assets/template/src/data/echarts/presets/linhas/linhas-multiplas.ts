import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: { trigger: "axis" },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
  },
  yAxis: { type: "value", name: "MEIs formalizados" },
  series: [
    {
      name: "Porto Central",
      type: "line",
      smooth: true,
      data: [820, 932, 901, 1034, 1190, 1230, 1320, 1410],
      lineStyle: { width: 2, color: palette[0] },
      itemStyle: { color: palette[0] },
      areaStyle: { color: palette[0], opacity: 0.12 },
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: { color: readToken("--muted-foreground"), type: "dashed" },
        data: [{ type: "average", name: "Média Porto Central" }],
      },
    },
    {
      name: "Vale do Sul",
      type: "line",
      smooth: true,
      data: [420, 468, 512, 498, 560, 612, 648, 690],
      lineStyle: { width: 2, color: palette[1] },
      itemStyle: { color: palette[1] },
    },
    {
      name: "Região Central",
      type: "line",
      smooth: true,
      data: [260, 288, 300, 322, 348, 366, 402, 438],
      lineStyle: { width: 2, color: palette[2] },
      itemStyle: { color: palette[2] },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis" },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"] },
  yAxis: { type: "value", name: "MEIs formalizados" },
  series: [
    {
      name: "Porto Central",
      type: "line",
      smooth: true,
      data: [820, 932, 901, 1034, 1190, 1230, 1320, 1410],
      lineStyle: { width: 2, color: palette[0] },
      itemStyle: { color: palette[0] },
      areaStyle: { color: palette[0], opacity: 0.12 },
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: { color: readToken("--muted-foreground"), type: "dashed" },
        data: [{ type: "average", name: "Média Porto Central" }],
      },
    },
    { name: "Vale do Sul", type: "line", smooth: true, data: [420, 468, 512, 498, 560, 612, 648, 690], lineStyle: { width: 2, color: palette[1] }, itemStyle: { color: palette[1] } },
    { name: "Região Central", type: "line", smooth: true, data: [260, 288, 300, 322, 348, 366, 402, 438], lineStyle: { width: 2, color: palette[2] }, itemStyle: { color: palette[2] } },
  ],
};

export function MeisPorRegiaoChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Linhas suavizadas de MEIs formalizados por mês em Porto Central, Vale do Sul e Região Central, de janeiro a agosto, com tendência de crescimento e linha de média para Porto Central."
    />
  );
}`;

export const linhasMultiplas: ChartPreset = {
  id: "linhas-multiplas",
  nome: "Linhas Múltiplas com Média",
  categoria: "linhas",
  descricao:
    "Três séries temporais suavizadas com área opcional na série principal e markLine de média.",
  tags: ["linhas", "séries temporais", "tendência", "markLine", "área"],
  option,
  codigoReact,
  quandoUsar: [
    "Acompanhar a evolução de um indicador ao longo do tempo",
    "Comparar a trajetória de poucas séries (idealmente até 5)",
    "Destacar desvio em relação a uma referência com markLine de média ou meta",
  ],
  quandoNaoUsar: [
    "Categorias sem ordem natural — a linha sugere continuidade inexistente",
    "Comparação precisa de valores isolados — prefira barras",
    "Muitas séries sobrepostas (spaghetti chart): use small multiples",
  ],
  acessibilidade: [
    "Descreva no ariaLabel a tendência geral e o período coberto",
    "Diferencie séries também por marcador/tracejado, não apenas por cor",
    "Evite eixo Y truncado sem indicação explícita, pois exagera variações",
  ],
  ariaLabel:
    "Linhas suavizadas de MEIs formalizados por mês em Porto Central, Vale do Sul e Região Central, de janeiro a agosto, com tendência de crescimento e linha de média para Porto Central.",
  altura: 340,
};

export default linhasMultiplas;
