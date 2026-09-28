import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home, Palette, Code2, Component, LayoutTemplate, Stamp,
  FileText, Accessibility, ChevronDown, ChevronRight, Search,
  Menu, X, PanelLeftClose, PanelLeftOpen, Sun, Moon,
  SearchX, Users, BarChart3
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { brandCor as logoBrandCompleta2 } from "@/assets/brand";
import logoBrandWhite from "@/assets/brand-logo-white-header.svg";
import { prefetchRoute, cancelPendingPrefetch } from "@/utils/prefetchRoutes";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  title?: string;
  children?: NavChild[];
}

interface NavChild {
  label: string;
  path: string;
  disabled?: boolean;
  title?: string;
  children?: { label: string; path: string; disabled?: boolean; title?: string; children?: { label: string; path: string; disabled?: boolean }[] }[];
}

const navItems: NavItem[] = [
  { label: "Principal", path: "/", icon: <Home size={18} />, title: "Principal" },
  {
    label: "Fundamentos", path: "/fundamentos", icon: <Palette size={18} />,
    children: [
      { label: "Tipografia", path: "/fundamentos#tipografia" },
      { label: "Atlas de Tipografia", path: "/fundamentos#atlas-tipografia" },
      { label: "Cores", path: "/fundamentos#cores" },
      { label: "Iconografia", path: "/fundamentos#iconografia" },
      { label: "Grid e Espaçamento", path: "/fundamentos#grid" },
      { label: "Elevação e Sombras", path: "/fundamentos#elevacao" },
      { label: "Motion", path: "/fundamentos#motion" },
      { label: "Responsividade", path: "/fundamentos#responsividade" },
    ],
  },
  {
    label: "Tokens", path: "/tokens", icon: <Code2 size={18} />,
    children: [
      { label: "Cores", path: "/tokens#cores" },
      { label: "Tipografia", path: "/tokens#tipografia" },
      { label: "Espaçamento", path: "/tokens#espacamento" },
      { label: "Sombras", path: "/tokens#sombras" },
      { label: "Z-index", path: "/tokens#zindex" },
      { label: "Breakpoints", path: "/tokens#breakpoints" },
    ],
  },
  {
    label: "Componentes", path: "/componentes", icon: <Component size={18} />,
    children: [
      { label: "Botão Templates", path: "/componentes#botao" },
      { label: "Campo de Texto", path: "/componentes#input" },
      { label: "Select", path: "/componentes#select" },
      { label: "Checkbox e Radio", path: "/componentes#checkbox" },
      { label: "Switch", path: "/componentes#switch" },
      { label: "Badge / Tag", path: "/componentes#badge" },
      { label: "Alert", path: "/componentes#alert" },
      { label: "Card", path: "/componentes#card" },
      { label: "Tabela", path: "/componentes#tabela" },
      { label: "Accordion", path: "/componentes#accordion" },
      { label: "Tabs", path: "/componentes#tabs" },
      { label: "Modal", path: "/componentes#modal" },
      { label: "Toast", path: "/componentes#toast" },
      { label: "Breadcrumb", path: "/componentes#breadcrumb" },
      { label: "Paginação", path: "/componentes#paginacao" },
      { label: "Tooltip", path: "/componentes#tooltip" },
      { label: "Skeleton", path: "/componentes#skeleton" },
      { label: "Spinner", path: "/componentes#spinner" },
      { label: "Empty State", path: "/componentes#empty-state" },
      { label: "Dropdown Menu", path: "/componentes#dropdown" },
      { label: "Menu Kebab", path: "/componentes#menu-kebab" },
      { label: "DatePicker", path: "/componentes#datepicker" },
      { label: "Filtros Dinâmicos", path: "/componentes#filtros" },
      { label: "Big Numbers / KPIs", path: "/componentes#big-numbers" },
      { label: "Upload em Massa", path: "/componentes#upload" },
      { label: "Stepper (Etapas)", path: "/componentes#steps" },
      { label: "Lista Descritiva", path: "/componentes#lista-descritiva" },
      { label: "Cards de Estatísticas", path: "/componentes#stats" },
      { label: "Métricas", path: "/componentes#metricas" },
      { label: "Gráficos", path: "/componentes#graficos" },
    ],
  },
  {
    label: "Templates", path: "/templates", icon: <LayoutTemplate size={18} />,
    children: [
      { label: "Header __BRAND_NAME__", path: "/templates#header" },
      { label: "Footer Institucional", path: "/templates#footer" },
      { label: "Menu Lateral", path: "/templates#menu-lateral" },
      { label: "Modelos de Login", path: "/templates#modelos-login" },
      { label: "Modelo de login (Card Sign In)", path: "/templates#modelo-card" },
      { label: "Modelos de Dashboard", path: "/templates#dashboards" },
      { label: "Modelo Hub de Painéis", path: "/templates#hub-paineis" },
      { label: "Modelos de Página", path: "/templates#templates-modelos" },
    ],
  },
  {
    label: "Modelos de BI", path: "/modelos-bi", icon: <BarChart3 size={18} />,
    children: [
      {
        label: "Radar Estratégico - BI",
        path: "/modelos-bi/radar-estrategico",
        children: [
          {
            label: "BI",
            path: "/modelos-bi/radar-estrategico/bi",
            children: [
              { label: "v1.0", path: "/modelos-bi/radar-estrategico/bi" },
            ],
          },
          {
            label: "Docs",
            path: "/modelos-bi/radar-estrategico/docs",
            children: [
              { label: "v1.0", path: "/modelos-bi/radar-estrategico/docs" },
            ],
          },
        ],
      },
      { label: "Planejamento - BI", path: "/modelos-bi/planeja" },
      { label: "MPI - BI", path: "/modelos-bi/mpi", title: "Monitoramento da Performance das Iniciativas" },
      { label: "Gestão de Pessoas - BI", path: "/modelos-bi/gestao-pessoas" },
    ],
  },
  { label: "Marca __BRAND_SHORT__", path: "/marca", icon: <Stamp size={18} /> },
  { label: "Webwriting", path: "/conteudo", icon: <FileText size={18} /> },
  { label: "Acessibilidade", path: "/acessibilidade", icon: <Accessibility size={18} /> },
];

