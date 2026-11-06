import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoGraficoBarras, { GraficoBarras } from "../NeumorfismoGraficoBarras";

const SEMANA = [
  { rotulo: "M", valor: 4 },
  { rotulo: "T", valor: 6 },
  { rotulo: "W", valor: 7 },
  { rotulo: "T", valor: 9, ativo: true },
  { rotulo: "F", valor: 8 },
  { rotulo: "S", valor: 6.5 },
  { rotulo: "S", valor: 5 },
];

describe("NeumorfismoGraficoBarras", () => {
  it("cartão: os dois gráficos do pacote, cada um lido como uma imagem com todos os valores", () => {
    const { container } = render(<NeumorfismoGraficoBarras />);
    expect(container.querySelectorAll(".neu-bars-card")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Peak Demand: M 4, T 6, W 7, T 9, F 8, S 6,5, S 5" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Evolução de Diagnósticos: SEG 62, TER 80, QUA 48, QUI 30, SEX 85, SÁB 28" })).toBeTruthy();
    expect(container.querySelectorAll(".neu-bars--wide")).toHaveLength(1);
  });

  it("estreita: a calha cresce com o valor (mínimo 40%, mais 12% de folga) e o preenchimento tem altura fixa", () => {
    const { container } = render(<GraficoBarras titulo="T" dados={SEMANA} />);
    const calhas = [...container.querySelectorAll(".neu-bars__track")] as HTMLElement[];
    expect(calhas.map((c) => c.style.height)).toEqual(["56%", "79%", "90%", "112%", "101%", "84%", "68%"]);
    expect([...container.querySelectorAll(".neu-bars__fill")].every((f) => (f as HTMLElement).style.height === "70%")).toBe(true);
  });

  it("estreita: uma barra muito baixa não fica abaixo de 40%", () => {
    const { container } = render(<GraficoBarras dados={[{ rotulo: "a", valor: 1 }, { rotulo: "b", valor: 100 }]} />);
    expect((container.querySelector(".neu-bars__track") as HTMLElement).style.height).toBe("40%");
  });

  it("larga: as calhas têm a mesma altura e o preenchimento cresce com o valor", () => {
    const { container } = render(<GraficoBarras variante="larga" dados={[{ rotulo: "A", valor: 50 }, { rotulo: "B", valor: 100 }]} />);
    expect([...container.querySelectorAll(".neu-bars__track")].map((c) => (c as HTMLElement).style.height)).toEqual(["100%", "100%"]);
    expect([...container.querySelectorAll(".neu-bars__fill")].map((c) => (c as HTMLElement).style.height)).toEqual(["50%", "100%"]);
  });

  it("máximo: o valor que enche a calha pode ser dado", () => {
    const { container } = render(<GraficoBarras variante="larga" maximo={200} dados={[{ rotulo: "A", valor: 50 }]} />);
    expect((container.querySelector(".neu-bars__fill") as HTMLElement).style.height).toBe("25%");
  });

  it("destaque: só a barra ativa leva data-active, e o rótulo de cada barra aparece", () => {
    const { container } = render(<GraficoBarras titulo="T" dados={SEMANA} />);
    const colunas = [...container.querySelectorAll(".neu-bars__col")];
    expect(colunas.map((c) => c.getAttribute("data-active"))).toEqual(["false", "false", "false", "true", "false", "false", "false"]);
    expect(colunas.map((c) => c.querySelector(".neu-bars__tick")?.textContent).join("")).toBe("MTWTFSS");
  });

  it("bolha: o valor aparece na bolha, com o nome do que mede escondido; sem título não há cabeçalho", () => {
    const { container, rerender } = render(<GraficoBarras titulo="T" bolha={88} rotuloBolha="Pico" dados={SEMANA} />);
    const bolha = container.querySelector(".neu-chart-bubble") as HTMLElement;
    expect(bolha.textContent).toBe("Pico: 88");
    expect(bolha.querySelector(".sr-only")?.textContent).toBe("Pico: ");
    rerender(<GraficoBarras dados={SEMANA} />);
    expect(container.querySelector(".neu-bars__head")).toBeNull();
    expect(screen.getByRole("img", { name: /^Gráfico: M 4/ })).toBeTruthy();
  });
});
