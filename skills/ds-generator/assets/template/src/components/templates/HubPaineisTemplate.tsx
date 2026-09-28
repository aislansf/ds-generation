import { useState } from "react";
import {
  BarChart3, FileText, Users, Shield, Landmark, BookOpen,
  GraduationCap, Building2, Scale, PieChart, ClipboardList,
  TrendingUp, Search, X, Moon, Sun, Menu
} from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import { brandCor as logoBrandCompleta2, brandWhite as brandLogoWhite } from "@/assets/brand";
import hubThumb1 from "@/assets/hub-thumb-1.jpg";
import hubThumb2 from "@/assets/hub-thumb-2.jpg";
import hubThumb3 from "@/assets/hub-thumb-3.jpg";
import hubThumb4 from "@/assets/hub-thumb-4.jpg";

interface PainelCard {
  id: string;
  sigla: string;
  siglaCor: string;
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  imagem?: string;
}

const paineis: PainelCard[] = [
  {
    id: "gestao-atas",
    sigla: "GEAT",
    siglaCor: "bg-brand-primary",
    titulo: "Painel de Gestão de ATAS",
    descricao: "Painel estratégico para monitorar a recuperação de créditos, aprimorando a gestão financeira.",
    icon: <ClipboardList size={32} />,
    imagem: hubThumb1,
  },
  {
    id: "ouvidoria-sic",
    sigla: "SIGLA",
    siglaCor: "bg-brand-secondary",
    titulo: "Ouvidoria SIC",
    descricao: "Painel do Setor de Ouvidoria (SIC) para monitoramento das manifestações dos cidadãos.",
    icon: <Users size={32} />,
    imagem: hubThumb2,
  },
  {
    id: "ouvidoria-gestao",
    sigla: "SIGLA",
    siglaCor: "bg-brand-secondary",
    titulo: "Ouvidoria e Gestão de Ouvidoria",
    descricao: "Painel da Ouvidoria e Gestão de Ouvidoria do __BRAND_NAME__ para acompanhamento das manifestações.",
    icon: <FileText size={32} />,
    imagem: hubThumb3,
  },
  {
    id: "cadastro-base",
    sigla: "DIRAD",
    siglaCor: "bg-brand-primary",
    titulo: "Cadastro Base — Parceiros Institucionais",
    descricao: "Acompanhamento da situação cadastral dos parceiros institucionais.",
    icon: <Building2 size={32} />,
    imagem: hubThumb4,
  },
  {
    id: "painel-pdtic",
    sigla: "DITEC",
    siglaCor: "bg-brand-primary",
    titulo: "Painel PDTIC",
    descricao: "Painel do Plano Diretor de Tecnologia da Informação e Comunicação do órgão.",
    icon: <BarChart3 size={32} />,
    imagem: hubThumb1,
  },
  {
    id: "retomada-projetos",
    sigla: "DIGOV",
    siglaCor: "bg-brand-primary",
    titulo: "Retomada de Projetos",
    descricao: "Acompanhamento da retomada de projetos e obras prioritárias.",
    icon: <Landmark size={32} />,
    imagem: hubThumb2,
  },
  {
    id: "reprogramacao-saldos",
    sigla: "DIAFI",
    siglaCor: "bg-success",
    titulo: "Reprogramação de Saldos",
    descricao: "Acompanhamento de Saldos a serem passíveis de reprogramação financeira.",
    icon: <TrendingUp size={32} />,
    imagem: hubThumb3,
  },
  {
    id: "gestao-orcamentaria",
    sigla: "DIAFI",
    siglaCor: "bg-success",
    titulo: "Gestão Orçamentária e Financeira",
    descricao: "Acompanhamento do orçamento e da execução orçamentária do __BRAND_NAME__.",
    icon: <PieChart size={32} />,
    imagem: hubThumb4,
  },
  {
    id: "prestacao-contas",
    sigla: "DIAFI",
    siglaCor: "bg-success",
    titulo: "Gestão de Prestação de Contas",
    descricao: "Painel de monitoramento transparente dos processos de prestação de contas.",
    icon: <Scale size={32} />,
    imagem: hubThumb1,
  },
  {
    id: "programa-inova",
    sigla: "Programa Inova",
    siglaCor: "bg-brand-secondary",
    titulo: "Programa Inova",
    descricao: "Programa que leva consultoria tecnológica e inovação para pequenos negócios em diversos setores.",
    icon: <GraduationCap size={32} />,
    imagem: hubThumb2,
  },
  {
    id: "corregedoria",
    sigla: "SIGLA",
    siglaCor: "bg-brand-secondary",
    titulo: "Corregedoria",
    descricao: "A Corregedoria do __BRAND_NAME__ atua na atividade correicional, apurando irregularidades.",
    icon: <Shield size={32} />,
    imagem: hubThumb3,
  },
  {
    id: "jornada-ampliada",
    sigla: "SIGLA",
    siglaCor: "bg-brand-secondary",
    titulo: "Programa Jornada Ampliada",
    descricao: "Os recursos do programa apoiam a ampliação das ações de capacitação.",
    icon: <BookOpen size={32} />,
    imagem: hubThumb4,
  },
];

