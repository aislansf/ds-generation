import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { CampoTexto } from "@/components/estilo/NeumorfismoCampos";
import { Aviso } from "@/components/estilo/NeumorfismoAlertas";
import { Progresso } from "@/components/estilo/NeumorfismoProgresso";
import { Auxiliar, Marca, juntar, validarEntrada, type LinkAuxiliar } from "@/components/estilo/NeumorfismoSignIn";
import { brandCor } from "@/assets/brand";

/**
 * Tela de cadastro (template SignUp do pacote Neumorphic UI v3.2.0), a companheira da tela de entrada: mesma página, marca,
 * título, painel e rodapé, montada com o campo de texto, o checkbox, o progresso, o botão e o aviso do estilo. Todos os
 * campos são obrigatórios e levam o asterisco na cor da marca.
 *  - Campos: "Nome completo", "E-mail" e "CPF" (dígitos em fonte de código; `cpf={false}` esconde), "Senha" e "Confirmar
 *    senha" lado a lado (empilhados abaixo de 460px). Ao digitar a senha, aparece uma barra fina e "Força da senha: …"
 *    ("Muito curta", "Fraca", "Boa", "Forte"): o nível vai também em palavra, não só em cor.
 *  - Termos: um checkbox e a frase "Eu concordo com os Termos de Uso e a Política de Privacidade." Os links ficam fora do
 *    rótulo do checkbox, então continuam clicáveis; o checkbox é nomeado pela frase.
 *  - Comportamento: o CPF ganha máscara ao digitar (000.000.000-00) e tem os dois dígitos verificadores conferidos (dígitos
 *    repetidos são recusados). A validação roda ao enviar e, depois, a cada mudança: nome com duas palavras, e-mail
 *    válido, CPF válido, senha com pelo menos 8 caracteres, confirmação igual e termos aceitos. Cada mensagem diz o que
 *    fazer, e o foco vai ao primeiro problema, inclusive o checkbox dos termos (que fica vermelho e aria-invalid).
 *    `aoEnviar({ nome, email, cpf, senha, aceitouTermos })` só dispara com tudo certo, e o `cpf` vai com 11 dígitos.
 *    `carregando` mostra o carregamento e "Criando conta…". Falha do servidor vai em `erro`; para não revelar quem já tem
 *    conta, escreva algo como "Já existe uma conta com este e-mail ou CPF" e aponte para entrar ou recuperar a senha.
 *  - Preenchimento automático: autoComplete "name", "email" e "new-password" nas duas senhas.
 * `ExemploCadastro` entra na aba "Sign Up" dos modelos de login da TemplatesPage e só é usada quando
 * ESTILO.id === "neumorfismo". As classes neu-signin* e neu-signup* vêm de src/styles/estilo.css.
 */

export interface TelaCadastroProps {
  logo?: ReactNode;
  nomeDaMarca?: string;
  titulo?: string;
  subtitulo?: string;
  rotuloNome?: string;
  placeholderNome?: string;
  rotuloEmail?: string;
  placeholderEmail?: string;
  /** false esconde o campo de CPF */
  cpf?: boolean;
  termos?: LinkAuxiliar;
  privacidade?: LinkAuxiliar;
  /** false esconde a chamada de entrada */
  entrar?: LinkAuxiliar | false;
  rotuloEnviar?: string;
  rotuloCarregando?: string;
  tom?: "secundario" | "marca";
  carregando?: boolean;
  erro?: string | null;
  tituloDoErro?: string;
  aoFecharErro?: () => void;
  aoEnviar?: (dados: { nome: string; email: string; cpf: string; senha: string; aceitouTermos: true }) => void;
  rodape?: string | false;
  paginaInteira?: boolean;
}

export const digitosCpf = (v: string) => String(v || "").replace(/\D/g, "").slice(0, 11);

export function formatarCpf(v: string): string {
  return digitosCpf(v)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function cpfValido(v: string): boolean {
  const d = digitosCpf(v);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(d[i]) * (t + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(d[t])) return false;
  }
  return true;
}

export type NivelSenha = { pontos: number; rotulo: string; tom: "danger" | "warning" | "royal" | "success" };

export function forcaDaSenha(senha: string): NivelSenha {
  if (!senha) return { pontos: 0, rotulo: "", tom: "danger" };
  let n = 0;
  if (senha.length >= 8) n++;
  if (senha.length >= 12) n++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) n++;
  if (/\d/.test(senha)) n++;
  if (/[^A-Za-z0-9]/.test(senha)) n++;
  if (senha.length < 8) return { pontos: 15, rotulo: "Muito curta", tom: "danger" };
  if (n <= 2) return { pontos: 40, rotulo: "Fraca", tom: "warning" };
  if (n === 3) return { pontos: 70, rotulo: "Boa", tom: "royal" };
  return { pontos: 100, rotulo: "Forte", tom: "success" };
}

interface Valores { nome: string; email: string; cpf: string; senha: string; confirmar: string }
type Erros = Partial<Record<keyof Valores | "termos", string>>;

