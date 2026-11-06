import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { SuperficiesCores, renderSuperficies } from "../NeumorfismoSuperficies";

const itens = [
  { label: "Background", hex: "#F5F7FA", darkHex: "#06141F", token: "background", cls: "bg-background" },
  { label: "Card", hex: "#FFFFFF", darkHex: "#0E2638", token: "card", cls: "bg-card" },
];

describe("NeumorfismoSuperficies", () => {
  it("uma linha por superfície na Lista descritiva, com o token e os dois hex", () => {
    const { container } = render(<SuperficiesCores itens={itens} />);
    expect(container.querySelector("dl.neu-dlp")?.getAttribute("aria-label")).toBe("Superfícies e fundos");
    expect(container.querySelectorAll(".neu-dlp__row")).toHaveLength(2);
    const linha = container.querySelector(".neu-dlp__row") as HTMLElement;
    expect(within(linha).getByText("Background")).toBeTruthy();
    expect(within(linha).getByText("var(--background)")).toBeTruthy();
    expect(within(linha).getByRole("button", { name: "Copiar código hexadecimal #F5F7FA (claro)" })).toBeTruthy();
    expect(within(linha).getByRole("button", { name: "Copiar código hexadecimal #06141F (escuro)" })).toBeTruthy();
  });

  it("as amostras levam a cor e ficam fora da leitura", () => {
    const { container } = render(<SuperficiesCores itens={itens} />);
    const amostras = container.querySelectorAll<HTMLElement>(".neu-cor__amostra");
    expect(amostras).toHaveLength(4);
    expect(amostras[0].style.backgroundColor).toBe("rgb(245, 247, 250)");
    expect(amostras[0].getAttribute("aria-hidden")).toBe("true");
  });

  it("copiar manda o hex para a área de transferência e mostra o aceno", () => {
    const escrito: string[] = [];
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: (t: string) => escrito.push(t) } });
    render(<SuperficiesCores itens={itens} />);
    fireEvent.click(screen.getAllByRole("button", { name: /\(claro\)/ })[1]);
    expect(escrito).toEqual(["#FFFFFF"]);
  });

  it("no Neumorfismo renderSuperficies devolve a lista; as amostras de sempre ficam para os outros estilos", () => {
    const { container } = render(<div>{renderSuperficies(itens, (s) => <span key={s.label} className="amostra-antiga">{s.label}</span>)}</div>);
    expect(container.querySelector(".neu-cor-lista")).not.toBeNull();
    expect(container.querySelector(".amostra-antiga")).toBeNull();
  });
});
