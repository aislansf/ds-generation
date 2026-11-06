import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoNavegacaoSite, { MenuNavegacao } from "../NeumorfismoNavegacaoSite";

const gatilho = (nome: string) => screen.getByRole("button", { name: nome });

describe("NeumorfismoNavegacaoSite", () => {
  afterEach(() => vi.useRealTimers());

  it("cartão NavigationMenu: nav com nome, três gatilhos com painel e um link comum", () => {
    const { container } = render(<NeumorfismoNavegacaoSite />);
    expect(screen.getByRole("navigation", { name: "Documentação" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /Primeiros passos|Componentes|Com ícone/ })).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Docs" })).toBeTruthy();
    expect(gatilho("Primeiros passos").getAttribute("aria-expanded")).toBe("false");
    expect(gatilho("Primeiros passos").hasAttribute("aria-controls")).toBe(false);
    expect(container.querySelectorAll(".neu-navmenu__item--hide")).toHaveLength(1);
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
  });

  it("o clique alterna o painel e liga aria-controls ao painel", () => {
    const { container } = render(<NeumorfismoNavegacaoSite />);
    const g = gatilho("Primeiros passos");
    fireEvent.click(g);
    const painel = container.querySelector(".neu-navmenu__panel") as HTMLElement;
    expect(g.getAttribute("aria-expanded")).toBe("true");
    expect(g.getAttribute("aria-controls")).toBe(painel.id);
    expect(painel.style.width).toBe("520px");
    expect(painel.querySelector(".neu-navmenu__feature strong")?.textContent).toBe("Neumorphic UI");
    expect(painel.querySelectorAll(".neu-navmenu__link")).toHaveLength(3);
    fireEvent.click(g);
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
  });

  it("grade de duas colunas e lista com ícones sem descrição", () => {
    const { container } = render(<NeumorfismoNavegacaoSite />);
    fireEvent.click(gatilho("Componentes"));
    const links = container.querySelector(".neu-navmenu__links") as HTMLElement;
    expect(links.style.gridTemplateColumns).toContain("repeat(2");
    expect(links.querySelectorAll("li")).toHaveLength(6);
    fireEvent.click(gatilho("Com ícone"));
    expect(container.querySelectorAll(".neu-navmenu__panel")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-navmenu__link--icon")).toHaveLength(3);
    expect(container.querySelector(".neu-navmenu__feature")).toBeNull();
  });

  it("o mouse abre depois de 120ms e a troca entre gatilhos é imediata", () => {
    vi.useFakeTimers();
    const { container } = render(<NeumorfismoNavegacaoSite />);
    fireEvent.mouseEnter(gatilho("Componentes"));
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
    act(() => { vi.advanceTimersByTime(120); });
    expect(gatilho("Componentes").getAttribute("aria-expanded")).toBe("true");
    fireEvent.mouseEnter(gatilho("Com ícone"));
    act(() => { vi.advanceTimersByTime(0); });
    expect(gatilho("Com ícone").getAttribute("aria-expanded")).toBe("true");
    expect(gatilho("Componentes").getAttribute("aria-expanded")).toBe("false");
    fireEvent.mouseLeave(screen.getByRole("navigation"));
    act(() => { vi.advanceTimersByTime(250); });
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
  });

  it("↓ entra no painel, ↑ volta ao gatilho no primeiro link, Esc fecha e devolve o foco", () => {
    vi.useFakeTimers();
    const { container } = render(<NeumorfismoNavegacaoSite />);
    const g = gatilho("Primeiros passos");
    g.focus();
    fireEvent.keyDown(g, { key: "ArrowDown" });
    act(() => { vi.advanceTimersByTime(1); });
    const links = [...container.querySelectorAll<HTMLElement>(".neu-navmenu__panel a")].filter((a) => a.classList.contains("neu-navmenu__link"));
    const todos = [...container.querySelectorAll<HTMLElement>(".neu-navmenu__panel a")];
    expect(document.activeElement).toBe(todos[0]);
    fireEvent.keyDown(todos[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(todos[1]);
    fireEvent.keyDown(todos[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(todos[0]);
    fireEvent.keyDown(todos[0], { key: "ArrowUp" });
    expect(document.activeElement).toBe(g);
    fireEvent.keyDown(g, { key: "ArrowDown" });
    expect(links.length).toBe(3);
    fireEvent.keyDown(document.activeElement ?? g, { key: "Escape" });
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
    expect(document.activeElement).toBe(g);
  });

  it("→ e ← passam o foco entre os gatilhos e fecham o painel aberto", () => {
    const { container } = render(<NeumorfismoNavegacaoSite />);
    const g = gatilho("Primeiros passos");
    fireEvent.click(g);
    fireEvent.keyDown(g, { key: "ArrowRight" });
    expect(document.activeElement).toBe(gatilho("Componentes"));
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
    fireEvent.keyDown(gatilho("Componentes"), { key: "ArrowLeft" });
    expect(document.activeElement).toBe(g);
    fireEvent.keyDown(g, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Docs" }));
  });

  it("escolher um link ou clicar fora fecha o painel; a página atual leva aria-current", () => {
    const { container } = render(
      <MenuNavegacao
        itens={[
          { rotulo: "Início", href: "/", atual: true },
          { rotulo: "Serviços", links: [{ titulo: "Consultoria", descricao: "Atendimento" }] },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Início" }).getAttribute("aria-current")).toBe("page");
    expect(container.querySelector(".neu-navmenu__trigger--current")).toBeTruthy();
    fireEvent.click(gatilho("Serviços"));
    fireEvent.click(screen.getByRole("link", { name: /Consultoria/ }));
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
    fireEvent.click(gatilho("Serviços"));
    expect(container.querySelector(".neu-navmenu__panel")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(container.querySelector(".neu-navmenu__panel")).toBeNull();
  });
});
