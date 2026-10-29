import { useState } from "react";
import { 
  Users, BarChart3, Target, Calendar, Filter, RefreshCcw, 
  TrendingUp, TrendingDown, Clock, BookOpen, AlertCircle,
  Search, Trash2, ChevronDown
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area
} from "recharts";
import { BIPanelHeader } from "@/components/bi/BIPanelHeader";

/* ─── Primitives & Mock Data ─── */
const TABS = [
  { id: 'panorama', label: '01 Panorama __BRAND_SHORT__', idx: '01' },
  { id: 'quadro', label: '02 Quadro & Movimentação', idx: '02' },
  { id: 'saude', label: '03 Saúde & Absenteísmo', idx: '03' },
  { id: 'capacita', label: '04 Capacitação', idx: '04' },
  { id: 'ponto', label: '05 Ponto & Jornada', idx: '05' },
  { id: 'unidades', label: '06 Unidades', idx: '06' },
  { id: 'ficha', label: '07 Ficha do Empregado', idx: '07', locked: true },
];

const COLORS = {
  brand: "#0D3857",
  primary: "#005EB8",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  fem: "#c0568f",
  masc: "#1e6fd9",
  line: "#e2e8f0",
  canvas: "#eef1f6"
};

const panoramaData = {
  kpis: [
    { label: "Empregados ativos", value: "137", status: "warning", badge: "8 vagas em aberto", meta: "Meta de quadro: 145" },
    { label: "Turnover 12m", value: "9,4%", status: "danger", badge: "Acima da meta", meta: "Meta ≤ 8% · ▲ 2,3 p.p.", isBad: true },
    { label: "Absenteísmo", value: "3,8%", status: "warning", badge: "Atenção", meta: "Meta ≤ 3% · ▲ 0,6 p.p.", isWarn: true },
    { label: "Cobertura capacitação", value: "88%", status: "success", badge: "Dentro da meta", meta: "Meta ≥ 85% · ▲ 3 p.p.", isOk: true },
    { label: "Custo de folha (anual)", value: "R$ 48,2 Mi", status: "warning", badge: "+2,6% do orçado", meta: "Orçamento: R$ 47,0 Mi" },
    { label: "Risco de sucessão", value: "25%", status: "danger", badge: "Preparar sucessão", meta: "Regra: 20+ anos casa E idade 45+" },
  ]
};

const generoData = [
  { name: 'Feminino', value: 71 },
  { name: 'Masculino', value: 66 },
];

/* ─── Components ─── */

type KpiCardProps = {
  label: string;
  value: string;
  status: string;
  badge: string;
  meta: string;
  isBad?: boolean;
  isWarn?: boolean;
  isOk?: boolean;
};

function KpiCard({ label, value, status, badge, meta, isBad, isWarn, isOk }: KpiCardProps) {
  const badgeColors = 
    status === 'success' ? 'bg-[#e7f6ee] text-[#10b981]' : 
    status === 'warning' ? 'bg-[#fdf2dc] text-[#d68a10]' : 
    'bg-[#fbe8e7] text-[#ef4444]';
  
  const dotColor = 
    status === 'success' ? 'bg-[#10b981]' : 
    status === 'warning' ? 'bg-[#d68a10]' : 
    'bg-[#ef4444]';

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[11px] p-[13px] flex flex-col gap-[5px] min-h-[112px] shadow-[0_1px_2px_rgba(16,40,70,0.06),0_6px_18px_rgba(16,40,70,0.06)]">
      <span className="text-[11px] font-bold tracking-[0.3px] uppercase text-[#8894a2]">{label}</span>
      <div className="text-[29px] font-extrabold leading-none tracking-[-0.5px] text-[#152430]">
        {value}
      </div>
      <div className={`inline-flex items-center gap-[5px] text-[11px] font-bold px-2 py-[3px] rounded-full w-fit ${badgeColors}`}>
        <span className={`w-[7px] h-[7px] rounded-full ${dotColor}`} />
        {badge}
      </div>
      <p className="text-[11px] text-[#5c6b7a] mt-auto">
        {meta}
      </p>
    </div>
  );
}

