import { useId } from "react";
import { Switch } from "@/components/ui/switch";

/**
 * Vitrine do Switch no estilo Neumorfismo (componente Switch do pacote Neumorphic UI v3.2.0): trilha de 64×32
 * escavada com botão convexo de 24px que desliza 32px; ligada, a trilha enche com a barra de acento da marca e
 * brilha. O tom secundário usa a segunda cor da marca. Montado com o Switch do DS (Radix); o relevo vem de
 * src/styles/estilo.css. Cartões de estado da seção "Switches & Toggles" do code.html do anexo. Só é usado quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */

interface OpcaoSwitchProps {
  rotulo: string;
  tom?: "marca" | "secundaria";
  desabilitado?: boolean;
  ligadoInicial?: boolean;
}

export function OpcaoSwitch({ rotulo, tom = "marca", desabilitado = false, ligadoInicial = false }: OpcaoSwitchProps) {
  const id = useId();
  return (
    <div className="neu-row neu-switch-linha">
      <Switch id={id} className={tom === "secundaria" ? "neu-switch--secundaria" : undefined} defaultChecked={ligadoInicial} disabled={desabilitado} />
      <label htmlFor={id} className="neu-switch-rotulo">{rotulo}</label>
    </div>
  );
}

interface CartaoProps {
  titulo: string;
  etiqueta: string;
  tomEtiqueta: "marca" | "secundaria" | "neutro";
  rotulo: string;
  tom?: "marca" | "secundaria";
  ligadoInicial?: boolean;
  desabilitado?: boolean;
}

/** Cartão de estado do exemplo: título e etiqueta no alto; embaixo, o interruptor à esquerda e o rótulo à direita. */
function CartaoSwitch({ titulo, etiqueta, tomEtiqueta, ...opcao }: CartaoProps) {
  return (
    <div className="neu-sw-card">
      <div className="neu-sw-card__topo">
        <span className="neu-sw-card__titulo">{titulo}</span>
        <span className={`neu-sw-card__etiqueta neu-sw-card__etiqueta--${tomEtiqueta}`}>{etiqueta}</span>
      </div>
      <OpcaoSwitch {...opcao} />
    </div>
  );
}

/** Os três cartões de estado do exemplo; ficam dentro do cartão "Switch" da vitrine, que já traz o código, o "Quando usar" e a acessibilidade. */
export default function NeumorfismoSwitch() {
  return (
    <div className="neu-sw-grid">
      <CartaoSwitch titulo="Ligado (cor da marca)" etiqueta="ON" tomEtiqueta="marca" rotulo="Notificações Push" ligadoInicial />
      <CartaoSwitch titulo="Ligado (cor secundária)" etiqueta="ON" tomEtiqueta="secundaria" rotulo="Modo Alto Desempenho" tom="secundaria" ligadoInicial />
      <CartaoSwitch titulo="Desligado (Off-White)" etiqueta="OFF" tomEtiqueta="neutro" rotulo="Sincronização 4G" />
    </div>
  );
}