export default function DSLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/";
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoResults, setShowNoResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") setCollapsed(true);
  }, [location.pathname]);

  useEffect(() => {
    
    // Auto-expand the section containing the current path
    const activeParent = navItems.find(item => 
      item.children?.some(c => location.pathname === c.path.split("#")[0])
    );
    if (activeParent) {
      setExpanded(prev => ({ ...prev, [activeParent.label]: true }));
    }
  }, [location.pathname]);

  // Cancel any pending prefetch when the route changes before its timer fires.
  useEffect(() => {
    cancelPendingPrefetch();
  }, [location.pathname]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  const toggleExpand = useCallback((label: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const handleNav = (path: string) => {
    const [route, hash] = path.split("#");
    if (route && route !== location.pathname) {
      navigate(route + (hash ? `#${hash}` : ""));
    } else if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileOpen(false);
  };

  const isActive = (path: string) => {
    const [route, hash] = path.split("#");
    if (hash && location.hash === `#${hash}`) return true;
    return location.pathname === route && !location.hash && !hash;
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredItems = query
    ? navItems.filter(item =>
        item.label.toLowerCase().includes(query) ||
        item.children?.some(c => c.label.toLowerCase().includes(query))
      )
    : navItems;

  // Auto-expand parents that have matching children
  useEffect(() => {
    if (!query) return;
    const toExpand: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children?.some(c => c.label.toLowerCase().includes(query))) {
        toExpand[item.label] = true;
      }
    });
    if (Object.keys(toExpand).length > 0) {
      setExpanded(prev => ({ ...prev, ...toExpand }));
    }
  }, [query]);

  // Collect all flat results for keyboard navigation
  const flatResults = query
    ? filteredItems.flatMap(item => {
        const matches: { label: string; path: string }[] = [];
        if (item.label.toLowerCase().includes(query)) matches.push({ label: item.label, path: item.path });
        item.children?.forEach(c => {
          if (c.label.toLowerCase().includes(query)) matches.push({ label: c.label, path: c.path });
        });
        return matches;
      })
    : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (flatResults.length > 0) {
        handleNav(flatResults[0].path);
        setSearchQuery("");
      } else if (query) {
        setShowNoResults(true);
      }
    }
    if (e.key === "Escape") {
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  const renderNav = (isCollapsed: boolean) => (
    <>
      {!isCollapsed && (
        <div className="p-3 space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sidebar-muted" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar seções, componentes..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowNoResults(false); }}
              onKeyDown={handleSearchKeyDown}
              className="w-full bg-sidebar-accent text-sidebar-foreground text-xs rounded pl-8 pr-8 py-2 placeholder:text-sidebar-muted border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
              aria-label="Buscar na navegação"
              role="searchbox"
              aria-describedby="search-hint"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowNoResults(false); searchInputRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-muted hover:text-sidebar-foreground transition-colors"
                aria-label="Limpar busca"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <span id="search-hint" className="sr-only">Pressione Enter para navegar ao primeiro resultado</span>
          {query && filteredItems.length > 0 && (
            <p className="text-[10px] text-sidebar-muted px-1">
              {flatResults.length} resultado{flatResults.length !== 1 ? "s" : ""} encontrado{flatResults.length !== 1 ? "s" : ""}
            </p>
          )}
          {query && filteredItems.length === 0 && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-[11px] text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200"
            >
              <SearchX size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Nenhum resultado encontrado</p>
                <p className="text-destructive/80 mt-0.5">
                  Não encontramos "{searchQuery}" no menu. Verifique a grafia ou navegue pelas seções.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <nav className={`${isCollapsed ? "px-1" : "px-2"} pb-6`} aria-label="Navegação do design system">
        {filteredItems.map((item) => (
          <div key={item.label}>
            <button
              onClick={(e) => {
                if (isCollapsed) { setCollapsed(false); handleNav(item.path); if (item.children) toggleExpand(item.label, e); }
                else { if (item.children) toggleExpand(item.label, e); handleNav(item.path); }
              }}
              onMouseEnter={() => prefetchRoute(item.path)}
              onFocus={() => prefetchRoute(item.path)}
              onTouchStart={() => prefetchRoute(item.path)}
              onMouseLeave={cancelPendingPrefetch}
              onBlur={cancelPendingPrefetch}
              onTouchEnd={cancelPendingPrefetch}
              onTouchCancel={cancelPendingPrefetch}
              title={item.title ?? item.label}
              aria-label={item.title ?? item.label}
              aria-expanded={item.children ? !!expanded[item.label] : undefined}
              aria-controls={item.children ? `subnav-${item.label}` : undefined}
              className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"} rounded text-sm transition-colors ${
                isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.children && (expanded[item.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                </>
              )}
            </button>
            {!isCollapsed && item.children && expanded[item.label] && (
              <div id={`subnav-${item.label}`} role="region" aria-label={`Subnavegação de ${item.label}`} className="ml-7 mt-0.5 space-y-0.5">
                {item.children
                  .filter(c => !query || c.label.toLowerCase().includes(query))
                   .map(child => (
                     <div key={child.label}>
                       <button
                         onClick={(e) => {
                           if (child.disabled) return;
                           if (child.children) { toggleExpand(child.label, e); handleNav(child.path); }
                           else { handleNav(child.path); setSearchQuery(""); }
                         }}
                         onMouseEnter={() => !child.disabled && prefetchRoute(child.path)}
                         onFocus={() => !child.disabled && prefetchRoute(child.path)}
                         onTouchStart={() => !child.disabled && prefetchRoute(child.path)}
                         onMouseLeave={cancelPendingPrefetch}
                         onBlur={cancelPendingPrefetch}
                         onTouchEnd={cancelPendingPrefetch}
                         onTouchCancel={cancelPendingPrefetch}
                         disabled={child.disabled}
                         title={child.disabled ? "Em breve" : child.title}
                         aria-label={child.title ?? undefined}
                         aria-expanded={child.children ? !!expanded[child.label] : undefined}
                         className={`flex items-center gap-1 w-full text-left text-xs px-3 py-1.5 rounded transition-colors ${
                           child.disabled
                             ? "text-sidebar-muted/50 cursor-not-allowed italic"
                             : query && child.label.toLowerCase().includes(query)
                               ? "text-sidebar-foreground bg-sidebar-accent/70 font-medium"
                               : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                         }`}>
                         <span className="flex-1">{child.label}{child.disabled && <span className="ml-1 text-[10px] opacity-70">(em breve)</span>}</span>
                         {child.children && (expanded[child.label] ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
                       </button>
                       {child.children && expanded[child.label] && (
                         <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2">
                           {child.children.map(sub => (
                             <button
                               key={sub.label}
                               onClick={() => { if (sub.disabled) return; handleNav(sub.path); setSearchQuery(""); }}
                               onMouseEnter={() => !sub.disabled && prefetchRoute(sub.path)}
                               onFocus={() => !sub.disabled && prefetchRoute(sub.path)}
                               onTouchStart={() => !sub.disabled && prefetchRoute(sub.path)}
                                onMouseLeave={cancelPendingPrefetch}
                                onBlur={cancelPendingPrefetch}
                                onTouchEnd={cancelPendingPrefetch}
                                onTouchCancel={cancelPendingPrefetch}
                               disabled={sub.disabled}
                               title={sub.disabled ? "Em breve" : undefined}
                               className={`block w-full text-left text-xs px-3 py-1.5 rounded transition-colors ${
                                 sub.disabled
                                   ? "text-sidebar-muted/50 cursor-not-allowed italic"
                                   : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                               }`}>
                               {sub.label}{sub.disabled && <span className="ml-1 text-[10px] opacity-70">(em breve)</span>}
                             </button>
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-[92px] flex items-center px-4 gap-3 fixed top-0 left-0 right-0 z-50 border-b border-header-border bg-header text-header-foreground transition-colors">
        <button
          className="lg:hidden p-1.5 rounded hover:bg-foreground/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-sidebar"
        >
          {mobileOpen ? <X size={20} className="text-header-foreground" /> : <Menu size={20} className="text-header-foreground" />}
        </button>

        <button
          className="hidden lg:flex p-1.5 rounded hover:bg-foreground/10 transition-colors items-center justify-center"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          aria-expanded={!collapsed}
          aria-controls="desktop-sidebar"
        >
          {collapsed ? <PanelLeftOpen size={20} className="text-header-foreground" /> : <PanelLeftClose size={20} className="text-header-foreground" />}
        </button>

        <a
          href="https://__DS_DOMAIN__/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ir para o site do Design System __BRAND_NAME__"
          className="inline-flex items-center rounded focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <img
            src={theme === "dark" ? logoBrandWhite : logoBrandCompleta2}
            alt="__BRAND_NAME__"
            className="h-14"
          />
        </a>

        <div className="h-6 w-px bg-header-foreground/20" />

        <div className="leading-tight">
          <span className="font-semibold text-xs sm:text-sm block text-header-foreground">Design System __BRAND_NAME__</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            title={theme === "light" ? "Modo escuro" : "Modo claro"}
          >
            {theme === "light" ? <Moon size={18} className="text-header-foreground" /> : <Sun size={18} className="text-header-foreground" />}
          </button>
        </div>
      </header>

      <div className="flex pt-[92px] min-h-screen">
        {mobileOpen && <div className="fixed inset-0 bg-foreground/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}

        {/* Mobile sidebar */}
        <aside id="mobile-sidebar" role="navigation" aria-label="Menu de navegação"
          className={`fixed top-[92px] bottom-0 left-0 w-64 bg-sidebar text-sidebar-foreground z-40 overflow-y-auto transition-transform duration-200 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {renderNav(false)}
        </aside>

        {/* Desktop sidebar */}
        <aside id="desktop-sidebar" role="navigation" aria-label="Menu de navegação"
          className={`hidden lg:flex lg:flex-col sticky top-[92px] h-[calc(100vh-92px)] bg-sidebar text-sidebar-foreground overflow-y-auto transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}>
          <div className="flex-1 overflow-y-auto">{renderNav(collapsed)}</div>
          <div className={`border-t border-sidebar-border p-2 ${collapsed ? "flex justify-center" : "px-3"}`}>
            <button onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-2 text-sidebar-muted hover:text-sidebar-foreground text-xs py-1.5 px-2 rounded hover:bg-sidebar-accent/50 transition-colors w-full"
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>
              {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={16} /><span>Recolher menu</span></>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex-1">
            {children}
          </div>
          <footer className="border-t border-border bg-muted/30 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center text-xs text-muted-foreground space-y-1">
              <p className="font-medium">__BRAND_NAME__ — Todos os direitos reservados</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
