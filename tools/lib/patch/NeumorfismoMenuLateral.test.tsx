import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import NeumorfismoMenuLateral, { MenuLateral, monograma } from "../NeumorfismoMenuLateral";

const GRUPOS = [
  { titulo: "1. Primitivos UI", itens: [{ id: "toast", rotulo: "Toast", selo: "Novo" }, { id: "tabs", rotulo: "Tabs" }] },
  { titulo: "2. Tokens & Cores", itens: [{ id: "paleta", rotulo: "Paleta e Sombras Duplas", destaque: true }, { id: "icone", rotulo: "Ícone", icone: <svg data-testid="ic" /> }] },
];

describe("NeumorfismoMenuLateral", () => {
  it("cartão Sidebar: duas barras, uma expandida e uma recolhida, cada uma num aside com nome", () => {
    const { container } = render(<NeumorfismoMenuLateral />);
    const asides = container.querySelectorAll("aside.neu-sidebar");
    expect(asides).toHaveLength(2);
    expect([...asides].map((a) => a.getAttribute("data-collapsed"))).toEqual(["false", "true"]);
    expect(screen.getAllByRole("complementary", { name: "Menu lateral" })).toHaveLength(2);
    expect(screen.getAllByRole("navigation", { name: "Navegação" })).toHaveLength(2);
  });

  it("expandida: títulos de grupo, pontos nos itens, chip do selo e o ativo com aria-current", () => {
    const { container } = render(<MenuLateral grupos={GRUPOS} ativoInicial="tabs" />);
    expect([...container.querySelectorAll(".neu-sidebar__group")].map((g) => g.textContent)).toEqual(["1. Primitivos UI", "2. Tokens & Cores"]);
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toBe("Tabs");
    expect(container.querySelector(".neu-badge--chip")?.textContent).toBe("Novo");
    expect(container.querySelector(".neu-dot--accent")).toBeTruthy();
    expect(container.querySelectorAll(".neu-rail__tip")).toHaveLength(0);
  });

  it("clicar escolhe o item, chama aoNavegar e não navega com href vazio", () => {
    const aoNavegar = vi.fn();
    const { container } = render(<MenuLateral grupos={GRUPOS} ativoInicial="tabs" aoNavegar={aoNavegar} />);
    const link = screen.getByRole("link", { name: /Toast/ });
    // fireEvent devolve falso quando o padrão do clique foi impedido (sem navegação)
    expect(fireEvent.click(link)).toBe(false);
    expect(aoNavegar).toHaveBeenCalledWith("toast");
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toContain("Toast");
  });

  it("controlado: o ativo vem de fora", () => {
    const { container, rerender } = render(<MenuLateral grupos={GRUPOS} ativo="toast" />);
    fireEvent.click(screen.getByRole("link", { name: /Tabs/ }));
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toContain("Toast");
    rerender(<MenuLateral grupos={GRUPOS} ativo="tabs" />);
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toBe("Tabs");
  });

  it("recolher: troca o rótulo da tecla, esconde os títulos e dá a cada item aria-label, monograma e dica", () => {
    const { container } = render(<MenuLateral grupos={GRUPOS} ativoInicial="tabs" />);
    const tecla = screen.getByRole("button", { name: "Recolher menu" });
    expect(tecla.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(tecla);
    const aside = container.querySelector("aside") as HTMLElement;
    expect(aside.getAttribute("data-collapsed")).toBe("true");
    const expandir = screen.getByRole("button", { name: "Expandir menu" });
    expect(expandir.getAttribute("aria-expanded")).toBe("false");
    expect(within(expandir).getByText("Expandir menu").className).toBe("neu-rail__tip");
    expect(container.querySelector(".neu-sidebar__group")).toBeNull();
    expect(container.querySelectorAll(".neu-sidebar__rule")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Toast (Novo)" })).toBeTruthy();
    expect(container.querySelector(".neu-nav-item__pip")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-badge--chip")).toBeNull();
    const mono = [...container.querySelectorAll(".neu-nav-item__mono")];
    expect(mono.map((m) => m.textContent)).toEqual(["TO", "TA", "PS"]);
    expect(container.querySelector(".neu-nav-item__mono--hl")?.textContent).toBe("PS");
    expect(container.querySelectorAll("a .neu-rail__tip")).toHaveLength(4);
    expect(screen.getByTestId("ic")).toBeTruthy();
  });

  it("recolhivel falso esconde a tecla; os textos do pé são trocáveis", () => {
    render(<MenuLateral grupos={GRUPOS} recolhivel={false} tituloRodape="MARCA-UF" subtituloRodape="v1" iniciaisRodape="MU" titulo="Sua marca" subtitulo="Gaveta" />);
    expect(screen.queryByRole("button", { name: /menu/ })).toBeNull();
    expect(screen.getByText("MARCA-UF")).toBeTruthy();
    expect(screen.getByText("MU").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("Sua marca")).toBeTruthy();
  });

  it("monograma: duas iniciais das palavras longas, ou as duas primeiras letras", () => {
    expect(monograma("Paleta e Sombras Duplas")).toBe("PS");
    expect(monograma("Toast")).toBe("TO");
    expect(monograma("Elevações & Luz 135°")).toBe("EL");
    expect(monograma("A")).toBe("A");
  });
});
