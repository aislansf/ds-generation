# Neumorfismo: validação componente a componente (retomada)

Documento de passagem para continuar a validação em outra janela de contexto. Estado de **05/11/2026**, no fechamento: todos os grupos validados e o DS inteiro revisto. Nada disto foi commitado: tudo está na árvore de trabalho (`git status`, mais de 200 entradas).

## O que se está fazendo

Atualizar o estilo **Neumorfismo** do gerador de DS (`skills/ds-build`) para ficar fiel ao pacote anexo **Neumorphic UI v3.2.0**, **só quando o usuário escolhe o estilo `neumorfismo`**. O corporativo e os demais estilos não podem mudar.

- Referência navegável: `http://localhost:8359/catalog/<Componente>.html` (o usuário serve o catálogo do zip `C:\Users\Aislan\Downloads\neumorphic-ui-v3.2.0.zip`; dentro dele: `neumorphic-ui/components/<Nome>/README.md`, `.../preview.html`, `neumorphic-ui/src/bundle.src.js` (a lógica de todos os componentes), `dist/components.css`, `tokens/tokens.css`, `docs/COMPONENTS.md`).
- Anexo anterior (usado só quando o usuário aponta): `C:\Users\Aislan\Downloads\stitch_neumorphic_design_system_ui\code.html` (seção "Switches & Toggles"). O usuário também já colou HTML do mesmo estilo no chat (ex.: seção "Sliders horizontais"); quando o fizer, o HTML dele manda.
- Regra do repositório: trabalhar só com dados deste repositório; mudanças estruturais entram como **patch na extração** (`tools/lib/neumorfismo-componentes.mjs`), não por reextração da origem (ver memória `so-este-repositorio`).

## Como o usuário quer trabalhar (importante)

1. **Um componente por vez**, na ordem do catálogo (`docs/COMPONENTS.md` do zip). Mostrar o resultado, esperar o usuário **validar** ("Validado, próximo") ou pedir ajuste ("Ajustar X", "Ainda ajustar").
2. **Inspecionar o HTML e o CSS da referência de verdade**: abrir a página do catálogo no navegador e ler os **estilos computados** (`getComputedStyle`: largura, raio, sombras, degradê, borda, cores) e o `outerHTML`, e comparar com o DS. Não adivinhar a partir da imagem. Ler também o README do componente e a função dele em `bundle.src.js` (comportamento, ARIA, props).
3. Se o componente da referência **não existe no DS, criar a seção** (como Slider, Progress, Alert Dialog…). Se já existe um cartão (`ComponentPreview`), **integrar dentro dele** (trocar só o exemplo) para manter "Ver código", "Quando usar" e "Acessibilidade" e **evitar redundância**.
4. Quando o usuário pede ajuste sem detalhar, usar `AskUserQuestion`; ele responde em texto livre ("Outro") e às vezes cola HTML ou imagem. Siga o que ele escreve.
5. Cada resposta termina com: recap curto, a pergunta "validado para seguir para X?" e o `wrap_up`; a mensagem final traz o relato completo (o que foi feito, comparação computada, alinhamentos deliberados, testes, o que não foi conferido). O usuário responde "Validado, próximo".

## Fluxo técnico por componente (o que funcionou nesta janela)

Arquivos novos vão em `tools/lib/patch/` (fonte) e são copiados para o template:

| O quê | Onde |
|---|---|
| Componente da vitrine | `tools/lib/patch/Neumorfismo<Nome>.tsx` → `skills/ds-build/assets/template/src/components/estilo/` |
| Teste | `tools/lib/patch/Neumorfismo<Nome>.test.tsx` → `.../estilo/__tests__/` |
| Registro dos arquivos novos e das trocas no `ComponentesPage.tsx`/`DSLayout.tsx` | `tools/lib/neumorfismo-componentes.mjs` (`NEUMORFISMO_NOVOS`, `NEUMORFISMO_TROCAS`) |
| CSS do estilo | `skills/ds-build/assets/estilos/neumorfismo/estilo.css` (blocos novos entram antes de `/* ---------- Foco, rolagem e movimento ---------- */`) |
| Tokens de sombra/raio | `skills/ds-build/assets/estilos/neumorfismo/preset.json` |

