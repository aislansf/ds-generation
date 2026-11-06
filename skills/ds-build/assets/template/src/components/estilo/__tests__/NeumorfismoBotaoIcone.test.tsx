import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoBotaoIcone from "../NeumorfismoBotaoIcone";

describe("NeumorfismoBotaoIcone", () => {
  it("monta as sete teclas do exemplo, todas com gancho de botão e nome acessível", () => {
    const { container } = render(<NeumorfismoBotaoIcone />);
    const botoes = Array.from(container.querySelectorAll('.neu-row [data-ds="button"]'));
    expect(botoes).toHaveLength(7);
    for (const b of botoes) {
      expect(b.getAttribute("aria-label")).toBeTruthy();
      expect(b.getAttribute("title")).toBe(b.getAttribute("aria-label"));
      expect(b.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("variantes: redondo, pequeno e contorno; só o último é desabilitado", () => {
    const { container } = render(<NeumorfismoBotaoIcone />);
    expect(container.querySelector(".neu-ib--redondo")).not.toBeNull();
    expect(container.querySelector(".neu-ib--pequeno")).not.toBeNull();
    expect(container.querySelector(".neu-ib--contorno")).not.toBeNull();
    expect((screen.getByRole("button", { name: "Parâmetros" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Excluir" }) as HTMLButtonElement).disabled).toBe(false);
  });
});
