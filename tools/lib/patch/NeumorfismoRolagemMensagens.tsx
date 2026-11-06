import { Children, isValidElement, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactElement, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Globe, Image as Imagem, Paperclip, Plus, RotateCw, Sparkles, Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ComponentPreview } from "@/components/DSComponents";
import { Avatar } from "@/components/estilo/NeumorfismoAvatares";
import { Balao } from "@/components/estilo/NeumorfismoBaloes";
import { Mensagem } from "@/components/estilo/NeumorfismoMensagens";
import { Marcador } from "@/components/estilo/NeumorfismoMarcadores";
import { MenuSuspenso } from "@/components/estilo/NeumorfismoMenuSuspenso";

/**
 * Vitrine do MessageScroller no estilo Neumorfismo (componente MessageScroller do pacote Neumorphic UI v3.2.0): o
 * registro de uma conversa que fica preso à mensagem mais nova enquanto o leitor está no fim. Enquanto está preso,
 * o texto que chega aos poucos mantém a linha mais recente à vista; se a pessoa sobe para reler, a rolagem
 * automática recua e a posição dela é respeitada. Uma vez nova marcada como âncora (em geral a da pessoa) se
 * acomoda perto do topo, deixando um pedaço da troca anterior visível (`espiar`, 56px por padrão), para a resposta
 * começar à vista sem um salto. Quando chega conteúdo fora da vista, aparece uma tecla convexa com a seta para baixo e
 * um ponto da marca; clicar leva à mensagem mais recente e religa a rolagem automática. O conteúdo é um role="log"
 * educado (aria-live="polite", aria-relevant="additions"), a área é focável para rolar pelo teclado e a tecla sai da
 * ordem de Tab quando você já está no fim. A vitrine monta um chat somente leitura num cartão convexo: o cabeçalho,
 * o poço onde o registro rola, e o compositor com a próxima pergunta da fila; "Enviar" manda a pergunta e a resposta
 * chega palavra por palavra, com um cursor que pisca; o botão de reiniciar recomeça. Entra numa seção nova do
 * neumorfismo ("MessageScroller", depois do Message) e só é usado quando ESTILO.id === "neumorfismo". As classes
 * neu-mscroll*, neu-chat*, neu-composer*, neu-md e neu-caret vêm de src/styles/estilo.css.
 */

interface RolagemMensagensProps {
  /** As mensagens; uma com `ancora` (em geral a da pessoa) é envolvida como âncora */
  children?: ReactNode;
  /** Falso desliga a rolagem automática */
  rolagemAutomatica?: boolean;
  /** Pixels da troca anterior que ficam à vista acima de uma âncora nova (56 por padrão) */
  espiar?: number;
  /** aria-busy enquanto uma resposta chega */
  ocupado?: boolean;
  altura?: number | string;
  rotulo?: string;
  className?: string;
  style?: CSSProperties;
}

const noFim = (el: HTMLElement) => el.scrollHeight - el.scrollTop - el.clientHeight < 24;

