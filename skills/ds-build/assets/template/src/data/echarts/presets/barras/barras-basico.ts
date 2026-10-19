import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  dataZoom: [{ type: "inside", disabled: true }],
  xAxis: {
    type: "category",
    data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  },
  yAxis: { type: "value", name: "Atendimentos" },
  series: [
    { name: "Empreender", type: "bar", data: [120, 148, 132, 165, 178, 190], itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] } },
    { name: "AGI", type: "bar", data: [96, 104, 118, 126, 140, 152], itemStyle: { color: palette[1], borderRadius: [4, 4, 0, 0] } },
    { name: "Programa Inova", type: "bar", data: [64, 72, 80, 76, 94, 108], itemStyle: { color: palette[2], borderRadius: [4, 4, 0, 0] } },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  dataZoom: [{ type: "inside", disabled: true }],
  xAxis: { type: "category", data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  yAxis: { type: "value", name: "Atendimentos" },
  series: [
    { name: "Empreender", type: "bar", data: [120, 148, 132, 165, 178, 190], itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] } },
    { name: "AGI", type: "bar", data: [96, 104, 118, 126, 140, 152], itemStyle: { color: palette[1], borderRadius: [4, 4, 0, 0] } },
    { name: "Programa Inova", type: "bar", data: [64, 72, 80, 76, 94, 108], itemStyle: { color: palette[2], borderRadius: [4, 4, 0, 0] } },
  ],
};

export function AtendimentosPorProgramaChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Colunas agrupadas de atendimentos por mês nos programas Empreender, AGI e Programa Inova, de janeiro a junho, com crescimento em todos os programas."
    />
  );
}`;

export const barrasBasico: ChartPreset = {
  id: "barras-basico",
  nome: "Barras Básicas",
  categoria: "barras",
  descricao:
    "Colunas agrupadas comparando o volume de atendimentos de três programas ao longo dos meses.",
  tags: ["barras", "colunas agrupadas", "comparação", "séries múltiplas"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar valores absolutos entre categorias discretas (programas, regiões, unidades)",
    "Mostrar até 4 séries por categoria mantendo a leitura clara",
    "Quando a diferença entre valores precisa ser lida com precisão",
  ],
  quandoNaoUsar: [
    "Séries temporais longas e contínuas — prefira linhas",
    "Composição de um total (partes de um todo) — prefira barras empilhadas ou rosca",
    "Mais de 4 séries agrupadas: as colunas ficam estreitas e ilegíveis",
  ],
  acessibilidade: [
    "Informe um ariaLabel descrevendo o padrão dos dados, não só o tipo de gráfico",
    "Mantenha a legenda visível: a cor não é o único canal de informação",
    "Nomeie o eixo de valores com a unidade de medida (ex.: Atendimentos)",
  ],
  ariaLabel:
    "Colunas agrupadas de atendimentos por mês nos programas Empreender, AGI e Programa Inova, de janeiro a junho, com crescimento em todos os programas.",
  altura: 340,
};

export default barrasBasico;
