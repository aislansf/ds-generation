import { afterEach, beforeAll, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { TelaCadastro, ExemploCadastro, cpfValido, formatarCpf, forcaDaSenha, validarCadastro, digitosCpf } from "../NeumorfismoSignUp";

// O Checkbox (Radix) mede o controle com ResizeObserver, que o jsdom não traz
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => vi.useRealTimers());

const campo = (nome: string) => document.querySelector(`input[name="${nome}"]`) as HTMLInputElement;
const digitar = (nome: string, valor: string) => fireEvent.change(campo(nome), { target: { value: valor } });
const enviar = () => fireEvent.submit(document.querySelector("form") as HTMLFormElement);
const aceite = () => screen.getByRole("checkbox") as HTMLElement;
const preencher = () => {
  digitar("name", "Maria da Silva");
  digitar("email", "maria@empresa.com.br");
  digitar("cpf", "52998224725");
  digitar("new-password", "Segredo@2026");
  digitar("confirm-password", "Segredo@2026");
};

describe("NeumorfismoSignUp", () => {
  it("regras do CPF: máscara, dígitos verificadores e repetidos", () => {
    expect(formatarCpf("52998224725")).toBe("529.982.247-25");
    expect(formatarCpf("5299")).toBe("529.9");
    expect(formatarCpf("529982247")).toBe("529.982.247");
    expect(digitosCpf("529.982.247-25 99")).toBe("52998224725");
    expect(cpfValido("529.982.247-25")).toBe(true);
    expect(cpfValido("529.982.247-24")).toBe(false);
    expect(cpfValido("111.111.111-11")).toBe(false);
    expect(cpfValido("123")).toBe(false);
  });

  it("força da senha: quatro níveis, cada um com palavra e tom", () => {
    expect(forcaDaSenha("")).toMatchObject({ pontos: 0, rotulo: "" });
    expect(forcaDaSenha("abc")).toMatchObject({ rotulo: "Muito curta", tom: "danger" });
    expect(forcaDaSenha("abcdefgh")).toMatchObject({ rotulo: "Fraca", tom: "warning" });
    expect(forcaDaSenha("abcdefg1H")).toMatchObject({ rotulo: "Boa", tom: "royal" });
    expect(forcaDaSenha("Segredo@2026!")).toMatchObject({ rotulo: "Forte", tom: "success", pontos: 100 });
  });

  it("validação pura: cada regra diz o que fazer; CPF pode ser dispensado", () => {
    const v = { nome: "Maria", email: "x", cpf: "123", senha: "curta", confirmar: "outra" };
    expect(validarCadastro(v, false)).toEqual({
      nome: "Informe nome e sobrenome.",
      email: "Informe um e-mail válido, como nome@empresa.com.br.",
      cpf: "CPF inválido. Confira os 11 dígitos.",
      senha: "Use pelo menos 8 caracteres.",
      confirmar: "As senhas não coincidem.",
      termos: "Aceite os Termos de Uso e a Política de Privacidade para continuar.",
    });
    expect(validarCadastro({ ...v, cpf: "" }, true).cpf).toBe("Informe seu CPF.");
    expect(validarCadastro(v, true, false).cpf).toBeUndefined();
    expect(validarCadastro({ nome: "", email: "", cpf: "", senha: "", confirmar: "" }, true)).toMatchObject({ nome: "Informe seu nome completo.", email: "Informe seu e-mail.", senha: "Crie uma senha.", confirmar: "Repita a senha." });
  });

  it("estrutura: título e subtítulo padrão, cinco campos obrigatórios com asterisco escondido, pares de senha e links", () => {
    const { container } = render(<TelaCadastro paginaInteira={false} nomeDaMarca="Acme" />);
    expect(screen.getByRole("heading", { name: "Criar conta" })).toBeTruthy();
    expect(container.querySelector(".neu-signin__sub")?.textContent).toBe("Preencha os campos abaixo para criar sua conta no sistema.");
    expect(container.querySelectorAll(".neu-signin__req")).toHaveLength(5);
    expect(container.querySelectorAll(".neu-signup__pair .neu-field")).toHaveLength(2);
    expect(container.querySelector(".neu-signup")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Termos de Uso" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Política de Privacidade" })).toBeTruthy();
    expect(container.querySelector(".neu-signin__alt")?.textContent).toBe("Já tem uma conta? Entrar");
    expect(campo("name").getAttribute("autocomplete")).toBe("name");
    expect(campo("email").getAttribute("autocomplete")).toBe("email");
    expect(campo("new-password").getAttribute("autocomplete")).toBe("new-password");
    expect(campo("confirm-password").getAttribute("autocomplete")).toBe("new-password");
    expect(campo("cpf").maxLength).toBe(14);
  });

  it("CPF ganha máscara ao digitar e pode ser escondido", () => {
    const { rerender } = render(<TelaCadastro />);
    digitar("cpf", "52998224725");
    expect(campo("cpf").value).toBe("529.982.247-25");
    rerender(<TelaCadastro cpf={false} />);
    expect(document.querySelector('input[name="cpf"]')).toBeNull();
  });

  it("senha: a barra e a palavra do nível aparecem só depois de digitar", () => {
    const { container } = render(<TelaCadastro />);
    expect(container.querySelector(".neu-signup__strength")).toBeNull();
    digitar("new-password", "abc");
    expect(container.querySelector(".neu-signup__strength-label")?.textContent).toBe("Força da senha: Muito curta");
    expect(container.querySelector(".neu-signup__strength-label--danger")).not.toBeNull();
    expect(container.querySelector(".neu-signup__strength")?.getAttribute("aria-live")).toBe("polite");
    expect(screen.getByRole("progressbar", { name: "Força da senha" }).getAttribute("aria-valuenow")).toBe("15");
    digitar("new-password", "Segredo@2026!");
    expect(container.querySelector(".neu-signup__strength-label")?.textContent).toBe("Força da senha: Forte");
  });

  it("enviar vazio mostra todos os erros e leva o foco ao nome; sem chamar aoEnviar", () => {
    const aoEnviar = vi.fn();
    const { container } = render(<TelaCadastro aoEnviar={aoEnviar} />);
    enviar();
    expect(container.querySelectorAll(".neu-error-text")).toHaveLength(6);
    expect(document.activeElement).toBe(campo("name"));
    expect(aoEnviar).not.toHaveBeenCalled();
  });

  it("o foco segue o primeiro problema, inclusive os termos, que ficam vermelhos e aria-invalid", () => {
    render(<TelaCadastro />);
    preencher();
    enviar();
    expect(screen.getByRole("alert").textContent).toBe("Aceite os Termos de Uso e a Política de Privacidade para continuar.");
    expect(document.activeElement).toBe(aceite());
    expect(aceite().getAttribute("aria-invalid")).toBe("true");
    expect(document.querySelector(".neu-signup__terms--error")).not.toBeNull();
    fireEvent.click(aceite());
    expect(screen.queryByRole("alert")).toBeNull();
    expect(aceite().getAttribute("aria-invalid")).toBeNull();
  });

  it("senhas diferentes: a confirmação reclama e o foco vai a ela; corrigir ao vivo limpa o erro", () => {
    render(<TelaCadastro />);
    preencher();
    digitar("confirm-password", "Outra@2026");
    fireEvent.click(aceite());
    enviar();
    expect(screen.getByText("As senhas não coincidem.")).toBeTruthy();
    expect(document.activeElement).toBe(campo("confirm-password"));
    digitar("confirm-password", "Segredo@2026");
    expect(screen.queryByText("As senhas não coincidem.")).toBeNull();
  });

  it("envio válido entrega nome, e-mail, CPF só com dígitos, senha e o aceite", () => {
    const aoEnviar = vi.fn();
    render(<TelaCadastro aoEnviar={aoEnviar} />);
    preencher();
    digitar("name", "  Maria da Silva ");
    fireEvent.click(aceite());
    enviar();
    expect(aoEnviar).toHaveBeenCalledWith({ nome: "Maria da Silva", email: "maria@empresa.com.br", cpf: "52998224725", senha: "Segredo@2026", aceitouTermos: true });
  });

  it("os termos nomeiam o checkbox pela frase, e os links ficam fora do rótulo", () => {
    const termos = vi.fn();
    const { container } = render(<TelaCadastro termos={{ onClick: termos }} />);
    const frase = container.querySelector(".neu-signup__terms-text") as HTMLElement;
    expect(aceite().getAttribute("aria-labelledby")).toBe(frase.id);
    expect(frase.textContent).toBe("Eu concordo com os Termos de Uso e a Política de Privacidade.");
    expect(aceite().closest("label")).toBeNull();
    fireEvent.click(screen.getByRole("link", { name: "Termos de Uso" }));
    expect(termos).toHaveBeenCalledTimes(1);
  });

  it("carregando e erro do servidor: botão desativado, aviso de perigo ligado ao formulário", () => {
    const { container, rerender } = render(<TelaCadastro carregando />);
    const botao = screen.getByRole("button", { name: "Criando conta…" }) as HTMLButtonElement;
    expect(botao.disabled).toBe(true);
    expect(botao.getAttribute("aria-busy")).toBe("true");
    const fechar = vi.fn();
    rerender(<TelaCadastro erro="Já existe uma conta." aoFecharErro={fechar} />);
    const aviso = screen.getByRole("alert");
    expect(aviso.textContent).toContain("Não foi possível criar a conta");
    expect(container.querySelector("form")?.getAttribute("aria-describedby")).toBe(aviso.parentElement?.id);
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(fechar).toHaveBeenCalledTimes(1);
  });

  it("opções: tom da marca e chamada de entrada escondida", () => {
    const { rerender } = render(<TelaCadastro />);
    expect(screen.getByRole("button", { name: "Criar conta" }).getAttribute("data-variant")).toBe("secondary");
    rerender(<TelaCadastro tom="marca" entrar={false} rodape={false} />);
    expect(screen.getByRole("button", { name: "Criar conta" }).getAttribute("data-variant")).toBe("default");
    expect(document.querySelector(".neu-signin__alt")).toBeNull();
    expect(document.querySelector(".neu-signin__foot")).toBeNull();
  });

  it("exemplo: com tudo válido a demonstração carrega e depois mostra o erro de conta existente", () => {
    vi.useFakeTimers();
    const { container } = render(<ExemploCadastro />);
    expect(container.querySelector(".neu-signin-demo__nota")?.textContent).toMatch(/529\.982\.247-25/);
    preencher();
    fireEvent.click(aceite());
    enviar();
    expect((screen.getByRole("button", { name: "Criando conta…" }) as HTMLButtonElement).disabled).toBe(true);
    act(() => vi.advanceTimersByTime(1300));
    expect(screen.getByRole("alert").textContent).toContain("Já existe uma conta com este e-mail ou CPF");
  });
});
