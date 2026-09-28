import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, Filter, X, Download, ChevronRight, ChevronDown,
  Calendar, MapPin, Tag, MoreVertical, Eye, Pencil, Trash2,
  Menu, Sun, Moon, Home, GraduationCap, Wallet, BarChart3, Users,
  FileText, Bell, Shield, Settings, HelpCircle,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { brandCor as brandLogoReduzida, brandWhite as iconeBrandNegativo } from "@/assets/brand";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem { label: string; icon: React.ReactNode; children?: { label: string }[] }
const menuItems: MenuItem[] = [
  { label: "Início", icon: <Home size={16} /> },
  { label: "Atendimento", icon: <Users size={16} />, children: [
    { label: "Pequenos Negócios" }, { label: "MEI" }, { label: "Produtor Rural" },
  ]},
  { label: "Capacitação", icon: <GraduationCap size={16} />, children: [
    { label: "Cursos" }, { label: "Eventos" }, { label: "Empreender" },
  ]},
  { label: "Soluções", icon: <Wallet size={16} />, children: [
    { label: "Consultoria" }, { label: "Programa Inova" }, { label: "AGI" },
  ]},
  { label: "Indicadores", icon: <BarChart3 size={16} /> },
  { label: "Documentos", icon: <FileText size={16} />, children: [
    { label: "Normativos" }, { label: "Manuais" },
  ]},
  { label: "Notificações", icon: <Bell size={16} /> },
  { label: "Segurança", icon: <Shield size={16} /> },
  { label: "Configurações", icon: <Settings size={16} /> },
  { label: "Ajuda", icon: <HelpCircle size={16} /> },
];

interface Row {
  id: string;
  iniciativa: string;
  unidade: string;
  modalidade: string;
  uf: string;
  inicio: string;
  status: "Aprovado" | "Em Análise" | "Pendente" | "Rejeitado" | "Concluído";
  valor: string;
}

const rows: Row[] = [
  { id: "SOL-0001", iniciativa: "Empreender — Seminário de Empreendedorismo", unidade: "UCAP", modalidade: "Capacitação presencial", uf: "SP", inicio: "10/03/2026", status: "Aprovado",   valor: "R$ 1.240.000,00" },
  { id: "SOL-0002", iniciativa: "AGI — Agentes de Inovação",       unidade: "UINOV", modalidade: "Atendimento individual",  uf: "SP", inicio: "05/01/2026", status: "Em Análise", valor: "R$ 780.500,00" },
  { id: "SOL-0003", iniciativa: "Programa Inova — Inovação e Tecnologia",      unidade: "UINOV", modalidade: "Consultoria tecnológica", uf: "SP", inicio: "20/04/2026", status: "Aprovado",   valor: "R$ 2.150.000,00" },
  { id: "SOL-0004", iniciativa: "Visita Técnica",                      unidade: "UNEG", modalidade: "Atendimento individual",  uf: "SP", inicio: "15/05/2026", status: "Pendente",   valor: "R$ 4.890.000,00" },
  { id: "SOL-0005", iniciativa: "Gestão Avançada — Pequenas Empresas",        unidade: "UNEG", modalidade: "Capacitação à distância", uf: "SP", inicio: "10/02/2026", status: "Aprovado",   valor: "R$ 6.320.000,00" },
  { id: "SOL-0006", iniciativa: "MEI — Microempreendedor Individual",     unidade: "UMEP", modalidade: "Atendimento coletivo",    uf: "SP", inicio: "30/06/2026", status: "Rejeitado",  valor: "R$ 540.000,00" },
  { id: "SOL-0007", iniciativa: "Elas Empreendem — Mulheres de Negócio",     unidade: "UNEG", modalidade: "Capacitação presencial",  uf: "SP", inicio: "31/03/2026", status: "Em Análise", valor: "R$ 1.890.000,00" },
  { id: "SOL-0008", iniciativa: "Inovação Aberta — __BRAND_NAME__",            unidade: "UINOV", modalidade: "Edital",                   uf: "SP", inicio: "12/07/2026", status: "Concluído",  valor: "R$ 320.000,00" },
];

