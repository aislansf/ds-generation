import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ChartCategoria, ChartPreset } from "@/data/echarts/types";
import { CATEGORIAS, CHART_PRESETS, getPresetsByCategoria } from "@/data/echarts/registry";
import { presetJsonString, presetTsString } from "@/lib/echarts/exportPreset";
import {
  buildBrandTheme,
  BRAND_THEME_NAMES,
  BRAND_THEME_VERSION,
  type BrandEchartsTheme,
} from "@/lib/echarts/brandTheme";

export const LIBRARY_VERSION = "v1";
export const LIBRARY_ZIP_NAME = `ds-brand-echarts-${LIBRARY_VERSION}.zip`;

/**
 * Gera os dois temas (light e dark). Como as cores vêm de CSS vars do
 * documento, alternamos temporariamente a classe `dark` no <html> para
 * capturar os dois conjuntos e restauramos o estado original em seguida.
 */
export function buildBothThemes(): { light: BrandEchartsTheme; dark: BrandEchartsTheme } {
  const root = typeof document !== "undefined" ? document.documentElement : null;
  const eraDark = root?.classList.contains("dark") ?? false;

  root?.classList.remove("dark");
  const light = buildBrandTheme("light");
  root?.classList.add("dark");
  const dark = buildBrandTheme("dark");
  if (!eraDark) root?.classList.remove("dark");

  return { light, dark };
}

export function themeJsString(light: BrandEchartsTheme, dark: BrandEchartsTheme): string {
  return `/**
 * Tema oficial Apache ECharts — Design System __BRAND_NAME__ (${BRAND_THEME_VERSION})
 * Uso em página vanilla:
 *   <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
 *   <script src="brand-theme.js"></script>
 *   const chart = echarts.init(el, 'brand-light');
 */
(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    factory(require("echarts"));
  } else if (typeof define === "function" && define.amd) {
    define(["echarts"], factory);
  } else {
    factory(root.echarts);
  }
})(typeof self !== "undefined" ? self : this, function (echarts) {
  if (!echarts) return;
  echarts.registerTheme("${BRAND_THEME_NAMES.light}", ${JSON.stringify(light, null, 2)});
  echarts.registerTheme("${BRAND_THEME_NAMES.dark}", ${JSON.stringify(dark, null, 2)});
});
`;
}

export interface LibraryManifest {
  nome: string;
  versao: string;
  temaVersao: string;
  geradoEm: string;
  totalGraficos: number;
  categorias: { slug: string; nome: string; descricao: string; total: number }[];
  presets: {
    id: string;
    nome: string;
    categoria: string;
    descricao: string;
    tags: string[];
    requerMapa?: string | null;
    arquivos: { json: string; ts: string; react: string };
  }[];
}

export function buildManifest(presets: ChartPreset[] = CHART_PRESETS): LibraryManifest {
  return {
    nome: "Design System __BRAND_NAME__ — Gráficos ECharts",
    versao: LIBRARY_VERSION,
    temaVersao: BRAND_THEME_VERSION,
    geradoEm: new Date().toISOString(),
    totalGraficos: presets.length,
    categorias: CATEGORIAS.map((c) => ({
      slug: c.slug,
      nome: c.nome,
      descricao: c.descricao,
      total: presets.filter((p) => p.categoria === c.slug).length,
    })).filter((c) => c.total > 0),
    presets: presets.map((p) => ({
      id: p.id,
      nome: p.nome,
      categoria: p.categoria,
      descricao: p.descricao,
      tags: p.tags,
      requerMapa: p.requerMapa ?? null,
      arquivos: {
        json: `presets/${p.categoria}/${p.id}.json`,
        ts: `presets/${p.categoria}/${p.id}.ts`,
        react: `react/${p.id}.tsx`,
      },
    })),
  };
}

function readmeString(presets: ChartPreset[], escopo: string): string {
  const linhas = CATEGORIAS.map((c) => {
    const total = presets.filter((p) => p.categoria === c.slug).length;
    return total > 0 ? `| ${c.nome} | \`${c.slug}\` | ${total} |` : null;
  }).filter(Boolean).join("\n");

  return `# Gráficos ECharts — Design System __BRAND_NAME__

Biblioteca oficial de visualização de dados do __BRAND_NAME__ baseada em
[Apache ECharts 5](https://echarts.apache.org/), com tema light/dark derivado
dos tokens do Design System.

- Versão do pacote: **${LIBRARY_VERSION}**
- Versão do tema: **${BRAND_THEME_VERSION}**
- Escopo deste pacote: **${escopo}**
- Total de gráficos: **${presets.length}**

| Categoria | Slug | Gráficos |
| --- | --- | --- |
${linhas}

## Instalação

\`\`\`bash
npm install echarts
\`\`\`

## Registrando o tema

React / bundler:

\`\`\`ts
import * as echarts from "echarts";
import brandLight from "./theme/brand-light.json";
import brandDark from "./theme/brand-dark.json";

echarts.registerTheme("brand-light", brandLight);
echarts.registerTheme("brand-dark", brandDark);
\`\`\`

HTML puro:

\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<script src="theme/brand-theme.js"></script>
<script>
  const chart = echarts.init(document.getElementById("grafico"), "brand-light");
  fetch("presets/barras/barras-basico.json")
    .then((r) => r.json())
    .then((option) => chart.setOption(option));
</script>
\`\`\`

## Estrutura

\`\`\`
README.md
index.json                  manifesto programático da biblioteca
theme/brand-light.json     tema light serializado
theme/brand-dark.json      tema dark serializado
theme/brand-theme.js       registro UMD-friendly dos dois temas
presets/<categoria>/<id>.json   option puro do ECharts
presets/<categoria>/<id>.ts     option tipado (EChartsOption)
react/BrandChart.tsx       wrapper React acessível do DS
react/<id>.tsx              componente React pronto de cada gráfico
\`\`\`

## Acessibilidade

Todo gráfico exige um \`ariaLabel\` descrevendo os dados e não deve usar cor
como único canal de informação. Em gráficos com zoom/roam, ofereça também uma
alternativa em tabela.

## Presets de mapa

Os presets da categoria \`mapas\` exigem registrar a base geográfica ANTES de
aplicar o option, via \`echarts.registerMap(nome, geojson)\`. O nome usado é
\`brasil-ufs\`, e o GeoJSON deve ser servido pelo seu
próprio domínio e carregado sob demanda (nunca no bundle inicial):

\`\`\`js
fetch("/geo/brasil-ufs.json")
  .then((r) => r.json())
  .then((geo) => {
    echarts.registerMap("brasil-ufs", geo);
    chart.setOption(option);
  });
\`\`\`

Sem esse registro o gráfico não renderiza. Mapas também exigem alternativa em
tabela com os mesmos dados.

## Aviso sobre os dados

> Todos os valores presentes nos presets são **fictícios**, criados apenas para
> ilustrar cada tipo de visualização. Substitua-os pelos dados reais da sua
> fonte antes de publicar qualquer painel.
`;
}

