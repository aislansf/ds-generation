import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import DSLayout from "@/components/DSLayout";
import HomePage from "@/pages/HomePage";
import RouteLoadingFallback from "@/components/RouteLoadingFallback";

// Wrap lazy imports to recover from stale chunk errors after a redeploy.
// If a dynamic import fails (chunk hash changed), force a one-time reload.
function lazyWithRetry<T extends { default: React.ComponentType<unknown> }>(
  factory: () => Promise<T>,
) {
  return lazy(async () => {
    const flag = "lovable:chunk-reloaded";
    try {
      return await factory();
    } catch (err) {
      if (typeof window !== "undefined" && !sessionStorage.getItem(flag)) {
        sessionStorage.setItem(flag, "1");
        window.location.reload();
        // Return a never-resolving promise while the reload happens
        return await new Promise<T>(() => {});
      }
      throw err;
    }
  });
}

const FundamentosPage = lazyWithRetry(() => import("@/pages/FundamentosPage"));
const TokensPage = lazyWithRetry(() => import("@/pages/TokensPage"));
const ComponentesPage = lazyWithRetry(() => import("@/pages/ComponentesPage"));
const TemplatesPage = lazyWithRetry(() => import("@/pages/TemplatesPage"));
const MarcaPage = lazyWithRetry(() => import("@/pages/MarcaPage"));
const ConteudoPage = lazyWithRetry(() => import("@/pages/ConteudoPage"));
const AcessibilidadePage = lazyWithRetry(() => import("@/pages/AcessibilidadePage"));
const DashboardInstitucionalPage = lazyWithRetry(() => import("@/pages/DashboardInstitucionalPage"));
const DashboardBIPage = lazyWithRetry(() => import("@/pages/DashboardBIPage"));
const TelaListagemPage = lazyWithRetry(() => import("@/pages/TelaListagemPage"));
const TelaFormularioPage = lazyWithRetry(() => import("@/pages/TelaFormularioPage"));
const PaginaAutenticacaoPage = lazyWithRetry(() => import("@/pages/PaginaAutenticacaoPage"));
const CadastroPage = lazyWithRetry(() => import("@/pages/CadastroPage"));
const TwoFactorPage = lazyWithRetry(() => import("@/pages/TwoFactorPage"));
const ErrorPageTemplate = lazyWithRetry(() => import("@/pages/ErrorPageTemplate"));
const ModalAcessoTemplatePage = lazyWithRetry(() => import("@/pages/ModalAcessoTemplatePage"));
const PaginaFiltrosTabelaPage = lazyWithRetry(() => import("@/pages/PaginaFiltrosTabelaPage"));
const NotFound = lazyWithRetry(() => import("@/pages/NotFound"));
const FarolEstrategicoPage = lazyWithRetry(() => import("@/pages/FarolEstrategicoPage"));
const FarolEstrategicoDocsPage = lazyWithRetry(() => import("@/pages/FarolEstrategicoDocsPage"));
const ModelosBIPage = lazyWithRetry(() => import("@/pages/ModelosBIPage"));
const PlanejaBIPage = lazyWithRetry(() => import("@/pages/modelos-bi/PlanejaPage"));
const MPIBIPage = lazyWithRetry(() => import("@/pages/modelos-bi/MPIPage"));
const GestaoPessoasBIPage = lazyWithRetry(() => import("@/pages/modelos-bi/GestaoPessoasPage"));
const FarolEstrategicoHubPage = lazyWithRetry(() => import("@/pages/modelos-bi/FarolEstrategicoHubPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Standalone template page (sem DSLayout) */}
            <Route path="/templates/dashboard-institucional" element={<DashboardInstitucionalPage />} />
            <Route path="/templates/dashboard-bi" element={<DashboardBIPage />} />
            <Route path="/templates/tela-listagem" element={<TelaListagemPage />} />
            <Route path="/templates/tela-formulario" element={<TelaFormularioPage />} />
            <Route path="/templates/pagina-autenticacao" element={<PaginaAutenticacaoPage />} />
            <Route path="/templates/cadastro" element={<CadastroPage />} />
            <Route path="/templates/autenticacao-2fa" element={<TwoFactorPage />} />
            <Route path="/templates/pagina-erro" element={<ErrorPageTemplate />} />
            <Route path="/templates/modal-acesso" element={<ModalAcessoTemplatePage />} />
            <Route path="/templates/pagina-filtros-tabela" element={<PaginaFiltrosTabelaPage />} />
            <Route path="/templates/farol-estrategico" element={<FarolEstrategicoPage />} />

            {/* Modelos de BI - rotas standalone */}
            <Route path="/modelos-bi/farol-estrategico/bi" element={<FarolEstrategicoPage />} />
            <Route path="/modelos-bi/planeja" element={<PlanejaBIPage />} />
            <Route path="/modelos-bi/mpi" element={<MPIBIPage />} />
            <Route path="/modelos-bi/gestao-pessoas" element={<GestaoPessoasBIPage />} />

            {/* Demais rotas dentro do DSLayout */}
            <Route
              path="*"
              element={
                <DSLayout>
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/fundamentos" element={<FundamentosPage />} />
                    <Route path="/tokens" element={<TokensPage />} />
                    <Route path="/componentes" element={<ComponentesPage />} />
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/templates/farol-estrategico/docs" element={<Navigate to="/modelos-bi/farol-estrategico/docs" replace />} />
                    <Route path="/modelos-bi" element={<ModelosBIPage />} />
                    <Route path="/modelos-bi/farol-estrategico" element={<FarolEstrategicoHubPage />} />
                    <Route path="/modelos-bi/farol-estrategico/docs" element={<FarolEstrategicoDocsPage />} />
                    <Route path="/marca" element={<MarcaPage />} />
                    <Route path="/conteudo" element={<ConteudoPage />} />
                    <Route path="/acessibilidade" element={<AcessibilidadePage />} />
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </DSLayout>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
