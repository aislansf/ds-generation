import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoBarrasAgrupadas, { GraficoBarrasAgrupadas, retanguloArredondado } from "../NeumorfismoGraficoBarrasAgrupadas";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const barras = (c: Element) => [...c.querySelectorAll("path.neu-gbar__bar")];
const topoDe = (p: Element) => Number((p.getAttribute("d") ?? "").match(/V([\d.-]+)Q/)?.[1]);
const SEMANA = [
  { name: "Seg", a: 40, b: 20, c: 10 },
  { name: "Ter", a: 50, b: 30, c: 15 },
  { name: "Qua", a: 60, b: 25, c: 5 },
];
const SERIES3 = [{ chave: "a", nome: "A" }, { chave: "b", nome: "B" }, { chave: "c", nome: "C" }];

describe("NeumorfismoBarrasAgrupadas", () => {
  it("cartão: receita e despesa lado a lado e atendimentos empilhados, com legenda e o nome que lê todas as séries", () => {
    const { container } = render(<NeumorfismoBarrasAgrupadas />);
    expect(container.querySelectorAll(".neu-gbar")).toHaveLength(2);
    expect(barras(container.querySelectorAll(".neu-gbar")[0])).toHaveLength(12);
    expect(barras(container.querySelectorAll(".neu-gbar")[1])).toHaveLength(15);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Mensal");
    const nome = screen.getAllByRole("group", { name: /Use as setas para percorrer as categorias/ })[0].getAttribute("aria-label") ?? "";
    expect(nome).toContain("Receita por mês: Jan R$ 4.200");
    expect(nome).toContain("Despesa por mês: Jan R$ 3.100");
  });

  it("lado a lado: a barra de cima é arredondada, a base é reta e a mais alta é a de maior valor; o eixo tem valores bonitos", () => {
    const { container } = render(<GraficoBarrasAgrupadas dados={[{ name: "X", a: 100, b: 50 }]} series={[{ chave: "a" }, { chave: "b" }]} />);
    const [a, b] = barras(container);
    expect(a.getAttribute("d")).toMatch(/^M[\d.]+,[\d.]+V[\d.]+Q/);
    expect(topoDe(a)).toBeLessThan(topoDe(b));
    expect(texto(container, ".neu-area__ytick")).toEqual(["0", "25", "50", "75", "100"]);
    expect(container.querySelector(".neu-gbar__base")).toBeTruthy();
  });

  it("valores negativos pendem abaixo da base, com a ponta de baixo arredondada", () => {
    const { container } = render(<GraficoBarrasAgrupadas dados={[{ name: "X", valor: 40 }, { name: "Y", valor: -20 }]} />);
    const [pos, neg] = barras(container);
    expect(pos.getAttribute("d")).toContain("Q");
    expect(neg.getAttribute("d")).toMatch(/^M[\d.]+,[\d.]+H[\d.]+V[\d.]+Q/);
    expect(texto(container, ".neu-area__ytick").some((t) => t?.startsWith("−"))).toBe(true);
  });

  it("cores: a primeira série é da marca, a segunda azul, e o degradê vai de 100% a 72%", () => {
    const { container } = render(<GraficoBarrasAgrupadas dados={SEMANA} series={SERIES3} />);
    expect(screen.getByRole("button", { name: "A" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "B" }).className).toContain("neu-area__s--royal");
    expect(screen.getByRole("button", { name: "C" }).className).toContain("neu-area__s--success");
    expect([...container.querySelectorAll("stop")].slice(0, 2).map((s) => s.getAttribute("stop-opacity"))).toEqual(["1", "0.72"]);
  });

  it("empilhado: uma barra por categoria, só o segmento de cima é arredondado, e o eixo vai ao total", () => {
    const { container } = render(<GraficoBarrasAgrupadas empilhado dados={SEMANA} series={SERIES3} />);
    const b = barras(container);
    expect(b).toHaveLength(9);
    expect(b.filter((p) => p.getAttribute("d")?.includes("Q"))).toHaveLength(3);
    expect(b.every((p) => p.getAttribute("class")?.includes("neu-gbar__bar--seg"))).toBe(true);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0", "25", "50", "75", "100"]);
  });

  it("empilhado: o balão lista de cima para baixo e soma o total; em porcentagem mostra a fatia e o bruto", () => {
    const { container, rerender } = render(<GraficoBarrasAgrupadas empilhado dados={SEMANA} series={SERIES3} />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect(texto(container, ".neu-area__tip-row")).toEqual(["C: 10", "B: 20", "A: 40", "Total: 70"]);
    rerender(<GraficoBarrasAgrupadas empilhado="percentual" mostrarBruto dados={SEMANA} series={SERIES3} />);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0%", "25%", "50%", "75%", "100%"]);
    expect(texto(container, ".neu-area__tip-row")).toEqual(["C: 14,3% 10", "B: 28,6% 20", "A: 57,1% 40"]);
  });

  it("faixa de foco: a categoria ativa ganha a faixa e brilha, e as outras esmaecem; o mouse e o teclado a movem", () => {
    const { container } = render(<GraficoBarrasAgrupadas dados={SEMANA} series={SERIES3} />);
    expect(container.querySelector(".neu-gbar__hover")).toBeNull();
    fireEvent.mouseEnter(container.querySelectorAll("svg > rect")[1]);
    expect(container.querySelector(".neu-gbar__hover")).toBeTruthy();
    expect(barras(container).filter((p) => p.getAttribute("class")?.includes("neu-gbar__bar--on"))).toHaveLength(3);
    expect(barras(container).filter((p) => p.getAttribute("class")?.includes("neu-gbar__bar--dim"))).toHaveLength(6);
    expect(container.querySelector(".neu-area__tip-label")?.textContent).toBe("Ter");
    fireEvent.mouseLeave(container.querySelector("svg") as SVGElement);
    expect(container.querySelector(".neu-area__tip")).toBeNull();
    const grupo = screen.getByRole("group", { name: /Use as setas/ });
    fireEvent.keyDown(grupo, { key: "End" });
    expect(container.querySelector(".neu-area__tip-label")?.textContent).toBe("Qua");
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe("Qua: A 60, B 25, C 5");
    fireEvent.keyDown(grupo, { key: "ArrowLeft" });
    expect(container.querySelector(".neu-area__tip-label")?.textContent).toBe("Ter");
    fireEvent.keyDown(grupo, { key: "Escape" });
    expect(container.querySelector(".neu-area__tip")).toBeNull();
  });

  it("diferença entre duas séries: linha com sinal e cor, no balão", () => {
    const { container } = render(<GraficoBarrasAgrupadas mostrarDiferenca rotuloDiferenca="Saldo" dados={[{ name: "X", r: 100, d: 130 }]} series={[{ chave: "r", nome: "R" }, { chave: "d", nome: "D" }]} />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    const linha = container.querySelector(".neu-area__tip-total") as HTMLElement;
    expect(linha.textContent).toBe("Saldo: −30");
    expect(linha.querySelector("b")?.className).toBe("neu-tone-danger");
  });

  it("legenda: apagar uma série tira as barras, alarga as que ficam e reescala; a última visível não se apaga", () => {
    const { container } = render(<GraficoBarrasAgrupadas dados={[{ name: "X", a: 100, b: 10 }]} series={[{ chave: "a", nome: "A" }, { chave: "b", nome: "B" }]} />);
    const larguraAntes = Number(container.querySelector("path.neu-gbar__bar")?.getAttribute("d")?.match(/^M([\d.]+),/)?.[1]);
    const a = screen.getByRole("button", { name: "A" });
    const b = screen.getByRole("button", { name: "B" });
    fireEvent.click(a);
    expect(a.getAttribute("aria-pressed")).toBe("false");
    expect(barras(container)).toHaveLength(1);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0", "2,5", "5", "7,5", "10"]);
    expect(Number(container.querySelector("path.neu-gbar__bar")?.getAttribute("d")?.match(/^M([\d.]+),/)?.[1])).not.toBe(larguraAntes);
    fireEvent.click(b);
    expect(b.getAttribute("aria-pressed")).toBe("true");
    expect(barras(container)).toHaveLength(1);
  });

  it("fendas: um vão afundado atrás de cada barra, e o rótulo do eixo Y gira", () => {
    const { container } = render(<GraficoBarrasAgrupadas fendas rotuloY="Pessoas" dados={SEMANA} series={SERIES3} />);
    expect(container.querySelectorAll(".neu-gbar__slot")).toHaveLength(9);
    expect(container.querySelector(".neu-gbar__ylabel")?.textContent).toBe("Pessoas");
    expect(container.querySelector(".neu-gbar__ylabel")?.getAttribute("transform")).toMatch(/rotate\(-90\)/);
  });

  it("rótulos de dados: pílula acima de cada barra, o pico em destaque, e texto puro quando pedido", () => {
    const { container, rerender } = render(<GraficoBarrasAgrupadas rotulosDados destaque="max" dados={[{ name: "X", valor: 10 }, { name: "Y", valor: 30 }]} />);
    expect(texto(container, ".neu-gbar__dl-text")).toEqual(["10", "30"]);
    expect(container.querySelectorAll(".neu-gbar__dl-pill")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-gbar__dl--peak")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-gbar__dl-led")).toHaveLength(1);
    expect(barras(container).filter((p) => p.getAttribute("class")?.includes("neu-gbar__bar--peak"))).toHaveLength(1);
    rerender(<GraficoBarrasAgrupadas rotulosDados="texto" dados={[{ name: "X", valor: 10 }]} />);
    expect(container.querySelectorAll(".neu-gbar__dl-pill")).toHaveLength(0);
  });

  it("rótulos internos: a fatia dentro de cada segmento, em pílula quando cabe", () => {
    const { container } = render(<GraficoBarrasAgrupadas empilhado="percentual" rotulosInternos larguraMaxBarra={56} dados={[{ name: "X", a: 70, b: 30 }]} series={[{ chave: "a" }, { chave: "b" }]} />);
    expect(texto(container, ".neu-gbar__in-text")).toEqual(["70%", "30%"]);
    expect(container.querySelectorAll(".neu-gbar__in-pill")).toHaveLength(2);
  });

  it("colunas agrupadas e empilhadas: cada pilha com o seu subtotal no balão", () => {
    const { container } = render(
      <GraficoBarrasAgrupadas
        rotulosPilha={{ p1: "Ano 1" }}
        dados={[{ name: "T1", a: 10, b: 5, c: 7 }]}
        series={[{ chave: "a", nome: "A", pilha: "p1" }, { chave: "b", nome: "B", pilha: "p1" }, { chave: "c", nome: "C", pilha: "p2" }]}
      />,
    );
    expect(barras(container)).toHaveLength(3);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect(texto(container, ".neu-area__tip-row")).toEqual(["B: 5", "A: 10", "Ano 1: 15", "C: 7"]);
  });

  it("rótulos longos do eixo X são cortados e levam o texto inteiro no título; sem moldura, só o leito", () => {
    const { container } = render(<GraficoBarrasAgrupadas moldura={false} dados={[{ name: "Categoria muito comprida", valor: 1 }, { name: "B", valor: 2 }, { name: "C", valor: 3 }, { name: "D", valor: 4 }, { name: "E", valor: 5 }, { name: "F", valor: 6 }, { name: "G", valor: 7 }, { name: "H", valor: 8 }]} />);
    expect(container.querySelector(".neu-area")).toBeNull();
    expect(container.querySelector(".neu-area__xtick title")?.textContent).toBe("Categoria muito comprida");
    expect(container.querySelector(".neu-area__xtick")?.textContent).toContain("…");
  });

  it("retanguloArredondado: ponta livre arredondada, nada para altura zero", () => {
    expect(retanguloArredondado(0, 10, 20, 0, 6, false)).toBe("");
    expect(retanguloArredondado(0, 10, 20, 30, 6, false)).toBe("M0,40V16Q0,10 6,10H14Q20,10 20,16V40Z");
    expect(retanguloArredondado(0, 10, 20, 30, 6, true)).toBe("M0,10H20V34Q20,40 14,40H6Q0,40 0,34Z");
    expect(retanguloArredondado(0, 10, 8, 3, 6, false)).toBe("M0,13V13Q0,10 3,10H5Q8,10 8,13V13Z");
  });
});
