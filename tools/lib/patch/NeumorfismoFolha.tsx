import { cloneElement, useEffect, useId, useRef, useState, type FormEvent, type MouseEvent, type PointerEvent, type ReactElement, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import { CampoTexto } from "./NeumorfismoCampos";

/**
 * Vitrine do Sheet no estilo Neumorfismo (componente Sheet do pacote Neumorphic UI v3.2.0): um painel de altura
 * (ou largura) total que desliza de uma borda da tela, para editar um registro ou ajustes sem sair da página.
 * Divide o motor com o Drawer, mas sem a alça de arrastar. É uma laje convexa com título, descrição, corpo que
 * rola entre o cabeçalho e o rodapé fixos, e o ✕ redondo no canto. Com `gaveta` vira o Drawer do pacote: o mesmo
 * motor com lado automático (à direita no desktop, de baixo abaixo de 640px), painel solto a 8px da borda nas laterais,
 * alça de arrastar e dispensar arrastando (passar de 30% do painel, no máximo 120px, fecha; menos que isso volta, e o véu
 * esmaece durante o arrasto). Na gaveta de baixo o ✕ some: a alça, Esc, Cancelar e o clique fora fecham. O lado lateral tem largura
 * min(400px, 100% − 48px), para sempre sobrar um pedaço da página. Com aoEnviar o painel vira um <form>:
 * devolver false mantém aberto. Comportamento do pacote: role="dialog" com aria-modal, nomeado pelo título; o
 * foco vai ao primeiro campo; Tab fica preso e a página não rola; Esc, o ✕, "Fechar" e o clique fora fecham com
 * uma saída deslizante, e o foco volta ao gatilho; sem movimento a saída é imediata. "embutido" mostra um
 * palco estático (um poço com um véu claro), para documentação. Entra numa seção nova do neumorfismo ("Sheet",
 * depois do Dialog) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-sheet* vêm de
 * src/styles/estilo.css.
 */

const FOCAVEIS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Lado = "right" | "left" | "top" | "bottom";
interface Arrasto {
  inicio: number;
  d: number;
  id: number;
}

interface FolhaProps {
  /** "auto" (só na gaveta): à direita no desktop e de baixo abaixo de 640px */
  lado?: Lado | "auto";
  /** Modo Drawer: painel solto nas laterais, alça e arrastar para dispensar */
  gaveta?: boolean;
  /** Desliga o arrastar da gaveta */
  arrastar?: boolean;
  /** Elemento (em geral um Button) que abre a folha; ganha aria-haspopup e aria-expanded */
  gatilho?: ReactElement;
  aberto?: boolean;
  aoMudarAberto?: (aberto: boolean) => void;
  titulo: string;
  descricao?: string;
  children?: ReactNode;
  /** Transforma o painel num <form>; devolver false mantém aberto */
  aoEnviar?: (evento: FormEvent<HTMLFormElement>, dados: FormData) => unknown;
  rotuloEnviar?: string;
  rotuloCancelar?: string;
  /** Nós próprios, ou false para nenhum rodapé */
  rodape?: ReactNode | false;
  /** Largura (lados esquerdo e direito) ou altura (topo e base), em px */
  tamanho?: number;
  mostrarFechar?: boolean;
  refFocoInicial?: RefObject<HTMLElement>;
  /** Palco estático, sem véu real nem tratamento de foco: para documentação */
  embutido?: boolean;
  alturaPalco?: number;
}

const reduzMovimento = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Folha({
  lado = "right",
  gaveta = false,
  arrastar = true,
  gatilho,
  aberto: abertoControlado,
  aoMudarAberto,
  titulo,
  descricao,
  children,
  aoEnviar,
  rotuloEnviar,
  rotuloCancelar = "Cancelar",
  rodape,
  tamanho,
  mostrarFechar = true,
  refFocoInicial,
  embutido = false,
  alturaPalco,
}: FolhaProps) {
  const [interno, setInterno] = useState(false);
  const controlado = abertoControlado !== undefined;
  const aberto = controlado ? abertoControlado : interno;
  const [saindo, setSaindo] = useState(false);
  const painel = useRef<HTMLDivElement & HTMLFormElement>(null);
  const uid = useId();
  const ativo = aberto && !embutido;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [largura, setLargura] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [arrasto, setArrasto] = useState<Arrasto | null>(null);
  useEffect(() => {
    const aoRedimensionar = () => setLargura(window.innerWidth);
    window.addEventListener("resize", aoRedimensionar);
    return () => window.removeEventListener("resize", aoRedimensionar);
  }, []);
  const ladoReal: Lado = lado === "auto" ? (largura < 640 ? "bottom" : "right") : lado;

  function mudar(valor: boolean) {
    if (!controlado) setInterno(valor);
    aoMudarAberto?.(valor);
  }
  // fecha com a saída deslizante (200ms); sem movimento ou na prévia estática, na hora
  function fechar() {
    if (reduzMovimento() || embutido) {
      mudar(false);
      return;
    }
    setSaindo(true);
    timer.current = setTimeout(() => {
      setSaindo(false);
      setArrasto(null);
      mudar(false);
    }, 200);
  }
  const fecharRef = useRef(fechar);
  fecharRef.current = fechar;
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!ativo) return;
    const volta = document.activeElement as HTMLElement | null;
    // adia um tique para o painel já estar na tela; o foco vai ao primeiro campo, ou ao primeiro focável
    const foco = setTimeout(() => {
      const raiz = painel.current;
      if (!raiz) return;
      (refFocoInicial?.current ?? raiz.querySelector<HTMLElement>("input:not([disabled]), textarea:not([disabled]), select:not([disabled])") ?? raiz.querySelector<HTMLElement>(FOCAVEIS) ?? raiz).focus();
    }, 0);
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        fecharRef.current();
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
        if (e.shiftKey && (atual === primeiro || atual === painel.current)) {
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
      clearTimeout(foco);
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
      if (volta && document.contains(volta)) volta.focus();
    };
    // o foco inicial só vale na abertura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo]);

  const botaoGatilho = gatilho
    ? cloneElement(gatilho, {
        "aria-haspopup": "dialog",
        "aria-expanded": aberto,
        onClick: (e: MouseEvent) => {
          gatilho.props.onClick?.(e);
          mudar(true);
        },
      })
    : null;
  if (!aberto && !embutido) return botaoGatilho;

  const rodapeEl =
    rodape === false
      ? null
      : rodape ??
        (aoEnviar || rotuloEnviar ? (
          <>
            <Button type={aoEnviar ? "submit" : "button"} className={ladoReal === "bottom" ? "neu-btn--block" : undefined}>{rotuloEnviar ?? "Salvar alterações"}</Button>
            <Button type="button" variant="outline" className={ladoReal === "bottom" ? "neu-btn--convex neu-btn--block" : "neu-btn--convex"} onClick={fechar}>{rotuloCancelar}</Button>
          </>
        ) : null);

  const horizontal = ladoReal === "left" || ladoReal === "right";
  const comArrasto = gaveta && arrastar && !embutido;
  const comAlca = gaveta && arrastar && (ladoReal === "bottom" || ladoReal === "top");
  const eixo = horizontal ? "x" : "y";
  const sinal = ladoReal === "right" || ladoReal === "bottom" ? 1 : -1;
  const deslocamento = arrasto ? arrasto.d * sinal : 0;

  function aoPressionar(e: PointerEvent<HTMLElement>) {
    if (!comArrasto || e.button !== 0) return;
    // controles do corpo (botões, campos, opções) não iniciam o arrasto; a alça sempre inicia
    const alvo = e.target as HTMLElement;
    if (alvo.closest("button, a, input, textarea, select, label, [role=radio]") && !alvo.closest(".neu-sheet__handle")) return;
    setArrasto({ inicio: eixo === "x" ? e.clientX : e.clientY, d: 0, id: e.pointerId });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* o navegador pode não aceitar a captura (jsdom, por exemplo) */
    }
  }
  function aoMover(e: PointerEvent<HTMLElement>) {
    if (!arrasto || arrasto.id !== e.pointerId) return;
    const d = ((eixo === "x" ? e.clientX : e.clientY) - arrasto.inicio) * sinal;
    setArrasto({ inicio: arrasto.inicio, d: d > 0 ? d : d / 4, id: arrasto.id });
  }
  function aoSoltar() {
    if (!arrasto) return;
    const medida = painel.current ? (eixo === "x" ? painel.current.offsetWidth : painel.current.offsetHeight) : 300;
    if (arrasto.d > Math.min(120, medida * 0.3)) fechar();
    else setArrasto(null);
  }

  const interior = (
    <>
      {comAlca && (
        <div className="neu-sheet__handle" aria-hidden="true">
          <span />
        </div>
      )}
      <div className="neu-sheet__header">
        <h2 className="neu-sheet__title" id={`${uid}-t`}>{titulo}</h2>
        {descricao && <p className="neu-sheet__desc" id={`${uid}-d`}>{descricao}</p>}
      </div>
      <div className="neu-sheet__body">{children}</div>
      {rodapeEl && <div className="neu-sheet__footer">{rodapeEl}</div>}
      {mostrarFechar && !(gaveta && arrastar && ladoReal === "bottom") && (
        <button type="button" className="neu-dialog__close" aria-label="Fechar" onClick={fechar}>
          <X aria-hidden="true" size={16} />
        </button>
      )}
    </>
  );
  const props = {
    ref: painel,
    className: ["neu-sheet", `neu-sheet--${ladoReal}`, gaveta && "neu-sheet--drawer", saindo && "neu-sheet--closing", embutido && "neu-sheet--inline"].filter(Boolean).join(" "),
    style: {
      ...(tamanho ? (horizontal ? { width: tamanho } : { height: tamanho }) : {}),
      ...(arrasto ? { transform: eixo === "x" ? `translateX(${deslocamento}px)` : `translateY(${deslocamento}px)`, transition: "none" } : {}),
    },
    role: "dialog",
    "aria-modal": embutido ? undefined : true,
    "aria-labelledby": `${uid}-t`,
    "aria-describedby": descricao ? `${uid}-d` : undefined,
    tabIndex: -1,
    onClick: (e: MouseEvent) => e.stopPropagation(),
    onPointerDown: aoPressionar,
    onPointerMove: aoMover,
    onPointerUp: aoSoltar,
    onPointerCancel: aoSoltar,
  } as const;
  const caixa = aoEnviar ? (
    <form
      {...props}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const r = aoEnviar(e, new FormData(e.currentTarget));
        if (r !== false) fechar();
      }}
    >
      {interior}
    </form>
  ) : (
    <div {...props}>{interior}</div>
  );

  if (embutido) {
    return (
      <div className={`neu-sheet-stage neu-sheet-stage--${ladoReal}`} style={{ height: alturaPalco }}>
        <div className="neu-sheet-stage__veil" aria-hidden="true" />
        {caixa}
      </div>
    );
  }
  return (
    <>
      {botaoGatilho}
      <div className={saindo ? "neu-sheet-layer neu-sheet-layer--closing" : "neu-sheet-layer"} onClick={fechar}>
        <div className="neu-backdrop__veil" aria-hidden="true" style={arrasto ? { opacity: Math.max(0.2, 1 - Math.max(0, arrasto.d) / 400) } : undefined} />
        {caixa}
      </div>
    </>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

function Campos({ prefixo }: { prefixo: string }) {
  return (
    <>
      <CampoTexto label="Nome" name={`${prefixo}nome`} defaultValue="Ana Ribeiro" />
      <CampoTexto label="Usuário" name={`${prefixo}usuario`} defaultValue="@anaribeiro" />
    </>
  );
}

const ROTULOS: Record<Lado, string> = { right: "Direita", left: "Esquerda", top: "Topo", bottom: "Base" };

function Exemplo() {
  const [lado, setLado] = useState<Lado | null>(null);
  const [salvo, setSalvo] = useState<string | null>(null);
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <div>
        <Legenda>Abrir a partir de cada lado</Legenda>
        <div className="neu-row">
          {(Object.keys(ROTULOS) as Lado[]).map((k) => (
            <Folha
              key={k}
              lado={k}
              aberto={lado === k}
              aoMudarAberto={(v) => setLado(v ? k : null)}
              titulo="Editar perfil"
              descricao="Altere os dados do seu perfil. Clique em salvar quando terminar."
              gatilho={k === "right" ? <Button type="button" variant="outline">Abrir</Button> : <Button type="button" variant="outline" className="neu-btn--convex">{ROTULOS[k]}</Button>}
              rotuloEnviar="Salvar alterações"
              rotuloCancelar="Fechar"
              aoEnviar={(_e, dados) => {
                setSalvo(`${dados.get("nome")} · ${dados.get("usuario")}`);
              }}
            >
              <Campos prefixo="" />
            </Folha>
          ))}
        </div>
        <p className="neu-help" aria-live="polite">{salvo ? `Salvo: ${salvo}` : "Esc, clique fora ou \"Fechar\" descartam as alterações."}</p>
      </div>
      <div style={{ maxWidth: 560 }}>
        <Legenda>Aparência (estática)</Legenda>
        <Folha embutido lado="right" alturaPalco={400} tamanho={320} titulo="Editar perfil" descricao="Altere os dados do seu perfil. Clique em salvar quando terminar." rotuloEnviar="Salvar alterações" rotuloCancelar="Fechar" aoEnviar={() => false}>
          <Campos prefixo="estatico-" />
        </Folha>
      </div>
    </div>
  );
}

