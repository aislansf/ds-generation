import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do MetricCard no estilo Neumorfismo (componente MetricCard do pacote Neumorphic UI v3.2.0): uma métrica com um
 * mini gráfico ao lado. À esquerda, o rótulo em caixa-alta miúda, o valor em mono extranegrito e a legenda; à direita,
 * ou um anel (`grafico="anel"`, com o `percentual` no centro; o arco começa às 12h e termina com ponta redonda) ou uma
 * série de barras num leito afundado (`grafico="barras"`, `dados` como alturas de 0 a 100; as barras são da cor da marca
 * clareada e a mais alta, a de pico, é a cor da marca cheia). O cartão é um grupo nomeado pelo rótulo e pelo valor, e o
 * gráfico é lido como uma imagem, com o nome e os valores. Entra numa seção nova do neumorfismo ("MetricCard", depois do
 * StatisticCard) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-metric* vêm de src/styles/estilo.css.
 */

export interface CartaoMetricaProps {
  rotulo: string;
  /** Já formatado em pt-BR: "R$ 250K" */
  valor: string;
  legenda?: string;
  grafico?: "anel" | "barras";
  /** 0 a 100, no anel */
  percentual?: number;
  /** Alturas de 0 a 100, nas barras */
  dados?: number[];
  /** Nome do gráfico para leitores de tela: "Meta mensal atingida", "Vendas dos últimos 5 meses" */
  rotuloGrafico?: string;
  className?: string;
}

const DADOS_PADRAO = [40, 65, 35, 80, 55];
const numero = (n: number) => String(n).replace(".", ",");

export function CartaoMetrica({ rotulo, valor, legenda, grafico = "barras", percentual = 0, dados, rotuloGrafico, className }: CartaoMetricaProps) {
  const p = Math.max(0, Math.min(100, percentual));
  const serie = dados ?? DADOS_PADRAO;
  const pico = Math.max(...serie);
  return (
    <div className={["neu-metric", className].filter(Boolean).join(" ")} role="group" aria-label={`${rotulo}: ${valor}`}>
      <div>
        <span className="neu-metric__label">{rotulo}</span>
        <p className="neu-metric__value">{valor}</p>
        {legenda && <p className="neu-metric__text">{legenda}</p>}
      </div>
      {grafico === "anel" ? (
        <div className="neu-ring" role="img" aria-label={`${rotuloGrafico ?? "Progresso"}: ${numero(p)}%`}>
          <svg viewBox="0 0 36 36" width={64} height={64} aria-hidden="true">
            <g transform="rotate(-90 18 18)">
              <circle className="neu-ring__track" cx={18} cy={18} r={14} />
              <circle className="neu-ring__value" cx={18} cy={18} r={14} strokeDasharray={`${p * 0.88}, 100`} />
            </g>
          </svg>
          <span>{Math.round(p)}%</span>
        </div>
      ) : (
        <div className="neu-spark" role="img" aria-label={`${rotuloGrafico ?? "Série"}: ${serie.join(", ")}`}>
          {serie.map((v, i) => (
            <div key={i} className="neu-spark__bar" data-peak={v === pico} style={{ height: `${v}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NeumorfismoMetricas() {
  return (
    <ComponentPreview
      title="MetricCard"
      description="Uma métrica com um mini gráfico ao lado: um anel de percentual ou uma série de barras."
      whenToUse={["Uma métrica compacta com o formato do progresso ou da tendência ao lado", "Grades de métricas em que cada uma tem um mini gráfico", "Quando a forma da série importa mais que cada valor"]}
      whenNotToUse={["Séries com eixos e legenda: use um gráfico completo", "Metas com marco e escala: use o StatisticCard", "Número sem gráfico: use o Big Numbers / KPIs"]}
      accessibility={[
        "O cartão é um grupo nomeado pelo rótulo e pelo valor (\"Vendas Totais: R$ 250K\")",
        "O anel e as barras são lidos como uma imagem, com o nome do gráfico e o percentual ou os valores",
        "O percentual no centro do anel é só desenho: o nome da imagem já o diz",
        "A barra de pico se destaca pela cor cheia; os valores também estão no nome da imagem, então a cor nunca é o único canal",
      ]}
      code={`<CartaoMetrica grafico="anel" percentual={72} rotulo="Vendas Totais" valor="R$ 250K" legenda="Total mensal de vendas" rotuloGrafico="Meta mensal atingida" />

<CartaoMetrica grafico="barras" dados={[40, 65, 35, 80, 55]} rotulo="Projeto A - Vendas" valor="R$ 320K" legenda="Vendas mensais Projeto A" rotuloGrafico="Vendas dos últimos 5 meses" />`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <CartaoMetrica grafico="anel" percentual={72} rotulo="Vendas Totais" valor="R$ 250K" legenda="Total mensal de vendas" rotuloGrafico="Meta mensal atingida" />
        <CartaoMetrica grafico="barras" dados={[40, 65, 35, 80, 55]} rotulo="Projeto A - Vendas" valor="R$ 320K" legenda="Vendas mensais Projeto A" rotuloGrafico="Vendas dos últimos 5 meses" />
      </div>
    </ComponentPreview>
  );
}
