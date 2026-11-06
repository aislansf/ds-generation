import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoUpload, { Upload } from "../NeumorfismoUpload";

describe("NeumorfismoUpload", () => {
  it("cartão: o título do DS, a área de soltar e as três linhas da referência", () => {
    const { container } = render(<NeumorfismoUpload />);
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Upload");
    expect(container.querySelectorAll(".neu-drop")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-file")).toHaveLength(3);
    expect([...container.querySelectorAll(".neu-file__status")].map((e) => e.textContent)).toEqual(["Concluído", "68%", "Erro"]);
  });

  it("cada linha tem o ícone do estado, o tom e uma barra com nome e valor", () => {
    const { container } = render(<Upload arquivos={[{ nome: "a.pdf", estado: "concluido" }, { nome: "b.xlsx", estado: "enviando", progresso: 68.4 }, { nome: "c.csv", estado: "erro" }]} />);
    const linhas = [...container.querySelectorAll(".neu-file")];
    expect(linhas.map((l) => l.querySelector(".neu-file__icon")?.className)).toEqual([
      "neu-file__icon neu-tone-success",
      "neu-file__icon neu-tone-accent",
      "neu-file__icon neu-tone-danger",
    ]);
    const barras = screen.getAllByRole("progressbar");
    expect(barras.map((b) => b.getAttribute("aria-valuenow"))).toEqual(["100", "68", "100"]);
    expect(barras.map((b) => b.getAttribute("aria-label"))).toEqual(["a.pdf: Concluído", "b.xlsx: 68%", "c.csv: Erro"]);
    expect(barras.every((b) => b.className.includes("neu-progress--thin"))).toBe(true);
    expect(barras[2].firstElementChild?.className).toContain("neu-progress__bar--danger");
    expect(barras[0].firstElementChild?.className).toContain("neu-progress__bar--success");
  });

  it("sem estado informado, a linha vale como concluída; sem arquivos só há a área", () => {
    const { container } = render(<Upload arquivos={[{ nome: "x.png" }]} />);
    expect(container.querySelector(".neu-file__status")?.textContent).toBe("Concluído");
    const vazio = render(<Upload />).container;
    expect(vazio.querySelectorAll(".neu-file")).toHaveLength(0);
    expect(vazio.querySelector(".neu-drop__hint")?.textContent).toMatch(/Até 10MB por arquivo/);
  });

  it("a área é um botão focável, com a dica ligada por aria-describedby", () => {
    const { container } = render(<Upload dica="Só PDF" />);
    const area = container.querySelector(".neu-drop") as HTMLElement;
    expect(area.getAttribute("role")).toBe("button");
    expect(area.tabIndex).toBe(0);
    expect(document.getElementById(area.getAttribute("aria-describedby") ?? "")?.textContent).toBe("Só PDF");
    expect(area.textContent).toContain("Arraste arquivos aqui ou selecione do computador");
  });

  it("clique, Enter e Espaço abrem o seletor uma vez cada; o clique do input não reabre", () => {
    const { container } = render(<Upload />);
    const area = container.querySelector(".neu-drop") as HTMLElement;
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const abrir = vi.spyOn(input, "click");
    fireEvent.click(area);
    fireEvent.keyDown(area, { key: "Enter" });
    fireEvent.keyDown(area, { key: " " });
    fireEvent.keyDown(area, { key: "a" });
    expect(abrir).toHaveBeenCalledTimes(3);
    fireEvent.click(input);
    expect(abrir).toHaveBeenCalledTimes(3);
    expect(input.multiple).toBe(true);
  });

  it("os arquivos escolhidos ou soltos chegam em aoEscolher", () => {
    const aoEscolher = vi.fn();
    const { container } = render(<Upload aoEscolher={aoEscolher} aceita=".pdf" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe(".pdf");
    const a = new File(["x"], "a.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [a] } });
    expect(aoEscolher).toHaveBeenLastCalledWith([a]);
    const b = new File(["y"], "b.pdf", { type: "application/pdf" });
    const area = container.querySelector(".neu-drop") as HTMLElement;
    fireEvent.drop(area, { dataTransfer: { files: [b] } });
    expect(aoEscolher).toHaveBeenLastCalledWith([b]);
    expect(aoEscolher).toHaveBeenCalledTimes(2);
  });

  it("arrastar por cima acende a área (data-over) e sair ou soltar apaga", () => {
    const { container } = render(<Upload />);
    const area = container.querySelector(".neu-drop") as HTMLElement;
    expect(area.getAttribute("data-over")).toBe("false");
    fireEvent.dragOver(area);
    expect(area.getAttribute("data-over")).toBe("true");
    fireEvent.dragLeave(area);
    expect(area.getAttribute("data-over")).toBe("false");
    fireEvent.dragOver(area);
    fireEvent.drop(area, { dataTransfer: { files: [] } });
    expect(area.getAttribute("data-over")).toBe("false");
  });
});
