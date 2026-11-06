import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle, AtSign, Eye, EyeOff, Key, Lock, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/DSComponents";
import NeumorfismoOTP from "./NeumorfismoOTP";

/**
 * Vitrine do Campo de texto no estilo Neumorfismo (componente TextField do pacote Neumorphic UI v3.2.0): o poço
 * afundado com borda, o erro com fundo tingido e ícone de alerta, a variante "plain" (busca) e a "soft" (acesso),
 * com ação no rótulo e botão de mostrar a senha. As classes neu-field* vêm de src/styles/estilo.css. Só é usada
 * quando ESTILO.id === "neumorfismo" (ComponentesPage).
 */

interface CampoTextoProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  label: ReactNode;
  error?: string;
  hint?: string;
  icone?: ReactNode;
  variante?: "padrao" | "plain" | "soft";
  revealable?: boolean;
  acaoRotulo?: { rotulo: string; href: string };
  /** sm: linhas compactas, usadas em popovers e barras de ferramentas */
  tamanho?: "md" | "sm";
}

export function CampoTexto({ label, error, hint, icone, variante = "padrao", revealable = false, acaoRotulo, tamanho = "md", type, disabled, ...resto }: CampoTextoProps) {
  const id = useId();
  const [visivel, setVisivel] = useState(false);
  const comRevelar = revealable && type === "password" && !error;
  const classe = ["neu-field", variante !== "padrao" ? `neu-field--${variante}` : "", error ? "neu-field--error" : "", disabled ? "neu-field--disabled" : ""].filter(Boolean).join(" ");
  const rotulo = <label className={`neu-label${error ? " neu-label--error" : ""}`} htmlFor={id}>{label}</label>;

  return (
    <div className={tamanho === "sm" ? "neu-input--sm" : undefined}>
      {acaoRotulo ? (
        <div className="neu-label-row">
          {rotulo}
          <a className="neu-label-action" href={acaoRotulo.href}>{acaoRotulo.rotulo}</a>
        </div>
      ) : (
        rotulo
      )}
      <div className={classe}>
        {icone && <span className="neu-field__icon" aria-hidden="true">{icone}</span>}
        <input
          id={id}
          type={comRevelar && visivel ? "text" : type}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          {...resto}
        />
        {error ? (
          <span className="neu-field__icon" aria-hidden="true"><AlertCircle size={16} /></span>
        ) : (
          comRevelar && (
            <button type="button" className="neu-field__reveal" aria-label={visivel ? "Ocultar senha" : "Mostrar senha"} aria-pressed={visivel} aria-controls={id} onClick={() => setVisivel(!visivel)}>
              {visivel ? <EyeOff aria-hidden="true" size={16} /> : <Eye aria-hidden="true" size={16} />}
            </button>
          )
        )}
      </div>
      {error ? (
        <p className="neu-error-text" role="alert" id={`${id}-msg`}>{error}</p>
      ) : (
        hint && <p className="neu-help" id={`${id}-msg`}>{hint}</p>
      )}
    </div>
  );
}

const ic = { size: 16 } as const;

