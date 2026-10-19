import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const programas = [
  { nome: "Empreender", valores: [88, 92, 76, 84, 71] },
  { nome: "AGI", valores: [74, 81, 88, 69, 78] },
  { nome: "Programa Inova", valores: [82, 68, 91, 77, 86] },
  { nome: "Visita Técnica", valores: [69, 87, 64, 92, 74] },
  { nome: "Empreender Mais", valores: [61, 72, 70, 66, 89] },
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { seriesName: string; value: number[] };
      const dims = ["Satisfação", "Adesão", "Inovação", "Alcance territorial", "Custo-efetividade"];
      const linhas = params.value.map((v, i) => `${dims[i]}: <strong>${formatarNumero(v)}</strong>`).join("<br/>");
      return `<strong>${params.seriesName}</strong><br/>${linhas}`;
    },
  },
  legend: { top: 0, left: "left" },
  parallel: { left: 48, right: 48, top: 56, bottom: 24 },
  parallelAxis: [
    { dim: 0, name: "Satisfação", min: 50, max: 100 },
    { dim: 1, name: "Adesão", min: 50, max: 100 },
    { dim: 2, name: "Inovação", min: 50, max: 100 },
    { dim: 3, name: "Alcance", min: 50, max: 100 },
    { dim: 4, name: "Custo-efet.", min: 50, max: 100 },
  ],
  series: programas.map((prog, i) => ({
    name: prog.nome,
    type: "parallel" as const,
    lineStyle: { width: 2, opacity: 0.85, color: palette[i] },
    emphasis: { lineStyle: { width: 4 } },
    smooth: true,
    data: [prog.valores],
  })),
};

(option.parallelAxis as { nameTextStyle?: unknown }[]).forEach((eixo) => {
  eixo.nameTextStyle = { color: readToken("--muted-foreground"), fontSize: 11 };
});

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const dims = ["Satisfação", "Adesão", "Inovação", "Alcance territorial", "Custo-efetividade"];
const programas = [
  { nome: "Empreender", valores: [88, 92, 76, 84, 71] },
  { nome: "AGI", valores: [74, 81, 88, 69, 78] },
  { nome: "Programa Inova", valores: [82, 68, 91, 77, 86] },
  { nome: "Visita Técnica", valores: [69, 87, 64, 92, 74] },
  { nome: "Empreender Mais", valores: [61, 72, 70, 66, 89] },
];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { seriesName: string; value: number[] };
      const linhas = params.value.map((v, i) => dims[i] + ": <strong>" + formatarNumero(v) + "</strong>").join("<br/>");
      return "<strong>" + params.seriesName + "</strong><br/>" + linhas;
    },
  },
  legend: { top: 0, left: "left" },
  parallel: { left: 48, right: 48, top: 56, bottom: 24 },
  parallelAxis: [
    { dim: 0, name: "Satisfação", min: 50, max: 100 },
    { dim: 1, name: "Adesão", min: 50, max: 100 },
    { dim: 2, name: "Inovação", min: 50, max: 100 },
    { dim: 3, name: "Alcance", min: 50, max: 100 },
    { dim: 4, name: "Custo-efet.", min: 50, max: 100 },
  ],
  series: programas.map((prog, i) => ({
    name: prog.nome,
    type: "parallel" as const,
    lineStyle: { width: 2, opacity: 0.85, color: palette[i] },
    smooth: true,
    data: [prog.valores],
  })),
};

export function AvaliacaoParalelaChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Coordenadas paralelas com cinco dimensões de avaliação de cinco programas. Empreender lidera satisfação e adesão, Programa Inova lidera inovação e Visita Técnica lidera alcance territorial."
    />
  );
}`;

export const coordenadasParalelas: ChartPreset = {
  id: "coordenadas-paralelas",
  nome: "Coordenadas Paralelas",
  categoria: "distribuicao",
  descricao:
    "Cinco dimensões de avaliação (satisfação, adesão, inovação, alcance e custo-efetividade) comparadas entre os programas.",
  tags: ["parallel", "multidimensional", "avaliação", "comparação"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar poucos itens em muitas dimensões numéricas na mesma escala",
    "Encontrar perfis e trade-offs entre indicadores",
    "Análises de portfólio e priorização",
  ],
  quandoNaoUsar: [
    "Muitas séries (acima de ~8): as linhas se embaralham",
    "Dimensões com escalas incomparáveis sem normalização",
    "Apresentações para público amplo sem explicação de leitura",
  ],
  acessibilidade: [
    "Mantenha legenda e destaque por foco ao passar o mouse ou navegar por teclado",
    "Tooltip lista todas as dimensões nomeadas do item",
    "Ofereça tabela com uma linha por programa e uma coluna por dimensão",
  ],
  ariaLabel:
    "Coordenadas paralelas com cinco dimensões de avaliação de cinco programas. Empreender lidera satisfação e adesão, Programa Inova lidera inovação e Visita Técnica lidera alcance territorial.",
  altura: 380,
};

export default coordenadasParalelas;
