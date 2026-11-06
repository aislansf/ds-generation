import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent, type MutableRefObject, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { Aviso } from "@/components/estilo/NeumorfismoAlertas";
import { Auxiliar, Marca, juntar, type LinkAuxiliar } from "@/components/estilo/NeumorfismoSignIn";
import { brandCor } from "@/assets/brand";

/**
 * Tela de verificação em duas etapas (template TwoFactor do pacote Neumorphic UI v3.2.0), o passo seguinte à entrada: mesma
 * página, painel e rodapé, com a marca em 48px, um selo afundado de 56px com o escudo, o título "Verificação em duas etapas" e
 * a instrução; `destino` ("a•••@exemplo.com") diz para onde o código foi (mascare-o). No painel: o campo do código, o
 * botão "Verificar código", "Não recebeu o código? Reenviar em 0:30" (a contagem vira o link "Reenviar código") e "Voltar
 * para o login".
 *  - O campo do código: seis células afundadas de 44×52px (as mesmas do Código de uso único) com dígitos em fonte de código; digitar avança, não-dígito é
 *    ignorado, Backspace numa célula vazia apaga a anterior e volta, setas, Home e End andam entre as células, e colar o
 *    código inteiro (inclusive "654-321") preenche a partir da célula. A primeira célula leva autoComplete="one-time-code";
 *    cada célula é "Dígito N de 6", num grupo "Código de 6 dígitos" descrito pela instrução. Preencher o último dígito envia
 *    sozinho (`envioAutomatico={false}` desliga).
 *  - Código incompleto: "Digite os 6 dígitos do código.", células vermelhas e foco na primeira vazia. `aoEnviar(codigo)`
 *    recebe os seis dígitos; `carregando` desativa células e botão ("Verificando…"). Código errado ou vencido vai em
 *    `erro`: o aviso "Código incorreto" aparece, as células se limpam e o foco volta à primeira.
 *  - Reenvio: `aoReenviar` dispara pelo link e reinicia a contagem (`reenviarEm`, em segundos, padrão 30); mostre a
 *    confirmação com `aviso` ("Enviamos um novo código.").
 * `ExemploVerificacao` entra na aba "Two-Factor" dos modelos de login da TemplatesPage e só é usada quando
 * ESTILO.id === "neumorfismo". As classes neu-signin*, neu-2fa* e neu-code* vêm de src/styles/estilo.css.
 */

export interface TelaVerificacaoProps {
  logo?: ReactNode;
  nomeDaMarca?: string;
  titulo?: string;
  subtitulo?: string;
  /** Para onde o código foi, já mascarado */
  destino?: string;
  /** Número de dígitos */
  tamanho?: number;
  envioAutomatico?: boolean;
  focoAutomatico?: boolean;
  rotuloEnviar?: string;
  rotuloCarregando?: string;
  tom?: "secundario" | "marca";
  carregando?: boolean;
  erro?: string | null;
  tituloDoErro?: string;
  aoFecharErro?: () => void;
  /** Confirmação, como "Enviamos um novo código." */
  aviso?: string | null;
  aoEnviar?: (codigo: string) => void;
  /** Segundos até liberar o reenvio */
  reenviarEm?: number;
  perguntaReenvio?: string;
  rotuloReenvio?: string;
  aoReenviar?: () => void;
  voltar?: LinkAuxiliar | false;
  rodape?: string | false;
  paginaInteira?: boolean;
}

interface CodigoProps {
  tamanho: number;
  valor: string;
  aoMudar: (v: string) => void;
  aoCompletar?: (v: string) => void;
  invalido?: boolean;
  desativado?: boolean;
  descritoPor?: string;
  primeira: MutableRefObject<HTMLInputElement | null>;
}

