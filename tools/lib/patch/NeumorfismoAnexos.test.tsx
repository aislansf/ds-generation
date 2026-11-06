import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAnexos, { Anexo, GrupoAnexos } from "../NeumorfismoAnexos";

afterEach(() => vi.useRealTimers());

describe("NeumorfismoAnexos", () => {
  it("cartão: o título, os dois grupos (fileira e grade) e os anexos da referência", () => {
    const { container } = render(<NeumorfismoAnexos />);
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Anexos");
    const grupos = [...container.querySelectorAll(".neu-attach-group")];
    expect(grupos.map((g) => g.getAttribute("aria-label"))).toEqual(["Imagens anexadas", "Galeria"]);
    expect(grupos[0].className).not.toContain("neu-attach-group--grid");
    expect(grupos[1].className).toContain("neu-attach-group--grid");
    expect(container.querySelectorAll(".neu-attach-group__item")).toHaveLength(7);
    expect(container.querySelectorAll(".neu-attach")).toHaveLength(13);
    expect(container.querySelectorAll(".neu-attach--vertical")).toHaveLength(7);
  });

  it("ícone pelo tipo do arquivo, ícone próprio e erro com o alerta", () => {
    const { container } = render(
      <>
        <Anexo nome="a.pdf" />
        <Anexo nome="b.xlsx" />
        <Anexo nome="c.tsx" />
        <Anexo nome="d.zip" />
        <Anexo nome="e.png" />
        <Anexo nome="f.xyz" />
        <Anexo nome="g.pdf" icone="mail" />
      </>,
    );
    const formas = [...container.querySelectorAll(".neu-attach__media svg")].map((s) => s.innerHTML);
    expect(new Set(formas).size).toBe(6);
    expect(formas[0]).toBe(formas[5]);
  });

  it("ocioso: nome com dica, metadados, sem barra e sem ações quando não há callbacks", () => {
    const { container } = render(<Anexo nome="relatorio-trimestral-q3.pdf" meta="PDF · 2,4 MB · 12 páginas" />);
    expect(container.querySelector(".neu-attach__title")?.getAttribute("title")).toBe("relatorio-trimestral-q3.pdf");
    expect(container.querySelector(".neu-attach__desc")?.textContent).toBe("PDF · 2,4 MB · 12 páginas");
    expect(container.querySelector(".neu-attach--ocioso")).not.toBeNull();
    expect(container.querySelector(".neu-attach__actions")).toBeNull();
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    expect(container.querySelector(".neu-attach")?.hasAttribute("aria-busy")).toBe(false);
    expect(container.querySelector(".neu-attach__main")?.tagName).toBe("DIV");
  });

  it("enviando: texto e barra com progresso, aria-busy, e o ✕ vira cancelar o envio", () => {
    const aoRemover = vi.fn();
    const { container } = render(<Anexo nome="painel.pdf" estado="enviando" progresso={63.6} aoRemover={aoRemover} />);
    expect(container.querySelector(".neu-attach__desc")?.textContent).toBe("Enviando · 64%");
    expect(container.querySelector(".neu-attach")?.getAttribute("aria-busy")).toBe("true");
    const barra = screen.getByRole("progressbar", { name: "Envio de painel.pdf" });
    expect(barra.getAttribute("aria-valuenow")).toBe("64");
    expect((barra.firstElementChild as HTMLElement).style.width).toBe("63.6%");
    expect(container.querySelector(".neu-attach__media--spinner")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar envio de painel.pdf" }));
    expect(aoRemover).toHaveBeenCalledTimes(1);
  });

  it("enviando sem progresso: reticências e nada de barra; com imagem, o véu com o carregamento", () => {
    const { container } = render(
      <>
        <Anexo nome="a.pdf" estado="enviando" />
        <Anexo nome="foto.jpg" src="x.png" alt="" estado="enviando" progresso={42} />
      </>,
    );
    expect(container.querySelectorAll(".neu-attach__desc")[0].textContent).toBe("Enviando…");
    expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(1);
    expect(container.querySelector(".neu-attach__veil svg")).not.toBeNull();
  });

  it("erro: texto anunciado, mídia em alerta, tentar de novo e remover", () => {
    const aoTentarDeNovo = vi.fn();
    const aoRemover = vi.fn();
    const { container } = render(<Anexo nome="contrato.pdf" estado="erro" erro="Excede 10 MB · tente um arquivo menor" aoTentarDeNovo={aoTentarDeNovo} aoRemover={aoRemover} />);
    expect(screen.getByRole("alert").textContent).toBe("Excede 10 MB · tente um arquivo menor");
    expect(container.querySelector(".neu-attach__media--error")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Tentar enviar contrato.pdf de novo" }));
    fireEvent.click(screen.getByRole("button", { name: "Remover contrato.pdf" }));
    expect(aoTentarDeNovo).toHaveBeenCalledTimes(1);
    expect(aoRemover).toHaveBeenCalledTimes(1);
    expect(render(<Anexo nome="x.pdf" estado="erro" />).container.querySelector(".neu-attach__desc")?.textContent).toBe("Falha no envio");
  });

  it("tentar de novo só aparece no erro; baixar e remover têm nome acessível", () => {
    const { rerender } = render(<Anexo nome="a.pdf" aoTentarDeNovo={() => {}} aoBaixar={() => {}} aoRemover={() => {}} />);
    expect(screen.queryByRole("button", { name: /de novo/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Baixar a.pdf" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Remover a.pdf" })).toBeTruthy();
    rerender(<Anexo nome="a.pdf" estado="erro" aoTentarDeNovo={() => {}} />);
    expect(screen.getByRole("button", { name: /de novo/ })).toBeTruthy();
  });

  it("href vira link com alvo e download; aoClicar vira botão; ações extras entram na fileira", () => {
    const aoClicar = vi.fn();
    const { container } = render(
      <>
        <Anexo nome="a.pdf" href="/a.pdf" target="_blank" download />
        <Anexo nome="b.pdf" aoClicar={aoClicar} acoes={<button type="button">Mais</button>} />
      </>,
    );
    const link = container.querySelector("a.neu-attach__main") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/a.pdf");
    expect(link.target).toBe("_blank");
    expect(link.hasAttribute("download")).toBe(true);
    fireEvent.click(container.querySelector("button.neu-attach__main") as HTMLElement);
    expect(aoClicar).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Mais" }).closest(".neu-attach__actions")).not.toBeNull();
  });

  it("imagem: alt entra na miniatura; alt vazio esconde a mídia dos leitores de tela; falha de carga esconde a imagem", () => {
    const { container } = render(
      <>
        <Anexo nome="a.jpg" src="a.png" alt="Descrição" orientacao="vertical" />
        <Anexo nome="b.jpg" src="b.png" alt="" />
      </>,
    );
    const midias = container.querySelectorAll(".neu-attach__media");
    expect(midias[0].querySelector("img")?.getAttribute("alt")).toBe("Descrição");
    expect(midias[0].hasAttribute("aria-hidden")).toBe(false);
    expect(midias[1].getAttribute("aria-hidden")).toBe("true");
    const img = midias[0].querySelector("img") as HTMLImageElement;
    fireEvent.error(img);
    expect(img.style.visibility).toBe("hidden");
  });

  it("grupo: lista nomeada com um item por filho (ignora vazios) e a classe da grade", () => {
    const { container } = render(
      <GrupoAnexos layout="grade" rotulo="Galeria">
        <Anexo nome="a.pdf" />
        {null}
        <Anexo nome="b.pdf" />
      </GrupoAnexos>,
    );
    expect(screen.getByRole("list", { name: "Galeria" })).toBeTruthy();
    expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(2);
    expect(render(<GrupoAnexos><Anexo nome="a.pdf" /></GrupoAnexos>).container.querySelector("[role=list]")?.getAttribute("aria-label")).toBe("Anexos");
  });

  it("vitrine: o progresso do exemplo avança sozinho e o botão restaura os anexos removidos", () => {
    vi.useFakeTimers();
    render(<NeumorfismoAnexos />);
    const antes = Number(screen.getByRole("progressbar", { name: "Envio de painel-de-vendas.pdf" }).getAttribute("aria-valuenow"));
    act(() => vi.advanceTimersByTime(450));
    const depois = Number(screen.getByRole("progressbar", { name: "Envio de painel-de-vendas.pdf" }).getAttribute("aria-valuenow"));
    expect(depois).toBe(antes + 6);
    fireEvent.click(screen.getByRole("button", { name: "Remover planilha_atendimentos_outubro.xlsx" }));
    expect(screen.queryByText("planilha_atendimentos_outubro.xlsx")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Restaurar anexos/ }));
    expect(screen.getByText("planilha_atendimentos_outubro.xlsx")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Restaurar anexos/ })).toBeNull();
  });
});