Receita para **integrar num cartão existente** (padrão Badge, Alert, Toast, Tooltip, Spinner, Skeleton, EmptyState, Modal): o componente novo renderiza o próprio `ComponentPreview` e a seção do `ComponentesPage` ganha um retorno antecipado, por exemplo:
`function AlertSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoAlertas />;\n  return (...` (troca `[arquivo, antes, depois]`; o `antes` é `function XSection() {\n  return (\n    <ComponentPreview\n      title="X"`). Quando a seção tem hooks no topo (Toast, Modal), o retorno entra **depois** dos hooks. O código original (ainda usado pelos outros estilos) não muda.

Receita para **criar seção nova** (Slider, Segmentado, Questionário, Progress, Alert Dialog, Dialog, Sheet, Drawer, Popover, HoverCard): três trocas encadeadas por **acréscimo ao fim do texto da anterior** — (1) `import` logo depois do import da seção anterior; (2) o bloco `{(ESTILO.id as string) === "neumorfismo" && (<><SectionHeader id="…" … /><Componente /></>)}` inserido **depois do bloco da seção anterior** (âncora = as 3 últimas linhas do bloco anterior), com o **4º elemento da troca (`marca`) = `id="…"`** para a anterior não reaplicar; (3) item no menu em `DSLayout.tsx`, depois do item anterior.

**Escrever o registro com cuidado:** edite `neumorfismo-componentes.mjs` com `Edit`, ou com um script Node usando `String.raw` (as strings das trocas levam `\n` literais). Já houve um acidente em que `\\n` num template virou quebra de linha real e o módulo parou de carregar: confira com `node -e 'import("./tools/lib/neumorfismo-componentes.mjs").then(m=>console.log(m.NEUMORFISMO_TROCAS.length))'`. O `python` do ambiente é o 2: use Node para scripts.

Passos:

```bash
# 1) aplicar ao template versionado: rode TRÊS vezes. A 1ª aplica; a 2ª pode dar 1 edição (o codemod de ganchos acrescenta data-ds nos arquivos novos); a 3ª deve dar 0
node tools/tokenizar-template.mjs

# 2) arquivo NOVO que já existe no template é ignorado ("já aplicada"): para refletir uma edição do patch, apague a cópia do template e rode de novo
rm skills/ds-build/assets/template/src/components/estilo/NeumorfismoX.tsx && node tools/tokenizar-template.mjs

# 3) gerar um DS de teste (não dá para --force numa pasta com o Vite rodando: gere numa pasta NOVA e suba o Vite em porta nova; o DS ds4 desta janela estava na 5230)
node skills/ds-build/scripts/generate-ds.mjs --brief briefings/serena-neumorfismo.json --out <pasta-nova>/ds --force --node-modules <caminho>/node_modules
cd <pasta-nova>/ds && npx vite --port 5240 --host 127.0.0.1     # http://127.0.0.1:5240/componentes

# 4) conferir
npm test                                                                  # 61 testes do repositório
cd <DS> && npx tsc -p tsconfig.app.json --noEmit && npx vitest run src/components/estilo     # 136 testes (31 arquivos) no fim desta janela
node tools/matriz-estilos.mjs --node-modules <caminho>/node_modules --estilos neumorfismo --brief briefings/serena-neumorfismo.json --saida <pasta>   # build completo + vitest (≈3 min); ainda NÃO rodado nesta janela, rodar ao fim
```

