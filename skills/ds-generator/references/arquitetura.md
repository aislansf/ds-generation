# Arquitetura do DS gerado

## Stack

Vite 5 + React 18 + TypeScript, Tailwind 3 com tokens em CSS custom properties, shadcn/ui (Radix), React Router 6, TanStack Query, Recharts, Lucide. Testes com Vitest + Testing Library; smoke com Playwright. O projeto nasceu na Lovable (`lovable-tagger` em dev, ponteiros `.asset.json`).

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
    bi/                     peças do Dashboard BI (filtros, sidebar, KPI, seções)
    ColorSection, GridSection, ChartsSection, TokenExplorer, FontFamilyCard, DSComponents  (seções de documentação)
  pages/                    uma página por rota (ver abaixo)
  data/tokenGroups.ts       espelho dos tokens para /tokens (validado por teste)
  assets/brand.ts           URLs dos logos oficiais (cor, branco, preto)
  assets/marca/*.asset.json ponteiros para os logos (gerados apontam para /marca/*.svg)
  hooks/useTheme.ts         light/dark por classe, persistido no localStorage
  utils/prefetchRoutes.ts   prefetch das rotas lazy no hover do menu
scripts/                    validadores rodados no build e no CI
public/                     favicon, marca/, placeholders/, sitemap.xml, robots.txt, llms.txt
```

## Rotas

Dentro do `DSLayout` (documentação):

| Rota | Página | Conteúdo |
|---|---|---|
| `/` | HomePage | Hero da marca, bloco Brandbook, princípios, navegação e status |
| `/fundamentos` | FundamentosPage | Tipografia, cores, iconografia (Lucide), grid, elevação, motion, responsividade |
| `/tokens` | TokensPage | Explorador de tokens (lê `tokenGroups.ts`) |
| `/componentes` | ComponentesPage | 25 seções: botão, inputs, select, checkbox/radio, switch, badge, alert, card, tabela, accordion, tabs, modal, toast, breadcrumb, paginação, tooltip, skeleton, spinner, empty state, dropdown, kebab, datepicker, filtros, KPIs, upload |
| `/templates` | TemplatesPage | Header, footer, menu lateral, logins, dashboards, hub de painéis, modelos de página (com miniaturas) |
| `/marca` | MarcaPage | Logos para download, área de proteção, tamanhos mínimos, fundos, usos incorretos |
| `/conteudo` | ConteudoPage | Webwriting: princípios, estrutura, boas práticas, faça/evite, SEO |
| `/acessibilidade` | AcessibilidadePage | Contraste, foco, teclado, dark mode, semântica, ARIA, alvos |
| `/modelos-bi/*` | ModelosBIPage, modelos-bi/*, FarolEstrategicoDocsPage | **Opcional**: produtos de BI da origem |

Standalone (tela cheia, fora do DSLayout): `/templates/dashboard-institucional`, `dashboard-bi`, `tela-listagem`, `tela-formulario`, `pagina-autenticacao`, `cadastro`, `autenticacao-2fa`, `pagina-erro`, `modal-acesso`, `pagina-filtros-tabela`, `farol-estrategico`.

## Validadores (rodam no `npm run build`)

| Script | Garante |
|---|---|
| `typecheck` | TypeScript sem erros |
| `check:legacy-brand` | Nenhum termo de `scripts/legacy-brand.config.json` no código (marca de origem + antigas) |
| `check:legacy-typography` | `<p>` com tipografia avulsa não passa do baseline em `reports/` |
| `check:homepage-h1` | A regra global de cor do H1 existe no CSS |

Testes (`npx vitest run`): validador de tokens (77 casos), regressão da sidebar (320px, logo 60×60, sem corte de texto), variantes de header e FontFamilyCard.

O DS gerado **não traz CI**. Como modelo, a origem (`ds-sebrae/.github/workflows/main.yml`) roda lint, typecheck, build e testes, faz deploy por FTP e roda smoke da URL pública a cada 6h (`scripts/smoke-public-url.mjs`, `check-homepage-h1-computed.mjs` e `check-homepage-interactive-tokens.mjs`, que já vêm no DS gerado).

## Módulo opcional: Modelos de BI

Com `modulos.modelos_bi: false`, o gerador remove as linhas de rota e prefetch que citam `/modelos-bi` e as páginas do hub, o item "Modelos de BI" do `navItems` no `DSLayout`, as páginas `ModelosBIPage`, `modelos-bi/` e `FarolEstrategicoDocsPage`, e as entradas de `sitemap.xml` e `llms.txt`. O template `/templates/farol-estrategico` permanece.
