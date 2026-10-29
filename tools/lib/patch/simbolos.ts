import type { EChartsOption } from "echarts";

/**
 * Símbolos de série dos gráficos de linha e dispersão (gerado pelo ds-build).
 *
 * O token --chart-symbol-variety diz quantos símbolos diferentes alternam entre as séries (círculo, quadrado,
 * triângulo): 0 ou 1 não muda nada, 2 alterna círculo e quadrado, 3 usa os três. O estilo Bauhaus liga o 3; nos
 * demais estilos o token vale 0 e o option sai do jeito que entrou. Séries que já definem `symbol` ficam como estão.
 */
export const SIMBOLOS = ["circle", "rect", "triangle"] as const;

/** Lê --chart-symbol-variety (0 se ausente ou inválido). */
export function lerVariedade(): number {
  if (typeof window === "undefined" || typeof document === "undefined") return 0;
  const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--chart-symbol-variety"));
  return Number.isFinite(n) ? n : 0;
}

export function aplicarSimbolos(option: EChartsOption, variedade: number = lerVariedade()): EChartsOption {
  const series = option.series as any;
  const n = Math.min(Math.floor(variedade), SIMBOLOS.length);
  if (n < 2 || !series) return option;
  const lista: any[] = Array.isArray(series) ? series : [series];
  let proximo = 0;
  let mudou = false;
  const nova = lista.map((s) => {
    if (!s || (s.type !== "line" && s.type !== "scatter") || s.symbol !== undefined) return s;
    mudou = true;
    const symbol = SIMBOLOS[proximo++ % n];
    return { ...s, symbol, symbolSize: s.symbolSize ?? 8, ...(s.type === "line" ? { showSymbol: s.showSymbol ?? true } : {}) };
  });
  if (!mudou) return option;
  return { ...option, series: Array.isArray(series) ? nova : nova[0] };
}
