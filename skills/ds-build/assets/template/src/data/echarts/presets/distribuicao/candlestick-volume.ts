import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

export const semanas = Array.from({ length: 26 }, (_, i) => `S${i + 1}`);

/** [abertura, fechamento, mínima, máxima] */
export const ohlc: [number, number, number, number][] = [
  [180, 196, 172, 204], [196, 188, 180, 210], [188, 210, 184, 216], [210, 224, 202, 232],
  [224, 218, 208, 236], [218, 232, 210, 240], [232, 246, 224, 254], [246, 238, 230, 258],
  [238, 254, 232, 262], [254, 268, 246, 276], [268, 262, 252, 280], [262, 276, 256, 286],
  [276, 290, 268, 298], [290, 284, 274, 302], [284, 298, 278, 306], [298, 312, 290, 320],
  [312, 306, 296, 324], [306, 322, 300, 330], [322, 336, 314, 344], [336, 330, 320, 348],
  [330, 346, 324, 354], [346, 360, 338, 368], [360, 354, 344, 372], [354, 370, 348, 378],
  [370, 384, 362, 392], [384, 378, 368, 396],
];

/** Volume de empresas distintas atendidas na semana. */
export const volume = [
  120, 96, 132, 148, 104, 140, 162, 110, 158, 176, 118, 170, 188, 124, 182,
  198, 130, 192, 210, 138, 202, 220, 146, 212, 232, 150,
];

export const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
  legend: { top: 0, left: "left", data: ["Atendimentos semanais", "Empresas distintas"] },
  axisPointer: { link: [{ xAxisIndex: "all" }] },
  grid: [
    { left: 8, right: 16, top: 48, height: "52%", containLabel: true },
    { left: 8, right: 16, top: "72%", height: "16%", containLabel: true },
  ],
  xAxis: [
    { type: "category", gridIndex: 0, data: semanas, axisLabel: { show: false } },
    { type: "category", gridIndex: 1, data: semanas, axisLabel: { fontSize: 10 } },
  ],
  yAxis: [
    { type: "value", gridIndex: 0, name: "Atendimentos", scale: true },
    { type: "value", gridIndex: 1, name: "Empresas", splitLine: { show: false } },
  ],
  dataZoom: [
    { type: "inside", xAxisIndex: [0, 1], start: 20, end: 100 },
    { type: "slider", xAxisIndex: [0, 1], start: 20, end: 100, bottom: 4, height: 18 },
  ],
  series: [
    {
      name: "Atendimentos semanais",
      type: "candlestick",
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: ohlc,
      itemStyle: {
        color: readToken("--success"),
        color0: readToken("--error"),
        borderColor: readToken("--success"),
        borderColor0: readToken("--error"),
      },
      emphasis: { focus: "series" },
    },
    {
      name: "Empresas distintas",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: volume.map((v, i) => ({
        value: v,
        itemStyle: { color: ohlc[i][1] >= ohlc[i][0] ? readToken("--success", 0.6) : readToken("--error", 0.6) },
      })),
      emphasis: { focus: "series" },
      tooltip: { valueFormatter: (v) => formatarNumero(v as number) },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";

const semanas = ["S1", "S2", "S3", "S4", "S5", "S6"];
const ohlc = [[180, 196, 172, 204], [196, 188, 180, 210], [188, 210, 184, 216], [210, 224, 202, 232], [224, 218, 208, 236], [218, 232, 210, 240]];
const volume = [120, 96, 132, 148, 104, 140];

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
  legend: { top: 0, left: "left" },
  axisPointer: { link: [{ xAxisIndex: "all" }] },
  grid: [
    { left: 8, right: 16, top: 48, height: "52%", containLabel: true },
    { left: 8, right: 16, top: "72%", height: "16%", containLabel: true },
  ],
  xAxis: [
    { type: "category", gridIndex: 0, data: semanas, axisLabel: { show: false } },
    { type: "category", gridIndex: 1, data: semanas },
  ],
  yAxis: [
    { type: "value", gridIndex: 0, name: "Atendimentos", scale: true },
    { type: "value", gridIndex: 1, name: "Empresas", splitLine: { show: false } },
  ],
  dataZoom: [
    { type: "inside", xAxisIndex: [0, 1], start: 20, end: 100 },
    { type: "slider", xAxisIndex: [0, 1], start: 20, end: 100, bottom: 4, height: 18 },
  ],
  series: [
    {
      name: "Atendimentos semanais", type: "candlestick", xAxisIndex: 0, yAxisIndex: 0, data: ohlc,
      itemStyle: {
        color: readToken("--success"), color0: readToken("--error"),
        borderColor: readToken("--success"), borderColor0: readToken("--error"),
      },
    },
    {
      name: "Empresas distintas", type: "bar", xAxisIndex: 1, yAxisIndex: 1,
      data: volume.map((v, i) => ({
        value: v,
        itemStyle: { color: ohlc[i][1] >= ohlc[i][0] ? readToken("--success", 0.6) : readToken("--error", 0.6) },
      })),
    },
  ],
};

export function AtendimentosCandleVolumeChart() {
  return (
    <BrandChart
      option={option}
      height={420}
      ariaLabel="Candlestick semanal de atendimentos com gráfico de volume de empresas distintas em grid inferior sincronizado."
    />
  );
}`;

export const candlestickVolume: ChartPreset = {
  id: "candlestick-volume",
  nome: "Candlestick com Volume",
  categoria: "distribuicao",
  descricao:
    "Candlestick semanal no grid superior e volume de empresas distintas no grid inferior, sincronizados por dataZoom e axisPointer.",
  tags: ["candlestick", "volume", "dois grids", "dataZoom"],
  option,
  codigoReact,
  quandoUsar: [
    "Analisar variação e volume no mesmo recorte temporal",
    "Painéis analíticos com necessidade de zoom sincronizado",
    "Séries longas com dezenas de períodos",
  ],
  quandoNaoUsar: [
    "Espaço vertical reduzido: dois grids exigem altura",
    "Quando o volume não tem relação interpretativa com a série principal",
    "Poucos períodos",
  ],
  acessibilidade: [
    "axisPointer com link entre os dois grids evita leitura cruzada errada",
    "Barras de volume herdam a cor de alta ou baixa da semana correspondente",
    "dataZoom com slider operável por teclado",
  ],
  ariaLabel:
    "Candlestick semanal de atendimentos em 26 semanas com volume de empresas distintas no grid inferior. A tendência é de alta, de 180 para 384 atendimentos, com volume oscilando entre 96 e 232 empresas.",
  altura: 420,
};

export default candlestickVolume;
