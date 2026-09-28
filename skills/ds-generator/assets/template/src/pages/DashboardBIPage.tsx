import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, Sun, Moon, X, Search, ChevronDown, ChevronRight, ChevronLeft,
  Home, BarChart3, PieChart as PieChartIcon, TrendingUp, 
  Filter, Eye, Download, ArrowLeft, MoreVertical,
  Calendar, Layers, Target, Info, FileText, Bell, Shield, Settings, HelpCircle, Folder, FileCheck, FileX, Clock, ShieldCheck, RefreshCw,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { brandCor as brandLogoReduzida } from "@/assets/brand";
import marcaGov from "@/assets/marca-gov.png";
import { brandWhite as iconeBrandNegativo } from "@/assets/brand";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { KPIGridSkeleton, ChartCardSkeleton, PieCardSkeleton, TableSkeleton, TableRowsSkeleton, PaginationSkeleton } from "@/components/bi/BISkeletons";

/* ─── Menu items ─── */
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  children?: { label: string }[];
}

const menuItems: MenuItem[] = [
  { label: "Início", icon: <Home size={16} /> },
  {
    label: "Análises", icon: <BarChart3 size={16} />,
    children: [{ label: "Execução Orçamentária" }, { label: "Repasses __BRAND_NAME__" }, { label: "Indicadores de Gestão" }],
  },
  {
    label: "Relatórios", icon: <FileText size={16} />,
    children: [{ label: "Mensal Consolidado" }, { label: "Relatórios de Auditoria" }, { label: "Exportações" }],
  },
  { label: "Metas e KPIs", icon: <Target size={16} /> },
  { label: "Notificações", icon: <Bell size={16} /> },
  { label: "Segurança", icon: <Shield size={16} /> },
  { label: "Configurações", icon: <Settings size={16} /> },
  { label: "Ajuda", icon: <HelpCircle size={16} /> },
];

/* ─── Dashboard data ─── */
const revenueData = [
  { name: "Jan", valor: 4500 },
  { name: "Fev", valor: 5200 },
  { name: "Mar", valor: 4800 },
  { name: "Abr", valor: 6100 },
  { name: "Mai", valor: 5900 },
  { name: "Jun", valor: 7200 },
];

const categoryData = [
  { name: "Empretec", value: 40, color: "hsl(var(--primary))" },
  { name: "ALI", value: 25, color: "hsl(var(--secondary))" },
  { name: "Programa Inova", value: 20, color: "hsl(var(--warning))" },
  { name: "Outros", value: 15, color: "hsl(var(--muted-foreground))" },
];

