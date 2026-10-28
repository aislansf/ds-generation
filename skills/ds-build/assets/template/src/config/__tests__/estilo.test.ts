import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ESTILO } from "../estilo";

// O index.html aplica o tema antes da primeira pintura com o mesmo padrão do estilo: se os dois
// divergirem, o DS "pisca" do tema do index.html para o do useTheme no primeiro carregamento.
describe("estilo visual", () => {
  it("o tema padrão do index.html é o do estilo", () => {
    const html = readFileSync(resolve(__dirname, "../../../index.html"), "utf8");
    expect(/var padrao = "(light|dark)";/.exec(html)?.[1]).toBe(ESTILO.temaPadrao);
  });
});
