import { Link } from "react-router-dom";
import {
  BarChart3, LineChart, PieChart, ScatterChart, Share2, Gauge, Map,
  Info, Accessibility, FlaskConical, Download,
} from "lucide-react";
import SEO from "@/components/SEO";
import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";
import { CATEGORIAS, CHART_PRESETS, getPresetsByCategoria } from "@/data/echarts/registry";
import { BRAND_PALETTE_TOKENS, readToken, BRAND_THEME_VERSION, ECHARTS_PALETTE_COMPLEMENTAR } from "@/lib/echarts/brandTheme";

const ICONES: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 size={20} />,
  LineChart: <LineChart size={20} />,
  PieChart: <PieChart size={20} />,
  ScatterChart: <ScatterChart size={20} />,
  Share2: <Share2 size={20} />,
  Gauge: <Gauge size={20} />,
  Map: <Map size={20} />,
};

const instalacao = `npm install echarts`;

const usoTema = `import * as echarts from "echarts";
import { registerBrandThemes } from "@/lib/echarts/brandTheme";

// Registra os temas "brand-light" e "brand-dark" a partir dos tokens do DS.
// O componente BrandChart já faz isso automaticamente a cada troca de tema.
registerBrandThemes(echarts);`;

const usoMinimo = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";

const option: EChartsOption = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["Jan", "Fev", "Mar"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 148, 132] }],
};

