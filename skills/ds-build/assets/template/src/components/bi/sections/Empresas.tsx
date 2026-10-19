import { useMemo, useState } from "react";
import { useBI } from "@/context/BIDataContext";
import { aplicarFiltros } from "@/lib/bi/aggregations";
import { agruparPorEmpresa } from "@/lib/bi/parser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "../BISkeletons";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { EmpresaAgregada, StatusComercial } from "@/lib/bi/types";
import * as XLSX from "xlsx";

const STATUS_BADGE: Record<StatusComercial, string> = {
  "Não iniciado": "bg-muted text-foreground",
  "Tentativa de contato": "bg-warning/20 text-warning-foreground",
  "Contato realizado": "bg-primary/15 text-primary",
  "Aguardando retorno": "bg-warning/15 text-warning-foreground",
  "Oportunidade identificada": "bg-success/20 text-success-foreground",
  "Cadastro solicitado": "bg-primary/10 text-primary",
  "Proposta enviada": "bg-secondary/20 text-secondary-foreground",
  Convertido: "bg-success text-success-foreground",
  "Sem aderência": "bg-destructive/15 text-destructive",
  Encerrado: "bg-muted text-muted-foreground",
};

const POTENCIAL_BADGE = {
  Alto: "bg-success text-success-foreground",
  Médio: "bg-warning text-warning-foreground",
  Baixo: "bg-muted text-muted-foreground",
};

export default function Empresas({ loading = false }: { loading?: boolean }) {
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

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <TableSkeleton rows={6} cols={8} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Empresas atendidas</h2>
          <p className="text-sm text-muted-foreground">{total} empresas atendidas com base nos filtros aplicados.</p>
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
          <Select value={String(porPagina)} onValueChange={(v) => { setPorPagina(Number(v)); setPagina(1); }}>
            <SelectTrigger className="h-9 w-[130px] text-xs" aria-label="Registros por página">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">
                  {n} / página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Município/UF</TableHead>
                <TableHead>Contatos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Potencial</TableHead>
                <TableHead>Último atendimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiveis.map((e) => (
                <TableRow key={e.cnpj + e.empresa}>
                  <TableCell className="font-medium text-foreground">{e.empresa}</TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums">{e.cnpj}</TableCell>
                  <TableCell className="text-xs">{e.cidade ? `${e.cidade}/${e.uf ?? "—"}` : "—"}</TableCell>
                  <TableCell className="text-xs">{e.contatos}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_BADGE[e.status]}`}>{e.status}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${POTENCIAL_BADGE[e.potencial]}`}>{e.potencial}</span>
                  </TableCell>
                  <TableCell className="text-xs">{e.ultimoAtendimento ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelecionada(e)}>
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {visiveis.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Nenhuma empresa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
                <Section title="Perfil do negócio (sugerido)">
                  <Item label="Participou de programa" value={selecionada.registros.some((r) => r.participouPrograma) ? "Sim" : "Não detectado"} />
                  <Item label="CNPJ ativo" value={selecionada.registros.some((r) => r.possuiCnpjAtivo) ? "Sim" : "Não detectado"} />
                  <Item label="Consultoria vigente" value={selecionada.registros.some((r) => r.consultoriaVigente) ? "Sim" : "Não detectado"} />
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
