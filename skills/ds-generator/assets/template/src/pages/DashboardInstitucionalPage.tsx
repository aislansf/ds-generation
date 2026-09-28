import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu, Sun, Moon, X, Search, ChevronDown, ChevronRight,
  Home, GraduationCap, Wallet, BarChart3, Users, FileText,
  Bell, Shield, Settings, HelpCircle, Folder,
  Filter, Eye, FileCheck, FileX, Clock, ShieldCheck, RefreshCw,
  ArrowLeft, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { brandCor as brandLogoReduzida } from "@/assets/brand";
import marcaGov from "@/assets/marca-gov.png";
import { brandWhite as iconeBrandNegativo } from "@/assets/brand";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { SEO } from "@/components/SEO";

/* ─── Menu items ─── */
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  children?: { label: string }[];
}

const menuItems: MenuItem[] = [
  { label: "Início", icon: <Home size={16} /> },
  {
    label: "Programas", icon: <GraduationCap size={16} />,
    children: [{ label: "Empretec" }, { label: "ALI" }, { label: "Programa Inova" }, { label: "Negócio a Negócio" }],
  },
  {
    label: "Financeiro", icon: <Wallet size={16} />,
    children: [{ label: "Prestação de Contas" }, { label: "Repasses" }, { label: "Convênios" }],
  },
  {
    label: "Relatórios", icon: <BarChart3 size={16} />,
    children: [{ label: "Indicadores" }, { label: "Dashboards" }, { label: "Exportações" }],
  },
  { label: "Usuários", icon: <Users size={16} /> },
  {
    label: "Documentos", icon: <FileText size={16} />,
    children: [{ label: "Normativos" }, { label: "Manuais" }, { label: "Resoluções" }],
  },
  { label: "Notificações", icon: <Bell size={16} /> },
  { label: "Segurança", icon: <Shield size={16} /> },
  { label: "Configurações", icon: <Settings size={16} /> },
  { label: "Ajuda", icon: <HelpCircle size={16} /> },
];

/* ─── Dashboard data ─── */
const barData = [
  { name: "Diretoria A", valor: 85 },
  { name: "Diretoria B", valor: 60 },
  { name: "Diretoria C", valor: 72 },
  { name: "Diretoria D", valor: 45 },
  { name: "Diretoria E", valor: 30 },
  { name: "Diretoria F", valor: 18 },
];

const donutData = [
  { name: "Conformidade", value: 50, color: "hsl(var(--primary))" },
  { name: "Em Análise", value: 12.5, color: "hsl(var(--secondary))" },
  { name: "Pendente", value: 12.5, color: "hsl(var(--warning))" },
  { name: "Null Error", value: 12.5, color: "hsl(var(--muted-foreground))" },
  { name: "Outros", value: 12.5, color: "hsl(var(--muted))" },
];

const tableRows = [
  { id: "00001", servidor: "Ana Silva Pereira", diretoria: "Diretoria A", status: "Em ajuste", prazo: "20 Dias", descontos: "R$ 600,00", modalidade: "40h bimestral", unidade: "__BRAND_NAME__", statusTag: "Regular" },
  { id: "00002", servidor: "Bruno Souza Lima", diretoria: "Diretoria A", status: "Em ajuste", prazo: "15 Dias", descontos: "R$ 450,00", modalidade: "40h bimestral", unidade: "__BRAND_NAME__", statusTag: "Atenção" },
  { id: "00003", servidor: "Carla Mendes Rocha", diretoria: "Diretoria B", status: "Em ajuste", prazo: "30 Dias", descontos: "R$ 720,00", modalidade: "40h bimestral", unidade: "DIRAE/__BRAND_NAME__", statusTag: "Regular" },
  { id: "00004", servidor: "Diego Alves Castro", diretoria: "Diretoria C", status: "Em ajuste", prazo: "10 Dias", descontos: "R$ 380,00", modalidade: "40h bimestral", unidade: "DIRAE/__BRAND_NAME__", statusTag: "Em Ajuste" },
  { id: "00005", servidor: "Eduarda Santos Lima", diretoria: "Diretoria D", status: "Em ajuste", prazo: "25 Dias", descontos: "R$ 510,00", modalidade: "40h bimestral", unidade: "DIFIN/__BRAND_NAME__", statusTag: "Em Ajuste" },
];

function StatusDot({ status }: { status: string }) {
  const color =
    status === "Regular"
      ? "hsl(var(--success))"
      : status === "Atenção"
      ? "hsl(var(--destructive))"
      : "hsl(var(--primary))";
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
      {status}
    </span>
  );
}

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

const performanceData = [
  { label: "Excepcional", pct: 45, color: "hsl(var(--warning))" },
  { label: "Alto Desempenho", pct: 35, color: "hsl(var(--success))" },
  { label: "Adequados", pct: 25, color: "hsl(var(--primary))" },
  { label: "Inadequados", pct: 55, color: "hsl(var(--destructive))" },
];

