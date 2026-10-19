import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3, Boxes, ChevronRight, Download, FileCode2, FileJson, Gauge, Info,
  LineChart, Loader2, Package, PieChart, ScatterChart, Share2,
} from "lucide-react";
import SEO from "@/components/SEO";
import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";
import { CATEGORIAS, CHART_PRESETS, getPresetsByCategoria } from "@/data/echarts/registry";
import type { ChartCategoria } from "@/data/echarts/types";
import {
  downloadCategoriaZip,
  downloadFullLibraryZip,
  downloadManifest,
  downloadThemeJs,
  downloadThemeJson,
  LIBRARY_VERSION,
  LIBRARY_ZIP_NAME,
} from "@/lib/echarts/buildLibraryZip";
import { BRAND_THEME_VERSION } from "@/lib/echarts/brandTheme";

const ICONES: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 size={20} />,
  LineChart: <LineChart size={20} />,
  PieChart: <PieChart size={20} />,
  ScatterChart: <ScatterChart size={20} />,
  Share2: <Share2 size={20} />,
  Gauge: <Gauge size={20} />,
  Boxes: <Boxes size={20} />,
};

const consumoManifesto = `// index.json — manifesto da biblioteca
import manifesto from "./index.json";

// Lista todos os gráficos de uma categoria
const kpis = manifesto.presets.filter((p) => p.categoria === "kpi");

// Carrega o option puro de um preset sob demanda
async function carregarOption(id: string) {
  const item = manifesto.presets.find((p) => p.id === id);
  if (!item) throw new Error("Preset não encontrado: " + id);
  const res = await fetch(item.arquivos.json);
  return res.json();
}`;

const usoVanilla = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Gráfico __BRAND_SHORT__ — ECharts</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
    <!-- registra os temas "brand-light" e "brand-dark" -->
    <script src="theme/brand-theme.js"></script>
  </head>
  <body>
    <div id="grafico" style="width: 100%; height: 340px"></div>
    <script>
      var el = document.getElementById("grafico");
      var chart = echarts.init(el, "brand-light");

      fetch("presets/barras/barras-basico.json")
        .then(function (r) { return r.json(); })
        .then(function (option) { chart.setOption(option); });

      window.addEventListener("resize", function () { chart.resize(); });
    </script>
  </body>
