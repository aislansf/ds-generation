import { GraficoArea, type LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do StackedAreaChart no estilo Neumorfismo (componente StackedAreaChart do pacote Neumorphic UI v3.2.0): um
 * gráfico de área em que as séries se empilham, então a borda de cima lê o total e cada faixa, uma parte. É o leito do
 * GraficoArea (grade tracejada, faixas suaves, balão, teclado e legenda que liga e desliga). Cada série preenche o espaço
 * entre a faixa de baixo e a sua linha de cima; a primeira fica no chão e as seguintes sobem, na ordem de `series`. Os
 * preenchimentos são mais densos que nos gráficos sobrepostos (62% no alto, descendo a 38%), para que as faixas leiam como
 * camadas sólidas, e cada faixa mantém a linha de cima de 2,5px com brilho na sua cor. As cores seguem a paleta de dados:
 * marca, azul (a secundária), sucesso, atenção e neutro. O balão lista as faixas de cima para baixo, como no desenho,
 * cada uma com o próprio valor (não a soma corrida), e abaixo de uma divisória em fenda vem o **Total**. Apagar uma série
 * na legenda tira a faixa, as de cima descem para ocupar o espaço e o eixo Y reescala para o novo total. Com
 * `empilhado="percentual"` cada coluna é normalizada para 100%: o eixo vai de 0 a 100% e o balão acrescenta a fatia de cada
 * série ao lado do valor. O empilhamento supõe valores não negativos; para dados que cruzam o zero, use o gráfico com
 * sinal. Entra no cartão "Área Empilhada (Stacked)" do DS (no neumorfismo) e só é usado quando ESTILO.id ===
 * "neumorfismo". Os estilos neu-area* vêm de src/styles/estilo.css e o motor está em NeumorfismoGraficoArea.
 */

const REGIOES: LinhaDados[] = [
  { name: "Jan", sul: 42, norte: 28, centro: 18 },
  { name: "Fev", sul: 48, norte: 32, centro: 20 },
  { name: "Mar", sul: 45, norte: 38, centro: 26 },
  { name: "Abr", sul: 55, norte: 35, centro: 30 },
  { name: "Mai", sul: 60, norte: 42, centro: 28 },
  { name: "Jun", sul: 58, norte: 48, centro: 35 },
];

const SERIES = [
  { chave: "sul", nome: "Sul" },
  { chave: "norte", nome: "Norte" },
  { chave: "centro", nome: "Centro" },
];

/** Os dois gráficos do pacote: empilhado e 100% empilhado, com os mesmos dados */
export default function NeumorfismoAreaEmpilhada() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoArea titulo="Atendimentos por região" subtitulo="Empilhado · 1º semestre de 2026" rotuloX="mês" dados={REGIOES} altura={300} series={SERIES} empilhado />
      <GraficoArea
        empilhado="percentual"
        titulo="Participação por região"
        subtitulo="100% empilhado"
        emblema={{ rotulo: "Percentual", tom: "azul" }}
        rotuloX="mês"
        dados={REGIOES}
        altura={240}
        series={SERIES}
      />
    </div>
  );
}
