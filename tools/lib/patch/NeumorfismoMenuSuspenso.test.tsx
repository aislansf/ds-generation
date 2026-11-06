import { beforeAll, describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import NeumorfismoMenuSuspenso, { GatilhoAcoes, MenuSuspenso, type ItemSuspenso } from "../NeumorfismoMenuSuspenso";

beforeAll(() => {
  // o Radix posiciona os painéis com ResizeObserver, que o jsdom não tem
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const abrir = (gatilho: HTMLElement) => fireEvent.keyDown(gatilho, { key: "ArrowDown" });

describe("NeumorfismoMenuSuspenso", () => {
  it("cartão Dropdown Menu: três gatilhos com aria-haspopup, o de ícone com nome acessível", () => {
    render(<NeumorfismoMenuSuspenso />);
    const gatilhos = screen.getAllByRole("button", { name: /Ações|Menu de ações/ });
    expect(gatilhos).toHaveLength(3);
    expect(gatilhos.every((g) => g.getAttribute("aria-haspopup") === "menu")).toBe(true);
    expect(gatilhos.every((g) => g.getAttribute("aria-expanded") === "false")).toBe(true);
    expect(screen.getByRole("button", { name: "Menu de ações" }).querySelector("svg")).toBeTruthy();
  });

  it("↓ abre o menu padrão com os itens; o destrutivo vem por último, depois de um divisor", async () => {
    render(<NeumorfismoMenuSuspenso />);
    abrir(screen.getAllByRole("button", { name: "Ações" })[0]);
    const menu = await screen.findByRole("menu", { name: "Ações" });
    expect(menu.className).toContain("neu-menu-painel--padrao");
    const itens = within(menu).getAllByRole("menuitem");
    expect(itens.map((i) => i.textContent)).toEqual(["Editar", "Duplicar", "Exportar", "Excluir"]);
    expect(itens[3].className).toContain("neu-menu-item--perigo");
    expect(menu.querySelectorAll('[role="separator"]')).toHaveLength(1);
    expect(itens[3].previousElementSibling?.getAttribute("role")).toBe("separator");
  });

  it("escolher um item fecha o menu e registra a ação; Esc também fecha", async () => {
    render(<NeumorfismoMenuSuspenso />);
    const gatilho = screen.getAllByRole("button", { name: "Ações" })[0];
    abrir(gatilho);
    const menu = await screen.findByRole("menu");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Duplicar" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(screen.getByText("Ação selecionada: Duplicar")).toBeTruthy();
    abrir(gatilho);
    const outro = await screen.findByRole("menu");
    fireEvent.keyDown(outro, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("a disposição lista é mais estreita e o gatilho de ícone abre o mesmo menu", async () => {
    render(<NeumorfismoMenuSuspenso />);
    abrir(screen.getByRole("button", { name: "Menu de ações" }));
    const menu = await screen.findByRole("menu", { name: "Menu de ações do item" });
    expect(menu.className).toContain("neu-menu-painel--lista");
    expect(within(menu).getAllByRole("menuitem")).toHaveLength(5);
  });

  it("recursos extras: cabeçalho, atalho, submenu, caixa que não fecha e escolha única em grupo", async () => {
    let marcado = false;
    let tema = "claro";
    const montar = () => {
      const itens: ItemSuspenso[] = [
        { cabecalho: "Exibição" },
        { rotulo: "Barra lateral", caixa: true, marcado, manterAberto: true, aoSelecionar: () => { marcado = !marcado; } },
        { rotulo: "Recarregar", atalho: "⌘R" },
        { rotulo: "Compartilhar", itens: [{ rotulo: "Link por e-mail" }] },
        { divisor: true },
        { rotulo: "Claro", marcado: tema === "claro", aoSelecionar: () => { tema = "claro"; } },
        { rotulo: "Escuro", marcado: tema === "escuro", aoSelecionar: () => { tema = "escuro"; } },
      ];
      return <MenuSuspenso gatilho={<GatilhoAcoes>Opções</GatilhoAcoes>} rotulo="Opções" variante="lista" itens={itens} />;
    };
    const { rerender } = render(montar());
    abrir(screen.getByRole("button", { name: "Opções" }));
    const menu = await screen.findByRole("menu", { name: "Opções" });
    expect(within(menu).getByText("Exibição").className).toContain("neu-menu-cabecalho");
    expect(within(menu).getByText("⌘R").tagName).toBe("KBD");
    const caixa = within(menu).getByRole("menuitemcheckbox", { name: "Barra lateral" });
    expect(caixa.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(caixa);
    rerender(montar());
    expect(screen.getByRole("menu", { name: "Opções" })).toBeTruthy();
    expect(within(screen.getByRole("menu")).getByRole("menuitemcheckbox", { name: "Barra lateral" }).getAttribute("aria-checked")).toBe("true");
    const radios = within(screen.getByRole("menu")).getAllByRole("menuitemradio");
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["true", "false"]);
    expect(radios[0].querySelector(".neu-menu-item__bolinha > span")).toBeTruthy();
    const sub = within(screen.getByRole("menu")).getByRole("menuitem", { name: "Compartilhar" });
    fireEvent.keyDown(sub, { key: "ArrowRight" });
    expect(await screen.findByRole("menuitem", { name: "Link por e-mail" })).toBeTruthy();
  });
});
