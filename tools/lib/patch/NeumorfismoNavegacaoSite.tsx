import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { CircleAlert, CircleCheck, CircleDashed, ChevronDown, Layers } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do NavigationMenu no estilo Neumorfismo (componente NavigationMenu do pacote Neumorphic UI v3.2.0): a
 * navegação de um site numa faixa convexa. Os gatilhos abrem painéis flutuantes de links: lista, grade de duas
 * colunas, destaque (um bloco afundado com marca luminosa) ao lado dos links, ou lista com ícones; itens sem
 * painel são links comuns (o da página atual afunda e leva aria-current="page"). Estrutura `nav` › `ul` › botões
 * com aria-expanded e aria-controls. O mouse abre depois de 120ms (e troca na hora entre gatilhos); o clique
 * alterna. Teclado: ←/→ entre os gatilhos, ↓ entra no painel, ↑/↓ andam pelos links, Esc fecha e devolve o foco;
 * sair do painel com o foco ou o ponteiro fecha. O painel se desloca para ficar dentro da janela e, em celular,
 * vira uma coluna só. `ocultarAbaixo` esconde o item abaixo de 640px. Entra numa seção nova do neumorfismo
 * ("NavigationMenu", depois do Menubar) e só é usado quando ESTILO.id === "neumorfismo". As classes
 * neu-navmenu* vêm de src/styles/estilo.css; o atributo data-neu tira a navegação das regras genéricas de
 * button[aria-expanded] (que afundariam o painel logo após o gatilho).
 */

export interface LinkNavegacao {
  titulo: string;
  href?: string;
  descricao?: string;
  icone?: ReactNode;
  aoClicar?: (e: MouseEvent) => void;
}

export interface DestaqueNavegacao {
  titulo: string;
  descricao: string;
  icone?: ReactNode;
  href?: string;
}

export interface ItemNavegacao {
  rotulo: string;
  /** Item sem painel: um link comum */
  href?: string;
  atual?: boolean;
  aoClicar?: (e: MouseEvent) => void;
  links?: LinkNavegacao[];
  colunas?: number;
  /** Largura do painel, em px (360 por padrão) */
  largura?: number;
  destaque?: DestaqueNavegacao;
  /** Substitui os links gerados por conteúdo próprio */
  conteudo?: ReactNode;
  /** Esconde o item abaixo de 640px */
  ocultarAbaixo?: boolean;
}

