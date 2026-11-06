import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoRosca, { GraficoRosca, caminhoArco } from "../NeumorfismoGraficoRosca";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const roscas = (c: HTMLElement) => [...c.querySelectorAll(".neu-donut")] as HTMLElement[];

describe("NeumorfismoRosca", () => {
  it("cartão: as duas roscas do pacote, a primeira com rótulos externos e a segunda compacta e sem rótulos", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a, b] = roscas(container);
    expect(texto(container, ".neu-area__title")).toEqual(["Atendimentos por canal", "Empresas por porte"]);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Mensal");
    expect(a.querySelectorAll("path.neu-donut__seg")).toHaveLength(4);
    expect(a.querySelectorAll(".neu-donut__label")).toHaveLength(4);
    expect(b.querySelectorAll("path.neu-donut__seg")).toHaveLength(3);
    expect(b.querySelectorAll(".neu-donut__label")).toHaveLength(0);
    expect(a.querySelector(".neu-area__plot, .neu-donut__plot")?.getAttribute("style")).toContain("height: 300px");
    expect(b.querySelector(".neu-donut__plot")?.getAttribute("style")).toContain("height: 220px");
  });

  it("base neumórfica: disco em relevo, canal afundado e botão convexo no meio, centrados", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a] = roscas(container);
    const base = a.querySelector(".neu-donut__base") as HTMLElement;
    const trilha = a.querySelector(".neu-donut__track") as HTMLElement;
    const miolo = a.querySelector(".neu-donut__well") as HTMLElement;
    expect([base.style.width, trilha.style.width, miolo.style.width]).toEqual(["224px", "204px", "108px"]);
    expect(base.style.left).toBe("168px");
    expect(trilha.style.left).toBe("178px");
  });

  it("fatias: porcentagens de cada canal nos rótulos, na ordem, com o nome e a porcentagem", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a] = roscas(container);
    expect(texto(a, ".neu-donut__label-name")).toEqual(["Presencial ", "Online ", "Telefone ", "WhatsApp "]);
    expect(texto(a, ".neu-donut__label-pct")).toEqual(["42%", "31%", "16%", "11%"]);
    expect(texto(a, ".neu-area__key")).toEqual(["Presencial42%", "Online31%", "Telefone16%", "WhatsApp11%"]);
  });

  it("cores: a paleta de dados em ordem, e a segunda rosca usa as cores escolhidas", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a, b] = roscas(container);
    expect([...a.querySelectorAll("path.neu-donut__seg")].map((p) => p.getAttribute("class")?.match(/neu-area__s--(\w+)/)?.[1])).toEqual(["accent", "royal", "success", "warning"]);
    expect([...b.querySelectorAll("path.neu-donut__seg")].map((p) => p.getAttribute("class")?.match(/neu-area__s--(\w+)/)?.[1])).toEqual(["royal", "accent", "success"]);
  });

  it("arcos: cada fatia é um caminho de anel com vão, e as fatias somam uma volta menos os vãos", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a] = roscas(container);
    const d = [...a.querySelectorAll("path.neu-donut__seg")].map((p) => p.getAttribute("d") ?? "");
    expect(d.every((x) => /^M[-\d.]+,[-\d.]+A100,100 0 [01] 1 .*A60,60 0 [01] 0 .*Z$/.test(x))).toBe(true);
    expect(d[0]).toContain("0 0 1");
    expect(caminhoArco(0, 0, 10, 5, 0, Math.PI / 2)).toBe("M10,0A10,10 0 0 1 6.123233995736766e-16,10L3.061616997868383e-16,5A5,5 0 0 0 5,0Z");
    expect(caminhoArco(0, 0, 10, 5, 0, Math.PI * 1.5)).toContain("0 1 1");
  });

  it("centro: o total e o nome do centro; passar o mouse numa fatia mostra a fatia, e sair volta ao total", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a] = roscas(container);
    const centro = () => texto(a, ".neu-donut__center span, .neu-donut__center b");
    expect(centro()).toEqual(["Atendimentos", "1.000"]);
    fireEvent.mouseEnter(a.querySelectorAll("path.neu-donut__seg")[0]);
    expect(centro()).toEqual(["Presencial", "420", "42% do total"]);
    expect(a.querySelectorAll("path.neu-donut__seg--on")).toHaveLength(1);
    expect(a.querySelectorAll("path.neu-donut__seg--dim")).toHaveLength(3);
    expect(a.querySelectorAll(".neu-donut__label--dim")).toHaveLength(3);
    expect(a.querySelector("path.neu-donut__seg--on")?.getAttribute("transform")).toMatch(/^translate\(/);
    fireEvent.mouseLeave(a.querySelector("svg") as SVGElement);
    expect(centro()).toEqual(["Atendimentos", "1.000"]);
  });

  it("a fatia ativa salta 6px para fora; as outras ficam no lugar", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a] = roscas(container);
    fireEvent.mouseEnter(a.querySelectorAll("path.neu-donut__seg")[1]);
    const mov = [...a.querySelectorAll("path.neu-donut__seg")].map((p) => p.getAttribute("transform"));
    expect(mov[0]).toBe("translate(0,0)");
    const [, dx, dy] = (mov[1] ?? "").match(/translate\(([-\d.]+),([-\d.]+)\)/) ?? [];
    expect(Math.hypot(Number(dx), Number(dy))).toBeCloseTo(6, 5);
  });

  it("teclado: as setas andam pelas fatias, com volta; Home, End e Esc; a região educada anuncia", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a] = roscas(container);
    const grupo = screen.getAllByRole("group", { name: /Use as setas para percorrer as fatias/ })[0];
    const vivo = () => a.querySelector('[aria-live="polite"]')?.textContent;
    fireEvent.keyDown(grupo, { key: "ArrowRight" });
    expect(vivo()).toBe("Presencial: 420, 42%");
    fireEvent.keyDown(grupo, { key: "ArrowDown" });
    expect(vivo()).toBe("Online: 310, 31%");
    fireEvent.keyDown(grupo, { key: "End" });
    expect(vivo()).toBe("WhatsApp: 110, 11%");
    fireEvent.keyDown(grupo, { key: "ArrowRight" });
    expect(vivo()).toBe("Presencial: 420, 42%");
    fireEvent.keyDown(grupo, { key: "ArrowLeft" });
    expect(vivo()).toBe("WhatsApp: 110, 11%");
    fireEvent.keyDown(grupo, { key: "Home" });
    expect(vivo()).toBe("Presencial: 420, 42%");
    fireEvent.keyDown(grupo, { key: "x" });
    expect(vivo()).toBe("Presencial: 420, 42%");
    fireEvent.keyDown(grupo, { key: "Escape" });
    expect(vivo()).toBe("");
    expect(grupo.getAttribute("aria-label")).toContain("Atendimentos por canal. Total 1.000. Presencial 420 (42%); Online 310 (31%)");
  });

  it("legenda: passar o mouse na chave destaca a fatia; clicar a esconde e recalcula as porcentagens; a última não se esconde", () => {
    const { container } = render(<NeumorfismoRosca />);
    const [a] = roscas(container);
    const online = within(a, "Online");
    fireEvent.mouseEnter(online);
    expect(a.querySelectorAll("path.neu-donut__seg--on")).toHaveLength(1);
    fireEvent.click(online);
    expect(online.getAttribute("aria-pressed")).toBe("false");
    expect(a.querySelectorAll("path.neu-donut__seg")).toHaveLength(3);
    expect(texto(a, ".neu-donut__label-pct")).toEqual(["61%", "23%", "16%"]);
    expect(texto(a, ".neu-donut__center b")).toEqual(["690"]);
    fireEvent.mouseEnter(online);
    expect(a.querySelectorAll("path.neu-donut__seg--on")).toHaveLength(0);
    fireEvent.click(within(a, "Presencial"));
    fireEvent.click(within(a, "Telefone"));
    fireEvent.click(within(a, "WhatsApp"));
    expect(a.querySelectorAll("path.neu-donut__seg")).toHaveLength(1);
    expect(within(a, "WhatsApp").getAttribute("aria-pressed")).toBe("true");
    expect(container).toBeTruthy();
  });

  it("fatias pequenas ficam sem rótulo (abaixo de 3%), mas continuam na legenda; uma fatia só ocupa o anel inteiro", () => {
    const { container, rerender } = render(<GraficoRosca dados={[{ nome: "A", valor: 98 }, { nome: "B", valor: 2 }]} />);
    expect(container.querySelectorAll(".neu-donut__label")).toHaveLength(1);
    expect(texto(container, ".neu-area__key")).toEqual(["A98%", "B2%"]);
    rerender(<GraficoRosca dados={[{ nome: "A", valor: 95.5 }, { nome: "B", valor: 4.5 }]} minPercentualRotulo={0} />);
    expect(texto(container, ".neu-donut__label-pct")).toEqual(["96%", "4,5%"]);
    rerender(<GraficoRosca dados={[{ nome: "Único", valor: 5 }]} />);
    expect(container.querySelectorAll("path.neu-donut__seg")).toHaveLength(1);
  });

  it("opções: sem legenda, sem moldura, formato do valor e centro com subtítulo; nomes e valores por chaves", () => {
    const { container } = render(
      <GraficoRosca moldura={false} legenda={false} rotulos={false} formatarValor={(v) => `R$ ${v}`} subCentro="mil" chaveNome="n" chaveValor="v" dados={[{ n: "X", v: 3 }, { n: "Y", v: 1 }]} />,
    );
    expect(container.querySelector(".neu-area")).toBeNull();
    expect(container.querySelector(".neu-area__legend")).toBeNull();
    expect(texto(container, ".neu-donut__center span, .neu-donut__center b")).toEqual(["Total", "R$ 4", "mil"]);
  });
});

// a chave da legenda de uma fatia, pelo nome
function within(c: Element, nome: string): HTMLElement {
  const chave = [...c.querySelectorAll(".neu-area__key")].find((k) => k.textContent?.startsWith(nome));
  if (!chave) throw new Error(`sem chave ${nome}`);
  return chave as HTMLElement;
}
