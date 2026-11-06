import { afterEach, beforeAll, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TelaEntrar, ExemploEntrar, ExemploEntrarCartao, validarEntrada } from "../NeumorfismoSignIn";

// O Checkbox (Radix) mede o controle com ResizeObserver, que o jsdom não traz
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => vi.useRealTimers());

const campos = () => ({
  email: document.querySelector('input[name="email"]') as HTMLInputElement,
  senha: document.querySelector('input[name="senha"]') as HTMLInputElement,
});
const enviar = () => fireEvent.submit(document.querySelector("form") as HTMLFormElement);

describe("NeumorfismoSignIn", () => {
  it("estrutura centrada: marca padrão, título, subtítulo, painel com os dois campos, linha, botão e cadastro", () => {
    const { container } = render(<TelaEntrar paginaInteira={false} nomeDaMarca="Acme" />);
    expect(container.querySelector("section.neu-signin.neu-signin--inline")).not.toBeNull();
    expect(container.querySelector(".neu-signin__brandname")?.textContent).toBe("Acme");
    expect(container.querySelector(".neu-signin__mark")).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Bem-vindo" })).toBeTruthy();
    expect(container.querySelector(".neu-signin__sub")?.textContent).toBe("Informe seu e-mail e senha para acessar o sistema.");
    expect(container.querySelectorAll(".neu-signin__card .neu-field")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Entrar" })).toBeTruthy();
    expect(container.querySelector(".neu-signin__alt")?.textContent).toBe("Novo por aqui? Criar uma conta");
    expect(container.querySelector(".neu-signin__foot")?.textContent).toBe(`© ${new Date().getFullYear()} Acme`);
    expect(container.querySelector(".neu-signin--card")).toBeNull();
  });

  it("página inteira usa main; o logo próprio troca a marca e o nome", () => {
    const { container } = render(<TelaEntrar logo={<img src="x.png" alt="Logo" />} />);
    expect(container.querySelector("main.neu-signin")).not.toBeNull();
    expect(container.querySelector(".neu-signin__brand img")).not.toBeNull();
    expect(container.querySelector(".neu-signin__mark")).toBeNull();
    expect(container.querySelector(".neu-signin__brandname")).toBeNull();
  });

  it("campos: asterisco escondido dos leitores, autofill, e-mail e senha com revelar", () => {
    const { container } = render(<TelaEntrar />);
    const { email, senha } = campos();
    expect(container.querySelectorAll(".neu-signin__req")).toHaveLength(2);
    expect(container.querySelector(".neu-signin__req")?.getAttribute("aria-hidden")).toBe("true");
    expect(email.getAttribute("autocomplete")).toBe("username");
    expect(email.getAttribute("inputmode")).toBe("email");
    expect(email.required).toBe(true);
    expect(senha.getAttribute("autocomplete")).toBe("current-password");
    expect(senha.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(senha.type).toBe("text");
    expect(screen.getByLabelText(/E-mail/)).toBe(email);
  });

  it("validação ao enviar: erros nos dois campos e foco no primeiro inválido; sem chamar aoEnviar", () => {
    const aoEnviar = vi.fn();
    render(<TelaEntrar aoEnviar={aoEnviar} />);
    enviar();
    expect(screen.getByText("Informe seu e-mail.")).toBeTruthy();
    expect(screen.getByText("Informe sua senha.")).toBeTruthy();
    expect(document.activeElement).toBe(campos().email);
    expect(campos().email.getAttribute("aria-invalid")).toBe("true");
    expect(aoEnviar).not.toHaveBeenCalled();
    fireEvent.change(campos().email, { target: { value: "ana@empresa.com.br" } });
    expect(screen.queryByText("Informe seu e-mail.")).toBeNull();
    enviar();
    expect(document.activeElement).toBe(campos().senha);
    expect(aoEnviar).not.toHaveBeenCalled();
  });

  it("e-mail malformado mostra a mensagem com exemplo, ao vivo depois da primeira tentativa", () => {
    render(<TelaEntrar />);
    fireEvent.change(campos().email, { target: { value: "ana@" } });
    expect(screen.queryByText(/Informe um e-mail válido/)).toBeNull();
    enviar();
    expect(screen.getByText("Informe um e-mail válido, como nome@empresa.com.br.")).toBeTruthy();
    fireEvent.change(campos().email, { target: { value: "ana@empresa.com.br" } });
    expect(screen.queryByText(/Informe um e-mail válido/)).toBeNull();
    expect(validarEntrada("a@b.c", "x").email).toMatch(/válido/);
    expect(validarEntrada("a@b.co", "x")).toEqual({});
  });

  it("envio válido entrega e-mail sem espaços, senha e a escolha de manter conectado", () => {
    const aoEnviar = vi.fn();
    render(<TelaEntrar aoEnviar={aoEnviar} />);
    fireEvent.change(campos().email, { target: { value: "  ana@empresa.com.br " } });
    fireEvent.change(campos().senha, { target: { value: "segredo" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "Manter conectado" }));
    enviar();
    expect(aoEnviar).toHaveBeenCalledWith({ email: "ana@empresa.com.br", senha: "segredo", lembrar: true });
  });

  it("carregando: botão desativado com o texto de carregamento e aria-busy", () => {
    render(<TelaEntrar carregando />);
    const botao = screen.getByRole("button", { name: "Entrando…" }) as HTMLButtonElement;
    expect(botao.disabled).toBe(true);
    expect(botao.getAttribute("aria-busy")).toBe("true");
  });

  it("erro do servidor: aviso de perigo ligado ao formulário, com ✕ quando há aoFecharErro", () => {
    const aoFecharErro = vi.fn();
    const { container, rerender } = render(<TelaEntrar erro="E-mail ou senha incorretos." aoFecharErro={aoFecharErro} />);
    const aviso = screen.getByRole("alert");
    expect(aviso.textContent).toContain("Não foi possível entrar");
    expect(aviso.textContent).toContain("E-mail ou senha incorretos.");
    expect(container.querySelector("form")?.getAttribute("aria-describedby")).toBe(aviso.parentElement?.id);
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(aoFecharErro).toHaveBeenCalledTimes(1);
    rerender(<TelaEntrar />);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(container.querySelector("form")?.hasAttribute("aria-describedby")).toBe(false);
  });

  it("links e opções: esqueci e cadastro com callbacks, e dá para escondê-los", () => {
    const esqueci = vi.fn();
    const cadastro = vi.fn();
    const { container, rerender } = render(<TelaEntrar esqueci={{ onClick: esqueci }} cadastro={{ prompt: "Novo aqui?", onClick: cadastro }} />);
    fireEvent.click(screen.getByRole("link", { name: "Esqueceu a senha?" }));
    fireEvent.click(screen.getByRole("link", { name: "Criar uma conta" }));
    expect(esqueci).toHaveBeenCalledTimes(1);
    expect(cadastro).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".neu-signin__alt")?.textContent).toBe("Novo aqui? Criar uma conta");
    expect(screen.getByRole("link", { name: "Esqueceu a senha?" }).className).toContain("neu-signin__link--royal");
    rerender(<TelaEntrar esqueci={false} cadastro={false} lembravel={false} rodape={false} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(container.querySelector(".neu-signin__foot")).toBeNull();
  });

  it("tom: secundário por padrão; marca usa o botão principal", () => {
    const { rerender } = render(<TelaEntrar />);
    expect(screen.getByRole("button", { name: "Entrar" }).getAttribute("data-variant")).toBe("secondary");
    rerender(<TelaEntrar tom="marca" />);
    expect(screen.getByRole("button", { name: "Entrar" }).getAttribute("data-variant")).toBe("default");
  });

  it("layout cartão: duas colunas, ilustração padrão sem foto, painel visual escondido dos leitores", () => {
    const { container } = render(<TelaEntrar layout="cartao" paginaInteira={false} />);
    expect(container.querySelector(".neu-signin--card .neu-signin__split")).not.toBeNull();
    expect(container.querySelector(".neu-signin__split--left")).toBeNull();
    expect(container.querySelector(".neu-signin__visual")).not.toBeNull();
    expect(container.querySelector(".neu-signin__visual--photo")).toBeNull();
    expect(container.querySelector(".neu-signin__art")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll(".neu-signin__orb")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-signin__tile")).toHaveLength(3);
    expect(container.querySelector(".neu-signin__caption")).toBeNull();
  });

  it("layout cartão com foto: imagem com alt, véu, legenda e colunas trocadas", () => {
    const { container } = render(
      <TelaEntrar layout="cartao" ladoDaImagem="esquerda" imagem={{ src: "foto.jpg", alt: "Descrição" }} legenda={{ titulo: "Título", texto: "Texto" }} />,
    );
    expect(container.querySelector(".neu-signin__visual--photo")).not.toBeNull();
    expect(container.querySelector(".neu-signin__photo")?.getAttribute("alt")).toBe("Descrição");
    expect(container.querySelector(".neu-signin__art")).toBeNull();
    expect(container.querySelector(".neu-signin__split--left")).not.toBeNull();
    expect(container.querySelector(".neu-signin__caption strong")?.textContent).toBe("Título");
    expect(container.querySelector(".neu-signin__caption span")?.textContent).toBe("Texto");
    fireEvent.error(container.querySelector(".neu-signin__photo") as HTMLImageElement);
    expect((container.querySelector(".neu-signin__photo") as HTMLElement).style.display).toBe("none");
  });

  it("exemplos: a demonstração sem servidor carrega e depois mostra o erro; o cartão vem com foto e legenda", () => {
    vi.useFakeTimers();
    const { container } = render(
      <MemoryRouter>
        <ExemploEntrar />
      </MemoryRouter>,
    );
    expect(container.querySelector(".neu-signin-demo__nota")?.textContent).toMatch(/Demonstração sem servidor/);
    fireEvent.change(campos().email, { target: { value: "ana@empresa.com.br" } });
    fireEvent.change(campos().senha, { target: { value: "x" } });
    enviar();
    expect((screen.getByRole("button", { name: "Entrando…" }) as HTMLButtonElement).disabled).toBe(true);
    act(() => vi.advanceTimersByTime(1300));
    expect(screen.getByRole("alert").textContent).toContain("E-mail ou senha incorretos");
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("alert")).toBeNull();
    const cartao = render(<ExemploEntrarCartao />).container;
    expect(cartao.querySelector(".neu-signin__photo")).not.toBeNull();
    expect(cartao.querySelector(".neu-signin__caption strong")?.textContent).toMatch(/Impulsione/);
    expect(cartao.querySelector(".neu-signin__alt")?.textContent).toBe("Novo aqui? Criar uma conta");
  });
});
