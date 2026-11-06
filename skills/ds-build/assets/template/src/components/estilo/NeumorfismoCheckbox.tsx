import { useId, useState } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Checkbox } from "@/components/ui/checkbox";
import NeumorfismoRadio from "./NeumorfismoRadio";

/**
 * Vitrine do Checkbox no estilo Neumorfismo (componente Checkbox do pacote Neumorphic UI v3.2.0): quadrado de 24px
 * escavado na superfície que enche com a barra de acento da marca ao ser marcado, com título e descrição ao lado.
 * O tom "royal" usa a cor secundária da marca. Montado com o Checkbox do DS (Radix); as classes neu-check* e o relevo
 * vêm de src/styles/estilo.css. Só é usada quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */

interface OpcaoProps {
  titulo: string;
  descricao?: string;
  tom?: "marca" | "secundaria";
  desabilitado?: boolean;
  marcadoInicial?: boolean;
}

export function OpcaoCheckbox({ titulo, descricao, tom = "marca", desabilitado = false, marcadoInicial = false }: OpcaoProps) {
  const id = useId();
  const [marcado, setMarcado] = useState(marcadoInicial);
  return (
    <div className="neu-check" aria-disabled={desabilitado ? true : undefined}>
      <Checkbox
        id={id}
        className={tom === "secundaria" ? "neu-check--secundaria" : undefined}
        checked={marcado}
        disabled={desabilitado}
        aria-describedby={descricao ? `${id}-desc` : undefined}
        onCheckedChange={(v) => setMarcado(v === true)}
      />
      <label htmlFor={id} className="neu-check__texto">
        <span className="neu-check__title">{titulo}</span>
        {descricao && <span className="neu-check__desc" id={`${id}-desc`}>{descricao}</span>}
      </label>
    </div>
  );
}

export default function NeumorfismoCheckbox() {
  return (
    <>
      <NeumorfismoCheckboxes />
      <NeumorfismoRadio />
    </>
  );
}

function NeumorfismoCheckboxes() {
  return (
    <ComponentPreview
      title="Checkbox — variantes do pacote"
      description="Um quadrado de 24px escavado na superfície. Marcado, enche com a barra de acento da marca, com brilho e um check branco de 3px; desmarcado fica afundado e neutro."
      whenToUse={["Seleção de uma ou mais opções de uma lista curta", "Concordâncias e preferências, com título e descrição ao lado", "Secundária: seleções corporativas ou de apoio, no lugar da cor principal"]}
      whenNotToUse={["Escolha única entre opções: use o grupo de radio", "Ações imediatas: use o switch"]}
      accessibility={["O rótulo inteiro é clicável e ligado ao controle (htmlFor/id)", "A descrição vai ligada por aria-describedby", "Teclado: Espaço marca e desmarca; foco em anel sólido", "Desabilitado: fica opaco e sem foco"]}
      code={`<OpcaoCheckbox titulo="Checkbox Selecionado" descricao="Preenchimento com relevo luminoso" marcadoInicial />
<OpcaoCheckbox titulo="Checkbox Secundário" tom="secundaria" marcadoInicial />
<OpcaoCheckbox titulo="Checkbox Desabilitado" desabilitado />`}
    >
      <div className="neu-stack" style={{ gap: 20 }}>
        <OpcaoCheckbox marcadoInicial titulo="Checkbox Selecionado" descricao="Preenchimento com relevo luminoso convexo" />
        <OpcaoCheckbox marcadoInicial tom="secundaria" titulo="Checkbox Royal" descricao="Variante da cor secundária da marca" />
        <OpcaoCheckbox titulo="Checkbox Desmarcado" descricao="Rebaixo côncavo debossed neutro no plano" />
        <OpcaoCheckbox desabilitado titulo="Checkbox Desabilitado" descricao="Superfície travada sem interação" />
      </div>
    </ComponentPreview>
  );
}
