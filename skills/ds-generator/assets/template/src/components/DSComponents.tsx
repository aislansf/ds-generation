import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "html", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="rounded-lg border border-border overflow-hidden my-4">
      {title && (
        <div className="bg-muted px-4 py-2 text-xs font-medium text-muted-foreground flex items-center justify-between border-b border-border">
          <span>{title}</span>
          <span className="opacity-50">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="bg-foreground/[0.03] p-4 overflow-x-auto text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm border ${
            copied
              ? "bg-success/10 text-success border-success/30"
              : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          }`}
          aria-label={copied ? "Código copiado" : "Copiar código"}
          title={copied ? "Copiado!" : "Copiar código"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? "Copiado" : "Copiar"}</span>
        </button>
      </div>
    </div>
  );
}

interface ComponentPreviewProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  code?: string;
  whenToUse?: string[];
  whenNotToUse?: string[];
  accessibility?: string[];
}

export function ComponentPreview({
  title,
  description,
  children,
  code,
  whenToUse,
  whenNotToUse,
  accessibility,
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="brand-card mb-8 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

      {/* Preview */}
      <div className="border border-border rounded-lg p-6 bg-background mb-3">
        {children}
      </div>

      {/* Toggle code */}
      {code && (
        <>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-xs font-medium text-primary hover:underline mb-2"
          >
            {showCode ? "Ocultar código" : "Ver código"}
          </button>
          {showCode && <CodeBlock code={code} />}
        </>
      )}

      {/* Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {whenToUse && whenToUse.length > 0 && (
          <div className="text-xs">
            <p className="font-semibold text-success mb-1">✓ Quando usar</p>
            <ul className="space-y-1 text-muted-foreground">
              {whenToUse.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
        )}
        {whenNotToUse && whenNotToUse.length > 0 && (
          <div className="text-xs">
            <p className="font-semibold text-error mb-1">✗ Quando não usar</p>
            <ul className="space-y-1 text-muted-foreground">
              {whenNotToUse.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
        )}
      </div>
      {accessibility && accessibility.length > 0 && (
        <div className="mt-3 text-xs">
          <p className="font-semibold text-info mb-1">♿ Acessibilidade</p>
          <ul className="space-y-1 text-muted-foreground">
            {accessibility.map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Badge/Tag amigável usado SEMPRE antes do título principal de páginas e seções.
 * Padrão do Design System: uppercase, tracking largo, accent primário com leve
 * background — funciona em light e dark mode.
 */
function TitleTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

export function SectionHeader({
  id,
  title,
  description,
  badge,
}: {
  id: string;
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <div id={id} className="scroll-mt-20 mb-8 pt-4">
      {badge && <TitleTag>{badge}</TitleTag>}
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      {description && <p className="text-muted-foreground max-w-3xl">{description}</p>}
      <div className="h-px bg-border mt-4" />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="mb-10">
      {badge && <TitleTag>{badge}</TitleTag>}
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed mt-2">
        {description}
      </p>
    </div>
  );
}
