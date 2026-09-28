import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Boxes, Code2, Palette, Workflow } from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/DSComponents";

/**
 * Documentação técnica do template "Radar Estratégico".
 * Lista componentes utilizados, tokens aplicados e passos de implementação.
 */

const componentes: { nome: string; origem: string; uso: string }[] = [
  { nome: "DSLayout (header + sidebar)", origem: "src/components/DSLayout.tsx", uso: "Padrão visual da plataforma — não é usado dentro do template (standalone)." },
  { nome: "SidebarMenuPreview pattern", origem: "src/components/SidebarMenuPreview.tsx", uso: "Inspiração para a sidebar interna com busca, mini-collapse e toggle no rodapé." },
  { nome: "BrandLogo", origem: "src/components/BrandLogo.tsx", uso: "Marca institucional no header (variant=auto)." },
  { nome: "BISkeletons", origem: "src/components/bi/BISkeletons.tsx", uso: "Estados de loading dos KPIs, gráficos e tabela durante refresh." },
  { nome: "Recharts (BarChart)", origem: "recharts", uso: "Gráficos Planejada × Executada por mês e detalhamento por Natureza." },
  { nome: "Filtros (Select nativo)", origem: "elemento <select> com tokens", uso: "8 filtros multidimensionais — PPA, Iniciativa, Ação, Natureza, Unidade, Eixo, Programa, Gestor." },
  { nome: "Tabs", origem: "padrão internos do DS", uso: "Despesas · Receitas · Atendimento." },
  { nome: "Breadcrumb", origem: "componente local", uso: "Hierarquia: Início › Painéis Estratégicos › Radar Estratégico." },
];

const tokens: { token: string; valor: string; uso: string }[] = [
  { token: "--primary", valor: "Azul institucional __BRAND_SHORT__", uso: "Botões primários, indicadores de seleção, links ativos." },
  { token: "--secondary", valor: "Tom de apoio", uso: "Botão 'Dê seu feedback', badges secundários." },
  { token: "--background / --foreground", valor: "Surface base", uso: "Fundo do canvas e textos." },
  { token: "--card / --card-foreground", valor: "Superfície elevada", uso: "Cards de KPI, painel de gráficos, toolbar." },
  { token: "--muted / --muted-foreground", valor: "Ruído suave", uso: "Labels de filtro, textos auxiliares, hover de linhas." },
  { token: "--border", valor: "Divisores", uso: "Separadores de seções, contornos de cards e selects." },
  { token: "--ring", valor: "Foco acessível", uso: "Outline de inputs e selects (focus-visible)." },
  { token: "Tipografia Poppins", valor: "font-sans global", uso: "Toda a hierarquia textual (12px a 24px)." },
  { token: "Radius", valor: "rounded-md (0.375rem)", uso: "Bordas de cards, botões e selects." },
];

const arquivos: { caminho: string; descricao: string }[] = [
  { caminho: "src/pages/RadarEstrategicoPage.tsx", descricao: "Página principal do template (standalone, sem DSLayout)." },
  { caminho: "src/data/radarEstrategico.ts", descricao: "Datasets — despesas mensais, trimestrais e por natureza." },
  { caminho: "src/assets/thumb-radar-estrategico.jpg", descricao: "Thumbnail listada em /templates." },
  { caminho: "src/components/bi/BISkeletons.tsx", descricao: "Esqueletos de carregamento reutilizados." },
  { caminho: "src/App.tsx", descricao: "Rota /templates/radar-estrategico (lazy import)." },
  { caminho: "src/pages/TemplatesPage.tsx", descricao: "Card de entrada na galeria de templates." },
];

const passos: { titulo: string; desc: string }[] = [
  { titulo: "1. Importe os dados", desc: "Use src/data/radarEstrategico.ts como fonte ou substitua pelo endpoint real (mantendo o shape: { mes, planejada, executada })." },
  { titulo: "2. Reaproveite a sidebar", desc: "A sidebar segue o padrão de SidebarMenuPreview — estados hover/ativo/disabled via tokens. Para reutilizar em outra página, copie a seção <aside>." },
  { titulo: "3. Mantenha a estrutura de filtros", desc: "Filtros são state local (useState) + useMemo. Para conectar a um backend, troque o useMemo por uma query (React Query) preservando as chaves." },
  { titulo: "4. Loading & refresh", desc: "Use o padrão isLoading + BISkeletons. O botão 'Atualizar' aciona um setTimeout de 500ms — substitua pelo refetch real." },
  { titulo: "5. Acessibilidade", desc: "Todos os controles têm aria-label; o breadcrumb usa aria-current=\"page\"; gráficos têm <title>/<desc> via Recharts. Mantenha esses atributos ao customizar." },
  { titulo: "6. Validação de tokens", desc: "Não use cores hardcoded — qualquer valor hex novo deve virar token em src/index.css e ser validado por src/data/__tests__/tokenGroups.validator.test.ts." },
];