export function ExemploMinimo() {
  return (
    <BrandChart
      option={option}
      height={320}
      ariaLabel="Colunas de atendimentos por mês: 120 em janeiro, 148 em fevereiro e 132 em março."
    />
  );
}`;

export default function GraficosIndexPage() {
  return (
    <>
      <SEO
        title="Gráficos ECharts — Design System __BRAND_NAME__"
        description="Biblioteca de visualização de dados do __BRAND_NAME__ baseada em Apache ECharts 5, com tema oficial light/dark derivado dos tokens do Design System."
        path="/graficos"
      />

      <PageHeader
        badge="Visualização de dados"
        title="Gráficos ECharts"
        description="Biblioteca de visualização de dados padronizada do __BRAND_NAME__, baseada em Apache ECharts 5, com tema oficial light e dark derivado dos tokens do Design System. Pensada para dashboards, painéis de BI e sistemas internos, com consumo em três formatos: componente React tipado, objeto option puro e arquivos para download."
      />

      {/* Instalação e uso */}
      <SectionHeader
        id="instalacao"
        badge="Começando"
        title="Instalação e uso"
        description={`Tema oficial na versão ${BRAND_THEME_VERSION}. Instale a dependência, registre os temas e use o wrapper BrandChart.`}
      />
      <CodeBlock code={instalacao} language="bash" title="Dependência" />
      <CodeBlock code={usoTema} language="ts" title="Registro do tema __BRAND_SHORT__" />
      <CodeBlock code={usoMinimo} language="tsx" title="Exemplo mínimo de uso" />

      {/* Recharts x ECharts */}
      <SectionHeader
        id="recharts-echarts"
        badge="Orientação"
        title="Recharts x ECharts — qual usar?"
        description="As duas bibliotecas coexistem no Design System. Nenhuma está depreciada."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="brand-card">
          <h3 className="text-base font-semibold text-foreground mb-2">Recharts</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Disponível em <Link to="/componentes#graficos" className="text-primary hover:underline">Componentes → Gráficos</Link>.
            Segue recomendado para gráficos simples embutidos em telas de sistema.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Cards de indicador, sparklines e gráficos de apoio</li>
            <li>• Telas CRUD, relatórios simples e formulários</li>
            <li>• Integração direta com componentes React já existentes</li>
          </ul>
        </div>
        <div className="brand-card">
          <h3 className="text-base font-semibold text-foreground mb-2">Apache ECharts</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Padrão para painéis analíticos e BI, com o <code className="text-xs">option</code> exportável para outras stacks.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Painéis analíticos, BI e grandes volumes de dados</li>
            <li>• Grandes catálogos de tipos de visualização ({CHART_PRESETS.length} presets prontos)</li>
            <li>• Quando é preciso exportar o option para Power BI, Vue ou HTML puro</li>
          </ul>
        </div>
      </div>

      {/* Paleta */}
      <SectionHeader
        id="paleta"
        badge="Cores"
        title="Paleta oficial de séries"
        description="Dez cores categóricas derivadas dos tokens do DS, aplicadas nesta ordem em todas as séries."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {BRAND_PALETTE_TOKENS.map((t, i) => (
          <div key={t.token} className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="h-16 w-full" style={{ background: readToken(t.token) }} aria-hidden="true" />
            <div className="p-2.5">
              <p className="text-xs font-semibold text-foreground">{i + 1}. {t.nome}</p>
              <code className="text-[11px] text-muted-foreground break-all">{t.token}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Paleta estendida */}
      <h3 className="text-base font-semibold text-foreground mb-2">
        Cores complementares do Apache ECharts
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Nove matizes do tema oficial do Apache ECharts 5, autorizados pelo __BRAND_NAME__ apenas quando o
        tipo de gráfico exige mais cores do que a paleta de dez do Design System — sunburst, treemap,
        sankey, grafos, árvores, themeRiver, pizza com muitas fatias e coordenadas paralelas. Nesses
        casos use <code className="text-xs">BRAND_PALETTE_ESTENDIDA</code>, que sempre inicia pelas
        dez cores oficiais e só então recorre a estas.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-8">
        {ECHARTS_PALETTE_COMPLEMENTAR.map((cor, i) => (
          <div key={cor} className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="h-12 w-full" style={{ background: cor }} aria-hidden="true" />
            <div className="p-2">
              <p className="text-[11px] font-semibold text-foreground">{i + 11}</p>
              <code className="text-[10px] text-muted-foreground break-all">{cor}</code>
            </div>
          </div>
        ))}
      </div>


      {/* Categorias */}
      <SectionHeader
        id="categorias"
        badge="Catálogo"
        title="Categorias de gráficos"
        description={`${CHART_PRESETS.length} gráficos prontos, distribuídos em ${CATEGORIAS.length} categorias. Todos com option exportável, snippet React e orientação de uso.`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CATEGORIAS.map((cat) => {
          const total = getPresetsByCategoria(cat.slug).length;
          return (
            <Link
              key={cat.slug}
              to={cat.path}
              className="brand-card block hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  {ICONES[cat.icone]}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {total} {total === 1 ? "gráfico" : "gráficos"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">{cat.nome}</h3>
              <p className="text-sm text-muted-foreground">{cat.descricao}</p>
            </Link>
          );
        })}
      </div>

      {/* Downloads e Playground */}
      <SectionHeader
        id="downloads-playground"
        badge="Ferramentas"
        title="Downloads e Playground"
        description="Prototipe o option em tempo real ou leve a biblioteca inteira para o seu projeto."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/graficos/playground" className="brand-card block hover:border-primary/40 transition-colors">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-2">
            <FlaskConical size={20} />
          </span>
          <h3 className="text-base font-semibold text-foreground mb-1">Playground</h3>
          <p className="text-sm text-muted-foreground">
            Edite o JSON do option com pré-visualização ao vivo e exporte em JSON, TypeScript ou PNG.
          </p>
        </Link>
        <Link to="/graficos/downloads" className="brand-card block hover:border-primary/40 transition-colors">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-2">
            <Download size={20} />
          </span>
          <h3 className="text-base font-semibold text-foreground mb-1">Central de Downloads</h3>
          <p className="text-sm text-muted-foreground">
            Biblioteca completa em .zip, pacotes por categoria, tema isolado e manifesto <code className="text-xs">index.json</code>.
          </p>
        </Link>
      </div>

      {/* Acessibilidade */}
      <div className="rounded-lg border border-info/30 bg-info/10 p-4 flex items-start gap-3">
        <Accessibility size={18} className="text-info mt-0.5 shrink-0" />
        <p className="text-sm text-foreground">
          <strong>Acessibilidade obrigatória:</strong> todo gráfico do Design System exige um{" "}
          <code className="text-xs">ariaLabel</code> descritivo do conteúdo dos dados e não deve usar a cor
          como único canal de informação — combine legenda, rótulos e marcadores.
        </p>
      </div>

      <p className="mt-6 text-xs text-muted-foreground flex items-center gap-1.5">
        <Info size={14} /> Os dados de todos os exemplos são fictícios e servem apenas para ilustrar cada tipo de visualização.
      </p>
    </>
  );
}
