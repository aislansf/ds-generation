import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import NeumorfismoBaloes, { Balao, GrupoBalao } from "../NeumorfismoBaloes";

describe("NeumorfismoBaloes", () => {
  it("cartão: duas conversas, com grupos nomeados, o dia, e as variantes das duas colunas", () => {
    const { container } = render(<NeumorfismoBaloes />);
    expect(container.querySelectorAll(".neu-bubble-chat")).toHaveLength(2);
    expect(screen.getByText("Hoje").className).toBe("neu-bubble-chat__day");
    for (const v of ["primary", "muted", "accent", "inset"]) expect(container.querySelector(`.neu-bubble--${v}`)).toBeTruthy();
    expect(screen.getByText("Marina Lopes · Consultora")).toBeTruthy();
  });

  it("lado e variante padrão: o do outro é neutro à esquerda e o seu é primário à direita", () => {
    const { container, rerender } = render(<Balao>Oi</Balao>);
    expect(container.firstElementChild?.className).toBe("neu-bubble neu-bubble--start neu-bubble--muted neu-bubble--single");
    rerender(<Balao lado="fim">Oi</Balao>);
    expect(container.firstElementChild?.className).toBe("neu-bubble neu-bubble--end neu-bubble--primary neu-bubble--single");
    rerender(<Balao lado="fim" variante="destaque">Oi</Balao>);
    expect(container.firstElementChild?.className).toContain("neu-bubble--accent");
    rerender(<Balao variante="afundada">Oi</Balao>);
    expect(container.firstElementChild?.className).toContain("neu-bubble--inset");
  });

  it("avatar só do lado do outro; nome só no balão único ou no primeiro", () => {
    const { container, rerender } = render(<Balao nome="Marina" avatar={<i data-testid="av" />}>Oi</Balao>);
    expect(screen.getByText("Marina").className).toBe("neu-bubble__name");
    expect(screen.getByTestId("av").closest(".neu-bubble__avatar")).toBeTruthy();
    rerender(<Balao lado="fim" nome="Eu" avatar={<i data-testid="av" />}>Oi</Balao>);
    expect(container.querySelector(".neu-bubble__avatar")).toBeNull();
  });

  it("grupo: repassa posição, nome e avatar; o avatar some nas anteriores e a hora só aparece na última", () => {
    const { container } = render(
      <GrupoBalao nome="Marina" avatar={<i />} rotulo="Mensagens da Marina">
        <Balao hora="09:00">Um</Balao>
        <Balao hora="09:01">Dois</Balao>
        <Balao hora="09:02">Três</Balao>
      </GrupoBalao>,
    );
    expect(screen.getByRole("group", { name: "Mensagens da Marina" })).toBeTruthy();
    const b = [...container.querySelectorAll(".neu-bubble")];
    expect(b.map((x) => ["first", "middle", "last"].find((p) => x.className.includes(`neu-bubble--${p}`)))).toEqual(["first", "middle", "last"]);
    expect(container.querySelectorAll(".neu-bubble__name")).toHaveLength(1);
    expect(container.querySelectorAll(".neu-bubble__avatar--hidden")).toHaveLength(2);
    expect(container.querySelectorAll(".neu-bubble__avatar")).toHaveLength(3);
  });

  it("grupo de uma só mensagem vira single; sem rótulo não é um role=group", () => {
    const { container } = render(
      <GrupoBalao lado="fim">
        <Balao>Só uma</Balao>
      </GrupoBalao>,
    );
    expect(container.querySelector(".neu-bubble--single.neu-bubble--end")).toBeTruthy();
    expect(screen.queryByRole("group")).toBeNull();
  });

  it("reações: um único role=img nomeado, emojis escondidos, contagem só a partir de 2 e a minha no tom da marca", () => {
    const { container } = render(
      <Balao reacoes={[{ emoji: "👍", contagem: 2, rotulo: "2 joinhas", minha: true }, { emoji: "🔥", rotulo: "fogo" }, { texto: "+2", rotulo: "e mais 2" }]}>Oi</Balao>,
    );
    const r = screen.getByRole("img", { name: "Reações: 2 joinhas, fogo, e mais 2" });
    expect(r.className).toBe("neu-bubble__reactions");
    expect(container.querySelector(".neu-bubble--reacted")).toBeTruthy();
    expect(r.querySelectorAll(".neu-bubble__reaction")).toHaveLength(3);
    expect(r.querySelector(".neu-bubble__reaction--mine")).toBeTruthy();
    expect(r.querySelectorAll("b")).toHaveLength(1);
    expect(r.querySelector("[aria-hidden='true']")).toBeTruthy();
  });

  it("rotuloReacoes troca o nome; ícone entra no lugar do emoji", () => {
    render(<Balao reacoes={[{ icone: <svg data-testid="ic" />, rotulo: "x" }]} rotuloReacoes="Curtiram">Oi</Balao>);
    expect(screen.getByRole("img", { name: "Curtiram" })).toBeTruthy();
    expect(screen.getByTestId("ic")).toBeTruthy();
  });

  it("hora e status: time com dataHora e o estado também em texto para leitor de tela", () => {
    const { container, rerender } = render(<Balao lado="fim" hora="09:15" dataHora="2026-03-10T09:15" status="lida">Oi</Balao>);
    const t = container.querySelector("time") as HTMLElement;
    expect(t.getAttribute("datetime")).toBe("2026-03-10T09:15");
    expect(t.textContent).toBe("09:15");
    const st = container.querySelector(".neu-bubble__status--read") as HTMLElement;
    expect(within(st).getByText("Lida").className).toBe("sr-only");
    for (const [s, classe, texto] of [["enviando", "sending", "Enviando"], ["enviada", "sent", "Enviada"], ["entregue", "delivered", "Entregue"], ["erro", "error", "Falha no envio"]] as const) {
      rerender(<Balao lado="fim" status={s}>Oi</Balao>);
      expect(container.querySelector(`.neu-bubble__status--${classe}`)).toBeTruthy();
      expect(screen.getByText(texto)).toBeTruthy();
    }
  });

  it("sem hora nem status não há linha de meta", () => {
    const { container } = render(<Balao>Oi</Balao>);
    expect(container.querySelector(".neu-bubble__meta")).toBeNull();
  });
});
