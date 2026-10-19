import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";

export const dados = {
  name: "__BRAND_NAME__",
  children: [
    {
      name: "Competitividade",
      children: [
        { name: "Empreender Mais" },
        { name: "Visita Técnica" },
      ],
    },
    {
      name: "Inovação",
      children: [
        { name: "Programa Inova" },
        { name: "AGI" },
      ],
    },
    {
      name: "Empreendedorismo",
      children: [
        { name: "Empreender" },
        { name: "MEI Regular" },
      ],
    },
  ],
};

export const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove" },
  series: [
    {
      type: "tree",
      data: [dados],
      orient: "TB",
      top: 32,
      left: 24,
      right: 24,
      bottom: 48,
      symbol: "circle",
      symbolSize: 12,
      itemStyle: { color: readToken("--primary"), borderColor: readToken("--card"), borderWidth: 2 },
      lineStyle: { color: readToken("--muted-foreground", 0.45), width: 1.2, curveness: 0.5 },
      label: {
        position: "top",
        rotate: 0,
        verticalAlign: "middle",
        align: "center",
        fontSize: 11,
        color: readToken("--foreground"),
        distance: 8,
      },
      leaves: {
        label: { position: "bottom", rotate: 0, align: "center", verticalAlign: "middle", fontSize: 10 },
      },
      expandAndCollapse: true,
      initialTreeDepth: 3,
      emphasis: { focus: "descendant" },
      animationDurationUpdate: 600,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";

const dados = {
  name: "__BRAND_NAME__",
  children: [
    { name: "Competitividade", children: [{ name: "Empreender Mais" }, { name: "Visita Técnica" }] },
    { name: "Inovação", children: [{ name: "Programa Inova" }, { name: "AGI" }] },
    { name: "Empreendedorismo", children: [{ name: "Empreender" }, { name: "MEI Regular" }] },
  ],
};

const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove" },
  series: [{
    type: "tree",
    data: [dados],
    orient: "TB",
    symbol: "circle",
    symbolSize: 12,
    itemStyle: { color: readToken("--primary"), borderColor: readToken("--card"), borderWidth: 2 },
    lineStyle: { color: readToken("--muted-foreground", 0.45), curveness: 0.5 },
    label: { position: "top", align: "center", distance: 8, color: readToken("--foreground") },
    leaves: { label: { position: "bottom", align: "center" } },
    expandAndCollapse: true,
    initialTreeDepth: 3,
    emphasis: { focus: "descendant" },
  }],
};

export function EstruturaProgramasChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Árvore vertical da estrutura de eixos e programas do __BRAND_NAME__, do topo para baixo."
    />
  );
}`;

export const arvoreVertical: ChartPreset = {
  id: "arvore-vertical",
  nome: "Árvore Vertical",
  categoria: "relacoes",
  descricao:
    "Tree com orientação de cima para baixo apresentando a estrutura de eixos e programas do __BRAND_NAME__.",
  tags: ["tree", "hierarquia", "organograma", "vertical"],
  option,
  codigoReact,
  quandoUsar: [
    "Organogramas e estruturas de programas",
    "Hierarquias com poucos níveis e leitura de cima para baixo",
    "Quando o usuário pode expandir e recolher ramos",
  ],
  quandoNaoUsar: [
    "Hierarquias muito largas: prefira orientação horizontal",
    "Quando a proporção de valores importa — prefira treemap",
    "Relações não hierárquicas — prefira grafo",
  ],
  acessibilidade: [
    "Rótulo textual em todos os nós, sem depender de cor",
    "Expandir e recolher preserva os rótulos visíveis",
    "Linhas em tom neutro com contraste suficiente em light e dark",
  ],
  ariaLabel:
    "Árvore vertical do __BRAND_NAME__ com três eixos: Competitividade, com Empreender Mais e Visita Técnica; Inovação, com Programa Inova e AGI; e Empreendedorismo, com Empreender e MEI Regular.",
  altura: 380,
};

export default arvoreVertical;
