import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoRadio from "../NeumorfismoRadio";

describe("NeumorfismoRadio", () => {
  it("dois grupos nomeados, com o gancho de radio em cada opção", () => {
    const { container } = render(<NeumorfismoRadio />);
    expect(screen.getByRole("radiogroup", { name: "Plano" })).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Prazo de entrega" })).toBeTruthy();
    expect(container.querySelectorAll('[data-ds="radio"]')).toHaveLength(6);
    expect(container.querySelector(".neu-radio-cards")).not.toBeNull();
  });

  it("estados iniciais: uma opção marcada por grupo e as desabilitadas travadas", () => {
    render(<NeumorfismoRadio />);
    expect(screen.getByRole("radio", { name: /Radio Selecionado/ }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: /Radio Disponível/ }).getAttribute("aria-checked")).toBe("false");
    expect((screen.getByRole("radio", { name: /Radio Desabilitado/ }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("radio", { name: /Entrega padrão/ }).getAttribute("aria-checked")).toBe("true");
    expect((screen.getByRole("radio", { name: /Retirada/ }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("clicar no rótulo troca a escolha e o cartão escolhido ganha o estado ligado", () => {
    const { container } = render(<NeumorfismoRadio />);
    fireEvent.click(screen.getByText("Radio Disponível"));
    expect(screen.getByRole("radio", { name: /Radio Disponível/ }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: /Radio Selecionado/ }).getAttribute("aria-checked")).toBe("false");
    expect(container.querySelectorAll(".neu-radio-card--on")).toHaveLength(1);
    fireEvent.click(screen.getByText("Entrega expressa"));
    expect(screen.getByRole("radio", { name: /Entrega expressa/ }).getAttribute("aria-checked")).toBe("true");
    expect(container.querySelector(".neu-radio-card--on")?.textContent).toMatch(/expressa/);
  });
});
