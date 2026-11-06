import { Children, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pause, Play } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import { Selo } from "@/components/estilo/NeumorfismoBadges";

/**
 * Vitrine do Carousel no estilo Neumorfismo (componente Carousel do pacote Neumorphic UI v3.2.0): uma fileira
 * de slides num poço afundado, movida um passo por vez por teclas redondas convexas, por arrasto (mouse ou
 * toque) ou pelo teclado. Uma trilha afundada de pontos mostra a posição (o ponto ativo estica numa pílula na
 * cor da marca) e um contador opcional diz "2 de 5". Nas pontas, sem loop, a tecla afunda e fica desativada.
 * Vários slides por vista (número ou mapa largura→quantidade, medido no contêiner), vertical, loop e rotação
 * automática (5 s; pausa com o mouse, com o foco dentro e durante o arrasto; nunca começa com "menos movimento";
 * vem sempre com a tecla de pausa). Acessibilidade: section com aria-roledescription="carrossel"; cada item é
 * um grupo "slide" com nome "n de N"; o que está fora da vista fica aria-hidden e inert, então o Tab nunca cai
 * em conteúdo escondido; setas (cima e baixo no vertical), Home e End valem com o foco em qualquer ponto do
 * carrossel (menos em campos de texto); um aviso educado diz "Slide 3 de 5" (mudo durante a rotação automática).
 * Entra numa seção nova do neumorfismo ("Carousel", depois do HoverCard) e só é usado quando ESTILO.id ===
 * "neumorfismo". As classes neu-carousel* vêm de src/styles/estilo.css; o contêiner usa container query para
 * levar as teclas para baixo do poço quando o carrossel tem 340px ou menos.
 */

type PorVista = number | Record<number, number>;

interface CarrosselProps {
  /** Nome acessível da região */
  rotulo?: string;
  children: ReactNode;
  porVista?: PorVista;
  /** Posições andadas por passo (no máximo `porVista`) */
  passo?: number;
  /** Espaço entre os slides, em px */
  espaco?: number;
  orientacao?: "horizontal" | "vertical";
  /** Altura do poço no vertical, em px */
  altura?: number;
  loop?: boolean;
  /** true = 5 s; ou o intervalo em milissegundos */
  autoplay?: boolean | number;
  mostrarPontos?: boolean;
  mostrarContador?: boolean;
  indice?: number;
  indiceInicial?: number;
  aoMudar?: (indice: number) => void;
  larguraMax?: number;
}

const INERTE = { inert: "" } as Record<string, string>;

