import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const semanas = Array.from({ length: 26 }, (_, i) => `S${i + 1}`);

/** [abertura, fechamento, mínima, máxima] de atendimentos semanais. */
export const ohlc: [number, number, number, number][] = [
  [180, 196, 172, 204], [196, 188, 180, 210], [188, 210, 184, 216], [210, 224, 202, 232],
  [224, 218, 208, 236], [218, 232, 210, 240], [232, 246, 224, 254], [246, 238, 230, 258],
  [238, 254, 232, 262], [254, 268, 246, 276], [268, 262, 252, 280], [262, 276, 256, 286],
  [276, 290, 268, 298], [290, 284, 274, 302], [284, 298, 278, 306], [298, 312, 290, 320],
  [312, 306, 296, 324], [306, 322, 300, 330], [322, 336, 314, 344], [336, 330, 320, 348],
  [330, 346, 324, 354], [346, 360, 338, 368], [360, 354, 344, 372], [354, 370, 348, 378],
  [370, 384, 362, 392], [384, 378, 368, 396],
];

/** Média móvel simples sobre o fechamento. */
function mediaMovel(janela: number): (number | "-")[] {
  return ohlc.map((_, i) => {
    if (i < janela - 1) return "-";
    const soma = ohlc.slice(i - janela + 1, i + 1).reduce((s, d) => s + d[1], 0);
    return Math.round((soma / janela) * 10) / 10;
  });
}

export const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
  legend: { top: 0, left: "left", data: ["Atendimentos semanais", "MM 5", "MM 10"] },
  grid: { left: 8, right: 16, top: 48, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: semanas, axisLabel: { fontSize: 10 } },
  yAxis: { type: "value", name: "Atendimentos", scale: true },
  series: [
    {
      name: "Atendimentos semanais",
      type: "candlestick",
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
      name: "MM 5",
      type: "line",
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: palette[0] },
      itemStyle: { color: palette[0] },
      emphasis: { focus: "series" },
      data: mediaMovel(5),
    },
    {
      name: "MM 10",
      type: "line",
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: palette[3], type: "dashed" },
      itemStyle: { color: palette[3] },
      emphasis: { focus: "series" },
      data: mediaMovel(10),
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();
const semanas = ["S1", "S2", "S3", "S4", "S5", "S6"];
const ohlc = [[180, 196, 172, 204], [196, 188, 180, 210], [188, 210, 184, 216], [210, 224, 202, 232], [224, 218, 208, 236], [218, 232, 210, 240]];

const mediaMovel = (janela: number) => ohlc.map((_, i) =>
  i < janela - 1 ? "-" : Math.round(ohlc.slice(i - janela + 1, i + 1).reduce((s, d) => s + d[1], 0) / janela));

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
  legend: { top: 0, left: "left" },
  xAxis: { type: "category", data: semanas },
  yAxis: { type: "value", name: "Atendimentos", scale: true },
  series: [
    {
      name: "Atendimentos semanais", type: "candlestick", data: ohlc,
      itemStyle: {
        color: readToken("--success"), color0: readToken("--error"),
        borderColor: readToken("--success"), borderColor0: readToken("--error"),
      },
    },
    { name: "MM 3", type: "line", smooth: true, showSymbol: false, lineStyle: { color: palette[0] }, data: mediaMovel(3) },
  ],
};

export function AtendimentosCandleMediaChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Candlestick semanal de atendimentos com médias móveis de 5 e 10 semanas sobrepostas."
    />
  );
}`;

export const candlestickComMedia: ChartPreset = {
  id: "candlestick-com-media",
  nome: "Candlestick com Médias Móveis",
  categoria: "distribuicao",
  descricao:
    "Candlestick semanal de atendimentos com médias móveis de 5 e 10 períodos sobrepostas em linha.",
  tags: ["candlestick", "média móvel", "tendência", "semanal"],
  option,
  codigoReact,
  quandoUsar: [
    "Séries com abertura, fechamento, mínima e máxima por período",
    "Separar ruído de tendência com médias móveis",
    "Acompanhamento semanal de indicadores voláteis",
  ],
  quandoNaoUsar: [
    "Séries com um único valor por período — prefira linha",
    "Público sem familiaridade com a leitura de candles",
    "Poucos períodos",
  ],
  acessibilidade: [
    "Legenda distingue candles e cada média móvel",
    "Média de 10 períodos usa traço tracejado além da cor",
    "axisPointer cruzado facilita a leitura de valores no eixo",
  ],
  ariaLabel:
    "Candlestick semanal de atendimentos ao longo de 26 semanas, em tendência de alta de cerca de 180 para 384, com médias móveis de 5 e 10 semanas acompanhando a subida.",
  altura: 380,
};

export default candlestickComMedia;
