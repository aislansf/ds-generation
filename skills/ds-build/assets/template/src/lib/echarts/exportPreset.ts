import { saveAs } from "file-saver";
import type { ChartPreset } from "@/data/echarts/types";

function toCamel(id: string): string {
  return id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

export function presetJsonString(preset: ChartPreset): string {
  return JSON.stringify(preset.option, null, 2);
}

export function presetTsString(preset: ChartPreset): string {
  const varName = `${toCamel(preset.id)}Option`;
  const comentario = preset.codigoReact
    .split("\n")
    .map((l) => ` * ${l}`)
    .join("\n");
  return `/**
 * ${preset.nome} — Design System __BRAND_NAME__ (Gráficos ECharts)
 * Categoria: ${preset.categoria}
 * ${preset.descricao}
 *
 * Exemplo de uso em React:
 *
${comentario}
 */
import type { EChartsOption } from "echarts";

export const ${varName}: EChartsOption = ${presetJsonString(preset)};

export default ${varName};
`;
}

export function downloadPresetJson(preset: ChartPreset): void {
  const blob = new Blob([presetJsonString(preset)], { type: "application/json;charset=utf-8" });
  saveAs(blob, `${preset.id}.option.json`);
}

export function downloadPresetTs(preset: ChartPreset): void {
  const blob = new Blob([presetTsString(preset)], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `${preset.id}.ts`);
}
