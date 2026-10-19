/**
 * Macrorregiões de planejamento usadas nos painéis do __BRAND_NAME__.
 * O mapa cobre os municípios presentes na base de atendimentos; municípios
 * não mapeados caem em "Não informada".
 *
 * MODELO: regiões e municípios fictícios, os mesmos de src/data/prospeccao-seed.json.
 * Troque pela divisão territorial em que a marca atua (as chaves são o nome do
 * município sem acento e em minúsculas).
 */
export const MACRORREGIOES = [
  "Região Metropolitana",
  "Vale do Sul",
  "Região Central",
  "Litoral Leste",
  "Serra Alta",
  "Planalto Oeste",
  "Vale Claro",
  "Centro Sul",
  "Sertão Oeste",
] as const;

export type Macrorregiao = (typeof MACRORREGIOES)[number];

const MUNICIPIO_MACRO: Record<string, Macrorregiao> = {
  "porto central": "Região Metropolitana",
  "lagoa azul": "Região Metropolitana",
  "vila nova": "Região Metropolitana",
  "serra verde": "Região Metropolitana",
  "recanto verde": "Região Metropolitana",
  "jardim das flores": "Região Metropolitana",
  "costa dourada": "Região Metropolitana",
  "nova esperanca": "Vale do Sul",
  "bom retiro": "Vale do Sul",
  "fonte nova": "Vale do Sul",
  "missao nova": "Vale do Sul",
  "serra alta": "Serra Alta",
  "campo alegre": "Serra Alta",
  "barra grande": "Serra Alta",
  "porto do norte": "Serra Alta",
  "santa helena": "Serra Alta",
  "monte claro": "Região Central",
  "boa vista": "Região Central",
  "senador almeida": "Região Central",
  "praia mansa": "Litoral Leste",
  "areia branca": "Litoral Leste",
  "morada do sol": "Litoral Leste",
  "vale formoso": "Vale Claro",
  "santa rita": "Vale Claro",
  "vale claro": "Vale Claro",
  "rio verde": "Centro Sul",
  "ponte alta": "Centro Sul",
  "tres pontes": "Centro Sul",
  "cachoeira alta": "Sertão Oeste",
  liberdade: "Sertão Oeste",
  "alto bonito": "Planalto Oeste",
  "novo horizonte": "Planalto Oeste",
};

function slug(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/** Retorna a macrorregião a partir do nome do município. */
export function macrorregiaoDoMunicipio(cidade: string | null | undefined): string {
  if (!cidade) return "Não informada";
  return MUNICIPIO_MACRO[slug(cidade)] ?? "Não informada";
}
