import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const cor = readToken("--secondary");

/** 12 meses de dados diários fictícios (base + sazonalidade + ruído determinístico). */
function gerarSerieDiaria(): [number, number][] {
  const inicio = new Date(Date.UTC(2025, 0, 1)).getTime();
  const dias = 365;
  const pontos: [number, number][] = [];
  for (let i = 0; i < dias; i++) {
    const sazonal = Math.sin((i / dias) * Math.PI * 2) * 22;
    const ruido = ((i * 37) % 11) - 5;
    const valor = Math.round(90 + i * 0.12 + sazonal + ruido);
    pontos.push([inicio + i * 86400000, Math.max(valor, 0)]);
  }
  return pontos;
}

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    valueFormatter: (v) => formatarNumero(v as number),
  },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 56, containLabel: true },
  dataZoom: [
    { type: "slider", start: 60, end: 100, height: 18, bottom: 8 },
    { type: "inside", start: 60, end: 100 },
  ],
  xAxis: { type: "time", axisLabel: { hideOverlap: true } },
  yAxis: {
    type: "value",
    name: "Atendimentos/dia",
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    {
      name: "Atendimentos diários",
      type: "line",
      showSymbol: false,
      sampling: "lttb",
      data: gerarSerieDiaria(),
      lineStyle: { width: 1.5, color: cor },
      itemStyle: { color: cor },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const cor = readToken("--secondary");

function gerarSerieDiaria(): [number, number][] {
  const inicio = new Date(Date.UTC(2025, 0, 1)).getTime();
  const pontos: [number, number][] = [];
  for (let i = 0; i < 365; i++) {
    const sazonal = Math.sin((i / 365) * Math.PI * 2) * 22;
    const ruido = ((i * 37) % 11) - 5;
    pontos.push([inicio + i * 86400000, Math.max(Math.round(90 + i * 0.12 + sazonal + ruido), 0)]);
  }
  return pontos;
}

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 56, containLabel: true },
  dataZoom: [
    { type: "slider", start: 60, end: 100, height: 18, bottom: 8 },
    { type: "inside", start: 60, end: 100 },
  ],
  xAxis: { type: "time", axisLabel: { hideOverlap: true } },
  yAxis: { type: "value", name: "Atendimentos/dia", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    { name: "Atendimentos diários", type: "line", showSymbol: false, sampling: "lttb", data: gerarSerieDiaria(), lineStyle: { width: 1.5, color: cor }, itemStyle: { color: cor } },
  ],
};

export function AtendimentosDiariosChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Série temporal diária de atendimentos ao longo de 2025, com eixo de tempo e controles de zoom. A série varia em torno de 90 a 150 atendimentos por dia, com sazonalidade no meio do ano e leve tendência de alta."
    />
  );
}`;

export const linhaTemporalZoom: ChartPreset = {
  id: "linha-temporal-zoom",
  nome: "Série Temporal com Zoom",
  categoria: "linhas",
  descricao:
    "Eixo do tipo time com 365 pontos diários, amostragem LTTB e dataZoom (slider e inside) para navegar no período.",
  tags: ["linhas", "eixo time", "dataZoom", "alto volume", "diário"],
  option,
  codigoReact,
  quandoUsar: [
    "Séries com muitos pontos e intervalos irregulares entre datas",
    "Quando o usuário precisa alternar entre visão anual e recorte de poucos dias",
    "Monitoramento operacional diário de atendimentos ou acessos",
  ],
  quandoNaoUsar: [
    "Poucos períodos agregados (meses ou trimestres) — use eixo category",
    "Relatórios estáticos impressos, sem interação disponível",
    "Quando o ruído diário atrapalha a mensagem: agregue por semana ou mês",
  ],
  acessibilidade: [
    "Use eixo time para que as datas sejam proporcionais e não distorçam a leitura",
    "Mantenha dataZoom inside além do slider, permitindo navegação por teclado",
    "Resuma no ariaLabel a faixa de valores, a sazonalidade e a tendência do período",
  ],
  ariaLabel:
    "Série temporal diária de atendimentos ao longo de 2025, com eixo de tempo e controles de zoom. A série varia em torno de 90 a 150 atendimentos por dia, com sazonalidade no meio do ano e leve tendência de alta.",
  altura: 340,
};

export default linhaTemporalZoom;
