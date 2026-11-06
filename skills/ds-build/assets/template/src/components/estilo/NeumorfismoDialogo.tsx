import { cloneElement, useEffect, useId, useRef, useState, type FormEvent, type MouseEvent, type ReactElement, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import { CampoTexto } from "./NeumorfismoCampos";

/**
 * Vitrine do Dialog no estilo Neumorfismo (componente Dialog do pacote Neumorphic UI v3.2.0): uma janela modal
 * geral para formulários e conteúdo, a contraparte editável do AlertDialog (que fica só para confirmações). O
 * painel convexo leva título, descrição, corpo livre, rodapé e o ✕ redondo e afundado no canto. Com aoEnviar o
 * painel vira um <form>: devolver false mantém o diálogo aberto, por exemplo diante de um erro de validação.
 * Comportamento do pacote: role="dialog" com aria-modal, nomeado pelo título e descrito pela descrição; o foco
 * vai ao primeiro campo (ou ao primeiro elemento focável); Tab fica preso e a página não rola; Esc, o ✕ e o
 * clique fora fecham, e o foco volta ao gatilho; dismissivel={false} bloqueia Esc e o clique fora; abaixo de
 * 480px o rodapé empilha, com a ação principal em cima. Entra numa seção nova do neumorfismo ("Dialog", depois
 * do Alert Dialog) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-dialog* vêm de
 * src/styles/estilo.css.
 */

const FOCAVEIS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogoProps {
  /** Elemento (em geral um Button) que abre o diálogo; ganha aria-haspopup e aria-expanded */
  gatilho?: ReactElement;
  aberto?: boolean;
  abertoInicial?: boolean;
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
  tamanho?: "sm" | "lg";
  /** O corpo rola sozinho, para conteúdo longo */
  rolagem?: boolean;
  /** Falso bloqueia Esc e o clique fora */
  dispensavel?: boolean;
  mostrarFechar?: boolean;
  refFocoInicial?: RefObject<HTMLElement>;
  /** Painel estático, sem véu nem tratamento de foco: para documentação */
  embutido?: boolean;
}

export function Dialogo({
  gatilho,
  aberto: abertoControlado,
  abertoInicial = false,
  aoMudarAberto,
  titulo,
  descricao,
  children,
  aoEnviar,
  rotuloEnviar,
  rotuloCancelar = "Cancelar",
  rodape,
  tamanho,
  rolagem = false,
  dispensavel = true,
  mostrarFechar = true,
  refFocoInicial,
  embutido = false,
}: DialogoProps) {
  const [interno, setInterno] = useState(abertoInicial);
  const controlado = abertoControlado !== undefined;
  const aberto = controlado ? abertoControlado : interno;
  const painel = useRef<HTMLDivElement & HTMLFormElement>(null);
  const uid = useId();
  const ativo = aberto && !embutido;

  function mudar(valor: boolean) {
    if (!controlado) setInterno(valor);
    aoMudarAberto?.(valor);
  }
  const fecharRef = useRef(() => mudar(false));
  fecharRef.current = () => mudar(false);

  useEffect(() => {
    if (!ativo) return;
    const volta = document.activeElement as HTMLElement | null;
    const campo = painel.current?.querySelector<HTMLElement>("input, textarea, select");
    (refFocoInicial?.current ?? campo ?? painel.current?.querySelector<HTMLElement>(FOCAVEIS))?.focus();
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape" && dispensavel) {
        e.preventDefault();
        fecharRef.current();
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
  }, [ativo, dispensavel]);

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
            <Button type="button" variant="outline" className="neu-btn--convex" onClick={() => mudar(false)}>{rotuloCancelar}</Button>
            <Button type={aoEnviar ? "submit" : "button"}>{rotuloEnviar ?? "Salvar alterações"}</Button>
          </>
        ) : null);

  const interior = (
    <>
      <div className="neu-dialog__header">
        <h2 className="neu-dialog__title" id={`${uid}-t`}>{titulo}</h2>
        {descricao && <p className="neu-dialog__desc" id={`${uid}-d`}>{descricao}</p>}
      </div>
      {children && <div className={rolagem ? "neu-dialog__body neu-dialog__body--scroll" : "neu-dialog__body"}>{children}</div>}
      {rodapeEl && <div className="neu-dialog__footer">{rodapeEl}</div>}
      {mostrarFechar && (
        <button type="button" className="neu-dialog__close" aria-label="Fechar" onClick={() => mudar(false)}>
          <X aria-hidden="true" size={16} />
        </button>
      )}
    </>
  );
  const props = {
    ref: painel,
    className: ["neu-dialog", tamanho && `neu-dialog--${tamanho}`, embutido && "neu-dialog--inline"].filter(Boolean).join(" "),
    role: "dialog",
    "aria-modal": embutido ? undefined : true,
    "aria-labelledby": `${uid}-t`,
    "aria-describedby": descricao ? `${uid}-d` : undefined,
    tabIndex: -1,
    onClick: (e: MouseEvent) => e.stopPropagation(),
  } as const;
  const caixa = aoEnviar ? (
    <form
      {...props}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const r = aoEnviar(e, new FormData(e.currentTarget));
        if (r !== false) mudar(false);
      }}
    >
      {interior}
    </form>
  ) : (
    <div {...props}>{interior}</div>
  );

  if (embutido) return caixa;
  return (
    <>
      {botaoGatilho}
      <div className="neu-backdrop neu-dialog-layer" onClick={dispensavel ? () => mudar(false) : undefined}>
        <div className="neu-backdrop__veil" aria-hidden="true" />
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

function Exemplo() {
  const [salvo, setSalvo] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);
  return (
    <div className="neu-stack" style={{ gap: 28 }}>
      <div>
        <Legenda>Gatilho + formulário</Legenda>
        <div className="neu-row" style={{ alignItems: "center" }}>
          <Dialogo
            aberto={aberto}
            aoMudarAberto={setAberto}
            tamanho="sm"
            titulo="Editar perfil"
            descricao="Altere os dados do seu perfil. Clique em salvar quando terminar."
            gatilho={<Button type="button" variant="outline">Abrir diálogo</Button>}
            aoEnviar={(_e, dados) => {
              setSalvo(`${dados.get("nome")} · ${dados.get("usuario")}`);
            }}
          >
            <Campos prefixo="" />
          </Dialogo>
          <span className="neu-help" style={{ margin: 0 }} aria-live="polite">{salvo ? `Salvo: ${salvo}` : "Nenhuma alteração salva."}</span>
        </div>
      </div>
      <div style={{ maxWidth: 400 }}>
        <Legenda>Aparência (estática)</Legenda>
        <Dialogo embutido titulo="Editar perfil" descricao="Altere os dados do seu perfil. Clique em salvar quando terminar." rotuloEnviar="Salvar alterações" aoEnviar={() => false}>
          <Campos prefixo="estatico-" />
        </Dialogo>
      </div>
    </div>
  );
}

