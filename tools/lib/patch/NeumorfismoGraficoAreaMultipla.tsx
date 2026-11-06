import { GraficoArea, type LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do MultiAreaChart no estilo Neumorfismo (componente MultiAreaChart do pacote Neumorphic UI v3.2.0): o mesmo
 * gráfico do AreaChart (leito afundado, grade tracejada, curvas monótonas, balão e teclado) com duas ou mais séries
 * sobrepostas e uma legenda que liga e desliga cada uma. As cores seguem a paleta de dados, nesta ordem: marca, azul
 * (a secundária), sucesso, atenção e neutro; as séries de trás para a frente, com as seguintes por cima, cada linha com
 * o brilho da própria cor sobre um preenchimento que some de 22% a 2%. O vermelho não é cor de série (significa erro no
 * sistema): só use `tom: "perigo"` quando a série for mesmo uma contagem de falhas. A legenda é uma fileira de chaves
 * convexas com um LED na cor da série; apagar uma chave a afunda, esvazia o LED, risca o rótulo e reescala o eixo Y para as
 * séries visíveis, e a última visível não se apaga (`aria-pressed`). O balão lista cada série visível com o seu ponto; o
 * resumo falado e a região educada trazem o nome de cada série, então a cor nunca é o único sinal. Entra no cartão
 * "Spline Area (Múltiplas séries)" do DS (no neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos
 * neu-area* vêm de src/styles/estilo.css e o motor está em NeumorfismoGraficoArea.
 */

const DISPOSITIVOS: LinhaDados[] = [
  { name: "10 AM", iphone: 95, android: 78 },
  { name: "1 PM", iphone: 110, android: 85 },
  { name: "4 PM", iphone: 100, android: 92 },
  { name: "7 PM", iphone: 120, android: 80 },
  { name: "10 PM", iphone: 88, android: 70 },
];

const CANAIS: LinhaDados[] = [
  { name: "Jan", presencial: 320, online: 180, telefone: 90 },
  { name: "Fev", presencial: 300, online: 210, telefone: 95 },
  { name: "Mar", presencial: 340, online: 260, telefone: 88 },
  { name: "Abr", presencial: 310, online: 300, telefone: 102 },
  { name: "Mai", presencial: 290, online: 345, telefone: 110 },
  { name: "Jun", presencial: 305, online: 390, telefone: 98 },
];

/** Os dois gráficos do pacote: duas séries nas cores da ordem padrão e três séries com as cores escolhidas */
export default function NeumorfismoAreaMultipla() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoArea
        titulo="Acessos por dispositivo"
        subtitulo="Hoje · por horário"
        emblema={{ rotulo: "Diário" }}
        rotuloX="horário"
        dados={DISPOSITIVOS}
        altura={300}
        series={[
          { chave: "iphone", nome: "iPhone" },
          { chave: "android", nome: "Android" },
        ]}
      />
      <GraficoArea
        titulo="Atendimentos por canal"
        subtitulo="1º semestre de 2026"
        rotuloX="mês"
        dados={CANAIS}
        altura={240}
        series={[
          { chave: "presencial", nome: "Presencial", tom: "azul" },
          { chave: "online", nome: "Online", tom: "marca" },
          { chave: "telefone", nome: "Telefone", tom: "sucesso" },
        ]}
      />
    </div>
  );
}