/* ── Card com ícone (original) ── */
function FlipCard({ card }: { card: PainelCard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="h-[280px] perspective-1000"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex-1 bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center text-muted-foreground/40">
            {card.icon}
          </div>
          <div className="relative px-4 pb-4 pt-2">
            <span className={`absolute -top-3 right-4 text-[10px] font-bold text-white px-2.5 py-0.5 rounded ${card.siglaCor}`}>
              {card.sigla}
            </span>
            <h4 className="font-semibold text-sm text-foreground leading-tight mt-1">{card.titulo}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.descricao}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-brand-primary bg-brand-primary text-white overflow-hidden flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="mb-3 opacity-80">{card.icon}</div>
          <h4 className="font-semibold text-sm mb-2">{card.titulo}</h4>
          <p className="text-xs opacity-80 mb-4 line-clamp-3">{card.descricao}</p>
          <button className="bg-white text-brand-primary font-semibold text-xs px-5 py-2 rounded-lg hover:bg-white/90 transition-colors">
            Acessar Painel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Card com imagem (nova variação) ── */
function FlipCardImage({ card }: { card: PainelCard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="h-[300px]"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front — imagem */}
        <div
          className="absolute inset-0 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-[170px] overflow-hidden">
            <img
              src={card.imagem}
              alt={card.titulo}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative px-4 pb-4 pt-2 flex-1 flex flex-col justify-center">
            <span className={`absolute -top-3 right-4 text-[10px] font-bold text-white px-2.5 py-0.5 rounded ${card.siglaCor}`}>
              {card.sigla}
            </span>
            <h4 className="font-semibold text-sm text-foreground leading-tight mt-1">{card.titulo}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.descricao}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-brand-primary bg-brand-primary text-white overflow-hidden flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="mb-3 opacity-80">{card.icon}</div>
          <h4 className="font-semibold text-sm mb-2">{card.titulo}</h4>
          <p className="text-xs opacity-80 mb-4 line-clamp-3">{card.descricao}</p>
          <button className="bg-white text-brand-primary font-semibold text-xs px-5 py-2 rounded-lg hover:bg-white/90 transition-colors">
            Acessar Painel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Hub original (ícones) ── */
function HubPaineisPreview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const filtered = searchTerm
    ? paineis.filter(
        (p) =>
          p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sigla.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : paineis;

  return (
    <div className={`rounded-xl border border-border overflow-hidden ${darkMode ? "dark bg-[#1a1a2e]" : "bg-background"}`}>
      {/* Header — Marca completa · Classificação de conteúdo */}
      <div className="font-sans">
        <header className="bg-[#2A4FDA] text-white">
          <div className="flex items-center gap-3 px-4 py-2.5 min-h-[44px]">
            <button className="p-1 rounded text-white hover:bg-white/10 transition-colors" aria-label="Abrir menu">
              <Menu size={18} />
            </button>
            <img src={brandLogoWhite} alt="__BRAND_NAME__" className="h-6 w-auto" />
            <span className="opacity-40 text-sm">|</span>
            <span className="font-semibold text-sm">SIGLA</span>
            <span className="text-sm opacity-80">Hub de Painéis Gerenciais</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-auto p-1.5 rounded text-white hover:bg-white/10 transition-colors"
              aria-label={darkMode ? "Modo claro" : "Modo escuro"}
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>
        <div className="bg-[#E7F79E] text-[#082841] px-4 py-1 text-[10px]">
          Conteúdo <strong>INTERNO/TODOS</strong>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center py-4 px-4">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar painel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/50 text-foreground text-xs rounded-lg pl-9 pr-9 py-2.5 border border-border focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-muted-foreground"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((card) => (
          <FlipCard key={card.id} card={card} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
            Nenhum painel encontrado para "{searchTerm}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <img src={logoBrandCompleta2} alt="__BRAND_NAME__" className="h-5 opacity-60" />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1"></p>
      </div>
    </div>
  );
}

/* ── Hub com imagens ── */
function HubPaineisImagePreview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const filtered = searchTerm
    ? paineis.filter(
        (p) =>
          p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sigla.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : paineis;

  return (
    <div className={`rounded-xl border border-border overflow-hidden ${darkMode ? "dark bg-[#1a1a2e]" : "bg-background"}`}>
      {/* Header — Marca completa · Classificação de conteúdo */}
      <div className="font-sans">
        <header className="bg-[#2A4FDA] text-white">
          <div className="flex items-center gap-3 px-4 py-2.5 min-h-[44px]">
            <button className="p-1 rounded text-white hover:bg-white/10 transition-colors" aria-label="Abrir menu">
              <Menu size={18} />
            </button>
            <img src={brandLogoWhite} alt="__BRAND_NAME__" className="h-6 w-auto" />
            <span className="opacity-40 text-sm">|</span>
            <span className="font-semibold text-sm">SIGLA</span>
            <span className="text-sm opacity-80">Hub de Painéis Gerenciais</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-auto p-1.5 rounded text-white hover:bg-white/10 transition-colors"
              aria-label={darkMode ? "Modo claro" : "Modo escuro"}
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>
        <div className="bg-[#E7F79E] text-[#082841] px-4 py-1 text-[10px]">
          Conteúdo <strong>INTERNO/TODOS</strong>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center py-4 px-4">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar painel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/50 text-foreground text-xs rounded-lg pl-9 pr-9 py-2.5 border border-border focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-muted-foreground"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((card) => (
          <FlipCardImage key={card.id} card={card} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
            Nenhum painel encontrado para "{searchTerm}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <img src={logoBrandCompleta2} alt="__BRAND_NAME__" className="h-5 opacity-60" />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1"></p>
      </div>
    </div>
  );
}

export function HubPaineisImageSection() {
  return (
    <ComponentPreview
      title="Hub de Painéis — Modelo com Imagens"
      description="Variação do Hub de Painéis com imagens ilustrativas de cada dashboard na parte frontal dos cards. O efeito flip revela a descrição e o botão de acesso."
      whenToUse={[
        "Quando cada painel possui uma prévia visual ou thumbnail do dashboard",
        "Portais que priorizam identificação visual rápida dos painéis",
        "Catálogos de relatórios ou dashboards com captura de tela",
      ]}
      accessibility={[
        "Imagens possuem alt text descritivo",
        "Efeito flip mantém acessibilidade via teclado",
        "Contraste adequado em ambos os modos",
      ]}
    >
      <HubPaineisImagePreview />
    </ComponentPreview>
  );
}

export default function HubPaineisSection() {
  return (
    <ComponentPreview
      title="Hub de Painéis Gerenciais"
      description="Layout de portal com cards de painéis institucionais. Ao passar o mouse, o card faz um efeito de flip revelando a descrição e o botão de acesso ao painel."
      whenToUse={[
        "Portais de acesso centralizado a múltiplos sistemas ou dashboards",
        "Hubs de painéis gerenciais ou analíticos",
        "Páginas de catálogo de serviços ou ferramentas internas",
      ]}
      accessibility={[
        "Cards possuem foco acessível via teclado",
        "Busca integrada com feedback visual",
        "Contraste adequado em ambos os modos claro e escuro",
      ]}
    >
      <HubPaineisPreview />
    </ComponentPreview>
  );
}
