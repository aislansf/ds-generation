import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPaletteEstendida();

/** Anel interno: eixos estratégicos. */
export const eixos = [
  { name: "Competitividade", value: 5200 },
  { name: "Inovação", value: 3100 },
  { name: "Formalização", value: 2400 },
];

/** Anel externo: programas dentro de cada eixo. */
export const programas = [
  { name: "Empreender Mais", value: 2900 },
  { name: "Visita Técnica", value: 2300 },
  { name: "Programa Inova", value: 1800 },
  { name: "AGI", value: 1300 },
  { name: "Empreender", value: 1400 },
  { name: "MEI Regular", value: 1000 },
];

export const option: EChartsOption = {
  tooltip: { trigger: "item", valueFormatter: (v) => `${formatarNumero(v as number)} atendimentos` },
  legend: { bottom: 0, left: "center", icon: "circle", textStyle: { fontSize: 11 } },
  series: [
    {
      name: "Eixo estratégico",
      type: "pie",
      radius: ["0%", "42%"],
      center: ["50%", "44%"],
      label: { position: "inner", fontSize: 10, color: readToken("--primary-foreground"), formatter: "{b}" },
      labelLine: { show: false },
      emphasis: { focus: "self" },
      data: eixos.map((d, i) => ({ ...d, itemStyle: { color: palette[i] } })),
    },
    {
      name: "Programa",
      type: "pie",
      radius: ["52%", "74%"],
      center: ["50%", "44%"],
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: { fontSize: 10, formatter: "{b}\n{d}%" },
      labelLine: { length: 8, length2: 8 },
      emphasis: { focus: "self" },
      data: programas.map((d, i) => ({ ...d, itemStyle: { color: palette[3 + i] } })),
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPaletteEstendida, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPaletteEstendida();
const eixos = [
  { name: "Competitividade", value: 5200 },
  { name: "Inovação", value: 3100 },
  { name: "Formalização", value: 2400 },
];
const programas = [
  { name: "Empreender Mais", value: 2900 },
  { name: "Visita Técnica", value: 2300 },
  { name: "Programa Inova", value: 1800 },
  { name: "AGI", value: 1300 },
  { name: "Empreender", value: 1400 },
  { name: "MEI Regular", value: 1000 },
];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { bottom: 0, left: "center", icon: "circle" },
  series: [
    {
      name: "Eixo estratégico", type: "pie", radius: ["0%", "42%"], center: ["50%", "44%"],
      label: { position: "inner", formatter: "{b}" }, labelLine: { show: false },
      data: eixos.map((d, i) => ({ ...d, itemStyle: { color: palette[i] } })),
    },
    {
      name: "Programa", type: "pie", radius: ["52%", "74%"], center: ["50%", "44%"],
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: { formatter: "{b}\\n{d}%" },
      data: programas.map((d, i) => ({ ...d, itemStyle: { color: palette[3 + i] } })),
    },
  ],
};

export function EixosProgramasChart() {
  return (
    <BrandChart
      option={option}
      height={400}
      ariaLabel="Dois anéis concêntricos: eixos estratégicos no anel interno e programas no anel externo."
    />
  );
}`;

export const pizzaMultiplasSeries: ChartPreset = {
  id: "pizza-multiplas-series",
  nome: "Rosca de Duas Séries",
  categoria: "proporcao",
  descricao:
    "Dois anéis concêntricos: eixo estratégico no anel interno e programas no anel externo, usando a paleta estendida.",
  tags: ["pizza", "anéis concêntricos", "hierarquia", "paleta estendida"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar um total em dois níveis de agregação",
    "Relação entre eixo estratégico e programas que o compõem",
    "Até 3 categorias internas e até 8 externas",
  ],
  quandoNaoUsar: [
    "Mais de dois níveis — prefira sunburst",
    "Quando os níveis não somam o mesmo total",
    "Leitura precisa de valores absolutos",
  ],
  acessibilidade: [
    "Rótulos escritos nos dois anéis, com percentual no externo",
    "Legenda cobre todas as fatias dos dois níveis",
    "Bordas na cor do card garantem separação também em dark",
  ],
  ariaLabel:
    "Rosca de duas séries: anel interno com os eixos Competitividade 5.200, Inovação 3.100 e Formalização 2.400; anel externo com seis programas, liderados por Empreender Mais com 2.900 atendimentos.",
  altura: 400,
};

export default pizzaMultiplasSeries;
