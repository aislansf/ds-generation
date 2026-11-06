import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do SegmentedControl no estilo Neumorfismo (componente SegmentedControl do pacote Neumorphic UI v3.2.0):
 * uma casca escavada com as opções lado a lado; a escolhida ganha relevo convexo com fio de luz. Variante em
 * caixa-alta para rótulos curtos. O pacote usa role="tablist" sem painéis; aqui é um radiogroup (escolha única,
 * setas, Home e End), que é o que o controle faz de fato. O relevo vem de src/styles/estilo.css. Só é usado
 * quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */

interface OpcaoSegmentada {
  valor: string;
  rotulo: string;
}

interface ControleSegmentadoProps {
  rotulo: string;
  opcoes: OpcaoSegmentada[];
  valorInicial: string;
  /** Rótulos em caixa-alta, para textos curtos como "Account" e "Client" */
  caixaAlta?: boolean;
}

export function ControleSegmentado({ rotulo, opcoes, valorInicial, caixaAlta = false }: ControleSegmentadoProps) {
  const [atual, setAtual] = useState(valorInicial);
  const grupo = useRef<HTMLDivElement>(null);
  const uid = useId();

  function aoTeclar(e: KeyboardEvent) {
    const i = Math.max(0, opcoes.findIndex((o) => o.valor === atual));
    const n = opcoes.length;
    const proxima =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : null;
    if (proxima === null) return;
    e.preventDefault();
    setAtual(opcoes[proxima].valor);
    grupo.current?.querySelectorAll<HTMLElement>('[role="radio"]')[proxima]?.focus();
  }

  return (
    <div
      ref={grupo}
      data-neu="segmentado"
      role="radiogroup"
      aria-label={rotulo}
      className={caixaAlta ? "neu-segmented neu-segmented--caps" : "neu-segmented"}
      onKeyDown={aoTeclar}
    >
      {opcoes.map((o) => {
        const ligada = o.valor === atual;
        return (
          <button
            key={o.valor}
            id={`${uid}-${o.valor}`}
            type="button"
            role="radio"
            aria-checked={ligada}
            tabIndex={ligada ? 0 : -1}
            className="neu-segmented__opt"
            onClick={() => setAtual(o.valor)}
          >
            {o.rotulo}
          </button>
        );
      })}
    </div>
  );
}

export default function NeumorfismoSegmentado() {
  return (
    <ComponentPreview
      title="Controle segmentado"
      description="Casca escavada com as opções lado a lado; a escolhida sobe em relevo convexo. Serve para alternar entre poucas visões da mesma tela, como perfil ou período."
      whenToUse={["Alternar entre 2 a 4 opções curtas e mutuamente exclusivas", "Mudar o recorte dos dados (período, perfil) sem sair da tela"]}
      whenNotToUse={["Navegar entre painéis de conteúdo: use as abas", "Muitas opções ou rótulos longos: use o select"]}
      accessibility={["Grupo com nome acessível (radiogroup) e cada opção como radio marcado ou não", "Setas movem e escolhem; Home e End vão às pontas; só a opção escolhida entra na ordem de Tab", "Foco: anel sólido de 2px em volta da opção"]}
      code={`<ControleSegmentado rotulo="Perfil" caixaAlta valorInicial="client"
  opcoes={[{ valor: "account", rotulo: "Account" }, { valor: "client", rotulo: "Client" }]} />
<ControleSegmentado rotulo="Período" valorInicial="7"
  opcoes={[{ valor: "hoje", rotulo: "Hoje" }, { valor: "7", rotulo: "7 Dias" }, { valor: "30", rotulo: "30 Dias" }]} />`}
    >
      <div className="neu-stack" style={{ maxWidth: 420, gap: 16 }}>
        <ControleSegmentado
          rotulo="Perfil"
          caixaAlta
          valorInicial="client"
          opcoes={[{ valor: "account", rotulo: "Account" }, { valor: "client", rotulo: "Client" }]}
        />
        <ControleSegmentado
          rotulo="Período"
          valorInicial="7"
          opcoes={[{ valor: "hoje", rotulo: "Hoje" }, { valor: "7", rotulo: "7 Dias" }, { valor: "30", rotulo: "30 Dias" }]}
        />
      </div>
    </ComponentPreview>
  );
}
