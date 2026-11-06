import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAreaMultipla from "../NeumorfismoGraficoAreaMultipla";

describe("NeumorfismoAreaMultipla", () => {
  it("cartão: os dois gráficos do pacote, com 2 e 3 séries e uma legenda cada", () => {
    const { container } = render(<NeumorfismoAreaMultipla />);
    expect(container.querySelectorAll(".neu-area")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-area__legend")).toHaveLength(2);
    expect([...container.querySelectorAll(".neu-area")].map((a) => a.querySelectorAll(".neu-area__line").length)).toEqual([2, 3]);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Diário");
  });

  it("as séries seguem a ordem das cores (marca e azul) e a segunda lista escolhe as suas", () => {
    render(<NeumorfismoAreaMultipla />);
    expect(screen.getByRole("button", { name: "iPhone" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "Android" }).className).toContain("neu-area__s--royal");
    expect(screen.getByRole("button", { name: "Presencial" }).className).toContain("neu-area__s--royal");
    expect(screen.getByRole("button", { name: "Online" }).className).toContain("neu-area__s--accent");
    expect(screen.getByRole("button", { name: "Telefone" }).className).toContain("neu-area__s--success");
  });

  it("o grupo focável lê cada série visível, e o preenchimento é mais leve (22%) que o da série única", () => {
    const { container } = render(<NeumorfismoAreaMultipla />);
    const nome = screen.getAllByRole("group", { name: /Use as setas/ })[0].getAttribute("aria-label") ?? "";
    expect(nome).toContain("iPhone por horário: 10 AM 95; 1 PM 110");
    expect(nome).toContain("Android por horário: 10 AM 78");
    expect(container.querySelector("stop")?.getAttribute("stop-opacity")).toBe("0.22");
  });

  it("apagar uma série afunda a chave, tira a linha e reescala o eixo Y; a última visível não se apaga", () => {
    const { container } = render(<NeumorfismoAreaMultipla />);
    const primeiro = container.querySelector(".neu-area") as HTMLElement;
    const iphone = screen.getByRole("button", { name: "iPhone" });
    const android = screen.getByRole("button", { name: "Android" });
    const eixo = () => [...primeiro.querySelectorAll(".neu-area__ytick")].map((t) => t.textContent);
    expect(eixo()).toEqual(["0", "50", "100", "150"]);
    fireEvent.click(iphone);
    expect(iphone.getAttribute("aria-pressed")).toBe("false");
    expect(iphone.className).toContain("neu-area__key--off");
    expect(primeiro.querySelectorAll(".neu-area__line")).toHaveLength(1);
    expect(eixo()).toEqual(["0", "25", "50", "75", "100"]);
    fireEvent.click(android);
    expect(android.getAttribute("aria-pressed")).toBe("true");
    expect(primeiro.querySelectorAll(".neu-area__line")).toHaveLength(1);
  });

  it("o balão lista cada série visível com o nome e o valor", () => {
    const { container } = render(<NeumorfismoAreaMultipla />);
    fireEvent.keyDown(screen.getAllByRole("group", { name: /Use as setas/ })[0], { key: "ArrowRight" });
    expect([...container.querySelectorAll(".neu-area__tip-row")].map((r) => r.textContent)).toEqual(["iPhone: 95", "Android: 78"]);
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe("10 AM: iPhone 95, Android 78");
  });
});
