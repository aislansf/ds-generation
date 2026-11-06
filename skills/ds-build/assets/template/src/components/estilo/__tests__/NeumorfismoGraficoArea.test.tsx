import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAreaBasico, { GraficoArea } from "../NeumorfismoGraficoArea";

const DADOS = [
  { name: "10 AM", valor: 85 },
  { name: "1 PM", valor: 110 },
  { name: "4 PM", valor: 95 },
  { name: "7 PM", valor: 105 },
  { name: "10 PM", valor: 78 },
];
const DOIS = [
  { name: "Jan", a: 50, b: -30 },
  { name: "Fev", a: 70, b: -50 },
  { name: "Mar", a: 90, b: 20 },
];

const texto = (c: HTMLElement, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);

describe("NeumorfismoGraficoArea", () => {
  it("cartão: os dois gráficos do pacote, um na marca e o institucional na secundária", () => {
    const { container } = render(<NeumorfismoAreaBasico />);
    expect(container.querySelectorAll(".neu-area")).toHaveLength(2);
    expect(texto(container, ".neu-area__title")).toEqual(["Atendimentos por horário", "Empresas atendidas por mês"]);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Diário");
    expect(container.querySelectorAll(".neu-area__s--royal").length).toBeGreaterThan(0);
    const alturas = [...container.querySelectorAll(".neu-area__plot")].map((p) => (p as HTMLElement).style.height);
    expect(alturas).toEqual(["300px", "220px"]);
  });

  it("o grupo focável lê a série inteira e explica as setas", () => {
    render(<GraficoArea titulo="Atendimentos por horário" nomeSerie="Atendimentos" rotuloX="horário" dados={DADOS} />);
    const grupo = screen.getByRole("group", { name: /Atendimentos por horário\. Atendimentos por horário: 10 AM 85; 1 PM 110; 4 PM 95; 7 PM 105; 10 PM 78\. Use as setas/ });
    expect(grupo.getAttribute("tabindex")).toBe("0");
  });

  it("eixos: valores arredondados no Y, rótulos do X com âncora no começo, no meio e no fim, e piso dado", () => {
    const { container, rerender } = render(<GraficoArea dados={DADOS} />);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0", "50", "100", "150"]);
    expect([...container.querySelectorAll(".neu-area__xtick")].map((t) => t.getAttribute("text-anchor"))).toEqual(["start", "middle", "middle", "middle", "end"]);
    expect(texto(container, ".neu-area__xtick")).toEqual(["10 AM", "1 PM", "4 PM", "7 PM", "10 PM"]);
    rerender(<GraficoArea dados={[{ name: "a", valor: 412 }, { name: "b", valor: 610 }]} minimo={300} />);
    expect(texto(container, ".neu-area__ytick")).toEqual(["300", "400", "500", "600", "700"]);
  });

  it("geometria: largura padrão de 560, primeiro ponto no começo do leito e o último no fim; a curva é suave", () => {
    const { container } = render(<GraficoArea dados={DADOS} />);
    const pontos = [...container.querySelectorAll(".neu-area__dot")];
    expect(pontos).toHaveLength(5);
    expect(pontos[0].getAttribute("cx")).toBe("44");
    expect(pontos[4].getAttribute("cx")).toBe("536");
    expect(pontos.every((p) => p.getAttribute("r") === "3.5")).toBe(true);
    expect(container.querySelector(".neu-area__line")?.getAttribute("d")).toMatch(/^M44,[\d.]+C/);
  });

  it("curva linear usa só segmentos retos; sem anéis, só o ponto ativo aparece", () => {
    const { container } = render(<GraficoArea dados={DADOS} curva="linear" pontos={false} />);
    expect(container.querySelector(".neu-area__line")?.getAttribute("d")).not.toMatch(/C/);
    expect(container.querySelectorAll(".neu-area__dot")).toHaveLength(0);
  });

  it("teclado: → entra no primeiro ponto, End vai ao último, ← volta, Home e Esc; o balão e a região educada anunciam", () => {
    const { container } = render(<GraficoArea nomeSerie="Atendimentos" dados={DADOS} />);
    const grupo = screen.getByRole("group", { name: /Use as setas/ });
    const tip = () => container.querySelector(".neu-area__tip");
    expect(tip()).toBeNull();
    fireEvent.keyDown(grupo, { key: "ArrowRight" });
    expect(tip()?.textContent).toBe("10 AMAtendimentos: 85");
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe("10 AM: Atendimentos 85");
    expect(container.querySelector(".neu-area__dot--on")).toBeTruthy();
    expect(container.querySelector(".neu-area__guide")).toBeTruthy();
    fireEvent.keyDown(grupo, { key: "End" });
    expect(tip()?.textContent).toBe("10 PMAtendimentos: 78");
    expect(tip()?.className).toContain("neu-area__tip--left");
    fireEvent.keyDown(grupo, { key: "ArrowLeft" });
    expect(tip()?.textContent).toBe("7 PMAtendimentos: 105");
    fireEvent.keyDown(grupo, { key: "Home" });
    expect(tip()?.textContent).toBe("10 AMAtendimentos: 85");
    expect(tip()?.className).not.toContain("neu-area__tip--left");
    fireEvent.keyDown(grupo, { key: "x" });
    expect(tip()).toBeTruthy();
    fireEvent.keyDown(grupo, { key: "Escape" });
    expect(tip()).toBeNull();
  });

  it("mouse: passar sobre uma coluna acende o ponto e sair do gráfico apaga; perder o foco também", () => {
    const { container } = render(<GraficoArea dados={DADOS} />);
    const colunas = container.querySelectorAll("svg rect");
    fireEvent.mouseEnter(colunas[2]);
    expect(container.querySelector(".neu-area__tip-label")?.textContent).toBe("4 PM");
    fireEvent.mouseLeave(container.querySelector("svg") as SVGElement);
    expect(container.querySelector(".neu-area__tip")).toBeNull();
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "Home" });
    expect(container.querySelector(".neu-area__tip")).toBeTruthy();
    fireEvent.blur(screen.getByRole("group", { name: /Use as setas/ }));
    expect(container.querySelector(".neu-area__tip")).toBeNull();
  });

  it("formatação: o valor e o rótulo do balão podem ser formatados", () => {
    const { container } = render(<GraficoArea dados={DADOS} formatarValor={(v) => `R$ ${v}`} rotuloTooltip={(d) => `Hora ${d.name}`} />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "ArrowRight" });
    expect(container.querySelector(".neu-area__tip")?.textContent).toBe("Hora 10 AMValor: R$ 85");
    expect(texto(container, ".neu-area__ytick")[1]).toBe("R$ 50");
  });

  it("várias séries: legenda com chaves que ligam e desligam, e a última visível não se apaga", () => {
    const { container } = render(
      <GraficoArea
        dados={DOIS}
        series={[
          { chave: "a", nome: "Norte" },
          { chave: "b", nome: "Sul", tracejada: true },
        ]}
      />,
    );
    expect(container.querySelectorAll(".neu-area__line")).toHaveLength(2);
    expect(container.querySelector(".neu-area__line--dashed")).toBeTruthy();
    const norte = screen.getByRole("button", { name: "Norte" });
    const sul = screen.getByRole("button", { name: "Sul" });
    expect(norte.getAttribute("aria-pressed")).toBe("true");
    expect(norte.className).toContain("neu-area__s--accent");
    expect(sul.className).toContain("neu-area__s--royal");
    fireEvent.click(norte);
    expect(norte.getAttribute("aria-pressed")).toBe("false");
    expect(norte.className).toContain("neu-area__key--off");
    expect(container.querySelectorAll(".neu-area__line")).toHaveLength(1);
    fireEvent.click(sul);
    expect(sul.getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelectorAll(".neu-area__line")).toHaveLength(1);
    fireEvent.click(norte);
    expect(container.querySelectorAll(".neu-area__line")).toHaveLength(2);
  });

  it("empilhado: o balão lista as séries de cima para baixo e soma o total; em porcentagem mostra a fatia", () => {
    const dados = [{ name: "Jan", a: 30, b: 70 }, { name: "Fev", a: 50, b: 50 }];
    const series = [{ chave: "a", nome: "A" }, { chave: "b", nome: "B" }];
    const { container, rerender } = render(<GraficoArea dados={dados} series={series} empilhado />);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "ArrowRight" });
    expect(texto(container, ".neu-area__tip-row")).toEqual(["B: 70", "A: 30", "Total: 100"]);
    rerender(<GraficoArea dados={dados} series={series} empilhado="percentual" />);
    expect(texto(container, ".neu-area__ytick")).toEqual(["0%", "25%", "50%", "75%", "100%"]);
    expect(texto(container, ".neu-area__tip-share")).toEqual([" 70,0%", " 30,0%"]);
  });

  it("valores que cruzam o zero: zonas, linha do zero, sinais nos valores e cor pelo sinal", () => {
    const { container } = render(<GraficoArea dados={DOIS} series={[{ chave: "b", nome: "Sul" }]} comSinal coresPorSinal rotulosZonas={["Ganho", "Perda"]} />);
    expect(texto(container, ".neu-area__zone-label")).toEqual(["Ganho", "Perda"]);
    expect(container.querySelector(".neu-area__zero-shade")).toBeTruthy();
    expect(container.querySelectorAll("clipPath")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-area__s--success .neu-area__line, .neu-area__s--danger .neu-area__line")).toHaveLength(2);
    expect(texto(container, ".neu-area__ytick").some((t) => t?.startsWith("−"))).toBe(true);
    fireEvent.keyDown(screen.getByRole("group", { name: /Use as setas/ }), { key: "ArrowRight" });
    expect(container.querySelector(".neu-area__tip b")?.textContent).toBe("−30");
    expect(container.querySelector(".neu-area__tip b")?.className).toBe("neu-tone-danger");
  });

  it("sem as zonas, não há faixas; sem valores negativos, não há linha do zero", () => {
    const { container, rerender } = render(<GraficoArea dados={DOIS} series={[{ chave: "b" }]} zonas={false} />);
    expect(container.querySelector(".neu-area__zones")).toBeNull();
    rerender(<GraficoArea dados={DADOS} />);
    expect(container.querySelector(".neu-area__zero")).toBeNull();
  });

  it("só linhas: sem preenchimento, com a calha afundada sob a linha e anéis maiores", () => {
    const { container } = render(<GraficoArea dados={DADOS} linhas />);
    expect(container.querySelector(".neu-area__line-track")).toBeTruthy();
    expect(container.querySelector(".neu-area__line--solo")).toBeTruthy();
    expect(container.querySelectorAll("path[fill^='url(']")).toHaveLength(0);
    expect(container.querySelector(".neu-area__dot")?.getAttribute("r")).toBe("4");
  });

  it("sem moldura, só o leito; subtítulo e emblema aparecem no painel", () => {
    const { container, rerender } = render(<GraficoArea dados={DADOS} moldura={false} titulo="T" />);
    expect(container.querySelector(".neu-area")).toBeNull();
    expect(container.querySelector(".neu-area__plot")).toBeTruthy();
    rerender(<GraficoArea dados={DADOS} titulo="T" subtitulo="S" emblema={{ rotulo: "Novo", tom: "sucesso" }} />);
    expect(container.querySelector(".neu-area__sub")?.textContent).toBe("S");
    expect(container.querySelector(".neu-statx__chip--success")?.textContent).toBe("Novo");
  });

  it("rótulos do X podem ser afinados para um conjunto espaçado", () => {
    const dados = Array.from({ length: 9 }, (_, i) => ({ name: `M${i}`, valor: i }));
    const { container } = render(<GraficoArea dados={dados} maxTicksX={3} />);
    expect(texto(container, ".neu-area__xtick")).toEqual(["M0", "M4", "M8"]);
  });
});
