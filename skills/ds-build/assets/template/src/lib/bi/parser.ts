import * as XLSX from "xlsx";
import { RegistroAtendimento, EmpresaAgregada, StatusComercial } from "./types";
import {
  classificarObservacao,
  detectarCompressor,
  detectarContrato,
  detectarSecador,
  inferirPorte,
  inferirPotencial,
  inferirSegmento,
} from "./classifier";

type RawRow = Record<string, unknown>;

function norm(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function normDate(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  if (!s) return null;
  // Try to parse YYYY-MM-DD or DD/MM/YYYY
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  const brMatch = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

const COL_ALIASES: Record<string, string[]> = {
  cnpj: ["CNPJ"],
  data: ["DATA", "Data"],
  empresa: ["EMPRESA", "Empresa", "RAZAO SOCIAL", "RAZÃO SOCIAL"],
  endereco: ["ENDEREÇO", "ENDERECO", "Endereço"],
  bairro: ["BAIRRO", "Bairro"],
  cidade: ["CIDADE", "Cidade"],
  uf: ["UF", "ESTADO", "Estado"],
  cep: ["CEP", "Cep"],
  telefones: ["TELEFONES", "TELEFONE", "Telefone"],
  contato: ["CONTATO", "Contato", "NOME CONTATO"],
  cargo: ["CARGO", "Cargo"],
  emails: ["E-MAILS", "E-MAIL", "EMAIL", "Emails"],
  sites: ["SITES", "SITE", "Site"],
  observacoes: ["OBSERVAÇÕES", "OBSERVACOES", "Observações", "Obs"],
};

function pick(row: RawRow, key: keyof typeof COL_ALIASES): unknown {
  const aliases = COL_ALIASES[key];
  const keys = Object.keys(row);
  for (const a of aliases) {
    const k = keys.find((k) => k.trim().toUpperCase() === a.toUpperCase());
    if (k && row[k] !== undefined) return row[k];
  }
  return null;
}

export function parseRows(rows: RawRow[]): RegistroAtendimento[] {
  const result: RegistroAtendimento[] = [];
  rows.forEach((row, idx) => {
    const empresa = norm(pick(row, "empresa"));
    const cnpj = norm(pick(row, "cnpj"));
    const obs = norm(pick(row, "observacoes"));
    // Ignore empty rows
    if (!empresa && !cnpj && !obs) return;

    const status = classificarObservacao(obs);
    const reg: RegistroAtendimento = {
      id: `${cnpj || "sem-cnpj"}-${idx}`,
      cnpj,
      data: normDate(pick(row, "data")),
      empresa,
      endereco: norm(pick(row, "endereco")),
      bairro: norm(pick(row, "bairro")),
      cidade: norm(pick(row, "cidade")),
      uf: norm(pick(row, "uf")),
      cep: norm(pick(row, "cep")),
      telefones: norm(pick(row, "telefones")),
      contato: norm(pick(row, "contato")),
      cargo: norm(pick(row, "cargo")),
      emails: norm(pick(row, "emails")),
      sites: norm(pick(row, "sites")),
      observacoes: obs,
      statusSugerido: status,
      status,
      potencial: inferirPotencial(obs),
      segmento: inferirSegmento(obs),
      porte: inferirPorte(empresa),
      responsavel: "Equipe Comercial",
      proximaAcao: status === "Cadastro solicitado" ? "Enviar dados cadastrais" : null,
      prazoProximaAcao: null,
      possuiCompressor: detectarCompressor(obs),
      possuiSecador: detectarSecador(obs),
      contratoManutencao: detectarContrato(obs),
    };
    result.push(reg);
  });
  return result;
}

export async function parseXlsxFile(file: File): Promise<RegistroAtendimento[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: null });
  return parseRows(rows);
}

export function agruparPorEmpresa(regs: RegistroAtendimento[]): EmpresaAgregada[] {
  const map = new Map<string, EmpresaAgregada>();
  regs.forEach((r) => {
    const key = r.cnpj || `__nome__${r.empresa}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        cnpj: r.cnpj || "—",
        empresa: r.empresa || "Sem nome",
        cidade: r.cidade,
        uf: r.uf,
        bairro: r.bairro,
        contatos: r.contato ? 1 : 0,
        ultimoAtendimento: r.data,
        status: r.status,
        potencial: r.potencial,
        registros: [r],
      });
    } else {
      existing.registros.push(r);
      if (r.contato) existing.contatos += 1;
      if (r.data && (!existing.ultimoAtendimento || r.data > existing.ultimoAtendimento)) {
        existing.ultimoAtendimento = r.data;
        existing.status = r.status;
      }
      const rank: Record<string, number> = { Alto: 3, Médio: 2, Baixo: 1 };
      if (rank[r.potencial] > rank[existing.potencial]) existing.potencial = r.potencial;
    }
  });
  return Array.from(map.values());
}

export interface ValidacaoLinha {
  index: number;
  empresa: string | null;
  erros: string[];
}

const CNPJ_RE = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

export function validarRegistros(regs: RegistroAtendimento[]): ValidacaoLinha[] {
  const vistos = new Set<string>();
  const out: ValidacaoLinha[] = [];
  regs.forEach((r, i) => {
    const erros: string[] = [];
    if (!r.empresa) erros.push("Empresa ausente");
    if (r.cnpj && !CNPJ_RE.test(r.cnpj)) erros.push("CNPJ inválido");
    if (r.cnpj && vistos.has(r.cnpj)) erros.push("CNPJ duplicado");
    if (r.cnpj) vistos.add(r.cnpj);
    if (r.emails && !EMAIL_RE.test(r.emails)) erros.push("E-mail inválido");
    if (r.telefones && !/\d/.test(r.telefones)) erros.push("Telefone inválido");
    if (erros.length) out.push({ index: i, empresa: r.empresa, erros });
  });
  return out;
}
