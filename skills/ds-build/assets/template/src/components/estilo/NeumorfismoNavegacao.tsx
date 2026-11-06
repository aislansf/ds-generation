import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Vitrines de navegação do estilo Neumorfismo (markup do pacote Neumorphic UI v3.2.0): abas em quatro
 * variantes (padrão, linha, segmentada e card), acordeão em cartões separados ou agrupado, e etapas
 * horizontais e verticais. Só são usadas quando ESTILO.id === "neumorfismo" (ComponentesPage); a camada
 * src/styles/estilo.css dá o relevo, as trilhas afundadas e o brilho. O atributo data-neu tira estes
 * blocos das regras genéricas de [role="tab"], [role="tabpanel"] e button[aria-expanded] dessa camada.
 */

/* ---------- Abas ---------- */

type VarianteAbas = "padrao" | "line" | "segmented" | "card";

interface Aba {
  value: string;
  label: string;
  content: ReactNode;
}

export function Abas({ abas, variante = "padrao", valorInicial, rotulo }: { abas: Aba[]; variante?: VarianteAbas; valorInicial?: string; rotulo: string }) {
  const [atual, setAtual] = useState(valorInicial ?? abas[0].value);
  const uid = useId();
  const lista = useRef<HTMLDivElement>(null);
  const aba = abas.find((a) => a.value === atual) ?? abas[0];

  function aoTeclar(e: KeyboardEvent) {
    const i = abas.indexOf(aba);
    const n = abas.length;
    const proxima = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (proxima === null) return;
    e.preventDefault();
    setAtual(abas[proxima].value);
    lista.current?.querySelectorAll<HTMLElement>('[role="tab"]')[proxima]?.focus();
  }

  return (
    <div data-neu="abas" className={`neu-tabs${variante === "padrao" ? "" : ` neu-tabs--${variante}`}`}>
      <div ref={lista} role="tablist" aria-label={rotulo} className="neu-tabs__list" onKeyDown={aoTeclar}>
        {abas.map((a) => {
          const ligada = a.value === aba.value;
          return (
            <button
              key={a.value}
              id={`${uid}-t-${a.value}`}
              type="button"
              role="tab"
              className="neu-tab"
              aria-selected={ligada}
              aria-controls={`${uid}-p`}
              tabIndex={ligada ? 0 : -1}
              onClick={() => setAtual(a.value)}
            >
              {a.label}
            </button>
          );
        })}
      </div>
      <div key={aba.value} id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t-${aba.value}`} tabIndex={0} className="neu-tabs__panel">
        {aba.content}
      </div>
    </div>
  );
}

function PainelAba({ titulo, tom, texto, rotulo, valor, tipo }: { titulo: string; tom: "success" | "royal" | "warning"; texto: string; rotulo: string; valor: string; tipo?: "mono" | "success" }) {
  return (
    <div className="neu-tpanel">
      <h4 className="neu-tpanel__head">
        {titulo}
        <span aria-hidden="true" className={`neu-dot neu-dot--${tom}`} />
      </h4>
      <p className="neu-tpanel__text">{texto}</p>
      <div className="neu-tpanel__stat">
        <span className="neu-tpanel__label">{rotulo}</span>
        <span className={`neu-tpanel__value${tipo ? ` neu-tpanel__value--${tipo}` : ""}`}>{valor}</span>
      </div>
    </div>
  );
}

export function NeumorfismoTabs() {
  return (
    <div className="neu-stack">
      <Abas
        rotulo="Abas padrão"
        abas={[
          { value: "v", label: "Visão geral", content: "Visão geral do programa com indicadores principais e resumo executivo." },
          { value: "d", label: "Detalhes", content: "Detalhamento por município e consultor." },
          { value: "h", label: "Histórico", content: "Linha do tempo de atendimentos." },
        ]}
      />
      <Abas
        variante="line"
        rotulo="Abas em linha"
        abas={[
          { value: "v", label: "Visão geral", content: "Visão geral do programa com indicadores principais e resumo executivo." },
          { value: "d", label: "Detalhes", content: "Detalhes técnicos, cronograma de execução e lista de responsáveis." },
          { value: "h", label: "Histórico", content: "Histórico de alterações, datas e registros de auditoria." },
        ]}
      />
      <Abas
        variante="segmented"
        rotulo="Abas segmentadas"
        abas={[
          { value: "v", label: "Visão geral", content: "Resumo executivo: 184 cidades · 4.890 MEIs." },
          { value: "d", label: "Detalhes", content: "Detalhes" },
          { value: "h", label: "Histórico", content: "Histórico" },
        ]}
      />
      <section className="neu-tabs-card-demo">
        <div className="neu-tabs-card-demo__head">
          <h3>Card com abas integradas</h3>
          <span className="neu-tabs-card-demo__tag">INTEGRADO</span>
        </div>
        <p>Cabeçalho comutável em relevo suave com painel tátil embutido.</p>
        <Abas
          variante="card"
          valorInicial="d"
          rotulo="Abas integradas ao card"
          abas={[
            { value: "v", label: "Visão geral", content: <PainelAba titulo="Visão geral estratégica" tom="success" texto="Acompanhamento consolidado das metas do programa, com indicadores de alcance e efetividade atualizados no último ciclo." rotulo="Taxa de efetividade" valor="96,8%" tipo="success" /> },
            { value: "d", label: "Detalhes", content: <PainelAba titulo="Detalhes operacionais" tom="royal" texto="Escopo de execução, responsáveis e cronograma das entregas previstas para o trimestre." rotulo="Responsável técnico" valor="Gerência de Atendimento" /> },
            { value: "h", label: "Histórico", content: <PainelAba titulo="Histórico e versões" tom="warning" texto="Registro das revisões aprovadas, com data, sessão de homologação e alterações aplicadas." rotulo="Última homologação" valor="Sessão #419" tipo="mono" /> },
          ]}
        />
      </section>
    </div>
  );
}

/* ---------- Acordeão ---------- */

interface ItemAcordeao {
  title: string;
  content: string;
}

export function Acordeao({ itens, agrupado = false }: { itens: ItemAcordeao[]; agrupado?: boolean }) {
  const [aberto, setAberto] = useState<number>(0);
  const uid = useId();

  if (agrupado) {
    return (
      <div data-neu="acordeao" className="neu-accordion-g">
        {itens.map((it, i) => {
          const on = aberto === i;
          return (
            <div key={it.title} className="neu-accordion-g__item" data-open={on}>
              <button type="button" id={`${uid}-b${i}`} className="neu-accordion-g__trigger" aria-expanded={on} aria-controls={`${uid}-p${i}`} onClick={() => setAberto(on ? -1 : i)}>
                <span>{it.title}</span>
                <ChevronDown aria-hidden="true" className="neu-accordion__chev" size={16} />
              </button>
              {on && (
                <div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className="neu-accordion-g__panel">
                  {it.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div data-neu="acordeao" className="neu-accordion">
      {itens.map((it, i) => {
        const on = aberto === i;
        return (
          <div key={it.title} className="neu-accordion__item" data-open={on}>
            <button type="button" id={`${uid}-b${i}`} className="neu-accordion__trigger" aria-expanded={on} aria-controls={`${uid}-p${i}`} onClick={() => setAberto(on ? -1 : i)}>
              <span>{it.title}</span>
              <ChevronDown aria-hidden="true" className="neu-accordion__chev" size={16} />
            </button>
            {on && (
              <div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className="neu-accordion__panel">
                <p>{it.content}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const ITENS_ACORDEAO: ItemAcordeao[] = [
  { title: "O que é o __BRAND_SHORT__?", content: "O __BRAND_SHORT__ é uma instituição que oferece serviços, capacitação e atendimento ao seu público por canais digitais e presenciais." },
  { title: "Como o __BRAND_SHORT__ apoia o meu negócio?", content: "Por meio de cursos, consultorias, eventos, programas de inovação e orientação para formalização, acesso a crédito e novos mercados." },
  { title: "Quais programas e soluções estão disponíveis?", content: "Educação empreendedora, transformação digital, sustentabilidade e liderança, entre outras soluções para pequenos negócios." },
];

export function NeumorfismoAccordion() {
  return (
    <div className="neu-stack">
      <Acordeao itens={ITENS_ACORDEAO} />
      <Acordeao itens={ITENS_ACORDEAO} agrupado />
    </div>
  );
}

/* ---------- Etapas ---------- */

interface Etapa {
  label: string;
  hint?: string;
  meta?: string;
  description?: string;
  content?: ReactNode;
}

function estadoDe(i: number, atual: number) {
  return i < atual ? "done" : i === atual ? "current" : "todo";
}

export function EtapasHorizontais({ etapas, atual }: { etapas: Etapa[]; atual: number }) {
  const pct = etapas.length > 1 ? (atual / (etapas.length - 1)) * 100 : 0;
  return (
    <nav data-neu="etapas" className="neu-stepper" aria-label="Etapas do formulário">
      <div className="neu-stepper__rail">
        <div style={{ width: `${pct}%` }} />
      </div>
      <ol>
        {etapas.map((e, i) => {
          const estado = estadoDe(i, atual);
          return (
            <li key={e.label} className={`neu-step--${estado}`} aria-current={estado === "current" ? "step" : undefined}>
              <span className="neu-step__dot">{estado === "done" ? <Check aria-hidden="true" size={16} strokeWidth={3} /> : i + 1}</span>
              <span className="neu-step__label">{e.label}</span>
              {e.hint && <span className="neu-step__hint">{e.hint}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function EtapasVerticais({ etapas, atual, compacto = false, rotulo }: { etapas: Etapa[]; atual: number; compacto?: boolean; rotulo: string }) {
  return (
    <nav data-neu="etapas" className={`neu-stepv${compacto ? " neu-stepv--compact" : ""}`} aria-label={rotulo}>
      <ol>
        {etapas.map((e, i) => {
          const estado = estadoDe(i, atual);
          const ultima = i === etapas.length - 1;
          const palavra = estado === "done" ? "Concluída" : estado === "current" ? "Em andamento" : "Pendente";
          return (
            <li key={e.label} className={`neu-stepv__item neu-stepv--${estado}`} aria-current={estado === "current" ? "step" : undefined}>
              <div className="neu-stepv__marker" aria-hidden="true">
                <span className="neu-stepv__dot">{estado === "done" ? <Check size={16} strokeWidth={3} /> : i + 1}</span>
                {!ultima && (
                  <span className="neu-stepv__line">
                    <span className="neu-stepv__fill" />
                  </span>
                )}
              </div>
              <div className="neu-stepv__body">
                <div className="neu-stepv__head">
                  <span className="neu-stepv__label">{e.label}</span>
                  {e.meta && <span className="neu-stepv__meta">{e.meta}</span>}
                </div>
                <span className="neu-stepv__state">
                  <span className="sr-only">{`Etapa ${i + 1} de ${etapas.length}: `}</span>
                  {e.hint ? `${e.hint} · ` : ""}
                  {palavra}
                </span>
                {e.description && <p className="neu-stepv__desc">{e.description}</p>}
                {estado === "current" && e.content && <div className="neu-stepv__content">{e.content}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const ETAPAS_BASICAS: Etapa[] = [
  { label: "Dados básicos", hint: "Informações" },
  { label: "Documentação", hint: "Upload" },
  { label: "Revisão", hint: "Conferência" },
  { label: "Confirmação", hint: "Envio" },
];

const ETAPAS_VERTICAIS: Etapa[] = [
  { label: "Dados básicos", meta: "28/10/2026", description: "Razão social, CNPJ, porte e contato do responsável." },
  { label: "Documentação", meta: "30/10/2026", description: "Contrato social e comprovante de endereço enviados." },
  {
    label: "Revisão",
    hint: "Conferência",
    description: "O consultor confere os dados antes do envio.",
    content: (
      <div className="neu-stepv__action">
        <span>2 pendências para resolver</span>
        <Button size="sm" type="button">
          Continuar revisão <ArrowRight aria-hidden="true" size={14} />
        </Button>
      </div>
    ),
  },
  { label: "Confirmação", hint: "Envio", description: "Assinatura e protocolo de inscrição." },
];

export function NeumorfismoSteps() {
  const [atual, setAtual] = useState(1);
  return (
    <div className="neu-stack">
      <EtapasHorizontais etapas={ETAPAS_BASICAS} atual={atual} />
      <div className="neu-stepper-nav">
        <Button variant="outline" type="button" onClick={() => setAtual(Math.max(0, atual - 1))} disabled={atual === 0}>
          <ArrowLeft aria-hidden="true" size={14} /> Voltar
        </Button>
        <span>Etapa {atual + 1} de {ETAPAS_BASICAS.length}</span>
        <Button type="button" onClick={() => setAtual(Math.min(ETAPAS_BASICAS.length - 1, atual + 1))} disabled={atual === ETAPAS_BASICAS.length - 1}>
          {atual === ETAPAS_BASICAS.length - 1 ? "Concluir" : "Próxima etapa"} <ArrowRight aria-hidden="true" size={14} />
        </Button>
      </div>
      <div className="neu-stepper-demo">
        <EtapasVerticais etapas={ETAPAS_VERTICAIS} atual={2} rotulo="Etapas da inscrição" />
        <div className="neu-stepper-demo__flat">
          <EtapasVerticais etapas={ETAPAS_BASICAS} atual={1} compacto rotulo="Etapas compactas" />
        </div>
      </div>
    </div>
  );
}
