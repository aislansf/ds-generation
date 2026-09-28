import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";
import ColorSection from "@/components/ColorSection";
import { FontFamilyCard } from "@/components/FontFamilyCard";
import paletaReferencia from "@/assets/paleta-referencia.png.asset.json";
import GridSection from "@/components/GridSection";
import {
  ArrowRight, Bell, Check, ChevronRight, Download, Eye,
  Heart, Home, Mail, Search, Settings, Star, User, AlertTriangle, Info,
  Plus, Minus, RotateCcw, Check as CheckIcon, X as XIcon, Download as DownloadIcon,
  Copy as CopyIcon
} from "lucide-react";
import {
  RiHome5Line, RiSearchLine, RiUser3Line, RiSettings3Line, RiNotification3Line,
  RiMailLine, RiHeart3Line, RiDownload2Line, RiEyeLine, RiCheckLine,
  RiArrowRightLine, RiArrowRightSLine, RiAlertLine, RiInformationLine, RiStarLine,
  RiQuestionLine, RiLogoutBoxRLine, RiLockPasswordLine, RiShieldUserLine, RiFileList3Line,
  RiWalletLine, RiBuilding2Line, RiCustomerService2Line, RiCalendarEventLine, RiBookOpenLine,
} from "@remixicon/react";

function ImageLightbox({ src, alt, open, onClose }: { src: string; alt: string; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fechar (ESC)"
        className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <XIcon size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[95vw] max-h-[95vh] object-contain rounded-md shadow-2xl"
      />
    </div>
  );
}

type CopyStatus = "idle" | "ok" | "err";
function IconCard({
  Ic, name, label, collection, size,
}: {
  Ic: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;
  name: string; label: string; collection: "lucide" | "remix"; size: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<CopyStatus>("idle");

  const handleCopy = async () => {
    try {
      const svg = ref.current?.querySelector("svg");
      if (!svg) throw new Error("SVG não encontrado");
      const clone = svg.cloneNode(true) as SVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(markup);
      } else {
        const ta = document.createElement("textarea");
        ta.value = markup; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
      }
      setStatus("ok");
    } catch {
      setStatus("err");
    }
    window.setTimeout(() => setStatus("idle"), 1800);
  };

  const feedback =
    status === "ok" ? { text: "Copiado!", cls: "bg-success text-success-foreground", Icon: CheckIcon }
    : status === "err" ? { text: "Erro", cls: "bg-destructive text-destructive-foreground", Icon: XIcon }
    : { text: "Copiar SVG", cls: "bg-muted hover:bg-primary hover:text-primary-foreground text-foreground", Icon: CopyIcon };

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">
      <div ref={ref} className="h-10 flex items-center justify-center"><Ic size={size} className="text-foreground" /></div>
      <span className="text-[10px] font-semibold text-center">{label}</span>
      <code className="text-[9px] text-muted-foreground text-center break-all">{name}</code>
      <span className={`text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${collection === "lucide" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{collection}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copiar SVG do ícone ${name}`}
        aria-live="polite"
        title="Copiar código SVG"
        className={`mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${feedback.cls}`}
      >
        <feedback.Icon size={11} aria-hidden="true" />
        {feedback.text}
      </button>
    </div>
  );
}


