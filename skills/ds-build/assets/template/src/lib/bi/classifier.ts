import { StatusComercial } from "./types";

/**
 * Regras de inferência de status a partir das observações do atendimento.
 * Vocabulário __BRAND_NAME__: atendimento, empreendedor, empresa atendida, programa.
 */
const REGRAS: Array<{ pattern: RegExp; status: StatusComercial }> = [
  { pattern: /(ningu[ée]m atende|n[ãa]o atende|sem retorno|caixa postal)/i, status: "Tentativa de contato" },
  { pattern: /(somente por e-?mail|contato por e-?mail|aguardando e-?mail|aguardando retorno)/i, status: "Aguardando retorno" },
  { pattern: /(solicitou envio|envio dos dados cadastrais|cadastro solicitado|aguardando documenta[çc][ãa]o)/i, status: "Cadastro solicitado" },
  { pattern: /(proposta enviada|or[çc]amento enviado)/i, status: "Proposta enviada" },
  { pattern: /(fechou contrato|convertido|ades[ãa]o confirmada|contratou a consultoria)/i, status: "Convertido" },
  { pattern: /(sem ader[êe]ncia|n[ãa]o tem interesse)/i, status: "Sem aderência" },
  { pattern: /(empresa fechada|encerrad[ao])/i, status: "Encerrado" },
  { pattern: /(interesse em consultoria|interesse em capacita|interesse em curso|busca continuidade|avaliar nova solu)/i, status: "Oportunidade identificada" },
  { pattern: /(contato realizado|conversamos|falamos com|atendimento presencial)/i, status: "Contato realizado" },
];

export function classificarObservacao(texto: string | null | undefined): StatusComercial {
  if (!texto) return "Não iniciado";
  for (const r of REGRAS) if (r.pattern.test(texto)) return r.status;
  return "Tentativa de contato";
}

/** Já participou de algum programa do __BRAND_SHORT__. */
export function detectarParticipacaoPrograma(t: string | null | undefined): boolean {
  if (!t) return false;
  return /(empreender|\bagi\b|programa inova|j[áa] participou|programa)/i.test(t);
}

/** Empresa formalizada, com CNPJ ativo. */
export function detectarCnpjAtivo(t: string | null | undefined): boolean {
  if (!t) return false;
  return /(cnpj ativo|formaliza|empresa formalizada|mei ativo)/i.test(t);
}

/** Consultoria __BRAND_SHORT__ vigente. */
export function detectarConsultoriaVigente(t: string | null | undefined): boolean {
  if (!t) return false;
  return /(consultoria vigente|contrato de consultoria|consultoria em andamento|contratou a consultoria)/i.test(t);
}

export function inferirPotencial(t: string | null | undefined): "Baixo" | "Médio" | "Alto" {
  if (!t) return "Baixo";
  if (/(consultoria vigente|proposta enviada|empreender|programa inova|fechou contrato|contratou a consultoria)/i.test(t))
    return "Alto";
  if (/(interesse em consultoria|interesse em capacita|curso|trilha|cr[ée]dito orientado)/i.test(t)) return "Médio";
  return "Baixo";
}

export function inferirPorte(empresa: string | null | undefined): "Pequeno" | "Médio" | "Grande" {
  if (!empresa) return "Pequeno";
  if (/(s\.?a\.?$|ind[uú]stria|agroind[uú]stria|cooperativa)/i.test(empresa)) return "Grande";
  if (/(ltda|com[eé]rcio|eireli)/i.test(empresa)) return "Médio";
  return "Pequeno";
}

export function inferirSegmento(t: string | null | undefined): string {
  if (!t) return "Não classificado";
  if (/(com[eé]rcio|mercadinho|loja|distribuidora)/i.test(t)) return "Comércio";
  if (/(servi[çc]o|cl[íi]nica|consultoria|oficina|studio)/i.test(t)) return "Serviços";
  if (/(ind[uú]stria|f[áa]brica|metal[uú]rgic|cer[âa]mica)/i.test(t)) return "Indústria";
  if (/(agroneg[óo]cio|agropecu[áa]ria|fazenda|cooperativa)/i.test(t)) return "Agronegócio";
  if (/(turismo|pousada|hotel|restaurante)/i.test(t)) return "Turismo";
  if (/(criativ|ateli[êe]|confec[çc][ãa]o|editora)/i.test(t)) return "Economia criativa";
  return "Não classificado";
}
