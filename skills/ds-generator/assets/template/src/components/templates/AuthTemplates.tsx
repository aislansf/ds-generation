import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CodeBlock } from "@/components/DSComponents";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { brandCor as brandLogoCompleta } from "@/assets/brand";

/* ─── Sign In Preview ─── */
function SignInPreview() {
  const [showPw, setShowPw] = useState(false);
  return (
    <div className="bg-muted/40 rounded-xl p-8 flex items-center justify-center min-h-[520px]">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-[86px]" />
        </div>
        <h3 className="text-center text-lg font-semibold text-foreground mb-1">Bem-vindo</h3>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Informe seu e-mail e senha para acessar o sistema.
        </p>

        {/* Card */}
        <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">E-mail <span className="text-[#D98217]">*</span></label>
            <input
              type="email"
              placeholder="usuario@__ORG_DOMAIN__"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Senha <span className="text-[#D98217]">*</span></label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                defaultValue="••••••••"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-input accent-[#2A4FDA] w-4 h-4" />
              Manter conectado
            </label>
            <a href="#" className="text-xs font-medium text-[#2A4FDA] hover:underline">Esqueceu a senha?</a>
          </div>

          <button className="w-full h-10 rounded-lg bg-[#2A4FDA] text-white text-sm font-medium hover:bg-[#2A4FDA]/90 transition-colors">
            Entrar
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Novo por aqui?{" "}
            <Link to="/templates/cadastro" className="font-medium text-[#D98217] hover:underline">Criar uma conta</Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          © 2026 __BRAND_NAME__ — Fundo Nacional de Desenvolvimento da Educação
        </p>
      </div>
    </div>
  );
}

/* ─── Sign Up Preview ─── */
function SignUpPreview() {
  const [showPw, setShowPw] = useState(false);
  return (
    <div className="bg-muted/40 rounded-xl p-8 flex items-center justify-center min-h-[600px]">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-[86px]" />
        </div>
        <h3 className="text-center text-lg font-semibold text-foreground mb-1">Criar conta</h3>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Preencha os campos abaixo para criar sua conta no sistema __BRAND_NAME__.
        </p>

        {/* Card */}
        <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Nome completo <span className="text-[#D98217]">*</span></label>
            <input
              type="text"
              placeholder="João da Silva"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">E-mail <span className="text-[#D98217]">*</span></label>
            <input
              type="email"
              placeholder="usuario@__ORG_DOMAIN__"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">CPF <span className="text-[#D98217]">*</span></label>
            <input
              type="text"
              placeholder="000.000.000-00"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Senha <span className="text-[#D98217]">*</span></label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Mín. 8 caracteres"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Confirmar senha <span className="text-[#D98217]">*</span></label>
              <input
                type="password"
                placeholder="Repita a senha"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded border-input accent-[#2A4FDA] w-4 h-4 mt-0.5" />
            <span>
              Eu concordo com os{" "}
              <a href="#" className="font-medium text-[#2A4FDA] hover:underline">Termos de Uso</a>
              {" "}e{" "}
              <a href="#" className="font-medium text-[#2A4FDA] hover:underline">Política de Privacidade</a>
            </span>
          </label>

          <button className="w-full h-10 rounded-lg bg-[#2A4FDA] text-white text-sm font-medium hover:bg-[#2A4FDA]/90 transition-colors">
            Criar conta
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/templates/pagina-autenticacao" className="font-medium text-[#D98217] hover:underline">Entrar</Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          © 2026 __BRAND_NAME__ — Fundo Nacional de Desenvolvimento da Educação
        </p>
      </div>
    </div>
  );
}

/* ─── Code snippets ─── */
const signInCode = `<!-- Sign In — __BRAND_NAME__ Design System -->
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f4f5;font-family:'Poppins',sans-serif">
  <div style="width:100%;max-width:420px;padding:2rem">
    <div style="text-align:center;margin-bottom:1.5rem">
      <img src="/assets/brand-logo.svg" alt="__BRAND_NAME__" style="height:86px">
    </div>
    <h3 style="text-align:center;font-size:1.125rem;font-weight:600;margin-bottom:4px">Bem-vindo</h3>
    <p style="text-align:center;font-size:0.75rem;color:#71717a;margin-bottom:1.5rem">
      Informe seu e-mail e senha para acessar o sistema.
    </p>
    <div style="background:#fff;border-radius:0.75rem;border:1px solid #e4e4e7;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)">
      <div style="margin-bottom:1rem">
        <label style="font-size:0.75rem;font-weight:500">E-mail <span style="color:#D98217">*</span></label>
        <input type="email" placeholder="usuario@__ORG_DOMAIN__"
          style="width:100%;height:40px;border-radius:8px;border:1px solid #e4e4e7;padding:0 12px;font-size:0.875rem;margin-top:6px">
      </div>
      <div style="margin-bottom:1rem">
        <label style="font-size:0.75rem;font-weight:500">Senha <span style="color:#D98217">*</span></label>
        <input type="password" placeholder="••••••••"
          style="width:100%;height:40px;border-radius:8px;border:1px solid #e4e4e7;padding:0 12px;font-size:0.875rem;margin-top:6px">
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;font-size:0.75rem">
        <label><input type="checkbox" style="margin-right:6px">Manter conectado</label>
        <a href="#" style="color:#2A4FDA;font-weight:500">Esqueceu a senha?</a>
      </div>
      <button style="width:100%;height:40px;border-radius:8px;background:#2A4FDA;color:#fff;font-size:0.875rem;font-weight:500;border:none;cursor:pointer">
        Entrar
      </button>
      <p style="text-align:center;font-size:0.75rem;color:#71717a;margin-top:1rem">
        Novo por aqui? <a href="#" style="color:#D98217;font-weight:500">Criar uma conta</a>
      </p>
    </div>
    <p style="text-align:center;font-size:10px;color:#a1a1aa;margin-top:1.5rem">© 2026 __BRAND_NAME__</p>
  </div>
</div>`;

const signUpCode = `<!-- Sign Up — __BRAND_NAME__ Design System -->
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f4f5;font-family:'Poppins',sans-serif">
  <div style="width:100%;max-width:420px;padding:2rem">
    <div style="text-align:center;margin-bottom:1.5rem">
      <img src="/assets/brand-logo.svg" alt="__BRAND_NAME__" style="height:86px">
    </div>
    <h3 style="text-align:center;font-size:1.125rem;font-weight:600;margin-bottom:4px">Criar conta</h3>
    <p style="text-align:center;font-size:0.75rem;color:#71717a;margin-bottom:1.5rem">
      Preencha os campos abaixo para criar sua conta no sistema __BRAND_NAME__.
    </p>
    <div style="background:#fff;border-radius:0.75rem;border:1px solid #e4e4e7;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)">
      <div style="margin-bottom:1rem">
        <label style="font-size:0.75rem;font-weight:500">Nome completo <span style="color:#D98217">*</span></label>
        <input type="text" placeholder="João da Silva"
          style="width:100%;height:40px;border-radius:8px;border:1px solid #e4e4e7;padding:0 12px;font-size:0.875rem;margin-top:6px">
      </div>
      <div style="margin-bottom:1rem">
        <label style="font-size:0.75rem;font-weight:500">E-mail <span style="color:#D98217">*</span></label>
        <input type="email" placeholder="usuario@__ORG_DOMAIN__"
          style="width:100%;height:40px;border-radius:8px;border:1px solid #e4e4e7;padding:0 12px;font-size:0.875rem;margin-top:6px">
      </div>
      <div style="margin-bottom:1rem">
        <label style="font-size:0.75rem;font-weight:500">CPF <span style="color:#D98217">*</span></label>
        <input type="text" placeholder="000.000.000-00"
          style="width:100%;height:40px;border-radius:8px;border:1px solid #e4e4e7;padding:0 12px;font-size:0.875rem;margin-top:6px">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem">
        <div>
          <label style="font-size:0.75rem;font-weight:500">Senha <span style="color:#D98217">*</span></label>
          <input type="password" placeholder="Mín. 8 caracteres"
            style="width:100%;height:40px;border-radius:8px;border:1px solid #e4e4e7;padding:0 12px;font-size:0.875rem;margin-top:6px">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:500">Confirmar <span style="color:#D98217">*</span></label>
          <input type="password" placeholder="Repita a senha"
            style="width:100%;height:40px;border-radius:8px;border:1px solid #e4e4e7;padding:0 12px;font-size:0.875rem;margin-top:6px">
        </div>
      </div>
      <label style="display:flex;align-items:flex-start;gap:8px;font-size:0.75rem;color:#71717a;margin-bottom:1rem">
        <input type="checkbox" style="margin-top:2px">
        <span>Eu concordo com os <a href="#" style="color:#2A4FDA;font-weight:500">Termos de Uso</a> e <a href="#" style="color:#2A4FDA;font-weight:500">Política de Privacidade</a></span>
      </label>
      <button style="width:100%;height:40px;border-radius:8px;background:#2A4FDA;color:#fff;font-size:0.875rem;font-weight:500;border:none;cursor:pointer">
        Criar conta
      </button>
      <p style="text-align:center;font-size:0.75rem;color:#71717a;margin-top:1rem">
        Já tem uma conta? <a href="#" style="color:#D98217;font-weight:500">Entrar</a>
      </p>
    </div>
    <p style="text-align:center;font-size:10px;color:#a1a1aa;margin-top:1.5rem">© 2026 __BRAND_NAME__</p>
  </div>
</div>`;

/* ─── Two-Factor Preview ─── */
function TwoFactorPreview() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="bg-muted/40 rounded-xl p-8 flex items-center justify-center min-h-[480px]">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-[86px]" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#2A4FDA]/10 flex items-center justify-center">
            <ShieldCheck size={28} className="text-[#2A4FDA]" />
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold text-foreground mb-1">Verificação em duas etapas</h3>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Insira o código de 6 dígitos enviado para o seu e-mail ou aplicativo autenticador.
        </p>

        {/* Card */}
        <div className="bg-card rounded-xl border shadow-sm p-6 space-y-5">
          {/* OTP inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { inputsRef.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30 transition-all"
              />
            ))}
          </div>

          <button className="w-full h-10 rounded-lg bg-[#2A4FDA] text-white text-sm font-medium hover:bg-[#2A4FDA]/90 transition-colors">
            Verificar código
          </button>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Não recebeu o código?{" "}
              <a href="#" className="font-medium text-[#D98217] hover:underline">Reenviar código</a>
            </p>
            <Link to="/templates/pagina-autenticacao" className="text-xs font-medium text-[#2A4FDA] hover:underline">
              Voltar para o login
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          © 2026 __BRAND_NAME__ — Fundo Nacional de Desenvolvimento da Educação
        </p>
      </div>
    </div>
  );
}

const twoFactorCode = `<!-- Two-Factor Auth — __BRAND_NAME__ Design System -->
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f4f5;font-family:'Poppins',sans-serif">
  <div style="width:100%;max-width:420px;padding:2rem;text-align:center">
    <div style="margin-bottom:1.5rem">
      <img src="/assets/brand-logo.svg" alt="__BRAND_NAME__" style="height:86px">
    </div>
    <div style="width:56px;height:56px;border-radius:50%;background:rgba(13,56,87,.1);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2A4FDA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
      </svg>
    </div>
    <h3 style="font-size:1.125rem;font-weight:600;margin-bottom:4px">Verificação em duas etapas</h3>
    <p style="font-size:0.75rem;color:#71717a;margin-bottom:1.5rem">
      Insira o código de 6 dígitos enviado para o seu e-mail ou aplicativo autenticador.
    </p>
    <div style="background:#fff;border-radius:0.75rem;border:1px solid #e4e4e7;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)">
      <div style="display:flex;justify-content:center;gap:12px;margin-bottom:1.25rem">
        <input type="text" maxlength="1" inputmode="numeric" style="width:44px;height:48px;text-align:center;font-size:1.125rem;font-weight:600;border-radius:8px;border:1px solid #e4e4e7">
        <input type="text" maxlength="1" inputmode="numeric" style="width:44px;height:48px;text-align:center;font-size:1.125rem;font-weight:600;border-radius:8px;border:1px solid #e4e4e7">
        <input type="text" maxlength="1" inputmode="numeric" style="width:44px;height:48px;text-align:center;font-size:1.125rem;font-weight:600;border-radius:8px;border:1px solid #e4e4e7">
        <input type="text" maxlength="1" inputmode="numeric" style="width:44px;height:48px;text-align:center;font-size:1.125rem;font-weight:600;border-radius:8px;border:1px solid #e4e4e7">
        <input type="text" maxlength="1" inputmode="numeric" style="width:44px;height:48px;text-align:center;font-size:1.125rem;font-weight:600;border-radius:8px;border:1px solid #e4e4e7">
        <input type="text" maxlength="1" inputmode="numeric" style="width:44px;height:48px;text-align:center;font-size:1.125rem;font-weight:600;border-radius:8px;border:1px solid #e4e4e7">
      </div>
      <button style="width:100%;height:40px;border-radius:8px;background:#2A4FDA;color:#fff;font-size:0.875rem;font-weight:500;border:none;cursor:pointer">
        Verificar código
      </button>
      <p style="font-size:0.75rem;color:#71717a;margin-top:1rem">
        Não recebeu o código? <a href="#" style="color:#D98217;font-weight:500">Reenviar código</a>
      </p>
      <a href="#" style="font-size:0.75rem;color:#2A4FDA;font-weight:500">Voltar para o login</a>
    </div>
    <p style="font-size:10px;color:#a1a1aa;margin-top:1.5rem">© 2026 __BRAND_NAME__</p>
  </div>
</div>`;

/* ─── Exported Section ─── */
export default function AuthTemplatesSection() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "2fa">("signin");
  const [showCode, setShowCode] = useState(false);

  const tabs = [
    { key: "signin" as const, label: "Sign In" },
    { key: "signup" as const, label: "Sign Up" },
    { key: "2fa" as const, label: "Two-Factor" },
  ];

  const titles: Record<string, string> = {
    signin: "Tela de Login (Sign In)",
    signup: "Tela de Cadastro (Sign Up)",
    "2fa": "Autenticação de Dois Fatores (2FA)",
  };

  const descriptions: Record<string, string> = {
    signin: "Modelo de autenticação com e-mail e senha, opção de lembrar e recuperação de senha.",
    signup: "Formulário de criação de conta com nome, e-mail, CPF, senha e aceite de termos.",
    "2fa": "Verificação em duas etapas com código OTP de 6 dígitos, reenvio e navegação de retorno.",
  };

  const codeMap: Record<string, string> = {
    signin: signInCode,
    signup: signUpCode,
    "2fa": twoFactorCode,
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setShowCode(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === t.key
                ? "bg-[#2A4FDA] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="brand-card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">{titles[activeTab]}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{descriptions[activeTab]}</p>
          </div>
          <span className="brand-badge-primary shrink-0 text-[10px]">Autenticação</span>
        </div>

        {activeTab === "signin" && <SignInPreview />}
        {activeTab === "signup" && <SignUpPreview />}
        {activeTab === "2fa" && <TwoFactorPreview />}

        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs font-medium text-primary hover:underline mt-3"
        >
          {showCode ? "Ocultar código" : "Ver código"}
        </button>
        {showCode && (
          <CodeBlock
            code={codeMap[activeTab]}
            language="html"
            title={`${titles[activeTab]} — HTML`}
          />
        )}
      </div>
    </div>
  );
}
