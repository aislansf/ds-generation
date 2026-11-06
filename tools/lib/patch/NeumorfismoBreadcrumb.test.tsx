import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoBreadcrumb, { Trilha } from "../NeumorfismoBreadcrumb";

describe("NeumorfismoBreadcrumb", () => {
  it("cartão Breadcrumb: duas trilhas em nav com nome, lista e chevrons decorativos", () => {
    const { container } = render(<NeumorfismoBreadcrumb />);
    const navs = screen.getAllByRole("navigation", { name: "Breadcrumb" });
    expect(navs).toHaveLength(2);
    expect(container.querySelectorAll("ol")).toHaveLength(2);
    expect(container.querySelector(".neu-crumbs--text")).toBeTruthy();
    for (const sep of container.querySelectorAll(".neu-crumbs__sep")) expect(sep.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll(".neu-crumbs__sep")).toHaveLength(5);
  });

  it("a página atual leva aria-current=\"page\" e não é link, nas duas variantes", () => {
    render(<NeumorfismoBreadcrumb />);
    const atuais = document.querySelectorAll('[aria-current="page"]');
    expect(atuais).toHaveLength(2);
    for (const a of atuais) expect(a.tagName).toBe("SPAN");
    expect(screen.getByText("Visão Geral 2026").closest("a")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  it("o ícone de casa vale nas pílulas por padrão e no texto só com iconeInicio", () => {
    const { container } = render(
      <>
        <Trilha itens={[{ rotulo: "Início" }, { rotulo: "Atual" }]} />
        <Trilha variante="texto" itens={[{ rotulo: "Início" }, { rotulo: "Atual" }]} />
        <Trilha variante="texto" iconeInicio itens={[{ rotulo: "Início" }, { rotulo: "Atual" }]} />
        <Trilha iconeInicio={false} itens={[{ rotulo: "Início" }, { rotulo: "Atual" }]} />
      </>,
    );
    const casas = [...container.querySelectorAll("nav")].map((n) => n.querySelectorAll("li:first-child a svg").length);
    expect(casas).toEqual([1, 0, 1, 0]);
  });

  it("tom=marca pinta os links do texto; link sem href não navega e chama aoClicar", () => {
    const aoClicar = vi.fn();
    const { container } = render(<Trilha variante="texto" tom="marca" itens={[{ rotulo: "Início", aoClicar }, { rotulo: "Atual" }]} />);
    expect(container.querySelector(".neu-crumb-t--accent")).toBeTruthy();
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    container.querySelector("a")!.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(aoClicar).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("link", { name: "Início" }));
    expect(aoClicar).toHaveBeenCalledTimes(2);
  });

  it("um link com href mantém a navegação", () => {
    render(<Trilha itens={[{ rotulo: "Início", href: "/" }, { rotulo: "Atual" }]} />);
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByRole("link", { name: "Início" }).dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    expect(screen.getByRole("link", { name: "Início" }).getAttribute("href")).toBe("/");
  });
});
