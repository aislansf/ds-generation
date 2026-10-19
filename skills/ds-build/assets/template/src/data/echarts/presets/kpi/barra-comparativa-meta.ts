import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

export const programas = ["Empreender", "AGI", "Programa Inova", "Visita Técnica", "Empreender Mais"];
export const realizado = [880, 1240, 720, 1980, 540];
export const meta = [900, 1100, 800, 1800, 700];

const atingimento = realizado.map((v, i) => (v / meta[i]) * 100);

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; dataIndex: number }[])[0];
      const i = p.dataIndex;
      return `<strong>${p.name}</strong><br/>Realizado: ${formatarNumero(realizado[i])}<br/>Meta: ${formatarNumero(meta[i])}<br/>Atingimento: ${formatarPercentual(atingimento[i])}`;
    },
  },
  legend: { top: 0, left: "left", data: ["Meta", "Realizado"] },
  grid: { left: 8, right: 96, top: 48, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "Atendimentos" },
  yAxis: { type: "category", data: [...programas].reverse(), axisLabel: { fontSize: 11 } },
  series: [
    {
      name: "Meta",
      type: "bar",
      barWidth: 24,
      barGap: "-100%",
      z: 1,
      itemStyle: { color: readToken("--muted-foreground", 0.2), borderRadius: 4 },
      emphasis: { focus: "series" },
      data: [...meta].reverse(),
    },
    {
      name: "Realizado",
      type: "bar",
      barWidth: 12,
      barGap: "-100%",
      z: 2,
      data: [...realizado]
        .reverse()
        .map((v, idx) => {
          const i = realizado.length - 1 - idx;
          return {
            value: v,
            itemStyle: {
              color: v >= meta[i] ? readToken("--success") : readToken("--warning"),
              borderRadius: 4,
            },
          };
        }),
      emphasis: { focus: "series" },
      label: {
        show: true,
        position: "right",
        fontSize: 11,
        color: readToken("--foreground"),
        formatter: (p) => formatarPercentual(atingimento[realizado.length - 1 - p.dataIndex]),
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const programas = ["Empreender", "AGI", "Programa Inova", "Visita Técnica", "Empreender Mais"];
const realizado = [880, 1240, 720, 1980, 540];
const meta = [900, 1100, 800, 1800, 700];
const atingimento = realizado.map((v, i) => (v / meta[i]) * 100);

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  legend: { top: 0, left: "left", data: ["Meta", "Realizado"] },
  xAxis: { type: "value", name: "Atendimentos" },
  yAxis: { type: "category", data: [...programas].reverse() },
  series: [
    {
      name: "Meta", type: "bar", barWidth: 24, barGap: "-100%", z: 1,
      itemStyle: { color: readToken("--muted-foreground", 0.2), borderRadius: 4 },
      data: [...meta].reverse(),
    },
    {
      name: "Realizado", type: "bar", barWidth: 12, barGap: "-100%", z: 2,
      data: [...realizado].reverse().map((v, idx) => {
        const i = realizado.length - 1 - idx;
        return { value: v, itemStyle: { color: v >= meta[i] ? readToken("--success") : readToken("--warning"), borderRadius: 4 } };
      }),
      label: {
        show: true, position: "right",
        formatter: (p) => formatarPercentual(atingimento[realizado.length - 1 - p.dataIndex]),
      },
    },
  ],
};

export function MetaProgramasChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Barras horizontais de realizado sobre trilha de meta por programa, com rótulo de atingimento percentual."
    />
  );
}`;

export const barraComparativaMeta: ChartPreset = {
  id: "barra-comparativa-meta",
  nome: "Barra Comparativa de Meta",
  categoria: "kpi",
  descricao:
    "Barras horizontais de realizado sobrepostas à trilha da meta de cada programa, com rótulo de atingimento percentual.",
  tags: ["meta", "bullet", "atingimento", "sobreposição"],
  option,
  codigoReact,
  quandoUsar: [
    "Metas diferentes por unidade ou programa",
    "Painéis de acompanhamento com leitura de folga ou déficit",
    "Até 8 categorias",
  ],
  quandoNaoUsar: [
    "Meta única para todas as categorias — prefira markLine",
    "Séries temporais",
    "Quando não há meta definida",
  ],
  acessibilidade: [
    "Percentual de atingimento escrito ao lado de cada barra",
    "Trilha da meta em tom neutro, com legenda nomeando as duas séries",
    "Tooltip informa realizado, meta e atingimento em pt-BR",
  ],
  ariaLabel:
    "Barras horizontais de realizado sobre a meta por programa. AGI atinge 112,7% e Visita Técnica 110%, acima da meta; Empreender fica em 97,8%, Programa Inova em 90% e Empreender Mais em 77,1%.",
  altura: 320,
};

export default barraComparativaMeta;
