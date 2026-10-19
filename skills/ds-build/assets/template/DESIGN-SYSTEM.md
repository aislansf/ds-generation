# Design System __BRAND_NAME__

- **Nome:** Design System __BRAND_NAME__
- **Versão do manifesto:** `latest` (`public/design-system/manifest.json`)
- **Data de geração:** 28/08/2026
- **Produção:** https://__DS_DOMAIN__
- **Repositório:** aplicação Vite + React 18 + TypeScript

Este documento é a fonte de verdade técnica do Design System __BRAND_NAME__. Ele reúne, em um único arquivo, os fundamentos visuais, a lista completa de design tokens, a biblioteca de componentes, os templates de tela, os modelos de BI, as duas bibliotecas de gráficos (Recharts e Apache ECharts), as diretrizes de marca, conteúdo e acessibilidade, além das automações de qualidade e do mapa completo de rotas. Destina-se tanto a desenvolvedores humanos quanto a agentes de IA que precisem consumir ou estender o DS sem acesso ao restante do repositório.

> Aviso: este arquivo foi gerado a partir da leitura direta do código deste repositório (`src/index.css`, `tailwind.config.ts`, `src/components/DSLayout.tsx`, `src/App.tsx`, `src/data/echarts/registry.ts`, `schemas/`, `package.json`). Ao alterar tokens, rotas, componentes ou presets, atualize também este documento.

---

## Sumário

