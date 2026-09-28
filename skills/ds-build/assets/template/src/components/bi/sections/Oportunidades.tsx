import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros } from "@/lib/bi/aggregations";
import IndicatorCard from "../IndicatorCard";
import { Target, TrendingUp, Wrench, FileCheck2, AlertOctagon, Settings, Truck, PauseCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function Oportunidades() {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);

  const oportunidades = dados.filter((d) =>
    ["Oportunidade identificada", "Cadastro solicitado", "Proposta enviada"].includes(d.status),
  );
  const alto = oportunidades.filter((o) => o.potencial === "Alto");
  const comCompressor = dados.filter((d) => d.possuiCompressor);
  const comContrato = dados.filter((d) => d.contratoManutencao);

  const porCidade = oportunidades.reduce<Record<string, number>>((acc, r) => {
    const k = r.cidade ?? "—";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const dadosCidade = Object.entries(porCidade).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Oportunidades</h1>
        <p className="text-sm text-muted-foreground">Empresas com potencial de conversão e equipamentos identificados.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <IndicatorCard title="Oportunidades abertas" value={oportunidades.length} icon={Target} delta={null} />
        <IndicatorCard title="Alto potencial" value={alto.length} icon={TrendingUp} delta={null} />
        <IndicatorCard title="Com compressor" value={comCompressor.length} icon={Wrench} delta={null} />
        <IndicatorCard title="Contratos vigentes" value={comContrato.length} icon={FileCheck2} delta={null} />
        <IndicatorCard title="Sem aderência" value={dados.filter((d) => d.status === "Sem aderência").length} icon={AlertOctagon} delta={null} />
        <IndicatorCard title="Manutenção interessada" value={dados.filter((d) => /manuten/i.test(d.observacoes ?? "")).length} icon={Settings} delta={null} />
        <IndicatorCard title="Locação interessada" value={dados.filter((d) => /loca[çc][ãa]o/i.test(d.observacoes ?? "")).length} icon={Truck} delta={null} />
        <IndicatorCard title="Stand-by" value={dados.filter((d) => /stand[- ]?by/i.test(d.observacoes ?? "")).length} icon={PauseCircle} delta={null} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Oportunidades por cidade</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dadosCidade}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Oportunidades prioritárias</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="text-left py-2 px-2">Empresa</th>
                <th className="text-left py-2 px-2">Cidade</th>
                <th className="text-left py-2 px-2">Potencial</th>
                <th className="text-left py-2 px-2">Equipamento</th>
                <th className="text-left py-2 px-2">Próxima ação</th>
              </tr>
            </thead>
            <tbody>
              {alto.slice(0, 10).map((o) => (
                <tr key={o.id} className="border-b border-border/40">
                  <td className="py-2 px-2 font-medium">{o.empresa ?? "—"}</td>
                  <td className="py-2 px-2 text-xs">{o.cidade ?? "—"}</td>
                  <td className="py-2 px-2 text-xs">{o.potencial}</td>
                  <td className="py-2 px-2 text-xs">
                    {[o.possuiCompressor && "Compressor", o.possuiSecador && "Secador", o.contratoManutencao && "Contrato"]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                  <td className="py-2 px-2 text-xs">{o.proximaAcao ?? "Definir próximo contato"}</td>
                </tr>
              ))}
              {alto.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">Nenhuma oportunidade de alto potencial nos filtros atuais.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