export default function GestaoPessoasBIPage() {
  const [activeTab, setActiveTab] = useState('panorama');

  return (
    <div className="min-h-screen bg-[hsl(var(--muted))] flex flex-col font-sans text-[hsl(var(--foreground))]">
      <SEO
        title="Gestão de Pessoas - BI — Design System __BRAND_SHORT__"
        description="Painel Executivo de Gestão de Pessoas do __BRAND_NAME__."
        path="/modelos-bi/gestao-pessoas"
      />

      {/* AppBar - Marca oficial __BRAND_NAME__ em versão negativa */}
      <BIPanelHeader
        title="Gestão de Pessoas — Painel Executivo"
        subtitle="Proposta de estrutura · dados ilustrativos"
        right={
          <>
            Atualizado 12/08/2026 08:00<br />
            Próxima carga: amanhã 07:00
          </>
        }
      />


      {/* Tabs Navigation */}
      <nav
        className="px-[14px] flex gap-[2px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:sticky md:top-[57px] z-[29] shadow-md"
        style={{ background: "var(--brand-header-grad-end)" }}
      >
        {TABS.map((t) => (
          <button data-ds="tabs-trigger"
            key={t.id}
            disabled={t.locked}
            onClick={() => setActiveTab(t.id)}
            className={`appearance-none border-0 font-inherit text-[12.5px] md:text-[13px] font-semibold px-[12px] md:px-[16px] py-[12px] pb-[13px] cursor-pointer border-b-[3px] flex items-center gap-[6px] md:gap-[8px] transition-colors relative shrink-0 whitespace-nowrap ${
              activeTab === t.id 
                ? "text-white border-b-[hsl(var(--success))] bg-white/5" 
                : t.locked 
                  ? "text-white/60 cursor-not-allowed" 
                  : "text-white/80 border-b-transparent hover:text-white"
            }`}
          >
            <span className="text-[10px] opacity-65 font-bold">{t.idx}</span>
            {t.label}
            {t.locked && (
              <span className="text-[9px] font-bold uppercase tracking-[0.4px] bg-white/15 px-[6px] py-[2px] rounded-[20px] ml-1">
                restrito
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Legend Row */}
      <div className="bg-card border-b border-border px-[14px] md:px-[22px] py-[7px] flex flex-wrap gap-x-[16px] gap-y-[6px] items-center text-[11px] text-muted-foreground md:sticky md:top-[100px] z-[28]">
        <span className="font-bold text-muted-foreground uppercase tracking-[0.4px] mr-[2px]">Semáforo</span>
        <span className="flex items-center gap-[6px] font-semibold text-foreground">
          <i className="w-[9px] h-[9px] rounded-full bg-[hsl(var(--success))]" /> Dentro da meta
        </span>
        <span className="flex items-center gap-[6px] font-semibold text-foreground">
          <i className="w-[9px] h-[9px] rounded-full bg-[hsl(var(--warning))]" /> Atenção
        </span>
        <span className="flex items-center gap-[6px] font-semibold text-foreground">
          <i className="w-[9px] h-[9px] rounded-full bg-[hsl(var(--error))]" /> Fora da meta
        </span>
        <div className="md:ml-auto bg-primary text-primary-foreground font-bold text-[11px] px-[12px] py-[4px] rounded-[20px] inline-flex items-center gap-[6px]">
          <Calendar className="w-[12px] h-[12px]" /> Período analisado: ANO CORRENTE · 2026 (parcial, jan–jul)
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border-b border-border px-[14px] md:px-[22px] py-[10px] flex gap-[12px] md:gap-[18px] flex-wrap items-end md:sticky md:top-[135px] z-[27]">
        {[
          { label: 'Mês', val: 'Todos' },
          { label: 'Ano', val: '2026' },
          { label: 'Diretoria', val: 'Todas' },
          { label: 'Unidade', val: 'Todas' },
          { label: 'Situação', val: 'Ativos' },
        ].map(f => (
          <div key={f.label} className="flex flex-col gap-[3px]">
            <label className="text-[10px] font-bold tracking-[0.5px] uppercase text-muted-foreground">{f.label}</label>
            <div data-ds="card" className="text-[13px] font-semibold text-foreground border border-border rounded-[7px] px-[10px] py-[6px] pr-[26px] bg-card min-w-[120px] relative cursor-pointer">
              {f.val}
              <ChevronDown className="absolute right-[9px] top-1/2 -translate-y-1/2 text-muted-foreground w-[14px] h-[14px]" />
            </div>
          </div>
        ))}
        <button data-ds="button" data-variant="link" className="ml-auto md:ml-auto text-[12px] font-semibold text-primary self-center flex gap-[6px] items-center cursor-pointer hover:underline">
          <RefreshCcw className="w-[14px] h-[14px]" /> Limpar filtros
        </button>
      </div>

      {/* Main Content */}
      <main className="p-[16px] px-[14px] md:p-[20px] md:px-[22px] pb-[40px] max-w-[1320px] mx-auto w-full">
        
        {activeTab === 'panorama' && (
          <div className="space-y-[14px] animate-in fade-in duration-250 slide-in-from-bottom-1">
            {/* Story / Context */}
            <p className="text-[12.5px] text-[#5c6b7a] mb-[16px] max-w-[920px] leading-relaxed">
              A <strong className="text-[#152430]">manchete executiva</strong>. Em 30 segundos a diretoria sabe o que está verde e o que está vermelho — e qual capítulo abrir. 
              Regra da aba: só indicador de topo, sempre com <strong className="text-[#152430]">meta e veredito</strong>. Nada de tabela ou nome individual.
            </p>

            {/* Top KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[10px] md:gap-[14px]">
              {panoramaData.kpis.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
              ))}
            </div>

            {/* Blocos Temáticos Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-[4px] sm:gap-[10px] mt-[22px] mb-[12px]">
              <h2 className="m-0 text-[13px] font-extrabold tracking-[0.6px] uppercase text-[#0a3d7a]">Blocos temáticos</h2>
              <span className="text-[12px] text-[#5c6b7a] italic">cada card abre o capítulo correspondente</span>
            </div>

            {/* Middle Section: Cards with Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
              {/* Quadro de Pessoal */}
              <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_1px_2px_rgba(16,40,70,0.06),0_6px_18px_rgba(16,40,70,0.06)] p-[15px] px-[16px]">
                <h3 className="m-0 text-[14px] font-bold">Quadro de pessoal</h3>
                <p className="text-[11px] text-[#8894a2] mb-[12px] font-medium uppercase">Composição e diversidade</p>
                
                <div className="flex items-center gap-[22px]">
                  {/* Recharts Pie mimicking Donut */}
                  <div className="w-[104px] h-[104px] relative flex-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: 52, fill: '#c0568f' },
                            { value: 48, fill: '#eef2f7' }
                          ]}
                          innerRadius={39}
                          outerRadius={52}
                          paddingAngle={0}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          { [0, 1].map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#c0568f' : '#eef2f7'} />) }
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <b className="text-[23px] font-extrabold leading-none block">52%</b>
                      <span className="text-[9.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">mulheres</span>
                    </div>
                  </div>
                  
                  <div className="text-[12px] text-[#5c6b7a] leading-relaxed">
                    Gênero: <strong className="text-[#152430]">71 F</strong> / <strong className="text-[#152430]">66 M</strong><br />
                    Liderança feminina: <strong className="text-[#152430]">38%</strong><br />
                    Sede <strong className="text-[#152430]">78</strong> · Regionais <strong className="text-[#152430]">59</strong>
                  </div>
                </div>
              </div>

              {/* Saúde & Bem-estar */}
              <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_1px_2px_rgba(16,40,70,0.06),0_6px_18px_rgba(16,40,70,0.06)] p-[15px] px-[16px]">
                <h3 className="m-0 text-[14px] font-bold">Saúde & bem-estar</h3>
                <p className="text-[11px] text-[#8894a2] mb-[12px] font-medium uppercase">Presença e afastamentos (base: atestados)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[20px] gap-y-[16px]">
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Taxa de absenteísmo</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">3,8%</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Dias de afastamento</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">3.187</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Custo total c/ atestados</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">R$ 1,17 Mi</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Nº de atestados</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">720</span>
                  </div>
                </div>
              </div>

              {/* Capacitação */}
              <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_1px_2px_rgba(16,40,70,0.06),0_6px_18px_rgba(16,40,70,0.06)] p-[15px] px-[16px]">
                <h3 className="m-0 text-[14px] font-bold">Capacitação</h3>
                <p className="text-[11px] text-[#8894a2] mb-[12px] font-medium uppercase">Desenvolvimento e investimento</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[20px] gap-y-[16px]">
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Investimento total (ano)</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">R$ 3,37 Mi</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Horas médias/pessoa</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">129h</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Custo médio/pessoa</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">R$ 24,6 mil</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[10.5px] text-[#8894a2] font-bold uppercase tracking-[0.3px]">Fora da trilha</span>
                    <span className="text-[22px] font-extrabold tracking-[-0.3px] font-mono">16 pessoas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Veredito Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-[4px] sm:gap-[10px] mt-[22px] mb-[12px]">
              <h2 className="m-0 text-[13px] font-extrabold tracking-[0.6px] uppercase text-[#0a3d7a]">Veredito demográfico</h2>
              <span className="text-[12px] text-[#5c6b7a] italic">número com interpretação, não número solto</span>
            </div>

            {/* Bottom Section: Vereditos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
               <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_1px_2px_rgba(16,40,70,0.06),0_6px_18px_rgba(16,40,70,0.06)] p-[15px] px-[16px]">
                 <div className="flex items-center gap-[22px]">
                   <div className="w-[104px] h-[104px] relative flex-none">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={[{v:59},{v:41}]} 
                            innerRadius={39} outerRadius={52} 
                            dataKey="v" startAngle={90} endAngle={-270}
                          >
                            <Cell fill="#1e6fd9" />
                            <Cell fill="#eef2f7" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <b className="text-[23px] font-extrabold block">59%</b>
                      </div>
                   </div>
                   <div className="text-[12px] text-[#5c6b7a] leading-relaxed">
                     <h4 className="m-0 text-[14px] font-bold text-[#152430] mb-[3px]">Alto nível de qualificação</h4>
                     <strong className="text-[#152430]">59% do quadro</strong> possui pós-graduação, mestrado ou doutorado. 
                     Equipe técnica altamente especializada focada em resultados.
                   </div>
                 </div>
               </div>

               <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_1px_2px_rgba(16,40,70,0.06),0_6px_18px_rgba(16,40,70,0.06)] p-[15px] px-[16px]">
                 <div className="flex items-center gap-[22px]">
                   <div className="w-[104px] h-[104px] relative flex-none">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={[{v:25},{v:75}]} 
                            innerRadius={39} outerRadius={52} 
                            dataKey="v" startAngle={90} endAngle={-270}
                          >
                            <Cell fill="#d68a10" />
                            <Cell fill="#eef2f7" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <b className="text-[23px] font-extrabold block">25%</b>
                      </div>
                   </div>
                   <div className="text-[12px] text-[#5c6b7a] leading-relaxed">
                     <h4 className="m-0 text-[14px] font-bold text-[#152430] mb-[3px]">Risco de Sucessão</h4>
                     <strong className="text-[#d68a10]">25% dos colaboradores</strong> atendem ao critério de tempo de casa + idade. 
                     Exige plano de transferência de conhecimento imediato.
                   </div>
                 </div>
               </div>
            </div>

            {/* Scope / Footer Info */}
            <div className="mt-[24px] pt-[12px] border-t border-dashed border-[#e2e8f0] text-[11px] text-[#8894a2] flex gap-[18px] flex-wrap items-center">
               <span className="flex items-center gap-1.5"><strong className="text-[#5c6b7a]">Fonte de dados:</strong> __BRAND_NAME__ / Sistemas Internos</span>
               <span className="flex items-center gap-1.5"><strong className="text-[#5c6b7a]">Amostra:</strong> 137 Empregados Ativos</span>
               <span className="bg-white border border-[#e2e8f0] px-[11px] py-[3px] rounded-[20px] font-semibold text-[#5c6b7a]">População total 100%</span>
            </div>
          </div>
        )}

        {activeTab !== 'panorama' && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-white border border-[#e2e8f0] rounded-full flex items-center justify-center text-[#8894a2] shadow-sm">
               <AlertCircle size={32} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#152430] mb-1">Capítulo em construção</h2>
              <p className="text-[12.5px] text-[#5c6b7a] max-w-sm leading-relaxed">
                As abas de detalhamento seguem a mesma linguagem visual de alta performance do Panorama, 
                utilizando componentes do Design System __BRAND_SHORT__.
              </p>
            </div>
            <Button 
              className="bg-[#0a3d7a] hover:bg-[#0f4f96] text-white font-bold text-[12px] px-6 py-2 rounded-lg"
              onClick={() => setActiveTab('panorama')}
            >
              Voltar ao Panorama
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
