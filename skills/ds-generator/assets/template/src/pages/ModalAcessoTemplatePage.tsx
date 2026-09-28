import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";

/**
 * Template "Modal de Acesso" — modal de senha de demonstração.
 *
 * IMPORTANTE: este é apenas um MODELO visual reutilizável.
 * Não use senha hardcoded em produção — para acesso restrito real
 * utilize autenticação via Lovable Cloud (Supabase).
 */
export default function ModalAcessoTemplatePage() {
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const DEMO_EMAIL = "admin@exemplo.com";
  const DEMO_PASSWORD = "brand"; // apenas para demonstração do template

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Informe o e-mail.");
      return;
    }
    if (password.trim() === DEMO_PASSWORD) {
      setUnlocked(true);
      setOpen(false);
      setError(null);
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/templates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Voltar para Templates
          </Link>
          <BrandLogo variant="auto" className="h-8" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <ShieldCheck size={14} /> Template · Modal de Acesso
          </span>
          <h1 className="text-3xl font-bold text-foreground">Conteúdo protegido por senha</h1>
          <p className="text-muted-foreground">
            Demonstração do modal de acesso. Use o e-mail <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">{DEMO_EMAIL}</code> e a senha <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">brand</code> para liberar.
          </p>
          {unlocked && (
            <div className="mt-6 p-6 rounded-xl border border-success/30 bg-success/10 text-success-foreground">
              <p className="font-semibold text-success">Acesso liberado!</p>
              <p className="text-sm text-success/80 mt-1">Aqui entraria o conteúdo restrito da sua aplicação.</p>
              <button
                onClick={() => { setUnlocked(false); setPassword(""); setOpen(true); }}
                className="mt-4 text-xs underline text-primary"
              >
                Reabrir modal
              </button>
            </div>
          )}
        </div>
      </main>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-acesso-titulo"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-primary text-primary-foreground p-6 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                <Lock size={22} />
              </div>
              <h2 id="modal-acesso-titulo" className="text-lg font-bold">Acesso restrito</h2>
              <p className="text-xs text-primary-foreground/80 text-center">
                Informe seu e-mail e senha para visualizar este conteúdo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="modal-email" className="text-xs font-semibold text-foreground">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    autoFocus
                    className="w-full border border-input rounded-lg pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={DEMO_EMAIL}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="modal-pass" className="text-xs font-semibold text-foreground">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="modal-pass"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full border border-input rounded-lg pl-9 pr-10 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Digite a senha"
                    aria-invalid={!!error}
                    aria-describedby={error ? "modal-pass-error" : undefined}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && (
                  <p id="modal-pass-error" className="text-xs text-error font-medium">{error}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-input accent-primary"
                  />
                  Lembrar de mim
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Esqueci a senha
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:brightness-110 transition-all"
              >
                Acessar
              </button>

              <div className="pt-1 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground text-center pt-3">
                  Novo por aqui?{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary font-medium hover:underline">
                    Criar uma conta
                  </a>
                </p>
                <p className="text-[11px] text-muted-foreground text-center mt-1">
                  Modelo de demonstração — utilize autenticação real em produção.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}