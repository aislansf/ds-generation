/**
 * Datasets do template "Farol Estratégico".
 * Valores extraídos da referência Power BI institucional.
 */

export type MesKey =
  | "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho"
  | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro";

export interface DespesaMensal {
  mes: MesKey;
  planejada: number;
  executada: number;
}

/** Valores oficiais da referência (R$). */
export const despesasMensais: DespesaMensal[] = [
  { mes: "Janeiro",   planejada: 13_766_136, executada: 6_349_927 },
  { mes: "Fevereiro", planejada: 20_500_868, executada: 7_648_795 },
  { mes: "Março",     planejada: 22_676_796, executada: 19_040_450 },
  { mes: "Abril",     planejada: 14_738_404, executada: 31_446_696 },
  { mes: "Maio",      planejada: 35_521_535, executada: 22_562_835 },
  { mes: "Junho",     planejada: 29_511_471, executada: 4_567_357 },
  { mes: "Julho",     planejada: 21_643_725, executada: 0 },
  { mes: "Agosto",    planejada: 21_287_289, executada: 0 },
  { mes: "Setembro",  planejada: 21_113_857, executada: 0 },
  { mes: "Outubro",   planejada: 25_395_975, executada: 0 },
  { mes: "Novembro",  planejada: 19_941_285, executada: 0 },
  { mes: "Dezembro",  planejada: 19_792_792, executada: 0 },
];

export interface TrimestreTotal {
  label: string;
  total: number;
  pct: number;
}

export const trimestresTotais: TrimestreTotal[] = [
  { label: "1º Trimestre", total: 33_039_171, pct: 12 },
  { label: "2º Trimestre", total: 41_868_596, pct: 15 },
  { label: "3º Trimestre", total: 0, pct: 0 },
  { label: "4º Trimestre", total: 0, pct: 0 },
];

export interface NaturezaDespesa {
  label: string;
  valor: number;
}

export const despesasPorNatureza: NaturezaDespesa[] = [
  { label: "Serviços Especializados", valor: 20_356_830 },
  { label: "Pessoal", valor: 15_462_178 },
  { label: "Serviços Contratados", valor: 10_800_219 },
  { label: "Transf. Externas - Convênios c/Outras Entidades", valor: 8_656_072 },
  { label: "Benefícios Sociais", valor: 4_745_617 },
  { label: "Despesas com Viagens", valor: 3_139_510 },
  { label: "Encargos Sociais", valor: 2_504_195 },
  { label: "Aluguéis e Encargos", valor: 2_233_541 },
  { label: "Divulgação, Anúncios, Publicidade e Propaganda", valor: 1_505_208 },
];

/** KPIs principais (Despesas) */
export const kpiDespesas = {
  original:   281_261_916,
  planejada:  282_598_425,
  executada:   74_907_767,
};

export const kpiReceitas = {
  prevista:  295_438_120,
  realizada:  82_154_870,
  saldo:    -200_000_000,
};

export const kpiAtendimento = {
  meiAtendidos: 18_540,
  pequenosAtendidos: 9_217,
  totalEventos: 412,
};

/** Opções dos filtros — apenas exemplos institucionais. */
export const filterOptions = {
  ppa: ["Todos", "PPA 2022-2026", "PPA 2026-2030"],
  iniciativa: ["Todos", "Empretec", "ALI", "Programa Inova", "Negócio a Negócio"],
  acao: ["Todos", "Capacitação", "Mentoria", "Consultoria", "Eventos"],
  natureza: [
    "Todos",
    "Serviços Especializados",
    "Pessoal",
    "Serviços Contratados",
    "Benefícios Sociais",
  ],
  unidade: ["Todos", "DIRAE/__BRAND_NAME__", "DIFIN/__BRAND_NAME__", "DIRSU/__BRAND_NAME__"],
  eixo: ["Todos", "Competitividade", "Educação Empreendedora", "Inovação", "Mercados"],
  programa: ["Todos", "ALI 4.0", "Programa Inova", "Brasil Mais", "Empretec"],
  gestor: ["Todos", "Ana Pereira", "Bruno Lima", "Carla Rocha", "Diego Castro"],
} as const;

export type FilterKey = keyof typeof filterOptions;

export type FiltersState = Record<FilterKey, string>;

export const defaultFilters: FiltersState = {
  ppa: "Todos",
  iniciativa: "Todos",
  acao: "Todos",
  natureza: "Todos",
  unidade: "Todos",
  eixo: "Todos",
  programa: "Todos",
  gestor: "Todos",
};

export const filterLabels: Record<FilterKey, string> = {
  ppa: "PPA",
  iniciativa: "Iniciativa",
  acao: "Ação",
  natureza: "Natureza",
  unidade: "Unidade Organizacional",
  eixo: "Eixo Estratégico",
  programa: "Programa",
  gestor: "Gestor",
};

export function formatBRL(value: number): string {
  if (value === 0) return "R$ 0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (abs >= 1_000)     return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

export function formatBRLFull(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}