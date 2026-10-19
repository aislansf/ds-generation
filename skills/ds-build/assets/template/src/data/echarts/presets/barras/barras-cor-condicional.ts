import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

export const macrorregioes = [
  "Região Metropolitana",
  "Vale do Sul",
  "Serra Alta",
  "Região Central",
  "Litoral Leste",
  "Planalto Oeste",
  "Vale Claro",
];
export const atingimento = [118, 104, 100, 92, 86, 74, 108];

/** Regra: <95% erro, 95-105% atenção, >105% sucesso. */
function corPorValor(valor: number): string {
  if (valor < 95) return readToken("--error");
  if (valor <= 105) return readToken("--warning");
  return readToken("--success");
}

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      const faixa = p.value < 95 ? "Abaixo da meta" : p.value <= 105 ? "Na meta" : "Acima da meta";
      return `<strong>${p.name}</strong><br/>Atingimento: ${formatarPercentual(p.value)}<br/>Situação: ${faixa}`;
    },
  },
  grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
  xAxis: { type: "category", data: macrorregioes, axisLabel: { fontSize: 10, interval: 0, rotate: 24 } },
  yAxis: { type: "value", name: "% da meta", axisLabel: { formatter: (v: number) => `${formatarNumero(v)}%` } },
  series: [
    {
      name: "Atingimento da meta",
      type: "bar",
      barMaxWidth: 42,
      data: atingimento.map((v) => ({
        value: v,
        itemStyle: { color: corPorValor(v), borderRadius: [4, 4, 0, 0] },
      })),
      label: { show: true, position: "top", fontSize: 11, color: readToken("--foreground"), formatter: (p) => formatarPercentual(p.value as number) },
      emphasis: { focus: "series" },
      markLine: {
        symbol: "none",
        silent: true,
        lineStyle: { color: readToken("--foreground"), type: "dashed", width: 1.5 },
        label: { formatter: "Meta 100%", position: "end", fontSize: 11, color: readToken("--muted-foreground") },
        data: [{ yAxis: 100 }],
      },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarPercentual } from "@/lib/echarts/format";

const macrorregioes = ["Região Metropolitana", "Vale do Sul", "Serra Alta", "Região Central", "Planalto Oeste"];
const atingimento = [118, 104, 100, 92, 74];

const corPorValor = (v: number) =>
  v < 95 ? readToken("--error") : v <= 105 ? readToken("--warning") : readToken("--success");

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  xAxis: { type: "category", data: macrorregioes, axisLabel: { interval: 0, rotate: 24 } },
  yAxis: { type: "value", name: "% da meta" },
  series: [{
    name: "Atingimento da meta",
    type: "bar",
    barMaxWidth: 42,
    data: atingimento.map((v) => ({ value: v, itemStyle: { color: corPorValor(v), borderRadius: [4, 4, 0, 0] } })),
    label: { show: true, position: "top", formatter: (p) => formatarPercentual(p.value as number) },
    markLine: { symbol: "none", silent: true, data: [{ yAxis: 100 }], label: { formatter: "Meta 100%" } },
  }],
};

export function AtingimentoMetaChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Colunas de atingimento da meta por macrorregião com cor condicional e linha de meta em 100%."
    />
  );
}`;

export const barrasCorCondicional: ChartPreset = {
  id: "barras-cor-condicional",
  nome: "Barras com Cor Condicional",
  categoria: "barras",
  descricao:
    "Cor de cada coluna definida por regra sobre o valor: abaixo da meta, na meta ou acima da meta, com linha de referência em 100%.",
  tags: ["cor condicional", "meta", "semáforo", "markLine"],
  option,
  codigoReact,
  quandoUsar: [
    "Acompanhamento de metas com faixas de tolerância",
    "Painéis de gestão que exigem leitura imediata de exceção",
    "Comparar unidades contra o mesmo alvo percentual",
  ],
  quandoNaoUsar: [
    "Quando as faixas não são acordadas com a área de negócio",
    "Séries com muitas categorias e faixas próximas",
    "Valores absolutos com metas diferentes por unidade",
  ],
  acessibilidade: [
    "Rótulo percentual em cada coluna: a cor é reforço, não canal único",
    "Tooltip nomeia a faixa em texto (abaixo, na meta, acima)",
    "Tokens success, warning e error já validados em contraste AA",
  ],
  ariaLabel:
    "Colunas de atingimento da meta por macrorregião. Região Metropolitana com 118% e Vale Claro com 108% ficam acima da meta; Vale do Sul e Serra Alta estão na faixa da meta; Região Central com 92%, Litoral Leste com 86% e Planalto Oeste com 74% ficam abaixo.",
  altura: 340,
};

export default barrasCorCondicional;