- **`node_modules` reutilizável:** `C:\Users\Aislan\AppData\Local\Temp\claude\D--repositorios-ds-generation\6c5e82cd-c0ef-4b8f-9754-f0b2a8211abb\scratchpad\nm-base\node_modules` (356 pacotes; era o que o `generate-ds` usou aqui). Se a pasta temporária sumir, qualquer `node_modules` de DS gerado serve, por exemplo `D:\repositorios\ds-cggd-fnde\node_modules`, ou rode `npm install` numa pasta gerada.
- **Para iterar sem regerar:** copie `estilo.css` para `<DS>/src/styles/estilo.css` (o Vite recarrega e fecha painéis abertos) e os `.tsx` novos para `<DS>/src/components/estilo/`. O `ComponentesPage.tsx` e o `DSLayout.tsx` do DS gerado têm os marcadores (`__BRAND_SHORT__`…) já substituídos, então **não os copie do template**: aplique as mesmas trocas com um `node -e` (import, retorno antecipado/bloco da seção e item de menu) ou regere o DS.
- Fotografar: abrir `http://127.0.0.1:<porta>/componentes`, `localStorage.setItem('brand-ds-theme','light')`, `document.documentElement.style.scrollBehavior='auto'` e `window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 230)` (o hash da URL não rola sozinho).

### Armadilhas já encontradas (leia antes de mexer)

- **Trocas encadeadas quebram a idempotência.** Uma troca roda uma vez (já aplicada = o `depois` está no arquivo, ou o `marca` está no arquivo). Se uma troca nova **altera o texto produzido por outra**, a anterior reaplica e duplica. Regra: só **acrescente ao fim** do texto da anterior; se precisar inserir no meio, dê `marca` à anterior. Valide simulando a aplicação do zero: copie o template, restaure `ComponentesPage.tsx` e `DSLayout.tsx` do `git show HEAD:...`, apague `components/estilo/` e rode `tokenizar-template.mjs --template <cópia>`; o resultado deve ser idêntico ao template versionado.
- **O codemod de ganchos** (`tools/lib/ganchos.mjs`) acrescenta `data-ds` a `<input>`, `<select>`, botões e cards na 2ª rodada. Para um `<input>` que não é campo (radio/checkbox escondido) use `className="sr-only …"`: o codemod ignora `sr-only`/`hidden`. `type` dinâmico conta como campo.
- **Testes do repositório que a camada CSS precisa respeitar:** nenhum `url()` fora de `[data-surface="marca"]` (use `clip-path: polygon(...)`); nenhum `rotate(`/`animation` fora de `@media (prefers-reduced-motion: no-preference)` (use `transform: scaleY(-1)` para inverter chevrons; keyframes e `animation:` entram **dentro** do bloco `no-preference`; `@keyframes neu-spin` e `neu-fade-in` já existem); todo seletor `:not([data-variant="ghost"])` precisa de `:not([data-variant="marca"])`.
- **Regras genéricas da primeira passada que vazam para os componentes novos** (confira sempre a computada): `[role="progressbar"]` e `[role="progressbar"] > *` (dão calha, brilho da marca e `overflow:hidden` a qualquer barra: já corrigido nos segmentos do Questionário com `box-shadow:none` e `overflow:visible`); `[role="dialog"]`/`[role="alertdialog"]` (laje e **sombra do Modal**: o Popover do Radix tem `role="dialog"` e precisou fixar `border` e `box-shadow` no painel); `div[role="alert"]` (painel do Alert); `main div:has(> table)`, `button[aria-expanded]`, `[role=tablist]`/`[role=tabpanel]`; e os títulos `h4`/`h5` que vêm em **caixa-alta** e o `p` global de 16px/24px (sempre fixe `text-transform:none`, `letter-spacing` e `font-size`/`line-height` nos títulos e textos novos).
- **Cascata do Tailwind do DS:** classes como `data-[state=unchecked]:bg-input` e o seletor `input:not([type=…])…` do `index.css` vencem seletores simples; use seletores mais específicos (`div.classe`, `[data-ds="x"].classe`) ou `!important` com comentário.
- **Borda transparente de 1px + `background-image` degradê** desenha um fio claro; em controles com degradê use `border-width: 0`.
- **Radix:** `Tooltip`, `Popover`, `HoverCard` precisam de `ResizeObserver` simulado nos testes; o foco de volta ao gatilho e o "clique fora" só valem **um tique depois** de abrir (use `waitFor`/`act` assíncrono nos testes); o `HoverCard` aplica o atraso de abertura também ao **foco**; o `HoverCard` do `ui/` não tem `Portal` (importar `@radix-ui/react-hover-card` e envolver o conteúdo); o Radix **fecha qualquer tooltip quando a página rola** (a dica "fixa aberta" da vitrine usa `open` controlado). `ui/slider` não repassa nome ao botão: o `NeumorfismoSlider` põe `aria-label` por código.
- **Overlays próprios** (Modal, AlertDialog, Dialog, Sheet, Drawer) foram portados do pacote (foco inicial, Tab preso, Esc, retorno do foco, trava de rolagem), não usam o Radix de `ui/`. Camadas: `.neu-backdrop` z 50 (Modal), `.neu-sheet-layer`/`.neu-dialog-layer`/`.neu-adialog-layer` z 60, toast z 60, cabeçalho do DS z 50. O motor é compartilhado: `Folha` (Sheet) e `Folha gaveta` (Drawer).
- **Alinhamentos deliberados com o DS** (registrar ao relatar): botões usam o `Button` já validado, com texto de **15px** (o pacote usa 12px); o "secundário" convexo é `variant="outline" className="neu-btn--convex"`; cor primária da marca no lugar da laranja, **secundária no lugar do azul royal** (o "Info" fica teal, parecido com o "Sucesso"); textos de apoio usam `muted-foreground` (contraste) em vez do cinza claro do pacote; borda de 3:1 nos campos e anel de foco sólido de 2px; exemplos sem hexadecimal/versão inventados ("Cor da marca"); movimento só sem "menos movimento".
- **Navegador do Claude:** as capturas atrasam um passo (tire duas); `javascript_tool` com `.focus()` **não dispara** eventos de foco (janela sem foco): para hover/foco use `computer hover` com coordenadas do `getBoundingClientRect` (o quadro da captura e `innerWidth` podem diferir: confira); `resize_window mobile` (375px) serve para testar celular e o arrasto (`left_click_drag`); sempre volte com `preset: "desktop"`. Um temporizador em aba "oculta" é limitado a 1 tick por segundo (o toast fechou em 6 s em vez de 5).

