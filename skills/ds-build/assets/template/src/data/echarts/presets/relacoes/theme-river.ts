import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const meses = [
  "2025-01-01", "2025-02-01", "2025-03-01", "2025-04-01", "2025-05-01", "2025-06-01",
  "2025-07-01", "2025-08-01", "2025-09-01", "2025-10-01", "2025-11-01", "2025-12-01",
];

const series: Record<string, number[]> = {
  Empreender: [120, 132, 128, 145, 160, 158, 172, 180, 168, 190, 205, 150],
  AGI: [96, 104, 118, 126, 140, 152, 148, 160, 155, 170, 182, 130],
  "Programa Inova": [64, 72, 80, 76, 94, 108, 112, 120, 118, 126, 138, 100],
  "Visita Técnica": [180, 190, 176, 205, 220, 214, 232, 245, 238, 250, 268, 195],
  "Empreender Mais": [48, 52, 60, 58, 66, 72, 78, 84, 80, 90, 98, 70],
};

/** [data, valor, nome da série] */
export const dados: [string, number, string][] = Object.entries(series).flatMap(([nome, valores]) =>
  valores.map((v, i) => [meses[i], v, nome] as [string, number, string]),
);

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "line", lineStyle: { color: readToken("--border"), width: 1 } },
    valueFormatter: (v) => formatarNumero(v as number),
  },
  legend: { top: 0, left: "left", data: Object.keys(series) },
  color: palette,
  singleAxis: {
    top: 56,
    bottom: 24,
    left: 8,
    right: 16,
    type: "time",
    axisLabel: {
      color: readToken("--muted-foreground"),
      fontSize: 11,
      formatter: (valor: number) => {
        const d = new Date(valor);
        const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return nomes[d.getUTCMonth()];
      },
    },
    axisTick: { lineStyle: { color: readToken("--border") } },
    axisLine: { lineStyle: { color: readToken("--border") } },
  },
  series: [
    {
      type: "themeRiver",
      data: dados,
      emphasis: { focus: "series", itemStyle: { shadowBlur: 12, shadowColor: readToken("--primary", 0.35) } },
      label: { show: false },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const meses = ["2025-01-01", "2025-02-01", "2025-03-01", "2025-04-01", "2025-05-01", "2025-06-01"];
const series: Record<string, number[]> = {
  Empreender: [120, 132, 128, 145, 160, 158],
  AGI: [96, 104, 118, 126, 140, 152],
  "Programa Inova": [64, 72, 80, 76, 94, 108],
  "Visita Técnica": [180, 190, 176, 205, 220, 214],
};
const dados = Object.entries(series).flatMap(([nome, valores]) => valores.map((v, i) => [meses[i], v, nome]));

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left", data: Object.keys(series) },
  color: palette,
  singleAxis: {
    top: 56, bottom: 24, left: 8, right: 16, type: "time",
    axisLabel: { color: readToken("--muted-foreground"), fontSize: 11 },
  },
  series: [{ type: "themeRiver", data: dados, emphasis: { focus: "series" }, label: { show: false } }],
};

export function ParticipacaoThemeRiverChart() {
  return (
    <BrandChart
      option={option}
      height={380}
      ariaLabel="Theme river da evolução mensal dos atendimentos por programa em 2025. Visita Técnica mantém a maior faixa em todos os meses, com pico em novembro, e todos os programas caem em dezembro."
    />
  );
}`;

export const themeRiver: ChartPreset = {
  id: "theme-river",
  nome: "Theme River",
  categoria: "relacoes",
  descricao:
    "Evolução da participação de cada programa ao longo de 12 meses em fluxo contínuo centralizado.",
  tags: ["themeRiver", "fluxo", "evolução", "participação"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar como a composição de um total muda no tempo de forma orgânica",
    "Narrativas visuais sobre ganho e perda de participação",
    "Muitos períodos com poucas séries",
  ],
  quandoNaoUsar: [
    "Leitura precisa de valores por período — prefira áreas empilhadas ou barras",
    "Poucos períodos (menos de 6)",
    "Séries com valores nulos ou negativos",
  ],
  acessibilidade: [
    "Legenda obrigatória: a única distinção entre faixas é a cor",
    "Tooltip com todos os valores do período formatados em pt-BR",
    "Ofereça tabela período x programa como alternativa",
  ],
  ariaLabel:
    "Theme river da evolução mensal dos atendimentos por programa em 2025. Visita Técnica mantém a maior faixa em todos os meses, com pico em novembro, e todos os programas caem em dezembro.",
  altura: 380,
};

export default themeRiver;
