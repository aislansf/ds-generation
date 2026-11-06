import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoBarrasHorizontais, { GraficoBarrasHorizontais } from "../NeumorfismoGraficoBarrasHorizontais";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);

describe("NeumorfismoBarrasHorizontais", () => {
  it("cartão: o ranking (com posições) e a satisfação por serviço (sem posições, ordem original)", () => {
    const { container } = render(<NeumorfismoBarrasHorizontais />);
    const [a, b] = [...container.querySelectorAll(".neu-hbar")];
    expect(texto(a, ".neu-area__title")).toEqual(["Ranking de atendimentos por município"]);
    expect(a.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Ranking");
    expect(a.querySelectorAll(".neu-hbar__row")).toHaveLength(8);
    expect(a.querySelectorAll(".neu-hbar__rank")).toHaveLength(8);
    expect(b.querySelectorAll(".neu-hbar__row")).toHaveLength(5);
    expect(b.querySelectorAll(".neu-hbar__rank")).toHaveLength(0);
  });

  it("ranking: do maior para o menor, com os valores em pt-BR e os três primeiros discos convexos", () => {
    const { container } = render(<NeumorfismoBarrasHorizontais />);
    const a = container.querySelector(".neu-hbar") as HTMLElement;
    expect(texto(a, ".neu-hbar__val")).toEqual(["4.820", "2.110", "1.985", "1.530", "1.240", "860", "720", "655"]);
    expect(texto(a, ".neu-hbar__cat title")).toEqual(["Fortaleza", "Sobral", "Juazeiro do Norte", "Maracanaú", "Caucaia", "Crato", "Itapipoca", "Maranguape"]);
    expect(texto(a, ".neu-hbar__rank-num")).toEqual(["1", "2", "3", "4", "5", "6", "7", "8"]);
    expect(a.querySelectorAll(".neu-hbar__rank--top")).toHaveLength(3);
  });

  it("a barra líder brilha e o valor dela ganha o tom; a segunda não", () => {
    const { container } = render(<NeumorfismoBarrasHorizontais />);
    const a = container.querySelector(".neu-hbar") as HTMLElement;
    expect(a.querySelectorAll(".neu-hbar__bar--peak")).toHaveLength(1);
    expect(a.querySelectorAll(".neu-hbar__val--peak")).toHaveLength(1);
    expect(a.querySelector(".neu-hbar__val--peak")?.textContent).toBe("4.820");
  });

  it("ordem original e sem posições: as linhas seguem os dados, com o eixo fixo em 0–100", () => {
    const { container } = render(<NeumorfismoBarrasHorizontais />);
    const b = container.querySelectorAll(".neu-hbar")[1] as HTMLElement;
    expect(texto(b, ".neu-hbar__val")).toEqual(["82", "76", "64", "71", "58"]);
    expect(texto(b, ".neu-area__ytick")).toEqual(["0", "25", "50", "75", "100"]);
    expect(b.querySelector(".neu-hbar__row")?.getAttribute("class")).toContain("neu-area__s--royal");
  });

  it("ordenar asc põe o menor primeiro; o eixo de valores tem valores bonitos", () => {
    const { container } = render(<GraficoBarrasHorizontais ordenar="asc" dados={[{ nome: "A", valor: 30 }, { nome: "B", valor: 10 }, { nome: "C", valor: 20 }]} />);
    expect(texto(container, ".neu-hbar__val")).toEqual(["10", "20", "30"]);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0", "10", "20", "30"]);
  });

  it("valores negativos se estendem à esquerda do zero, com o valor antes da barra", () => {
    const { container } = render(<GraficoBarrasHorizontais classificar={false} ordenar={false} dados={[{ nome: "P", valor: 40 }, { nome: "N", valor: -20 }]} />);
    const [pos, neg] = [...container.querySelectorAll(".neu-hbar__val")];
    expect(pos.getAttribute("text-anchor")).toBe("start");
    expect(neg.getAttribute("text-anchor")).toBe("end");
    expect(texto(container, ".neu-area__ytick").some((t) => t?.startsWith("−"))).toBe(true);
    const caminhos = [...container.querySelectorAll("path.neu-hbar__bar")].map((p) => p.getAttribute("d") ?? "");
    expect(caminhos[0]).toMatch(/^M[\d.]+,[\d.]+H/);
    expect(caminhos[1]).toMatch(/^M[\d.]+,[\d.]+H/);
  });

  it("nomes longos são cortados com reticências e levam o nome inteiro no título", () => {
    const { container } = render(<GraficoBarrasHorizontais larguraCategoria={60} dados={[{ nome: "Um nome de categoria muito comprido", valor: 5 }]} />);
    expect(container.querySelector(".neu-hbar__cat title")?.textContent).toBe("Um nome de categoria muito comprido");
    expect(container.querySelector(".neu-hbar__cat")?.textContent).toContain("…");
  });

  it("foco: o mouse e as setas levam a faixa à linha, em negrito, e as outras esmaecem; a região educada anuncia", () => {
    const { container } = render(<NeumorfismoBarrasHorizontais />);
    const a = container.querySelector(".neu-hbar") as HTMLElement;
    expect(a.querySelector(".neu-gbar__hover")).toBeNull();
    fireEvent.mouseEnter(a.querySelectorAll(".neu-hbar__row")[1]);
    expect(a.querySelector(".neu-gbar__hover")).toBeTruthy();
    expect(a.querySelectorAll(".neu-hbar__row--on")).toHaveLength(1);
    expect(a.querySelectorAll(".neu-hbar__row--dim")).toHaveLength(7);
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("2º Sobral: Atendimentos 2.110");
    const grupo = screen.getAllByRole("group", { name: /Use ↑ e ↓ para percorrer/ })[0];
    fireEvent.keyDown(grupo, { key: "Home" });
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("1º Fortaleza: Atendimentos 4.820");
    fireEvent.keyDown(grupo, { key: "ArrowDown" });
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("2º Sobral: Atendimentos 2.110");
    fireEvent.keyDown(grupo, { key: "End" });
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("8º Maranguape: Atendimentos 655");
    fireEvent.keyDown(grupo, { key: "ArrowUp" });
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("7º Itapipoca: Atendimentos 720");
    fireEvent.keyDown(grupo, { key: "Escape" });
    expect(a.querySelector(".neu-gbar__hover")).toBeNull();
    fireEvent.mouseLeave(a.querySelector("svg") as SVGElement);
    fireEvent.keyDown(grupo, { key: "x" });
    expect(a.querySelector(".neu-gbar__hover")).toBeNull();
  });

  it("o grupo lê o ranking inteiro, com as posições", () => {
    render(<NeumorfismoBarrasHorizontais />);
    const nome = screen.getAllByRole("group", { name: /Use ↑ e ↓/ })[0].getAttribute("aria-label") ?? "";
    expect(nome).toContain("Ranking de atendimentos por município. 1º Fortaleza: 4.820; 2º Sobral: 2.110");
    const semPosicao = screen.getAllByRole("group", { name: /Use ↑ e ↓/ })[1].getAttribute("aria-label") ?? "";
    expect(semPosicao).toContain("Satisfação por serviço. Capacitação: 82; Consultoria: 76");
  });

  it("sem vãos, sem destaque e sem moldura: só o que foi pedido; cores por linha", () => {
    const { container } = render(<GraficoBarrasHorizontais moldura={false} fendas={false} destaque={false} dados={[{ nome: "A", valor: 9, tom: "sucesso" }, { nome: "B", valor: 5 }]} />);
    expect(container.querySelector(".neu-area")).toBeNull();
    expect(container.querySelectorAll(".neu-hbar__slot")).toHaveLength(0);
    expect(container.querySelectorAll(".neu-hbar__bar--peak")).toHaveLength(0);
    const linhas = [...container.querySelectorAll(".neu-hbar__row")].map((r) => r.getAttribute("class"));
    expect(linhas[0]).toContain("neu-area__s--success");
    expect(linhas[1]).toContain("neu-area__s--accent");
  });
});
