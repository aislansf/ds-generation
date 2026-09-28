import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Menu, Sun, Moon, ArrowLeft, Home, ChevronRight, ChevronDown,
  Search, Filter, X, Download, Plus, MoreVertical,
  TrendingUp, Trophy,
  ChevronLeft,
  Eye, Pencil, Trash2,
  GraduationCap, Wallet, BarChart3, Users, FileText, Bell, Shield, Settings, HelpCircle, Folder,
} from "lucide-react";
import { brandCor as brandLogoReduzida } from "@/assets/brand";
import { brandWhite as iconeBrandNegativo } from "@/assets/brand";
import { useTheme } from "@/hooks/useTheme";
import headerBusinessBgAsset from "@/assets/header-business-bg.png.asset.json";
const headerBusinessBg = headerBusinessBgAsset.url;
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
    children: [{ label: "Empreender" }, { label: "AGI" }, { label: "Programa Inova" }, { label: "Visita Técnica" }],
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

/* ─── Mock data ─── */
interface SubItem {
  parcela: string;
  vencimento: string;
  valor: string;
  status: string;
}
interface Row {
  id: string;
  programa: string;
  responsavel: string;
  unidade: string;
  modalidade: string;
  valor: string;
  status: "Aprovado" | "Em Análise" | "Pendente" | "Rejeitado";
  subRows: SubItem[];
}

const rows: Row[] = [
  {
    id: "PRG-00021", programa: "Empreender — Empreendedorismo", responsavel: "Ana Silva Pereira",
    unidade: "DIROP/__BRAND_NAME__", modalidade: "Repasse trimestral", valor: "R$ 1.240.000,00", status: "Aprovado",
    subRows: [
      { parcela: "1ª Parcela", vencimento: "10/03/2026", valor: "R$ 310.000,00", status: "Pago" },
      { parcela: "2ª Parcela", vencimento: "10/06/2026", valor: "R$ 310.000,00", status: "Pago" },
      { parcela: "3ª Parcela", vencimento: "10/09/2026", valor: "R$ 310.000,00", status: "Agendado" },
      { parcela: "4ª Parcela", vencimento: "10/12/2026", valor: "R$ 310.000,00", status: "Agendado" },
    ],
  },
  {
    id: "PRG-00022", programa: "AGI — Agentes de Inovação", responsavel: "Bruno Souza Lima",
    unidade: "DIROP/__BRAND_NAME__", modalidade: "Repasse mensal", valor: "R$ 780.500,00", status: "Em Análise",
    subRows: [
      { parcela: "Janeiro", vencimento: "05/01/2026", valor: "R$ 65.000,00", status: "Pago" },
      { parcela: "Fevereiro", vencimento: "05/02/2026", valor: "R$ 65.000,00", status: "Pago" },
      { parcela: "Março", vencimento: "05/03/2026", valor: "R$ 65.000,00", status: "Em Análise" },
    ],
  },
  {
    id: "PRG-00023", programa: "Programa Inova — Consultoria Tecnológica", responsavel: "Carla Mendes Rocha",
    unidade: "DIAFI/__BRAND_NAME__", modalidade: "Repasse anual", valor: "R$ 2.150.000,00", status: "Aprovado",
    subRows: [
      { parcela: "Parcela única", vencimento: "20/04/2026", valor: "R$ 2.150.000,00", status: "Pago" },
    ],
  },
  {
    id: "PRG-00024", programa: "Visita Técnica", responsavel: "Diego Alves Castro",
    unidade: "DIROP/__BRAND_NAME__", modalidade: "Aquisição direta", valor: "R$ 4.890.000,00", status: "Pendente",
    subRows: [
      { parcela: "Lote 1 — Ônibus rural", vencimento: "15/05/2026", valor: "R$ 2.890.000,00", status: "Pendente" },
      { parcela: "Lote 2 — Ônibus urbano", vencimento: "15/08/2026", valor: "R$ 2.000.000,00", status: "Pendente" },
    ],
  },
  {
    id: "PRG-00025", programa: "Primeiro Negócio", responsavel: "Eduarda Santos Lima",
    unidade: "DIPLAN/__BRAND_NAME__", modalidade: "Aquisição centralizada", valor: "R$ 6.320.000,00", status: "Aprovado",
    subRows: [
      { parcela: "Ensino Fundamental I", vencimento: "10/02/2026", valor: "R$ 2.500.000,00", status: "Pago" },
      { parcela: "Ensino Fundamental II", vencimento: "10/05/2026", valor: "R$ 2.000.000,00", status: "Pago" },
      { parcela: "Ensino Médio", vencimento: "10/08/2026", valor: "R$ 1.820.000,00", status: "Agendado" },
    ],
  },
  {
    id: "PRG-00026", programa: "MEI - Microempreendedor", responsavel: "Fernanda Costa Reis",
    unidade: "DIPLAN/__BRAND_NAME__", modalidade: "Repasse semestral", valor: "R$ 540.000,00", status: "Rejeitado",
    subRows: [
      { parcela: "1º Semestre", vencimento: "30/06/2026", valor: "R$ 270.000,00", status: "Rejeitado" },
    ],
  },
  {
    id: "PRG-00027", programa: "Mais Conhecimento", responsavel: "Gustavo Henrique Dias",
    unidade: "DIROP/__BRAND_NAME__", modalidade: "Repasse trimestral", valor: "R$ 1.890.000,00", status: "Em Análise",
    subRows: [
      { parcela: "1º Trimestre", vencimento: "31/03/2026", valor: "R$ 472.500,00", status: "Pago" },
      { parcela: "2º Trimestre", vencimento: "30/06/2026", valor: "R$ 472.500,00", status: "Em Análise" },
    ],
  },
];