</html>`;

export default function GraficosDownloadsPage() {
  const [carregando, setCarregando] = useState<string | null>(null);
  const categorias = CATEGORIAS.filter((c) => getPresetsByCategoria(c.slug).length > 0);

  const executar = async (chave: string, fn: () => Promise<void> | void) => {
    setCarregando(chave);
    try {
      await fn();
    } finally {
      setCarregando(null);
    }
  };

  return (
    <>
      <SEO
        title="Central de Downloads — Gráficos ECharts — Design System __BRAND_NAME__"
        description="Baixe a biblioteca de gráficos ECharts do __BRAND_NAME__: presets em JSON e TypeScript, tema oficial light/dark, wrapper React e manifesto para consumo programático."
        path="/graficos/downloads"
      />

      <nav aria-label="Trilha de navegação" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-primary">Principal</Link></li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li><Link to="/graficos" className="hover:text-primary">Gráficos ECharts</Link></li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li className="text-foreground font-medium">Downloads</li>
        </ol>
      </nav>

      <PageHeader
        badge="Central de Downloads"
        title="Baixar a biblioteca de gráficos"
        description={`Pacote ${LIBRARY_VERSION} com ${CHART_PRESETS.length} gráficos em ${categorias.length} categorias, tema oficial ${BRAND_THEME_VERSION} em light e dark, wrapper React acessível e manifesto para consumo programático. Todos os arquivos são gerados no seu navegador, sem backend.`}
      />

      {/* 1. Biblioteca completa */}
      <SectionHeader
        id="biblioteca-completa"
        badge="Pacote único"
        title="Biblioteca completa (.zip)"
        description="Um único arquivo com README, temas, presets em JSON e TypeScript, componentes React e manifesto."
      />
      <div className="brand-card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
            <Package size={24} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-1">{LIBRARY_ZIP_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              {CHART_PRESETS.length} gráficos · temas light e dark · wrapper React · manifesto <code className="text-xs">index.json</code>
            </p>
          </div>
          <button
            type="button"
            disabled={carregando === "full"}
            onClick={() => executar("full", downloadFullLibraryZip)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors shrink-0"
          >
            {carregando === "full" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {carregando === "full" ? "Gerando…" : "Baixar .zip"}
          </button>
        </div>
        <ul className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
          <li><code>README.md</code> — instalação, registro do tema e uso</li>
          <li><code>index.json</code> — manifesto da biblioteca</li>
          <li><code>theme/brand-light.json</code> e <code>brand-dark.json</code></li>
          <li><code>theme/brand-theme.js</code> — registro pronto para &lt;script&gt;</li>
          <li><code>presets/&lt;categoria&gt;/&lt;id&gt;.json</code> — option puro</li>
          <li><code>presets/&lt;categoria&gt;/&lt;id&gt;.ts</code> — option tipado</li>
          <li><code>react/BrandChart.tsx</code> — wrapper acessível</li>
          <li><code>react/&lt;id&gt;.tsx</code> — componente pronto de cada gráfico</li>
        </ul>
      </div>

      {/* 2. Por categoria */}
      <SectionHeader
        id="por-categoria"
        badge="Sob medida"
        title="Downloads por categoria"
        description="Precisa apenas de um recorte? Baixe o zip de uma categoria específica, com o tema e o manifesto incluídos."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categorias.map((cat) => {
          const total = getPresetsByCategoria(cat.slug).length;
          const chave = `cat-${cat.slug}`;
          return (
            <div key={cat.slug} className="brand-card flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  {ICONES[cat.icone]}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {total} {total === 1 ? "gráfico" : "gráficos"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">{cat.nome}</h3>
              <p className="text-sm text-muted-foreground flex-1">{cat.descricao}</p>
              <button
                type="button"
                disabled={carregando === chave}
                onClick={() => executar(chave, () => downloadCategoriaZip(cat.slug as ChartCategoria, cat.nome))}
                className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-60 transition-colors"
              >
                {carregando === chave ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {carregando === chave ? "Gerando…" : `Baixar ${cat.slug}.zip`}
              </button>
            </div>
          );
        })}
      </div>

      {/* 3. Tema isolado */}
      <SectionHeader
        id="tema-isolado"
        badge="Tema"
        title="Tema __BRAND_SHORT__ isolado"
        description="Já tem seus próprios gráficos? Use apenas o tema oficial para herdar cores, tipografia e eixos do Design System."
      />
      <div className="brand-card mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadThemeJs}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FileCode2 size={14} /> brand-theme.js
          </button>
          <button
            type="button"
            onClick={() => downloadThemeJson("light")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <FileJson size={14} /> brand-light.json
          </button>
          <button
            type="button"
            onClick={() => downloadThemeJson("dark")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <FileJson size={14} /> brand-dark.json
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Os temas são serializados a partir dos tokens atuais do Design System (versão {BRAND_THEME_VERSION}).
          Ao atualizar os tokens, gere os arquivos novamente.
        </p>
      </div>

      {/* 4. Manifesto */}
      <SectionHeader
        id="manifesto"
        badge="Automação"
        title="Manifesto da biblioteca"
        description="Consuma o catálogo de forma programática: id, nome, categoria, descrição, tags e caminho dos arquivos de cada gráfico."
      />
      <div className="brand-card mb-4">
        <button
          type="button"
          onClick={downloadManifest}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <FileJson size={14} /> Baixar index.json
        </button>
      </div>
      <CodeBlock code={consumoManifesto} language="ts" title="Consumindo o manifesto" />

      {/* 5. Fora do React */}
      <SectionHeader
        id="fora-do-react"
        badge="Interoperabilidade"
        title="Uso fora do React"
        description="O option do ECharts é apenas JSON: o mesmo arquivo funciona em HTML puro, Vue, Angular e em custom visuals do Power BI."
      />
      <CodeBlock code={usoVanilla} language="html" title="HTML puro com CDN" />
      <div className="rounded-lg border border-info/30 bg-info/10 p-4 flex items-start gap-3 mb-6">
        <Info size={18} className="text-info mt-0.5 shrink-0" />
        <div className="text-sm text-foreground space-y-1.5">
          <p>
            <strong>Power BI:</strong> no visual <em>HTML Content</em> ou em um custom visual,
            carregue o <code className="text-xs">echarts.min.js</code>, registre o tema com{" "}
            <code className="text-xs">brand-theme.js</code> e substitua os arrays de dados do
            option pelos valores vindos do <code className="text-xs">dataView</code>. Veja o guia
            em <Link to="/modelos-bi/mapeamento" className="text-primary hover:underline">Mapeamento Power BI</Link>.
          </p>
          <p>
            <strong>Vue / Angular / Svelte:</strong> importe o JSON do preset e passe para{" "}
            <code className="text-xs">chart.setOption(option)</code> — nenhuma dependência do
            Design System é necessária além do arquivo de tema.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
        <Info size={14} className="mt-0.5 shrink-0" />
        Todos os dados dos presets são fictícios e servem apenas de exemplo. Substitua-os pelos
        dados reais antes de publicar qualquer painel.
      </p>
    </>
  );
}
