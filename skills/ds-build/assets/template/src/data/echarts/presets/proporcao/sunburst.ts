import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarMoeda } from "@/lib/echarts/format";

const palette = getBrandPalette();

const hierarquia = [
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
      type: "sunburst",
      radius: [24, "88%"],
      center: ["50%", "50%"],
      nodeClick: "rootToNode",
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: { rotate: "radial", fontSize: 11, minAngle: 12 },
      levels: [
        {},
        { r0: 24, r: "56%", label: { rotate: "tangential", fontSize: 12 } },
        { r0: "56%", r: "84%", label: { align: "right" } },
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
    type: "sunburst",
    radius: [24, "88%"],
    center: ["50%", "50%"],
    nodeClick: "rootToNode",
    itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
    label: { rotate: "radial", fontSize: 11, minAngle: 12 },
    levels: [
      {},
      { r0: 24, r: "56%", label: { rotate: "tangential", fontSize: 12 } },
      { r0: "56%", r: "84%", label: { align: "right" } },
    ],
    data: hierarquia,
  }],
};

export function InvestimentoSunburstChart() {
  return (
    <BrandChart
      option={option}
      height={400}
      ariaLabel="Sunburst do investimento em anéis concêntricos. O anel interno traz os eixos Inovação, Mercado, Capacitação e Territórios, e o externo os programas, com Programa Inova de 4,2 milhões como maior item."
    />
  );
}`;

export const sunburst: ChartPreset = {
  id: "sunburst",
  nome: "Sunburst Hierárquico",
  categoria: "proporcao",
  descricao:
    "Mesma hierarquia do treemap em anéis concêntricos, com drill-down por clique (rootToNode) e rótulos radiais.",
  tags: ["sunburst", "hierarquia", "anéis", "drill-down"],
  option,
  codigoReact,
  quandoUsar: [
    "Comunicar a estrutura da hierarquia, e não apenas a magnitude",
    "Dois ou três níveis com poucos filhos por nó",
    "Exploração interativa do agregado para o detalhe",
  ],
  quandoNaoUsar: [
    "Muitos nós por nível: os rótulos ficam ilegíveis",
    "Leitura precisa de valores — prefira treemap ou barras hierárquicas",
    "Relatórios estáticos sem possibilidade de interação",
  ],
  acessibilidade: [
    "Defina minAngle nos rótulos para evitar textos amontoados",
    "Garanta que o tooltip informe o caminho e o valor formatado do nó",
    "Descreva no ariaLabel a composição de cada anel e o maior item",
  ],
  ariaLabel:
    "Sunburst do investimento em anéis concêntricos. O anel interno traz os eixos Inovação, Mercado, Capacitação e Territórios, e o externo os programas, com Programa Inova de 4,2 milhões como maior item.",
  altura: 400,
};

export default sunburst;
