import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import NeumorfismoWorkspaceLateral, { MenuContas, MenuUsuario, WorkspaceLateral, type EspacoTrabalho, type SecaoWorkspace } from "../NeumorfismoWorkspaceLateral";

const ESPACOS: EspacoTrabalho[] = [
  { id: "marca", nome: "Sua marca", iniciais: "SM", tom: "ink", meta: "21 membros" },
  { id: "lab", nome: "Inovação Lab", iniciais: "IL", tom: "royal", meta: "8 membros", atalho: "⌘1" },
];
const SECOES: SecaoWorkspace[] = [
  { id: "main", itens: [{ id: "painel", rotulo: "Painel" }, { id: "msg", rotulo: "Mensagens", contagem: 16 }, { id: "auto", rotulo: "Automações", ia: true, palavrasChave: "robô" }] },
  { id: "fav", titulo: "Favoritos", aoAdicionar: () => {}, itens: [{ id: "contas", rotulo: "Contas-chave" }] },
];
const USUARIO = { nome: "Ana Souza", email: "ana@exemplo.com", status: "online" as const };
const GRUPOS = [[{ rotulo: "Configurações", atalho: "⌘S" }], [{ rotulo: "Atalhos", submenu: true }, { rotulo: "Planos", externo: true }, { rotulo: "Indicações", badge: "Novo" }], [{ rotulo: "Sair", perigo: true }]];

function barra(extra = {}) {
  return <WorkspaceLateral espacos={ESPACOS} espacoInicial="marca" secoes={SECOES} ativoInicial="painel" usuario={USUARIO} menuUsuario={GRUPOS} aviso={{ titulo: "Nova versão", texto: "Atualize.", rotuloAcao: "Atualizar" }} atalhoBusca="⌘K" {...extra} />;
}

