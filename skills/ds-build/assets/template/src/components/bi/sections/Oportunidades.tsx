import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros } from "@/lib/bi/aggregations";
import IndicatorCard from "../IndicatorCard";
import { KPIGridSkeleton, ChartCardSkeleton, TableSkeleton } from "../BISkeletons";
import BrandChart from "@/components/charts/BrandChart";
import { BRAND_PALETTE } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Target,
  TrendingUp,
  GraduationCap,
  BadgeCheck,
  AlertOctagon,
  Handshake,
  Award,
  Hourglass,
} from "lucide-react";

export default function Oportunidades({ loading = false }: { loading?: boolean }) {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);

  const oportunidades = dados.filter((d) =>
    ["Oportunidade identificada", "Cadastro solicitado", "Proposta enviada"].includes(d.status),
  );
  const alto = oportunidades.filter((o) => o.potencial === "Alto");
  const comConsultoria = dados.filter((d) => d.consultoriaVigente);
  const formalizadas = dados.filter((d) => d.possuiCnpjAtivo);

  const obs = (d: { observacoes: string | null }) => d.observacoes ?? "";
  const interesseConsultoria = dados.filter((d) => /consultoria/i.test(obs(d))).length;
  const interesseCapacitacao = dados.filter((d) => /capacita|curso|trilha/i.test(obs(d))).length;
  const emAnalise = dados.filter((d) => /an[áa]lise|aguard/i.test(obs(d))).length;
  const jaParticipou = dados.filter((d) => /empreender|agi|programa inova/i.test(obs(d))).length;

  const dadosCidade = useMemo(() => {
    const porCidade = oportunidades.reduce<Record<string, number>>((acc, r) => {
      const k = r.cidade ?? "—";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(porCidade)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [oportunidades]);

  const optCidade: EChartsOption = useMemo(
    () => ({
      grid: { left: 8, right: 16, top: 20, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: {
        type: "category",
        data: dadosCidade.map((c) => c.name),
        axisLabel: { interval: 0, rotate: dadosCidade.length > 8 ? 35 : 0, hideOverlap: true },
      },
      yAxis: { type: "value", axisLabel: { formatter: (v: number) => formatarNumero(v) } },
      series: [
        {
          type: "bar",
          name: "Oportunidades",
          data: dadosCidade.map((c) => c.value),
          barMaxWidth: 26,
          itemStyle: { color: BRAND_PALETTE[1], borderRadius: [4, 4, 0, 0] },
        },
      ],
    }),
    [dadosCidade],
  );

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <KPIGridSkeleton count={8} />
        <ChartCardSkeleton height={260} />
        <TableSkeleton cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Oportunidades</h2>
        <p className="text-sm text-muted-foreground">
          Empreendedores com potencial de adesão às soluções e programas do __BRAND_NAME__.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <IndicatorCard title="Oportunidades abertas" value={oportunidades.length} icon={Target} delta={null} />
        <IndicatorCard title="Alto potencial" value={alto.length} icon={TrendingUp} delta={null} />
        <IndicatorCard title="Consultorias vigentes" value={comConsultoria.length} icon={BadgeCheck} delta={null} />
        <IndicatorCard title="Empresas formalizadas" value={formalizadas.length} icon={Handshake} delta={null} />
        <IndicatorCard title="Interesse em consultoria" value={interesseConsultoria} icon={Handshake} delta={null} />
        <IndicatorCard title="Interesse em capacitação" value={interesseCapacitacao} icon={GraduationCap} delta={null} />
        <IndicatorCard title="Em análise" value={emAnalise} icon={Hourglass} delta={null} />
        <IndicatorCard title="Já participou de programa" value={jaParticipou} icon={Award} delta={null} />
      </div>

      <div data-ds="card" className="rounded-xl border border-border bg-card p-5 shadow-sm min-w-0">
        <h3 className="text-sm font-semibold mb-3">Oportunidades por município</h3>
        <BrandChart
          option={optCidade}
          height={260}
          ariaLabel="Gráfico de barras verticais com o número de oportunidades por município."
        />
      </div>

      <div data-ds="card" className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertOctagon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Oportunidades prioritárias</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Município</TableHead>
                <TableHead>Potencial</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Próxima ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alto.slice(0, 10).map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.empresa ?? "—"}</TableCell>
                  <TableCell className="text-xs">{o.cidade ?? "—"}</TableCell>
                  <TableCell className="text-xs">{o.potencial}</TableCell>
                  <TableCell className="text-xs">
                    {[
                      o.participouPrograma && "Já participou de programa",
                      o.possuiCnpjAtivo && "CNPJ ativo",
                      o.consultoriaVigente && "Consultoria vigente",
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {o.proximaAcao ?? "Definir próximo atendimento"}
                  </TableCell>
                </TableRow>
              ))}
              {alto.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                    Nenhuma oportunidade de alto potencial nos filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
