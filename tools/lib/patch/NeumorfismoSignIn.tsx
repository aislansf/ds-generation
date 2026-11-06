import { useId, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icone } from "@/components/estilo/NeumorfismoIcones";
import { CampoTexto } from "@/components/estilo/NeumorfismoCampos";
import { Aviso } from "@/components/estilo/NeumorfismoAlertas";
import { brandCor } from "@/assets/brand";
import fotoExemplo from "@/assets/brand-empreendedora.jpg";

/**
 * Tela de entrada (template SignIn do pacote Neumorphic UI v3.2.0), montada com o campo de texto, o checkbox, o botão e o
 * aviso do estilo: a marca, o título e o subtítulo, e um painel convexo com "E-mail" (ícone de arroba) e "Senha" (cadeado e
 * a tecla de mostrar), a linha "Manter conectado" e "Esqueceu a senha?", o botão "Entrar" de largura total e "Novo por
 * aqui? Criar uma conta". Campos obrigatórios levam um asterisco na cor da marca (escondido dos leitores de tela).
 *  - layout "centrado" (padrão): uma coluna de 420px; `layout="cartao"` divide em duas colunas, com o formulário plano de um
 *    lado e um painel visual do outro (`imagem` com foto sob um véu escuro, ou, sem foto, uma ilustração neumórfica com
 *    esferas e três peças de vidro) e uma `legenda` na base do painel. `ladoDaImagem="esquerda"` troca as colunas. Os
 *    pontos de quebra seguem o espaço do template (consultas de contêiner): abaixo de 860px o respiro diminui e abaixo
 *    de 600px o painel visual some.
 *  - Validação: ao enviar e, depois, a cada tecla. E-mail vazio ou malformado e senha vazia mostram o erro do campo, e o
 *    foco vai ao primeiro inválido. `aoEnviar({ email, senha, lembrar })` só dispara com os dois válidos. Enquanto
 *    `carregando`, o botão mostra o carregamento e "Entrando…" e fica desativado.
 *  - Falha do servidor vai em `erro`: um Aviso de perigo no alto do painel, ligado ao formulário; `aoFecharErro` põe o
 *    ✕. Escreva uma mensagem genérica ("E-mail ou senha incorretos") para não revelar qual campo errou.
 *  - Preenchimento automático: autoComplete "username" e "current-password" e inputMode de e-mail.
 * `TelaEntrar` não define a marca: passe a sua em `logo` (imagem ou SVG de até 86px). As vitrines `ExemploEntrar` e
 * `ExemploEntrarCartao` entram nos modelos de login da TemplatesPage e só são usadas quando ESTILO.id === "neumorfismo".
 * As classes neu-signin* vêm de src/styles/estilo.css.
 */

