import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComponentPreview } from "@/components/DSComponents";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { Etiqueta } from "@/components/estilo/NeumorfismoBadges";
import { CampoTexto } from "@/components/estilo/NeumorfismoCampos";

/**
 * Barra de filtros no estilo Neumorfismo (componente FilterBar do pacote Neumorphic UI v3.2.0), em dois leiautes:
 *  - "painel" (o padrão): um painel plano com o poço de busca, os Select no tamanho sm e a tecla "Mais filtros",
 *    e, abaixo, a fileira "Filtros ativos" com uma Etiqueta removível por filtro e o link "Limpar todos";
 *  - "linha": a barra leve que fica direto sobre a tela (ou, com `moldura`, sobre um painel plano), dentro de um
 *    role="search". A busca é um poço de 40px (Enter acrescenta "Busca: …"); cada Select, ao mudar, acrescenta ou
 *    troca a pílula "Campo: Valor" (a primeira opção, "Todos", a remove); o ✕ da pílula também zera o Select ou a
 *    busca; "Limpar todos" zera tudo. A fileira de pílulas é aria-live="polite" e só existe quando há filtros.
 * As classes neu-filters* e neu-filter-chip* vêm de src/styles/estilo.css. A vitrine (default) é o cartão "Filtros
 * Dinâmicos" da ComponentesPage e só é usada quando ESTILO.id === "neumorfismo".
 */

export type OpcaoFiltro = string | { value: string; label: string };

export interface SelecaoFiltro {
  rotulo: string;
  /** Identifica o Select nas pílulas; o rótulo, quando falta */
  chave?: string;
  /** A primeira opção significa "todos" */
  opcoes: OpcaoFiltro[];
}

export interface FiltroAtivo {
  id?: string;
  rotulo: string;
  /** Chave do Select a que a pílula pertence */
  select?: string;
  valor?: string;
}

export interface MudancaFiltros {
  busca: string;
  selects: Record<string, string>;
  filtros: string[];
}

export interface BarraFiltrosProps {
  variante?: "painel" | "linha";
  selects?: SelecaoFiltro[];
  placeholder?: string;
  /** Painel: filtros ativos iniciais, como texto */
  filtros?: string[];
  /** Linha: filtros ativos iniciais */
  filtrosIniciais?: FiltroAtivo[];
  /** Linha: põe a barra num painel plano */
  moldura?: boolean;
  /** false esconde a tecla "Mais filtros" */
  maisFiltros?: boolean;
  aoAbrirMaisFiltros?: () => void;
  aoMudar?: (m: MudancaFiltros) => void;
  /** Nome do landmark de busca */
  rotulo?: string;
}

const valorDe = (o: OpcaoFiltro) => (typeof o === "string" ? o : o.value);
const rotuloDe = (o: OpcaoFiltro) => (typeof o === "string" ? o : o.label);

interface SeletorProps {
  rotulo: string;
  opcoes: OpcaoFiltro[];
  valor: string;
  aoMudar: (v: string) => void;
}

