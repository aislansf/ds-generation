# Ganchos data-ds nos elementos montados à mão

Relatório gerado por `node tools/tokenizar-template.mjs --relatorio` (codemod de `tools/lib/ganchos.mjs`, R1 de `docs/PLANO-ESTILOS.md`).
Os elementos da lista de revisão não ganharam gancho: o padrão de classes não decide sozinho o que eles são.
Para cobri-los, ajuste as regras de `tools/lib/ganchos.mjs` (nunca o template à mão) e rode de novo.

## Elementos com data-ds no template

| Gancho | Elementos |
|---|---|
| `button` | 247 |
| `card` | 94 |
| `input` | 51 |
| `select-trigger` | 16 |
| `textarea` | 5 |
| `popover` | 2 |
| `sidebar` | 2 |
| `alert` | 1 |
| `badge` | 1 |
| `checkbox` | 1 |
| `dialog` | 1 |
| `dropdown` | 1 |
| `header` | 1 |
| `radio` | 1 |
| `switch` | 1 |
| `table` | 1 |
| `tabs-list` | 1 |
| `tabs-trigger` | 1 |
| `toast` | 1 |
| `tooltip` | 1 |

## Ganchos acrescentados nesta execução (408)

| Gancho (variante) | Elementos |
|---|---|
| button (ghost) | 97 |
| card | 93 |
| button (default) | 68 |
| input | 50 |
| button (outline) | 38 |
| button (secondary) | 19 |
| button (link) | 17 |
| select-trigger | 15 |
| button (tabela) | 4 |
| textarea | 4 |
| button (destructive) | 3 |

## Lista de revisão (115)

| Motivo | Elementos |
|---|---|
| \<button>: fundo ou borda condicional | 49 |
| \<button>: botão sobre superfície de marca | 26 |
| \<button>: classes sem padrão de botão | 14 |
| \<div>: bg-card com borda ou raio condicional | 11 |
| \<input>: sem className | 6 |
| \<input>: type dinâmico | 5 |
| \<select>: sem className | 2 |
| \<button>: sem className | 1 |
| \<input>: campo sem borda própria (dentro de um contêiner) | 1 |

