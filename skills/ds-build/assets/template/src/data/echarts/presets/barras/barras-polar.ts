import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const programas = ["Empreender", "AGI", "Programa Inova", "Visita Técnica", "Empreender Mais"];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    valueFormatter: (v) => `${formatarNumero(v as number)} horas`,
  },
  legend: { show: false },
  polar: { radius: [24, "72%"] },
  angleAxis: { max: 3600, startAngle: 90, axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  radiusAxis: { type: "category", data: programas, z: 10 },
  series: [
    {
      name: "Horas de consultoria",
      type: "bar",
      coordinateSystem: "polar",
      roundCap: true,
      data: programas.map((_, i) => ({
        value: [3200, 2650, 1980, 1420, 980][i],
        itemStyle: { color: palette[i] },
      })),
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const programas = ["Empreender", "AGI", "Programa Inova", "Visita Técnica", "Empreender Mais"];
const horas = [3200, 2650, 1980, 1420, 980];

const option: EChartsOption = {
  tooltip: { trigger: "item", valueFormatter: (v) => formatarNumero(v as number) + " horas" },
  legend: { show: false },
  polar: { radius: [24, "72%"] },
  angleAxis: { max: 3600, startAngle: 90, axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  radiusAxis: { type: "category", data: programas, z: 10 },
  series: [
    {
      name: "Horas de consultoria",
      type: "bar",
      coordinateSystem: "polar",
      roundCap: true,
      data: horas.map((value, i) => ({ value, itemStyle: { color: palette[i] } })),
    },
  ],
};

export function HorasConsultoriaPolarChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Barras em coordenada polar com horas de consultoria por programa: Empreender 3.200, AGI 2.650, Programa Inova 1.980, Visita Técnica 1.420 e Empreender Mais 980 horas."
    />
  );
}`;

export const barrasPolar: ChartPreset = {
  id: "barras-polar",
  nome: "Barras Polares",
  categoria: "barras",
  descricao:
    "Barras em coordenada polar (angleAxis e radiusAxis) para comparação visualmente marcante entre poucos programas.",
  tags: ["barras", "polar", "radial", "comparação"],
  option,
  codigoReact,
  quandoUsar: [
    "Destaque visual em capas de painel e telas de apresentação",
    "Poucas categorias (até 6) com diferenças claras entre si",
    "Quando o objetivo é hierarquia geral, não leitura precisa de valor",
  ],
  quandoNaoUsar: [
    "Comparação precisa: o olho julga mal o comprimento de arco",
    "Séries múltiplas ou muitas categorias",
    "Relatórios analíticos — prefira barras horizontais tradicionais",
  ],
  acessibilidade: [
    "Sempre disponibilize o valor no tooltip, já que o arco é impreciso",
    "Descreva todos os valores no ariaLabel, em ordem decrescente",
    "Use uma cor por categoria da paleta oficial, garantindo contraste com o fundo",
  ],
  ariaLabel:
    "Barras em coordenada polar com horas de consultoria por programa: Empreender 3.200, AGI 2.650, Programa Inova 1.980, Visita Técnica 1.420 e Empreender Mais 980 horas.",
  altura: 360,
};

export default barrasPolar;
