import { Fragment, type ReactNode } from "react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Footer no estilo Neumorfismo (componente Footer do pacote Neumorphic UI v3.2.0): dois rodapés. O
 * slim é o rodapé padrão de toda tela: uma faixa de 48px na cor da superfície, separada da página pela fenda 3D
 * (sombra sobre luz) em vez de uma borda chapada, com o conteúdo centrado até 1280px. À esquerda, a marca (um
 * logo do consumidor com 20px de altura, ou um texto em negrito na cor da marca), uma fenda curta de separação
 * (de 640px para cima) e o nome do projeto, cortado com "…" quando longo; à direita, a versão como uma pílula
 * escavada com um chip convexo mono. Tom `royal`: a mesma faixa na cor profunda da marca, com brilho para cima,
 * para logos brancos. `compacto`: 36px, para telas densas e painéis embutidos. O completo traz uma faixa clara
 * erguida por uma sombra para cima, com marca e nome do sistema, links de política e a leitura mono do ambiente com um
 * LED de status verde (em sistema interno, mostre sempre o ambiente). Este sistema não traz logo institucional: passe
 * o seu em `logo`. Entra numa seção nova do neumorfismo ("Footer", depois do Header) e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-footer* vêm de src/styles/estilo.css.
 */

interface RodapeSlim {
  variante: "slim";
  /** O logo do consumidor (um <img> ou <svg> dimensionado pela altura); sem ele, a `marca` vira texto */
  logo?: ReactNode;
  marca?: string;
  projeto?: string;
  /** Falso esconde a versão */
  versao?: string | false;
  rotuloVersao?: string;
  /** Tom escuro, na cor profunda da marca: passe um logo branco */
  tom?: "royal";
  compacto?: boolean;
  larguraMax?: number;
  /** Sem cantos arredondados, para faixa de borda a borda */
  rente?: boolean;
}

interface RodapeCompleto {
  variante?: "completo";
  marca: string;
  descricao?: string;
  links?: string[];
  versao?: string;
  ambiente?: string;
}

export type RodapeProps = RodapeSlim | RodapeCompleto;

