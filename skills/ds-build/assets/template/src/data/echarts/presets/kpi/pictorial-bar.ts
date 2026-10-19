import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

export const regioes = ["Porto Central", "Litoral Leste", "Vale do Sul", "Serra Alta", "Região Central", "Planalto Oeste"];
/** Cada símbolo representa 100 MEIs formalizados. */
export const unidades = [14, 12, 10, 9, 7, 5];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return `<strong>${p.name}</strong><br/>${formatarNumero(p.value * 100)} MEIs formalizados<br/><span style="font-size:11px">${formatarNumero(p.value)} símbolos × 100</span>`;
    },
  },
  legend: { show: false },
  grid: { left: 8, right: 72, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "Símbolos (× 100 MEIs)", max: 16, splitLine: { show: false } },
  yAxis: {
    type: "category",
    data: [...regioes].reverse(),
    axisLabel: { fontSize: 11 },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      name: "MEIs formalizados",
      type: "pictorialBar",
      symbol: "circle",
      symbolRepeat: true,
      symbolSize: [14, 14],
      symbolMargin: 4,
      symbolClip: true,
      symbolBoundingData: 16,
      itemStyle: { color: readToken("--primary") },
      data: [...unidades].reverse(),
      label: {
        show: true,
        position: "right",
        offset: [16, 0],
        fontSize: 11,
        color: readToken("--foreground"),
        formatter: (p) => formatarNumero((p.value as number) * 100),
      },
      z: 2,
    },
    {
      name: "Escala total",
      type: "pictorialBar",
      symbol: "circle",
      symbolRepeat: true,
      symbolSize: [14, 14],
      symbolMargin: 4,
      symbolBoundingData: 16,
      itemStyle: { color: readToken("--primary", 0.15) },
      data: regioes.map(() => 16),
      silent: true,
      animation: false,
      z: 1,
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const regioes = ["Porto Central", "Litoral Leste", "Vale do Sul", "Serra Alta", "Região Central", "Planalto Oeste"];
const unidades = [14, 12, 10, 9, 7, 5]; // cada símbolo = 100 MEIs

const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const p = (params as { name: string; value: number }[])[0];
      return "<strong>" + p.name + "</strong><br/>" + formatarNumero(p.value * 100) + " MEIs formalizados";
    },
  },
  grid: { left: 8, right: 72, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "value", name: "Símbolos (× 100 MEIs)", max: 16, splitLine: { show: false } },
  yAxis: { type: "category", data: [...regioes].reverse(), axisLabel: { fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
  series: [
    {
      name: "MEIs formalizados",
      type: "pictorialBar",
      symbol: "circle", symbolRepeat: true, symbolSize: [14, 14], symbolMargin: 4,
      symbolClip: true, symbolBoundingData: 16,
      itemStyle: { color: readToken("--primary") },
      data: [...unidades].reverse(),
      label: { show: true, position: "right", offset: [16, 0], fontSize: 11, formatter: (p) => formatarNumero((p.value as number) * 100) },
      z: 2,
    },
    {
      name: "Escala total",
      type: "pictorialBar",
      symbol: "circle", symbolRepeat: true, symbolSize: [14, 14], symbolMargin: 4, symbolBoundingData: 16,
      itemStyle: { color: readToken("--primary", 0.15) },
      data: regioes.map(() => 16),
      silent: true, animation: false, z: 1,
    },
  ],
};

export function MeisPictorialChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Gráfico de ícones repetidos com MEIs formalizados por macrorregião, cada símbolo equivalendo a 100 formalizações: Porto Central 1.400, Litoral Leste 1.200, Vale do Sul 1.000, Serra Alta 900, Região Central 700 e Planalto Oeste 500."
    />
  );
}`;

export const pictorialBar: ChartPreset = {
  id: "pictorial-bar",
  nome: "Barra Pictórica",
  categoria: "kpi",
  descricao:
    "Símbolos repetidos representando quantidade de MEIs formalizados, com trilho de escala ao fundo e equivalência declarada no eixo.",
  tags: ["pictorialBar", "ícones", "isotype", "MEIs"],
  option,
  codigoReact,
  quandoUsar: [
    "Comunicar quantidades a públicos amplos de forma concreta",
    "Peças de comunicação institucional e relatórios de impacto",
    "Quando arredondar a unidade de contagem é aceitável",
  ],
  quandoNaoUsar: [
    "Valores que exigem precisão decimal",
    "Muitas categorias ou valores muito grandes (excesso de símbolos)",
    "Análises exploratórias — prefira barras simples",
  ],
  acessibilidade: [
    "Declare sempre a equivalência de cada símbolo no nome do eixo",
    "Rótulo com o valor absoluto ao lado de cada linha",
    "Símbolo e trilho derivados do token primary, mantendo contraste nos dois temas",
  ],
  ariaLabel:
    "Gráfico de ícones repetidos com MEIs formalizados por macrorregião, cada símbolo equivalendo a 100 formalizações: Porto Central 1.400, Litoral Leste 1.200, Vale do Sul 1.000, Serra Alta 900, Região Central 700 e Planalto Oeste 500.",
  altura: 320,
};

export default pictorialBar;
