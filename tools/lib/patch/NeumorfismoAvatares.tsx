import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { User } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Avatar no estilo Neumorfismo (componente Avatar do pacote Neumorphic UI v3.2.0): a foto ou as iniciais de
 * uma pessoa num disco convexo pequeno, com um selo de status opcional. O disco é um anel convexo (borda na cor
 * da aresta e relevo suave) que guarda o conteúdo com 2 a 5px de folga, conforme o tamanho: pp 28px, m 40px
 * (padrão), g 56px e gg 80px. A foto entra com um fade quando termina de carregar; enquanto carrega, ou se falhar, o
 * fallback aparece no lugar de uma imagem quebrada: as iniciais do nome (primeira e última palavra: "Ana Souza" vira
 * "AS"), um texto próprio ou um ícone, num poço afundado. As iniciais usam a cor do texto, ou o tom (marca, azul ou
 * sucesso) para distinguir pessoas. O formato quadrado serve para organizações e marcas; tonsDeCinza deixa a foto
 * em preto e branco para pessoas inativas. O status põe uma bolinha no canto inferior direito, com anel na cor do
 * fundo: online acende em verde, ausente é âmbar, ocupado é vermelho e offline é oca; o selo aceita também
 * qualquer nó pequeno, como uma contagem numa pílula. O GrupoAvatar sobrepõe os avatares em 18% do tamanho, cada um
 * com um anel na cor do fundo, e termina com um disco "+N" em fonte mono; ao passar o mouse, cada avatar sobe 2px.
 * Entra numa seção nova do neumorfismo ("Avatar", depois da Sidebar · Workspace) e só é usado quando ESTILO.id ===
 * "neumorfismo". As classes neu-avatar* vêm de src/styles/estilo.css (o núcleo é o mesmo do HoverCard).
 */

export type TamanhoAvatar = "pp" | "m" | "g" | "gg";
export type StatusAvatar = "online" | "ausente" | "ocupado" | "offline";
export type TomAvatar = "marca" | "azul" | "sucesso";

// as classes seguem o pacote (sm, md, lg, xl; accent, royal, success; online, away, busy, offline)
const TAMANHO: Record<TamanhoAvatar, string> = { pp: "sm", m: "md", g: "lg", gg: "xl" };
const TOM: Record<TomAvatar, string> = { marca: "accent", azul: "royal", sucesso: "success" };
const STATUS: Record<StatusAvatar, { classe: string; rotulo: string }> = {
  online: { classe: "online", rotulo: "Online" },
  ausente: { classe: "away", rotulo: "Ausente" },
  ocupado: { classe: "busy", rotulo: "Ocupado" },
  offline: { classe: "offline", rotulo: "Offline" },
};

export interface AvatarProps {
  src?: string;
  /** Nome acessível; sem ele vale o nome */
  alt?: string;
  nome?: string;
  /** Texto no lugar das iniciais */
  fallback?: string;
  /** Ícone no lugar das iniciais */
  icone?: ReactNode;
  tom?: TomAvatar;
  tamanho?: TamanhoAvatar;
  forma?: "circulo" | "quadrado";
  tonsDeCinza?: boolean;
  status?: StatusAvatar;
  /** Qualquer nó pequeno no canto (uma contagem, por exemplo) */
  selo?: ReactNode;
  titulo?: string;
  className?: string;
  style?: CSSProperties;
}

/** As iniciais do nome: primeira e última palavra ("Ana Souza" → "AS"), ou as duas primeiras letras de uma só */
export function iniciaisDe(nome?: string) {
  const w = String(nome || "").trim().split(/\s+/).filter(Boolean);
  if (!w.length) return "?";
  return (w.length > 1 ? w[0].charAt(0) + w[w.length - 1].charAt(0) : w[0].slice(0, 2)).toUpperCase();
}

