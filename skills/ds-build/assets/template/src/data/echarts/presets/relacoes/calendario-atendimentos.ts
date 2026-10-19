import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken, BRAND_SCALE_SEQUENCIAL } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

/** Atendimentos por dia em 2025 (dados fictícios, fins de semana mais fracos). */
function gerarDados(): [string, number][] {
  const pontos: [string, number][] = [];
  const inicio = Date.UTC(2025, 0, 1);
  for (let i = 0; i < 365; i++) {
    const d = new Date(inicio + i * 86400000);
    const dia = d.getUTCDay();
    const base = dia === 0 || dia === 6 ? 18 : 96;
    const onda = Math.round(Math.sin(i / 9) * 22 + Math.cos(i / 3) * 10);
    pontos.push([d.toISOString().slice(0, 10), Math.max(2, base + onda + Math.round(i * 0.12))]);
  }
  return pontos;
}

export const dados = gerarDados();
const maximo = Math.max(...dados.map((d) => d[1]));

export const option: EChartsOption = {
  tooltip: {
    formatter: (p) => {
      const v = (p as { value: [string, number] }).value;
      const [ano, mes, dia] = v[0].split("-");
      return `<strong>${dia}/${mes}/${ano}</strong><br/>${formatarNumero(v[1])} atendimentos`;
    },
  },
  visualMap: {
    min: 0,
    max: maximo,
    calculable: true,
    orient: "horizontal",
    left: "center",
    bottom: 4,
    itemWidth: 12,
    textStyle: { color: readToken("--muted-foreground"), fontSize: 11 },
    inRange: { color: BRAND_SCALE_SEQUENCIAL },
    formatter: (v) => formatarNumero(v as number),
  },
  calendar: {
    top: 40,
    left: 40,
    right: 20,
    cellSize: ["auto", 14],
    range: "2025",
    itemStyle: { color: readToken("--card"), borderWidth: 1, borderColor: readToken("--border") },
    splitLine: { lineStyle: { color: readToken("--border"), width: 1.5 } },
    yearLabel: { show: false },
    dayLabel: {
      color: readToken("--muted-foreground"),
      fontSize: 10,
      nameMap: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    },
    monthLabel: {
      color: readToken("--muted-foreground"),
      fontSize: 11,
      nameMap: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    },
  },
  series: [
    {
      name: "Atendimentos por dia",
      type: "heatmap",
      coordinateSystem: "calendar",
      data: dados,
      emphasis: { itemStyle: { borderColor: readToken("--foreground"), borderWidth: 1.5 } },
    },
  ],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken, BRAND_SCALE_SEQUENCIAL } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

const dados: [string, number][] = gerarDados(); // 365 dias de 2025

const option: EChartsOption = {
  tooltip: {},
  visualMap: {
    min: 0, max: 140, calculable: true, orient: "horizontal", left: "center", bottom: 4,
    inRange: { color: BRAND_SCALE_SEQUENCIAL },
    formatter: (v) => formatarNumero(v as number),
  },
  calendar: {
    top: 40, left: 40, right: 20, cellSize: ["auto", 14], range: "2025",
    itemStyle: { color: readToken("--card"), borderColor: readToken("--border"), borderWidth: 1 },
    yearLabel: { show: false },
    dayLabel: { nameMap: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] },
    monthLabel: { nameMap: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] },
  },
  series: [{ name: "Atendimentos por dia", type: "heatmap", coordinateSystem: "calendar", data: dados }],
};

export function CalendarioAtendimentosChart() {
  return (
    <BrandChart
      option={option}
      height={240}
      ariaLabel="Calendário de calor com atendimentos por dia em 2025."
    />
  );
}`;

export const calendarioAtendimentos: ChartPreset = {
  id: "calendario-atendimentos",
  nome: "Calendário de Atendimentos",
  categoria: "relacoes",
  descricao:
    "Calendar heatmap de um ano inteiro com visualMap sequencial e tooltip por dia, evidenciando sazonalidade semanal.",
  tags: ["calendar", "heatmap", "sazonalidade", "escala sequencial"],
  option,
  codigoReact,
  quandoUsar: [
    "Volume diário ao longo de um ano completo",
    "Identificar sazonalidade semanal, feriados e picos",
    "Painéis de operação e capacidade de atendimento",
  ],
  quandoNaoUsar: [
    "Períodos curtos: prefira barras ou linha",
    "Quando o valor exato de cada dia precisa ser lido sem interação",
    "Dados esparsos com muitos dias sem registro",
  ],
  acessibilidade: [
    "Tooltip informa data completa em pt-BR e valor formatado",
    "visualMap com escala numérica rotulada",
    "Rótulos de dia e mês localizados em português",
  ],
  ariaLabel:
    "Calendário de calor com atendimentos diários em 2025. Os dias úteis concentram os valores mais altos, acima de 100 atendimentos, e os fins de semana aparecem consistentemente claros.",
  altura: 240,
};

export default calendarioAtendimentos;
