import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const municipios: [string, number][] = [
  ["Porto Central", 8450],
  ["Lagoa Azul", 3120],
  ["Nova Esperança", 2980],
  ["Vila Nova", 2410],
  ["Serra Alta", 2310],
  ["Bom Retiro", 1870],
  ["Monte Claro", 1520],
  ["Rio Verde", 1440],
  ["Praia Mansa", 1180],
  ["Campo Alegre", 1120],
  ["Santa Rita", 980],
  ["Cachoeira Alta", 910],
  ["Alto Bonito", 720],
  ["São Bento", 690],
  ["Barra Grande", 610],
];

const ordenados = [...municipios].sort((a, b) => b[1] - a[1]);

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v) => formatarNumero(v as number),
  },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 56, containLabel: true },
  dataZoom: [
    { type: "slider", start: 0, end: 60, height: 18, bottom: 8 },
    { type: "inside", start: 0, end: 60 },
  ],
  xAxis: {
    type: "category",
    data: ordenados.map((m) => m[0]),
    axisLabel: { rotate: 35, hideOverlap: true, fontSize: 11 },
  },
  yAxis: {
    type: "value",
    name: "Atendimentos",
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    {
      name: "Atendimentos",
      type: "bar",
      data: ordenados.map((m) => m[1]),
      itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const municipios: [string, number][] = [
  ["Porto Central", 8450], ["Lagoa Azul", 3120], ["Nova Esperança", 2980], ["Vila Nova", 2410],
  ["Serra Alta", 2310], ["Bom Retiro", 1870], ["Monte Claro", 1520], ["Rio Verde", 1440], ["Praia Mansa", 1180],
  ["Campo Alegre", 1120], ["Santa Rita", 980], ["Cachoeira Alta", 910], ["Alto Bonito", 720], ["São Bento", 690], ["Barra Grande", 610],
];
const ordenados = [...municipios].sort((a, b) => b[1] - a[1]);

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => formatarNumero(v as number) },
  legend: { show: false },
  grid: { left: 8, right: 16, top: 24, bottom: 56, containLabel: true },
  dataZoom: [
    { type: "slider", start: 0, end: 60, height: 18, bottom: 8 },
    { type: "inside", start: 0, end: 60 },
  ],
  xAxis: { type: "category", data: ordenados.map((m) => m[0]), axisLabel: { rotate: 35, hideOverlap: true, fontSize: 11 } },
  yAxis: { type: "value", name: "Atendimentos", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [{ name: "Atendimentos", type: "bar", data: ordenados.map((m) => m[1]), itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] } }],
};

export function AtendimentosPorMunicipioChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Colunas de atendimentos por município em ordem decrescente, com controle de zoom horizontal. Porto Central lidera com 8.450 e Barra Grande fecha a lista com 610 atendimentos."
    />
  );
}`;

export const barrasOrdenadasDinamicas: ChartPreset = {
  id: "barras-ordenadas-dinamicas",
  nome: "Barras Ordenadas com Zoom",
  categoria: "barras",
  descricao:
    "Muitas categorias ordenadas de forma decrescente, com dataZoom horizontal (slider e inside) e rótulos rotacionados.",
  tags: ["barras", "ordenação", "dataZoom", "muitas categorias"],
  option,
  codigoReact,
  quandoUsar: [
    "Séries com dezenas de categorias, como municípios ou unidades de atendimento",
    "Quando o usuário precisa navegar entre o topo e a cauda do ranking",
    "Quando a ordenação decrescente já responde à pergunta do painel",
  ],
  quandoNaoUsar: [
    "Poucas categorias — o dataZoom só adiciona ruído de interface",
    "Categorias com ordem natural fixa (meses, faixas de faturamento)",
    "Exportação estática para PDF, onde o zoom não pode ser acionado",
  ],
  acessibilidade: [
    "Mantenha o dataZoom inside habilitado junto ao slider, para navegação por teclado e roda do mouse",
    "Rotacione o rótulo com hideOverlap para nunca sobrepor texto",
    "Cite no ariaLabel o extremo superior e inferior do ranking",
  ],
  ariaLabel:
    "Colunas de atendimentos por município em ordem decrescente, com controle de zoom horizontal. Porto Central lidera com 8.450 e Barra Grande fecha a lista com 610 atendimentos.",
  altura: 360,
};

export default barrasOrdenadasDinamicas;
