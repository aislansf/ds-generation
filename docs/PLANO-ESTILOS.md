# Plano de execução: estilos visuais no `ds-build`

> Status: proposta · Data: 28/10/2026 · Escopo: repositório `aislansf/ds-generation` e origem `aislansf/ds-sebrae`

## 1. Objetivo

Permitir que o usuário escolha um **estilo visual** (minimalista, suíço, neobrutalismo, glassmorfismo…) e que **todo o Design System gerado** siga esse estilo: tokens, componentes, templates de tela, gráficos, documentação e exportação para o Figma.

A marca continua definindo **cor, fonte, logo e voz**. O estilo passa a definir **forma, profundidade, peso, textura e ritmo**.

### Regra do padrão

**Se o usuário não informar o estilo, a skill gera o DS com o estilo atual**, chamado aqui de `corporativo` (flat corporativo, o visual de hoje). Isso vale para:

- briefing sem o campo `estilo`, com `null`, vazio ou ainda com o texto `PREENCHER`;
- usuário que responde "tanto faz", "não sei" ou pula a pergunta;
- briefings antigos, como `assets/examples/exemplo-verde.json`.

Gerar sem estilo e gerar com `"estilo": "corporativo"` produz **exatamente o mesmo resultado** que a skill produz hoje. Essa é a principal garantia de compatibilidade do plano (seção 10).

## 2. Diagnóstico do template atual

Medições feitas em `skills/ds-build/assets/template/src` (127 arquivos `.tsx`):

| Aspecto | Situação hoje | Impacto para estilos |
|---|---|---|
| Cores | Tokens HSL em `:root` e `.dark`, recoloridos por família de matiz | Pronto. O estilo só precisa mexer em neutros e superfícies |
| Raio | `--radius` existe, mas o Tailwind só mapeia `rounded-sm/md/lg`. `rounded-xl/2xl/3xl` (50 usos) usam valores fixos | Parcial |
| Sombras | `--shadow-xs…xl` existem, mas o `tailwind.config.ts` **não mapeia `boxShadow`**: ~147 usos de `shadow`, `shadow-sm`, `shadow-lg` etc. em 57 arquivos usam as sombras padrão do Tailwind. Só 1 `.tsx` usa `var(--shadow-*)` | Precisa mapear |
| Borda | Não há token de espessura. `border` = 1px fixo, `border-2` em 15 lugares | Precisa de token |
| Peso de fonte | Tokens `--font-*` existem, mas `font-medium/semibold/bold` (~1.200 usos) usam valores fixos do Tailwind | Precisa mapear |
| Degradês | 30 ocorrências em 14 arquivos (header, login, 2FA, modal de acesso, Hub de painéis, Tela BI…) | Precisa de token |
| Efeitos | 6 `backdrop-blur`, 13 `rounded-[…]`, 8 `shadow-[…]`, 2 `shadow-primary/20` | Triagem manual |
| HEX fixos | ~700 em 35 arquivos (documentação que mostra valores) | Recoloridos pela marca, fora do alcance do estilo |
| Ganchos | Componentes shadcn sem `data-slot` ou similar | Precisa de ganchos para a camada CSS |
| Tema | `useTheme` começa sempre em `light` | Precisa de tema padrão configurável (cyberpunk) |
| Gráficos | `brandTheme.ts` lê tokens em tempo de execução | Pronto para ler tokens de estilo |

O template é **extraído** do `ds-sebrae` (`tools/extract-template.mjs`) e não deve ser editado à mão (`docs/HANDOFF.md`). Por isso, toda mudança estrutural no template (tokens, mapeamentos, ganchos, componentes) entra **na origem** ou em `origem/overrides/`, e não em `assets/template/`.

## 3. Princípios

1. **Ida e volta = identidade.** O preset `corporativo` não altera nada. A tokenização da Fase 1 usa como padrão os valores que o template já tem.
2. **Marca define cor; estilo define forma.** O estilo nunca altera a escala da marca (`--brand-primary-*`, `--brand-secondary-*`) nem as cores semânticas (`success`, `warning`, `error`, `info`). Ele pode alterar neutros, superfícies, bordas, sombras, raios, pesos, tracking, motion, padrões de fundo e **quais** cores da marca preenchem quais superfícies.
3. **Determinístico.** O estilo é aplicado por script a partir de um preset versionado. Nada fica para o agente "interpretar".
4. **Acessibilidade não é negociável.** Todo estilo passa pelos mesmos mínimos WCAG (4.5:1 em texto, 3:1 em componentes de interface e foco). Onde o estilo é naturalmente fraco (neumorfismo, glass, cyberpunk, texturas), o preset traz salvaguardas obrigatórias.
5. **Superfícies de marca x superfícies de sistema.** Decoração (texturas, ornamentos, padrões, formas, rotações) só aparece em **superfícies de marca**: hero da Home, header, painel lateral de login/cadastro/2FA/modal de acesso, página de erro, estados vazios, rodapé e capa do Hub de painéis. Tabelas, formulários, dashboards e páginas de documentação ficam legíveis em qualquer estilo.
6. **A fonte da marca vence.** O estilo **sugere** fontes durante o questionário, mas nunca troca a fonte que o usuário escolheu.

## 4. Catálogo de estilos

Estilo padrão mais 21 estilos opcionais, agrupados como na conversa original. Os níveis de implementação estão na seção 5.

| # | id | Estilo | Grupo | Nível | Tema padrão |
|---|---|---|---|---|---|
| 0 | `corporativo` | **Corporativo (atual, padrão)** | Limpos e funcionais | — | light |
| 1 | `minimalista` | Minimalista | Limpos e funcionais | 1 | light |
| 2 | `suico` | Suíço / Tipográfico Internacional | Limpos e funcionais | 1 | light |
| 3 | `flat` | Flat design | Limpos e funcionais | 1 | light |
| 4 | `material` | Material Design (M3) | Limpos e funcionais | 1 + 2 | light |
| 5 | `escandinavo` | Escandinavo / Nórdico | Limpos e funcionais | 1 | light |
| 6 | `brutalista` | Brutalista | Ousados | 2 | light |
| 7 | `neobrutalismo` | Neobrutalismo | Ousados | 2 | light |
| 8 | `maximalista` | Maximalista | Ousados | 3 | light |
| 9 | `grunge` | Grunge | Ousados | 3 | light |
| 10 | `art-nouveau` | Art Nouveau | Inspirados em épocas | 3 | light |
| 11 | `bauhaus` | Bauhaus | Inspirados em épocas | 3 | light |
| 12 | `construtivismo` | Construtivismo russo | Inspirados em épocas | 3 | light |
| 13 | `retro` | Retrô / Vintage | Inspirados em épocas | 3 | light |
| 14 | `neumorfismo` | Neumorfismo | Digitais e de interface | 2 | light |
| 15 | `glassmorfismo` | Glassmorfismo | Digitais e de interface | 2 | light |
| 16 | `claymorfismo` | Claymorfismo | Digitais e de interface | 2 | light |
| 17 | `bento` | Bento grid | Digitais e de interface | 4 | light |
| 18 | `cyberpunk` | Dark mode / Cyberpunk | Digitais e de interface | 2 | **dark** |
| 19 | `organico` | Orgânico / Natural | Orgânicos e artesanais | 3 | light |
| 20 | `ilustrativo` | Ilustrativo / Hand-drawn | Orgânicos e artesanais | 3 | light |
| 21 | `colagem` | Colagem | Orgânicos e artesanais | 3 | light |

