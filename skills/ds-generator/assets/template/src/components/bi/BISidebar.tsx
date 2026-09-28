import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PhoneCall,
  Target,
  Map,
  ShieldCheck,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type BISection =
  | "visao-geral"
  | "empresas"
  | "atendimentos"
  | "oportunidades"
  | "regioes"
  | "qualidade"
  | "importar"
  | "configuracoes";

interface Props {
  active: BISection;
  onChange: (s: BISection) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const items: { id: BISection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "visao-geral", label: "Visão Geral", icon: LayoutDashboard },
  { id: "empresas", label: "Empresas", icon: Building2 },
  { id: "atendimentos", label: "Atendimentos", icon: PhoneCall },
  { id: "oportunidades", label: "Oportunidades", icon: Target },
  { id: "regioes", label: "Regiões", icon: Map },
  { id: "qualidade", label: "Qualidade dos Dados", icon: ShieldCheck },
  { id: "importar", label: "Importar Planilha", icon: Upload },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export default function BISidebar({ active, onChange, collapsed, onToggle }: Props) {
  return (
    <aside
      className={`${collapsed ? "w-16" : "w-64"} shrink-0 border-r border-border bg-card transition-all duration-200 flex flex-col`}
    >
      <div className={`h-16 flex items-center ${collapsed ? "justify-center" : "justify-between px-4"} border-b border-border`}>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Painel</span>
            <span className="text-sm font-bold text-foreground">Tela BI</span>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-foreground/80 hover:bg-muted"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className={`p-4 border-t border-border text-[10px] text-muted-foreground ${collapsed ? "text-center" : ""}`}>
        {collapsed ? "v1" : "Tela BI · v1.0"}
      </div>
    </aside>
  );
}
