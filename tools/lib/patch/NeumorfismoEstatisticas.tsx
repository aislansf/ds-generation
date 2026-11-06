import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import { direcaoDe, type DirecaoKpi } from "@/components/estilo/NeumorfismoKpis";

/**
 * Vitrine do StatisticCard no estilo Neumorfismo (componente StatisticCard do pacote Neumorphic UI v3.2.0): cartões de
 * estatística para painéis, em sete formas. Todas são um painel convexo de cantos largos, com o valor em mono.
 * `meta`: rótulo com uma chave esculpida, o valor, uma calha afundada com o preenchimento da marca e um marco azul
 * (a secundária) em pé sobre a calha, na posição da meta, com a escala 0% … 100% embaixo; ao chegar na meta o
 * preenchimento vira verde. `comparacao`: o valor atual com o período, o anterior em tom discreto e uma pílula afundada
 * de variação, e uma série de barras num leito afundado (as passadas a 24%, a última com o degradê e o brilho).
 * `destaque`: o cartão cheio para o número com que a página abre, com degradê, uma luz suave no canto, o rótulo,
 * o valor, a descrição e um ícone fosco de 64px; `tom="marca"` troca para o degradê da marca. `rosca`: um disco
 * convexo com um anel de 6px e o percentual no centro, valor e legenda à direita. `barras`: valor e legenda à esquerda e
 * uma série de 96 × 56 à direita. `area`: um gráfico de área num leito afundado, com a linha da marca, o preenchimento
 * que some para baixo e um ponto aceso no fim. `relatorio`: uma tabela compacta num leito afundado, com células
 * coloridas (verde na margem positiva, vermelho na negativa, sempre com o sinal escrito). O cabeçalho das quatro
 * últimas tem o título e uma etiqueta (`emblema`) ou uma variação (`delta`). Entra numa seção nova do neumorfismo
 * ("StatisticCard", depois do StatCard) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-statx* vêm de
 * src/styles/estilo.css.
 */

export type VarianteEstatistica = "meta" | "comparacao" | "destaque" | "rosca" | "barras" | "area" | "relatorio";
export type TomEmblema = "marca" | "sucesso" | "azul" | "neutro";

const TOM_EMBLEMA: Record<TomEmblema, string> = { marca: "accent", sucesso: "success", azul: "royal", neutro: "neutral" };

export type CelulaRelatorio = string | { valor: string; tom?: "sucesso" | "perigo" };

export interface EstatisticaProps {
  variante?: VarianteEstatistica;
  /** O título do cartão; no destaque, a linha pequena acima do valor */
  rotulo: string;
  icone?: LucideIcon;
  /** Já formatado em pt-BR: "78,4%" */
  valor?: string;
  legenda?: string;
  // meta
  /** 0 a 100 */
  progresso?: number;
  /** Posição do marco, 0 a 100 */
  meta?: number;
  rotuloMeta?: string;
  // comparação
  periodo?: string;
  anterior?: string;
  periodoAnterior?: string;
  tendencia?: string;
  direcao?: DirecaoKpi;
  /** Números, do mais antigo ao mais novo */
  dados?: number[];
  /** O que a série mostra, para leitores de tela */
  rotuloSerie?: string;
  // destaque
  descricao?: string;
  tom?: "azul" | "marca";
  // cabeçalho das quatro últimas
  emblema?: string | { rotulo: string; tom?: TomEmblema };
  delta?: string;
  // rosca
  percentual?: number;
  rotuloPercentual?: string;
  // relatório
  colunas?: string[];
  linhas?: CelulaRelatorio[][];
  className?: string;
}

const juntar = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const SENTIDO: Record<DirecaoKpi, string> = { alta: "up", queda: "down", estavel: "flat" };
const pct = (n: number) => String(n).replace(".", ",");

function Cabecalho({ rotulo, emblema, delta, direcao }: Pick<EstatisticaProps, "rotulo" | "emblema" | "delta" | "direcao">) {
  const e = typeof emblema === "string" ? { rotulo: emblema } : emblema;
  return (
    <div className="neu-statx__head">
      <h4 className="neu-statx__title">{rotulo}</h4>
      {e ? (
        <span className={`neu-statx__chip neu-statx__chip--${TOM_EMBLEMA[e.tom ?? "marca"]}`}>{e.rotulo}</span>
      ) : delta ? (
        <span className={`neu-statx__delta neu-statx__trend--${SENTIDO[direcaoDe(delta, direcao)]}`}>{delta}</span>
      ) : null}
    </div>
  );
}

