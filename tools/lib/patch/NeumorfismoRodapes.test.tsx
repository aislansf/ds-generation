import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoRodapes, { Rodape } from "../NeumorfismoRodapes";

describe("NeumorfismoRodapes", () => {
  it("cartão Footer: cinco rodapés, cada um num <footer>, quatro slim e um completo", () => {
    const { container } = render(<NeumorfismoRodapes />);
    expect(container.querySelectorAll("footer")).toHaveLength(5);
    expect(container.querySelectorAll("footer.neu-footer-s")).toHaveLength(4);
    expect(container.querySelectorAll("footer.neu-footer")).toHaveLength(1);
    expect(container.querySelector(".neu-footer-s--royal")).toBeTruthy();
    expect(container.querySelector(".neu-footer-s--compact")).toBeTruthy();
  });

  it("slim: marca em texto ou logo, projeto cortável com o texto inteiro no title, e versão", () => {
    const { container, rerender } = render(<Rodape variante="slim" marca="Sua marca" projeto="Sistema de Gestão Estratégica Digital" versao="v.2.4.1" />);
    expect(container.querySelector(".neu-footer-s__wordmark")?.textContent).toBe("Sua marca");
    expect(container.querySelector(".neu-footer-s__project")?.getAttribute("title")).toBe("Sistema de Gestão Estratégica Digital");
    expect(container.querySelector(".neu-footer-s__sep")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("Versão")).toBeTruthy();
    expect(screen.getByText("v.2.4.1").className).toContain("neu-footer-s__version-value");
    rerender(<Rodape variante="slim" logo={<img alt="Logo" src="x.svg" />} projeto="Projeto" />);
    expect(screen.getByAltText("Logo").closest(".neu-footer-s__logo")).toBeTruthy();
    expect(container.querySelector(".neu-footer-s__wordmark")).toBeNull();
  });

  it("slim: versao falsa esconde a pílula, o rótulo é trocável e a largura máxima vai ao miolo", () => {
    const { container, rerender } = render(<Rodape variante="slim" marca="M" versao={false} />);
    expect(container.querySelector(".neu-footer-s__version")).toBeNull();
    expect(container.querySelector(".neu-footer-s__sep")).toBeNull();
    rerender(<Rodape variante="slim" marca="M" versao="v.3" rotuloVersao="Release" larguraMax={960} />);
    expect(screen.getByText("Release")).toBeTruthy();
    expect((container.querySelector(".neu-footer-s__inner") as HTMLElement).style.maxWidth).toBe("960px");
  });

  it("slim: tom royal, compacto e rente viram classes da faixa", () => {
    const { container } = render(<Rodape variante="slim" tom="royal" compacto rente marca="M" />);
    const f = container.querySelector("footer") as HTMLElement;
    expect(f.className).toBe("neu-footer-s neu-footer-s--royal neu-footer-s--compact neu-footer-s--flush");
  });

  it("completo: marca, descrição, links num nav com nome, e o ambiente com o LED decorativo", () => {
    const { container } = render(<Rodape marca="Sua marca" descricao="Portal" links={["Termos de Uso", "Segurança & LGPD"]} versao="v.1.0" ambiente="Produção" />);
    expect(screen.getByRole("navigation", { name: "Rodapé" })).toBeTruthy();
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-footer__links span[aria-hidden='true']")).toHaveLength(1);
    expect(screen.getByText("Produção").className).toBe("tag");
    expect(container.querySelector(".neu-dot--success")?.getAttribute("aria-hidden")).toBe("true");
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByRole("link", { name: "Termos de Uso" }).dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    fireEvent.click(screen.getByRole("link", { name: "Segurança & LGPD" }));
  });

  it("completo sem links não cria o nav", () => {
    render(<Rodape marca="Sua marca" />);
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.getByText("Ambiente Homologado")).toBeTruthy();
  });
});
