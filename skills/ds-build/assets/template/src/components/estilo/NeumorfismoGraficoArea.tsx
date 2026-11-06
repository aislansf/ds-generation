import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

/**
 * Vitrine do AreaChart no estilo Neumorfismo (componente AreaChart do pacote Neumorphic UI v3.2.0): um gráfico de área
 * desenhado em SVG, sem biblioteca de gráficos. Uma ou mais séries sobre um leito afundado de plotagem, dentro de um
 * painel convexo de cantos largos. A grade é tracejada, com os valores do eixo Y em mono (arredondados para números
 * "bonitos") e os rótulos do eixo X em seminegrito. A série é uma curva monótona (que nunca passa do dado) de 2,5px,
 * com um brilho suave, sobre um preenchimento que some para baixo; cada ponto é um anel pequeno. Ao passar o mouse por
 * uma coluna (ou ao focar o gráfico e usar ← → Home End), o ponto vira um LED aceso, uma guia tracejada aparece e um
 * balão convexo mostra o rótulo e "Série: valor" em mono (à esquerda da guia nos 40% finais, para não cobrir os
 * pontos); Esc limpa. O mesmo motor serve às variações: várias séries com legenda que liga e desliga cada uma,
 * empilhada (também em porcentagem), com valores que cruzam o zero (zonas positiva e negativa, linha do zero, cor pelo
 * sinal) e só linhas. O gráfico é um grupo focável cujo nome lê a série inteira, e uma região educada anuncia cada
 * ponto. Entra no cartão "Gráfico de Área Básico" do DS (no neumorfismo) e só é usado quando ESTILO.id ===
 * "neumorfismo". As classes neu-area* vêm de src/styles/estilo.css.
 */

export type TomSerie = "marca" | "azul" | "sucesso" | "atencao" | "neutro" | "perigo";
export type TomEmblemaArea = "marca" | "sucesso" | "azul" | "neutro";

export const TONS: TomSerie[] = ["marca", "azul", "sucesso", "atencao", "neutro", "perigo"];
// as classes seguem o pacote (accent, royal, success, warning, neutral, danger)
export const CLASSE_TOM: Record<TomSerie, string> = { marca: "accent", azul: "royal", sucesso: "success", atencao: "warning", neutro: "neutral", perigo: "danger" };
export const CLASSE_EMBLEMA: Record<TomEmblemaArea, string> = { marca: "accent", sucesso: "success", azul: "royal", neutro: "neutral" };

export type LinhaDados = Record<string, string | number>;

export interface SerieArea {
  chave: string;
  nome?: string;
  tom?: TomSerie;
  tracejada?: boolean;
}

export interface GraficoAreaProps {
  dados: LinhaDados[];
  /** Campo do eixo X (padrão "name") */
  chaveX?: string;
  /** Campo do valor, numa série só (padrão "valor") */
  chaveY?: string;
  /** Várias séries; sem isso, vale `chaveY` */
  series?: SerieArea[];
  titulo?: string;
  subtitulo?: string;
  emblema?: { rotulo: string; tom?: TomEmblemaArea };
  /** Nome da série única, no balão e no resumo falado */
  nomeSerie?: string;
  /** Nome do eixo X no resumo falado ("por horário") */
  rotuloX?: string;
  /** Altura do leito, em px (padrão 300); a largura segue o contêiner */
  altura?: number;
  /** Piso do eixo Y; padrão: 0 ou o menor dado */
  minimo?: number;
  /** Quantos valores no eixo Y, aproximadamente (padrão 5) */
  ticks?: number;
  valoresTicks?: number[];
  /** O piso é o menor dado, não o zero */
  semZero?: boolean;
  curva?: "monotona" | "linear";
  formatarValor?: (v: number | string) => string;
  formatarX?: (linha: LinhaDados, i: number) => string;
  rotuloTooltip?: (linha: LinhaDados, i: number) => string;
  /** Quantos rótulos no eixo X, no máximo, distribuídos por igual */
  maxTicksX?: number;
  indicesTicksX?: number[];
  /** Mostrar os anéis dos pontos (padrão: até 31 pontos) */
  pontos?: boolean;
  /** Série única na secundária ("institucional") */
  tom?: "marca" | "azul";
  /** Sem o painel: só o leito */
  moldura?: boolean;
  empilhado?: boolean | "percentual";
  /** Mostra os valores com + e − */
  comSinal?: boolean;
  zonas?: boolean;
  rotulosZonas?: [string, string];
  /** Colore o trecho acima do zero de verde e o abaixo, de vermelho (série única) */
  coresPorSinal?: boolean;
  /** Só linhas, sem preenchimento */
  linhas?: boolean;
  /** Legenda que liga e desliga as séries (várias séries; padrão ligada) */
  legenda?: boolean;
  /** Substitui o resumo falado */
  resumo?: string;
  className?: string;
}

