import { useId, useState, type ReactNode } from "react";
import { ChevronDown, ChevronsUpDown, Filter } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import { Selo } from "@/components/estilo/NeumorfismoBadges";
import { OpcaoCheckbox } from "@/components/estilo/NeumorfismoCheckbox";
import { SelecaoNeu } from "@/components/estilo/NeumorfismoSelect";

/**
 * Vitrine do Collapsible no estilo Neumorfismo (componente Collapsible do pacote Neumorphic UI v3.2.0): um
 * cartão convexo com um cabeçalho sempre visível (título, subtítulo e ícone opcionais), um resumo opcional
 * também sempre visível e uma região que abre e fecha. A tecla do cabeçalho é um botão de verdade com
 * aria-expanded e aria-controls: só ícone (⇅, com nome acessível) ou com texto ("Mostrar"/"Ocultar") e
 * chevron que gira; aberta, ela afunda num poço. A região anima a altura por grid-template-rows (sem animação
 * com "menos movimento") e, fechada, fica aria-hidden e inert, então o Tab a pula. `simples` tira a casca do
 * cartão. As linhas (`LinhaRecolhivel`) são faixas afundadas de rótulo e valor, ou de título e texto. Entra
 * numa seção nova do neumorfismo ("Collapsible", depois do Carousel) e só é usado quando ESTILO.id ===
 * "neumorfismo". As classes neu-collapsible* vêm de src/styles/estilo.css.
 */

interface RecolhivelProps {
  titulo: string;
  subtitulo?: string;
  icone?: ReactNode;
  /** Conteúdo sempre visível, abaixo do cabeçalho (use LinhaRecolhivel) */
  resumo?: ReactNode;
  children: ReactNode;
  aberto?: boolean;
  abertoInicial?: boolean;
  aoMudar?: (aberto: boolean) => void;
  /** Nome acessível da tecla só de ícone */
  rotuloTecla?: string;
  /** Texto da tecla ("Mostrar"/"Ocultar"): uma string ou uma função do estado */
  rotuloGatilho?: string | ((aberto: boolean) => string);
  /** Sem a casca do cartão */
  simples?: boolean;
  larguraMax?: number;
}

const INERTE = { inert: "" } as Record<string, string>;

