import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPaletteEstendida();

export const dados = [
  {
    name: "Competitividade",
    itemStyle: { color: palette[0] },
    children: [
      {
        name: "Empreender Mais",
        children: [
          { name: "Porto Central", value: 980 },
          { name: "Serra Alta", value: 520 },
          { name: "Nova Esperança", value: 460 },
        ],
      },
      {
        name: "Visita Técnica",
        children: [
          { name: "Lagoa Azul", value: 610 },
          { name: "Vila Nova", value: 480 },
          { name: "Monte Claro", value: 300 },
        ],
      },
    ],
  },
  {
    name: "Inovação",
    itemStyle: { color: palette[1] },
    children: [
      {
        name: "Programa Inova",
        children: [
          { name: "Porto Central", value: 540 },
          { name: "Bom Retiro", value: 260 },
        ],
      },
      {
        name: "AGI",
        children: [
          { name: "Rio Verde", value: 320 },
          { name: "Campo Alegre", value: 210 },
        ],
      },
    ],
  },
  {
    name: "Formalização",
    itemStyle: { color: palette[2] },
    children: [
      {
        name: "MEI Regular",
        children: [
          { name: "Porto Central", value: 720 },
          { name: "Cachoeira Alta", value: 240 },
          { name: "Alto Bonito", value: 180 },
        ],
      },
      {
        name: "Empreender",
        children: [
          { name: "Porto Central", value: 300 },
          { name: "Praia Mansa", value: 140 },
        ],
      },
    ],
  },
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const item = p as { name: string; value?: number };
      return `<strong>${item.name}</strong><br/>${formatarNumero(item.value ?? 0)} atendimentos`;
    },
  },
  color: palette,
  series: [
    {
      type: "sunburst",
      data: dados,
      radius: ["12%", "92%"],
      center: ["50%", "50%"],
      sort: undefined,
      emphasis: { focus: "ancestor" },
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      levels: [
        {},
        { r0: "12%", r: "44%", label: { rotate: "tangential", fontSize: 11 } },
        { r0: "44%", r: "70%", label: { rotate: "radial", fontSize: 10 } },
        { r0: "70%", r: "90%", label: { rotate: "radial", fontSize: 9 }, itemStyle: { opacity: 0.85 } },
      ],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPaletteEstendida();
const dados = [
  {
    name: "Competitividade", itemStyle: { color: palette[0] },
    children: [
      { name: "Empreender Mais", children: [{ name: "Porto Central", value: 980 }, { name: "Serra Alta", value: 520 }] },
      { name: "Visita Técnica", children: [{ name: "Lagoa Azul", value: 610 }, { name: "Vila Nova", value: 480 }] },
    ],
  },
  {
    name: "Inovação", itemStyle: { color: palette[1] },
    children: [
      { name: "Programa Inova", children: [{ name: "Porto Central", value: 540 }, { name: "Bom Retiro", value: 260 }] },
      { name: "AGI", children: [{ name: "Rio Verde", value: 320 }] },
    ],
  },
];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  color: palette,
  series: [{
    type: "sunburst",
    data: dados,
    radius: ["12%", "92%"],
    emphasis: { focus: "ancestor" },
    itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
    levels: [
      {},
      { r0: "12%", r: "44%", label: { rotate: "tangential" } },
      { r0: "44%", r: "70%", label: { rotate: "radial" } },
      { r0: "70%", r: "90%", label: { rotate: "radial" } },
    ],
  }],
};

export function EixoProgramaMunicipioChart() {
  return (
    <BrandChart
      option={option}
      height={440}
      ariaLabel="Sunburst de três níveis: eixo estratégico, programa e município."
    />
  );
}`;

export const sunburstMultinivel: ChartPreset = {
  id: "sunburst-multinivel",
  nome: "Sunburst Multinível",
  categoria: "proporcao",
  descricao:
    "Sunburst de três níveis — eixo estratégico, programa e município — com rótulos radiais e paleta estendida.",
  tags: ["sunburst", "hierarquia", "três níveis", "paleta estendida"],
  option,
  codigoReact,
  quandoUsar: [
    "Hierarquias de três níveis com totais que se somam",
    "Explorar a distribuição de um total por caminhos completos",
    "Quando o clique para aprofundar é desejável",
  ],
  quandoNaoUsar: [
    "Comparação precisa de valores entre folhas distantes",
    "Hierarquias muito largas: os rótulos deixam de caber",
    "Quando o público precisa de leitura rápida — prefira barras",
  ],
  acessibilidade: [
    "Rótulos escritos em todos os níveis, tangenciais e radiais",
    "Tooltip com nome e valor absoluto formatado em pt-BR",
    "Bordas na cor do card garantem separação em light e dark",
  ],
  ariaLabel:
    "Sunburst de três níveis com eixos Competitividade, Inovação e Formalização, seus programas e municípios de exemplo. Competitividade é o maior anel, com Empreender Mais concentrado em Porto Central com 980 atendimentos.",
  altura: 440,
};

export default sunburstMultinivel;
