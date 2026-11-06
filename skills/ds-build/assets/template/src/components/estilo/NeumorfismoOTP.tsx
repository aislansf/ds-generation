import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { ComponentPreview } from "@/components/DSComponents";

/**
 * Vitrine do Código de uso único (componente InputOTP do pacote Neumorphic UI v3.2.0): células afundadas, com
 * grupos separados por um traço afundado, dígitos ou letras e números, máscara, estado inválido e tamanho compacto.
 * O foco vai sempre à primeira célula vazia, digitar avança, Backspace apaga e volta, as setas andam entre as
 * células preenchidas e colar preenche todas. Só é usada quando ESTILO.id === "neumorfismo" (ComponentesPage);
 * as classes neu-otp* e neu-code* vêm de src/styles/estilo.css.
 */

interface CodigoOTPProps {
  maxLength?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (codigo: string) => void;
  onComplete?: (codigo: string) => void;
  /** Ex.: [3, 3] ou [4, 4]; um traço afundado separa os grupos */
  groups?: number[];
  alfanumerico?: boolean;
  mascara?: boolean;
  invalido?: boolean;
  desabilitado?: boolean;
  tamanho?: "md" | "sm";
  rotulo?: string;
  descritoPor?: string;
}

export function CodigoOTP({ maxLength = 6, value, defaultValue = "", onChange, onComplete, groups, alfanumerico = false, mascara = false, invalido = false, desabilitado = false, tamanho = "md", rotulo, descritoPor }: CodigoOTPProps) {
  const [interno, setInterno] = useState(defaultValue);
  const codigo = String(value ?? interno);
  const celulas = useRef<(HTMLInputElement | null)[]>([]);
  const limpar = (s: string) => (alfanumerico ? s.toUpperCase().replace(/[^A-Z0-9]/g, "") : s.replace(/\D/g, ""));
  const chars = Array.from({ length: maxLength }, (_, i) => codigo.charAt(i));

  function gravar(a: string[]) {
    const saida = a.join("").slice(0, maxLength);
    if (value === undefined) setInterno(saida);
    onChange?.(saida);
    if (saida.length === maxLength && a.every(Boolean)) onComplete?.(saida);
  }
  function foco(i: number) {
    const el = celulas.current[Math.max(0, Math.min(maxLength - 1, i))];
    if (el) {
      el.focus();
      el.select();
    }
  }
  function preencher(de: number, s: string) {
    let a = chars.slice();
    for (let k = 0; k < s.length && de + k < maxLength; k++) a[de + k] = s[k];
    const vazio = a.findIndex((c) => !c);
    if (vazio >= 0) a = [...a.slice(0, vazio), ...Array(maxLength - vazio).fill("")];
    gravar(a);
    foco(Math.min(maxLength - 1, de + s.length));
  }
  function aoTeclar(e: KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const a = chars.slice();
      if (a[i]) a[i] = "";
      else if (i > 0) {
        a[i - 1] = "";
        foco(i - 1);
      }
      gravar(a);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      foco(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (chars[i]) foco(i + 1);
    }
  }
  function aoColar(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const d = limpar(e.clipboardData.getData("text") || "");
    if (d) preencher(0, d);
  }

  const grupos = groups ?? [maxLength];
  let indice = 0;
  const filhos = grupos.flatMap((g, gi) => {
    const itens = [];
    if (gi > 0) itens.push(<span key={`s${gi}`} className="neu-otp__sep" role="separator" aria-hidden="true" />);
    const celulasDoGrupo = Array.from({ length: g }, () => {
      const i = indice++;
      const anteriorPreenchido = i === 0 || !!chars[i - 1];
      return (
        <input data-ds="input"
          key={i}
          ref={(el) => {
            celulas.current[i] = el;
          }}
          className="neu-code__cell neu-otp__cell"
          type={mascara ? "password" : "text"}
          inputMode={alfanumerico ? "text" : "numeric"}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={i === 0 ? maxLength : 1}
          aria-label={`Caractere ${i + 1} de ${maxLength}`}
          aria-invalid={invalido ? true : undefined}
          disabled={desabilitado}
          value={chars[i]}
          tabIndex={anteriorPreenchido ? 0 : -1}
          onFocus={(e) => {
            const primeiro = celulas.current.findIndex((el) => el && !el.value);
            if (primeiro >= 0 && primeiro < i) {
              foco(primeiro);
              return;
            }
            e.target.select();
          }}
          onChange={(e) => {
            const d = limpar(e.target.value);
            if (!d) return;
            if (d.length > 1) {
              preencher(i, d);
              return;
            }
            const a = chars.slice();
            a[i] = d;
            gravar(a);
            if (i < maxLength - 1) foco(i + 1);
          }}
          onPaste={aoColar}
          onKeyDown={(e) => aoTeclar(e, i)}
        />
      );
    });
    itens.push(<div key={`g${gi}`} className="neu-otp__group">{celulasDoGrupo}</div>);
    return itens;
  });

  return (
    <div className={["neu-otp", invalido ? "neu-code--invalid" : "", tamanho === "sm" ? "neu-otp--sm" : ""].filter(Boolean).join(" ")} role="group" aria-label={rotulo ?? `Código de ${maxLength} caracteres`} aria-describedby={descritoPor}>
      {filhos}
    </div>
  );
}

