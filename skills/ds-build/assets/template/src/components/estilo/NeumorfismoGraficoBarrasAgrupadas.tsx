import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { CLASSE_EMBLEMA, CLASSE_TOM, TONS, ticksBonitos, type LinhaDados, type TomEmblemaArea, type TomSerie } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do GroupedBarChart no estilo Neumorfismo (componente GroupedBarChart do pacote Neumorphic UI v3.2.0): um gráfico
 * de barras com uma ou mais séries lado a lado por categoria (ou empilhadas), em SVG, sem biblioteca de gráficos. Usa a casca
 * do GraficoArea: leito afundado dentro de um painel convexo, grade tracejada, valores do eixo Y em mono, balão convexo,
 * teclado e legenda que liga e desliga. Cada barra é um degradê na cor da série (cheia no alto, 72% na base) com um brilho
 * suave por baixo, arredondada em 6px na ponta livre e reta na base. As barras sobem de uma linha de base sólida no zero e
 * os valores negativos pendem abaixo dela. As cores seguem a paleta de dados: marca, azul (a secundária), sucesso, atenção
 * e neutro. Ao passar o mouse ou andar por uma categoria, uma faixa suave sobe atrás dela, as barras brilham mais e as
 * outras colunas esmaecem a 55%. O balão mostra a categoria e "Série: valor" de cada série visível; `mostrarDiferenca` põe uma
 * linha com a diferença com sinal entre duas séries ("Saldo: +R$ 1.100", em verde), e nos empilhados vem uma linha de
 * **Total**. Apagar uma série na legenda tira as barras dela, as que ficam se alargam e o eixo reescala. `empilhado`: uma
 * barra por categoria com os segmentos na ordem de `series` (só o de cima é arredondado); `"percentual"` normaliza cada coluna
 * a 100%. Outras opções: `fendas` (um vão afundado atrás de cada barra), `rotulosDados` (pílula ou texto com o valor acima
 * das barras) e `destaque="max"`, `rotulosInternos` (a fatia ou o valor dentro de cada segmento), `pilha` por série (colunas
 * agrupadas e empilhadas), `rotuloY` (título do eixo Y), `raio`, `larguraGrupo` e `larguraMaxBarra`. O gráfico é um grupo
 * focável cujo nome lê todas as séries; ← → Home End andam pelas categorias, e uma região educada anuncia cada uma. Entra no
 * cartão "Gráfico de Barras" do DS (no neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos neu-area* e
 * neu-gbar* vêm de src/styles/estilo.css.
 */

export interface SerieBarras {
  chave: string;
  nome?: string;
  tom?: TomSerie;
  /** Identificador da pilha, para colunas agrupadas e empilhadas */
  pilha?: string;
  opacidade?: number;
}

export interface GraficoBarrasAgrupadasProps {
  dados: LinhaDados[];
  chaveX?: string;
  chaveY?: string;
  series?: SerieBarras[];
  nomeSerie?: string;
  titulo?: string;
  subtitulo?: string;
  emblema?: { rotulo: string; tom?: TomEmblemaArea };
  rotuloX?: string;
  rotuloY?: string;
  altura?: number;
  formatarValor?: (v: number | string) => string;
  ticks?: number;
  valoresTicks?: number[];
  legenda?: boolean;
  moldura?: boolean;
  empilhado?: boolean | "percentual";
  rotulosPilha?: Record<string, string>;
  fendas?: boolean;
  rotulosDados?: boolean | "pilula" | "texto";
  formatarRotulo?: (v: number | string) => string;
  destaque?: "max";
  rotulosInternos?: boolean;
  formatarInterno?: (fatia: number, valor: number | string) => string;
  mostrarBruto?: boolean;
  mostrarDiferenca?: boolean;
  rotuloDiferenca?: string;
  raio?: number;
  larguraGrupo?: number;
  larguraMaxBarra?: number;
  className?: string;
}

const juntar = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");
const virgula = (v: number | string) => String(v).replace(".", ",");
const num = (v: string | number | undefined) => Number(v) || 0;

/** Retângulo com a ponta livre arredondada: para cima, ou para baixo nos valores negativos */
export function retanguloArredondado(x: number, y: number, w: number, h: number, r: number, baixo: boolean): string {
  if (h <= 0 || w <= 0) return "";
  r = Math.min(r, w / 2, h);
  if (baixo) {
    const b = y + h;
    return `M${x},${y}H${x + w}V${b - r}Q${x + w},${b} ${x + w - r},${b}H${x + r}Q${x},${b} ${x},${b - r}Z`;
  }
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

export function GraficoBarrasAgrupadas(props: GraficoBarrasAgrupadasProps) {
  const { dados, chaveX = "name", altura: H = 300, titulo, subtitulo, emblema, className } = props;
  const series = (props.series?.length ? props.series : [{ chave: props.chaveY ?? "valor", nome: props.nomeSerie ?? "Valor", tom: "marca" as TomSerie }]).map((s: SerieBarras, i) => ({
    chave: s.chave,
    nome: s.nome ?? s.chave,
    tom: s.tom ?? TONS[i % TONS.length],
    pilha: s.pilha,
    opacidade: s.opacidade,
  }));
  const multi = series.length > 1;
  const empilhado = !!props.empilhado;
  const fmt = props.formatarValor ?? virgula;

  const ref = useRef<HTMLDivElement>(null);
  const id = "neu-gbar" + useId().replace(/:/g, "");
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
  const totais = dados.map((d) => visiveis.reduce((a, s) => a + num(d[s.chave]), 0));
  const pct = props.empilhado === "percentual";
  const fatia = (d: LinhaDados, s: (typeof series)[number], i: number) => (totais[i] ? (num(d[s.chave]) / totais[i]) * 100 : 0);
  const textoPct = (v: number) => {
    const r = Math.round(v * 10) / 10;
    return String(r % 1 ? r.toFixed(1) : r).replace(".", ",") + "%";
  };
  const gs = !empilhado && series.some((s) => s.pilha != null);
  const idDe = (s: (typeof series)[number]) => (s.pilha != null ? String(s.pilha) : "_" + s.chave);
  const pilhas: string[] = [];
  if (gs)
    visiveis.forEach((s) => {
      const sid = idDe(s);
      if (pilhas.indexOf(sid) < 0) pilhas.push(sid);
    });
  const somaPilha = (d: LinhaDados, sid: string) => visiveis.reduce((a, s) => a + (idDe(s) === sid ? num(d[s.chave]) : 0), 0);
  let vals: number[] = pct ? [0, 100] : empilhado ? totais.slice() : [];
  if (gs) dados.forEach((d) => pilhas.forEach((sid) => vals.push(somaPilha(d, sid))));
  else if (!empilhado) visiveis.forEach((s) => dados.forEach((d) => vals.push(Number(d[s.chave]))));
  if (!vals.length) vals = [0, 1];
  const ticks = pct && !props.valoresTicks ? [0, 25, 50, 75, 100] : props.valoresTicks && props.valoresTicks.length > 1 ? props.valoresTicks.slice().sort((a, b) => a - b) : ticksBonitos(Math.min(0, ...vals), Math.max(0, ...vals), props.ticks ?? 5);
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const textoTick = pct ? (t: number) => `${t}%` : (t: number) => (t < 0 ? "−" + fmt(-t) : fmt(t));
  const padL = Math.max(44, 18 + Math.max(...ticks.map((t) => String(textoTick(t)).length)) * 6.8) + (props.rotuloY ? 22 : 0);
  const padR = 16;
  const padT = props.rotulosDados ? 40 : 16;
  const padB = 32;
  const iw = Math.max(10, W - padL - padR);
  const ih = H - padT - padB;
  const n = Math.max(1, dados.length);
  const banda = iw / n;
  const y = (v: number) => padT + ih - ((v - y0) / (y1 - y0)) * ih;
  const zeroY = y(Math.max(y0, Math.min(0, y1)));
  const k = Math.max(1, gs ? pilhas.length : visiveis.length);
  const vao = 6;
  const groupW = banda * (props.larguraGrupo ?? 0.62);
  const barW = empilhado ? Math.min(groupW, props.larguraMaxBarra ?? 44) : Math.max(4, Math.min((groupW - vao * (k - 1)) / k, props.larguraMaxBarra ?? 28));
  const gw = empilhado ? barW : barW * k + vao * (k - 1);
  const cxEm = (i: number) => padL + banda * i + banda / 2;

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

  const dl = props.rotulosDados === true ? "pilula" : props.rotulosDados || null;
  let chavePico: string | null = null;
  if (props.destaque === "max") {
    let pk = -Infinity;
    dados.forEach((d, i) => {
      visiveis.forEach((s) => {
        const v = empilhado ? totais[i] : Number(d[s.chave]);
        if (v > pk) {
          pk = v;
          chavePico = empilhado ? String(i) : `${i}-${s.chave}`;
        }
      });
    });
  }
  const fmtRotulo = props.formatarRotulo ?? fmt;
  const barras: ReactNode[] = [];
  const rotulos: ReactNode[] = [];
  dados.forEach((d, i) => {
    const esquerda = cxEm(i) - gw / 2;
    let corrida = 0;
    const corridas: Record<string, number> = {};
    visiveis.forEach((s, si) => {
      const v = pct ? fatia(d, s, i) : num(d[s.chave]);
      let topo: number;
      let base: number;
      const sid = gs ? idDe(s) : null;
      const gi = gs ? pilhas.indexOf(sid as string) : si;
      if (empilhado) {
        base = y(corrida);
        corrida += v;
        topo = y(corrida);
      } else if (gs) {
        const r0 = corridas[sid as string] || 0;
        base = y(r0);
        corridas[sid as string] = r0 + v;
        topo = y(corridas[sid as string]);
      } else {
        topo = y(Math.max(v, 0));
        base = y(Math.min(v, 0));
      }
      const bx = empilhado ? esquerda : esquerda + gi * (barW + vao);
      const ultimo = gs ? !visiveis.slice(si + 1).some((o) => idDe(o) === sid) : !empilhado || si === visiveis.length - 1;
      if (props.fendas && !empilhado && (!gs || !corridas[sid as string] || corridas[sid as string] === v)) barras.push(<rect key={`s${i}-${s.chave}`} x={bx} y={padT + 4} width={barW} height={Math.max(0, zeroY - padT - 4)} rx={Math.min(6, barW / 2)} className="neu-gbar__slot" />);
      const caminho = (empilhado || gs) && !ultimo ? `M${bx},${topo}H${bx + barW}V${base}H${bx}Z` : retanguloArredondado(bx, topo, barW, base - topo, props.raio ?? 6, v < 0 && !empilhado);
      const pico = chavePico != null && (empilhado ? chavePico === String(i) : chavePico === `${i}-${s.chave}`);
      barras.push(
        <path
          key={`${i}-${s.chave}`}
          d={caminho}
          fill={`url(#${id}-${s.chave})`}
          fillOpacity={s.opacidade}
          className={juntar("neu-gbar__bar", `neu-area__s--${CLASSE_TOM[s.tom]}`, (empilhado || gs) && "neu-gbar__bar--seg", pico && "neu-gbar__bar--peak", ativo === i && "neu-gbar__bar--on", ativo != null && ativo !== i && "neu-gbar__bar--dim")}
        />,
      );
      if (props.rotulosInternos && empilhado && base - topo >= 18 && barW >= 28) {
        const it = props.formatarInterno ? props.formatarInterno(v, d[s.chave]) : pct ? textoPct(v) : fmt(d[s.chave]);
        const iw2 = String(it).length * 6 + 10;
        const my = (topo + base) / 2;
        const lx0 = bx + barW / 2;
        rotulos.push(
          <g key={`in${i}-${s.chave}`} className={juntar("neu-gbar__in", ativo != null && ativo !== i && "neu-gbar__dl--dim")}>
            {iw2 + 4 <= barW ? <rect x={lx0 - iw2 / 2} y={my - 8} width={iw2} height={16} rx={8} className="neu-gbar__in-pill" /> : null}
            <text x={lx0} y={my} dy="0.35em" textAnchor="middle" className={juntar("neu-gbar__in-text", iw2 + 4 > barW && "neu-gbar__in-text--bare")}>
              {it}
            </text>
          </g>,
        );
      }
      if (dl && (!empilhado || ultimo) && !pct) {
        const lv = empilhado ? totais[i] : v;
        const txt = fmtRotulo(lv);
        const neg = lv < 0 && !empilhado;
        const lx = bx + barW / 2;
        const ly = neg ? base + 8 : topo - 8;
        const tw = String(txt).length * 6.6 + 14;
        const usaPilula = dl === "pilula" && tw <= Math.max(barW + vao + 10, banda / Math.max(1, empilhado ? 1 : k) + 4);
        rotulos.push(
          <g key={`dl${i}-${s.chave}`} className={juntar("neu-gbar__dl", `neu-area__s--${CLASSE_TOM[s.tom]}`, pico && "neu-gbar__dl--peak", ativo != null && ativo !== i && "neu-gbar__dl--dim", ativo === i && "neu-gbar__dl--on")}>
            {usaPilula ? <rect x={lx - tw / 2} y={neg ? ly : ly - 20} width={tw} height={20} rx={10} className="neu-gbar__dl-pill" /> : null}
            {usaPilula && pico ? <circle cx={lx - tw / 2 + 8} cy={neg ? ly + 10 : ly - 10} r={2.5} className="neu-gbar__dl-led" /> : null}
            <text x={lx + (usaPilula && pico ? 3 : 0)} y={neg ? ly + 10 : usaPilula ? ly - 10 : ly - 2} dy={usaPilula ? "0.35em" : 0} textAnchor="middle" className="neu-gbar__dl-text">
              {txt}
            </text>
          </g>,
        );
      }
    });
  });

  const tipX = ativo != null ? cxEm(ativo) : null;
  const direita = tipX != null && tipX > W * 0.6;

  const grafico = (
    <div className="neu-area__plot" ref={ref} style={{ height: H }}>
      <svg width={W} height={H} className="neu-area__svg" aria-hidden="true" onMouseLeave={() => setAtivo(null)}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.chave} id={`${id}-${s.chave}`} x1={0} y1={0} x2={0} y2={1} className={`neu-area__s--${CLASSE_TOM[s.tom]}`}>
              <stop offset="0%" className="neu-area__stop" stopOpacity={1} />
              <stop offset="100%" className="neu-area__stop" stopOpacity={0.72} />
            </linearGradient>
          ))}
        </defs>
        {ativo != null ? <rect x={padL + banda * ativo + 2} y={padT} width={banda - 4} height={ih} rx={10} className="neu-gbar__hover" /> : null}
        {props.rotuloY ? (
          <text x={0} y={0} transform={`translate(16,${padT + ih / 2}) rotate(-90)`} textAnchor="middle" className="neu-gbar__ylabel">
            {props.rotuloY}
          </text>
        ) : null}
        {ticks.map((t) => {
          const yy = y(t);
          return (
            <g key={"y" + t}>
              <line x1={padL} x2={W - padR} y1={yy} y2={yy} className="neu-area__grid" />
              <text x={padL - 10} y={yy} dy="0.32em" textAnchor="end" className="neu-area__ytick">
                {textoTick(t)}
              </text>
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
        {barras}
        {rotulos}
        <line x1={padL} x2={W - padR} y1={zeroY} y2={zeroY} className="neu-gbar__base" />
        {dados.map((_, i) => (
          <rect key={"h" + i} x={padL + banda * i} y={padT} width={banda} height={ih} fill="transparent" onMouseEnter={() => setAtivo(i)} />
        ))}
      </svg>
      {tipX != null && ativo != null && visiveis.length ? (
        <div className={juntar("neu-area__tip", direita && "neu-area__tip--left")} style={{ left: tipX + (direita ? -gw / 2 - 4 : gw / 2 + 4), top: padT + 8 }} aria-hidden="true">
          <span className="neu-area__tip-label">{String(dados[ativo][chaveX])}</span>
          {gs
            ? pilhas.map((sid) => {
                const mem = visiveis.filter((o) => idDe(o) === sid);
                return (
                  <Fragment key={sid}>
                    {mem
                      .slice()
                      .reverse()
                      .map((s) => (
                        <span key={s.chave} className={`neu-area__tip-row neu-area__s--${CLASSE_TOM[s.tom]}`}>
                          <i className="neu-area__tip-dot" style={{ opacity: s.opacidade }} />
                          {s.nome + ": "}
                          <b>{fmt(dados[ativo][s.chave])}</b>
                        </span>
                      ))}
                    {mem.length > 1 ? (
                      <span className="neu-area__tip-row neu-gbar__tip-sub">
                        {(props.rotulosPilha?.[sid] ?? "Subtotal") + ": "}
                        <b>{fmt(somaPilha(dados[ativo], sid))}</b>
                      </span>
                    ) : null}
                  </Fragment>
                );
              })
            : (empilhado ? visiveis.slice().reverse() : visiveis).map((s) => (
                <span key={s.chave} className={`neu-area__tip-row neu-area__s--${CLASSE_TOM[s.tom]}`}>
                  <i className="neu-area__tip-dot" />
                  {s.nome + ": "}
                  <b>{pct ? textoPct(fatia(dados[ativo], s, ativo)) : fmt(dados[ativo][s.chave])}</b>
                  {pct && props.mostrarBruto ? <small className="neu-area__tip-share">{" " + fmt(dados[ativo][s.chave])}</small> : null}
                </span>
              ))}
          {empilhado && !pct && visiveis.length > 1 ? (
            <span className="neu-area__tip-row neu-area__tip-total">
              {"Total: "}
              <b>{fmt(totais[ativo])}</b>
            </span>
          ) : null}
          {props.mostrarDiferenca && visiveis.length === 2 && !empilhado
            ? (() => {
                const dv = num(dados[ativo][visiveis[0].chave]) - num(dados[ativo][visiveis[1].chave]);
                return (
                  <span className="neu-area__tip-row neu-area__tip-total">
                    {(props.rotuloDiferenca ?? "Diferença") + ": "}
                    <b className={dv < 0 ? "neu-tone-danger" : dv > 0 ? "neu-tone-success" : undefined}>{(dv > 0 ? "+" : dv < 0 ? "−" : "") + fmt(Math.abs(dv))}</b>
                  </span>
                );
              })()
            : null}
        </div>
      ) : null}
    </div>
  );

  const resumo = `${titulo ?? "Gráfico de barras"}. ${visiveis.map((s) => `${s.nome} por ${props.rotuloX ?? "categoria"}: ${dados.map((d) => `${d[chaveX]} ${fmt(d[s.chave])}`).join("; ")}`).join(". ")}.`;
  const anuncio = ativo != null && dados[ativo] ? `${dados[ativo][chaveX]}: ${visiveis.map((s) => `${s.nome} ${fmt(dados[ativo][s.chave])}`).join(", ")}` : "";
  const legenda =
    multi && props.legenda !== false ? (
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
              <i className="neu-area__key-dot neu-gbar__key-dot" style={s.opacidade != null && !off ? { opacity: s.opacidade } : undefined} />
              {s.nome}
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
    <section className={juntar("neu-area", "neu-gbar", className)}>
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

const FINANCAS: LinhaDados[] = [
  { name: "Jan", receita: 4200, despesa: 3100 },
  { name: "Fev", receita: 3800, despesa: 2900 },
  { name: "Mar", receita: 5100, despesa: 3600 },
  { name: "Abr", receita: 4600, despesa: 4100 },
  { name: "Mai", receita: 5800, despesa: 3900 },
  { name: "Jun", receita: 6200, despesa: 4400 },
];
const CANAIS: LinhaDados[] = [
  { name: "Seg", presencial: 42, online: 30, telefone: 12 },
  { name: "Ter", presencial: 48, online: 36, telefone: 10 },
  { name: "Qua", presencial: 51, online: 40, telefone: 15 },
  { name: "Qui", presencial: 46, online: 44, telefone: 11 },
  { name: "Sex", presencial: 38, online: 52, telefone: 9 },
];
const reais = (n: number | string) => "R$ " + Number(n).toLocaleString("pt-BR");

/** Os dois gráficos do pacote: receita e despesa lado a lado (com o saldo no balão) e atendimentos por canal empilhados */
export default function NeumorfismoBarrasAgrupadas() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoBarrasAgrupadas
        titulo="Receita e despesa"
        subtitulo="1º semestre de 2026"
        emblema={{ rotulo: "Mensal" }}
        rotuloX="mês"
        dados={FINANCAS}
        altura={300}
        formatarValor={reais}
        mostrarDiferenca
        rotuloDiferenca="Saldo"
        series={[
          { chave: "receita", nome: "Receita" },
          { chave: "despesa", nome: "Despesa" },
        ]}
      />
      <GraficoBarrasAgrupadas
        empilhado
        titulo="Atendimentos por canal"
        subtitulo="Empilhado · semana atual"
        rotuloX="dia"
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