describe("NeumorfismoWorkspaceLateral", () => {
  it("cartão: três barras (recolhida, expandida e recolhível) e os dois menus soltos", () => {
    const { container } = render(<NeumorfismoWorkspaceLateral />);
    expect(container.querySelectorAll("aside.neu-ws")).toHaveLength(3);
    expect(container.querySelectorAll("aside.neu-ws--collapsed")).toHaveLength(1);
    expect(screen.getAllByRole("menu")).toHaveLength(2);
    expect(screen.getByRole("menu", { name: "Trocar conta" })).toBeTruthy();
    expect(screen.getByRole("menu", { name: "Menu da conta" })).toBeTruthy();
  });

  it("expandida: espaço atual com membros, busca com ⌘K, contador, brilho de IA e seção com tecla de adicionar", () => {
    const { container } = render(barra());
    expect(container.querySelector(".neu-ws__switch .neu-ws__name b")?.textContent).toBe("Sua marca");
    expect(container.querySelector(".neu-ws__switch small")?.textContent).toBe("21 membros");
    expect(container.querySelector(".neu-ws-search .neu-kbd")?.textContent).toBe("⌘K");
    expect(container.querySelector(".neu-ws-count")?.getAttribute("aria-label")).toBe("16 novas");
    expect(container.querySelector(".neu-ws-ai .sr-only")?.textContent).toBe("com IA");
    expect(screen.getByRole("button", { name: "Adicionar em Favoritos" })).toBeTruthy();
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toBe("Painel");
  });

  it("seção: botão com aria-expanded e aria-controls abre e fecha os itens", () => {
    render(barra());
    const toggle = screen.getByRole("button", { name: "Favoritos" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(toggle.getAttribute("aria-controls") as string)).toBeTruthy();
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Contas-chave" })).toBeNull();
  });

  it("busca: olha rótulo e palavra-chave sem acento e avisa quando nada casa", () => {
    render(barra());
    const campo = screen.getByRole("searchbox");
    fireEvent.change(campo, { target: { value: "ROBO" } });
    expect(screen.getAllByRole("link")).toHaveLength(1);
    fireEvent.change(campo, { target: { value: "zzz" } });
    expect(screen.getByText("Nenhum item encontrado.")).toBeTruthy();
  });

  it("Ctrl+K foca a busca, e focarComAtalho falso desliga", () => {
    const { unmount } = render(barra());
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
    unmount();
    render(barra({ focarComAtalho: false }));
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(document.activeElement).not.toBe(screen.getByRole("searchbox"));
  });

  it("trocar de conta: o nome abre o menu com rádios, escolher troca o espaço e fecha, Esc devolve o foco", () => {
    const aoTrocar = vi.fn();
    const { container } = render(barra({ aoTrocarEspaco: aoTrocar, emailConta: "ana@exemplo.com", atalhoNovaConta: "⌘A" }));
    const gatilho = container.querySelector(".neu-ws__switch") as HTMLElement;
    expect(gatilho.getAttribute("aria-haspopup")).toBe("menu");
    fireEvent.click(gatilho);
    const menu = screen.getByRole("menu", { name: "Trocar conta" });
    expect(gatilho.getAttribute("aria-expanded")).toBe("true");
    const radios = within(menu).getAllByRole("menuitemradio");
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["true", "false"]);
    expect(document.activeElement).toBe(radios[0]);
    expect(menu.querySelector(".neu-ws-menu__email")?.textContent).toBe("ana@exemplo.com");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(radios[1]);
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(gatilho);
    fireEvent.click(gatilho);
    fireEvent.click(screen.getAllByRole("menuitemradio")[1]);
    expect(aoTrocar).toHaveBeenCalledWith("lab");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(container.querySelector(".neu-ws__switch .neu-ws__name b")?.textContent).toBe("Inovação Lab");
  });

  it("menu do usuário: abre para cima, nome e status, grupos, submenu, externo avisado e perigo; clique fora fecha", () => {
    const { container } = render(barra());
    const eu = container.querySelector(".neu-ws__me") as HTMLElement;
    fireEvent.click(eu);
    const menu = screen.getByRole("menu", { name: "Menu da conta" });
    expect(menu.className).toContain("neu-ws-menu--up");
    expect(menu.querySelector(".neu-ws-menu__user small")?.textContent).toBe("Online");
    expect(menu.querySelectorAll(".neu-ws-menu__group")).toHaveLength(3);
    expect(within(menu).getByRole("menuitem", { name: /Atalhos/ }).getAttribute("aria-haspopup")).toBe("menu");
    expect(within(menu).getByText("(abre em nova aba)").className).toContain("sr-only");
    expect(menu.querySelector(".neu-ws-menu__item--danger")?.textContent).toContain("Sair");
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("aviso: dispensável, com ação e arte decorativa", () => {
    const aoDispensar = vi.fn();
    const { container } = render(barra({ aviso: { titulo: "Nova versão", texto: "Atualize.", rotuloAcao: "Atualizar", aoDispensar } }));
    expect(screen.getByRole("status").textContent).toContain("Nova versão");
    expect(container.querySelector(".neu-ws-notice__art")?.getAttribute("aria-hidden")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Dispensar aviso" }));
    expect(aoDispensar).toHaveBeenCalled();
    expect(container.querySelector(".neu-ws-notice")).toBeNull();
  });

  it("recolhida: teclas com aria-label (contador e IA), ponto, dica, separador entre seções e sem aviso", () => {
    const { container } = render(barra({ recolhido: true }));
    expect(container.querySelector("aside")?.className).toContain("neu-ws--collapsed");
    expect(screen.getByRole("link", { name: "Mensagens, 16 novas" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Automações, com IA" })).toBeTruthy();
    expect(container.querySelector(".neu-ws-item__pip")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll(".neu-ws-sep")).toHaveLength(1);
    expect(container.querySelector(".neu-ws-notice")).toBeNull();
    expect(container.querySelectorAll("a .neu-rail__tip")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Espaço de trabalho: Sua marca. Trocar conta" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conta de Ana Souza" })).toBeTruthy();
    expect(container.querySelector(".neu-ws-item--search .neu-rail__tip")?.textContent).toBe("Buscar");
  });

  it("recolhível: a tecla do cabeçalho recolhe, a do pé expande, o foco a acompanha e os menus fecham", () => {
    const aoAlterar = vi.fn();
    const { container } = render(barra({ recolhivel: true, aoAlterarRecolhido: aoAlterar }));
    fireEvent.click(container.querySelector(".neu-ws__switch") as HTMLElement);
    expect(screen.getByRole("menu")).toBeTruthy();
    const recolher = screen.getByRole("button", { name: "Recolher menu" });
    expect(recolher.getAttribute("aria-expanded")).toBe("true");
    expect(recolher.closest(".neu-ws__head")).toBeTruthy();
    fireEvent.click(recolher);
    expect(aoAlterar).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(container.querySelector("aside")?.className).toContain("neu-ws--collapsed");
    const expandir = screen.getByRole("button", { name: "Expandir menu" });
    expect(expandir.getAttribute("aria-expanded")).toBe("false");
    expect(expandir.closest(".neu-ws__foot")).toBeTruthy();
    expect(expandir.querySelector(".neu-rail__tip")?.textContent).toBe("Expandir menu");
    expect(document.activeElement).toBe(expandir);
    fireEvent.click(expandir);
    expect(aoAlterar).toHaveBeenLastCalledWith(false);
    expect(container.querySelector("aside")?.className).not.toContain("neu-ws--collapsed");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Recolher menu" }));
  });

  it("recolhível: começa recolhida com recolhidoInicial e a lupa expande e foca a busca", () => {
    const { container } = render(barra({ recolhivel: true, recolhidoInicial: true }));
    expect(container.querySelector("aside")?.className).toContain("neu-ws--collapsed");
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(container.querySelector("aside")?.className).not.toContain("neu-ws--collapsed");
    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("sem recolhivel não há tecla; controlada, a tecla só avisa", () => {
    const aoAlterar = vi.fn();
    const { container, rerender } = render(barra());
    expect(screen.queryByRole("button", { name: /menu$/ })).toBeNull();
    rerender(barra({ recolhivel: true, recolhido: false, aoAlterarRecolhido: aoAlterar }));
    fireEvent.click(screen.getByRole("button", { name: "Recolher menu" }));
    expect(aoAlterar).toHaveBeenCalledWith(true);
    expect(container.querySelector("aside")?.className).not.toContain("neu-ws--collapsed");
  });

  it("menus soltos: estáticos, sem posicionamento flutuante, e escolher uma conta chama aoSelecionar", () => {
    const aoSelecionar = vi.fn();
    const { container } = render(
      <>
        <MenuContas email="a@b.c" espacos={ESPACOS} ativo="marca" aoSelecionar={aoSelecionar} atalhoNovaConta="⌘A" />
        <MenuUsuario usuario={{ nome: "Bia", status: "away" }} grupos={[]} />
      </>,
    );
    expect(container.querySelector(".neu-ws-menu--float")).toBeNull();
    fireEvent.click(screen.getAllByRole("menuitemradio")[1]);
    expect(aoSelecionar).toHaveBeenCalledWith("lab");
    expect(screen.getByText("Ausente")).toBeTruthy();
    expect(screen.getByText("Nova conta")).toBeTruthy();
    expect(container.querySelector(".neu-ws-menu__item--muted .neu-kbd")?.textContent).toBe("⌘A");
  });
});
