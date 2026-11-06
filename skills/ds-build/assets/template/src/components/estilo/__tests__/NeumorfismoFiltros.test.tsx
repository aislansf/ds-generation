import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoFiltros, { BarraFiltros } from "../NeumorfismoFiltros";

const STATUS = { rotulo: "Status", opcoes: [{ value: "todos", label: "Todos" }, { value: "Ativo", label: "Ativo" }] };

const abrirEEscolher = (nome: RegExp, opcao: string) => {
  fireEvent.keyDown(screen.getByRole("combobox", { name: nome }), { key: "ArrowDown" });
  fireEvent.click(screen.getByRole("option", { name: opcao }));
};

describe("NeumorfismoFiltros", () => {
  it("cartão: o título do DS e os três exemplos da referência", () => {
    const { container } = render(<NeumorfismoFiltros />);
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Filtros Dinâmicos");
    expect(container.querySelectorAll(".neu-filters-i")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-filters-i--framed")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-filters")).toHaveLength(1);
    expect(container.querySelectorAll('[role="search"]')).toHaveLength(2);
  });

  it("linha: sem filtros não há fileira de pílulas; a busca tem rótulo e o select usa o gatilho do estilo", () => {
    const { container } = render(<BarraFiltros variante="linha" selects={[STATUS]} />);
    expect(container.querySelector(".neu-filters-i__chips")).toBeNull();
    expect(screen.getByRole("search", { name: "Filtros de listagem" })).toBeTruthy();
    expect(screen.getByLabelText("Buscar")).toBeTruthy();
    expect(container.querySelector('[data-ds="select-trigger"]')).not.toBeNull();
    expect(container.querySelector(".neu-select--sm")).not.toBeNull();
    expect(screen.getByRole("combobox", { name: /Status/ }).textContent).toBe("Todos");
  });

  it("linha: Enter na busca acrescenta \"Busca: …\"; vazio a remove; o ✕ zera o campo", () => {
    const aoMudar = vi.fn();
    const { container } = render(<BarraFiltros variante="linha" selects={[STATUS]} aoMudar={aoMudar} />);
    const campo = screen.getByLabelText("Buscar") as HTMLInputElement;
    fireEvent.change(campo, { target: { value: "  inovação " } });
    fireEvent.keyDown(campo, { key: "Enter" });
    expect(container.querySelector(".neu-filter-chip")?.textContent).toContain("Busca: inovação");
    expect(container.querySelector(".neu-filters-i__count")?.textContent).toBe("1 filtro ativo:");
    expect(aoMudar).toHaveBeenLastCalledWith({ busca: "  inovação ", selects: { Status: "todos" }, filtros: ["Busca: inovação"] });
    fireEvent.click(screen.getByRole("button", { name: "Remover filtro Busca: inovação" }));
    expect(campo.value).toBe("");
    expect(container.querySelector(".neu-filters-i__chips")).toBeNull();
    fireEvent.change(campo, { target: { value: "x" } });
    fireEvent.keyDown(campo, { key: "Enter" });
    fireEvent.change(campo, { target: { value: "   " } });
    fireEvent.keyDown(campo, { key: "Enter" });
    expect(container.querySelector(".neu-filters-i__chips")).toBeNull();
  });

  it("linha: escolher no select cria e troca a pílula; \"Todos\" a remove; o ✕ devolve o select a \"Todos\"", () => {
    const { container } = render(<BarraFiltros variante="linha" selects={[STATUS]} />);
    abrirEEscolher(/Status/, "Ativo");
    expect(container.querySelector(".neu-filter-chip")?.textContent).toContain("Status: Ativo");
    expect(screen.getByRole("combobox", { name: /Status/ }).textContent).toBe("Ativo");
    abrirEEscolher(/Status/, "Todos");
    expect(container.querySelector(".neu-filters-i__chips")).toBeNull();
    abrirEEscolher(/Status/, "Ativo");
    fireEvent.click(screen.getByRole("button", { name: "Remover filtro Status: Ativo" }));
    expect(screen.getByRole("combobox", { name: /Status/ }).textContent).toBe("Todos");
    expect(container.querySelector(".neu-filters-i__chips")).toBeNull();
  });

  it("linha: filtros iniciais, contagem no plural, aria-live e Limpar todos", () => {
    const aoMudar = vi.fn();
    const { container } = render(
      <BarraFiltros
        variante="linha"
        moldura
        selects={[STATUS]}
        aoMudar={aoMudar}
        filtrosIniciais={[{ id: "busca", rotulo: "Busca: a" }, { id: "sel-Status", select: "Status", valor: "Ativo", rotulo: "Status: Ativo" }]}
      />,
    );
    expect(container.querySelector(".neu-filters-i")?.className).toContain("neu-card--flat");
    expect(container.querySelector(".neu-filters-i__chips")?.getAttribute("aria-live")).toBe("polite");
    expect(container.querySelector(".neu-filters-i__count")?.textContent).toBe("2 filtros ativos:");
    expect(screen.getByRole("combobox", { name: /Status/ }).textContent).toBe("Ativo");
    fireEvent.click(screen.getByRole("button", { name: "Limpar todos" }));
    expect(container.querySelector(".neu-filters-i__chips")).toBeNull();
    expect(screen.getByRole("combobox", { name: /Status/ }).textContent).toBe("Todos");
    expect(aoMudar).toHaveBeenLastCalledWith({ busca: "", selects: { Status: "todos" }, filtros: [] });
  });

  it("linha: Mais filtros chama o callback e some com maisFiltros={false}; rótulo do landmark", () => {
    const abrir = vi.fn();
    const { rerender } = render(<BarraFiltros variante="linha" rotulo="Filtrar atendimentos" aoAbrirMaisFiltros={abrir} />);
    expect(screen.getByRole("search", { name: "Filtrar atendimentos" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Mais filtros/ }));
    expect(abrir).toHaveBeenCalledTimes(1);
    rerender(<BarraFiltros variante="linha" maisFiltros={false} />);
    expect(screen.queryByRole("button", { name: /Mais filtros/ })).toBeNull();
  });

  it("painel: os filtros ativos em etiquetas removíveis e o link Limpar todos; opções em texto valem como valor", () => {
    const { container } = render(
      <BarraFiltros selects={[{ rotulo: "Município", opcoes: ["Fortaleza (Capital)", "Sobral"] }]} filtros={["Município: Fortaleza", "Status: Em Execução"]} />,
    );
    expect(container.querySelector(".neu-filters")?.className).toContain("neu-card--flat");
    expect(container.querySelector(".neu-filters__caption")?.textContent).toBe("Filtros ativos:");
    expect(container.querySelectorAll(".neu-filters__chips .neu-badge")).toHaveLength(2);
    expect(screen.getByRole("combobox", { name: /Município/ }).textContent).toBe("Fortaleza (Capital)");
    fireEvent.click(screen.getByRole("button", { name: "Remover Município: Fortaleza" }));
    expect(container.querySelectorAll(".neu-filters__chips .neu-badge")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Limpar todos" }));
    expect(container.querySelector(".neu-filters__chips")).toBeNull();
  });
});
