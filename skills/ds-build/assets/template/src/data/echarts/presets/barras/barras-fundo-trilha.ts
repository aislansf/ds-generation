import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

export const municipios = ["Porto Central", "Serra Alta", "Nova Esperança", "Lagoa Azul", "Vila Nova", "Bom Retiro", "Rio Verde", "Monte Claro"];
export const atendimentos = [4820, 2310, 2140, 1780, 1520, 1180, 960, 740];

export const option: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v) => formatarNumero(v as number),
  },
  grid: { left: 8, right: 72, top: 24, bottom: 8, containLabel: true },
  xAxis: { type: "value", show: false, max: 5200 },
  yAxis: {
    type: "category",
    data: [...municipios].reverse(),
    axisLabel: { fontSize: 11 },
    axisLine: { show: false },
  },
  series: [
    {
      name: "Atendimentos",
      type: "bar",
      barWidth: 16,
      showBackground: true,
      backgroundStyle: { color: readToken("--muted-foreground", 0.14), borderRadius: 8 },
      itemStyle: { color: readToken("--primary"), borderRadius: 8 },
      emphasis: { focus: "series", itemStyle: { color: readToken("--secondary") } },
      label: {
        show: true,
        position: "right",
        fontSize: 11,
        color: readToken("--foreground"),
        formatter: (p) => formatarNumero(p.value as number),
      },
      data: [...atendimentos].reverse(),
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const municipios = ["Porto Central", "Serra Alta", "Nova Esperança", "Lagoa Azul", "Vila Nova"];
const atendimentos = [4820, 2310, 2140, 1780, 1520];

const option: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => formatarNumero(v as number) },
  xAxis: { type: "value", show: false, max: 5200 },
  yAxis: { type: "category", data: [...municipios].reverse(), axisLine: { show: false } },
  series: [{
    name: "Atendimentos",
    type: "bar",
    barWidth: 16,
    showBackground: true,
    backgroundStyle: { color: readToken("--muted-foreground", 0.14), borderRadius: 8 },
    itemStyle: { color: readToken("--primary"), borderRadius: 8 },
    label: { show: true, position: "right", formatter: (p) => formatarNumero(p.value as number) },
    data: [...atendimentos].reverse(),
  }],
};

export function RankingMunicipiosChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Ranking de atendimentos por município com trilha de fundo indicando o teto da escala."
    />
  );
}`;

export const barrasFundoTrilha: ChartPreset = {
  id: "barras-fundo-trilha",
  nome: "Barras com Trilha de Fundo",
  categoria: "barras",
  descricao:
    "Ranking horizontal com showBackground: a trilha neutra revela o quanto falta para o teto da escala.",
  tags: ["ranking", "showBackground", "trilha", "horizontal"],
  option,
  codigoReact,
  quandoUsar: [
    "Rankings de municípios, regiões ou unidades",
    "Quando o espaço restante até o teto comunica potencial",
    "Listas curtas, de 5 a 12 categorias",
  ],
  quandoNaoUsar: [
    "Séries temporais",
    "Múltiplas séries por categoria — a trilha se sobrepõe",
    "Quando não existe teto conceitual para a escala",
  ],
  acessibilidade: [
    "Rótulo numérico em cada barra: a cor não é canal único",
    "Trilha em tom neutro com contraste suficiente em light e dark",
    "Eixo de valor oculto porque cada barra já traz seu número",
  ],
  ariaLabel:
    "Ranking de atendimentos por município em 2025. Porto Central lidera com 4.820, seguida de Serra Alta com 2.310 e Nova Esperança com 2.140; Monte Claro fecha a lista com 740.",
  altura: 320,
};

export default barrasFundoTrilha;
