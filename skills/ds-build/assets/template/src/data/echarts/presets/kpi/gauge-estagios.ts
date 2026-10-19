import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

export const valor = 72;

export const option: EChartsOption = {
  tooltip: { show: false },
  series: [
    {
      name: "Índice de maturidade",
      type: "gauge",
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      radius: "88%",
      center: ["50%", "62%"],
      splitNumber: 5,
      progress: { show: false },
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.25, readToken("--error")],
            [0.5, readToken("--warning")],
            [0.75, readToken("--secondary")],
            [1, readToken("--success")],
          ],
        },
      },
      pointer: {
        icon: "path://M2 0 L4 0 L3 40 Z",
        length: "58%",
        width: 10,
        offsetCenter: [0, "6%"],
        itemStyle: { color: readToken("--foreground") },
      },
      anchor: { show: true, size: 12, itemStyle: { color: readToken("--foreground") } },
      axisTick: { distance: -20, length: 5, lineStyle: { color: readToken("--card"), width: 1 } },
      splitLine: { distance: -20, length: 20, lineStyle: { color: readToken("--card"), width: 2 } },
      axisLabel: {
        distance: -12,
        fontSize: 10,
        color: readToken("--muted-foreground"),
        formatter: (v: number) => {
          if (v === 12.5) return "Inicial";
          if (v === 37.5) return "Básico";
          if (v === 62.5) return "Intermediário";
          if (v === 87.5) return "Avançado";
          return "";
        },
      },
      title: { offsetCenter: [0, "26%"], fontSize: 12, color: readToken("--muted-foreground") },
      detail: {
        offsetCenter: [0, "-2%"],
        fontSize: 28,
        fontWeight: "bold",
        color: readToken("--foreground"),
        formatter: (v: number) => formatarPercentual(v, 0),
      },
      data: [{ value: valor, name: "Estágio: Intermediário" }],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const option: EChartsOption = {
  series: [{
    name: "Índice de maturidade",
    type: "gauge",
    startAngle: 200, endAngle: -20, min: 0, max: 100, radius: "88%", center: ["50%", "62%"],
    splitNumber: 5,
    axisLine: {
      lineStyle: {
        width: 20,
        color: [
          [0.25, readToken("--error")],
          [0.5, readToken("--warning")],
          [0.75, readToken("--secondary")],
          [1, readToken("--success")],
        ],
      },
    },
    pointer: { icon: "path://M2 0 L4 0 L3 40 Z", length: "58%", width: 10, itemStyle: { color: readToken("--foreground") } },
    axisLabel: {
      distance: -12, fontSize: 10,
      formatter: (v: number) => ({ 12.5: "Inicial", 37.5: "Básico", 62.5: "Intermediário", 87.5: "Avançado" }[v] ?? ""),
    },
    detail: { offsetCenter: [0, "-2%"], fontSize: 28, fontWeight: "bold", formatter: (v: number) => formatarPercentual(v, 0) },
    data: [{ value: 72, name: "Estágio: Intermediário" }],
  }],
};

export function MaturidadeGaugeChart() {
  return (
    <BrandChart
      option={option}
      height={300}
      ariaLabel="Medidor de maturidade em 72%, faixa Intermediário, em escala de quatro estágios."
    />
  );
}`;

export const gaugeEstagios: ChartPreset = {
  id: "gauge-estagios",
  nome: "Gauge por Estágios",
  categoria: "kpi",
  descricao:
    "Medidor com quatro faixas coloridas nomeadas por estágio de maturidade e ponteiro indicando a posição atual.",
  tags: ["gauge", "estágios", "faixas", "maturidade"],
  option,
  codigoReact,
  quandoUsar: [
    "Indicadores com escala qualitativa por faixas acordadas",
    "Diagnósticos de maturidade e níveis de aderência",
    "Cartões de KPI únicos em destaque",
  ],
  quandoNaoUsar: [
    "Comparar várias unidades — prefira barras",
    "Séries temporais",
    "Quando não existem faixas definidas pela área de negócio",
  ],
  acessibilidade: [
    "Nome do estágio escrito abaixo do valor, não apenas na cor da faixa",
    "Rótulos das faixas em texto ao longo do arco",
    "Valor numérico grande e com contraste AA sobre o fundo do card",
  ],
  ariaLabel:
    "Medidor de índice de maturidade em 72%, dentro da faixa Intermediário, em escala de quatro estágios: Inicial, Básico, Intermediário e Avançado.",
  altura: 300,
};

export default gaugeEstagios;
