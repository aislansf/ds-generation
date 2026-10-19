import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

/** Ordem crescente porque o eixo Y do ECharts cresce de baixo para cima. */
const regioes = ["Planalto Oeste", "Litoral Leste", "Serra Alta", "Região Central", "Vale do Sul", "Porto Central"];
const valores = [1180, 1640, 2310, 2870, 3920, 8450];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v) => formatarNumero(v as number),
  },
  legend: { show: false },
  grid: { left: 8, right: 48, top: 16, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "MEIs formalizados", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  yAxis: { type: "category", data: regioes },
  series: [
    {
      name: "MEIs formalizados",
      type: "bar",
      data: valores,
      itemStyle: { color: palette[0], borderRadius: [0, 4, 4, 0] },
      label: {
        show: true,
        position: "right",
        formatter: (p) => formatarNumero(p.value as number),
        fontSize: 11,
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => formatarNumero(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 48, top: 16, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "MEIs formalizados", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  yAxis: { type: "category", data: ["Planalto Oeste", "Litoral Leste", "Serra Alta", "Região Central", "Vale do Sul", "Porto Central"] },
  series: [
    {
      name: "MEIs formalizados",
      type: "bar",
      data: [1180, 1640, 2310, 2870, 3920, 8450],
      itemStyle: { color: palette[0], borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: "right", formatter: (p) => formatarNumero(p.value as number), fontSize: 11 },
    },
  ],
};

export function RankingRegioesChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Ranking horizontal de MEIs formalizados por macrorregião: Porto Central 8.450, Vale do Sul 3.920, Região Central 2.870, Serra Alta 2.310, Litoral Leste 1.640 e Planalto Oeste 1.180."
    />
  );
}`;

export const barrasHorizontais: ChartPreset = {
  id: "barras-horizontais",
  nome: "Barras Horizontais (Ranking)",
  categoria: "barras",
  descricao:
    "Ranking de macrorregiões com eixo de categoria na vertical e rótulo de valor à direita de cada barra.",
  tags: ["barras", "horizontal", "ranking", "comparação"],
  option,
  codigoReact,
  quandoUsar: [
    "Rankings e comparações entre categorias com nomes longos",
    "Quando há muitas categorias: o espaço vertical acomoda melhor os rótulos",
    "Quando a ordem por magnitude é a informação principal",
  ],
  quandoNaoUsar: [
    "Séries temporais — o tempo deve correr na horizontal",
    "Mais de uma ou duas séries por categoria, que poluem a leitura do ranking",
    "Quando as diferenças são mínimas e o eixo não parte do zero",
  ],
  acessibilidade: [
    "Ordene as barras por valor: a ordem é uma pista não visual de leitura",
    "Mostre o valor no rótulo, dispensando a estimativa pelo comprimento da barra",
    "Cite no ariaLabel o primeiro e o último colocado com seus valores",
  ],
  ariaLabel:
    "Ranking horizontal de MEIs formalizados por macrorregião: Porto Central 8.450, Vale do Sul 3.920, Região Central 2.870, Serra Alta 2.310, Litoral Leste 1.640 e Planalto Oeste 1.180.",
  altura: 320,
};

export default barrasHorizontais;
