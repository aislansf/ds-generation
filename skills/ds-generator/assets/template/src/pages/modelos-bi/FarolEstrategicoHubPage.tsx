import { BarChart3, FileText, ArrowRight } from "lucide-react";

const items = [
  {
    label: "BI · Farol Estratégico",
    description: "Painel analítico (Power BI-like) com filtros, KPIs e gráficos.",
    path: "/modelos-bi/farol-estrategico/bi",
    version: "v1.0",
    icon: BarChart3,
  },
  {
    label: "Docs · Farol Estratégico",
    description: "Documentação técnica: componentes, tokens e implementação.",
    path: "/modelos-bi/farol-estrategico/docs",
    version: "v1.0",
    icon: FileText,
  },
];

export default function FarolEstrategicoHubPage() {
  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <header className="space-y-2">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <BarChart3 size={14} /> Modelos de BI · Farol Estratégico
        </span>
        <h1 className="text-3xl font-semibold text-foreground">Farol Estratégico</h1>
        <p className="text-muted-foreground max-w-2xl">
          Hub do painel Farol Estratégico. Acesse o BI ou a documentação. Novas versões serão adicionadas aqui.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <a
              key={it.path}
              href={it.path}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <h2 className="text-base font-semibold text-foreground">{it.label}</h2>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{it.description}</p>
              <span className="mt-3 inline-block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {it.version}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}