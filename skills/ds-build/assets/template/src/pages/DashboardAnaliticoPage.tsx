import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { EChartsOption } from "echarts";
import * as echarts from "echarts";
import {
  Menu, Sun, Moon, X, Calendar, Clock, LayoutGrid, Map, TrendingUp, FileText,
  PanelLeftClose, PanelLeftOpen, BarChart3, Target, Layers, ArrowUpRight,
  ArrowDownRight, Download, MoreVertical, Info, ArrowLeft,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { SEO } from "@/components/SEO";
import BrandChart from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero, formatarMoeda, formatarPercentual } from "@/lib/echarts/format";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { KPIGridSkeleton, ChartCardSkeleton, TableSkeleton } from "@/components/bi/BISkeletons";
import { brandCor as brandLogoCor } from "@/assets/brand";
import brandLogoBranca from "@/assets/brand-logo-white-header.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ══════════ Dados fictícios __BRAND_NAME__ ══════════ */

interface Regiao {
  nome: string;
  municipio: string;
  atendimentos: number;
  empresas: number;
  investimento: number;
  meta: number;
  tempo: number;
}

const REGIOES: Regiao[] = [
  { nome: "Região Metropolitana", municipio: "Porto Central", atendimentos: 14200, empresas: 3720, investimento: 8600000, meta: 87.5, tempo: 12 },
  { nome: "Vale do Sul", municipio: "Nova Esperança", atendimentos: 7350, empresas: 1890, investimento: 4200000, meta: 83.2, tempo: 13 },
  { nome: "Serra Alta", municipio: "Serra Alta", atendimentos: 6120, empresas: 1560, investimento: 3450000, meta: 82.7, tempo: 14 },
  { nome: "Região Central", municipio: "Monte Claro", atendimentos: 5240, empresas: 1340, investimento: 2810000, meta: 80.3, tempo: 15 },
  { nome: "Litoral Leste", municipio: "Praia Mansa", atendimentos: 4480, empresas: 1150, investimento: 2340000, meta: 79.6, tempo: 14 },
  { nome: "Vale Claro", municipio: "Vale Formoso", atendimentos: 3610, empresas: 930, investimento: 1880000, meta: 78.0, tempo: 16 },
  { nome: "Centro Sul", municipio: "Rio Verde", atendimentos: 3020, empresas: 780, investimento: 1520000, meta: 78.0, tempo: 16 },
  { nome: "Sertão Oeste", municipio: "Cachoeira Alta", atendimentos: 2450, empresas: 620, investimento: 1240000, meta: 76.5, tempo: 17 },
  { nome: "Planalto Oeste", municipio: "Alto Bonito", atendimentos: 1850, empresas: 460, investimento: 960000, meta: 75.2, tempo: 18 },
];

const PERIODOS = [
  { id: "12m", label: "Últimos 12 meses", fator: 1 },
  { id: "2025", label: "Ano civil 2025", fator: 0.87 },
  { id: "1s2026", label: "1º semestre 2026", fator: 0.54 },
];

const PROGRAMAS = [
  { id: "todos", label: "Todos os programas", fator: 1, cresc: 1 },
  { id: "empreender", label: "Empreender", fator: 0.24, cresc: 1.35 },
  { id: "ali", label: "AGI", fator: 0.21, cresc: 1.12 },
  { id: "programa-inova", label: "Programa Inova", fator: 0.19, cresc: 0.82 },
  { id: "negocio", label: "Visita Técnica", fator: 0.16, cresc: 0.64 },
];

