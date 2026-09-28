export type StatusComercial =
  | "Não iniciado"
  | "Tentativa de contato"
  | "Contato realizado"
  | "Aguardando retorno"
  | "Oportunidade identificada"
  | "Cadastro solicitado"
  | "Proposta enviada"
  | "Convertido"
  | "Sem aderência"
  | "Encerrado";

export const STATUS_LIST: StatusComercial[] = [
  "Não iniciado",
  "Tentativa de contato",
  "Contato realizado",
  "Aguardando retorno",
  "Oportunidade identificada",
  "Cadastro solicitado",
  "Proposta enviada",
  "Convertido",
  "Sem aderência",
  "Encerrado",
];

export interface RegistroAtendimento {
  id: string;
  cnpj: string | null;
  data: string | null; // ISO date
  empresa: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  telefones: string | null;
  contato: string | null;
  cargo: string | null;
  emails: string | null;
  sites: string | null;
  observacoes: string | null;
  // Derivados / sugestões
  statusSugerido: StatusComercial;
  status: StatusComercial;
  potencial: "Baixo" | "Médio" | "Alto";
  segmento: string | null;
  porte: "Pequeno" | "Médio" | "Grande";
  responsavel: string | null;
  proximaAcao: string | null;
  prazoProximaAcao: string | null;
  possuiCompressor: boolean;
  possuiSecador: boolean;
  contratoManutencao: boolean;
}

export interface EmpresaAgregada {
  cnpj: string;
  empresa: string;
  cidade: string | null;
  uf: string | null;
  bairro: string | null;
  contatos: number;
  ultimoAtendimento: string | null;
  status: StatusComercial;
  potencial: "Baixo" | "Médio" | "Alto";
  registros: RegistroAtendimento[];
}

export interface FiltrosGlobais {
  dataInicio: string | null;
  dataFim: string | null;
  uf: string | null;
  cidade: string | null;
  regiao: string | null;
  status: StatusComercial | null;
  porte: string | null;
  segmento: string | null;
  responsavel: string | null;
  potencial: string | null;
}

export const FILTROS_VAZIOS: FiltrosGlobais = {
  dataInicio: null,
  dataFim: null,
  uf: null,
  cidade: null,
  regiao: null,
  status: null,
  porte: null,
  segmento: null,
  responsavel: null,
  potencial: null,
};