export interface LinkAuxiliar {
  prompt?: string;
  label?: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface TelaEntrarProps {
  logo?: ReactNode;
  nomeDaMarca?: string;
  titulo?: string;
  subtitulo?: string;
  rotuloEmail?: string;
  placeholderEmail?: string;
  emailInicial?: string;
  rotuloSenha?: string;
  /** false esconde "Manter conectado" */
  lembravel?: boolean;
  rotuloLembrar?: string;
  lembrarInicial?: boolean;
  /** false esconde o link */
  esqueci?: LinkAuxiliar | false;
  /** false esconde a chamada de cadastro */
  cadastro?: LinkAuxiliar | false;
  rotuloEnviar?: string;
  rotuloCarregando?: string;
  /** "secundario" (padrão): botão na segunda cor da marca; "marca": na cor principal */
  tom?: "secundario" | "marca";
  carregando?: boolean;
  erro?: string | null;
  tituloDoErro?: string;
  aoFecharErro?: () => void;
  aoEnviar?: (dados: { email: string; senha: string; lembrar: boolean }) => void;
  /** Texto do rodapé; false esconde */
  rodape?: string | false;
  /** false tira a altura de 100vh, para embutir */
  paginaInteira?: boolean;
  layout?: "centrado" | "cartao";
  imagem?: { src: string; alt?: string };
  legenda?: { titulo?: string; texto?: string };
  ladoDaImagem?: "direita" | "esquerda";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarEntrada(email: string, senha: string): { email?: string; senha?: string } {
  const o: { email?: string; senha?: string } = {};
  if (!email.trim()) o.email = "Informe seu e-mail.";
  else if (!EMAIL.test(email.trim())) o.email = "Informe um e-mail válido, como nome@empresa.com.br.";
  if (!senha) o.senha = "Informe sua senha.";
  return o;
}

export const juntar = (...partes: (string | false | undefined)[]) => partes.filter(Boolean).join(" ");

export function Marca({ pequena = false }: { pequena?: boolean }) {
  return (
    <span className={juntar("neu-signin__mark", pequena && "neu-signin__mark--sm")} aria-hidden="true">
      <svg width={pequena ? 24 : 32} height={pequena ? 24 : 32} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity="0.3" />
      </svg>
    </span>
  );
}

export function Auxiliar({ cfg, classe, filhos }: { cfg: LinkAuxiliar; classe: string; /** Conteúdo próprio no lugar do rótulo, como um ícone e o texto */ filhos?: ReactNode }) {
  return (
    <a
      className={classe}
      href={cfg.href ?? "#"}
      onClick={(e) => {
        if (!cfg.href) e.preventDefault();
        cfg.onClick?.(e);
      }}
    >
      {filhos ?? cfg.label}
    </a>
  );
}

export function TelaEntrar({
  logo, nomeDaMarca = "Sua marca", titulo = "Bem-vindo", subtitulo = "Informe seu e-mail e senha para acessar o sistema.",
  rotuloEmail = "E-mail", placeholderEmail = "nome@empresa.com.br", emailInicial = "", rotuloSenha = "Senha",
  lembravel = true, rotuloLembrar = "Manter conectado", lembrarInicial = false, esqueci, cadastro,
  rotuloEnviar = "Entrar", rotuloCarregando = "Entrando…", tom = "secundario", carregando = false, erro, tituloDoErro = "Não foi possível entrar",
  aoFecharErro, aoEnviar, rodape, paginaInteira = true, layout = "centrado", imagem, legenda, ladoDaImagem = "direita",
}: TelaEntrarProps) {
  const uid = useId();
  const formulario = useRef<HTMLFormElement>(null);
  const tentou = useRef(false);
  const [email, setEmail] = useState(emailInicial);
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(lembrarInicial);
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});

  const linkEsqueci = esqueci === false ? null : { label: "Esqueceu a senha?", ...(esqueci ?? {}) };
  const linkCadastro = cadastro === false ? null : { prompt: "Novo por aqui?", label: "Criar uma conta", ...(cadastro ?? {}) };
  const tituloId = `${uid}-titulo`;
  const cartao = layout === "cartao";

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    tentou.current = true;
    const o = validarEntrada(email, senha);
    setErros(o);
    const campo = o.email ? "email" : o.senha ? "senha" : null;
    if (campo) {
      (formulario.current?.elements.namedItem(campo) as HTMLElement | null)?.focus();
      return;
    }
    aoEnviar?.({ email: email.trim(), senha, lembrar });
  };

  const coluna = (
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
        <CampoTexto
          label={<>{rotuloEmail} <span className="neu-signin__req" aria-hidden="true">*</span></>}
          type="email" name="email" icone={<Icone name="at-sign" size={16} />} autoComplete="username" inputMode="email" required
          placeholder={placeholderEmail} value={email} error={erros.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (tentou.current) setErros({ ...erros, email: validarEntrada(e.target.value, senha).email });
          }}
        />
        <CampoTexto
          label={<>{rotuloSenha} <span className="neu-signin__req" aria-hidden="true">*</span></>}
          type="password" name="senha" icone={<Icone name="lock" size={16} />} autoComplete="current-password" revealable required
          placeholder="••••••••" value={senha} error={erros.senha}
          onChange={(e) => {
            setSenha(e.target.value);
            if (tentou.current) setErros({ ...erros, senha: validarEntrada(email, e.target.value).senha });
          }}
        />
        <div className="neu-signin__row">
          {lembravel ? (
            <div className="neu-check">
              <Checkbox id={`${uid}-lembrar`} className={tom === "marca" ? undefined : "neu-check--secundaria"} checked={lembrar} onCheckedChange={(v) => setLembrar(v === true)} />
              <label htmlFor={`${uid}-lembrar`} className="neu-check__texto">
                <span className="neu-check__title">{rotuloLembrar}</span>
              </label>
            </div>
          ) : (
            <span />
          )}
          {linkEsqueci && <Auxiliar cfg={linkEsqueci} classe="neu-signin__link neu-signin__link--royal" />}
        </div>
        <Button type="submit" variant={tom === "marca" ? "default" : "secondary"} size="lg" className="neu-signin__submit" disabled={carregando} aria-busy={carregando || undefined}>
          {carregando && <Icone name="loader-2" size={16} spin />}
          {carregando ? rotuloCarregando : rotuloEnviar}
        </Button>
        {linkCadastro && (
          <p className="neu-signin__alt">
            {linkCadastro.prompt} <Auxiliar cfg={linkCadastro} classe="neu-signin__link neu-signin__link--accent" />
          </p>
        )}
      </form>
      {rodape !== false && <p className="neu-signin__foot">{rodape ?? `© ${new Date().getFullYear()} ${nomeDaMarca}`}</p>}
    </div>
  );

  const lateral = cartao && (
    <aside className={juntar("neu-signin__visual", imagem && "neu-signin__visual--photo")}>
      {imagem ? (
        <img className="neu-signin__photo" src={imagem.src} alt={imagem.alt ?? ""} onError={(e) => { e.currentTarget.style.display = "none"; }} />
      ) : (
        <div className="neu-signin__art" aria-hidden="true">
          <span className="neu-signin__orb neu-signin__orb--a" />
          <span className="neu-signin__orb neu-signin__orb--b" />
          <span className="neu-signin__tile neu-signin__tile--a"><Icone name="bar-chart" size={22} /></span>
          <span className="neu-signin__tile neu-signin__tile--b"><Icone name="users" size={22} /></span>
          <span className="neu-signin__tile neu-signin__tile--c"><Icone name="trending-up" size={22} /></span>
        </div>
      )}
      <div className="neu-signin__veil" aria-hidden="true" />
      {(legenda?.titulo || legenda?.texto) && (
        <div className="neu-signin__caption">
          {legenda.titulo && <strong>{legenda.titulo}</strong>}
          {legenda.texto && <span>{legenda.texto}</span>}
        </div>
      )}
    </aside>
  );

  const Raiz = paginaInteira ? "main" : "section";
  return (
    <Raiz className={juntar("neu-signin", cartao && "neu-signin--card", !paginaInteira && "neu-signin--inline")} aria-labelledby={tituloId}>
      {cartao ? <div className={juntar("neu-signin__split", ladoDaImagem === "esquerda" && "neu-signin__split--left")}>{coluna}{lateral}</div> : coluna}
    </Raiz>
  );
}

