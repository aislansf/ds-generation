import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAbas from "../NeumorfismoAbas";

describe("NeumorfismoAbas", () => {
  it("cartão Tabs: traz as quatro variantes, cada uma com uma aba selecionada", () => {
    const { container } = render(<NeumorfismoAbas />);
    expect(container.querySelectorAll('[role="tablist"]')).toHaveLength(4);
    expect(container.querySelectorAll('[role="tab"][aria-selected="true"]')).toHaveLength(4);
    expect(container.querySelector(".neu-tabs--line")).toBeTruthy();
    expect(container.querySelector(".neu-tabs--segmented")).toBeTruthy();
    expect(container.querySelector(".neu-tabs--card")).toBeTruthy();
  });

  it("só a aba ativa entra na ordem do Tab e o painel é rotulado por ela", () => {
    const { container } = render(<NeumorfismoAbas />);
    for (const lista of container.querySelectorAll('[role="tablist"]')) {
      const abas = [...lista.querySelectorAll<HTMLElement>('[role="tab"]')];
      expect(abas.filter((a) => a.tabIndex === 0)).toHaveLength(1);
    }
    for (const painel of container.querySelectorAll('[role="tabpanel"]')) {
      const aba = container.querySelector(`#${CSS.escape(painel.getAttribute("aria-labelledby") ?? "")}`);
      expect(aba?.getAttribute("aria-selected")).toBe("true");
    }
  });

  it("Home, End e as setas movem e selecionam (a seta dá a volta)", () => {
    const { container } = render(<NeumorfismoAbas />);
    const lista = container.querySelector('[role="tablist"]') as HTMLElement;
    const abas = () => [...lista.querySelectorAll<HTMLElement>('[role="tab"]')];
    fireEvent.keyDown(lista, { key: "End" });
    expect(abas()[2].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(lista, { key: "ArrowRight" });
    expect(abas()[0].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(lista, { key: "ArrowLeft" });
    expect(abas()[2].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(lista, { key: "Home" });
    expect(abas()[0].getAttribute("aria-selected")).toBe("true");
  });

  it("no card, trocar de aba troca o painel rico", () => {
    render(<NeumorfismoAbas />);
    expect(screen.getByText("Detalhes operacionais")).toBeTruthy();
    const historicos = screen.getAllByRole("tab", { name: "Histórico" });
    expect(historicos).toHaveLength(4);
    fireEvent.click(historicos[3]);
    expect(screen.getByText("Histórico e versões")).toBeTruthy();
    expect(screen.queryByText("Detalhes operacionais")).toBeNull();
  });
});
