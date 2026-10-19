import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) =>
      `${p.name as string}<br/><strong>${formatarNumero(p.value as number)}</strong> horas`,
  },
  legend: { orient: "vertical", right: 0, top: "middle" },
  series: [
    {
      name: "Horas de consultoria por eixo",
      type: "pie",
      roseType: "area",
      radius: [24, "72%"],
      center: ["38%", "52%"],
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2, borderRadius: 4 },
      label: {
        show: true,
        color: readToken("--muted-foreground"),
        fontSize: 11,
        formatter: (p) => formatarNumero(p.value as number),
      },
      labelLine: { length: 8, length2: 8 },
      data: [
        { name: "Inovação", value: 1240, itemStyle: { color: palette[0] } },
        { name: "Mercado", value: 1020, itemStyle: { color: palette[1] } },
        { name: "Finanças", value: 880, itemStyle: { color: palette[2] } },
        { name: "Processos", value: 720, itemStyle: { color: palette[3] } },
        { name: "Pessoas", value: 560, itemStyle: { color: palette[6] } },
        { name: "Sustentabilidade", value: 410, itemStyle: { color: palette[8] } },
      ],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "item", formatter: (p) => p.name + "<br/><strong>" + formatarNumero(p.value as number) + "</strong> horas" },
  legend: { orient: "vertical", right: 0, top: "middle" },
  series: [{
    name: "Horas de consultoria por eixo",
    type: "pie",
    roseType: "area",
    radius: [24, "72%"],
    center: ["38%", "52%"],
    itemStyle: { borderColor: readToken("--card"), borderWidth: 2, borderRadius: 4 },
    label: { show: true, color: readToken("--muted-foreground"), fontSize: 11, formatter: (p) => formatarNumero(p.value as number) },
    labelLine: { length: 8, length2: 8 },
    data: [
      { name: "Inovação", value: 1240, itemStyle: { color: palette[0] } },
      { name: "Mercado", value: 1020, itemStyle: { color: palette[1] } },
      { name: "Finanças", value: 880, itemStyle: { color: palette[2] } },
      { name: "Processos", value: 720, itemStyle: { color: palette[3] } },
      { name: "Pessoas", value: 560, itemStyle: { color: palette[6] } },
      { name: "Sustentabilidade", value: 410, itemStyle: { color: palette[8] } },
    ],
  }],
};

export function HorasPorEixoRosaChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Gráfico rosa de Nightingale com horas de consultoria por eixo temático: Inovação 1.240, Mercado 1.020, Finanças 880, Processos 720, Pessoas 560 e Sustentabilidade 410 horas."
    />
  );
}`;

export const pizzaRosa: ChartPreset = {
  id: "pizza-rosa",
  nome: "Rosa de Nightingale",
  categoria: "proporcao",
  descricao:
    "Pizza com roseType area, em que o raio varia conforme o valor — útil quando há muitas categorias com valores pequenos.",
  tags: ["pizza", "rosa", "nightingale", "roseType"],
  option,
  codigoReact,
  quandoUsar: [
    "Composição com 6 a 10 categorias, em que fatias finas ficariam ilegíveis",
    "Quando se quer destacar a hierarquia entre categorias com impacto visual",
    "Painéis de abertura e capas de relatório",
  ],
  quandoNaoUsar: [
    "Leitura precisa de proporção: o raio exagera as diferenças",
    "Poucas categorias — a rosca simples comunica melhor",
    "Quando o público espera percentuais exatos do total",
  ],
  acessibilidade: [
    "Mostre os valores absolutos no rótulo, pois a área não é confiável para estimativa",
    "Mantenha legenda com todos os nomes das categorias",
    "Ordene as fatias por magnitude e reproduza essa ordem no ariaLabel",
  ],
  ariaLabel:
    "Gráfico rosa de Nightingale com horas de consultoria por eixo temático: Inovação 1.240, Mercado 1.020, Finanças 880, Processos 720, Pessoas 560 e Sustentabilidade 410 horas.",
  altura: 360,
};

export default pizzaRosa;
