import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft,
  ChevronRight, Shield, Info, HelpCircle,
  ExternalLink
} from "lucide-react";
import { brandCor as brandLogoCompleta } from "@/assets/brand";
import exemploImg from "@/assets/empreendedora-brand.jpg";
import { BrandLogo } from "@/components/BrandLogo";

export default function PaginaAutenticacaoPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-poppins animate-fade-in">
      {/* Botão flutuante para voltar ao DS (padrão dos templates) */}
      <Link
        to="/templates"
        className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-[#2A4FDA] text-white text-xs rounded-full shadow-lg hover:bg-[#2A4FDA]/90 transition-all hover:scale-105"
      >
        <ArrowLeft size={12} /> Voltar ao DS
      </Link>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Lado Esquerdo: Marca e Imagem (Visível apenas em desktop) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted">
          <img
            src={exemploImg}
            alt="Empreendedora atendida pelo __BRAND_SHORT__"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 w-full flex flex-col justify-between p-12">
            <div>
              <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-16 w-auto brightness-0 invert" />
              <div className="mt-12 space-y-6 max-w-lg">
                <h1 className="text-4xl font-bold text-white leading-tight text-balance">
                  <span className="block">Transformando vidas</span>
                  <span className="block">por meio da educação financeira.</span>
                </h1>
              </div>
            </div>
            <div />
          </div>
        </div>

        {/* Lado Direito: Formulário de Login */}
        <div className="w-full lg:w-1/2 flex flex-col bg-card overflow-y-auto">
          {/* Mobile Header com gradiente + imagem */}
          <div className="lg:hidden relative overflow-hidden px-6 py-10 sm:py-14 bg-muted">
            <img
              src={exemploImg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col items-center text-center gap-4 max-w-md mx-auto">
              <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-10 sm:h-12 w-auto brightness-0 invert" />
              <h1 className="text-lg sm:text-xl font-bold text-white leading-snug text-balance">
                <span className="inline sm:block">Transformando vidas </span>
                <span className="inline sm:block">por meio da educação financeira.</span>
              </h1>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-20">
            <div className="w-full max-w-[420px] space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Acesse sua conta</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bem-vindo de volta! Por favor, insira suas credenciais para acessar o painel administrativo.
                </p>
              </div>

              {/* Botão Gov.br - Padrão Federal */}
              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-[#1351b4] hover:bg-[#1351b4]/90 text-white font-semibold text-sm transition-all shadow-md group">
                <span>Entrar com gov.br</span>
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">Ou use o acesso direto</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1.5">
                    <Mail size={14} className="text-muted-foreground" /> E-mail Institucional
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@__ORG_DOMAIN__"
                      className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pw" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Lock size={14} className="text-muted-foreground" /> Senha de Acesso
                    </label>
                    <a href="#" className="text-xs font-medium text-primary hover:underline">Esqueceu a senha?</a>
                  </div>
                  <div className="relative">
                    <input
                      id="pw"
                      type={showPw ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full border border-input rounded px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPw ? "Ocultar senha" : "Ver senha"}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring"
                  />
                  <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                    Lembrar minhas credenciais neste dispositivo
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    "Entrar no Sistema"
                  )}
                </button>
              </form>

              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground text-center">
                    Ainda não possui acesso aos nossos sistemas?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to="/templates/cadastro"
                      className="inline-flex items-center justify-center gap-2 border border-border bg-background text-foreground px-4 py-2 rounded text-xs font-medium hover:bg-muted transition-colors w-full"
                    >
                      <Shield size={14} className="text-muted-foreground" /> Solicitar Acesso
                    </Link>
                    <button className="inline-flex items-center justify-center gap-2 border border-border bg-background text-foreground px-4 py-2 rounded text-xs font-medium hover:bg-muted transition-colors">
                      <HelpCircle size={14} className="text-muted-foreground" /> Central de Ajuda
                    </button>
                  </div>
                  <div className="flex justify-center pt-4">
                    <BrandLogo variant="mono" width={100} height={80} opacity={0.4} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer do Login */}
          <footer className="p-8 border-t border-border bg-muted/20">
            <div className="max-w-lg mx-auto w-full space-y-6">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
                <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-foreground transition-colors">Acessibilidade</a>
                <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
              </div>


              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  © 2026 __BRAND_NAME__ — __BRAND_FULL_NAME__.<br />
                  Avenida Monsenhor Tabosa, 777, Praia de Iracema — Fortaleza/CE. CNPJ 07.121.244/0001-08.<br />
                  Atendimento: 0800 570 0800 · ouvidoria@__ORG_DOMAIN__
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
