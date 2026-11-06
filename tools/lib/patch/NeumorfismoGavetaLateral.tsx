import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, Folder, LayoutGrid, House, Menu, Search, Settings, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine da Sidebar em gaveta no estilo Neumorfismo (variante "drawer" do componente Sidebar do pacote
 * Neumorphic UI v3.2.0): um painel de 320px que desliza da esquerda sobre um véu desfocado, para celular e para
 * apps sem menu fixo. Traz a marca (logo convexo + título + subtítulo), a tecla de fechar, uma busca num poço
 * afundado que filtra itens e subitens ignorando caixa e acentos (e abre sozinha os grupos que casam), a lista de
 * navegação (o item atual vira uma pílula clara com o ponto aceso; o selo é um chip; os grupos abrem em subitens
 * recuados) e um pé com a organização e a versão. É um diálogo modal de verdade: o foco vai para a tecla de fechar,
 * Tab fica preso dentro da gaveta, Esc e o clique no véu fecham, a rolagem da página trava e o foco volta a quem a
 * abriu. Com `embutida` a gaveta vira só o painel, para mostrar dentro de um quadro. A seta dos grupos troca de
 * ícone (direita ↔ baixo) em vez de girar. Entra numa seção nova do neumorfismo ("Sidebar · Gaveta", depois do
 * Sidebar) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-drawer* vêm de src/styles/estilo.css.
 */

export interface SubitemGaveta {
  id: string;
  rotulo: string;
  href?: string;
}

export interface ItemGaveta {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  /** Chip à direita do item (some quando o item está ativo, que mostra o ponto) */
  selo?: string;
  href?: string;
  /** Termos extras que a busca também olha */
  palavrasChave?: string;
  /** Com subitens o item vira um grupo que abre e fecha */
  filhos?: SubitemGaveta[];
  /** Falso começa o grupo fechado */
  abertoInicial?: boolean;
}

interface GavetaLateralProps {
  itens: ItemGaveta[];
  /** Controla a visibilidade; ignorado com `embutida` */
  aberta?: boolean;
  aoFechar?: () => void;
  ativo?: string;
  ativoInicial?: string;
  aoNavegar?: (id: string) => void;
  titulo?: string;
  subtitulo?: string;
  logo?: ReactNode;
  buscavel?: boolean;
  placeholderBusca?: string;
  iniciaisRodape?: string;
  tituloRodape?: string;
  metaRodape?: string;
  /** Falso mantém a gaveta aberta depois de escolher um item */
  fecharAoNavegar?: boolean;
  /** Mostra só o painel, sem véu, sem foco preso e sem Esc */
  embutida?: boolean;
  rotuloFechar?: string;
  rotuloNav?: string;
  /** Elemento que recebe o foco ao fechar (padrão: quem estava focado ao abrir) */
  retornoFoco?: { current: HTMLElement | null };
}

