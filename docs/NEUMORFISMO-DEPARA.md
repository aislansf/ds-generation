# Neumorfismo: de-para do anexo para o DS

> Gerado por `npm run depara:neumorfismo` a partir de `docs/neumorfismo-depara.json`. Não edite este arquivo à mão.

Anexo: stitch_neumorphic_design_system_ui (14 telas + 2 DESIGN.md) Segunda passada: pacote Neumorphic UI v3.2.0 (tokens, components.css e components/<Nome>/preview.html), que passou a ser a referência de relevo, raios e sombras (preset.json e estilo.css).. Cada componente do anexo aponta para o equivalente do DS (a vitrine `/componentes`, os `ui/*` e os templates) e leva um status.

## Quanto falta trocar

**54 de 56 trocados. Faltam 2.**

```
█████████████████████████████░  96%
```

| Status | Quantos | O que significa |
|---|---:|---|
| ✅ Trocado | 54 | estilo do anexo aplicado no equivalente do DS |
| 🟡 Parcial | 1 | equivalente trocado, faltam variações ou detalhes |
| ⏳ Pendente | 0 | equivalente existe, ainda não foi trocado |
| ❌ Sem similar | 1 | não existe no DS |

| Grupo | Trocados | Faltam |
|---|---:|---:|
| Botões | 9 de 9 | 0 |
| Campos e seleção | 7 de 7 | 0 |
| Navegação | 10 de 10 | 0 |
| Superfícies e feedback | 13 de 13 | 0 |
| BI e dados | 9 de 9 | 0 |
| Fundamentos e páginas | 6 de 8 | 2 |

## O que falta

### ❌ Sem similar (1)

- [ ] **Réplica da imagem de referência (Peak Demand)** → —. É um mockup da imagem de referência (medidor, trilhas, knob com ranhuras), sem componente equivalente no DS.

### 🟡 Parcial (1)

- [ ] **Bento Grid e Card de autenticação tátil** → Layout bento (estilo à parte) e CardSignIn. Card de login trocado pelos ganchos. Falta: combinar com o layout bento, que é outro estilo do gerador.

## De-para completo

### Botões

