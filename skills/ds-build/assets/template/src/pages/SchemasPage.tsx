import { SEO } from "@/components/SEO";
import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";

export default function SchemasPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <SEO
        title="Schemas dos artefatos | Design System __BRAND_NAME__"
        description="Documentação completa dos JSON Schemas que validam tokens.json, components.json e tailwind.config.json, com exemplos de erro e fluxo de correção."
        path="/design-system/schemas"
      />

      <PageHeader
        badge="Ponte para Figma"
        title="Schemas dos artefatos"
        description="Contrato formal em JSON Schema que garante que tokens.json, components.json e tailwind.config.json cheguem ao Figma sempre no mesmo formato. Sem schema válido, o build falha antes do deploy."
      />

      <SectionHeader
        id="visao-geral"
        badge="Visão geral"
        title="Como a validação funciona"
        description="Três arquivos gerados a partir de src/index.css são conferidos por Ajv contra schemas Draft-07 versionados no repositório."
      />

      <div className="brand-card space-y-3">
        <p className="text-foreground">
          O pipeline segue quatro etapas encadeadas: <strong>gerar</strong> os artefatos,
          <strong> validar</strong> contra o schema, <strong>publicar</strong> em
          <code> /design-system/*</code> e <strong>consumir</strong> pelo Figma.
        </p>
        <pre className="bg-muted rounded px-3 py-2 text-sm overflow-x-auto">
{`src/index.css
     │  build:figma-tokens
     ▼
public/design-system/*.json
     │  validate:figma-tokens  (Ajv + Draft-07)
     ▼
publica no domínio
     │  Tokens Studio / plugins
     ▼
Figma`}
        </pre>
      </div>

      <SectionHeader
        id="tokens"
        badge="Artefato"
        title="tokens.json — schemas/tokens.schema.json"
        description="Formato W3C DTCG. Cada folha da árvore precisa declarar $type e $value dentro dos oito tipos suportados."
      />

      <div className="brand-card space-y-4">
        <ul className="list-disc list-inside space-y-1 text-foreground">
          <li>Raiz obrigatória: <code>$schema</code> e <code>brand</code>.</li>
          <li>Tipos permitidos: color, dimension, shadow, duration, cubicBezier, fontWeight, number, string.</li>
          <li>Nós intermediários agrupam tokens; folhas precisam ter <code>$type</code> e <code>$value</code>.</li>
          <li>Tema dark vive em <code>$extensions.com.brand.themes.dark</code>.</li>
        </ul>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-success font-semibold">Válido</p>
            <CodeBlock
              language="json"
              code={`{
  "$schema": "https://.../tokens.schema.json",
  "brand": {
    "color": {
      "primary": {
        "500": {
          "$type": "color",
          "$value": "#005EB8"
        }
      }
    }
  }
}`}
            />
          </div>
          <div>
            <p className="text-error font-semibold">Inválido</p>
            <CodeBlock
              language="json"
              code={`{
  "brand": {
    "color": {
      "primary": {
        "500": { "$value": "#005EB8" }
      }
    }
  }
}
// Falta $type e $schema na raiz.`}
            />
          </div>
        </div>

        <div>
          <p className="text-foreground font-semibold mb-1">Erro típico no relatório</p>
          <CodeBlock
            language="text"
            code={`[schema] tokens.json FALHOU contra tokens.schema.json:
  - /brand/color/primary/500 must have required property '$type'
  - (root) must have required property '$schema'`}
          />
        </div>
      </div>

      <SectionHeader
        id="components"
        badge="Artefato"
        title="components.json — schemas/components.schema.json"
        description="Catálogo consumido pelo Figma para localizar cada primitivo e componente composto renderizado em produção."
      />

      <div className="brand-card space-y-4">
        <ul className="list-disc list-inside space-y-1 text-foreground">
          <li>Raiz precisa conter <code>meta</code>, <code>primitives</code> e <code>composed</code>.</li>
          <li><code>meta</code> obriga <code>name</code>, <code>baseUrl</code> (URI) e <code>description</code>.</li>
          <li>Cada item tem <code>id</code> em kebab-case, <code>name</code> e <code>ref</code> começando por <code>/</code>.</li>
          <li>Tokens listados devem seguir o padrão <code>--token-name</code>.</li>
        </ul>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-success font-semibold">Válido</p>
            <CodeBlock
              language="json"
              code={`{
  "meta": {
    "name": "__BRAND_SHORT__ DS",
    "baseUrl": "https://__DS_DOMAIN__",
    "description": "Catálogo oficial"
  },
  "primitives": [
    { "id": "botao", "name": "Botão", "ref": "/componentes#botao" }
  ],
  "composed": [
    { "id": "footer", "name": "Footer", "ref": "/templates#footer" }
  ]
}`}
            />
          </div>
          <div>
            <p className="text-error font-semibold">Inválido</p>
            <CodeBlock
              language="json"
              code={`{
  "primitives": [
    { "id": "Botao 1", "name": "Botão", "ref": "componentes" }
  ]
}
// id fora do padrão, ref sem "/", faltando meta e composed.`}
            />
          </div>
        </div>

        <div>
          <p className="text-foreground font-semibold mb-1">Erro típico no relatório</p>
          <CodeBlock
            language="text"
            code={`[schema] components.json FALHOU contra components.schema.json:
  - (root) must have required property 'meta'
  - /primitives/0/id must match pattern "^[a-z0-9][a-z0-9-]*$"
  - /primitives/0/ref must match pattern "^/"`}
          />
        </div>
      </div>

      <SectionHeader
        id="tailwind"
        badge="Artefato"
        title="tailwind.config.json — schemas/tailwind.schema.json"
        description="Subconjunto do tema Tailwind que expõe apenas aliases apontando para variáveis CSS — nada hardcoded."
      />

      <div className="brand-card space-y-4">
        <ul className="list-disc list-inside space-y-1 text-foreground">
          <li>Raiz obrigatória: <code>darkMode</code> e <code>theme.extend</code>.</li>
          <li><code>theme.extend</code> precisa conter <code>fontFamily</code>, <code>colors</code>, <code>spacing</code>, <code>fontSize</code> e <code>borderRadius</code>.</li>
          <li>Cores seguem o padrão <code>hsl(var(--token))</code>.</li>
          <li>Spacing, fontSize e borderRadius seguem <code>var(--token)</code>.</li>
        </ul>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-success font-semibold">Válido</p>
            <CodeBlock
              language="json"
              code={`{
  "darkMode": ["class"],
  "theme": {
    "extend": {
      "fontFamily": { "sans": ["__FONT_PRIMARY__"] },
      "colors": { "primary": "hsl(var(--primary))" },
      "spacing": { "4": "var(--space-4)" },
      "fontSize": { "base": "var(--text-base)" },
      "borderRadius": { "md": "var(--radius-md)" }
    }
  }
}`}
            />
          </div>
          <div>
            <p className="text-error font-semibold">Inválido</p>
            <CodeBlock
              language="json"
              code={`{
  "darkMode": "class",
  "theme": {
    "extend": {
      "colors": { "primary": "#005EB8" },
      "spacing": { "4": "1rem" }
    }
  }
}
// Cor e spacing hardcoded; faltam fontFamily/fontSize/borderRadius.`}
            />
          </div>
        </div>

        <div>
          <p className="text-foreground font-semibold mb-1">Erro típico no relatório</p>
          <CodeBlock
            language="text"
            code={`[schema] tailwind.config.json FALHOU contra tailwind.schema.json:
  - /theme/extend must have required property 'fontFamily'
  - /theme/extend/colors/primary must match pattern "^hsl\\(var\\(--[a-z0-9-]+\\)\\)$"
  - /theme/extend/spacing/4 must match pattern "^var\\(--[a-z0-9-]+\\)$"`}
          />
        </div>
      </div>

      <SectionHeader
        id="mensagens"
        badge="Leitura de erros"
        title="Como interpretar as mensagens Ajv"
        description="Cada linha segue o formato <caminho JSON Pointer> <mensagem>."
      />

      <div className="brand-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-3 py-2">Mensagem</th>
                <th className="px-3 py-2">O que significa</th>
                <th className="px-3 py-2">Como resolver</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">must have required property 'X'</td>
                <td className="px-3 py-2">Campo obrigatório ausente no caminho indicado.</td>
                <td className="px-3 py-2">Abrir o schema, adicionar o campo faltante no gerador.</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">must match pattern "…"</td>
                <td className="px-3 py-2">Valor fora do formato regex esperado (id, ref, cor, spacing).</td>
                <td className="px-3 py-2">Ajustar o valor para respeitar kebab-case, prefixo <code>/</code> ou <code>var(--…)</code>.</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">must be equal to one of the allowed values</td>
                <td className="px-3 py-2"><code>$type</code> DTCG fora dos oito suportados.</td>
                <td className="px-3 py-2">Trocar por color, dimension, shadow, duration, cubicBezier, fontWeight, number ou string.</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">must be string,number</td>
                <td className="px-3 py-2"><code>$value</code> em tipo inválido (ex.: objeto ou array).</td>
                <td className="px-3 py-2">Emitir string HEX/px ou número puro.</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">(root)</td>
                <td className="px-3 py-2">Problema no topo do arquivo, não em campo aninhado.</td>
                <td className="px-3 py-2">Conferir chaves obrigatórias da raiz definida no schema.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <SectionHeader
        id="fluxo"
        badge="Fluxo"
        title="Passo a passo para corrigir"
        description="A regra de ouro: nunca editar os JSONs em public/design-system/ à mão — eles são regenerados a cada build."
      />

      <div className="brand-card">
        <ol className="list-decimal list-inside space-y-2 text-foreground">
          <li>Rodar <code>npm run build:figma-tokens</code> para gerar os artefatos.</li>
          <li>Rodar <code>npm run validate:figma-tokens</code> e ler cada linha marcada como <em>FALHOU</em>.</li>
          <li>Localizar o caminho JSON Pointer (ex.: <code>/brand/color/primary/500</code>) e mapear para a origem: tokens vêm de <code>src/index.css</code>; components/manifest vêm de <code>scripts/build-figma-tokens.mjs</code>.</li>
          <li>Corrigir a origem, regenerar e validar novamente até obter três linhas <em>OK</em>.</li>
          <li>Commitar apenas <code>src/index.css</code> e <code>scripts/*</code> — o CI regenera os JSONs.</li>
          <li>Se o CI falhar em <code>Validacao de schema falhou</code>, o deploy é bloqueado automaticamente.</li>
        </ol>
      </div>

      <SectionHeader
        id="comandos"
        badge="Comandos"
        title="Referência rápida"
      />

      <div className="brand-card">
        <CodeBlock
          language="bash"
          code={`# Gera tokens.json, tokens.css, components.json, tailwind.config.json e manifest.json
npm run build:figma-tokens

# Valida os artefatos contra os schemas em schemas/*.schema.json
npm run validate:figma-tokens

# Executa tudo (gera, valida, typecheck e build)
npm run build`}
        />
      </div>
    </div>
  );
}