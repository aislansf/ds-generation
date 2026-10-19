import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { Button } from "@/components/ui/button";
import IndicatorCard from "../IndicatorCard";
import { ShieldCheck, AlertTriangle, FileWarning, Copy } from "lucide-react";
import { KPIGridSkeleton, TableSkeleton } from "../BISkeletons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Qualidade({ loading = false }: { loading?: boolean }) {
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

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <KPIGridSkeleton count={4} />
        <TableSkeleton cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Qualidade dos Dados</h2>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendencias.slice(0, 20).map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{p.empresa}</TableCell>
                  <TableCell>{p.campo}</TableCell>
                  <TableCell className="text-xs">{p.tipo}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${p.prioridade === "Alta" ? "bg-destructive/15 text-destructive" : "bg-warning/20 text-warning-foreground"}`}>{p.prioridade}</span>
                  </TableCell>
                  <TableCell className="text-right"><Button variant="outline" size="sm">Corrigir cadastro</Button></TableCell>
                </TableRow>
              ))}
              {pendencias.length === 0 && (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-sm">Nenhuma pendência identificada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
