import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail, Lock, User, ArrowLeft,
  ChevronRight, Shield, Building, Phone, ChevronDown
} from "lucide-react";
import { brandCor as brandLogoCompleta } from "@/assets/brand";
import { brandCor as brandLogoReduzida } from "@/assets/brand";
import marcaGov from "@/assets/marca-gov.png";
import exemploImg from "@/assets/exemplo-imagem-login.jpg";

export default function CadastroPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    orgao: "",
    password: ""
  });

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula processamento e vai para 2FA
    setTimeout(() => {
      setIsLoading(false);
      navigate("/templates/autenticacao-2fa");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-poppins animate-fade-in">
      <Link
        to="/templates/pagina-autenticacao"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={12} /> Voltar ao Login
      </Link>

      <div className="flex-1 flex overflow-hidden">
        {/* Lado Esquerdo: Marca e Imagem (Desktop) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#2A4FDA] overflow-hidden">
          <img
            src={exemploImg}
            alt="Edifício __BRAND_NAME__"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A4FDA] via-[#2A4FDA]/40 to-transparent" />

          <div className="relative z-10 w-full flex flex-col justify-between p-12">
            <div>
              <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-16 w-auto brightness-0 invert" />
              <div className="mt-12 space-y-6 max-w-lg">
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Sua porta de entrada para a gestão educacional.
                </h1>
                <p className="text-lg text-white/80">
                  Solicite seu acesso para começar a utilizar as ferramentas de gestão e financiamento da educação brasileira.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white/60">
              <Shield size={32} className="text-white" />
              <p className="text-sm">
                Seu cadastro passará por uma análise de segurança antes da liberação total das funcionalidades.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário de Cadastro */}
        <div className="w-full lg:w-1/2 flex flex-col bg-card overflow-y-auto">
          <div className="lg:hidden flex justify-center p-8 bg-[#FDF1D0] border-b border-[#e0b86a]">
            <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-10 w-auto" />
          </div>

          <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-16">
            <div className="w-full max-w-[480px] space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Solicitar Acesso</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Preencha os dados abaixo para criar sua conta institucional.
                </p>
              </div>

              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                      <User size={14} className="text-muted-foreground" /> Nome Completo
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                      <Shield size={14} className="text-muted-foreground" /> CPF
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <Mail size={14} className="text-muted-foreground" /> E-mail Institucional
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    placeholder="usuario@orgao.gov.br"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <Building size={14} className="text-muted-foreground" /> Órgão / Instituição
                  </label>
                  <div className="relative">
                    <select className="appearance-none w-full border border-input rounded px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
                      <option value="">Selecione seu órgão</option>
                      <option value="brand">__BRAND_NAME__</option>
                      <option value="mec">MEC</option>
                      <option value="prefeitura">Prefeitura Municipal</option>
                      <option value="estado">Secretaria Estadual</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <Lock size={14} className="text-muted-foreground" /> Criar Senha
                  </label>
                  <input
                    required
                    type="password"
                    className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Mínimo de 8 caracteres, com letras e números.</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>Criar minha conta <ChevronRight size={16} /></>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Já possui uma conta?{" "}
                  <Link to="/templates/pagina-autenticacao" className="text-primary hover:underline font-medium">
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <footer className="p-8 border-t border-border bg-muted/20">
            <div className="max-w-lg mx-auto w-full space-y-4">
              <div className="flex flex-col items-center gap-3">
                <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-6 opacity-40 grayscale" />
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  © 2026 Fundo Nacional de Desenvolvimento da Educação.<br />
                  Sistema de Credenciamento Único.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
