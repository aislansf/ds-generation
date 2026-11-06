import { useEffect, useRef, useState, type ReactNode } from "react";
import { Building2, CircleCheck, Clock, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { Aviso } from "@/components/estilo/NeumorfismoAlertas";
import { Trilha } from "@/components/estilo/NeumorfismoBreadcrumb";
import { Selo, Etiqueta } from "@/components/estilo/NeumorfismoBadges";
import { ControleSegmentado } from "@/components/estilo/NeumorfismoSegmentado";
import { Dica } from "@/components/estilo/NeumorfismoTooltips";
import { GatilhoAcoes, MenuSuspenso, type ItemSuspenso } from "@/components/estilo/NeumorfismoMenuSuspenso";
import { TeclaKebabDiscreta } from "@/components/estilo/NeumorfismoKebab";
import { BarraFiltros } from "@/components/estilo/NeumorfismoFiltros";
import { CartaoKpi } from "@/components/estilo/NeumorfismoKpis";
import { Esqueleto } from "@/components/estilo/NeumorfismoSkeletons";
import { GraficoAreaTemporal } from "@/components/estilo/NeumorfismoGraficoAreaTemporal";
import { GraficoRosca } from "@/components/estilo/NeumorfismoGraficoRosca";
import { CartaoMeta } from "@/components/estilo/NeumorfismoMetas";
import { CartaoMetrica } from "@/components/estilo/NeumorfismoMetricas";
import { CartaoIndicador } from "@/components/estilo/NeumorfismoIndicadores";
import { GraficoBarrasAgrupadas } from "@/components/estilo/NeumorfismoGraficoBarrasAgrupadas";
import { GraficoMedidor } from "@/components/estilo/NeumorfismoGraficoMedidor";
import { GraficoBarrasHorizontais } from "@/components/estilo/NeumorfismoGraficoBarrasHorizontais";
import { Cartao } from "@/components/estilo/NeumorfismoCards";
import { Progresso } from "@/components/estilo/NeumorfismoProgresso";
import { Abas, Acordeao, EtapasVerticais } from "@/components/estilo/NeumorfismoNavegacao";
import { Tabela, CelulaItem, Chip, Avaliacao, Situacao, type ColunaTabela, type Linha, type TomTabela } from "@/components/estilo/NeumorfismoTabelas";
import { Paginacao } from "@/components/estilo/NeumorfismoPaginacao";
import { ListaDescritiva } from "@/components/estilo/NeumorfismoListaDescritiva";
import { UploadEmMassa } from "@/components/estilo/NeumorfismoUploadEmMassa";
import { EstadoVazio } from "@/components/estilo/NeumorfismoVazios";
import { Rodape } from "@/components/estilo/NeumorfismoRodapes";
import { Cabecalho } from "@/components/estilo/NeumorfismoCabecalhos";
import { MenuLateral, type GrupoMenuLateral } from "@/components/estilo/NeumorfismoMenuLateral";
import { GavetaLateral, type ItemGaveta } from "@/components/estilo/NeumorfismoGavetaLateral";
import { Modal } from "@/components/estilo/NeumorfismoModais";
import { CampoTexto } from "@/components/estilo/NeumorfismoCampos";
import { SelecaoNeu } from "@/components/estilo/NeumorfismoSelect";
import { DataUnica } from "@/components/estilo/NeumorfismoDatePicker";
import { GrupoRadio } from "@/components/estilo/NeumorfismoRadio";
import { OpcaoSwitch } from "@/components/estilo/NeumorfismoSwitch";
import { Notificacao } from "@/components/estilo/NeumorfismoToasts";

/**
 * Template Dashboard do pacote Neumorphic UI v3.2.0, o "Painel de atendimentos": uma tela de gestão inteira montada só com
 * os componentes do estilo. De cima para baixo: a casca (menu lateral fixo e cabeçalho completo a partir de 1080px de
 * largura; abaixo disso, o cabeçalho compacto abre a gaveta), a trilha, o título com o selo "Ao vivo" e as ações (período,
 * atualizar, Exportar, Novo atendimento), o aviso do fechamento do trimestre, a barra de filtros, quatro KPIs tingidos
 * (a tecla de atualizar os troca por esqueletos por cerca de um segundo), tendência diária e canais, as metas por
 * programa (meta anual, empresas por mês, tempo de resposta, meta x realizado e satisfação), o ranking de municípios com
 * a capacidade das equipes e o detalhamento em abas (atendimentos com seleção em lote, fluxo, unidade, documentos e
 * pendências), o rodapé, o modal "Novo atendimento" e o toast de sucesso.
 * A grade de 12 colunas e os espaçamentos seguem o espaço da própria casca (container query), não a janela: até 1180px os
 * KPIs vão dois por linha e os gráficos ocupam a largura toda; até 720px tudo vira uma coluna. `larguraMinima` troca o
 * ponto em que a casca passa do menu fixo à gaveta. Só é usado quando ESTILO.id === "neumorfismo" (DashboardTemplates);
 * as classes neu-app* e neu-grid* vêm de src/styles/estilo.css. Os números são fictícios.
 */

const nf = (n: number | string) => Number(n).toLocaleString("pt-BR");

/** Série diária pseudoaleatória estável (mesma semente do pacote), de 01/11/2025 a 31/10/2026 */
function gerarSerie() {
  const dados: { date: string; valor: number }[] = [];
  let v = 160;
  let semente = 11;
  const aleatorio = () => {
    semente = (semente * 9301 + 49297) % 233280;
    return semente / 233280;
  };
  for (const d = new Date(2025, 10, 1); d <= new Date(2026, 9, 31); d.setDate(d.getDate() + 1)) {
    v = Math.max(90, Math.min(260, v + (aleatorio() - 0.46) * 14));
    dados.push({ date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`, valor: Math.round(v) });
  }
  return dados;
}
const SERIE_DIARIA = gerarSerie();

const GRUPOS_MENU: GrupoMenuLateral[] = [
  { titulo: "1. Operação", itens: [
    { id: "painel", rotulo: "Painel geral", icone: <Icone name="grid" /> },
    { id: "atendimentos", rotulo: "Atendimentos", icone: <Icone name="users" />, selo: "Novo" },
    { id: "agenda", rotulo: "Agenda", icone: <Icone name="calendar" /> },
    { id: "empresas", rotulo: "Empresas", icone: <Icone name="building" /> },
  ] },
  { titulo: "2. Programas", itens: [
    { id: "metas", rotulo: "Metas e execução", icone: <Icone name="target" /> },
    { id: "capacitacao", rotulo: "Capacitação", icone: <Icone name="graduation-cap" /> },
    { id: "consultoria", rotulo: "Consultoria", icone: <Icone name="message-square" /> },
  ] },
  { titulo: "3. Análises", itens: [
    { id: "relatorios", rotulo: "Relatórios", icone: <Icone name="bar-chart" /> },
    { id: "config", rotulo: "Configurações", icone: <Icone name="settings" /> },
  ] },
];

const ITENS_GAVETA: ItemGaveta[] = [
  { id: "painel", rotulo: "Painel geral", icone: <Icone name="grid" /> },
  { id: "atendimentos", rotulo: "Atendimentos", icone: <Icone name="users" /> },
  { id: "agenda", rotulo: "Agenda", icone: <Icone name="calendar" /> },
  { id: "programas", rotulo: "Programas", icone: <Icone name="target" />, filhos: [
    { id: "metas", rotulo: "Metas e execução" },
    { id: "capacitacao", rotulo: "Capacitação" },
    { id: "consultoria", rotulo: "Consultoria" },
  ] },
  { id: "relatorios", rotulo: "Relatórios", icone: <Icone name="bar-chart" /> },
  { id: "config", rotulo: "Configurações", icone: <Icone name="settings" /> },
];

const CANAIS = [
  { nome: "Presencial", valor: 4210 },
  { nome: "Online", valor: 3105 },
  { nome: "Telefone", valor: 1580 },
  { nome: "WhatsApp", valor: 1192 },
];

const PROGRAMAS = [
  { name: "Capacitação", meta: 2400, realizado: 2180 },
  { name: "Consultoria", meta: 1800, realizado: 1460 },
  { name: "Crédito", meta: 900, realizado: 610 },
  { name: "Inovação", meta: 1200, realizado: 1265 },
  { name: "Mercado", meta: 1500, realizado: 1120 },
];

const MUNICIPIOS = [
  { nome: "Fortaleza", valor: 4820 },
  { nome: "Sobral", valor: 2110 },
  { nome: "Juazeiro do Norte", valor: 1985 },
  { nome: "Maracanaú", valor: 1530 },
  { nome: "Caucaia", valor: 1240 },
  { nome: "Crato", valor: 860 },
];

const CAPACIDADE: [string, number, "accent" | "royal" | "success" | "warning"][] = [
  ["Capacitação", 82, "accent"],
  ["Consultoria", 67, "royal"],
  ["Crédito orientado", 45, "success"],
  ["Inovação", 91, "warning"],
];

interface Atendimento extends Linha {
  emp: string;
  codigo: string;
  icone: string;
  tom: TomTabela;
  prog: string;
  data: string;
  cons: string;
  nota: string;
  st: string;
  stTom: TomTabela;
}

const ATENDIMENTOS: Atendimento[] = [
  { emp: "Doces da Serra", codigo: "CNPJ 12.345.678/0001-90", icone: "building", tom: "marca", prog: "Capacitação", data: "03/11/2026", cons: "Marina Lopes", nota: "4.9", st: "Concluído", stTom: "sucesso" },
  { emp: "Ateliê Mar Azul", codigo: "MEI 45.112.908/0001-12", icone: "star", tom: "azul", prog: "Consultoria", data: "03/11/2026", cons: "Rafael Nunes", nota: "4.7", st: "Em andamento", stTom: "azul" },
  { emp: "Café do Sertão", codigo: "CNPJ 33.908.221/0001-04", icone: "zap", tom: "atencao", prog: "Crédito", data: "02/11/2026", cons: "Joana Prado", nota: "4.2", st: "Pendente", stTom: "marca" },
  { emp: "Tech Rural Soluções", codigo: "CNPJ 27.441.650/0001-33", icone: "monitor", tom: "sucesso", prog: "Inovação", data: "01/11/2026", cons: "Marina Lopes", nota: "5.0", st: "Concluído", stTom: "sucesso" },
  { emp: "Pescados Litoral", codigo: "ME 18.002.377/0001-58", icone: "layers", tom: "perigo", prog: "Mercado", data: "31/10/2026", cons: "Paulo Reis", nota: "3.8", st: "Cancelado", stTom: "perigo" },
];

const ITENS_LINHA: ItemSuspenso[] = [
  { rotulo: "Visualizar", icone: <Icone name="eye" size={14} /> },
  { rotulo: "Editar", icone: <Icone name="edit" size={14} /> },
  { divisor: true },
  { rotulo: "Excluir", icone: <Icone name="trash-2" size={14} />, perigo: true },
];

const COLUNAS: ColunaTabela<Atendimento>[] = [
  { chave: "emp", rotulo: "Empresa", renderizar: (v, l) => <CelulaItem icone={l.icone} tom={l.tom} titulo={String(v)} codigo={l.codigo} /> },
  { chave: "prog", rotulo: "Programa", renderizar: (v) => <Chip>{String(v)}</Chip> },
  { chave: "data", rotulo: "Data", mono: true },
  { chave: "cons", rotulo: "Consultor" },
  { chave: "nota", rotulo: "Avaliação", alinhar: "center", renderizar: (v) => <Avaliacao valor={String(v)} /> },
  { chave: "st", rotulo: "Status", alinhar: "center", renderizar: (v, l) => <Situacao tom={l.stTom}>{String(v)}</Situacao> },
  {
    chave: "acoes",
    rotulo: "Ações",
    alinhar: "right",
    renderizar: (_, l) => {
      const nome = `Ações de ${l.emp}`;
      return <MenuSuspenso gatilho={<TeclaKebabDiscreta aria-label={nome} onClick={(e) => e.stopPropagation()} />} rotulo={nome} alinhar="end" variante="lista" itens={ITENS_LINHA} />;
    },
  },
];

const KPIS = [
  { icone: Users, tom: "marca", valor: "10.087", rotulo: "Atendimentos no ano", tendencia: "+12,3%", dica: "vs. 8.982 em 2025" },
  { icone: Building2, tom: "azul", valor: "3.412", rotulo: "Empresas atendidas", tendencia: "+8,1%", dica: "vs. 3.156 em 2025" },
  { icone: Clock, tom: "atencao", valor: "23", rotulo: "Pendências abertas", tendencia: "-15,4%", dica: "vs. 27 na semana anterior" },
  { icone: CircleCheck, tom: "sucesso", valor: "91,6%", rotulo: "Satisfação (NPS)", tendencia: "+2,1%", dica: "Meta: 90%" },
] as const;

function KpiEsqueleto() {
  return (
    <div className="neu-dash__kpi-skel" aria-hidden="true">
      <Esqueleto largura={44} altura={44} raio={14} />
      <Esqueleto largura="60%" altura={22} />
      <Esqueleto largura="85%" altura={10} />
    </div>
  );
}

function NovoAtendimento({ aberto, aoFechar, aoSalvar }: { aberto: boolean; aoFechar: () => void; aoSalvar: () => void }) {
  return (
    <Modal
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Novo atendimento"
      subtitulo="Registro rápido"
      variante="convexo"
      tamanho="lg"
      icone={<Icone name="plus" size={18} />}
      rotuloConfirmar="Salvar atendimento"
      aoConfirmar={aoSalvar}
    >
      <div className="neu-stack" style={{ gap: 16 }}>
        <CampoTexto label="Empresa" icone={<Icone name="building" size={16} />} placeholder="Razão social ou CNPJ" />
        <div className="neu-dash__form-par">
          <SelecaoNeu rotulo="Programa" valorInicial="cap" opcoes={[{ value: "cap", label: "Capacitação" }, { value: "con", label: "Consultoria" }, { value: "cre", label: "Crédito" }, { value: "ino", label: "Inovação" }]} />
          <DataUnica rotulo="Data do atendimento" valorInicial="04/11/2026" />
        </div>
        <p className="neu-label" style={{ margin: "4px 0 0" }}>Canal</p>
        <GrupoRadio rotulo="Canal" valorInicial="presencial" opcoes={[{ value: "presencial", label: "Presencial", description: "Na unidade ou na empresa" }, { value: "online", label: "Online", description: "Videochamada ou plataforma" }]} />
        <div className="neu-dash__switch">
          <OpcaoSwitch rotulo="Enviar confirmação por e-mail" tom="secundaria" ligadoInicial />
        </div>
      </div>
    </Modal>
  );
}

function Secao({ titulo, nota, children }: { titulo: string; nota?: string; children?: ReactNode }) {
  return (
    <>
      <h2 className="neu-app__section-title">
        {titulo}
        {nota && <small>{nota}</small>}
      </h2>
      {children}
    </>
  );
}

export interface PainelAtendimentosProps {
  /** Largura da casca, em px, a partir da qual o menu fica fixo (padrão 1080) */
  larguraMinima?: number;
  nomeDaMarca?: string;
}

export function PainelAtendimentos({ larguraMinima = 1080, nomeDaMarca = "Sua marca" }: PainelAtendimentosProps) {
  const raiz = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(1280);
  const [ativo, setAtivo] = useState("painel");
  const [gaveta, setGaveta] = useState(false);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(0);
  const [aviso, setAviso] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((e) => setLargura(e[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => () => clearTimeout(temporizador.current), []);

  const larga = largura >= larguraMinima;
  const atualizar = () => {
    setCarregando(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setCarregando(false), 1100);
  };

  const abas = [
    {
      value: "lista",
      label: "Atendimentos",
      content: (
        <div>
          <Tabela<Atendimento> selecionavel acoesEmLote legenda="Atendimentos recentes" colunas={COLUNAS} linhas={ATENDIMENTOS} />
          <div className="neu-app__toolbar">
            <span className="neu-app__muted">Mostrando 1–5 de 10.087 atendimentos</span>
            <Paginacao total={12} pagina={pagina} aoMudar={setPagina} />
          </div>
        </div>
      ),
    },
    {
      value: "fluxo",
      label: "Fluxo de atendimento",
      content: (
        <div className="neu-grid neu-grid--keep">
          <div className="neu-col-6">
            <EtapasVerticais
              rotulo="Etapas do atendimento"
              atual={2}
              etapas={[
                { label: "Triagem", meta: "28/10/2026", description: "Demanda registrada e classificada por programa." },
                { label: "Diagnóstico", meta: "30/10/2026", description: "Consultor visita a empresa e aplica o diagnóstico." },
                {
                  label: "Plano de ação",
                  hint: "Em andamento",
                  description: "Metas e entregas combinadas com a empresa.",
                  content: (
                    <div className="neu-stack" style={{ gap: 8 }}>
                      <Progresso valor={64} rotulo="Plano de ação" />
                      <span className="neu-app__muted">64% das entregas concluídas</span>
                    </div>
                  ),
                },
                { label: "Avaliação", hint: "Pendente", description: "Pesquisa de satisfação e encerramento." },
              ]}
            />
          </div>
          <div className="neu-col-6">
            <Acordeao
              agrupado
              itens={[
                { title: "Quando um atendimento é considerado concluído?", content: "Quando o plano de ação é entregue e a empresa responde à pesquisa de satisfação." },
                { title: "Quem pode reabrir um atendimento?", content: "O consultor responsável ou a coordenação regional, com justificativa registrada." },
                { title: "Como corrigir dados da empresa?", content: "Edite o cadastro em Empresas; o histórico de atendimentos é mantido." },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      value: "unidade",
      label: "Unidade",
      content: (
        <ListaDescritiva
          rotulo="Dados da unidade"
          variante="grade"
          colunas={3}
          itens={[
            { termo: "Unidade", valor: "Regional Centro-Norte", icone: "building" },
            { termo: "Coordenação", valor: "Ana Souza", icone: "user" },
            { termo: "Consultores ativos", valor: "18", icone: "users", mono: true },
            { termo: "Municípios atendidos", valor: "42", icone: "target", mono: true },
            { termo: "Última sincronização", valor: "04/11/2026 08:12", icone: "clock", mono: true },
            { termo: "Contato", valor: "regional@exemplo.com", icone: "mail" },
          ]}
        />
      ),
    },
    {
      value: "docs",
      label: "Documentos",
      content: (
        <UploadEmMassa
          arquivosIniciais={[
            { nome: "relatorio_trimestral_q3.pdf", tamanho: "2,4 MB", estado: "concluido" },
            { nome: "lista_presenca_capacitacao.xlsx", tamanho: "860 KB", estado: "enviando", progresso: 68 },
            { nome: "contrato_digitalizado.pdf", tamanho: "14,2 MB", estado: "erro", erro: "Excede 10MB" },
          ]}
        />
      ),
    },
    {
      value: "pend",
      label: "Pendências",
      content: (
        <EstadoVazio titulo="Nenhuma pendência crítica" icone={<Icone name="check-circle" size={26} />} rotuloAcao="Ver todas as pendências">
          As 23 pendências abertas estão dentro do prazo. Avisaremos quando alguma vencer.
        </EstadoVazio>
      ),
    },
  ];

  // o modal e o toast são fixos na janela: ficam fora da casca, que é um container (a contenção prenderia o position: fixed)
  return (
    <>
    <div ref={raiz} className="neu-app" data-neu="painel">
      {larga && (
        <div className="neu-app__side">
          <MenuLateral grupos={GRUPOS_MENU} ativo={ativo} aoNavegar={setAtivo} titulo={nomeDaMarca} subtitulo="Gestão de atendimentos" tituloRodape="Ana Souza" subtituloRodape="Coordenação regional" iniciaisRodape="AS" />
        </div>
      )}
      <div className="neu-app__main">
        {larga ? (
          <Cabecalho
            marca={<span className="neu-header__mark">{nomeDaMarca}</span>}
            nomeApp="SGA"
            descricaoApp="Sistema de Gestão de Atendimentos"
            classificacao="Conteúdo interno"
            placeholderBusca="Buscar empresa, CNPJ ou atendimento…"
            naoLidas
            usuario={{ iniciais: "AS", nome: "Ana Souza", cargo: "Coordenação regional" }}
          />
        ) : (
          <Cabecalho variante="compacto" aoMenu={() => setGaveta(true)} inicialLogo={nomeDaMarca.charAt(0)} marca={nomeDaMarca.toUpperCase()} codigoApp="SGA" nomeApp="Sistema de Gestão de Atendimentos" naoLidas siglaOrg="UF" rotuloSigla="Unidade" />
        )}
        <main className="neu-app__content">
          <Trilha itens={[{ rotulo: "Início", href: "#" }, { rotulo: "Operação", href: "#" }, { rotulo: "Painel geral" }]} />
          <div className="neu-app__head">
            <div className="neu-app__titles">
              <span className="neu-eyebrow">Regional Centro-Norte · 2026</span>
              <h1 className="neu-app__title">
                Painel de atendimentos
                <Selo tom="success" ponto tamanho="sm">Ao vivo</Selo>
              </h1>
              <p className="neu-app__sub">Acompanhe atendimentos, metas por programa e satisfação das empresas atendidas.</p>
            </div>
            <div className="neu-app__actions">
              <ControleSegmentado rotulo="Período" valorInicial="ano" opcoes={[{ valor: "mes", rotulo: "Mês" }, { valor: "tri", rotulo: "Trimestre" }, { valor: "ano", rotulo: "Ano" }]} />
              <Dica texto="Atualizar dados">
                <Button type="button" variant="outline" size="icon" className="neu-ib neu-btn--convex" aria-label="Atualizar dados" onClick={atualizar}>
                  <Icone name="repeat" size={16} />
                </Button>
              </Dica>
              <MenuSuspenso
                gatilho={<GatilhoAcoes>Exportar</GatilhoAcoes>}
                rotulo="Exportar"
                variante="lista"
                itens={[
                  { rotulo: "Relatório em PDF", icone: <Icone name="file" size={14} /> },
                  { rotulo: "Planilha (XLSX)", icone: <Icone name="download" size={14} /> },
                  { rotulo: "Compartilhar link", icone: <Icone name="share-2" size={14} /> },
                ]}
              />
              <Button type="button" onClick={() => setModal(true)}>
                <Icone name="plus" size={16} />
                Novo atendimento
              </Button>
            </div>
          </div>
          {aviso && (
            <Aviso tipo="info" titulo="Fechamento do trimestre em 12 dias" aoFechar={() => setAviso(false)}>
              Registre os atendimentos de outubro até 15/11/2026 para que entrem no relatório do 3º trimestre.
            </Aviso>
          )}
          <BarraFiltros
            variante="linha"
            moldura
            placeholder="Buscar por empresa, CNPJ ou consultor..."
            selects={[
              { rotulo: "Município", opcoes: [{ value: "todos", label: "Todos" }, { value: "fortaleza", label: "Fortaleza" }, { value: "sobral", label: "Sobral" }, { value: "juazeiro", label: "Juazeiro do Norte" }] },
              { rotulo: "Programa", opcoes: [{ value: "todos", label: "Todos" }, { value: "cap", label: "Capacitação" }, { value: "con", label: "Consultoria" }, { value: "cre", label: "Crédito" }] },
            ]}
            filtrosIniciais={[{ id: "sel-Município", select: "Município", valor: "fortaleza", rotulo: "Município: Fortaleza" }]}
          />
          <div className="neu-grid neu-grid--fill" aria-busy={carregando || undefined}>
            {KPIS.map((k) => (
              <div key={k.rotulo} className="neu-col-3">
                {carregando ? <KpiEsqueleto /> : <CartaoKpi variante="tingida" {...k} />}
              </div>
            ))}
          </div>
          <div className="neu-grid neu-grid--fill">
            <div className="neu-col-8">
              <GraficoAreaTemporal
                titulo="Atendimentos diários"
                subtitulo="Todas as unidades da regional"
                nomeSerie="Atendimentos"
                dados={SERIE_DIARIA}
                periodoInicial="6M"
                rotuloPeriodos="Período do gráfico"
                periodos={[{ valor: "1M", rotulo: "1M", nome: "Último mês" }, { valor: "3M", rotulo: "3M", nome: "Últimos 3 meses" }, { valor: "6M", rotulo: "6M", nome: "Últimos 6 meses" }, { valor: "1Y", rotulo: "1A", nome: "Último ano" }]}
                formatarValor={nf}
                altura={300}
              />
            </div>
            <div className="neu-col-4">
              <GraficoRosca titulo="Atendimentos por canal" subtitulo="Acumulado 2026" dados={CANAIS} rotuloCentro="Atendimentos" altura={300} />
            </div>
          </div>
          <Secao titulo="Metas por programa" nota="Atualizado em 04/11/2026" />
          <div className="neu-grid neu-grid--keep neu-grid--fill">
            <div className="neu-col-4">
              <CartaoMeta rotulo="Execução da meta anual" icone={Target} valor="84,7%" progresso={84.7} meta="95%" />
            </div>
            <div className="neu-col-4">
              <CartaoMetrica grafico="barras" dados={[52, 61, 58, 74, 69, 82]} rotulo="Empresas por mês" valor="412" legenda="Média dos últimos 6 meses" rotuloGrafico="Empresas por mês" />
            </div>
            <div className="neu-col-4">
              <CartaoIndicador rotulo="Tempo médio de resposta" icone={Clock} valor="1,8 dia" legenda="Da triagem ao primeiro contato" tom="azul" tendencia="-0,4 dia" direcao="queda" atualizado="Hoje, 08:12" />
            </div>
          </div>
          <div className="neu-grid neu-grid--fill">
            <div className="neu-col-7">
              <GraficoBarrasAgrupadas
                titulo="Meta x realizado"
                subtitulo="Atendimentos por programa · 2026"
                dados={PROGRAMAS}
                chaveX="name"
                series={[{ chave: "meta", nome: "Meta", tom: "neutro" }, { chave: "realizado", nome: "Realizado", tom: "marca" }]}
                formatarValor={nf}
                altura={300}
              />
            </div>
            <div className="neu-col-5">
              <GraficoMedidor titulo="Satisfação geral" subtitulo="Índice 0–100 · meta 85" dados={[{ nome: "Satisfação", valor: 88, tom: "sucesso" }]} meta={85} altura={300} />
            </div>
          </div>
          <div className="neu-grid neu-grid--fill">
            <div className="neu-col-6">
              <GraficoBarrasHorizontais titulo="Ranking por município" subtitulo="Top 6 · 2026" emblema={{ rotulo: "Ranking" }} nomeSerie="Atendimentos" dados={MUNICIPIOS} altura={300} formatarValor={nf} />
            </div>
            <div className="neu-col-6">
              <Cartao variante="plano" titulo="Capacidade das equipes" meta="Ocupação da agenda nesta semana">
                <div className="neu-stack" style={{ gap: 18, marginTop: 8 }}>
                  {CAPACIDADE.map(([nome, valor, tom]) => (
                    <div key={nome} className="neu-stack" style={{ gap: 6 }}>
                      <div className="neu-dash__linha">
                        <span>{nome}</span>
                        <span className="neu-dash__mono">{valor}%</span>
                      </div>
                      <Progresso valor={valor} tom={tom} rotulo={`Ocupação ${nome}`} />
                    </div>
                  ))}
                  <div className="neu-dash__chips">
                    <Etiqueta>Semana 45</Etiqueta>
                    <Etiqueta>18 consultores</Etiqueta>
                    <Selo tom="warning" variante="inset" tamanho="sm">Inovação acima de 90%</Selo>
                  </div>
                </div>
              </Cartao>
            </div>
          </div>
          <Secao titulo="Detalhamento" nota="Selecione linhas para ações em lote" />
          <Abas rotulo="Detalhamento" variante="line" abas={abas} />
        </main>
        <Rodape variante="slim" marca={nomeDaMarca} projeto="Sistema de Gestão de Atendimentos" versao="v.2.4.1" />
      </div>
    </div>
      {!larga && <GavetaLateral itens={ITENS_GAVETA} aberta={gaveta} aoFechar={() => setGaveta(false)} ativo={ativo} aoNavegar={setAtivo} titulo={nomeDaMarca} subtitulo="Gestão de atendimentos" iniciaisRodape="AS" tituloRodape="Ana Souza" metaRodape="v.2.4.1" />}
      <NovoAtendimento
        aberto={modal}
        aoFechar={() => setModal(false)}
        aoSalvar={() => {
          setModal(false);
          setToast((t) => t + 1);
        }}
      />
      {toast > 0 && (
        <Notificacao key={toast} flutuante mostrarTimer titulo="Atendimento registrado com sucesso!" aoFechar={() => setToast(0)}>
          Ele já aparece na lista de atendimentos recentes.
        </Notificacao>
      )}
    </>
  );
}

/** A tela dentro de uma moldura que recorta: a casca é a página inteira, então ela ocupa o quadro e rola dentro dele. */
export function ExemploPainel() {
  return (
    <div className="neu-dash-frame">
      <PainelAtendimentos nomeDaMarca="__BRAND_NAME__" />
    </div>
  );
}