Todo estilo tem versão light **e** dark. "Tema padrão" é só o tema com que o DS abre na primeira visita.

**Fora do escopo:** Art Déco, Memphis, Y2K e Skeuomorfismo (seção 13).

## 5. Arquitetura

### 5.1 Camadas

| Nível | Camada | O que resolve | Onde vive no DS gerado |
|---|---|---|---|
| 1 | **Tokens de pele** | Raio, borda, sombra, peso, tracking, transformação de títulos, motion, neutros, superfícies, traço de ícones | `src/index.css` (`:root` e `.dark`) |
| 2 | **Camada CSS do estilo** | O que token não expressa: blur, sombra interna em campos, hover que desloca, cantos cortados, links sempre sublinhados | `src/styles/estilo.css` (vazio no padrão) |
| 3 | **Decoração gerada** | Texturas, ornamentos, padrões, formas, divisórias, só em superfícies de marca | `public/estilo/*.svg` + variáveis `--deco-*` |
| 4 | **Layout** | Reorganização de páginas (bento) | `src/config/estilo.ts` + componente `BentoGrid` |
| — | **Documentação** | Princípios, faça/evite, tokens do estilo | `FundamentosPage`, `DESIGN-SYSTEM.md`, `llms.txt` |

### 5.2 Tokens novos (Fase 1)

Todos os valores padrão reproduzem o visual atual.

| Token | Padrão (`corporativo`) | Uso |
|---|---|---|
| `--border-width` | `1px` | `border` (DEFAULT do Tailwind) |
| `--border-width-strong` | `2px` | `border-2` |
| `--card-border-width` | `var(--border-width)` | `Card` e superfícies equivalentes |
| `--control-border-width` | `var(--border-width)` | Input, select, textarea, botão outline, checkbox |
| `--radius-xl`, `--radius-2xl` | `0.75rem`, `1rem` (já existem) | Passam a alimentar `rounded-xl/2xl` |
| `--radius-3xl` | `1.5rem` | `rounded-3xl` |
| `--radius-card` | `var(--radius)` | `Card`, `Dialog`, `Popover` |
| `--radius-control` | `calc(var(--radius) - 2px)` | Botão, input, select, tabs |
| `--radius-control-brand` | `var(--radius)` | Variante `brand` do botão |
| `--radius-full` | `9999px` (já existe) | Avatar, switch, pill |
| `--shadow-ui-xs` … `--shadow-ui-2xl`, `--shadow-ui`, `--shadow-ui-inner` | Valores padrão do Tailwind 3 | `shadow-*` dos componentes (seção 12, decisão 1) |
| `--shadow-inset` | `none` | Campos e estados pressionados (neumorfismo, clay) |
| `--shadow-hover` | `var(--shadow-ui-md)` | Elevação de cards interativos no hover |
| `--card-alpha` | `1` | Translucidez de cards (glass) |
| `--surface-blur` | `0px` | `backdrop-filter` de cards e header |
| `--surface-pattern` | `none` | `background-image` do corpo da aplicação |
| `--brand-gradient` | degradê atual (valor exato por uso) | Substitui os 30 degradês fixos |
| `--font-black` | `900` | `font-black` |
| `--heading-transform` | `none` | h1–h4 |
| `--heading-weight-scale` | `1` | Reservado para estilos que pesam ou aliviam títulos |
| `--icon-stroke` | `2` | Traço dos ícones Lucide (`svg.lucide { stroke-width: var(--icon-stroke) }`) |
| `--ease-emphasis` | `cubic-bezier(0.4, 0, 0.2, 1)` | Motion de destaque |
| `--deco-hero`, `--deco-divider`, `--deco-pattern`, `--deco-texture` | `none` | Decoração (nível 3) |
| `--chart-line-width` | `2` | Linhas dos gráficos |
| `--chart-bar-radius` | `4` | Raio das barras (px) |
| `--chart-smooth` | `0` | Curvas suavizadas (`1` em orgânico e clay) |

Os pesos `--font-medium/semibold/bold/extrabold` já existem. A Fase 1 só os liga ao Tailwind.

### 5.3 Mapeamento no `tailwind.config.ts` (Fase 1, na origem)

```ts
theme: {
  extend: {
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "max(0px, calc(var(--radius) - 4px))",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      "3xl": "var(--radius-3xl)",
    },
    boxShadow: {
      xs: "var(--shadow-ui-xs)", sm: "var(--shadow-ui-sm)", DEFAULT: "var(--shadow-ui)",
      md: "var(--shadow-ui-md)", lg: "var(--shadow-ui-lg)", xl: "var(--shadow-ui-xl)",
      "2xl": "var(--shadow-ui-2xl)", inner: "var(--shadow-ui-inner)", none: "none",
    },
    borderWidth: { DEFAULT: "var(--border-width)", 2: "var(--border-width-strong)" },
    fontWeight: {
      light: "var(--font-light)", normal: "var(--font-regular)", medium: "var(--font-medium)",
      semibold: "var(--font-semibold)", bold: "var(--font-bold)",
      extrabold: "var(--font-extrabold)", black: "var(--font-black)",
    },
    transitionDuration: {
      DEFAULT: "var(--duration-normal)", 100: "var(--duration-fast)",
      200: "var(--duration-normal)", 300: "var(--duration-slow)", 500: "var(--duration-slower)",
    },
  },
}
```

Só esse arquivo torna sensíveis ao estilo ~147 sombras, ~620 raios, todas as bordas padrão e ~1.200 pesos de fonte, sem editar as páginas.

Exceções que pedem ajuste manual na origem:

- `shadow-primary/20` (2 usos): a cor de sombra do Tailwind não funciona com `var()`. Trocar por `shadow-[var(--shadow-brand)]`.
- `rounded-[…]` (13) e `shadow-[…]` (8): trocar por tokens ou registrar como intencionais.
- 30 degradês: trocar por `var(--brand-gradient)` ou por um token específico do bloco (ex.: `--brand-header-grad-*`, que já existe).

### 5.4 Ganchos nos componentes (Fase 1, na origem)

Raio e borda dos componentes passam a usar os tokens diretamente nas classes (ex.: `Card` com `rounded-[var(--radius-card)] border-[length:var(--card-border-width)]`; base do `Button` com `rounded-[var(--radius-control)]`). Assim, a maior parte dos estilos não precisa de CSS extra.

Para a camada CSS (nível 2), os componentes ganham um atributo estável `data-ds`:

`button`, `card`, `input`, `textarea`, `select-trigger`, `checkbox`, `radio`, `switch`, `badge`, `alert`, `dialog`, `popover`, `dropdown`, `tabs-list`, `tabs-trigger`, `table`, `sidebar`, `toast`, `tooltip`, `header`.

