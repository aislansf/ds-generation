/**
 * Tema oficial Apache ECharts do Design System __BRAND_NAME__.
 *
 * Todas as cores são derivadas em runtime das CSS custom properties já
 * definidas no DS (src/index.css / public/design-system/tokens.css).
 * Como os tokens mudam entre light e dark mode, os temas precisam ser
 * RE-registrados quando o usuário alterna o tema no header — use
 * `registerBrandThemes(echarts)` novamente após a troca.
 */

export const BRAND_THEME_VERSION = "1.0.0";

export const BRAND_FONT_FAMILY = "__FONT_PRIMARY__, system-ui, sans-serif";

/** Fallbacks (SSR / testes / variável ausente): valores HSL crus do DS. */
const FALLBACKS: Record<string, string> = {
  "--primary": "228 70% 51%",
  "--primary-foreground": "0 0% 100%",
  "--secondary": "196 85% 45%",
  "--success": "145 63% 32%",
  "--warning": "38 92% 50%",
  "--error": "0 78% 52%",
  "--destructive": "0 78% 52%",
  "--info": "228 70% 60%",
  "--foreground": "228 60% 12%",
  "--muted-foreground": "228 12% 42%",
  "--border": "220 18% 88%",
  "--card": "0 0% 100%",
  "--background": "210 25% 99%",
  "--brand-comp-indigo": "245 75% 55%",
  "--brand-comp-gold": "42 90% 55%",
  "--brand-comp-lime": "152 70% 45%",
  "--brand-comp-blue-mid": "228 70% 65%",
  "--brand-comp-yellow": "46 98% 60%",
  "--brand-comp-red": "0 78% 52%",
};

/**
 * Converte "H S% L%" (formato dos tokens do DS) em canais RGB 0-255.
 * Aceita valores com ou sem unidade (`228`, `228deg`, `70%`, `70`).
 */
