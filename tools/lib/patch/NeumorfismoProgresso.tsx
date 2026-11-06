import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Progress no estilo Neumorfismo (componente Progress do pacote Neumorphic UI v3.2.0): uma calha
 * escavada com o preenchimento encaixado por dentro. O padrão é a barra de acento da marca, que brilha; os tons
 * secundário (no lugar do azul royal), sucesso, atenção e perigo são chapados. Variações: fina (6px), grande
 * (14px), com título e porcentagem, com dica e indeterminada (um trecho que varre a calha, para durações
 * desconhecidas). A largura anima em 0,5s quando o valor muda. Seção nova do neumorfismo: só é usada quando
 * ESTILO.id === "neumorfismo" (ComponentesPage). As classes neu-progress* vêm de src/styles/estilo.css; o
 * movimento só roda quando a pessoa não pediu menos movimento.
 */

type Tom = "accent" | "royal" | "success" | "warning" | "danger";

interface ProgressoProps {
  /** 0 a 100; ignorado quando indeterminado */
  valor?: number;
  /** Nome acessível da barra */
  rotulo: string;
  tom?: Tom;
  /** 6px, para baixo de cartões de indicador e linhas de upload */
  fino?: boolean;
  tamanho?: "md" | "lg";
  /** Linha acima da barra; com mostrarValor, leva a porcentagem à direita */
  titulo?: string;
  mostrarValor?: boolean;
  /** Texto de apoio abaixo da barra */
  dica?: string;
  indeterminado?: boolean;
  /** Para valueText falado diferente do número, como "5 de 12 arquivos" */
  textoDoValor?: string;
  largura?: string;
}

export function Progresso({ valor = 0, rotulo, tom = "accent", fino = false, tamanho = "md", titulo, mostrarValor = false, dica, indeterminado = false, textoDoValor, largura }: ProgressoProps) {
  const v = Math.max(0, Math.min(100, valor));
  const classe = ["neu-progress", fino && "neu-progress--thin", tamanho === "lg" && "neu-progress--lg", indeterminado && "neu-progress--indeterminate"].filter(Boolean).join(" ");
  const barra = (
    <div
      className={classe}
      role="progressbar"
      aria-valuenow={indeterminado ? undefined : v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={textoDoValor}
      aria-label={rotulo}
      style={titulo || mostrarValor ? undefined : largura ? { width: largura } : undefined}
    >
      <div className={tom === "accent" ? "neu-progress__bar" : `neu-progress__bar neu-progress__bar--${tom}`} style={indeterminado ? undefined : { width: `${v}%` }} />
    </div>
  );
  if (!titulo && !mostrarValor) return barra;
  return (
    <div className="neu-progress-field" style={largura ? { width: largura } : undefined}>
      <div className="neu-progress-field__head">
        {titulo ? <span className="neu-progress-field__title">{titulo}</span> : <span />}
        {mostrarValor && !indeterminado && <span className="neu-progress-field__value" aria-hidden="true">{Math.round(v)}%</span>}
      </div>
      {barra}
      {dica && <p className="neu-help" style={{ margin: "6px 0 0" }}>{dica}</p>}
    </div>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

// O exemplo de referência: a barra parte de 13% e, meio segundo depois, desliza até 66%
function ExemploAnimado() {
  const [valor, setValor] = useState(13);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const avancar = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setValor(66), 500);
  };
  useEffect(() => {
    avancar();
    return () => clearTimeout(timer.current);
  }, []);
  return (
    <div className="neu-stack" style={{ gap: 10 }}>
      <Progresso valor={valor} rotulo="Progresso da tarefa" largura="60%" />
      <Button type="button" variant="outline" size="sm" className="neu-btn--convex" style={{ alignSelf: "flex-start" }} onClick={() => { setValor(13); avancar(); }}>
        <RotateCw aria-hidden="true" size={18} /> Repetir
      </Button>
    </div>
  );
}

export default function NeumorfismoProgresso() {
  return (
    <ComponentPreview
      title="Progress"
      description="Calha escavada com o preenchimento encaixado: a barra da marca brilha, e os demais tons são chapados. Fina embaixo de cartões de indicador, grande com título e porcentagem, e indeterminada quando não se sabe a duração."
      whenToUse={["Andamento de tarefas, envios e etapas com valor conhecido", "Indeterminada quando a duração é desconhecida", "Fina sob cartões de indicador e linhas de upload"]}
      whenNotToUse={["Carregamento de um layout conhecido: use o Skeleton", "Ação curta sem medida de avanço: use o Spinner"]}
      accessibility={["role=\"progressbar\" com aria-label, aria-valuemin, aria-valuemax e aria-valuenow (omitido na indeterminada)", "A porcentagem escrita é decorativa (aria-hidden); use o texto do valor quando o número não bastar", "O movimento só roda quando a pessoa não pediu menos movimento: a indeterminada vira uma barra a meio-tom"]}
      code={`<Progresso valor={66} rotulo="Progresso da tarefa" largura="60%" />
<Progresso valor={78.4} rotulo="Taxa de execução" />
<Progresso valor={64} fino tom="royal" rotulo="Recursos aplicados" />
<Progresso valor={90} fino tom="success" rotulo="Metas cumpridas" />
<Progresso valor={22} fino tom="warning" rotulo="Pendências" />

<Progresso titulo="Envio de documentos" mostrarValor valor={42} tamanho="lg"
  rotulo="Envio de documentos" dica="5 de 12 arquivos enviados" />

<Progresso indeterminado titulo="Sincronizando dados…" rotulo="Sincronizando dados" />`}
    >
      <div className="neu-stack" style={{ gap: 28, maxWidth: 460 }}>
        <div>
          <Legenda>Exemplo de referência — 13% → 66%</Legenda>
          <ExemploAnimado />
        </div>
        <div>
          <Legenda>Tons</Legenda>
          <div className="neu-stack">
            <Progresso valor={78.4} rotulo="Taxa de execução" />
            <Progresso valor={64} fino tom="royal" rotulo="Recursos aplicados" />
            <Progresso valor={90} fino tom="success" rotulo="Metas cumpridas" />
            <Progresso valor={22} fino tom="warning" rotulo="Pendências" />
          </div>
        </div>
        <div>
          <Legenda>Com título e valor</Legenda>
          <Progresso titulo="Envio de documentos" mostrarValor valor={42} tamanho="lg" rotulo="Envio de documentos" dica="5 de 12 arquivos enviados" />
        </div>
        <div>
          <Legenda>Indeterminado</Legenda>
          <Progresso indeterminado titulo="Sincronizando dados…" rotulo="Sincronizando dados" />
        </div>
      </div>
    </ComponentPreview>
  );
}
