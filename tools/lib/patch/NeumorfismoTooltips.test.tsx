import { beforeAll, describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NeumorfismoTooltips from "../NeumorfismoTooltips";

describe("NeumorfismoTooltips", () => {
  // O Tooltip (Radix) posiciona a bolha com ResizeObserver, que o jsdom não traz
  beforeAll(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  const montar = () => render(<TooltipProvider><NeumorfismoTooltips /></TooltipProvider>);

  it("três botões só de ícone com nome; a primeira dica já vem aberta", () => {
    montar();
    expect(screen.getByRole("button", { name: "Visualizar" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Editar" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeTruthy();
    expect(screen.getAllByRole("tooltip").map((t) => t.textContent)).toEqual(["Visualizar detalhes"]);
  });

  it("a bolha aparece ao focar o gatilho e o liga por aria-describedby", () => {
    montar();
    const editar = screen.getByRole("button", { name: "Editar" });
    fireEvent.focus(editar);
    expect(screen.getAllByRole("tooltip").some((t) => t.textContent === "Editar registro")).toBe(true);
    expect(editar.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("a dica fixa se recolhe quando outra abre, para as bolhas não se sobreporem", () => {
    montar();
    expect(screen.getAllByRole("tooltip").map((t) => t.textContent)).toContain("Visualizar detalhes");
    fireEvent.focus(screen.getByRole("button", { name: "Excluir" }));
    const textos = screen.getAllByRole("tooltip").map((t) => t.textContent);
    expect(textos).toContain("Excluir");
    expect(textos).not.toContain("Visualizar detalhes");
  });
});
