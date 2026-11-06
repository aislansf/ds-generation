import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoSpinners, { Carregando } from "../NeumorfismoSpinners";

describe("NeumorfismoSpinners", () => {
  it("quatro discos soltos (56, 64, 80 e secundário) e quatro cartões de especificação", () => {
    const { container } = render(<NeumorfismoSpinners />);
    const discos = Array.from(container.querySelectorAll(".neu-spinner")) as HTMLElement[];
    expect(discos).toHaveLength(8);
    expect(discos.slice(0, 3).map((d) => d.style.width)).toEqual(["56px", "64px", "80px"]);
    expect(discos[3].className).toContain("neu-spinner--royal");
    expect(container.querySelectorAll(".neu-spinner-card")).toHaveLength(4);
    expect(container.querySelectorAll(".neu-spinner-card .neu-spinner__ring")).toHaveLength(4);
    expect(screen.getByText("28px · Cor secundária")).toBeTruthy();
    expect(screen.getByText("Carregamento de tela")).toBeTruthy();
  });

  it("cada spinner é um status com nome acessível e glifo decorativo que gira", () => {
    render(<NeumorfismoSpinners />);
    expect(screen.getAllByRole("status", { name: "Carregando" })).toHaveLength(4);
    expect(screen.getByRole("status", { name: "Carregando (Tamanho SM)" })).toBeTruthy();
    expect(screen.getByRole("status", { name: "Carregando (Secundário)" })).toBeTruthy();
    for (const s of screen.getAllByRole("status")) {
      const glifo = s.querySelector("svg");
      expect(glifo?.getAttribute("aria-hidden")).toBe("true");
      expect(glifo?.getAttribute("class")).toContain("neu-spin");
    }
  });

  it("o anel tem trilha a 25% e arco a 90%; o rótulo é configurável", () => {
    const { container } = render(<Carregando glifo="anel" tamanho="lg" rotulo="Carregando relatório" />);
    expect(screen.getByRole("status", { name: "Carregando relatório" })).toBeTruthy();
    const anel = container.querySelector(".neu-spinner__ring") as SVGElement;
    expect(anel.getAttribute("width")).toBe("40");
    expect(anel.querySelector("circle")?.getAttribute("opacity")).toBe(".25");
    expect(anel.querySelector("path")?.getAttribute("opacity")).toBe(".9");
  });
});
