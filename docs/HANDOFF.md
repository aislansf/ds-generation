# Handoff: do DS de referência à skill `ds-build`

## Contexto

O [ds-sebrae](https://github.com/aislansf/ds-sebrae) é um Design System completo (Vite + React + Tailwind + shadcn com tokens, componentes, templates de tela e validadores). Este repositório transforma esse DS em um **gerador**: dado um briefing de marca, produz um DS novo no mesmo padrão.

| Repositório | Papel |
|---|---|
| `aislansf/ds-sebrae` → `frontend/` | **Origem**: o DS de referência, onde componentes e tokens evoluem |
| `aislansf/ds-generation` (este) | **Gerador**: template neutro + scripts + instruções para o agente |

**A skill instalada é 100% neutra.** Tudo o que `npx skills add` copia (`skills/ds-build/` e `skills/ds-run/`) está livre de nomes, logos, imagens e dados da origem, e também de conteúdo herdado por ela de outras marcas (FNDE, Governo Federal). O conhecimento sobre a origem fica só em `origem/` e `tools/`, que não são instalados.

## Como funciona

1. **Extração** (`tools/extract-template.mjs` + `origem/ds-sebrae.json`): copia o `frontend/` da origem e aplica, nesta ordem:

   | Ordem | Regra | Exemplo |
   |---|---|---|
   | 0 | `substituicoes_conteudo` (literal, com borda de palavra) | `Empretec` → `Empreender`, endereço/CNPJ reais → fictícios, `Fundo Nacional…` → `__BRAND_FULL_NAME__` |
   | −1 | `substituicoes_por_arquivo` (só naquele arquivo) | tira os mapas do Ceará do `registry.ts` e do `DESIGN-SYSTEM.md`, o script de rastreamento do `index.html` |
   | 0b | `substituicoes_regex` | `Farol` → `Radar`, `marcaGov` → `marcaParceiro`, `SEBRAE_PALETTE` → `BRAND_PALETTE` |
   | 0c | `substituicoes_lugares` (com e sem acento) | `Fortaleza` → `Porto Central`, `Cariri` → `Vale do Sul` |
   | 1 | URLs de manual, imagem OG e domínios | `<domínio do DS>` → `__DS_DOMAIN__` |
   | 2 | Slogan, nome completo e variantes do nome | `<nome e variantes>` → `__BRAND_NAME__` |
   | 3 | Fontes | `Figtree` → `__FONT_PRIMARY__` |
   | 4 | `aliases_codigo` | `<prefixo>-blue` → `brand-primary` |
   | 5 | Nome curto como palavra | → `__BRAND_SHORT__` |
   | 6 | Identificadores | `<prefixo>-card` → `brand-card`, `<Prefixo>Logo` → `BrandLogo` |

   Arquivos de `copiar_sem_regras` (o GeoJSON do Brasil) vão sem regra nenhuma. Nomes de arquivo passam por `substituicoes_caminho` e pela regra 6. Os `.asset.json` (ponteiros para o CDN do projeto de origem) viram ponteiros locais neutros. O `package.json` perde as `remover_dependencias` (Supabase, Drizzle) e ganha as `dependencias_dev`; se a origem não versionar `package-lock.json` (hoje só tem o do bun), a extração gera um com `npm install --package-lock-only`. Por fim, `origem/overrides/` é copiado por cima: logos "Sua Marca", favicon, selo "marca parceira", imagem de login, miniaturas e as versões neutras de `HomePage`, `MarcaPage`, `regioes.ts`, `mapas.ts` e `mapa-brasil-ufs.ts`.

   Depois dos overrides, `tools/lib/tokenizar.mjs` prepara o template para os estilos visuais: liga raio, sombra, espessura de borda, peso e duração do Tailwind aos **tokens de pele** do `index.css`, cria `src/styles/estilo.css` e `src/config/estilo.ts`, põe o tema padrão no `useTheme` e no `index.html` e acrescenta os ganchos `data-ds`, `data-variant` e `data-surface` nos componentes. Todos os valores padrão reproduzem o visual de sempre (prova: `tools/verificar-identidade.mjs`, capturas pixel a pixel). O layout bento (`tools/lib/bento.mjs`) entra no mesmo passo, com o mesmo critério de identidade, e a seção "Estilo visual" de `/fundamentos` também (`tools/lib/estilo-secao.mjs`, com os arquivos em `tools/lib/patch/`): `EstiloVisualSection.tsx` e o teste do componente são arquivos novos do template, a página e o menu lateral ganham uma linha cada, e no `corporativo` o componente devolve `null` e o item de menu não existe.

   As cores fixas dos campos de formulário (borda, hover/foco, placeholder) viram os tokens `--control-*`, com os mesmos HEX. E um codemod (`tools/lib/ganchos.mjs`) põe `data-ds` (e `data-variant` nos botões) nos elementos que as páginas e os templates montam à mão, por padrão de classe: `<button>` com fundo da marca → `default`, com borda e fundo neutro → `outline`, só hover → `ghost`, sublinhado → `link`; `<input>`, `<textarea>` e `<select>` → `input`, `textarea`, `select-trigger`; `div`/`a`/`Link` com `bg-card`, borda e raio → `card`. Um lexer de TSX pula strings e template literals (os exemplos de código das páginas de documentação ficam intactos), e as vitrines montadas por tabela (`[{ base: "bg-…" }, …].map((v) => …)`) recebem a variante de cada linha. O que o padrão não decide (fundo ou borda condicional, botão sobre o header azul dos templates, campo sem borda dentro de um contêiner) não ganha gancho: vai para a lista de revisão em `docs/GANCHOS.md` (`node tools/tokenizar-template.mjs --relatorio docs/GANCHOS.md`).

   | Cobertura da camada CSS (JSX fora de `src/components/ui/`) | Antes | Depois |
   |---|---|---|
   | Botões | 19 `<Button>`; 337 `<button>` sem gancho | + 246 `<button>` com gancho; 90 na lista de revisão |
   | Campos | 3 `<Input>`; 87 `<input>`, 4 `<textarea>`, 17 `<select>` sem gancho | + 50 `input`, 4 `textarea`, 15 `select-trigger`; checkbox, radio e afins ficam de fora; 14 na lista de revisão |
   | Cards | 10 `<Card>`; 157 elementos com `bg-card` sem gancho | + 93 `card`; os demais são superfícies sem borda; 11 na lista de revisão |

   A extração **falha** se sobrar no template: o prefixo da marca, qualquer item de `termos_proibidos_template` (substring) de `termos_especificos` ou de `substituicoes_lugares` (palavra inteira), qualquer imagem que não venha de `overrides/` nem esteja em `imagens_revisadas`, ou uma âncora da tokenização que não casou (a origem mudou naquele ponto).

2. **Imagens** (`tools/imagens-neutras.mjs`): escreve os logos neutros, rasteriza favicon/selo/imagem de login com o Chromium do Playwright e captura as miniaturas da página Templates a partir de um DS gerado com `tools/marca-neutra.json` (cinza-azulado, "Sua Marca").

3. **Geração** (`skills/ds-build/scripts/generate-ds.mjs`):
   - recusa o briefing se qualquer uma das 31 perguntas estiver sem resposta válida ou sem `confirmado_pelo_usuario: true` (o estilo visual sem resposta não conta: vale `corporativo`);
   - preenche os placeholders, ajusta os textos de tipografia à origem de cada fonte (Google Fonts ou proprietária) e **recolore por família de matiz**; as âncoras (cor institucional do H1 e dos validadores) viram exatamente a cor do briefing, e o H1 ganha uma cor legível no dark mode;
   - aplica o **estilo visual** (`assets/estilos/<id>/`): tokens de pele em `:root` e `.dark`, camada CSS, tema padrão; depois confere os mínimos de contraste do estilo, ajustando só tokens do próprio estilo;
   - reescreve os HEX do catálogo de tokens, corrige contrastes que pioraram, instala logos e favicon (ou provisórios, se o usuário respondeu `false`), remove módulos opcionais, ajusta o gênero gramatical e trava os `termos_proibidos` no build.

4. **Reescrita semântica** (o agente, guiado por `references/reescrita-semantica.md`).

5. **Execução** (skill `ds-run`, comando `/ds-run`): acha a pasta do DS gerado, instala as dependências se faltarem e sobe `npm run dev` em segundo plano, entregando o endereço local ao usuário.

## Decisões

- **Neutralizar na extração, não no template.** O template é gerado. Toda troca de nome e todo arquivo genérico vive em `origem/`, então uma reextração nunca traz a marca de volta, e a checagem de remanescentes impede que um termo novo da origem passe despercebido.
- **Dados de exemplo fictícios, não placeholders.** Programas, unidades e painéis viraram nomes genéricos plausíveis (Empreender, Programa Inova, DIROP, Radar Estratégico). Eles ficam listados em `conteudo_exemplo` e o `GERACAO.md` aponta onde aparecem, para o agente trocar pelo universo da marca nova.
- **Questionário obrigatório.** Cada campo do briefing precisa de resposta explícita; as opções de "não se aplica" (`false`, `"derivar"`, `"manter"`, `[]`) também são escolhas do usuário. O gerador valida isso (`lib/briefing.mjs`), e o `validar-briefing.mjs` diz ao agente o que ainda perguntar. Quando o usuário não entrega todas as respostas de uma vez, o agente faz uma pergunta por mensagem, na ordem do briefing.
- **Recolorir em vez de criar um placeholder por cor.** O template tem ~500 cores fixas (documentação que mostra valores). Famílias de matiz resolvem com poucas regras e mantêm a hierarquia de tons.
- **Ida e volta = identidade.** Gerar com o briefing de origem não recolore nenhuma cor (a única cor acrescentada é a do H1 no dark mode, que falta também na origem). Por isso âncoras e referências por arquivo (`familias[].ancoras`, `familias[].referencias`) só valem quando a cor muda.
- **Cor da marca onde ela aparece como "a cor da marca".** O deslocamento de matiz preserva as relações entre os tons do template, mas o H1, os validadores e a "cor primária" da ColorSection precisam mostrar a cor exata do briefing. Essas cores são declaradas como âncoras ou referências em `origem/ds-sebrae.json`.
- **Dependências que a origem não declara** (`origem.dependencias_dev`): o DS gerado instala com `--legacy-peer-deps`, que não instala peers. A extração acrescenta essas dependências ao `package.json` e ao `package-lock.json` do template.
- **Contraste só é corrigido quando piora** em relação ao template.
- **Gráficos ECharts sem cor fixa.** O tema (`brandTheme.ts`) lê os tokens do CSS em tempo de execução, então a recoloração chega aos 74 presets sem regra nova. A fonte do tema, que na origem era `Poppins` fixo, vira `__FONT_PRIMARY__`.
- **Só o mapa do Brasil.** Os dois mapas do Ceará por município saem na extração (preset, GeoJSON e documentação): um GeoJSON municipal tem nomes reais de lugares e não serve para outra marca. No mapa do Brasil, o Ceará continua como UF (`remanescentes_permitidos`) e o destaque passa para uma UF de exemplo marcada com `MODELO:`.
- **Lugares fictícios.** Municípios, macrorregiões e bairros do Ceará dos dados de exemplo (presets, Tela BI, Dashboard Analítico, seed de empresas) viram nomes fictícios consistentes entre si; a checagem de remanescentes procura os nomes originais.
- **Estilos visuais por preset, não por interpretação.** Cada estilo é um `preset.json` (tokens de pele que ele muda, com expressões como `{primaria.h}`) mais um `estilo.css` opcional. O `_schema.json` restringe os tokens: um estilo nunca altera a escala da marca nem as cores semânticas. Sem estilo, `corporativo` (`tokens: {}`), que gera o mesmo DS byte a byte. Os estilos de nível 3 acrescentam decoração gerada (`scripts/lib/decoracao.mjs`: SVGs determinísticos nas cores da marca, em `public/estilo/`), aplicada só nas superfícies marcadas com `data-surface="marca"` pela tokenização. O `bento` é o único estilo de layout (nível 4): `tools/lib/bento.mjs` acrescenta ao template `src/components/layout/bento.ts` (`bentoGrid`, `bentoCell`, `bentoSizes`) e os componentes `BentoGrid`/`BentoCell`, e troca as classes de grade e de bloco das cinco páginas (Home, Dashboard Institucional, Dashboard Analítico, Hub de painéis e Tela BI) por chamadas a essas funções. Com `ESTILO.layout !== "bento"` elas devolvem as classes originais, então os demais estilos não mudam. A skill também traz `scripts/catalogo-estilos.mjs` (a mesma tela em cada estilo, para a pergunta 13) e `scripts/capturar-miniaturas.mjs` (recaptura as miniaturas de Templates no DS gerado, na revisão visual). `public/design-system/estilo.json` é o resumo estruturado que a matriz e a seção "Estilo visual" leem. Plano completo, fases e o que ainda falta (revisão humana da galeria): `docs/PLANO-ESTILOS.md`.
- **Tokenização no repositório do gerador.** O plano previa os tokens de pele na origem; eles entram como um patch idempotente aplicado no fim da extração (`tools/lib/tokenizar.mjs`), para a Fase 1 não depender de mudar o DS de referência. Se a origem passar a ter os tokens, as âncoras deixam de casar e a extração avisa: aí o patch sai.
- **Sombras dos componentes separadas das sombras de marca.** `shadow-*` usa `--shadow-ui-*` (valores padrão do Tailwind); `--shadow-xs…xl` (tingidas da primária) continuam nas classes `.brand-card`. Unificar seria uma mudança visual consciente. `shadow-primary/20` não funciona com sombra em `var()` e virou `shadow-[var(--shadow-brand)]`.
- **Nada da infraestrutura da origem.** `.env`, `supabase/`, `src/integrations/`, `drizzle/`, `.lovable/` e `.github/` ficam fora do template, assim como o `pixel-script` do Supabase que o `index.html` carregava (estava no template anterior também).

## Verificação

```bash
npm run verificar -- --source <ds-sebrae>/frontend --node-modules <ds-sebrae>/frontend/node_modules
```

| Checagem | Resultado na última execução |
|---|---|
| Extração: remanescentes da origem | 0 |
| Briefing incompleto | recusado (30 pendências; o estilo não conta) |
| Presets de estilo / sem estilo = corporativo / estilo inválido | 12 válidos / byte a byte / pendência |
| Tokenização × versão anterior (8 rotas, light e dark, duas marcas) | idêntica, exceto os gráficos do Dashboard Analítico em dark, que agora usam as cores do tema escuro no primeiro carregamento |
| Matriz de estilos (`exemplo-verde` e `exemplo-neobrutalismo`) | 21 estilos: build e 137 testes passando; decoração só em superfícies de marca; movimento e transparência reduzidos respeitados. O `bento` (22º preset) rodou à parte com `exemplo-verde`: build e 145 testes (8 do layout) |
| Ida e volta | `hex=0 hsl=0` |
| Marca fictícia verde: marcas proibidas / placeholders | 0 / 0 |
| Marca fictícia verde: termos da origem no DS gerado | 0 |
| Marca verde: H1 (light e dark), validadores, ColorSection, textos de fonte e dependências | seguem o briefing |
| Marca verde: `npm run build` | passou |
| Marca verde: `vitest run` | 127 testes (96 + o grupo "Estilo visual" de `/tokens`) |
| Fase 6: `corporativo` × `HEAD` (`/`, `/fundamentos`, `/componentes`, light e dark) | idêntico; a seção "Estilo visual" só existe nos outros estilos |
| Fase 6: matriz com `exemplo-verde` | 22 estilos: build e 148 testes passando |
| `npm test` (skill e ferramentas) | 56 testes |

Na versão com gráficos, o teste `HeaderVariants.bannerHeight` falhava já na origem (a barra do header perdeu o `maxHeight: 52px`). Uma regra em `substituicoes_por_arquivo` devolve o valor no template; quando a origem corrigir, a regra deixa de casar e pode sair.

Os heatmaps `heatmap-matriz` e `heatmap-matriz-anual` têm versões próprias em `origem/overrides/`: na origem, os rótulos das células saíam em branco com contorno (ilegíveis nas células claras) ou com `--foreground` fixo (ilegíveis nas escuras). Nas versões do template, `src/lib/echarts/rotulos.ts` escolhe, célula a célula, entre `--foreground` e `--primary-foreground` a cor com mais contraste. Vale levar a correção para a origem e apagar os overrides.

Os gauges com ponteiro (`gauge-simples`, `gauge-grau`, `gauge-estagios`) também têm versões próprias: na origem, o valor ficava no centro e o ponteiro o riscava; no Gauge por Estágios o ponteiro era uma cunha invertida e os rótulos nunca apareciam (caíam em 12,5/37,5 com marcas a cada 20). Nas versões do template, valor e título ficam abaixo do pivô, os rótulos dos estágios ficam tangenciais no meio de cada faixa e o ponteiro não os alcança.

As miniaturas da página Templates são capturadas com o Chromium do Playwright instalado no `node_modules` informado; se o download dele falhar, passe um já baixado com `--chromium <exe>`.

## Manutenção

Se a extração acusar remanescentes (um programa, uma unidade, um endereço ou uma imagem nova na origem):

- texto: acrescente a troca em `substituicoes_conteudo` (frases longas antes das palavras que elas contêm) ou `substituicoes_regex`, e o termo em `termos_especificos` para a checagem;
- imagem: confira-a; se for genérica, liste em `imagens_revisadas`; se mostrar marca, gere uma versão neutra em `origem/overrides/` (miniaturas: `npm run imagens`);
- nome da marca: `variantes_nome`, `aliases_codigo`.

Faça o commit do template atualizado junto com o que mudou em `origem/`.

## Limitações conhecidas

- **Páginas Home e Marca** são versões neutras mantidas à mão em `origem/overrides/` (texto-modelo marcado com `MODELO:`). Quando a origem muda uma delas, a extração falha pelo hash de `overrides_de_codigo`: leve a mudança para a versão neutra e atualize o hash.
- **Fonte proprietária**: uma marca com fonte própria precisa de uma URL `.woff2` com CORS liberado (`fontes.*.url_woff2`).
- **CI**: o template não traz workflow de deploy. Cada DS gerado precisa do seu.
- **Idioma**: o template é pt-BR.
