// Fase 5 dos estilos visuais (docs/PLANO-ESTILOS.md): layout bento.
//
// O bento reorganiza as páginas em blocos de tamanhos variados, numa grade de 4 colunas. Como o resto da
// tokenização, entra como patch idempotente no fim da extração (tokenizar.mjs usa NOVOS e TROCAS daqui).
//
// Garantia de identidade: com `ESTILO.layout !== "bento"` as funções de src/components/layout/bento.ts
// devolvem exatamente as classes que as páginas já tinham, então o `corporativo` e os demais estilos não mudam
// um pixel. A ordem do DOM nunca muda (a leitura lógica vale mais que a posição visual), e a grade vira uma
// coluna abaixo de 640px.

/** Auxiliares de layout: o que decide se uma página está em bento e quanto cada bloco ocupa. */
export const BENTO_TS = `/**
 * Layout bento do DS (gerado pelo ds-build).
 *
 * Com \`ESTILO.layout === "bento"\`, as grades das páginas ganham 4 colunas e os blocos ocupam 1×1, 2×1, 3×1,
 * 4×1, 1×2 ou 2×2 células. Com qualquer outro layout, todas as funções devolvem a classe original da página.
 *
 * A ordem do DOM segue a leitura lógica: o bloco maior vem primeiro no código, e a grade nunca usa
 * \`grid-auto-flow: dense\`. Abaixo de 640px é uma coluna; de 640 a 1023px, duas.
 */
import { ESTILO } from "@/config/estilo";
import { cn } from "@/lib/utils";

export type BentoSize = "1x1" | "2x1" | "3x1" | "4x1" | "1x2" | "2x2";

/** Colunas da grade a partir de 1024px. */
export const BENTO_COLUNAS = 4;

/** Quantas colunas cada tamanho ocupa na grade de 4. */
export const BENTO_LARGURA: Record<BentoSize, number> = {
  "1x1": 1,
  "2x1": 2,
  "3x1": 3,
  "4x1": 4,
  "1x2": 1,
  "2x2": 2,
};

// Linhas só se estendem a partir de 1024px: na grade de 2 colunas, um bloco de 2 linhas deixaria uma linha vazia.
const CELULA: Record<BentoSize, string> = {
  "1x1": "",
  "2x1": "sm:col-span-2",
  "3x1": "sm:col-span-2 lg:col-span-3",
  "4x1": "sm:col-span-2 lg:col-span-4",
  "1x2": "lg:row-span-2",
  "2x2": "sm:col-span-2 lg:row-span-2",
};

const GRADE = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";

export function isBento(): boolean {
  return (ESTILO.layout as string) === "bento";
}

/**
 * Classes de uma grade: \`padrao\` é a grade original da página; \`comum\` vale nos dois layouts (margens, padding).
 */
export function bentoGrid(padrao: string, comum?: string): string {
  const grade = isBento() ? GRADE : padrao;
  return comum ? cn(grade, comum) : grade;
}

/**
 * Classes de um bloco da grade bento (vazio fora do bento). \`hero\` marca o bloco de destaque, preenchido com a
 * cor primária pela camada CSS do estilo.
 */
export function bentoCell(size: BentoSize = "1x1", opts: { hero?: boolean } = {}): string {
  if (!isBento()) return "";
  return cn("min-w-0", CELULA[size], opts.hero && "bento-hero");
}

/**
 * Tamanhos para \`n\` blocos iguais fecharem as linhas da grade: alguns viram 2×1, espalhados pela lista, na
 * quantidade que falta para o total de colunas ser múltiplo de 4. Um bloco 2×1 nunca começa na última coluna.
 */
export function bentoSizes(n: number): BentoSize[] {
  const tamanhos: BentoSize[] = Array.from({ length: Math.max(0, n) }, () => "1x1");
  const duplos = n > 0 ? (BENTO_COLUNAS - (n % BENTO_COLUNAS)) % BENTO_COLUNAS : 0;
  let restantes = duplos;
  let coluna = 0;
  for (let i = 0; i < n; i++) {
    const alvo = Math.floor(((duplos - restantes + 0.5) * n) / Math.max(duplos, 1));
    if (restantes > 0 && i >= alvo && coluna <= BENTO_COLUNAS - 2) {
      tamanhos[i] = "2x1";
      restantes--;
      coluna += 2;
    } else {
      coluna += 1;
    }
    coluna %= BENTO_COLUNAS;
  }
  return tamanhos;
}
`;

