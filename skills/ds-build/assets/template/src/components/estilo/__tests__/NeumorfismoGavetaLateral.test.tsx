import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import NeumorfismoGavetaLateral, { GavetaLateral, type ItemGaveta } from "../NeumorfismoGavetaLateral";

const ITENS: ItemGaveta[] = [
  { id: "inicio", rotulo: "Início", palavrasChave: "home painel", selo: "Novo" },
  { id: "programas", rotulo: "Programas", filhos: [{ id: "inovacao", rotulo: "Inovação" }, { id: "tecnologia", rotulo: "Tecnologia" }] },
  { id: "usuarios", rotulo: "Usuários" },
];

describe("NeumorfismoGavetaLateral", () => {
  it("cartão: mostra a gaveta embutida (aside, sem diálogo) e a gaveta real só ao clicar no botão", () => {
    const { container } = render(<NeumorfismoGavetaLateral />);
    expect(container.querySelectorAll("aside.neu-drawer--inline")).toHaveLength(1);
    expect(screen.queryByRole("dialog")).toBeNull();
    const abrir = screen.getByRole("button", { name: /Abrir gaveta/ });
    fireEvent.click(abrir);
    const dialogo = screen.getByRole("dialog");
    expect(dialogo.getAttribute("aria-modal")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(within(dialogo).getByRole("button", { name: "Fechar menu" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(document.activeElement).toBe(abrir);
  });

  it("embutida: marca, título nomeando o aside, pé e sem tecla de fechar", () => {
    const { container } = render(<GavetaLateral embutida itens={ITENS} titulo="Sua marca" subtitulo="Gaveta" iniciaisRodape="UF" tituloRodape="MARCA-UF" metaRodape="2026.03" />);
    const aside = container.querySelector("aside") as HTMLElement;
    expect(aside.getAttribute("role")).toBeNull();
    expect(aside.getAttribute("aria-labelledby")).toBe(container.querySelector("h3")?.id);
    expect(container.querySelector(".neu-drawer__subtitle")?.textContent).toBe("Gaveta");
    expect(container.querySelector(".neu-drawer__initials")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-drawer__meta")?.textContent).toBe("2026.03");
    expect(container.querySelector(".neu-drawer__close")).toBeNull();
    render(<GavetaLateral embutida aoFechar={() => {}} itens={ITENS} />);
    expect(screen.getByRole("button", { name: "Fechar menu" })).toBeTruthy();
  });

  it("grupo: botão com aria-expanded e aria-controls, abre e fecha a lista de subitens", () => {
    render(<GavetaLateral embutida itens={ITENS} ativoInicial="inovacao" />);
    const grupo = screen.getByRole("button", { name: "Programas" });
    expect(grupo.getAttribute("aria-expanded")).toBe("true");
    expect(grupo.className).toContain("neu-drawer__item--parent");
    expect(document.getElementById(grupo.getAttribute("aria-controls") as string)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Inovação" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(grupo);
    expect(grupo.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Inovação" })).toBeNull();
  });

  it("ativo ganha o ponto aceso e perde o selo; os outros mantêm o chip", () => {
    const { container, rerender } = render(<GavetaLateral embutida itens={ITENS} ativo="inicio" />);
    expect(container.querySelector(".neu-drawer__led")).toBeTruthy();
    expect(container.querySelector(".neu-badge--chip")).toBeNull();
    rerender(<GavetaLateral embutida itens={ITENS} ativo="usuarios" />);
    expect(container.querySelector(".neu-badge--chip")?.textContent).toBe("Novo");
  });

  it("busca: ignora acento e caixa, olha palavras-chave, abre grupos que casam e avisa quando não há resultado", () => {
    const { container } = render(<GavetaLateral embutida itens={ITENS} />);
    const campo = screen.getByRole("searchbox");
    fireEvent.change(campo, { target: { value: "INOVACAO" } });
    expect(screen.queryByRole("link", { name: /Início/ })).toBeNull();
    expect(screen.getByRole("link", { name: "Inovação" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Tecnologia" })).toBeNull();
    fireEvent.change(campo, { target: { value: "painel" } });
    expect(screen.getByRole("link", { name: /Início/ })).toBeTruthy();
    fireEvent.change(campo, { target: { value: "zzz" } });
    expect(container.querySelector(".neu-drawer__empty")?.getAttribute("role")).toBe("status");
    expect(screen.getByText("Nenhum item encontrado.")).toBeTruthy();
  });

  it("clicar escolhe, chama aoNavegar, fecha a gaveta e não navega com href vazio", () => {
    const aoNavegar = vi.fn();
    const aoFechar = vi.fn();
    render(<GavetaLateral aberta aoFechar={aoFechar} itens={ITENS} aoNavegar={aoNavegar} />);
    expect(fireEvent.click(screen.getByRole("link", { name: /Usuários/ }))).toBe(false);
    expect(aoNavegar).toHaveBeenCalledWith("usuarios");
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });

  it("fecharAoNavegar falso mantém aberta; clicar no véu fecha, dentro do painel não", () => {
    const aoFechar = vi.fn();
    const { rerender } = render(<GavetaLateral aberta aoFechar={aoFechar} itens={ITENS} fecharAoNavegar={false} />);
    fireEvent.click(screen.getByRole("link", { name: /Usuários/ }));
    expect(aoFechar).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("dialog"));
    expect(aoFechar).not.toHaveBeenCalled();
    fireEvent.click(document.querySelector(".neu-drawer-layer") as HTMLElement);
    expect(aoFechar).toHaveBeenCalledTimes(1);
    rerender(<GavetaLateral aberta={false} itens={ITENS} />);
    expect(document.querySelector(".neu-drawer-layer")).toBeNull();
  });

  it("Tab fica preso dentro da gaveta", () => {
    render(<GavetaLateral aberta aoFechar={() => {}} itens={[{ id: "a", rotulo: "A" }]} buscavel={false} />);
    const fechar = screen.getByRole("button", { name: "Fechar menu" });
    const link = screen.getByRole("link", { name: "A" });
    link.focus();
    expect(fireEvent.keyDown(document, { key: "Tab" })).toBe(false);
    expect(document.activeElement).toBe(fechar);
    expect(fireEvent.keyDown(document, { key: "Tab", shiftKey: true })).toBe(false);
    expect(document.activeElement).toBe(link);
  });
});
