import { Children, type MouseEvent, type ReactNode } from "react";
import { Bell, BadgeCheck, ChevronRight, Download, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ComponentPreview } from "@/components/DSComponents";
import { Avatar } from "@/components/estilo/NeumorfismoAvatares";

/**
 * Vitrine do Item no estilo Neumorfismo (componente Item do pacote Neumorphic UI v3.2.0): uma linha flexível com
 * mídia, título com descrição (no máximo duas linhas) e ações. Vira um div, um link (com `href`) ou um botão (com
 * `aoClicar`); links e botões ganham uma seta que dá um passo à direita ao passar o mouse e o contorno ganha a cor
 * da marca. A mídia é um ícone numa ficha afundada de 36px (30px no tamanho pequeno), com tom (sucesso, azul, perigo),
 * ou qualquer nó (um Avatar, uma imagem de 44px). As variantes são convexo (padrão), contorno, afundado, discreto e
 * fantasma. O GrupoItens junta vários itens num único cartão convexo com fendas entre as linhas, exposto como lista.
 * Abaixo de 420px as ações descem para baixo do texto. Entra numa seção nova do neumorfismo ("Item", depois do
 * Marker) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-item* vêm de src/styles/estilo.css.
 */

export type VarianteItem = "convexo" | "contorno" | "afundado" | "discreto" | "fantasma";
export type TomItem = "sucesso" | "azul" | "perigo";

// as classes seguem o pacote (convex, outline, inset, muted, ghost; success, royal, danger)
const VARIANTE: Record<VarianteItem, string> = { convexo: "convex", contorno: "outline", afundado: "inset", discreto: "muted", fantasma: "ghost" };
const TOM: Record<TomItem, string> = { sucesso: "success", azul: "royal", perigo: "danger" };

export interface ItemProps {
  titulo?: ReactNode;
  /** Até duas linhas */
  descricao?: ReactNode;
  /** Um selo ao lado do título */
  selo?: ReactNode;
  /** Ícone numa ficha afundada */
  icone?: ReactNode;
  /** Qualquer nó no lugar do ícone (um Avatar, uma imagem); diga o que é em midiaVariante */
  midia?: ReactNode;
  midiaVariante?: "avatar" | "imagem";
  /** Cor do ícone */
  tom?: TomItem;
  /** Nós à direita */
  acoes?: ReactNode;
  variante?: VarianteItem;
  tamanho?: "pp";
  href?: string;
  aoClicar?: (e: MouseEvent) => void;
  alvo?: string;
  /** Falso esconde a seta de links e botões */
  seta?: boolean;
  role?: string;
  className?: string;
  children?: ReactNode;
}

export function Item({ titulo, descricao, selo, icone, midia, midiaVariante, tom, acoes, variante = "convexo", tamanho, href, aoClicar, alvo, seta = true, role, className, children }: ItemProps) {
  const acao = !!(href || aoClicar);
  const tipo = icone ? "icon" : midiaVariante === "imagem" ? "image" : midiaVariante === "avatar" ? "avatar" : "custom";
  const nome = ["neu-item__media", `neu-item__media--${tipo}`, tom && `neu-tone-${TOM[tom]}`].filter(Boolean).join(" ");
  const corpo = (
    <>
      {(icone || midia) && <span className={nome}>{icone ?? midia}</span>}
      <span className="neu-item__content">
        {titulo && (
          <span className="neu-item__title">
            {titulo}
            {selo}
          </span>
        )}
        {descricao && <span className="neu-item__desc">{descricao}</span>}
        {children}
      </span>
      {acoes && <span className="neu-item__actions">{acoes}</span>}
      {acao && seta && (
        <span className="neu-item__chev" aria-hidden="true">
          <ChevronRight size={16} />
        </span>
      )}
    </>
  );
  const classes = ["neu-item", `neu-item--${VARIANTE[variante]}`, tamanho === "pp" && "neu-item--sm", acao && "neu-item--action", className].filter(Boolean).join(" ");
  if (href) {
    return (
      <a className={classes} href={href} onClick={aoClicar} target={alvo}>
        {corpo}
      </a>
    );
  }
  if (aoClicar) {
    return (
      <button type="button" className={classes} onClick={aoClicar}>
        {corpo}
      </button>
    );
  }
  return (
    <div className={classes} role={role}>
      {corpo}
    </div>
  );
}

interface GrupoItensProps {
  /** Nome da lista para leitor de tela */
  rotulo?: string;
  className?: string;
  children?: ReactNode;
}