/** Componentes para páginas novas: a grade e o bloco. As páginas do template usam as funções direto. */
export const BENTO_GRID_TSX = `import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { bentoCell, bentoGrid, type BentoSize } from "./bento";

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Classes da grade quando o layout não é bento (a grade original da página). */
  padrao?: string;
}

/** Grade da página: 4 colunas no layout bento, \`padrao\` nos demais. */
export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, padrao = "grid grid-cols-1 gap-4", ...props }, ref) => (
    <div ref={ref} className={bentoGrid(padrao, className)} {...props} />
  ),
);
BentoGrid.displayName = "BentoGrid";

export interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  size?: BentoSize;
  /** Bloco de destaque, preenchido com a cor primária no layout bento. */
  hero?: boolean;
}

/** Bloco da grade. Fora do bento é só um \`div\`; quem monta a página pode aplicar \`bentoCell()\` direto no elemento. */
export const BentoCell = forwardRef<HTMLDivElement, BentoCellProps>(
  ({ size = "1x1", hero, className, ...props }, ref) => (
    <div ref={ref} className={cn(bentoCell(size, { hero }), className)} {...props} />
  ),
);
BentoCell.displayName = "BentoCell";
`;

const BENTO_TEST = `import { describe, it, expect, vi, beforeEach } from "vitest";

async function carregar(layout: "padrao" | "bento") {
  vi.resetModules();
  vi.doMock("@/config/estilo", () => ({ ESTILO: { id: "x", nome: "X", temaPadrao: "light", layout } }));
  return import("../bento");
}

beforeEach(() => {
  vi.resetModules();
});

describe("bento fora do layout bento", () => {
  it("devolve a grade original e nenhuma classe de bloco", async () => {
    const b = await carregar("padrao");
    expect(b.isBento()).toBe(false);
    expect(b.bentoGrid("grid grid-cols-3 gap-3")).toBe("grid grid-cols-3 gap-3");
    expect(b.bentoGrid("grid grid-cols-3 gap-3", "mb-10")).toContain("grid-cols-3");
    expect(b.bentoCell("2x2", { hero: true })).toBe("");
  });
});

describe("bento no layout bento", () => {
  it("troca a grade por 4 colunas e mantém as classes comuns", async () => {
    const b = await carregar("bento");
    const grade = b.bentoGrid("grid grid-cols-3 gap-3", "mb-10");
    expect(grade).toContain("lg:grid-cols-4");
    expect(grade).toContain("grid-cols-1");
    expect(grade).toContain("mb-10");
    expect(grade).not.toContain("grid-cols-3");
  });

  it("não reordena o DOM: nada de grid-auto-flow dense", async () => {
    const b = await carregar("bento");
    expect(b.bentoGrid("x")).not.toMatch(/dense/);
  });

  it("estende linhas só a partir de 1024px e uma coluna abaixo de 640px", async () => {
    const b = await carregar("bento");
    expect(b.bentoCell("2x2")).toBe("min-w-0 sm:col-span-2 lg:row-span-2");
    expect(b.bentoCell("1x1")).toBe("min-w-0");
    expect(b.bentoGrid("x")).toMatch(/^grid grid-cols-1 /);
  });

  it("marca o bloco de destaque", async () => {
    const b = await carregar("bento");
    expect(b.bentoCell("2x1", { hero: true })).toContain("bento-hero");
    expect(b.bentoCell("2x1")).not.toContain("bento-hero");
  });
});

describe("bentoSizes", () => {
  it("fecha as linhas de 4 colunas para qualquer quantidade de blocos", async () => {
    const b = await carregar("bento");
    for (let n = 1; n <= 24; n++) {
      const tamanhos = b.bentoSizes(n);
      expect(tamanhos).toHaveLength(n);
      const total = tamanhos.reduce((soma, t) => soma + b.BENTO_LARGURA[t], 0);
      // com 1 a 3 blocos não há como fechar a linha sem alargar demais; de 4 em diante fecha sempre
      if (n >= 4) expect(total % b.BENTO_COLUNAS).toBe(0);
    }
  });

  it("nunca começa um bloco largo na última coluna", async () => {
    const b = await carregar("bento");
    for (let n = 4; n <= 24; n++) {
      let coluna = 0;
      for (const t of b.bentoSizes(n)) {
        const largura = b.BENTO_LARGURA[t];
        expect(coluna + largura).toBeLessThanOrEqual(b.BENTO_COLUNAS);
        coluna = (coluna + largura) % b.BENTO_COLUNAS;
      }
    }
  });

  it("é vazio para zero blocos", async () => {
    const b = await carregar("bento");
    expect(b.bentoSizes(0)).toEqual([]);
  });
});
`;