## Estado da validação

### Validados pelo usuário

Icon · Button · ButtonGroup · IconButton · TextField · Input · InputOTP · Checkbox · RadioGroup · Switch · Select · DatePicker · **Slider · SegmentedControl · Questionnaire** (Forms, completo) · **Badge · Tag · Alert · Toast · Tooltip · Spinner · Skeleton · Progress · EmptyState · Modal · AlertDialog · Dialog · Sheet · Drawer · Popover · HoverCard** (Feedback, completo).

Detalhes que valem lembrar desta janela:
- **Slider:** três sliders num cartão plano (calha de 8/10px, preenchimento contido, botão com `shadow-md`), do HTML que o usuário colou; sem rótulo visível (o nome está no botão).
- **Badge/Tag:** `Selo` (convexo com ponto, afundado, sólido, chip) e `Etiqueta` (Tag, com ✕ e "Restaurar filtros"). Os selos das páginas (`.brand-badge-*` e o `Badge` do DS) continuam com a primeira passada (convexo menor).
- **Toast:** `Notificacao` (simples/detalhada, flutuante, pausa com o mouse, 5 s na demo). **Alert Dialog, Drawer, Popover…** reaproveitam `Aviso`, `Notificacao`, `CampoTexto`, `GrupoRadio` (agora controlável com `valor`/`aoMudar`).
- **Progress, Alert Dialog, Dialog, Sheet, Drawer, Popover, HoverCard** são **seções novas** (o DS não tinha), com item no menu. Os demais Feedback foram integrados nos cartões existentes.
- **HoverCard** trouxe o **núcleo do Avatar** (`AvatarPerfil` + classes `neu-avatar*`: tamanhos, iniciais por tom, bolinha de status). Ao chegar no Avatar (Data display), estender essa família (imagem, quadrado, grupo, selo numérico) em vez de recriar.
- O Questionário e o Progress compartilham a armadilha do `[role="progressbar"]` (ver acima).

