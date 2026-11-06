import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import NeumorfismoCarrossel, { Carrossel } from "../NeumorfismoCarrossel";

const regiao = (nome: string) => screen.getByRole("region", { name: nome });

describe("NeumorfismoCarrossel", () => {
  afterEach(() => vi.useRealTimers());

  it("cartão Carousel: quatro carrosséis, cada slide é um grupo \"n de N\" e o que está fora da vista fica escondido e inerte", () => {
    const { container } = render(<NeumorfismoCarrossel />);
    expect(container.querySelectorAll("section.neu-carousel")).toHaveLength(4);
    const basico = regiao("Números");
    expect(basico.getAttribute("aria-roledescription")).toBe("carrossel");
    const slides = basico.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides).toHaveLength(5);
    expect(slides[0].getAttribute("aria-label")).toBe("1 de 5");
    expect(slides[0].hasAttribute("aria-hidden")).toBe(false);
    expect(slides[1].getAttribute("aria-hidden")).toBe("true");
    expect(slides[1].hasAttribute("inert")).toBe(true);
    expect(container.querySelector(".neu-carousel--vertical")).toBeTruthy();
  });

  it("as teclas andam um passo e afundam nas pontas quando não há loop", () => {
    render(<NeumorfismoCarrossel />);
    const basico = within(regiao("Números"));
    const anterior = basico.getByRole("button", { name: "Slide anterior" }) as HTMLButtonElement;
    const proximo = basico.getByRole("button", { name: "Próximo slide" }) as HTMLButtonElement;
    expect(anterior.disabled).toBe(true);
    for (let i = 0; i < 4; i++) fireEvent.click(proximo);
    expect(proximo.disabled).toBe(true);
    expect(anterior.disabled).toBe(false);
    expect(basico.getByText("Slide 5 de 5")).toBeTruthy();
    fireEvent.click(anterior);
    expect(basico.getByText("Slide 4 de 5")).toBeTruthy();
  });

  it("os pontos têm nome, marcam a posição e levam ao slide", () => {
    render(<NeumorfismoCarrossel />);
    const basico = within(regiao("Números"));
    const pontos = basico.getAllByRole("button", { name: /Ir para o slide/ });
    expect(pontos).toHaveLength(5);
    expect(pontos[0].getAttribute("aria-current")).toBe("true");
    fireEvent.click(pontos[2]);
    expect(pontos[2].getAttribute("aria-current")).toBe("true");
    expect(pontos[0].hasAttribute("aria-current")).toBe(false);
    expect(basico.getByText("Slide 3 de 5")).toBeTruthy();
  });

  it("setas, Home e End funcionam com o foco dentro; o vertical usa cima e baixo", () => {
    render(<NeumorfismoCarrossel />);
    const basico = regiao("Números");
    fireEvent.keyDown(basico, { key: "ArrowRight" });
    expect(within(basico).getByText("Slide 2 de 5")).toBeTruthy();
    fireEvent.keyDown(basico, { key: "End" });
    expect(within(basico).getByText("Slide 5 de 5")).toBeTruthy();
    fireEvent.keyDown(basico, { key: "ArrowLeft" });
    expect(within(basico).getByText("Slide 4 de 5")).toBeTruthy();
    fireEvent.keyDown(basico, { key: "Home" });
    expect(within(basico).getByText("Slide 1 de 5")).toBeTruthy();

    const agenda = regiao("Agenda do dia");
    expect(within(agenda).getByText("1–2 de 5")).toBeTruthy();
    fireEvent.keyDown(agenda, { key: "ArrowRight" });
    expect(within(agenda).getByText("1–2 de 5")).toBeTruthy();
    fireEvent.keyDown(agenda, { key: "ArrowDown" });
    expect(within(agenda).getByText("2–3 de 5")).toBeTruthy();
    expect(agenda.querySelectorAll('[aria-hidden="true"]:not([role="img"])').length).toBeGreaterThan(0);
  });

  it("com loop, a última posição volta para a primeira e a tecla não afunda", () => {
    render(<NeumorfismoCarrossel />);
    const destaques = regiao("Destaques do mês");
    const proximo = within(destaques).getByRole("button", { name: "Próximo slide" }) as HTMLButtonElement;
    expect((within(destaques).getByRole("button", { name: "Slide anterior" }) as HTMLButtonElement).disabled).toBe(false);
    for (let i = 0; i < 3; i++) fireEvent.click(proximo);
    expect(within(destaques).getByText("4 de 4")).toBeTruthy();
    fireEvent.click(proximo);
    expect(within(destaques).getByText("1 de 4")).toBeTruthy();
  });

  it("a rotação automática avança sozinha, pausa com o mouse e tem a tecla de pausa", () => {
    vi.useFakeTimers();
    render(<NeumorfismoCarrossel />);
    const destaques = regiao("Destaques do mês");
    expect(within(destaques).getByText("1 de 4")).toBeTruthy();
    act(() => { vi.advanceTimersByTime(6000); });
    expect(within(destaques).getByText("2 de 4")).toBeTruthy();

    fireEvent.mouseEnter(destaques);
    act(() => { vi.advanceTimersByTime(12000); });
    expect(within(destaques).getByText("2 de 4")).toBeTruthy();
    fireEvent.mouseLeave(destaques);

    const pausa = within(destaques).getByRole("button", { name: "Pausar rotação automática" });
    fireEvent.click(pausa);
    act(() => { vi.advanceTimersByTime(12000); });
    expect(within(destaques).getByText("2 de 4")).toBeTruthy();
    expect(within(destaques).getByRole("button", { name: "Iniciar rotação automática" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("controlado: aoMudar recebe o novo índice e a posição vem de fora", () => {
    const aoMudar = vi.fn();
    const { rerender } = render(
      <Carrossel rotulo="Controlado" indice={0} aoMudar={aoMudar}>
        <p>a</p>
        <p>b</p>
        <p>c</p>
      </Carrossel>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Próximo slide" }));
    expect(aoMudar).toHaveBeenCalledWith(1);
    expect(screen.getByText("Slide 1 de 3")).toBeTruthy();
    rerender(
      <Carrossel rotulo="Controlado" indice={2} aoMudar={aoMudar}>
        <p>a</p>
        <p>b</p>
        <p>c</p>
      </Carrossel>,
    );
    expect(screen.getByText("Slide 3 de 3")).toBeTruthy();
  });
});