export function MenuNavegacao({ itens, rotulo = "Principal" }: { itens: ItemNavegacao[]; rotulo?: string }) {
  const [ativo, setAtivo] = useState(-1);
  const [deslocamento, setDeslocamento] = useState(0);
  const raiz = useRef<HTMLElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();
  const gatilhos = useRef<(HTMLElement | null)[]>([]);

  // clique fora fecha
  useEffect(() => {
    if (ativo < 0) return;
    function fora(e: globalThis.MouseEvent) {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAtivo(-1);
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [ativo]);

  // o painel não sai da janela
  useEffect(() => {
    setDeslocamento(0);
    if (ativo < 0) return;
    const painel = raiz.current?.querySelector(".neu-navmenu__panel");
    if (!painel) return;
    const r = painel.getBoundingClientRect();
    const largura = document.documentElement.clientWidth;
    let dx = 0;
    if (r.right > largura - 8) dx = largura - 8 - r.right;
    if (r.left + dx < 8) dx = 8 - r.left;
    if (dx) setDeslocamento(dx);
  }, [ativo]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function abrirPorMouse(i: number) {
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAtivo(i), ativo >= 0 ? 0 : 120);
  }
  function fecharPorMouse() {
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAtivo(-1), 250);
  }
  function focarGatilho(i: number) {
    const n = itens.length;
    gatilhos.current[(i + n) % n]?.focus();
  }
  function linksDoPainel() {
    return raiz.current ? Array.from(raiz.current.querySelectorAll<HTMLElement>(".neu-navmenu__panel a")) : [];
  }

  return (
    <nav ref={raiz} data-neu="navegacao-site" className="neu-navmenu" aria-label={rotulo} onMouseLeave={fecharPorMouse} onMouseEnter={() => clearTimeout(temporizador.current)}>
      <ul className="neu-navmenu__list">
        {itens.map((it, i) => {
          const classeItem = `neu-navmenu__item${it.ocultarAbaixo ? " neu-navmenu__item--hide" : ""}`;
          const temPainel = !!it.links || !!it.conteudo;
          if (!temPainel) {
            return (
              <li key={it.rotulo} className={classeItem}>
                <a
                  ref={(el) => { gatilhos.current[i] = el; }}
                  href={it.href ?? "#"}
                  className={`neu-navmenu__trigger${it.atual ? " neu-navmenu__trigger--current" : ""}`}
                  aria-current={it.atual ? "page" : undefined}
                  onMouseEnter={fecharPorMouse}
                  onClick={(e) => {
                    if (!it.href || it.href === "#") e.preventDefault();
                    it.aoClicar?.(e);
                  }}
                  onKeyDown={(e: KeyboardEvent) => {
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      focarGatilho(i + 1);
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      focarGatilho(i - 1);
                    }
                  }}
                >
                  {it.rotulo}
                </a>
              </li>
            );
          }
          const aberto = ativo === i;
          const pid = `nm-${i}`;
          return (
            <li key={it.rotulo} className={classeItem}>
              <button
                ref={(el) => { gatilhos.current[i] = el; }}
                type="button"
                className="neu-navmenu__trigger"
                aria-expanded={aberto}
                aria-controls={aberto ? pid : undefined}
                data-open={aberto ? "true" : undefined}
                onMouseEnter={() => abrirPorMouse(i)}
                onClick={() => {
                  clearTimeout(temporizador.current);
                  setAtivo(aberto ? -1 : i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" && aberto) {
                    e.preventDefault();
                    linksDoPainel()[0]?.focus();
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setAtivo(i);
                    setTimeout(() => linksDoPainel()[0]?.focus(), 0);
                  } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    focarGatilho(i + 1);
                    if (ativo >= 0) setAtivo(-1);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    focarGatilho(i - 1);
                    if (ativo >= 0) setAtivo(-1);
                  } else if (e.key === "Escape") setAtivo(-1);
                }}
              >
                {it.rotulo}
                <span className="neu-navmenu__chev" aria-hidden="true"><ChevronDown size={14} /></span>
              </button>
              {aberto && (
                <div
                  id={pid}
                  className="neu-navmenu__panel"
                  style={{ width: it.largura ?? 360, marginLeft: deslocamento || undefined }}
                  onKeyDown={(e) => {
                    const l = linksDoPainel();
                    const k = l.indexOf(document.activeElement as HTMLElement);
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      if (l.length) l[(k + 1) % l.length].focus();
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      if (k <= 0) focarGatilho(i);
                      else l[k - 1].focus();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setAtivo(-1);
                      focarGatilho(i);
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.parentNode?.contains(e.relatedTarget as Node | null)) setAtivo(-1);
                  }}
                >
                  {it.conteudo ?? (
                    <>
                      {it.destaque && (
                        <a
                          href={it.destaque.href ?? "#"}
                          className="neu-navmenu__feature"
                          onClick={(e) => {
                            if (!it.destaque?.href || it.destaque.href === "#") e.preventDefault();
                          }}
                        >
                          <span className="neu-navmenu__feature-mark" aria-hidden="true">{it.destaque.icone ?? <Layers size={22} />}</span>
                          <strong>{it.destaque.titulo}</strong>
                          <span>{it.destaque.descricao}</span>
                        </a>
                      )}
                      <ul className="neu-navmenu__links" style={{ gridTemplateColumns: `repeat(${it.colunas ?? 1}, minmax(0, 1fr))` }}>
                        {it.links!.map((l) => (
                          <li key={l.titulo}>
                            <a
                              href={l.href ?? "#"}
                              className={`neu-navmenu__link${l.icone && !l.descricao ? " neu-navmenu__link--icon" : ""}`}
                              onClick={(e) => {
                                l.aoClicar?.(e);
                                if (!l.href || l.href === "#") e.preventDefault();
                                setAtivo(-1);
                              }}
                            >
                              {l.icone && <span className="neu-navmenu__link-icon" aria-hidden="true">{l.icone}</span>}
                              <span className="neu-navmenu__link-text">
                                <span className="neu-navmenu__link-title">{l.titulo}</span>
                                {l.descricao && <span className="neu-navmenu__link-desc">{l.descricao}</span>}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const COMPONENTES: LinkNavegacao[] = [
  { titulo: "AlertDialog", descricao: "Diálogo modal que interrompe com um conteúdo importante e espera uma resposta." },
  { titulo: "HoverCard", descricao: "Para quem enxerga, pré-visualiza o conteúdo que existe por trás de um link." },
  { titulo: "Progress", descricao: "Mostra o avanço de uma tarefa, normalmente como uma barra de progresso." },
  { titulo: "Carousel", descricao: "Passa por um conjunto de slides com botões, arrasto ou teclado." },
  { titulo: "Tabs", descricao: "Seções de conteúdo em camadas — os painéis — exibidas uma de cada vez." },
  { titulo: "Tooltip", descricao: "Um balão com informação sobre o elemento quando ele recebe foco ou o mouse passa por cima." },
];

const ITENS: ItemNavegacao[] = [
  {
    rotulo: "Primeiros passos",
    largura: 520,
    destaque: { titulo: "Neumorphic UI", descricao: "Componentes táteis prontos para reutilizar.", icone: <Layers size={22} /> },
    links: [
      { titulo: "Introdução", descricao: "Componentes reutilizáveis construídos com tokens e React." },
      { titulo: "Instalação", descricao: "Como carregar o bundle e estruturar seu app." },
      { titulo: "Tipografia", descricao: "Estilos para títulos, parágrafos, listas etc." },
    ],
  },
  { rotulo: "Componentes", largura: 600, colunas: 2, ocultarAbaixo: true, links: COMPONENTES },
  {
    rotulo: "Com ícone",
    largura: 220,
    links: [
      { titulo: "Pendências", icone: <CircleAlert size={16} /> },
      { titulo: "A fazer", icone: <CircleDashed size={16} /> },
      { titulo: "Concluído", icone: <CircleCheck size={16} /> },
    ],
  },
  { rotulo: "Docs" },
];

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoNavegacaoSite() {
  return (
    <ComponentPreview
      title="NavigationMenu"
      description="Navegação de site numa faixa convexa. Os gatilhos abrem painéis flutuantes de links: lista, grade de duas colunas, bloco de destaque ou lista com ícones. Itens sem painel são links comuns."
      whenToUse={["Navegação principal de um site com várias seções e subpáginas", "Painéis com descrição curta de cada destino, quando só o nome não basta"]}
      whenNotToUse={["Comandos de um aplicativo (arquivo, editar, exibir): use o Menubar", "Poucas ações de um item: use o menu suspenso"]}
      accessibility={[
        "nav com nome, lista de itens e botões com aria-expanded e aria-controls; o item da página atual leva aria-current=\"page\"",
        "O mouse abre com 120ms de atraso e troca na hora entre gatilhos; o clique alterna",
        "← e → entre os gatilhos; ↓ entra no painel, ↑ e ↓ andam pelos links, Esc fecha e devolve o foco ao gatilho",
        "Sair do painel com o foco ou com o ponteiro fecha; o clique fora também",
        "O painel se desloca para ficar dentro da janela e, em celular, vira uma coluna só; o item marcado para ocultar some abaixo de 640px",
      ]}
      code={`const itens = [
  {
    rotulo: "Primeiros passos",
    largura: 520,
    destaque: { titulo: "Neumorphic UI", descricao: "Componentes táteis prontos para reutilizar." },
    links: [
      { titulo: "Introdução", descricao: "Componentes construídos com tokens e React." },
      { titulo: "Instalação", descricao: "Como carregar o bundle e estruturar seu app." },
    ],
  },
  { rotulo: "Componentes", largura: 600, colunas: 2, ocultarAbaixo: true, links: componentes },
  { rotulo: "Com ícone", largura: 220, links: [{ titulo: "Pendências", icone: <CircleAlert size={16} /> }] },
  { rotulo: "Docs", href: "/docs", atual: true },
];

<MenuNavegacao itens={itens} rotulo="Documentação" />`}
    >
      <div>
        <Legenda>Exemplo de referência</Legenda>
        <MenuNavegacao itens={ITENS} rotulo="Documentação" />
        <p className="neu-help" style={{ marginTop: 16 }}>Passe o mouse ou clique para abrir. Teclado: ← → entre itens, ↓ entra no painel, Esc fecha.</p>
      </div>
    </ComponentPreview>
  );
}
