import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { BRAND_SCALE_SEQUENCIAL, readToken } from "@/lib/echarts/brandTheme";
import { MAPA_BRASIL } from "@/lib/echarts/mapas";
import { formatarNumero } from "@/lib/echarts/format";

export const meisPorUf = [
  {
    // MODELO: destaque a UF de atuação da marca (borda e rótulo permanentes) e ajuste os textos do preset.
    name: "São Paulo",
    value: 3420,
    itemStyle: { borderColor: readToken("--warning"), borderWidth: 2 },
    label: { show: true, fontSize: 11, fontWeight: "bold" as const },
  },
  { name: "Minas Gerais", value: 1680 },
  { name: "Rio de Janeiro", value: 1540 },
  { name: "Bahia", value: 1120 },
  { name: "Paraná", value: 980 },
  { name: "Rio Grande do Sul", value: 940 },
  { name: "Ceará", value: 1260 },
  { name: "Pernambuco", value: 890 },
  { name: "Santa Catarina", value: 720 },
  { name: "Goiás", value: 690 },
  { name: "Pará", value: 620 },
  { name: "Maranhão", value: 540 },
  { name: "Espírito Santo", value: 430 },
  { name: "Paraíba", value: 410 },
  { name: "Amazonas", value: 380 },
  { name: "Mato Grosso", value: 360 },
  { name: "Rio Grande do Norte", value: 340 },
  { name: "Piauí", value: 320 },
  { name: "Alagoas", value: 290 },
  { name: "Distrito Federal", value: 280 },
  { name: "Mato Grosso do Sul", value: 260 },
  { name: "Sergipe", value: 210 },
  { name: "Rondônia", value: 180 },
  { name: "Tocantins", value: 160 },
  { name: "Acre", value: 90 },
  { name: "Amapá", value: 80 },
  { name: "Roraima", value: 70 },
];

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const params = p as { name: string; value?: number };
      const v = Number.isFinite(params.value as number) ? formatarNumero(params.value as number) : "sem dado";
      return `<strong>${params.name}</strong><br/>MEIs formalizados (mil): ${v}`;
    },
  },
  visualMap: {
    type: "continuous",
    min: 0,
    max: 3500,
    left: 8,
    bottom: 8,
    calculable: true,
    text: ["Maior volume", "Menor volume"],
    inRange: { color: BRAND_SCALE_SEQUENCIAL },
    textStyle: { fontSize: 11 },
  },
  series: [
    {
      name: "MEIs por unidade da federação",
      type: "map",
      map: MAPA_BRASIL,
      roam: true,
      label: { show: false },
      itemStyle: { borderColor: readToken("--border"), borderWidth: 0.5 },
      emphasis: {
        label: { show: true, fontSize: 11, color: readToken("--foreground") },
        itemStyle: { areaColor: readToken("--secondary") },
      },
      data: meisPorUf,
    },
  ],
};

const codigoReact = `import * as echarts from "echarts";
import { useEffect, useState } from "react";
import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { registrarMapaBrasil, MAPA_BRASIL } from "@/lib/echarts/mapas";
import { BRAND_SCALE_SEQUENCIAL, readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const dados = [
  { name: "São Paulo", value: 3420, itemStyle: { borderColor: readToken("--warning"), borderWidth: 2 }, label: { show: true } },
  { name: "Ceará", value: 1260 },
  { name: "Bahia", value: 1120 },
];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => "<strong>" + (p as { name: string }).name + "</strong><br/>MEIs (mil): " +
      formatarNumero((p as { value?: number }).value ?? 0),
  },
  visualMap: {
    type: "continuous", min: 0, max: 3500, left: 8, bottom: 8, calculable: true,
    text: ["Maior volume", "Menor volume"], inRange: { color: BRAND_SCALE_SEQUENCIAL },
  },
  series: [{ name: "MEIs por UF", type: "map", map: MAPA_BRASIL, roam: true, data: dados }],
};

export function MapaBrasilUfs() {
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    registrarMapaBrasil(echarts).then(() => setPronto(true)).catch(() => setPronto(false));
  }, []);

  if (!pronto) return <p className="text-sm text-muted-foreground">Carregando base geográfica…</p>;

  return (
    <BrandChart
      option={option}
      height={460}
      requerMapa={MAPA_BRASIL}
      ariaLabel="Mapa coroplético do Brasil com MEIs formalizados por unidade da federação, em milhares. São Paulo, destacado com borda, lidera com 3.420, seguido de Minas Gerais com 1.680 e Rio de Janeiro com 1.540."
    />
  );
}`;

export const mapaBrasilUfs: ChartPreset = {
  id: "mapa-brasil-ufs",
  nome: "Mapa do Brasil por UF",
  categoria: "mapas",
  descricao:
    "Coroplético nacional por unidade da federação com a UF de atuação destacada por borda e rótulo, ideal para comparar o estado com o restante do país.",
  tags: ["mapa", "coroplético", "Brasil", "UF", "benchmark"],
  option,
  codigoReact,
  quandoUsar: [
    "Comparar o desempenho da UF de atuação com as demais unidades da federação",
    "Painéis nacionais de programas do Sistema __BRAND_SHORT__",
    "Contextualizar um indicador estadual dentro do panorama brasileiro",
  ],
  quandoNaoUsar: [
    "Rankings exatos entre UFs — prefira barras horizontais ordenadas",
    "Recortes municipais ou por macrorregião",
    "Indicadores sem normalização por população ou por número de empresas",
  ],
  acessibilidade: [
    "Obrigatório oferecer os mesmos dados em tabela para quem não consegue interpretar o mapa",
    "A UF em destaque recebe borda e rótulo permanentes: o destaque não depende apenas da cor",
    "Tooltip com nome da UF e valor formatado em pt-BR",
    "Falha de rede exibe mensagem de indisponibilidade sem quebrar a página",
  ],
  ariaLabel:
    "Mapa coroplético do Brasil com MEIs formalizados por unidade da federação, em milhares. São Paulo, destacado com borda, lidera com 3.420, seguido de Minas Gerais com 1.680 e Rio de Janeiro com 1.540.",
  altura: 460,
  requerMapa: MAPA_BRASIL,
};

export default mapaBrasilUfs;
