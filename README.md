# ds-generation

Skill **`ds-build`** (comando `/ds-build`): gera um Design System completo para qualquer marca. A partir de um briefing em JSON, respondido pelo usuário pergunta a pergunta, ela produz um site de documentação em React + Vite + Tailwind + shadcn/ui com:

- tokens em light e dark;
- cerca de 50 componentes;
- templates de tela (login, 2FA, listagem, formulário, dashboards, erro…);
- páginas de marca, webwriting e acessibilidade;
- validadores de build e testes.

O template da skill é neutro: marca "Sua Marca", imagens genéricas e dados de exemplo fictícios.

## Instalar

```bash
npx skills add aislansf/ds-generation            # no projeto atual (.claude/skills/)
npx skills add aislansf/ds-generation -g         # para todos os projetos (~/.claude/skills/)
npx skills add aislansf/ds-generation -a claude-code -y
```

### Atualizar

```bash
npx skills update ds-build
```

Quem instalou a versão antiga, com a skill `ds-generator`, troca por esta assim:

```bash
npx skills remove ds-generator
npx skills add aislansf/ds-generation
```

Funciona com Claude Code, Cursor, Codex e os outros agentes suportados pelo [skills CLI](https://skills.sh). Requer Node 18+.

## Usar

Com a skill instalada, use o comando:

```text
/ds-build                          # começa o questionário do zero
/ds-build Agência Horizonte        # já informa o nome da marca
/ds-build briefings/horizonte.json # parte de um briefing existente
```

Ou peça em linguagem natural:

> Crie um design system para a marca X

O agente faz **todas** as perguntas do briefing (30, incluindo as de "não se aplica", que o usuário precisa escolher), mostra um resumo para confirmação, gera o projeto, roda build e testes, reescreve os textos de marca e entrega o DS com a lista de pendências. O gerador se recusa a rodar enquanto faltar alguma resposta.

Sem agente:

```bash
cp skills/ds-build/assets/brand-brief.template.json minha-marca.json   # responda cada PREENCHER
npm run validar-briefing -- minha-marca.json                              # lista o que falta
npm run gerar -- --brief minha-marca.json --out ../ds-minha-marca
cd ../ds-minha-marca && npm install --legacy-peer-deps && npm run build
```

A pasta gerada traz um `GERACAO.md` com os ajustes feitos, as pendências e a tabela de contraste WCAG.

## Estrutura

```
skills/ds-build/                    o que o `npx skills add` instala (100% neutro)
  SKILL.md                          comando /ds-build e instruções para o agente (questionário obrigatório)
  scripts/
    validar-briefing.mjs            lista as perguntas sem resposta válida
    generate-ds.mjs                 briefing + template → DS novo
    validar-contraste.mjs           auditoria WCAG dos tokens
    gerar-escala.mjs                escala 50–700 a partir de um HEX
    lib/                            questionário, cor, contraste e placeholders
  references/                       tokens, arquitetura, geração, reescrita semântica, checklist
  assets/
    brand-brief.template.json       modelo de briefing
    examples/exemplo-verde.json     marca fictícia de teste
    template/                       template neutro (gerado, não editar à mão)
origem/                             manutenção: DS de referência de onde o template é extraído
  ds-sebrae.json                    briefing da origem + regras de neutralização
  logos/                            logos da origem (só para o teste de ida e volta)
  overrides/                        arquivos que substituem os do template (logos neutros, imagens genéricas…)
tools/
  extract-template.mjs              DS de origem → template neutro (falha se sobrar qualquer termo da origem)
  imagens-neutras.mjs               gera as imagens genéricas e recaptura as miniaturas
  verificar.mjs                     regressão: extração, questionário, ida e volta, geração e build
docs/HANDOFF.md                     contexto, decisões e limitações
```

## Manter

Quando o DS de referência evoluir, reextraia e verifique:

```bash
npm run verificar -- --source ../SEBRAE-CE-SISTEMAS/ds-sebrae/frontend --node-modules ../SEBRAE-CE-SISTEMAS/ds-sebrae/frontend/node_modules
```

As checagens precisam passar:

- a extração termina sem remanescentes da origem (texto, nomes de arquivo e imagens sem revisão);
- o briefing incompleto é recusado;
- gerar a origem a partir dela mesma não altera nenhuma cor;
- a marca de teste sai sem marcas proibidas, sem placeholders e sem nenhum termo da origem;
- o H1, os validadores e a ColorSection saem com a cor exata do briefing, os textos de fonte seguem a origem de cada fonte e o `@testing-library/dom` está declarado;
- o DS gerado passa no build e nos testes.

Se a origem ganhar telas novas, recapture as miniaturas com `npm run imagens -- --source <frontend> --node-modules <node_modules>`.

Detalhes em [docs/HANDOFF.md](docs/HANDOFF.md).
