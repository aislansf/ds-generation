import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarMoeda } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const hierarquia = [
  {
    name: "Inovação",
    itemStyle: { color: palette[0] },
    children: [
      { name: "Programa Inova", value: 4_200_000 },
      { name: "AGI", value: 2_800_000 },
    ],
  },
  {
    name: "Mercado",
    itemStyle: { color: palette[1] },
    children: [
      { name: "Visita Técnica", value: 3_100_000 },
      { name: "Feiras e rodadas", value: 1_450_000 },
    ],
  },
  {
    name: "Capacitação",
    itemStyle: { color: palette[2] },
    children: [
      { name: "Empreender", value: 2_600_000 },
      { name: "Empreender Mais", value: 1_200_000 },
    ],
  },
  {
    name: "Territórios",
    itemStyle: { color: palette[6] },
    children: [
      { name: "Vale do Sul", value: 1_050_000 },
      { name: "Serra Alta", value: 820_000 },
      { name: "Região Central", value: 610_000 },
    ],
  },
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => `${p.name as string}<br/><strong>${formatarMoeda(p.value as number, 0)}</strong>`,
  },
  legend: { show: false },
  series: [
    {
      name: "Investimento por eixo e programa",
      type: "treemap",
      roam: false,
      nodeClick: "zoomToNode",
      breadcrumb: { show: true, bottom: 0, itemStyle: { color: readToken("--muted") } },
      upperLabel: { show: true, height: 22, color: readToken("--primary-foreground"), fontSize: 12 },
      label: {
        show: true,
        formatter: (p) => `${p.name as string}\n${formatarMoeda(p.value as number, 0)}`,
        fontSize: 11,
      },
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2, gapWidth: 2 },
      levels: [
        { itemStyle: { borderWidth: 0, gapWidth: 4 } },
        { itemStyle: { gapWidth: 2, borderColor: readToken("--card"), borderWidth: 2 } },
      ],

      data: hierarquia,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarMoeda } from "@/lib/echarts/format";

const palette = getBrandPalette();

const hierarquia = [
  { name: "Inovação", itemStyle: { color: palette[0] }, children: [{ name: "Programa Inova", value: 4200000 }, { name: "AGI", value: 2800000 }] },
  { name: "Mercado", itemStyle: { color: palette[1] }, children: [{ name: "Visita Técnica", value: 3100000 }, { name: "Feiras e rodadas", value: 1450000 }] },
  { name: "Capacitação", itemStyle: { color: palette[2] }, children: [{ name: "Empreender", value: 2600000 }, { name: "Empreender Mais", value: 1200000 }] },
  { name: "Territórios", itemStyle: { color: palette[6] }, children: [{ name: "Vale do Sul", value: 1050000 }, { name: "Serra Alta", value: 820000 }, { name: "Região Central", value: 610000 }] },
];

const option: EChartsOption = {
  tooltip: { trigger: "item", formatter: (p) => p.name + "<br/><strong>" + formatarMoeda(p.value as number, 0) + "</strong>" },
  legend: { show: false },
  series: [{
    name: "Investimento por eixo e programa",
    type: "treemap",
    roam: false,
    nodeClick: "zoomToNode",
    breadcrumb: { show: true, bottom: 0 },
    upperLabel: { show: true, height: 22, color: readToken("--primary-foreground"), fontSize: 12 },
    label: { show: true, formatter: (p) => p.name + "\\n" + formatarMoeda(p.value as number, 0), fontSize: 11 },
    itemStyle: { borderColor: readToken("--card"), borderWidth: 2, gapWidth: 2 },
    levels: [
      { itemStyle: { borderWidth: 0, gapWidth: 4 } },
      { itemStyle: { gapWidth: 2, borderColor: readToken("--card"), borderWidth: 2 } },
    ],
    data: hierarquia,
  }],
};

export function InvestimentoTreemapChart() {
  return (
    <BrandChart
      option={option}
      height={400}
      ariaLabel="Treemap do investimento por eixo e programa. Inovação concentra 7 milhões de reais, Mercado 4,55 milhões, Capacitação 3,8 milhões e Territórios 2,48 milhões, com destaque para Programa Inova e Visita Técnica."
    />
  );
}`;

export const treemap: ChartPreset = {
  id: "treemap",
  nome: "Treemap Hierárquico",
  categoria: "proporcao",
  descricao:
    "Dois níveis de hierarquia (eixo e programa) com área proporcional ao investimento, breadcrumb e drill-down por clique.",
  tags: ["treemap", "hierarquia", "investimento", "drill-down"],
  option,
  codigoReact,
  quandoUsar: [
    "Composição hierárquica com muitos itens em pouco espaço",
    "Identificar rapidamente onde está concentrado o orçamento",
    "Quando o usuário se beneficia de navegar do agregado ao detalhe",
  ],
  quandoNaoUsar: [
    "Comparação precisa entre retângulos de proporções diferentes",
    "Valores negativos ou taxas, que não têm área somável",
    "Séries temporais",
  ],
  acessibilidade: [
    "Exiba nome e valor formatado dentro do retângulo sempre que houver espaço",
    "Mantenha o breadcrumb visível para não perder o contexto no drill-down",
    "Resuma no ariaLabel os totais por nível superior e os maiores itens",
  ],
  ariaLabel:
    "Treemap do investimento por eixo e programa. Inovação concentra 7 milhões de reais, Mercado 4,55 milhões, Capacitação 3,8 milhões e Territórios 2,48 milhões, com destaque para Programa Inova e Visita Técnica.",
  altura: 400,
};

export default treemap;
