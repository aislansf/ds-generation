import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Clock } from "lucide-react";
import NeumorfismoIndicadores, { CartaoIndicador } from "../NeumorfismoIndicadores";

describe("NeumorfismoIndicadores", () => {
  it("cartão: três indicadores do pacote, cada um um grupo nomeado pela legenda e pelo valor", () => {
    const { container } = render(<NeumorfismoIndicadores />);
    expect(container.querySelectorAll(".neu-indicator")).toHaveLength(3);
    expect(screen.getByRole("group", { name: "Escolas atendidas: 1.247" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Planos aguardando ajuste: 23" })).toBeTruthy();
    expect(screen.getByText("Indicador / Métrica")).toBeTruthy();
    expect(screen.getByText("Consultorias")).toBeTruthy();
  });

  it("anatomia: rótulo e ícone no topo, valor e legenda no leito, pílula da variação e rodapé", () => {
    const { container } = render(
      <CartaoIndicador icone={Clock} rotulo="Prazo" valor="12" legenda="Dias" tendencia="3% a menos" direcao="queda" atualizado="Atualizado agora" />,
    );
    expect(container.querySelector(".neu-indicator__top .neu-indicator__label")?.textContent).toBe("Prazo");
    expect(container.querySelector(".neu-indicator__icon svg")).toBeTruthy();
    expect(container.querySelector(".neu-indicator__icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-indicator__well .neu-indicator__value")?.textContent).toBe("12");
    expect(container.querySelector(".neu-indicator__well .neu-indicator__caption")?.textContent).toBe("Dias");
    expect(container.querySelector(".neu-indicator__foot span")?.textContent).toBe("Atualizado agora");
  });

  it("tom do valor: marca por padrão, azul e neutro quando pedidos", () => {
    const { container, rerender } = render(<CartaoIndicador valor="1" />);
    const valor = () => container.querySelector(".neu-indicator__value")?.className;
    expect(valor()).toBe("neu-indicator__value neu-tone-accent");
    rerender(<CartaoIndicador valor="1" tom="azul" />);
    expect(valor()).toBe("neu-indicator__value neu-tone-royal");
    rerender(<CartaoIndicador valor="1" tom="neutro" />);
    expect(valor()).toBe("neu-indicator__value neu-tone-neutral");
  });

  it("variação: a seta mostra o sentido, o sinal sai do texto e um texto escondido diz o sentido", () => {
    const { container, rerender } = render(<CartaoIndicador valor="1" tendencia="12% em relação ao mês anterior" />);
    const pilula = () => container.querySelector(".neu-indicator__trend") as HTMLElement;
    expect(pilula().className).toBe("neu-indicator__trend neu-trend--up");
    expect(pilula().textContent).toBe("↑12% em relação ao mês anterior (alta)");
    expect(pilula().querySelector("[aria-hidden]")?.textContent).toBe("↑");
    rerender(<CartaoIndicador valor="1" tendencia="-15% em relação ao mês anterior" />);
    expect(pilula().className).toBe("neu-indicator__trend neu-trend--down");
    expect(pilula().textContent).toBe("↓15% em relação ao mês anterior (queda)");
    rerender(<CartaoIndicador valor="1" tendencia="0% em relação ao mês anterior" />);
    expect(pilula().className).toBe("neu-indicator__trend neu-trend--flat");
    expect(pilula().querySelector(".sr-only")?.textContent).toBe(" (estável)");
    rerender(<CartaoIndicador valor="1" tendencia="7% a mais" direcao="queda" />);
    expect(pilula().className).toBe("neu-indicator__trend neu-trend--down");
  });

  it("sem variação, legenda nem atualização, só o que foi dado aparece", () => {
    const { container } = render(<CartaoIndicador valor="9" />);
    expect(container.querySelector(".neu-indicator__trend")).toBeNull();
    expect(container.querySelector(".neu-indicator__caption")).toBeNull();
    expect(container.querySelector(".neu-indicator__foot")).toBeNull();
    expect(screen.getByRole("group", { name: "Indicador / Métrica: 9" })).toBeTruthy();
  });
});
