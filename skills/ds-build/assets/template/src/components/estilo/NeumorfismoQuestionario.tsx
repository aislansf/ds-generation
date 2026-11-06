import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowRight, Check, ChevronLeft, CircleCheck, RotateCw, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Questionnaire no estilo Neumorfismo (componente Questionnaire do pacote Neumorphic UI v3.2.0): um
 * formulário de uma pergunta por vez, com progresso em segmentos, cartões de escolha única (radio) ou múltipla
 * (checkbox) que afundam quando escolhidos, campo "outro" opcional, atalhos por letra, validação de obrigatórias
 * e os botões Voltar, Pular, Avançar e Enviar. A lógica segue a do pacote: ao mudar de pergunta o foco vai ao
 * título; as letras são ignoradas enquanto se digita no campo de texto; ao enviar, mostra a tela de conclusão.
 * O relevo vem de src/styles/estilo.css (classes neu-qn*). Só é usado quando ESTILO.id === "neumorfismo"
 * (ComponentesPage).
 */

export interface EscolhaQuestionario {
  value: string;
  label: string;
  description?: string;
}

export interface PerguntaQuestionario {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
  multiple?: boolean;
  choices: EscolhaQuestionario[];
  input?: { label: string; placeholder: string };
  errorText?: string;
}

type Respostas = Record<string, string | string[] | null>;

interface QuestionarioProps {
  items: PerguntaQuestionario[];
  defaultItem?: string;
  atalhos?: "letters" | "numbers";
  rotuloEnviar?: string;
  onSubmit?: (respostas: Respostas) => void;
}