/** Input do pacote: o mesmo campo com descrição, validação ao digitar, tamanho compacto e desativado. */
function NeumorfismoInput() {
  const [email, setEmail] = useState("ana@");
  const invalido = email !== "" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <ComponentPreview
      title="Input — variantes do pacote"
      description="O campo no padrão shadcn: rótulo, o campo no poço afundado e a descrição. Aceita ícone, erro, mostrar senha e tamanho compacto."
      whenToUse={["Formulários com descrição de apoio sob o campo", "Validação ao digitar, com a mensagem trocando a descrição", "sm: linhas compactas em popovers e barras de ferramentas"]}
      whenNotToUse={["Descrição longa: use texto de ajuda fora do campo", "Campo desativado sem explicar o motivo na descrição"]}
      accessibility={["A descrição vai ligada ao campo por aria-describedby", "O erro troca a descrição, marca aria-invalid e usa role=alert", "Desativado: o campo fica opaco e sem foco"]}
      code={`<CampoTexto label="Chave de API" type="password" revealable icone={<Key size={16} />} hint="Sua chave é criptografada." />
<CampoTexto label="Buscar" tamanho="sm" icone={<Search size={16} />} type="search" />`}
    >
      <div className="neu-inputs">
        <div>
          <p className="neu-cap">Exemplo de referência</p>
          <CampoTexto label="Chave de API" type="password" revealable placeholder="sk-..." icone={<Key {...ic} />} hint="Sua chave de API é criptografada e armazenada com segurança." />
        </div>
        <div>
          <p className="neu-cap">Validação</p>
          <CampoTexto label="E-mail" type="email" icone={<Mail {...ic} />} value={email} onChange={(e) => setEmail(e.target.value)} error={invalido ? "Informe um e-mail válido, como nome@empresa.com.br." : undefined} hint="Usaremos para enviar o comprovante." />
        </div>
        <div>
          <p className="neu-cap">Busca — tamanho sm</p>
          <CampoTexto label="Buscar" tamanho="sm" icone={<Search {...ic} />} type="search" placeholder="Nome, CPF ou protocolo" />
        </div>
        <div>
          <p className="neu-cap">Desativado</p>
          <CampoTexto label="Unidade" disabled defaultValue="Capital — Centro" hint="Definida pelo seu perfil." />
        </div>
      </div>
    </ComponentPreview>
  );
}

export default function NeumorfismoCampos() {
  return (
    <>
      <NeumorfismoCamposTexto />
      <NeumorfismoInput />
      <NeumorfismoOTP />
    </>
  );
}

function NeumorfismoCamposTexto() {
  return (
    <ComponentPreview
      title="Campo de texto — variantes do pacote"
      description="Um poço afundado e permanente, com borda que se aprofunda no hover e no foco. O erro troca a borda por 2px de perigo, tinge o poço e mostra a mensagem logo abaixo."
      whenToUse={["Padrão: formulários de cadastro, com rótulo sempre visível", "Plain: busca e barras de filtro", "Soft: acesso e formulários curtos, com ação no rótulo e botão de mostrar a senha"]}
      whenNotToUse={["Placeholder no lugar do rótulo", "Cor como único sinal de erro: ele traz ícone e mensagem"]}
      accessibility={["Rótulo ligado ao campo (htmlFor/id)", "Erro com role=alert e aria-describedby; aria-invalid no campo", "Botão de senha com aria-pressed e nome \"Mostrar senha\" / \"Ocultar senha\"", "Texto de 12px; borda do campo com 3:1 sobre o fundo"]}
      code={`<CampoTexto label="Nome completo" defaultValue="Alexandre Silveira" />
<CampoTexto label="Campo com erro" error="Este campo é obrigatório" />
<CampoTexto variante="plain" label="Buscar" icone={<Search size={16} />} />
<CampoTexto variante="soft" label="Senha" type="password" revealable />`}
    >
      <div className="neu-campos">
        <div className="neu-stack" style={{ gap: 16 }}>
          <CampoTexto label="Nome completo" defaultValue="Alexandre Silveira" />
          <CampoTexto label="E-mail" placeholder="exemplo@empresa.com.br" />
          <CampoTexto label="Campo com erro" defaultValue="123" error="Este campo é obrigatório" />
          <CampoTexto label="Buscar" variante="plain" icone={<Search {...ic} />} placeholder="Nome, código, município..." />
        </div>
        <section className="neu-auth" aria-labelledby="neu-auth-titulo">
          <span className="neu-auth__eyebrow">Acesso seguro</span>
          <h4 className="neu-auth__title" id="neu-auth-titulo">Entrar no Studio</h4>
          <p className="neu-auth__sub">Informe suas credenciais corporativas</p>
          <form className="neu-auth__form" onSubmit={(e) => e.preventDefault()}>
            <CampoTexto variante="soft" label="E-mail ou usuário" icone={<AtSign {...ic} />} type="email" autoComplete="username" defaultValue="alexandre@studio.example" />
            <CampoTexto variante="soft" label="Senha" icone={<Lock {...ic} />} type="password" autoComplete="current-password" revealable defaultValue="senha-de-exemplo" acaoRotulo={{ rotulo: "Esqueceu?", href: "#" }} />
            <Button type="submit" size="lg" className="w-full neu-auth__submit">Acessar painel seguro</Button>
          </form>
        </section>
      </div>
    </ComponentPreview>
  );
}
