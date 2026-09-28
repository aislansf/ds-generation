import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Home, AlertTriangle, AlertCircle, Search } from "lucide-react";
import { brandCor as brandLogoReduzida } from "@/assets/brand";

type ErrorType = "404" | "500" | "generic";

export default function ErrorPageTemplate() {
  const [errorType, setErrorType] = useState<ErrorType>("404");
  const navigate = useNavigate();

  const errorContent = {
    "404": {
      code: "404",
      title: "Página não encontrada",
      message: "Desculpe, a página que você está procurando não existe ou foi movida para um novo endereço.",
      icon: <Search className="w-16 h-16 text-primary/40" />,
      action: "Voltar para o Início",
      actionIcon: <Home size={18} />,
    },
    "500": {
      code: "500",
      title: "Erro Interno do Servidor",
      message: "Ocorreu um problema inesperado em nossos servidores. Nossa equipe técnica já foi notificada.",
      icon: <AlertCircle className="w-16 h-16 text-error/40" />,
      action: "Tentar Novamente",
      actionIcon: <RefreshCw size={18} />,
    },
    "generic": {
      code: "!",
      title: "Ops! Algo deu errado",
      message: "Não foi possível processar sua solicitação no momento. Por favor, tente novamente mais tarde.",
      icon: <AlertTriangle className="w-16 h-16 text-warning/40" />,
      action: "Voltar",
      actionIcon: <ArrowLeft size={18} />,
    },
  };

  const content = errorContent[errorType];

  return (
    <div className="min-h-screen bg-brand-primary-50 flex flex-col items-center justify-center p-4">
      {/* Selector for demonstration purposes */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm p-1 rounded-full border border-border shadow-lg flex gap-1 z-50">
        {(["404", "500", "generic"] as ErrorType[]).map((type) => (
          <button
            key={type}
            onClick={() => setErrorType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              errorType === type
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Logo */}
          <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-12 w-auto mb-8" />
          
          {/* Icon */}
          <div className="mb-6 p-4 bg-muted/30 rounded-full">
            {content.icon}
          </div>

          {/* Status Code */}
          <span className="text-sm font-bold text-primary/60 tracking-widest uppercase mb-2">
            Status {content.code}
          </span>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {content.title}
          </h1>

          {/* Message */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {content.message}
          </p>

          {/* Action Button */}
          <button
            onClick={() => navigate("/templates")}
            className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            {content.actionIcon}
            {content.action}
          </button>

          {/* Support Link */}
          <p className="mt-8 text-xs text-muted-foreground">
            Precisa de ajuda? <a href="#" className="text-primary hover:underline font-semibold">Contate o suporte técnico</a>
          </p>
        </div>

        {/* Footer info */}
        <div className="bg-muted/30 px-8 py-4 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
          <span>ID da Sessão: 48f2-9bc1-55ea</span>
          <span>© 2024 __BRAND_NAME__</span>
        </div>
      </div>

      {/* Back to templates link */}
      <button 
        onClick={() => navigate("/templates")}
        className="mt-8 text-sm font-semibold text-primary/60 hover:text-primary flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para o Catálogo de Templates
      </button>
    </div>
  );
}
