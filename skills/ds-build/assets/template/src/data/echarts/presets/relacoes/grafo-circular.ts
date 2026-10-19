import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";
import { ligacoes, nos } from "@/data/echarts/presets/relacoes/grafo-forca";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { dataType: string; name: string; value: number; data: { source?: string; target?: string } };
      if (params.dataType === "edge") {
        return `${params.data.source} → ${params.data.target}<br/><strong>${formatarNumero(params.value)}</strong> encaminhamentos`;
      }
      return `<strong>${params.name}</strong><br/>${formatarNumero(params.value)} atendimentos`;
    },
  },
  legend: { show: false },
  series: [
    {
      name: "Encaminhamentos (layout circular)",
      type: "graph",
      layout: "circular",
      circular: { rotateLabel: true },
      roam: false,
      symbolSize: 26,
      label: { show: true, position: "right", color: readToken("--foreground"), fontSize: 11 },
      edgeSymbol: ["none", "arrow"],
      edgeSymbolSize: 7,
      lineStyle: { color: "source", curveness: 0.3, opacity: 0.5, width: 1.6 },
      emphasis: { focus: "adjacency", lineStyle: { width: 3, opacity: 0.95 } },
      itemStyle: { borderColor: readToken("--card"), borderWidth: 1 },
      data: nos.map((n, i) => ({ ...n, itemStyle: { color: palette[i % palette.length] } })),
      links: ligacoes,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const nos = [
  { name: "Empreender", value: 1240 }, { name: "AGI", value: 980 },
  { name: "Programa Inova", value: 860 }, { name: "Visita Técnica", value: 1420 },
  { name: "Empreender Mais", value: 640 },
].map((n, i) => ({ ...n, itemStyle: { color: palette[i % palette.length] } }));

const ligacoes = [
  { source: "Empreender", target: "AGI", value: 180 },
  { source: "AGI", target: "Programa Inova", value: 210 },
  { source: "Visita Técnica", target: "Empreender", value: 260 },
  { source: "Visita Técnica", target: "Empreender Mais", value: 190 },
];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => "<strong>" + (p as { name: string }).name + "</strong><br/>" + formatarNumero((p as { value: number }).value),
  },
  series: [{
    name: "Encaminhamentos (layout circular)",
    type: "graph",
    layout: "circular",
    circular: { rotateLabel: true },
    roam: false,
    symbolSize: 26,
    label: { show: true, position: "right", color: readToken("--foreground"), fontSize: 11 },
    edgeSymbol: ["none", "arrow"],
    edgeSymbolSize: 7,
    lineStyle: { color: "source", curveness: 0.3, opacity: 0.5, width: 1.6 },
    emphasis: { focus: "adjacency", lineStyle: { width: 3, opacity: 0.95 } },
    data: nos,
    links: ligacoes,
  }],
};

export function EncaminhamentosCircularChart() {
  return (
    <BrandChart
      option={option}
      height={420}
      ariaLabel="Grafo circular com oito programas dispostos em círculo e dez arestas curvas de encaminhamento entre eles, com destaque de vizinhança ao interagir."
    />
  );
}`;

export const grafoCircular: ChartPreset = {
  id: "grafo-circular",
  nome: "Grafo Circular",
  categoria: "relacoes",
  descricao:
    "Mesma rede de encaminhamentos em layout circular com arestas curvas — leitura estável e reprodutível entre renderizações.",
  tags: ["grafo", "circular", "curveness", "rede"],
  option,
  codigoReact,
  quandoUsar: [
    "Quando o layout precisa ser idêntico a cada carregamento (relatórios, PDFs)",
    "Redes pequenas e médias em que interessa quem se conecta com quem",
    "Comparar densidade de conexões entre nós vizinhos",
  ],
  quandoNaoUsar: [
    "Redes grandes: o interior fica saturado de arestas",
    "Quando se busca agrupamento natural — prefira layout de força",
    "Fluxos com etapas sequenciais — prefira sankey",
  ],
  acessibilidade: [
    "rotateLabel mantém rótulos legíveis; confira o contraste em dark mode",
    "Ofereça tabela de arestas com origem, destino e peso",
    "Use foco por vizinhança para permitir leitura por partes",
  ],
  ariaLabel:
    "Grafo circular com oito programas dispostos em círculo e dez arestas curvas de encaminhamento entre eles, com destaque de vizinhança ao interagir.",
  altura: 420,
};

export default grafoCircular;
