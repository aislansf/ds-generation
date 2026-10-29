# Estilos visuais

A marca define **cor, fonte, logo e voz**. O estilo define **forma, profundidade, peso, textura e ritmo**: raios, espessura de borda, sombras, pesos de fonte, tracking, duração das animações, neutros e superfícies.

**Sem estilo informado, o DS sai no estilo `corporativo`**, o visual de sempre. Gerar sem o campo `estilo` e gerar com `"estilo": "corporativo"` produz exatamente o mesmo DS.

## Catálogo

Só os estilos desta tabela existem em `assets/estilos/`. Ofereça ao usuário apenas estes.

| Grupo | id | Estilo | Em uma linha | Tema padrão |
|---|---|---|---|---|
| Limpos e funcionais | `corporativo` | **Corporativo (padrão)** | Flat corporativo e neutro, o visual de hoje | light |
| | `minimalista` | Minimalista | Só o essencial: respiro, quase sem sombra, menu lateral claro | light |
| | `suico` | Suíço / Tipográfico Internacional | Cantos retos, tipografia protagonista, fio forte no topo dos cards | light |
| | `flat` | Flat design | Cores chapadas, cards separados por cor e não por borda | light |
| | `material` | Material Design (M3) | Superfícies tonais, elevação em duas camadas, botões em pílula, camada de estado | light |
| | `escandinavo` | Escandinavo / Nórdico | Neutros quentes, formas suaves, sombras leves | light |
| Ousados | `brutalista` | Brutalista | Preto e branco, bordas grossas, sem raio, sem sombra, sem animação | light |
| | `neobrutalismo` | Neobrutalismo | Contorno preto grosso, sombra dura deslocada, hover que "levanta" | light |
| | `maximalista` | Maximalista | Muitas cores, padrões e camadas nas superfícies de marca | light |
| | `grunge` | Grunge | Papel com grão, bordas rasgadas e "adesivos", estética de zine | light |
| Inspirados em épocas | `art-nouveau` | Art Nouveau | Curvas "chicote", folhas e molduras em creme | light |
| | `bauhaus` | Bauhaus | Retângulos retos, círculos e composição geométrica assimétrica | light |
| | `construtivismo` | Construtivismo russo | Diagonais, títulos em caixa alta e tom de cartaz | light |
| | `retro` | Retrô / Vintage | Anos 70: cores desbotadas, raios de sol e grão leve | light |
| Digitais e de interface | `neumorfismo` | Neumorfismo | Relevo na mesma cor do fundo; campos afundados | light |
| | `glassmorfismo` | Glassmorfismo | Vidro fosco sobre a malha de cores da marca | light |
| | `claymorfismo` | Claymorfismo | 3D macio, como massinha, com a cor da marca na sombra | light |
| | `bento` | Bento grid | Blocos de tamanhos variados em grade de 4 colunas, bloco de destaque na cor da marca | light |
| | `cyberpunk` | Dark mode / Cyberpunk | Fundo escuro, neon da marca, cantos cortados | **dark** |
| Orgânicos e artesanais | `organico` | Orgânico / Natural | Tons terrosos, blobs e ondas | light |
| | `ilustrativo` | Ilustrativo / Hand-drawn | Espaços de ilustração no hero, no login, nos estados vazios e nos erros | light |
| | `colagem` | Colagem | Recortes de papel, retícula e fita adesiva | light |

O `bento` é o único estilo de **layout** (nível 4): além dos tokens, reorganiza cinco páginas do DS (ver "Layout bento" abaixo).

Fora do escopo: Art Déco, Memphis, Y2K e Skeuomorfismo.

## Como o estilo é aplicado

O gerador aplica o preset depois de recolorir a marca e antes dos ajustes de contraste:

1. resolve as expressões do preset com as cores finais do briefing (`{primaria.h}`, `{secundaria}`, `{neon}`…);
2. grava os **tokens de pele** em `:root` e `.dark` de `src/index.css`;
3. copia a **camada CSS** do estilo para `src/styles/estilo.css` (vazia no `corporativo`);
4. grava `src/config/estilo.ts` (id, nome, tema padrão, layout) e o tema padrão no script do `index.html`;
5. sem degradê no estilo: o header degradê vira cor sólida;
5a. estilos de nível 3 (decoração): gera os SVGs do estilo em `public/estilo/`, nas cores da marca e com o slug como semente (mesma marca, mesma decoração), aponta os tokens `--deco-*` para eles e põe a camada comum `assets/estilos/_decoracao.css` antes da camada do estilo. A decoração só aparece em superfícies de marca (`[data-surface="marca"]`) e soma no máximo 200 KB;
5b. se o estilo define `--input`, os campos de formulário passam a seguir o estilo: `--control-border` = `--input`, `--control-border-hover` = `--ring`, placeholder = `--muted-foreground`, texto = `--foreground` (o preset pode fixar qualquer `--control-*` ele mesmo);
6. confere os **mínimos de contraste do estilo** e ajusta só tokens do próprio estilo.

O DS gerado mostra o estilo no grupo "Estilo visual" de `/tokens`, em `public/design-system/manifest.json` (`estilo: { id, nome }`) e nos tokens DTCG do Figma.

### Tokens de pele

Valores do `corporativo` (reproduzem o visual de sempre). Os nomes completos estão em `src/index.css` do DS gerado.

| Token | Padrão | Onde age |
|---|---|---|
| `--border-width`, `--border-width-strong` | `1px`, `2px` | `border`, `border-2`, `divide-*` |
| `--card-border-width`, `--control-border-width` | `var(--border-width)` | Card; Input, Textarea, Select, botão outline |
| `--radius` e `--radius-xl/2xl/3xl/full` | `0.375rem`, `0.75rem`, `1rem`, `1.5rem`, `9999px` | `rounded-*` |
| `--radius-card`, `--radius-control`, `--radius-control-brand` | `var(--radius)`, `calc(var(--radius) - 2px)`, `var(--radius)` | Card e Dialog; botões e campos; botão `brand` |
| `--shadow-ui`, `--shadow-ui-xs…2xl`, `--shadow-ui-inner` | sombras do Tailwind 3 | `shadow-*` dos componentes |
| `--shadow-inset`, `--shadow-hover`, `--shadow-brand` | `none`, `var(--shadow-ui-md)`, sombra tingida da primária | Campos afundados, hover, CTA de marca |
| `--card-alpha`, `--surface-blur`, `--surface-pattern` | `1`, `0px`, `none` | Vidro (glassmorfismo) |
| `--control-border`, `--control-border-hover`, `--control-placeholder`, `--control-foreground`, `--control-placeholder-input` | cores fixas dos campos do DS de referência, recoloridas pela marca | Borda, hover/foco, placeholder dos campos crus; texto e placeholder do Input/Textarea |
| `--font-light…black` | `300…900` | `font-*` |
| `--tracking-*`, `--duration-*`, `--ease-*` | escala atual | `tracking-*`, `duration-*`, `transition` |
| `--icon-stroke` | `2` | Traço dos ícones Lucide |
| `--deco-hero`, `--deco-divider`, `--deco-pattern`, `--deco-texture`, `--deco-mask` | `none` | Decoração do nível 3, só em superfícies de marca: arte do hero/painel/capa, faixa do header/rodapé/estado vazio, padrão e textura da página de erro, borda irregular |
| `--chart-line-width`, `--chart-bar-radius`, `--chart-smooth`, `--chart-tooltip-radius` | `2`, `0`, `0`, `8` | Tema ECharts (`brandTheme.ts`) |
| `--heading-transform`, `--deco-*` | `none` | Reservados para os estilos com decoração |