O `Button` também expõe `data-variant` com a variante do `cva`, para o CSS do estilo diferenciar `brand`, `outline`, `ghost` e `link`.

As superfícies de marca recebem `data-surface="marca"`: hero da `HomePage`, header do `DSLayout` e dos templates, painel visual de `PaginaAutenticacaoPage`, `CadastroPage`, `TwoFactorPage` e `ModalAcessoTemplatePage`, `ErrorPageTemplate`, `NotFound`, estados vazios, `FooterTemplate` e capa do `HubPaineisTemplate`. `HomePage` e `MarcaPage` vêm de `origem/overrides/`, então o gancho entra também lá.

### 5.5 Formato do preset

Os presets ficam na skill, e não no template, porque não vêm da origem:

```
skills/ds-build/assets/estilos/
  _schema.json              JSON Schema dos presets
  corporativo/preset.json   tokens: {} (não altera nada)
  minimalista/preset.json
  neobrutalismo/preset.json
  neobrutalismo/estilo.css
  grunge/preset.json
  grunge/estilo.css
  grunge/decoracao.json
  …
```

Exemplo (`neobrutalismo/preset.json`):

```json
{
  "$schema": "../_schema.json",
  "id": "neobrutalismo",
  "nome": "Neobrutalismo",
  "grupo": "ousados",
  "nivel": 2,
  "descricao": "Contornos grossos, sombras duras sem desfoque e cores saturadas da marca.",
  "tema_padrao": "light",
  "layout": "padrao",
  "fontes_sugeridas": { "primaria": ["Space Grotesk", "Lexend"], "display": ["Archivo Black"] },
  "degrade": false,
  "tokens": {
    ":root": {
      "--background": "{destaque.h} 60% 96%",
      "--border": "0 0% 7%",
      "--input": "0 0% 7%",
      "--border-width": "2px",
      "--border-width-strong": "3px",
      "--radius": "0.5rem",
      "--shadow-ui-sm": "2px 2px 0 0 hsl(var(--border))",
      "--shadow-ui": "3px 3px 0 0 hsl(var(--border))",
      "--shadow-ui-md": "4px 4px 0 0 hsl(var(--border))",
      "--shadow-ui-lg": "6px 6px 0 0 hsl(var(--border))",
      "--shadow-ui-xl": "8px 8px 0 0 hsl(var(--border))",
      "--shadow-hover": "6px 6px 0 0 hsl(var(--border))",
      "--font-semibold": "700",
      "--font-bold": "800",
      "--icon-stroke": "2.5",
      "--duration-normal": "120ms"
    },
    ".dark": {
      "--border": "0 0% 92%",
      "--input": "0 0% 92%"
    }
  },
  "css": "estilo.css",
  "contraste": {
    "pares_extras": [["--border", "--background", 3]]
  },
  "faca": ["Use as cores de apoio da marca para preencher cards e badges"],
  "evite": ["Sombras com desfoque", "Mais de três cores de preenchimento na mesma tela"]
}
```

**Expressões permitidas nos valores** (resolvidas pelo gerador com as cores do briefing):

| Expressão | Vira |
|---|---|
| `{primaria.h}`, `{secundaria.h}`, `{destaque.h}`, `{realce.h}` | Matiz da cor em graus |
| `{primaria}`, `{secundaria}`… | Triplet HSL completo da cor |
| `{neon}` | A cor mais saturada entre primária, secundária e destaque, levada a L 60% e S ≥ 80% |
| `var(--…)` | Mantido como está (referência a outro token) |

O `_schema.json` restringe as chaves de `tokens` a uma lista permitida. Um preset que tente alterar `--brand-primary-*` ou cores semânticas falha na validação.

### 5.6 Ordem no `generate-ds.mjs`

```
1. Copiar template
2. Placeholders e fontes
3. Recolorir por família de matiz            (marca)
4. ► Aplicar estilo                          (novo: lib/estilos.mjs)
     4a. resolver expressões do preset com as cores do briefing
     4b. setVar() em :root e .dark de src/index.css
     4c. copiar estilo.css para src/styles/estilo.css
     4d. gerar decoração (lib/decoracao.mjs) em public/estilo/
     4e. gravar src/config/estilo.ts (id, nome, tema padrão, layout)
     4f. degradê: false → --brand-gradient e --brand-header-grad-end = cor sólida
5. Contraste: correções da marca (regra atual) + mínimos do estilo (seção 10.3)
6. Espelhar tokenGroups.ts (inclui tokens não-cor)
7. Logos, favicon, módulos, marcas proibidas
8. GERACAO.md com a nova seção "Estilo visual"
```

O estilo entra **depois** da recoloração porque usa as cores finais da marca, e **antes** do contraste porque altera neutros e superfícies.

Com `corporativo`, a etapa 4 não grava nada além de `src/config/estilo.ts`, que já vem com esse mesmo conteúdo no template.

### 5.7 Tema padrão

`src/config/estilo.ts` (gerado):

```ts
export const ESTILO = {
  id: "corporativo",
  nome: "Corporativo",
  temaPadrao: "light",
  layout: "padrao",
} as const;
```

`useTheme` passa a usar `ESTILO.temaPadrao` quando não houver preferência no `localStorage`. O `index.html` recebe um script curto que aplica a classe `dark` antes da pintura, para evitar o "piscar" no cyberpunk.

### 5.8 Gráficos ECharts

`brandTheme.ts` passa a ler `--chart-line-width`, `--chart-bar-radius`, `--chart-smooth`, `--radius-card`, `--card-border-width` e `--shadow-ui-md`. Assim, barras, linhas, tooltip e legenda seguem o estilo sem mudar os 74 presets. Os `FALLBACKS` ganham esses tokens com os valores do `corporativo`.

### 5.9 Exportação para o Figma (DTCG)

`scripts/build-figma-tokens.mjs` e `schemas/tokens.schema.json` passam a exportar espessura de borda (`dimension`), sombras (`shadow`, inclusive `inset`), blur e alpha de superfície. O arquivo `public/design-system/manifest.json` ganha `estilo: { id, nome }`.

## 6. Especificação por estilo

Notação: **Tokens** lista só o que muda em relação ao `corporativo`. "Marca" = superfícies `data-surface="marca"`.

### 0. Corporativo (padrão, `corporativo`)

- **Intenção:** flat corporativo e neutro, o visual de hoje.
- **Tokens:** nenhum. Preset vazio.
- **Uso:** padrão quando o usuário não informa o estilo.

### 1. Minimalista (`minimalista`)

- **Intenção:** só o essencial, muito respiro, cor da marca usada com parcimônia.
- **Tokens:** `--radius: 0.25rem`; `--radius-card: 0.5rem`; todas as `--shadow-ui-*` = `none`, exceto `lg`/`xl` (popovers e modais) = `0 8px 24px hsl(0 0% 0% / 0.06)`; `--border: {primaria.h} 10% 92%`; `--font-bold: 600`; `--font-semibold: 500`; `--icon-stroke: 1.5`; `--duration-normal: 150ms`.
- **Superfícies:** sidebar e header em superfície clara (`--sidebar-background` e `--header-surface` neutros), em vez da primária.
- **Degradê:** desligado.
- **Fontes sugeridas:** Inter, Manrope.
- **Cuidados:** bordas claras demais falham 3:1 em campos. `--input` fica mais escuro que `--border`.

