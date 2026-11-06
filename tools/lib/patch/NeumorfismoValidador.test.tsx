import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ResultadoValidacao } from "../NeumorfismoValidador";

describe("NeumorfismoValidador", () => {
  it("vazio: o Empty State com a orientação", () => {
    const { container } = render(<ResultadoValidacao vazio />);
    expect(container.querySelector(".neu-empty")).not.toBeNull();
    expect(screen.getByText("Nenhum JSON validado ainda")).toBeTruthy();
    expect(screen.getByText("Cole conteúdo acima ou carregue um exemplo.")).toBeTruthy();
  });

  it("JSON inválido: o aviso de perigo com a mensagem, lido como alerta", () => {
    render(<ResultadoValidacao erroJson="Unexpected token } in JSON at position 4" />);
    const aviso = screen.getByRole("alert");
    expect(aviso.textContent).toContain("JSON inválido");
    expect(aviso.textContent).toContain("Unexpected token }");
  });

  it("sucesso: o aviso verde com o título e o texto", () => {
    render(<ResultadoValidacao sucesso={{ titulo: "tokens.json OK contra tokens.schema.json", texto: "Nenhum erro de schema encontrado." }} />);
    const aviso = screen.getByRole("status");
    expect(aviso.textContent).toContain("tokens.json OK contra tokens.schema.json");
    expect(aviso.textContent).toContain("Nenhum erro de schema encontrado.");
  });

  it("erros: o aviso com a contagem e uma linha da Lista descritiva por erro, com linha e palavra em selos", () => {
    const { container } = render(
      <ResultadoValidacao
        erros={{
          titulo: "2 erro(s) contra tokens.json",
          itens: [
            { caminho: "/brand/color", linha: 4, palavra: "required", mensagem: "must have required property 'primary'", parametros: '{"missingProperty":"primary"}' },
            { caminho: "(root)", palavra: "type", mensagem: "must be object" },
          ],
        }}
      />,
    );
    expect(screen.getByRole("alert").textContent).toContain("2 erro(s) contra tokens.json");
    const linhas = container.querySelectorAll(".neu-dlp__row");
    expect(linhas).toHaveLength(2);
    expect(within(linhas[0] as HTMLElement).getByText("/brand/color")).toBeTruthy();
    expect(within(linhas[0] as HTMLElement).getByText("linha ~4")).toBeTruthy();
    expect(within(linhas[0] as HTMLElement).getByText("required")).toBeTruthy();
    expect(within(linhas[0] as HTMLElement).getByText('{"missingProperty":"primary"}')).toBeTruthy();
    expect(within(linhas[1] as HTMLElement).queryByText(/linha/)).toBeNull();
  });

  it("sem nada a mostrar não renderiza", () => {
    const { container } = render(<ResultadoValidacao />);
    expect(container.firstChild).toBeNull();
  });
});
