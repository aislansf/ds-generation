import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ESTILO } from "@/config/estilo";
import { ListaDescritiva, type ItemDescritivo } from "@/components/estilo/NeumorfismoListaDescritiva";

/**
 * "Superfícies e fundos" da página de Fundamentos no estilo Neumorfismo: em vez de quatro amostras soltas com dois botões
 * de copiar empilhados, a Lista descritiva validada (variante painel) com uma linha por superfície. A linha traz o nome do
 * token, a amostra e o botão de copiar do hex no tema claro e no escuro, lado a lado. Os dados vêm do próprio
 * ColorSection (cores da marca já aplicadas); `renderSuperficies` devolve esta lista no Neumorfismo e as amostras de
 * sempre nos demais estilos. As classes neu-cor* vêm de src/styles/estilo.css.
 */

export interface SuperficieCor {
  label: string;
  hex: string;
  darkHex: string;
  token: string;
}

function CopiarHex({ valor, tema }: { valor: string; tema: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="neu-btn--convex h-8 gap-2 px-3 font-mono text-[11px]"
      title={`Copiar ${valor}`}
      aria-label={`Copiar código hexadecimal ${valor} (${tema})`}
      onClick={() => {
        navigator.clipboard?.writeText(valor);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1500);
      }}
    >
      {copiado ? <Check size={12} className="text-success" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
      {valor}
    </Button>
  );
}

function Amostra({ cor }: { cor: string }) {
  return <span className="neu-cor__amostra" style={{ backgroundColor: cor }} aria-hidden="true" />;
}

export function SuperficiesCores({ itens }: { itens: SuperficieCor[] }) {
  const linhas: ItemDescritivo[] = itens.map((s) => ({
    termo: (
      <span className="neu-cor__nome">
        <span>{s.label}</span>
        <code className="neu-cor__token">var(--{s.token})</code>
      </span>
    ),
    valor: (
      <div className="neu-cor">
        <div className="neu-cor__tema">
          <span className="neu-cor__rotulo">Claro</span>
          <Amostra cor={s.hex} />
          <CopiarHex valor={s.hex} tema="claro" />
        </div>
        <div className="neu-cor__tema">
          <span className="neu-cor__rotulo">Escuro</span>
          <Amostra cor={s.darkHex} />
          <CopiarHex valor={s.darkHex} tema="escuro" />
        </div>
      </div>
    ),
  }));
  return (
    <div className="neu-cor-lista">
      <ListaDescritiva variante="painel" rotulo="Superfícies e fundos" itens={linhas} />
    </div>
  );
}

/** No Neumorfismo, a Lista descritiva; nos demais estilos, as amostras que o ColorSection desenha */
export function renderSuperficies<T extends SuperficieCor>(itens: T[], amostra: (s: T) => ReactNode): ReactNode {
  if ((ESTILO.id as string) === "neumorfismo") return <SuperficiesCores itens={itens} />;
  return itens.map(amostra);
}
