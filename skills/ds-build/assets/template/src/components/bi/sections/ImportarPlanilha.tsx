import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBI } from "@/context/BIDataContext";
import { parseXlsxFile, validarRegistros } from "@/lib/bi/parser";
import { RegistroAtendimento } from "@/lib/bi/types";
import { UploadCloud, FileCheck2, AlertTriangle, CheckCircle2, Download } from "lucide-react";
import * as XLSX from "xlsx";

type Etapa = 1 | 2 | 3 | 4;

const CAMPOS_SISTEMA = [
  "empresa", "cnpj", "dataAtendimento", "cidade", "estado", "contato", "cargo", "email", "telefone", "observacoes",
];

export default function ImportarPlanilha() {
  const { appendRegistros } = useBI();
  const [etapa, setEtapa] = useState<Etapa>(1);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [parsed, setParsed] = useState<RegistroAtendimento[] | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [erros, setErros] = useState<ReturnType<typeof validarRegistros>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setArquivo(f);
    const regs = await parseXlsxFile(f);
    setParsed(regs);
    const colunas = Object.keys(regs[0] ?? {});
    const map: Record<string, string> = {};
    CAMPOS_SISTEMA.forEach((c) => {
      const match = colunas.find((k) => k.toLowerCase().includes(c.toLowerCase()));
      if (match) map[c] = match;
    });
    setMapping(map);
    setEtapa(2);
  }

  function validar() {
    if (!parsed) return;
    setErros(validarRegistros(parsed));
    setEtapa(4);
  }

  function finalizar() {
    if (parsed) appendRegistros(parsed);
    setEtapa(1);
    setArquivo(null);
    setParsed(null);
    setErros([]);
  }

  function baixarRelatorioErros() {
    const ws = XLSX.utils.json_to_sheet(
      erros.map((e) => ({ Linha: e.index + 1, Empresa: e.empresa ?? "—", Erros: e.erros.join("; ") })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Erros");
    XLSX.writeFile(wb, "relatorio-erros.xlsx");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Importar Planilha</h1>
        <p className="text-sm text-muted-foreground">Fluxo de 4 etapas para envio, mapeamento e validação de novos registros.</p>
      </div>

      <Stepper atual={etapa} />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {etapa === 1 && (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition"
          >
            <UploadCloud className="h-12 w-12 mx-auto text-primary mb-3" />
            <p className="text-sm font-medium">Arraste o arquivo aqui ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-1">Aceita XLS, XLSX e CSV</p>
            <input
              ref={inputRef}
              type="file"
              accept=".xls,.xlsx,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        )}

        {etapa === 2 && parsed && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Pré-visualização — {arquivo?.name}</h3>
                <p className="text-xs text-muted-foreground">{parsed.length} linhas detectadas. Mostrando as 5 primeiras.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEtapa(1)}>Voltar</Button>
                <Button size="sm" onClick={() => setEtapa(3)}>Avançar</Button>
              </div>
            </div>
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    {["CNPJ", "Empresa", "Cidade", "UF", "Contato", "Telefone", "E-mail"].map((c) => (
                      <th key={c} className="text-left px-2 py-2 font-medium">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.slice(0, 5).map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-2 py-2">{r.cnpj ?? "—"}</td>
                      <td className="px-2 py-2">{r.empresa ?? "—"}</td>
                      <td className="px-2 py-2">{r.cidade ?? "—"}</td>
                      <td className="px-2 py-2">{r.uf ?? "—"}</td>
                      <td className="px-2 py-2">{r.contato ?? "—"}</td>
                      <td className="px-2 py-2">{r.telefones ?? "—"}</td>
                      <td className="px-2 py-2">{r.emails ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {etapa === 3 && parsed && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Mapeamento de colunas</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEtapa(2)}>Voltar</Button>
                <Button size="sm" onClick={validar}>Validar</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CAMPOS_SISTEMA.map((campo) => (
                <div key={campo} className="flex items-center gap-3">
                  <label className="w-40 text-sm font-medium">{campo}</label>
                  <input
                    className="flex-1 h-9 rounded-md border border-input bg-background px-2 text-sm"
                    value={mapping[campo] ?? ""}
                    onChange={(e) => setMapping({ ...mapping, [campo]: e.target.value })}
                    placeholder="Coluna da planilha"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {etapa === 4 && parsed && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <ResultCard icon={CheckCircle2} cor="emerald" rotulo="Registros válidos" valor={parsed.length - erros.length} />
              <ResultCard icon={AlertTriangle} cor="amber" rotulo="Com erros" valor={erros.length} />
              <ResultCard icon={FileCheck2} cor="sky" rotulo="Total importável" valor={parsed.length} />
              <ResultCard icon={AlertTriangle} cor="rose" rotulo="Duplicados (CNPJ)" valor={erros.filter((e) => e.erros.includes("CNPJ duplicado")).length} />
            </div>
            {erros.length > 0 && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-amber-900">Pendências encontradas</div>
                  <Button variant="outline" size="sm" onClick={baixarRelatorioErros}>
                    <Download className="h-3.5 w-3.5" /> Baixar relatório
                  </Button>
                </div>
                <ul className="text-xs text-amber-900 space-y-1 max-h-40 overflow-y-auto">
                  {erros.slice(0, 8).map((e) => (
                    <li key={e.index}>
                      Linha {e.index + 1} — {e.empresa ?? "—"}: {e.erros.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEtapa(3)}>Voltar</Button>
              <Button size="sm" onClick={finalizar} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Importar para a base
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ atual }: { atual: Etapa }) {
  const labels = ["Envio do arquivo", "Pré-visualização", "Mapeamento", "Validação"];
  return (
    <div className="flex items-center justify-between">
      {labels.map((l, i) => {
        const n = (i + 1) as Etapa;
        const ativo = atual === n;
        const feito = atual > n;
        return (
          <div key={l} className="flex-1 flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                feito ? "bg-success text-success-foreground" : ativo ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {n}
            </div>
            <div className="ml-2 text-xs hidden md:block">{l}</div>
            {i < 3 && <div className={`flex-1 h-px mx-3 ${feito ? "bg-success" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function ResultCard({ icon: Icon, cor, rotulo, valor }: { icon: typeof CheckCircle2; cor: string; rotulo: string; valor: number }) {
  const bg =
    {
      emerald: "bg-success-bg text-success",
      amber: "bg-warning-bg text-warning",
      sky: "bg-accent text-accent-foreground",
      rose: "bg-destructive/10 text-destructive",
    }[cor] || "";
  return (
    <div className={`rounded-lg p-3 ${bg}`}>
      <div className="flex items-center gap-2 text-xs font-medium"><Icon className="h-4 w-4" />{rotulo}</div>
      <div className="text-2xl font-bold mt-1">{valor}</div>
    </div>
  );
}
