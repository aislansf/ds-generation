import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAreaComSinal from "../NeumorfismoGraficoAreaComSinal";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const graficos = (c: HTMLElement) => [...c.querySelectorAll(".neu-area")] as HTMLElement[];

describe("NeumorfismoAreaComSinal", () => {
  it("cartão: os três gráficos do pacote, com 2, 2 e 1 séries", () => {
    const { container } = render(<NeumorfismoAreaComSinal />);
    const g = graficos(container);
    expect(g).toHaveLength(3);
    expect(g.map((a) => a.querySelectorAll(".neu-area__line").length)).toEqual([2, 2, 2]);
    expect(texto(container, ".neu-area__title")).toEqual(["Área com valores negativos", "Saldo de empresas abertas por região", "Resultado mensal"]);
  });

  it("entradas e saídas: zonas apagadas, eixo simétrico fixo e as cores de sucesso e perigo", () => {
    const { container } = render(<NeumorfismoAreaComSinal />);
    const [fluxo] = graficos(container);
    expect(fluxo.querySelector(".neu-area__zones")).toBeNull();
    expect(texto(fluxo, ".neu-area__ytick")).toEqual(["−110", "−55", "0", "55", "110"]);
    expect(screen.getByRole("button", { name: "Entradas" }).className).toContain("neu-area__s--success");
    expect(screen.getByRole("button", { name: "Saídas" }).className).toContain("neu-area__s--danger");
    expect(fluxo.querySelector(".neu-area__zero-shade")).toBeTruthy();
  });

  it("duas regiões: zonas com rótulo, cores da paleta de dados e eixo com sinais de verdade", () => {
    const { container } = render(<NeumorfismoAreaComSinal />);
    const regioes = graficos(container)[1];
    expect(texto(regioes, ".neu-area__zone-label")).toEqual(["Saldo positivo", "Saldo negativo"]);
    expect(regioes.querySelector(".neu-area__zone--pos")).toBeTruthy();
    expect(regioes.querySelector(".neu-area__zone--neg")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Norte" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "Sul" }).className).toContain("neu-area__s--royal");
    expect(texto(regioes, ".neu-area__ytick").some((t) => t?.startsWith("−"))).toBe(true);
    expect(regioes.querySelectorAll("stop")[0].getAttribute("stop-opacity")).toBe("0.34");
    expect(regioes.querySelectorAll("stop")[1].getAttribute("stop-opacity")).toBe("0.1");
  });

  it("o balão mostra o sinal no texto e na cor: positivo verde e negativo vermelho", () => {
    const { container } = render(<NeumorfismoAreaComSinal />);
    const regioes = graficos(container)[1];
    const grupo = regioes.querySelector(".neu-area__focus") as HTMLElement;
    fireEvent.keyDown(grupo, { key: "Home" });
    const valores = [...regioes.querySelectorAll(".neu-area__tip-row b")];
    expect(valores.map((b) => b.textContent)).toEqual(["+12", "−5"]);
    expect(valores.map((b) => b.className)).toEqual(["neu-tone-success", "neu-tone-danger"]);
    expect(regioes.querySelector('[aria-live="polite"]')?.textContent).toBe("Jan: Norte +12, Sul −5");
  });

  it("uma série com a cor pelo sinal: trecho verde acima do zero, vermelho abaixo, e pontos pelo sinal; valores formatados", () => {
    const { container } = render(<NeumorfismoAreaComSinal />);
    const resultado = graficos(container)[2];
    expect(resultado.querySelectorAll(".neu-area__s--success .neu-area__line")).toHaveLength(1);
    expect(resultado.querySelectorAll(".neu-area__s--danger .neu-area__line")).toHaveLength(1);
    expect(resultado.querySelectorAll("clipPath")).toHaveLength(2);
    const pontos = [...resultado.querySelectorAll(".neu-area__dot")];
    expect(pontos).toHaveLength(8);
    expect(pontos.filter((p) => p.getAttribute("class")?.includes("neu-area__s--danger"))).toHaveLength(3);
    expect(pontos.filter((p) => p.getAttribute("class")?.includes("neu-area__s--success"))).toHaveLength(5);
    expect(texto(resultado, ".neu-area__zone-label")).toEqual(["Superávit", "Déficit"]);
    fireEvent.keyDown(resultado.querySelector(".neu-area__focus") as HTMLElement, { key: "End" });
    expect(resultado.querySelector(".neu-area__tip b")?.textContent).toBe("+R$ 33k");
    expect(resultado.querySelector(".neu-area__tip-row")?.className).toContain("neu-area__s--success");
  });

  it("uma série sem legenda: só as de várias séries têm chaves", () => {
    const { container } = render(<NeumorfismoAreaComSinal />);
    expect(graficos(container).map((a) => !!a.querySelector(".neu-area__legend"))).toEqual([true, true, false]);
  });
});
