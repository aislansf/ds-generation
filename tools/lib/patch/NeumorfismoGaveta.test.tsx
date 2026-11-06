import { afterEach, beforeAll, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import NeumorfismoGaveta from "../NeumorfismoGaveta";
import { Folha } from "../NeumorfismoFolha";

// O jsdom não traz PointerEvent com coordenadas: este faz as vezes dele nos testes de arrasto
beforeAll(() => {
  class PointerEventSimulado extends MouseEvent {
    pointerId: number;
    constructor(tipo: string, init: PointerEventInit = {}) {
      super(tipo, init);
      this.pointerId = init.pointerId ?? 1;
    }
  }
  (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventSimulado;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  vi.useRealTimers();
  Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
});

const camada = () => document.querySelector(".neu-sheet-layer");
const painel = () => camada()!.querySelector(".neu-sheet") as HTMLElement;
const abrir = () => fireEvent.click(screen.getByRole("button", { name: /Abrir drawer/ }));
const passar = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });
const larguraDaJanela = (w: number) => {
  Object.defineProperty(window, "innerWidth", { value: w, configurable: true });
  act(() => { window.dispatchEvent(new Event("resize")); });
};

describe("NeumorfismoGaveta", () => {
  it("o gatilho e a gaveta estática de baixo do pacote, com a alça e sem o ✕", () => {
    vi.useFakeTimers();
    const { container } = render(<NeumorfismoGaveta />);
    const gatilho = screen.getByRole("button", { name: /Abrir drawer/ });
    expect(gatilho.getAttribute("aria-haspopup")).toBe("dialog");
    const estatica = container.querySelector(".neu-sheet-stage--bottom .neu-sheet") as HTMLElement;
    expect(estatica.className).toContain("neu-sheet--drawer");
    expect(estatica.className).toContain("neu-sheet--bottom");
    expect(estatica.querySelector(".neu-sheet__handle")).toBeTruthy();
    expect(estatica.querySelector("button[aria-label='Fechar']")).toBeNull();
    expect(camada()).toBeNull();
  });

  it("as cinco opções em cartão; escolher uma afunda o cartão e a confirmação mostra o toast com o horário", () => {
    vi.useFakeTimers();
    const { container } = render(<NeumorfismoGaveta />);
    abrir();
    passar(10);
    expect(camada()!.querySelectorAll("[role=radio]")).toHaveLength(5);
    expect(camada()!.querySelectorAll(".neu-radio-card--on")).toHaveLength(1);
    fireEvent.click(camada()!.querySelectorAll("[role=radio]")[2]);
    expect(camada()!.querySelector(".neu-radio-card--on")?.textContent).toContain("17:30 – 17:45");
    fireEvent.click(Array.from(camada()!.querySelectorAll("button")).find((b) => b.textContent === "Confirmar horário") as HTMLElement);
    passar(250);
    expect(camada()).toBeNull();
    expect(container.querySelector(".neu-toast-host")?.textContent).toContain("Horário confirmado: 17:30 – 17:45");
  });

  it("no desktop vem da direita, solto, com ✕ e sem alça; abaixo de 640px vem de baixo, com alça e sem ✕", () => {
    vi.useFakeTimers();
    render(<NeumorfismoGaveta />);
    abrir();
    passar(10);
    expect(painel().className).toContain("neu-sheet--right");
    expect(painel().className).toContain("neu-sheet--drawer");
    expect(painel().querySelector(".neu-sheet__handle")).toBeNull();
    expect(painel().querySelector("button[aria-label='Fechar']")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    passar(250);

    larguraDaJanela(500);
    abrir();
    passar(10);
    expect(painel().className).toContain("neu-sheet--bottom");
    expect(painel().querySelector(".neu-sheet__handle")).toBeTruthy();
    expect(painel().querySelector("button[aria-label='Fechar']")).toBeNull();
  });

  it("arrastar a alça para baixo além do limiar fecha; menos que isso volta", () => {
    vi.useFakeTimers();
    larguraDaJanela(500);
    render(<NeumorfismoGaveta />);
    abrir();
    passar(10);
    const alca = painel().querySelector(".neu-sheet__handle") as HTMLElement;
    Object.defineProperty(painel(), "offsetHeight", { value: 300, configurable: true });

    fireEvent.pointerDown(alca, { clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(painel(), { clientY: 130, pointerId: 1 });
    expect(painel().style.transform).toBe("translateY(30px)");
    fireEvent.pointerUp(painel(), { pointerId: 1 });
    expect(camada()).not.toBeNull();
    expect(painel().style.transform).toBe("");

    fireEvent.pointerDown(alca, { clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(painel(), { clientY: 200, pointerId: 1 });
    fireEvent.pointerUp(painel(), { pointerId: 1 });
    passar(250);
    expect(camada()).toBeNull();
  });

  it("o véu esmaece durante o arrasto; arrastar para cima tem resistência", () => {
    vi.useFakeTimers();
    larguraDaJanela(500);
    render(<NeumorfismoGaveta />);
    abrir();
    passar(10);
    const alca = painel().querySelector(".neu-sheet__handle") as HTMLElement;
    fireEvent.pointerDown(alca, { clientY: 200, button: 0, pointerId: 1 });
    fireEvent.pointerMove(painel(), { clientY: 280, pointerId: 1 });
    const opacidade = Number((camada()!.querySelector(".neu-backdrop__veil") as HTMLElement).style.opacity);
    expect(opacidade).toBeCloseTo(0.8, 1);
    fireEvent.pointerMove(painel(), { clientY: 120, pointerId: 1 });
    expect(painel().style.transform).toBe("translateY(-20px)");
  });

  it("controles do corpo não iniciam o arrasto; arrastar={false} tira a alça e o arrasto", () => {
    vi.useFakeTimers();
    larguraDaJanela(500);
    const { unmount } = render(<NeumorfismoGaveta />);
    abrir();
    passar(10);
    fireEvent.pointerDown(painel().querySelector("[role=radio]") as HTMLElement, { clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(painel(), { clientY: 200, pointerId: 1 });
    expect(painel().style.transform).toBe("");
    unmount();

    render(<Folha gaveta arrastar={false} lado="bottom" aberto aoMudarAberto={() => {}} titulo="Sem arrasto" gatilho={<Button type="button">x</Button>}><p>Corpo</p></Folha>);
    expect(camada()!.querySelector(".neu-sheet__handle")).toBeNull();
    expect(camada()!.querySelector("button[aria-label='Fechar']")).toBeTruthy();
  });
});