const WRAPPER_SOURCE = `import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption, ECharts } from "echarts";
import brandLight from "../theme/brand-light.json";
import brandDark from "../theme/brand-dark.json";

echarts.registerTheme("brand-light", brandLight as unknown as object);
echarts.registerTheme("brand-dark", brandDark as unknown as object);

export interface BrandChartProps {
  option: EChartsOption;
  height?: number | string;
  className?: string;
  /** Obrigatório: descrição textual do gráfico para leitores de tela. */
  ariaLabel: string;
  /** "light" | "dark" — normalmente vem do tema da aplicação. */
  theme?: "light" | "dark";
  loading?: boolean;
  notMerge?: boolean;
}

export interface BrandChartHandle {
  getInstance: () => ECharts | null;
}

export const BrandChart = forwardRef<BrandChartHandle, BrandChartProps>(function BrandChart(
  { option, height = 340, className, ariaLabel, theme = "light", loading = false, notMerge = true },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);

  useImperativeHandle(ref, () => ({ getInstance: () => chartRef.current }), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = echarts.init(el, theme === "dark" ? "brand-dark" : "brand-light");
    chartRef.current = chart;
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(el);
    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [theme]);

  useEffect(() => {
    chartRef.current?.setOption(option, notMerge);
  }, [option, notMerge, theme]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    if (loading) chart.showLoading("default", { text: "Carregando…", maskColor: "transparent" });
    else chart.hideLoading();
  }, [loading, theme]);

  return (
    <div className={className}>
      <span className="sr-only">{ariaLabel}</span>
      <div
        ref={containerRef}
        role="img"
        aria-label={ariaLabel}
        style={{ width: "100%", height: typeof height === "number" ? \`\${height}px\` : height }}
      />
    </div>
  );
});

export default BrandChart;
`;

function addPresetFiles(zip: JSZip, presets: ChartPreset[]): void {
  presets.forEach((preset) => {
    zip.file(`presets/${preset.categoria}/${preset.id}.json`, presetJsonString(preset));
    zip.file(`presets/${preset.categoria}/${preset.id}.ts`, presetTsString(preset));
    zip.file(`react/${preset.id}.tsx`, `${preset.codigoReact}\n`);
  });
}

function addThemeFiles(zip: JSZip): void {
  const { light, dark } = buildBothThemes();
  zip.file("theme/brand-light.json", JSON.stringify(light, null, 2));
  zip.file("theme/brand-dark.json", JSON.stringify(dark, null, 2));
  zip.file("theme/brand-theme.js", themeJsString(light, dark));
}

async function gerarZip(presets: ChartPreset[], escopo: string, fileName: string): Promise<void> {
  const zip = new JSZip();
  zip.file("README.md", readmeString(presets, escopo));
  zip.file("index.json", JSON.stringify(buildManifest(presets), null, 2));
  addThemeFiles(zip);
  addPresetFiles(zip, presets);
  zip.file("react/BrandChart.tsx", WRAPPER_SOURCE);
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, fileName);
}

/** Zip com a biblioteca completa (todas as categorias). */
export async function downloadFullLibraryZip(): Promise<void> {
  await gerarZip(CHART_PRESETS, "biblioteca completa", LIBRARY_ZIP_NAME);
}

/** Zip com apenas uma categoria. */
export async function downloadCategoriaZip(slug: ChartCategoria, nome: string): Promise<void> {
  const presets = getPresetsByCategoria(slug);
  await gerarZip(presets, `categoria ${nome}`, `ds-brand-echarts-${slug}-${LIBRARY_VERSION}.zip`);
}

export function downloadThemeJs(): void {
  const { light, dark } = buildBothThemes();
  saveAs(new Blob([themeJsString(light, dark)], { type: "text/javascript;charset=utf-8" }), "brand-theme.js");
}

export function downloadThemeJson(mode: "light" | "dark"): void {
  const temas = buildBothThemes();
  const conteudo = JSON.stringify(temas[mode], null, 2);
  saveAs(new Blob([conteudo], { type: "application/json;charset=utf-8" }), `brand-${mode}.json`);
}

export function downloadManifest(): void {
  const conteudo = JSON.stringify(buildManifest(), null, 2);
  saveAs(new Blob([conteudo], { type: "application/json;charset=utf-8" }), "index.json");
}
