---
name: ds-build
description: Comando /ds-build — atalho para gerar um Design System completo para uma marca com a skill ds-generator. Aceita o nome da marca ou o caminho de um briefing .json.
argument-hint: "[nome da marca | caminho/do/briefing.json]"
disable-model-invocation: true
---

# /ds-build

Atalho para a skill **ds-generator**. Não tem fluxo próprio: carrega a ds-generator e segue o fluxo dela do começo ao fim.

Argumentos recebidos: `$ARGUMENTS`

## 1. Carregar a ds-generator

- Com uma ferramenta de skills disponível (ex.: `Skill` no Claude Code), invoque a skill `ds-generator`.
- Sem ela, leia `../ds-generator/SKILL.md` (pasta irmã desta) e siga as instruções de lá. Os caminhos `scripts/…`, `assets/…` e `references/…` citados nela são relativos a `../ds-generator/`.
- Se a ds-generator não estiver instalada, pare e peça ao usuário para instalar:

  ```bash
  npx skills add aislansf/ds-generation
  ```

## 2. Usar os argumentos

- **Caminho de um `.json`:** é o briefing. Rode `scripts/validar-briefing.mjs <briefing>` da ds-generator e pergunte só o que estiver pendente. Mesmo que nada falte, mostre o resumo das respostas e peça confirmação antes de gerar.
- **Texto:** é a resposta da pergunta `nome` (nome da marca). Copie o modelo de briefing, grave o nome e siga com as demais perguntas.
- **Vazio** (ou `$ARGUMENTS` aparecendo literalmente acima): comece o questionário pela primeira pergunta.

## 3. Seguir o fluxo inteiro

Execute todas as etapas da ds-generator, na ordem: questionário obrigatório → conferência do que fica provisório → geração → instalação e validação → reescrita semântica (até `grep -rn "MODELO:" src` voltar vazio) → revisão visual → entrega.

O atalho **não** dispensa nenhuma regra da ds-generator: todas as perguntas vêm do usuário, nenhuma resposta é inventada e nada é gerado sem a confirmação do resumo.