function Barras({ dados, classe, minimo }: { dados: number[]; classe: string; minimo: number }) {
  const maximo = Math.max(...dados, 1);
  return (
    <>
      {dados.map((d, i) => (
        <span key={i} className={juntar(classe, i === dados.length - 1 && `${classe}--on`)} style={{ height: `${Math.max(minimo, (d / maximo) * 100)}%` }} />
      ))}
    </>
  );
}

function Meta({ rotulo, icone: Icone, valor = "", legenda, progresso = 0, meta, rotuloMeta, className }: EstatisticaProps) {
  const pr = Math.max(0, Math.min(100, progresso));
  return (
    <section className={juntar("neu-statx", "neu-statx--goal", className)} aria-label={rotulo}>
      <div className="neu-statx__head">
        <span className="neu-statx__label">{rotulo}</span>
        {Icone ? (
          <span className="neu-statx__key" aria-hidden="true">
            <Icone size={16} />
          </span>
        ) : null}
      </div>
      <p className="neu-statx__value">{valor}</p>
      {meta != null && (
        <div className="neu-statx__goalrow" aria-hidden="true">
          <span className="neu-statx__goal-label neu-tone-royal" style={meta > 50 ? { right: `${100 - meta}%` } : { left: `${meta}%` }}>
            {`${rotuloMeta ?? "Meta"}: ${pct(meta)}%`}
          </span>
        </div>
      )}
      <div
        className="neu-statx__track"
        role="progressbar"
        aria-label={rotulo + (meta != null ? `, meta ${pct(meta)}%` : "")}
        aria-valuenow={pr}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={valor}
      >
        <span className={juntar("neu-statx__fill", meta != null && pr >= meta && "neu-statx__fill--met")} style={{ width: `${pr}%` }} />
        {meta != null && <span className="neu-statx__goal" style={{ left: `${meta}%` }} />}
      </div>
      <div className="neu-statx__scale" aria-hidden="true">
        <span>0%</span>
        <span>100%</span>
      </div>
      {legenda && <p className="neu-statx__caption">{legenda}</p>}
    </section>
  );
}

function Comparacao({ rotulo, icone: Icone, valor, periodo, anterior, periodoAnterior, tendencia, direcao, dados = [], rotuloSerie, className }: EstatisticaProps) {
  const sentido = direcaoDe(tendencia, direcao);
  const Seta = sentido === "queda" ? TrendingDown : TrendingUp;
  return (
    <section className={juntar("neu-statx", "neu-statx--cmp", className)} aria-label={rotulo}>
      <div className="neu-statx__head">
        <span className="neu-statx__label">{rotulo}</span>
        {Icone ? (
          <span className="neu-statx__key" aria-hidden="true">
            <Icone size={16} />
          </span>
        ) : null}
      </div>
      <div className="neu-statx__cmp">
        <div>
          <p className="neu-statx__value">{valor}</p>
          <p className="neu-statx__period">{periodo}</p>
        </div>
        {anterior != null && (
          <div>
            <p className="neu-statx__value neu-statx__value--prev">{anterior}</p>
            <p className="neu-statx__period">{periodoAnterior}</p>
          </div>
        )}
        {tendencia && (
          <span className={`neu-statx__trend neu-statx__trend--${SENTIDO[sentido]}`}>
            <Seta aria-hidden="true" size={14} />
            {tendencia}
            <span className="sr-only">{periodoAnterior ? ` em relação a ${periodoAnterior}` : " em relação ao período anterior"}</span>
          </span>
        )}
      </div>
      {dados.length > 0 && (
        <div className="neu-statx__bars" role="img" aria-label={`${rotuloSerie ?? "Série"}: ${dados.join(", ")}`}>
          <Barras dados={dados} classe="neu-statx__bar" minimo={6} />
        </div>
      )}
    </section>
  );
}

