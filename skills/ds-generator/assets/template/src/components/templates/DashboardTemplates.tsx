import { useState } from "react";
import { ComponentPreview, CodeBlock } from "@/components/DSComponents";
import {
  Users, FileCheck, FileX, Clock, ShieldCheck, RefreshCw,
  Filter, Eye, BarChart3, TrendingUp
} from "lucide-react";
import { brandCor as brandLogoCompleta } from "@/assets/brand";
import marcaGov from "@/assets/marca-gov.png";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ─── Shared data ─── */
const barData = [
  { name: "Diretoria A", valor: 85 },
  { name: "Diretoria B", valor: 60 },
  { name: "Diretoria C", valor: 72 },
  { name: "Diretoria D", valor: 45 },
  { name: "Diretoria E", valor: 30 },
  { name: "Diretoria F", valor: 18 },
];

const donutData = [
  { name: "Conformidade", value: 50, color: "#D98217" },
  { name: "Nome do Status", value: 12.5, color: "#F0C06D" },
  { name: "Nome do Status", value: 12.5, color: "#FBDFA2" },
  { name: "Null Error", value: 12.5, color: "#CBD5E1" },
  { name: "Outros", value: 12.5, color: "#E2E8F0" },
];

const performanceData = [
  { label: "Excepcional", pct: 45, color: "#D98217" },
  { label: "Alto Desempenho", pct: 35, color: "#16A34A" },
  { label: "Adequados", pct: 25, color: "#2A4FDA" },
  { label: "Inadequados", pct: 55, color: "#DC2626" },
];

const tableRows = [
  { id: "00001", servidor: "Nome até 00 caract..", diretoria: "Diretoria A", status: "Em ajuste", prazo: "20 Dias", descontos: "R$ 600,00", modalidade: "40h bimestral", unidade: "Unidade ou Sigla", statusTag: "Regular" },
  { id: "00002", servidor: "Nome até 00 caract..", diretoria: "Diretoria A", status: "Em ajuste", prazo: "20 Dias", descontos: "R$ 600,00", modalidade: "40h bimestral", unidade: "Unidade ou Sigla", statusTag: "Atenção" },
  { id: "00003", servidor: "Nome até 00 caract..", diretoria: "Diretoria A", status: "Em ajuste", prazo: "20 Dias", descontos: "R$ 600,00", modalidade: "40h bimestral", unidade: "Unidade ou Sigla", statusTag: "Regular" },
  { id: "00004", servidor: "Nome até 00 caract..", diretoria: "Diretoria A", status: "Em ajuste", prazo: "20 Dias", descontos: "R$ 600,00", modalidade: "40h bimestral", unidade: "Unidade ou Sigla", statusTag: "Em Ajuste" },
  { id: "00005", servidor: "Nome até 00 caract..", diretoria: "Diretoria A", status: "Em ajuste", prazo: "20 Dias", descontos: "R$ 600,00", modalidade: "40h bimestral", unidade: "Unidade ou Sigla", statusTag: "Em Ajuste" },
];

function StatusDot({ status }: { status: string }) {
  const color = status === "Regular" ? "#16A34A" : status === "Atenção" ? "#DC2626" : "#2A4FDA";
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
      {status}
    </span>
  );
}

/* ─── KPI Card ─── */
function KPICard({ icon: Icon, title, subtitle, value, borderColor }: {
  icon: React.ElementType; title: string; subtitle: string; value: string; borderColor: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: borderColor }} />
      <p className="text-xs font-semibold mt-1" style={{ color: borderColor }}>{title}</p>
      <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      <div className="flex items-center gap-2 mt-2">
        <Icon size={20} className="text-muted-foreground" />
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}

/* ─── Dashboard Header ─── */
function DashboardHeader({ withTabs = false }: { withTabs?: boolean }) {
  return (
    <header className="rounded-t-lg font-sans bg-[#F0F3FF]">
      <div className="flex items-center gap-4 px-5 py-3 min-h-[56px]">
        <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-9 w-auto flex-shrink-0" />
        <div className="flex-1" />
      </div>
    </header>
  );
}

/* ─── Footer ─── */
function DashboardFooter() {
  return (
    <div className="flex items-center justify-end gap-3 px-5 py-2 border-t border-border bg-muted/30 rounded-b-lg">
      <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-5 w-auto opacity-60" />
      <span className="text-[10px] text-muted-foreground">Programa - v.1.0</span>
    </div>
  );
}

