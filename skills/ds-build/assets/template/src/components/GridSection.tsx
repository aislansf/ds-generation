import { useState } from "react";
import { CodeBlock } from "@/components/DSComponents";
import { Monitor, Tablet, Smartphone } from "lucide-react";

/* ── Grid column visualizer ── */
function GridVisualizer({ cols, label, gutter = "16px" }: { cols: number; label: string; gutter?: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-foreground mb-2">{label} — {cols} colunas</p>
      <div className="flex rounded-lg overflow-hidden border border-border" style={{ gap: gutter }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-10 bg-primary/15 border border-primary/30 rounded-sm flex items-center justify-center"
          >
            <span className="text-[9px] font-medium text-primary">{i + 1}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">Gutter: {gutter}</p>
    </div>
  );
}

/* ── Dashboard layout skeleton ── */
function DashboardSkeleton({ device, cols, sidebar }: { device: string; cols: number; sidebar: boolean }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Top bar */}
      <div className="h-8 bg-primary/10 border-b border-border flex items-center px-3 gap-2">
        <div className="w-16 h-3 rounded bg-primary/25" />
        <div className="flex-1" />
        <div className="w-6 h-3 rounded bg-primary/20" />
        <div className="w-6 h-3 rounded bg-primary/20" />
      </div>
      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <div className="w-14 md:w-20 border-r border-border bg-muted/30 p-2 space-y-2 shrink-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 rounded bg-muted-foreground/15" />
            ))}
          </div>
        )}
        {/* Content */}
        <div className="flex-1 p-3 space-y-3">
          {/* KPI cards row */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(cols, 4)}, 1fr)` }}>
            {[...Array(Math.min(cols, 4))].map((_, i) => (
              <div key={i} className="h-14 rounded-md border border-border bg-card p-2">
                <div className="w-10 h-2 rounded bg-muted-foreground/20 mb-2" />
                <div className="w-16 h-4 rounded bg-primary/20" />
              </div>
            ))}
          </div>
          {/* Chart + table */}
          <div className="grid gap-2" style={{ gridTemplateColumns: cols >= 8 ? '2fr 1fr' : '1fr' }}>
            <div className="h-24 rounded-md border border-border bg-card p-2">
              <div className="w-20 h-2 rounded bg-muted-foreground/20 mb-2" />
              <div className="flex items-end gap-1 h-14">
                {[40, 65, 50, 80, 55, 70, 90, 60].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-primary/20" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            {cols >= 8 && (
              <div className="h-24 rounded-md border border-border bg-card p-2 space-y-2">
                <div className="w-16 h-2 rounded bg-muted-foreground/20" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-3 rounded bg-muted/80" />
                ))}
              </div>
            )}
          </div>
          {/* Table */}
          <div className="rounded-md border border-border bg-card p-2 space-y-1">
            <div className="flex gap-2">
              {[...Array(Math.min(cols, 5))].map((_, i) => (
                <div key={i} className="flex-1 h-2 rounded bg-muted-foreground/25" />
              ))}
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-2">
                {[...Array(Math.min(cols, 5))].map((_, j) => (
                  <div key={j} className="flex-1 h-2 rounded bg-muted/60" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-muted/20 border-t border-border px-3 py-1">
        <p className="text-[9px] text-muted-foreground text-center">{device}</p>
      </div>
    </div>
  );
}

/* ── Span example ── */
function SpanExample({ cols, spans, label }: { cols: number; spans: { span: number; name: string }[]; label: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {spans.map((s, i) => (
          <div
            key={i}
            className="h-10 rounded border border-primary/40 bg-primary/10 flex items-center justify-center"
            style={{ gridColumn: `span ${s.span}` }}
          >
            <span className="text-[9px] font-medium text-primary">{s.name} ({s.span}/{cols})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GridSection() {
  const [activeTab, setActiveTab] = useState<"structural" | "dashboard" | "spans">("structural");

  const tabs = [
    { id: "structural" as const, label: "Grids Estruturais" },
    { id: "dashboard" as const, label: "Layouts Dashboard" },
    { id: "spans" as const, label: "Spans e Composição" },
  ];

  return (
    <div>
      {/* Spacing scale */}
      <div className="brand-card mb-6">
        <h4 className="text-sm font-semibold mb-4">Escala de espaçamento</h4>
        <div className="space-y-2">
          {[
            { token: "--space-1", value: "4px", rem: "0.25rem" },
            { token: "--space-2", value: "8px", rem: "0.5rem" },
            { token: "--space-3", value: "12px", rem: "0.75rem" },
            { token: "--space-4", value: "16px", rem: "1rem" },
            { token: "--space-6", value: "24px", rem: "1.5rem" },
            { token: "--space-8", value: "32px", rem: "2rem" },
            { token: "--space-10", value: "40px", rem: "2.5rem" },
            { token: "--space-12", value: "48px", rem: "3rem" },
            { token: "--space-16", value: "64px", rem: "4rem" },
          ].map(s => (
            <div key={s.token} className="flex items-center gap-3">
              <code className="text-xs w-28 text-muted-foreground">{s.token}</code>
              <div className="bg-primary/20 h-4 rounded" style={{ width: s.value }} />
              <span className="text-xs text-muted-foreground">{s.value} ({s.rem})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Structural Grids ── */}
      {activeTab === "structural" && (
        <div className="space-y-8">
          {/* Desktop */}
          <div className="brand-card">
            <div className="flex items-center gap-2 mb-4">
              <Monitor size={18} className="text-primary" />
              <h4 className="text-sm font-semibold">Desktop (≥ 1280px)</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Para dashboards e painéis administrativos em desktop, utilize grids de 16 ou 12 colunas com gutter de 24px e margem lateral de 32px.
            </p>
            <GridVisualizer cols={16} label="Grid 16 colunas" gutter="8px" />
            <GridVisualizer cols={12} label="Grid 12 colunas" gutter="12px" />
            <GridVisualizer cols={8} label="Grid 8 colunas (conteúdo central)" gutter="16px" />
          </div>

          {/* Tablet */}
          <div className="brand-card">
            <div className="flex items-center gap-2 mb-4">
              <Tablet size={18} className="text-primary" />
              <h4 className="text-sm font-semibold">Tablet (768px – 1279px)</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Em tablets, utilize grid de 8 colunas com gutter de 16px. Layouts de dashboard devem empilhar cards em 2 colunas e ocultar sidebar em drawer.
            </p>
            <div className="max-w-lg">
              <GridVisualizer cols={8} label="Grid 8 colunas" gutter="12px" />
              <GridVisualizer cols={6} label="Grid 6 colunas (alternativa)" gutter="12px" />
            </div>
          </div>

          {/* Mobile */}
          <div className="brand-card">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={18} className="text-primary" />
              <h4 className="text-sm font-semibold">Mobile (≤ 767px)</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Em dispositivos móveis, utilize grid de 4 colunas com gutter de 16px e margem de 16px. Todos os elementos devem empilhar verticalmente.
            </p>
            <div className="max-w-xs">
              <GridVisualizer cols={4} label="Grid 4 colunas" gutter="12px" />
              <GridVisualizer cols={2} label="Grid 2 colunas (simplificado)" gutter="12px" />
            </div>
          </div>

          {/* Summary table */}
          <div className="brand-card">
            <h4 className="text-sm font-semibold mb-3">Resumo de grids por breakpoint</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Dispositivo</th>
                    <th className="text-left py-2 pr-4 font-semibold">Breakpoint</th>
                    <th className="text-left py-2 pr-4 font-semibold">Colunas</th>
                    <th className="text-left py-2 pr-4 font-semibold">Gutter</th>
                    <th className="text-left py-2 font-semibold">Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { device: "Desktop grande", bp: "≥ 1400px", cols: "16 ou 12", gutter: "24px", margin: "32–64px" },
                    { device: "Desktop", bp: "≥ 1280px", cols: "12", gutter: "24px", margin: "32px" },
                    { device: "Notebook", bp: "≥ 1024px", cols: "12 ou 8", gutter: "20px", margin: "24px" },
                    { device: "Tablet", bp: "≥ 768px", cols: "8 ou 6", gutter: "16px", margin: "24px" },
                    { device: "Mobile landscape", bp: "≥ 640px", cols: "6 ou 4", gutter: "16px", margin: "16px" },
                    { device: "Mobile", bp: "< 640px", cols: "4 ou 2", gutter: "16px", margin: "16px" },
                  ].map(r => (
                    <tr key={r.device} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 font-medium">{r.device}</td>
                      <td className="py-2 pr-4 text-muted-foreground"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.bp}</code></td>
                      <td className="py-2 pr-4 text-muted-foreground">{r.cols}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{r.gutter}</td>
                      <td className="py-2 text-muted-foreground">{r.margin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Dashboard Layouts ── */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground">
            Exemplos de layout de dashboard institucional para cada breakpoint. A grid define a distribuição de KPIs, gráficos, tabelas e sidebar.
          </p>

          <div className="brand-card">
            <div className="flex items-center gap-2 mb-4">
              <Monitor size={18} className="text-primary" />
              <h4 className="text-sm font-semibold">Desktop — 12 colunas com sidebar</h4>
            </div>
            <DashboardSkeleton device="Desktop ≥ 1280px — sidebar fixa + conteúdo em 12 cols" cols={12} sidebar />
          </div>

          <div className="brand-card">
            <div className="flex items-center gap-2 mb-4">
              <Tablet size={18} className="text-primary" />
              <h4 className="text-sm font-semibold">Tablet — 8 colunas sem sidebar</h4>
            </div>
            <div className="max-w-2xl">
              <DashboardSkeleton device="Tablet 768px–1279px — sidebar recolhida, 8 cols" cols={8} sidebar={false} />
            </div>
          </div>

          <div className="brand-card">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={18} className="text-primary" />
              <h4 className="text-sm font-semibold">Mobile — 4 colunas empilhadas</h4>
            </div>
            <div className="max-w-xs">
              <DashboardSkeleton device="Mobile < 768px — layout empilhado, 4 cols" cols={4} sidebar={false} />
            </div>
          </div>

          {/* Best practices */}
          <div className="brand-card">
            <h4 className="text-sm font-semibold mb-3">Boas práticas para dashboards</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-success font-bold">✓</span> KPIs em linha no topo, ocupando largura total em 3–4 colunas iguais</li>
              <li className="flex gap-2"><span className="text-success font-bold">✓</span> Gráficos principais em 8/12 colunas, complementares em 4/12</li>
              <li className="flex gap-2"><span className="text-success font-bold">✓</span> Tabelas sempre em largura total com scroll horizontal quando necessário</li>
              <li className="flex gap-2"><span className="text-success font-bold">✓</span> Sidebar recolhe automaticamente abaixo de 1024px</li>
              <li className="flex gap-2"><span className="text-error font-bold">✗</span> Evitar mais de 4 KPIs por linha em qualquer breakpoint</li>
              <li className="flex gap-2"><span className="text-error font-bold">✗</span> Não usar grids de 16 colunas em tablets ou mobile</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── TAB: Spans & Composition ── */}
      {activeTab === "spans" && (
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground">
            Exemplos de como os elementos ocupam múltiplas colunas da grid para compor layouts de dashboard e páginas internas.
          </p>

          <div className="brand-card">
            <h4 className="text-sm font-semibold mb-4">Composição em 12 colunas (Desktop)</h4>
            <SpanExample
              cols={12}
              label="Layout dashboard — KPIs + gráfico + sidebar"
              spans={[
                { span: 3, name: "KPI" },
                { span: 3, name: "KPI" },
                { span: 3, name: "KPI" },
                { span: 3, name: "KPI" },
                { span: 8, name: "Gráfico" },
                { span: 4, name: "Lista" },
                { span: 12, name: "Tabela" },
              ]}
            />
            <SpanExample
              cols={12}
              label="Layout formulário — sidebar + conteúdo"
              spans={[
                { span: 3, name: "Menu" },
                { span: 9, name: "Formulário" },
                { span: 3, name: "" },
                { span: 4, name: "Campo" },
                { span: 5, name: "Campo" },
              ]}
            />
          </div>

          <div className="brand-card">
            <h4 className="text-sm font-semibold mb-4">Composição em 16 colunas (Desktop grande)</h4>
            <SpanExample
              cols={16}
              label="Painel administrativo com métricas"
              spans={[
                { span: 4, name: "KPI" },
                { span: 4, name: "KPI" },
                { span: 4, name: "KPI" },
                { span: 4, name: "KPI" },
                { span: 10, name: "Gráfico principal" },
                { span: 6, name: "Gráfico secundário" },
                { span: 16, name: "Tabela de dados" },
              ]}
            />
          </div>

          <div className="brand-card">
            <h4 className="text-sm font-semibold mb-4">Composição em 8 colunas (Tablet)</h4>
            <div className="max-w-lg">
              <SpanExample
                cols={8}
                label="Dashboard tablet"
                spans={[
                  { span: 4, name: "KPI" },
                  { span: 4, name: "KPI" },
                  { span: 4, name: "KPI" },
                  { span: 4, name: "KPI" },
                  { span: 8, name: "Gráfico" },
                  { span: 8, name: "Tabela" },
                ]}
              />
            </div>
          </div>

          <div className="brand-card">
            <h4 className="text-sm font-semibold mb-4">Composição em 4 colunas (Mobile)</h4>
            <div className="max-w-xs">
              <SpanExample
                cols={4}
                label="Dashboard mobile"
                spans={[
                  { span: 2, name: "KPI" },
                  { span: 2, name: "KPI" },
                  { span: 2, name: "KPI" },
                  { span: 2, name: "KPI" },
                  { span: 4, name: "Gráfico" },
                  { span: 4, name: "Tabela" },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Code examples */}
      <CodeBlock
        title="Grid 12 colunas — CSS"
        code={`.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6); /* 24px */
  padding: 0 var(--space-8); /* 32px margin */
}

