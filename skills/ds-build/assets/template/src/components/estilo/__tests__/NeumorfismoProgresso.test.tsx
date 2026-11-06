import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoProgresso, { Progresso } from "../NeumorfismoProgresso";

afterEach(() => {
  vi.useRealTimers();
});

describe("NeumorfismoProgresso", () => {
  it("as barras do pacote, com nome, limites e valor", () => {
    render(<NeumorfismoProgresso />);
    const tarefa = screen.getByRole("progressbar", { name: "Progresso da tarefa" });
    expect(tarefa.getAttribute("aria-valuenow")).toBe("13");
    expect(tarefa.getAttribute("aria-valuemin")).toBe("0");
    expect(tarefa.getAttribute("aria-valuemax")).toBe("100");
    expect(screen.getByRole("progressbar", { name: "Taxa de execução" }).getAttribute("aria-valuenow")).toBe("78.4");
    expect(screen.getByRole("progressbar", { name: "Envio de documentos" }).getAttribute("aria-valuenow")).toBe("42");
    expect(screen.getAllByRole("progressbar")).toHaveLength(7);
  });

  it("fina, grande e os tons viram classes na calha e na barra", () => {
    const { container } = render(<NeumorfismoProgresso />);
    expect(container.querySelectorAll(".neu-progress--thin")).toHaveLength(3);
    expect(container.querySelectorAll(".neu-progress--lg")).toHaveLength(1);
    for (const tom of ["royal", "success", "warning"]) {
      expect(container.querySelector(`.neu-progress__bar--${tom}`)).toBeTruthy();
    }
    expect(screen.getByRole("progressbar", { name: "Taxa de execução" }).firstElementChild?.getAttribute("style")).toContain("78.4%");
  });

  it("com título e valor: a porcentagem é decorativa e a dica aparece abaixo", () => {
    render(<NeumorfismoProgresso />);
    const pct = screen.getByText("42%");
    expect(pct.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("5 de 12 arquivos enviados")).toBeTruthy();
    expect(screen.getByText("Envio de documentos", { selector: ".neu-progress-field__title" })).toBeTruthy();
  });

  it("indeterminada não tem aria-valuenow nem porcentagem", () => {
    const { container } = render(<Progresso indeterminado titulo="Sincronizando" mostrarValor rotulo="Sincronizando dados" />);
    const barra = screen.getByRole("progressbar", { name: "Sincronizando dados" });
    expect(barra.hasAttribute("aria-valuenow")).toBe(false);
    expect(barra.className).toContain("neu-progress--indeterminate");
    expect(container.querySelector(".neu-progress-field__value")).toBeNull();
  });

  it("o valor é limitado a 0–100", () => {
    render(
      <>
        <Progresso valor={150} rotulo="Acima" />
        <Progresso valor={-5} rotulo="Abaixo" />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Acima" }).getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByRole("progressbar", { name: "Abaixo" }).getAttribute("aria-valuenow")).toBe("0");
  });

  it("a barra de referência sai de 13% e vai a 66% em meio segundo; Repetir recomeça", () => {
    vi.useFakeTimers();
    render(<NeumorfismoProgresso />);
    const tarefa = () => screen.getByRole("progressbar", { name: "Progresso da tarefa" });
    expect(tarefa().getAttribute("aria-valuenow")).toBe("13");
    act(() => { vi.advanceTimersByTime(600); });
    expect(tarefa().getAttribute("aria-valuenow")).toBe("66");
    fireEvent.click(screen.getByRole("button", { name: /Repetir/ }));
    expect(tarefa().getAttribute("aria-valuenow")).toBe("13");
    act(() => { vi.advanceTimersByTime(600); });
    expect(tarefa().getAttribute("aria-valuenow")).toBe("66");
  });
});
