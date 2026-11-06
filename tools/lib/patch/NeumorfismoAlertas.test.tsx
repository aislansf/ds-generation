import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAlertas, { Aviso } from "../NeumorfismoAlertas";

describe("NeumorfismoAlertas", () => {
  it("quatro avisos: sucesso e informação como status; atenção e erro como alerta", () => {
    const { container } = render(<NeumorfismoAlertas />);
    expect(container.querySelectorAll(".neu-alert")).toHaveLength(4);
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.getAllByRole("alert")).toHaveLength(2);
    for (const tipo of ["success", "info", "warning", "danger"]) {
      expect(container.querySelector(`.neu-alert__icon--${tipo}`)).toBeTruthy();
    }
    expect(screen.getByText("Registro salvo com sucesso!")).toBeTruthy();
    expect(screen.getByText("Não foi possível conectar ao servidor.")).toBeTruthy();
  });

  it("só os avisos com aoFechar têm o ✕, com nome acessível; o ícone é decorativo", () => {
    const { container } = render(
      <>
        <Aviso tipo="info" titulo="Sem fechar">Texto</Aviso>
        <Aviso tipo="danger" titulo="Com fechar" aoFechar={() => {}} />
      </>,
    );
    const [semFechar, comFechar] = Array.from(container.querySelectorAll(".neu-alert"));
    expect(semFechar.querySelector("button")).toBeNull();
    expect(comFechar.querySelector("button")?.getAttribute("aria-label")).toBe("Fechar");
    expect(comFechar.querySelector(".neu-alert__text")).toBeNull();
    expect(comFechar.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("fechar tira o aviso; Restaurar avisos traz os dois de volta", () => {
    render(<NeumorfismoAlertas />);
    expect(screen.queryByRole("button", { name: "Restaurar avisos" })).toBeNull();
    const fechar = screen.getAllByRole("button", { name: "Fechar" });
    expect(fechar).toHaveLength(2);
    fireEvent.click(fechar[0]);
    expect(screen.queryByText("Registro salvo com sucesso!")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByText("Erro na sincronização")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Restaurar avisos" }));
    expect(screen.getByText("Registro salvo com sucesso!")).toBeTruthy();
    expect(screen.getByText("Erro na sincronização")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Restaurar avisos" })).toBeNull();
  });
});
