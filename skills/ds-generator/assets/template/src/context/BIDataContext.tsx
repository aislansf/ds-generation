import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import seed from "@/data/prospeccao-seed.json";
import { parseRows } from "@/lib/bi/parser";
import { RegistroAtendimento, FiltrosGlobais, FILTROS_VAZIOS } from "@/lib/bi/types";

interface BIDataContextValue {
  registros: RegistroAtendimento[];
  setRegistros: (r: RegistroAtendimento[]) => void;
  appendRegistros: (r: RegistroAtendimento[]) => void;
  filtros: FiltrosGlobais;
  setFiltros: (f: FiltrosGlobais) => void;
  resetFiltros: () => void;
}

const Ctx = createContext<BIDataContextValue | null>(null);

const seedRegs = parseRows(seed as Record<string, unknown>[]);

export function BIDataProvider({ children }: { children: ReactNode }) {
  const [registros, setRegistros] = useState<RegistroAtendimento[]>(seedRegs);
  const [filtros, setFiltros] = useState<FiltrosGlobais>(FILTROS_VAZIOS);

  const value = useMemo<BIDataContextValue>(
    () => ({
      registros,
      setRegistros,
      appendRegistros: (r) => setRegistros((prev) => [...prev, ...r]),
      filtros,
      setFiltros,
      resetFiltros: () => setFiltros(FILTROS_VAZIOS),
    }),
    [registros, filtros],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBI must be used inside BIDataProvider");
  return ctx;
}
