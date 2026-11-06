import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Avatar } from "@/components/estilo/NeumorfismoAvatares";
import { Balao, GrupoBalao, type BalaoProps, type LadoBalao } from "@/components/estilo/NeumorfismoBaloes";
import { Marcador } from "@/components/estilo/NeumorfismoMarcadores";

/**
 * Vitrine do Message no estilo Neumorfismo (componente Message do pacote Neumorphic UI v3.2.0): uma vez da conversa,
 * com o avatar, um ou mais balões e um nome e um rodapé opcionais. Alinha ao início (o outro) ou ao fim (você). O
 * avatar fica na base da vez, junto do último balão; o nome (com a hora ao lado, discreta) fica em cima e o rodapé,
 * com o estado de entrega ("Entregue"), embaixo. Os balões filhos herdam o lado, e a variante padrão é primária
 * para o fim e neutra para o início; um GrupoBalao também herda o lado. `compacta` esconde o avatar (mantendo o
 * espaço) nas vezes seguidas da mesma pessoa. Combina com o Marcador para notas de sistema ("Rafael está
 * digitando…") e com o MessageScroller para um registro ao vivo. Entra numa seção nova do neumorfismo ("Message",
 * depois do Bubble) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-message* vêm de
 * src/styles/estilo.css; os balões, de neu-bubble*.
 */

interface MensagemProps {
  lado?: LadoBalao;
  /** Um Avatar pequeno, mantido na base da vez */
  avatar?: ReactNode;
  nome?: string;
  hora?: string;
  /** Estado de entrega ("Entregue") */
  rodape?: ReactNode;
  /** Esconde o avatar (guardando o espaço) nas vezes seguidas da mesma pessoa */
  compacta?: boolean;
  rotulo?: string;
  role?: string;
  /** Marca a vez como âncora do RolagemMensagens (em geral a da pessoa); a Message não a usa, quem lê é o registro */
  ancora?: boolean;
  className?: string;
  /** Balões ou GrupoBalao; eles herdam o lado */
  children?: ReactNode;
}

export function Mensagem({ lado = "inicio", avatar, nome, hora, rodape, compacta, rotulo, role, className, children }: MensagemProps) {
  const filhos = Children.toArray(children)
    .filter(Boolean)
    .map((c) => {
      if (!isValidElement(c)) return c;
      if (c.type === Balao) {
        const b = c as ReactElement<BalaoProps>;
        return cloneElement(b, { lado, variante: b.props.variante || (lado === "fim" ? "primaria" : "neutra") });
      }
      if (c.type === GrupoBalao) return cloneElement(c as ReactElement<{ lado?: LadoBalao }>, { lado });
      return c;
    });
  const classes = ["neu-message", `neu-message--${lado === "fim" ? "end" : "start"}`, compacta && "neu-message--compact", className].filter(Boolean).join(" ");
  return (
    <div className={classes} role={role} aria-label={rotulo}>
      {avatar && <span className="neu-message__avatar">{avatar}</span>}
      <div className="neu-message__content">
        {nome && (
          <span className="neu-message__name">
            {nome}
            {hora && <time className="neu-message__time">{hora}</time>}
          </span>
        )}
        {filhos}
        {rodape && <div className="neu-message__footer">{rodape}</div>}
      </div>
    </div>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

const EU = <Avatar tamanho="pp" nome="Eu" fallback="EU" tom="marca" />;
const RAFAEL = <Avatar tamanho="pp" nome="Rafael" fallback="R" />;

export default function NeumorfismoMensagens() {
  return (
    <ComponentPreview
      title="Message"
      description="Uma vez da conversa: o avatar, um ou mais balões e um nome e um rodapé opcionais, alinhada ao outro (início) ou a você (fim)."
      whenToUse={["Montar uma conversa ou um fio de comentários, vez por vez", "Mostrar quem fala e o estado de entrega junto dos balões", "Registros ao vivo, junto do Marcador e do MessageScroller"]}
      whenNotToUse={["Só o balão, sem avatar nem nome: use o Bubble direto", "Notificações da tela: use o Toast ou o Alert", "Comentários com respostas aninhadas e formatação rica: use um componente próprio de discussão"]}
      accessibility={[
        "É só marcação comum, lida na ordem: nome, hora, balões e rodapé; use rotulo (aria-label) se a vez precisar de um nome",
        "O avatar é decorativo na vez: o nome de quem fala já vem em texto, antes dos balões",
        "A hora usa o elemento time; o rodapé diz o estado em texto (\"Entregue\"), nunca só um ícone",
        "O Marcador de \"digitando…\" é um role=\"status\" educado, para o leitor de tela avisar sem interromper",
        "Use avatares de iniciais ou de ícone em vez de fotos de pessoas reais",
      ]}
      code={`<Mensagem lado="fim" avatar={<Avatar tamanho="pp" nome="Eu" fallback="EU" tom="marca" />}>
  <Balao>Publicando em produção rapidinho.</Balao>
</Mensagem>

<Mensagem lado="fim" avatar={<Avatar tamanho="pp" nome="Eu" fallback="EU" tom="marca" />} rodape="Entregue">
  <Balao>É uma mudança de uma linha.</Balao>
</Mensagem>

<Mensagem avatar={<Avatar tamanho="pp" nome="Rafael" fallback="R" />}>
  <GrupoBalao>
    <Balao>É sempre uma mudança de uma linha 😭.</Balao>
    <Balao reacoes={[{ emoji: "👍", rotulo: "joinha" }]}>Tudo bem, deixa eu dar uma olhada.</Balao>
  </GrupoBalao>
</Mensagem>

<Marcador status brilho><strong>Rafael</strong> está digitando…</Marcador>`}
    >
      <div>
        <Legenda>Exemplo de referência</Legenda>
        <div className="neu-stack" style={{ gap: 18, maxWidth: 420, padding: 16, borderRadius: 16, background: "var(--neu-inset)", boxShadow: "var(--neu-inset-sh)" }}>
          <Mensagem lado="fim" avatar={EU}>
            <Balao>Publicando em produção rapidinho.</Balao>
          </Mensagem>
          <Mensagem avatar={RAFAEL}>
            <Balao>São 16h55. De uma sexta-feira.</Balao>
          </Mensagem>
          <Mensagem lado="fim" avatar={EU} rodape="Entregue">
            <Balao>É uma mudança de uma linha.</Balao>
          </Mensagem>
          <Mensagem avatar={RAFAEL}>
            <GrupoBalao>
              <Balao>É sempre uma mudança de uma linha 😭.</Balao>
              <Balao reacoes={[{ emoji: "👍", rotulo: "joinha" }]}>Tudo bem, deixa eu dar uma olhada.</Balao>
            </GrupoBalao>
          </Mensagem>
          <Marcador status brilho>
            <strong>Rafael</strong> está digitando…
          </Marcador>
        </div>
      </div>
    </ComponentPreview>
  );
}