function hslTokenToRgb(value: string): [number, number, number] {
  const parts = value.replace(/\//g, " ").split(/[\s,]+/).filter(Boolean);
  const num = (raw: string | undefined, fallback: number) => {
    const n = parseFloat((raw ?? "").replace(/[^0-9.+-]/g, ""));
    return Number.isFinite(n) ? n : fallback;
  };
  const h = ((num(parts[0], 0) % 360) + 360) % 360;
  const s = Math.min(100, Math.max(0, num(parts[1], 0))) / 100;
  const l = Math.min(100, Math.max(0, num(parts[2], 0))) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/**
 * Lê uma CSS custom property (formato "H S% L%") e devolve SEMPRE uma cor
 * `rgb(r, g, b)` / `rgba(r, g, b, a)`.
 *
 * IMPORTANTE: o parser de cor do ECharts (zrender) não entende a sintaxe
 * CSS Color 4 `hsl(h s% l% / a)`. Ao derivar cores (estado `emphasis` do
 * hover, por exemplo) o parse falha e o elemento perde a cor. Por isso a
 * saída é sempre rgb()/rgba().
 */
export function readToken(name: string, alpha?: number): string {
  const key = name.startsWith("--") ? name : `--${name}`;
  let raw = "";
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    raw = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
  }
  const value = raw || FALLBACKS[key] || "228 70% 51%";
  const [r, g, b] = hslTokenToRgb(value);
  return alpha === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


/** Nome legível + token de cada cor da paleta categórica oficial. */
export const BRAND_PALETTE_TOKENS: { token: string; nome: string }[] = [
  { token: "--primary", nome: "Primária" },
  { token: "--secondary", nome: "Secundária" },
  { token: "--success", nome: "Sucesso" },
  { token: "--warning", nome: "Atenção" },
  { token: "--error", nome: "Erro" },
  { token: "--info", nome: "Informação" },
  { token: "--brand-comp-indigo", nome: "Indigo complementar" },
  { token: "--brand-comp-gold", nome: "Dourado complementar" },
  { token: "--brand-comp-lime", nome: "Verde-limão complementar" },
  { token: "--brand-comp-blue-mid", nome: "Azul médio complementar" },
];

/**
 * Paleta categórica oficial de séries (10 cores, sempre de tokens).
 * É um getter-like array construído no import; para valores atualizados
 * após troca de tema use `getBrandPalette()`.
 */
export function getBrandPalette(): string[] {
  return BRAND_PALETTE_TOKENS.map((t) => readToken(t.token));
}

export const BRAND_PALETTE: string[] = getBrandPalette();

/**
 * Cores complementares do tema padrão do Apache ECharts 5.
 * Uso autorizado pelo cliente APENAS quando o tipo de gráfico exige mais
 * matizes do que as 10 cores do DS (sunburst, treemap, sankey, graph, tree,
 * themeRiver, pizza com muitas fatias, parallel).
 */
export const ECHARTS_PALETTE_COMPLEMENTAR: string[] = [
  "#5470c6",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
];

/**
 * Paleta estendida (19 cores): as 10 primeiras são tokens do Design System
 * __BRAND_NAME__, nesta ordem; as 9 seguintes vêm do tema oficial do Apache
 * ECharts 5 e só entram em cena quando a visualização precisa de muitos
 * matizes simultâneos.
 */
export function getBrandPaletteEstendida(): string[] {
  return [...getBrandPalette(), ...ECHARTS_PALETTE_COMPLEMENTAR];
}

export const BRAND_PALETTE_ESTENDIDA: string[] = getBrandPaletteEstendida();

/** Escala sequencial (claro -> --primary) para `visualMap` contínuo. */
export function getBrandScaleSequencial(): string[] {
  return [readToken("--primary", 0.12), readToken("--primary", 0.4), readToken("--primary", 0.7), readToken("--primary")];
}

/** Escala divergente (--error -> neutro -> --success) para `visualMap`. */
export function getBrandScaleDivergente(): string[] {
  return [readToken("--error"), readToken("--error", 0.45), readToken("--muted-foreground", 0.3), readToken("--success", 0.45), readToken("--success")];
}

export const BRAND_SCALE_SEQUENCIAL: string[] = getBrandScaleSequencial();
export const BRAND_SCALE_DIVERGENTE: string[] = getBrandScaleDivergente();

export type BrandThemeMode = "light" | "dark";

export interface BrandEchartsTheme {
  color: string[];
  backgroundColor: string;
  textStyle: Record<string, unknown>;
  title: Record<string, unknown>;
  legend: Record<string, unknown>;
  tooltip: Record<string, unknown>;
  axisPointer: Record<string, unknown>;
  grid: Record<string, unknown>;
  categoryAxis: Record<string, unknown>;
  valueAxis: Record<string, unknown>;
  toolbox: Record<string, unknown>;
  /** Defaults de `emphasis` por tipo de série (hover previsível). */
  bar: Record<string, unknown>;
  line: Record<string, unknown>;
  pie: Record<string, unknown>;
  scatter: Record<string, unknown>;
  treemap: Record<string, unknown>;
  sunburst: Record<string, unknown>;
  sankey: Record<string, unknown>;
  graph: Record<string, unknown>;
  heatmap: Record<string, unknown>;
  funnel: Record<string, unknown>;
}


/** Lê um token numérico (px ou sem unidade) dos tokens de pele do estilo visual. */
function readNumber(name: string, fallback: number): number {
  if (typeof window === "undefined" || typeof document === "undefined") return fallback;
  const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(n) ? n : fallback;
}

export function buildBrandTheme(mode: BrandThemeMode): BrandEchartsTheme {
  const lineWidth = readNumber("--chart-line-width", 2);
  const barRadius = readNumber("--chart-bar-radius", 0);
  const smooth = readNumber("--chart-smooth", 0) > 0;
  const foreground = readToken("--foreground");
  const muted = readToken("--muted-foreground");
  const border = readToken("--border");
  const card = readToken("--card");
  const shadow = mode === "dark" ? "rgba(0, 0, 0, 0.55)" : readToken("--primary", 0.3);

  const axisLine = { show: true, lineStyle: { color: border, width: 1 } };
  const axisLabel = { color: muted, fontSize: 12, fontFamily: BRAND_FONT_FAMILY };
  const splitLine = { show: true, lineStyle: { color: border, type: "dashed" as const } };

  return {
    color: getBrandPalette(),
    backgroundColor: "transparent",
    textStyle: { fontFamily: BRAND_FONT_FAMILY, color: foreground, fontSize: 12 },
    title: {
      textStyle: { color: foreground, fontFamily: BRAND_FONT_FAMILY, fontWeight: 600, fontSize: 15 },
      subtextStyle: { color: muted, fontFamily: BRAND_FONT_FAMILY, fontSize: 12 },
    },
    legend: {
      textStyle: { color: muted, fontFamily: BRAND_FONT_FAMILY, fontSize: 12 },
      icon: "roundRect",
      itemWidth: 12,
      itemHeight: 8,
    },
    tooltip: {
      backgroundColor: card,
      borderColor: border,
      borderWidth: readNumber("--card-border-width", 1),
      borderRadius: readNumber("--chart-tooltip-radius", 8),
      padding: [8, 12],
      extraCssText: mode === "dark"
        ? "box-shadow: 0 10px 15px -3px hsl(0 0% 0% / 0.3);"
        : "box-shadow: 0 10px 15px -3px hsl(228 70% 30% / 0.09);",
      textStyle: { color: foreground, fontFamily: BRAND_FONT_FAMILY, fontSize: 12 },
    },
    axisPointer: {
      lineStyle: { color: border },
      crossStyle: { color: border },
      label: { backgroundColor: readToken("--primary"), color: readToken("--primary-foreground") },
    },
    grid: { left: 12, right: 16, top: 40, bottom: 12, containLabel: true, borderColor: border },
    categoryAxis: {
      axisLine,
      axisTick: { show: false },
      axisLabel,
      splitLine: { show: false },
      nameTextStyle: { color: muted, fontFamily: BRAND_FONT_FAMILY, fontSize: 12 },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel,
      splitLine,
      nameTextStyle: { color: muted, fontFamily: BRAND_FONT_FAMILY, fontSize: 12 },
    },
    toolbox: {
      iconStyle: { borderColor: muted },
      emphasis: { iconStyle: { borderColor: readToken("--primary") } },
    },
    // Hover previsível: destaca o elemento sob o cursor sem apagar os demais.
    // Sombras usam cor derivada de token com alpha (rgba), parseável pelo zrender.
    bar: {
      ...(barRadius > 0 ? { itemStyle: { borderRadius: barRadius } } : {}),
      emphasis: { focus: "series", itemStyle: { shadowBlur: 10, shadowColor: shadow } },
    },
    line: {
      ...(lineWidth !== 2 ? { lineStyle: { width: lineWidth } } : {}),
      ...(smooth ? { smooth: true } : {}),
      emphasis: { focus: "series" },
    },
    pie: {
      emphasis: {
        focus: "self",
        itemStyle: { shadowBlur: 10, shadowColor: shadow },
      },
    },
    scatter: { emphasis: { focus: "series", itemStyle: { shadowBlur: 8, shadowColor: shadow } } },
    treemap: { emphasis: { focus: "self", itemStyle: { shadowBlur: 8, shadowColor: shadow } } },
    sunburst: { emphasis: { focus: "ancestor" } },
    sankey: { emphasis: { focus: "adjacency" } },
    graph: { emphasis: { focus: "adjacency", itemStyle: { shadowBlur: 10, shadowColor: shadow } } },
    heatmap: { emphasis: { itemStyle: { shadowBlur: 8, shadowColor: shadow, borderColor: foreground, borderWidth: 1 } } },
    funnel: { emphasis: { focus: "self", itemStyle: { shadowBlur: 8, shadowColor: shadow } } },
  };
}


export const BRAND_THEME_NAMES = {
  light: "brand-light",
  dark: "brand-dark",
} as const;

interface EchartsThemeRegistrar {
  registerTheme: (name: string, theme: unknown) => void;
}

/** (Re)registra `brand-light` e `brand-dark` com os tokens atuais. */
export function registerBrandThemes(echarts: EchartsThemeRegistrar): void {
  echarts.registerTheme(BRAND_THEME_NAMES.light, buildBrandTheme("light"));
  echarts.registerTheme(BRAND_THEME_NAMES.dark, buildBrandTheme("dark"));
}
