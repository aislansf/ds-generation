import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

export const regioes = ["Porto Central", "Litoral Leste", "Vale do Sul", "Serra Alta", "Região Central", "Planalto Oeste"];
export const realizado = [1420, 1180, 980, 860, 720, 540];
export const META = 900;

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return `<strong>${p.name}</strong><br/>Realizado: ${formatarNumero(p.value)}<br/>Meta: ${formatarNumero(META)}<br/>Atingimento: ${formatarPercentual((p.value / META) * 100)}`;
    },
  },
  legend: { show: false },
  grid: { left: 8, right: 64, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "MEIs formalizados" },
  yAxis: { type: "category", data: [...regioes].reverse(), axisLabel: { fontSize: 11 } },
  series: [
    {
      name: "Realizado vs. meta",
      type: "bar",
      barWidth: 18,
      data: [...realizado].reverse().map((v) => ({
        value: v,
        itemStyle: {
          color: v >= META ? readToken("--success") : readToken("--error"),
          borderRadius: [0, 4, 4, 0],
        },
      })),
      label: {
        show: true,
        position: "right",
        fontSize: 11,
        color: readToken("--foreground"),
        formatter: (p) => formatarNumero(p.value as number),
      },
      markLine: {
        symbol: "none",
        silent: true,
        label: {
          formatter: `Meta ${formatarNumero(META)}`,
          position: "end",
          color: readToken("--muted-foreground"),
          fontSize: 11,
        },
        lineStyle: { color: readToken("--foreground"), type: "dashed", width: 1.5 },
        data: [{ xAxis: META }],
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const regioes = ["Porto Central", "Litoral Leste", "Vale do Sul", "Serra Alta", "Região Central", "Planalto Oeste"];
const realizado = [1420, 1180, 980, 860, 720, 540];
const META = 900;

const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return "<strong>" + p.name + "</strong><br/>Realizado: " + formatarNumero(p.value) +
        "<br/>Meta: " + formatarNumero(META) + "<br/>Atingimento: " + formatarPercentual((p.value / META) * 100);
    },
  },
  grid: { left: 8, right: 64, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "MEIs formalizados" },
  yAxis: { type: "category", data: [...regioes].reverse(), axisLabel: { fontSize: 11 } },
  series: [{
    name: "Realizado vs. meta",
    type: "bar",
    barWidth: 18,
    data: [...realizado].reverse().map((v) => ({
      value: v,
      itemStyle: { color: v >= META ? readToken("--success") : readToken("--error"), borderRadius: [0, 4, 4, 0] },
    })),
    label: { show: true, position: "right", fontSize: 11, color: readToken("--foreground"), formatter: (p) => formatarNumero(p.value as number) },
    markLine: {
      symbol: "none", silent: true,
      label: { formatter: "Meta " + formatarNumero(META), position: "end", fontSize: 11 },
      lineStyle: { color: readToken("--foreground"), type: "dashed", width: 1.5 },
      data: [{ xAxis: META }],
    },
  }],
};

export function MeisMetaChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Barras horizontais de MEIs formalizados por macrorregião com linha de meta em 900. Porto Central, Litoral Leste, Vale do Sul e Serra Alta atingiram a meta; Região Central com 720 e Planalto Oeste com 540 ficaram abaixo."
    />
  );
}`;

export const barraMeta: ChartPreset = {
  id: "barra-meta",
  nome: "Barra com Meta",
  categoria: "kpi",
  descricao:
    "Barras horizontais de realizado por região com markLine de meta e cor condicional (sucesso acima, erro abaixo).",
  tags: ["meta", "markLine", "cor condicional", "ranking"],
  option,
  codigoReact,
  quandoUsar: [
    "Acompanhar realizado contra uma meta comum a várias unidades",
    "Rankings em que atingir ou não a meta é a informação principal",
    "Painéis operacionais de acompanhamento mensal",
  ],
  quandoNaoUsar: [
    "Metas diferentes por unidade sem normalizar em percentual",
    "Séries temporais — prefira linha com markLine",
    "Muitas categorias sem paginação ou dataZoom",
  ],
  acessibilidade: [
    "Rótulo numérico em cada barra: a cor condicional é reforço, não único canal",
    "Tooltip informa realizado, meta e percentual de atingimento",
    "Cores vêm dos tokens success e error, aprovados em contraste AA",
  ],
  ariaLabel:
    "Barras horizontais de MEIs formalizados por macrorregião com linha de meta em 900. Porto Central, Litoral Leste, Vale do Sul e Serra Alta atingiram a meta; Região Central com 720 e Planalto Oeste com 540 ficaram abaixo.",
  altura: 320,
};

export default barraMeta;
