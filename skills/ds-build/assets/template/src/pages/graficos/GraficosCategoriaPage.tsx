import { Link, useParams } from "react-router-dom";
import { ChevronRight, PackageOpen } from "lucide-react";
import SEO from "@/components/SEO";
import { PageHeader } from "@/components/DSComponents";
import ChartShowcase from "@/components/charts/ChartShowcase";
import { getCategoria, getPresetsByCategoria } from "@/data/echarts/registry";
import type { ChartCategoria } from "@/data/echarts/types";

interface Props {
  /** Quando informado, ignora o parâmetro de rota. */
  categoria?: ChartCategoria;
}

export default function GraficosCategoriaPage({ categoria }: Props) {
  const params = useParams<{ categoria?: string }>();
  const slug = (categoria ?? params.categoria ?? "") as ChartCategoria;
  const info = getCategoria(slug);
  const presets = info ? getPresetsByCategoria(info.slug) : [];

  if (!info) {
    return (
      <>
        <PageHeader
          badge="Gráficos ECharts"
          title="Categoria não encontrada"
          description="A categoria solicitada não existe no catálogo de gráficos do Design System."
        />
        <Link to="/graficos" className="text-primary hover:underline text-sm">
          Voltar para Gráficos ECharts
        </Link>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${info.nome} — Gráficos ECharts — Design System __BRAND_NAME__`}
        description={info.descricao}
        path={info.path}
      />

      <nav aria-label="Trilha de navegação" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-primary">Principal</Link></li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li><Link to="/graficos" className="hover:text-primary">Gráficos ECharts</Link></li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li className="text-foreground font-medium">{info.nome}</li>
        </ol>
      </nav>

      <PageHeader badge="Gráficos ECharts" title={info.nome} description={info.descricao} />

      {presets.length === 0 ? (
        <div className="brand-card text-center py-12">
          <PackageOpen size={32} className="mx-auto text-muted-foreground mb-3" />
          <h2 className="text-base font-semibold text-foreground mb-1">Em breve</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Os gráficos desta categoria serão publicados nas próximas fases da biblioteca.
          </p>
        </div>
      ) : (
        presets.map((preset) => <ChartShowcase key={preset.id} preset={preset} />)
      )}
    </>
  );
}
