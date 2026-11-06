import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine da Paginação e do Contador de página no estilo Neumorfismo (componentes Pagination e PageCounter do
 * pacote Neumorphic UI v3.2.0). Paginação: teclas convexas numeradas de 36px com setas de chevron; a página
 * atual lê na cor da marca e em negrito (aria-current="page") e as setas desativadas afundam. Faixas longas
 * colapsam em 1 … n-1 n n+1 … total. Contador: uma cápsula convexa com as teclas de anterior e próxima em
 * volta de um "1 de 10" em fonte mono, para rodapés densos de tabelas e painéis. Entra nos cartões
 * "Paginação Numérica" e "Paginação de Contador" da ComponentesPage e só é usado quando ESTILO.id ===
 * "neumorfismo". As classes neu-pager* e neu-counter* vêm de src/styles/estilo.css; o atributo data-neu tira os
 * <nav> das regras genéricas dessa camada para paginação.
 */

interface PaginacaoProps {
  total: number;
  pagina?: number;
  paginaInicial?: number;
  aoMudar?: (pagina: number) => void;
  rotulo?: string;
}

function usePagina({ pagina, paginaInicial = 1, aoMudar }: Pick<PaginacaoProps, "pagina" | "paginaInicial" | "aoMudar">) {
  const [interno, setInterno] = useState(paginaInicial);
  const atual = pagina ?? interno;
  function ir(n: number) {
    if (pagina === undefined) setInterno(n);
    aoMudar?.(n);
  }
  return [atual, ir] as const;
}

function TeclaSeta({ sentido, desativada, aoClicar }: { sentido: "anterior" | "proxima"; desativada: boolean; aoClicar: () => void }) {
  const Icone = sentido === "anterior" ? ChevronLeft : ChevronRight;
  return (
    <button type="button" className="neu-pager__btn" disabled={desativada} aria-label={sentido === "anterior" ? "Página anterior" : "Próxima página"} onClick={aoClicar}>
      <Icone aria-hidden="true" size={16} />
    </button>
  );
}

export function Paginacao({ total, pagina, paginaInicial, aoMudar, rotulo = "Paginação" }: PaginacaoProps) {
  const [atual, ir] = usePagina({ pagina, paginaInicial, aoMudar });
  const paginas: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - atual) <= 1) paginas.push(i);
    else if (paginas[paginas.length - 1] !== "…") paginas.push("…");
  }
  return (
    <nav data-neu="paginacao" className="neu-pager" aria-label={rotulo}>
      <TeclaSeta sentido="anterior" desativada={atual <= 1} aoClicar={() => ir(atual - 1)} />
      {paginas.map((n, i) =>
        n === "…" ? (
          <span key={`g${i}`} className="neu-pager__gap" aria-hidden="true">…</span>
        ) : (
          <button key={n} type="button" className="neu-pager__btn" aria-current={n === atual ? "page" : undefined} aria-label={`Página ${n}`} onClick={() => ir(n)}>
            {n}
          </button>
        ),
      )}
      <TeclaSeta sentido="proxima" desativada={atual >= total} aoClicar={() => ir(atual + 1)} />
    </nav>
  );
}

export function ContadorPagina({ total, pagina, paginaInicial, aoMudar, rotulo = "Paginação de contador" }: PaginacaoProps) {
  const [atual, ir] = usePagina({ pagina, paginaInicial, aoMudar });
  return (
    <nav data-neu="paginacao" className="neu-counter" aria-label={rotulo}>
      <TeclaSeta sentido="anterior" desativada={atual <= 1} aoClicar={() => ir(atual - 1)} />
      <span className="neu-counter__label" aria-live="polite">{`${atual} de ${total}`}</span>
      <TeclaSeta sentido="proxima" desativada={atual >= total} aoClicar={() => ir(atual + 1)} />
    </nav>
  );
}

export default function NeumorfismoPaginacao() {
  const [pagina, setPagina] = useState(1);
  return (
    <div className="space-y-8">
      <ComponentPreview
        title="Paginação Numérica"
        description="Teclas convexas numeradas com setas de chevron. A página atual lê na cor da marca e em negrito; as setas desativadas afundam. Faixas longas colapsam em 1 … n-1 n n+1 … total."
        whenToUse={["Listagens com muitos itens", "Resultados de busca", "Para rodapés com pouco espaço, use o contador de página"]}
        whenNotToUse={["Poucos itens que cabem numa tela só", "Rolagem contínua, onde o fim da lista carrega mais itens"]}
        accessibility={[
          "nav com nome (aria-label=\"Paginação\"); a página atual leva aria-current=\"page\"",
          "Cada tecla numerada tem nome (\"Página 3\") e as setas dizem \"Página anterior\" e \"Próxima página\"",
          "As reticências são decorativas (aria-hidden); as setas das pontas ficam desativadas e afundadas",
          "A atual também muda de peso e de cor: o estado não depende só da cor",
          "Foco em anel sólido de 2px; pressionar afunda a tecla",
        ]}
        code={`const [pagina, setPagina] = useState(1);

<Paginacao total={12} pagina={pagina} aoMudar={setPagina} />`}
      >
        <Paginacao total={12} pagina={pagina} aoMudar={setPagina} />
      </ComponentPreview>

      <ComponentPreview
        title="Paginação de Contador"
        description="Versão compacta: uma cápsula convexa com as teclas de anterior e próxima em volta de um contador “1 de 10” em fonte mono. Para rodapés densos de tabelas e painéis."
        whenToUse={["Rodapés de tabelas e painéis com pouco espaço", "Quando saltar para uma página específica não importa"]}
        whenNotToUse={["Quando a pessoa precisa ir direto a uma página: use a paginação numerada"]}
        accessibility={[
          "nav com nome (aria-label=\"Paginação de contador\"); o contador é uma região educada (aria-live=\"polite\") que anuncia \"2 de 10\"",
          "As setas dizem \"Página anterior\" e \"Próxima página\" e ficam desativadas e afundadas nas pontas",
          "Foco em anel sólido de 2px",
        ]}
        code={`<ContadorPagina total={10} />`}
      >
        <ContadorPagina total={10} />
      </ComponentPreview>
    </div>
  );
}
