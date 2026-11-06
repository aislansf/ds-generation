import type { LucideIcon } from "lucide-react";
import { AlertCircle, BarChart3, Clock, DollarSign, Download, Minus, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Progresso } from "@/components/estilo/NeumorfismoProgresso";

/**
 * Vitrine do KpiCard no estilo Neumorfismo (componente KpiCard do pacote Neumorphic UI v3.2.0): o "Big Number", em
 * três formas. A grande é o cartão convexo de cantos largos, com o ícone numa peça convexa de 48px, a variação numa
 * pílula convexa, o valor em mono de 30px, o rótulo (em caixa-alta nos painéis executivos), a dica e, se houver, uma
 * barra de progresso fina embaixo. A tingida é mais quieta: o ícone de 36px fica esculpido e lavado com a cor do tom, a
 * variação vai ao canto como texto simples com a seta de tendência, e vêm o valor de 30px, o rótulo e a comparação. A
 * linha é o número compacto das faixas de resumo: uma pílula afundada com valor, rótulo e variação na mesma linha de
 * base. A variação sobe em verde com ↑, cai em vermelho com ↓ e fica neutra em → : a seta carrega o sentido, não só a
 * cor, e um texto escondido diz "alta", "queda" ou "estável" para quem usa leitor de tela. Cada cartão é um grupo
 * nomeado ("Escolas atendidas: 12.847"). Esta vitrine entra no cartão "Big Numbers / KPIs" do DS (no neumorfismo) e só
 * é usada quando ESTILO.id === "neumorfismo". As classes neu-kpi* vêm de src/styles/estilo.css.
 */

export type TomKpi = "marca" | "azul" | "sucesso" | "atencao" | "perigo";
export type DirecaoKpi = "alta" | "queda" | "estavel";

// as classes seguem o pacote (accent, royal, success, warning, danger)
const TOM = { marca: "accent", azul: "royal", sucesso: "success", atencao: "warning", perigo: "danger" } as const satisfies Record<TomKpi, string>;

export interface KpiProps {
  variante?: "grande" | "tingida" | "linha";
  icone?: LucideIcon;
  tom?: TomKpi;
  /** Já formatado em pt-BR: "12.847", "R$ 8,47M", "94,2%" */
  valor: string;
  rotulo: string;
  /** "12,3%", "+12,3%", "-15,4%", "↑ 2%" ou "→ 0%" */
  tendencia?: string;
  /** Sobrescreve o sentido deduzido do sinal da variação */
  direcao?: DirecaoKpi;
  /** A comparação: "vs. 11.436 mês anterior", "Meta: 95%" */
  dica?: string;
  /** Só na grande: o rótulo vai acima do valor, em caixa-alta */
  maiusculas?: boolean;
  /** Só na grande: 0 a 100, a barra fina embaixo */
  progresso?: number;
  tomProgresso?: TomKpi;
  className?: string;
}

/** O sentido da variação: o que a pessoa disse, senão o que o texto mostra (− ou ↓ cai; → ou zero fica; o resto sobe) */
export function direcaoDe(tendencia?: string, direcao?: DirecaoKpi): DirecaoKpi {
  if (direcao) return direcao;
  const t = (tendencia ?? "").trim();
  if (/^[-−↓]/.test(t)) return "queda";
  const semSinal = t.replace(/^\+/, "");
  if (/^→/.test(semSinal) || /^0([,.]0*)?%?(\s|$)/.test(semSinal)) return "estavel";
  return "alta";
}

const CLASSE_DIRECAO: Record<DirecaoKpi, string> = { alta: "up", queda: "down", estavel: "flat" };
const FALADO: Record<DirecaoKpi, string> = { alta: " (alta)", queda: " (queda)", estavel: " (estável)" };

// o texto da pílula, sem o sinal de mais nem as setas que a pessoa já tenha escrito
function limpar(tendencia: string): string {
  return tendencia.replace(/^[\s↑↓→]+/, "").replace(/^\+/, "");
}

function PilulaVariacao({ tendencia, direcao }: { tendencia: string; direcao: DirecaoKpi }) {
  const seta = direcao === "alta" ? "↑" : direcao === "queda" ? "↓" : "→";
  const texto = limpar(tendencia);
  const mostrado = direcao === "alta" && !/^[-−]/.test(texto) ? `+${texto}` : texto;
  return (
    <span className={`neu-trend neu-trend--${CLASSE_DIRECAO[direcao]}`}>
      <span aria-hidden="true">{seta}</span> {mostrado}
      <span className="sr-only">{FALADO[direcao]}</span>
    </span>
  );
}

