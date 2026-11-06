import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

/**
 * Vitrine do Card no estilo Neumorfismo (componente Card do pacote Neumorphic UI v3.2.0): o contêiner. O convexo
 * (padrão) sobe do fundo; o plano é fosco; o afundado é esculpido, para grupos de campos estáticos e coleções
 * embutidas; o primário é a placa da marca, para uma mensagem em destaque por tela. Com `rotuloAcao` ou `metaRodape` o
 * cartão ganha as três partes do "Card básico": o cabeçalho com o título em negrito e um LED de status sobre um fio, o
 * corpo e o rodapé atrás de outro fio, com a tecla convexa "Ver mais →" à esquerda (que ganha a cor da marca ao
 * passar o mouse e afunda ao apertar) e a meta em mono à direita; ele sobe 2% ao passar o mouse. Um primário com
 * `etiqueta`, `rotuloAcao` ou `metaRodape` vira o "Card com fundo primário": a placa da marca com a etiqueta fosca em
 * caixa-alta e um LED branco que pulsa, o título grande, o texto, e um rodapé com o botão branco e a meta. O afundado
 * aceita `chips`: peças convexas pousadas no leito esculpido. `interativo` faz do cartão inteiro um botão
 * (role="button", foco, Enter e Espaço), que afunda ao apertar; `rotuloLink` fecha com o destino e uma seta convexa que
 * anda 2px. Esta vitrine entra no cartão "Card" do DS (no neumorfismo) e só é usada quando ESTILO.id ===
 * "neumorfismo". As classes neu-card* vêm de src/styles/estilo.css.
 */

export type VarianteCartao = "convexo" | "plano" | "afundado" | "primario";
export type TomCartao = "neutro" | "marca" | "azul" | "sucesso" | "perigo" | "atencao";

// as classes seguem o pacote (convex, flat, inset, primary; neutral, accent, royal, success, danger, warning)
const VARIANTE: Record<VarianteCartao, string> = { convexo: "convex", plano: "flat", afundado: "inset", primario: "primary" };
const TOM: Record<TomCartao, string> = { neutro: "neutral", marca: "accent", azul: "royal", sucesso: "success", perigo: "danger", atencao: "warning" };

export interface ChipCartao {
  rotulo: string;
  tom?: "neutro" | "marca";
}

export interface CartaoProps {
  variante?: VarianteCartao;
  titulo?: string;
  /** Texto em mono ou um nó (um selo), à direita do título */
  meta?: ReactNode;
  /** Cor do LED ao lado do título (no cartão em seções, o padrão é neutro) */
  ponto?: TomCartao;
  /** Peças convexas no fim do cartão afundado */
  chips?: (string | ChipCartao)[];
  interativo?: boolean;
  aoClicar?: (e: MouseEvent | KeyboardEvent) => void;
  /** Linha final do cartão interativo, com a seta convexa */
  rotuloLink?: string;
  /** Texto da tecla do rodapé; ativa o cartão em seções (ou o de destaque, no primário) */
  rotuloAcao?: string;
  hrefAcao?: string;
  aoAcao?: (e: MouseEvent) => void;
  /** Meta em mono no rodapé */
  metaRodape?: string;
  /** Etiqueta fosca do cartão de destaque */
  etiqueta?: string;
  className?: string;
  /** Um texto vira o parágrafo do corpo; um nó fica como está */
  children?: ReactNode;
}

function Ponto({ tom }: { tom: TomCartao }) {
  return <span className={`neu-dot neu-dot--${TOM[tom]}`} />;
}

