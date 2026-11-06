import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NeumorfismoTeclas, { GrupoTeclas, Tecla, separarTeclas } from "../NeumorfismoTeclas";

describe("NeumorfismoTeclas", () => {
  it("cartão: os dois grupos de referência com nome, o atalho no texto e o botão com ⌘K", () => {
    const { container } = render(
      <TooltipProvider>
        <NeumorfismoTeclas />
      </TooltipProvider>,
    );
    expect(screen.getByLabelText("Command, Shift, Option, Control").querySelectorAll("kbd")).toHaveLength(4);
    expect(screen.getByLabelText("Ctrl mais B").textContent).toBe("Ctrl+B");
    expect(container.querySelectorAll(".neu-kbd-group")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /Buscar/ }).querySelectorAll("kbd")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeTruthy();
  });

  it("separarTeclas: lista como está, + separa, texto curto vira uma tecla por caractere, texto longo sem + fica numa tecla", () => {
    expect(separarTeclas(["Ctrl", "K"])).toEqual(["Ctrl", "K"]);
    expect(separarTeclas("Ctrl+B")).toEqual(["Ctrl", "B"]);
    expect(separarTeclas("⌘K")).toEqual(["⌘", "K"]);
    expect(separarTeclas("Esc")).toEqual(["E", "s", "c"]);
    expect(separarTeclas("Enter")).toEqual(["Enter"]);
    expect(separarTeclas("Shift+Alt+P")).toEqual(["Shift", "Alt", "P"]);
  });

  it("tecla: kbd convexo, e a versão grande leva a classe própria", () => {
    const { container, rerender } = render(<Tecla>K</Tecla>);
    expect(container.firstElementChild?.tagName).toBe("KBD");
    expect(container.firstElementChild?.className).toBe("neu-kbd");
    rerender(<Tecla grande>K</Tecla>);
    expect(container.firstElementChild?.className).toBe("neu-kbd neu-kbd--lg");
  });

  it("grupo: teclas viram kbd, o rótulo vira aria-label e filhos livres valem quando não há teclas", () => {
    const { container, rerender } = render(<GrupoTeclas teclas="Ctrl+B" rotulo="Ctrl mais B" />);
    const g = screen.getByLabelText("Ctrl mais B");
    expect(g.className).toBe("neu-kbd-group");
    expect([...g.querySelectorAll("kbd")].map((k) => k.textContent)).toEqual(["Ctrl", "B"]);
    rerender(
      <GrupoTeclas className="extra">
        <Tecla>A</Tecla>
        <span>+</span>
        <Tecla>B</Tecla>
      </GrupoTeclas>,
    );
    expect(container.firstElementChild?.className).toBe("neu-kbd-group extra");
    expect(container.firstElementChild?.getAttribute("aria-label")).toBeNull();
    expect(container.textContent).toBe("A+B");
  });
});