export function Questionario({ items, defaultItem, atalhos = "letters", rotuloEnviar = "Enviar", onSubmit }: QuestionarioProps) {
  const [passo, setPasso] = useState(Math.max(0, items.findIndex((q) => q.name === defaultItem)));
  const [respostas, setRespostas] = useState<Record<string, string | string[]>>({});
  const [outro, setOutro] = useState<Record<string, string>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [feito, setFeito] = useState(false);
  const uid = useId();
  const titulo = useRef<HTMLLegendElement>(null);
  const primeira = useRef(true);
  const q = items[passo];
  const ultima = passo === items.length - 1;

  // Ao mudar de pergunta o foco vai ao título, para o leitor de tela anunciá-la (não na primeira exibição)
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    titulo.current?.focus();
  }, [passo]);

  const valor = (nome: string): string[] => {
    const v = respostas[nome];
    return Array.isArray(v) ? v : [];
  };

  function escolher(v: string) {
    setErro(null);
    if (q.multiple) {
      const atual = valor(q.name).slice();
      const k = atual.indexOf(v);
      if (k >= 0) atual.splice(k, 1);
      else atual.push(v);
      setRespostas({ ...respostas, [q.name]: atual });
    } else {
      setRespostas({ ...respostas, [q.name]: v });
      const o = { ...outro };
      delete o[q.name];
      setOutro(o);
    }
  }

  function respondida(item: PerguntaQuestionario) {
    const v = respostas[item.name];
    const o = (outro[item.name] ?? "").trim();
    return item.multiple ? (Array.isArray(v) && v.length > 0) || !!o : v != null || !!o;
  }

  function avancar() {
    if (q.required && !respondida(q)) {
      setErro(q.errorText ?? "Escolha uma opção ou descreva outra para continuar.");
      return;
    }
    setErro(null);
    setPasso(Math.min(items.length - 1, passo + 1));
  }

  function resultado(): Respostas {
    const r: Respostas = {};
    items.forEach((it) => {
      const o = (outro[it.name] ?? "").trim();
      const v = respostas[it.name];
      r[it.name] = it.multiple ? (Array.isArray(v) ? v : []).concat(o ? [o] : []) : o || (typeof v === "string" ? v : null);
    });
    return r;
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!ultima) {
      avancar();
      return;
    }
    if (q.required && !respondida(q)) {
      setErro(q.errorText ?? "Escolha uma opção para concluir.");
      return;
    }
    setFeito(true);
    onSubmit?.(resultado());
  }

  function aoTeclar(e: KeyboardEvent) {
    const alvo = e.target as HTMLInputElement;
    if (alvo.tagName === "INPUT" && alvo.type === "text") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toUpperCase();
    const i = atalhos === "numbers" ? parseInt(k, 10) - 1 : k.length === 1 ? k.charCodeAt(0) - 65 : -1;
    if (i >= 0 && i < q.choices.length) {
      e.preventDefault();
      escolher(q.choices[i].value);
    }
  }

  function recomecar() {
    setFeito(false);
    setPasso(0);
    setRespostas({});
    setOutro({});
    setErro(null);
  }

  if (feito) {
    return (
      <div className="neu-qn">
        <div className="neu-qn__done" role="status">
          <div className="neu-qn__done-icone"><CircleCheck aria-hidden="true" size={36} strokeWidth={1.75} /></div>
          <h4 className="neu-qn__done-titulo">Plano salvo</h4>
          <p className="neu-qn__done-texto">Obrigado! Suas respostas foram registradas.</p>
          <Button type="button" onClick={recomecar}><RotateCw aria-hidden="true" size={18} /> Responder de novo</Button>
        </div>
      </div>
    );
  }

  const respondidas = items.filter(respondida).length;
  const chaves = (n: number) => (atalhos === "numbers" ? String(n + 1) : String.fromCharCode(65 + n));

  return (
    <form data-neu="questionario" className="neu-qn" noValidate aria-labelledby={`${uid}-t`} onSubmit={enviar} onKeyDown={aoTeclar}>
      <div className="neu-qn__progress">
        <span className="neu-qn__step">Pergunta {passo + 1} de {items.length}</span>
        <div
          className="neu-qn__segs"
          role="progressbar"
          aria-label="Progresso do questionário"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={respondidas}
          aria-valuetext={`${respondidas} de ${items.length} respondidas`}
        >
          {items.map((it, i) => (
            <span
              key={it.name}
              className={["neu-qn__seg", i < passo && "neu-qn__seg--done", i === passo && "neu-qn__seg--current", respondida(it) && "neu-qn__seg--answered"].filter(Boolean).join(" ")}
            />
          ))}
        </div>
      </div>

      <fieldset key={q.name} className="neu-qn__item" aria-describedby={[q.description ? `${uid}-d` : "", erro ? `${uid}-e` : ""].filter(Boolean).join(" ") || undefined}>
        <legend ref={titulo} id={`${uid}-t`} className="neu-qn__title" tabIndex={-1}>
          {q.title}
          {!q.required && <span className="neu-qn__opt"> (opcional)</span>}
        </legend>
        {q.description && <p className="neu-qn__desc" id={`${uid}-d`}>{q.description}</p>}
        {/* Na múltipla escolha o próprio fieldset (com a legend) já é o grupo; repetir o nome num role="group" faria o leitor de tela lê-lo duas vezes */}
        <div className="neu-qn__choices" role={q.multiple ? undefined : "radiogroup"} aria-label={q.multiple ? undefined : q.title}>
          {q.choices.map((c, i) => {
            const ligada = q.multiple ? valor(q.name).includes(c.value) : respostas[q.name] === c.value;
            return (
              <label key={c.value} className={ligada ? "neu-qn__choice neu-qn__choice--on" : "neu-qn__choice"}>
                <input type={q.multiple ? "checkbox" : "radio"} name={q.name} value={c.value} checked={ligada} onChange={() => escolher(c.value)} className="sr-only neu-qn__native" />
                <span className="neu-qn__key" aria-hidden="true">{chaves(i)}</span>
                <span className="neu-qn__text">
                  <span className="neu-qn__label">{c.label}</span>
                  {c.description && <span className="neu-qn__cdesc">{c.description}</span>}
                </span>
                <span className={q.multiple ? "neu-qn__mark neu-qn__mark--box" : "neu-qn__mark"} aria-hidden="true">
                  {ligada && <Check size={13} strokeWidth={3} />}
                </span>
              </label>
            );
          })}
          {q.input && (
            <div className={(outro[q.name] ?? "").trim() ? "neu-field neu-qn__other neu-qn__other--on" : "neu-field neu-qn__other"}>
              <SquarePen aria-hidden="true" size={15} />
              <input
                type="text"
                aria-label={q.input.label}
                placeholder={q.input.placeholder}
                value={outro[q.name] ?? ""}
                onChange={(e) => {
                  setErro(null);
                  setOutro({ ...outro, [q.name]: e.target.value });
                  if (!q.multiple && e.target.value.trim() && respostas[q.name] != null) {
                    const r = { ...respostas };
                    delete r[q.name];
                    setRespostas(r);
                  }
                }}
              />
            </div>
          )}
        </div>
        {erro && <p className="neu-error-text neu-qn__error" id={`${uid}-e`} role="alert">{erro}</p>}
      </fieldset>

      <div className="neu-qn__actions">
        <Button type="button" variant="ghost" disabled={passo === 0} onClick={() => { setErro(null); setPasso(passo - 1); }}>
          <ChevronLeft aria-hidden="true" size={18} /> Voltar
        </Button>
        <span className="neu-qn__spacer" />
        {!q.required && !ultima && (
          <Button type="button" variant="ghost" onClick={() => { setErro(null); setPasso(passo + 1); }}>Pular</Button>
        )}
        {ultima ? (
          <Button type="submit"><Check aria-hidden="true" size={18} /> {rotuloEnviar}</Button>
        ) : (
          <Button type="button" onClick={avancar}>Avançar <ArrowRight aria-hidden="true" size={18} /></Button>
        )}
      </div>

      <p className="neu-help neu-qn__hint">
        Atalho: pressione <kbd className="neu-kbd">{atalhos === "numbers" ? "1" : "A"}</kbd>–<kbd className="neu-kbd">{atalhos === "numbers" ? q.choices.length : String.fromCharCode(64 + q.choices.length)}</kbd> para escolher.
      </p>
    </form>
  );
}

