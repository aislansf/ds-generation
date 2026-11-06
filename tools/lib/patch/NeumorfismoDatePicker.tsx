import { useId, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Vitrine do DatePicker no estilo Neumorfismo (componente DatePicker do pacote Neumorphic UI v3.2.0):
 *  - data única: campo afundado (DD/MM/AAAA) com a tecla convexa do calendário, que abre a grade do mês num painel
 *    flutuante; o dia marcado enche com a barra de acento da marca;
 *  - período: painel raso em três zonas separadas por fendas (datas por extenso, dois meses lado a lado e atalhos),
 *    com o miolo do período numa faixa afundada e as pontas como discos acesos.
 * Mês e dia da semana em português. Só é usado quando ESTILO.id === "neumorfismo" (ComponentesPage), dentro do
 * cartão "DatePicker"; as classes neu-date* e neu-range* vêm de src/styles/estilo.css.
 */

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const NOMES_DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

const dois = (n: number) => String(n).padStart(2, "0");
const dia = (a: number, m: number, d: number) => new Date(a, m, d);
const formatar = (d: Date) => `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
const extenso = (d: Date) => `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
const mesmoDia = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime();

export function lerData(s: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return null;
  const d = dia(+m[3], +m[2] - 1, +m[1]);
  return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1 ? d : null;
}

function mascara(s: string) {
  const n = s.replace(/\D/g, "").slice(0, 8);
  return [n.slice(0, 2), n.slice(2, 4), n.slice(4, 8)].filter(Boolean).join("/");
}

/** Semanas do mês: 7 células por linha, com os dias dos meses vizinhos completando a primeira e a última linha. */
function semanas(ano: number, mes: number) {
  const inicio = dia(ano, mes, 1 - dia(ano, mes, 1).getDay());
  const total = Math.ceil((dia(ano, mes, 1).getDay() + dia(ano, mes + 1, 0).getDate()) / 7) * 7;
  const celulas = Array.from({ length: total }, (_, i) => {
    const d = dia(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
    return { d, doMes: d.getMonth() === mes };
  });
  return Array.from({ length: total / 7 }, (_, r) => celulas.slice(r * 7, r * 7 + 7));
}

/* ---------- Data única ---------- */

export function DataUnica({ rotulo, valorInicial, onChange }: { rotulo: string; valorInicial: string; onChange?: (v: string) => void }) {
  const id = useId();
  const [texto, setTexto] = useState(valorInicial);
  const inicial = lerData(valorInicial) ?? dia(2026, 0, 15);
  const [vista, setVista] = useState({ m: inicial.getMonth(), a: inicial.getFullYear() });
  const [aberto, setAberto] = useState(false);
  const escolhida = lerData(texto);

  function passo(n: number) {
    const d = dia(vista.a, vista.m + n, 1);
    setVista({ m: d.getMonth(), a: d.getFullYear() });
  }
  function escolher(d: Date) {
    const v = formatar(d);
    setTexto(v);
    setAberto(false);
    onChange?.(v);
  }

  const linhas = semanas(vista.a, vista.m);
  return (
    <div className="neu-date">
      <label className="neu-label" htmlFor={id}>{rotulo}</label>
      <Popover open={aberto} onOpenChange={setAberto}>
        <div className="neu-field neu-field--plain neu-date__campo">
          <input id={id} inputMode="numeric" placeholder="DD/MM/AAAA" value={texto} onChange={(e) => {
            const v = mascara(e.target.value);
            setTexto(v);
            const d = lerData(v);
            if (d) {
              setVista({ m: d.getMonth(), a: d.getFullYear() });
              onChange?.(v);
            }
          }} />
          <PopoverTrigger asChild>
            <button type="button" className="neu-date__tecla" aria-label="Abrir calendário">
              <Calendar aria-hidden="true" size={16} />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent align="start" sideOffset={8} className="neu-date__pop" role="dialog" aria-label="Calendário">
          <div className="neu-date__head">
            <button type="button" className="neu-mini-btn" aria-label="Mês anterior" onClick={() => passo(-1)}><ChevronLeft aria-hidden="true" size={14} /></button>
            <span aria-live="polite">{`${MESES[vista.m][0].toUpperCase()}${MESES[vista.m].slice(1)} ${vista.a}`}</span>
            <button type="button" className="neu-mini-btn" aria-label="Próximo mês" onClick={() => passo(1)}><ChevronRight aria-hidden="true" size={14} /></button>
          </div>
          <div className="neu-date__grid">
            {DIAS_SEMANA.map((x, i) => <span key={`w${i}`} className="neu-date__dow" aria-hidden="true">{x}</span>)}
            {linhas.flat().map(({ d, doMes }) => doMes ? (
              <button key={d.getTime()} type="button" className="neu-date__day" aria-selected={mesmoDia(escolhida, d)} aria-label={extenso(d)} onClick={() => escolher(d)}>
                {d.getDate()}
              </button>
            ) : <span key={d.getTime()} />)}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ---------- Período ---------- */

/** Mês ou ano do calendário: o mesmo Select do DS (gatilho convexo, menu flutuante, opção marcada com check), em tamanho compacto. */
function SeletorCompacto({ rotulo, valor, opcoes, aoMudar }: { rotulo: string; valor: number; opcoes: { value: number; label: string }[]; aoMudar: (v: number) => void }) {
  return (
    <div className="neu-select neu-select--compacto">
      <Select value={String(valor)} onValueChange={(v) => aoMudar(+v)}>
        <SelectTrigger aria-label={rotulo}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="neu-select__menu neu-select__menu--compacto" sideOffset={6}>
          {opcoes.map((o) => (
            <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface Periodo {
  start: string;
  end: string;
}

export function IntervaloDatas({ rotulo, valorInicial, hoje, onChange }: { rotulo: string; valorInicial: Periodo; hoje?: string; onChange?: (p: Periodo) => void }) {
  const referencia = (hoje && lerData(hoje)) || new Date();
  const hojeD = dia(referencia.getFullYear(), referencia.getMonth(), referencia.getDate());
  const [inicio, setInicio] = useState<Date | null>(lerData(valorInicial.start));
  const [fim, setFim] = useState<Date | null>(lerData(valorInicial.end));
  const [escolhendo, setEscolhendo] = useState(false);
  const [passeio, setPasseio] = useState<Date | null>(null);
  const base = inicio ?? hojeD;
  const [vista, setVista] = useState({ m: base.getMonth(), a: base.getFullYear() });

  const direita = dia(vista.a, vista.m + 1, 1);
  const anos = Array.from({ length: 11 }, (_, i) => hojeD.getFullYear() - 5 + i);

  function emitir(a: Date, b: Date) {
    onChange?.({ start: formatar(a), end: formatar(b) });
  }
  function clicar(d: Date) {
    if (!escolhendo || !inicio) {
      setInicio(d);
      setFim(null);
      setEscolhendo(true);
      return;
    }
    const [a, b] = d < inicio ? [d, inicio] : [inicio, d];
    setInicio(a);
    setFim(b);
    setEscolhendo(false);
    setPasseio(null);
    emitir(a, b);
  }
  function aplicar(a: Date, b: Date) {
    setInicio(a);
    setFim(b);
    setEscolhendo(false);
    setVista({ m: a.getMonth(), a: a.getFullYear() });
    emitir(a, b);
  }

  const semanaInicio = dia(hojeD.getFullYear(), hojeD.getMonth(), hojeD.getDate() - hojeD.getDay());
  const atalhos: { nome: string; a: Date; b: Date }[] = [
    { nome: "Hoje", a: hojeD, b: hojeD },
    { nome: "Ontem", a: dia(hojeD.getFullYear(), hojeD.getMonth(), hojeD.getDate() - 1), b: dia(hojeD.getFullYear(), hojeD.getMonth(), hojeD.getDate() - 1) },
    { nome: "Esta semana", a: semanaInicio, b: dia(semanaInicio.getFullYear(), semanaInicio.getMonth(), semanaInicio.getDate() + 6) },
    { nome: "Semana passada", a: dia(semanaInicio.getFullYear(), semanaInicio.getMonth(), semanaInicio.getDate() - 7), b: dia(semanaInicio.getFullYear(), semanaInicio.getMonth(), semanaInicio.getDate() - 1) },
    { nome: "Este mês", a: dia(hojeD.getFullYear(), hojeD.getMonth(), 1), b: dia(hojeD.getFullYear(), hojeD.getMonth() + 1, 0) },
    { nome: "Mês passado", a: dia(hojeD.getFullYear(), hojeD.getMonth() - 1, 1), b: dia(hojeD.getFullYear(), hojeD.getMonth(), 0) },
  ];

  // Faixa: durante a escolha do fim, a prévia vai do início ao dia sob o mouse
  const extremo = escolhendo ? passeio : fim;
  const [lo, hi] = inicio && extremo ? (extremo < inicio ? [extremo, inicio] : [inicio, extremo]) : [inicio, null];

  /** Chamado como função (não como componente), para os selects não perderem o foco a cada render. */
  function renderMes(a: number, m: number, lado: "esq" | "dir") {
    const linhas = semanas(a, m);
    const mudar = (novoM: number, novoA: number) => {
      const d = lado === "esq" ? dia(novoA, novoM, 1) : dia(novoA, novoM - 1, 1);
      setVista({ m: d.getMonth(), a: d.getFullYear() });
    };
    const passo = (n: number) => {
      const d = dia(vista.a, vista.m + n, 1);
      setVista({ m: d.getMonth(), a: d.getFullYear() });
    };
    return (
      <div className="neu-range__month">
        <div className="neu-range__nav">
          {lado === "esq" ? <button type="button" className="neu-mini-btn" aria-label="Mês anterior" onClick={() => passo(-1)}><ChevronLeft aria-hidden="true" size={14} /></button> : <span />}
          <div className="neu-range__selects">
            <SeletorCompacto rotulo={`Mês (${lado === "esq" ? "primeiro" : "segundo"} calendário)`} valor={m} opcoes={MESES_CURTOS.map((n, i) => ({ value: i, label: n }))} aoMudar={(v) => mudar(v, a)} />
            <SeletorCompacto rotulo={`Ano (${lado === "esq" ? "primeiro" : "segundo"} calendário)`} valor={a} opcoes={anos.map((y) => ({ value: y, label: String(y) }))} aoMudar={(v) => mudar(m, v)} />
          </div>
          {lado === "dir" ? <button type="button" className="neu-mini-btn" aria-label="Próximo mês" onClick={() => passo(1)}><ChevronRight aria-hidden="true" size={14} /></button> : <span />}
        </div>
        <table className="neu-range__grid" role="grid" aria-label={`${MESES[m]} de ${a}`}>
          <thead>
            <tr>{DIAS_SEMANA.map((x, i) => <th key={i} scope="col" abbr={NOMES_DIAS[i]}>{x}</th>)}</tr>
          </thead>
          <tbody>
            {linhas.map((linha, r) => (
              <tr key={r}>
                {linha.map(({ d, doMes }, c) => {
                  const dentro = doMes && !!lo && !!hi && d >= lo && d <= hi;
                  const anteriorDentro = c > 0 && linha[c - 1].doMes && !!lo && !!hi && linha[c - 1].d >= lo && linha[c - 1].d <= hi;
                  const seguinteDentro = c < 6 && linha[c + 1].doMes && !!lo && !!hi && linha[c + 1].d >= lo && linha[c + 1].d <= hi;
                  const ponta = doMes && (mesmoDia(d, lo) || mesmoDia(d, hi));
                  const classeCelula = ["neu-range__cell", dentro ? "neu-range__cell--in" : "", dentro && !anteriorDentro ? "neu-range__cell--rowstart" : "", dentro && !seguinteDentro ? "neu-range__cell--rowend" : ""].filter(Boolean).join(" ");
                  const classeDia = ["neu-range__day", !doMes ? "neu-range__day--out" : "", doMes && mesmoDia(d, hojeD) ? "neu-range__day--today" : "", ponta ? "neu-range__day--edge" : ""].filter(Boolean).join(" ");
                  return (
                    <td key={d.getTime()} className={classeCelula}>
                      {doMes ? (
                        <button type="button" className={classeDia} aria-label={extenso(d)} aria-selected={ponta} aria-current={mesmoDia(d, hojeD) ? "date" : undefined}
                          onClick={() => clicar(d)} onMouseEnter={() => escolhendo && setPasseio(d)}>
                          {d.getDate()}
                        </button>
                      ) : (
                        <span className={classeDia} aria-hidden="true">{d.getDate()}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="neu-range" role="group" aria-label={rotulo}>
      <div className="neu-range__main">
        <div className="neu-range__head">
          <div className="neu-range__date neu-range__campo"><small>Início</small><b>{inicio ? extenso(inicio) : "—"}</b></div>
          <span className="neu-range__arrow" aria-hidden="true"><ArrowRight size={16} /></span>
          <div className={`neu-range__date neu-range__campo${escolhendo ? " neu-range__date--active" : ""}`}><small>Fim</small><b>{fim ? extenso(fim) : "—"}</b></div>
        </div>
        <div className="neu-range__months">
          {renderMes(vista.a, vista.m, "esq")}
          {renderMes(direita.getFullYear(), direita.getMonth(), "dir")}
        </div>
      </div>
      <div className="neu-range__presets">
        {atalhos.map((p) => (
          <button key={p.nome} type="button" className="neu-range__preset" aria-pressed={mesmoDia(p.a, inicio) && mesmoDia(p.b, fim)} onClick={() => aplicar(p.a, p.b)}>
            {p.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function NeumorfismoDatePicker() {
  return (
    <div className="neu-stack" style={{ gap: 32 }}>
      <IntervaloDatas rotulo="Período do relatório" hoje="07/04/2026" valorInicial={{ start: "17/04/2026", end: "11/05/2026" }} />
      <DataUnica rotulo="Data de Início" valorInicial="15/01/2026" />
    </div>
  );
}
