import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoColunas, { GraficoColunas } from "../NeumorfismoGraficoColunas";

describe("NeumorfismoColunas", () => {
  it("cartão: o gráfico do pacote, com três programas por mês, vão atrás de cada coluna e título no eixo Y", () => {
    const { container } = render(<NeumorfismoColunas />);
    expect(container.querySelector(".neu-area__title")?.textContent).toBe("Investimento por programa");
    expect(container.querySelectorAll("path.neu-gbar__bar")).toHaveLength(18);
    expect(container.querySelectorAll(".neu-gbar__slot")).toHaveLength(18);
    expect(container.querySelector(".neu-gbar__ylabel")?.textContent).toBe("R$ (milhões)");
    expect(container.querySelector(".neu-area__plot")?.getAttribute("style")).toContain("height: 320px");
  });

  it("cores por série: sucesso, marca e azul, na legenda com amostras quadradas", () => {
    const { container } = render(<NeumorfismoColunas />);
    expect(screen.getByRole("button", { name: "Empreendedorismo" }).className).toContain("neu-area__s--success");
    expect(screen.getByRole("button", { name: "Inovação" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "Tecnologia" }).className).toContain("neu-area__s--royal");
    expect(container.querySelectorAll(".neu-gbar__key-dot")).toHaveLength(3);
  });

  it("topo de 4px: a ponta de cima das colunas usa o raio das colunas, não o de 6px das barras", () => {
    const { container } = render(<GraficoColunas dados={[{ name: "X", valor: 100 }]} />);
    const d = container.querySelector("path.neu-gbar__bar")?.getAttribute("d") ?? "";
    const [, x, topo] = d.match(/^M([\d.]+),[\d.]+V([\d.]+)Q/) ?? [];
    expect(Number(topo) - Number(d.match(/Q[\d.]+,([\d.]+) /)?.[1])).toBeCloseTo(4, 5);
    expect(x).toBeTruthy();
  });

  it("o balão traz cada série e a faixa de foco acompanha a coluna; os padrões podem ser trocados", () => {
    const { container, rerender } = render(<NeumorfismoColunas />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect([...container.querySelectorAll(".neu-area__tip-row")].map((r) => r.textContent)).toEqual(["Empreendedorismo: 44", "Inovação: 76", "Tecnologia: 35"]);
    expect(container.querySelector(".neu-gbar__hover")).toBeTruthy();
    rerender(<GraficoColunas dados={[{ name: "X", valor: 1 }]} fendas={false} altura={200} />);
    expect(container.querySelectorAll(".neu-gbar__slot")).toHaveLength(0);
    expect(container.querySelector(".neu-area__plot")?.getAttribute("style")).toContain("height: 200px");
  });
});
