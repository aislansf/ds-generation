import { useState, type MouseEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine da Sidebar fixa no estilo Neumorfismo (variante padrão do componente Sidebar do pacote Neumorphic UI
 * v3.2.0): a navegação lateral fixa de 288px na cor da superfície, com a marca do sistema, grupos de links, um
 * cartão de identidade no pé e uma tecla de recolher que a leva a uma trilha de 84px. O link ativo sobe convexo, em
 * texto da cor da marca e com o ponto aceso; o selo "Novo" é um chip. Os títulos de grupo são numerados e em
 * caixa-alta. Recolhida, tudo fica centrado e ao alcance: cada item vira uma tecla de 44px com o ícone ou, sem
 * ícone, um monograma afundado de 28px do rótulo ("Paleta e Sombras Duplas" vira "PS"); o selo vira um ponto
 * luminoso; os títulos de grupo viram fendas curtas; o cartão do pé se desfaz e fica só a tecla de expandir; e todo
 * item mostra o nome completo numa dica ao passar o mouse e ao focar pelo teclado, além de levá-lo em aria-label.
 * O cabeçalho e a tecla não se selecionam como texto, para que cliques rápidos não pintem o título. As demais
 * variantes da Sidebar (gaveta, painel e workspace) entram em seções à parte. Entra numa seção nova do neumorfismo
 * ("Sidebar", depois do Footer) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-sidebar* e
 * neu-nav-item* vêm de src/styles/estilo.css; o foco é um anel sólido de 2px.
 */

export interface ItemMenuLateral {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  /** Selo em chip ("Novo"); recolhido, vira um ponto luminoso */
  selo?: string;
  /** Mantém a cor da marca no ponto ou no monograma, mesmo sem estar ativo */
  destaque?: boolean;
  href?: string;
}

export interface GrupoMenuLateral {
  titulo: string;
  itens: ItemMenuLateral[];
}

interface MenuLateralProps {
  grupos: GrupoMenuLateral[];
  ativo?: string;
  ativoInicial?: string;
  aoNavegar?: (id: string) => void;
  titulo?: string;
  subtitulo?: string;
  tituloRodape?: string;
  subtituloRodape?: string;
  iniciaisRodape?: string;
  /** Falso esconde a tecla de recolher */
  recolhivel?: boolean;
  recolhidoInicial?: boolean;
  /** Nome da região (aside) */
  rotulo?: string;
  rotuloNav?: string;
}

/** O monograma do item sem ícone: as duas primeiras iniciais das palavras longas ("Paleta e Sombras Duplas" → "PS") */
export function monograma(texto: string) {
  const palavras = String(texto || "").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((x) => x.length > 2 || /\d/.test(x));
  const w = palavras.length ? palavras : String(texto || "?").split(/\s+/);
  return (w.length > 1 ? w[0].charAt(0) + w[1].charAt(0) : w[0].slice(0, 2)).toUpperCase();
}

const MARCA = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity="0.3" />
  </svg>
);

