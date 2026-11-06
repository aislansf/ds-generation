import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoDatePicker, { IntervaloDatas, lerData } from "../NeumorfismoDatePicker";

describe("NeumorfismoDatePicker", () => {
  it("lerData aceita DD/MM/AAAA válida e recusa o resto", () => {
    expect(lerData("17/04/2026")?.getDate()).toBe(17);
    expect(lerData("31/02/2026")).toBeNull();
    expect(lerData("2026-04-17")).toBeNull();
  });

  it("período: datas por extenso, dois meses, pontas marcadas e atalhos", () => {
    const { container } = render(<NeumorfismoDatePicker />);
    expect(screen.getByRole("group", { name: "Período do relatório" })).toBeTruthy();
    expect(screen.getByText("17 de abril de 2026")).toBeTruthy();
    expect(screen.getByText("11 de maio de 2026")).toBeTruthy();
    expect(container.querySelectorAll(".neu-range__grid")).toHaveLength(2);
    const pontas = container.querySelectorAll('.neu-range__day[aria-selected="true"]');
    expect(pontas).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /^7 de abril de 2026$/ })[0].getAttribute("aria-current")).toBe("date");
    for (const nome of ["Hoje", "Ontem", "Esta semana", "Semana passada", "Este mês", "Mês passado"]) {
      expect(screen.getByRole("button", { name: nome })).toBeTruthy();
    }
    expect(container.querySelectorAll(".neu-range__cell--in").length).toBeGreaterThan(20);
  });

  it("clicar escolhe o início e depois o fim; antes do início, troca", () => {
    let ultimo = { start: "", end: "" };
    render(<IntervaloDatas rotulo="Período" hoje="07/04/2026" valorInicial={{ start: "17/04/2026", end: "11/05/2026" }} onChange={(p) => (ultimo = p)} />);
    fireEvent.click(screen.getAllByRole("button", { name: "20 de abril de 2026" })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: "10 de abril de 2026" })[0]);
    expect(ultimo).toEqual({ start: "10/04/2026", end: "20/04/2026" });
    expect(screen.getByText("10 de abril de 2026")).toBeTruthy();
  });

  it("atalho Hoje preenche as duas pontas e fica pressionado", () => {
    render(<IntervaloDatas rotulo="Período" hoje="07/04/2026" valorInicial={{ start: "17/04/2026", end: "11/05/2026" }} />);
    const hoje = screen.getByRole("button", { name: "Hoje" });
    expect(hoje.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(hoje);
    expect(hoje.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getAllByText("7 de abril de 2026").length).toBeGreaterThanOrEqual(2);
  });

  it("data única: máscara no campo e calendário pela tecla", () => {
    render(<NeumorfismoDatePicker />);
    const campo = screen.getByLabelText("Data de Início") as HTMLInputElement;
    expect(campo.value).toBe("15/01/2026");
    fireEvent.change(campo, { target: { value: "01022027" } });
    expect(campo.value).toBe("01/02/2027");
    expect(screen.getByRole("button", { name: "Abrir calendário" })).toBeTruthy();
  });
});
