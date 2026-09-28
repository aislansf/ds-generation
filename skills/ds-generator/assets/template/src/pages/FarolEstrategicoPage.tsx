import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu, Sun, Moon, X, Search, ChevronDown, ChevronRight,
  Home, BarChart3, FileText, Target, Bell, Shield, Settings, HelpCircle,
  Filter, Download, ArrowLeft, RefreshCw, RotateCcw, MessageSquareText, Clock,
  PanelLeftClose, PanelLeftOpen, TrendingUp, TrendingDown, Users, Wallet, BookOpen,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, LabelList,
} from "recharts";
import { brandCor as brandLogoReduzida, brandWhite as iconeBrandNegativo } from "@/assets/brand";
import headerBusinessBgAsset from "@/assets/header-business-bg.png.asset.json";
const headerBusinessBg = headerBusinessBgAsset.url;
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { KPIGridSkeleton, ChartCardSkeleton } from "@/components/bi/BISkeletons";
import { downloadFarolReact, downloadFarolVanilla } from "@/utils/farolDownload";
import {
  despesasMensais, trimestresTotais, despesasPorNatureza,
  kpiDespesas, kpiReceitas, kpiAtendimento,
  filterOptions, defaultFilters, filterLabels, formatBRL, formatBRLFull,
  type FilterKey, type FiltersState,
} from "@/data/farolEstrategico";

/* ─── Menu lateral (padrão Menu Lateral Final) ─── */
interface MenuItem { label: string; icon: React.ReactNode; children?: { label: string }[]; }
const menuItems: MenuItem[] = [
  { label: "Início", icon: <Home size={16} /> },
  {
    label: "Painéis Estratégicos", icon: <BarChart3 size={16} />,
    children: [{ label: "Farol Estratégico" }, { label: "Execução Orçamentária" }, { label: "Indicadores PPA" }],
  },
  { label: "Metas e KPIs", icon: <Target size={16} /> },
  { label: "Relatórios", icon: <FileText size={16} /> },
  { label: "Notificações", icon: <Bell size={16} /> },
  { label: "Segurança", icon: <Shield size={16} /> },
  { label: "Configurações", icon: <Settings size={16} /> },
  { label: "Ajuda", icon: <HelpCircle size={16} /> },
];

type Aba = "despesas" | "receitas" | "atendimento";

