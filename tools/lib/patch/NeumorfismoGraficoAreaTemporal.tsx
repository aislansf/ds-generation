import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { GraficoArea, type LinhaDados } from "@/components/estilo/NeumorfismoGraficoArea";

/**
 * Vitrine do TimeAreaChart no estilo Neumorfismo (componente TimeAreaChart do pacote Neumorphic UI v3.2.0): um gráfico de
 * área sobre um eixo de datas, com filtro de período. É o leito do GraficoArea (grade tracejada, série suave, balão e
 * teclado) num painel convexo, com um cabeçalho, o seletor de período e um número de destaque. O seletor é uma trilha
 * afundada em pílula com 1M · 6M · 1A · No ano · Tudo; o período ativo sobe como uma pílula convexa, em negrito e na cor da
 * marca. É um `radiogroup`: ← → ↑ ↓ Home End andam entre os períodos e já os escolhem, e o nome de cada opção é o período
 * por extenso ("Últimos 6 meses"). O destaque traz o último valor (28px, mono), uma pílula afundada com a variação do
 * primeiro ao último ponto do período e o período com o intervalo de datas ("Último ano · 31/10/2025 – 31/10/2026"); a linha
 * é uma região educada, então trocar o período é anunciado. No eixo, além de dois meses, os rótulos ficam no primeiro dia de
 * cada mês (no começo de cada trimestre, além de um ano), no máximo `maxTicksX` (padrão 7); até dois meses, são dias a
 * intervalos iguais. O formato segue o intervalo: "DD/MM" até dois meses, "Mmm" até cerca de um ano e "Mmm/AA" além disso;
 * o balão sempre traz a data inteira (DD/MM/AAAA). Períodos com mais de `maxPontos` (padrão 120) pontos são amostrados por
 * igual, sempre com o último; os anéis só aparecem até 31 pontos. Os períodos 1M, 6M e 1A contam de trás para a frente a
 * partir da última data (ou de `hoje`); "No ano" parte de 1º de janeiro daquele ano. Entra no cartão "Área com Eixo
 * Temporal e Filtro" do DS (no neumorfismo) e só é usado quando ESTILO.id === "neumorfismo". Os estilos neu-area*,
 * neu-tperiod* e neu-tarea* vêm de src/styles/estilo.css.
 */

export type CodigoPeriodo = "1M" | "3M" | "6M" | "1Y" | "YTD" | "ALL";

export interface OpcaoPeriodo {
  valor: CodigoPeriodo;
  /** O texto curto da pílula */
  rotulo: string;
  /** O nome por extenso, que vira o nome acessível */
  nome: string;
}

/** Os códigos seguem o pacote (1Y, YTD, ALL); as pílulas ficam em português */
export const PERIODOS_PADRAO: OpcaoPeriodo[] = [
  { valor: "1M", rotulo: "1M", nome: "Último mês" },
  { valor: "6M", rotulo: "6M", nome: "Últimos 6 meses" },
  { valor: "1Y", rotulo: "1A", nome: "Último ano" },
  { valor: "YTD", rotulo: "No ano", nome: "Desde 1º de janeiro" },
  { valor: "ALL", rotulo: "Tudo", nome: "Todo o histórico" },
];

const MES3 = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const pad = (n: number) => (n < 10 ? "0" : "") + n;

export function lerData(s: string | Date): Date {
  if (s instanceof Date) return s;
  const [a, m, d] = String(s).slice(0, 10).split("-").map(Number);
  return new Date(a, m - 1, d);
}

export function inicioDoPeriodo(periodo: CodigoPeriodo, fim: Date): Date | null {
  const y = fim.getFullYear();
  const m = fim.getMonth();
  const d = fim.getDate();
  if (periodo === "1M") return new Date(y, m - 1, d);
  if (periodo === "3M") return new Date(y, m - 3, d);
  if (periodo === "6M") return new Date(y, m - 6, d);
  if (periodo === "1Y") return new Date(y - 1, m, d);
  if (periodo === "YTD") return new Date(y, 0, 1);
  return null;
}

/** A variação do primeiro ao último valor, como "+12,3%" ou "−4,0%" (nulo se o primeiro for zero) */
export function variacao(a: number, b: number): string | null {
  if (!a) return null;
  const v = ((b - a) / Math.abs(a)) * 100;
  return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(1).replace(".", ",") + "%";
}

const dataCompleta = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