function Destaque({ rotulo, icone: Icone, valor, descricao, tom = "azul", className }: EstatisticaProps) {
  return (
    <section className={juntar("neu-statx", "neu-statx--hl", tom === "marca" && "neu-statx--hl-accent", className)} aria-label={rotulo}>
      <div className="neu-statx__hl-text">
        <p className="neu-statx__eyebrow">{rotulo}</p>
        <p className="neu-statx__hl-value">{valor}</p>
        {descricao && <p className="neu-statx__hl-desc">{descricao}</p>}
      </div>
      {Icone ? (
        <span className="neu-statx__hl-icon" aria-hidden="true">
          <Icone size={40} strokeWidth={1.75} />
        </span>
      ) : null}
    </section>
  );
}

function Rosca({ rotulo, valor, legenda, percentual = 0, rotuloPercentual, emblema, delta, direcao, className }: EstatisticaProps) {
  const id = useId().replace(/:/g, "");
  const p = Math.max(0, Math.min(100, percentual));
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <section className={juntar("neu-statx", "neu-statx--donut", className)} aria-label={`${rotulo}: ${valor}`}>
      <Cabecalho rotulo={rotulo} emblema={emblema} delta={delta} direcao={direcao} />
      <div className="neu-statx__split">
        <div className="neu-statx__donut" role="img" aria-label={`${rotuloPercentual ?? "Progresso"}: ${pct(p)}%`}>
          <svg width={64} height={64} viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              <linearGradient id={id} x1={0} y1={0} x2={1} y2={1}>
                <stop offset="0%" style={{ stopColor: "var(--neu-statx-from)" }} />
                <stop offset="100%" style={{ stopColor: "var(--neu-statx-to)" }} />
              </linearGradient>
            </defs>
            <circle cx={32} cy={32} r={r} fill="none" className="neu-statx__ring-track" strokeWidth={6} />
            <circle cx={32} cy={32} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={6} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (p / 100) * c} transform="rotate(-90 32 32)" className="neu-statx__ring" />
          </svg>
          <span className="neu-statx__donut-pct">{Math.round(p)}%</span>
        </div>
        <div className="neu-statx__right">
          <p className="neu-statx__value">{valor}</p>
          {legenda && <p className="neu-statx__period">{legenda}</p>}
        </div>
      </div>
    </section>
  );
}

function SerieBarras({ rotulo, valor, legenda, dados = [], rotuloSerie, emblema, delta, direcao, className }: EstatisticaProps) {
  return (
    <section className={juntar("neu-statx", "neu-statx--spark", className)} aria-label={`${rotulo}: ${valor}`}>
      <Cabecalho rotulo={rotulo} emblema={emblema} delta={delta} direcao={direcao} />
      <div className="neu-statx__split">
        <div className="neu-statx__left">
          <p className="neu-statx__value">{valor}</p>
          {legenda && <p className="neu-statx__period">{legenda}</p>}
        </div>
        <div className="neu-statx__spark" role="img" aria-label={`${rotuloSerie ?? "Série"}: ${dados.join(", ")}`}>
          <Barras dados={dados} classe="neu-statx__bar" minimo={8} />
        </div>
      </div>
    </section>
  );
}

function Area({ rotulo, valor, legenda, dados = [], rotuloSerie, emblema, delta, direcao, className }: EstatisticaProps) {
  const id = useId().replace(/:/g, "");
  const W = 260;
  const H = 64;
  const max = Math.max(...dados);
  const min = Math.min(...dados);
  const faixa = max - min || 1;
  const passo = (W - 20) / Math.max(1, dados.length - 1);
  const pts = dados.map((d, i): [number, number] => [8 + i * passo, H - ((d - min) / faixa) * (H - 12) - 6]);
  const linha = pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const ultimo = pts[pts.length - 1] ?? [0, 0];
  return (
    <section className={juntar("neu-statx", "neu-statx--area", className)} aria-label={`${rotulo}: ${valor}`}>
      <Cabecalho rotulo={rotulo} emblema={emblema} delta={delta} direcao={direcao} />
      <div className="neu-statx__chart" role="img" aria-label={`${rotuloSerie ?? "Série"}: ${dados.join(", ")}`}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} stopOpacity={0.28} />
              <stop offset="100%" style={{ stopColor: "hsl(var(--primary))" }} stopOpacity={0} />
            </linearGradient>
          </defs>
          {pts.length > 0 && <polygon points={`${pts[0][0]},${H} ${linha} ${ultimo[0]},${H}`} fill={`url(#${id})`} />}
          <polyline points={linha} fill="none" className="neu-statx__line" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="neu-statx__endpoint" style={{ left: `${(ultimo[0] / W) * 100}%`, top: `${(ultimo[1] / H) * 100}%` }} />
      </div>
      <p className="neu-statx__value" style={{ marginTop: 12 }}>
        {valor}
      </p>
      {legenda && <p className="neu-statx__period">{legenda}</p>}
    </section>
  );
}

