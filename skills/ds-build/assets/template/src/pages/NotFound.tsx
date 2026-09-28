import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 font-poppins animate-fade-in">
      <Helmet>
        <title>Página não encontrada — Design System __BRAND_SHORT__</title>
        <meta name="description" content="A página solicitada não existe ou foi movida. Volte para o portal do Design System __BRAND_NAME__." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="max-w-md w-full bg-card rounded-lg shadow-xl border border-border overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Marca __BRAND_SHORT__ colorida */}
          <BrandLogo variant="color" width={120} height={64} className="mb-8" />

          {/* Ícone */}
          <div className="mb-6 p-4 bg-muted rounded-full">
            <Search className="w-16 h-16 text-primary/40" strokeWidth={1.5} />
          </div>

          {/* Status */}
          <span className="text-sm font-medium text-primary/60 tracking-widest uppercase mb-2">
            Status 404
          </span>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            Página não encontrada
          </h1>

          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Desculpe, a página que você está procurando não existe ou foi
            movida para um novo endereço.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Home size={16} />
            Voltar para o início
          </button>

          <p className="mt-8 text-xs text-muted-foreground">
            Precisa de ajuda?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Contate o suporte técnico
            </a>
          </p>
        </div>

        <div className="bg-muted/40 px-8 py-4 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
          <span className="truncate">Rota: {location.pathname}</span>
          <span>© {new Date().getFullYear()} __BRAND_NAME__</span>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar à página anterior
      </button>
    </div>
  );
};

export default NotFound;
