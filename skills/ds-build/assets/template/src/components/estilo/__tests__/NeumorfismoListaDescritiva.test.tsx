import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoListaDescritiva, { ListaDescritiva } from "../NeumorfismoListaDescritiva";

const textos = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);

describe("NeumorfismoListaDescritiva", () => {
  it("cartão: o título do DS e as cinco listas do pacote, todas em <dl>", () => {
    const { container } = render(<NeumorfismoListaDescritiva />);
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Lista Descritiva");
    expect(container.querySelectorAll("dl")).toHaveLength(5);
    expect(container.querySelectorAll(".neu-dlp")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-dlg")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-dl")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-dl--stacked")).toHaveLength(1);
    expect(textos(container, ".neu-dl-caption")).toEqual([
      "Painel · rótulo e valor",
      "Grade · 2 colunas",
      "Grade elevada · com ícones · 3 colunas",
      "Linhas divididas (original)",
      "Empilhado",
    ]);
  });

  it("painel: o termo e o valor de cada linha, o selo no valor e o nome acessível", () => {
    const { container } = render(<NeumorfismoListaDescritiva />);
    const painel = container.querySelector(".neu-dlp") as HTMLElement;
    expect(painel.getAttribute("aria-label")).toBe("Dados do atendimento");
    expect(textos(painel, "dt")).toEqual(["Programa", "Empresa atendida", "CNPJ", "Porte", "Setor"]);
    expect(painel.querySelector(".neu-dlp__row:nth-child(3) dd")?.className).toContain("neu-mono");
    expect(painel.querySelector(".neu-dlp__row:nth-child(3) dd")?.textContent).toBe("12.345.678/0001-90");
    expect(painel.querySelector(".neu-dlp__row:nth-child(4) dd .neu-badge")?.textContent).toBe("Microempresa");
    expect(painel.closest(".neu-dlp-wrap")).toBeTruthy();
  });

  it("grade: duas colunas por padrão, três na elevada; ícone decorativo, item que abrange e termo dentro do dt", () => {
    const { container } = render(<NeumorfismoListaDescritiva />);
    const [dois, tres] = [...container.querySelectorAll<HTMLElement>(".neu-dlg")];
    expect(dois.style.getPropertyValue("--dlg-cols")).toBe("2");
    expect(tres.style.getPropertyValue("--dlg-cols")).toBe("3");
    expect(dois.className).not.toContain("neu-dlg--raised");
    expect(tres.className).toContain("neu-dlg--raised");
    expect(dois.querySelector(".neu-dlg__icon")).toBeNull();
    expect(tres.querySelectorAll(".neu-dlg__icon")).toHaveLength(4);
    expect(tres.querySelector(".neu-dlg__icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(tres.querySelectorAll(".neu-dlg__tile--span")).toHaveLength(1);
    expect(tres.querySelector(".neu-dlg__tile--span dt")?.textContent).toBe("Objetivo");
    expect(textos(dois, "dt")).toEqual(["Código do atendimento", "Município", "Consultor responsável", "Data de abertura"]);
    expect(dois.querySelector(".neu-dlg__tile dd")?.className).toContain("neu-mono");
  });

  it("dividida e empilhada: pares dt e dd dentro de div; a empilhada leva a classe própria", () => {
    const { container } = render(<NeumorfismoListaDescritiva />);
    const [dividida, empilhada] = [...container.querySelectorAll<HTMLElement>(".neu-dl")];
    expect(textos(dividida, "dt")).toEqual(["Programa", "Empresa atendida", "CNPJ", "Porte"]);
    expect(textos(empilhada, "dt")).toEqual(["Empresa atendida", "CNPJ", "Porte"]);
    expect(dividida.className).not.toContain("neu-dl--stacked");
    expect(empilhada.className).toContain("neu-dl--stacked");
    expect([...dividida.children].every((el) => el.tagName === "DIV" && el.children.length === 2)).toBe(true);
    expect(container.querySelectorAll(".neu-card--flat")).toHaveLength(2);
  });

  it("painel sem moldura só tem as linhas, com termo com ícone e rótulo", () => {
    const { container } = render(<ListaDescritiva variante="painel" moldura={false} rotulo="Dados" itens={[{ termo: "Local", valor: "Fortaleza", icone: "users" }, { termo: "Outro", valor: "x" }]} />);
    expect(container.querySelector(".neu-dlp")?.className).toContain("neu-dlp--bare");
    expect(container.querySelector("dl")?.getAttribute("aria-label")).toBe("Dados");
    expect(container.querySelectorAll(".neu-dlp__term svg")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-dlp__row")).toHaveLength(2);
  });

  it("padrão: dividida, sem aria-label quando não há rótulo; lista vazia não quebra", () => {
    const { container } = render(<ListaDescritiva itens={[]} />);
    expect(container.querySelector("dl.neu-dl")?.hasAttribute("aria-label")).toBe(false);
    expect(container.querySelectorAll("dt")).toHaveLength(0);
    const g = render(<ListaDescritiva variante="grade" itens={[{ termo: "A", valor: "1" }]} />).container;
    expect(g.querySelector<HTMLElement>(".neu-dlg")?.style.getPropertyValue("--dlg-cols")).toBe("2");
  });
});
