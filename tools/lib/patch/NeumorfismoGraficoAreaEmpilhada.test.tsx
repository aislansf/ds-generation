import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAreaEmpilhada from "../NeumorfismoGraficoAreaEmpilhada";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const graficos = (c: HTMLElement) => [...c.querySelectorAll(".neu-area")] as HTMLElement[];

describe("NeumorfismoAreaEmpilhada", () => {
  it("cartão: o empilhado e o 100% empilhado, cada um com três faixas e a legenda", () => {
    const { container } = render(<NeumorfismoAreaEmpilhada />);
    const g = graficos(container);
    expect(g).toHaveLength(2);
    expect(g.map((a) => a.querySelectorAll(".neu-area__line").length)).toEqual([3, 3]);
    expect(g.map((a) => a.querySelectorAll(".neu-area__key").length)).toEqual([3, 3]);
    expect(texto(container, ".neu-area__title")).toEqual(["Atendimentos por região", "Participação por região"]);
    expect(container.querySelector(".neu-statx__chip--royal")?.textContent).toBe("Percentual");
  });

  it("faixas: cada uma preenche entre a de baixo e a sua linha, com preenchimento denso (62% a 38%) e as cores da paleta", () => {
    const { container } = render(<NeumorfismoAreaEmpilhada />);
    const [empilhado] = graficos(container);
    const stops = [...empilhado.querySelectorAll("stop")].map((s) => s.getAttribute("stop-opacity"));
    expect(stops.slice(0, 2)).toEqual(["0.62", "0.38"]);
    const areas = [...empilhado.querySelectorAll("path[fill^='url(']")];
    expect(areas).toHaveLength(3);
    expect(areas.every((p) => /Z$/.test(p.getAttribute("d") ?? ""))).toBe(true);
    expect(screen.getAllByRole("button", { name: "Sul" })[0].className).toContain("neu-area__s--accent");
    expect(screen.getAllByRole("button", { name: "Norte" })[0].className).toContain("neu-area__s--royal");
    expect(screen.getAllByRole("button", { name: "Centro" })[0].className).toContain("neu-area__s--success");
  });

  it("o eixo Y acompanha o total empilhado (até 143) e o balão lista de cima para baixo com o total", () => {
    const { container } = render(<NeumorfismoAreaEmpilhada />);
    const [empilhado] = graficos(container);
    expect(texto(empilhado, ".neu-area__ytick")).toEqual(["0", "50", "100", "150"]);
    fireEvent.keyDown(empilhado.querySelector(".neu-area__focus") as HTMLElement, { key: "ArrowRight" });
    expect(texto(empilhado, ".neu-area__tip-row")).toEqual(["Centro: 18", "Norte: 28", "Sul: 42", "Total: 88"]);
    expect(empilhado.querySelector(".neu-area__tip-total")).toBeTruthy();
    expect(empilhado.querySelector('[aria-live="polite"]')?.textContent).toBe("Jan: Sul 42, Norte 28, Centro 18");
  });

  it("apagar uma série tira a faixa e reescala o eixo para o novo total", () => {
    const { container } = render(<NeumorfismoAreaEmpilhada />);
    const [empilhado] = graficos(container);
    const sul = empilhado.querySelectorAll(".neu-area__key")[0] as HTMLElement;
    fireEvent.click(sul);
    expect(sul.getAttribute("aria-pressed")).toBe("false");
    expect(empilhado.querySelectorAll(".neu-area__line")).toHaveLength(2);
    expect(texto(empilhado, ".neu-area__ytick")).toEqual(["0", "25", "50", "75", "100"]);
    fireEvent.keyDown(empilhado.querySelector(".neu-area__focus") as HTMLElement, { key: "ArrowRight" });
    expect(texto(empilhado, ".neu-area__tip-row")).toEqual(["Centro: 18", "Norte: 28", "Total: 46"]);
  });

  it("100%: o eixo vai de 0 a 100% e o balão acrescenta a fatia de cada série", () => {
    const { container } = render(<NeumorfismoAreaEmpilhada />);
    const percentual = graficos(container)[1];
    expect(texto(percentual, ".neu-area__ytick")).toEqual(["0%", "25%", "50%", "75%", "100%"]);
    fireEvent.keyDown(percentual.querySelector(".neu-area__focus") as HTMLElement, { key: "ArrowRight" });
    expect(texto(percentual, ".neu-area__tip-share")).toEqual([" 20,5%", " 31,8%", " 47,7%"]);
    expect(texto(percentual, ".neu-area__tip-row").slice(-1)[0]).toBe("Total: 88");
  });
});
