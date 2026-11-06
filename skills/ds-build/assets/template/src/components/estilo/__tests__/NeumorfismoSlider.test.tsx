import { beforeAll, describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoSlider from "../NeumorfismoSlider";

describe("NeumorfismoSlider", () => {
  // O Slider (Radix) mede o botão com ResizeObserver, que o jsdom não traz
  beforeAll(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("três sliders no cartão, o primeiro com a calha vazia", () => {
    const { container } = render(<NeumorfismoSlider />);
    expect(screen.getByRole("slider", { name: "Intensidade" }).getAttribute("aria-valuenow")).toBe("6");
    expect(screen.getByRole("slider", { name: "Volume" }).getAttribute("aria-valuenow")).toBe("32");
    expect(screen.getByRole("slider", { name: "Brilho" }).getAttribute("aria-valuenow")).toBe("50");
    expect(container.querySelectorAll(".neu-slider-card .neu-slider")).toHaveLength(3);
    expect(container.querySelectorAll(".neu-slider--vazia")).toHaveLength(1);
  });

  it("setas, Home e End mudam o valor e o texto lido no botão", () => {
    render(<NeumorfismoSlider />);
    const v = screen.getByRole("slider", { name: "Volume" });
    fireEvent.keyDown(v, { key: "ArrowRight" });
    expect(v.getAttribute("aria-valuetext")).toBe("33%");
    fireEvent.keyDown(v, { key: "End" });
    expect(v.getAttribute("aria-valuetext")).toBe("100%");
    fireEvent.keyDown(v, { key: "Home" });
    expect(v.getAttribute("aria-valuetext")).toBe("0%");
  });
});
