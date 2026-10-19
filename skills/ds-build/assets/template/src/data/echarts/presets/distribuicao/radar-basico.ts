import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

export const dimensoes = [
  "Gestão financeira",
  "Marketing e vendas",
  "Processos",
  "Inovação",
  "Pessoas",
  "Formalização",
];
export const notas = [72, 64, 58, 45, 68, 86];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: () =>
      dimensoes.map((d, i) => `${d}: ${formatarNumero(notas[i])}`).join("<br/>"),
  },
  radar: {
    center: ["50%", "54%"],
    radius: "66%",
    indicator: dimensoes.map((name) => ({ name, max: 100 })),
    axisName: { color: readToken("--muted-foreground"), fontSize: 11 },
    splitLine: { lineStyle: { color: readToken("--border") } },
    axisLine: { lineStyle: { color: readToken("--border") } },
    splitArea: { areaStyle: { color: [readToken("--primary", 0.04), "transparent"] } },
  },
  series: [
    {
      name: "Maturidade do negócio",
      type: "radar",
      symbolSize: 6,
      lineStyle: { width: 2, color: readToken("--primary") },
      itemStyle: { color: readToken("--primary") },
      areaStyle: { color: readToken("--primary", 0.2) },
      emphasis: { focus: "series" },
      label: { show: true, fontSize: 10, color: readToken("--foreground"), formatter: (p) => formatarNumero(p.value as number) },
      data: [{ value: notas, name: "Índice de maturidade" }],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const dimensoes = ["Gestão financeira", "Marketing e vendas", "Processos", "Inovação", "Pessoas", "Formalização"];
const notas = [72, 64, 58, 45, 68, 86];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  radar: {
    radius: "66%",
    indicator: dimensoes.map((name) => ({ name, max: 100 })),
    axisName: { color: readToken("--muted-foreground"), fontSize: 11 },
    splitLine: { lineStyle: { color: readToken("--border") } },
  },
  series: [{
    name: "Maturidade do negócio",
    type: "radar",
    lineStyle: { width: 2, color: readToken("--primary") },
    itemStyle: { color: readToken("--primary") },
    areaStyle: { color: readToken("--primary", 0.2) },
    label: { show: true, formatter: (p) => formatarNumero(p.value as number) },
    data: [{ value: notas, name: "Índice de maturidade" }],
  }],
};

export function MaturidadeRadarChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Radar de seis dimensões de maturidade do negócio, de 0 a 100."
    />
  );
}`;

export const radarBasico: ChartPreset = {
  id: "radar-basico",
  nome: "Radar Básico",
  categoria: "distribuicao",
  descricao:
    "Radar com seis eixos avaliando dimensões de maturidade do negócio em escala de 0 a 100, uma única série.",
  tags: ["radar", "maturidade", "diagnóstico", "multidimensional"],
  option,
  codigoReact,
  quandoUsar: [
    "Diagnósticos multidimensionais com escala comum",
    "Perfil de maturidade de uma empresa atendida",
    "Entre 4 e 8 dimensões",
  ],
  quandoNaoUsar: [
    "Eixos com unidades ou escalas diferentes sem normalização",
    "Mais de 8 dimensões: o polígono fica ilegível",
    "Quando a ordem dos eixos importa como sequência temporal",
  ],
  acessibilidade: [
    "Rótulo numérico em cada vértice do polígono",
    "Nome de cada eixo escrito por extenso",
    "Área preenchida com opacidade que preserva as linhas de grade",
  ],
  ariaLabel:
    "Radar de maturidade do negócio em seis dimensões, escala de 0 a 100: Formalização 86, Gestão financeira 72, Pessoas 68, Marketing e vendas 64, Processos 58 e Inovação 45, o ponto mais frágil.",
  altura: 360,
};

export default radarBasico;
