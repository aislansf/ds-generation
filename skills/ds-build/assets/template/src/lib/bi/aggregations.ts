import { RegistroAtendimento, FiltrosGlobais, STATUS_LIST } from "./types";

export function aplicarFiltros(
  regs: RegistroAtendimento[],
  f: FiltrosGlobais,
): RegistroAtendimento[] {
  return regs.filter((r) => {
    if (f.dataInicio && r.data && r.data < f.dataInicio) return false;
    if (f.dataFim && r.data && r.data > f.dataFim) return false;
    if (f.uf && r.uf !== f.uf) return false;
    if (f.cidade && r.cidade !== f.cidade) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.porte && r.porte !== f.porte) return false;
    if (f.segmento && r.segmento !== f.segmento) return false;
    if (f.responsavel && r.responsavel !== f.responsavel) return false;
    if (f.potencial && r.potencial !== f.potencial) return false;
    return true;
  });
}

export function contarPorCampo<T extends keyof RegistroAtendimento>(
  regs: RegistroAtendimento[],
  campo: T,
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  regs.forEach((r) => {
    const k = (r[campo] ?? "—") as string;
    map.set(String(k), (map.get(String(k)) || 0) + 1);
  });
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function distribuicaoStatus(regs: RegistroAtendimento[]) {
  return STATUS_LIST.map((s) => ({
    name: s,
    value: regs.filter((r) => r.status === s).length,
  }));
}

export function evolucaoTemporal(
  regs: RegistroAtendimento[],
  granularidade: "dia" | "semana" | "mes",
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  regs.forEach((r) => {
    if (!r.data) return;
    const d = new Date(r.data);
    let key = r.data;
    if (granularidade === "mes") key = r.data.slice(0, 7);
    if (granularidade === "semana") {
      const onejan = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil(((+d - +onejan) / 86400000 + onejan.getDay() + 1) / 7);
      key = `${d.getFullYear()}-S${String(week).padStart(2, "0")}`;
    }
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function funilComercial(regs: RegistroAtendimento[]) {
  const total = regs.length;
  return [
    { name: "Empresa cadastrada", value: total },
    { name: "Tentativa de contato", value: regs.filter((r) => r.status !== "Não iniciado").length },
    { name: "Contato realizado", value: regs.filter((r) => ["Contato realizado", "Aguardando retorno", "Oportunidade identificada", "Cadastro solicitado", "Proposta enviada", "Convertido"].includes(r.status)).length },
    { name: "Qualificado", value: regs.filter((r) => ["Oportunidade identificada", "Cadastro solicitado", "Proposta enviada", "Convertido"].includes(r.status)).length },
    { name: "Oportunidade", value: regs.filter((r) => ["Oportunidade identificada", "Cadastro solicitado", "Proposta enviada", "Convertido"].includes(r.status)).length },
    { name: "Cadastro enviado", value: regs.filter((r) => ["Cadastro solicitado", "Proposta enviada", "Convertido"].includes(r.status)).length },
    { name: "Proposta enviada", value: regs.filter((r) => ["Proposta enviada", "Convertido"].includes(r.status)).length },
    { name: "Convertido", value: regs.filter((r) => r.status === "Convertido").length },
  ];
}

export function qualidadeDados(regs: RegistroAtendimento[]) {
  const total = regs.length || 1;
  const campos: { rotulo: string; key: keyof RegistroAtendimento }[] = [
    { rotulo: "CNPJ", key: "cnpj" },
    { rotulo: "Telefone", key: "telefones" },
    { rotulo: "Contato", key: "contato" },
    { rotulo: "Cargo", key: "cargo" },
    { rotulo: "E-mail", key: "emails" },
    { rotulo: "Site", key: "sites" },
    { rotulo: "Status", key: "status" },
    { rotulo: "Próxima ação", key: "proximaAcao" },
  ];
  return campos.map(({ rotulo, key }) => {
    const preenchidos = regs.filter((r) => r[key]).length;
    return { name: rotulo, percent: Math.round((preenchidos / total) * 100) };
  });
}

export function indicadores(regs: RegistroAtendimento[]) {
  const empresasUnicas = new Set(regs.map((r) => r.cnpj || r.empresa)).size;
  const cidades = new Set(regs.map((r) => r.cidade).filter(Boolean)).size;
  const comEmail = regs.filter((r) => r.emails).length;
  const oportunidades = regs.filter((r) =>
    ["Oportunidade identificada", "Cadastro solicitado", "Proposta enviada"].includes(r.status),
  ).length;
  const semRetorno = regs.filter((r) => r.status === "Aguardando retorno" || r.status === "Tentativa de contato").length;
  const qualificados = regs.filter((r) => r.potencial !== "Baixo").length;
  return {
    empresasUnicas,
    atendimentos: regs.length,
    contatos: regs.filter((r) => r.contato).length,
    comEmail,
    cidades,
    oportunidades,
    semRetorno,
    taxaQualificacao: regs.length ? Math.round((qualificados / regs.length) * 100) : 0,
  };
}
