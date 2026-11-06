import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import NeumorfismoItens, { GrupoItens, Item } from "../NeumorfismoItens";

describe("NeumorfismoItens", () => {
  it("cartão: dois itens de referência, dois de variantes e o grupo de três pessoas", () => {
    const { container } = render(<NeumorfismoItens />);
    expect(container.querySelectorAll(".neu-item")).toHaveLength(7);
    const lista = screen.getByRole("list", { name: "Equipe" });
    expect(within(lista).getAllByRole("listitem")).toHaveLength(3);
    expect(container.querySelectorAll(".neu-item-group__sep")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Seu perfil foi verificado/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Bruno Lima/ })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Lembretes de agenda" })).toBeTruthy();
  });

  it("sem href nem aoClicar é um div, sem seta e sem a classe de ação", () => {
    const { container } = render(<Item titulo="Estático" descricao="Só leitura" role="group" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.className).toBe("neu-item neu-item--convex");
    expect(el.getAttribute("role")).toBe("group");
    expect(container.querySelector(".neu-item__chev")).toBeNull();
  });

  it("href vira link com alvo e seta decorativa; seta falsa esconde a seta", () => {
    const { container, rerender } = render(<Item titulo="Ir" href="/x" alvo="_blank" />);
    const a = screen.getByRole("link", { name: "Ir" });
    expect(a.getAttribute("href")).toBe("/x");
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.className).toContain("neu-item--action");
    expect(container.querySelector(".neu-item__chev")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<Item titulo="Ir" href="/x" seta={false} />);
    expect(container.querySelector(".neu-item__chev")).toBeNull();
  });

  it("aoClicar vira button de verdade e dispara o clique", () => {
    const aoClicar = vi.fn();
    render(<Item titulo="Abrir" aoClicar={aoClicar} />);
    const b = screen.getByRole("button", { name: "Abrir" });
    expect(b.getAttribute("type")).toBe("button");
    fireEvent.click(b);
    expect(aoClicar).toHaveBeenCalledTimes(1);
  });

  it("ícone vai numa ficha com o tom; midia usa a variante pedida; tamanho pequeno e variante viram classes", () => {
    const { container, rerender } = render(<Item icone={<svg data-testid="ic" />} tom="sucesso" tamanho="pp" variante="contorno" titulo="A" />);
    expect(container.firstElementChild?.className).toBe("neu-item neu-item--outline neu-item--sm");
    expect(screen.getByTestId("ic").closest(".neu-item__media")?.className).toBe("neu-item__media neu-item__media--icon neu-tone-success");
    rerender(<Item midia={<img alt="" src="x.png" />} midiaVariante="imagem" titulo="B" />);
    expect(container.querySelector(".neu-item__media--image img")).toBeTruthy();
    rerender(<Item midia={<i />} titulo="C" variante="afundado" />);
    expect(container.querySelector(".neu-item__media--custom")).toBeTruthy();
    expect(container.firstElementChild?.className).toContain("neu-item--inset");
    rerender(<Item titulo="D" variante="discreto" />);
    expect(container.firstElementChild?.className).toContain("neu-item--muted");
    rerender(<Item titulo="E" variante="fantasma" />);
    expect(container.firstElementChild?.className).toContain("neu-item--ghost");
  });

  it("título com selo, descrição, ações e filhos nos lugares certos", () => {
    const { container } = render(
      <Item titulo="Ana" selo={<b data-testid="selo">Admin</b>} descricao="Consultora" acoes={<button type="button">Editar</button>}>
        <span data-testid="extra">extra</span>
      </Item>,
    );
    expect(container.querySelector(".neu-item__title")?.contains(screen.getByTestId("selo"))).toBe(true);
    expect(container.querySelector(".neu-item__desc")?.textContent).toBe("Consultora");
    expect(container.querySelector(".neu-item__actions")?.textContent).toBe("Editar");
    expect(container.querySelector(".neu-item__content")?.contains(screen.getByTestId("extra"))).toBe(true);
  });

  it("grupo: lista nomeada, uma fenda entre as linhas e cada item num listitem", () => {
    const { container } = render(
      <GrupoItens rotulo="Time">
        <Item titulo="Um" />
        <Item titulo="Dois" />
        <Item titulo="Três" />
      </GrupoItens>,
    );
    expect(within(screen.getByRole("list", { name: "Time" })).getAllByRole("listitem")).toHaveLength(3);
    expect(container.querySelectorAll("[role='separator']")).toHaveLength(2);
  });
});
