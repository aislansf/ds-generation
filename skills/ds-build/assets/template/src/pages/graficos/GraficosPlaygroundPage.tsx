import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { EChartsOption } from "echarts";
import {
  AlertTriangle, Check, ChevronRight, Copy, Download, FileCode2, FileJson,
  FlaskConical, Image as ImageIcon, RotateCcw, Wand2,
} from "lucide-react";
import { saveAs } from "file-saver";
import SEO from "@/components/SEO";
import { PageHeader, SectionHeader } from "@/components/DSComponents";
import { BrandChart, type BrandChartHandle } from "@/components/charts/BrandChart";
import { CATEGORIAS, CHART_PRESETS, getPresetById, getPresetsByCategoria } from "@/data/echarts/registry";
import { downloadPresetJson, downloadPresetTs, presetJsonString } from "@/lib/echarts/exportPreset";

const ALTURAS = [280, 340, 480] as const;

function Botao({
  onClick, children, icon, variante = "secundario",
}: {
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  variante?: "primario" | "secundario";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        variante === "primario"
          ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      }
    >
      {icon}
      {children}
    </button>
  );
}

export default function GraficosPlaygroundPage() {
  const presetInicial = useMemo(
    () => getPresetsByCategoria("barras")[0] ?? CHART_PRESETS[0],
    [],
  );

  const [presetId, setPresetId] = useState(presetInicial.id);
  const preset = getPresetById(presetId) ?? presetInicial;

  const [texto, setTexto] = useState(() => presetJsonString(presetInicial));
  const [optionValida, setOptionValida] = useState<EChartsOption>(presetInicial.option);
  const [erro, setErro] = useState<string | null>(null);
  const [altura, setAltura] = useState<number>(340);
  const [copiado, setCopiado] = useState(false);
  const chartRef = useRef<BrandChartHandle>(null);

  // Troca de preset: recarrega o editor e o gráfico.
  useEffect(() => {
    setTexto(presetJsonString(preset));
    setOptionValida(preset.option);
    setErro(null);
    setAltura(preset.altura ?? 340);
  }, [preset]);

  // Debounce de 500ms com JSON.parse tolerante a erro.
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const parsed = JSON.parse(texto) as EChartsOption;
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          setErro("O option precisa ser um objeto JSON.");
          return;
        }
        setOptionValida(parsed);
        setErro(null);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "JSON inválido.");
      }
    }, 500);
    return () => window.clearTimeout(t);
  }, [texto]);

  const formatar = () => {
    try {
      setTexto(JSON.stringify(JSON.parse(texto), null, 2));
      setErro(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "JSON inválido.");
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2000);
  };

  const baixarPng = () => {
    const instancia = chartRef.current?.getInstance();
    if (!instancia) return;
    const url = instancia.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "transparent" });
    saveAs(url, `${preset.id}.png`);
  };

  const baixarJsonEditado = () => {
    if (erro) { downloadPresetJson(preset); return; }
    saveAs(new Blob([texto], { type: "application/json;charset=utf-8" }), `${preset.id}.option.json`);
  };

  return (
    <>
      <SEO
        title="Playground de Gráficos ECharts — Design System __BRAND_NAME__"
        description="Edite o option de qualquer gráfico do Design System __BRAND_NAME__ em tempo real, visualize o resultado e baixe em JSON, TypeScript ou PNG."
        path="/graficos/playground"
      />

      <nav aria-label="Trilha de navegação" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-primary">Principal</Link></li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li><Link to="/graficos" className="hover:text-primary">Gráficos ECharts</Link></li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li className="text-foreground font-medium">Playground</li>
        </ol>
      </nav>

      <PageHeader
        badge="Prototipagem"
        title="Playground de gráficos"
        description="Escolha um preset da biblioteca, edite o option em JSON e veja o resultado ao vivo. Ferramenta de prototipagem: o option gerado aqui pode ser colado direto em qualquer stack que use Apache ECharts — React, Vue, Angular, HTML puro ou custom visual do Power BI."
      />

      <div className="rounded-lg border border-info/30 bg-info/10 p-4 flex items-start gap-3 mb-6">
        <FlaskConical size={18} className="text-info mt-0.5 shrink-0" />
        <p className="text-sm text-foreground">
          O playground não persiste alterações: ele serve para experimentar rapidamente.
          O tema aplicado é o mesmo do site (claro ou escuro) — alterne no header para
          conferir os dois modos antes de publicar.
        </p>
      </div>

      {/* Controles */}
      <div className="brand-card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pg-preset" className="block text-xs font-semibold text-foreground mb-1.5">
              Gráfico base
            </label>
            <select data-ds="select-trigger"
              id="pg-preset"
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIAS.map((cat) => {
                const presets = getPresetsByCategoria(cat.slug);
                if (presets.length === 0) return null;
                return (
                  <optgroup key={cat.slug} label={cat.nome}>
                    {presets.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-foreground mb-1.5">Altura do gráfico</span>
            <div role="group" aria-label="Altura do gráfico" className="flex flex-wrap gap-2">
              {ALTURAS.map((h) => (
                <button
                  key={h}
                  type="button"
                  aria-pressed={altura === h}
                  onClick={() => setAltura(h)}
                  className={`px-3 h-10 rounded-md text-xs font-medium border transition-colors ${
                    altura === h
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {h} px
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <Botao
            onClick={() => { setTexto(presetJsonString(preset)); setErro(null); }}
            icon={<RotateCcw size={14} />}
          >
            Restaurar preset
          </Botao>
          <Botao onClick={formatar} icon={<Wand2 size={14} />}>Formatar JSON</Botao>
          <Botao onClick={copiar} icon={copiado ? <Check size={14} /> : <Copy size={14} />} variante="primario">
            {copiado ? "Copiado" : "Copiar option"}
          </Botao>
          <Botao onClick={baixarJsonEditado} icon={<FileJson size={14} />}>Baixar .json</Botao>
          <Botao onClick={() => downloadPresetTs(preset)} icon={<FileCode2 size={14} />}>Baixar .ts</Botao>
          <Botao onClick={baixarPng} icon={<ImageIcon size={14} />}>Baixar PNG</Botao>
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3 mb-4"
        >
          <AlertTriangle size={18} className="text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">JSON inválido — exibindo a última versão válida</p>
            <p className="text-xs text-muted-foreground mt-0.5 break-words">{erro}</p>
          </div>
        </div>
      )}

      {/* Editor + preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="brand-card">
          <label htmlFor="pg-editor" className="block text-xs font-semibold text-foreground mb-1.5">
            Editor do option (JSON)
          </label>
          <textarea data-ds="textarea"
            id="pg-editor"
            value={texto}
            spellCheck={false}
            onChange={(e) => setTexto(e.target.value)}
            className={`w-full h-[420px] lg:h-[520px] rounded-md border bg-muted/40 p-3 font-mono text-[12px] leading-relaxed text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring ${
              erro ? "border-destructive/50" : "border-border"
            }`}
            aria-describedby="pg-editor-dica"
            aria-invalid={erro ? true : undefined}
          />
          <p id="pg-editor-dica" className="text-[11px] text-muted-foreground mt-1.5">
            As alterações são aplicadas 500&nbsp;ms após a digitação. Funções JavaScript não são
            suportadas em JSON — para formatadores dinâmicos, use o snippet React do catálogo.
          </p>
        </div>

        <div className="brand-card">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-foreground">{preset.nome}</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              {preset.categoria}
            </span>
          </div>
          <BrandChart
            ref={chartRef}
            option={optionValida}
            height={altura}
            ariaLabel={preset.ariaLabel}
          />
          <p className="text-xs text-muted-foreground mt-2">{preset.descricao}</p>
        </div>
      </div>

      <SectionHeader
        id="proximos"
        badge="Continuar"
        title="Levar para o seu projeto"
        description="Baixe a biblioteca completa, os temas e o manifesto na Central de Downloads."
      />
      <Link
        to="/graficos/downloads"
        className="brand-card block hover:border-primary/40 transition-colors max-w-md"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-2">
          <Download size={20} />
        </span>
        <h3 className="text-base font-semibold text-foreground mb-1">Central de Downloads</h3>
        <p className="text-sm text-muted-foreground">
          Pacote .zip com presets, temas, wrapper React e manifesto da biblioteca.
        </p>
      </Link>
    </>
  );
}
