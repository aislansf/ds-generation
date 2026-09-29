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
   | 0b | `substituicoes_regex` | `Farol` → `Radar`, `marcaGov` → `marcaParceiro` |
   | 1 | URLs de manual, imagem OG e domínios | `<domínio do DS>` → `__DS_DOMAIN__` |
   | 2 | Slogan, nome completo e variantes do nome | `<nome e variantes>` → `__BRAND_NAME__` |
   | 3 | Fontes | `Figtree` → `__FONT_PRIMARY__` |
   | 4 | `aliases_codigo` | `<prefixo>-blue` → `brand-primary` |
   | 5 | Nome curto como palavra | → `__BRAND_SHORT__` |
   | 6 | Identificadores | `<prefixo>-card` → `brand-card`, `<Prefixo>Logo` → `BrandLogo` |

   Nomes de arquivo passam por `substituicoes_caminho` e pela regra 6. Os `.asset.json` (ponteiros para o CDN do projeto de origem) viram ponteiros locais neutros. Por fim, `origem/overrides/` é copiado por cima: logos "Sua Marca", favicon, selo "marca parceira", imagem de login e miniaturas.

   A extração **falha** se sobrar no template: o prefixo da marca, qualquer item de `termos_proibidos_template` (substring) ou de `termos_especificos` (palavra inteira), ou qualquer imagem que não venha de `overrides/` nem esteja em `imagens_revisadas`.

2. **Imagens** (`tools/imagens-neutras.mjs`): escreve os logos neutros, rasteriza favicon/selo/imagem de login com o Chromium do Playwright e captura as miniaturas da página Templates a partir de um DS gerado com `tools/marca-neutra.json` (cinza-azulado, "Sua Marca").

3. **Geração** (`skills/ds-build/scripts/generate-ds.mjs`):
   - recusa o briefing se qualquer uma das 30 perguntas estiver sem resposta válida ou sem `confirmado_pelo_usuario: true`;
   - preenche os placeholders, ajusta os textos de tipografia à origem de cada fonte (Google Fonts ou proprietária) e **recolore por família de matiz**; as âncoras (cor institucional do H1 e dos validadores) viram exatamente a cor do briefing, e o H1 ganha uma cor legível no dark mode;
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

## Verificação

```bash
npm run verificar -- --source <ds-sebrae>/frontend --node-modules <ds-sebrae>/frontend/node_modules
```

| Checagem | Resultado na última execução |
|---|---|
| Extração: remanescentes da origem | 0 |
| Briefing incompleto | recusado (30 pendências) |
| Ida e volta | `hex=0 hsl=0` |
| Marca fictícia verde: marcas proibidas / placeholders | 0 / 0 |
| Marca fictícia verde: termos da origem no DS gerado | 0 |
| Marca verde: H1 (light e dark), validadores, ColorSection, textos de fonte e dependências | seguem o briefing |
| Marca verde: `npm run build` | passou |
| Marca verde: `vitest run` | 96 testes |

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
