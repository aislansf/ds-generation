import { useId, useState, type ReactNode } from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { CalendarDays, Clock } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do HoverCard no estilo Neumorfismo (componente HoverCard do pacote Neumorphic UI v3.2.0): um cartão de
 * pré-visualização que abre quando o ponteiro repousa num link, ou quando o link recebe o foco do teclado; serve
 * para perfis e prévias de link. O gatilho é o link sublinhado na cor secundária (no lugar do azul royal); o
 * painel é uma laje convexa de 280px (ou a largura pedida), 10px abaixo do gatilho. Montado com o HoverCard do DS
 * (Radix): abre com atraso (300ms por padrão, 10ms no exemplo), fecha ao sair, ao perder o foco e com Esc, e se
 * posiciona para ficar dentro da janela. O painel é role="tooltip" ligado ao gatilho por aria-describedby: não
 * ponha controles interativos nele, porque quem usa leitor de tela nunca "passa o mouse" para alcançá-los (as
 * ações ficam na página de destino). O perfil traz um avatar (núcleo da família neu-avatar*, que o componente
 * Avatar completa), nome, texto e uma linha de detalhe. Entra numa seção nova do neumorfismo ("HoverCard",
 * depois do Popover) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-hovercard*, neu-profile* e
 * neu-avatar* vêm de src/styles/estilo.css.
 */

type Tom = "accent" | "royal" | "success";
type Status = "online" | "away" | "busy" | "offline";

interface AvatarProps {
  /** Nome completo: vira o nome acessível (role="img") e a dica do avatar */
  nome: string;
  iniciais?: string;
  tom?: Tom;
  tamanho?: "sm" | "md" | "lg" | "xl";
  status?: Status;
}

const ROTULO_STATUS: Record<Status, string> = { online: "online", away: "ausente", busy: "ocupado", offline: "offline" };

function iniciaisDe(nome: string) {
  return nome.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}

/** Avatar de iniciais em disco convexo, com a bolinha de status opcional (o núcleo do componente Avatar do pacote). */
export function AvatarPerfil({ nome, iniciais, tom, tamanho = "md", status }: AvatarProps) {
  return (
    <span className={`neu-avatar neu-avatar--${tamanho}`} role="img" aria-label={status ? `${nome} (${ROTULO_STATUS[status]})` : nome} title={nome}>
      <span className={tom ? `neu-avatar__fallback neu-avatar__fallback--${tom}` : "neu-avatar__fallback"} aria-hidden="true">{iniciais ?? iniciaisDe(nome)}</span>
      {status && <span className={`neu-avatar__badge neu-avatar__badge--${status}`} aria-hidden="true" />}
    </span>
  );
}

interface CartaoProps {
  /** O texto do link que serve de gatilho */
  gatilho: string;
  largura?: number;
  alinhamento?: "start" | "center" | "end";
  lado?: "bottom" | "top";
  /** Atrasos em milissegundos; o padrão do pacote é 300 para abrir e 150 para fechar */
  atrasoAbrir?: number;
  atrasoFechar?: number;
  children: ReactNode;
}

export function CartaoPrevia({ gatilho, largura = 280, alinhamento = "center", lado = "bottom", atrasoAbrir = 300, atrasoFechar = 150, children }: CartaoProps) {
  const uid = useId();
  const [aberto, setAberto] = useState(false);
  return (
    <HoverCard open={aberto} onOpenChange={setAberto} openDelay={atrasoAbrir} closeDelay={atrasoFechar}>
      <HoverCardTrigger asChild>
        <button type="button" className="neu-hovercard__link" aria-describedby={aberto ? uid : undefined}>{gatilho}</button>
      </HoverCardTrigger>
      <HoverCardPrimitive.Portal>
        <HoverCardContent
          id={uid}
          role="tooltip"
          side={lado}
          align={alinhamento}
          sideOffset={10}
          collisionPadding={8}
          className="neu-hovercard__panel"
          style={{ width: largura }}
        >
          {children}
        </HoverCardContent>
      </HoverCardPrimitive.Portal>
    </HoverCard>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoHoverCards() {
  return (
    <ComponentPreview
      title="HoverCard"
      description="Cartão de pré-visualização que abre quando o ponteiro repousa num link ou quando ele recebe o foco do teclado. Serve para perfis e prévias de link, sem tirar a pessoa do que está lendo."
      whenToUse={["Perfis e pré-visualizações de um link dentro de um texto", "Detalhes de uma pessoa ou de um item que a página de destino mostra por inteiro"]}
      whenNotToUse={["Ações ou controles: ponha-os na página de destino (quem usa leitor de tela nunca \"passa o mouse\")", "Informação essencial: ela precisa estar visível"]}
      accessibility={["Abre com o foco do teclado e com o mouse; fecha ao sair, ao perder o foco e com Esc", "O cartão é ligado ao link por aria-describedby; mantenha-o sem controles interativos", "O avatar tem nome acessível (e o status, quando há)", "O cartão se posiciona para ficar dentro da janela"]}
      code={`<CartaoPrevia gatilho="@neumorphic-ui" largura={300} alinhamento="start" atrasoAbrir={10} atrasoFechar={100}>
  <div className="neu-profile">
    <AvatarPerfil nome="Neumorphic UI" iniciais="NU" tom="accent" />
    <div>
      <p className="neu-profile__name">@neumorphic-ui</p>
      <p className="neu-profile__text">O design system tátil — criado e mantido pelo time de produto.</p>
      <p className="neu-profile__meta"><CalendarDays size={13} /> Desde dezembro de 2021</p>
    </div>
  </div>
</CartaoPrevia>`}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
        <div>
          <Legenda>Passe o mouse ou foque com Tab</Legenda>
          <CartaoPrevia gatilho="@neumorphic-ui" largura={300} alinhamento="start" atrasoAbrir={10} atrasoFechar={100}>
            <div className="neu-profile">
              <AvatarPerfil nome="Neumorphic UI" iniciais="NU" tom="accent" />
              <div>
                <p className="neu-profile__name">@neumorphic-ui</p>
                <p className="neu-profile__text">O design system tátil — criado e mantido pelo time de produto.</p>
                <p className="neu-profile__meta"><CalendarDays aria-hidden="true" size={13} />Desde dezembro de 2021</p>
              </div>
            </div>
          </CartaoPrevia>
        </div>
        <div style={{ maxWidth: 360 }}>
          <Legenda>Em um texto</Legenda>
          <p style={{ margin: 0, fontSize: 14, lineHeight: "22px", color: "hsl(var(--foreground))" }}>
            Atendimento registrado por{" "}
            <CartaoPrevia gatilho="Carla Souza" largura={260}>
              <div className="neu-profile">
                <AvatarPerfil nome="Carla Souza" status="online" />
                <div>
                  <p className="neu-profile__name">Carla Souza</p>
                  <p className="neu-profile__text">Consultora · Unidade Capital</p>
                  <p className="neu-profile__meta"><Clock aria-hidden="true" size={13} />128 atendimentos no mês</p>
                </div>
              </div>
            </CartaoPrevia>{" "}
            às 14h32.
          </p>
        </div>
      </div>
    </ComponentPreview>
  );
}
