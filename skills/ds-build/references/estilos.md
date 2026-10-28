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
| Digitais e de interface | `neumorfismo` | Neumorfismo | Relevo na mesma cor do fundo; campos afundados | light |
| | `glassmorfismo` | Glassmorfismo | Vidro fosco sobre a malha de cores da marca | light |
| | `claymorfismo` | Claymorfismo | 3D macio, como massinha, com a cor da marca na sombra | light |
| | `cyberpunk` | Dark mode / Cyberpunk | Fundo escuro, neon da marca, cantos cortados | **dark** |

Ainda não disponíveis (dependem de decoração gerada ou de layout próprio, fases 4 e 5 do `docs/PLANO-ESTILOS.md` do repositório): maximalista, grunge, art nouveau, bauhaus, construtivismo russo, retrô, orgânico, ilustrativo, colagem e bento grid. Se o usuário pedir um deles, diga que ainda não existe e ofereça de 2 a 4 estilos próximos do catálogo (ex.: bauhaus → suíço ou neobrutalismo; orgânico → escandinavo ou claymorfismo; bento → material ou flat).

Fora do escopo: Art Déco, Memphis, Y2K e Skeuomorfismo.

## Como o estilo é aplicado

O gerador aplica o preset depois de recolorir a marca e antes dos ajustes de contraste:

1. resolve as expressões do preset com as cores finais do briefing (`{primaria.h}`, `{secundaria}`, `{neon}`…);
2. grava os **tokens de pele** em `:root` e `.dark` de `src/index.css`;
3. copia a **camada CSS** do estilo para `src/styles/estilo.css` (vazia no `corporativo`);
4. grava `src/config/estilo.ts` (id, nome, tema padrão, layout) e o tema padrão no script do `index.html`;
5. sem degradê no estilo: o header degradê vira cor sólida;
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
| `--font-light…black` | `300…900` | `font-*` |
| `--tracking-*`, `--duration-*`, `--ease-*` | escala atual | `tracking-*`, `duration-*`, `transition` |
| `--icon-stroke` | `2` | Traço dos ícones Lucide |
| `--chart-line-width`, `--chart-bar-radius`, `--chart-smooth`, `--chart-tooltip-radius` | `2`, `0`, `0`, `8` | Tema ECharts (`brandTheme.ts`) |
| `--heading-transform`, `--deco-*` | `none` | Reservados para os estilos com decoração |

Para "sem sombra" use `0 0 #0000`, não `none`: as sombras dos componentes entram numa lista junto com o anel de foco, e `none` apagaria o foco. O gerador converte `none` sozinho nos tokens `--shadow-ui*` e `--shadow-hover`.

### Ganchos da camada CSS

- `[data-ds="button|card|input|textarea|select-trigger|checkbox|radio|switch|badge|alert|dialog|popover|dropdown|tabs-list|tabs-trigger|table|toast|tooltip|sidebar|header"]`
- `[data-ds="button"][data-variant="default|brand|outline|secondary|ghost|link|destructive|diversificado"]`
- `[data-surface="marca"]`: superfícies de marca (hoje, o header do DS). Decoração só entra nelas.

Ao mexer em `box-shadow` de um elemento focável na camada CSS, componha com o anel de foco: `box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--shadow-ui);`. Propriedades estruturais (`position`) vão dentro de `:where(...)` para não vencer as classes das páginas.

## Regras

1. **Marca define cor; estilo define forma.** Um preset nunca altera `--primary`, `--secondary`, a escala da marca (`--brand-*`) nem as cores semânticas (`success`, `warning`, `error`, `info`, `destructive`). O `_schema.json` e o gerador recusam o preset.
2. **A fonte da marca vence.** O estilo tem fontes sugeridas (mostre na pergunta de fontes), mas não troca a fonte escolhida. Se o usuário não adotar a sugestão, o `GERACAO.md` registra como pendência informativa.
3. **Acessibilidade não é negociável.** Mínimos de todo estilo: texto sobre `--background`, `--card`, `--muted`, menu lateral e header com 4.5:1; borda de campo (`--input`) e anel de foco (`--ring`) com 3:1 sobre o fundo. Quando falha, o gerador ajusta a luminosidade do token que o estilo definiu e registra em "Ajustes de contraste do estilo"; se não conseguir, registra um aviso.
4. **Movimento e transparência reduzidos.** Estilos com deslocamento ou aumento no hover (neobrutalismo, claymorfismo) desligam o efeito com `prefers-reduced-motion`. O glassmorfismo volta a superfícies opacas sem `backdrop-filter` ou com `prefers-reduced-transparency`.
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
- **cyberpunk:** abre em dark; fundo quase preto azulado; neon calculado a partir da cor mais saturada da marca (`{neon}`) em bordas, foco, menu ativo e header; sombras de brilho; cantos cortados nos cards; rótulos em mono com caixa alta. No light, alto contraste com o neon escurecido. Se nenhuma cor da marca for saturada, o `GERACAO.md` avisa.

## Criar ou ajustar um preset

1. Copie a pasta de um estilo parecido em `assets/estilos/` e troque `id` (igual ao nome da pasta), `nome`, `ordem` e `descricao`.
2. Em `tokens`, liste só o que muda. Valores aceitam `{primaria.h}`, `{primaria}` (triplet HSL), `{secundaria…}`, `{destaque…}`, `{realce…}` e `{neon}`.
3. Se precisar de CSS (`css: "estilo.css"`), use os ganchos acima e componha sombras com o anel de foco.
4. Rode `node tools/matriz-estilos.mjs --node-modules <pasta> --estilos <id> --capturas` no repositório da skill: gera, compila, testa e captura o estilo em light e dark.