| | Componente do anexo | Origem | Equivalente no DS | Nota |
|---|---|---|---|---|
| ✅ | Botão Primário | catálogo base | Botão Templates › Botão Primário (/componentes#botao) | Degradê suave, filete de luz, brilho colorido; pressionado afunda; desabilitado fica raso e neutro. |
| ✅ | Botão Secundário | catálogo base | Botão Templates › Botão Secundário | Variantes secondary e outline em peça convexa. |
| ✅ | Botão Diversificado | catálogo base | Botão Templates › Botão Diversificado | Variante diversificado com o mesmo relevo dos preenchidos. |
| ✅ | Botão com Loading | catálogo base | Botão Templates › Botão com Loading | Spinner com brilho; estado desabilitado raso. |
| ✅ | Botão com Ícone à Esquerda | catálogo base | Botão Templates › Botão com ícone à esquerda | — |
| ✅ | Botão com Ícone à Direita | catálogo base | Botão Templates › Botão com ícone à direita | — |
| ✅ | Botão Somente Ícone | catálogo base | Botão Templates › Botão somente ícone | — |
| ✅ | Botão (primário, secundário, contorno, ícone, grupo) | pacote v3.2.0 | Button, ButtonGroup e IconButton (/componentes#botao); BotaoDS nas páginas | Texto de 15px (o pacote usa 12px). Os botões de todas as páginas do DS passam pelo mesmo Button validado. |
| ✅ | Ícone | pacote v3.2.0 | Icone (/componentes#icone) | Família de ícones do pacote. |

### Campos e seleção

| | Componente do anexo | Origem | Equivalente no DS | Nota |
|---|---|---|---|---|
| ✅ | Campo de texto (formulário, busca e textarea) | catálogo base | Campo de Texto (/componentes#input) | Leito afundado, borda 3:1, foco e hover na cor do anel, erro em aria-invalid. |
| ✅ | Custom Select (combo) | avançado | Select (/componentes#select; ui/select) | Gatilho afundado; lista aberta como painel flutuante com item em hover. |
| ✅ | Checkbox e Radio | catálogo base | Checkbox e Radio (/componentes#checkbox) | Caixa de 24px escavada; marcada, barra de acento com brilho. Radio marcado sobe convexo com núcleo de 10px na cor da marca (nativos e Radix). |
| ✅ | Switches e Toggles | catálogo base | Switch (/componentes#switch) | Trilha de 64×32 escavada, botão convexo de 24px que desliza 32px; ligado, barra de acento com brilho. |
| ✅ | Badges e Tags (convexo e côncavo) | catálogo base | Badge / Tag (/componentes#badge; ui/badge) | Pacote Neumorphic UI: estado convexo, metadado afundado, destaque em barra de acento. Cobre ui/badge e as pílulas .brand-badge-* da vitrine. |
| ✅ | DatePicker (campo e range) | avançado | DatePicker (/componentes#datepicker) | Campo, calendário, dia selecionado e faixa de datas validados (NeumorfismoDatePicker). |
| ✅ | Campo de texto, OTP, Select, Slider, Segmented, Questionnaire | pacote v3.2.0 | CampoTexto, InputOTP, SelecaoNeu, Slider, Segmentado, Questionario | Foco por anel sólido de 2px e borda 3:1. Textarea continua com o leito afundado por CSS (o pacote não tem componente de área de texto). |

### Navegação

| | Componente do anexo | Origem | Equivalente no DS | Nota |
|---|---|---|---|---|
| ✅ | Breadcrumb | avançado | Breadcrumb (/componentes#breadcrumb) | Nós em pílula saliente, página atual em destaque (aria-current). |
| ✅ | Paginação numérica | avançado | Paginação › Paginação Numérica (/componentes#paginacao) | Botões convexos; página atual afundada. |
| ✅ | Paginação de contador | avançado | Paginação › Paginação de Contador | — |
| ✅ | Tabs (underline, segmented e card com abas) | avançado | Tabs (/componentes#tabs; ui/tabs; src/components/estilo/NeumorfismoNavegacao.tsx) | Vitrine trocada pelo markup do pacote (só neste estilo): padrão (aba convexa com sublinhado luminoso e painel afundado), linha, segmentada e card com abas integradas, com setas, Home e End. O Radix (ui/tabs) fica na casca afundada com aba ativa convexa. |
| ✅ | Barra de Etapas (Stepper) | BI | Barra de Etapas (/componentes#steps; src/components/estilo/NeumorfismoNavegacao.tsx) | Vitrine trocada pelo markup do pacote (só neste estilo): horizontal com trilha afundada que enche até a etapa atual, vertical com linha afundada, data, estado em texto e conteúdo na etapa atual, e a versão compacta. |
| ✅ | Menu Lateral (Sidebar) | BI / página interna | Menu lateral (MenuLateral, GavetaLateral e Painel/Workspace lateral; /componentes#sidebar) | Item ativo afundado, ponto luminoso, busca e modos embutido e modal validados. É também o menu do próprio DS (CascaNeumorfismo). |
| ✅ | Menu Lateral Retrátil (68px) | menu lateral | Menu lateral › GavetaLateral e MenuLateral (/componentes#sidebar) | Variante recolhida validada. O menu da casca do DS abre e fecha, mas não tem trilho de 68px. |
| ✅ | Header Institucional (3 variantes) | BI | Cabecalho (barra, compacto e completo; /componentes#header) e Cabecalho faixa | Três variantes e faixa de classificação validadas. É também o cabeçalho do DS (CascaNeumorfismo). |
| ✅ | Footer Institucional (claro, escuro, compacto) | BI | Rodape (/componentes#footer; variante slim na casca do DS) | Claro, escuro e compacto validados. |
| ✅ | Carousel, Collapsible, Command, Menubar, NavigationMenu | pacote v3.2.0 | NeumorfismoCarrossel, Recolhivel, Comandos, Menubar e NavegacaoSite | Validados na vitrine de Navegação. |

### Superfícies e feedback

| | Componente do anexo | Origem | Equivalente no DS | Nota |
|---|---|---|---|---|
| ✅ | Cards (básico, com fundo primário, densidades) | avançado | Card (/componentes#card; ui/card; src/components/estilo/NeumorfismoCards.tsx) | Vitrine trocada pelo markup do anexo (NeumorfismoCards, só neste estilo): card básico com link em pílula, KPI num leito afundado e card de destaque com degradê e brilho. O card com data-ds ganha brilho 145°, filete de luz e divisórias em sulco. |
| ✅ | Accordion (3 variações) | avançado | Accordion (/componentes#accordion) | Cartões separados, bloco agrupado e item aberto por vez validados (NeumorfismoAcordeao). A variação "destaque de acento" do anexo anterior não existe no pacote e ficou de fora de propósito. |
| ✅ | Tabelas (básica, linha expansível, cabeçalho primário, modificadores) | avançado | Tabela (/componentes#tabela, 11 variantes; ui/table) | Moldura afundada, linhas separadas por sulco, hover em véu de luz. |
| ✅ | Modal | avançado | Modal (/componentes#modal; ui/dialog) | Painel flutuante com a sombra mais alta do estilo. |
| ✅ | Toast | avançado | Toast / Notificação (/componentes#toast; ui/toast) | — |
| ✅ | Tooltip | avançado | Tooltip (/componentes#tooltip; ui/tooltip) | Balão do pacote validado também na vitrine (NeumorfismoTooltips), com posições e ponta. |
| ✅ | Alerts e notificações | alerts | Alert (/componentes#alert; ui/alert) | Painel raso com fio de luz e ícone em quadrado de 36px com brilho (primária no sucesso, secundária na informação, cores semânticas no aviso e no erro). |
| ✅ | Skeleton Loading | avançado | Skeleton (/componentes#skeleton) | Barras afundadas. |
| ✅ | Spinner / Loading | avançado | Spinner (/componentes#spinner) | Brilho na cor da marca. |
| ✅ | Empty State | avançado | Empty State (/componentes#empty-state) | Leito afundado no lugar da borda tracejada. |
| ✅ | Dropdown Menu | avançado | Dropdown Menu (/componentes#dropdown; ui/dropdown-menu) | — |
| ✅ | Menu Kebab | avançado | Menu Kebab (/componentes#menu-kebab) | — |
| ✅ | Progress, Alert Dialog, Dialog, Sheet, Drawer, Popover, HoverCard | pacote v3.2.0 | Progresso, DialogoAlerta, Dialogo, Folha, Gaveta, Popovers e HoverCards | Overlays próprios com foco inicial, Tab preso, Esc e retorno do foco. |

### BI e dados

| | Componente do anexo | Origem | Equivalente no DS | Nota |
|---|---|---|---|---|
| ✅ | Filtros Dinâmicos | BI | Filtros Dinâmicos (/componentes#filtros) | Campos, seletores e chips de filtro ativo validados (NeumorfismoFiltros). |
| ✅ | Big Numbers / KPIs | BI | Big Numbers / KPIs (/componentes#big-numbers) | Cards em relevo; variante compacta herda os tokens de sombra. |
| ✅ | Upload em Massa | BI | Upload em Massa (/componentes#upload) | Área de soltar afundada; progresso por item em trilha afundada. |
| ✅ | Lista Descritiva (dl) | BI | Lista Descritiva (/componentes#lista-descritiva) | Painel, grade e dividida validadas (NeumorfismoListaDescritiva); reaproveitada em Superfícies e fundos e no Validador. |
| ✅ | Cards de Estatísticas | BI | Cards de Estatísticas (/componentes#stats) | Cards e barras de progresso (role=progressbar) em trilha afundada com brilho. |
| ✅ | Métricas e Mini-Charts | BI | Métricas — Painel Completo (/componentes#metricas) | Cards, progresso e metas validados (NeumorfismoMetricas, NeumorfismoMetas). |
| ✅ | Galeria de Gráficos (área, multilinha, barras, linhas, donut) | BI | Gráficos (componentes Neumorfismo* de gráfico; /graficos) | Área, barras, colunas, linhas, rosca, medidor e composto validados com os componentes do pacote. As cores dos gráficos ECharts da página de downloads continuam as dos tokens --chart-*. |
| ✅ | Painel de BI e Telemetria | catálogo base | Dashboard — Painel de atendimentos (templates; NeumorfismoDashboard) | Painel completo validado, com medidor, metas e gráficos. |
| ✅ | Avatar, Bubble, Message, Marker, Item, Kbd, Attachment, Upload | pacote v3.2.0 | Avatares, Baloes, Mensagens, Marcadores, Itens, Teclas, Anexos e Upload | Família do Avatar compartilhada com o HoverCard. |

### Fundamentos e páginas

| | Componente do anexo | Origem | Equivalente no DS | Nota |
|---|---|---|---|---|
| ✅ | Tokens de cor, luz e sombras duplas | catálogo base | Tokens › Estilo visual (/tokens) | Seis níveis de sombra, inset e hover com luz a 135° (valores do anexo). |
| ✅ | Edição escura (Dark Edition) | página interna 2 | Tema dark do DS | Superfícies #0E131F/#141926, leito #0B0F1A, luz a 5,5% e sombra a 75%. |
| 🟡 | Bento Grid e Card de autenticação tátil | catálogo base | Layout bento (estilo à parte) e CardSignIn | Card de login trocado pelos ganchos. Falta: combinar com o layout bento, que é outro estilo do gerador. |
| ✅ | Página interna completa (header + sidebar + conteúdo) | páginas internas 1 e 2 | Dashboard — Painel de atendimentos e casca do DS (NeumorfismoDashboard, NeumorfismoCasca) | Header, menu lateral, rodapé e conteúdo montados com os componentes validados, nos templates e no próprio DS. |
| ❌ | Réplica da imagem de referência (Peak Demand) | catálogo base | — | É um mockup da imagem de referência (medidor, trilhas, knob com ranhuras), sem componente equivalente no DS. |
| ✅ | Slider com knob de ranhuras | DESIGN.md | Slider (/componentes#slider; NeumorfismoSlider) | Trilha afundada e botão saliente validados a partir do HTML colado pelo usuário. O knob não leva as três ranhuras do DESIGN.md. |
| ✅ | Templates de entrada (SignIn, SignUp, TwoFactor) | pacote v3.2.0 | AuthTemplates (NeumorfismoSignIn, SignUp e TwoFactor) | O código de verificação usa as mesmas células do InputOTP. |
| ✅ | Casca e páginas do próprio DS | revisão do DS | DSLayout › CascaNeumorfismo e as páginas do /design-system | Com o estilo Neumorfismo, cabeçalho, menu, rodapé, botões, painéis, Superfícies e fundos e o Validador seguem os componentes validados. Os outros estilos mantêm a casca original. |

## Como o estilo entra

A camada `skills/ds-build/assets/estilos/neumorfismo/estilo.css` usa, nesta ordem: os ganchos `data-ds` dos componentes, papéis ARIA (`tablist`, `menu`, `dialog`, `progressbar`, `aria-current`, `aria-expanded`) e poucos elementos nativos. As sombras de `shadow-*` vêm dos tokens do preset, por isso peças montadas à mão já ganham relevo sem gancho. O que ainda está como Parcial ou Pendente é onde nenhum desses seletores alcança a peça: a solução é pôr o gancho no template (patch em `tools/lib/ganchos.mjs` ou `tools/lib/tokenizar.mjs`), não mexer na origem.
