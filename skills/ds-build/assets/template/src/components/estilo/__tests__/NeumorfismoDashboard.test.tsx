import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PainelAtendimentos, ExemploPainel } from "../NeumorfismoDashboard";

// A casca mede a si mesma com ResizeObserver, que o jsdom não traz: o stub guarda o callback para o teste "redimensionar"
let aoRedimensionar: ((largura: number) => void) | null = null;
beforeAll(() => {
  globalThis.ResizeObserver = class {
    constructor(cb: ResizeObserverCallback) {
      aoRedimensionar = (largura) => cb([{ contentRect: { width: largura } } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("NeumorfismoDashboard", () => {
  it("casca larga: menu lateral fixo, cabeçalho completo, trilha, título com selo e descrição", () => {
    const { container } = render(<PainelAtendimentos nomeDaMarca="Acme" />, { wrapper: TooltipProvider });
    expect(container.querySelector(".neu-app")).not.toBeNull();
    expect(container.querySelector(".neu-app__side .neu-sidebar")).not.toBeNull();
    expect(container.querySelector("header.neu-header")).not.toBeNull();
    expect(container.querySelector(".neu-header__mark")?.textContent).toBe("Acme");
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    const titulo = screen.getByRole("heading", { level: 1 });
    expect(titulo.textContent).toContain("Painel de atendimentos");
    expect(within(titulo).getByText("Ao vivo")).toBeTruthy();
    expect(container.querySelector(".neu-eyebrow")?.textContent).toBe("Regional Centro-Norte · 2026");
    expect(container.querySelector(".neu-footer-s")).not.toBeNull();
  });

  it("ações do topo: período, atualizar, Exportar e Novo atendimento", () => {
    render(<PainelAtendimentos />, { wrapper: TooltipProvider });
    expect(screen.getByRole("radiogroup", { name: "Período" })).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Período do gráfico" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Atualizar dados" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Exportar/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Novo atendimento/ })).toBeTruthy();
  });

  it("aviso do trimestre pode ser dispensado", () => {
    render(<PainelAtendimentos />, { wrapper: TooltipProvider });
    expect(screen.getByText("Fechamento do trimestre em 12 dias")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByText("Fechamento do trimestre em 12 dias")).toBeNull();
  });

  it("quatro KPIs tingidos, e a tecla de atualizar os troca por esqueletos por cerca de um segundo", () => {
    const { container } = render(<PainelAtendimentos />, { wrapper: TooltipProvider });
    expect(container.querySelectorAll(".neu-grid--fill > .neu-col-3")).toHaveLength(4);
    expect(screen.getByRole("group", { name: /Atendimentos no ano/ })).toBeTruthy();
    expect(screen.getByRole("group", { name: /Satisfação \(NPS\)/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Atualizar dados" }));
    expect(container.querySelectorAll(".neu-dash__kpi-skel")).toHaveLength(4);
    expect(screen.queryByRole("group", { name: /Atendimentos no ano/ })).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(container.querySelectorAll(".neu-dash__kpi-skel")).toHaveLength(0);
    expect(screen.getByRole("group", { name: /Atendimentos no ano/ })).toBeTruthy();
  });

  it("gráficos e cartões de metas, com os títulos do pacote", () => {
    render(<PainelAtendimentos />, { wrapper: TooltipProvider });
    for (const t of ["Atendimentos diários", "Atendimentos por canal", "Meta x realizado", "Satisfação geral", "Ranking por município", "Capacidade das equipes"]) {
      expect(screen.getByText(t)).toBeTruthy();
    }
    expect(screen.getByRole("heading", { name: /Metas por programa/ })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Detalhamento/ })).toBeTruthy();
    expect(screen.getAllByRole("progressbar", { name: /Ocupação/ })).toHaveLength(4);
  });

  it("abas de detalhamento: lista com seleção em lote, fluxo, unidade, documentos e pendências", () => {
    const { container } = render(<PainelAtendimentos />, { wrapper: TooltipProvider });
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Atendimentos", "Fluxo de atendimento", "Unidade", "Documentos", "Pendências"]);
    expect(container.querySelectorAll("tbody tr").length).toBeGreaterThanOrEqual(5);
    expect(screen.getByText("Doces da Serra")).toBeTruthy();
    expect(screen.getByText("Mostrando 1–5 de 10.087 atendimentos")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Fluxo de atendimento" }));
    expect(screen.getByRole("navigation", { name: "Etapas do atendimento" })).toBeTruthy();
    expect(screen.getByText("Quando um atendimento é considerado concluído?")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Unidade" }));
    expect(screen.getByText("Regional Centro-Norte")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Documentos" }));
    expect(screen.getByText("relatorio_trimestral_q3.pdf")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Pendências" }));
    expect(screen.getByText("Nenhuma pendência crítica")).toBeTruthy();
  });

  it("Novo atendimento abre o modal; salvar fecha e mostra o toast de sucesso", () => {
    render(<PainelAtendimentos />, { wrapper: TooltipProvider });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Novo atendimento/ }));
    const modal = screen.getByRole("dialog");
    expect(within(modal).getByRole("heading", { name: "Novo atendimento" })).toBeTruthy();
    expect(within(modal).getByLabelText("Empresa")).toBeTruthy();
    fireEvent.click(within(modal).getByRole("button", { name: "Salvar atendimento" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("Atendimento registrado com sucesso!")).toBeTruthy();
    fireEvent.click(within(document.querySelector(".neu-toast-host") as HTMLElement).getByRole("button", { name: "Fechar" }));
    expect(screen.queryByText("Atendimento registrado com sucesso!")).toBeNull();
  });

  it("abaixo de 1080px o menu fixo some e o cabeçalho compacto abre a gaveta", () => {
    const { container } = render(<PainelAtendimentos />, { wrapper: TooltipProvider });
    act(() => aoRedimensionar?.(800));
    expect(container.querySelector(".neu-app__side")).toBeNull();
    expect(container.querySelector("header.neu-header")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(document.querySelector(".neu-drawer")).not.toBeNull();
    act(() => aoRedimensionar?.(1400));
    expect(container.querySelector(".neu-app__side")).not.toBeNull();
  });

  it("larguraMinima muda o ponto de troca", () => {
    const { container } = render(<PainelAtendimentos larguraMinima={1500} />, { wrapper: TooltipProvider });
    act(() => aoRedimensionar?.(1400));
    expect(container.querySelector(".neu-app__side")).toBeNull();
  });

  it("a casca é um contêiner e o modal fica fora dela, para o position: fixed não ficar preso", () => {
    const { container } = render(<ExemploPainel />, { wrapper: TooltipProvider });
    expect(container.querySelector(".neu-dash-frame > .neu-app")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Novo atendimento/ }));
    expect(screen.getByRole("dialog").closest(".neu-app")).toBeNull();
  });
});
