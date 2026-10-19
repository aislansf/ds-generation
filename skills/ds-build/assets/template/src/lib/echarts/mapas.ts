/**
 * Registro sob demanda dos mapas GeoJSON usados pelos presets da categoria
 * "Mapas" do Design System __BRAND_NAME__.
 *
 * Os arquivos GeoJSON são servidos pelo próprio domínio (public/geo/*.json),
 * carregados por fetch APENAS quando um preset de mapa é renderizado — nunca
 * entram no bundle inicial. Fonte original:
 *  - Brasil por UF: https://github.com/codeforamerica/click_that_hood (brazil-states.geojson)
 */

import type * as EChartsNS from "echarts";

export const MAPA_BRASIL = "brasil-ufs";

const URLS: Record<string, string> = {
  [MAPA_BRASIL]: "/geo/brasil-ufs.json",
};

/**
 * Normalização de nomes de features que costumam divergir entre bases
 * (acentuação/grafia). Chave = nome no GeoJSON, valor = nome canônico usado
 * nos `data` dos presets.
 */
const NORMALIZACAO_NOMES: Record<string, string> = {
  "Distrito Federal": "Distrito Federal",
};

const registrados = new Set<string>();
const cacheGeo = new Map<string, unknown>();
const emVoo = new Map<string, Promise<void>>();

type FeatureCollection = {
  type: string;
  features: { properties?: Record<string, unknown> }[];
};

function normalizarFeatures(geo: unknown): unknown {
  const fc = geo as FeatureCollection;
  if (!fc || !Array.isArray(fc.features)) return geo;
  fc.features.forEach((f) => {
    const props = f.properties ?? {};
    const bruto = String(props.name ?? props.nome ?? props.NOME ?? "").trim();
    if (!bruto) return;
    props.name = NORMALIZACAO_NOMES[bruto] ?? bruto;
    f.properties = props;
  });
  return fc;
}

async function registrarMapa(
  echarts: typeof EChartsNS,
  nome: string,
): Promise<void> {
  if (registrados.has(nome)) return;

  const cache = cacheGeo.get(nome);
  if (cache) {
    echarts.registerMap(nome, cache as never);
    registrados.add(nome);
    return;
  }

  const pendente = emVoo.get(nome);
  if (pendente) return pendente;

  const promessa = (async () => {
    const resposta = await fetch(URLS[nome]);
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar o mapa "${nome}" (HTTP ${resposta.status}).`);
    }
    const geo = normalizarFeatures(await resposta.json());
    cacheGeo.set(nome, geo);
    echarts.registerMap(nome, geo as never);
    registrados.add(nome);
  })().finally(() => emVoo.delete(nome));

  emVoo.set(nome, promessa);
  return promessa;
}

/** Registra o mapa do Brasil por unidade da federação (idempotente). */
export function registrarMapaBrasil(echarts: typeof EChartsNS): Promise<void> {
  return registrarMapa(echarts, MAPA_BRASIL);
}

/** Registra pelo nome declarado em `ChartPreset.requerMapa`. */
export function registrarMapaPorNome(
  echarts: typeof EChartsNS,
  nome: string,
): Promise<void> {
  if (!URLS[nome]) return Promise.reject(new Error(`Mapa desconhecido: "${nome}".`));
  return registrarMapa(echarts, nome);
}

export function mapaRegistrado(nome: string): boolean {
  return registrados.has(nome);
}

export const MAPAS_DISPONIVEIS = [MAPA_BRASIL] as const;
