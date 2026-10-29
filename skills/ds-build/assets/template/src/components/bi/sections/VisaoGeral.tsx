import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useBI } from "@/context/BIDataContext";
import {
  aplicarFiltros,
  contarPorCampo,
  distribuicaoStatus,
  evolucaoTemporal,
  funilComercial,
  indicadores,
  qualidadeDados,
} from "@/lib/bi/aggregations";
import IndicatorCard from "../IndicatorCard";
import { KPIGridSkeleton, ChartCardSkeleton } from "../BISkeletons";
import BrandChart from "@/components/charts/BrandChart";
import { BRAND_PALETTE } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";
import { cn } from "@/lib/utils";
import { bentoCell, bentoGrid } from "@/components/layout/bento";
import {
  Building2,
  PhoneCall,
  Users,
  Mail,
  MapPin,
  Target,
  AlertCircle,
  Sparkles,
} from "lucide-react";

/** Divide a base em dois períodos de igual duração para calcular deltas reais. */
function deltasPorPeriodo(dados: ReturnType<typeof aplicarFiltros>) {
  const datas = dados.map((d) => d.data).filter(Boolean).sort() as string[];
  if (datas.length < 4) return null;
  const inicio = new Date(datas[0]);
  const fim = new Date(datas[datas.length - 1]);
  const meio = new Date((+inicio + +fim) / 2).toISOString().slice(0, 10);
  const atual = dados.filter((d) => d.data && d.data >= meio);
  const anterior = dados.filter((d) => d.data && d.data < meio);
  if (!atual.length || !anterior.length) return null;
  const a = indicadores(atual);
  const b = indicadores(anterior);
  const pct = (novo: number, velho: number) =>
    velho === 0 ? null : Math.round(((novo - velho) / velho) * 1000) / 10;
  return {
    empresasUnicas: pct(a.empresasUnicas, b.empresasUnicas),
    atendimentos: pct(a.atendimentos, b.atendimentos),
    contatos: pct(a.contatos, b.contatos),
    comEmail: pct(a.comEmail, b.comEmail),
    cidades: pct(a.cidades, b.cidades),
    oportunidades: pct(a.oportunidades, b.oportunidades),
    semRetorno: pct(a.semRetorno, b.semRetorno),
    taxaQualificacao: pct(a.taxaQualificacao, b.taxaQualificacao),
  };
}

