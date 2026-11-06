import type { CSSProperties, ReactNode } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { Selo } from "@/components/estilo/NeumorfismoBadges";

/**
 * Lista descritiva no estilo Neumorfismo (componente DescriptionList do pacote Neumorphic UI v3.2.0): pares termo e valor
 * num <dl> semântico, em quatro leiautes:
 *  - "dividida" (a padrão): o termo à esquerda, apagado, e o valor à direita, com fios finos entre as linhas;
 *  - "empilhada": o termo em caixa-alta miúda sobre o valor (as duas servem dentro de um cartão);
 *  - "painel": um painel elevado em que o termo ocupa uma coluna fixa de um terço e o valor fica ao lado, com a fenda 3D
 *    entre as linhas; abaixo de 420px de largura do próprio painel (consulta de contêiner) o termo vai para cima do
 *    valor. `moldura={false}` tira o painel e deixa só as linhas;
 *  - "grade": cada par numa ladrilha afundada (`tom="elevada"` a deixa convexa e afunda a chave do ícone), em `colunas`
 *    colunas (uma só abaixo de 640px); `abranger` faz o item ocupar a largura toda e `icone` põe uma chave convexa de 32px.
 * Valores `mono` usam a fonte de código (CNPJ, códigos e datas); o valor pode ser um nó (Selo, link). A vitrine (default)
 * é o cartão "Lista Descritiva" da ComponentesPage e só é usada quando ESTILO.id === "neumorfismo". As classes
 * neu-dl* vêm de src/styles/estilo.css.
 */

export interface ItemDescritivo {
  /** O nome do termo; um nó leva o nome e uma segunda linha (o token, por exemplo) */
  termo: ReactNode;
  valor: ReactNode;
  mono?: boolean;
  icone?: string;
  /** Na grade: ocupa a largura toda, para texto longo */
  abranger?: boolean;
}

export interface ListaDescritivaProps {
  itens: ItemDescritivo[];
  variante?: "dividida" | "painel" | "grade";
  /** Só na dividida: o termo em cima do valor */
  empilhada?: boolean;
  /** Painel: false tira o painel e deixa só as linhas */
  moldura?: boolean;
  /** Grade */
  colunas?: number;
  tom?: "afundada" | "elevada";
  /** Nome acessível da lista */
  rotulo?: string;
}

const juntar = (...partes: (string | false | undefined)[]) => partes.filter(Boolean).join(" ");

