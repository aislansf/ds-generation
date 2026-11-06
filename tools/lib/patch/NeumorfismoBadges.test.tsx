import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoBadges, { Etiqueta, Selo } from "../NeumorfismoBadges";

describe("NeumorfismoBadges", () => {
  it("mostra os dez selos do pacote em duas linhas, mais as quatro tags", () => {
    const { container } = render(<NeumorfismoBadges />);
    expect(container.querySelectorAll(".neu-badge")).toHaveLength(14);
    expect(container.querySelectorAll(".neu-row")).toHaveLength(3);
    for (const t of ["Ativo", "Info", "Sucesso", "Crítico", "Neutro DS", "INTERATIVO", "4 Estados Táteis", "5 Paletas", "Novo", "ATIVO"]) {
      expect(screen.getByText(t)).toBeTruthy();
    }
  });

  it("variante, tamanho e tom viram classes; o ponto é decorativo", () => {
    const { container } = render(
      <>
        <Selo tom="danger" ponto>Crítico</Selo>
        <Selo variante="inset" tom="accent" tamanho="sm">Meta</Selo>
        <Selo variante="solid" tamanho="sm">Marca</Selo>
        <Selo variante="chip">Novo</Selo>
      </>,
    );
    const [convexo, afundado, solido, chip] = Array.from(container.querySelectorAll(".neu-badge"));
    expect(convexo.className).toContain("neu-badge--convex");
    expect(convexo.className).toContain("neu-tone-danger");
    expect(convexo.querySelector(".neu-dot--danger")?.getAttribute("aria-hidden")).toBe("true");
    expect(afundado.className).toContain("neu-badge--inset");
    expect(afundado.className).toContain("neu-badge--sm");
    expect(solido.className).toContain("neu-badge--solid");
    expect(solido.className).not.toContain("neu-tone-");
    expect(chip.className).toContain("neu-badge--chip");
  });

  it("Tag é um selo convexo pequeno e neutro; o ✕ só aparece com aoRemover e leva o nome do filtro", () => {
    const { container } = render(
      <>
        <Etiqueta aoRemover={() => {}}>Status: Em Execução</Etiqueta>
        <Etiqueta>Microempresa</Etiqueta>
      </>,
    );
    const [removivel, fixa] = Array.from(container.querySelectorAll(".neu-badge"));
    for (const t of [removivel, fixa]) {
      expect(t.className).toContain("neu-badge--convex");
      expect(t.className).toContain("neu-badge--sm");
      expect(t.className).toContain("neu-tone-neutral");
    }
    expect(screen.getByRole("button", { name: "Remover Status: Em Execução" })).toBeTruthy();
    expect(fixa.querySelector("button")).toBeNull();
  });

  it("remover tira o filtro; Restaurar filtros traz de volta; a tag fixa não tem botão", () => {
    render(<NeumorfismoBadges />);
    expect(screen.getAllByRole("button", { name: /^Remover / })).toHaveLength(3);
    expect(screen.queryByRole("button", { name: "Restaurar filtros" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remover Município: Fortaleza" }));
    expect(screen.queryByText("Município: Fortaleza")).toBeNull();
    expect(screen.getAllByRole("button", { name: /^Remover / })).toHaveLength(2);
    expect(screen.getByText("Microempresa")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Restaurar filtros" }));
    expect(screen.getByText("Município: Fortaleza")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Restaurar filtros" })).toBeNull();
  });
});
