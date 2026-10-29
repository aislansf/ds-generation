/**
 * Layout bento do DS (gerado pelo ds-build).
 *
 * Com `ESTILO.layout === "bento"`, as grades das páginas ganham 4 colunas e os blocos ocupam 1×1, 2×1, 3×1,
 * 4×1, 1×2 ou 2×2 células. Com qualquer outro layout, todas as funções devolvem a classe original da página.
 *
 * A ordem do DOM segue a leitura lógica: o bloco maior vem primeiro no código, e a grade nunca usa
 * `grid-auto-flow: dense`. Abaixo de 640px é uma coluna; de 640 a 1023px, duas.
 */
import { ESTILO } from "@/config/estilo";
import { cn } from "@/lib/utils";

export type BentoSize = "1x1" | "2x1" | "3x1" | "4x1" | "1x2" | "2x2";

/** Colunas da grade a partir de 1024px. */
export const BENTO_COLUNAS = 4;

/** Quantas colunas cada tamanho ocupa na grade de 4. */
export const BENTO_LARGURA: Record<BentoSize, number> = {
  "1x1": 1,
  "2x1": 2,
  "3x1": 3,
  "4x1": 4,
  "1x2": 1,
  "2x2": 2,
};

// Linhas só se estendem a partir de 1024px: na grade de 2 colunas, um bloco de 2 linhas deixaria uma linha vazia.
const CELULA: Record<BentoSize, string> = {
  "1x1": "",
  "2x1": "sm:col-span-2",
  "3x1": "sm:col-span-2 lg:col-span-3",
  "4x1": "sm:col-span-2 lg:col-span-4",
  "1x2": "lg:row-span-2",
  "2x2": "sm:col-span-2 lg:row-span-2",
};

const GRADE = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";

export function isBento(): boolean {
  return (ESTILO.layout as string) === "bento";
}

/**
 * Classes de uma grade: `padrao` é a grade original da página; `comum` vale nos dois layouts (margens, padding).
 */
export function bentoGrid(padrao: string, comum?: string): string {
  const grade = isBento() ? GRADE : padrao;
  return comum ? cn(grade, comum) : grade;
}

/**
 * Classes de um bloco da grade bento (vazio fora do bento). `hero` marca o bloco de destaque, preenchido com a
 * cor primária pela camada CSS do estilo.
 */
export function bentoCell(size: BentoSize = "1x1", opts: { hero?: boolean } = {}): string {
  if (!isBento()) return "";
  return cn("min-w-0", CELULA[size], opts.hero && "bento-hero");
}

/**
 * Tamanhos para `n` blocos iguais fecharem as linhas da grade: alguns viram 2×1, espalhados pela lista, na
 * quantidade que falta para o total de colunas ser múltiplo de 4. Um bloco 2×1 nunca começa na última coluna.
 */
export function bentoSizes(n: number): BentoSize[] {
  const tamanhos: BentoSize[] = Array.from({ length: Math.max(0, n) }, () => "1x1");
  const duplos = n > 0 ? (BENTO_COLUNAS - (n % BENTO_COLUNAS)) % BENTO_COLUNAS : 0;
  let restantes = duplos;
  let coluna = 0;
  for (let i = 0; i < n; i++) {
    const alvo = Math.floor(((duplos - restantes + 0.5) * n) / Math.max(duplos, 1));
    if (restantes > 0 && i >= alvo && coluna <= BENTO_COLUNAS - 2) {
      tamanhos[i] = "2x1";
      restantes--;
      coluna += 2;
    } else {
      coluna += 1;
    }
    coluna %= BENTO_COLUNAS;
  }
  return tamanhos;
}
