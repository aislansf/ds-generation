import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { portfolio } from "@/data/echarts/presets/relacoes/arvore";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove", formatter: (p) => `<strong>${(p as { name: string }).name}</strong>` },
  legend: { show: false },
  series: [
    {
      name: "Portfólio em árvore radial",
      type: "tree",
      data: [portfolio],
      layout: "radial",
      top: 32,
      bottom: 32,
      left: 60,
      right: 60,
      symbol: "circle",
      symbolSize: 8,
      initialTreeDepth: 3,
      itemStyle: { color: palette[0], borderColor: palette[0] },
      label: { fontSize: 10, color: readToken("--foreground") },
      lineStyle: { color: readToken("--border"), width: 1.2, curveness: 0.5 },
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
    { name: "Inovação", children: [{ name: "Programa Inova" }, { name: "AGI" }] },
    { name: "Mercado", children: [{ name: "Visita Técnica" }, { name: "Feiras e rodadas" }] },
    { name: "Capacitação", children: [{ name: "Empreender" }, { name: "Empreender Mais" }] },
  ],
};

const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove" },
  series: [{
    name: "Portfólio em árvore radial",
    type: "tree",
    data: [portfolio],
    layout: "radial",
    top: 32, bottom: 32, left: 60, right: 60,
    symbol: "circle", symbolSize: 8, initialTreeDepth: 3,
    itemStyle: { color: palette[0], borderColor: palette[0] },
    label: { fontSize: 10, color: readToken("--foreground") },
    lineStyle: { color: readToken("--border"), width: 1.2, curveness: 0.5 },
    emphasis: { focus: "descendant" },
    expandAndCollapse: true,
  }],
};

export function PortfolioRadialChart() {
  return (
    <BrandChart
      option={option}
      height={460}
      ariaLabel="Árvore radial do portfólio __BRAND_NAME__: o nó central se ramifica em três eixos, seis programas e treze produtos distribuídos em anéis concêntricos."
    />
  );
}`;

export const arvoreRadial: ChartPreset = {
  id: "arvore-radial",
  nome: "Árvore Radial",
  categoria: "relacoes",
  descricao:
    "Mesma hierarquia de portfólio em layout radial, aproveitando melhor o espaço quando há muitos nós folha.",
  tags: ["árvore", "radial", "hierarquia", "tree"],
  option,
  codigoReact,
  quandoUsar: [
    "Hierarquias largas, com muitos filhos por nível",
    "Quando se quer transmitir a ideia de irradiação a partir de um centro",
    "Painéis quadrados, em que o layout horizontal desperdiça espaço",
  ],
  quandoNaoUsar: [
    "Rótulos longos, que se sobrepõem nos anéis externos",
    "Quando a leitura sequencial dos níveis importa — prefira árvore horizontal",
    "Comparação de valores entre nós",
  ],
  acessibilidade: [
    "Reduza a profundidade ou aumente a altura se os rótulos colidirem",
    "Forneça a mesma hierarquia em lista aninhada semântica",
    "Garanta contraste dos rótulos rotacionados nos dois temas",
  ],
  ariaLabel:
    "Árvore radial do portfólio __BRAND_NAME__: o nó central se ramifica em três eixos, seis programas e treze produtos distribuídos em anéis concêntricos.",
  altura: 460,
};

export default arvoreRadial;