function reduzMovimento() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Carrossel({
  rotulo = "Carrossel",
  children,
  porVista = 1,
  passo: passoPedido = 1,
  espaco = 16,
  orientacao = "horizontal",
  altura = 320,
  loop = false,
  autoplay = false,
  mostrarPontos = true,
  mostrarContador = false,
  indice,
  indiceInicial = 0,
  aoMudar,
  larguraMax,
}: CarrosselProps) {
  const slides = Children.toArray(children).filter(Boolean);
  const total = slides.length;
  const vertical = orientacao === "vertical";
  const raiz = useRef<HTMLElement>(null);
  const janela = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(0);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const medir = () => setLargura(el.getBoundingClientRect().width);
    medir();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", medir);
      return () => window.removeEventListener("resize", medir);
    }
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let pv = typeof porVista === "number" ? porVista : 1;
  if (typeof porVista === "object") {
    let melhor = -1;
    for (const [k, n] of Object.entries(porVista)) {
      if (Number(k) <= largura && Number(k) > melhor) {
        melhor = Number(k);
        pv = n;
      }
    }
  }
  pv = Math.max(1, Math.min(pv, total || 1));
  const passo = Math.max(1, Math.min(passoPedido, pv));
  const maxIndice = Math.max(0, total - pv);

  const [interno, setInterno] = useState(indiceInicial);
  const bruto = indice ?? interno;
  const atual = Math.min(Math.max(0, bruto), maxIndice);
  const [arrasto, setArrasto] = useState<{ inicio: number; d: number; id: number } | null>(null);
  const [sobre, setSobre] = useState(false);
  const [focoDentro, setFocoDentro] = useState(false);
  const [tocando, setTocando] = useState(() => !!autoplay && !reduzMovimento());
  const moveu = useRef(false);

  function ir(i: number) {
    const n = Math.min(Math.max(0, i), maxIndice);
    if (n === atual) return;
    if (indice === undefined) setInterno(n);
    aoMudar?.(n);
  }
  function proximo() {
    if (atual >= maxIndice) {
      if (loop) ir(0);
    } else ir(atual + passo);
  }
  function anterior() {
    if (atual <= 0) {
      if (loop) ir(maxIndice);
    } else ir(atual - passo);
  }
  const podeVoltar = loop ? maxIndice > 0 : atual > 0;
  const podeAvancar = loop ? maxIndice > 0 : atual < maxIndice;
  const pausado = !tocando || sobre || focoDentro || !!arrasto;

  const proximoRef = useRef(proximo);
  proximoRef.current = proximo;
  useEffect(() => {
    if (!autoplay || pausado || maxIndice === 0) return;
    const t = setInterval(() => proximoRef.current(), typeof autoplay === "number" ? autoplay : 5000);
    return () => clearInterval(t);
  }, [autoplay, pausado, maxIndice, atual]);

  function aoTeclar(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    const volta = vertical ? "ArrowUp" : "ArrowLeft";
    const avanca = vertical ? "ArrowDown" : "ArrowRight";
    if (e.key === volta) {
      e.preventDefault();
      anterior();
    } else if (e.key === avanca) {
      e.preventDefault();
      proximo();
    } else if (e.key === "Home") {
      e.preventDefault();
      ir(0);
    } else if (e.key === "End") {
      e.preventDefault();
      ir(maxIndice);
    }
  }

  function aoPressionar(e: PointerEvent) {
    if (e.button !== 0 || maxIndice === 0) return;
    moveu.current = false;
    setArrasto({ inicio: vertical ? e.clientY : e.clientX, d: 0, id: e.pointerId });
  }
  function aoMover(e: PointerEvent) {
    if (!arrasto || e.pointerId !== arrasto.id) return;
    let d = (vertical ? e.clientY : e.clientX) - arrasto.inicio;
    if (!moveu.current && Math.abs(d) > 6) {
      moveu.current = true;
      try {
        janela.current?.setPointerCapture(e.pointerId);
      } catch {
        /* sem captura: o arrasto segue pelo próprio elemento */
      }
    }
    if (moveu.current) {
      if ((!podeVoltar && d > 0) || (!podeAvancar && d < 0)) d = d / 3;
      setArrasto({ inicio: arrasto.inicio, d, id: arrasto.id });
    }
  }
  function aoSoltar() {
    if (!arrasto) return;
    const d = arrasto.d;
    const medida = janela.current ? (vertical ? janela.current.clientHeight : janela.current.clientWidth) / pv : 200;
    setArrasto(null);
    if (Math.abs(d) > Math.min(60, medida * 0.2)) {
      if (d < 0) proximo();
      else anterior();
    }
  }

  const alturaPoco = vertical ? altura : 0;
  const alturaItem = vertical ? (alturaPoco - 24 - (pv - 1) * espaco) / pv : 0;
  const deslocamento = vertical
    ? `${-atual * (alturaItem + espaco) + (arrasto ? arrasto.d : 0)}px`
    : `calc(${-atual} * (100% + ${espaco}px) / ${pv} + ${arrasto ? arrasto.d : 0}px)`;
  const trilha: CSSProperties = {
    gap: espaco,
    transform: vertical ? `translate3d(0, ${deslocamento}, 0)` : `translate3d(${deslocamento}, 0, 0)`,
    transition: arrasto ? "none" : undefined,
  };
  const base = `calc((100% - ${(pv - 1) * espaco}px) / ${pv})`;

  const pontos =
    mostrarPontos && maxIndice > 0 ? (
      <div className="neu-carousel__dots" role="group" aria-label="Escolher slide">
        {Array.from({ length: maxIndice + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className="neu-carousel__dot"
            aria-label={pv > 1 ? `Ir para os slides ${i + 1} a ${i + pv}` : `Ir para o slide ${i + 1}`}
            aria-current={i === atual ? "true" : undefined}
            onClick={() => ir(i)}
          />
        ))}
      </div>
    ) : null;

  const IconeVolta = vertical ? ChevronUp : ChevronLeft;
  const IconeAvanca = vertical ? ChevronDown : ChevronRight;
  const contador = mostrarContador ? <span className="neu-carousel__counter">{`${pv > 1 ? `${atual + 1}–${atual + pv}` : atual + 1} de ${total}`}</span> : null;
  const tecla = autoplay ? (
    <button
      type="button"
      className="neu-carousel__play"
      aria-label={tocando ? "Pausar rotação automática" : "Iniciar rotação automática"}
      title={tocando ? "Pausar" : "Reproduzir"}
      aria-pressed={!tocando}
      onClick={() => setTocando(!tocando)}
    >
      {tocando ? <Pause aria-hidden="true" size={14} /> : <Play aria-hidden="true" size={14} />}
    </button>
  ) : null;

  return (
    <section
      ref={raiz}
      className={`neu-carousel${vertical ? " neu-carousel--vertical" : ""}`}
      style={{ maxWidth: larguraMax }}
      aria-roledescription="carrossel"
      aria-label={rotulo}
      onKeyDown={aoTeclar}
      onMouseEnter={() => setSobre(true)}
      onMouseLeave={() => setSobre(false)}
      onFocus={() => setFocoDentro(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocoDentro(false);
      }}
    >
      <div className="neu-carousel__frame">
        <button type="button" className="neu-carousel__nav neu-carousel__nav--prev" aria-label="Slide anterior" title="Slide anterior" disabled={!podeVoltar} onClick={anterior}>
          <IconeVolta aria-hidden="true" size={18} />
        </button>
        <div
          ref={janela}
          className="neu-carousel__viewport"
          style={vertical ? { height: alturaPoco } : undefined}
          onPointerDown={aoPressionar}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerCancel={aoSoltar}
          onClickCapture={(e) => {
            if (moveu.current) {
              e.preventDefault();
              e.stopPropagation();
              moveu.current = false;
            }
          }}
        >
          <div className="neu-carousel__track" style={trilha}>
            {slides.map((s, i) => {
              const visivel = i >= atual && i < atual + pv;
              return (
                <div
                  key={(s as { key?: string | number }).key ?? i}
                  className="neu-carousel__item"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} de ${total}`}
                  aria-hidden={visivel ? undefined : "true"}
                  {...(visivel ? {} : INERTE)}
                  style={vertical ? { height: alturaItem } : { flexBasis: base }}
                >
                  {s}
                </div>
              );
            })}
          </div>
        </div>
        <button type="button" className="neu-carousel__nav neu-carousel__nav--next" aria-label="Próximo slide" title="Próximo slide" disabled={!podeAvancar} onClick={proximo}>
          <IconeAvanca aria-hidden="true" size={18} />
        </button>
      </div>
      {(pontos || contador || tecla) && (
        <div className="neu-carousel__bar">
          {tecla}
          {pontos}
          {contador}
        </div>
      )}
      <span className="sr-only" aria-live={autoplay && !pausado ? "off" : "polite"} aria-atomic="true">
        {pv > 1 ? `Slides ${atual + 1} a ${atual + pv} de ${total}` : `Slide ${atual + 1} de ${total}`}
      </span>
    </section>
  );
}

/* ---------- Vitrine ---------- */

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

function numeros(n: number, tamanho: number) {
  return Array.from({ length: n }).map((_, i) => (
    <div key={i} className="neu-carousel__slide" style={{ fontSize: tamanho }}>
      {i + 1}
    </div>
  ));
}

const DESTAQUES = [
  { tag: "Curso", tom: "accent", titulo: "Gestão financeira para pequenos negócios", texto: "Turma nova com aulas ao vivo às terças e quintas.", meta: "Inscrições até 20/11" },
  { tag: "Evento", tom: "royal", titulo: "Feira de negócios regional", texto: "Mais de 120 expositores e rodadas de negócio.", meta: "14 a 16 de março" },
  { tag: "Crédito", tom: "success", titulo: "Linha de crédito com taxa reduzida", texto: "Orientação gratuita para montar a proposta.", meta: "Atendimento online" },
  { tag: "Serviço", tom: "neutral", titulo: "Atendimento estendido aos sábados", texto: "Unidades da capital abertas das 8h às 13h.", meta: "A partir de dezembro" },
] as const;

const AGENDA = [
  ["09:00", "Ana Ribeiro", "Consultoria"],
  ["10:30", "Bruno Lima", "Crédito"],
  ["13:00", "Carla Souza", "Abertura de empresa"],
  ["14:30", "Diego Martins", "Marketing"],
  ["16:00", "Elisa Rocha", "Consultoria"],
] as const;

export default function NeumorfismoCarrossel() {
  const [destaque, setDestaque] = useState(0);
  return (
    <ComponentPreview
      title="Carousel"
      description="Fileira de slides num poço afundado, movida por teclas redondas, arrasto ou teclado. Os pontos mostram a posição; o ponto ativo estica numa pílula luminosa."
      whenToUse={["Conteúdos de mesmo peso: destaques, galerias, a agenda do dia", "Quando o espaço é curto e os itens se comparam pouco entre si"]}
      whenNotToUse={["Informação crítica em slides adiante: ela precisa estar visível", "Rotação automática em formulários ou textos longos"]}
      accessibility={[
        "section com aria-roledescription=\"carrossel\"; cada slide é um grupo com nome \"n de N\"",
        "Slides fora da vista ficam aria-hidden e inert: o Tab nunca cai em conteúdo escondido",
        "Setas (cima e baixo no vertical), Home e End valem com o foco dentro do carrossel, menos em campos de texto",
        "Um aviso educado anuncia \"Slide 3 de 5\"; durante a rotação automática ele fica mudo",
        "A rotação automática pausa com o mouse, com o foco dentro e no arrasto, nunca começa com \"menos movimento\" e vem com a tecla de pausa",
        "Os pontos têm nome (\"Ir para o slide n\"); as teclas das pontas ficam desativadas",
      ]}
      code={`<Carrossel rotulo="Números" larguraMax={360}>{slides}</Carrossel>

<Carrossel rotulo="Em grade" larguraMax={480} porVista={{ 0: 1, 260: 2, 400: 3 }}>{slides}</Carrossel>

<Carrossel rotulo="Destaques do mês" larguraMax={560} loop autoplay={6000} mostrarContador indice={i} aoMudar={setI}>
  {destaques.map((d) => <article className="neu-carousel__card">…</article>)}
</Carrossel>

<Carrossel rotulo="Agenda do dia" orientacao="vertical" porVista={2} altura={220} larguraMax={360} mostrarPontos={false} mostrarContador espaco={12}>
  {agenda}
</Carrossel>`}
    >
      <div className="neu-stack" style={{ gap: 40 }}>
        <div>
          <Legenda>Básico — um slide por vez</Legenda>
          <Carrossel rotulo="Números" larguraMax={360}>{numeros(5, 40)}</Carrossel>
        </div>
        <div>
          <Legenda>Vários por vista — 1 / 2 / 3 conforme a largura</Legenda>
          <Carrossel rotulo="Números em grade" larguraMax={480} porVista={{ 0: 1, 260: 2, 400: 3 }}>{numeros(5, 30)}</Carrossel>
        </div>
        <div>
          <Legenda>Destaques — loop, rotação automática e contador</Legenda>
          <Carrossel rotulo="Destaques do mês" larguraMax={560} loop autoplay={6000} mostrarContador indice={destaque} aoMudar={setDestaque}>
            {DESTAQUES.map((d) => (
              <article key={d.titulo} className="neu-carousel__card">
                <div className="neu-carousel__card-head">
                  <h5 className="neu-carousel__card-title">{d.titulo}</h5>
                  <Selo tom={d.tom} tamanho="sm">{d.tag}</Selo>
                </div>
                <p className="neu-carousel__card-text">{d.texto}</p>
                <p className="neu-help" style={{ margin: "12px 0 0" }}>{d.meta}</p>
              </article>
            ))}
          </Carrossel>
          <p className="neu-help" style={{ margin: "10px 0 0", textAlign: "center", maxWidth: 560 }}>
            Arraste, use as setas do teclado ou os pontos. A rotação pausa ao passar o mouse ou focar.
          </p>
        </div>
        <div>
          <Legenda>Vertical — agenda do dia</Legenda>
          <Carrossel rotulo="Agenda do dia" orientacao="vertical" porVista={2} altura={220} larguraMax={360} mostrarPontos={false} mostrarContador espaco={12}>
            {AGENDA.map(([hora, nome, assunto]) => (
              <div key={hora} className="neu-carousel__card neu-carousel__card--agenda">
                <div className="neu-carousel__agenda-head">
                  <strong>{hora}</strong>
                  <Selo tamanho="sm">{assunto}</Selo>
                </div>
                <span className="neu-carousel__agenda-name">{nome}</span>
              </div>
            ))}
          </Carrossel>
        </div>
      </div>
    </ComponentPreview>
  );
}
