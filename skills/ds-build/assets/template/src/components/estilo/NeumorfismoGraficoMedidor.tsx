import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CLASSE_EMBLEMA, CLASSE_TOM, TONS, type TomEmblemaArea, type TomSerie } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do GaugeChart no estilo Neumorfismo (componente GaugeChart do pacote Neumorphic UI v3.2.0): um medidor
 * semicircular (barras radiais) em SVG, sem biblioteca de gráficos, que vai de 180° a 0°. Os arcos ficam em canais afundados
 * sobre uma base de meio disco em relevo. Com vários indicadores, são anéis concêntricos, o de fora primeiro, entre 30% e 90%
 * do raio; cada anel tem uma trilha afundada (com uma borda escura por dentro e uma clara por fora) e um arco de valor com
 * pontas redondas que brilha na cor dele. Os valores são uma parte de `max` (padrão 100). A legenda fica à direita, empilhada
 * e centralizada: chaves convexas com um LED, o nome e o valor em mono (abaixo de 600px de largura ela desce para baixo do
 * medidor). Passar o mouse numa chave destaca o anel. Clicar numa chave a seleciona: o anel brilha e os outros ficam cinza. O
 * centro do medidor de vários anéis começa vazio, porque com todos à vista um valor só daria a entender que é o de todos;
 * ele mostra só o valor (sem o nome, que fica inteiro na chave) quando exatamente uma chave está selecionada, e fica vazio
 * de novo com duas ou mais, para não confundir a leitura (`destaque` escolhe um anel para o centro enquanto nada está
 * selecionado). Clicar numa chave selecionada tira a seleção. Com um indicador só, há um arco grosso, o valor
 * grande no centro e o nome embaixo. O texto do centro sempre cabe no vão: o valor começa em 36px (um indicador) ou 24px
 * (vários anéis) e vai diminuindo até ficar a 12px da borda de dentro do arco mais interno (com o nome, no caso de um
 * indicador), então valores longos como "3.120" ou "R$ 4,8M" nunca encostam na barra. As pontas da escala (`min` e `max`) saem embaixo das
 * pontas do arco, e `meta` põe um marco azul atravessando o arco, com o rótulo ("Meta 85"). As cores seguem a paleta de dados,
 * na ordem; use `tom` por item ou `tons` no gráfico, e, num medidor de estado, o tom que combina com o sentido (sucesso,
 * atenção, perigo). Sem `formatarValor` e com `max` 100, os valores leem como porcentagem ("68%"). O gráfico é um grupo focável
 * cujo nome lê cada indicador como "nome: valor de máximo (N%)", mais a meta; com vários anéis, ← → Home End andam por eles e
 * uma região educada anuncia cada um. Entra no cartão "Gráfico Radial (Gauge)" do DS (no neumorfismo) e só é usado quando
 * ESTILO.id === "neumorfismo". Os estilos neu-area* e neu-gauge* vêm de src/styles/estilo.css.
 */

export interface IndicadorMedidor {
  nome: string;
  valor: number;
  max?: number;
  tom?: TomSerie;
}

export interface GraficoMedidorProps {
  dados: IndicadorMedidor[];
  titulo?: string;
  subtitulo?: string;
  emblema?: { rotulo: string; tom?: TomEmblemaArea };
  altura?: number;
  /** O máximo padrão da escala (100) */
  max?: number;
  /** O começo da escala, com um indicador só (0) */
  min?: number;
  /** Um marco na escala, com um indicador só */
  meta?: number;
  rotuloMeta?: string;
  /** O raio interno, em % do raio (padrão 30; 60 com um indicador) */
  raioInterno?: number;
  raioExterno?: number;
  tons?: TomSerie[];
  /** Índice do anel mostrado no centro quando nada está em foco */
  destaque?: number;
  legenda?: boolean;
  escala?: boolean;
  /** Valores como porcentagem quando `max` é 100 e não há `formatarValor` (padrão ligado) */
  porcentagem?: boolean;
  moldura?: boolean;
  formatarValor?: (v: number) => string;
  className?: string;
}

