import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { HeaderPreview, headerVariants } from "@/pages/TemplatesPage";

const widths = [320, 375, 768, 1024, 1440];
const variant = headerVariants.find((v) => v.id === "int-visual-business")!;

function setViewport(w: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: w });
  window.dispatchEvent(new Event("resize"));
}

describe("HeaderPreview composição visual — dimensões fixas", () => {
  it("variante existe", () => {
    expect(variant).toBeTruthy();
    expect(variant.visualBanner?.height).toBe(112);
  });

  for (const w of widths) {
    it(`mantém banner 112px e header 36-52px em ${w}px`, () => {
      setViewport(w);
      const { container } = render(<HeaderPreview variant={variant} />);
      const banner = container.querySelector('[role="img"]') as HTMLElement;
      const headerBar = banner.nextElementSibling as HTMLElement;
      expect(banner.style.height).toBe("112px");
      expect(headerBar.style.height).toBe("36px");
      expect(headerBar.style.minHeight).toBe("36px");
      expect(headerBar.style.maxHeight).toBe("52px");
    });
  }
});