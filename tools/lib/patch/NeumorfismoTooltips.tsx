import { useState, type ReactNode } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Tooltip no estilo Neumorfismo (componente Tooltip do pacote Neumorphic UI v3.2.0): uma bolha rasa
 * com fio de luz e ponta, que aparece 8px acima do gatilho ao passar o mouse ou ao focar pelo teclado. Montada
 * com o Tooltip do DS (Radix: aria-describedby, Esc fecha, atraso de abertura); o relevo e a ponta vêm de
 * src/styles/estilo.css ([data-ds="tooltip"]). O exemplo é o do pacote: três botões só de ícone, o primeiro com
 * a dica fixa aberta (open do Radix) até outra abrir. Entra no cartão "Tooltip" da ComponentesPage e só é usado quando ESTILO.id === "neumorfismo".
 */

interface DicaProps {
  /** Duas a quatro palavras que nomeiam a ação; nunca informação essencial */
  texto: string;
  /** Mantém a dica visível, para documentação (o Radix fecha as comuns quando a página rola) */
  fixa?: boolean;
  /** Chamado quando a dica abre por mouse ou teclado */
  aoAbrir?: () => void;
  children: ReactNode;
}

export function Dica({ texto, fixa = false, aoAbrir, children }: DicaProps) {
  const [aberta, setAberta] = useState(false);
  return (
    <Tooltip
      open={fixa || aberta}
      onOpenChange={(o) => {
        setAberta(o);
        if (o) aoAbrir?.();
      }}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>{texto}</TooltipContent>
    </Tooltip>
  );
}

function ExemploDicas() {
  // A primeira dica já vem aberta, como no pacote; ao abrir outra, ela se recolhe para as bolhas não se sobreporem
  const [fixa, setFixa] = useState(true);
  const recolher = () => setFixa(false);
  return (
    <div className="neu-row" style={{ gap: 40, paddingTop: 48, justifyContent: "center" }}>
      <Dica texto="Visualizar detalhes" fixa={fixa}>
        <Button size="icon" variant="outline" className="neu-ib neu-btn--convex" aria-label="Visualizar">
          <Search aria-hidden="true" size={18} />
        </Button>
      </Dica>
      <Dica texto="Editar registro" aoAbrir={recolher}>
        <Button size="icon" variant="outline" className="neu-ib neu-btn--convex" aria-label="Editar">
          <Pencil aria-hidden="true" size={18} />
        </Button>
      </Dica>
      <Dica texto="Excluir" aoAbrir={recolher}>
        <Button size="icon" variant="destructive" className="neu-ib" aria-label="Excluir">
          <Trash2 aria-hidden="true" size={18} />
        </Button>
      </Dica>
    </div>
  );
}

export default function NeumorfismoTooltips() {
  return (
    <ComponentPreview
      title="Tooltip"
      description="Bolha pequena com ponta que aparece sobre o gatilho ao passar o mouse ou ao focar pelo teclado. Serve para nomear ações só de ícone."
      whenToUse={["Explicar ícones sem rótulo", "Informações complementares breves, de duas a quatro palavras"]}
      whenNotToUse={["Informação essencial (deve estar visível)", "Conteúdo longo (use popover)"]}
      accessibility={["O gatilho é ligado à dica por aria-describedby (Radix); botão só de ícone leva também aria-label", "Abre também pelo foco do teclado e fecha com Esc", "Nunca esconda informação essencial na dica: em telas de toque ela não aparece"]}
      code={`<Dica texto="Visualizar detalhes" fixa>
  <Button size="icon" variant="outline" className="neu-ib neu-btn--convex" aria-label="Visualizar">
    <Search aria-hidden="true" size={18} />
  </Button>
</Dica>
<Dica texto="Editar registro">…</Dica>
<Dica texto="Excluir">…</Dica>`}
    >
      <ExemploDicas />
    </ComponentPreview>
  );
}
