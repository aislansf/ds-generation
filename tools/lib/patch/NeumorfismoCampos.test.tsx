import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoCampos, { CampoTexto } from "../NeumorfismoCampos";

describe("NeumorfismoCampos", () => {
  it("cada campo tem rótulo ligado ao input", () => {
    render(<NeumorfismoCampos />);
    for (const nome of ["Nome completo", "E-mail", "Campo com erro", "Buscar", "E-mail ou usuário", "Senha", "Chave de API", "Unidade"]) {
      expect(screen.getAllByLabelText(nome).length).toBeGreaterThan(0);
    }
  });

  it("erro: aria-invalid, mensagem com role=alert ligada por aria-describedby e ícone de alerta", () => {
    const { container } = render(<CampoTexto label="Campo com erro" error="Este campo é obrigatório" />);
    const campo = screen.getByLabelText("Campo com erro");
    const alerta = screen.getByRole("alert");
    expect(campo.getAttribute("aria-invalid")).toBe("true");
    expect(campo.getAttribute("aria-describedby")).toBe(alerta.id);
    expect(alerta.textContent).toBe("Este campo é obrigatório");
    expect(container.querySelector(".neu-field--error")).not.toBeNull();
    expect(container.querySelector(".neu-label--error")).not.toBeNull();
  });

  it("senha: o botão mostra e oculta o texto e usa aria-pressed", () => {
    render(<CampoTexto label="Senha" type="password" revealable defaultValue="segredo" />);
    const campo = screen.getByLabelText("Senha") as HTMLInputElement;
    const botao = screen.getByRole("button", { name: "Mostrar senha" });
    expect(campo.type).toBe("password");
    expect(botao.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(botao);
    expect(campo.type).toBe("text");
    expect(screen.getByRole("button", { name: "Ocultar senha" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("ação no rótulo e variantes plain e soft", () => {
    const { container } = render(<NeumorfismoCampos />);
    expect(screen.getByRole("link", { name: "Esqueceu?" })).toBeTruthy();
    expect(container.querySelector(".neu-field--plain")).not.toBeNull();
    expect(container.querySelectorAll(".neu-field--soft")).toHaveLength(2);
  });

  it("Input: o e-mail inválido mostra o erro e o válido volta à descrição; sm e desativado existem", () => {
    const { container } = render(<NeumorfismoCampos />);
    const [, email] = screen.getAllByLabelText("E-mail") as HTMLInputElement[];
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText(/Informe um e-mail válido/)).toBeTruthy();
    fireEvent.change(email, { target: { value: "ana@empresa.com.br" } });
    expect(email.getAttribute("aria-invalid")).toBeNull();
    expect(screen.getByText("Usaremos para enviar o comprovante.")).toBeTruthy();
    expect(container.querySelector(".neu-input--sm")).not.toBeNull();
    expect((screen.getByLabelText("Unidade") as HTMLInputElement).disabled).toBe(true);
  });
});
