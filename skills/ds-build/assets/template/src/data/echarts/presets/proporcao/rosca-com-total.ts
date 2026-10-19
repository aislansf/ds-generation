import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const dados = [
  { name: "Empreender", value: 1240, itemStyle: { color: palette[0] } },
  { name: "AGI", value: 980, itemStyle: { color: palette[1] } },
  { name: "Programa Inova", value: 640, itemStyle: { color: palette[2] } },
  { name: "Visita Técnica", value: 520, itemStyle: { color: palette[3] } },
  { name: "Empreender Mais", value: 380, itemStyle: { color: palette[6] } },
];

const total = dados.reduce((acc, d) => acc + d.value, 0);

export const option: EChartsOption = {
  title: [
    {
      text: formatarNumero(total),
      subtext: "Atendimentos no ano",
      left: "34%",
      top: "42%",
      textAlign: "center",
      textStyle: { fontSize: 26, fontWeight: 600, color: readToken("--foreground") },
      subtextStyle: { fontSize: 12, color: readToken("--muted-foreground") },
    },
  ],
  tooltip: {
    trigger: "item",
    formatter: (p) =>
      `${p.name as string}<br/><strong>${formatarNumero(p.value as number)}</strong> (${formatarPercentual(
        p.percent as number,
      )})`,
  },
  legend: { orient: "vertical", right: 0, top: "middle", itemGap: 12 },
  series: [
    {
      name: "Atendimentos por programa",
      type: "pie",
      radius: ["58%", "78%"],
      center: ["34%", "50%"],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: { show: false },
      labelLine: { show: false },
      emphasis: { scaleSize: 6 },
      data: dados,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const dados = [
  { name: "Empreender", value: 1240, itemStyle: { color: palette[0] } },
  { name: "AGI", value: 980, itemStyle: { color: palette[1] } },
  { name: "Programa Inova", value: 640, itemStyle: { color: palette[2] } },
  { name: "Visita Técnica", value: 520, itemStyle: { color: palette[3] } },
  { name: "Empreender Mais", value: 380, itemStyle: { color: palette[6] } },
];
const total = dados.reduce((acc, d) => acc + d.value, 0);

const option: EChartsOption = {
  title: [{
    text: formatarNumero(total),
    subtext: "Atendimentos no ano",
    left: "34%", top: "42%", textAlign: "center",
    textStyle: { fontSize: 26, fontWeight: 600, color: readToken("--foreground") },
    subtextStyle: { fontSize: 12, color: readToken("--muted-foreground") },
  }],
  tooltip: {
    trigger: "item",
    formatter: (p) => p.name + "<br/><strong>" + formatarNumero(p.value as number) + "</strong> (" + formatarPercentual(p.percent as number) + ")",
  },
  legend: { orient: "vertical", right: 0, top: "middle", itemGap: 12 },
  series: [{
    name: "Atendimentos por programa",
    type: "pie",
    radius: ["58%", "78%"],
    center: ["34%", "50%"],
    avoidLabelOverlap: true,
    itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
    label: { show: false },
    labelLine: { show: false },
    emphasis: { scaleSize: 6 },
    data: dados,
  }],
};

export function TotalAtendimentosDonutChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Rosca com o total de 3.760 atendimentos no centro, distribuídos entre Empreender 33 por cento, AGI 26 por cento, Programa Inova 17 por cento, Visita Técnica 13,8 por cento e Empreender Mais 10,1 por cento."
    />
  );
}`;

export const roscaComTotal: ChartPreset = {
  id: "rosca-com-total",
  nome: "Rosca com Total no Centro",
  categoria: "proporcao",
  descricao:
    "Donut com o total consolidado no centro via title, padrão para cartões de KPI que combinam número principal e composição.",
  tags: ["rosca", "donut", "KPI", "total", "composição"],
  option,
  codigoReact,
  quandoUsar: [
    "Cartões de KPI em que o total é o número principal e a composição é o detalhe",
    "Composição estável com até 6 categorias",
    "Painéis executivos que precisam de leitura em poucos segundos",
  ],
  quandoNaoUsar: [
    "Quando o total não tem significado (médias, taxas, índices)",
    "Comparação precisa entre categorias — prefira barras horizontais",
    "Categorias muito numerosas, que tornam o anel ilegível",
  ],
  acessibilidade: [
    "Garanta contraste do número central usando o token --foreground",
    "Mantenha a legenda com os nomes, já que os rótulos das fatias estão ocultos",
    "Cite no ariaLabel o total e os percentuais de cada categoria",
  ],
  ariaLabel:
    "Rosca com o total de 3.760 atendimentos no centro, distribuídos entre Empreender 33 por cento, AGI 26 por cento, Programa Inova 17 por cento, Visita Técnica 13,8 por cento e Empreender Mais 10,1 por cento.",
  altura: 320,
};

export default roscaComTotal;
