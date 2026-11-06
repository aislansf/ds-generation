import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoGrupoBotoes from "../NeumorfismoGrupoBotoes";

describe("NeumorfismoGrupoBotoes", () => {
  it("cada grupo tem role=group com nome e os botões só de ícone têm nome acessível", () => {
    const { container } = render(<NeumorfismoGrupoBotoes />);
    const grupos = Array.from(container.querySelectorAll('[role="group"]'));
    expect(grupos.length).toBeGreaterThanOrEqual(8);
    for (const g of grupos) expect(g.getAttribute("aria-label")).toBeTruthy();
    for (const b of container.querySelectorAll(".neu-seg--icone")) expect(b.getAttribute("aria-label")).toBeTruthy();
    expect(container.querySelector(".neu-bgroup--vertical")).not.toBeNull();
    expect(container.querySelector(".neu-bgroup--sm")).not.toBeNull();
  });

  it("alternância: um só botão fica marcado com aria-pressed e o clique troca", () => {
    render(<NeumorfismoGrupoBotoes />);
    const lista = screen.getByRole("button", { name: "Lista" });
    const grade = screen.getByRole("button", { name: "Grade" });
    expect(lista.getAttribute("aria-pressed")).toBe("true");
    expect(grade.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(grade);
    expect(grade.getAttribute("aria-pressed")).toBe("true");
    expect(lista.getAttribute("aria-pressed")).toBe("false");
  });

  it("paginação: o anterior começa desabilitado e o contador avança", () => {
    render(<NeumorfismoGrupoBotoes />);
    const anterior = screen.getByRole("button", { name: "Registro anterior" }) as HTMLButtonElement;
    expect(anterior.disabled).toBe(true);
    expect(screen.getByText("1 de 12")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Próximo registro" }));
    expect(screen.getByText("2 de 12")).toBeTruthy();
    expect(anterior.disabled).toBe(false);
  });

  it("ações dos segmentos aparecem na linha de status", () => {
    render(<NeumorfismoGrupoBotoes />);
    fireEvent.click(screen.getByRole("button", { name: "Arquivar" }));
    expect(screen.getByText(/Última ação: Arquivar/)).toBeTruthy();
  });
});
