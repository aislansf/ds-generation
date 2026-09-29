---
name: ds-run
description: Sobe um Design System gerado pelo ds-build com `npm run dev` e mostra ao usuário o endereço do projeto rodando. Use quando o usuário digitar /ds-run ou pedir para "rodar o DS", "subir o design system", "ver o DS no navegador" ou "executar o projeto gerado".
argument-hint: "[pasta do DS gerado]"
---

# ds-run

Comando: `/ds-run`. Argumentos recebidos: `$ARGUMENTS`

Executa `npm run dev` num Design System gerado pelo `/ds-build` e entrega ao usuário o endereço local para ele ver o projeto rodando.

## 1. Achar a pasta do DS

Um DS gerado tem `GERACAO.md` e um `package.json` com o script `dev` na raiz.

- **Caminho informado:** use essa pasta. Se ela não tiver `package.json` com `dev`, avise e pare.
- **Vazio** (ou `$ARGUMENTS` aparecendo literalmente acima):
  1. se nesta conversa um DS foi gerado com `/ds-build`, use a pasta de destino dele;
  2. senão, se a pasta atual for um DS gerado, use-a;
  3. senão, procure `GERACAO.md` nas subpastas e nas pastas vizinhas (um nível). Achando uma, use-a; achando várias, pergunte ao usuário qual subir (uma pergunta, com as pastas como opções).

  Se não achar nenhuma, diga que não há DS gerado e sugira `/ds-build` para criar um.

## 2. Instalar as dependências, se faltarem

Se não houver `node_modules` na pasta, avise o usuário e rode:

```bash
npm install --legacy-peer-deps
```

O `--legacy-peer-deps` é obrigatório para este template. Se a instalação falhar, mostre as linhas do erro e pare.

## 3. Subir o servidor

Rode na pasta do DS, **em segundo plano** (o processo não termina sozinho; não espere por ele):

```bash
npm run dev
```

Em seguida, acompanhe a saída até aparecer a linha `Local:` do Vite. Use o endereço que ela mostrar: a porta padrão é 8080, mas o Vite usa a próxima livre se a 8080 estiver ocupada. Se nesta conversa já houver um `npm run dev` rodando para a mesma pasta, não suba outro: reaproveite o endereço dele.

Se aparecer erro em vez da linha `Local:`, mostre as linhas relevantes da saída ao usuário e pare o processo.

## 4. Mostrar ao usuário

Diga que o projeto está rodando e entregue:

- o endereço (ex.: `http://localhost:8080/`);
- as páginas principais: `/`, `/fundamentos`, `/tokens`, `/componentes`, `/templates`, `/marca`;
- como parar: encerrar o processo em segundo plano (ou `Ctrl+C` no terminal em que ele roda).

Se houver uma ferramenta de navegador disponível, ofereça abrir o endereço. Não faça build, deploy nem publicação: este comando só sobe o servidor local.
