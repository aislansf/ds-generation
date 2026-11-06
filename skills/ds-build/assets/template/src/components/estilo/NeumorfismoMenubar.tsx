import { useState, type ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Menubar no estilo Neumorfismo (componente Menubar do pacote Neumorphic UI v3.2.0): uma barra de
 * menu de aplicativo (Arquivo, Editar, Exibir…) numa faixa convexa; cada menu abre um painel flutuante de 12px
 * de raio com itens de 36px. O item sob o ponteiro ou o foco sobe como uma linha convexa; o de submenu aberto
 * fica convexo; o desativado apaga; o recuado alinha com os itens marcados. Itens marcáveis (caixa) mostram um
 * check na cor da marca; os de escolha única (grupo) mostram uma bolinha afundada que acende com o LED da marca.
 * Montado com o Menubar do Radix (padrão WAI-ARIA): ←/→ entre os menus (um único ponto de Tab), ↓/Enter/Espaço
 * abrem e focam o primeiro item, → entra no submenu, ← volta, Esc fecha e devolve o foco ao gatilho, digitar
 * uma letra salta ao item que começa com ela, e com um menu aberto passar o mouse noutro gatilho troca de menu.
 * Entra numa seção nova do neumorfismo ("Menubar", depois do Command) e só é usado quando ESTILO.id ===
 * "neumorfismo". As classes neu-menubar* e neu-menu-* vêm de src/styles/estilo.css; os painéis ficam na camada
 * 60 (acima do Modal e do toast).
 */

export type ItemMenu =
  | { divisor: true }
  | {
      rotulo: string;
      /** Texto da tecla à direita, como "⌘T" */
      atalho?: string;
      desabilitado?: boolean;
      /** Alinha com os itens que têm marca à esquerda */
      recuado?: boolean;
      aoSelecionar?: () => void;
      /** Submenu */
      itens?: ItemMenu[];
      /** Item marcável (caixa), com `marcado` */
      caixa?: boolean;
      /** Sozinho (sem `caixa`): item de escolha única, em grupo com os vizinhos */
      marcado?: boolean;
      /** Alterna sem fechar o menu */
      manterAberto?: boolean;
    };

export interface MenuDaBarra {
  rotulo: string;
  /** Largura do painel, em px (220 por padrão) */
  largura?: number;
  itens: ItemMenu[];
}

type ItemComRotulo = Extract<ItemMenu, { rotulo: string }>;

const ehDivisor = (i: ItemMenu): i is { divisor: true } => "divisor" in i;
const ehEscolha = (i: ItemMenu) => !ehDivisor(i) && !i.caixa && !i.itens && i.marcado !== undefined;

function aoSelecionar(i: ItemComRotulo) {
  return (e: Event) => {
    if (i.manterAberto) e.preventDefault();
    i.aoSelecionar?.();
  };
}

function Atalho({ texto }: { texto?: string }) {
  return texto ? <kbd className="neu-kbd">{texto}</kbd> : null;
}

function Itens({ itens }: { itens: ItemMenu[] }) {
  const saida: ReactNode[] = [];
  for (let n = 0; n < itens.length; n++) {
    const item = itens[n];
    if (ehDivisor(item)) {
      saida.push(<MenubarPrimitive.Separator key={`d${n}`} className="neu-menu-divisor" />);
      continue;
    }
    if (ehEscolha(item)) {
      const grupo: ItemComRotulo[] = [];
      while (n < itens.length && ehEscolha(itens[n])) grupo.push(itens[n++] as ItemComRotulo);
      n--;
      saida.push(
        <MenubarPrimitive.RadioGroup key={`g${n}`} value={grupo.find((g) => g.marcado)?.rotulo ?? ""}>
          {grupo.map((g) => (
            <MenubarPrimitive.RadioItem key={g.rotulo} value={g.rotulo} disabled={g.desabilitado} className="neu-menu-item neu-menu-item--escolha" onSelect={aoSelecionar(g)}>
              <span className="neu-menu-item__bolinha" aria-hidden="true">{g.marcado ? <span /> : null}</span>
              <span className="neu-menu-item__rotulo">{g.rotulo}</span>
              <Atalho texto={g.atalho} />
            </MenubarPrimitive.RadioItem>
          ))}
        </MenubarPrimitive.RadioGroup>,
      );
      continue;
    }
    if (item.itens) {
      saida.push(
        <MenubarPrimitive.Sub key={item.rotulo}>
          <MenubarPrimitive.SubTrigger className="neu-menu-item neu-menu-item--sub" disabled={item.desabilitado}>
            <span className="neu-menu-item__rotulo">{item.rotulo}</span>
            <ChevronRight aria-hidden="true" className="neu-menu-item__seta" size={14} />
          </MenubarPrimitive.SubTrigger>
          <MenubarPrimitive.Portal>
            <MenubarPrimitive.SubContent className="neu-menu-painel neu-menu-painel--sub" sideOffset={6} alignOffset={-5} collisionPadding={8}>
              <Itens itens={item.itens} />
            </MenubarPrimitive.SubContent>
          </MenubarPrimitive.Portal>
        </MenubarPrimitive.Sub>,
      );
      continue;
    }
    if (item.caixa) {
      saida.push(
        <MenubarPrimitive.CheckboxItem key={item.rotulo} checked={!!item.marcado} disabled={item.desabilitado} className="neu-menu-item neu-menu-item--caixa" onSelect={aoSelecionar(item)}>
          <span className="neu-menu-item__marca" aria-hidden="true">
            <MenubarPrimitive.ItemIndicator>
              <Check size={14} strokeWidth={3} />
            </MenubarPrimitive.ItemIndicator>
          </span>
          <span className="neu-menu-item__rotulo">{item.rotulo}</span>
          <Atalho texto={item.atalho} />
        </MenubarPrimitive.CheckboxItem>,
      );
      continue;
    }
    saida.push(
      <MenubarPrimitive.Item key={item.rotulo} disabled={item.desabilitado} className={`neu-menu-item${item.recuado ? " neu-menu-item--recuado" : ""}`} onSelect={aoSelecionar(item)}>
        <span className="neu-menu-item__rotulo">{item.rotulo}</span>
        <Atalho texto={item.atalho} />
      </MenubarPrimitive.Item>,
    );
  }
  return <>{saida}</>;
}

export function BarraMenus({ menus, rotulo = "Menu principal" }: { menus: MenuDaBarra[]; rotulo?: string }) {
  return (
    <MenubarPrimitive.Root className="neu-menubar" aria-label={rotulo}>
      {menus.map((m) => (
        <MenubarPrimitive.Menu key={m.rotulo}>
          <MenubarPrimitive.Trigger className="neu-menubar__trigger">{m.rotulo}</MenubarPrimitive.Trigger>
          <MenubarPrimitive.Portal>
            <MenubarPrimitive.Content className="neu-menu-painel" align="start" alignOffset={-4} sideOffset={8} collisionPadding={8} aria-label={m.rotulo} style={{ width: m.largura ?? 220 }}>
              <Itens itens={m.itens} />
            </MenubarPrimitive.Content>
          </MenubarPrimitive.Portal>
        </MenubarPrimitive.Menu>
      ))}
    </MenubarPrimitive.Root>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

const PERFIS = { ana: "Ana", bruno: "Bruno", luisa: "Luísa" } as const;

export default function NeumorfismoMenubar() {
  const [barra, setBarra] = useState(false);
  const [urls, setUrls] = useState(true);
  const [perfil, setPerfil] = useState<keyof typeof PERFIS>("bruno");
  const [ultima, setUltima] = useState<string | null>(null);
  const a = (s: string) => () => setUltima(s);
  const menus: MenuDaBarra[] = [
    {
      rotulo: "Arquivo",
      itens: [
        { rotulo: "Nova aba", atalho: "⌘T", aoSelecionar: a("Nova aba") },
        { rotulo: "Nova janela", atalho: "⌘N", aoSelecionar: a("Nova janela") },
        { rotulo: "Nova janela anônima", desabilitado: true },
        { divisor: true },
        { rotulo: "Compartilhar", itens: [{ rotulo: "Link por e-mail", aoSelecionar: a("Link por e-mail") }, { rotulo: "Mensagens", aoSelecionar: a("Mensagens") }, { rotulo: "Notas", aoSelecionar: a("Notas") }] },
        { divisor: true },
        { rotulo: "Imprimir…", atalho: "⌘P", aoSelecionar: a("Imprimir") },
      ],
    },
    {
      rotulo: "Editar",
      itens: [
        { rotulo: "Desfazer", atalho: "⌘Z", aoSelecionar: a("Desfazer") },
        { rotulo: "Refazer", atalho: "⇧⌘Z", aoSelecionar: a("Refazer") },
        { divisor: true },
        {
          rotulo: "Localizar",
          itens: [
            { rotulo: "Pesquisar na web", aoSelecionar: a("Pesquisar na web") },
            { divisor: true },
            { rotulo: "Localizar…", aoSelecionar: a("Localizar") },
            { rotulo: "Localizar próximo", aoSelecionar: a("Localizar próximo") },
            { rotulo: "Localizar anterior", aoSelecionar: a("Localizar anterior") },
          ],
        },
        { divisor: true },
        { rotulo: "Recortar", aoSelecionar: a("Recortar") },
        { rotulo: "Copiar", aoSelecionar: a("Copiar") },
        { rotulo: "Colar", aoSelecionar: a("Colar") },
      ],
    },
    {
      rotulo: "Exibir",
      largura: 230,
      itens: [
        { rotulo: "Barra de favoritos", caixa: true, marcado: barra, manterAberto: true, aoSelecionar: () => setBarra(!barra) },
        { rotulo: "URLs completas", caixa: true, marcado: urls, manterAberto: true, aoSelecionar: () => setUrls(!urls) },
        { divisor: true },
        { rotulo: "Recarregar", atalho: "⌘R", recuado: true, aoSelecionar: a("Recarregar") },
        { rotulo: "Forçar recarga", atalho: "⇧⌘R", recuado: true, desabilitado: true },
        { divisor: true },
        { rotulo: "Tela cheia", recuado: true, aoSelecionar: a("Tela cheia") },
        { divisor: true },
        { rotulo: "Ocultar barra lateral", recuado: true, aoSelecionar: a("Ocultar barra lateral") },
      ],
    },
    {
      rotulo: "Perfis",
      itens: [
        { rotulo: "Ana", marcado: perfil === "ana", aoSelecionar: () => setPerfil("ana") },
        { rotulo: "Bruno", marcado: perfil === "bruno", aoSelecionar: () => setPerfil("bruno") },
        { rotulo: "Luísa", marcado: perfil === "luisa", aoSelecionar: () => setPerfil("luisa") },
        { divisor: true },
        { rotulo: "Editar…", recuado: true, aoSelecionar: a("Editar perfis") },
        { divisor: true },
        { rotulo: "Adicionar perfil…", recuado: true, aoSelecionar: a("Adicionar perfil") },
      ],
    },
  ];
  return (
    <ComponentPreview
      title="Menubar"
      description="Barra de menu de aplicativo (Arquivo, Editar, Exibir…) numa faixa convexa. Cada menu abre um painel flutuante com atalhos, submenus, itens marcáveis e escolha única."
      whenToUse={["Aplicações com muitos comandos agrupados por tema, como um editor ou um painel de gestão", "Quando a pessoa espera o padrão de menu de desktop e usa o teclado"]}
      whenNotToUse={["Navegação de um site entre páginas: use o NavigationMenu", "Poucas ações de um item: use o menu suspenso (DropdownMenu)"]}
      accessibility={[
        "Padrão WAI-ARIA de menubar: ← e → entre os menus (um único ponto na ordem do Tab); ↓, Enter ou Espaço abrem e focam o primeiro item",
        "Dentro do menu: ↑ e ↓ movem, → entra no submenu, ← volta, Esc fecha e devolve o foco ao gatilho",
        "Digitar uma letra salta ao item que começa com ela; com um menu aberto, passar o mouse em outro gatilho troca de menu",
        "Itens marcáveis usam menuitemcheckbox e os de escolha única menuitemradio, com aria-checked; o desativado fica aria-disabled",
        "A marca (check ou bolinha) acompanha o rótulo: o estado nunca depende só da cor",
      ]}
      code={`const menus = [
  { rotulo: "Arquivo", itens: [
    { rotulo: "Nova aba", atalho: "⌘T", aoSelecionar: novaAba },
    { rotulo: "Nova janela anônima", desabilitado: true },
    { divisor: true },
    { rotulo: "Compartilhar", itens: [{ rotulo: "Link por e-mail" }, { rotulo: "Notas" }] },
  ] },
  { rotulo: "Exibir", largura: 230, itens: [
    { rotulo: "Barra de favoritos", caixa: true, marcado: barra, manterAberto: true, aoSelecionar: () => setBarra(!barra) },
    { divisor: true },
    { rotulo: "Recarregar", atalho: "⌘R", recuado: true },
  ] },
  { rotulo: "Perfis", itens: [
    { rotulo: "Ana", marcado: perfil === "ana", aoSelecionar: () => setPerfil("ana") },
    { rotulo: "Bruno", marcado: perfil === "bruno", aoSelecionar: () => setPerfil("bruno") },
  ] },
];

<BarraMenus menus={menus} rotulo="Menu do aplicativo" />`}
    >
      <div>
        <Legenda>Exemplo de referência</Legenda>
        <BarraMenus menus={menus} rotulo="Menu do aplicativo" />
        <p className="neu-help" aria-live="polite" style={{ marginTop: 16 }}>
          {ultima ? `Última ação: ${ultima} · ` : ""}Favoritos: {barra ? "sim" : "não"} · URLs completas: {urls ? "sim" : "não"} · Perfil: {PERFIS[perfil]}
        </p>
        <p className="neu-help">Teclado: ← → entre menus, ↓ abre, → entra no submenu, Esc fecha.</p>
      </div>
    </ComponentPreview>
  );
}