function Grande({ icone: Icone = Users, tom = "marca", valor, rotulo, tendencia, direcao, dica, maiusculas, progresso, tomProgresso, className }: KpiProps) {
  const sentido = direcaoDe(tendencia, direcao);
  return (
    <div className={["neu-kpi", className].filter(Boolean).join(" ")} role="group" aria-label={`${rotulo}: ${valor}`}>
      <div className="neu-kpi__top">
        <span className={`neu-kpi__icon neu-tone-${TOM[tom]}`} aria-hidden="true">
          <Icone size={22} />
        </span>
        {tendencia ? <PilulaVariacao tendencia={tendencia} direcao={sentido} /> : null}
      </div>
      <div>
        {maiusculas && <p className="neu-kpi__label neu-kpi__label--caps">{rotulo}</p>}
        <p className="neu-kpi__value">{valor}</p>
        {!maiusculas && <p className="neu-kpi__label">{rotulo}</p>}
        {dica && <p className="neu-kpi__hint">{dica}</p>}
      </div>
      {progresso != null && <Progresso fino valor={progresso} rotulo={rotulo} tom={TOM[tomProgresso ?? (tom === "azul" ? "azul" : "marca")]} />}
    </div>
  );
}

function Tingida({ icone: Icone = Users, tom = "marca", valor, rotulo, tendencia, direcao, dica, className }: KpiProps) {
  const sentido = direcaoDe(tendencia, direcao);
  const SetaTendencia = sentido === "queda" ? TrendingDown : sentido === "estavel" ? Minus : TrendingUp;
  return (
    <div className={["neu-kpi-t", className].filter(Boolean).join(" ")} role="group" aria-label={`${rotulo}: ${valor}`}>
      <div className="neu-kpi-t__top">
        <span className={`neu-kpi-t__icon neu-kpi-t__icon--${TOM[tom]} neu-tone-${TOM[tom]}`} aria-hidden="true">
          <Icone size={20} />
        </span>
        {tendencia ? (
          <span className={`neu-kpi-t__trend neu-kpi-t__trend--${CLASSE_DIRECAO[sentido]}`}>
            <SetaTendencia aria-hidden="true" size={12} strokeWidth={2.5} />
            <span>{tendencia}</span>
            <span className="sr-only">{FALADO[sentido]}</span>
          </span>
        ) : null}
      </div>
      <p className="neu-kpi-t__value">{valor}</p>
      <p className="neu-kpi-t__label">{rotulo}</p>
      {dica && <p className="neu-kpi-t__hint">{dica}</p>}
    </div>
  );
}

function Linha({ valor, rotulo, tendencia, direcao, className }: KpiProps) {
  const sentido = direcaoDe(tendencia, direcao);
  return (
    <div className={["neu-kpi-i", className].filter(Boolean).join(" ")} role="group" aria-label={`${rotulo}: ${valor}`}>
      <span className="neu-kpi-i__value">{valor}</span>
      <span className="neu-kpi-i__label">{rotulo}</span>
      {tendencia ? <span className={`neu-kpi-i__trend neu-kpi-i__trend--${CLASSE_DIRECAO[sentido]}`}>{tendencia}</span> : null}
    </div>
  );
}

export function CartaoKpi(props: KpiProps) {
  if (props.variante === "tingida") return <Tingida {...props} />;
  if (props.variante === "linha") return <Linha {...props} />;
  return <Grande {...props} />;
}

const TINGIDOS: KpiProps[] = [
  { icone: Users, tom: "marca", valor: "12.847", rotulo: "Escolas atendidas", tendencia: "+12,3%", dica: "vs. 11.436 mês anterior" },
  { icone: DollarSign, tom: "sucesso", valor: "R$ 847M", rotulo: "Recursos transferidos", tendencia: "+8,7%", dica: "vs. R$ 779M trimestre anterior" },
  { icone: Clock, tom: "atencao", valor: "23", rotulo: "Pendências", tendencia: "-15,4%", dica: "vs. 27 semana anterior" },
  { icone: BarChart3, tom: "azul", valor: "94,2%", rotulo: "Taxa de execução", tendencia: "+2,1%", dica: "Meta: 95%" },
];

const LINHAS: KpiProps[] = [
  { valor: "5.423", rotulo: "Municípios", tendencia: "↑ 2%" },
  { valor: "R$ 1,2B", rotulo: "Orçamento anual", tendencia: "→ 0%", direcao: "estavel" },
  { valor: "326", rotulo: "Projetos ativos", tendencia: "↑ 18%" },
];

export default function NeumorfismoKpis() {
  return (
    <div className="neu-stack" style={{ gap: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        <CartaoKpi icone={Users} tom="marca" tendencia="12,3%" maiusculas rotulo="Total de atendimentos" valor="12.847" dica="Comparado ao mesmo ciclo de 2025" progresso={60} />
        <CartaoKpi icone={Download} tom="azul" tendencia="8,7%" maiusculas rotulo="Recursos aplicados" valor="R$ 8,47M" dica="Subvenção e consultoria técnica" progresso={64} />
        <CartaoKpi icone={AlertCircle} tom="atencao" tendencia="-15,4%" maiusculas rotulo="Pendências em análise" valor="23" dica="Empresas com ajuste de plano pendente" progresso={22} tomProgresso="atencao" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 }}>
        {TINGIDOS.map((k) => (
          <CartaoKpi key={k.rotulo} variante="tingida" {...k} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {LINHAS.map((k) => (
          <CartaoKpi key={k.rotulo} variante="linha" {...k} />
        ))}
      </div>
    </div>
  );
}
