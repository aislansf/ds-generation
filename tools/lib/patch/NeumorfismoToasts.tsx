import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, CircleAlert, CircleX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import { Aviso } from "./NeumorfismoAlertas";

/**
 * Vitrine do Toast no estilo Neumorfismo (componente Toast do pacote Neumorphic UI v3.2.0): uma confirmação
 * passageira que flutua no canto inferior direito e sai sozinha. Dois formatos: simples (uma linha: ícone de
 * status, a mensagem e o ✕ afundado) e detalhado (o layout do Alert, com ícone luminoso, título e detalhe),
 * ambos num cartão raso com fio de luz e, ao fundo, a linha de tempo da cor da marca que se esgota. Fecha ao
 * fim da duração; passar o mouse pausa a contagem; o ✕ fecha na hora. Entra no cartão "Toast" da
 * ComponentesPage e só é usado quando ESTILO.id === "neumorfismo". As classes neu-toast* vêm de
 * src/styles/estilo.css.
 */

type Tipo = "success" | "info" | "warning" | "danger";

interface NotificacaoProps {
  variante?: "simples" | "detalhada";
  tipo?: Tipo;
  /** A mensagem (na detalhada, o título) */
  titulo: string;
  /** Detalhe de uma linha, só na detalhada */
  children?: ReactNode;
  aoFechar?: () => void;
  /** Em milissegundos; Infinity mantém o toast até o ✕ */
  duracao?: number;
  /** Fixa no canto inferior direito da tela, acima de tudo */
  flutuante?: boolean;
  /** Linha de tempo; por padrão aparece só na detalhada */
  mostrarTimer?: boolean;
  /** Congela a contagem (para documentação) */
  pausado?: boolean;
}

const ICONE_SIMPLES: Record<Tipo, { icone: ReactNode; tom: string }> = {
  success: { icone: <Check aria-hidden="true" size={18} strokeWidth={2.5} />, tom: "success" },
  info: { icone: <CircleAlert aria-hidden="true" size={18} />, tom: "royal" },
  warning: { icone: <CircleAlert aria-hidden="true" size={18} />, tom: "warning" },
  danger: { icone: <CircleX aria-hidden="true" size={18} />, tom: "danger" },
};

export function Notificacao({ variante = "detalhada", tipo = "success", titulo, children, aoFechar, duracao = 4000, flutuante = false, mostrarTimer, pausado = false }: NotificacaoProps) {
  const [restante, setRestante] = useState(100);
  const [sobre, setSobre] = useState(false);
  const aoFecharRef = useRef(aoFechar);
  aoFecharRef.current = aoFechar;
  const sobreRef = useRef(false);
  sobreRef.current = sobre;

  // Conta o tempo em passos de 50ms; o mouse em cima congela a contagem, para dar tempo de terminar a leitura
  useEffect(() => {
    if (pausado || duracao === Infinity) return;
    let decorrido = 0;
    let ultimo = Date.now();
    const id = setInterval(() => {
      const agora = Date.now();
      if (!sobreRef.current) decorrido += agora - ultimo;
      ultimo = agora;
      const r = Math.max(0, 100 - (decorrido / duracao) * 100);
      setRestante(r);
      if (r === 0) {
        clearInterval(id);
        aoFecharRef.current?.();
      }
    }, 50);
    return () => clearInterval(id);
  }, [pausado, duracao]);

  const simples = variante === "simples";
  const comTimer = mostrarTimer ?? !simples;
  const urgente = tipo === "danger";

  const corpo = simples ? (
    <div className="neu-toast-s">
      <span className={`neu-toast-s__icon neu-tone-${ICONE_SIMPLES[tipo].tom}`}>{ICONE_SIMPLES[tipo].icone}</span>
      <p className="neu-toast-s__text">{titulo}</p>
      {aoFechar && (
        <button type="button" className="neu-toast-s__close" aria-label="Fechar" onClick={aoFechar}>
          <X aria-hidden="true" size={14} />
        </button>
      )}
    </div>
  ) : (
    <Aviso tipo={tipo} titulo={titulo} aoFechar={aoFechar} semPapel>{children}</Aviso>
  );

  const toast = (
    <div
      className={simples ? "neu-toast neu-toast--simple" : "neu-toast"}
      role={urgente ? "alert" : "status"}
      aria-live={urgente ? "assertive" : "polite"}
      onMouseEnter={() => setSobre(true)}
      onMouseLeave={() => setSobre(false)}
    >
      {corpo}
      {comTimer && <div className="neu-toast__timer" style={{ width: `${pausado ? 64 : restante}%` }} />}
    </div>
  );
  return flutuante ? <div className="neu-toast-host">{toast}</div> : toast;
}

function ExemploToasts() {
  const [exibido, setExibido] = useState(0);
  return (
    <div className="neu-row" style={{ alignItems: "flex-start", gap: 32 }}>
      <div className="neu-stack" style={{ gap: 12, width: 200, alignItems: "flex-start" }}>
        <Button type="button" onClick={() => setExibido(exibido + 1)}>Exibir Toast</Button>
        <p className="neu-help" style={{ margin: 0 }}>Aparece no canto inferior direito por 5 s; passar o mouse pausa.</p>
      </div>
      <div className="neu-stack" style={{ flex: 1, minWidth: 300, gap: 20 }}>
        <Notificacao variante="simples" titulo="Registro salvo com sucesso!" pausado aoFechar={() => {}} />
        <Notificacao titulo="Registro salvo com sucesso!" pausado aoFechar={() => {}}>Os dados foram gravados na base.</Notificacao>
      </div>
      {exibido > 0 && (
        <Notificacao key={exibido} flutuante variante="simples" titulo="Registro salvo com sucesso!" duracao={5000} mostrarTimer aoFechar={() => setExibido(0)} />
      )}
    </div>
  );
}

export default function NeumorfismoToasts() {
  return (
    <ComponentPreview
      title="Toast"
      description="Notificação temporária que flutua no canto da tela e sai sozinha. Simples, de uma linha, ou detalhada, com título e detalhe; a linha de tempo da marca mostra quanto falta."
      whenToUse={["Confirmação de ações (salvou, enviou)", "Feedback não-bloqueante"]}
      whenNotToUse={["Erros que exigem ação do usuário (use Alert inline)", "Qualquer coisa que a pessoa precise fazer: nunca ponha uma ação no toast"]}
      accessibility={["role=\"status\" com aria-live=\"polite\"; o tipo erro usa role=\"alert\" (assertivo)", "Tempo suficiente para leitura (5 s ou mais); passar o mouse pausa a contagem", "Botão de fechar acessível, com o nome \"Fechar\"", "Mostre um toast por vez"]}
      code={`const [exibido, setExibido] = useState(0);

<Button onClick={() => setExibido(exibido + 1)}>Exibir Toast</Button>

{exibido > 0 && (
  <Notificacao
    key={exibido}
    flutuante
    variante="simples"
    titulo="Registro salvo com sucesso!"
    duracao={5000}
    mostrarTimer
    aoFechar={() => setExibido(0)}
  />
)}

<Notificacao titulo="Registro salvo com sucesso!" aoFechar={fechar}>
  Os dados foram gravados na base.
</Notificacao>`}
    >
      <ExemploToasts />
    </ComponentPreview>
  );
}
