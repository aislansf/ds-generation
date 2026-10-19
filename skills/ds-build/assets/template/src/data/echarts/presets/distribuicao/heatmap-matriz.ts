import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

export const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export const programas = ["Empreender", "AGI", "Programa Inova", "Visita Técnica", "Empreender Mais"];

const matriz: number[][] = [
  [120, 132, 128, 145, 160, 158, 172, 180, 168, 190, 205, 150],
  [96, 104, 118, 126, 140, 152, 148, 160, 155, 170, 182, 130],
  [64, 72, 80, 76, 94, 108, 112, 120, 118, 126, 138, 100],
  [180, 190, 176, 205, 220, 214, 232, 245, 238, 250, 268, 195],
  [48, 52, 60, 58, 66, 72, 78, 84, 80, 90, 98, 70],
];

/** [x = mês, y = programa, valor] */
export const dados: number[][] = matriz.flatMap((linha, p) =>
  linha.map((valor, m) => [m, p, valor]),
);

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: number[] }).value;
      return `${programas[v[1]]} — ${meses[v[0]]}<br/><strong>${formatarNumero(v[2])}</strong> atendimentos`;
    },
  },
  grid: { left: 8, right: 16, top: 56, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: meses, splitArea: { show: true } },
  yAxis: { type: "category", data: programas, splitArea: { show: true } },
  visualMap: {
    type: "continuous",
    min: 48,
    max: 268,
    calculable: true,
    orient: "horizontal",
    left: "center",
    top: 0,
    itemWidth: 12,
    itemHeight: 140,
    text: ["Maior volume", "Menor volume"],
    textStyle: { color: readToken("--muted-foreground"), fontSize: 11 },
    inRange: {
      color: [readToken("--primary", 0.12), readToken("--primary", 0.5), readToken("--primary"), readToken("--brand-comp-indigo")],
    },
  },
  series: [
    {
      name: "Atendimentos por programa e mês",
      type: "heatmap",
      data: dados,
      label: { show: true, fontSize: 10, formatter: (p) => formatarNumero((p.value as number[])[2]) },
      itemStyle: { borderColor: readToken("--card"), borderWidth: 1 },
      emphasis: { itemStyle: { borderColor: readToken("--foreground"), borderWidth: 1 } },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const programas = ["Empreender", "AGI", "Programa Inova", "Visita Técnica", "Empreender Mais"];
const matriz = [
  [120, 132, 128, 145, 160, 158, 172, 180, 168, 190, 205, 150],
  [96, 104, 118, 126, 140, 152, 148, 160, 155, 170, 182, 130],
  [64, 72, 80, 76, 94, 108, 112, 120, 118, 126, 138, 100],
  [180, 190, 176, 205, 220, 214, 232, 245, 238, 250, 268, 195],
  [48, 52, 60, 58, 66, 72, 78, 84, 80, 90, 98, 70],
];
const dados = matriz.flatMap((linha, p) => linha.map((valor, m) => [m, p, valor]));

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: number[] }).value;
      return programas[v[1]] + " — " + meses[v[0]] + "<br/><strong>" + formatarNumero(v[2]) + "</strong> atendimentos";
    },
  },
  grid: { left: 8, right: 16, top: 56, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: meses, splitArea: { show: true } },
  yAxis: { type: "category", data: programas, splitArea: { show: true } },
  visualMap: {
    type: "continuous", min: 48, max: 268, calculable: true,
    orient: "horizontal", left: "center", top: 0, itemWidth: 12, itemHeight: 140,
    text: ["Maior volume", "Menor volume"],
    inRange: { color: [readToken("--primary", 0.12), readToken("--primary", 0.5), readToken("--primary"), readToken("--brand-comp-indigo")] },
  },
  series: [{
    name: "Atendimentos por programa e mês",
    type: "heatmap",
    data: dados,
    label: { show: true, fontSize: 10, formatter: (p) => formatarNumero((p.value as number[])[2]) },
    itemStyle: { borderColor: readToken("--card"), borderWidth: 1 },
  }],
};

export function MatrizAtendimentosChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Matriz de calor de atendimentos por programa e mês. Visita Técnica lidera todos os meses, com pico de 268 em novembro; Empreender Mais tem o menor volume, entre 48 e 98."
    />
  );
}`;

export const heatmapMatriz: ChartPreset = {
  id: "heatmap-matriz",
  nome: "Matriz de Calor",
  categoria: "distribuicao",
  descricao:
    "Matriz programa x mês com escala contínua de cor derivada dos tokens e rótulo de valor em cada célula.",
  tags: ["heatmap", "matriz", "programas", "visualMap"],
  option,
  codigoReact,
  quandoUsar: [
    "Cruzar duas dimensões categóricas com uma métrica",
    "Encontrar padrões e concentrações em tabelas grandes",
    "Substituir tabelas densas por leitura visual rápida",
  ],
  quandoNaoUsar: [
    "Comparação precisa de valores próximos entre células distantes",
    "Poucas células (menos de ~15): use barras agrupadas",
    "Séries com valores negativos e positivos sem escala divergente",
  ],
  acessibilidade: [
    "Mantenha o rótulo numérico visível: a cor não deve ser o único canal",
    "Escala contínua sempre a partir de tokens do DS",
    "Ofereça a matriz também em tabela HTML semântica",
  ],
  ariaLabel:
    "Matriz de calor de atendimentos por programa e mês. Visita Técnica lidera todos os meses, com pico de 268 em novembro; Empreender Mais tem o menor volume, entre 48 e 98.",
  altura: 340,
};

export default heatmapMatriz;
