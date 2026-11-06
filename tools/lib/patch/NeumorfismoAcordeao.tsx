import { ComponentPreview } from "@/components/DSComponents";
import { NeumorfismoAccordion } from "@/components/estilo/NeumorfismoNavegacao";

/**
 * Cartão "Accordion" no estilo Neumorfismo (componente Accordion do pacote Neumorphic UI v3.2.0): as duas
 * disposições (cartões convexos separados e bloco agrupado) vêm de NeumorfismoNavegacao; aqui só o cartão, com o
 * texto de uso, a acessibilidade e o código da API. Só é usado quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */
export default function NeumorfismoAcordeao() {
  return (
    <ComponentPreview
      title="Accordion"
      description="Perguntas ou tópicos que se expandem, um aberto por vez. Duas disposições: cartões convexos separados, onde a resposta abre num painel escavado, e um bloco agrupado, com os itens separados por fendas de 1px."
      whenToUse={[
        "FAQ e páginas de ajuda: no agrupado, as perguntas se leem como uma lista só",
        "Conteúdo secundário ou complementar que a maioria não precisa ver de cara",
        "Cartões separados: quando cada item se sustenta sozinho no fundo da página",
      ]}
      whenNotToUse={["Informação essencial: ela precisa estar visível", "Um único bloco que abre e fecha: use o Collapsible", "Etapas em ordem: use o Stepper"]}
      accessibility={[
        "O gatilho é um botão de verdade com aria-expanded e aria-controls apontando para o painel",
        "O painel é uma região (role=\"region\") rotulada pelo gatilho; Enter e Espaço abrem e fecham",
        "Um item aberto por vez; clicar no aberto o fecha",
        "O chevron inverte e, no cartão, muda para a cor da marca: o estado também está em aria-expanded, nunca só na cor",
        "O anel de foco entra por dentro do gatilho, para não ser cortado pela borda do cartão",
      ]}
      code={`const itens = [
  { title: "O que é o programa?", content: "Uma iniciativa que promove a competitividade dos pequenos negócios." },
  { title: "Como o programa apoia o meu negócio?", content: "Cursos, consultorias, eventos e crédito orientado." },
  { title: "Quais soluções estão disponíveis?", content: "Educação empreendedora, transformação digital e liderança." },
];

<Acordeao itens={itens} />
<Acordeao itens={itens} agrupado />`}
    >
      <NeumorfismoAccordion />
    </ComponentPreview>
  );
}
