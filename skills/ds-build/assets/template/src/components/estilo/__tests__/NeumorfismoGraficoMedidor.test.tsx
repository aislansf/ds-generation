import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoMedidor, { GraficoMedidor, arcoMedidor } from "../NeumorfismoGraficoMedidor";

const texto = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);
const medidores = (c: HTMLElement) => [...c.querySelectorAll(".neu-gauge")] as HTMLElement[];
const tamanho = (e: Element | null) => Number((e as HTMLElement).style.fontSize.replace("px", ""));

describe("NeumorfismoMedidor", () => {
  it("cartão: o medidor de quatro anéis com legenda e os dois de um indicador só, sem legenda", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a, b, c] = medidores(container);
    expect(texto(container, ".neu-area__title")).toEqual(["Execução das metas por programa", "Satisfação geral", "Orçamento executado"]);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Anual");
    expect(a.querySelectorAll(".neu-gauge__ring")).toHaveLength(4);
    expect(a.querySelectorAll(".neu-gauge__key")).toHaveLength(4);
    expect(b.querySelectorAll(".neu-gauge__ring")).toHaveLength(1);
    expect(b.querySelector(".neu-gauge__legend")).toBeNull();
    expect(c.querySelector(".neu-gauge__legend")).toBeNull();
    expect(a.querySelector(".neu-gauge__body--side")).toBeTruthy();
    expect(b.querySelector(".neu-gauge__body--side")).toBeNull();
  });

  it("anéis: trilha afundada, borda escura por dentro, borda clara por fora e o arco de valor; sem escala nem meta", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a] = medidores(container);
    const anel = a.querySelector(".neu-gauge__ring") as HTMLElement;
    expect(anel.querySelectorAll(".neu-gauge__track, .neu-gauge__track-shade, .neu-gauge__track-light, .neu-gauge__value")).toHaveLength(4);
    expect(a.querySelector(".neu-gauge__scale")).toBeNull();
    expect(a.querySelector(".neu-gauge__target")).toBeNull();
    expect(a.querySelector(".neu-gauge__base")).toBeTruthy();
    const cores = [...a.querySelectorAll(".neu-gauge__ring")].map((g) => g.getAttribute("class")?.match(/neu-area__s--(\w+)/)?.[1]);
    expect(cores).toEqual(["accent", "royal", "success", "warning"]);
  });

  it("legenda: nome e valor em porcentagem; o centro começa vazio, porque cada anel tem um percentual diferente", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a] = medidores(container);
    expect(texto(a, ".neu-gauge__key")).toEqual(["Agentes locais82%", "Capacitação68%", "Consultoria54%", "Crédito orientado37%"]);
    expect(a.querySelector(".neu-gauge__center")).toBeNull();
    expect(a.querySelectorAll(".neu-gauge__ring--on, .neu-gauge__ring--dim")).toHaveLength(0);
    expect(a.querySelectorAll(".neu-gauge__key[aria-pressed=\"false\"]")).toHaveLength(4);
  });

  it("foco: passar o mouse na chave destaca o anel e esmaece os outros, sem levar valor ao centro", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a] = medidores(container);
    const chave = a.querySelectorAll(".neu-gauge__key")[2];
    fireEvent.mouseEnter(chave);
    expect(a.querySelectorAll(".neu-gauge__ring--on")).toHaveLength(1);
    expect(a.querySelectorAll(".neu-gauge__ring--dim")).toHaveLength(3);
    expect(chave.className).toContain("neu-gauge__key--on");
    expect(a.querySelector(".neu-gauge__center")).toBeNull();
    expect(a.querySelectorAll(".neu-gauge__ring--gray")).toHaveLength(0);
    fireEvent.mouseLeave(chave);
    expect(a.querySelectorAll(".neu-gauge__ring--on, .neu-gauge__ring--dim")).toHaveLength(0);
    expect(chave.className).not.toContain("neu-gauge__key--on");
  });

  it("teclado: as setas andam pelos anéis, com volta; Home, End e Esc; a região educada anuncia", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a] = medidores(container);
    const grupo = screen.getAllByRole("group", { name: /Use as setas para percorrer os indicadores/ })[0];
    const vivo = () => a.querySelector('[aria-live="polite"]')?.textContent;
    fireEvent.keyDown(grupo, { key: "ArrowRight" });
    expect(vivo()).toBe("Agentes locais: 82 de 100");
    fireEvent.keyDown(grupo, { key: "ArrowDown" });
    expect(vivo()).toBe("Capacitação: 68 de 100");
    fireEvent.keyDown(grupo, { key: "End" });
    expect(vivo()).toBe("Crédito orientado: 37 de 100");
    fireEvent.keyDown(grupo, { key: "ArrowRight" });
    expect(vivo()).toBe("Agentes locais: 82 de 100");
    fireEvent.keyDown(grupo, { key: "ArrowLeft" });
    expect(vivo()).toBe("Crédito orientado: 37 de 100");
    fireEvent.keyDown(grupo, { key: "Home" });
    expect(vivo()).toBe("Agentes locais: 82 de 100");
    fireEvent.keyDown(grupo, { key: "x" });
    fireEvent.keyDown(grupo, { key: "Escape" });
    expect(vivo()).toBe("");
    expect(grupo.getAttribute("aria-label")).toContain("Execução das metas por programa. Agentes locais: 82 de 100 (82%); Capacitação: 68 de 100 (68%)");
  });

  it("legenda: clicar seleciona o anel e mostra o valor dele no centro; todos os anéis seguem à vista", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a] = medidores(container);
    const larguraDoArco = Number(a.querySelector(".neu-gauge__track")?.getAttribute("stroke-width"));
    const chaves = [...a.querySelectorAll(".neu-gauge__key")] as HTMLElement[];
    fireEvent.click(chaves[1]);
    expect(chaves[1].getAttribute("aria-pressed")).toBe("true");
    expect(chaves[1].className).toContain("neu-gauge__key--on");
    expect(chaves[1].getAttribute("title")).toBe("Tirar a seleção de Capacitação");
    expect(a.querySelectorAll(".neu-gauge__ring")).toHaveLength(4);
    expect(Number(a.querySelector(".neu-gauge__track")?.getAttribute("stroke-width"))).toBe(larguraDoArco);
    expect(a.querySelectorAll(".neu-gauge__ring--on")).toHaveLength(1);
    expect(a.querySelectorAll(".neu-gauge__ring--dim")).toHaveLength(3);
    expect(a.querySelectorAll(".neu-gauge__ring--gray")).toHaveLength(3);
    expect(a.querySelector(".neu-gauge__ring--on")?.getAttribute("class")).not.toContain("neu-gauge__ring--gray");
    expect(texto(a, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["68%"]);
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("Capacitação: 68 de 100");
  });

  it("legenda: com duas ou mais chaves selecionadas o centro fica vazio; com uma só volta o valor; sem nenhuma, tudo se apaga", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a] = medidores(container);
    const chaves = [...a.querySelectorAll(".neu-gauge__key")] as HTMLElement[];
    fireEvent.click(chaves[0]);
    expect(texto(a, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["82%"]);
    fireEvent.click(chaves[2]);
    expect(a.querySelector(".neu-gauge__center")).toBeNull();
    expect(a.querySelectorAll(".neu-gauge__ring--on")).toHaveLength(2);
    expect(a.querySelectorAll(".neu-gauge__ring--dim")).toHaveLength(2);
    expect(a.querySelectorAll(".neu-gauge__ring--gray")).toHaveLength(2);
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("");
    fireEvent.click(chaves[2]);
    expect(texto(a, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["82%"]);
    fireEvent.click(chaves[0]);
    expect(a.querySelector(".neu-gauge__center")).toBeNull();
    expect(a.querySelectorAll(".neu-gauge__ring--on, .neu-gauge__ring--dim")).toHaveLength(0);
    expect(chaves.every((c) => c.getAttribute("aria-pressed") === "false")).toBe(true);
    expect(chaves[0].getAttribute("title")).toBe("Selecionar Agentes locais");
  });

  it("legenda: passar o mouse numa chave sem seleção não põe valor no centro, e com uma selecionada o centro segue nela", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const [a] = medidores(container);
    const chaves = [...a.querySelectorAll(".neu-gauge__key")] as HTMLElement[];
    fireEvent.click(chaves[3]);
    fireEvent.mouseEnter(chaves[0]);
    expect(texto(a, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["37%"]);
    expect(a.querySelectorAll(".neu-gauge__ring--on")).toHaveLength(2);
    expect(a.querySelector('[aria-live="polite"]')?.textContent).toBe("Agentes locais: 82 de 100");
  });

  it("um indicador: arco grosso, escala nas pontas, meta com rótulo, valor grande e nome embaixo, sem setas", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const b = medidores(container)[1];
    expect(texto(b, ".neu-gauge__scale text")).toEqual(["0", "100"]);
    expect(texto(b, ".neu-gauge__target text")).toEqual(["Meta 85"]);
    expect(b.querySelector(".neu-gauge__target line")).toBeTruthy();
    expect(texto(b, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["78%", "Satisfação"]);
    expect(tamanho(b.querySelector(".neu-gauge__c-value"))).toBeLessThanOrEqual(36);
    const grupo = b.querySelector(".neu-gauge__focus") as HTMLElement;
    expect(grupo.getAttribute("aria-label")).toBe("Satisfação geral. Satisfação: 78 de 100 (78%); meta 85.");
    expect(b.querySelector(".neu-gauge__ring")?.getAttribute("class")).toContain("neu-area__s--success");
  });

  it("máximo próprio: a escala vai até 4.800, o centro mostra o valor formatado e o texto se ajusta ao vão", () => {
    const { container } = render(<NeumorfismoMedidor />);
    const c = medidores(container)[2];
    expect(texto(c, ".neu-gauge__scale text")).toEqual(["0", "4.800"]);
    expect(texto(c, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["3.120", "Executado"]);
    const fs = tamanho(c.querySelector(".neu-gauge__c-value"));
    expect(fs).toBeGreaterThan(14);
    expect(fs).toBeLessThan(36);
    expect(c.querySelector(".neu-gauge__focus")?.getAttribute("aria-label")).toBe("Orçamento executado. Executado: 3.120 de 4.800 (65%).");
  });

  it("com vários anéis, o centro traz só o valor do anel selecionado, sem nome nem fração, mesmo com máximo diferente de 100", () => {
    const { container } = render(<GraficoMedidor dados={[{ nome: "A", valor: 30, max: 60 }, { nome: "B", valor: 10, max: 40 }]} formatarValor={(n) => `${n} u`} />);
    expect(container.querySelector(".neu-gauge__center")).toBeNull();
    fireEvent.click(container.querySelectorAll(".neu-gauge__key")[0]);
    expect(texto(container, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["30 u"]);
    expect(texto(container, ".neu-gauge__key-val")).toEqual(["30 u", "10 u"]);
  });

  it("destaque escolhe o anel do centro enquanto nada está selecionado; escala e legenda podem ser desligadas; valor zero não desenha arco", () => {
    const { container } = render(<GraficoMedidor dados={[{ nome: "A", valor: 0 }, { nome: "B", valor: 50 }]} destaque={1} legenda={false} />);
    expect(texto(container, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["50%"]);
    expect(container.querySelector(".neu-gauge__legend")).toBeNull();
    expect(container.querySelectorAll(".neu-gauge__value")).toHaveLength(1);
    const unico = render(<GraficoMedidor dados={[{ nome: "U", valor: 10 }]} escala={false} />).container;
    expect(unico.querySelector(".neu-gauge__scale")).toBeNull();
  });

  it("arcoMedidor: do começo (esquerda) ao fim (direita) do meio disco", () => {
    expect(arcoMedidor(100, 100, 50, 0, 1)).toBe("M50.00,100.00A50,50 0 0 1 150.00,100.00");
    expect(arcoMedidor(100, 100, 50, 0, 0.5)).toBe("M50.00,100.00A50,50 0 0 1 100.00,50.00");
  });

  it("sem moldura só o medidor; porcentagem desligada mostra o número cru; tons escolhidos", () => {
    const { container } = render(<GraficoMedidor moldura={false} porcentagem={false} destaque={0} tons={["perigo", "atencao"]} dados={[{ nome: "A", valor: 70 }, { nome: "B", valor: 20 }]} />);
    expect(container.querySelector(".neu-area")).toBeNull();
    expect(texto(container, ".neu-gauge__center span, .neu-gauge__center b")).toEqual(["70"]);
    expect([...container.querySelectorAll(".neu-gauge__ring")].map((g) => g.getAttribute("class")?.match(/neu-area__s--(\w+)/)?.[1])).toEqual(["danger", "warning"]);
  });
});