export function Recolhivel({ titulo, subtitulo, icone, resumo, children, aberto, abertoInicial = false, aoMudar, rotuloTecla, rotuloGatilho, simples = false, larguraMax }: RecolhivelProps) {
  const uid = useId();
  const [interno, setInterno] = useState(abertoInicial);
  const on = aberto ?? interno;
  function alternar() {
    if (aberto === undefined) setInterno(!on);
    aoMudar?.(!on);
  }
  const comTexto = rotuloGatilho !== undefined;
  const texto = typeof rotuloGatilho === "function" ? rotuloGatilho(on) : rotuloGatilho;
  return (
    <div className={`neu-collapsible${on ? " neu-collapsible--open" : ""}${simples ? " neu-collapsible--plain" : ""}`} style={{ maxWidth: larguraMax }}>
      <div className="neu-collapsible__head">
        <div className="neu-collapsible__heading">
          {icone && <span className="neu-collapsible__icon" aria-hidden="true">{icone}</span>}
          <div>
            <h4 className="neu-collapsible__title">{titulo}</h4>
            {subtitulo && <p className="neu-collapsible__sub">{subtitulo}</p>}
          </div>
        </div>
        <button
          type="button"
          className={`neu-collapsible__toggle${comTexto ? " neu-collapsible__toggle--text" : ""}`}
          aria-expanded={on}
          aria-controls={uid}
          title={rotuloTecla ?? (on ? "Recolher detalhes" : "Expandir detalhes")}
          onClick={alternar}
        >
          {comTexto ? <span>{texto}</span> : null}
          {comTexto ? <ChevronDown aria-hidden="true" size={16} /> : <ChevronsUpDown aria-hidden="true" size={16} />}
          {!comTexto && <span className="sr-only">{rotuloTecla ?? "Alternar detalhes"}</span>}
        </button>
      </div>
      {resumo && <div className="neu-collapsible__summary">{resumo}</div>}
      <div id={uid} className="neu-collapsible__region" aria-hidden={on ? undefined : "true"} {...(on ? {} : INERTE)}>
        <div className="neu-collapsible__inner">
          <div className="neu-collapsible__content">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface LinhaProps {
  /** Título em negrito (com `children` como texto abaixo) */
  titulo?: string;
  /** Par rótulo/valor numa linha só */
  rotulo?: string;
  valor?: ReactNode;
  children?: ReactNode;
}

export function LinhaRecolhivel({ titulo, rotulo, valor, children }: LinhaProps) {
  return (
    <div className="neu-collapsible__row">
      {titulo != null && <p className="neu-collapsible__row-title">{titulo}</p>}
      {rotulo != null && <span className="neu-collapsible__row-label">{rotulo}</span>}
      {valor != null && <span className="neu-collapsible__row-value">{valor}</span>}
      {children && <p className="neu-collapsible__row-text">{children}</p>}
    </div>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoRecolhiveis() {
  const [pedido, setPedido] = useState(false);
  return (
    <ComponentPreview
      title="Collapsible"
      description="Cartão convexo com cabeçalho sempre visível, resumo opcional e uma região que abre e fecha. Serve para detalhe secundário: dados de um pedido, filtros avançados."
      whenToUse={["Detalhe secundário que a maioria não precisa ver de cara", "Filtros avançados e dados de apoio de um registro", "Um único bloco que abre e fecha (para vários blocos em lista, use o Accordion)"]}
      whenNotToUse={["Informação essencial: ela precisa estar visível", "Vários itens relacionados em pilha: use o Accordion"]}
      accessibility={[
        "A tecla é um botão de verdade com aria-expanded e aria-controls",
        "A tecla só de ícone tem nome acessível (rotuloTecla); a de texto lê \"Mostrar\" ou \"Ocultar\"",
        "Fechada, a região fica aria-hidden e inert: o Tab pula o conteúdo escondido",
        "Aberta, a tecla afunda e muda de cor: o estado não depende só da cor, porque aria-expanded e o texto também mudam",
        "A altura anima sem rotação nem salto; com \"menos movimento\" não há animação",
      ]}
      code={`<Recolhivel
  titulo="Pedido #4189"
  aberto={aberto}
  aoMudar={setAberto}
  rotuloTecla="Alternar detalhes do pedido"
  resumo={<LinhaRecolhivel rotulo="Status" valor={<Selo tom="success" tamanho="sm" ponto>Enviado</Selo>} />}
>
  <LinhaRecolhivel titulo="Endereço de entrega">Av. Central, 100 — Centro, Fortaleza/CE</LinhaRecolhivel>
  <LinhaRecolhivel titulo="Itens">2× Fone de ouvido estúdio</LinhaRecolhivel>
</Recolhivel>

<Recolhivel
  titulo="Filtros avançados"
  subtitulo="3 filtros ativos"
  icone={<Filter size={16} />}
  abertoInicial
  rotuloGatilho={(aberto) => (aberto ? "Ocultar" : "Mostrar")}
>
  …
</Recolhivel>`}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
        <div style={{ width: 360, maxWidth: "100%" }}>
          <Legenda>Pedido — controlado</Legenda>
          <Recolhivel
            titulo="Pedido #4189"
            aberto={pedido}
            aoMudar={setPedido}
            rotuloTecla="Alternar detalhes do pedido"
            resumo={<LinhaRecolhivel rotulo="Status" valor={<Selo tom="success" tamanho="sm" ponto>Enviado</Selo>} />}
          >
            <LinhaRecolhivel titulo="Endereço de entrega">Av. Central, 100 — Centro, Fortaleza/CE</LinhaRecolhivel>
            <LinhaRecolhivel titulo="Itens">2× Fone de ouvido estúdio</LinhaRecolhivel>
          </Recolhivel>
          <p className="neu-help" aria-live="polite">{pedido ? "Detalhes visíveis." : "Detalhes recolhidos — use o botão ⇅."}</p>
        </div>
        <div style={{ width: 360, maxWidth: "100%" }}>
          <Legenda>Com rótulo e ícone — aberto por padrão</Legenda>
          <Recolhivel
            titulo="Filtros avançados"
            subtitulo="3 filtros ativos"
            icone={<Filter size={16} />}
            abertoInicial
            rotuloGatilho={(aberto) => (aberto ? "Ocultar" : "Mostrar")}
          >
            <SelecaoNeu rotulo="Unidade" tamanho="sm" valorInicial="cap" opcoes={[{ value: "cap", label: "Capital" }, { value: "int", label: "Interior" }]} />
            <OpcaoCheckbox titulo="Somente atendimentos em aberto" marcadoInicial />
            <OpcaoCheckbox titulo="Incluir atendimentos online" />
          </Recolhivel>
        </div>
      </div>
    </ComponentPreview>
  );
}
