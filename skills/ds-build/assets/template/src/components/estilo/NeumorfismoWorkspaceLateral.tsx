import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode, type RefObject } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Command,
  CreditCard,
  Download,
  Ellipsis,
  ExternalLink,
  File,
  Gift,
  GripVertical,
  KeyRound,
  Layers,
  LayoutGrid,
  LogOut,
  Mail,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Repeat,
  Search,
  Settings,
  Share2,
  Sparkles,
  SquarePen,
  Star,
  Sun,
  Target,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine da Sidebar de espaço de trabalho no estilo Neumorfismo (variante "workspace" do componente Sidebar do
 * pacote Neumorphic UI v3.2.0): a navegação de um aplicativo, de 256px (ou 60px recolhida), com troca de espaço, busca,
 * seções, aviso e menu do usuário. No topo, o espaço atual (logo em gradiente, nome e membros) abre o menu de troca de
 * conta, e uma tecla convexa compõe algo novo. Abaixo, a busca afundada com a dica ⌘K (que foca o campo), as seções
 * (a primeira sem título; "Favoritos" e "Registros" recolhem e têm uma tecla de adicionar), itens com contador em
 * pílula afundada ou o brilho de IA, e o ativo sobe convexo. No pé, um aviso dispensável com arte isométrica e o
 * usuário (avatar com LED de status), que abre o menu da conta. Recolhida, vira uma coluna de teclas: o logo do
 * espaço, a busca, os itens (contador vira um ponto) com dica ao passar o mouse e ao focar, e o avatar. `MenuContas`
 * e `MenuUsuario` também existem soltos, para mostrar os menus abertos. As setas de seção trocam de ícone (direita ↔
 * baixo) em vez de girar. Entra numa seção nova do neumorfismo ("Sidebar · Workspace", depois do Painel) e só é
 * usado quando ESTILO.id === "neumorfismo". As classes neu-ws* vêm de src/styles/estilo.css.
 */

export type TomEspaco = "ink" | "royal" | "accent" | "success" | "citron";

export interface EspacoTrabalho {
  id: string;
  nome: string;
  iniciais?: string;
  logo?: ReactNode;
  tom?: TomEspaco;
  /** "21 membros" */
  meta?: string;
  /** "⌘1", mostrado no menu de troca */
  atalho?: string;
}

export interface ItemWorkspace {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  /** Contador de novidades; recolhido, vira um ponto */
  contagem?: number;
  /** Mostra o brilho de recurso com IA */
  ia?: boolean;
  href?: string;
  palavrasChave?: string;
}

export interface SecaoWorkspace {
  id: string;
  titulo?: string;
  aoAdicionar?: () => void;
  rotuloAdicionar?: string;
  /** Falso começa a seção fechada */
  abertaInicial?: boolean;
  itens: ItemWorkspace[];
}

export interface UsuarioWorkspace {
  nome: string;
  email?: string;
  iniciais?: string;
  avatar?: string;
  status?: "online" | "away";
  rotuloStatus?: string;
}

export interface ItemMenuUsuario {
  id?: string;
  rotulo: string;
  icone?: ReactNode;
  atalho?: string;
  /** Abre um submenu (mostra a seta) */
  submenu?: boolean;
  badge?: string;
  /** Abre em nova aba (mostra a seta de saída e avisa os leitores de tela) */
  externo?: boolean;
  perigo?: boolean;
  aoSelecionar?: () => void;
}

export interface AvisoWorkspace {
  titulo: string;
  texto: string;
  rotuloAcao?: string;
  aoAcao?: () => void;
  aoDispensar?: () => void;
}

