# Arquitetura do DS gerado

## Stack

Vite 5 + React 18 + TypeScript, Tailwind 3 com tokens em CSS custom properties, shadcn/ui (Radix), React Router 6, TanStack Query, Recharts e Apache ECharts 5 (gráficos), Lucide. Testes com Vitest + Testing Library; smoke com Playwright. O projeto nasceu na Lovable (`lovable-tagger` em dev, ponteiros `.asset.json`).

## Estrutura

```
index.html                  metatags, JSON-LD, favicon
tailwind.config.ts          mapeia tokens → utilitários (cores, espaço, tipografia)
src/
  index.css                 TODOS os tokens (:root / .dark) + classes brand-* e ds-*
  App.tsx                   rotas (lazyWithRetry); templates standalone fora do DSLayout
  components/
    DSLayout.tsx            casca do site: header, sidebar com busca, navegação (array navItems)
    BrandLogo.tsx           logo com variantes auto/color/white/mono
    ui/                     ~49 componentes shadcn (button tem as variantes "brand" e "diversificado")
    templates/              blocos reutilizáveis: Auth, CardSignIn, Dashboard, Footer, HubPaineis, SidebarMenuPreview
    bi/                     peças do Dashboard BI e da Tela BI (filtros, sidebar, KPI, header, seções em ECharts)
    charts/                 BrandChart (wrapper do ECharts: tema, resize, loading, mapas) e ChartShowcase
    ColorSection, GridSection, ChartsSection, TokenExplorer, FontFamilyCard, DSComponents  (seções de documentação)
  pages/                    uma página por rota (ver abaixo)
  data/tokenGroups.ts       espelho dos tokens para /tokens (validado por teste)
  data/echarts/             registry.ts + presets/<categoria>/<id>.ts (74 presets de gráfico)
  lib/echarts/              brandTheme (tema derivado dos tokens), format (pt-BR), mapas, exportPreset, buildLibraryZip
  assets/brand.ts           URLs dos logos oficiais (cor, branco, preto)
  assets/marca/*.asset.json ponteiros para os logos (gerados apontam para /marca/*.svg)
  hooks/useTheme.ts         light/dark por classe, persistido no localStorage
  utils/prefetchRoutes.ts   prefetch das rotas lazy no hover do menu
scripts/                    validadores rodados no build e no CI; build-figma-tokens/validate-figma-tokens
schemas/                    JSON Schemas (tokens, componentes, tailwind) usados pelo validador
public/                     favicon, marca/, placeholders/, geo/ (GeoJSON do Brasil), design-system/ (tokens DTCG), sitemap.xml, robots.txt, llms.txt
DESIGN-SYSTEM.md            documentação técnica única do DS (escrita à mão; atualize junto com o código)
```

## Rotas

Dentro do `DSLayout` (documentação):

