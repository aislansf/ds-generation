---
name: ds-generator
description: Gera um Design System completo (site de documentação React/Vite/Tailwind/shadcn com tokens, componentes, templates de tela, páginas de marca, acessibilidade e validadores) para uma nova marca, a partir do DS de referência do SEBRAE-CE. Use quando o usuário pedir para "criar um design system para a marca X", "gerar DS", "replicar o DS do SEBRAE para outro cliente", "fazer um DS igual ao ds-sebrae", ou quando precisar atualizar o template com mudanças do DS de origem.
---

# ds-generator

Gera um Design System no mesmo padrão do `ds-sebrae`, trocando **marca, cores, fontes, logos e textos** e mantendo a arquitetura, os tokens, os ~50 componentes, os templates de tela e os validadores.

O trabalho tem duas metades:

1. **Mecânica (scripts, determinística):** placeholders, recoloração por família de matiz, fontes, logos, remoção de módulos e ajustes de contraste.
2. **Semântica (você, o agente):** reescrever os textos que descrevem a marca (manual de marca, paleta estendida, tom de voz, exemplos de conteúdo) e revisar o resultado visualmente.

Nunca pule a segunda metade: o script entrega um DS que compila, mas o conteúdo da página Marca e da paleta estendida continua descrevendo a marca de origem até você reescrever.

## Arquivos da skill

| Caminho | Para quê |
|---|---|
| `assets/brand-brief.template.json` | Modelo do briefing de marca (entrada do gerador) |
| `assets/examples/sebrae-ce.json` | Briefing da marca de origem, com o bloco `origem` usado na extração |
| `assets/examples/exemplo-verde.json` | Marca fictícia para testar o gerador |
| `assets/template/` | Template neutro (gerado por `extract-template.mjs`, não editar à mão) |
| `assets/overrides/` | Arquivos que substituem os do template (README, check-legacy-brand) |
| `scripts/generate-ds.mjs` | Gera o DS para um briefing |
| `scripts/extract-template.mjs` | Recria `assets/template/` a partir do DS de origem |
| `scripts/validar-contraste.mjs` | Auditoria WCAG dos pares de tokens |
| `scripts/gerar-escala.mjs` | Escala 50–700 (light/dark) a partir de um HEX |
| `references/` | Contrato de tokens, arquitetura, páginas, reescrita semântica e checklist |

Leia `references/tokens.md` antes de mexer em qualquer cor ou token, e `references/reescrita-semantica.md` antes da etapa 5.

## Fluxo

### 1. Montar o briefing

Copie `assets/brand-brief.template.json` para a pasta de trabalho do usuário (ex.: `briefings/<slug>.json`) e preencha com ele. Mínimo obrigatório: `nome`, `slug`, `cores.primaria`, `fontes.primaria.nome`. Pergunte também, em uma única rodada:

- nome curto/sigla e **gênero** (`"m"` para "do SEBRAE", `"f"` para "da Agência") — sem isso o texto sai com "do Agência";
- cores secundária, de destaque e de realce (se o manual tiver);
- fontes display e sistema; se a display for proprietária, a URL do `.woff2`;
- logos em SVG (cor, branco, preto) e favicon;
- domínio de publicação do DS, domínio institucional e URL do manual de marca;
- marcas antigas que não podem aparecer (`termos_proibidos`);
- se mantém os Modelos de BI (`modulos.modelos_bi`).

Se o usuário tiver um manual de marca em PDF, leia-o para extrair cores, fontes, regras de uso do logo e tom de voz.

Caminhos no briefing são relativos ao próprio JSON.

### 2. (Só se o DS de origem mudou) Atualizar o template

```bash
node scripts/extract-template.mjs --source <repo-ds-sebrae>/frontend
```

A saída deve terminar com `remanescentes de "sebrae": 0`. Se aparecer algo, ajuste o bloco `origem` de `assets/examples/sebrae-ce.json` (`variantes_nome`, `aliases_codigo`, `substituicoes_conteudo`…) e rode de novo. Detalhes em `references/geracao.md`.

### 3. Gerar

```bash
node scripts/generate-ds.mjs --brief <briefing.json> --out <pasta-destino>
```

Opções: `--force` sobrescreve a pasta; `--node-modules <pasta>` cria uma junction para um `node_modules` existente (útil para testar sem `npm install`).

O script imprime um resumo e grava `<pasta-destino>/GERACAO.md`, com os ajustes de contraste, os avisos, as pendências e a tabela WCAG.

### 4. Instalar e validar

```bash
cd <pasta-destino>
npm install --legacy-peer-deps
npm run build     # typecheck + marcas proibidas + tipografia legada + H1 + vite build
npx vitest run    # validador de tokens (/tokens × index.css) e regressões
```

O build **falha** enquanto houver termo proibido (marca de origem ou antigas). Isso é intencional: é a trava que garante a troca completa.

### 5. Reescrita semântica (obrigatória)

Siga `references/reescrita-semantica.md`. Em resumo:

- `src/pages/MarcaPage.tsx`: regras de uso do logo, área de proteção, tamanhos mínimos, usos incorretos e Pantones, tudo a partir do manual da nova marca;
- `src/components/ColorSection.tsx`: a paleta estendida e a escala de referência têm nomes da origem ("Azul Profundo", "Coral Carnaval"…). Renomeie a partir de `conteudo.paleta_estendida`;
- `src/pages/HomePage.tsx`: bloco "Brandbook", princípios e texto do hero;
- `src/pages/ConteudoPage.tsx`: tom de voz (`conteudo.tom_de_voz`);
- dados de exemplo listados em "Conteúdo de exemplo da marca de origem" no `GERACAO.md`: troque programas e diretorias da origem por exemplos do universo da nova marca;
- `public/llms.txt`, `index.html` (title, description, JSON-LD).

Não troque cores fixas à mão: se um tom ficou errado, ajuste o briefing ou as famílias (`references/geracao.md`) e gere de novo.

### 6. Revisão visual

Rode `npm run dev` (porta 8080) e confira no navegador, em light e dark: `/`, `/fundamentos`, `/tokens`, `/componentes`, `/templates`, `/marca`. Procure:

- texto ilegível sobre a primária (botões, sidebar, header);
- tons "estranhos" em ilustrações e gráficos (sinal de uma cor fora das janelas de família);
- logos provisórios (o gerador cria um logotipo tipográfico quando o SVG não foi informado);
- miniaturas da página Templates, que ainda mostram a marca de origem: recapture com o DS novo rodando.

Depois rode `node <skill>/scripts/validar-contraste.mjs src/index.css` e confirme que nenhum par **piorou** em relação à origem.

### 7. Entregar

Informe ao usuário: a pasta gerada, o resultado de build e testes, as pendências que ficaram (imagens, logos provisórios, conteúdo que precisa de decisão dele) e a tabela de contraste resumida. Não publique nem faça deploy sem ele pedir. O DS gerado não traz pipeline de CI; se o usuário quiser um, use como modelo o workflow descrito em `references/arquitetura.md`.

## Limites conhecidos

- **Imagens:** fotos e miniaturas `.jpg` são copiadas como estão. Os `.asset.json` que apontavam para o CDN da Lovable viram placeholders SVG locais em `public/placeholders/`.
- **Recoloração:** preserva a luminosidade e move a matiz. Marcas muito claras (amarelo, verde-limão) como primária podem precisar de `--primary-foreground` escuro; o gerador ajusta isso sozinho só quando a nova marca fica pior que a origem.
- **Idioma:** o template é pt-BR.
