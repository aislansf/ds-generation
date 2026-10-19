import type { EChartsOption } from "echarts";

export type ChartCategoria =
  | "barras"
  | "linhas"
  | "proporcao"
  | "distribuicao"
  | "relacoes"
  | "kpi"
  | "mapas";

export interface ChartPreset {
  /** slug, ex: "barras-basico" */
  id: string;
  nome: string;
  categoria: ChartCategoria;
  descricao: string;
  tags: string[];
  /** option puro do ECharts, pronto para copiar */
  option: EChartsOption;
  /** snippet React completo e copiável */
  codigoReact: string;
  quandoUsar: string[];
  quandoNaoUsar: string[];
  acessibilidade: string[];
  ariaLabel: string;
  altura?: number;
  /** Nome do mapa (registerMap) que este preset exige antes de renderizar. */
  requerMapa?: string;
}

export interface CategoriaInfo {
  slug: ChartCategoria;
  nome: string;
  descricao: string;
  /** nome do ícone lucide-react */
  icone: string;
  path: string;
  /** false enquanto a categoria não tiver conteúdo publicado */
  disponivel: boolean;
}
