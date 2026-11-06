import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoLinhas, { GraficoLinhas } from "../NeumorfismoGraficoLinhas";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const graficos = (c: HTMLElement) => [...c.querySelectorAll(".neu-area")] as HTMLElement[];

describe("NeumorfismoLinhas", () => {
  it("cartão: os dois gráficos do pacote, com 3 linhas cada, sem preenchimento e com o sulco sob cada linha", () => {
    const { container } = render(<NeumorfismoLinhas />);
    const g = graficos(container);
    expect(g).toHaveLength(2);
    expect(g.map((a) => a.querySelectorAll(".neu-area__line").length)).toEqual([3, 3]);
    expect(g.map((a) => a.querySelectorAll(".neu-area__line-track").length)).toEqual([3, 3]);
    expect(g.every((a) => a.querySelectorAll("path[fill^='url(']").length === 0)).toBe(true);
    expect(g.every((a) => a.querySelectorAll(".neu-area__line--solo").length === 3)).toBe(true);
    expect(texto(container, ".neu-area__title")).toEqual(["Receita, custo e lucro", "Satisfação (NPS) por região"]);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Mensal");
  });

  it("anéis de 4px em todos os pontos (6,5px no ativo) e as cores da paleta de dados", () => {
    const { container } = render(<NeumorfismoLinhas />);
    const [a] = graficos(container);
    const aneis = [...a.querySelectorAll(".neu-area__dot")];
    expect(aneis).toHaveLength(18);
    expect(aneis.every((c) => c.getAttribute("r") === "4")).toBe(true);
    expect(screen.getByRole("button", { name: "Receita" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "Custo" }).className).toContain("neu-area__s--royal");
    expect(screen.getByRole("button", { name: "Lucro" }).className).toContain("neu-area__s--success");
    fireEvent.keyDown(a.querySelector(".neu-area__focus") as HTMLElement, { key: "Home" });
    expect(a.querySelectorAll(".neu-area__dot--on")).toHaveLength(3);
    expect(a.querySelector(".neu-area__dot--on")?.getAttribute("r")).toBe("6.5");
  });

  it("valores em reais no eixo e no balão", () => {
    const { container } = render(<NeumorfismoLinhas />);
    const [a] = graficos(container);
    expect(texto(a, ".neu-area__ytick")[0]).toBe("R$ 0");
    fireEvent.keyDown(a.querySelector(".neu-area__focus") as HTMLElement, { key: "Home" });
    expect(texto(a, ".neu-area__tip-row")).toEqual(["Receita: R$ 4.200", "Custo: R$ 2.900", "Lucro: R$ 1.300"]);
  });

  it("série tracejada: a linha e a amostra da legenda são tracejadas; as outras não", () => {
    const { container } = render(<NeumorfismoLinhas />);
    const [, b] = graficos(container);
    expect(b.querySelectorAll(".neu-area__line--dashed")).toHaveLength(1);
    const amostras = [...b.querySelectorAll(".neu-area__key-dot")].map((i) => i.getAttribute("class"));
    expect(amostras.map((c) => c?.includes("neu-area__key-dot--dashed"))).toEqual([false, false, true]);
    expect(amostras.every((c) => c?.includes("neu-area__key-dot--line"))).toBe(true);
    expect(screen.getByRole("button", { name: "Meta" }).className).toContain("neu-area__s--neutral");
  });

  it("eixo ajustado aos dados (sem zero): o piso acompanha o menor valor", () => {
    const { container } = render(<NeumorfismoLinhas />);
    const [a, b] = graficos(container);
    expect(texto(a, ".neu-area__ytick")[0]).toBe("R$ 0");
    const eixo = texto(b, ".neu-area__ytick").map(Number);
    expect(eixo[0]).toBeGreaterThan(0);
    expect(eixo[0]).toBeLessThanOrEqual(64);
    expect(eixo[eixo.length - 1]).toBeGreaterThanOrEqual(83);
  });

  it("legenda: apagar uma linha esvazia a amostra e reescala o eixo; a última visível não se apaga", () => {
    const { container } = render(<GraficoLinhas dados={[{ name: "A", x: 10, y: 1000 }, { name: "B", x: 20, y: 2000 }]} series={[{ chave: "x", nome: "X" }, { chave: "y", nome: "Y" }]} />);
    const eixoAntes = texto(container, ".neu-area__ytick");
    const y = screen.getByRole("button", { name: "Y" });
    fireEvent.click(y);
    expect(y.className).toContain("neu-area__key--off");
    expect(container.querySelectorAll(".neu-area__line")).toHaveLength(1);
    expect(texto(container, ".neu-area__ytick")).not.toEqual(eixoAntes);
    fireEvent.click(screen.getByRole("button", { name: "X" }));
    expect(container.querySelectorAll(".neu-area__line")).toHaveLength(1);
  });

  it("os anéis podem ser desligados e a curva trocada por segmentos retos", () => {
    const { container } = render(<GraficoLinhas dados={[{ name: "A", valor: 1 }, { name: "B", valor: 3 }, { name: "C", valor: 2 }]} pontos={false} curva="linear" />);
    expect(container.querySelectorAll(".neu-area__dot")).toHaveLength(0);
    expect(container.querySelector(".neu-area__line")?.getAttribute("d")).not.toMatch(/C/);
  });
});
