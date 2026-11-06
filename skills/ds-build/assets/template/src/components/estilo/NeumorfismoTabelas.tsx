import { Fragment, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Download, Eye, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { MenuSuspenso, type ItemSuspenso } from "@/components/estilo/NeumorfismoMenuSuspenso";
import { TeclaKebab } from "@/components/estilo/NeumorfismoKebab";

/**
 * Tabela no estilo Neumorfismo (componente Table do pacote Neumorphic UI v3.2.0). Três leiaiutes:
 *  - "rica" (a padrão): as linhas num leito afundado, legenda em mono, cabeçalhos em caixa-alta e, com `selecionavel`, uma
 *    coluna de caixas (a do cabeçalho é uma tecla convexa; as das linhas ficam afundadas até serem marcadas) e uma barra
 *    convexa de ações em lote que aparece enquanto houver linhas marcadas;
 *  - "basica": listagem simples num painel elevado, cabeçalhos de 12px sobre uma fenda de 2px, linhas de 14px;
 *  - "moldurada": a mesma tabela dentro de uma moldura convexa, com o cabeçalho numa faixa afundada.
 * Nas duas últimas valem `listrada`, `bordas`, `semBordas`, `compacta`, `destacavel` / `aoClicarLinha` (a linha ganha um
 * tom quente ao passar o mouse e abre com Enter ou Espaço) e `tomCabecalho` ("marca" ou "azul": a faixa do cabeçalho
 * preenchida com a cor). Os auxiliares de célula (CelulaItem, Chip, Avaliacao, Estrelas, Situacao, Acao) montam as
 * células ricas. A vitrine (default) é o conjunto de cartões da seção "Tabela" da ComponentesPage, e só é usada quando
 * ESTILO.id === "neumorfismo". As classes neu-table* vêm de src/styles/estilo.css.
 */

export type TomTabela = "sucesso" | "azul" | "marca" | "perigo" | "atencao" | "neutro";
const CLASSE_TOM: Record<TomTabela, string> = { sucesso: "success", azul: "royal", marca: "accent", perigo: "danger", atencao: "warning", neutro: "neutral" };

export type Linha = Record<string, unknown>;

export interface ColunaTabela<L extends Linha = Linha> {
  chave: string;
  rotulo: string;
  alinhar?: "left" | "center" | "right";
  /** Nome da linha: peso médio e cor do texto */
  forte?: boolean;
  /** Texto secundário (cor apagada), na tabela básica */
  suave?: boolean;
  mono?: boolean;
  renderizar?: (valor: unknown, linha: L) => ReactNode;
}

export interface TabelaProps<L extends Linha = Linha> {
  variante?: "rica" | "basica" | "moldurada";
  colunas: ColunaTabela<L>[];
  linhas: L[];
  legenda?: string;
  /** Na básica e na moldurada a legenda só é lida por leitores de tela, a menos que seja visível */
  legendaVisivel?: boolean;
  selecionavel?: boolean;
  selecaoInicial?: number[];
  aoMudarSelecao?: (indices: number[]) => void;
  acoesEmLote?: boolean;
  listrada?: boolean;
  bordas?: boolean;
  semBordas?: boolean;
  compacta?: boolean;
  destacavel?: boolean;
  aoClicarLinha?: (linha: L, indice: number) => void;
  tomCabecalho?: "marca" | "azul";
}

function Base({ moldurada, children }: { moldurada: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rola, setRola] = useState(false);
  useEffect(() => {
    const checar = () => {
      const el = ref.current;
      if (el) setRola(el.scrollWidth > el.clientWidth + 1);
    };
    checar();
    window.addEventListener("resize", checar);
    return () => window.removeEventListener("resize", checar);
  }, []);
  return (
    <div ref={ref} className={["neu-table-basic", moldurada ? "neu-table-framed" : "neu-table-flat"].join(" ")} data-scrolls={rola}>
      {children}
    </div>
  );
}

const juntar = (...partes: (string | false | undefined | null)[]) => partes.filter(Boolean).join(" ");
const alinhamento = (c: { alinhar?: "left" | "center" | "right" }) => ({ textAlign: c.alinhar ?? "left" }) as const;

export function Tabela<L extends Linha = Linha>(props: TabelaProps<L>) {
  const { variante = "rica", colunas, linhas, legenda, legendaVisivel, aoClicarLinha } = props;
  const [marcadas, setMarcadas] = useState<number[]>(props.selecaoInicial ?? []);

  if (variante === "basica" || variante === "moldurada") {
    const moldurada = variante === "moldurada";
    return (
      <Base moldurada={moldurada}>
        <table
          className={juntar(
            "neu-table neu-table--basic",
            moldurada && "neu-table--framed",
            props.bordas && "neu-table--bordered",
            props.semBordas && "neu-table--borderless",
            props.compacta && "neu-table--compact",
            (props.destacavel || aoClicarLinha) && "neu-table--hoverable",
            props.tomCabecalho && `neu-table--head-${props.tomCabecalho === "marca" ? "accent" : "royal"}`,
          )}
        >
          {legenda ? <caption className={legendaVisivel ? "neu-table__caption" : "sr-only"}>{legenda}</caption> : null}
          <thead>
            <tr>
              {colunas.map((c) => (
                <th key={c.chave} scope="col" style={alinhamento(c)}>
                  {c.rotulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => {
              const abrir = aoClicarLinha ? () => aoClicarLinha(l, i) : undefined;
              const teclar = abrir
                ? (e: KeyboardEvent<HTMLTableRowElement>) => {
                    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      abrir();
                    }
                  }
                : undefined;
              return (
                <tr key={i} className={props.listrada && i % 2 === 0 ? "neu-table__row--stripe" : undefined} onClick={abrir} tabIndex={abrir ? 0 : undefined} onKeyDown={teclar}>
                  {colunas.map((c) => (
                    <td key={c.chave} className={c.forte ? "neu-table__strong" : c.suave ? "neu-table__muted" : c.mono ? "neu-table__mono" : undefined} style={alinhamento(c)}>
                      {c.renderizar ? c.renderizar(l[c.chave], l) : (l[c.chave] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Base>
    );
  }

  const todas = linhas.length > 0 && marcadas.length === linhas.length;
  const mudar = (novas: number[]) => {
    setMarcadas(novas);
    props.aoMudarSelecao?.(novas);
  };
  const alternar = (i: number) => mudar(marcadas.includes(i) ? marcadas.filter((x) => x !== i) : [...marcadas, i]);
  const alternarTodas = () => mudar(todas ? [] : linhas.map((_, i) => i));
  return (
    <div>
      {props.selecionavel && props.acoesEmLote !== false && marcadas.length > 0 ? (
        <div className="neu-bulkbar" role="status">
          <span className="neu-bulkbar__count">
            <span className="neu-bulkbar__badge" aria-hidden="true">
              <Icone name="check" size={12} />
            </span>
            {marcadas.length} {marcadas.length === 1 ? "item selecionado" : "itens selecionados"}
          </span>
          <span className="neu-bulkbar__actions">
            <Button size="sm">
              <Download size={14} /> Exportar Seleção
            </Button>
            <Button size="sm" variant="destructive">
              <Trash2 size={14} /> Excluir
            </Button>
          </span>
        </div>
      ) : null}
      <div className="neu-table-wrap">
        <table className={juntar("neu-table", props.listrada && "neu-table--striped")}>
          {legenda ? <caption className="neu-table__caption">{legenda}</caption> : null}
          <thead>
            <tr>
              {props.selecionavel ? (
                <th style={{ width: 48, textAlign: "center" }}>
                  <button type="button" role="checkbox" aria-checked={todas} aria-label="Selecionar todos" title="Selecionar todos" className="neu-table__all" onClick={alternarTodas}>
                    {todas ? <Icone name="check" size={12} /> : null}
                  </button>
                </th>
              ) : null}
              {colunas.map((c) => (
                <th key={c.chave} style={alinhamento(c)}>
                  {c.rotulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => {
              const marcada = marcadas.includes(i);
              return (
                <tr
                  key={i}
                  aria-selected={props.selecionavel ? marcada : undefined}
                  className={juntar(props.selecionavel && "neu-table__row--select", props.listrada && i % 2 === 0 && "neu-table__row--stripe")}
                  onClick={props.selecionavel ? () => alternar(i) : undefined}
                >
                  {props.selecionavel ? (
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={marcada}
                        aria-label="Selecionar linha"
                        className="neu-table__check"
                        onClick={(e) => {
                          e.stopPropagation();
                          alternar(i);
                        }}
                      >
                        {marcada ? <Icone name="check" size={12} /> : null}
                      </button>
                    </td>
                  ) : null}
                  {colunas.map((c) => (
                    <td key={c.chave} className={c.forte ? "neu-table__strong" : c.mono ? "neu-table__mono" : undefined} style={alinhamento(c)}>
                      {c.renderizar ? c.renderizar(l[c.chave], l) : (l[c.chave] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Nome com ícone (quadrado convexo tingido pelo tom) e, embaixo, o código em mono. */
export function CelulaItem({ icone, tom = "marca", titulo, codigo }: { icone?: string; tom?: TomTabela; titulo: string; codigo?: string }) {
  return (
    <div className="neu-table__item">
      {icone ? (
        <span className={`neu-table__item-icon neu-tone-${CLASSE_TOM[tom]}`}>
          <Icone name={icone} size={14} />
        </span>
      ) : null}
      <div>
        <span className="neu-table__item-title">{titulo}</span>
        {codigo ? <span className="neu-table__item-code">{codigo}</span> : null}
      </div>
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="neu-card__chip neu-tone-neutral">{children}</span>;
}

/** Nota em pílula convexa: estrela âmbar e o valor em mono. */
export function Avaliacao({ valor }: { valor: string | number }) {
  return (
    <span className="neu-table__rating" aria-label={`Avaliação ${valor}`}>
      <span className="neu-table__star" aria-hidden="true">
        ★
      </span>
      <span className="neu-mono">{valor}</span>
    </span>
  );
}

/** "4.8 ★" em texto corrido, para a tabela básica. */
export function Estrelas({ valor }: { valor: string | number }) {
  return (
    <span className="neu-table__stars" aria-label={`Avaliação ${valor}`}>
      {valor} <span aria-hidden="true">★</span>
    </span>
  );
}

/** Pílula convexa com um ponto aceso e a palavra: o estado nunca fica só na cor. */
export function Situacao({ tom = "sucesso", children }: { tom?: TomTabela; children: ReactNode }) {
  return (
    <span className={`neu-table__status neu-tone-${CLASSE_TOM[tom]}`}>
      <span className={`neu-dot neu-dot--${CLASSE_TOM[tom]}`} aria-hidden="true" />
      {children}
    </span>
  );
}

/** Tecla convexa de 28px com o ⋮; não deixa o clique marcar a linha. */
export function Acao({ rotulo = "Mais opções", aoClicar }: { rotulo?: string; aoClicar?: () => void }) {
  return (
    <button
      type="button"
      className="neu-table__action"
      aria-label={rotulo}
      title={rotulo}
      onClick={(e) => {
        e.stopPropagation();
        aoClicar?.();
      }}
    >
      <Icone name="more-vertical" size={16} />
    </button>
  );
}

const ITENS_LINHA: ItemSuspenso[] = [
  { rotulo: "Visualizar", icone: <Eye size={14} /> },
  { rotulo: "Editar", icone: <SquarePen size={14} /> },
  { divisor: true },
  { rotulo: "Excluir", icone: <Trash2 size={14} />, perigo: true },
];

function Kebab({ programa }: { programa: string }) {
  const nome = `Ações de ${programa}`;
  return <MenuSuspenso gatilho={<TeclaKebab aria-label={nome} onClick={(e) => e.stopPropagation()} />} rotulo={nome} alinhar="end" variante="lista" itens={ITENS_LINHA} />;
}

interface Programa extends Linha {
  prog: string;
  cat: string;
  valor: string;
  qtd: string;
  nota: string;
  st: string;
  stTom: TomTabela;
  codigo?: string;
  icone?: string;
  tom?: TomTabela;
}

const PROGRAMAS: Programa[] = [
  { prog: "Educação Empreendedora", codigo: "PROG-EDU-01", icone: "graduation-cap", tom: "marca", cat: "Formação", valor: "R$ 1.250", qtd: "45", nota: "4.8", st: "Ativo", stTom: "sucesso" },
  { prog: "Transformação Digital", codigo: "PROG-DIG-02", icone: "monitor", tom: "azul", cat: "Consultoria", valor: "R$ 2.400", qtd: "18", nota: "4.9", st: "Em Andamento", stTom: "azul" },
  { prog: "Sustentabilidade & ESG", codigo: "PROG-ESG-03", icone: "pie-chart", tom: "sucesso", cat: "Inovação", valor: "R$ 980", qtd: "32", nota: "4.6", st: "Pendente", stTom: "marca" },
  { prog: "Liderança Feminina", codigo: "PROG-LID-04", icone: "users", tom: "perigo", cat: "Gestão", valor: "R$ 1.850", qtd: "60", nota: "5.0", st: "Ativo", stTom: "sucesso" },
];

const MAIS_PROGRAMAS: Programa[] = [
  ...PROGRAMAS,
  { prog: "Gestão Financeira", cat: "Formação", valor: "R$ 760", qtd: "52", nota: "4.7", st: "Ativo", stTom: "sucesso" },
  { prog: "Mercado & Vendas", cat: "Consultoria", valor: "R$ 1.120", qtd: "27", nota: "4.5", st: "Em Andamento", stTom: "azul" },
];

const COLUNAS_BASICAS: ColunaTabela<Programa>[] = [
  { chave: "prog", rotulo: "Programa", forte: true },
  { chave: "cat", rotulo: "Categoria", suave: true },
  { chave: "valor", rotulo: "Valor" },
  { chave: "qtd", rotulo: "Qtd" },
  { chave: "nota", rotulo: "Avaliação", renderizar: (v) => <Estrelas valor={String(v)} /> },
  { chave: "st", rotulo: "Status", renderizar: (v, l) => <Situacao tom={l.stTom}>{String(v)}</Situacao> },
  { chave: "acoes", rotulo: "Ações", alinhar: "right", renderizar: (_, l) => <Kebab programa={l.prog} /> },
];

const COLUNAS_RICAS: ColunaTabela<Programa>[] = [
  { chave: "prog", rotulo: "Programa", renderizar: (v, l) => <CelulaItem icone={l.icone} tom={l.tom} titulo={String(v)} codigo={l.codigo} /> },
  { chave: "cat", rotulo: "Categoria", renderizar: (v) => <Chip>{String(v)}</Chip> },
  { chave: "valor", rotulo: "Valor", renderizar: (v) => <span className="neu-table__money">{String(v)}</span> },
  { chave: "qtd", rotulo: "Qtd", alinhar: "center", mono: true },
  { chave: "nota", rotulo: "Avaliação", alinhar: "center", renderizar: (v) => <Avaliacao valor={String(v)} /> },
  { chave: "st", rotulo: "Status", alinhar: "center", renderizar: (v, l) => <Situacao tom={l.stTom}>{String(v)}</Situacao> },
  { chave: "acoes", rotulo: "Ações", alinhar: "right", renderizar: (_, l) => <Acao rotulo={`Opções do programa: ${l.prog}`} /> },
];

interface Turma {
  turma: string;
  inicio: string;
  vagas: string;
  st: string;
  stTom: TomTabela;
}

const TURMAS: Record<string, Turma[]> = {
  "Educação Empreendedora": [
    { turma: "Turma A · Fortaleza", inicio: "03/03/2026", vagas: "25", st: "Ativo", stTom: "sucesso" },
    { turma: "Turma B · Sobral", inicio: "17/03/2026", vagas: "20", st: "Pendente", stTom: "marca" },
  ],
  "Transformação Digital": [
    { turma: "Turma A · Online", inicio: "10/03/2026", vagas: "18", st: "Em Andamento", stTom: "azul" },
  ],
  "Sustentabilidade & ESG": [
    { turma: "Turma A · Juazeiro do Norte", inicio: "24/03/2026", vagas: "32", st: "Pendente", stTom: "marca" },
    { turma: "Turma B · Online", inicio: "31/03/2026", vagas: "30", st: "Pendente", stTom: "marca" },
  ],
};

/** Tabela básica com linhas que abrem e mostram, logo abaixo, uma subtabela afundada com o detalhamento. */
export function TabelaAninhada() {
  const [aberta, setAberta] = useState<number | null>(null);
  const linhas = PROGRAMAS.slice(0, 3);
  return (
    <Base moldurada>
      <table className="neu-table neu-table--basic neu-table--framed neu-table--nested">
        <caption className="sr-only">Programas com o detalhamento das turmas</caption>
        <thead>
          <tr>
            <th scope="col" style={{ width: 44 }}>
              <span className="sr-only">Detalhes</span>
            </th>
            <th scope="col">Programa</th>
            <th scope="col">Categoria</th>
            <th scope="col">Valor</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => {
            const aberto = aberta === i;
            const turmas = TURMAS[l.prog] ?? [];
            return (
              <Fragment key={l.prog}>
                <tr className={aberto ? "neu-table__row--open" : undefined}>
                  <td>
                    <button
                      type="button"
                      className="neu-table__expand"
                      aria-expanded={aberto}
                      aria-controls={`neu-table-turmas-${i}`}
                      aria-label={`${aberto ? "Recolher" : "Expandir"} turmas de ${l.prog}`}
                      onClick={() => setAberta(aberto ? null : i)}
                    >
                      <Icone name={aberto ? "chevron-down" : "chevron-right"} size={14} />
                    </button>
                  </td>
                  <td className="neu-table__strong">{l.prog}</td>
                  <td className="neu-table__muted">{l.cat}</td>
                  <td>{l.valor}</td>
                  <td>
                    <Situacao tom={l.stTom}>{l.st}</Situacao>
                  </td>
                </tr>
                {aberto ? (
                  <tr className="neu-table__detail">
                    <td />
                    <td colSpan={4} id={`neu-table-turmas-${i}`}>
                      <div className="neu-table__sub">
                        <table className="neu-table neu-table--basic neu-table--compact">
                          <caption className="sr-only">Turmas de {l.prog}</caption>
                          <thead>
                            <tr>
                              <th scope="col">Turma</th>
                              <th scope="col">Início</th>
                              <th scope="col">Vagas</th>
                              <th scope="col">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {turmas.map((t) => (
                              <tr key={t.turma}>
                                <td className="neu-table__strong">{t.turma}</td>
                                <td>{t.inicio}</td>
                                <td>{t.vagas}</td>
                                <td>
                                  <Situacao tom={t.stTom}>{t.st}</Situacao>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </Base>
  );
}

const CODIGO_COLUNAS = `const colunas = [
  { chave: "prog", rotulo: "Programa", forte: true },
  { chave: "cat", rotulo: "Categoria", suave: true },
  { chave: "valor", rotulo: "Valor" },
  { chave: "nota", rotulo: "Avaliação", renderizar: (v) => <Estrelas valor={v} /> },
  { chave: "st", rotulo: "Status", renderizar: (v, l) => <Situacao tom={l.stTom}>{v}</Situacao> },
  { chave: "acoes", rotulo: "Ações", alinhar: "right", renderizar: (_, l) => <Kebab programa={l.prog} /> },
];
`;

export default function NeumorfismoTabelas() {
  return (
    <>
      <ComponentPreview
        title="Tabela Básica"
        description="Listagem simples num painel elevado, com cabeçalho, dados e ações via menu kebab."
        whenToUse={["Listagens curtas, só de leitura", "Dashboards administrativos", "Quando as linhas não precisam de ícones, seleção ou ações em lote"]}
        whenNotToUse={["Linhas com ícones e seleção em lote: use a tabela com seleção"]}
        accessibility={["Cabeçalhos com scope=\"col\"", "A legenda é lida só por leitores de tela, a menos que seja visível", "Menu kebab acessível com teclado; o painel rola de lado quando a tabela é mais larga"]}
        code={`${CODIGO_COLUNAS}
<Tabela variante="basica" legenda="Programas da instituição" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="basica" legenda="Programas da instituição" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela Customizada"
        description="A tabela dentro de uma moldura convexa, com o cabeçalho numa faixa afundada."
        whenToUse={["Quando a tabela está sozinha na tela e precisa de um cabeçalho claro"]}
        whenNotToUse={["Dentro de um painel que já a emoldura: use a básica"]}
        code={`<Tabela variante="moldurada" legenda="Programas da instituição (tabela customizada)" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="moldurada" legenda="Programas da instituição (tabela customizada)" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela com Linhas Listradas"
        description="Zebra-striping para melhorar a legibilidade em tabelas com muitas linhas: as linhas pares viram sulcos rasos."
        whenToUse={["A partir de umas oito linhas, ou quando as linhas são largas e o olhar se perde"]}
        code={`<Tabela variante="basica" listrada legenda="Programas da instituição (linhas listradas)" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="basica" listrada legenda="Programas da instituição (linhas listradas)" colunas={COLUNAS_BASICAS} linhas={MAIS_PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela com Bordas"
        description="Grade de linhas finas em todas as células, para comparações densas; o cabeçalho vira uma faixa afundada."
        whenToUse={["Quando o leitor compara valores entre linhas e colunas (preços, cotas, horários)"]}
        whenNotToUse={["Listagens simples: prefira linhas sem grade"]}
        code={`<Tabela variante="basica" bordas legenda="Programas da instituição (com bordas)" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="basica" bordas legenda="Programas da instituição (com bordas)" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela sem Bordas"
        description="A listagem mais quieta: sem régua no cabeçalho nem fendas entre as linhas; no hover a linha sobe numa faixa suave."
        whenToUse={["Listas curtas (até umas seis linhas), como resumos dentro de um cartão"]}
        code={`<Tabela variante="basica" semBordas legenda="Programas da instituição (sem bordas)" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="basica" semBordas legenda="Programas da instituição (sem bordas)" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela Compacta"
        description="Espaçamento reduzido para exibir mais dados em menos espaço: a linha cai de cerca de 60px para 40px."
        whenToUse={["Listas operacionais longas, painéis laterais e gavetas"]}
        code={`<Tabela variante="basica" compacta listrada legenda="Programas da instituição (compacta)" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="basica" compacta listrada legenda="Programas da instituição (compacta)" colunas={COLUNAS_BASICAS} linhas={MAIS_PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela com Hover"
        description="Linhas que abrem algo: ao passar o mouse a linha ganha um tom quente e o cursor de clique; com o teclado, Enter ou Espaço abrem."
        whenToUse={["Quando a linha inteira leva ao detalhe"]}
        accessibility={["Com aoClicarLinha as linhas recebem foco e abrem com Enter ou Espaço", "Controles dentro da linha (menus ⋮, links) não abrem a linha"]}
        code={`<Tabela variante="basica" aoClicarLinha={(linha) => abrir(linha)} legenda="Programas da instituição (com hover)" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="basica" aoClicarLinha={() => {}} legenda="Programas da instituição (com hover)" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela com Cabeçalho Destacado"
        description="A faixa do cabeçalho preenchida com a cor da marca (ou o azul), com o texto em branco e em negrito."
        whenToUse={["A listagem principal de uma página (uma só por tela)"]}
        accessibility={["Branco sobre a cor da marca tem contraste menor: o cabeçalho é em negrito e curto. Com muitos cabeçalhos ou onde o contraste importa mais, use o azul"]}
        code={`<Tabela variante="moldurada" tomCabecalho="marca" colunas={colunas} linhas={programas} />
<Tabela variante="moldurada" tomCabecalho="azul" colunas={colunas} linhas={programas} />`}
      >
        <div className="neu-stack" style={{ display: "grid", gap: 24 }}>
          <Tabela variante="moldurada" tomCabecalho="marca" legenda="Programas da instituição (cabeçalho destacado)" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
          <Tabela variante="moldurada" tomCabecalho="azul" legenda="Programas da instituição (cabeçalho destacado azul)" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
        </div>
      </ComponentPreview>

      <ComponentPreview
        title="Tabela Aninhada (Nesting)"
        description="Linhas expansíveis que revelam detalhes adicionais numa subtabela afundada."
        whenToUse={["Detalhamento de itens", "Turmas, variantes ou parcelas de um programa"]}
        accessibility={["A tecla de expandir tem aria-expanded e aria-controls e um nome que diz qual linha abre", "A subtabela tem legenda e cabeçalhos próprios"]}
        code={`<TabelaAninhada />`}
      >
        <TabelaAninhada />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela com Caption"
        description="Legenda visível para contextualizar o conteúdo da tabela — essencial para acessibilidade."
        whenToUse={["Tabelas que precisam de um título próprio, ou que aparecem fora de um cartão com título"]}
        accessibility={["A legenda é o primeiro elemento da tabela e dá o nome acessível a ela"]}
        code={`<Tabela variante="basica" legendaVisivel legenda="Lista de programas educacionais do Instituto" colunas={colunas} linhas={programas} />`}
      >
        <Tabela variante="basica" legendaVisivel legenda="Lista de programas educacionais e de consultoria" colunas={COLUNAS_BASICAS} linhas={PROGRAMAS} />
      </ComponentPreview>

      <ComponentPreview
        title="Tabela com Seleção (Checkbox)"
        description="Linhas num leito afundado, com células ricas, caixas de seleção e uma barra de ações em lote que aparece enquanto houver linhas marcadas."
        whenToUse={["Exclusão em lote", "Exportação selecionada", "Ações em massa"]}
        accessibility={["As caixas são role=\"checkbox\" com aria-checked e nome; a do cabeçalho seleciona todas", "Clicar em qualquer ponto da linha alterna a seleção; o ⋮ não alterna", "A barra de ações avisa a contagem como região de status"]}
        code={`<Tabela
  selecionavel
  legenda="Lista de programas educacionais e de consultoria"
  colunas={[
    { chave: "prog", rotulo: "Programa", renderizar: (v, l) => <CelulaItem icone={l.icone} tom={l.tom} titulo={v} codigo={l.codigo} /> },
    { chave: "cat", rotulo: "Categoria", renderizar: (v) => <Chip>{v}</Chip> },
    { chave: "nota", rotulo: "Avaliação", alinhar: "center", renderizar: (v) => <Avaliacao valor={v} /> },
    { chave: "st", rotulo: "Status", alinhar: "center", renderizar: (v, l) => <Situacao tom={l.stTom}>{v}</Situacao> },
    { chave: "acoes", rotulo: "Ações", alinhar: "right", renderizar: () => <Acao rotulo="Opções do programa" /> },
  ]}
  linhas={programas}
/>`}
      >
        <Tabela selecionavel legenda="Lista de programas educacionais e de consultoria" colunas={COLUNAS_RICAS} linhas={PROGRAMAS} />
      </ComponentPreview>
    </>
  );
}