/** Demonstração sem servidor: vazio mostra a validação; preenchido, o envio carrega e depois mostra o erro. */
function useSimulacao() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const aoEnviar = () => {
    setErro(null);
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setErro("E-mail ou senha incorretos. Verifique os dados e tente novamente.");
    }, 1200);
  };
  return { carregando, erro, aoEnviar, aoFecharErro: () => setErro(null) };
}

export function ExemploEntrar() {
  const sim = useSimulacao();
  return (
    <div className="neu-signin-demo">
      <TelaEntrar
        paginaInteira={false}
        logo={<img src={brandCor} alt="__BRAND_NAME__" />}
        esqueci={{ onClick: () => {} }}
        cadastro={{ onClick: () => {} }}
        rodape="© 2026 __BRAND_NAME__"
        {...sim}
      />
      <p className="neu-help neu-signin-demo__nota">Demonstração sem servidor: envie vazio para ver a validação; com os campos preenchidos, o envio mostra o carregamento e depois o estado de erro.</p>
    </div>
  );
}

export function ExemploEntrarCartao() {
  const sim = useSimulacao();
  return (
    <div className="neu-signin-demo neu-signin-demo--cartao">
      <TelaEntrar
        layout="cartao"
        paginaInteira={false}
        logo={<img src={brandCor} alt="__BRAND_NAME__" />}
        titulo="Bem-vindo ao sistema"
        subtitulo="Informe seu e-mail e senha para continuar."
        placeholderEmail="admin@exemplo.com"
        rotuloLembrar="Lembrar de mim"
        cadastro={{ prompt: "Novo aqui?", onClick: () => {} }}
        esqueci={{ onClick: () => {} }}
        imagem={{ src: fotoExemplo, alt: "Empreendedora sorrindo enquanto registra um pedido no celular, cercada de caixas de envio" }}
        legenda={{ titulo: "Impulsione os pequenos negócios da sua rede", texto: "Acompanhe programas, atendimentos e resultados em um só lugar, com dados atualizados para decidir mais rápido." }}
        rodape="© 2026 __BRAND_NAME__"
        {...sim}
      />
    </div>
  );
}
