import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { BarChart3, ChevronsLeft, ChevronsRight, House, LayoutGrid, Search, Settings, Users } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine da Sidebar em painel recolhível no estilo Neumorfismo (variante "panel" do componente Sidebar do pacote
 * Neumorphic UI v3.2.0): um trilho elevado de cantos 16px, embutido num layout, que vai de 260px a 68px. Expandido
 * traz a marca (quadrado convexo + título com sufixo + subtítulo), uma busca afundada que filtra por rótulo e
 * palavra-chave, os itens (o atual vira uma pílula clara com o ponto aceso; o contador é um chip) e um pé com o
 * estado atual numa pílula e a tecla de recolher. Recolhido, os rótulos somem, os itens viram teclas centradas de
 * ícone, o contador vira um ponto sobre o ícone, a busca vira uma tecla que expande o menu e põe o foco no campo, e
 * todo item mostra o nome numa dica ao passar o mouse e ao focar pelo teclado, além de levá-lo em aria-label. A seta
 * da tecla troca de ícone (esquerda ↔ direita) em vez de girar. Entra numa seção nova do neumorfismo ("Sidebar ·
 * Painel", depois da Gaveta) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-rail* vêm de
 * src/styles/estilo.css.
 */

export interface ItemPainel {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  /** Contador em chip; recolhido, vira um ponto sobre o ícone */
  selo?: number | string;
  href?: string;
  /** Termos extras que a busca também olha */
  palavrasChave?: string;
}

interface PainelLateralProps {
  itens: ItemPainel[];
  ativo?: string;
  ativoInicial?: string;
  aoNavegar?: (id: string) => void;
  recolhido?: boolean;
  recolhidoInicial?: boolean;
  aoAlterarRecolhido?: (recolhido: boolean) => void;
  /** Texto curto no quadrado da marca (ignorado se houver `logo`) */
  marca?: ReactNode;
  logo?: ReactNode;
  titulo?: string;
  sufixoTitulo?: string;
  subtitulo?: string;
  buscavel?: boolean;
  placeholderBusca?: string;
  largura?: number;
  larguraRecolhida?: number;
  mostrarEstado?: boolean;
  rotuloEstado?: string;
  textoExpandido?: string;
  textoRecolhido?: string;
  rotulo?: string;
  rotuloNav?: string;
}

function normalizar(t: string) {
  return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function PainelLateral({
  itens,
  ativo,
  ativoInicial,
  aoNavegar,
  recolhido,
  recolhidoInicial = false,
  aoAlterarRecolhido,
  marca = "M",
  logo,
  titulo = "Sua marca",
  sufixoTitulo,
  subtitulo,
  buscavel = true,
  placeholderBusca = "Buscar menu...",
  largura = 260,
  larguraRecolhida = 68,
  mostrarEstado = true,
  rotuloEstado = "Estado atual",
  textoExpandido = "Expandido",
  textoRecolhido = "Recolhido",
  rotulo = "Menu lateral",
  rotuloNav = "Navegação",
}: PainelLateralProps) {
  const [ativoInterno, setAtivoInterno] = useState(ativoInicial);
  const atual = ativo ?? ativoInterno;
  const [recolhidoInterno, setRecolhidoInterno] = useState(recolhidoInicial);
  const fechado = recolhido ?? recolhidoInterno;
  const [busca, setBusca] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  const querFoco = useRef(false);

  useEffect(() => {
    if (!fechado && querFoco.current && campo.current) {
      querFoco.current = false;
      campo.current.focus();
    }
  }, [fechado]);

  function mudar(valor: boolean) {
    if (recolhido === undefined) setRecolhidoInterno(valor);
    aoAlterarRecolhido?.(valor);
  }

  const nq = normalizar(busca.trim());
  const visiveis = itens.filter((it) => fechado || !nq || normalizar(it.rotulo + " " + (it.palavrasChave || "")).includes(nq));
  const dica = (texto: string) => (fechado ? <span className="neu-rail__tip" aria-hidden="true">{texto}</span> : null);

  function ir(id: string, e: MouseEvent, href?: string) {
    if (!href || href === "#") e.preventDefault();
    if (ativo === undefined) setAtivoInterno(id);
    aoNavegar?.(id);
  }

  return (
    <aside className="neu-rail" data-neu="painel" data-collapsed={fechado} aria-label={rotulo} style={{ width: fechado ? larguraRecolhida : largura }}>
      <div className="neu-rail__top">
        <div className="neu-rail__head">
          <span className="neu-rail__mark" aria-hidden="true">{logo ?? marca}</span>
          <div className="neu-rail__titles neu-rail__label">
            <p className="neu-rail__title">
              {titulo}
              {sufixoTitulo && <span className="neu-rail__suffix">{sufixoTitulo}</span>}
            </p>
            {subtitulo && <p className="neu-rail__subtitle">{subtitulo}</p>}
          </div>
        </div>
        {buscavel &&
          (fechado ? (
            <button
              type="button"
              className="neu-rail__item neu-rail__search-key"
              aria-label="Buscar no menu (expande o menu)"
              onClick={() => {
                querFoco.current = true;
                mudar(false);
              }}
            >
              <Search aria-hidden="true" size={16} />
              {dica("Buscar")}
            </button>
          ) : (
            <label className="neu-rail__search">
              <Search aria-hidden="true" size={14} />
              <input ref={campo} type="search" value={busca} placeholder={placeholderBusca} aria-label={placeholderBusca.replace(/\.+$/, "")} onChange={(e) => setBusca(e.target.value)} />
            </label>
          ))}
        <nav className="neu-rail__nav" aria-label={rotuloNav}>
          {visiveis.length ? (
            visiveis.map((it) => {
              const on = atual === it.id;
              return (
                <a
                  key={it.id}
                  href={it.href ?? "#"}
                  className="neu-rail__item"
                  aria-current={on ? "page" : undefined}
                  aria-label={fechado ? it.rotulo + (it.selo != null ? ` (${it.selo})` : "") : undefined}
                  onClick={(e) => ir(it.id, e, it.href)}
                >
                  {it.icone}
                  <span className="neu-rail__text neu-rail__label">{it.rotulo}</span>
                  {on ? <span className="neu-rail__led neu-rail__label" aria-hidden="true" /> : it.selo != null ? <span className="neu-rail__count neu-rail__label">{it.selo}</span> : null}
                  {fechado && it.selo != null && <span className="neu-rail__pip" aria-hidden="true" />}
                  {dica(it.rotulo)}
                </a>
              );
            })
          ) : (
            <p className="neu-rail__empty" role="status">Nenhum item encontrado.</p>
          )}
        </nav>
      </div>
      <div className="neu-rail__foot">
        {mostrarEstado && (
          <div className="neu-rail__state neu-rail__label">
            <span>{rotuloEstado}:</span>
            <span className="neu-rail__state-pill" role="status">{fechado ? textoRecolhido : textoExpandido}</span>
          </div>
        )}
        <button type="button" className="neu-rail__toggle" aria-expanded={!fechado} aria-label={fechado ? "Expandir menu lateral" : "Recolher menu lateral"} onClick={() => mudar(!fechado)}>
          {fechado ? <ChevronsRight aria-hidden="true" size={16} /> : <ChevronsLeft aria-hidden="true" size={16} />}
          {dica("Expandir menu")}
        </button>
      </div>
    </aside>
  );
}

const ITENS: ItemPainel[] = [
  { id: "inicio", rotulo: "Início / Dashboard", icone: <House size={16} />, palavrasChave: "painel" },
  { id: "programas", rotulo: "Programas", icone: <LayoutGrid size={16} />, selo: 4, palavrasChave: "soluções" },
  { id: "atendimentos", rotulo: "Atendimentos e MEI", icone: <Users size={16} />, palavrasChave: "clientes consultoria" },
  { id: "bi", rotulo: "Analytics & BI", icone: <BarChart3 size={16} />, palavrasChave: "relatórios indicadores" },
  { id: "parametros", rotulo: "Parâmetros", icone: <Settings size={16} />, palavrasChave: "configurações" },
];

function Numero({ rotulo, valor, destaque, nota }: { rotulo: string; valor: string; destaque?: boolean; nota: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 12, background: "var(--neu-flat)", border: "1px solid var(--neu-edge)" }}>
      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "hsl(var(--muted-foreground))" }}>{rotulo}</p>
      <p style={{ margin: "2px 0 0", fontFamily: "ui-monospace, monospace", fontSize: 16, fontWeight: 800, color: destaque ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}>{valor}</p>
      <p style={{ margin: 0, fontSize: 10, lineHeight: "14px", color: "hsl(var(--muted-foreground))" }}>{nota}</p>
    </div>
  );
}