export default function NeumorfismoDialogo() {
  return (
    <ComponentPreview
      title="Dialog"
      description="Janela modal geral para formulários e conteúdo livre: a contraparte editável do Alert Dialog, que fica reservado para confirmações. Com um envio, o painel vira um formulário."
      whenToUse={["Formulários rápidos de edição", "Conteúdo que a pessoa precisa preencher ou ler sem sair da tela"]}
      whenNotToUse={["Confirmar uma ação destrutiva: use o Alert Dialog", "Conteúdo extenso: use uma página"]}
      accessibility={["role=\"dialog\" com aria-modal, nomeado pelo título e descrito pela descrição", "O foco vai ao primeiro campo; Tab fica preso, a página não rola; Esc, o ✕ e o clique fora fecham, e o foco volta ao gatilho", "O gatilho anuncia aria-haspopup e aria-expanded", "Abaixo de 480px o rodapé empilha, com a ação principal em cima"]}
      code={`<Dialogo
  gatilho={<Button variant="outline">Abrir diálogo</Button>}
  tamanho="sm"
  titulo="Editar perfil"
  descricao="Altere os dados do seu perfil. Clique em salvar quando terminar."
  aoEnviar={(evento, dados) => salvar(dados)}   // devolver false mantém aberto
>
  <CampoTexto label="Nome" name="nome" defaultValue="Ana Ribeiro" />
  <CampoTexto label="Usuário" name="usuario" defaultValue="@anaribeiro" />
</Dialogo>`}
    >
      <Exemplo />
    </ComponentPreview>
  );
}
