import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Estilo que abre em dark (ex.: cyberpunk). O tema salvo pelo usuário continua vencendo.
vi.mock("@/config/estilo", () => ({
  ESTILO: { id: "teste", nome: "Teste", temaPadrao: "dark", layout: "padrao" },
}));

import { useTheme } from "../useTheme";

const KEY = "brand-ds-theme";

describe("useTheme com o tema padrão do estilo em dark", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("abre em dark quando não há tema salvo", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  it("a escolha salva vence o padrão do estilo", () => {
    localStorage.setItem(KEY, "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("valor salvo inválido cai no padrão do estilo", () => {
    localStorage.setItem(KEY, "sepia");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("alternar grava a escolha", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem(KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
