import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, Upload, Download } from "lucide-react";
import { STATUS_LIST } from "@/lib/bi/types";

interface Props {
  onImportar: () => void;
  onExportar: () => void;
}

export default function BIHeaderFilters({ onImportar, onExportar }: Props) {
  const { registros, filtros, setFiltros, resetFiltros } = useBI();

  const ufs = useMemo(
    () => Array.from(new Set(registros.map((r) => r.uf).filter(Boolean))).sort() as string[],
    [registros],
  );
  const cidades = useMemo(
    () => Array.from(new Set(registros.map((r) => r.cidade).filter(Boolean))).sort() as string[],
    [registros],
  );
  const segmentos = useMemo(
    () => Array.from(new Set(registros.map((r) => r.segmento).filter(Boolean))).sort() as string[],
    [registros],
  );

  const set = <K extends keyof typeof filtros>(k: K, v: (typeof filtros)[K]) =>
    setFiltros({ ...filtros, [k]: v });

  const selectCls =
    "h-9 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-foreground/80 uppercase tracking-wide">
        <Filter className="h-3.5 w-3.5" /> Filtros globais
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-2">
        <Input
          type="date"
          value={filtros.dataInicio ?? ""}
          onChange={(e) => set("dataInicio", e.target.value || null)}
          className="h-9 text-xs"
          aria-label="Período inicial"
        />
        <Input
          type="date"
          value={filtros.dataFim ?? ""}
          onChange={(e) => set("dataFim", e.target.value || null)}
          className="h-9 text-xs"
          aria-label="Período final"
        />
        <select className={selectCls} value={filtros.uf ?? ""} onChange={(e) => set("uf", e.target.value || null)} aria-label="Estado">
          <option value="">Estado</option>
          {ufs.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filtros.cidade ?? ""} onChange={(e) => set("cidade", e.target.value || null)} aria-label="Cidade">
          <option value="">Cidade</option>
          {cidades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filtros.status ?? ""} onChange={(e) => set("status", (e.target.value || null) as never)} aria-label="Status">
          <option value="">Status</option>
          {STATUS_LIST.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filtros.potencial ?? ""} onChange={(e) => set("potencial", e.target.value || null)} aria-label="Potencial">
          <option value="">Potencial</option>
          {["Alto", "Médio", "Baixo"].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filtros.porte ?? ""} onChange={(e) => set("porte", e.target.value || null)} aria-label="Porte">
          <option value="">Porte</option>
          {["Pequeno", "Médio", "Grande"].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filtros.segmento ?? ""} onChange={(e) => set("segmento", e.target.value || null)} aria-label="Segmento">
          <option value="">Segmento</option>
          {segmentos.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 justify-end">
        <Button variant="outline" size="sm" onClick={resetFiltros}>
          <X className="h-3.5 w-3.5" /> Limpar
        </Button>
        <Button variant="outline" size="sm" onClick={onExportar}>
          <Download className="h-3.5 w-3.5" /> Exportar
        </Button>
        <Button size="sm" onClick={onImportar} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Upload className="h-3.5 w-3.5" /> Importar planilha
        </Button>
      </div>
    </div>
  );
}
