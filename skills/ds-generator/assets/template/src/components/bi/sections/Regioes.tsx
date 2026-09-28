import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros, contarPorCampo } from "@/lib/bi/aggregations";

const REGIOES: Record<string, string> = {
  SP: "Sudeste", RJ: "Sudeste", MG: "Sudeste", ES: "Sudeste",
  PR: "Sul", SC: "Sul", RS: "Sul",
  BA: "Nordeste", PE: "Nordeste", CE: "Nordeste", MA: "Nordeste", PI: "Nordeste", RN: "Nordeste", PB: "Nordeste", AL: "Nordeste", SE: "Nordeste",
  GO: "Centro-Oeste", MT: "Centro-Oeste", MS: "Centro-Oeste", DF: "Centro-Oeste",
  AM: "Norte", PA: "Norte", AC: "Norte", RO: "Norte", RR: "Norte", AP: "Norte", TO: "Norte",
};

export default function Regioes() {
  const { registros, filtros } = useBI();
  const dados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros]);

  const porRegiao = dados.reduce<Record<string, number>>((acc, r) => {
    const reg = REGIOES[r.uf ?? ""] ?? "Não informada";
    acc[reg] = (acc[reg] || 0) + 1;
    return acc;
  }, {});
  const porEstado = contarPorCampo(dados, "uf");
  const porCidade = contarPorCampo(dados, "cidade");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Regiões</h1>
        <p className="text-sm text-muted-foreground">Distribuição geográfica das empresas e atendimentos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Por região">
          <RankingList itens={Object.entries(porRegiao).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)} />
        </Card>
        <Card title="Por estado">
          <RankingList itens={porEstado} />
        </Card>
        <Card title="Por cidade">
          <RankingList itens={porCidade.slice(0, 10)} />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
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
          <div className="flex justify-between text-xs mb-1">
            <span>{i.name}</span>
            <span className="font-semibold">{i.value}</span>
          </div>
          <div className="h-1.5 bg-muted rounded overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
