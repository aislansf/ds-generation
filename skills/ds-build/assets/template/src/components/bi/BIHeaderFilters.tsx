import { useMemo } from "react";
import { useBI } from "@/context/BIDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, Upload, Download } from "lucide-react";
import { STATUS_LIST } from "@/lib/bi/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const TODOS = "__todos__";

  function FiltroSelect({
    label,
    value,
    onChange,
    opcoes,
  }: {
    label: string;
    value: string | null;
    onChange: (v: string | null) => void;
    opcoes: string[];
  }) {
    return (
      <Select value={value ?? TODOS} onValueChange={(v) => onChange(v === TODOS ? null : v)}>
        <SelectTrigger className="h-9 text-xs" aria-label={label}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS} className="text-xs">
            {label}: todos
          </SelectItem>
          {opcoes.map((o) => (
            <SelectItem key={o} value={o} className="text-xs">
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

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
        <FiltroSelect label="Estado" value={filtros.uf} onChange={(v) => set("uf", v)} opcoes={ufs} />
        <FiltroSelect label="Município" value={filtros.cidade} onChange={(v) => set("cidade", v)} opcoes={cidades} />
        <FiltroSelect label="Status" value={filtros.status} onChange={(v) => set("status", v as never)} opcoes={STATUS_LIST} />
        <FiltroSelect label="Potencial" value={filtros.potencial} onChange={(v) => set("potencial", v)} opcoes={["Alto", "Médio", "Baixo"]} />
        <FiltroSelect label="Porte" value={filtros.porte} onChange={(v) => set("porte", v)} opcoes={["Pequeno", "Médio", "Grande"]} />
        <FiltroSelect label="Segmento" value={filtros.segmento} onChange={(v) => set("segmento", v)} opcoes={segmentos} />
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
