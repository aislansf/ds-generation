import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const indicadores = [
  { nome: "Atendimentos", valor: 92, cor: palette[0] },
  { nome: "MEIs formalizados", valor: 78, cor: palette[2] },
  { nome: "Horas de consultoria", valor: 64, cor: palette[3] },
];

export const option: EChartsOption = {
  tooltip: {
    formatter: (p) => {
      const params = p as { seriesName: string; value: number };
      return `${params.seriesName}<br/><strong>${formatarPercentual(params.value, 0)}</strong> da meta`;
    },
  },
  legend: {
    top: 0,
    left: "center",
    data: indicadores.map((i) => i.nome),
  },
  series: indicadores.map((ind, i) => ({
    name: ind.nome,
    type: "gauge" as const,
    min: 0,
    max: 100,
    startAngle: 90,
    endAngle: -270,
    radius: `${74 - i * 16}%`,
    center: ["50%", "56%"],
    pointer: { show: false },
    progress: { show: true, roundCap: true, width: 10, itemStyle: { color: ind.cor } },
    axisLine: { lineStyle: { width: 10, color: [[1, readToken("--muted")]] } },
    splitLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    title: { show: false },
    detail: {
      show: i === 0,
      valueAnimation: true,
      formatter: () => "Metas",
      color: readToken("--muted-foreground"),
      fontSize: 12,
      offsetCenter: [0, "10%"],
    },
    data: [{ value: ind.valor, name: ind.nome }],
  })),
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const indicadores = [
  { nome: "Atendimentos", valor: 92, cor: palette[0] },
  { nome: "MEIs formalizados", valor: 78, cor: palette[2] },
  { nome: "Horas de consultoria", valor: 64, cor: palette[3] },
];

const option: EChartsOption = {
  tooltip: {
    formatter: (p) => {
      const params = p as { seriesName: string; value: number };
      return params.seriesName + "<br/><strong>" + formatarPercentual(params.value, 0) + "</strong> da meta";
    },
  },
  legend: { top: 0, left: "center", data: indicadores.map((i) => i.nome) },
  series: indicadores.map((ind, i) => ({
    name: ind.nome,
    type: "gauge" as const,
    min: 0, max: 100, startAngle: 90, endAngle: -270,
    radius: (74 - i * 16) + "%", center: ["50%", "56%"],
    pointer: { show: false },
    progress: { show: true, roundCap: true, width: 10, itemStyle: { color: ind.cor } },
    axisLine: { lineStyle: { width: 10, color: [[1, readToken("--muted")]] } },
    splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, title: { show: false },
    detail: { show: false },
    data: [{ value: ind.valor, name: ind.nome }],
  })),
};

export function MetasMultiploChart() {
  return (
    <BrandChart
      option={option}
      height={300}
      ariaLabel="Três anéis concêntricos de atingimento de meta: atendimentos em 92 por cento, MEIs formalizados em 78 por cento e horas de consultoria em 64 por cento."
    />
  );
}`;

export const gaugeMultiplo: ChartPreset = {
  id: "gauge-multiplo",
  nome: "Gauge Múltiplo",
  categoria: "kpi",
  descricao:
    "Três indicadores de meta em anéis concêntricos no mesmo gráfico, com legenda e cores da paleta de tokens.",
  tags: ["gauge", "múltiplas séries", "metas", "anéis"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar o atingimento de até 3 ou 4 metas na mesma escala percentual",
    "Cabeçalhos de painéis com poucos indicadores-chave",
    "Quando a economia de espaço é prioridade",
  ],
  quandoNaoUsar: [
    "Mais de 4 indicadores: os anéis ficam finos e indistinguíveis",
    "Indicadores em escalas ou unidades diferentes",
    "Leitura precisa e comparação fina — prefira barras com meta",
  ],
  acessibilidade: [
    "Legenda obrigatória: cada anel é identificado somente pela cor",
    "Tooltip informa o nome do indicador e o percentual formatado",
    "Repita os três valores em texto próximo ao gráfico ou em tabela",
  ],
  ariaLabel:
    "Três anéis concêntricos de atingimento de meta: atendimentos em 92 por cento, MEIs formalizados em 78 por cento e horas de consultoria em 64 por cento.",
  altura: 300,
};

export default gaugeMultiplo;