function PerformanceSection() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm font-bold text-primary mb-1">Desempenho Geral dos Programas</p>
      <p className="text-[10px] text-muted-foreground mb-3">20 programas listados · 2.320 colaboradores</p>
      <div className="space-y-3">
        {performanceData.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-xs font-semibold w-10">{d.pct}%</span>
            <span className="text-xs text-muted-foreground w-32">- {d.label}</span>
            <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
              <div className="h-full rounded" style={{ width: `${d.pct}%`, background: d.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutSection() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm font-bold text-primary mb-1">Distribuição por Modalidade</p>
      <p className="text-[10px] text-muted-foreground mb-3">20 programas listados</p>
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

function BarChartSection() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm font-bold text-primary mb-3">Servidores por Diretoria</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function DashboardInstitucionalPage() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Programas: true });
  const [activeItem, setActiveItem] = useState("Início");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const query = searchQuery.toLowerCase().trim();
  const filteredItems = query
    ? menuItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.children?.some((c) => c.label.toLowerCase().includes(query))
      )
    : menuItems;

  const handleItemClick = (item: MenuItem) => {
    if (collapsed && !isMobile) { setCollapsed(false); setActiveItem(item.label); return; }
    setActiveItem(item.label);
    if (item.children) {
      setExpanded((prev) => ({ ...prev, [item.label]: !prev[item.label] }));
    }
    if (isMobile && !item.children) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
      <SEO
        title="Dashboard Institucional — Design System __BRAND_SHORT__"
        description="Template de dashboard institucional do __BRAND_NAME__ com visão consolidada de programas e indicadores, sidebar colapsável e cabeçalho de marca."
        path="/templates/dashboard-institucional"
      />
      <h1 className="sr-only">Dashboard Institucional do __BRAND_NAME__</h1>
      {/* ─── Back to DS link (fora do template) ─── */}
      <Link
        to="/templates"
        className="brand-badge-secondary fixed top-3 right-3 z-50 inline-flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={12} /> Voltar ao DS
      </Link>

      {/* ═══ HEADER · Fundo claro · Marca completa com título e subtítulo ═══ */}
      <header className="bg-[#F0F3FF] border-b border-border flex items-center px-5 py-3 gap-4 min-h-[64px] shrink-0 sticky top-0 z-40">
        {/* Menu hamburger (à esquerda) */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="p-1.5 hover:bg-[#0024A9]/10 rounded flex items-center gap-1.5 transition-colors shrink-0"
          aria-label="Menu"
        >
          <Menu size={18} className="text-[#0024A9]" />
          <span className="text-[10px] text-[#0024A9]/70 hidden sm:inline">Menu</span>
        </button>

        {/* Logo __BRAND_NAME__ completa */}
        <div className="flex items-center gap-3 shrink-0">
          <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-[40px] w-auto" />
        </div>

        {/* Separator + Título */}
        <div className="w-px h-8 bg-[#0024A9]/30 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0024A9] leading-tight">
            Dashboard Institucional
          </p>
          <p className="text-xs text-[#0024A9]/70 leading-tight">
            Visão geral consolidada · Programas e Indicadores
          </p>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 hover:bg-[#0024A9]/10 rounded transition-colors shrink-0"
          aria-label="Alternar tema"
        >
          {theme === "dark"
            ? <Moon size={16} className="text-[#0024A9]/70" />
            : <Sun size={16} className="text-[#0024A9]/70" />}
        </button>
      </header>

      {/* ═══ BODY: Sidebar + Conteúdo ═══ */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-[64px] z-30 bg-black/40"
          />
        )}
        {/* ─── Sidebar — baseada em "Menu Lateral — Componente Final" ─── */}
        {sidebarOpen && (
          <aside
            className={`${
              isMobile
                ? "fixed left-0 top-[64px] bottom-0 z-40 w-[260px] shadow-xl"
                : `${collapsed ? "w-16" : "w-[260px]"} shrink-0`
            } bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200`}
          >
            {/* Header sidebar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
              <div className={`flex items-center gap-2 min-w-0 ${collapsed && !isMobile ? "justify-center w-full" : ""}`}>
                <img src={iconeBrandNegativo} alt="__BRAND_NAME__" className="h-[60px] w-[60px] shrink-0" />
                {(!collapsed || isMobile) && <span className="text-sm font-semibold whitespace-nowrap">SIGLA</span>}
              </div>
              {(!collapsed || isMobile) && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search */}
            {(!collapsed || isMobile) && (
              <div className="px-3 py-2">
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sidebar-muted" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar no menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-sidebar-accent text-sidebar-foreground text-xs rounded pl-8 pr-8 py-2 placeholder:text-sidebar-muted border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-muted hover:text-sidebar-foreground transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Nav */}
            <nav className={`flex-1 overflow-y-auto ${collapsed && !isMobile ? "px-1" : "px-2"} pb-4`} aria-label="Menu principal">
              {filteredItems.map((item) => (
                <div key={item.label} className="min-w-0">
                  <button
                    onClick={() => handleItemClick(item)}
                    title={collapsed && !isMobile ? item.label : undefined}
                    aria-label={collapsed && !isMobile ? item.label : undefined}
                    aria-expanded={item.children ? !!expanded[item.label] : undefined}
                    className={`w-full flex items-center ${collapsed && !isMobile ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"} rounded text-sm transition-colors ${
                      activeItem === item.label
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {(!collapsed || isMobile) && (
                      <>
                        <span className="flex-1 min-w-0 text-left text-[13px] truncate">{item.label}</span>
                        {item.children && (
                          expanded[item.label]
                            ? <ChevronDown size={14} className="text-sidebar-muted" />
                            : <ChevronRight size={14} className="text-sidebar-muted" />
                        )}
                      </>
                    )}
                  </button>
                  {(!collapsed || isMobile) && item.children && expanded[item.label] && (
                    <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
                      {item.children
                        .filter((c) => !query || c.label.toLowerCase().includes(query))
                        .map((child) => (
                          <button
                            key={child.label}
                            onClick={() => { setActiveItem(child.label); if (isMobile) setSidebarOpen(false); }}
                            className={`block w-full text-left text-xs px-3 py-1.5 rounded transition-colors truncate ${
                              activeItem === child.label
                                ? "text-sidebar-foreground bg-sidebar-accent/70 font-medium"
                                : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer: collapse toggle */}
            <div className={`border-t border-sidebar-border p-2 ${collapsed && !isMobile ? "flex justify-center" : "px-3"}`}>
              {isMobile ? (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 text-sidebar-muted hover:text-sidebar-foreground text-xs py-1.5 px-2 rounded hover:bg-sidebar-accent/50 transition-colors w-full"
                  aria-label="Fechar menu"
                >
                  <X size={16} /><span>Fechar menu</span>
                </button>
              ) : (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="flex items-center gap-2 text-sidebar-muted hover:text-sidebar-foreground text-xs py-1.5 px-2 rounded hover:bg-sidebar-accent/50 transition-colors w-full"
                  aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                  aria-expanded={!collapsed}
                >
                  {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={16} /><span>Recolher menu</span></>}
                </button>
              )}
            </div>
          </aside>
        )}

        {/* ─── Conteúdo (Dashboard Layout Completa, sem header) ─── */}
        <main className="flex-1 min-w-0 overflow-x-auto">
          {/* Breadcrumb */}
          <nav
            aria-label="Navegação estrutural"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-card border-b border-border text-xs"
          >
            <a
              href="#"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home size={12} />
              <span>Início</span>
            </a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Painéis
            </a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Indicadores
            </a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <span className="font-semibold text-foreground" aria-current="page">
              Dashboard Institucional
            </span>
          </nav>

          {/* Filter bar */}
          <div className="flex items-center gap-2 px-5 py-2 bg-card border-b border-border">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs rounded">
              <Filter size={12} /> Filtros
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-xs rounded">
              <Eye size={12} /> Visão geral
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Resumo + KPIs */}
            <div className="bg-card rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-foreground mb-3">
                <span className="font-bold italic">Resumo da Pesquisa:</span> Categoria · prioridade · setor
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <KPICard icon={Users} title="Total de Servidores" subtitle="Servidores em análise (filtrados)" value="1.019" borderColor="hsl(var(--primary))" />
                <KPICard icon={FileCheck} title="Servidores Regulares" subtitle="Filtro (listar todos)" value="80,00%" borderColor="hsl(var(--success))" />
                <KPICard icon={FileX} title="Servidores Irregulares" subtitle="Filtro (listar todos)" value="20,00%" borderColor="hsl(var(--destructive))" />
                <KPICard icon={Clock} title="Em Análise" subtitle="Aguardando conformidade" value="20,00%" borderColor="hsl(var(--warning))" />
                <KPICard icon={ShieldCheck} title="Auditoria em Andamento" subtitle="Aguardando conformidade" value="2,00%" borderColor="hsl(var(--success))" />
                <KPICard icon={RefreshCw} title="Atualização de Dados" subtitle="Aguardando conformidade" value="+120" borderColor="hsl(var(--warning))" />
              </div>
            </div>

            {/* Tabela auditoria */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <p className="text-sm font-bold text-primary">Auditoria e Irregularidade</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <StatusDot status="Atenção" />
                  <StatusDot status="Regular" />
                  <StatusDot status="Em Ajuste" />
                </div>
              </div>
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-xs" style={{ minWidth: 900 }}>
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
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
                    {tableRows.map((r, i) => (
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
                      <td colSpan={2} className="px-3 py-2 font-semibold text-xs text-right">2.500</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Donut + Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DonutSection />
              <BarChartSection />
            </div>

            {/* Performance */}
            <PerformanceSection />
          </div>

          {/* Footer institucional */}
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-muted/30">
            <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-5 w-auto opacity-60" />
            <span className="text-[10px] text-muted-foreground">Dashboard Institucional · v.1.0</span>
          </div>
        </main>
      </div>
    </div>
  );
}