### Aguardando validação

Nenhum. Todos os grupos do pacote foram validados pelo usuário, incluindo os templates de entrada (SignIn, SignUp, TwoFactor) e o Dashboard. O **Cover** ficou de fora por decisão do usuário (não implementar).

### Próximos

Nada na ordem do catálogo. O que resta é o fechamento (ver "Pendências").

### Feito antes da validação componente a componente (histórico: depois todos foram validados)

Primeira passada, só em CSS e vitrines, ainda **não comparadas uma a uma com a referência**: Card (`NeumorfismoCards.tsx`), Tabs (4 variantes, em `NeumorfismoNavegacao.tsx`), Accordion (cartões e agrupado), Stepper (horizontal e vertical), Tabela (poço afundado), Dropdown. Ao chegar em cada uma, refazer a inspeção computada e integrar ao cartão existente (a vitrine "Badge / Tag" e "Alert" são bons modelos).

Também existem vitrines de variantes do pacote já entregues e validadas: `NeumorfismoBotoes`, `NeumorfismoGrupoBotoes`, `NeumorfismoBotaoIcone`, `NeumorfismoCampos`/Input/OTP, `NeumorfismoCheckbox`/Radio, `NeumorfismoDatePicker`, `NeumorfismoSelect`, `NeumorfismoSwitch`, `NeumorfismoIcones`, e as vitrines desta janela (`NeumorfismoSlider`, `Segmentado`, `Questionario`, `Badges`, `Alertas`, `Toasts`, `Tooltips`, `Spinners`, `Skeletons`, `Progresso`, `Vazios`, `Modais`, `DialogoAlerta`, `Dialogo`, `Folha`, `Gaveta`, `Popovers`, `HoverCards`).

### Revisão do Design System inteiro (05/11/2026)

Com o estilo `neumorfismo`, o próprio DS (cabeçalho, menu, rodapé e páginas) segue os componentes validados; com os outros estilos a casca original continua. Tudo protegido por `(ESTILO.id as string) === "neumorfismo"` no código compartilhado.

- **Casca** (`NeumorfismoCasca.tsx`, ligada em `DSLayout.tsx`): `Cabecalho` barra, `GavetaLateral` embutida (modal no celular), `Rodape` slim.
- **Botões das páginas**: `BotaoDS` escolhe o `Button` validado pela variante (41 trocas geradas em 11 arquivos; só as classes de posição são mantidas).
- **Conteúdo**: painéis, callouts, código, chips e amostras de cor por CSS (bloco "Conteúdo das páginas do DS"); "Superfícies e fundos" usa a `ListaDescritiva` com os botões de copiar (`NeumorfismoSuperficies.tsx`); o Validador usa `SelecaoNeu` controlado, `Aviso`, `EstadoVazio` e `ListaDescritiva` (`NeumorfismoValidador.tsx`).
- **Passada de celular (375px)**: dois estouros de largura corrigidos: o navegador de etapas quebra linha (`.neu-stepper-nav`) e os itens de grade das páginas de conteúdo podem encolher (`.neu-casca__conteudo .grid > *`).

### Lacunas conhecidas (não verificadas ou não trocadas)