export function Cartao({ variante = "convexo", titulo, meta, ponto, chips, interativo, aoClicar, rotuloLink, rotuloAcao, hrefAcao, aoAcao, metaRodape, etiqueta, className, children }: CartaoProps) {
  const v = VARIANTE[variante];
  const classe = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

  if (variante === "primario" && (rotuloAcao || metaRodape || etiqueta)) {
    return (
      <div className={classe("neu-card", "neu-card--featured", className)}>
        <div>
          <div className="neu-card__featured-top">
            {etiqueta ? <span className="neu-card__tag">{etiqueta}</span> : <span />}
            <span className="neu-card__pulse" aria-hidden="true" />
          </div>
          <h4 className="neu-card__featured-title">{titulo}</h4>
          {typeof children === "string" ? <p className="neu-card__featured-text">{children}</p> : children}
        </div>
        <div className="neu-card__foot neu-card__foot--featured">
          {rotuloAcao ? (
            <button type="button" className="neu-card__featured-btn" onClick={aoAcao}>
              {rotuloAcao}
            </button>
          ) : (
            <span />
          )}
          {metaRodape && <span className="neu-card__meta">{metaRodape}</span>}
        </div>
      </div>
    );
  }

  if (rotuloAcao || metaRodape) {
    return (
      <div className={classe("neu-card", `neu-card--${v}`, "neu-card--sectioned", className)}>
        <div>
          <div className="neu-card__head neu-card__head--ruled">
            <h4 className="neu-card__title neu-card__title--lg">{titulo}</h4>
            <Ponto tom={ponto ?? "neutro"} />
          </div>
          <div className="neu-card__body">{typeof children === "string" ? <p className="neu-card__text">{children}</p> : children}</div>
        </div>
        <div className="neu-card__foot">
          {rotuloAcao ? (
            <a
              className="neu-card__action"
              href={hrefAcao ?? "#"}
              onClick={(e) => {
                if (!hrefAcao) e.preventDefault();
                aoAcao?.(e);
              }}
            >
              <span>{rotuloAcao}</span>
              <span aria-hidden="true">→</span>
            </a>
          ) : (
            <span />
          )}
          {metaRodape && <span className="neu-card__meta">{metaRodape}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={classe("neu-card", `neu-card--${v}`, interativo && "neu-card--interactive", className)}
      onClick={aoClicar}
      tabIndex={interativo ? 0 : undefined}
      role={interativo ? "button" : undefined}
      onKeyDown={
        interativo
          ? (e) => {
              if ((e.key === "Enter" || e.key === " ") && aoClicar) {
                e.preventDefault();
                aoClicar(e);
              }
            }
          : undefined
      }
    >
      {(titulo || meta) && (
        <div className="neu-card__head">
          <h5 className="neu-card__title">
            {ponto && <Ponto tom={ponto} />}
            {titulo}
          </h5>
          {meta ? typeof meta === "string" ? <span className="neu-card__meta">{meta}</span> : meta : null}
        </div>
      )}
      {typeof children === "string" ? <p className="neu-card__text">{children}</p> : children}
      {rotuloLink && (
        <div className="neu-card__link">
          <span>{rotuloLink}</span>
          <span className="neu-card__arrow" aria-hidden="true">→</span>
        </div>
      )}
      {chips && chips.length > 0 && (
        <div className="neu-card__chips">
          {chips.map((c, i) => {
            const o = typeof c === "string" ? { rotulo: c } : c;
            return (
              <span key={i} className={`neu-card__chip neu-tone-${TOM[o.tom ?? "neutro"]}`}>
                {o.rotulo}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NeumorfismoCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
      <Cartao titulo="Card básico" rotuloAcao="Ver mais" metaRodape="Base Surface">
        Conteúdo do card com informações relevantes.
      </Cartao>
      <Cartao titulo="Card resumido" meta="neu-convex">
        Conteúdo do card com informações resumidas e ações secundárias.
      </Cartao>
      <Cartao variante="afundado" titulo="Card Côncavo / Inset (Debossed)" ponto="azul" meta="neu-inset" chips={["Sub-elemento Convex", { rotulo: "Projeção 135°", tom: "marca" }]}>
        Utilizado para agrupamento de campos estáticos, coleções incorporadas ou áreas rebaixadas da interface onde os dados ficam aninhados ao plano de fundo.
      </Cartao>
      <Cartao
        interativo
        titulo="Card Interativo (Hover & Active)"
        ponto="sucesso"
        meta={<span className="neu-badge neu-badge--inset neu-badge--xs neu-tone-accent">CLICÁVEL</span>}
        rotuloLink="Acessar módulo de dados"
        aoClicar={() => {}}
      >
        Reage ao mouse com sutil elevação e pressão física ao clique (active state), gerando feedback tátil orgânico e mantendo a harmonia off-white.
      </Cartao>
      <Cartao variante="primario" etiqueta="Destaque" titulo="Card com fundo primário" rotuloAcao="Explorar Ação" metaRodape="Brand">
        Para informações de destaque institucional.
      </Cartao>
      <Cartao variante="primario" titulo="Primário simples">
        Destaque institucional para uma única mensagem.
      </Cartao>
    </div>
  );
}
