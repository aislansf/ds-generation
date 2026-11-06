import { Aviso } from "@/components/estilo/NeumorfismoAlertas";
import { Selo } from "@/components/estilo/NeumorfismoBadges";
import { EstadoVazio } from "@/components/estilo/NeumorfismoVazios";
import { ListaDescritiva } from "@/components/estilo/NeumorfismoListaDescritiva";

/**
 * Diagnóstico do Validador de artefatos (/design-system/validator) com os componentes validados em Componentes: o estado
 * vazio (Empty State), o aviso de sucesso ou de erro (Alert) e, para os erros do schema, a Lista descritiva em painel com
 * o caminho JSON Pointer como termo e, no valor, a mensagem, o número da linha e a palavra do schema em selos. A lógica da
 * página (Ajv, linhas) continua na ValidatorPage, que só entrega os dados prontos. Só é usado quando ESTILO.id ===
 * "neumorfismo".
 */

export interface ErroDoSchema {
  /** O caminho JSON Pointer do erro; "(root)" na raiz */
  caminho: string;
  linha?: number;
  /** A palavra do schema que falhou (required, type, enum...) */
  palavra: string;
  mensagem: string;
  /** Os parâmetros do erro, já em texto */
  parametros?: string;
}

export interface ResultadoValidacaoProps {
  /** Nada foi validado ainda */
  vazio?: boolean;
  /** A mensagem do JSON.parse, quando o texto não é JSON */
  erroJson?: string | null;
  sucesso?: { titulo: string; texto: string } | null;
  erros?: { titulo: string; itens: ErroDoSchema[] } | null;
}

export function ResultadoValidacao({ vazio, erroJson, sucesso, erros }: ResultadoValidacaoProps) {
  if (vazio) {
    return (
      <EstadoVazio titulo="Nenhum JSON validado ainda">Cole conteúdo acima ou carregue um exemplo.</EstadoVazio>
    );
  }
  if (erroJson) {
    return (
      <Aviso tipo="danger" titulo="JSON inválido">
        {erroJson}
      </Aviso>
    );
  }
  if (sucesso) {
    return (
      <Aviso tipo="success" titulo={sucesso.titulo}>
        {sucesso.texto}
      </Aviso>
    );
  }
  if (erros && erros.itens.length > 0) {
    return (
      <div className="neu-valid">
        <Aviso tipo="danger" titulo={erros.titulo} />
        <ListaDescritiva
          variante="painel"
          rotulo="Erros do schema"
          itens={erros.itens.map((e) => ({
            termo: <code className="neu-valid__caminho">{e.caminho}</code>,
            valor: (
              <div className="neu-valid__erro">
                <span>{e.mensagem}</span>
                <span className="neu-valid__selos">
                  {e.linha ? <Selo tom="accent" variante="inset" tamanho="sm">linha ~{e.linha}</Selo> : null}
                  <Selo tom="neutral" variante="inset" tamanho="sm">{e.palavra}</Selo>
                </span>
                {e.parametros && <code className="neu-valid__params">{e.parametros}</code>}
              </div>
            ),
          }))}
        />
      </div>
    );
  }
  return null;
}
