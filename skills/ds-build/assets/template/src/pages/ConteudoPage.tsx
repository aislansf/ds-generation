import { PageHeader, SectionHeader } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";

const principios = [
  { title: "Escaneabilidade", desc: "Pessoas escaneiam a tela em vez de ler. Use títulos, subtítulos, listas e destaques para guiar o olhar." },
  { title: "Pirâmide invertida", desc: "Comece pela informação mais importante. Detalhes e contexto vêm depois." },
  { title: "Clareza acima de tudo", desc: "Frases curtas, palavras simples, uma ideia por parágrafo. Se der para cortar, corte." },
  { title: "Voz ativa", desc: "Sujeito + verbo + complemento. Mais direto, mais humano e mais fácil de entender." },
  { title: "Foco no usuário", desc: "Fale com a pessoa (\"você\"), sobre o que ela precisa resolver, não sobre a instituição." },
  { title: "SEO com naturalidade", desc: "Use as palavras-chave que o público realmente busca, sem forçar repetições." },
];

const boasPraticas = [
  { title: "Título (H1)", good: "Como abrir seu MEI em 5 passos", bad: "Tudo o que você sempre quis saber sobre o processo de formalização!" },
  { title: "Subtítulos (H2/H3)", good: "Documentos necessários", bad: "Agora vamos falar sobre uma parte muito importante" },
  { title: "Parágrafos", good: "Até 3 ou 4 linhas, uma ideia por parágrafo.", bad: "Blocos longos misturando vários assuntos sem respiro visual." },
  { title: "Listas", good: "• CNPJ ativo\n• E-mail válido\n• Comprovante de endereço", bad: "Você precisa do CNPJ ativo, de um e-mail válido e também de um comprovante de endereço atualizado." },
  { title: "Links", good: "Baixe o edital completo", bad: "Clique aqui para baixar" },
  { title: "CTA (botão)", good: "Quero me inscrever", bad: "Enviar" },
  { title: "Mensagens de erro", good: "Informe um e-mail válido (ex: nome@email.com).", bad: "Erro! Campo inválido!" },
  { title: "Microcopy de formulário", good: "Nome completo", bad: "Por favor, digite aqui o seu nome completo conforme documento" },
];

const checklist = [
  "O título entrega o assunto em até 60 caracteres?",
  "O primeiro parágrafo responde o que, por que e para quem?",
  "Parágrafos têm no máximo 3–4 linhas?",
  "Usei subtítulos a cada bloco de ideia?",
  "Há listas, negritos ou destaques para escanear?",
  "Os links descrevem o destino (sem \"clique aqui\")?",
  "Os botões começam com verbo de ação?",
  "Removi jargões e siglas sem explicação?",
  "O texto funciona bem no celular (telas pequenas)?",
  "O conteúdo é acessível (contraste, alt em imagens, linguagem simples)?",
];

const evite = [
  { do: "Use voz ativa", dont: "Evite voz passiva" },
  { do: "Escreva números em algarismos (5, 10, 200)", dont: "Não escreva por extenso em listas e dados" },
  { do: "Uma ideia por frase", dont: "Não empilhe orações com vírgulas e \"que\"" },
  { do: "Padronize datas (DD/MM/AAAA)", dont: "Não misture formatos no mesmo texto" },
  { do: "Explique siglas na primeira menção", dont: "Não assuma que todos conhecem o termo" },
];

