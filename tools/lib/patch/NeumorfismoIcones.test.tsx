import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoIcones, { Icone, NOMES_ICONES } from "../NeumorfismoIcones";

describe("NeumorfismoIcones", () => {
  it("mostra os 96 ícones do pacote, cada um com nome acessível em texto", () => {
    const { container } = render(<NeumorfismoIcones />);
    expect(NOMES_ICONES).toHaveLength(96);
    expect(container.querySelectorAll(".neu-icones > li")).toHaveLength(96);
    expect(container.querySelectorAll(".neu-icones > li svg")).toHaveLength(96);
    expect(screen.getByText("graduation-cap")).toBeTruthy();
  });

  it("Icone: decorativo fica oculto; com label vira imagem; spin liga o giro", () => {
    const { container } = render(
      <>
        <Icone name="check" />
        <Icone name="loader-2" spin label="Carregando" />
      </>,
    );
    const [decorativo, carregando] = Array.from(container.querySelectorAll("svg"));
    expect(decorativo.getAttribute("aria-hidden")).toBe("true");
    expect(decorativo.querySelector("path")).not.toBeNull();
    expect(carregando.getAttribute("role")).toBe("img");
    expect(carregando.getAttribute("aria-label")).toBe("Carregando");
    expect(carregando.classList.contains("neu-spin")).toBe(true);
  });

  it("Icone: nome desconhecido não quebra e fica vazio", () => {
    const { container } = render(<Icone name="nao-existe" size={14} />);
    expect(container.querySelector("svg")?.innerHTML).toBe("");
    expect(container.querySelector("svg")?.getAttribute("width")).toBe("14");
  });
});