/* ─── KPI variants ─── */
function KPISpark({ title, value, delta, color }: { title: string; value: string; delta: string; color: string }) {
  const points = [8, 12, 9, 14, 11, 18, 15, 22, 19, 26];
  const max = Math.max(...points);
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-[11px] text-muted-foreground">{title}</p>
      <div className="flex items-end justify-between gap-2 mt-1">
        <div>
          <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
          <p className="text-[10px] mt-1" style={{ color }}>{delta}</p>
        </div>
        <svg viewBox="0 0 100 32" className="w-24 h-8" preserveAspectRatio="none">
          <polyline
            fill="none" stroke={color} strokeWidth="2"
            points={points.map((p, i) => `${(i / (points.length - 1)) * 100},${32 - (p / max) * 28}`).join(" ")}
          />
        </svg>
      </div>
    </div>
  );
}

function KPICompare({ title, current, previous, color }: { title: string; current: string; previous: string; color: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-[11px] text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1 leading-none">{current}</p>
      <div className="flex items-center gap-1.5 mt-2 text-[10px]">
        <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color }}>
          <TrendingUp size={11} /> +12,4%
        </span>
        <span className="text-muted-foreground">vs. {previous}</span>
      </div>
    </div>
  );
}

function KPIProgress({ title, value, target, pct, color }: { title: string; value: string; target: string; pct: number; color: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-[11px] text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1 leading-none">{value}</p>
      <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>{pct}% da meta</span>
        <span>Meta: {target}</span>
      </div>
    </div>
  );
}