/** Séries base da tendência (fração do total do período). */
const TENDENCIA: Record<string, { eixo: string[]; atual: number[]; anterior: number[] }> = {
  anual: {
    eixo: ["2021", "2022", "2023", "2024", "2025", "2026"],
    atual: [0.11, 0.13, 0.15, 0.18, 0.21, 0.22],
    anterior: [0.1, 0.12, 0.13, 0.16, 0.18, 0.19],
  },
  mensal: {
    eixo: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    atual: [0.062, 0.07, 0.081, 0.079, 0.086, 0.092, 0.088, 0.095, 0.09, 0.086, 0.088, 0.083],
    anterior: [0.058, 0.062, 0.071, 0.074, 0.077, 0.081, 0.083, 0.084, 0.082, 0.079, 0.078, 0.075],
  },
  semanal: {
    eixo: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
    atual: [0.019, 0.022, 0.026, 0.024, 0.028, 0.031, 0.029, 0.033],
    anterior: [0.018, 0.02, 0.023, 0.023, 0.025, 0.026, 0.027, 0.028],
  },
};

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const DIAS_FRACAO = [0.19, 0.22, 0.24, 0.17, 0.13, 0.05];

const MENU = [
  { id: "visao", label: "Visão Geral", icon: LayoutGrid },
  { id: "regiao", label: "Análise por Região", icon: Map },
  { id: "evolucao", label: "Evolução", icon: TrendingUp },
  { id: "relatorios", label: "Relatórios", icon: FileText },
];

/* ══════════ Página ══════════ */

