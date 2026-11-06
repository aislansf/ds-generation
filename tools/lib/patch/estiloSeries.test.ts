import { describe, it, expect } from "vitest";
import { aplicarEstiloSeries as aplicarTipado, comAlpha } from "../estiloSeries";

// Os options dos testes são mínimos: o tipo completo do ECharts não importa aqui
const aplicar = (option: unknown, opcoes?: { trilha?: boolean; areaDegrade?: boolean; relevo?: number }): any => aplicarTipado(option as any, opcoes);
const ligado = { trilha: true, areaDegrade: true };

describe("comAlpha", () => {
  it("lê rgb, rgba e hexadecimal e devolve rgba com o alfa pedido", () => {
    expect(comAlpha("rgb(10, 20, 30)", 0.5)).toBe("rgba(10, 20, 30, 0.5)");
    expect(comAlpha("rgba(10, 20, 30, 0.9)", 0.1)).toBe("rgba(10, 20, 30, 0.1)");
    // o gerador recolore hexadecimais literais dos arquivos do DS: aqui eles são montados na hora
    // o gerador recolore cores literais (hex e rgb) dos arquivos do DS: aqui o hexadecimal e o esperado são montados na hora
    const esperado = (canais: number[]) => `rgba(${canais.join(", ")}, 0.2)`;
    expect(comAlpha(["#", "0a", "14", "1e"].join(""), 0.2)).toBe(esperado([10, 20, 30]));
    expect(comAlpha(["#", "1", "2", "3"].join(""), 0.2)).toBe(esperado([17, 34, 51]));
  });

  it("devolve null para o que não sabe ler (degradê, nome de cor, vazio)", () => {
    expect(comAlpha({ type: "linear" }, 0.5)).toBeNull();
    expect(comAlpha("red", 0.5)).toBeNull();
    expect(comAlpha(undefined, 0.5)).toBeNull();
  });
});