### 2. Suíço (`suico`)

- **Intenção:** grid rígido, tipografia como protagonista, hierarquia forte, um único acento.
- **Tokens:** `--radius: 0` (e `xl/2xl/3xl` = 0; `--radius-full` mantido para avatares); sombras = `none`; `--border: {primaria.h} 8% 80%`; `--font-bold: 700`; `--font-extrabold: 800`; tracking de h1–h3 mais fechado (−0.03em); h5/h6 em caixa alta com tracking largo.
- **Camada CSS:** linha de 2px em `--foreground` no topo das seções da documentação; numeração de seções em tabular nums.
- **Acento:** `--realce` vira o acento único de CTAs pontuais. A primária fica nas superfícies institucionais.
- **Fontes sugeridas:** Inter Tight, Archivo (a Helvetica não está no Google Fonts).

### 3. Flat (`flat`)

- **Intenção:** cores chapadas e saturadas, sem volume, cards separados por cor e não por borda.
- **Tokens:** `--radius: 0.25rem`; sombras = `none`; `--card-border-width: 0`; `--card: {primaria.h} 20% 97%` sobre `--background` branco; `--card-icon` com a secundária saturada.
- **Uso de cor:** botões secundários com `--secondary` cheia; badges com fundo sólido.
- **Fontes sugeridas:** Open Sans, Nunito Sans.

### 4. Material Design M3 (`material`)

- **Intenção:** superfícies tonais, elevação suave, botões em pílula e camadas de estado.
- **Tokens:** `--radius-control: 9999px` (botões e chips); `--radius-card: 0.75rem`; sombras de elevação do M3 (duas camadas cinza); `--card: {primaria.h} 30% 98%` (tom da superfície); `--card-border-width: 0`; `--font-semibold: 500`; `--ease-emphasis: cubic-bezier(0.2, 0, 0, 1)`; `--duration-normal: 200ms`.
- **Camada CSS:** camada de estado (overlay de 8% no hover e 12% no pressionado) em `[data-ds="button"]`, `[data-ds="tabs-trigger"]` e itens de menu; inputs no padrão "filled" (fundo tonal e borda inferior).
- **Fontes sugeridas:** Roboto, Roboto Flex.

### 5. Escandinavo (`escandinavo`)

- **Intenção:** minimalismo acolhedor, neutros quentes, formas suaves.
- **Tokens:** `--background: 36 30% 97%`; `--card: 36 25% 99%`; `--muted: 36 18% 93%`; `--border: 36 14% 86%`; `--radius: 0.75rem`; `--radius-card: 1rem`; sombras grandes com pouca opacidade e tinta quente (`hsl(30 20% 30% / 0.06)`); `--font-bold: 600`; `--duration-normal: 250ms`.
- **Superfícies:** sidebar e header claros e quentes.
- **Fontes sugeridas:** DM Sans, Nunito Sans.

### 6. Brutalista (`brutalista`)

- **Intenção:** cru, honesto, "padrão do navegador", estrutura à mostra.
- **Tokens:** todos os raios = 0, inclusive `--radius-full` (switch e avatar quadrados); sombras = `none`; `--background: 0 0% 100%`; `--foreground: 0 0% 0%`; `--border: 0 0% 0%`; `--border-width: 2px`; `--duration-*: 0ms`; `--icon-stroke: 2.5`.
- **Camada CSS:** links sempre sublinhados; botão `ghost`/`link` como link azul do navegador; hover inverte as cores (fundo `--foreground`, texto `--background`); foco com `outline: 3px solid` e deslocamento de 3px; rótulos e metadados em `ui-monospace` (pilha de sistema, sem baixar fonte).
- **Degradê:** desligado.
- **Fontes sugeridas:** IBM Plex Mono, Space Mono (só se o usuário quiser).
- **Cuidados:** contraste alto por natureza. Validar só o foco.

### 7. Neobrutalismo (`neobrutalismo`)

- **Intenção:** contorno preto grosso, sombra dura deslocada, cores fortes da marca.
- **Tokens:** ver exemplo na seção 5.5.
- **Camada CSS:** `[data-ds="button"]` e cards interativos com hover em `translate(-2px, -2px)` + `--shadow-hover`, e pressionado em `translate(2px, 2px)` + sombra `none`. Badges e cards de destaque preenchidos com secundária, destaque e realce.
- **Fontes sugeridas:** Space Grotesk, Lexend; display: Archivo Black.
- **Cuidados:** `prefers-reduced-motion` desliga o deslocamento.

### 8. Maximalista (`maximalista`)

