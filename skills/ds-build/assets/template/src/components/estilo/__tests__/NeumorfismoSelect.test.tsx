import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoSelect from "../NeumorfismoSelect";

describe("NeumorfismoSelect", () => {
  it("dois selects com rótulo, gancho de gatilho e valor inicial", () => {
    const { container } = render(<NeumorfismoSelect />);
    expect(container.querySelectorAll('[data-ds="select-trigger"]')).toHaveLength(2);
    expect(container.querySelector(".neu-select--sm")).not.toBeNull();
    const gatilho = screen.getByRole("combobox", { name: /Selecione uma opção/ });
    expect(gatilho.textContent).toBe("Combo1");
    expect(gatilho.getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /Situação/ }).textContent).toBe("Todas");
  });

  it("a dica do menu customizado está ligada ao gatilho", () => {
    render(<NeumorfismoSelect />);
    const gatilho = screen.getByRole("combobox", { name: /Selecione uma opção/ });
    const dica = document.getElementById(gatilho.getAttribute("aria-describedby") ?? "");
    expect(dica?.textContent).toMatch(/substitui o pop-up nativo/);
  });
});