export function Rodape(props: RodapeProps) {
  if (props.variante === "slim") {
    const { logo, marca = "Sua marca", projeto, versao = "v.1.0", rotuloVersao = "Versão", tom, compacto, larguraMax, rente } = props;
    const classe = ["neu-footer-s", tom === "royal" && "neu-footer-s--royal", compacto && "neu-footer-s--compact", rente && "neu-footer-s--flush"].filter(Boolean).join(" ");
    return (
      <footer className={classe}>
        <div className="neu-footer-s__inner" style={larguraMax ? { maxWidth: larguraMax } : undefined}>
          <div className="neu-footer-s__brand">
            {logo ? <span className="neu-footer-s__logo">{logo}</span> : <span className="neu-footer-s__wordmark">{marca}</span>}
            {projeto && <span className="neu-footer-s__sep" aria-hidden="true" />}
            {projeto && <span className="neu-footer-s__project" title={projeto}>{projeto}</span>}
          </div>
          {versao !== false && (
            <div className="neu-footer-s__version">
              <span className="neu-footer-s__version-label">{rotuloVersao}</span>
              <span className="neu-footer-s__version-value">{versao}</span>
            </div>
          )}
        </div>
      </footer>
    );
  }
  const { marca, descricao, links = [], versao = "v.1.0", ambiente = "Ambiente Homologado" } = props as RodapeCompleto;
  return (
    <footer className="neu-footer">
      <div className="neu-footer__brand">
        <b>{marca}</b>
        {descricao && <i aria-hidden="true" />}
        {descricao && <span>{descricao}</span>}
      </div>
      {links.length > 0 && (
        <nav className="neu-footer__links" aria-label="Rodapé">
          {links.map((l, i) => (
            <Fragment key={l}>
              {i > 0 && <span aria-hidden="true">·</span>}
              <a href="#" onClick={(e) => e.preventDefault()}>{l}</a>
            </Fragment>
          ))}
        </nav>
      )}
      <div className="neu-footer__env">
        <span className="neu-dot neu-dot--success" aria-hidden="true" />
        <b>{versao}</b>
        <span aria-hidden="true">·</span>
        <span className="tag">{ambiente}</span>
      </div>
    </footer>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 8px" }}>{children}</p>;
}

/** Moldura que dá à faixa um canto e uma borda para ler como peça solta no cartão da vitrine */
function Moldura({ children }: { children: ReactNode }) {
  return <div style={{ overflow: "hidden", border: "1px solid var(--neu-edge)", borderRadius: "1rem" }}>{children}</div>;
}

export default function NeumorfismoRodapes() {
  return (
    <ComponentPreview
      title="Footer"
      description="Dois rodapés: o slim, padrão de toda tela, com a marca, o projeto e a versão numa pílula escavada, e o completo, com links e o ambiente. O slim tem tom escuro e versão compacta."
      whenToUse={["Slim: o rodapé de toda tela; no tom escuro, quando a tela tem logo branco; compacto em telas densas e painéis embutidos", "Completo: páginas institucionais com links de política e a leitura do ambiente", "Sistemas internos: mostre sempre o ambiente (\"Ambiente Homologado\", \"Produção\")"]}
      whenNotToUse={["Ações da página: o rodapé identifica o sistema, não guarda botões", "Mais de cinco links: agrupe numa página de ajuda"]}
      accessibility={[
        "Cada rodapé é um <footer>; os links do completo ficam num nav com nome (\"Rodapé\"), e os separadores (·, fendas) são decorativos (aria-hidden)",
        "O nome do projeto é cortado com \"…\" quando longo, e o texto completo fica no title",
        "A versão é texto (\"Versão v.1.0\"), e o LED verde do ambiente é decorativo: o ambiente também vem por extenso",
        "No tom escuro, texto branco sobre a cor profunda da marca lê com alto contraste; o rótulo da versão fica a 70% de branco",
        "Links com anel de foco sólido de 2px",
      ]}
      code={`<Rodape variante="slim" marca="Sua marca" projeto="Nome do Projeto" versao="v.1.0" />

<Rodape variante="slim" tom="royal" logo={<img src="/logo-branco.svg" alt="Sua marca" />} projeto="Nome do Projeto" />

<Rodape variante="slim" compacto marca="Sua marca" projeto="Nome do Projeto" />

<Rodape
  marca="Sua marca"
  descricao="Portal do Consultor de Campo · Sistema de Gestão"
  links={["Termos de Uso", "Segurança & LGPD", "Central de Ajuda"]}
  versao="v.1.0"
  ambiente="Ambiente Homologado"
/>`}
    >
      <div className="neu-stack" style={{ gap: 28 }}>
        <div>
          <Legenda>Padrão (slim)</Legenda>
          <Moldura><Rodape variante="slim" marca="Sua marca" projeto="Nome do Projeto" versao="v.1.0" /></Moldura>
        </div>
        <div>
          <Legenda>Padrão escuro (royal)</Legenda>
          <Moldura><Rodape variante="slim" tom="royal" marca="Sua marca" projeto="Nome do Projeto" versao="v.1.0" /></Moldura>
        </div>
        <div>
          <Legenda>Compacto (36px)</Legenda>
          <Moldura><Rodape variante="slim" compacto marca="Sua marca" projeto="Nome do Projeto" versao="v.1.0" /></Moldura>
        </div>
        <div>
          <Legenda>Padrão com nome longo</Legenda>
          <Moldura><Rodape variante="slim" marca="Sua marca" projeto="Sistema de Gestão Estratégica Digital · Painel Operacional" versao="v.2.4.1" /></Moldura>
        </div>
        <div>
          <Legenda>Completo</Legenda>
          <Moldura>
            <Rodape marca="Sua marca" descricao="Portal do Consultor de Campo · Sistema de Gestão" links={["Termos de Uso", "Segurança & LGPD", "Central de Ajuda"]} versao="v.1.0" ambiente="Ambiente Homologado" />
          </Moldura>
        </div>
      </div>
    </ComponentPreview>
  );
}