/** Campo segmentado do código: o valor é a string com um espaço no lugar de cada célula vazia (e sem espaços à direita). */
export function CodigoDeVerificacao({ tamanho, valor, aoMudar, aoCompletar, invalido, desativado, descritoPor, primeira }: CodigoProps) {
  const celulas = useRef<(HTMLInputElement | null)[]>([]);
  const limpo = String(valor || "").replace(/[^\d ]/g, "").slice(0, tamanho);
  const chars = Array.from({ length: tamanho }, (_, i) => (limpo.charAt(i) || "").trim());
  const juntarChars = (a: string[]) => a.map((c) => c || " ").join("").replace(/\s+$/, "");
  const completo = (s: string) => s.length === tamanho && /^\d+$/.test(s);

  const foco = (i: number) => {
    const el = celulas.current[Math.max(0, Math.min(tamanho - 1, i))];
    if (el) {
      el.focus();
      el.select();
    }
  };
  const gravar = (a: string[]) => {
    const saida = juntarChars(a);
    aoMudar(saida);
    if (completo(saida)) aoCompletar?.(saida);
  };
  const preencher = (de: number, digitos: string) => {
    const a = chars.slice();
    for (let k = 0; k < digitos.length && de + k < tamanho; k++) a[de + k] = digitos[k];
    gravar(a);
    foco(Math.min(tamanho - 1, de + digitos.length));
  };
  const colar = (e: ClipboardEvent<HTMLInputElement>, i: number) => {
    const d = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (d) {
      e.preventDefault();
      preencher(i, d);
    }
  };
  const teclar = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      e.preventDefault();
      const a = chars.slice();
      a[i - 1] = "";
      gravar(a);
      foco(i - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      foco(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      foco(i + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      foco(0);
    } else if (e.key === "End") {
      e.preventDefault();
      foco(tamanho - 1);
    }
  };

  return (
    <div className={juntar("neu-code", invalido && "neu-code--invalid")} role="group" aria-label={`Código de ${tamanho} dígitos`} aria-describedby={descritoPor}>
      {chars.map((c, i) => (
        <input data-ds="input"
          key={i}
          ref={(el) => {
            celulas.current[i] = el;
            if (i === 0) primeira.current = el;
          }}
          className="neu-code__cell neu-otp__cell"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={i === 0 ? tamanho : 1}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Dígito ${i + 1} de ${tamanho}`}
          aria-invalid={invalido ? true : undefined}
          disabled={desativado}
          value={c}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "");
            if (!d) {
              const a = chars.slice();
              a[i] = "";
              gravar(a);
              return;
            }
            if (d.length > 1) {
              preencher(i, d);
              return;
            }
            const a = chars.slice();
            a[i] = d;
            gravar(a);
            if (i < tamanho - 1) foco(i + 1);
          }}
          onPaste={(e) => colar(e, i)}
          onKeyDown={(e) => teclar(e, i)}
        />
      ))}
    </div>
  );
}

const relogio = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function TelaVerificacao({
  logo, nomeDaMarca = "Sua marca", titulo = "Verificação em duas etapas", subtitulo, destino, tamanho = 6, envioAutomatico = true, focoAutomatico = true,
  rotuloEnviar = "Verificar código", rotuloCarregando = "Verificando…", tom = "secundario", carregando = false, erro, tituloDoErro = "Código incorreto",
  aoFecharErro, aviso, aoEnviar, reenviarEm = 30, perguntaReenvio = "Não recebeu o código?", rotuloReenvio = "Reenviar código", aoReenviar,
  voltar, rodape, paginaInteira = true,
}: TelaVerificacaoProps) {
  const uid = useId();
  const primeira = useRef<HTMLInputElement | null>(null);
  const [codigo, setCodigo] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const [espera, setEspera] = useState(reenviarEm);

  useEffect(() => {
    if (focoAutomatico) primeira.current?.focus();
  }, [focoAutomatico]);
  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera(espera - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);
  useEffect(() => {
    if (erro) {
      setCodigo("");
      primeira.current?.focus();
    }
  }, [erro]);

  const linkVoltar = voltar === false ? null : { label: "Voltar para o login", ...(voltar ?? {}) };
  const tituloId = `${uid}-titulo`;
  const descId = `${uid}-desc`;
  const erroId = `${uid}-erro`;
  const instrucao = subtitulo ?? `Insira o código de ${tamanho} dígitos enviado para o seu e-mail ou aplicativo autenticador.`;

  const verificar = (c: string) => {
    if (!(c.length === tamanho && /^\d+$/.test(c))) {
      setErroLocal(`Digite os ${tamanho} dígitos do código.`);
      const vazia = c.indexOf(" ") >= 0 ? c.indexOf(" ") : c.length;
      const celulas = document.querySelectorAll<HTMLInputElement>(`[id="${uid}-codigo"] .neu-code__cell`);
      celulas[Math.min(vazia, tamanho - 1)]?.focus();
      return;
    }
    setErroLocal("");
    aoEnviar?.(c);
  };

  const Raiz = paginaInteira ? "main" : "section";
  return (
    <Raiz className={juntar("neu-signin", "neu-2fa", !paginaInteira && "neu-signin--inline")} aria-labelledby={tituloId}>
      <div className="neu-signin__col">
        <div className="neu-signin__brand">
          {logo ?? <Marca pequena />}
          {!logo && <span className="neu-signin__brandname">{nomeDaMarca}</span>}
        </div>
        <span className="neu-2fa__badge" aria-hidden="true">
          <Icone name="shield-check" size={28} />
        </span>
        <h2 className="neu-signin__title" id={tituloId}>{titulo}</h2>
        <p className="neu-signin__sub" id={descId}>
          {instrucao}
          {destino && <span className="neu-2fa__dest"> Enviado para <b>{destino}</b>.</span>}
        </p>
        <form className="neu-signin__card neu-2fa__card" noValidate onSubmit={(e) => { e.preventDefault(); verificar(codigo); }}>
          {erro && <Aviso tipo="danger" titulo={tituloDoErro} aoFechar={aoFecharErro}>{erro}</Aviso>}
          {aviso && <Aviso tipo="success" titulo={aviso} />}
          <div id={`${uid}-codigo`}>
            <CodigoDeVerificacao
              tamanho={tamanho}
              valor={codigo}
              invalido={!!erroLocal || !!erro}
              desativado={carregando}
              descritoPor={[descId, erroLocal && erroId].filter(Boolean).join(" ")}
              primeira={primeira}
              aoMudar={(c) => {
                setCodigo(c);
                if (erroLocal) setErroLocal("");
              }}
              aoCompletar={(c) => {
                if (envioAutomatico) verificar(c);
              }}
            />
          </div>
          {erroLocal && <p className="neu-error-text neu-2fa__err" role="alert" id={erroId}>{erroLocal}</p>}
          <Button type="submit" variant={tom === "marca" ? "default" : "secondary"} size="lg" className="neu-signin__submit" disabled={carregando} aria-busy={carregando || undefined}>
            {carregando && <Icone name="loader-2" size={16} spin />}
            {carregando ? rotuloCarregando : rotuloEnviar}
          </Button>
          <p className="neu-signin__alt" aria-live="polite">
            {perguntaReenvio}{" "}
            {espera > 0 ? (
              <span className="neu-2fa__wait">Reenviar em <b>{relogio(espera)}</b></span>
            ) : (
              <button
                type="button"
                className="neu-signin__link neu-signin__link--accent neu-2fa__resend"
                onClick={() => {
                  setEspera(reenviarEm);
                  setCodigo("");
                  setErroLocal("");
                  aoReenviar?.();
                  primeira.current?.focus();
                }}
              >
                {rotuloReenvio}
              </button>
            )}
          </p>
          {linkVoltar && (
            <div className="neu-2fa__back">
              <Auxiliar cfg={linkVoltar} classe="neu-signin__link neu-signin__link--royal neu-2fa__backlink" filhos={<><Icone name="arrow-left" size={14} />{linkVoltar.label}</>} />
            </div>
          )}
        </form>
        {rodape !== false && <p className="neu-signin__foot">{rodape ?? `© ${new Date().getFullYear()} ${nomeDaMarca}`}</p>}
      </div>
    </Raiz>
  );
}

export function ExemploVerificacao() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const aoEnviar = (codigo: string) => {
    setErro(null);
    setAviso(null);
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      if (codigo === "123456") setAviso("Código verificado. Redirecionando…");
      else setErro("O código digitado não confere ou expirou. Tente de novo ou peça um novo código.");
    }, 1000);
  };
  return (
    <div className="neu-signin-demo">
      <TelaVerificacao
        paginaInteira={false}
        focoAutomatico={false}
        logo={<img src={brandCor} alt="__BRAND_NAME__" />}
        destino="a•••@exemplo.com"
        voltar={{ onClick: () => {} }}
        rodape="© 2026 __BRAND_NAME__"
        carregando={carregando}
        erro={erro}
        aviso={aviso}
        aoFecharErro={() => setErro(null)}
        aoReenviar={() => {
          setErro(null);
          setAviso("Enviamos um novo código.");
        }}
        aoEnviar={aoEnviar}
      />
      <p className="neu-help neu-signin-demo__nota">Demonstração: 123456 é aceito; qualquer outro código mostra o erro. Cole o código inteiro ou digite dígito a dígito; o envio é automático no 6º dígito.</p>
    </div>
  );
}
