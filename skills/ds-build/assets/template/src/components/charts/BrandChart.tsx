import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as echarts from "echarts";
import type { EChartsOption, ECharts } from "echarts";
import { useTheme } from "@/hooks/useTheme";
import { registerBrandThemes, BRAND_THEME_NAMES } from "@/lib/echarts/brandTheme";
import { mapaRegistrado, registrarMapaPorNome } from "@/lib/echarts/mapas";
import { cn } from "@/lib/utils";
import { aplicarSimbolos } from "@/lib/echarts/simbolos";

export interface BrandChartProps {
  option: EChartsOption;
  /** Altura do container. Padrão 340. */
  height?: number | string;
  className?: string;
  /** Obrigatório: descrição textual do gráfico para leitores de tela. */
  ariaLabel: string;
  loading?: boolean;
  notMerge?: boolean;
  onEvents?: Record<string, (params: unknown) => void>;
  /** Grupo para sincronizar tooltips entre gráficos (echarts.connect). */
  group?: string;
  /** Nome do mapa GeoJSON que precisa ser registrado antes de aplicar o option. */
  requerMapa?: string;
}

export interface BrandChartHandle {
  getInstance: () => ECharts | null;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Wrapper React oficial do Apache ECharts no DS __BRAND_NAME__.
 * Aplica o tema brand-light / brand-dark, é responsivo por ResizeObserver
 * e expõe a instância via ref (usada para exportar PNG/SVG).
 */
export const BrandChart = forwardRef<BrandChartHandle, BrandChartProps>(function BrandChart(
  { option, height = 340, className, ariaLabel, loading = false, notMerge = true, onEvents, group, requerMapa },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);
  const { theme } = useTheme();
  const [mapaPronto, setMapaPronto] = useState(() => !requerMapa || mapaRegistrado(requerMapa));
  const [erroMapa, setErroMapa] = useState<string | null>(null);

  // Carrega o GeoJSON sob demanda (nunca no bundle inicial).
  useEffect(() => {
    if (!requerMapa) {
      setMapaPronto(true);
      return;
    }
    if (mapaRegistrado(requerMapa)) {
      setMapaPronto(true);
      return;
    }
    let ativo = true;
    setMapaPronto(false);
    setErroMapa(null);
    registrarMapaPorNome(echarts, requerMapa)
      .then(() => ativo && setMapaPronto(true))
      .catch(() => ativo && setErroMapa("Mapa indisponível no momento: não foi possível carregar a base geográfica."));
    return () => {
      ativo = false;
    };
  }, [requerMapa]);

  useImperativeHandle(ref, () => ({ getInstance: () => chartRef.current }), []);

  // Init / re-init quando o tema muda (as cores vêm de CSS vars).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    registerBrandThemes(echarts);
    const themeName = theme === "dark" ? BRAND_THEME_NAMES.dark : BRAND_THEME_NAMES.light;
    const chart = echarts.init(el, themeName, { renderer: "canvas" });
    chartRef.current = chart;
    if (group) chart.group = group;

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [theme, group]);

  // Aplica o option (e reaplica após troca de tema por causa do dispose acima).
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !mapaPronto) return;
    const reduced = prefersReducedMotion();
    chart.setOption(aplicarSimbolos({ ...option, animation: reduced ? false : option.animation ?? true }), notMerge);
  }, [option, notMerge, theme, mapaPronto]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    if (loading || (!mapaPronto && !erroMapa)) chart.showLoading("default", { text: "Carregando…", maskColor: "transparent" });
    else chart.hideLoading();
  }, [loading, theme, mapaPronto, erroMapa]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !onEvents) return;
    const entries = Object.entries(onEvents);
    entries.forEach(([evt, handler]) => chart.on(evt, handler));
    return () => entries.forEach(([evt, handler]) => chart.off(evt, handler));
  }, [onEvents, theme]);

  return (
    <div className={cn("w-full max-w-full overflow-hidden", className)}>
      <span className="sr-only">{ariaLabel}</span>
      {erroMapa && (
        <p
          role="status"
          className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground mb-2"
        >
          {erroMapa}
        </p>
      )}
      <div
        ref={containerRef}
        role="img"
        aria-label={ariaLabel}
        className="w-full max-w-full"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      />
    </div>
  );
});

export default BrandChart;
