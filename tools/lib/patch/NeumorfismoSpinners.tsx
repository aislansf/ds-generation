import { Loader2 } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Spinner no estilo Neumorfismo (componente Spinner do pacote Neumorphic UI v3.2.0): um glifo que
 * gira dentro de um disco convexo, em três tamanhos (56px para ações inline, 64px padrão, 80px para telas) e
 * na cor da marca ou na secundária (no lugar do azul royal). O glifo é o ícone de carregamento ou o anel
 * (trilha clara com um quarto de arco que gira uma vez por segundo). Abaixo, o painel de cartões de
 * especificação do pacote. Entra no cartão "Spinner" da ComponentesPage e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-spinner* vêm de src/styles/estilo.css; o giro (neu-spin) só roda
 * quando a pessoa não pediu menos movimento.
 */

type Tamanho = "sm" | "md" | "lg";

// disco, glifo de ícone e glifo de anel, em px (os do pacote)
const MEDIDAS: Record<Tamanho, { disco: number; icone: number; anel: number }> = {
  sm: { disco: 56, icone: 20, anel: 20 },
  md: { disco: 64, icone: 28, anel: 28 },
  lg: { disco: 80, icone: 36, anel: 40 },
};

interface CarregandoProps {
  tamanho?: Tamanho;
  tom?: "accent" | "royal";
  glifo?: "icone" | "anel";
  /** Texto para leitores de tela */
  rotulo?: string;
}

export function Carregando({ tamanho = "md", tom = "accent", glifo = "icone", rotulo = "Carregando" }: CarregandoProps) {
  const m = MEDIDAS[tamanho];
  return (
    <span
      className={tom === "royal" ? "neu-spinner neu-spinner--royal" : "neu-spinner"}
      style={{ width: m.disco, height: m.disco }}
      role="status"
      aria-label={rotulo}
    >
      {glifo === "anel" ? (
        <svg className="neu-spin neu-spinner__ring" width={m.anel} height={m.anel} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".9" />
        </svg>
      ) : (
        <Loader2 className="neu-spin" aria-hidden="true" size={m.icone} strokeWidth={2.5} />
      )}
    </span>
  );
}

const CARTOES: { tamanho: Tamanho; tom?: "royal"; titulo: string; spec: string; uso: string }[] = [
  { tamanho: "sm", titulo: "Tamanho SM", spec: "20px · Cor da marca", uso: "Ações inline" },
  { tamanho: "md", titulo: "Tamanho MD", spec: "28px · Cor da marca", uso: "Padrão em cards" },
  { tamanho: "lg", titulo: "Tamanho LG", spec: "40px · Cor da marca", uso: "Carregamento de tela" },
  { tamanho: "md", tom: "royal", titulo: "Secundário", spec: "28px · Cor secundária", uso: "Paleta secundária" },
];

export default function NeumorfismoSpinners() {
  return (
    <ComponentPreview
      title="Spinner"
      description="Indicador de carregamento em andamento: um glifo que gira dentro de um disco convexo, na cor da marca ou na secundária. Para layouts conhecidos prefira o Skeleton; dentro de um botão, use o carregamento do próprio botão."
      whenToUse={["Ações assíncronas", "Carregamento de página ou de uma seção", "Processo secundário, na cor secundária"]}
      whenNotToUse={["Layout conhecido: use o Skeleton", "Dentro de botão: use o estado de carregamento do botão"]}
      accessibility={["role=\"status\" com aria-label (\"Carregando\" por padrão); o glifo é decorativo", "O giro só roda quando a pessoa não pediu menos movimento", "Cada spinner de uma página pode nomear o que carrega, como em \"Carregando (Tamanho SM)\""]}
      code={`<Carregando tamanho="sm" />
<Carregando tamanho="md" />
<Carregando tamanho="lg" />
<Carregando tom="royal" />

{/* glifo em anel, com nome acessível próprio */}
<Carregando glifo="anel" rotulo="Carregando relatório" />`}
    >
      <div className="neu-stack" style={{ gap: 32 }}>
        <div className="neu-row" style={{ gap: 32 }}>
          <Carregando tamanho="sm" />
          <Carregando tamanho="md" />
          <Carregando tamanho="lg" />
          <Carregando tom="royal" />
        </div>
        <div className="neu-spinner-set">
          {CARTOES.map((c) => (
            <div key={c.titulo} className="neu-spinner-card">
              <Carregando tamanho={c.tamanho} tom={c.tom} glifo="anel" rotulo={`Carregando (${c.titulo})`} />
              <div>
                <h5 className="neu-spinner-card__title">{c.titulo}</h5>
                <p className="neu-spinner-card__spec">{c.spec}</p>
              </div>
              <span className={c.tom === "royal" ? "neu-spinner-card__chip neu-spinner-card__chip--royal" : "neu-spinner-card__chip"}>{c.uso}</span>
            </div>
          ))}
        </div>
      </div>
    </ComponentPreview>
  );
}
