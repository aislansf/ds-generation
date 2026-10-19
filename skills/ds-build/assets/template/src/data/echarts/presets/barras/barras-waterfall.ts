import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const etapas = ["Base 2024", "Empreender", "AGI", "Programa Inova", "Evasão", "Base 2025"];
/** Série de apoio transparente que "empurra" cada barra até a base correta. */
const apoio = [0, 4200, 5000, 5750, 5900, 0];
const variacoes = [4200, 800, 750, 400, -550, 5600];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const lista = Array.isArray(params) ? params : [params];
      const real = lista.find((p) => p.seriesName === "Variação");
      if (!real) return "";
      return `${real.axisValueLabel as string}<br/>${real.marker as string} <strong>${formatarNumero(real.value as number)}</strong> empresas`;
    },
  },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: etapas, axisLabel: { rotate: 20, hideOverlap: true } },
  yAxis: { type: "value", name: "Empresas atendidas", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    {
      name: "Apoio",
      type: "bar",
      stack: "cascata",
      silent: true,
      itemStyle: { color: "transparent" },
      emphasis: { itemStyle: { color: "transparent" } },
      data: apoio,
    },
    {
      name: "Variação",
      type: "bar",
      stack: "cascata",
      data: variacoes.map((v, i) => ({
        value: v,
        itemStyle: {
          color: i === 0 || i === variacoes.length - 1 ? palette[0] : v >= 0 ? palette[2] : palette[4],
          borderRadius: 4,
        },
      })),
      label: {
        show: true,
        position: "top",
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
const apoio = [0, 4200, 5000, 5750, 5900, 0];
const variacoes = [4200, 800, 750, 400, -550, 5600];

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: ["Base 2024", "Empreender", "AGI", "Programa Inova", "Evasão", "Base 2025"], axisLabel: { rotate: 20, hideOverlap: true } },
  yAxis: { type: "value", name: "Empresas atendidas", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    { name: "Apoio", type: "bar", stack: "cascata", silent: true, itemStyle: { color: "transparent" }, emphasis: { itemStyle: { color: "transparent" } }, data: apoio },
    {
      name: "Variação",
      type: "bar",
      stack: "cascata",
      data: variacoes.map((v, i) => ({
        value: v,
        itemStyle: { color: i === 0 || i === variacoes.length - 1 ? palette[0] : v >= 0 ? palette[2] : palette[4], borderRadius: 4 },
      })),
      label: { show: true, position: "top", formatter: (p) => formatarNumero(p.value as number), fontSize: 11 },
    },
  ],
};

export function CascataBaseEmpresasChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Gráfico cascata da evolução da base de empresas atendidas: parte de 4.200 em 2024, soma 800 do Empreender, 750 do AGI e 400 do Programa Inova, perde 550 por evasão e chega a 5.600 em 2025."
    />
  );
}`;

export const barrasWaterfall: ChartPreset = {
  id: "barras-waterfall",
  nome: "Cascata (Waterfall)",
  categoria: "barras",
  descricao:
    "Decomposição de resultado com a técnica de série de apoio transparente: base inicial, contribuições, perdas e total final.",
  tags: ["barras", "waterfall", "cascata", "decomposição"],
  option,
  codigoReact,
  quandoUsar: [
    "Explicar como um total saiu de um valor inicial para um valor final",
    "Decompor resultado por contribuição de cada programa ou causa",
    "Análises de variação orçamentária e de carteira de clientes",
  ],
  quandoNaoUsar: [
    "Séries temporais contínuas — a cascata é uma narrativa de etapas",
    "Muitas etapas (mais de 8 a 10), que tornam a leitura confusa",
    "Quando as parcelas não somam exatamente o total final",
  ],
  acessibilidade: [
    "Mantenha a série de apoio com silent: true para não aparecer em tooltip ou leitura",
    "Diferencie totais e variações também pelo rótulo, não apenas pela cor",
    "Descreva no ariaLabel a sequência início, contribuições, perdas e fim",
  ],
  ariaLabel:
    "Gráfico cascata da evolução da base de empresas atendidas: parte de 4.200 em 2024, soma 800 do Empreender, 750 do AGI e 400 do Programa Inova, perde 550 por evasão e chega a 5.600 em 2025.",
  altura: 340,
};

export default barrasWaterfall;
