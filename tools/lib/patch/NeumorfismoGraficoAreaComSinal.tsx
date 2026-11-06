import { GraficoArea, type LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do SignedAreaChart no estilo Neumorfismo (componente SignedAreaChart do pacote Neumorphic UI v3.2.0): um gráfico
 * de área para valores que cruzam o zero (saldos mensais, aberturas líquidas, resultados). É o leito do GraficoArea
 * (grade tracejada, série suave, balão e teclado) com o zero como linha de referência: uma fenda em relevo no zero, por
 * cima das áreas, e cada área preenche até o zero, não até o fundo. O preenchimento é de 34% nas pontas e some até 10% no
 * zero, para que picos e vales se leiam. As zonas lavam a metade de cima de verde e a de baixo de vermelho a 5%, cada uma
 * com um rótulo miúdo em caixa-alta ("Saldo positivo" / "Saldo negativo", ou `rotulosZonas`); `zonas={false}` as apaga. Os
 * valores levam o sinal ("+12", "−5", com o menos de verdade) nos eixos e no balão, onde o positivo é verde e o negativo,
 * vermelho: o sinal aparece no texto e na cor. Com duas ou mais séries valem as cores da paleta de dados (marca e azul),
 * porque verde e vermelho já dizem "acima e abaixo do zero". Para entradas e saídas (uma série sempre positiva e outra sempre
 * negativa), dê `tom: "sucesso"` e `tom: "perigo"`: cor e sinal dizem a mesma coisa; apague as zonas e fixe um eixo
 * simétrico com `valoresTicks`. Uma série só com `coresPorSinal` é verde acima do zero e vermelha abaixo, e cada ponto
 * leva a cor do seu sinal. Entra no cartão "Área com Valores Negativos" do DS (no neumorfismo) e só é usado quando
 * ESTILO.id === "neumorfismo". Os estilos neu-area* vêm de src/styles/estilo.css e o motor está em NeumorfismoGraficoArea.
 */

const REGIOES: LinhaDados[] = [
  { name: "Jan", norte: 12, sul: -5 },
  { name: "Fev", norte: 8, sul: -12 },
  { name: "Mar", norte: -4, sul: 6 },
  { name: "Abr", norte: -10, sul: 14 },
  { name: "Mai", norte: 3, sul: 10 },
  { name: "Jun", norte: 15, sul: -3 },
  { name: "Jul", norte: 9, sul: -8 },
  { name: "Ago", norte: -6, sul: 4 },
];

const RESULTADO: LinhaDados[] = [
  { name: "Jan", valor: 42 },
  { name: "Fev", valor: 18 },
  { name: "Mar", valor: -12 },
  { name: "Abr", valor: -35 },
  { name: "Mai", valor: -8 },
  { name: "Jun", valor: 26 },
  { name: "Jul", valor: 51 },
  { name: "Ago", valor: 33 },
];

const FLUXO: LinhaDados[] = [
  { name: "Jan", entradas: 48, saidas: -30 },
  { name: "Fev", entradas: 70, saidas: -48 },
  { name: "Mar", entradas: 90, saidas: -80 },
  { name: "Abr", entradas: 60, saidas: -40 },
  { name: "Mai", entradas: 110, saidas: -100 },
  { name: "Jun", entradas: 80, saidas: -20 },
];

/** Os três gráficos do pacote: entradas e saídas, duas regiões com zonas e uma série com a cor pelo sinal */
export default function NeumorfismoAreaComSinal() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoArea
        titulo="Área com valores negativos"
        subtitulo="Entradas acima do zero, saídas abaixo · 1º semestre"
        rotuloX="mês"
        dados={FLUXO}
        altura={300}
        comSinal
        zonas={false}
        valoresTicks={[-110, -55, 0, 55, 110]}
        series={[
          { chave: "entradas", nome: "Entradas", tom: "sucesso" },
          { chave: "saidas", nome: "Saídas", tom: "perigo" },
        ]}
      />
      <GraficoArea
        titulo="Saldo de empresas abertas por região"
        subtitulo="Aberturas − encerramentos · 2026"
        rotuloX="mês"
        dados={REGIOES}
        altura={300}
        comSinal
        rotulosZonas={["Saldo positivo", "Saldo negativo"]}
        series={[
          { chave: "norte", nome: "Norte" },
          { chave: "sul", nome: "Sul" },
        ]}
      />
      <GraficoArea
        titulo="Resultado mensal"
        subtitulo="Uma série · cor pelo sinal"
        nomeSerie="Resultado"
        rotuloX="mês"
        dados={RESULTADO}
        altura={240}
        comSinal
        coresPorSinal
        rotulosZonas={["Superávit", "Déficit"]}
        formatarValor={(n) => `R$ ${n}k`}
      />
    </div>
  );
}
