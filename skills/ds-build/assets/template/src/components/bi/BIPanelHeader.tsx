import type { ReactNode } from "react";
import logoBrandWhite from "@/assets/brand-logo-white-header.svg";
import { cn } from "@/lib/utils";

export interface BIPanelHeaderProps {
  /** Título principal do painel (renderizado como h1 por padrão). */
  title: string;
  /** Linha de apoio abaixo do título. */
  subtitle?: string;
  /** Conteúdo alinhado à direita (ex.: informações de atualização, ações). */
  right?: ReactNode;
  /** Conteúdo antes da marca (ex.: botão de menu da sidebar). */
  leading?: ReactNode;
  /** Usa <p> em vez de <h1> quando a página já possui outro h1. */
  as?: "h1" | "p";
  className?: string;
}

/**
 * Cabeçalho institucional compartilhado pelos painéis de BI do DS __BRAND_NAME__.
 * Marca oficial em versão negativa sobre o degradê azul, divisor sutil e
 * bloco de título. Sticky no desktop, com quebra de colunas no mobile.
 */
export function BIPanelHeader({
  title,
  subtitle,
  right,
  leading,
  as = "h1",
  className,
}: BIPanelHeaderProps) {
  const Title = as;
  return (
    <header
      className={cn(
        "text-white px-[14px] md:px-[22px] py-[12px] md:py-[14px] flex flex-wrap items-center gap-x-[18px] gap-y-[8px] md:sticky md:top-0 z-30",
        className,
      )}
      style={{
        background:
          "linear-gradient(180deg, var(--brand-header-grad-start) 0%, var(--brand-header-grad-end) 100%)",
      }}
    >
      {leading}
      <div className="flex items-center gap-[10px] md:gap-[14px] min-w-0">
        <img src={logoBrandWhite} alt="__BRAND_NAME__" className="h-8 md:h-10 w-auto shrink-0" />
        <div className="hidden md:block w-px h-8 md:h-10 bg-white/30" />
        <div className="min-w-0">
          <Title className="text-[13.5px] md:text-[15px] font-semibold m-0 text-white/95">
            {title}
          </Title>
          {subtitle && (
            <div className="text-[11px] md:text-[11.5px] text-white/70 font-medium">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0" />
      {right && (
        <div className="text-[11px] text-white/80 md:text-right leading-relaxed w-full md:w-auto">
          {right}
        </div>
      )}
    </header>
  );
}

export default BIPanelHeader;