export interface GraficoAreaTemporalProps {
  /** `{ date: "AAAA-MM-DD" | Date, valor: number }`; `chaveData` e `chaveY` trocam os campos */
  dados: Record<string, string | number | Date>[];
  chaveData?: string;
  chaveY?: string;
  periodoInicial?: CodigoPeriodo;
  /** Controlado: o período escolhido, com `aoMudarPeriodo` */
  periodo?: CodigoPeriodo;
  aoMudarPeriodo?: (valor: CodigoPeriodo) => void;
  periodos?: OpcaoPeriodo[];
  rotuloPeriodos?: string;
  titulo?: string;
  subtitulo?: string;
  nomeSerie?: string;
  formatarValor?: (v: number | string) => string;
  altura?: number;
  minimo?: number;
  curva?: "monotona" | "linear";
  tom?: "marca" | "azul";
  /** Conta os períodos a partir desta data, em vez da última do dado */
  hoje?: string | Date;
  maxTicksX?: number;
  maxPontos?: number;
}

export function GraficoAreaTemporal(props: GraficoAreaTemporalProps) {
  const { dados, chaveData = "date", chaveY = "valor", periodos = PERIODOS_PADRAO, titulo, subtitulo, nomeSerie = "Valor" } = props;
  const [interno, setInterno] = useState<CodigoPeriodo>(props.periodoInicial ?? "1Y");
  const controlado = props.periodo !== undefined;
  const per = controlado ? (props.periodo as CodigoPeriodo) : interno;
  const escolher = (v: CodigoPeriodo) => {
    if (!controlado) setInterno(v);
    props.aoMudarPeriodo?.(v);
  };
  const fmt = props.formatarValor ?? ((v: number | string) => String(v).replace(".", ","));

  const todos = dados.map((d) => ({ linha: d, dia: lerData(d[chaveData] as string | Date) })).sort((a, b) => a.dia.getTime() - b.dia.getTime());
  const fim = props.hoje ? lerData(props.hoje) : todos.length ? todos[todos.length - 1].dia : new Date();
  const inicio = inicioDoPeriodo(per, fim);
  let linhas = todos.filter((d) => d.dia <= fim && (!inicio || d.dia >= inicio));
  const maxPts = props.maxPontos ?? 120;
  if (linhas.length > maxPts) {
    const passo = Math.ceil(linhas.length / maxPts);
    const ultima = linhas[linhas.length - 1];
    linhas = linhas.filter((_, i) => i % passo === 0);
    if (linhas[linhas.length - 1] !== ultima) linhas.push(ultima);
  }
  const intervalo = linhas.length > 1 ? (linhas[linhas.length - 1].dia.getTime() - linhas[0].dia.getTime()) / 864e5 : 0;
  const rotuloX = (i: number) => {
    const d = linhas[i].dia;
    return intervalo <= 62 ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}` : intervalo <= 400 ? MES3[d.getMonth()] : `${MES3[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
  };
  let indices: number[] | undefined;
  if (intervalo > 62) {
    let inicios: number[] = [];
    linhas.forEach((d, i) => {
      if (i === 0 || d.dia.getMonth() !== linhas[i - 1].dia.getMonth()) inicios.push(i);
    });
    if (inicios.length > 1 && inicios[1] - inicios[0] < linhas.length / inicios.length / 2) inicios.shift();
    const mx = props.maxTicksX ?? 7;
    let cada = Math.max(1, Math.ceil(inicios.length / mx));
    if (intervalo > 400) {
      const tri = inicios.filter((i) => linhas[i].dia.getMonth() % 3 === 0);
      if (tri.length >= 3) {
        inicios = tri;
        cada = Math.max(1, Math.ceil(tri.length / mx));
      }
    }
    indices = inicios.filter((_, k) => k % cada === 0);
  }
  const primeira = linhas[0];
  const ultima = linhas[linhas.length - 1];
  const ch = primeira && ultima ? variacao(Number(primeira.linha[chaveY]), Number(ultima.linha[chaveY])) : null;
  const sentido = ch == null ? "flat" : ch.charAt(0) === "+" ? "up" : ch.charAt(0) === "−" ? "down" : "flat";
  const atual = periodos.find((o) => o.valor === per) ?? periodos[0];
  const intervaloTexto = primeira && ultima ? ` · ${dataCompleta(primeira.dia)} – ${dataCompleta(ultima.dia)}` : "";
  const resumo = `${titulo ?? "Gráfico de área"}, ${(atual.nome || atual.rotulo).toLowerCase()}: ${linhas.length} pontos de ${primeira ? dataCompleta(primeira.dia) : ""} a ${ultima ? dataCompleta(ultima.dia) : ""}. ${nomeSerie} atual ${ultima ? fmt(Number(ultima.linha[chaveY])) : "—"}${ch ? `, variação de ${ch} no período` : ""}.`;

  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function teclas(e: KeyboardEvent, i: number) {
    const n = periodos.length;
    let j = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = n - 1;
    else return;
    e.preventDefault();
    escolher(periodos[j].valor);
    refs.current[j]?.focus();
  }

  const altura = props.altura ?? 300;
  // o motor recebe só os campos planos: a data como texto e o valor
  const linhasMotor: LinhaDados[] = linhas.map((d) => ({ [chaveData]: `${d.dia.getFullYear()}-${pad(d.dia.getMonth() + 1)}-${pad(d.dia.getDate())}`, [chaveY]: Number(d.linha[chaveY]) }));

  return (
    <section className="neu-area neu-tarea">
      <div className="neu-tarea__top">
        <div className="neu-tarea__titles">
          {titulo ? <h4 className="neu-area__title">{titulo}</h4> : null}
          {subtitulo ? <p className="neu-area__sub">{subtitulo}</p> : null}
        </div>
        <div className="neu-tperiod" role="radiogroup" aria-label={props.rotuloPeriodos ?? "Período"}>
          {periodos.map((o, i) => {
            const on = o.valor === per;
            return (
              <button
                key={o.valor}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                title={o.nome}
                aria-label={o.nome}
                className={["neu-tperiod__opt", on && "neu-tperiod__opt--on"].filter(Boolean).join(" ")}
                onClick={() => escolher(o.valor)}
                onKeyDown={(e) => teclas(e, i)}
              >
                {o.rotulo}
              </button>
            );
          })}
        </div>
      </div>
      <div className="neu-tarea__kpi" aria-live="polite">
        <span className="neu-tarea__value">{ultima ? fmt(Number(ultima.linha[chaveY])) : "—"}</span>
        {ch ? (
          <span className={`neu-statx__trend neu-statx__trend--${sentido}`} style={{ marginBottom: 0 }}>
            {sentido === "down" ? <TrendingDown aria-hidden="true" size={14} /> : <TrendingUp aria-hidden="true" size={14} />}
            {ch}
            <span className="sr-only"> no período</span>
          </span>
        ) : null}
        <span className="neu-tarea__range">{(atual.nome || "") + intervaloTexto}</span>
      </div>
      {linhas.length ? (
        <GraficoArea
          key={per}
          moldura={false}
          dados={linhasMotor}
          chaveX={chaveData}
          chaveY={chaveY}
          nomeSerie={nomeSerie}
          tom={props.tom}
          altura={altura}
          minimo={props.minimo}
          curva={props.curva}
          formatarValor={props.formatarValor}
          formatarX={(_, i) => rotuloX(i)}
          rotuloTooltip={(_, i) => dataCompleta(linhas[i].dia)}
          maxTicksX={props.maxTicksX ?? 7}
          indicesTicksX={indices}
          resumo={resumo}
        />
      ) : (
        <div className="neu-area__plot neu-tarea__empty" style={{ height: altura }}>
          Sem dados neste período.
        </div>
      )}
    </section>
  );
}

// a série diária de 01/01/2024 a 31/10/2026 do pacote (um passeio aleatório determinístico)
function serieDiaria(): { date: string; valor: number }[] {
  const saida: { date: string; valor: number }[] = [];
  let v = 820;
  let semente = 7;
  const rnd = () => {
    semente = (semente * 9301 + 49297) % 233280;
    return semente / 233280;
  };
  for (const d = new Date(2024, 0, 1); d <= new Date(2026, 9, 31); d.setDate(d.getDate() + 1)) {
    v = Math.max(400, v + (rnd() - 0.47) * 22 + Math.sin((d.getMonth() / 12) * Math.PI * 2) * 2);
    saida.push({ date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, valor: Math.round(v) });
  }
  return saida;
}

const SERIE = serieDiaria();

export default function NeumorfismoAreaTemporal() {
  return <GraficoAreaTemporal titulo="Atendimentos diários" subtitulo="Todas as unidades" nomeSerie="Atendimentos" dados={SERIE} periodoInicial="1Y" formatarValor={(n) => Number(n).toLocaleString("pt-BR")} />;
}
