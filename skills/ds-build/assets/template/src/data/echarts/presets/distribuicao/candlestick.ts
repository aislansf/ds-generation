import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const semanas = [
  "Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8",
  "Sem 9", "Sem 10", "Sem 11", "Sem 12", "Sem 13", "Sem 14", "Sem 15", "Sem 16",
  "Sem 17", "Sem 18", "Sem 19", "Sem 20", "Sem 21", "Sem 22", "Sem 23", "Sem 24",
];

/** [abertura, fechamento, mínimo, máximo] do índice semanal de atendimentos diários */
export const velas: number[][] = [
  [58, 64, 52, 70], [64, 61, 55, 72], [61, 68, 58, 76], [68, 74, 63, 80],
  [74, 71, 66, 82], [71, 78, 68, 86], [78, 84, 72, 90], [84, 80, 74, 92],
  [80, 88, 76, 96], [88, 92, 82, 101], [92, 87, 80, 98], [87, 95, 83, 104],
  [95, 101, 88, 110], [101, 97, 90, 108], [97, 105, 92, 114], [105, 112, 98, 120],
  [112, 108, 100, 118], [108, 116, 102, 124], [116, 122, 108, 130], [122, 118, 110, 128],
  [118, 126, 112, 134], [126, 132, 118, 140], [132, 128, 120, 138], [128, 137, 122, 145],
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
    formatter: (params) => {
      const p = (params as { name: string; value: number[] }[])[0];
      const v = p.value;
      return `<strong>${p.name}</strong><br/>Abertura: ${formatarNumero(v[1])}<br/>Fechamento: ${formatarNumero(v[2])}<br/>Mínimo: ${formatarNumero(v[3])}<br/>Máximo: ${formatarNumero(v[4])}`;
    },
  },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 32, bottom: 56, containLabel: true },
  xAxis: { type: "category", data: semanas, axisLabel: { rotate: 30, fontSize: 10 } },
  yAxis: { type: "value", name: "Atendimentos/dia", scale: true },
  dataZoom: [
    { type: "inside", start: 40, end: 100 },
    { type: "slider", start: 40, end: 100, height: 20, bottom: 8 },
  ],
  series: [
    {
      name: "Índice semanal",
      type: "candlestick",
      data: velas,
      itemStyle: {
        color: palette[2],
        color0: palette[4],
        borderColor: palette[2],
        borderColor0: palette[4],
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const semanas = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
// [abertura, fechamento, mínimo, máximo]
const velas = [[58, 64, 52, 70], [64, 61, 55, 72], [61, 68, 58, 76], [68, 74, 63, 80], [74, 71, 66, 82], [71, 78, 68, 86]];

const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
    formatter: (params) => {
      const p = (params as { name: string; value: number[] }[])[0];
      const v = p.value;
      return "<strong>" + p.name + "</strong><br/>Abertura: " + formatarNumero(v[1]) +
        "<br/>Fechamento: " + formatarNumero(v[2]) + "<br/>Mínimo: " + formatarNumero(v[3]) +
        "<br/>Máximo: " + formatarNumero(v[4]);
    },
  },
  grid: { left: 8, right: 16, top: 32, bottom: 56, containLabel: true },
  xAxis: { type: "category", data: semanas, axisLabel: { rotate: 30, fontSize: 10 } },
  yAxis: { type: "value", name: "Atendimentos/dia", scale: true },
  dataZoom: [{ type: "inside", start: 40, end: 100 }, { type: "slider", start: 40, end: 100, height: 20, bottom: 8 }],
  series: [{
    name: "Índice semanal",
    type: "candlestick",
    data: velas,
    itemStyle: { color: palette[2], color0: palette[4], borderColor: palette[2], borderColor0: palette[4] },
  }],
};

export function IndiceSemanalCandlestickChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Gráfico de velas do índice semanal de atendimentos diários em 24 semanas, com abertura, fechamento, mínimo e máximo. A tendência é de alta, de 58 na primeira semana para 137 na vigésima quarta."
    />
  );
}`;

export const candlestick: ChartPreset = {
  id: "candlestick",
  nome: "Velas (faixa mín-máx)",
  categoria: "distribuicao",
  descricao:
    "Série temporal com abertura, fechamento, mínimo e máximo por semana — útil para indicadores que variam dentro do período. Inclui dataZoom.",
  tags: ["candlestick", "velas", "faixa", "variação", "dataZoom"],
  option,
  codigoReact,
  quandoUsar: [
    "Indicadores que têm valor inicial, final e faixa de oscilação no período",
    "Monitorar volatilidade de uma métrica operacional semana a semana",
    "Quando o intervalo mínimo-máximo é tão importante quanto o resultado",
  ],
  quandoNaoUsar: [
    "Métricas com um único valor por período — prefira linha ou barras",
    "Públicos não familiarizados com a leitura de velas, sem legenda",
    "Comparação entre categorias",
  ],
  acessibilidade: [
    "A cor de alta e baixa vem dos tokens de sucesso e erro; explique em legenda textual",
    "Tooltip nomeia as quatro estatísticas por extenso",
    "Com dataZoom ativo, ofereça também a série completa em tabela navegável por teclado",
  ],
  ariaLabel:
    "Gráfico de velas do índice semanal de atendimentos diários em 24 semanas, com abertura, fechamento, mínimo e máximo. A tendência é de alta, de 58 na primeira semana para 137 na vigésima quarta.",
  altura: 380,
};

export default candlestick;