export default function VisaoGeral({ loading = false }: { loading?: boolean }) {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);
  const [granularidade, setGranularidade] = useState<"dia" | "semana" | "mes">("mes");

  const kpis = indicadores(dados);
  const deltas = useMemo(() => deltasPorPeriodo(dados), [dados]);
  const d = (k: keyof NonNullable<typeof deltas>) => (deltas ? deltas[k] : null);

  const porCidade = contarPorCampo(dados, "cidade").slice(0, 8);
  const porStatus = distribuicaoStatus(dados).filter((s) => s.value > 0);
  const evolucao = evolucaoTemporal(dados, granularidade);
  const funil = funilComercial(dados);
  const qualidade = qualidadeDados(dados);

  const optCidades: EChartsOption = useMemo(() => {
    const ord = [...porCidade].sort((a, b) => a.value - b.value);
    return {
      grid: { left: 8, right: 40, top: 12, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "value", axisLabel: { show: false }, splitNumber: 3 },
      yAxis: { type: "category", data: ord.map((c) => c.name) },
      series: [
        {
          type: "bar",
          name: "Empresas atendidas",
          data: ord.map((c) => c.value),
          barMaxWidth: 18,
          itemStyle: { color: BRAND_PALETTE[0], borderRadius: [0, 4, 4, 0] },
          label: {
            show: true,
            position: "right",
            formatter: (p: { value: unknown }) => formatarNumero(Number(p.value)),
          },
        },
      ],
    };
  }, [porCidade]);

  const optStatus: EChartsOption = useMemo(
    () => ({
      tooltip: { trigger: "item" },
      legend: { bottom: 0, type: "scroll" },
      series: [
        {
          type: "pie",
          radius: ["45%", "70%"],
          center: ["50%", "44%"],
          avoidLabelOverlap: true,
          itemStyle: { borderWidth: 2 },
          label: { show: false },
          data: porStatus.map((s, i) => ({
            name: s.name,
            value: s.value,
            itemStyle: { color: BRAND_PALETTE[i % BRAND_PALETTE.length] },
          })),
        },
      ],
    }),
    [porStatus],
  );

  const optEvolucao: EChartsOption = useMemo(
    () => ({
      grid: { left: 8, right: 16, top: 20, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: evolucao.map((e) => e.name), boundaryGap: false },
      yAxis: { type: "value", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
      series: [
        {
          type: "line",
          name: "Atendimentos",
          smooth: true,
          data: evolucao.map((e) => e.value),
          showSymbol: evolucao.length < 30,
          lineStyle: { width: 2, color: BRAND_PALETTE[1] },
          itemStyle: { color: BRAND_PALETTE[1] },
          areaStyle: { opacity: 0.12, color: BRAND_PALETTE[1] },
        },
      ],
    }),
    [evolucao],
  );

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <KPIGridSkeleton count={8} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCardSkeleton height={260} />
          <ChartCardSkeleton height={260} />
          <ChartCardSkeleton height={260} />
          <ChartCardSkeleton height={260} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Painel de Atendimento e Inteligência Comercial
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe empresas atendidas, atendimentos realizados, oportunidades identificadas e a
          qualidade da base de empreendedores do __BRAND_NAME__.
        </p>
      </div>

      <div className={bentoGrid("grid grid-cols-2 md:grid-cols-4 gap-3")}>
        <IndicatorCard className={bentoCell("2x1", { hero: true })} title="Empresas atendidas" value={kpis.empresasUnicas} icon={Building2} tooltip="Empresas distintas identificadas pelo CNPJ." delta={d("empresasUnicas")} />
        <IndicatorCard className={bentoCell()} title="Atendimentos" value={kpis.atendimentos} icon={PhoneCall} tooltip="Registros de atendimento ao empreendedor." delta={d("atendimentos")} />
        <IndicatorCard className={bentoCell()} title="Contatos" value={kpis.contatos} icon={Users} tooltip="Registros com contato nominal identificado." delta={d("contatos")} />
        <IndicatorCard className={bentoCell()} title="Com e-mail" value={kpis.comEmail} icon={Mail} tooltip="Empresas com pelo menos um e-mail cadastrado." delta={d("comEmail")} />
        <IndicatorCard className={bentoCell()} title="Municípios atendidos" value={kpis.cidades} icon={MapPin} tooltip="Municípios com registros de atendimento." delta={d("cidades")} />
        <IndicatorCard className={bentoCell("2x1")} title="Oportunidades" value={kpis.oportunidades} icon={Target} tooltip="Empresas em estágio de oportunidade, cadastro ou proposta." delta={d("oportunidades")} />
        <IndicatorCard className={bentoCell("2x1")} title="Sem retorno" value={kpis.semRetorno} icon={AlertCircle} tooltip="Tentativas sem resposta ou aguardando retorno." delta={d("semRetorno")} />
        <IndicatorCard className={bentoCell("2x1")} title="Taxa de qualificação" value={`${kpis.taxaQualificacao}%`} icon={Sparkles} tooltip="Percentual de registros com potencial médio ou alto." delta={d("taxaQualificacao")} />
      </div>

      <div className={bentoGrid("grid grid-cols-1 lg:grid-cols-2 gap-4")}>
        <ChartCard className={bentoCell("3x1")} title="Empresas por município">
          <BrandChart
            option={optCidades}
            height={260}
            ariaLabel={`Gráfico de barras horizontais com as ${porCidade.length} cidades com mais empresas atendidas.`}
          />
        </ChartCard>

        <ChartCard className={bentoCell()} title="Empresas por status">
          <BrandChart
            option={optStatus}
            height={260}
            ariaLabel="Gráfico de rosca com a distribuição das empresas por status de atendimento."
          />
        </ChartCard>

        <ChartCard
          className={bentoCell("2x1")}
          title="Evolução dos atendimentos"
          action={
            <div className="flex gap-1">
              {(["dia", "semana", "mes"] as const).map((g) => (
                <button data-ds="button" data-variant="toggle"
                  key={g}
                  onClick={() => setGranularidade(g)}
                  aria-pressed={granularidade === g}
                  className={`px-2 py-1 text-[10px] rounded ${granularidade === g ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70"}`}
                >
                  {g === "dia" ? "Diário" : g === "semana" ? "Semanal" : "Mensal"}
                </button>
              ))}
            </div>
          }
        >
          <BrandChart
            option={optEvolucao}
            height={260}
            ariaLabel={`Gráfico de linha com a evolução ${granularidade === "dia" ? "diária" : granularidade === "semana" ? "semanal" : "mensal"} dos atendimentos realizados.`}
          />
        </ChartCard>

        <ChartCard className={bentoCell("2x1")} title="Funil de atendimento">
          <div className="space-y-2 py-2">
            {funil.map((etapa, i) => {
              const max = funil[0].value || 1;
              const pct = (etapa.value / max) * 100;
              return (
                <div key={etapa.name} className="flex items-center gap-3">
                  <span className="w-40 text-xs text-foreground/80 truncate">{etapa.name}</span>
                  <div className="flex-1 h-7 rounded bg-muted overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end pr-2 text-[10px] font-semibold text-primary-foreground"
                      style={{
                        width: `${Math.max(pct, 6)}%`,
                        background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7) ${50 + i * 5}%)`,
                      }}
                    >
                      {formatarNumero(etapa.value)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Qualidade dos dados — preenchimento dos campos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 py-2">
          {qualidade.map((q) => (
            <div key={q.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/80">{q.name}</span>
                <span className="font-semibold text-foreground">{q.percent}%</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${q.percent}%`,
                    background:
                      q.percent >= 70
                        ? "hsl(var(--success))"
                        : q.percent >= 40
                          ? "hsl(var(--warning))"
                          : "hsl(var(--destructive))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-ds="card" className={cn("rounded-xl border border-border bg-card p-5 shadow-sm min-w-0", className)}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