/* KPI cards: 3 colunas cada */
.kpi-card { grid-column: span 3; }

/* Gráfico principal: 8 colunas */
.chart-main { grid-column: span 8; }

/* Sidebar / lista: 4 colunas */
.chart-side { grid-column: span 4; }

/* Tabela: largura total */
.table-full { grid-column: span 12; }

/* Tablet: adaptar para 8 colunas */
@media (max-width: 1023px) {
  .grid-12 {
    grid-template-columns: repeat(8, 1fr);
    gap: var(--space-4);
  }
  .kpi-card { grid-column: span 4; }
  .chart-main { grid-column: span 8; }
  .chart-side { grid-column: span 8; }
  .table-full { grid-column: span 8; }
}

/* Mobile: 4 colunas empilhadas */
@media (max-width: 767px) {
  .grid-12 {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4);
    padding: 0 var(--space-4);
  }
  .kpi-card { grid-column: span 2; }
  .chart-main, .chart-side, .table-full {
    grid-column: span 4;
  }
}`}
        language="css"
      />

      <CodeBlock
        title="Grid 16 colunas — Tailwind CSS"
        code={`{/* Grid 16 colunas com Tailwind */}
<div className="grid grid-cols-16 gap-6 px-8">
  {/* KPI: span 4 de 16 */}
  <div className="col-span-4">KPI 1</div>
  <div className="col-span-4">KPI 2</div>
  <div className="col-span-4">KPI 3</div>
  <div className="col-span-4">KPI 4</div>

  {/* Gráfico: span 10 + sidebar: span 6 */}
  <div className="col-span-10">Gráfico</div>
  <div className="col-span-6">Lista lateral</div>

  {/* Tabela: largura total */}
  <div className="col-span-16">Tabela</div>
</div>

{/* Adicionar no tailwind.config.ts: */}
// extend: { gridTemplateColumns: { '16': 'repeat(16, minmax(0, 1fr))' } }`}
        language="tsx"
      />
    </div>
  );
}