export default function NeumorfismoFolha() {
  return (
    <ComponentPreview
      title="Sheet"
      description="Painel de altura (ou largura) total que desliza de uma borda da tela, para editar um registro ou ajustes sem sair da página. Abre dos quatro lados; o corpo rola entre o cabeçalho e o rodapé fixos."
      whenToUse={["Editar um registro ou ajustes sem sair da página", "Formulários que pedem mais espaço do que um diálogo"]}
      whenNotToUse={["Confirmar uma ação: use o Alert Dialog", "Uma pergunta rápida: use o Dialog"]}
      accessibility={["role=\"dialog\" com aria-modal, nomeado pelo título", "O foco vai ao primeiro campo; Tab fica preso e a página não rola", "Esc, o ✕, \"Fechar\" e o clique fora fecham com uma saída deslizante, e o foco volta ao gatilho", "O painel lateral tem min(400px, 100% − 48px), então sempre sobra um pedaço da página; sem movimento, não há animação"]}
      code={`<Folha
  lado="right"                         // right | left | top | bottom
  gatilho={<Button variant="outline">Abrir</Button>}
  titulo="Editar perfil"
  descricao="Altere os dados do seu perfil. Clique em salvar quando terminar."
  rotuloEnviar="Salvar alterações"
  rotuloCancelar="Fechar"
  aoEnviar={(evento, dados) => salvar(dados)}   // devolver false mantém aberto
>
  <CampoTexto label="Nome" name="nome" defaultValue="Ana Ribeiro" />
  <CampoTexto label="Usuário" name="usuario" defaultValue="@anaribeiro" />
</Folha>`}
    >
      <Exemplo />
    </ComponentPreview>
  );
}
