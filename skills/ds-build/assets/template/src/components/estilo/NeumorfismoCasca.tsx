import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import logoBrandWhite from "@/assets/brand-logo-white-header.svg";
import { Cabecalho } from "@/components/estilo/NeumorfismoCabecalhos";
import { GavetaLateral, type ItemGaveta, type SubitemGaveta } from "@/components/estilo/NeumorfismoGavetaLateral";
import { Rodape } from "@/components/estilo/NeumorfismoRodapes";

/**
 * Casca do DS no estilo Neumorfismo: o cabeçalho e o menu lateral são os componentes já validados na página de
 * Componentes, não uma estrutura própria. O topo é o Header "barra" (tecla de menu, marca, nome do sistema e a tecla
 * de tema nas ações, colado de borda a borda) e a navegação é a Sidebar em gaveta (busca que filtra itens e subitens,
 * grupos que abrem em subitens, item atual com o ponto aceso e o pé com a organização e a versão). A partir de 1024px o
 * menu fica fixo ao lado do conteúdo (a tecla do cabeçalho o esconde e mostra); abaixo disso ele abre como gaveta sobre
 * o véu. O rodapé é o Footer "slim".
 * O menu da gaveta tem dois níveis: o que o DS tem a mais (terceiro e quarto níveis, como os de Modelos de BI) entra como
 * subitens a seguir ao pai, e todo grupo sem filho para a própria página ganha "Visão geral" como primeiro subitem, que leva à página do grupo. Só é
 * usada quando ESTILO.id === "neumorfismo" (DSLayout recebe os itens por `itens`).
 */

interface NoNav {
  label: string;
  path: string;
  disabled?: boolean;
  title?: string;
  icon?: ReactNode;
  children?: NoNav[];
}

const qDesktop = "(min-width: 1024px)";

function achatar(no: NoNav, prefixo: string, saida: { sub: SubitemGaveta; caminho: string; livre: boolean }[], nivel: number) {
  const rotulo = (nivel >= 4 && prefixo ? `${prefixo} · ${no.label}` : no.label) + (no.disabled ? " (em breve)" : "");
  saida.push({ sub: { id: "", rotulo }, caminho: no.path, livre: !!no.disabled });
  no.children?.forEach((f) => achatar(f, no.label, saida, nivel + 1));
}

interface Mapa {
  itens: ItemGaveta[];
  caminhos: Record<string, string>;
  ordem: { id: string; caminho: string }[];
}

function montar(nos: NoNav[]): Mapa {
  const caminhos: Record<string, string> = {};
  const ordem: { id: string; caminho: string }[] = [];
  const registrar = (id: string, caminho: string, livre = false) => {
    if (livre) return;
    caminhos[id] = caminho;
    ordem.push({ id, caminho });
  };
  const itens = nos.map((no, i): ItemGaveta => {
    if (!no.children?.length) {
      const id = `n${i}`;
      registrar(id, no.path);
      return { id, rotulo: no.label, icone: no.icon };
    }
    const planos: { sub: SubitemGaveta; caminho: string; livre: boolean }[] = [];
    // o grupo que já tem um filho para a própria página (Gráficos ECharts) não ganha outro
    if (!no.children.some((c) => c.path === no.path)) planos.push({ sub: { id: "", rotulo: "Visão geral" }, caminho: no.path, livre: false });
    no.children.forEach((c) => achatar(c, "", planos, 2));
    const filhos = planos.map((p, j) => {
      const id = `n${i}.${j}`;
      registrar(id, p.caminho, p.livre);
      return { ...p.sub, id };
    });
    return { id: `n${i}`, rotulo: no.label, icone: no.icon, filhos, abertoInicial: false };
  });
  return { itens, caminhos, ordem };
}

