import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Check, CheckCheck, CircleAlert, Clock } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import { Avatar } from "@/components/estilo/NeumorfismoAvatares";

/**
 * Vitrine do Bubble no estilo Neumorfismo (componente Bubble do pacote Neumorphic UI v3.2.0): o balão de uma mensagem de
 * conversa, comentário ou fio de assistente. O lado "inicio" é o do outro (à esquerda, padrão) e "fim" é o seu
 * (à direita). O texto tem 13px/20px num balão de cantos de 20px, com no máximo 80% da linha (520px); palavras longas
 * e links quebram e as quebras de linha são mantidas. Variantes: "primaria" (padrão de quem escreve) leva o degradê da
 * segunda cor da marca com texto claro; "neutra" (padrão do outro lado) é convexa com borda de aresta; "destaque" é um
 * balão no tom da marca com texto semibold, para uma confirmação; "afundada" é um balão em poço para notas do sistema.
 * A ponta é o canto mais perto de quem fala, que aperta para 6px. Dentro de GrupoBalao as mensagens seguidas de quem
 * fala se juntam (cantos de 8px), só a primeira mostra o nome, só a última mostra o avatar e a hora, e as anteriores
 * guardam o espaço do avatar para o texto ficar alinhado. As reações são uma pílula convexa sobre a borda de baixo (do
 * lado oposto à ponta), com anel na cor do fundo; "minha" a pinta no tom da marca e as contagens saem em mono. A hora
 * é mono em 10px e, nas suas mensagens, o estado ganha um ícone: enviando (relógio), enviada (✓), entregue (✓✓), lida
 * (✓✓ na cor secundária) ou erro (alerta em vermelho), sempre também em texto para leitor de tela. Entra numa seção
 * nova do neumorfismo ("Bubble", depois do Avatar) e só é usado quando ESTILO.id === "neumorfismo". As classes
 * neu-bubble* vêm de src/styles/estilo.css; a coluna da conversa é neu-bubble-chat (o pacote a chama de neu-chat, mas o
 * mesmo nome é usado por outro componente dele).
 */

export type LadoBalao = "inicio" | "fim";
export type VarianteBalao = "primaria" | "neutra" | "destaque" | "afundada";
export type StatusBalao = "enviando" | "enviada" | "entregue" | "lida" | "erro";

// as classes seguem o pacote (start/end, primary/muted/accent/inset)
const LADO: Record<LadoBalao, string> = { inicio: "start", fim: "end" };
const VARIANTE: Record<VarianteBalao, string> = { primaria: "primary", neutra: "muted", destaque: "accent", afundada: "inset" };
const STATUS: Record<StatusBalao, { classe: string; rotulo: string }> = {
  enviando: { classe: "sending", rotulo: "Enviando" },
  enviada: { classe: "sent", rotulo: "Enviada" },
  entregue: { classe: "delivered", rotulo: "Entregue" },
  lida: { classe: "read", rotulo: "Lida" },
  erro: { classe: "error", rotulo: "Falha no envio" },
};

export interface ReacaoBalao {
  emoji?: string;
  icone?: ReactNode;
  texto?: string;
  contagem?: number;
  /** Nome da reação para leitor de tela ("joinha") */
  rotulo?: string;
  /** Uma reação sua: fica no tom da marca */
  minha?: boolean;
}

type PosicaoBalao = "single" | "first" | "middle" | "last";

export interface BalaoProps {
  children?: ReactNode;
  lado?: LadoBalao;
  variante?: VarianteBalao;
  /** Um Avatar pequeno; só aparece do lado "inicio" */
  avatar?: ReactNode;
  nome?: string;
  hora?: string;
  dataHora?: string;
  status?: StatusBalao;
  reacoes?: ReacaoBalao[];
  rotuloReacoes?: string;
  /** Posição no grupo; o GrupoBalao preenche */
  posicao?: PosicaoBalao;
  className?: string;
  style?: CSSProperties;
}

function IconeStatus({ status }: { status: StatusBalao }) {
  const p = { size: 13, strokeWidth: 2.5, "aria-hidden": true } as const;
  if (status === "lida" || status === "entregue") return <CheckCheck {...p} />;
  if (status === "erro") return <CircleAlert {...p} />;
  if (status === "enviando") return <Clock {...p} />;
  return <Check {...p} />;
}

