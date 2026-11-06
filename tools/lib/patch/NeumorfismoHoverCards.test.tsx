import { afterEach, beforeAll, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoHoverCards, { AvatarPerfil, CartaoPrevia } from "../NeumorfismoHoverCards";

beforeAll(() => {
  // O Radix posiciona o cartão com ResizeObserver, que o jsdom não traz
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  vi.useRealTimers();
});

// O Radix aplica o atraso de abertura também ao foco do teclado
const esperar = (ms = 350) => act(async () => { vi.advanceTimersByTime(ms); });
const cartao = () => document.querySelector(".neu-hovercard__panel") as HTMLElement | null;

describe("NeumorfismoHoverCards", () => {
  it("dois links como gatilho, sem cartão aberto", () => {
    render(<NeumorfismoHoverCards />);
    const links = document.querySelectorAll("button.neu-hovercard__link");
    expect(Array.from(links).map((l) => l.textContent)).toEqual(["@neumorphic-ui", "Carla Souza"]);
    expect(cartao()).toBeNull();
    expect(screen.getByText(/Atendimento registrado por/)).toBeTruthy();
  });

  it("o foco do teclado abre o cartão, que é um tooltip ligado ao link por aria-describedby", async () => {
    vi.useFakeTimers();
    render(<NeumorfismoHoverCards />);
    const link = screen.getByRole("button", { name: "@neumorphic-ui" });
    expect(link.getAttribute("aria-describedby")).toBeNull();
    fireEvent.focus(link);
    await esperar();
    const c = cartao()!;
    expect(c.getAttribute("role")).toBe("tooltip");
    expect(c.style.width).toBe("300px");
    expect(link.getAttribute("aria-describedby")).toBe(c.id);
    expect(c.querySelector(".neu-profile__name")?.textContent).toBe("@neumorphic-ui");
    expect(c.querySelector(".neu-profile__meta")?.textContent).toContain("Desde dezembro de 2021");
    expect(c.querySelector("button, a, input")).toBeNull();
  });

  it("perder o foco fecha; Esc fecha", async () => {
    vi.useFakeTimers();
    render(<NeumorfismoHoverCards />);
    const link = screen.getByRole("button", { name: "@neumorphic-ui" });
    fireEvent.focus(link);
    await esperar();
    expect(cartao()).not.toBeNull();
    fireEvent.blur(link);
    await esperar(200);
    expect(cartao()).toBeNull();

    fireEvent.focus(link);
    await esperar();
    expect(cartao()).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    await esperar(200);
    expect(cartao()).toBeNull();
  });

  it("o mouse abre depois do atraso e o segundo cartão tem 260px e o avatar com status", async () => {
    vi.useFakeTimers();
    render(<NeumorfismoHoverCards />);
    const link = screen.getByRole("button", { name: "Carla Souza" });
    fireEvent.pointerEnter(link, { pointerType: "mouse" });
    expect(cartao()).toBeNull();
    await esperar();
    expect(cartao()!.style.width).toBe("260px");
    expect(screen.getByRole("img", { name: "Carla Souza (online)" })).toBeTruthy();
    expect(cartao()!.querySelector(".neu-avatar__badge--online")).toBeTruthy();
  });

  it("o avatar tira as iniciais do nome, aceita tom e tamanho e nomeia o status", () => {
    const { container } = render(
      <>
        <AvatarPerfil nome="Carla Souza" />
        <AvatarPerfil nome="Neumorphic UI" iniciais="NU" tom="accent" tamanho="lg" />
        <AvatarPerfil nome="Ana" status="busy" />
      </>,
    );
    const [a, b, c] = Array.from(container.querySelectorAll(".neu-avatar"));
    expect(a.textContent).toBe("CS");
    expect(b.className).toContain("neu-avatar--lg");
    expect(b.querySelector(".neu-avatar__fallback--accent")?.textContent).toBe("NU");
    expect(c.getAttribute("aria-label")).toBe("Ana (ocupado)");
  });

  it("alinhamento e lado configuráveis", async () => {
    vi.useFakeTimers();
    render(<CartaoPrevia gatilho="Link" lado="top" alinhamento="end"><p>conteúdo</p></CartaoPrevia>);
    fireEvent.focus(screen.getByRole("button", { name: "Link" }));
    await esperar();
    expect(cartao()!.getAttribute("data-side")).toBe("top");
    expect(cartao()!.getAttribute("data-align")).toBe("end");
  });
});
