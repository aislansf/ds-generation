import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoColunasPercentuais, { GraficoColunasPercentuais } from "../NeumorfismoGraficoColunasPercentuais";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);

describe("NeumorfismoColunasPercentuais", () => {
  it("cartão: seis colunas de três segmentos, eixo de 0% a 100% e a fatia dentro de cada segmento", () => {
    const { container } = render(<NeumorfismoColunasPercentuais />);
    expect(container.querySelector(".neu-area__title")?.textContent).toBe("Participação por programa");
    expect(container.querySelectorAll("path.neu-gbar__bar")).toHaveLength(18);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0%", "25%", "50%", "75%", "100%"]);
    expect(texto(container, ".neu-gbar__in-text")).toHaveLength(18);
    expect(texto(container, ".neu-gbar__in-text").slice(0, 3)).toEqual(["30%", "45%", "25%"]);
    expect(container.querySelector(".neu-area__plot")?.getAttribute("style")).toContain("height: 320px");
  });

  it("segmentos: cada coluna chega a 100%, com costura fina e só o segmento de cima arredondado", () => {
    const { container } = render(<NeumorfismoColunasPercentuais />);
    const b = [...container.querySelectorAll("path.neu-gbar__bar")];
    expect(b.every((p) => p.getAttribute("class")?.includes("neu-gbar__bar--seg"))).toBe(true);
    expect(b.filter((p) => p.getAttribute("d")?.includes("Q"))).toHaveLength(6);
    // o segmento de cima de cada coluna termina no teto do eixo (100%)
    const topos = b.filter((p) => p.getAttribute("d")?.includes("Q")).map((p) => Number((p.getAttribute("d") ?? "").match(/V([\d.]+)Q/)?.[1]) - 4);
    expect(new Set(topos.map((t) => t.toFixed(2))).size).toBe(1);
  });

  it("pílula dentro do segmento, e texto branco com contorno quando a coluna é estreita demais", () => {
    const { container, rerender } = render(<NeumorfismoColunasPercentuais />);
    expect(container.querySelectorAll(".neu-gbar__in-pill").length).toBeGreaterThan(0);
    expect(container.querySelector(".neu-gbar__in-text--bare")).toBeNull();
    rerender(<GraficoColunasPercentuais formatarInterno={() => "texto bem comprido"} dados={[{ name: "X", a: 60, b: 40 }]} series={[{ chave: "a" }, { chave: "b" }]} />);
    expect(container.querySelectorAll(".neu-gbar__in-text--bare").length).toBeGreaterThan(0);
  });

  it("os dados podem ser contagens: a fatia é o valor sobre o total, com uma casa decimal quando preciso", () => {
    const { container } = render(<GraficoColunasPercentuais dados={[{ name: "X", a: 1, b: 2 }]} series={[{ chave: "a" }, { chave: "b" }]} />);
    expect(texto(container, ".neu-gbar__in-text")).toEqual(["33,3%", "66,7%"]);
  });

  it("balão: a fatia de cada série de cima para baixo, e o valor bruto quando pedido", () => {
    const { container, rerender } = render(<NeumorfismoColunasPercentuais />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect(texto(container, ".neu-area__tip-row")).toEqual(["Tecnologia: 25%", "Inovação: 45%", "Empreendedorismo: 30%"]);
    rerender(<GraficoColunasPercentuais mostrarBruto dados={[{ name: "X", a: 1, b: 3 }]} series={[{ chave: "a", nome: "A" }, { chave: "b", nome: "B" }]} />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect(texto(container, ".neu-area__tip-row")).toEqual(["B: 75% 3", "A: 25% 1"]);
  });

  it("legenda: apagar uma série recalcula as fatias das que ficam", () => {
    const { container } = render(<GraficoColunasPercentuais dados={[{ name: "X", a: 50, b: 25, c: 25 }]} series={[{ chave: "a", nome: "A" }, { chave: "b", nome: "B" }, { chave: "c", nome: "C" }]} />);
    expect(texto(container, ".neu-gbar__in-text")).toEqual(["50%", "25%", "25%"]);
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(texto(container, ".neu-gbar__in-text")).toEqual(["50%", "50%"]);
  });

  it("formatarInterno troca o texto do segmento", () => {
    const { container } = render(<GraficoColunasPercentuais formatarInterno={(f, v) => `${v}/${Math.round(f)}`} dados={[{ name: "X", a: 1, b: 1 }]} series={[{ chave: "a" }, { chave: "b" }]} />);
    expect(texto(container, ".neu-gbar__in-text")).toEqual(["1/50", "1/50"]);
  });
});
