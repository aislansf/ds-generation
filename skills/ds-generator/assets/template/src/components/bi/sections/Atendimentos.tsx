import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros, contarPorCampo } from "@/lib/bi/aggregations";
import IndicatorCard from "../IndicatorCard";
import { PhoneCall, MailX, Clock, AlertCircle } from "lucide-react";

export default function Atendimentos() {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);

  const tentativas = dados.filter((d) => d.status === "Tentativa de contato").length;
  const realizados = dados.filter((d) => d.status === "Contato realizado").length;
  const aguardando = dados.filter((d) => d.status === "Aguardando retorno").length;
  const porResp = contarPorCampo(dados, "responsavel");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Atendimentos</h1>
        <p className="text-sm text-muted-foreground">Acompanhamento das interações comerciais.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <IndicatorCard title="Atendimentos realizados" value={realizados} icon={PhoneCall} delta={null} />
        <IndicatorCard title="Tentativas sem sucesso" value={tentativas} icon={MailX} delta={null} />
        <IndicatorCard title="Retornos pendentes" value={aguardando} icon={Clock} delta={null} />
        <IndicatorCard title="Atrasados" value={dados.filter((d) => d.proximaAcao && d.prazoProximaAcao && d.prazoProximaAcao < new Date().toISOString().slice(0, 10)).length} icon={AlertCircle} delta={null} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Atendimentos por responsável</h3>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="text-left py-2 px-2">Responsável</th>
              <th className="text-right py-2 px-2">Atendimentos</th>
            </tr>
          </thead>
          <tbody>
            {porResp.map((r) => (
              <tr key={r.name} className="border-b border-border/40">
                <td className="py-2 px-2">{r.name}</td>
                <td className="py-2 px-2 text-right font-medium">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
