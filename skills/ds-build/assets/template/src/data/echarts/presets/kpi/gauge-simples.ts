import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

export const option: EChartsOption = {
  tooltip: {
    formatter: (p) => `Atingimento da meta<br/><strong>${formatarPercentual((p as { value: number }).value)}</strong>`,
  },
  series: [
    {
      name: "Atingimento da meta anual",
      type: "gauge",
      min: 0,
      max: 100,
      startAngle: 210,
      endAngle: -30,
      radius: "92%",
      center: ["50%", "58%"],
      progress: { show: false },
      axisLine: {
        lineStyle: {
          width: 18,
          color: [
            [0.5, readToken("--error")],
            [0.8, readToken("--warning")],
            [1, readToken("--success")],
          ],
        },
      },
      pointer: { itemStyle: { color: readToken("--foreground") }, width: 5, length: "62%" },
      anchor: { show: true, size: 12, itemStyle: { color: readToken("--foreground") } },
      axisTick: { distance: -22, length: 6, lineStyle: { color: readToken("--card"), width: 2 } },
      splitLine: { distance: -22, length: 18, lineStyle: { color: readToken("--card"), width: 2 } },
      axisLabel: { distance: 26, color: readToken("--muted-foreground"), fontSize: 11 },
      title: { offsetCenter: [0, "64%"], color: readToken("--muted-foreground"), fontSize: 12 },
      detail: {
        valueAnimation: true,
        formatter: (v: number) => formatarPercentual(v),
        color: readToken("--foreground"),
        fontSize: 26,
        fontWeight: 600,
        // Abaixo do pivô: no centro, o ponteiro risca o número
        offsetCenter: [0, "38%"],
      },
      data: [{ value: 86.4, name: "Meta anual" }],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const option: EChartsOption = {
  tooltip: { formatter: (p) => "Atingimento da meta<br/><strong>" + formatarPercentual((p as { value: number }).value) + "</strong>" },
  series: [{
    name: "Atingimento da meta anual",
    type: "gauge",
    min: 0, max: 100, startAngle: 210, endAngle: -30,
    radius: "92%", center: ["50%", "58%"],
    axisLine: {
      lineStyle: {
        width: 18,
        color: [[0.5, readToken("--error")], [0.8, readToken("--warning")], [1, readToken("--success")]],
      },
    },
    pointer: { itemStyle: { color: readToken("--foreground") }, width: 5, length: "62%" },
    anchor: { show: true, size: 12, itemStyle: { color: readToken("--foreground") } },
    axisTick: { distance: -22, length: 6, lineStyle: { color: readToken("--card"), width: 2 } },
    splitLine: { distance: -22, length: 18, lineStyle: { color: readToken("--card"), width: 2 } },
    axisLabel: { distance: 26, color: readToken("--muted-foreground"), fontSize: 11 },
    title: { offsetCenter: [0, "64%"], color: readToken("--muted-foreground"), fontSize: 12 },
    detail: {
      valueAnimation: true,
      formatter: (v: number) => formatarPercentual(v),
      color: readToken("--foreground"),
      fontSize: 26, fontWeight: 600, offsetCenter: [0, "38%"],
    },
    data: [{ value: 86.4, name: "Meta anual" }],
  }],
};

export function MetaGaugeChart() {
  return (
    <BrandChart
      option={option}
      height={280}
      ariaLabel="Velocímetro de atingimento da meta anual em 86,4 por cento, dentro da faixa verde de desempenho satisfatório, que começa em 80 por cento."
    />
  );
}`;

export const gaugeSimples: ChartPreset = {
  id: "gauge-simples",
  nome: "Gauge de Meta",
  categoria: "kpi",
  descricao:
    "Velocímetro de atingimento de meta de 0 a 100% com faixas de erro, atenção e sucesso derivadas dos tokens semânticos.",
  tags: ["gauge", "meta", "indicador", "semáforo"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar um único indicador contra uma meta conhecida",
    "Painéis executivos em que a faixa de desempenho importa",
    "Quando a escala tem limites fixos e significado claro",
  ],
  quandoNaoUsar: [
    "Múltiplos indicadores comparáveis — prefira barras com linha de meta",
    "Séries temporais",
    "Métricas sem limite superior definido",
  ],
  acessibilidade: [
    "O valor central em texto garante leitura sem depender da cor da faixa",
    "Explique em legenda textual os limites de cada faixa (até 50%, até 80%, acima)",
    "Use os tokens error, warning e success para manter contraste em light e dark",
  ],
  ariaLabel:
    "Velocímetro de atingimento da meta anual em 86,4 por cento, dentro da faixa verde de desempenho satisfatório, que começa em 80 por cento.",
  altura: 280,
};

export default gaugeSimples;
