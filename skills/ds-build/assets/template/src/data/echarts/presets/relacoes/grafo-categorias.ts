import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPaletteEstendida();

export const categorias = [
  { name: "Programa" },
  { name: "Macrorregião" },
  { name: "Setor" },
];

export const nos = [
  { name: "Empreender", category: 0, symbolSize: 44 },
  { name: "AGI", category: 0, symbolSize: 40 },
  { name: "Programa Inova", category: 0, symbolSize: 36 },
  { name: "Visita Técnica", category: 0, symbolSize: 50 },
  { name: "Região Metropolitana", category: 1, symbolSize: 46 },
  { name: "Vale do Sul", category: 1, symbolSize: 34 },
  { name: "Serra Alta", category: 1, symbolSize: 32 },
  { name: "Região Central", category: 1, symbolSize: 26 },
  { name: "Comércio", category: 2, symbolSize: 30 },
  { name: "Serviços", category: 2, symbolSize: 30 },
  { name: "Indústria", category: 2, symbolSize: 24 },
  { name: "Agronegócio", category: 2, symbolSize: 22 },
];

export const arestas = [
  { source: "Empreender", target: "Região Metropolitana", value: 320 },
  { source: "Empreender", target: "Vale do Sul", value: 140 },
  { source: "AGI", target: "Região Metropolitana", value: 260 },
  { source: "AGI", target: "Serra Alta", value: 180 },
  { source: "Programa Inova", target: "Vale do Sul", value: 150 },
  { source: "Programa Inova", target: "Região Central", value: 90 },
  { source: "Visita Técnica", target: "Região Metropolitana", value: 420 },
  { source: "Visita Técnica", target: "Serra Alta", value: 210 },
  { source: "Visita Técnica", target: "Região Central", value: 160 },
  { source: "Região Metropolitana", target: "Comércio", value: 380 },
  { source: "Região Metropolitana", target: "Serviços", value: 340 },
  { source: "Vale do Sul", target: "Comércio", value: 180 },
  { source: "Serra Alta", target: "Indústria", value: 150 },
  { source: "Região Central", target: "Agronegócio", value: 120 },
];

export const option: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { top: 0, left: "left", data: categorias.map((c) => c.name) },
  color: palette,
  series: [
    {
      type: "graph",
      layout: "force",
      roam: true,
      draggable: true,
      top: 44,
      categories: categorias,
      data: nos,
      links: arestas,
      force: { repulsion: 220, edgeLength: [80, 160], gravity: 0.08 },
      label: { show: true, position: "right", fontSize: 10, color: readToken("--foreground") },
      lineStyle: { color: readToken("--muted-foreground", 0.4), curveness: 0.15, width: 1.2 },
      emphasis: { focus: "adjacency", lineStyle: { width: 2.5 } },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPaletteEstendida();
const categorias = [{ name: "Programa" }, { name: "Macrorregião" }, { name: "Setor" }];
const nos = [
  { name: "Empreender", category: 0, symbolSize: 44 },
  { name: "Visita Técnica", category: 0, symbolSize: 50 },
  { name: "Região Metropolitana", category: 1, symbolSize: 46 },
  { name: "Comércio", category: 2, symbolSize: 30 },
];
const arestas = [
  { source: "Empreender", target: "Região Metropolitana", value: 320 },
  { source: "Visita Técnica", target: "Região Metropolitana", value: 420 },
  { source: "Região Metropolitana", target: "Comércio", value: 380 },
];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { top: 0, left: "left", data: categorias.map((c) => c.name) },
  color: palette,
  series: [{
    type: "graph",
    layout: "force",
    roam: true,
    categories: categorias,
    data: nos,
    links: arestas,
    force: { repulsion: 220, edgeLength: [80, 160], gravity: 0.08 },
    label: { show: true, position: "right", color: readToken("--foreground") },
    lineStyle: { color: readToken("--muted-foreground", 0.4), curveness: 0.15 },
    emphasis: { focus: "adjacency" },
  }],
};

export function RedeProgramasChart() {
  return (
    <BrandChart
      option={option}
      height={440}
      ariaLabel="Grafo de força com nós agrupados nas categorias Programa, Macrorregião e Setor."
    />
  );
}`;

export const grafoCategorias: ChartPreset = {
  id: "grafo-categorias",
  nome: "Grafo por Categorias",
  categoria: "relacoes",
  descricao:
    "Graph com layout force e nós agrupados em três categorias — programa, macrorregião e setor — com legenda por categoria.",
  tags: ["graph", "force", "categorias", "paleta estendida"],
  option,
  codigoReact,
  quandoUsar: [
    "Mapear relacionamentos entre entidades de naturezas diferentes",
    "Identificar hubs e nós periféricos na rede de atendimento",
    "Até algumas dezenas de nós",
  ],
  quandoNaoUsar: [
    "Grafos muito densos: prefira layout circular ou matriz",
    "Quando o valor exato das ligações é o foco — prefira sankey ou tabela",
    "Relatórios estáticos, sem interação",
  ],
  acessibilidade: [
    "Legenda por categoria e rótulo escrito em cada nó",
    "Emphasis focus adjacency destaca vizinhos sem apagar contexto",
    "Cores da paleta estendida com contraste entre categorias",
  ],
  ariaLabel:
    "Grafo de força com doze nós em três categorias. Região Metropolitana e Visita Técnica são os nós mais conectados, ligando programas a setores como Comércio e Serviços.",
  altura: 440,
};

export default grafoCategorias;
