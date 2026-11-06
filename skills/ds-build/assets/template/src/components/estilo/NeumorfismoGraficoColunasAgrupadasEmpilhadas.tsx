import { GraficoBarrasAgrupadas, type GraficoBarrasAgrupadasProps } from "@/components/estilo/NeumorfismoGraficoBarrasAgrupadas";
import type { LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do GroupedStackedChart no estilo Neumorfismo (componente GroupedStackedChart do pacote Neumorphic UI v3.2.0):
 * colunas agrupadas e empilhadas ao mesmo tempo. Dentro de cada categoria há uma coluna por **pilha**, e cada coluna é
 * empilhada a partir das suas séries. É o GraficoBarrasAgrupadas com ids de pilha: 320px de altura, topos arredondados em
 * 4px e até 34px por coluna. Cada série leva um id em `pilha`: as séries com o mesmo id se empilham numa coluna só, e as
 * colunas de ids diferentes ficam lado a lado, na ordem em que aparecem; uma série sem `pilha` vira uma coluna própria.
 * `opacidade` numa série desenha um tom mais claro da mesma cor, e a coluna se lê como uma família de cor (T1 cheio e T2 em
 * laranja claro; T3 cheio e T4 em azul claro). Os segmentos são separados por uma costura fina e afundada, e só o topo de cada
 * coluna é arredondado; as amostras da legenda levam a mesma opacidade. O balão agrupa por coluna, com o segmento de cima
 * primeiro e uma linha de **subtotal** por coluna sob uma divisória em fenda: dê nome às colunas em `rotulosPilha`
 * (`{ a: "1º semestre", b: "2º semestre" }`); sem isso a linha diz "Subtotal". O eixo vai até o maior total de coluna, e
 * apagar uma série na legenda baixa a coluna dela e reescala o eixo. Entra no cartão "Colunas Agrupadas + Empilhadas" do DS (no
 * neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos neu-area* e neu-gbar* vêm de src/styles/estilo.css.
 */

/** As colunas agrupadas e empilhadas: o gráfico de barras com pilhas por série e os padrões de coluna */
export function GraficoColunasAgrupadasEmpilhadas(props: GraficoBarrasAgrupadasProps) {
  return <GraficoBarrasAgrupadas altura={320} raio={4} larguraMaxBarra={34} {...props} />;
}

const REGIOES: LinhaDados[] = [
  { name: "Norte", q1: 42, q2: 38, q3: 45, q4: 51 },
  { name: "Nordeste", q1: 68, q2: 74, q3: 70, q4: 82 },
  { name: "Centro-Oeste", q1: 35, q2: 31, q3: 40, q4: 44 },
  { name: "Sudeste", q1: 88, q2: 92, q3: 95, q4: 104 },
  { name: "Sul", q1: 54, q2: 58, q3: 61, q4: 66 },
];

/** O gráfico do pacote: duas colunas por região, uma por semestre, cada uma empilhada por trimestre */
export default function NeumorfismoColunasAgrupadasEmpilhadas() {
  return (
    <GraficoColunasAgrupadasEmpilhadas
      titulo="Atendimentos por trimestre e região"
      subtitulo="Agrupado por semestre, empilhado por trimestre · mil"
      rotuloX="região"
      dados={REGIOES}
      rotulosPilha={{ a: "1º semestre", b: "2º semestre" }}
      series={[
        { chave: "q1", nome: "T1", pilha: "a", tom: "marca" },
        { chave: "q2", nome: "T2", pilha: "a", tom: "marca", opacidade: 0.5 },
        { chave: "q3", nome: "T3", pilha: "b", tom: "azul" },
        { chave: "q4", nome: "T4", pilha: "b", tom: "azul", opacidade: 0.5 },
      ]}
    />
  );
}
