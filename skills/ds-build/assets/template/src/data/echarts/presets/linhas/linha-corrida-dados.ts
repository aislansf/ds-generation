import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

/** Série diária fictícia de atendimentos (365 pontos, base 2025). */
function gerarSerie(): [string, number][] {
  const pontos: [string, number][] = [];
  const inicio = Date.UTC(2025, 0, 1);
  let base = 320;
  for (let i = 0; i < 365; i++) {
    const data = new Date(inicio + i * 86400000);
    const semana = data.getUTCDay();
    const sazonal = semana === 0 || semana === 6 ? -160 : 0;
    const tendencia = i * 0.45;
    const onda = Math.sin(i / 11) * 42 + Math.cos(i / 4) * 18;
    base = 320 + tendencia + onda + sazonal;
    pontos.push([data.toISOString().slice(0, 10), Math.max(40, Math.round(base))]);
  }
  return pontos;
}

export const dados = gerarSerie();

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    valueFormatter: (v) => formatarNumero(v as number),
  },
  grid: { left: 8, right: 16, top: 32, bottom: 64, containLabel: true },
  xAxis: { type: "time" },
  yAxis: { type: "value", name: "Atendimentos/dia" },
  dataZoom: [
    { type: "inside", start: 40, end: 100 },
    { type: "slider", start: 40, end: 100, height: 20, bottom: 12 },
  ],
  series: [
    {
      name: "Atendimentos diários",
      type: "line",
      showSymbol: false,
      sampling: "lttb",
      smooth: false,
      lineStyle: { width: 1.5, color: readToken("--primary") },
      itemStyle: { color: readToken("--primary") },
      areaStyle: { color: readToken("--primary", 0.12) },
      emphasis: { focus: "series" },
      data: dados,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

// 365 pontos diários fictícios de atendimentos
const dados: [string, number][] = gerarSerie();

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  xAxis: { type: "time" },
  yAxis: { type: "value", name: "Atendimentos/dia" },
  dataZoom: [
    { type: "inside", start: 40, end: 100 },
    { type: "slider", start: 40, end: 100, height: 20, bottom: 12 },
  ],
  series: [{
    name: "Atendimentos diários",
    type: "line",
    showSymbol: false,
    sampling: "lttb",
    lineStyle: { width: 1.5, color: readToken("--primary") },
    areaStyle: { color: readToken("--primary", 0.12) },
    data: dados,
  }],
};

export function AtendimentosDiariosChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Série diária de atendimentos em 2025 com 365 pontos, redução por amostragem LTTB e zoom interativo."
    />
  );
}`;

export const linhaCorridaDados: ChartPreset = {
  id: "linha-corrida-dados",
  nome: "Linha de Alto Volume (LTTB)",
  categoria: "linhas",
  descricao:
    "Série temporal densa com 365 pontos, amostragem lttb e dataZoom, demonstrando desempenho com grande volume de dados.",
  tags: ["performance", "lttb", "dataZoom", "série temporal"],
  option,
  codigoReact,
  quandoUsar: [
    "Séries com centenas ou milhares de pontos",
    "Monitoramento diário ou por hora com necessidade de zoom",
    "Quando a forma da curva importa mais que cada ponto isolado",
  ],
  quandoNaoUsar: [
    "Poucos pontos: a amostragem não traz ganho",
    "Quando cada ponto precisa ser clicável individualmente",
    "Comparações categóricas — prefira barras",
  ],
  acessibilidade: [
    "dataZoom com slider operável por teclado além do scroll",
    "Tooltip por eixo com data e valor formatados em pt-BR",
    "ariaLabel resume tendência, sazonalidade e faixa de valores",
  ],
  ariaLabel:
    "Série diária de atendimentos ao longo de 2025 com 365 pontos e amostragem LTTB. A curva cresce de cerca de 320 para mais de 480 atendimentos por dia, com quedas recorrentes nos fins de semana.",
  altura: 360,
};

export default linhaCorridaDados;
