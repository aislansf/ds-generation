import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import NeumorfismoDialogoAlerta, { DialogoAlerta } from "../NeumorfismoDialogoAlerta";

afterEach(() => {
  vi.useRealTimers();
});

const aberto = () => document.querySelector(".neu-adialog-layer");

describe("NeumorfismoDialogoAlerta", () => {
  it("três gatilhos e as três prévias do pacote (padrão, destrutivo e compacto)", () => {
    const { container } = render(<NeumorfismoDialogoAlerta />);
    expect(screen.getByRole("button", { name: "Mostrar diálogo" })).toBeTruthy();
    // "Excluir projeto" e "Sair" também são a ação das prévias; os gatilhos são os que anunciam o diálogo
    const gatilhos = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-haspopup") === "dialog");
    expect(gatilhos.map((b) => b.textContent?.trim())).toEqual(["Mostrar diálogo", "Excluir projeto", "Sair"]);
    expect(container.querySelectorAll(".neu-adialog--inline")).toHaveLength(3);
    expect(container.querySelectorAll(".neu-adialog--sm")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-adialog__media--danger")).toHaveLength(1);
    expect(screen.getAllByRole("alertdialog")).toHaveLength(3);
    expect(aberto()).toBeNull();
  });

  it("o gatilho ganha aria-haspopup e aria-expanded; abrir põe o foco em Cancelar e trava a rolagem", () => {
    render(<NeumorfismoDialogoAlerta />);
    const gatilho = screen.getByRole("button", { name: "Mostrar diálogo" });
    expect(gatilho.getAttribute("aria-haspopup")).toBe("dialog");
    expect(gatilho.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(gatilho);
    const real = screen.getAllByRole("alertdialog").find((d) => d.getAttribute("aria-modal") === "true")!;
    expect(real.getAttribute("aria-labelledby")).toBeTruthy();
    expect(real.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.activeElement?.textContent).toBe("Cancelar");
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("button", { name: "Mostrar diálogo" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("Esc cancela, destrava a rolagem e devolve o foco ao gatilho", () => {
    render(<NeumorfismoDialogoAlerta />);
    const gatilho = screen.getByRole("button", { name: "Mostrar diálogo" });
    gatilho.focus();
    fireEvent.click(gatilho);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(aberto()).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Mostrar diálogo" }));
  });

  it("clicar no véu não fecha: o painel balança", () => {
    render(<NeumorfismoDialogoAlerta />);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar diálogo" }));
    fireEvent.click(aberto() as HTMLElement);
    expect(aberto()).not.toBeNull();
    expect(document.querySelector(".neu-adialog--nudge")).not.toBeNull();
  });

  it("Tab e Shift+Tab ficam presos entre Cancelar e a ação", () => {
    render(<NeumorfismoDialogoAlerta />);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar diálogo" }));
    const [cancelar, acao] = Array.from(document.querySelectorAll<HTMLElement>(".neu-adialog-layer button"));
    acao.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(cancelar);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(acao);
  });

  it("a ação roda e fecha; devolver false mantém aberto; uma promessa mantém aberto até se resolver", async () => {
    const aoAcionar = vi.fn((): unknown => undefined);
    const gatilho = <Button type="button">Abrir</Button>;
    const { rerender } = render(<DialogoAlerta gatilho={gatilho} titulo="Teste" aoAcionar={aoAcionar} rotuloAcao="Fazer" />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }));
    fireEvent.click(screen.getByRole("button", { name: "Fazer" }));
    expect(aoAcionar).toHaveBeenCalledTimes(1);
    expect(aberto()).toBeNull();

    aoAcionar.mockReturnValue(false);
    rerender(<DialogoAlerta gatilho={gatilho} titulo="Teste" aoAcionar={aoAcionar} rotuloAcao="Fazer" />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }));
    fireEvent.click(screen.getByRole("button", { name: "Fazer" }));
    expect(aberto()).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });

    let resolver: (v?: unknown) => void = () => {};
    aoAcionar.mockReturnValue(new Promise((r) => { resolver = r; }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }));
    fireEvent.click(screen.getByRole("button", { name: "Fazer" }));
    expect(aberto()).not.toBeNull();
    await act(async () => { resolver(); });
    expect(aberto()).toBeNull();
  });

  it("carregando: a ação mostra o giro e fica desabilitada, Cancelar também, e Esc é ignorado", () => {
    render(<DialogoAlerta aberto carregando titulo="Excluindo" rotuloAcao="Excluir" />);
    const acao = screen.getByRole("button", { name: /Excluir/ });
    expect(acao.hasAttribute("disabled")).toBe(true);
    expect(acao.getAttribute("aria-busy")).toBe("true");
    expect(acao.querySelector(".neu-spin")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancelar" }).hasAttribute("disabled")).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(aberto()).not.toBeNull();
  });

  it("no tom perigo a ação é destrutiva e o ícone de alerta aparece; focoInicial=acao foca a ação", () => {
    const { container } = render(<DialogoAlerta aberto tom="danger" focoInicial="acao" titulo="Excluir?" rotuloAcao="Excluir tudo" />);
    expect(container.querySelector(".neu-adialog__media--danger")).toBeTruthy();
    const acao = screen.getByRole("button", { name: "Excluir tudo" });
    expect(acao.getAttribute("data-variant")).toBe("destructive");
    expect(document.activeElement).toBe(acao);
  });

  it("Cancelar chama aoCancelar e fecha", () => {
    const aoCancelar = vi.fn();
    render(<DialogoAlerta gatilho={<Button type="button">Abrir</Button>} titulo="Teste" aoCancelar={aoCancelar} />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(aoCancelar).toHaveBeenCalledTimes(1);
    expect(aberto()).toBeNull();
  });
});
