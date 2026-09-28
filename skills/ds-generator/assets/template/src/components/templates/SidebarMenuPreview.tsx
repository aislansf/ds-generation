import { useState, useRef } from "react";
import {
  Home, Settings, Users, FileText, BarChart3, Shield, Bell,
  HelpCircle, Search, X, ChevronDown, ChevronRight,
  Folder, ClipboardList, GraduationCap, Wallet,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { CodeBlock } from "@/components/DSComponents";
import { brandWhite as iconeBrandNegativo } from "@/assets/brand";

/* ─── Menu item model ─── */
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  iconName: string;
  disabled?: boolean;
  children?: { label: string }[];
}

const menuItems: MenuItem[] = [
  { label: "Início", icon: <Home size={16} />, iconName: "home" },
  {
    label: "Programas", icon: <GraduationCap size={16} />, iconName: "graduation-cap",
    children: [
      { label: "Empretec" },
      { label: "ALI" },
      { label: "Programa Inova" },
      { label: "Negócio a Negócio" },
    ],
  },
  {
    label: "Financeiro", icon: <Wallet size={16} />, iconName: "wallet",
    children: [
      { label: "Prestação de Contas" },
      { label: "Repasses" },
      { label: "Convênios" },
    ],
  },
  {
    label: "Relatórios", icon: <BarChart3 size={16} />, iconName: "bar-chart-3",
    children: [
      { label: "Indicadores" },
      { label: "Dashboards" },
      { label: "Exportações" },
    ],
  },
  { label: "Usuários", icon: <Users size={16} />, iconName: "users" },
  {
    label: "Documentos", icon: <FileText size={16} />, iconName: "file-text",
    children: [
      { label: "Normativos" },
      { label: "Manuais" },
      { label: "Resoluções" },
    ],
  },
  { label: "Notificações", icon: <Bell size={16} />, iconName: "bell" },
  { label: "Segurança", icon: <Shield size={16} />, iconName: "shield", disabled: true },
  { label: "Configurações", icon: <Settings size={16} />, iconName: "settings" },
  { label: "Ajuda", icon: <HelpCircle size={16} />, iconName: "help-circle" },
];

