import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoToasts, { Notificacao } from "../NeumorfismoToasts";

afterEach(() => {
  vi.useRealTimers();
});

describe("NeumorfismoToasts", () => {
  it("mostra o toast simples e o detalhado do pacote, com a linha de tempo só no detalhado", () => {
    const { container } = render(<NeumorfismoToasts />);
    const toasts = container.querySelectorAll(".neu-toast");
    expect(toasts).toHaveLength(2);
    expect(toasts[0].className).toContain("neu-toast--simple");
    expect(toasts[0].querySelector(".neu-toast__timer")).toBeNull();
    expect(toasts[1].querySelector(".neu-alert")).toBeTruthy();
    expect(toasts[1].querySelector(".neu-toast__timer")).toBeTruthy();
    expect(screen.getByText("Os dados foram gravados na base.")).toBeTruthy();
    expect(container.querySelector(".neu-toast-host")).toBeNull();
  });

  it("o toast é uma região viva; o detalhado não repete o papel do aviso de dentro", () => {
    const { container } = render(
      <>
        <Notificacao titulo="Salvo" />
        <Notificacao tipo="danger" titulo="Falhou" />
      </>,
    );
    const [ok, erro] = Array.from(container.querySelectorAll(".neu-toast"));
    expect(ok.getAttribute("role")).toBe("status");
    expect(ok.getAttribute("aria-live")).toBe("polite");
    expect(erro.getAttribute("role")).toBe("alert");
    expect(erro.getAttribute("aria-live")).toBe("assertive");
    expect(container.querySelectorAll(".neu-alert[role]")).toHaveLength(0);
  });

  it("Exibir Toast abre o toast flutuante; o ✕ fecha na hora", () => {
    const { container } = render(<NeumorfismoToasts />);
    fireEvent.click(screen.getByRole("button", { name: "Exibir Toast" }));
    expect(container.querySelector(".neu-toast-host .neu-toast--simple")).toBeTruthy();
    const fechar = container.querySelector(".neu-toast-host button[aria-label='Fechar']") as HTMLElement;
    fireEvent.click(fechar);
    expect(container.querySelector(".neu-toast-host")).toBeNull();
  });

  it("fecha sozinho ao fim da duração e o mouse em cima pausa a contagem", () => {
    vi.useFakeTimers();
    const aoFechar = vi.fn();
    const { container } = render(<Notificacao variante="simples" titulo="Salvo" duracao={1000} aoFechar={aoFechar} />);
    const toast = container.querySelector(".neu-toast") as HTMLElement;
    fireEvent.mouseEnter(toast);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(aoFechar).not.toHaveBeenCalled();
    fireEvent.mouseLeave(toast);
    act(() => { vi.advanceTimersByTime(1200); });
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });

  it("pausado e Infinity nunca fecham sozinhos", () => {
    vi.useFakeTimers();
    const aoFechar = vi.fn();
    render(
      <>
        <Notificacao titulo="A" duracao={500} pausado aoFechar={aoFechar} />
        <Notificacao titulo="B" duracao={Infinity} aoFechar={aoFechar} />
      </>,
    );
    act(() => { vi.advanceTimersByTime(10000); });
    expect(aoFechar).not.toHaveBeenCalled();
  });
});
