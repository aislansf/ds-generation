import { useId, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { Progresso } from "@/components/estilo/NeumorfismoProgresso";

/**
 * Upload no estilo Neumorfismo (componente Upload do pacote Neumorphic UI v3.2.0): uma área de soltar escavada, com
 * borda tracejada que acende na cor da marca ao passar o ponteiro ou arrastar, e, abaixo, uma linha plana por arquivo
 * com o ícone de estado, o nome, a palavra do estado e uma barra fina de progresso. O estado nunca vai só na cor:
 * "Concluído", a porcentagem ("68%") e "Erro" acompanham o ícone e a barra. A área é um botão (Enter e Espaço abrem
 * o seletor de arquivos) e entrega os arquivos escolhidos ou soltos em `aoEscolher`; quem usa decide o que fazer
 * com eles (a lista `arquivos` é controlada de fora). A vitrine (default) é o cartão "Upload" da ComponentesPage e só
 * é usada quando ESTILO.id === "neumorfismo". As classes neu-drop* e neu-file* vêm de src/styles/estilo.css.
 */

export interface ArquivoEnviado {
  nome: string;
  estado?: "concluido" | "enviando" | "erro";
  /** 0 a 100; só vale enquanto enviando */
  progresso?: number;
}

export interface UploadProps {
  arquivos?: ArquivoEnviado[];
  /** Tipos aceitos e limites, sob o título da área */
  dica?: string;
  /** Tipos aceitos pelo seletor, como no atributo accept do input */
  aceita?: string;
  /** Recebe os arquivos escolhidos no seletor ou soltos na área */
  aoEscolher?: (arquivos: File[]) => void;
}

const ESTADOS = {
  concluido: { icone: "check-circle", tom: "success", palavra: "Concluído" },
  enviando: { icone: "upload-cloud", tom: "accent", palavra: "" },
  erro: { icone: "x-circle", tom: "danger", palavra: "Erro" },
} as const;

export function Upload({ arquivos = [], dica = "PDF, XLSX, JPG, PNG · Até 10MB por arquivo · Máximo 20 arquivos", aceita, aoEscolher }: UploadProps) {
  const uid = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [sobre, setSobre] = useState(false);

  const abrir = () => entrada.current?.click();
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  };
  const aoSoltar = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSobre(false);
    const lista = Array.from(e.dataTransfer?.files ?? []);
    if (lista.length) aoEscolher?.(lista);
  };
  const aoSelecionar = (e: ChangeEvent<HTMLInputElement>) => {
    const lista = Array.from(e.target.files ?? []);
    if (lista.length) aoEscolher?.(lista);
    e.target.value = "";
  };

  return (
    <div className="neu-upload">
      <div
        className="neu-drop"
        data-over={sobre}
        role="button"
        tabIndex={0}
        aria-describedby={`${uid}-dica`}
        onClick={abrir}
        onKeyDown={aoTeclar}
        onDragOver={(e) => {
          e.preventDefault();
          setSobre(true);
        }}
        onDragLeave={() => setSobre(false)}
        onDrop={aoSoltar}
      >
        <div className="neu-drop__icon">
          <Icone name="upload-cloud" size={28} />
        </div>
        <p className="neu-drop__title">
          Arraste arquivos aqui ou <span>selecione do computador</span>
        </p>
        <p className="neu-drop__hint" id={`${uid}-dica`}>{dica}</p>
        <input ref={entrada} type="file" multiple accept={aceita} className="sr-only" tabIndex={-1} aria-hidden="true" onClick={(e) => e.stopPropagation()} onChange={aoSelecionar} />
      </div>
      {arquivos.map((a) => {
        const e = ESTADOS[a.estado ?? "concluido"];
        const pct = a.estado === "enviando" ? Math.round(a.progresso ?? 0) : 100;
        const palavra = a.estado === "enviando" ? `${pct}%` : e.palavra;
        return (
          <div key={a.nome} className="neu-file">
            <span className={`neu-file__icon neu-tone-${e.tom}`}>
              <Icone name={e.icone} size={20} />
            </span>
            <div className="neu-file__main">
              <div className="neu-file__row">
                <span className="neu-file__name">{a.nome}</span>
                <span className={`neu-file__status neu-tone-${e.tom}`}>{palavra}</span>
              </div>
              <Progresso fino valor={pct} tom={e.tom} rotulo={`${a.nome}: ${palavra}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const EXEMPLO: ArquivoEnviado[] = [
  { nome: "relatorio_prestacao_contas_2026.pdf", estado: "concluido" },
  { nome: "planilha_atendimentos.xlsx", estado: "enviando", progresso: 68 },
  { nome: "anexo_corrompido.csv", estado: "erro" },
];

export default function NeumorfismoUpload() {
  return (
    <ComponentPreview
      title="Upload"
      description="Área de soltar escavada e, abaixo, uma linha por arquivo com ícone, nome, estado e barra de progresso. O estado sempre vai em palavra, não só em cor."
      whenToUse={["Envio de documentos comprobatórios", "Importação de planilhas", "Anexos que precisam mostrar o andamento e os erros de cada arquivo"]}
      whenNotToUse={["Arquivo único simples (use um input de arquivo)", "Dados que cabem em campos de texto"]}
      accessibility={[
        "A área de soltar é um botão focável: Enter e Espaço abrem o seletor de arquivos",
        "Os tipos aceitos e os limites ficam em texto e ligados à área por aria-describedby",
        "Cada barra é um progressbar com o nome do arquivo e o estado",
        "O estado vai sempre em palavra (\"Concluído\", \"68%\", \"Erro\") junto do ícone e da cor",
      ]}
      code={`<Upload
  dica="PDF, XLSX, JPG, PNG · Até 10MB por arquivo · Máximo 20 arquivos"
  aoEscolher={(arquivos) => enviar(arquivos)}
  arquivos={[
    { nome: "relatorio_prestacao_contas_2026.pdf", estado: "concluido" },
    { nome: "planilha_atendimentos.xlsx", estado: "enviando", progresso: 68 },
    { nome: "anexo_corrompido.csv", estado: "erro" },
  ]}
/>`}
    >
      <div style={{ maxWidth: 560 }}>
        <Upload arquivos={EXEMPLO} />
      </div>
    </ComponentPreview>
  );
}
