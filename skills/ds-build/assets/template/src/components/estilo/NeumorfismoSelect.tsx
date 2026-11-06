import { useId, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Vitrine do Select no estilo Neumorfismo (componente Select do pacote Neumorphic UI v3.2.0): um gatilho convexo
 * que abre um menu flutuante com a sombra de popover, no lugar da lista nativa do navegador. A opção marcada fica
 * na cor da marca, em negrito e com um check à direita; o chevron do gatilho se inverte com o menu aberto.
 * Montado com o Select do DS (Radix, com teclado completo); o relevo vem de src/styles/estilo.css. Só é usado quando
 * ESTILO.id === "neumorfismo" (ComponentesPage), dentro do cartão "Select".
 */

export interface OpcaoSelecao {
  value: string;
  label: string;
}

interface SelecaoProps {
  rotulo: string;
  opcoes: OpcaoSelecao[];
  valorInicial?: string;
  /** Valor controlado de fora (como na escolha do schema do validador), com `aoMudar` */
  valor?: string;
  aoMudar?: (valor: string) => void;
  dica?: string;
  tamanho?: "md" | "sm";
}

export function SelecaoNeu({ rotulo, opcoes, valorInicial = "", valor: valorControlado, aoMudar, dica, tamanho = "md" }: SelecaoProps) {
  const uid = useId();
  const [interno, setInterno] = useState(valorInicial);
  const valor = valorControlado ?? interno;
  const setValor = (v: string) => {
    if (valorControlado === undefined) setInterno(v);
    aoMudar?.(v);
  };
  return (
    <div className={`neu-select${tamanho === "sm" ? " neu-select--sm" : ""}`}>
      <span className="neu-label" id={`${uid}-rotulo`}>{rotulo}</span>
      <Select value={valor} onValueChange={setValor}>
        <SelectTrigger id={`${uid}-gatilho`} aria-labelledby={`${uid}-rotulo ${uid}-gatilho`} aria-describedby={dica ? `${uid}-dica` : undefined}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="neu-select__menu" sideOffset={6}>
          {opcoes.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {dica && <p className="neu-help" id={`${uid}-dica`}>{dica}</p>}
    </div>
  );
}

const OPCOES: OpcaoSelecao[] = [
  { value: "c1", label: "Combo1" },
  { value: "c2", label: "Combo2" },
  { value: "c3", label: "Combo3" },
];

export default function NeumorfismoSelect() {
  return (
    <div className="neu-stack" style={{ gap: 28, maxWidth: 380 }}>
      <SelecaoNeu rotulo="Selecione uma opção" opcoes={OPCOES} valorInicial="c1" dica="O menu customizado substitui o pop-up nativo do navegador, mantendo o relevo." />
      <div>
        <p className="neu-cap">Tamanho sm</p>
        <SelecaoNeu rotulo="Situação" tamanho="sm" opcoes={[{ value: "t", label: "Todas" }, { value: "a", label: "Ativas" }, { value: "i", label: "Inativas" }]} valorInicial="t" />
      </div>
    </div>
  );
}
