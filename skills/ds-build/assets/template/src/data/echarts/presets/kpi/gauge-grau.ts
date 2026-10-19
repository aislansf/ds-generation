import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";

const estagios = ["Ideação", "Validação", "Operação", "Crescimento", "Escala"];

export const option: EChartsOption = {
  tooltip: {
    formatter: () => `Maturidade do negócio<br/><strong>Crescimento</strong> (estágio 4 de 5)`,
  },
  series: [
    {
      name: "Maturidade do negócio",
      type: "gauge",
      min: 0,
      max: 5,
      // 10 divisões: os rótulos caem no meio de cada um dos 5 estágios (0,5; 1,5; …)
      splitNumber: 10,
      startAngle: 200,
      endAngle: -20,
      radius: "92%",
      center: ["50%", "60%"],
      axisLine: {
        lineStyle: {
          width: 16,
          color: [
            [0.2, readToken("--error")],
            [0.4, readToken("--warning")],
            [0.6, readToken("--brand-comp-gold")],
            [0.8, readToken("--info")],
            [1, readToken("--success")],
          ],
        },
      },
      pointer: { itemStyle: { color: readToken("--foreground") }, width: 5, length: "48%" },
      anchor: { show: true, size: 12, itemStyle: { color: readToken("--foreground") } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        distance: 26,
        rotate: "tangential",
        color: readToken("--muted-foreground"),
        fontSize: 10,
        formatter: (v: number) => (v % 1 === 0.5 ? estagios[Math.floor(v)] : ""),
      },
      title: { offsetCenter: [0, "58%"], color: readToken("--muted-foreground"), fontSize: 12 },
      detail: {
        formatter: () => "Crescimento",
        color: readToken("--foreground"),
        fontSize: 20,
        fontWeight: 600,
        // Abaixo do pivô: no centro, o ponteiro risca o texto
        offsetCenter: [0, "36%"],
      },
      // 3,5 = meio da 4ª faixa (Crescimento)
      data: [{ value: 3.5, name: "Estágio 4 de 5" }],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";

const estagios = ["Ideação", "Validação", "Operação", "Crescimento", "Escala"];

const option: EChartsOption = {
  tooltip: { formatter: () => "Maturidade do negócio<br/><strong>Crescimento</strong> (estágio 4 de 5)" },
  series: [{
    name: "Maturidade do negócio",
    type: "gauge",
    min: 0, max: 5, splitNumber: 10, startAngle: 200, endAngle: -20,
    radius: "92%", center: ["50%", "60%"],
    axisLine: {
      lineStyle: {
        width: 16,
        color: [
          [0.2, readToken("--error")], [0.4, readToken("--warning")], [0.6, readToken("--brand-comp-gold")],
          [0.8, readToken("--info")], [1, readToken("--success")],
        ],
      },
    },
    pointer: { itemStyle: { color: readToken("--foreground") }, width: 5, length: "48%" },
    anchor: { show: true, size: 12, itemStyle: { color: readToken("--foreground") } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { distance: 26, rotate: "tangential", color: readToken("--muted-foreground"), fontSize: 10, formatter: (v: number) => (v % 1 === 0.5 ? estagios[Math.floor(v)] : "") },
    title: { offsetCenter: [0, "58%"], color: readToken("--muted-foreground"), fontSize: 12 },
    detail: { formatter: () => "Crescimento", color: readToken("--foreground"), fontSize: 20, fontWeight: 600, offsetCenter: [0, "36%"] },
    data: [{ value: 3.5, name: "Estágio 4 de 5" }],
  }],
};

export function MaturidadeGaugeChart() {
  return (
    <BrandChart
      option={option}
      height={300}
      ariaLabel="Gauge de estágio de maturidade do negócio. A escala tem cinco estágios, de Ideação a Escala, e o ponteiro indica o quarto estágio, Crescimento."
    />
  );
}`;

export const gaugeGrau: ChartPreset = {
  id: "gauge-grau",
  nome: "Gauge de Estágio",
  categoria: "kpi",
  descricao:
    "Medidor de estágio de maturidade do negócio com escala nominal de cinco níveis, ponteiro e rótulo textual central.",
  tags: ["gauge", "maturidade", "estágio", "escala ordinal"],
  option,
  codigoReact,
  quandoUsar: [
    "Classificações ordinais com poucos níveis nomeados",
    "Diagnósticos de maturidade, risco ou nível de aderência",
    "Quando o rótulo do estágio importa mais que o número",
  ],
  quandoNaoUsar: [
    "Métricas contínuas — prefira gauge percentual",
    "Comparação entre muitas unidades",
    "Escalas com mais de ~7 níveis, que não caberão nos rótulos",
  ],
  acessibilidade: [
    "Rótulos dos estágios visíveis no arco, além do valor central em texto",
    "Não use apenas cor para indicar o estágio — o nome está sempre presente",
    "Cores das faixas derivadas de tokens semânticos do DS",
  ],
  ariaLabel:
    "Gauge de estágio de maturidade do negócio. A escala tem cinco estágios, de Ideação a Escala, e o ponteiro indica o quarto estágio, Crescimento.",
  altura: 300,
};

export default gaugeGrau;
