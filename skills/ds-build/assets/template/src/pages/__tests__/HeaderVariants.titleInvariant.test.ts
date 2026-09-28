import { describe, it, expect } from "vitest";
import { headerVariants } from "@/pages/TemplatesPage";

const TITLE_COM_SUBTITULO = "Fundo claro · Marca completa com título e subtítulo";

describe("TemplatesPage headerVariants — invariante de título", () => {
  it(`"${TITLE_COM_SUBTITULO}" só aparece em variantes com showTitle !== false`, () => {
    const offenders = headerVariants.filter(
      (v) => v.title === TITLE_COM_SUBTITULO && v.showTitle === false,
    );
    expect(offenders, `Variantes inválidas: ${offenders.map((v) => v.id).join(", ")}`).toHaveLength(0);
  });

  it("toda variante com showTitle !== false e audience 'claro-completa' usa o título correto", () => {
    const wrong = headerVariants.filter(
      (v) =>
        v.audience === "claro-completa" &&
        v.showTitle !== false &&
        v.title !== TITLE_COM_SUBTITULO,
    );
    expect(wrong, `Variantes com título divergente: ${wrong.map((v) => v.id).join(", ")}`).toHaveLength(0);
  });
});