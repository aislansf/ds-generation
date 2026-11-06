import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoColunasRotulos, { GraficoColunasRotulos } from "../NeumorfismoGraficoColunasRotulos";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);

describe("NeumorfismoColunasRotulos", () => {
  it("cartão: os dois gráficos do pacote, o primeiro com pílulas e vãos e o segundo com texto puro e sem vãos", () => {
    const { container } = render(<NeumorfismoColunasRotulos />);
    const [a, b] = [...container.querySelectorAll(".neu-gbar")];
    expect(texto(a, ".neu-gbar__dl-text")).toEqual(["128", "142", "165", "151", "188", "176", "204", "197"]);
    expect(a.querySelectorAll(".neu-gbar__dl-pill")).toHaveLength(8);
    expect(a.querySelectorAll(".neu-gbar__slot")).toHaveLength(8);
    expect(texto(b, ".neu-gbar__dl-text")).toHaveLength(10);
    expect(b.querySelectorAll(".neu-gbar__dl-pill")).toHaveLength(0);
    expect(b.querySelectorAll(".neu-gbar__slot")).toHaveLength(0);
    expect(a.querySelector(".neu-area__plot")?.getAttribute("style")).toContain("height: 320px");
    expect(b.querySelector(".neu-area__plot")?.getAttribute("style")).toContain("height: 280px");
  });

  it("destaque do maior: só a coluna de 204 brilha, com o ponto aceso e a borda tingida na pílula", () => {
    const { container } = render(<NeumorfismoColunasRotulos />);
    const a = container.querySelector(".neu-gbar") as HTMLElement;
    const pico = a.querySelectorAll(".neu-gbar__dl--peak");
    expect(pico).toHaveLength(1);
    expect(pico[0].textContent).toBe("204");
    expect(pico[0].querySelector(".neu-gbar__dl-led")).toBeTruthy();
    expect(a.querySelectorAll("path.neu-gbar__bar--peak")).toHaveLength(1);
  });

  it("sem legenda numa série só; a segunda tem legenda com as duas séries", () => {
    const { container } = render(<NeumorfismoColunasRotulos />);
    const [a, b] = [...container.querySelectorAll(".neu-gbar")];
    expect(a.querySelector(".neu-area__legend")).toBeNull();
    expect(texto(b, ".neu-area__key")).toEqual(["Presencial", "Online"]);
  });

  it("foco: a categoria ativa deixa as outras colunas e os rótulos esmaecidos", () => {
    const { container } = render(<NeumorfismoColunasRotulos />);
    const a = container.querySelector(".neu-gbar") as HTMLElement;
    fireEvent.keyDown(a.querySelector(".neu-area__focus") as HTMLElement, { key: "Home" });
    expect(a.querySelectorAll(".neu-gbar__dl--dim")).toHaveLength(7);
    expect(a.querySelectorAll(".neu-gbar__dl--on")).toHaveLength(1);
    expect(a.querySelectorAll("path.neu-gbar__bar--dim")).toHaveLength(7);
  });

  it("valores negativos penduram o rótulo abaixo da barra; empilhado, um rótulo com o total; formato do rótulo", () => {
    const { container, rerender } = render(<GraficoColunasRotulos dados={[{ name: "A", valor: 10 }, { name: "B", valor: -10 }]} />);
    const [ya, yb] = [...container.querySelectorAll(".neu-gbar__dl-text")].map((t) => Number(t.getAttribute("y")));
    expect(yb).toBeGreaterThan(ya);
    rerender(<GraficoColunasRotulos empilhado dados={[{ name: "A", x: 3, y: 4 }]} series={[{ chave: "x" }, { chave: "y" }]} />);
    expect(texto(container, ".neu-gbar__dl-text")).toEqual(["7"]);
    rerender(<GraficoColunasRotulos dados={[{ name: "A", valor: 1234 }]} formatarRotulo={(v) => `${v} mil`} />);
    expect(texto(container, ".neu-gbar__dl-text")).toEqual(["1234 mil"]);
    expect(screen.getByRole("group", { name: /Use as setas/ })).toBeTruthy();
  });

  it("pílula que não cabe vira texto puro: gráficos densos não empilham pílulas", () => {
    const dados = Array.from({ length: 40 }, (_, i) => ({ name: `M${i}`, a: 1000 + i, b: 2000 + i }));
    const { container } = render(<GraficoColunasRotulos dados={dados} series={[{ chave: "a" }, { chave: "b" }]} />);
    expect(container.querySelectorAll(".neu-gbar__dl-text").length).toBe(80);
    expect(container.querySelectorAll(".neu-gbar__dl-pill").length).toBeLessThan(80);
  });
});