function Relatorio({ rotulo, legenda, colunas = [], linhas = [], emblema, delta, direcao, className }: EstatisticaProps) {
  return (
    <section className={juntar("neu-statx", "neu-statx--report", className)} aria-label={rotulo}>
      <Cabecalho rotulo={rotulo} emblema={emblema} delta={delta} direcao={direcao} />
      <div className="neu-statx__tablewrap">
        <table className="neu-statx__table">
          {legenda && <caption className="sr-only">{legenda}</caption>}
          <thead>
            <tr>
              {colunas.map((c, i) => (
                <th key={i} scope="col" className={i ? "neu-statx__num" : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, ri) => (
              <tr key={ri}>
                {l.map((cel, ci) => {
                  const o = typeof cel === "string" ? { valor: cel } : cel;
                  return ci === 0 ? (
                    <th key={ci} scope="row">
                      {o.valor}
                    </th>
                  ) : (
                    <td key={ci} className={juntar("neu-statx__num", "tom" in o && o.tom && `neu-tone-${o.tom === "sucesso" ? "success" : "danger"}`)}>
                      {o.valor}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CartaoEstatistica(props: EstatisticaProps) {
  switch (props.variante ?? "meta") {
    case "comparacao":
      return <Comparacao {...props} />;
    case "destaque":
      return <Destaque {...props} />;
    case "rosca":
      return <Rosca {...props} />;
    case "barras":
      return <SerieBarras {...props} />;
    case "area":
      return <Area {...props} />;
    case "relatorio":
      return <Relatorio {...props} />;
    default:
      return <Meta {...props} />;
  }
}

const GRADE = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, alignItems: "start" } as const;

export default function NeumorfismoEstatisticas() {
  return (
    <ComponentPreview
      title="StatisticCard"
      description="Sete cartões de estatística para painéis: meta, comparação, destaque, rosca, barras, área e relatório."
      whenToUse={["Painéis com o número e o contexto que o explica, como a meta, o período anterior ou a série", "Um único número de destaque por linha (o destaque)", "Resumos em tabela curta, com a margem colorida pelo sinal (o relatório)"]}
      whenNotToUse={["Séries com eixos, legenda e comparação entre várias linhas: use um gráfico completo", "Uma barra de meta numa grade densa: o StatCard é mais leve", "Mais de um destaque na mesma linha"]}
      accessibility={[
        "Cada cartão é uma região nomeada pelo rótulo (e pelo valor, nas formas sem rótulo próprio)",
        "A calha da meta é uma barra de progresso cujo nome inclui a meta; o marco e a escala são só desenho",
        "A rosca, as barras e a área são lidas como uma imagem, com o nome da série e os valores",
        "A variação carrega o sentido pela seta e pelo texto escondido (\"em relação a Fev/2026\"), nunca só pela cor",
        "A tabela do relatório tem legenda, cabeçalhos de coluna e de linha; as margens coloridas trazem o sinal escrito",
        "O texto branco sobre o degradê do destaque é para valores curtos; no tom da marca o contraste é menor",
      ]}
      code={`<CartaoEstatistica rotulo="Taxa de execução" icone={BarChart3} valor="78,4%" progresso={78.4} meta={95} legenda="Faltam 16,6 p.p. para a meta do trimestre." />

<CartaoEstatistica variante="comparacao" rotulo="Atendimentos: este mês vs anterior" valor="1.247" periodo="Mar/2026" anterior="1.102" periodoAnterior="Fev/2026" tendencia="+13,2%" rotuloSerie="Atendimentos por mês" dados={[40, 55, 30, 65, 50, 70, 80, 60, 90, 85, 75, 95]} />

<CartaoEstatistica variante="destaque" rotulo="Total acumulado 2026" valor="R$ 8,6B" descricao="Recursos transferidos para educação básica" icone={DollarSign} />

<CartaoEstatistica variante="rosca" rotulo="Vendas totais" emblema="Mensal" percentual={72} rotuloPercentual="Meta mensal atingida" valor="R$ 250K" legenda="Total mensal de vendas" />

<CartaoEstatistica variante="barras" rotulo="Projeto A · Vendas" emblema="Mensal" valor="R$ 320K" legenda="Vendas mensais" rotuloSerie="Vendas dos últimos 7 meses" dados={[40, 65, 35, 80, 55, 70, 90]} />

<CartaoEstatistica variante="area" rotulo="Greenfield Towers" delta="+R$ 40K" valor="R$ 550K" legenda="Variação de vendas" rotuloSerie="Vendas dos últimos 8 períodos" dados={[20, 35, 30, 50, 45, 65, 55, 75]} />

<CartaoEstatistica variante="relatorio" rotulo="Relatórios trimestrais" emblema={{ rotulo: "Novo", tom: "sucesso" }} legenda="Receita, despesa e margem por trimestre de 2026"
  colunas={["Trimestre", "Receita", "Despesa", "Margem"]}
  linhas={[["T1 2026", "R$ 210k", "R$ 165k", { valor: "R$ 45k", tom: "sucesso" }], ["T3 2026", "R$ 196k", "R$ 204k", { valor: "−R$ 8k", tom: "perigo" }]]} />`}
    >
      <div className="neu-stack" style={{ gap: 24 }}>
        <div style={GRADE}>
          <CartaoEstatistica rotulo="Taxa de execução" icone={BarChart3} valor="78,4%" progresso={78.4} meta={95} legenda="Faltam 16,6 p.p. para a meta do trimestre." />
          <CartaoEstatistica
            variante="comparacao"
            rotulo="Atendimentos: este mês vs anterior"
            valor="1.247"
            periodo="Mar/2026"
            anterior="1.102"
            periodoAnterior="Fev/2026"
            tendencia="+13,2%"
            rotuloSerie="Atendimentos por mês, últimos 12 meses"
            dados={[40, 55, 30, 65, 50, 70, 80, 60, 90, 85, 75, 95]}
          />
          <CartaoEstatistica variante="destaque" rotulo="Total acumulado 2026" valor="R$ 8,6B" descricao="Recursos transferidos para educação básica em todo o Brasil" icone={DollarSign} />
        </div>
        <div style={GRADE}>
          <CartaoEstatistica variante="rosca" rotulo="Vendas totais" emblema="Mensal" percentual={72} rotuloPercentual="Meta mensal atingida" valor="R$ 250K" legenda="Total mensal de vendas" />
          <CartaoEstatistica variante="barras" rotulo="Projeto A · Vendas" emblema="Mensal" valor="R$ 320K" legenda="Vendas mensais do Projeto A" rotuloSerie="Vendas dos últimos 7 meses" dados={[40, 65, 35, 80, 55, 70, 90]} />
          <CartaoEstatistica variante="area" rotulo="Greenfield Towers" delta="+R$ 40K" valor="R$ 550K" legenda="Variação de vendas" rotuloSerie="Vendas dos últimos 8 períodos" dados={[20, 35, 30, 50, 45, 65, 55, 75]} />
        </div>
        <div style={{ maxWidth: 560 }}>
          <CartaoEstatistica
            variante="relatorio"
            rotulo="Relatórios trimestrais"
            emblema={{ rotulo: "Novo", tom: "sucesso" }}
            legenda="Receita, despesa e margem por trimestre de 2026"
            colunas={["Trimestre", "Receita", "Despesa", "Margem"]}
            linhas={[
              ["T1 2026", "R$ 210k", "R$ 165k", { valor: "R$ 45k", tom: "sucesso" }],
              ["T2 2026", "R$ 248k", "R$ 182k", { valor: "R$ 66k", tom: "sucesso" }],
              ["T3 2026", "R$ 196k", "R$ 204k", { valor: "−R$ 8k", tom: "perigo" }],
            ]}
          />
        </div>
      </div>
    </ComponentPreview>
  );
}
