import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import NeumorfismoFolha, { Folha } from "../NeumorfismoFolha";

afterEach(() => {
  vi.useRealTimers();
});

const camada = () => document.querySelector(".neu-sheet-layer");
const abrir = (nome: string) => fireEvent.click(screen.getByRole("button", { name: nome }));
const esperarSaida = () => act(() => { vi.advanceTimersByTime(250); });

describe("NeumorfismoFolha", () => {
  it("quatro gatilhos (um por lado) e o palco estático, sem folha real aberta", () => {
    vi.useFakeTimers();
    const { container } = render(<NeumorfismoFolha />);
    for (const n of ["Abrir", "Esquerda", "Topo", "Base"]) {
      const g = screen.getByRole("button", { name: n });
      expect(g.getAttribute("aria-haspopup")).toBe("dialog");
      expect(g.getAttribute("aria-expanded")).toBe("false");
    }
    expect(container.querySelectorAll(".neu-sheet-stage--right")).toHaveLength(1);
    expect(container.querySelector(".neu-sheet--inline")?.getAttribute("style")).toContain("width: 320px");
    expect(camada()).toBeNull();
    expect(screen.getByText(/descartam as alterações/)).toBeTruthy();
  });

  it("cada gatilho abre a folha do seu lado, com o foco no primeiro campo e a rolagem travada", () => {
    vi.useFakeTimers();
    render(<NeumorfismoFolha />);
    for (const [nome, lado] of [["Abrir", "right"], ["Esquerda", "left"], ["Topo", "top"], ["Base", "bottom"]] as const) {
      abrir(nome);
      act(() => { vi.advanceTimersByTime(10); });
      const real = camada()!.querySelector(".neu-sheet") as HTMLElement;
      expect(real.className).toContain(`neu-sheet--${lado}`);
      expect(real.getAttribute("aria-modal")).toBe("true");
      expect((document.activeElement as HTMLInputElement).value).toBe("Ana Ribeiro");
      expect(document.body.style.overflow).toBe("hidden");
      fireEvent.keyDown(document, { key: "Escape" });
      esperarSaida();
      expect(camada()).toBeNull();
    }
  });

  it("fecha com a saída deslizante: primeiro a classe de saída, depois some, e o foco volta ao gatilho", () => {
    vi.useFakeTimers();
    render(<NeumorfismoFolha />);
    const gatilho = screen.getByRole("button", { name: "Abrir" });
    gatilho.focus();
    fireEvent.click(gatilho);
    act(() => { vi.advanceTimersByTime(10); });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(camada()!.className).toContain("neu-sheet-layer--closing");
    expect(camada()!.querySelector(".neu-sheet")!.className).toContain("neu-sheet--closing");
    esperarSaida();
    expect(camada()).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir" }));
  });

  it("o ✕, Fechar e o clique fora fecham; o clique dentro não", () => {
    vi.useFakeTimers();
    render(<NeumorfismoFolha />);
    abrir("Abrir");
    fireEvent.click(camada()!.querySelector(".neu-sheet__body") as HTMLElement);
    esperarSaida();
    expect(camada()).not.toBeNull();
    fireEvent.click(camada()!.querySelector("button[aria-label='Fechar']") as HTMLElement);
    esperarSaida();
    expect(camada()).toBeNull();

    abrir("Abrir");
    fireEvent.click(Array.from(camada()!.querySelectorAll("button")).find((b) => b.textContent === "Fechar") as HTMLElement);
    esperarSaida();
    expect(camada()).toBeNull();

    abrir("Abrir");
    fireEvent.click(camada() as HTMLElement);
    esperarSaida();
    expect(camada()).toBeNull();
  });

  it("salvar manda os dados do formulário, fecha e mostra o resultado", () => {
    vi.useFakeTimers();
    render(<NeumorfismoFolha />);
    abrir("Abrir");
    const campo = camada()!.querySelector("input[name='nome']") as HTMLInputElement;
    fireEvent.change(campo, { target: { value: "Bia Souza" } });
    fireEvent.submit(camada()!.querySelector("form") as HTMLElement);
    esperarSaida();
    expect(camada()).toBeNull();
    expect(screen.getByText("Salvo: Bia Souza · @anaribeiro")).toBeTruthy();
  });

  it("Tab e Shift+Tab ficam presos na folha", () => {
    vi.useFakeTimers();
    render(<NeumorfismoFolha />);
    abrir("Abrir");
    const focaveis = Array.from(camada()!.querySelectorAll<HTMLElement>("input, button"));
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    ultimo.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(primeiro);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(ultimo);
  });

  it("aoEnviar devolvendo false mantém aberta; tamanho vira largura ou altura conforme o lado", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Folha lado="left" aberto aoMudarAberto={() => {}} tamanho={300} titulo="Validar" aoEnviar={() => false}><input name="x" /></Folha>,
    );
    fireEvent.submit(camada()!.querySelector("form") as HTMLElement);
    esperarSaida();
    expect(camada()).not.toBeNull();
    expect(camada()!.querySelector(".neu-sheet")?.getAttribute("style")).toContain("width: 300px");
    rerender(<Folha lado="top" aberto aoMudarAberto={() => {}} tamanho={250} titulo="Validar"><p>x</p></Folha>);
    expect(camada()!.querySelector(".neu-sheet")?.getAttribute("style")).toContain("height: 250px");
  });

  it("sem envio não há rodapé padrão; mostrarFechar={false} tira o ✕; o gatilho próprio abre", () => {
    vi.useFakeTimers();
    const { container } = render(<Folha gatilho={<Button type="button">Abrir livre</Button>} titulo="Livre" mostrarFechar={false}><p>Corpo</p></Folha>);
    fireEvent.click(screen.getByRole("button", { name: "Abrir livre" }));
    expect(container.querySelector(".neu-sheet__footer")).toBeNull();
    expect(container.querySelector(".neu-dialog__close")).toBeNull();
    expect(container.querySelector(".neu-sheet")?.tagName).toBe("DIV");
  });
});
