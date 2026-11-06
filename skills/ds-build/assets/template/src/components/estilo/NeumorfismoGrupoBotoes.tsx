import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Archive, ArrowLeft, BarChart3, CalendarPlus, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, FileText, LayoutGrid, ListFilter, Mail, MailCheck, Menu, MoreHorizontal, Star, Tag, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { ComponentPreview } from "@/components/DSComponents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Vitrine do Grupo de botões no estilo Neumorfismo (componente ButtonGroup do pacote Neumorphic UI v3.2.0): botões
 * relacionados numa só casca convexa, separados por fendas; o segmento pressionado, aberto ou marcado afunda.
 * Só é usada quando ESTILO.id === "neumorfismo" (ComponentesPage); a camada src/styles/estilo.css dá o relevo.
 */

interface GrupoProps {
  label: string;
  orientation?: "horizontal" | "vertical";
  size?: "md" | "sm";
  children: ReactNode;
}

/** Casca convexa de segmentos. Com outros grupos dentro, vira uma barra de ferramentas (sem casca, com espaço entre eles). */
export function GrupoBotoes({ label, orientation = "horizontal", size = "md", children }: GrupoProps) {
  return (
    <div role="group" aria-label={label} className={["neu-bgroup", orientation === "vertical" ? "neu-bgroup--vertical" : "", size === "sm" ? "neu-bgroup--sm" : ""].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

/** Barra de ferramentas: um grupo de grupos. */
export function BarraGrupos({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="neu-bgroup neu-bgroup--outer">
      {children}
    </div>
  );
}

interface SegmentoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icone?: ReactNode;
  /** Só ícone: o nome acessível vem de `label` */
  label?: string;
  primario?: boolean;
}

export const Segmento = forwardRef<HTMLButtonElement, SegmentoProps>(function Segmento({ icone, label, primario = false, className, children, ...resto }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={children ? undefined : label}
      className={["neu-seg", children ? "" : "neu-seg--icone", primario ? "neu-seg--primario" : "", className ?? ""].filter(Boolean).join(" ")}
      {...resto}
    >
      {icone}
      {children}
    </button>
  );
});

export function TextoSegmento({ children, icone }: { children: ReactNode; icone?: ReactNode }) {
  return (
    <span className="neu-bgroup__text">
      {icone}
      {children}
    </span>
  );
}

const ic = { "aria-hidden": true, size: 16 } as const;

export default function NeumorfismoGrupoBotoes() {
  const [rotulo, setRotulo] = useState("pessoal");
  const [ultima, setUltima] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [vista, setVista] = useState("lista");
  const rotulos: [string, string][] = [["pessoal", "Pessoal"], ["trabalho", "Trabalho"], ["outro", "Outro"]];
  const nomeRotulo = rotulos.find((r) => r[0] === rotulo)?.[1];
  const agir = (s: string) => () => setUltima(s);

  return (
    <ComponentPreview
      title="Grupo de botões"
      description="Junta botões relacionados numa só casca convexa para lerem como um único controle: Arquivar | Denunciar, um botão dividido com menu, anterior/próximo, alternância de visualização."
      whenToUse={["Ações do mesmo assunto (arquivar, denunciar, adiar)", "Botão dividido: ação principal e as variações no menu", "Alternância de visualização, com aria-pressed em cada botão"]}
      whenNotToUse={["Ações sem relação entre si: use botões separados, com 8px ou mais entre as peças", "Mais de um botão primário no mesmo grupo"]}
      accessibility={["Todo grupo tem role=\"group\" e nome (aria-label)", "Botão só de ícone exige label", "Alternância usa aria-pressed; menu aberto e botão pressionado afundam", "Foco: anel de 2px dentro do segmento"]}
      code={`<GrupoBotoes label="Ações da mensagem">
  <Segmento>Arquivar</Segmento>
  <Segmento>Denunciar</Segmento>
</GrupoBotoes>

<GrupoBotoes label="Visualização">
  <Segmento aria-pressed={vista === "lista"}>Lista</Segmento>
  <Segmento aria-pressed={vista === "grade"}>Grade</Segmento>
</GrupoBotoes>`}
    >
      <div className="neu-stack">
        <div>
          <p className="neu-cap">Exemplo de referência</p>
          <BarraGrupos label="Ações da mensagem">
            <GrupoBotoes label="Voltar">
              <Segmento icone={<ArrowLeft {...ic} />} label="Voltar" onClick={agir("Voltar")} />
            </GrupoBotoes>
            <GrupoBotoes label="Arquivar ou denunciar">
              <Segmento onClick={agir("Arquivar")}>Arquivar</Segmento>
              <Segmento onClick={agir("Denunciar")}>Denunciar</Segmento>
            </GrupoBotoes>
            <GrupoBotoes label="Adiar e mais opções">
              <Segmento onClick={agir("Adiar")}>Adiar</Segmento>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Segmento icone={<MoreHorizontal {...ic} />} label="Mais opções" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onSelect={agir("Marcar como lida")}><MailCheck {...ic} /> Marcar como lida</DropdownMenuItem>
                  <DropdownMenuItem onSelect={agir("Arquivar")}><Archive {...ic} /> Arquivar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={agir("Adiar")}><Clock {...ic} /> Adiar</DropdownMenuItem>
                  <DropdownMenuItem onSelect={agir("Adicionar à agenda")}><CalendarPlus {...ic} /> Adicionar à agenda</DropdownMenuItem>
                  <DropdownMenuItem onSelect={agir("Adicionar à lista")}><ListFilter {...ic} /> Adicionar à lista</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger><Tag {...ic} /> Rotular como…</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={rotulo}
                        onValueChange={(v) => {
                          setRotulo(v);
                          setUltima(`Rótulo: ${rotulos.find((r) => r[0] === v)?.[1]}`);
                        }}
                      >
                        {rotulos.map(([valor, nome]) => (
                          <DropdownMenuRadioItem key={valor} value={valor}>{nome}</DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onSelect={agir("Excluir")}><Trash2 {...ic} /> Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </GrupoBotoes>
          </BarraGrupos>
          <p className="neu-help" aria-live="polite">
            {ultima ? `Última ação: ${ultima} · rótulo atual: ${nomeRotulo}` : `Rótulo atual: ${nomeRotulo}. Abra ⋯ › Rotular como… para trocar.`}
          </p>
        </div>

        <div className="neu-row neu-row--topo">
          <div>
            <p className="neu-cap">Botão dividido (primário)</p>
            <GrupoBotoes label="Salvar">
              <Segmento primario icone={<Check {...ic} />} onClick={agir("Salvar")}>Salvar</Segmento>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Segmento icone={<ChevronDown {...ic} />} label="Outras formas de salvar" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={agir("Salvar como rascunho")}><FileText {...ic} /> Salvar como rascunho</DropdownMenuItem>
                  <DropdownMenuItem onSelect={agir("Salvar e enviar")}><Mail {...ic} /> Salvar e enviar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </GrupoBotoes>
          </div>

          <div>
            <p className="neu-cap">Paginação com texto</p>
            <GrupoBotoes label="Navegar entre registros" size="sm">
              <Segmento icone={<ChevronLeft {...ic} />} label="Registro anterior" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} />
              <TextoSegmento>
                <span className="neu-mono" aria-live="polite">{pagina} de 12</span>
              </TextoSegmento>
              <Segmento icone={<ChevronRight {...ic} />} label="Próximo registro" disabled={pagina === 12} onClick={() => setPagina(pagina + 1)} />
            </GrupoBotoes>
          </div>

          <div>
            <p className="neu-cap">Alternância (aria-pressed)</p>
            <GrupoBotoes label="Visualização">
              {[
                { id: "lista", nome: "Lista", icone: <Menu {...ic} /> },
                { id: "grade", nome: "Grade", icone: <LayoutGrid {...ic} /> },
                { id: "grafico", nome: "Gráfico", icone: <BarChart3 {...ic} /> },
              ].map((v) => (
                <Segmento key={v.id} icone={v.icone} aria-pressed={vista === v.id} onClick={() => setVista(v.id)}>{v.nome}</Segmento>
              ))}
            </GrupoBotoes>
          </div>

          <div>
            <p className="neu-cap">Vertical</p>
            <GrupoBotoes label="Ordenar" orientation="vertical">
              <Segmento icone={<TrendingUp {...ic} />}>Mais recentes</Segmento>
              <Segmento icone={<TrendingDown {...ic} />}>Mais antigos</Segmento>
              <Segmento icone={<Star {...ic} />}>Favoritos</Segmento>
            </GrupoBotoes>
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}
