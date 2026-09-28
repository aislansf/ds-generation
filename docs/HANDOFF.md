# Handoff: do ds-sebrae à skill `ds-generator`

## Contexto

O [ds-sebrae](https://github.com/aislansf/ds-sebrae) é o Design System do SEBRAE-CE: um site de documentação em Vite + React + Tailwind + shadcn com tokens, componentes, templates de tela e validadores. Este repositório transforma esse DS em um **gerador**: dado um briefing de marca, produz um DS novo no mesmo padrão.

A skill nasceu dentro do `ds-sebrae` (`.claude/skills/ds-generator/`) e foi migrada para cá, para poder ser instalada com `npx skills add aislansf/ds-generation` e versionada separadamente.

| Repositório | Papel |
|---|---|
| `aislansf/ds-sebrae` → `frontend/` | **Origem**: o DS de referência, onde componentes e tokens evoluem |
| `aislansf/ds-generation` (este) | **Gerador**: template extraído + scripts + instruções para o agente |

## Como funciona

1. **Extração** (`extract-template.mjs`): copia o `frontend/` da origem e troca nomes, domínios, fontes e identificadores por placeholders (`SEBRAE-CE` → `__BRAND_NAME__`, `sebrae-card` → `brand-card`, `SebraeLogo` → `BrandLogo`). As **cores ficam como estão**.
2. **Geração** (`generate-ds.mjs`):
   - preenche os placeholders e **recolore por família de matiz**: tudo o que é azul institucional vai para a matiz da nova primária, preservando a estrutura de luminosidade;
   - reescreve os HEX do catálogo de tokens com o mesmo algoritmo do teste;
   - corrige contrastes que ficaram piores que na origem;
   - instala logos e favicon, ou gera provisórios;
   - troca por arquivos locais as imagens que estavam no CDN da Lovable;
   - remove módulos opcionais;
   - ajusta o gênero gramatical ("da Agência");
   - trava a marca de origem e as antigas no build.
3. **Reescrita semântica** (o agente, guiado por `references/reescrita-semantica.md`): página Marca, nomes da paleta estendida, tom de voz e dados de exemplo.

Explicação completa das regras, das famílias de cor e de como ajustá-las: `skills/ds-generator/references/geracao.md`.

## Decisões

- **Recolorir em vez de criar um placeholder por cor.** O DS de origem tem ~500 cores fixas em páginas e templates (documentação que mostra valores). Um placeholder para cada uma seria frágil. Famílias de matiz resolvem com poucas regras e mantêm a hierarquia de tons.
- **Ida e volta = identidade.** Gerar com o briefing de origem não altera nenhuma cor. É a garantia de que o gerador não "inventa" mudanças.
- **Contraste só é corrigido quando piora.** A origem tem pares abaixo de AA por decisão de design (ex.: texto branco sobre a primária no dark). O gerador não reverte decisões da origem; só age quando a nova marca fica pior.
- **O build falha com a marca antiga.** O `check-legacy-brand.mjs` do DS gerado lê `scripts/legacy-brand.config.json` (prefixo da origem + `termos_proibidos`). Isso força a troca completa.
- **O template é gerado, não editado.** Mudanças de componente acontecem na origem e chegam aqui por reextração. Só `assets/overrides/` é mantido à mão.

## Verificação no momento da migração

| Checagem | Resultado |
|---|---|
| Extração: remanescentes de "sebrae" no template | 0 |
| Ida e volta (SEBRAE → SEBRAE) | `hex=0 hsl=0` |
| Marca fictícia verde: `npm run build` | passou (typecheck, marcas proibidas, tipografia, H1, vite) |
| Marca verde: `vitest run` | 96 testes, 6 arquivos |
| Marca verde: contraste | 11 pares abaixo de AA contra 13 na origem; nenhum piorou |

Template extraído do commit registrado em `skills/ds-generator/assets/template/template.manifest.json`.

## Manutenção

```bash
npm run verificar -- --source <ds-sebrae>/frontend --node-modules <ds-sebrae>/frontend/node_modules
```

Se a extração acusar remanescentes (um programa, uma diretoria ou um domínio novo da origem), ajuste o bloco `origem` em `assets/examples/sebrae-ce.json`:

- `substituicoes_conteudo`: troca direta por um texto neutro;
- `termos_especificos`: só reporta no `GERACAO.md`, para o agente reescrever;
- `variantes_nome`, `aliases_codigo`: formas novas do nome da marca.

Depois de verificar, faça o commit do template atualizado junto com o que mudou.

## Limitações conhecidas

- **Imagens `.jpg`** (miniaturas dos templates, fotos) são copiadas sem troca. Próximo passo útil: um script Playwright que recapture as miniaturas do DS gerado.
- **Conteúdo legado na origem**: `ColorSection.tsx` descreve uma paleta "céu brasileiro" e o slogan "Transformando vidas por meio da educação" parece herdado do FNDE. Corrigir no `ds-sebrae` evita que isso se propague.
- **Fonte proprietária**: a Campuni do SEBRAE vem de um CDN da Adobe AEM. Uma marca nova com fonte própria precisa de uma URL `.woff2` com CORS liberado.
- **CI herdado**: o workflow de deploy por FTP não vem no template. Cada DS gerado precisa do seu próprio pipeline.
- **Idioma**: o template é pt-BR.