const STATUSES = ["Aprovado", "Em Análise", "Pendente", "Rejeitado", "Concluído"] as const;
const UNIDADES = ["UCAP", "UINOV", "UNEG", "UMEP"];
const MODALIDADES = [
  "Atendimento individual", "Atendimento coletivo",
  "Capacitação presencial", "Capacitação à distância",
  "Consultoria tecnológica", "Edital",
];

function StatusPill({ s }: { s: Row["status"] }) {
  const tone: Record<Row["status"], string> = {
    "Aprovado":   "hsl(var(--success))",
    "Em Análise": "hsl(var(--warning))",
    "Pendente":   "hsl(var(--primary))",
    "Rejeitado":  "hsl(var(--destructive))",
    "Concluído":  "hsl(var(--muted-foreground))",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: tone[s] }} />
      {s}
    </span>
  );
}

export default function PaginaFiltrosTabelaPage() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Atendimento: true });
  const [activeItem, setActiveItem] = useState("Soluções");
  const [menuSearch, setMenuSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState("");
  const [unidades, setUnidades] = useState<string[]>([]);
  const [modalidades, setModalidades] = useState<string[]>([]);
  const [statusSel, setStatusSel] = useState<string[]>([]);
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");
  const [openKebab, setOpenKebab] = useState<string | null>(null);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const parseValor = (v: string) => Number(v.replace(/[^\d]/g, "")) / 100;

  const filtered = useMemo(() => {
    const min = valorMin ? Number(valorMin) : -Infinity;
    const max = valorMax ? Number(valorMax) : Infinity;
    return rows.filter(r => {
      if (q && !`${r.iniciativa} ${r.id} ${r.unidade}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (unidades.length && !unidades.includes(r.unidade)) return false;
      if (modalidades.length && !modalidades.includes(r.modalidade)) return false;
      if (statusSel.length && !statusSel.includes(r.status)) return false;
      const v = parseValor(r.valor);
      if (v < min || v > max) return false;
      return true;
    });
  }, [q, unidades, modalidades, statusSel, valorMin, valorMax]);

  const activeFilters =
    unidades.length + modalidades.length + statusSel.length +
    (valorMin ? 1 : 0) + (valorMax ? 1 : 0) + (q ? 1 : 0);

  const clearAll = () => {
    setQ(""); setUnidades([]); setModalidades([]); setStatusSel([]); setValorMin(""); setValorMax("");
  };

  const mq = menuSearch.toLowerCase().trim();
  const filteredMenu = mq
    ? menuItems.filter(it => it.label.toLowerCase().includes(mq) || it.children?.some(c => c.label.toLowerCase().includes(mq)))
    : menuItems;

  const handleMenuClick = (item: MenuItem) => {
    if (collapsed && !isMobile) { setCollapsed(false); setActiveItem(item.label); return; }
    setActiveItem(item.label);
    if (item.children) setExpanded(p => ({ ...p, [item.label]: !p[item.label] }));
    if (isMobile && !item.children) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
      {/* Back to DS */}
      <Link
        to="/templates"
        className="brand-badge-secondary fixed top-3 right-3 z-50 inline-flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={12} /> Voltar ao DS
      </Link>

      {/* ═══ Header · Fundo claro · Marca completa com título e subtítulo ═══ */}
      <header className="bg-[#F0F3FF] border-b border-border flex items-center px-5 py-3 gap-4 min-h-[64px] shrink-0 sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-1.5 hover:bg-[#0024A9]/10 rounded flex items-center gap-1.5 transition-colors shrink-0"
          aria-label="Menu"
        >
          <Menu size={18} className="text-[#0024A9]" />
          <span className="text-[10px] text-[#0024A9]/70 hidden sm:inline">Menu</span>
        </button>
        <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-[40px] w-auto shrink-0" />
        <div className="w-px h-8 bg-[#0024A9]/30 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0024A9] leading-tight truncate">
            Soluções __BRAND_SHORT__
          </p>
          <p className="text-xs text-[#0024A9]/70 leading-tight truncate">
            Catálogo de soluções para os pequenos negócios — __BRAND_NAME__
          </p>
        </div>
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

      {/* ═══ BODY: Sidebar institucional + Conteúdo ═══ */}
      <div className="flex-1 flex min-h-0 relative">
        {isMobile && sidebarOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-[64px] z-30 bg-black/40"
          />
        )}
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
                {(!collapsed || isMobile) && <span className="text-sm font-semibold whitespace-nowrap">Menu</span>}
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
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full bg-sidebar-accent text-sidebar-foreground text-xs rounded pl-8 pr-8 py-2 placeholder:text-sidebar-muted border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
                  />
                  {menuSearch && (
                    <button
                      onClick={() => { setMenuSearch(""); searchRef.current?.focus(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-muted hover:text-sidebar-foreground transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <nav className={`flex-1 overflow-y-auto ${collapsed && !isMobile ? "px-1" : "px-2"} pb-4`} aria-label="Menu principal">
              {filteredMenu.map((item) => (
                <div key={item.label} className="min-w-0">
                  <button
                    onClick={() => handleMenuClick(item)}
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
                        .filter(c => !mq || c.label.toLowerCase().includes(mq))
                        .map(child => (
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
                >
                  <X size={16} /><span>Fechar menu</span>
                </button>
              ) : (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="flex items-center gap-2 text-sidebar-muted hover:text-sidebar-foreground text-xs py-1.5 px-2 rounded hover:bg-sidebar-accent/50 transition-colors w-full"
                  aria-expanded={!collapsed}
                >
                  {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={16} /><span>Recolher menu</span></>}
                </button>
              )}
            </div>
          </aside>
        )}

        {/* ─── Conteúdo ─── */}
        <main className="flex-1 min-w-0 overflow-x-auto">
          {/* Breadcrumb */}
          <nav aria-label="Navegação estrutural" className="flex items-center gap-1.5 px-5 py-2.5 bg-card border-b border-border text-xs">
            <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <Home size={12} /><span>Início</span>
            </a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Soluções</a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <span className="font-semibold text-foreground" aria-current="page">Catálogo</span>
          </nav>

          {/* Action bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-2 bg-card border-b border-border">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded">
                <Filter size={12} /> {activeFilters} filtro{activeFilters === 1 ? "" : "s"} ativo{activeFilters === 1 ? "" : "s"}
              </span>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted transition-colors">
              <Download size={14} /> Exportar CSV
            </button>
          </div>

          {/* Filtros (sidebar interna) + Tabela */}
          <div className="p-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">

        {/* ── Sidebar filtros ── */}
        <aside className="bg-card rounded-lg border border-border p-4 h-fit lg:sticky lg:top-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5">
              <Filter size={14} /> Filtros
            </h2>
            {activeFilters > 0 && (
              <button onClick={clearAll} className="text-[11px] text-primary hover:underline inline-flex items-center gap-1">
                <X size={11} /> Limpar ({activeFilters})
              </button>
            )}
          </div>

          {/* Busca */}
          <div className="mb-5">
            <label htmlFor="q" className="block text-[11px] font-semibold text-muted-foreground mb-1.5">BUSCAR</label>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="q"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Iniciativa, ID, unidade..."
                className="w-full border border-input rounded-md bg-background pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Unidade */}
          <fieldset className="mb-5">
            <legend className="text-[11px] font-semibold text-muted-foreground mb-1.5 inline-flex items-center gap-1.5">
              <MapPin size={11} /> UNIDADE
            </legend>
            <div className="space-y-1.5">
              {UNIDADES.map(u => (
                <label key={u} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={unidades.includes(u)}
                    onChange={() => toggle(unidades, setUnidades, u)}
                    className="h-3.5 w-3.5 rounded border-input accent-primary"
                  />
                  <span className="text-foreground">{u}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Status */}
          <fieldset className="mb-5">
            <legend className="text-[11px] font-semibold text-muted-foreground mb-1.5 inline-flex items-center gap-1.5">
              <Tag size={11} /> STATUS
            </legend>
            <div className="space-y-1.5">
              {STATUSES.map(s => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusSel.includes(s)}
                    onChange={() => toggle(statusSel, setStatusSel, s)}
                    className="h-3.5 w-3.5 rounded border-input accent-primary"
                  />
                  <span className="text-foreground">{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Modalidade */}
          <fieldset className="mb-5">
            <legend className="text-[11px] font-semibold text-muted-foreground mb-1.5 inline-flex items-center gap-1.5">
              <Calendar size={11} /> MODALIDADE
            </legend>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {MODALIDADES.map(m => (
                <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalidades.includes(m)}
                    onChange={() => toggle(modalidades, setModalidades, m)}
                    className="h-3.5 w-3.5 rounded border-input accent-primary"
                  />
                  <span className="text-foreground">{m}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Valor */}
          <fieldset>
            <legend className="text-[11px] font-semibold text-muted-foreground mb-1.5">VALOR (R$)</legend>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number" inputMode="numeric" placeholder="Mín."
                value={valorMin}
                onChange={e => setValorMin(e.target.value)}
                className="w-full border border-input rounded-md bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number" inputMode="numeric" placeholder="Máx."
                value={valorMax}
                onChange={e => setValorMax(e.target.value)}
                className="w-full border border-input rounded-md bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </fieldset>
        </aside>

        {/* ── Tabela ── */}
        <section className="bg-card rounded-lg border border-border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h1 className="text-base font-semibold" style={{ color: "#16329C" }}>Iniciativas</h1>
              <p className="text-xs text-muted-foreground">
                {filtered.length} de {rows.length} resultado{rows.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#16329C] text-white">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">ID</th>
                  <th className="text-left font-medium px-4 py-2.5">Iniciativa</th>
                  <th className="text-left font-medium px-4 py-2.5">Unidade</th>
                  <th className="text-left font-medium px-4 py-2.5">Modalidade</th>
                  <th className="text-left font-medium px-4 py-2.5">Início</th>
                  <th className="text-left font-medium px-4 py-2.5">Status</th>
                  <th className="text-right font-medium px-4 py-2.5">Valor</th>
                  <th className="px-3 py-2.5 w-8" aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-10 text-muted-foreground text-sm">
                      Nenhum resultado encontrado. Ajuste os filtros e tente novamente.
                    </td>
                  </tr>
                )}
                {filtered.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{r.id}</td>
                    <td className="px-4 py-3 text-foreground">{r.iniciativa}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.unidade}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.modalidade}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.inicio}</td>
                    <td className="px-4 py-3"><StatusPill s={r.status} /></td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground tabular-nums">{r.valor}</td>
                    <td className="px-3 py-3 relative">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setOpenKebab(openKebab === r.id ? null : r.id); }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                        aria-label={`Ações para ${r.id}`}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openKebab === r.id && (
                        <div
                          className="absolute right-2 top-9 z-10 w-40 bg-popover border border-border rounded-md shadow-lg py-1 animate-in fade-in-50"
                          onMouseLeave={() => setOpenKebab(null)}
                        >
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground"><Eye size={12} /> Visualizar</button>
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground"><Pencil size={12} /> Editar</button>
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-destructive"><Trash2 size={12} /> Excluir</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
          </div>

          {/* Footer institucional */}
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-muted/30">
            <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-5 w-auto opacity-60" />
            <span className="text-[10px] text-muted-foreground">Soluções __BRAND_SHORT__ · v.1.0</span>
          </div>
        </main>
      </div>
    </div>
  );
}
