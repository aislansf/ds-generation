import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const atendimentos = [12400, 13100, 14200, 15600, 16800, 18200, 19500, 21000, 22400, 24100, 26000, 27500];
export const empresasAtendidas = [980, 1120, 1240, 1380, 1510, 1660, 1790, 1930, 2080, 2250, 2410, 2560];
export const empretecConcluintes = [24, 28, 32, 36, 40, 48, 52, 58, 64, 72, 80, 88];

export const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 48, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: meses },
  yAxis: {
    type: "log",
    name: "Escala logarítmica",
    logBase: 10,
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    { name: "Atendimentos", type: "line", smooth: true, symbolSize: 6, itemStyle: { color: palette[0] }, lineStyle: { width: 2, color: palette[0] }, emphasis: { focus: "series" }, data: atendimentos },
    { name: "Empresas atendidas", type: "line", smooth: true, symbolSize: 6, itemStyle: { color: palette[1] }, lineStyle: { width: 2, color: palette[1] }, emphasis: { focus: "series" }, data: empresasAtendidas },
    { name: "Concluintes Empreender", type: "line", smooth: true, symbolSize: 6, itemStyle: { color: palette[2] }, lineStyle: { width: 2, color: palette[2] }, emphasis: { focus: "series" }, data: empretecConcluintes },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  xAxis: { type: "category", boundaryGap: false, data: meses },
  yAxis: { type: "log", logBase: 10, name: "Escala logarítmica", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    { name: "Atendimentos", type: "line", smooth: true, itemStyle: { color: palette[0] }, data: [12400, 13100, 14200, 15600, 16800, 18200] },
    { name: "Empresas atendidas", type: "line", smooth: true, itemStyle: { color: palette[1] }, data: [980, 1120, 1240, 1380, 1510, 1660] },
    { name: "Concluintes Empreender", type: "line", smooth: true, itemStyle: { color: palette[2] }, data: [24, 28, 32, 36, 40, 48] },
  ],
};

export function EscalaLogChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Linhas em eixo logarítmico comparando atendimentos, empresas atendidas e concluintes do Empreender ao longo de 2025."
    />
  );
}`;

export const linhaLog: ChartPreset = {
  id: "linha-log",
  nome: "Linha com Eixo Logarítmico",
  categoria: "linhas",
  descricao:
    "Eixo Y logarítmico para comparar séries de ordens de grandeza muito diferentes na mesma área de plotagem.",
  tags: ["log", "escala", "ordens de grandeza", "comparação"],
  option,
  codigoReact,
  quandoUsar: [
    "Séries com grandezas muito distintas (dezenas x dezenas de milhares)",
    "Analisar taxa de crescimento relativa em vez de valores absolutos",
    "Indicadores exponenciais ao longo do tempo",
  ],
  quandoNaoUsar: [
    "Público não técnico sem explicação da escala",
    "Séries com zero ou valores negativos, incompatíveis com log",
    "Quando a diferença absoluta é a mensagem principal",
  ],
  acessibilidade: [
    "Nome do eixo declara explicitamente que a escala é logarítmica",
    "Tooltip mostra valores reais formatados em pt-BR, não o logaritmo",
    "Cada série tem cor de token e legenda própria",
  ],
  ariaLabel:
    "Linhas em eixo logarítmico comparando atendimentos, empresas atendidas e concluintes do Empreender de janeiro a dezembro de 2025. As três séries crescem de forma constante, com atendimentos saindo de 12.400 para 27.500 e concluintes de 24 para 88.",
  altura: 340,
};

export default linhaLog;
