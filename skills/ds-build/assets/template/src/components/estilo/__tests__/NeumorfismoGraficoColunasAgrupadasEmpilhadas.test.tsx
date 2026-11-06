import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoColunasAgrupadasEmpilhadas, { GraficoColunasAgrupadasEmpilhadas } from "../NeumorfismoGraficoColunasAgrupadasEmpilhadas";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const barras = (c: Element) => [...c.querySelectorAll("path.neu-gbar__bar")];

describe("NeumorfismoColunasAgrupadasEmpilhadas", () => {
  it("cartão: cinco regiões com duas colunas cada, quatro segmentos por região e a legenda com as quatro séries", () => {
    const { container } = render(<NeumorfismoColunasAgrupadasEmpilhadas />);
    expect(container.querySelector(".neu-area__title")?.textContent).toBe("Atendimentos por trimestre e região");
    expect(barras(container)).toHaveLength(20);
    expect(texto(container, ".neu-area__key")).toEqual(["T1", "T2", "T3", "T4"]);
    expect(container.querySelector(".neu-area__plot")?.getAttribute("style")).toContain("height: 320px");
  });

  it("colunas: o segmento de cima de cada pilha é arredondado e o de baixo é reto, separados por uma costura", () => {
    const { container } = render(<NeumorfismoColunasAgrupadasEmpilhadas />);
    const b = barras(container);
    expect(b.filter((p) => p.getAttribute("d")?.includes("Q"))).toHaveLength(10);
    expect(b.every((p) => p.getAttribute("class")?.includes("neu-gbar__bar--seg"))).toBe(true);
    const [q1, q2, q3, q4] = b;
    // T1 e T2 ficam na mesma coluna (mesmo x de partida); T3 e T4 numa segunda, à direita
    const x = (p: Element) => Number((p.getAttribute("d") ?? "").match(/^M([\d.]+),/)?.[1]);
    expect(x(q1)).toBe(x(q2));
    expect(x(q3)).toBe(x(q4));
    expect(x(q3)).toBeGreaterThan(x(q1));
  });

  it("opacidade: o segundo segmento de cada pilha é um tom mais claro, e a amostra da legenda leva a mesma opacidade", () => {
    const { container } = render(<NeumorfismoColunasAgrupadasEmpilhadas />);
    const b = barras(container);
    expect(b[0].getAttribute("fill-opacity")).toBeNull();
    expect(b[1].getAttribute("fill-opacity")).toBe("0.5");
    const amostras = [...container.querySelectorAll(".neu-area__key-dot")] as HTMLElement[];
    expect(amostras.map((a) => a.style.opacity)).toEqual(["", "0.5", "", "0.5"]);
    expect(screen.getByRole("button", { name: "T1" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "T3" }).className).toContain("neu-area__s--royal");
  });

  it("eixo: vai ao maior total de coluna (a pilha T3+T4 do Sudeste, 199)", () => {
    const { container } = render(<NeumorfismoColunasAgrupadasEmpilhadas />);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0", "50", "100", "150", "200"]);
  });

  it("balão: agrupado por coluna, segmento de cima primeiro, com o subtotal de cada uma", () => {
    const { container } = render(<NeumorfismoColunasAgrupadasEmpilhadas />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect(texto(container, ".neu-area__tip-row")).toEqual(["T2: 38", "T1: 42", "1º semestre: 80", "T4: 51", "T3: 45", "2º semestre: 96"]);
    expect(container.querySelectorAll(".neu-gbar__tip-sub")).toHaveLength(2);
  });

  it("sem nome para a pilha, o subtotal se chama Subtotal; uma série sem pilha vira uma coluna própria", () => {
    const { container } = render(
      <GraficoColunasAgrupadasEmpilhadas dados={[{ name: "X", a: 3, b: 4, c: 5 }]} series={[{ chave: "a", nome: "A", pilha: "p" }, { chave: "b", nome: "B", pilha: "p" }, { chave: "c", nome: "C" }]} />,
    );
    expect(barras(container)).toHaveLength(3);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect(texto(container, ".neu-area__tip-row")).toEqual(["B: 4", "A: 3", "Subtotal: 7", "C: 5"]);
  });

  it("legenda: apagar as séries de uma pilha tira a coluna dela e o eixo passa a seguir o maior total que sobra (180)", () => {
    const { container } = render(<NeumorfismoColunasAgrupadasEmpilhadas />);
    fireEvent.click(screen.getByRole("button", { name: "T3" }));
    fireEvent.click(screen.getByRole("button", { name: "T4" }));
    expect(barras(container)).toHaveLength(10);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0", "50", "100", "150", "200"]);
  });
});