const juntar = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");
const virgula = (v: number) => String(v).replace(".", ",");

/** Um arco de meio disco, de uma fração a outra (0 é a ponta da esquerda e 1, a da direita) */
export function arcoMedidor(cx0: number, cy0: number, r: number, f0: number, f1: number): string {
  const a0 = Math.PI * (1 - f0);
  const a1 = Math.PI * (1 - f1);
  const x0 = cx0 + r * Math.cos(a0);
  const y0 = cy0 - r * Math.sin(a0);
  const x1 = cx0 + r * Math.cos(a1);
  const y1 = cy0 - r * Math.sin(a1);
  return `M${x0.toFixed(2)},${y0.toFixed(2)}A${r},${r} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
}

export function GraficoMedidor(props: GraficoMedidorProps) {
  const { dados, titulo, subtitulo, emblema, className } = props;
  const H = props.altura ?? 300;
  const fmt = props.formatarValor ?? virgula;
  const ref = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(560);
  const [ativo, setAtivo] = useState<number | null>(null);
  const [selecionados, setSelecionados] = useState<Record<number, boolean>>({});
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

  const itens = dados.map((d, i) => {
    const mx = d.max != null ? Number(d.max) : (props.max ?? 100);
    const v = Number(d.valor) || 0;
    return { i, nome: d.nome, valor: v, max: mx, frac: Math.max(0, Math.min(1, v / mx)), tom: (d.tom ?? props.tons?.[i] ?? TONS[i % TONS.length]) as TomSerie };
  });
  const vis = itens;
  const unico = itens.length === 1;
  const R = Math.max(40, Math.min(W / 2 - 18, (H - 16 - 30) / (unico ? 1.2 : 1.06))) * ((props.raioExterno ?? 90) / 100);
  const r0 = R * ((props.raioInterno ?? (unico ? 60 : 30)) / 100);
  const n = Math.max(1, vis.length);
  const faixa = (R - r0) / n;
  const sw = Math.max(6, faixa * (unico ? 0.74 : 0.64));
  const pe = sw / 2 + (unico && props.escala !== false ? 26 : 12);
  const cx0 = W / 2;
  const cy0 = Math.min(H - pe, 16 + R + (H - 16 - R - pe) / 2);
  const aneis = vis.map((it, k) => ({ ...it, r: R - faixa * k - faixa / 2 }));
  const holeR = (aneis.length ? aneis[aneis.length - 1].r : r0) - sw / 2 - 8;
  function ajustarCentro(valTxt: string, rotTxt: string, base: number): number {
    const labH = rotTxt ? 20 : 0;
    let fs = base;
    for (; fs > 14; fs -= 1) {
      const yv = 6 + labH + fs * 1.1;
      const hv = holeR * holeR - yv * yv;
      if (hv > 0 && valTxt.length * fs * 0.66 <= 2 * Math.sqrt(hv)) break;
    }
    return fs;
  }
  // com vários anéis o centro fica vazio até uma chave ser escolhida: com todos à vista, ou com mais de um escolhido, um só
  // valor no centro daria a entender que é o de todos
  const escolhidos = itens.filter((it) => selecionados[it.i]).map((it) => it.i);
  const cur = unico ? aneis[0] : escolhidos.length === 1 ? aneis.find((g) => g.i === escolhidos[0]) : escolhidos.length === 0 && props.destaque != null ? aneis.find((g) => g.i === props.destaque) : undefined;
  const falado = ativo != null ? aneis.find((g) => g.i === ativo) : escolhidos.length === 1 ? aneis.find((g) => g.i === escolhidos[0]) : undefined;
  const pctTxt = (f: number) => Math.round(f * 100) + "%";
  const mostrarPct = props.porcentagem !== false;
  const cVal = cur ? (mostrarPct && cur.max === 100 && !props.formatarValor ? fmt(cur.valor) + "%" : fmt(cur.valor)) : "";
  const cFs = cur ? ajustarCentro(cVal, unico ? cur.nome : "", unico ? 36 : 24) : 24;

  function teclas(e: KeyboardEvent) {
    const m = aneis.length;
    if (!m) return;
    let i = ativo == null ? -1 : aneis.findIndex((g) => g.i === ativo);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (i + 1) % m;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (i - 1 + m) % m;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = m - 1;
    else if (e.key === "Escape") {
      setAtivo(null);
      return;
    } else return;
    e.preventDefault();
    setAtivo(aneis[i].i);
  }

  const marco = (() => {
    if (!unico || props.meta == null) return null;
    const f = Math.max(0, Math.min(1, props.meta / itens[0].max));
    const a = Math.PI * (1 - f);
    const r1 = R + 6;
    return (
      <g className="neu-gauge__target">
        <line x1={cx0 + r1 * Math.cos(a)} y1={cy0 - r1 * Math.sin(a)} x2={cx0 + (R - sw - 2) * Math.cos(a)} y2={cy0 - (R - sw - 2) * Math.sin(a)} />
        <text x={cx0 + (R + 16) * Math.cos(a)} y={cy0 - (R + 16) * Math.sin(a)} textAnchor={f > 0.55 ? "start" : f < 0.45 ? "end" : "middle"}>
          {`${props.rotuloMeta ?? "Meta"} ${fmt(props.meta)}`}
        </text>
      </g>
    );
  })();

  const grafico = (
    <div className="neu-gauge__plot" ref={ref} style={{ height: H }}>
      <span className="neu-gauge__base" style={{ width: (R + 14) * 2, height: R + 14 + pe - 4, left: cx0 - R - 14, top: cy0 - R - 14 }} />
      <svg width={W} height={H} className="neu-gauge__svg" aria-hidden="true" onMouseLeave={() => setAtivo(null)}>
        {aneis.map((g) => {
          const on = ativo === g.i || !!selecionados[g.i];
          const dim = (ativo != null || escolhidos.length > 0) && !on;
          const cinza = escolhidos.length > 0 && !on;
          return (
            <g key={g.i} className={juntar("neu-gauge__ring", `neu-area__s--${CLASSE_TOM[g.tom]}`, on && "neu-gauge__ring--on", dim && "neu-gauge__ring--dim", cinza && "neu-gauge__ring--gray")} onMouseEnter={() => setAtivo(g.i)}>
              <path d={arcoMedidor(cx0, cy0, g.r, 0, 1)} className="neu-gauge__track" strokeWidth={sw} />
              <path d={arcoMedidor(cx0, cy0, g.r - sw / 2 + 1, 0, 1)} className="neu-gauge__track-shade" />
              <path d={arcoMedidor(cx0, cy0, g.r + sw / 2 - 1, 0, 1)} className="neu-gauge__track-light" />
              {g.frac > 0 ? <path d={arcoMedidor(cx0, cy0, g.r, 0, Math.max(g.frac, 0.004))} className="neu-gauge__value" strokeWidth={sw - (unico ? 6 : 3)} /> : null}
            </g>
          );
        })}
        {unico && props.escala !== false ? (
          <g className="neu-gauge__scale">
            <text x={cx0 - R + sw / 2} y={cy0 + sw / 2 + 16} textAnchor="middle">
              {fmt(props.min ?? 0)}
            </text>
            <text x={cx0 + R - sw / 2} y={cy0 + sw / 2 + 16} textAnchor="middle">
              {fmt(itens[0].max)}
            </text>
          </g>
        ) : null}
        {marco}
      </svg>
      {cur ? (
        <div className="neu-gauge__center" style={{ left: cx0, top: cy0 - Math.max(4, sw * 0.12), maxWidth: holeR * 2 }} aria-hidden="true">
          <b className="neu-gauge__c-value" style={{ fontSize: cFs, lineHeight: Math.round(cFs * 1.15) + "px" }}>
            {cVal}
          </b>
          {unico ? <span className="neu-gauge__c-label">{cur.nome}</span> : null}
        </div>
      ) : null}
    </div>
  );

  const resumo = `${titulo ?? "Medidor"}. ${aneis.map((g) => `${g.nome}: ${fmt(g.valor)} de ${fmt(g.max)} (${pctTxt(g.frac)})`).join("; ")}${unico && props.meta != null ? `; ${props.rotuloMeta ?? "meta"} ${fmt(props.meta)}` : ""}.`;
  const legenda =
    !unico && props.legenda !== false ? (
      <div className="neu-gauge__legend" role="group" aria-label="Indicadores">
        {itens.map((it) => {
          const sel = !!selecionados[it.i];
          return (
            <button
              key={it.i}
              type="button"
              className={juntar("neu-gauge__key", `neu-area__s--${CLASSE_TOM[it.tom]}`, (sel || ativo === it.i) && "neu-gauge__key--on")}
              aria-pressed={sel}
              title={sel ? `Tirar a seleção de ${it.nome}` : `Selecionar ${it.nome}`}
              onMouseEnter={() => setAtivo(it.i)}
              onMouseLeave={() => setAtivo(null)}
              onClick={() => {
                const ns = { ...selecionados };
                if (sel) delete ns[it.i];
                else ns[it.i] = true;
                setSelecionados(ns);
              }}
            >
              <i className="neu-gauge__key-dot" />
              <span className="neu-gauge__key-name">{it.nome}</span>
              <span className="neu-gauge__key-val">{it.max === 100 && !props.formatarValor ? fmt(it.valor) + "%" : fmt(it.valor)}</span>
            </button>
          );
        })}
      </div>
    ) : null;

  const corpo = (
    <div className={juntar("neu-gauge__body", legenda && "neu-gauge__body--side")}>
      <div className="neu-area__focus neu-gauge__focus" tabIndex={0} role="group" aria-label={resumo + (unico ? "" : " Use as setas para percorrer os indicadores.")} onKeyDown={unico ? undefined : teclas} onBlur={() => setAtivo(null)}>
        {grafico}
        <div className="sr-only" aria-live="polite">
          {falado ? `${falado.nome}: ${fmt(falado.valor)} de ${fmt(falado.max)}` : ""}
        </div>
      </div>
      {legenda}
    </div>
  );
  if (props.moldura === false) return corpo;
  return (
    <section className={juntar("neu-area", "neu-gauge", className)}>
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

const METAS: IndicadorMedidor[] = [
  { nome: "Agentes locais", valor: 82 },
  { nome: "Capacitação", valor: 68 },
  { nome: "Consultoria", valor: 54 },
  { nome: "Crédito orientado", valor: 37 },
];

/** Os três medidores do pacote: quatro anéis com legenda, um de satisfação com meta e um de orçamento com máximo próprio */
export default function NeumorfismoMedidor() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoMedidor titulo="Execução das metas por programa" subtitulo="% da meta anual · out/2026" emblema={{ rotulo: "Anual" }} dados={METAS} altura={300} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        <GraficoMedidor titulo="Satisfação geral" subtitulo="Índice 0–100" dados={[{ nome: "Satisfação", valor: 78, tom: "sucesso" }]} meta={85} altura={210} />
        <GraficoMedidor titulo="Orçamento executado" subtitulo="R$ mil de R$ 4.800 mil" dados={[{ nome: "Executado", valor: 3120, max: 4800, tom: "azul" }]} altura={210} formatarValor={(n) => Number(n).toLocaleString("pt-BR")} />
      </div>
    </div>
  );
}
