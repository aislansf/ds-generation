import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Eye, SquarePen, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import { MenuSuspenso, type ItemSuspenso } from "@/components/estilo/NeumorfismoMenuSuspenso";

/**
 * Vitrine do KebabMenu no estilo Neumorfismo (componente KebabMenu do pacote Neumorphic UI v3.2.0): a variante ⋮
 * do menu suspenso, para ações por linha e por cartão. O glifo são três pontos sólidos de 4px (preenchidos com
 * currentColor, sem traço), então lê igual a 16px em qualquer tecla. Dois gatilhos: a tecla convexa de 36px, que
 * abre o menu padrão alinhado à direita (176px, 12px abaixo), e o discreto (`TeclaKebabDiscreta`), de 28px e sem
 * relevo em repouso: só o ⋮ apagado, que sobe numa pílula convexa pequena no hover e fica afundado enquanto o menu
 * está aberto; o menu dele é o da lista, justo (mín. 160px, a 4px do canto inferior direito da tecla). Fecha ao
 * clicar fora, com Esc (o foco volta à tecla) e ao escolher um item; as setas andam pelos itens. O nome da tecla
 * vem de `rotulo` ("Mais opções" por padrão). Reaproveita o MenuSuspenso. Entra no cartão "Menu Kebab" da
 * ComponentesPage e só é usado quando ESTILO.id === "neumorfismo". As classes neu-kebab* vêm de
 * src/styles/estilo.css.
 */

export function IconeKebab({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" className="neu-kebab-dots" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: size, height: size }}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

/** Tecla convexa de 36px com o ⋮. Repassa ref e props ao botão, como o gatilho do Radix exige. */
export const TeclaKebab = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(({ "aria-label": rotulo = "Mais opções", ...resto }, ref) => (
  <Button ref={ref} type="button" variant="outline" size="icon" className="neu-ib neu-ib--pequeno neu-btn--convex" aria-label={rotulo} title={rotulo} {...resto}>
    <IconeKebab size={18} />
  </Button>
));
TeclaKebab.displayName = "TeclaKebab";

/** Tecla discreta de 28px: sem relevo em repouso; sobe no hover e afunda com o menu aberto. */
export const TeclaKebabDiscreta = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(({ "aria-label": rotulo = "Mais opções", ...resto }, ref) => (
  <button ref={ref} type="button" className="neu-kebab-ghost" aria-label={rotulo} title={rotulo} {...resto}>
    <IconeKebab size={16} />
  </button>
));
TeclaKebabDiscreta.displayName = "TeclaKebabDiscreta";

function CartaoDemo({ titulo, id, children }: { titulo: string; id: string; children: ReactNode }) {
  return (
    <div className="neu-kebab-demo">
      <div>
        <h5 className="neu-kebab-demo__title">{titulo}</h5>
        <span className="neu-kebab-demo__meta">{id}</span>
      </div>
      {children}
    </div>
  );
}

const ITENS_PADRAO: ItemSuspenso[] = [
  { rotulo: "Editar", icone: <SquarePen size={16} /> },
  { rotulo: "Compartilhar", icone: <Users size={16} /> },
  { rotulo: "Excluir", icone: <Trash2 size={16} />, perigo: true },
];

const ITENS_LISTA: ItemSuspenso[] = [
  { rotulo: "Visualizar", icone: <Eye size={14} /> },
  { rotulo: "Editar", icone: <SquarePen size={14} /> },
  { divisor: true },
  { rotulo: "Excluir", icone: <Trash2 size={14} />, perigo: true },
];

export default function NeumorfismoKebab() {
  return (
    <ComponentPreview
      title="Menu Kebab"
      description="A variante ⋮ do menu suspenso: uma tecla pequena que abre um menu alinhado à direita, para ações por linha e por cartão. Dois gatilhos: a tecla convexa e a discreta, sem relevo em repouso."
      whenToUse={["Ações por linha em tabelas e por item em listas", "Ações secundárias nos cartões", "Discreta: onde uma tecla em relevo seria pesada demais, como linhas densas e cantos de cartão"]}
      whenNotToUse={["Ação primária única: use um botão", "Mais de seis ações: use o menu suspenso completo", "Navegação principal"]}
      accessibility={[
        "A tecla só tem o ⋮: o nome acessível vem de aria-label (\"Mais opções\" por padrão; mantenha curto, como \"Ações\")",
        "aria-haspopup=\"menu\" e aria-expanded acompanham o estado; o menu é role=\"menu\" com itens menuitem",
        "Fecha ao clicar fora, com Esc (o foco volta à tecla) e ao escolher um item; as setas andam pelos itens",
        "O item destrutivo (Excluir) vai por último, depois de um divisor, na cor de perigo, com o ícone de lixeira",
        "Os três pontos são sólidos e lêem iguais a 16px em qualquer tecla; o discreto afunda enquanto o menu está aberto",
      ]}
      code={`<MenuSuspenso gatilho={<TeclaKebab aria-label="Ações do módulo" />} rotulo="Ações do módulo" alinhar="end" largura={176} itens={itens} />

<MenuSuspenso gatilho={<TeclaKebabDiscreta aria-label="Ações" />} rotulo="Ações" variante="lista" justo alinhar="end" itens={itensLista} />`}
    >
      <div className="neu-kebab-grid">
        <CartaoDemo titulo="Módulo de Gestão Regional" id="ID: CE-904">
          <MenuSuspenso gatilho={<TeclaKebab aria-label="Ações do módulo" />} rotulo="Ações do módulo" alinhar="end" largura={176} itens={ITENS_PADRAO} />
        </CartaoDemo>
        <CartaoDemo titulo="Relatório Trimestral" id="ID: RT-2026-03">
          <MenuSuspenso gatilho={<TeclaKebabDiscreta aria-label="Ações" />} rotulo="Ações do relatório" variante="lista" justo alinhar="end" itens={ITENS_LISTA} />
        </CartaoDemo>
      </div>
    </ComponentPreview>
  );
}
