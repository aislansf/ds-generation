import { Bell, Download, MoreVertical, Pencil, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Botão só de ícone no estilo Neumorfismo (componente IconButton do pacote Neumorphic UI v3.2.0):
 * a tecla de 44px (36px no tamanho pequeno) com só um ícone, em primário, secundário convexo, contorno com ícone
 * e borda na cor da marca, destrutivo, redondo, pequeno e desabilitado. Montada com o Button do DS; as classes
 * neu-ib* vêm de src/styles/estilo.css. Só é usada quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */
export default function NeumorfismoBotaoIcone() {
  return (
    <ComponentPreview
      title="Botão somente ícone — variantes do pacote"
      description="Uma tecla de 44px só com o ícone, para barras de ferramentas, linhas de tabela e cabeçalhos. Mantenha 8px ou mais entre vizinhas, para as sombras não se misturarem."
      whenToUse={["Ações conhecidas em interfaces densas (baixar, editar, excluir)", "Tamanho pequeno (36px) em menus de linha e paginação", "Redondo ao lado de avatares e notificações"]}
      whenNotToUse={["Ação que precisa de explicação: use botão com texto", "Sem nome acessível: todo botão só de ícone leva aria-label"]}
      accessibility={["aria-label obrigatório (vira também o tooltip nativo)", "Ícone decorativo com aria-hidden", "Desabilitado afunda na superfície; foco em anel sólido de 2px"]}
      code={`<Button size="icon" aria-label="Download"><Download size={18} /></Button>
<Button size="icon" variant="destructive" aria-label="Excluir"><Trash2 size={18} /></Button>`}
    >
      <div className="neu-row">
        <Button size="icon" className="neu-ib" aria-label="Download" title="Download">
          <Download aria-hidden="true" size={18} />
        </Button>
        <Button size="icon" variant="outline" className="neu-ib neu-btn--convex" aria-label="Editar" title="Editar">
          <Pencil aria-hidden="true" size={18} />
        </Button>
        <Button size="icon" variant="outline" className="neu-ib neu-ib--contorno" aria-label="Editar (outline)" title="Editar (outline)">
          <Pencil aria-hidden="true" size={18} />
        </Button>
        <Button size="icon" variant="destructive" className="neu-ib" aria-label="Excluir" title="Excluir">
          <Trash2 aria-hidden="true" size={18} />
        </Button>
        <Button size="icon" variant="outline" className="neu-ib neu-ib--redondo neu-btn--convex" aria-label="Notificações" title="Notificações">
          <Bell aria-hidden="true" size={18} />
        </Button>
        <Button size="icon" variant="outline" className="neu-ib neu-ib--pequeno neu-btn--convex" aria-label="Mais opções" title="Mais opções">
          <MoreVertical aria-hidden="true" size={18} />
        </Button>
        <Button size="icon" variant="outline" className="neu-ib neu-btn--convex" aria-label="Parâmetros" title="Parâmetros" disabled>
          <Settings aria-hidden="true" size={18} />
        </Button>
      </div>
    </ComponentPreview>
  );
}
