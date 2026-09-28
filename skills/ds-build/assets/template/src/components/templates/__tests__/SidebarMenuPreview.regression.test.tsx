import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, within } from "@testing-library/react";
import SidebarMenuPreview from "../SidebarMenuPreview";

/**
 * Regressão visual: garante que o Menu Lateral — Componente Final
 * permanece consistente em viewport de 320px, com logo 60×60 e sem
 * cortar o texto "SIGLA" nem os rótulos dos itens.
 *
 * O jsdom não calcula layout, então validamos os contratos de classes
 * Tailwind que evitam o corte (whitespace-nowrap, truncate, min-w-0)
 * e as dimensões fixas exigidas do logo (60×60).
 */
describe("SidebarMenuPreview — 320px / logo 60×60", () => {
  beforeAll(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 320 });
    Object.defineProperty(window, "innerHeight", { writable: true, value: 1600 });
  });

  it("renderiza o logo __BRAND_NAME__ em 60×60 (h-[60px] w-[60px]) em todos os breakpoints", () => {
    render(<SidebarMenuPreview />);
    const logo = screen.getByAltText("__BRAND_NAME__");
    expect(logo.className).toMatch(/(^|\s)h-\[60px\](\s|$)/);
    expect(logo.className).toMatch(/(^|\s)w-\[60px\](\s|$)/);
    expect(logo.className).toMatch(/sm:h-\[60px\]/);
    expect(logo.className).toMatch(/sm:w-\[60px\]/);
    expect(logo.className).toMatch(/shrink-0/);
  });

  it("mantém 'SIGLA' em uma única linha (whitespace-nowrap)", () => {
    render(<SidebarMenuPreview />);
    const sigla = screen.getByText("SIGLA");
    expect(sigla.className).toMatch(/whitespace-nowrap/);
  });

  it("aplica truncate e min-w-0 nos rótulos dos itens para evitar corte/overflow", () => {
    render(<SidebarMenuPreview />);
    const labels = ["Início", "Programas", "Usuários", "Notificações", "Configurações"];
    for (const label of labels) {
      const el = screen.getAllByText(label)[0];
      expect(el.className).toMatch(/truncate/);
      expect(el.className).toMatch(/min-w-0/);
    }
  });

  it("permite empilhamento vertical em telas pequenas (flex-col sm:flex-row)", () => {
    const { container } = render(<SidebarMenuPreview />);
    const root = container.querySelector(".flex.flex-col.sm\\:flex-row");
    expect(root).not.toBeNull();
  });

  it("sidebar usa largura total em mobile e fixa em ≥sm (w-full sm:w-[260px])", () => {
    const { container } = render(<SidebarMenuPreview />);
    const aside = container.querySelector(".bg-sidebar");
    expect(aside).not.toBeNull();
    expect(aside!.className).toMatch(/w-full/);
    expect(aside!.className).toMatch(/sm:w-\[260px\]/);
    expect(aside!.className).toMatch(/max-w-full/);
  });
});