function normalizar(t: string) {
  return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function Tecla({ children }: { children: ReactNode }) {
  return <kbd className="neu-kbd">{children}</kbd>;
}

function LogoEspaco({ espaco, pequeno }: { espaco: Partial<EspacoTrabalho>; pequeno?: boolean }) {
  return (
    <span className={`neu-ws-logo neu-ws-logo--${espaco.tom ?? "ink"}${pequeno ? " neu-ws-logo--sm" : ""}`} aria-hidden="true">
      {espaco.logo ?? espaco.iniciais ?? (espaco.nome || "?").charAt(0)}
    </span>
  );
}

function AvatarUsuario({ usuario }: { usuario?: UsuarioWorkspace }) {
  const u = usuario ?? { nome: "" };
  const ini = u.iniciais || (u.nome || "?").split(/\s+/).map((w) => w.charAt(0)).slice(0, 2).join("");
  return (
    <span className="neu-ws-avatar" aria-hidden="true">
      {u.avatar ? <img src={u.avatar} alt="" /> : ini}
      {u.status && <span className={`neu-ws-avatar__status neu-ws-avatar__status--${u.status}`} />}
    </span>
  );
}

/** Setas, Home, End, Esc (volta o foco ao gatilho) e Tab (fecha) dentro de um menu */
function teclasDoMenu(menu: RefObject<HTMLDivElement | null>, fechar?: () => void, gatilho?: RefObject<HTMLElement | null>) {
  return (e: KeyboardEvent) => {
    const a = menu.current ? Array.from(menu.current.querySelectorAll<HTMLElement>("[role^=menuitem]")) : [];
    const i = a.indexOf(document.activeElement as HTMLElement);
    const ir = (n: number) => {
      if (a.length) a[(n + a.length) % a.length].focus();
    };
    if (e.key === "ArrowDown") {
      e.preventDefault();
      ir(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      ir(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      ir(0);
    } else if (e.key === "End") {
      e.preventDefault();
      ir(-1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      fechar?.();
      gatilho?.current?.focus();
    } else if (e.key === "Tab" && fechar) fechar();
  };
}

function useFora(ref: RefObject<HTMLElement | null>, ativo: boolean, fechar: () => void) {
  useEffect(() => {
    if (!ativo) return;
    function aoClicar(e: MouseEvent | globalThis.MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) fechar();
    }
    document.addEventListener("mousedown", aoClicar);
    return () => document.removeEventListener("mousedown", aoClicar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo]);
}

interface MenuContasProps {
  email?: string;
  espacos: EspacoTrabalho[];
  ativo?: string;
  aoSelecionar?: (id: string) => void;
  /** Falso esconde a linha "Nova conta" */
  novaConta?: boolean;
  aoNovaConta?: () => void;
  rotuloNovaConta?: string;
  atalhoNovaConta?: string;
  /** Posiciona o menu sobre a barra (usado pela barra); solto, ele é um bloco comum */
  flutuante?: boolean;
  focoAutomatico?: boolean;
  className?: string;
  aoFechar?: () => void;
  refGatilho?: RefObject<HTMLElement | null>;
  rotulo?: string;
}

export function MenuContas({ email, espacos, ativo, aoSelecionar, novaConta = true, aoNovaConta, rotuloNovaConta = "Nova conta", atalhoNovaConta, flutuante, focoAutomatico, className, aoFechar, refGatilho, rotulo = "Trocar conta" }: MenuContasProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focoAutomatico && ref.current) {
      const f = ref.current.querySelector<HTMLElement>("[aria-checked=true]") || ref.current.querySelector<HTMLElement>("[role^=menuitem]");
      f?.focus();
    }
  }, [focoAutomatico]);
  return (
    <div ref={ref} data-neu="menu-workspace" className={["neu-ws-menu", flutuante && "neu-ws-menu--float", className].filter(Boolean).join(" ")} role="menu" aria-label={rotulo} onKeyDown={teclasDoMenu(ref, aoFechar, refGatilho)}>
      <div className="neu-ws-menu__top">
        <span className="neu-ws-menu__email">{email}</span>
        <Repeat aria-hidden="true" size={14} />
      </div>
      <div className="neu-ws-menu__group">
        {espacos.map((w) => {
          const on = w.id === ativo;
          return (
            <button
              key={w.id}
              type="button"
              role="menuitemradio"
              aria-checked={on}
              tabIndex={-1}
              className="neu-ws-menu__item neu-ws-menu__item--ws"
              onClick={() => {
                aoSelecionar?.(w.id);
                aoFechar?.();
              }}
            >
              <span className="neu-ws-menu__grip" aria-hidden="true"><GripVertical size={14} /></span>
              <LogoEspaco espaco={w} />
              <span className="neu-ws-menu__label">{w.nome}</span>
              {on ? <span className="neu-ws-menu__check"><Check aria-hidden="true" size={16} strokeWidth={2.5} /></span> : w.atalho ? <Tecla>{w.atalho}</Tecla> : null}
            </button>
          );
        })}
      </div>
      {novaConta && (
        <div className="neu-ws-menu__group">
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="neu-ws-menu__item neu-ws-menu__item--muted"
            onClick={() => {
              aoNovaConta?.();
              aoFechar?.();
            }}
          >
            <Plus aria-hidden="true" size={16} />
            <span className="neu-ws-menu__label">{rotuloNovaConta}</span>
            {atalhoNovaConta && <Tecla>{atalhoNovaConta}</Tecla>}
          </button>
        </div>
      )}
    </div>
  );
}

interface MenuUsuarioProps {
  usuario: UsuarioWorkspace;
  grupos: ItemMenuUsuario[][];
  flutuante?: boolean;
  focoAutomatico?: boolean;
  className?: string;
  aoFechar?: () => void;
  refGatilho?: RefObject<HTMLElement | null>;
  rotulo?: string;
}

export function MenuUsuario({ usuario, grupos, flutuante, focoAutomatico, className, aoFechar, refGatilho, rotulo = "Menu da conta" }: MenuUsuarioProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focoAutomatico && ref.current) ref.current.querySelector<HTMLElement>("[role^=menuitem]")?.focus();
  }, [focoAutomatico]);
  return (
    <div ref={ref} data-neu="menu-workspace" className={["neu-ws-menu", flutuante && "neu-ws-menu--float", className].filter(Boolean).join(" ")} role="menu" aria-label={rotulo} onKeyDown={teclasDoMenu(ref, aoFechar, refGatilho)}>
      <div className="neu-ws-menu__user">
        <AvatarUsuario usuario={usuario} />
        <span>
          <b>{usuario.nome}</b>
          <small>{usuario.rotuloStatus || (usuario.status === "online" ? "Online" : usuario.status === "away" ? "Ausente" : "")}</small>
        </span>
      </div>
      {grupos.map((g, gi) => (
        <div key={gi} className="neu-ws-menu__group">
          {g.map((it) => (
            <button
              key={it.id || it.rotulo}
              type="button"
              role="menuitem"
              tabIndex={-1}
              aria-haspopup={it.submenu ? "menu" : undefined}
              className={`neu-ws-menu__item${it.perigo ? " neu-ws-menu__item--danger" : ""}`}
              onClick={() => {
                it.aoSelecionar?.();
                if (!it.submenu) aoFechar?.();
              }}
            >
              {it.icone}
              <span className="neu-ws-menu__label">
                {it.rotulo}
                {it.externo && <span className="sr-only"> (abre em nova aba)</span>}
              </span>
              {it.badge && <span className="neu-ws-badge">{it.badge}</span>}
              {it.atalho && <Tecla>{it.atalho}</Tecla>}
              {it.submenu && <span className="neu-ws-menu__trail" aria-hidden="true"><ChevronRight size={16} /></span>}
              {it.externo && <span className="neu-ws-menu__trail" aria-hidden="true"><ExternalLink size={14} /></span>}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

interface WorkspaceLateralProps {
  espacos: EspacoTrabalho[];
  espacoAtivo?: string;
  espacoInicial?: string;
  aoTrocarEspaco?: (id: string) => void;
  emailConta?: string;
  aoNovaConta?: () => void;
  atalhoNovaConta?: string;
  aoCompor?: () => void;
  rotuloCompor?: string;
  buscavel?: boolean;
  placeholderBusca?: string;
  /** Dica visual do atalho de busca ("⌘K") */
  atalhoBusca?: string;
  /** Ctrl/⌘ + K foca o campo de busca (desligue se a página já usa esse atalho) */
  focarComAtalho?: boolean;
  /** Recolhido: o botão de busca chama isto */
  aoBuscar?: () => void;
  secoes: SecaoWorkspace[];
  ativo?: string;
  ativoInicial?: string;
  aoNavegar?: (id: string) => void;
  aviso?: AvisoWorkspace;
  usuario: UsuarioWorkspace;
  menuUsuario?: ItemMenuUsuario[][];
  /** Controla o recolhimento de fora; sem ele, a barra guarda o próprio estado */
  recolhido?: boolean;
  recolhidoInicial?: boolean;
  aoAlterarRecolhido?: (recolhido: boolean) => void;
  /** Mostra a tecla que recolhe e expande a barra (sem ela, a barra só recebe o estado de fora) */
  recolhivel?: boolean;
  rotulo?: string;
}

export function WorkspaceLateral({
  espacos,
  espacoAtivo,
  espacoInicial,
  aoTrocarEspaco,
  emailConta,
  aoNovaConta,
  atalhoNovaConta,
  aoCompor,
  rotuloCompor = "Novo",
  buscavel = true,
  placeholderBusca = "Buscar",
  atalhoBusca,
  focarComAtalho = true,
  aoBuscar,
  secoes,
  ativo,
  ativoInicial,
  aoNavegar,
  aviso,
  usuario,
  menuUsuario = [],
  recolhido: recolhidoControlado,
  recolhidoInicial = false,
  aoAlterarRecolhido,
  recolhivel = false,
  rotulo = "Navegação principal",
}: WorkspaceLateralProps) {
  const [recolhidoInterno, setRecolhidoInterno] = useState(recolhidoInicial);
  const recolhido = recolhidoControlado ?? recolhidoInterno;
  const [ativoInterno, setAtivoInterno] = useState(ativoInicial);
  const atual = ativo ?? ativoInterno;
  const [espacoInterno, setEspacoInterno] = useState(espacoInicial ?? espacos[0]?.id);
  const espaco = espacoAtivo ?? espacoInterno;
  const [busca, setBusca] = useState("");
  const [abertas, setAbertas] = useState<Record<string, boolean>>(() => Object.fromEntries(secoes.map((s) => [s.id, s.abertaInicial !== false])));
  const [avisoFora, setAvisoFora] = useState(false);
  const [contas, setContas] = useState(false);
  const [conta, setConta] = useState(false);
  const refContas = useRef<HTMLDivElement>(null);
  const refConta = useRef<HTMLDivElement>(null);
  const gatilhoContas = useRef<HTMLButtonElement>(null);
  const gatilhoConta = useRef<HTMLButtonElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const tecla = useRef<HTMLButtonElement>(null);
  const querFoco = useRef<"campo" | "tecla" | null>(null);
  const uid = useId();
  useFora(refContas, contas, () => setContas(false));
  useFora(refConta, conta, () => setConta(false));

  useEffect(() => {
    if (recolhido || !buscavel || !focarComAtalho) return;
    function aoTecla(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        campo.current?.focus();
      }
    }
    document.addEventListener("keydown", aoTecla);
    return () => document.removeEventListener("keydown", aoTecla);
  }, [recolhido, buscavel, focarComAtalho]);

  // a tecla de recolher muda de lugar (cabeçalho ↔ pé) e a busca troca de forma: o foco segue quem o pediu
  useEffect(() => {
    const alvo = querFoco.current;
    if (!alvo) return;
    querFoco.current = null;
    (alvo === "campo" ? campo.current : tecla.current)?.focus();
  }, [recolhido]);

  function alternar(foco: "campo" | "tecla") {
    querFoco.current = foco;
    setContas(false);
    setConta(false);
    if (recolhidoControlado === undefined) setRecolhidoInterno(!recolhido);
    aoAlterarRecolhido?.(!recolhido);
  }

  const botaoRecolher = recolhivel ? (
    <button ref={tecla} type="button" className="neu-ws-key" aria-label={recolhido ? "Expandir menu" : "Recolher menu"} aria-expanded={!recolhido} onClick={() => alternar("tecla")}>
      {recolhido ? <PanelLeftOpen aria-hidden="true" size={16} /> : <PanelLeftClose aria-hidden="true" size={16} />}
      {recolhido && <span className="neu-rail__tip" aria-hidden="true">Expandir menu</span>}
    </button>
  ) : null;

  const atualEspaco = espacos.find((w) => w.id === espaco) ?? espacos[0] ?? ({ id: "", nome: "" } as EspacoTrabalho);
  const nq = recolhido ? "" : normalizar(busca.trim());

  function trocar(id: string) {
    if (espacoAtivo === undefined) setEspacoInterno(id);
    aoTrocarEspaco?.(id);
  }

  function ir(id: string, e: MouseEvent, href?: string) {
    if (!href || href === "#") e.preventDefault();
    if (ativo === undefined) setAtivoInterno(id);
    aoNavegar?.(id);
  }

  function item(it: ItemWorkspace) {
    const on = atual === it.id;
    const nome = it.rotulo + (it.contagem != null ? `, ${it.contagem} novas` : "") + (it.ia ? ", com IA" : "");
    return (
      <a key={it.id} href={it.href ?? "#"} className="neu-ws-item" aria-current={on ? "page" : undefined} aria-label={recolhido ? nome : undefined} onClick={(e) => ir(it.id, e, it.href)}>
        {it.icone}
        {!recolhido && <span className="neu-ws-item__text">{it.rotulo}</span>}
        {recolhido ? (
          it.contagem != null ? <span className="neu-ws-item__pip" aria-hidden="true" /> : null
        ) : it.contagem != null ? (
          <span className="neu-ws-count" aria-label={`${it.contagem} novas`}>{it.contagem}</span>
        ) : it.ia ? (
          <span className="neu-ws-ai" title="Recurso com IA">
            <Sparkles aria-hidden="true" size={14} />
            <span className="sr-only">com IA</span>
          </span>
        ) : null}
        {recolhido && <span className="neu-rail__tip" aria-hidden="true">{it.rotulo}</span>}
      </a>
    );
  }

  const blocos = secoes.map((s, i) => {
    const itens = s.itens.filter((it) => !nq || normalizar(it.rotulo + " " + (it.palavrasChave || "")).includes(nq));
    if (nq && !itens.length) return null;
    const aberta = nq ? true : !!abertas[s.id];
    const listaId = `${uid}-sec-${s.id}`;
    if (recolhido) {
      return (
        <div key={s.id} className="neu-ws-section">
          {i > 0 && <span className="neu-ws-sep" aria-hidden="true"><Ellipsis size={14} /></span>}
          {itens.map(item)}
        </div>
      );
    }
    return (
      <div key={s.id} className="neu-ws-section">
        {s.titulo && (
          <div className="neu-ws-section__head">
            <button type="button" className="neu-ws-section__toggle" aria-expanded={aberta} aria-controls={listaId} onClick={() => setAbertas({ ...abertas, [s.id]: !abertas[s.id] })}>
              <span className="neu-ws-section__chev" aria-hidden="true">{aberta ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
              {s.titulo}
            </button>
            {s.aoAdicionar && (
              <button type="button" className="neu-ws-mini" aria-label={s.rotuloAdicionar || `Adicionar em ${s.titulo}`} onClick={s.aoAdicionar}>
                <Plus aria-hidden="true" size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
        {aberta && <div id={listaId} className="neu-ws-section__items">{itens.map(item)}</div>}
      </div>
    );
  });

  return (
    <aside className={`neu-ws${recolhido ? " neu-ws--collapsed" : ""}`} data-neu="workspace" aria-label={rotulo}>
      <div className="neu-ws__head" ref={refContas}>
        {recolhido ? (
          <button ref={gatilhoContas} type="button" className="neu-ws__logo-key" aria-haspopup="menu" aria-expanded={contas} aria-label={`Espaço de trabalho: ${atualEspaco.nome}. Trocar conta`} onClick={() => setContas(!contas)}>
            <LogoEspaco espaco={atualEspaco} />
          </button>
        ) : (
          <>
            <button ref={gatilhoContas} type="button" className="neu-ws__switch" aria-haspopup="menu" aria-expanded={contas} onClick={() => setContas(!contas)}>
              <LogoEspaco espaco={atualEspaco} />
              <span className="neu-ws__name">
                <b>{atualEspaco.nome}<ChevronDown aria-hidden="true" size={14} /></b>
                {atualEspaco.meta && <small><Users aria-hidden="true" size={12} />{atualEspaco.meta}</small>}
              </span>
            </button>
            {aoCompor && (
              <button type="button" className="neu-ws-key" aria-label={rotuloCompor} title={rotuloCompor} onClick={aoCompor}>
                <SquarePen aria-hidden="true" size={16} />
              </button>
            )}
            {botaoRecolher}
          </>
        )}
        {contas && (
          <MenuContas
            flutuante
            focoAutomatico
            className="neu-ws-menu--down"
            email={emailConta ?? usuario.email}
            espacos={espacos}
            ativo={espaco}
            aoSelecionar={trocar}
            aoNovaConta={aoNovaConta}
            atalhoNovaConta={atalhoNovaConta}
            aoFechar={() => setContas(false)}
            refGatilho={gatilhoContas}
          />
        )}
      </div>
      <div className="neu-ws__body">
        {buscavel &&
          (recolhido ? (
            <button type="button" className="neu-ws-item neu-ws-item--search" aria-label={placeholderBusca} onClick={aoBuscar ?? (recolhivel ? () => alternar("campo") : undefined)}>
              <Search aria-hidden="true" size={16} />
              <span className="neu-rail__tip" aria-hidden="true">{placeholderBusca}</span>
            </button>
          ) : (
            <label className="neu-ws-search">
              <Search aria-hidden="true" size={16} />
              <input ref={campo} type="search" value={busca} placeholder={placeholderBusca} aria-label={placeholderBusca} aria-keyshortcuts="Control+K Meta+K" onChange={(e) => setBusca(e.target.value)} />
              {atalhoBusca && <Tecla>{atalhoBusca}</Tecla>}
            </label>
          ))}
        <nav className="neu-ws__nav">
          {blocos}
          {nq && !blocos.some(Boolean) && <p className="neu-ws__empty" role="status">Nenhum item encontrado.</p>}
        </nav>
      </div>
      <div className="neu-ws__foot">
        {aviso && !avisoFora && !recolhido && (
          <div className="neu-ws-notice" role="status">
            <div className="neu-ws-notice__head">
              <b>{aviso.titulo}</b>
              <button
                type="button"
                className="neu-ws-notice__close"
                aria-label="Dispensar aviso"
                onClick={() => {
                  setAvisoFora(true);
                  aviso.aoDispensar?.();
                }}
              >
                <X aria-hidden="true" size={12} strokeWidth={2.5} />
              </button>
            </div>
            <p>{aviso.texto}</p>
            {aviso.rotuloAcao && (
              <button type="button" className="neu-ws-notice__action" onClick={aviso.aoAcao}>
                {aviso.rotuloAcao}
                <ArrowRight aria-hidden="true" size={14} />
              </button>
            )}
            <svg className="neu-ws-notice__art" viewBox="0 0 96 56" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1} strokeLinejoin="round">
              <path d="M48 4 70 16 48 28 26 16Z M26 16v20l22 12V28 M70 16v20L48 48 M48 28l22-12 M70 36l22-12V4L70 16 M92 24 70 36 M26 36 4 24V4l22 12 M4 4l22-12 22 8" />
            </svg>
          </div>
        )}
        {recolhido && botaoRecolher}
        <div className="neu-ws__user" ref={refConta}>
          {recolhido ? (
            <button ref={gatilhoConta} type="button" className="neu-ws__avatar-key" aria-haspopup="menu" aria-expanded={conta} aria-label={`Conta de ${usuario.nome}`} onClick={() => setConta(!conta)}>
              <AvatarUsuario usuario={usuario} />
            </button>
          ) : (
            <button ref={gatilhoConta} type="button" className="neu-ws__me" aria-haspopup="menu" aria-expanded={conta} onClick={() => setConta(!conta)}>
              <AvatarUsuario usuario={usuario} />
              <span className="neu-ws__name">
                <b>{usuario.nome}<ChevronDown aria-hidden="true" size={14} /></b>
                <small>{usuario.email}</small>
              </span>
              <span className="neu-ws__more" aria-hidden="true"><Ellipsis size={16} /></span>
            </button>
          )}
          {conta && <MenuUsuario flutuante focoAutomatico className="neu-ws-menu--up" usuario={usuario} grupos={menuUsuario} aoFechar={() => setConta(false)} refGatilho={gatilhoConta} />}
        </div>
      </div>
    </aside>
  );
}

const ESPACOS: EspacoTrabalho[] = [
  { id: "marca", nome: "Sua marca", iniciais: "SM", tom: "ink", meta: "21 membros" },
  { id: "lab", nome: "Inovação Lab", iniciais: "IL", tom: "royal", meta: "8 membros", atalho: "⌘1" },
  { id: "rede", nome: "Rede Parceira", iniciais: "RP", tom: "accent", meta: "12 membros", atalho: "⌘2" },
  { id: "nucleo", nome: "Núcleo Digital", iniciais: "ND", tom: "citron", meta: "5 membros", atalho: "⌘3" },
];

const USUARIO: UsuarioWorkspace = { nome: "Ana Souza", email: "ana.souza@exemplo.com", iniciais: "AS", status: "online" };

const SECOES: SecaoWorkspace[] = [
  {
    id: "main",
    itens: [
      { id: "painel", rotulo: "Painel", icone: <LayoutGrid size={16} /> },
      { id: "mensagens", rotulo: "Mensagens", icone: <MessageSquare size={16} />, contagem: 16 },
      { id: "tarefas", rotulo: "Tarefas", icone: <CircleCheck size={16} /> },
      { id: "notas", rotulo: "Notas", icone: <File size={16} /> },
      { id: "emails", rotulo: "E-mails", icone: <Mail size={16} /> },
      { id: "relatorios", rotulo: "Relatórios", icone: <Layers size={16} /> },
      { id: "automacoes", rotulo: "Automações", icone: <Zap size={16} />, ia: true },
      { id: "fluxos", rotulo: "Fluxos de trabalho", icone: <Share2 size={16} />, ia: true },
    ],
  },
  {
    id: "fav",
    titulo: "Favoritos",
    aoAdicionar: () => {},
    itens: [
      { id: "contas", rotulo: "Contas-chave", icone: <KeyRound size={16} /> },
      { id: "iniciativas", rotulo: "Iniciativas estratégicas", icone: <BarChart3 size={16} /> },
      { id: "foco", rotulo: "Áreas de foco", icone: <Target size={16} /> },
      { id: "marcados", rotulo: "Itens marcados", icone: <Star size={16} /> },
    ],
  },
  {
    id: "reg",
    titulo: "Registros",
    aoAdicionar: () => {},
    itens: [
      { id: "empresas", rotulo: "Empresas", icone: <Building2 size={16} /> },
      { id: "pessoas", rotulo: "Pessoas", icone: <Users size={16} /> },
    ],
  },
];

const AVISO: AvisoWorkspace = { titulo: "Nova versão disponível", texto: "Uma versão melhorada do app está disponível. Reinicie agora para atualizar.", rotuloAcao: "Atualizar", aoAcao: () => {} };

const MENU_USUARIO: ItemMenuUsuario[][] = [
  [
    { rotulo: "Temas", icone: <Sun size={16} />, atalho: "⌘T" },
    { rotulo: "Configurações", icone: <Settings size={16} />, atalho: "⌘S" },
    { rotulo: "Notificações", icone: <Bell size={16} />, atalho: "⌘N" },
  ],
  [
    { rotulo: "Atalhos", icone: <Command size={16} />, submenu: true },
    { rotulo: "Baixar apps", icone: <Download size={16} />, submenu: true },
    { rotulo: "Indicações", icone: <Gift size={16} />, badge: "Novo" },
    { rotulo: "Planos", icone: <CreditCard size={16} />, externo: true },
    { rotulo: "Ajuda", icone: <CircleHelp size={16} />, externo: true },
  ],
  [
    { rotulo: "Lixeira", icone: <Trash2 size={16} /> },
    { rotulo: "Sair", icone: <LogOut size={16} />, perigo: true },
  ],
];

export default function NeumorfismoWorkspaceLateral() {
  const [ativo, setAtivo] = useState("empresas");
  const [espaco, setEspaco] = useState("marca");
  const [fechada, setFechada] = useState(false);
  const base = {
    espacos: ESPACOS,
    espacoAtivo: espaco,
    aoTrocarEspaco: setEspaco,
    emailConta: "ana.souza@exemplo.com",
    aoNovaConta: () => {},
    atalhoNovaConta: "⌘A",
    aoCompor: () => {},
    rotuloCompor: "Nova mensagem",
    placeholderBusca: "Buscar",
    atalhoBusca: "⌘K",
    focarComAtalho: false,
    secoes: SECOES,
    ativo,
    aoNavegar: setAtivo,
    aviso: AVISO,
    usuario: USUARIO,
    menuUsuario: MENU_USUARIO,
  };
  return (
    <ComponentPreview
      title="Sidebar · Workspace"
      description="A navegação de um aplicativo com espaços de trabalho: troca de conta no topo, busca, seções que recolhem, contadores e brilho de IA, um aviso dispensável e o usuário no pé, com os menus de conta e de usuário. Existe também recolhida, em coluna de teclas com dica, e numa versão recolhível, com a tecla que expande e recolhe a barra."
      whenToUse={["Aplicativos com vários espaços ou contas, onde o usuário alterna entre eles sempre", "Ferramentas de trabalho com seções, favoritos e registros", "Quando o perfil e as configurações da conta devem ficar sempre à mão no pé"]}
      whenNotToUse={["Sites e portais públicos: use o NavigationMenu", "Aplicações simples com poucas áreas: use a Sidebar fixa ou o painel", "Celular: use a gaveta"]}
      accessibility={[
        "A barra é um aside com nome; o espaço atual e o usuário são botões com aria-haspopup=\"menu\" e aria-expanded",
        "Os menus têm role=\"menu\"; as contas são menuitemradio com aria-checked e os demais, menuitem; setas, Home e End percorrem, Esc fecha e devolve o foco ao botão que abriu, Tab fecha e o clique fora também",
        "Itens externos avisam \"(abre em nova aba)\" só para leitores de tela; os de submenu levam aria-haspopup=\"menu\"",
        "As seções são botões com aria-expanded e aria-controls; o contador e o brilho de IA têm texto para leitor de tela (\"16 novas\", \"com IA\")",
        "Recolhida, cada item leva o nome, o contador e \"com IA\" em aria-label e o mostra numa dica ao passar o mouse e ao focar pelo teclado",
        "Na versão recolhível, a tecla tem nome (\"Recolher menu\" / \"Expandir menu\") e aria-expanded; ela muda de lugar (cabeçalho ↔ pé) e o foco a acompanha; os menus abertos fecham ao alternar, e a tecla de busca da barra recolhida a expande e leva o foco ao campo",
        "O aviso é um status com tecla de dispensar nomeada; a busca ignora caixa e acentos, e Ctrl/⌘ + K foca o campo quando ligado (aqui desligado, pois a página já usa esse atalho na paleta de comandos)",
      ]}
      code={`<WorkspaceLateral
  espacos={[{ id: "marca", nome: "Sua marca", iniciais: "SM", tom: "ink", meta: "21 membros" }]}
  espacoInicial="marca"
  emailConta="ana.souza@exemplo.com"
  atalhoBusca="⌘K"
  secoes={[{ id: "main", itens: [{ id: "painel", rotulo: "Painel", icone: <LayoutGrid size={16} /> }, { id: "mensagens", rotulo: "Mensagens", icone: <MessageSquare size={16} />, contagem: 16 }] }]}
  ativoInicial="painel"
  aviso={{ titulo: "Nova versão disponível", texto: "Reinicie agora para atualizar.", rotuloAcao: "Atualizar" }}
  usuario={{ nome: "Ana Souza", email: "ana.souza@exemplo.com", status: "online" }}
  menuUsuario={[[{ rotulo: "Configurações", icone: <Settings size={16} />, atalho: "⌘S" }], [{ rotulo: "Sair", icone: <LogOut size={16} />, perigo: true }]]}
/>
<WorkspaceLateral {...props} recolhido />
<WorkspaceLateral {...props} recolhivel recolhidoInicial={false} aoAlterarRecolhido={setFechada} />`}
    >
      <div className="neu-stack" style={{ gap: 12 }}>
        <p className="neu-help" style={{ margin: 0 }}>Espaço de trabalho: clique no nome para trocar de conta e no seu perfil para abrir o menu da conta. No trilho recolhido, passe o mouse nos ícones.</p>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ height: 880 }}><WorkspaceLateral {...base} recolhido /></div>
          <div style={{ height: 880 }}><WorkspaceLateral {...base} /></div>
          <div className="neu-stack" style={{ gap: 24 }}>
            <MenuContas email={base.emailConta} espacos={ESPACOS} ativo={espaco} aoSelecionar={setEspaco} aoNovaConta={() => {}} atalhoNovaConta="⌘A" />
            <MenuUsuario usuario={USUARIO} grupos={MENU_USUARIO} />
          </div>
        </div>
        <p className="neu-cap" style={{ margin: "12px 0 0" }}>Recolhível: use a tecla do cabeçalho (ou a do pé, recolhida) para expandir e recolher</p>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ height: 880 }}><WorkspaceLateral {...base} recolhivel aoAlterarRecolhido={setFechada} /></div>
          <p className="neu-help" style={{ margin: 0, maxWidth: 260 }}>{fechada ? "Recolhida: 60px, só teclas com dica. A lupa expande a barra e põe o foco na busca." : "Expandida: 256px, com busca, seções, aviso e usuário."}</p>
        </div>
      </div>
    </ComponentPreview>
  );
}
