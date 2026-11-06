import { beforeAll, describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import NeumorfismoMenubar from "../NeumorfismoMenubar";

beforeAll(() => {
  // o Radix posiciona os painéis com ResizeObserver, que o jsdom não tem
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const gatilho = (nome: string) => screen.getByRole("menuitem", { name: nome });
const abrir = (nome: string) => fireEvent.keyDown(gatilho(nome), { key: "ArrowDown" });

describe("NeumorfismoMenubar", () => {
  it("a barra tem quatro gatilhos e entra na ordem do Tab uma vez só (foco rotativo)", () => {
    render(<NeumorfismoMenubar />);
    const barra = screen.getByRole("menubar", { name: "Menu do aplicativo" });
    const gatilhos = within(barra).getAllByRole("menuitem");
    expect(gatilhos.map((g) => g.textContent)).toEqual(["Arquivo", "Editar", "Exibir", "Perfis"]);
    // o grupo rotativo do Radix é o único ponto de Tab; os gatilhos andam por setas
    expect([barra, ...gatilhos].filter((g) => g.tabIndex === 0)).toHaveLength(1);
    expect(barra.tabIndex).toBe(0);
    expect(gatilhos.every((g) => g.getAttribute("aria-haspopup") === "menu")).toBe(true);
    expect(gatilho("Arquivo").getAttribute("aria-expanded")).toBe("false");
  });

  it("↓ abre o menu com o nome do gatilho, e Esc fecha", async () => {
    render(<NeumorfismoMenubar />);
    abrir("Arquivo");
    const menu = await screen.findByRole("menu", { name: "Arquivo" });
    expect(gatilho("Arquivo").getAttribute("aria-expanded")).toBe("true");
    expect(within(menu).getByRole("menuitem", { name: /Nova aba/ })).toBeTruthy();
    expect(within(menu).getByText("⌘T").tagName).toBe("KBD");
    expect(within(menu).getByRole("menuitem", { name: "Nova janela anônima" }).getAttribute("aria-disabled")).toBe("true");
    fireEvent.keyDown(menu, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("Exibir: itens marcáveis, alternam sem fechar o menu; os recuados alinham com eles", async () => {
    const { container } = render(<NeumorfismoMenubar />);
    abrir("Exibir");
    const menu = await screen.findByRole("menu", { name: "Exibir" });
    expect((menu as HTMLElement).style.width).toBe("230px");
    const favoritos = within(menu).getByRole("menuitemcheckbox", { name: "Barra de favoritos" });
    const urls = within(menu).getByRole("menuitemcheckbox", { name: "URLs completas" });
    expect(favoritos.getAttribute("aria-checked")).toBe("false");
    expect(urls.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(favoritos);
    expect(screen.getByText(/Favoritos: sim/)).toBeTruthy();
    expect(screen.getByRole("menu", { name: "Exibir" })).toBeTruthy();
    expect(within(screen.getByRole("menu")).getByRole("menuitemcheckbox", { name: "Barra de favoritos" }).getAttribute("aria-checked")).toBe("true");
    expect(document.querySelectorAll(".neu-menu-item--recuado")).toHaveLength(4);
    expect(container).toBeTruthy();
  });

  it("um item de ação fecha o menu e registra a última ação", async () => {
    render(<NeumorfismoMenubar />);
    abrir("Editar");
    const menu = await screen.findByRole("menu", { name: "Editar" });
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Copiar" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(screen.getByText(/Última ação: Copiar/)).toBeTruthy();
  });

  it("Perfis: escolha única em grupo, com a bolinha acesa no marcado", async () => {
    render(<NeumorfismoMenubar />);
    abrir("Perfis");
    const menu = await screen.findByRole("menu", { name: "Perfis" });
    const radios = within(menu).getAllByRole("menuitemradio");
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["false", "true", "false"]);
    expect(radios[1].querySelector(".neu-menu-item__bolinha > span")).toBeTruthy();
    expect(radios[0].querySelector(".neu-menu-item__bolinha > span")).toBeNull();
    fireEvent.click(radios[0]);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(screen.getByText(/Perfil: Ana/)).toBeTruthy();
  });

  it("→ no item com seta abre o submenu", async () => {
    render(<NeumorfismoMenubar />);
    abrir("Arquivo");
    const menu = await screen.findByRole("menu", { name: "Arquivo" });
    const compartilhar = within(menu).getByRole("menuitem", { name: "Compartilhar" });
    expect(compartilhar.getAttribute("aria-haspopup")).toBe("menu");
    fireEvent.keyDown(compartilhar, { key: "ArrowRight" });
    const sub = await screen.findByRole("menuitem", { name: "Link por e-mail" });
    expect(sub.closest(".neu-menu-painel--sub")).toBeTruthy();
  });
});
