import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do BarChart no estilo Neumorfismo (componente BarChart do pacote Neumorphic UI v3.2.0): barras verticais em
 * forma de pílula, esculpidas num leito. Cada barra é uma calha afundada com o preenchimento por dentro; a barra
 * destacada (hoje, o pico, o período escolhido) sai do leito, mais alta, e ganha o preenchimento da cor da marca com
 * brilho e o rótulo na cor da marca. Na forma estreita (padrão) a calha de cada barra é que cresce com o valor (o
 * preenchimento tem altura fixa); na forma larga (`variante="larga"`) as calhas têm a mesma altura, são largas, com
 * preenchimento da secundária e o preenchimento é que cresce com o valor, como numa semana de desempenho. O cartão tem um
 * título centralizado e, se houver, uma bolha convexa com um valor. O gráfico é lido como uma imagem, com todos os
 * valores no nome. Destaque só uma barra. Para gráficos com eixos, várias séries, legenda ou empilhamento, use os
 * gráficos completos. Entra numa seção nova do neumorfismo ("BarChart", depois do MetricCard) e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-bars* vêm de src/styles/estilo.css.
 */

export interface BarraGrafico {
  rotulo: string;
  valor: number;
  /** A barra destacada: só uma por gráfico */
  ativo?: boolean;
}

export interface GraficoBarrasProps {
  titulo?: string;
  /** Um valor numa bolha convexa abaixo do título */
  bolha?: string | number;
  /** O que a bolha mede, para leitores de tela */
  rotuloBolha?: string;
  dados: BarraGrafico[];
  /** O valor que enche a calha; padrão: o maior valor */
  maximo?: number;
  variante?: "estreita" | "larga";
  className?: string;
}

const numero = (n: number) => String(n).replace(".", ",");

export function GraficoBarras({ titulo, bolha, rotuloBolha, dados, maximo, variante = "estreita", className }: GraficoBarrasProps) {
  const teto = maximo ?? Math.max(...dados.map((d) => d.valor));
  const larga = variante === "larga";
  return (
    <div className={["neu-card", "neu-card--convex", "neu-bars-card", className].filter(Boolean).join(" ")}>
      {titulo ? (
        <div className="neu-bars__head">
          <span className="neu-bars__title">{titulo}</span>
          {bolha != null && (
            <div className="neu-chart-bubble">
              {rotuloBolha && <span className="sr-only">{`${rotuloBolha}: `}</span>}
              {bolha}
            </div>
          )}
        </div>
      ) : null}
      <div className={["neu-bars", larga && "neu-bars--wide"].filter(Boolean).join(" ")} role="img" aria-label={`${titulo ?? "Gráfico"}: ${dados.map((d) => `${d.rotulo} ${numero(d.valor)}`).join(", ")}`}>
        {dados.map((d, i) => {
          const altura = Math.round((d.valor / teto) * 100);
          return (
            <div key={i} className="neu-bars__col" data-active={!!d.ativo}>
              <div className="neu-bars__track" style={{ height: `${larga ? 100 : Math.max(40, altura + 12)}%` }}>
                <div className="neu-bars__fill" style={{ height: `${larga ? altura : 70}%` }} />
              </div>
              <span className="neu-bars__tick">{d.rotulo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NeumorfismoGraficoBarras() {
  return (
    <ComponentPreview
      title="BarChart"
      description="Barras verticais em forma de pílula, esculpidas num leito, com a barra destacada em relevo na cor da marca."
      whenToUse={["Resumos curtos com poucas barras, como a semana ou os últimos períodos", "Destacar um valor (hoje, o pico, o período escolhido) entre os demais", "Painéis em que a forma da série importa mais que cada valor exato"]}
      whenNotToUse={["Gráficos com eixos, várias séries, legenda ou empilhamento: use os gráficos completos", "Mais de uns dez valores: as barras ficam finas demais", "Valores que precisam ser lidos com exatidão: mostre-os em texto ou tabela"]}
      accessibility={[
        "O gráfico é lido como uma imagem, com o título e todos os valores no nome (\"Peak Demand: M 4, T 6, ...\")",
        "A barra destacada se vê pela cor da marca, pela altura e pelo rótulo em negrito, mas os valores também estão no nome da imagem, então a cor nunca é o único canal",
        "A bolha de valor leva o nome do que mede, escondido, antes do número",
        "Destaque só uma barra por gráfico",
        "O rótulo das barras (10px) é um complemento: os valores completos estão no nome da imagem",
      ]}
      code={`<GraficoBarras titulo="Peak Demand" bolha={88} rotuloBolha="Pico" dados={[
  { rotulo: "M", valor: 4 }, { rotulo: "T", valor: 6 }, { rotulo: "W", valor: 7 },
  { rotulo: "T", valor: 9, ativo: true }, { rotulo: "F", valor: 8 }, { rotulo: "S", valor: 6.5 }, { rotulo: "S", valor: 5 },
]} />

<GraficoBarras variante="larga" titulo="Evolução de Diagnósticos" dados={[
  { rotulo: "SEG", valor: 62 }, { rotulo: "TER", valor: 80 }, { rotulo: "QUA", valor: 48 },
  { rotulo: "QUI", valor: 30, ativo: true }, { rotulo: "SEX", valor: 85 }, { rotulo: "SÁB", valor: 28 },
]} />`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <GraficoBarras
          titulo="Peak Demand"
          bolha={88}
          rotuloBolha="Pico"
          dados={[
            { rotulo: "M", valor: 4 },
            { rotulo: "T", valor: 6 },
            { rotulo: "W", valor: 7 },
            { rotulo: "T", valor: 9, ativo: true },
            { rotulo: "F", valor: 8 },
            { rotulo: "S", valor: 6.5 },
            { rotulo: "S", valor: 5 },
          ]}
        />
        <GraficoBarras
          variante="larga"
          titulo="Evolução de Diagnósticos"
          dados={[
            { rotulo: "SEG", valor: 62 },
            { rotulo: "TER", valor: 80 },
            { rotulo: "QUA", valor: 48 },
            { rotulo: "QUI", valor: 30, ativo: true },
            { rotulo: "SEX", valor: 85 },
            { rotulo: "SÁB", valor: 28 },
          ]}
        />
      </div>
    </ComponentPreview>
  );
}