export function Avatar({ src, alt, nome, fallback, icone, tom, tamanho = "m", forma = "circulo", tonsDeCinza, status, selo, titulo, className, style }: AvatarProps) {
  const [imagem, setImagem] = useState<"ocioso" | "carregada" | "erro">("ocioso");
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete) setImagem(el.naturalWidth > 0 ? "carregada" : "erro");
    else setImagem("ocioso");
  }, [src]);
  const mostraImagem = !!src && imagem !== "erro";
  const rotulo = alt || nome;
  const rotuloSelo = status ? STATUS[status].rotulo : typeof selo === "string" ? selo : null;
  const temSelo = !!selo || !!status;
  const seloNo = !!selo && typeof selo === "object";
  const classes = ["neu-avatar", `neu-avatar--${TAMANHO[tamanho]}`, forma === "quadrado" && "neu-avatar--square", tonsDeCinza && "neu-avatar--gray", className].filter(Boolean).join(" ");
  return (
    <span className={classes} role="img" aria-label={rotulo ? rotulo + (rotuloSelo ? ` (${rotuloSelo})` : "") : undefined} title={titulo || rotulo} style={style}>
      <span className={`neu-avatar__fallback${tom ? ` neu-avatar__fallback--${TOM[tom]}` : ""}`} aria-hidden="true">
        {icone ?? (fallback || iniciaisDe(nome))}
      </span>
      {mostraImagem && (
        <img ref={ref} className={`neu-avatar__img${imagem === "carregada" ? " neu-avatar__img--on" : ""}`} src={src} alt="" draggable={false} onLoad={() => setImagem("carregada")} onError={() => setImagem("erro")} />
      )}
      {temSelo && (
        <span className={["neu-avatar__badge", status && `neu-avatar__badge--${STATUS[status].classe}`, seloNo && "neu-avatar__badge--custom"].filter(Boolean).join(" ")} aria-hidden="true">
          {seloNo ? selo : null}
        </span>
      )}
    </span>
  );
}

interface GrupoAvatarProps {
  /** Quantos avatares aparecem; o resto vira o disco "+N" */
  max?: number;
  /** O total real de pessoas (maior que o número de filhos, se a lista for parcial) */
  total?: number;
  tamanho?: TamanhoAvatar;
  tonsDeCinza?: boolean;
  /** Nome do grupo ("Equipe do projeto: 6 pessoas") */
  rotulo?: string;
  tituloContador?: string;
  className?: string;
  children?: ReactNode;
}

