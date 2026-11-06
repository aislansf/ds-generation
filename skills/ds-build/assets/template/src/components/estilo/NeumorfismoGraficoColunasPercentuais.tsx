import { GraficoBarrasAgrupadas, type GraficoBarrasAgrupadasProps } from "@/components/estilo/NeumorfismoGraficoBarrasAgrupadas";
import type { LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do PercentColumnChart no estilo Neumorfismo (componente PercentColumnChart do pacote Neumorphic UI v3.2.0): colunas
 * 100% empilhadas, em que cada categoria é uma coluna de altura cheia repartida na fatia de cada série. É o
 * GraficoBarrasAgrupadas com `empilhado="percentual"` e os rótulos internos ligados, a 320px de altura. Os valores são
 * normalizados por categoria, então toda coluna chega a 100% (podem ser contagens ou porcentagens: o gráfico mostra a fatia de
 * cada série) e o eixo lê 0% · 25% · 50% · 75% · 100%. Os segmentos se empilham na ordem de `series`, do chão para cima,
 * separados por uma costura fina e afundada; só o segmento de cima é arredondado (4px). Cada segmento com mais de 18px de
 * altura leva a fatia ("45%") no centro, numa pílula pequena e convexa, em mono negrito de 10px: o branco sobre a laranja ou o
 * verde fica abaixo do contraste legível, e a pílula mantém o rótulo legível em todas as cores e nos dois temas. Se a coluna
 * for estreita demais para a pílula, o rótulo vira texto branco com contorno escuro. O balão traz a categoria e a fatia de cada
 * série, de cima para baixo (`mostrarBruto` põe também o valor bruto). A legenda recalcula as fatias, e o teclado e o resumo
 * falado são os do GraficoBarrasAgrupadas. Entra no cartão "Colunas 100% Empilhadas" do DS (no neumorfismo) e só é usado quando
 * ESTILO.id === "neumorfismo". Os estilos neu-area* e neu-gbar* vêm de src/styles/estilo.css.
 */

/** As colunas 100% empilhadas: o gráfico de barras em modo percentual, com a fatia dentro de cada segmento */
export function GraficoColunasPercentuais(props: GraficoBarrasAgrupadasProps) {
  return <GraficoBarrasAgrupadas altura={320} empilhado="percentual" rotulosInternos larguraMaxBarra={56} raio={4} {...props} />;
}

const PARTICIPACAO: LinhaDados[] = [
  { name: "Jan", produto_a: 30, produto_b: 45, produto_c: 25 },
  { name: "Fev", produto_a: 28, produto_b: 48, produto_c: 24 },
  { name: "Mar", produto_a: 35, produto_b: 40, produto_c: 25 },
  { name: "Abr", produto_a: 32, produto_b: 38, produto_c: 30 },
  { name: "Mai", produto_a: 40, produto_b: 35, produto_c: 25 },
  { name: "Jun", produto_a: 37, produto_b: 33, produto_c: 30 },
];

/** O gráfico do pacote: a participação de três programas no total de cada mês */
export default function NeumorfismoColunasPercentuais() {
  return (
    <GraficoColunasPercentuais
      titulo="Participação por programa"
      subtitulo="Colunas 100% empilhadas · % do total mensal"
      rotuloX="mês"
      dados={PARTICIPACAO}
      series={[
        { chave: "produto_a", nome: "Empreendedorismo", tom: "sucesso" },
        { chave: "produto_b", nome: "Inovação", tom: "marca" },
        { chave: "produto_c", nome: "Tecnologia", tom: "azul" },
      ]}
    />
  );
}
