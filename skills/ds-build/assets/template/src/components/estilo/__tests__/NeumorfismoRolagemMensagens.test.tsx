import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NeumorfismoRolagemMensagens, { RolagemMensagens } from "../NeumorfismoRolagemMensagens";
import { Mensagem } from "../NeumorfismoMensagens";
import { Balao } from "../NeumorfismoBaloes";

function medidas(el: HTMLElement, { scrollHeight, clientHeight, scrollTop }: { scrollHeight: number; clientHeight: number; scrollTop: number }) {
  Object.defineProperty(el, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(el, "clientHeight", { configurable: true, value: clientHeight });
  el.scrollTop = scrollTop;
}

describe("RolagemMensagens", () => {
  it("estrutura: log educado, área focável com nome, aria-busy e a tecla escondida enquanto está no fim", () => {
    const { container } = render(
      <RolagemMensagens ocupado rotulo="Conversa com o assistente" altura={300}>
        <Mensagem>
          <Balao>Oi</Balao>
        </Mensagem>
      </RolagemMensagens>,
    );
    const log = screen.getByRole("log");
    expect(log.getAttribute("aria-live")).toBe("polite");
    expect(log.getAttribute("aria-relevant")).toBe("additions");
    expect(log.getAttribute("aria-busy")).toBe("true");
    const vp = container.querySelector(".neu-mscroll__viewport") as HTMLElement;
    expect(vp.getAttribute("tabindex")).toBe("0");
    expect(vp.getAttribute("aria-label")).toBe("Conversa com o assistente");
    expect((container.querySelector(".neu-mscroll") as HTMLElement).style.height).toBe("300px");
    const tecla = container.querySelector(".neu-mscroll__btn") as HTMLElement;
    expect(tecla.getAttribute("tabindex")).toBe("-1");
    expect(tecla.getAttribute("aria-hidden")).toBe("true");
    expect(tecla.className).toBe("neu-mscroll__btn");
    expect(tecla.textContent).toBe("Ir para a mensagem mais recente");
  });

  it("filho com ancora vira uma âncora; os outros ficam como estão", () => {
    const { container } = render(
      <RolagemMensagens>
        <Mensagem ancora>
          <Balao>Pergunta</Balao>
        </Mensagem>
        <Mensagem>
          <Balao>Resposta</Balao>
        </Mensagem>
      </RolagemMensagens>,
    );
    expect(container.querySelectorAll("[data-scroll-anchor='true']")).toHaveLength(1);
    expect(container.querySelector("[data-scroll-anchor='true'] .neu-message--end, [data-scroll-anchor='true'] .neu-message--start")).toBeTruthy();
    expect(container.querySelectorAll(".neu-message")).toHaveLength(2);
  });

  it("subir mostra a tecla (no Tab); voltar ao fim a esconde; clicar nela leva ao fim", () => {
    const { container } = render(
      <RolagemMensagens>
        <Mensagem>
          <Balao>Oi</Balao>
        </Mensagem>
      </RolagemMensagens>,
    );
    const vp = container.querySelector(".neu-mscroll__viewport") as HTMLElement;
    const tecla = container.querySelector(".neu-mscroll__btn") as HTMLElement;
    medidas(vp, { scrollHeight: 1000, clientHeight: 300, scrollTop: 100 });
    fireEvent.scroll(vp);
    expect(tecla.className).toContain("neu-mscroll__btn--on");
    expect(tecla.getAttribute("tabindex")).toBe("0");
    expect(tecla.getAttribute("aria-hidden")).toBeNull();
    const rolar = vi.fn();
    vp.scrollTo = rolar as unknown as typeof vp.scrollTo;
    fireEvent.click(tecla);
    expect(rolar).toHaveBeenCalledWith(expect.objectContaining({ top: 1000 }));
    expect(tecla.className).not.toContain("--on");
    medidas(vp, { scrollHeight: 1000, clientHeight: 300, scrollTop: 100 });
    fireEvent.scroll(vp);
    expect(tecla.className).toContain("--on");
    medidas(vp, { scrollHeight: 1000, clientHeight: 300, scrollTop: 690 });
    fireEvent.scroll(vp);
    expect(tecla.className).not.toContain("--on");
    expect(tecla.getAttribute("tabindex")).toBe("-1");
  });
});

describe("NeumorfismoRolagemMensagens", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const montar = () =>
    render(
      <TooltipProvider>
        <NeumorfismoRolagemMensagens />
      </TooltipProvider>,
    );

  it("cartão: começa com a primeira troca, a próxima pergunta na fila e o envio ligado", () => {
    const { container } = montar();
    expect(container.querySelectorAll(".neu-message--end")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-message--start")).toHaveLength(1);
    expect(container.querySelector(".neu-composer__text")?.textContent).toContain("Certo, mas quando alguém envia");
    expect(screen.getByRole("button", { name: "Enviar" }).hasAttribute("disabled")).toBe(false);
    expect(container.querySelector(".neu-md code")?.textContent).toBe("RolagemMensagens");
  });

  it("enviar: a pergunta entra, aparece \"Pensando…\", a resposta chega com cursor e o registro fica ocupado até terminar", () => {
    const { container } = montar();
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(container.querySelectorAll(".neu-message--end")).toHaveLength(2);
    expect(screen.getByRole("log").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("button", { name: "Enviar" }).hasAttribute("disabled")).toBe(true);
    act(() => void vi.advanceTimersByTime(700));
    expect(screen.getByRole("status").textContent).toBe("Pensando…");
    act(() => void vi.advanceTimersByTime(35));
    expect(container.querySelector(".neu-caret")).toBeTruthy();
    act(() => void vi.advanceTimersByTime(10000));
    expect(container.querySelector(".neu-caret")).toBeNull();
    expect(screen.getByRole("log").getAttribute("aria-busy")).toBeNull();
    expect(container.querySelectorAll(".neu-message--start")).toHaveLength(2);
    expect(container.querySelector(".neu-composer__text")?.textContent).toContain("E se a pessoa tiver subido");
  });

  it("reiniciar volta à primeira troca; esgotada a fila, o compositor avisa", () => {
    const { container } = montar();
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
      act(() => void vi.advanceTimersByTime(10000));
    }
    expect(container.querySelector(".neu-composer__text")?.textContent).toBe("Nenhuma mensagem na fila. Reinicie a conversa.");
    expect(screen.getByRole("button", { name: "Enviar" }).hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Reiniciar conversa" }));
    expect(container.querySelectorAll(".neu-message--end")).toHaveLength(1);
    expect(container.querySelector(".neu-composer__text")?.textContent).toContain("Certo, mas quando alguém envia");
  });
});
