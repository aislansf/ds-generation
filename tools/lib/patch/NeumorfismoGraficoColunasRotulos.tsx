import { GraficoBarrasAgrupadas, type GraficoBarrasAgrupadasProps } from "@/components/estilo/NeumorfismoGraficoBarrasAgrupadas";
import type { LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do DataLabelChart no estilo Neumorfismo (componente DataLabelChart do pacote Neumorphic UI v3.2.0): colunas com o
 * valor impresso acima de cada barra. É o GraficoBarrasAgrupadas com os rótulos ligados: 320px de altura, topos de 4px e um
 * vão afundado atrás de cada coluna. Cada rótulo fica numa pílula convexa pequena (com aresta clara e sombras em par),
 * centrada 8px acima da coluna, em mono negrito de 11px; os valores negativos penduram o rótulo abaixo da barra. Quando a
 * pílula não cabe na largura da coluna (gráficos densos ou com várias séries), o rótulo cai para texto puro, e
 * `rotulosDados="texto"` imprime só o número acima de cada barra. Com `destaque="max"`, a coluna maior brilha mais e a
 * pílula dela ganha uma borda tingida e um ponto aceso na cor da série. Ao passar o mouse ou andar por uma categoria, as
 * outras colunas e os rótulos esmaecem a cerca de 40%, para o valor em foco ler primeiro. O balão, a legenda, o teclado e o
 * resumo falado são os do GraficoBarrasAgrupadas; com `empilhado` aparece um rótulo com o total da coluna acima do segmento
 * de cima. `formatarRotulo` muda o formato do rótulo. Entra no cartão "Colunas com Data Labels" do DS (no neumorfismo) e só é
 * usado quando ESTILO.id === "neumorfismo". Os estilos neu-area* e neu-gbar* vêm de src/styles/estilo.css.
 */

/** As colunas com rótulos: o gráfico de barras com os padrões de coluna e as pílulas de valor ligadas */
export function GraficoColunasRotulos(props: GraficoBarrasAgrupadasProps) {
  return <GraficoBarrasAgrupadas altura={320} fendas raio={4} rotulosDados="pilula" {...props} />;
}

const EMPRESAS: LinhaDados[] = [
  { name: "Jan", valor: 128 },
  { name: "Fev", valor: 142 },
  { name: "Mar", valor: 165 },
  { name: "Abr", valor: 151 },
  { name: "Mai", valor: 188 },
  { name: "Jun", valor: 176 },
  { name: "Jul", valor: 204 },
  { name: "Ago", valor: 197 },
];

const TURMAS: LinhaDados[] = [
  { name: "Fortaleza", presencial: 42, online: 35 },
  { name: "Sobral", presencial: 18, online: 24 },
  { name: "Juazeiro", presencial: 21, online: 16 },
  { name: "Crato", presencial: 12, online: 14 },
  { name: "Iguatu", presencial: 9, online: 11 },
];

/** Os dois gráficos do pacote: uma série com pílulas e o maior em destaque, e duas séries com rótulos em texto */
export default function NeumorfismoColunasRotulos() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoColunasRotulos titulo="Empresas atendidas por mês" subtitulo="Rótulo de valor acima de cada coluna · maior valor em destaque" nomeSerie="Empresas" rotuloX="mês" dados={EMPRESAS} destaque="max" legenda={false} />
      <GraficoColunasRotulos
        titulo="Turmas por município"
        subtitulo="Duas séries · rótulos em texto"
        rotuloX="município"
        dados={TURMAS}
        altura={280}
        rotulosDados="texto"
        fendas={false}
        series={[
          { chave: "presencial", nome: "Presencial", tom: "azul" },
          { chave: "online", nome: "Online", tom: "marca" },
        ]}
      />
    </div>
  );
}