export default function CascaNeumorfismo({ itens, children }: { itens: NoNav[]; children: ReactNode }) {
  const [gaveta, setGaveta] = useState(false);
  const [menuFixo, setMenuFixo] = useState(true);
  const raiz = useRef<HTMLDivElement>(null);
  const topo = useRef<HTMLDivElement>(null);
  const local = useLocation();
  const navegar = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { itens: grupos, caminhos, ordem } = useMemo(() => montar(itens), [itens]);

  // o item atual: o primeiro cujo endereço casa com a página (com o hash, se o endereço o tem)
  const ativo = useMemo(() => {
    const casa = (caminho: string) => {
      const [rota, hash] = caminho.split("#");
      if (hash && local.hash === `#${hash}`) return rota === local.pathname || !rota;
      return local.pathname === rota && !local.hash && !hash;
    };
    return ordem.find((o) => casa(o.caminho))?.id;
  }, [ordem, local.pathname, local.hash]);

  // o grupo da página atual abre sozinho; a troca de página refaz a gaveta e leva a rolagem ao topo do menu
  const comAbertura = useMemo(
    () =>
      grupos.map((g) => {
        if (!g.filhos) return g;
        const rota = local.pathname;
        const contem = g.filhos.some((f) => (caminhos[f.id] ?? "").split("#")[0] === rota);
        return { ...g, abertoInicial: contem };
      }),
    [grupos, caminhos, local.pathname],
  );

  useEffect(() => {
    setGaveta(false);
  }, [local.pathname]);

  // a altura do cabeçalho vai para o CSS, que posiciona o menu fixo logo abaixo dele
  useEffect(() => {
    const el = topo.current;
    const r = raiz.current;
    if (!el || !r) return;
    const aplicar = () => r.style.setProperty("--ds-topo", `${el.offsetHeight}px`);
    aplicar();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(aplicar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function aoMenu() {
    if (typeof window !== "undefined" && window.matchMedia?.(qDesktop).matches) setMenuFixo((v) => !v);
    else setGaveta((v) => !v);
  }

  function aoNavegar(id: string) {
    const destino = caminhos[id];
    if (!destino) return;
    const [rota, hash] = destino.split("#");
    if (rota && rota !== local.pathname) navegar(rota + (hash ? `#${hash}` : ""));
    else if (hash) {
      navegar(`${rota || local.pathname}#${hash}`);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
    setGaveta(false);
  }

  const iniciais = "__BRAND_NAME__".slice(0, 2).toUpperCase();
  const propsMenu = {
    itens: comAbertura,
    ativo,
    aoNavegar,
    titulo: "__BRAND_NAME__",
    subtitulo: "Design System",
    placeholderBusca: "Buscar seções, componentes...",
    iniciaisRodape: iniciais,
    tituloRodape: "__BRAND_NAME__",
    metaRodape: "v1.0.0",
    rotuloNav: "Navegação do design system",
  };

  return (
    <div ref={raiz} className="neu-casca">
      <div ref={topo} className="neu-casca__topo">
        <Cabecalho
          variante="barra"
          rente
          logo={
            <a href="https://__DS_DOMAIN__/" target="_blank" rel="noopener noreferrer" aria-label="Ir para o site do Design System __BRAND_NAME__" className="neu-casca__logo">
              <img src={logoBrandWhite} alt="__BRAND_NAME__" />
            </a>
          }
          marca="__BRAND_NAME__"
          nomeApp="Design System __BRAND_NAME__"
          aoMenu={aoMenu}
          rotuloMenu={menuFixo ? "Recolher menu lateral" : "Expandir menu lateral"}
          acoes={
            <button type="button" className="neu-header-c__key neu-header-k__menu" onClick={toggleTheme} aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"} title={theme === "light" ? "Modo escuro" : "Modo claro"}>
              {theme === "light" ? <Moon aria-hidden="true" size={16} /> : <Sun aria-hidden="true" size={16} />}
            </button>
          }
        />
      </div>
      <div className="neu-casca__corpo">
        {menuFixo && (
          <div className="neu-casca__menu">
            <GavetaLateral key={local.pathname} embutida {...propsMenu} />
          </div>
        )}
        <main className="neu-casca__principal">
          <div className="neu-casca__conteudo">{children}</div>
          <Rodape variante="slim" rente marca="__BRAND_NAME__" projeto="Design System" versao="v1.0.0" />
        </main>
      </div>
      <GavetaLateral key={`g-${local.pathname}`} {...propsMenu} aberta={gaveta} aoFechar={() => setGaveta(false)} />
    </div>
  );
}
