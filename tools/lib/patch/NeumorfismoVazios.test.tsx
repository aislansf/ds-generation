import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoVazios, { EstadoVazio } from "../NeumorfismoVazios";

describe("NeumorfismoVazios", () => {
  it("mostra o poço e o tracejado, os dois com título, frase e ação", () => {
    const { container } = render(<NeumorfismoVazios />);
    expect(container.querySelectorAll(".neu-empty")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-empty-d")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { name: "Nenhum resultado encontrado" })).toHaveLength(2);
    expect(screen.getAllByText(/Tente ajustar os filtros de busca/)).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /Nova busca/ })).toHaveLength(2);
  });

  it("os dois são regiões vivas e o ícone é decorativo", () => {
    const { container } = render(<NeumorfismoVazios />);
    expect(screen.getAllByRole("status")).toHaveLength(2);
    for (const icone of Array.from(container.querySelectorAll(".neu-empty__icon svg, .neu-empty-d__icon svg"))) {
      expect(icone.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("o poço mantém os ganchos da superfície de marca do DS; o tracejado não", () => {
    const { container } = render(<NeumorfismoVazios />);
    const poco = container.querySelector(".neu-empty") as HTMLElement;
    expect(poco.getAttribute("data-surface")).toBe("marca");
    expect(poco.getAttribute("data-marca")).toBe("vazio");
    expect(container.querySelector(".neu-empty-d")?.hasAttribute("data-surface")).toBe(false);
  });

  it("a ação chama aoAcionar; sem rotuloAcao e sem frase, nada disso aparece", () => {
    const aoAcionar = vi.fn();
    const { container, rerender } = render(<EstadoVazio titulo="Vazio" rotuloAcao="Tentar de novo" aoAcionar={aoAcionar} />);
    fireEvent.click(screen.getByRole("button", { name: /Tentar de novo/ }));
    expect(aoAcionar).toHaveBeenCalledTimes(1);
    rerender(<EstadoVazio variante="tracejado" titulo="Vazio" />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector(".neu-empty-d__text")).toBeNull();
  });
});
