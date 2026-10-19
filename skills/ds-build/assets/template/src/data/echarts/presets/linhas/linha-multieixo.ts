import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarMoeda, formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
    formatter: (params) => {
      const lista = Array.isArray(params) ? params : [params];
      const linhas = lista.map((p) => {
        const valor =
          p.seriesName === "Faturamento assessorado"
            ? formatarMoeda(p.value as number, 0)
            : formatarNumero(p.value as number);
        return `${p.marker as string} ${p.seriesName as string}: <strong>${valor}</strong>`;
      });
      return `${lista[0]?.axisValueLabel ?? ""}<br/>${linhas.join("<br/>")}`;
    },
  },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 8, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  yAxis: [
    {
      type: "value",
      name: "Empresas",
      position: "left",
      axisLabel: { formatter: (v: number) => formatarNumero(v) },
    },
    {
      type: "value",
      name: "Faturamento (R$)",
      position: "right",
      splitLine: { show: false },
      axisLabel: { formatter: (v: number) => `${formatarNumero(v / 1_000_000, 1)} mi` },
    },
  ],
  series: [
    {
      name: "Empresas atendidas",
      type: "line",
      smooth: true,
      symbolSize: 6,
      data: [420, 468, 512, 560, 604, 662],
      lineStyle: { width: 2.5, color: palette[0] },
      itemStyle: { color: palette[0] },
    },
    {
      name: "Faturamento assessorado",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 6,
      data: [18_400_000, 20_100_000, 23_800_000, 26_200_000, 29_500_000, 33_100_000],
      lineStyle: { width: 2.5, color: palette[8] },
      itemStyle: { color: palette[8] },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 8, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  yAxis: [
    { type: "value", name: "Empresas", position: "left", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
    { type: "value", name: "Faturamento (R$)", position: "right", splitLine: { show: false }, axisLabel: { formatter: (v: number) => formatarNumero(v / 1000000, 1) + " mi" } },
  ],
  series: [
    { name: "Empresas atendidas", type: "line", smooth: true, symbolSize: 6, data: [420, 468, 512, 560, 604, 662], lineStyle: { width: 2.5, color: palette[0] }, itemStyle: { color: palette[0] } },
    { name: "Faturamento assessorado", type: "line", yAxisIndex: 1, smooth: true, symbolSize: 6, data: [18400000, 20100000, 23800000, 26200000, 29500000, 33100000], lineStyle: { width: 2.5, color: palette[8] }, itemStyle: { color: palette[8] } },
  ],
};

export function EmpresasVersusFaturamentoChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Duas linhas em eixos Y independentes: empresas atendidas sobe de 420 para 662 no eixo esquerdo, e faturamento assessorado sobe de 18,4 para 33,1 milhões de reais no eixo direito."
    />
  );
}`;

export const linhaMultieixo: ChartPreset = {
  id: "linha-multieixo",
  nome: "Duas Séries em Eixos Independentes",
  categoria: "linhas",
  descricao:
    "Séries com escalas muito diferentes (contagem de empresas e faturamento em milhões) em eixos Y próprios, com tooltip por unidade.",
  tags: ["linhas", "multieixo", "escalas diferentes", "faturamento"],
  option,
  codigoReact,
  quandoUsar: [
    "Duas medidas relacionadas cujas escalas diferem em ordens de magnitude",
    "Mostrar que volume e valor caminham juntos (ou não) no mesmo período",
    "Painéis executivos com uma medida de esforço e uma de resultado",
  ],
  quandoNaoUsar: [
    "Quando as unidades são iguais — um único eixo evita distorção",
    "Mais de duas medidas, o que torna a leitura arbitrária",
    "Quando o cruzamento das linhas pode ser lido como equivalência entre valores",
  ],
  acessibilidade: [
    "Nomeie cada eixo com sua unidade e mantenha a posição (esquerda/direita) estável",
    "Formate cada série na unidade correta no tooltip (número e moeda em pt-BR)",
    "Explique no ariaLabel que os eixos são independentes e cite os intervalos de cada série",
  ],
  ariaLabel:
    "Duas linhas em eixos Y independentes: empresas atendidas sobe de 420 para 662 no eixo esquerdo, e faturamento assessorado sobe de 18,4 para 33,1 milhões de reais no eixo direito.",
  altura: 340,
};

export default linhaMultieixo;
