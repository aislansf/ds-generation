import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAreaTemporal, { GraficoAreaTemporal, inicioDoPeriodo, lerData, variacao } from "../NeumorfismoGraficoAreaTemporal";

const texto = (c: HTMLElement, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const intervalo = (c: HTMLElement) => c.querySelector(".neu-tarea__range")?.textContent;

describe("NeumorfismoAreaTemporal", () => {
  it("cartão: título, seletor de período com cinco opções (1A marcada), valor em pt-BR, variação e intervalo", () => {
    const { container } = render(<NeumorfismoAreaTemporal />);
    expect(container.querySelector(".neu-area__title")?.textContent).toBe("Atendimentos diários");
    expect(container.querySelector(".neu-area__sub")?.textContent).toBe("Todas as unidades");
    const opcoes = screen.getAllByRole("radio");
    expect(opcoes.map((o) => o.textContent)).toEqual(["1M", "6M", "1A", "No ano", "Tudo"]);
    expect(opcoes.map((o) => o.getAttribute("aria-label"))).toEqual(["Último mês", "Últimos 6 meses", "Último ano", "Desde 1º de janeiro", "Todo o histórico"]);
    expect(opcoes.map((o) => o.getAttribute("aria-checked"))).toEqual(["false", "false", "true", "false", "false"]);
    expect(opcoes.map((o) => o.getAttribute("tabindex"))).toEqual(["-1", "-1", "0", "-1", "-1"]);
    expect(screen.getByRole("radiogroup", { name: "Período" })).toBeTruthy();
    expect(container.querySelector(".neu-tarea__value")?.textContent).toMatch(/^\d{1,3}(\.\d{3})*$|^\d{3}$/);
    expect(intervalo(container)).toBe("Último ano · 31/10/2025 – 31/10/2026");
    expect(container.querySelector(".neu-statx__trend")).toBeTruthy();
    expect(container.querySelector(".neu-tarea__kpi")?.getAttribute("aria-live")).toBe("polite");
  });

  it("trocar o período muda o intervalo, o formato dos rótulos do eixo e o resumo falado", () => {
    const { container } = render(<NeumorfismoAreaTemporal />);
    fireEvent.click(screen.getByRole("radio", { name: "Último mês" }));
    expect(intervalo(container)).toBe("Último mês · 01/10/2026 – 31/10/2026");
    expect(texto(container, ".neu-area__xtick").every((t) => /^\d{2}\/\d{2}$/.test(t ?? ""))).toBe(true);
    fireEvent.click(screen.getByRole("radio", { name: "Últimos 6 meses" }));
    expect(intervalo(container)).toBe("Últimos 6 meses · 01/05/2026 – 31/10/2026");
    expect(texto(container, ".neu-area__xtick").every((t) => /^[A-Z][a-z]{2}$/.test(t ?? ""))).toBe(true);
    fireEvent.click(screen.getByRole("radio", { name: "Desde 1º de janeiro" }));
    expect(intervalo(container)).toBe("Desde 1º de janeiro · 01/01/2026 – 31/10/2026");
    fireEvent.click(screen.getByRole("radio", { name: "Todo o histórico" }));
    expect(intervalo(container)).toBe("Todo o histórico · 01/01/2024 – 31/10/2026");
    expect(texto(container, ".neu-area__xtick").every((t) => /^[A-Z][a-z]{2}\/\d{2}$/.test(t ?? ""))).toBe(true);
    expect(screen.getByRole("group", { name: /Atendimentos diários, todo o histórico: \d+ pontos de 01\/01\/2024 a 31\/10\/2026\. Atendimentos atual/ })).toBeTruthy();
  });

  it("eixo: até sete rótulos, sem mês repetido, e os de um ano ficam no começo dos meses", () => {
    const { container } = render(<NeumorfismoAreaTemporal />);
    const ticks = texto(container, ".neu-area__xtick");
    expect(ticks.length).toBeLessThanOrEqual(7);
    expect(new Set(ticks).size).toBe(ticks.length);
  });

  it("períodos longos são amostrados (até 120 pontos) e sem anéis; o balão traz a data completa", () => {
    const { container } = render(<NeumorfismoAreaTemporal />);
    fireEvent.click(screen.getByRole("radio", { name: "Todo o histórico" }));
    expect(container.querySelectorAll(".neu-area__dot")).toHaveLength(0);
    const n = Number(screen.getByRole("group", { name: /pontos de/ }).getAttribute("aria-label")?.match(/: (\d+) pontos/)?.[1]);
    expect(n).toBeLessThanOrEqual(121);
    fireEvent.keyDown(screen.getByRole("group", { name: /pontos de/ }), { key: "End" });
    expect(container.querySelector(".neu-area__tip-label")?.textContent).toBe("31/10/2026");
    expect(container.querySelectorAll(".neu-area__dot")).toHaveLength(1);
  });

  it("teclado no seletor: as setas escolhem e movem o foco, com volta ao fim e ao começo; Home e End", () => {
    render(<NeumorfismoAreaTemporal />);
    const um = screen.getByRole("radio", { name: "Último ano" });
    um.focus();
    fireEvent.keyDown(um, { key: "ArrowRight" });
    const noAno = screen.getByRole("radio", { name: "Desde 1º de janeiro" });
    expect(noAno.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(noAno);
    fireEvent.keyDown(noAno, { key: "ArrowDown" });
    const tudo = screen.getByRole("radio", { name: "Todo o histórico" });
    expect(tudo.getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(tudo, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "Último mês" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Último mês" }), { key: "ArrowLeft" });
    expect(screen.getByRole("radio", { name: "Todo o histórico" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Todo o histórico" }), { key: "Home" });
    expect(screen.getByRole("radio", { name: "Último mês" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Último mês" }), { key: "End" });
    expect(screen.getByRole("radio", { name: "Todo o histórico" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Todo o histórico" }), { key: "x" });
    expect(screen.getByRole("radio", { name: "Todo o histórico" }).getAttribute("aria-checked")).toBe("true");
  });

  it("controlado: o período vem de fora e a troca é avisada sem mudar sozinha", () => {
    const aoMudar = vi.fn();
    const dados = Array.from({ length: 90 }, (_, i) => ({ date: new Date(2026, 0, 1 + i), valor: 100 + i }));
    const { container } = render(<GraficoAreaTemporal dados={dados} periodo="ALL" aoMudarPeriodo={aoMudar} />);
    expect(screen.getByRole("radio", { name: "Todo o histórico" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("radio", { name: "Último mês" }));
    expect(aoMudar).toHaveBeenCalledWith("1M");
    expect(screen.getByRole("radio", { name: "Todo o histórico" }).getAttribute("aria-checked")).toBe("true");
    expect(intervalo(container)).toBe("Todo o histórico · 01/01/2026 – 31/03/2026");
  });

  it("opções e a data de referência podem ser dadas; sem dados, a mensagem de vazio", () => {
    const dados = [{ date: "2026-01-10", valor: 10 }, { date: "2026-02-10", valor: 20 }];
    const { container } = render(<GraficoAreaTemporal dados={dados} periodos={[{ valor: "ALL", rotulo: "Tudo", nome: "Tudo" }]} />);
    expect(screen.getAllByRole("radio")).toHaveLength(1);
    expect(container.querySelector(".neu-statx__trend--up")?.textContent).toBe("+100,0% no período");
    const outro = render(<GraficoAreaTemporal dados={dados} periodoInicial="1M" hoje="2026-02-15" />).container;
    expect(intervalo(outro)).toBe("Último mês · 10/02/2026 – 10/02/2026");
    const vazio = render(<GraficoAreaTemporal dados={[]} />).container;
    expect(vazio.textContent).toContain("Sem dados neste período.");
    expect(vazio.querySelector(".neu-tarea__value")?.textContent).toBe("—");
  });

  it("variação: sinal e sentido da pílula; queda usa o menos tipográfico", () => {
    expect(variacao(100, 112.34)).toBe("+12,3%");
    expect(variacao(100, 90)).toBe("−10,0%");
    expect(variacao(100, 100)).toBe("0,0%");
    expect(variacao(0, 5)).toBeNull();
    const { container } = render(<GraficoAreaTemporal dados={[{ date: "2026-01-01", valor: 100 }, { date: "2026-01-20", valor: 80 }]} periodoInicial="ALL" />);
    expect(container.querySelector(".neu-statx__trend--down")?.textContent).toBe("−20,0% no período");
  });

  it("datas: lerData aceita texto e Date; os períodos contam para trás a partir do fim", () => {
    const fim = new Date(2026, 9, 31);
    expect(lerData("2026-03-05").getMonth()).toBe(2);
    expect(lerData(fim)).toBe(fim);
    expect(inicioDoPeriodo("1M", fim)).toEqual(new Date(2026, 9, 1));
    expect(inicioDoPeriodo("3M", fim)).toEqual(new Date(2026, 6, 31));
    expect(inicioDoPeriodo("6M", fim)).toEqual(new Date(2026, 4, 1));
    expect(inicioDoPeriodo("1Y", fim)).toEqual(new Date(2025, 9, 31));
    expect(inicioDoPeriodo("YTD", fim)).toEqual(new Date(2026, 0, 1));
    expect(inicioDoPeriodo("ALL", fim)).toBeNull();
  });
});