const FOCAVEIS = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function normalizar(t: string) {
  return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function GavetaLateral({
  itens,
  aberta = false,
  aoFechar,
  ativo,
  ativoInicial,
  aoNavegar,
  titulo = "Sua marca",
  subtitulo,
  logo,
  buscavel = true,
  placeholderBusca = "Buscar no menu...",
  iniciaisRodape,
  tituloRodape,
  metaRodape,
  fecharAoNavegar = true,
  embutida = false,
  rotuloFechar = "Fechar menu",
  rotuloNav = "Menu",
  retornoFoco,
}: GavetaLateralProps) {
  const [interno, setInterno] = useState(ativoInicial);
  const atual = ativo ?? interno;
  const [busca, setBusca] = useState("");
  const [abertos, setAbertos] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    itens.forEach((it) => {
      if (it.filhos && it.abertoInicial !== false) m[it.id] = true;
    });
    return m;
  });
  const painel = useRef<HTMLElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const uid = useId();
  const viva = aberta && !embutida;

  useEffect(() => {
    if (!viva) return;
    const voltarPara = document.activeElement as HTMLElement | null;
    fechar.current?.focus();
    function aoTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        aoFechar?.();
        return;
      }
      if (e.key === "Tab" && painel.current) {
        const f = painel.current.querySelectorAll<HTMLElement>(FOCAVEIS);
        if (!f.length) return;
        const primeiro = f[0];
        const ultimo = f[f.length - 1];
        const ativoAgora = document.activeElement;
        if (e.shiftKey && ativoAgora === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && ativoAgora === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    }
    document.addEventListener("keydown", aoTecla);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTecla);
      document.body.style.overflow = anterior;
      const volta = retornoFoco?.current || voltarPara;
      volta?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viva]);

  if (!aberta && !embutida) return null;

  const nq = normalizar(busca.trim());
  const casa = (it: { rotulo: string; palavrasChave?: string }) => !nq || normalizar(it.rotulo + " " + (it.palavrasChave || "")).includes(nq);

  function ir(id: string, e: MouseEvent, href?: string) {
    if (!href || href === "#") e.preventDefault();
    if (ativo === undefined) setInterno(id);
    aoNavegar?.(id);
    if (fecharAoNavegar && aoFechar && !embutida) aoFechar();
  }

  const linhas: ReactNode[] = [];
  itens.forEach((it) => {
    if (it.filhos) {
      const proprio = casa(it);
      const kids = proprio ? it.filhos : it.filhos.filter(casa);
      if (!proprio && !kids.length) return;
      const expandido = nq ? true : !!abertos[it.id];
      const filhoAtivo = it.filhos.some((c) => c.id === atual);
      const subId = `${uid}-${it.id}`;
      linhas.push(
        <div key={it.id} className="neu-drawer__group">
          <button
            type="button"
            className={`neu-drawer__item${filhoAtivo ? " neu-drawer__item--parent" : ""}`}
            aria-expanded={expandido}
            aria-controls={subId}
            onClick={() => setAbertos({ ...abertos, [it.id]: !abertos[it.id] })}
          >
            {it.icone}
            <span className="neu-drawer__text">{it.rotulo}</span>
            <span className="neu-drawer__chev" aria-hidden="true">
              {expandido ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          </button>
          {expandido && (
            <div id={subId} className="neu-drawer__sub">
              {kids.map((c) => (
                <a key={c.id} href={c.href ?? "#"} className="neu-drawer__subitem" aria-current={atual === c.id ? "page" : undefined} onClick={(e) => ir(c.id, e, c.href)}>
                  {c.rotulo}
                </a>
              ))}
            </div>
          )}
        </div>,
      );
    } else if (casa(it)) {
      const on = atual === it.id;
      linhas.push(
        <a key={it.id} href={it.href ?? "#"} className="neu-drawer__item" aria-current={on ? "page" : undefined} onClick={(e) => ir(it.id, e, it.href)}>
          {it.icone}
          <span className="neu-drawer__text">{it.rotulo}</span>
          {on ? <span className="neu-drawer__led" aria-hidden="true" /> : it.selo ? <span className="neu-badge neu-badge--chip">{it.selo}</span> : null}
        </a>,
      );
    }
  });

  const idTitulo = `${uid}-titulo`;
  const aside = (
    <aside
      ref={painel}
      className={`neu-drawer${embutida ? " neu-drawer--inline" : ""}`}
      data-neu="gaveta"
      role={embutida ? undefined : "dialog"}
      aria-modal={embutida ? undefined : true}
      aria-labelledby={idTitulo}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="neu-drawer__top">
        <div className="neu-drawer__head">
          <div className="neu-drawer__brand">
            <span className="neu-drawer__logo" aria-hidden="true">{logo ?? <Folder size={20} />}</span>
            <div className="neu-drawer__titles">
              <h3 id={idTitulo} className="neu-drawer__title">{titulo}</h3>
              {subtitulo && <p className="neu-drawer__subtitle">{subtitulo}</p>}
            </div>
          </div>
          {aoFechar && (
            <button ref={fechar} type="button" className="neu-drawer__close" aria-label={rotuloFechar} onClick={aoFechar}>
              <X aria-hidden="true" size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
        {buscavel && (
          <label className="neu-drawer__search">
            <Search aria-hidden="true" size={16} />
            <input type="search" value={busca} placeholder={placeholderBusca} aria-label={placeholderBusca.replace(/\.+$/, "")} onChange={(e) => setBusca(e.target.value)} />
          </label>
        )}
        <nav className="neu-drawer__nav" aria-label={rotuloNav}>
          {linhas.length ? linhas : <p className="neu-drawer__empty" role="status">Nenhum item encontrado.</p>}
        </nav>
      </div>
      {(tituloRodape || metaRodape) && (
        <div className="neu-drawer__foot">
          <span className="neu-drawer__org">
            {iniciaisRodape && <span className="neu-drawer__initials" aria-hidden="true">{iniciaisRodape}</span>}
            <b>{tituloRodape}</b>
          </span>
          {metaRodape && <span className="neu-drawer__meta">{metaRodape}</span>}
        </div>
      )}
    </aside>
  );
  if (embutida) return aside;
  return createPortal(
    <div className="neu-drawer-layer" onClick={aoFechar}>
      <div className="neu-backdrop__veil" aria-hidden="true" />
      {aside}
    </div>,
    document.body,
  );
}

const ITENS: ItemGaveta[] = [
  { id: "inicio", rotulo: "Início", icone: <House size={16} />, palavrasChave: "home painel" },
  {
    id: "programas",
    rotulo: "Programas",
    icone: <LayoutGrid size={16} />,
    palavrasChave: "soluções",
    filhos: [
      { id: "empreendedorismo", rotulo: "Empreendedorismo" },
      { id: "inovacao", rotulo: "Inovação" },
      { id: "tecnologia", rotulo: "Tecnologia" },
      { id: "atendimento", rotulo: "Negócio a negócio" },
    ],
  },
  { id: "usuarios", rotulo: "Usuários", icone: <Users size={16} />, palavrasChave: "equipe perfis membros" },
  { id: "parametros", rotulo: "Parâmetros", icone: <Settings size={16} />, palavrasChave: "configurações sistema" },
];

const RODAPE = { titulo: "Sua marca", subtitulo: "Gaveta lateral", iniciaisRodape: "UF", tituloRodape: "MARCA-UF", metaRodape: "2026.03" };

export default function NeumorfismoGavetaLateral() {
  const [aberta, setAberta] = useState(false);
  const [ativo, setAtivo] = useState("inicio");
  const gatilho = useRef<HTMLButtonElement>(null);
  return (
    <ComponentPreview
      title="Sidebar · Gaveta"
      description="A navegação lateral que sai da tela: um painel de 320px que desliza da esquerda sobre um véu desfocado, com busca que filtra itens e subitens, grupos que abrem em subitens e um pé com a organização e a versão."
      whenToUse={["Celular e telas estreitas, onde um menu fixo comeria o conteúdo", "Apps que mostram a navegação só quando o usuário pede", "Muitos itens com subitens, achados rápido pela busca"]}
      whenNotToUse={["Desktop com poucas áreas e navegação sempre à vista: use a Sidebar fixa", "Escolhas rápidas de uma ação: use um menu suspenso", "Conteúdo que o usuário precisa consultar enquanto navega: a gaveta o cobre"]}
      accessibility={[
        "Aberta, é um diálogo modal (role=\"dialog\" com aria-modal) nomeado pelo título; embutida, é um aside comum",
        "O foco vai para a tecla de fechar ao abrir, Tab e Shift+Tab ficam presos dentro da gaveta e, ao fechar, o foco volta a quem a abriu",
        "Esc e o clique no véu fecham; a rolagem da página fica travada enquanto ela está aberta",
        "Os grupos são botões com aria-expanded e aria-controls apontando para a lista de subitens; o item atual leva aria-current=\"page\"",
        "A busca tem nome acessível, ignora caixa e acentos e olha também as palavras-chave; sem resultado, um status diz \"Nenhum item encontrado.\"",
        "O ativo se diferencia por relevo, cor e ponto, não só pela cor; o foco é um anel sólido de 2px; a gaveta só desliza com \"movimento\" permitido",
      ]}
      code={`const [aberta, setAberta] = useState(false);

<Button onClick={() => setAberta(true)}>Abrir gaveta</Button>
<GavetaLateral
  aberta={aberta}
  aoFechar={() => setAberta(false)}
  titulo="Sua marca"
  subtitulo="Gaveta lateral"
  itens={[
    { id: "inicio", rotulo: "Início", icone: <House size={16} /> },
    { id: "programas", rotulo: "Programas", icone: <LayoutGrid size={16} />, filhos: [{ id: "inovacao", rotulo: "Inovação" }] },
  ]}
  ativo={ativo}
  aoNavegar={setAtivo}
  iniciaisRodape="UF"
  tituloRodape="MARCA-UF"
  metaRodape="2026.03"
/>`}
    >
      <div className="neu-row" style={{ alignItems: "stretch", gap: 32, flexWrap: "wrap" }}>
        <div style={{ height: 560, width: 320, maxWidth: "100%", borderRadius: 20, overflow: "hidden", border: "1px solid var(--neu-edge)" }}>
          <GavetaLateral embutida aoFechar={() => {}} itens={ITENS} ativo={ativo} aoNavegar={setAtivo} {...RODAPE} />
        </div>
        <div className="neu-stack" style={{ gap: 12, width: 220, alignItems: "flex-start" }}>
          <Button ref={gatilho} type="button" variant="outline" onClick={() => setAberta(true)}>
            <Menu aria-hidden="true" size={16} /> Abrir gaveta
          </Button>
          <p className="neu-help" style={{ margin: 0 }}>Abre a gaveta real: desliza da esquerda, Esc ou o véu fecham e o foco volta para este botão. A busca filtra itens e subitens.</p>
        </div>
        <GavetaLateral aberta={aberta} aoFechar={() => setAberta(false)} itens={ITENS} ativo={ativo} aoNavegar={setAtivo} retornoFoco={gatilho} {...RODAPE} />
      </div>
    </ComponentPreview>
  );
}
