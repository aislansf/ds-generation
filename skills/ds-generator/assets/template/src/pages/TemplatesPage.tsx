import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { 
  ExternalLink, Menu, Sun, Moon, 
  Search, Check, AlertCircle, Info, 
  AlertTriangle, ChevronDown, Calendar, 
  Eye, EyeOff, Loader2, Download, Send,
  Layout, Type, MousePointer2, Box,
  MessageSquare, FormInput, ArrowRight, Upload, X as XIcon, Lock as LockIcon
} from "lucide-react";
import thumbDashboardInstitucionalAsset from "@/assets/thumb-dashboard-institucional.jpg.asset.json";
const thumbDashboardInstitucional = thumbDashboardInstitucionalAsset.url;
import thumbDashboardBIAsset from "@/assets/thumb-dashboard-bi.jpg.asset.json";
const thumbDashboardBI = thumbDashboardBIAsset.url;
import thumbFiltrosTabelaAsset from "@/assets/thumb-pagina-filtros-tabela.jpg.asset.json";
const thumbFiltrosTabela = thumbFiltrosTabelaAsset.url;
import thumbTelaListagem from "@/assets/thumb-tela-listagem.jpg";
import thumbTelaFormulario from "@/assets/thumb-tela-formulario.jpg";
import thumbPaginaAutenticacao from "@/assets/thumb-pagina-autenticacao.jpg";
import thumbRadarEstrategico from "@/assets/thumb-radar-estrategico.jpg";
import thumbPaginaErro from "@/assets/thumb-pagina-erro.jpg";
import thumbModalAcesso from "@/assets/thumb-modal-acesso.jpg";
import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";
import { toast } from "sonner";
import SidebarMenuSection from "@/components/templates/SidebarMenuPreview";
import AuthTemplatesSection from "@/components/templates/AuthTemplates";
import CardSignInSection from "@/components/templates/CardSignIn";
import DashboardTemplatesSection from "@/components/templates/DashboardTemplates";
import FooterTemplateSection from "@/components/templates/FooterTemplate";
import HubPaineisSection, { HubPaineisImageSection } from "@/components/templates/HubPaineisTemplate";
import brandLogoAsset from "@/assets/brand-logo-cor.png.asset.json";
import brandLogoWhite from "@/assets/brand-logo-white.svg";
import headerBusinessBgAsset from "@/assets/header-business-bg.png.asset.json";
const brandLogo = brandLogoAsset.url;
const headerBusinessBg = headerBusinessBgAsset.url;
const brandLogoCompleta = brandLogo;
const brandLogoReduzida = brandLogo;
const brandLogoCompleta2 = brandLogoWhite;
const brandLogoReduzida2 = brandLogoWhite;
import marcaParceiro from "@/assets/marca-parceiro.png";

/* ─── Header variant type ─── */
interface HeaderVariant {
  id: string;
  title: string;
  description: string;
  audience: "interno" | "interno-classificado" | "externo" | "claro-completa" | "claro-reduzida" | "claro-sem-parceiro";
  brandStyle: "completa" | "reduzida";
  menuPosition: "esquerda" | "direita" | "sem";
  showClassification?: boolean;
  showTitle?: boolean;
  visualBanner?: { src: string; alt: string; height: number };
  testeira?: { bg: string; fg?: string; border?: boolean };
}

export const headerVariants: HeaderVariant[] = [
  // Público interno
  { id: "int-full-left", title: "Menu esquerdo - Marca - Sigla e ícone", description: "Header padrão com logo completo, sigla e nome do sistema. Menu hambúrguer à esquerda.", audience: "interno", brandStyle: "completa", menuPosition: "esquerda" },
  { id: "int-full-right", title: "Marca - Sigla - ícone e\u00a0Menu direito", description: "Logo completo com menu hambúrguer à direita.", audience: "interno", brandStyle: "completa", menuPosition: "direita" },
  { id: "int-full-no", title: "Marca - Sigla e ícone", description: "Header limpo sem ícone de menu.", audience: "interno", brandStyle: "completa", menuPosition: "sem" },
  // Público interno com classificação
  { id: "cls-full-left", title: "Marca completa · Classificação de conteúdo", description: "Header com barra de classificação do conteúdo abaixo.", audience: "interno-classificado", brandStyle: "completa", menuPosition: "esquerda", showClassification: true },
  { id: "cls-full-right", title: "Marca completa · Classificação · Menu direito", description: "Com classificação e menu à direita.", audience: "interno-classificado", brandStyle: "completa", menuPosition: "direita", showClassification: true },
  // Público externo
  { id: "ext-full-left", title: "Público externo · Background\u00a0Sky to Ocean", description: "Versão externa com menu à direita e background Sky to Ocean", audience: "externo", brandStyle: "completa", menuPosition: "direita" },
  { id: "ext-full-right", title: "Público externo · Background descolado", description: "Versão externa com menu à direita e background Vibrante.", audience: "externo", brandStyle: "completa", menuPosition: "direita" },
  { id: "ext-red-left", title: "Público externo · Background Menta", description: "Versão externa com menu à direita e background Menta", audience: "externo", brandStyle: "reduzida", menuPosition: "direita" },
  // Fundo claro — Programa e Gestão
  { id: "claro-full", title: "Fundo claro · Marca completa com título e subtítulo", description: "Header com fundo dourado, marca completa __BRAND_NAME__, título do programa e assinatura de parceiro.", audience: "claro-completa", brandStyle: "completa", menuPosition: "sem", showTitle: true },
  { id: "claro-full-clean", title: "Fundo claro · Marca completa · Sem título", description: "Header limpo com fundo dourado, marca completa __BRAND_NAME__ e assinatura de parceiro, sem título do programa.", audience: "claro-completa", brandStyle: "completa", menuPosition: "sem", showTitle: false },
  // Testeira para aplicação de arte
  { id: "int-testeira-art", title: "Testeira · Aplicação de arte", description: "Faixa fina (36-52px) com fundo #16329C, marca __BRAND_SHORT__ branca e menu à esquerda — ideal para aplicação de arte na testeira.", audience: "interno", brandStyle: "completa", menuPosition: "esquerda", showTitle: false, testeira: { bg: "#16329C" } },
  { id: "int-testeira-art-blue", title: "Testeira · Aplicação de arte (Azul)", description: "Faixa fina (36-52px) com fundo #2A4FDA, menu à esquerda e ícone de modo escuro — ideal para aplicação de arte na testeira.", audience: "interno", brandStyle: "completa", menuPosition: "esquerda", showTitle: false, testeira: { bg: "#2A4FDA" } },
  { id: "int-testeira-art-light", title: "Testeira · Aplicação de arte (Claro)", description: "Faixa fina (36-52px) com fundo branco, menu à esquerda e ícone de modo escuro na cor #16329C — ideal para aplicação de arte na testeira em fundo claro.", audience: "interno", brandStyle: "completa", menuPosition: "esquerda", showTitle: false, testeira: { bg: "#FFFFFF", fg: "#16329C", border: true } },
  // Composição visual (negócios)
  { id: "int-visual-business", title: "Composição visual (negócios)", description: "Header institucional com faixa visual de 112px acima — composição para campanhas e portais de negócios.", audience: "interno", brandStyle: "completa", menuPosition: "esquerda", visualBanner: { src: headerBusinessBg, alt: "Clareza que o mercado exige para o futuro dos negócios", height: 112 } },
  { id: "int-visual-business-clean", title: "Composição visual (negócios) · Sem título", description: "Header institucional com faixa visual de 112px — sem SIGLA e sem nome do sistema.", audience: "interno", brandStyle: "completa", menuPosition: "esquerda", visualBanner: { src: headerBusinessBg, alt: "Clareza que o mercado exige para o futuro dos negócios", height: 112 }, showTitle: false },
];

