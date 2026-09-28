import { BarChart3, Construction, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";

const panels = [
  {
    label: "Radar Estratégico - BI",
    description: "Hub com BI e Docs do Radar Estratégico, com versionamento.",
    path: "/modelos-bi/radar-estrategico",
    available: true,
  },
  {
    label: "Planejamento - BI",
    description: "Painel de planejamento estratégico (em construção).",
    path: "/modelos-bi/planeja",
    available: false,
  },
  {
    label: "Monitoramento da Performance das Iniciativas - BI",
    description: "Painel de monitoramento de iniciativas (em construção).",
    path: "/modelos-bi/mpi",
    available: false,
  },
  {
    label: "Gestão de Pessoas - BI",
    description: "Painel de gestão de pessoas (em construção).",
    path: "/modelos-bi/gestao-pessoas",
    available: false,
  },
];

export default function ModelosBIPage() {
  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <SEO
        title="Modelos de BI — Design System __BRAND_SHORT__"
        description="Hub de painéis analíticos do __BRAND_NAME__: Radar Estratégico, Planejamento, MPI e Gestão de Pessoas, com versões e documentação técnica."
        path="/modelos-bi"
      />
      <header className="space-y-2">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <BarChart3 size={14} /> Modelos de BI
        </span>
        <h1 className="text-3xl font-semibold text-foreground">Modelos de BI</h1>
        <p className="text-muted-foreground max-w-2xl">
          Coleção de painéis analíticos do __BRAND_NAME__. Cada painel terá suas próprias versões e histórias de uso.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {panels.map((p) => {
          const card = (
            <div
              className={`group h-full rounded-lg border border-border bg-card p-5 transition-colors ${
                p.available ? "hover:border-primary hover:shadow-md" : "opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-foreground">{p.label}</h2>
                {p.available ? (
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <Construction size={16} className="text-muted-foreground" />
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              {!p.available && (
                <span className="mt-3 inline-block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Em breve
                </span>
              )}
            </div>
          );
          return p.available ? (
            <a
              key={p.path}
              href={p.path}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {card}
            </a>
          ) : (
            <div key={p.path}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}