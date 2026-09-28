import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, Sun, Moon, ArrowLeft, Home, ChevronRight, ChevronDown,
  Search, X, Calendar as CalendarIcon, Check, AlertCircle, Save, Send,
  GraduationCap, Wallet, BarChart3, Users, FileText, Bell, Shield, Settings, HelpCircle, Folder,
} from "lucide-react";
import { brandCor as brandLogoReduzida } from "@/assets/brand";
import { brandWhite as iconeBrandNegativo } from "@/assets/brand";
import { useTheme } from "@/hooks/useTheme";
import headerBusinessBgAsset from "@/assets/header-business-bg.png.asset.json";
const headerBusinessBg = headerBusinessBgAsset.url;

/* ─── Menu items (mesmos da tela de listagem) ─── */
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  children?: { label: string }[];
}
const menuItems: MenuItem[] = [
  { label: "Início", icon: <Home size={16} /> },
  { label: "Programas", icon: <GraduationCap size={16} />, children: [{ label: "Empretec" }, { label: "ALI" }, { label: "Programa Inova" }, { label: "Negócio a Negócio" }] },
  { label: "Financeiro", icon: <Wallet size={16} />, children: [{ label: "Prestação de Contas" }, { label: "Repasses" }, { label: "Convênios" }] },
  { label: "Relatórios", icon: <BarChart3 size={16} />, children: [{ label: "Indicadores" }, { label: "Dashboards" }, { label: "Exportações" }] },
  { label: "Usuários", icon: <Users size={16} /> },
  { label: "Documentos", icon: <FileText size={16} />, children: [{ label: "Normativos" }, { label: "Manuais" }, { label: "Resoluções" }] },
  { label: "Notificações", icon: <Bell size={16} /> },
  { label: "Segurança", icon: <Shield size={16} /> },
  { label: "Configurações", icon: <Settings size={16} /> },
  { label: "Ajuda", icon: <HelpCircle size={16} /> },
];

/* ─── Stepper ─── */
const steps = [
  { label: "Identificação", desc: "Programa e responsável" },
  { label: "Detalhes", desc: "Modalidade e unidade" },
  { label: "Cronograma", desc: "Datas e parcelas" },
  { label: "Revisão", desc: "Conferência e envio" },
];

interface FormState {
  programa: string;
  responsavel: string;
  email: string;
  cpf: string;
  unidade: string;
  modalidade: string;
  valor: string;
  observacoes: string;
  dataInicio: string; // DD/MM/AAAA
  dataFim: string;    // DD/MM/AAAA
  parcelas: string;
}

const initialForm: FormState = {
  programa: "", responsavel: "", email: "", cpf: "",
  unidade: "DIRAE/__BRAND_NAME__", modalidade: "Repasse mensal",
  valor: "", observacoes: "",
  dataInicio: "", dataFim: "", parcelas: "12",
};

/* ─── DatePicker (DD/MM/AAAA) ─── */
function pad(n: number) { return n.toString().padStart(2, "0"); }
function fmt(d: Date) { return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; }
function parseBR(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  if (d.getDate() !== Number(m[1])) return null;
  return d;
}

