import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

export const portfolio = {
  name: "Portfólio __BRAND_NAME__",
  children: [
    {
      name: "Inovação",
      children: [
        { name: "Programa Inova", children: [{ name: "Consultoria tecnológica" }, { name: "Design de produto" }] },
        { name: "AGI", children: [{ name: "Ciclo de inovação" }, { name: "Radar da inovação" }] },
      ],
    },
    {
      name: "Mercado",
      children: [
        { name: "Visita Técnica", children: [{ name: "Visita técnica" }, { name: "Plano de melhoria" }] },
        { name: "Feiras e rodadas", children: [{ name: "Rodada de negócios" }, { name: "Missão comercial" }] },
      ],
    },
    {
      name: "Capacitação",
      children: [
        { name: "Empreender", children: [{ name: "Seminário 60h" }, { name: "Mentoria pós-curso" }] },
        { name: "Empreender Mais", children: [{ name: "Oficinas temáticas" }] },
      ],
    },
  ],
};

export const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove", formatter: (p) => `<strong>${(p as { name: string }).name}</strong>` },
  legend: { show: false },
  series: [
    {
      name: "Estrutura do portfólio",
      type: "tree",
      data: [portfolio],
      left: 16,
      right: 160,
      top: 16,
      bottom: 16,
      orient: "LR",
      symbol: "circle",
      symbolSize: 9,
      initialTreeDepth: 3,
      itemStyle: { color: palette[0], borderColor: palette[0] },
      label: {
        position: "left",
        verticalAlign: "middle",
        align: "right",
        fontSize: 11,
        color: readToken("--foreground"),
      },
      leaves: {
        label: { position: "right", verticalAlign: "middle", align: "left", color: readToken("--muted-foreground") },
      },
      lineStyle: { color: readToken("--border"), width: 1.4, curveness: 0.5 },
      emphasis: { focus: "descendant", itemStyle: { color: palette[1] } },
      expandAndCollapse: true,
      animationDuration: 450,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

const portfolio = {
  name: "Portfólio __BRAND_NAME__",
  children: [
    { name: "Inovação", children: [{ name: "Programa Inova", children: [{ name: "Consultoria tecnológica" }] }] },
    { name: "Mercado", children: [{ name: "Visita Técnica", children: [{ name: "Visita técnica" }] }] },
    { name: "Capacitação", children: [{ name: "Empreender", children: [{ name: "Seminário 60h" }] }] },
  ],
};

const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove" },
  series: [{
    name: "Estrutura do portfólio",
    type: "tree",
    data: [portfolio],
    left: 16, right: 160, top: 16, bottom: 16,
    orient: "LR",
    symbol: "circle", symbolSize: 9, initialTreeDepth: 3,
    itemStyle: { color: palette[0], borderColor: palette[0] },
    label: { position: "left", verticalAlign: "middle", align: "right", fontSize: 11, color: readToken("--foreground") },
    leaves: { label: { position: "right", verticalAlign: "middle", align: "left", color: readToken("--muted-foreground") } },
    lineStyle: { color: readToken("--border"), width: 1.4, curveness: 0.5 },
    emphasis: { focus: "descendant" },
    expandAndCollapse: true,
  }],
};

export function PortfolioArvoreChart() {
  return (
    <BrandChart
      option={option}
      height={440}
      ariaLabel="Árvore horizontal do portfólio __BRAND_NAME__ em três níveis: três eixos (Inovação, Mercado e Capacitação), seis programas e treze produtos."
    />
  );
}`;

export const arvore: ChartPreset = {
  id: "arvore",
  nome: "Árvore Hierárquica",
  categoria: "relacoes",
  descricao:
    "Estrutura do portfólio em três níveis (eixo, programa e produto) em árvore horizontal com expandir e recolher.",
  tags: ["árvore", "tree", "hierarquia", "portfólio"],
  option,
  codigoReact,
  quandoUsar: [
    "Explicar estruturas de responsabilidade, catálogo ou taxonomia",
    "Quando a relação pai-filho é a informação central",
    "Navegar por níveis com expandir e recolher",
  ],
  quandoNaoUsar: [
    "Comparar magnitudes entre nós — prefira treemap",
    "Relações em rede com múltiplos pais",
    "Hierarquias muito profundas em espaço estreito",
  ],
  acessibilidade: [
    "Rótulos de todos os nós visíveis, sem depender de hover",
    "Estados de expandir e recolher devem ter equivalente em lista aninhada HTML",
    "Descreva no ariaLabel a quantidade de níveis e de itens por nível",
  ],
  ariaLabel:
    "Árvore horizontal do portfólio __BRAND_NAME__ em três níveis: três eixos (Inovação, Mercado e Capacitação), seis programas e treze produtos.",
  altura: 440,
};

export default arvore;
