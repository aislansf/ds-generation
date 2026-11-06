import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoMarcadoresVitrine, { Marcador } from "../NeumorfismoMarcadores";

describe("NeumorfismoMarcadores", () => {
  it("cartão: seis marcadores — dois em role=status, um separador, o evento com hora e o de sucesso", () => {
    const { container } = render(<NeumorfismoMarcadoresVitrine />);
    expect(container.querySelectorAll(".neu-marker")).toHaveLength(6);
    expect(screen.getAllByRole("status").map((x) => x.textContent)).toEqual(["Pensando…", "Carla está digitando…"]);
    expect(screen.getByRole("separator", { name: "Conversa resumida" })).toBeTruthy();
    expect(container.querySelector("time.neu-marker__time")?.textContent).toBe("14:32");
    expect(container.querySelector(".neu-marker--success")).toBeTruthy();
    expect(container.querySelectorAll(".neu-shimmer")).toHaveLength(2);
  });

  it("evento: ícone num pontinho escondido dos leitores, texto, hora e tom", () => {
    const { container } = render(
      <Marcador icone={<svg data-testid="ic" />} tom="sucesso" hora="09:16">
        <strong>Marina</strong> adicionou um arquivo
      </Marcador>,
    );
    expect(container.firstElementChild?.className).toBe("neu-marker neu-marker--success");
    expect(screen.getByTestId("ic").closest(".neu-marker__icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("time.neu-marker__time")?.textContent).toBe("09:16");
    expect(container.querySelector("strong")?.textContent).toBe("Marina");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("status e carregando viram role=status educado; o carregador substitui o ícone", () => {
    const { container, rerender } = render(<Marcador status brilho>Digitando…</Marcador>);
    const s = screen.getByRole("status");
    expect(s.getAttribute("aria-live")).toBe("polite");
    expect(container.querySelector(".neu-marker__content")?.className).toBe("neu-marker__content neu-shimmer");
    expect(container.querySelector(".neu-marker__icon")).toBeNull();
    rerender(<Marcador carregando icone={<svg data-testid="ic" />}>Enviando…</Marcador>);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.queryByTestId("ic")).toBeNull();
    expect(container.querySelector(".neu-marker__icon svg")?.getAttribute("class")).toContain("animate-spin");
  });

  it("separador: role=separator com o texto como nome e a variante na classe", () => {
    render(<Marcador variante="separador">Hoje</Marcador>);
    const sep = screen.getByRole("separator", { name: "Hoje" });
    expect(sep.className).toBe("neu-marker neu-marker--separator");
  });

  it("tom da marca vira a classe accent", () => {
    const { container } = render(<Marcador tom="marca">Nota</Marcador>);
    expect(container.firstElementChild?.className).toContain("neu-marker--accent");
  });
});
