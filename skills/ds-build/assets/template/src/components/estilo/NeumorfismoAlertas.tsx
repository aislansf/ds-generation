import { useState, type ReactNode } from "react";
import { Check, CircleAlert, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Alert no estilo Neumorfismo (componente Alert do pacote Neumorphic UI v3.2.0): um painel raso com
 * fio de luz, o ícone num quadrado de 36px que brilha na cor do tipo (sucesso na cor da marca, informação na
 * secundária no lugar do azul royal, atenção e erro nas cores semânticas), título e texto, e um ✕ afundado
 * opcional para fechar. Sucesso e informação são role="status"; atenção e erro, role="alert". Entra no cartão
 * "Alert" da ComponentesPage e só é usado quando ESTILO.id === "neumorfismo". As classes neu-alert* vêm de
 * src/styles/estilo.css.
 */

type Tipo = "success" | "info" | "warning" | "danger";

interface AvisoProps {
  tipo?: Tipo;
  titulo: string;
  children?: ReactNode;
  aoFechar?: () => void;
  /** Sem role próprio, para quando o aviso vai dentro de outro contêiner que já é a região viva (o Toast) */
  semPapel?: boolean;
}

const ICONE: Record<Tipo, ReactNode> = {
  success: <Check aria-hidden="true" size={18} strokeWidth={3} />,
  info: <CircleAlert aria-hidden="true" size={18} />,
  warning: <CircleAlert aria-hidden="true" size={18} />,
  danger: <CircleX aria-hidden="true" size={18} />,
};

export function Aviso({ tipo = "success", titulo, children, aoFechar, semPapel = false }: AvisoProps) {
  return (
    <div className="neu-alert" role={semPapel ? undefined : tipo === "danger" || tipo === "warning" ? "alert" : "status"}>
      <span className={`neu-alert__icon neu-alert__icon--${tipo}`}>{ICONE[tipo]}</span>
      <div className="neu-alert__body">
        <p className="neu-alert__title">{titulo}</p>
        {children && <p className="neu-alert__text">{children}</p>}
      </div>
      {aoFechar && (
        <button type="button" className="neu-alert__close" aria-label="Fechar" onClick={aoFechar}>
          <span aria-hidden="true">✕</span>
        </button>
      )}
    </div>
  );
}

function ExemploAvisos() {
  const [sucesso, setSucesso] = useState(true);
  const [erro, setErro] = useState(true);
  return (
    <div className="neu-stack" style={{ maxWidth: 520, gap: 16 }}>
      {sucesso && <Aviso tipo="success" titulo="Registro salvo com sucesso!" aoFechar={() => setSucesso(false)}>Os dados foram gravados na base.</Aviso>}
      <Aviso tipo="info" titulo="Sincronização agendada">Os indicadores serão atualizados às 18h.</Aviso>
      <Aviso tipo="warning" titulo="Atenção necessária">Verifique os dados e tente novamente.</Aviso>
      {erro && <Aviso tipo="danger" titulo="Erro na sincronização" aoFechar={() => setErro(false)}>Não foi possível conectar ao servidor.</Aviso>}
      {(!sucesso || !erro) && (
        <div>
          <Button type="button" variant="link" size="sm" onClick={() => { setSucesso(true); setErro(true); }}>Restaurar avisos</Button>
        </div>
      )}
    </div>
  );
}

export default function NeumorfismoAlertas() {
  return (
    <ComponentPreview
      title="Alert"
      description="Mensagens de feedback: sucesso, informação, atenção e erro. O ícone brilha na cor do tipo; avisos fechados pelo usuário trazem o ✕ afundado."
      whenToUse={["Feedback de ações (salvou, falhou)", "Alertas de sistema e avisos de atenção", "Informações contextuais que não bloqueiam o fluxo"]}
      whenNotToUse={["Confirmações que exigem decisão: use o modal", "Feedback passageiro que some sozinho: use o toast"]}
      accessibility={["Atenção e erro usam role=\"alert\" (anunciados na hora); sucesso e informação usam role=\"status\"", "Ícone mais título e texto: a cor nunca é o único sinal", "O ✕ é um botão com nome acessível \"Fechar\""]}
      code={`<Aviso tipo="success" titulo="Registro salvo com sucesso!" aoFechar={fechar}>
  Os dados foram gravados na base.
</Aviso>
<Aviso tipo="info" titulo="Sincronização agendada">Os indicadores serão atualizados às 18h.</Aviso>
<Aviso tipo="warning" titulo="Atenção necessária">Verifique os dados e tente novamente.</Aviso>
<Aviso tipo="danger" titulo="Erro na sincronização" aoFechar={fechar}>
  Não foi possível conectar ao servidor.
</Aviso>`}
    >
      <ExemploAvisos />
    </ComponentPreview>
  );
}
