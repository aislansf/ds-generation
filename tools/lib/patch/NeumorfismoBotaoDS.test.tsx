import { beforeEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BotaoDS, classesDePosicao, escolherBotao } from "../NeumorfismoBotaoDS";

// O estilo ativo vem do DS gerado; o teste fixa o que quer exercitar, para valer em qualquer estilo
const estilo = vi.hoisted(() => ({ ESTILO: { id: "neumorfismo", nome: "Neumorfismo", temaPadrao: "light", layout: "padrao" } }));
vi.mock("@/config/estilo", () => estilo);

describe("NeumorfismoBotaoDS", () => {
  beforeEach(() => {
    estilo.ESTILO.id = "neumorfismo";
  });

  it("fica só a posição: cor, tamanho e raio escritos à mão saem", () => {
    expect(classesDePosicao("absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground mt-3 w-full md:mt-4 text-success")).toBe("absolute top-2 right-2 mt-3 w-full md:mt-4 text-success");
  });

  it("a escolha segue a intenção do botão", () => {
    expect(escolherBotao("default", "px-4 py-2 bg-primary", false)).toMatchObject({ variant: "default", size: "default", convexo: false });
    expect(escolherBotao("secondary", "text-[10px] font-mono bg-muted", false)).toMatchObject({ variant: "outline", size: "sm", convexo: true, miudo: true });
    expect(escolherBotao("secondary", "px-4 py-2 bg-secondary", false)).toMatchObject({ variant: "secondary", size: "default" });
    expect(escolherBotao("toggle", "text-[11px] px-3 py-1.5 bg-primary text-primary-foreground", false)).toMatchObject({ variant: "default", convexo: false });
    expect(escolherBotao("toggle", "text-[11px] px-3 py-1.5 text-muted-foreground", false)).toMatchObject({ variant: "outline", convexo: true });
    expect(escolherBotao("ghost", "p-1.5 hover:bg-background", true)).toMatchObject({ variant: "outline", size: "icon" });
    expect(escolherBotao("ghost", "text-xs", false)).toMatchObject({ variant: "ghost", size: "sm" });
    expect(escolherBotao("marca", "border border-primary-foreground/20", false)).toMatchObject({ variant: "outline", convexo: true });
    expect(escolherBotao("link", "text-xs", false)).toBeNull();
  });

  it("no Neumorfismo renderiza o Button validado, com o mesmo comportamento do botão", () => {
    let cliques = 0;
    render(
      <BotaoDS data-ds="button" data-variant="toggle" onClick={() => cliques++} className="absolute top-2 right-2 px-2.5 py-1.5 rounded-md text-[11px] bg-primary text-primary-foreground" title="Copiar código" aria-label="Copiar código">
        <svg aria-hidden="true" />
        <span>Copiar</span>
      </BotaoDS>,
    );
    const botao = screen.getByRole("button", { name: "Copiar código" });
    expect(botao.getAttribute("data-ds")).toBe("button");
    expect(botao.getAttribute("data-variant")).toBe("default");
    expect(botao.className).toContain("rounded-[var(--radius-control)]");
    expect(botao.className).toContain("absolute top-2 right-2");
    expect(botao.className).not.toContain("px-2.5");
    fireEvent.click(botao);
    expect(cliques).toBe(1);
  });

  it("o contorno em relevo leva neu-btn--convex e o desativado continua desativado", () => {
    render(
      <BotaoDS data-ds="button" data-variant="outline" disabled className="px-3 py-2 text-xs border border-border">
        Baixar
      </BotaoDS>,
    );
    const botao = screen.getByRole("button", { name: "Baixar" }) as HTMLButtonElement;
    expect(botao.className).toContain("neu-btn--convex");
    expect(botao.disabled).toBe(true);
    expect(botao.getAttribute("data-variant")).toBe("outline");
  });

  it("o botão só de ícone vira o neu-ib; o link e o botão sem variante ficam como estão", () => {
    render(
      <>
        <BotaoDS data-ds="button" data-variant="ghost" className="p-1.5 hover:bg-background" aria-label="Aumentar">
          <svg aria-hidden="true" />
        </BotaoDS>
        <BotaoDS data-ds="button" data-variant="link" className="text-xs text-primary">Ver código</BotaoDS>
        <BotaoDS type="button" className="block w-full">Imagem</BotaoDS>
      </>,
    );
    expect(screen.getByRole("button", { name: "Aumentar" }).className).toContain("neu-ib");
    expect(screen.getByRole("button", { name: "Ver código" }).className).toBe("text-xs text-primary");
    expect(screen.getByRole("button", { name: "Imagem" }).getAttribute("data-ds")).toBeNull();
  });

  it("nos outros estilos continua sendo o <button> escrito à mão, sem mexer em classe nem variante", () => {
    estilo.ESTILO.id = "corporativo";
    render(
      <BotaoDS data-ds="button" data-variant="toggle" className="px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground" aria-label="Copiar código">
        Copiar
      </BotaoDS>,
    );
    const botao = screen.getByRole("button", { name: "Copiar código" });
    expect(botao.getAttribute("data-variant")).toBe("toggle");
    expect(botao.className).toBe("px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground");
  });
});
