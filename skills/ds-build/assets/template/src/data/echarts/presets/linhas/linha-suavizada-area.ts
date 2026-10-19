import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const cor = readToken("--primary");

export const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  },
  yAxis: {
    type: "value",
    name: "Atendimentos",
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    {
      name: "Atendimentos",
      type: "line",
      smooth: true,
      showSymbol: false,
      data: [1820, 1932, 2010, 2140, 2290, 2380, 2460, 2530, 2680, 2810, 2960, 3120],
      lineStyle: { width: 2.5, color: cor },
      itemStyle: { color: cor },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: readToken("--primary", 0.35) },
            { offset: 1, color: readToken("--primary", 0.02) },
          ],
        },
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const cor = readToken("--primary");

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] },
  yAxis: { type: "value", name: "Atendimentos", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    {
      name: "Atendimentos",
      type: "line",
      smooth: true,
      showSymbol: false,
      data: [1820, 1932, 2010, 2140, 2290, 2380, 2460, 2530, 2680, 2810, 2960, 3120],
      lineStyle: { width: 2.5, color: cor },
      itemStyle: { color: cor },
      areaStyle: {
        color: {
          type: "linear", x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: readToken("--primary", 0.35) },
            { offset: 1, color: readToken("--primary", 0.02) },
          ],
        },
      },
    },
  ],
};

export function EvolucaoAtendimentosChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Área suavizada com gradiente mostrando a evolução mensal de atendimentos ao longo de doze meses, com crescimento contínuo de 1.820 em janeiro para 3.120 em dezembro."
    />
  );
}`;

export const linhaSuavizadaArea: ChartPreset = {
  id: "linha-suavizada-area",
  nome: "Área Suavizada com Gradiente",
  categoria: "linhas",
  descricao:
    "Série única com área em gradiente vertical derivado do token primary, indicada para destacar tendência em cards e painéis.",
  tags: ["linhas", "área", "gradiente", "tendência"],
  option,
  codigoReact,
  quandoUsar: [
    "Destacar a tendência de um único indicador ao longo do tempo",
    "Cards de KPI com histórico e painéis de abertura de dashboard",
    "Quando o volume acumulado sob a curva reforça a mensagem de crescimento",
  ],
  quandoNaoUsar: [
    "Mais de duas séries: as áreas se sobrepõem e escondem dados",
    "Quando é preciso ler valores exatos ponto a ponto — prefira barras ou tabela",
    "Categorias sem ordem temporal",
  ],
  acessibilidade: [
    "Mantenha a linha com espessura suficiente: o gradiente é decorativo, a linha é o dado",
    "Descreva no ariaLabel o valor inicial, o final e o sentido da tendência",
    "Garanta contraste da linha sobre o fundo em light e dark mode usando tokens",
  ],
  ariaLabel:
    "Área suavizada com gradiente mostrando a evolução mensal de atendimentos ao longo de doze meses, com crescimento contínuo de 1.820 em janeiro para 3.120 em dezembro.",
  altura: 320,
};

export default linhaSuavizadaArea;
