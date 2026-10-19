import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const trimestres = ["1º tri", "2º tri", "3º tri", "4º tri"];
export const presencial = [1240, 1380, 1460, 1590];
export const remoto = [860, 940, 1080, 1210];
export const hibrido = [420, 480, 520, 610];

const totais = trimestres.map((_, i) => presencial[i] + remoto[i] + hibrido[i]);

export const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 64, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: trimestres },
  yAxis: { type: "value", name: "Atendimentos", max: 1800 },
  series: [
    { name: "Presencial", type: "bar", barGap: "10%", barMaxWidth: 28, itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] }, emphasis: { focus: "series" }, data: presencial },
    { name: "Remoto", type: "bar", barMaxWidth: 28, itemStyle: { color: palette[1], borderRadius: [4, 4, 0, 0] }, emphasis: { focus: "series" }, data: remoto },
    {
      name: "Híbrido",
      type: "bar",
      barMaxWidth: 28,
      itemStyle: { color: palette[2], borderRadius: [4, 4, 0, 0] },
      emphasis: { focus: "series" },
      data: hibrido,
      // Rótulo de total do grupo, ancorado na última série
      labelLayout: { dy: -6 },
      label: {
        show: true,
        position: "top",
        offset: [-32, -16],
        fontSize: 11,
        fontWeight: "bold",
        color: readToken("--foreground"),
        formatter: (p) => `Total ${formatarNumero(totais[p.dataIndex])}`,
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const trimestres = ["1º tri", "2º tri", "3º tri", "4º tri"];
const presencial = [1240, 1380, 1460, 1590];
const remoto = [860, 940, 1080, 1210];
const hibrido = [420, 480, 520, 610];
const totais = trimestres.map((_, i) => presencial[i] + remoto[i] + hibrido[i]);

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => formatarNumero(v as number) },
  legend: { top: 0, left: "left" },
  xAxis: { type: "category", data: trimestres },
  yAxis: { type: "value", name: "Atendimentos", max: 1800 },
  series: [
    { name: "Presencial", type: "bar", barMaxWidth: 28, itemStyle: { color: palette[0] }, data: presencial },
    { name: "Remoto", type: "bar", barMaxWidth: 28, itemStyle: { color: palette[1] }, data: remoto },
    {
      name: "Híbrido", type: "bar", barMaxWidth: 28, itemStyle: { color: palette[2] }, data: hibrido,
      label: {
        show: true, position: "top", offset: [-32, -16], fontWeight: "bold",
        color: readToken("--foreground"),
        formatter: (p) => "Total " + formatarNumero(totais[p.dataIndex]),
      },
    },
  ],
};

export function AtendimentosModalidadeChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Barras agrupadas de atendimentos por modalidade e trimestre, com rótulo de total acima de cada grupo."
    />
  );
}`;

export const barrasAgrupadasRotuloTotal: ChartPreset = {
  id: "barras-agrupadas-rotulo-total",
  nome: "Barras Agrupadas com Total",
  categoria: "barras",
  descricao:
    "Barras agrupadas por modalidade de atendimento com rótulo de total acima de cada grupo de trimestre.",
  tags: ["agrupado", "total", "rótulo", "trimestre"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar categorias dentro do grupo e ainda mostrar o total do grupo",
    "Fechamentos trimestrais e comparativos por modalidade",
    "Até 4 séries e até 6 grupos",
  ],
  quandoNaoUsar: [
    "Muitas séries por grupo: a leitura do total se perde",
    "Quando só o total importa — prefira barras simples",
    "Quando a composição percentual é o foco — prefira empilhadas 100%",
  ],
  acessibilidade: [
    "Legenda identifica cada modalidade além da cor",
    "Total do grupo escrito em texto, não inferido visualmente",
    "Tooltip por eixo lista as três modalidades do trimestre",
  ],
  ariaLabel:
    "Barras agrupadas de atendimentos por modalidade em 2025. O total sobe de 2.520 no primeiro trimestre para 3.410 no quarto, com presencial sempre à frente de remoto e híbrido.",
  altura: 340,
};

export default barrasAgrupadasRotuloTotal;
