import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoQuestionario from "../NeumorfismoQuestionario";

const avancar = () => fireEvent.click(screen.getByRole("button", { name: /Avançar/ }));

describe("NeumorfismoQuestionario", () => {
  it("começa na primeira pergunta, com progresso, escolhas e atalhos", () => {
    render(<NeumorfismoQuestionario />);
    expect(screen.getByText("Pergunta 1 de 3")).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "O que o assistente deve construir a seguir?" })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("0 de 3 respondidas");
    expect(screen.getByRole("button", { name: /Voltar/ }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByText(/Atalho: pressione/)).toBeTruthy();
  });

  it("obrigatória sem resposta bloqueia o avanço com um alerta", () => {
    render(<NeumorfismoQuestionario />);
    avancar();
    expect(screen.getByRole("alert").textContent).toBe("Escolha uma opção ou descreva outra para continuar.");
    expect(screen.getByText("Pergunta 1 de 3")).toBeTruthy();
  });

  it("a letra escolhe a opção; o campo de texto ignora os atalhos e vale como resposta", () => {
    const { container } = render(<NeumorfismoQuestionario />);
    fireEvent.keyDown(container.querySelector("form")!, { key: "b" });
    expect((screen.getByRole("radio", { name: /Pontos de aprovação/ }) as HTMLInputElement).checked).toBe(true);
    const campo = screen.getByLabelText("Outro recurso do assistente");
    fireEvent.keyDown(campo, { key: "a" });
    expect((screen.getByRole("radio", { name: /Pontos de aprovação/ }) as HTMLInputElement).checked).toBe(true);
    fireEvent.change(campo, { target: { value: "Painel de custos" } });
    expect((screen.getByRole("radio", { name: /Pontos de aprovação/ }) as HTMLInputElement).checked).toBe(false);
    avancar();
    expect(screen.getByText("Pergunta 2 de 3")).toBeTruthy();
  });

  it("a pergunta opcional é múltipla, pode ser pulada e conta no progresso quando respondida", () => {
    const { container } = render(<NeumorfismoQuestionario />);
    fireEvent.keyDown(container.querySelector("form")!, { key: "a" });
    avancar();
    expect(screen.getByText("(opcional)")).toBeTruthy();
    expect(screen.getByRole("group", { name: /O que toda atualização/ })).toBeTruthy();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    fireEvent.click(screen.getByRole("checkbox", { name: /Progresso/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Riscos/ }));
    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("2 de 3 respondidas");
    fireEvent.click(screen.getByRole("button", { name: "Pular" }));
    expect(screen.getByText("Pergunta 3 de 3")).toBeTruthy();
  });

  it("o último passo envia e mostra a conclusão; Responder de novo recomeça", () => {
    const { container } = render(<NeumorfismoQuestionario />);
    fireEvent.keyDown(container.querySelector("form")!, { key: "c" });
    avancar();
    fireEvent.click(screen.getByRole("button", { name: "Pular" }));
    expect(screen.queryByRole("button", { name: "Pular" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Salvar plano/ }));
    expect(screen.getByRole("alert").textContent).toBe("Escolha uma opção para concluir.");
    fireEvent.keyDown(container.querySelector("form")!, { key: "1" });
    fireEvent.keyDown(container.querySelector("form")!, { key: "a" });
    fireEvent.click(screen.getByRole("button", { name: /Salvar plano/ }));
    expect(screen.getByRole("status").textContent).toContain("Plano salvo");
    fireEvent.click(screen.getByRole("button", { name: /Responder de novo/ }));
    expect(screen.getByText("Pergunta 1 de 3")).toBeTruthy();
  });

  it("Voltar retorna à pergunta anterior", () => {
    const { container } = render(<NeumorfismoQuestionario />);
    fireEvent.keyDown(container.querySelector("form")!, { key: "a" });
    avancar();
    fireEvent.click(screen.getByRole("button", { name: /Voltar/ }));
    expect(screen.getByText("Pergunta 1 de 3")).toBeTruthy();
    expect((screen.getByRole("radio", { name: /Linha do tempo/ }) as HTMLInputElement).checked).toBe(true);
  });
});
