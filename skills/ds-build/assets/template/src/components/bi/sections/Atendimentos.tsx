import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros, contarPorCampo } from "@/lib/bi/aggregations";
import IndicatorCard from "../IndicatorCard";
import { PhoneCall, MailX, Clock, AlertCircle } from "lucide-react";
import { KPIGridSkeleton, TableSkeleton } from "../BISkeletons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Atendimentos({ loading = false }: { loading?: boolean }) {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);

  const tentativas = dados.filter((d) => d.status === "Tentativa de contato").length;
  const realizados = dados.filter((d) => d.status === "Contato realizado").length;
  const aguardando = dados.filter((d) => d.status === "Aguardando retorno").length;
  const porResp = contarPorCampo(dados, "responsavel");

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <KPIGridSkeleton count={4} />
        <TableSkeleton cols={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Atendimentos</h2>
        <p className="text-sm text-muted-foreground">Acompanhamento dos atendimentos aos empreendedores atendidos.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <IndicatorCard title="Atendimentos realizados" value={realizados} icon={PhoneCall} delta={null} />
        <IndicatorCard title="Tentativas sem sucesso" value={tentativas} icon={MailX} delta={null} />
        <IndicatorCard title="Retornos pendentes" value={aguardando} icon={Clock} delta={null} />
        <IndicatorCard title="Atrasados" value={dados.filter((d) => d.proximaAcao && d.prazoProximaAcao && d.prazoProximaAcao < new Date().toISOString().slice(0, 10)).length} icon={AlertCircle} delta={null} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Atendimentos por escritório regional</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Escritório regional</TableHead>
              <TableHead className="text-right">Atendimentos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {porResp.map((r) => (
              <TableRow key={r.name}>
                <TableCell>{r.name}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{r.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
