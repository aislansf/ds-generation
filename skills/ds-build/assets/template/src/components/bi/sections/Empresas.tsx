import { useMemo, useState } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros } from "@/lib/bi/aggregations";
import { agruparPorEmpresa } from "@/lib/bi/parser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { EmpresaAgregada, StatusComercial } from "@/lib/bi/types";
import * as XLSX from "xlsx";

const STATUS_BADGE: Record<StatusComercial, string> = {
  "Não iniciado": "bg-muted text-foreground",
  "Tentativa de contato": "bg-amber-100 text-amber-800",
  "Contato realizado": "bg-sky-100 text-sky-800",
  "Aguardando retorno": "bg-yellow-100 text-yellow-800",
  "Oportunidade identificada": "bg-emerald-100 text-emerald-800",
  "Cadastro solicitado": "bg-blue-100 text-blue-800",
  "Proposta enviada": "bg-indigo-100 text-indigo-800",
  Convertido: "bg-success text-success-foreground",
  "Sem aderência": "bg-rose-100 text-rose-800",
  Encerrado: "bg-muted text-muted-foreground",
};

const POTENCIAL_BADGE = {
  Alto: "bg-success text-success-foreground",
  Médio: "bg-warning text-warning-foreground",
  Baixo: "bg-muted text-muted-foreground",
};

export default function Empresas() {
  const { registros, filtros } = useBI();
  const empresas = useMemo(() => agruparPorEmpresa(aplicarFiltros(registros, filtros)), [registros, filtros]);

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [selecionada, setSelecionada] = useState<EmpresaAgregada | null>(null);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return empresas;
    return empresas.filter(
      (e) =>
        e.empresa.toLowerCase().includes(q) ||
        e.cnpj.toLowerCase().includes(q) ||
        e.registros.some((r) => r.contato?.toLowerCase().includes(q)),
    );
  }, [empresas, busca]);

  const total = filtradas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtradas.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

  function exportarCSV() {
    const ws = XLSX.utils.json_to_sheet(
      filtradas.map((e) => ({
        CNPJ: e.cnpj,
        Empresa: e.empresa,
        Cidade: e.cidade,
        UF: e.uf,
        Contatos: e.contatos,
        Status: e.status,
        Potencial: e.potencial,
        UltimoAtendimento: e.ultimoAtendimento,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Empresas");
    XLSX.writeFile(wb, "empresas.xlsx");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empresas</h1>
          <p className="text-sm text-muted-foreground">{total} empresas únicas com base nos filtros aplicados.</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportarCSV}>
          <Download className="h-3.5 w-3.5" /> Exportar XLSX
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
              placeholder="Buscar por empresa, CNPJ ou contato…"
              className="pl-9 h-9"
            />
          </div>
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-xs"
            value={porPagina}
            onChange={(e) => setPorPagina(Number(e.target.value))}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} / página
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="py-2 px-2 font-medium">Empresa</th>
                <th className="py-2 px-2 font-medium">CNPJ</th>
                <th className="py-2 px-2 font-medium">Cidade/UF</th>
                <th className="py-2 px-2 font-medium">Contatos</th>
                <th className="py-2 px-2 font-medium">Status</th>
                <th className="py-2 px-2 font-medium">Potencial</th>
                <th className="py-2 px-2 font-medium">Último atendimento</th>
                <th className="py-2 px-2 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((e) => (
                <tr key={e.cnpj + e.empresa} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="py-2.5 px-2 font-medium text-foreground">{e.empresa}</td>
                  <td className="py-2.5 px-2 text-xs text-muted-foreground tabular-nums">{e.cnpj}</td>
                  <td className="py-2.5 px-2 text-xs">{e.cidade ? `${e.cidade}/${e.uf ?? "—"}` : "—"}</td>
                  <td className="py-2.5 px-2 text-xs">{e.contatos}</td>
                  <td className="py-2.5 px-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_BADGE[e.status]}`}>{e.status}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${POTENCIAL_BADGE[e.potencial]}`}>{e.potencial}</span>
                  </td>
                  <td className="py-2.5 px-2 text-xs">{e.ultimoAtendimento ?? "—"}</td>
                  <td className="py-2.5 px-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelecionada(e)}>
                      Ver detalhes
                    </Button>
                  </td>
                </tr>
              ))}
              {visiveis.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Nenhuma empresa encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={paginaAtual === 1} onClick={() => setPagina((p) => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" disabled={paginaAtual === totalPaginas} onClick={() => setPagina((p) => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={!!selecionada} onOpenChange={(o) => !o && setSelecionada(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selecionada && (
            <>
              <SheetHeader>
                <SheetTitle>{selecionada.empresa}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6 text-sm">
                <Section title="Dados cadastrais">
                  <Item label="CNPJ" value={selecionada.cnpj} />
                  <Item label="Cidade" value={`${selecionada.cidade ?? "—"} / ${selecionada.uf ?? "—"}`} />
                  <Item label="Bairro" value={selecionada.bairro} />
                  <Item label="Endereço" value={selecionada.registros[0]?.endereco} />
                  <Item label="CEP" value={selecionada.registros[0]?.cep} />
                  <Item label="Site" value={selecionada.registros[0]?.sites} />
                  <Item label="Telefone" value={selecionada.registros[0]?.telefones} />
                </Section>
                <Section title="Contatos">
                  {selecionada.registros.map((r, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 border-b border-border/40 pb-2 last:border-0">
                      <Item label="Nome" value={r.contato} />
                      <Item label="Cargo" value={r.cargo} />
                      <Item label="E-mail" value={r.emails} />
                      <Item label="Canal" value={r.emails ? "E-mail" : r.telefones ? "Telefone" : "—"} />
                    </div>
                  ))}
                </Section>
                <Section title="Informações comerciais">
                  <Item label="Status atual" value={selecionada.status} />
                  <Item label="Potencial" value={selecionada.potencial} />
                  <Item label="Segmento" value={selecionada.registros[0]?.segmento} />
                  <Item label="Porte" value={selecionada.registros[0]?.porte} />
                  <Item label="Responsável" value={selecionada.registros[0]?.responsavel} />
                  <Item label="Último contato" value={selecionada.ultimoAtendimento} />
                </Section>
                <Section title="Informações técnicas (sugeridas)">
                  <Item label="Possui compressor" value={selecionada.registros.some((r) => r.possuiCompressor) ? "Sim" : "Não detectado"} />
                  <Item label="Possui secador" value={selecionada.registros.some((r) => r.possuiSecador) ? "Sim" : "Não detectado"} />
                  <Item label="Contrato de manutenção" value={selecionada.registros.some((r) => r.contratoManutencao) ? "Sim" : "Não detectado"} />
                </Section>
                <Section title="Histórico de atendimentos">
                  <ol className="relative border-l border-border ml-2 space-y-3">
                    {selecionada.registros.map((r) => (
                      <li key={r.id} className="ml-4">
                        <div className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary mt-1.5" />
                        <div className="text-xs text-muted-foreground">{r.data ?? "Data não informada"}</div>
                        <div className="text-sm font-medium">{r.status}</div>
                        {r.observacoes && (
                          <p className="text-xs text-foreground/80 mt-1 italic">"{r.observacoes}"</p>
                        )}
                      </li>
                    ))}
                  </ol>
                </Section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">{children}</div>
    </div>
  );
}
function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value || "—"}</div>
    </div>
  );
}
