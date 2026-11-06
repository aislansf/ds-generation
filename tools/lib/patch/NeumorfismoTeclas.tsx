import type { ReactNode } from "react";
import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Kbd no estilo Neumorfismo (componente Kbd do pacote Neumorphic UI v3.2.0): teclas pequenas e convexas,
 * para atalhos. A `Tecla` é uma tecla só; o `GrupoTeclas` junta várias, aceitando `teclas` como lista
 * (`["Ctrl", "K"]`), como texto com `+` (`"Ctrl+B"`), como texto curto de símbolos (`"⌘K"`, uma tecla por caractere) ou
 * filhos livres (as teclas e um "+" entre elas). Cada tecla é um `kbd` convexo com a borda de aresta, o texto discreto de
 * 11px e largura mínima de 20px dentro de um grupo; a versão grande (13px) serve para destaques. Vai dentro do
 * texto, de botões ("Buscar ⌘K"), de tooltips e dos itens de menu e de comandos. Símbolos como ⌘ ⇧ ⌥ ⌃ não são lidos
 * pelos leitores de tela: dê um `rotulo` ao grupo quando o atalho importa. Entra numa seção nova do neumorfismo
 * ("Kbd", depois do Item) e só é usado quando ESTILO.id === "neumorfismo". As classes neu-kbd* vêm de
 * src/styles/estilo.css (as mesmas das teclas de atalho de Comandos, Menus e Questionário).
 */

interface TeclaProps {
  /** Tamanho grande (13px) */
  grande?: boolean;
  children?: ReactNode;
}

export function Tecla({ grande, children }: TeclaProps) {
  return <kbd className={`neu-kbd${grande ? " neu-kbd--lg" : ""}`}>{children}</kbd>;
}

interface GrupoTeclasProps {
  /** Lista, texto com "+" ("Ctrl+B") ou texto curto de símbolos ("⌘K", uma tecla por caractere) */
  teclas?: string[] | string;
  /** Nome do atalho para leitor de tela ("Ctrl mais B") */
  rotulo?: string;
  className?: string;
  /** Teclas livres, quando `teclas` não for usado */
  children?: ReactNode;
}

/** Quebra o texto do atalho em teclas: com "+" separa por ele; curto (até 3 caracteres) separa por caractere */
export function separarTeclas(teclas: string[] | string): string[] {
  if (Array.isArray(teclas)) return teclas;
  const texto = String(teclas);
  return texto.length <= 3 && !/\+/.test(texto) ? Array.from(texto) : texto.split("+");
}

export function GrupoTeclas({ teclas, rotulo, className, children }: GrupoTeclasProps) {
  const filhos = teclas != null ? separarTeclas(teclas).map((t, i) => <Tecla key={i}>{t}</Tecla>) : children;
  return (
    <span className={["neu-kbd-group", className].filter(Boolean).join(" ")} aria-label={rotulo}>
      {filhos}
    </span>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

export default function NeumorfismoTeclas() {
  return (
    <ComponentPreview
      title="Kbd"
      description="Teclas pequenas e convexas, para atalhos de teclado. Uma tecla solta ou um grupo, a partir de uma lista, de um texto com + ou de símbolos."
      whenToUse={["Mostrar atalhos junto de botões, itens de menu e comandos", "Dentro de frases: \"Pressione Ctrl K para abrir a busca\"", "Em tooltips que explicam o atalho de uma ação"]}
      whenNotToUse={["Como botão: a tecla é só um desenho, não responde a clique", "Textos longos ou teclas de um jogo inteiro: descreva em texto", "Atalho que só existe no celular: não há teclado"]}
      accessibility={[
        "Cada tecla é um elemento kbd, lido como texto; os símbolos ⌘ ⇧ ⌥ ⌃ não são lidos pelos leitores de tela",
        "Quando o atalho importa, dê um rotulo ao grupo (\"Ctrl mais B\"), que vira o aria-label",
        "O \"+\" entre as teclas é só decoração visual no grupo livre; o rótulo diz o atalho por extenso",
        "No botão, o atalho vem depois do texto (\"Buscar ⌘K\"), nunca no lugar do nome",
        "O contraste do texto das teclas é o do texto discreto do tema",
      ]}
      code={`<GrupoTeclas rotulo="Command, Shift, Option, Control">
  <Tecla>⌘</Tecla><Tecla>⇧</Tecla><Tecla>⌥</Tecla><Tecla>⌃</Tecla>
</GrupoTeclas>

<GrupoTeclas rotulo="Ctrl mais B">
  <Tecla>Ctrl</Tecla><span>+</span><Tecla>B</Tecla>
</GrupoTeclas>

<p>Pressione <GrupoTeclas teclas={["Ctrl", "K"]} /> para abrir a busca.</p>
<Button variant="outline" className="neu-btn--convex"><Search size={16} /> Buscar <GrupoTeclas teclas="⌘K" /></Button>`}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
        <div className="neu-stack" style={{ gap: 16, alignItems: "flex-start" }}>
          <Legenda>Exemplo de referência</Legenda>
          <GrupoTeclas rotulo="Command, Shift, Option, Control">
            <Tecla>⌘</Tecla>
            <Tecla>⇧</Tecla>
            <Tecla>⌥</Tecla>
            <Tecla>⌃</Tecla>
          </GrupoTeclas>
          <GrupoTeclas rotulo="Ctrl mais B">
            <Tecla>Ctrl</Tecla>
            <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>+</span>
            <Tecla>B</Tecla>
          </GrupoTeclas>
        </div>
        <div className="neu-stack" style={{ gap: 16, alignItems: "flex-start" }}>
          <Legenda>Em contexto</Legenda>
          <p style={{ margin: 0, fontSize: 13, color: "hsl(var(--foreground))", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            Pressione <GrupoTeclas teclas={["Ctrl", "K"]} /> para abrir a busca.
          </p>
          <Button variant="outline" className="neu-btn--convex">
            <Search aria-hidden="true" size={16} /> Buscar <GrupoTeclas teclas="⌘K" />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="outline" className="neu-ib neu-btn--convex" aria-label="Salvar">
                <Check aria-hidden="true" size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                Salvar <Tecla>Ctrl</Tecla> <Tecla>S</Tecla>
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </ComponentPreview>
  );
}
