import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoRecolhiveis, { LinhaRecolhivel, Recolhivel } from "../NeumorfismoRecolhivel";

describe("NeumorfismoRecolhivel", () => {
  it("cartão Collapsible: dois exemplos, um fechado e outro aberto por padrão", () => {
    const { container } = render(<NeumorfismoRecolhiveis />);
    const cartoes = container.querySelectorAll(".neu-collapsible");
    expect(cartoes).toHaveLength(2);
    expect(cartoes[0].classList.contains("neu-collapsible--open")).toBe(false);
    expect(cartoes[1].classList.contains("neu-collapsible--open")).toBe(true);
    expect(screen.getByText("Filtros avançados")).toBeTruthy();
    expect(screen.getByText("3 filtros ativos")).toBeTruthy();
  });

  it("a tecla é um botão com aria-expanded e aria-controls apontando para a região", () => {
    const { container } = render(<NeumorfismoRecolhiveis />);
    const tecla = screen.getByRole("button", { name: "Alternar detalhes do pedido" });
    const regiao = container.querySelector(`#${CSS.escape(tecla.getAttribute("aria-controls") ?? "")}`);
    expect(regiao?.classList.contains("neu-collapsible__region")).toBe(true);
    expect(tecla.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(tecla);
    expect(tecla.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Detalhes visíveis.")).toBeTruthy();
  });

  it("fechada, a região fica aria-hidden e inert; aberta, volta ao normal", () => {
    const { container } = render(<NeumorfismoRecolhiveis />);
    const regioes = container.querySelectorAll(".neu-collapsible__region");
    expect(regioes[0].getAttribute("aria-hidden")).toBe("true");
    expect(regioes[0].hasAttribute("inert")).toBe(true);
    expect(regioes[1].hasAttribute("aria-hidden")).toBe(false);
    expect(regioes[1].hasAttribute("inert")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Alternar detalhes do pedido" }));
    expect(regioes[0].hasAttribute("inert")).toBe(false);
    expect(regioes[0].hasAttribute("aria-hidden")).toBe(false);
  });

  it("a tecla de texto troca o rótulo conforme o estado", () => {
    render(<NeumorfismoRecolhiveis />);
    const tecla = screen.getByRole("button", { name: "Ocultar" });
    expect(tecla.classList.contains("neu-collapsible__toggle--text")).toBe(true);
    fireEvent.click(tecla);
    expect(screen.getByRole("button", { name: "Mostrar" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("controlado: aoMudar recebe o novo estado e a posição vem de fora", () => {
    const aoMudar = vi.fn();
    const { rerender, container } = render(
      <Recolhivel titulo="Detalhes" aberto={false} aoMudar={aoMudar}>
        <LinhaRecolhivel titulo="Itens">2× Fone</LinhaRecolhivel>
      </Recolhivel>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Alternar detalhes" }));
    expect(aoMudar).toHaveBeenCalledWith(true);
    expect(container.querySelector(".neu-collapsible--open")).toBeNull();
    rerender(
      <Recolhivel titulo="Detalhes" aberto aoMudar={aoMudar} simples>
        <LinhaRecolhivel titulo="Itens">2× Fone</LinhaRecolhivel>
      </Recolhivel>,
    );
    expect(container.querySelector(".neu-collapsible--open.neu-collapsible--plain")).toBeTruthy();
  });

  it("LinhaRecolhivel monta par rótulo/valor e título/texto", () => {
    const { container } = render(
      <>
        <LinhaRecolhivel rotulo="Status" valor="Enviado" />
        <LinhaRecolhivel titulo="Itens">2× Fone</LinhaRecolhivel>
      </>,
    );
    expect(container.querySelector(".neu-collapsible__row-label")?.textContent).toBe("Status");
    expect(container.querySelector(".neu-collapsible__row-value")?.textContent).toBe("Enviado");
    expect(container.querySelector(".neu-collapsible__row-title")?.textContent).toBe("Itens");
    expect(container.querySelector(".neu-collapsible__row-text")?.textContent).toBe("2× Fone");
  });
});