/* ─── Interactive Preview ─── */
function SidebarPreview() {
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Programas: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState("Início");
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
    if (item.disabled) return;
    if (collapsed) { setCollapsed(false); setActiveItem(item.label); return; }
    setActiveItem(item.label);
    if (item.children) {
      setExpanded((prev) => ({ ...prev, [item.label]: !prev[item.label] }));
    }
  };

  if (!open) {
    return (
      <div className="flex items-center justify-center h-[480px] border border-border rounded-lg bg-muted/30">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sidebar text-sidebar-foreground text-sm font-sans hover:bg-sidebar/90 transition-colors"
        >
          <Home size={16} />
          Abrir Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row border border-border rounded-lg overflow-hidden min-h-[520px] sm:h-[520px] font-sans">
      {/* Sidebar */}
      <div className={`${collapsed ? "w-16" : "w-full sm:w-[260px]"} max-w-full bg-sidebar text-sidebar-foreground flex flex-col shrink-0 transition-all duration-200`}>
        {/* Sidebar header with close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <div className={`flex items-center gap-2 min-w-0 ${collapsed ? "justify-center w-full" : ""}`}>
            <img
              src={iconeBrandNegativo}
              alt="__BRAND_NAME__"
              className="h-[60px] w-[60px] sm:h-[60px] sm:w-[60px] shrink-0"
            />
            {!collapsed && (
              <span className="text-sm font-semibold whitespace-nowrap">SIGLA</span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              aria-label="Fechar menu"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search */}
        {!collapsed && <div className="px-3 py-2">
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
          {query && filteredItems.length === 0 && (
            <p className="text-[10px] text-sidebar-muted mt-1.5 px-1">Nenhum item encontrado</p>
          )}
          {query && filteredItems.length > 0 && (
            <p className="text-[10px] text-sidebar-muted mt-1.5 px-1">
              {filteredItems.length} resultado{filteredItems.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>}

        {/* Nav items */}
        <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-1" : "px-2"} pb-4`} aria-label="Menu principal">
          {filteredItems.map((item) => (
            <div key={item.label} className="min-w-0">
              <button
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                aria-expanded={item.children ? !!expanded[item.label] : undefined}
                aria-disabled={item.disabled || undefined}
                className={`w-full flex items-center ${collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"} rounded text-sm transition-colors ${
                  item.disabled
                    ? "text-sidebar-muted opacity-50 cursor-not-allowed"
                    : activeItem === item.label
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
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
              {!collapsed && item.children && expanded[item.label] && (
                <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
                  {item.children
                    .filter((c) => !query || c.label.toLowerCase().includes(query))
                    .map((child) => (
                      <button
                        key={child.label}
                        onClick={() => setActiveItem(child.label)}
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

        {/* Footer: collapse toggle (mesmo padrão do menu externo) */}
        <div className={`border-t border-sidebar-border p-2 ${collapsed ? "flex justify-center" : "px-3"}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 text-sidebar-muted hover:text-sidebar-foreground text-xs py-1.5 px-2 rounded hover:bg-sidebar-accent/50 transition-colors w-full"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!collapsed}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={16} /><span>Recolher menu</span></>}
          </button>
        </div>
      </div>

      {/* Content area mock */}
      <div className="flex-1 bg-muted/20 p-6 hidden sm:flex flex-col gap-4 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Início</span>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium truncate">{activeItem}</span>
        </div>
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="bg-muted/50 rounded-lg" />
          <div className="bg-muted/50 rounded-lg" />
          <div className="bg-muted/50 rounded-lg" />
          <div className="bg-muted/50 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ─── Code generator ─── */
function generateSidebarCode(): string {
  return `<!-- Menu Lateral __BRAND_NAME__ -->
<aside class="brand-sidebar" id="sidebarMenu">
  <!-- Cabeçalho do menu -->
  <div class="brand-sidebar__header">
    <div class="brand-sidebar__brand">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D98217" stroke-width="2">
        <path d="M3 21V5a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v4"/>
        <path d="M21 15H3"/><path d="M21 19H3"/>
      </svg>
      <span class="brand-sidebar__title">SIGLA</span>
    </div>
    <button class="brand-sidebar__close" onclick="closeSidebar()" aria-label="Fechar menu">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>

  <!-- Buscador -->
  <div class="brand-sidebar__search">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="brand-sidebar__search-icon">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input type="text" placeholder="Buscar no menu..." class="brand-sidebar__search-input" oninput="filterMenu(this.value)" />
  </div>

  <!-- Itens de navegação -->
  <nav class="brand-sidebar__nav">
    <a href="#" class="brand-sidebar__item brand-sidebar__item--active">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
      <span>Início</span>
    </a>

    <!-- Item com subitens -->
    <div class="brand-sidebar__group">
      <button class="brand-sidebar__item" onclick="toggleGroup(this)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
        </svg>
        <span>Programas</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="brand-sidebar__chevron">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <div class="brand-sidebar__subitems">
        <a href="#" class="brand-sidebar__subitem">Empretec</a>
        <a href="#" class="brand-sidebar__subitem">ALI</a>
        <a href="#" class="brand-sidebar__subitem">Programa Inova</a>
        <a href="#" class="brand-sidebar__subitem">Negócio a Negócio</a>
      </div>
    </div>

    <a href="#" class="brand-sidebar__item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <span>Usuários</span>
    </a>
  </nav>

  <!-- Rodapé -->
  <div class="brand-sidebar__footer">__BRAND_NAME__</div>
</aside>

<!-- Overlay para mobile -->
<div class="brand-sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

<style>
:root {
  /* Tokens alinhados ao design system __BRAND_NAME__ */
  --ds-sidebar-bg: hsl(228 72% 42%);
  --ds-sidebar-fg: hsl(228 30% 95%);
  --ds-sidebar-accent: hsl(228 75% 35%);
  --ds-sidebar-accent-fg: hsl(0 0% 100%);
  --ds-sidebar-border: hsl(228 60% 30%);
  --ds-sidebar-ring: hsl(196 85% 50%);
  --ds-sidebar-muted: hsl(228 25% 75%);
}
.brand-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: var(--ds-sidebar-bg);
  color: var(--ds-sidebar-fg);
  display: flex;
  flex-direction: column;
  z-index: 100;
  font-family: 'Poppins', sans-serif;
  transform: translateX(0);
  transition: transform 0.2s ease;
}
.brand-sidebar.is-closed { transform: translateX(-100%); }
.brand-sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 99;
  display: none;
}
.brand-sidebar-overlay.is-visible { display: block; }

.brand-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--ds-sidebar-border);
}
.brand-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-sidebar__title {
  font-size: 0.875rem;
  font-weight: 600;
}
.brand-sidebar__close {
  background: none;
  border: none;
  color: var(--ds-sidebar-muted);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
}
.brand-sidebar__close:hover { background: var(--ds-sidebar-accent); color: var(--ds-sidebar-fg); }

.brand-sidebar__search {
  position: relative;
  padding: 0.5rem 0.75rem;
}
.brand-sidebar__search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
}
.brand-sidebar__search-input {
  width: 100%;
  background: var(--ds-sidebar-accent);
  color: var(--ds-sidebar-fg);
  font-size: 0.75rem;
  border: 1px solid var(--ds-sidebar-border);
  border-radius: 4px;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  outline: none;
}
.brand-sidebar__search-input::placeholder { color: var(--ds-sidebar-muted); }
.brand-sidebar__search-input:focus {
  border-color: var(--ds-sidebar-ring);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ds-sidebar-ring) 30%, transparent);
}

.brand-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 0.5rem;
}
.brand-sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--ds-sidebar-fg);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.brand-sidebar__item:hover {
  background: color-mix(in srgb, var(--ds-sidebar-accent) 60%, transparent);
  color: var(--ds-sidebar-fg);
}
.brand-sidebar__item--active {
  background: var(--ds-sidebar-accent);
  color: var(--ds-sidebar-accent-fg);
  font-weight: 500;
}
.brand-sidebar__item--disabled,
.brand-sidebar__item[disabled],
.brand-sidebar__item[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  color: var(--ds-sidebar-muted);
}
.brand-sidebar__item span { flex: 1; text-align: left; }
.brand-sidebar__chevron {
  opacity: 0.4;
  transition: transform 0.2s;
}
.brand-sidebar__group.is-open .brand-sidebar__chevron {
  transform: rotate(90deg);
}

/* Estado recolhido (mini) — mesma lógica do menu externo */
.brand-sidebar.is-collapsed { width: 64px; }
.brand-sidebar.is-collapsed .brand-sidebar__title,
.brand-sidebar.is-collapsed .brand-sidebar__search,
.brand-sidebar.is-collapsed .brand-sidebar__close,
.brand-sidebar.is-collapsed .brand-sidebar__item span,
.brand-sidebar.is-collapsed .brand-sidebar__chevron,
.brand-sidebar.is-collapsed .brand-sidebar__subitems { display: none; }
.brand-sidebar.is-collapsed .brand-sidebar__item {
  justify-content: center;
  padding: 0.625rem 0;
}

.brand-sidebar__subitems {
  display: none;
  margin-left: 1.75rem;
  padding: 0.125rem 0;
}
.brand-sidebar__group.is-open .brand-sidebar__subitems { display: block; }
.brand-sidebar__subitem {
  display: block;
  font-size: 0.75rem;
  color: var(--ds-sidebar-muted);
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.brand-sidebar__subitem:hover {
  background: color-mix(in srgb, var(--ds-sidebar-accent) 50%, transparent);
  color: var(--ds-sidebar-fg);
}

.brand-sidebar__footer {
  border-top: 1px solid var(--ds-sidebar-border);
  padding: 0.5rem 1rem;
  font-size: 0.625rem;
  color: var(--ds-sidebar-muted);
}
</style>

<script>
function closeSidebar() {
  document.getElementById('sidebarMenu').classList.add('is-closed');
  document.getElementById('sidebarOverlay').classList.remove('is-visible');
}

function openSidebar() {
  document.getElementById('sidebarMenu').classList.remove('is-closed');
  document.getElementById('sidebarOverlay').classList.add('is-visible');
}

function toggleGroup(btn) {
  btn.closest('.brand-sidebar__group').classList.toggle('is-open');
}

function filterMenu(query) {
  const items = document.querySelectorAll('.brand-sidebar__item, .brand-sidebar__subitem');
  const q = query.toLowerCase();
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = !q || text.includes(q) ? '' : 'none';
  });
  // Show parent groups if children match
  document.querySelectorAll('.brand-sidebar__group').forEach(group => {
    const hasVisible = group.querySelector('.brand-sidebar__subitem:not([style*="display: none"])');
    if (hasVisible && q) group.classList.add('is-open');
  });
}
</script>`;
}

/* ─── Exported section ─── */
export default function SidebarMenuSection() {
  const [showCode, setShowCode] = useState(false);

  return (
    <div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6">
        Menu lateral com navegação hierárquica, ícones nas seções principais, subitens expansíveis com hover,
        buscador integrado e botão de fechar. Ideal para complementar o Header __BRAND_NAME__.
      </p>

      {/* Live preview */}
      <div className="brand-card mb-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Preview interativo</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Clique nos itens para navegar, expanda grupos, utilize o buscador e feche o menu pelo botão ✕.
        </p>
        <SidebarPreview />
      </div>

      {/* Code toggle */}
      <div className="brand-card mb-6">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {showCode ? "Ocultar código" : "Ver código HTML/CSS/JS"}
        </button>
        {showCode && (
          <div className="mt-3">
            <CodeBlock code={generateSidebarCode()} language="html" title="Menu Lateral __BRAND_NAME__ — Vanilla HTML/CSS/JS" />
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="brand-card">
        <h4 className="font-semibold text-foreground mb-3">Diretrizes de uso</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-success mb-1">✓ Quando usar</p>
            <ul className="space-y-1">
              <li>• Em aplicações com mais de 5 seções de navegação</li>
              <li>• Quando há hierarquia de dois níveis (seções e subseções)</li>
              <li>• Complementar ao botão de menu do header institucional</li>
              <li>• Manter o buscador para menus com muitos itens</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-error mb-1">✗ Quando não usar</p>
            <ul className="space-y-1">
              <li>• Em aplicações com poucas seções (prefira nav horizontal)</li>
              <li>• Não remova o botão de fechar em dispositivos mobile</li>
              <li>• Não ultrapasse 3 níveis de profundidade</li>
              <li>• Não altere as cores fora do padrão institucional</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
