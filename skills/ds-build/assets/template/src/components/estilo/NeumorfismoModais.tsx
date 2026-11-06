import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { Check, CircleAlert, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Modal no estilo Neumorfismo (componente Modal do pacote Neumorphic UI v3.2.0): um diálogo flutuante,
 * uma laje rasa com fio de luz sobre um véu de ardósia com desfoque, dividida em cabeçalho, corpo (que rola
 * sozinho a partir de 90% da altura da tela) e rodapé por fendas de 1px. O cabeçalho leva o selo luminoso
 * (cor da marca, ou perigo), o título e um ✕ afundado. A variante convexa traz subtítulo, ícone, uma linha de
 * detalhe afundada e o ✕ em relevo. Comportamento do pacote: o foco vai ao ✕ ao abrir (ou ao elemento indicado),
 * Tab e Shift+Tab ficam presos no diálogo, Esc e o clique no véu fecham, a rolagem da página trava e, ao fechar,
 * o foco volta a quem abriu. Role dialog (alertdialog no tom perigo), aria-modal, nomeado pelo título e descrito
 * pelo corpo. "embutido" mostra a caixa estática, sem véu nem foco, para documentação. Entra no cartão "Modal"
 * da ComponentesPage e só é usado quando ESTILO.id === "neumorfismo". As classes neu-modal* e neu-backdrop*
 * vêm de src/styles/estilo.css.
 */

const FOCAVEIS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  aberto?: boolean;
  aoFechar?: () => void;
  titulo: string;
  children?: ReactNode;
  rotuloConfirmar?: string;
  rotuloCancelar?: string;
  aoConfirmar?: () => void;
  /** O padrão é fechar */
  aoCancelar?: () => void;
  tom?: "accent" | "danger";
  /** Falso tira o selo luminoso do título */
  selo?: boolean;
  /** Glifo do selo; o padrão é o check (o alerta no tom perigo) */
  icone?: ReactNode;
  subtitulo?: string;
  variante?: "plano" | "convexo";
  /** Botões próprios, ou false para nenhum */
  rodape?: ReactNode | false;
  tamanho?: "lg";
  refFocoInicial?: RefObject<HTMLElement>;
  refFocoRetorno?: RefObject<HTMLElement>;
  /** Caixa estática, sem véu nem tratamento de foco: para documentação */
  embutido?: boolean;
}

