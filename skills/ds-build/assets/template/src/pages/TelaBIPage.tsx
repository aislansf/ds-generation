import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Database, Moon, Sun, Menu, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { SEO } from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { BIDataProvider, useBI } from "@/context/BIDataContext";
import BISidebar, { BISection } from "@/components/bi/BISidebar";
import BIHeaderFilters from "@/components/bi/BIHeaderFilters";
import VisaoGeral from "@/components/bi/sections/VisaoGeral";
import Empresas from "@/components/bi/sections/Empresas";
import Atendimentos from "@/components/bi/sections/Atendimentos";
import Oportunidades from "@/components/bi/sections/Oportunidades";
import Regioes from "@/components/bi/sections/Regioes";
import Qualidade from "@/components/bi/sections/Qualidade";
import ImportarPlanilha from "@/components/bi/sections/ImportarPlanilha";
import Configuracoes from "@/components/bi/sections/Configuracoes";
import brandLogoBranca from "@/assets/brand-logo-white-header.svg";

/**
 * Template "Tela BI" — modelo de painel de inteligência comercial do
 * __BRAND_NAME__, com filtros globais, seções analíticas e importação de planilha.
 */
export default function TelaBIPage() {
  return (
    <BIDataProvider>
      <TelaBIShell />
    </BIDataProvider>
  );
}

function TelaBIShell() {
  const { registros } = useBI();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [section, setSection] = useState<BISection>("visao-geral");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  const mostrarFiltros = section !== "importar" && section !== "configuracoes";

  function selecionar(s: BISection) {
    setSection(s);
    if (isMobile) setDrawerOpen(false);
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <SEO
        title="Tela BI — Inteligência Comercial | Design System __BRAND_NAME__"
        description="Modelo de painel de inteligência comercial do __BRAND_NAME__: filtros globais, empresas atendidas, oportunidades, macrorregiões e qualidade dos dados."
        path="/templates/tela-bi"
      />
      <h1 className="sr-only">Tela BI — painel de inteligência comercial do __BRAND_NAME__</h1>

      {/* Sidebar desktop */}
      {!isMobile && (
        <BISidebar active={section} onChange={selecionar} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      )}

      {/* Drawer mobile */}
      {isMobile && drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 flex">
            <BISidebar active={section} onChange={selecionar} collapsed={false} onToggle={() => setDrawerOpen(false)} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, var(--brand-header-grad-start) 0%, var(--brand-header-grad-end) 100%)",
          }}
        >
          {isMobile && (
            <button data-ds="button" data-variant="marca"
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label="Abrir menu lateral"
              className="p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10"
            >
              {drawerOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          <Link
            to="/templates"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground/90 hover:text-primary-foreground"
          >
            <ArrowLeft size={14} /> Templates
          </Link>
          <span className="hidden sm:block w-px h-8 shrink-0" style={{ background: "var(--brand-header-divider)" }} />
          <img src={brandLogoBranca} alt="__BRAND_NAME__" className="h-8 w-auto shrink-0" />
          <span className="w-px h-8 shrink-0" style={{ background: "var(--brand-header-divider)" }} />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-primary-foreground/75 leading-tight truncate">
              __BRAND_NAME__ · Tela BI
            </p>
            <p className="text-sm font-semibold text-primary-foreground leading-tight truncate">
              Inteligência Comercial
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-primary-foreground">
              <Database size={16} className="opacity-75" />
              <span className="text-xs font-semibold tabular-nums">
                {registros.length} registros na base
              </span>
            </div>
            <button data-ds="button" data-variant="marca"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10"
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
          {mostrarFiltros && (
            <BIHeaderFilters
              onImportar={() => setSection("importar")}
              onExportar={() =>
                toast.success("Exportação disponível na seção Empresas atendidas", {
                  description: "Use o botão Exportar XLSX na listagem de empresas.",
                })
              }
            />
          )}

          {section === "visao-geral" && <VisaoGeral loading={loading} />}
          {section === "empresas" && <Empresas loading={loading} />}
          {section === "atendimentos" && <Atendimentos loading={loading} />}
          {section === "oportunidades" && <Oportunidades loading={loading} />}
          {section === "regioes" && <Regioes />}
          {section === "qualidade" && <Qualidade loading={loading} />}
          {section === "importar" && <ImportarPlanilha />}
          {section === "configuracoes" && <Configuracoes />}
        </main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
