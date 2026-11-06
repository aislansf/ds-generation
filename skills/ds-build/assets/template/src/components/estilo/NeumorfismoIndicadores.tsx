import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import { direcaoDe, type DirecaoKpi } from "@/components/estilo/NeumorfismoKpis";

/**
 * Vitrine do IndicatorCard no estilo Neumorfismo (componente IndicatorCard do pacote Neumorphic UI v3.2.0): um número
 * de destaque que merece o cartão inteiro, centrado. De cima para baixo: o rótulo em caixa-alta, discreto, ao lado de um
 * círculo afundado de 28px com o ícone; um leito afundado de largura total com o valor (30px, extranegrito, na cor do
 * tom) e a legenda do que é contado; uma pílula convexa com a frase da variação ("12% em relação ao mês anterior"),
 * verde na alta e vermelha na queda; e o rodapé em mono com a hora da última atualização. O cartão sobe 2% ao passar o
 * mouse. Para uma fileira executiva de quatro números, use o CartaoKpi. O sentido da variação vem do sinal do texto
 * ("-15% ...") ou de `direcao`; a seta carrega o sentido e um texto escondido diz "alta", "queda" ou "estável". Entra
 * numa seção nova do neumorfismo ("IndicatorCard", depois do Big Numbers / KPIs) e só é usado quando ESTILO.id ===
 * "neumorfismo". As classes neu-indicator* vêm de src/styles/estilo.css.
 */

export type TomIndicador = "marca" | "azul" | "neutro";

// as classes seguem o pacote (accent, royal, neutral)
const TOM: Record<TomIndicador, string> = { marca: "accent", azul: "royal", neutro: "neutral" };
const FALADO: Record<DirecaoKpi, string> = { alta: " (alta)", queda: " (queda)", estavel: " (estável)" };
const SETA: Record<DirecaoKpi, string> = { alta: "↑", queda: "↓", estavel: "→" };
const CLASSE: Record<DirecaoKpi, string> = { alta: "up", queda: "down", estavel: "flat" };

export interface CartaoIndicadorProps {
  /** Já formatado em pt-BR: "1.247" */
  valor: string;
  /** O que é contado: "Escolas atendidas" */
  legenda?: string;
  rotulo?: string;
  icone?: LucideIcon;
  /** Cor do valor */
  tom?: TomIndicador;
  /** A frase da variação, sem a seta: "12% em relação ao mês anterior"; um "-" na frente vira queda */
  tendencia?: string;
  direcao?: DirecaoKpi;
  /** Rodapé em mono: "Atualizado há 15 min" */
  atualizado?: string;
  className?: string;
}

// a frase da variação sem o sinal nem as setas que a pessoa já tenha escrito
const limpar = (t: string) => t.replace(/^[\s+\-−↑↓→]+/, "");

export function CartaoIndicador({ valor, legenda, rotulo = "Indicador / Métrica", icone: Icone = TrendingUp, tom = "marca", tendencia, direcao, atualizado, className }: CartaoIndicadorProps) {
  const sentido = direcaoDe(tendencia, direcao);
  return (
    <div className={["neu-indicator", className].filter(Boolean).join(" ")} role="group" aria-label={`${legenda ?? rotulo}: ${valor}`}>
      <div className="neu-indicator__top">
        <span className="neu-indicator__label">{rotulo}</span>
        <span className="neu-indicator__icon" aria-hidden="true">
          <Icone size={14} />
        </span>
      </div>
      <div className="neu-indicator__mid">
        <div className="neu-indicator__well">
          <p className={`neu-indicator__value neu-tone-${TOM[tom]}`}>{valor}</p>
          {legenda && <p className="neu-indicator__caption">{legenda}</p>}
        </div>
        {tendencia && (
          <span className={`neu-indicator__trend neu-trend--${CLASSE[sentido]}`}>
            <span aria-hidden="true">{SETA[sentido]}</span>
            <span>{limpar(tendencia)}</span>
            <span className="sr-only">{FALADO[sentido]}</span>
          </span>
        )}
      </div>
      {atualizado && (
        <div className="neu-indicator__foot">
          <span>{atualizado}</span>
        </div>
      )}
    </div>
  );
}

export default function NeumorfismoIndicadores() {
  return (
    <ComponentPreview
      title="IndicatorCard"
      description="Um número de destaque num leito afundado, com a legenda do que é contado, a variação em pílula e a hora da última atualização."
      whenToUse={["Uma métrica que merece o cartão inteiro, como o total do mês", "Telas iniciais com poucos números, cada um com seu contexto", "Quando a hora da última atualização importa para confiar no número"]}
      whenNotToUse={["Fileira executiva de quatro números: use o Big Numbers / KPIs", "Séries no tempo ou comparações: use um gráfico", "Valores sem legenda: o número sozinho não diz o que é"]}
      accessibility={[
        "O cartão é um grupo nomeado pela legenda e pelo valor (\"Escolas atendidas: 1.247\")",
        "A seta da variação carrega o sentido, não só a cor, e um texto escondido diz \"alta\", \"queda\" ou \"estável\"",
        "O valor é texto de exibição (30px, extranegrito); a cor do tom nunca é usada em texto de corpo",
        "O ícone do topo é decorativo, escondido dos leitores de tela",
        "O movimento de subir 2% ao passar o mouse só roda quando a pessoa não pediu menos movimento",
      ]}
      code={`<CartaoIndicador valor="1.247" legenda="Escolas atendidas" tendencia="12% em relação ao mês anterior" atualizado="Atualizado há 15 min" />

<CartaoIndicador rotulo="Consultorias" tom="azul" valor="386" legenda="Diagnósticos concluídos" tendencia="4% em relação ao mês anterior" atualizado="Atualizado há 1 h" />

<CartaoIndicador rotulo="Pendências" tom="neutro" valor="23" legenda="Planos aguardando ajuste" tendencia="-15% em relação ao mês anterior" atualizado="Atualizado há 5 min" />`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        <CartaoIndicador valor="1.247" legenda="Escolas atendidas" tendencia="12% em relação ao mês anterior" atualizado="Atualizado há 15 min" />
        <CartaoIndicador rotulo="Consultorias" tom="azul" valor="386" legenda="Diagnósticos concluídos" tendencia="4% em relação ao mês anterior" atualizado="Atualizado há 1 h" />
        <CartaoIndicador rotulo="Pendências" tom="neutro" valor="23" legenda="Planos aguardando ajuste" tendencia="-15% em relação ao mês anterior" atualizado="Atualizado há 5 min" />
      </div>
    </ComponentPreview>
  );
}