1. [Visão geral](#1-visao-geral)
2. [Como consumir](#2-como-consumir)
3. [Fundamentos](#3-fundamentos)
4. [Tokens](#4-tokens)
5. [Componentes](#5-componentes)
6. [Templates](#6-templates)
7. [Modelos de BI](#7-modelos-de-bi)
8. [Gráficos](#8-graficos)
9. [Marca](#9-marca)
10. [Conteúdo e webwriting](#10-conteudo-e-webwriting)
11. [Acessibilidade](#11-acessibilidade)
12. [Qualidade e automações](#12-qualidade-e-automacoes)
13. [Integração com Figma](#13-integracao-com-figma)
14. [Mapa de rotas](#14-mapa-de-rotas)
15. [Changelog resumido](#15-changelog-resumido)

---

<a id="1-visao-geral"></a>
## 1. Visão geral

O Design System __BRAND_NAME__ é a biblioteca oficial de padrões de interface dos produtos digitais do __BRAND_NAME__. Ele documenta e distribui: fundamentos visuais, design tokens em CSS custom properties, componentes de UI (base shadcn/ui e composições próprias), templates de tela prontos, modelos de painéis de BI e uma biblioteca de visualização de dados com tema institucional.

**Para quem é:** times de produto, desenvolvimento front-end, design e parceiros que constroem interfaces para o __BRAND_NAME__, além de agentes de IA que gerem código a partir do DS.

**Princípios**

| Princípio | O que significa na prática |
| --- | --- |
| Acessível | WCAG 2.1 nível AA como piso, foco visível global, semântica correta, suporte a `prefers-reduced-motion`, light e dark obrigatórios. |
| Confiável | Um único conjunto de tokens; nada de valor hexadecimal solto em componente; validadores de CI impedem regressão. |
| Inovador | Biblioteca de dados com 74 presets ECharts, playground de tokens, ponte DTCG para Figma e exportação para Power BI. |
| Claro | Hierarquia tipográfica fixa, microcopy objetiva, vocabulário institucional __BRAND_SHORT__, sem jargão. |

**Stack real**

| Camada | Tecnologia |
| --- | --- |
| Build | Vite 5 (`^5.4.19`) com `@vitejs/plugin-react-swc` |
| UI | React 18 (`^18.3.1`) + React Router DOM 7 |
| Linguagem | TypeScript 5 (`^5.8.3`) |
| Estilo | Tailwind CSS 3 (`^3.4.17`) + `tailwindcss-animate` + `@tailwindcss/typography` |
| Componentes | shadcn/ui sobre Radix UI, `class-variance-authority`, `tailwind-merge` |
| Gráficos | Recharts (`^3.9.0`) e Apache ECharts 5 (`^5.5.1`) |
| Estado/dados | `@tanstack/react-query`, `react-hook-form`, `zod` |
| Utilidades | `lucide-react`, `@remixicon/react`, `date-fns`, `jszip`, `file-saver`, `xlsx`, `sonner`, `react-helmet-async` |
| Testes | Vitest 3, Testing Library, Playwright |

---

<a id="2-como-consumir"></a>
## 2. Como consumir

### 2.1 Instalação e execução

```bash
npm install
npm run dev       # servidor de desenvolvimento Vite
npm run build     # pipeline completo de validação + build de produção
npm run preview   # serve o build local
```

### 2.2 Estrutura de pastas

```text
public/
  design-system/        endpoints públicos do DS (manifest, tokens, components)
  llms.txt              índice do DS para agentes de IA
  sitemap.xml           mapa de rotas indexáveis
  robots.txt
schemas/                JSON Schemas dos artefatos exportados
scripts/                automações de build e validação (Node + Playwright)
src/
  assets/               logos, thumbnails e imagens do DS
  components/
    ui/                 49 componentes base shadcn/ui
    charts/             BrandChart e ChartShowcase (ECharts)
    templates/          composições de template (auth, footer, sidebar, hub)
    bi/                 shell, filtros, KPIs, skeletons e seções dos painéis BI
    DSLayout.tsx        shell do portal (sidebar, header, tema, busca)
    DSComponents.tsx    PageHeader, SectionHeader, ComponentPreview, CodeBlock
    BrandLogo.tsx      marca institucional com variantes
    SEO.tsx             head tags por rota
  data/
    echarts/            tipos, registry e 74 presets de gráficos
    tokenGroups.ts      espelho tipado dos tokens usado pelo validador
  lib/
    echarts/            tema, formatação, exportação e empacotamento .zip
    bi/                 tipos, parser, classificador e agregações de BI
  pages/                páginas do portal, templates e modelos de BI
  index.css             fonte única de verdade dos design tokens
tailwind.config.ts      mapeia utilitários Tailwind para os tokens CSS
```

### 2.3 Aliases de import

O projeto usa o alias `@/` apontando para `src/`:

```tsx
import { Button } from "@/components/ui/button";
import { BrandChart } from "@/components/charts/BrandChart";
import { formatarNumero } from "@/lib/echarts/format";
import { CHART_PRESETS } from "@/data/echarts/registry";
```

### 2.4 Endpoints públicos

Servidos estaticamente a partir de `public/design-system/`:

| Endpoint | Conteúdo | Para que serve |
| --- | --- | --- |
| `/design-system/manifest.json` | Nome, versão, `generatedAt`, `source`, `usage`, `endpoints` e a lista de arquivos com bytes e SHA-256 | Ponto de entrada para consumo programático; permite verificar integridade e descobrir os demais endpoints |
| `/design-system/tokens.json` | Tokens no formato DTCG (`$type` / `$value`), raiz `brand` | Importação direta no Figma via Tokens Studio (Import → URL) |
| `/design-system/tokens.css` | Custom properties prontas para colar em qualquer projeto | Consumo em projetos sem Tailwind ou fora do React |
| `/design-system/tailwind.config.json` | Subconjunto do `theme` do Tailwind (darkMode, cores, tipografia, espaçamento) | Replicar a configuração Tailwind em outro repositório |
| `/design-system/components.json` | Manifesto de componentes com variantes, estados, tokens usados e URL de referência | Catálogo legível por máquina; mapeia cada componente para sua página no portal |

---

<a id="3-fundamentos"></a>
## 3. Fundamentos

### 3.1 Tipografia

Três famílias, carregadas em `src/index.css`:

| Família | Origem | Uso |
| --- | --- | --- |
| **__FONT_PRIMARY__** | Google Fonts (300–900) | Fonte primária: corpo, UI, H1 e H3 |
| **__FONT_SYSTEM__** | Google Fonts (SIL OFL), importada via `@import` com `display=swap` | Títulos H1–H6, display e apoio institucional; fallback automático para __FONT_PRIMARY__ |
| **__FONT_SYSTEM__** | Google Fonts (300/400/700/900) | Fonte sistêmica de apoio, alinhada ao portal __ORG_ROOT_DOMAIN__: legendas, microcopy e leitura prolongada |

Monoespaçada para `code` e `pre`: `'JetBrains Mono', 'Fira Code', monospace`.

**Escala de tamanhos (`--text-*`)**

| Token | Valor | px |
| --- | --- | --- |
| `--text-xs` | 0.8125rem | 13 |
| `--text-sm` | 0.9375rem | 15 |
| `--text-base` | 1.0625rem | 17 |
| `--text-lg` | 1.1875rem | 19 |
| `--text-xl` | 1.375rem | 22 |
| `--text-2xl` | 1.625rem | 26 |
| `--text-3xl` | 2rem | 32 |
| `--text-4xl` | 2.5rem | 40 |
| `--text-5xl` | 3.25rem | 52 |
| `--text-6xl` | 4rem | 64 |
| `--text-7xl` | 4.75rem | 76 |

**Alturas de linha pareadas (unitless)**

`--leading-xs` 1.55 · `--leading-sm` 1.6 · `--leading-base` 1.6 · `--leading-lg` 1.55 · `--leading-xl` 1.45 · `--leading-2xl` 1.35 · `--leading-3xl` 1.25 · `--leading-4xl` 1.2 · `--leading-5xl` 1.15 · `--leading-6xl` 1.1 · `--leading-7xl` 1.05.

Utilitárias: `--leading-tight` 1.2 · `--leading-snug` 1.35 · `--leading-normal` 1.6 · `--leading-relaxed` 1.75 · `--leading-loose` 1.9.

**Tracking**

`--tracking-tighter` -0.03em · `--tracking-tight` -0.015em · `--tracking-normal` 0em · `--tracking-wide` 0.02em · `--tracking-wider` 0.05em · `--tracking-widest` 0.12em.

**Pesos**

`--font-light` 300 · `--font-regular` 400 · `--font-medium` 500 · `--font-semibold` 600 · `--font-bold` 700 · `--font-extrabold` 800 (o utilitário `black` do Tailwind é 900 literal).

**Defaults de heading (base layer)**

| Tag | font-size | line-height | letter-spacing | weight |
| --- | --- | --- | --- | --- |
| h1 | 3rem | 1.1 | -0.025em | 900 |
| h2 | 2.25rem (sobrescrito por `--ds-heading-section-font-size`) | 1.15 | -0.022em | 700 |
| h3 | 1.875rem (sobrescrito por `--ds-heading-section-font-size`) | 1.2 | -0.02em | 700 |
| h4 | 1.5rem (sobrescrito por `--ds-heading-subsection-font-size`) | 1.25 | -0.015em | 600 |
| h5 | 1.25rem (sobrescrito por `--ds-heading-eyebrow-*`) | 1.3 | -0.01em | 600 |
| h6 | 1.125rem (sobrescrito por `--ds-heading-eyebrow-*`) | 1.35 | -0.005em | 600 |

Todo `h1` do DS herda a cor institucional `#005EB8`, aplicada globalmente em `@layer base`. Não sobrescreva com utilitários de cor — há validação de CI para isso.

**Classes tipográficas do DS** (camada `components`): `.ds-heading-section`, `.ds-heading-subsection`, `.ds-heading-eyebrow`, `.ds-body-lead`, `.ds-body`, `.ds-body-small`. São a forma canônica de tipografar títulos e parágrafos em cards e seções.

### 3.2 Cores

A paleta institucional parte da **marca oficial __BRAND_SHORT__ — Pantone 2935 C / HEX `#2A4FDA`**, expressa em HSL como `228 70% 51%` e exposta no token imutável `--brand-primary`.

- **Escala azul estendida:** `--brand-primary-50` a `--brand-primary-700`, com valores reajustados no dark mode para preservar contraste.
- **Acento secundário (ciano __BRAND_SHORT__):** `--brand-secondary-50` a `--brand-secondary-600` — o prefixo `orange` é um alias histórico mantido por compatibilidade; os valores são de ciano (matiz 196). `--brand-secondary` é alias direto de `--brand-primary`.
- **Complementares:** `--brand-comp-blue-light`, `--brand-comp-blue-mid`, `--brand-comp-yellow`, `--brand-comp-gold`, `--brand-comp-red`, `--brand-comp-indigo`, `--brand-comp-lime`.
- **Semânticas de feedback:** `success`, `warning`, `error`, `info`, cada uma com `-foreground` e `-bg`.
- **Superfícies:** `background`, `card`, `popover`, `muted`, `accent`, `border`, `input`, `ring`, além dos grupos `header-*` e `sidebar-*`.

### 3.3 Iconografia

Duas bibliotecas coexistem, ambas em SVG e coloridas por `currentColor`:

- **Lucide** (`lucide-react`) — biblioteca padrão da interface. Usada na navegação, ações e estados. Tamanho de referência 18px na sidebar (`<Home size={18} />`).
- **Remixicon** (`@remixicon/react`) — conjunto complementar, usado em contextos institucionais e em ícones não cobertos por Lucide.

Regra: ícone nunca é o único portador de significado; sempre acompanhe rótulo textual ou `aria-label`.

### 3.4 Grid e espaçamento

Escala base de 4px, exposta em `--space-*` e mapeada nos utilitários `p-*`, `m-*`, `gap-*` do Tailwind pelo bloco `theme.extend.spacing`.

Container: `.brand-container` = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Seção: `.brand-section` = `py-8 md:py-12`. O `container` do Tailwind é centralizado, com padding 2rem e teto de 1400px em `2xl`.

### 3.5 Elevação e sombras

Cinco níveis (`--shadow-xs` a `--shadow-xl`). No light mode as sombras usam tinta azul (`hsl(228 70% 30% / α)`), o que mantém a elevação alinhada à marca; no dark mode passam a preto puro com alfa maior. Cards do DS (`.brand-card`) usam `--shadow-sm` em repouso e `--shadow-lg` com `translateY(-2px)` no hover.

### 3.6 Motion

| Token | Valor |
| --- | --- |
| `--duration-fast` | 100ms |
| `--duration-normal` | 200ms |
| `--duration-slow` | 300ms |
| `--duration-slower` | 500ms |
| `--ease-default` | cubic-bezier(0.4, 0, 0.2, 1) |
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) |

Keyframes registrados no Tailwind: `accordion-down`, `accordion-up` (0.2s ease-out) e `fade-in` (0.3s ease-out, opacidade + `translateY(8px)`).

### 3.7 Responsividade

| Token | Valor | Breakpoint Tailwind |
| --- | --- | --- |
| `--bp-sm` | 640px | `sm:` |
| `--bp-md` | 768px | `md:` |
| `--bp-lg` | 1024px | `lg:` |
| `--bp-xl` | 1280px | `xl:` |
| — | 1400px | `2xl:` (apenas container) |

Abordagem mobile-first: o estilo base atende telas pequenas e os prefixos ampliam. Nenhuma página do DS pode apresentar overflow horizontal em 390px.

---

<a id="4-tokens"></a>
## 4. Tokens

Foram documentadas **194 CSS custom properties únicas**, das quais **66 são redefinidas no dark mode**.

### 4.1 Formato HSL sem vírgulas

Os tokens de cor guardam apenas os três componentes HSL separados por espaço, **sem** a função `hsl()` e **sem** vírgulas:

```css
--primary: 228 70% 51%;
```

O consumo sempre envolve o token na função `hsl()`, o que permite aplicar alfa por barra:

```css
color: hsl(var(--primary));
box-shadow: 0 0 0 4px hsl(var(--ring) / 0.18);
```

No Tailwind isso já está mapeado (`primary: "hsl(var(--primary))"`), então use as classes semânticas (`bg-primary`, `text-muted-foreground`, `border-border`) e nunca hexadecimais literais em componentes.

### 4.2 Cores de marca

| Token | Light | Dark | Uso recomendado |
| --- | --- | --- | --- |
| `--brand-primary` | 228 70% 51% | igual | Azul institucional imutável (#2A4FDA) |
| `--brand-secondary` | 228 70% 51% | igual | Alias legado; aponta para o azul institucional |
| `--brand-primary-50` | 228 90% 97% | 228 40% 14% | Fundo de destaque muito leve |
| `--brand-primary-100` | 228 85% 92% | 228 45% 20% | Fundo de chip/badge |
| `--brand-primary-200` | 228 80% 82% | 228 50% 30% | Bordas de realce |
| `--brand-primary-300` | 228 75% 70% | 228 60% 45% | Estados hover suaves |
| `--brand-primary-400` | 228 72% 60% | 228 70% 55% | Ícones sobre fundo claro |
| `--brand-primary-500` | 228 70% 51% | 228 75% 65% | Cor de marca aplicada |
| `--brand-primary-600` | 228 72% 42% | 228 78% 75% | Hover de superfícies azuis |
| `--brand-primary-700` | 228 75% 32% | 228 80% 85% | Texto sobre azul claro |
| `--brand-secondary-50` | 196 90% 96% | 196 40% 14% | Fundo do acento ciano |
| `--brand-secondary-100` | 196 88% 88% | 196 45% 20% | Chip do acento ciano |
| `--brand-secondary-200` | 196 85% 75% | 196 55% 30% | Borda do acento |
| `--brand-secondary-300` | 196 82% 60% | 196 65% 45% | Hover do acento |
| `--brand-secondary-400` | 196 82% 48% | 196 75% 55% | Ícone do acento |
| `--brand-secondary-500` | 196 85% 40% | 196 80% 65% | Acento aplicado |
| `--brand-secondary-600` | 196 88% 30% | 196 85% 75% | Texto sobre acento claro |
| `--brand-comp-blue-light` | 228 90% 88% | igual | Série de gráfico / fundo suave |
| `--brand-comp-blue-mid` | 228 70% 65% | igual | Série categórica (10ª cor da paleta) |
| `--brand-comp-yellow` | 46 98% 60% | igual | Destaque pontual |
| `--brand-comp-gold` | 42 90% 55% | igual | Série categórica (8ª cor) |
| `--brand-comp-red` | 0 78% 52% | igual | Alerta gráfico |
| `--brand-comp-indigo` | 245 75% 55% | igual | Série categórica (7ª cor) |
| `--brand-comp-lime` | 152 70% 45% | igual | Série categórica (9ª cor) |
| `--brand-btn-fg` | 71 85% 79% | igual | Texto de botão sobre azul institucional |
| `--brand-btn-hover` | 226 78% 40% | igual | Hover do botão institucional |

### 4.3 Cores semânticas de superfície

| Token | Light | Dark | Uso recomendado |
| --- | --- | --- | --- |
| `--background` | 210 25% 99% | 210 25% 8% | Fundo da página |
| `--foreground` | 228 60% 12% | 210 20% 90% | Texto principal |
| `--card` | 0 0% 100% | 210 22% 12% | Superfície de card |
| `--card-foreground` | 228 60% 12% | 210 20% 90% | Texto em card |
| `--popover` | 0 0% 100% | 210 22% 12% | Superfície flutuante |
| `--popover-foreground` | 228 60% 12% | 210 20% 90% | Texto em popover |
| `--primary` | 228 70% 51% | 228 75% 62% | Ação principal, links, foco |
| `--primary-foreground` | 0 0% 100% | 0 0% 100% | Texto sobre primary |
| `--secondary` | 196 85% 45% | 196 80% 55% | Ação secundária, acento ciano |
| `--secondary-foreground` | 0 0% 100% | 0 0% 100% | Texto sobre secondary |
| `--muted` | 220 15% 94% | 210 18% 18% | Fundo neutro, linhas zebradas |
| `--muted-foreground` | 228 12% 42% | 210 15% 60% | Texto de apoio, legendas |
| `--accent` | 228 90% 96% | 228 50% 22% | Realce de item ativo |
| `--accent-foreground` | 228 70% 25% | 228 60% 85% | Texto sobre accent |
| `--card-icon` | 196 83% 46% | 196 83% 46% | Superfície de ícone em card |
| `--card-icon-foreground` | 0 0% 100% | 0 0% 100% | Glifo dentro do ícone |
| `--destructive` | 0 78% 52% | 0 72% 58% | Ação destrutiva |
| `--destructive-foreground` | 0 0% 100% | 0 0% 100% | Texto sobre destrutivo |
| `--border` | 220 18% 88% | 210 18% 22% | Bordas gerais |
| `--input` | 220 18% 88% | 210 18% 22% | Borda de campo |
| `--ring` | 228 70% 51% | 228 75% 62% | Anel de foco visível |

### 4.4 Cores de feedback

| Token | Light | Dark | Uso recomendado |
| --- | --- | --- | --- |
| `--success` | 145 63% 32% | 145 55% 42% | Estado positivo |
| `--success-foreground` | 0 0% 100% | 0 0% 100% | Texto sobre sucesso |
| `--success-bg` | 145 50% 95% | 145 30% 14% | Fundo de alerta positivo |
| `--warning` | 38 92% 50% | 38 88% 58% | Atenção |
| `--warning-foreground` | 38 90% 18% | 38 90% 88% | Texto sobre atenção |
| `--warning-bg` | 38 90% 95% | 38 50% 14% | Fundo de alerta de atenção |
| `--error` | 0 78% 52% | 0 72% 58% | Erro |
| `--error-foreground` | 0 0% 100% | 0 0% 100% | Texto sobre erro |
| `--error-bg` | 0 70% 96% | 0 40% 14% | Fundo de alerta de erro |
| `--info` | 228 70% 60% | 228 70% 65% | Informação |
| `--info-foreground` | 0 0% 100% | 0 0% 100% | Texto sobre informação |
| `--info-bg` | 228 90% 96% | 228 45% 16% | Fundo de alerta informativo |

### 4.5 Header e sidebar

| Token | Light | Dark | Uso recomendado |
| --- | --- | --- | --- |
| `--header-background` | 228 70% 51% | — | Header sólido institucional |
| `--header-surface` | 227 100% 97% | herdado do bloco dark | Barra superior clara (#F1F4FF) |
| `--header-surface-foreground` | 228 70% 42% | herdado | Texto/ícones da barra |
| `--header-surface-border` | 220 18% 88% | herdado | Divisor inferior da barra |
| `--sidebar-background` | 228 72% 42% | valor dark próprio | Fundo do menu lateral |
| `--sidebar-foreground` | 228 30% 95% | 210 20% 90% (grupo dark) | Texto do menu |
| `--sidebar-primary` | 0 0% 100% | valor dark próprio | Item ativo |
| `--sidebar-primary-foreground` | 228 70% 35% | 0 0% 100% | Texto do item ativo |
| `--sidebar-accent` | 228 75% 35% | 210 22% 14% | Hover de item |
| `--sidebar-accent-foreground` | 0 0% 100% | 210 20% 90% | Texto no hover |
| `--sidebar-border` | 228 60% 30% | 210 18% 16% | Divisores internos |
| `--sidebar-ring` | 196 85% 50% | 196 80% 55% | Foco dentro da sidebar |
| `--sidebar-muted` | 228 25% 75% | 210 15% 50% | Rótulos secundários |

### 4.6 Header Degradê Novo __BRAND_SHORT__

| Token | Valor | Uso recomendado |
| --- | --- | --- |
| `--brand-header-grad-start` | `#053665` | Início do gradiente (90deg) |
| `--brand-header-grad-end` | `#05549e` | Fim do gradiente |
| `--brand-header-height` | 135px | Altura do banner |
| `--brand-header-px` | `var(--space-8)` | Padding horizontal |
| `--brand-header-py` | `var(--space-5)` | Padding vertical |
| `--brand-header-gap` | `var(--space-6)` | Espaço entre blocos |
| `--brand-header-divider` | `rgba(255,255,255,0.4)` | Divisor vertical |
| `--brand-header-divider-h` | 60px | Altura do divisor |
| `--brand-header-title-fs` | 1.6875rem (27px) | Título do header |
| `--brand-header-title-color` | `rgba(255,255,255,0.92)` | Cor do título |
| `--brand-header-label-fs` | `var(--text-xs)` | Rótulo dos widgets |
| `--brand-header-label-color` | `rgba(255,255,255,0.75)` | Cor do rótulo |
| `--brand-header-value-fs` | `var(--text-sm)` | Valor dos widgets |
| `--brand-header-logo-h` | 57.5px | Altura da marca no header |

### 4.7 Espaçamento

| Token | Valor | px |
| --- | --- | --- |
| `--space-0` | 0 | 0 |
| `--space-px` | 1px | 1 |
| `--space-0-5` | 0.125rem | 2 |
| `--space-1` | 0.25rem | 4 |
| `--space-1-5` | 0.375rem | 6 |
| `--space-2` | 0.5rem | 8 |
| `--space-3` | 0.75rem | 12 |
| `--space-4` | 1rem | 16 |
| `--space-5` | 1.25rem | 20 |
| `--space-6` | 1.5rem | 24 |
| `--space-8` | 2rem | 32 |
| `--space-10` | 2.5rem | 40 |
| `--space-12` | 3rem | 48 |
| `--space-14` | 3.5rem | 56 |
| `--space-16` | 4rem | 64 |
| `--space-20` | 5rem | 80 |
| `--space-24` | 6rem | 96 |
| `--space-32` | 8rem | 128 |

Uso: `--space-2`/`--space-3` para padding interno de controles, `--space-4`/`--space-6` para gaps de grid, `--space-8` e acima para respiro entre seções.

### 4.8 Tipografia (tokens)

Além de `--text-*`, `--leading-*`, `--tracking-*` e `--font-*` (tabelados na seção 3.1), existem os tokens de composição:

| Token | Valor | Uso recomendado |
| --- | --- | --- |
| `--ds-heading-section-font-size` | 1.5rem | Título de seção/card (H2, H3) |
| `--ds-heading-section-line-height` | 2rem | Idem |
| `--ds-heading-section-min-height` | 2rem | Alinha títulos em grid |
| `--ds-heading-section-font-weight` | 700 | Idem |
| `--ds-heading-subsection-font-size` | 1.125rem | Subtítulo interno (H4) |
| `--ds-heading-subsection-line-height` | 1.5rem | Idem |
| `--ds-heading-subsection-min-height` | 1.5rem | Idem |
| `--ds-heading-subsection-font-weight` | 700 | Idem |
| `--ds-heading-eyebrow-font-size` | 0.6875rem | Rótulo/eyebrow (H5, H6) |
| `--ds-heading-eyebrow-line-height` | 1rem | Idem |
| `--ds-heading-eyebrow-min-height` | 1rem | Idem |
| `--ds-heading-eyebrow-font-weight` | 700 | Idem |
| `--ds-heading-eyebrow-letter-spacing` | 0.08em | Idem, com `text-transform: uppercase` |
| `--ds-body-lead-font-size` | 1.125rem | Parágrafo de abertura |
| `--ds-body-lead-line-height` | 1.75rem | Idem |
| `--ds-body-lead-font-weight` | 400 | Idem |
| `--ds-body-font-size` | 1rem | Parágrafo padrão (default global de `p`) |
| `--ds-body-line-height` | 1.5rem | Idem |
| `--ds-body-font-weight` | 400 | Idem |
| `--ds-body-small-font-size` | 0.875rem | Texto de apoio |
| `--ds-body-small-line-height` | 1.25rem | Idem |
| `--ds-body-small-font-weight` | 400 | Idem |

### 4.9 Sombras

| Token | Light | Dark |
| --- | --- | --- |
| `--shadow-xs` | `0 1px 2px 0 hsl(228 70% 30% / 0.05)` | `0 1px 2px 0 hsl(0 0% 0% / 0.15)` |
| `--shadow-sm` | `0 1px 3px 0 hsl(228 70% 30% / 0.07), 0 1px 2px -1px hsl(228 70% 30% / 0.06)` | `0 1px 3px 0 hsl(0 0% 0% / 0.2), 0 1px 2px -1px hsl(0 0% 0% / 0.15)` |
| `--shadow-md` | `0 4px 6px -1px hsl(228 70% 30% / 0.08), 0 2px 4px -2px hsl(228 70% 30% / 0.05)` | `0 4px 6px -1px hsl(0 0% 0% / 0.25), 0 2px 4px -2px hsl(0 0% 0% / 0.15)` |
| `--shadow-lg` | `0 10px 15px -3px hsl(228 70% 30% / 0.09), 0 4px 6px -4px hsl(228 70% 30% / 0.05)` | `0 10px 15px -3px hsl(0 0% 0% / 0.3), 0 4px 6px -4px hsl(0 0% 0% / 0.15)` |
| `--shadow-xl` | `0 20px 25px -5px hsl(228 70% 30% / 0.12), 0 8px 10px -6px hsl(228 70% 30% / 0.05)` | `0 20px 25px -5px hsl(0 0% 0% / 0.35), 0 8px 10px -6px hsl(0 0% 0% / 0.15)` |

Uso: `xs` para separadores sutis, `sm` para cards em repouso, `md` para elementos ativos, `lg` para hover de card, `xl` para modais e overlays.

### 4.10 Raio de borda

| Token | Valor | Uso recomendado |
| --- | --- | --- |
| `--radius` | 0.375rem | Raio base consumido pelo Tailwind (`rounded-lg`) |
| `--radius-sm` | 0.25rem | Chips e badges retangulares |
| `--radius-md` | 0.375rem | Botões, inputs |
| `--radius-lg` | 0.5rem | Cards |
| `--radius-xl` | 0.75rem | Painéis e blocos de destaque |
| `--radius-2xl` | 1rem | Superfícies grandes, modais |
| `--radius-full` | 9999px | Pílulas, avatares |

### 4.11 Z-index

| Token | Valor | Uso recomendado |
| --- | --- | --- |
| `--z-dropdown` | 100 | Menus suspensos, selects |
| `--z-sticky` | 200 | Headers e barras fixas |
| `--z-overlay` | 300 | Overlays e tooltips sobre conteúdo |
| `--z-modal` | 400 | Diálogos e sheets |
| `--z-toast` | 500 | Notificações (topo da pilha) |

### 4.12 Breakpoints e motion

Tabelados nas seções 3.6 e 3.7 (`--bp-sm`, `--bp-md`, `--bp-lg`, `--bp-xl`; `--duration-*` e `--ease-*`).

---

<a id="5-componentes"></a>
## 5. Componentes

A biblioteca tem **49 componentes base shadcn/ui** em `src/components/ui/` e **30 entradas documentadas** na página `/componentes` (menu Componentes do `DSLayout`). Componentes que não vêm do shadcn/ui são composições próprias do __BRAND_NAME__, construídas sobre os primitivos e os tokens.

### 5.1 Tabela geral

| # | Componente | Âncora | Origem | Para que serve |
| --- | --- | --- | --- | --- |
| 1 | Botão | `/componentes#botao` | shadcn/ui (`button`) | Ações primárias, secundárias e terciárias |
| 2 | Campo de Texto | `#input` | shadcn/ui (`input`) | Entrada de texto de uma linha |
| 3 | Select | `#select` | shadcn/ui (`select`, Radix) | Escolha única em lista |
| 4 | Checkbox e Radio | `#checkbox` | shadcn/ui (`checkbox`, `radio-group`) | Seleção múltipla e exclusiva |
| 5 | Switch | `#switch` | shadcn/ui (`switch`) | Liga/desliga com efeito imediato |
| 6 | Badge / Tag | `#badge` | shadcn/ui (`badge`) + classes `.brand-badge-*` | Rótulo de status ou categoria |
| 7 | Alert | `#alert` | shadcn/ui (`alert`) | Mensagem contextual persistente |
| 8 | Card | `#card` | shadcn/ui (`card`) + `.brand-card` | Agrupamento de conteúdo |
| 9 | Tabela | `#tabela` | shadcn/ui (`table`) | Dados tabulares |
| 10 | Accordion | `#accordion` | shadcn/ui (`accordion`) | Conteúdo expansível |
| 11 | Tabs | `#tabs` | shadcn/ui (`tabs`) | Alternância entre visões |
| 12 | Modal | `#modal` | shadcn/ui (`dialog`) | Interação bloqueante |
| 13 | Toast | `#toast` | shadcn/ui (`toast`) e `sonner` | Notificação transitória |
| 14 | Breadcrumb | `#breadcrumb` | shadcn/ui (`breadcrumb`) | Localização na hierarquia |
| 15 | Paginação | `#paginacao` | shadcn/ui (`pagination`) | Navegação entre páginas de dados |
| 16 | Tooltip | `#tooltip` | shadcn/ui (`tooltip`) | Explicação curta no hover/foco |
| 17 | Skeleton | `#skeleton` | shadcn/ui (`skeleton`) | Placeholder de carregamento |
| 18 | Spinner | `#spinner` | Composição __BRAND_NAME__ | Carregamento indeterminado |
| 19 | Empty State | `#empty-state` | Composição __BRAND_NAME__ | Ausência de dados com ação de saída |
| 20 | Dropdown Menu | `#dropdown` | shadcn/ui (`dropdown-menu`) | Menu de ações |
| 21 | Menu Kebab | `#menu-kebab` | Composição __BRAND_NAME__ sobre `dropdown-menu` | Ações por linha de tabela |
| 22 | DatePicker | `#datepicker` | shadcn/ui (`calendar` + `popover`) | Seleção de data no formato DD/MM/AAAA |
| 23 | Filtros Dinâmicos | `#filtros` | Composição __BRAND_NAME__ | Conjunto de filtros persistidos na URL |
| 24 | Big Numbers / KPIs | `#big-numbers` | Composição __BRAND_NAME__ | Indicador principal com variação |
| 25 | Upload em Massa | `#upload` | Composição __BRAND_NAME__ | Envio de planilhas e arquivos |
| 26 | Stepper (Etapas) | `#steps` | Composição __BRAND_NAME__ | Progresso em fluxo multietapas |
| 27 | Lista Descritiva | `#lista-descritiva` | Composição __BRAND_NAME__ | Pares rótulo/valor |
| 28 | Cards de Estatísticas | `#stats` | Composição __BRAND_NAME__ | Painel compacto de números |
| 29 | Métricas | `#metricas` | Composição __BRAND_NAME__ | Métricas com sparkline SVG |
| 30 | Gráficos | `#graficos` | Composição __BRAND_NAME__ (Recharts/ECharts) | Visualização embutida em página |

Demais primitivos disponíveis em `src/components/ui/` e não documentados individualmente na página: `alert-dialog`, `aspect-ratio`, `avatar`, `carousel`, `chart`, `collapsible`, `command`, `context-menu`, `drawer`, `form`, `hover-card`, `input-otp`, `label`, `menubar`, `navigation-menu`, `popover`, `progress`, `resizable`, `scroll-area`, `separator`, `sheet`, `sidebar`, `slider`, `sonner`, `textarea`, `toaster`, `toggle`, `toggle-group`.

### 5.2 Composições próprias do __BRAND_NAME__

| Componente | Arquivo | Papel |
| --- | --- | --- |
| `DSLayout` | `src/components/DSLayout.tsx` | Shell do portal: sidebar de três níveis, busca com navegação por teclado, colapso, drawer mobile e alternância de tema |
| `PageHeader` | `src/components/DSComponents.tsx` | Cabeçalho de página com `badge`, `title` e `description` |
| `SectionHeader` | `src/components/DSComponents.tsx` | Cabeçalho de seção com âncora `id` |
| `ComponentPreview` | `src/components/DSComponents.tsx` | Container de demonstração com abas de código |
| `CodeBlock` | `src/components/DSComponents.tsx` | Bloco de código copiável com rótulo de linguagem |
| `BrandLogo` | `src/components/BrandLogo.tsx` | Marca institucional com variantes de cor |
| `SEO` | `src/components/SEO.tsx` | `title`, `description`, canonical, Open Graph, Twitter e JSON-LD por rota |
| `BrandChart` | `src/components/charts/BrandChart.tsx` | Wrapper oficial do ECharts |
| `ChartShowcase` | `src/components/charts/ChartShowcase.tsx` | Card de exibição de preset com código e download |
| `TokenExplorer` | `src/components/TokenExplorer.tsx` | Navegação e busca nos grupos de tokens |
| `ColorSection`, `GridSection`, `ChartsSection`, `FontFamilyCard`, `BrazilMap` | `src/components/` | Blocos de conteúdo das páginas de fundamentos |
| `RouteLoadingFallback` | `src/components/RouteLoadingFallback.tsx` | Fallback de `Suspense` nas rotas lazy |
| `NavLink` | `src/components/NavLink.tsx` | Link de navegação com estado ativo |
| Templates | `src/components/templates/` | `AuthTemplates`, `CardSignIn`, `DashboardTemplates`, `FooterTemplate`, `HubPaineisTemplate`, `SidebarMenuPreview` |
| BI | `src/components/bi/` | `BISidebar`, `BIHeaderFilters`, `IndicatorCard`, `BISkeletons` e oito seções de painel |

### 5.3 Exemplos de código

Botão e badge:

```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

<Button variant="default">Quero me inscrever</Button>
<Button variant="outline">Cancelar</Button>
<Badge variant="secondary">Em análise</Badge>
```

Cabeçalhos do DS (sempre com badge antes do título):

```tsx
import { PageHeader, SectionHeader } from "@/components/DSComponents";

<PageHeader
  badge="Webwriting"
  title="Webwriting"
  description="Técnicas de escrita e formatação para a leitura online."
/>
<SectionHeader
  id="principios"
  title="Princípios do Webwriting"
  description="Boas práticas que orientam a escrita digital do __BRAND_NAME__."
/>
```

Marca:

```tsx
import { BrandLogo } from "@/components/BrandLogo";

<BrandLogo variant="auto" width={120} height={64} />
<BrandLogo variant="white" width={100} height={56} opacity={0.4} />
```

`variant`: `auto` (cor no light, branca no dark), `color`, `white`, `mono`. Demais props: `width` (100), `height` (80), `opacity`, `centered` (true), `className`, `alt` ("__BRAND_NAME__").

Select e tabela shadcn (padrão obrigatório — não use `<select>` nem `<table>` nativos):

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Select value={valor} onValueChange={setValor}>
  <SelectTrigger><SelectValue placeholder="Todas as macrorregiões" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="__todos__">Todas</SelectItem>
    <SelectItem value="vale-do-sul">Vale do Sul</SelectItem>
  </SelectContent>
</Select>
```

SEO por rota:

```tsx
import { SEO } from "@/components/SEO";

<SEO
  title="Tokens — Design System __BRAND_SHORT__"
  description="Design tokens de cor, tipografia, espaçamento, sombras e breakpoints."
  path="/tokens"
/>
```

---

<a id="6-templates"></a>
## 6. Templates

São **13 templates de tela** com rota própria, todos renderizados fora do `DSLayout` (standalone, em tela cheia) e catalogados em `/templates`.

### Dashboard Institucional — `/templates/dashboard-institucional`
Objetivo: painel consolidado de programas e indicadores para público interno.
- Header institucional com marca completa e alternância de tema
- Menu lateral do DS, colapsável, iniciando fechado
- Faixa de KPIs e blocos de gráficos
- Rodapé institucional
Quando usar: visão executiva de acompanhamento contínuo.

### Dashboard BI — `/templates/dashboard-bi`
Objetivo: painel analítico no padrão Power BI, com tokens do DS.
- Sidebar de seções, drawer sobreposto no mobile
- Filtros globais no topo
- KPIs, gráficos e tabelas com skeletons de carregamento e paginação
Quando usar: análise exploratória com muitos recortes.

### Dashboard Analítico — `/templates/dashboard-analitico`
Objetivo: painel analítico moderno construído sobre a biblioteca ECharts.
- Header institucional tokenizado e sidebar/drawer responsivo
- Filtros funcionais que recalculam os dados
- Faixa de KPIs e quatro gráficos ECharts
- Exportação CSV, skeletons, `SEO` e `h1` em `sr-only`
Quando usar: painéis novos que precisem da biblioteca ECharts do DS.

### Tela BI — `/templates/tela-bi`
Objetivo: shell completo de inteligência comercial com dados carregáveis.
- `BIDataProvider` com registros do seed e filtros globais
- Header sticky de 64px com contador vivo de registros e botão de tema
- `BISidebar` com oito seções: Visão Geral, Empresas, Atendimentos, Oportunidades, Regiões, Qualidade, Importar Planilha e Configurações
- Filtros globais em todas as seções exceto Importar e Configurações
- Gráficos ECharts, tabelas shadcn e importação de planilha via `xlsx`
Quando usar: produto de BI operacional com ingestão de dados pelo próprio usuário.

### Tela de Listagem — `/templates/tela-listagem`
Objetivo: listagem paginada de registros.
- Cabeçalho com ação primária
- Filtros dinâmicos persistidos na URL (`useSearchParams`)
- Tabela com ordenação, menu kebab por linha e paginação
Quando usar: qualquer CRUD de consulta.

### Tela de Formulário — `/templates/tela-formulario`
Objetivo: cadastro ou edição institucional.
- Formulário em seções com `label` associado
- Validação e mensagens de erro objetivas
- Barra de ações fixa (salvar/cancelar)
Quando usar: entrada estruturada de dados.

### Página com Filtros e Tabela — `/templates/pagina-filtros-tabela`
Objetivo: consulta com filtros laterais.
- Sidebar de filtros colapsável espelhando o Dashboard Institucional
- Tabela principal com contadores de resultado
Quando usar: bases grandes com muitos recortes simultâneos.

### Página de Autenticação — `/templates/pagina-autenticacao`
Objetivo: login institucional.
- Coluna de imagem com empreendedora __BRAND_SHORT__ e o slogan "__BRAND_SLOGAN__"
- Coluna de formulário com e-mail, senha e recuperação
- Marca __BRAND_SHORT__ centralizada abaixo do botão de ajuda, com 40% de opacidade
Quando usar: entrada de qualquer produto autenticado.

### Cadastro — `/templates/cadastro`
Objetivo: criação de conta.
- Campos de identificação, contato e senha com requisitos visíveis
- Aceite de termos
Quando usar: autosserviço de novos usuários.

### Autenticação 2FA — `/templates/autenticacao-2fa`
Objetivo: segundo fator.
- Campo OTP segmentado (`input-otp`), contagem de reenvio e rota de recuperação
Quando usar: produtos com dado sensível.

### Modal de Acesso — `/templates/modal-acesso`
Objetivo: autenticação sem sair do contexto.
- Diálogo com formulário completo, alternância entre entrar e cadastrar
Quando usar: paywall leve ou ação que exige login pontual.

### Página de Erro — `/templates/pagina-erro`
Objetivo: estado de erro/404 no padrão do DS.
- Marca __BRAND_SHORT__, código do erro, explicação e caminhos de retorno
Quando usar: rotas inexistentes e falhas tratadas.

### Radar Estratégico (template) — `/templates/radar-estrategico`
Objetivo: painel executivo em estilo Power BI.
- Header "Composição visual (negócios)" sem título
- Blocos de faróis, indicadores e séries temporais
- Download do modelo em `.zip` (React e vanilla) via `jszip`
Quando usar: acompanhamento estratégico por semáforos.

**Composições de template reutilizáveis:** `AuthTemplates`, `CardSignIn`, `DashboardTemplates`, `FooterTemplate` (variantes Claro, Escuro e Compacto, com marca "__BRAND_SHORT__ | Nome do Projeto" e versão à direita), `HubPaineisTemplate` e `SidebarMenuPreview`.

**Variantes de header documentadas em `/templates#header`:** Header Institucional (56px), Composição visual (negócios) com banner de 112px e menu `#123148`, Degradê Novo __BRAND_SHORT__ (135px, gradiente `linear-gradient(90deg, #053665 0%, #05549e 100%)`, marca à esquerda e widgets de última/próxima atualização à direita) e as variantes de Testeira · Aplicação de arte com fundos `#16329C`, `#2A4FDA` e branco. O Degradê Novo __BRAND_SHORT__ tem documentação dedicada em `/componentes/header-degrade/docs` e playground de tokens em `/componentes/header-degrade/playground`.

---

<a id="7-modelos-de-bi"></a>
## 7. Modelos de BI

Hub em `/modelos-bi`, com cards de acesso a cada painel.

| Modelo | Rota | Status |
| --- | --- | --- |
| Radar Estratégico — hub | `/modelos-bi/radar-estrategico` | Publicado. Página dentro do `DSLayout` com acesso às versões BI e Docs |
| Radar Estratégico — BI v1.0 | `/modelos-bi/radar-estrategico/bi` | Publicado, standalone. Painel executivo com Recharts, header Degradê Novo __BRAND_SHORT__ e download do modelo em `.zip` |
| Radar Estratégico — Docs v1.0 | `/modelos-bi/radar-estrategico/docs` | Publicado. Documentação técnica, estrutura de dados e medidas DAX |
| Mapeamento Power BI | `/modelos-bi/mapeamento` | Publicado. Passo a passo para reproduzir tokens e componentes no visual HTML Content, com exemplos DAX baseados no Radar Estratégico |
| Planejamento — BI | `/modelos-bi/planeja` | Placeholder (`BIPlaceholderPage`), aguardando definição de indicadores |
| MPI — BI (Monitoramento da Performance das Iniciativas) | `/modelos-bi/mpi` | Placeholder (`BIPlaceholderPage`), aguardando definição de indicadores |
| Gestão de Pessoas — BI | `/modelos-bi/gestao-pessoas` | Publicado, standalone. AppBar, abas, legenda, filtros funcionais, seis KPIs e blocos de composição, saúde e capacitação, validado em 1440px, 768px e 390px |

Arquivos HTML de apoio para Power BI: `public/radar-estrategico-powerbi.html` e `public/radar-estrategico-powerbi-template.html`.

---

<a id="8-graficos"></a>
## 8. Gráficos

O DS mantém duas bibliotecas de visualização, com papéis distintos.

### 8.1 Recharts

Onde vive: usada diretamente nas páginas de painel mais antigas — `src/pages/RadarEstrategicoPage.tsx`, `src/pages/modelos-bi/GestaoPessoasPage.tsx` e `src/components/ChartsSection.tsx`.

Quando usar: manutenção dos painéis existentes que já a adotam, ou gráficos simples embutidos em página React sem necessidade de exportação. Para telas novas, prefira ECharts.

### 8.2 ECharts

Seção `/graficos`, baseada em Apache ECharts 5, com tema oficial derivado dos tokens.

**Tema.** `src/lib/echarts/brandTheme.ts` registra dois temas, `brand-light` e `brand-dark` (`BRAND_THEME_NAMES`), construídos por `buildBrandTheme(mode)`. Todas as cores vêm de `readToken()`, que lê as CSS custom properties em tempo de execução — não há hexadecimal fixo. O tema define `color`, `backgroundColor` transparente, `textStyle`, `title`, `legend`, `tooltip`, `axisPointer`, `grid`, `categoryAxis`, `valueAxis` e `toolbox`.

**BRAND_PALETTE.** Paleta categórica de 10 cores, sempre resolvida de tokens (`BRAND_PALETTE_TOKENS`):

| Ordem | Token | Nome |
| --- | --- | --- |
| 1 | `--primary` | Primária |
| 2 | `--secondary` | Secundária |
| 3 | `--success` | Sucesso |
| 4 | `--warning` | Atenção |
| 5 | `--error` | Erro |
| 6 | `--info` | Informação |
| 7 | `--brand-comp-indigo` | Indigo complementar |
| 8 | `--brand-comp-gold` | Dourado complementar |
| 9 | `--brand-comp-lime` | Verde-limão complementar |
| 10 | `--brand-comp-blue-mid` | Azul médio complementar |

`BRAND_PALETTE` é o array resolvido no import; use `getBrandPalette()` para obter os valores atualizados após troca de tema.

**BRAND_PALETTE_ESTENDIDA.** Paleta de 19 cores para visualizações que exigem muitos matizes simultâneos (sunburst, treemap, sankey, grafos, árvores, themeRiver, pizza com muitas fatias e coordenadas paralelas). As **10 primeiras são exatamente as cores de `BRAND_PALETTE`**, na mesma ordem; as **9 seguintes** vêm do tema oficial do Apache ECharts 5 e estão expostas em `ECHARTS_PALETTE_COMPLEMENTAR`, uso autorizado pelo __BRAND_NAME__ apenas nesses casos:

| Ordem | Hex | Origem |
| --- | --- | --- |
| 11 | `#5470c6` | Tema padrão Apache ECharts 5 |
| 12 | `#91cc75` | Tema padrão Apache ECharts 5 |
| 13 | `#fac858` | Tema padrão Apache ECharts 5 |
| 14 | `#ee6666` | Tema padrão Apache ECharts 5 |
| 15 | `#73c0de` | Tema padrão Apache ECharts 5 |
| 16 | `#3ba272` | Tema padrão Apache ECharts 5 |
| 17 | `#fc8452` | Tema padrão Apache ECharts 5 |
| 18 | `#9a60b4` | Tema padrão Apache ECharts 5 |
| 19 | `#ea7ccc` | Tema padrão Apache ECharts 5 |

Use `getBrandPaletteEstendida()` para obter os valores atualizados após troca de tema. Gráficos que não precisam de mais de 10 séries continuam em `BRAND_PALETTE`.

**Escalas contínuas para `visualMap`.** Derivadas de tokens, funcionam em light e dark:

| Constante | Getter | Composição | Uso |
| --- | --- | --- | --- |
| `BRAND_SCALE_SEQUENCIAL` | `getBrandScaleSequencial()` | 4 passos de `--primary` com alpha crescente (0.12 → 1) | Heatmaps, calendários e mapas de intensidade |
| `BRAND_SCALE_DIVERGENTE` | `getBrandScaleDivergente()` | `--error` → neutro (`--muted-foreground`) → `--success` | Desvios em relação a uma referência, variações positivas e negativas |

**Componente `BrandChart`** (`src/components/charts/BrandChart.tsx`). Inicializa o ECharts com o tema correto conforme `useTheme()`, é responsivo por `ResizeObserver`, desabilita animação quando `prefers-reduced-motion: reduce` e expõe a instância por ref.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `option` | `EChartsOption` | — | Configuração do gráfico |
| `ariaLabel` | `string` | — | **Obrigatório.** Descrição textual para leitores de tela; também renderizada em `sr-only` |
| `height` | `number \| string` | `340` | Altura do container |
| `className` | `string` | — | Classes adicionais do wrapper |
| `loading` | `boolean` | `false` | Exibe o loading nativo do ECharts ("Carregando…") |
| `notMerge` | `boolean` | `true` | Encaminhado ao `setOption` |
| `onEvents` | `Record<string, (params: unknown) => void>` | — | Handlers registrados via `chart.on` |
| `group` | `string` | — | Grupo para sincronizar tooltips com `echarts.connect` |

Ref: `BrandChartHandle` com `getInstance(): ECharts | null` — usada para exportar PNG/SVG.

**Helpers de formatação** (`src/lib/echarts/format.ts`), padrão pt-BR (milhar com ponto, decimal com vírgula), retornando `"—"` para valores inválidos:

| Função | Assinatura | Exemplo |
| --- | --- | --- |
| `formatarNumero` | `(valor, decimais = 0)` | `12345.6` → `"12.346"` |
| `formatarMoeda` | `(valor, decimais = 2)` | `1234.5` → `"R$ 1.234,50"` |
| `formatarPercentual` | `(valor, decimais = 1)` | `42.35` → `"42,4%"` |

Utilitários complementares: `src/lib/echarts/exportPreset.ts` (exportação de um preset em JSON e TypeScript) e `src/lib/echarts/buildLibraryZip.ts` (montagem dos pacotes `.zip` da Central de Downloads, tudo no cliente).

#### Regra de cor obrigatória

O parser de cor do ECharts (zrender) **NÃO entende** a sintaxe CSS Color 4 `hsl(228 70% 51%)` nem `hsl(... / 0.2)`, com espaços e barra. Ele entende `rgb()`, `rgba()`, hex e o HSL antigo com vírgulas.

O canvas do navegador aceita a sintaxe moderna, então a cor base aparece corretamente e o problema passa despercebido. Ele só se manifesta quando o ECharts precisa **derivar** uma cor a partir da base — é o que acontece no estado `emphasis` do hover: o parse falha e o elemento fica transparente ou pisca.

Por isso `readToken` converte HSL para RGB e devolve sempre `rgb()`/`rgba()`. **Nenhuma cor entregue ao ECharts pode sair em `hsl()` com espaços** — isso vale para `itemStyle`, `areaStyle`, `lineStyle`, gradientes com `echarts.graphic.LinearGradient`, sombras e `visualMap.inRange.color`. A única exceção é `tooltip.extraCssText`, que é CSS puro interpretado pelo navegador.

Ao criar um preset novo, use sempre `readToken`, `BRAND_PALETTE`, `BRAND_PALETTE_ESTENDIDA` ou as escalas do tema — nunca monte string de cor à mão.

### 8.3 Categorias e presets

São **74 presets** distribuídos em **7 categorias**, registrados em `src/data/echarts/registry.ts`. Cada preset é um arquivo `src/data/echarts/presets/<categoria>/<id>.ts` que exporta um `ChartPreset` completo (id, nome, categoria, descrição, tags, `option`, snippet React, orientação de uso e requisitos de acessibilidade).

| Categoria | Slug | Rota | Presets |
| --- | --- | --- | --- |
| Barras e Colunas | `barras` | `/graficos/barras` | 12 |
| Linhas e Áreas | `linhas` | `/graficos/linhas` | 12 |
| Proporção | `proporcao` | `/graficos/proporcao` | 12 |
| Distribuição | `distribuicao` | `/graficos/distribuicao` | 15 |
| Relações e Fluxos | `relacoes` | `/graficos/relacoes` | 13 |
| KPI e Indicadores | `kpi` | `/graficos/kpi` | 9 |
| Mapas | `mapas` | `/graficos/mapas` | 3 |

| # | id | Nome | Categoria | Descrição |
| --- | --- | --- | --- | --- |
| 1 | `barras-basico` | Barras Básicas | barras | Colunas agrupadas comparando o volume de atendimentos de três programas ao longo dos meses. |
| 2 | `barras-empilhadas` | Barras Empilhadas | barras | Colunas empilhadas por programa e mês, com rótulo interno de cada parcela e leitura do total por coluna. |
| 3 | `barras-empilhadas-100` | Barras Empilhadas 100% | barras | Empilhamento normalizado em 100% para comparar a composição relativa entre trimestres, com eixo e tooltip em percentual. |
| 4 | `barras-horizontais` | Barras Horizontais (Ranking) | barras | Ranking de macrorregiões com eixo de categoria na vertical e rótulo de valor à direita de cada barra. |
| 5 | `barras-negativas` | Barras com Valores Negativos | barras | Variação percentual por macrorregião com eixo cruzando o zero e cor semântica para ganho e perda. |
| 6 | `barras-com-linha` | Barras com Linha (Eixo Duplo) | barras | Combinação de colunas de volume com linha de taxa percentual em eixo Y secundário, padrão de painel gerencial. |
| 7 | `barras-ordenadas-dinamicas` | Barras Ordenadas com Zoom | barras | Muitas categorias ordenadas de forma decrescente, com dataZoom horizontal (slider e inside) e rótulos rotacionados. |
| 8 | `barras-waterfall` | Cascata (Waterfall) | barras | Decomposição de resultado com a técnica de série de apoio transparente: base inicial, contribuições, perdas e total final. |
| 9 | `barras-polar` | Barras Polares | barras | Barras em coordenada polar (angleAxis e radiusAxis) para comparação visualmente marcante entre poucos programas. |
| 10 | `barras-fundo-trilha` | Barras com Trilha de Fundo | barras | Ranking horizontal com showBackground: a trilha neutra revela o quanto falta para o teto da escala. |
| 11 | `barras-cor-condicional` | Barras com Cor Condicional | barras | Cor de cada coluna definida por regra sobre o valor: abaixo da meta, na meta ou acima da meta, com linha de referência em 100%. |
| 12 | `barras-agrupadas-rotulo-total` | Barras Agrupadas com Total | barras | Barras agrupadas por modalidade de atendimento com rótulo de total acima de cada grupo de trimestre. |
| 13 | `linhas-multiplas` | Linhas Múltiplas com Média | linhas | Três séries temporais suavizadas com área opcional na série principal e markLine de média. |
| 14 | `linha-suavizada-area` | Área Suavizada com Gradiente | linhas | Série única com área em gradiente vertical derivado do token primary, indicada para destacar tendência em cards e painéis. |
| 15 | `areas-empilhadas` | Áreas Empilhadas | linhas | Três séries empilhadas com areaStyle, mostrando simultaneamente o total e a contribuição de cada programa no tempo. |
| 16 | `linha-temporal-zoom` | Série Temporal com Zoom | linhas | Eixo do tipo time com 365 pontos diários, amostragem LTTB e dataZoom (slider e inside) para navegar no período. |
| 17 | `linha-degraus` | Linha em Degraus (Step) | linhas | Step line com step start para grandezas que mudam em patamares, como tetos, tarifas e regras vigentes por período. |
| 18 | `linha-com-markpoint` | Linha com Máximo, Mínimo e Média | linhas | Série de NPS com markPoint de máximo e mínimo e markLine de média, para leitura imediata dos extremos. |
| 19 | `linha-comparativa-ano` | Comparativo Ano Atual x Anterior | linhas | Duas séries do mesmo indicador em anos distintos, com o ano anterior tracejado e em opacidade reduzida para funcionar como referência. |
| 20 | `linha-com-falhas` | Série com Dados Ausentes | linhas | Demonstra o efeito de connectNulls: a mesma série exibida com a lacuna preservada e com interpolação, além de tooltip que informa 'Sem dado'. |
| 21 | `linha-multieixo` | Duas Séries em Eixos Independentes | linhas | Séries com escalas muito diferentes (contagem de empresas e faturamento em milhões) em eixos Y próprios, com tooltip por unidade. |
| 22 | `linha-empilhada-gradiente` | Áreas Empilhadas com Gradiente | linhas | Áreas empilhadas com gradiente vertical por série e tooltip por eixo, para evolução da composição de atendimentos. |
| 23 | `linha-log` | Linha com Eixo Logarítmico | linhas | Eixo Y logarítmico para comparar séries de ordens de grandeza muito diferentes na mesma área de plotagem. |
| 24 | `linha-corrida-dados` | Linha de Alto Volume (LTTB) | linhas | Série temporal densa com 365 pontos, amostragem lttb e dataZoom, demonstrando desempenho com grande volume de dados. |
| 25 | `rosca-basica` | Rosca (Donut) Básica | proporcao | Distribuição percentual dos atendimentos entre programas, com rótulos em percentual e legenda à direita. |
| 26 | `rosca-com-total` | Rosca com Total no Centro | proporcao | Donut com o total consolidado no centro via title, padrão para cartões de KPI que combinam número principal e composição. |
| 27 | `pizza-simples` | Pizza com Rótulos Externos | proporcao | Pizza clássica com rótulos externos e linha de chamada, indicada quando o nome da categoria precisa ficar ao lado da fatia. |
| 28 | `pizza-rosa` | Rosa de Nightingale | proporcao | Pizza com roseType area, em que o raio varia conforme o valor — útil quando há muitas categorias com valores pequenos. |
| 29 | `pizza-bordas-arredondadas` | Rosca com Bordas Arredondadas | proporcao | Donut com itemStyle.borderRadius, padAngle e borda na cor do card, separando visualmente cada fatia. |
| 30 | `pizza-multiplas-series` | Rosca de Duas Séries | proporcao | Dois anéis concêntricos: eixo estratégico no anel interno e programas no anel externo, usando a paleta estendida. |
| 31 | `barra-progresso-empilhada` | Barra de Composição 100% | proporcao | Barra horizontal única empilhada em 100%, com cantos arredondados nas extremidades — ideal para cartões de KPI compactos. |
| 32 | `funil` | Funil de Conversão | proporcao | Funil da jornada do empreendedor, com valores absolutos no rótulo e conversão relativa ao topo no tooltip. |
| 33 | `treemap` | Treemap Hierárquico | proporcao | Dois níveis de hierarquia (eixo e programa) com área proporcional ao investimento, breadcrumb e drill-down por clique. |
| 34 | `treemap-drilldown` | Treemap com Drilldown | proporcao | Treemap navegável por níveis (macrorregião, município e setor) com breadcrumb e zoom no clique. |
| 35 | `sunburst` | Sunburst Hierárquico | proporcao | Mesma hierarquia do treemap em anéis concêntricos, com drill-down por clique (rootToNode) e rótulos radiais. |
| 36 | `sunburst-multinivel` | Sunburst Multinível | proporcao | Sunburst de três níveis — eixo estratégico, programa e município — com rótulos radiais e paleta estendida. |
| 37 | `dispersao-basica` | Dispersão Básica | distribuicao | Scatter relacionando horas de consultoria e faturamento anual das empresas atendidas, com símbolo proporcional à carga de consultoria. |
| 38 | `dispersao-bolhas` | Dispersão em Bolhas | distribuicao | Bubble chart com três dimensões: horas, faturamento e empregos gerados (tamanho e cor), com visualMap derivado dos tokens do DS. |
| 39 | `dispersao-com-regressao` | Dispersão com Tendência | distribuicao | Scatter de horas de consultoria contra variação de faturamento, com reta de tendência calculada por mínimos quadrados e desenhada via markLine. |
| 40 | `dispersao-multiplas-series` | Dispersão com Múltiplas Séries | distribuicao | Scatter com três séries setoriais e legenda, usando as cores complementares da paleta estendida para máxima separação. |
| 41 | `boxplot` | Boxplot com Discrepantes | distribuicao | Distribuição das notas de NPS por macrorregião, com quartis, mediana e série de valores discrepantes sobreposta em scatter. |
| 42 | `histograma` | Histograma | distribuicao | Distribuição de faturamento anual em faixas, com barras coladas (barCategoryGap zero) e percentual no tooltip. |
| 43 | `radar-basico` | Radar Básico | distribuicao | Radar com seis eixos avaliando dimensões de maturidade do negócio em escala de 0 a 100, uma única série. |
| 44 | `radar-comparativo` | Radar Comparativo | distribuicao | Duas séries preenchidas no mesmo radar comparando o perfil de resultado dos programas Empreender e AGI. |
| 45 | `heatmap-matriz` | Matriz de Calor | distribuicao | Matriz programa x mês com escala contínua de cor derivada dos tokens e rótulo de valor em cada célula. |
| 46 | `heatmap-matriz-anual` | Matriz Anual de Calor | distribuicao | Heatmap matricial programa x mês com visualMap contínuo baseado em BRAND_SCALE_SEQUENCIAL e rótulo de valor em cada célula. Substitui o tipo matrix do ECharts 6, indisponível na versão 5. |
| 47 | `heatmap-calendario` | Calendário de Calor | distribuicao | Atendimentos diários ao longo de 12 meses em coordenada calendar, com escala contínua derivada do token primary. |
| 48 | `candlestick` | Velas (faixa mín-máx) | distribuicao | Série temporal com abertura, fechamento, mínimo e máximo por semana — útil para indicadores que variam dentro do período. Inclui dataZoom. |
| 49 | `candlestick-com-media` | Candlestick com Médias Móveis | distribuicao | Candlestick semanal de atendimentos com médias móveis de 5 e 10 períodos sobrepostas em linha. |
| 50 | `candlestick-volume` | Candlestick com Volume | distribuicao | Candlestick semanal no grid superior e volume de empresas distintas no grid inferior, sincronizados por dataZoom e axisPointer. |
| 51 | `coordenadas-paralelas` | Coordenadas Paralelas | distribuicao | Cinco dimensões de avaliação (satisfação, adesão, inovação, alcance e custo-efetividade) comparadas entre os programas. |
| 52 | `sankey` | Sankey de Fluxo | relacoes | Fluxo do empreendedor entre canais de entrada, programas e desfechos, com espessura proporcional ao volume. |
| 53 | `grafo-forca` | Grafo de Força | relacoes | Rede de encaminhamentos entre programas com layout force, nós dimensionados por volume, roam e repulsão ajustada. |
| 54 | `grafo-circular` | Grafo Circular | relacoes | Mesma rede de encaminhamentos em layout circular com arestas curvas — leitura estável e reprodutível entre renderizações. |
| 55 | `grafo-categorias` | Grafo por Categorias | relacoes | Graph com layout force e nós agrupados em três categorias — programa, macrorregião e setor — com legenda por categoria. |
| 56 | `grafo-matriz-adjacencia` | Grafo Circular Ponderado | relacoes | Relacionamento entre macrorregiões em layout circular, com espessura de aresta proporcional ao volume de encaminhamentos. |
| 57 | `arvore` | Árvore Hierárquica | relacoes | Estrutura do portfólio em três níveis (eixo, programa e produto) em árvore horizontal com expandir e recolher. |
| 58 | `arvore-radial` | Árvore Radial | relacoes | Mesma hierarquia de portfólio em layout radial, aproveitando melhor o espaço quando há muitos nós folha. |
| 59 | `arvore-vertical` | Árvore Vertical | relacoes | Tree com orientação de cima para baixo apresentando a estrutura de eixos e programas do __BRAND_NAME__. |
| 60 | `arvore-multipla` | Árvores Comparadas | relacoes | Duas árvores lado a lado no mesmo gráfico, comparando a estrutura da carteira de programas de 2024 e de 2025. |
| 61 | `theme-river` | Theme River | relacoes | Evolução da participação de cada programa ao longo de 12 meses em fluxo contínuo centralizado. |
| 62 | `theme-river-programas` | Theme River de Programas | relacoes | ThemeRiver de cinco programas ao longo de doze meses usando as cores complementares da paleta estendida. |
| 63 | `acordes-relacional` | Acordes Relacionais | relacoes | Matriz de relacionamento entre as macrorregiões em grafo circular, com espessura das arestas proporcional ao peso. |
| 64 | `calendario-atendimentos` | Calendário de Atendimentos | relacoes | Calendar heatmap de um ano inteiro com visualMap sequencial e tooltip por dia, evidenciando sazonalidade semanal. |
| 65 | `gauge-simples` | Gauge de Meta | kpi | Velocímetro de atingimento de meta de 0 a 100% com faixas de erro, atenção e sucesso derivadas dos tokens semânticos. |
| 66 | `gauge-anel` | Gauge em Anel (progresso) | kpi | Anel fino de progresso sem ponteiro, com valor central — formato ideal para cards compactos de KPI. |
| 67 | `gauge-multiplo` | Gauge Múltiplo | kpi | Três indicadores de meta em anéis concêntricos no mesmo gráfico, com legenda e cores da paleta de tokens. |
| 68 | `gauge-grau` | Gauge de Estágio | kpi | Medidor de estágio de maturidade do negócio com escala nominal de cinco níveis, ponteiro e rótulo textual central. |
| 69 | `gauge-estagios` | Gauge por Estágios | kpi | Medidor com quatro faixas coloridas nomeadas por estágio de maturidade e ponteiro indicando a posição atual. |
| 70 | `sparkline` | Sparkline | kpi | Linha minimalista sem eixos, grid ou legenda, para embutir em Big Numbers e cards de KPI. Destaque de máximo por markPoint. |
| 71 | `barra-meta` | Barra com Meta | kpi | Barras horizontais de realizado por região com markLine de meta e cor condicional (sucesso acima, erro abaixo). |
| 72 | `barra-comparativa-meta` | Barra Comparativa de Meta | kpi | Barras horizontais de realizado sobrepostas à trilha da meta de cada programa, com rótulo de atingimento percentual. |
| 73 | `pictorial-bar` | Barra Pictórica | kpi | Símbolos repetidos representando quantidade de MEIs formalizados, com trilho de escala ao fundo e equivalência declarada no eixo. |
| 74 | `mapa-brasil-ufs` |$1 com a UF de destaque marcada por borda e rótulo. |

Os dados de todos os presets são fictícios e devem ser substituídos pelos dados reais do produto.

### 8.4 Mapas e carregamento do GeoJSON

Presets da categoria `mapas` declaram `requerMapa?: string` no `ChartPreset`. O
wrapper `BrandChart` recebe esse nome, registra a base geográfica **antes** de
aplicar o `option` (exibindo o loading do ECharts) e, em caso de falha de rede,
mostra uma mensagem de indisponibilidade sem quebrar a página.

API de `src/lib/echarts/mapas.ts`:

| Símbolo | Assinatura | Descrição |
| --- | --- | --- |
| `MAPA_BRASIL` | `"brasil-ufs"` | Nome registrado do mapa do Brasil por UF (27 features). |
| `registrarMapaBrasil` | `(echarts) => Promise<void>` | Registra o mapa do Brasil; idempotente e com cache em memória. |
| `registrarMapaPorNome` | `(echarts, nome) => Promise<void>` | Registra pelo valor de `ChartPreset.requerMapa`. |
| `mapaRegistrado` | `(nome) => boolean` | Indica se o mapa já foi registrado nesta sessão. |
| `MAPAS_DISPONIVEIS` | `readonly string[]` | Lista dos mapas suportados. |

O GeoJSON fica em `public/geo/brasil-ufs.json` (3,4 MB), servido pelo próprio domínio e
carregados por `fetch` **sob demanda** — apenas na rota `/graficos/mapas` e no
Playground, nunca no bundle inicial ou em outras páginas. Os nomes das features
são normalizados em `properties.name` para casar com o `data` dos presets.
Todo preset de mapa exige oferecer os mesmos dados em tabela como alternativa
acessível.

### 8.5 Playground e Central de Downloads

**Playground — `/graficos/playground`.** Editor do `option` em JSON com pré-visualização ao vivo, debounce, validação de sintaxe, restauração do preset original e exportação em JSON, TypeScript e PNG. Fluxo: escolher um preset, editar o JSON, conferir o render e exportar.

**Central de Downloads — `/graficos/downloads`.** Gera pacotes `.zip` no cliente, sem backend: biblioteca completa ou por categoria, tema isolado (`brand-theme.js` e JSONs light/dark), wrapper React, manifesto `index.json` para consumo programático e exemplos vanilla e Power BI.

### 8.6 Consumo em React

```tsx
import { BrandChart } from "@/components/charts/BrandChart";
import { getPresetById } from "@/data/echarts/registry";
import { formatarNumero } from "@/lib/echarts/format";

export function AtendimentosPorPrograma() {
  const preset = getPresetById("barras-basico");
  if (!preset) return null;

  return (
    <BrandChart
      option={preset.option}
      height={360}
      ariaLabel="Atendimentos por programa entre janeiro e junho, comparando três programas."
    />
  );
}
```

Com `option` próprio e paleta de tokens:

```tsx
import { BrandChart } from "@/components/charts/BrandChart";
import { BRAND_PALETTE } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const option = {
  color: BRAND_PALETTE,
  tooltip: { trigger: "axis", valueFormatter: (v: number) => formatarNumero(v) },
  xAxis: { type: "category", data: ["Jan", "Fev", "Mar"] },
  yAxis: { type: "value" },
  series: [{ name: "Atendimentos", type: "bar", data: [1200, 1580, 1410] }],
};

<BrandChart option={option} ariaLabel="Atendimentos mensais no primeiro trimestre." />;
```

### 8.7 Consumo em HTML puro via CDN

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Atendimentos por programa</title>
    <link rel="stylesheet" href="https://__DS_DOMAIN__/design-system/tokens.css" />
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
  </head>
  <body>
    <div
      id="grafico"
      role="img"
      aria-label="Atendimentos por programa entre janeiro e março."
      style="width: 100%; height: 360px"
    ></div>

    <script src="./brand-theme.js"></script>
    <script>
      // brand-theme.js vem da Central de Downloads e registra
      // os temas "brand-light" e "brand-dark" no objeto echarts.
      var chart = echarts.init(document.getElementById("grafico"), "brand-light");
      var nf = new Intl.NumberFormat("pt-BR");

      chart.setOption({
        tooltip: { trigger: "axis", valueFormatter: function (v) { return nf.format(v); } },
        xAxis: { type: "category", data: ["Jan", "Fev", "Mar"] },
        yAxis: { type: "value" },
        series: [{ name: "Atendimentos", type: "bar", data: [1200, 1580, 1410] }]
      });

      window.addEventListener("resize", function () { chart.resize(); });
    </script>
  </body>
</html>
```

---

<a id="9-marca"></a>
## 9. Marca

Página oficial: `/marca`. Blocos documentados: Assinatura simples, Assinaturas compostas, Versões alternativas, Área de Proteção, Redução Máxima, Como Assinamos, Assinaturas Compartilhadas, Usos Indevidos e Downloads.

**Arquivos disponíveis** (`src/assets/marca/`, expostos por `src/assets/brand.ts`):

| Export | Arquivo | Uso |
| --- | --- | --- |
| `brandCor` | `brand-cor.svg` | Versão colorida, padrão em fundos claros |
| `brandWhite` | `brand-white.svg` | Versão branca, obrigatória em fundos escuros e no dark mode |
| `brandBlack` | `brand-black.svg` | Versão monocromática preta |

Complementos: `src/assets/brand-logo-white-header.svg` e `src/assets/brand-logo-white.svg`, usados nos headers institucionais.

**Zona de segurança.** Toda aplicação da marca preserva a área de proteção documentada em `/marca#area-de-protecao`; nenhum elemento gráfico, texto ou borda pode invadi-la. O componente `BrandLogo` sempre renderiza a marca com `object-contain` dentro de uma caixa `width × height`, o que preserva a proporção em qualquer breakpoint.

**Redução máxima.** Respeite os limites mínimos de tamanho descritos em `/marca#reducao-maxima`. Abaixo deles a assinatura perde legibilidade e não deve ser usada.

**Usos incorretos.** Não distorça, não recolore fora das três versões oficiais, não aplique sombra ou contorno, não rotacione, não altere o espaçamento interno da assinatura, não use a versão colorida sobre fundos de baixo contraste e não substitua a tipografia da marca. No dark mode, a marca no header deve ser a versão branca (`#ffffff`).

---

<a id="10-conteudo-e-webwriting"></a>
## 10. Conteúdo e webwriting

Página oficial: `/conteudo`.

**Voz e tom.** Institucional, direto e acolhedor. Fale com a pessoa ("você"), sobre o problema que ela precisa resolver, não sobre a instituição. Vocabulário __BRAND_SHORT__: atendimento, empreendedor, empresa atendida, programa.

**Princípios**

| Princípio | Diretriz |
| --- | --- |
| Escaneabilidade | Pessoas escaneiam a tela em vez de ler. Use títulos, subtítulos, listas e destaques para guiar o olhar. |
| Pirâmide invertida | Comece pela informação mais importante. Detalhes e contexto vêm depois. |
| Clareza acima de tudo | Frases curtas, palavras simples, uma ideia por parágrafo. Se der para cortar, corte. |
| Voz ativa | Sujeito + verbo + complemento. Mais direto, mais humano e mais fácil de entender. |
| Foco no usuário | Fale com a pessoa ("você"), sobre o que ela precisa resolver, não sobre a instituição. |
| SEO com naturalidade | Use as palavras-chave que o público realmente busca, sem forçar repetições. |

**Boas práticas por elemento**

| Elemento | Escreva assim | Evite |
| --- | --- | --- |
| Título (H1) | "Como abrir seu MEI em 5 passos" | "Tudo o que você sempre quis saber sobre o processo de formalização!" |
| Subtítulos (H2/H3) | "Documentos necessários" | "Agora vamos falar sobre uma parte muito importante" |
| Parágrafos | Até 3 ou 4 linhas, uma ideia por parágrafo | Blocos longos misturando vários assuntos sem respiro visual |
| Listas | Itens curtos e paralelos | Enumeração corrida dentro do parágrafo |
| Links | "Baixe o edital completo" | "Clique aqui para baixar" |
| CTA (botão) | "Quero me inscrever" | "Enviar" |
| Mensagens de erro | "Informe um e-mail válido (ex: nome@email.com)." | "Erro! Campo inválido!" |
| Microcopy de formulário | "Nome completo" | "Por favor, digite aqui o seu nome completo conforme documento" |

**Regras de estilo:** use voz ativa; escreva números em algarismos (5, 10, 200); uma ideia por frase; padronize datas em DD/MM/AAAA; explique siglas na primeira menção.

**Checklist de publicação:** título com até 60 caracteres; primeiro parágrafo responde o quê, por que e para quem; parágrafos de no máximo 3–4 linhas; subtítulos a cada bloco de ideia; listas e destaques para escanear; links que descrevem o destino; botões começando com verbo de ação; sem jargões ou siglas não explicadas; leitura confortável no celular; conteúdo acessível (contraste, alt em imagens, linguagem simples).

---

<a id="11-acessibilidade"></a>
## 11. Acessibilidade

Página oficial: `/acessibilidade`. Padrão mínimo: **WCAG 2.1 nível AA**, nos modos claro e escuro.

- **Contraste.** Texto normal 4.5:1, texto grande 3:1, componentes de interface e estados de foco 3:1. Os pares de token (`--foreground`/`--background`, `--primary`/`--primary-foreground`, `--muted-foreground`/`--card`) já são construídos para atender AA nos dois temas. Combinações fora dos tokens precisam ser conferidas.
- **Foco visível.** Regra global em `src/index.css`: todo `a`, `button`, `[role="button"]`, `[role="link"]` e `[tabindex]` recebe `outline: 2px solid hsl(var(--ring))` com `outline-offset: 2px` e halo `hsl(var(--ring) / 0.18)` no `:focus-visible`. Nunca remova o outline sem substituto equivalente.
- **Navegação por teclado.** Toda funcionalidade deve ser operável sem mouse. Ordem de tabulação segue a ordem visual; `Escape` fecha drawers e modais (a sidebar do `DSLayout` implementa isso); a busca da sidebar tem navegação por setas nos resultados.
- **ARIA.** Use ARIA apenas quando o HTML nativo não bastar. Elementos de carregamento marcam `aria-busy`; regiões dinâmicas usam `aria-live`; ícones sem texto exigem `aria-label`; controles ligados a rótulos usam `label for` / `aria-labelledby`.
- **Semântica.** Hierarquia de headings correta (h1 → h2 → h3, sem pular níveis), um `h1` por página (em templates de tela cheia ele pode ser `sr-only`), listas em `ul`/`ol`, tabelas com `th` e escopo, landmarks (`header`, `nav`, `main`, `footer`).
- **Alvos clicáveis.** Área mínima de toque confortável, com espaçamento suficiente entre alvos adjacentes.
- **Dark mode.** Todo componente precisa ser verificado nos dois temas; contraste é requisito em ambos.
- **Movimento.** `BrandChart` desliga a animação quando `prefers-reduced-motion: reduce`; siga o mesmo comportamento em novas animações.

**Regras específicas para gráficos**

1. `ariaLabel` é **obrigatório** em `BrandChart` — a prop é exigida pelo tipo e o texto também é renderizado em `sr-only`, além de aplicado como `aria-label` no container `role="img"`.
2. A descrição deve informar o que o gráfico mostra e o recorte (período, dimensão), não apenas o tipo de gráfico.
3. Cor nunca é o único canal de informação: combine com rótulo, forma, ordenação, padrão de traço ou valor no tooltip. Em séries semânticas (sucesso/erro), acrescente sinal ou texto.
4. Sempre que possível, ofereça o dado também em formato tabular ou exportável.
5. Formate números com os helpers pt-BR para que leitores de tela e usuários leiam os valores no padrão nacional.

---

<a id="12-qualidade-e-automacoes"></a>
## 12. Qualidade e automações

### 12.1 Scripts

| Script | Comando | O que garante |
| --- | --- | --- |
| `build:figma-tokens` | `node scripts/build-figma-tokens.mjs` | Regera `tokens.json` (DTCG), `tokens.css`, `tailwind.config.json`, `components.json` e o `manifest.json` com bytes e SHA-256 |
| `validate:figma-tokens` | `node scripts/validate-figma-tokens.mjs` | Valida os artefatos gerados contra os JSON Schemas em `schemas/` usando Ajv |
| `typecheck` | `tsc --noEmit -p tsconfig.app.json` | Nenhum erro de tipo na aplicação |
| `check:legacy-brand` | `node scripts/check-legacy-brand.mjs` | Nenhuma ocorrência da marca legada anterior no projeto; grava o relatório em `reports/` e falha com exit 1 |
| `check:legacy-typography` | `node scripts/check-legacy-typography.mjs` | Nenhum `<p>` novo com classes tipográficas antigas fora dos tokens `.ds-body*`; opera contra a baseline em `reports/legacy-typography-baseline.json` |
| `check:homepage-h1` | `node scripts/check-homepage-h1-color.mjs` | A regra global `h1 { color: #005EB8 }` existe e nenhum `h1` da Homepage a sobrescreve |
| `check:homepage-h1:computed` | `node scripts/check-homepage-h1-computed.mjs` | Verificação em runtime (Playwright) da cor computada dos headings |
| `check:homepage-interactive` | `node scripts/check-homepage-interactive-tokens.mjs` | Estados interativos da Homepage usando tokens do DS |
| `test` | `vitest run` | Suíte completa de testes unitários |
| `test:tokens` | `vitest run src/data/__tests__/tokenGroups.validator.test.ts` | Cada token exibido no site bate exatamente com o valor de `src/index.css`; em divergência aponta o bloco CSS e a linha |
| `test:sidebar` | `vitest run src/components/templates/__tests__/SidebarMenuPreview.regression.test.tsx` | Regressão do preview do menu lateral |
| `test:smoke` | `node scripts/smoke-public-url.mjs` | Smoke test da URL pública (com `--render` executa render via Playwright) |
| `lint` | `eslint .` | Padrões de código |

### 12.2 Pipeline de build

O comando `npm run build` executa, nesta ordem:

```text
build:figma-tokens
  → validate:figma-tokens
    → typecheck
      → check:legacy-brand
        → check:legacy-typography
          → check:homepage-h1
            → vite build
```

**Alerta:** o deploy só reflete mudanças quando `npm run build` passa do início ao fim. Qualquer etapa que falhe interrompe a cadeia antes do `vite build`, e o ambiente publicado continua servindo o bundle anterior. Se uma alteração não aparece em produção, rode o build completo localmente e leia a saída inteira — a causa está sempre em uma das etapas de validação, não no deploy.

As mesmas verificações rodam em CI pelo workflow `.github/workflows/main.yml`.

---

<a id="13-integracao-com-figma"></a>
## 13. Integração com Figma

**Ponte — `/design-system/figma`.** Página que lista os endpoints públicos, mostra o manifesto vigente e permite exportar um pacote JSON consolidado e versionado (download ou cópia para a área de transferência). Antes de exportar, os artefatos são validados automaticamente com Ajv. No Figma, importe via Tokens Studio: **Import → URL →** `https://__DS_DOMAIN__/design-system/tokens.json`.

**Schemas — `/design-system/schemas`.** Página que apresenta os três JSON Schemas (draft-07) versionados em `schemas/`:

| Schema | Título | Estrutura exigida |
| --- | --- | --- |
| `tokens.schema.json` | __BRAND_SHORT__ DS - DTCG Tokens | Requer `$schema` e `brand`; nós recursivos com folhas contendo `$type` e `$value` |
| `components.schema.json` | __BRAND_SHORT__ DS - Components Manifest | Requer `meta`, `primitives` e `composed`, cada item com id, nome, referência, variantes, estados e tokens |
| `tailwind.schema.json` | __BRAND_SHORT__ DS - Tailwind Config Subset | Requer `darkMode` e `theme` |

**Validador — `/design-system/validator`.** Cole `tokens.json`, `components.json` ou `tailwind.config.json` e receba os erros em tempo real, com Ajv no cliente e mapeamento do erro para o caminho do JSON. Serve para conferir artefatos produzidos fora do repositório antes de publicá-los.

---

<a id="14-mapa-de-rotas"></a>
## 14. Mapa de rotas

Rotas **standalone** são renderizadas em tela cheia, fora do `DSLayout`. As demais herdam o shell do portal (sidebar, header e tema). Todas as rotas usam carregamento lazy, com `lazyWithRetry` recuperando chunks obsoletos após redeploy, exceto `HomePage`, que é importada de forma estática.

| Rota | Shell | Componente |
| --- | --- | --- |
| `/templates/dashboard-institucional` | Standalone | `DashboardInstitucionalPage` |
| `/templates/dashboard-bi` | Standalone | `DashboardBIPage` |
| `/templates/dashboard-analitico` | Standalone | `DashboardAnaliticoPage` |
| `/templates/tela-bi` | Standalone | `TelaBIPage` |
| `/templates/tela-listagem` | Standalone | `TelaListagemPage` |
| `/templates/tela-formulario` | Standalone | `TelaFormularioPage` |
| `/templates/pagina-autenticacao` | Standalone | `PaginaAutenticacaoPage` |
| `/templates/cadastro` | Standalone | `CadastroPage` |
| `/templates/autenticacao-2fa` | Standalone | `TwoFactorPage` |
| `/templates/pagina-erro` | Standalone | `ErrorPageTemplate` |
| `/templates/modal-acesso` | Standalone | `ModalAcessoTemplatePage` |
| `/templates/pagina-filtros-tabela` | Standalone | `PaginaFiltrosTabelaPage` |
| `/templates/radar-estrategico` | Standalone | `RadarEstrategicoPage` |
| `/modelos-bi/radar-estrategico/bi` | Standalone | `RadarEstrategicoPage` |
| `/modelos-bi/planeja` | Standalone | `PlanejaBIPage` |
| `/modelos-bi/mpi` | Standalone | `MPIBIPage` |
| `/modelos-bi/gestao-pessoas` | Standalone | `GestaoPessoasBIPage` |
| `/` | DSLayout | `HomePage` |
| `/fundamentos` | DSLayout | `FundamentosPage` |
| `/tokens` | DSLayout | `TokensPage` |
| `/componentes` | DSLayout | `ComponentesPage` |
| `/templates` | DSLayout | `TemplatesPage` |
| `/templates/radar-estrategico/docs` | DSLayout | Redirect para `/modelos-bi/radar-estrategico/docs` |
| `/modelos-bi` | DSLayout | `ModelosBIPage` |
| `/modelos-bi/radar-estrategico` | DSLayout | `RadarEstrategicoHubPage` |
| `/modelos-bi/radar-estrategico/docs` | DSLayout | `RadarEstrategicoDocsPage` |
| `/modelos-bi/mapeamento` | DSLayout | `PowerBIMappingPage` |
| `/componentes/header-degrade/docs` | DSLayout | `HeaderDegradeDocsPage` |
| `/componentes/header-degrade/playground` | DSLayout | `HeaderPlaygroundPage` |
| `/graficos` | DSLayout | `GraficosIndexPage` |
| `/graficos/barras` | DSLayout | `GraficosCategoriaPage categoria="barras"` |
| `/graficos/linhas` | DSLayout | `GraficosCategoriaPage categoria="linhas"` |
| `/graficos/proporcao` | DSLayout | `GraficosCategoriaPage categoria="proporcao"` |
| `/graficos/distribuicao` | DSLayout | `GraficosCategoriaPage categoria="distribuicao"` |
| `/graficos/relacoes` | DSLayout | `GraficosCategoriaPage categoria="relacoes"` |
| `/graficos/kpi` | DSLayout | `GraficosCategoriaPage categoria="kpi"` |
| `/graficos/mapas` | DSLayout | `GraficosCategoriaPage categoria="mapas"` |
| `/graficos/playground` | DSLayout | `GraficosPlaygroundPage` |
| `/graficos/downloads` | DSLayout | `GraficosDownloadsPage` |
| `/marca` | DSLayout | `MarcaPage` |
| `/conteudo` | DSLayout | `ConteudoPage` |
| `/acessibilidade` | DSLayout | `AcessibilidadePage` |
| `/design-system/figma` | DSLayout | `FigmaBridgePage` |
| `/design-system/schemas` | DSLayout | `SchemasPage` |
| `/design-system/validator` | DSLayout | `ValidatorPage` |
| `*` | DSLayout | `NotFound` |

---

<a id="15-changelog-resumido"></a>
## 15. Changelog resumido

- **Correção de bug de hover nos gráficos ECharts** — `readToken` passou a converter todos os tokens HSL para `rgb()`/`rgba()` antes de entregá-los ao ECharts, evitando que o parser do zrender falhe ao derivar cores no estado `emphasis`.
- **Componente compartilhado `BIPanelHeader`** — header padronizado com marca __BRAND_SHORT__ branca extraído para `src/components/bi/BIPanelHeader.tsx` e aplicado nos painéis Gestão de Pessoas e Radar Estratégico.
- **Tela BI (`/templates/tela-bi`)** — shell de inteligência comercial com `BIDataProvider`, oito seções, header institucional de 64px, sidebar em drawer no mobile, seed de 220 empresas fictícias, macrorregiões de exemplo, migração dos gráficos de Recharts para ECharts, selects e tabelas shadcn, skeletons e deltas reais nos KPIs.
- **Dashboard Analítico (`/templates/dashboard-analitico`)** — template standalone com header tokenizado, filtros funcionais, KPIs, quatro gráficos ECharts, exportação CSV, skeletons, SEO e acessibilidade validada em 1280px e 390px.
- **Seção Gráficos ECharts (`/graficos`)** — 74 presets em 7 categorias, tema oficial `brand-light`/`brand-dark` derivado dos tokens, wrapper `BrandChart`, helpers pt-BR, Playground de edição do `option` e Central de Downloads com pacotes `.zip` gerados no cliente. A categoria Mapas está ativa (Brasil por UF); gráficos 3D e `echarts-gl` seguem fora do escopo.
- **Gestão de Pessoas — BI (`/modelos-bi/gestao-pessoas`)** — painel com AppBar, abas, legenda, filtros, seis KPIs e blocos temáticos, validado em desktop, tablet e mobile.
- **Ponte para Figma, Schemas e Validador** — exportação DTCG, três JSON Schemas draft-07 e validação Ajv no cliente e no CI.
- **Header Degradê Novo __BRAND_SHORT__** — componente de 135px com gradiente institucional, totalmente tokenizado, com documentação e playground dedicados.
- **Templates de autenticação e conteúdo** — Página de Autenticação, Cadastro, 2FA, Modal de Acesso, Página de Erro e Footer Institucional em três variantes.
- **Automação de qualidade** — validador de tokens com 77 asserções contra `src/index.css`, checagens de marca legada, tipografia legada e cor institucional dos `h1`, todas executadas no pipeline de build e no CI.

---

### Resumo quantitativo desta documentação

| Item | Quantidade documentada |
| --- | --- |
| CSS custom properties (tokens) únicas | 194 (66 redefinidas no dark mode) |
| Componentes base shadcn/ui | 49 |
| Componentes documentados na página `/componentes` | 30 |
| Templates de tela com rota própria | 13 |
| Modelos de BI (incluindo hub, docs e mapeamento) | 7 |
| Presets de gráficos ECharts | 74 em 7 categorias |
| Rotas mapeadas | 46 (17 standalone, 29 no DSLayout, incluindo redirect e fallback) |