| Arquivo | Elemento | Motivo | Classes |
|---|---|---|---|
| `src/components/ChartsSection.tsx:515` | `<button>` | fundo ou borda condicional | `px-3 py-1 rounded text-xs font-medium transition-colors bg-primary text-primary-foreground bg-muted text-muted-foreground hover:bg-muted/80` |
| `src/components/DSComponents.tsx:31` | `<button>` | fundo ou borda condicional | `absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transiti` |
| `src/components/DSLayout.tsx:341` | `<button>` | fundo ou borda condicional | `w-full flex items-center rounded text-sm transition-colors justify-center px-0 py-2.5 gap-2.5 px-3 py-2 bg-sidebar-accent text-sidebar-accen` |
| `src/components/DSLayout.tsx:375` | `<button>` | fundo ou borda condicional | `flex items-center gap-1 w-full text-left text-xs px-3 py-1.5 rounded transition-colors text-sidebar-muted/50 cursor-not-allowed italic text-` |
| `src/components/DSLayout.tsx:405` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors text-sidebar-muted/50 cursor-not-allowed italic text-sidebar-muted hove` |
| `src/components/GridSection.tsx:157` | `<button>` | fundo ou borda condicional | `px-4 py-2 text-sm font-medium border-b-2 transition-colors border-primary text-primary border-transparent text-muted-foreground hover:text-f` |
| `src/components/TokenExplorer.tsx:95` | `<button>` | fundo ou borda condicional | `flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all bg-primary text-primary-foreground shadow-sm text-muted-for` |
| `src/components/TokenExplorer.tsx:204` | `<button>` | fundo ou borda condicional | `border-2 transition-all p-4 text-center space-y-2 border-primary bg-primary/5 border-border bg-card hover:border-primary/40` |
| `src/components/bi/BISidebar.tsx:68` | `<button>` | fundo ou borda condicional | `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors bg-primary text-primary-foreground font-semibold shadow-sm tex` |
| `src/components/bi/sections/VisaoGeral.tsx:198` | `<button>` | fundo ou borda condicional | `px-2 py-1 text-[10px] rounded bg-primary text-primary-foreground bg-muted text-foreground/70` |
| `src/components/charts/ChartShowcase.tsx:16` | `<button>` | fundo ou borda condicional | `inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm bor` |
| `src/components/charts/ChartShowcase.tsx:95` | `<button>` | fundo ou borda condicional | `px-3 py-2 text-xs font-medium -mb-px border-b-2 transition-colors border-primary text-primary border-transparent text-muted-foreground hover` |
| `src/components/templates/AuthTemplates.tsx:35` | `<input>` | type dinâmico | `w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A4FDA]/30` |
| `src/components/templates/AuthTemplates.tsx:121` | `<input>` | type dinâmico | `w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-` |
| `src/components/templates/AuthTemplates.tsx:414` | `<button>` | fundo ou borda condicional | `px-4 py-2 rounded-lg text-xs font-medium transition-colors bg-[#2A4FDA] text-white bg-muted text-muted-foreground hover:bg-muted/80` |
| `src/components/templates/CardSignIn.tsx:38` | `<input>` | campo sem borda própria (dentro de um contêiner) | `flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none` |
| `src/components/templates/CardSignIn.tsx:53` | `<input>` | type dinâmico | `flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none` |
| `src/components/templates/DashboardTemplates.tsx:221` | `<div>` | bg-card com borda ou raio condicional | `flex items-center gap-2 px-5 py-2 bg-card border-b border-border` |
| `src/components/templates/DashboardTemplates.tsx:287` | `<div>` | bg-card com borda ou raio condicional | `bg-card border-r border-border p-4 space-y-3` |
| `src/components/templates/HubPaineisTemplate.tsx:178` | `<button>` | botão sobre superfície de marca | `bg-white text-brand-primary font-semibold text-xs px-5 py-2 rounded-lg hover:bg-white/90 transition-colors` |
| `src/components/templates/HubPaineisTemplate.tsx:235` | `<button>` | botão sobre superfície de marca | `bg-white text-brand-primary font-semibold text-xs px-5 py-2 rounded-lg hover:bg-white/90 transition-colors` |
| `src/components/templates/HubPaineisTemplate.tsx:263` | `<button>` | botão sobre superfície de marca | `p-1 rounded text-white hover:bg-white/10 transition-colors` |
| `src/components/templates/HubPaineisTemplate.tsx:270` | `<button>` | botão sobre superfície de marca | `ml-auto p-1.5 rounded text-white hover:bg-white/10 transition-colors` |
| `src/components/templates/HubPaineisTemplate.tsx:348` | `<button>` | botão sobre superfície de marca | `p-1 rounded text-white hover:bg-white/10 transition-colors` |
| `src/components/templates/HubPaineisTemplate.tsx:355` | `<button>` | botão sobre superfície de marca | `ml-auto p-1.5 rounded text-white hover:bg-white/10 transition-colors` |
| `src/components/templates/SidebarMenuPreview.tsx:93` | `<button>` | classes sem padrão de botão | `flex items-center gap-2 px-4 py-2 rounded-lg bg-sidebar text-sidebar-foreground text-sm font-sans hover:bg-sidebar/90 transition-colors` |
| `src/components/templates/SidebarMenuPreview.tsx:166` | `<button>` | fundo ou borda condicional | `w-full flex items-center rounded text-sm transition-colors justify-center px-0 py-2.5 gap-2.5 px-3 py-2 text-sidebar-muted opacity-50 cursor` |
| `src/components/templates/SidebarMenuPreview.tsx:198` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors truncate text-sidebar-foreground bg-sidebar-accent/70 font-medium text-` |
| `src/pages/ComponentesPage.tsx:978` | `<button>` | fundo ou borda condicional | `relative w-11 h-6 rounded-full transition-colors bg-primary bg-muted` |
| `src/pages/ComponentesPage.tsx:1990` | `<button>` | fundo ou borda condicional | `px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px border-primary text-primary border-transparent text-muted-foreground hover` |
| `src/pages/ComponentesPage.tsx:2350` | `<button>` | fundo ou borda condicional | `w-9 h-9 rounded text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-muted` |
| `src/pages/ComponentesPage.tsx:2880` | `<button>` | sem className | `—` |
| `src/pages/ComponentesPage.tsx:3039` | `<button>` | fundo ou borda condicional | `py-1.5 rounded text-sm transition-colors hover:bg-primary hover:text-primary-foreground bg-primary/10 text-primary font-bold hover:bg-muted` |
| `src/pages/ComponentesPage.tsx:3639` | `<button>` | fundo ou borda condicional | `w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10 relative bg-success text-success-foreground` |
| `src/pages/DashboardAnaliticoPage.tsx:379` | `<button>` | botão sobre superfície de marca | `p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors` |
| `src/pages/DashboardAnaliticoPage.tsx:415` | `<button>` | botão sobre superfície de marca | `p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors` |
| `src/pages/DashboardAnaliticoPage.tsx:428` | `<button>` | classes sem padrão de botão | `fixed inset-0 top-16 z-30 bg-foreground/40` |
| `src/pages/DashboardAnaliticoPage.tsx:466` | `<button>` | fundo ou borda condicional | `w-full flex items-center rounded text-[13px] transition-colors justify-center px-0 py-2.5 gap-2.5 px-3 py-2 bg-sidebar-accent text-sidebar-a` |
| `src/pages/DashboardBIPage.tsx:210` | `<button>` | classes sem padrão de botão | `fixed inset-0 top-[64px] z-30 bg-black/40` |
| `src/pages/DashboardBIPage.tsx:269` | `<button>` | fundo ou borda condicional | `w-full flex items-center rounded text-sm transition-colors justify-center px-0 py-2.5 gap-2.5 px-3 py-2 bg-sidebar-accent text-sidebar-accen` |
| `src/pages/DashboardBIPage.tsx:297` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors truncate text-sidebar-foreground bg-sidebar-accent/70 font-medium text-` |
| `src/pages/DashboardBIPage.tsx:353` | `<div>` | bg-card com borda ou raio condicional | `flex items-center gap-2 px-5 py-2 bg-card border-b border-border` |
| `src/pages/DashboardBIPage.tsx:527` | `<button>` | fundo ou borda condicional | `h-7 w-7 inline-flex items-center justify-center rounded-md border text-xs transition-colors bg-primary text-primary-foreground border-primar` |
| `src/pages/DashboardInstitucionalPage.tsx:275` | `<button>` | classes sem padrão de botão | `fixed inset-0 top-[64px] z-30 bg-black/40` |
| `src/pages/DashboardInstitucionalPage.tsx:337` | `<button>` | fundo ou borda condicional | `w-full flex items-center rounded text-sm transition-colors justify-center px-0 py-2.5 gap-2.5 px-3 py-2 bg-sidebar-accent text-sidebar-accen` |
| `src/pages/DashboardInstitucionalPage.tsx:365` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors truncate text-sidebar-foreground bg-sidebar-accent/70 font-medium text-` |
| `src/pages/DashboardInstitucionalPage.tsx:436` | `<div>` | bg-card com borda ou raio condicional | `flex items-center gap-2 px-5 py-2 bg-card border-b border-border` |
| `src/pages/ErrorPageTemplate.tsx:46` | `<button>` | fundo ou borda condicional | `px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-primary text-primary-foreground shadow-md text-muted-foreground hover:bg-muted` |
| `src/pages/FundamentosPage.tsx:41` | `<button>` | botão sobre superfície de marca | `absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-co` |
| `src/pages/FundamentosPage.tsx:101` | `<button>` | classes sem padrão de botão | `mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded transition-colors focus:outline-none focus-visible:ring-2 fo` |
| `src/pages/FundamentosPage.tsx:784` | `<button>` | classes sem padrão de botão | `block w-full rounded-md overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-ring` |
| `src/pages/FundamentosPage.tsx:834` | `<button>` | fundo ou borda condicional | `text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors bg-primary text-primary-foreground text-muted-foreground hover:text-foreg` |
| `src/pages/FundamentosPage.tsx:842` | `<button>` | fundo ou borda condicional | `text-[11px] font-semibold px-2.5 py-1.5 rounded-md transition-colors bg-primary text-primary-foreground text-muted-foreground hover:text-for` |
| `src/pages/HeaderPlaygroundPage.tsx:191` | `<button>` | fundo ou borda condicional | `flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all desktop bg-primary text-primary-foreground shadow-sm hover:bg-m` |
| `src/pages/HeaderPlaygroundPage.tsx:197` | `<button>` | fundo ou borda condicional | `flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all tablet bg-primary text-primary-foreground shadow-sm hover:bg-mu` |
| `src/pages/HeaderPlaygroundPage.tsx:203` | `<button>` | fundo ou borda condicional | `flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all mobile bg-primary text-primary-foreground shadow-sm hover:bg-mu` |
| `src/pages/HomePage.tsx:113` | `<button>` | botão sobre superfície de marca | `inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-4 py-2 rounded font-m` |
| `src/pages/HomePage.tsx:290` | `<button>` | classes sem padrão de botão | `brand-card-hover text-left group` |
| `src/pages/ModalAcessoTemplatePage.tsx:119` | `<input>` | type dinâmico | `w-full border border-input rounded-lg pl-9 pr-10 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring` |
| `src/pages/PaginaAutenticacaoPage.tsx:125` | `<input>` | type dinâmico | `w-full border border-input rounded px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primar` |
| `src/pages/PaginaFiltrosTabelaPage.tsx:183` | `<button>` | classes sem padrão de botão | `fixed inset-0 top-[64px] z-30 bg-black/40` |
| `src/pages/PaginaFiltrosTabelaPage.tsx:240` | `<button>` | fundo ou borda condicional | `w-full flex items-center rounded text-sm transition-colors justify-center px-0 py-2.5 gap-2.5 px-3 py-2 bg-sidebar-accent text-sidebar-accen` |
| `src/pages/PaginaFiltrosTabelaPage.tsx:268` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors truncate text-sidebar-foreground bg-sidebar-accent/70 font-medium text-` |
| `src/pages/PaginaFiltrosTabelaPage.tsx:321` | `<div>` | bg-card com borda ou raio condicional | `flex items-center justify-between flex-wrap gap-2 px-5 py-2 bg-card border-b border-border` |
| `src/pages/RadarEstrategicoPage.tsx:176` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0` |
| `src/pages/RadarEstrategicoPage.tsx:186` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded transition-colors shrink-0` |
| `src/pages/RadarEstrategicoPage.tsx:200` | `<button>` | classes sem padrão de botão | `fixed inset-0 top-[64px] z-30 bg-black/40` |
| `src/pages/RadarEstrategicoPage.tsx:258` | `<button>` | fundo ou borda condicional | `w-full flex items-center rounded text-sm transition-colors justify-center px-0 py-2.5 gap-2.5 px-3 py-2 bg-sidebar-accent text-sidebar-accen` |
| `src/pages/RadarEstrategicoPage.tsx:286` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors truncate text-sidebar-foreground bg-sidebar-accent/70 font-medium text-` |
| `src/pages/RadarEstrategicoPage.tsx:347` | `<div>` | bg-card com borda ou raio condicional | `flex flex-wrap items-center gap-3 px-5 py-2 bg-card border-b border-border` |
| `src/pages/RadarEstrategicoPage.tsx:427` | `<button>` | fundo ou borda condicional | `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors bg-primary text-primary-foreground text-muted-foreg` |
| `src/pages/TelaBIPage.tsx:95` | `<button>` | botão sobre superfície de marca | `p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10` |
| `src/pages/TelaBIPage.tsx:128` | `<button>` | botão sobre superfície de marca | `p-1.5 rounded-md text-primary-foreground/90 hover:bg-primary-foreground/10` |
| `src/pages/TelaFormularioPage.tsx:153` | `<button>` | fundo ou borda condicional | `text-xs h-7 rounded transition-colors bg-secondary text-secondary-foreground font-semibold border border-primary text-foreground hover:bg-mu` |
| `src/pages/TelaFormularioPage.tsx:222` | `<button>` | classes sem padrão de botão | `flex items-center gap-2 group cursor-pointer cursor-not-allowed opacity-60` |
| `src/pages/TelaFormularioPage.tsx:341` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0` |
| `src/pages/TelaFormularioPage.tsx:351` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded transition-colors shrink-0` |
| `src/pages/TelaFormularioPage.tsx:371` | `<button>` | botão sobre superfície de marca | `p-1 rounded hover:bg-white/10 transition-colors` |
| `src/pages/TelaFormularioPage.tsx:387` | `<button>` | botão sobre superfície de marca | `absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors` |
| `src/pages/TelaFormularioPage.tsx:396` | `<button>` | fundo ou borda condicional | `w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors bg-white/15 text-white font-medium text-white/70 hover:bg-white` |
| `src/pages/TelaFormularioPage.tsx:412` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors text-white bg-white/10 font-medium text-white/50 hover:text-white hover` |
| `src/pages/TelaFormularioPage.tsx:450` | `<div>` | bg-card com borda ou raio condicional | `px-5 py-4 bg-card border-b border-border` |
| `src/pages/TelaFormularioPage.tsx:456` | `<div>` | bg-card com borda ou raio condicional | `px-5 py-5 bg-card border-b border-border` |
| `src/pages/TelaFormularioPage.tsx:487` | `<input>` | sem className | `—` |
| `src/pages/TelaFormularioPage.tsx:494` | `<input>` | sem className | `—` |
| `src/pages/TelaFormularioPage.tsx:499` | `<input>` | sem className | `—` |
| `src/pages/TelaFormularioPage.tsx:506` | `<input>` | sem className | `—` |
| `src/pages/TelaFormularioPage.tsx:521` | `<select>` | sem className | `—` |
| `src/pages/TelaFormularioPage.tsx:529` | `<select>` | sem className | `—` |
| `src/pages/TelaFormularioPage.tsx:540` | `<input>` | sem className | `—` |
| `src/pages/TelaFormularioPage.tsx:569` | `<input>` | sem className | `—` |
| `src/pages/TelaListagemPage.tsx:387` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0` |
| `src/pages/TelaListagemPage.tsx:397` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded transition-colors shrink-0` |
| `src/pages/TelaListagemPage.tsx:417` | `<button>` | botão sobre superfície de marca | `p-1 rounded hover:bg-white/10 transition-colors` |
| `src/pages/TelaListagemPage.tsx:438` | `<button>` | botão sobre superfície de marca | `absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors` |
| `src/pages/TelaListagemPage.tsx:452` | `<button>` | fundo ou borda condicional | `w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors bg-white/15 text-white font-medium text-white/70 hover:bg-white` |
| `src/pages/TelaListagemPage.tsx:476` | `<button>` | fundo ou borda condicional | `block w-full text-left text-xs px-3 py-1.5 rounded transition-colors text-white bg-white/10 font-medium text-white/50 hover:text-white hover` |
| `src/pages/TelaListagemPage.tsx:518` | `<div>` | bg-card com borda ou raio condicional | `flex items-center justify-between gap-3 flex-wrap px-5 py-4 bg-card border-b border-border` |
| `src/pages/TelaListagemPage.tsx:825` | `<button>` | fundo ou borda condicional | `min-w-[28px] h-7 px-2 text-[11px] rounded border transition-colors text-white border-border hover:bg-muted` |
| `src/pages/TelaListagemPage.tsx:842` | `<button>` | fundo ou borda condicional | `min-w-[28px] h-7 px-2 text-[11px] rounded border transition-colors text-white border-border hover:bg-muted` |
| `src/pages/TemplatesPage.tsx:138` | `<button>` | classes sem padrão de botão | `p-1 rounded flex items-center gap-1.5 transition-colors shrink-0` |
| `src/pages/TemplatesPage.tsx:149` | `<button>` | classes sem padrão de botão | `p-1 rounded transition-colors shrink-0` |
| `src/pages/TemplatesPage.tsx:157` | `<button>` | classes sem padrão de botão | `p-1 rounded flex items-center gap-1.5 transition-colors shrink-0` |
| `src/pages/TemplatesPage.tsx:260` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0` |
| `src/pages/TemplatesPage.tsx:328` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded transition-colors` |
| `src/pages/TemplatesPage.tsx:335` | `<button>` | botão sobre superfície de marca | `p-1.5 hover:bg-white/10 rounded flex items-center gap-1.5 transition-colors shrink-0` |
| `src/pages/TemplatesPage.tsx:690` | `<button>` | fundo ou borda condicional | `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all bg-primary text-primary-foreground shadow-md scale-[1.02] ` |
| `src/pages/TemplatesPage.tsx:719` | `<button>` | botão sobre superfície de marca | `bg-error text-white px-4 py-2 rounded text-xs font-bold hover:brightness-110 transition-all` |
| `src/pages/TemplatesPage.tsx:937` | `<button>` | fundo ou borda condicional | `px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-primary text-primary-foreground bg-muted text-muted-foreground hover:bg-mu` |
| `src/pages/TemplatesPage.tsx:1230` | `<button>` | classes sem padrão de botão | `inline-flex items-center gap-1 px-2 py-1 bg-foreground/85 text-background text-[10px] rounded shadow hover:bg-foreground` |
| `src/pages/graficos/GraficosPlaygroundPage.tsx:26` | `<button>` | fundo ou borda condicional | `primario inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foregro` |
| `src/pages/graficos/GraficosPlaygroundPage.tsx:174` | `<button>` | fundo ou borda condicional | `px-3 h-10 rounded-md text-xs font-medium border transition-colors border-primary bg-primary text-primary-foreground border-border bg-card te` |
| `src/pages/modelos-bi/GestaoPessoasPage.tsx:127` | `<button>` | fundo ou borda condicional | `appearance-none border-0 font-inherit text-[12.5px] md:text-[13px] font-semibold px-[12px] md:px-[16px] py-[12px] pb-[13px] cursor-pointer b` |
| `src/pages/modelos-bi/GestaoPessoasPage.tsx:151` | `<div>` | bg-card com borda ou raio condicional | `bg-card border-b border-border px-[14px] md:px-[22px] py-[7px] flex flex-wrap gap-x-[16px] gap-y-[6px] items-center text-[11px] text-muted-f` |
| `src/pages/modelos-bi/GestaoPessoasPage.tsx:168` | `<div>` | bg-card com borda ou raio condicional | `bg-card border-b border-border px-[14px] md:px-[22px] py-[10px] flex gap-[12px] md:gap-[18px] flex-wrap items-end md:sticky md:top-[135px] z` |