export default function DashboardAnaliticoPage() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("visao");
  const [isLoading, setIsLoading] = useState(true);

  // filtros — rascunho (UI) e aplicado (dados)
  const [rascunho, setRascunho] = useState({ periodo: "12m", programa: "todos", regiao: "ce" });
  const [filtros, setFiltros] = useState(rascunho);
  const [tendenciaTab, setTendenciaTab] = useState("mensal");

  // no mobile o menu começa fechado (drawer)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const aplicar = () => {
    setFiltros(rascunho);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
    toast.success("Filtros aplicados", {
      description: "Indicadores e gráficos recalculados com o novo recorte.",
    });
  };

  /* ── dataset derivado dos filtros ── */
  const dados = useMemo(() => {
    const periodo = PERIODOS.find((p) => p.id === filtros.periodo) ?? PERIODOS[0];
    const programa = PROGRAMAS.find((p) => p.id === filtros.programa) ?? PROGRAMAS[0];
    const f = periodo.fator * programa.fator;

    const base = filtros.regiao === "ce" ? REGIOES : REGIOES.filter((r) => r.nome === filtros.regiao);
    const regioes = REGIOES.map((r) => ({
      ...r,
      atendimentos: Math.round(r.atendimentos * f),
      empresas: Math.round(r.empresas * f),
      investimento: Math.round(r.investimento * f),
      selecionada: filtros.regiao === "ce" || r.nome === filtros.regiao,
    }));
    const visiveis = regioes.filter((r) => r.selecionada);

    const atendimentos = visiveis.reduce((s, r) => s + r.atendimentos, 0);
    const empresas = visiveis.reduce((s, r) => s + r.empresas, 0);
    const investimento = visiveis.reduce((s, r) => s + r.investimento, 0);
    const peso = base.reduce((s, r) => s + r.atendimentos, 0) || 1;
    const meta = base.reduce((s, r) => s + r.meta * r.atendimentos, 0) / peso;
    const tempo = base.reduce((s, r) => s + r.tempo * r.atendimentos, 0) / peso;

    const g = programa.cresc;
    return {
      periodo, programa, regioes, visiveis,
      atendimentos, empresas, investimento, meta, tempo,
      delta: {
        atendimentos: 14.2 * g,
        meta: 2.1 * g,
        empresas: -0.8 * g,
        tempo: 12.5 * g,
      },
    };
  }, [filtros]);

  const ranking = useMemo(
    () => [...dados.visiveis].sort((a, b) => b.atendimentos - a.atendimentos),
    [dados],
  );

  /* ── cores resolvidas (re-lidas na troca de tema) ── */
  const cores = useMemo(() => ({
    primary: readToken("--primary"),
    primarySoft: readToken("--primary", 0.15),
    secondary: readToken("--secondary"),
    secondarySoft: readToken("--secondary", 0.35),
    secondaryFade: readToken("--secondary", 0.02),
    success: readToken("--success"),
    info: readToken("--info"),
    muted: readToken("--muted-foreground"),
    mutedSoft: readToken("--muted-foreground", 0.35),
  }), [theme]);

  /* ── gráfico 1: barras horizontais por macrorregião ── */
  const optRegioes: EChartsOption = useMemo(() => {
    const ord = [...ranking].sort((a, b) => a.atendimentos - b.atendimentos);
    return {
      grid: { left: 8, right: 56, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: (v) => formatarNumero(v as number),
      },
      xAxis: { type: "value", axisLabel: { show: false }, splitNumber: 3 },
      yAxis: { type: "category", data: ord.map((r) => r.nome) },
      series: [{
        type: "bar",
        name: "Atendimentos",
        data: ord.map((r) => r.atendimentos),
        itemStyle: { color: cores.primary, borderRadius: [0, 6, 6, 0] },
        barMaxWidth: 18,
        label: {
          show: true, position: "right", color: cores.muted, fontSize: 11,
          formatter: (p: { value?: unknown }) => formatarNumero(Number(p.value)),
        },
      }],
    };
  }, [ranking, cores]);

  /* ── gráfico 2: comparativo trimestral ── */
  const optTrimestral: EChartsOption = useMemo(() => {
    const trim = [0.22, 0.25, 0.26, 0.27];
    return {
      grid: { left: 8, right: 12, top: 44, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis" },
      legend: { top: 0, right: 0, icon: "circle", itemHeight: 8 },
      xAxis: { type: "category", data: ["1º Tri", "2º Tri", "3º Tri", "4º Tri"] },
      yAxis: [{ type: "value", axisLabel: { formatter: (v: number) => formatarNumero(v) } }],
      series: [
        {
          name: "Atendimentos", type: "line", symbol: "circle", symbolSize: 7,
          data: trim.map((t) => Math.round(dados.atendimentos * t)),
          itemStyle: { color: cores.primary }, lineStyle: { width: 2 },
          tooltip: { valueFormatter: (v) => formatarNumero(v as number) },
        },
        {
          name: "Investimento (R$ mil)", type: "line", symbol: "circle", symbolSize: 7,
          data: trim.map((t) => Math.round((dados.investimento * t) / 1000)),
          itemStyle: { color: cores.secondary }, lineStyle: { width: 2 },
          tooltip: { valueFormatter: (v) => formatarMoeda((v as number) * 1000, 0) },
        },
        {
          name: "Meta (%)", type: "line", symbol: "circle", symbolSize: 7,
          data: trim.map((_, i) => Number((dados.meta - 3 + i * 1.5).toFixed(1))),
          itemStyle: { color: cores.success }, lineStyle: { width: 2, type: "dashed" },
          tooltip: { valueFormatter: (v) => formatarPercentual(v as number) },
        },
      ],
    };
  }, [dados, cores]);

  /* ── gráfico 3: tendência (Anual / Mensal / Semanal) ── */
  const serieTendencia = useMemo(() => {
    const t = TENDENCIA[tendenciaTab];
    return {
      eixo: t.eixo,
      atual: t.atual.map((v) => Math.round(dados.atendimentos * v)),
      anterior: t.anterior.map((v) => Math.round(dados.atendimentos * v)),
    };
  }, [tendenciaTab, dados]);

  const optTendencia: EChartsOption = useMemo(() => ({
    grid: { left: 8, right: 12, top: 36, bottom: 8, containLabel: true },
    tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
    legend: { top: 0, right: 0, icon: "circle", itemHeight: 8 },
    xAxis: { type: "category", boundaryGap: false, data: serieTendencia.eixo },
    yAxis: { type: "value", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
    series: [
      {
        name: "Período atual", type: "line", smooth: true, symbol: "circle", symbolSize: 6,
        data: serieTendencia.atual,
        itemStyle: { color: cores.secondary }, lineStyle: { width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: cores.secondarySoft },
            { offset: 1, color: cores.secondaryFade },
          ]),
        },
      },
      {
        name: "Período anterior", type: "line", smooth: true, symbol: "none",
        data: serieTendencia.anterior,
        lineStyle: { width: 2, type: "dashed", color: cores.muted },
        itemStyle: { color: cores.muted },
      },
    ],
  }), [serieTendencia, cores]);

  const miniMetricas = useMemo(() => {
    const s = serieTendencia.atual;
    const media = s.reduce((a, b) => a + b, 0) / s.length;
    const ultimo = s[s.length - 1];
    const passos = s.slice(1).map((v, i) => v - s[i]);
    const tendencia = passos.reduce((a, b) => a + b, 0) / passos.length;
    return {
      projecao: Math.max(0, Math.round(ultimo + tendencia)),
      desvio: media ? ((ultimo - media) / media) * 100 : 0,
    };
  }, [serieTendencia]);

  /* ── gráfico 4: sazonalidade ── */
  const sazonal = useMemo(
    () => DIAS.map((d, i) => ({ dia: d, valor: Math.round(dados.atendimentos * DIAS_FRACAO[i]) })),
    [dados],
  );
  const picoIdx = useMemo(
    () => sazonal.reduce((best, s, i, arr) => (s.valor > arr[best].valor ? i : best), 0),
    [sazonal],
  );
  const antecedentes = useMemo(() => {
    const i1 = (picoIdx - 1 + DIAS.length) % DIAS.length;
    const i2 = (picoIdx - 2 + DIAS.length) % DIAS.length;
    return [DIAS[i2], DIAS[i1]];
  }, [picoIdx]);

  const optSazonalidade: EChartsOption = useMemo(() => ({
    grid: { left: 4, right: 4, top: 16, bottom: 4, containLabel: true },
    tooltip: { trigger: "axis", valueFormatter: (v) => formatarNumero(v as number) },
    xAxis: { type: "category", data: sazonal.map((s) => s.dia), axisTick: { show: false } },
    yAxis: { type: "value", show: false },
    series: [{
      type: "bar", name: "Atendimentos", barMaxWidth: 34,
      data: sazonal.map((s, i) => ({
        value: s.valor,
        itemStyle: { color: i === picoIdx ? cores.primary : cores.mutedSoft, borderRadius: 999 },
      })),
    }],
  }), [sazonal, picoIdx, cores]);

  /* ── ações ── */
  const exportarCSV = () => {
    const linhas = [
      ["Macrorregião", "Município polo", "Atendimentos", "Empresas atendidas", "Investimento (R$)"],
      ...ranking.map((r) => [r.nome, r.municipio, r.atendimentos, r.empresas, r.investimento]),
    ];
    const csv = linhas.map((l) => l.join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "atendimentos-por-macrorregiao.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado", { description: "atendimentos-por-macrorregiao.csv" });
  };

  const detalharRegiao = (nome: string) => {
    const r = ranking.find((x) => x.nome === nome);
    if (!r) return;
    toast(`${r.nome}`, {
      description: `${formatarNumero(r.atendimentos)} atendimentos · ${formatarNumero(r.empresas)} empresas · ${formatarMoeda(r.investimento, 0)} — polo ${r.municipio}.`,
    });
  };

  const kpis = [
    { titulo: "Atendimentos realizados", valor: formatarNumero(dados.atendimentos), delta: dados.delta.atendimentos, icon: BarChart3, cor: "hsl(var(--primary))" },
    { titulo: "Meta de execução", valor: formatarPercentual(dados.meta), delta: dados.delta.meta, icon: Target, cor: "hsl(var(--secondary))" },
    { titulo: "Empresas atendidas", valor: formatarNumero(dados.empresas), delta: dados.delta.empresas, icon: Layers, cor: "hsl(var(--success))" },
    { titulo: "Tempo médio de atendimento", valor: `${formatarNumero(dados.tempo)} dias`, delta: dados.delta.tempo, icon: Clock, cor: "hsl(var(--info))" },
  ];

  const maxRanking = ranking[0]?.atendimentos || 1;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <SEO
        title="Dashboard Analítico — Template __BRAND_NAME__"
        description="Modelo de painel analítico do Design System __BRAND_NAME__: KPIs, distribuição territorial, tendência mensal e sazonalidade com gráficos ECharts."
        path="/templates/dashboard-analitico"
      />
      <Toaster position="top-right" richColors closeButton />
      <h1 className="sr-only">
        Dashboard Analítico __BRAND_NAME__ — monitoramento de atendimentos, distribuição territorial e sazonalidade
      </h1>

      <Link
        to="/templates"
        className="brand-badge-secondary fixed bottom-3 right-3 z-50 inline-flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={12} /> Voltar ao DS
      </Link>

      {/* ═══ HEADER institucional ═══ */}
      <header
        className="sticky top-0 z-40 min-h-16 flex items-center gap-3 px-4 sm:px-6 shrink-0"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-header-grad-start) 0%, var(--brand-header-grad-end) 100%)",
        }}
      >
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Alternar menu lateral"
          className="p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors"
        >
          <Menu size={18} />
        </button>
        <img src={brandLogoBranca} alt="__BRAND_NAME__" className="h-8 w-auto shrink-0" />
        <span
          className="w-px h-8 shrink-0"
          style={{ background: "var(--brand-header-divider)" }}
        />
        <div className="hidden md:block min-w-0">
          <p className="text-sm font-semibold text-primary-foreground leading-tight truncate">
            Painel Analítico
          </p>
          <p className="text-xs text-primary-foreground/75 leading-tight truncate">
            Monitoramento de Atendimentos e Sazonalidade
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-2 text-primary-foreground">
            <Calendar size={16} className="opacity-75" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide opacity-75">Última atualização</p>
              <p className="text-xs font-semibold">28/08/2026 · 06h00</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-primary-foreground">
            <Clock size={16} className="opacity-75" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide opacity-75">Próxima atualização</p>
              <p className="text-xs font-semibold">29/08/2026 · 06h00</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors"
          >
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      {/* ═══ BODY ═══ */}
      <div className="flex-1 flex min-h-0 relative">
        {isMobile && sidebarOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-16 z-30 bg-foreground/40"
          />
        )}

        {sidebarOpen && (
          <aside
            className={`${
              isMobile
                ? "fixed left-0 top-16 bottom-0 z-40 w-[260px] shadow-xl"
                : `${collapsed ? "w-16" : "w-[260px]"} shrink-0`
            } bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200`}
          >
            <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border">
              {(!collapsed || isMobile) && (
                <span className="text-[10px] uppercase tracking-wide text-sidebar-muted">
                  Navegação
                </span>
              )}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Fechar menu"
                  className="p-1 rounded text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <nav className={`flex-1 overflow-y-auto ${collapsed && !isMobile ? "px-1" : "px-2"} py-2`} aria-label="Menu do painel">
              {MENU.map((item) => {
                const Icon = item.icon;
                const ativo = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    title={collapsed && !isMobile ? item.label : undefined}
                    aria-current={ativo ? "page" : undefined}
                    className={`w-full flex items-center ${
                      collapsed && !isMobile ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
                    } rounded text-[13px] transition-colors ${
                      ativo
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            {(!collapsed || isMobile) && (
              <div className="mx-3 mb-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
                <p className="text-[10px] uppercase tracking-wide text-sidebar-muted">
                  Status do sistema
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-xs text-sidebar-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-70 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  Dados atualizados hoje
                </p>
              </div>
            )}

            <div className={`border-t border-sidebar-border p-2 ${collapsed && !isMobile ? "flex justify-center" : "px-3"}`}>
              <button
                onClick={() => (isMobile ? setSidebarOpen(false) : setCollapsed((c) => !c))}
                aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                aria-expanded={!collapsed}
                className="flex items-center gap-2 w-full text-xs text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded py-1.5 px-2 transition-colors"
              >
                {collapsed && !isMobile ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                {(!collapsed || isMobile) && <span>Recolher menu</span>}
              </button>
            </div>
          </aside>
        )}

        {/* ═══ MAIN ═══ */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 space-y-5" aria-busy={isLoading}>
          {/* Filtros */}
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="space-y-1.5">
                <label htmlFor="f-periodo" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Período de análise
                </label>
                <Select value={rascunho.periodo} onValueChange={(v) => setRascunho((r) => ({ ...r, periodo: v }))}>
                  <SelectTrigger id="f-periodo"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERIODOS.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="f-programa" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Programa
                </label>
                <Select value={rascunho.programa} onValueChange={(v) => setRascunho((r) => ({ ...r, programa: v }))}>
                  <SelectTrigger id="f-programa"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROGRAMAS.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="f-regiao" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Região
                </label>
                <Select value={rascunho.regiao} onValueChange={(v) => setRascunho((r) => ({ ...r, regiao: v }))}>
                  <SelectTrigger id="f-regiao"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ce">Estado consolidado</SelectItem>
                    {REGIOES.map((r) => <SelectItem key={r.nome} value={r.nome}>{r.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={aplicar} className="w-full">Aplicar filtros</Button>
            </CardContent>
          </Card>

          {/* KPIs */}
          {isLoading ? (
            <KPIGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k) => {
                const Icon = k.icon;
                const positivo = k.delta >= 0;
                return (
                  <Card key={k.titulo} className="relative overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-px" style={{ background: k.cor }} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                            {k.titulo}
                          </p>
                          <p className="mt-2 text-2xl font-bold text-foreground">{k.valor}</p>
                        </div>
                        <span
                          className="shrink-0 rounded-lg p-2"
                          style={{ background: `color-mix(in srgb, ${k.cor} 12%, transparent)`, color: k.cor }}
                        >
                          <Icon size={18} />
                        </span>
                      </div>
                      <p className={`mt-3 flex items-center gap-1 text-xs ${positivo ? "text-success" : "text-destructive"}`}>
                        {positivo ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span className="font-semibold">{formatarPercentual(k.delta)}</span>
                        <span className="text-muted-foreground">vs. período anterior</span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Territorial + Trimestral */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 min-w-0">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-foreground">Distribuição Territorial de Atendimentos</h2>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Atendimentos por macrorregião
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" aria-label="Exportar dados em CSV" onClick={exportarCSV}>
                    <Download size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Mais opções"
                    onClick={() => toast("Mais opções", { description: "Ações adicionais do cartão (modelo demonstrativo)." })}
                  >
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <ChartCardSkeleton height={340} />
                ) : (
                  <div className="flex flex-col lg:flex-row gap-4 min-w-0">
                    <div className="flex-1 min-w-0 overflow-x-auto">
                      <BrandChart
                        option={optRegioes}
                        height={340}
                        ariaLabel={`Barras horizontais com atendimentos por macrorregião. Maior volume: ${ranking[0]?.nome} com ${formatarNumero(ranking[0]?.atendimentos ?? 0)} atendimentos.`}
                        onEvents={{
                          click: (p) => detalharRegiao((p as { name: string }).name),
                        }}
                      />
                    </div>
                    <div className="lg:w-64 shrink-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-2">
                        Top 5 regionais
                      </p>
                      <ul className="space-y-2.5">
                        {ranking.slice(0, 5).map((r) => (
                          <li key={r.nome}>
                            <button
                              type="button"
                              onClick={() => detalharRegiao(r.nome)}
                              className="w-full text-left rounded-md p-1.5 hover:bg-muted transition-colors"
                            >
                              <span className="flex items-baseline justify-between gap-2">
                                <span className="text-xs text-foreground truncate">{r.nome}</span>
                                <span className="text-xs font-semibold text-foreground shrink-0">
                                  {formatarNumero(r.atendimentos)}
                                </span>
                              </span>
                              <span className="mt-1 block h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <span
                                  className="block h-full rounded-full bg-primary"
                                  style={{ width: `${(r.atendimentos / maxRanking) * 100}%` }}
                                />
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader className="pb-2">
                <h2 className="text-base font-semibold text-foreground">Comparativo Trimestral</h2>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Atendimentos, investimento e meta
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <ChartCardSkeleton height={340} />
                ) : (
                  <BrandChart
                    option={optTrimestral}
                    height={340}
                    ariaLabel="Gráfico de linhas comparando atendimentos, investimento em reais e percentual de meta ao longo dos quatro trimestres."
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tendência + Sazonalidade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="min-w-0">
              <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 space-y-0 pb-2">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-foreground">Tendência Mensal</h2>
                  <p className="text-xs text-muted-foreground">Acompanhamento evolutivo dos atendimentos</p>
                </div>
                <Tabs value={tendenciaTab} onValueChange={setTendenciaTab} className="shrink-0">
                  <TabsList>
                    <TabsTrigger value="anual">Anual</TabsTrigger>
                    <TabsTrigger value="mensal">Mensal</TabsTrigger>
                    <TabsTrigger value="semanal">Semanal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <ChartCardSkeleton height={300} />
                ) : (
                  <>
                    <BrandChart
                      option={optTendencia}
                      height={300}
                      ariaLabel={`Área com a evolução dos atendimentos no recorte ${tendenciaTab} comparada ao período anterior em linha tracejada.`}
                    />
                    <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          Projeção próximo período
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatarNumero(miniMetricas.projecao)} atendimentos
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          Desvio da média
                        </p>
                        <p className={`text-sm font-semibold ${miniMetricas.desvio >= 0 ? "text-success" : "text-destructive"}`}>
                          {formatarPercentual(miniMetricas.desvio)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader className="pb-2">
                <h2 className="text-base font-semibold text-foreground">Sazonalidade do Atendimento</h2>
                <p className="text-xs text-muted-foreground">
                  Distribuição dos atendimentos por dia da semana nas unidades do __BRAND_NAME__, útil para
                  dimensionar equipes e agendas de consultoria.
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <ChartCardSkeleton height={260} />
                ) : (
                  <>
                    <BrandChart
                      option={optSazonalidade}
                      height={260}
                      ariaLabel={`Barras verticais de atendimentos por dia da semana. Pico em ${sazonal[picoIdx].dia} com ${formatarNumero(sazonal[picoIdx].valor)} atendimentos.`}
                    />
                    <div className="mt-3 flex gap-2 rounded-md border border-border bg-muted/50 p-3">
                      <Info size={16} className="text-info shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{sazonal[picoIdx].dia}</span> concentra o
                        maior volume ({formatarNumero(sazonal[picoIdx].valor)} atendimentos). Recomenda-se
                        antecipar processos críticos para {antecedentes[0]} e {antecedentes[1]}, reduzindo fila
                        no pico.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabela auxiliar (alternativa acessível aos gráficos) */}
          <Card className="min-w-0">
            <CardHeader className="pb-2">
              <h2 className="text-base font-semibold text-foreground">Detalhamento por macrorregião</h2>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Alternativa tabular aos gráficos
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              {isLoading ? (
                <TableSkeleton rows={5} cols={5} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[560px]">
                    <caption className="sr-only">
                      Atendimentos, empresas atendidas e investimento por macrorregião
                    </caption>
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wide text-muted-foreground border-b border-border">
                        <th scope="col" className="py-2 pr-3 font-bold">Macrorregião</th>
                        <th scope="col" className="py-2 pr-3 font-bold">Município polo</th>
                        <th scope="col" className="py-2 pr-3 font-bold">Atendimentos</th>
                        <th scope="col" className="py-2 pr-3 font-bold">Empresas</th>
                        <th scope="col" className="py-2 font-bold">Investimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((r) => (
                        <tr key={r.nome} className="border-b border-border last:border-0">
                          <td className="py-2 pr-3 text-foreground">{r.nome}</td>
                          <td className="py-2 pr-3 text-muted-foreground">{r.municipio}</td>
                          <td className="py-2 pr-3 text-foreground">{formatarNumero(r.atendimentos)}</td>
                          <td className="py-2 pr-3 text-foreground">{formatarNumero(r.empresas)}</td>
                          <td className="py-2 text-foreground">{formatarMoeda(r.investimento, 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rodapé */}
          <footer className="flex items-center justify-end gap-3 pt-2">
            <img src={brandLogoCor} alt="__BRAND_NAME__" className="h-6 w-auto dark:hidden" />
            <img src={brandLogoBranca} alt="__BRAND_NAME__" className="h-6 w-auto hidden dark:block" />
            <span className="w-px h-5 bg-border" />
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Painel Analítico v1.0 · __BRAND_NAME__
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
