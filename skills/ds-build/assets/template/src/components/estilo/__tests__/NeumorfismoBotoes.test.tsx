import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoBotoes from "../NeumorfismoBotoes";

describe("NeumorfismoBotoes", () => {
  it("monta as doze peças do exemplo, todas com o gancho de botão", () => {
    const { container } = render(<NeumorfismoBotoes />);
    const botoes = Array.from(container.querySelectorAll('[data-ds="button"]')).filter((b) => b.closest(".neu-stack"));
    expect(botoes).toHaveLength(12);
    expect(screen.getByRole("button", { name: "Novo Atendimento" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Citron Neon Glow/ })).toBeTruthy();
  });

  it("carregando: desabilitado e com aria-busy; o último botão é só desabilitado", () => {
    render(<NeumorfismoBotoes />);
    const carregando = screen.getByRole("button", { name: /Carregando/ }) as HTMLButtonElement;
    expect(carregando.disabled).toBe(true);
    expect(carregando.getAttribute("aria-busy")).toBe("true");
    const botoes = screen.getAllByRole("button", { name: "Botão" }) as HTMLButtonElement[];
    expect(botoes).toHaveLength(2);
    expect(botoes[0].disabled).toBe(false);
    expect(botoes[1].disabled).toBe(true);
  });

  it("os ícones são decorativos e o destrutivo mantém o rótulo em texto", () => {
    const { container } = render(<NeumorfismoBotoes />);
    for (const svg of container.querySelectorAll(".neu-stack svg")) expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("button", { name: "Destrutivo Soft" })).toBeTruthy();
  });
});