export default function ConteudoPage() {
  return (
    <div>
      <SEO
        title="Conteúdo e Webwriting — Design System __BRAND_SHORT__"
        description="Princípios de webwriting e tom de voz do __BRAND_NAME__: escaneabilidade, clareza, voz ativa e foco no usuário para conteúdos digitais."
        path="/conteudo"
      />
      <PageHeader
        badge="Webwriting"
        title="Webwriting"
        description="O webwriting é o conjunto de técnicas de escrita e formatação voltado para a internet. Ele adapta a redação tradicional ao comportamento de leitura online, que é mais dinâmico e disperso. O objetivo é garantir que o conteúdo seja facilmente encontrado pelos buscadores, compreendido rapidamente e prenda a atenção do usuário."
      />

      <SectionHeader id="principios" title="Princípios do Webwriting" description="Boas práticas sistêmicas que orientam toda escrita digital do __BRAND_NAME__." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {principios.map(p => (
          <div key={p.title} className="brand-card">
            <h4 className="font-semibold text-sm mb-1">{p.title}</h4>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <SectionHeader id="estrutura" title="Estrutura do Texto" description="Organize o conteúdo em pirâmide invertida: o essencial primeiro, o detalhe depois." />
      <div className="brand-card mb-8">
        <ol className="space-y-3 text-sm">
          <li><strong>1. Título (H1)</strong> — claro, com a palavra-chave principal e até 60 caracteres.</li>
          <li><strong>2. Lide / abertura</strong> — resume a notícia em 2–3 linhas: o que, quem, quando, onde, por quê.</li>
          <li><strong>3. Subtítulos (H2/H3)</strong> — quebram o texto em blocos escaneáveis.</li>
          <li><strong>4. Parágrafos curtos</strong> — uma ideia por parágrafo, 3 a 4 linhas no máximo.</li>
          <li><strong>5. Listas e destaques</strong> — bullets, negritos e tabelas para facilitar a leitura rápida.</li>
          <li><strong>6. CTA</strong> — finalize indicando o próximo passo (botão, link ou orientação).</li>
        </ol>
      </div>

      <SectionHeader id="boas-praticas" title="Boas Práticas de Escrita" description="Exemplos práticos para padronizar a escrita em produtos digitais." />
      <div className="space-y-4 mb-8">
        {boasPraticas.map(bp => (
          <div key={bp.title} className="brand-card">
            <h4 className="font-semibold text-sm mb-3">{bp.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-success-bg rounded-lg p-3">
                <p className="text-xs font-medium text-success mb-1">✓ Recomendado</p>
                <p className="text-sm whitespace-pre-line">{bp.good}</p>
              </div>
              <div className="bg-error-bg rounded-lg p-3">
                <p className="text-xs font-medium text-error mb-1">✗ Evite</p>
                <p className="text-sm whitespace-pre-line">{bp.bad}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader id="faca-evite" title="Faça / Evite" description="Regras rápidas para manter consistência em qualquer texto." />
      <div className="brand-card mb-8 overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-accent">
            <tr>
              <th className="text-left p-3 font-semibold text-success">✓ Faça</th>
              <th className="text-left p-3 font-semibold text-error">✗ Evite</th>
            </tr>
          </thead>
          <tbody>
            {evite.map((row, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{row.do}</td>
                <td className="p-3 text-muted-foreground">{row.dont}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader id="seo" title="SEO e Encontrabilidade" description="Escrever bem para a web também é ser encontrado pelos buscadores." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { t: "Palavra-chave no título", d: "Coloque o termo principal nos primeiros 60 caracteres do H1." },
          { t: "Meta descrição", d: "Resuma a página em 140–160 caracteres, com a palavra-chave principal." },
          { t: "URLs curtas", d: "/abrir-mei é melhor que /artigos/2024/05/como-abrir-mei-passo-a-passo." },
          { t: "Hierarquia de títulos", d: "Use H1 uma vez por página; H2 e H3 para subseções, em ordem." },
          { t: "Texto alternativo", d: "Toda imagem precisa de alt descrevendo o conteúdo, não \"imagem 01\"." },
          { t: "Links descritivos", d: "Prefira \"baixar edital\" a \"clique aqui\" — ajuda usuário e buscador." },
        ].map(item => (
          <div key={item.t} className="brand-card">
            <h4 className="font-semibold text-sm mb-1">{item.t}</h4>
            <p className="text-xs text-muted-foreground">{item.d}</p>
          </div>
        ))}
      </div>

      <SectionHeader id="checklist" title="Checklist antes de publicar" description="Revise rapidamente seu texto com estes critérios." />
      <div className="brand-card">
        <ul className="space-y-2 text-sm">
          {checklist.map(item => (
            <li key={item} className="flex gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
