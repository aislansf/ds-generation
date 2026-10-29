import { describe, it, expect } from "vitest";
import { aplicarSimbolos as aplicarTipado, SIMBOLOS } from "../simbolos";

// Os options dos testes são mínimos: o tipo completo do ECharts não importa aqui
const aplicarSimbolos = (option: unknown, variedade?: number): any => aplicarTipado(option as any, variedade);

const linhas = { series: [{ type: "line", data: [1] }, { type: "line", data: [2] }, { type: "line", data: [3] }, { type: "line", data: [4] }] };

describe("aplicarSimbolos", () => {
  it("não muda o option com a variedade em 0 ou 1 (todos os estilos, menos o Bauhaus)", () => {
    expect(aplicarSimbolos(linhas, 0)).toBe(linhas);
    expect(aplicarSimbolos(linhas, 1)).toBe(linhas);
  });

  it("sem o token (jsdom) a variedade é 0 e o option sai igual", () => {
    expect(aplicarSimbolos(linhas)).toBe(linhas);
  });

  it("alterna círculo, quadrado e triângulo entre as séries de linha", () => {
    const r = aplicarSimbolos(linhas, 3);
    expect(r.series.map((s: any) => s.symbol)).toEqual([...SIMBOLOS, "circle"]);
    expect(r.series.every((s: any) => s.showSymbol === true && s.symbolSize === 8)).toBe(true);
    expect((linhas.series[0] as any).symbol).toBeUndefined();
  });

  it("com a variedade 2 alterna só círculo e quadrado", () => {
    const r = aplicarSimbolos(linhas, 2);
    expect(r.series.map((s: any) => s.symbol)).toEqual(["circle", "rect", "circle", "rect"]);
  });

  it("respeita séries com símbolo próprio, ignora barras e aceita série única", () => {
    const r = aplicarSimbolos({ series: [{ type: "bar" }, { type: "line", symbol: "diamond" }, { type: "scatter" }] }, 3);
    expect(r.series[0].symbol).toBeUndefined();
    expect(r.series[1].symbol).toBe("diamond");
    expect(r.series[2].symbol).toBe("circle");
    const unica = aplicarSimbolos({ series: { type: "scatter" } }, 3);
    expect(unica.series.symbol).toBe("circle");
  });
});
