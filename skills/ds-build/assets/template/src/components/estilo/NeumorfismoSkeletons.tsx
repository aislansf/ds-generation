import type { CSSProperties } from "react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Skeleton no estilo Neumorfismo (componente Skeleton do pacote Neumorphic UI v3.2.0): formas
 * escavadas na superfície (sombra interna) que pulsam enquanto o conteúdo carrega. O exemplo é o do pacote: um
 * cartão convexo com o avatar redondo, um título a um terço, uma linha a dois terços e um bloco de mídia, que
 * espelham o layout real. Entra no cartão "Skeleton" da ComponentesPage e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-skeleton* vêm de src/styles/estilo.css; o pulso só roda quando a
 * pessoa não pediu menos movimento.
 */

interface EsqueletoProps {
  largura?: number | string;
  altura?: number | string;
  /** Forma redonda, para avatares */
  circulo?: boolean;
  /** Raio em px (o padrão é 4px) */
  raio?: number;
  /** Falso congela o pulso */
  animado?: boolean;
}

export function Esqueleto({ largura = "100%", altura = 12, circulo = false, raio, animado = true }: EsqueletoProps) {
  const estilo: CSSProperties = { width: largura, height: altura };
  if (circulo) estilo.borderRadius = 9999;
  else if (raio !== undefined) estilo.borderRadius = raio;
  return <div className={animado ? "neu-skeleton" : "neu-skeleton neu-skeleton--static"} aria-hidden="true" style={estilo} />;
}

export default function NeumorfismoSkeletons() {
  return (
    <ComponentPreview
      title="Skeleton"
      description="Placeholder visual durante o carregamento: formas escavadas que pulsam e imitam o layout que vai aparecer."
      whenToUse={["Carregamento de dados assíncronos", "Primeira renderização de componentes", "Layout conhecido: avatar, título, linhas e mídia"]}
      whenNotToUse={["Layout desconhecido ou ação em andamento: use o Spinner", "Tempos muito curtos: o piscar do placeholder incomoda mais do que ajuda"]}
      accessibility={["As formas são decorativas (aria-hidden); o contêiner avisa com role=\"status\", aria-busy e um texto só para leitores de tela", "O pulso só roda quando a pessoa não pediu menos movimento", "Espelhe o layout real: avatar redondo, título a um terço, linha a dois terços, bloco para mídia"]}
      code={`<div role="status" aria-busy="true">
  <span className="sr-only">Carregando conteúdo</span>
  <Esqueleto largura={40} altura={40} circulo />
  <Esqueleto largura="33%" />
  <Esqueleto largura="66%" altura={8} />
  <Esqueleto altura={80} raio={16} />
</div>`}
    >
      <div className="neu-skel-card" role="status" aria-busy="true">
        <span className="sr-only">Carregando conteúdo</span>
        <div className="neu-skel-card__linha">
          <Esqueleto largura={40} altura={40} circulo />
          <div className="neu-skel-card__textos">
            <Esqueleto largura="33%" />
            <Esqueleto largura="66%" altura={8} />
          </div>
        </div>
        <Esqueleto altura={80} raio={16} />
      </div>
    </ComponentPreview>
  );
}