export function GrupoAvatar({ max, total, tamanho = "m", tonsDeCinza, rotulo, tituloContador, className, children }: GrupoAvatarProps) {
  const filhos = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const limite = max || filhos.length;
  const visiveis = filhos.slice(0, limite);
  const resto = (total != null ? total : filhos.length) - visiveis.length;
  const classes = ["neu-avatar-group", `neu-avatar-group--${TAMANHO[tamanho]}`, tonsDeCinza && "neu-avatar-group--gray", className].filter(Boolean).join(" ");
  return (
    <div className={classes} role="group" aria-label={rotulo || `${filhos.length + (resto > 0 ? resto : 0)} pessoas`}>
      {visiveis.map((c, i) => cloneElement(c, { key: c.key ?? i, tamanho }))}
      {resto > 0 && (
        <span className={`neu-avatar neu-avatar--${TAMANHO[tamanho]} neu-avatar--count`} role="img" aria-label={`Mais ${resto} pessoas`} title={tituloContador || `Mais ${resto}`}>
          <span className="neu-avatar__fallback" aria-hidden="true">+{resto}</span>
        </span>
      )}
    </div>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

function Linha({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>{children}</div>;
}

const TONS_GRUPO: (TomAvatar | undefined)[] = ["azul", "marca", undefined, "sucesso"];

export default function NeumorfismoAvatares() {
  return (
    <ComponentPreview
      title="Avatar"
      description="A foto ou as iniciais de uma pessoa num disco convexo pequeno, com selo de status opcional. O grupo sobrepõe vários avatares e termina com um contador “+N”."
      whenToUse={["Identificar quem fez, quem comentou ou quem é o responsável", "Listas de pessoas, equipes e cabeçalhos de perfil", "Grupos sobrepostos para mostrar participantes sem ocupar espaço"]}
      whenNotToUse={["Ícones de ação ou de categoria: use o botão de ícone ou um ícone solto", "Logos grandes de marca: use uma imagem própria", "Mostrar o estado só pela cor do selo: diga também em texto, ao lado do nome"]}
      accessibility={[
        "Cada avatar é role=\"img\" e leva o nome do alt ou do nome mais o status (\"Ana Souza (Online)\"); o mesmo texto serve de dica ao passar o mouse",
        "As iniciais e a foto ficam escondidas dos leitores de tela: só o nome do avatar é lido",
        "O grupo é um role=\"group\" com nome (\"Equipe do projeto: 6 pessoas\"); o contador lê \"Mais 3 pessoas\"",
        "A cor do status nunca é o único sinal: ela entra no nome acessível; ao lado de um nome numa lista, diga também em texto",
        "Se a foto falha ou demora, o fallback com as iniciais aparece no lugar; o fade da foto só roda com \"movimento\" permitido",
      ]}
      code={`<Avatar src={foto} nome="Ana Souza" tonsDeCinza />
<Avatar nome="Eduardo Ribeiro" status="online" />
<Avatar tamanho="g" forma="quadrado" nome="Sua marca" tom="marca" />
<Avatar tamanho="g" icone={<User size={22} />} nome="Usuário sem foto" status="offline" />
<Avatar tamanho="g" src="inexistente.jpg" nome="Joana Prado" selo={<span>3</span>} />

<GrupoAvatar max={3} total={6} rotulo="Equipe do projeto: 6 pessoas">
  <Avatar src={foto} nome="Ana Souza" />
  <Avatar nome="Lucas Ramos" tom="azul" />
  <Avatar nome="Eduardo Ribeiro" tom="marca" />
</GrupoAvatar>`}
    >
      <div className="neu-stack" style={{ gap: 28 }}>
        <div>
          <Legenda>Exemplo de referência</Legenda>
          <Linha>
            <Avatar src={FACE} nome="Ana Souza" tonsDeCinza />
            <Avatar nome="Eduardo Ribeiro" status="online" />
            <GrupoAvatar tonsDeCinza max={3} total={6} rotulo="Equipe do projeto: 6 pessoas">
              <Avatar src={FACE} nome="Ana Souza" />
              <Avatar nome="Lucas Ramos" tom="azul" />
              <Avatar nome="Eduardo Ribeiro" tom="marca" />
            </GrupoAvatar>
          </Linha>
        </div>
        <div>
          <Legenda>Tamanhos, formatos e status</Legenda>
          <Linha>
            <Avatar tamanho="pp" nome="Marina Lopes" status="online" />
            <Avatar tamanho="m" src={FACE} nome="Ana Souza" status="ausente" />
            <Avatar tamanho="g" nome="Rafael Nunes" tom="azul" status="ocupado" />
            <Avatar tamanho="gg" src={FACE} nome="Ana Souza" status="online" />
            <Avatar tamanho="g" forma="quadrado" nome="Sua marca" tom="marca" />
            <Avatar tamanho="g" icone={<User size={22} />} nome="Usuário sem foto" status="offline" />
            <Avatar tamanho="g" src="imagem-inexistente.jpg" nome="Joana Prado" selo={<span>3</span>} />
          </Linha>
        </div>
        <div>
          <Legenda>Grupos</Legenda>
          <Linha>
            <GrupoAvatar tamanho="pp" max={4} total={12} rotulo="Consultores: 12 pessoas">
              {["Marina Lopes", "Rafael Nunes", "Joana Prado", "Paulo Reis", "Ana Souza"].map((n, i) => (
                <Avatar key={n} nome={n} src={i === 4 ? FACE : undefined} tom={TONS_GRUPO[i]} />
              ))}
            </GrupoAvatar>
            <GrupoAvatar tamanho="g" rotulo="Coordenação: 3 pessoas">
              <Avatar src={FACE} nome="Ana Souza" />
              <Avatar nome="Lucas Ramos" tom="azul" />
              <Avatar nome="Eduardo Ribeiro" tom="marca" />
            </GrupoAvatar>
          </Linha>
        </div>
      </div>
    </ComponentPreview>
  );
}

/** Recorte de uma foto de exemplo; as pessoas e os nomes são fictícios */
const FACE = "data:image/jpeg;base64,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";
