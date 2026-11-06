import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import { Progresso } from "@/components/estilo/NeumorfismoProgresso";

/**
 * Vitrine do StatCard no estilo Neumorfismo (componente StatCard do pacote Neumorphic UI v3.2.0): uma estatística
 * contra a meta. É o cartão convexo do KpiCard com o rótulo e um ícone de sucesso no topo, o valor em mono
 * extranegrito, uma calha afundada de progresso e, embaixo, a escala "0% · Meta: 95% · 100%", com a meta na cor da
 * marca. A calha tem o nome do rótulo e fala o valor e a meta; os extremos 0% e 100% são só desenho, escondidos dos
 * leitores de tela. Entra numa seção nova do neumorfismo ("StatCard", depois do IndicatorCard) e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-kpi* e neu-stat* vêm de src/styles/estilo.css.
 */

export interface CartaoMetaProps {
  rotulo: string;
  /** Já formatado em pt-BR: "78,4%" */
  valor: string;
  /** 0 a 100 */
  progresso: number;
  /** A meta como texto: "95%" */
  meta?: string;
  icone?: LucideIcon;
  className?: string;
}

export function CartaoMeta({ rotulo, valor, progresso, meta, icone: Icone, className }: CartaoMetaProps) {
  return (
    <div className={["neu-kpi", className].filter(Boolean).join(" ")} role="group" aria-label={`${rotulo}: ${valor}`}>
      <div className="neu-kpi__top">
        <span className="neu-kpi__label">{rotulo}</span>
        {Icone ? (
          <span className="neu-tone-success" aria-hidden="true">
            <Icone size={18} />
          </span>
        ) : null}
      </div>
      <p className="neu-kpi__value neu-kpi__value--heavy">{valor}</p>
      <Progresso valor={progresso} rotulo={rotulo} textoDoValor={meta ? `${valor}, meta ${meta}` : valor} />
      <div className="neu-stat__scale">
        <span aria-hidden="true">0%</span>
        <span className="neu-tone-accent">{meta ? `Meta: ${meta}` : ""}</span>
        <span aria-hidden="true">100%</span>
      </div>
    </div>
  );
}

export default function NeumorfismoMetas() {
  return (
    <ComponentPreview
      title="StatCard"
      description="Uma estatística contra a meta: rótulo, valor em mono, calha de progresso e a escala 0% · Meta · 100%."
      whenToUse={["Acompanhar um número contra uma meta, como a taxa de execução", "Painéis em que a distância até a meta importa mais que a variação", "Um único indicador de progresso com contexto"]}
      whenNotToUse={["Número sem meta: use o Big Numbers / KPIs ou o IndicatorCard", "Metas com várias etapas: use a barra de etapas", "Comparar várias metas lado a lado: use um gráfico"]}
      accessibility={[
        "O cartão é um grupo nomeado pelo rótulo e pelo valor (\"Taxa de execução: 78,4%\")",
        "A calha é uma barra de progresso com nome, e o texto falado traz o valor e a meta",
        "Os extremos 0% e 100% são só desenho e ficam escondidos dos leitores de tela; a meta fica visível como texto",
        "O ícone de sucesso é decorativo",
        "A meta na cor da marca é texto pequeno: ela nunca é o único jeito de saber a meta, que também está escrita",
      ]}
      code={`<CartaoMeta rotulo="Taxa de execução" valor="78,4%" progresso={78.4} meta="95%" icone={CheckCircle2} />`}
    >
      <div style={{ maxWidth: 340 }}>
        <CartaoMeta rotulo="Taxa de execução" valor="78,4%" progresso={78.4} meta="95%" icone={CheckCircle2} />
      </div>
    </ComponentPreview>
  );
}
