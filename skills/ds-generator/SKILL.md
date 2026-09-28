---
name: ds-generator
description: Gera um Design System completo (site de documentação React/Vite/Tailwind/shadcn com tokens, componentes, templates de tela, páginas de marca, acessibilidade e validadores) para qualquer marca, a partir de um template neutro e de um briefing respondido pelo usuário. Use quando o usuário pedir para "criar um design system para a marca X", "gerar um DS", "montar o DS do cliente Y" ou "fazer um design system com a nossa identidade visual".
---

# ds-generator

Gera um Design System completo para uma marca: troca **nome, cores, fontes, logos e textos** de um template neutro e mantém a arquitetura, os tokens, os ~50 componentes, os templates de tela e os validadores.

O trabalho tem três partes:

1. **Questionário (você e o usuário, obrigatório):** todas as perguntas do briefing respondidas pelo usuário e confirmadas por ele.
2. **Mecânica (scripts, determinística):** placeholders, recoloração por família de matiz, fontes, logos, remoção de módulos e ajustes de contraste.
3. **Semântica (você):** reescrever os textos que descrevem a marca (manual de marca, paleta estendida, tom de voz, exemplos de conteúdo) e revisar o resultado visualmente.

Não pule nenhuma. O gerador **se recusa a rodar** com o briefing incompleto, e o DS sai com textos genéricos até você fazer a parte semântica.

## Arquivos da skill

| Caminho | Para quê |
|---|---|
| `assets/brand-brief.template.json` | Modelo do briefing: toda pergunta começa como `PREENCHER` |
| `assets/examples/exemplo-verde.json` | Briefing completo de uma marca fictícia (referência de formato) |
| `assets/template/` | Template neutro (marca "Sua Marca", dados fictícios). Não editar à mão |
| `scripts/validar-briefing.mjs` | Lista as perguntas sem resposta válida (exit 1 enquanto houver) |
| `scripts/generate-ds.mjs` | Gera o DS para um briefing completo |
| `scripts/validar-contraste.mjs` | Auditoria WCAG dos pares de tokens |
| `scripts/gerar-escala.mjs` | Escala 50–700 (light/dark) a partir de um HEX |
| `references/` | Contrato de tokens, arquitetura, geração, reescrita semântica e checklist |

Leia `references/tokens.md` antes de mexer em qualquer cor ou token, e `references/reescrita-semantica.md` antes da etapa 5.

## Fluxo

### 1. Questionário obrigatório

Copie `assets/brand-brief.template.json` para a pasta de trabalho do usuário (ex.: `briefings/<slug>.json`). Todas as perguntas abaixo são obrigatórias. **Nenhuma pode ser respondida por você.**

| # | Campo | Pergunta | Respostas aceitas |
|---|---|---|---|
| 1 | `nome` | Nome de exibição da marca | texto |
| 2 | `nome_curto` | Nome curto ou sigla | texto (o próprio nome, se não houver sigla) |
| 3 | `nome_completo` | Razão social ou nome por extenso | texto |
| 4 | `genero` | "do/o …" ou "da/a …"? | `"m"` ou `"f"` |
| 5 | `slug` | Identificador para arquivos e pacotes | minúsculas, números e hífen |
| 6 | `slogan` | Slogan ou frase-assinatura | texto |
| 7 | `descricao` | Para que serve o DS, em uma frase | texto |
| 8 | `dominios.ds` | Domínio de publicação do DS | domínio |
| 9 | `dominios.org` | Domínio institucional (e-mails de exemplo) | domínio |
| 10 | `dominios.org_raiz` | Domínio do portal principal, se for outro | domínio ou `false` |
| 11 | `manual_marca_url` | URL do manual de marca | URL ou `false` |
| 12 | `og_image_url` | Imagem de compartilhamento | URL ou `false` |
| 13 | `cores.primaria` | Cor primária | `#RRGGBB` |
| 14 | `cores.secundaria` | Cor secundária | `#RRGGBB` ou `"derivar"` |
| 15 | `cores.destaque` | Cor de destaque sobre a primária | `#RRGGBB` ou `"derivar"` |
| 16 | `cores.realce` | Cor de chamadas pontuais | `#RRGGBB` ou `"manter"` |
| 17 | `fontes.primaria` | Fonte primária; é do Google Fonts? | `{ "nome", "google": true }` ou `{ "nome", "google": false, "url_woff2" }` |
| 18 | `fontes.display` | Fonte de títulos de impacto | fonte ou `false` (usa a primária) |
| 19 | `fontes.sistema` | Fonte de legendas e leitura longa | fonte ou `false` (usa a primária) |
| 20–22 | `logos.cor`, `logos.branco`, `logos.preto` | Arquivos do logo | caminho existente ou `false` (logotipo provisório) |
| 23 | `favicon` | Arquivo do favicon | caminho `.png`/`.svg` ou `false` (monograma) |
| 24 | `termos_proibidos` | Marcas ou nomes antigos que não podem aparecer | lista ou `[]` |
| 25 | `conteudo.tom_de_voz` | Como a marca fala | texto |
| 26 | `conteudo.publico` | Quem usa os produtos digitais | texto |
| 27 | `conteudo.paleta_estendida` | Cores de apoio do manual | lista de `{ "nome", "hex", "uso" }` ou `[]` |
| 28 | `conteudo.regras_de_marca` | Regras de uso do logo | lista ou `[]` |
| 29 | `modulos.modelos_bi` | Manter a seção Modelos de BI? | `true` ou `false` |
| 30 | `confirmado_pelo_usuario` | O usuário confirmou o resumo? | `true`, só depois da confirmação |

Regras do questionário:

