import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros, contarPorCampo } from "@/lib/bi/aggregations";
import { macrorregiaoDoMunicipio } from "@/lib/bi/regioes";
import { formatarNumero } from "@/lib/echarts/format";

export default function Regioes() {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);

  const porMacrorregiao = useMemo(() => {
    const acc = dados.reduce<Record<string, number>>((m, r) => {
      const reg = macrorregiaoDoMunicipio(r.cidade);
      m[reg] = (m[reg] || 0) + 1;
      return m;
    }, {});
    return Object.entries(acc)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [dados]);

  const porResponsavel = contarPorCampo(dados, "responsavel");
  const porCidade = contarPorCampo(dados, "cidade");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Regiões</h2>
        <p className="text-sm text-muted-foreground">
          Distribuição dos atendimentos pelas macrorregiões de planejamento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Por macrorregião">
          <RankingList itens={porMacrorregiao} />
        </Card>
        <Card title="Por escritório regional">
          <RankingList itens={porResponsavel} />
        </Card>
        <Card title="Por município">
          <RankingList itens={porCidade.slice(0, 10)} />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div data-ds="card" className="rounded-xl border border-border bg-card p-5 shadow-sm min-w-0">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function RankingList({ itens }: { itens: { name: string; value: number }[] }) {
  const max = Math.max(...itens.map((i) => i.value), 1);
  return (
    <ul className="space-y-2">
      {itens.map((i) => (
        <li key={i.name}>
          <div className="flex justify-between text-xs mb-1 gap-2">
            <span className="truncate">{i.name}</span>
            <span className="font-semibold tabular-nums">{formatarNumero(i.value)}</span>
          </div>
          <div className="h-1.5 bg-muted rounded overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
      {itens.length === 0 && (
        <li className="text-xs text-muted-foreground py-6 text-center">
          Nenhum registro nos filtros atuais.
        </li>
      )}
    </ul>
  );
}
