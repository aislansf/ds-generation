import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { bentoCell, bentoGrid, type BentoSize } from "./bento";

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Classes da grade quando o layout não é bento (a grade original da página). */
  padrao?: string;
}

/** Grade da página: 4 colunas no layout bento, `padrao` nos demais. */
export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, padrao = "grid grid-cols-1 gap-4", ...props }, ref) => (
    <div ref={ref} className={bentoGrid(padrao, className)} {...props} />
  ),
);
BentoGrid.displayName = "BentoGrid";

export interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  size?: BentoSize;
  /** Bloco de destaque, preenchido com a cor primária no layout bento. */
  hero?: boolean;
}

/** Bloco da grade. Fora do bento é só um `div`; quem monta a página pode aplicar `bentoCell()` direto no elemento. */
export const BentoCell = forwardRef<HTMLDivElement, BentoCellProps>(
  ({ size = "1x1", hero, className, ...props }, ref) => (
    <div ref={ref} className={cn(bentoCell(size, { hero }), className)} {...props} />
  ),
);
BentoCell.displayName = "BentoCell";
