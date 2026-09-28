# Como a geração funciona

## Extração (origem → template)

`scripts/extract-template.mjs` lê o briefing de origem (`assets/examples/sebrae-ce.json`, bloco `origem`) e monta regras aplicadas **nesta ordem** a todo arquivo de texto:

| Ordem | Regra | Exemplo |
|---|---|---|
| 0 | `substituicoes_conteudo` | `Sebraetec` → `Programa Inova` |
| 1 | URLs de manual, imagem OG e domínios | `sebrae-ce.dscreator.com.br` → `__DS_DOMAIN__` |
| 2 | Slogan, nome completo e variantes do nome | `SEBRAE-CE`, `Sebrae Ceará` → `__BRAND_NAME__` |
| 3 | Fontes | `Figtree` → `__FONT_PRIMARY__` |
| 4 | `aliases_codigo` | `sebrae-blue` → `brand-primary` |
| 5 | Nome curto como palavra | `SEBRAE`, `Sebrae` → `__BRAND_SHORT__` |
| 6 | Identificadores | `sebrae-card` → `brand-card`, `sebraeCor` → `brandCor`, `SebraeLogo` → `BrandLogo` |

Nomes de arquivo passam pela regra 6 (`sebrae-cor.svg` → `brand-cor.svg`). O cabeçalho de fontes do `index.css` vira o marcador `/* __FONT_IMPORTS__ */`. Os `.asset.json` e os SVGs de logo não passam pelas regras de texto, porque são substituídos na geração.

**Cores não viram placeholder.** O template guarda as cores de origem, e as famílias ficam registradas em `template.manifest.json`.

Critério de pronto: `remanescentes de "sebrae": 0`.

## Placeholders

| Placeholder | Campo do briefing | Padrão |
|---|---|---|
| `__BRAND_NAME__` | `nome` | — |
| `__BRAND_SHORT__` | `nome_curto` | `nome` |
| `__BRAND_FULL_NAME__` | `nome_completo` | `nome` |
| `__BRAND_SLOGAN__` | `slogan` | `descricao` |
| `__DS_DOMAIN__` | `dominios.ds` | `ds.<slug>.example` |
| `__ORG_DOMAIN__` / `__ORG_ROOT_DOMAIN__` | `dominios.org` / `dominios.org_raiz` | um cai no outro |
| `__BRAND_MANUAL_URL__` | `manual_marca_url` | `#` |
| `__OG_IMAGE_URL__` | `og_image_url` | favicon do DS |
| `__FONT_PRIMARY__`, `__FONT_DISPLAY__`, `__FONT_SYSTEM__` | `fontes.*.nome` | primária |

Com `genero: "f"`, as contrações antes do nome são ajustadas: do→da, no→na, pelo→pela, ao→à, o→a.

## Recoloração por família de matiz

Cada família tem uma cor de origem (HSL), uma janela de matiz e uma saturação mínima:

| Família | Origem | Janela | Sat. mín. | Alvo padrão |
|---|---|---|---|---|
| primaria | 228 70% 51% (`#2A4FDA`) | 204–252° | 30% | `cores.primaria` (obrigatória) |
| secundaria | 196 85% 45% (`#11A0D4`) | 180–204° | 30% | primária −32°, mesma proporção de saturação |
| destaque | 71 85% 79% (`#E7F79E`) | 58–84° | 40% | tint da primária (L 90%) |
| realce | 33 81% 47% (`#D98217`) | 31–35.5° | 60% | mantém (só recolore se `cores.realce` existir) |

Para cada `#RRGGBB` e cada triplet `H S% L%` em arquivos de texto:

1. Tons quase brancos ou quase pretos (L ≥ 90 ou L ≤ 15) só entram numa família com saturação ≥ 45%, para os neutros ficarem neutros.
2. A cor que cai numa janela é transportada: a matiz mantém o deslocamento em relação à cor de origem, a saturação é multiplicada por `S_alvo / S_origem` e a luminosidade desloca `L_alvo − L_origem`, com peso que zera para tons 40 pontos distantes da base. Assim a escala mantém a estrutura clara → escura.
3. Correspondência exata com a cor de origem vira exatamente a cor-alvo.
4. Semânticas (verde de sucesso, vermelho de erro, âmbar de aviso) e neutros ficam fora das janelas e não mudam.

Propriedade garantida: gerar com o briefing de origem não altera nenhuma cor (ida e volta = identidade).

Depois da recoloração, o gerador:

- reescreve `lightHex`/`darkHex` de `tokenGroups.ts` com o mesmo algoritmo do teste;
- troca `--primary-foreground`, `--secondary-foreground` e `--brand-btn-fg` pelo tom escuro do foreground **somente se** o contraste da nova marca ficou abaixo do mínimo **e** pior que o da origem. Decisões de design que a origem já tinha não são "corrigidas".

### Ajustando

- Um tom da origem não foi recolorido e deveria: amplie a `janela` da família no briefing de origem, rode `extract-template.mjs` e gere de novo.
- Um tom foi recolorido e não deveria (ex.: um âmbar semântico caiu em "realce"): estreite a janela ou suba `saturacao_minima`.
- Para uma família nova (ex.: uma terceira cor institucional), adicione-a em `origem.familias` e a cor-alvo em `cores.<nome>` do briefing de destino. Sem cor-alvo, a família fica como está.

## Logos, favicon e imagens

- `logos.cor|branco|preto`: SVG usado direto; PNG/JPG é embutido num SVG. Sem logo, o gerador cria um logotipo tipográfico com o nome curto. Destinos: `public/marca/brand-{cor,white,black}.svg`, a cópia em `src/assets/marca/`, os `.asset.json` e `src/assets/brand-logo-white*.svg`.
- `favicon`: PNG é copiado; sem PNG, é gerado um monograma em `public/favicon.svg` e as referências são atualizadas.
- Demais `.asset.json` (hospedados no CDN da Lovable do projeto de origem, que não funcionam em outro projeto) viram SVGs com gradiente primária→secundária em `public/placeholders/`.
- `.jpg` em `src/assets/` são copiados como estão e listados no `GERACAO.md` para troca.

## Marcas proibidas

`scripts/legacy-brand.config.json` = prefixo da origem + `termos_proibidos`, tirando qualquer termo contido no nome, slug ou domínios da nova marca. O `check-legacy-brand.mjs` roda no build e ignora `GERACAO.md`, a própria config e `reports/`.
