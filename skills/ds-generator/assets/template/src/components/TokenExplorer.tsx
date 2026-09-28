import { useState } from "react";
import { Copy, Check, Palette, Type, Move, Square } from "lucide-react";

type TabId = "cores" | "tipografia" | "espacamento" | "bordas";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "cores", label: "Cores", icon: <Palette size={14} /> },
  { id: "tipografia", label: "Tipografia", icon: <Type size={14} /> },
  { id: "espacamento", label: "Espaçamento", icon: <Move size={14} /> },
  { id: "bordas", label: "Bordas & Raios", icon: <Square size={14} /> },
];

const colorTokens = [
  { token: "--primary", className: "bg-primary text-primary-foreground", label: "Primary" },
  { token: "--secondary", className: "bg-secondary text-secondary-foreground", label: "Secondary" },
  { token: "--muted", className: "bg-muted text-muted-foreground", label: "Muted" },
  { token: "--accent", className: "bg-accent text-foreground", label: "Accent" },
  { token: "--card", className: "bg-card text-foreground border border-border", label: "Card" },
  { token: "--success", className: "bg-success text-white", label: "Success" },
  { token: "--warning", className: "bg-warning text-white", label: "Warning" },
  { token: "--error", className: "bg-error text-white", label: "Error" },
  { token: "--info", className: "bg-info text-white", label: "Info" },
];

const fontSizes = [
  { token: "text-xs", value: "0.75rem", label: "Extra Small" },
  { token: "text-sm", value: "0.875rem", label: "Small" },
  { token: "text-base", value: "1rem", label: "Base" },
  { token: "text-lg", value: "1.125rem", label: "Large" },
  { token: "text-xl", value: "1.25rem", label: "XL" },
  { token: "text-2xl", value: "1.5rem", label: "2XL" },
  { token: "text-3xl", value: "1.875rem", label: "3XL" },
  { token: "text-4xl", value: "2.25rem", label: "4XL" },
];

const spacings = [
  { token: "p-1", px: 4 },
  { token: "p-2", px: 8 },
  { token: "p-3", px: 12 },
  { token: "p-4", px: 16 },
  { token: "p-6", px: 24 },
  { token: "p-8", px: 32 },
  { token: "p-12", px: 48 },
  { token: "p-16", px: 64 },
];

const radii = [
  { token: "rounded-sm", value: "2px" },
  { token: "rounded", value: "4px" },
  { token: "rounded-md", value: "6px" },
  { token: "rounded-lg", value: "8px" },
  { token: "rounded-xl", value: "12px" },
  { token: "rounded-2xl", value: "16px" },
  { token: "rounded-3xl", value: "24px" },
  { token: "rounded-full", value: "9999px" },
];

function CopyChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-muted hover:bg-muted/70 text-foreground px-2 py-1 rounded border border-border transition-colors"
      title="Copiar"
    >
      <code>{value}</code>
      {copied ? <Check size={10} className="text-success" /> : <Copy size={10} className="opacity-60" />}
    </button>
  );
}

export default function TokenExplorer() {
  const [tab, setTab] = useState<TabId>("cores");
  const [fontScale, setFontScale] = useState(1);
  const [activeRadius, setActiveRadius] = useState("rounded-lg");

  return (
    <div className="brand-card mb-10">
      <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Explorador de Tokens</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Visualize, ajuste e copie tokens com exemplos vivos.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-muted/30 p-1 rounded-lg mb-6 border border-border w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[280px]">
        {/* CORES */}
        {tab === "cores" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorTokens.map((c) => (
                <div key={c.token} className="border border-border rounded-lg overflow-hidden">
                  <div className={`${c.className} h-20 flex items-center justify-center font-bold text-sm`}>
                    {c.label}
                  </div>
                  <div className="p-2 bg-card flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground">Token</span>
                    <CopyChip value={c.token} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <p className="text-xs font-semibold mb-2">Como usar:</p>
              <code className="text-[11px] block bg-background p-2 rounded border border-border font-mono">
                {"<div className=\"bg-primary text-primary-foreground\">Conteúdo</div>"}
              </code>
              <code className="text-[11px] block bg-background p-2 rounded border border-border font-mono mt-2">
                {".elemento { color: hsl(var(--primary)); }"}
              </code>
            </div>
          </div>
        )}

        {/* TIPOGRAFIA */}
        {tab === "tipografia" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
              <span className="text-xs font-semibold">Escala dinâmica:</span>
              <input
                type="range"
                min={0.75}
                max={1.5}
                step={0.05}
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded min-w-[50px] text-center">
                {fontScale.toFixed(2)}x
              </span>
            </div>
            <div className="space-y-2">
              {fontSizes.map((f) => (
                <div key={f.token} className="flex items-baseline gap-4 p-3 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="w-32 shrink-0 space-y-1">
                    <CopyChip value={f.token} />
                    <p className="text-[10px] text-muted-foreground">{f.value} · {f.label}</p>
                  </div>
                  <p
                    className="font-medium flex-1 truncate"
                    style={{ fontSize: `calc(${f.value} * ${fontScale})` }}
                  >
                    Transformando vidas
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESPAÇAMENTO */}
        {tab === "espacamento" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {spacings.map((s) => (
                <div key={s.token} className="border border-border rounded-lg p-3 bg-card text-center space-y-2">
                  <div className="bg-muted/40 rounded flex items-center justify-center mx-auto" style={{ padding: s.px }}>
                    <div className="bg-primary rounded w-8 h-8" />
                  </div>
                  <CopyChip value={s.token} />
                  <p className="text-[10px] text-muted-foreground">{s.px}px</p>
                </div>
              ))}
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <p className="text-xs font-semibold mb-2">Padrão de uso (gap, padding, margin):</p>
              <code className="text-[11px] block bg-background p-2 rounded border border-border font-mono">
                {"<section className=\"p-6 space-y-4\"> ... </section>"}
              </code>
            </div>
          </div>
        )}

        {/* BORDAS */}
        {tab === "bordas" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {radii.map((r) => (
                <button
                  key={r.token}
                  onClick={() => setActiveRadius(r.token)}
                  className={`border-2 transition-all p-4 text-center space-y-2 ${
                    activeRadius === r.token ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                  }`}
                  style={{ borderRadius: r.value }}
                >
                  <div className="bg-primary/20 mx-auto h-12 w-full" style={{ borderRadius: r.value }} />
                  <p className="text-[11px] font-mono font-bold">{r.token}</p>
                  <p className="text-[10px] text-muted-foreground">{r.value}</p>
                </button>
              ))}
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold">Preview ao vivo:</span>
                <div
                  className={`bg-primary text-primary-foreground px-4 py-2 text-xs font-bold ${activeRadius}`}
                >
                  Botão de exemplo
                </div>
              </div>
              <code className="text-[11px] block bg-background p-2 rounded border border-border font-mono">
                {`<button className="bg-primary text-primary-foreground ${activeRadius}">...</button>`}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