export function ListaDescritiva({ itens, variante = "dividida", empilhada, moldura = true, colunas = 2, tom = "afundada", rotulo }: ListaDescritivaProps) {
  if (variante === "painel") {
    return (
      <div className="neu-dlp-wrap">
        <dl className={juntar("neu-dlp", !moldura && "neu-dlp--bare")} aria-label={rotulo}>
          {itens.map((it, i) => (
            <div key={i} className="neu-dlp__row">
              <dt className="neu-dlp__term">
                {it.icone ? <Icone name={it.icone} size={16} /> : null}
                {it.termo}
              </dt>
              <dd className={juntar("neu-dlp__value", it.mono && "neu-mono")}>{it.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (variante === "grade") {
    return (
      <dl className={juntar("neu-dlg", tom === "elevada" && "neu-dlg--raised")} style={{ "--dlg-cols": colunas } as CSSProperties} aria-label={rotulo}>
        {itens.map((it, i) => (
          <div key={i} className={juntar("neu-dlg__tile", it.abranger && "neu-dlg__tile--span")}>
            {it.icone ? (
              <span className="neu-dlg__icon" aria-hidden="true">
                <Icone name={it.icone} size={16} />
              </span>
            ) : null}
            <div className="neu-dlg__text">
              <dt className="neu-dlg__term">{it.termo}</dt>
              <dd className={juntar("neu-dlg__value", it.mono && "neu-mono")}>{it.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <dl className={juntar("neu-dl", empilhada && "neu-dl--stacked")} aria-label={rotulo}>
      {itens.map((it, i) => (
        <div key={i}>
          <dt>{it.termo}</dt>
          <dd className={it.mono ? "neu-mono" : undefined}>{it.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

const EMPRESA: ItemDescritivo[] = [
  { termo: "Programa", valor: "ALI – Agentes Locais de Inovação" },
  { termo: "Empresa atendida", valor: "Padaria Pão Quente ME" },
  { termo: "CNPJ", valor: "12.345.678/0001-90", mono: true },
  { termo: "Porte", valor: <Selo tamanho="sm" tom="success">Microempresa</Selo> },
  { termo: "Setor", valor: "Alimentos e Bebidas" },
];

const ATENDIMENTO: ItemDescritivo[] = [
  { termo: "Código do atendimento", valor: "MARCA-UF-2026-00312", mono: true },
  { termo: "Município", valor: "Fortaleza – CE" },
  { termo: "Consultor responsável", valor: "Rodrigo Cordeiro" },
  { termo: "Data de abertura", valor: "14/10/2026", mono: true },
];

const PROJETO: ItemDescritivo[] = [
  { termo: "Participantes", valor: "128 empresários", icone: "users" },
  { termo: "Período", valor: "Out – Dez 2026", icone: "calendar" },
  { termo: "Carga horária", valor: "40 horas", icone: "clock" },
  { termo: "Objetivo", valor: "Ampliar a maturidade em inovação dos pequenos negócios atendidos na região metropolitana.", icone: "trending-up", abranger: true },
];

function Legenda({ children }: { children: ReactNode }) {
  return <p className="neu-dl-caption">{children}</p>;
}

export default function NeumorfismoListaDescritiva() {
  return (
    <ComponentPreview
      title="Lista Descritiva"
      description="Pares termo e valor num <dl> semântico, em quatro leiautes: painel, grade (afundada ou elevada), linhas divididas e empilhada."
      whenToUse={["Telas de detalhe e fichas cadastrais (atendimento, empresa, contrato)", "Resumos de formulário antes do envio", "Códigos, locais, datas e contagens que se leem de relance (grade)"]}
      whenNotToUse={["Dados tabulares comparativos: use a Tabela", "Listas de itens homogêneos"]}
      accessibility={[
        "Usa dl, dt e dd; cada par fica num div, o que é válido em HTML",
        "O nome da lista (rotulo) vira aria-label do dl",
        "O painel empilha termo e valor quando o próprio painel fica estreito (consulta de contêiner), então funciona em menus laterais e modais",
        "Na grade, a chave do ícone é decorativa (aria-hidden): o termo continua sendo o nome",
      ]}
      code={`const itens = [
  { termo: "Programa", valor: "ALI – Agentes Locais de Inovação" },
  { termo: "CNPJ", valor: "12.345.678/0001-90", mono: true },
  { termo: "Porte", valor: <Selo tamanho="sm" tom="success">Microempresa</Selo> },
];

<ListaDescritiva variante="painel" rotulo="Dados do atendimento" itens={itens} />
<ListaDescritiva variante="grade" itens={atendimento} />
<ListaDescritiva variante="grade" tom="elevada" colunas={3} itens={projeto} />
<ListaDescritiva itens={itens} />
<ListaDescritiva empilhada itens={itens} />`}
    >
      <div className="neu-stack" style={{ display: "grid", gap: 32, maxWidth: 720 }}>
        <div>
          <Legenda>Painel · rótulo e valor</Legenda>
          <ListaDescritiva variante="painel" rotulo="Dados do atendimento" itens={EMPRESA} />
        </div>
        <div>
          <Legenda>Grade · 2 colunas</Legenda>
          <ListaDescritiva variante="grade" itens={ATENDIMENTO} />
        </div>
        <div>
          <Legenda>Grade elevada · com ícones · 3 colunas</Legenda>
          <ListaDescritiva variante="grade" tom="elevada" colunas={3} itens={PROJETO} />
        </div>
        <div className="neu-dl-pair">
          <div>
            <Legenda>Linhas divididas (original)</Legenda>
            <div className="neu-card neu-card--flat">
              <ListaDescritiva itens={EMPRESA.slice(0, 4)} />
            </div>
          </div>
          <div>
            <Legenda>Empilhado</Legenda>
            <div className="neu-card neu-card--flat">
              <ListaDescritiva empilhada itens={EMPRESA.slice(1, 4)} />
            </div>
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}
