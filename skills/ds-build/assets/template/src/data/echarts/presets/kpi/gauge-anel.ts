import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

export const option: EChartsOption = {
  tooltip: {
    formatter: (p) => `Execução do plano de ação<br/><strong>${formatarPercentual((p as { value: number }).value)}</strong>`,
  },
  series: [
    {
      name: "Execução do plano de ação",
      type: "gauge",
      min: 0,
      max: 100,
      startAngle: 90,
      endAngle: -270,
      radius: "88%",
      center: ["50%", "52%"],
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        width: 12,
        itemStyle: { color: readToken("--primary") },
      },
      axisLine: { lineStyle: { width: 12, color: [[1, readToken("--primary", 0.15)]] } },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      title: { show: true, offsetCenter: [0, "26%"], color: readToken("--muted-foreground"), fontSize: 12 },
      detail: {
        valueAnimation: true,
        formatter: (v: number) => formatarPercentual(v, 0),
        color: readToken("--foreground"),
        fontSize: 28,
        fontWeight: 600,
        offsetCenter: [0, "-4%"],
      },
      data: [{ value: 72, name: "Plano de ação" }],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const option: EChartsOption = {
  tooltip: { formatter: (p) => "Execução<br/><strong>" + formatarPercentual((p as { value: number }).value) + "</strong>" },
  series: [{
    name: "Execução do plano de ação",
    type: "gauge",
    min: 0, max: 100, startAngle: 90, endAngle: -270,
    radius: "88%", center: ["50%", "52%"],
    pointer: { show: false },
    progress: { show: true, overlap: false, roundCap: true, clip: false, width: 12, itemStyle: { color: readToken("--primary") } },
    axisLine: { lineStyle: { width: 12, color: [[1, readToken("--primary", 0.15)]] } },
    splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false },
    title: { show: true, offsetCenter: [0, "26%"], color: readToken("--muted-foreground"), fontSize: 12 },
    detail: {
      valueAnimation: true, formatter: (v: number) => formatarPercentual(v, 0),
      color: readToken("--foreground"), fontSize: 28, fontWeight: 600, offsetCenter: [0, "-4%"],
    },
    data: [{ value: 72, name: "Plano de ação" }],
  }],
};

export function ProgressoAnelChart() {
  return (
    <BrandChart
      option={option}
      height={240}
      ariaLabel="Anel de progresso mostrando 72 por cento de execução do plano de ação, com o valor exibido no centro."
    />
  );
}`;

export const gaugeAnel: ChartPreset = {
  id: "gauge-anel",
  nome: "Gauge em Anel (progresso)",
  categoria: "kpi",
  descricao:
    "Anel fino de progresso sem ponteiro, com valor central — formato ideal para cards compactos de KPI.",
  tags: ["gauge", "anel", "progresso", "card"],
  option,
  codigoReact,
  quandoUsar: [
    "Cards compactos com um único percentual de progresso",
    "Grades de KPIs em que a consistência visual importa",
    "Quando não há faixas de desempenho a comunicar",
  ],
  quandoNaoUsar: [
    "Indicadores sem limite máximo",
    "Comparação entre vários itens — prefira barras",
    "Quando as faixas de meta precisam aparecer — use o gauge de meta",
  ],
  acessibilidade: [
    "Valor central sempre visível e formatado em pt-BR",
    "Título curto no rodapé identifica a métrica sem depender de tooltip",
    "Trilho e progresso derivados do token primary, garantindo contraste nos dois temas",
  ],
  ariaLabel:
    "Anel de progresso mostrando 72 por cento de execução do plano de ação, com o valor exibido no centro.",
  altura: 240,
};

export default gaugeAnel;
