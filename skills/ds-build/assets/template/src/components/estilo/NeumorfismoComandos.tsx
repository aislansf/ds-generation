import { Fragment, cloneElement, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { Calculator, Calendar, CreditCard, Search, Settings, Smile, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Command no estilo Neumorfismo (componente Command do pacote Neumorphic UI v3.2.0): uma lista de
 * ações pesquisável. Um campo de busca num poço afundado, grupos com título em caixa-alta, atalhos como teclas
 * convexas (`neu-kbd`, o mesmo do Questionário) e um rodapé com as dicas de teclado. O item ativo sobe como
 * uma linha convexa. `PaletaComandos` põe a mesma lista num diálogo modal que abre com Ctrl/⌘ + K, fecha ao
 * escolher um item, com Esc e com o clique fora. A busca ignora caixa e acentos e olha também as palavras-chave
 * ("pag" acha "Faturamento"). O campo é um combobox que controla um listbox; a opção ativa é anunciada por
 * aria-activedescendant; ↑/↓ pulam os desativados e dão a volta; Enter executa; Home/End vão às pontas com o
 * campo vazio; o vazio é um status. Entra numa seção nova do neumorfismo ("Command", depois do Collapsible) e só
 * é usado quando ESTILO.id === "neumorfismo". As classes neu-command* vêm de src/styles/estilo.css.
 */

export interface ItemComando {
  rotulo: string;
  icone?: ReactNode;
  /** "⌘P" ou "Ctrl+K" ou uma lista de teclas */
  atalho?: string | string[];
  desabilitado?: boolean;
  /** Termos extras que a busca também olha */
  palavrasChave?: string;
  aoSelecionar?: (item: ItemComando) => void;
}

export interface GrupoComando {
  titulo?: string;
  itens: ItemComando[];
}

interface ComandoProps {
  grupos: GrupoComando[];
  aoSelecionar?: (item: ItemComando) => void;
  /** Nome acessível do campo de busca */
  rotulo?: string;
  placeholder?: string;
  textoVazio?: string;
  rotuloLista?: string;
  /** Altura máxima da lista, em px */
  altura?: number;
  /** Falso esconde as dicas de teclado */
  rodape?: boolean;
  autoFoco?: boolean;
  /** Dentro do diálogo: o rodapé também mostra Esc */
  emDialogo?: boolean;
}

const FOCAVEIS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function normaliza(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function teclasDe(atalho: string | string[]) {
  if (Array.isArray(atalho)) return atalho;
  return atalho.length <= 3 && !atalho.includes("+") ? Array.from(atalho) : atalho.split("+");
}

export function GrupoTeclas({ atalho }: { atalho: string | string[] }) {
  return (
    <span className="neu-kbd-group">
      {teclasDe(atalho).map((t, i) => (
        <kbd key={i} className="neu-kbd">{t}</kbd>
      ))}
    </span>
  );
}

export function Comando({ grupos, aoSelecionar, rotulo = "Buscar comando", placeholder = "Digite um comando ou pesquise…", textoVazio = "Nenhum resultado encontrado.", rotuloLista = "Sugestões", altura, rodape = true, autoFoco = false, emDialogo = false }: ComandoProps) {
  const [busca, setBusca] = useState("");
  const [ativo, setAtivo] = useState(0);
  const uid = useId();
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const nq = normaliza(busca).trim();

  const filtrados = grupos
    .map((g) => ({ titulo: g.titulo, itens: g.itens.filter((it) => !nq || normaliza(`${it.rotulo} ${it.palavrasChave ?? ""}`).includes(nq)) }))
    .filter((g) => g.itens.length > 0);
  const plano = filtrados.flatMap((g) => g.itens);
  const habilitados = plano.map((it, i) => (it.desabilitado ? -1 : i)).filter((i) => i >= 0);
  const atual = habilitados.includes(ativo) ? ativo : habilitados[0] ?? -1;

  useEffect(() => {
    setAtivo(habilitados[0] ?? -1);
    // só a busca reinicia a posição
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nq]);
  useEffect(() => {
    if (autoFoco) campo.current?.focus();
  }, [autoFoco]);
  useEffect(() => {
    lista.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView?.({ block: "nearest" });
  }, [atual]);

  function mover(d: number) {
    if (!habilitados.length) return;
    let k = habilitados.indexOf(atual);
    k = k < 0 ? 0 : (k + d + habilitados.length) % habilitados.length;
    setAtivo(habilitados[k]);
  }
  function executar(it?: ItemComando) {
    if (!it || it.desabilitado) return;
    it.aoSelecionar?.(it);
    aoSelecionar?.(it);
  }
  function aoTeclar(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      mover(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      mover(-1);
    } else if (e.key === "Home" && !busca) {
      e.preventDefault();
      setAtivo(habilitados[0]);
    } else if (e.key === "End" && !busca) {
      e.preventDefault();
      setAtivo(habilitados[habilitados.length - 1]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      executar(plano[atual]);
    }
  }

  let idx = -1;
  return (
    <div className="neu-command">
      <div className="neu-command__search">
        <Search aria-hidden="true" size={16} />
        <input data-ds="input"
          ref={campo}
          className="neu-command__input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${uid}-l`}
          aria-autocomplete="list"
          aria-activedescendant={atual >= 0 ? `${uid}-o${atual}` : undefined}
          aria-label={rotulo}
          placeholder={placeholder}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={aoTeclar}
          autoComplete="off"
          spellCheck={false}
        />
        {busca && (
          <button type="button" className="neu-command__clear" aria-label="Limpar busca" onClick={() => { setBusca(""); campo.current?.focus(); }}>
            <X aria-hidden="true" size={14} />
          </button>
        )}
      </div>
      <div ref={lista} id={`${uid}-l`} className="neu-command__list" role="listbox" aria-label={rotuloLista} style={altura ? { maxHeight: altura } : undefined}>
        {filtrados.length ? (
          filtrados.map((g, gi) => (
            <Fragment key={g.titulo ?? gi}>
              {gi > 0 && <div className="neu-command__sep" role="separator" />}
              <div role="group" aria-labelledby={g.titulo ? `${uid}-g${gi}` : undefined} className="neu-command__group">
                {g.titulo && <div id={`${uid}-g${gi}`} className="neu-command__heading" role="presentation">{g.titulo}</div>}
                {g.itens.map((it) => {
                  idx++;
                  const i = idx;
                  return (
                    <div
                      key={it.rotulo}
                      id={`${uid}-o${i}`}
                      role="option"
                      aria-selected={i === atual}
                      aria-disabled={it.desabilitado ? true : undefined}
                      data-active={i === atual ? "true" : undefined}
                      className={`neu-command__item${it.desabilitado ? " neu-command__item--disabled" : ""}`}
                      onMouseMove={() => {
                        if (!it.desabilitado && atual !== i) setAtivo(i);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executar(it)}
                    >
                      {it.icone && <span className="neu-command__icon" aria-hidden="true">{it.icone}</span>}
                      <span className="neu-command__label">{it.rotulo}</span>
                      {it.atalho && <GrupoTeclas atalho={it.atalho} />}
                    </div>
                  );
                })}
              </div>
            </Fragment>
          ))
        ) : (
          <div className="neu-command__empty" role="status">{textoVazio}</div>
        )}
      </div>
      {rodape && (
        <div className="neu-command__foot" aria-hidden="true">
          <span><kbd className="neu-kbd">↑</kbd><kbd className="neu-kbd">↓</kbd> navegar</span>
          <span><kbd className="neu-kbd">↵</kbd> selecionar</span>
          {emDialogo && <span><kbd className="neu-kbd">Esc</kbd> fechar</span>}
        </div>
      )}
    </div>
  );
}

interface PaletaProps extends Omit<ComandoProps, "autoFoco" | "emDialogo"> {
  aberto?: boolean;
  abertoInicial?: boolean;
  aoMudarAberto?: (aberto: boolean) => void;
  gatilho?: ReactElement;
  titulo?: string;
  /** Falso desliga o atalho Ctrl/⌘ + K */
  atalhoGlobal?: boolean;
}

export function PaletaComandos({ aberto: abertoControlado, abertoInicial = false, aoMudarAberto, gatilho, titulo = "Paleta de comandos", atalhoGlobal = true, aoSelecionar, ...resto }: PaletaProps) {
  const [interno, setInterno] = useState(abertoInicial);
  const controlado = abertoControlado !== undefined;
  const aberto = controlado ? abertoControlado : interno;
  const painel = useRef<HTMLDivElement>(null);
  function mudar(v: boolean) {
    if (!controlado) setInterno(v);
    aoMudarAberto?.(v);
  }
  const mudarRef = useRef(mudar);
  mudarRef.current = mudar;
  const abertoRef = useRef(aberto);
  abertoRef.current = aberto;

  useEffect(() => {
    if (!atalhoGlobal) return;
    function tecla(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        mudarRef.current(!abertoRef.current);
      }
    }
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [atalhoGlobal]);

  useEffect(() => {
    if (!aberto) return;
    const volta = document.activeElement as HTMLElement | null;
    function aoTeclar(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        mudarRef.current(false);
        return;
      }
      if (e.key === "Tab" && painel.current) {
        const f = painel.current.querySelectorAll<HTMLElement>(FOCAVEIS);
        if (!f.length) {
          e.preventDefault();
          return;
        }
        const primeiro = f[0];
        const ultimo = f[f.length - 1];
        const atual = document.activeElement;
        if (e.shiftKey && atual === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && atual === ultimo) {
          e.preventDefault();
          primeiro.focus();
        } else if (!painel.current.contains(atual)) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    }
    document.addEventListener("keydown", aoTeclar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
      if (volta && document.contains(volta)) volta.focus();
    };
  }, [aberto]);

  const botao = gatilho
    ? cloneElement(gatilho, {
        "aria-haspopup": "dialog",
        "aria-expanded": aberto,
        onClick: (e: MouseEvent) => {
          gatilho.props.onClick?.(e);
          mudar(!aberto);
        },
      })
    : null;
  if (!aberto) return botao;
  return (
    <>
      {botao}
      <div className="neu-backdrop neu-command-layer" onClick={() => mudar(false)}>
        <div className="neu-backdrop__veil" aria-hidden="true" />
        <div ref={painel} className="neu-command-dialog" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
          <Comando
            {...resto}
            autoFoco
            emDialogo
            aoSelecionar={(it) => {
              mudar(false);
              aoSelecionar?.(it);
            }}
          />
        </div>
      </div>
    </>
  );
}

/* ---------- Vitrine ---------- */

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

const GRUPOS: GrupoComando[] = [
  {
    titulo: "Sugestões",
    itens: [
      { rotulo: "Agenda", icone: <Calendar size={16} /> },
      { rotulo: "Buscar emoji", icone: <Smile size={16} />, palavrasChave: "emoticon" },
      { rotulo: "Calculadora", icone: <Calculator size={16} />, desabilitado: true },
    ],
  },
  {
    titulo: "Configurações",
    itens: [
      { rotulo: "Perfil", icone: <User size={16} />, atalho: "⌘P" },
      { rotulo: "Faturamento", icone: <CreditCard size={16} />, atalho: "⌘B", palavrasChave: "pagamento cobrança" },
      { rotulo: "Configurações", icone: <Settings size={16} />, atalho: "⌘S" },
    ],
  },
];

export default function NeumorfismoComandos() {
  const [ultimo, setUltimo] = useState<string | null>(null);
  const [aberta, setAberta] = useState(false);
  return (
    <ComponentPreview
      title="Command"
      description="Lista de ações pesquisável: campo de busca num poço afundado, grupos, atalhos como teclas e dicas de teclado no rodapé. Em diálogo, vira uma paleta aberta com Ctrl/⌘ + K."
      whenToUse={["Muitas ações ou destinos que a pessoa conhece pelo nome", "Atalho de teclado para navegar e executar sem tirar a mão do teclado", "Paleta global de comandos da aplicação"]}
      whenNotToUse={["Poucas opções fixas: use um menu ou um select", "Escolher valor de um formulário: use o Select"]}
      accessibility={[
        "O campo é um combobox que controla um listbox; a opção ativa é anunciada por aria-activedescendant",
        "↑ e ↓ pulam os itens desativados e dão a volta; Enter executa; Home e End vão às pontas com o campo vazio",
        "A busca ignora caixa e acentos e olha as palavras-chave (\"pag\" acha \"Faturamento\")",
        "Sem resultado, a mensagem é um status anunciado",
        "Na paleta: foco no campo ao abrir, Tab preso no painel, Esc e clique fora fecham, e o foco volta ao gatilho",
        "O item ativo é uma linha em relevo e o ícone muda de cor: o destaque não depende só da cor",
      ]}
      code={`const grupos = [
  { titulo: "Sugestões", itens: [
    { rotulo: "Agenda", icone: <Calendar size={16} /> },
    { rotulo: "Calculadora", icone: <Calculator size={16} />, desabilitado: true },
  ] },
  { titulo: "Configurações", itens: [
    { rotulo: "Faturamento", icone: <CreditCard size={16} />, atalho: "⌘B", palavrasChave: "pagamento cobrança" },
  ] },
];

<Comando grupos={grupos} aoSelecionar={(item) => setUltimo(item.rotulo)} rotulo="Buscar comando" />

<PaletaComandos
  aberto={aberta}
  aoMudarAberto={setAberta}
  grupos={grupos}
  aoSelecionar={(item) => setUltimo(item.rotulo)}
  gatilho={<Button variant="outline">Abrir paleta</Button>}
/>`}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
        <div style={{ width: 380, maxWidth: "100%" }}>
          <Legenda>Lista de comandos</Legenda>
          <Comando grupos={GRUPOS} aoSelecionar={(it) => setUltimo(it.rotulo)} />
          <p className="neu-help" aria-live="polite">{ultimo ? `Selecionado: ${ultimo}` : "Digite para filtrar (ex.: \"pag\"), use ↑ ↓ e Enter."}</p>
        </div>
        <div style={{ width: 300, maxWidth: "100%" }}>
          <Legenda>Paleta em diálogo</Legenda>
          <div className="neu-stack" style={{ gap: 12 }}>
            <PaletaComandos
              aberto={aberta}
              aoMudarAberto={setAberta}
              grupos={GRUPOS}
              aoSelecionar={(it) => setUltimo(it.rotulo)}
              gatilho={
                <Button type="button" variant="outline" className="neu-btn--convex">
                  <Search aria-hidden="true" size={14} /> Abrir paleta
                </Button>
              }
            />
            <p className="neu-help" style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              Ou pressione <GrupoTeclas atalho={["Ctrl", "K"]} /> / <GrupoTeclas atalho="⌘K" />
            </p>
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}
