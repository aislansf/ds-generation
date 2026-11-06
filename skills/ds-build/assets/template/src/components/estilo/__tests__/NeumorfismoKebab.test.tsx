import { beforeAll, describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import NeumorfismoKebab, { IconeKebab, TeclaKebab, TeclaKebabDiscreta } from "../NeumorfismoKebab";

beforeAll(() => {
  // o Radix posiciona os painéis com ResizeObserver, que o jsdom não tem
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const abrir = (tecla: HTMLElement) => fireEvent.keyDown(tecla, { key: "ArrowDown" });

describe("NeumorfismoKebab", () => {
  it("cartão Menu Kebab: duas teclas com nome acessível, aria-haspopup e os três pontos sólidos", () => {
    const { container } = render(<NeumorfismoKebab />);
    const convexa = screen.getByRole("button", { name: "Ações do módulo" });
    const discreta = screen.getByRole("button", { name: "Ações" });
    for (const t of [convexa, discreta]) {
      expect(t.getAttribute("aria-haspopup")).toBe("menu");
      expect(t.getAttribute("aria-expanded")).toBe("false");
      expect(t.querySelectorAll("circle")).toHaveLength(3);
    }
    expect(discreta.className).toContain("neu-kebab-ghost");
    expect(container.querySelectorAll(".neu-kebab-demo")).toHaveLength(2);
  });

  it("a tecla convexa abre o menu padrão de 176px, e escolher um item o fecha", async () => {
    render(<NeumorfismoKebab />);
    abrir(screen.getByRole("button", { name: "Ações do módulo" }));
    const menu = await screen.findByRole("menu", { name: "Ações do módulo" });
    expect(menu.className).toContain("neu-menu-painel--padrao");
    expect((menu as HTMLElement).style.width).toBe("176px");
    expect(within(menu).getAllByRole("menuitem").map((i) => i.textContent)).toEqual(["Editar", "Compartilhar", "Excluir"]);
    expect(within(menu).getByRole("menuitem", { name: "Excluir" }).className).toContain("neu-menu-item--perigo");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Editar" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("a tecla discreta abre o menu da lista, justo, com divisor antes do destrutivo; Esc fecha", async () => {
    render(<NeumorfismoKebab />);
    const tecla = screen.getByRole("button", { name: "Ações" });
    abrir(tecla);
    const menu = await screen.findByRole("menu", { name: "Ações do relatório" });
    expect(menu.className).toContain("neu-menu-painel--lista");
    expect(menu.className).toContain("neu-menu-painel--justo");
    expect(within(menu).getAllByRole("menuitem").map((i) => i.textContent)).toEqual(["Visualizar", "Editar", "Excluir"]);
    expect(menu.querySelectorAll('[role="separator"]')).toHaveLength(1);
    await waitFor(() => expect(tecla.getAttribute("aria-expanded")).toBe("true"));
    fireEvent.keyDown(menu, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("o nome da tecla é \"Mais opções\" por padrão e pode ser trocado", () => {
    render(
      <>
        <TeclaKebab />
        <TeclaKebabDiscreta aria-label="Ações da linha" />
        <IconeKebab size={16} />
      </>,
    );
    expect(screen.getByRole("button", { name: "Mais opções" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ações da linha" })).toBeTruthy();
  });
});