function KPIRanking({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">{title}</p>
        <Trophy size={12} className="text-secondary" />
      </div>
      <ol className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2 text-[11px]">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${
              i === 0 ? "bg-secondary text-white" : i === 1 ? "bg-primary text-white" : "bg-muted text-foreground"
            }`}>{i + 1}</span>
            <span className="flex-1 truncate text-foreground">{it.label}</span>
            <span className="font-semibold text-muted-foreground">{it.value}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─── Status badges ─── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    "Aprovado":   { bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-400" },
    "Em Análise": { bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-400" },
    "Pendente":   { bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-400" },
    "Rejeitado":  { bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-700 dark:text-red-400" },
    "Pago":       { bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-400" },
    "Agendado":   { bg: "bg-slate-100 dark:bg-slate-800",      text: "text-slate-700 dark:text-slate-300" },
  };
  const c = map[status] ?? map["Pendente"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function TelaListagemPage() {
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("q") ?? "");
  const [filtroUnidade, setFiltroUnidade] = useState(() => searchParams.get("unidade") ?? "todas");
  const [filtroStatus, setFiltroStatus] = useState(() => searchParams.get("status") ?? "todos");
  const [filtroModalidade, setFiltroModalidade] = useState(() => searchParams.get("modalidade") ?? "todas");
  const [chips, setChips] = useState<string[]>(() => {
    const c = searchParams.get("chips");
    return c ? c.split(",").filter(Boolean) : ["2026", "Repasse mensal"];
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "PRG-00021": true });
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page")) || 1));
  const [pageSize, setPageSize] = useState(() => {
    const n = Number(searchParams.get("size"));
    return [10, 25, 50].includes(n) ? n : 10;
  });
  const [kebabOpen, setKebabOpen] = useState<string | null>(null);

  // Sincroniza estado de filtros, paginação e chips com a URL (query params)
  // para permitir compartilhamento e restauração via histórico do navegador.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const setOrDelete = (k: string, v: string, empty: string) => {
      if (v && v !== empty) next.set(k, v);
      else next.delete(k);
    };
    setOrDelete("q", debouncedSearch, "");
    setOrDelete("unidade", filtroUnidade, "todas");
    setOrDelete("status", filtroStatus, "todos");
    setOrDelete("modalidade", filtroModalidade, "todas");
    if (chips.length) next.set("chips", chips.join(","));
    else next.delete("chips");
    if (page > 1) next.set("page", String(page));
    else next.delete("page");
    if (pageSize !== 10) next.set("size", String(pageSize));
    else next.delete("size");
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [debouncedSearch, filtroUnidade, filtroStatus, filtroModalidade, chips, page, pageSize, searchParams, setSearchParams]);

  // Debounce do campo de busca (200ms) — atualização automática sem travar o teclado
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!kebabOpen) return;
    const onClick = () => setKebabOpen(null);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [kebabOpen]);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState<Record<string, boolean>>({ Programas: true });
  const [activeMenu, setActiveMenu] = useState("Programas");
  const [menuSearch, setMenuSearch] = useState("");
  const menuSearchRef = useRef<HTMLInputElement>(null);
  const menuQuery = menuSearch.toLowerCase().trim();
  const filteredMenu = menuQuery
    ? menuItems.filter(
        (it) =>
          it.label.toLowerCase().includes(menuQuery) ||
          it.children?.some((c) => c.label.toLowerCase().includes(menuQuery))
      )
    : menuItems;

  // Modal "Novo registro"
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    programa: "", responsavel: "", unidade: "DIROP/__BRAND_NAME__",
    modalidade: "Repasse mensal", valor: "", inicio: "",
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    if (modalOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // Opções dinâmicas derivadas dos dados
  const unidadesDisponiveis = useMemo(
    () => Array.from(new Set(rows.map((r) => r.unidade))).sort(),
    [],
  );
  const modalidadesDisponiveis = useMemo(
    () => Array.from(new Set(rows.map((r) => r.modalidade))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !`${r.programa} ${r.responsavel} ${r.id}`.toLowerCase().includes(q)) return false;
      if (filtroUnidade !== "todas" && r.unidade !== filtroUnidade) return false;
      if (filtroStatus !== "todos" && r.status !== filtroStatus) return false;
      if (filtroModalidade !== "todas" && r.modalidade !== filtroModalidade) return false;
      return true;
    });
  }, [debouncedSearch, filtroUnidade, filtroStatus, filtroModalidade]);

  // Reseta paginação automaticamente quando filtros mudam
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filtroUnidade, filtroStatus, filtroModalidade, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

  const limpar = () => {
    setSearch("");
    setFiltroUnidade("todas");
    setFiltroStatus("todos");
    setFiltroModalidade("todas");
    setChips([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    setToast(`Registro "${form.programa || "Sem título"}" criado com sucesso.`);
    setForm({ programa: "", responsavel: "", unidade: "DIROP/__BRAND_NAME__", modalidade: "Repasse mensal", valor: "", inicio: "" });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <SEO
        title="Tela de Listagem — Design System __BRAND_SHORT__"
        description="Template de listagem do __BRAND_NAME__ com filtros dinâmicos, busca, paginação e estado persistido na URL para fluxos de programas e iniciativas."
        path="/templates/tela-listagem"
      />
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
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={sidebarOpen}
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

      {/* ═══ BODY: Sidebar + Conteúdo ═══ */}
      <div className="flex-1 flex min-h-0">
        {/* ─── Sidebar lateral ─── */}
        {sidebarOpen && (
          <aside className="w-[260px] bg-sidebar text-sidebar-foreground flex flex-col shrink-0 border-r border-sidebar-border">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <img src={iconeBrandNegativo} alt="__BRAND_NAME__" className="h-5 w-5" />
                <span className="text-sm font-semibold">SIGLA</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Fechar menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-3 py-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  ref={menuSearchRef}
                  type="text"
                  placeholder="Buscar no menu..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-white/10 text-white text-xs rounded pl-8 pr-8 py-2 placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-secondary/50 focus:border-secondary/50"
                />
                {menuSearch && (
                  <button
                    onClick={() => { setMenuSearch(""); menuSearchRef.current?.focus(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    aria-label="Limpar busca"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Menu principal">
              {filteredMenu.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      setActiveMenu(item.label);
                      if (item.children) setMenuExpanded((p) => ({ ...p, [item.label]: !p[item.label] }));
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                      activeMenu === item.label
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left text-[13px]">{item.label}</span>
                    {item.children && (
                      menuExpanded[item.label]
                        ? <ChevronDown size={14} className="text-white/40" />
                        : <ChevronRight size={14} className="text-white/40" />
                    )}
                  </button>
                  {item.children && menuExpanded[item.label] && (
                    <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
                      {item.children
                        .filter((c) => !menuQuery || c.label.toLowerCase().includes(menuQuery))
                        .map((child) => (
                          <button
                            key={child.label}
                            onClick={() => setActiveMenu(child.label)}
                            className={`block w-full text-left text-xs px-3 py-1.5 rounded transition-colors ${
                              activeMenu === child.label
                                ? "text-white bg-white/10 font-medium"
                                : "text-white/50 hover:text-white hover:bg-white/10"
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

            <div className="border-t border-white/10 px-3 py-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-white/50 text-[10px]">
                <Folder size={12} />
                <span>__BRAND_NAME__</span>
              </div>
            </div>
          </aside>
        )}

        {/* ─── Conteúdo ─── */}
        <div className="flex-1 min-w-0 flex flex-col">

      {/* Breadcrumb */}
      <nav aria-label="Navegação estrutural" className="flex items-center gap-1.5 px-5 py-2.5 bg-card border-b border-border text-xs">
        <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-secondary transition-colors">
          <Home size={12} /> <span>Início</span>
        </a>
        <ChevronRight size={12} className="text-muted-foreground/50" />
        <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Programas</a>
        <ChevronRight size={12} className="text-muted-foreground/50" />
        <span className="font-semibold text-primary dark:text-foreground" aria-current="page">Listagem de Repasses</span>
      </nav>

      {/* Page title + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-4 bg-card border-b border-border">
        <div>
          <h1 className="text-lg font-bold text-foreground">Listagem de Repasses</h1>
          <p className="text-xs text-muted-foreground">Acompanhamento dos programas e parcelas em execução.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted transition-colors">
            <Download size={12} /> Exportar
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/90 text-white rounded transition-colors"
          >
            <Plus size={12} /> Novo registro
          </button>
        </div>
      </div>

      <main className="flex-1 p-5 space-y-4">
        {/* ═══ KPIs (4 cards avançados) ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KPISpark title="Repasses no mês" value="R$ 12,4M" delta="+8% vs. mês anterior" color="#16A34A" />
          <KPICompare title="Programas ativos" current="142" previous="126 em 2025" color="#16A34A" />
          <KPIProgress title="Execução orçamentária" value="R$ 84,2M" target="R$ 120M" pct={70} color="#D98217" />
          <KPIRanking title="Top unidades por volume" items={[
            { label: "DIROP/__BRAND_NAME__", value: "R$ 6,1M" },
            { label: "DIPLAN/__BRAND_NAME__", value: "R$ 4,3M" },
            { label: "DIAFI/__BRAND_NAME__", value: "R$ 2,0M" },
          ]} />
        </div>

        {/* ═══ Filter bar ═══ */}
        <div className="bg-card rounded-lg border border-border p-3 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por programa, responsável ou ID…"
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              />
            </div>

            <select
              value={filtroUnidade}
              onChange={(e) => setFiltroUnidade(e.target.value)}
              className="px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todas">Todas as unidades</option>
              {unidadesDisponiveis.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todos">Todos os status</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Pendente">Pendente</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>

            <select
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
              className="px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Modalidade"
            >
              <option value="todas">Todas as modalidades</option>
              {modalidadesDisponiveis.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors">
              <Filter size={12} /> Filtros avançados
            </button>

            <button
              onClick={limpar}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} /> Limpar
            </button>
          </div>

          {/* Chips ativos */}
          {(chips.length > 0 || filtroUnidade !== "todas" || filtroStatus !== "todos" || filtroModalidade !== "todas" || debouncedSearch) && (
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Filtros ativos:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-[11px] bg-muted text-foreground rounded-full">
                  Busca: "{debouncedSearch}"
                  <button onClick={() => setSearch("")} className="p-0.5 hover:bg-foreground/10 rounded-full"><X size={10} /></button>
                </span>
              )}
              {filtroUnidade !== "todas" && (
                <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-[11px] bg-primary/10 text-primary dark:text-foreground dark:bg-foreground/10 rounded-full">
                  Unidade: {filtroUnidade}
                  <button onClick={() => setFiltroUnidade("todas")} className="p-0.5 hover:bg-foreground/10 rounded-full"><X size={10} /></button>
                </span>
              )}
              {filtroStatus !== "todos" && (
                <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-[11px] bg-secondary/15 text-secondary rounded-full">
                  Status: {filtroStatus}
                  <button onClick={() => setFiltroStatus("todos")} className="p-0.5 hover:bg-foreground/10 rounded-full"><X size={10} /></button>
                </span>
              )}
              {filtroModalidade !== "todas" && (
                <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-[11px] bg-accent/40 text-foreground rounded-full">
                  Modalidade: {filtroModalidade}
                  <button onClick={() => setFiltroModalidade("todas")} className="p-0.5 hover:bg-foreground/10 rounded-full"><X size={10} /></button>
                </span>
              )}
              {chips.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-[11px] bg-muted text-foreground rounded-full">
                  {c}
                  <button onClick={() => setChips(chips.filter(x => x !== c))} className="p-0.5 hover:bg-foreground/10 rounded-full"><X size={10} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ═══ Tabela aninhada ═══ */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-bold text-secondary">Programas e Repasses</p>
            <span className="text-[11px] text-muted-foreground">{filtered.length} resultados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ minWidth: 900 }}>
              <thead>
                <tr className="text-white" style={{ backgroundColor: "#245375" }}>
                  <th className="w-8 px-2 py-2"></th>
                  <th className="px-3 py-2 text-left font-medium">ID</th>
                  <th className="px-3 py-2 text-left font-medium">Programa</th>
                  <th className="px-3 py-2 text-left font-medium">Responsável</th>
                  <th className="px-3 py-2 text-left font-medium">Unidade</th>
                  <th className="px-3 py-2 text-left font-medium">Modalidade</th>
                  <th className="px-3 py-2 text-right font-medium">Valor</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="w-8 px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => {
                  const isOpen = !!expanded[r.id];
                  return (
                    <React.Fragment key={r.id}>
                      <tr className={`${i % 2 === 0 ? "bg-card" : "bg-muted/30"} border-b border-border hover:bg-muted/50 transition-colors`}>
                        <td className="px-2 py-2 text-center">
                          <button
                            onClick={() => setExpanded({ ...expanded, [r.id]: !isOpen })}
                            className="p-1 hover:bg-foreground/10 rounded transition-colors"
                            aria-label={isOpen ? "Recolher detalhes" : "Expandir detalhes"}
                            aria-expanded={isOpen}
                          >
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground font-mono">{r.id}</td>
                        <td className="px-3 py-2 font-medium text-foreground">{r.programa}</td>
                        <td className="px-3 py-2">{r.responsavel}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.unidade}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.modalidade}</td>
                        <td className="px-3 py-2 text-right font-semibold">{r.valor}</td>
                        <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                        <td className="px-2 py-2 text-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setKebabOpen(kebabOpen === r.id ? null : r.id);
                            }}
                            className="p-1 hover:bg-foreground/10 rounded transition-colors"
                            aria-label="Mais ações"
                            aria-haspopup="menu"
                            aria-expanded={kebabOpen === r.id}
                          >
                            <MoreVertical size={14} />
                          </button>
                          {kebabOpen === r.id && (
                            <div
                              role="menu"
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-2 top-full mt-1 z-20 w-44 bg-card border border-border rounded-md shadow-lg py-1 text-left animate-in fade-in zoom-in-95 duration-150"
                            >
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setKebabOpen(null);
                                  setToast(`Visualizando registro ${r.id} — ${r.programa}`);
                                  setTimeout(() => setToast(null), 4000);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                              >
                                <Eye size={12} className="text-primary dark:text-foreground" /> Visualizar
                              </button>
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setKebabOpen(null);
                                  setToast(`Edição iniciada para ${r.id}.`);
                                  setTimeout(() => setToast(null), 4000);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                              >
                                <Pencil size={12} className="text-secondary" /> Editar
                              </button>
                              <div className="my-1 h-px bg-border" />
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setKebabOpen(null);
                                  if (confirm(`Apagar o registro ${r.id} — ${r.programa}?`)) {
                                    setToast(`Registro ${r.id} apagado.`);
                                    setTimeout(() => setToast(null), 4000);
                                  }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 size={12} /> Apagar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="bg-primary/5 dark:bg-foreground/5 border-b border-border">
                          <td colSpan={9} className="px-12 py-3">
                            <p className="text-[11px] font-semibold text-primary dark:text-foreground mb-2">
                              Parcelas e cronograma de pagamento
                            </p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-[11px] bg-card rounded border border-border">
                                <thead>
                                  <tr className="bg-muted/60 text-muted-foreground">
                                    <th className="px-3 py-1.5 text-left font-medium">Parcela</th>
                                    <th className="px-3 py-1.5 text-left font-medium">Vencimento</th>
                                    <th className="px-3 py-1.5 text-right font-medium">Valor</th>
                                    <th className="px-3 py-1.5 text-left font-medium">Situação</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {r.subRows.map((s, j) => (
                                    <tr key={j} className="border-t border-border">
                                      <td className="px-3 py-1.5">{s.parcela}</td>
                                      <td className="px-3 py-1.5 text-muted-foreground">{s.vencimento}</td>
                                      <td className="px-3 py-1.5 text-right font-medium">{s.valor}</td>
                                      <td className="px-3 py-1.5"><StatusBadge status={s.status} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-10 text-center text-muted-foreground">
                      Nenhum registro encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ═══ Paginação ═══ */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>
                Mostrando {filtered.length === 0 ? 0 : pageStart + 1}
                –{Math.min(pageStart + pageSize, filtered.length)} de {filtered.length} registros
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 bg-background border border-border rounded text-[11px]"
                aria-label="Registros por página"
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>

            <nav aria-label="Paginação" className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] border border-border rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={12} /> Anterior
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={page === n ? "page" : undefined}
                  className={`min-w-[28px] h-7 px-2 text-[11px] rounded border transition-colors ${
                    page === n
                      ? "text-white"
                      : "border-border hover:bg-muted"
                  }`}
                  style={page === n ? { backgroundColor: "#245375", borderColor: "#245375" } : undefined}
                >
                  {n}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="px-1 text-muted-foreground text-[11px]">…</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`min-w-[28px] h-7 px-2 text-[11px] rounded border transition-colors ${
                      page === totalPages ? "text-white" : "border-border hover:bg-muted"
                    }`}
                    style={page === totalPages ? { backgroundColor: "#245375", borderColor: "#245375" } : undefined}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] border border-border rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Próxima <ChevronRight size={12} />
              </button>
            </nav>
          </div>
        </div>
      </main>

          {/* Footer institucional */}
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-muted/30">
            <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-5 w-auto opacity-60" />
            <span className="text-[10px] text-muted-foreground">Tela de Listagem · v.1.0</span>
          </div>
        </div>
      </div>

      {/* ═══ MODAL: Novo registro ═══ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-accent">
              <div>
                <h2 id="modal-title" className="text-base font-bold text-accent-foreground">Novo registro</h2>
                <p className="text-[11px] text-accent-foreground/70">Cadastre um novo programa de repasse.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-foreground/10 rounded transition-colors"
                aria-label="Fechar modal"
              >
                <X size={16} className="text-accent-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label htmlFor="f-programa" className="block text-xs font-medium text-foreground mb-1.5">
                  Programa <span className="text-secondary">*</span>
                </label>
                <input
                  id="f-programa"
                  type="text"
                  required
                  value={form.programa}
                  onChange={(e) => setForm({ ...form, programa: e.target.value })}
                  placeholder="Ex.: Empreender — Empreendedorismo"
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="f-resp" className="block text-xs font-medium text-foreground mb-1.5">
                  Responsável <span className="text-secondary">*</span>
                </label>
                <input
                  id="f-resp"
                  type="text"
                  required
                  value={form.responsavel}
                  onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="f-unidade" className="block text-xs font-medium text-foreground mb-1.5">Unidade</label>
                  <select
                    id="f-unidade"
                    value={form.unidade}
                    onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>DIROP/__BRAND_NAME__</option>
                    <option>DIPLAN/__BRAND_NAME__</option>
                    <option>DIAFI/__BRAND_NAME__</option>
                    <option>__BRAND_NAME__</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="f-modalidade" className="block text-xs font-medium text-foreground mb-1.5">Modalidade</label>
                  <select
                    id="f-modalidade"
                    value={form.modalidade}
                    onChange={(e) => setForm({ ...form, modalidade: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Repasse mensal</option>
                    <option>Repasse trimestral</option>
                    <option>Repasse semestral</option>
                    <option>Repasse anual</option>
                    <option>Aquisição direta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="f-valor" className="block text-xs font-medium text-foreground mb-1.5">
                    Valor (R$) <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="f-valor"
                    type="text"
                    required
                    inputMode="decimal"
                    value={form.valor}
                    onChange={(e) => setForm({ ...form, valor: e.target.value })}
                    placeholder="0,00"
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="f-inicio" className="block text-xs font-medium text-foreground mb-1.5">
                    Data de início
                  </label>
                  <input
                    id="f-inicio"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={form.inicio}
                    onChange={(e) => setForm({ ...form, inicio: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-primary hover:bg-primary/90 text-white rounded transition-colors"
                >
                  <Plus size={12} /> Criar registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Toast ═══ */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-primary text-white text-xs px-4 py-3 rounded-lg shadow-2xl border border-secondary/40 animate-in slide-in-from-bottom-2 duration-200"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