export default function NeumorfismoOTP() {
  const [codigo, setCodigo] = useState("");
  const [concluido, setConcluido] = useState<string | null>(null);
  return (
    <ComponentPreview
      title="Código de uso único (InputOTP)"
      description="Um código feito de células afundadas, com grupos e separadores opcionais. Aceita dígitos ou letras e números, e o telefone pode oferecer o código recebido por SMS."
      whenToUse={["Verificação em duas etapas e confirmação de e-mail ou telefone", "Códigos agrupados (3 + 3, 4 + 4) para facilitar a leitura", "Alfanumérico em chaves de convite e protocolos"]}
      whenNotToUse={["Senhas: use o campo de senha com botão de mostrar", "Textos livres ou longos"]}
      accessibility={["Cada célula tem nome \"Caractere n de N\" e o grupo, o seu rótulo", "O foco vai à primeira célula vazia; Backspace apaga e volta; setas andam entre as células", "Colar preenche todas; a primeira célula traz autocomplete one-time-code", "Inválido: aria-invalid e mensagem em texto, não só a cor"]}
      code={`<CodigoOTP maxLength={6} groups={[3, 3]} onComplete={enviar} />
<CodigoOTP maxLength={8} groups={[4, 4]} alfanumerico tamanho="sm" />
<CodigoOTP maxLength={4} defaultValue="9071" invalido />`}
    >
      <div className="neu-stack" style={{ gap: 28 }}>
        <div>
          <p className="neu-cap">Exemplo de referência — 6 dígitos</p>
          <CodigoOTP maxLength={6} defaultValue="123456" />
        </div>
        <div>
          <p className="neu-cap">Agrupado 3 + 3 com conclusão</p>
          <CodigoOTP
            maxLength={6}
            groups={[3, 3]}
            value={codigo}
            onChange={(c) => {
              setCodigo(c);
              setConcluido(null);
            }}
            onComplete={setConcluido}
            descritoPor="neu-otp-ajuda"
          />
          <p id="neu-otp-ajuda" className="neu-help" aria-live="polite">
            {concluido ? `Código ${concluido} enviado para verificação.` : "Digite ou cole o código recebido por SMS."}
          </p>
        </div>
        <div className="neu-row neu-row--topo">
          <div>
            <p className="neu-cap">Alfanumérico 4 + 4 (sm)</p>
            <CodigoOTP maxLength={8} groups={[4, 4]} alfanumerico tamanho="sm" defaultValue="AB12" />
          </div>
          <div>
            <p className="neu-cap">Inválido</p>
            <CodigoOTP maxLength={4} defaultValue="9071" invalido descritoPor="neu-otp-erro" />
            <p id="neu-otp-erro" className="neu-error-text" role="alert">Código incorreto. Restam 2 tentativas.</p>
          </div>
        </div>
      </div>
    </ComponentPreview>
  );
}
