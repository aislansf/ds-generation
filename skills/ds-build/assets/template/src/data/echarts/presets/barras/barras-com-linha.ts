import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
    formatter: (params) => {
      const lista = Array.isArray(params) ? params : [params];
      const linhas = lista.map((p) => {
        const valor =
          p.seriesName === "Taxa de conversão"
            ? formatarPercentual(p.value as number)
            : formatarNumero(p.value as number);
        return `${p.marker as string} ${p.seriesName as string}: <strong>${valor}</strong>`;
      });
      return `${lista[0]?.axisValueLabel ?? ""}<br/>${linhas.join("<br/>")}`;
    },
  },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 8, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  yAxis: [
    { type: "value", name: "Atendimentos", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
    {
      type: "value",
      name: "Conversão",
      max: 100,
      splitLine: { show: false },
      axisLabel: { formatter: (v: number) => formatarPercentual(v, 0) },
    },
  ],
  series: [
    {
      name: "Atendimentos",
      type: "bar",
      data: [820, 932, 901, 1034, 1190, 1280],
      itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] },
    },
    {
      name: "Taxa de conversão",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 7,
      data: [22.5, 24.1, 23.8, 26.4, 28.9, 31.2],
      lineStyle: { width: 2, color: palette[7] },
      itemStyle: { color: palette[7] },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 8, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  yAxis: [
    { type: "value", name: "Atendimentos", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
    { type: "value", name: "Conversão", max: 100, splitLine: { show: false }, axisLabel: { formatter: (v: number) => formatarPercentual(v, 0) } },
  ],
  series: [
    { name: "Atendimentos", type: "bar", data: [820, 932, 901, 1034, 1190, 1280], itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] } },
    { name: "Taxa de conversão", type: "line", yAxisIndex: 1, smooth: true, symbolSize: 7, data: [22.5, 24.1, 23.8, 26.4, 28.9, 31.2], lineStyle: { width: 2, color: palette[7] }, itemStyle: { color: palette[7] } },
  ],
};

export function VolumeVersusConversaoChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Colunas de atendimentos por mês combinadas com linha da taxa de conversão em eixo secundário: volume sobe de 820 para 1.280 e a conversão de 22,5 para 31,2 por cento."
    />
  );
}`;

export const barrasComLinha: ChartPreset = {
  id: "barras-com-linha",
  nome: "Barras com Linha (Eixo Duplo)",
  categoria: "barras",
  descricao:
    "Combinação de colunas de volume com linha de taxa percentual em eixo Y secundário, padrão de painel gerencial.",
  tags: ["barras", "linha", "eixo duplo", "combo", "taxa"],
  option,
  codigoReact,
  quandoUsar: [
    "Relacionar um volume absoluto com uma taxa ou índice no mesmo período",
    "Painéis gerenciais em que meta e realizado têm unidades diferentes",
    "Quando a correlação entre as duas medidas é a mensagem principal",
  ],
  quandoNaoUsar: [
    "Quando as duas medidas têm a mesma unidade — use um único eixo",
    "Mais de duas medidas: o segundo eixo já é difícil de interpretar",
    "Quando o eixo secundário puder sugerir cruzamentos ou correlações inexistentes",
  ],
  acessibilidade: [
    "Nomeie os dois eixos com sua unidade para eliminar ambiguidade",
    "Diferencie as medidas por forma (coluna x linha), não apenas por cor",
    "Informe no tooltip a unidade de cada série (número e percentual)",
  ],
  ariaLabel:
    "Colunas de atendimentos por mês combinadas com linha da taxa de conversão em eixo secundário: volume sobe de 820 para 1.280 e a conversão de 22,5 para 31,2 por cento.",
  altura: 340,
};

export default barrasComLinha;
