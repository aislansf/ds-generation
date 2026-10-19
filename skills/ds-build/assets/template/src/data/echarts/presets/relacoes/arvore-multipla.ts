import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();

export const arvore2024 = {
  name: "Carteira 2024",
  children: [
    { name: "Competitividade", children: [{ name: "Empreender Mais" }, { name: "Visita Técnica" }] },
    { name: "Inovação", children: [{ name: "Programa Inova" }] },
    { name: "Empreendedorismo", children: [{ name: "Empreender" }] },
  ],
};

export const arvore2025 = {
  name: "Carteira 2025",
  children: [
    { name: "Competitividade", children: [{ name: "Empreender Mais" }, { name: "Visita Técnica" }, { name: "Mais Produtividade" }] },
    { name: "Inovação", children: [{ name: "Programa Inova" }, { name: "AGI" }] },
    { name: "Empreendedorismo", children: [{ name: "Empreender" }, { name: "MEI Regular" }] },
  ],
};

const base = {
  type: "tree" as const,
  top: 40,
  bottom: 24,
  symbol: "circle" as const,
  symbolSize: 10,
  expandAndCollapse: true,
  initialTreeDepth: 3,
  emphasis: { focus: "descendant" as const },
  lineStyle: { color: readToken("--muted-foreground", 0.45), width: 1.2, curveness: 0.5 },
  label: { position: "left" as const, align: "right" as const, fontSize: 10, color: readToken("--foreground") },
  leaves: { label: { position: "right" as const, align: "left" as const, fontSize: 10 } },
};

export const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove" },
  title: [
    { text: "Carteira 2024", left: "24%", top: 0, textAlign: "center", textStyle: { fontSize: 12 } },
    { text: "Carteira 2025", left: "74%", top: 0, textAlign: "center", textStyle: { fontSize: 12 } },
  ],
  series: [
    {
      ...base,
      name: "Carteira 2024",
      data: [arvore2024],
      left: "4%",
      right: "56%",
      itemStyle: { color: palette[0], borderColor: readToken("--card"), borderWidth: 2 },
    },
    {
      ...base,
      name: "Carteira 2025",
      data: [arvore2025],
      left: "54%",
      right: "6%",
      itemStyle: { color: palette[2], borderColor: readToken("--card"), borderWidth: 2 },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { getBrandPalette, readToken } from "@/lib/echarts/brandTheme";

const palette = getBrandPalette();
const base = {
  type: "tree" as const, top: 40, bottom: 24, symbol: "circle" as const, symbolSize: 10,
  expandAndCollapse: true, initialTreeDepth: 3, emphasis: { focus: "descendant" as const },
  lineStyle: { color: readToken("--muted-foreground", 0.45), curveness: 0.5 },
  label: { position: "left" as const, align: "right" as const, color: readToken("--foreground") },
  leaves: { label: { position: "right" as const, align: "left" as const } },
};

const option: EChartsOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove" },
  title: [
    { text: "Carteira 2024", left: "24%", top: 0, textAlign: "center" },
    { text: "Carteira 2025", left: "74%", top: 0, textAlign: "center" },
  ],
  series: [
    { ...base, name: "Carteira 2024", data: [arvore2024], left: "4%", right: "56%", itemStyle: { color: palette[0] } },
    { ...base, name: "Carteira 2025", data: [arvore2025], left: "54%", right: "6%", itemStyle: { color: palette[2] } },
  ],
};

export function CarteirasComparadasChart() {
  return (
    <BrandChart
      option={option}
      height={400}
      ariaLabel="Duas árvores lado a lado comparando a carteira de programas de 2024 e 2025."
    />
  );
}`;

export const arvoreMultipla: ChartPreset = {
  id: "arvore-multipla",
  nome: "Árvores Comparadas",
  categoria: "relacoes",
  descricao:
    "Duas árvores lado a lado no mesmo gráfico, comparando a estrutura da carteira de programas de 2024 e de 2025.",
  tags: ["tree", "comparativo", "duas séries", "estrutura"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar duas estruturas hierárquicas equivalentes",
    "Antes e depois de uma reorganização de portfólio",
    "Hierarquias pequenas, de dois a três níveis",
  ],
  quandoNaoUsar: [
    "Hierarquias grandes: o espaço por árvore fica insuficiente",
    "Mais de duas estruturas no mesmo gráfico",
    "Quando a diferença é numérica, não estrutural",
  ],
  acessibilidade: [
    "Título sobre cada árvore identifica o recorte comparado",
    "Cores distintas por árvore, com rótulos textuais em todos os nós",
    "Expandir e recolher funciona de forma independente em cada árvore",
  ],
  ariaLabel:
    "Duas árvores comparando as carteiras de 2024 e 2025. Em 2025 a estrutura cresce com a inclusão de Mais Produtividade em Competitividade, AGI em Inovação e MEI Regular em Empreendedorismo.",
  altura: 400,
};

export default arvoreMultipla;