- **Intenção:** muitas cores, padrões e camadas. "Mais é mais."
- **Tokens:** `--radius-card: 1.25rem`; `--radius-control: 9999px`; `--border-width: 2px`; sombras coloridas em camadas (`4px 4px 0 hsl({secundaria}), 8px 8px 0 hsl({primaria} / 0.4)`); `--font-extrabold: 900`; `--ease-emphasis: cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Decoração (marca):** padrões gerados (bolinhas, listras, zigue-zague) com primária, secundária, destaque, realce e a paleta estendida; títulos do hero em tamanho de display ampliado.
- **Sistema:** tabelas e formulários continuam com fundo liso.
- **Fontes sugeridas:** Bricolage Grotesque; display: Fraunces.
- **Cuidados:** texto nunca diretamente sobre padrão. Sempre há uma placa sólida atrás.

### 9. Grunge (`grunge`)

- **Intenção:** textura suja, tinta, recorte, estética de zine dos anos 90.
- **Tokens:** `--background: 40 15% 93%` (papel); `--foreground: 30 15% 10%`; `--radius: 0.125rem`; sombras de "tinta" (`2px 3px 0 hsl(30 15% 10% / 0.8)`); `--font-bold: 800`.
- **Decoração (marca):** ruído/papel gerado (SVG `feTurbulence` em data URI) com opacidade ≤ 6%; borda irregular por máscara SVG no hero e no painel de login; badges e "adesivos" com leve rotação (−1°).
- **Fontes sugeridas:** display: Bebas Neue, Special Elite.
- **Cuidados:** a textura nunca fica atrás de texto longo; rotação desligada com `prefers-reduced-motion`.

### 10. Art Nouveau (`art-nouveau`)

- **Intenção:** curvas orgânicas, ornamento delicado, inspiração botânica.
- **Tokens:** `--background: 45 40% 96%` (creme); `--border: 40 20% 78%`; raios assimétricos no hero e nos cards de marca (`2rem 0.5rem`); sombras suaves e quentes; `--duration-normal: 300ms`.
- **Decoração (marca):** divisórias com curva "chicote" e moldura floral geradas em SVG, na cor da primária com 40% de opacidade; moldura de linha dupla no painel de login.
- **Fontes sugeridas:** display: Cormorant Garamond; corpo: Lora.
- **Cuidados:** ornamentos só em divisórias e molduras, nunca dentro de componentes.

### 11. Bauhaus (`bauhaus`)

- **Intenção:** formas básicas, função acima da forma, composição assimétrica.
- **Tokens:** raios = 0 para retângulos e `--radius-full` para círculos (avatares e contêineres de ícone viram círculos); `--border-width: 2px`; `--border: 0 0% 8%`; sombras = `none`.
- **Decoração (marca):** composições de círculo, quadrado e triângulo geradas com primária, secundária e realce, em grid assimétrico no hero e no login.
- **Gráficos:** símbolos de série alternando círculo, quadrado e triângulo.
- **Fontes sugeridas:** Jost, League Spartan, Josefin Sans.

### 12. Construtivismo russo (`construtivismo`)

- **Intenção:** diagonais fortes, tom de cartaz, poucas cores.
- **Tokens:** raios = 0; `--background: 40 30% 93%`; `--border-width: 3px`; sombras = `none`; `--heading-transform: uppercase`; `--font-extrabold: 900`.
- **Decoração (marca):** faixas diagonais (`clip-path`), setas e barras geradas com primária e `--foreground`; título do hero inclinado em −6°.
- **Uso de cor:** só primária, `--foreground` e o fundo claro nas superfícies de marca.
- **Fontes sugeridas:** Oswald, Anton.
- **Cuidados:** inclinação só no hero; corpo de texto nunca em caixa alta.

### 13. Retrô / Vintage (`retro`)

- **Intenção:** anos 70: cores desbotadas, formas arredondadas, grão leve.
- **Tokens:** `--background: 38 45% 94%`; `--border: 25 30% 40%`; `--border-width: 2px`; `--radius: 1rem`; sombras deslocadas e quentes (`3px 3px 0 hsl(25 40% 30% / 0.35)`); dessaturação de 15% nas superfícies de marca.
- **Decoração (marca):** raios de sol e listras arredondadas geradas com as cores da marca dessaturadas; grão leve.
- **Fontes sugeridas:** display: DM Serif Display, Fraunces (eixo "soft").
- **Decisão em aberto:** década fixa (70) ou variante (`50`, `70`, `80`). Ver seção 12.

### 14. Neumorfismo (`neumorfismo`)

- **Intenção:** elementos que saltam do fundo, com luz e sombra suaves na mesma cor.
- **Tokens:** `--background`, `--card` e `--muted` = `{primaria.h} 15% 91%` (mesma cor); `--card-border-width: 0`; `--radius: 1rem`; `--shadow-ui-md: 6px 6px 12px hsl({primaria.h} 15% 75%), -6px -6px 12px hsl(0 0% 100%)`; `--shadow-inset: inset 3px 3px 6px hsl({primaria.h} 15% 75%), inset -3px -3px 6px hsl(0 0% 100%)`. Dark: fundo L 18%, sombra escura L 10%, sombra clara L 26%.
- **Camada CSS:** campos e estados pressionados com `--shadow-inset`; botão primário continua com a primária cheia (CTA claro).
- **Salvaguardas obrigatórias:** `--control-border-width: 1px` com borda de 3:1 sobre o fundo em todo controle; anel de foco sólido; texto nunca tingido.
- **Fontes sugeridas:** Nunito Sans, DM Sans.

### 15. Glassmorfismo (`glassmorfismo`)

- **Intenção:** vidro fosco sobre um fundo colorido.
- **Tokens:** `--surface-pattern` = malha de `radial-gradient` com primária, secundária e destaque; `--card-alpha: 0.55` (dark: `0.35`); `--surface-blur: 16px`; `--border: 0 0% 100% / 0.45` nos cards; `--radius-card: 1rem`; sombras grandes e suaves.
- **Camada CSS:** `[data-ds="card"]`, `dialog`, `popover` e `header` com `background: hsl(var(--card) / var(--card-alpha))` e `backdrop-filter: blur(var(--surface-blur)) saturate(140%)`. Em superfícies de sistema (tabelas, formulários), `--card-alpha: 0.85`.
- **Salvaguardas:** `@supports not (backdrop-filter: blur(1px))` e `@media (prefers-reduced-transparency: reduce)` deixam os cards opacos; o contraste do texto é medido contra o pior ponto do degradê de fundo (seção 10.3).
- **Fontes sugeridas:** Inter, Outfit.

### 16. Claymorfismo (`claymorfismo`)

- **Intenção:** 3D macio, como massinha.
- **Tokens:** `--background: {primaria.h} 60% 96%`; `--radius-card: 1.5rem`; `--radius-control: 9999px`; `--card-border-width: 0`; sombra externa colorida + realces internos (`8px 8px 18px hsl({primaria} / 0.25), inset -4px -4px 8px hsl({primaria} / 0.15), inset 4px 4px 8px hsl(0 0% 100% / 0.8)`); `--font-bold: 700`; `--ease-emphasis: cubic-bezier(0.34, 1.56, 0.64, 1)`; `--duration-normal: 250ms`; `--chart-smooth: 1`.
- **Camada CSS:** hover com `scale(1.02)` em cards e botões (desligado com `prefers-reduced-motion`).
- **Fontes sugeridas:** Nunito, Fredoka, Baloo 2.

### 17. Bento grid (`bento`)

- **Intenção:** blocos de tamanhos variados, como uma marmita japonesa.
- **Tokens (pele):** `--radius-card: 1.25rem`; `--card-border-width: 0`; `--background: {primaria.h} 10% 93%` com cards brancos; sombras = `none`; `--font-bold: 700`.
- **Layout (nível 4):** componente `BentoGrid` na origem (`src/components/layout/BentoGrid.tsx`), com células de 1×1, 2×1, 1×2 e 2×2. Com `ESTILO.layout === "bento"`, ganham versão em bento: `HomePage` (cards de navegação e status), `DashboardInstitucionalPage`, `DashboardAnaliticoPage`, `HubPaineisTemplate` e a visão geral da `TelaBIPage`. Bloco "herói" 2×2 com a primária; KPIs em 1×1; gráfico principal em 2×1.
- **Fontes sugeridas:** Inter, Manrope.
- **Cuidados:** a ordem do DOM segue a leitura lógica, não a posição visual; abaixo de 640px vira uma coluna.

### 18. Dark mode / Cyberpunk (`cyberpunk`)

- **Intenção:** fundo escuro, neon, estética futurista.
- **Tema padrão:** `dark`. O light continua existindo, em versão de alto contraste com o neon escurecido.
- **Tokens (.dark):** `--background: 240 30% 5%`; `--card: 240 25% 8%`; `--border: {neon} / 0.5`; `--ring: {neon}`; sombras com brilho (`0 0 12px hsl({neon} / 0.45)`); raios 0–2px.
- **Camada CSS:** cantos cortados em cards (`clip-path`); rótulos em `ui-monospace` com caixa alta; efeito "glitch" só no h1 do hero, desligado com `prefers-reduced-motion`.
- **Cor neon:** calculada pelo gerador (`{neon}`, seção 5.5), com aviso no `GERACAO.md` se nenhuma cor da marca for saturada o suficiente.
- **Fontes sugeridas:** JetBrains Mono, Space Mono; display: Orbitron.
- **Cuidados:** o brilho nunca é o único indicador de foco; texto neon precisa de 4.5:1 sobre o fundo escuro.

### 19. Orgânico / Natural (`organico`)

- **Intenção:** formas fluidas, tons terrosos, sensação natural.
- **Tokens:** `--background: 40 25% 96%`; `--foreground: {primaria.h} 25% 15%`; `--radius-card: 1.5rem`; raios assimétricos em imagens; `--card-border-width: 0`; sombras suaves; `--chart-smooth: 1`; `--duration-normal: 300ms`.
- **Decoração (marca):** "blobs" gerados com as cores da marca dessaturadas atrás do hero e do login; divisórias em onda; placeholders de imagem com máscara orgânica.
- **Fontes sugeridas:** Outfit, Nunito; display: Fraunces, Lora.

### 20. Ilustrativo / Hand-drawn (`ilustrativo`)

- **Intenção:** ilustrações autorais como protagonistas, com personalidade e calor.
- **Tokens:** `--radius: 0.75rem`; `--border-width: 1.5px`; sombras suaves; `--font-bold: 600`; `--icon-stroke: 1.75`.
- **Decoração (marca):** espaços de ilustração (`public/estilo/ilustracoes/`) para hero, login, estados vazios, erro 404 e erro 500, com placeholders gerados nas cores da marca e um guia de ilustração na documentação (traço = `--border-width`, paleta = cores da marca e paleta estendida).
- **Pendência:** as ilustrações reais entram como pendência do `GERACAO.md`. O gerador não cria ilustrações (seção 12, decisão 9).
- **Fontes sugeridas:** Nunito, Fredoka; display: Baloo 2.

### 21. Colagem (`colagem`)

- **Intenção:** recortes de papel, foto e tipografia misturados, visual editorial.
- **Tokens:** raios = 0; `--background: 40 20% 95%`; sombra de papel (`2px 3px 0 hsl(0 0% 0% / 0.15)`); `--font-bold: 700`.
- **Decoração (marca):** textura de papel, retícula (halftone) gerada, formas recortadas com `clip-path` irregular, "fitas adesivas" decorativas e imagens levemente rotacionadas (−2° a 2°) no hero, no login e no Hub de painéis.
- **Fontes sugeridas:** display: DM Serif Display; rótulos: Space Mono.
- **Cuidados:** rotações desligadas com `prefers-reduced-motion`; nada rotacionado em superfícies de sistema.

## 7. Decoração gerada (nível 3)

`scripts/lib/decoracao.mjs` gera SVGs determinísticos a partir das cores da marca. A semente é o `slug`, então a mesma marca gera sempre a mesma decoração.

| Gerador | Estilos | Saída |
|---|---|---|
| `padrao(tipo)` (bolinhas, listras, zigue-zague) | maximalista | `public/estilo/padrao.svg` |
| `ruido()` (`feTurbulence`) | grunge, colagem, retrô | data URI em `--deco-texture` |
| `bordaIrregular()` | grunge, colagem | `public/estilo/borda.svg` (máscara) |
| `ornamento()` (curvas, moldura floral) | art nouveau | `divisoria.svg`, `moldura.svg` |
| `geometrico()` (círculo, quadrado, triângulo) | bauhaus | `hero.svg` |
| `diagonais()` (faixas, setas) | construtivismo | `hero.svg` |
| `raiosDeSol()` | retrô | `hero.svg` |
| `blobs()`, `onda()` | orgânico | `hero.svg`, `divisoria.svg` |
| `retícula()` | colagem | `--deco-pattern` |
| `placeholderIlustracao(tema)` | ilustrativo | `public/estilo/ilustracoes/*.svg` |

Os arquivos são referenciados por `--deco-hero`, `--deco-divider`, `--deco-pattern` e `--deco-texture`, aplicados pela camada CSS só em `[data-surface="marca"]`. O `decoracao.json` de cada preset escolhe os geradores e os parâmetros. O tamanho total da decoração fica limitado a 200 KB.

## 8. Questionário e briefing

### 8.1 Nova pergunta

| # | Campo | Pergunta | Respostas aceitas |
|---|---|---|---|
| 13 | `estilo` | Qual estilo visual o DS deve seguir? | id de um preset (`minimalista`, `neobrutalismo`…) ou `"corporativo"`. **Sem resposta = `"corporativo"`** |

Ela entra **antes das cores** (as atuais 13–30 viram 14–31, total de 31 perguntas). O estilo influencia o que o agente propõe nas cores (ex.: o neobrutalismo pede uma secundária saturada) e nas fontes (sugestões do preset).

### 8.2 Como perguntar

A ferramenta de perguntas aceita de 2 a 4 opções por chamada, e o catálogo tem 22 estilos. Por isso a pergunta é feita em duas etapas:

1. **AskUserQuestion**, uma pergunta:
   - "Manter o estilo atual (Recomendado)": corporativo flat, o visual de hoje;
   - "Escolher outro estilo";
   - "Ver a comparação antes de escolher".
2. Se o usuário quiser escolher ou comparar, o agente roda `node scripts/catalogo-estilos.mjs --brief <briefing.json> --out <pasta>/catalogo-estilos.html`. O script gera uma página com **a mesma tela** (card de saldo, botão primário, input, badge e tabela curta) em cada estilo, já com as cores da marca se o briefing tiver. O agente mostra a página e a lista agrupada (seção 4) e pede a resposta pelo nome.
3. Se a resposta for vaga ("algo moderno", "mais divertido"), o agente oferece de 2 a 4 estilos compatíveis em uma nova AskUserQuestion.

### 8.3 Regra do padrão no questionário

A regra "nunca assuma respostas" ganha **uma exceção explícita, só para `estilo`**:

- "tanto faz", "não sei", "pode seguir" ou pular a pergunta → grava `"estilo": "corporativo"` e informa: "Vou manter o estilo atual (corporativo)."
- O resumo final sempre mostra o estilo, mesmo quando é o padrão, e o usuário confirma junto com o resto.

### 8.4 Argumentos do comando

```text
/ds-build Agência Horizonte --estilo neobrutalismo
/ds-build briefings/horizonte.json                 # sem "estilo" no JSON → corporativo
```

Quando o argumento traz `--estilo`, a pergunta 13 já está respondida.

### 8.5 Validação (`scripts/lib/briefing.mjs`)

- `estilo` ausente, `null`, `""` ou com `PREENCHER` → **não é pendência**; o validador imprime: `Estilo não informado: será usado o padrão (corporativo).`
- `estilo` com um id que não existe em `assets/estilos/` → **pendência** ("resposta inválida"), com a lista de ids válidos. O usuário informou algo, então o agente pergunta de novo.
- `normalizarBriefing` grava `estilo: "corporativo"` quando o campo estiver ausente.
- O gerador aceita `--estilo <id>`, que sobrescreve o briefing (usado na matriz de testes).

### 8.6 Modelo de briefing

Em `assets/brand-brief.template.json`, antes de `cores`:

```json
"estilo": "PREENCHER: id do estilo visual (ver references/estilos.md), ou \"corporativo\" para manter o estilo atual. Se ficar sem resposta, a skill usa \"corporativo\".",
```

`assets/examples/exemplo-verde.json` continua **sem** o campo, para provar a regra do padrão. Um exemplo novo, `exemplo-neobrutalismo.json`, mostra o campo preenchido.

## 9. Mudanças por arquivo

### 9.1 Origem (`aislansf/ds-sebrae`, `frontend/`)

| Arquivo | Mudança | Fase |
|---|---|---|
| `tailwind.config.ts` | Mapeamentos da seção 5.3 | 1 |
| `src/index.css` | Tokens novos (seção 5.2) em `:root` e `.dark`; `svg.lucide { stroke-width: var(--icon-stroke) }`; `@import "./styles/estilo.css"` no fim | 1 |
| `src/styles/estilo.css` | Novo, vazio | 1 |
| `src/components/ui/*.tsx` | Raio e borda por token; `data-ds` e `data-variant` (seção 5.4) | 1 |
| Páginas e templates com degradê, `rounded-[…]`, `shadow-[…]`, `shadow-primary/20` | Troca por tokens (triagem da seção 5.3) | 1 |
| Superfícies de marca | `data-surface="marca"` | 1 |
| `src/config/estilo.ts` | Novo, com `corporativo` | 1 |
| `src/hooks/useTheme.ts` e `index.html` | Tema padrão vindo de `ESTILO` e script anti-"piscar" | 1 |
| `src/data/tokenGroups.ts` | Entradas dos tokens novos | 1 |
| `src/lib/echarts/brandTheme.ts` | Leitura dos tokens de gráfico (seção 5.8) | 1 |
| `scripts/build-figma-tokens.mjs`, `schemas/tokens.schema.json` | Novos tipos de token (seção 5.9) | 1 |
| `src/components/layout/BentoGrid.tsx` + páginas da seção 6.17 | Variante bento | 5 |
| `src/pages/FundamentosPage.tsx` | Seção "Estilo visual" lendo `ESTILO` e `public/design-system/estilo.json` | 6 |

O visual do DS Sebrae não muda em nenhuma dessas alterações (seção 10.1).

### 9.2 Repositório `ds-generation` (fora da skill)

| Arquivo | Mudança | Fase |
|---|---|---|
| `origem/overrides/src/pages/HomePage.tsx`, `MarcaPage.tsx` | Mesmos ganchos `data-surface` e variante bento da origem | 1 e 5 |
| `origem/ds-sebrae.json` | Regras novas, se a extração precisar (ex.: `src/config/estilo.ts` sem regra) | 1 |
| `tools/golden/` (novo) | Linha de base visual e de arquivos | 0 |
| `tools/verificar-identidade.mjs` (novo) | Compara a geração com a linha de base | 0 |
| `tools/matriz-estilos.mjs` (novo) | Gera, compila e testa cada estilo em light e dark | 7 |
| `tools/imagens-neutras.mjs` | Opção `--estilo` para capturar miniaturas por estilo | 6 |
| `README.md`, `docs/HANDOFF.md` | Estilos, 31 perguntas, regra do padrão | 6 |

### 9.3 Skill `ds-build`

| Arquivo | Mudança | Fase |
|---|---|---|
| `SKILL.md` | Pergunta 13, exceção da regra do padrão, catálogo, `--estilo`, revisão visual por estilo | 2 |
| `assets/brand-brief.template.json` | Campo `estilo` | 2 |
| `assets/examples/exemplo-neobrutalismo.json` | Novo | 2 |
| `assets/estilos/**` | `_schema.json` + 22 presets | 2 a 5 |
| `scripts/lib/briefing.mjs` | Pergunta, validação e normalização (seção 8.5) | 2 |
| `scripts/lib/estilos.mjs` | Novo: carregar, validar, resolver expressões, aplicar | 2 |
| `scripts/lib/decoracao.mjs` | Novo (seção 7) | 4 |
| `scripts/generate-ds.mjs` | Etapa 4 (seção 5.6), `--estilo`, seção do `GERACAO.md` | 2 |
| `scripts/validar-briefing.mjs` | Mensagem do estilo padrão | 2 |
| `scripts/validar-contraste.mjs` | Pares extras do preset e composição com alpha | 3 |
| `scripts/catalogo-estilos.mjs` | Novo (seção 8.2) | 6 |
| `scripts/capturar-miniaturas.mjs` | Novo, opcional: recaptura as miniaturas de Templates no DS gerado | 6 |
| `references/estilos.md` | Novo: catálogo, especificações, faça/evite | 2 |
| `references/tokens.md`, `geracao.md`, `arquitetura.md`, `checklist-marca.md`, `reescrita-semantica.md` | Tokens novos, etapa do estilo, camadas, checklist por estilo, textos que mencionam o estilo (princípios da Home) | 2 e 6 |

### 9.4 Nova seção do `GERACAO.md`

```
## Estilo visual: Neobrutalismo (neobrutalismo)
- Tokens alterados: 18 (:root), 2 (.dark)
- Camada CSS: src/styles/estilo.css
- Decoração gerada: (nenhuma)
- Tema padrão: light
- Ajustes de contraste do estilo: …
- Pendências do estilo: miniaturas de Templates; fontes sugeridas não adotadas (Space Grotesk)
```

## 10. Testes e critérios de aceite

### 10.1 Identidade

- **Antes da Fase 1:** gerar `exemplo-verde.json` e `tools/marca-neutra.json` com o gerador atual e guardar em `tools/golden/` os arquivos gerados e capturas Playwright das rotas `/`, `/fundamentos`, `/componentes`, `/templates`, `/graficos/barras` e três templates standalone, em light e dark.
- **Depois da Fase 1:** as capturas precisam ser idênticas pixel a pixel. Os arquivos mudam (o `tailwind.config.ts` mudou), mas o resultado visual não.
- **Depois da Fase 2:** gerar sem `estilo` e com `"estilo": "corporativo"` produz pastas **idênticas byte a byte**, e iguais à geração da Fase 1.

### 10.2 Matriz de estilos

`tools/matriz-estilos.mjs` gera os 22 estilos com uma marca de teste e roda, para cada um: `npm run build`, `npx vitest run`, `validar-contraste.mjs` e capturas em light e dark das rotas-chave. Sai uma tabela-resumo (passou, falhou e avisos) e uma galeria HTML para revisão humana.

### 10.3 Contraste por estilo

Além da regra atual da marca ("só corrige o que piorou"), cada estilo passa por mínimos fixos:

- texto sobre `--background`, `--card`, `--muted` e superfícies de marca: 4.5:1;
- borda de controles (`--input`) sobre o fundo: 3:1 (WCAG 1.4.11);
- anel de foco sobre o fundo: 3:1;
- glass: texto sobre o card composto com `--card-alpha` contra a cor mais clara **e** a mais escura do degradê de fundo;
- cyberpunk: texto e borda neon sobre o fundo escuro;
- texturas (grunge, colagem, retrô): opacidade ≤ 6% atrás de texto.

Quando um mínimo falha, o gerador ajusta **só tokens do próprio estilo** (ex.: escurece `--input` no neumorfismo, aumenta `--card-alpha` no glass) e registra o ajuste. Se não conseguir, gera assim mesmo e registra um aviso no `GERACAO.md`.

### 10.4 Outros testes

- `_schema.json` valida os 22 presets (inclui a lista de chaves permitidas).
- Testes unitários de `estilos.mjs`: resolução de expressões, `{neon}`, `setVar` em `:root` e `.dark`, degradê desligado.
- `tokenGroups.validator.test.ts` cobre os tokens novos.
- Teste de `useTheme` com `temaPadrao: "dark"`.
- `prefers-reduced-motion` e `prefers-reduced-transparency` verificados nas capturas.

### 10.5 Critérios de aceite por fase

| Fase | Pronto quando |
|---|---|
| 0 | Linha de base reproduzível em duas execuções seguidas |
| 1 | Capturas idênticas à linha de base; triagem das exceções concluída; tokens novos no `/tokens` e no DTCG |
| 2 | Regra do padrão provada byte a byte; 5 estilos do nível 1 passam na matriz; questionário com 31 perguntas |
| 3 | 7 estilos do nível 2 passam na matriz e nos mínimos de contraste; tema padrão dark funciona sem "piscar" |
| 4 | 9 estilos do nível 3 passam; decoração só em superfícies de marca; decoração ≤ 200 KB |
| 5 | Bento nas 5 páginas, em uma coluna abaixo de 640px e com ordem de leitura correta |
| 6 | Catálogo usado no questionário; seção "Estilo visual" no DS gerado; documentação da skill atualizada |
| 7 | Matriz completa verde; galeria revisada por uma pessoa |

## 11. Fases de execução

| Fase | Entrega | Depende de | Tamanho |
|---|---|---|---|
| **0. Linha de base** | `tools/golden/` e `verificar-identidade.mjs` | — | P |
| **1. Tokenizar o esqueleto** | Seções 5.2 a 5.4 e 9.1 na origem; re-extração do template | 0 | G |
| **2. Motor de presets e pergunta** | `estilos.mjs`, schema, briefing, `SKILL.md`, `references/estilos.md`, `corporativo` + nível 1 (minimalista, suíço, flat, material, escandinavo) | 1 | M |
| **3. Camada CSS** | Nível 2: brutalista, neobrutalismo, neumorfismo, glassmorfismo, claymorfismo, cyberpunk e as camadas de estado do material; contraste por estilo | 2 | M |
| **4. Decoração** | `decoracao.mjs` e nível 3: maximalista, grunge, art nouveau, bauhaus, construtivismo, retrô, orgânico, ilustrativo, colagem | 2 | G |
| **5. Layout bento** | `BentoGrid` e as 5 páginas; preset `bento` | 1 e 2 | M |
| **6. Documentação e catálogo** | Seção no DS gerado, `catalogo-estilos.mjs`, miniaturas, gráficos, README e HANDOFF | 2 | M |
| **7. QA** | Matriz completa, galeria e revisão humana | 3, 4, 5 e 6 | M |

As Fases 3, 4, 5 e 6 podem correr em paralelo depois da Fase 2. Uma entrega intermediária útil é publicar a skill ao fim da Fase 2, com 6 estilos (padrão + nível 1), e acrescentar os demais por fase. Um estilo só aparece no catálogo e na pergunta quando passa na matriz.

## 12. Decisões em aberto

| # | Decisão | Recomendação |
|---|---|---|
| 1 | Sombras dos componentes: manter as do Tailwind (`--shadow-ui-*`) ou unificar com as `--shadow-*` tingidas da marca | Manter separadas na v1 (preserva a identidade); unificar depois, como mudança visual consciente na origem |
| 2 | Estilos podem carregar uma fonte própria (ex.: mono do cyberpunk)? | Não. Usar pilhas de sistema (`ui-monospace`, `ui-serif`) para rótulos; fontes do Google só se o usuário escolher na pergunta de fontes |
| 3 | Retrô com década fixa ou variante | Fixar anos 70 na v1; variante `decada` depois, se houver pedido |
| 4 | Material M2 ou M3 | M3 (atual e mais próximo de shadcn) |
| 5 | DS gerado com seletor de estilos em tempo de execução | Não: só o estilo escolhido é aplicado. A seção "Estilo visual" mostra a comparação estática dos outros |
| 6 | Combinação de estilos (ex.: suíço com toques de neobrutalismo) | Fora da v1. Na v2, `estilo: { base, acentos: [] }` |
| 7 | Densidade (espaçamento) por estilo | Fora da v1: mudar `--space-*` pode quebrar templates. Avaliar `densidade: compacta/confortavel` depois |
| 8 | Bento só em Home e dashboards ou também nas páginas de documentação | Só Home, dashboards, Hub e Tela BI |
| 9 | Ilustrativo: gerar ilustrações com modelo de imagem ou só deixar espaços | Só espaços e guia na v1; geração como etapa opcional depois |
| 10 | Miniaturas da página Templates: capturar por estilo na skill (22 × 8 imagens) ou no DS gerado | No DS gerado, com `capturar-miniaturas.mjs` na etapa de revisão visual |

## 13. Fora do escopo

**Art Déco, Memphis, Y2K e Skeuomorfismo** não entram neste plano. Os quatro dependem de ornamento pesado, brilhos, cromados, texturas fotográficas ou relevo realista, que funcionam em peças de marca e campanha, mas degradam a leitura e a manutenção de um sistema inteiro. O formato de preset (nível 3) permite acrescentá-los depois sem mudar a arquitetura.

Também ficam fora da v1: combinação de estilos, densidade por estilo, seletor de estilo em tempo de execução e geração automática de ilustrações (seção 12).

## 14. Riscos

| Risco | Mitigação |
|---|---|
| Classes fixas nos templates fazem o estilo "pegar pela metade" | Mapeamento no Tailwind (Fase 1) cobre a maior parte; triagem das exceções; capturas da matriz mostram o que sobrou |
| Quebrar a identidade do DS Sebrae ou da geração atual | Linha de base (Fase 0) e verificação pixel a pixel e byte a byte |
| Acessibilidade em neumorfismo, glass, cyberpunk e texturas | Salvaguardas nos presets e mínimos fixos de contraste (seção 10.3) |
| Estilos expressivos atrapalham telas de sistema | Decoração só em `data-surface="marca"` |
| Manutenção: 22 presets acompanhando a evolução da origem | Matriz de estilos rodando a cada re-extração do template; estilo que quebra sai do catálogo até ser corrigido |
| `backdrop-filter` pesado em máquinas fracas | Blur só em cards, header e modais; `@supports` e `prefers-reduced-transparency` |
| Edições da origem (Lovable) removem `data-ds` ou `data-surface` | Teste na origem que falha se algum componente perder o gancho |
| Miniaturas de Templates desatualizadas | Pendência no `GERACAO.md` e script de recaptura |
| O questionário fica mais longo | Uma pergunta só, com o padrão como primeira opção e sem bloquear a geração |
