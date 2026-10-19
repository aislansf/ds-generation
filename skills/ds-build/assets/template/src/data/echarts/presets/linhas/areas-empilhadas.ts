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
    data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
  },
  yAxis: {
    type: "value",
    name: "Horas de consultoria",
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    {
      name: "Empreender",
      type: "line",
      stack: "horas",
      smooth: true,
      showSymbol: false,
      data: [320, 340, 366, 390, 412, 430, 452, 478],
      lineStyle: { width: 1.5, color: palette[0] },
      itemStyle: { color: palette[0] },
      areaStyle: { color: palette[0], opacity: 0.5 },
    },
    {
      name: "AGI",
      type: "line",
      stack: "horas",
      smooth: true,
      showSymbol: false,
      data: [240, 258, 262, 288, 304, 318, 340, 356],
      lineStyle: { width: 1.5, color: palette[1] },
      itemStyle: { color: palette[1] },
      areaStyle: { color: palette[1], opacity: 0.5 },
    },
    {
      name: "Programa Inova",
      type: "line",
      stack: "horas",
      smooth: true,
      showSymbol: false,
      data: [150, 158, 172, 180, 196, 208, 214, 232],
      lineStyle: { width: 1.5, color: palette[2] },
      itemStyle: { color: palette[2] },
      areaStyle: { color: palette[2], opacity: 0.5 },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const serie = (nome: string, data: number[], cor: string) => ({
  name: nome,
  type: "line" as const,
  stack: "horas",
  smooth: true,
  showSymbol: false,
  data,
  lineStyle: { width: 1.5, color: cor },
  itemStyle: { color: cor },
  areaStyle: { color: cor, opacity: 0.5 },
});

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"] },
  yAxis: { type: "value", name: "Horas de consultoria", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    serie("Empreender", [320, 340, 366, 390, 412, 430, 452, 478], palette[0]),
    serie("AGI", [240, 258, 262, 288, 304, 318, 340, 356], palette[1]),
    serie("Programa Inova", [150, 158, 172, 180, 196, 208, 214, 232], palette[2]),
  ],
};

export function HorasEmpilhadasChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Áreas empilhadas de horas de consultoria por programa entre janeiro e agosto, com total subindo de 710 para 1.066 horas e crescimento em todos os programas."
    />
  );
}`;

export const areasEmpilhadas: ChartPreset = {
  id: "areas-empilhadas",
  nome: "Áreas Empilhadas",
  categoria: "linhas",
  descricao:
    "Três séries empilhadas com areaStyle, mostrando simultaneamente o total e a contribuição de cada programa no tempo.",
  tags: ["linhas", "área", "empilhado", "composição"],
  option,
  codigoReact,
  quandoUsar: [
    "Evolução do total no tempo junto com a composição por categoria",
    "Poucas séries (até 4) cujos valores somados têm significado",
    "Quando a mensagem é o crescimento do agregado, não a comparação entre séries",
  ],
  quandoNaoUsar: [
    "Comparar séries entre si: só a série da base tem linha de referência plana",
    "Séries com valores negativos ou muito voláteis",
    "Quando a soma não tem sentido, como médias e taxas",
  ],
  acessibilidade: [
    "Mantenha a legenda visível e a ordem das séries igual em todos os gráficos do painel",
    "Use tooltip trigger axis para expor todos os valores do período de uma vez",
    "Explique no ariaLabel que se trata de composição empilhada e informe o total inicial e final",
  ],
  ariaLabel:
    "Áreas empilhadas de horas de consultoria por programa entre janeiro e agosto, com total subindo de 710 para 1.066 horas e crescimento em todos os programas.",
  altura: 340,
};

export default areasEmpilhadas;
