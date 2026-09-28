# Como a geração funciona

## Template

`assets/template/` é um DS completo e neutro: textos com placeholders, logos genéricos ("Sua Marca"), imagens genéricas e dados de exemplo fictícios (programas como "Empreender" e "Programa Inova", unidades como "DIROP"). **Não edite à mão**: ele é regenerado na manutenção da skill.

**Cores não viram placeholder.** O template guarda uma paleta de referência (azul), e as famílias de cor ficam registradas em `template.manifest.json`.

## Placeholders

| Placeholder | Campo do briefing | Resposta de "não se aplica" |
|---|---|---|
| `__BRAND_NAME__` | `nome` | — |
| `__BRAND_SHORT__` | `nome_curto` | — |
| `__BRAND_FULL_NAME__` | `nome_completo` | — |
| `__BRAND_SLOGAN__` | `slogan` | — |
| `__DS_DOMAIN__` | `dominios.ds` | — |
| `__ORG_DOMAIN__` / `__ORG_ROOT_DOMAIN__` | `dominios.org` / `dominios.org_raiz` | `org_raiz: false` usa o `org` |
| `__BRAND_MANUAL_URL__` | `manual_marca_url` | `false` vira `#` |
| `__OG_IMAGE_URL__` | `og_image_url` | `false` usa o favicon do DS |
| `__FONT_PRIMARY__`, `__FONT_DISPLAY__`, `__FONT_SYSTEM__` | `fontes.*.nome` | `display`/`sistema: false` usam a primária |
| `__FONT_DISPLAY_URL__` | `fontes.display.url_woff2` | `display: false` usa a da primária; sem arquivo, `/fonts/display-bold.woff2` |
| `__BRAND_PRIMARY_HUE__` | matiz de `cores.primaria` (graus) | — |

Com `genero: "f"`, as contrações antes do nome são ajustadas: do→da, no→na, pelo→pela, ao→à, o→a.

## Textos de tipografia

O template descreve a primária e a sistêmica como Google Fonts e a display como proprietária. O gerador (`scripts/lib/fontes.mjs`) reescreve esses trechos pela resposta de `fontes.*.google` de cada papel (display e sistema com `false` seguem a primária):

- `FundamentosPage.tsx`: em cada card de fonte, a origem ("Google Fonts · Open Source" ou "Proprietária"), a nota de rodapé, os links de download e o carregamento nos snippets (`@import`/`<link>` do Google ou `@font-face` com o `url_woff2`); também o bloco "Uso da tipografia" e a descrição da seção;
- `index.html`: o preload do Google Fonts fica só para as fontes de lá, com a mesma URL que o `index.css` importa, e os comentários citam só essas fontes.

Se um card continuar citando a origem errada (o template mudou e as regras não acharam o trecho), o `GERACAO.md` avisa.

## Recoloração por família de matiz

Cada família tem uma cor de referência (HSL), uma janela de matiz e uma saturação mínima:

| Família | Referência | Janela | Sat. mín. | Alvo |
|---|---|---|---|---|
| primaria | 228 70% 51% (`#2A4FDA`) | 204–252° | 30% | `cores.primaria` |
| secundaria | 196 85% 45% (`#11A0D4`) | 180–204° | 30% | `cores.secundaria`; com `"derivar"`, primária −32° e mesma proporção de saturação |
| destaque | 71 85% 79% (`#E7F79E`) | 58–84° | 40% | `cores.destaque`; com `"derivar"`, tint da primária (L 90%) |
| realce | 33 81% 47% (`#D98217`) | 31–35.5° | 60% | `cores.realce`; com `"manter"`, fica como está |

Para cada `#RRGGBB`, `rgb()` e triplet `H S% L%` em arquivos de texto:

1. Tons quase brancos ou quase pretos (L ≥ 90 ou L ≤ 15) só entram numa família com saturação ≥ 45%, para os neutros ficarem neutros.
2. A cor que cai numa janela é transportada: a matiz mantém o deslocamento em relação à cor de referência, a saturação é multiplicada por `S_alvo / S_ref` e a luminosidade desloca `L_alvo − L_ref`, com peso que zera para tons 40 pontos distantes da base. Assim a escala mantém a estrutura clara → escura.
3. Correspondência exata com a cor de referência vira exatamente a cor-alvo. Também vira `rgb()`/`rgba()` com componentes inteiros (o alfa fica).
4. **Âncoras** (`ancoras` da família no manifesto): cores que o template usa como a própria cor da marca em texto, como o `#005EB8` do H1 e dos validadores `check-homepage-h1-*`. Viram exatamente a cor do briefing; se ela não tiver 4.5:1 sobre branco, a mesma matiz escurecida até ter, com aviso no `GERACAO.md`.
5. **Referências por arquivo** (`referencias`): um arquivo que apresenta outra cor como "a cor da família". A `ColorSection` mostra `#5BA3D9` como cor primária e monta a escala 50–950 a partir dele; nesse arquivo, `#5BA3D9` vira a cor do briefing e o resto da família se desloca a partir dela.
6. Semânticas (verde de sucesso, vermelho de erro, âmbar de aviso) e neutros ficam fora das janelas e não mudam.

Depois da recoloração, o gerador:

- reescreve `lightHex`/`darkHex` de `tokenGroups.ts` com o mesmo algoritmo do teste;
- dá ao H1 uma cor própria no dark mode (`.dark h1`) quando a cor institucional não tem 4.5:1 sobre o `--background` escuro: a própria primária, se ela for legível ali, ou a cor do H1 clareada. Vale também na ida e volta, porque o template tem o mesmo problema;
- troca `--primary-foreground`, `--secondary-foreground` e `--brand-btn-fg` pelo tom escuro do foreground **somente se** o contraste da nova marca ficou abaixo do mínimo **e** pior que o do template. Decisões de design do template não são "corrigidas".

Âncoras e referências só valem quando a cor do briefing difere da de referência: gerar a origem com ela mesma não altera nenhuma cor.

### Ajustando

- Um tom não foi recolorido e deveria: amplie a `janela` da família em `assets/template/template.manifest.json` e gere de novo.
- Um tom foi recolorido e não deveria (ex.: um âmbar semântico caiu em "realce"): estreite a janela ou suba `saturacao_minima`.
- Para uma família nova (ex.: uma terceira cor institucional), adicione-a em `familias` do manifesto e a cor-alvo em `cores.<nome>` do briefing. Sem cor-alvo, a família fica como está.

## Logos, favicon e imagens

- `logos.cor|branco|preto`: SVG usado direto; PNG/JPG é embutido num SVG. Com `false`, o gerador cria um logotipo tipográfico provisório com o nome curto. Destinos: `public/marca/brand-{cor,white,black}.svg`, a cópia em `src/assets/marca/`, os `.asset.json` e `src/assets/brand-logo-white*.svg`.
- `favicon`: PNG ou SVG é copiado; com `false`, é gerado um monograma em `public/favicon.svg` e as referências são atualizadas.
- Os demais `.asset.json` viram composições abstratas (gradiente primária → secundária, sem texto) em `public/placeholders/`.
- Imagens em `src/assets/` são genéricas (logo "Sua Marca", fotos sem marca, capturas do template com a marca neutra) e ficam listadas no `GERACAO.md` para troca.

## Marcas proibidas

`scripts/legacy-brand.config.json` = `termos_proibidos` do briefing, tirando qualquer termo contido no nome, slug ou domínios da nova marca. O `check-legacy-brand.mjs` roda no build e ignora `GERACAO.md`, a própria config e `reports/`.
