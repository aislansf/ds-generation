import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPaletteEstendida();

export const macrorregioes = [
  "Região Metropolitana",
  "Vale do Sul",
  "Serra Alta",
  "Região Central",
  "Litoral Leste",
  "Planalto Oeste",
  "Vale Claro",
];

/** Encaminhamentos entre escritórios regionais (peso da aresta). */
export const arestas = [
  { source: "Região Metropolitana", target: "Litoral Leste", value: 180 },
  { source: "Região Metropolitana", target: "Serra Alta", value: 140 },
  { source: "Região Metropolitana", target: "Vale do Sul", value: 120 },
  { source: "Região Metropolitana", target: "Região Central", value: 96 },
  { source: "Vale do Sul", target: "Vale Claro", value: 84 },
  { source: "Vale do Sul", target: "Planalto Oeste", value: 52 },
  { source: "Serra Alta", target: "Planalto Oeste", value: 46 },
  { source: "Serra Alta", target: "Região Central", value: 72 },
  { source: "Região Central", target: "Vale Claro", value: 58 },
  { source: "Litoral Leste", target: "Vale Claro", value: 64 },
  { source: "Planalto Oeste", target: "Vale Claro", value: 32 },
];

const grau: Record<string, number> = {};
arestas.forEach((a) => {
  grau[a.source] = (grau[a.source] ?? 0) + a.value;
  grau[a.target] = (grau[a.target] ?? 0) + a.value;
});

export const nos = macrorregioes.map((name, i) => ({
  name,
  symbolSize: 16 + (grau[name] ?? 0) / 22,
  itemStyle: { color: palette[i] },
}));

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const item = p as { dataType?: string; name?: string; data?: { source?: string; target?: string; value?: number } };
      if (item.dataType === "edge" && item.data) {
        return `${item.data.source} → ${item.data.target}<br/>${formatarNumero(item.data.value ?? 0)} encaminhamentos`;
      }
      return `<strong>${item.name}</strong><br/>${formatarNumero(grau[item.name ?? ""] ?? 0)} encaminhamentos no total`;
    },
  },
  series: [
    {
      type: "graph",
      layout: "circular",
      circular: { rotateLabel: true },
      roam: false,
      top: 24,
      bottom: 24,
      data: nos,
      links: arestas.map((a) => ({
        ...a,
        lineStyle: { width: Math.max(1, a.value / 26), color: readToken("--primary", 0.35), curveness: 0.3 },
      })),
      label: { show: true, position: "right", fontSize: 10, color: readToken("--foreground") },
      emphasis: { focus: "adjacency", lineStyle: { width: 4, color: readToken("--primary") } },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPaletteEstendida();
const macrorregioes = ["Região Metropolitana", "Vale do Sul", "Serra Alta", "Região Central", "Litoral Leste"];
const arestas = [
  { source: "Região Metropolitana", target: "Litoral Leste", value: 180 },
  { source: "Região Metropolitana", target: "Serra Alta", value: 140 },
  { source: "Vale do Sul", target: "Região Central", value: 84 },
];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  series: [{
    type: "graph",
    layout: "circular",
    circular: { rotateLabel: true },
    data: macrorregioes.map((name, i) => ({ name, symbolSize: 24, itemStyle: { color: palette[i] } })),
    links: arestas.map((a) => ({
      ...a,
      lineStyle: { width: Math.max(1, a.value / 26), color: readToken("--primary", 0.35), curveness: 0.3 },
    })),
    label: { show: true, position: "right", color: readToken("--foreground") },
    emphasis: { focus: "adjacency", lineStyle: { width: 4, color: readToken("--primary") } },
  }],
};

export function EncaminhamentosCircularChart() {
  return (
    <BrandChart
      option={option}
      height={420}
      ariaLabel="Grafo circular de encaminhamentos entre macrorregiões com espessura de aresta ponderada."
    />
  );
}`;

export const grafoMatrizAdjacencia: ChartPreset = {
  id: "grafo-matriz-adjacencia",
  nome: "Grafo Circular Ponderado",
  categoria: "relacoes",
  descricao:
    "Relacionamento entre macrorregiões em layout circular, com espessura de aresta proporcional ao volume de encaminhamentos.",
  tags: ["graph", "circular", "adjacência", "peso"],
  option,
  codigoReact,
  quandoUsar: [
    "Relações entre entidades do mesmo tipo",
    "Quando a intensidade da ligação é a informação principal",
    "Redes de 5 a 20 nós",
  ],
  quandoNaoUsar: [
    "Redes muito densas: as arestas se sobrepõem",
    "Hierarquias — prefira árvore",
    "Quando é preciso ler valores exatos: complemente com tabela",
  ],
  acessibilidade: [
    "Rótulo rotacionado em cada nó, sempre legível",
    "Tooltip específico para nó e para aresta com valores em pt-BR",
    "Espessura da aresta acompanha o valor, além da cor",
  ],
  ariaLabel:
    "Grafo circular de encaminhamentos entre sete macrorregiões. Região Metropolitana é o nó mais conectado, com destaque para a ligação de 180 encaminhamentos com Litoral Leste.",
  altura: 420,
};

export default grafoMatrizAdjacencia;
