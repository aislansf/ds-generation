import type { EChartsOption } from "echarts";
import type { ChartPreset } from "@/data/echarts/types";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

/** Gera atendimentos diários fictícios de 2025 com sazonalidade semanal. */
function gerarDados(): [string, number][] {
  const dados: [string, number][] = [];
  const inicio = new Date(Date.UTC(2025, 0, 1));
  const fim = new Date(Date.UTC(2025, 11, 31));
  let semente = 7;
  for (const d = new Date(inicio); d <= fim; d.setUTCDate(d.getUTCDate() + 1)) {
    semente = (semente * 9301 + 49297) % 233280;
    const aleatorio = semente / 233280;
    const diaSemana = d.getUTCDay();
    const base = diaSemana === 0 || diaSemana === 6 ? 8 : 52;
    const valor = Math.round(base + aleatorio * (diaSemana === 0 || diaSemana === 6 ? 14 : 60));
    dados.push([d.toISOString().slice(0, 10), valor]);
  }
  return dados;
}

export const dados = gerarDados();

export const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: [string, number] }).value;
      const [ano, mes, dia] = v[0].split("-");
      return `${dia}/${mes}/${ano}<br/><strong>${formatarNumero(v[1])}</strong> atendimentos`;
    },
  },
  visualMap: {
    type: "continuous",
    min: 8,
    max: 112,
    calculable: true,
    orient: "horizontal",
    left: "center",
    top: 0,
    itemWidth: 12,
    itemHeight: 120,
    text: ["Mais", "Menos"],
    textStyle: { color: readToken("--muted-foreground"), fontSize: 11 },
    inRange: {
      color: [
        readToken("--primary", 0.12),
        readToken("--primary", 0.45),
        readToken("--primary"),
        readToken("--brand-comp-indigo"),
      ],
    },
  },
  calendar: {
    top: 70,
    left: 40,
    right: 20,
    cellSize: ["auto", 14],
    range: "2025",
    splitLine: { show: true, lineStyle: { color: readToken("--border") } },
    itemStyle: { color: readToken("--card"), borderColor: readToken("--border"), borderWidth: 1 },
    yearLabel: { show: false },
    monthLabel: {
      color: readToken("--muted-foreground"),
      fontSize: 11,
      nameMap: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    },
    dayLabel: {
      color: readToken("--muted-foreground"),
      fontSize: 10,
      firstDay: 1,
      nameMap: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    },
  },
  series: [{ type: "heatmap", coordinateSystem: "calendar", data: dados }],
};

const codigoReact = `import type { EChartsOption } from "echarts";
import { BrandChart } from "@/components/charts/BrandChart";
import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

// dados: array de ["AAAA-MM-DD", quantidade] para todos os dias do ano
const dados: [string, number][] = [["2025-01-01", 42], ["2025-01-02", 68] /* ... */];

const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (p) => {
      const v = (p as { value: [string, number] }).value;
      const partes = v[0].split("-");
      return partes[2] + "/" + partes[1] + "/" + partes[0] + "<br/><strong>" + formatarNumero(v[1]) + "</strong> atendimentos";
    },
  },
  visualMap: {
    type: "continuous", min: 8, max: 112, calculable: true,
    orient: "horizontal", left: "center", top: 0, itemWidth: 12, itemHeight: 120,
    text: ["Mais", "Menos"],
    inRange: { color: [readToken("--primary", 0.12), readToken("--primary", 0.45), readToken("--primary"), readToken("--brand-comp-indigo")] },
  },
  calendar: {
    top: 70, left: 40, right: 20, cellSize: ["auto", 14], range: "2025",
    splitLine: { show: true, lineStyle: { color: readToken("--border") } },
    itemStyle: { color: readToken("--card"), borderColor: readToken("--border"), borderWidth: 1 },
    yearLabel: { show: false },
    monthLabel: { nameMap: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], fontSize: 11 },
    dayLabel: { firstDay: 1, nameMap: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], fontSize: 10 },
  },
  series: [{ type: "heatmap", coordinateSystem: "calendar", data: dados }],
};

export function CalendarioAtendimentosChart() {
  return (
    <BrandChart
      option={option}
      height={260}
      ariaLabel="Calendário de calor com atendimentos diários em 2025. Dias úteis concentram entre 52 e 112 atendimentos, enquanto fins de semana ficam entre 8 e 22."
    />
  );
}`;

export const heatmapCalendario: ChartPreset = {
  id: "heatmap-calendario",
  nome: "Calendário de Calor",
  categoria: "distribuicao",
  descricao:
    "Atendimentos diários ao longo de 12 meses em coordenada calendar, com escala contínua derivada do token primary.",
  tags: ["calendário", "heatmap", "sazonalidade", "diário"],
  option,
  codigoReact,
  quandoUsar: [
    "Revelar sazonalidade diária e semanal em um período longo",
    "Identificar picos, feriados e vazios operacionais",
    "Quando a granularidade do dado é exatamente um valor por dia",
  ],
  quandoNaoUsar: [
    "Comparar valores com precisão — a cor é uma leitura aproximada",
    "Séries com menos de dois meses de histórico",
    "Métricas que podem ser negativas",
  ],
  acessibilidade: [
    "A escala de cor precisa vir de tokens para manter contraste em light e dark",
    "Tooltip com data completa em DD/MM/AAAA e valor formatado",
    "Ofereça tabela mensal agregada como alternativa ao mapa de calor",
  ],
  ariaLabel:
    "Calendário de calor com atendimentos diários em 2025. Dias úteis concentram entre 52 e 112 atendimentos, enquanto fins de semana ficam entre 8 e 22.",
  altura: 260,
};

export default heatmapCalendario;
