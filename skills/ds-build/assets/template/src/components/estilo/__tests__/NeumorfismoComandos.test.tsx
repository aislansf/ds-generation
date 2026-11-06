import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoComandos, { Comando, GrupoTeclas, PaletaComandos, type GrupoComando } from "../NeumorfismoComandos";

const campo = () => screen.getAllByRole("combobox")[0];

describe("NeumorfismoComandos", () => {
  it("cartão Command: combobox ligado ao listbox, grupos e o primeiro item ativo", () => {
    const { container } = render(<NeumorfismoComandos />);
    const lista = screen.getByRole("listbox");
    expect(campo().getAttribute("aria-controls")).toBe(lista.id);
    expect(screen.getAllByRole("option")).toHaveLength(6);
    expect(container.querySelectorAll('[role="group"]')).toHaveLength(2);
    expect(screen.getByText("Sugestões", { selector: ".neu-command__heading" })).toBeTruthy();
    const primeiro = screen.getAllByRole("option")[0];
    expect(primeiro.getAttribute("aria-selected")).toBe("true");
    expect(campo().getAttribute("aria-activedescendant")).toBe(primeiro.id);
    expect(container.querySelectorAll(".neu-kbd-group")).toHaveLength(5);
  });

  it("↑ e ↓ pulam o item desativado e dão a volta", () => {
    render(<NeumorfismoComandos />);
    const opcoes = screen.getAllByRole("option");
    fireEvent.keyDown(campo(), { key: "ArrowDown" });
    expect(opcoes[1].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(campo(), { key: "ArrowDown" });
    expect(opcoes[3].getAttribute("aria-selected")).toBe("true");
    expect(opcoes[2].getAttribute("aria-disabled")).toBe("true");
    fireEvent.keyDown(campo(), { key: "ArrowUp" });
    expect(opcoes[1].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(campo(), { key: "Home" });
    fireEvent.keyDown(campo(), { key: "ArrowUp" });
    expect(opcoes[5].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(campo(), { key: "Home" });
    expect(opcoes[0].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(campo(), { key: "End" });
    expect(opcoes[5].getAttribute("aria-selected")).toBe("true");
  });

  it("a busca ignora caixa e acentos e olha as palavras-chave; sem resultado vira status", () => {
    render(<NeumorfismoComandos />);
    fireEvent.change(campo(), { target: { value: "PAG" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getAllByRole("option")[0].textContent).toContain("Faturamento");
    fireEvent.change(campo(), { target: { value: "configuracoes" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getAllByRole("option")[0].textContent).toContain("Configurações");
    fireEvent.change(campo(), { target: { value: "zzz" } });
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toBe("Nenhum resultado encontrado.");
    fireEvent.click(screen.getByRole("button", { name: "Limpar busca" }));
    expect(screen.getAllByRole("option")).toHaveLength(6);
  });

  it("Enter e clique executam o item; o desativado não executa", () => {
    render(<NeumorfismoComandos />);
    fireEvent.keyDown(campo(), { key: "Enter" });
    expect(screen.getByText("Selecionado: Agenda")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("option")[4]);
    expect(screen.getByText("Selecionado: Faturamento")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("option")[2]);
    expect(screen.getByText("Selecionado: Faturamento")).toBeTruthy();
  });

  it("a paleta abre pelo gatilho, foca o campo, fecha com Esc e ao escolher, e Ctrl+K alterna", () => {
    render(<NeumorfismoComandos />);
    const gatilho = screen.getByRole("button", { name: /Abrir paleta/ });
    expect(gatilho.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(gatilho);
    const dialogo = screen.getByRole("dialog", { name: "Paleta de comandos" });
    expect(dialogo.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("fechar", { exact: false })).toBeTruthy();
    expect(document.activeElement).toBe(dialogo.querySelector("input"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeTruthy();
    const dentro = screen.getByRole("dialog").querySelectorAll('[role="option"]');
    fireEvent.click(dentro[1]);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("Selecionado: Buscar emoji")).toBeTruthy();

    fireEvent.keyDown(document, { key: "K", metaKey: true });
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("atalhoGlobal falso desliga o Ctrl+K e o clique no véu fecha a paleta", () => {
    const grupos: GrupoComando[] = [{ itens: [{ rotulo: "Um" }] }];
    const aoMudar = vi.fn();
    const { container } = render(<PaletaComandos grupos={grupos} atalhoGlobal={false} aoMudarAberto={aoMudar} />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(aoMudar).not.toHaveBeenCalled();
    render(<PaletaComandos grupos={grupos} abertoInicial atalhoGlobal={false} aoMudarAberto={aoMudar} />);
    fireEvent.click(document.querySelector(".neu-command-layer") as HTMLElement);
    expect(aoMudar).toHaveBeenCalledWith(false);
    expect(container).toBeTruthy();
  });

  it("GrupoTeclas separa \"⌘P\" em teclas e \"Ctrl+K\" em duas", () => {
    const { container } = render(
      <>
        <GrupoTeclas atalho="⌘P" />
        <GrupoTeclas atalho="Ctrl+K" />
        <Comando grupos={[{ itens: [{ rotulo: "A" }] }]} rodape={false} />
      </>,
    );
    const grupos = container.querySelectorAll(".neu-kbd-group");
    expect([...grupos[0].querySelectorAll("kbd")].map((k) => k.textContent)).toEqual(["⌘", "P"]);
    expect([...grupos[1].querySelectorAll("kbd")].map((k) => k.textContent)).toEqual(["Ctrl", "K"]);
    expect(container.querySelector(".neu-command__foot")).toBeNull();
  });
});
