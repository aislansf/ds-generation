import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const dimensoes = [
  "Gestão financeira",
  "Marketing e vendas",
  "Processos",
  "Inovação",
  "Pessoas",
  "Formalização",
];
export const empreender = [78, 72, 70, 62, 82, 88];
export const ali = [64, 60, 66, 84, 58, 74];

export const option: EChartsOption = {
  tooltip: { trigger: "item", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "center", data: ["Empreender", "AGI"] },
  radar: {
    center: ["50%", "56%"],
    radius: "62%",
    indicator: dimensoes.map((name) => ({ name, max: 100 })),
    axisName: { color: readToken("--muted-foreground"), fontSize: 11 },
    splitLine: { lineStyle: { color: readToken("--border") } },
    axisLine: { lineStyle: { color: readToken("--border") } },
    splitArea: { areaStyle: { color: [readToken("--primary", 0.04), "transparent"] } },
  },
  series: [
    {
      type: "radar",
      symbolSize: 5,
      emphasis: { focus: "series" },
      data: [
        {
          name: "Empreender",
          value: empreender,
          lineStyle: { width: 2, color: palette[0] },
          itemStyle: { color: palette[0] },
          areaStyle: { color: palette[0].replace("rgb(", "rgba(").replace(")", ", 0.22)") },
        },
        {
          name: "AGI",
          value: ali,
          lineStyle: { width: 2, color: palette[2] },
          itemStyle: { color: palette[2] },
          areaStyle: { color: palette[2].replace("rgb(", "rgba(").replace(")", ", 0.22)") },
        },
      ],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();
const dimensoes = ["Gestão financeira", "Marketing e vendas", "Processos", "Inovação", "Pessoas", "Formalização"];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { top: 0, left: "center", data: ["Empreender", "AGI"] },
  radar: {
    radius: "62%",
    indicator: dimensoes.map((name) => ({ name, max: 100 })),
    axisName: { color: readToken("--muted-foreground"), fontSize: 11 },
    splitLine: { lineStyle: { color: readToken("--border") } },
  },
  series: [{
    type: "radar",
    data: [
      { name: "Empreender", value: [78, 72, 70, 62, 82, 88], lineStyle: { color: palette[0] }, itemStyle: { color: palette[0] }, areaStyle: { color: palette[0].replace("rgb(", "rgba(").replace(")", ", 0.22)") } },
      { name: "AGI", value: [64, 60, 66, 84, 58, 74], lineStyle: { color: palette[2] }, itemStyle: { color: palette[2] }, areaStyle: { color: palette[2].replace("rgb(", "rgba(").replace(")", ", 0.22)") } },
    ],
  }],
};

export function ProgramasRadarChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Radar comparando Empreender e AGI em seis dimensões de maturidade."
    />
  );
}`;

export const radarComparativo: ChartPreset = {
  id: "radar-comparativo",
  nome: "Radar Comparativo",
  categoria: "distribuicao",
  descricao:
    "Duas séries preenchidas no mesmo radar comparando o perfil de resultado dos programas Empreender e AGI.",
  tags: ["radar", "comparativo", "programas", "diagnóstico"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar dois perfis na mesma escala normalizada",
    "Antes e depois de um programa de capacitação",
    "Mostrar forças e fraquezas complementares",
  ],
  quandoNaoUsar: [
    "Três ou mais séries: as áreas se sobrepõem e escondem dados",
    "Escalas diferentes por eixo",
    "Quando o valor exato de cada eixo é o foco — prefira barras",
  ],
  acessibilidade: [
    "Legenda obrigatória com o nome dos dois programas",
    "Opacidade de 22% nas áreas mantém ambas visíveis simultaneamente",
    "Tooltip lista os seis valores da série apontada",
  ],
  ariaLabel:
    "Radar comparando Empreender e AGI em seis dimensões. Empreender é superior em Pessoas com 82 e Formalização com 88; AGI se destaca em Inovação com 84 contra 62 do Empreender.",
  altura: 380,
};

export default radarComparativo;
