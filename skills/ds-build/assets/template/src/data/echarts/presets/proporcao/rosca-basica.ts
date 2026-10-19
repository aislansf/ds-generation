import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

export const option: EChartsOption = {
  tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
  legend: { orient: "vertical", right: 0, top: "middle" },
  series: [
    {
      name: "Atendimentos por programa",
      type: "pie",
      radius: ["45%", "70%"],
      center: ["38%", "50%"],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: {
        show: true,
        formatter: "{d}%",
        color: readToken("--muted-foreground"),
        fontSize: 12,
      },
      labelLine: { length: 10, length2: 8 },
      data: [
        { name: "Empreender", value: 1240, itemStyle: { color: palette[0] } },
        { name: "AGI", value: 980, itemStyle: { color: palette[1] } },
        { name: "Programa Inova", value: 640, itemStyle: { color: palette[2] } },
        { name: "Visita Técnica", value: 520, itemStyle: { color: palette[3] } },
      ],
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

const option: EChartsOption = {
  tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
  legend: { orient: "vertical", right: 0, top: "middle" },
  series: [
    {
      name: "Atendimentos por programa",
      type: "pie",
      radius: ["45%", "70%"],
      center: ["38%", "50%"],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: readToken("--card"), borderWidth: 2 },
      label: { show: true, formatter: "{d}%", color: readToken("--muted-foreground"), fontSize: 12 },
      labelLine: { length: 10, length2: 8 },
      data: [
        { name: "Empreender", value: 1240, itemStyle: { color: palette[0] } },
        { name: "AGI", value: 980, itemStyle: { color: palette[1] } },
        { name: "Programa Inova", value: 640, itemStyle: { color: palette[2] } },
        { name: "Visita Técnica", value: 520, itemStyle: { color: palette[3] } },
      ],
    },
  ],
};

export function ParticipacaoProgramasChart() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Gráfico de rosca com a participação percentual dos programas no total de atendimentos: Empreender 36 por cento, AGI 29 por cento, Programa Inova 19 por cento e Visita Técnica 16 por cento."
    />
  );
}`;

export const roscaBasica: ChartPreset = {
  id: "rosca-basica",
  nome: "Rosca (Donut) Básica",
  categoria: "proporcao",
  descricao:
    "Distribuição percentual dos atendimentos entre programas, com rótulos em percentual e legenda à direita.",
  tags: ["rosca", "donut", "proporção", "percentual"],
  option,
  codigoReact,
  quandoUsar: [
    "Mostrar a composição de um total com poucas categorias (até 5 ou 6)",
    "Quando a leitura aproximada da proporção é suficiente",
    "Aproveitar o centro da rosca para exibir o total consolidado",
  ],
  quandoNaoUsar: [
    "Comparar valores próximos entre si — a diferença angular é difícil de julgar",
    "Muitas categorias ou categorias com valores mínimos (fatias ilegíveis)",
    "Evolução no tempo — prefira linhas ou área empilhada",
  ],
  acessibilidade: [
    "Inclua os percentuais no rótulo ou tooltip, não apenas na cor da fatia",
    "Cite no ariaLabel os principais percentuais para leitores de tela",
    "Ordene as fatias por magnitude para facilitar a comparação",
  ],
  ariaLabel:
    "Gráfico de rosca com a participação percentual dos programas no total de atendimentos: Empreender 36 por cento, AGI 29 por cento, Programa Inova 19 por cento e Visita Técnica 16 por cento.",
  altura: 320,
};

export default roscaBasica;
