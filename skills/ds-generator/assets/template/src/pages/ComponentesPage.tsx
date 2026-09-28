import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageHeader, SectionHeader, ComponentPreview, CodeBlock } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";
import ChartsSection from "@/components/ChartsSection";
import {
  AlertTriangle, Check, ChevronDown, ChevronRight, Copy, Download,
  Eye, Home, Info, Loader2, Mail, Search, Upload, X, FileText, Inbox,
  ArrowLeft, ArrowRight, Calendar, Filter, TrendingUp, TrendingDown,
  MoreVertical, Trash2, Edit, Share2, UploadCloud, File, CheckCircle2,
  XCircle, Clock, Users, DollarSign, BarChart3, Activity, Minus
} from "lucide-react";

export default function ComponentesPage() {
  return (
    <div>
      <SEO
        title="Componentes — Design System __BRAND_SHORT__"
        description="Biblioteca de componentes do Design System __BRAND_NAME__: botões, inputs, cards, modais, tabelas e mais — com preview, código e diretrizes de uso e acessibilidade."
        path="/componentes"
      />
      <PageHeader
        badge="Biblioteca"
        title="Componentes"
        description="Biblioteca de componentes prontos para uso. Cada componente inclui preview, código, variantes e diretrizes de uso e acessibilidade."
      />

      {/* BUTTON */}
      <SectionHeader id="botao" title="Botão Templates" description="Elemento interativo para ações primárias, secundárias e terciárias." />
      <ButtonSection />

      {/* INPUT */}
      <SectionHeader id="input" title="Campo de Texto" description="Entrada de dados de texto pelo usuário." />
      <InputSection />

      {/* SELECT */}
      <SectionHeader id="select" title="Select" description="Seleção de uma opção em uma lista." />
      <SelectSection />

      {/* CHECKBOX / RADIO */}
      <SectionHeader id="checkbox" title="Checkbox e Radio" description="Seleção de uma ou múltiplas opções." />
      <CheckboxSection />

      {/* SWITCH */}
      <SectionHeader id="switch" title="Switch" description="Alternância entre dois estados (ligado/desligado)." />
      <SwitchSection />

      {/* BADGE */}
      <SectionHeader id="badge" title="Badge / Tag" description="Elemento visual para categorização, status ou destaque." />
      <BadgeSection />

      {/* ALERT */}
      <SectionHeader id="alert" title="Alert" description="Mensagens de feedback contextual ao usuário." />
      <AlertSection />

      {/* CARD */}
      <SectionHeader id="card" title="Card" description="Container para agrupar informações relacionadas." />
      <CardSection />

      {/* TABLE */}
      <SectionHeader id="tabela" title="Tabela" description="Exibição de dados tabulares com semântica HTML correta." />
      <TableSection />

      {/* ACCORDION */}
      <SectionHeader id="accordion" title="Accordion" description="Seções colapsáveis para organizar conteúdo extenso." />
      <AccordionSection />

      {/* TABS */}
      <SectionHeader id="tabs" title="Tabs" description="Navegação entre painéis de conteúdo na mesma área." />
      <TabsSection />

      {/* MODAL */}
      <SectionHeader id="modal" title="Modal" description="Diálogo que exige atenção ou ação do usuário." />
      <ModalSection />

      {/* TOAST */}
      <SectionHeader id="toast" title="Toast / Notificação" description="Feedback temporário não-bloqueante." />
      <ToastSection />

      {/* BREADCRUMB */}
      <SectionHeader id="breadcrumb" title="Breadcrumb" description="Navegação hierárquica que mostra a localização atual." />
      <BreadcrumbSection />

      {/* PAGINATION */}
      <SectionHeader id="paginacao" title="Paginação" description="Navegação entre páginas de resultados." />
      <PaginationSection />

      {/* TOOLTIP */}
      <SectionHeader id="tooltip" title="Tooltip" description="Informação contextual exibida ao passar o mouse." />
      <TooltipSection />

      {/* SKELETON */}
      <SectionHeader id="skeleton" title="Skeleton Loading" description="Placeholder visual durante o carregamento de conteúdo." />
      <SkeletonSection />

      {/* SPINNER */}
      <SectionHeader id="spinner" title="Spinner / Loading" description="Indicador de carregamento." />
      <SpinnerSection />

      {/* EMPTY STATE */}
      <SectionHeader id="empty-state" title="Empty State" description="Estado vazio quando não há dados para exibir." />
      <EmptyStateSection />

      {/* DROPDOWN MENU */}
      <SectionHeader id="dropdown" title="Dropdown Menu" description="Menu contextual com opções de ações que se abre a partir de um botão ou ícone." />
      <DropdownMenuSection />

      {/* MENU KEBAB */}
      <SectionHeader id="menu-kebab" title="Menu Kebab" description="Botão de ícone (três pontos verticais) que abre um menu compacto de ações por item — ideal para listagens e tabelas." />
      <MenuKebabSection />

      {/* DATEPICKER */}
      <SectionHeader id="datepicker" title="DatePicker" description="Seleção de datas com calendário interativo e campos formatados." />
      <DatePickerSection />

      {/* FILTROS DINÂMICOS */}
      <SectionHeader id="filtros" title="Filtros Dinâmicos" description="Barra de filtros combinados para refinar listagens e dashboards." />
      <DynamicFiltersSection />

      {/* BIG NUMBERS */}
      <SectionHeader id="big-numbers" title="Big Numbers / KPIs" description="Cards de indicadores numéricos para dashboards e painéis gerenciais." />
      <BigNumbersSection />

      {/* UPLOAD EM MASSA */}
      <SectionHeader id="upload" title="Upload em Massa" description="Componente de upload de múltiplos arquivos com barra de progresso e feedback por item." />
      <BulkUploadSection />

      {/* STEPS / STEPPER */}
      <SectionHeader id="steps" title="Barra de Etapas (Stepper)" description="Indicador de progresso em etapas para fluxos multi-step como formulários e wizards." />
      <StepperSection />

      {/* LISTA DESCRITIVA */}
      <SectionHeader id="lista-descritiva" title="Lista Descritiva" description="Exibição de pares chave-valor para detalhes e informações resumidas." />
      <DescriptionListSection />

      {/* STATS CARD */}
      <SectionHeader id="stats" title="Cards de Estatísticas" description="Variações de cards com indicadores, trends, sparklines e comparativos." />
      <StatsCardsSection />

      {/* MÉTRICAS */}
      <SectionHeader id="metricas" title="Métricas" description="Painel completo de métricas para dashboards: cards com gráficos circulares, sparklines, barras de variação, tabelas trimestrais e cards de resumo com ícones." />
      <MetricsSection />

      {/* GRÁFICOS */}
      <ChartsSection />
    </div>
  );
}

