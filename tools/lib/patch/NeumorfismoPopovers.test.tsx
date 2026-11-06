import { afterEach, beforeAll, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import NeumorfismoPopovers, { PainelFlutuante } from "../NeumorfismoPopovers";
import { Button } from "@/components/ui/button";

beforeAll(() => {
  // O Radix posiciona o painel com ResizeObserver, que o jsdom não traz
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  vi.useRealTimers();
});

const painel = () => document.querySelector(".neu-popover__panel") as HTMLElement | null;

describe("NeumorfismoPopovers", () => {
  it("dois gatilhos e nenhum painel aberto; o texto de valores mostra os padrões", () => {
    render(<NeumorfismoPopovers />);
    const g1 = screen.getByRole("button", { name: "Abrir popover" });
    const g2 = screen.getByRole("button", { name: "Compartilhar" });
    for (const g of [g1, g2]) {
      expect(g.getAttribute("aria-haspopup")).toBe("dialog");
      expect(g.getAttribute("aria-expanded")).toBe("false");
    }
    expect(painel()).toBeNull();
    expect(screen.getByText("Valores: 100% · 300px · 25px · none")).toBeTruthy();
  });

  it("abrir mostra o painel com nome, 320px, o gatilho ligado por aria-controls e o foco no primeiro campo", () => {
    render(<NeumorfismoPopovers />);
    const g = screen.getByRole("button", { name: "Abrir popover" });
    fireEvent.click(g);
    const p = painel()!;
    expect(p.getAttribute("role")).toBe("dialog");
    expect(p.getAttribute("aria-label")).toBe("Dimensões");
    expect(p.style.width).toBe("320px");
    expect(g.getAttribute("aria-expanded")).toBe("true");
    expect(g.getAttribute("aria-controls")).toBe(p.id);
    expect((document.activeElement as HTMLInputElement).value).toBe("100%");
    expect(p.querySelectorAll(".neu-form-row")).toHaveLength(4);
    expect(p.querySelector(".neu-popover__title")?.textContent).toBe("Dimensões");
  });

  it("editar um campo atualiza o texto de valores", () => {
    render(<NeumorfismoPopovers />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir popover" }));
    fireEvent.change(screen.getByLabelText("Largura"), { target: { value: "50%" } });
    expect(screen.getByText("Valores: 50% · 300px · 25px · none")).toBeTruthy();
  });

  it("Esc fecha e o foco volta ao gatilho; clicar fora também fecha; não trava a rolagem", async () => {
    render(<NeumorfismoPopovers />);
    const g = screen.getByRole("button", { name: "Abrir popover" });
    g.focus();
    fireEvent.click(g);
    expect(document.body.style.overflow).not.toBe("hidden");
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Escape" });
    expect(painel()).toBeNull();
    // o Radix devolve o foco ao gatilho num tique seguinte
    await waitFor(() => expect(document.activeElement).toBe(g));

    fireEvent.click(g);
    expect(painel()).not.toBeNull();
    // o Radix só passa a ouvir o clique fora um tique depois de abrir
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(painel()).toBeNull());
  });

  it("o segundo painel é o de compartilhar: 280px, campo somente leitura e Copiar link avisa", async () => {
    vi.useFakeTimers();
    const escrever = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText: escrever }, configurable: true });
    render(<NeumorfismoPopovers />);
    fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
    const p = painel()!;
    expect(p.style.width).toBe("280px");
    const campo = screen.getByLabelText("Link do relatório") as HTMLInputElement;
    expect(campo.readOnly).toBe(true);
    expect(campo.value).toBe("sua-marca.app/r/8f2k");
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /Copiar link/ })); });
    expect(escrever).toHaveBeenCalledWith("sua-marca.app/r/8f2k");
    expect(screen.getByRole("button", { name: /Link copiado!/ })).toBeTruthy();
    act(() => { vi.advanceTimersByTime(2100); });
    expect(screen.getByRole("button", { name: /Copiar link/ })).toBeTruthy();
  });

  it("alinhamento, lado e foco automático configuráveis", () => {
    render(
      <PainelFlutuante gatilho={<Button type="button">Abrir</Button>} rotulo="Livre" lado="top" alinhamento="end" focoAutomatico={false}>
        <input aria-label="campo" />
      </PainelFlutuante>,
    );
    const g = screen.getByRole("button", { name: "Abrir" });
    g.focus();
    fireEvent.click(g);
    const p = painel()!;
    expect(p.getAttribute("data-side")).toBe("top");
    expect(p.getAttribute("data-align")).toBe("end");
    expect(document.activeElement).not.toBe(screen.getByLabelText("campo"));
  });
});
