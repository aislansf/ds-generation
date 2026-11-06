import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoModais, { Modal } from "../NeumorfismoModais";

describe("NeumorfismoModais", () => {
  it("duas prévias embutidas (plano e convexo) e nenhum diálogo real aberto", () => {
    const { container } = render(<NeumorfismoModais />);
    expect(container.querySelectorAll(".neu-modal--inline")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-modal--convex")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-backdrop")).toHaveLength(0);
    expect(screen.getAllByRole("dialog")).toHaveLength(2);
    expect(screen.getByRole("dialog", { name: "Confirmar publicação de tokens" })).toBeTruthy();
    expect(screen.getByText("Tokens do tema")).toBeTruthy();
    expect(screen.getByText("Paleta ativa")).toBeTruthy();
  });

  it("a prévia embutida não é modal; o diálogo real é, com nome e descrição", () => {
    render(<NeumorfismoModais />);
    for (const d of screen.getAllByRole("dialog")) expect(d.getAttribute("aria-modal")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Abrir Modal" }));
    const real = screen.getAllByRole("dialog").find((d) => d.getAttribute("aria-modal") === "true")!;
    expect(real.getAttribute("aria-labelledby")).toBeTruthy();
    expect(real.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.getElementById(real.getAttribute("aria-labelledby")!)?.textContent).toBe("Confirmar ação");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("ao abrir o foco vai ao ✕; Esc fecha, a rolagem destrava e o foco volta ao botão que abriu", () => {
    render(<NeumorfismoModais />);
    const gatilho = screen.getByRole("button", { name: "Abrir Modal" });
    gatilho.focus();
    fireEvent.click(gatilho);
    const fechar = document.querySelector(".neu-backdrop .neu-modal__close") as HTMLElement;
    expect(document.activeElement).toBe(fechar);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".neu-backdrop")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(gatilho);
  });

  it("Tab e Shift+Tab ficam presos no diálogo", () => {
    render(<NeumorfismoModais />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir Modal" }));
    const botoes = Array.from(document.querySelectorAll<HTMLElement>(".neu-backdrop button"));
    const primeiro = botoes[0];
    const ultimo = botoes[botoes.length - 1];
    ultimo.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(primeiro);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(ultimo);
  });

  it("o clique no véu fecha; o clique dentro do diálogo não", () => {
    render(<NeumorfismoModais />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir Modal" }));
    fireEvent.click(document.querySelector(".neu-backdrop .neu-modal__body") as HTMLElement);
    expect(document.querySelector(".neu-backdrop")).not.toBeNull();
    fireEvent.click(document.querySelector(".neu-backdrop") as HTMLElement);
    expect(document.querySelector(".neu-backdrop")).toBeNull();
  });

  it("Confirmar e Cancelar fecham; o tom perigo vira alertdialog com botão destrutivo", () => {
    const aoConfirmar = vi.fn();
    const aoFechar = vi.fn();
    render(<Modal aberto tom="danger" titulo="Excluir" aoFechar={aoFechar} aoConfirmar={aoConfirmar} rotuloConfirmar="Excluir tudo">Isso não pode ser desfeito.</Modal>);
    expect(screen.getByRole("alertdialog", { name: "Excluir" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Excluir tudo" }));
    expect(aoConfirmar).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });

  it("refFocoInicial recebe o foco; rodape={false} tira os botões; selo={false} tira o selo", () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <Modal aberto titulo="Com campo" selo={false} rodape={false} refFocoInicial={ref}>
        <button ref={ref} type="button">Primeiro campo</button>
      </Modal>,
    );
    expect(document.activeElement).toBe(ref.current);
    expect(container.querySelector(".neu-modal__foot")).toBeNull();
    expect(container.querySelector(".neu-modal__badge")).toBeNull();
  });
});