const tableRows = [
  { id: "00001", servidor: "Ana Silva Pereira", diretoria: "Diretoria A", status: "Concluído", prazo: "20 Dias", descontos: "R$ 600,00", modalidade: "40h bimestral", unidade: "__BRAND_NAME__", statusTag: "Regular" },
  { id: "00002", servidor: "Bruno Souza Lima", diretoria: "Diretoria A", status: "Em ajuste", prazo: "15 Dias", descontos: "R$ 450,00", modalidade: "40h bimestral", unidade: "__BRAND_NAME__", statusTag: "Atenção" },
  { id: "00003", servidor: "Carla Mendes Rocha", diretoria: "Diretoria B", status: "Concluído", prazo: "30 Dias", descontos: "R$ 720,00", modalidade: "40h bimestral", unidade: "DIRAE/__BRAND_NAME__", statusTag: "Regular" },
  { id: "00004", servidor: "Diego Alves Castro", diretoria: "Diretoria C", status: "Em ajuste", prazo: "10 Dias", descontos: "R$ 380,00", modalidade: "40h bimestral", unidade: "DIRAE/__BRAND_NAME__", statusTag: "Em Ajuste" },
  { id: "00005", servidor: "Eduarda Lopes Tavares", diretoria: "Diretoria B", status: "Concluído", prazo: "25 Dias", descontos: "R$ 510,00", modalidade: "40h bimestral", unidade: "__BRAND_NAME__", statusTag: "Regular" },
  { id: "00006", servidor: "Felipe Nunes Araújo", diretoria: "Diretoria C", status: "Em ajuste", prazo: "18 Dias", descontos: "R$ 420,00", modalidade: "40h bimestral", unidade: "DIRAE/__BRAND_NAME__", statusTag: "Em Ajuste" },
  { id: "00007", servidor: "Gabriela Pinto Sá", diretoria: "Diretoria A", status: "Concluído", prazo: "22 Dias", descontos: "R$ 690,00", modalidade: "40h bimestral", unidade: "__BRAND_NAME__", statusTag: "Regular" },
  { id: "00008", servidor: "Henrique Costa Vieira", diretoria: "Diretoria B", status: "Em ajuste", prazo: "12 Dias", descontos: "R$ 350,00", modalidade: "40h bimestral", unidade: "DIRAE/__BRAND_NAME__", statusTag: "Atenção" },
  { id: "00009", servidor: "Isabela Ramos Duarte", diretoria: "Diretoria C", status: "Concluído", prazo: "28 Dias", descontos: "R$ 740,00", modalidade: "40h bimestral", unidade: "__BRAND_NAME__", statusTag: "Regular" },
  { id: "00010", servidor: "João Pedro Cardoso", diretoria: "Diretoria A", status: "Em ajuste", prazo: "9 Dias", descontos: "R$ 290,00", modalidade: "40h bimestral", unidade: "DIRAE/__BRAND_NAME__", statusTag: "Em Ajuste" },
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

export default function DashboardBIPage() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Análises: true });
  const [activeItem, setActiveItem] = useState("Dashboard BI");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isPaging, setIsPaging] = useState(false);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
  const pageRows = tableRows.slice((page - 1) * pageSize, page * pageSize);

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next === page) return;
    setIsPaging(true);
    setTimeout(() => {
      setPage(next);
      setIsPaging(false);
    }, 500);
  };

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const reload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 900);
  };

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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* ─── Back to DS (fora do template) ─── */}
      <Link
        to="/templates"
        className="brand-badge-secondary fixed top-3 right-3 z-50 inline-flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={12} /> Voltar ao DS
      </Link>

      {/* ═══ HEADER · Fundo claro · Marca completa com título e subtítulo ═══ */}
      <header className="bg-accent border-b border-border flex items-center px-5 py-3 gap-4 min-h-[64px] shrink-0 sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="p-1.5 hover:bg-primary/10 rounded-md flex items-center gap-1.5 transition-colors shrink-0"
          aria-label="Menu"
        >
          <Menu size={18} className="text-primary" />
          <span className="text-[10px] text-primary/70 hidden sm:inline">Menu</span>
        </button>

        <div className="flex items-center gap-3 shrink-0">
          <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-[40px] w-auto" />
        </div>

        <div className="w-px h-8 bg-primary/30 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary leading-tight">
            Painel Executivo de BI
          </p>
          <p className="text-xs text-primary/70 leading-tight">
            Análise de Indicadores e Performance Institucional
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 hover:bg-primary/10 rounded-md transition-colors shrink-0"
          aria-label="Alternar tema"
        >
          {theme === "dark"
            ? <Moon size={16} className="text-primary/70" />
            : <Sun size={16} className="text-primary/70" />}
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
        {/* ─── Sidebar — padrão Menu Lateral (tokens sidebar-*) ─── */}
        {sidebarOpen && (
          <aside
            className={`${
              isMobile
                ? "fixed left-0 top-[64px] bottom-0 z-40 w-[260px] shadow-xl"
                : `${collapsed ? "w-16" : "w-[260px]"} shrink-0`
            } bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200`}
          >
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

        {/* ─── Main Content ─── */}
        <main className="flex-1 min-w-0 overflow-x-auto">
          {/* Breadcrumb */}
          <nav aria-label="Navegação estrutural" className="flex items-center gap-1.5 px-5 py-2.5 bg-card border-b border-border text-xs">
            <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <Home size={12} />
              <span>Início</span>
            </a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Painéis de BI</a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <span className="font-semibold text-foreground" aria-current="page">Dashboard BI</span>
          </nav>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 px-5 py-2 bg-card border-b border-border">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs rounded-md">
              <Filter size={12} /> Filtros Avançados
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-xs rounded-md">
              <Download size={12} /> Exportar PDF
            </button>
            <button
              onClick={reload}
              disabled={isLoading}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground hover:bg-muted transition-colors text-xs rounded-md disabled:opacity-60"
              aria-label="Recarregar dados"
            >
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} /> Atualizar
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* KPIs */}
            {isLoading ? (
              <KPIGridSkeleton count={4} />
            ) : (
            <div className="bg-card rounded-lg border border-border p-3" aria-busy={isLoading}>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                <span className="font-bold italic">Visão Geral:</span> Principais Métricas de Performance
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <KPICard icon={BarChart3} title="Repasse Total" subtitle="vs mês anterior (+12.5%)" value="R$ 12.4M" borderColor="hsl(var(--primary))" />
                <KPICard icon={Layers} title="Projetos Ativos" subtitle="Novos projetos (+4.3%)" value="342" borderColor="hsl(var(--secondary))" />
                <KPICard icon={Target} title="Taxa de Execução" subtitle="Meta mensal (-2.1%)" value="78.4%" borderColor="hsl(var(--success))" />
                <KPICard icon={TrendingUp} title="Novas Demandas" subtitle="Crescimento (+18.7%)" value="1.2k" borderColor="hsl(var(--warning))" />
              </div>
            </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Area Chart */}
              {isLoading ? (
                <ChartCardSkeleton height={280} className="lg:col-span-2" />
              ) : (
              <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4">
                <p className="text-sm font-bold text-primary mb-4">Evolução dos Repasses</p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          fontSize: 11,
                          borderRadius: "var(--radius)",
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                      <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              )}

              {/* Pie Chart */}
              {isLoading ? (
                <PieCardSkeleton />
              ) : (
              <div className="bg-card rounded-lg border border-border p-4">
                <p className="text-sm font-bold text-primary mb-4">Distribuição por Programa</p>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={4} strokeWidth={0}>
                        {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          fontSize: 11,
                          borderRadius: "var(--radius)",
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Table */}
            {isLoading ? (
              <TableSkeleton rows={4} cols={7} />
            ) : (
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-primary">Detalhamento de Execução</p>
                <div className="flex items-center gap-3">
                  <StatusDot status="Atenção" />
                  <StatusDot status="Regular" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" style={{ minWidth: 800 }}>
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-3 py-2 text-left font-medium">ID</th>
                      <th className="px-3 py-2 text-left font-medium">Servidor Responsável</th>
                      <th className="px-3 py-2 text-left font-medium">Diretoria</th>
                      <th className="px-3 py-2 text-left font-medium">Status de Fluxo</th>
                      <th className="px-3 py-2 text-left font-medium">Prazo Estimado</th>
                      <th className="px-3 py-2 text-left font-medium">Unidade Gestora</th>
                      <th className="px-3 py-2 text-left font-medium">Status Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isPaging ? (
                      <TableRowsSkeleton rows={pageSize} cols={7} />
                    ) : (
                      pageRows.map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                        <td className="px-3 py-2 text-muted-foreground">{r.id}</td>
                        <td className="px-3 py-2 font-medium">{r.servidor}</td>
                        <td className="px-3 py-2">{r.diretoria}</td>
                        <td className="px-3 py-2">{r.status}</td>
                        <td className="px-3 py-2">{r.prazo}</td>
                        <td className="px-3 py-2">{r.unidade}</td>
                        <td className="px-3 py-2"><StatusDot status={r.statusTag} /></td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {isPaging ? (
                <PaginationSkeleton />
              ) : (
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span>
                    Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, tableRows.length)} de {tableRows.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const n = i + 1;
                      const active = n === page;
                      return (
                        <button
                          key={n}
                          onClick={() => goToPage(n)}
                          className={`h-7 w-7 inline-flex items-center justify-center rounded-md border text-xs transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:bg-muted"
                          }`}
                          aria-current={active ? "page" : undefined}
                          aria-label={`Página ${n}`}
                        >
                          {n}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
                      aria-label="Próxima página"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Institutional Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-muted/30">
            <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-5 w-auto opacity-60" />
            <span className="text-[10px] text-muted-foreground">Dashboard BI · Analytics v.2.0</span>
          </div>
        </main>
      </div>
    </div>
  );
}
