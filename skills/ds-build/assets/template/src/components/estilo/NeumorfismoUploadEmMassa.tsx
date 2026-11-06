import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { ComponentPreview } from "@/components/DSComponents";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { Progresso } from "@/components/estilo/NeumorfismoProgresso";

/**
 * Upload em massa no estilo Neumorfismo (componente BulkUpload do pacote Neumorphic UI v3.2.0): a área de soltar
 * escavada, com a tecla convexa da nuvem que sobe e acende na cor da marca enquanto se arrasta arquivos por cima, uma
 * linha-resumo ("1 de 4 concluídos · 2 enviando · 1 erro", com "Limpar concluídos") e uma linha elevada por arquivo,
 * cada uma com poço de estado, nome, tamanho em fonte de código, palavra do estado, trilho fino de progresso e o ✕ de
 * remover (que também cancela o envio).
 *  - Escolher ou soltar: clique, Enter ou Espaço na área abre o seletor (`multiple`); soltar funciona na área toda.
 *  - Limites: `aceita` (extensões), `tamanhoMax` (MB) e `maxArquivos`. Arquivo de tipo não aceito ou grande demais entra
 *    como erro, com o motivo ("Tipo não aceito", "Excede 10MB"); no limite de arquivos a área desativa e avisa.
 *  - Envio: com `aoEnviar(arquivo, { progresso, concluir, falhar })` quem usa conduz o andamento; sem ele o envio é
 *    simulado, útil em protótipos. `arquivosIniciais` preenche a lista e não é simulado; `aoMudar` relata cada mudança.
 *  - Acessibilidade: a área é um botão descrito pela dica; cada trilho é um progressbar "Envio de ‹arquivo›"; uma
 *    região aria-live educada anuncia arquivos adicionados, concluídos e removidos. O estado vai sempre em palavra.
 * A vitrine (default) é o cartão "Upload em Massa com Progresso" da ComponentesPage e só é usada quando
 * ESTILO.id === "neumorfismo". As classes neu-bulk* vêm de src/styles/estilo.css.
 */

export type EstadoEnvio = "concluido" | "enviando" | "erro";

export interface ArquivoEmMassa {
  id: string;
  nome: string;
  tamanho?: string;
  estado: EstadoEnvio;
  /** 0 a 100 */
  progresso: number;
  erro?: string | null;
}

export interface ArquivoInicial {
  nome: string;
  tamanho?: string;
  estado: EstadoEnvio;
  progresso?: number;
  erro?: string;
}

export interface ControleEnvio {
  progresso: (valor: number) => void;
  concluir: () => void;
  falhar: (motivo?: string) => void;
}

export interface UploadEmMassaProps {
  arquivosIniciais?: ArquivoInicial[];
  /** Extensões aceitas, com ponto */
  aceita?: string[];
  /** Em MB */
  tamanhoMax?: number;
  maxArquivos?: number;
  /** Texto sob o título da área; por padrão, montado a partir dos limites */
  dica?: string;
  /** Nome acessível da área */
  rotulo?: string;
  aoEnviar?: (arquivo: File, controle: ControleEnvio) => void;
  aoMudar?: (arquivos: ArquivoEmMassa[]) => void;
}

const ESTADOS = {
  concluido: { icone: "check-circle", tom: "success", palavra: "Concluído" },
  enviando: { icone: "file", tom: "neutral", palavra: "" },
  erro: { icone: "x-circle", tom: "danger", palavra: "Erro" },
} as const;

const PADRAO_ACEITA = [".pdf", ".xlsx", ".jpg", ".png"];