describe("aplicarEstiloSeries", () => {
  const barras = { series: [{ type: "bar", data: [1] }, { type: "bar", data: [2] }] };
  const unica = { series: [{ type: "bar", data: [1] }, { type: "line", data: [2] }] };

  it("com os dois desligados (todos os estilos, menos o Neumorfismo) o option sai igual", () => {
    expect(aplicar(barras, { trilha: false, areaDegrade: false })).toBe(barras);
  });

  it("sem os tokens (jsdom) também sai igual", () => {
    expect(aplicar(barras)).toBe(barras);
  });

  it("trilha: a série única de barras ganha showBackground sem mexer no option de entrada", () => {
    const r = aplicar(unica, { trilha: true });
    expect(r.series.map((s: any) => s.showBackground)).toEqual([true, undefined]);
    expect(r.series[0].backgroundStyle.color).toMatch(/^rgba\(/);
    expect((unica.series[0] as any).showBackground).toBeUndefined();
  });

  it("trilha: barras agrupadas (várias séries lado a lado) ou várias pilhas ficam sem trilha", () => {
    expect(aplicar(barras, { trilha: true })).toBe(barras);
    const pilhas = { series: [{ type: "bar", stack: "a" }, { type: "bar", stack: "b" }] };
    expect(aplicar(pilhas, { trilha: true })).toBe(pilhas);
  });

  it("trilha: barras coladas (histograma, barCategoryGap 0) ficam sem trilha", () => {
    const zero = { series: [{ type: "bar", barCategoryGap: "0%" }] };
    const numero = { series: [{ type: "bar", barCategoryGap: 0 }] };
    expect(aplicar(zero, { trilha: true })).toBe(zero);
    expect(aplicar(numero, { trilha: true })).toBe(numero);
    expect(aplicar({ series: [{ type: "bar", barCategoryGap: "40%" }] }, { trilha: true }).series[0].showBackground).toBe(true);
  });

  it("trilha: em barras empilhadas só a primeira série da pilha leva a trilha", () => {
    const r = aplicar({ series: [{ type: "bar", stack: "a" }, { type: "bar", stack: "a" }, { type: "bar", stack: "a" }] }, { trilha: true });
    expect(r.series.map((s: any) => s.showBackground)).toEqual([true, undefined, undefined]);
  });

  it("trilha: respeita showBackground e backgroundStyle que o option já define", () => {
    const r = aplicar({ series: [{ type: "bar", backgroundStyle: { color: "red" } }] }, { trilha: true });
    expect(r.series[0].backgroundStyle.color).toBe("red");
    const desligado = { series: [{ type: "bar", showBackground: false }] };
    expect(aplicar(desligado, { trilha: true })).toBe(desligado);
  });

  it("trilha: o anel de fundo do medidor de uma cor só vira neutro; o de várias faixas fica", () => {
    const anel = { type: "gauge", axisLine: { lineStyle: { width: 12, color: [[1, "rgba(1, 2, 3, 0.15)"]] } } };
    const faixas = { type: "gauge", axisLine: { lineStyle: { color: [[0.5, "red"], [1, "green"]] } } };
    const r = aplicar({ series: [anel, faixas] }, { trilha: true });
    expect(r.series[0].axisLine.lineStyle.color[0][1]).not.toBe("rgba(1, 2, 3, 0.15)");
    expect(r.series[0].axisLine.lineStyle.color[0][0]).toBe(1);
    expect(r.series[0].axisLine.lineStyle.width).toBe(12);
    expect(r.series[1]).toBe(faixas);
  });

  it("área em degradê: o preenchimento da linha esmaece para baixo, na cor da própria série", () => {
    const r = aplicar({ series: [{ type: "line", lineStyle: { color: "rgb(10, 20, 30)" }, areaStyle: { opacity: 0.2 } }] }, { areaDegrade: true });
    const area = r.series[0].areaStyle;
    expect(area.opacity).toBe(1);
    expect(area.color.type).toBe("linear");
    expect(area.color.colorStops).toEqual([
      { offset: 0, color: "rgba(10, 20, 30, 0.32)" },
      { offset: 1, color: "rgba(10, 20, 30, 0.02)" },
    ]);
  });

  it("área em degradê: sem cor própria usa a paleta pelo índice da série", () => {
    const r = aplicar({ series: [{ type: "bar" }, { type: "line", areaStyle: {} }] }, { areaDegrade: true });
    expect(r.series[1].areaStyle.color.colorStops[0].color).toMatch(/^rgba\(\d+, \d+, \d+, 0\.32\)$/);
  });

  it("área em degradê: deixa como está a área empilhada, a que já é degradê e a linha sem área", () => {
    const empilhada = { type: "line", stack: "t", areaStyle: {} };
    const jaDegrade = { type: "line", areaStyle: { color: { type: "linear", colorStops: [] } } };
    const semArea = { type: "line" };
    const r = aplicar({ series: [empilhada, jaDegrade, semArea] }, { areaDegrade: true });
    expect(r.series[0]).toBe(empilhada);
    expect(r.series[1]).toBe(jaDegrade);
    expect(r.series[2]).toBe(semArea);
  });

  it("relevo: barras, fatias e pontos ganham sombra com o desfoque pedido, sem mexer no option de entrada", () => {
    const entrada = { series: [{ type: "bar" }, { type: "pie" }, { type: "scatter" }, { type: "line" }] };
    const r = aplicar(entrada, { relevo: 6 });
    expect(r.series.slice(0, 3).map((s: any) => s.itemStyle.shadowBlur)).toEqual([6, 6, 6]);
    expect(r.series[0].itemStyle.shadowOffsetX).toBe(2);
    expect(r.series[0].itemStyle.shadowOffsetY).toBe(3);
    expect(r.series[0].itemStyle.shadowColor).toMatch(/^rgba\(/);
    expect(r.series[3]).toBe(entrada.series[3]);
    expect((entrada.series[0] as any).itemStyle).toBeUndefined();
  });

  it("relevo: respeita a sombra própria, a série de apoio invisível e o desligado", () => {
    const propria = { type: "bar", itemStyle: { shadowBlur: 20 } };
    const apoio = { type: "bar", itemStyle: { color: "transparent" } };
    const oculta = { type: "bar", itemStyle: { opacity: 0 } };
    const option = { series: [propria, apoio, oculta] };
    expect(aplicar(option, { relevo: 6 })).toBe(option);
    expect(aplicar({ series: [{ type: "bar" }] }, { relevo: 0 }).series[0].itemStyle).toBeUndefined();
  });

  it("relevo: mantém as demais propriedades de itemStyle e convive com a trilha", () => {
    const r = aplicar({ series: [{ type: "bar", itemStyle: { color: "red" } }] }, { relevo: 6, trilha: true });
    expect(r.series[0].itemStyle.color).toBe("red");
    expect(r.series[0].itemStyle.shadowBlur).toBe(6);
    expect(r.series[0].showBackground).toBe(true);
  });

  it("aceita série única fora de lista", () => {
    const r = aplicar({ series: { type: "bar" } }, { trilha: true });
    expect(r.series.showBackground).toBe(true);
  });
});