export default function RadarEstrategicoDocsPage() {
  return (
    <div>
      <PageHeader
        badge="Documentação · Template"
        title="Radar Estratégico"
        description="Painel executivo inspirado em Power BI para acompanhamento orçamentário e indicadores estratégicos. Esta página descreve componentes, tokens e passos para implementar ou estender o template."
      />

      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          to="/templates/radar-estrategico"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm rounded-md"
        >
          <ArrowUpRight size={14} /> Abrir template
        </Link>
        <Link
          to="/templates"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm rounded-md"
        >
          <BookOpen size={14} /> Voltar à galeria
        </Link>
      </div>

      <SectionHeader
        id="visao-geral"
        title="Visão geral"
        description="O template é uma página standalone (sem DSLayout) que reproduz a arquitetura de uma view do Power BI usando React + Tailwind + tokens do Design System __BRAND_SHORT__."
        badge="Overview"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Workflow size={18} className="text-primary" />, title: "Arquitetura", desc: "Header fixo · Sidebar colapsável · Breadcrumb · Toolbar · Filtros · Tabs · Gráficos · Tabela · Footer." },
          { icon: <Boxes size={18} className="text-primary" />, title: "Stack", desc: "React 18 + TypeScript + Tailwind CSS + Recharts + lucide-react." },
          { icon: <Palette size={18} className="text-primary" />, title: "Identidade", desc: "100% tokens semânticos (HSL) · Poppins · Light/Dark mode automáticos." },
        ].map((c) => (
          <div key={c.title} className="brand-card">
            <div className="flex items-center gap-2 mb-2">{c.icon}<h4 className="font-semibold text-sm">{c.title}</h4></div>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>

      <SectionHeader
        id="componentes"
        title="Componentes utilizados"
        description="Inventário dos blocos que compõem o template e onde encontrá-los no projeto."
        badge="Componentes"
      />
      <div className="brand-card overflow-x-auto mb-8 p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Componente</th>
              <th className="text-left px-4 py-2 font-semibold">Origem</th>
              <th className="text-left px-4 py-2 font-semibold">Uso no template</th>
            </tr>
          </thead>
          <tbody>
            {componentes.map((c, i) => (
              <tr key={c.nome} className={i % 2 ? "bg-card" : "bg-background"}>
                <td className="px-4 py-2 font-medium text-foreground">{c.nome}</td>
                <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{c.origem}</td>
                <td className="px-4 py-2 text-muted-foreground">{c.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader
        id="tokens"
        title="Tokens aplicados"
        description="Todas as cores, espaçamentos e tipografia vêm de src/index.css — não há valores hardcoded."
        badge="Design Tokens"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {tokens.map((t) => (
          <div key={t.token} className="brand-card">
            <code className="text-xs font-mono text-primary">{t.token}</code>
            <p className="text-sm font-semibold mt-1">{t.valor}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.uso}</p>
          </div>
        ))}
      </div>

      <SectionHeader
        id="arquivos"
        title="Arquivos do template"
        description="Mapa dos arquivos envolvidos para você localizar rapidamente o que editar."
        badge="Estrutura"
      />
      <div className="brand-card mb-8 p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {arquivos.map((a, i) => (
              <tr key={a.caminho} className={i % 2 ? "bg-card" : "bg-background"}>
                <td className="px-4 py-2 font-mono text-xs text-primary whitespace-nowrap">{a.caminho}</td>
                <td className="px-4 py-2 text-muted-foreground">{a.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader
        id="implementacao"
        title="Passos de implementação"
        description="Checklist para reaproveitar, estender ou conectar o template a dados reais."
        badge="Como usar"
      />
      <ol className="space-y-3 mb-8">
        {passos.map((p) => (
          <li key={p.titulo} className="brand-card">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><Code2 size={14} className="text-primary" />{p.titulo}</h4>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </li>
        ))}
      </ol>

      <SectionHeader
        id="snippet"
        title="Snippet de uso mínimo"
        description="Exemplo de como renderizar o template em uma rota nova."
        badge="Código"
      />
      <pre className="brand-card overflow-x-auto text-xs font-mono leading-relaxed mb-8">
{`// src/App.tsx
import { lazy } from "react";
const RadarEstrategicoPage = lazy(() => import("@/pages/RadarEstrategicoPage"));

<Route path="/templates/radar-estrategico" element={<RadarEstrategicoPage />} />`}
      </pre>

      <SectionHeader
        id="powerbi"
        title="Integração com Power BI (HTML Content)"
        description="Use o arquivo /radar-estrategico-powerbi.html como base. Abaixo, uma medida DAX pronta que devolve o HTML e instruções de como referenciá-lo no visual."
        badge="Power BI"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="brand-card">
          <h4 className="font-semibold text-sm mb-1">1 · Instale o visual</h4>
          <p className="text-xs text-muted-foreground">No Power BI Desktop &gt; <strong>Obter mais visuais</strong> &gt; busque <strong>“HTML Content”</strong> (by Daniel Marsh-Patrick) e adicione ao relatório.</p>
        </div>
        <div className="brand-card">
          <h4 className="font-semibold text-sm mb-1">2 · Crie a medida DAX</h4>
          <p className="text-xs text-muted-foreground">Em uma tabela qualquer (ex.: <code>Medidas</code>), crie a medida abaixo. O visual HTML Content renderiza o texto retornado pela medida arrastada para o campo <strong>Values</strong>.</p>
        </div>
        <div className="brand-card">
          <h4 className="font-semibold text-sm mb-1">3 · Vincule ao visual</h4>
          <p className="text-xs text-muted-foreground">Adicione o visual <strong>HTML Content</strong> ao canvas e arraste a medida <code>HTML Radar</code> para o campo <strong>Values</strong>. O dashboard será renderizado.</p>
        </div>
        <div className="brand-card">
          <h4 className="font-semibold text-sm mb-1">4 · Atualize dinamicamente</h4>
          <p className="text-xs text-muted-foreground">Para refletir dados do modelo, substitua os números fixos por <code>FORMAT([SuaMedida], "C0")</code> dentro da string DAX antes de concatenar.</p>
        </div>
      </div>

      <pre className="brand-card overflow-x-auto text-xs font-mono leading-relaxed mb-4">
{`HTML Radar =
VAR Css =
    "<style>
        body{margin:0;font-family:'Segoe UI',sans-serif;background:#F5F7FB;color:#0F172A}
        .h{background:#16329C;color:#fff;padding:14px 18px;border-radius:8px;
           display:flex;justify-content:space-between;align-items:center}
        .h h1{margin:0;font-size:18px;font-weight:600}
        .k{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}
        .c{background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:14px;
           position:relative;overflow:hidden}
        .c::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:#005EB8}
        .v{font-size:22px;font-weight:700;color:#005EB8}
        .l{font-size:11px;color:#64748B;margin-top:4px}
    </style>"
VAR Despesa  = FORMAT ( [Despesa Executada], "\\R\\$ #,0,,.0\\M" )
VAR Receita  = FORMAT ( [Receita Realizada], "\\R\\$ #,0,,.0\\M" )
VAR Saldo    = FORMAT ( [Saldo Orcamentario], "\\R\\$ #,0,,.0\\M" )
VAR Atend    = FORMAT ( [MEI Atendidos], "#,0" )
VAR Html =
    "<div style='padding:12px'>" &
        "<div class='h'><h1>Radar Estratégico — __BRAND_SHORT__</h1>" &
        "<span style='font-size:11px;opacity:.8'>PPA 2022-2026</span></div>" &
        "<div class='k'>" &
            "<div class='c'><div class='v'>" & Despesa & "</div><div class='l'>Despesa executada</div></div>" &
            "<div class='c'><div class='v'>" & Receita & "</div><div class='l'>Receita realizada</div></div>" &
            "<div class='c'><div class='v'>" & Saldo   & "</div><div class='l'>Saldo orçamentário</div></div>" &
            "<div class='c'><div class='v'>" & Atend   & "</div><div class='l'>MEI atendidos</div></div>" &
        "</div>" &
    "</div>"
RETURN
    "<!doctype html><html><head><meta charset='utf-8'>" & Css &
    "</head><body>" & Html & "</body></html>"`}
      </pre>

      <div className="brand-card mb-8">
        <h4 className="font-semibold text-sm mb-2">Versão completa com gráficos</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Para a versão com Chart.js (gráficos, tabela e filtros), copie o conteúdo de
          <code className="mx-1 text-primary">public/radar-estrategico-powerbi.html</code>
          para uma variável DAX. Como o HTML é extenso, o caminho recomendado é:
        </p>
        <ol className="list-decimal pl-5 text-xs text-muted-foreground space-y-1">
          <li>Salvar o HTML como uma coluna em uma tabela calculada (ex.: <code>RadarHTML[Html]</code>).</li>
          <li>Criar a medida <code>HTML Radar Completo = SELECTEDVALUE(RadarHTML[Html])</code>.</li>
          <li>Arrastar essa medida para o campo <strong>Values</strong> do visual <strong>HTML Content</strong>.</li>
        </ol>
        <p className="text-xs text-muted-foreground mt-2">
          Importante: o visual HTML Content executa scripts em sandbox; CDNs públicos como
          <code className="mx-1">cdn.jsdelivr.net</code> são permitidos.
        </p>
      </div>

      <SectionHeader
        id="powerbi-template"
        title="Template HTML com placeholders"
        description="Arquivo pronto com CSS 100% inline e marcadores {{...}} para você substituir diretamente no Power BI via DAX SUBSTITUTE — sem dependências externas."
        badge="Template Power BI"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="brand-card">
          <h4 className="font-semibold text-sm mb-1">Arquivo</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Baixe ou abra o template publicado em:
          </p>
          <code className="block text-[11px] font-mono text-primary break-all">
            /radar-estrategico-powerbi-template.html
          </code>
          <a
            href="/radar-estrategico-powerbi-template.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs rounded-md"
          >
            <ArrowUpRight size={12} /> Abrir template
          </a>
        </div>
        <div className="brand-card">
          <h4 className="font-semibold text-sm mb-1">Como funciona</h4>
          <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
            <li>CSS 100% inline em cada tag → renderiza no sandbox do HTML Content sem &lt;style&gt;.</li>
            <li>Cores e tipografia já alinhadas aos tokens __BRAND_SHORT__.</li>
            <li>Placeholders <code>{`{{NOME}}`}</code> trocados por <code>SUBSTITUTE</code> na medida DAX.</li>
            <li>Sem CDNs, sem scripts — compatível com qualquer relatório Power BI.</li>
          </ul>
        </div>
      </div>

      <SectionHeader
        id="powerbi-placeholders"
        title="Placeholders disponíveis"
        description="Lista completa dos marcadores presentes no template. Substitua cada um pelo valor da sua medida DAX."
        badge="Referência"
      />
      <div className="brand-card overflow-x-auto mb-4 p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Placeholder</th>
              <th className="text-left px-4 py-2 font-semibold">Significado</th>
              <th className="text-left px-4 py-2 font-semibold">Exemplo</th>
            </tr>
          </thead>
          <tbody>
            {[
              { p: "{{TITULO}}", s: "Título do header", e: "Radar Estratégico" },
              { p: "{{SUBTITULO}}", s: "Subtítulo do header", e: "Painel executivo · __BRAND_SHORT__" },
              { p: "{{PERIODO}}", s: "Badge de período", e: "PPA 2022-2026" },
              { p: "{{KPI_1_VALOR}} … {{KPI_4_VALOR}}", s: "Valores dos 4 KPIs", e: "R$ 74,9M" },
              { p: "{{KPI_1_LABEL}} … {{KPI_4_LABEL}}", s: "Rótulos dos 4 KPIs", e: "Despesa executada" },
              { p: "{{SECAO_TITULO}}", s: "Título do bloco de destaque", e: "Resumo do período" },
              { p: "{{SECAO_DESCRICAO}}", s: "Texto do bloco de destaque", e: "Execução acumulada até junho/2026." },
              { p: "{{LINHA_N_LABEL}}", s: "Indicador na tabela (N = 1..3)", e: "1º Trimestre" },
              { p: "{{LINHA_N_PLANEJADO}}", s: "Valor planejado da linha", e: "R$ 56.943.800" },
              { p: "{{LINHA_N_EXECUTADO}}", s: "Valor executado da linha", e: "R$ 33.039.171" },
              { p: "{{LINHA_N_PCT}}", s: "% de execução da linha", e: "58,0%" },
            ].map((r) => (
              <tr key={r.p} className="odd:bg-background even:bg-card">
                <td className="px-4 py-2 font-mono text-xs text-primary whitespace-nowrap">{r.p}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.s}</td>
                <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{r.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader
        id="powerbi-dax-substitute"
        title="Medida DAX com SUBSTITUTE"
        description="Cole o HTML do template em uma variável e use SUBSTITUTE encadeado para injetar suas medidas. O resultado é arrastado para o campo Values do visual HTML Content."
        badge="DAX"
      />
      <pre className="brand-card overflow-x-auto text-xs font-mono leading-relaxed mb-8">
{`HTML Radar Template =
VAR Template =
    "<!doctype html><html><body style='margin:0;font-family:Segoe UI,sans-serif;background:#F5F7FB;color:#0F172A'>"
    & "<div style='padding:16px'>"
    &   "<div style='background:#16329C;color:#fff;border-radius:8px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px'>"
    &     "<div><h1 style='margin:0;font-size:18px;font-weight:600'>{{TITULO}}</h1>"
    &     "<div style='font-size:11px;opacity:.8'>{{SUBTITULO}}</div></div>"
    &     "<span style='background:rgba(255,255,255,.15);padding:4px 10px;border-radius:999px;font-size:11px'>{{PERIODO}}</span>"
    &   "</div>"
    &   "<div style='display:grid;grid-template-columns:repeat(4,1fr);gap:10px'>"
    &     "<div style='background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:14px;border-top:3px solid #005EB8'>"
    &       "<div style='font-size:22px;font-weight:700;color:#005EB8'>{{KPI_1_VALOR}}</div>"
    &       "<div style='font-size:11px;color:#64748B'>{{KPI_1_LABEL}}</div></div>"
    &     "<div style='background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:14px;border-top:3px solid #2A4FDA'>"
    &       "<div style='font-size:22px;font-weight:700;color:#2A4FDA'>{{KPI_2_VALOR}}</div>"
    &       "<div style='font-size:11px;color:#64748B'>{{KPI_2_LABEL}}</div></div>"
    &     "<div style='background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:14px;border-top:3px solid #16A34A'>"
    &       "<div style='font-size:22px;font-weight:700;color:#16A34A'>{{KPI_3_VALOR}}</div>"
    &       "<div style='font-size:11px;color:#64748B'>{{KPI_3_LABEL}}</div></div>"
    &     "<div style='background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:14px;border-top:3px solid #D97706'>"
    &       "<div style='font-size:22px;font-weight:700;color:#D97706'>{{KPI_4_VALOR}}</div>"
    &       "<div style='font-size:11px;color:#64748B'>{{KPI_4_LABEL}}</div></div>"
    &   "</div>"
    & "</div></body></html>"

VAR R1 = SUBSTITUTE ( Template,  "{{TITULO}}",      "Radar Estratégico" )
VAR R2 = SUBSTITUTE ( R1,        "{{SUBTITULO}}",   "Painel executivo · __BRAND_SHORT__" )
VAR R3 = SUBSTITUTE ( R2,        "{{PERIODO}}",     "PPA 2022-2026" )
VAR R4 = SUBSTITUTE ( R3,        "{{KPI_1_VALOR}}", FORMAT ( [Despesa Executada], "\\R\\$ #,0,,.0\\M" ) )
VAR R5 = SUBSTITUTE ( R4,        "{{KPI_1_LABEL}}", "Despesa executada" )
VAR R6 = SUBSTITUTE ( R5,        "{{KPI_2_VALOR}}", FORMAT ( [Receita Realizada], "\\R\\$ #,0,,.0\\M" ) )
VAR R7 = SUBSTITUTE ( R6,        "{{KPI_2_LABEL}}", "Receita realizada" )
VAR R8 = SUBSTITUTE ( R7,        "{{KPI_3_VALOR}}", FORMAT ( [Saldo Orcamentario], "\\R\\$ #,0,,.0\\M" ) )
VAR R9 = SUBSTITUTE ( R8,        "{{KPI_3_LABEL}}", "Saldo orçamentário" )
VAR Ra = SUBSTITUTE ( R9,        "{{KPI_4_VALOR}}", FORMAT ( [MEI Atendidos], "#,0" ) )
VAR Rb = SUBSTITUTE ( Ra,        "{{KPI_4_LABEL}}", "MEI atendidos" )

RETURN Rb`}
      </pre>

      <div className="brand-card mb-8">
        <h4 className="font-semibold text-sm mb-2">Boas práticas</h4>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li>Use sempre <code>SUBSTITUTE</code> com a string exata do placeholder, incluindo as chaves duplas.</li>
          <li>Evite <code>&lt;style&gt;</code> e classes — o HTML Content tem CSP restrita; manter o CSS inline garante renderização.</li>
          <li>Não use aspas duplas dentro dos atributos: o template já usa aspas simples para conviver com a string DAX.</li>
          <li>Para HTML maior, salve-o como uma coluna de tabela calculada e leia com <code>SELECTEDVALUE</code>.</li>
        </ul>
      </div>
    </div>
  );
}
