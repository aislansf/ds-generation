import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { Button } from "@/components/ui/button";
import IndicatorCard from "../IndicatorCard";
import { ShieldCheck, AlertTriangle, FileWarning, Copy } from "lucide-react";

export default function Qualidade() {
  const { registros } = useBI();

  const cnpjMap = useMemo(() => {
    const m = new Map<string, number>();
    registros.forEach((r) => r.cnpj && m.set(r.cnpj, (m.get(r.cnpj) || 0) + 1));
    return m;
  }, [registros]);

  const duplicadosCnpj = Array.from(cnpjMap.values()).filter((v) => v > 1).length;
  const semContato = registros.filter((r) => !r.contato).length;
  const semStatus = registros.filter((r) => !r.status).length;
  const completos = registros.filter((r) => r.cnpj && r.empresa && r.contato && r.telefones && r.emails).length;
  const incompletos = registros.length - completos;

  const pendencias = registros.flatMap((r) => {
    const p: { empresa: string; campo: string; tipo: string; prioridade: string }[] = [];
    if (!r.cnpj) p.push({ empresa: r.empresa ?? "—", campo: "CNPJ", tipo: "Ausente", prioridade: "Alta" });
    if (!r.contato) p.push({ empresa: r.empresa ?? "—", campo: "Contato", tipo: "Ausente", prioridade: "Média" });
    if (!r.emails) p.push({ empresa: r.empresa ?? "—", campo: "E-mail", tipo: "Ausente", prioridade: "Média" });
    if (r.cnpj && (cnpjMap.get(r.cnpj) ?? 0) > 1) p.push({ empresa: r.empresa ?? "—", campo: "CNPJ", tipo: "Duplicado", prioridade: "Alta" });
    return p;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Qualidade dos Dados</h1>
        <p className="text-sm text-muted-foreground">Diagnóstico da consistência e completude da base.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <IndicatorCard title="Registros completos" value={completos} icon={ShieldCheck} delta={null} />
        <IndicatorCard title="Registros incompletos" value={incompletos} icon={FileWarning} delta={null} />
        <IndicatorCard title="CNPJs duplicados" value={duplicadosCnpj} icon={Copy} delta={null} />
        <IndicatorCard title="Sem contato" value={semContato} icon={AlertTriangle} delta={null} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Pendências de cadastro</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="text-left py-2 px-2">Empresa</th>
                <th className="text-left py-2 px-2">Campo</th>
                <th className="text-left py-2 px-2">Tipo</th>
                <th className="text-left py-2 px-2">Prioridade</th>
                <th className="text-right py-2 px-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {pendencias.slice(0, 20).map((p, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="py-2 px-2">{p.empresa}</td>
                  <td className="py-2 px-2">{p.campo}</td>
                  <td className="py-2 px-2 text-xs">{p.tipo}</td>
                  <td className="py-2 px-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${p.prioridade === "Alta" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{p.prioridade}</span>
                  </td>
                  <td className="py-2 px-2 text-right"><Button variant="outline" size="sm">Corrigir cadastro</Button></td>
                </tr>
              ))}
              {pendencias.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">Nenhuma pendência identificada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
