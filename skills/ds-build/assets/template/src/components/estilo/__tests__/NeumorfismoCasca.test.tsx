import { afterEach, beforeAll, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import CascaNeumorfismo from "../NeumorfismoCasca";

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(() => vi.unstubAllGlobals());

const itens = [
  { label: "Principal", path: "/", icon: <i /> },
  {
    label: "Fundamentos",
    path: "/fundamentos",
    icon: <i />,
    children: [
      { label: "Tipografia", path: "/fundamentos#tipografia" },
      { label: "Cores", path: "/fundamentos#cores" },
    ],
  },
  {
    label: "Modelos de BI",
    path: "/modelos-bi",
    icon: <i />,
    children: [
      { label: "Planejamento - BI", path: "/modelos-bi/planeja", disabled: true },
      {
        label: "Radar",
        path: "/modelos-bi/radar",
        children: [{ label: "Docs", path: "/modelos-bi/radar/docs", children: [{ label: "v1.0", path: "/modelos-bi/radar/docs/v1" }] }],
      },
    ],
  },
  { label: "Marca", path: "/marca", icon: <i /> },
];

function Local() {
  const l = useLocation();
  return <p data-testid="local">{l.pathname + l.hash}</p>;
}

function montar(rota = "/fundamentos") {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="*" element={<CascaNeumorfismo itens={itens}><Local /><p>Conteúdo da página</p></CascaNeumorfismo>} />
      </Routes>
    </MemoryRouter>,
  );
}

const desktop = (sim: boolean) => vi.stubGlobal("matchMedia", (q: string) => ({ matches: sim, media: q, addEventListener() {}, removeEventListener() {} }));

describe("NeumorfismoCasca", () => {
  it("estrutura: cabeçalho barra com marca e nome do sistema, menu fixo, conteúdo e rodapé slim", () => {
    const { container } = montar();
    expect(container.querySelector("header.neu-header-k.neu-header-k--bar.neu-header-k--flush")).not.toBeNull();
    expect(container.querySelector(".neu-header-k__app")?.textContent).toBe("Design System __BRAND_NAME__");
    expect(container.querySelector(".neu-casca__menu aside.neu-drawer--inline")).not.toBeNull();
    expect(screen.getByText("Conteúdo da página")).toBeTruthy();
    expect(container.querySelector("main .neu-footer-s")).not.toBeNull();
    expect(screen.getByRole("navigation", { name: "Navegação do design system" })).toBeTruthy();
  });

  it("o grupo da página atual abre sozinho e o item do endereço fica atual", () => {
    montar("/fundamentos");
    const menu = document.querySelector(".neu-casca__menu") as HTMLElement;
    expect(within(menu).getByRole("button", { name: /Fundamentos/ }).getAttribute("aria-expanded")).toBe("true");
    expect(within(menu).getByRole("button", { name: /Modelos de BI/ }).getAttribute("aria-expanded")).toBe("false");
    expect(within(menu).getByRole("link", { name: "Visão geral" }).getAttribute("aria-current")).toBe("page");
  });

  it("todo grupo ganha Visão geral e os níveis a mais entram como subitens", () => {
    montar("/modelos-bi");
    const menu = document.querySelector(".neu-casca__menu") as HTMLElement;
    const nomes = within(menu).getAllByRole("link").map((a) => a.textContent);
    expect(nomes).toEqual(expect.arrayContaining(["Visão geral", "Planejamento - BI (em breve)", "Radar", "Docs", "Docs · v1.0"]));
  });

  it("clicar num subitem leva à página e ao hash", () => {
    montar("/fundamentos");
    const menu = document.querySelector(".neu-casca__menu") as HTMLElement;
    fireEvent.click(within(menu).getByRole("link", { name: "Cores" }));
    expect(screen.getByTestId("local").textContent).toBe("/fundamentos#cores");
    fireEvent.click(within(menu).getByRole("link", { name: "Principal" }));
    expect(screen.getByTestId("local").textContent).toBe("/");
  });

  it("a busca filtra itens e subitens", () => {
    montar("/fundamentos");
    const menu = document.querySelector(".neu-casca__menu") as HTMLElement;
    fireEvent.change(within(menu).getByRole("searchbox"), { target: { value: "cores" } });
    expect(within(menu).getByRole("link", { name: "Cores" })).toBeTruthy();
    expect(within(menu).queryByRole("link", { name: "Tipografia" })).toBeNull();
  });

  it("a tecla de tema alterna e tem nome", () => {
    montar();
    const tecla = screen.getByRole("button", { name: /Ativar modo (escuro|claro)/ });
    const antes = tecla.getAttribute("aria-label");
    fireEvent.click(tecla);
    expect(screen.getByRole("button", { name: /Ativar modo (escuro|claro)/ }).getAttribute("aria-label")).not.toBe(antes);
  });

  it("no desktop a tecla de menu esconde e mostra o menu fixo", () => {
    desktop(true);
    const { container } = montar();
    fireEvent.click(screen.getByRole("button", { name: "Recolher menu lateral" }));
    expect(container.querySelector(".neu-casca__menu")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Expandir menu lateral" }));
    expect(container.querySelector(".neu-casca__menu")).not.toBeNull();
  });

  it("no celular a tecla de menu abre a gaveta modal; escolher um item a fecha", () => {
    desktop(false);
    montar();
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /menu lateral/ }));
    const gaveta = screen.getByRole("dialog");
    fireEvent.click(within(gaveta).getByRole("link", { name: "Marca" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByTestId("local").textContent).toBe("/marca");
  });
});
