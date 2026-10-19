import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarMoeda, formatarNumero } from "@/lib/echarts/format";

/** [horas, faturamento, empregos gerados, empresa] */
export const bolhas: [number, number, number, string][] = [
  [10, 72000, 2, "Padaria Vila Nova"],
  [14, 105000, 3, "Costura Vale do Sul"],
  [18, 138000, 5, "Mecânica Serra Alta"],
  [22, 176000, 6, "Doces do Sertão"],
  [26, 205000, 9, "Café Serra Azul"],
  [30, 238000, 11, "Malharia Lagoa Seca"],
  [34, 292000, 14, "Móveis Litoral"],
  [38, 331000, 18, "Tech Porto Central"],
  [42, 388000, 22, "Agro Planalto Oeste"],
  [46, 425000, 27, "Turismo Litoral"],
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: [number, number, number, string] }).value;
      return `<strong>${v[3]}</strong><br/>Horas: ${formatarNumero(v[0])}<br/>Faturamento: ${formatarMoeda(v[1], 0)}<br/>Empregos gerados: ${formatarNumero(v[2])}`;
    },
  },
  legend: { show: false },
  grid: { left: 8, right: 24, top: 32, bottom: 56, containLabel: true },
  xAxis: { type: "value", name: "Horas de consultoria", min: 0 },
  yAxis: {
    type: "value",
    name: "Faturamento (R$)",
    axisLabel: { formatter: (v: number) => formatarNumero(v / 1000) + " mil" },
  },
  visualMap: [
    {
      type: "continuous",
      dimension: 2,
      min: 2,
      max: 27,
      text: ["Mais empregos", "Menos empregos"],
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      itemWidth: 12,
      itemHeight: 90,
      textStyle: { color: readToken("--muted-foreground"), fontSize: 11 },
      inRange: {
        color: [readToken("--brand-comp-blue-mid"), readToken("--primary"), readToken("--brand-comp-indigo")],
      },
    },
  ],
  series: [
    {
      name: "Porte por empregos gerados",
      type: "scatter",
      symbolSize: (d) => 10 + ((d as number[])[2] as number) * 1.4,
      itemStyle: { opacity: 0.85 },
      data: bolhas,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarMoeda, formatarNumero } from "@/lib/echarts/format";

const bolhas: [number, number, number, string][] = [
  [10, 72000, 2, "Padaria Vila Nova"], [18, 138000, 5, "Mecânica Serra Alta"], [26, 205000, 9, "Café Serra Azul"],
  [34, 292000, 14, "Móveis Litoral"], [42, 388000, 22, "Agro Planalto Oeste"], [46, 425000, 27, "Turismo Litoral"],
];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: [number, number, number, string] }).value;
      return "<strong>" + v[3] + "</strong><br/>Horas: " + formatarNumero(v[0]) +
        "<br/>Faturamento: " + formatarMoeda(v[1], 0) + "<br/>Empregos: " + formatarNumero(v[2]);
    },
  },
  grid: { left: 8, right: 24, top: 32, bottom: 56, containLabel: true },
  xAxis: { type: "value", name: "Horas de consultoria", min: 0 },
  yAxis: { type: "value", name: "Faturamento (R$)", axisLabel: { formatter: (v: number) => formatarNumero(v / 1000) + " mil" } },
  visualMap: [{
    type: "continuous", dimension: 2, min: 2, max: 27,
    text: ["Mais empregos", "Menos empregos"], calculable: true,
    orient: "horizontal", left: "center", bottom: 0, itemWidth: 12, itemHeight: 90,
    inRange: { color: [readToken("--brand-comp-blue-mid"), readToken("--primary"), readToken("--brand-comp-indigo")] },
  }],
  series: [{
    name: "Porte por empregos gerados",
    type: "scatter",
    symbolSize: (d) => 10 + (d as number[])[2] * 1.4,
    itemStyle: { opacity: 0.85 },
    data: bolhas,
  }],
};

export function BolhasPorteChart() {
  return (
    <BrandChart
      option={option}
      height={400}
      ariaLabel="Bubble chart de 10 empresas: horas de consultoria no eixo horizontal, faturamento no vertical e tamanho e cor da bolha proporcionais aos empregos gerados, que variam de 2 a 27."
    />
  );
}`;

export const dispersaoBolhas: ChartPreset = {
  id: "dispersao-bolhas",
  nome: "Dispersão em Bolhas",
  categoria: "distribuicao",
  descricao:
    "Bubble chart com três dimensões: horas, faturamento e empregos gerados (tamanho e cor), com visualMap derivado dos tokens do DS.",
  tags: ["bolhas", "bubble", "três dimensões", "visualMap"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar três variáveis numéricas em um único plano",
    "Comparar porte relativo dos itens sem criar um gráfico separado",
    "Análises exploratórias de carteira de clientes",
  ],
  quandoNaoUsar: [
    "Leitura precisa de valores: área de círculo é difícil de comparar",
    "Muitos pontos sobrepostos — reduza a amostra ou use heatmap",
    "Quando a terceira dimensão é categórica — use cor discreta ou facetas",
  ],
  acessibilidade: [
    "A escala de cor do visualMap deve vir de tokens, garantindo contraste em light e dark",
    "Sempre repita no tooltip o valor da dimensão codificada por tamanho",
    "Ofereça a mesma base de dados em tabela: área e cor não são acessíveis isoladamente",
  ],
  ariaLabel:
    "Bubble chart de 10 empresas: horas de consultoria no eixo horizontal, faturamento no vertical e tamanho e cor da bolha proporcionais aos empregos gerados, que variam de 2 a 27.",
  altura: 400,
};

export default dispersaoBolhas;
