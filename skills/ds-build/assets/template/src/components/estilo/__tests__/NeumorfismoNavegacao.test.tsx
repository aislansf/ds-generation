import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NeumorfismoAccordion, NeumorfismoSteps, NeumorfismoTabs } from "../NeumorfismoNavegacao";

describe("NeumorfismoNavegacao", () => {
  it("abas: quatro variantes, cada uma com uma aba selecionada e o painel ligado a ela", () => {
    const { container } = render(<NeumorfismoTabs />);
    expect(container.querySelectorAll('[role="tablist"]')).toHaveLength(4);
    expect(container.querySelectorAll('[role="tab"][aria-selected="true"]')).toHaveLength(4);
    for (const painel of container.querySelectorAll('[role="tabpanel"]')) {
      const aba = container.querySelector(`#${CSS.escape(painel.getAttribute("aria-labelledby") ?? "")}`);
      expect(aba?.getAttribute("aria-selected")).toBe("true");
    }
    expect(container.querySelector(".neu-tabs--card")).toBeTruthy();
    expect(container.querySelector(".neu-tabs--segmented")).toBeTruthy();
  });

  it("abas: clicar e usar as setas troca a aba ativa", () => {
    render(<NeumorfismoTabs />);
    const [primeira, segunda] = screen.getAllByRole("tab", { name: /Visão geral|Detalhes/ });
    fireEvent.click(segunda);
    expect(segunda.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(segunda.parentElement as HTMLElement, { key: "ArrowLeft" });
    expect(primeira.getAttribute("aria-selected")).toBe("true");
  });

  it("acordeão: um item aberto por vez, nas duas variantes", () => {
    const { container } = render(<NeumorfismoAccordion />);
    const gatilhos = container.querySelectorAll("button[aria-expanded]");
    expect(gatilhos).toHaveLength(6);
    expect(container.querySelectorAll('button[aria-expanded="true"]')).toHaveLength(2);
    fireEvent.click(gatilhos[1]);
    expect(gatilhos[0].getAttribute("aria-expanded")).toBe("false");
    expect(gatilhos[1].getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(gatilhos[1]);
    expect(gatilhos[1].getAttribute("aria-expanded")).toBe("false");
  });

  it("etapas: a atual leva aria-current, a concluída dá o estado em texto e a navegação avança", () => {
    const { container } = render(<NeumorfismoSteps />);
    expect(container.querySelectorAll('li[aria-current="step"]')).toHaveLength(3);
    expect(container.querySelector(".neu-stepv--compact")).toBeTruthy();
    expect(screen.getAllByText("Concluída").length).toBeGreaterThan(0);
    expect(screen.getByText("Etapa 2 de 4")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Próxima etapa/ }));
    expect(screen.getByText("Etapa 3 de 4")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Voltar/ }));
    expect(screen.getByText("Etapa 2 de 4")).toBeTruthy();
  });
});
