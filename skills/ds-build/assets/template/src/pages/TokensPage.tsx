import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";
import TokenExplorer from "@/components/TokenExplorer";
import { tokenGroups, motionTokens } from "@/data/tokenGroups";

export default function TokensPage() {
  return (
    <div>
      <SEO
        title="Design Tokens — Design System __BRAND_SHORT__"
        description="CSS Custom Properties oficiais do __BRAND_NAME__: cores, tipografia, espaçamento, sombras e breakpoints documentados para light e dark mode."
        path="/tokens"
      />
      <PageHeader
        badge="Tokens"
        title="Design Tokens"
        description="Tokens são CSS Custom Properties que definem os valores fundamentais do sistema. Todos os tokens possuem variantes para modo claro e escuro."
      />

      <SectionHeader id="explorer" title="Explorador de Tokens" description="Navegue entre cores, tipografia, espaçamentos e bordas com exemplos vivos. Clique em qualquer token para copiá-lo." />
      <TokenExplorer />

      <CodeBlock
        title="Como usar tokens"
        code={`/* Uso direto em CSS — funciona em ambos os temas automaticamente */
.meu-componente {
  color: hsl(var(--primary));
  background: hsl(var(--background));
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-size: var(--text-sm);
  transition: all var(--duration-normal) var(--ease-default);
}

/* Com Tailwind (via tailwind.config.ts) */
<div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-sm" />

/* Ativar dark mode */
<html class="dark">  <!-- Adiciona classe .dark no root -->`}
        language="css"
      />

      {/* Dark mode explanation */}
      <div className="brand-card mb-8">
        <h3 className="font-semibold mb-2">Como funciona o Dark Mode</h3>
        <p className="text-sm text-muted-foreground mb-3">
          O sistema utiliza a estratégia <code className="bg-muted px-1.5 py-0.5 rounded text-xs">class</code> do Tailwind. 
          Quando a classe <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.dark</code> é adicionada ao <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&lt;html&gt;</code>, 
          todos os tokens CSS são automaticamente substituídos pelas variantes escuras.
        </p>
        <p className="text-sm text-muted-foreground">
          Não é necessário alterar classes nos componentes. Basta usar os tokens semânticos 
          (<code className="bg-muted px-1.5 py-0.5 rounded text-xs">bg-background</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-xs">text-foreground</code>, etc.) 
          e a adaptação é automática.
        </p>
      </div>

      {tokenGroups.map(group => (
        <div key={group.id}>
          <SectionHeader id={group.id} title={group.title} description={'description' in group ? (group as any).description : undefined} />
          <div className="brand-card mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-xs">Token</th>
                    {'lightValue' in (group.tokens[0] || {}) ? (
                      <>
                        <th className="text-left py-2 pr-4 font-semibold text-xs">Light</th>
                        <th className="text-left py-2 pr-4 font-semibold text-xs">Dark</th>
                        <th className="text-left py-2 font-semibold text-xs">Preview</th>
                      </>
                    ) : (
                      <th className="text-left py-2 font-semibold text-xs">Valor</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {group.tokens.map((t: any) => (
                    <tr key={t.name} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{t.name}</code>
                      </td>
                      {t.lightValue ? (
                        <>
                          <td className="py-2 pr-4 text-muted-foreground text-xs">{t.lightValue}</td>
                          <td className="py-2 pr-4 text-muted-foreground text-xs">{t.darkValue}</td>
                          <td className="py-2">
                            <div className="flex gap-1">
                              <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: t.lightHex }} title={`Light: ${t.lightHex}`} />
                              <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: t.darkHex }} title={`Dark: ${t.darkHex}`} />
                            </div>
                          </td>
                        </>
                      ) : (
                        <td className="py-2 text-muted-foreground text-xs">{t.value}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {group.id === "breakpoints" && (
            <div className="brand-card mb-8 space-y-5">
              <div>
                <h4 className="font-semibold mb-1">Como usar na prática</h4>
                <p className="text-sm text-muted-foreground">
                  Com Tailwind, escreva primeiro o estilo para celular e depois aplique
                  variações por prefixo. Cada prefixo é ativado a partir do breakpoint correspondente
                  (min-width).
                </p>
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Layout responsivo (1 → 2 → 4 colunas)
                </h5>
                <CodeBlock
                  language="tsx"
                  code={`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 coluna no celular, 2 a partir de 768px, 4 a partir de 1024px */}
</div>`}
                />
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Esconder/mostrar conforme a tela
                </h5>
                <CodeBlock
                  language="tsx"
                  code={`{/* Menu lateral só no desktop */}
<aside className="hidden lg:block w-64">…</aside>

{/* Botão "menu" só no celular */}
<button className="md:hidden">Abrir menu</button>`}
                />
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Tipografia e espaçamento fluidos
                </h5>
                <CodeBlock
                  language="tsx"
                  code={`<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
  Título que cresce com a tela
</h1>

<section className="py-8 md:py-12 lg:py-20">…</section>`}
                />
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Em CSS puro (usando os tokens)
                </h5>
                <CodeBlock
                  language="css"
                  code={`.cards { grid-template-columns: 1fr; }

@media (min-width: 768px) {  /* --bp-md */
  .cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) { /* --bp-lg */
  .cards { grid-template-columns: repeat(4, 1fr); }
}`}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="brand-card">
        <h4 className="font-semibold mb-2">Durations & Easings</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-xs">Token</th>
                <th className="text-left py-2 font-semibold text-xs">Valor</th>
              </tr>
            </thead>
            <tbody>
              {motionTokens.map(t => (
                <tr key={t.name} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{t.name}</code></td>
                  <td className="py-2 text-muted-foreground text-xs">{t.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
