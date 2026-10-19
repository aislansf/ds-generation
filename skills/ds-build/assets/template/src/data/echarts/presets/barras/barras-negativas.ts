import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const regioes = ["Porto Central", "Vale do Sul", "Região Central", "Litoral Leste", "Serra Alta", "Planalto Oeste"];
const variacao = [12.4, 7.8, 2.1, -3.6, -5.2, -9.4];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v) => formatarPercentual(v as number),
  },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    data: regioes,
    axisLine: { onZero: true },
    axisLabel: { rotate: 20, hideOverlap: true },
  },
  yAxis: {
    type: "value",
    name: "Variação anual",
    axisLabel: { formatter: (v: number) => formatarPercentual(v, 0) },
  },
  series: [
    {
      name: "Variação de atendimentos",
      type: "bar",
      data: variacao.map((v) => ({
        value: v,
        itemStyle: { color: v >= 0 ? palette[2] : palette[4] },
      })),
      label: {
        show: true,
        position: "top",
        formatter: (p) => formatarPercentual(p.value as number),
        color: readToken("--muted-foreground"),
        fontSize: 11,
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();
const variacao = [12.4, 7.8, 2.1, -3.6, -5.2, -9.4];

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => formatarPercentual(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
  xAxis: {
    type: "category",
    data: ["Porto Central", "Vale do Sul", "Região Central", "Litoral Leste", "Serra Alta", "Planalto Oeste"],
    axisLine: { onZero: true },
    axisLabel: { rotate: 20, hideOverlap: true },
  },
  yAxis: { type: "value", name: "Variação anual", axisLabel: { formatter: (v: number) => formatarPercentual(v, 0) } },
  series: [
    {
      name: "Variação de atendimentos",
      type: "bar",
      data: variacao.map((v) => ({ value: v, itemStyle: { color: v >= 0 ? palette[2] : palette[4] } })),
      label: { show: true, position: "top", formatter: (p) => formatarPercentual(p.value as number), color: readToken("--muted-foreground"), fontSize: 11 },
    },
  ],
};

export function VariacaoRegioesChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Colunas de variação anual de atendimentos por macrorregião, com eixo cruzando o zero: Porto Central mais 12,4 por cento, Vale do Sul mais 7,8, Região Central mais 2,1, Litoral Leste menos 3,6, Serra Alta menos 5,2 e Planalto Oeste menos 9,4 por cento."
    />
  );
}`;

export const barrasNegativas: ChartPreset = {
  id: "barras-negativas",
  nome: "Barras com Valores Negativos",
  categoria: "barras",
  descricao:
    "Variação percentual por macrorregião com eixo cruzando o zero e cor semântica para ganho e perda.",
  tags: ["barras", "negativo", "variação", "eixo zero"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar variação, desvio de meta ou saldo, com ganhos e perdas na mesma escala",
    "Quando o zero é a referência de leitura do gráfico",
    "Comparar magnitude de melhora e piora entre categorias",
  ],
  quandoNaoUsar: [
    "Valores exclusivamente positivos — o eixo em zero perde a função",
    "Séries múltiplas empilhadas com sinais mistos, cuja soma fica ambígua",
    "Quando a base de cálculo da variação é muito pequena, exagerando o percentual",
  ],
  acessibilidade: [
    "Não dependa só do verde e vermelho: mantenha o sinal no rótulo (mais ou menos)",
    "Deixe a linha do zero visível com axisLine onZero",
    "Descreva no ariaLabel quais categorias são positivas e quais são negativas",
  ],
  ariaLabel:
    "Colunas de variação anual de atendimentos por macrorregião, com eixo cruzando o zero: Porto Central mais 12,4 por cento, Vale do Sul mais 7,8, Região Central mais 2,1, Litoral Leste menos 3,6, Serra Alta menos 5,2 e Planalto Oeste menos 9,4 por cento.",
  altura: 340,
};

export default barrasNegativas;
