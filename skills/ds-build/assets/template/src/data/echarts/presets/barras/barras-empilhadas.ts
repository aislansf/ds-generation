import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v) => formatarNumero(v as number),
  },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: meses },
  yAxis: { type: "value", name: "Atendimentos", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    {
      name: "Empreender",
      type: "bar",
      stack: "total",
      label: { show: true, formatter: (p) => formatarNumero(p.value as number), fontSize: 11 },
      data: [320, 340, 361, 390, 402, 430],
      itemStyle: { color: palette[0] },
    },
    {
      name: "AGI",
      type: "bar",
      stack: "total",
      label: { show: true, formatter: (p) => formatarNumero(p.value as number), fontSize: 11 },
      data: [220, 232, 251, 264, 290, 312],
      itemStyle: { color: palette[1] },
    },
    {
      name: "Programa Inova",
      type: "bar",
      stack: "total",
      label: { show: true, formatter: (p) => formatarNumero(p.value as number), fontSize: 11 },
      data: [150, 162, 158, 181, 196, 208],
      itemStyle: { color: palette[2] },
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
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  yAxis: { type: "value", name: "Atendimentos", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    { name: "Empreender", type: "bar", stack: "total", label: { show: true, fontSize: 11 }, data: [320, 340, 361, 390, 402, 430], itemStyle: { color: palette[0] } },
    { name: "AGI", type: "bar", stack: "total", label: { show: true, fontSize: 11 }, data: [220, 232, 251, 264, 290, 312], itemStyle: { color: palette[1] } },
    { name: "Programa Inova", type: "bar", stack: "total", label: { show: true, fontSize: 11 }, data: [150, 162, 158, 181, 196, 208], itemStyle: { color: palette[2] } },
  ],
};

export function AtendimentosEmpilhadosChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Colunas empilhadas de atendimentos por mês somando Empreender, AGI e Programa Inova, de janeiro a junho, com total crescendo de 690 para 950."
    />
  );
}`;

export const barrasEmpilhadas: ChartPreset = {
  id: "barras-empilhadas",
  nome: "Barras Empilhadas",
  categoria: "barras",
  descricao:
    "Colunas empilhadas por programa e mês, com rótulo interno de cada parcela e leitura do total por coluna.",
  tags: ["barras", "empilhado", "composição", "total"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar o total de um período e, ao mesmo tempo, a contribuição de cada programa",
    "Poucas séries (até 4) com valores de magnitude parecida",
    "Quando a soma tem significado real (atendimentos totais, horas totais)",
  ],
  quandoNaoUsar: [
    "Comparar séries intermediárias entre si — só a base e o total têm linha de referência comum",
    "Quando a soma não faz sentido (médias, percentuais independentes)",
    "Muitas séries: a pilha vira uma faixa ilegível — prefira barras agrupadas ou small multiples",
  ],
  acessibilidade: [
    "Mantenha o rótulo interno para que o valor não dependa apenas do tamanho da fatia",
    "Descreva no ariaLabel o total inicial e final da série empilhada",
    "Garanta contraste suficiente entre o rótulo e a cor da parcela",
  ],
  ariaLabel:
    "Colunas empilhadas de atendimentos por mês somando Empreender, AGI e Programa Inova, de janeiro a junho, com total crescendo de 690 para 950.",
  altura: 340,
};

export default barrasEmpilhadas;
