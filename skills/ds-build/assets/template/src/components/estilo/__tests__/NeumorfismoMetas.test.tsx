import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoMetas, { CartaoMeta } from "../NeumorfismoMetas";

describe("NeumorfismoMetas", () => {
  it("cartão: o StatCard do pacote, um grupo nomeado com a calha e a escala", () => {
    const { container } = render(<NeumorfismoMetas />);
    expect(screen.getByRole("group", { name: "Taxa de execução: 78,4%" })).toBeTruthy();
    const barra = screen.getByRole("progressbar", { name: "Taxa de execução" });
    expect(barra.getAttribute("aria-valuenow")).toBe("78.4");
    expect(barra.getAttribute("aria-valuetext")).toBe("78,4%, meta 95%");
    expect(container.querySelector(".neu-kpi__value.neu-kpi__value--heavy")?.textContent).toBe("78,4%");
    expect(container.querySelector(".neu-kpi__top .neu-tone-success svg")).toBeTruthy();
  });

  it("escala: 0%, a meta na cor da marca e 100%, com os extremos escondidos dos leitores de tela", () => {
    const { container } = render(<CartaoMeta rotulo="Meta" valor="10" progresso={10} meta="50%" />);
    const [a, b, c] = [...container.querySelectorAll(".neu-stat__scale span")];
    expect([a.textContent, b.textContent, c.textContent]).toEqual(["0%", "Meta: 50%", "100%"]);
    expect(b.className).toBe("neu-tone-accent");
    expect(a.getAttribute("aria-hidden")).toBe("true");
    expect(c.getAttribute("aria-hidden")).toBe("true");
    expect(b.getAttribute("aria-hidden")).toBeNull();
  });

  it("sem meta nem ícone: a escala fica sem o texto da meta, o topo só tem o rótulo e o texto falado é o valor", () => {
    const { container } = render(<CartaoMeta rotulo="Meta" valor="10" progresso={10} />);
    expect(container.querySelector(".neu-stat__scale .neu-tone-accent")?.textContent).toBe("");
    expect(container.querySelector(".neu-kpi__top .neu-tone-success")).toBeNull();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("10");
  });
});
