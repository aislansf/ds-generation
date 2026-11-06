import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Badge e do Tag no estilo Neumorfismo (componentes Badge e Tag do pacote Neumorphic UI v3.2.0): a
 * pílula convexa com ponto luminoso para status, a afundada em tamanho pequeno para metadados, a sólida na cor
 * da marca e o chip de canto reto. Cinco tons (marca, secundária no lugar do azul royal, sucesso, crítico e
 * neutro). O Tag é o selo convexo pequeno e neutro que nomeia um filtro aplicado ("Campo: Valor"), com um ✕
 * opcional para remover. Entra no cartão "Badge / Tag" da ComponentesPage e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-badge* e neu-tag* vêm de src/styles/estilo.css; o texto é sempre
 * legível sem a cor (o ponto é decorativo).
 */

type Tom = "accent" | "royal" | "success" | "danger" | "warning" | "neutral";
type Variante = "convex" | "inset" | "solid" | "chip";
type Tamanho = "md" | "sm" | "xs";

interface SeloProps {
  tom?: Tom;
  variante?: Variante;
  tamanho?: Tamanho;
  /** Ponto luminoso antes do texto (só na variante convexa) */
  ponto?: boolean;
  children: ReactNode;
}

export function Selo({ tom = "neutral", variante = "convex", tamanho = "md", ponto = false, children }: SeloProps) {
  const classe = [
    "neu-badge",
    `neu-badge--${variante}`,
    tamanho !== "md" && `neu-badge--${tamanho}`,
    variante !== "solid" && variante !== "chip" && `neu-tone-${tom}`,
  ].filter(Boolean).join(" ");
  return (
    <span className={classe}>
      {ponto && <span aria-hidden="true" className={`neu-dot neu-dot--${tom}`} />}
      {children}
    </span>
  );
}

interface EtiquetaProps {
  /** "Campo: Valor" para filtros; vira o nome acessível do botão ("Remover …") */
  children: string;
  aoRemover?: () => void;
}

/** Tag: selo convexo pequeno e neutro que nomeia um filtro aplicado, com o ✕ de remover quando houver aoRemover. */
export function Etiqueta({ children, aoRemover }: EtiquetaProps) {
  return (
    <span className="neu-badge neu-badge--convex neu-badge--sm neu-tone-neutral">
      {children}
      {aoRemover && (
        <button type="button" className="neu-tag__remove" aria-label={`Remover ${children}`} onClick={aoRemover}>
          <span aria-hidden="true">✕</span>
        </button>
      )}
    </span>
  );
}

const FILTROS_INICIAIS = ["Município: Fortaleza", "Status: Em Execução", "Programa: ALI Inovação"];

function ExemploEtiquetas() {
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  return (
    <div className="neu-row" style={{ gap: 8 }}>
      {filtros.map((f) => (
        <Etiqueta key={f} aoRemover={() => setFiltros(filtros.filter((x) => x !== f))}>{f}</Etiqueta>
      ))}
      <Etiqueta>Microempresa</Etiqueta>
      {filtros.length < FILTROS_INICIAIS.length && (
        <Button type="button" variant="link" size="sm" onClick={() => setFiltros(FILTROS_INICIAIS)}>Restaurar filtros</Button>
      )}
    </div>
  );
}

export default function NeumorfismoBadges() {
  return (
    <ComponentPreview
      title="Badge / Tag"
      description="Indicadores de status, categorias ou contagens. Convexos para status com ponto luminoso, afundados para metadados, sólidos para destaque da marca."
      whenToUse={["Status de itens (ativo, crítico, concluído)", "Categorias e metadados curtos", "Contadores e marcações como \"Novo\""]}
      whenNotToUse={["Texto longo", "Ações clicáveis (use botão)"]}
      accessibility={["O status sempre vem em texto: a cor e o ponto luminoso só reforçam", "O ponto é decorativo (aria-hidden)", "Não use só a cor para diferenciar estados", "O ✕ do Tag é um botão com nome acessível \"Remover Campo: Valor\" e área de toque de 24px"]}
      code={`<Selo tom="accent" ponto>Ativo</Selo>
<Selo tom="royal" ponto>Info</Selo>
<Selo tom="success" ponto>Sucesso</Selo>
<Selo tom="danger" ponto>Crítico</Selo>
<Selo>Neutro DS</Selo>

<Selo variante="inset" tom="accent" tamanho="sm">INTERATIVO</Selo>
<Selo variante="inset" tamanho="sm">4 Estados Táteis</Selo>
<Selo variante="solid" tamanho="sm">5 Paletas</Selo>
<Selo variante="chip">Novo</Selo>
<Selo tom="success" tamanho="xs">ATIVO</Selo>

{/* Tag: filtro aplicado, com ✕ para remover */}
<Etiqueta aoRemover={() => remover("Município: Fortaleza")}>Município: Fortaleza</Etiqueta>
<Etiqueta>Microempresa</Etiqueta>`}
    >
      <div className="neu-stack" style={{ gap: 16 }}>
        <div className="neu-row">
          <Selo tom="accent" ponto>Ativo</Selo>
          <Selo tom="royal" ponto>Info</Selo>
          <Selo tom="success" ponto>Sucesso</Selo>
          <Selo tom="danger" ponto>Crítico</Selo>
          <Selo>Neutro DS</Selo>
        </div>
        <div className="neu-row">
          <Selo variante="inset" tom="accent" tamanho="sm">INTERATIVO</Selo>
          <Selo variante="inset" tamanho="sm">4 Estados Táteis</Selo>
          <Selo variante="solid" tamanho="sm">5 Paletas</Selo>
          <Selo variante="chip">Novo</Selo>
          <Selo tom="success" tamanho="xs">ATIVO</Selo>
        </div>
        <p className="neu-label" style={{ margin: "8px 0 -4px" }}>Tag: filtros aplicados, com remoção</p>
        <ExemploEtiquetas />
      </div>
    </ComponentPreview>
  );
}
