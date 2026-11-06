import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DollarSign } from "lucide-react";
import NeumorfismoEstatisticas, { CartaoEstatistica } from "../NeumorfismoEstatisticas";

describe("NeumorfismoEstatisticas", () => {
  it("cartão: as sete formas do pacote, cada uma uma região nomeada", () => {
    const { container } = render(<NeumorfismoEstatisticas />);
    expect(container.querySelectorAll(".neu-statx")).toHaveLength(7);
    for (const v of ["goal", "cmp", "hl", "donut", "spark", "area", "report"]) expect(container.querySelectorAll(`.neu-statx--${v}`)).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Taxa de execução" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Vendas totais: R$ 250K" })).toBeTruthy();
    expect(screen.getByRole("table", { name: "Receita, despesa e margem por trimestre de 2026" })).toBeTruthy();
  });

  it("meta: a calha tem o nome com a meta, o marco fica na posição dela e o rótulo vai para o lado certo", () => {
    const { container, rerender } = render(<CartaoEstatistica rotulo="Execução" valor="78,4%" progresso={78.4} meta={95} legenda="Faltam 16,6 p.p." />);
    const barra = screen.getByRole("progressbar", { name: "Execução, meta 95%" });
    expect(barra.getAttribute("aria-valuenow")).toBe("78.4");
    expect(barra.getAttribute("aria-valuetext")).toBe("78,4%");
    expect((container.querySelector(".neu-statx__goal") as HTMLElement).style.left).toBe("95%");
    const rotulo = container.querySelector(".neu-statx__goal-label") as HTMLElement;
    expect(rotulo.textContent).toBe("Meta: 95%");
    expect(rotulo.style.right).toBe("5%");
    expect(container.querySelector(".neu-statx__fill--met")).toBeNull();
    expect(container.querySelector(".neu-statx__caption")?.textContent).toBe("Faltam 16,6 p.p.");
    expect(container.querySelector(".neu-statx__scale")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<CartaoEstatistica rotulo="Execução" valor="30%" progresso={30} meta={40.5} rotuloMeta="Alvo" />);
    const r2 = container.querySelector(".neu-statx__goal-label") as HTMLElement;
    expect(r2.textContent).toBe("Alvo: 40,5%");
    expect(r2.style.left).toBe("40.5%");
  });

  it("meta atingida: o preenchimento vira verde; sem meta não há marco nem rótulo", () => {
    const { container, rerender } = render(<CartaoEstatistica rotulo="E" valor="96%" progresso={96} meta={95} />);
    expect(container.querySelector(".neu-statx__fill--met")).toBeTruthy();
    rerender(<CartaoEstatistica rotulo="E" valor="96%" progresso={120} />);
    expect(container.querySelector(".neu-statx__goal")).toBeNull();
    expect(container.querySelector(".neu-statx__goalrow")).toBeNull();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByRole("progressbar").getAttribute("aria-label")).toBe("E");
  });

  it("comparação: atual, anterior, pílula com texto escondido do período e barras lidas como uma imagem", () => {
    const { container } = render(
      <CartaoEstatistica variante="comparacao" rotulo="Atendimentos" valor="1.247" periodo="Mar" anterior="1.102" periodoAnterior="Fev" tendencia="+13,2%" rotuloSerie="Por mês" dados={[10, 20, 40]} />,
    );
    expect(container.querySelector(".neu-statx__value--prev")?.textContent).toBe("1.102");
    const pilula = container.querySelector(".neu-statx__trend--up") as HTMLElement;
    expect(pilula.textContent).toBe("+13,2% em relação a Fev");
    expect(pilula.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    const serie = screen.getByRole("img", { name: "Por mês: 10, 20, 40" });
    const barras = [...serie.querySelectorAll(".neu-statx__bar")] as HTMLElement[];
    expect(barras.map((b) => b.style.height)).toEqual(["25%", "50%", "100%"]);
    expect(barras[2].className).toBe("neu-statx__bar neu-statx__bar--on");
  });

  it("comparação em queda e sem o anterior: a pílula cai e o texto escondido fala do período anterior", () => {
    const { container } = render(<CartaoEstatistica variante="comparacao" rotulo="R" valor="1" periodo="Mar" tendencia="-2%" />);
    expect(container.querySelector(".neu-statx__trend--down")?.textContent).toBe("-2% em relação ao período anterior");
    expect(container.querySelector(".neu-statx__value--prev")).toBeNull();
    expect(container.querySelector(".neu-statx__bars")).toBeNull();
  });

  it("destaque: eyebrow, valor, descrição e ícone decorativo; o tom da marca troca o degradê", () => {
    const { container, rerender } = render(<CartaoEstatistica variante="destaque" rotulo="Total" valor="R$ 8,6B" descricao="Recursos" icone={DollarSign} />);
    expect(container.querySelector(".neu-statx__eyebrow")?.textContent).toBe("Total");
    expect(container.querySelector(".neu-statx__hl-value")?.textContent).toBe("R$ 8,6B");
    expect(container.querySelector(".neu-statx__hl-desc")?.textContent).toBe("Recursos");
    expect(container.querySelector(".neu-statx__hl-icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".neu-statx--hl-accent")).toBeNull();
    rerender(<CartaoEstatistica variante="destaque" tom="marca" rotulo="Total" valor="1" />);
    expect(container.querySelector(".neu-statx--hl-accent")).toBeTruthy();
    expect(container.querySelector(".neu-statx__hl-desc")).toBeNull();
    expect(container.querySelector(".neu-statx__hl-icon")).toBeNull();
  });

  it("rosca: o anel começa em 12h, o arco acompanha o percentual e o disco é lido como uma imagem", () => {
    const { container } = render(<CartaoEstatistica variante="rosca" rotulo="Vendas" emblema="Mensal" percentual={72} rotuloPercentual="Meta mensal" valor="R$ 250K" legenda="Total" />);
    expect(screen.getByRole("img", { name: "Meta mensal: 72%" })).toBeTruthy();
    expect(container.querySelector(".neu-statx__donut-pct")?.textContent).toBe("72%");
    const arco = container.querySelector(".neu-statx__ring") as SVGElement;
    const c = 2 * Math.PI * 26;
    expect(Number(arco.getAttribute("stroke-dasharray"))).toBeCloseTo(c, 3);
    expect(Number(arco.getAttribute("stroke-dashoffset"))).toBeCloseTo(c * 0.28, 3);
    expect(arco.getAttribute("transform")).toBe("rotate(-90 32 32)");
    expect(arco.getAttribute("stroke")).toMatch(/^url\(#[^:]+\)$/);
    expect(container.querySelector(".neu-statx__chip--accent")?.textContent).toBe("Mensal");
    expect(container.querySelector(".neu-statx__right .neu-statx__period")?.textContent).toBe("Total");
  });

  it("barras: valor à esquerda, série de 96 × 56 à direita com a última barra em destaque", () => {
    const { container } = render(<CartaoEstatistica variante="barras" rotulo="A" valor="R$ 1" dados={[40, 80]} rotuloSerie="Vendas" emblema={{ rotulo: "Novo", tom: "azul" }} />);
    expect(container.querySelector(".neu-statx__left .neu-statx__value")?.textContent).toBe("R$ 1");
    expect(container.querySelector(".neu-statx__chip--royal")?.textContent).toBe("Novo");
    expect(screen.getByRole("img", { name: "Vendas: 40, 80" }).querySelectorAll(".neu-statx__bar--on")).toHaveLength(1);
  });

  it("área: linha, preenchimento, ponto no fim e delta pelo sinal", () => {
    const { container } = render(<CartaoEstatistica variante="area" rotulo="G" delta="-R$ 4K" valor="R$ 5" dados={[10, 30, 20]} rotuloSerie="Vendas" />);
    expect(container.querySelector(".neu-statx__delta.neu-statx__trend--down")?.textContent).toBe("-R$ 4K");
    expect(container.querySelector("polygon")).toBeTruthy();
    const linha = container.querySelector("polyline")?.getAttribute("points") ?? "";
    expect(linha.split(" ")).toHaveLength(3);
    expect(container.querySelector(".neu-statx__endpoint")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Vendas: 10, 30, 20" })).toBeTruthy();
  });

  it("relatório: legenda, cabeçalhos de coluna e de linha, números à direita e margens coloridas com o sinal", () => {
    render(
      <CartaoEstatistica
        variante="relatorio"
        rotulo="Trimestres"
        emblema={{ rotulo: "Novo", tom: "sucesso" }}
        legenda="Margem por trimestre"
        colunas={["Trimestre", "Margem"]}
        linhas={[
          ["T1", { valor: "R$ 45k", tom: "sucesso" }],
          ["T3", { valor: "−R$ 8k", tom: "perigo" }],
          ["T4", "R$ 0"],
        ]}
      />,
    );
    const tabela = screen.getByRole("table", { name: "Margem por trimestre" });
    expect(within(tabela).getAllByRole("columnheader").map((c) => c.textContent)).toEqual(["Trimestre", "Margem"]);
    expect(within(tabela).getAllByRole("rowheader").map((c) => c.textContent)).toEqual(["T1", "T3", "T4"]);
    const celulas = within(tabela).getAllByRole("cell");
    expect(celulas.map((c) => c.className)).toEqual(["neu-statx__num neu-tone-success", "neu-statx__num neu-tone-danger", "neu-statx__num"]);
    expect(celulas[1].textContent).toBe("−R$ 8k");
  });
});
