import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoOTP, { CodigoOTP } from "../NeumorfismoOTP";

describe("NeumorfismoOTP", () => {
  it("mostra as quatro variações com células nomeadas e grupos", () => {
    const { container } = render(<NeumorfismoOTP />);
    expect(container.querySelectorAll('[role="group"]')).toHaveLength(4);
    expect(container.querySelectorAll(".neu-otp__cell")).toHaveLength(6 + 6 + 8 + 4);
    expect(container.querySelectorAll(".neu-otp__sep")).toHaveLength(2);
    expect(container.querySelector(".neu-otp--sm")).not.toBeNull();
    expect(screen.getAllByLabelText("Caractere 1 de 6").length).toBe(2);
    expect(container.querySelector(".neu-code--invalid")).not.toBeNull();
    expect(screen.getByRole("alert").textContent).toMatch(/Restam 2 tentativas/);
  });

  it("digitar avança, onComplete dispara no último e só dígitos entram", () => {
    let pronto = "";
    render(<CodigoOTP maxLength={4} onComplete={(c) => (pronto = c)} />);
    const celulas = screen.getAllByLabelText(/Caractere \d de 4/) as HTMLInputElement[];
    fireEvent.change(celulas[0], { target: { value: "a" } });
    expect(celulas[0].value).toBe("");
    for (const [i, d] of ["1", "2", "3", "4"].entries()) fireEvent.change(celulas[i], { target: { value: d } });
    expect(celulas.map((c) => c.value).join("")).toBe("1234");
    expect(pronto).toBe("1234");
  });

  it("colar preenche todas as células e alfanumérico põe em maiúsculas", () => {
    render(<CodigoOTP maxLength={6} alfanumerico />);
    const primeira = screen.getByLabelText("Caractere 1 de 6");
    fireEvent.paste(primeira, { clipboardData: { getData: () => "ab-12c3" } });
    const celulas = screen.getAllByLabelText(/Caractere \d de 6/) as HTMLInputElement[];
    expect(celulas.map((c) => c.value).join("")).toBe("AB12C3");
  });

  it("Backspace apaga a célula atual; a primeira célula pede o código do SMS", () => {
    render(<CodigoOTP maxLength={4} defaultValue="12" />);
    const celulas = screen.getAllByLabelText(/Caractere \d de 4/) as HTMLInputElement[];
    expect(celulas[0].getAttribute("autocomplete")).toBe("one-time-code");
    fireEvent.keyDown(celulas[1], { key: "Backspace" });
    expect(celulas.map((c) => c.value).join("")).toBe("1");
  });
});