- **Marca Serena** (conferida em 06/11/2026, sem mudança de código): a página já segue o estilo (cartões, poços, tabela de reduções, lista de downloads) no claro, no escuro e a 375px, sem estouro de largura. As telas brancas dos logotipos ficam brancas de propósito, também no escuro, porque a marca precisa ser vista sobre fundo claro.
- **Webwriting** (`/conteudo`, conferida em 06/11/2026, sem mudança de código): a auditoria de elementos chapados não achou nada fora do estilo, e a página (cartões de princípios, quadros "Recomendado / Evite" tingidos, tabela Faça/Evite, lista de verificação) lê bem no claro e no escuro; a 375px, no escuro, não há estouro de largura.
- **Acessibilidade** (`/acessibilidade`, conferida em 06/11/2026, sem mudança de código): a auditoria só achou as amostras de cor do contraste (de propósito) e a moldura da tabela de teclas, que já é o poço do estilo; a página (amostras AA, foco visível, teclas, diretrizes, tabela de ARIA) lê bem no claro e no escuro. A 375px não há estouro de página; o único elemento que passa da borda é o bloco de código do foco visível, que rola dentro do próprio `pre`.
- **Páginas de template** (revisão de 06/11/2026): as 13 rotas `/templates/*` fora da casca (e, por usarem a mesma estrutura, as `/modelos-bi/*`) recebem o estilo só por CSS, no bloco "Páginas de template" do `estilo.css`, com escopo `body:not(:has(.neu-casca))` (sem a casca do DS, para as prévias da página Templates não mudarem). Cabeçalho claro: superfície do estilo com borda de baixo em relevo e teclas salientes (as faixas da marca com degradê em linha, como o azul-marinho do Analítico, do Radar e da Listagem, mantêm a cor e ganham o relevo); menu lateral com o item atual em relevo e subitens em trilha; trilha de navegação, barra de filtros e rodapé com a fenda no lugar da linha; cabeçalho de tabela no padrão da tabela do estilo (caixa alta, tom apagado) em vez da faixa cheia; selos de situação feitos à mão como chips afundados; barras de progresso feitas à mão em calha escavada; passos do formulário em relevo; cartão da página de erro e seu ícone; logo branco do menu em silhueta escura no tema claro; item marcado de `data-variant="toggle"` (menu da Tela BI) afundado e na cor da marca, porque o texto claro sumia; e no tema escuro o título do cabeçalho claro deixa de usar o azul fixo da marca. O link fixo "Voltar ao DS" ganhou espaço no cabeçalho de uma linha, para não cobrir a tecla do tema. Conferido no navegador no claro e, nas principais, no escuro. **Modelos de BI** (revisão de 06/11/2026): a página índice, o hub do Radar, as docs do Radar e o Mapeamento Power BI (dentro da casca) já estavam no estilo e não mudaram. As páginas independentes seguem o mesmo bloco: o Radar BI e os "em construção" (Planejamento e Monitoramento) pegaram o cabeçalho, o menu e o link-botão em acento; o **Gestão de Pessoas**, feito à mão com cartões brancos, selos e abas em hexadecimal, ganhou lajes salientes nos cartões, selos de veredito afundados, selo do período em acento, abas legíveis sobre a faixa azul-marinho (o tom apagado das abas do estilo não lia ali), anel de fundo das rosquinhas afundado e, no escuro, valores, títulos e apoio nos tons do tema (eram hexadecimal escuro e sumiam). Os seletores desse painel não fixam o azul dos títulos, porque a recoloração da marca troca esse hexadecimal. Os links "Abrir template" das docs e o "Voltar para Modelos de BI" usam a barra de acento (regra fora do escopo de página, vale na casca também). O botão "Voltar ao Panorama" do Gestão de Pessoas mantém o azul-marinho próprio da página. As miniaturas dos modelos de página na página Templates são imagens do desenho antigo e não mudam por CSS, e o link "Voltar ao DS", o botão de login único (azul do gov.br) e os cabeçalhos de marca das prévias ficam como estão, de propósito.
- **Gráficos ECharts**, Camada 1 feita (06/11/2026): o `BrandChart` fica numa calha afundada (CSS `div:has(> div[role="img"][aria-label] > div > canvas)`), o tooltip leva a sombra de popover (CSS com `!important`, porque o ECharts grava o estilo em linha) e o token novo `--chart-grid-soft` (preset `1`) troca a grade tracejada por linhas contínuas a 30% da borda. Camada 2 feita (06/11/2026), por três tokens numéricos (`--chart-track`, `--chart-area-gradient`, `--chart-pie-gap`, no preset `1`, `1`, `2`): o `estiloSeries.ts` (aplicado pelo `BrandChart` antes do `setOption`) põe a trilha atrás das barras quando há um só grupo de barras (agrupadas ficam sem, para os blocos de trilha não colarem; o histograma, de barras coladas, também, porque a trilha virava uma laje), troca o anel de fundo dos medidores de uma cor só por um neutro e faz o degradê das áreas não empilhadas; o `brandTheme.ts` dá vão (`padAngle`) e cantos às fatias da pizza e da rosca. Camada 3 feita (06/11/2026), pelo token `--chart-mark-depth` (preset `6`, desfoque em px; `0` desliga): barras, fatias de pizza e pontos de dispersão ganham relevo pelo `estiloSeries.ts`. O canvas só tem uma sombra por elemento, então não é a sombra dupla do botão (clara em cima e escura embaixo): é uma sombra suave que sai para baixo e para a direita (preta no escuro, cor do texto a 22% no claro). Ficam sem relevo as linhas, os medidores, o mapa de calor, o treemap e o sunburst, as séries de apoio invisíveis da cascata e qualquer série que já defina sombra. Fica de fora a sombra clara no canto oposto (exigiria uma série duplicada por trás de cada série, com legenda, tooltip e pilha para tratar) e os pontos das linhas com anel claro. Contraste entre claro e escuro corrigido (06/11/2026), pelo token `--chart-theme-sync` (preset `1`; nos outros estilos fica `0` e nada muda), em dois defeitos que já existiam: (1) `useTheme()` não é compartilhado, cada chamada tem o próprio estado, então o `BrandChart` nunca via o botão de tema do cabeçalho e ficava com o tema do carregamento (no escuro, texto e eixos apagados); `useTemaDoDocumento` (`src/lib/echarts/temaCores.ts`) passa a ler a classe `dark` do `<html>` e a acompanhar as mudanças; (2) os presets guardam cores no carregamento do módulo (`const palette = getBrandPalette()`), então mesmo refeito o gráfico reaplicava as cores do tema anterior; o `brandTheme.ts` lembra de qual token veio cada cor lida e `aplicarTemaVivo` as lê de novo antes do `setOption`. Cores que não vêm de token (a paleta estendida do ECharts, em hexadecimal, usada por dispersão, treemap e outros) continuam as mesmas nos dois temas.
- Os botões de aba (`tabs-trigger`) das páginas não passam pelo `BotaoDS`.
- **Textarea** não tem componente validado (o pacote só tem campo de uma linha): fica como poço afundado por CSS.
- As seções de cores Secundárias, Neutras e semânticas ainda misturam amostras com botões de copiar (só "Superfícies e fundos" virou Lista descritiva).
- O menu novo da casca não tem trilho recolhido de 68px, o estado dele zera a cada rota e o prefetch de rotas foi perdido.
- Os outros 23 estilos não foram revistos para casca e páginas (mantêm o original, de propósito).

## Pendências e decisões em aberto

- Nada commitado. Quando o usuário pedir, commitar em lote (arquivos novos em `tools/lib/patch/`, `skills/ds-build/assets/template/src/components/estilo/`, `docs/NEUMORFISMO-*.md` e `docs/neumorfismo-depara.json`, `briefings/`).
- `docs/neumorfismo-depara.json` e `docs/NEUMORFISMO-DEPARA.md` foram atualizados no fechamento (54 de 56 trocados; sobram Bento Grid como parcial, por ser outro estilo do gerador, e a réplica "Peak Demand" como sem similar). Para mudar: edite o JSON e rode `npm run depara:neumorfismo` (o teste exige os dois sincronizados).
- Alinhar `.brand-badge-*`/`Badge` das páginas ao visual novo do Badge (oferecido, não pedido).
- Se o foco dos campos deve seguir "borda + halo suave" como no OTP (hoje o `CampoTexto` usa anel sólido de 2px), perguntar ao usuário.
- Guardar o relatório final ("o que mudou no estilo Neumorfismo") com o fechamento.
