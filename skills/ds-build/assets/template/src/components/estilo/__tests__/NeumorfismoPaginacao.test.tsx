import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoPaginacao, { ContadorPagina, Paginacao } from "../NeumorfismoPaginacao";

const nomes = (nav: HTMLElement) => [...nav.children].map((c) => c.getAttribute("aria-label") ?? c.textContent);

describe("NeumorfismoPaginacao", () => {
  it("dois cartões: a paginação numérica e o contador, cada um num nav com nome", () => {
    render(<NeumorfismoPaginacao />);
    expect(screen.getByRole("navigation", { name: "Paginação" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Paginação de contador" })).toBeTruthy();
    expect(screen.getByText("1 de 10")).toBeTruthy();
  });

  it("faixas longas colapsam em 1 … n-1 n n+1 … total", () => {
    const { container, rerender } = render(<Paginacao total={12} pagina={1} />);
    const nav = container.querySelector("nav") as HTMLElement;
    expect(nomes(nav)).toEqual(["Página anterior", "Página 1", "Página 2", "…", "Página 12", "Próxima página"]);
    rerender(<Paginacao total={12} pagina={6} />);
    expect(nomes(nav)).toEqual(["Página anterior", "Página 1", "…", "Página 5", "Página 6", "Página 7", "…", "Página 12", "Próxima página"]);
    rerender(<Paginacao total={12} pagina={12} />);
    expect(nomes(nav)).toEqual(["Página anterior", "Página 1", "…", "Página 11", "Página 12", "Próxima página"]);
    rerender(<Paginacao total={3} pagina={2} />);
    expect(nomes(nav)).toEqual(["Página anterior", "Página 1", "Página 2", "Página 3", "Próxima página"]);
  });

  it("a atual leva aria-current=\"page\" e as setas das pontas ficam desativadas", () => {
    const { container, rerender } = render(<Paginacao total={5} pagina={1} />);
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("1");
    expect((screen.getByRole("button", { name: "Página anterior" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Próxima página" }) as HTMLButtonElement).disabled).toBe(false);
    rerender(<Paginacao total={5} pagina={5} />);
    expect((screen.getByRole("button", { name: "Próxima página" }) as HTMLButtonElement).disabled).toBe(true);
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });

  it("não controlado: o clique avança, volta e salta; controlado: aoMudar recebe a página", () => {
    const { container } = render(<Paginacao total={12} />);
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("2");
    fireEvent.click(screen.getByRole("button", { name: "Página 12" }));
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("12");
    fireEvent.click(screen.getByRole("button", { name: "Página anterior" }));
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("11");
    const aoMudar = vi.fn();
    render(<Paginacao total={4} pagina={2} aoMudar={aoMudar} rotulo="Controlada" />);
    fireEvent.click(screen.getByRole("navigation", { name: "Controlada" }).querySelector('[aria-label="Página 4"]') as HTMLElement);
    expect(aoMudar).toHaveBeenCalledWith(4);
    expect(screen.getByRole("navigation", { name: "Controlada" }).querySelector('[aria-current="page"]')?.textContent).toBe("2");
  });

  it("o contador anuncia a posição e acompanha as teclas", () => {
    render(<ContadorPagina total={3} />);
    const rotulo = screen.getByText("1 de 3");
    expect(rotulo.getAttribute("aria-live")).toBe("polite");
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(screen.getByText("2 de 3")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    expect((screen.getByRole("button", { name: "Próxima página" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Página anterior" }));
    expect(screen.getByText("2 de 3")).toBeTruthy();
  });
});
