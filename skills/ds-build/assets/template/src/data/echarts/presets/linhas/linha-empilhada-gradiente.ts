import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const series: { nome: string; dados: number[] }[] = [
  { nome: "Empreender", dados: [120, 132, 128, 145, 160, 158, 172, 180, 168, 190, 205, 150] },
  { nome: "AGI", dados: [96, 104, 118, 126, 140, 152, 148, 160, 155, 170, 182, 130] },
  { nome: "Programa Inova", dados: [64, 72, 80, 76, 94, 108, 112, 120, 118, 126, 138, 100] },
  { nome: "Visita Técnica", dados: [180, 190, 176, 205, 220, 214, 232, 245, 238, 250, 268, 195] },
];

const gradiente = (cor: string, corSuave: string) => ({
  type: "linear" as const,
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: cor },
    { offset: 1, color: corSuave },
  ],
});

export const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 48, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: meses },
  yAxis: { type: "value", name: "Atendimentos" },
  series: series.map((s, i) => ({
    name: s.nome,
    type: "line",
    stack: "total",
    smooth: true,
    symbol: "circle",
    symbolSize: 6,
    lineStyle: { width: 2, color: palette[i] },
    itemStyle: { color: palette[i] },
    areaStyle: {
      opacity: 0.9,
      color: gradiente(palette[i], palette[i].replace("rgb(", "rgba(").replace(")", ", 0.05)")),
    },
    emphasis: { focus: "series" },
    data: s.dados,
  })),
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
const series = [
  { nome: "Empreender", dados: [120, 132, 128, 145, 160, 158] },
  { nome: "AGI", dados: [96, 104, 118, 126, 140, 152] },
  { nome: "Programa Inova", dados: [64, 72, 80, 76, 94, 108] },
];

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  xAxis: { type: "category", boundaryGap: false, data: meses },
  yAxis: { type: "value", name: "Atendimentos" },
  series: series.map((s, i) => ({
    name: s.nome,
    type: "line",
    stack: "total",
    smooth: true,
    lineStyle: { width: 2, color: palette[i] },
    itemStyle: { color: palette[i] },
    areaStyle: {
      opacity: 0.9,
      color: {
        type: "linear", x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: palette[i] },
          { offset: 1, color: palette[i].replace("rgb(", "rgba(").replace(")", ", 0.05)") },
        ],
      },
    },
    data: s.dados,
  })),
};

export function AtendimentosGradienteChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Áreas empilhadas com gradiente da evolução mensal de atendimentos por programa em 2025."
    />
  );
}`;

export const linhaEmpilhadaGradiente: ChartPreset = {
  id: "linha-empilhada-gradiente",
  nome: "Áreas Empilhadas com Gradiente",
  categoria: "linhas",
  descricao:
    "Áreas empilhadas com gradiente vertical por série e tooltip por eixo, para evolução da composição de atendimentos.",
  tags: ["área", "empilhado", "gradiente", "evolução"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar evolução do total e da composição ao mesmo tempo",
    "Painéis executivos em que o gradiente reforça hierarquia visual",
    "Séries positivas e contínuas ao longo de 12 meses",
  ],
  quandoNaoUsar: [
    "Comparar séries individualmente — prefira linhas múltiplas",
    "Séries com valores negativos ou nulos",
    "Mais de seis séries: o empilhamento fica ilegível",
  ],
  acessibilidade: [
    "Legenda sempre visível: o gradiente não é canal único de informação",
    "Tooltip por eixo lista todas as séries do mês com formatação pt-BR",
    "Cores derivadas de tokens, com contraste verificado em light e dark",
  ],
  ariaLabel:
    "Áreas empilhadas com gradiente da evolução mensal de atendimentos por programa em 2025. Visita Técnica é a maior faixa em todos os meses, com pico em novembro e queda geral em dezembro.",
  altura: 340,
};

export default linhaEmpilhadaGradiente;
