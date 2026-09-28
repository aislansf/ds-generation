import { useNavigate } from "react-router-dom";
import {
  Palette, Code2, Component, LayoutTemplate, Stamp, FileText,
  Accessibility, ArrowRight, BookOpen, Users, Shield, Lightbulb,
  Sun, Moon, Quote, MessageCircle, Users2, BadgeCheck, Ban
} from "lucide-react";
import { PageHeader } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";
import { brandWhite as brandLogo } from "@/assets/brand";

const sections = [
  { icon: <Palette size={24} />, title: "Fundamentos", desc: "Tipografia, cores, iconografia, grid, espaçamento e princípios visuais", path: "/fundamentos" },
  { icon: <Code2 size={24} />, title: "Tokens", desc: "CSS Custom Properties documentados e prontos para uso em light e dark mode", path: "/tokens" },
  { icon: <Component size={24} />, title: "Componentes", desc: "Botões, inputs, cards, tabelas, modais e mais de 20 componentes", path: "/componentes" },
  { icon: <LayoutTemplate size={24} />, title: "Templates", desc: "Padrões de página: dashboard, listagem, formulário e autenticação", path: "/templates" },
  { icon: <Stamp size={24} />, title: "Marca __BRAND_NAME__", desc: "Logo, identidade visual, zona de segurança e aplicações da marca", path: "/marca" },
  { icon: <FileText size={24} />, title: "Conteúdo", desc: "Voz da marca, tom de voz, boas práticas de escrita e microcopy", path: "/conteudo" },
  { icon: <Accessibility size={24} />, title: "Acessibilidade", desc: "Contraste, navegação por teclado, ARIA, foco visível e semântica", path: "/acessibilidade" },
];

const principles = [
  { icon: <Users size={20} />, title: "Acessível", desc: "Disponível para todas as pessoas, em qualquer dispositivo." },
  { icon: <Shield size={20} />, title: "Confiável", desc: "Lisura, integridade e responsabilidade em cada detalhe." },
  { icon: <Lightbulb size={20} />, title: "Inovador", desc: "Tecnologias e práticas modernas a serviço das pessoas." },
  { icon: <BookOpen size={20} />, title: "Claro", desc: "Comunicação plural, acessível e de fácil entendimento." },
];

// MODELO: voz da marca genérica do ds-generator. Reescreva com o tom de voz do briefing
// (conteudo.tom_de_voz, conteudo.publico) e o manual da marca, e apague os comentários MODELO.
const tomDeVozPilares = [
  {
    title: "Somos próximos.",
    desc:
      "Falamos com as pessoas, não para elas. Mostramos que estamos lado a lado, entendendo o momento e a necessidade de quem nos procura.",
    somos: ["Parceiros", "Empáticos", "Dialógicos"],
    naoSomos: ["Distantes", "Invasivos", "Prepotentes"],
  },
  {
    title: "Somos claros.",
    desc:
      "Vamos direto ao ponto, com frases curtas e palavras do dia a dia. Explicamos termos técnicos quando eles são inevitáveis.",
    somos: ["Objetivos", "Simples", "Precisos"],
    naoSomos: ["Rebuscados", "Vagos", "Técnicos demais"],
  },
  {
    title: "Somos confiáveis.",
    desc:
      "Informamos com base em fatos e dados, sem promessas exageradas. Quando algo muda, avisamos com antecedência e transparência.",
    somos: ["Transparentes", "Consistentes", "Responsáveis"],
    naoSomos: ["Alarmistas", "Ilusórios"],
  },
  {
    title: "Somos acessíveis.",
    desc:
      "Escrevemos para que qualquer pessoa entenda, em qualquer dispositivo. Linguagem inclusiva, contraste adequado e textos alternativos fazem parte do padrão.",
    somos: ["Inclusivos", "Humanos"],
    naoSomos: ["Complicados", "Excludentes"],
  },
];

