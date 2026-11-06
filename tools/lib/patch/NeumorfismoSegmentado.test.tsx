import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoSegmentado from "../NeumorfismoSegmentado";

describe("NeumorfismoSegmentado", () => {
  it("dois grupos com nome, a opção escolhida marcada e a variante em caixa-alta", () => {
    const { container } = render(<NeumorfismoSegmentado />);
    expect(screen.getByRole("radiogroup", { name: "Perfil" })).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Período" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Client" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Account" }).getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("radio", { name: "7 Dias" }).getAttribute("aria-checked")).toBe("true");
    expect(container.querySelectorAll(".neu-segmented--caps")).toHaveLength(1);
  });

  it("só a opção escolhida entra na ordem de Tab", () => {
    render(<NeumorfismoSegmentado />);
    expect(screen.getByRole("radio", { name: "7 Dias" }).getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("radio", { name: "Hoje" }).getAttribute("tabindex")).toBe("-1");
  });

  it("clique, setas, Home e End mudam a escolha", () => {
    render(<NeumorfismoSegmentado />);
    fireEvent.click(screen.getByRole("radio", { name: "Hoje" }));
    expect(screen.getByRole("radio", { name: "Hoje" }).getAttribute("aria-checked")).toBe("true");
    const grupo = screen.getByRole("radiogroup", { name: "Período" });
    fireEvent.keyDown(grupo, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "7 Dias" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(grupo, { key: "End" });
    expect(screen.getByRole("radio", { name: "30 Dias" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(grupo, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "Hoje" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(grupo, { key: "Home" });
    expect(screen.getByRole("radio", { name: "Hoje" }).getAttribute("aria-checked")).toBe("true");
  });
});
