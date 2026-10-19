import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const nos = [
  { name: "Portal __BRAND_SHORT__", itemStyle: { color: palette[0] } },
  { name: "0800 / WhatsApp", itemStyle: { color: palette[1] } },
  { name: "Agência regional", itemStyle: { color: palette[5] } },
  { name: "Empreender", itemStyle: { color: palette[6] } },
  { name: "AGI", itemStyle: { color: palette[2] } },
  { name: "Programa Inova", itemStyle: { color: palette[3] } },
  { name: "Visita Técnica", itemStyle: { color: palette[9] } },
  { name: "Negócio formalizado", itemStyle: { color: palette[2] } },
  { name: "Em acompanhamento", itemStyle: { color: palette[3] } },
  { name: "Desistência", itemStyle: { color: palette[4] } },
];

export const ligacoes = [
  { source: "Portal __BRAND_SHORT__", target: "Empreender", value: 620 },
  { source: "Portal __BRAND_SHORT__", target: "Programa Inova", value: 480 },
  { source: "Portal __BRAND_SHORT__", target: "AGI", value: 320 },
  { source: "0800 / WhatsApp", target: "Empreender", value: 260 },
  { source: "0800 / WhatsApp", target: "Visita Técnica", value: 540 },
  { source: "Agência regional", target: "AGI", value: 410 },
  { source: "Agência regional", target: "Visita Técnica", value: 380 },
  { source: "Agência regional", target: "Programa Inova", value: 190 },
  { source: "Empreender", target: "Negócio formalizado", value: 520 },
  { source: "Empreender", target: "Em acompanhamento", value: 280 },
  { source: "Empreender", target: "Desistência", value: 80 },
  { source: "AGI", target: "Negócio formalizado", value: 380 },
  { source: "AGI", target: "Em acompanhamento", value: 290 },
  { source: "AGI", target: "Desistência", value: 60 },
  { source: "Programa Inova", target: "Negócio formalizado", value: 410 },
  { source: "Programa Inova", target: "Em acompanhamento", value: 210 },
  { source: "Programa Inova", target: "Desistência", value: 50 },
  { source: "Visita Técnica", target: "Negócio formalizado", value: 540 },
  { source: "Visita Técnica", target: "Em acompanhamento", value: 300 },
  { source: "Visita Técnica", target: "Desistência", value: 80 },
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { dataType: string; name: string; value: number; data: { source?: string; target?: string } };
      if (params.dataType === "edge") {
        return `${params.data.source} → ${params.data.target}<br/><strong>${formatarNumero(params.value)}</strong> empreendedores`;
      }
      return `<strong>${params.name}</strong><br/>${formatarNumero(params.value)} empreendedores`;
    },
  },
  legend: { show: false },
  series: [
    {
      name: "Jornada do empreendedor",
      type: "sankey",
      left: 8,
      right: 130,
      top: 16,
      bottom: 16,
      nodeGap: 12,
      nodeWidth: 14,
      draggable: false,
      emphasis: { focus: "adjacency" },
      label: { color: readToken("--foreground"), fontSize: 11 },
      lineStyle: { color: "gradient", opacity: 0.35, curveness: 0.5 },
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
  { name: "Portal __BRAND_SHORT__", itemStyle: { color: palette[0] } },
  { name: "0800 / WhatsApp", itemStyle: { color: palette[1] } },
  { name: "Agência regional", itemStyle: { color: palette[5] } },
  { name: "Empreender", itemStyle: { color: palette[6] } },
  { name: "AGI", itemStyle: { color: palette[2] } },
  { name: "Negócio formalizado", itemStyle: { color: palette[2] } },
  { name: "Desistência", itemStyle: { color: palette[4] } },
];

const ligacoes = [
  { source: "Portal __BRAND_SHORT__", target: "Empreender", value: 620 },
  { source: "0800 / WhatsApp", target: "Empreender", value: 260 },
  { source: "Agência regional", target: "AGI", value: 410 },
  { source: "Empreender", target: "Negócio formalizado", value: 520 },
  { source: "Empreender", target: "Desistência", value: 80 },
  { source: "AGI", target: "Negócio formalizado", value: 380 },
  { source: "AGI", target: "Desistência", value: 60 },
];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { dataType: string; name: string; value: number; data: { source?: string; target?: string } };
      if (params.dataType === "edge") {
        return params.data.source + " → " + params.data.target + "<br/><strong>" + formatarNumero(params.value) + "</strong> empreendedores";
      }
      return "<strong>" + params.name + "</strong><br/>" + formatarNumero(params.value) + " empreendedores";
    },
  },
  series: [{
    name: "Jornada do empreendedor",
    type: "sankey",
    left: 8, right: 130, top: 16, bottom: 16,
    nodeGap: 12, nodeWidth: 14, draggable: false,
    emphasis: { focus: "adjacency" },
    label: { color: readToken("--foreground"), fontSize: 11 },
    lineStyle: { color: "gradient", opacity: 0.35, curveness: 0.5 },
    data: nos,
    links: ligacoes,
  }],
};

export function JornadaSankeyChart() {
  return (
    <BrandChart
      option={option}
      height={440}
      ariaLabel="Diagrama de Sankey da jornada do empreendedor: canais de entrada Portal, 0800 e agências regionais distribuem 3.200 empreendedores entre quatro programas, resultando em 1.850 negócios formalizados, 1.080 em acompanhamento e 270 desistências."
    />
  );
}`;

export const sankey: ChartPreset = {
  id: "sankey",
  nome: "Sankey de Fluxo",
  categoria: "relacoes",
  descricao:
    "Fluxo do empreendedor entre canais de entrada, programas e desfechos, com espessura proporcional ao volume.",
  tags: ["sankey", "fluxo", "jornada", "conversão"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar como um volume se distribui entre etapas encadeadas",
    "Explicar origem e destino de atendimentos, verbas ou processos",
    "Quando as perdas e desvios entre etapas são a informação principal",
  ],
  quandoNaoUsar: [
    "Muitos nós e ligações (o diagrama vira emaranhado) — agrupe categorias",
    "Fluxos com ciclos, que o sankey não representa",
    "Comparação precisa de valores — prefira barras",
  ],
  acessibilidade: [
    "Use emphasis focus adjacency para isolar o caminho ao interagir",
    "Tooltip deve nomear origem, destino e volume formatado",
    "Ofereça tabela origem-destino-volume equivalente",
  ],
  ariaLabel:
    "Diagrama de Sankey da jornada do empreendedor: canais de entrada Portal, 0800 e agências regionais distribuem 3.200 empreendedores entre quatro programas, resultando em 1.850 negócios formalizados, 1.080 em acompanhamento e 270 desistências.",
  altura: 440,
};

export default sankey;