export function MenuLateral({ grupos, ativo, ativoInicial, aoNavegar, titulo = "Neumorphic UI", subtitulo = "Design System v3.2", tituloRodape = "Radix/shadcn", subtituloRodape = "Tema claro e escuro", iniciaisRodape = "UI", recolhivel = true, recolhidoInicial = false, rotulo = "Menu lateral", rotuloNav = "Navegação" }: MenuLateralProps) {
  const [interno, setInterno] = useState(ativoInicial);
  const atual = ativo ?? interno;
  const [recolhido, setRecolhido] = useState(recolhidoInicial);
  function ir(id: string, e: MouseEvent, href?: string) {
    if (!href || href === "#") e.preventDefault();
    if (ativo === undefined) setInterno(id);
    aoNavegar?.(id);
  }
  return (
    <aside className="neu-sidebar" data-collapsed={recolhido} aria-label={rotulo}>
      <div className="neu-sidebar__top">
        <div className="neu-sidebar__brand">
          <span className="neu-sidebar__logo" aria-hidden="true">{MARCA}</span>
          <span className="neu-sidebar__label">
            <p className="neu-sidebar__name">{titulo}</p>
            <p className="neu-sidebar__ver">{subtitulo}</p>
          </span>
        </div>
        <nav className="neu-sidebar__nav" aria-label={rotuloNav}>
          {grupos.map((g) => (
            <div key={g.titulo} className="neu-sidebar__section">
              {recolhido ? <span className="neu-sidebar__rule" aria-hidden="true" /> : <span className="neu-sidebar__group">{g.titulo}</span>}
              <div className="neu-sidebar__items">
                {g.itens.map((it) => {
                  const on = atual === it.id;
                  const guia = it.icone ? (
                    it.icone
                  ) : recolhido ? (
                    <span className={`neu-nav-item__mono${it.destaque ? " neu-nav-item__mono--hl" : ""}`} aria-hidden="true">{monograma(it.rotulo)}</span>
                  ) : (
                    <span className={`neu-dot neu-dot--${on || it.destaque ? "accent" : "neutral"}`} aria-hidden="true" />
                  );
                  return (
                    <a
                      key={it.id}
                      className="neu-nav-item"
                      href={it.href ?? "#"}
                      aria-current={on ? "page" : undefined}
                      aria-label={recolhido ? it.rotulo + (it.selo ? ` (${it.selo})` : "") : undefined}
                      onClick={(e) => ir(it.id, e, it.href)}
                    >
                      <span className="neu-nav-item__lead">
                        {guia}
                        <span className="neu-sidebar__label">{it.rotulo}</span>
                      </span>
                      {it.selo && (recolhido ? <span className="neu-nav-item__pip" aria-hidden="true" /> : <span className="neu-badge neu-badge--chip">{it.selo}</span>)}
                      {recolhido && <span className="neu-rail__tip" aria-hidden="true">{it.rotulo}</span>}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="neu-sidebar__foot">
        <span className="neu-sidebar__avatar" aria-hidden="true">{iniciaisRodape}</span>
        <span className="neu-sidebar__label">
          <b>{tituloRodape}</b>
          <small>{subtituloRodape}</small>
        </span>
        {recolhivel && (
          <button type="button" className="neu-sidebar__toggle" aria-label={recolhido ? "Expandir menu" : "Recolher menu"} aria-expanded={!recolhido} onClick={() => setRecolhido(!recolhido)}>
            {recolhido ? <ChevronRight aria-hidden="true" size={16} /> : <ChevronLeft aria-hidden="true" size={16} />}
            {recolhido && <span className="neu-rail__tip" aria-hidden="true">Expandir menu</span>}
          </button>
        )}
      </div>
    </aside>
  );
}

const GRUPOS: GrupoMenuLateral[] = [
  { titulo: "1. Primitivos UI", itens: [{ id: "toast", rotulo: "Toast", selo: "Novo" }, { id: "breadcrumb", rotulo: "Breadcrumb" }, { id: "tabs", rotulo: "Tabs", selo: "Novo" }, { id: "modal", rotulo: "Modal" }] },
  { titulo: "2. Tokens & Cores", itens: [{ id: "paleta", rotulo: "Paleta e Sombras Duplas" }, { id: "luz", rotulo: "Elevações & Luz 135°" }] },
  { titulo: "3. Gráficos & BI", itens: [{ id: "bi", rotulo: "Painel Executivo & KPIs", destaque: true }] },
];

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 8px" }}>{children}</p>;
}

/** Moldura de 640px que dá altura à barra e uma área de conteúdo à direita, onde as dicas da trilha aparecem */
function Moldura({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", height: 640, overflow: "hidden", border: "1px solid var(--neu-edge)", borderRadius: "1rem" }}>
      {children}
      <div style={{ flex: 1, minWidth: 0, padding: 24 }} aria-hidden="true" />
    </div>
  );
}

export default function NeumorfismoMenuLateral() {
  return (
    <ComponentPreview
      title="Sidebar"
      description="A navegação lateral fixa: a marca do sistema, grupos de links numerados, um cartão de identidade no pé e a tecla que a recolhe numa trilha de 84px, onde cada item vira uma tecla com dica. Esta é a variante padrão; gaveta, painel e workspace têm seção própria."
      whenToUse={["Aplicações com várias áreas, onde a navegação principal fica sempre à vista", "Recolhida: para dar espaço a tabelas densas e painéis, sem perder o acesso aos itens", "Grupos numerados e em caixa-alta, para organizar muitos links"]}
      whenNotToUse={["Telas de celular ou apps sem menu fixo: use a gaveta", "Navegação de um site público: use o NavigationMenu", "Poucas áreas: use abas ou um Breadcrumb"]}
      accessibility={[
        "A barra é um aside com nome e a lista fica num nav com nome; o item atual leva aria-current=\"page\"",
        "Recolhida, cada item leva o nome completo em aria-label (com o selo, se houver) e o mostra numa dica ao passar o mouse e ao focar pelo teclado",
        "A tecla de recolher tem nome (\"Recolher menu\" ou \"Expandir menu\") e aria-expanded; recolhida, a dica dela diz \"Expandir menu\"",
        "O selo \"Novo\" vira um ponto decorativo no recolhido, mas o aria-label do item continua dizendo \"(Novo)\"",
        "O ativo muda de relevo, de cor e de ponto: o estado não depende só da cor; foco em anel sólido de 2px",
        "A largura anima sem salto; com \"menos movimento\" não há animação",
      ]}
      code={`const grupos = [
  { titulo: "1. Primitivos UI", itens: [{ id: "toast", rotulo: "Toast", selo: "Novo" }, { id: "tabs", rotulo: "Tabs", selo: "Novo" }] },
  { titulo: "2. Tokens & Cores", itens: [{ id: "paleta", rotulo: "Paleta e Sombras Duplas" }] },
  { titulo: "3. Gráficos & BI", itens: [{ id: "bi", rotulo: "Painel Executivo & KPIs", destaque: true }] },
];

<MenuLateral grupos={grupos} ativoInicial="tabs" titulo="Sua marca" subtitulo="Design System" />
<MenuLateral grupos={grupos} ativoInicial="tabs" recolhidoInicial />`}
    >
      <div className="neu-stack" style={{ gap: 28 }}>
        <div>
          <Legenda>Expandida (288px)</Legenda>
          <Moldura><MenuLateral grupos={GRUPOS} ativoInicial="tabs" /></Moldura>
        </div>
        <div>
          <Legenda>Recolhida (trilha de 84px): passe o mouse ou use o Tab para ver as dicas</Legenda>
          <Moldura><MenuLateral grupos={GRUPOS} ativoInicial="tabs" recolhidoInicial /></Moldura>
        </div>
      </div>
    </ComponentPreview>
  );
}
