import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoCards, { Cartao } from "../NeumorfismoCards";

describe("NeumorfismoCards", () => {
  it("vitrine: os seis cartões do pacote, um de cada forma", () => {
    const { container } = render(<NeumorfismoCards />);
    expect(container.querySelectorAll(".neu-card")).toHaveLength(6);
    expect(container.querySelectorAll(".neu-card--sectioned")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-card--featured")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-card--inset")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-card--interactive")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-card--primary")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /Card Interativo/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Explorar Ação" })).toBeTruthy();
  });

  it("em seções: título com LED neutro sobre um fio, corpo, tecla de ação e meta no rodapé", () => {
    const aoAcao = vi.fn();
    const { container } = render(
      <Cartao titulo="Básico" rotuloAcao="Ver mais" metaRodape="Base" aoAcao={aoAcao}>
        Corpo
      </Cartao>,
    );
    expect(container.querySelector(".neu-card__head--ruled h4")?.textContent).toBe("Básico");
    expect(container.querySelector(".neu-dot--neutral")).toBeTruthy();
    expect(container.querySelector(".neu-card__body .neu-card__text")?.textContent).toBe("Corpo");
    const link = screen.getByRole("link", { name: /Ver mais/ });
    expect(link.getAttribute("href")).toBe("#");
    expect(fireEvent.click(link)).toBe(false);
    expect(aoAcao).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".neu-card__foot .neu-card__meta")?.textContent).toBe("Base");
  });

  it("em seções: com hrefAcao o link navega, e o ponto muda de cor", () => {
    const { container } = render(<Cartao titulo="A" rotuloAcao="Abrir" hrefAcao="/x" ponto="sucesso" />);
    expect(screen.getByRole("link", { name: /Abrir/ }).getAttribute("href")).toBe("/x");
    expect(container.querySelector(".neu-dot--success")).toBeTruthy();
  });

  it("destaque: etiqueta, LED que pulsa decorativo, título, texto e botão branco", () => {
    const aoAcao = vi.fn();
    const { container } = render(
      <Cartao variante="primario" etiqueta="Destaque" titulo="Grande" rotuloAcao="Ir" metaRodape="Marca" aoAcao={aoAcao}>
        Texto
      </Cartao>,
    );
    expect(container.querySelector(".neu-card__tag")?.textContent).toBe("Destaque");
    expect(container.querySelector(".neu-card__pulse")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-card__featured-title")?.textContent).toBe("Grande");
    expect(container.querySelector(".neu-card__featured-text")?.textContent).toBe("Texto");
    fireEvent.click(screen.getByRole("button", { name: "Ir" }));
    expect(aoAcao).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".neu-card__foot--featured .neu-card__meta")?.textContent).toBe("Marca");
  });

  it("primário simples sem etiqueta, ação nem meta fica na placa comum", () => {
    const { container } = render(<Cartao variante="primario" titulo="Simples">Só texto</Cartao>);
    expect(container.querySelector(".neu-card--primary")).toBeTruthy();
    expect(container.querySelector(".neu-card--featured")).toBeNull();
  });

  it("afundado: chips em pílulas convexas, com o tom da marca no que importa", () => {
    const { container } = render(<Cartao variante="afundado" titulo="Poço" meta="neu-inset" chips={["A", { rotulo: "B", tom: "marca" }]} />);
    const chips = [...container.querySelectorAll(".neu-card__chip")];
    expect(chips.map((c) => c.className)).toEqual(["neu-card__chip neu-tone-neutral", "neu-card__chip neu-tone-accent"]);
    expect(container.querySelector(".neu-card__meta")?.textContent).toBe("neu-inset");
  });

  it("interativo: role=button focável, Enter e Espaço disparam o clique, e a linha do link tem seta decorativa", () => {
    const aoClicar = vi.fn();
    const { container } = render(<Cartao interativo titulo="Módulo" ponto="sucesso" rotuloLink="Acessar" aoClicar={aoClicar}>Texto</Cartao>);
    const b = screen.getByRole("button", { name: /Módulo/ });
    expect(b.getAttribute("tabindex")).toBe("0");
    fireEvent.click(b);
    fireEvent.keyDown(b, { key: "Enter" });
    fireEvent.keyDown(b, { key: " " });
    fireEvent.keyDown(b, { key: "a" });
    expect(aoClicar).toHaveBeenCalledTimes(3);
    expect(container.querySelector(".neu-card__arrow")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-card__link span")?.textContent).toBe("Acessar");
  });

  it("cartão comum não é botão nem recebe foco; o texto solto vira parágrafo e um nó fica como está", () => {
    const { container } = render(
      <Cartao variante="plano" titulo="Comum">
        <span data-testid="no">nó</span>
      </Cartao>,
    );
    const c = container.firstElementChild as HTMLElement;
    expect(c.className).toBe("neu-card neu-card--flat");
    expect(c.getAttribute("role")).toBeNull();
    expect(c.getAttribute("tabindex")).toBeNull();
    expect(screen.getByTestId("no").closest(".neu-card__text")).toBeNull();
  });
});
