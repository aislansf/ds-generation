import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ComponentPreview, CodeBlock } from "@/components/DSComponents";
import exemploImg from "@/assets/brand-empreendedora.jpg";
import { brandCor as brandLogo } from "@/assets/brand";

function CardSignInPreview() {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-border grid grid-cols-1 md:grid-cols-2 min-h-[520px] bg-muted/30">
      {/* Left — Form */}
      <div className="flex flex-col justify-center px-8 py-10 bg-card rounded-l-xl">
        <div className="max-w-sm mx-auto w-full space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={brandLogo} alt="__BRAND_NAME__" className="h-[86px] w-auto" />
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">Bem-vindo ao Sistema</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Informe seu e-mail e senha para continuar.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                E-mail <span className="text-[#D98217]">*</span>
              </label>
              <div className="flex items-center border border-border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-[#2A4FDA]/30">
                <span className="flex items-center justify-center w-10 h-10 bg-muted/50 border-r border-border text-muted-foreground">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="admin@exemplo.com"
                  className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Senha <span className="text-[#D98217]">*</span>
              </label>
              <div className="flex items-center border border-border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-[#2A4FDA]/30">
                <span className="flex items-center justify-center w-10 h-10 bg-muted/50 border-r border-border text-muted-foreground">
                  <Lock size={16} />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  defaultValue="12345678"
                  className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="px-3 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              Lembrar de mim
            </label>
            <a href="#" className="text-sm text-[#2A75AE] hover:text-[#0041D9] hover:underline transition-colors">Esqueceu a senha?</a>
          </div>

          {/* Button */}
          <button className="w-full py-2.5 rounded-md bg-[#2A4FDA] text-white font-medium text-sm hover:bg-[#0a2d47] transition-colors">
            Entrar
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Novo aqui?{" "}
            <a href="#" className="text-[#2A75AE] hover:text-[#0041D9] hover:underline font-medium transition-colors">Criar uma conta</a>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground pt-4">
            © 2025 __BRAND_NAME__
          </p>
        </div>
      </div>

      {/* Right — Image */}
      <div className="relative hidden md:block rounded-r-xl overflow-hidden">
        <img
          src={exemploImg}
          alt="Mulher empreendedora trabalhando em casa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#163F5F] to-white/0" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white text-2xl font-semibold leading-tight" style={{ fontFamily: "'__FONT_DISPLAY__', 'Poppins', sans-serif" }}>
            Estimulamos o empreendedorismo
          </p>
        </div>
      </div>
    </div>
  );
}

const cardSignInCode = `<!-- Modelo Card (Sign In) — __BRAND_NAME__ -->
<div class="card-signin">
  <div class="card-signin__form">
    <img src="/assets/brand-logo.svg" alt="__BRAND_NAME__" class="card-signin__logo" />
    <h2>Bem-vindo ao Sistema</h2>
    <p>Informe seu e-mail e senha para continuar.</p>
    <form>
      <label>E-mail <span class="required">*</span></label>
      <div class="input-icon">
        <span class="input-icon__prefix">✉</span>
        <input type="email" placeholder="admin@exemplo.com" />
      </div>
      <label>Senha <span class="required">*</span></label>
      <div class="input-icon">
        <span class="input-icon__prefix">🔒</span>
        <input type="password" />
      </div>
      <div class="card-signin__options">
        <label><input type="checkbox" /> Lembrar de mim</label>
        <a href="#">Esqueceu a senha?</a>
      </div>
      <button type="submit">Entrar</button>
    </form>
    <p class="card-signin__register">Novo aqui? <a href="#">Criar uma conta</a></p>
    <p class="card-signin__footer">© 2025 __BRAND_NAME__</p>
  </div>
  <div class="card-signin__image">
    <img src="/assets/brand-empreendedora.jpg" alt="Mulher empreendedora trabalhando em casa" />
    <div class="card-signin__overlay"></div>
    <div class="card-signin__caption">
      <strong>Soluções que aproximam pessoas e serviços</strong>
      <span>Visão: ser referência em soluções digitais que aproximam pessoas e serviços.</span>
    </div>
  </div>
</div>

<style>
.card-signin {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 520px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  font-family: 'Poppins', sans-serif;
}
.card-signin__form {
  display: flex; flex-direction: column;
  justify-content: center; padding: 2rem;
  background: #fff;
}
.card-signin__logo {
  height: 40px; width: auto;
  margin: 0 auto 1.5rem;
}
.card-signin__form h2 {
  text-align: center; font-size: 1.125rem;
  font-weight: 700; color: #1a1a1a;
}
.card-signin__form > p {
  text-align: center; font-size: 0.875rem;
  color: #6b7280; margin-top: 0.25rem;
}
.input-icon {
  display: flex; align-items: center;
  border: 1px solid #d1d5db; border-radius: 6px;
  overflow: hidden; margin-top: 0.25rem;
}
.input-icon__prefix {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px;
  background: #f3f4f6; border-right: 1px solid #d1d5db;
  color: #6b7280; font-size: 0.875rem;
}
.input-icon input {
  flex: 1; padding: 0.5rem 0.75rem;
  border: none; font-size: 0.875rem;
  outline: none;
}
.card-signin__form label {
  display: block; font-size: 0.875rem;
  font-weight: 500; margin-top: 1rem;
}
.required { color: #D98217; }
.card-signin__options {
  display: flex; justify-content: space-between;
  align-items: center; margin-top: 1rem;
  font-size: 0.875rem;
}
.card-signin__options a {
  color: #D98217; text-decoration: none;
}
.card-signin__form button[type="submit"] {
  width: 100%; padding: 0.625rem;
  background: #2A4FDA; color: #fff;
  border: none; border-radius: 6px;
  font-weight: 500; font-size: 0.875rem;
  margin-top: 1.5rem; cursor: pointer;
}
.card-signin__register {
  text-align: center; font-size: 0.875rem;
  color: #6b7280; margin-top: 1rem;
}
.card-signin__register a {
  color: #D98217; font-weight: 500;
  text-decoration: none;
}
.card-signin__footer {
  text-align: center; font-size: 0.75rem;
  color: #9ca3af; margin-top: 1.5rem;
}
.card-signin__image {
  position: relative;
}
.card-signin__image img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.card-signin__overlay {
  position: absolute; inset: 0;
  background: rgba(13,56,87,0.4);
}
.card-signin__caption {
  position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem;
}
.card-signin__caption strong {
  display: block; color: rgba(255,255,255,0.9);
  font-size: 0.875rem;
}
.card-signin__caption span {
  display: block; color: rgba(255,255,255,0.6);
  font-size: 0.75rem; margin-top: 0.25rem;
}
@media (max-width: 768px) {
  .card-signin { grid-template-columns: 1fr; }
  .card-signin__image { display: none; }
}
</style>`;

export default function CardSignInSection() {
  return (
    <ComponentPreview
      title="Modelo Card (Sign In)"
      description="Layout com formulário à esquerda com ícones nos campos e imagem institucional à direita, seguindo o padrão visual __BRAND_NAME__."
      code={cardSignInCode}
    >
      <CardSignInPreview />
    </ComponentPreview>
  );
}
