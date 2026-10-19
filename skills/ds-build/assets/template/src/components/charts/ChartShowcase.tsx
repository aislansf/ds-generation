import { useMemo, useState } from "react";
import { Check, Copy, Download, FileJson, FileCode2 } from "lucide-react";
import { BrandChart } from "@/components/charts/BrandChart";
import type { ChartPreset } from "@/data/echarts/types";
import {
  downloadPresetJson,
  downloadPresetTs,
  presetJsonString,
} from "@/lib/echarts/exportPreset";

type Aba = "visualizacao" | "react" | "json";

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm border ${
        copied
          ? "bg-success/10 text-success border-success/30"
          : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
      }`}
      aria-label={copied ? "Conteúdo copiado" : label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? "Copiado" : label}</span>
    </button>
  );
}

function ActionButton({
  onClick,
  children,
  icon,
}: {
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {icon}
      {children}
    </button>
  );
}

export function ChartShowcase({ preset }: { preset: ChartPreset }) {
  const [aba, setAba] = useState<Aba>("visualizacao");
  const json = useMemo(() => presetJsonString(preset), [preset]);

  const abas: { id: Aba; label: string }[] = [
    { id: "visualizacao", label: "Visualização" },
    { id: "react", label: "React" },
    { id: "json", label: "option (JSON)" },
  ];

  return (
    <section className="brand-card mb-8" aria-labelledby={`chart-${preset.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <div>
          <h3 id={`chart-${preset.id}`} className="text-lg font-semibold text-foreground mb-1">
            {preset.nome}
          </h3>
          <p className="text-sm text-muted-foreground max-w-2xl">{preset.descricao}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
          {preset.categoria}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {preset.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Abas */}
      <div className="flex flex-wrap gap-1 border-b border-border mb-3" role="tablist">
        {abas.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={aba === a.id}
            onClick={() => setAba(a.id)}
            className={`px-3 py-2 text-xs font-medium -mb-px border-b-2 transition-colors ${
              aba === a.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="border border-border rounded-lg bg-background overflow-hidden mb-3">
        {aba === "visualizacao" && (
          <div className="p-4">
            <BrandChart
              option={preset.option}
              height={preset.altura ?? 340}
              ariaLabel={preset.ariaLabel}
              requerMapa={preset.requerMapa}
            />
          </div>
        )}
        {aba === "react" && (
          <div className="relative">
            <pre className="p-4 overflow-x-auto text-xs leading-relaxed max-h-[420px]">
              <code>{preset.codigoReact}</code>
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={preset.codigoReact} />
            </div>
          </div>
        )}
        {aba === "json" && (
          <div className="relative">
            <pre className="p-4 overflow-x-auto text-xs leading-relaxed max-h-[420px]">
              <code>{json}</code>
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={json} />
            </div>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <CopyButton text={json} label="Copiar option JSON" />
        <ActionButton onClick={() => downloadPresetJson(preset)} icon={<FileJson size={14} />}>
          Baixar .json
        </ActionButton>
        <ActionButton onClick={() => downloadPresetTs(preset)} icon={<FileCode2 size={14} />}>
          Baixar .ts
        </ActionButton>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Download size={12} /> arquivos prontos para o repositório do time
        </span>
      </div>

      {/* Diretrizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-xs">
          <p className="font-semibold text-success mb-1">✓ Quando usar</p>
          <ul className="space-y-1 text-muted-foreground">
            {preset.quandoUsar.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="text-xs">
          <p className="font-semibold text-error mb-1">✗ Quando não usar</p>
          <ul className="space-y-1 text-muted-foreground">
            {preset.quandoNaoUsar.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 text-xs">
        <p className="font-semibold text-info mb-1">♿ Acessibilidade</p>
        <ul className="space-y-1 text-muted-foreground">
          {preset.acessibilidade.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ChartShowcase;
