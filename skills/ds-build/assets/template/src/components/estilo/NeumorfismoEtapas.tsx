import { ComponentPreview } from "@/components/DSComponents";
import { NeumorfismoSteps } from "@/components/estilo/NeumorfismoNavegacao";

/**
 * Cartão "Barra de Etapas (Stepper)" no estilo Neumorfismo (componente Stepper do pacote Neumorphic UI v3.2.0):
 * a trilha horizontal e as etapas verticais (inclusive a compacta) vêm de NeumorfismoNavegacao; aqui só o cartão,
 * com o texto de uso, a acessibilidade e o código da API. Só é usado quando ESTILO.id === "neumorfismo"
 * (ComponentesPage).
 */
export default function NeumorfismoEtapas() {
  return (
    <ComponentPreview
      title="Barra de Etapas (Stepper)"
      description="Progresso em etapas para fluxos longos. Horizontal: uma trilha escavada com preenchimento na cor da marca ligando discos de 40px (concluída enche com ✓, a atual sobe convexa com anel de 2px, as próximas ficam afundadas). Vertical: os mesmos discos numa coluna, com datas, descrições e uma ação na etapa atual."
      whenToUse={["Formulários longos divididos em etapas e assistentes (wizard)", "Vertical: fluxos longos, painéis laterais e processos com datas ou descrições, onde a trilha horizontal truncaria", "Compacto: barras laterais e cartões, com discos de 28px", "Acompanhamento de status de um processo"]}
      whenNotToUse={["Etapas que podem ser feitas em qualquer ordem: use as abas", "Fluxos com menos de três etapas", "Navegar entre páginas irmãs: use o Breadcrumb ou o NavigationMenu"]}
      accessibility={[
        "A navegação é um nav com nome e uma lista ordenada; a etapa atual leva aria-current=\"step\"",
        "Leitores de tela ouvem \"Etapa 2 de 4\" e a palavra do estado (Concluída, Em andamento, Pendente), então o estado nunca depende só da cor",
        "Concluída traz um ✓ no disco; a atual muda de relevo, anel e peso; a pendente fica afundada",
        "A ação da etapa atual (um botão ou um resumo) só aparece nela e fica dentro de um painel em relevo",
        "A trilha vertical acende de cima para baixo até o disco atual, e a animação respeita \"menos movimento\"",
      ]}
      code={`const etapas = [
  { label: "Dados básicos", hint: "Informações" },
  { label: "Documentação", hint: "Upload" },
  { label: "Revisão", hint: "Conferência" },
  { label: "Confirmação", hint: "Envio" },
];

<EtapasHorizontais etapas={etapas} atual={1} />

<EtapasVerticais
  rotulo="Etapas da inscrição"
  atual={2}
  etapas={[
    { label: "Dados básicos", meta: "28/10/2026", description: "Razão social, CNPJ e contato." },
    { label: "Revisão", hint: "Conferência", description: "O consultor confere os dados.", content: <Button size="sm">Continuar revisão</Button> },
  ]}
/>

<EtapasVerticais etapas={etapas} atual={1} compacto rotulo="Etapas compactas" />`}
    >
      <NeumorfismoSteps />
    </ComponentPreview>
  );
}