export function Balao({ children, lado = "inicio", variante, avatar, nome, hora, dataHora, status, reacoes, rotuloReacoes, posicao = "single", className, style }: BalaoProps) {
  const v = variante ?? (lado === "fim" ? "primaria" : "neutra");
  const temReacoes = !!reacoes && reacoes.length > 0;
  const rotuloR = rotuloReacoes || (temReacoes ? "Reações: " + reacoes.map((x) => x.rotulo || x.emoji).join(", ") : undefined);
  const classes = ["neu-bubble", `neu-bubble--${LADO[lado]}`, `neu-bubble--${VARIANTE[v]}`, `neu-bubble--${posicao}`, temReacoes && "neu-bubble--reacted", className].filter(Boolean).join(" ");
  return (
    <div className={classes} style={style}>
      {avatar && lado === "inicio" && <span className={`neu-bubble__avatar${posicao === "first" || posicao === "middle" ? " neu-bubble__avatar--hidden" : ""}`}>{avatar}</span>}
      <div className="neu-bubble__stack">
        {nome && (posicao === "single" || posicao === "first") && <span className="neu-bubble__name">{nome}</span>}
        <div className="neu-bubble__content">
          {children}
          {temReacoes && (
            <span className="neu-bubble__reactions" role="img" aria-label={rotuloR}>
              {reacoes.map((x, i) => (
                <span key={i} className={`neu-bubble__reaction${x.minha ? " neu-bubble__reaction--mine" : ""}`} aria-hidden="true">
                  {x.emoji ?? x.icone}
                  {x.contagem != null && x.contagem > 1 && <b>{x.contagem}</b>}
                  {x.texto}
                </span>
              ))}
            </span>
          )}
        </div>
        {(hora || status) && (
          <span className="neu-bubble__meta">
            {hora && <time dateTime={dataHora}>{hora}</time>}
            {status && (
              <span className={`neu-bubble__status neu-bubble__status--${STATUS[status].classe}`}>
                <IconeStatus status={status} />
                <span className="sr-only">{STATUS[status].rotulo}</span>
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

interface GrupoBalaoProps {
  children?: ReactNode;
  lado?: LadoBalao;
  avatar?: ReactNode;
  nome?: string;
  /** Nome do grupo para leitor de tela */
  rotulo?: string;
  className?: string;
}

/** Empilha as mensagens seguidas de quem fala e repassa posição, lado, avatar e nome aos balões */
export function GrupoBalao({ children, lado, avatar, nome, rotulo, className }: GrupoBalaoProps) {
  const filhos = Children.toArray(children).filter(isValidElement) as ReactElement<BalaoProps>[];
  const n = filhos.length;
  return (
    <div className={["neu-bubble-group", className].filter(Boolean).join(" ")} role={rotulo ? "group" : undefined} aria-label={rotulo}>
      {filhos.map((c, i) =>
        cloneElement(c, {
          key: c.key ?? i,
          posicao: n === 1 ? "single" : i === 0 ? "first" : i === n - 1 ? "last" : "middle",
          lado: c.props.lado || lado,
          avatar: c.props.avatar || avatar,
          nome: c.props.nome || nome,
        }),
      )}
    </div>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 14px" }}>{children}</p>;
}

/** O poço onde a conversa fica, como nas outras vitrines de lista */
function Poco({ children, largura }: { children: ReactNode; largura: number }) {
  return (
    <div style={{ maxWidth: largura, padding: 16, borderRadius: 16, background: "var(--neu-inset)", boxShadow: "var(--neu-inset-sh)" }}>
      {children}
    </div>
  );
}

const MARINA = <Avatar tamanho="pp" nome="Marina Lopes" tom="azul" />;

export default function NeumorfismoBaloes() {
  return (
    <ComponentPreview
      title="Bubble"
      description="O balão de uma mensagem de conversa, comentário ou fio de assistente. O grupo junta as mensagens seguidas de quem fala, mostrando o nome na primeira e o avatar e a hora na última."
      whenToUse={["Conversas, atendimentos e comentários em fio", "Respostas de um assistente ou de um sistema que escreve em turnos", "Notas do sistema dentro da conversa (variante afundada)"]}
      whenNotToUse={["Avisos e feedback da tela: use o Alert ou o Toast", "Listas de itens ou registros: use a tabela ou o Item", "Texto corrido de uma página: use parágrafos"]}
      accessibility={[
        "O texto do balão é conteúdo comum, lido em ordem; o nome de quem fala vem antes da primeira mensagem do grupo",
        "O grupo pode ganhar nome (role=\"group\" com aria-label) para os leitores de tela",
        "As reações são um único role=\"img\" nomeado \"Reações: joinha, fogo\" (ou pelo texto de rotuloReacoes); os emojis soltos ficam escondidos",
        "O estado de envio nunca é só um ícone: \"Enviada\", \"Entregue\", \"Lida\", \"Enviando\" e \"Falha no envio\" também saem como texto para leitor de tela",
        "A hora usa o elemento time com dataHora; o texto claro do balão primário tem contraste de pelo menos 4,5:1 com o degradê",
        "Em modo de alto contraste, o balão ganha uma borda sólida",
      ]}
      code={`<div className="neu-bubble-chat">
  <Balao lado="fim">Oi! Tudo certo por aí?</Balao>

  <GrupoBalao nome="Marina Lopes · Consultora" avatar={<Avatar tamanho="pp" nome="Marina Lopes" tom="azul" />}>
    <Balao>Bom dia! Recebi o diagnóstico.</Balao>
    <Balao hora="09:12">Podemos agendar a visita para quinta, 14h?</Balao>
  </GrupoBalao>

  <GrupoBalao lado="fim">
    <Balao>Pode sim. Confirmo com a empresa ainda hoje.</Balao>
    <Balao hora="09:15" status="lida" reacoes={[{ emoji: "👍", contagem: 2, rotulo: "2 joinhas", minha: true }]}>
      Vou anexar o plano de ação na pasta do atendimento.
    </Balao>
  </GrupoBalao>

  <Balao variante="afundada" hora="09:16">Marina adicionou plano-de-acao.pdf ao atendimento.</Balao>
  <Balao lado="fim" variante="destaque" hora="09:20" status="enviando">Visita confirmada para quinta, 14h.</Balao>
</div>`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "start" }}>
        <div>
          <Legenda>Exemplo de referência</Legenda>
          <Poco largura={400}>
            <div className="neu-bubble-chat" style={{ gap: 28 }}>
              <Balao lado="fim">Oi! Tudo certo por aí?</Balao>
              <GrupoBalao>
                <Balao variante="neutra">Oi! Quer ver os balões de conversa?</Balao>
                <Balao variante="neutra" reacoes={[{ emoji: "👍", rotulo: "joinha" }]}>
                  Eu agrupo mensagens, troco de lado e deixo a conversa fácil de acompanhar.
                </Balao>
              </GrupoBalao>
              <Balao lado="fim">Claro. Manda a sua melhor demonstração.</Balao>
              <Balao
                variante="neutra"
                reacoes={[
                  { emoji: "👍", rotulo: "joinha" },
                  { emoji: "🔥", rotulo: "fogo" },
                  { emoji: "👀", rotulo: "olhos" },
                  { texto: "+2", rotulo: "e mais 2" },
                ]}
              >
                Pronto. Você está lendo uma demonstração que se demonstra sozinha. Bem meta.
              </Balao>
            </div>
          </Poco>
        </div>
        <div>
          <Legenda>Atendimento com nomes, horários e status</Legenda>
          <Poco largura={420}>
            <div className="neu-bubble-chat">
              <span className="neu-bubble-chat__day">Hoje</span>
              <GrupoBalao nome="Marina Lopes · Consultora" avatar={MARINA}>
                <Balao>Bom dia! Recebi o diagnóstico da Doces da Serra.</Balao>
                <Balao hora="09:12">Podemos agendar a visita para quinta, 14h?</Balao>
              </GrupoBalao>
              <GrupoBalao lado="fim">
                <Balao>Pode sim. Confirmo com a empresa ainda hoje.</Balao>
                <Balao hora="09:15" status="lida" reacoes={[{ emoji: "👍", contagem: 2, rotulo: "2 joinhas", minha: true }]}>
                  Vou anexar o plano de ação na pasta do atendimento.
                </Balao>
              </GrupoBalao>
              <Balao variante="afundada" avatar={MARINA} hora="09:16">Marina adicionou plano-de-acao.pdf ao atendimento.</Balao>
              <Balao lado="fim" variante="destaque" hora="09:20" status="enviando">Visita confirmada para quinta, 14h.</Balao>
            </div>
          </Poco>
        </div>
      </div>
    </ComponentPreview>
  );
}
