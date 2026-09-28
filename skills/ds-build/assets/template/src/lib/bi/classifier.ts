import { StatusComercial } from "./types";

const REGRAS: Array<{ pattern: RegExp; status: StatusComercial }> = [
  { pattern: /(ningu[ée]m atende|n[ãa]o atende|sem retorno|caixa postal)/i, status: "Tentativa de contato" },
  { pattern: /(somente por e-?mail|contato por e-?mail|aguardando e-?mail)/i, status: "Aguardando retorno" },
  { pattern: /(solicitou envio|envio dos dados cadastrais|cadastro solicitado)/i, status: "Cadastro solicitado" },
  { pattern: /(proposta enviada|or[çc]amento enviado)/i, status: "Proposta enviada" },
  { pattern: /(fechou contrato|convertido|cliente fechado)/i, status: "Convertido" },
  { pattern: /(n[ãa]o usam compressor|sem ader[êe]ncia|n[ãa]o tem interesse)/i, status: "Sem aderência" },
  { pattern: /(empresa fechada|encerrad[ao])/i, status: "Encerrado" },
  { pattern: /(possui compressor|possui compressores|tem compressor|atlas copco|schulz|chicago pneumatic)/i, status: "Oportunidade identificada" },
  { pattern: /(contato realizado|conversamos|falamos com)/i, status: "Contato realizado" },
];

export function classificarObservacao(texto: string | null | undefined): StatusComercial {
  if (!texto) return "Não iniciado";
  for (const r of REGRAS) if (r.pattern.test(texto)) return r.status;
  return "Tentativa de contato";
}

export function detectarCompressor(t: string | null | undefined): boolean {
  if (!t) return false;
  return /(compressor|atlas copco|schulz|chicago pneumatic|parafuso)/i.test(t);
}
export function detectarSecador(t: string | null | undefined): boolean {
  if (!t) return false;
  return /secador/i.test(t);
}
export function detectarContrato(t: string | null | undefined): boolean {
  if (!t) return false;
  return /contrato de manuten[çc][ãa]o|contrato vigente/i.test(t);
}

export function inferirPotencial(t: string | null | undefined): "Baixo" | "Médio" | "Alto" {
  if (!t) return "Baixo";
  if (/parafuso|atlas copco ga|contrato de manuten[çc][ãa]o|secador/i.test(t)) return "Alto";
  if (detectarCompressor(t)) return "Médio";
  return "Baixo";
}

export function inferirPorte(empresa: string | null | undefined): "Pequeno" | "Médio" | "Grande" {
  if (!empresa) return "Pequeno";
  if (/ind[uú]stria|ind\.|s\.?a\.?$|do brasil/i.test(empresa)) return "Grande";
  if (/ltda|com[eé]rcio/i.test(empresa)) return "Médio";
  return "Pequeno";
}

export function inferirSegmento(t: string | null | undefined): string {
  if (!t) return "Não classificado";
  if (/aliment[ií]cio|alimentos/i.test(t)) return "Alimentício";
  if (/auto-?pe[çc]a|automotiv/i.test(t)) return "Automotivo";
  if (/metal[uú]rgic|usinagem|estamparia/i.test(t)) return "Metalurgia";
  if (/qu[ií]mic|farmac/i.test(t)) return "Químico/Farmacêutico";
  if (/pl[áa]stic|inje[çc][ãa]o/i.test(t)) return "Plástico";
  if (/t[êe]xtil|confec[çc][ãa]o/i.test(t)) return "Têxtil";
  return "Industrial";
}
