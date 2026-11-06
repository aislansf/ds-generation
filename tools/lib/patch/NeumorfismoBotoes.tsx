import { ArrowRight, Download, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Botão no estilo Neumorfismo (exemplo do pacote Neumorphic UI v3.2.0): as doze peças do
 * components/Button/preview.html, montadas com o Button do DS. A cor da marca faz o papel da laranja (primário,
 * carregando, ícone à direita), a secundária o do azul royal, e o limão da marca o do "citron". As classes
 * neu-btn--* e o selo/LED vêm de src/styles/estilo.css. Só é usada quando ESTILO.id === "neumorfismo".
 */
export default function NeumorfismoBotoes() {
  return (
    <ComponentPreview
      title="Botão — variantes do pacote"
      description="A tecla tátil: peça convexa que afunda ao ser pressionada. A cor da marca fica só na ação principal da tela."
      whenToUse={["Primário: uma ação principal por tela (\"Novo atendimento\", \"Salvar\")", "Secundário e contorno: ações de apoio, ao lado do primário", "Destrutivo: convexo com texto de perigo; enche de vermelho ao passar o mouse"]}
      whenNotToUse={["Dois primários lado a lado", "Diversificado (cor de destaque) em ações de rotina: é celebratório e raro"]}
      accessibility={["Rótulos em verbo, com a primeira letra maiúscula", "Foco: anel sólido de 2px com 3px de folga", "Carregando: aria-busy e desabilitado; desabilitado afunda na superfície"]}
      code={`<Button>Novo atendimento</Button>
<Button variant="secondary">Botão</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive"><Trash2 size={16} /> Destrutivo</Button>
<Button variant="diversificado" size="lg">Citron <span className="neu-btn__badge">PRO</span></Button>`}
    >
      <div className="neu-stack">
        <div className="neu-row">
          <Button>Novo Atendimento</Button>
          <Button variant="secondary">Botão</Button>
          <Button variant="outline" className="neu-btn--convex">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost" className="neu-btn--soft">Suave Tinted</Button>
          <Button variant="destructive">
            <Trash2 aria-hidden="true" size={16} /> Destrutivo Soft
          </Button>
        </div>
        <div className="neu-row">
          <Button disabled aria-busy="true">
            <Loader2 aria-hidden="true" size={16} className="animate-spin" /> Carregando...
          </Button>
          <Button variant="outline" className="neu-btn--convex">
            <Download aria-hidden="true" size={16} /> Download
          </Button>
          <Button>
            Próximo <ArrowRight aria-hidden="true" size={16} />
          </Button>
          <Button variant="outline" size="lg" className="neu-btn--convex neu-btn--pill">
            <span aria-hidden="true" className="neu-dot neu-dot--accent" />
            Diversificado Padrão
            <span className="neu-btn__badge">Novo</span>
          </Button>
          <Button variant="diversificado" size="lg">
            Citron Neon Glow <span className="neu-btn__badge">PRO</span>
          </Button>
          <Button disabled>Botão</Button>
        </div>
      </div>
    </ComponentPreview>
  );
}
