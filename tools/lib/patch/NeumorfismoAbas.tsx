import { ComponentPreview } from "@/components/DSComponents";
import { NeumorfismoTabs } from "@/components/estilo/NeumorfismoNavegacao";

/**
 * Cartão "Tabs" no estilo Neumorfismo (componente Tabs do pacote Neumorphic UI v3.2.0): as quatro variantes
 * (padrão, linha, segmentada e card) vêm de NeumorfismoNavegacao; aqui só o cartão, com o texto de uso,
 * a acessibilidade e o código da API. Só é usado quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */
export default function NeumorfismoAbas() {
  return (
    <ComponentPreview
      title="Tabs"
      description="Navegação entre painéis de um mesmo contexto. Quatro variantes: padrão (aba em relevo sobre painel afundado), linha, segmentada e card."
      whenToUse={[
        "Organizar conteúdo em categorias na mesma página",
        "Linha: dentro de cartões e páginas de detalhe, onde abas em relevo criariam uma segunda camada",
        "Card: quando as abas são o cartão inteiro, como um resumo de painel",
      ]}
      whenNotToUse={["Etapas que seguem uma ordem (use Stepper)", "Mais de cinco abas ou rótulos longos (use menu ou filtro)"]}
      accessibility={[
        "role=\"tablist\", role=\"tab\" e role=\"tabpanel\"; o painel é rotulado pela aba e recebe foco",
        "Setas esquerda e direita movem e selecionam; Home e End vão às pontas; só a aba ativa está na ordem do Tab",
        "A aba ativa muda de cor e de relevo ou de sublinhado: a cor nunca é o único sinal",
        "No card, abaixo de 480px a faixa se aperta e o rótulo longo quebra em duas linhas em vez de rolar",
      ]}
      code={`const abas = [
  { value: "v", label: "Visão geral", content: "Visão geral do programa." },
  { value: "d", label: "Detalhes", content: "Detalhamento por município." },
  { value: "h", label: "Histórico", content: "Linha do tempo de atendimentos." },
];

<Abas rotulo="Abas padrão" abas={abas} />
<Abas rotulo="Abas em linha" variante="line" abas={abas} />
<Abas rotulo="Abas segmentadas" variante="segmented" abas={abas} />
<Abas rotulo="Abas do card" variante="card" valorInicial="d" abas={abas} />`}
    >
      <NeumorfismoTabs />
    </ComponentPreview>
  );
}
