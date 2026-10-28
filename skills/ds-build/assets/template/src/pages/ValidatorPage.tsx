import { useMemo, useState } from "react";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { AlertCircle, CheckCircle2, FileJson } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PageHeader, SectionHeader } from "@/components/DSComponents";
import tokensSchema from "@/data/tokens.schema.json";
import componentsSchema from "@/data/components.schema.json";
import tailwindSchema from "@/data/tailwind.schema.json";

type SchemaKey = "tokens" | "components" | "tailwind" | "auto";

const SCHEMAS = {
  tokens: { label: "tokens.json", schema: tokensSchema as object, file: "tokens.json" },
  components: { label: "components.json", schema: componentsSchema as object, file: "components.json" },
  tailwind: { label: "tailwind.config.json", schema: tailwindSchema as object, file: "tailwind.config.json" },
} as const;

const EXAMPLES: Record<Exclude<SchemaKey, "auto">, string> = {
  tokens: JSON.stringify(
    {
      $schema: "https://__DS_DOMAIN__/schemas/tokens.schema.json",
      brand: {
        color: { primary: { 500: { $type: "color", $value: "#005EB8" } } },
      },
    },
    null,
    2,
  ),
  components: JSON.stringify(
    {
      meta: {
        name: "__BRAND_SHORT__ DS",
        baseUrl: "https://__DS_DOMAIN__",
        description: "Catálogo oficial",
      },
      primitives: [{ id: "botao", name: "Botão", ref: "/componentes#botao" }],
      composed: [{ id: "footer", name: "Footer", ref: "/templates#footer" }],
    },
    null,
    2,
  ),
  tailwind: JSON.stringify(
    {
      darkMode: ["class"],
      theme: {
        extend: {
          fontFamily: { sans: ["__FONT_PRIMARY__"] },
          colors: { primary: "hsl(var(--primary))" },
          spacing: { "4": "var(--space-4)" },
          fontSize: { base: "var(--text-base)" },
          borderRadius: { md: "var(--radius-md)" },
        },
      },
    },
    null,
    2,
  ),
};

function detectSchema(parsed: unknown): Exclude<SchemaKey, "auto"> | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  if ("brand" in obj) return "tokens";
  if ("primitives" in obj || "composed" in obj || "meta" in obj) return "components";
  if ("theme" in obj || "darkMode" in obj) return "tailwind";
  return null;
}

function findLineForPath(source: string, jsonPointer: string): number | null {
  if (!jsonPointer) return 1;
  const parts = jsonPointer.split("/").filter(Boolean).map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
  // Very small heuristic: locate each key sequentially in the source string.
  let cursor = 0;
  for (const part of parts) {
    if (/^\d+$/.test(part)) continue; // array indices — skip
    const needle = `"${part}"`;
    const idx = source.indexOf(needle, cursor);
    if (idx === -1) return null;
    cursor = idx + needle.length;
  }
  return source.slice(0, cursor).split("\n").length;
}

interface Result {
  ok: boolean;
  schemaKey: Exclude<SchemaKey, "auto">;
  errors: Array<ErrorObject & { line?: number | null }>;
  parseError?: string;
}