/* ==================== BUTTON ==================== */
function ButtonSection() {
  return (
    <div className="space-y-8">
      <ComponentPreview
        title="Variantes de botão"
        description="Botões primários, secundários, outline, ghost e destructive em múltiplos tamanhos."
        whenToUse={["Ações principais e secundárias", "Submissão de formulários", "Navegação importante"]}
        whenNotToUse={["Navegação simples (use links)", "Ações dentro de texto corrido"]}
        accessibility={["Sempre ter texto acessível ou aria-label", "Foco visível em navegação por teclado", "Estados disabled com opacity e pointer-events-none"]}
        code={`<div className="space-y-4">
  {/* Linha 1 — Variações */}
  <div className="flex flex-wrap gap-3">
    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">Primário</button>
    <button className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">Secundário</button>
    <button className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors">Outline</button>
    <button className="inline-flex items-center gap-2 text-foreground px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors">Ghost</button>
    <button className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">Excluir</button>
    <button className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition-colors bg-[#E7F79E] text-[#2A4FDA] hover:bg-[#D1E575] hover:text-[#1644DC]">Diversificado</button>
  </div>

  <hr className="border-border/60" />

  {/* Linha 2 — Tamanhos */}
  <div className="flex flex-wrap gap-3">
    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium">Pequeno</button>
    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">Médio</button>
    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded text-base font-medium">Grande</button>
  </div>

  <hr className="border-border/60" />

  {/* Linha 3 — Desabilitado */}
  <div className="flex flex-wrap gap-3">
    <button disabled className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium opacity-50 cursor-not-allowed">Desabilitado</button>
  </div>
</div>`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
              Primário
            </button>
            <button className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
              Secundário
            </button>
            <button className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors">
              Outline
            </button>
            <button className="inline-flex items-center gap-2 text-foreground px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors">
              Ghost
            </button>
            <button className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
              Excluir
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition-colors bg-[#E7F79E] text-[#2A4FDA] hover:bg-[#D1E575] hover:text-[#1644DC]">
              Diversificado
            </button>
          </div>
          <hr className="border-border/60" />
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium">
              Pequeno
            </button>
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">
              Médio
            </button>
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded text-base font-medium">
              Grande
            </button>
          </div>
          <hr className="border-border/60" />
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium opacity-50 cursor-not-allowed" disabled>
              Desabilitado
            </button>
          </div>
          
          <div className="pt-4 mt-4 border-t border-border/50">
            <Link 
              to="/templates#catalogo" 
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline group"
            >
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              Templates &gt; Catálogo de Componentes
            </Link>
          </div>
        </div>
      </ComponentPreview>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
        <ComponentPreview
          title="Botão Primário"
          description="Ação principal de cada tela. Disponível em múltiplas paletas com os estados normal, hover, focus e disabled."
          whenToUse={["CTA principal do fluxo", "Confirmações de formulários", "Ação mais importante do contexto"]}
          whenNotToUse={["Ações secundárias (use Secundário)", "Mais de um primário no mesmo bloco"]}
          accessibility={["Contraste mínimo AA entre texto e fundo", "Foco visível com ring de 2px", "Estado disabled com opacity reduzida e pointer-events-none"]}
          code={`{/* Variações renderizadas (Tailwind utilities) */}
{/* Padrão */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-primary text-primary-foreground">Primário</button>
{/* Azul */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#0D3857] text-white">Primário</button>
{/* Laranja */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#D98217] text-white">Primário</button>
{/* Verde */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#1F8A4C] text-white">Primário</button>
{/* Escuro */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-foreground text-background">Primário</button>

{/* Estados (exemplo: Padrão) */}
<button className="px-4 py-2 rounded text-sm font-bold bg-primary text-primary-foreground">Normal</button>
<button className="px-4 py-2 rounded text-sm font-bold bg-primary/90 text-primary-foreground">Hover</button>
<button className="px-4 py-2 rounded text-sm font-bold outline-none ring-2 ring-offset-2 ring-primary bg-primary text-primary-foreground">Focus</button>
<button className="px-4 py-2 rounded text-sm font-bold opacity-50 cursor-not-allowed bg-primary text-primary-foreground" disabled>Disabled</button>

{/* Exemplos de uso em contexto */}
<button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity">
  <Download size={16} /> Baixar relatório
</button>
<button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity">
  Avançar <ArrowRight size={16} />
</button>
<button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold opacity-80 cursor-wait" disabled>
  <Loader2 size={16} className="animate-spin" /> Enviando...
</button>

{/* Ações em formulário */}
<form onSubmit={(e) => e.preventDefault()} className="p-4 bg-muted/20 rounded-lg border border-border/50 space-y-3">
  <label className="block text-xs font-semibold">
    Nome completo
    <input type="text" placeholder="Digite seu nome"
           className="mt-1 w-full px-3 py-2 rounded border border-border bg-background text-sm" />
  </label>
  <div className="flex flex-wrap justify-end gap-3 pt-2">
    <button type="button" className="px-4 py-2 rounded text-sm font-bold border border-border bg-background text-foreground hover:bg-muted transition-colors">Cancelar</button>
    <button type="submit" className="px-4 py-2 rounded text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">Salvar alterações</button>
  </div>
</form>`}
        >
          <div className="space-y-6">
            {[
              { name: "Padrão", base: "bg-primary text-primary-foreground", hover: "bg-primary/90 text-primary-foreground", focusRing: "ring-primary" },
              { name: "Azul", base: "bg-[#0D3857] text-white", hover: "bg-[#0A2B45] text-white", focusRing: "ring-[#0D3857]" },
              { name: "Laranja", base: "bg-[#D98217] text-white", hover: "bg-[#B86A0F] text-white", focusRing: "ring-[#D98217]" },
              { name: "Verde", base: "bg-[#1F8A4C] text-white", hover: "bg-[#176B3B] text-white", focusRing: "ring-[#1F8A4C]" },
              { name: "Escuro", base: "bg-foreground text-background", hover: "bg-foreground/90 text-background", focusRing: "ring-foreground" },
            ].map((v) => (
              <div key={v.name} className="space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{v.name}</div>
                <div className="flex flex-wrap items-end gap-6 p-3 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-bold transition-colors ${v.base}`}>Primário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Normal</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-bold ${v.hover}`}>Primário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Hover</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-bold outline-none ring-2 ring-offset-2 ${v.base} ${v.focusRing}`}>Primário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Focus</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-bold opacity-50 cursor-not-allowed ${v.base}`} disabled>Primário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Disabled</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Exemplos de uso em contexto</div>
              <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity">
                  <Download size={16} /> Baixar relatório
                </button>
                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity">
                  Avançar <ArrowRight size={16} />
                </button>
                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-bold opacity-80 cursor-wait" disabled>
                  <Loader2 size={16} className="animate-spin" /> Enviando...
                </button>
              </div>

              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide pt-2">Ações em formulário</div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="p-4 bg-muted/20 rounded-lg border border-border/50 space-y-3"
              >
                <label className="block text-xs font-semibold text-foreground">
                  Nome completo
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    className="mt-1 w-full px-3 py-2 rounded border border-border bg-background text-sm"
                  />
                </label>
                <div className="flex flex-wrap justify-end gap-3 pt-2">
                  <button type="button" className="px-4 py-2 rounded text-sm font-bold border border-border bg-background text-foreground hover:bg-muted transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 rounded text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    Salvar alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ComponentPreview>
        </div>

        <div className="md:col-span-2">
        <ComponentPreview
          title="Botão Secundário"
          description="Variação de apoio para ações complementares à ação primária, disponível em múltiplas paletas com os estados normal, hover, focus e disabled."
          whenToUse={["Ações complementares ao CTA principal", "Alternativas neutras a uma ação primária"]}
          whenNotToUse={["Ação principal do fluxo (use Primário)", "Ações destrutivas (use Destrutivo)"]}
          accessibility={["Contraste mínimo AA entre texto e fundo", "Foco visível com ring de 2px", "Estado disabled com opacity reduzida e pointer-events-none"]}
          code={`{/* Variações renderizadas (Tailwind utilities) */}
{/* Neutro */}
<button className="px-4 py-2 rounded text-sm font-medium transition-colors bg-secondary text-secondary-foreground">Secundário</button>
{/* Azul */}
<button className="px-4 py-2 rounded text-sm font-medium transition-colors bg-[#2A4FDA] text-white">Secundário</button>
{/* Laranja */}
<button className="px-4 py-2 rounded text-sm font-medium transition-colors bg-[#D98217] text-white">Secundário</button>
{/* Verde */}
<button className="px-4 py-2 rounded text-sm font-medium transition-colors bg-[#1F8A4C] text-white">Secundário</button>
{/* Contorno */}
<button className="px-4 py-2 rounded text-sm font-medium transition-colors border border-primary bg-transparent text-primary">Secundário</button>
{/* Suave */}
<button className="px-4 py-2 rounded text-sm font-medium transition-colors bg-primary/10 text-primary">Secundário</button>

{/* Estados (exemplo: Neutro) */}
<button className="px-4 py-2 rounded text-sm font-medium bg-secondary text-secondary-foreground">Normal</button>
<button className="px-4 py-2 rounded text-sm font-medium bg-secondary/80 text-secondary-foreground">Hover</button>
<button className="px-4 py-2 rounded text-sm font-medium outline-none ring-2 ring-offset-2 ring-primary bg-secondary text-secondary-foreground">Focus</button>
<button className="px-4 py-2 rounded text-sm font-medium opacity-50 cursor-not-allowed bg-secondary text-secondary-foreground" disabled>Disabled</button>`}
        >
          <div className="space-y-6">
            {[
              { name: "Neutro", base: "bg-secondary text-secondary-foreground", hover: "bg-secondary/80 text-secondary-foreground", focusRing: "ring-primary" },
              { name: "Azul", base: "bg-[#2A4FDA] text-white", hover: "bg-[#1644DC] text-white", focusRing: "ring-[#2A4FDA]" },
              { name: "Laranja", base: "bg-[#D98217] text-white", hover: "bg-[#B86A0F] text-white", focusRing: "ring-[#D98217]" },
              { name: "Verde", base: "bg-[#1F8A4C] text-white", hover: "bg-[#176B3B] text-white", focusRing: "ring-[#1F8A4C]" },
              { name: "Contorno", base: "border border-primary bg-transparent text-primary", hover: "bg-primary/10 text-primary border border-primary", focusRing: "ring-primary" },
              { name: "Suave", base: "bg-primary/10 text-primary", hover: "bg-primary/20 text-primary", focusRing: "ring-primary" },
            ].map((v) => (
              <div key={v.name} className="space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{v.name}</div>
                <div className="flex flex-wrap items-end gap-6 p-3 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${v.base}`}>Secundário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Normal</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-medium ${v.hover}`}>Secundário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Hover</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-medium outline-none ring-2 ring-offset-2 ${v.base} ${v.focusRing}`}>Secundário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Focus</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className={`px-4 py-2 rounded text-sm font-medium opacity-50 cursor-not-allowed ${v.base}`} disabled>Secundário</button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Disabled</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentPreview>
        </div>

        <div className="md:col-span-2">
        <ComponentPreview
          title="Botão Diversificado"
          description="Variação de destaque com paleta lima/azul. Indicada para CTAs alternativos que precisam contrastar com o primário."
          whenToUse={["Chamadas de ação secundárias de destaque", "Promoções e ações pontuais que pedem diferenciação visual"]}
          whenNotToUse={["Ações primárias do fluxo (use Primário)", "Ações destrutivas (use Destrutivo)"]}
          accessibility={["Contraste mínimo AA entre texto e fundo", "Foco visível com ring de 2px", "Estado disabled com opacity reduzida e pointer-events-none"]}
          code={`{/* Estados renderizados (Tailwind utilities) */}
{/* Normal */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#E7F79E] text-[#2A4FDA] hover:bg-[#D1E575] hover:text-[#1644DC]">
  Diversificado
</button>

{/* Hover */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#D1E575] text-[#1644DC]">
  Diversificado
</button>

{/* Focus */}
<button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#E7F79E] text-[#2A4FDA] outline-none ring-2 ring-[#1644DC] ring-offset-2">
  Diversificado
</button>

{/* Disabled */}
<button className="px-4 py-2 rounded text-sm font-bold bg-[#E7F79E] text-[#2A4FDA] opacity-50 cursor-not-allowed" disabled>
  Diversificado
</button>`}
        >
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#E7F79E] text-[#2A4FDA] hover:bg-[#D1E575] hover:text-[#1644DC]">
                Diversificado
              </button>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Normal</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#D1E575] text-[#1644DC]">
                Diversificado
              </button>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Hover</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="px-4 py-2 rounded text-sm font-bold transition-colors bg-[#E7F79E] text-[#2A4FDA] outline-none ring-2 ring-[#1644DC] ring-offset-2">
                Diversificado
              </button>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Focus</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="px-4 py-2 rounded text-sm font-bold bg-[#E7F79E] text-[#2A4FDA] opacity-50 cursor-not-allowed" disabled>
                Diversificado
              </button>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Disabled</span>
            </div>
          </div>
        </ComponentPreview>
        </div>

        <ComponentPreview
          title="Botão com Loading"
          description="Indicador de processamento para ações assíncronas."
          code={`import { Loader2 } from "lucide-react";

<div className="flex justify-center">
  <button disabled
    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium opacity-80 cursor-wait">
    <Loader2 size={18} className="animate-spin" /> Carregando...
  </button>
</div>`}
        >
          <div className="flex justify-center">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium opacity-80 cursor-wait" disabled>
              <Loader2 size={18} className="animate-spin" /> Carregando...
            </button>
          </div>
        </ComponentPreview>

        <ComponentPreview
          title="Botão com ícone à esquerda"
          description="Utilizado para reforçar o significado da ação com um ícone de suporte no início."
          code={`import { Download } from "lucide-react";

<div className="flex justify-center">
  <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
    <Download size={18} /> Download
  </button>
</div>`}
        >
          <div className="flex justify-center">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
              <Download size={18} /> Download
            </button>
          </div>
        </ComponentPreview>

        <ComponentPreview
          title="Botão com ícone à direita"
          description="Utilizado em fluxos de continuidade ou quando a ação sugere um próximo passo."
          code={`import { ArrowRight } from "lucide-react";

<div className="flex justify-center">
  <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
    Próximo <ArrowRight size={18} />
  </button>
</div>`}
        >
          <div className="flex justify-center">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
              Próximo <ArrowRight size={18} />
            </button>
          </div>
        </ComponentPreview>

        <ComponentPreview
          title="Botão somente ícone (Icon Button)"
          description="Utilizado em interfaces densas ou ações secundárias. Requer aria-label para acessibilidade."
          code={`import { Download, Edit, Trash2 } from "lucide-react";

<div className="flex flex-wrap justify-center gap-3">
  {/* Primário */}
  <button aria-label="Download"
    className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
    <Download size={18} />
  </button>
  {/* Secundário */}
  <button aria-label="Salvar"
    className="p-2 bg-secondary text-secondary-foreground rounded hover:opacity-90 transition-opacity">
    <Edit size={18} />
  </button>
  {/* Outline */}
  <button aria-label="Editar"
    className="p-2 border border-border bg-background text-foreground rounded hover:bg-muted transition-colors">
    <Edit size={18} />
  </button>
  {/* Ghost */}
  <button aria-label="Mais opções"
    className="p-2 text-foreground rounded hover:bg-muted transition-colors">
    <Edit size={18} />
  </button>
  {/* Destrutivo */}
  <button aria-label="Excluir"
    className="p-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity">
    <Trash2 size={18} />
  </button>
  {/* Sucesso */}
  <button aria-label="Confirmar"
    className="p-2 bg-success text-white rounded hover:opacity-90 transition-opacity">
    <Download size={18} />
  </button>
  {/* Aviso */}
  <button aria-label="Atenção"
    className="p-2 bg-warning text-white rounded hover:opacity-90 transition-opacity">
    <Edit size={18} />
  </button>
  {/* Diversificado */}
  <button aria-label="Diversificado"
    className="p-2 bg-[#E7F79E] text-[#2A4FDA] rounded hover:bg-[#D1E575] hover:text-[#1644DC] transition-colors">
    <Download size={18} />
  </button>
</div>`}
        >
          <div className="flex flex-wrap justify-center gap-3">
            <button className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity" aria-label="Download">
              <Download size={18} />
            </button>
            <button className="p-2 bg-secondary text-secondary-foreground rounded hover:opacity-90 transition-opacity" aria-label="Salvar">
              <Edit size={18} />
            </button>
            <button className="p-2 border border-border bg-background text-foreground rounded hover:bg-muted transition-colors" aria-label="Editar">
              <Edit size={18} />
            </button>
            <button className="p-2 text-foreground rounded hover:bg-muted transition-colors" aria-label="Mais opções">
              <Edit size={18} />
            </button>
            <button className="p-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity" aria-label="Excluir">
              <Trash2 size={18} />
            </button>
            <button className="p-2 bg-success text-white rounded hover:opacity-90 transition-opacity" aria-label="Confirmar">
              <Download size={18} />
            </button>
            <button className="p-2 bg-warning text-white rounded hover:opacity-90 transition-opacity" aria-label="Atenção">
              <Edit size={18} />
            </button>
            <button className="p-2 bg-[#E7F79E] text-[#2A4FDA] rounded hover:bg-[#D1E575] hover:text-[#1644DC] transition-colors" aria-label="Diversificado">
              <Download size={18} />
            </button>
          </div>
        </ComponentPreview>

      </div>
    </div>
  );
}

/* ==================== INPUT ==================== */
function InputSection() {
  return (
    <ComponentPreview
      title="Campo de texto e Textarea"
      description="Inputs, campos com label, campos com erro e textarea."
      whenToUse={["Coleta de dados textuais", "Formulários"]}
      whenNotToUse={["Seleção entre opções predefinidas (use Select ou Radio)"]}
      accessibility={["Label associado via htmlFor/id", "Mensagens de erro com aria-describedby", "Placeholder não substitui label"]}
      code={`<div className="space-y-4 max-w-md">
  {/* Nome completo */}
  <div>
    <label className="block text-sm font-medium mb-1.5">Nome completo</label>
    <input type="text" placeholder="Digite seu nome"
      className="w-full border border-input rounded px-3 py-2 text-sm bg-background
             focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" />
  </div>

  {/* E-mail com texto auxiliar */}
  <div>
    <label className="block text-sm font-medium mb-1.5">E-mail</label>
    <input type="email" placeholder="exemplo@__ORG_DOMAIN__"
      className="w-full border border-input rounded px-3 py-2 text-sm bg-background
             focus:outline-none focus:ring-2 focus:ring-ring transition-colors" />
    <p className="text-xs text-muted-foreground mt-1">Informe seu e-mail institucional</p>
  </div>

  {/* Campo com erro */}
  <div>
    <label className="block text-sm font-medium mb-1.5 text-error">Campo com erro</label>
    <input type="text" value="valor incorreto" aria-describedby="field-error"
      className="w-full border-2 border-error rounded px-3 py-2 text-sm bg-error-bg
             focus:outline-none focus:ring-2 focus:ring-error transition-colors" />
    <p id="field-error" role="alert" className="text-xs text-error mt-1">Este campo é obrigatório</p>
  </div>

  {/* Textarea */}
  <div>
    <label className="block text-sm font-medium mb-1.5">Observações</label>
    <textarea rows="3" placeholder="Descreva aqui..."
      className="w-full border border-input rounded px-3 py-2 text-sm bg-background
             focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-y"></textarea>
  </div>

  {/* Busca com ícone (lucide-react: Search) */}
  <div>
    <label className="block text-sm font-medium mb-1.5">Busca com ícone</label>
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input type="search" placeholder="Buscar..."
        className="w-full border border-input rounded pl-9 pr-3 py-2 text-sm bg-background
               focus:outline-none focus:ring-2 focus:ring-ring transition-colors" />
    </div>
  </div>
</div>

{/* Tokens globais aplicados pelo DS:
     border-color padrão: #95ADFF · hover: #2A4FDA · placeholder: #96A1C0 */}`}
    >
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nome completo</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">E-mail</label>
          <input
            type="email"
            placeholder="exemplo@__ORG_DOMAIN__"
            className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1">Informe seu e-mail institucional</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-error">Campo com erro</label>
          <input
            type="text"
            defaultValue="valor incorreto"
            className="w-full border-2 border-error rounded px-3 py-2 text-sm bg-error-bg focus:outline-none focus:ring-2 focus:ring-error transition-colors"
            aria-describedby="field-error"
          />
          <p id="field-error" role="alert" className="text-xs text-error mt-1">Este campo é obrigatório</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Observações</label>
          <textarea
            rows={3}
            placeholder="Descreva aqui..."
            className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Busca com ícone</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full border border-input rounded pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== SELECT ==================== */
function SelectSection() {
  return (
    <ComponentPreview
      title="Select"
      description="Campo de seleção nativo com estilos consistentes."
      whenToUse={["Escolha entre 4+ opções", "Quando o espaço é limitado"]}
      whenNotToUse={["Menos de 4 opções (use Radio)", "Seleção múltipla complexa"]}
      accessibility={["Label associado via htmlFor", "Use optgroup para agrupar opções longas"]}
      code={`import { ChevronDown } from "lucide-react";

{/* Select básico com chevron via lucide */}
<div className="max-w-md">
  <label className="block text-sm font-medium mb-1.5">Estado</label>
  <div className="relative">
    <select className="appearance-none w-full border border-input rounded px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
      <option value="">Selecione um estado...</option>
      <option>Distrito Federal</option>
      <option>São Paulo</option>
      <option>Rio de Janeiro</option>
    </select>
    <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
  </div>
</div>

{/* Estados: Normal / Hover / Focus / Disabled / Erro */}
{[
  { label: "Normal",   cls: "border-input bg-background" },
  { label: "Hover",    cls: "border-input bg-muted/40" },
  { label: "Focus",    cls: "border-input bg-background ring-2 ring-ring outline-none" },
  { label: "Disabled", cls: "border-input bg-muted text-muted-foreground cursor-not-allowed opacity-60", disabled: true },
  { label: "Erro",     cls: "border-destructive bg-background ring-1 ring-destructive/40" },
].map(s => (
  <div key={s.label} className="space-y-1">
    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
    <div className="relative">
      <select
        disabled={s.disabled}
        className={\`appearance-none w-full border rounded px-3 py-2 pr-10 text-sm transition-colors focus:outline-none \${s.cls}\`}
      >
        <option>Selecione um estado...</option>
      </select>
      <ChevronDown
        size={18}
        className={\`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 \${s.label === "Erro" ? "text-destructive" : "text-muted-foreground"}\`}
      />
    </div>
    {s.label === "Erro" && (
      <span className="text-xs text-destructive">Selecione um estado válido.</span>
    )}
  </div>
))}`}
    >
      <div className="space-y-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium mb-1.5">Estado</label>
          <div className="relative">
            <select className="appearance-none w-full border border-input rounded px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
              <option value="">Selecione um estado...</option>
              <option>Distrito Federal</option>
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Minas Gerais</option>
              <option>Bahia</option>
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide pt-3">
            Validação do chevron — estados e larguras
          </div>

          {[
            { label: "Normal", width: "w-full max-w-xs", cls: "border-input bg-background" },
            { label: "Hover", width: "w-full max-w-sm", cls: "border-input bg-muted/40" },
            { label: "Focus", width: "w-full max-w-md", cls: "border-input bg-background ring-2 ring-ring outline-none" },
            { label: "Disabled", width: "w-full max-w-lg", cls: "border-input bg-muted text-muted-foreground cursor-not-allowed opacity-60", disabled: true },
            { label: "Erro", width: "w-full", cls: "border-destructive bg-background ring-1 ring-destructive/40" },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
              <div className={`relative ${s.width}`}>
                <select
                  disabled={s.disabled}
                  className={`appearance-none w-full border rounded px-3 py-2 pr-10 text-sm transition-colors focus:outline-none ${s.cls}`}
                >
                  <option>Selecione um estado...</option>
                  <option>Distrito Federal</option>
                  <option>São Paulo</option>
                </select>
                <ChevronDown
                  size={18}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${s.label === "Erro" ? "text-destructive" : "text-muted-foreground"}`}
                />
              </div>
              {s.label === "Erro" && (
                <span className="text-xs text-destructive">Selecione um estado válido.</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== CHECKBOX / RADIO ==================== */
function CheckboxSection() {
  return (
    <ComponentPreview
      title="Checkbox e Radio"
      description="Seleção única (radio) ou múltipla (checkbox)."
      whenToUse={["Seleção de uma ou mais opções de uma lista curta"]}
      accessibility={["Cada input precisa de label associado", "Agrupar com fieldset e legend"]}
      code={`<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Checkboxes */}
  <fieldset>
    <legend className="text-sm font-semibold mb-2">Checkboxes</legend>
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" /> Administrador
      </label>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" /> Editor
      </label>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" /> Visualizador
      </label>
    </div>
  </fieldset>

  {/* Radio buttons */}
  <fieldset>
    <legend className="text-sm font-semibold mb-2">Radio buttons</legend>
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="radio" name="tipo" className="w-4 h-4 border-border accent-primary" /> Mensal
      </label>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="radio" name="tipo" className="w-4 h-4 border-border accent-primary" /> Trimestral
      </label>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="radio" name="tipo" className="w-4 h-4 border-border accent-primary" /> Anual
      </label>
    </div>
  </fieldset>
</div>

{/* Tokens globais aplicados pelo DS:
     border-color padrão: #95ADFF · hover: #2A4FDA · accent-color: #2A4FDA */}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <fieldset>
          <legend className="text-sm font-semibold mb-2">Checkboxes</legend>
          <div className="space-y-2">
            {["Administrador", "Editor", "Visualizador"].map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold mb-2">Radio buttons</legend>
          <div className="space-y-2">
            {["Mensal", "Trimestral", "Anual"].map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="tipo" className="w-4 h-4 border-border accent-primary" />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </ComponentPreview>
  );
}

/* ==================== SWITCH ==================== */
function SwitchSection() {
  const [on, setOn] = useState(false);
  return (
    <ComponentPreview
      title="Switch"
      description="Toggle entre ligado e desligado."
      whenToUse={["Configurações on/off", "Ativação imediata de funcionalidade"]}
      accessibility={["Use role='switch' e aria-checked", "Forneça label descritivo"]}
      code={`import { useState } from "react";

function Switch() {
  const [on, setOn] = useState(false);
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={\`relative w-11 h-6 rounded-full transition-colors \${on ? "bg-primary" : "bg-muted"}\`}
      >
        <span
          className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform \${on ? "translate-x-5" : ""}\`}
        />
      </button>
      <span className="text-sm">Notificações por e-mail</span>
    </label>
  );
}`}
    >
      <label className="flex items-center gap-3 cursor-pointer">
        <button
          role="switch"
          aria-checked={on}
          onClick={() => setOn(!on)}
          className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
        </button>
        <span className="text-sm">Notificações por e-mail</span>
      </label>
    </ComponentPreview>
  );
}

/* ==================== BADGE ==================== */
function BadgeSection() {
  return (
    <ComponentPreview
      title="Badge / Tag"
      description="Indicadores de status, categorias ou contagens."
      whenToUse={["Status de itens", "Categorias", "Contadores"]}
      whenNotToUse={["Texto longo", "Ações clicáveis (use botão)"]}
      code={`<div className="flex flex-wrap gap-2">
  <span className="brand-badge-primary">Ativo</span>
  <span className="brand-badge-secondary">Destaque</span>
  <span className="brand-badge-success">Concluído</span>
  <span className="brand-badge-warning">Pendente</span>
  <span className="brand-badge-error">Erro</span>
  <span className="brand-badge-info">Informação</span>
  {/* "Fundo claro" reutiliza o estilo da pílula Informação */}
  <span className="brand-badge-info">Fundo claro</span>
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-foreground">
    Neutro
  </span>
</div>`}
    >
      <div className="flex flex-wrap gap-2">
        <span className="brand-badge-primary">Ativo</span>
        <span className="brand-badge-secondary">Destaque</span>
        <span className="brand-badge-success">Concluído</span>
        <span className="brand-badge-warning">Pendente</span>
        <span className="brand-badge-error">Erro</span>
        <span className="brand-badge-info">Informação</span>
        <span className="brand-badge-info">Fundo claro</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-foreground">Neutro</span>
      </div>
    </ComponentPreview>
  );
}

/* ==================== ALERT ==================== */
function AlertSection() {
  return (
    <ComponentPreview
      title="Alert"
      description="Mensagens de feedback: sucesso, atenção, erro e informação."
      whenToUse={["Feedback de ações", "Alertas de sistema", "Informações contextuais"]}
      accessibility={["Use role='alert' para mensagens urgentes", "Ícone + texto para não depender só de cor"]}
      code={`import { Check, AlertTriangle, X, Info } from "lucide-react";

const alerts = [
  { icon: <Check size={18} />, title: "Sucesso", msg: "Operação realizada com sucesso.", cls: "border-l-4 border-success bg-success-bg" },
  { icon: <AlertTriangle size={18} />, title: "Atenção", msg: "Verifique os dados antes de prosseguir.", cls: "border-l-4 border-warning bg-warning-bg" },
  { icon: <X size={18} />, title: "Erro", msg: "Não foi possível completar a operação.", cls: "border-l-4 border-error bg-error-bg" },
  { icon: <Info size={18} />, title: "Informação", msg: "O prazo para envio termina em 30 dias.", cls: "border-l-4 border-info bg-info-bg" },
];

<div className="space-y-3">
  {alerts.map(a => (
    <div key={a.title} className={\`flex gap-3 p-4 rounded-r-lg \${a.cls}\`} role="alert">
      <span className="shrink-0 mt-0.5">{a.icon}</span>
      <div>
        <p className="text-sm font-semibold">{a.title}</p>
        <p className="text-xs text-muted-foreground">{a.msg}</p>
      </div>
    </div>
  ))}
</div>`}
    >
      <div className="space-y-3">
        {[
          { icon: <Check size={18} />, title: "Sucesso", msg: "Operação realizada com sucesso.", cls: "border-l-4 border-success bg-success-bg" },
          { icon: <AlertTriangle size={18} />, title: "Atenção", msg: "Verifique os dados antes de prosseguir.", cls: "border-l-4 border-warning bg-warning-bg" },
          { icon: <X size={18} />, title: "Erro", msg: "Não foi possível completar a operação.", cls: "border-l-4 border-error bg-error-bg" },
          { icon: <Info size={18} />, title: "Informação", msg: "O prazo para envio termina em 30 dias.", cls: "border-l-4 border-info bg-info-bg" },
        ].map(a => (
          <div key={a.title} className={`flex gap-3 p-4 rounded-r-lg ${a.cls}`} role="alert">
            <span className="shrink-0 mt-0.5">{a.icon}</span>
            <div>
              <p className="text-sm font-semibold">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </ComponentPreview>
  );
}

/* ==================== CARD ==================== */
function CardSection() {
  return (
    <ComponentPreview
      title="Card"
      description="Container para agrupar informações relacionadas com visual limpo."
      whenToUse={["Agrupar conteúdo relacionado", "Listagem de itens", "Cards de indicadores"]}
      code={`<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Card básico (header + body + footer) */}
  <div className="bg-card rounded-lg border border-border overflow-hidden">
    <div className="p-4 border-b border-border">
      <h4 className="font-semibold text-sm">Card básico</h4>
    </div>
    <div className="p-4">
      <p className="text-sm text-muted-foreground">Conteúdo do card com informações relevantes.</p>
    </div>
    <div className="p-4 border-t border-border bg-muted/30">
      <button className="text-xs text-primary font-medium hover:underline">Ver mais →</button>
    </div>
  </div>

  {/* Card de indicador */}
  <div className="bg-card rounded-lg border border-border p-4 text-center">
    <p className="text-3xl font-bold text-primary">1.247</p>
    <p className="text-xs text-muted-foreground mt-1">Empresas atendidas</p>
    <p className="text-xs text-success mt-2">↑ 12% em relação ao mês anterior</p>
  </div>

  {/* Card de destaque */}
  <div className="bg-primary rounded-lg p-4 text-primary-foreground">
    <p className="text-xs opacity-80 mb-1">Destaque</p>
    <h4 className="font-semibold text-sm mb-2">Card com fundo primário</h4>
    <p className="text-xs opacity-80">Para informações de destaque institucional.</p>
  </div>
</div>`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h4 className="font-semibold text-sm">Card básico</h4>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Conteúdo do card com informações relevantes.</p>
          </div>
          <div className="p-4 border-t border-border bg-muted/30">
            <button className="text-xs text-primary font-medium hover:underline">Ver mais →</button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-3xl font-bold text-primary">1.247</p>
          <p className="text-xs text-muted-foreground mt-1">Empresas atendidas</p>
          <p className="text-xs text-success mt-2">↑ 12% em relação ao mês anterior</p>
        </div>

        <div className="bg-primary rounded-lg p-4 text-primary-foreground">
          <p className="text-xs opacity-80 mb-1">Destaque</p>
          <h4 className="font-semibold text-sm mb-2">Card com fundo primário</h4>
          <p className="text-xs opacity-80">Para informações de destaque institucional.</p>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== TABLE ==================== */

const tableProducts = [
  { name: "AGI", category: "Inovação", price: "R$ 99.000", stock: 120, rating: 4.5, status: "Ativo" },
  { name: "Empreender", category: "Empreendedorismo", price: "R$ 59.990", stock: 80, rating: 4.2, status: "Ativo" },
  { name: "Programa Inova", category: "Tecnologia", price: "R$ 129.000", stock: 0, rating: 4.0, status: "Suspenso" },
  { name: "Primeiro Negócio", category: "Capacitação", price: "R$ 39.500", stock: 250, rating: 4.7, status: "Ativo" },
  { name: "Visita Técnica", category: "Atendimento", price: "R$ 149.000", stock: 35, rating: 4.3, status: "Ativo" },
];

const tableProducts2 = [
  { name: "MEI - Microempreendedor", category: "Formalização", price: "R$ 49.000", stock: 200, rating: 4.6, status: "Ativo" },
  { name: "Mais Produtividade", category: "Produtividade", price: "R$ 29.990", stock: 150, rating: 4.3, status: "Ativo" },
  { name: "Sob Medida", category: "Capacitação", price: "R$ 89.000", stock: 60, rating: 4.1, status: "Estoque Limitado" },
  { name: "Elas Empreendem", category: "Mulheres", price: "R$ 349.000", stock: 30, rating: 4.8, status: "Ativo" },
  { name: "Compras Públicas", category: "Mercado", price: "R$ 499.000", stock: 10, rating: 4.4, status: "Novo" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Ativo": "brand-badge-success",
    "Suspenso": "brand-badge-error",
    "Estoque Limitado": "brand-badge-warning",
    "Novo": "brand-badge-info",
  };
  return <span className={map[status] || "brand-badge-secondary"}>{status}</span>;
}

function KebabMenu({ onEdit, onDelete, onView }: { onEdit?: () => void; onDelete?: () => void; onView?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md hover:bg-muted transition-colors"
        aria-label="Ações"
      >
        <MoreVertical size={16} className="text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 min-w-[140px] bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in">
            {onView && (
              <button onClick={() => { onView(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors text-foreground">
                <Eye size={14} className="text-muted-foreground" /> Visualizar
              </button>
            )}
            {onEdit && (
              <button onClick={() => { onEdit(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors text-foreground">
                <Edit size={14} className="text-muted-foreground" /> Editar
              </button>
            )}
            {onDelete && (
              <button onClick={() => { onDelete(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors text-destructive">
                <Trash2 size={14} /> Excluir
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TableSection() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const thClass = "text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground";
  const tdClass = "py-3 px-4 text-sm";

  return (
    <>
      {/* ---- TABELA BÁSICA ---- */}
      <ComponentPreview
        title="Tabela Básica"
        description="Tabela simples com cabeçalho, dados e ações via menu kebab."
        whenToUse={["Listagens de dados com ações rápidas", "Dashboards administrativos"]}
        accessibility={["Use th com scope='col'", "Caption ou aria-label na tabela", "Menu kebab acessível com teclado"]}
        code={`const thClass = "text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground";
const tdClass = "py-3 px-4 text-sm";

<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <caption className="sr-only">Programas do __BRAND_NAME__</caption>
    <thead>
      <tr className="border-b-2 border-border">
        <th scope="col" className={thClass}>Programa</th>
        <th scope="col" className={thClass}>Categoria</th>
        <th scope="col" className={thClass}>Valor</th>
        <th scope="col" className={thClass}>Qtd</th>
        <th scope="col" className={thClass}>Avaliação</th>
        <th scope="col" className={thClass}>Status</th>
        <th scope="col" className={\`\${thClass} text-right\`}>Ações</th>
      </tr>
    </thead>
    <tbody>
      {tableProducts.map((r, i) => (
        <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
          <td className={\`\${tdClass} font-medium\`}>{r.name}</td>
          <td className={\`\${tdClass} text-muted-foreground\`}>{r.category}</td>
          <td className={tdClass}>{r.price}</td>
          <td className={tdClass}>{r.stock}</td>
          <td className={tdClass}>{r.rating} ★</td>
          <td className={tdClass}><StatusBadge status={r.status} /></td>
          <td className={\`\${tdClass} text-right\`}>
            <KebabMenu onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Programas do __BRAND_NAME__</caption>
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className={thClass}>Programa</th>
                <th scope="col" className={thClass}>Categoria</th>
                <th scope="col" className={thClass}>Valor</th>
                <th scope="col" className={thClass}>Qtd</th>
                <th scope="col" className={thClass}>Avaliação</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={`${thClass} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts.map((r, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className={`${tdClass} font-medium`}>{r.name}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                  <td className={tdClass}>{r.price}</td>
                  <td className={tdClass}>{r.stock}</td>
                  <td className={tdClass}>{r.rating} ★</td>
                  <td className={tdClass}><StatusBadge status={r.status} /></td>
                  <td className={`${tdClass} text-right`}>
                    <KebabMenu onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA CUSTOMIZADA ---- */}
      <ComponentPreview
        title="Tabela Customizada"
        description="Tabela com espaçamento especial, bordas arredondadas e ações via menu kebab."
        code={`{/* Container com borda arredondada + thead com fundo muted */}
<div className="overflow-x-auto border border-border rounded-lg">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-muted/50">
        <th scope="col" className={thClass}>Programa</th>
        {/* ...demais colunas... */}
      </tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
          {/* células */}
        </tr>
      ))}
    </tbody>
  </table>
</div>`}
      >
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th scope="col" className={thClass}>Programa</th>
                <th scope="col" className={thClass}>Categoria</th>
                <th scope="col" className={thClass}>Valor</th>
                <th scope="col" className={thClass}>Qtd</th>
                <th scope="col" className={thClass}>Avaliação</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={`${thClass} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className={`${tdClass} font-medium`}>{r.name}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                  <td className={tdClass}>{r.price}</td>
                  <td className={tdClass}>{r.stock}</td>
                  <td className={tdClass}>{r.rating} ★</td>
                  <td className={tdClass}><StatusBadge status={r.status} /></td>
                  <td className={`${tdClass} text-right`}>
                    <KebabMenu onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- LINHAS LISTRADAS ---- */}
      <ComponentPreview
        title="Tabela com Linhas Listradas"
        description="Zebra-striping para melhorar a legibilidade em tabelas com muitas linhas."
        code={`{/* Zebra-striping via index par/ímpar */}
<tbody>
  {rows.map((r, i) => (
    <tr key={i} className={\`border-b border-border \${i % 2 === 0 ? "bg-muted/30" : ""}\`}>
      {/* células */}
    </tr>
  ))}
</tbody>`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className={thClass}>Programa</th>
                <th scope="col" className={thClass}>Categoria</th>
                <th scope="col" className={thClass}>Valor</th>
                <th scope="col" className={thClass}>Qtd</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={`${thClass} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.slice(0, 3).map((r, i) => (
                <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                  <td className={`${tdClass} font-medium`}>{r.name}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                  <td className={tdClass}>{r.price}</td>
                  <td className={tdClass}>{r.stock}</td>
                  <td className={tdClass}><StatusBadge status={r.status} /></td>
                  <td className={`${tdClass} text-right`}>
                    <KebabMenu onEdit={() => {}} onDelete={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA COM BORDAS ---- */}
      <ComponentPreview
        title="Tabela com Bordas"
        description="Bordas em todas as células para máxima delimitação visual."
        code={`{/* Borda em todas as células: aplicar border border-border em <th>/<td> */}
<table className="w-full text-sm border border-border">
  <thead>
    <tr className="bg-muted/50">
      <th scope="col" className={\`\${thClass} border border-border\`}>Programa</th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {rows.map((r, i) => (
      <tr key={i}>
        <td className={\`\${tdClass} border border-border font-medium\`}>{r.name}</td>
        {/* ... */}
      </tr>
    ))}
  </tbody>
</table>`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/50">
                <th scope="col" className={`${thClass} border border-border`}>Programa</th>
                <th scope="col" className={`${thClass} border border-border`}>Categoria</th>
                <th scope="col" className={`${thClass} border border-border`}>Valor</th>
                <th scope="col" className={`${thClass} border border-border`}>Qtd</th>
                <th scope="col" className={`${thClass} border border-border`}>Avaliação</th>
                <th scope="col" className={`${thClass} border border-border`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.slice(0, 3).map((r, i) => (
                <tr key={i}>
                  <td className={`${tdClass} border border-border font-medium`}>{r.name}</td>
                  <td className={`${tdClass} border border-border text-muted-foreground`}>{r.category}</td>
                  <td className={`${tdClass} border border-border`}>{r.price}</td>
                  <td className={`${tdClass} border border-border`}>{r.stock}</td>
                  <td className={`${tdClass} border border-border`}>{r.rating} ★</td>
                  <td className={`${tdClass} border border-border`}><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA SEM BORDAS ---- */}
      <ComponentPreview
        title="Tabela sem Bordas"
        description="Tabela limpa sem bordas para layouts minimalistas."
        code={`{/* Sem bordas — apenas hover sutil nas linhas */}
<table className="w-full text-sm">
  <thead>
    <tr>
      <th scope="col" className={thClass}>Programa</th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {rows.map((r, i) => (
      <tr key={i} className="hover:bg-muted/20 transition-colors">
        {/* células sem borda */}
      </tr>
    ))}
  </tbody>
</table>`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className={thClass}>Programa</th>
                <th scope="col" className={thClass}>Categoria</th>
                <th scope="col" className={thClass}>Valor</th>
                <th scope="col" className={thClass}>Qtd</th>
                <th scope="col" className={thClass}>Avaliação</th>
                <th scope="col" className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.slice(0, 3).map((r, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className={`${tdClass} font-medium`}>{r.name}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                  <td className={tdClass}>{r.price}</td>
                  <td className={tdClass}>{r.stock}</td>
                  <td className={tdClass}>{r.rating} ★</td>
                  <td className={tdClass}><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA COMPACTA ---- */}
      <ComponentPreview
        title="Tabela Compacta"
        description="Tabela com padding reduzido para exibir mais dados em menos espaço."
        code={`{/* Versão compacta: text-xs e padding reduzido (py-1.5 px-2) */}
<table className="w-full text-xs">
  <thead>
    <tr className="border-b-2 border-border">
      <th scope="col" className="text-left py-1.5 px-2 font-semibold uppercase tracking-wide text-muted-foreground">Programa</th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {rows.map((r, i) => (
      <tr key={i} className="border-b border-border">
        <td className="py-1.5 px-2 font-medium">{r.name}</td>
        {/* ... */}
      </tr>
    ))}
  </tbody>
</table>`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className="text-left py-1.5 px-2 font-semibold uppercase tracking-wide text-muted-foreground">Programa</th>
                <th scope="col" className="text-left py-1.5 px-2 font-semibold uppercase tracking-wide text-muted-foreground">Categoria</th>
                <th scope="col" className="text-left py-1.5 px-2 font-semibold uppercase tracking-wide text-muted-foreground">Valor</th>
                <th scope="col" className="text-left py-1.5 px-2 font-semibold uppercase tracking-wide text-muted-foreground">Qtd</th>
                <th scope="col" className="text-left py-1.5 px-2 font-semibold uppercase tracking-wide text-muted-foreground">Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.slice(0, 3).map((r, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-1.5 px-2 font-medium">{r.name}</td>
                  <td className="py-1.5 px-2 text-muted-foreground">{r.category}</td>
                  <td className="py-1.5 px-2">{r.price}</td>
                  <td className="py-1.5 px-2">{r.stock}</td>
                  <td className="py-1.5 px-2">{r.rating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA COM HOVER ---- */}
      <ComponentPreview
        title="Tabela com Hover"
        description="Destaque visual ao passar o mouse sobre as linhas."
        code={`{/* Hover destacado em primary/5 + cursor pointer */}
<tbody>
  {rows.map((r, i) => (
    <tr key={i} className="border-b border-border hover:bg-primary/5 transition-colors cursor-pointer">
      {/* células */}
    </tr>
  ))}
</tbody>`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className={thClass}>Programa</th>
                <th scope="col" className={thClass}>Categoria</th>
                <th scope="col" className={thClass}>Valor</th>
                <th scope="col" className={thClass}>Qtd</th>
                <th scope="col" className={thClass}>Avaliação</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={`${thClass} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.slice(0, 3).map((r, i) => (
                <tr key={i} className="border-b border-border hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className={`${tdClass} font-medium`}>{r.name}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                  <td className={tdClass}>{r.price}</td>
                  <td className={tdClass}>{r.stock}</td>
                  <td className={tdClass}>{r.rating} ★</td>
                  <td className={tdClass}><StatusBadge status={r.status} /></td>
                  <td className={`${tdClass} text-right`}>
                    <KebabMenu onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA COM CABEÇALHO ESCURO ---- */}
      <ComponentPreview
        title="Tabela com Cabeçalho Destacado"
        description="Cabeçalho com fundo escuro para maior contraste e hierarquia visual."
        code={`{/* Cabeçalho destacado com cor primária */}
<div className="overflow-x-auto rounded-lg overflow-hidden border border-border">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-primary text-primary-foreground">
        <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide">Programa</th>
        {/* ... */}
      </tr>
    </thead>
    <tbody>{/* ... */}</tbody>
  </table>
</div>`}
      >
        <div className="overflow-x-auto rounded-lg overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide">Programa</th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide">Categoria</th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide">Valor</th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide">Status</th>
                <th scope="col" className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.slice(0, 3).map((r, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className={`${tdClass} font-medium`}>{r.name}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                  <td className={tdClass}>{r.price}</td>
                  <td className={tdClass}><StatusBadge status={r.status} /></td>
                  <td className={`${tdClass} text-right`}>
                    <KebabMenu onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA ANINHADA (NESTING) ---- */}
      <ComponentPreview
        title="Tabela Aninhada (Nesting)"
        description="Linhas expansíveis que revelam detalhes adicionais em sub-tabela."
        whenToUse={["Detalhamento de itens", "Variantes de produtos/programas"]}
        code={`import { useState } from "react";
import { ChevronDown } from "lucide-react";

const [expandedRow, setExpandedRow] = useState<number | null>(null);

<tbody>
  {rows.map((r, i) => (
    <Fragment key={i}>
      <tr
        onClick={() => setExpandedRow(expandedRow === i ? null : i)}
        className="border-b border-border hover:bg-muted/20 cursor-pointer"
      >
        <td className={tdClass}>{r.name}</td>
        {/* ...demais colunas... */}
        <td className={tdClass}>
          <ChevronDown size={16} className={\`transition-transform \${expandedRow === i ? "rotate-180" : ""}\`} />
        </td>
      </tr>
      {expandedRow === i && (
        <tr className="bg-muted/20">
          <td colSpan={7} className="p-4">
            {/* Sub-tabela com detalhamento */}
            <table className="w-full text-xs">
              <thead><tr><th>Variante</th><th>Região</th></tr></thead>
              <tbody><tr><td>Regional Norte</td><td>CE</td></tr></tbody>
            </table>
          </td>
        </tr>
      )}
    </Fragment>
  ))}
</tbody>`}
      >
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th scope="col" className={thClass}>Programa</th>
                <th scope="col" className={thClass}>Categoria</th>
                <th scope="col" className={thClass}>Valor</th>
                <th scope="col" className={thClass}>Qtd</th>
                <th scope="col" className={thClass}>Avaliação</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={`${thClass} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts.slice(0, 3).map((r, i) => (
                <>
                  <tr
                    key={`row-${i}`}
                    className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                  >
                    <td className={`${tdClass} font-medium flex items-center gap-2`}>
                      <ChevronRight size={14} className={`transition-transform text-muted-foreground ${expandedRow === i ? "rotate-90" : ""}`} />
                      {r.name}
                    </td>
                    <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                    <td className={tdClass}>{r.price}</td>
                    <td className={tdClass}>{r.stock}</td>
                    <td className={tdClass}>{r.rating} ★</td>
                    <td className={tdClass}><StatusBadge status={r.status} /></td>
                    <td className={`${tdClass} text-right`}>
                      <KebabMenu onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
                    </td>
                  </tr>
                  {expandedRow === i && (
                    <tr key={`detail-${i}`} className="bg-muted/20">
                      <td colSpan={7} className="p-4">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Variante</th>
                              <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Região</th>
                              <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Código</th>
                              <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Qtd</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/50">
                              <td className="py-2 px-3">Regional Norte</td>
                              <td className="py-2 px-3">Norte</td>
                              <td className="py-2 px-3 font-mono text-muted-foreground">{r.name}-N-001</td>
                              <td className="py-2 px-3">80</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-3">Regional Sudeste</td>
                              <td className="py-2 px-3">Sudeste</td>
                              <td className="py-2 px-3 font-mono text-muted-foreground">{r.name}-SE-002</td>
                              <td className="py-2 px-3">120</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA COM CAPTION ---- */}
      <ComponentPreview
        title="Tabela com Caption"
        description="Caption visível para contextualizar o conteúdo da tabela — essencial para acessibilidade."
        code={`{/* Caption visível posicionado no rodapé via caption-bottom */}
<table className="w-full text-sm">
  <thead>{/* ... */}</thead>
  <tbody>{/* ... */}</tbody>
  <caption className="caption-bottom mt-3 text-xs text-muted-foreground text-left">
    Lista de programas educacionais do __BRAND_NAME__
  </caption>
</table>`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className={thClass}>Programa</th>
                <th scope="col" className={thClass}>Categoria</th>
                <th scope="col" className={thClass}>Valor</th>
                <th scope="col" className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableProducts2.slice(0, 3).map((r, i) => (
                <tr key={i} className="border-b border-border">
                  <td className={`${tdClass} font-medium`}>{r.name}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
                  <td className={tdClass}>{r.price}</td>
                  <td className={tdClass}><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
            <caption className="caption-bottom mt-3 text-xs text-muted-foreground text-left">
              Lista de programas educacionais do __BRAND_NAME__
            </caption>
          </table>
        </div>
      </ComponentPreview>

      {/* ---- TABELA COM CHECKBOX E SELEÇÃO ---- */}
      <ComponentPreview
        title="Tabela com Seleção (Checkbox)"
        description="Tabela com checkboxes para seleção múltipla e ações em lote."
        whenToUse={["Exclusão em lote", "Exportação selecionada", "Ações em massa"]}
        code={`import { useState } from "react";
import { Trash2, Download } from "lucide-react";

const [selected, setSelected] = useState<number[]>([]);
const allSelected = selected.length === data.length;
const toggleAll = () => setSelected(allSelected ? [] : data.map((_, i) => i));
const toggle = (i: number) =>
  setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

{selected.length > 0 && (
  <div className="flex items-center gap-3 mb-3 p-2 bg-primary/5 rounded-lg text-xs">
    <span className="font-medium">{selected.length} item(ns) selecionado(s)</span>
    <button className="flex items-center gap-1 text-destructive hover:underline"><Trash2 size={12} /> Excluir</button>
    <button className="flex items-center gap-1 text-primary hover:underline"><Download size={12} /> Exportar</button>
  </div>
)}

<table className="w-full text-sm">
  <thead>
    <tr className="border-b-2 border-border">
      <th className="py-3 px-4 w-10">
        <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-border" />
      </th>
      <th scope="col" className={thClass}>Programa</th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {data.map((r, i) => (
      <tr key={i} className={\`border-b border-border \${selected.includes(i) ? "bg-primary/5" : "hover:bg-muted/30"}\`}>
        <td className="py-3 px-4">
          <input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="rounded border-border" />
        </td>
        <td className={\`\${tdClass} font-medium\`}>{r.name}</td>
        {/* ... */}
      </tr>
    ))}
  </tbody>
</table>`}
      >
        <TableWithCheckbox />
      </ComponentPreview>
    </>
  );
}

function TableWithCheckbox() {
  const [selected, setSelected] = useState<number[]>([]);
  const data = tableProducts.slice(0, 4);
  const allSelected = selected.length === data.length;

  const toggleAll = () => setSelected(allSelected ? [] : data.map((_, i) => i));
  const toggle = (i: number) => setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const thClass = "text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground";
  const tdClass = "py-3 px-4 text-sm";

  return (
    <div className="overflow-x-auto">
      {selected.length > 0 && (
        <div className="flex items-center gap-3 mb-3 p-2 bg-primary/5 rounded-lg text-xs">
          <span className="font-medium">{selected.length} item(ns) selecionado(s)</span>
          <button className="flex items-center gap-1 text-destructive hover:underline"><Trash2 size={12} /> Excluir</button>
          <button className="flex items-center gap-1 text-primary hover:underline"><Download size={12} /> Exportar</button>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="py-3 px-4 w-10">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-border" />
            </th>
            <th scope="col" className={thClass}>Programa</th>
            <th scope="col" className={thClass}>Categoria</th>
            <th scope="col" className={thClass}>Valor</th>
            <th scope="col" className={thClass}>Status</th>
            <th scope="col" className={`${thClass} text-right`}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className={`border-b border-border transition-colors ${selected.includes(i) ? "bg-primary/5" : "hover:bg-muted/30"}`}>
              <td className="py-3 px-4">
                <input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="rounded border-border" />
              </td>
              <td className={`${tdClass} font-medium`}>{r.name}</td>
              <td className={`${tdClass} text-muted-foreground`}>{r.category}</td>
              <td className={tdClass}>{r.price}</td>
              <td className={tdClass}><StatusBadge status={r.status} /></td>
              <td className={`${tdClass} text-right`}>
                <KebabMenu onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==================== ACCORDION ==================== */
function AccordionSection() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { title: "O que é o __BRAND_SHORT__?", content: "O __BRAND_SHORT__ é uma instituição que oferece serviços, capacitação e atendimento ao seu público por canais digitais e presenciais." },
    { title: "Como o __BRAND_SHORT__ apoia o meu negócio?", content: "Por meio de cursos, consultorias, eventos, programas de inovação como AGI e Programa Inova, além de orientação para formalização do MEI e acesso a crédito e novos mercados." },
    { title: "Quais programas e soluções estão disponíveis?", content: "Empreender, AGI (Agentes de Inovação), Programa Inova, Mais Produtividade, Elas Empreendem, Compras Públicas, Visita Técnica e Primeiro Negócio, entre outras soluções para pequenos negócios." },
  ];

  return (
    <ComponentPreview
      title="Accordion"
      description="Seções colapsáveis para FAQ, informações complementares e organização de conteúdo."
      whenToUse={["FAQ", "Conteúdo secundário ou complementar"]}
      accessibility={["aria-expanded no botão", "aria-controls referenciando o painel", "Tecla Enter/Space para abrir/fechar"]}
      code={`import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  { title: "O que é o __BRAND_SHORT__?", content: "O __BRAND_SHORT__ é uma instituição que oferece serviços..." },
  { title: "Como o __BRAND_SHORT__ apoia o meu negócio?", content: "Por meio de cursos, consultorias, eventos..." },
  { title: "Quais programas e soluções estão disponíveis?", content: "Empreender, AGI, Programa Inova, Mais Produtividade..." },
];
const [open, setOpen] = useState<number | null>(0);

<div className="border border-border rounded-lg divide-y divide-border">
  {items.map((item, i) => (
    <div key={i}>
      <button
        onClick={() => setOpen(open === i ? null : i)}
        aria-expanded={open === i}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-left hover:bg-muted/30 transition-colors"
      >
        {item.title}
        <ChevronDown size={16} className={\`transition-transform \${open === i ? "rotate-180" : ""}\`} />
      </button>
      {open === i && (
        <div className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in">
          {item.content}
        </div>
      )}
    </div>
  ))}
</div>`}
    >
      <div className="border border-border rounded-lg divide-y divide-border">
        {items.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between p-4 text-sm font-medium text-left hover:bg-muted/30 transition-colors"
            >
              {item.title}
              <ChevronDown size={16} className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </ComponentPreview>
  );
}

/* ==================== TABS ==================== */
function TabsSection() {
  const [tab, setTab] = useState(0);
  const tabs = ["Visão geral", "Detalhes", "Histórico"];

  return (
    <ComponentPreview
      title="Tabs"
      description="Navegação entre painéis de conteúdo."
      whenToUse={["Organizar conteúdo em categorias na mesma página"]}
      accessibility={["role='tablist' no container", "role='tab' em cada aba", "role='tabpanel' no conteúdo", "aria-selected na aba ativa", "Navegação por setas horizontais"]}
      code={`import { useState } from "react";

const tabs = ["Visão geral", "Detalhes", "Histórico"];
const [tab, setTab] = useState(0);

<div>
  <div role="tablist" className="flex border-b border-border mb-4">
    {tabs.map((t, i) => (
      <button
        key={t}
        role="tab"
        aria-selected={tab === i}
        onClick={() => setTab(i)}
        className={\`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px \${
          tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
        }\`}
      >
        {t}
      </button>
    ))}
  </div>
  <div role="tabpanel" className="text-sm text-muted-foreground animate-fade-in">
    {tab === 0 && <p>Visão geral do programa com indicadores principais e resumo executivo.</p>}
    {tab === 1 && <p>Detalhes técnicos, cronograma de execução e lista de responsáveis.</p>}
    {tab === 2 && <p>Histórico de alterações, datas e registros de auditoria.</p>}
  </div>
</div>`}
    >
      <div>
        <div role="tablist" className="flex border-b border-border mb-4">
          {tabs.map((t, i) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="text-sm text-muted-foreground animate-fade-in">
          {tab === 0 && <p>Visão geral do programa com indicadores principais e resumo executivo.</p>}
          {tab === 1 && <p>Detalhes técnicos, cronograma de execução e lista de responsáveis.</p>}
          {tab === 2 && <p>Histórico de alterações, datas e registros de auditoria.</p>}
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== MODAL ==================== */
function ModalSection() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Foco inicial dentro do modal
    initialFocusRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        // Focus trap
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      // Retorna o foco ao trigger
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <ComponentPreview
      title="Modal"
      description="Diálogo sobreposição para ações que exigem atenção."
      whenToUse={["Confirmação de ações destrutivas", "Formulários rápidos", "Alertas importantes"]}
      whenNotToUse={["Conteúdo extenso (use página)", "Informações não-urgentes (use inline)"]}
      accessibility={["Fechar com ESC", "Focus trap dentro do modal", "aria-modal='true'", "Retornar foco ao trigger ao fechar"]}
      code={`// Modal implementado em React com focus trap, Escape para fechar
// e retorno de foco ao trigger ao desmontar.
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

function Modal() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    initialFocusRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">
        Abrir Modal
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
          style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          <div className="fixed inset-0 bg-foreground/40" />
          <div
            ref={dialogRef}
            className="relative bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-border">
              <h3 id="modal-title" className="font-semibold text-base sm:text-lg leading-tight" style={{ fontFamily: "'__FONT_SYSTEM__', sans-serif" }}>Confirmar ação</h3>
              <button ref={initialFocusRef} onClick={() => setOpen(false)} aria-label="Fechar"
                className="p-1.5 hover:bg-muted rounded transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <X size={18} />
              </button>
            </div>
            <div className="px-4 sm:px-5 py-4 overflow-y-auto">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Tem certeza de que deseja prosseguir com esta ação? Esta operação não pode ser desfeita.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t border-border">
              <button onClick={() => setOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-border rounded hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button onClick={() => setOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}`}
    >
      <div>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium"
        >
          Abrir Modal
        </button>

        {open && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setOpen(false)}
            style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            <div className="fixed inset-0 bg-foreground/40" />
            <div
              ref={dialogRef}
              className="relative bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-fade-in"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-border">
                <h3 id="modal-title" className="font-semibold text-base sm:text-lg leading-tight">Confirmar ação</h3>
                <button ref={initialFocusRef} onClick={() => setOpen(false)} aria-label="Fechar" className="p-1.5 hover:bg-muted rounded transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X size={18} />
                </button>
              </div>
              <div className="px-4 sm:px-5 py-4 overflow-y-auto">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Tem certeza de que deseja prosseguir com esta ação? Esta operação não pode ser desfeita.</p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t border-border">
                <button onClick={() => setOpen(false)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-border rounded hover:bg-muted transition-colors">Cancelar</button>
                <button onClick={() => setOpen(false)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ComponentPreview>
  );
}

/* ==================== TOAST ==================== */
function ToastSection() {
  const [showToast, setShowToast] = useState(false);

  return (
    <ComponentPreview
      title="Toast"
      description="Notificação temporária que aparece no canto da tela."
      whenToUse={["Confirmação de ações", "Feedback não-bloqueante"]}
      whenNotToUse={["Erros que exigem ação do usuário (use Alert inline)"]}
      accessibility={["role='status' ou aria-live='polite'", "Tempo suficiente para leitura (mín. 5s)", "Botão de fechar acessível"]}
      code={`import { useState } from "react";
import { Check, X } from "lucide-react";

const [showToast, setShowToast] = useState(false);

<div>
  <button
    onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 4000); }}
    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium"
  >
    Exibir Toast
  </button>
  {showToast && (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in" role="status" aria-live="polite">
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm">
        <Check size={18} className="text-success shrink-0" />
        <p className="text-sm flex-1">Registro salvo com sucesso!</p>
        <button onClick={() => setShowToast(false)} aria-label="Fechar" className="p-0.5 hover:bg-muted rounded">
          <X size={14} />
        </button>
      </div>
    </div>
  )}
</div>`}
    >
      <div>
        <button
          onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 4000); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium"
        >
          Exibir Toast
        </button>
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in" role="status" aria-live="polite">
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm">
              <Check size={18} className="text-success shrink-0" />
              <p className="text-sm flex-1">Registro salvo com sucesso!</p>
              <button onClick={() => setShowToast(false)} aria-label="Fechar" className="p-0.5 hover:bg-muted rounded">
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </ComponentPreview>
  );
}

/* ==================== BREADCRUMB ==================== */
function BreadcrumbSection() {
  return (
    <ComponentPreview
      title="Breadcrumb"
      description="Navegação hierárquica indicando localização."
      whenToUse={["Páginas com hierarquia profunda", "Painéis administrativos"]}
      accessibility={["nav com aria-label='Breadcrumb'", "aria-current='page' no item atual"]}
      code={`import { ChevronRight } from "lucide-react";

<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-1 text-sm">
    <li><a href="#" className="text-primary hover:underline">Início</a></li>
    <li><ChevronRight size={14} className="text-muted-foreground" /></li>
    <li><a href="#" className="text-primary hover:underline">Programas</a></li>
    <li><ChevronRight size={14} className="text-muted-foreground" /></li>
    <li className="text-muted-foreground" aria-current="page">Empreender</li>
  </ol>
</nav>`}
    >
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm">
          <li><a href="#" className="text-primary hover:underline">Início</a></li>
          <li><ChevronRight size={14} className="text-muted-foreground" /></li>
          <li><a href="#" className="text-primary hover:underline">Programas</a></li>
          <li><ChevronRight size={14} className="text-muted-foreground" /></li>
          <li className="text-muted-foreground" aria-current="page">Empreender</li>
        </ol>
      </nav>
    </ComponentPreview>
  );
}

/* ==================== PAGINATION ==================== */
function PaginationSection() {
  const [page, setPage] = useState(1);
  return (
    <div className="space-y-8">
      <ComponentPreview
        title="Paginação Numérica"
        description="Navegação entre páginas de resultados utilizando botões numéricos."
        whenToUse={["Listagens com muitos itens", "Resultados de busca"]}
        accessibility={["nav com aria-label='Paginação'", "aria-current='page' na página atual"]}
        code={`import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const [page, setPage] = useState(1);

<nav aria-label="Paginação" className="flex items-center gap-1">
  <button
    onClick={() => setPage(Math.max(1, page - 1))}
    disabled={page === 1}
    className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30"
    aria-label="Página anterior"
  >
    <ArrowLeft size={16} />
  </button>
  {[1, 2, 3, 4, 5].map(p => (
    <button
      key={p}
      onClick={() => setPage(p)}
      aria-current={page === p ? "page" : undefined}
      className={\`w-9 h-9 rounded text-sm font-medium transition-colors \${
        page === p ? "bg-primary text-primary-foreground" : "hover:bg-muted"
      }\`}
    >
      {p}
    </button>
  ))}
  <button
    onClick={() => setPage(Math.min(5, page + 1))}
    disabled={page === 5}
    className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30"
    aria-label="Próxima página"
  >
    <ArrowRight size={16} />
  </button>
</nav>`}
      >
        <nav aria-label="Paginação" className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30"
            aria-label="Página anterior"
          >
            <ArrowLeft size={16} />
          </button>
          {[1, 2, 3, 4, 5].map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-current={page === p ? "page" : undefined}
              className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                page === p ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(5, page + 1))}
            disabled={page === 5}
            className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30"
            aria-label="Próxima página"
          >
            <ArrowRight size={16} />
          </button>
        </nav>
      </ComponentPreview>

      <ComponentPreview
        title="Paginação de Contador"
        description="Modelo simplificado que exibe a posição atual em relação ao total de páginas (ex: 1 de 10)."
        whenToUse={["Interfaces mobile", "Layouts compactos", "Quando o número exato de páginas é muito alto"]}
        code={`import { ChevronDown } from "lucide-react";

<nav aria-label="Paginação de contador" className="flex items-center gap-4 bg-muted/20 p-2 rounded-lg border border-border w-fit">
  <button
    onClick={() => setPage(Math.max(1, page - 1))}
    disabled={page === 1}
    className="p-1.5 rounded bg-background border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
    aria-label="Voltar página"
  >
    <ChevronDown size={18} className="rotate-90" />
  </button>

  <div className="flex items-center gap-2 min-w-[60px] justify-center">
    <span className="text-sm font-bold text-primary">{page}</span>
    <span className="text-xs text-muted-foreground font-medium italic">de</span>
    <span className="text-sm font-bold text-foreground">10</span>
  </div>

  <button
    onClick={() => setPage(Math.min(10, page + 1))}
    disabled={page === 10}
    className="p-1.5 rounded bg-background border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
    aria-label="Avançar página"
  >
    <ChevronDown size={18} className="-rotate-90" />
  </button>
</nav>`}
      >
        <nav aria-label="Paginação de contador" className="flex items-center gap-4 bg-muted/20 p-2 rounded-lg border border-border w-fit">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1.5 rounded bg-background border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            aria-label="Voltar página"
          >
            <ChevronDown size={18} className="rotate-90" />
          </button>
          
          <div className="flex items-center gap-2 min-w-[60px] justify-center">
            <span className="text-sm font-bold text-primary">{page}</span>
            <span className="text-xs text-muted-foreground font-medium italic">de</span>
            <span className="text-sm font-bold text-foreground">10</span>
          </div>

          <button
            onClick={() => setPage(Math.min(10, page + 1))}
            disabled={page === 10}
            className="p-1.5 rounded bg-background border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            aria-label="Avançar página"
          >
            <ChevronDown size={18} className="-rotate-90" />
          </button>
        </nav>
      </ComponentPreview>
    </div>
  );
}

/* ==================== TOOLTIP ==================== */
function TooltipSection() {
  return (
    <ComponentPreview
      title="Tooltip"
      description="Informação contextual ao passar o mouse."
      whenToUse={["Explicar ícones sem label", "Informações complementares breves"]}
      whenNotToUse={["Informação essencial (deve estar visível)", "Conteúdo longo (use popover)"]}
      accessibility={["Use aria-describedby ou title", "Acessível via focus de teclado também"]}
      code={`import { Eye, Copy } from "lucide-react";

<div className="flex gap-4">
  <div className="relative group">
    <button className="p-2 border border-border rounded hover:bg-muted transition-colors">
      <Eye size={16} />
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
      <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
        Visualizar detalhes
      </div>
    </div>
  </div>
  <div className="relative group">
    <button className="p-2 border border-border rounded hover:bg-muted transition-colors">
      <Copy size={16} />
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
      <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
        Copiar
      </div>
    </div>
  </div>
</div>`}
    >
      <div className="flex gap-4">
        <div className="relative group">
          <button className="p-2 border border-border rounded hover:bg-muted transition-colors">
            <Eye size={16} />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
            <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
              Visualizar detalhes
            </div>
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 border border-border rounded hover:bg-muted transition-colors">
            <Copy size={16} />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
            <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
              Copiar
            </div>
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== SKELETON ==================== */
function SkeletonSection() {
  return (
    <ComponentPreview
      title="Skeleton"
      description="Placeholder visual durante carregamento de conteúdo."
      whenToUse={["Carregamento de dados assíncronos", "Primeira renderização de componentes"]}
      code={`<div className="space-y-4">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
    </div>
  </div>
  <div className="h-4 bg-muted rounded animate-pulse" />
  <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
  <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
  <div className="h-32 bg-muted rounded-lg animate-pulse" />
</div>`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </div>
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
        <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
      </div>
    </ComponentPreview>
  );
}

/* ==================== SPINNER ==================== */
function SpinnerSection() {
  return (
    <ComponentPreview
      title="Spinner"
      description="Indicador de carregamento em andamento."
      whenToUse={["Ações assíncronas", "Carregamento de página"]}
      accessibility={["Use aria-label ou texto visível", "role='status' com sr-only text"]}
      code={`import { Loader2 } from "lucide-react";

<div className="flex items-center gap-6">
  <div className="flex flex-col items-center gap-2">
    <Loader2 size={20} className="animate-spin text-primary" />
    <span className="text-xs text-muted-foreground">SM</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <Loader2 size={28} className="animate-spin text-primary" />
    <span className="text-xs text-muted-foreground">MD</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <Loader2 size={40} className="animate-spin text-primary" />
    <span className="text-xs text-muted-foreground">LG</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <Loader2 size={28} className="animate-spin text-secondary" />
    <span className="text-xs text-muted-foreground">Secundário</span>
  </div>
</div>`}
    >
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">SM</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={28} className="animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">MD</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={40} className="animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">LG</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={28} className="animate-spin text-secondary" />
          <span className="text-xs text-muted-foreground">Secundário</span>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== EMPTY STATE ==================== */
function EmptyStateSection() {
  return (
    <ComponentPreview
      title="Empty State"
      description="Estado quando não há dados para exibir."
      whenToUse={["Listas vazias", "Resultados de busca sem retorno", "Primeiro uso de funcionalidade"]}
      code={`import { Inbox, Search } from "lucide-react";

<div className="text-center py-12 border border-dashed border-border rounded-lg">
  <Inbox size={48} className="mx-auto text-muted-foreground/50 mb-4" />
  <h4 className="font-semibold mb-1">Nenhum resultado encontrado</h4>
  <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
    Tente ajustar os filtros de busca ou verifique se os dados foram carregados corretamente.
  </p>
  <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">
    <Search size={14} /> Nova busca
  </button>
</div>`}
    >
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <Inbox size={48} className="mx-auto text-muted-foreground/50 mb-4" />
        <h4 className="font-semibold mb-1">Nenhum resultado encontrado</h4>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
          Tente ajustar os filtros de busca ou verifique se os dados foram carregados corretamente.
        </p>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">
          <Search size={14} /> Nova busca
        </button>
      </div>
    </ComponentPreview>
  );
}

/* ==================== DROPDOWN MENU ==================== */
function DropdownMenuSection() {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <ComponentPreview
      title="Dropdown Menu"
      description="Menu contextual de ações acionado por botão, ícone ou contexto. Suporta itens, separadores, ícones e estados disabled."
      whenToUse={["Agrupar ações secundárias", "Menus de contexto (ações por item em tabelas)", "Opções de configuração"]}
      whenNotToUse={["Navegação principal (use sidebar ou tabs)", "Seleção de valor (use Select)"]}
      accessibility={["role='menu' no container", "role='menuitem' em cada item", "Fechar com ESC", "Navegação por setas ↑↓", "aria-haspopup='true' no trigger"]}
      code={`import { useState } from "react";
import { ChevronDown, Edit, Copy, Share2, Download, Trash2, MoreVertical, Eye } from "lucide-react";

const [open, setOpen] = useState(false);

{/* Dropdown com botão texto */}
<div className="relative">
  <button
    onClick={() => setOpen(!open)}
    aria-haspopup="true"
    aria-expanded={open}
    className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors"
  >
    Ações <ChevronDown size={14} className={\`transition-transform \${open ? "rotate-180" : ""}\`} />
  </button>
  {open && (
    <div role="menu" className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-20 animate-fade-in" onMouseLeave={() => setOpen(false)}>
      {[
        { icon: <Edit size={14} />, label: "Editar" },
        { icon: <Copy size={14} />, label: "Duplicar" },
        { icon: <Share2 size={14} />, label: "Compartilhar" },
        { icon: <Download size={14} />, label: "Exportar" },
      ].map(item => (
        <button key={item.label} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left">
          <span className="text-muted-foreground">{item.icon}</span> {item.label}
        </button>
      ))}
      <div className="h-px bg-border my-1" />
      <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-error/10 text-error text-left">
        <Trash2 size={14} /> Excluir
      </button>
    </div>
  )}
</div>

{/* Dropdown com ícone trigger */}
<button aria-haspopup="true" aria-label="Menu de ações" className="p-2 border border-border rounded hover:bg-muted transition-colors">
  <MoreVertical size={16} />
</button>`}
    >
      <div className="flex flex-wrap gap-6 items-start">
        {/* Dropdown com botão texto */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            aria-haspopup="true"
            aria-expanded={open}
            className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors"
          >
            Ações <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div
              role="menu"
              className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-20 animate-fade-in"
              onMouseLeave={() => setOpen(false)}
            >
              {[
                { icon: <Edit size={14} />, label: "Editar", action: "edit" },
                { icon: <Copy size={14} />, label: "Duplicar", action: "duplicate" },
                { icon: <Share2 size={14} />, label: "Compartilhar", action: "share" },
                { icon: <Download size={14} />, label: "Exportar", action: "export" },
              ].map(item => (
                <button
                  key={item.action}
                  role="menuitem"
                  onClick={() => { setSelectedAction(item.label); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                >
                  <span className="text-muted-foreground">{item.icon}</span> {item.label}
                </button>
              ))}
              <div className="h-px bg-border my-1" />
              <button
                role="menuitem"
                onClick={() => { setSelectedAction("Excluir"); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-error/10 text-error transition-colors text-left"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>

        {/* Dropdown com ícone */}
        <DropdownIconDemo />

        {selectedAction && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
            <Check size={14} className="text-success" /> Ação selecionada: <strong className="text-foreground">{selectedAction}</strong>
          </div>
        )}
      </div>
    </ComponentPreview>
  );
}

function DropdownIconDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menu de ações"
        className="p-2 border border-border rounded hover:bg-muted transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-20 animate-fade-in"
          onMouseLeave={() => setOpen(false)}
        >
          <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left">
            <Eye size={14} className="text-muted-foreground" /> Visualizar
          </button>
          <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left">
            <Edit size={14} className="text-muted-foreground" /> Editar
          </button>
          <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left text-error hover:bg-error/10">
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}

/* ==================== DATEPICKER ==================== */
function DatePickerSection() {
  return <DatePickerSectionInner />;
}

/* ==================== MENU KEBAB ==================== */
function MenuKebabSection() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <ComponentPreview
      title="Menu Kebab"
      description="Botão de ações em formato de três pontos verticais (kebab). Abre um menu compacto, alinhado à direita, com opções por item. Usado em tabelas, cards e listagens."
      whenToUse={["Ações por linha em tabelas", "Ações secundárias em cards", "Menus contextuais por item em listas"]}
      whenNotToUse={["Ação primária única (use Botão)", "Mais de 6 opções (use Dropdown completo)", "Navegação principal"]}
      accessibility={[
        "aria-label='Ações' no botão trigger",
        "aria-haspopup='menu' e aria-expanded sincronizado",
        "role='menu' no container e role='menuitem' em cada opção",
        "Fechar com ESC e clique fora",
        "Item destrutivo (Excluir) com cor text-destructive",
      ]}
      code={`import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

function KebabMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Ações"
        className="p-1.5 rounded-md hover:bg-muted transition-colors"
      >
        <MoreVertical size={16} className="text-muted-foreground" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-8 z-50 min-w-[160px] bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in">
          <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-foreground text-left">
            <Eye size={14} className="text-muted-foreground" /> Visualizar
          </button>
          <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-foreground text-left">
            <Edit size={14} className="text-muted-foreground" /> Editar
          </button>
          <div className="h-px bg-border my-1" />
          <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive text-left">
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}`}
    >
      <div className="flex flex-wrap gap-8 items-start">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Padrão</span>
          <KebabDemo onAction={setLastAction} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Em borda</span>
          <KebabDemo bordered onAction={setLastAction} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Em linha de tabela</span>
          <div className="flex items-center gap-3 border border-border rounded-md px-3 py-2 bg-card">
            <span className="text-sm text-foreground">Programa Elas Empreendem</span>
            <KebabDemo onAction={setLastAction} />
          </div>
        </div>
        {lastAction && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
            <Check size={14} className="text-success" /> Última ação: <strong className="text-foreground">{lastAction}</strong>
          </div>
        )}
      </div>
    </ComponentPreview>
  );
}

function KebabDemo({ bordered = false, onAction }: { bordered?: boolean; onAction: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const triggerCls = bordered
    ? "p-2 border border-border rounded-md hover:bg-muted transition-colors"
    : "p-1.5 rounded-md hover:bg-muted transition-colors";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Ações"
        className={triggerCls}
      >
        <MoreVertical size={16} className="text-muted-foreground" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in">
          <button role="menuitem" onClick={() => { onAction("Visualizar"); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-foreground text-left transition-colors">
            <Eye size={14} className="text-muted-foreground" /> Visualizar
          </button>
          <button role="menuitem" onClick={() => { onAction("Editar"); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-foreground text-left transition-colors">
            <Edit size={14} className="text-muted-foreground" /> Editar
          </button>
          <div className="h-px bg-border my-1" />
          <button role="menuitem" onClick={() => { onAction("Excluir"); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive text-left transition-colors">
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}

/* ==================== DATEPICKER (inner) ==================== */
function DatePickerSectionInner() {
  const [date, setDate] = useState("");
  const [showCal, setShowCal] = useState(false);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [viewMonth, setViewMonth] = useState(currentMonth);
  const [viewYear, setViewYear] = useState(currentYear);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const selectDate = (day: number) => {
    const d = `${String(day).padStart(2, "0")}/${String(viewMonth + 1).padStart(2, "0")}/${viewYear}`;
    setDate(d);
    setShowCal(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <ComponentPreview
      title="DatePicker"
      description="Seleção de data com calendário visual, suporte a formato brasileiro (DD/MM/AAAA), range de datas e integração com formulários."
      whenToUse={["Formulários com campos de data", "Filtros por período", "Agendamento"]}
      whenNotToUse={["Seleção de horário isolado (use TimePicker)", "Datas muito distantes (use input de ano)"]}
      accessibility={["Campo com máscara acessível", "Calendário navegável por teclado", "aria-label nas setas de mês", "Formato de data visível ao usuário"]}
      code={`import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const [date, setDate] = useState("");
const [showCal, setShowCal] = useState(false);
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

{/* DatePicker simples (formato DD/MM/AAAA) */}
<div>
  <label className="block text-sm font-medium mb-1.5">Data de referência</label>
  <div className="relative max-w-xs">
    <input
      type="text"
      value={date}
      onChange={e => setDate(e.target.value)}
      placeholder="DD/MM/AAAA"
      className="w-full border border-input rounded pl-3 pr-10 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
    />
    <button
      onClick={() => setShowCal(!showCal)}
      aria-label="Abrir calendário"
      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
    >
      <Calendar size={16} className="text-muted-foreground" />
    </button>
    {showCal && (
      <div role="dialog" aria-label="Calendário" className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-3 z-20 w-72">
        <div className="flex items-center justify-between mb-3">
          <button aria-label="Mês anterior" className="p-1 hover:bg-muted rounded"><ChevronLeft size={16} /></button>
          <span className="text-sm font-medium">{monthNames[0]} 2026</span>
          <button aria-label="Próximo mês" className="p-1 hover:bg-muted rounded"><ChevronRight size={16} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["D","S","T","Q","Q","S","S"].map((d, i) => (
            <span key={i} className="text-[10px] font-semibold text-muted-foreground py-1">{d}</span>
          ))}
          {Array.from({ length: 31 }, (_, i) => (
            <button key={i} className="aspect-square text-xs rounded hover:bg-primary/10">{i + 1}</button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

{/* Range de datas */}
<div className="flex items-end gap-2 max-w-md">
  <input type="text" placeholder="DD/MM/AAAA" aria-label="Data inicial" className="border border-input rounded px-3 py-2 text-sm" />
  <span className="text-sm text-muted-foreground pb-2">até</span>
  <input type="text" placeholder="DD/MM/AAAA" aria-label="Data final" className="border border-input rounded px-3 py-2 text-sm" />
</div>`}
    >
      <div className="space-y-6">
        {/* DatePicker simples */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Data de referência</label>
          <div className="relative max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full border border-input rounded px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              />
              <button
                onClick={() => setShowCal(!showCal)}
                aria-label="Abrir calendário"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Calendar size={16} />
              </button>
            </div>

            {showCal && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-3 z-30 animate-fade-in w-72">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={prevMonth} aria-label="Mês anterior" className="p-1 hover:bg-muted rounded transition-colors">
                    <ArrowLeft size={16} />
                  </button>
                  <span className="text-sm font-semibold">{monthNames[viewMonth]} {viewYear}</span>
                  <button onClick={nextMonth} aria-label="Próximo mês" className="p-1 hover:bg-muted rounded transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0 text-center text-xs">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                    <div key={d} className="py-1 text-muted-foreground font-medium">{d}</div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === today.getDate() && viewMonth === currentMonth && viewYear === currentYear;
                    return (
                      <button
                        key={day}
                        onClick={() => selectDate(day)}
                        className={`py-1.5 rounded text-sm transition-colors hover:bg-primary hover:text-primary-foreground ${
                          isToday ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date range */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Período (range)</label>
          <div className="flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="date"
                value={rangeStart}
                onChange={e => setRangeStart(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                aria-label="Data inicial"
              />
            </div>
            <span className="text-sm text-muted-foreground">até</span>
            <div className="relative flex-1">
              <input
                type="date"
                value={rangeEnd}
                onChange={e => setRangeEnd(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                aria-label="Data final"
              />
            </div>
          </div>
        </div>

        {/* Preset ranges */}
        <div>
          <p className="text-sm font-medium mb-2">Atalhos de período</p>
          <div className="flex flex-wrap gap-2">
            {["Hoje", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Último trimestre", "Este ano"].map(label => (
              <button key={label} className="px-3 py-1.5 text-xs border border-border rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== FILTROS DINÂMICOS ==================== */
function DynamicFiltersSection() {
  const [status, setStatus] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [searchVal, setSearchVal] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (f: string) => {
    if (!activeFilters.includes(f)) setActiveFilters([...activeFilters, f]);
  };
  const removeFilter = (f: string) => setActiveFilters(activeFilters.filter(x => x !== f));
  const clearAll = () => { setActiveFilters([]); setStatus("todos"); setTipo("todos"); setSearchVal(""); };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    if (val !== "todos") addFilter(`Status: ${val}`);
    else setActiveFilters(prev => prev.filter(f => !f.startsWith("Status:")));
  };
  const handleTipoChange = (val: string) => {
    setTipo(val);
    if (val !== "todos") addFilter(`Tipo: ${val}`);
    else setActiveFilters(prev => prev.filter(f => !f.startsWith("Tipo:")));
  };

  return (
    <ComponentPreview
      title="Filtros Dinâmicos"
      description="Barra de filtros combinados com chips ativos, busca por texto, selects e botão de limpar. Ideal para dashboards e listagens."
      whenToUse={["Listagens com muitos registros", "Dashboards com dados filtráveis", "Relatórios com parâmetros"]}
      whenNotToUse={["Listas com poucos itens (< 10)", "Quando há apenas 1 critério (use busca simples)"]}
      accessibility={["Labels em todos os campos", "Chips removíveis com aria-label", "Anunciar quantidade de filtros ativos via aria-live"]}
      code={`import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

const [activeFilters, setActiveFilters] = useState<string[]>([]);
const [status, setStatus] = useState("todos");
const [searchVal, setSearchVal] = useState("");

{/* Barra de filtros */}
<div className="flex flex-wrap gap-3 items-end" role="search" aria-label="Filtros de listagem">
  <div className="flex-1 min-w-[200px]">
    <label className="block text-xs font-medium mb-1 text-muted-foreground">Buscar</label>
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={searchVal}
        onChange={e => setSearchVal(e.target.value)}
        placeholder="Nome, código, município..."
        className="w-full border border-input rounded pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  </div>
  <div>
    <label className="block text-xs font-medium mb-1 text-muted-foreground">Status</label>
    <select value={status} onChange={e => setStatus(e.target.value)} className="border border-input rounded px-3 py-2 text-sm bg-background">
      <option value="todos">Todos</option>
      <option value="Ativo">Ativo</option>
      <option value="Pendente">Pendente</option>
    </select>
  </div>
  <button className="inline-flex items-center gap-1.5 border border-border px-3 py-2 rounded text-sm hover:bg-muted">
    <Filter size={14} /> Mais filtros
  </button>
</div>

{/* Chips de filtros ativos */}
{activeFilters.length > 0 && (
  <div className="flex flex-wrap gap-2 items-center" aria-live="polite">
    <span className="text-xs text-muted-foreground">{activeFilters.length} filtro(s) ativo(s):</span>
    {activeFilters.map(f => (
      <span key={f} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
        {f}
        <button onClick={() => setActiveFilters(activeFilters.filter(x => x !== f))} aria-label={\`Remover filtro \${f}\`} className="hover:bg-primary/20 rounded-full p-0.5">
          <X size={12} />
        </button>
      </span>
    ))}
    <button onClick={() => setActiveFilters([])} className="text-xs text-error hover:underline ml-1">Limpar todos</button>
  </div>
)}`}
    >
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 items-end" role="search" aria-label="Filtros de listagem">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Buscar</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Nome, código, município..."
                className="w-full border border-input rounded pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Status</label>
            <select
              value={status}
              onChange={e => handleStatusChange(e.target.value)}
              className="border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Pendente">Pendente</option>
              <option value="Inativo">Inativo</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Programa</label>
            <select
              value={tipo}
              onChange={e => handleTipoChange(e.target.value)}
              className="border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="todos">Todos</option>
              <option value="Empreender">Empreender</option>
              <option value="Programa Inova">Programa Inova</option>
              <option value="Primeiro Negócio">Primeiro Negócio</option>
              <option value="Visita Técnica">Visita Técnica</option>
            </select>
          </div>
          <button className="inline-flex items-center gap-1.5 border border-border px-3 py-2 rounded text-sm hover:bg-muted transition-colors">
            <Filter size={14} /> Mais filtros
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center" aria-live="polite">
            <span className="text-xs text-muted-foreground">{activeFilters.length} filtro(s) ativo(s):</span>
            {activeFilters.map(f => (
              <span key={f} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                {f}
                <button onClick={() => removeFilter(f)} aria-label={`Remover filtro ${f}`} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
            <button onClick={clearAll} className="text-xs text-error hover:underline ml-1">Limpar todos</button>
          </div>
        )}

        {/* Example result count */}
        <div className="text-sm text-muted-foreground border-t border-border pt-3">
          Exibindo <strong className="text-foreground">247</strong> resultados
          {activeFilters.length > 0 && <> com {activeFilters.length} filtro(s) aplicado(s)</>}
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== BIG NUMBERS / KPIs ==================== */
function BigNumbersSection() {
  return (
    <ComponentPreview
      title="Big Numbers / KPIs"
      description="Cards de destaque com indicadores numéricos grandes, variação percentual, ícone contextual e trend visual."
      whenToUse={["Dashboards e painéis gerenciais", "Resumos executivos", "Telas iniciais de módulos"]}
      whenNotToUse={["Dados que precisam de contexto tabular", "Valores sem significado isolado"]}
      accessibility={["aria-label descritivo no card", "Não depender apenas de cor para trend (usar ↑↓ e texto)"]}
      code={`import { Users, DollarSign, Clock, BarChart3, TrendingUp, TrendingDown } from "lucide-react";

const kpis = [
  { icon: <Users size={20} />, value: "12.847", label: "Empresas atendidas", trend: "+12,3%", up: true, comparison: "vs. 11.436 mês anterior", color: "text-primary bg-primary/10" },
  { icon: <DollarSign size={20} />, value: "R$ 847M", label: "Recursos transferidos", trend: "+8,7%", up: true, comparison: "vs. R$ 779M trimestre anterior", color: "text-success bg-success-bg" },
  { icon: <Clock size={20} />, value: "23", label: "Pendências", trend: "-15,4%", up: false, comparison: "vs. 27 semana anterior", color: "text-warning bg-warning-bg" },
  { icon: <BarChart3 size={20} />, value: "94,2%", label: "Taxa de execução", trend: "+2,1%", up: true, comparison: "Meta: 95%", color: "text-info bg-info-bg" },
];

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {kpis.map((kpi, i) => (
    <div key={i} className="bg-card border border-border rounded-lg p-5" aria-label={\`\${kpi.label}: \${kpi.value}\`}>
      <div className="flex items-center justify-between mb-3">
        <span className={\`p-2 rounded-lg \${kpi.color}\`}>{kpi.icon}</span>
        <span className={\`inline-flex items-center gap-1 text-xs font-semibold \${kpi.up ? "text-success" : "text-error"}\`}>
          {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {kpi.trend}
        </span>
      </div>
      <p className="text-3xl font-bold text-foreground leading-none mb-1">{kpi.value}</p>
      <p className="text-sm text-muted-foreground">{kpi.label}</p>
      <p className="text-xs text-muted-foreground/70 mt-2">{kpi.comparison}</p>
    </div>
  ))}
</div>

{/* Variante compacta inline */}
<div className="flex flex-wrap gap-4 mt-6">
  {[
    { value: "5.423", label: "Municípios", trend: "↑ 2%" },
    { value: "R$ 1,2B", label: "Orçamento anual", trend: "→ 0%" },
    { value: "326", label: "Projetos ativos", trend: "↑ 18%" },
  ].map((item, i) => (
    <div key={i} className="flex items-baseline gap-2 bg-muted px-4 py-2 rounded-lg">
      <span className="text-xl font-bold text-foreground">{item.value}</span>
      <span className="text-xs text-muted-foreground">{item.label}</span>
      <span className="text-xs font-medium text-success">{item.trend}</span>
    </div>
  ))}
</div>`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Users size={20} />, value: "12.847", label: "Empresas atendidas", trend: "+12,3%", up: true, comparison: "vs. 11.436 mês anterior", color: "text-primary bg-primary/10" },
          { icon: <DollarSign size={20} />, value: "R$ 847M", label: "Recursos transferidos", trend: "+8,7%", up: true, comparison: "vs. R$ 779M no trimestre anterior", color: "text-success bg-success-bg" },
          { icon: <Clock size={20} />, value: "23", label: "Pendências", trend: "-15,4%", up: false, comparison: "vs. 27 semana anterior", color: "text-warning bg-warning-bg" },
          { icon: <BarChart3 size={20} />, value: "94,2%", label: "Taxa de execução", trend: "+2,1%", up: true, comparison: "Meta: 95%", color: "text-info bg-info-bg" },
        ].map((kpi, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-5" aria-label={`${kpi.label}: ${kpi.value}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-lg ${kpi.color}`}>{kpi.icon}</span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${kpi.up ? "text-success" : "text-error"}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground leading-none mb-1">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-xs text-muted-foreground/70 mt-2">{kpi.comparison}</p>
          </div>
        ))}
      </div>

      {/* Inline compact variant */}
      <div className="mt-6">
        <p className="text-sm font-medium mb-3">Variante compacta (inline)</p>
        <div className="flex flex-wrap gap-4">
          {[
            { value: "5.423", label: "Municípios", trend: "↑ 2%" },
            { value: "R$ 1,2B", label: "Orçamento anual", trend: "→ 0%" },
            { value: "326", label: "Projetos ativos", trend: "↑ 18%" },
          ].map((item, i) => (
            <div key={i} className="flex items-baseline gap-2 bg-muted px-4 py-2 rounded-lg">
              <span className="text-xl font-bold text-foreground">{item.value}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-xs font-medium text-success">{item.trend}</span>
            </div>
          ))}
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== UPLOAD EM MASSA ==================== */
function BulkUploadSection() {
  const [files, setFiles] = useState<{ name: string; size: string; progress: number; status: "uploading" | "done" | "error" }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((fileNames: string[]) => {
    const newFiles = fileNames.map(name => ({
      name,
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      progress: 0,
      status: "uploading" as const,
    }));
    setFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach((file, idx) => {
      const startIdx = files.length + idx;
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map((f, i) => i === startIdx ? { ...f, progress: 100, status: Math.random() > 0.15 ? "done" : "error" } : f));
        } else {
          setFiles(prev => prev.map((f, i) => i === startIdx ? { ...f, progress: Math.min(progress, 99) } : f));
        }
      }, 300 + Math.random() * 400);
    });
  }, [files.length]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const names = Array.from(e.dataTransfer.files).map(f => f.name);
    if (names.length) simulateUpload(names);
  };

  const handleFileSelect = () => {
    simulateUpload(["relatorio_2026.pdf", "planilha_dados.xlsx", "comprovante_003.pdf", "foto_evento.jpg"]);
  };

  return (
    <ComponentPreview
      title="Upload em Massa com Progresso"
      description="Área de drag-and-drop para múltiplos arquivos com barra de progresso individual, status por item e feedback visual."
      whenToUse={["Envio de documentos comprobatórios", "Importação de planilhas", "Upload de fotos de obras"]}
      whenNotToUse={["Upload de arquivo único simples (use input type=file)", "Dados que cabem em formulário (use campos textuais)"]}
      accessibility={["Área de drop com role e aria-label", "Progresso anunciado via aria-valuenow", "Status por arquivo em texto, não só cor"]}
      code={`import { useState, useRef } from "react";
import { UploadCloud, File, CheckCircle2, XCircle, X } from "lucide-react";

type UploadFile = { name: string; size: string; progress: number; status: "uploading" | "done" | "error" };
const [files, setFiles] = useState<UploadFile[]>([]);
const [isDragging, setIsDragging] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

{/* Dropzone */}
<div
  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={e => { e.preventDefault(); setIsDragging(false); /* simulateUpload(...) */ }}
  onClick={() => fileInputRef.current?.click()}
  role="button"
  tabIndex={0}
  aria-label="Arraste arquivos ou clique para selecionar"
  className={\`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors \${
    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
  }\`}
>
  <UploadCloud size={40} className="mx-auto text-muted-foreground/50 mb-3" />
  <p className="text-sm font-medium mb-1">
    Arraste arquivos aqui ou <span className="text-primary underline">selecione do computador</span>
  </p>
  <p className="text-xs text-muted-foreground">PDF, XLSX, JPG, PNG · Até 10MB por arquivo · Máximo 20 arquivos</p>
  <input ref={fileInputRef} type="file" multiple hidden />
</div>

{/* Lista de arquivos com progresso individual */}
<div className="space-y-2">
  {files.map((file, i) => (
    <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
      <span className={\`shrink-0 \${file.status === "done" ? "text-success" : file.status === "error" ? "text-error" : "text-muted-foreground"}\`}>
        {file.status === "done" ? <CheckCircle2 size={18} /> : file.status === "error" ? <XCircle size={18} /> : <File size={18} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            {file.status === "done" ? "Concluído" : file.status === "error" ? "Erro" : \`\${Math.round(file.progress)}%\`}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(file.progress)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={\`h-full rounded-full transition-all duration-300 \${
              file.status === "done" ? "bg-success" : file.status === "error" ? "bg-error" : "bg-primary"
            }\`}
            style={{ width: \`\${file.progress}%\` }}
          />
        </div>
      </div>
      <button aria-label={\`Remover \${file.name}\`} className="p-1 hover:bg-muted rounded">
        <X size={14} className="text-muted-foreground" />
      </button>
    </div>
  ))}
</div>`}
    >
      <div className="space-y-4">
        {/* Dropzone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Arraste arquivos ou clique para selecionar"
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <UploadCloud size={40} className="mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm font-medium mb-1">Arraste arquivos aqui ou <span className="text-primary underline">selecione do computador</span></p>
          <p className="text-xs text-muted-foreground">PDF, XLSX, JPG, PNG · Até 10MB por arquivo · Máximo 20 arquivos</p>
          <input ref={fileInputRef} type="file" multiple hidden onChange={() => handleFileSelect()} />
        </div>

        {/* Demo button */}
        {files.length === 0 && (
          <button
            onClick={handleFileSelect}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium"
          >
            <Upload size={14} /> Simular upload de 4 arquivos
          </button>
        )}

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{files.length} arquivo(s)</span>
              <span>
                {files.filter(f => f.status === "done").length} concluído(s)
                {files.some(f => f.status === "error") && ` · ${files.filter(f => f.status === "error").length} com erro`}
              </span>
            </div>
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
                <span className={`shrink-0 ${file.status === "done" ? "text-success" : file.status === "error" ? "text-error" : "text-muted-foreground"}`}>
                  {file.status === "done" ? <CheckCircle2 size={18} /> : file.status === "error" ? <XCircle size={18} /> : <File size={18} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {file.status === "done" ? "Concluído" : file.status === "error" ? "Erro" : `${Math.round(file.progress)}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(file.progress)} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          file.status === "done" ? "bg-success" : file.status === "error" ? "bg-error" : "bg-primary"
                        }`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{file.size}</span>
                  </div>
                </div>
                {file.status === "error" && (
                  <button className="text-xs text-primary hover:underline shrink-0">Tentar novamente</button>
                )}
                <button aria-label={`Remover ${file.name}`} className="p-1 hover:bg-muted rounded shrink-0 transition-colors" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                  <X size={14} className="text-muted-foreground" />
                </button>
              </div>
            ))}
            {/* Global progress */}
            <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
              <Activity size={16} className="text-primary" />
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${files.reduce((sum, f) => sum + f.progress, 0) / files.length}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-medium">{Math.round(files.reduce((sum, f) => sum + f.progress, 0) / files.length)}%</span>
            </div>
          </div>
        )}
      </div>
    </ComponentPreview>
  );
}

/* ==================== STEPPER ==================== */
function StepperSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { label: "Dados básicos", description: "Informações do programa" },
    { label: "Documentação", description: "Upload de documentos" },
    { label: "Revisão", description: "Conferência dos dados" },
    { label: "Confirmação", description: "Envio e protocolo" },
  ];

  return (
    <ComponentPreview
      title="Barra de Etapas (Stepper)"
      description="Componente de progresso em etapas para fluxos multi-step com estados completo, ativo e pendente."
      whenToUse={["Formulários longos divididos em etapas", "Processos com fluxo definido (wizard)", "Acompanhamento de status"]}
      whenNotToUse={["Etapas que podem ser feitas em qualquer ordem (use Tabs)", "Fluxos com menos de 3 etapas"]}
      accessibility={["aria-current='step' na etapa ativa", "aria-label no nav", "Indicação de etapa completa via texto, não só cor/ícone"]}
      code={`import { useState } from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  { label: "Dados básicos", description: "Informações do programa" },
  { label: "Documentação", description: "Upload de documentos" },
  { label: "Revisão", description: "Conferência dos dados" },
  { label: "Confirmação", description: "Envio e protocolo" },
];
const [currentStep, setCurrentStep] = useState(1);

{/* Stepper horizontal */}
<nav aria-label="Etapas do formulário">
  <ol className="flex items-start">
    {steps.map((step, i) => {
      const num = i + 1;
      const isComplete = num < currentStep;
      const isActive = num === currentStep;
      return (
        <li key={i} className="flex-1 relative">
          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => setCurrentStep(num)}
              aria-current={isActive ? "step" : undefined}
              className={\`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 \${
                isComplete ? "bg-success text-success-foreground" :
                isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                "bg-muted text-muted-foreground"
              }\`}
            >
              {isComplete ? <Check size={18} /> : num}
            </button>
            <span className={\`mt-2 text-xs font-medium \${isActive ? "text-primary" : "text-muted-foreground"}\`}>{step.label}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">{step.description}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={\`absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 \${num < currentStep ? "bg-success" : "bg-border"}\`} />
          )}
        </li>
      );
    })}
  </ol>
</nav>

{/* Navegação */}
<div className="flex items-center justify-between">
  <button
    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
    disabled={currentStep === 1}
    className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded text-sm font-medium hover:bg-muted disabled:opacity-30"
  >
    <ArrowLeft size={14} /> Voltar
  </button>
  <span className="text-xs text-muted-foreground">Etapa {currentStep} de {steps.length}</span>
  <button
    onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
    disabled={currentStep === steps.length}
    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 disabled:opacity-30"
  >
    {currentStep === steps.length ? "Concluir" : "Próxima etapa"} <ArrowRight size={14} />
  </button>
</div>`}
    >
      <div className="space-y-6">
        {/* Horizontal stepper */}
        <nav aria-label="Etapas do formulário">
          <ol className="flex items-start">
            {steps.map((step, i) => {
              const num = i + 1;
              const isComplete = num < currentStep;
              const isActive = num === currentStep;
              return (
                <li key={i} className="flex-1 relative">
                  <div className="flex flex-col items-center text-center">
                    <button
                      onClick={() => setCurrentStep(num)}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={`Etapa ${num}${isComplete ? " completa" : isActive ? " atual" : " pendente"}: ${step.label}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10 relative ${
                        isComplete ? "bg-success text-success-foreground" :
                        isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isComplete ? <Check size={18} /> : num}
                    </button>
                    <span className={`mt-2 text-xs font-medium ${isActive ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{step.description}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 ${num < currentStep ? "bg-success" : "bg-border"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <div className="border border-border rounded-lg p-6 bg-muted/20 animate-fade-in">
          <h4 className="font-semibold mb-2">Etapa {currentStep}: {steps[currentStep - 1].label}</h4>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description} — Conteúdo da etapa apareceria aqui.</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
          <span className="text-xs text-muted-foreground">Etapa {currentStep} de {steps.length}</span>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            disabled={currentStep === steps.length}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {currentStep === steps.length ? "Concluir" : "Próxima etapa"} <ArrowRight size={14} />
          </button>
        </div>

        {/* Vertical stepper variant */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Variante vertical</p>
          <ol className="space-y-0 ml-4">
            {steps.map((step, i) => {
              const num = i + 1;
              const isComplete = num < currentStep;
              const isActive = num === currentStep;
              return (
                <li key={i} className="relative pb-6 last:pb-0">
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[15px] top-[36px] bottom-0 w-0.5 ${num < currentStep ? "bg-success" : "bg-border"}`} />
                  )}
                  <div className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isComplete ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {isComplete ? <Check size={14} /> : num}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== LISTA DESCRITIVA ==================== */
function DescriptionListSection() {
  return (
    <ComponentPreview
      title="Lista Descritiva"
      description="Exibição de pares chave-valor para dados de detalhe, resumos e fichas cadastrais."
      whenToUse={["Telas de detalhe", "Fichas cadastrais", "Resumos de formulário antes do envio"]}
      whenNotToUse={["Dados tabulares comparativos (use Tabela)", "Listas de itens homogêneos"]}
      accessibility={["Usar elementos dl, dt, dd", "dt com font-weight para distinção visual"]}
      code={`{/* Layout padrão (rótulo + valor empilhados/divididos) */}
<dl className="border border-border rounded-lg divide-y divide-border">
  {[
    { term: "Programa", value: "AGI – Agentes de Inovação" },
    { term: "Empresa atendida", value: "Padaria Pão Quente ME" },
    { term: "CNPJ", value: "12.345.678/0001-90" },
    { term: "Porte", value: <span className="brand-badge-success">Microempresa</span> },
    { term: "Setor", value: "Alimentos e Bebidas" },
  ].map((item, i) => (
    <div key={i} className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-0">
      <dt className="text-sm font-medium text-muted-foreground sm:w-1/3 shrink-0">{item.term}</dt>
      <dd className="text-sm text-foreground">{item.value}</dd>
    </div>
  ))}
</dl>

{/* Variante em grid (2 colunas) */}
<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {[
    { term: "Código do atendimento", value: "__BRAND_NAME__-2026-00312" },
    { term: "Município", value: "Campinas – SP" },
  ].map((item, i) => (
    <div key={i} className="bg-muted/30 rounded-lg px-4 py-3">
      <dt className="text-xs font-medium text-muted-foreground mb-0.5">{item.term}</dt>
      <dd className="text-sm font-medium text-foreground">{item.value}</dd>
    </div>
  ))}
</dl>`}
    >
      <div className="space-y-6">
        {/* Standard layout */}
        <dl className="border border-border rounded-lg divide-y divide-border">
          {[
            { term: "Programa", value: "AGI – Agentes de Inovação" },
            { term: "Empresa atendida", value: "Padaria Pão Quente ME" },
            { term: "CNPJ", value: "12.345.678/0001-90" },
            { term: "Porte", value: <span className="brand-badge-success">Microempresa</span> },
            { term: "Setor", value: "Alimentos e Bebidas" },
            { term: "Ciclo de atendimento", value: "01/03/2026 a 30/11/2026" },
            { term: "Agente responsável", value: "Carla Mendes Rocha" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-0">
              <dt className="text-sm font-medium text-muted-foreground sm:w-1/3 shrink-0">{item.term}</dt>
              <dd className="text-sm text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>

        {/* Grid 2-col variant */}
        <div>
          <p className="text-sm font-medium mb-3">Variante em grid (2 colunas)</p>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { term: "Código do atendimento", value: "__BRAND_NAME__-2026-00312" },
              { term: "Solução", value: "Programa Inova - Consultoria Tecnológica" },
              { term: "Município", value: "Campinas – SP" },
              { term: "UF", value: "São Paulo" },
              { term: "Modalidade", value: "Presencial + EAD" },
              { term: "Encontros realizados", value: "8 de 12 previstos" },
            ].map((item, i) => (
              <div key={i} className="bg-muted/30 rounded-lg px-4 py-3">
                <dt className="text-xs font-medium text-muted-foreground mb-0.5">{item.term}</dt>
                <dd className="text-sm font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== STATS CARDS ==================== */
function StatsCardsSection() {
  return (
    <ComponentPreview
      title="Cards de Estatísticas"
      description="Variações avançadas de cards para painéis: com mini-gráfico, comparativo, meta/progresso e ranking."
      whenToUse={["Dashboards detalhados", "Relatórios visuais", "Comparativos de desempenho"]}
      code={`import { BarChart3, TrendingUp, DollarSign } from "lucide-react";

{/* Card com progresso e meta */}
<div className="bg-card border border-border rounded-lg p-5">
  <div className="flex items-center justify-between mb-3">
    <span className="text-sm text-muted-foreground">Taxa de execução</span>
    <BarChart3 size={16} className="text-muted-foreground" />
  </div>
  <p className="text-2xl font-bold mb-3">78,4%</p>
  <div className="h-2 bg-muted rounded-full overflow-hidden mb-2" role="progressbar" aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>
    <div className="h-full bg-primary rounded-full" style={{ width: "78.4%" }} />
  </div>
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>0%</span><span className="font-medium text-primary">Meta: 95%</span><span>100%</span>
  </div>
</div>

{/* Card comparativo com mini barras */}
<div className="bg-card border border-border rounded-lg p-5">
  <span className="text-sm text-muted-foreground block mb-3">Atendimentos: este mês vs anterior</span>
  <div className="flex items-end gap-6">
    <div>
      <p className="text-2xl font-bold">1.247</p>
      <p className="text-xs text-muted-foreground">Mar/2026</p>
    </div>
    <div>
      <p className="text-2xl font-bold text-muted-foreground/50">1.102</p>
      <p className="text-xs text-muted-foreground">Fev/2026</p>
    </div>
    <div className="flex items-center gap-1 text-success text-sm font-semibold mb-1">
      <TrendingUp size={14} /> +13,2%
    </div>
  </div>
  <div className="flex items-end gap-1 mt-4 h-10">
    {[40, 55, 30, 65, 50, 70, 80, 60, 90, 85, 75, 95].map((h, i) => (
      <div key={i} className={\`flex-1 rounded-t \${i === 11 ? "bg-primary" : "bg-primary/20"}\`} style={{ height: \`\${h}%\` }} />
    ))}
  </div>
</div>

{/* Card destaque com ícone grande */}
<div className="bg-primary rounded-lg p-5 text-primary-foreground">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-xs opacity-70 mb-1">Total acumulado 2026</p>
      <p className="text-3xl font-bold">R$ 8,6B</p>
      <p className="text-sm opacity-80 mt-2">Recursos aplicados em programas e projetos</p>
    </div>
    <DollarSign size={40} className="opacity-20" />
  </div>
</div>`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card com progresso/meta */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Taxa de execução</span>
            <BarChart3 size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mb-3">78,4%</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-2" role="progressbar" aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-primary rounded-full" style={{ width: "78.4%" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-medium text-primary">Meta: 95%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Card comparativo */}
        <div className="bg-card border border-border rounded-lg p-5">
          <span className="text-sm text-muted-foreground block mb-3">Atendimentos: este mês vs anterior</span>
          <div className="flex items-end gap-6">
            <div>
              <p className="text-2xl font-bold text-foreground">1.247</p>
              <p className="text-xs text-muted-foreground">Mar/2026</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground/50">1.102</p>
              <p className="text-xs text-muted-foreground">Fev/2026</p>
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-semibold mb-1">
              <TrendingUp size={14} /> +13,2%
            </div>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 mt-4 h-10">
            {[40, 55, 30, 65, 50, 70, 80, 60, 90, 85, 75, 95].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t ${i === 11 ? "bg-primary" : "bg-primary/20"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Card de ranking */}
        <div className="bg-card border border-border rounded-lg p-5">
          <span className="text-sm text-muted-foreground block mb-3">Top 5 programas por valor</span>
          <div className="space-y-2">
            {[
              { name: "Empreender", value: "R$ 3,1B", pct: 100 },
              { name: "Primeiro Negócio", value: "R$ 2,4B", pct: 77 },
              { name: "Programa Inova", value: "R$ 1,8B", pct: 58 },
              { name: "Visita Técnica", value: "R$ 890M", pct: 29 },
              { name: "Mais Produtividade", value: "R$ 420M", pct: 14 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{i + 1}. {item.name}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/70 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card com status indicadores */}
        <div className="bg-card border border-border rounded-lg p-5">
          <span className="text-sm text-muted-foreground block mb-3">Status dos processos</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Aprovados", count: 142, color: "text-success", bg: "bg-success-bg" },
              { label: "Pendentes", count: 38, color: "text-warning", bg: "bg-warning-bg" },
              { label: "Em análise", count: 67, color: "text-info", bg: "bg-info-bg" },
              { label: "Reprovados", count: 12, color: "text-error", bg: "bg-error-bg" },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-lg p-3 text-center`}>
                <p className={`text-xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card com ícone grande */}
        <div className="bg-primary rounded-lg p-5 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs opacity-70 mb-1">Total acumulado 2026</p>
              <p className="text-3xl font-bold">R$ 8,6B</p>
              <p className="text-sm opacity-80 mt-2">Recursos aplicados em programas e projetos</p>
            </div>
            <DollarSign size={40} className="opacity-20" />
          </div>
        </div>

        {/* Card ação rápida */}
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between">
          <div>
            <span className="text-sm text-muted-foreground block mb-2">Ações pendentes</span>
            <div className="space-y-2">
              {["Aprovar atendimento Empreender #3421", "Revisar parecer Programa Inova #1872", "Assinar termo Mais Produtividade #099"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full text-center bg-primary text-primary-foreground py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity">
            Ver todas as pendências
          </button>
        </div>
      </div>
    </ComponentPreview>
  );
}

/* ==================== MÉTRICAS ==================== */

function MiniDonut({ value, size = 48, color = "text-primary" }: { value: number; size?: number; color?: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className={color} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={4} opacity={0.15} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} className="transition-all duration-700" />
    </svg>
  );
}

function MiniSparkline({ data, color = "text-primary", height = 40, width = 120 }: { data: number[]; color?: string; height?: number; width?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((d, i) => `${i * step},${height - ((d - min) / range) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={width} height={height} className={color} aria-hidden="true">
      <polyline fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={points} />
    </svg>
  );
}

function MiniBarChart({ data, color = "bg-primary", height = 40 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }} aria-hidden="true">
      {data.map((d, i) => (
        <div key={i} className={`flex-1 rounded-t ${color} transition-all`} style={{ height: `${(d / max) * 100}%`, minWidth: 4 }} />
      ))}
    </div>
  );
}

function MiniAreaChart({ data, color = "text-primary", height = 50, width = 140 }: { data: number[]; color?: string; height?: number; width?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${height - ((d - min) / range) * (height - 6) - 3}`);
  const line = pts.join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  return (
    <svg width={width} height={height} className={color} aria-hidden="true">
      <polygon fill="currentColor" opacity={0.1} points={area} />
      <polyline fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={line} />
    </svg>
  );
}

function MetricsSection() {
  return (
    <ComponentPreview
      title="Métricas — Painel Completo"
      description="Coleção de cards de métricas para dashboards institucionais: gráficos circulares, sparklines, barras, área, tabelas trimestrais e cards de resumo. Inspirado em painéis administrativos profissionais."
      whenToUse={["Dashboards e painéis gerenciais", "Telas iniciais de módulos", "Relatórios executivos", "Acompanhamento de indicadores"]}
      whenNotToUse={["Páginas de formulário", "Conteúdo editorial sem dados numéricos"]}
      accessibility={["Cada card com aria-label descritivo", "Gráficos decorativos com aria-hidden", "Valores numéricos em texto, não só visual", "Trends com ícone + texto (não depender só de cor)"]}
      code={`{/* Helpers SVG leves usados pelos cards */}
function MiniDonut({ value, size = 48, color = "text-primary" }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className={color} aria-hidden="true">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={4} opacity={0.15} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={\`rotate(-90 \${size/2} \${size/2})\`} />
    </svg>
  );
}

function MiniBarChart({ data, color = "bg-primary", height = 40 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }} aria-hidden="true">
      {data.map((d, i) => (
        <div key={i} className={\`flex-1 rounded-t \${color}\`} style={{ height: \`\${(d/max)*100}%\`, minWidth: 4 }} />
      ))}
    </div>
  );
}

function MiniAreaChart({ data, color = "text-primary", height = 50, width = 140 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => \`\${i*step},\${height - ((d-min)/range)*(height-6) - 3}\`).join(" ");
  return (
    <svg width={width} height={height} className={color} aria-hidden="true">
      <polygon fill="currentColor" opacity={0.1} points={\`0,\${height} \${pts} \${width},\${height}\`} />
      <polyline fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" points={pts} />
    </svg>
  );
}

{/* Card com donut */}
<div className="bg-card border border-border rounded-lg p-5" aria-label="Vendas Totais: R$ 250K">
  <div className="flex items-center justify-between mb-4">
    <h4 className="text-sm font-semibold">Vendas Totais</h4>
    <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">Mensal</span>
  </div>
  <div className="flex items-center justify-between">
    <MiniDonut value={72} size={56} color="text-primary" />
    <div className="text-right">
      <p className="text-2xl font-bold">R$ 250K</p>
      <p className="text-xs text-muted-foreground">Total mensal de vendas</p>
    </div>
  </div>
</div>

{/* Card com sparkline (barras) */}
<div className="bg-card border border-border rounded-lg p-5">
  <div className="flex items-center justify-between mb-4">
    <h4 className="text-sm font-semibold">Projeto A - Vendas</h4>
    <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">Mensal</span>
  </div>
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-2xl font-bold">R$ 320K</p>
      <p className="text-xs text-muted-foreground">Vendas mensais Projeto A</p>
    </div>
    <div className="w-24"><MiniBarChart data={[40, 65, 35, 80, 55, 70, 90]} /></div>
  </div>
</div>

{/* Card com área + trend */}
<div className="bg-card border border-border rounded-lg p-5">
  <div className="flex items-center justify-between mb-2">
    <h4 className="text-sm font-semibold">Greenfield Towers</h4>
    <span className="text-xs font-semibold text-success">+R$ 40K</span>
  </div>
  <MiniAreaChart data={[20, 35, 30, 50, 45, 65, 55, 75]} width={260} />
  <p className="text-2xl font-bold mt-2">R$ 550K</p>
  <p className="text-xs text-muted-foreground">Variação de vendas</p>
</div>

{/* Tabela de relatório trimestral */}
<div className="bg-card border border-border rounded-lg p-5">
  <div className="flex items-center justify-between mb-3">
    <h4 className="text-sm font-semibold">Relatórios Trimestrais</h4>
    <span className="text-[10px] font-medium bg-success/15 text-success px-2 py-0.5 rounded">Novo</span>
  </div>
  <table className="w-full text-sm">
    <thead>
      <tr className="text-left text-xs text-muted-foreground border-b border-border">
        <th className="py-2">Trimestre</th><th>Receita</th><th>Despesa</th><th>Margem</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-border/50">
        <td className="py-2">T1 2026</td><td>R$ 210k</td><td>R$ 165k</td><td className="text-success">R$ 45k</td>
      </tr>
    </tbody>
  </table>
</div>`}
    >
      <div className="space-y-8">
        {/* ===== ROW 1: Cards com donut ===== */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cards com gráfico circular (donut)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Vendas Totais", badge: "Mensal", value: "R$ 250K", subtitle: "Total mensal de vendas", pct: 72, color: "text-primary" },
              { title: "Total de Ordens", badge: "Mensal", value: "180", subtitle: "Total mensal de ordens", pct: 58, color: "text-info" },
              { title: "Novos Cadastros", badge: "Mensal", value: "50.895", subtitle: "Novos cadastros mensais", pct: 85, color: "text-success" },
            ].map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5" aria-label={`${m.title}: ${m.value}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                  <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">{m.badge}</span>
                </div>
                <div className="flex items-center justify-between">
                  <MiniDonut value={m.pct} size={56} color={m.color} />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ROW 2: Cards com sparkline bars ===== */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cards com mini barras (sparkline)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Projeto A - Vendas", value: "R$ 320K", subtitle: "Vendas mensais Projeto A", data: [40, 65, 35, 80, 55, 70, 90] },
              { title: "Projeto B - Receita", value: "R$ 450K", subtitle: "Receita mensal Projeto B", data: [50, 40, 70, 60, 80, 75, 95] },
              { title: "Projeto C - Engajamento", value: "R$ 580K", subtitle: "Engajamento mensal Projeto C", data: [30, 55, 45, 70, 60, 85, 75] },
            ].map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5" aria-label={`${m.title}: ${m.value}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                  <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">Mensal</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.subtitle}</p>
                  </div>
                  <MiniBarChart data={m.data} color="bg-primary/60" height={44} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ROW 3: Cards com área chart + trend badge ===== */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cards com gráfico de área e variação</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Greenfield Towers", trend: "+R$ 40K", up: true, value: "R$ 550K", subtitle: "Variação de vendas", data: [20, 35, 30, 50, 45, 60, 55, 70, 65, 80] },
              { title: "Oceanview Residences", trend: "-R$ 20K", up: false, value: "R$ 230K", subtitle: "Variação de vendas", data: [60, 55, 50, 45, 40, 35, 42, 38, 30, 25] },
              { title: "Sunset Bay Villas", trend: "+R$ 50K", up: true, value: "R$ 650K", subtitle: "Variação de vendas", data: [30, 40, 35, 55, 50, 65, 60, 75, 80, 90] },
            ].map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5" aria-label={`${m.title}: ${m.value}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${m.up ? "bg-success-bg text-success" : "bg-error-bg text-error"}`}>
                    {m.trend}
                  </span>
                </div>
                <div className="mb-3">
                  <MiniAreaChart data={m.data} color={m.up ? "text-success" : "text-error"} width={200} height={50} />
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ROW 4: Cards com donut colorido (multi-segmento) + trend ===== */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cards com donut e trend trimestral</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Receita Total", trend: "+8,2%", up: true, value: "R$ 1.240K", subtitle: "Este trimestre", pct: 78, colors: ["text-primary", "text-info"] },
              { title: "Total Despesas", trend: "-2,1%", up: false, value: "R$ 840K", subtitle: "Este trimestre", pct: 55, colors: ["text-secondary", "text-warning"] },
              { title: "Lucro Líquido", trend: "Estável", up: true, value: "R$ 400K", subtitle: "Este trimestre", pct: 42, colors: ["text-success", "text-primary"] },
            ].map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5" aria-label={`${m.title}: ${m.value}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    m.trend === "Estável" ? "bg-muted text-muted-foreground" : m.up ? "bg-success-bg text-success" : "bg-error-bg text-error"
                  }`}>
                    {m.trend}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <MiniDonut value={m.pct} size={60} color={m.colors[0]} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-foreground">{m.pct}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ROW 5: Quarterly table + summary cards ===== */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tabela trimestral + Cards de resumo</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quarterly table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Relatórios Trimestrais</h4>
                  <span className="text-[10px] font-bold bg-success text-success-foreground px-1.5 py-0.5 rounded">NOVO</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-muted rounded transition-colors" aria-label="Recolher"><ChevronDown size={14} /></button>
                  <button className="p-1 hover:bg-muted rounded transition-colors" aria-label="Atualizar"><Activity size={14} /></button>
                  <button className="p-1 hover:bg-muted rounded transition-colors" aria-label="Fechar"><X size={14} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase text-muted-foreground">Trimestre</th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase text-muted-foreground">Receita</th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase text-muted-foreground">Despesa</th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase text-muted-foreground">Margem</th>
                      <th className="py-2.5 px-3 w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { q: "Trimestre 1", period: "Jan – Mar 2026", rev: "R$ 210k", exp: "R$ 165k", margin: "R$ 45k", pct: 65 },
                      { q: "Trimestre 2", period: "Abr – Jun 2026", rev: "R$ 225k", exp: "R$ 175k", margin: "R$ 50k", pct: 72 },
                      { q: "Trimestre 3", period: "Jul – Set 2026", rev: "R$ 240k", exp: "R$ 190k", margin: "R$ 50k", pct: 78 },
                      { q: "Trimestre 4", period: "Out – Dez 2026", rev: "R$ 260k", exp: "R$ 195k", margin: "R$ 65k", pct: 85 },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-sm">{row.q}</p>
                          <p className="text-[10px] text-muted-foreground">{row.period}</p>
                        </td>
                        <td className="text-right py-3 px-3 text-sm">{row.rev}</td>
                        <td className="text-right py-3 px-3 text-sm">{row.exp}</td>
                        <td className="text-right py-3 px-3 text-sm font-medium">{row.margin}</td>
                        <td className="py-3 px-3">
                          <MiniDonut value={row.pct} size={28} color="text-primary" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary card - Orders */}
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-foreground">421</span>
                  <span className="text-sm text-muted-foreground">Ordens</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Você recebeu 421 novas ordens, indicando uma tendência saudável de vendas no período.
                </p>
              </div>
              <div className="flex items-end gap-[2px] h-16">
                {[30, 50, 40, 60, 45, 70, 55, 80, 65, 85, 75, 90].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-primary/30 hover:bg-primary/60 transition-colors" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Summary card - Products (dark style) */}
            <div className="bg-primary rounded-lg p-5 text-primary-foreground flex flex-col">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold">185</span>
                  <span className="text-sm opacity-70">Produtos</span>
                </div>
                <p className="text-sm opacity-70 mb-4">
                  Você possui 185 produtos ativos disponíveis no inventário do sistema.
                </p>
              </div>
              <div className="flex items-end gap-[2px] h-16">
                {[45, 60, 35, 75, 50, 80, 65, 55, 70, 85, 60, 90].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-primary-foreground/20 hover:bg-primary-foreground/40 transition-colors" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== ROW 6: Mixed metric cards ===== */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cards mistos de indicadores</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Profit card */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-foreground">R$ 12,50k</span>
                <span className="text-sm text-muted-foreground">Lucro</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Lucro total de R$ 12.500 neste mês, mostrando crescimento estável e positivo.</p>
              <MiniSparkline data={[20, 35, 25, 50, 45, 60, 55, 70, 65, 80, 75, 85]} color="text-success" width={200} height={40} />
            </div>

            {/* Revenue goal */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Meta de receita</span>
                <span className="text-xs font-semibold text-success">87% alcançado</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-3" role="progressbar" aria-valuenow={87} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-gradient-to-r from-primary to-success rounded-full" style={{ width: "87%" }} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">R$ 870K</p>
                  <p className="text-[10px] text-muted-foreground">Atual</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-muted-foreground/50">R$ 1M</p>
                  <p className="text-[10px] text-muted-foreground">Meta</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">R$ 130K</p>
                  <p className="text-[10px] text-muted-foreground">Faltam</p>
                </div>
              </div>
            </div>

            {/* Multi-stat card */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h4 className="text-sm font-semibold mb-4">Resumo do período</h4>
              <div className="space-y-3">
                {[
                  { label: "Receita", value: "R$ 1.240K", trend: "+8,2%", up: true, pct: 78 },
                  { label: "Despesas", value: "R$ 840K", trend: "-2,1%", up: false, pct: 55 },
                  { label: "Lucro", value: "R$ 400K", trend: "+12%", up: true, pct: 42 },
                  { label: "Fluxo de caixa", value: "R$ 720K", trend: "+5,6%", up: true, pct: 65 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className={`text-[10px] font-semibold ${item.up ? "text-success" : "text-error"}`}>{item.trend}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.up ? "bg-primary" : "bg-secondary"}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground w-24 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}