export function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1).replace(".", ",")} MB`;
}

let sequencia = 0;
const base = Date.now().toString(36);
const novoId = () => `ue${base}-${++sequencia}`;

export function UploadEmMassa({ arquivosIniciais = [], aceita = PADRAO_ACEITA, tamanhoMax = 10, maxArquivos = 20, dica, rotulo, aoEnviar, aoMudar }: UploadEmMassaProps) {
  const uid = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const temporizadores = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const profundidade = useRef(0);
  const [arquivos, setArquivos] = useState<ArquivoEmMassa[]>(() =>
    arquivosIniciais.map((f) => ({ id: novoId(), nome: f.nome, tamanho: f.tamanho, estado: f.estado, progresso: f.progresso ?? (f.estado === "enviando" ? 0 : 100), erro: f.erro })),
  );
  const [arrastando, setArrastando] = useState(false);
  const [aviso, setAviso] = useState("");

  const avisarMudanca = useRef(aoMudar);
  avisarMudanca.current = aoMudar;
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    avisarMudanca.current?.(arquivos);
  }, [arquivos]);

  useEffect(() => {
    const t = temporizadores.current;
    return () => Object.values(t).forEach(clearInterval);
  }, []);

  const alterar = (id: string, mudanca: Partial<ArquivoEmMassa>) => setArquivos((lista) => lista.map((f) => (f.id === id ? { ...f, ...mudanca } : f)));

  const simular = (id: string, nome: string) => {
    let pr = 0;
    temporizadores.current[id] = setInterval(() => {
      pr = Math.min(100, pr + 8 + Math.random() * 18);
      if (pr >= 100) {
        clearInterval(temporizadores.current[id]);
        delete temporizadores.current[id];
        alterar(id, { progresso: 100, estado: "concluido" });
        setAviso(`${nome} enviado.`);
      } else {
        alterar(id, { progresso: pr });
      }
    }, 300);
  };

  const adicionar = (lista: FileList | File[] | null | undefined) => {
    const recebidos = Array.from(lista ?? []);
    if (!recebidos.length) return;
    const vaga = maxArquivos - arquivos.length;
    const novos: { item: ArquivoEmMassa; arquivo: File }[] = [];
    let ignorados = 0;
    recebidos.forEach((arquivo, i) => {
      if (i >= vaga) {
        ignorados++;
        return;
      }
      const ext = `.${arquivo.name.split(".").pop()?.toLowerCase()}`;
      const erro = aceita.length && !aceita.includes(ext) ? "Tipo não aceito" : arquivo.size > tamanhoMax * 1048576 ? `Excede ${tamanhoMax}MB` : null;
      novos.push({ item: { id: novoId(), nome: arquivo.name, tamanho: formatarTamanho(arquivo.size), estado: erro ? "erro" : "enviando", progresso: erro ? 100 : 0, erro }, arquivo });
    });
    setArquivos((atual) => [...atual, ...novos.map((n) => n.item)]);
    novos.forEach(({ item, arquivo }) => {
      if (item.estado !== "enviando") return;
      if (aoEnviar) {
        aoEnviar(arquivo, {
          progresso: (valor) => alterar(item.id, { progresso: valor }),
          concluir: () => {
            alterar(item.id, { progresso: 100, estado: "concluido" });
            setAviso(`${item.nome} enviado.`);
          },
          falhar: (motivo) => alterar(item.id, { progresso: 100, estado: "erro", erro: motivo ?? null }),
        });
      } else {
        simular(item.id, item.nome);
      }
    });
    setAviso(`${novos.length} ${novos.length === 1 ? "arquivo adicionado" : "arquivos adicionados"}${ignorados ? `; ${ignorados} ignorado(s): limite de ${maxArquivos} arquivos.` : "."}`);
  };

  const remover = (f: ArquivoEmMassa) => {
    if (temporizadores.current[f.id]) {
      clearInterval(temporizadores.current[f.id]);
      delete temporizadores.current[f.id];
    }
    setArquivos((lista) => lista.filter((x) => x.id !== f.id));
    setAviso(`${f.nome} removido.`);
  };

  const limparConcluidos = () => setArquivos((lista) => lista.filter((f) => f.estado !== "concluido"));

  const nConcluidos = arquivos.filter((f) => f.estado === "concluido").length;
  const nErros = arquivos.filter((f) => f.estado === "erro").length;
  const nEnviando = arquivos.length - nConcluidos - nErros;
  const cheio = arquivos.length >= maxArquivos;

  const abrir = () => {
    if (!cheio) entrada.current?.click();
  };
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  };
  const aoSoltar = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    profundidade.current = 0;
    setArrastando(false);
    if (!cheio) adicionar(e.dataTransfer?.files);
  };
  const aoSelecionar = (e: ChangeEvent<HTMLInputElement>) => {
    adicionar(e.target.files);
    e.target.value = "";
  };

  const textoDica = dica ?? `${aceita.map((a) => a.slice(1).toUpperCase()).join(", ")} · Até ${tamanhoMax}MB por arquivo · Máximo ${maxArquivos} arquivos`;

  return (
    <div className="neu-bulk">
      <div
        className="neu-bulk__drop"
        data-dragging={arrastando}
        aria-disabled={cheio || undefined}
        role="button"
        tabIndex={0}
        aria-label={rotulo ?? "Arraste arquivos ou clique para selecionar"}
        aria-describedby={`${uid}-dica`}
        onClick={abrir}
        onKeyDown={aoTeclar}
        onDragEnter={(e) => {
          e.preventDefault();
          profundidade.current++;
          setArrastando(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          profundidade.current = Math.max(0, profundidade.current - 1);
          if (!profundidade.current) setArrastando(false);
        }}
        onDrop={aoSoltar}
      >
        <span className="neu-bulk__icon">
          <Icone name="upload-cloud" size={32} />
        </span>
        <p className="neu-bulk__title">
          {cheio ? (
            `Limite de ${maxArquivos} arquivos atingido`
          ) : arrastando ? (
            "Solte os arquivos para enviar"
          ) : (
            <>
              Arraste arquivos aqui ou <span className="neu-bulk__link">selecione do computador</span>
            </>
          )}
        </p>
        <p className="neu-bulk__hint" id={`${uid}-dica`}>{textoDica}</p>
        <input ref={entrada} type="file" multiple hidden accept={aceita.join(",")} onClick={(e) => e.stopPropagation()} onChange={aoSelecionar} />
      </div>
      {arquivos.length > 0 && (
        <div className="neu-bulk__summary">
          <span>
            <b>{nConcluidos} de {arquivos.length}</b> concluídos
            {nEnviando > 0 && ` · ${nEnviando} enviando`}
            {nErros > 0 && <span className="neu-tone-danger"> · {nErros} {nErros === 1 ? "erro" : "erros"}</span>}
          </span>
          {nConcluidos > 0 && (
            <button type="button" className="neu-bulk__clear" onClick={limparConcluidos}>Limpar concluídos</button>
          )}
        </div>
      )}
      {arquivos.length > 0 && (
        <ul className="neu-bulk__list" aria-label="Arquivos selecionados">
          {arquivos.map((f) => {
            const e = ESTADOS[f.estado];
            const pct = Math.round(f.progresso);
            return (
              <li key={f.id} className="neu-bulk__file" data-status={f.estado}>
                <span className={`neu-bulk__ficon neu-tone-${e.tom}`}>
                  <Icone name={e.icone} size={18} />
                </span>
                <div className="neu-bulk__main">
                  <div className="neu-bulk__row">
                    <span className="neu-bulk__name" title={f.nome}>{f.nome}</span>
                    <span className="neu-bulk__meta">
                      {f.tamanho && <span className="neu-bulk__size neu-mono">{f.tamanho}</span>}
                      <span className={`neu-bulk__state neu-tone-${e.tom}`}>{f.estado === "enviando" ? `${pct}%` : f.estado === "erro" && f.erro ? f.erro : e.palavra}</span>
                    </span>
                  </div>
                  <Progresso fino valor={f.estado === "enviando" ? pct : 100} tom={f.estado === "concluido" ? "success" : f.estado === "erro" ? "danger" : "accent"} rotulo={`Envio de ${f.nome}`} />
                </div>
                <button type="button" className="neu-kebab-ghost neu-bulk__remove" aria-label={`Remover ${f.nome}`} title="Remover" onClick={() => remover(f)}>
                  <Icone name="x" size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="sr-only" aria-live="polite">{aviso}</div>
    </div>
  );
}

const EXEMPLO: ArquivoInicial[] = [
  { nome: "relatorio_prestacao_contas_2026.pdf", tamanho: "2,4 MB", estado: "concluido" },
  { nome: "planilha_atendimentos_outubro.xlsx", tamanho: "860 KB", estado: "enviando", progresso: 68 },
  { nome: "foto_evento_capacitacao.jpg", tamanho: "4,1 MB", estado: "enviando", progresso: 23 },
  { nome: "contrato_digitalizado_completo.pdf", tamanho: "14,2 MB", estado: "erro", erro: "Excede 10MB" },
];

export default function NeumorfismoUploadEmMassa() {
  return (
    <ComponentPreview
      title="Upload em Massa com Progresso"
      description="Área de arrastar e soltar para vários arquivos, com resumo, uma linha elevada por arquivo e trilho de progresso individual. Valida tipo e tamanho e simula o envio quando não há uma função de envio."
      whenToUse={["Envio de documentos comprobatórios", "Importação de planilhas", "Upload de fotos de obras"]}
      whenNotToUse={["Arquivo único simples (use um input de arquivo)", "Lista só de leitura: use o Upload", "Dados que cabem em campos de texto"]}
      accessibility={[
        "A área é um botão descrito pela dica: Enter e Espaço abrem o seletor de arquivos",
        "Cada trilho é um progressbar com o nome \"Envio de ‹arquivo›\"; o estado vai em palavra, não só em cor",
        "Uma região aria-live educada anuncia arquivos adicionados, enviados e removidos",
        "No limite de arquivos a área fica desativada e diz isso no título",
      ]}
      code={`<UploadEmMassa
  aceita={[".pdf", ".xlsx", ".jpg", ".png"]}
  tamanhoMax={10}
  maxArquivos={20}
  aoEnviar={(arquivo, { progresso, concluir, falhar }) => {
    // conduza o seu envio e avise o andamento
    enviar(arquivo, { aoAvancar: progresso, aoTerminar: concluir, aoFalhar: () => falhar("Falha na rede") });
  }}
  aoMudar={(arquivos) => salvar(arquivos)}
/>`}
    >
      <div style={{ maxWidth: 640 }}>
        <UploadEmMassa arquivosIniciais={EXEMPLO} />
      </div>
    </ComponentPreview>
  );
}