- **Pergunte tudo ao usuário.** Use a ferramenta de perguntas (ex.: AskUserQuestion) quando houver opções fechadas (gênero, "derivar", módulos) e peça o restante em texto. Agrupe em rodadas curtas, mas não avance para a etapa 3 com perguntas abertas.
- **Nunca invente nem assuma respostas.** As opções de "não se aplica" (`false`, `"derivar"`, `"manter"`, `[]`) existem para o usuário escolher, não para você preencher em silêncio. Se o usuário disser "tanto faz" ou "não sei", explique o efeito de cada opção e peça que ele escolha.
- **Pode extrair do material do usuário.** Se ele enviar um manual de marca em PDF, leia-o para propor cores, fontes, regras do logo e tom de voz. Mesmo assim, apresente o que encontrou e peça confirmação de cada item.
- **Confira os arquivos.** Caminhos de logo e favicon são relativos ao JSON e precisam existir. Se o usuário não tiver os arquivos, pergunte se prefere enviá-los ou responder `false`.
- **Confirme antes de gerar.** Mostre um resumo com todas as respostas e só grave `"confirmado_pelo_usuario": true` depois de o usuário aprovar. Se ele mudar algo, atualize e confirme de novo.

Depois de cada rodada de respostas, rode:

```bash
node scripts/validar-briefing.mjs <briefing.json>
```

Ele lista cada pergunta pendente com o motivo (sem resposta, ainda com o texto do modelo, resposta inválida). Continue perguntando até a saída ser `Briefing completo`.

### 2. Conferir o que o usuário já tem

Antes de gerar, confirme com o usuário o que vai ficar provisório por escolha dele: logos com `false`, favicon com `false`, cores com `"derivar"` e fontes com `false`. Isso aparece como pendência na entrega.

### 3. Gerar

```bash
node scripts/generate-ds.mjs --brief <briefing.json> --out <pasta-destino>
```

Opções: `--force` sobrescreve a pasta; `--node-modules <pasta>` cria uma junction para um `node_modules` existente (útil para testar sem `npm install`).

Se o briefing estiver incompleto, o script para sem gerar nada e lista as perguntas pendentes: volte à etapa 1. Com sucesso, imprime um resumo e grava `<pasta-destino>/GERACAO.md`, com os ajustes de contraste, os avisos, as pendências e a tabela WCAG.

### 4. Instalar e validar

```bash
cd <pasta-destino>
npm install --legacy-peer-deps
npm run build     # typecheck + marcas proibidas + tipografia legada + H1 + vite build
npx vitest run    # validador de tokens (/tokens × index.css) e regressões
```

O build **falha** enquanto houver termo proibido (`termos_proibidos` do briefing). Isso é intencional: é a trava que garante a troca completa.

### 5. Reescrita semântica (obrigatória)

Siga `references/reescrita-semantica.md`. Os trechos genéricos estão marcados com o comentário `MODELO:` e listados na seção 6 do `GERACAO.md`; a etapa só termina quando `grep -rn "MODELO:" src` voltar vazio. Em resumo:

- `src/pages/MarcaPage.tsx`: página-modelo com valores de referência; troque área de proteção, tamanhos mínimos, fundos e coassinatura pelas regras de `conteudo.regras_de_marca` e do manual, e remova o aviso "Valores de referência";
- `src/components/ColorSection.tsx`: a paleta estendida tem nomes descritivos de referência ("Verde Menta", "Coral"…). Renomeie a partir de `conteudo.paleta_estendida`;
- `src/pages/HomePage.tsx`: seção-modelo "Voz da marca" (personalidade, 4 pilares, diretrizes), princípios e texto do hero;
- `src/pages/ConteudoPage.tsx`: tom de voz (`conteudo.tom_de_voz`);
- dados de exemplo listados em "Conteúdo de exemplo genérico" no `GERACAO.md` (Empreender, Programa Inova, DIROP…): troque por exemplos do universo da nova marca;
- `public/llms.txt`, `index.html` (title, description, JSON-LD).

Se faltar informação para reescrever (ex.: área de proteção do logo), pergunte ao usuário. Não invente regras de marca.

Não troque cores fixas à mão: se um tom ficou errado, ajuste o briefing ou as famílias (`references/geracao.md`) e gere de novo.

### 6. Revisão visual

Rode `npm run dev` (porta 8080) e confira no navegador, em light e dark: `/`, `/fundamentos`, `/tokens`, `/componentes`, `/templates`, `/marca`. Procure:

- texto ilegível sobre a primária (botões, sidebar, header);
- tons "estranhos" em ilustrações e gráficos (sinal de uma cor fora das janelas de família);
- logos provisórios (quando o usuário respondeu `false`);
- miniaturas da página Templates, que mostram a marca neutra "Sua Marca": recapture com o DS novo rodando.

Depois rode `node <skill>/scripts/validar-contraste.mjs src/index.css` e confirme que nenhum par **piorou** em relação ao template.

### 7. Entregar

Informe ao usuário: a pasta gerada, o resultado de build e testes, as pendências que ficaram (imagens, logos provisórios, conteúdo que precisa de decisão dele) e a tabela de contraste resumida. Não publique nem faça deploy sem ele pedir. O DS gerado não traz pipeline de CI; se o usuário quiser um, use como modelo o que está descrito em `references/arquitetura.md`.

## Limites conhecidos

- **Imagens:** o template traz fotos genéricas, um selo "marca parceira" e miniaturas com a marca neutra. Os `.asset.json` viram placeholders abstratos em `public/placeholders/`.
- **Recoloração:** preserva a luminosidade e move a matiz. Marcas muito claras (amarelo, verde-limão) como primária podem precisar de `--primary-foreground` escuro; o gerador ajusta isso sozinho só quando a nova marca fica pior que o template.
- **Idioma:** o template é pt-BR.
