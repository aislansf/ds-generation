import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Popover no estilo Neumorfismo (componente Popover do pacote Neumorphic UI v3.2.0): um painel
 * flutuante não modal, preso a um gatilho, para formulários pequenos e ações rápidas. É uma laje rasa com fio de
 * luz, 10px abaixo do gatilho (ou acima, com lado="top"), alinhada ao início, ao centro ou ao fim, com 320px de
 * largura por padrão. Montado com o Popover do DS (Radix): o gatilho ganha aria-haspopup, aria-expanded e
 * aria-controls; abrir leva o foco ao primeiro campo; Esc fecha e devolve o foco ao gatilho; clicar fora ou
 * tabular para fora do painel também fecha; ao contrário do Dialog, não prende o foco nem trava a página; e o
 * painel se desloca para ficar dentro da janela. Entra numa seção nova do neumorfismo ("Popover", depois do
 * Drawer) e só é usado quando ESTILO.id === "neumorfismo". O relevo, o título, o texto e a linha de formulário
 * (rótulo de 96px + campo) vêm de src/styles/estilo.css ([data-ds="popover"], neu-popover* e neu-form-row).
 */

interface PainelProps {
  /** Elemento que abre o painel (em geral um Button) */
  gatilho: ReactNode;
  /** Nome acessível do painel */
  rotulo: string;
  alinhamento?: "start" | "center" | "end";
  lado?: "bottom" | "top";
  largura?: number;
  /** Falso mantém o foco no gatilho ao abrir */
  focoAutomatico?: boolean;
  children: ReactNode;
}

export function PainelFlutuante({ gatilho, rotulo, alinhamento = "center", lado = "bottom", largura = 320, focoAutomatico = true, children }: PainelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{gatilho}</PopoverTrigger>
      <PopoverContent
        side={lado}
        align={alinhamento}
        sideOffset={10}
        collisionPadding={8}
        aria-label={rotulo}
        className="neu-popover__panel"
        style={{ width: largura }}
        onOpenAutoFocus={focoAutomatico ? undefined : (e) => e.preventDefault()}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

const CAMPOS: { chave: "w" | "mw" | "hh" | "mh"; rotulo: string }[] = [
  { chave: "w", rotulo: "Largura" },
  { chave: "mw", rotulo: "Larg. máx." },
  { chave: "hh", rotulo: "Altura" },
  { chave: "mh", rotulo: "Alt. máx." },
];

function LinhaCampo({ id, rotulo, valor, aoMudar }: { id: string; rotulo: string; valor: string; aoMudar: (v: string) => void }) {
  return (
    <div className="neu-form-row">
      <label className="neu-label" htmlFor={id}>{rotulo}</label>
      <div className="neu-input--sm">
        <div className="neu-field">
          <input id={id} value={valor} onChange={(e) => aoMudar(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function ExemploDimensoes() {
  const uid = useId();
  const [v, setV] = useState({ w: "100%", mw: "300px", hh: "25px", mh: "none" });
  return (
    <div>
      <Legenda>Exemplo de referência</Legenda>
      <PainelFlutuante alinhamento="start" largura={320} rotulo="Dimensões" gatilho={<Button type="button" variant="outline">Abrir popover</Button>}>
        <div className="neu-stack" style={{ gap: 16 }}>
          <div>
            <h4 className="neu-popover__title">Dimensões</h4>
            <p className="neu-popover__text">Defina as dimensões da camada.</p>
          </div>
          <div className="neu-stack" style={{ gap: 8 }}>
            {CAMPOS.map((c) => (
              <LinhaCampo key={c.chave} id={`${uid}-${c.chave}`} rotulo={c.rotulo} valor={v[c.chave]} aoMudar={(x) => setV({ ...v, [c.chave]: x })} />
            ))}
          </div>
        </div>
      </PainelFlutuante>
      <p className="neu-help" aria-live="polite">Valores: {v.w} · {v.mw} · {v.hh} · {v.mh}</p>
    </div>
  );
}

const LINK = "sua-marca.app/r/8f2k";

function ExemploCompartilhar() {
  const uid = useId();
  const [copiado, setCopiado] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copiar() {
    try {
      await navigator.clipboard?.writeText(LINK);
    } catch {
      /* sem permissão de área de transferência: o aviso aparece do mesmo jeito */
    }
    setCopiado(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiado(false), 2000);
  }
  return (
    <div>
      <Legenda>Ação rápida</Legenda>
      <PainelFlutuante
        alinhamento="end"
        largura={280}
        rotulo="Compartilhar"
        gatilho={<Button type="button" size="icon" variant="outline" className="neu-ib neu-btn--convex" aria-label="Compartilhar"><Share2 aria-hidden="true" size={18} /></Button>}
      >
        <div className="neu-stack" style={{ gap: 12 }}>
          <h4 className="neu-popover__title">Compartilhar relatório</h4>
          <div className="neu-input--sm">
            <div className="neu-field">
              <span className="neu-field__icon" aria-hidden="true"><ExternalLink size={15} /></span>
              <input id={`${uid}-link`} aria-label="Link do relatório" readOnly defaultValue={LINK} />
            </div>
          </div>
          <Button type="button" size="sm" onClick={copiar}><Copy aria-hidden="true" size={16} /> {copiado ? "Link copiado!" : "Copiar link"}</Button>
          <span className="sr-only" role="status">{copiado ? "Link copiado" : ""}</span>
        </div>
      </PainelFlutuante>
    </div>
  );
}

export default function NeumorfismoPopovers() {
  return (
    <ComponentPreview
      title="Popover"
      description="Painel flutuante não modal preso a um gatilho, para formulários pequenos e ações rápidas. Abre abaixo do gatilho, alinhado ao início, ao centro ou ao fim, e se desloca para caber na janela."
      whenToUse={["Formulários pequenos e ajustes rápidos junto de um controle", "Ações rápidas de um ícone (compartilhar, copiar)"]}
      whenNotToUse={["Conteúdo que exige atenção total ou uma decisão: use o Dialog ou o Alert Dialog", "Uma dica curta: use o Tooltip"]}
      accessibility={["O gatilho anuncia aria-haspopup=\"dialog\", aria-expanded e aria-controls; o painel é um dialog com nome acessível", "Abrir leva o foco ao primeiro campo; Esc fecha e devolve o foco ao gatilho; clicar fora ou tabular para fora também fecha", "Ao contrário do Dialog, não prende o foco nem trava a rolagem da página", "Botão só de ícone leva aria-label"]}
      code={`<PainelFlutuante
  alinhamento="start"          // start | center | end
  largura={320}
  rotulo="Dimensões"
  gatilho={<Button variant="outline">Abrir popover</Button>}
>
  <h4 className="neu-popover__title">Dimensões</h4>
  <p className="neu-popover__text">Defina as dimensões da camada.</p>
  <div className="neu-form-row">
    <label className="neu-label" htmlFor="largura">Largura</label>
    <div className="neu-input--sm"><div className="neu-field"><input id="largura" /></div></div>
  </div>
</PainelFlutuante>`}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
        <ExemploDimensoes />
        <ExemploCompartilhar />
      </div>
    </ComponentPreview>
  );
}
