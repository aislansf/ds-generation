import type { CategoriaInfo, ChartCategoria, ChartPreset } from "@/data/echarts/types";
import { barrasBasico } from "@/data/echarts/presets/barras/barras-basico";
import { barrasEmpilhadas } from "@/data/echarts/presets/barras/barras-empilhadas";
import { barrasEmpilhadas100 } from "@/data/echarts/presets/barras/barras-empilhadas-100";
import { barrasHorizontais } from "@/data/echarts/presets/barras/barras-horizontais";
import { barrasNegativas } from "@/data/echarts/presets/barras/barras-negativas";
import { barrasComLinha } from "@/data/echarts/presets/barras/barras-com-linha";
import { barrasOrdenadasDinamicas } from "@/data/echarts/presets/barras/barras-ordenadas-dinamicas";
import { barrasWaterfall } from "@/data/echarts/presets/barras/barras-waterfall";
import { barrasPolar } from "@/data/echarts/presets/barras/barras-polar";
import { barrasFundoTrilha } from "@/data/echarts/presets/barras/barras-fundo-trilha";
import { barrasCorCondicional } from "@/data/echarts/presets/barras/barras-cor-condicional";
import { barrasAgrupadasRotuloTotal } from "@/data/echarts/presets/barras/barras-agrupadas-rotulo-total";
import { linhasMultiplas } from "@/data/echarts/presets/linhas/linhas-multiplas";
import { linhaSuavizadaArea } from "@/data/echarts/presets/linhas/linha-suavizada-area";
import { areasEmpilhadas } from "@/data/echarts/presets/linhas/areas-empilhadas";
import { linhaTemporalZoom } from "@/data/echarts/presets/linhas/linha-temporal-zoom";
import { linhaDegraus } from "@/data/echarts/presets/linhas/linha-degraus";
import { linhaComMarkpoint } from "@/data/echarts/presets/linhas/linha-com-markpoint";
import { linhaComparativaAno } from "@/data/echarts/presets/linhas/linha-comparativa-ano";
import { linhaComFalhas } from "@/data/echarts/presets/linhas/linha-com-falhas";
import { linhaMultieixo } from "@/data/echarts/presets/linhas/linha-multieixo";
import { linhaEmpilhadaGradiente } from "@/data/echarts/presets/linhas/linha-empilhada-gradiente";
import { linhaLog } from "@/data/echarts/presets/linhas/linha-log";
import { linhaCorridaDados } from "@/data/echarts/presets/linhas/linha-corrida-dados";
import { roscaBasica } from "@/data/echarts/presets/proporcao/rosca-basica";
import { pizzaSimples } from "@/data/echarts/presets/proporcao/pizza-simples";
import { roscaComTotal } from "@/data/echarts/presets/proporcao/rosca-com-total";
import { pizzaRosa } from "@/data/echarts/presets/proporcao/pizza-rosa";
import { funil } from "@/data/echarts/presets/proporcao/funil";
import { treemap } from "@/data/echarts/presets/proporcao/treemap";
import { sunburst } from "@/data/echarts/presets/proporcao/sunburst";
import { barraProgressoEmpilhada } from "@/data/echarts/presets/proporcao/barra-progresso-empilhada";
import { pizzaBordasArredondadas } from "@/data/echarts/presets/proporcao/pizza-bordas-arredondadas";
import { pizzaMultiplasSeries } from "@/data/echarts/presets/proporcao/pizza-multiplas-series";
import { sunburstMultinivel } from "@/data/echarts/presets/proporcao/sunburst-multinivel";
import { treemapDrilldown } from "@/data/echarts/presets/proporcao/treemap-drilldown";

import { dispersaoBasica } from "@/data/echarts/presets/distribuicao/dispersao-basica";
import { dispersaoBolhas } from "@/data/echarts/presets/distribuicao/dispersao-bolhas";
import { boxplot } from "@/data/echarts/presets/distribuicao/boxplot";
import { heatmapCalendario } from "@/data/echarts/presets/distribuicao/heatmap-calendario";
import { heatmapMatriz } from "@/data/echarts/presets/distribuicao/heatmap-matriz";
import { histograma } from "@/data/echarts/presets/distribuicao/histograma";
import { candlestick } from "@/data/echarts/presets/distribuicao/candlestick";
import { coordenadasParalelas } from "@/data/echarts/presets/distribuicao/coordenadas-paralelas";
import { radarBasico } from "@/data/echarts/presets/distribuicao/radar-basico";
import { radarComparativo } from "@/data/echarts/presets/distribuicao/radar-comparativo";
import { dispersaoComRegressao } from "@/data/echarts/presets/distribuicao/dispersao-com-regressao";
import { dispersaoMultiplasSeries } from "@/data/echarts/presets/distribuicao/dispersao-multiplas-series";
import { heatmapMatrizAnual } from "@/data/echarts/presets/distribuicao/heatmap-matriz-anual";
import { candlestickComMedia } from "@/data/echarts/presets/distribuicao/candlestick-com-media";
import { candlestickVolume } from "@/data/echarts/presets/distribuicao/candlestick-volume";
import { sankey } from "@/data/echarts/presets/relacoes/sankey";
import { grafoForca } from "@/data/echarts/presets/relacoes/grafo-forca";
import { grafoCircular } from "@/data/echarts/presets/relacoes/grafo-circular";
import { arvore } from "@/data/echarts/presets/relacoes/arvore";
import { arvoreRadial } from "@/data/echarts/presets/relacoes/arvore-radial";
import { themeRiver } from "@/data/echarts/presets/relacoes/theme-river";
import { acordesRelacional } from "@/data/echarts/presets/relacoes/acordes-relacional";
import { grafoCategorias } from "@/data/echarts/presets/relacoes/grafo-categorias";
import { grafoMatrizAdjacencia } from "@/data/echarts/presets/relacoes/grafo-matriz-adjacencia";
import { arvoreVertical } from "@/data/echarts/presets/relacoes/arvore-vertical";
import { arvoreMultipla } from "@/data/echarts/presets/relacoes/arvore-multipla";
import { themeRiverProgramas } from "@/data/echarts/presets/relacoes/theme-river-programas";
import { calendarioAtendimentos } from "@/data/echarts/presets/relacoes/calendario-atendimentos";
import { gaugeSimples } from "@/data/echarts/presets/kpi/gauge-simples";
import { gaugeAnel } from "@/data/echarts/presets/kpi/gauge-anel";
import { gaugeMultiplo } from "@/data/echarts/presets/kpi/gauge-multiplo";
import { gaugeGrau } from "@/data/echarts/presets/kpi/gauge-grau";
import { sparkline } from "@/data/echarts/presets/kpi/sparkline";
import { barraMeta } from "@/data/echarts/presets/kpi/barra-meta";
import { pictorialBar } from "@/data/echarts/presets/kpi/pictorial-bar";
import { mapaBrasilUfs } from "@/data/echarts/presets/mapas/mapa-brasil-ufs";
import { gaugeEstagios } from "@/data/echarts/presets/kpi/gauge-estagios";
import { barraComparativaMeta } from "@/data/echarts/presets/kpi/barra-comparativa-meta";

