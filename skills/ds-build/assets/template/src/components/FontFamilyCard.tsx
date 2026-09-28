import { BarChart3, Monitor, FileText, Check as CheckIcon, X as XIcon, Download as DownloadIcon } from "lucide-react";
import { CodeBlock } from "@/components/DSComponents";

export interface FontFamilyCardProps {
  badge: string;
  badgeClass: string;
  source: string;
  name: string;
  fontStack: string;
  summary: string;
  weights: { v: number; name: string }[];
  bestFor: string[];
  avoidFor: string[];
  powerBi: string;
  cssVar: string;
  tailwindClass: string;
  cssSnippet: string;
  htmlSnippet: string;
  tokenSnippet: string;
  footnote?: string;
  downloads: { label: string; url: string; note?: string }[];
}

/**
 * FontFamilyCard — card institucional reutilizável para apresentar uma
 * família tipográfica do Design System __BRAND_NAME__ (identidade, pesos,
 * tokens, exemplos aplicados, snippets e downloads oficiais).
 *
 * Mantém wrapper `.brand-card w-full h-full` para garantir paridade
 * visual com os demais cards do DS em qualquer página/contexto.
 */
export function FontFamilyCard({
  badge, badgeClass, source, name, fontStack, summary, weights,
  bestFor, avoidFor, powerBi, cssVar, tailwindClass,
  cssSnippet, htmlSnippet, tokenSnippet, footnote,
  downloads,
}: FontFamilyCardProps) {
  return (
    <div className="brand-card w-full h-full min-w-0 flex flex-col p-5 sm:p-6 md:p-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${badgeClass} px-2 py-1 rounded`}>
          {badge}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">{source}</span>
      </div>

      <div className="flex flex-col gap-8 w-full flex-1">
        {/* BLOCO 1 — Identidade da fonte */}
        <div className="border-b border-border pb-8">
          <h3 className="ds-heading-section mb-2 break-words" style={{ fontFamily: fontStack }}>
            {name}
          </h3>
          <p className="ds-body-small text-muted-foreground mb-5">{summary}</p>

          <div className="space-y-2 mb-5 pb-5 border-b border-border" style={{ fontFamily: fontStack }}>
            <p className="ds-body-lead break-all">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="ds-body-lead break-all">abcdefghijklmnopqrstuvwxyz</p>
            <p className="ds-body-lead">0123456789 — &amp; ! ? @ #</p>
          </div>

          <div className="mb-5">
            <h5 className="ds-heading-eyebrow text-muted-foreground mb-2">Pesos disponíveis</h5>
            <div className="flex flex-col gap-1.5 text-sm" style={{ fontFamily: fontStack }}>
              {weights.map(w => (
                <div key={w.v} style={{ fontWeight: w.v }}>{w.v} — {w.name}</div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-[11px]">
            <div className="rounded border border-border bg-muted/40 p-2">
              <p className="font-bold uppercase tracking-wider text-muted-foreground mb-0.5">CSS Var</p>
              <code className="font-mono text-primary">{cssVar}</code>
            </div>
            <div className="rounded border border-border bg-muted/40 p-2">
              <p className="font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Tailwind</p>
              <code className="font-mono text-primary">{tailwindClass}</code>
            </div>
          </div>
        </div>

        {/* BLOCO 2 — Onde aplicar + snippets */}
        <div className="space-y-4">
          {/* Exemplos visuais aplicados */}
          <div className="rounded-lg border border-border bg-background p-4 space-y-3">
            <h5 className="ds-heading-eyebrow text-muted-foreground">Exemplos aplicados</h5>
            <div style={{ fontFamily: fontStack }}>
              <h4 className="ds-heading-subsection">__BRAND_SLOGAN__</h4>
              <p className="ds-body-small mt-1 text-muted-foreground">
                Texto de apoio em {name} demonstrando legibilidade em parágrafos e UI institucional do __BRAND_NAME__.
              </p>
              <div className="flex items-baseline gap-3 mt-3 pt-3 border-t border-border">
                <span className="text-4xl font-bold text-primary">87%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">KPI em destaque</span>
              </div>
            </div>
          </div>

          {/* Onde aplicar */}
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-success/30 bg-success/5 p-3">
              <h5 className="ds-heading-eyebrow text-success mb-2 flex items-center gap-1">
                <CheckIcon size={12} /> Onde usar
              </h5>
              <ul className="space-y-1 text-xs text-foreground/80">
                {bestFor.map(b => <li key={b} className="flex gap-1.5"><span className="text-success">•</span>{b}</li>)}
              </ul>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <h5 className="ds-heading-eyebrow text-destructive mb-2 flex items-center gap-1">
                <XIcon size={12} /> Evitar
              </h5>
              <ul className="space-y-1 text-xs text-foreground/80">
                {avoidFor.map(b => <li key={b} className="flex gap-1.5"><span className="text-destructive">•</span>{b}</li>)}
              </ul>
            </div>
          </div>

          {/* Contextos específicos */}
          <div className="flex flex-col gap-2 text-[11px]">
            <div className="rounded border border-border bg-muted/30 p-2">
              <p className="font-bold flex items-center gap-1 mb-1"><BarChart3 size={11} /> Power BI</p>
              <p className="ds-body-small text-muted-foreground">{powerBi}</p>
            </div>
            <div className="rounded border border-border bg-muted/30 p-2">
              <p className="font-bold flex items-center gap-1 mb-1"><Monitor size={11} /> Web / App</p>
              <p className="ds-body-small text-muted-foreground">Funciona em desktop, tablet e mobile via classes Tailwind ou variável CSS. Mantém peso visual consistente em todos os breakpoints.</p>
            </div>
            <div className="rounded border border-border bg-muted/30 p-2">
              <p className="font-bold flex items-center gap-1 mb-1"><FileText size={11} /> Docs / PDF</p>
              <p className="ds-body-small text-muted-foreground">Embutir via @font-face ou converter para SVG/outline em materiais impressos para preservar a renderização.</p>
            </div>
          </div>

          {/* Snippets copia e cola */}
          <div className="space-y-0">
            <CodeBlock title={`Token CSS — ${name}`} language="css" code={tokenSnippet} />
            <CodeBlock title={`CSS puro — ${name}`} language="css" code={cssSnippet} />
            <CodeBlock title={`HTML standalone — ${name}`} language="html" code={htmlSnippet} />
          </div>

          {/* Downloads oficiais */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <h5 className="ds-heading-eyebrow text-primary mb-2 flex items-center gap-1">
              <DownloadIcon size={12} /> Download oficial — {name}
            </h5>
            <div className="flex flex-col gap-2">
              {downloads.map(d => (
                <a
                  key={d.url}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-xs hover:bg-background rounded px-2 py-1.5 transition-colors group"
                >
                  <DownloadIcon size={12} className="mt-0.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground group-hover:text-primary block">{d.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground break-all">{d.url}</span>
                    {d.note && <span className="block text-[10px] text-muted-foreground italic mt-0.5">{d.note}</span>}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {footnote && (
            <p className="text-[11px] text-muted-foreground italic pt-2 border-t border-border">{footnote}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FontFamilyCard;