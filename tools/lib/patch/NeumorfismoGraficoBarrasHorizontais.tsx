import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CLASSE_EMBLEMA, CLASSE_TOM, ticksBonitos, type LinhaDados, type TomEmblemaArea, type TomSerie } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do HorizontalBarChart no estilo Neumorfismo (componente HorizontalBarChart do pacote Neumorphic UI v3.2.0): barras
 * horizontais para rankings e nomes longos de categoria, em SVG, sem biblioteca de gráficos. As categorias correm à esquerda
 * numa coluna fixa e o eixo dos valores fica embaixo. Cada linha tem um vão afundado de largura total, em pílula, com a barra
 * dentro, crescendo da linha do zero: um degradê da esquerda para a direita na cor do tom, com brilho suave e a ponta livre
 * arredondada; o valor vem logo depois da barra, em mono negrito de 11px. Como ranking (padrão), as linhas se ordenam do
 * maior para o menor e cada uma começa com um disco de posição: os três primeiros são convexos, com o número na cor da marca;
 * os demais são afundados. A barra líder brilha e o valor dela ganha o tom (`classificar={false}` tira os discos e
 * `ordenar={false}` mantém a ordem dos dados; `"asc"` põe o menor primeiro). As categorias ficam numa coluna de 120px
 * (`larguraCategoria`), alinhadas à direita em 12px seminegrito; nomes longos são cortados com "…" e o nome inteiro está no
 * título. O eixo tem linhas de grade tracejadas com valores em mono embaixo, uma linha de zero sólida, e os valores
 * negativos se estendem à esquerda dela. Ao passar o mouse por uma linha (ou usar ↑ ↓ Home End no gráfico em foco), uma faixa
 * suave sobe atrás dela, o nome fica em negrito, a barra brilha e as outras linhas esmaecem; uma região educada anuncia, por
 * exemplo, "2º Sobral: Atendimentos 2.110". O tom vale para o gráfico todo ou para cada linha dos dados. Entra no cartão
 * "Barras Horizontais" do DS (no neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos neu-area*, neu-gbar*
 * e neu-hbar* vêm de src/styles/estilo.css.
 */

export interface LinhaBarraHorizontal {
  nome: string;
  valor: number;
  tom?: TomSerie;
}

export interface GraficoBarrasHorizontaisProps {
  dados: LinhaBarraHorizontal[] | LinhaDados[];
  chaveNome?: string;
  chaveValor?: string;
  titulo?: string;
  subtitulo?: string;
  emblema?: { rotulo: string; tom?: TomEmblemaArea };
  /** Nome da série, para a região educada */
  nomeSerie?: string;
  altura?: number;
  formatarValor?: (v: number) => string;
  ticks?: number;
  valoresTicks?: number[];
  tom?: TomSerie;
  /** Discos de posição (padrão ligado) */
  classificar?: boolean;
  ordenar?: "desc" | "asc" | false;
  /** O brilho e o tom no valor da barra líder (padrão ligado) */
  destaque?: boolean;
  larguraCategoria?: number;
  alturaBarra?: number;
  raio?: number;
  fendas?: boolean;
  moldura?: boolean;
  className?: string;
}

const juntar = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");
const milhar = (v: number) => Number(v).toLocaleString("pt-BR");

export function GraficoBarrasHorizontais(props: GraficoBarrasHorizontaisProps) {
  const { titulo, subtitulo, emblema, className } = props;
  const chaveNome = props.chaveNome ?? "name";
  const chaveValor = props.chaveValor ?? "valor";
  const H = props.altura ?? 320;
  const fmt = props.formatarValor ?? milhar;
  const linhas = (props.dados as Record<string, string | number>[]).map((d, i) => {
    const nome = "nome" in d ? d.nome : d[chaveNome];
    const valor = "nome" in d ? Number(d.valor) : Number(d[chaveValor]);
    return { i, nome: String(nome), valor: valor || 0, tom: ((d.tom as TomSerie | undefined) ?? props.tom ?? "marca") as TomSerie };
  });
  if (props.ordenar !== false) linhas.sort((a, b) => (props.ordenar === "asc" ? a.valor - b.valor : b.valor - a.valor));

  const ref = useRef<HTMLDivElement>(null);
  const id = "neu-hbar" + useId().replace(/:/g, "");
  const [W, setW] = useState(560);
  const [ativo, setAtivo] = useState<number | null>(null);
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

  const n = Math.max(1, linhas.length);
  const ranking = props.classificar !== false;
  const vals = linhas.map((r) => r.valor);
  const ticks = props.valoresTicks ?? ticksBonitos(Math.min(0, ...vals, 0), Math.max(0, ...vals, 0), props.ticks ?? 5);
  const x0 = ticks[0];
  const x1 = ticks[ticks.length - 1];
  const maxRot = Math.max(1, ...linhas.map((r) => String(fmt(r.valor)).length));
  const rankW = ranking ? 30 : 0;
  const catW = Math.max(56, Math.min(props.larguraCategoria ?? 120, Math.round((W - rankW) * 0.34)));
  const padL = 16 + rankW + catW;
  const padR = 22 + maxRot * 7;
  const padT = 12;
  const padB = 30;
  const iw = Math.max(20, W - padL - padR);
  const ih = H - padT - padB;
  const rowH = ih / n;
  const barH = Math.max(8, Math.min(props.alturaBarra ?? 20, rowH * 0.58));
  const x = (v: number) => padL + ((v - x0) / (x1 - x0)) * iw;
  const zx = x(Math.max(x0, Math.min(0, x1)));
  const maxChars = Math.max(4, Math.floor((catW - 8) / 6.2));
  const cortar = (s: string) => (s.length > maxChars ? s.slice(0, maxChars - 1) + "…" : s);
  const topo = Math.max(-Infinity, ...vals);

  function teclas(e: KeyboardEvent) {
    let i: number | null = ativo == null ? -1 : ativo;
    if (e.key === "ArrowDown") i = Math.min(n - 1, i + 1);
    else if (e.key === "ArrowUp") i = Math.max(0, i < 0 ? 0 : i - 1);
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else if (e.key === "Escape") i = null;
    else return;
    e.preventDefault();
    setAtivo(i);
  }

  const tons = Array.from(new Set(linhas.map((r) => r.tom)));
  const svg = (
    <svg width={W} height={H} className="neu-area__svg" aria-hidden="true" onMouseLeave={() => setAtivo(null)}>
      <defs>
        {tons.map((t) => (
          <linearGradient key={t} id={`${id}-${t}`} x1={0} y1={0} x2={1} y2={0} className={`neu-area__s--${CLASSE_TOM[t]}`}>
            <stop offset="0%" className="neu-area__stop" stopOpacity={0.72} />
            <stop offset="100%" className="neu-area__stop" stopOpacity={1} />
          </linearGradient>
        ))}
      </defs>
      {ticks.map((t) => {
        const xx = x(t);
        return (
          <g key={"t" + t}>
            <line x1={xx} x2={xx} y1={padT} y2={padT + ih} className="neu-area__grid" />
            <text x={xx} y={H - 10} textAnchor="middle" className="neu-area__ytick">
              {t < 0 ? "−" + fmt(-t) : fmt(t)}
            </text>
          </g>
        );
      })}
      {ativo != null ? <rect x={6} y={padT + rowH * ativo + 2} width={W - 12} height={rowH - 4} rx={10} className="neu-gbar__hover" /> : null}
      {linhas.map((r, k) => {
        const cy = padT + rowH * k + rowH / 2;
        const top = cy - barH / 2;
        const x2 = x(r.valor);
        const on = ativo === k;
        const dim = ativo != null && !on;
        const lider = props.destaque !== false && r.valor === topo && k === 0;
        const w2 = Math.abs(x2 - zx);
        const bx = Math.min(x2, zx);
        const rr = Math.min(props.raio ?? 6, barH / 2, w2);
        const caminho =
          w2 <= 0
            ? ""
            : r.valor >= 0
              ? `M${bx},${top}H${bx + w2 - rr}Q${bx + w2},${top} ${bx + w2},${top + rr}V${top + barH - rr}Q${bx + w2},${top + barH} ${bx + w2 - rr},${top + barH}H${bx}Z`
              : `M${bx + w2},${top}H${bx + rr}Q${bx},${top} ${bx},${top + rr}V${top + barH - rr}Q${bx},${top + barH} ${bx + rr},${top + barH}H${bx + w2}Z`;
        return (
          <g key={r.i} className={juntar("neu-hbar__row", `neu-area__s--${CLASSE_TOM[r.tom]}`, on && "neu-hbar__row--on", dim && "neu-hbar__row--dim")} onMouseEnter={() => setAtivo(k)}>
            <rect x={padL - 6} y={padT + rowH * k} width={Math.max(0, W - padL + 6)} height={rowH} fill="transparent" />
            {ranking ? (
              <g className={juntar("neu-hbar__rank", k < 3 && "neu-hbar__rank--top")}>
                <circle cx={16 + 11} cy={cy} r={11} className="neu-hbar__rank-disc" />
                <text x={16 + 11} y={cy} dy="0.35em" textAnchor="middle" className="neu-hbar__rank-num">
                  {k + 1}
                </text>
              </g>
            ) : null}
            <text x={padL - 10} y={cy} dy="0.35em" textAnchor="end" className="neu-hbar__cat">
              <title>{r.nome}</title>
              {cortar(r.nome)}
            </text>
            {props.fendas !== false ? <rect x={zx} y={top} width={Math.max(0, padL + iw - zx)} height={barH} rx={barH / 2} className="neu-hbar__slot" /> : null}
            <path d={caminho} fill={`url(#${id}-${r.tom})`} className={juntar("neu-hbar__bar", lider && "neu-hbar__bar--peak")} />
            <text x={r.valor >= 0 ? x2 + 8 : x2 - 8} y={cy} dy="0.35em" textAnchor={r.valor >= 0 ? "start" : "end"} className={juntar("neu-hbar__val", lider && "neu-hbar__val--peak")}>
              {fmt(r.valor)}
            </text>
          </g>
        );
      })}
      <line x1={zx} x2={zx} y1={padT} y2={padT + ih} className="neu-gbar__base" />
    </svg>
  );

  const nome = props.nomeSerie ?? "Valor";
  const resumo = `${titulo ?? "Ranking"}. ${linhas.map((r, k) => `${ranking ? `${k + 1}º ` : ""}${r.nome}: ${fmt(r.valor)}`).join("; ")}.`;
  const anuncio = ativo != null && linhas[ativo] ? `${ranking ? `${ativo + 1}º ` : ""}${linhas[ativo].nome}: ${nome} ${fmt(linhas[ativo].valor)}` : "";
  const corpo = (
    <div className="neu-area__focus" tabIndex={0} role="group" aria-label={`${resumo} Use ↑ e ↓ para percorrer.`} onKeyDown={teclas} onBlur={() => setAtivo(null)}>
      <div className="neu-area__plot" ref={ref} style={{ height: H }}>
        {svg}
      </div>
      <div className="sr-only" aria-live="polite">
        {anuncio}
      </div>
    </div>
  );
  if (props.moldura === false) return corpo;
  return (
    <section className={juntar("neu-area", "neu-hbar", className)}>
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

const MUNICIPIOS: LinhaBarraHorizontal[] = [
  { nome: "Fortaleza", valor: 4820 },
  { nome: "Caucaia", valor: 1240 },
  { nome: "Juazeiro do Norte", valor: 1985 },
  { nome: "Maracanaú", valor: 1530 },
  { nome: "Sobral", valor: 2110 },
  { nome: "Crato", valor: 860 },
  { nome: "Itapipoca", valor: 720 },
  { nome: "Maranguape", valor: 655 },
];

const SERVICOS: LinhaBarraHorizontal[] = [
  { nome: "Capacitação", valor: 82 },
  { nome: "Consultoria", valor: 76 },
  { nome: "Crédito orientado", valor: 64 },
  { nome: "Feiras e eventos", valor: 71 },
  { nome: "Atendimento remoto", valor: 58 },
];

/** Os dois gráficos do pacote: o ranking por município e a satisfação por serviço na ordem original, sem posições */
export default function NeumorfismoBarrasHorizontais() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoBarrasHorizontais titulo="Ranking de atendimentos por município" subtitulo="Top 8 · 2026" emblema={{ rotulo: "Ranking" }} nomeSerie="Atendimentos" dados={MUNICIPIOS} />
      <GraficoBarrasHorizontais titulo="Satisfação por serviço" subtitulo="NPS · sem posições, ordem original" nomeSerie="NPS" dados={SERVICOS} classificar={false} ordenar={false} tom="azul" altura={240} valoresTicks={[0, 25, 50, 75, 100]} />
    </div>
  );
}