export function ticksBonitos(min: number, max: number, count: number): number[] {
  if (min === max) max = min + 1;
  const span = max - min;
  const bruto = span / Math.max(1, count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(bruto)));
  const n = bruto / mag;
  const passo = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(min / passo) * passo;
  const hi = Math.ceil(max / passo) * passo;
  const saida: number[] = [];
  for (let v = lo; v <= hi + passo / 2; v += passo) saida.push(Math.round(v * 1e6) / 1e6);
  return saida;
}

// curva monótona (Fritsch–Carlson): suave e sem passar do dado
export function caminhoMonotono(pts: [number, number][]): string {
  const n = pts.length;
  if (!n) return "";
  if (n < 3) return pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join("");
  const dx: number[] = [];
  const m: number[] = [];
  const t: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h3 = dx[i] / 3;
    d += `C${pts[i][0] + h3},${pts[i][1] + h3 * t[i]} ${pts[i + 1][0] - h3},${pts[i + 1][1] - h3 * t[i + 1]} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

const virgula = (v: number | string) => String(v).replace(".", ",");
const juntar = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

export function GraficoArea(props: GraficoAreaProps) {
  const { dados, chaveX = "name", altura: H = 300, titulo, subtitulo, emblema, className } = props;
  const series = (props.series?.length ? props.series : [{ chave: props.chaveY ?? "valor", nome: props.nomeSerie ?? "Valor", tom: props.tom === "azul" ? ("azul" as TomSerie) : ("marca" as TomSerie) }]).map((s, i) => ({
    chave: s.chave,
    nome: s.nome ?? s.chave,
    tom: s.tom ?? TONS[i % TONS.length],
    tracejada: !!s.tracejada,
  }));
  const multi = series.length > 1;
  const fmtX = props.formatarX ?? ((d: LinhaDados) => String(d[chaveX]));
  const fmtTip = props.rotuloTooltip ?? fmtX;
  const mostrarPontos = props.pontos ?? dados.length <= 31;
  const fmt = props.formatarValor ?? virgula;
  const fmtSinal = props.comSinal
    ? (v: number | string) => {
        const n = Number(v);
        return (n > 0 ? "+" : n < 0 ? "−" : "") + fmt(Math.abs(n));
      }
    : fmt;

  const idxTick: Record<number, boolean> = {};
  {
    const n = dados.length;
    const m = props.maxTicksX ?? n;
    if (props.indicesTicksX) props.indicesTicksX.forEach((k) => (idxTick[k] = true));
    else if (n <= m) for (let k = 0; k < n; k++) idxTick[k] = true;
    else for (let j = 0; j < m; j++) idxTick[Math.round((j * (n - 1)) / (m - 1))] = true;
  }

  const ref = useRef<HTMLDivElement>(null);
  const id = "neu-area" + useId().replace(/:/g, "");
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
  const empilha = props.empilhado ? (props.empilhado === "percentual" ? "percent" : "normal") : null;
  const totais = dados.map((d) => visiveis.reduce((a, s) => a + (Number(d[s.chave]) || 0), 0));
  const acum: Record<string, [number, number][]> = {};
  if (empilha) {
    const corrida = dados.map(() => 0);
    visiveis.forEach((s) => {
      acum[s.chave] = dados.map((d, i) => {
        let v = Number(d[s.chave]) || 0;
        if (empilha === "percent") v = totais[i] ? (v / totais[i]) * 100 : 0;
        const lo = corrida[i];
        corrida[i] += v;
        return [lo, corrida[i]];
      });
    });
  }
  let vals: number[] = [];
  if (empilha) vals = empilha === "percent" ? [0, 100] : totais.slice();
  else visiveis.forEach((s) => dados.forEach((d) => vals.push(Number(d[s.chave]))));
  if (!vals.length) vals = [0, 1];
  const ticks =
    empilha === "percent" && !props.valoresTicks
      ? [0, 25, 50, 75, 100]
      : props.valoresTicks && props.valoresTicks.length > 1
        ? props.valoresTicks.slice().sort((a, b) => a - b)
        : ticksBonitos(props.minimo != null ? props.minimo : props.semZero ? Math.min(...vals) : Math.min(0, ...vals), Math.max(0, ...vals), props.ticks ?? 5);
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const textoTick = empilha === "percent" ? (t: number) => `${t}%` : (t: number) => (t < 0 ? "−" + fmt(-t) : fmt(t));
  const padL = Math.max(44, 18 + Math.max(...ticks.map((t) => String(textoTick(t)).length)) * 6.8);
  const padR = 24;
  const padT = 16;
  const padB = 32;
  const iw = Math.max(10, W - padL - padR);
  const ih = H - padT - padB;
  const x = (i: number) => padL + (dados.length > 1 ? (i * iw) / (dados.length - 1) : iw / 2);
  const y = (v: number) => padT + ih - ((v - y0) / (y1 - y0)) * ih;
  const base = y(Math.max(y0, 0));
  const temNeg = y0 < 0 && y1 > 0;
  const zeroY = y(0);
  const tomPorSinal = !!props.coresPorSinal && !multi;

  const geo = series.map((s) => {
    const cs = empilha ? acum[s.chave] : undefined;
    const pts: [number, number][] = dados.map((d, i) => [+x(i).toFixed(2), +y(cs ? cs[i][1] : Number(d[s.chave])).toFixed(2)]);
    const mk = (q: [number, number][]) => (props.curva === "linear" ? q.map((r, i) => `${i ? "L" : "M"}${r[0]},${r[1]}`).join("") : caminhoMonotono(q));
    const linha = mk(pts);
    let area = "";
    if (cs) {
      const low = dados.map((_, i): [number, number] => [+x(i).toFixed(2), +y(cs[i][0]).toFixed(2)]).reverse();
      area = pts.length ? `${linha}L${mk(low).slice(1)}Z` : "";
    } else area = pts.length ? `${linha}L${pts[pts.length - 1][0]},${base}L${pts[0][0]},${base}Z` : "";
    return { s, pts, linha, area };
  });
  const geoVisivel = geo.filter((g) => !ocultas[g.s.chave]);

  function teclas(e: KeyboardEvent) {
    const n = dados.length;
    if (!n) return;
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

  const tipX = ativo != null && dados[ativo] ? x(ativo) : null;

  function camada(g: (typeof geo)[number], gi: number, tom: TomSerie, clip: string | null, sfx: string) {
    const gid = `${id}-${gi}${sfx}`;
    const zo = Math.max(0, Math.min(1, (zeroY - padT) / ih));
    const topo = temNeg ? 0.34 : multi ? 0.22 : 0.32;
    return (
      <g key={g.s.chave + sfx} className={`neu-area__s neu-area__s--${CLASSE_TOM[tom]}`} clipPath={clip ? `url(#${id}${clip})` : undefined}>
        <defs>
          {temNeg ? (
            <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={0} y1={padT} x2={0} y2={padT + ih}>
              <stop offset={0} className="neu-area__stop" stopOpacity={topo} />
              <stop offset={zo} className="neu-area__stop" stopOpacity={0.1} />
              <stop offset={1} className="neu-area__stop" stopOpacity={topo} />
            </linearGradient>
          ) : (
            <linearGradient id={gid} x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" className="neu-area__stop" stopOpacity={empilha ? 0.62 : topo} />
              <stop offset="100%" className="neu-area__stop" stopOpacity={empilha ? 0.38 : 0.02} />
            </linearGradient>
          )}
        </defs>
        {props.linhas ? null : <path d={g.area} fill={`url(#${gid})`} />}
        {props.linhas ? <path d={g.linha} className="neu-area__line-track" /> : null}
        <path d={g.linha} className={juntar("neu-area__line", props.linhas && "neu-area__line--solo", g.s.tracejada && "neu-area__line--dashed")} />
      </g>
    );
  }

  const grafico = (
    <div className="neu-area__plot" ref={ref} style={{ height: H }}>
      <svg width={W} height={H} className="neu-area__svg" aria-hidden="true" onMouseLeave={() => setAtivo(null)}>
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
        {dados.map((d, i) =>
          idxTick[i] ? (
            <g key={"x" + i}>
              <line x1={x(i)} x2={x(i)} y1={padT} y2={padT + ih} className="neu-area__grid neu-area__grid--v" />
              <text x={x(i)} y={H - 10} textAnchor={i === 0 && dados.length > 1 ? "start" : i === dados.length - 1 && dados.length > 1 ? "end" : "middle"} className="neu-area__xtick">
                {fmtX(d, i)}
              </text>
            </g>
          ) : null,
        )}
        {tipX != null ? <line x1={tipX} x2={tipX} y1={padT} y2={padT + ih} className="neu-area__guide" /> : null}
        {temNeg && props.zonas !== false ? (
          <g className="neu-area__zones">
            <rect x={padL} y={padT} width={iw} height={Math.max(0, zeroY - padT)} className="neu-area__zone neu-area__zone--pos" />
            <rect x={padL} y={zeroY} width={iw} height={Math.max(0, padT + ih - zeroY)} className="neu-area__zone neu-area__zone--neg" />
            <text x={padL + 8} y={padT + 14} className="neu-area__zone-label neu-area__zone-label--pos">
              {props.rotulosZonas?.[0] ?? "Positivo"}
            </text>
            <text x={padL + 8} y={padT + ih - 8} className="neu-area__zone-label neu-area__zone-label--neg">
              {props.rotulosZonas?.[1] ?? "Negativo"}
            </text>
          </g>
        ) : null}
        {temNeg ? (
          <defs>
            <clipPath id={id + "-up"}>
              <rect x={0} y={0} width={W} height={zeroY} />
            </clipPath>
            <clipPath id={id + "-dn"}>
              <rect x={0} y={zeroY} width={W} height={H} />
            </clipPath>
          </defs>
        ) : null}
        {geoVisivel.map((g, gi) => {
          const bolinhas = g.pts.map((q, i) => {
            if (!mostrarPontos && i !== ativo) return null;
            const v = Number(dados[i][g.s.chave]);
            return <circle key={i} cx={q[0]} cy={q[1]} r={i === ativo ? 6.5 : props.linhas ? 4 : 3.5} className={juntar("neu-area__dot", i === ativo && "neu-area__dot--on", tomPorSinal && `neu-area__s--${v < 0 ? "danger" : "success"}`)} />;
          });
          if (tomPorSinal && temNeg)
            return (
              <g key={g.s.chave}>
                {camada(g, gi, "sucesso", "-up", "u")}
                {camada(g, gi, "perigo", "-dn", "d")}
                <g className={`neu-area__s neu-area__s--${CLASSE_TOM[g.s.tom]}`}>{bolinhas}</g>
              </g>
            );
          return (
            <g key={g.s.chave}>
              {camada(g, gi, g.s.tom, null, "")}
              <g className={`neu-area__s neu-area__s--${CLASSE_TOM[g.s.tom]}`}>{bolinhas}</g>
            </g>
          );
        })}
        {temNeg ? (
          <g className="neu-area__zero">
            <line x1={padL} x2={W - padR} y1={zeroY} y2={zeroY} className="neu-area__zero-shade" />
            <line x1={padL} x2={W - padR} y1={zeroY + 1} y2={zeroY + 1} className="neu-area__zero-light" />
          </g>
        ) : null}
        {dados.map((_, i) => {
          const w = dados.length > 1 ? iw / (dados.length - 1) : iw;
          return <rect key={"h" + i} x={x(i) - w / 2} y={padT} width={w} height={ih} fill="transparent" onMouseEnter={() => setAtivo(i)} />;
        })}
      </svg>
      {tipX != null && geoVisivel.length && ativo != null ? (
        <div className={juntar("neu-area__tip", tipX > W * 0.6 && "neu-area__tip--left")} style={{ left: tipX, top: padT + 8 }} aria-hidden="true">
          <span className="neu-area__tip-label">{fmtTip(dados[ativo], ativo)}</span>
          {(empilha ? geoVisivel.slice().reverse() : geoVisivel).map((g) => {
            const tv = Number(dados[ativo][g.s.chave]);
            return (
              <span key={g.s.chave} className={`neu-area__tip-row neu-area__s--${tomPorSinal ? (tv < 0 ? "danger" : "success") : CLASSE_TOM[g.s.tom]}`}>
                <i className="neu-area__tip-dot" />
                {g.s.nome + ": "}
                <b className={props.comSinal ? (tv < 0 ? "neu-tone-danger" : tv > 0 ? "neu-tone-success" : undefined) : undefined}>
                  {fmtSinal(dados[ativo][g.s.chave])}
                  {empilha === "percent" && totais[ativo] ? <small className="neu-area__tip-share">{" " + (tv / totais[ativo] * 100).toFixed(1).replace(".", ",") + "%"}</small> : null}
                </b>
              </span>
            );
          })}
          {empilha ? (
            <span className="neu-area__tip-row neu-area__tip-total">
              {"Total: "}
              <b>{fmtSinal(totais[ativo])}</b>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const resumo =
    props.resumo ??
    `${titulo ?? "Gráfico de área"}. ${visiveis.map((s) => `${s.nome} por ${props.rotuloX ?? "período"}: ${dados.map((d, i) => `${fmtTip(d, i)} ${fmtSinal(d[s.chave])}`).join("; ")}`).join(". ")}.`;
  const anuncio = ativo != null && dados[ativo] ? `${fmtTip(dados[ativo], ativo)}: ${visiveis.map((s) => `${s.nome} ${fmtSinal(dados[ativo][s.chave])}`).join(", ")}` : "";

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
                const n = { ...ocultas };
                if (off) delete n[s.chave];
                else if (visiveis.length > 1) n[s.chave] = true;
                setOcultas(n);
              }}
            >
              <i className={juntar("neu-area__key-dot", props.linhas && "neu-area__key-dot--line", s.tracejada && "neu-area__key-dot--dashed")} />
              {s.nome}
            </button>
          );
        })}
      </div>
    ) : null;

  const corpo = (
    <div className="neu-area__body">
      <div className="neu-area__focus" tabIndex={0} role="group" aria-label={`${resumo} Use as setas para percorrer os pontos.`} onKeyDown={teclas} onBlur={() => setAtivo(null)}>
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
    <section className={juntar("neu-area", className)}>
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

const ATENDIMENTOS: LinhaDados[] = [
  { name: "10 AM", valor: 85 },
  { name: "1 PM", valor: 110 },
  { name: "4 PM", valor: 95 },
  { name: "7 PM", valor: 105 },
  { name: "10 PM", valor: 78 },
];
const POR_MES: LinhaDados[] = [
  { name: "Jan", valor: 412 },
  { name: "Fev", valor: 468 },
  { name: "Mar", valor: 455 },
  { name: "Abr", valor: 530 },
  { name: "Mai", valor: 498 },
  { name: "Jun", valor: 575 },
  { name: "Jul", valor: 610 },
  { name: "Ago", valor: 588 },
];

/** Os dois gráficos do pacote: a série da marca e a institucional (na secundária, com o piso do eixo em 300) */
export default function NeumorfismoAreaBasico() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoArea titulo="Atendimentos por horário" subtitulo="Hoje · atualizado às 22h" emblema={{ rotulo: "Diário" }} nomeSerie="Atendimentos" rotuloX="horário" dados={ATENDIMENTOS} altura={300} />
      <GraficoArea titulo="Empresas atendidas por mês" subtitulo="2026 · série institucional" tom="azul" nomeSerie="Empresas" rotuloX="mês" dados={POR_MES} altura={220} minimo={300} />
    </div>
  );
}
