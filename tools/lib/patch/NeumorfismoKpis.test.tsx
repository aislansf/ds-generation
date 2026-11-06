import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Clock } from "lucide-react";
import NeumorfismoKpis, { CartaoKpi, direcaoDe } from "../NeumorfismoKpis";

describe("NeumorfismoKpis", () => {
  it("vitrine: três grandes, quatro tingidos e três em linha, cada um um grupo nomeado", () => {
    const { container } = render(<NeumorfismoKpis />);
    expect(container.querySelectorAll(".neu-kpi")).toHaveLength(3);
    expect(container.querySelectorAll(".neu-kpi-t")).toHaveLength(4);
    expect(container.querySelectorAll(".neu-kpi-i")).toHaveLength(3);
    expect(screen.getByRole("group", { name: "Escolas atendidas: 12.847" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Orçamento anual: R$ 1,2B" })).toBeTruthy();
    expect(screen.getAllByRole("progressbar")).toHaveLength(3);
  });

  it("grande: ícone, pílula de variação, rótulo em caixa-alta acima do valor, dica e barra fina com o tom certo", () => {
    const { container } = render(
      <CartaoKpi icone={Clock} tom="atencao" tendencia="-15,4%" maiusculas rotulo="Pendências" valor="23" dica="Ajuste pendente" progresso={22} tomProgresso="atencao" />,
    );
    expect(container.querySelector(".neu-kpi__icon.neu-tone-warning svg")).toBeTruthy();
    expect(container.querySelector(".neu-kpi__label--caps")?.textContent).toBe("Pendências");
    const ordem = [...container.querySelectorAll(".neu-kpi__label, .neu-kpi__value")].map((e) => e.className);
    expect(ordem).toEqual(["neu-kpi__label neu-kpi__label--caps", "neu-kpi__value"]);
    expect(container.querySelector(".neu-kpi__hint")?.textContent).toBe("Ajuste pendente");
    const barra = screen.getByRole("progressbar", { name: "Pendências" });
    expect(barra.getAttribute("aria-valuenow")).toBe("22");
    expect(barra.className).toContain("neu-progress--thin");
    expect(barra.querySelector(".neu-progress__bar--warning")).toBeTruthy();
  });

  it("grande sem caixa-alta: o rótulo vem depois do valor; a barra é da marca, ou azul quando o tom é azul", () => {
    const { container, rerender } = render(<CartaoKpi tom="marca" rotulo="Atendimentos" valor="10" progresso={40} />);
    expect([...container.querySelectorAll(".neu-kpi__label, .neu-kpi__value")].map((e) => e.className)).toEqual(["neu-kpi__value", "neu-kpi__label"]);
    expect(container.querySelector(".neu-progress__bar")?.className).toBe("neu-progress__bar");
    rerender(<CartaoKpi tom="azul" rotulo="Atendimentos" valor="10" progresso={40} />);
    expect(container.querySelector(".neu-progress__bar--royal")).toBeTruthy();
    rerender(<CartaoKpi rotulo="Atendimentos" valor="10" />);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("pílula: a seta mostra o sentido, o texto escondido o diz, e o sinal de mais aparece só na alta", () => {
    const { container, rerender } = render(<CartaoKpi rotulo="A" valor="1" tendencia="12,3%" />);
    const pilula = () => container.querySelector(".neu-trend") as HTMLElement;
    expect(pilula().className).toBe("neu-trend neu-trend--up");
    expect(pilula().textContent).toBe("↑ +12,3% (alta)");
    expect(pilula().querySelector(".sr-only")?.textContent).toBe(" (alta)");
    rerender(<CartaoKpi rotulo="A" valor="1" tendencia="-15,4%" />);
    expect(pilula().className).toBe("neu-trend neu-trend--down");
    expect(pilula().textContent).toBe("↓ -15,4% (queda)");
    rerender(<CartaoKpi rotulo="A" valor="1" tendencia="+8,7%" />);
    expect(pilula().textContent).toBe("↑ +8,7% (alta)");
    rerender(<CartaoKpi rotulo="A" valor="1" tendencia="0%" />);
    expect(pilula().className).toBe("neu-trend neu-trend--flat");
    expect(pilula().textContent).toBe("→ 0% (estável)");
  });

  it("tingido: ícone esculpido no tom, variação no canto com seta, valor, rótulo e comparação", () => {
    const { container } = render(<CartaoKpi variante="tingida" tom="sucesso" tendencia="+8,7%" rotulo="Recursos" valor="R$ 847M" dica="vs. R$ 779M" />);
    const grupo = screen.getByRole("group", { name: "Recursos: R$ 847M" });
    expect(within(grupo).getByText("R$ 847M").className).toBe("neu-kpi-t__value");
    expect(container.querySelector(".neu-kpi-t__icon--success")?.getAttribute("aria-hidden")).toBe("true");
    const tendencia = container.querySelector(".neu-kpi-t__trend--up") as HTMLElement;
    expect(tendencia.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(tendencia.textContent).toBe("+8,7% (alta)");
    expect(container.querySelector(".neu-kpi-t__hint")?.textContent).toBe("vs. R$ 779M");
  });

  it("tingido: queda e estável trocam a seta e o texto falado; sem tendência não há canto", () => {
    const { container, rerender } = render(<CartaoKpi variante="tingida" tendencia="-15,4%" rotulo="P" valor="23" />);
    expect(container.querySelector(".neu-kpi-t__trend--down .sr-only")?.textContent).toBe(" (queda)");
    rerender(<CartaoKpi variante="tingida" tendencia="→ 0%" rotulo="P" valor="23" />);
    expect(container.querySelector(".neu-kpi-t__trend--flat .sr-only")?.textContent).toBe(" (estável)");
    rerender(<CartaoKpi variante="tingida" rotulo="P" valor="23" />);
    expect(container.querySelector(".neu-kpi-t__trend")).toBeNull();
    expect(container.querySelector(".neu-kpi-t__hint")).toBeNull();
  });

  it("linha: valor, rótulo e variação na mesma linha, com o sentido pelo texto ou pela propriedade", () => {
    const { container } = render(
      <>
        <CartaoKpi variante="linha" valor="5.423" rotulo="Municípios" tendencia="↑ 2%" />
        <CartaoKpi variante="linha" valor="R$ 1,2B" rotulo="Orçamento" tendencia="→ 0%" direcao="estavel" />
        <CartaoKpi variante="linha" valor="9" rotulo="Queda" tendencia="↓ 3%" />
        <CartaoKpi variante="linha" valor="1" rotulo="Sem" />
      </>,
    );
    const linhas = [...container.querySelectorAll(".neu-kpi-i")];
    expect(linhas.map((l) => l.querySelector(".neu-kpi-i__trend")?.className ?? null)).toEqual([
      "neu-kpi-i__trend neu-kpi-i__trend--up",
      "neu-kpi-i__trend neu-kpi-i__trend--flat",
      "neu-kpi-i__trend neu-kpi-i__trend--down",
      null,
    ]);
    expect(linhas[0].textContent).toBe("5.423Municípios↑ 2%");
  });

  it("direcaoDe: a propriedade vence; sinal de menos ou ↓ cai; → ou zero fica; o resto sobe", () => {
    expect(direcaoDe("12,3%")).toBe("alta");
    expect(direcaoDe("+12,3%")).toBe("alta");
    expect(direcaoDe("-15,4%")).toBe("queda");
    expect(direcaoDe("−1%")).toBe("queda");
    expect(direcaoDe("↓ 3%")).toBe("queda");
    expect(direcaoDe("→ 0%")).toBe("estavel");
    expect(direcaoDe("0%")).toBe("estavel");
    expect(direcaoDe("+0,0%")).toBe("estavel");
    expect(direcaoDe("0% em relação ao mês anterior")).toBe("estavel");
    expect(direcaoDe("0,5%")).toBe("alta");
    expect(direcaoDe("10%")).toBe("alta");
    expect(direcaoDe(undefined)).toBe("alta");
    expect(direcaoDe("12%", "queda")).toBe("queda");
  });
});
