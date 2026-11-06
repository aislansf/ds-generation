import type { ReactNode } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Header no estilo Neumorfismo (componente Header do pacote Neumorphic UI v3.2.0): a barra institucional
 * do topo em cinco variantes. Banner: faixa de programa em degradê sobre uma barra operacional escura, com chip de
 * edição, tecla de menu, contexto e um LED de status. Compacto: barra de 64px com tecla de menu, marca, código do
 * sistema, nome, sino e a sigla da unidade. Classificado: faixa dourada de classificação da informação (nunca
 * dispensável, sempre com o nível escrito) sobre a barra azul. Barra: só a barra azul de navegação. Completo
 * (padrão): barra inteira na cor do cabeçalho, com marca, produto, pílula de classificação, busca afundada com
 * Ctrl+K, sino e usuário. As cores (degradês do azul, a barra escura, o dourado da classificação) saem da cor de
 * cabeçalho da marca (`--header-background`) e do aviso do DS, não do azul fixo do pacote. Abaixo de 640px a
 * marca e o separador somem, o título do sistema trunca e o banner empilha o chip. Entra numa seção nova do
 * neumorfismo ("Header", depois do NavigationMenu) e só é usado quando ESTILO.id === "neumorfismo". As classes
 * neu-header* vêm de src/styles/estilo.css; as teclas são botões com nome acessível.
 */

type Variante = "banner" | "compacto" | "classificado" | "barra" | "completo";

interface CabecalhoBase {
  variante?: Variante;
}

interface CabecalhoBanner extends CabecalhoBase {
  variante: "banner";
  sobretitulo: string;
  titulo: string;
  edicao?: string;
  contexto: string;
  /** Texto do LED de status; `null` o esconde (padrão: "Sincronizado") */
  status?: string | null;
  aoMenu?: () => void;
  rotuloMenu?: string;
}

interface CabecalhoCompacto extends CabecalhoBase {
  variante: "compacto";
  logo?: ReactNode;
  /** Letra no quadrado branco, quando não há `logo` */
  inicialLogo?: string;
  marca: string;
  sufixoMarca?: string;
  codigoApp?: string;
  nomeApp: string;
  naoLidas?: boolean;
  siglaOrg?: string;
  rotuloSigla?: string;
  aoMenu?: () => void;
  rotuloMenu?: string;
}

interface CabecalhoFaixa extends CabecalhoBase {
  variante: "classificado" | "barra";
  /** Só no classificado: o nível da informação, sempre por extenso */
  classificacao?: string;
  rotuloClassificacao?: string;
  notaClassificacao?: string;
  logo?: ReactNode;
  marca: string;
  nomeApp: string;
  unidade?: string;
  /** Teclas à direita (ex.: o botão de tema): use .neu-header-c__key para o mesmo relevo das teclas do cabeçalho */
  acoes?: ReactNode;
  /** Sem cantos arredondados nem borda, para faixa de borda a borda */
  rente?: boolean;
  aoMenu?: () => void;
  rotuloMenu?: string;
}

interface CabecalhoCompleto extends CabecalhoBase {
  variante?: "completo";
  /** A marca do consumidor: este sistema não traz marca institucional própria */
  marca: ReactNode;
  nomeApp?: string;
  descricaoApp?: string;
  classificacao?: string;
  placeholderBusca?: string;
  naoLidas?: boolean;
  usuario?: { iniciais: string; nome: string; cargo: string };
}

export type CabecalhoProps = CabecalhoBanner | CabecalhoCompacto | CabecalhoFaixa | CabecalhoCompleto;

function TeclaMenu({ classe, aoMenu, rotulo = "Abrir menu", tamanho }: { classe: string; aoMenu?: () => void; rotulo?: string; tamanho: number }) {
  return (
    <button type="button" className={classe} aria-label={rotulo} title={rotulo} onClick={aoMenu}>
      <Menu aria-hidden="true" size={tamanho} />
    </button>
  );
}