Para "sem sombra" use `0 0 #0000`, não `none`: as sombras dos componentes entram numa lista junto com o anel de foco, e `none` apagaria o foco. O gerador converte `none` sozinho nos tokens `--shadow-ui*` e `--shadow-hover`.

### Ganchos da camada CSS

- `[data-ds="button|card|input|textarea|select-trigger|checkbox|radio|switch|badge|alert|dialog|popover|dropdown|tabs-list|tabs-trigger|table|toast|tooltip|sidebar|header"]`
- `[data-ds="button"][data-variant="default|brand|outline|secondary|ghost|link|destructive|diversificado"]`
- `[data-surface="marca"][data-marca="header|hero|painel|capa|erro|rodape|vazio"]`: superfícies de marca (header do DS, hero da Home, painel visual de login, cadastro, 2FA e modal de acesso, capa do Hub de painéis, páginas de erro, rodapé e estado vazio). Decoração só entra nelas.

Ao mexer em `box-shadow` de um elemento focável na camada CSS, componha com o anel de foco: `box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--shadow-ui);`. Propriedades estruturais (`position`) vão dentro de `:where(...)` para não vencer as classes das páginas.

## Regras

1. **Marca define cor; estilo define forma.** Um preset nunca altera `--primary`, `--secondary`, a escala da marca (`--brand-*`) nem as cores semânticas (`success`, `warning`, `error`, `info`, `destructive`). O `_schema.json` e o gerador recusam o preset.
2. **A fonte da marca vence.** O estilo tem fontes sugeridas (mostre na pergunta de fontes), mas não troca a fonte escolhida. Se o usuário não adotar a sugestão, o `GERACAO.md` registra como pendência informativa.
3. **Acessibilidade não é negociável.** Mínimos de todo estilo: texto sobre `--background`, `--card`, `--muted`, menu lateral e header com 4.5:1; borda de campo (`--input`) e anel de foco (`--ring`) com 3:1 sobre o fundo. Quando falha, o gerador ajusta a luminosidade do token que o estilo definiu e registra em "Ajustes de contraste do estilo"; se não conseguir, registra um aviso.
4. **Movimento e transparência reduzidos.** Estilos com deslocamento ou aumento no hover (neobrutalismo, claymorfismo) desligam o efeito com `prefers-reduced-motion`; animações e rotações (glitch do cyberpunk, "adesivos" do grunge, título inclinado do construtivismo, recortes da colagem) só existem em `@media (prefers-reduced-motion: no-preference)`. O glassmorfismo volta a superfícies opacas sem `backdrop-filter` ou com `prefers-reduced-transparency`.
5. **Determinístico.** Não ajuste raio, sombra ou borda à mão no DS gerado. Mude o preset e gere de novo.

## Especificação por estilo

Cada preset está em `assets/estilos/<id>/preset.json`, com `descricao`, `fontes_sugeridas`, `faca` e `evite`. Resumo do que muda em relação ao `corporativo`:

