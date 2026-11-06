import { afterEach, describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { readToken } from "../brandTheme";
import { aplicarTemaVivo as aplicarTipado, useTemaDoDocumento } from "../temaCores";

const aplicar = (option: unknown, ativo = true): any => aplicarTipado(option as any, ativo);
const raiz = document.documentElement.style;
// o gerador recolore cores literais dos arquivos do DS: tudo aqui é lido ou calculado na hora
const tema = (primaria: string) => raiz.setProperty("--primary", primaria);

afterEach(() => {
  raiz.removeProperty("--primary");
  raiz.removeProperty("--chart-theme-sync");
  document.documentElement.classList.remove("dark");
});

describe("useTemaDoDocumento", () => {
  it("desligado devolve o tema recebido e ignora a classe do <html>", () => {
    const { result } = renderHook(() => useTemaDoDocumento("light"));
    act(() => document.documentElement.classList.add("dark"));
    expect(result.current).toBe("light");
  });

  it("ligado lê a classe do <html> e acompanha a troca feita por outro componente", async () => {
    raiz.setProperty("--chart-theme-sync", "1");
    const { result, unmount } = renderHook(() => useTemaDoDocumento("light"));
    expect(result.current).toBe("light");
    await act(async () => {
      document.documentElement.classList.add("dark");
    });
    expect(result.current).toBe("dark");
    await act(async () => {
      document.documentElement.classList.remove("dark");
    });
    expect(result.current).toBe("light");
    unmount();
  });

  it("ligado corrige o tema salvo quando a classe do <html> já diz outro", () => {
    raiz.setProperty("--chart-theme-sync", "1");
    document.documentElement.classList.add("dark");
    const { result, unmount } = renderHook(() => useTemaDoDocumento("light"));
    expect(result.current).toBe("dark");
    unmount();
  });
});

describe("aplicarTemaVivo", () => {
  it("desligado (todos os estilos, menos o Neumorfismo) o option sai igual", () => {
    tema("10 50% 40%");
    const option = { series: [{ type: "bar", itemStyle: { color: readToken("--primary") } }] };
    tema("200 60% 70%");
    expect(aplicar(option, false)).toBe(option);
  });

  it("sem o token (jsdom) também sai igual", () => {
    const option = { series: [{ type: "bar", itemStyle: { color: readToken("--primary") } }] };
    expect(aplicarTipado(option as any)).toBe(option);
  });

  it("a cor lida antes da troca de tema vira a cor do tema de agora", () => {
    tema("10 50% 40%");
    const antiga = readToken("--primary");
    tema("200 60% 70%");
    const nova = readToken("--primary");
    expect(antiga).not.toBe(nova);
    const r = aplicar({ color: [antiga], series: [{ type: "bar", itemStyle: { color: antiga } }] });
    expect(r.series[0].itemStyle.color).toBe(nova);
    expect(r.color[0]).toBe(nova);
  });

  it("o alfa da leitura original é mantido", () => {
    tema("10 50% 40%");
    const antiga = readToken("--primary", 0.3);
    tema("200 60% 70%");
    const r = aplicar({ series: [{ areaStyle: { color: antiga } }] });
    expect(r.series[0].areaStyle.color).toBe(readToken("--primary", 0.3));
    expect(r.series[0].areaStyle.color).not.toBe(antiga);
  });

  it("não mexe no option de entrada e devolve a mesma referência quando nada muda", () => {
    tema("10 50% 40%");
    const antiga = readToken("--primary");
    tema("200 60% 70%");
    const option = { series: [{ type: "bar", itemStyle: { color: antiga } }] };
    aplicar(option);
    expect(option.series[0].itemStyle.color).toBe(antiga);
    const semCor = { series: [{ type: "bar", data: [1, 2, 3], name: "texto" }] };
    expect(aplicar(semCor)).toBe(semCor);
  });

  it("cores que não vieram de token ficam como estão", () => {
    const literal = ["rgb(", "1, 2, 3", ")"].join("");
    const option = { series: [{ itemStyle: { color: literal } }] };
    expect(aplicar(option)).toBe(option);
  });

  it("alcança degradês, dados com cor própria e listas aninhadas", () => {
    tema("10 50% 40%");
    const antiga = readToken("--primary");
    tema("200 60% 70%");
    const nova = readToken("--primary");
    class Degrade {
      constructor(public colorStops: { offset: number; color: string }[]) {}
    }
    const degrade = new Degrade([{ offset: 0, color: antiga }, { offset: 1, color: "transparent" }]);
    const r = aplicar({
      series: [{ type: "bar", data: [{ value: 1, itemStyle: { color: antiga } }, 2], areaStyle: { color: degrade } }],
    });
    expect(r.series[0].data[0].itemStyle.color).toBe(nova);
    expect(r.series[0].areaStyle.color).toBeInstanceOf(Degrade);
    expect(r.series[0].areaStyle.color.colorStops[0].color).toBe(nova);
    expect(r.series[0].areaStyle.color.colorStops[1].color).toBe("transparent");
    expect(degrade.colorStops[0].color).toBe(antiga);
  });

  it("dados numéricos passam sem cópia e referência circular não trava", () => {
    const dados = [1, 2, 3];
    const circular: any = { series: [{ data: dados }] };
    circular.series[0].volta = circular;
    const r = aplicar(circular);
    expect(r.series[0].data).toBe(dados);
  });
});