const diretrizesGerais = [
  {
    title: "Pessoa gramatical · Nós (1ª pessoa do plural)",
    desc:
      "Usamos \"nós\" para falar da instituição e \"você\" para falar com quem nos lê. Exemplo: \"Preparamos um passo a passo para você concluir seu cadastro.\"",
  },
  {
    title: "Linguagem simples",
    desc:
      "Uma ideia por frase, voz ativa e verbos no lugar de substantivos. Evitamos siglas sem explicação e estrangeirismos quando há palavra equivalente em português.",
  },
  {
    title: "Emojis com moderação",
    desc:
      "No ambiente digital, emojis ajudam a deixar o conteúdo mais leve, mas devem ser usados sem exageros. Escolha os facilmente compreensíveis e nunca substitua palavras por eles.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <SEO
        title="Design System __BRAND_SHORT__ — Guia visual e operacional"
        description="Portal oficial do Design System __BRAND_NAME__ com fundamentos visuais, tokens, componentes, templates e modelos de BI para os produtos digitais do __BRAND_SHORT__."
        path="/"
      />
      <PageHeader
        title="Design System __BRAND_NAME__ — Guia visual e operacional"
        description="Guia visual, técnico e operacional para o time de desenvolvimento da __BRAND_NAME__. __BRAND_SLOGAN__."
        badge="v1.0.0"
      />

      {/* Hero */}
      <div className="rounded-xl bg-primary text-primary-foreground p-8 md:p-10 mb-10">
        <img
          src={brandLogo}
          alt="Marca __BRAND_NAME__"
          className="h-auto w-auto max-w-full max-h-[6.6125rem] md:max-h-[7.935rem] mb-6 object-contain"
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Sistema de padrões para as aplicações do __BRAND_NAME__
        </h2>
        <p className="opacity-80 max-w-2xl leading-relaxed mb-6">
          Este Design System estabelece padrões de UI e implementação para os produtos digitais do __BRAND_NAME__. Desenvolvido em vanilla (sem frameworks ou bibliotecas externas), assegura compatibilidade, flexibilidade e reutilização em qualquer stack ou aplicações geradas por IA.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate("/fundamentos")}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded font-medium text-sm hover:opacity-90 transition-opacity">
            Começar <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate("/componentes")}
            className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-4 py-2 rounded font-medium text-sm hover:bg-primary-foreground/20 transition-colors">
            Ver componentes
          </button>
        </div>
      </div>

      {/* Dark/Light highlight */}
      <div className="brand-card mb-10 flex items-center gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Sun size={20} />
          <span className="text-sm font-medium">/</span>
          <Moon size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Suporte a Dark Mode</h3>
          <p className="text-xs text-muted-foreground">Todos os tokens, componentes e templates são compatíveis com modo claro e escuro. Use o toggle no header para alternar.</p>
        </div>
      </div>

      {/* === Voz da marca === */}
      {/* MODELO: seção genérica de voz da marca. Reescreva a partir do briefing e do manual. */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
          <h2 className="text-xl font-bold" style={{ color: "#005EB8" }}>Voz da marca</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Como a marca __BRAND_SHORT__ se expressa em produtos digitais, do título ao microcopy.
        </p>

        {/* Assinatura destacada */}
        <div className="brand-card mb-6 relative overflow-hidden">
          <div className="absolute -top-4 -left-2 text-primary/10">
            <Quote size={120} strokeWidth={1} />
          </div>
          <div className="relative">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
              Assinatura
            </span>
            <p className="font-heading text-2xl md:text-3xl leading-tight mt-4 mb-3 text-foreground">
              __BRAND_SLOGAN__
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              Frase-assinatura da marca __BRAND_SHORT__.
            </p>
          </div>
        </div>

        {/* Personalidade — intro do Tom de Voz */}
        <div className="brand-card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-card-icon text-card-icon-foreground flex items-center justify-center">
              <Users2 size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Personalidade</h3>
              <p className="text-[11px] text-muted-foreground">
                A atitude que orienta toda fala da marca.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Existimos para facilitar a vida de quem usa nossos serviços. Por isso, falamos
            com clareza, tratamos cada pessoa com respeito e mostramos o caminho em vez de
            complicá-lo. Somos especialistas, mas não usamos isso para criar distância.
          </p>
        </div>

        {/* Tom de voz — 4 pilares */}
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={16} className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#005EB8" }}>
            Tom de voz · 4 pilares
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {tomDeVozPilares.map((p) => (
            <div key={p.title} className="brand-card flex flex-col">
              <h4 className="font-heading text-base font-semibold text-foreground leading-snug mb-2">
                {p.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {p.desc}
              </p>
              <div className="mt-auto space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success">
                    <BadgeCheck size={12} /> Somos
                  </span>
                  {p.somos.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-destructive">
                    <Ban size={12} /> Não somos
                  </span>
                  {p.naoSomos.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Diretrizes Gerais */}
        <div className="brand-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-card-icon text-card-icon-foreground flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Diretrizes gerais</h3>
              <p className="text-[11px] text-muted-foreground">
                Regras que valem para toda comunicação __BRAND_SHORT__.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {diretrizesGerais.map((d) => (
              <div
                key={d.title}
                className="rounded-lg border border-border bg-muted/30 p-3"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  {d.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] font-mono text-muted-foreground mt-3">
          Referência:{" "}
          <a
            href="__BRAND_MANUAL_URL__"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary"
          >
            Manual da marca __BRAND_SHORT__
          </a>
        </p>
      </section>

      {/* Principles */}
      <h2 className="text-xl font-bold mb-4" style={{ color: "#005EB8" }}>Princípios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {principles.map((p) => (
          <div key={p.title} className="brand-card">
            <div className="w-10 h-10 rounded-lg bg-card-icon text-card-icon-foreground flex items-center justify-center mb-3">
              {p.icon}
            </div>
            <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <h2 className="text-xl font-bold mb-4" style={{ color: "#005EB8" }}>Navegue pelo sistema</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {sections.map((s) => (
          <button key={s.path} onClick={() => navigate(s.path)} className="brand-card-hover text-left group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-card-icon text-card-icon-foreground">
              {s.icon}
            </div>
            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{s.title}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="brand-card">
        <h2 className="text-lg font-bold mb-3">Status do sistema</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">20+</p>
            <p className="text-xs text-muted-foreground">Componentes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">50+</p>
            <p className="text-xs text-muted-foreground">Tokens</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">7</p>
            <p className="text-xs text-muted-foreground">Templates</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">2</p>
            <p className="text-xs text-muted-foreground">Temas (Light/Dark)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