export function Cabecalho(props: CabecalhoProps) {
  if (props.variante === "banner") {
    const { sobretitulo, titulo, edicao, contexto, status = "Sincronizado", aoMenu, rotuloMenu } = props;
    return (
      <header className="neu-header-b">
        <div className="neu-header-b__banner">
          <div>
            <span className="neu-header-b__eyebrow">{sobretitulo}</span>
            <h3 className="neu-header-b__title">{titulo}</h3>
          </div>
          {edicao && <span className="neu-header-b__chip">{edicao}</span>}
        </div>
        <div className="neu-header-b__bar">
          <div className="neu-header-b__lead">
            <TeclaMenu classe="neu-header-c__key neu-header-k__menu" aoMenu={aoMenu} rotulo={rotuloMenu} tamanho={18} />
            <span className="neu-header-b__context">{contexto}</span>
          </div>
          {status !== null && (
            <span className="neu-header-b__status" role="status">
              <i />
              {status}
            </span>
          )}
        </div>
      </header>
    );
  }
  if (props.variante === "compacto") {
    const { logo, inicialLogo, marca, sufixoMarca, codigoApp, nomeApp, naoLidas, siglaOrg, rotuloSigla, aoMenu, rotuloMenu } = props;
    return (
      <header className="neu-header-c">
        <div className="neu-header-c__lead">
          <TeclaMenu classe="neu-header-c__key neu-header-c__menu" aoMenu={aoMenu} rotulo={rotuloMenu} tamanho={20} />
          <div className="neu-header-c__brand">
            {logo ?? (inicialLogo && <span className="neu-header-c__tile">{inicialLogo}</span>)}
            <span className="neu-header-c__name">
              {marca}
              {sufixoMarca && <span>{sufixoMarca}</span>}
            </span>
          </div>
          <span className="neu-header-c__sep" aria-hidden="true" />
          <div className="neu-header-c__app">
            {codigoApp && <span className="neu-header-c__code">{codigoApp}</span>}
            <span className="neu-header-c__title">{nomeApp}</span>
          </div>
        </div>
        <div className="neu-header-c__tools">
          <button type="button" className="neu-header-c__key neu-header-c__bell" aria-label={naoLidas ? "Notificações (há novas)" : "Notificações"}>
            <Bell aria-hidden="true" size={18} />
            {naoLidas && <i />}
          </button>
          {siglaOrg && <span className="neu-header-c__org" title={rotuloSigla}>{siglaOrg}</span>}
        </div>
      </header>
    );
  }
  if (props.variante === "classificado" || props.variante === "barra") {
    const { classificacao, rotuloClassificacao = "Classificação da informação:", notaClassificacao, logo, marca, nomeApp, unidade, acoes, rente, aoMenu, rotuloMenu } = props;
    const faixa = props.variante === "classificado";
    return (
      <header className={`neu-header-k${faixa ? "" : " neu-header-k--bar"}${rente ? " neu-header-k--flush" : ""}`}>
        {faixa && classificacao && (
          <div className="neu-header-k__strip" role="note" aria-label={`${rotuloClassificacao.replace(/:$/, "")}: ${classificacao}`}>
            <div className="neu-header-k__class">
              <span className="neu-header-k__dot" />
              <span>{rotuloClassificacao}</span>
              <span className="neu-header-k__tag">{classificacao}</span>
            </div>
            {notaClassificacao && <span className="neu-header-k__note">{notaClassificacao}</span>}
          </div>
        )}
        <div className="neu-header-k__bar">
          <div className="neu-header-k__lead">
            <TeclaMenu classe="neu-header-c__key neu-header-k__menu" aoMenu={aoMenu} rotulo={rotuloMenu} tamanho={18} />
            <div className="neu-header-k__brand">
              {logo ?? <span className="neu-header-k__name">{marca}</span>}
              <span className="neu-header-k__pipe" aria-hidden="true">|</span>
              <span className="neu-header-k__app">{nomeApp}</span>
            </div>
          </div>
          {acoes ? (
            <div className="neu-header-k__tail">
              {unidade && <span className="neu-header-k__unit">{unidade}</span>}
              {acoes}
            </div>
          ) : (
            unidade && <span className="neu-header-k__unit">{unidade}</span>
          )}
        </div>
      </header>
    );
  }
  // as outras variantes já saíram acima; o que sobra é o completo (a variante é opcional, então o TS não estreita sozinho)
  const { marca, nomeApp, descricaoApp, classificacao, placeholderBusca = "Buscar no sistema ou atalhos...", naoLidas, usuario } = props as CabecalhoCompleto;
  return (
    <header className="neu-header">
      <div className="neu-header__brand">
        {marca}
        {nomeApp && <span className="neu-header__sep" aria-hidden="true" />}
        {nomeApp && (
          <span className="neu-header__app">
            <b>{nomeApp}</b>
            {descricaoApp && <small>{descricaoApp}</small>}
          </span>
        )}
        {classificacao && (
          <span className="neu-header__class">
            <i aria-hidden="true" />
            {classificacao}
          </span>
        )}
      </div>
      <div className="neu-header__tools">
        <label className="neu-header__search">
          <Search aria-hidden="true" size={16} />
          <input placeholder={placeholderBusca} aria-label="Buscar" />
          <kbd>Ctrl+K</kbd>
        </label>
        <button type="button" className="neu-header__btn" aria-label={naoLidas ? "Notificações (há novas)" : "Notificações"}>
          <Bell aria-hidden="true" size={20} />
          {naoLidas && <i />}
        </button>
        {usuario && (
          <div className="neu-header__user">
            <span className="neu-header__avatar" aria-hidden="true">{usuario.iniciais}</span>
            <span>
              <b>{usuario.nome}</b>
              <small>{usuario.cargo}</small>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoCabecalhos() {
  return (
    <ComponentPreview
      title="Header"
      description="A barra institucional do topo, em cinco variantes: banner, compacto, classificado, barra e completo. As cores saem da cor de cabeçalho da marca; a faixa de classificação é dourada."
      whenToUse={["Banner: páginas de programa e painéis operacionais que abrem um contexto regional ou temático", "Compacto: quando a página tem menu lateral em gaveta ou não precisa de busca na barra", "Classificado: telas cujo conteúdo tem nível de acesso: a faixa diz o nível por extenso", "Barra: portais secundários e áreas internas que pedem uma barra mais leve", "Completo: o cabeçalho principal do sistema, com busca, notificações e usuário"]}
      whenNotToUse={["Navegar entre páginas do site: use o NavigationMenu", "Comandos de aplicativo: use o Menubar"]}
      accessibility={[
        "Cada cabeçalho é um <header>; as teclas só de ícone (menu, notificações) são botões com nome acessível (\"Abrir menu\", \"Notificações\")",
        "A faixa de classificação é um role=\"note\" com o nível por extenso: nunca depende só da cor dourada, e não é dispensável",
        "O LED de status do banner está num role=\"status\" com o texto \"Sincronizado\"",
        "A busca do completo é um campo com rótulo (\"Buscar\") e a dica Ctrl+K",
        "O texto branco lê no degradê inteiro; abaixo de 640px a marca some e o nome do sistema trunca em 200px",
      ]}
      code={`<Cabecalho variante="banner" sobretitulo="Programa Regional de Competitividade" titulo="Ecossistema de Inovação & Pequenos Negócios" edicao="Edição 2026" contexto="Painel Operacional" />

<Cabecalho variante="compacto" inicialLogo="M" marca="MARCA" sufixoMarca="/UF" codigoApp="SGED" nomeApp="Sistema de Gestão Estratégica Digital" naoLidas siglaOrg="UF" />

<Cabecalho variante="barra" marca="MARCA-UF" nomeApp="Portal do Consultor de Campo" unidade="Unidade de Gestão de Projetos" />

<Cabecalho variante="classificado" classificacao="Conteúdo interno / todos" notaClassificacao="Marca UF · Uso oficial" marca="MARCA-UF" nomeApp="Portal do Consultor de Campo" unidade="Unidade de Gestão de Projetos" />

<Cabecalho marca={<span className="neu-header__mark">Sua marca</span>} nomeApp="SGED" descricaoApp="Sistema de Gestão Estratégica Digital" classificacao="Conteúdo interno" naoLidas usuario={{ iniciais: "RC", nome: "Rodrigo Cordeiro", cargo: "Coordenador Regional" }} />`}
    >
      <div className="neu-stack" style={{ gap: 28 }}>
        <div>
          <Legenda>Banner</Legenda>
          <Cabecalho variante="banner" sobretitulo="Programa Regional de Competitividade" titulo="Ecossistema de Inovação & Pequenos Negócios" edicao="Edição 2026" contexto="Painel Operacional Fortaleza & Região Metropolitana" />
        </div>
        <div>
          <Legenda>Compacto</Legenda>
          <Cabecalho variante="compacto" inicialLogo="M" marca="MARCA" sufixoMarca="/UF" codigoApp="SGED" nomeApp="Sistema de Gestão Estratégica Digital" naoLidas siglaOrg="UF" rotuloSigla="Unidade" />
        </div>
        <div>
          <Legenda>Barra</Legenda>
          <Cabecalho variante="barra" marca="MARCA-UF" nomeApp="Portal do Consultor de Campo" unidade="Unidade de Gestão de Projetos" />
        </div>
        <div>
          <Legenda>Classificado</Legenda>
          <Cabecalho variante="classificado" classificacao="Conteúdo interno / todos" notaClassificacao="Marca UF · Uso oficial" marca="MARCA-UF" nomeApp="Portal do Consultor de Campo" unidade="Unidade de Gestão de Projetos" />
        </div>
        <div>
          <Legenda>Completo</Legenda>
          <div style={{ overflow: "hidden", borderRadius: "1rem" }}>
            <Cabecalho
              marca={<span className="neu-header__mark">Sua marca</span>}
              nomeApp="SGED"
              descricaoApp="Sistema de Gestão Estratégica Digital"
              classificacao="Conteúdo interno"
              naoLidas
              usuario={{ iniciais: "RC", nome: "Rodrigo Cordeiro", cargo: "Coordenador Regional" }}
            />
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}