export const BENTO_NOVOS = [
  ["src/components/layout/bento.ts", BENTO_TS],
  ["src/components/layout/BentoGrid.tsx", BENTO_GRID_TSX],
  ["src/components/layout/__tests__/bento.test.ts", BENTO_TEST],
];

const IMPORT_BENTO = 'import { bentoCell, bentoGrid } from "@/components/layout/bento";\n';
const IMPORT_CN = 'import { cn } from "@/lib/utils";\n';

/**
 * Trocas por âncora nas cinco páginas do bento: [arquivo, antes, depois, marca?] (formato de TROCAS em
 * tokenizar.mjs). Cada grade passa a ter as classes de bentoGrid() e cada bloco as de bentoCell().
 */
export const BENTO_TROCAS = [
  // ── Home: cards de navegação (7 seções; o primeiro é o destaque 2×2) ──
  ["src/pages/HomePage.tsx", 'import { brandWhite as brandLogo } from "@/assets/brand";\n',
    `import { brandWhite as brandLogo } from "@/assets/brand";\n${IMPORT_CN}import { bentoCell, bentoGrid, type BentoSize } from "@/components/layout/bento";\n`, "bentoGrid, type BentoSize"],
  ["src/pages/HomePage.tsx", "const principles = [\n",
    '// Layout bento: tamanho de cada card de navegação (o primeiro é o destaque; as linhas fecham em 4 colunas)\nconst NAV_BENTO: BentoSize[] = ["2x2", "1x1", "1x1", "1x1", "1x1", "2x1", "2x1"];\n\nconst principles = [\n'],
  ["src/pages/HomePage.tsx",
    '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">\n        {sections.map((s) => (\n          <button key={s.path} onClick={() => navigate(s.path)} className="brand-card-hover text-left group">',
    '<div className={bentoGrid("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", "mb-10")}>\n        {sections.map((s, i) => (\n          <button key={s.path} onClick={() => navigate(s.path)} className={cn("brand-card-hover text-left group", bentoCell(NAV_BENTO[i] ?? "1x1", { hero: i === 0 }))}>'],

  // ── Dashboard Institucional: 6 KPIs (destaque 2×1, quatro 1×1 e um 2×1 fecham duas linhas) ──
  ["src/pages/DashboardInstitucionalPage.tsx", 'import { SEO } from "@/components/SEO";\n',
    `import { SEO } from "@/components/SEO";\n${IMPORT_CN}${IMPORT_BENTO}`, 'import { bentoCell, bentoGrid }'],
  ["src/pages/DashboardInstitucionalPage.tsx",
    'function KPICard({ icon: Icon, title, subtitle, value, borderColor }: {\n  icon: React.ElementType; title: string; subtitle: string; value: string; borderColor: string;\n}) {',
    'function KPICard({ icon: Icon, title, subtitle, value, borderColor, className }: {\n  icon: React.ElementType; title: string; subtitle: string; value: string; borderColor: string; className?: string;\n}) {'],
  // o className do KPICard entra sozinho na âncora: o gancho data-ds="card" pode ou não já estar no elemento
  ["src/pages/DashboardInstitucionalPage.tsx", 'className="bg-card rounded-lg border border-border p-4 relative overflow-hidden">',
    'className={cn("bg-card rounded-lg border border-border p-4 relative overflow-hidden", className)}>'],
  ["src/pages/DashboardInstitucionalPage.tsx",
    `              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <KPICard icon={Users} title="Total de Servidores" subtitle="Servidores em análise (filtrados)" value="1.019" borderColor="hsl(var(--primary))" />
                <KPICard icon={FileCheck} title="Servidores Regulares" subtitle="Filtro (listar todos)" value="80,00%" borderColor="hsl(var(--success))" />
                <KPICard icon={FileX} title="Servidores Irregulares" subtitle="Filtro (listar todos)" value="20,00%" borderColor="hsl(var(--destructive))" />
                <KPICard icon={Clock} title="Em Análise" subtitle="Aguardando conformidade" value="20,00%" borderColor="hsl(var(--warning))" />
                <KPICard icon={ShieldCheck} title="Auditoria em Andamento" subtitle="Aguardando conformidade" value="2,00%" borderColor="hsl(var(--success))" />
                <KPICard icon={RefreshCw} title="Atualização de Dados" subtitle="Aguardando conformidade" value="+120" borderColor="hsl(var(--warning))" />
              </div>`,
    `              <div className={bentoGrid("grid grid-cols-1 md:grid-cols-3 gap-3")}>
                <KPICard className={bentoCell("2x1", { hero: true })} icon={Users} title="Total de Servidores" subtitle="Servidores em análise (filtrados)" value="1.019" borderColor="hsl(var(--primary))" />
                <KPICard className={bentoCell()} icon={FileCheck} title="Servidores Regulares" subtitle="Filtro (listar todos)" value="80,00%" borderColor="hsl(var(--success))" />
                <KPICard className={bentoCell()} icon={FileX} title="Servidores Irregulares" subtitle="Filtro (listar todos)" value="20,00%" borderColor="hsl(var(--destructive))" />
                <KPICard className={bentoCell()} icon={Clock} title="Em Análise" subtitle="Aguardando conformidade" value="20,00%" borderColor="hsl(var(--warning))" />
                <KPICard className={bentoCell()} icon={ShieldCheck} title="Auditoria em Andamento" subtitle="Aguardando conformidade" value="2,00%" borderColor="hsl(var(--success))" />
                <KPICard className={bentoCell("2x1")} icon={RefreshCw} title="Atualização de Dados" subtitle="Aguardando conformidade" value="+120" borderColor="hsl(var(--warning))" />
              </div>`],

  // ── Dashboard Analítico: KPIs 1×1 (o primeiro é o destaque) e gráfico territorial 3×1 ──
  ["src/pages/DashboardAnaliticoPage.tsx", 'import { Button } from "@/components/ui/button";\n',
    `import { Button } from "@/components/ui/button";\n${IMPORT_CN}${IMPORT_BENTO}`, 'import { bentoCell, bentoGrid }'],
  ["src/pages/DashboardAnaliticoPage.tsx",
    '            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">\n              {kpis.map((k) => {',
    '            <div className={bentoGrid("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4")}>\n              {kpis.map((k, i) => {'],
  ["src/pages/DashboardAnaliticoPage.tsx", '<Card key={k.titulo} className="relative overflow-hidden">',
    '<Card key={k.titulo} className={cn("relative overflow-hidden", bentoCell("1x1", { hero: i === 0 }))}>'],
  ["src/pages/DashboardAnaliticoPage.tsx",
    '          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">\n            <Card className="lg:col-span-2 min-w-0">',
    '          <div className={bentoGrid("grid grid-cols-1 lg:grid-cols-3 gap-4")}>\n            <Card className={cn("lg:col-span-2 min-w-0", bentoCell("3x1"))}>'],
  ["src/pages/DashboardAnaliticoPage.tsx",
    '            <Card className="min-w-0">\n              <CardHeader className="pb-2">\n                <h2 className="text-base font-semibold text-foreground">Comparativo Trimestral</h2>',
    '            <Card className={cn("min-w-0", bentoCell())}>\n              <CardHeader className="pb-2">\n                <h2 className="text-base font-semibold text-foreground">Comparativo Trimestral</h2>'],

  // ── Hub de painéis: os cards fecham as linhas da grade (alguns viram 2×1) ──
  ["src/components/templates/HubPaineisTemplate.tsx", 'import { ComponentPreview } from "@/components/DSComponents";\n',
    `import { ComponentPreview } from "@/components/DSComponents";\n${IMPORT_CN}import { bentoCell, bentoGrid, bentoSizes } from "@/components/layout/bento";\n`, "bentoGrid, bentoSizes"],
  ["src/components/templates/HubPaineisTemplate.tsx", "function FlipCard({ card }: { card: PainelCard }) {",
    "function FlipCard({ card, className }: { card: PainelCard; className?: string }) {"],
  ["src/components/templates/HubPaineisTemplate.tsx", '      className="h-[280px] perspective-1000"', '      className={cn("h-[280px] perspective-1000", className)}'],
  ["src/components/templates/HubPaineisTemplate.tsx", "function FlipCardImage({ card }: { card: PainelCard }) {",
    "function FlipCardImage({ card, className }: { card: PainelCard; className?: string }) {"],
  ["src/components/templates/HubPaineisTemplate.tsx", '      className="h-[300px]"\n      style={{ perspective: "1000px" }}',
    '      className={cn("h-[300px]", className)}\n      style={{ perspective: "1000px" }}'],
  ["src/components/templates/HubPaineisTemplate.tsx",
    '      <div className="px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">\n        {filtered.map((card) => (\n          <FlipCard key={card.id} card={card} />',
    '      <div className={bentoGrid("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", "px-4 pb-6")}>\n        {filtered.map((card, i) => (\n          <FlipCard key={card.id} card={card} className={bentoCell(bentoSizes(filtered.length)[i])} />'],
  ["src/components/templates/HubPaineisTemplate.tsx",
    '      <div className="px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">\n        {filtered.map((card) => (\n          <FlipCardImage key={card.id} card={card} />',
    '      <div className={bentoGrid("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", "px-4 pb-6")}>\n        {filtered.map((card, i) => (\n          <FlipCardImage key={card.id} card={card} className={bentoCell(bentoSizes(filtered.length)[i])} />'],

  // ── Tela BI, visão geral: 8 KPIs (2×1 no primeiro, no sexto e nos dois últimos) e 4 gráficos (3×1 + 1×1, 2×1 + 2×1) ──
  ["src/components/bi/IndicatorCard.tsx", 'import { Info, TrendingUp, TrendingDown } from "lucide-react";\n',
    `import { Info, TrendingUp, TrendingDown } from "lucide-react";\n${IMPORT_CN}`, 'import { cn } from "@/lib/utils";'],
  ["src/components/bi/IndicatorCard.tsx", "  delta?: number | null; // % vs período anterior\n}",
    "  delta?: number | null; // % vs período anterior\n  className?: string;\n}"],
  ["src/components/bi/IndicatorCard.tsx", "export default function IndicatorCard({ title, value, icon: Icon, tooltip, delta }: Props) {",
    "export default function IndicatorCard({ title, value, icon: Icon, tooltip, delta, className }: Props) {"],
  ["src/components/bi/IndicatorCard.tsx", 'className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">',
    'className={cn("rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow", className)}>'],
  ["src/components/bi/sections/VisaoGeral.tsx", 'import { formatarNumero } from "@/lib/echarts/format";\n',
    `import { formatarNumero } from "@/lib/echarts/format";\n${IMPORT_CN}${IMPORT_BENTO}`, 'import { bentoCell, bentoGrid }'],
  ["src/components/bi/sections/VisaoGeral.tsx", '      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">\n        <IndicatorCard title="Empresas atendidas"',
    '      <div className={bentoGrid("grid grid-cols-2 md:grid-cols-4 gap-3")}>\n        <IndicatorCard className={bentoCell("2x1", { hero: true })} title="Empresas atendidas"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<IndicatorCard title="Atendimentos"', '<IndicatorCard className={bentoCell()} title="Atendimentos"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<IndicatorCard title="Contatos"', '<IndicatorCard className={bentoCell()} title="Contatos"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<IndicatorCard title="Com e-mail"', '<IndicatorCard className={bentoCell()} title="Com e-mail"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<IndicatorCard title="Municípios atendidos"', '<IndicatorCard className={bentoCell()} title="Municípios atendidos"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<IndicatorCard title="Oportunidades"', '<IndicatorCard className={bentoCell("2x1")} title="Oportunidades"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<IndicatorCard title="Sem retorno"', '<IndicatorCard className={bentoCell("2x1")} title="Sem retorno"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<IndicatorCard title="Taxa de qualificação"', '<IndicatorCard className={bentoCell("2x1")} title="Taxa de qualificação"'],
  ["src/components/bi/sections/VisaoGeral.tsx",
    '      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">\n        <ChartCard title="Empresas por município">',
    '      <div className={bentoGrid("grid grid-cols-1 lg:grid-cols-2 gap-4")}>\n        <ChartCard className={bentoCell("3x1")} title="Empresas por município">'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<ChartCard title="Empresas por status">', '<ChartCard className={bentoCell()} title="Empresas por status">'],
  ["src/components/bi/sections/VisaoGeral.tsx", '        <ChartCard\n          title="Evolução dos atendimentos"',
    '        <ChartCard\n          className={bentoCell("2x1")}\n          title="Evolução dos atendimentos"'],
  ["src/components/bi/sections/VisaoGeral.tsx", '<ChartCard title="Funil de atendimento">', '<ChartCard className={bentoCell("2x1")} title="Funil de atendimento">'],
  ["src/components/bi/sections/VisaoGeral.tsx", "  action,\n}: {\n  title: string;\n  children: React.ReactNode;\n  action?: React.ReactNode;\n}) {",
    "  action,\n  className,\n}: {\n  title: string;\n  children: React.ReactNode;\n  action?: React.ReactNode;\n  className?: string;\n}) {"],
  ["src/components/bi/sections/VisaoGeral.tsx", 'className="rounded-xl border border-border bg-card p-5 shadow-sm min-w-0">',
    'className={cn("rounded-xl border border-border bg-card p-5 shadow-sm min-w-0", className)}>'],
];
