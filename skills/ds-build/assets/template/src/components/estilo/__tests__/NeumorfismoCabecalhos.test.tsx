import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoCabecalhos, { Cabecalho } from "../NeumorfismoCabecalhos";

describe("NeumorfismoCabecalhos", () => {
  it("cartão Header: as cinco variantes, cada uma num <header>", () => {
    const { container } = render(<NeumorfismoCabecalhos />);
    const cabecalhos = container.querySelectorAll("header");
    expect(cabecalhos).toHaveLength(5);
    expect([...cabecalhos].map((h) => h.className)).toEqual(["neu-header-b", "neu-header-c", "neu-header-k neu-header-k--bar", "neu-header-k", "neu-header"]);
  });

  it("as teclas só de ícone são botões com nome acessível", () => {
    render(<NeumorfismoCabecalhos />);
    expect(screen.getAllByRole("button", { name: "Abrir menu" })).toHaveLength(4);
    expect(screen.getAllByRole("button", { name: "Notificações (há novas)" })).toHaveLength(2);
  });

  it("banner: título, edição e o LED de status em role=status; status nulo o esconde", () => {
    const { rerender } = render(<Cabecalho variante="banner" sobretitulo="Programa" titulo="Painel" edicao="Edição 2026" contexto="Contexto" />);
    expect(screen.getByRole("heading", { name: "Painel" })).toBeTruthy();
    expect(screen.getByText("Edição 2026")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Sincronizado");
    rerender(<Cabecalho variante="banner" sobretitulo="Programa" titulo="Painel" contexto="Contexto" status={null} />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByText("Edição 2026")).toBeNull();
  });

  it("classificado: a faixa é uma nota com o nível por extenso; a barra não tem faixa", () => {
    const { container, rerender } = render(<Cabecalho variante="classificado" classificacao="Conteúdo interno / todos" marca="M" nomeApp="Portal" notaClassificacao="Uso oficial" />);
    const nota = screen.getByRole("note");
    expect(nota.getAttribute("aria-label")).toBe("Classificação da informação: Conteúdo interno / todos");
    expect(screen.getByText("Conteúdo interno / todos").className).toContain("neu-header-k__tag");
    expect(screen.getByText("Uso oficial")).toBeTruthy();
    rerender(<Cabecalho variante="barra" marca="M" nomeApp="Portal" unidade="Unidade X" />);
    expect(container.querySelector(".neu-header-k__strip")).toBeNull();
    expect(screen.getByText("Unidade X")).toBeTruthy();
  });

  it("compacto: logo por letra ou por elemento, sufixo da marca, código e sigla da unidade", () => {
    const { container, rerender } = render(<Cabecalho variante="compacto" inicialLogo="M" marca="MARCA" sufixoMarca="/UF" codigoApp="SGED" nomeApp="Sistema" siglaOrg="UF" rotuloSigla="Unidade" />);
    expect(container.querySelector(".neu-header-c__tile")?.textContent).toBe("M");
    expect(container.querySelector(".neu-header-c__name span")?.textContent).toBe("/UF");
    expect(container.querySelector(".neu-header-c__code")?.textContent).toBe("SGED");
    expect(container.querySelector(".neu-header-c__org")?.getAttribute("title")).toBe("Unidade");
    expect(screen.getByRole("button", { name: "Notificações" })).toBeTruthy();
    rerender(<Cabecalho variante="compacto" logo={<img alt="Logo" src="x.png" />} marca="MARCA" nomeApp="Sistema" />);
    expect(screen.getByAltText("Logo")).toBeTruthy();
    expect(container.querySelector(".neu-header-c__tile")).toBeNull();
  });

  it("completo: busca com rótulo e Ctrl+K, usuário e pílula de classificação", () => {
    render(
      <Cabecalho marca={<span>Sua marca</span>} nomeApp="SGED" descricaoApp="Sistema" classificacao="Conteúdo interno" usuario={{ iniciais: "RC", nome: "Rodrigo", cargo: "Coordenador" }} />,
    );
    expect(screen.getByRole("textbox", { name: "Buscar" }).getAttribute("placeholder")).toContain("Buscar no sistema");
    expect(screen.getByText("Ctrl+K").tagName).toBe("KBD");
    expect(screen.getByText("Conteúdo interno")).toBeTruthy();
    expect(screen.getByText("Rodrigo")).toBeTruthy();
    expect(screen.getByText("RC").getAttribute("aria-hidden")).toBe("true");
  });

  it("a tecla de menu chama aoMenu", () => {
    const aoMenu = vi.fn();
    render(<Cabecalho variante="barra" marca="M" nomeApp="Portal" aoMenu={aoMenu} rotuloMenu="Abrir a gaveta" />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir a gaveta" }));
    expect(aoMenu).toHaveBeenCalledTimes(1);
  });
});
