import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeumorfismoMensagens, { Mensagem } from "../NeumorfismoMensagens";
import { Balao, GrupoBalao } from "../NeumorfismoBaloes";

describe("NeumorfismoMensagens", () => {
  it("cartão: cinco vezes e o marcador de digitando, em role=status", () => {
    const { container } = render(<NeumorfismoMensagens />);
    expect(container.querySelectorAll(".neu-message")).toHaveLength(4);
    expect(container.querySelectorAll(".neu-message--end")).toHaveLength(2);
    const marcador = screen.getByRole("status");
    expect(marcador.textContent).toBe("Rafael está digitando…");
    expect(marcador.querySelector(".neu-shimmer")).toBeTruthy();
    expect(screen.getByText("Entregue").className).toBe("neu-message__footer");
  });

  it("os balões herdam o lado e a variante: neutro no início, primário no fim, e a variante própria vence", () => {
    const { container, rerender } = render(
      <Mensagem>
        <Balao>Oi</Balao>
      </Mensagem>,
    );
    expect(container.querySelector(".neu-bubble--start.neu-bubble--muted")).toBeTruthy();
    rerender(
      <Mensagem lado="fim">
        <Balao>Oi</Balao>
      </Mensagem>,
    );
    expect(container.querySelector(".neu-bubble--end.neu-bubble--primary")).toBeTruthy();
    rerender(
      <Mensagem lado="fim">
        <Balao variante="destaque">Oi</Balao>
      </Mensagem>,
    );
    expect(container.querySelector(".neu-bubble--accent")).toBeTruthy();
  });

  it("o grupo de balões também herda o lado", () => {
    const { container } = render(
      <Mensagem lado="fim">
        <GrupoBalao>
          <Balao>Um</Balao>
          <Balao>Dois</Balao>
        </GrupoBalao>
      </Mensagem>,
    );
    expect(container.querySelectorAll(".neu-bubble--end")).toHaveLength(2);
  });

  it("nome com hora ao lado, avatar, rodapé, rótulo e role; compacta esconde o avatar pela classe", () => {
    const { container } = render(
      <Mensagem nome="Rafael" hora="16:55" avatar={<i data-testid="av" />} rodape="Lida" rotulo="Mensagem de Rafael" role="group" compacta>
        <Balao>Oi</Balao>
      </Mensagem>,
    );
    expect(screen.getByRole("group", { name: "Mensagem de Rafael" }).className).toBe("neu-message neu-message--start neu-message--compact");
    expect(container.querySelector(".neu-message__name")?.textContent).toBe("Rafael16:55");
    expect(container.querySelector("time.neu-message__time")?.textContent).toBe("16:55");
    expect(screen.getByTestId("av").closest(".neu-message__avatar")).toBeTruthy();
    expect(screen.getByText("Lida")).toBeTruthy();
  });

  it("sem nome, avatar nem rodapé só há o conteúdo", () => {
    const { container } = render(
      <Mensagem>
        <Balao>Oi</Balao>
      </Mensagem>,
    );
    expect(container.querySelector(".neu-message__name")).toBeNull();
    expect(container.querySelector(".neu-message__avatar")).toBeNull();
    expect(container.querySelector(".neu-message__footer")).toBeNull();
  });
});
