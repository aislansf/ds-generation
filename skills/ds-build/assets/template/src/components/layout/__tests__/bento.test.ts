import { describe, it, expect, vi, beforeEach } from "vitest";

async function carregar(layout: "padrao" | "bento") {
  vi.resetModules();
  vi.doMock("@/config/estilo", () => ({ ESTILO: { id: "x", nome: "X", temaPadrao: "light", layout } }));
  return import("../bento");
}

beforeEach(() => {
  vi.resetModules();
});

describe("bento fora do layout bento", () => {
  it("devolve a grade original e nenhuma classe de bloco", async () => {
    const b = await carregar("padrao");
    expect(b.isBento()).toBe(false);
    expect(b.bentoGrid("grid grid-cols-3 gap-3")).toBe("grid grid-cols-3 gap-3");
    expect(b.bentoGrid("grid grid-cols-3 gap-3", "mb-10")).toContain("grid-cols-3");
    expect(b.bentoCell("2x2", { hero: true })).toBe("");
  });
});

describe("bento no layout bento", () => {
  it("troca a grade por 4 colunas e mantém as classes comuns", async () => {
    const b = await carregar("bento");
    const grade = b.bentoGrid("grid grid-cols-3 gap-3", "mb-10");
    expect(grade).toContain("lg:grid-cols-4");
    expect(grade).toContain("grid-cols-1");
    expect(grade).toContain("mb-10");
    expect(grade).not.toContain("grid-cols-3");
  });

  it("não reordena o DOM: nada de grid-auto-flow dense", async () => {
    const b = await carregar("bento");
    expect(b.bentoGrid("x")).not.toMatch(/dense/);
  });

  it("estende linhas só a partir de 1024px e uma coluna abaixo de 640px", async () => {
    const b = await carregar("bento");
    expect(b.bentoCell("2x2")).toBe("min-w-0 sm:col-span-2 lg:row-span-2");
    expect(b.bentoCell("1x1")).toBe("min-w-0");
    expect(b.bentoGrid("x")).toMatch(/^grid grid-cols-1 /);
  });

  it("marca o bloco de destaque", async () => {
    const b = await carregar("bento");
    expect(b.bentoCell("2x1", { hero: true })).toContain("bento-hero");
    expect(b.bentoCell("2x1")).not.toContain("bento-hero");
  });
});

describe("bentoSizes", () => {
  it("fecha as linhas de 4 colunas para qualquer quantidade de blocos", async () => {
    const b = await carregar("bento");
    for (let n = 1; n <= 24; n++) {
      const tamanhos = b.bentoSizes(n);
      expect(tamanhos).toHaveLength(n);
      const total = tamanhos.reduce((soma, t) => soma + b.BENTO_LARGURA[t], 0);
      // com 1 a 3 blocos não há como fechar a linha sem alargar demais; de 4 em diante fecha sempre
      if (n >= 4) expect(total % b.BENTO_COLUNAS).toBe(0);
    }
  });

  it("nunca começa um bloco largo na última coluna", async () => {
    const b = await carregar("bento");
    for (let n = 4; n <= 24; n++) {
      let coluna = 0;
      for (const t of b.bentoSizes(n)) {
        const largura = b.BENTO_LARGURA[t];
        expect(coluna + largura).toBeLessThanOrEqual(b.BENTO_COLUNAS);
        coluna = (coluna + largura) % b.BENTO_COLUNAS;
      }
    }
  });

  it("é vazio para zero blocos", async () => {
    const b = await carregar("bento");
    expect(b.bentoSizes(0)).toEqual([]);
  });
});
