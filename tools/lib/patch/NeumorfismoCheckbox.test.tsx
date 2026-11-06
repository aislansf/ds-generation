import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoCheckbox from "../NeumorfismoCheckbox";

describe("NeumorfismoCheckbox", () => {
  it("quatro opções com o gancho de checkbox e descrição ligada", () => {
    const { container } = render(<NeumorfismoCheckbox />);
    expect(container.querySelectorAll('[data-ds="checkbox"]')).toHaveLength(4);
    const caixa = screen.getByRole("checkbox", { name: /Checkbox Selecionado/ });
    expect(caixa.getAttribute("aria-describedby")).toBeTruthy();
    expect(container.querySelector(".neu-check--secundaria")).not.toBeNull();
  });

  it("estados: dois marcados, um desmarcado e um desabilitado", () => {
    render(<NeumorfismoCheckbox />);
    expect(screen.getByRole("checkbox", { name: /Selecionado/ }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("checkbox", { name: /Royal/ }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("checkbox", { name: /Desmarcado/ }).getAttribute("aria-checked")).toBe("false");
    expect((screen.getByRole("checkbox", { name: /Desabilitado/ }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("clicar no rótulo marca e desmarca; o desabilitado não muda", () => {
    render(<NeumorfismoCheckbox />);
    const desmarcado = screen.getByRole("checkbox", { name: /Desmarcado/ });
    fireEvent.click(screen.getByText("Checkbox Desmarcado"));
    expect(desmarcado.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByText("Checkbox Desmarcado"));
    expect(desmarcado.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(screen.getByText("Checkbox Desabilitado"));
    expect(screen.getByRole("checkbox", { name: /Desabilitado/ }).getAttribute("aria-checked")).toBe("false");
  });
});
