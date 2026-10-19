import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const regioes = ["Porto Central", "Vale do Sul", "Região Central", "Litoral Leste", "Serra Alta", "Planalto Oeste"];

export const nos = regioes.map((nome, i) => ({
  name: nome,
  symbolSize: 22 + i,
  itemStyle: { color: palette[i] },
}));

/** Encaminhamentos entre macrorregiões (peso = empreendedores atendidos fora da região de origem) */
export const ligacoes = [
  { source: "Porto Central", target: "Vale do Sul", value: 180 },
  { source: "Porto Central", target: "Litoral Leste", value: 240 },
  { source: "Porto Central", target: "Serra Alta", value: 210 },
  { source: "Porto Central", target: "Região Central", value: 150 },
  { source: "Vale do Sul", target: "Planalto Oeste", value: 95 },
  { source: "Vale do Sul", target: "Região Central", value: 130 },
  { source: "Região Central", target: "Serra Alta", value: 110 },
  { source: "Litoral Leste", target: "Vale do Sul", value: 85 },
  { source: "Serra Alta", target: "Planalto Oeste", value: 70 },
  { source: "Planalto Oeste", target: "Porto Central", value: 60 },
  { source: "Litoral Leste", target: "Serra Alta", value: 90 },
  { source: "Região Central", target: "Porto Central", value: 140 },
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { dataType: string; name: string; value: number; data: { source?: string; target?: string } };
      if (params.dataType === "edge") {
        return `${params.data.source} ↔ ${params.data.target}<br/><strong>${formatarNumero(params.value)}</strong> empreendedores`;
      }
      return `<strong>${params.name}</strong>`;
    },
  },
  legend: { show: false },
  series: [
    {
      name: "Relacionamento entre macrorregiões",
      type: "graph",
      layout: "circular",
      circular: { rotateLabel: true },
      roam: false,
      label: { show: true, position: "right", color: readToken("--foreground"), fontSize: 11 },
      lineStyle: { color: "source", curveness: 0.45, opacity: 0.55 },
      emphasis: { focus: "adjacency", lineStyle: { opacity: 0.95 } },
      itemStyle: { borderColor: readToken("--card"), borderWidth: 1 },
      data: nos,
      links: ligacoes.map((l) => ({ ...l, lineStyle: { width: Math.max(1.2, l.value / 40) } })),
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const regioes = ["Porto Central", "Vale do Sul", "Região Central", "Litoral Leste", "Serra Alta", "Planalto Oeste"];
const nos = regioes.map((nome, i) => ({ name: nome, symbolSize: 22 + i, itemStyle: { color: palette[i] } }));

const ligacoes = [
  { source: "Porto Central", target: "Vale do Sul", value: 180 },
  { source: "Porto Central", target: "Litoral Leste", value: 240 },
  { source: "Vale do Sul", target: "Planalto Oeste", value: 95 },
  { source: "Região Central", target: "Serra Alta", value: 110 },
];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { dataType: string; name: string; value: number; data: { source?: string; target?: string } };
      if (params.dataType === "edge") {
        return params.data.source + " ↔ " + params.data.target + "<br/><strong>" + formatarNumero(params.value) + "</strong> empreendedores";
      }
      return "<strong>" + params.name + "</strong>";
    },
  },
  series: [{
    name: "Relacionamento entre macrorregiões",
    type: "graph",
    layout: "circular",
    circular: { rotateLabel: true },
    roam: false,
    label: { show: true, position: "right", color: readToken("--foreground"), fontSize: 11 },
    lineStyle: { color: "source", curveness: 0.45, opacity: 0.55 },
    emphasis: { focus: "adjacency", lineStyle: { opacity: 0.95 } },
    data: nos,
    links: ligacoes.map((l) => ({ ...l, lineStyle: { width: Math.max(1.2, l.value / 40) } })),
  }],
};

export function AcordesRegioesChart() {
  return (
    <BrandChart
      option={option}
      height={440}
      ariaLabel="Diagrama de acordes das seis macrorregiões com doze relações ponderadas. A ligação mais forte é entre Porto Central e Litoral Leste, com 240 empreendedores, e a mais fraca entre Planalto Oeste e Porto Central, com 60."
    />
  );
}`;

export const acordesRelacional: ChartPreset = {
  id: "acordes-relacional",
  nome: "Acordes Relacionais",
  categoria: "relacoes",
  descricao:
    "Matriz de relacionamento entre as macrorregiões em grafo circular, com espessura das arestas proporcional ao peso.",
  tags: ["acordes", "chord", "relacionamento", "macrorregiões"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar intensidade de relação entre pares de um mesmo conjunto",
    "Fluxos bidirecionais entre territórios, unidades ou setores",
    "Quando o total de nós é pequeno (até ~12)",
  ],
  quandoNaoUsar: [
    "Fluxos com etapas sequenciais — prefira sankey",
    "Muitos nós, o que satura o interior do círculo",
    "Comparar valores absolutos com precisão",
  ],
  acessibilidade: [
    "Espessura de aresta não é acessível isoladamente: publique a matriz em tabela",
    "Foco por vizinhança permite isolar as relações de cada região",
    "Cores dos nós vêm da paleta de tokens, garantindo contraste nos dois temas",
  ],
  ariaLabel:
    "Diagrama de acordes das seis macrorregiões com doze relações ponderadas. A ligação mais forte é entre Porto Central e Litoral Leste, com 240 empreendedores, e a mais fraca entre Planalto Oeste e Porto Central, com 60.",
  altura: 440,
};

export default acordesRelacional;
