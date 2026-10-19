import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const etapas = [
  { name: "Visitas ao portal", value: 48200, itemStyle: { color: palette[0] } },
  { name: "Cadastros", value: 18400, itemStyle: { color: palette[1] } },
  { name: "Atendimentos iniciados", value: 9600, itemStyle: { color: palette[2] } },
  { name: "Consultorias concluídas", value: 4300, itemStyle: { color: palette[6] } },
  { name: "Negócios formalizados", value: 1850, itemStyle: { color: palette[8] } },
];

const topo = etapas[0].value;

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) =>
      `${p.name as string}<br/><strong>${formatarNumero(p.value as number)}</strong><br/>${formatarPercentual(
        ((p.value as number) / topo) * 100,
      )} do topo do funil`,
  },
  legend: { top: 0, left: "left" },
  series: [
    {
      name: "Jornada do empreendedor",
      type: "funnel",
      top: 48,
      bottom: 8,
      left: "8%",
      width: "84%",
      minSize: "16%",
      gap: 3,
      sort: "descending",
      label: {
        position: "inside",
        formatter: (p) => `${p.name as string} · ${formatarNumero(p.value as number)}`,
        fontSize: 12,
      },
      labelLine: { show: false },
      itemStyle: { borderWidth: 0 },
      data: etapas,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const etapas = [
  { name: "Visitas ao portal", value: 48200, itemStyle: { color: palette[0] } },
  { name: "Cadastros", value: 18400, itemStyle: { color: palette[1] } },
  { name: "Atendimentos iniciados", value: 9600, itemStyle: { color: palette[2] } },
  { name: "Consultorias concluídas", value: 4300, itemStyle: { color: palette[6] } },
  { name: "Negócios formalizados", value: 1850, itemStyle: { color: palette[8] } },
];
const topo = etapas[0].value;

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => p.name + "<br/><strong>" + formatarNumero(p.value as number) + "</strong><br/>" + formatarPercentual(((p.value as number) / topo) * 100) + " do topo do funil",
  },
  legend: { top: 0, left: "left" },
  series: [{
    name: "Jornada do empreendedor",
    type: "funnel",
    top: 48, bottom: 8, left: "8%", width: "84%",
    minSize: "16%",
    gap: 3,
    sort: "descending",
    label: { position: "inside", formatter: (p) => p.name + " · " + formatarNumero(p.value as number), fontSize: 12 },
    labelLine: { show: false },
    itemStyle: { borderWidth: 0 },
    data: etapas,
  }],
};

export function JornadaEmpreendedorChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Funil da jornada do empreendedor: 48.200 visitas ao portal, 18.400 cadastros, 9.600 atendimentos iniciados, 4.300 consultorias concluídas e 1.850 negócios formalizados, o que representa 3,8 por cento do topo do funil."
    />
  );
}`;

export const funil: ChartPreset = {
  id: "funil",
  nome: "Funil de Conversão",
  categoria: "proporcao",
  descricao:
    "Funil da jornada do empreendedor, com valores absolutos no rótulo e conversão relativa ao topo no tooltip.",
  tags: ["funil", "conversão", "jornada", "etapas"],
  option,
  codigoReact,
  quandoUsar: [
    "Etapas sequenciais em que cada uma é subconjunto da anterior",
    "Diagnóstico de perda entre fases da jornada de atendimento",
    "Comunicar taxa de conversão de ponta a ponta",
  ],
  quandoNaoUsar: [
    "Categorias independentes, que não formam sequência — use barras",
    "Etapas em que o volume pode crescer de uma fase para a seguinte",
    "Comparar dois funis ao mesmo tempo: prefira barras lado a lado",
  ],
  acessibilidade: [
    "Inclua nome e valor absoluto dentro de cada faixa, sem depender da largura",
    "Informe no tooltip a conversão em relação ao topo, não só o valor",
    "Descreva no ariaLabel todas as etapas em ordem e a conversão final",
  ],
  ariaLabel:
    "Funil da jornada do empreendedor: 48.200 visitas ao portal, 18.400 cadastros, 9.600 atendimentos iniciados, 4.300 consultorias concluídas e 1.850 negócios formalizados, o que representa 3,8 por cento do topo do funil.",
  altura: 360,
};

export default funil;
