import { PageHeader, SectionHeader } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";
import { BarChart3, Code2, ExternalLink, Layout, ListChecks, MessageSquare, Play, Settings } from "lucide-react";

export default function PowerBIMappingPage() {
  const steps = [
    {
      icon: <Settings size={20} className="text-primary" />,
      title: "1. Preparação do Modelo",
      desc: "Certifique-se de que suas medidas DAX estão criadas e formatadas. Para o Radar Estratégico, você precisará de medidas de Despesa, Receita, Saldo e Atendimento.",
    },
    {
      icon: <Layout size={20} className="text-primary" />,
      title: "2. Adição do Visual",
      desc: "Importe o visual 'HTML Content' da AppSource. Ele é o motor que renderiza nosso código HTML/CSS respeitando os tokens do __BRAND_SHORT__.",
    },
    {
      icon: <Code2 size={20} className="text-primary" />,
      title: "3. Aplicação do Template",
      desc: "Use a medida DAX fornecida nos Docs do Radar para injetar o HTML. O template usa CSS inline para garantir que o estilo não 'quebre' no sandbox do Power BI.",
    },
    {
      icon: <Play size={20} className="text-primary" />,
      title: "4. Mapeamento Dinâmico",
      desc: "Substitua os placeholders no código HTML pelas suas medidas usando a função FORMAT do DAX para manter a máscara de moeda/número.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      <SEO
        title="Mapeamento Power BI | Design System __BRAND_NAME__"
        description="Guia passo a passo para integrar tokens e componentes do Design System __BRAND_SHORT__ no Power BI usando o visual HTML Content."
        path="/modelos-bi/mapeamento"
      />

      <PageHeader
        badge="Guia de Integração"
        title="Mapeamento Power BI"
        description="Aprenda como levar a identidade visual do __BRAND_SHORT__ para dentro dos seus relatórios Power BI, garantindo consistência entre sistemas web e dashboards executivos."
      />

      <section className="space-y-6">
        <SectionHeader
          id="passo-a-passo"
          badge="Implementação"
          title="Fluxo de Trabalho"
          description="Siga estas etapas para configurar o visual HTML Content com os padrões do Design System."
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <div key={i} className="brand-card flex gap-4 items-start">
              <div className="mt-1 p-2 rounded-lg bg-primary/10">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-lg text-primary">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          id="exemplo-radar"
          badge="Exemplo Prático"
          title="Integração Radar Estratégico"
          description="Como o modelo Radar Estratégico utiliza o mapeamento para exibir KPIs dinâmicos."
        />
        
        <div className="brand-card bg-primary/5 border-primary/20 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BarChart3 size={24} />
            <h3 className="font-heading text-xl">DDA (Data-Driven Aesthetics)</h3>
          </div>
          <p className="text-sm leading-relaxed">
            No Radar Estratégico, não renderizamos apenas texto. Utilizamos o mapeamento para que a cor do indicador (verde/vermelho) mude baseada na variação percentual entre a <strong>Meta</strong> e o <strong>Realizado</strong>, tudo via lógica DAX injetada no HTML.
          </p>
          <div className="bg-background rounded-md p-4 font-mono text-xs border border-border overflow-x-auto leading-relaxed">
            <span className="text-muted-foreground">-- Exemplo de lógica de cor dinâmica no Power BI</span><br/>
            VAR CorVariacao = IF([Var %] &gt; 0, "#10B981", "#EF4444")<br/>
            VAR BadgeHtml = "&lt;span style='color:" &amp; CorVariacao &amp; "'&gt;" &amp; FORMAT([Var %], "0%") &amp; "&lt;/span&gt;"
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          id="recursos"
          badge="Recursos"
          title="Links Úteis"
          description="Documentação complementar e ferramentas para auxiliar no mapeamento."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <a 
            href="/modelos-bi/radar-estrategico/docs" 
            className="brand-card hover:border-primary transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <Code2 className="text-primary" size={20} />
              <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition" />
            </div>
            <h4 className="font-semibold text-sm">Docs Radar</h4>
            <p className="text-xs text-muted-foreground mt-1">Snippets DAX e lógica de placeholders.</p>
          </a>
          <a 
            href="https://apps.microsoft.com/store/detail/html-content/XP88B58L05C29B" 
            target="_blank" 
            rel="noreferrer"
            className="brand-card hover:border-primary transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <Layout className="text-primary" size={20} />
              <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition" />
            </div>
            <h4 className="font-semibold text-sm">Visual HTML Content</h4>
            <p className="text-xs text-muted-foreground mt-1">Link oficial na Microsoft AppSource.</p>
          </a>
          <div className="brand-card">
            <div className="flex justify-between items-start mb-2">
              <MessageSquare className="text-primary" size={20} />
            </div>
            <h4 className="font-semibold text-sm">Suporte Interno</h4>
            <p className="text-xs text-muted-foreground mt-1">Dúvidas sobre tokens no Power BI? Procure o time de UX.</p>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-warning/30 bg-warning/5 p-6 flex gap-4">
        <div className="mt-1">
          <ListChecks className="text-warning" size={24} />
        </div>
        <div className="space-y-2">
          <h4 className="font-heading text-lg text-warning-foreground">Checklist de Consistência</h4>
          <ul className="text-sm space-y-1 text-warning-foreground/80 list-disc list-inside">
            <li>As fontes estão carregando corretamente (__FONT_PRIMARY__/Poppins)?</li>
            <li>As cores HEX batem com os tokens do DS __BRAND_SHORT__?</li>
            <li>Os raios de borda (border-radius) seguem o padrão 8px?</li>
            <li>O contraste está em conformidade com WCAG AA?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