function DatePickerBR({
  id, value, onChange, error, placeholder = "DD/MM/AAAA",
}: { id: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(parseBR(value) ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const selected = parseBR(value);
  const today = new Date();

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            // máscara DD/MM/AAAA
            let v = e.target.value.replace(/\D/g, "").slice(0, 8);
            if (v.length > 4) v = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
            else if (v.length > 2) v = `${v.slice(0,2)}/${v.slice(2)}`;
            onChange(v);
          }}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`w-full text-sm rounded-md border bg-background px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary ${
            error ? "border-red-400" : "border-border"
          }`}
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground"
          aria-label="Abrir calendário"
        >
          <CalendarIcon size={14} />
        </button>
      </div>
      {open && (
        <div className="absolute z-30 mt-1 w-72 bg-popover border border-border rounded-lg shadow-lg p-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} className="p-1 rounded hover:bg-muted" aria-label="Mês anterior">
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <span className="text-xs font-semibold text-foreground">{monthNames[month]} {year}</span>
            <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} className="p-1 rounded hover:bg-muted" aria-label="Próximo mês">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground mb-1">
            {["D","S","T","Q","Q","S","S"].map((d, i) => <div key={i} className="text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c, i) => {
              if (c === null) return <div key={i} />;
              const dt = new Date(year, month, c);
              const isSel = selected && fmt(dt) === fmt(selected);
              const isToday = fmt(dt) === fmt(today);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { onChange(fmt(dt)); setOpen(false); }}
                  className={`text-xs h-7 rounded transition-colors ${
                    isSel ? "bg-secondary text-secondary-foreground font-semibold"
                    : isToday ? "border border-primary text-foreground hover:bg-muted"
                    : "text-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Validação por etapa ─── */
function validateStep(step: number, f: FormState): Record<string, string> {
  const errs: Record<string, string> = {};
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cpfRx = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (step === 0) {
    if (!f.programa.trim()) errs.programa = "Informe o nome do programa.";
    else if (f.programa.trim().length < 3) errs.programa = "Mínimo de 3 caracteres.";
    if (!f.responsavel.trim()) errs.responsavel = "Informe o responsável.";
    if (!f.email.trim()) errs.email = "Informe o e-mail.";
    else if (!emailRx.test(f.email)) errs.email = "E-mail inválido.";
    if (!f.cpf.trim()) errs.cpf = "Informe o CPF.";
    else if (!cpfRx.test(f.cpf)) errs.cpf = "Use o formato 000.000.000-00.";
  }
  if (step === 1) {
    if (!f.unidade) errs.unidade = "Selecione a unidade.";
    if (!f.modalidade) errs.modalidade = "Selecione a modalidade.";
    if (!f.valor.trim()) errs.valor = "Informe o valor.";
  }
  if (step === 2) {
    if (!parseBR(f.dataInicio)) errs.dataInicio = "Data inválida.";
    if (!parseBR(f.dataFim)) errs.dataFim = "Data inválida.";
    if (parseBR(f.dataInicio) && parseBR(f.dataFim) && parseBR(f.dataFim)! < parseBR(f.dataInicio)!) {
      errs.dataFim = "Deve ser posterior à data de início.";
    }
    if (!f.parcelas || Number(f.parcelas) < 1) errs.parcelas = "Mínimo de 1 parcela.";
  }
  return errs;
}

function maskCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/* ─── Stepper UI ─── */
function Stepper({ current, completed, onJump }: { current: number; completed: Set<number>; onJump: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-0 w-full" aria-label="Etapas do formulário">
      {steps.map((s, i) => {
        const isActive = i === current;
        const isDone = completed.has(i);
        const reachable = isDone || isActive;
        return (
          <li key={s.label} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => reachable && onJump(i)}
              disabled={!reachable}
              className={`flex items-center gap-2 group ${reachable ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors shrink-0 ${
                isDone ? "bg-primary border-primary text-primary-foreground"
                : isActive ? "bg-secondary border-secondary text-secondary-foreground"
                : "bg-card border-border text-muted-foreground"
              }`}>
                {isDone ? <Check size={14} /> : i + 1}
              </span>
              <span className="hidden sm:flex flex-col text-left leading-tight">
                <span className={`text-xs font-semibold ${isActive || isDone ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                <span className="text-[10px] text-muted-foreground">{s.desc}</span>
              </span>
            </button>
            {i < steps.length - 1 && (
              <span className={`flex-1 h-0.5 mx-2 sm:mx-3 ${completed.has(i) ? "bg-primary" : "bg-border"}`} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function TelaFormularioPage() {
  const { theme, toggleTheme } = useTheme();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState<Record<string, boolean>>({ Programas: true });
  const [activeMenu, setActiveMenu] = useState("Programas");
  const [menuSearch, setMenuSearch] = useState("");
  const menuSearchRef = useRef<HTMLInputElement>(null);
  const menuQuery = menuSearch.toLowerCase().trim();
  const filteredMenu = menuQuery
    ? menuItems.filter((it) => it.label.toLowerCase().includes(menuQuery) || it.children?.some((c) => c.label.toLowerCase().includes(menuQuery)))
    : menuItems;

  // Form
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; msg: string } | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as string]) setErrors((e) => { const n = { ...e }; delete n[k as string]; return n; });
  };

  const next = () => {
    const errs = validateStep(step, form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setToast({ kind: "error", msg: "Corrija os campos destacados para continuar." });
      setTimeout(() => setToast(null), 3500);
      return;
    }
    setCompleted((c) => new Set(c).add(step));
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const jump = (i: number) => {
    if (i <= step || completed.has(i)) setStep(i);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // valida todas as etapas anteriores
    const all = [0,1,2].reduce<Record<string,string>>((acc, i) => ({ ...acc, ...validateStep(i, form) }), {});
    if (Object.keys(all).length) {
      setErrors(all);
      setToast({ kind: "error", msg: "Há campos obrigatórios pendentes." });
      setTimeout(() => setToast(null), 3500);
      return;
    }
    setSubmitted(true);
    setCompleted(new Set([0,1,2,3]));
    setToast({ kind: "success", msg: "Formulário enviado com sucesso!" });
    setTimeout(() => setToast(null), 4000);
  };

  const reset = () => {
    setForm(initialForm); setStep(0); setCompleted(new Set()); setErrors({}); setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Link
        to="/templates"
        className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-foreground/90 text-background text-xs rounded-full shadow-lg hover:bg-foreground transition-colors"
      >
        <ArrowLeft size={12} /> Voltar ao DS
      </Link>

      {/* HEADER — Composição visual (negócios) · Sem título */}
      <header className="shrink-0 sticky top-0 z-40 border-b border-border bg-background">
        <div
          role="img"
          aria-label="Clareza que o mercado exige para o futuro dos negócios"
          style={{
            height: "112px",
            backgroundImage: `url(${headerBusinessBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="text-white flex items-center px-4 gap-3"
          style={{ height: "36px", minHeight: "36px", maxHeight: "52px", backgroundColor: "#123148" }}
        >
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0"
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={sidebarOpen}
          >
            <Menu size={18} />
            <span className="text-[10px] hidden sm:inline">Menu</span>
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-white/10 rounded transition-colors shrink-0"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Moon size={16} className="text-white/80" /> : <Sun size={16} className="text-white/80" />}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-[260px] bg-sidebar text-sidebar-foreground flex flex-col shrink-0 border-r border-sidebar-border">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <img src={iconeBrandNegativo} alt="__BRAND_NAME__" className="h-5 w-5" />
                <span className="text-sm font-semibold">SIGLA</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-white/10 transition-colors" aria-label="Fechar menu">
                <X size={16} />
              </button>
            </div>
            <div className="px-3 py-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  ref={menuSearchRef}
                  type="text"
                  placeholder="Buscar no menu..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-white/10 text-white text-xs rounded pl-8 pr-8 py-2 placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-secondary/50 focus:border-secondary/50"
                />
                {menuSearch && (
                  <button onClick={() => { setMenuSearch(""); menuSearchRef.current?.focus(); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" aria-label="Limpar busca">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Menu principal">
              {filteredMenu.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      setActiveMenu(item.label);
                      if (item.children) setMenuExpanded((p) => ({ ...p, [item.label]: !p[item.label] }));
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                      activeMenu === item.label ? "bg-white/15 text-white font-medium" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left text-[13px]">{item.label}</span>
                    {item.children && (menuExpanded[item.label] ? <ChevronDown size={14} className="text-white/40" /> : <ChevronRight size={14} className="text-white/40" />)}
                  </button>
                  {item.children && menuExpanded[item.label] && (
                    <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
                      {item.children.filter((c) => !menuQuery || c.label.toLowerCase().includes(menuQuery)).map((child) => (
                        <button
                          key={child.label}
                          onClick={() => setActiveMenu(child.label)}
                          className={`block w-full text-left text-xs px-3 py-1.5 rounded transition-colors ${
                            activeMenu === child.label ? "text-white bg-white/10 font-medium" : "text-white/50 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="border-t border-white/10 px-3 py-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-white/50 text-[10px]">
                <Folder size={12} />
                <span>__BRAND_NAME__</span>
              </div>
            </div>
          </aside>
        )}

        {/* Conteúdo */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Breadcrumb */}
          <nav aria-label="Navegação estrutural" className="flex items-center gap-1.5 px-5 py-2.5 bg-card border-b border-border text-xs">
            <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-secondary transition-colors">
              <Home size={12} /> <span>Início</span>
            </a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Programas</a>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <span className="font-semibold text-primary dark:text-foreground" aria-current="page">Novo Cadastro</span>
          </nav>

          {/* Title */}
          <div className="px-5 py-4 bg-card border-b border-border">
            <h1 className="text-lg font-bold text-foreground">Cadastro de Programa</h1>
            <p className="text-xs text-muted-foreground">Preencha as etapas a seguir para registrar um novo programa.</p>
          </div>

          {/* Stepper */}
          <div className="px-5 py-5 bg-card border-b border-border">
            <Stepper current={step} completed={completed} onJump={jump} />
          </div>

          {/* Conteúdo principal */}
          <main className="flex-1 px-5 py-6">
            {submitted ? (
              <div className="max-w-2xl mx-auto bg-card rounded-xl border border-border p-8 text-center animate-in fade-in zoom-in-95">
                <div className="mx-auto w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <Check className="text-green-700 dark:text-green-400" size={28} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Cadastro concluído</h2>
                <p className="text-sm text-muted-foreground mt-1">O programa <strong className="text-foreground">{form.programa}</strong> foi registrado com sucesso.</p>
                <div className="mt-5 flex justify-center gap-2">
                  <button onClick={reset} className="px-4 py-2 text-xs border border-border rounded hover:bg-muted transition-colors">
                    Novo cadastro
                  </button>
                  <button className="px-4 py-2 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    Ver detalhes
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-6 sm:p-8">
                {/* ETAPA 0 */}
                {step === 0 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <h2 className="text-base font-bold text-foreground">Identificação</h2>
                    <p className="text-xs text-muted-foreground -mt-3">Dados básicos do programa e do responsável.</p>

                    <Field label="Nome do programa" id="programa" required error={errors.programa}>
                      <input id="programa" type="text" value={form.programa} onChange={(e) => update("programa", e.target.value)}
                        placeholder="Ex: Empretec — Empreendedorismo"
                        className={inputCls(errors.programa)} aria-invalid={!!errors.programa} />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Responsável" id="responsavel" required error={errors.responsavel}>
                        <input id="responsavel" type="text" value={form.responsavel} onChange={(e) => update("responsavel", e.target.value)}
                          placeholder="Nome completo"
                          className={inputCls(errors.responsavel)} aria-invalid={!!errors.responsavel} />
                      </Field>
                      <Field label="CPF" id="cpf" required error={errors.cpf}>
                        <input id="cpf" type="text" inputMode="numeric" value={form.cpf} onChange={(e) => update("cpf", maskCPF(e.target.value))}
                          placeholder="000.000.000-00"
                          className={inputCls(errors.cpf)} aria-invalid={!!errors.cpf} />
                      </Field>
                    </div>

                    <Field label="E-mail institucional" id="email" required error={errors.email}>
                      <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                        placeholder="responsavel@__ORG_DOMAIN__"
                        className={inputCls(errors.email)} aria-invalid={!!errors.email} />
                    </Field>
                  </div>
                )}

                {/* ETAPA 1 */}
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <h2 className="text-base font-bold text-foreground">Detalhes do programa</h2>
                    <p className="text-xs text-muted-foreground -mt-3">Defina a unidade gestora, modalidade e valor.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Unidade gestora" id="unidade" required error={errors.unidade}>
                        <select id="unidade" value={form.unidade} onChange={(e) => update("unidade", e.target.value)} className={inputCls(errors.unidade)}>
                          <option>DIRAE/__BRAND_NAME__</option>
                          <option>DIFIN/__BRAND_NAME__</option>
                          <option>DIPRO/__BRAND_NAME__</option>
                          <option>DIGAP/__BRAND_NAME__</option>
                        </select>
                      </Field>
                      <Field label="Modalidade" id="modalidade" required error={errors.modalidade}>
                        <select id="modalidade" value={form.modalidade} onChange={(e) => update("modalidade", e.target.value)} className={inputCls(errors.modalidade)}>
                          <option>Repasse mensal</option>
                          <option>Repasse trimestral</option>
                          <option>Repasse semestral</option>
                          <option>Repasse anual</option>
                          <option>Aquisição direta</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Valor previsto (R$)" id="valor" required error={errors.valor}>
                      <input id="valor" type="text" value={form.valor} onChange={(e) => update("valor", e.target.value)}
                        placeholder="Ex: 1.240.000,00"
                        className={inputCls(errors.valor)} aria-invalid={!!errors.valor} />
                    </Field>

                    <Field label="Observações" id="obs" hint="Opcional · Máx. 500 caracteres">
                      <textarea id="obs" rows={3} maxLength={500} value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)}
                        placeholder="Informações adicionais relevantes..."
                        className={`${inputCls(undefined)} resize-y`} />
                    </Field>
                  </div>
                )}

                {/* ETAPA 2 */}
                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <h2 className="text-base font-bold text-foreground">Cronograma</h2>
                    <p className="text-xs text-muted-foreground -mt-3">Defina o período de execução e o número de parcelas.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Data de início" id="dt-ini" required error={errors.dataInicio}>
                        <DatePickerBR id="dt-ini" value={form.dataInicio} onChange={(v) => update("dataInicio", v)} error={errors.dataInicio} />
                      </Field>
                      <Field label="Data de término" id="dt-fim" required error={errors.dataFim}>
                        <DatePickerBR id="dt-fim" value={form.dataFim} onChange={(v) => update("dataFim", v)} error={errors.dataFim} />
                      </Field>
                    </div>

                    <Field label="Número de parcelas" id="parcelas" required error={errors.parcelas}>
                      <input id="parcelas" type="number" min={1} max={48} value={form.parcelas} onChange={(e) => update("parcelas", e.target.value)}
                        className={inputCls(errors.parcelas)} aria-invalid={!!errors.parcelas} />
                    </Field>
                  </div>
                )}

                {/* ETAPA 3 — Revisão (Lista Descritiva) */}
                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <h2 className="text-base font-bold text-foreground">Revisão</h2>
                    <p className="text-xs text-muted-foreground -mt-3">Confira os dados antes de enviar.</p>

                    <div className="rounded-lg border border-border overflow-hidden">
                      <DescGroup title="Identificação" onEdit={() => setStep(0)}>
                        <DescItem label="Programa" value={form.programa || "—"} />
                        <DescItem label="Responsável" value={form.responsavel || "—"} />
                        <DescItem label="CPF" value={form.cpf || "—"} />
                        <DescItem label="E-mail" value={form.email || "—"} />
                      </DescGroup>
                      <DescGroup title="Detalhes" onEdit={() => setStep(1)}>
                        <DescItem label="Unidade gestora" value={form.unidade} />
                        <DescItem label="Modalidade" value={form.modalidade} />
                        <DescItem label="Valor previsto" value={form.valor ? `R$ ${form.valor}` : "—"} />
                        <DescItem label="Observações" value={form.observacoes || "—"} />
                      </DescGroup>
                      <DescGroup title="Cronograma" onEdit={() => setStep(2)} last>
                        <DescItem label="Início" value={form.dataInicio || "—"} />
                        <DescItem label="Término" value={form.dataFim || "—"} />
                        <DescItem label="Parcelas" value={form.parcelas} />
                      </DescGroup>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <p>Após o envio, este cadastro entrará em análise pela unidade gestora. Você poderá acompanhar o status na listagem de programas.</p>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-border">
                  <button type="button" onClick={prev} disabled={step === 0}
                    className="px-4 py-2 text-xs border border-border rounded hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Voltar
                  </button>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setToast({ kind: "success", msg: "Rascunho salvo." }); setTimeout(() => setToast(null), 3000); }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border border-border rounded hover:bg-muted transition-colors">
                      <Save size={12} /> Salvar rascunho
                    </button>
                    {step < steps.length - 1 ? (
                      <button type="button" onClick={next}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded transition-colors">
                        Avançar <ChevronRight size={12} />
                      </button>
                    ) : (
                      <button type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors">
                        <Send size={12} /> Enviar cadastro
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </main>

          {/* Footer institucional */}
          <footer className="border-t border-border bg-card px-5 py-3 text-[10px] text-muted-foreground text-center">
            __BRAND_NAME__ · __BRAND_SLOGAN__
          </footer>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className={`flex items-start gap-2 px-4 py-3 rounded-lg shadow-lg border max-w-sm ${
            toast.kind === "success"
              ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300"
          }`}>
            {toast.kind === "success" ? <Check size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
            <p className="text-xs">{toast.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Field & DescList helpers ─── */
function inputCls(error?: string) {
  return `w-full text-sm rounded-md border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary ${
    error ? "border-red-400" : "border-border"
  }`;
}

function Field({ label, id, required, error, hint, children }:
  { label: string; id: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-foreground mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 mt-1">
          <AlertCircle size={11} /> {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>
      ) : null}
    </div>
  );
}

function DescGroup({ title, children, onEdit, last }: { title: string; children: React.ReactNode; onEdit: () => void; last?: boolean }) {
  return (
    <div className={last ? "" : "border-b border-border"}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">{title}</h3>
        <button type="button" onClick={onEdit} className="text-[11px] font-medium text-secondary hover:underline">Editar</button>
      </div>
      <dl className="divide-y divide-border">
        {children}
      </dl>
    </div>
  );
}

function DescItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-2.5 text-xs">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-foreground break-words">{value}</dd>
    </div>
  );
}
