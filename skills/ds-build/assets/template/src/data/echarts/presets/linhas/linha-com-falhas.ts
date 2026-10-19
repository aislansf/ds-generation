import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const comFalhas: (number | null)[] = [420, 448, null, null, 512, 540, 566, null, 610, 634, 658, 690];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    valueFormatter: (v) => (v === null || v === undefined ? "Sem dado" : formatarNumero(v as number)),
  },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: meses },
  yAxis: {
    type: "value",
    name: "Atendimentos",
    axisLabel: { formatter: (v: number) => formatarNumero(v) },
  },
  series: [
    {
      name: "Sem connectNulls (lacuna visível)",
      type: "line",
      connectNulls: false,
      data: comFalhas,
      lineStyle: { width: 2.5, color: palette[0] },
      itemStyle: { color: palette[0] },
    },
    {
      name: "Com connectNulls (interpolado)",
      type: "line",
      connectNulls: true,
      data: comFalhas,
      lineStyle: { width: 1.5, color: readToken("--muted-foreground"), type: "dotted" },
      itemStyle: { color: readToken("--muted-foreground") },
      symbol: "none",
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const palette = getBrandPalette();
const comFalhas: (number | null)[] = [420, 448, null, null, 512, 540, 566, null, 610, 634, 658, 690];

const option: EChartsOption = {
  tooltip: { trigger: "axis", valueFormatter: (v) => (v === null || v === undefined ? "Sem dado" : formatarNumero(v as number)) },
  legend: { top: 0, left: "left" },
  grid: { left: 8, right: 16, top: 44, bottom: 8, containLabel: true },
  xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] },
  yAxis: { type: "value", name: "Atendimentos", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
  series: [
    { name: "Sem connectNulls (lacuna visível)", type: "line", connectNulls: false, data: comFalhas, lineStyle: { width: 2.5, color: palette[0] }, itemStyle: { color: palette[0] } },
    { name: "Com connectNulls (interpolado)", type: "line", connectNulls: true, data: comFalhas, symbol: "none", lineStyle: { width: 1.5, color: readToken("--muted-foreground"), type: "dotted" }, itemStyle: { color: readToken("--muted-foreground") } },
  ],
};

export function SerieComFalhasChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Série mensal de atendimentos com dados ausentes em março, abril e agosto. A linha cheia interrompe nas lacunas e a linha pontilhada mostra a mesma série com interpolação por connectNulls."
    />
  );
}`;

export const linhaComFalhas: ChartPreset = {
  id: "linha-com-falhas",
  nome: "Série com Dados Ausentes",
  categoria: "linhas",
  descricao:
    "Demonstra o efeito de connectNulls: a mesma série exibida com a lacuna preservada e com interpolação, além de tooltip que informa 'Sem dado'.",
  tags: ["linhas", "dados ausentes", "connectNulls", "qualidade de dados"],
  option,
  codigoReact,
  quandoUsar: [
    "Séries com coleta incompleta, em que esconder a falha seria enganoso",
    "Painéis de qualidade de dados e monitoramento de integrações",
    "Quando é preciso deixar claro o que é dado real e o que é estimativa",
  ],
  quandoNaoUsar: [
    "Séries completas — a segunda série de apoio só adiciona ruído",
    "Quando a lacuna é sistemática e o correto é agregar em outro período",
    "Interpolar silenciosamente com connectNulls sem sinalizar ao usuário",
  ],
  acessibilidade: [
    "Nunca oculte a ausência de dado: identifique-a no tooltip como 'Sem dado'",
    "Diferencie a série interpolada por traço pontilhado, além da cor",
    "Informe no ariaLabel exatamente quais períodos não têm dado",
  ],
  ariaLabel:
    "Série mensal de atendimentos com dados ausentes em março, abril e agosto. A linha cheia interrompe nas lacunas e a linha pontilhada mostra a mesma série com interpolação por connectNulls.",
  altura: 340,
};

export default linhaComFalhas;
