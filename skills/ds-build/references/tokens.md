# Contrato de tokens

A fonte da verdade dos valores é `src/index.css`. O `tailwind.config.ts` só mapeia tokens para utilitários, e `src/data/tokenGroups.ts` espelha os valores para a página `/tokens`. O teste `src/data/__tests__/tokenGroups.validator.test.ts` falha se o espelho divergir do CSS, inclusive nos HEX.

## Formato

- Cores são **triplets HSL sem `hsl()`**, no padrão shadcn: `--primary: 228 70% 51%;`. Use sempre `hsl(var(--primary))` ou `hsl(var(--primary) / 0.2)`.
- Light mode em `:root`, dark mode em `.dark` (o tema é aplicado por classe no `<html>`; chave `brand-ds-theme` no localStorage, via `src/hooks/useTheme.ts`).
- Tokens não-cor (espaço, tipografia, sombras, raios, z-index, motion) só existem em `:root`, exceto as sombras, que têm versão dark.

## Cores de marca (escala)

| Token | Uso |
|---|---|
| `--brand-primary` | Cor institucional exata |
| `--brand-primary-50` … `-700` | Escala da primária: 50–200 superfícies, 300–400 bordas/realces, 500 base, 600–700 texto e hover |
| `--brand-secondary`, `--brand-secondary-50` … `-600` | Escala de apoio (no template, ciano 196°). Por herança, `--brand-secondary` sem sufixo é alias do azul |
| `--brand-comp-*` | Cores complementares para gráficos e ilustrações (amarelo, dourado, vermelho, índigo, lima) |
| `--brand-btn-fg`, `--brand-btn-hover` | Botão institucional: texto de destaque sobre a primária e o hover dela |

Tailwind: `bg-brand-primary`, `bg-brand-primary-50`, `text-brand-secondary-600`…

Para gerar uma escala a partir de um HEX: `node scripts/gerar-escala.mjs "#0B7A4B"`.

## Cores semânticas (shadcn + extensões)

| Par | Observação |
|---|---|
| `--background` / `--foreground` | Fundo neutro frio (210°) e texto na matiz da primária, bem escuro |
| `--card`, `--popover` (+ `-foreground`) | |
| `--primary` / `--primary-foreground` | Primária = cor da marca |
| `--secondary` / `--secondary-foreground` | |
| `--muted` / `--muted-foreground` | Neutros levemente azulados |
| `--accent` / `--accent-foreground` | Tint claríssimo da primária (hover de itens, seleção) |
| `--card-icon` / `--card-icon-foreground` | Superfície dos ícones em cards |
| `--destructive` | Igual a `--error` |
| `--success`, `--warning`, `--error`, `--info` (+ `-foreground`, `-bg`) | Feedback: cor, texto sobre a cor e fundo suave |
| `--border`, `--input`, `--ring` | `--ring` = primária |
| `--sidebar-*` | Sidebar do site (fundo = primária 600 no light) |
| `--header-surface`, `--header-surface-foreground`, `--header-surface-border` | Barra superior clara com tinta da primária |

Tailwind: `bg-primary`, `text-muted-foreground`, `bg-success-bg`, `text-header-foreground`, `bg-sidebar`…

## Não-cor

| Grupo | Tokens | Tailwind |
|---|---|---|
| Espaço (base 4px) | `--space-0` … `--space-32` | `p-4`, `gap-6`… (a escala do Tailwind foi trocada pelos tokens) |
| Tamanho de fonte | `--text-xs` (13px) … `--text-7xl` (76px): escala ampliada em +1–2pt | `text-sm`… |
| Entrelinha | `--leading-xs` … `--leading-7xl`, `--leading-tight` … `--leading-loose` | pareada com `text-*` |
| Tracking | `--tracking-tighter` … `--tracking-widest` | `tracking-*` |
| Peso | `--font-light` … `--font-extrabold`, `--font-black` | `font-*` |
| Sombras de marca | `--shadow-xs` … `--shadow-xl` (tinta da primária no light, preto no dark) | via CSS (`.brand-card`) |
| Sombras de componente | `--shadow-ui`, `--shadow-ui-xs` … `--shadow-ui-2xl`, `--shadow-ui-inner` (padrão do Tailwind) | `shadow-*` |
| Raio | `--radius` (0.375rem), `--radius-sm` … `--radius-full`, `--radius-3xl`; `--radius-card`, `--radius-control`, `--radius-control-brand` | `rounded-lg/md/sm` derivam de `--radius`; `rounded-xl/2xl/3xl/full` usam os seus |
| Borda | `--border-width` (1px), `--border-width-strong` (2px), `--card-border-width`, `--control-border-width` | `border`, `border-2` |
| Camadas | `--z-dropdown` 100 … `--z-toast` 500 | |
| Motion | `--duration-*` (inclui `--duration-default`, 150ms), `--ease-*` | `transition`, `duration-100/200/300/500` |
| Estilo visual | `--card-alpha`, `--surface-blur`, `--surface-pattern`, `--icon-stroke`, `--chart-*`, `--heading-transform`, `--deco-*` | camada `src/styles/estilo.css` e tema ECharts |

Os tokens de raio, borda, sombra de componente, peso e motion são os **tokens de pele**: o estilo visual escolhido no briefing troca os seus valores (ver `estilos.md`). Com o estilo `corporativo` eles reproduzem o visual de sempre. Aparecem no grupo "Estilo visual" de `/tokens`.

## Tipografia semântica

- Fontes: `font-sans` (primária), `font-heading`/`font-display` (display), `font-system`/`font-lato` (sistema). O alias legado `font-poppins` aponta para a primária.
- Headings: `h1` 3rem/900 com cor institucional fixa; `h2`/`h3` usam `--ds-heading-section-*`, `h4` usa `--ds-heading-subsection-*`, `h5`/`h6` usam `--ds-heading-eyebrow-*` (caixa alta).
- Parágrafos: `.ds-body-lead`, `.ds-body`, `.ds-body-small`. `p` sem classe herda `.ds-body`. O script `check:legacy-typography` barra `<p>` com `text-*`/`leading-*` avulsos acima do baseline.

## Classes utilitárias de marca

`.brand-container`, `.brand-section`, `.brand-card` (+ `:hover` com elevação), `.brand-card-hover`, `.brand-badge` e as variantes `-primary`, `-secondary`, `-success`, `-warning`, `-error` e `-info`. Os templates HTML standalone usam BEM próprio: `.brand-sidebar__*`, `.brand-header__*`, `.brand-footer__*`.

## Cores fixas no código

Há ~500 cores fixas (`#hex` e triplets) espalhadas em páginas e templates, herança da documentação que mostra valores. **Não crie novas.** Na geração, elas são recoloridas por família (ver `geracao.md`). Se você adicionar um componente, use tokens.

## Regras ao alterar tokens

1. Altere `src/index.css` (`:root` e `.dark`). Para mudar forma, profundidade ou ritmo do DS inteiro, prefira trocar o estilo visual (ou o preset dele) e gerar de novo.
2. Atualize a entrada correspondente em `src/data/tokenGroups.ts`, incluindo `lightHex`/`darkHex`. Tokens de cor listados ali precisam ser triplets HSL sem alpha (`H S% L%`).
3. `npx vitest run src/data/__tests__/tokenGroups.validator.test.ts`.
4. `node <skill>/scripts/validar-contraste.mjs src/index.css`.