const colorScale = (name: string, colors: { label: string; token: string }[]) => (
  <div className="mb-6">
    <h4 className="text-sm font-semibold mb-2">{name}</h4>
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
      {colors.map(c => (
        <div key={c.token} className="text-center">
          <div className={`h-12 rounded-lg border border-border mb-1 bg-${c.token}`} style={{ backgroundColor: `hsl(var(--${c.token}))` }} />
          <p className="text-[10px] font-medium">{c.label}</p>
          <p className="text-[10px] text-muted-foreground">{c.token}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function FundamentosPage() {
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [key1, setKey1] = useState(0);
  const [key3, setKey3] = useState(0);
  const [iconQuery, setIconQuery] = useState("");
  const [iconCollection, setIconCollection] = useState<"all" | "lucide" | "remix">("all");
  const [iconSize, setIconSize] = useState<14 | 16 | 20 | 24 | 32>(20);
  const [paletaOpen, setPaletaOpen] = useState(false);

  type IconComponent = React.ComponentType<
    React.SVGProps<SVGSVGElement> & { size?: number | string }
  >;
  type IconEntry = {
    collection: "lucide" | "remix";
    name: string;
    label: string;
    keywords: string;
    Comp: IconComponent;
  };
  const iconCatalog: IconEntry[] = [
    // Lucide
    { collection: "lucide", name: "Home", label: "Home", keywords: "início casa", Comp: Home },
    { collection: "lucide", name: "Search", label: "Search", keywords: "buscar pesquisa lupa", Comp: Search },
    { collection: "lucide", name: "User", label: "User", keywords: "usuário perfil conta", Comp: User },
    { collection: "lucide", name: "Settings", label: "Settings", keywords: "configurações ajustes", Comp: Settings },
    { collection: "lucide", name: "Bell", label: "Bell", keywords: "notificação sino", Comp: Bell },
    { collection: "lucide", name: "Mail", label: "Mail", keywords: "email mensagem", Comp: Mail },
    { collection: "lucide", name: "Heart", label: "Heart", keywords: "favorito coração", Comp: Heart },
    { collection: "lucide", name: "Download", label: "Download", keywords: "baixar download", Comp: Download },
    { collection: "lucide", name: "Eye", label: "Eye", keywords: "visualizar ver olho", Comp: Eye },
    { collection: "lucide", name: "Check", label: "Check", keywords: "confirmar ok", Comp: Check },
    { collection: "lucide", name: "ArrowRight", label: "ArrowRight", keywords: "seta avançar", Comp: ArrowRight },
    { collection: "lucide", name: "ChevronRight", label: "ChevronRight", keywords: "chevron seta", Comp: ChevronRight },
    { collection: "lucide", name: "AlertTriangle", label: "AlertTriangle", keywords: "alerta aviso", Comp: AlertTriangle },
    { collection: "lucide", name: "Info", label: "Info", keywords: "informação", Comp: Info },
    { collection: "lucide", name: "Star", label: "Star", keywords: "estrela destaque", Comp: Star },
    // Remix
    { collection: "remix", name: "RiHome5Line", label: "Início", keywords: "home casa", Comp: RiHome5Line },
    { collection: "remix", name: "RiUser3Line", label: "Minha conta", keywords: "user perfil", Comp: RiUser3Line },
    { collection: "remix", name: "RiShieldUserLine", label: "Segurança", keywords: "shield privacidade", Comp: RiShieldUserLine },
    { collection: "remix", name: "RiLockPasswordLine", label: "Senha", keywords: "lock password", Comp: RiLockPasswordLine },
    { collection: "remix", name: "RiLogoutBoxRLine", label: "Sair", keywords: "logout exit", Comp: RiLogoutBoxRLine },
    { collection: "remix", name: "RiSearchLine", label: "Buscar", keywords: "search pesquisa", Comp: RiSearchLine },
    { collection: "remix", name: "RiNotification3Line", label: "Notificações", keywords: "bell sino", Comp: RiNotification3Line },
    { collection: "remix", name: "RiMailLine", label: "Mensagens", keywords: "mail email", Comp: RiMailLine },
    { collection: "remix", name: "RiSettings3Line", label: "Configurações", keywords: "settings ajustes", Comp: RiSettings3Line },
    { collection: "remix", name: "RiQuestionLine", label: "Ajuda", keywords: "help question", Comp: RiQuestionLine },
    { collection: "remix", name: "RiFileList3Line", label: "Documentos", keywords: "file lista", Comp: RiFileList3Line },
    { collection: "remix", name: "RiWalletLine", label: "Financeiro", keywords: "wallet carteira pagamento", Comp: RiWalletLine },
    { collection: "remix", name: "RiBuilding2Line", label: "Empresas", keywords: "building empresa", Comp: RiBuilding2Line },
    { collection: "remix", name: "RiCalendarEventLine", label: "Eventos", keywords: "calendário agenda", Comp: RiCalendarEventLine },
    { collection: "remix", name: "RiBookOpenLine", label: "Cursos", keywords: "livro educação", Comp: RiBookOpenLine },
    { collection: "remix", name: "RiCustomerService2Line", label: "Atendimento", keywords: "suporte sac", Comp: RiCustomerService2Line },
    { collection: "remix", name: "RiDownload2Line", label: "Baixar", keywords: "download", Comp: RiDownload2Line },
    { collection: "remix", name: "RiEyeLine", label: "Visualizar", keywords: "ver olho", Comp: RiEyeLine },
    { collection: "remix", name: "RiCheckLine", label: "Confirmar", keywords: "check ok", Comp: RiCheckLine },
    { collection: "remix", name: "RiArrowRightLine", label: "Avançar", keywords: "seta arrow", Comp: RiArrowRightLine },
    { collection: "remix", name: "RiArrowRightSLine", label: "Chevron", keywords: "chevron", Comp: RiArrowRightSLine },
    { collection: "remix", name: "RiAlertLine", label: "Alerta", keywords: "alert aviso", Comp: RiAlertLine },
    { collection: "remix", name: "RiInformationLine", label: "Informação", keywords: "info", Comp: RiInformationLine },
    { collection: "remix", name: "RiHeart3Line", label: "Favoritos", keywords: "heart coração", Comp: RiHeart3Line },
    { collection: "remix", name: "RiStarLine", label: "Destaque", keywords: "star estrela", Comp: RiStarLine },
  ];
  const q = iconQuery.trim().toLowerCase();
  const filteredIcons = iconCatalog.filter(ic =>
    (iconCollection === "all" || ic.collection === iconCollection) &&
    (q === "" || ic.name.toLowerCase().includes(q) || ic.label.toLowerCase().includes(q) || ic.keywords.includes(q))
  );

  const typographyScale = [
    { name: "text-4xl", baseSize: 2.25, weight: "Bold (700)", example: "Título principal", cls: "text-4xl font-bold" },
    { name: "text-3xl", baseSize: 1.875, weight: "Bold (700)", example: "Título de seção", cls: "text-3xl font-bold" },
    { name: "text-2xl", baseSize: 1.5, weight: "Semibold (600)", example: "Subtítulo", cls: "text-2xl font-semibold" },
    { name: "text-xl", baseSize: 1.25, weight: "Semibold (600)", example: "Heading menor", cls: "text-xl font-semibold" },
    { name: "text-lg", baseSize: 1.125, weight: "Medium (500)", example: "Lead text", cls: "text-lg font-medium" },
    { name: "text-base", baseSize: 1, weight: "Regular (400)", example: "Corpo de texto padrão do sistema", cls: "text-base" },
    { name: "text-sm", baseSize: 0.875, weight: "Regular (400)", example: "Texto auxiliar e labels", cls: "text-sm" },
    { name: "text-xs", baseSize: 0.75, weight: "Medium (500)", example: "Legendas e captions", cls: "text-xs font-medium" },
  ];

  return (
    <div>
      <SEO
        title="Fundamentos — Design System __BRAND_SHORT__"
        description="Tipografia, cores, ícones, grid e espaçamento do Design System __BRAND_NAME__. Alicerces visuais que garantem consistência e acessibilidade nos produtos digitais."
        path="/fundamentos"
      />
      <PageHeader
        badge="Fundamentos"
        title="Fundamentos"
        description="Os alicerces visuais e técnicos do Design System __BRAND_NAME__. Estas diretrizes garantem consistência e acessibilidade em todos os produtos digitais, em ambos os modos claro e escuro."
      />

      {/* Tipografia */}
      <SectionHeader
        id="tipografia"
        title="Tipografia"
        description="O Design System __BRAND_NAME__ adota o trio tipográfico alinhado ao portal __ORG_ROOT_DOMAIN__: __FONT_PRIMARY__ (primária, corpo/UI), __FONT_DISPLAY__ (secundária, display proprietária) e __FONT_SYSTEM__ (sistêmica, apoio institucional)."
      />

      {/* Famílias oficiais — grid responsivo com alturas equalizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full items-stretch lg:auto-rows-fr">
        {/* Sistêmica — __FONT_SYSTEM__ */}
        <FontFamilyCard
          badge="Fonte Sistêmica"
          badgeClass="bg-accent text-accent-foreground"
          source="Google Fonts · Open Source"
          name="__FONT_SYSTEM__"
          fontStack="'__FONT_SYSTEM__', system-ui, sans-serif"
          summary="Sans-serif humanista de apoio, alinhada ao portal __ORG_ROOT_DOMAIN__. Usada em microcopy institucional, legendas e contextos sistêmicos de leitura."
          weights={[
            { v: 300, name: "Light" }, { v: 400, name: "Regular" },
            { v: 700, name: "Bold" }, { v: 900, name: "Black" },
          ]}
          bestFor={[
            "Legendas, captions e notas de rodapé em relatórios",
            "Microcopy institucional, avisos legais e termos",
            "Tabelas densas e listagens longas no Power BI",
            "Documentos PDF e materiais impressos institucionais",
          ]}
          avoidFor={[
            "Botões e CTAs (use __FONT_PRIMARY__ para coerência da UI)",
            "Títulos de impacto (use __FONT_DISPLAY__)",
          ]}
          powerBi="Excelente para rótulos de eixos, legendas de gráficos, fontes de dados e notas de rodapé em dashboards. Disponível nativamente no Power BI sem importação."
          cssVar="--font-system"
          tailwindClass="font-system · font-lato"
          cssSnippet={`/* CSS puro */\n.legenda,\n.caption,\n.nota-rodape {\n  font-family: '__FONT_SYSTEM__', system-ui, sans-serif;\n  font-weight: 400;\n  font-size: 0.75rem;\n  line-height: 1.4;\n}`}
          htmlSnippet={`<!-- HTML standalone -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=__FONT_SYSTEM__:wght@300;400;700;900&display=swap" rel="stylesheet">\n\n<small style="font-family: '__FONT_SYSTEM__', sans-serif; font-weight: 400;">\n  Fonte: __BRAND_NAME__ · Dados de 2024\n</small>`}
          tokenSnippet={`/* tokens.css */\n:root {\n  --font-system: '__FONT_SYSTEM__', '__FONT_PRIMARY__', system-ui, sans-serif;\n  --font-lato: '__FONT_SYSTEM__', system-ui, sans-serif;\n}`}
          downloads={[
            { label: "Google Fonts — página oficial (download .zip com TTF)", url: "https://fonts.google.com/specimen/__FONT_SYSTEM__", note: "Inclui pesos 100–900 + itálicos. Licença SIL Open Font 1.1." },
            { label: "CSS hospedado (CDN Google Fonts)", url: "https://fonts.googleapis.com/css2?family=__FONT_SYSTEM__:wght@300;400;700;900&display=swap", note: "Pronto para <link rel=\"stylesheet\">." },
            { label: "Site oficial do autor (Łukasz Dziedzic)", url: "https://www.latofonts.com/lato-free-fonts/", note: "Pacote completo TTF/OTF para uso desktop em Power BI, Office e Adobe." },
          ]}
        />

        {/* Primária — __FONT_PRIMARY__ */}
        <FontFamilyCard
          badge="Fonte Primária"
          badgeClass="bg-primary text-primary-foreground"
          source="Google Fonts · Open Source"
          name="__FONT_PRIMARY__"
          fontStack="'__FONT_PRIMARY__', system-ui, sans-serif"
          summary="Sans-serif geométrica e neutra. Base de toda a interface: corpo de texto, botões, links, formulários e títulos H1/H3."
          weights={[
            { v: 300, name: "Light" }, { v: 400, name: "Regular" }, { v: 500, name: "Medium" },
            { v: 600, name: "SemiBold" }, { v: 700, name: "Bold" }, { v: 900, name: "Black" },
          ]}
          bestFor={[
            "Sistemas web (desktop, tablet, mobile) — UI, formulários, tabelas",
            "Corpo de texto longo, parágrafos institucionais e e-mails",
            "Botões, navegação, labels e microcopy funcional",
            "Títulos H1 e H3 quando __FONT_DISPLAY__ não estiver disponível",
          ]}
          avoidFor={[
            "Hero/banners de impacto (use __FONT_DISPLAY__)",
            "Manchetes editoriais ou números de destaque em dashboards",
          ]}
          powerBi="Usar como fonte padrão dos visuais (Texto, Eixos, Rótulos). No Power BI Desktop: Arquivo → Opções → Atual → Fontes globais → __FONT_PRIMARY__."
          cssVar="--font-sans"
          tailwindClass="font-sans"
          cssSnippet={`/* CSS puro */\n.elemento {\n  font-family: '__FONT_PRIMARY__', system-ui, 'Helvetica Neue', Arial, sans-serif;\n  font-weight: 400;\n  line-height: 1.5;\n}`}
          htmlSnippet={`<!-- HTML standalone -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=__FONT_PRIMARY__:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">\n\n<p style="font-family: '__FONT_PRIMARY__', sans-serif; font-weight: 500;">\n  Texto institucional __BRAND_SHORT__\n</p>`}
          tokenSnippet={`/* tokens.css */\n:root {\n  --font-sans: '__FONT_PRIMARY__', system-ui, sans-serif;\n  --font-weight-regular: 400;\n  --font-weight-medium: 500;\n  --font-weight-bold: 700;\n}`}
          downloads={[
            { label: "Google Fonts — página oficial (download .zip com TTF)", url: "https://fonts.google.com/specimen/__FONT_PRIMARY__", note: "Inclui todos os pesos (300–900) e licença SIL Open Font 1.1." },
            { label: "CSS hospedado (CDN Google Fonts)", url: "https://fonts.googleapis.com/css2?family=__FONT_PRIMARY__:wght@300;400;500;600;700;800;900&display=swap", note: "Pronto para <link rel=\"stylesheet\">." },
            { label: "Repositório oficial no GitHub (fontes-fonte TTF/OTF)", url: "https://github.com/erinmclaughlin/__FONT_PRIMARY__", note: "Arquivos brutos para Power BI Desktop, Word e PowerPoint." },
          ]}
        />

        {/* Secundária — __FONT_DISPLAY__ */}
        <FontFamilyCard
          badge="Fonte Secundária"
          badgeClass="bg-secondary text-secondary-foreground"
          source="Proprietária __BRAND_SHORT__ · CDN da marca"
          name="__FONT_DISPLAY__"
          fontStack="'__FONT_DISPLAY__', '__FONT_PRIMARY__', sans-serif"
          summary="Sans-serif de display com personalidade institucional. Reservada para títulos de impacto, hero e números em destaque."
          weights={[{ v: 700, name: "Bold" }]}
          bestFor={[
            "H2 e títulos de impacto em landing pages institucionais",
            "Hero, banners e capas de relatórios",
            "Números de destaque em dashboards (KPIs principais)",
            "Apresentações e materiais editoriais __BRAND_SHORT__",
          ]}
          avoidFor={[
            "Corpo de texto e parágrafos longos (use __FONT_PRIMARY__)",
            "UI funcional, formulários, labels e tooltips",
            "Textos pequenos < 18px (perde legibilidade)",
          ]}
          powerBi="Aplicar apenas em títulos de cartões KPI e cabeçalhos de páginas. Para o restante mantenha __FONT_PRIMARY__. Caso o ambiente Power BI não carregue __FONT_DISPLAY__, o fallback automático é __FONT_PRIMARY__."
          cssVar="--font-display"
          tailwindClass="font-heading · font-display"
          cssSnippet={`/* CSS puro */\n@font-face {\n  font-family: '__FONT_DISPLAY__';\n  src: url('/fonts/display-bold.woff2') format('woff2');\n  font-weight: 700;\n  font-display: swap;\n}\n\n.titulo-hero {\n  font-family: '__FONT_DISPLAY__', '__FONT_PRIMARY__', sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n}`}
          htmlSnippet={`<!-- HTML standalone com fallback -->\n<style>\n  @font-face {\n    font-family: '__FONT_DISPLAY__';\n    src: url('__FONT_DISPLAY_URL__') format('woff2');\n    font-weight: 700;\n    font-display: swap;\n  }\n</style>\n\n<h1 style="font-family: '__FONT_DISPLAY__', '__FONT_PRIMARY__', sans-serif; font-weight: 700;">\n  Conectando pessoas\n</h1>`}
          tokenSnippet={`/* tokens.css */\n:root {\n  --font-display: '__FONT_DISPLAY__', '__FONT_PRIMARY__', sans-serif;\n  --font-heading: '__FONT_DISPLAY__', '__FONT_PRIMARY__', sans-serif;\n}`}
          footnote="__FONT_DISPLAY__ é proprietária da __BRAND_SHORT__. Enquanto o arquivo oficial não estiver em /public/fonts/display-bold.woff2, o sistema usa __FONT_PRIMARY__ como fallback automático."
          downloads={[
            { label: "__FONT_DISPLAY__ Bold (WOFF2) — CDN oficial da marca", url: "__FONT_DISPLAY_URL__", note: "Arquivo usado em __ORG_ROOT_DOMAIN__. Hospedar localmente em /public/fonts/display-bold.woff2 para produção." },
            { label: "Solicitação interna — Marca __BRAND_SHORT__", url: "mailto:marca@__ORG_ROOT_DOMAIN__?subject=Solicitação%20da%20fonte%20display%20(TTF/OTF)", note: "Para receber o pacote completo (TTF/OTF) com todos os pesos — uso em Power BI, PowerPoint e impressos." },
          ]}
        />
      </div>

      <div className="brand-card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Escala tipográfica dinâmica</h4>
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border">
            <button
              onClick={() => setFontSizeOffset(prev => Math.max(prev - 0.125, -0.125))}
              disabled={fontSizeOffset <= -0.125}
              className="p-1.5 hover:bg-background rounded shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Diminuir tamanho (mínimo legível: 12px no menor corpo)"
            >
              <Minus size={16} />
            </button>
            <div className="px-3 text-xs font-mono font-bold min-w-[60px] text-center">
              {fontSizeOffset > 0 ? `+${fontSizeOffset.toFixed(3)}` : fontSizeOffset.toFixed(3)}rem
            </div>
            <button 
              onClick={() => setFontSizeOffset(prev => Math.min(prev + 0.125, 1))}
              className="p-1.5 hover:bg-background rounded shadow-sm transition-all"
              title="Aumentar tamanho"
            >
              <Plus size={16} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button 
              onClick={() => setFontSizeOffset(0)}
              className="p-1.5 hover:bg-background rounded shadow-sm transition-all text-muted-foreground hover:text-foreground"
              title="Resetar para o padrão"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {typographyScale.map(t => (
            <div key={t.name} className="flex flex-col sm:flex-row sm:items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="sm:w-48 shrink-0 space-y-1">
                <p className="text-xs font-bold text-primary">{t.name}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
                    Base: {t.baseSize}rem
                  </span>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded border border-primary/20">
                    Atual: {(t.baseSize + fontSizeOffset).toFixed(3)}rem
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">{t.weight}</p>
              </div>
              <div className="flex-1 overflow-hidden">
                <p 
                  className={t.cls} 
                  style={{ fontSize: `${t.baseSize + fontSizeOffset}rem`, lineHeight: '1.2' }}
                >
                  {t.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guia de tipografia — exemplos prontos */}
      <div className="brand-card mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Guia de tipografia — exemplos prontos
          </h4>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary" /> __FONT_DISPLAY__
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" /> __FONT_PRIMARY__
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Coluna principal — amostras */}
          <div className="space-y-6">
            {/* Headings H1-H6 (__FONT_DISPLAY__) */}
            {[
              { tag: "h1", cls: "text-5xl font-black", sample: "__BRAND_SLOGAN__", spec: "__FONT_DISPLAY__ Bold · 48px / 1.1" },
              { tag: "h2", cls: "text-4xl font-bold",  sample: "Conheça o Design System __BRAND_SHORT__",          spec: "__FONT_DISPLAY__ Bold · 36px / 1.15" },
              { tag: "h3", cls: "text-3xl font-bold",  sample: "Componentes, tokens e padrões",           spec: "__FONT_DISPLAY__ Bold · 30px / 1.2" },
              { tag: "h4", cls: "text-2xl font-semibold", sample: "Diretrizes de uso da marca",           spec: "__FONT_DISPLAY__ SemiBold · 24px / 1.25" },
              { tag: "h5", cls: "text-xl font-semibold",  sample: "Aplicações em produtos digitais",      spec: "__FONT_DISPLAY__ SemiBold · 20px / 1.3" },
              { tag: "h6", cls: "text-lg font-semibold",  sample: "Sessão de apoio e detalhes",           spec: "__FONT_DISPLAY__ SemiBold · 18px / 1.35" },
            ].map(h => (
              <div key={h.tag} className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 pb-4 border-b border-border last:border-0">
                <div className="w-16 shrink-0">
                  <span className="text-[10px] font-mono font-bold uppercase bg-secondary/15 text-secondary px-2 py-0.5 rounded">
                    {h.tag}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  {(() => {
                    const Tag = h.tag as keyof JSX.IntrinsicElements;
                    return <Tag className={`${h.cls} font-heading leading-tight`}>{h.sample}</Tag>;
                  })()}
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">{h.spec}</p>
                </div>
              </div>
            ))}

            {/* Corpo (__FONT_PRIMARY__) */}
            <div className="pt-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded mb-3 inline-block">
                Corpo de texto · __FONT_PRIMARY__
              </span>
              <p className="text-lg font-sans leading-relaxed mb-3">
                <strong>Lead (text-lg).</strong> O __BRAND_NAME__ apoia o desenvolvimento de pequenos negócios com conteúdos, capacitações e ferramentas digitais acessíveis a todo empreendedor brasileiro.
              </p>
              <p className="text-base font-sans leading-relaxed mb-3">
                <strong>Body padrão (text-base).</strong> Use __FONT_PRIMARY__ em todo o texto corrido. A família suporta os pesos 300 a 900 e é otimizada para leitura em telas. Combine <em>itálico</em>, <strong>negrito</strong> e <span className="underline">sublinhado</span> com moderação.
              </p>
              <p className="text-sm font-sans leading-relaxed text-muted-foreground">
                <strong>Texto auxiliar (text-sm).</strong> Ideal para descrições de campos, ajudas e textos secundários que não devem competir com o conteúdo principal.
              </p>
            </div>

            {/* Legendas e meta */}
            <div className="pt-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded mb-3 inline-block">
                Legendas e metadados
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <figure className="border border-border rounded-lg p-3">
                  <div className="aspect-video bg-muted rounded mb-2" />
                  <figcaption className="text-xs text-muted-foreground">
                    Figura 1 — Exemplo de legenda em <code className="font-mono">text-xs</code> com tom suave.
                  </figcaption>
                </figure>
                <div className="border border-border rounded-lg p-3 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Publicado em</p>
                  <p className="text-sm font-medium">12 de março de 2025</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">text-[10px] uppercase + text-sm</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="pt-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded mb-3 inline-block">
                Links
              </span>
              <div className="space-y-2 text-base">
                <p>
                  Link padrão:{" "}
                  <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80 font-medium">
                    acesse o portal do __BRAND_SHORT__
                  </a>
                </p>
                <p>
                  Link inline em parágrafo: para saber mais, consulte a{" "}
                  <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    documentação completa
                  </a>{" "}
                  ou entre em contato.
                </p>
                <p>
                  Link discreto:{" "}
                  <a href="#" className="text-muted-foreground hover:text-primary hover:underline">
                    política de privacidade
                  </a>
                </p>
                <p>
                  Link externo:{" "}
                  <a href="https://__ORG_ROOT_DOMAIN__" className="text-primary underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-1">
                    __ORG_ROOT_DOMAIN__
                    <span aria-hidden className="text-[10px]">↗</span>
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Coluna lateral — referência rápida */}
          <aside className="bg-muted/30 border border-border rounded-lg p-5 h-fit">
            <h5 className="text-xs font-bold uppercase tracking-wider mb-4 text-foreground">Referência rápida</h5>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between gap-3 pb-2 border-b border-border">
                <dt className="text-muted-foreground">H1–H6</dt>
                <dd className="font-mono font-semibold text-secondary">font-heading</dd>
              </div>
              <div className="flex justify-between gap-3 pb-2 border-b border-border">
                <dt className="text-muted-foreground">Corpo / UI</dt>
                <dd className="font-mono font-semibold text-primary">font-sans</dd>
              </div>
              <div className="flex justify-between gap-3 pb-2 border-b border-border">
                <dt className="text-muted-foreground">Display</dt>
                <dd className="font-mono font-semibold text-secondary">font-display</dd>
              </div>
              <div className="flex justify-between gap-3 pb-2 border-b border-border">
                <dt className="text-muted-foreground">Link</dt>
                <dd className="font-mono text-primary">text-primary underline</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Legenda</dt>
                <dd className="font-mono text-muted-foreground">text-xs muted</dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Tabela comparativa de tokens tipográficos */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Tabela comparativa de tokens
            </h5>
            <span className="text-[10px] text-muted-foreground font-mono">
              Valores derivados de <code>:root</code> (src/index.css)
            </span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground">
                  <th className="text-left font-semibold p-3 border border-border">Elemento</th>
                  <th className="text-left font-semibold p-3 border border-border">Família</th>
                  <th className="text-left font-semibold p-3 border border-border">font-size</th>
                  <th className="text-left font-semibold p-3 border border-border">line-height</th>
                  <th className="text-left font-semibold p-3 border border-border">font-weight</th>
                  <th className="text-left font-semibold p-3 border border-border">letter-spacing</th>
                  <th className="text-left font-semibold p-3 border border-border">Spacing (mb)</th>
                  <th className="text-left font-semibold p-3 border border-border">Classes Tailwind</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  { el: "H1", fam: "__FONT_DISPLAY__",  size: "--text-5xl (3rem)",     lh: "--leading-5xl (3.375rem)", w: "--font-bold (700)",   ls: "-0.025em",                sp: "--space-6 (1.5rem)", cls: "text-5xl font-bold font-heading mb-6" },
                  { el: "H2", fam: "__FONT_DISPLAY__",  size: "--text-4xl (2.25rem)",  lh: "--leading-4xl (2.625rem)", w: "--font-bold (700)",   ls: "-0.022em",                sp: "--space-5 (1.25rem)",cls: "text-4xl font-bold font-heading mb-5" },
                  { el: "H3", fam: "__FONT_DISPLAY__",  size: "--text-3xl (1.875rem)", lh: "--leading-3xl (2.25rem)",  w: "--font-bold (700)",   ls: "-0.02em",                 sp: "--space-4 (1rem)",   cls: "text-3xl font-bold font-heading mb-4" },
                  { el: "H4", fam: "__FONT_DISPLAY__",  size: "--text-2xl (1.5rem)",   lh: "--leading-2xl (2rem)",     w: "--font-semibold (600)",ls: "--tracking-tight",        sp: "--space-3 (0.75rem)",cls: "text-2xl font-semibold font-heading mb-3" },
                  { el: "H5", fam: "__FONT_DISPLAY__",  size: "--text-xl (1.25rem)",   lh: "--leading-xl (1.875rem)",  w: "--font-semibold (600)",ls: "-0.01em",                 sp: "--space-3 (0.75rem)",cls: "text-xl font-semibold font-heading mb-3" },
                  { el: "H6", fam: "__FONT_DISPLAY__",  size: "--text-lg (1.125rem)",  lh: "--leading-lg (1.75rem)",   w: "--font-semibold (600)",ls: "-0.005em",                sp: "--space-2 (0.5rem)", cls: "text-lg font-semibold font-heading mb-2" },
                  { el: "Lead",     fam: "__FONT_PRIMARY__", size: "--text-lg (1.125rem)",  lh: "--leading-relaxed (1.65)",w: "--font-medium (500)",  ls: "--tracking-normal",       sp: "--space-4 (1rem)",   cls: "text-lg font-medium leading-relaxed mb-4" },
                  { el: "Body",     fam: "__FONT_PRIMARY__", size: "--text-base (1rem)",    lh: "--leading-relaxed (1.65)",w: "--font-regular (400)", ls: "--tracking-normal",       sp: "--space-4 (1rem)",   cls: "text-base leading-relaxed mb-4" },
                  { el: "Small",    fam: "__FONT_PRIMARY__", size: "--text-sm (0.875rem)",  lh: "--leading-sm (1.25rem)",  w: "--font-regular (400)", ls: "0.01em",                  sp: "--space-2 (0.5rem)", cls: "text-sm mb-2" },
                  { el: "Legenda",  fam: "__FONT_PRIMARY__", size: "--text-xs (0.75rem)",   lh: "--leading-xs (1rem)",     w: "--font-regular (400)", ls: "--tracking-wide",         sp: "--space-1 (0.25rem)",cls: "text-xs text-muted-foreground mb-1" },
                  { el: "Overline", fam: "__FONT_PRIMARY__", size: "--text-xs (0.75rem)",   lh: "--leading-xs (1rem)",     w: "--font-bold (700)",    ls: "--tracking-widest",       sp: "--space-2 (0.5rem)", cls: "text-xs font-bold uppercase tracking-widest mb-2" },
                  { el: "Link",     fam: "__FONT_PRIMARY__", size: "herda do contexto",     lh: "herda",                   w: "--font-medium (500)",  ls: "herda",                   sp: "—",                  cls: "text-primary underline underline-offset-2" },
                ].map((row, i) => (
                  <tr key={row.el} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="p-3 border border-border font-sans font-bold text-foreground">{row.el}</td>
                    <td className="p-3 border border-border">{row.fam}</td>
                    <td className="p-3 border border-border text-primary">{row.size}</td>
                    <td className="p-3 border border-border">{row.lh}</td>
                    <td className="p-3 border border-border">{row.w}</td>
                    <td className="p-3 border border-border">{row.ls}</td>
                    <td className="p-3 border border-border text-secondary">{row.sp}</td>
                    <td className="p-3 border border-border text-muted-foreground">{row.cls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-muted-foreground italic mt-3">
            Spacing refere-se à margem inferior (<code className="font-mono">mb-*</code>) recomendada para separar o elemento do conteúdo seguinte. Todos os valores são consumidos via <code className="font-mono">var(--token)</code> — alterar a variável atualiza o projeto inteiro.
          </p>
        </div>
      </div>

      {/* Atlas de Tipografia */}
      <div id="atlas-tipografia" className="brand-card mb-6">
        <div className="flex items-end justify-between mb-6 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded">
              Atlas
            </span>
            <h4 className="text-lg font-semibold mt-2">Atlas de Tipografia</h4>
            <p className="text-sm text-muted-foreground">
              Cada token e classe renderizados com exemplo real, pesos e estados — base para QA visual do time.
            </p>
          </div>
          <span className="hidden sm:inline text-[10px] text-muted-foreground font-mono">
            tokens em <code>:root</code> · classes Tailwind
          </span>
        </div>

        {/* Escala token a token */}
        <div className="space-y-3">
          {[
            { cls: "text-7xl", token: "--text-7xl", lead: "--leading-7xl", sample: "Aa" },
            { cls: "text-6xl", token: "--text-6xl", lead: "--leading-6xl", sample: "Aa" },
            { cls: "text-5xl", token: "--text-5xl", lead: "--leading-5xl", sample: "Conectando pessoas" },
            { cls: "text-4xl", token: "--text-4xl", lead: "--leading-4xl", sample: "Design System __BRAND_SHORT__" },
            { cls: "text-3xl", token: "--text-3xl", lead: "--leading-3xl", sample: "Componentes e tokens" },
            { cls: "text-2xl", token: "--text-2xl", lead: "--leading-2xl", sample: "Diretrizes de uso" },
            { cls: "text-xl",  token: "--text-xl",  lead: "--leading-xl",  sample: "Aplicações em produtos digitais" },
            { cls: "text-lg",  token: "--text-lg",  lead: "--leading-lg",  sample: "Lead — chamada introdutória do bloco" },
            { cls: "text-base",token: "--text-base",lead: "--leading-base",sample: "Body padrão — texto corrido de leitura confortável em telas." },
            { cls: "text-sm",  token: "--text-sm",  lead: "--leading-sm",  sample: "Auxiliar — descrições de campos, ajudas e textos secundários que não competem com o conteúdo principal." },
            { cls: "text-xs",  token: "--text-xs",  lead: "--leading-xs",  sample: "Legenda — metadados, captions e anotações em escala mínima." },
          ].map((row) => (
            <div
              key={row.cls}
              className="grid grid-cols-1 md:grid-cols-[140px_1fr_220px] gap-4 items-center py-3 border-b border-border last:border-0"
            >
              <div className="flex flex-col gap-1">
                <code className="text-[11px] font-mono font-bold text-primary">{row.cls}</code>
                <code className="text-[10px] font-mono text-muted-foreground">{row.token}</code>
                <code className="text-[10px] font-mono text-muted-foreground">{row.lead}</code>
              </div>
              <p className={`${row.cls} font-sans text-foreground`}>{row.sample}</p>
              <div className="text-[10px] font-mono text-muted-foreground bg-muted/40 rounded p-2 leading-relaxed">
                font-size: <span className="text-foreground">var({row.token})</span><br />
                line-height: <span className="text-foreground">var({row.lead})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pesos */}
        <div className="mt-8 pt-6 border-t border-border">
          <h5 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground">Pesos · text-base</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { w: "font-light",    label: "Light · 300" },
              { w: "font-normal",   label: "Regular · 400" },
              { w: "font-medium",   label: "Medium · 500" },
              { w: "font-semibold", label: "SemiBold · 600" },
              { w: "font-bold",     label: "Bold · 700" },
              { w: "font-extrabold",label: "ExtraBold · 800" },
            ].map((p) => (
              <div key={p.w} className="border border-border rounded-lg p-3">
                <p className={`text-base ${p.w}`}>Aa __BRAND_SHORT__</p>
                <code className="text-[10px] font-mono text-muted-foreground block mt-1">{p.w}</code>
                <p className="text-[10px] text-muted-foreground">{p.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estados de cor / ênfase */}
        <div className="mt-8 pt-6 border-t border-border">
          <h5 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground">Estados · text-sm</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { cls: "text-foreground",       label: "Default",   token: "text-foreground" },
              { cls: "text-muted-foreground", label: "Muted",     token: "text-muted-foreground" },
              { cls: "text-primary font-medium", label: "Primary", token: "text-primary" },
              { cls: "text-secondary font-medium", label: "Secondary", token: "text-secondary" },
              { cls: "text-success font-medium", label: "Success", token: "text-success" },
              { cls: "text-error font-medium", label: "Error",     token: "text-error" },
              { cls: "text-foreground/40", label: "Disabled",     token: "opacity 40%" },
              { cls: "text-primary underline underline-offset-2 font-medium", label: "Link", token: "text-primary underline" },
              { cls: "text-foreground bg-warning-bg px-1 rounded", label: "Highlight", token: "bg-warning-bg" },
            ].map((s) => (
              <div key={s.label} className="border border-border rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{s.label}</p>
                <p className={`text-sm ${s.cls}`}>
                  O __BRAND_SHORT__ apoia o empreendedor cearense.
                </p>
                <code className="text-[10px] font-mono text-muted-foreground block mt-1">{s.token}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Famílias */}
        <div className="mt-8 pt-6 border-t border-border">
          <h5 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground">Famílias</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <p className="font-heading text-3xl font-bold leading-tight">Aa — __FONT_DISPLAY__</p>
              <p className="font-heading text-sm text-muted-foreground mt-2">Títulos e display · pesos 600/700/900</p>
              <code className="text-[10px] font-mono text-muted-foreground block mt-2">font-heading</code>
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="font-sans text-3xl font-bold leading-tight">Aa — __FONT_PRIMARY__</p>
              <p className="font-sans text-sm text-muted-foreground mt-2">Corpo, UI e legendas · pesos 300–800</p>
              <code className="text-[10px] font-mono text-muted-foreground block mt-2">font-sans</code>
            </div>
          </div>
        </div>
      </div>

      <div className="brand-card mb-6">
        <h4 className="text-sm font-semibold mb-6">Aplicabilidade e Composição</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Título Principal (H1)</h1>
              <p className="text-lg font-medium text-muted-foreground">Este é um exemplo de lead text ou subtítulo que acompanha o título principal para dar mais contexto.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold border-b pb-2">Título de Seção (H2)</h2>
              <p className="leading-relaxed">
                Este é um exemplo de <strong>texto corrido</strong> (body text) demonstrando a legibilidade e o espaçamento entre linhas padrão do Design System __BRAND_NAME__. 
                Podemos utilizar variações como <em>texto em itálico</em> para dar ênfase, <span className="underline">texto sublinhado</span> para links ou termos específicos, 
                e combinações de <strong><em>negrito com itálico</em></strong> quando necessário.
              </p>
              
              <h3 className="text-2xl font-semibold">Subtítulo de Nível 3 (H3)</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Textos auxiliares menores mantêm uma boa mancha tipográfica mesmo com redução de corpo, ideal para descrições detalhadas que não devem competir visualmente com o conteúdo principal.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg border border-border">
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-primary">Listas e Organização</h4>
              
              <div className="space-y-6">
                <div>
                  <p className="font-semibold mb-2">Lista com Bullets:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Primeiro item da lista com bullet</li>
                    <li>Segundo item com mais conteúdo para testar a quebra de linha automática e o recuo do texto.</li>
                    <li>Terceiro item importante</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-2">Lista Numerada:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Passo inicial do processo</li>
                    <li>Execução da tarefa principal</li>
                    <li>Finalização e feedback do usuário</li>
                  </ol>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    Nota: O espaçamento entre linhas (line-height) é calculado para garantir que olhos não se percam durante a leitura de blocos densos de informação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CodeBlock
        title="Uso da tipografia"
        code={`/* __FONT_PRIMARY__ (primária) — Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=__FONT_PRIMARY__:wght@300;400;500;600;700;800;900&display=swap');

/* __FONT_DISPLAY__ (secundária) — fonte proprietária __BRAND_SHORT__ */
@font-face {
  font-family: '__FONT_DISPLAY__';
  src: url('/fonts/display-bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

body {
  font-family: '__FONT_PRIMARY__', system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: '__FONT_DISPLAY__', '__FONT_PRIMARY__', sans-serif;
}

/* Utilitários Tailwind disponíveis */
/* font-sans     → __FONT_PRIMARY__ (primária)        */
/* font-heading  → __FONT_DISPLAY__ → __FONT_PRIMARY__ (display) */
/* font-display  → alias de heading           */

/* Tokens de tipografia (funcionam em ambos os temas) */
--text-xs: 0.75rem;    /* 12px - Legendas */
--text-sm: 0.875rem;   /* 14px - Labels */
--text-base: 1rem;     /* 16px - Corpo */
--text-lg: 1.125rem;   /* 18px - Lead */
--text-xl: 1.25rem;    /* 20px - Heading */
--text-2xl: 1.5rem;    /* 24px - Subtítulo */
--text-3xl: 1.875rem;  /* 30px - Título seção */
--text-4xl: 2.25rem;   /* 36px - Título principal */`}
        language="css"
      />

      {/* Cores */}
      <SectionHeader id="cores" title="Cores" description="Paleta institucional baseada no Manual da Marca __BRAND_NAME__ 2024. No dark mode, as cores são ajustadas para manter contraste e legibilidade." />

      <figure className="brand-card mb-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setPaletaOpen(true)}
          aria-label="Ampliar imagem da paleta de cores"
          className="block w-full rounded-md overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <img
            src={paletaReferencia.url}
            alt="Paleta de cores de referência da marca"
            className="w-full h-auto rounded-md transition-transform hover:scale-[1.01]"
            loading="lazy"
          />
        </button>
        <figcaption className="text-xs text-muted-foreground mt-3">
          Referência cromática institucional: a paleta do Design System parte da cor primária{" "}
          <strong>#2A4FDA</strong> e expande para a paleta estendida da marca.
        </figcaption>
      </figure>
      <ImageLightbox
        open={paletaOpen}
        onClose={() => setPaletaOpen(false)}
        src={paletaReferencia.url}
        alt="Paleta de cores de referência da marca"
      />

      <ColorSection />

      {/* Iconografia */}
      <SectionHeader id="iconografia" title="Iconografia" description="A biblioteca oficial do Design System é Lucide (lucide-react). Remix Icon é apresentada apenas como referência complementar, por ser a família utilizada no __ORG_ROOT_DOMAIN__/conta." />

      {/* Busca e filtros */}
      <div className="brand-card mb-6 max-w-4xl">
        <h4 className="text-sm font-semibold mb-3">Buscar ícone</h4>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={iconQuery}
              onChange={(e) => setIconQuery(e.target.value)}
              placeholder="Pesquisar por nome (ex: home, user, mail)..."
              className="w-full border border-input rounded pl-9 pr-3 py-2 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-border p-1 bg-muted/30">
            {([
              { v: "all", label: "Todos" },
              { v: "lucide", label: "Lucide" },
              { v: "remix", label: "Remix" },
            ] as const).map(o => (
              <button key={o.v} onClick={() => setIconCollection(o.v)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${iconCollection === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-lg border border-border p-1 bg-muted/30">
            {([14, 16, 20, 24, 32] as const).map(sz => (
              <button key={sz} onClick={() => setIconSize(sz)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md transition-colors ${iconSize === sz ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {sz}px
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">{filteredIcons.length} ícone(s) encontrado(s) — tamanho {iconSize}px</p>
        {filteredIcons.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-6 text-center">Nenhum ícone encontrado. Tente outro termo ou troque a coleção.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {filteredIcons.map((ic) => (
              <IconCard key={`${ic.collection}-${ic.name}`} Ic={ic.Comp} name={ic.name} label={ic.label} collection={ic.collection} size={iconSize} />
            ))}
          </div>
        )}
      </div>

      {/* === BIBLIOTECA OFICIAL: LUCIDE === */}
      <div className="brand-card mb-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold">Biblioteca oficial — Lucide</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">Padrão DS</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Open-source, traço consistente e boa legibilidade em ambos os temas. Já instalada no projeto.</p>

        <h5 className="text-xs font-bold uppercase tracking-wider mb-3">Tamanhos padrão</h5>
        <div className="flex flex-wrap items-end gap-6 mb-6">
          {[
            { size: 14, label: "14px – Inline" },
            { size: 16, label: "16px – Default" },
            { size: 20, label: "20px – Medium" },
            { size: 24, label: "24px – Large" },
            { size: 32, label: "32px – Display" },
          ].map(s => (
            <div key={s.size} className="text-center">
              <div className="flex items-center justify-center mb-2"><Star size={s.size} className="text-primary" /></div>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h5 className="text-xs font-bold uppercase tracking-wider mb-3">Exemplos de uso</h5>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {[
            { icon: <Home size={20} />, label: "Home" },
            { icon: <Search size={20} />, label: "Search" },
            { icon: <User size={20} />, label: "User" },
            { icon: <Settings size={20} />, label: "Settings" },
            { icon: <Bell size={20} />, label: "Bell" },
            { icon: <Mail size={20} />, label: "Mail" },
            { icon: <Heart size={20} />, label: "Heart" },
            { icon: <Download size={20} />, label: "Download" },
            { icon: <Eye size={20} />, label: "Eye" },
            { icon: <Check size={20} />, label: "Check" },
            { icon: <ArrowRight size={20} />, label: "Arrow" },
            { icon: <ChevronRight size={20} />, label: "Chevron" },
            { icon: <AlertTriangle size={20} />, label: "Alert" },
            { icon: <Info size={20} />, label: "Info" },
            { icon: <Star size={20} />, label: "Star" },
          ].map((ic, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-2 rounded border border-border hover:bg-muted/50 transition-colors">
              <span className="text-foreground">{ic.icon}</span>
              <span className="text-[9px] text-muted-foreground">{ic.label}</span>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock
        title="Uso com Lucide React (biblioteca oficial)"
        code={`import { Search, User, Bell } from "lucide-react";\n\n<span><Search size={14} /> Buscar</span>\n\n<button aria-label="Notificações"><Bell size={20} /></button>\n\n<span aria-hidden="true"><Star size={16} /></span>`}
        language="tsx"
      />

      {/* === REFERÊNCIA: REMIX ICON === */}
      <div className="mt-10 mb-3 flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded">Referência</span>
        <h3 className="text-base font-semibold">Remix Icon — biblioteca usada no __ORG_ROOT_DOMAIN__/conta</h3>
      </div>
      <p className="text-xs text-muted-foreground max-w-4xl mb-4">
        Apresentada apenas como referência para alinhamento visual com o portal __BRAND_SHORT__. <strong>Não é a biblioteca padrão deste Design System</strong> — use Lucide nos novos projetos. Os blocos abaixo servem para DEVs que precisarem incorporar Remix em projetos legados, Power BI ou widgets externos.
      </p>

      <div className="brand-card mb-6 max-w-4xl">
        <h4 className="text-sm font-semibold mb-3">Download e instalação</h4>
        <p className="text-xs text-muted-foreground mb-4">Links oficiais para baixar a biblioteca, navegar o catálogo completo e incorporar em projetos React, sites e dashboards.</p>
        <div className="flex flex-col gap-2 mb-5">
          {[
            { label: "Site oficial — catálogo de ícones (remixicon.com)", url: "https://remixicon.com/", note: "Buscar, copiar SVG ou JSX e baixar PNG/SVG individualmente." },
            { label: "Pacote React — @remixicon/react (npm)", url: "https://www.npmjs.com/package/@remixicon/react", note: "Usado neste Design System. Tree-shaking nativo." },
            { label: "Repositório oficial (GitHub)", url: "https://github.com/Remix-Design/RemixIcon", note: "Fontes, SVGs e licença Apache 2.0." },
            { label: "Download do pacote completo (.zip)", url: "https://github.com/Remix-Design/RemixIcon/releases/latest", note: "SVG, PNG, fonte e symbol sprite para uso em Power BI, Figma, etc." },
            { label: "CDN (CSS classes — uso fora de React)", url: "https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css", note: "Para HTMLs estáticos, e-mail templates ou widgets embarcados." },
          ].map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors p-3 text-xs">
              <DownloadIcon size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="flex-1">
                <span className="font-semibold text-foreground block">{d.label}</span>
                {d.note && <span className="italic text-muted-foreground">{d.note}</span>}
              </span>
            </a>
          ))}
        </div>

        <CodeBlock
          title="Instalação no projeto (React / Vite / Next)"
          code={`# npm\nnpm install @remixicon/react\n\n# bun\nbun add @remixicon/react\n\n# pnpm\npnpm add @remixicon/react`}
          language="bash"
        />
      </div>

      {/* Tamanhos padrão */}
      <div className="brand-card mb-6 max-w-4xl">
        <h4 className="text-sm font-semibold mb-1">Tamanhos padrão</h4>
        <p className="text-xs text-muted-foreground mb-4">Use a prop <code className="text-[11px] bg-muted px-1 rounded">size</code> (px) ou <code className="text-[11px] bg-muted px-1 rounded">className</code> com Tailwind (<code className="text-[11px] bg-muted px-1 rounded">w-5 h-5</code>).</p>
        <div className="flex flex-wrap items-end gap-6 mb-2">
          {[
            { size: 14, label: "14px", use: "Inline com texto" },
            { size: 16, label: "16px", use: "Default / botões" },
            { size: 20, label: "20px", use: "Sidebar / nav" },
            { size: 24, label: "24px", use: "Headers / cards" },
            { size: 32, label: "32px", use: "Display / hero" },
            { size: 48, label: "48px", use: "Estado vazio" },
          ].map(s => (
            <div key={s.size} className="text-center">
              <div className="flex items-center justify-center mb-2 h-12">
                <RiStarLine size={s.size} className="text-primary" />
              </div>
              <p className="text-[11px] font-semibold">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.use}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ícones migrados do __ORG_ROOT_DOMAIN__/conta */}
      <div className="brand-card mb-6 max-w-4xl">
        <h4 className="text-sm font-semibold mb-1">Ícones migrados do __ORG_ROOT_DOMAIN__/conta</h4>
        <p className="text-xs text-muted-foreground mb-4">Conjunto base usado no portal "Minha Conta __BRAND_SHORT__" — navegação, autenticação, serviços e atendimento.</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {[
            { icon: RiHome5Line, name: "RiHome5Line", label: "Início" },
            { icon: RiUser3Line, name: "RiUser3Line", label: "Minha conta" },
            { icon: RiShieldUserLine, name: "RiShieldUserLine", label: "Segurança" },
            { icon: RiLockPasswordLine, name: "RiLockPasswordLine", label: "Senha" },
            { icon: RiLogoutBoxRLine, name: "RiLogoutBoxRLine", label: "Sair" },
            { icon: RiSearchLine, name: "RiSearchLine", label: "Buscar" },
            { icon: RiNotification3Line, name: "RiNotification3Line", label: "Notificações" },
            { icon: RiMailLine, name: "RiMailLine", label: "Mensagens" },
            { icon: RiSettings3Line, name: "RiSettings3Line", label: "Configurações" },
            { icon: RiQuestionLine, name: "RiQuestionLine", label: "Ajuda" },
            { icon: RiFileList3Line, name: "RiFileList3Line", label: "Documentos" },
            { icon: RiWalletLine, name: "RiWalletLine", label: "Financeiro" },
            { icon: RiBuilding2Line, name: "RiBuilding2Line", label: "Empresas" },
            { icon: RiCalendarEventLine, name: "RiCalendarEventLine", label: "Eventos" },
            { icon: RiBookOpenLine, name: "RiBookOpenLine", label: "Cursos" },
            { icon: RiCustomerService2Line, name: "RiCustomerService2Line", label: "Atendimento" },
            { icon: RiDownload2Line, name: "RiDownload2Line", label: "Baixar" },
            { icon: RiEyeLine, name: "RiEyeLine", label: "Visualizar" },
            { icon: RiCheckLine, name: "RiCheckLine", label: "Confirmar" },
            { icon: RiArrowRightLine, name: "RiArrowRightLine", label: "Avançar" },
            { icon: RiArrowRightSLine, name: "RiArrowRightSLine", label: "Chevron" },
            { icon: RiAlertLine, name: "RiAlertLine", label: "Alerta" },
            { icon: RiInformationLine, name: "RiInformationLine", label: "Informação" },
            { icon: RiHeart3Line, name: "RiHeart3Line", label: "Favoritos" },
            { icon: RiStarLine, name: "RiStarLine", label: "Destaque" },
          ].map((ic, i) => {
            const Ic = ic.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                <Ic size={22} className="text-foreground" />
                <span className="text-[11px] font-semibold text-center">{ic.label}</span>
                <code className="text-[9px] text-muted-foreground text-center break-all">{ic.name}</code>
              </div>
            );
          })}
        </div>
      </div>

      <CodeBlock
        title="Token CSS — tamanhos de ícones"
        code={`:root {
  --icon-xs: 14px;   /* inline */
  --icon-sm: 16px;   /* default */
  --icon-md: 20px;   /* nav/sidebar */
  --icon-lg: 24px;   /* headers */
  --icon-xl: 32px;   /* display */
  --icon-2xl: 48px;  /* empty state */
}`}
        language="css"
      />

      <CodeBlock
        title="Uso em React (recomendado)"
        code={`import { RiSearchLine, RiNotification3Line, RiStarLine } from "@remixicon/react";

// 1. Inline com texto
<span className="inline-flex items-center gap-1">
  <RiSearchLine size={14} /> Buscar
</span>

// 2. Ícone informativo – precisa de aria-label
<button aria-label="Notificações" className="p-2 rounded hover:bg-muted">
  <RiNotification3Line size={20} />
</button>

// 3. Ícone decorativo – aria-hidden
<span aria-hidden="true"><RiStarLine size={16} className="text-primary" /></span>

// 4. Com Tailwind (cor herda do texto via currentColor)
<RiSearchLine className="w-5 h-5 text-primary" />`}
        language="tsx"
      />

      <CodeBlock
        title="Uso via CSS / HTML estático (Power BI, e-mails, widgets)"
        code={`<!-- 1. Importar CSS no <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" />

<!-- 2. Usar via classes -->
<i class="ri-search-line" style="font-size:20px;color:#0D3857"></i>
<i class="ri-notification-3-line ri-lg"></i>
<i class="ri-user-3-line ri-xl"></i>

<!-- Modificadores de tamanho prontos: ri-xs, ri-sm, ri-1x, ri-lg, ri-xl, ri-2x ... ri-5x -->`}
        language="html"
      />

      {/* Grid */}
      <SectionHeader id="grid" title="Grid e Espaçamento" description="Sistema de grid responsivo com suporte a 16, 12, 8 e 4 colunas para desktop, tablet e mobile, com exemplos práticos para dashboards." />

      <GridSection />

      {/* Elevation */}
      <SectionHeader id="elevacao" title="Elevação e Sombras" description="Níveis de elevação para criar hierarquia visual e profundidade. As sombras se adaptam ao tema." />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "XS", token: "--shadow-xs" },
          { label: "SM", token: "--shadow-sm" },
          { label: "MD", token: "--shadow-md" },
          { label: "LG", token: "--shadow-lg" },
          { label: "XL", token: "--shadow-xl" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg p-6 text-center border border-border" style={{ boxShadow: `var(${s.token})` }}>
            <p className="font-semibold text-sm">{s.label}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.token}</p>
          </div>
        ))}
      </div>

      {/* Border Radius */}
      <div className="brand-card mb-8">
        <h4 className="text-sm font-semibold mb-4">Border Radius</h4>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "SM", value: "4px", cls: "rounded-sm" },
            { label: "MD", value: "6px", cls: "rounded-md" },
            { label: "LG", value: "8px", cls: "rounded-lg" },
            { label: "XL", value: "12px", cls: "rounded-xl" },
            { label: "2XL", value: "16px", cls: "rounded-2xl" },
            { label: "Full", value: "9999px", cls: "rounded-full" },
          ].map(r => (
            <div key={r.label} className="text-center">
              <div className={`w-16 h-16 bg-primary/10 border border-primary ${r.cls} mb-1`} />
              <p className="text-xs font-medium">{r.label}</p>
              <p className="text-[10px] text-muted-foreground">{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motion */}
      <SectionHeader id="motion" title="Motion e Transições" description="Animações sutis para feedback e hierarquia de atenção." />

      <div className="brand-card mb-8">
        <h4 className="text-sm font-semibold mb-3">Durações</h4>
        <div className="space-y-2 mb-6">
          {[
            { label: "Fast", value: "100ms", desc: "Hover, focus" },
            { label: "Normal", value: "200ms", desc: "Transições de estado" },
            { label: "Slow", value: "300ms", desc: "Abertura de painéis" },
            { label: "Slower", value: "500ms", desc: "Animações de entrada" },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-3 text-sm">
              <span className="w-16 font-medium">{d.label}</span>
              <span className="w-16 text-muted-foreground">{d.value}</span>
              <span className="text-muted-foreground text-xs">{d.desc}</span>
            </div>
          ))}
        </div>

        <h4 className="text-sm font-semibold mb-6">Exemplos Práticos</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exemplo 1: Entrada Suave */}
          <div className="p-5 border border-border rounded-xl bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xs font-bold uppercase tracking-wider">01. Entrada Suave</h5>
              <button 
                onClick={() => setKey1(prev => prev + 1)}
                className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20 transition-colors"
              >
                Reiniciar
              </button>
            </div>
            <motion.div 
              key={key1}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-card p-4 rounded-lg border border-border shadow-sm"
            >
              <div className="h-3 w-1/3 bg-primary/20 rounded mb-2" />
              <div className="h-3 w-full bg-muted rounded mb-1" />
              <div className="h-3 w-2/3 bg-muted rounded" />
            </motion.div>
            <p className="text-[10px] text-muted-foreground mt-3 italic">Use para carregar novos blocos de conteúdo ou seções da página.</p>
          </div>

          {/* Exemplo 2: Micro-interação */}
          <div className="p-5 border border-border rounded-xl bg-muted/20">
            <h5 className="text-xs font-bold uppercase tracking-wider mb-4">02. Micro-interação</h5>
            <div className="flex flex-col items-center justify-center gap-4 h-[100px]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-primary/20"
              >
                Pressione-me
              </motion.button>
              <motion.div
                whileHover={{ rotate: 5 }}
                className="text-[10px] text-muted-foreground flex items-center gap-1 cursor-help"
              >
                Passe o mouse para feedback <Info size={12} />
              </motion.div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 italic">Feedback tátil para botões e elementos clicáveis.</p>
          </div>

          {/* Exemplo 3: Lista em Cascata */}
          <div className="p-5 border border-border rounded-xl bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xs font-bold uppercase tracking-wider">03. Lista em Cascata</h5>
              <button 
                onClick={() => setKey3(prev => prev + 1)}
                className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20 transition-colors"
              >
                Reiniciar
              </button>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={`${key3}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-2 bg-card rounded border border-border"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div className="h-2 flex-1 bg-muted rounded" />
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 italic">Use para carregar múltiplos itens (tabelas, cards, menus).</p>
          </div>

          {/* Exemplo 4: Atenção/Estado */}
          <div className="p-5 border border-border rounded-xl bg-muted/20">
            <h5 className="text-xs font-bold uppercase tracking-wider mb-4">04. Feedback de Estado</h5>
            <div className="flex items-center justify-center h-[100px] gap-8">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-error/20 rounded-full"
                />
                <div className="relative bg-error text-white p-3 rounded-full">
                  <Bell size={20} />
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="bg-warning/20 border border-warning/30 p-2 rounded text-[10px] font-bold text-warning"
              >
                Ação pendente
              </motion.div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 italic">Destaque para elementos que exigem ação imediata do usuário.</p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-2">Easings</h4>
          <p className="text-xs text-muted-foreground">
            Use <code className="bg-muted px-1 rounded">ease-out</code> para entradas, <code className="bg-muted px-1 rounded">ease-in</code> para saídas e <code className="bg-muted px-1 rounded">ease-in-out</code> para transições contínuas.
          </p>
        </div>
      </div>

      {/* Responsiveness */}
      <SectionHeader id="responsividade" title="Responsividade" description="Breakpoints do sistema para design responsivo." />

      <div className="brand-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold">Token</th>
                <th className="text-left py-2 pr-4 font-semibold">Valor</th>
                <th className="text-left py-2 font-semibold">Uso</th>
              </tr>
            </thead>
            <tbody>
              {[
                { token: "sm", value: "640px", desc: "Celulares em landscape" },
                { token: "md", value: "768px", desc: "Tablets" },
                { token: "lg", value: "1024px", desc: "Notebooks" },
                { token: "xl", value: "1280px", desc: "Desktops" },
                { token: "2xl", value: "1400px", desc: "Telas grandes" },
              ].map(b => (
                <tr key={b.token} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{b.token}</code></td>
                  <td className="py-2 pr-4 text-muted-foreground">{b.value}</td>
                  <td className="py-2 text-muted-foreground">{b.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