function getHeaderBg(audience: string) {
  if (audience === "externo") return "bg-[#3B4AFF]";
  if (audience === "claro-completa" || audience === "claro-reduzida" || audience === "claro-sem-parceiro") return "bg-[#F0F3FF]";
  return "bg-[#2A4FDA]";
}

function getHeaderBgHex(audience: string) {
  if (audience === "externo") return "#3B4AFF";
  if (audience === "claro-completa" || audience === "claro-reduzida" || audience === "claro-sem-parceiro") return "#F0F3FF";
  return "#2A4FDA";
}

function getClassificationBg(audience: string) {
  if (audience === "externo") return "bg-[#E5A54D]";
  return "bg-[#e7f79e]";
}

function getClassificationText(audience: string) {
  if (audience === "externo") return "text-white/90";
  return "text-[#082841]";
}

function isLightHeader(audience: string) {
  return audience === "claro-completa" || audience === "claro-reduzida" || audience === "claro-sem-parceiro";
}

/* ─── Single Header Preview ─── */
export function HeaderPreview({ variant }: { variant: HeaderVariant }) {
  const bg = getHeaderBg(variant.audience);
  const light = isLightHeader(variant.audience);
  const sigla = "SIGLA";
  const systemName = "Nome do sistema";

  // Testeira (faixa fina para aplicação de arte)
  if (variant.testeira) {
    const fg = variant.testeira.fg ?? "#ffffff";
    const hoverBg = variant.testeira.fg ? "hover:bg-black/5" : "hover:bg-white/10";
    return (
      <div className="rounded-lg overflow-hidden border border-border">
        <div
          className="flex items-center px-4 gap-3"
          style={{
            backgroundColor: variant.testeira.bg,
            color: fg,
            height: "36px",
            minHeight: "36px",
            maxHeight: "52px",
          }}
        >
          {variant.menuPosition === "esquerda" && (
            <button
              className={`p-1 ${hoverBg} rounded flex items-center gap-1.5 transition-colors shrink-0`}
              aria-label="Menu"
              style={{ color: fg }}
            >
              <Menu size={18} />
              <span className="text-[10px] hidden sm:inline">Menu</span>
            </button>
          )}
          <div className="flex-1 flex items-center">
          </div>
          <button
            className={`p-1 ${hoverBg} rounded transition-colors shrink-0`}
            aria-label="Ativar modo escuro"
            style={{ color: fg }}
          >
            <Moon size={16} />
          </button>
          {variant.menuPosition === "direita" && (
            <button
              className={`p-1 ${hoverBg} rounded flex items-center gap-1.5 transition-colors shrink-0`}
              aria-label="Menu"
              style={{ color: fg }}
            >
              <Menu size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Light header (fundo claro) — special layout
  if (light) {
    return (
      <div className="rounded-lg overflow-hidden border border-border">
        <div className={`${bg} flex items-center px-5 py-3 gap-4 min-h-[56px]`}>
          {/* Logo __BRAND_NAME__ */}
          <div className="flex items-center gap-3 shrink-0">
            {variant.audience === "claro-completa" ? (
              <img src={brandLogoCompleta} alt="__BRAND_NAME__" className="h-[40px] w-auto" />
            ) : variant.audience === "claro-sem-parceiro" && variant.brandStyle === "completa" ? (
              <img src={brandLogoCompleta2} alt="__BRAND_NAME__" className="h-[38px] w-auto" />
            ) : variant.audience === "claro-sem-parceiro" && variant.brandStyle === "reduzida" ? (
              <img src={brandLogoReduzida2} alt="__BRAND_NAME__" className="h-[38px] w-auto" />
            ) : (
              <img src={brandLogoReduzida} alt="__BRAND_NAME__" className="h-[40px] w-auto" />
            )}
          </div>

          {/* Separator + Title (conditional) */}
          {variant.showTitle !== false && (
            <>
          <div className="w-px h-8 bg-[#0024A9]/30 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0024A9] leading-tight">Título do Programa - Exemplo</p>
                <p className="text-xs text-[#0024A9]/70 leading-tight">Apenas um exemplo de subtítulo do programa</p>
              </div>
            </>
          )}
          {variant.showTitle === false && <div className="flex-1" />}

          {/* Theme toggle */}
          <button className="p-1.5 hover:bg-[#0024A9]/10 rounded transition-colors shrink-0" aria-label="Alternar tema">
            <Sun size={16} className="text-[#0024A9]/70" />
          </button>

          {/* Menu hamburger (right) */}
          {variant.menuPosition !== "sem" && (
            <button className="p-1.5 hover:bg-[#0024A9]/10 rounded flex items-center gap-1.5 transition-colors shrink-0" aria-label="Menu">
              <Menu size={18} className="text-[#0024A9]" />
              <span className="text-[10px] text-[#0024A9]/70 hidden sm:inline">Menu</span>
            </button>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {/* Visual banner (112px) */}
      {variant.visualBanner && (
        <div
          role="img"
          aria-label={variant.visualBanner.alt}
          style={{
            height: `${variant.visualBanner.height}px`,
            backgroundImage: `url(${variant.visualBanner.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      {/* Header bar */}
      <div
        className={`${variant.visualBanner ? "" : `${bg} min-h-[56px]`} ${variant.id === "ext-red-left" ? "" : "text-white"} flex items-center px-4 gap-3`}
        style={
          variant.visualBanner
            ? { height: "36px", minHeight: "36px", maxHeight: "52px", backgroundColor: "#123148" }
            : variant.id === "ext-full-left"
            ? { backgroundImage: "linear-gradient(90deg, #005EB8 0%, #40BBFF 100%)" }
            : variant.id === "ext-full-right"
            ? { backgroundImage: "linear-gradient(120deg, #9285F9 0%, #CD5BE8 50%, #F4455A 100%)" }
            : variant.id === "ext-red-left"
            ? { backgroundImage: "linear-gradient(120deg, #84F4BC 0%, #40BBFF 100%)", color: "#16329C" }
            : undefined
        }
      >
        {/* Menu hamburger (left) */}
        {variant.menuPosition === "esquerda" && (
          <button className="p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0" aria-label="Menu">
            <Menu size={18} />
            <span className="text-[10px] hidden sm:inline">Menu</span>
          </button>
        )}

        {/* Logo area */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {variant.visualBanner ? (
            variant.showTitle === false ? null : (
              <>
                <span className="font-semibold text-sm">{sigla}</span>
                <span className="text-sm text-white/80 truncate">{systemName}</span>
              </>
            )
          ) : (
            <>
              {variant.brandStyle === "completa" ? (
                <img src={variant.id === "ext-red-left" ? brandLogo : brandLogoWhite} alt="__BRAND_NAME__" className="h-[26px] w-auto" />
              ) : (
                <img src={variant.id === "ext-red-left" ? brandLogo : brandLogoWhite} alt="__BRAND_NAME__" className="h-[22px] w-auto" />
              )}
              <span className={variant.id === "ext-red-left" ? "text-sm" : "text-white/60 text-sm"} style={variant.id === "ext-red-left" ? { color: "#16329C", opacity: 0.6 } : undefined}>|</span>
              <span className="font-semibold text-sm" style={variant.id === "ext-red-left" ? { color: "#16329C" } : undefined}>{sigla}</span>
              <span className={variant.id === "ext-red-left" ? "text-sm truncate" : "text-sm text-white/80 truncate"} style={variant.id === "ext-red-left" ? { color: "#16329C", opacity: 0.85 } : undefined}>{systemName}</span>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="Alternar tema">
          <Sun size={16} className={variant.id === "ext-red-left" ? "" : "text-white/80"} style={variant.id === "ext-red-left" ? { color: "#16329C", opacity: 0.85 } : undefined} />
        </button>

        {/* Menu hamburger (right) */}
        {variant.menuPosition === "direita" && (
          <button className="p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0" aria-label="Menu" style={variant.id === "ext-red-left" ? { color: "#16329C" } : undefined}>
            <Menu size={18} />
            <span className="text-[10px] hidden sm:inline">Menu</span>
          </button>
        )}
      </div>

      {/* Classification bar */}
      {variant.showClassification && (
        <div className={`${getClassificationBg(variant.audience)} ${getClassificationText(variant.audience)} px-4 py-1 text-[10px]`}>
          Conteúdo <strong>INTERNO/TODOS</strong>
        </div>
      )}
    </div>
  );
}

/* ─── Code generator ─── */
function generateHeaderCode(variant: HeaderVariant): string {
  const bgHex = getHeaderBgHex(variant.audience);
  const light = isLightHeader(variant.audience);

  // Light header code
  if (light) {
    const logoSrc = variant.audience === "claro-completa"
      ? brandLogo
      : brandLogo;
    const titleHtml = variant.showTitle !== false
      ? `
    <div class="brand-header-light__separator"></div>
    <div class="brand-header-light__title">
      <strong>Título do Programa - Exemplo</strong>
      <span>Apenas um exemplo de subtítulo do programa</span>
    </div>`
      : `
    <div style="flex:1"></div>`;
    return `<!-- Header __BRAND_NAME__: ${variant.title} -->
<header class="brand-header-light" style="background-color: ${bgHex};">
  <div class="brand-header-light__inner">
    <img src="${logoSrc}" alt="__BRAND_NAME__" class="brand-header-light__logo" />${titleHtml}
    <img src="/assets/marca-parceiro.png" alt="Marca parceira" class="brand-header-light__parceiro" />
  </div>
</header>

<style>
.brand-header-light {
  font-family: 'Poppins', sans-serif;
}
.brand-header-light__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  min-height: 56px;
}
.brand-header-light__logo {
  height: 36px;
  width: auto;
  flex-shrink: 0;
}
.brand-header-light__separator {
  width: 1px;
  height: 32px;
  background: rgba(13, 56, 87, 0.3);
  flex-shrink: 0;
}
.brand-header-light__title {
  flex: 1;
  min-width: 0;
}
.brand-header-light__title strong {
  display: block;
  font-size: 0.875rem;
  color: #2A4FDA;
  line-height: 1.3;
}
.brand-header-light__title span {
  display: block;
  font-size: 0.75rem;
  color: rgba(13, 56, 87, 0.7);
  line-height: 1.3;
}
.brand-header-light__parceiro {
  height: 40px;
  width: auto;
  flex-shrink: 0;
}
</style>`;
  }

  const menuLeft = variant.menuPosition === "esquerda";
  const menuRight = variant.menuPosition === "direita";
  const effectiveBgHex = variant.visualBanner ? "#123148" : bgHex;
  const logoHtml = variant.visualBanner
    ? ""
    : variant.brandStyle === "completa"
    ? `<img src="/assets/brand-logo.svg" alt="__BRAND_NAME__" class="header__logo" />`
    : `<div class="header__logo-icon">F</div>`;

  let html = `<!-- Header __BRAND_NAME__: ${variant.title} -->
${variant.visualBanner ? `<div class="brand-header__visual-banner" role="img" aria-label="${variant.visualBanner.alt}"></div>
` : ""}\
<header class="brand-header" style="background-color: ${effectiveBgHex};">
  <div class="brand-header__inner">
${menuLeft ? `    <button class="brand-header__menu" aria-label="Abrir menu">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
` : ""}${logoHtml ? `    ${logoHtml}
    <span class="brand-header__separator">|</span>
` : ""}    <span class="brand-header__sigla">SIGLA</span>
    <span class="brand-header__name">Nome do sistema</span>
${menuRight ? `    <button class="brand-header__menu brand-header__menu--right" aria-label="Abrir menu">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      <span>Menu</span>
    </button>
` : ""}  </div>
</header>`;

  if (variant.showClassification) {
    html += `
<div class="brand-header__classification">
  Conteúdo <strong>INTERNO/TODOS</strong>
</div>`;
  }

  html += `

<style>
.brand-header {
  color: #fff;
  font-family: 'Poppins', sans-serif;
}
.brand-header__inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  ${variant.visualBanner ? "height: 70px;" : "min-height: 44px; padding: 0.625rem 1rem;"}
}
.brand-header__menu {
  background: none;
  border: none;
  color: #fff;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.brand-header__menu:hover { background: rgba(255,255,255,0.1); }
.brand-header__menu--right { margin-left: auto; }
${variant.visualBanner ? `.brand-header__visual-banner {
  height: ${variant.visualBanner.height}px;
  background: url('${variant.visualBanner.src}') center/cover no-repeat;
}
` : ""}\
.brand-header__logo { height: 24px; width: auto; filter: brightness(0) invert(1); }
.brand-header__logo-icon {
  width: 24px; height: 24px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
}
.brand-header__separator { opacity: 0.4; font-size: 0.875rem; }
.brand-header__sigla { font-weight: 600; font-size: 0.875rem; }
.brand-header__name { font-size: 0.875rem; opacity: 0.8; }
.brand-header__classification {
  background: ${variant.audience === "externo" ? "#E5A54D" : "#F0C06D"};
  color: ${variant.audience === "externo" ? "rgba(255,255,255,0.9)" : "#082841"};
  padding: 0.25rem 1rem;
  font-size: 0.625rem;
}
</style>`;

  return html;
}

export default function TemplatesPage() {
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [activeAudience, setActiveAudience] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("botoes");
  const [customDashboardThumb, setCustomDashboardThumb] = useState<string | null>(null);
  const [pendingThumb, setPendingThumb] = useState<{ dataUrl: string; name: string; size: number } | null>(null);
  const customThumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("custom-thumb-dashboard-institucional");
      if (saved) setCustomDashboardThumb(saved);
    } catch {}
  }, []);

  const ALLOWED_THUMB_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_THUMB_BYTES = 2 * 1024 * 1024; // 2 MB

  const handleCustomThumbUpload = (file: File) => {
    if (!ALLOWED_THUMB_TYPES.includes(file.type)) {
      toast.error("Formato não suportado", {
        description: "Envie uma imagem JPG, PNG ou WebP.",
      });
      return;
    }
    if (file.size > MAX_THUMB_BYTES) {
      toast.error("Arquivo muito grande", {
        description: `Tamanho máximo de 2 MB. Seu arquivo tem ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
      });
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast.error("Não foi possível ler o arquivo. Tente novamente.");
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPendingThumb({ dataUrl, name: file.name, size: file.size });
    };
    reader.readAsDataURL(file);
  };

  const confirmPendingThumb = () => {
    if (!pendingThumb) return;
    try {
      localStorage.setItem("custom-thumb-dashboard-institucional", pendingThumb.dataUrl);
      setCustomDashboardThumb(pendingThumb.dataUrl);
      toast.success("Thumbnail atualizada");
      setPendingThumb(null);
    } catch {
      toast.error("Não foi possível salvar", {
        description: "Armazenamento local cheio. Tente uma imagem menor.",
      });
    }
  };

  const resetCustomThumb = () => {
    setCustomDashboardThumb(null);
    try { localStorage.removeItem("custom-thumb-dashboard-institucional"); } catch {}
  };

  const componentTabs = [
    { id: "botoes", label: "Botão Templates", icon: <MousePointer2 size={14} /> },
    { id: "inputs", label: "Inputs & Selects", icon: <Type size={14} /> },
    { id: "formularios", label: "Formulários", icon: <FormInput size={14} /> },
    { id: "alertas", label: "Alertas & Toast", icon: <MessageSquare size={14} /> },
  ];

  const templates = [
    { title: "Dashboard Institucional", desc: "Painel com indicadores, gráficos e resumos executivos.", preview: "bg-brand-primary-50" },
    { title: "Dashboard BI", desc: "Painel executivo com análise profunda de dados, indicadores de performance (KPIs) e gráficos avançados.", preview: "bg-brand-secondary-50" },
    { title: "Tela de Listagem", desc: "Tabela com filtros dinâmicos, busca, cards estatísticos avançados, tabela aninhada (nesting) e paginação.", preview: "bg-brand-secondary-50" },
    { title: "Tela de Formulário", desc: "Formulário com validação, steps e feedback.", preview: "bg-brand-primary-50" },
    { title: "Fluxo de Autenticação Completo", desc: "Login, Cadastro e 2FA com branding __BRAND_NAME__ e login único.", preview: "bg-brand-primary-50" },
    { title: "Página de Erro", desc: "404, 500 e erros genéricos com ação de retorno.", preview: "bg-brand-secondary-50" },
    { title: "Modal de Acesso", desc: "Modal de senha para proteger conteúdos restritos. Modelo visual reutilizável (use autenticação real em produção).", preview: "bg-brand-primary-50" },
    { title: "Página com Filtros e Tabela", desc: "Combinação de sidebar de filtros com tabela de resultados.", preview: "bg-brand-primary-50" },
  ];

  const audiences = [
    { key: "all", label: "Todos" },
    { key: "interno", label: "Público interno" },
    { key: "interno-classificado", label: "Interno + Classificação" },
    { key: "externo", label: "Público externo" },
    { key: "claro", label: "Fundo claro" },
  ];

  const filteredVariants = activeAudience === "all"
    ? headerVariants
    : activeAudience === "claro"
      ? headerVariants.filter(v => v.audience === "claro-completa" || v.audience === "claro-reduzida" || v.audience === "claro-sem-parceiro")
      : headerVariants.filter(v => v.audience === activeAudience);

  return (
    <div>
      <SEO
        title="Templates — Design System __BRAND_SHORT__"
        description="Catálogo de templates do __BRAND_NAME__: dashboards, listagens, formulários, autenticação e modelos de cabeçalho prontos para implementação."
        path="/templates"
      />
      <PageHeader badge="Templates" title="Padrões de página" description="Padrões de página pré-definidos para os principais fluxos de uso dos produtos digitais do __BRAND_NAME__." />

      {/* ═══ CATÁLOGO DE COMPONENTES ═══ */}
      <SectionHeader
        id="catalogo"
        title="Catálogo de Componentes"
        description="Biblioteca navegável de elementos essenciais com variações de estados e exemplos de uso."
      />

      <div className="brand-card mb-12">
        <div className="flex flex-wrap gap-1 bg-muted/30 p-1 rounded-xl mb-8 border border-border">
          {componentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === "botoes" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Variantes de botão
                  </h5>
                  <div className="flex flex-wrap gap-3 p-4 bg-muted/20 rounded-lg border border-border/50">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold hover:brightness-110 transition-all">Primário</button>
                    <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded text-xs font-bold hover:brightness-110 transition-all">Secundário</button>
                    <button className="border border-input bg-background hover:bg-muted px-4 py-2 rounded text-xs font-bold transition-all">Outline</button>
                    <button className="hover:bg-muted text-foreground px-4 py-2 rounded text-xs font-bold transition-all">Ghost</button>
                    <button className="bg-error text-white px-4 py-2 rounded text-xs font-bold hover:brightness-110 transition-all">Destrutivo</button>
                    <button className="px-4 py-2 rounded text-xs font-bold transition-colors bg-[#E7F79E] text-[#2A4FDA] hover:bg-[#D1E575] hover:text-[#1644DC]">Diversificado</button>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Estados Interativos
                  </h5>
                  <div className="flex flex-wrap gap-3 p-4 bg-muted/20 rounded-lg border border-border/50">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold opacity-60 cursor-not-allowed" disabled>Desabilitado</button>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Carregando
                    </button>
                    <button className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded text-xs font-bold ring-2 ring-primary/30">Focado</button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Tamanhos e Ícones
                  </h5>
                  <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                    <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-[10px] font-bold">SM</button>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold">MD (Padrão)</button>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded text-sm font-bold">LG</button>
                    <div className="w-px h-8 bg-border mx-2" />
                    <button className="p-2.5 bg-secondary text-secondary-foreground rounded-full hover:rotate-12 transition-transform shadow-sm">
                      <Download size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Posicionamento de Ícones
                  </h5>
                  <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                    {/* Primário */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all">
                        <Send size={14} /> Primário
                      </button>
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all">
                        Primário <Send size={14} />
                      </button>
                    </div>
                    
                    {/* Secundário */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all">
                        <Download size={14} /> Secundário
                      </button>
                      <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all">
                        Secundário <Download size={14} />
                      </button>
                    </div>

                    {/* Outline */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="border border-input bg-background hover:bg-muted px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all">
                        <ExternalLink size={14} /> Outline
                      </button>
                      <button className="border border-input bg-background hover:bg-muted px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all">
                        Outline <ExternalLink size={14} />
                      </button>
                    </div>

                    {/* Link */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="text-primary hover:underline px-2 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all">
                        <ArrowRight size={14} /> Link
                      </button>
                      <button className="text-primary hover:underline px-2 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all">
                        Link <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inputs" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-6">
                <div className="space-y-4 p-5 bg-muted/20 rounded-lg border border-border/50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Campo Padrão</label>
                    <input type="text" placeholder="Digite algo..." className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-error ml-1 flex items-center gap-1">
                      <AlertCircle size={10} /> Campo com Erro
                    </label>
                    <input type="email" defaultValue="email-invalido" className="w-full border-2 border-error rounded px-3 py-2 text-sm bg-error-bg focus:outline-none focus:ring-2 focus:ring-error transition-colors" />
                    <p className="text-[10px] text-error font-medium ml-1">E-mail institucional obrigatório.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4 p-5 bg-muted/20 rounded-lg border border-border/50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Select Customizado</label>
                    <div className="relative">
                      <select className="appearance-none w-full border border-input rounded px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors cursor-pointer">
                        <option>Opção 01</option>
                        <option>Opção 02</option>
                        <option>Opção 03</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Campo com Ícone</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input type="text" placeholder="Buscar no sistema..." className="w-full border border-input rounded pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "formularios" && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-primary/5 p-6 border-b border-border">
                  <h5 className="font-bold flex items-center gap-2">
                    <FormInput size={18} className="text-primary" />
                    Exemplo de Formulário
                  </h5>
                  <p className="text-[11px] text-muted-foreground mt-1">Preencha os campos abaixo para demonstração de estados.</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Nome</label>
                      <input type="text" placeholder="Seu nome" className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">CPF</label>
                      <input type="text" placeholder="000.000.000-00" className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Data de Nascimento</label>
                    <div className="relative">
                      <input type="text" placeholder="dd/mm/aaaa" className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="terms" className="w-4 h-4 rounded border-input text-primary focus:ring-primary/20 cursor-pointer" />
                    <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer select-none">Eu concordo com as diretrizes do sistema.</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <button className="inline-flex items-center gap-2 text-foreground px-4 py-2 rounded text-xs font-medium hover:bg-muted transition-colors">Cancelar</button>
                    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-medium hover:opacity-90 transition-opacity">Salvar Alterações</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "alertas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-info/10 border border-info/30 rounded-xl">
                  <Info className="text-info shrink-0 mt-0.5" size={20} />
                  <div>
                    <h6 className="text-sm font-bold text-info">Informativo</h6>
                    <p className="text-xs text-info/80 mt-1">Este é um alerta para informações neutras ou guias de sistema.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-success/10 border border-success/30 rounded-xl">
                  <Check className="text-success shrink-0 mt-0.5" size={20} />
                  <div>
                    <h6 className="text-sm font-bold text-success">Sucesso</h6>
                    <p className="text-xs text-success/80 mt-1">Sua operação foi concluída com êxito conforme esperado.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-warning/10 border border-warning/30 rounded-xl">
                  <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
                  <div>
                    <h6 className="text-sm font-bold text-warning">Atenção</h6>
                    <p className="text-xs text-warning/80 mt-1">Revise os dados antes de prosseguir com esta ação.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-error/10 border border-error/30 rounded-xl">
                  <AlertCircle className="text-error shrink-0 mt-0.5" size={20} />
                  <div>
                    <h6 className="text-sm font-bold text-error">Erro Crítico</h6>
                    <p className="text-xs text-error/80 mt-1">Houve um problema ao processar sua solicitação no servidor.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ HEADER SECTION ═══ */}
      <SectionHeader
        id="header"
        title="Header — Componente Final"
        description="Componente de cabeçalho para utilização nos projetos. Variações por público, posição do menu e estilo da marca."
      />

      {/* Audience filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {audiences.map(a => (
          <button
            key={a.key}
            onClick={() => setActiveAudience(a.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeAudience === a.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Header variants grid */}
      <div className="grid grid-cols-1 gap-6 mb-12">
        {filteredVariants.map(variant => (
          <div key={variant.id} className="brand-card">
            {/* Label */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{variant.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{variant.description}</p>
              </div>
              <span className={`brand-badge-${variant.audience === "externo" ? "success" : isLightHeader(variant.audience) ? "info" : "primary"} shrink-0 text-[10px]`}>
                {variant.audience === "externo" ? "Externo" : isLightHeader(variant.audience) ? "Fundo claro" : variant.audience === "interno-classificado" ? "Classificado" : "Interno"}
              </span>
            </div>

            {/* Preview */}
            <HeaderPreview variant={variant} />

            {/* Code toggle */}
            <button
              onClick={() => setOpenCode(openCode === variant.id ? null : variant.id)}
              className="text-xs font-medium text-primary hover:underline mt-3"
            >
              {openCode === variant.id ? "Ocultar código" : "Ver código"}
            </button>
            {openCode === variant.id && (
              <CodeBlock code={generateHeaderCode(variant)} language="html" title={`Header: ${variant.title}`} />
            )}
          </div>
        ))}
      </div>

      {/* Usage guidelines */}
      <div className="brand-card mb-12">
        <h4 className="font-semibold text-foreground mb-1">Testeira · Aplicação de arte (Azul) — Especificação</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Faixa fina destinada a aplicações de arte na testeira de sistemas internos, com forte presença
          cromática institucional. Indicada quando a marca já estiver presente em outra área da interface
          (banner, sidebar ou rodapé), evitando duplicidade visual.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-foreground mb-1">Altura</p>
            <ul className="space-y-0.5 text-muted-foreground">
              <li><code className="text-[11px]">height: 36px</code></li>
              <li><code className="text-[11px]">min-height: 36px</code></li>
              <li><code className="text-[11px]">max-height: 52px</code></li>
              <li className="pt-1">Cresce até 52px se o conteúdo exigir; padrão fixo em 36px.</li>
            </ul>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-foreground mb-1">Comportamento do menu</p>
            <ul className="space-y-0.5 text-muted-foreground">
              <li>Menu hambúrguer alinhado à <strong>esquerda</strong>.</li>
              <li>Rótulo "Menu" oculto em <code className="text-[11px]">&lt; sm</code> (mobile).</li>
              <li>Ícone <code className="text-[11px]">Moon</code> (modo escuro) alinhado à direita.</li>
              <li>Estado hover: fundo <code className="text-[11px]">white/10</code>.</li>
              <li>Sem marca __BRAND_NAME__ na faixa.</li>
            </ul>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-foreground mb-1">Esquema de cores</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded border border-border" style={{ background: "#2A4FDA" }} />
                <span>Fundo: <code className="text-[11px]">#2A4FDA</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded border border-border" style={{ background: "#FFFFFF" }} />
                <span>Ícones/texto: <code className="text-[11px]">#FFFFFF</code></span>
              </li>
              <li className="pt-1">Contraste 8.2:1 — atende WCAG AAA para ícones e textos UI.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="brand-card mb-12">
        <h4 className="font-semibold text-foreground mb-3">Diretrizes de uso</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-success mb-1">✓ Quando usar</p>
            <ul className="space-y-1">
              <li>• Sempre no topo de todas as aplicações __BRAND_NAME__</li>
              <li>• Use marca completa quando há espaço horizontal suficiente</li>
              <li>• Use marca reduzida em telas estreitas ou aplicativos mobile</li>
              <li>• Aplique classificação de conteúdo quando exigido pela política institucional</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-error mb-1">✗ Quando não usar</p>
            <ul className="space-y-1">
              <li>• Não altere as cores do header fora do padrão definido</li>
              <li>• Não remova ou substitua o logo institucional</li>
              <li>• Não use versão de público externo em sistemas internos</li>
              <li>• Não oculte a barra de classificação quando requerida</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER TEMPLATE ═══ */}
      <SectionHeader
        id="footer"
        title="Footer Institucional"
        description="Rodapé padronizado com marca __BRAND_NAME__, nome do projeto e versão alinhada à direita. Variações para tema claro, escuro e compacto."
      />
      <div className="mb-12">
        <FooterTemplateSection />
      </div>

      {/* ═══ MENU LATERAL SECTION ═══ */}
      <SectionHeader
        id="menu-lateral"
        title="Menu Lateral — Componente Final"
        description="Menu de navegação lateral para complementar o botão de menu do header. Com ícones, subitens, busca e botão fechar."
      />
      <div className="mb-12">
        <SidebarMenuSection />
      </div>

      {/* ═══ AUTH TEMPLATES ═══ */}
      <SectionHeader
        id="modelos-login"
        title="Modelos de Login"
        description="Templates de autenticação prontos para uso nos sistemas __BRAND_NAME__. Sign In e Sign Up com a identidade visual do órgão."
      />
      <div className="mb-12">
        <AuthTemplatesSection />
      </div>

      {/* ═══ CARD SIGN IN ═══ */}
      <SectionHeader
        id="modelo-card"
        title="Modelo Card (Sign In)"
        description="Template de login com layout em duas colunas: imagem institucional à esquerda e formulário de autenticação à direita."
      />
      <div className="mb-12">
        <CardSignInSection />
      </div>

      {/* ═══ DASHBOARD TEMPLATES ═══ */}
      <SectionHeader
        id="dashboards"
        title="Modelos de Dashboard"
        description="Templates de painéis de controle baseados em layouts Power BI, com KPIs, tabelas, gráficos e indicadores de desempenho."
      />
      <div className="mb-12">
        <DashboardTemplatesSection />
      </div>

      {/* ═══ HUB DE PAINÉIS ═══ */}
      <SectionHeader
        id="hub-paineis"
        title="Modelo Hub de Painéis"
        description="Template de portal centralizado para acesso a múltiplos painéis gerenciais, com cards interativos e efeito flip."
      />
      <div className="mb-12">
        <HubPaineisSection />
      </div>

      <div className="mb-12">
        <HubPaineisImageSection />
      </div>

      {/* ═══ TEMPLATE CARDS (existing) ═══ */}
      <SectionHeader
        id="templates-modelos"
        title="Modelos de Página"
        description="Padrões de layout pré-definidos para os principais fluxos."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(t => {
          const isDashboard = t.title === "Dashboard Institucional";
          const isDashboardBI = t.title === "Dashboard BI";
          const isListagem = t.title === "Tela de Listagem";
          const isFormulario = t.title === "Tela de Formulário";
          const isAutenticacao = t.title === "Fluxo de Autenticação Completo";
          const isErro = t.title === "Página de Erro";
          const isModalAcesso = t.title === "Modal de Acesso";
          const isRadar = t.title === "Radar Estratégico";
          const isFiltrosTabela = t.title === "Página com Filtros e Tabela";
          const isInteractive = isDashboard || isDashboardBI || isListagem || isFormulario || isAutenticacao || isErro || isRadar || isModalAcesso || isFiltrosTabela;
          const route = isDashboard
            ? "/templates/dashboard-institucional"
            : isDashboardBI
              ? "/templates/dashboard-bi"
              : isListagem
                  ? "/templates/tela-listagem"
                  : isFormulario
                    ? "/templates/tela-formulario"
                      : isErro
                        ? "/templates/pagina-erro"
                        : isModalAcesso
                          ? "/templates/modal-acesso"
                        : isRadar
                          ? "/templates/radar-estrategico"
                        : isFiltrosTabela
                          ? "/templates/pagina-filtros-tabela"
                          : "/templates/pagina-autenticacao";
          const thumbSrc = isDashboard 
            ? (customDashboardThumb || thumbDashboardInstitucional)
            : isDashboardBI
              ? thumbDashboardBI
              : isRadar
                ? thumbRadarEstrategico
                : isListagem 
                  ? thumbTelaListagem 
                  : isFormulario 
                    ? thumbTelaFormulario 
                    : isErro
                      ? thumbPaginaErro
                      : isModalAcesso
                        ? thumbModalAcesso
                        : isFiltrosTabela
                          ? thumbFiltrosTabela
                        : thumbPaginaAutenticacao;
          const thumbAlt = isDashboard
            ? "Thumbnail do Dashboard Institucional com KPIs, gráfico donut e barras"
            : isDashboardBI
              ? "Thumbnail do Dashboard BI com indicadores de performance e gráficos executivos"
              : isRadar
                ? "Thumbnail do Radar Estratégico inspirado em Power BI, com KPIs e gráfico de barras"
              : isListagem
                ? "Thumbnail da Tela de Listagem com filtros, cards estatísticos e tabela aninhada"
                : isAutenticacao
            ? "Thumbnail da Página de Autenticação com login institucional e login único"
            : isErro
              ? "Thumbnail da Página de Erro com estados de 404, 500 e erro genérico"
              : isModalAcesso
                ? "Thumbnail do Modal de Acesso com campo de senha e botão Acessar"
                : "Thumbnail da Tela de Formulário com stepper, campos validados e lista descritiva";
          const cardInner = (
            <>
              {isInteractive ? (
                <div className="h-32 rounded-lg mb-4 overflow-hidden bg-[#EFF3F8] relative group/thumb">
                  <img
                    src={thumbSrc || ""}
                    alt={thumbAlt}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallback === "1") return;
                      img.dataset.fallback = "1";
                      img.src =
                        "data:image/svg+xml;utf8," +
                        encodeURIComponent(
                          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 800'>
                            <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                              <stop offset='0' stop-color='#EFF3F8'/><stop offset='1' stop-color='#D6E0EE'/>
                            </linearGradient></defs>
                            <rect width='1280' height='800' fill='url(#g)'/>
                            <g fill='#0D3857' font-family='Poppins, Arial, sans-serif' text-anchor='middle'>
                              <text x='640' y='390' font-size='54' font-weight='700'>Pré-visualização indisponível</text>
                              <text x='640' y='450' font-size='28' opacity='0.7'>Thumbnail será gerado em breve</text>
                            </g>
                          </svg>`
                        );
                    }}
                  />
                  {isDashboard && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); customThumbInputRef.current?.click(); }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-foreground/85 text-background text-[10px] rounded shadow hover:bg-foreground"
                        aria-label="Enviar thumbnail personalizada"
                      >
                        <Upload size={10} /> {customDashboardThumb ? "Trocar" : "Enviar thumb"}
                      </button>
                      {customDashboardThumb && (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); resetCustomThumb(); }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-destructive text-destructive-foreground text-[10px] rounded shadow hover:opacity-90"
                          aria-label="Remover thumbnail personalizada"
                        >
                          <XIcon size={10} /> Resetar
                        </button>
                      )}
                      <input
                        ref={customThumbInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleCustomThumbUpload(f);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : isErro || isModalAcesso ? (
                <div className="h-32 bg-brand-primary-50 rounded-lg mb-4 flex flex-col items-center justify-center p-4 border border-brand-primary-100 relative overflow-hidden group">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-primary/5 rounded-full -ml-6 -mb-6" />
                  
                  <div className="flex flex-col items-center gap-2 relative z-10 transition-transform duration-300 group-hover:scale-110">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-primary/10">
                      {isModalAcesso ? <LockIcon size={20} className="text-primary" /> : <AlertCircle size={20} className="text-primary" />}
                    </div>
                    <div className="h-2 bg-primary/20 rounded w-20" />
                    <div className="space-y-1 w-full flex flex-col items-center">
                      <div className="h-1.5 bg-primary/10 rounded w-28" />
                      <div className="h-1.5 bg-primary/10 rounded w-24" />
                    </div>
                    <div className="h-5 bg-primary rounded-lg w-28 mt-2 shadow-sm" />
                  </div>
                  
                  {/* Status code pill */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/10 rounded text-[8px] font-bold text-primary uppercase tracking-wider">
                    {isModalAcesso ? "Acesso" : "Status 404"}
                  </div>
                </div>
              ) : (

                <div className={`h-32 ${t.preview} rounded-lg mb-4 flex items-center justify-center`}>
                  <div className="w-4/5 space-y-2">
                    <div className="h-3 bg-primary/10 rounded w-1/3" />
                    <div className="flex gap-2">
                      <div className="h-16 bg-primary/10 rounded flex-1" />
                      <div className="h-16 bg-primary/10 rounded flex-1" />
                    </div>
                    <div className="h-3 bg-primary/10 rounded w-2/3" />
                  </div>
                </div>
              )}


              <div className="flex items-start justify-between gap-2">

                <div>
                  <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                {isInteractive && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                    Ver página <ExternalLink size={10} />
                  </span>
                )}
              </div>
            </>
          );

          if (isInteractive) {
            return (
              <Link
                key={t.title}
                to={route}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-card overflow-hidden block hover:shadow-lg hover:border-primary/40 transition-all"
              >
                {cardInner}
              </Link>
            );
          }

          return (
            <div key={t.title} className="brand-card overflow-hidden">
              {cardInner}
            </div>
          );
        })}
      </div>

      {pendingThumb && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Pré-visualização da thumbnail"
          onClick={() => setPendingThumb(null)}
        >
          <div
            className="bg-card rounded-lg shadow-xl max-w-lg w-full p-5 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold mb-1">Pré-visualizar thumbnail</h3>
            <p className="text-xs text-muted-foreground mb-3 truncate">
              {pendingThumb.name} · {(pendingThumb.size / 1024).toFixed(0)} KB
            </p>
            <div className="rounded-lg overflow-hidden bg-[#EFF3F8] border border-border mb-4">
              <img
                src={pendingThumb.dataUrl}
                alt="Pré-visualização"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingThumb(null)}
                className="px-3 py-1.5 text-xs rounded border border-border hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmPendingThumb}
                className="px-3 py-1.5 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Confirmar e salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
