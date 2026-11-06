import { GraficoArea, type GraficoAreaProps, type LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do MultiLineChart no estilo Neumorfismo (componente MultiLineChart do pacote Neumorphic UI v3.2.0): um gráfico de
 * linhas com várias séries, em SVG, sem biblioteca de gráficos. É o GraficoArea com `linhas` ligado: a mesma casca (leito
 * afundado de plotagem num painel convexo, grade tracejada, valores bonitos do eixo Y em mono, balão ao lado da guia,
 * teclado e legenda que liga e desliga). As linhas são curvas monótonas de 2,5px, cada uma com um brilho suave na sua cor,
 * assentadas num sulco fraco e afundado (um canal de 7px com uma pequena sombra e um realce por dentro), de modo que parecem
 * pressionadas no leito. Não há preenchimento. Cada ponto é um anel de 4px, e os pontos da coluna ativa viram LEDs acesos de
 * 6,5px. As cores seguem a paleta de dados: marca, azul (a secundária), sucesso, atenção e neutro. `tracejada` numa série
 * desenha a linha tracejada (6 5), para metas, previsões ou o período anterior, e a amostra da legenda também é tracejada. A
 * legenda é de chaves convexas com uma amostra curta de linha na cor da série; apagar uma série afunda a chave, deixa a
 * amostra só no contorno e reescala o eixo. `semZero` ajusta o eixo Y aos dados em vez de partir do zero: é para índices e notas,
 * em que a variação conta mais que a distância do zero. O balão traz o rótulo do eixo X e "Série: valor" de cada série visível. O
 * grupo focável lê todas as séries visíveis, ← → Home End andam pelas colunas e uma região educada anuncia cada uma; a cor nunca é
 * o único sinal, porque a legenda e o balão sempre nomeiam a série e as tracejadas diferem também na forma. Entra no cartão
 * "Gráfico de Linhas Múltiplas" do DS (no neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos neu-area*
 * vêm de src/styles/estilo.css e o motor está em NeumorfismoGraficoArea.
 */

/** O gráfico de linhas: o gráfico de área sem preenchimento, com sulco sob a linha e anéis em todos os pontos */
export function GraficoLinhas(props: GraficoAreaProps) {
  return <GraficoArea linhas pontos {...props} />;
}

const FINANCAS: LinhaDados[] = [
  { name: "Jan", receita: 4200, custo: 2900, lucro: 1300 },
  { name: "Fev", receita: 3900, custo: 2800, lucro: 1100 },
  { name: "Mar", receita: 5100, custo: 3300, lucro: 1800 },
  { name: "Abr", receita: 4700, custo: 3500, lucro: 1200 },
  { name: "Mai", receita: 5600, custo: 3400, lucro: 2200 },
  { name: "Jun", receita: 6200, custo: 3800, lucro: 2400 },
];

const NPS: LinhaDados[] = [
  { name: "S1", fortaleza: 72, interior: 64, meta: 75 },
  { name: "S2", fortaleza: 74, interior: 66, meta: 75 },
  { name: "S3", fortaleza: 71, interior: 69, meta: 75 },
  { name: "S4", fortaleza: 77, interior: 70, meta: 75 },
  { name: "S5", fortaleza: 79, interior: 73, meta: 75 },
  { name: "S6", fortaleza: 78, interior: 76, meta: 75 },
  { name: "S7", fortaleza: 81, interior: 77, meta: 75 },
  { name: "S8", fortaleza: 83, interior: 79, meta: 75 },
];

const reais = (n: number | string) => "R$ " + Number(n).toLocaleString("pt-BR");

/** Os dois gráficos do pacote: receita, custo e lucro em reais, e o NPS por região com a meta tracejada e o eixo ajustado */
export default function NeumorfismoLinhas() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoLinhas
        titulo="Receita, custo e lucro"
        subtitulo="1º semestre de 2026"
        emblema={{ rotulo: "Mensal" }}
        rotuloX="mês"
        dados={FINANCAS}
        altura={300}
        formatarValor={reais}
        series={[
          { chave: "receita", nome: "Receita" },
          { chave: "custo", nome: "Custo" },
          { chave: "lucro", nome: "Lucro" },
        ]}
      />
      <GraficoLinhas
        titulo="Satisfação (NPS) por região"
        subtitulo="Últimas 8 semanas · eixo ajustado aos dados"
        rotuloX="semana"
        dados={NPS}
        altura={240}
        semZero
        series={[
          { chave: "fortaleza", nome: "Fortaleza", tom: "azul" },
          { chave: "interior", nome: "Interior", tom: "marca" },
          { chave: "meta", nome: "Meta", tom: "neutro", tracejada: true },
        ]}
      />
    </div>
  );
}
