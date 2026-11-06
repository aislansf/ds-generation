import { cloneElement, useEffect, useRef, useState, useId, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { CircleAlert, Loader2, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import { Notificacao } from "./NeumorfismoToasts";

/**
 * Vitrine do AlertDialog no estilo Neumorfismo (componente AlertDialog do pacote Neumorphic UI v3.2.0): uma
 * confirmação modal que interrompe o fluxo e espera uma resposta ("Tem certeza?"), com a tecla Cancelar e a
 * ação. Serve antes de ações destrutivas ou irreversíveis (excluir, sair, descartar alterações); para
 * formulários ou conteúdo longo, use o Modal. O painel é uma laje convexa de até 512px sobre o véu desfocado;
 * leva título, descrição e, opcionalmente, um ícone afundado de 48px (no tom perigo, o alerta). O tamanho
 * compacto (340px) centra o ícone e o texto e põe as duas teclas lado a lado. Comportamento do pacote:
 * role="alertdialog" com aria-modal, nomeado pelo título e descrito pela descrição; ao abrir, o foco vai a
 * Cancelar (Enter nunca confirma sem querer); Tab fica preso; Esc cancela; o foco volta ao gatilho; clicar no
 * véu NÃO fecha, só balança o painel, porque a pessoa precisa escolher. A ação fecha o diálogo, a menos que
 * devolva false (ou uma promessa, que o mantém aberto até se resolver), e carregando faz a ação girar,
 * desabilita Cancelar e ignora Esc. Entra numa seção nova do neumorfismo ("Alert Dialog", depois do Modal) e só
 * é usado quando ESTILO.id === "neumorfismo". As classes neu-adialog* vêm de src/styles/estilo.css.
 */

const FOCAVEIS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogoAlertaProps {
  /** Elemento (em geral um Button) que abre o diálogo; ganha aria-haspopup e aria-expanded */
  gatilho?: ReactElement;
  aberto?: boolean;
  abertoInicial?: boolean;
  aoMudarAberto?: (aberto: boolean) => void;
  titulo: string;
  descricao?: string;
  /** Corpo extra, abaixo do texto */
  children?: ReactNode;
  rotuloCancelar?: string;
  rotuloAcao?: string;
  /** Devolver false mantém aberto; devolver uma promessa mantém aberto até ela se resolver */
  aoAcionar?: () => unknown;
  aoCancelar?: () => void;
  tom?: "padrao" | "danger";
  /** Variante do botão da ação (no tom perigo é sempre a destrutiva) */
  variacaoAcao?: "default" | "secondary";
  icone?: ReactNode;
  tamanho?: "padrao" | "sm";
  carregando?: boolean;
  focoInicial?: "cancelar" | "acao";
  /** Painel estático, sem véu nem tratamento de foco: para documentação */
  embutido?: boolean;
}

export function DialogoAlerta({
  gatilho,
  aberto: abertoControlado,
  abertoInicial = false,
  aoMudarAberto,
  titulo,
  descricao,
  children,
  rotuloCancelar = "Cancelar",
  rotuloAcao = "Continuar",
  aoAcionar,
  aoCancelar,
  tom = "padrao",
  variacaoAcao = "default",
  icone,
  tamanho = "padrao",
  carregando = false,
  focoInicial = "cancelar",
  embutido = false,
}: DialogoAlertaProps) {
  const [interno, setInterno] = useState(abertoInicial);
  const controlado = abertoControlado !== undefined;
  const aberto = controlado ? abertoControlado : interno;
  const painel = useRef<HTMLDivElement>(null);
  const cancelar = useRef<HTMLButtonElement>(null);
  const acao = useRef<HTMLButtonElement>(null);
  const [balanco, setBalanco] = useState(false);
  const uid = useId();
  const ativo = aberto && !embutido;
  const perigo = tom === "danger";

  function mudar(valor: boolean) {
    if (!controlado) setInterno(valor);
    aoMudarAberto?.(valor);
  }
  function cancelarTudo() {
    mudar(false);
    aoCancelar?.();
  }
  // o efeito de teclado precisa da versão mais recente, sem religar os ouvintes a cada render
  const cancelarRef = useRef(cancelarTudo);
  cancelarRef.current = cancelarTudo;
  const carregandoRef = useRef(carregando);
  carregandoRef.current = carregando;

  useEffect(() => {
    if (!ativo) return;
    const volta = document.activeElement as HTMLElement | null;
    (focoInicial === "acao" ? acao.current : cancelar.current)?.focus();
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!carregandoRef.current) cancelarRef.current();
        return;
      }
      if (e.key === "Tab" && painel.current) {
        const f = painel.current.querySelectorAll<HTMLElement>(FOCAVEIS);
        if (!f.length) return;
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
      volta?.focus();
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

  const compacto = tamanho === "sm";
  const midia = icone || perigo ? (
    <span className={perigo ? "neu-adialog__media neu-adialog__media--danger" : "neu-adialog__media"} aria-hidden="true">
      {icone ?? <CircleAlert aria-hidden="true" size={22} />}
    </span>
  ) : null;
  const classe = ["neu-adialog", compacto && "neu-adialog--sm", midia && "neu-adialog--media", embutido && "neu-adialog--inline", balanco && "neu-adialog--nudge"].filter(Boolean).join(" ");

  function aoClicarAcao() {
    const r = aoAcionar?.();
    if (r === false) return;
    if (r && typeof (r as Promise<unknown>).then === "function") {
      (r as Promise<unknown>).then((ok) => {
        if (ok !== false) mudar(false);
      });
      return;
    }
    mudar(false);
  }

  const caixa = (
    <div
      ref={painel}
      className={classe}
      role="alertdialog"
      aria-modal={embutido ? undefined : true}
      aria-labelledby={`${uid}-t`}
      aria-describedby={descricao ? `${uid}-d` : undefined}
      onClick={(e) => e.stopPropagation()}
      onAnimationEnd={() => setBalanco(false)}
    >
      <div className="neu-adialog__header">
        {midia}
        <div className="neu-adialog__text">
          <h2 className="neu-adialog__title" id={`${uid}-t`}>{titulo}</h2>
          {descricao && <p className="neu-adialog__desc" id={`${uid}-d`}>{descricao}</p>}
        </div>
      </div>
      {children && <div className="neu-adialog__body">{children}</div>}
      <div className="neu-adialog__footer">
        <Button ref={cancelar} type="button" variant="outline" className="neu-btn--convex neu-adialog__cancel" disabled={carregando} onClick={cancelarTudo}>{rotuloCancelar}</Button>
        <Button
          ref={acao}
          type="button"
          variant={perigo ? "destructive" : variacaoAcao}
          className="neu-adialog__action"
          aria-busy={carregando || undefined}
          disabled={carregando}
          onClick={aoClicarAcao}
        >
          {carregando && <Loader2 aria-hidden="true" className="neu-spin" size={16} />}
          {rotuloAcao}
        </Button>
      </div>
    </div>
  );

  if (embutido) return caixa;
  return (
    <>
      {botaoGatilho}
      <div className="neu-backdrop neu-adialog-layer" onClick={() => setBalanco(true)}>
        <div className="neu-backdrop__veil" aria-hidden="true" />
        {caixa}
      </div>
    </>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 10px" }}>{children}</p>;
}

function Exemplo() {
  const [aviso, setAviso] = useState<{ texto: string; k: number } | null>(null);
  const contador = useRef(0);
  const mostrar = (texto: string) => {
    contador.current += 1;
    setAviso({ texto, k: contador.current });
  };
  const [carregando, setCarregando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  return (
    <div className="neu-stack" style={{ gap: 28 }}>
      <div>
        <Legenda>Abrir o diálogo real</Legenda>
        <div className="neu-row" style={{ gap: 12 }}>
          <DialogoAlerta
            gatilho={<Button type="button" variant="outline">Mostrar diálogo</Button>}
            titulo="Tem certeza absoluta?"
            descricao="Esta ação não pode ser desfeita. Sua conta será excluída permanentemente dos nossos servidores."
            aoAcionar={() => mostrar("Ação confirmada.")}
          />
          <DialogoAlerta
            gatilho={<Button type="button" variant="destructive"><Trash2 aria-hidden="true" size={18} /> Excluir projeto</Button>}
            tom="danger"
            aberto={excluindo}
            aoMudarAberto={setExcluindo}
            carregando={carregando}
            titulo={'Excluir o projeto "Vitrine Digital"?'}
            descricao="Os 42 atendimentos e 18 documentos vinculados também serão removidos. Esta ação não pode ser desfeita."
            rotuloAcao="Excluir projeto"
            aoAcionar={() => {
              setCarregando(true);
              setTimeout(() => {
                setCarregando(false);
                setExcluindo(false);
                mostrar("Projeto excluído.");
              }, 1200);
              return false;
            }}
          />
          <DialogoAlerta
            gatilho={<Button type="button" variant="outline" className="neu-btn--convex"><LogOut aria-hidden="true" size={18} /> Sair</Button>}
            tamanho="sm"
            icone={<LogOut aria-hidden="true" size={22} />}
            titulo="Sair da conta?"
            descricao="Você precisará entrar de novo para continuar."
            rotuloAcao="Sair"
            variacaoAcao="secondary"
            aoAcionar={() => mostrar("Você saiu da conta.")}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>
        <div>
          <Legenda>Padrão</Legenda>
          <DialogoAlerta embutido titulo="Tem certeza absoluta?" descricao="Esta ação não pode ser desfeita. Sua conta será excluída permanentemente dos nossos servidores." />
        </div>
        <div>
          <Legenda>Destrutivo (tom perigo)</Legenda>
          <DialogoAlerta embutido tom="danger" titulo="Excluir o projeto?" descricao="Os atendimentos e documentos vinculados também serão removidos." rotuloAcao="Excluir projeto" />
        </div>
        <div>
          <Legenda>Compacto (tamanho sm)</Legenda>
          <DialogoAlerta embutido tamanho="sm" icone={<LogOut aria-hidden="true" size={22} />} titulo="Sair da conta?" descricao="Você precisará entrar de novo para continuar." rotuloAcao="Sair" variacaoAcao="secondary" />
        </div>
      </div>
      {aviso && <Notificacao key={aviso.k} flutuante variante="simples" titulo={aviso.texto} duracao={5000} mostrarTimer aoFechar={() => setAviso(null)} />}
    </div>
  );
}

export default function NeumorfismoDialogoAlerta() {
  return (
    <ComponentPreview
      title="Alert Dialog"
      description="Confirmação modal que interrompe o fluxo e espera uma resposta, antes de ações destrutivas ou irreversíveis. Para formulários ou conteúdo longo, use o Modal."
      whenToUse={["Excluir, sair ou descartar alterações", "Qualquer ação irreversível que precise de um \"tem certeza?\""]}
      whenNotToUse={["Formulários e conteúdo longo: use o Modal", "Feedback passageiro: use o Toast"]}
      accessibility={["role=\"alertdialog\" com aria-modal, nomeado pelo título e descrito pela descrição", "Ao abrir, o foco vai a Cancelar, para Enter nunca confirmar sem querer; Tab fica preso; Esc cancela; o foco volta ao gatilho", "Clicar no véu não fecha: o painel só balança, porque a pessoa precisa escolher", "Título é uma pergunta sobre a ação específica; a ação repete o verbo (\"Excluir projeto\"), nunca só \"OK\""]}
      code={`<DialogoAlerta
  gatilho={<Button variant="destructive">Excluir projeto</Button>}
  tom="danger"
  titulo={'Excluir o projeto "Vitrine Digital"?'}
  descricao="Os 42 atendimentos e 18 documentos vinculados também serão removidos. Esta ação não pode ser desfeita."
  rotuloAcao="Excluir projeto"
  aoAcionar={() => excluir()}  // devolver false ou uma promessa mantém aberto
/>

<DialogoAlerta gatilho={<Button>Sair</Button>} tamanho="sm" icone={<LogOut size={22} />}
  titulo="Sair da conta?" descricao="Você precisará entrar de novo para continuar."
  rotuloAcao="Sair" variacaoAcao="secondary" />`}
    >
      <Exemplo />
    </ComponentPreview>
  );
}
