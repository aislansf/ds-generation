# Ganchos data-ds nos elementos montados à mão

Relatório gerado por `node tools/tokenizar-template.mjs --relatorio` (codemod de `tools/lib/ganchos.mjs`, R1 de `docs/PLANO-ESTILOS.md`).
Os elementos da lista de revisão não ganharam gancho: o padrão de classes não decide sozinho o que eles são.
Os "fora do escopo" também não, mas de propósito: a camada CSS dos estilos não tem o que pintar neles (item de menu lateral, fundo do menu móvel, barra com bg-card, campo dentro de um contêiner com borda, botão só de layout).
Para cobrir um elemento, ajuste as regras de `tools/lib/ganchos.mjs` (nunca o template à mão) e rode de novo.

## Elementos com data-ds no template

| Gancho | Elementos |
|---|---|
| `button` | 304 |
| `card` | 97 |
| `input` | 61 |
| `select-trigger` | 18 |
| `tabs-trigger` | 5 |
| `textarea` | 5 |
| `popover` | 2 |
| `sidebar` | 2 |
| `switch` | 2 |
| `alert` | 1 |
| `badge` | 1 |
| `checkbox` | 1 |
| `dialog` | 1 |
| `dropdown` | 1 |
| `header` | 1 |
| `radio` | 1 |
| `table` | 1 |
| `tabs-list` | 1 |
| `toast` | 1 |
| `tooltip` | 1 |

## Ganchos acrescentados nesta execução (0)

| Gancho (variante) | Elementos |
|---|---|
| — | 0 |

## Fora do escopo, de propósito (39)

| Motivo | Elementos |
|---|---|
| \<button>: item de menu lateral (usa os tokens --sidebar-*, que o estilo já troca) | 18 |
| \<div>: barra ou faixa com bg-card (borda de um lado só, sem cantos), não é card | 11 |
| \<button>: fundo do menu móvel (scrim), sem aparência de botão | 5 |
| \<button>: botão só de layout, sem cor, borda nem hover próprios | 3 |
| \<input>: campo interno de um contêiner com borda (o contêiner é que parece o campo) | 2 |

## Lista de revisão (0)

| Motivo | Elementos |
|---|---|
| — | 0 |

| Arquivo | Elemento | Motivo | Classes |
|---|---|---|---|

