# ds-generation

Skill **`ds-generator`**: gera um Design System completo para qualquer marca. A partir de um briefing em JSON, ela produz um site de documentação em React + Vite + Tailwind + shadcn/ui com:

- tokens em light e dark;
- cerca de 50 componentes;
- templates de tela (login, 2FA, listagem, formulário, dashboards, erro…);
- páginas de marca, webwriting e acessibilidade;
- validadores de build e testes.

O modelo de referência é o DS do SEBRAE-CE ([aislansf/ds-sebrae](https://github.com/aislansf/ds-sebrae)).

## Instalar

```bash
npx skills add aislansf/ds-generation            # no projeto atual (.claude/skills/)
npx skills add aislansf/ds-generation -g         # para todos os projetos (~/.claude/skills/)
npx skills add aislansf/ds-generation -a claude-code -y
```

Funciona com Claude Code, Cursor, Codex e os outros agentes suportados pelo [skills CLI](https://skills.sh). Requer Node 18+.

## Usar

Com a skill instalada, peça ao agente:

> Crie um design system para a marca X

O agente monta o briefing com você, gera o projeto, roda build e testes, reescreve os textos de marca e entrega o DS com a lista de pendências.

Sem agente:

```bash
cp skills/ds-generator/assets/brand-brief.template.json minha-marca.json   # preencha
npm run gerar -- --brief minha-marca.json --out ../ds-minha-marca
cd ../ds-minha-marca && npm install --legacy-peer-deps && npm run build
```

A pasta gerada traz um `GERACAO.md` com os ajustes feitos, as pendências e a tabela de contraste WCAG.

## Estrutura

```
skills/ds-generator/
  SKILL.md                          instruções para o agente
  scripts/
    generate-ds.mjs                 briefing + template → DS novo
    extract-template.mjs            DS de origem → template com placeholders
    validar-contraste.mjs           auditoria WCAG dos tokens
    gerar-escala.mjs                escala 50–700 a partir de um HEX
    lib/                            cor, contraste e regras de substituição
  references/                       tokens, arquitetura, geração, reescrita semântica, checklist
  assets/
    brand-brief.template.json       modelo de briefing
    examples/                       SEBRAE-CE (origem, com logos) e uma marca fictícia verde
    template/                       template extraído (não editar à mão)
    overrides/                      arquivos que substituem os do template
tools/verificar.mjs                 regressão: extração, ida e volta, geração e build
docs/HANDOFF.md                     contexto, decisões e limitações
```

## Manter

O template é extraído do `frontend/` do [ds-sebrae](https://github.com/aislansf/ds-sebrae). Quando o DS de origem evoluir, reextraia e verifique:

```bash
npm run verificar -- --source ../SEBRAE-CE-SISTEMAS/ds-sebrae/frontend --node-modules ../SEBRAE-CE-SISTEMAS/ds-sebrae/frontend/node_modules
```

As quatro checagens precisam passar:

- a extração termina sem remanescentes da marca de origem;
- gerar o SEBRAE a partir dele mesmo não altera nenhuma cor;
- a marca de teste sai sem marcas proibidas e sem placeholders;
- o DS gerado passa no build e nos testes.

O commit do DS de origem usado fica registrado em `assets/template/template.manifest.json` (`origem.commit`).

Detalhes em [docs/HANDOFF.md](docs/HANDOFF.md) e em [skills/ds-generator/references/geracao.md](skills/ds-generator/references/geracao.md).
