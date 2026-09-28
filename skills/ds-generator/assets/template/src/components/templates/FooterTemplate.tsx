import { ComponentPreview, CodeBlock } from "@/components/DSComponents";
import { brandCor as brandLogoCor, brandWhite as brandLogoWhite, brandBlack as brandLogoBlack } from "@/assets/brand";

interface FooterModelProps {
  projectName: string;
  version: string;
  variant: "light" | "dark" | "compact";
}

function FooterPreview({ projectName, version, variant }: FooterModelProps) {
  const isDark = variant === "dark";
  const isCompact = variant === "compact";
  const logoSrc = isDark ? brandLogoWhite : brandLogoCor;
  const bgClass = isDark ? "bg-[#16329C]" : "bg-muted/30";
  const textClass = isDark ? "text-white/90" : "text-muted-foreground";
  const borderClass = isDark ? "border-white/10" : "border-border";
  const logoHeight = isCompact ? "h-4" : "h-5";
  const wrapperHeight = isCompact ? "h-10" : "h-12";

  return (
    <footer className={`${bgClass} border-t ${borderClass} ${wrapperHeight} flex items-center justify-between px-4 sm:px-6 rounded-b-lg`}>
      <div className="flex items-center gap-2 min-w-0">
        <img src={logoSrc} alt="__BRAND_NAME__" className={`${logoHeight} w-auto opacity-90`} />
        <span className={`${isDark ? "text-white/40" : "text-muted-foreground/50"} text-xs hidden sm:inline`}>|</span>
        <span className={`text-xs font-medium truncate ${textClass}`}>{projectName}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] ${isDark ? "text-white/60" : "text-muted-foreground/80"}`}>Versão</span>
        <span className={`text-xs font-semibold ${textClass}`}>{version}</span>
      </div>
    </footer>
  );
}

function generateFooterCode(variant: "light" | "dark" | "compact"): string {
  const isDark = variant === "dark";
  const isCompact = variant === "compact";
  const bg = isDark ? "#16329C" : "#F8FAFC";
  const text = isDark ? "#FFFFFF" : "#475569";
  const muted = isDark ? "rgba(255,255,255,0.6)" : "#64748B";
  const separator = isDark ? "rgba(255,255,255,0.4)" : "#94A3B8";
  const border = isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0";
  const logoSrc = isDark ? brandLogoWhite : brandLogoCor;
  const height = isCompact ? "36px" : "48px";
  const logoHeight = isCompact ? "16px" : "20px";

  return `<!-- Footer __BRAND_NAME__: ${variant === "light" ? "Padrão claro" : variant === "dark" ? "Padrão escuro" : "Compacto"} -->
<footer class="brand-footer" style="background-color: ${bg}; border-top: 1px solid ${border};">
  <div class="brand-footer__inner">
    <div class="brand-footer__brand">
      <img src="${logoSrc}" alt="__BRAND_NAME__" class="brand-footer__logo" />
      <span class="brand-footer__separator" style="color: ${separator};">|</span>
      <span class="brand-footer__project" style="color: ${text};">Nome do Projeto</span>
    </div>
    <div class="brand-footer__version">
      <span class="brand-footer__version-label" style="color: ${muted};">Versão</span>
      <span class="brand-footer__version-value" style="color: ${text};">v.1.0</span>
    </div>
  </div>
</footer>

<style>
.brand-footer {
  font-family: '__FONT_PRIMARY__', '__FONT_SYSTEM__', sans-serif;
  width: 100%;
}
.brand-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: ${height};
  padding: 0 1rem;
  max-width: 1280px;
  margin: 0 auto;
}
.brand-footer__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.brand-footer__logo {
  height: ${logoHeight};
  width: auto;
  flex-shrink: 0;
}
.brand-footer__separator {
  font-size: 0.75rem;
  display: none;
}
@media (min-width: 640px) {
  .brand-footer__separator { display: inline; }
}
.brand-footer__project {
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.brand-footer__version {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}
.brand-footer__version-label {
  font-size: 0.625rem;
}
.brand-footer__version-value {
  font-size: 0.75rem;
  font-weight: 600;
}
</style>`;
}

export default function FooterTemplateSection() {
  const variants: { id: "light" | "dark" | "compact"; title: string; description: string }[] = [
    {
      id: "light",
      title: "Footer Padrão Claro",
      description: "Rodapé institucional com fundo claro, marca __BRAND_NAME__, nome do projeto e versão à direita. Ideal para aplicações com tema claro.",
    },
    {
      id: "dark",
      title: "Footer Padrão Escuro",
      description: "Rodapé com fundo azul institucional (#16329C) e texto branco. Use em dashboards, painéis de BI ou aplicações com tema escuro.",
    },
    {
      id: "compact",
      title: "Footer Compacto",
      description: "Versão reduzida de 36px de altura para interfaces com espaço vertical limitado. Mantém a marca e a versão legíveis.",
    },
  ];

  return (
    <div className="space-y-8">
      {variants.map((variant) => (
        <ComponentPreview
          key={variant.id}
          title={variant.title}
          description={variant.description}
          code={generateFooterCode(variant.id)}
          whenToUse={[
            "Sempre no rodapé de aplicações __BRAND_NAME__",
            variant.id === "dark" ? "Dashboards e painéis de BI com fundo escuro" : "Aplicações internas com tema claro",
            variant.id === "compact" ? "Telas pequenas ou com muito conteúdo" : "Páginas padrão com espaço vertical disponível",
          ]}
          whenNotToUse={[
            "Não remova a marca __BRAND_NAME__ do rodapé",
            "Não altere a posição da versão para a esquerda",
            "Não use cores fora da paleta institucional",
          ]}
          accessibility={[
            "Texto da versão mantém contraste mínimo 4.5:1",
            "Logo possui alt descritivo",
            "Layout responsivo preserva legibilidade em telas pequenas",
          ]}
        >
          <div className="rounded-t-lg overflow-hidden border border-border border-b-0">
            <div className="h-16 bg-[#EFF3F8] flex items-center justify-center text-xs text-muted-foreground">
              Área de conteúdo da página
            </div>
          </div>
          <FooterPreview projectName="Nome do Projeto" version="v.1.0" variant={variant.id} />
        </ComponentPreview>
      ))}

      <div className="brand-card">
        <h4 className="font-semibold text-foreground mb-3">Especificação do componente</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-foreground mb-1">Altura</p>
            <ul className="space-y-0.5">
              <li><code className="text-[11px]">Padrão: 48px</code></li>
              <li><code className="text-[11px]">Compacto: 36px</code></li>
              <li className="pt-1">Altura fixa mantém consistência visual entre páginas.</li>
            </ul>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-foreground mb-1">Alinhamento</p>
            <ul className="space-y-0.5">
              <li>Marca __BRAND_NAME__ alinhada à <strong>esquerda</strong>.</li>
              <li>Nome do projeto ao lado da marca, separado por <strong>|</strong>.</li>
              <li>Versão alinhada à <strong>direita</strong>.</li>
            </ul>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-foreground mb-1">Cores</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded border border-border" style={{ background: "#F8FAFC" }} />
                <span>Fundo claro: <code className="text-[11px]">#F8FAFC</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded border border-border" style={{ background: "#16329C" }} />
                <span>Fundo escuro: <code className="text-[11px]">#16329C</code></span>
              </li>
              <li className="pt-1">Contraste mínimo 4.5:1 em ambos os temas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