- **minimalista:** raio 0.25rem (cards 0.5rem); sem sombra, exceto popovers e modais; bordas claras e campos mais escuros que a borda; pesos mais leves (bold 600); ícones com traço 1.5; menu lateral e header claros; sem degradê.
- **suico:** todos os raios 0 (avatares continuam redondos); sem sombra; tracking fechado nos títulos e aberto nos rótulos em caixa alta; números tabulares; fio de 2px no topo dos cards; sem degradê.
- **flat:** raio 0.25rem; sem sombra; cards sem borda, separados pela cor (`--card` levemente tingida da primária sobre fundo branco); sem degradê.
- **material:** botões e controles em pílula; cards 0.75rem, sem borda, com superfície tonal; elevação M3 em duas camadas; camada de estado de 8% no hover e 12% no pressionado; campos "filled" com borda inferior.
- **escandinavo:** neutros quentes (fundo, cards, bordas, menu lateral e header); raio 0.75rem (cards 1rem); sombras leves de tinta quente; bold 600; animações um pouco mais lentas; sem degradê.
- **brutalista:** preto e branco puros; todos os raios 0, inclusive avatar e switch; bordas de 2px; sem sombra e sem animação; links sublinhados; ghost/link como link azul do navegador; hover que inverte as cores; foco de 3px; rótulos em fonte mono do sistema; sem degradê.
- **neobrutalismo:** fundo tingido do destaque; bordas pretas de 2px; sombras duras deslocadas (sem desfoque); botões e badges com contorno; hover que desloca o botão e aumenta a sombra; pesos mais fortes; sem degradê.
- **neumorfismo:** fundo, cards e popovers na mesma cor; relevo com luz e sombra; campos, checkbox, switch e abas afundados; salvaguardas: borda de 3:1 em todo controle e anel de foco sólido; sem degradê.
- **glassmorfismo:** malha de `radial-gradient` com as cores da marca no fundo; cards, header, menus e modais em vidro (55% de opacidade no light, 35% no dark, desfoque de 16px); cards com tabela ou formulário a 85%.
- **claymorfismo:** fundo tingido da primária; cards 1.5rem e controles em pílula, sem borda; sombra colorida por fora e realce por dentro; hover com aumento de 2%; gráficos com curvas suaves e barras arredondadas.
- **bento:** fundo tingido da primária (cinza-azulado, quase escuro no dark) e cards brancos sem borda e sem sombra, com raio de 1.25rem; a separação vem da cor de fundo e do espaço. Reorganiza as páginas em grade de 4 colunas (ver "Layout bento").
- **cyberpunk:** abre em dark; fundo quase preto azulado; neon calculado a partir da cor mais saturada da marca (`{neon}`) em bordas, foco, menu ativo e header; sombras de brilho; cantos cortados nos cards em repouso (somem em hover e foco, para o brilho e o anel não serem cortados); rótulos em mono com caixa alta; efeito "glitch" em rajadas curtas no título do hero (sem ele com movimento reduzido). No light, alto contraste: estrutura em neutro escuro sobre fundo frio e o neon escurecido no anel de foco. Se nenhuma cor da marca for saturada, o `GERACAO.md` avisa.

- **maximalista:** cards 1.25rem e controles em pílula; bordas de 2px; sombras coloridas em camadas (secundária e primária); camadas de bolinhas, listras e zigue-zague ao lado do texto do hero; faixa com as quatro cores no header, no rodapé e nos estados vazios; título do hero maior.
- **grunge:** fundo de papel e texto quase preto; raio mínimo; sombras de "tinta"; recortes com fita no hero; grão de papel (≤ 6%), bordas rasgadas por máscara no hero e no painel de login; badges de marca levemente tortos; sem degradê.
- **art-nouveau:** fundo creme; cards com cantos assimétricos; sombras quentes e suaves; curva "chicote" com folhas no hero, divisória ornamental, moldura de linha dupla no painel de login; animações lentas.
- **bauhaus:** todos os raios 0, exceto círculos (contêineres de ícone, avatares, badges); bordas de 2px quase pretas; sem sombra; composição de círculo, quadrado e triângulo no hero; faixa de três cores; sem degradê.
- **construtivismo:** raios 0; fundo de cartaz; bordas de 3px; títulos em caixa alta; faixas diagonais, seta e barra no hero, só com a primária e o preto; título do hero inclinado; sem degradê.
- **retro:** fundo e cards creme; bordas marrons de 2px; raio 1rem; sombras deslocadas quentes; raios de sol e listras arredondadas com as cores da marca desbotadas (−15% de saturação); grão leve; sem degradê.
- **organico:** fundo areia e texto tingido da primária; cards 1.5rem sem borda, com sombras suaves; gráficos com curvas suaves; blobs dessaturados no hero e no login, divisórias em onda; logo do hero com recorte orgânico.
- **ilustrativo:** raio 0.75rem, bordas de 1.5px, ícones com traço 1.75; placeholders de ilustração gerados (`public/estilo/ilustracoes/`: hero, login, vazio, erro-404, erro-500) com moldura tracejada e cena simples nas cores da marca. As ilustrações reais ficam como pendência do `GERACAO.md`.
- **colagem:** raios 0; fundo de papel; sombra de papel; recortes coloridos com fita adesiva no hero, retícula na página de erro, grão e bordas rasgadas; logo do hero levemente torto; sem degradê.