export function validarCadastro(v: Valores, aceitou: boolean, comCpf = true): Erros {
  const o: Erros = {};
  if (!v.nome.trim()) o.nome = "Informe seu nome completo.";
  else if (v.nome.trim().split(/\s+/).length < 2) o.nome = "Informe nome e sobrenome.";
  const e = validarEntrada(v.email, "x").email;
  if (e) o.email = e;
  if (comCpf) {
    if (!digitosCpf(v.cpf)) o.cpf = "Informe seu CPF.";
    else if (!cpfValido(v.cpf)) o.cpf = "CPF inválido. Confira os 11 dígitos.";
  }
  if (!v.senha) o.senha = "Crie uma senha.";
  else if (v.senha.length < 8) o.senha = "Use pelo menos 8 caracteres.";
  if (!v.confirmar) o.confirmar = "Repita a senha.";
  else if (v.confirmar !== v.senha) o.confirmar = "As senhas não coincidem.";
  if (!aceitou) o.termos = "Aceite os Termos de Uso e a Política de Privacidade para continuar.";
  return o;
}

const NOMES_DOS_CAMPOS: Record<string, string> = { nome: "name", email: "email", cpf: "cpf", senha: "new-password", confirmar: "confirm-password" };
const ORDEM: (keyof Valores | "termos")[] = ["nome", "email", "cpf", "senha", "confirmar", "termos"];

const Obrigatorio = ({ children }: { children: string }) => (
  <>
    {children} <span className="neu-signin__req" aria-hidden="true">*</span>
  </>
);

