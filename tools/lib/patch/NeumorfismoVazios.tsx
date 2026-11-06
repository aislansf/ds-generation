import type { ReactNode } from "react";
import { Inbox, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do EmptyState no estilo Neumorfismo (componente EmptyState do pacote Neumorphic UI v3.2.0): um
 * resultado vazio explicado, em dois formatos. O poço (padrão) é uma área escavada com um ícone convexo grande,
 * o título, uma frase útil e uma ação de recuperação convexa na cor da marca; serve para uma página inteira sem
 * resultados. O tracejado é o espaço reservado onde o conteúdo vai aparecer: área escavada com borda tracejada
 * de 2px, disco convexo de 72px, título, frase e uma ação na cor da marca; serve dentro de tabelas, listas e
 * painéis vazios. O poço mantém os ganchos data-surface="marca" data-marca="vazio" do DS, para a decoração da
 * marca continuar valendo. Entra no cartão "Empty State" da ComponentesPage e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-empty* vêm de src/styles/estilo.css.
 */

interface EstadoVazioProps {
  variante?: "poco" | "tracejado";
  titulo: string;
  /** O que tentar a seguir */
  children?: ReactNode;
  icone?: ReactNode;
  rotuloAcao?: string;
  iconeAcao?: ReactNode;
  aoAcionar?: () => void;
}

export function EstadoVazio({ variante = "poco", titulo, children, icone, rotuloAcao, iconeAcao, aoAcionar }: EstadoVazioProps) {
  if (variante === "tracejado") {
    return (
      <div className="neu-empty-d" role="status">
        <div className="neu-empty-d__icon">{icone ?? <Inbox aria-hidden="true" size={36} strokeWidth={1.75} />}</div>
        <h4 className="neu-empty-d__title">{titulo}</h4>
        {children && <p className="neu-empty-d__text">{children}</p>}
        {rotuloAcao && (
          <Button type="button" onClick={aoAcionar}>{iconeAcao ?? <Search aria-hidden="true" size={18} />} {rotuloAcao}</Button>
        )}
      </div>
    );
  }
  return (
    <div className="neu-empty" role="status" data-surface="marca" data-marca="vazio">
      <div className="neu-empty__icon">{icone ?? <Search aria-hidden="true" size={36} />}</div>
      <div>
        <h4 className="neu-empty__title">{titulo}</h4>
        {children && <p className="neu-empty__text">{children}</p>}
      </div>
      {rotuloAcao && (
        <Button type="button" variant="outline" size="lg" className="neu-btn--convex neu-empty__acao" onClick={aoAcionar}>
          {iconeAcao ?? <Search aria-hidden="true" size={18} />} {rotuloAcao}
        </Button>
      )}
    </div>
  );
}

const TEXTO = "Tente ajustar os filtros de busca ou verifique se os dados foram carregados corretamente.";

export default function NeumorfismoVazios() {
  return (
    <ComponentPreview
      title="Empty State"
      description="Estado quando não há dados para exibir, em dois formatos: o poço, para uma página inteira sem resultados, e o tracejado, para tabelas, listas e painéis vazios. Diga o que aconteceu e o que tentar a seguir."
      whenToUse={["Listas vazias", "Resultados de busca sem retorno", "Primeiro uso de funcionalidade"]}
      whenNotToUse={["Carregamento em andamento: use o Skeleton ou o Spinner", "Erro de sistema: use o Alert"]}
      accessibility={["role=\"status\": o leitor de tela anuncia o resultado vazio", "O ícone é decorativo; o título e a frase dizem o que aconteceu e o que fazer", "Uma única ação de recuperação, com texto (\"Nova busca\")"]}
      code={`<EstadoVazio titulo="Nenhum resultado encontrado" rotuloAcao="Nova busca" aoAcionar={novaBusca}>
  Tente ajustar os filtros de busca ou verifique se os dados foram carregados corretamente.
</EstadoVazio>

<EstadoVazio variante="tracejado" titulo="Nenhum resultado encontrado" rotuloAcao="Nova busca" aoAcionar={novaBusca}>
  Tente ajustar os filtros de busca ou verifique se os dados foram carregados corretamente.
</EstadoVazio>`}
    >
      <div className="neu-stack" style={{ gap: 32 }}>
        <EstadoVazio titulo="Nenhum resultado encontrado" rotuloAcao="Nova busca">{TEXTO}</EstadoVazio>
        <EstadoVazio variante="tracejado" titulo="Nenhum resultado encontrado" rotuloAcao="Nova busca">{TEXTO}</EstadoVazio>
      </div>
    </ComponentPreview>
  );
}
