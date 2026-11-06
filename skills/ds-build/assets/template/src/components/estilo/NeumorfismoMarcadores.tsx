import type { ReactNode } from "react";
import { CircleCheck, GitBranch, Loader2, Search } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Marcador no estilo Neumorfismo (componente Marker do pacote Neumorphic UI v3.2.0): uma nota de sistema na linha de
 * um feed, conversa ou registro de atividade. Pode ser um evento com ícone num pontinho afundado, um estado ao vivo
 * ("Rafael está digitando…", com o brilho que varre o texto, ou um carregamento que gira) ou uma linha separadora
 * (uma pílula afundada entre dois sulcos). Com `status` ou `carregando` ele vira role="status" e anuncia com
 * educação; o separador é role="separator". O brilho só se move com "movimento" permitido; sem ele, o texto fica
 * discreto. O componente também é usado pelo Message e pelo MessageScroller. Entra numa seção nova do neumorfismo
 * ("Marker", depois do MessageScroller) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-marker* e
 * neu-shimmer vêm de src/styles/estilo.css.
 */

export interface MarcadorProps {
  /** Ícone num pontinho afundado (um nó, como um ícone da lucide) */
  icone?: ReactNode;
  /** Troca o ícone por um carregador que gira; implica role="status" */
  carregando?: boolean;
  /** role="status", com anúncio educado ("digitando…") */
  status?: boolean;
  /** Faixa clara que varre o texto */
  brilho?: boolean;
  variante?: "separador";
  tom?: "marca" | "sucesso";
  hora?: string;
  className?: string;
  children?: ReactNode;
}

const TOM = { marca: "accent", sucesso: "success" } as const;

export function Marcador({ icone, carregando, status, brilho, variante, tom, hora, className, children }: MarcadorProps) {
  const vivo = status || carregando;
  const no = carregando ? <Loader2 aria-hidden="true" size={14} className="motion-safe:animate-spin" /> : icone;
  const classes = ["neu-marker", variante === "separador" && "neu-marker--separator", tom && `neu-marker--${TOM[tom]}`, className].filter(Boolean).join(" ");
  return (
    <div className={classes} role={vivo ? "status" : variante === "separador" ? "separator" : undefined} aria-live={vivo ? "polite" : undefined} aria-label={variante === "separador" && typeof children === "string" ? children : undefined}>
      {no && <span className="neu-marker__icon" aria-hidden="true">{no}</span>}
      <span className={`neu-marker__content${brilho ? " neu-shimmer" : ""}`}>{children}</span>
      {hora && <time className="neu-marker__time">{hora}</time>}
    </div>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoMarcadoresVitrine() {
  return (
    <ComponentPreview
      title="Marker"
      description="Uma nota de sistema na linha de um feed, conversa ou registro de atividade: um evento com ícone, um estado ao vivo (carregando, digitando…) ou uma linha separadora."
      whenToUse={["Eventos num histórico: transferências, consultas, encerramentos", "Estados ao vivo de um assistente ou de outra pessoa (\"Pensando…\", \"digitando…\")", "Separar trechos de uma conversa (\"Conversa resumida\", \"Hoje\")"]}
      whenNotToUse={["Avisos que pedem ação ou que merecem destaque: use o Alert ou o Toast", "Rótulos de seção de uma página: use um título", "Mensagens das pessoas: use o Bubble e o Message"]}
      accessibility={[
        "Com status ou carregando, vira role=\"status\" com aria-live=\"polite\": o leitor de tela anuncia sem interromper; use para \"digitando…\" e \"Pensando…\"",
        "O separador é role=\"separator\" e leva o próprio texto como nome",
        "O ícone fica escondido dos leitores de tela: o texto da nota diz tudo; use strong para os nomes",
        "A hora usa o elemento time",
        "O brilho só se move com \"movimento\" permitido; sem ele, o texto fica discreto, e o carregador só gira nesse caso",
      ]}
      code={`<Marcador icone={<GitBranch size={14} />}>Atendimento transferido para um novo fluxo</Marcador>
<Marcador carregando brilho>Pensando…</Marcador>
<Marcador variante="separador">Conversa resumida</Marcador>
<Marcador icone={<Search size={14} />} hora="14:32">Consultou 4 arquivos</Marcador>
<Marcador icone={<CircleCheck size={14} />} tom="sucesso"><strong>Ana</strong> encerrou o atendimento</Marcador>
<Marcador status brilho><strong>Carla</strong> está digitando…</Marcador>`}
    >
      <div>
        <Legenda>Marcadores em um histórico</Legenda>
        <div className="neu-stack" style={{ gap: 24, maxWidth: 420 }}>
          <Marcador icone={<GitBranch size={14} />}>Atendimento transferido para um novo fluxo</Marcador>
          <Marcador carregando brilho>Pensando…</Marcador>
          <Marcador variante="separador">Conversa resumida</Marcador>
          <Marcador icone={<Search size={14} />} hora="14:32">Consultou 4 arquivos</Marcador>
          <Marcador icone={<CircleCheck size={14} />} tom="sucesso">
            <strong>Ana</strong> encerrou o atendimento
          </Marcador>
          <Marcador status brilho>
            <strong>Carla</strong> está digitando…
          </Marcador>
        </div>
      </div>
    </ComponentPreview>
  );
}