export function TelaCadastro({
  logo, nomeDaMarca = "Sua marca", titulo = "Criar conta", subtitulo = "Preencha os campos abaixo para criar sua conta no sistema.",
  rotuloNome = "Nome completo", placeholderNome = "Maria da Silva", rotuloEmail = "E-mail", placeholderEmail = "nome@empresa.com.br",
  cpf: comCpf = true, termos, privacidade, entrar, rotuloEnviar = "Criar conta", rotuloCarregando = "Criando conta…", tom = "secundario",
  carregando = false, erro, tituloDoErro = "Não foi possível criar a conta", aoFecharErro, aoEnviar, rodape, paginaInteira = true,
}: TelaCadastroProps) {
  const uid = useId();
  const formulario = useRef<HTMLFormElement>(null);
  const tentou = useRef(false);
  const [v, setV] = useState<Valores>({ nome: "", email: "", cpf: "", senha: "", confirmar: "" });
  const [aceitou, setAceitou] = useState(false);
  const [erros, setErros] = useState<Erros>({});

  const linkTermos = { label: "Termos de Uso", ...(termos ?? {}) };
  const linkPrivacidade = { label: "Política de Privacidade", ...(privacidade ?? {}) };
  const linkEntrar = entrar === false ? null : { prompt: "Já tem uma conta?", label: "Entrar", ...(entrar ?? {}) };
  const forca = forcaDaSenha(v.senha);
  const tituloId = `${uid}-titulo`;
  const termosId = `${uid}-termos`;

  const mudar = (k: keyof Valores, valor: string) => {
    const n = { ...v, [k]: valor };
    setV(n);
    if (tentou.current) setErros(validarCadastro(n, aceitou, comCpf));
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    tentou.current = true;
    const o = validarCadastro(v, aceitou, comCpf);
    setErros(o);
    const primeiro = ORDEM.find((k) => o[k]);
    if (primeiro) {
      const alvo = primeiro === "termos" ? document.getElementById(`${uid}-aceite`) : (formulario.current?.elements.namedItem(NOMES_DOS_CAMPOS[primeiro]) as HTMLElement | null);
      alvo?.focus();
      return;
    }
    aoEnviar?.({ nome: v.nome.trim(), email: v.email.trim(), cpf: digitosCpf(v.cpf), senha: v.senha, aceitouTermos: true });
  };

  const Raiz = paginaInteira ? "main" : "section";
  return (
    <Raiz className={juntar("neu-signin", "neu-signup", !paginaInteira && "neu-signin--inline")} aria-labelledby={tituloId}>
      <div className="neu-signin__col">
        <div className="neu-signin__brand">
          {logo ?? <Marca />}
          {!logo && <span className="neu-signin__brandname">{nomeDaMarca}</span>}
        </div>
        <h2 className="neu-signin__title" id={tituloId}>{titulo}</h2>
        <p className="neu-signin__sub">{subtitulo}</p>
        <form ref={formulario} className="neu-signin__card" noValidate onSubmit={enviar} aria-describedby={erro ? `${uid}-erro` : undefined}>
          {erro && (
            <div id={`${uid}-erro`}>
              <Aviso tipo="danger" titulo={tituloDoErro} aoFechar={aoFecharErro}>{erro}</Aviso>
            </div>
          )}
          <CampoTexto label={<Obrigatorio>{rotuloNome}</Obrigatorio>} icone={<Icone name="user" size={16} />} name="name" autoComplete="name" autoCapitalize="words" required placeholder={placeholderNome} value={v.nome} error={erros.nome} onChange={(e) => mudar("nome", e.target.value)} />
          <CampoTexto label={<Obrigatorio>{rotuloEmail}</Obrigatorio>} type="email" icone={<Icone name="at-sign" size={16} />} name="email" autoComplete="email" inputMode="email" required placeholder={placeholderEmail} value={v.email} error={erros.email} onChange={(e) => mudar("email", e.target.value)} />
          {comCpf && (
            <CampoTexto label={<Obrigatorio>CPF</Obrigatorio>} icone={<Icone name="id-card" size={16} />} name="cpf" inputMode="numeric" autoComplete="off" required maxLength={14} placeholder="000.000.000-00" value={v.cpf} error={erros.cpf} onChange={(e) => mudar("cpf", formatarCpf(e.target.value))} />
          )}
          <div className="neu-signup__pair">
            <CampoTexto label={<Obrigatorio>Senha</Obrigatorio>} type="password" icone={<Icone name="lock" size={16} />} name="new-password" autoComplete="new-password" revealable required placeholder="Mín. 8 caracteres" value={v.senha} error={erros.senha} onChange={(e) => mudar("senha", e.target.value)} />
            <CampoTexto label={<Obrigatorio>Confirmar senha</Obrigatorio>} type="password" icone={<Icone name="lock" size={16} />} name="confirm-password" autoComplete="new-password" revealable required placeholder="Repita a senha" value={v.confirmar} error={erros.confirmar} onChange={(e) => mudar("confirmar", e.target.value)} />
          </div>
          {v.senha && (
            <div className="neu-signup__strength" aria-live="polite">
              <Progresso fino valor={forca.pontos} tom={forca.tom} rotulo="Força da senha" />
              <span className={`neu-signup__strength-label neu-signup__strength-label--${forca.tom}`}>
                Força da senha: <b>{forca.rotulo}</b>
              </span>
            </div>
          )}
          <div className={juntar("neu-signup__terms", erros.termos && "neu-signup__terms--error")}>
            <div className="neu-check">
              <Checkbox
                id={`${uid}-aceite`}
                className={tom === "marca" ? undefined : "neu-check--secundaria"}
                checked={aceitou}
                required
                aria-labelledby={termosId}
                aria-describedby={erros.termos ? `${uid}-termos-erro` : undefined}
                aria-invalid={erros.termos ? true : undefined}
                onCheckedChange={(c) => {
                  const marcado = c === true;
                  setAceitou(marcado);
                  if (tentou.current) setErros(validarCadastro(v, marcado, comCpf));
                }}
              />
            </div>
            <div>
              <p className="neu-signup__terms-text" id={termosId}>
                Eu concordo com os <Auxiliar cfg={linkTermos} classe="neu-signin__link neu-signin__link--royal" /> e a <Auxiliar cfg={linkPrivacidade} classe="neu-signin__link neu-signin__link--royal" />.
              </p>
              {erros.termos && <p className="neu-error-text" role="alert" id={`${uid}-termos-erro`}>{erros.termos}</p>}
            </div>
          </div>
          <Button type="submit" variant={tom === "marca" ? "default" : "secondary"} size="lg" className="neu-signin__submit" disabled={carregando} aria-busy={carregando || undefined}>
            {carregando && <Icone name="loader-2" size={16} spin />}
            {carregando ? rotuloCarregando : rotuloEnviar}
          </Button>
          {linkEntrar && (
            <p className="neu-signin__alt">
              {linkEntrar.prompt} <Auxiliar cfg={linkEntrar} classe="neu-signin__link neu-signin__link--accent" />
            </p>
          )}
        </form>
        {rodape !== false && <p className="neu-signin__foot">{rodape ?? `© ${new Date().getFullYear()} ${nomeDaMarca}`}</p>}
      </div>
    </Raiz>
  );
}

export function ExemploCadastro() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const aoEnviar = () => {
    setErro(null);
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setErro("Já existe uma conta com este e-mail ou CPF. Entre com ela ou recupere a senha.");
    }, 1200);
  };
  return (
    <div className="neu-signin-demo">
      <TelaCadastro
        paginaInteira={false}
        logo={<img src={brandCor} alt="__BRAND_NAME__" />}
        termos={{ onClick: () => {} }}
        privacidade={{ onClick: () => {} }}
        entrar={{ onClick: () => {} }}
        rodape="© 2026 __BRAND_NAME__"
        carregando={carregando}
        erro={erro}
        aoEnviar={aoEnviar}
        aoFecharErro={() => setErro(null)}
      />
      <p className="neu-help neu-signin-demo__nota">Demonstração sem servidor: envie vazio para ver a validação (o CPF confere os dígitos; teste 529.982.247-25). Com tudo válido, o envio mostra o carregamento e depois o estado de erro.</p>
    </div>
  );
}