## Layout bento

O `bento` grava `"layout": "bento"` em `src/config/estilo.ts`. As páginas já trazem as duas versões (a grade original e a bento) e escolhem pelo `ESTILO.layout`, com as funções de `src/components/layout/bento.ts` (`bentoGrid`, `bentoCell`, `bentoSizes`) e os componentes `BentoGrid` e `BentoCell` para páginas novas. Em qualquer outro estilo, as funções devolvem as classes originais: o DS sai igual.

| Página | O que vira bento |
|---|---|
| Home | cards de navegação: o primeiro em 2×2 (destaque, na cor primária), quatro em 1×1 e dois em 2×1 |
| Dashboard Institucional | 6 indicadores: 2×1 (destaque), quatro em 1×1 e um 2×1 |
| Dashboard Analítico | 4 indicadores em 1×1 (o primeiro é o destaque) e o gráfico territorial em 3×1 ao lado do trimestral em 1×1 |
| Hub de painéis | os cards fecham as linhas da grade (alguns viram 2×1, conforme a quantidade) |
| Tela BI, visão geral | 8 indicadores (2×1 no primeiro, no sexto, no sétimo e no oitavo) e 4 gráficos (3×1 + 1×1 e 2×1 + 2×1) |

Regras do layout:

1. **A ordem do DOM segue a leitura lógica.** O bloco maior vem primeiro no código; a grade nunca usa `grid-auto-flow: dense`, que reordenaria visualmente sem reordenar o foco por teclado.
2. **Responsivo.** Uma coluna abaixo de 640px, duas de 640 a 1023px, quatro a partir de 1024px. Blocos de duas linhas só se estendem a partir de 1024px.
3. **Feche as linhas.** A soma das larguras dos blocos de cada linha é 4; os tamanhos acima já fecham. Ao acrescentar um indicador, ajuste o tamanho dos vizinhos (ou use `bentoSizes(n)`, que escolhe quais blocos viram 2×1 para fechar as linhas).
4. **Um só bloco de destaque por grade**, marcado com `hero` em `bentoCell`. A camada CSS do estilo o pinta com a primária e força o texto dele para `--primary-foreground`.

## Criar ou ajustar um preset

1. Copie a pasta de um estilo parecido em `assets/estilos/` e troque `id` (igual ao nome da pasta), `nome`, `ordem` e `descricao`.
2. Em `tokens`, liste só o que muda. Valores aceitam `{primaria.h}`, `{primaria}` (triplet HSL), `{secundaria…}`, `{destaque…}`, `{realce…}` e `{neon}`.
3. Se precisar de CSS (`css: "estilo.css"`), use os ganchos acima e componha sombras com o anel de foco.
3b. Decoração (nível 3): `decoracao: "decoracao.json"` com `slots` (`hero`, `divisoria`, `padrao`, `textura`, `mascara`), cada um com um `gerador` de `scripts/lib/decoracao.mjs` e seus parâmetros, e `dessaturar` opcional. Decoração e animação só em `[data-surface="marca"]` e dentro de `@media (prefers-reduced-motion: no-preference)` (os testes do repositório conferem).
4. Rode `node tools/matriz-estilos.mjs --node-modules <pasta> --estilos <id> --capturas` no repositório da skill: gera, compila, testa e captura o estilo em light e dark.