/* ─── Componentes auxiliares ─── */
function KPIBig({ value, label, accent = "primary", trend }: {
  value: string; label: string; accent?: "primary" | "secondary" | "success" | "warning" | "destructive";
  trend?: { dir: "up" | "down"; pct: string };
}) {
  const color = `hsl(var(--${accent}))`;
  return (
    <div className="bg-card rounded-lg border border-border p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
      <p className="text-2xl md:text-3xl font-bold mt-1" style={{ color }}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {trend && (
        <div className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold ${trend.dir === "up" ? "text-success" : "text-destructive"}`}>
          {trend.dir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend.pct}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ name, value, onChange }: {
  name: FilterKey; value: string; onChange: (v: string) => void;
}) {
  const opts = filterOptions[name];
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">
        {filterLabels[name]}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full border border-input rounded px-3 py-2 pr-8 text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors cursor-pointer"
        >
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function FarolEstrategicoPage() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "Painéis Estratégicos": true });
  const [activeItem, setActiveItem] = useState("Farol Estratégico");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aba, setAba] = useState<Aba>("despesas");
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const reload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  const clearFilters = () => setFilters(defaultFilters);
  const hasActiveFilters = useMemo(
    () => (Object.keys(filters) as FilterKey[]).some((k) => filters[k] !== "Todos"),
    [filters],
  );

  /** Fator de atenuação proporcional ao nº de filtros ativos (apenas demonstração visual). */
  const factor = useMemo(() => {
    const active = (Object.keys(filters) as FilterKey[]).filter((k) => filters[k] !== "Todos").length;
    return Math.max(0.3, 1 - active * 0.08);
  }, [filters]);

  const mensais = useMemo(
    () => despesasMensais.map((m) => ({
      mes: m.mes.slice(0, 3),
      Planejada: Math.round(m.planejada * factor),
      Executada: Math.round(m.executada * factor),
    })),
    [factor],
  );

  const naturezas = useMemo(() => {
    const base = despesasPorNatureza.map((n) => ({ ...n, valor: Math.round(n.valor * factor) }));
    if (filters.natureza !== "Todos") {
      const f = base.find((n) => n.label === filters.natureza);
      return f ? [f] : base;
    }
    return base;
  }, [factor, filters.natureza]);

  const kpisDespesa = useMemo(() => ({
    original: Math.round(kpiDespesas.original * factor),
    planejada: Math.round(kpiDespesas.planejada * factor),
    executada: Math.round(kpiDespesas.executada * factor),
  }), [factor]);

  const query = searchQuery.toLowerCase().trim();
  const filteredItems = query
    ? menuItems.filter((item) =>
        item.label.toLowerCase().includes(query) ||
        item.children?.some((c) => c.label.toLowerCase().includes(query)))
    : menuItems;

  const handleItemClick = (item: MenuItem) => {
    if (collapsed && !isMobile) { setCollapsed(false); setActiveItem(item.label); return; }
    setActiveItem(item.label);
    if (item.children) setExpanded((p) => ({ ...p, [item.label]: !p[item.label] }));
    if (isMobile && !item.children) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Link
        to="/templates"
        className="brand-badge-secondary fixed top-3 right-3 z-50 inline-flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={12} /> Voltar ao DS
      </Link>

      {/* HEADER — Composição visual (negócios) · Sem título */}
      <header className="shrink-0 sticky top-0 z-40 border-b border-border bg-background">
        <div
          role="img"
          aria-label="Clareza que o mercado exige para o futuro dos negócios"
          style={{
            height: "112px",
            backgroundImage: `url(${headerBusinessBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="text-white flex items-center px-4 gap-3"
          style={{ height: "36px", minHeight: "36px", maxHeight: "52px", backgroundColor: "#123148" }}
        >
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0"
            aria-label="Menu"
          >
            <Menu size={18} />
            <span className="text-[10px] hidden sm:inline">Menu</span>
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-white/10 rounded transition-colors shrink-0"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Moon size={16} className="text-white/80" /> : <Sun size={16} className="text-white/80" />}
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex min-h-0 relative">
        {isMobile && sidebarOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-[148px] z-30 bg-black/40"
          />
        )}

        {sidebarOpen && (
          <aside
            className={`${
              isMobile
                ? "fixed left-0 top-[148px] bottom-0 z-40 w-[260px] shadow-xl"
                : `${collapsed ? "w-16" : "w-[260px]"} shrink-0`
            } bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
              <div className={`flex items-center gap-2 min-w-0 ${collapsed && !isMobile ? "justify-center w-full" : ""}`}>
                {(!collapsed || isMobile) && <span className="text-sm font-semibold whitespace-nowrap">Farol Estratégico - BI</span>}
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

        {/* MAIN */}
        <main className="flex-1 min-w-0 overflow-x-auto">
          {/* Breadcrumb */}
          <nav aria-label="Navegação estrutural" className="flex items-center gap-1.5 px-5 py-2.5 bg-card border-b border-border text-xs">
            <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <Home size={12} /><span>Início</span>
            </a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Painéis Estratégicos</a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <span className="font-semibold text-foreground" aria-current="page">Farol Estratégico</span>
            <Link
              to="/modelos-bi/farol-estrategico/docs"
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <BookOpen size={12} /> Ver documentação
            </Link>
          </nav>

          {/* Toolbar superior — feedback + atualizações */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-2 bg-card border-b border-border">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none"
            >
              <RotateCcw size={12} /> Limpar Filtros
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-xs rounded-md">
              <MessageSquareText size={12} /> Dê seu feedback!
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground hover:bg-muted transition-colors text-xs rounded-md">
              <Download size={12} /> Exportar
            </button>
            <button
              onClick={() => downloadFarolReact()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground hover:bg-muted transition-colors text-xs rounded-md"
              title="Baixa um pacote .zip com o template em React + TS pronto para npm install"
            >
              <Download size={12} /> Código-fonte (React)
            </button>
            <button
              onClick={() => downloadFarolVanilla()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground hover:bg-muted transition-colors text-xs rounded-md"
              title="Baixa um pacote .zip estático em HTML/CSS/JS — abre direto no navegador"
            >
              <Download size={12} /> Código-fonte (HTML/CSS/JS)
            </button>

            <div className="ml-auto flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-primary" />
                <span><span className="font-semibold text-foreground">Última atualização:</span> Hoje, às 08:08</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw size={12} className="text-primary" />
                <span><span className="font-semibold text-foreground">Próxima:</span> Amanhã, às 07:00</span>
              </div>
              <button
                onClick={reload}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground hover:bg-muted transition-colors text-xs rounded-md disabled:opacity-60"
                aria-label="Recarregar dados"
              >
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} /> Atualizar
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* FILTROS */}
            <section className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={14} className="text-primary" />
                <p className="text-sm font-bold text-primary">Filtros Estratégicos</p>
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                    Filtros ativos
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(filterOptions) as FilterKey[]).map((k) => (
                  <FilterSelect
                    key={k}
                    name={k}
                    value={filters[k]}
                    onChange={(v) => setFilters((prev) => ({ ...prev, [k]: v }))}
                  />
                ))}
              </div>
            </section>

            {/* TABS */}
            <div role="tablist" aria-label="Categorias do painel" className="flex flex-wrap gap-1 bg-muted/30 p-1 rounded-lg border border-border w-fit">
              {([
                { id: "despesas", label: "Despesas", icon: <Wallet size={12} /> },
                { id: "receitas", label: "Receitas", icon: <TrendingUp size={12} /> },
                { id: "atendimento", label: "Atendimento Geral", icon: <Users size={12} /> },
              ] as { id: Aba; label: string; icon: React.ReactNode }[]).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={aba === t.id}
                  onClick={() => setAba(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    aba === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* KPIs */}
            {isLoading ? (
              <KPIGridSkeleton count={3} />
            ) : aba === "despesas" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <KPIBig value={formatBRL(kpisDespesa.original)} label="Valor Despesa Original" accent="primary" />
                <KPIBig value={formatBRL(kpisDespesa.planejada)} label="Valor Despesa Planejada" accent="secondary" />
                <KPIBig value={formatBRL(kpisDespesa.executada)} label="Valor Despesa Executada" accent="success" trend={{ dir: "down", pct: "-12,5%" }} />
              </div>
            ) : aba === "receitas" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <KPIBig value={formatBRL(kpiReceitas.prevista)} label="Receita Prevista" accent="primary" />
                <KPIBig value={formatBRL(kpiReceitas.realizada)} label="Receita Realizada" accent="success" trend={{ dir: "up", pct: "+8,2%" }} />
                <KPIBig value={formatBRL(kpiReceitas.saldo)} label="Saldo a Realizar" accent="warning" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <KPIBig value={kpiAtendimento.meiAtendidos.toLocaleString("pt-BR")} label="MEIs atendidos" accent="primary" trend={{ dir: "up", pct: "+12,1%" }} />
                <KPIBig value={kpiAtendimento.pequenosAtendidos.toLocaleString("pt-BR")} label="Pequenos negócios" accent="secondary" />
                <KPIBig value={kpiAtendimento.totalEventos.toLocaleString("pt-BR")} label="Eventos realizados" accent="success" />
              </div>
            )}

            {/* GRÁFICO MENSAL */}
            {isLoading ? (
              <ChartCardSkeleton height={320} />
            ) : (
              <section className="bg-card rounded-lg border border-border p-4">
                <p className="text-sm font-bold text-primary mb-1">Despesa Planejada vs Executada</p>
                <p className="text-[11px] text-muted-foreground mb-3">Comparativo mensal · valores em R$</p>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mensais} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => formatBRL(Number(v))}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        contentStyle={{
                          fontSize: 11,
                          borderRadius: "var(--radius)",
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          color: "hsl(var(--card-foreground))",
                        }}
                        formatter={(value: number) => formatBRLFull(Number(value))}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Planejada" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Executada" fill="hsl(var(--secondary))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Totais trimestrais */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 border-t border-border pt-3">
                  {trimestresTotais.map((t) => (
                    <div key={t.label} className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.label}</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{formatBRL(Math.round(t.total * factor))}</p>
                      <p className="text-[10px] text-primary font-semibold">{t.pct}%</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* DETALHAMENTO POR NATUREZA */}
            {isLoading ? (
              <ChartCardSkeleton height={360} />
            ) : (
              <section className="bg-card rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-bold text-primary">Detalhamento por Natureza</p>
                    <p className="text-[11px] text-muted-foreground">Top categorias de despesa executada</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground">
                    {naturezas.length} {naturezas.length === 1 ? "categoria" : "categorias"}
                  </span>
                </div>
                <div style={{ height: Math.max(220, naturezas.length * 38) }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={naturezas}
                      layout="vertical"
                      margin={{ top: 0, right: 80, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => formatBRL(Number(v))}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        tick={{ fontSize: 10 }}
                        width={220}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 11,
                          borderRadius: "var(--radius)",
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          color: "hsl(var(--card-foreground))",
                        }}
                        formatter={(value: number) => formatBRLFull(Number(value))}
                      />
                      <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                        <LabelList
                          dataKey="valor"
                          position="right"
                          formatter={(v: number) => formatBRL(Number(v))}
                          style={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-muted/30">
            <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-5 w-auto opacity-60" />
            <span className="text-[10px] text-muted-foreground">Farol Estratégico · Painel Institucional v.1.0</span>
          </div>
        </main>
      </div>
    </div>
  );
}