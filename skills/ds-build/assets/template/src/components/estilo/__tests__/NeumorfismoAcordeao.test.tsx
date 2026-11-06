import { describe, it, expect } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import NeumorfismoAcordeao from "../NeumorfismoAcordeao";

describe("NeumorfismoAcordeao", () => {
  it("cartão Accordion: duas disposições, cada uma com o primeiro item aberto", () => {
    const { container } = render(<NeumorfismoAcordeao />);
    expect(container.querySelector(".neu-accordion")).toBeTruthy();
    expect(container.querySelector(".neu-accordion-g")).toBeTruthy();
    const gatilhos = container.querySelectorAll("button[aria-expanded]");
    expect(gatilhos).toHaveLength(6);
    expect(container.querySelectorAll('button[aria-expanded="true"]')).toHaveLength(2);
  });

  it("cada gatilho aponta para o painel aberto, que é uma região rotulada por ele", () => {
    const { container } = render(<NeumorfismoAcordeao />);
    const gatilhos = [...container.querySelectorAll<HTMLElement>('button[aria-expanded="true"]')];
    for (const g of gatilhos) {
      const painel = container.querySelector(`#${CSS.escape(g.getAttribute("aria-controls") ?? "")}`);
      expect(painel?.getAttribute("role")).toBe("region");
      expect(painel?.getAttribute("aria-labelledby")).toBe(g.id);
    }
  });

  it("um item aberto por vez; clicar no aberto o fecha e o painel some", () => {
    const { container } = render(<NeumorfismoAcordeao />);
    const cartoes = [...container.querySelectorAll<HTMLElement>(".neu-accordion button[aria-expanded]")];
    expect(cartoes[0].getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(cartoes[2]);
    expect(cartoes[0].getAttribute("aria-expanded")).toBe("false");
    expect(cartoes[2].getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelectorAll(".neu-accordion .neu-accordion__panel")).toHaveLength(1);
    fireEvent.click(cartoes[2]);
    expect(container.querySelectorAll(".neu-accordion .neu-accordion__panel")).toHaveLength(0);
    expect(container.querySelector('.neu-accordion [data-open="true"] .neu-accordion__chev')).toBeNull();
  });

  it("as duas disposições são independentes", () => {
    const { container } = render(<NeumorfismoAcordeao />);
    const agrupados = [...container.querySelectorAll<HTMLElement>(".neu-accordion-g button[aria-expanded]")];
    fireEvent.click(agrupados[1]);
    expect(agrupados[1].getAttribute("aria-expanded")).toBe("true");
    expect(agrupados[0].getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector(".neu-accordion button[aria-expanded='true']")).toBeTruthy();
  });
});
