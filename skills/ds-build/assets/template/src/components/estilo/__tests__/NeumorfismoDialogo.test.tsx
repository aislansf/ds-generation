import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import NeumorfismoDialogo, { Dialogo } from "../NeumorfismoDialogo";

const camada = () => document.querySelector(".neu-dialog-layer");
const abrir = () => fireEvent.click(screen.getByRole("button", { name: "Abrir diálogo" }));

describe("NeumorfismoDialogo", () => {
  it("o gatilho e a prévia estática do pacote, sem diálogo real aberto", () => {
    const { container } = render(<NeumorfismoDialogo />);
    const gatilho = screen.getByRole("button", { name: "Abrir diálogo" });
    expect(gatilho.getAttribute("aria-haspopup")).toBe("dialog");
    expect(gatilho.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelectorAll(".neu-dialog--inline")).toHaveLength(1);
    const estatico = screen.getByRole("dialog", { name: "Editar perfil" });
    expect(estatico.tagName).toBe("FORM");
    expect(estatico.getAttribute("aria-modal")).toBeNull();
    expect(camada()).toBeNull();
    expect(screen.getByText("Nenhuma alteração salva.")).toBeTruthy();
  });

  it("abrir leva o foco ao primeiro campo, trava a rolagem e liga nome e descrição", () => {
    render(<NeumorfismoDialogo />);
    abrir();
    const real = camada()!.querySelector(".neu-dialog") as HTMLElement;
    expect(real.getAttribute("aria-modal")).toBe("true");
    expect(real.getAttribute("aria-labelledby")).toBeTruthy();
    expect(real.getAttribute("aria-describedby")).toBeTruthy();
    expect((document.activeElement as HTMLInputElement).value).toBe("Ana Ribeiro");
    expect(document.body.style.overflow).toBe("hidden");
    expect(real.className).toContain("neu-dialog--sm");
  });

  it("Esc, o ✕ e o clique fora fecham, e o foco volta ao gatilho", () => {
    render(<NeumorfismoDialogo />);
    const gatilho = screen.getByRole("button", { name: "Abrir diálogo" });
    gatilho.focus();
    abrir();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(camada()).toBeNull();
    expect(document.activeElement).toBe(gatilho);
    expect(document.body.style.overflow).toBe("");

    abrir();
    fireEvent.click(camada()!.querySelector("button[aria-label='Fechar']") as HTMLElement);
    expect(camada()).toBeNull();

    abrir();
    fireEvent.click(camada()!.querySelector(".neu-dialog__body") as HTMLElement);
    expect(camada()).not.toBeNull();
    fireEvent.click(camada() as HTMLElement);
    expect(camada()).toBeNull();
  });

  it("Tab e Shift+Tab ficam presos no diálogo", () => {
    render(<NeumorfismoDialogo />);
    abrir();
    const focaveis = Array.from(camada()!.querySelectorAll<HTMLElement>("input, button"));
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    ultimo.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(primeiro);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(ultimo);
  });

  it("salvar manda os dados do formulário, fecha e mostra o resultado", () => {
    render(<NeumorfismoDialogo />);
    abrir();
    const campo = camada()!.querySelector("input[name='nome']") as HTMLInputElement;
    fireEvent.change(campo, { target: { value: "Bia Souza" } });
    fireEvent.submit(camada()!.querySelector("form") as HTMLElement);
    expect(camada()).toBeNull();
    expect(screen.getByText("Salvo: Bia Souza · @anaribeiro")).toBeTruthy();
  });

  it("aoEnviar devolvendo false mantém aberto", () => {
    render(<Dialogo abertoInicial titulo="Validar" aoEnviar={() => false}><input name="x" /></Dialogo>);
    fireEvent.submit(camada()!.querySelector("form") as HTMLElement);
    expect(camada()).not.toBeNull();
  });

  it("dispensavel={false} bloqueia Esc e o clique fora; o ✕ ainda fecha", () => {
    render(<Dialogo abertoInicial dispensavel={false} titulo="Obrigatório"><p>Leia antes de continuar.</p></Dialogo>);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(camada()).not.toBeNull();
    fireEvent.click(camada() as HTMLElement);
    expect(camada()).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(camada()).toBeNull();
  });

  it("rodape, rolagem, ✕ e foco inicial configuráveis; sem envio não há rodapé padrão", () => {
    const aoMudar = vi.fn();
    const { container } = render(
      <Dialogo abertoInicial aoMudarAberto={aoMudar} titulo="Livre" rolagem mostrarFechar={false} gatilho={<Button type="button">Abrir diálogo</Button>}>
        <p>Corpo longo</p>
      </Dialogo>,
    );
    expect(container.querySelector(".neu-dialog__body--scroll")).toBeTruthy();
    expect(container.querySelector(".neu-dialog__footer")).toBeNull();
    expect(container.querySelector(".neu-dialog__close")).toBeNull();
    expect(container.querySelector(".neu-dialog")?.tagName).toBe("DIV");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(aoMudar).toHaveBeenCalledWith(false);
  });
});
