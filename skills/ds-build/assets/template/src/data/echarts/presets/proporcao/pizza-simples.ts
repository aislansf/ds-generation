import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) =>
      `${p.name as string}<br/><strong>${formatarNumero(p.value as number)}</strong> (${formatarPercentual(
        p.percent as number,
      )})`,
  },
  legend: { show: false },
  series: [
    {
      name: "MEIs formalizados por macrorregião",
      type: "pie",
      radius: "62%",
      center: ["50%", "52%"],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: {
        show: true,
        position: "outside",
        color: readToken("--foreground"),
        fontSize: 12,
        formatter: (p) => `${p.name as string}\n${formatarPercentual(p.percent as number)}`,
      },
      labelLine: { show: true, length: 12, length2: 12 },
      data: [
        { name: "Porto Central", value: 4820, itemStyle: { color: palette[0] } },
        { name: "Vale do Sul", value: 2140, itemStyle: { color: palette[1] } },
        { name: "Serra Alta", value: 1680, itemStyle: { color: palette[2] } },
        { name: "Região Central", value: 1120, itemStyle: { color: palette[3] } },
        { name: "Litoral Leste", value: 860, itemStyle: { color: palette[6] } },
      ],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarPercentual } from "@/lib/echarts/format";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => p.name + "<br/><strong>" + formatarNumero(p.value as number) + "</strong> (" + formatarPercentual(p.percent as number) + ")",
  },
  legend: { show: false },
  series: [
    {
      name: "MEIs formalizados por macrorregião",
      type: "pie",
      radius: "62%",
      center: ["50%", "52%"],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: {
        show: true,
        position: "outside",
        color: readToken("--foreground"),
        fontSize: 12,
        formatter: (p) => p.name + "\\n" + formatarPercentual(p.percent as number),
      },
      labelLine: { show: true, length: 12, length2: 12 },
      data: [
        { name: "Porto Central", value: 4820, itemStyle: { color: palette[0] } },
        { name: "Vale do Sul", value: 2140, itemStyle: { color: palette[1] } },
        { name: "Serra Alta", value: 1680, itemStyle: { color: palette[2] } },
        { name: "Região Central", value: 1120, itemStyle: { color: palette[3] } },
        { name: "Litoral Leste", value: 860, itemStyle: { color: palette[6] } },
      ],
    },
  ],
};

export function MeisPorMacrorregiaoChart() {
  return (
    <BrandChart
      option={option}
      height={340}
      ariaLabel="Pizza com a distribuição de MEIs formalizados por macrorregião: Porto Central 45,3 por cento, Vale do Sul 20,1 por cento, Serra Alta 15,8 por cento, Região Central 10,5 por cento e Litoral Leste 8,1 por cento."
    />
  );
}`;

export const pizzaSimples: ChartPreset = {
  id: "pizza-simples",
  nome: "Pizza com Rótulos Externos",
  categoria: "proporcao",
  descricao:
    "Pizza clássica com rótulos externos e linha de chamada, indicada quando o nome da categoria precisa ficar ao lado da fatia.",
  tags: ["pizza", "proporção", "rótulos externos", "regiões"],
  option,
  codigoReact,
  quandoUsar: [
    "Composição de um total com até 5 ou 6 categorias e uma fatia claramente dominante",
    "Quando o nome da categoria deve estar junto da fatia, sem exigir legenda",
    "Comunicação institucional e relatórios de apresentação",
  ],
  quandoNaoUsar: [
    "Comparar fatias de tamanho parecido: o ângulo é difícil de julgar",
    "Muitas categorias ou fatias residuais menores que 3 por cento",
    "Séries temporais ou qualquer dado com ordem natural",
  ],
  acessibilidade: [
    "Sempre mostre o percentual no rótulo, não apenas a cor da fatia",
    "Use avoidLabelOverlap e labelLine para garantir que nenhum texto se sobreponha",
    "Liste no ariaLabel todas as categorias com seus percentuais, em ordem decrescente",
  ],
  ariaLabel:
    "Pizza com a distribuição de MEIs formalizados por macrorregião: Porto Central 45,3 por cento, Vale do Sul 20,1 por cento, Serra Alta 15,8 por cento, Região Central 10,5 por cento e Litoral Leste 8,1 por cento.",
  altura: 340,
};

export default pizzaSimples;
