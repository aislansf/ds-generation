import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoEtapas from "../NeumorfismoEtapas";

describe("NeumorfismoEtapas", () => {
  it("cartão Stepper: três listas de etapas, cada uma num nav com nome", () => {
    const { container } = render(<NeumorfismoEtapas />);
    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(3);
    expect(navs.map((n) => n.getAttribute("aria-label"))).toEqual(["Etapas do formulário", "Etapas da inscrição", "Etapas compactas"]);
    expect(container.querySelector(".neu-stepv--compact")).toBeTruthy();
    expect(container.querySelectorAll("ol")).toHaveLength(3);
  });

  it("a etapa atual leva aria-current=\"step\" e os leitores ouvem \"Etapa N de M\" e o estado", () => {
    const { container } = render(<NeumorfismoEtapas />);
    expect(container.querySelectorAll('li[aria-current="step"]')).toHaveLength(3);
    expect(screen.getAllByText(/Etapa \d de 4:/, { selector: ".sr-only" }).length).toBeGreaterThan(0);
    for (const palavra of ["Concluída", "Em andamento", "Pendente"]) expect(screen.getAllByText(new RegExp(palavra)).length).toBeGreaterThan(0);
  });

  it("só a etapa atual da trilha vertical mostra a ação, e a navegação avança e volta", () => {
    const { container } = render(<NeumorfismoEtapas />);
    expect(container.querySelectorAll(".neu-stepv__content")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /Continuar revisão/ })).toBeTruthy();
    expect(screen.getByText("Etapa 2 de 4")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Próxima etapa/ }));
    expect(screen.getByText("Etapa 3 de 4")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Voltar/ }));
    expect(screen.getByText("Etapa 2 de 4")).toBeTruthy();
  });

  it("a trilha horizontal enche até a etapa atual e as concluídas trazem o ✓", () => {
    const { container } = render(<NeumorfismoEtapas />);
    const preenchimento = container.querySelector(".neu-stepper__rail > div") as HTMLElement;
    expect(preenchimento.style.width).toBe("33.33333333333333%");
    expect(container.querySelectorAll(".neu-stepper .neu-step--done svg")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /Próxima etapa/ }));
    expect((container.querySelector(".neu-stepper__rail > div") as HTMLElement).style.width).toBe("66.66666666666666%");
  });
});
