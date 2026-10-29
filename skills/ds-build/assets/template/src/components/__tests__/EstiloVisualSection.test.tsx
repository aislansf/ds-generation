import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";

const estilo = vi.hoisted(() => ({ ESTILO: { id: "neobrutalismo", nome: "Neobrutalismo", temaPadrao: "light", layout: "padrao" } }));
vi.mock("@/config/estilo", () => estilo);

import EstiloVisualSection from "../EstiloVisualSection";

const RESUMO = {
  id: "neobrutalismo",
  nome: "Neobrutalismo",
  nivel: 2,
  grupo: "ousados",
  descricao: "Contornos grossos e sombras duras.",
  tema_padrao: "light",
  layout: "padrao",
  tokens_alterados: { ":root": 18, ".dark": 2 },
  camada_css: true,
  decoracao: null,
  degrade: false,
  ajustes_contraste: [":root --input → 0 0% 7%"],
  avisos: [],
  faca: ["Use as cores de apoio da marca para preencher cards"],
  evite: ["Sombras com desfoque"],
  fontes_sugeridas: { primaria: ["Space Grotesk"] },
  catalogo: [
    { id: "corporativo", nome: "Corporativo", grupo: "limpos", nivel: 0, descricao: "O visual padrão." },
    { id: "neobrutalismo", nome: "Neobrutalismo", grupo: "ousados", nivel: 2, descricao: "Contornos grossos e sombras duras." },
  ],
};

describe("EstiloVisualSection", () => {
  beforeEach(() => {
    estilo.ESTILO.id = "neobrutalismo";
    estilo.ESTILO.nome = "Neobrutalismo";
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => RESUMO })));
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("mostra o estilo, o faça e evite e o catálogo a partir do estilo.json", async () => {
    render(<EstiloVisualSection />);
    expect(screen.getByRole("heading", { name: "Estilo visual" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Sombras com desfoque")).toBeInTheDocument());
    expect(screen.getByText("Use as cores de apoio da marca para preencher cards")).toBeInTheDocument();
    expect(screen.getByText(/18 no tema claro, 2 no escuro/)).toBeInTheDocument();
    expect(screen.getByText("Ajustes de contraste do estilo")).toBeInTheDocument();
    expect(screen.getByText("em uso")).toBeInTheDocument();
    expect(screen.getByText("Corporativo")).toBeInTheDocument();
  });

  it("continua útil sem o estilo.json", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    render(<EstiloVisualSection />);
    expect(screen.getByRole("heading", { name: "Estilo visual" })).toBeInTheDocument();
    expect(screen.getAllByText("O resumo do estilo não está disponível.")).toHaveLength(2);
  });

  it("não aparece no estilo corporativo", () => {
    estilo.ESTILO.id = "corporativo";
    estilo.ESTILO.nome = "Corporativo";
    const { container } = render(<EstiloVisualSection />);
    expect(container).toBeEmptyDOMElement();
  });
});
