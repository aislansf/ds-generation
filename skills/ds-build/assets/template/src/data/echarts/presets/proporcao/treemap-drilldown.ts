import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPaletteEstendida();

export const dados = [
  {
    name: "Região Metropolitana",
    itemStyle: { color: palette[0] },
    children: [
      { name: "Porto Central", value: 4820, children: [{ name: "Comércio", value: 2100 }, { name: "Serviços", value: 1900 }, { name: "Indústria", value: 820 }] },
      { name: "Lagoa Azul", value: 1780, children: [{ name: "Comércio", value: 900 }, { name: "Serviços", value: 620 }, { name: "Indústria", value: 260 }] },
      { name: "Vila Nova", value: 1520, children: [{ name: "Indústria", value: 700 }, { name: "Comércio", value: 520 }, { name: "Serviços", value: 300 }] },
    ],
  },
  {
    name: "Vale do Sul",
    itemStyle: { color: palette[1] },
    children: [
      { name: "Nova Esperança", value: 2140, children: [{ name: "Comércio", value: 1200 }, { name: "Serviços", value: 640 }, { name: "Turismo", value: 300 }] },
      { name: "Bom Retiro", value: 1180, children: [{ name: "Serviços", value: 520 }, { name: "Comércio", value: 460 }, { name: "Agronegócio", value: 200 }] },
    ],
  },
  {
    name: "Serra Alta",
    itemStyle: { color: palette[2] },
    children: [
      { name: "Serra Alta", value: 2310, children: [{ name: "Comércio", value: 1100 }, { name: "Indústria", value: 720 }, { name: "Serviços", value: 490 }] },
      { name: "Campo Alegre", value: 820, children: [{ name: "Agronegócio", value: 420 }, { name: "Comércio", value: 400 }] },
    ],
  },
  {
    name: "Região Central",
    itemStyle: { color: palette[3] },
    children: [
      { name: "Monte Claro", value: 740, children: [{ name: "Comércio", value: 380 }, { name: "Agronegócio", value: 360 }] },
      { name: "Cachoeira Alta", value: 620, children: [{ name: "Comércio", value: 340 }, { name: "Serviços", value: 280 }] },
    ],
  },
];

export const option: EChartsOption = {
  tooltip: {
    formatter: (p) => {
      const item = p as { name: string; value?: number };
      return `<strong>${item.name}</strong><br/>${formatarNumero(item.value ?? 0)} empresas atendidas`;
    },
  },
  series: [
    {
      type: "treemap",
      name: "Empresas atendidas",
      data: dados,
      roam: false,
      nodeClick: "zoomToNode",
      leafDepth: 1,
      top: 44,
      left: 0,
      right: 0,
      bottom: 0,
      breadcrumb: {
        show: true,
        top: 8,
        left: "center",
        height: 24,
        itemStyle: {
          color: readToken("--muted-foreground", 0.18),
          borderColor: readToken("--border"),
          textStyle: { color: readToken("--foreground"), fontSize: 11 },
        },
        emphasis: { itemStyle: { color: readToken("--primary", 0.3) } },
      },
      label: { show: true, formatter: "{b}", fontSize: 11, color: readToken("--primary-foreground") },
      upperLabel: { show: true, height: 20, fontSize: 11, color: readToken("--primary-foreground") },
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2, gapWidth: 2 },
      emphasis: { focus: "descendant" },
      levels: [
        { itemStyle: { borderWidth: 0, gapWidth: 4 } },
        { itemStyle: { gapWidth: 2 }, colorSaturation: [0.35, 0.6] },
        { itemStyle: { gapWidth: 1 }, colorSaturation: [0.3, 0.5] },
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
    name: "Região Metropolitana", itemStyle: { color: palette[0] },
    children: [
      { name: "Porto Central", value: 4820, children: [{ name: "Comércio", value: 2100 }, { name: "Serviços", value: 1900 }] },
      { name: "Lagoa Azul", value: 1780, children: [{ name: "Comércio", value: 900 }, { name: "Serviços", value: 620 }] },
    ],
  },
  {
    name: "Vale do Sul", itemStyle: { color: palette[1] },
    children: [
      { name: "Nova Esperança", value: 2140, children: [{ name: "Comércio", value: 1200 }] },
      { name: "Bom Retiro", value: 1180, children: [{ name: "Serviços", value: 520 }] },
    ],
  },
];

const option: EChartsOption = {
  tooltip: {},
  series: [{
    type: "treemap",
    data: dados,
    nodeClick: "zoomToNode",
    leafDepth: 1,
    breadcrumb: { show: true, top: 8, left: "center" },
    upperLabel: { show: true, height: 20 },
    itemStyle: { borderColor: readToken("--card"), borderWidth: 2, gapWidth: 2 },
    emphasis: { focus: "descendant" },
  }],
};

export function EmpresasTreemapChart() {
  return (
    <BrandChart
      option={option}
      height={420}
      ariaLabel="Treemap navegável de empresas atendidas por macrorregião, município e setor, com breadcrumb."
    />
  );
}`;

export const treemapDrilldown: ChartPreset = {
  id: "treemap-drilldown",
  nome: "Treemap com Drilldown",
  categoria: "proporcao",
  descricao:
    "Treemap navegável por níveis (macrorregião, município e setor) com breadcrumb e zoom no clique.",
  tags: ["treemap", "drilldown", "breadcrumb", "paleta estendida"],
  option,
  codigoReact,
  quandoUsar: [
    "Explorar hierarquias grandes sem sair da mesma área de plotagem",
    "Quando o usuário precisa navegar do agregado ao detalhe",
    "Distribuição de volume por região, município e setor",
  ],
  quandoNaoUsar: [
    "Relatórios estáticos impressos, sem interação",
    "Comparação precisa entre retângulos de tamanho próximo",
    "Séries temporais",
  ],
  acessibilidade: [
    "Breadcrumb textual indica sempre o nível atual da navegação",
    "Rótulo escrito em cada retângulo, além da cor",
    "Tooltip com valor absoluto formatado em pt-BR",
  ],
  ariaLabel:
    "Treemap navegável de empresas atendidas. No primeiro nível, Região Metropolitana é a maior área, seguido de Vale do Sul, Serra Alta e Região Central; o clique aprofunda para município e setor.",
  altura: 420,
};

export default treemapDrilldown;
