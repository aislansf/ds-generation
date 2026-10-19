/**
 * Rótulos de valor legíveis sobre escalas de cor (heatmaps e matrizes).
 *
 * Sem cor definida, o ECharts escreve os rótulos em branco com contorno, que
 * somem nas células claras. Aqui cada célula recebe a cor de texto do DS com
 * mais contraste contra a cor que ela realmente tem: `--foreground` ou
 * `--primary-foreground`. A cor da célula é calculada com as mesmas cores do
 * `visualMap.inRange` e sobreposta ao `--card`, então vale para qualquer marca,
 * inclusive com primária clara.
 */

import { readToken } from "@/lib/echarts/brandTheme";
import { formatarNumero } from "@/lib/echarts/format";

type Rgba = [number, number, number, number];

function rgba(cor: string): Rgba {
  const [r = 0, g = 0, b = 0, a = 1] = (cor.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b, a];
}

function luminancia([r, g, b]: Rgba): number {
  const canal = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(a: Rgba, b: Rgba): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * `label` de uma série heatmap com a cor do texto ajustada a cada célula.
 *
 * @param cores as mesmas cores passadas em `visualMap.inRange.color`
 * @param min   `visualMap.min`
 * @param max   `visualMap.max`
 */
export function rotuloSobreEscala(cores: string[], min: number, max: number, { fontSize = 10 } = {}) {
  const fundo = rgba(readToken("--card"));
  const paradas = cores.map(rgba);
  const texto = readToken("--foreground");
  const sobrePrimaria = readToken("--primary-foreground");
  const [rgbTexto, rgbSobrePrimaria] = [rgba(texto), rgba(sobrePrimaria)];

  const corDaCelula = (valor: number): Rgba => {
    const t = max > min ? Math.min(1, Math.max(0, (valor - min) / (max - min))) : 0;
    const pos = t * (paradas.length - 1);
    const i = Math.min(paradas.length - 2, Math.floor(pos));
    const f = pos - i;
    const [a, b] = [paradas[i], paradas[i + 1] ?? paradas[i]];
    const [r, g, bl, alfa] = a.map((c, k) => c + (b[k] - c) * f) as Rgba;
    // A célula é desenhada sobre o card: aplica a transparência
    return [0, 1, 2].map((k) => [r, g, bl][k] * alfa + fundo[k] * (1 - alfa)).concat(1) as Rgba;
  };

  const estilo = { fontSize, fontWeight: 600, textBorderWidth: 0 };
  return {
    show: true,
    ...estilo,
    formatter: (p: { value?: unknown }) => {
      const valor = (p.value as number[])[2];
      const celula = corDaCelula(valor);
      const chave = contraste(celula, rgbTexto) >= contraste(celula, rgbSobrePrimaria) ? "texto" : "sobrePrimaria";
      return `{${chave}|${formatarNumero(valor)}}`;
    },
    rich: {
      texto: { ...estilo, color: texto },
      sobrePrimaria: { ...estilo, color: sobrePrimaria },
    },
  };
}