/* ─── Audit Table ─── */
function AuditTable({ rows = tableRows }: { rows?: typeof tableRows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#2A4FDA] text-white">
            <th className="px-3 py-2 text-left font-medium">ID</th>
            <th className="px-3 py-2 text-left font-medium">Servidor</th>
            <th className="px-3 py-2 text-left font-medium">Diretoria</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2 text-left font-medium">Prazo</th>
            <th className="px-3 py-2 text-left font-medium">Descontos</th>
            <th className="px-3 py-2 text-left font-medium">Modalidade</th>
            <th className="px-3 py-2 text-left font-medium">Unidade</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
              <td className="px-3 py-2 text-muted-foreground">{r.id}</td>
              <td className="px-3 py-2">{r.servidor}</td>
              <td className="px-3 py-2">{r.diretoria}</td>
              <td className="px-3 py-2">{r.status}</td>
              <td className="px-3 py-2">{r.prazo}</td>
              <td className="px-3 py-2">{r.descontos}</td>
              <td className="px-3 py-2">{r.modalidade}</td>
              <td className="px-3 py-2">{r.unidade}</td>
              <td className="px-3 py-2"><StatusDot status={r.statusTag} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={7} className="px-3 py-2 font-semibold text-xs">Total:</td>
            <td colSpan={2} className="px-3 py-2 font-semibold text-xs text-right">2500</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ─── Donut Chart Section ─── */
function DonutSection({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm font-bold text-[#D98217] mb-1">{title}</p>
      <p className="text-[10px] text-muted-foreground mb-3">{subtitle}</p>
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 flex-1">
          {donutData.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="font-semibold">{d.value}%</span>
              <span className="text-muted-foreground">- {d.name}</span>
            </div>
          ))}
        </div>
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} dataKey="value" innerRadius={30} outerRadius={50} paddingAngle={2} strokeWidth={0}>
                {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── Performance Section ─── */
function PerformanceSection() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm font-bold text-[#D98217] mb-1">Desempenho Geral dos Programas</p>
      <p className="text-[10px] text-muted-foreground mb-3">20 programas listados - 2320 Colaboradores listados</p>
      <div className="space-y-3">
        {performanceData.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-xs font-semibold w-6">00%</span>
            <span className="text-xs text-muted-foreground">- {d.label}</span>
            <div className="flex-1 h-5 bg-muted rounded overflow-hidden ml-2">
              <div className="h-full rounded" style={{ width: `${d.pct}%`, background: d.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bar Chart Section ─── */
function BarChartSection() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm font-bold text-[#D98217] mb-3">Servidores por Diretoria</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="valor" fill="#2A4FDA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* Dashboard 1 — Layout Completa (KPIs horizontais)   */
/* ═══════════════════════════════════════════════════ */
function DashboardCompleta() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-[#EFF3F8] dark:bg-muted/20">
      <DashboardHeader />

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-5 py-2 bg-card border-b border-border">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A4FDA] text-white text-xs rounded">
          <Filter size={12} /> Filtros
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D98217] text-white text-xs rounded">
          <Eye size={12} /> Visão geral
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Resumo */}
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs font-semibold text-foreground mb-3">
            <span className="font-bold italic">Resumo da Pesquisa:</span> Categoria - prioridade - setor
          </p>

          {/* KPI row — 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KPICard icon={Users} title="Total de Servidores" subtitle="Servidores em análise (filtrados)" value="1.019" borderColor="#2A4FDA" />
            <KPICard icon={FileCheck} title="Servidores Regulares" subtitle="Filtro (listar todos)" value="80.00%" borderColor="#16A34A" />
            <KPICard icon={FileX} title="Servidores Irregulares" subtitle="Filtro (listar todos)" value="20.00%" borderColor="#DC2626" />
            <KPICard icon={Clock} title="Em Análise" subtitle="Aguardando conformidade" value="20.00%" borderColor="#D98217" />
            <KPICard icon={ShieldCheck} title="Auditoria em Andamento" subtitle="Aguardando conformidade" value="2.00%" borderColor="#16A34A" />
            <KPICard icon={RefreshCw} title="Atualização de Dados" subtitle="Aguardando conformidade" value="+120" borderColor="#D98217" />
          </div>
        </div>

        {/* Table — full width */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#D98217]">Auditoria e Irregularidade</p>
            <div className="flex items-center gap-3 text-[10px]">
              <StatusDot status="Atenção" />
              <StatusDot status="Regular" />
              <StatusDot status="Em Ajuste" />
            </div>
          </div>
          <div className="overflow-x-auto max-w-full">
            <div style={{ minWidth: 900 }}>
              <AuditTable />
            </div>
          </div>
        </div>

        {/* Bottom: Donut + Bar chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DonutSection title="Distribuição por Modalidade" subtitle="20 programas listados" />
          <BarChartSection />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* Dashboard 2 — Layout Reduzida (sidebar de KPIs)    */
/* ═══════════════════════════════════════════════════ */
function DashboardReduzida() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-[#EFF3F8] dark:bg-muted/20">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-0">
        {/* Sidebar KPIs */}
        <div className="bg-card border-r border-border p-4 space-y-3">
          <p className="text-xs font-bold text-foreground mb-2">Resumo:</p>

          {[
            { title: "Servidores Regulares", sub: "Filtro (listar todos)", value: "80.00%", color: "#16A34A" },
            { title: "Servidores Irregulares", sub: "Filtro (listar todos)", value: "20.00%", color: "#DC2626" },
            { title: "Em Análise", sub: "Aguardando conformidade", value: "20.00%", color: "#D98217" },
            { title: "Auditoria em Andamento", sub: "Aguardando conformidade", value: "2.00%", color: "#16A34A" },
            { title: "Total de Servidores", sub: "Servidores em análise (filtrados)", value: "1.019", color: "#2A4FDA" },
          ].map((kpi, i) => (
            <div key={i} className="border-b border-border pb-3 last:border-0">
              <p className="text-xs font-semibold" style={{ color: kpi.color }}>{kpi.title}</p>
              <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-foreground">{kpi.value}</span>
              </div>
              <div className="h-0.5 mt-2 rounded" style={{ background: kpi.color }} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="p-4 space-y-4 min-w-0">
          {/* Search bar */}
          <p className="text-xs text-muted-foreground">
            <span className="font-bold italic">Pesquisa:</span> Categoria - prioridade - setor
          </p>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border p-4 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-[#D98217]">Auditoria e Irregularidade</p>
              <div className="flex items-center gap-3 text-[10px]">
                <StatusDot status="Atenção" />
                <StatusDot status="Regular" />
                <StatusDot status="Em Ajuste" />
              </div>
            </div>
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-xs" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-[#2A4FDA] text-white">
                    <th className="px-3 py-2 text-left font-medium">ID</th>
                    <th className="px-3 py-2 text-left font-medium">Servidor</th>
                    <th className="px-3 py-2 text-left font-medium">Diretoria</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                    <th className="px-3 py-2 text-left font-medium">Prazo</th>
                    <th className="px-3 py-2 text-left font-medium">Descontos</th>
                    <th className="px-3 py-2 text-left font-medium">Modalidade</th>
                    <th className="px-3 py-2 text-left font-medium">Unidade</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...tableRows, ...tableRows.slice(0, 3)].map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="px-3 py-2 text-muted-foreground">{r.id}</td>
                      <td className="px-3 py-2">{r.servidor}</td>
                      <td className="px-3 py-2">{r.diretoria}</td>
                      <td className="px-3 py-2">{r.status}</td>
                      <td className="px-3 py-2">{r.prazo}</td>
                      <td className="px-3 py-2">{r.descontos}</td>
                      <td className="px-3 py-2">{r.modalidade}</td>
                      <td className="px-3 py-2">{r.unidade}</td>
                      <td className="px-3 py-2"><StatusDot status={r.statusTag} /></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={7} className="px-3 py-2 font-semibold text-xs">Total:</td>
                    <td colSpan={2} className="px-3 py-2 font-semibold text-xs text-right">2500</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bottom chart — full width */}
          <DonutSection title="Distribuição por Modalidade" subtitle="20 programas listados" />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}

/* ═══ Exported Section ═══ */
export default function DashboardTemplatesSection() {
  return (
    <div className="space-y-8">
      <ComponentPreview
        title="Dashboard — Layout Completa"
        description="Layout com KPIs horizontais no topo, tabela de auditoria com gráfico donut e gráficos de barras/performance na base. Ideal para visão geral consolidada."
      >
        <DashboardCompleta />
      </ComponentPreview>

      <ComponentPreview
        title="Dashboard — Layout Reduzida"
        description="Layout com sidebar lateral de KPIs à esquerda e área principal com tabela e gráficos. Ideal para análise detalhada com resumo fixo."
      >
        <DashboardReduzida />
      </ComponentPreview>
    </div>
  );
}
