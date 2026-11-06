import { useEffect, useId, useRef, useState } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Slider } from "@/components/ui/slider";

/**
 * Vitrine do Slider no estilo Neumorfismo, seguindo a seção "Sliders horizontais" do code.html anexo: um cartão
 * plano com três sliders. Calha escavada (8px, ou 10px quando tem preenchimento), a barra de acento da marca
 * encaixada nela (o brilho fica contido na calha, como no exemplo) e um botão convexo de 24px com borda branca e
 * shadow-md. Montado com o Slider do DS (Radix, com setas, Home, End e PageUp/PageDown); o relevo vem de
 * src/styles/estilo.css. Só é usado quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */

interface BarraSliderProps {
  /** Nome acessível (o exemplo não tem rótulo visível) */
  nome: string;
  valorInicial: number;
  /** Calha fina e sem preenchimento, como o primeiro slider do exemplo */
  vazia?: boolean;
}

export function BarraSlider({ nome, valorInicial, vazia = false }: BarraSliderProps) {
  const id = useId();
  const [valor, setValor] = useState(valorInicial);
  const raiz = useRef<HTMLDivElement>(null);
  // O ui/slider (Radix) não repassa aria-label ao botão (role="slider"); o nome e o valor em texto vão direto nele
  useEffect(() => {
    const botao = raiz.current?.querySelector("[role=slider]");
    botao?.setAttribute("aria-label", nome);
    botao?.setAttribute("aria-valuetext", `${valor}%`);
  }, [nome, valor]);
  return (
    <div className={vazia ? "neu-slider neu-slider--vazia" : "neu-slider"} ref={raiz}>
      <Slider id={id} min={0} max={100} step={1} value={[valor]} onValueChange={(v) => setValor(v[0])} />
    </div>
  );
}

export default function NeumorfismoSlider() {
  return (
    <ComponentPreview
      title="Slider"
      description="Uma calha escavada na superfície, com a barra de acento da marca encaixada nela e um botão convexo. Sem rótulo visível: o nome fica no botão, para leitores de tela."
      whenToUse={["Escolher um valor numa faixa contínua (volume, brilho, temperatura)", "Ajustes em que o resultado imediato importa mais que o número exato"]}
      whenNotToUse={["Valores que precisam ser digitados com precisão: use o campo de texto", "Poucas opções fixas: use o controle segmentado ou o radio"]}
      accessibility={["Nome acessível no botão (aria-label) e valor lido em texto (aria-valuetext)", "Setas movem de 1 em 1; Home e End vão às pontas; PageUp e PageDown dão passos maiores", "Foco: anel sólido de 2px em volta do botão"]}
      code={`<BarraSlider nome="Intensidade" valorInicial={6} vazia />
<BarraSlider nome="Volume" valorInicial={32} />
<BarraSlider nome="Brilho" valorInicial={50} />`}
    >
      <div className="neu-slider-card">
        <BarraSlider nome="Intensidade" valorInicial={6} vazia />
        <BarraSlider nome="Volume" valorInicial={32} />
        <BarraSlider nome="Brilho" valorInicial={50} />
      </div>
    </ComponentPreview>
  );
}
