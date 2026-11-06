import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { ESTILO } from "@/config/estilo";
import { cn } from "@/lib/utils";

/**
 * Os botões das páginas do DS (copiar, alternar, baixar, reiniciar, as ações do herói) são escritos à mão em cada página,
 * com cores, tamanhos e raios próprios. Nos demais estilos continuam <button> como sempre; no Neumorfismo viram o Button
 * validado em Componentes, com a variante e o tamanho que a intenção do botão pede:
 *  - default → primário (degradê da marca); secondary → secundário (segunda cor da marca);
 *  - outline, toggle e marca → o contorno em relevo (outline + neu-btn--convex, o "secundário" do pacote); um toggle
 *    ligado (bg-primary) vira o primário, para o estado selecionado se ler sem depender da cor do texto;
 *  - ghost com só um ícone → o botão só de ícone (neu-ib); ghost com texto → ghost;
 *  - texto de 10 a 12px → tamanho sm; link continua link.
 * Do que o autor escreveu ficam só as classes de posição (absolute, top-2, mt-3, w-full...) e a cor de sucesso do "Copiado".
 * Só muda alguma coisa quando ESTILO.id === "neumorfismo"; as classes de peça (neu-*) vêm de src/styles/estilo.css.
 */

type Variante = "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";

const POSICAO = /^(absolute|relative|fixed|inset-|top-|right-|bottom-|left-|z-|m[trblxy]?-|-m[trblxy]?-|w-full|flex-1|shrink-0|self-|justify-self-|order-|col-span-|text-success|text-destructive|animate-)/;

/** As classes que o autor escolheu para a posição do botão, sem as de cor, tamanho e raio */
export function classesDePosicao(classes: string): string {
  return classes
    .split(/\s+/)
    .filter((c) => POSICAO.test(c.replace(/^[a-z]+:/, "")))
    .join(" ");
}

export interface EscolhaBotao {
  variant: Variante;
  size: "default" | "sm" | "icon";
  convexo: boolean;
  /** Ajuste fino para os botões miúdos (chips de copiar) */
  miudo: boolean;
}

/** A variante e o tamanho do Button validado que correspondem ao botão escrito à mão */
export function escolherBotao(variante: string | undefined, classes: string, soIcone: boolean): EscolhaBotao | null {
  const miudo = /text-\[(9|10|11)px\]/.test(classes);
  const pequeno = miudo || /\btext-xs\b/.test(classes);
  const ligado = /(^|\s)bg-primary(\s|$)/.test(classes);
  if (variante === "link") return null;
  if (variante === "ghost") {
    return soIcone || /\bp-1\.5\b/.test(classes) ? { variant: "outline", size: "icon", convexo: true, miudo: false } : { variant: "ghost", size: pequeno ? "sm" : "default", convexo: false, miudo };
  }
  if (variante === "toggle") return { variant: ligado ? "default" : "outline", size: pequeno ? "sm" : "default", convexo: !ligado, miudo };
  if (variante === "default" || variante === "secondary" || variante === "destructive") {
    // um "secundário" miúdo, de fundo apagado, é um chip de copiar: o contorno em relevo
    if (variante === "secondary" && miudo) return { variant: "outline", size: "sm", convexo: true, miudo };
    return { variant: variante, size: pequeno ? "sm" : "default", convexo: false, miudo };
  }
  // outline, marca e o que mais vier: o contorno em relevo
  return { variant: "outline", size: pequeno ? "sm" : "default", convexo: true, miudo };
}

type Props = ComponentPropsWithoutRef<"button"> & { "data-variant"?: string; "data-ds"?: string };

export const BotaoDS = forwardRef<HTMLButtonElement, Props>(function BotaoDS({ className, children, "data-variant": variante, "data-ds": ds, ...resto }, ref) {
  const classes = className ?? "";
  const original = (
    <button ref={ref} data-ds={ds} data-variant={variante} className={className} {...resto}>
      {children}
    </button>
  );
  if ((ESTILO.id as string) !== "neumorfismo") return original;
  // sem data-ds nem variante, só o botão miúdo de copiar (o resto é botão de outra natureza, como a imagem que amplia)
  if (ds === undefined && variante === undefined && !/text-\[(9|10|11)px\]/.test(classes)) return original;
  const soIcone = typeof children !== "string" && !Array.isArray(children);
  const escolha = escolherBotao(variante, classes, soIcone);
  if (!escolha) return original;
  return (
    <Button
      ref={ref}
      variant={escolha.variant}
      size={escolha.size}
      className={cn(escolha.convexo && "neu-btn--convex", escolha.size === "icon" && "neu-ib", escolha.miudo && "h-7 gap-1 px-2 text-[11px]", classesDePosicao(classes))}
      {...resto}
    >
      {children}
    </Button>
  );
});
