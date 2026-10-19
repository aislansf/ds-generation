import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken, BRAND_SCALE_SEQUENCIAL } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

export const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export const programas = ["Empreender", "AGI", "Programa Inova", "Visita Técnica", "Empreender Mais"];

/** Matriz programa x mês (valores fictícios de atendimentos). */
const matriz: number[][] = [
  [42, 48, 55, 61, 70, 66, 78, 84, 80, 92, 101, 58],
  [64, 70, 82, 88, 95, 104, 99, 112, 108, 120, 131, 76],
  [30, 36, 41, 38, 52, 60, 66, 71, 68, 74, 82, 46],
  [120, 128, 118, 140, 152, 146, 164, 175, 168, 182, 196, 128],
  [22, 26, 31, 29, 36, 42, 48, 52, 49, 58, 64, 38],
];

/** [x = mês, y = programa, valor] */
export const dados: [number, number, number][] = matriz.flatMap((linha, y) =>
  linha.map((v, x) => [x, y, v] as [number, number, number]),
);

const maximo = Math.max(...matriz.flat());

export const option: EChartsOption = {
  tooltip: {
    position: "top",
    formatter: (p) => {
      const v = (p as { value: [number, number, number] }).value;
      return `<strong>${programas[v[1]]}</strong><br/>${meses[v[0]]}: ${formatarNumero(v[2])} atendimentos`;
    },
  },
  grid: { left: 8, right: 16, top: 16, bottom: 64, containLabel: true },
  xAxis: { type: "category", data: meses, splitArea: { show: true }, axisLabel: { fontSize: 11 } },
  yAxis: { type: "category", data: programas, splitArea: { show: true }, axisLabel: { fontSize: 11 } },
  visualMap: {
    min: 0,
    max: maximo,
    calculable: true,
    orient: "horizontal",
    left: "center",
    bottom: 8,
    itemWidth: 12,
    itemHeight: 100,
    textStyle: { color: readToken("--muted-foreground"), fontSize: 11 },
    inRange: { color: BRAND_SCALE_SEQUENCIAL },
    formatter: (v) => formatarNumero(v as number),
  },
  series: [
    {
      name: "Atendimentos por programa e mês",
      type: "heatmap",
      data: dados,
      label: { show: true, fontSize: 9, color: readToken("--foreground"), formatter: (p) => formatarNumero((p.value as number[])[2]) },
      itemStyle: { borderColor: readToken("--card"), borderWidth: 1 },
      emphasis: { itemStyle: { borderColor: readToken("--foreground"), borderWidth: 1.5 } },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken, BRAND_SCALE_SEQUENCIAL } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
const programas = ["Empreender", "AGI", "Programa Inova"];
const matriz = [[42, 48, 55, 61, 70, 66], [64, 70, 82, 88, 95, 104], [30, 36, 41, 38, 52, 60]];
const dados = matriz.flatMap((linha, y) => linha.map((v, x) => [x, y, v]));

const option: EChartsOption = {
  tooltip: { position: "top" },
  xAxis: { type: "category", data: meses, splitArea: { show: true } },
  yAxis: { type: "category", data: programas, splitArea: { show: true } },
  visualMap: {
    min: 0, max: 110, calculable: true, orient: "horizontal", left: "center", bottom: 8,
    inRange: { color: BRAND_SCALE_SEQUENCIAL },
  },
  series: [{
    name: "Atendimentos por programa e mês",
    type: "heatmap",
    data: dados,
    label: { show: true, formatter: (p) => formatarNumero((p.value as number[])[2]) },
    itemStyle: { borderColor: readToken("--card"), borderWidth: 1 },
  }],
};

export function MatrizAnualChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Matriz de calor de atendimentos por programa e mês, com escala sequencial contínua."
    />
  );
}`;

export const heatmapMatrizAnual: ChartPreset = {
  id: "heatmap-matriz-anual",
  nome: "Matriz Anual de Calor",
  categoria: "distribuicao",
  descricao:
    "Heatmap matricial programa x mês com visualMap contínuo baseado em BRAND_SCALE_SEQUENCIAL e rótulo de valor em cada célula. Substitui o tipo matrix do ECharts 6, indisponível na versão 5.",
  tags: ["heatmap", "matriz", "visualMap", "escala sequencial"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar duas dimensões categóricas com uma medida",
    "Identificar sazonalidade por programa ao longo do ano",
    "Matrizes de até cerca de 15 x 15 células",
  ],
  quandoNaoUsar: [
    "Leitura de valores exatos em matrizes grandes sem rótulo",
    "Uma única dimensão categórica — prefira barras",
    "Séries com valores negativos: use a escala divergente",
  ],
  acessibilidade: [
    "Valor escrito em cada célula: a cor é reforço, não canal único",
    "visualMap com rótulos numéricos formatados em pt-BR",
    "Escala derivada do token primary, funcional em light e dark",
  ],
  ariaLabel:
    "Matriz de calor de atendimentos por programa e mês em 2025. Visita Técnica concentra os valores mais altos, com pico de 196 em novembro; dezembro é o mês mais fraco em todos os cinco programas.",
  altura: 360,
};

export default heatmapMatrizAnual;