export default function ValidatorPage() {
  const [choice, setChoice] = useState<SchemaKey>("auto");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const ajv = useMemo(() => {
    const instance = new Ajv({ allErrors: true, strict: false });
    addFormats(instance);
    return instance;
  }, []);

  const validators = useMemo(() => {
    const map: Record<Exclude<SchemaKey, "auto">, ValidateFunction> = {
      tokens: ajv.compile(SCHEMAS.tokens.schema),
      components: ajv.compile(SCHEMAS.components.schema),
      tailwind: ajv.compile(SCHEMAS.tailwind.schema),
    };
    return map;
  }, [ajv]);

  function runValidation(text: string, forced: SchemaKey) {
    if (!text.trim()) {
      setResult(null);
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      setResult({
        ok: false,
        schemaKey: forced === "auto" ? "tokens" : forced,
        errors: [],
        parseError: err instanceof Error ? err.message : String(err),
      });
      return;
    }
    const key = forced === "auto" ? detectSchema(parsed) : forced;
    if (!key) {
      setResult({
        ok: false,
        schemaKey: "tokens",
        errors: [],
        parseError:
          "Não foi possível detectar automaticamente o schema. Escolha manualmente tokens, components ou tailwind.",
      });
      return;
    }
    const validate = validators[key];
    const ok = validate(parsed);
    const errors = (validate.errors ?? []).map((e) => ({
      ...e,
      line: findLineForPath(text, e.instancePath),
    }));
    setResult({ ok: !!ok, schemaKey: key, errors });
  }

  function loadExample(key: Exclude<SchemaKey, "auto">) {
    const text = EXAMPLES[key];
    setChoice(key);
    setInput(text);
    runValidation(text, key);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <SEO
        title="Validador de artefatos | Design System __BRAND_NAME__"
        description="Cole tokens.json, components.json ou tailwind.config.json e receba erros Ajv com caminho JSON Pointer e número de linha em tempo real."
        path="/design-system/validator"
      />

      <PageHeader
        badge="Ponte para Figma"
        title="Validador de artefatos"
        description="Cole tokens.json, components.json ou tailwind.config.json na área abaixo. A validação usa os mesmos JSON Schemas do CI (Ajv Draft-07) e destaca cada erro por caminho JSON Pointer e linha."
      />

      <SectionHeader
        id="entrada"
        badge="Entrada"
        title="Cole seu JSON"
        description="A detecção automática identifica o schema pelo formato. Se necessário, escolha manualmente qual schema aplicar."
      />

      <div className="brand-card space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-foreground">Schema:</label>
          <select data-ds="select-trigger"
            value={choice}
            onChange={(e) => {
              const next = e.target.value as SchemaKey;
              setChoice(next);
              runValidation(input, next);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="auto">Detectar automaticamente</option>
            <option value="tokens">tokens.json</option>
            <option value="components">components.json</option>
            <option value="tailwind">tailwind.config.json</option>
          </select>

          <div className="ml-auto flex flex-wrap gap-2">
            {(["tokens", "components", "tailwind"] as const).map((k) => (
              <button data-ds="button" data-variant="outline"
                key={k}
                type="button"
                onClick={() => loadExample(k)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                <FileJson size={14} />
                Exemplo {SCHEMAS[k].label}
              </button>
            ))}
            <button data-ds="button" data-variant="outline"
              type="button"
              onClick={() => {
                setInput("");
                setResult(null);
              }}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              Limpar
            </button>
          </div>
        </div>

        <textarea data-ds="textarea"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            runValidation(e.target.value, choice);
          }}
          placeholder='Cole aqui o conteúdo do JSON — por exemplo: { "brand": { ... } }'
          spellCheck={false}
          className="w-full min-h-[320px] rounded-md border border-input bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <SectionHeader id="resultado" badge="Resultado" title="Diagnóstico" />

      {!result && (
        <div className="brand-card text-sm text-muted-foreground">
          Nenhum JSON validado ainda. Cole conteúdo acima ou carregue um exemplo.
        </div>
      )}

      {result?.parseError && (
        <div className="brand-card border-error/40 bg-error/5 space-y-2">
          <div className="flex items-center gap-2 text-error font-semibold">
            <AlertCircle size={18} />
            JSON inválido
          </div>
          <pre className="text-xs whitespace-pre-wrap text-foreground">{result.parseError}</pre>
        </div>
      )}

      {result && !result.parseError && result.ok && (
        <div className="brand-card border-success/40 bg-success/5 space-y-2">
          <div className="flex items-center gap-2 text-success font-semibold">
            <CheckCircle2 size={18} />
            {SCHEMAS[result.schemaKey].label} OK contra {SCHEMAS[result.schemaKey].file.replace(".json", ".schema.json")}
          </div>
          <p className="ds-body-small text-foreground">
            Nenhum erro de schema encontrado. O artefato está pronto para publicação.
          </p>
        </div>
      )}

      {result && !result.parseError && !result.ok && result.errors.length > 0 && (
        <div className="brand-card border-error/40 bg-error/5 space-y-3">
          <div className="flex items-center gap-2 text-error font-semibold">
            <AlertCircle size={18} />
            {result.errors.length} erro(s) contra {SCHEMAS[result.schemaKey].label}
          </div>
          <ul className="space-y-2">
            {result.errors.map((err, i) => (
              <li key={i} className="rounded-md border border-border bg-background p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="rounded bg-muted px-2 py-0.5 text-foreground">
                    {err.instancePath || "(root)"}
                  </span>
                  {err.line && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">linha ~{err.line}</span>
                  )}
                  <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">{err.keyword}</span>
                </div>
                <p className="mt-1 text-foreground">{err.message}</p>
                {err.params && Object.keys(err.params).length > 0 && (
                  <pre className="mt-1 text-xs text-muted-foreground">
                    {JSON.stringify(err.params)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}