export function RolagemMensagens({ children, rolagemAutomatica = true, espiar = 56, ocupado, altura, rotulo = "Conversa", className, style }: RolagemMensagensProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const preso = useRef(true);
  const ultimaAncora = useRef<Element | null>(null);
  const [embaixo, setEmbaixo] = useState(true);
  const [novo, setNovo] = useState(false);
  // o ResizeObserver é criado uma vez; as opções mais novas ficam aqui
  const opcoes = useRef({ rolagemAutomatica, espiar });
  opcoes.current = { rolagemAutomatica, espiar };

  function ate(fim: boolean, suave: boolean) {
    const el = viewport.current;
    if (!el) return;
    const reduz = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (typeof el.scrollTo === "function") el.scrollTo({ top: el.scrollHeight, behavior: suave && !reduz ? "smooth" : "auto" });
    else el.scrollTop = el.scrollHeight;
    if (fim) {
      preso.current = true;
      setEmbaixo(true);
      setNovo(false);
    }
  }

  function aoRolar() {
    const el = viewport.current;
    if (!el) return;
    const b = noFim(el);
    preso.current = b;
    setEmbaixo(b);
    if (b) setNovo(false);
  }

  useEffect(() => {
    ate(true, false);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    const c = conteudo.current;
    if (!el || !c || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const ancoras = c.querySelectorAll<HTMLElement>('[data-scroll-anchor="true"]');
      const ultima = ancoras[ancoras.length - 1];
      const { rolagemAutomatica: auto, espiar: pico } = opcoes.current;
      if (ultima && ultima !== ultimaAncora.current) {
        const nova = ultimaAncora.current !== null;
        ultimaAncora.current = ultima;
        if (nova && auto) {
          const topo = ultima.offsetTop - pico;
          if (typeof el.scrollTo === "function") el.scrollTo({ top: Math.max(0, topo), behavior: "smooth" });
          preso.current = false;
          return;
        }
      }
      if (preso.current && auto) el.scrollTop = el.scrollHeight;
      else if (!noFim(el)) setNovo(true);
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  const filhos = Children.toArray(children)
    .filter(Boolean)
    .map((c) => (isValidElement(c) && (c as ReactElement<{ ancora?: boolean }>).props.ancora ? <div key={c.key} data-scroll-anchor="true">{c}</div> : c));

  return (
    <div className={["neu-mscroll", className].filter(Boolean).join(" ")} style={{ height: altura, ...style }}>
      <div ref={viewport} className="neu-mscroll__viewport" onScroll={aoRolar} tabIndex={0} aria-label={rotulo}>
        <div ref={conteudo} className="neu-mscroll__content" role="log" aria-live="polite" aria-relevant="additions" aria-busy={ocupado ? "true" : undefined}>
          {filhos}
        </div>
      </div>
      <button
        type="button"
        className={["neu-mscroll__btn", !embaixo && "neu-mscroll__btn--on", novo && "neu-mscroll__btn--new"].filter(Boolean).join(" ")}
        tabIndex={embaixo ? -1 : 0}
        aria-hidden={embaixo ? "true" : undefined}
        onClick={() => ate(true, true)}
      >
        <ArrowDown aria-hidden="true" size={16} />
        <span className="sr-only">Ir para a mensagem mais recente</span>
        {novo && <span className="neu-mscroll__dot" aria-hidden="true" />}
      </button>
    </div>
  );
}

interface TurnoFila {
  id: string;
  papel: "pessoa" | "assistente";
  texto: string;
  transmitindo?: boolean;
}

const ROTEIRO: [string, string][] = [
  [
    "Estou montando o chat do nosso app e a rolagem está me deixando maluco. Toda vez que a IA transmite uma resposta, a conversa inteira pula.",
    "É o clássico problema de rolagem com streaming. Envolva a lista no `RolagemMensagens` e deixe a `rolagemAutomatica` ligada — a área fica presa ao fim enquanto o texto chega, e a pessoa sempre vê a frase mais recente se formando.\n\nO detalhe importante: ele só rola sozinho enquanto o leitor já está no fim. Se a pessoa subir para reler algo, a rolagem automática para e a posição dela é preservada.",
  ],
  [
    "Certo, mas quando alguém envia uma nova mensagem ainda parece brusco — como se a conversa recarregasse do topo.",
    "A ancoragem de turno resolve isso. Marque com `ancora` a mensagem que deve se acomodar perto do topo, em vez de saltar para o fim do documento.\n\nUma pequena parte da troca anterior continua visível acima da âncora, então o contexto não se perde.",
  ],
  [
    "E se a pessoa tiver subido para reler uma resposta antiga? Não quero puxá-la de volta para baixo.",
    "Não vai. A rolagem automática só age quando a área já está no fim; subir é uma escolha deliberada, e o lugar dela no histórico fica parado mesmo com novas palavras chegando abaixo.\n\nQuando há conteúdo ainda não visto, o botão com a seta aparece no rodapé da área. Um toque leva à mensagem mais recente e reativa a rolagem automática.",
  ],
  [
    "Última: isso funciona com tecnologia assistiva?",
    "O conteúdo usa `role=\"log\"` com `aria-relevant=\"additions\"`, então leitores de tela anunciam as novas mensagens.\n\nO botão de rolagem é um `<button>` de verdade com rótulo para leitores de tela, e sai da ordem de tabulação quando você já está no fim — sem paradas de foco fantasmas.",
  ],
];

/** Parágrafos separados por linha em branco e código em linha entre crases */
function Texto({ texto }: { texto: string }) {
  return (
    <div className="neu-md">
      {texto.split("\n\n").map((par, i) => (
        <p key={i}>{par.split("`").map((s, j) => (j % 2 ? <code key={j}>{s}</code> : s))}</p>
      ))}
    </div>
  );
}

const inicial = (): TurnoFila[] => [
  { id: "u0", papel: "pessoa", texto: ROTEIRO[0][0] },
  { id: "a0", papel: "assistente", texto: ROTEIRO[0][1] },
];

export default function NeumorfismoRolagemMensagens() {
  const [turnos, setTurnos] = useState<TurnoFila[]>(inicial);
  const [ocupado, setOcupado] = useState(false);
  const relogio = useRef<ReturnType<typeof setInterval> | null>(null);
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rodada = turnos.filter((x) => x.papel === "pessoa").length;
  const proxima = ROTEIRO[rodada] ? ROTEIRO[rodada][0] : null;

  useEffect(
    () => () => {
      if (relogio.current) clearInterval(relogio.current);
      if (espera.current) clearTimeout(espera.current);
    },
    [],
  );

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!proxima || ocupado) return;
    const resposta = ROTEIRO[rodada][1];
    const palavras = resposta.split(/(\s+)/);
    const id = "a" + rodada;
    let k = 0;
    setOcupado(true);
    setTurnos((cur) => cur.concat([{ id: "u" + rodada, papel: "pessoa", texto: proxima }]));
    espera.current = setTimeout(() => {
      setTurnos((cur) => cur.concat([{ id, papel: "assistente", texto: "", transmitindo: true }]));
      relogio.current = setInterval(() => {
        k += 2;
        const pronto = k >= palavras.length;
        setTurnos((cur) => cur.map((x) => (x.id === id ? { id, papel: "assistente", texto: palavras.slice(0, k).join(""), transmitindo: !pronto } : x)));
        if (pronto) {
          if (relogio.current) clearInterval(relogio.current);
          setOcupado(false);
        }
      }, 35);
    }, 700);
  }

  function reiniciar() {
    if (relogio.current) clearInterval(relogio.current);
    if (espera.current) clearTimeout(espera.current);
    setOcupado(false);
    setTurnos(inicial());
  }

  return (
    <ComponentPreview
      title="MessageScroller"
      description="O registro de uma conversa que fica preso à mensagem mais nova enquanto o leitor está no fim, ancora cada vez nova perto do topo e oferece uma tecla para ir à mais recente quando há conteúdo fora da vista."
      whenToUse={["Chats e assistentes em que a resposta chega aos poucos (streaming)", "Registros ao vivo de atividade ou de eventos", "Qualquer lista que cresce embaixo e precisa respeitar quem subiu para reler"]}
      whenNotToUse={["Listas estáticas, que não recebem itens novos: use uma lista ou uma tabela comum", "Feeds paginados ou infinitos para cima: aqui o fim é o mais novo", "Mensagens soltas na tela: use o Toast ou o Alert"]}
      accessibility={[
        "O conteúdo é role=\"log\" com aria-live=\"polite\" e aria-relevant=\"additions\": os leitores de tela anunciam as mensagens novas sem interromper",
        "aria-busy marca o registro como ocupado enquanto uma resposta chega",
        "A área que rola é focável (tabIndex 0), com nome, para rolar pelo teclado; o foco é um anel sólido de 2px",
        "A tecla de ir para a mais recente é um button de verdade, com texto para leitor de tela, e sai da ordem de Tab (e fica aria-hidden) quando você já está no fim",
        "A rolagem suave respeita \"menos movimento\": com a preferência ativa, o salto é direto; o cursor só pisca com \"movimento\" permitido",
      ]}
      code={`<RolagemMensagens ocupado={ocupado} rotulo="Conversa com o assistente">
  {turnos.map((t) => (
    <Mensagem key={t.id} lado={t.papel === "pessoa" ? "fim" : "inicio"} ancora={t.papel === "pessoa"}
      avatar={t.papel === "pessoa" ? null : <Avatar icone={<Sparkles size={14} />} tamanho="pp" tom="marca" nome="Assistente" />}>
      {t.texto ? <Balao>{t.texto}</Balao> : <Marcador carregando brilho>Pensando…</Marcador>}
    </Mensagem>
  ))}
</RolagemMensagens>`}
    >
      <div>
        <div className="neu-chat">
          <div className="neu-chat__head">
            <div>
              <h3 className="neu-chat__title">Nova conversa</h3>
              <p className="neu-chat__sub">Como posso ajudar hoje?</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" size="icon" variant="outline" className="neu-ib neu-ib--pequeno neu-btn--convex" aria-label="Reiniciar conversa" disabled={ocupado} onClick={reiniciar}>
                  <RotateCw aria-hidden="true" size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reiniciar</TooltipContent>
            </Tooltip>
          </div>
          <div className="neu-chat__body">
            <RolagemMensagens ocupado={ocupado} rotulo="Conversa com o assistente">
              {turnos.map((x) => (
                <Mensagem
                  key={x.id}
                  lado={x.papel === "pessoa" ? "fim" : "inicio"}
                  ancora={x.papel === "pessoa"}
                  avatar={x.papel === "pessoa" ? null : <Avatar icone={<Sparkles size={14} />} tamanho="pp" tom="marca" nome="Assistente" />}
                >
                  {x.texto ? (
                    <Balao className={x.transmitindo ? "neu-caret-host" : undefined}>
                      <span className={x.transmitindo ? "neu-caret" : undefined}>
                        <Texto texto={x.texto} />
                      </span>
                    </Balao>
                  ) : (
                    <Marcador carregando brilho>Pensando…</Marcador>
                  )}
                </Mensagem>
              ))}
            </RolagemMensagens>
          </div>
          <form className="neu-chat__foot" onSubmit={enviar}>
            <div className="neu-composer">
              <div className={`neu-composer__text${ocupado ? " neu-composer__text--busy" : ""}`}>
                {proxima || <span style={{ color: "hsl(var(--muted-foreground))" }}>Nenhuma mensagem na fila. Reinicie a conversa.</span>}
              </div>
              <div className="neu-composer__bar">
                <MenuSuspenso
                  lado="top"
                  largura={220}
                  rotulo="Adicionar"
                  gatilho={
                    <Button type="button" size="icon" variant="outline" className="neu-ib neu-ib--pequeno neu-btn--convex" aria-label="Adicionar arquivos">
                      <Plus aria-hidden="true" size={16} />
                    </Button>
                  }
                  itens={[
                    { rotulo: "Adicionar fotos e arquivos", icone: <Paperclip size={16} /> },
                    { divisor: true },
                    { rotulo: "Criar imagem", icone: <Imagem size={16} /> },
                    { rotulo: "Pesquisa aprofundada", icone: <Telescope size={16} /> },
                    { rotulo: "Busca na web", icone: <Globe size={16} /> },
                  ]}
                />
                <Button type="submit" size="icon" className="neu-ib neu-ib--pequeno" aria-label="Enviar" disabled={!proxima || ocupado}>
                  <ArrowUp aria-hidden="true" size={16} />
                </Button>
              </div>
            </div>
          </form>
        </div>
        <p className="neu-help" style={{ textAlign: "center" }}>Demonstração somente leitura. Pressione enviar para mandar a próxima mensagem.</p>
      </div>
    </ComponentPreview>
  );
}
