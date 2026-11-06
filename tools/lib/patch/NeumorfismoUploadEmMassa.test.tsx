import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoUploadEmMassa, { UploadEmMassa, formatarTamanho } from "../NeumorfismoUploadEmMassa";

const arquivo = (nome: string, bytes = 1000) => {
  const f = new File(["x"], nome);
  Object.defineProperty(f, "size", { value: bytes });
  return f;
};
const soltar = (c: HTMLElement, ...arquivos: File[]) => fireEvent.drop(c.querySelector(".neu-bulk__drop") as HTMLElement, { dataTransfer: { files: arquivos } });
const estados = (c: HTMLElement) => [...c.querySelectorAll(".neu-bulk__state")].map((e) => e.textContent);

afterEach(() => vi.useRealTimers());

describe("NeumorfismoUploadEmMassa", () => {
  it("cartão: o título do DS e as quatro linhas da referência, com o resumo", () => {
    const { container } = render(<NeumorfismoUploadEmMassa />);
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Upload em Massa com Progresso");
    expect(container.querySelectorAll(".neu-bulk__file")).toHaveLength(4);
    expect(estados(container)).toEqual(["Concluído", "68%", "23%", "Excede 10MB"]);
    expect([...container.querySelectorAll(".neu-bulk__size")].map((e) => e.textContent)).toEqual(["2,4 MB", "860 KB", "4,1 MB", "14,2 MB"]);
    expect(container.querySelector(".neu-bulk__summary")?.textContent).toBe("1 de 4 concluídos · 2 enviando · 1 erroLimpar concluídos");
  });

  it("a área é um botão descrito pela dica montada dos limites; a lista só aparece com arquivos", () => {
    const { container } = render(<UploadEmMassa />);
    const area = container.querySelector(".neu-bulk__drop") as HTMLElement;
    expect(area.getAttribute("role")).toBe("button");
    expect(area.getAttribute("aria-label")).toBe("Arraste arquivos ou clique para selecionar");
    expect(document.getElementById(area.getAttribute("aria-describedby") ?? "")?.textContent).toBe("PDF, XLSX, JPG, PNG · Até 10MB por arquivo · Máximo 20 arquivos");
    expect(container.querySelector(".neu-bulk__list")).toBeNull();
    expect(container.querySelector(".neu-bulk__summary")).toBeNull();
    expect(container.querySelector<HTMLInputElement>("input[type=file]")?.accept).toBe(".pdf,.xlsx,.jpg,.png");
  });

  it("linhas: ícone de estado, tom, trilho com nome e valor, e o ✕ com nome acessível", () => {
    const { container } = render(<NeumorfismoUploadEmMassa />);
    const linhas = [...container.querySelectorAll(".neu-bulk__file")];
    expect(linhas.map((l) => l.getAttribute("data-status"))).toEqual(["concluido", "enviando", "enviando", "erro"]);
    expect(linhas.map((l) => l.querySelector(".neu-bulk__ficon")?.className)).toEqual([
      "neu-bulk__ficon neu-tone-success",
      "neu-bulk__ficon neu-tone-neutral",
      "neu-bulk__ficon neu-tone-neutral",
      "neu-bulk__ficon neu-tone-danger",
    ]);
    const barras = screen.getAllByRole("progressbar");
    expect(barras.map((b) => b.getAttribute("aria-label"))).toEqual([
      "Envio de relatorio_prestacao_contas_2026.pdf",
      "Envio de planilha_atendimentos_outubro.xlsx",
      "Envio de foto_evento_capacitacao.jpg",
      "Envio de contrato_digitalizado_completo.pdf",
    ]);
    expect(barras.map((b) => b.getAttribute("aria-valuenow"))).toEqual(["100", "68", "23", "100"]);
    expect(screen.getByRole("button", { name: "Remover foto_evento_capacitacao.jpg" })).toBeTruthy();
  });

  it("soltar: aceita, simula o envio até concluir e anuncia", () => {
    vi.useFakeTimers();
    const aoMudar = vi.fn();
    const { container } = render(<UploadEmMassa aoMudar={aoMudar} />);
    soltar(container, arquivo("a.pdf", 2 * 1048576));
    expect(estados(container)).toEqual(["0%"]);
    expect(container.querySelector(".neu-bulk__size")?.textContent).toBe("2,0 MB");
    expect(container.querySelector("[aria-live]")?.textContent).toBe("1 arquivo adicionado.");
    act(() => vi.advanceTimersByTime(300));
    expect(Number(estados(container)[0]?.replace("%", ""))).toBeGreaterThan(0);
    act(() => vi.advanceTimersByTime(300 * 20));
    expect(estados(container)).toEqual(["Concluído"]);
    expect(container.querySelector("[aria-live]")?.textContent).toBe("a.pdf enviado.");
    expect(aoMudar).toHaveBeenCalled();
    expect(aoMudar.mock.calls.at(-1)?.[0][0]).toMatchObject({ nome: "a.pdf", estado: "concluido", progresso: 100 });
  });

  it("limites: tipo não aceito e tamanho acima viram erro com o motivo, sem simular", () => {
    vi.useFakeTimers();
    const { container } = render(<UploadEmMassa tamanhoMax={1} />);
    soltar(container, arquivo("a.exe"), arquivo("grande.pdf", 2 * 1048576), arquivo("ok.PNG"));
    expect(estados(container)).toEqual(["Tipo não aceito", "Excede 1MB", "0%"]);
    expect(container.querySelector(".neu-bulk__summary")?.textContent).toContain("0 de 3 concluídos · 1 enviando · 2 erros");
    expect(container.querySelector(".neu-bulk__summary .neu-tone-danger")?.textContent).toContain("2 erros");
  });

  it("no limite de arquivos a área desativa, avisa e ignora o que passa", () => {
    vi.useFakeTimers();
    const { container } = render(<UploadEmMassa maxArquivos={2} />);
    soltar(container, arquivo("a.pdf"), arquivo("b.pdf"), arquivo("c.pdf"));
    expect(container.querySelectorAll(".neu-bulk__file")).toHaveLength(2);
    expect(container.querySelector("[aria-live]")?.textContent).toBe("2 arquivos adicionados; 1 ignorado(s): limite de 2 arquivos.");
    const area = container.querySelector(".neu-bulk__drop") as HTMLElement;
    expect(area.getAttribute("aria-disabled")).toBe("true");
    expect(container.querySelector(".neu-bulk__title")?.textContent).toBe("Limite de 2 arquivos atingido");
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    const abrir = vi.spyOn(input, "click");
    fireEvent.click(area);
    fireEvent.keyDown(area, { key: "Enter" });
    expect(abrir).not.toHaveBeenCalled();
    soltar(container, arquivo("d.pdf"));
    expect(container.querySelectorAll(".neu-bulk__file")).toHaveLength(2);
  });

  it("aoEnviar conduz o andamento: progresso, concluir e falhar", () => {
    let controles: { progresso: (v: number) => void; concluir: () => void; falhar: (m?: string) => void }[] = [];
    const aoEnviar = vi.fn((_f: File, c) => controles.push(c));
    const { container } = render(<UploadEmMassa aoEnviar={aoEnviar} />);
    soltar(container, arquivo("a.pdf"), arquivo("b.pdf"));
    expect(aoEnviar).toHaveBeenCalledTimes(2);
    act(() => controles[0].progresso(42));
    expect(estados(container)).toEqual(["42%", "0%"]);
    act(() => controles[0].concluir());
    act(() => controles[1].falhar("Falha na rede"));
    expect(estados(container)).toEqual(["Concluído", "Falha na rede"]);
    const barras = screen.getAllByRole("progressbar");
    expect(barras[0].firstElementChild?.className).toContain("neu-progress__bar--success");
    expect(barras[1].firstElementChild?.className).toContain("neu-progress__bar--danger");
  });

  it("remover tira a linha, cancela o envio e anuncia; limpar concluídos tira só as concluídas", () => {
    vi.useFakeTimers();
    const { container } = render(<NeumorfismoUploadEmMassa />);
    fireEvent.click(screen.getByRole("button", { name: "Limpar concluídos" }));
    expect(container.querySelectorAll(".neu-bulk__file")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: "Limpar concluídos" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remover foto_evento_capacitacao.jpg" }));
    expect(container.querySelectorAll(".neu-bulk__file")).toHaveLength(2);
    expect(container.querySelector("[aria-live]")?.textContent).toBe("foto_evento_capacitacao.jpg removido.");
    const r = render(<UploadEmMassa />).container;
    soltar(r, arquivo("a.pdf"));
    fireEvent.click(r.querySelector(".neu-bulk__remove") as HTMLElement);
    act(() => vi.advanceTimersByTime(3000));
    expect(r.querySelectorAll(".neu-bulk__file")).toHaveLength(0);
  });

  it("clique, Enter e Espaço abrem o seletor; arrastar acende a área e muda o título", () => {
    const { container } = render(<UploadEmMassa />);
    const area = container.querySelector(".neu-bulk__drop") as HTMLElement;
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    const abrir = vi.spyOn(input, "click");
    fireEvent.click(area);
    fireEvent.keyDown(area, { key: "Enter" });
    fireEvent.keyDown(area, { key: " " });
    fireEvent.keyDown(area, { key: "b" });
    expect(abrir).toHaveBeenCalledTimes(3);
    expect(area.getAttribute("data-dragging")).toBe("false");
    fireEvent.dragEnter(area);
    fireEvent.dragEnter(area);
    expect(area.getAttribute("data-dragging")).toBe("true");
    expect(container.querySelector(".neu-bulk__title")?.textContent).toBe("Solte os arquivos para enviar");
    fireEvent.dragLeave(area);
    expect(area.getAttribute("data-dragging")).toBe("true");
    fireEvent.dragLeave(area);
    expect(area.getAttribute("data-dragging")).toBe("false");
  });

  it("formata tamanhos como o pacote", () => {
    expect(formatarTamanho(512)).toBe("512 B");
    expect(formatarTamanho(860 * 1024)).toBe("860 KB");
    expect(formatarTamanho(4.1 * 1048576)).toBe("4,1 MB");
  });
});
