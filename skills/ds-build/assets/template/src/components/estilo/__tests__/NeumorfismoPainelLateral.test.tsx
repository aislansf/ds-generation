import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoPainelLateral, { PainelLateral, type ItemPainel } from "../NeumorfismoPainelLateral";

const ITENS: ItemPainel[] = [
  { id: "inicio", rotulo: "Início / Dashboard", palavrasChave: "painel" },
  { id: "programas", rotulo: "Programas", selo: 4 },
  { id: "bi", rotulo: "Analytics & BI" },
];

describe("NeumorfismoPainelLateral", () => {
  it("cartão: o trilho começa em 260px, recolhe para 68px e o selo da área de trabalho acompanha", () => {
    const { container } = render(<NeumorfismoPainelLateral />);
    const aside = container.querySelector("aside.neu-rail") as HTMLElement;
    expect(aside.style.width).toBe("260px");
    expect(screen.getByText("Menu: 260 px")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Recolher menu lateral" }));
    expect(aside.style.width).toBe("68px");
    expect(aside.getAttribute("data-collapsed")).toBe("true");
    expect(screen.getByText("Menu: 68 px")).toBeTruthy();
  });

  it("expandido: marca com sufixo, subtítulo, estado em status, contador em chip e o ativo com ponto", () => {
    const { container } = render(<PainelLateral itens={ITENS} ativoInicial="inicio" titulo="MARCA" sufixoTitulo="/UF" subtitulo="Painel fixo" />);
    expect(container.querySelector(".neu-rail__title")?.textContent).toBe("MARCA/UF");
    expect(container.querySelector(".neu-rail__suffix")?.textContent).toBe("/UF");
    expect(container.querySelector(".neu-rail__subtitle")?.textContent).toBe("Painel fixo");
    expect(screen.getByRole("status").textContent).toBe("Expandido");
    expect(container.querySelector(".neu-rail__led")).toBeTruthy();
    expect(container.querySelector(".neu-rail__count")?.textContent).toBe("4");
    expect(container.querySelectorAll(".neu-rail__tip")).toHaveLength(0);
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toContain("Início / Dashboard");
  });

  it("recolhido: rótulos viram aria-label (com contador), pontos e dicas; a tecla diz Expandir", () => {
    const { container } = render(<PainelLateral itens={ITENS} ativoInicial="inicio" recolhidoInicial />);
    expect(screen.getByRole("link", { name: "Programas (4)" })).toBeTruthy();
    expect(container.querySelector(".neu-rail__pip")?.getAttribute("aria-hidden")).toBe("true");
    const tecla = screen.getByRole("button", { name: "Expandir menu lateral" });
    expect(tecla.getAttribute("aria-expanded")).toBe("false");
    expect(tecla.querySelector(".neu-rail__tip")?.textContent).toBe("Expandir menu");
    expect(container.querySelectorAll("a .neu-rail__tip")).toHaveLength(3);
    expect(screen.getByRole("status").textContent).toBe("Recolhido");
  });

  it("a busca filtra por rótulo e palavra-chave, ignorando acento", () => {
    render(<PainelLateral itens={ITENS} />);
    const campo = screen.getByRole("searchbox");
    fireEvent.change(campo, { target: { value: "PAINEL" } });
    expect(screen.getAllByRole("link")).toHaveLength(1);
    fireEvent.change(campo, { target: { value: "xyz" } });
    expect(screen.getByText("Nenhum item encontrado.")).toBeTruthy();
  });

  it("a tecla de busca do trilho recolhido expande o menu e leva o foco ao campo", () => {
    const aoAlterar = vi.fn();
    render(<PainelLateral itens={ITENS} recolhidoInicial aoAlterarRecolhido={aoAlterar} />);
    fireEvent.click(screen.getByRole("button", { name: "Buscar no menu (expande o menu)" }));
    expect(aoAlterar).toHaveBeenCalledWith(false);
    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("controlado: o recolhido vem de fora e a tecla só avisa", () => {
    const aoAlterar = vi.fn();
    const { container, rerender } = render(<PainelLateral itens={ITENS} recolhido={false} aoAlterarRecolhido={aoAlterar} />);
    fireEvent.click(screen.getByRole("button", { name: "Recolher menu lateral" }));
    expect(aoAlterar).toHaveBeenCalledWith(true);
    expect(container.querySelector("aside")?.getAttribute("data-collapsed")).toBe("false");
    rerender(<PainelLateral itens={ITENS} recolhido aoAlterarRecolhido={aoAlterar} larguraRecolhida={72} />);
    expect((container.querySelector("aside") as HTMLElement).style.width).toBe("72px");
  });

  it("clicar escolhe o item, chama aoNavegar e não navega com href vazio; mostrarEstado falso some com o estado", () => {
    const aoNavegar = vi.fn();
    const { container } = render(<PainelLateral itens={ITENS} aoNavegar={aoNavegar} mostrarEstado={false} />);
    expect(fireEvent.click(screen.getByRole("link", { name: /Analytics/ }))).toBe(false);
    expect(aoNavegar).toHaveBeenCalledWith("bi");
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toContain("Analytics");
    expect(container.querySelector(".neu-rail__state")).toBeNull();
  });
});
