import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { TelaVerificacao, ExemploVerificacao } from "../NeumorfismoTwoFactor";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const celulas = () => [...document.querySelectorAll<HTMLInputElement>(".neu-code__cell")];
const digitar = (i: number, d: string) => fireEvent.change(celulas()[i], { target: { value: d } });
const preencher = (codigo: string) => [...codigo].forEach((d, i) => digitar(i, d));
// A contagem usa um setTimeout por segundo: cada segundo precisa do seu próprio act para o React reagendar
const passar = (segundos: number) => { for (let i = 0; i < segundos; i++) act(() => { vi.advanceTimersByTime(1000); }); };
const enviar = () => fireEvent.submit(document.querySelector("form") as HTMLFormElement);

describe("NeumorfismoTwoFactor", () => {
  it("estrutura: marca pequena, selo do escudo, título, instrução com o destino, seis células e rodapé", () => {
    const { container } = render(<TelaVerificacao paginaInteira={false} nomeDaMarca="Acme" destino="a•••@exemplo.com" />);
    expect(container.querySelector("section.neu-signin.neu-2fa.neu-signin--inline")).not.toBeNull();
    expect(container.querySelector(".neu-signin__mark--sm")).not.toBeNull();
    expect(container.querySelector(".neu-2fa__badge svg")).not.toBeNull();
    expect(container.querySelector(".neu-2fa__badge")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("heading", { name: "Verificação em duas etapas" })).toBeTruthy();
    expect(container.querySelector(".neu-signin__sub")?.textContent).toBe("Insira o código de 6 dígitos enviado para o seu e-mail ou aplicativo autenticador. Enviado para a•••@exemplo.com.");
    expect(container.querySelector(".neu-2fa__dest b")?.textContent).toBe("a•••@exemplo.com");
    expect(celulas()).toHaveLength(6);
    expect(container.querySelector(".neu-signin__foot")?.textContent).toBe(`© ${new Date().getFullYear()} Acme`);
  });

  it("células: rótulos, grupo descrito pela instrução, uma-vez-código só na primeira e teclado numérico", () => {
    render(<TelaVerificacao />);
    const grupo = screen.getByRole("group", { name: "Código de 6 dígitos" });
    expect(document.getElementById(grupo.getAttribute("aria-describedby")?.split(" ")[0] ?? "")?.className).toContain("neu-signin__sub");
    expect(celulas().map((c) => c.getAttribute("aria-label"))).toEqual(["Dígito 1 de 6", "Dígito 2 de 6", "Dígito 3 de 6", "Dígito 4 de 6", "Dígito 5 de 6", "Dígito 6 de 6"]);
    expect(celulas().map((c) => c.autocomplete)).toEqual(["one-time-code", "off", "off", "off", "off", "off"]);
    expect(celulas().every((c) => c.getAttribute("inputmode") === "numeric")).toBe(true);
    expect(celulas()[0].maxLength).toBe(6);
    expect(celulas()[1].maxLength).toBe(1);
  });

  it("foco inicial na primeira célula, a não ser que focoAutomatico seja falso", () => {
    const { unmount } = render(<TelaVerificacao />);
    expect(document.activeElement).toBe(celulas()[0]);
    unmount();
    (document.activeElement as HTMLElement | null)?.blur();
    render(<TelaVerificacao focoAutomatico={false} />);
    expect(document.activeElement).not.toBe(celulas()[0]);
  });

  it("digitar avança o foco; não-dígito é ignorado; Backspace numa célula vazia apaga a anterior e volta", () => {
    render(<TelaVerificacao envioAutomatico={false} />);
    digitar(0, "1");
    expect(document.activeElement).toBe(celulas()[1]);
    digitar(1, "x");
    expect(celulas()[1].value).toBe("");
    digitar(1, "2");
    expect(celulas().map((c) => c.value).join("")).toBe("12");
    expect(document.activeElement).toBe(celulas()[2]);
    fireEvent.keyDown(celulas()[2], { key: "Backspace" });
    expect(celulas()[1].value).toBe("");
    expect(document.activeElement).toBe(celulas()[1]);
  });

  it("setas, Home e End andam entre as células", () => {
    render(<TelaVerificacao />);
    fireEvent.keyDown(celulas()[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(celulas()[1]);
    fireEvent.keyDown(celulas()[1], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(celulas()[0]);
    fireEvent.keyDown(celulas()[0], { key: "End" });
    expect(document.activeElement).toBe(celulas()[5]);
    fireEvent.keyDown(celulas()[5], { key: "Home" });
    expect(document.activeElement).toBe(celulas()[0]);
  });

  it("colar o código inteiro, com traço, preenche a partir da célula; número longo digitado também", () => {
    render(<TelaVerificacao envioAutomatico={false} />);
    fireEvent.paste(celulas()[0], { clipboardData: { getData: () => "654-321" } });
    expect(celulas().map((c) => c.value).join("")).toBe("654321");
    expect(document.activeElement).toBe(celulas()[5]);
    fireEvent.paste(celulas()[2], { clipboardData: { getData: () => "99" } });
    expect(celulas().map((c) => c.value).join("")).toBe("659921");
    fireEvent.change(celulas()[0], { target: { value: "111222" } });
    expect(celulas().map((c) => c.value).join("")).toBe("111222");
  });

  it("o último dígito envia sozinho; com envioAutomatico falso, só ao enviar", () => {
    const aoEnviar = vi.fn();
    const { unmount } = render(<TelaVerificacao aoEnviar={aoEnviar} />);
    preencher("123456");
    expect(aoEnviar).toHaveBeenCalledTimes(1);
    expect(aoEnviar).toHaveBeenCalledWith("123456");
    unmount();
    aoEnviar.mockClear();
    render(<TelaVerificacao aoEnviar={aoEnviar} envioAutomatico={false} />);
    preencher("123456");
    expect(aoEnviar).not.toHaveBeenCalled();
    enviar();
    expect(aoEnviar).toHaveBeenCalledWith("123456");
  });

  it("código incompleto: mensagem, células vermelhas e foco na primeira vazia; corrigir limpa o erro", () => {
    const aoEnviar = vi.fn();
    const { container } = render(<TelaVerificacao aoEnviar={aoEnviar} />);
    preencher("12");
    enviar();
    expect(screen.getByRole("alert").textContent).toBe("Digite os 6 dígitos do código.");
    expect(container.querySelector(".neu-code--invalid")).not.toBeNull();
    expect(celulas()[0].getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(celulas()[2]);
    expect(aoEnviar).not.toHaveBeenCalled();
    digitar(2, "3");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("carregando desativa células e botão; erro do servidor mostra o aviso, limpa o código e devolve o foco", () => {
    const { rerender } = render(<TelaVerificacao carregando />);
    expect(celulas().every((c) => c.disabled)).toBe(true);
    const botao = screen.getByRole("button", { name: "Verificando…" }) as HTMLButtonElement;
    expect(botao.disabled).toBe(true);
    expect(botao.getAttribute("aria-busy")).toBe("true");
    rerender(<TelaVerificacao />);
    preencher("12");
    const fechar = vi.fn();
    rerender(<TelaVerificacao erro="Não confere." aoFecharErro={fechar} />);
    expect(screen.getByRole("alert").textContent).toContain("Código incorreto");
    expect(celulas().map((c) => c.value).join("")).toBe("");
    expect(document.activeElement).toBe(celulas()[0]);
    expect(document.querySelector(".neu-code--invalid")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(fechar).toHaveBeenCalledTimes(1);
  });

  it("reenvio: contagem regressiva em mono, depois o link, que reinicia e avisa", () => {
    const aoReenviar = vi.fn();
    const { container } = render(<TelaVerificacao aoReenviar={aoReenviar} reenviarEm={3} />);
    expect(container.querySelector(".neu-2fa__wait")?.textContent).toBe("Reenviar em 0:03");
    expect(container.querySelector(".neu-signin__alt")?.getAttribute("aria-live")).toBe("polite");
    expect(screen.queryByRole("button", { name: "Reenviar código" })).toBeNull();
    passar(1);
    expect(container.querySelector(".neu-2fa__wait b")?.textContent).toBe("0:02");
    passar(2);
    const link = screen.getByRole("button", { name: "Reenviar código" });
    preencher("12");
    fireEvent.click(link);
    expect(aoReenviar).toHaveBeenCalledTimes(1);
    expect(celulas().map((c) => c.value).join("")).toBe("");
    expect(container.querySelector(".neu-2fa__wait")?.textContent).toBe("Reenviar em 0:03");
    expect(render(<TelaVerificacao reenviarEm={90} />).container.querySelector(".neu-2fa__wait b")?.textContent).toBe("1:30");
  });

  it("voltar, aviso de sucesso, tom e tamanho do código", () => {
    const voltar = vi.fn();
    const { container, rerender } = render(<TelaVerificacao voltar={{ onClick: voltar }} aviso="Enviamos um novo código." />);
    fireEvent.click(screen.getByRole("link", { name: "Voltar para o login" }));
    expect(voltar).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".neu-2fa__backlink svg")).not.toBeNull();
    expect(screen.getByRole("status").textContent).toContain("Enviamos um novo código.");
    expect(screen.getByRole("button", { name: "Verificar código" }).getAttribute("data-variant")).toBe("secondary");
    rerender(<TelaVerificacao tom="marca" voltar={false} rodape={false} tamanho={4} />);
    expect(screen.getByRole("button", { name: "Verificar código" }).getAttribute("data-variant")).toBe("default");
    expect(container.querySelector(".neu-2fa__back")).toBeNull();
    expect(container.querySelector(".neu-signin__foot")).toBeNull();
    expect(celulas()).toHaveLength(4);
    expect(screen.getByRole("group", { name: "Código de 4 dígitos" })).toBeTruthy();
  });

  it("exemplo: 123456 é aceito; outro código mostra o erro; reenviar mostra o aviso", () => {
    const { container } = render(<ExemploVerificacao />);
    expect(container.querySelector(".neu-signin-demo__nota")?.textContent).toMatch(/123456/);
    preencher("123456");
    expect(screen.getByRole("button", { name: "Verificando…" })).toBeTruthy();
    act(() => vi.advanceTimersByTime(1100));
    expect(screen.getByRole("status").textContent).toContain("Código verificado");
    preencher("000000");
    act(() => vi.advanceTimersByTime(1100));
    expect(screen.getByRole("alert").textContent).toContain("não confere ou expirou");
    passar(31);
    fireEvent.click(screen.getByRole("button", { name: "Reenviar código" }));
    expect(screen.getByRole("status").textContent).toContain("Enviamos um novo código.");
  });
});
