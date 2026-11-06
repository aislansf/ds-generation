import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoSkeletons, { Esqueleto } from "../NeumorfismoSkeletons";

describe("NeumorfismoSkeletons", () => {
  it("o exemplo do pacote: avatar redondo, título a 33%, linha a 66% e bloco de 80px", () => {
    const { container } = render(<NeumorfismoSkeletons />);
    const formas = Array.from(container.querySelectorAll(".neu-skeleton")) as HTMLElement[];
    expect(formas).toHaveLength(4);
    expect(formas.map((f) => [f.style.width, f.style.height])).toEqual([
      ["40px", "40px"],
      ["33%", "12px"],
      ["66%", "8px"],
      ["100%", "80px"],
    ]);
    expect(formas[0].style.borderRadius).toBe("9999px");
    expect(formas[3].style.borderRadius).toBe("16px");
  });

  it("as formas são decorativas e o contêiner avisa o carregamento", () => {
    const { container } = render(<NeumorfismoSkeletons />);
    for (const f of Array.from(container.querySelectorAll(".neu-skeleton"))) {
      expect(f.getAttribute("aria-hidden")).toBe("true");
    }
    const regiao = screen.getByRole("status");
    expect(regiao.getAttribute("aria-busy")).toBe("true");
    expect(regiao.textContent).toContain("Carregando conteúdo");
  });

  it("animado={false} congela o pulso", () => {
    const { container } = render(
      <>
        <Esqueleto />
        <Esqueleto animado={false} />
      </>,
    );
    const [a, b] = Array.from(container.querySelectorAll(".neu-skeleton"));
    expect(a.className).not.toContain("--static");
    expect(b.className).toContain("neu-skeleton--static");
  });
});