export function Modal({
  aberto = false,
  aoFechar,
  titulo,
  children,
  rotuloConfirmar = "Confirmar",
  rotuloCancelar = "Cancelar",
  aoConfirmar,
  aoCancelar,
  tom = "accent",
  selo = true,
  icone,
  subtitulo,
  variante = "plano",
  rodape,
  tamanho,
  refFocoInicial,
  refFocoRetorno,
  embutido = false,
}: ModalProps) {
  const caixa = useRef<HTMLDivElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const uid = useId();
  const ativo = aberto && !embutido;
  const aoFecharRef = useRef(aoFechar);
  aoFecharRef.current = aoFechar;

  useEffect(() => {
    if (!ativo) return;
    const volta = document.activeElement as HTMLElement | null;
    (refFocoInicial?.current ?? botaoFechar.current)?.focus();
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        aoFecharRef.current?.();
        return;
      }
      if (e.key === "Tab" && caixa.current) {
        const f = caixa.current.querySelectorAll<HTMLElement>(FOCAVEIS);
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
        } else if (!caixa.current.contains(atual)) {
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
      (refFocoRetorno?.current ?? volta)?.focus();
    };
    // o foco inicial e o retorno só valem na abertura e no fechamento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo]);

  if (!aberto && !embutido) return null;

  const idTitulo = `${uid}-titulo`;
  const idCorpo = `${uid}-corpo`;
  const perigo = tom === "danger";
  const glifo = icone ?? (perigo ? <CircleAlert aria-hidden="true" size={14} strokeWidth={3} /> : <Check aria-hidden="true" size={14} strokeWidth={3} />);
  const seloEl = selo ? <span className={perigo ? "neu-modal__badge neu-modal__badge--danger" : "neu-modal__badge neu-modal__badge--accent"} aria-hidden="true">{glifo}</span> : null;
  const classe = ["neu-modal", embutido && "neu-modal--inline", tamanho && `neu-modal--${tamanho}`, variante === "convexo" && "neu-modal--convex"].filter(Boolean).join(" ");

  const caixaEl = (
    <div
      ref={caixa}
      className={classe}
      role={perigo ? "alertdialog" : "dialog"}
      aria-modal={embutido ? undefined : true}
      aria-labelledby={idTitulo}
      aria-describedby={idCorpo}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="neu-modal__head">
        {subtitulo ? (
          <div className="neu-modal__heading">
            {seloEl}
            <div className="neu-modal__titles">
              <h3 id={idTitulo} className="neu-modal__title">{titulo}</h3>
              <p className="neu-modal__subtitle">{subtitulo}</p>
            </div>
          </div>
        ) : (
          <h3 id={idTitulo} className="neu-modal__title">{seloEl}{titulo}</h3>
        )}
        <button ref={botaoFechar} type="button" className={variante === "convexo" ? "neu-modal__close neu-modal__close--convex" : "neu-modal__close"} aria-label="Fechar" onClick={aoFechar}>
          <X aria-hidden="true" size={16} />
        </button>
      </div>
      <div id={idCorpo} className="neu-modal__body">{typeof children === "string" ? <p>{children}</p> : children}</div>
      {rodape === false ? null : (
        <div className="neu-modal__foot">
          {rodape ?? (
            <>
              <Button type="button" variant="outline" className="neu-btn--convex" onClick={aoCancelar ?? aoFechar}>{rotuloCancelar}</Button>
              <Button type="button" variant={perigo ? "destructive" : "default"} onClick={aoConfirmar}>{rotuloConfirmar}</Button>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (embutido) return caixaEl;
  return (
    <div className="neu-backdrop" onClick={aoFechar}>
      <div className="neu-backdrop__veil" aria-hidden="true" />
      {caixaEl}
    </div>
  );
}

interface ExemploProps {
  rotuloGatilho: string;
  /** Variante convexa, com o gatilho também em relevo */
  convexo?: boolean;
  dica: string;
  titulo: string;
  subtitulo?: string;
  icone?: ReactNode;
  children: ReactNode;
}

// À esquerda o gatilho e a dica; à direita a prévia embutida; o diálogo real abre por cima de tudo
function Exemplo({ rotuloGatilho, convexo = false, dica, titulo, subtitulo, icone, children }: ExemploProps) {
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);
  const comum = { titulo, subtitulo, icone, variante: convexo ? ("convexo" as const) : ("plano" as const) };
  return (
    <div className="neu-row" style={{ alignItems: "flex-start", gap: 32 }}>
      <div className="neu-stack" style={{ gap: 12, width: 200, alignItems: "flex-start" }}>
        {convexo ? (
          <Button type="button" variant="outline" className="neu-btn--convex" onClick={() => setAberto(true)}>{rotuloGatilho}</Button>
        ) : (
          <Button type="button" onClick={() => setAberto(true)}>{rotuloGatilho}</Button>
        )}
        <p className="neu-help" style={{ margin: 0 }}>{dica}</p>
      </div>
      <div style={{ flex: 1, minWidth: 300 }}>
        <Modal embutido aoFechar={() => {}} {...comum}>{children}</Modal>
      </div>
      <Modal aberto={aberto} aoFechar={fechar} aoConfirmar={fechar} {...comum}>{children}</Modal>
    </div>
  );
}

export default function NeumorfismoModais() {
  return (
    <ComponentPreview
      title="Modal"
      description="Diálogo sobreposto para ações que exigem atenção: uma laje rasa sobre um véu com desfoque, em cabeçalho, corpo e rodapé. Plano para confirmações simples; convexo, com subtítulo e uma linha de detalhe, para decisões com contexto."
      whenToUse={["Confirmação de ações destrutivas", "Formulários rápidos", "Alertas importantes"]}
      whenNotToUse={["Conteúdo extenso (use página)", "Informações não-urgentes (use inline)"]}
      accessibility={["role=\"dialog\" (alertdialog no tom perigo), aria-modal, nomeado pelo título e descrito pelo corpo", "Ao abrir, o foco vai ao ✕; Tab e Shift+Tab ficam presos no diálogo; Esc e o clique no véu fecham; a rolagem da página trava", "Ao fechar, o foco volta ao botão que abriu", "O título nomeia a ação, o corpo diz a consequência e os botões são verbos"]}
      code={`const [aberto, setAberto] = useState(false);
const fechar = () => setAberto(false);

<Button onClick={() => setAberto(true)}>Abrir Modal</Button>

<Modal aberto={aberto} aoFechar={fechar} aoConfirmar={fechar} titulo="Confirmar ação">
  Tem certeza de que deseja prosseguir com esta ação? Esta operação não pode ser desfeita.
</Modal>

{/* convexo, com subtítulo, ícone e linha de detalhe */}
<Modal variante="convexo" icone={<Info size={16} />} titulo="Confirmar publicação de tokens"
  subtitulo="Tokens do tema" aberto={aberto} aoFechar={fechar} aoConfirmar={fechar}>
  …
</Modal>`}
    >
      <div className="neu-stack" style={{ gap: 40 }}>
        <Exemplo
          rotuloGatilho="Abrir Modal"
          dica="Abre o diálogo real: foco preso, Esc fecha e o foco volta para este botão."
          titulo="Confirmar ação"
        >
          Tem certeza de que deseja prosseguir com esta ação? Esta operação não pode ser desfeita.
        </Exemplo>
        <Exemplo
          rotuloGatilho="Publicar tokens"
          convexo
          dica="Variante convexa com subtítulo e linha de detalhe em baixo-relevo."
          titulo="Confirmar publicação de tokens"
          subtitulo="Tokens do tema"
          icone={<Info aria-hidden="true" size={16} strokeWidth={2.5} />}
        >
          <div className="neu-modal__stack">
            <p>Você está prestes a aplicar as modificações neumórficas nas bibliotecas compartilhadas da sua marca. Deseja prosseguir com a sincronização?</p>
            <div className="neu-modal__meta">
              <span className="neu-modal__meta-label">Paleta ativa</span>
              <span className="neu-modal__meta-value"><span className="neu-modal__swatch" aria-hidden="true" />Cor da marca</span>
            </div>
          </div>
        </Exemplo>
      </div>
    </ComponentPreview>
  );
}
