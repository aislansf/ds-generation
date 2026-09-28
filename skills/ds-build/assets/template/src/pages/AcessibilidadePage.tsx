import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";

export default function AcessibilidadePage() {
  return (
    <div>
      <SEO
        title="Acessibilidade — Design System __BRAND_SHORT__"
        description="Diretrizes WCAG 2.1 AA do __BRAND_NAME__: contraste, navegação por teclado, ARIA, foco visível e semântica em ambos os modos claro e escuro."
        path="/acessibilidade"
      />
      <PageHeader badge="WCAG 2.1 · AA" title="Acessibilidade" description="Todo produto digital do __BRAND_NAME__ deve nascer acessível. Seguimos as diretrizes WCAG 2.1 nível AA como padrão mínimo, em ambos os modos claro e escuro." />

      <SectionHeader id="contraste" title="Contraste" description="Textos devem atender ao contraste mínimo AA do WCAG 2.1 em ambos os temas." />
      <div className="brand-card mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-20 h-10 rounded flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">AA ✓</div>
            <p className="text-sm text-muted-foreground">Texto foreground sobre Primary — adequado em ambos os temas</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-10 rounded flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground">AA ✓</div>
            <p className="text-sm text-muted-foreground">Texto foreground sobre Secondary — adequado para texto grande</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-10 rounded flex items-center justify-center text-xs font-bold bg-card text-foreground border border-border">AA ✓</div>
            <p className="text-sm text-muted-foreground">Texto foreground sobre Card — adaptativo ao tema</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-accent">
          <p className="text-xs text-accent-foreground"><strong>Dica:</strong> Com o dark mode, todos os tokens de cor foram calibrados para manter contraste AA. Sempre use tokens semânticos em vez de cores fixas.</p>
        </div>
      </div>

      <SectionHeader id="foco" title="Foco Visível" description="Todo elemento interativo deve ter um indicador de foco visível para navegação por teclado." />
      <div className="brand-card mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
            Clique ou use Tab
          </button>
          <input placeholder="Campo com foco visível" className="border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
        </div>
        <CodeBlock code={`/* Padrão de foco visível — funciona em ambos os temas */
.interactive-element:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--background)),
              0 0 0 4px hsl(var(--ring));
}

/* Com Tailwind */
className="focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"`} language="css" />
      </div>

      <SectionHeader id="teclado" title="Navegação por Teclado" />
      <div className="brand-card mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-semibold text-xs">Tecla</th>
              <th className="text-left py-2 font-semibold text-xs">Ação</th>
            </tr></thead>
            <tbody>
              {[
                { key: "Tab", action: "Navegar para o próximo elemento focável" },
                { key: "Shift + Tab", action: "Navegar para o elemento focável anterior" },
                { key: "Enter / Space", action: "Ativar botão ou link" },
                { key: "Escape", action: "Fechar modal, dropdown ou tooltip" },
                { key: "Setas ↑↓", action: "Navegar entre opções em menus e selects" },
                { key: "Setas ←→", action: "Navegar entre abas (tabs)" },
                { key: "Home / End", action: "Ir para primeiro/último item" },
              ].map(k => (
                <tr key={k.key} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4"><kbd className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{k.key}</kbd></td>
                  <td className="py-2 text-muted-foreground text-xs">{k.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionHeader id="dark-mode" title="Dark Mode e Acessibilidade" />
      <div className="brand-card mb-8">
        <h4 className="text-sm font-semibold mb-3">Diretrizes para implementação com temas</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Nunca use cores fixas (ex: <code className="bg-muted px-1 rounded text-xs">#000000</code>) em componentes — sempre use tokens semânticos</li>
          <li>• Verifique contraste em ambos os temas antes de aprovar um componente</li>
          <li>• O ring de foco usa <code className="bg-muted px-1 rounded text-xs">ring-offset-background</code> para adaptar-se ao fundo do tema</li>
          <li>• Bordas usam o token <code className="bg-muted px-1 rounded text-xs">--border</code> que ajusta leveza/escuridão automaticamente</li>
          <li>• Sombras no dark mode usam opacidades maiores para compensar fundos escuros</li>
        </ul>
      </div>

      <SectionHeader id="semantica" title="Semântica HTML" />
      <div className="brand-card mb-8">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use heading hierarchy correta (h1 → h2 → h3, sem pular níveis)</li>
          <li>• Use <code className="bg-muted px-1 rounded text-xs">&lt;nav&gt;</code>, <code className="bg-muted px-1 rounded text-xs">&lt;main&gt;</code>, <code className="bg-muted px-1 rounded text-xs">&lt;aside&gt;</code>, <code className="bg-muted px-1 rounded text-xs">&lt;footer&gt;</code> para landmarks</li>
          <li>• Labels associadas a inputs via <code className="bg-muted px-1 rounded text-xs">htmlFor</code> / <code className="bg-muted px-1 rounded text-xs">id</code></li>
          <li>• Tabelas com <code className="bg-muted px-1 rounded text-xs">&lt;caption&gt;</code>, <code className="bg-muted px-1 rounded text-xs">&lt;thead&gt;</code>, <code className="bg-muted px-1 rounded text-xs">&lt;th scope&gt;</code></li>
          <li>• Imagens com <code className="bg-muted px-1 rounded text-xs">alt</code> descritivo (ou vazio para decorativas)</li>
          <li>• Listas com <code className="bg-muted px-1 rounded text-xs">&lt;ul&gt;</code>/<code className="bg-muted px-1 rounded text-xs">&lt;ol&gt;</code>/<code className="bg-muted px-1 rounded text-xs">&lt;li&gt;</code></li>
        </ul>
      </div>

      <SectionHeader id="aria" title="ARIA" />
      <div className="brand-card mb-4">
        <h4 className="text-sm font-semibold mb-2">O que significa ARIA?</h4>
        <p className="ds-body text-muted-foreground mb-2">
          <strong>ARIA</strong> é a sigla para <strong>Accessible Rich Internet Applications</strong>{"\u00a0"}(Aplicações de Internet Ricas e Acessíveis), uma especificação do W3C/WAI que define atributos HTML extras — como <code className="bg-muted px-1 rounded text-xs">role</code>,
          <code className="bg-muted px-1 rounded text-xs">aria-label</code> e
          <code className="bg-muted px-1 rounded text-xs">aria-expanded</code> — para descrever
          o papel, o estado e as propriedades de componentes interativos a tecnologias
          assistivas (leitores de tela, navegação por teclado, dispositivos braille).
        </p>
        <p className="ds-body-small text-muted-foreground">
          Regra de ouro: prefira sempre o HTML semântico nativo
          (<code className="bg-muted px-1 rounded text-xs">&lt;button&gt;</code>,
          <code className="bg-muted px-1 rounded text-xs">&lt;nav&gt;</code>,
          <code className="bg-muted px-1 rounded text-xs">&lt;label&gt;</code>). Use ARIA apenas
          para complementar — nunca para substituir — a semântica nativa.
        </p>
      </div>
      <div className="brand-card mb-8">
        <h4 className="text-sm font-semibold mb-3">Padrões ARIA obrigatórios por componente</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-semibold text-xs">Componente</th>
              <th className="text-left py-2 font-semibold text-xs">Atributos ARIA</th>
            </tr></thead>
            <tbody>
              {[
                { comp: "Accordion", aria: "aria-expanded, aria-controls" },
                { comp: "Modal", aria: "aria-modal, aria-labelledby, role='dialog'" },
                { comp: "Tabs", aria: "role='tablist', role='tab', role='tabpanel', aria-selected" },
                { comp: "Switch", aria: "role='switch', aria-checked" },
                { comp: "Toast", aria: "role='status', aria-live='polite'" },
                { comp: "Tooltip", aria: "role='tooltip', aria-describedby" },
                { comp: "Breadcrumb", aria: "aria-label='Breadcrumb', aria-current='page'" },
                { comp: "Alert", aria: "role='alert'" },
                { comp: "Theme Toggle", aria: "aria-label dinâmico indicando ação" },
              ].map(a => (
                <tr key={a.comp} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium text-xs">{a.comp}</td>
                  <td className="py-2 text-muted-foreground text-xs"><code>{a.aria}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionHeader id="alvos" title="Alvos Clicáveis" />
      <div className="brand-card">
        <p className="text-sm text-muted-foreground mb-3">
          Todo alvo clicável deve ter no mínimo <strong>44×44 pixels</strong> de área tocável, conforme WCAG 2.5.8. Isso inclui botões, links, checkboxes, o toggle de tema e áreas de ação em dispositivos touch.
        </p>
        <p className="text-sm text-muted-foreground">
          Mensagens de erro devem ser associadas ao campo via <code className="bg-muted px-1 rounded text-xs">aria-describedby</code> e anunciadas com <code className="bg-muted px-1 rounded text-xs">role="alert"</code>.
        </p>
      </div>
    </div>
  );
}
