import { Fragment, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CLASSE_EMBLEMA, CLASSE_TOM, TONS, type TomEmblemaArea, type TomSerie } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do DonutChart no estilo Neumorfismo (componente DonutChart do pacote Neumorphic UI v3.2.0): um gráfico de rosca em
 * SVG, sem biblioteca de gráficos. O anel fica sobre uma base neumórfica: um disco em relevo com um canal afundado em volta e,
 * no meio, um botão convexo que guarda o total. As fatias são separadas por um vão de 3° (`anguloEntre`), por onde aparece o
 * canal afundado; cada uma é preenchida com a cor da série e brilha de leve. As proporções seguem o pacote: raio externo 100 e
 * interno 60. As cores seguem a paleta de dados, na ordem: marca, azul (a secundária), sucesso, atenção e neutro; mude-as no
 * gráfico todo com `tons` ou numa fatia com `tom` nos dados. Os rótulos externos são uma linha-guia colorida com um ponto, da
 * fatia até "Nome 42%" (o nome em tom firme e a porcentagem em mono negrito); somem abaixo de 3% (`minPercentualRotulo`) e
 * quando o gráfico tem menos de 420px de largura, e `rotulos={false}` os apaga. O centro traz o total e `rotuloCentro` (padrão
 * "Total"); ao passar o mouse ou focar uma fatia, mostra a fatia no lugar: o nome com um ponto colorido, o valor e "N% do total".
 * A fatia ativa salta 6px para fora, pelo ângulo do meio, e brilha mais; as outras esmaecem a 45%, e os rótulos delas também.
 * A legenda tem chaves convexas com a porcentagem de cada fatia; passar o mouse numa chave destaca a fatia, e clicar a esconde:
 * o anel e as porcentagens se recalculam sobre as visíveis, e a última não se esconde. O gráfico é um grupo focável cujo nome
 * lê o total e cada fatia com o valor e a parte; ← → (ou ↑ ↓) Home End andam pelas fatias e uma região educada anuncia cada
 * uma. Cada fatia é sempre nomeada na legenda e no centro, nunca só pela cor. Entra no cartão "Gráfico de Rosca (Donut)" do DS
 * (no neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos neu-area* e neu-donut* vêm de
 * src/styles/estilo.css.
 */

export interface FatiaRosca {
  nome: string;
  valor: number;
  tom?: TomSerie;
}

export interface GraficoRoscaProps {
  dados: FatiaRosca[] | Record<string, string | number>[];
  chaveNome?: string;
  chaveValor?: string;
  titulo?: string;
  subtitulo?: string;
  emblema?: { rotulo: string; tom?: TomEmblemaArea };
  altura?: number;
  raioExterno?: number;
  raioInterno?: number;
  /** O vão entre fatias, em graus (padrão 3) */
  anguloEntre?: number;
  /** As cores das fatias, em ordem; senão, a paleta de dados */
  tons?: TomSerie[];
  /** Rótulos externos com linha-guia (padrão ligados, e só a partir de 420px de largura) */
  rotulos?: boolean;
  minPercentualRotulo?: number;
  legenda?: boolean;
  moldura?: boolean;
  rotuloCentro?: string;
  subCentro?: string;
  formatarValor?: (v: number) => string;
  className?: string;
}

const juntar = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");
const milhar = (v: number) => Number(v).toLocaleString("pt-BR");
const pctTxt = (v: number) => (v < 10 && v % 1 ? v.toFixed(1) : String(Math.round(v))).replace(".", ",") + "%";

/** O caminho de um arco de anel entre dois ângulos, do raio interno ao externo */
export function caminhoArco(cx0: number, cy0: number, R: number, r: number, a0: number, a1: number): string {
  const la = a1 - a0 > Math.PI ? 1 : 0;
  const c = Math.cos;
  const s = Math.sin;
  return `M${cx0 + R * c(a0)},${cy0 + R * s(a0)}A${R},${R} 0 ${la} 1 ${cx0 + R * c(a1)},${cy0 + R * s(a1)}L${cx0 + r * c(a1)},${cy0 + r * s(a1)}A${r},${r} 0 ${la} 0 ${cx0 + r * c(a0)},${cy0 + r * s(a0)}Z`;
}

export function GraficoRosca(props: GraficoRoscaProps) {
  const { titulo, subtitulo, emblema, className } = props;
  const chaveNome = props.chaveNome ?? "name";
  const chaveValor = props.chaveValor ?? "value";
  const H = props.altura ?? 300;
  const fmt = props.formatarValor ?? milhar;
  const ref = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(560);
  const [ativo, setAtivo] = useState<number | null>(null);
  const [ocultas, setOcultas] = useState<Record<number, boolean>>({});
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

  const itens = (props.dados as Record<string, string | number>[]).map((d, i) => {
    const nome = "nome" in d ? d.nome : d[chaveNome];
    const valor = "nome" in d ? Number(d.valor) : Number(d[chaveValor]);
    return { i, nome: String(nome), valor: valor || 0, tom: ((d.tom as TomSerie | undefined) ?? props.tons?.[i] ?? TONS[i % TONS.length]) as TomSerie };
  });
  const vis = itens.filter((it) => !ocultas[it.i]);
  const total = vis.reduce((a, it) => a + it.valor, 0) || 1;
  const comRotulos = props.rotulos !== false && W >= 420;
  const rExt = props.raioExterno ?? 100;
  const R = Math.min(rExt, (H - 40) / 2, comRotulos ? (W - 260) / 2 : W / 2 - 12);
  const r = R * ((props.raioInterno ?? 60) / rExt);
  const cx0 = W / 2;
  const cy0 = H / 2;
  const pad = ((props.anguloEntre ?? 3) * Math.PI) / 180;
  let a = -Math.PI / 2;
  const segs = vis.map((it) => {
    const varredura = (it.valor / total) * Math.PI * 2;
    const a0 = a;
    const a1 = a + varredura;
    a = a1;
    const pp = vis.length > 1 ? Math.min(pad, varredura * 0.4) : 0;
    return { ...it, a0: a0 + pp / 2, a1: a1 - pp / 2, mid: (a0 + a1) / 2, pct: (it.valor / total) * 100 };
  });

  function teclas(e: KeyboardEvent) {
    const n = segs.length;
    if (!n) return;
    let i = ativo == null ? -1 : segs.findIndex((s) => s.i === ativo);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (i - 1 + n) % n;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else if (e.key === "Escape") {
      setAtivo(null);
      return;
    } else return;
    e.preventDefault();
    setAtivo(segs[i].i);
  }

  const cur = ativo != null ? segs.find((s) => s.i === ativo) ?? null : null;
  const grafico = (
    <div className="neu-donut__plot" ref={ref} style={{ height: H }}>
      <span className="neu-donut__base" style={{ width: (R + 12) * 2, height: (R + 12) * 2, left: cx0 - R - 12, top: cy0 - R - 12 }} />
      <span className="neu-donut__track" style={{ width: R * 2 + 4, height: R * 2 + 4, left: cx0 - R - 2, top: cy0 - R - 2 }} />
      <span className="neu-donut__well" style={{ width: (r - 6) * 2, height: (r - 6) * 2, left: cx0 - r + 6, top: cy0 - r + 6 }} />
      <svg width={W} height={H} className="neu-donut__svg" aria-hidden="true" onMouseLeave={() => setAtivo(null)}>
        {segs.map((s) => {
          const on = ativo === s.i;
          const off = ativo != null && !on;
          const dx = on ? Math.cos(s.mid) * 6 : 0;
          const dy = on ? Math.sin(s.mid) * 6 : 0;
          return <path key={s.i} d={caminhoArco(cx0, cy0, R, r, s.a0, s.a1)} transform={`translate(${dx},${dy})`} className={juntar("neu-donut__seg", `neu-area__s--${CLASSE_TOM[s.tom]}`, on && "neu-donut__seg--on", off && "neu-donut__seg--dim")} onMouseEnter={() => setAtivo(s.i)} />;
        })}
        {comRotulos
          ? segs.map((s) => {
              if (s.pct < (props.minPercentualRotulo ?? 3)) return null;
              const c = Math.cos(s.mid);
              const sn = Math.sin(s.mid);
              const x1 = cx0 + (R + 4) * c;
              const y1 = cy0 + (R + 4) * sn;
              const x2 = cx0 + (R + 18) * c;
              const y2 = cy0 + (R + 18) * sn;
              const direita = c >= 0;
              const x3 = x2 + (direita ? 14 : -14);
              return (
                <g key={"l" + s.i} className={juntar("neu-donut__label", `neu-area__s--${CLASSE_TOM[s.tom]}`, ativo != null && ativo !== s.i && "neu-donut__label--dim")}>
                  <polyline points={`${x1},${y1} ${x2},${y2} ${x3},${y2}`} className="neu-donut__leader" />
                  <circle cx={x1} cy={y1} r={2.5} className="neu-donut__leader-dot" />
                  <text x={x3 + (direita ? 6 : -6)} y={y2} dy="0.35em" textAnchor={direita ? "start" : "end"} className="neu-donut__label-text">
                    <tspan className="neu-donut__label-name">{s.nome + " "}</tspan>
                    <tspan className="neu-donut__label-pct">{pctTxt(s.pct)}</tspan>
                  </text>
                </g>
              );
            })
          : null}
      </svg>
      <div className="neu-donut__center" style={{ left: cx0, top: cy0, maxWidth: (r - 10) * 2 }} aria-hidden="true">
        {cur ? (
          <Fragment>
            <span className={juntar("neu-donut__c-label", `neu-area__s--${CLASSE_TOM[cur.tom]}`)}>
              <i className="neu-area__tip-dot" />
              {cur.nome}
            </span>
            <b className="neu-donut__c-value">{fmt(cur.valor)}</b>
            <span className="neu-donut__c-sub">{pctTxt(cur.pct) + " do total"}</span>
          </Fragment>
        ) : (
          <Fragment>
            <span className="neu-donut__c-label">{props.rotuloCentro ?? "Total"}</span>
            <b className="neu-donut__c-value">{fmt(vis.reduce((a2, it) => a2 + it.valor, 0))}</b>
            {props.subCentro ? <span className="neu-donut__c-sub">{props.subCentro}</span> : null}
          </Fragment>
        )}
      </div>
    </div>
  );

  const resumo = `${titulo ?? "Gráfico de rosca"}. Total ${fmt(total)}. ${segs.map((s) => `${s.nome} ${fmt(s.valor)} (${pctTxt(s.pct)})`).join("; ")}.`;
  const legenda =
    props.legenda !== false ? (
      <div className="neu-area__legend neu-donut__legend" role="group" aria-label="Fatias">
        {itens.map((it) => {
          const off = !!ocultas[it.i];
          const sg = segs.find((s) => s.i === it.i);
          return (
            <button
              key={it.i}
              type="button"
              className={juntar("neu-area__key", `neu-area__s--${CLASSE_TOM[it.tom]}`, off && "neu-area__key--off")}
              aria-pressed={!off}
              title={off ? `Mostrar ${it.nome}` : `Ocultar ${it.nome}`}
              onMouseEnter={() => {
                if (!off) setAtivo(it.i);
              }}
              onMouseLeave={() => setAtivo(null)}
              onClick={() => {
                const nh = { ...ocultas };
                if (off) delete nh[it.i];
                else if (vis.length > 1) nh[it.i] = true;
                setOcultas(nh);
                setAtivo(null);
              }}
            >
              <i className="neu-area__key-dot" />
              {it.nome}
              {sg ? <span className="neu-donut__key-pct">{pctTxt(sg.pct)}</span> : null}
            </button>
          );
        })}
      </div>
    ) : null;

  const corpo = (
    <div className="neu-area__body">
      <div className="neu-area__focus" tabIndex={0} role="group" aria-label={`${resumo} Use as setas para percorrer as fatias.`} onKeyDown={teclas} onBlur={() => setAtivo(null)}>
        {grafico}
        <div className="sr-only" aria-live="polite">
          {cur ? `${cur.nome}: ${fmt(cur.valor)}, ${pctTxt(cur.pct)}` : ""}
        </div>
      </div>
      {legenda}
    </div>
  );
  if (props.moldura === false) return corpo;
  return (
    <section className={juntar("neu-area", "neu-donut", className)}>
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

const CANAIS: FatiaRosca[] = [
  { nome: "Presencial", valor: 420 },
  { nome: "Online", valor: 310 },
  { nome: "Telefone", valor: 160 },
  { nome: "WhatsApp", valor: 110 },
];

const PORTE: FatiaRosca[] = [
  { nome: "MEI", valor: 5120 },
  { nome: "Microempresa", valor: 3480 },
  { nome: "Pequena empresa", valor: 1240 },
];

/** Os dois gráficos do pacote: atendimentos por canal com rótulos externos e empresas por porte, compacto e sem rótulos */
export default function NeumorfismoRosca() {
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <GraficoRosca titulo="Atendimentos por canal" subtitulo="Outubro de 2026" emblema={{ rotulo: "Mensal" }} dados={CANAIS} rotuloCentro="Atendimentos" altura={300} />
      <div style={{ maxWidth: 380 }}>
        <GraficoRosca titulo="Empresas por porte" subtitulo="Compacto · sem rótulos externos" dados={PORTE} rotulos={false} altura={220} raioExterno={90} raioInterno={62} tons={["azul", "marca", "sucesso"]} rotuloCentro="Empresas" />
      </div>
    </div>
  );
}
