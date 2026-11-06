import { beforeAll, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import NeumorfismoTabelas, { Tabela, TabelaAninhada, Situacao, Estrelas, Avaliacao, CelulaItem, Acao, Chip } from "../NeumorfismoTabelas";

beforeAll(() => {
  // o Radix posiciona os painéis com ResizeObserver, que o jsdom não tem
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const tabelas = (c: HTMLElement) => [...c.querySelectorAll("table.neu-table")] as HTMLTableElement[];
const textos = (c: Element, sel: string) => [...c.querySelectorAll(sel)].map((e) => e.textContent);

describe("NeumorfismoTabelas", () => {
  it("vitrine: onze cartões, com os títulos do DS", () => {
    render(<NeumorfismoTabelas />);
    const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titulos).toEqual([
      "Tabela Básica",
      "Tabela Customizada",
      "Tabela com Linhas Listradas",
      "Tabela com Bordas",
      "Tabela sem Bordas",
      "Tabela Compacta",
      "Tabela com Hover",
      "Tabela com Cabeçalho Destacado",
      "Tabela Aninhada (Nesting)",
      "Tabela com Caption",
      "Tabela com Seleção (Checkbox)",
    ]);
  });

  it("básica: painel elevado, cabeçalhos com scope=col, legenda só para leitores de tela e os dados do pacote", () => {
    const { container } = render(<NeumorfismoTabelas />);
    const [basica] = tabelas(container);
    expect(basica.closest(".neu-table-basic")?.className).toContain("neu-table-flat");
    expect(textos(basica, "thead th")).toEqual(["Programa", "Categoria", "Valor", "Qtd", "Avaliação", "Status", "Ações"]);
    expect([...basica.querySelectorAll("thead th")].every((th) => th.getAttribute("scope") === "col")).toBe(true);
    expect(basica.querySelector("caption")?.className).toBe("sr-only");
    expect(textos(basica, "tbody tr:first-child td").slice(0, 3)).toEqual(["Educação Empreendedora", "Formação", "R$ 1.250"]);
    expect(basica.querySelector("tbody tr:first-child td")?.className).toBe("neu-table__strong");
    expect(basica.querySelector("tbody tr:first-child td:nth-child(2)")?.className).toBe("neu-table__muted");
    expect(basica.querySelectorAll("tbody tr")).toHaveLength(4);
    expect(basica.querySelector(".neu-table__stars")?.getAttribute("aria-label")).toBe("Avaliação 4.8");
    expect(within(basica).getByRole("button", { name: "Ações de Educação Empreendedora" }).getAttribute("aria-haspopup")).toBe("menu");
  });

  it("moldurada, listrada, com bordas, sem bordas e compacta trazem a classe da variante", () => {
    const { container } = render(<NeumorfismoTabelas />);
    const [, moldurada, listrada, bordas, semBordas, compacta] = tabelas(container);
    expect(moldurada.className).toContain("neu-table--framed");
    expect(moldurada.closest(".neu-table-basic")?.className).toContain("neu-table-framed");
    expect(listrada.querySelectorAll("tbody tr")).toHaveLength(6);
    expect([...listrada.querySelectorAll("tbody tr")].map((tr) => tr.classList.contains("neu-table__row--stripe"))).toEqual([true, false, true, false, true, false]);
    expect(bordas.className).toContain("neu-table--bordered");
    expect(semBordas.className).toContain("neu-table--borderless");
    expect(compacta.className).toContain("neu-table--compact");
    expect(compacta.querySelectorAll("tbody tr")).toHaveLength(6);
  });

  it("hover: a linha vira clicável, abre com Enter e Espaço (só no foco da própria linha) e o ⋮ não a abre", () => {
    const aoClicar = vi.fn();
    const { container } = render(
      <Tabela
        variante="basica"
        aoClicarLinha={aoClicar}
        colunas={[{ chave: "n", rotulo: "Nome" }, { chave: "x", rotulo: "Ação", renderizar: () => <button type="button">Interna</button> }]}
        linhas={[{ n: "A" }, { n: "B" }]}
      />,
    );
    const tabela = tabelas(container)[0];
    expect(tabela.className).toContain("neu-table--hoverable");
    const linhas = [...tabela.querySelectorAll("tbody tr")] as HTMLElement[];
    expect(linhas.every((l) => l.tabIndex === 0)).toBe(true);
    fireEvent.click(linhas[1]);
    expect(aoClicar).toHaveBeenLastCalledWith({ n: "B" }, 1);
    fireEvent.keyDown(linhas[0], { key: "Enter" });
    fireEvent.keyDown(linhas[0], { key: " " });
    expect(aoClicar).toHaveBeenCalledTimes(3);
    fireEvent.keyDown(screen.getAllByRole("button", { name: "Interna" })[0], { key: "Enter" });
    expect(aoClicar).toHaveBeenCalledTimes(3);
    fireEvent.keyDown(linhas[0], { key: "a" });
    expect(aoClicar).toHaveBeenCalledTimes(3);
  });

  it("sem aoClicarLinha nem destacavel, a linha não é focável; destacavel sozinho só ativa o hover", () => {
    const { container } = render(<Tabela variante="basica" destacavel colunas={[{ chave: "n", rotulo: "Nome" }]} linhas={[{ n: "A" }]} />);
    expect(tabelas(container)[0].className).toContain("neu-table--hoverable");
    expect(container.querySelector("tbody tr")?.getAttribute("tabindex")).toBeNull();
  });

  it("cabeçalho destacado: um com a marca e outro com o azul", () => {
    const { container } = render(<NeumorfismoTabelas />);
    const marca = container.querySelector(".neu-table--head-accent");
    const azul = container.querySelector(".neu-table--head-royal");
    expect(marca?.className).toContain("neu-table--framed");
    expect(azul).toBeTruthy();
    expect(marca?.querySelector("caption")?.textContent).toBe("Programas da instituição (cabeçalho destacado)");
  });

  it("caption: a legenda fica visível, no topo da tabela", () => {
    const { container } = render(<NeumorfismoTabelas />);
    const comLegenda = tabelas(container).find((t) => t.querySelector("caption.neu-table__caption") && t.className.includes("neu-table--basic"));
    expect(comLegenda?.querySelector("caption")?.textContent).toBe("Lista de programas educacionais e de consultoria");
  });

  it("aninhada: a tecla expande uma subtabela por vez e ela tem legenda e cabeçalhos próprios", () => {
    const { container } = render(<TabelaAninhada />);
    const teclas = screen.getAllByRole("button", { name: /Expandir turmas de/ });
    expect(teclas).toHaveLength(3);
    expect(teclas.every((t) => t.getAttribute("aria-expanded") === "false")).toBe(true);
    expect(container.querySelector(".neu-table__sub")).toBeNull();
    fireEvent.click(teclas[0]);
    const aberta = screen.getByRole("button", { name: "Recolher turmas de Educação Empreendedora" });
    expect(aberta.getAttribute("aria-expanded")).toBe("true");
    const alvo = container.querySelector(`#${aberta.getAttribute("aria-controls")}`);
    expect(alvo).toBeTruthy();
    expect(textos(alvo as Element, "thead th")).toEqual(["Turma", "Início", "Vagas", "Status"]);
    expect(textos(alvo as Element, "tbody tr td:first-child")).toEqual(["Turma A · Fortaleza", "Turma B · Sobral"]);
    expect(alvo?.querySelector("caption")?.textContent).toBe("Turmas de Educação Empreendedora");
    fireEvent.click(screen.getByRole("button", { name: "Expandir turmas de Transformação Digital" }));
    expect(container.querySelectorAll(".neu-table__sub")).toHaveLength(1);
    expect(textos(container, ".neu-table__sub tbody td:first-child")).toEqual(["Turma A · Online"]);
    fireEvent.click(screen.getByRole("button", { name: "Recolher turmas de Transformação Digital" }));
    expect(container.querySelector(".neu-table__sub")).toBeNull();
  });

  it("seleção: caixas role=checkbox, a do cabeçalho marca todas e a barra de ações em lote avisa a contagem", () => {
    const aoMudar = vi.fn();
    const { container } = render(
      <Tabela selecionavel aoMudarSelecao={aoMudar} legenda="Lista" colunas={[{ chave: "n", rotulo: "Nome" }]} linhas={[{ n: "A" }, { n: "B" }, { n: "C" }]} />,
    );
    expect(container.querySelector(".neu-bulkbar")).toBeNull();
    const todas = screen.getByRole("checkbox", { name: "Selecionar todos" });
    const linhas = screen.getAllByRole("checkbox", { name: "Selecionar linha" });
    expect(linhas).toHaveLength(3);
    expect(todas.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(linhas[1]);
    expect(aoMudar).toHaveBeenLastCalledWith([1]);
    expect(screen.getByRole("status").textContent).toContain("1 item selecionado");
    expect(container.querySelectorAll("tbody tr[aria-selected=\"true\"]")).toHaveLength(1);
    fireEvent.click(todas);
    expect(aoMudar).toHaveBeenLastCalledWith([0, 1, 2]);
    expect(todas.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("status").textContent).toContain("3 itens selecionados");
    expect(screen.getByRole("button", { name: /Exportar Seleção/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Excluir/ })).toBeTruthy();
    fireEvent.click(todas);
    expect(container.querySelector(".neu-bulkbar")).toBeNull();
  });

  it("seleção: clicar na linha alterna, o ⋮ não alterna e acoesEmLote={false} esconde a barra", () => {
    const { container } = render(
      <Tabela selecionavel acoesEmLote={false} colunas={[{ chave: "n", rotulo: "Nome" }, { chave: "a", rotulo: "Ações", renderizar: () => <Acao rotulo="Opções" /> }]} linhas={[{ n: "A" }, { n: "B" }]} />,
    );
    const linha = container.querySelector("tbody tr") as HTMLElement;
    fireEvent.click(linha);
    expect(linha.getAttribute("aria-selected")).toBe("true");
    expect(container.querySelector(".neu-bulkbar")).toBeNull();
    fireEvent.click(screen.getAllByRole("button", { name: "Opções" })[0]);
    expect(linha.getAttribute("aria-selected")).toBe("true");
    fireEvent.click(linha);
    expect(linha.getAttribute("aria-selected")).toBe("false");
  });

  it("seleção do cartão: células ricas com ícone, código, chip, nota e situação com ponto e palavra", () => {
    const { container } = render(<NeumorfismoTabelas />);
    const rica = container.querySelector(".neu-table-wrap table") as HTMLElement;
    expect(textos(rica, "thead th").slice(1)).toEqual(["Programa", "Categoria", "Valor", "Qtd", "Avaliação", "Status", "Ações"]);
    expect(rica.querySelector(".neu-table__item-icon")?.className).toContain("neu-tone-accent");
    expect(textos(rica, ".neu-table__item-code")).toEqual(["PROG-EDU-01", "PROG-DIG-02", "PROG-ESG-03", "PROG-LID-04"]);
    expect(textos(rica, ".neu-card__chip")).toEqual(["Formação", "Consultoria", "Inovação", "Gestão"]);
    expect(textos(rica, ".neu-table__rating")).toEqual(["★4.8", "★4.9", "★4.6", "★5.0"]);
    const estados = [...rica.querySelectorAll(".neu-table__status")];
    expect(estados.map((e) => e.textContent)).toEqual(["Ativo", "Em Andamento", "Pendente", "Ativo"]);
    expect(estados.map((e) => e.querySelector(".neu-dot")?.className.match(/neu-dot--(\w+)/)?.[1])).toEqual(["success", "royal", "accent", "success"]);
    expect(textos(rica, "tbody td:nth-child(5)")).toEqual(["45", "18", "32", "60"]);
    expect(rica.querySelector("tbody td:nth-child(5)")?.className).toBe("neu-table__mono");
  });

  it("auxiliares: Estrelas, Avaliacao, Situacao, CelulaItem, Chip e Acao", () => {
    const aoClicar = vi.fn();
    const { container } = render(
      <div>
        <Estrelas valor="4.8" />
        <Avaliacao valor={5} />
        <Situacao tom="perigo">Suspenso</Situacao>
        <Situacao>Ativo</Situacao>
        <CelulaItem titulo="Sem ícone" />
        <Chip>Gestão</Chip>
        <Acao aoClicar={aoClicar} />
      </div>,
    );
    expect(container.querySelector(".neu-table__stars")?.textContent).toBe("4.8 ★");
    expect(container.querySelector(".neu-table__rating")?.getAttribute("aria-label")).toBe("Avaliação 5");
    expect(container.querySelector(".neu-tone-danger .neu-dot--danger")).toBeTruthy();
    expect(container.querySelectorAll(".neu-table__status")[1].className).toContain("neu-tone-success");
    expect(container.querySelector(".neu-table__item-icon")).toBeNull();
    expect(container.querySelector(".neu-table__item-code")).toBeNull();
    const acao = screen.getByRole("button", { name: "Mais opções" });
    fireEvent.click(acao);
    expect(aoClicar).toHaveBeenCalledTimes(1);
  });

  it("tabela sem linhas: a caixa do cabeçalho fica desmarcada e o corpo vazio", () => {
    const { container } = render(<Tabela selecionavel colunas={[{ chave: "n", rotulo: "Nome" }]} linhas={[]} />);
    expect(screen.getByRole("checkbox", { name: "Selecionar todos" }).getAttribute("aria-checked")).toBe("false");
    expect(container.querySelectorAll("tbody tr")).toHaveLength(0);
  });

  it("seleção inicial e listrada na tabela rica", () => {
    const { container } = render(<Tabela selecionavel listrada selecaoInicial={[0]} colunas={[{ chave: "n", rotulo: "Nome" }]} linhas={[{ n: "A" }, { n: "B" }, { n: "C" }]} />);
    expect(container.querySelectorAll("tbody tr[aria-selected=\"true\"]")).toHaveLength(1);
    expect(screen.getByRole("status").textContent).toContain("1 item selecionado");
    expect([...container.querySelectorAll("tbody tr")].map((t) => t.classList.contains("neu-table__row--stripe"))).toEqual([true, false, true]);
  });
});
