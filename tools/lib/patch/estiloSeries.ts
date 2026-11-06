import type { EChartsOption } from "echarts";
import { getBrandPalette, readToken } from "./brandTheme";

/**
 * Séries que seguem o estilo além do tema ECharts (gerado pelo ds-build).
 *
 * O tema (brandTheme.ts) só dá padrões e não enxerga a cor de cada série nem o grupo de empilhamento. Duas
 * coisas dependem disso e são feitas aqui, pelo BrandChart, antes do setOption:
 *   --chart-track          1 põe uma trilha neutra atrás das barras (só quando há um grupo de barras: série única ou uma
 *                          pilha, em que só a primeira série leva a trilha para o alfa não somar) e pinta de neutro o
 *                          anel de fundo dos medidores de uma cor só;
 *   --chart-area-gradient  1 troca o preenchimento chapado da área de uma linha por um degradê que esmaece para baixo.
 *   --chart-mark-depth     desfoque, em px, da sombra de relevo de barras, fatias de pizza e pontos de dispersão (o canvas
 *                          só tem uma sombra por elemento: sai para baixo e para a direita); 0 desliga.
 * Com os três em 0 (todos os estilos, menos o Neumorfismo) o option sai do jeito que entrou. O que o option já define
 * (showBackground, cor de área em degradê) fica como está.
 */

export const lerToken = (nome: string): number => {
  if (typeof window === "undefined" || typeof document === "undefined") return 0;
  const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(nome));
  return Number.isFinite(n) ? n : 0;
};

/** Põe o alfa numa cor rgb(), rgba() ou hexadecimal; null se não souber ler. */
export function comAlpha(cor: unknown, alpha: number): string | null {
  if (typeof cor !== "string") return null;
  const rgb = cor.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
  const hex = cor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hex) return null;
  const h = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface OpcoesEstiloSeries {
  trilha?: boolean;
  areaDegrade?: boolean;
  /** Desfoque da sombra de relevo das marcas, em px; 0 desliga. */
  relevo?: number;
}

/** Sombra de relevo: sai da marca para baixo e para a direita; no escuro a cor é preta, no claro vem do texto. */
function sombraDeRelevo(desfoque: number): Record<string, unknown> {
  const escuro = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return {
    shadowBlur: desfoque,
    shadowOffsetX: Math.round(desfoque / 3),
    shadowOffsetY: Math.round(desfoque / 2),
    shadowColor: escuro ? "rgba(0, 0, 0, 0.55)" : readToken("--foreground", 0.22),
  };
}

export function aplicarEstiloSeries(option: EChartsOption, opcoes: OpcoesEstiloSeries = {}): EChartsOption {
  const trilha = opcoes.trilha ?? lerToken("--chart-track") > 0;
  const areaDegrade = opcoes.areaDegrade ?? lerToken("--chart-area-gradient") > 0;
  const relevo = opcoes.relevo ?? lerToken("--chart-mark-depth");
  const series = option.series as any;
  if ((!trilha && !areaDegrade && !(relevo > 0)) || !series) return option;
  const lista: any[] = Array.isArray(series) ? series : [series];
  const corTrilha = readToken("--muted-foreground", 0.1);
  const raio = lerToken("--chart-bar-radius");
  const paleta = getBrandPalette();
  const empilhadosComTrilha = new Set<string>();
  // várias séries lado a lado (agrupadas) ou várias pilhas viram blocos de trilha colados: a trilha só entra com um grupo de barras
  const gruposDeBarra = new Set(lista.filter((s) => s?.type === "bar").map((s, i) => s.stack ?? `solta-${i}`));
  const umGrupoDeBarras = gruposDeBarra.size === 1;
  let mudou = false;

  const comEstilo = lista.map((s, i) => {
    if (!s) return s;

    // histograma (barras coladas, barCategoryGap 0): a trilha viraria uma laje atrás de todas as barras
    const colada = s.barCategoryGap !== undefined && parseFloat(String(s.barCategoryGap)) === 0;
    if (trilha && umGrupoDeBarras && s.type === "bar" && s.showBackground === undefined && !colada) {
      // empilhadas desenham o mesmo retângulo uma sobre a outra: só a primeira de cada grupo leva a trilha
      if (s.stack !== undefined) {
        if (empilhadosComTrilha.has(s.stack)) return s;
        empilhadosComTrilha.add(s.stack);
      }
      mudou = true;
      return { ...s, showBackground: true, backgroundStyle: { color: corTrilha, borderRadius: raio, ...s.backgroundStyle } };
    }

    if (trilha && s.type === "gauge") {
      const cores = s.axisLine?.lineStyle?.color;
      if (Array.isArray(cores) && cores.length === 1 && Array.isArray(cores[0])) {
        mudou = true;
        return { ...s, axisLine: { ...s.axisLine, lineStyle: { ...s.axisLine.lineStyle, color: [[cores[0][0], corTrilha]] } } };
      }
    }

    // área empilhada fica chapada: o degradê de cada faixa abriria vãos entre elas
    if (areaDegrade && s.type === "line" && s.areaStyle && typeof s.areaStyle === "object" && s.stack === undefined) {
      const base = s.areaStyle.color ?? s.lineStyle?.color ?? s.itemStyle?.color ?? paleta[i % paleta.length];
      const topo = comAlpha(base, 0.32);
      const fundo = comAlpha(base, 0.02);
      if (!topo || !fundo) return s;
      mudou = true;
      const areaStyle = {
        ...s.areaStyle,
        opacity: 1,
        color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: topo }, { offset: 1, color: fundo }] },
      };
      return { ...s, areaStyle };
    }

    return s;
  });

  // relevo: barras, fatias e pontos ganham sombra; séries de apoio invisíveis (cascata) e quem já define sombra ficam como estão
  const nova = relevo > 0 ? comEstilo.map((s) => {
    if (!s || !["bar", "pie", "scatter"].includes(s.type)) return s;
    const item = s.itemStyle ?? {};
    if (item.shadowBlur !== undefined || item.color === "transparent" || item.opacity === 0) return s;
    mudou = true;
    return { ...s, itemStyle: { ...sombraDeRelevo(relevo), ...item } };
  }) : comEstilo;
  if (!mudou) return option;
  return { ...option, series: Array.isArray(series) ? nova : nova[0] };
}
