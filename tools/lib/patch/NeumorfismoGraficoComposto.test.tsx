import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoComposto, { GraficoComposto } from "../NeumorfismoGraficoComposto";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const graficos = (c: HTMLElement) => [...c.querySelectorAll(".neu-comp")] as HTMLElement[];

describe("NeumorfismoComposto", () => {
  it("cartão: os dois gráficos do pacote, o primeiro com área, barras e linha, o segundo com dois eixos", () => {
    const { container } = render(<NeumorfismoComposto />);
    const [a, b] = graficos(container);
    expect(texto(container, ".neu-area__title")).toEqual(["Funil de atendimento", "Receita e margem"]);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Mensal");
    expect(a.querySelectorAll("path[fill^='url(']")).toHaveLength(7);
    expect(a.querySelectorAll("path.neu-gbar__bar")).toHaveLength(6);
    expect(a.querySelectorAll(".neu-area__line-track")).toHaveLength(1);
    expect(b.querySelectorAll("path.neu-gbar__bar")).toHaveLength(6);
    expect(b.querySelectorAll(".neu-comp__ytick-r")).toHaveLength(4);
    expect(a.querySelectorAll(".neu-comp__ytick-r")).toHaveLength(0);
  });

  it("camadas, de trás para a frente: área, barras, linha de base e linhas", () => {
    const { container } = render(<NeumorfismoComposto />);
    const [a] = graficos(container);
    const svg = a.querySelector("svg") as SVGElement;
    const ordem = [...svg.children].map((e) => e.getAttribute("class") ?? "").filter((c) => /neu-area__s|neu-gbar__base/.test(c));
    expect(ordem.map((c) => (c.includes("neu-gbar__base") ? "base" : "serie"))).toEqual(["serie", "serie", "base", "serie"]);
    const grupos = [...svg.querySelectorAll(":scope > g.neu-area__s")];
    expect(grupos[0].querySelector(".neu-area__line")).toBeTruthy();
    expect(grupos[0].querySelector(".neu-area__line-track")).toBeNull();
    expect(grupos[1].querySelector("path.neu-gbar__bar")).toBeTruthy();
    expect(grupos[2].querySelector(".neu-area__line-track")).toBeTruthy();
  });

  it("cores da paleta de dados na ordem das séries e a legenda mostra o tipo de cada uma", () => {
    const { container } = render(<NeumorfismoComposto />);
    const [a] = graficos(container);
    expect(screen.getByRole("button", { name: "Visitas ao portal" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "Atendimentos" }).className).toContain("neu-area__s--royal");
    expect(screen.getByRole("button", { name: "Conversões" }).className).toContain("neu-area__s--success");
    expect([...a.querySelectorAll(".neu-area__key-dot")].map((i) => i.getAttribute("class")?.match(/neu-comp__key--(\w+)/)?.[1])).toEqual(["area", "barra", "linha"]);
  });

  it("eixo único: valores em pt-BR e o balão traz cada série com o marcador do tipo", () => {
    const { container } = render(<NeumorfismoComposto />);
    const [a] = graficos(container);
    expect(texto(a, ".neu-area__ytick")).toEqual(["0", "500", "1.000", "1.500"]);
    fireEvent.keyDown(a.querySelector(".neu-area__focus") as HTMLElement, { key: "Home" });
    expect(texto(a, ".neu-area__tip-row")).toEqual(["Visitas ao portal: 820", "Atendimentos: 540", "Conversões: 310"]);
    expect([...a.querySelectorAll(".neu-area__tip-dot")].map((i) => i.getAttribute("class")?.match(/neu-comp__dot--(\w+)/)?.[1])).toEqual(["area", "barra", "linha"]);
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("Jan: Visitas ao portal 820, Atendimentos 540, Conversões 310");
  });

  it("segundo eixo: a direita tem escala própria, alinhada às linhas da esquerda, e a legenda marca a série com →", () => {
    const { container } = render(<NeumorfismoComposto />);
    const [, b] = graficos(container);
    const esq = texto(b, ".neu-area__ytick:not(.neu-comp__ytick-r)");
    const dir = texto(b, ".neu-comp__ytick-r");
    expect(esq).toEqual(["R$ 0M", "R$ 1M", "R$ 2M", "R$ 3M"]);
    expect(dir).toEqual(["0%", "10%", "20%", "30%"]);
    expect(dir.every((t) => t?.endsWith("%"))).toBe(true);
    expect(texto(b, ".neu-comp__axis-tag")).toEqual(["→"]);
    expect(b.querySelector(".neu-comp__axis-tag")?.getAttribute("title")).toBe("Eixo direito");
    fireEvent.keyDown(b.querySelector(".neu-area__focus") as HTMLElement, { key: "Home" });
    expect(texto(b, ".neu-area__tip-row")).toEqual(["Receita: R$ 1,8M", "Margem: 18,4%"]);
  });

  it("o nome do grupo lê cada série com o tipo e o eixo", () => {
    render(<NeumorfismoComposto />);
    const nomes = screen.getAllByRole("group", { name: /Use as setas para percorrer as categorias/ }).map((g) => g.getAttribute("aria-label") ?? "");
    expect(nomes[0]).toContain("Visitas ao portal (área): Jan 820");
    expect(nomes[0]).toContain("Atendimentos (barras): Jan 540");
    expect(nomes[0]).toContain("Conversões (linha): Jan 310");
    expect(nomes[1]).toContain("Margem (linha, eixo direito): T1/25 18,4%");
  });

  it("coluna em foco: faixa atrás, barras da coluna brilham e as outras esmaecem, pontos acendem", () => {
    const { container } = render(<NeumorfismoComposto />);
    const [a] = graficos(container);
    expect(a.querySelector(".neu-gbar__hover")).toBeNull();
    fireEvent.mouseEnter(a.querySelectorAll("svg > rect")[2]);
    expect(a.querySelector(".neu-gbar__hover")).toBeTruthy();
    expect(a.querySelectorAll("path.neu-gbar__bar--on")).toHaveLength(1);
    expect(a.querySelectorAll("path.neu-gbar__bar--dim")).toHaveLength(5);
    const aneis = a.querySelectorAll("circle.neu-area__dot--on");
    expect(aneis).toHaveLength(2);
    expect([...aneis].map((c) => c.getAttribute("r")).sort()).toEqual(["6", "6.5"]);
    fireEvent.mouseLeave(a.querySelector("svg") as SVGElement);
    expect(a.querySelector(".neu-area__tip")).toBeNull();
  });

  it("legenda: apagar a série da direita tira o eixo dela e o gráfico reescala; a última não se apaga", () => {
    const { container } = render(<NeumorfismoComposto />);
    const [, b] = graficos(container);
    const margem = screen.getByRole("button", { name: /Margem/ });
    fireEvent.click(margem);
    expect(margem.className).toContain("neu-area__key--off");
    expect(b.querySelectorAll(".neu-comp__ytick-r")).toHaveLength(0);
    expect(b.querySelectorAll(".neu-area__line")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: /Receita/ }));
    expect(b.querySelectorAll("path.neu-gbar__bar")).toHaveLength(6);
  });

  it("série tracejada e só linhas: a amostra e a linha são tracejadas; o tipo padrão é linha; curva linear usa segmentos retos", () => {
    const { container } = render(
      <GraficoComposto curva="linear" dados={[{ name: "A", x: 1, y: 2 }, { name: "B", x: 2, y: 1 }]} series={[{ chave: "x", nome: "X", tracejada: true }, { chave: "y", nome: "Y" }]} />,
    );
    expect(container.querySelectorAll(".neu-area__line--dashed")).toHaveLength(1);
    expect(container.querySelector(".neu-area__key-dot--dashed")).toBeTruthy();
    expect(container.querySelector(".neu-area__line")?.getAttribute("d")).not.toMatch(/C/);
    expect([...container.querySelectorAll(".neu-area__key-dot")].every((i) => i.getAttribute("class")?.includes("neu-comp__key--linha"))).toBe(true);
  });

  it("teclado e rótulos longos: as setas andam pelas categorias e o nome inteiro vai no título; sem moldura, só o leito", () => {
    const { container } = render(<GraficoComposto moldura={false} legenda={false} dados={[{ name: "Uma categoria longuíssima", v: 1 }, { name: "B", v: 2 }, { name: "C", v: 3 }, { name: "D", v: 4 }, { name: "E", v: 5 }, { name: "F", v: 6 }, { name: "G", v: 7 }, { name: "H", v: 8 }]} series={[{ chave: "v", nome: "V", tipo: "barra" }]} />);
    expect(container.querySelector(".neu-area")).toBeNull();
    expect(container.querySelector(".neu-area__legend")).toBeNull();
    expect(container.querySelector(".neu-area__xtick title")?.textContent).toBe("Uma categoria longuíssima");
    const g = screen.getByRole("group", { name: /Use as setas/ });
    fireEvent.keyDown(g, { key: "End" });
    expect(container.querySelector(".neu-area__tip-label")?.textContent).toBe("H");
    fireEvent.keyDown(g, { key: "ArrowLeft" });
    expect(container.querySelector(".neu-area__tip-label")?.textContent).toBe("G");
    fireEvent.keyDown(g, { key: "Escape" });
    expect(container.querySelector(".neu-area__tip")).toBeNull();
  });
});