const PERGUNTAS: PerguntaQuestionario[] = [
  {
    name: "direction",
    required: true,
    title: "O que o assistente deve construir a seguir?",
    description: "Escolha uma direção ou descreva outra tarefa.",
    choices: [
      { value: "tool-calls", label: "Linha do tempo de ferramentas", description: "Mostra o que o assistente executou e o que voltou." },
      { value: "approvals", label: "Pontos de aprovação", description: "Pede confirmação antes de ações sensíveis ou destrutivas." },
      { value: "handoffs", label: "Repasses entre subagentes", description: "Facilita acompanhar o trabalho delegado e os resultados." },
    ],
    input: { label: "Outro recurso do assistente", placeholder: "Descreva outro recurso…" },
  },
  {
    name: "signals",
    multiple: true,
    required: false,
    title: "O que toda atualização de progresso deve incluir?",
    description: "Marque todas as que se aplicam, ou pule esta pergunta.",
    choices: [
      { value: "progress", label: "Progresso" },
      { value: "decisions", label: "Decisões" },
      { value: "risks", label: "Riscos" },
      { value: "next-step", label: "Próximo passo" },
    ],
  },
  {
    name: "timing",
    required: true,
    title: "Quando o trabalho deve começar?",
    description: "Escolha quando o assistente deve iniciar.",
    choices: [
      { value: "now", label: "Começar agora" },
      { value: "next-cycle", label: "Próximo ciclo de desenvolvimento" },
      { value: "backlog", label: "Adicionar ao backlog" },
    ],
  },
];

export default function NeumorfismoQuestionario() {
  return (
    <ComponentPreview
      title="Questionário"
      description="Uma pergunta por vez, com progresso em segmentos e cartões de escolha que afundam quando escolhidos. Aceita escolha única ou múltipla, um campo para outra resposta, perguntas opcionais e atalhos pelo teclado."
      whenToUse={["Coletar várias respostas curtas guiando a pessoa passo a passo (triagem, preferências, onboarding)", "Perguntas com opções claras, em que um atalho de teclado agiliza a resposta"]}
      whenNotToUse={["Formulários longos com muitos campos livres: use campos de texto numa só página", "Uma única escolha simples: use o radio ou o controle segmentado"]}
      accessibility={["Cada pergunta é um fieldset com legend; as opções são radios ou checkboxes nativos", "Ao avançar, o foco vai ao título da pergunta, que o leitor de tela anuncia", "Obrigatórias bloqueiam o avanço com um alerta; opcionais mostram \"(opcional)\" e o botão Pular", "A barra de progresso lê \"2 de 3 respondidas\"; as letras de atalho são ignoradas ao digitar no campo de texto"]}
      code={`<Questionario
  items={perguntas}
  defaultItem="direction"
  rotuloEnviar="Salvar plano"
  onSubmit={(respostas) => salvar(respostas)}
/>`}
    >
      <Questionario items={PERGUNTAS} defaultItem="direction" rotuloEnviar="Salvar plano" />
    </ComponentPreview>
  );
}
