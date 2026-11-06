import type { MouseEvent } from "react";
import { ChevronRight, House } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Breadcrumb no estilo Neumorfismo (componente Breadcrumb do pacote Neumorphic UI v3.2.0): a trilha
 * estrutural em duas variantes. Pílulas (padrão): links convexos com chevron entre eles e a página atual
 * afundada na cor da marca (aria-current="page"); o primeiro leva o ícone de casa, a não ser que `iconeInicio`
 * seja falso. Texto: a trilha leve para cartões, modais e vistas secundárias, feita com o mesmo relevo do controle
 * segmentado: tudo numa pista afundada em pílula; os links são texto, sobem como uma pílula convexa pequena no
 * mouse (na cor da marca) e afundam ao pressionar; a página atual é a única pílula em relevo em repouso e não é
 * link. `tom="marca"` pinta os links na cor da marca em repouso (use em trilhas curtas). Entra no cartão
 * "Breadcrumb" da ComponentesPage e só é usado quando ESTILO.id === "neumorfismo". As classes neu-crumb* vêm de
 * src/styles/estilo.css; o atributo data-neu tira a trilha das regras genéricas de nav › ol › a dessa camada.
 */

export interface ItemTrilha {
  rotulo: string;
  href?: string;
  aoClicar?: (e: MouseEvent) => void;
}

interface TrilhaProps {
  itens: ItemTrilha[];
  variante?: "pilulas" | "texto";
  /** Ícone de casa no primeiro item (padrão: sim nas pílulas, não no texto) */
  iconeInicio?: boolean;
  tom?: "marca";
  rotulo?: string;
}

export function Trilha({ itens, variante = "pilulas", iconeInicio, tom, rotulo = "Breadcrumb" }: TrilhaProps) {
  const texto = variante === "texto";
  const casa = iconeInicio ?? !texto;
  const classeLink = texto ? `neu-crumb-t${tom === "marca" ? " neu-crumb-t--accent" : ""}` : "neu-crumb";
  return (
    <nav aria-label={rotulo} data-neu="trilha">
      <ol className={`neu-crumbs${texto ? " neu-crumbs--text" : ""}`}>
        {itens.flatMap((it, i) => {
          const ultimo = i === itens.length - 1;
          const conteudo = (
            <>
              {i === 0 && casa && <House aria-hidden="true" size={14} />}
              {it.rotulo}
            </>
          );
          const no = ultimo ? (
            <span className={texto ? "neu-crumb-t neu-crumb-t--current" : "neu-crumb neu-crumb--current"} aria-current="page">{conteudo}</span>
          ) : (
            <a
              className={classeLink}
              href={it.href ?? "#"}
              onClick={(e) => {
                if (!it.href) e.preventDefault();
                it.aoClicar?.(e);
              }}
            >
              {conteudo}
            </a>
          );
          const itemLi = (
            <li key={`i${i}`} className={texto ? "neu-crumbs__item" : undefined}>
              {no}
            </li>
          );
          return ultimo
            ? [itemLi]
            : [
                itemLi,
                <li key={`s${i}`} className="neu-crumbs__sep" aria-hidden="true">
                  <ChevronRight size={14} />
                </li>,
              ];
        })}
      </ol>
    </nav>
  );
}

export default function NeumorfismoBreadcrumb() {
  return (
    <ComponentPreview
      title="Breadcrumb"
      description="A trilha estrutural em duas variantes: pílulas convexas (padrão) e links em texto numa pista afundada. A página atual aparece afundada, na cor da marca, e não é link."
      whenToUse={["Todas as páginas internas, logo abaixo do cabeçalho, com até quatro níveis (pílulas)", "Texto: cartões, modais e vistas secundárias, onde a trilha de pílulas competiria com o cabeçalho", "Painéis administrativos e páginas com hierarquia profunda"]}
      whenNotToUse={["Etapas de um fluxo em ordem: use o Stepper", "Navegação entre irmãos: use as abas ou o NavigationMenu"]}
      accessibility={[
        "nav com nome (aria-label=\"Breadcrumb\") e lista ordenada de itens; os chevrons são decorativos (aria-hidden)",
        "A página atual leva aria-current=\"page\" e não é link",
        "O ícone de casa é decorativo: o rótulo \"Início\" continua visível e anunciado",
        "A página atual se distingue pela forma (afundada) e pelo peso, além da cor da marca",
        "Foco em anel sólido de 2px nos links; o pressionar afunda o link",
      ]}
      code={`const itens = [{ rotulo: "Início", href: "/" }, { rotulo: "Programas", href: "/programas" }, { rotulo: "Educação Empreendedora" }];

<Trilha itens={itens} />
<Trilha itens={itens} variante="texto" iconeInicio />
<Trilha itens={itens} variante="texto" tom="marca" />`}
    >
      <div className="neu-stack" style={{ gap: 28 }}>
        <Trilha itens={[{ rotulo: "Início" }, { rotulo: "Programas" }, { rotulo: "ALI – Agentes Locais de Inovação" }, { rotulo: "Visão Geral 2026" }]} />
        <Trilha variante="texto" iconeInicio itens={[{ rotulo: "Início" }, { rotulo: "Programas" }, { rotulo: "Educação Empreendedora" }]} />
      </div>
    </ComponentPreview>
  );
}
