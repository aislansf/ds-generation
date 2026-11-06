import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoAvatares, { Avatar, GrupoAvatar, iniciaisDe } from "../NeumorfismoAvatares";

describe("NeumorfismoAvatares", () => {
  it("cartão: mostra avatares soltos, o exemplo de referência e três grupos", () => {
    const { container } = render(<NeumorfismoAvatares />);
    expect(container.querySelectorAll(".neu-avatar-group")).toHaveLength(3);
    expect(screen.getByRole("group", { name: "Equipe do projeto: 6 pessoas" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Consultores: 12 pessoas" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Rafael Nunes (Ocupado)" })).toBeTruthy();
  });

  it("iniciais: primeira e última palavra, ou as duas primeiras letras; vazio vira ?", () => {
    expect(iniciaisDe("Ana Souza")).toBe("AS");
    expect(iniciaisDe("Maria da Silva Santos")).toBe("MS");
    expect(iniciaisDe("Marina")).toBe("MA");
    expect(iniciaisDe("")).toBe("?");
    expect(iniciaisDe(undefined)).toBe("?");
  });

  it("disco: role=img com nome e status, dica, tamanho, formato e fallback escondido dos leitores", () => {
    const { container } = render(<Avatar nome="Ana Souza" status="online" tamanho="gg" forma="quadrado" tom="azul" />);
    const av = screen.getByRole("img", { name: "Ana Souza (Online)" });
    expect(av.getAttribute("title")).toBe("Ana Souza");
    expect(av.className).toBe("neu-avatar neu-avatar--xl neu-avatar--square");
    const fb = container.querySelector(".neu-avatar__fallback") as HTMLElement;
    expect(fb.textContent).toBe("AS");
    expect(fb.className).toContain("neu-avatar__fallback--royal");
    expect(fb.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-avatar__badge--online")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("alt vale mais que o nome; fallback e ícone trocam as iniciais; título próprio", () => {
    const { container, rerender } = render(<Avatar alt="Foto da Ana" nome="Ana Souza" fallback="AN" titulo="Perfil" />);
    expect(screen.getByRole("img", { name: "Foto da Ana" }).getAttribute("title")).toBe("Perfil");
    expect(container.querySelector(".neu-avatar__fallback")?.textContent).toBe("AN");
    rerender(<Avatar nome="Sem foto" icone={<svg data-testid="ic" />} status="offline" />);
    expect(screen.getByTestId("ic")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Sem foto (Offline)" })).toBeTruthy();
  });

  it("status: cada um vira sua classe e o nome diz em texto (ausente, ocupado)", () => {
    const { container, rerender } = render(<Avatar nome="A B" status="ausente" />);
    expect(container.querySelector(".neu-avatar__badge--away")).toBeTruthy();
    expect(screen.getByRole("img", { name: "A B (Ausente)" })).toBeTruthy();
    rerender(<Avatar nome="A B" status="ocupado" />);
    expect(container.querySelector(".neu-avatar__badge--busy")).toBeTruthy();
  });

  it("selo: texto entra no nome, nó vira o selo personalizado", () => {
    const { container, rerender } = render(<Avatar nome="Joana" selo={<span>3</span>} />);
    const b = container.querySelector(".neu-avatar__badge") as HTMLElement;
    expect(b.className).toContain("neu-avatar__badge--custom");
    expect(b.textContent).toBe("3");
    expect(screen.getByRole("img", { name: "Joana" })).toBeTruthy();
    rerender(<Avatar nome="Joana" selo="Novo" />);
    expect(screen.getByRole("img", { name: "Joana (Novo)" })).toBeTruthy();
    expect(container.querySelector(".neu-avatar__badge--custom")).toBeNull();
  });

  it("foto: escondida dos leitores, aparece ao carregar e cai no fallback se falhar", () => {
    const { container } = render(<Avatar src="a.jpg" nome="Ana Souza" tonsDeCinza />);
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("alt")).toBe("");
    expect(img.className).toBe("neu-avatar__img");
    expect(container.querySelector(".neu-avatar--gray")).toBeTruthy();
    fireEvent.load(img);
    expect(img.className).toContain("neu-avatar__img--on");
    fireEvent.error(img);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".neu-avatar__fallback")?.textContent).toBe("AS");
  });

  it("grupo: limita com max, mostra o +N do total, repassa o tamanho e dá nome", () => {
    const { container } = render(
      <GrupoAvatar max={2} total={5} tamanho="pp" tonsDeCinza rotulo="Equipe: 5 pessoas">
        <Avatar nome="Ana Souza" />
        <Avatar nome="Lucas Ramos" />
        <Avatar nome="Eduardo Ribeiro" />
      </GrupoAvatar>,
    );
    const g = screen.getByRole("group", { name: "Equipe: 5 pessoas" });
    expect(g.className).toBe("neu-avatar-group neu-avatar-group--sm neu-avatar-group--gray");
    expect(container.querySelectorAll(".neu-avatar:not(.neu-avatar--count)")).toHaveLength(2);
    expect([...container.querySelectorAll(".neu-avatar")].every((a) => a.className.includes("neu-avatar--sm"))).toBe(true);
    const contador = screen.getByRole("img", { name: "Mais 3 pessoas" });
    expect(contador.getAttribute("title")).toBe("Mais 3");
    expect(contador.className).toContain("neu-avatar--count");
    expect(contador.textContent).toBe("+3");
  });

  it("grupo: sem max nem total mostra todos, sem contador, e o nome padrão conta as pessoas", () => {
    const { container } = render(
      <GrupoAvatar>
        <Avatar nome="Ana Souza" />
        <Avatar nome="Lucas Ramos" />
      </GrupoAvatar>,
    );
    expect(screen.getByRole("group", { name: "2 pessoas" })).toBeTruthy();
    expect(container.querySelector(".neu-avatar--count")).toBeNull();
  });
});
