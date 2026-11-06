import { forwardRef, useState, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronRight, Check, Copy, Download, EllipsisVertical, Share2, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do DropdownMenu no estilo Neumorfismo (componente DropdownMenu do pacote Neumorphic UI v3.2.0): um
 * gatilho convexo ("Ações" com chevron que inverte aberto, ou o ⋮ de ícone) que abre um menu flutuante de ações.
 * Duas disposições do painel: padrão (208px, 8px de respiro, 16px de raio, itens de 12px com hover em véu) e
 * lista (192px, 4px de respiro, 12px de raio, itens de 14px com ícone apagado de 14px e hover em linha convexa).
 * Itens: ícone, atalho (tecla), desativado, recuado, perigo (sempre por último, depois de um divisor), cabeçalho
 * de grupo em caixa-alta, submenu, marcável (caixa) e de escolha única (grupo). Montado com o DropdownMenu do
 * Radix (padrão WAI-ARIA): ↓/↑ no gatilho abrem no primeiro/último item, as setas movem, Home/End saltam, Enter
 * escolhe, → entra no submenu e ← volta, Esc fecha e devolve o foco ao gatilho, Tab fecha, digitar uma letra
 * salta ao item, e o menu se vira para ficar dentro da janela. Reaproveita as classes neu-menu-* do Menubar. Entra
 * no cartão "Dropdown Menu" da ComponentesPage e só é usado quando ESTILO.id === "neumorfismo". As classes vêm de
 * src/styles/estilo.css; os painéis ficam na camada 60.
 */

export type ItemSuspenso =
  | { divisor: true }
  | { cabecalho: string }
  | {
      rotulo: string;
      icone?: ReactNode;
      atalho?: string;
      desabilitado?: boolean;
      recuado?: boolean;
      /** Ação destrutiva: vai por último, depois de um divisor */
      perigo?: boolean;
      aoSelecionar?: () => void;
      /** Submenu */
      itens?: ItemSuspenso[];
      /** Item marcável (caixa), com `marcado` */
      caixa?: boolean;
      /** Sozinho (sem `caixa`): item de escolha única, em grupo com os vizinhos */
      marcado?: boolean;
      /** Alterna sem fechar o menu */
      manterAberto?: boolean;
    };

type ItemComRotulo = Extract<ItemSuspenso, { rotulo: string }>;

const ehDivisor = (i: ItemSuspenso): i is { divisor: true } => "divisor" in i;
const ehCabecalho = (i: ItemSuspenso): i is { cabecalho: string } => "cabecalho" in i;
const ehEscolha = (i: ItemSuspenso) => !ehDivisor(i) && !ehCabecalho(i) && !i.caixa && !i.itens && i.marcado !== undefined;

function aoSelecionar(i: ItemComRotulo) {
  return (e: Event) => {
    if (i.manterAberto) e.preventDefault();
    i.aoSelecionar?.();
  };
}

function Conteudo({ item, marca }: { item: ItemComRotulo; marca?: ReactNode }) {
  return (
    <>
      {marca}
      {item.icone && <span className="neu-menu-item__icone" aria-hidden="true">{item.icone}</span>}
      <span className="neu-menu-item__rotulo">{item.rotulo}</span>
      {item.atalho && <kbd className="neu-kbd">{item.atalho}</kbd>}
    </>
  );
}

function classeItem(item: ItemComRotulo, extra = "") {
  return ["neu-menu-item", extra, item.recuado && "neu-menu-item--recuado", item.perigo && "neu-menu-item--perigo"].filter(Boolean).join(" ");
}

function Itens({ itens }: { itens: ItemSuspenso[] }) {
  const saida: ReactNode[] = [];
  for (let n = 0; n < itens.length; n++) {
    const item = itens[n];
    if (ehDivisor(item)) {
      saida.push(<DropdownPrimitive.Separator key={`d${n}`} className="neu-menu-divisor" />);
      continue;
    }
    if (ehCabecalho(item)) {
      saida.push(<DropdownPrimitive.Label key={`c${n}`} className="neu-menu-cabecalho">{item.cabecalho}</DropdownPrimitive.Label>);
      continue;
    }
    if (ehEscolha(item)) {
      const grupo: ItemComRotulo[] = [];
      while (n < itens.length && ehEscolha(itens[n])) grupo.push(itens[n++] as ItemComRotulo);
      n--;
      saida.push(
        <DropdownPrimitive.RadioGroup key={`g${n}`} value={grupo.find((g) => g.marcado)?.rotulo ?? ""}>
          {grupo.map((g) => (
            <DropdownPrimitive.RadioItem key={g.rotulo} value={g.rotulo} disabled={g.desabilitado} className={classeItem(g, "neu-menu-item--escolha")} onSelect={aoSelecionar(g)}>
              <Conteudo item={g} marca={<span className="neu-menu-item__bolinha" aria-hidden="true">{g.marcado ? <span /> : null}</span>} />
            </DropdownPrimitive.RadioItem>
          ))}
        </DropdownPrimitive.RadioGroup>,
      );
      continue;
    }
    if (item.itens) {
      saida.push(
        <DropdownPrimitive.Sub key={item.rotulo}>
          <DropdownPrimitive.SubTrigger className={classeItem(item, "neu-menu-item--sub")} disabled={item.desabilitado}>
            <Conteudo item={item} />
            <ChevronRight aria-hidden="true" className="neu-menu-item__seta" size={14} />
          </DropdownPrimitive.SubTrigger>
          <DropdownPrimitive.Portal>
            <DropdownPrimitive.SubContent className="neu-menu-painel neu-menu-painel--sub" sideOffset={6} alignOffset={-5} collisionPadding={8}>
              <Itens itens={item.itens} />
            </DropdownPrimitive.SubContent>
          </DropdownPrimitive.Portal>
        </DropdownPrimitive.Sub>,
      );
      continue;
    }
    if (item.caixa) {
      saida.push(
        <DropdownPrimitive.CheckboxItem key={item.rotulo} checked={!!item.marcado} disabled={item.desabilitado} className={classeItem(item, "neu-menu-item--caixa")} onSelect={aoSelecionar(item)}>
          <Conteudo
            item={item}
            marca={
              <span className="neu-menu-item__marca" aria-hidden="true">
                <DropdownPrimitive.ItemIndicator>
                  <Check size={14} strokeWidth={3} />
                </DropdownPrimitive.ItemIndicator>
              </span>
            }
          />
        </DropdownPrimitive.CheckboxItem>,
      );
      continue;
    }
    saida.push(
      <DropdownPrimitive.Item key={item.rotulo} disabled={item.desabilitado} className={classeItem(item)} onSelect={aoSelecionar(item)}>
        <Conteudo item={item} />
      </DropdownPrimitive.Item>,
    );
  }
  return <>{saida}</>;
}

interface MenuSuspensoProps {
  /** O gatilho: um elemento que aceite ref e props (como o Button) */
  gatilho: ReactElement;
  itens: ItemSuspenso[];
  /** Nome acessível do menu */
  rotulo: string;
  variante?: "padrao" | "lista";
  /** Painel justo ao gatilho: largura do conteúdo (mín. 160px) e só 4px abaixo dele (o menu do kebab discreto) */
  justo?: boolean;
  alinhar?: "start" | "end";
  lado?: "bottom" | "top";
  /** Largura do painel, em px */
  largura?: number;
  aberto?: boolean;
  abertoInicial?: boolean;
  aoMudarAberto?: (aberto: boolean) => void;
}

export function MenuSuspenso({ gatilho, itens, rotulo, variante = "padrao", justo = false, alinhar = "start", lado = "bottom", largura, aberto, abertoInicial, aoMudarAberto }: MenuSuspensoProps) {
  const lista = variante === "lista";
  return (
    <DropdownPrimitive.Root open={aberto} defaultOpen={abertoInicial} onOpenChange={aoMudarAberto} modal={false}>
      <DropdownPrimitive.Trigger asChild>{gatilho}</DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          className={`neu-menu-painel ${lista ? "neu-menu-painel--lista" : "neu-menu-painel--padrao"}${justo ? " neu-menu-painel--justo" : ""}`}
          align={alinhar}
          side={lado}
          sideOffset={justo ? 4 : lista ? 6 : 12}
          collisionPadding={8}
          aria-label={rotulo}
          aria-labelledby={undefined}
          style={largura ? { width: largura } : undefined}
        >
          <Itens itens={itens} />
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}

/** Gatilho de texto: o botão secundário com o chevron que inverte enquanto o menu está aberto. Repassa ref e props ao botão, como o Radix exige. */
export const GatilhoAcoes = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(({ children = "Ações", ...resto }, ref) => (
  <Button ref={ref} type="button" variant="outline" className="neu-btn--convex neu-dd__trigger" {...resto}>
    {children}
    <ChevronDown aria-hidden="true" className="neu-dd__chev" size={14} />
  </Button>
));
GatilhoAcoes.displayName = "GatilhoAcoes";

/** Gatilho de ícone: o ⋮ numa tecla quadrada convexa (os três pontos são sólidos). Nome acessível em aria-label. */
export const GatilhoKebab = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(({ "aria-label": rotulo = "Menu de ações", ...resto }, ref) => (
  <Button ref={ref} type="button" variant="outline" size="icon" className="neu-ib neu-btn--convex" aria-label={rotulo} title={rotulo} {...resto}>
    <EllipsisVertical aria-hidden="true" size={16} fill="currentColor" />
  </Button>
));
GatilhoKebab.displayName = "GatilhoKebab";

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoMenuSuspenso() {
  const [ultima, setUltima] = useState<string | null>(null);
  const a = (s: string) => () => setUltima(s);
  const itensPadrao: ItemSuspenso[] = [
    { rotulo: "Editar", icone: <SquarePen size={16} />, aoSelecionar: a("Editar") },
    { rotulo: "Duplicar", icone: <Copy size={16} />, aoSelecionar: a("Duplicar") },
    { rotulo: "Exportar", icone: <Download size={16} />, aoSelecionar: a("Exportar") },
    { divisor: true },
    { rotulo: "Excluir", icone: <Trash2 size={16} />, perigo: true, aoSelecionar: a("Excluir") },
  ];
  const itensLista: ItemSuspenso[] = [
    { rotulo: "Editar", icone: <SquarePen size={14} />, aoSelecionar: a("Editar") },
    { rotulo: "Duplicar", icone: <Copy size={14} />, aoSelecionar: a("Duplicar") },
    { rotulo: "Compartilhar", icone: <Share2 size={14} />, aoSelecionar: a("Compartilhar") },
    { rotulo: "Exportar", icone: <Download size={14} />, aoSelecionar: a("Exportar") },
    { divisor: true },
    { rotulo: "Excluir", icone: <Trash2 size={14} />, perigo: true, aoSelecionar: a("Excluir") },
  ];
  return (
    <ComponentPreview
      title="Dropdown Menu"
      description="Gatilho convexo que abre um menu flutuante de ações. Duas disposições: padrão e lista (mais leve e densa). Suporta ícones, atalhos, divisores, submenus, itens marcáveis e escolha única."
      whenToUse={["Agrupar ações secundárias de um item", "Ações por linha em tabelas e por cartão (gatilho de ícone)", "Opções de configuração com marcação ou escolha única"]}
      whenNotToUse={["Navegação principal: use o NavigationMenu ou a barra lateral", "Escolher um valor de formulário: use o Select", "Poucas ações sempre à vista: use botões"]}
      accessibility={[
        "O gatilho tem aria-haspopup=\"menu\" e aria-expanded; o de ícone precisa de nome acessível (aria-label)",
        "O painel é role=\"menu\" com nome; os itens são menuitem, menuitemcheckbox ou menuitemradio, com aria-checked",
        "↓ e ↑ no gatilho abrem no primeiro e no último item; as setas movem, Home e End saltam, Enter escolhe",
        "→ entra no submenu e ← volta; Esc fecha e devolve o foco ao gatilho; Tab fecha; digitar uma letra salta ao item",
        "O item destrutivo (Excluir) vai por último, depois de um divisor, e muda de cor: o ícone de lixeira também o diferencia",
      ]}
      code={`const itens = [
  { rotulo: "Editar", icone: <SquarePen size={16} /> },
  { rotulo: "Duplicar", icone: <Copy size={16} /> },
  { divisor: true },
  { rotulo: "Excluir", icone: <Trash2 size={16} />, perigo: true },
];

<MenuSuspenso gatilho={<GatilhoAcoes />} rotulo="Ações" itens={itens} />
<MenuSuspenso gatilho={<GatilhoAcoes />} rotulo="Ações" variante="lista" itens={itens} />
<MenuSuspenso gatilho={<GatilhoKebab />} rotulo="Menu de ações" variante="lista" alinhar="end" itens={itens} />`}
    >
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
          <div>
            <Legenda>Padrão</Legenda>
            <MenuSuspenso gatilho={<GatilhoAcoes />} rotulo="Ações" itens={itensPadrao} />
          </div>
          <div>
            <Legenda>Lista</Legenda>
            <MenuSuspenso gatilho={<GatilhoAcoes />} rotulo="Ações da lista" variante="lista" itens={itensLista} />
          </div>
          <div>
            <Legenda>Gatilho de ícone</Legenda>
            <MenuSuspenso gatilho={<GatilhoKebab />} rotulo="Menu de ações do item" variante="lista" alinhar="start" itens={itensLista} />
          </div>
        </div>
        <p className="neu-help" aria-live="polite" style={{ marginTop: 16 }}>
          {ultima ? `Ação selecionada: ${ultima}` : "Abra um menu e escolha uma ação, com o mouse ou com ↓ e Enter."}
        </p>
      </div>
    </ComponentPreview>
  );
}
