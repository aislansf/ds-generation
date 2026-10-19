/**
 * Helpers de formatação numérica pt-BR para os gráficos ECharts do DS.
 * Use sempre nestes tooltips/labels para manter o padrão
 * (milhar com ponto, decimal com vírgula).
 */

const nf = (min: number, max: number) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: min, maximumFractionDigits: max });

/** 12345.6 -> "12.346" (ou "12.345,6" com decimais). */
export function formatarNumero(valor: number | string | null | undefined, decimais = 0): string {
  const n = typeof valor === "number" ? valor : Number(valor);
  if (!Number.isFinite(n)) return "—";
  return nf(decimais, decimais).format(n);
}

/** 1234.5 -> "R$ 1.234,50". */
export function formatarMoeda(valor: number | string | null | undefined, decimais = 2): string {
  const n = typeof valor === "number" ? valor : Number(valor);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  }).format(n);
}

/** 42.35 -> "42,4%" (valor já em escala percentual). */
export function formatarPercentual(
  valor: number | string | null | undefined,
  decimais = 1,
): string {
  const n = typeof valor === "number" ? valor : Number(valor);
  if (!Number.isFinite(n)) return "—";
  return `${nf(decimais, decimais).format(n)}%`;
}
