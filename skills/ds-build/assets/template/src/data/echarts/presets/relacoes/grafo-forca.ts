import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const nos = [
  { name: "Empreender", value: 1240, symbolSize: 52, itemStyle: { color: palette[0] } },
  { name: "AGI", value: 980, symbolSize: 46, itemStyle: { color: palette[1] } },
  { name: "Programa Inova", value: 860, symbolSize: 42, itemStyle: { color: palette[2] } },
  { name: "Visita Técnica", value: 1420, symbolSize: 56, itemStyle: { color: palette[3] } },
  { name: "Empreender Mais", value: 640, symbolSize: 36, itemStyle: { color: palette[5] } },
  { name: "Consultoria financeira", value: 520, symbolSize: 32, itemStyle: { color: palette[6] } },
  { name: "Feiras e rodadas", value: 470, symbolSize: 30, itemStyle: { color: palette[7] } },
  { name: "Educação empreendedora", value: 410, symbolSize: 28, itemStyle: { color: palette[8] } },
];

export const ligacoes = [
  { source: "Empreender", target: "AGI", value: 180 },
  { source: "Empreender", target: "Consultoria financeira", value: 140 },
  { source: "Empreender", target: "Feiras e rodadas", value: 95 },
  { source: "AGI", target: "Programa Inova", value: 210 },
  { source: "AGI", target: "Consultoria financeira", value: 120 },
  { source: "Programa Inova", target: "Feiras e rodadas", value: 130 },
  { source: "Visita Técnica", target: "Empreender", value: 260 },
  { source: "Visita Técnica", target: "Empreender Mais", value: 190 },
  { source: "Empreender Mais", target: "Educação empreendedora", value: 110 },
  { source: "Educação empreendedora", target: "Empreender", value: 90 },
];

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
      name: "Rede de encaminhamentos",
      type: "graph",
      layout: "force",
      roam: true,
      draggable: true,
      force: { repulsion: 320, gravity: 0.08, edgeLength: [80, 160] },
      label: { show: true, position: "right", color: readToken("--foreground"), fontSize: 11 },
      edgeSymbol: ["none", "arrow"],
      edgeSymbolSize: 7,
      lineStyle: { color: readToken("--muted-foreground"), opacity: 0.45, width: 1.5, curveness: 0.12 },
      emphasis: { focus: "adjacency", lineStyle: { width: 3, opacity: 0.9 } },
      data: nos,
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
  { name: "Empreender", value: 1240, symbolSize: 52, itemStyle: { color: palette[0] } },
  { name: "AGI", value: 980, symbolSize: 46, itemStyle: { color: palette[1] } },
  { name: "Programa Inova", value: 860, symbolSize: 42, itemStyle: { color: palette[2] } },
  { name: "Visita Técnica", value: 1420, symbolSize: 56, itemStyle: { color: palette[3] } },
];

const ligacoes = [
  { source: "Empreender", target: "AGI", value: 180 },
  { source: "AGI", target: "Programa Inova", value: 210 },
  { source: "Visita Técnica", target: "Empreender", value: 260 },
];

const option: EChartsOption = {
  tooltip: { trigger: "item", formatter: (p) => "<strong>" + (p as { name: string }).name + "</strong>" },
  series: [{
    name: "Rede de encaminhamentos",
    type: "graph",
    layout: "force",
    roam: true,
    draggable: true,
    force: { repulsion: 320, gravity: 0.08, edgeLength: [80, 160] },
    label: { show: true, position: "right", color: readToken("--foreground"), fontSize: 11 },
    edgeSymbol: ["none", "arrow"],
    edgeSymbolSize: 7,
    lineStyle: { color: readToken("--muted-foreground"), opacity: 0.45, width: 1.5, curveness: 0.12 },
    emphasis: { focus: "adjacency", lineStyle: { width: 3, opacity: 0.9 } },
    data: nos,
    links: ligacoes,
  }],
};

export function RedeEncaminhamentosChart() {
  return (
    <BrandChart
      option={option}
      height={420}
      ariaLabel="Grafo de força com oito programas e serviços do __BRAND_NAME__ e dez encaminhamentos entre eles. Visita Técnica e Empreender são os nós de maior volume, com 1.420 e 1.240 atendimentos."
    />
  );
}`;

export const grafoForca: ChartPreset = {
  id: "grafo-forca",
  nome: "Grafo de Força",
  categoria: "relacoes",
  descricao:
    "Rede de encaminhamentos entre programas com layout force, nós dimensionados por volume, roam e repulsão ajustada.",
  tags: ["grafo", "rede", "force", "encaminhamentos"],
  option,
  codigoReact,
  quandoUsar: [
    "Explorar conexões e centralidade em uma rede de tamanho moderado",
    "Mostrar agrupamentos naturais que emergem do relacionamento",
    "Quando a topologia é mais relevante que os valores exatos",
  ],
  quandoNaoUsar: [
    "Redes muito densas: use matriz de adjacência ou heatmap",
    "Relatórios estáticos, pois o layout muda a cada renderização",
    "Comparação de magnitude — o tamanho do nó é aproximado",
  ],
  acessibilidade: [
    "Como há roam e arraste, ofereça obrigatoriamente uma tabela de origem, destino e peso das arestas",
    "Rótulos de nó sempre visíveis; não dependa apenas do hover",
    "Descreva no ariaLabel os nós mais centrais e o total de conexões",
  ],
  ariaLabel:
    "Grafo de força com oito programas e serviços do __BRAND_NAME__ e dez encaminhamentos entre eles. Visita Técnica e Empreender são os nós de maior volume, com 1.420 e 1.240 atendimentos.",
  altura: 420,
};

export default grafoForca;