export default function NeumorfismoPainelLateral() {
  const [recolhido, setRecolhido] = useState(false);
  return (
    <ComponentPreview
      title="Sidebar · Painel"
      description="O painel de navegação embutido no layout: um trilho elevado que vai de 260px a 68px. Expandido, mostra marca, busca, itens com contador e o estado; recolhido, vira teclas de ícone com dica, e a busca expande o menu."
      whenToUse={["Aplicações em que o menu fica ao lado do conteúdo e precisa ceder espaço a tabelas densas e painéis", "Poucos itens de primeiro nível, com ícones que se reconhecem sozinhos", "Layouts de painel administrativo com área de trabalho à direita"]}
      whenNotToUse={["Celular ou telas estreitas: use a gaveta", "Árvores de navegação com subitens: use a gaveta ou a Sidebar fixa", "Sites públicos: use o NavigationMenu"]}
      accessibility={[
        "O trilho é um aside com nome e a lista fica num nav com nome; o item atual leva aria-current=\"page\"",
        "A tecla de recolher tem aria-expanded e muda de nome (\"Recolher menu lateral\" / \"Expandir menu lateral\"); o estado atual é um status anunciado",
        "Recolhido, cada item leva o nome completo em aria-label (com o contador, se houver) e o mostra numa dica ao passar o mouse e ao focar pelo teclado",
        "A tecla de busca do trilho recolhido diz que expande o menu e, ao expandir, o foco vai para o campo",
        "A busca ignora caixa e acentos e olha também as palavras-chave; sem resultado, um status diz \"Nenhum item encontrado.\"",
        "O ativo se diferencia por relevo, cor e ponto; foco em anel sólido de 2px; a largura só anima com \"movimento\" permitido",
      ]}
      code={`const [recolhido, setRecolhido] = useState(false);

<PainelLateral
  marca="M"
  titulo="MARCA"
  sufixoTitulo="/UF"
  subtitulo="Painel fixo"
  ativoInicial="inicio"
  recolhido={recolhido}
  aoAlterarRecolhido={setRecolhido}
  itens={[
    { id: "inicio", rotulo: "Início / Dashboard", icone: <House size={16} /> },
    { id: "programas", rotulo: "Programas", icone: <LayoutGrid size={16} />, selo: 4 },
  ]}
/>`}
    >
      <div className="neu-rail-layout">
        <PainelLateral marca="M" titulo="MARCA" sufixoTitulo="/UF" subtitulo="Painel fixo" ativoInicial="inicio" recolhido={recolhido} aoAlterarRecolhido={setRecolhido} itens={ITENS} />
        <div style={{ flex: 1, minWidth: 0, padding: 20, borderRadius: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16, background: "var(--neu-convex-bg)", border: "1px solid var(--neu-edge)", boxShadow: "var(--neu-convex)" }}>
          <div className="neu-stack" style={{ gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="neu-dot neu-dot--success" aria-hidden="true" />
                <h5 style={{ margin: 0, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".05em", color: "hsl(var(--foreground))" }}>Área de trabalho principal</h5>
              </div>
              <span className="neu-badge neu-badge--inset neu-badge--sm" style={{ fontFamily: "ui-monospace, monospace", color: "hsl(var(--foreground))" }}>Menu: {recolhido ? "68" : "260"} px</span>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: "var(--neu-inset)", boxShadow: "var(--neu-inset-sh)", fontSize: 12, lineHeight: "18px" }}>
              <p style={{ margin: 0, fontSize: 12, lineHeight: "18px", fontWeight: 700, color: "hsl(var(--foreground))" }}>Comportamento ao recolher</p>
              <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: "18px", color: "hsl(var(--muted-foreground))" }}>Ao recolher, o menu passa de <strong>260px para 68px</strong> e o espaço horizontal fica livre para tabelas densas e painéis analíticos.</p>
              <p style={{ margin: "8px 0 0", fontSize: 11, lineHeight: "18px", color: "hsl(var(--muted-foreground))" }}>Cantos de 16px, relevo a 135° e dicas flutuantes nos ícones quando recolhido (também no foco do teclado).</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <Numero rotulo="Largura expandida" valor="260 px" nota="Rótulos, busca, contadores e hierarquia completa" />
            <Numero rotulo="Largura recolhida" valor="68 px" destaque nota="Ícones centralizados e dicas ao passar o mouse" />
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}