| Rota | Página | Conteúdo |
|---|---|---|
| `/` | HomePage | Hero da marca, voz da marca, princípios, navegação e status |
| `/fundamentos` | FundamentosPage | Tipografia, cores, iconografia (Lucide), grid, elevação, motion, responsividade |
| `/tokens` | TokensPage | Explorador de tokens (lê `tokenGroups.ts`) |
| `/componentes` | ComponentesPage | 25 seções: botão, inputs, select, checkbox/radio, switch, badge, alert, card, tabela, accordion, tabs, modal, toast, breadcrumb, paginação, tooltip, skeleton, spinner, empty state, dropdown, kebab, datepicker, filtros, KPIs, upload |
| `/templates` | TemplatesPage | Header, footer, menu lateral, logins, dashboards, hub de painéis, modelos de página (com miniaturas) |
| `/marca` | MarcaPage | Logos para download, área de proteção, tamanhos mínimos, fundos, usos incorretos |
| `/conteudo` | ConteudoPage | Webwriting: princípios, estrutura, boas práticas, faça/evite, SEO |
| `/acessibilidade` | AcessibilidadePage | Contraste, foco, teclado, dark mode, semântica, ARIA, alvos |
| `/graficos`, `/graficos/<categoria>` | graficos/GraficosIndexPage, GraficosCategoriaPage | Biblioteca ECharts: barras, linhas, proporção, distribuição, relações, KPI e mapas, com código React de cada preset |
| `/graficos/playground`, `/graficos/downloads` | GraficosPlaygroundPage, GraficosDownloadsPage | Editor do `option` em JSON com prévia ao vivo; pacotes `.zip` (presets, tema isolado, `index.json`) gerados no cliente |
| `/componentes/header-degrade/docs`, `/playground` | HeaderDegradeDocsPage, HeaderPlaygroundPage | Header com degradê institucional (tokens `--brand-header-*`) |
| `/design-system/figma`, `/schemas`, `/validator` | FigmaBridgePage, SchemasPage, ValidatorPage | Tokens no formato DTCG para o Figma, JSON Schemas e validação Ajv no navegador |
| `/modelos-bi/*` | ModelosBIPage, modelos-bi/*, RadarEstrategicoDocsPage, PowerBIMappingPage | **Opcional**: modelos de painéis de BI (Radar Estratégico, Planejamento, MPI, Gestão de Pessoas) e o guia de mapeamento para o Power BI |

Standalone (tela cheia, fora do DSLayout): `/templates/dashboard-institucional`, `dashboard-bi`, `tela-listagem`, `tela-formulario`, `pagina-autenticacao`, `cadastro`, `autenticacao-2fa`, `pagina-erro`, `modal-acesso`, `pagina-filtros-tabela`, `radar-estrategico`, `dashboard-analitico`, `tela-bi`.

## Validadores (rodam no `npm run build`)

| Script | Garante |
|---|---|
| `build:figma-tokens` | Regera `public/design-system/` (tokens DTCG, CSS, manifesto) a partir de `src/index.css` |
| `validate:figma-tokens` | Os arquivos gerados batem com os schemas de `schemas/` |
| `typecheck` | TypeScript sem erros |
| `check:legacy-brand` | Nenhum termo de `scripts/legacy-brand.config.json` no código (`termos_proibidos` do briefing) |
| `check:legacy-typography` | `<p>` com tipografia avulsa não passa do baseline em `reports/` |
| `check:homepage-h1` | A regra global de cor do H1 existe no CSS |

Testes (`npx vitest run`): validador de tokens (77 casos), regressão da sidebar (320px, logo 60×60, sem corte de texto), variantes de header e FontFamilyCard.

O DS gerado **não traz CI**. Um pipeline típico roda lint, typecheck, build e testes, publica (FTP, S3, Pages…) e roda um smoke da URL pública periodicamente com os scripts que já vêm no DS gerado: `scripts/smoke-public-url.mjs`, `check-homepage-h1-computed.mjs` e `check-homepage-interactive-tokens.mjs`.

## Gráficos ECharts

- **Tema:** `src/lib/echarts/brandTheme.ts` registra `brand-light` e `brand-dark` lendo os tokens do CSS em tempo de execução (`readToken`). A recoloração do gerador chega aos gráficos sozinha: não há HEX nos presets, só os valores de fallback do tema (SSR e testes). O `BrandChart` re-registra o tema quando o usuário troca light/dark.
- **Paletas:** `BRAND_PALETTE` (10 cores categóricas), `BRAND_PALETTE_ESTENDIDA` (19), `BRAND_SCALE_SEQUENCIAL` e `BRAND_SCALE_DIVERGENTE`, todas derivadas dos tokens.
- **Presets:** cada arquivo de `src/data/echarts/presets/` exporta um `ChartPreset` (option, código React, quando usar, acessibilidade, `ariaLabel`) e entra em `registry.ts`. Os dados são fictícios.
- **Mapas:** só o mapa do Brasil por UF (`public/geo/brasil-ufs.json`, carregado sob demanda). Para um mapa estadual ou municipal, acrescente o GeoJSON em `public/geo/`, registre o nome em `src/lib/echarts/mapas.ts` e crie o preset.
- **Documentação:** a seção 8 do `DESIGN-SYSTEM.md` descreve tema, paletas, presets e o uso fora do React (CDN, Power BI).

## Módulo opcional: Modelos de BI

Com `modulos.modelos_bi: false`, o gerador remove as linhas de rota e prefetch que citam `/modelos-bi` e as páginas do hub, o item "Modelos de BI" do `navItems` no `DSLayout`, as páginas `ModelosBIPage`, `modelos-bi/`, `RadarEstrategicoDocsPage` e `PowerBIMappingPage`, o link para o mapeamento do Power BI na Central de Downloads dos gráficos e as entradas de `sitemap.xml` e `llms.txt`. O template `/templates/radar-estrategico` permanece.
