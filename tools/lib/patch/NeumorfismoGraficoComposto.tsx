import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { CLASSE_EMBLEMA, CLASSE_TOM, TONS, caminhoMonotono, ticksBonitos, type LinhaDados, type TomEmblemaArea, type TomSerie } from "@/components/estilo/NeumorfismoGraficoArea";
import { retanguloArredondado } from "@/components/estilo/NeumorfismoGraficoBarrasAgrupadas";

/**
 * Vitrine do ComposedChart no estilo Neumorfismo (componente ComposedChart do pacote Neumorphic UI v3.2.0): área, barras e
 * linhas num mesmo eixo de categorias, em SVG, sem biblioteca de gráficos. Usa a casca dos outros gráficos: leito afundado de
 * plotagem num painel convexo, grade tracejada, valores bonitos em mono, balão convexo, teclado e legenda que liga e desliga. As
 * camadas, de trás para a frente: as áreas (preenchimento de 30% a 3% sob uma linha com brilho), depois as barras (degradê,
 * topo arredondado em 6px, brilho suave), a linha de base do zero e, por cima, as linhas (2,5px num sulco afundado, com anéis de
 * 4px). Cada série segue o seu `tipo`, esteja onde estiver em `series`. As cores seguem a paleta de dados, na ordem das séries:
 * marca, azul (a secundária) e sucesso. Na coluna em foco, uma faixa suave sobe atrás da categoria, as barras brilham mais e as
 * outras esmaecem, e os pontos das linhas e das áreas acendem. O balão traz a categoria e "Série: valor" de cada série visível,
 * cada linha com um marcador do tipo (um quadrado para as barras, um traço para as linhas e um ponto para as áreas). A legenda
 * tem chaves convexas cuja amostra mostra o tipo (um bloco esmaecido com uma aresta de cima para a área, uma coluna pequena para
 * as barras e um traço para as linhas); apagar uma série reescala o eixo dela. Segundo eixo: `eixo: "direito"` põe uma série num
 * eixo à direita, com escala própria e `formatarDireito` (barras em R$ e uma linha em %, por exemplo); os valores da direita se
 * alinham às linhas da grade da esquerda, e a legenda marca essas séries com →. O gráfico é um grupo focável cujo nome lê cada
 * série com o tipo e o eixo; ← → Home End andam pelas categorias e uma região educada anuncia cada uma. Os tipos se distinguem
 * pela forma e não só pela cor. Entra no cartão "Gráfico Composto (Área + Barra + Linha)" do DS (no neumorfismo) e só é usado
 * quando ESTILO.id === "neumorfismo". Os estilos neu-area*, neu-gbar* e neu-comp* vêm de src/styles/estilo.css.
 */

export type TipoSerieComposta = "area" | "barra" | "linha";

export interface SerieComposta {
  chave: string;
  nome?: string;
  tipo?: TipoSerieComposta;
  tom?: TomSerie;
  eixo?: "esquerdo" | "direito";
  tracejada?: boolean;
}

export interface GraficoCompostoProps {
  dados: LinhaDados[];
  chaveX?: string;
  series: SerieComposta[];
  titulo?: string;
  subtitulo?: string;
  emblema?: { rotulo: string; tom?: TomEmblemaArea };
  altura?: number;
  formatarValor?: (v: number | string) => string;
  formatarDireito?: (v: number | string) => string;
  ticks?: number;
  valoresTicks?: number[];
  valoresTicksDireito?: number[];
  curva?: "monotona" | "linear";
  legenda?: boolean;
  moldura?: boolean;
  larguraGrupo?: number;
  larguraMaxBarra?: number;
  raio?: number;
  className?: string;
}

const juntar = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");
const virgula = (v: number | string) => String(v).replace(".", ",");
const NOME_TIPO: Record<TipoSerieComposta, string> = { area: "área", barra: "barras", linha: "linha" };

