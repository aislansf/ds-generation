import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoMetricas, { CartaoMetrica } from "../NeumorfismoMetricas";

describe("NeumorfismoMetricas", () => {
  it("cartão: os dois cartões do pacote, um com anel e outro com barras, cada um um grupo nomeado", () => {
    const { container } = render(<NeumorfismoMetricas />);
    expect(container.querySelectorAll(".neu-metric")).toHaveLength(2);
    expect(screen.getByRole("group", { name: "Vendas Totais: R$ 250K" }).querySelector(".neu-ring")).toBeTruthy();
    expect(screen.getByRole("group", { name: "Projeto A - Vendas: R$ 320K" }).querySelector(".neu-spark")).toBeTruthy();
  });

  it("anel: o arco acompanha o percentual, o número no centro é desenho e a imagem diz o percentual", () => {
    const { container } = render(<CartaoMetrica grafico="anel" percentual={72} rotulo="Vendas" valor="R$ 250K" rotuloGrafico="Meta mensal" legenda="Total" />);
    expect(screen.getByRole("img", { name: "Meta mensal: 72%" })).toBeTruthy();
    expect(container.querySelector(".neu-ring > span")?.textContent).toBe("72%");
    expect(container.querySelector(".neu-ring__value")?.getAttribute("stroke-dasharray")).toBe("63.36, 100");
    expect(container.querySelector(".neu-ring g")?.getAttribute("transform")).toBe("rotate(-90 18 18)");
    expect(container.querySelector(".neu-ring svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-metric__text")?.textContent).toBe("Total");
  });

  it("anel: o percentual é limitado a 0–100 e o nome padrão é Progresso", () => {
    render(<CartaoMetrica grafico="anel" percentual={140} rotulo="A" valor="1" />);
    expect(screen.getByRole("img", { name: "Progresso: 100%" })).toBeTruthy();
  });

  it("barras: alturas em porcentagem, só a mais alta é o pico e a imagem lista os valores", () => {
    const { container } = render(<CartaoMetrica grafico="barras" dados={[40, 65, 35, 80, 55]} rotulo="A" valor="1" rotuloGrafico="Vendas" />);
    const serie = screen.getByRole("img", { name: "Vendas: 40, 65, 35, 80, 55" });
    const barras = [...serie.querySelectorAll(".neu-spark__bar")] as HTMLElement[];
    expect(barras.map((b) => b.style.height)).toEqual(["40%", "65%", "35%", "80%", "55%"]);
    expect(barras.map((b) => b.getAttribute("data-peak"))).toEqual(["false", "false", "false", "true", "false"]);
    expect(container.querySelector(".neu-metric__text")).toBeNull();
  });

  it("barras: sem dados usa a série do pacote, e vários picos empatados ficam todos em destaque", () => {
    const { container, rerender } = render(<CartaoMetrica rotulo="A" valor="1" />);
    expect(container.querySelectorAll(".neu-spark__bar")).toHaveLength(5);
    rerender(<CartaoMetrica rotulo="A" valor="1" dados={[50, 50, 20]} />);
    expect(container.querySelectorAll('.neu-spark__bar[data-peak="true"]')).toHaveLength(2);
  });
});