/** Junta os itens num cartão convexo, com fendas entre as linhas, exposto como lista */
export function GrupoItens({ rotulo, className, children }: GrupoItensProps) {
  const filhos = Children.toArray(children).filter(Boolean);
  const saida: ReactNode[] = [];
  filhos.forEach((c, i) => {
    if (i) saida.push(<div key={`s${i}`} className="neu-item-group__sep" role="separator" />);
    saida.push(
      <div key={`r${i}`} role="listitem" className="neu-item-group__row">
        {c}
      </div>,
    );
  });
  return (
    <div className={["neu-item-group", className].filter(Boolean).join(" ")} role="list" aria-label={rotulo}>
      {saida}
    </div>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoItens() {
  return (
    <ComponentPreview
      title="Item"
      description="Uma linha flexível: mídia, título com descrição e ações. É um div, um link ou um botão; links e botões ganham uma seta. O grupo junta vários itens num único cartão com fendas entre as linhas."
      whenToUse={["Listas de arquivos, pessoas, configurações e notificações", "Linhas com uma ação à direita (um botão, um interruptor, um selo)", "Listas navegáveis: o item inteiro vira link ou botão"]}
      whenNotToUse={["Dados tabulares com várias colunas comparáveis: use a tabela", "Menus de ações: use o menu suspenso", "Um botão dentro de um item que já é link ou botão: use um item estático com acoes"]}
      accessibility={[
        "Sem href nem aoClicar, o item é um div comum; com href vira um link e com aoClicar, um button de verdade, ambos com foco em anel sólido de 2px",
        "Não aninhe um botão dentro de um item que já é link ou botão: use um item estático com acoes",
        "A seta é decorativa (aria-hidden); o nome do link ou do botão é o texto do item",
        "O GrupoItens é um role=\"list\" com nome (rotulo), cada linha um listitem; as fendas são separadores decorativos",
        "Ícones de ação dentro do item levam aria-label; o estado de um interruptor não depende só da cor",
        "Abaixo de 420px as ações descem para baixo do texto, sem cortar nada",
      ]}
      code={`<Item variante="contorno" titulo="Item básico" descricao="Um item simples com título e descrição."
  acoes={<Button variant="outline" size="sm">Ação</Button>} />
<Item variante="contorno" tamanho="pp" href="#" icone={<BadgeCheck size={16} />} tom="sucesso" titulo="Seu perfil foi verificado." />

<Item icone={<File size={18} />} titulo="Relatório mensal.pdf" descricao="2,4 MB · atualizado há 2 h"
  acoes={<Button size="icon" variant="outline" aria-label="Baixar relatório"><Download size={16} /></Button>} />

<GrupoItens rotulo="Equipe">
  <Item midia={<Avatar nome="Ana Ribeiro" status="online" />} midiaVariante="avatar" titulo="Ana Ribeiro" descricao="Consultora · ana@sua-marca.com.br" />
  <Item midia={<Avatar nome="Bruno Lima" />} midiaVariante="avatar" titulo="Bruno Lima" descricao="Atendimento · bruno@sua-marca.com.br" aoClicar={() => {}} />
</GrupoItens>`}
    >
      <div className="neu-stack" style={{ gap: 24, maxWidth: 520 }}>
        <div>
          <Legenda>Exemplo de referência</Legenda>
          <div className="neu-stack" style={{ gap: 14 }}>
            <Item variante="contorno" titulo="Item básico" descricao="Um item simples com título e descrição." acoes={<Button variant="outline" size="sm">Ação</Button>} />
            <Item variante="contorno" tamanho="pp" href="#" icone={<BadgeCheck size={16} />} tom="sucesso" titulo="Seu perfil foi verificado." />
          </div>
        </div>
        <div>
          <Legenda>Variantes</Legenda>
          <div className="neu-stack" style={{ gap: 14 }}>
            <Item
              icone={<File size={18} />}
              titulo="Relatório mensal.pdf"
              descricao="2,4 MB · atualizado há 2 h"
              acoes={
                <Button size="icon" variant="outline" className="neu-ib neu-ib--pequeno neu-btn--convex" aria-label="Baixar relatório">
                  <Download aria-hidden="true" size={16} />
                </Button>
              }
            />
            <Item variante="afundado" icone={<Bell size={18} />} titulo="Lembretes de agenda" descricao="Receba um aviso 30 min antes de cada atendimento." acoes={<Switch defaultChecked aria-label="Lembretes de agenda" />} />
          </div>
        </div>
        <div>
          <Legenda>Grupo — lista de pessoas</Legenda>
          <GrupoItens rotulo="Equipe">
            <Item
              midia={<Avatar nome="Ana Ribeiro" status="online" />}
              midiaVariante="avatar"
              titulo="Ana Ribeiro"
              descricao="Consultora · ana@sua-marca.com.br"
              acoes={<span className="neu-badge neu-badge--convex neu-badge--sm neu-tone-accent">Admin</span>}
            />
            <Item midia={<Avatar nome="Bruno Lima" />} midiaVariante="avatar" titulo="Bruno Lima" descricao="Atendimento · bruno@sua-marca.com.br" aoClicar={() => {}} />
            <Item midia={<Avatar nome="Carla Souza" status="ausente" />} midiaVariante="avatar" titulo="Carla Souza" descricao="Crédito · carla@sua-marca.com.br" aoClicar={() => {}} />
          </GrupoItens>
        </div>
      </div>
    </ComponentPreview>
  );
}
