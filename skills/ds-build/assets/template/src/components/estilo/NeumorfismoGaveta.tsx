import { useRef, useState } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import { Folha } from "./NeumorfismoFolha";
import { GrupoRadio, type OpcaoRadio } from "./NeumorfismoRadio";
import { Notificacao } from "./NeumorfismoToasts";

/**
 * Vitrine do Drawer no estilo Neumorfismo (componente Drawer do pacote Neumorphic UI v3.2.0): o painel que
 * desliza de uma borda, com alça de arrastar e dispensar arrastando. Usa o mesmo motor da Folha (Sheet) com o
 * modo gaveta: lado automático (à direita no desktop, de baixo abaixo de 640px), painel solto a 8px da borda
 * nas laterais, alça no topo da gaveta de baixo e o ✕ só nas laterais. Arrastar além de 30% do painel (no
 * máximo 120px) fecha; menos que isso volta, e o véu esmaece durante o arrasto. O exemplo é o do pacote:
 * escolher um horário de entrega com o RadioGroup em cartão (a opção escolhida afunda) e confirmar com um
 * Toast. Entra numa seção nova do neumorfismo ("Drawer", depois do Sheet) e só é usado quando
 * ESTILO.id === "neumorfismo". As classes neu-sheet* e neu-radio-card* vêm de src/styles/estilo.css.
 */

const HORARIOS: OpcaoRadio[] = [
  { value: "asap", label: "Entrega padrão", description: "25–35 min · Entregador designado agora", badge: "Mais rápida" },
  { value: "17-00", label: "17:00 – 17:15", description: "Preparo começa às 16:45" },
  { value: "17-30", label: "17:30 – 17:45", description: "Bom se você estiver voltando para casa" },
  { value: "18-00", label: "18:00 – 18:15", description: "Mais procurado · Alta demanda" },
  { value: "18-30", label: "18:30 – 18:45", description: "Último horário antes do fechamento" },
];

function Legenda({ children }: { children: string }) {
  return <p className="neu-cap" style={{ margin: "0 0 12px" }}>{children}</p>;
}

function Exemplo() {
  const [aberto, setAberto] = useState(false);
  const [valor, setValor] = useState("asap");
  const [aviso, setAviso] = useState<{ texto: string; k: number } | null>(null);
  const contador = useRef(0);
  const escolhido = HORARIOS.find((h) => h.value === valor)!;
  const seletor = <GrupoRadio rotulo="Horário de entrega" variante="card" opcoes={HORARIOS} valor={valor} aoMudar={setValor} />;
  function confirmar() {
    setAberto(false);
    contador.current += 1;
    setAviso({ texto: `Horário confirmado: ${escolhido.label}`, k: contador.current });
  }
  return (
    <div className="neu-stack" style={{ gap: 24 }}>
      <div>
        <Legenda>Gatilho — à direita no desktop, de baixo no celular (arraste para fechar)</Legenda>
        <Folha
          gaveta
          lado="auto"
          aberto={aberto}
          aoMudarAberto={setAberto}
          titulo="Escolha um horário de entrega"
          descricao="Vamos preparar seu pedido o quanto antes."
          gatilho={<Button type="button" variant="outline" className="neu-btn--convex"><Truck aria-hidden="true" size={18} /> Abrir drawer</Button>}
          rodape={
            <>
              <Button type="button" className="neu-btn--block" onClick={confirmar}>Confirmar horário</Button>
              <Button type="button" variant="outline" className="neu-btn--convex neu-btn--block" onClick={() => setAberto(false)}>Cancelar</Button>
            </>
          }
        >
          {seletor}
        </Folha>
      </div>
      <div style={{ maxWidth: 420 }}>
        <Legenda>Aparência no celular (estática)</Legenda>
        <Folha
          embutido
          gaveta
          lado="bottom"
          alturaPalco={400}
          titulo="Escolha um horário de entrega"
          descricao="Vamos preparar seu pedido o quanto antes."
          rodape={<Button type="button" className="neu-btn--block">Confirmar horário</Button>}
        >
          {seletor}
        </Folha>
      </div>
      {aviso && <Notificacao key={aviso.k} flutuante variante="simples" titulo={aviso.texto} duracao={5000} mostrarTimer aoFechar={() => setAviso(null)} />}
    </div>
  );
}

export default function NeumorfismoGaveta() {
  return (
    <ComponentPreview
      title="Drawer"
      description="Painel que desliza de uma borda, com alça de arrastar e dispensar arrastando. No desktop vem da direita; no celular, de baixo. Para listas de escolha, combine com o Radio em cartão e confirme com um Toast."
      whenToUse={["Escolher uma opção ou editar algo sem sair da página, principalmente no celular", "Listas de escolha com explicação (prazo, plano, endereço)"]}
      whenNotToUse={["Confirmar uma ação destrutiva: use o Alert Dialog", "Formulário longo com muitos campos: use o Sheet ou uma página"]}
      accessibility={["Mesmo contrato do Dialog: foco preso, Esc fecha, o foco volta ao gatilho e a rolagem da página trava", "Arrastar para dispensar é um atalho: Esc, Cancelar e o clique fora sempre fecham", "Na gaveta de baixo o ✕ some: a alça (decorativa), Esc, Cancelar e o clique fora fecham", "Sem movimento, não há animação de entrada nem de saída"]}
      code={`<Folha
  gaveta
  lado="auto"                  // right no desktop, bottom abaixo de 640px
  gatilho={<Button variant="outline" className="neu-btn--convex">Abrir drawer</Button>}
  titulo="Escolha um horário de entrega"
  descricao="Vamos preparar seu pedido o quanto antes."
  rodape={<Button className="neu-btn--block" onClick={confirmar}>Confirmar horário</Button>}
>
  <GrupoRadio rotulo="Horário de entrega" variante="card" opcoes={horarios} valor={valor} aoMudar={setValor} />
</Folha>`}
    >
      <Exemplo />
    </ComponentPreview>
  );
}