export function GraficoComposto(props: GraficoCompostoProps) {
  const { dados, chaveX = "name", altura: H = 300, titulo, subtitulo, emblema, className } = props;
  const series = props.series.map((s, i) => ({
    chave: s.chave,
    nome: s.nome ?? s.chave,
    tipo: s.tipo ?? ("linha" as TipoSerieComposta),
    tom: s.tom ?? TONS[i % TONS.length],
    eixo: s.eixo === "direito" ? ("direito" as const) : ("esquerdo" as const),
    tracejada: !!s.tracejada,
  }));
  type Serie = (typeof series)[number];
  const fmtL = props.formatarValor ?? virgula;
  const fmtR = props.formatarDireito ?? fmtL;
  const fmtDe = (s: Serie) => (s.eixo === "direito" ? fmtR : fmtL);

  const ref = useRef<HTMLDivElement>(null);
  const id = "neu-comp" + useId().replace(/:/g, "");
  const [W, setW] = useState(560);
  const [ativo, setAtivo] = useState<number | null>(null);
  const [ocultas, setOcultas] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const w = el.clientWidth;
      if (w) setW(w);
    };
    medir();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(medir);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const visiveis = series.filter((s) => !ocultas[s.chave]);
  const temDireito = visiveis.some((s) => s.eixo === "direito");
  function ticksDoEixo(lado: "esquerdo" | "direito"): number[] {
    let v: number[] = [];
    visiveis.forEach((s) => {
      if (s.eixo === lado) dados.forEach((d) => v.push(Number(d[s.chave])));
    });
    if (!v.length) v = [0, 1];
    const tv = lado === "direito" ? props.valoresTicksDireito : props.valoresTicks;
    return tv && tv.length > 1 ? tv.slice().sort((a, b) => a - b) : ticksBonitos(Math.min(0, ...v), Math.max(...v), props.ticks ?? 5);
  }
  const tL = ticksDoEixo("esquerdo");
  let tR: number[] | null = temDireito ? ticksDoEixo("direito") : null;
  if (tR && tR.length !== tL.length) {
    const lo = tR[0];
    const hi = tR[tR.length - 1];
    const st = (hi - lo) / (tL.length - 1);
    tR = tL.map((_, i) => Math.round((lo + st * i) * 100) / 100);
  }
  const txt = (f: (v: number | string) => string, t: number) => (t < 0 ? "−" + f(-t) : f(t));
  const largura = (ticks: number[], f: (v: number | string) => string) => 18 + Math.max(...ticks.map((t) => String(txt(f, t)).length)) * 6.8;
  const padL = Math.max(44, largura(tL, fmtL));
  const padR = tR ? Math.max(44, largura(tR, fmtR)) : 16;
  const padT = 16;
  const padB = 32;
  const iw = Math.max(10, W - padL - padR);
  const ih = H - padT - padB;
  const n = Math.max(1, dados.length);
  const banda = iw / n;
  const yDe = (ticks: number[]) => {
    const a0 = ticks[0];
    const a1 = ticks[ticks.length - 1];
    return (v: number) => padT + ih - ((v - a0) / (a1 - a0)) * ih;
  };
  const yL = yDe(tL);
  const yR = tR ? yDe(tR) : yL;
  const ys = (s: Serie) => (s.eixo === "direito" ? yR : yL);
  const cxEm = (i: number) => padL + banda * i + banda / 2;
  const mk = (q: [number, number][]) => (props.curva === "linear" ? q.map((r, i) => `${i ? "L" : "M"}${r[0]},${r[1]}`).join("") : caminhoMonotono(q));
  const barras = visiveis.filter((s) => s.tipo === "barra");
  const nb = Math.max(1, barras.length);
  const vao = 6;
  const barW = Math.max(4, Math.min((banda * (props.larguraGrupo ?? 0.5) - vao * (nb - 1)) / nb, props.larguraMaxBarra ?? 32));
  const gw = barW * nb + vao * (nb - 1);

  function teclas(e: KeyboardEvent) {
    let i: number | null = ativo == null ? -1 : ativo;
    if (e.key === "ArrowRight") i = Math.min(n - 1, i + 1);
    else if (e.key === "ArrowLeft") i = Math.max(0, i < 0 ? 0 : i - 1);
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else if (e.key === "Escape") i = null;
    else return;
    e.preventDefault();
    setAtivo(i);
  }

  const camadas: { area: ReactNode[]; barra: ReactNode[]; linha: ReactNode[] } = { area: [], barra: [], linha: [] };
  visiveis.forEach((s) => {
    const y = ys(s);
    const pts: [number, number][] = dados.map((d, i) => [+cxEm(i).toFixed(2), +y(Number(d[s.chave])).toFixed(2)]);
    const base = y(0);
    const cls = `neu-area__s neu-area__s--${CLASSE_TOM[s.tom]}`;
    const gid = `${id}-${s.chave}`;
    if (s.tipo === "area") {
      const linha = mk(pts);
      const area = `${linha}L${pts[pts.length - 1][0]},${base}L${pts[0][0]},${base}Z`;
      camadas.area.push(
        <g key={s.chave} className={cls}>
          <defs>
            <linearGradient id={gid} x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" className="neu-area__stop" stopOpacity={0.3} />
              <stop offset="100%" className="neu-area__stop" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
          <path d={linha} className="neu-area__line" />
        </g>,
      );
    } else if (s.tipo === "barra") {
      const bi = barras.indexOf(s);
      camadas.barra.push(
        <g key={s.chave} className={cls}>
          <defs>
            <linearGradient id={gid} x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" className="neu-area__stop" stopOpacity={1} />
              <stop offset="100%" className="neu-area__stop" stopOpacity={0.72} />
            </linearGradient>
          </defs>
          {dados.map((d, i) => {
            const v = Number(d[s.chave]) || 0;
            const topo = y(Math.max(v, 0));
            const fundo = y(Math.min(v, 0));
            const bx = cxEm(i) - gw / 2 + bi * (barW + vao);
            return <path key={i} d={retanguloArredondado(bx, topo, barW, fundo - topo, props.raio ?? 6, v < 0)} fill={`url(#${gid})`} className={juntar("neu-gbar__bar", ativo === i && "neu-gbar__bar--on", ativo != null && ativo !== i && "neu-gbar__bar--dim")} />;
          })}
        </g>,
      );
    } else {
      camadas.linha.push(
        <g key={s.chave} className={cls}>
          <path d={mk(pts)} className="neu-area__line-track" />
          <path d={mk(pts)} className={juntar("neu-area__line", "neu-area__line--solo", s.tracejada && "neu-area__line--dashed")} />
          {pts.map((q, i) => (
            <circle key={i} cx={q[0]} cy={q[1]} r={ativo === i ? 6.5 : 4} className={juntar("neu-area__dot", ativo === i && "neu-area__dot--on")} />
          ))}
        </g>,
      );
    }
    if (s.tipo === "area" && ativo != null) camadas.area.push(<circle key={s.chave + "a"} cx={pts[ativo][0]} cy={pts[ativo][1]} r={6} className={`${cls} neu-area__dot neu-area__dot--on`} />);
  });

  const tipX = ativo != null ? cxEm(ativo) : null;
  const esquerda = tipX != null && tipX > W * 0.6;
  const zero = yL(Math.max(tL[0], Math.min(0, tL[tL.length - 1])));

  const grafico = (
    <div className="neu-area__plot" ref={ref} style={{ height: H }}>
      <svg width={W} height={H} className="neu-area__svg" aria-hidden="true" onMouseLeave={() => setAtivo(null)}>
        {ativo != null ? <rect x={padL + banda * ativo + 2} y={padT} width={banda - 4} height={ih} rx={10} className="neu-gbar__hover" /> : null}
        {tL.map((t, k) => {
          const yy = yL(t);
          return (
            <g key={"y" + k}>
              <line x1={padL} x2={W - padR} y1={yy} y2={yy} className="neu-area__grid" />
              <text x={padL - 10} y={yy} dy="0.32em" textAnchor="end" className="neu-area__ytick">
                {txt(fmtL, t)}
              </text>
              {tR ? (
                <text x={W - padR + 10} y={yy} dy="0.32em" textAnchor="start" className="neu-area__ytick neu-comp__ytick-r">
                  {txt(fmtR, tR[k])}
                </text>
              ) : null}
            </g>
          );
        })}
        {dados.map((d, i) => {
          const lbl = String(d[chaveX]);
          const mx = Math.max(3, Math.floor((banda - 4) / 6.4));
          const curto = lbl.length > mx ? lbl.slice(0, mx - 1) + "…" : lbl;
          return (
            <text key={"x" + i} x={cxEm(i)} y={H - 10} textAnchor="middle" className="neu-area__xtick">
              {curto !== lbl ? <title>{lbl}</title> : null}
              {curto}
            </text>
          );
        })}
        {camadas.area}
        {camadas.barra}
        <line x1={padL} x2={W - padR} y1={zero} y2={zero} className="neu-gbar__base" />
        {camadas.linha}
        {dados.map((_, i) => (
          <rect key={"h" + i} x={padL + banda * i} y={padT} width={banda} height={ih} fill="transparent" onMouseEnter={() => setAtivo(i)} />
        ))}
      </svg>
      {tipX != null && ativo != null && visiveis.length ? (
        <div className={juntar("neu-area__tip", esquerda && "neu-area__tip--left")} style={{ left: tipX + (esquerda ? -banda / 2 + 4 : banda / 2 - 4), top: padT + 8 }} aria-hidden="true">
          <span className="neu-area__tip-label">{String(dados[ativo][chaveX])}</span>
          {visiveis.map((s) => (
            <span key={s.chave} className={`neu-area__tip-row neu-area__s--${CLASSE_TOM[s.tom]}`}>
              <i className={`neu-area__tip-dot neu-comp__dot--${s.tipo}`} />
              {s.nome + ": "}
              <b>{fmtDe(s)(dados[ativo][s.chave])}</b>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const resumo = `${titulo ?? "Gráfico composto"}. ${visiveis.map((s) => `${s.nome} (${NOME_TIPO[s.tipo]}${s.eixo === "direito" ? ", eixo direito" : ""}): ${dados.map((d) => `${d[chaveX]} ${fmtDe(s)(d[s.chave])}`).join("; ")}`).join(". ")}.`;
  const anuncio = ativo != null && dados[ativo] ? `${dados[ativo][chaveX]}: ${visiveis.map((s) => `${s.nome} ${fmtDe(s)(dados[ativo][s.chave])}`).join(", ")}` : "";
  const legenda =
    props.legenda !== false ? (
      <div className="neu-area__legend" role="group" aria-label="Séries">
        {series.map((s) => {
          const off = !!ocultas[s.chave];
          return (
            <button
              key={s.chave}
              type="button"
              className={juntar("neu-area__key", `neu-area__s--${CLASSE_TOM[s.tom]}`, off && "neu-area__key--off")}
              aria-pressed={!off}
              title={off ? `Mostrar ${s.nome}` : `Ocultar ${s.nome}`}
              onClick={() => {
                const nh = { ...ocultas };
                if (off) delete nh[s.chave];
                else if (visiveis.length > 1) nh[s.chave] = true;
                setOcultas(nh);
              }}
            >
              <i className={juntar("neu-area__key-dot", `neu-comp__key--${s.tipo}`, s.tracejada && "neu-area__key-dot--dashed")} />
              {s.nome}
              {s.eixo === "direito" && tR ? (
                <span className="neu-comp__axis-tag" title="Eixo direito">
                  →
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    ) : null;

  const corpo = (
    <div className="neu-area__body">
      <div className="neu-area__focus" tabIndex={0} role="group" aria-label={`${resumo} Use as setas para percorrer as categorias.`} onKeyDown={teclas} onBlur={() => setAtivo(null)}>
        {grafico}
        <div className="sr-only" aria-live="polite">
          {anuncio}
        </div>
      </div>
      {legenda}
    </div>
  );
  if (props.moldura === false) return corpo;
  return (
    <section className={juntar("neu-area", "neu-comp", className)}>
      {titulo || subtitulo || emblema ? (
        <div className="neu-area__head">
          <div>
            {titulo ? <h4 className="neu-area__title">{titulo}</h4> : null}
            {subtitulo ? <p className="neu-area__sub">{subtitulo}</p> : null}
          </div>
          {emblema ? <span className={`neu-statx__chip neu-statx__chip--${CLASSE_EMBLEMA[emblema.tom ?? "marca"]}`}>{emblema.rotulo}</span> : null}
        </div>
      ) : null}
      {corpo}
    </section>
  );
}

const FUNIL: LinhaDados[] = [
  { name: "Jan", area: 820, bar: 540, line: 310 },
  { name: "Fev", area: 940, bar: 610, line: 380 },
  { name: "Mar", area: 880, bar: 590, line: 420 },
  { name: "Abr", area: 1020, bar: 700, line: 455 },
  { name: "Mai", area: 1150, bar: 760, line: 520 },
  { name: "Jun", area: 1080, bar: 820, line: 600 },
];

const FINANCEIRO: LinhaDados[] = [
  { name: "T1/25", receita: 1.8, margem: 18.4 },
  { name: "T2/25", receita: 2.1, margem: 21.0 },
  { name: "T3/25", receita: 1.9, margem: 16.2 },
  { name: "T4/25", receita: 2.6, margem: 24.5 },
  { name: "T1/26", receita: 2.4, margem: 22.1 },
  { name: "T2/26", receita: 2.9, margem: 26.8 },
];

/** Os dois gráficos do pacote: área, barras e linha num eixo só, e barras em R$ com uma linha de margem no eixo da direita */
export default function NeumorfismoComposto() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoComposto
        titulo="Funil de atendimento"
        subtitulo="Área, barras e linha · 1º semestre de 2026"
        emblema={{ rotulo: "Mensal" }}
        dados={FUNIL}
        altura={300}
        formatarValor={(n) => Number(n).toLocaleString("pt-BR")}
        series={[
          { chave: "area", nome: "Visitas ao portal", tipo: "area" },
          { chave: "bar", nome: "Atendimentos", tipo: "barra" },
          { chave: "line", nome: "Conversões", tipo: "linha" },
        ]}
      />
      <GraficoComposto
        titulo="Receita e margem"
        subtitulo="Dois eixos · barras em R$ milhões, linha em %"
        dados={FINANCEIRO}
        altura={240}
        formatarValor={(n) => `R$ ${String(n).replace(".", ",")}M`}
        formatarDireito={(n) => `${String(n).replace(".", ",")}%`}
        series={[
          { chave: "receita", nome: "Receita", tipo: "barra", tom: "azul" },
          { chave: "margem", nome: "Margem", tipo: "linha", tom: "marca", eixo: "direito" },
        ]}
      />
    </div>
  );
}
