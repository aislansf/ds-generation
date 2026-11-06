import { GraficoBarrasAgrupadas, type GraficoBarrasAgrupadasProps } from "@/components/estilo/NeumorfismoGraficoBarrasAgrupadas";
import type { LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do ColumnChart no estilo Neumorfismo (componente ColumnChart do pacote Neumorphic UI v3.2.0): colunas agrupadas
 * simples para comparar poucas séries por categoria. É o GraficoBarrasAgrupadas com os padrões de coluna: 320px de altura,
 * topos arredondados em 4px e cada coluna de pé no seu próprio vão. Atrás de cada coluna há um vão de altura total, afundado
 * no leito de plotagem (com uma aresta clara no alto à esquerda e uma sombra suave embaixo à direita), de modo que cada valor
 * se lê como a parte cheia de uma trilha. As colunas são degradês na cor da série, com um brilho suave, subindo da linha de
 * base sólida no zero. `rotuloY` põe o título do eixo Y girado em −90° na borda esquerda, em 11px negrito e tom discreto
 * ("R$ (milhões)"). As cores se dão por série (`tom`): sucesso (verde), marca (laranja no pacote) e azul (a secundária). O resto vem do
 * GraficoBarrasAgrupadas: a coluna em foco (uma faixa que sobe, colunas mais brilhantes, as outras esmaecidas), o balão com
 * todas as séries, a legenda que liga e desliga com amostras quadradas, o teclado e o resumo falado. Entra no cartão "Colunas
 * Básicas (Múltiplas séries)" do DS (no neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos neu-area* e
 * neu-gbar* vêm de src/styles/estilo.css.
 */

/** As colunas básicas: o gráfico de barras com os padrões de coluna (altura 320, topo de 4px e um vão atrás de cada uma) */
export function GraficoColunas(props: GraficoBarrasAgrupadasProps) {
  return <GraficoBarrasAgrupadas altura={320} fendas raio={4} {...props} />;
}

const PROGRAMAS: LinhaDados[] = [
  { name: "Fev", pnae: 44, pnate: 76, pdde: 35 },
  { name: "Mar", pnae: 55, pnate: 85, pdde: 41 },
  { name: "Abr", pnae: 57, pnate: 101, pdde: 36 },
  { name: "Mai", pnae: 56, pnate: 98, pdde: 26 },
  { name: "Jun", pnae: 61, pnate: 87, pdde: 45 },
  { name: "Jul", pnae: 58, pnate: 105, pdde: 48 },
];

/** O gráfico do pacote: três programas por mês, com o título do eixo Y */
export default function NeumorfismoColunas() {
  return (
    <GraficoColunas
      titulo="Investimento por programa"
      subtitulo="Valores mensais · 2026"
      rotuloY="R$ (milhões)"
      rotuloX="mês"
      dados={PROGRAMAS}
      series={[
        { chave: "pnae", nome: "Empreendedorismo", tom: "sucesso" },
        { chave: "pnate", nome: "Inovação", tom: "marca" },
        { chave: "pdde", nome: "Tecnologia", tom: "azul" },
      ]}
    />
  );
}
