import { useMemo, useState } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros, contarPorCampo, distribuicaoStatus, evolucaoTemporal, funilComercial, indicadores, qualidadeDados } from "@/lib/bi/aggregations";
import IndicatorCard from "../IndicatorCard";
import { Building2, PhoneCall, Users, Mail, MapPin, Target, AlertCircle, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

const STATUS_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--secondary))",
  "hsl(var(--warning))",
  "hsl(var(--warning) / 0.6)",
  "hsl(var(--success))",
  "hsl(var(--accent-foreground))",
  "hsl(var(--primary) / 0.5)",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
];

export default function VisaoGeral() {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);
  const [granularidade, setGranularidade] = useState<"dia" | "semana" | "mes">("dia");

  const kpis = indicadores(dados);
  const porCidade = contarPorCampo(dados, "cidade").slice(0, 8);
  const porStatus = distribuicaoStatus(dados).filter((s) => s.value > 0);
  const evolucao = evolucaoTemporal(dados, granularidade);
  const funil = funilComercial(dados);
  const qualidade = qualidadeDados(dados);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel de Prospecção e Atendimento Comercial</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe empresas prospectadas, contatos realizados, oportunidades identificadas e qualidade da base comercial.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <IndicatorCard title="Empresas únicas" value={kpis.empresasUnicas} icon={Building2} tooltip="Empresas distintas identificadas pelo CNPJ." delta={null} />
        <IndicatorCard title="Atendimentos" value={kpis.atendimentos} icon={PhoneCall} tooltip="Registros de interação comercial." delta={null} />
        <IndicatorCard title="Contatos" value={kpis.contatos} icon={Users} tooltip="Registros com contato nominal identificado." delta={null} />
        <IndicatorCard title="Com e-mail" value={kpis.comEmail} icon={Mail} tooltip="Empresas com pelo menos um e-mail cadastrado." delta={null} />
        <IndicatorCard title="Cidades atendidas" value={kpis.cidades} icon={MapPin} tooltip="Cidades únicas com registros." delta={null} />
        <IndicatorCard title="Oportunidades" value={kpis.oportunidades} icon={Target} tooltip="Empresas em estágio de oportunidade, cadastro ou proposta." delta={null} />
        <IndicatorCard title="Sem retorno" value={kpis.semRetorno} icon={AlertCircle} tooltip="Tentativas sem resposta ou aguardando retorno." delta={null} />
        <IndicatorCard title="Taxa de qualificação" value={`${kpis.taxaQualificacao}%`} icon={Sparkles} tooltip="Percentual de registros com potencial médio ou alto." delta={null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Empresas por cidade">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porCidade} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Empresas por status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={porStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {porStatus.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Evolução dos atendimentos"
          action={
            <div className="flex gap-1">
              {(["dia", "semana", "mes"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGranularidade(g)}
                  className={`px-2 py-1 text-[10px] rounded ${granularidade === g ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70"}`}
                >
                  {g === "dia" ? "Diário" : g === "semana" ? "Semanal" : "Mensal"}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Funil comercial">
          <div className="space-y-2 py-2">
            {funil.map((etapa, i) => {
              const max = funil[0].value || 1;
              const pct = (etapa.value / max) * 100;
              return (
                <div key={etapa.name} className="flex items-center gap-3">
                  <span className="w-40 text-xs text-foreground/80 truncate">{etapa.name}</span>
                  <div className="flex-1 h-7 rounded bg-muted overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end pr-2 text-[10px] font-semibold text-primary-foreground"
                      style={{
                        width: `${Math.max(pct, 4)}%`,
                        background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7) ${50 + i * 5}%)`,
                      }}
                    >
                      {etapa.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Qualidade dos dados — preenchimento dos campos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 py-2">
          {qualidade.map((q) => (
            <div key={q.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/80">{q.name}</span>
                <span className="font-semibold text-foreground">{q.percent}%</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${q.percent}%`,
                    background:
                      q.percent >= 70
                        ? "hsl(var(--success))"
                        : q.percent >= 40
                          ? "hsl(var(--warning))"
                          : "hsl(var(--destructive))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
