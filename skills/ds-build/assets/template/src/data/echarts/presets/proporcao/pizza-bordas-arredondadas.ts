import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const dados = [
  { name: "Comércio", value: 4820 },
  { name: "Serviços", value: 4210 },
  { name: "Indústria", value: 1680 },
  { name: "Agronegócio", value: 1240 },
  { name: "Turismo", value: 860 },
];

const total = dados.reduce((s, d) => s + d.value, 0);

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const item = p as { name: string; value: number };
      return `<strong>${item.name}</strong><br/>${formatarNumero(item.value)} empresas<br/>${formatarPercentual((item.value / total) * 100)}`;
    },
  },
  legend: { bottom: 0, left: "center", icon: "circle" },
  series: [
    {
      name: "Empresas atendidas por setor",
      type: "pie",
      radius: ["48%", "74%"],
      center: ["50%", "46%"],
      avoidLabelOverlap: true,
      padAngle: 2,
      itemStyle: {
        borderRadius: 10,
        borderColor: readToken("--card"),
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: (p) => `${p.name}\n${formatarPercentual(p.percent as number)}`,
        fontSize: 11,
        color: readToken("--foreground"),
      },
      labelLine: { length: 10, length2: 10 },
      emphasis: { focus: "self", scaleSize: 6 },
      data: dados.map((d, i) => ({ ...d, itemStyle: { color: palette[i] } })),
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();
const dados = [
  { name: "Comércio", value: 4820 },
  { name: "Serviços", value: 4210 },
  { name: "Indústria", value: 1680 },
  { name: "Agronegócio", value: 1240 },
  { name: "Turismo", value: 860 },
];

const option: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { bottom: 0, left: "center", icon: "circle" },
  series: [{
    name: "Empresas atendidas por setor",
    type: "pie",
    radius: ["48%", "74%"],
    padAngle: 2,
    itemStyle: { borderRadius: 10, borderColor: readToken("--card"), borderWidth: 2 },
    label: { show: true, formatter: (p) => p.name + "\\n" + formatarPercentual(p.percent as number) },
    emphasis: { focus: "self", scaleSize: 6 },
    data: dados.map((d, i) => ({ ...d, itemStyle: { color: palette[i] } })),
  }],
};

export function SetoresDonutChart() {
  return (
    <BrandChart
      option={option}
      height={360}
      ariaLabel="Rosca de empresas atendidas por setor com bordas arredondadas."
    />
  );
}`;

export const pizzaBordasArredondadas: ChartPreset = {
  id: "pizza-bordas-arredondadas",
  nome: "Rosca com Bordas Arredondadas",
  categoria: "proporcao",
  descricao:
    "Donut com itemStyle.borderRadius, padAngle e borda na cor do card, separando visualmente cada fatia.",
  tags: ["rosca", "borderRadius", "donut", "setores"],
  option,
  codigoReact,
  quandoUsar: [
    "Composição de um total com até 6 fatias",
    "Painéis com estética suave e cartões arredondados",
    "Quando o percentual por fatia é a informação principal",
  ],
  quandoNaoUsar: [
    "Mais de 6 categorias — prefira barras horizontais",
    "Comparação precisa entre fatias de tamanho próximo",
    "Séries temporais",
  ],
  acessibilidade: [
    "Rótulo com nome e percentual em cada fatia",
    "Legenda inferior reforça a associação nome/cor",
    "Borda usa o token do card e funciona em light e dark",
  ],
  ariaLabel:
    "Rosca de empresas atendidas por setor: Comércio 4.820, Serviços 4.210, Indústria 1.680, Agronegócio 1.240 e Turismo 860. Comércio e Serviços somam mais de dois terços do total.",
  altura: 360,
};

export default pizzaBordasArredondadas;
