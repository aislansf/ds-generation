import { useId, useState } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * Vitrine do Radio no estilo Neumorfismo (componente RadioGroup do pacote Neumorphic UI v3.2.0): bolinhas de 24px
 * escavadas para escolha única; a escolhida sobe convexa com o núcleo de 10px na cor da marca e brilho. A variante
 * "card" põe cada opção num cartão convexo, com o radio à direita; o escolhido afunda e ganha a borda da marca.
 * Montada com o RadioGroup do DS (Radix, com setas e foco por rolagem). Só é usada quando ESTILO.id === "neumorfismo"
 * (ComponentesPage); as classes neu-check*, neu-radio-card* e o relevo vêm de src/styles/estilo.css.
 */

export interface OpcaoRadio {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  badge?: string;
}

interface GrupoRadioProps {
  rotulo: string;
  opcoes: OpcaoRadio[];
  valorInicial?: string;
  /** Valor controlado de fora (a gaveta de horários guarda a escolha para confirmar depois) */
  valor?: string;
  aoMudar?: (valor: string) => void;
  variante?: "padrao" | "card";
}

export function GrupoRadio({ rotulo, opcoes, valorInicial = "", valor: valorControlado, aoMudar, variante = "padrao" }: GrupoRadioProps) {
  const uid = useId();
  const [interno, setInterno] = useState(valorInicial);
  const valor = valorControlado ?? interno;
  const setValor = (v: string) => {
    setInterno(v);
    aoMudar?.(v);
  };
  const card = variante === "card";
  return (
    <RadioGroup aria-label={rotulo} value={valor} onValueChange={setValor} className={card ? "neu-radio-cards" : "neu-radio-lista"}>
      {opcoes.map((o) => {
        const id = `${uid}-${o.value}`;
        const ligado = valor === o.value;
        return (
          <div key={o.value} className={["neu-check", card ? "neu-radio-card" : "", card && ligado ? "neu-radio-card--on" : ""].filter(Boolean).join(" ")} aria-disabled={o.disabled ? true : undefined}>
            <RadioGroupItem id={id} value={o.value} disabled={o.disabled} aria-describedby={o.description ? `${id}-desc` : undefined} />
            <label htmlFor={id} className={["neu-check__texto", card ? "neu-radio-card__text" : ""].filter(Boolean).join(" ")}>
              <span className="neu-check__title">
                {o.label}
                {o.badge && <Badge variant="secondary" className="neu-radio-card__badge">{o.badge}</Badge>}
              </span>
              {o.description && <span className="neu-check__desc" id={`${id}-desc`}>{o.description}</span>}
            </label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

export default function NeumorfismoRadio() {
  return (
    <ComponentPreview
      title="Radio — variantes do pacote"
      description="Bolinhas escavadas para a escolha de uma opção entre várias. A escolhida sobe convexa e acende o núcleo na cor da marca; a variante em cartão serve para escolhas maiores, como um prazo de entrega."
      whenToUse={["Escolha única entre 3 ou mais opções, com título e descrição", "Cartão: opções que precisam de explicação e selo (prazo, plano)", "2 a 4 opções curtas na mesma linha: prefira o controle segmentado"]}
      whenNotToUse={["Seleção múltipla: use o checkbox", "Ações imediatas: use o switch"]}
      accessibility={["O grupo tem role=\"radiogroup\" e nome; só a opção marcada é parada do Tab", "As quatro setas movem a escolha e pulam as desabilitadas; Espaço seleciona", "O rótulo inteiro é clicável e ligado ao radio (htmlFor/id)", "Desabilitada: opaca e sem foco"]}
      code={`<GrupoRadio rotulo="Plano" valorInicial="mensal" opcoes={[
  { value: "mensal", label: "Radio Selecionado" },
  { value: "anual", label: "Radio Disponível" },
  { value: "off", label: "Radio Desabilitado", disabled: true },
]} />`}
    >
      <div className="neu-stack" style={{ gap: 32 }}>
        <div>
          <p className="neu-cap">Padrão</p>
          <GrupoRadio
            rotulo="Plano"
            valorInicial="mensal"
            opcoes={[
              { value: "mensal", label: "Radio Selecionado", description: "Núcleo da cor da marca extrudado no poço côncavo" },
              { value: "anual", label: "Radio Disponível", description: "Poço circular rebaixado" },
              { value: "off", label: "Radio Desabilitado", description: "Sem interação", disabled: true },
            ]}
          />
        </div>
        <div style={{ maxWidth: 420 }}>
          <p className="neu-cap">Variante em cartão</p>
          <GrupoRadio
            variante="card"
            rotulo="Prazo de entrega"
            valorInicial="padrao"
            opcoes={[
              { value: "padrao", label: "Entrega padrão", description: "De 3 a 5 dias úteis", badge: "Grátis" },
              { value: "expressa", label: "Entrega expressa", description: "Em até 24 horas" },
              { value: "retirada", label: "Retirada na unidade", description: "Indisponível neste endereço", disabled: true },
            ]}
          />
        </div>
      </div>
    </ComponentPreview>
  );
}
