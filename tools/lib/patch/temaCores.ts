import { useEffect, useState } from "react";
import type { EChartsOption } from "echarts";
import { readToken, tokenDaCor } from "./brandTheme";
import { lerToken } from "./estiloSeries";

/**
 * Gráficos que acompanham o tema (gerado pelo ds-build). Dois defeitos faziam as cores perderem o contraste ao
 * alternar entre claro e escuro:
 *
 * 1. useTheme() não é compartilhado: cada chamada tem o próprio estado e só o botão que chamou toggleTheme muda. O
 *    BrandChart ficava com o tema do carregamento e não refazia o gráfico quando o botão do cabeçalho alternava a
 *    classe `dark`. useTemaDoDocumento lê a classe do <html> e acompanha as mudanças.
 * 2. Os presets guardam cores no carregamento do módulo (`const palette = getBrandPalette()`): mesmo refeito, o
 *    gráfico reaplicava as cores do tema em que o módulo foi lido. Aqui toda cor que veio de readToken (brandTheme.ts
 *    lembra o token e o alfa de cada uma) é lida de novo com os tokens de agora, antes do setOption. O que não veio de
 *    token (hexadecimal literal, cor calculada) fica como está.
 *
 *   --chart-theme-sync   1 liga os dois; 0 deixa tudo como era (todos os estilos, menos o Neumorfismo).
 */

/** Tema de verdade do documento (classe `dark` do <html>); com o token desligado devolve o `padrao`, sem observar nada. */
export function useTemaDoDocumento(padrao: "light" | "dark"): "light" | "dark" {
  const [tema, setTema] = useState(padrao);
  useEffect(() => {
    if (lerToken("--chart-theme-sync") <= 0) return;
    const raiz = document.documentElement;
    const ler = () => setTema(raiz.classList.contains("dark") ? "dark" : "light");
    ler();
    const observador = new MutationObserver(ler);
    observador.observe(raiz, { attributes: true, attributeFilter: ["class"] });
    return () => observador.disconnect();
  }, []);
  return tema;
}

const ehObjetoSimples = (v: object): boolean => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

export function aplicarTemaVivo(option: EChartsOption, ativo: boolean = lerToken("--chart-theme-sync") > 0): EChartsOption {
  if (!ativo) return option;
  const lidas = new Map<string, string>();
  const atual = (cor: string): string => {
    let nova = lidas.get(cor);
    if (nova === undefined) {
      const origem = tokenDaCor(cor);
      nova = origem ? readToken(origem.token, origem.alpha) : cor;
      lidas.set(cor, nova);
    }
    return nova;
  };

  const emCurso = new WeakSet<object>();
  const percorrer = (v: unknown): unknown => {
    if (typeof v === "string") return atual(v);
    if (!v || typeof v !== "object" || emCurso.has(v)) return v;

    // dados numéricos (milhares de pontos) não têm cor: pula sem copiar
    if (Array.isArray(v)) {
      if (typeof v[0] === "number") return v;
      emCurso.add(v);
      let mudou = false;
      const lista = v.map((x) => {
        const n = percorrer(x);
        if (n !== x) mudou = true;
        return n;
      });
      emCurso.delete(v);
      return mudou ? lista : v;
    }

    // degradês do zrender são instâncias de classe: só as faixas de cor interessam
    if (!ehObjetoSimples(v)) {
      const faixas = (v as { colorStops?: unknown }).colorStops;
      if (!Array.isArray(faixas)) return v;
      const novas = percorrer(faixas);
      return novas === faixas ? v : Object.assign(Object.create(Object.getPrototypeOf(v)), v, { colorStops: novas });
    }

    emCurso.add(v);
    let mudou = false;
    const copia: Record<string, unknown> = {};
    for (const [chave, valor] of Object.entries(v)) {
      const n = percorrer(valor);
      if (n !== valor) mudou = true;
      copia[chave] = n;
    }
    emCurso.delete(v);
    return mudou ? copia : v;
  };

  return percorrer(option) as EChartsOption;
}