/** Select sm do estilo (gatilho convexo de 40px e menu flutuante), controlado. */
function Seletor({ rotulo, opcoes, valor, aoMudar }: SeletorProps) {
  const uid = useId();
  return (
    <div className="neu-select neu-select--sm">
      <span className="neu-label" id={`${uid}-rotulo`}>{rotulo}</span>
      <Select value={valor} onValueChange={aoMudar}>
        <SelectTrigger id={`${uid}-gatilho`} aria-labelledby={`${uid}-rotulo ${uid}-gatilho`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="neu-select__menu" sideOffset={6}>
          {opcoes.map((o) => (
            <SelectItem key={valorDe(o)} value={valorDe(o)}>{rotuloDe(o)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const chaveDe = (s: SelecaoFiltro) => s.chave ?? s.rotulo;
const primeiros = (selects: SelecaoFiltro[]) => Object.fromEntries(selects.map((s) => [chaveDe(s), valorDe(s.opcoes[0])]));

function FiltrosPainel({ selects = [], placeholder, filtros = [], maisFiltros = true, aoAbrirMaisFiltros }: BarraFiltrosProps) {
  const [ativos, setAtivos] = useState(filtros);
  const [valores, setValores] = useState(() => primeiros(selects));
  return (
    <div className="neu-filters neu-card--flat">
      <div className="neu-filters__row">
        <div className="neu-filters__grow">
          <CampoTexto label="Buscar" icone={<Icone name="search" size={16} />} variante="plain" type="search" placeholder={placeholder ?? "Nome, código, município..."} />
        </div>
        {selects.map((s) => (
          <div key={chaveDe(s)} className="neu-filters__select">
            <Seletor rotulo={s.rotulo} opcoes={s.opcoes} valor={valores[chaveDe(s)]} aoMudar={(v) => setValores({ ...valores, [chaveDe(s)]: v })} />
          </div>
        ))}
        {maisFiltros && (
          <Button type="button" variant="outline" size="lg" className="neu-btn--convex neu-filters__more" onClick={aoAbrirMaisFiltros}>
            <Icone name="filter" size={16} />
            Mais filtros
          </Button>
        )}
      </div>
      {ativos.length > 0 && (
        <div className="neu-filters__chips" aria-live="polite">
          <span className="neu-filters__caption">Filtros ativos:</span>
          {ativos.map((f) => (
            <Etiqueta key={f} aoRemover={() => setAtivos(ativos.filter((x) => x !== f))}>{f}</Etiqueta>
          ))}
          <button type="button" className="neu-filters__clear" onClick={() => setAtivos([])}>Limpar todos</button>
        </div>
      )}
    </div>
  );
}

function FiltrosLinha({ selects = [], placeholder, filtrosIniciais = [], moldura, maisFiltros = true, aoAbrirMaisFiltros, aoMudar, rotulo }: BarraFiltrosProps) {
  const uid = useId();
  const [valores, setValores] = useState<Record<string, string>>(() => {
    const v = primeiros(selects);
    filtrosIniciais.forEach((f) => {
      if (f.select && f.valor) v[f.select] = f.valor;
    });
    return v;
  });
  const [ativos, setAtivos] = useState<FiltroAtivo[]>(filtrosIniciais);
  const [busca, setBusca] = useState("");

  const avisar = (proximos: FiltroAtivo[], vals: Record<string, string>, q: string) => aoMudar?.({ busca: q, selects: vals, filtros: proximos.map((f) => f.rotulo) });

  const mudarSelect = (s: SelecaoFiltro, v: string) => {
    const chave = chaveDe(s);
    const vals = { ...valores, [chave]: v };
    const resto = ativos.filter((f) => f.select !== chave);
    const opcao = s.opcoes.find((o) => valorDe(o) === v);
    const proximos = v === valorDe(s.opcoes[0]) || !opcao ? resto : [...resto, { id: `sel-${chave}`, select: chave, valor: v, rotulo: `${s.rotulo}: ${rotuloDe(opcao)}` }];
    setValores(vals);
    setAtivos(proximos);
    avisar(proximos, vals, busca);
  };

  const enviarBusca = () => {
    const t = busca.trim();
    const resto = ativos.filter((f) => f.id !== "busca");
    const proximos = t ? [...resto, { id: "busca", rotulo: `Busca: ${t}` }] : resto;
    setAtivos(proximos);
    avisar(proximos, valores, busca);
  };

  const remover = (f: FiltroAtivo) => {
    const proximos = ativos.filter((x) => x !== f);
    let vals = valores;
    if (f.select) {
      const s = selects.find((x) => chaveDe(x) === f.select);
      vals = { ...valores, [f.select]: s ? valorDe(s.opcoes[0]) : "" };
      setValores(vals);
    }
    if (f.id === "busca") setBusca("");
    setAtivos(proximos);
    avisar(proximos, vals, f.id === "busca" ? "" : busca);
  };

  const limpar = () => {
    const vals = primeiros(selects);
    setAtivos([]);
    setValores(vals);
    setBusca("");
    avisar([], vals, "");
  };

  return (
    <div className={`neu-filters-i${moldura ? " neu-filters-i--framed neu-card--flat" : ""}`}>
      <div className="neu-filters-i__bar" role="search" aria-label={rotulo ?? "Filtros de listagem"}>
        <div className="neu-filters-i__search">
          <label className="neu-filters-i__label" htmlFor={`${uid}-busca`}>Buscar</label>
          <div className="neu-filters-i__field">
            <span className="neu-filters-i__icon" aria-hidden="true">
              <Icone name="search" size={14} />
            </span>
            <input
              id={`${uid}-busca`}
              type="search"
              value={busca}
              placeholder={placeholder ?? "Nome, código, município..."}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  enviarBusca();
                }
              }}
            />
          </div>
        </div>
        {selects.map((s) => (
          <div key={chaveDe(s)} className="neu-filters-i__select">
            <Seletor
              rotulo={s.rotulo}
              opcoes={s.opcoes.map((o) => ({ value: valorDe(o), label: rotuloDe(o) }))}
              valor={valores[chaveDe(s)]}
              aoMudar={(v) => mudarSelect(s, v)}
            />
          </div>
        ))}
        {maisFiltros && (
          <Button type="button" variant="outline" className="neu-btn--convex neu-filters-i__more" onClick={aoAbrirMaisFiltros}>
            <Icone name="filter" size={16} />
            Mais filtros
          </Button>
        )}
      </div>
      {ativos.length > 0 && (
        <div className="neu-filters-i__chips" aria-live="polite">
          <span className="neu-filters-i__count">{ativos.length === 1 ? "1 filtro ativo:" : `${ativos.length} filtros ativos:`}</span>
          {ativos.map((f) => (
            <span key={f.id ?? f.rotulo} className="neu-filter-chip">
              {f.rotulo}
              <button type="button" className="neu-filter-chip__x" aria-label={`Remover filtro ${f.rotulo}`} onClick={() => remover(f)}>
                <Icone name="x" size={12} />
              </button>
            </span>
          ))}
          <button type="button" className="neu-filters-i__clear" onClick={limpar}>Limpar todos</button>
        </div>
      )}
    </div>
  );
}

export function BarraFiltros(props: BarraFiltrosProps) {
  return props.variante === "linha" ? <FiltrosLinha {...props} /> : <FiltrosPainel {...props} />;
}

const STATUS: SelecaoFiltro = {
  rotulo: "Status",
  opcoes: [
    { value: "todos", label: "Todos" },
    { value: "Ativo", label: "Ativo" },
    { value: "Pendente", label: "Pendente" },
  ],
};

const MUNICIPIO: SelecaoFiltro = {
  rotulo: "Município",
  opcoes: [
    { value: "todos", label: "Todos" },
    { value: "fortaleza", label: "Fortaleza" },
    { value: "sobral", label: "Sobral" },
    { value: "juazeiro", label: "Juazeiro do Norte" },
  ],
};

function Legenda({ children }: { children: string }) {
  return <p className="neu-filters-caption">{children}</p>;
}

export default function NeumorfismoFiltros() {
  return (
    <ComponentPreview
      title="Filtros Dinâmicos"
      description="Barra de filtros combinados com busca, selects, filtros ativos removíveis e limpar tudo, em dois leiautes: a barra em linha e o painel."
      whenToUse={["Listagens com muitos registros", "Dashboards com dados filtráveis", "Relatórios com parâmetros"]}
      whenNotToUse={["Listas com poucos itens (< 10)", "Quando há apenas 1 critério (use busca simples)"]}
      accessibility={[
        "A barra em linha fica num role=search com nome; a busca e cada Select têm rótulo visível",
        "Cada filtro ativo tem um botão com nome acessível (\"Remover filtro Status: Ativo\")",
        "A fileira de filtros ativos é aria-live=polite e anuncia a quantidade",
        "Enter na busca acrescenta o filtro; a primeira opção de cada Select (\"Todos\") o remove",
      ]}
      code={`const status = { rotulo: "Status", opcoes: [{ value: "todos", label: "Todos" }, { value: "Ativo", label: "Ativo" }, { value: "Pendente", label: "Pendente" }] };

{/* Barra em linha, direto sobre a tela */}
<BarraFiltros variante="linha" selects={[status]} />

{/* Em painel, com filtros já ativos */}
<BarraFiltros variante="linha" moldura selects={[municipio, status]}
  filtrosIniciais={[{ id: "busca", rotulo: "Busca: inovação" }]}
  aoMudar={({ busca, selects, filtros }) => aplicar(busca, selects)} />

{/* Painel de busca com a fileira "Filtros ativos" */}
<BarraFiltros selects={[municipio, status]} placeholder="Buscar por Razão Social, Nome Fantasia ou CNPJ..."
  filtros={["Município: Fortaleza", "Status: Em Execução"]} />`}
    >
      <div className="neu-stack" style={{ gap: 32 }}>
        <div>
          <Legenda>Barra em linha · direto sobre a tela</Legenda>
          <BarraFiltros variante="linha" selects={[STATUS]} />
        </div>
        <div>
          <Legenda>Barra em linha · com moldura e filtros ativos</Legenda>
          <BarraFiltros
            variante="linha"
            moldura
            selects={[MUNICIPIO, STATUS]}
            filtrosIniciais={[
              { id: "busca", rotulo: "Busca: inovação" },
              { id: "sel-Município", select: "Município", valor: "fortaleza", rotulo: "Município: Fortaleza" },
              { id: "sel-Status", select: "Status", valor: "Ativo", rotulo: "Status: Ativo" },
            ]}
          />
        </div>
        <div>
          <Legenda>Painel · busca, selects e filtros ativos</Legenda>
          <BarraFiltros
            placeholder="Buscar por Razão Social, Nome Fantasia ou CNPJ..."
            selects={[
              { rotulo: "Município", opcoes: ["Fortaleza (Capital)", "Sobral", "Juazeiro do Norte"] },
              { rotulo: "Status", opcoes: ["Em Execução", "Todos", "Pendente"] },
            ]}
            filtros={["Município: Fortaleza", "Status: Em Execução", "Programa: ALI Inovação"]}
          />
        </div>
      </div>
    </ComponentPreview>
  );
}
