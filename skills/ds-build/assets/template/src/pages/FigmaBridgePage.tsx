import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Copy, Download, Package, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Ajv from "ajv";
import addFormats from "ajv-formats";

type FileEntry = { file: string; bytes: number; sha256: string };
type Manifest = {
  name: string;
  version: string;
  generatedAt: string;
  source: string;
  usage: Record<string, string>;
  endpoints: Record<string, string>;
  files: FileEntry[];
};

export default function FigmaBridgePage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    fetch("/design-system/manifest.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setManifest)
      .catch((e) => setError(String(e)));
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = (p: string) => `${origin}${p}`;

  const validateData = async (tokens: unknown, components: unknown) => {
    try {
      const [tokensSchemaRes, componentsSchemaRes] = await Promise.all([
        fetch("/schemas/tokens.schema.json"),
        fetch("/schemas/components.schema.json")
      ]);

      if (!tokensSchemaRes.ok || !componentsSchemaRes.ok) {
        throw new Error("Erro ao carregar schemas de validação");
      }

      const tokensSchema = await tokensSchemaRes.json();
      const componentsSchema = await componentsSchemaRes.json();

      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv);

      const validateTokens = ajv.compile(tokensSchema);
      const validateComponents = ajv.compile(componentsSchema);

      const tokensOk = validateTokens(tokens);
      const componentsOk = validateComponents(components);

      if (!tokensOk || !componentsOk) {
        const errors: string[] = [];
        if (!tokensOk) {
          validateTokens.errors?.forEach(err => 
            errors.push(`tokens.json: ${err.instancePath || "(root)"} ${err.message}`)
          );
        }
        if (!componentsOk) {
          validateComponents.errors?.forEach(err => 
            errors.push(`components.json: ${err.instancePath || "(root)"} ${err.message}`)
          );
        }
        return { ok: false, errors };
      }

      return { ok: true, errors: [] };
    } catch (err) {
      console.error("Erro na validação:", err);
      return { ok: false, errors: ["Falha técnica ao executar o validador."] };
    }
  };

  const getBundleData = async () => {
    // Carregar tokens e componentes em paralelo
    const [tokensRes, componentsRes] = await Promise.all([
      fetch("/design-system/tokens.json"),
      fetch("/design-system/components.json")
    ]);

    if (!tokensRes.ok || !componentsRes.ok) {
      throw new Error("Erro ao carregar artefatos");
    }

    const tokens = await tokensRes.json();
    const components = await componentsRes.json();

    // Criar o pacote único (bundle)
    return {
      name: "__BRAND_SHORT__ DS Figma Bundle",
      version: manifest?.version || "latest",
      generatedAt: new Date().toISOString(),
      tokens,
      components
    };
  };

  const copyToClipboard = async () => {
    try {
      setCopying(true);
      
      // Carregar dados brutos para validação individual
      const [tokensRes, componentsRes] = await Promise.all([
        fetch("/design-system/tokens.json"),
        fetch("/design-system/components.json")
      ]);

      if (!tokensRes.ok || !componentsRes.ok) throw new Error("Erro ao carregar artefatos");

      const tokens = await tokensRes.json();
      const components = await componentsRes.json();

      const validation = await validateData(tokens, components);
      if (!validation.ok) {
        toast.error("Validação falhou!", {
          description: "O pacote contém erros de estrutura e não pode ser copiado.",
          duration: 5000,
        });
        setCopying(false);
        return;
      }

      const bundle = {
        name: "__BRAND_SHORT__ DS Figma Bundle",
        version: manifest?.version || "latest",
        generatedAt: new Date().toISOString(),
        tokens,
        components
      };

      await navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
      toast.success("JSON validado e copiado!");
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Falha ao processar o JSON.");
      setCopying(false);
    }
  };

  const downloadBundle = async () => {
    try {
      // Carregar dados brutos para validação
      const [tokensRes, componentsRes] = await Promise.all([
        fetch("/design-system/tokens.json"),
        fetch("/design-system/components.json")
      ]);

      if (!tokensRes.ok || !componentsRes.ok) throw new Error("Erro ao carregar artefatos");

      const tokens = await tokensRes.json();
      const components = await componentsRes.json();

      const validation = await validateData(tokens, components);
      if (!validation.ok) {
        toast.error("Erro de integridade!", {
          description: "Os tokens ou componentes não seguem o schema oficial.",
          duration: 5000,
        });
        return;
      }

      const bundle = {
        name: "__BRAND_SHORT__ DS Figma Bundle",
        version: manifest?.version || "latest",
        generatedAt: new Date().toISOString(),
        tokens,
        components
      };

      const dateStr = new Date().toISOString().split('T')[0];
      const versionStr = manifest?.version ? `-${manifest.version}` : "";
      const fileName = `brand-ds-figma-bundle${versionStr}-${dateStr}.json`;

      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success("Pacote exportado com sucesso!", {
        description: "tokens.json e components.json incluídos no arquivo."
      });
    } catch (err) {
      console.error(err);
      toast.error("Falha ao gerar o pacote de exportação.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <SEO
        title="Ponte para Figma | Design System __BRAND_NAME__"
        description="Endpoints públicos com tokens, tailwind e catálogo de componentes prontos para consumo em Figma e outras ferramentas."
        path="/design-system/figma"
      />

      <header className="space-y-3">
        <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Integração externa
        </span>
        <h1 className="text-primary">Ponte para o Figma</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Todos os tokens, configurações Tailwind e o catálogo de componentes deste
          Design System são publicados como arquivos estáticos. Aponte plugins como
          <strong> Tokens Studio</strong>, <strong>Design Tokens</strong> ou scripts
          próprios para as URLs abaixo — o Figma passa a espelhar 1:1 o que roda em produção,
          sem re-criar o DS localmente.
        </p>
      </header>

      {error && (
        <div className="rounded-md bg-error-bg text-error-foreground border border-error/40 p-4">
          Não foi possível carregar o manifesto: {error}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-primary m-0">Endpoints públicos</h2>
          <div className="flex flex-wrap gap-2">
            <button data-ds="button" data-variant="secondary"
              onClick={copyToClipboard}
              disabled={copying}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition shadow-sm font-medium border border-border"
              title="Copiar JSON consolidado para a área de transferência"
            >
              {copying ? <Check size={18} /> : <Copy size={18} />}
              {copying ? "Copiado!" : "Copiar JSON"}
            </button>
            <button data-ds="button" data-variant="default"
              onClick={downloadBundle}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition shadow-sm font-medium"
              title="Baixar pacote JSON consolidado com nome versionado"
            >
              <Download size={18} />
              Exportar Pacote Único (JSON)
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "tokens.json (W3C DTCG)",
              path: "/design-system/tokens.json",
              desc: "Formato oficial do Design Tokens Community Group. Consumido por Tokens Studio, Style Dictionary e Design Tokens plugin.",
            },
            {
              title: "tokens.css",
              path: "/design-system/tokens.css",
              desc: "Snapshot com todos os CSS custom properties (:root + .dark) prontos para copiar em qualquer projeto.",
            },
            {
              title: "tailwind.config.json",
              path: "/design-system/tailwind.config.json",
              desc: "Aliases de colors, spacing, fontSize e borderRadius que o Tailwind expõe apontando para os tokens.",
            },
            {
              title: "components.json",
              path: "/design-system/components.json",
              desc: "Catálogo de primitives e componentes compostos com variantes, estados e tokens usados.",
            },
            {
              title: "manifest.json",
              path: "/design-system/manifest.json",
              desc: "Índice geral com URLs, tamanho e hash SHA-256 de cada artefato para verificação de integridade.",
            },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noreferrer"
              className="brand-card block hover:border-primary transition"
            >
              <div className="font-heading text-lg text-primary">{item.title}</div>
              <code className="block text-xs text-muted-foreground mt-1 break-all">
                {url(item.path)}
              </code>
              <p className="text-sm mt-2">{item.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-primary">Como usar no Figma</h2>
        <ol className="list-decimal list-inside space-y-3 text-base">
          <li>
            Abra o Figma → <strong>Plugins → Tokens Studio for Figma</strong>.
          </li>
          <li>
            Em <em>Settings → Sync providers</em>, escolha <strong>URL</strong> e cole:
            <code className="block bg-muted rounded px-3 py-2 mt-1 text-sm break-all">
              {url("/design-system/tokens.json")}
            </code>
          </li>
          <li>
            Clique em <strong>Pull from URL</strong>. Todos os tokens (cores, tipografia,
            espaçamento, sombras, radius, z-index, motion) entram como variables do Figma,
            com tema <em>dark</em> já mapeado em <code>$extensions.com.brand.themes</code>.
          </li>
          <li>
            Para replicar componentes, use <code>components.json</code> como referência —
            cada item aponta para a URL viva onde a variante final está renderizada.
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-primary">Regras para o Figma</h2>
        <ul className="list-disc list-inside space-y-2 text-base">
          <li>Não recrie tokens localmente — sempre puxe desta URL.</li>
          <li>Cores são exportadas em HEX (convertidas do HSL do CSS) para compatibilidade máxima.</li>
          <li>Tema <strong>light</strong> é o valor base; <strong>dark</strong> vive em <code>$extensions</code>.</li>
          <li>Fontes oficiais: <strong>__FONT_PRIMARY__</strong> (corpo/UI) e <strong>__FONT_SYSTEM__</strong> (headings, display e apoio institucional).</li>
          <li>Alterações no DS partem sempre de <code>src/index.css</code> — o CI regenera os JSONs no build.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-primary">Validação por JSON Schema</h2>
        <p className="text-base text-muted-foreground max-w-3xl">
          Antes de publicar, o script <code>scripts/validate-figma-tokens.mjs</code> roda com{" "}
          <a
            className="text-primary underline"
            href="https://ajv.js.org/"
            target="_blank"
            rel="noreferrer"
          >
            Ajv
          </a>{" "}
          e compara cada artefato com um <strong>JSON Schema Draft-07</strong>. O objetivo é
          garantir que o Figma nunca consuma um arquivo com formato divergente — se algo mudar
          fora do padrão, o build (local e no CI) falha antes do deploy.
        </p>

        <div className="brand-card border-primary/20 bg-primary/5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
              <Package size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg text-primary">Pacote de Integração Direta</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Desenvolveu um plugin ou script customizado para o Figma? Use o botão <strong>Exportar Pacote Único</strong> acima para baixar um JSON consolidado contendo tanto o dicionário de tokens (W3C DTCG) quanto o catálogo de componentes. Ideal para consumo <em>offline</em> ou instâncias que não permitem requisições externas para URLs individuais.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-md w-fit">
                <AlertCircle size={14} />
                Validação automática ativa (Ajv + JSON Schema)
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              file: "tokens.json",
              schema: "schemas/tokens.schema.json",
              desc: "Valida a estrutura DTCG: cada folha precisa ter $type e $value; tipos permitidos: color, dimension, shadow, duration, cubicBezier, fontWeight, number, string.",
            },
            {
              file: "components.json",
              schema: "schemas/components.schema.json",
              desc: "Exige meta.name/baseUrl, listas primitives e composed com id (kebab-case), name e ref começando por /. Tokens usados precisam seguir o padrão --token-name.",
            },
            {
              file: "tailwind.config.json",
              schema: "schemas/tailwind.schema.json",
              desc: "Garante que fontFamily, colors, spacing, fontSize e borderRadius existam e apontem para variáveis CSS (hsl(var(--x)) ou var(--x)), sem valores hardcoded.",
            },
          ].map((item) => (
            <div key={item.file} className="brand-card">
              <div className="font-heading text-lg text-primary">{item.file}</div>
              <code className="block text-xs text-muted-foreground mt-1 break-all">
                {item.schema}
              </code>
              <p className="text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-lg text-primary">Como rodar localmente</h3>
          <pre className="bg-muted rounded px-3 py-2 text-sm overflow-x-auto">
            <code>{`# Regenera os artefatos e valida contra os schemas
npm run build:figma-tokens
npm run validate:figma-tokens`}</code>
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-lg text-primary">Como ler o relatório</h3>
          <p className="text-base max-w-3xl">
            O validador imprime uma linha por arquivo. Em caso de sucesso:
          </p>
          <pre className="bg-muted rounded px-3 py-2 text-sm overflow-x-auto">
            <code>{`[schema] tokens.json OK contra tokens.schema.json
[schema] components.json OK contra components.schema.json
[schema] tailwind.config.json OK contra tailwind.schema.json

Todos os artefatos do DS estao consistentes.`}</code>
          </pre>
          <p className="text-base max-w-3xl">
            Quando algo diverge, cada erro aparece no formato{" "}
            <code>{"<caminho> <mensagem>"}</code> — o <code>caminho</code> segue{" "}
            <a
              className="text-primary underline"
              href="https://datatracker.ietf.org/doc/html/rfc6901"
              target="_blank"
              rel="noreferrer"
            >
              JSON Pointer
            </a>{" "}
            (RFC 6901) e aponta a chave exata do artefato onde o problema está:
          </p>
          <pre className="bg-muted rounded px-3 py-2 text-sm overflow-x-auto">
            <code>{`[schema] tokens.json FALHOU contra tokens.schema.json:
  - /brand/color/primary/500 must have required property '$type'
  - /brand/spacing/4/$value must be string,number

Validacao de schema falhou. Nao publicar artefatos.`}</code>
          </pre>
          <ul className="list-disc list-inside space-y-1 text-base">
            <li>
              <code>(root)</code> significa que o problema está no topo do arquivo (ex.: faltando{" "}
              <code>meta</code> em <code>components.json</code>).
            </li>
            <li>
              <code>must have required property 'X'</code>: o campo <code>X</code> é obrigatório
              — abra o schema correspondente para ver o contrato completo.
            </li>
            <li>
              <code>must match pattern "…"</code>: valor fora do formato esperado (ex.: cor não
              está em <code>hsl(var(--token))</code>, id sem kebab-case, ref sem <code>/</code>).
            </li>
            <li>
              <code>must be equal to one of the allowed values</code>: normalmente um{" "}
              <code>$type</code> DTCG inválido — use um dos oito tipos suportados.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-lg text-primary">Fluxo em caso de falha</h3>
          <ol className="list-decimal list-inside space-y-1 text-base">
            <li>Identifique o arquivo e o caminho JSON Pointer indicados no erro.</li>
            <li>
              Corrija a origem em <code>src/index.css</code> (tokens) ou em{" "}
              <code>scripts/build-figma-tokens.mjs</code> (componentes/manifesto) — nunca edite os
              JSONs gerados à mão.
            </li>
            <li>
              Rode <code>npm run build:figma-tokens && npm run validate:figma-tokens</code> até
              obter o status <em>OK</em> para os três artefatos.
            </li>
            <li>
              O CI (<code>.github/workflows/main.yml</code>) repete a mesma checagem — só publica
              quando todos os schemas passam.
            </li>
          </ol>
        </div>
      </section>

      {manifest && (
        <section className="space-y-3">
          <h2 className="text-primary">Integridade dos artefatos</h2>
          <p className="text-sm text-muted-foreground">
            Gerado em <code>{new Date(manifest.generatedAt).toLocaleString("pt-BR")}</code>.
            Verifique o hash SHA-256 antes de confiar num arquivo baixado.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-3 py-2">Arquivo</th>
                  <th className="px-3 py-2">Bytes</th>
                  <th className="px-3 py-2">SHA-256</th>
                </tr>
              </thead>
              <tbody>
                {manifest.files.map((f) => (
                  <tr key={f.file} className="border-t border-border">
                    <td className="px-3 py-2 font-mono">{f.file}</td>
                    <td className="px-3 py-2">{f.bytes.toLocaleString("pt-BR")}</td>
                    <td className="px-3 py-2 font-mono text-xs break-all">{f.sha256}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
