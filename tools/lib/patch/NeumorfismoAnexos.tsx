import { Children, Fragment, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { Button } from "@/components/ui/button";

/**
 * Anexo no estilo Neumorfismo (componente Attachment do pacote Neumorphic UI v3.2.0): um chip convexo e compacto para um
 * arquivo ou imagem que a pessoa anexou ou que um registro carrega, com mídia, nome, linha de metadados, estado e ações
 * pequenas. Serve em compositores, comentários, formulários e painéis de detalhe; para uma área de soltar com fila, use o
 * Upload em massa.
 *  - Mídia de 40px: um poço com o ícone do tipo (pelo nome do arquivo: arquivo, imagem, código, planilha, pasta), a
 *    própria `icone`, a imagem recortada (`src`) ou, enviando, o carregamento na cor da marca.
 *  - Estados: "ocioso" (padrão); "enviando" ("Enviando · 64%" na cor da marca, mais uma barra de 3px na base, aria-busy);
 *    "erro" (borda e ícone em vermelho e o texto de `erro`, anunciado, em geral com `aoTentarDeNovo` e `aoRemover`).
 *  - Orientação: "horizontal" (uma linha) ou "vertical" (miniatura 4:3 em cima e o nome embaixo, para imagens; as ações
 *    flutuam no canto sobre uma tecla clara).
 *  - Ações: `aoBaixar`, `aoRemover` ("Remover …" ou "Cancelar envio de …" enviando) e `aoTentarDeNovo` (no erro); nós
 *    extras vão em `acoes`. Com `href` ou `aoClicar` o chip vira link ou botão e sobe no hover.
 * `GrupoAnexos` junta vários numa lista (role="list"): uma fileira de peças de 132px que rola e encaixa, ou, com
 * `layout="grade"`, uma grade que preenche com peças de pelo menos 120px. A vitrine (default) é a seção "Anexos" da
 * ComponentesPage e só é usada quando ESTILO.id === "neumorfismo". As classes neu-attach* vêm de src/styles/estilo.css.
 */

export interface AnexoProps {
  nome: string;
  /** Linha de metadados: "TIPO · tamanho", com números em pt-BR */
  meta?: string;
  src?: string;
  /** Vazio para miniaturas decorativas */
  alt?: string;
  /** Nome de um ícone do estilo; por padrão, o do tipo do arquivo */
  icone?: string;
  orientacao?: "horizontal" | "vertical";
  estado?: "ocioso" | "enviando" | "erro";
  /** 0 a 100 */
  progresso?: number;
  erro?: string;
  href?: string;
  target?: string;
  download?: string | boolean;
  aoClicar?: () => void;
  aoBaixar?: () => void;
  aoRemover?: () => void;
  aoTentarDeNovo?: () => void;
  acoes?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ICONE_POR_TIPO: Record<string, string> = {
  pdf: "file", doc: "file", docx: "file", txt: "file",
  csv: "bar-chart", xls: "bar-chart", xlsx: "bar-chart",
  png: "image", jpg: "image", jpeg: "image", gif: "image", webp: "image", svg: "image",
  js: "file-code", jsx: "file-code", ts: "file-code", tsx: "file-code", json: "file-code", html: "file-code", css: "file-code", py: "file-code",
  zip: "folder",
};

const juntar = (...partes: (string | false | undefined)[]) => partes.filter(Boolean).join(" ");

export function Anexo({ nome, meta, src, alt, icone, orientacao = "horizontal", estado = "ocioso", progresso, erro, href, target, download, aoClicar, aoBaixar, aoRemover, aoTentarDeNovo, acoes, className, style }: AnexoProps) {
  const vertical = orientacao === "vertical";
  const enviando = estado === "enviando";
  const falhou = estado === "erro";
  const extensao = nome.split(".").pop()?.toLowerCase() ?? "";
  const tipoMidia = src ? "image" : enviando ? "spinner" : "icon";
  const linha = enviando ? (meta ?? `Enviando${progresso != null ? ` · ${Math.round(progresso)}%` : "…"}`) : falhou ? (erro ?? "Falha no envio") : meta;

  const midia = (
    <span className={juntar("neu-attach__media", `neu-attach__media--${tipoMidia}`, falhou && "neu-attach__media--error")} aria-hidden={src && !alt ? true : undefined}>
      {tipoMidia === "image" ? (
        <img src={src} alt={alt ?? ""} loading="lazy" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
      ) : tipoMidia === "spinner" ? (
        <Icone name="loader-2" size={18} spin />
      ) : (
        <Icone name={falhou ? "alert-circle" : (icone ?? ICONE_POR_TIPO[extensao] ?? "file")} size={18} />
      )}
      {src && enviando && (
        <span className="neu-attach__veil">
          <Icone name="loader-2" size={20} spin />
        </span>
      )}
    </span>
  );

  const corpo = (
    <>
      {midia}
      <span className="neu-attach__content">
        <span className="neu-attach__title" title={nome}>{nome}</span>
        {linha && <span className="neu-attach__desc" role={falhou ? "alert" : undefined}>{linha}</span>}
      </span>
    </>
  );

  const acaoBotao = (chave: string, rotulo: string, titulo: string, aoAcionar: () => void, icon: string) => (
    <button key={chave} type="button" className="neu-attach__action" aria-label={rotulo} title={titulo} onClick={aoAcionar}>
      <Icone name={icon} size={14} />
    </button>
  );

  const botoes: ReactNode[] = [];
  if (falhou && aoTentarDeNovo) botoes.push(acaoBotao("r", `Tentar enviar ${nome} de novo`, "Tentar de novo", aoTentarDeNovo, "repeat"));
  if (aoBaixar) botoes.push(acaoBotao("d", `Baixar ${nome}`, "Baixar", aoBaixar, "download"));
  if (aoRemover) botoes.push(acaoBotao("x", `${enviando ? "Cancelar envio de" : "Remover"} ${nome}`, enviando ? "Cancelar envio" : "Remover", aoRemover, "x"));
  if (acoes) botoes.push(<Fragment key="c">{acoes}</Fragment>);

  return (
    <div className={juntar("neu-attach", vertical && "neu-attach--vertical", `neu-attach--${estado}`, className)} aria-busy={enviando ? true : undefined} style={style}>
      {href ? (
        <a className="neu-attach__main" href={href} target={target} download={download}>{corpo}</a>
      ) : aoClicar ? (
        <button type="button" className="neu-attach__main" onClick={aoClicar}>{corpo}</button>
      ) : (
        <div className="neu-attach__main">{corpo}</div>
      )}
      {botoes.length > 0 && <span className="neu-attach__actions">{botoes}</span>}
      {enviando && progresso != null && (
        <span className="neu-attach__bar" role="progressbar" aria-label={`Envio de ${nome}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progresso)}>
          <span style={{ width: `${Math.max(0, Math.min(100, progresso))}%` }} />
        </span>
      )}
    </div>
  );
}

interface GrupoAnexosProps {
  /** "linha" (padrão): fileira que rola e encaixa; "grade": preenche com peças de 120px ou mais */
  layout?: "linha" | "grade";
  rotulo?: string;
  className?: string;
  children: ReactNode;
}

export function GrupoAnexos({ layout = "linha", rotulo = "Anexos", className, children }: GrupoAnexosProps) {
  return (
    <div className={juntar("neu-attach-group", layout === "grade" && "neu-attach-group--grid", className)} role="list" aria-label={rotulo}>
      {Children.map(children, (c) => (c ? <div role="listitem" className="neu-attach-group__item">{c}</div> : null))}
    </div>
  );
}

/** Miniatura de exemplo: um degradê com formas suaves, em SVG embutido, no lugar de uma foto. */
function miniatura(de: string, para: string, forma: "circulos" | "caixas" | "ondas"): string {
  const formas =
    forma === "circulos"
      ? `<circle cx="60" cy="44" r="26" fill="#fff" fill-opacity=".35"/><circle cx="118" cy="82" r="38" fill="#fff" fill-opacity=".22"/>`
      : forma === "caixas"
        ? `<rect x="22" y="48" width="62" height="42" rx="8" fill="#fff" fill-opacity=".32"/><rect x="82" y="26" width="52" height="64" rx="8" fill="#fff" fill-opacity=".22"/>`
        : `<path d="M0 84 C30 58 54 108 90 80 S140 62 160 78 V120 H0Z" fill="#fff" fill-opacity=".3"/><circle cx="118" cy="34" r="16" fill="#fff" fill-opacity=".35"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${de}"/><stop offset="1" stop-color="${para}"/></linearGradient></defs><rect width="160" height="120" fill="url(#g)"/>${formas}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const IMAGENS: AnexoProps[] = [
  { nome: "atendimento-loja.jpg", meta: "JPG · 820 KB", src: miniatura("#6d8cff", "#b9a4ff", "circulos"), alt: "Miniatura de exemplo com círculos sobre fundo azul" },
  { nome: "estoque-caixas.jpg", meta: "JPG · 1,1 MB", src: miniatura("#ffb36b", "#ff7a59", "caixas"), alt: "Miniatura de exemplo com caixas sobre fundo laranja" },
  { nome: "embalagens-pedido.jpg", meta: "JPG · 940 KB", src: miniatura("#5fd1b4", "#4aa3df", "ondas"), alt: "Miniatura de exemplo com ondas sobre fundo verde-azulado" },
];

function Legenda({ children }: { children: string }) {
  return <p className="neu-attach-caption">{children}</p>;
}

function Exemplos() {
  const [progresso, setProgresso] = useState(18);
  const [arquivos, setArquivos] = useState(["relatorio", "planilha", "erro"]);
  useEffect(() => {
    const t = setInterval(() => setProgresso((v) => (v >= 100 ? 18 : Math.min(100, v + 6))), 450);
    return () => clearInterval(t);
  }, []);
  const tirar = (k: string) => setArquivos((l) => l.filter((x) => x !== k));
  return (
    <div className="neu-attach-demo">
      <div className="neu-attach-demo__col">
        <Legenda>Exemplo de referência</Legenda>
        <GrupoAnexos rotulo="Imagens anexadas">
          {IMAGENS.map((im) => (
            <Anexo key={im.nome} orientacao="vertical" {...im} />
          ))}
        </GrupoAnexos>
        <Anexo nome="painel-de-vendas.pdf" estado="enviando" progresso={progresso} aoRemover={() => {}} />
        <Anexo nome="renderizador-mensagens.tsx" meta="TypeScript · 12 KB" aoRemover={() => {}} />
      </div>
      <div className="neu-attach-demo__col">
        <Legenda>Estados e ações</Legenda>
        {arquivos.includes("relatorio") && <Anexo nome="relatorio-trimestral-q3.pdf" meta="PDF · 2,4 MB · 12 páginas" href="#" aoBaixar={() => {}} aoRemover={() => tirar("relatorio")} />}
        {arquivos.includes("planilha") && <Anexo nome="planilha_atendimentos_outubro.xlsx" meta="Excel · 860 KB" aoRemover={() => tirar("planilha")} />}
        {arquivos.includes("erro") && <Anexo nome="contrato_digitalizado_completo.pdf" estado="erro" erro="Excede 10 MB · tente um arquivo menor" aoTentarDeNovo={() => {}} aoRemover={() => tirar("erro")} />}
        <Anexo nome="foto-fachada.jpg" src={IMAGENS[0].src} alt="" estado="enviando" progresso={42} />
        {arquivos.length < 3 && (
          <Button type="button" variant="ghost" size="sm" className="neu-btn--soft" style={{ alignSelf: "flex-start" }} onClick={() => setArquivos(["relatorio", "planilha", "erro"])}>
            <Icone name="repeat" size={16} />
            Restaurar anexos
          </Button>
        )}
        <Legenda>Grade (layout="grade")</Legenda>
        <GrupoAnexos layout="grade" rotulo="Galeria">
          {[...IMAGENS, { nome: "ata-reuniao.docx", meta: "Word · 64 KB" }].map((im) => (
            <Anexo key={im.nome} orientacao="vertical" aoRemover={() => {}} {...im} />
          ))}
        </GrupoAnexos>
      </div>
    </div>
  );
}

export default function NeumorfismoAnexos() {
  return (
    <ComponentPreview
      title="Anexos"
      description="Chip compacto para um arquivo ou imagem anexada: mídia, nome, metadados, estado (enviando e erro) e ações. Em linha ou em miniatura vertical, avulso ou em grupo."
      whenToUse={["Compositores, comentários e formulários com arquivos anexados", "Painéis de detalhe de um registro com seus documentos e imagens", "Galerias pequenas de miniaturas com ação de remover"]}
      whenNotToUse={["Área de soltar com fila de envio e limites: use o Upload em massa", "Listas longas de documentos comparáveis: use a Tabela"]}
      accessibility={[
        "Com href ou aoClicar o chip vira um link ou botão de verdade, focável; sem eles é só informação",
        "As ações têm nome acessível com o arquivo (\"Remover relatorio.pdf\", \"Cancelar envio de …\", \"Baixar …\")",
        "Enviando, o chip é aria-busy e a barra é um progressbar; no erro, o texto é anunciado (role=alert)",
        "O estado vai sempre em palavra, junto da cor e do ícone; miniaturas decorativas levam alt vazio",
        "O grupo é uma lista com nome (role=list), e a fileira rola e encaixa no teclado e no toque",
      ]}
      code={`<GrupoAnexos rotulo="Imagens anexadas">
  <Anexo orientacao="vertical" nome="atendimento-loja.jpg" meta="JPG · 820 KB" src={url} alt="Empreendedora registrando um pedido" />
</GrupoAnexos>

<Anexo nome="painel-de-vendas.pdf" estado="enviando" progresso={64} aoRemover={cancelar} />
<Anexo nome="relatorio-trimestral-q3.pdf" meta="PDF · 2,4 MB" href={url} aoBaixar={baixar} aoRemover={remover} />
<Anexo nome="contrato.pdf" estado="erro" erro="Excede 10 MB · tente um arquivo menor" aoTentarDeNovo={reenviar} aoRemover={remover} />`}
    >
      <Exemplos />
    </ComponentPreview>
  );
}