export const CHART_PRESETS: ChartPreset[] = [
  // Barras e colunas
  barrasBasico,
  barrasEmpilhadas,
  barrasEmpilhadas100,
  barrasHorizontais,
  barrasNegativas,
  barrasComLinha,
  barrasOrdenadasDinamicas,
  barrasWaterfall,
  barrasPolar,
  barrasFundoTrilha,
  barrasCorCondicional,
  barrasAgrupadasRotuloTotal,
  // Linhas e áreas
  linhasMultiplas,
  linhaSuavizadaArea,
  areasEmpilhadas,
  linhaTemporalZoom,
  linhaDegraus,
  linhaComMarkpoint,
  linhaComparativaAno,
  linhaComFalhas,
  linhaMultieixo,
  linhaEmpilhadaGradiente,
  linhaLog,
  linhaCorridaDados,
  // Proporção
  roscaBasica,
  roscaComTotal,
  pizzaSimples,
  pizzaRosa,
  pizzaBordasArredondadas,
  pizzaMultiplasSeries,
  barraProgressoEmpilhada,
  funil,
  treemap,
  treemapDrilldown,
  sunburst,
  sunburstMultinivel,
  // Distribuição
  dispersaoBasica,
  dispersaoBolhas,
  dispersaoComRegressao,
  dispersaoMultiplasSeries,
  boxplot,
  histograma,
  radarBasico,
  radarComparativo,
  heatmapMatriz,
  heatmapMatrizAnual,
  heatmapCalendario,
  candlestick,
  candlestickComMedia,
  candlestickVolume,
  coordenadasParalelas,
  // Relações e fluxos
  sankey,
  grafoForca,
  grafoCircular,
  grafoCategorias,
  grafoMatrizAdjacencia,
  arvore,
  arvoreRadial,
  arvoreVertical,
  arvoreMultipla,
  themeRiver,
  themeRiverProgramas,
  acordesRelacional,
  calendarioAtendimentos,
  // KPI e indicadores
  gaugeSimples,
  gaugeAnel,
  gaugeMultiplo,
  gaugeGrau,
  gaugeEstagios,
  sparkline,
  barraMeta,
  barraComparativaMeta,
  pictorialBar,
  // Mapas
  mapaBrasilUfs,
];



export const CATEGORIAS: CategoriaInfo[] = [
  {
    slug: "barras",
    nome: "Barras e Colunas",
    descricao: "Comparação de valores entre categorias discretas.",
    icone: "BarChart3",
    path: "/graficos/barras",
    disponivel: true,
  },
  {
    slug: "linhas",
    nome: "Linhas e Áreas",
    descricao: "Evolução de indicadores ao longo do tempo.",
    icone: "LineChart",
    path: "/graficos/linhas",
    disponivel: true,
  },
  {
    slug: "proporcao",
    nome: "Proporção",
    descricao: "Composição de um total: rosca, pizza, funil e treemap.",
    icone: "PieChart",
    path: "/graficos/proporcao",
    disponivel: true,
  },
  {
    slug: "distribuicao",
    nome: "Distribuição",
    descricao: "Histogramas, boxplot e dispersão para análise estatística.",
    icone: "ScatterChart",
    path: "/graficos/distribuicao",
    disponivel: true,
  },
  {
    slug: "relacoes",
    nome: "Relações e Fluxos",
    descricao: "Sankey, grafos, heatmap e diagramas de relacionamento.",
    icone: "Share2",
    path: "/graficos/relacoes",
    disponivel: true,
  },
  {
    slug: "mapas",
    nome: "Mapas",
    descricao: "Distribuição territorial por unidade da federação.",
    icone: "Map",
    path: "/graficos/mapas",
    disponivel: true,
  },
  {
    slug: "kpi",
    nome: "KPI e Indicadores",
    descricao: "Gauges, medidores e cartões de indicador com sparkline.",
    icone: "Gauge",
    path: "/graficos/kpi",
    disponivel: true,
  },
];

export function getPresetsByCategoria(cat: ChartCategoria): ChartPreset[] {
  return CHART_PRESETS.filter((p) => p.categoria === cat);
}

export function getPresetById(id: string): ChartPreset | undefined {
  return CHART_PRESETS.find((p) => p.id === id);
}

export function getCategoria(slug: string): CategoriaInfo | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}
