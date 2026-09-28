import { PageHeader, SectionHeader } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";
import { Download, FileText } from "lucide-react";
import brandCorAsset from "@/assets/marca/brand-cor.svg.asset.json";
import brandBlackAsset from "@/assets/marca/brand-black.svg.asset.json";
import brandWhiteAsset from "@/assets/marca/brand-white.svg.asset.json";

const LOGO_COR = brandCorAsset.url;
const LOGO_BLACK = brandBlackAsset.url;
const LOGO_WHITE = brandWhiteAsset.url;
const BRAND_PRIMARY = "#2A4FDA";

const MANUAL_PDF_URL =
  "__BRAND_MANUAL_URL__";

const downloads = [
  { label: "Logo __BRAND_SHORT__ · Cor (SVG)", url: LOGO_COR, file: "brand-cor.svg" },
  { label: "Logo __BRAND_SHORT__ · Preto (SVG)", url: LOGO_BLACK, file: "brand-black.svg" },
  { label: "Logo __BRAND_SHORT__ · Branco (SVG)", url: LOGO_WHITE, file: "brand-white.svg" },
];

function LogoFrame({
  src,
  alt,
  bg = "bg-white",
  className = "",
  imgClassName = "h-20",
}: {
  src: string;
  alt: string;
  bg?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={`border border-border rounded-lg overflow-hidden ${bg} flex items-center justify-center p-6 ${className}`}
    >
      <img src={src} alt={alt} loading="lazy" className={`w-auto ${imgClassName} object-contain`} />
    </div>
  );
}

const reducaoRows = [
  { tipo: "Logotipo simples (apenas \"__BRAND_SHORT__\")", impressao: "10 mm", digital: "50 px" },
  { tipo: "Composta com descritivo", impressao: "12 mm", digital: "65 px" },
  { tipo: "Composta horizontal estendida", impressao: "18 mm", digital: "96 px" },
];

const tresJeitos = [
  {
    n: 1,
    title: "Logotipo solto",
    desc: "Aplicação direta sobre fundos (azul ou branco) que tenham contraste suficiente com o logotipo.",
  },
  {
    n: 2,
    title: "Logotipo protegido",
    desc: "Sobre um bloco azul __BRAND_SHORT__ quando o fundo original (cor chapada ou fotográfico) não oferece contraste.",
  },
  {
    n: 3,
    title: "Janela aberta __BRAND_SHORT__",
    desc: "Exclusiva para iniciativas, ações e eventos promovidos pelo __BRAND_SHORT__. Representa o espaço aberto e a troca.",
  },
];

const janelaRegras = [
  "Proporção livre em relação ao logotipo, mas nunca opticamente menor que ele.",
  "Margem de segurança externa do logotipo deve ser respeitada — a janela não possui margem própria.",
  "Formato sempre segue a inclinação do logotipo.",
  "Sempre vazada, com contorno na cor do logotipo. Só pode ser aplicada sobre fundos com contraste.",
];

const compartilhadasRegras = [
  "Hierarquia marcada apenas pela posição, sem diferença de tamanho entre as marcas.",
  "Governo Federal é sempre o primeiro na hierarquia, mesmo quando o __BRAND_SHORT__ é o promotor.",
  "Em parcerias 50/50 com outras empresas, ocupa a primeira posição quem produzir o material.",
  "Materiais formais (editais, documentos, relatórios): usar versão composta de ambas as marcas.",
  "Materiais de comunicação (redes sociais, anúncios): usar versão simples de ambas as marcas.",
];

const usosIndevidosRegras = [
  "Não mudar a cor do logotipo.",
  "Não distorcer as proporções.",
  "Não rotacionar.",
  "Não eliminar nenhum elemento.",
  "Não modificar nenhum elemento.",
];

export default function MarcaPage() {
  return (
    <div>
      <SEO
        title="Marca __BRAND_SHORT__ — Design System __BRAND_SHORT__"
        description="Diretrizes oficiais da marca __BRAND_SHORT__: assinaturas, área de proteção, redução mínima, usos corretos e indevidos, conforme o Manual da Marca __BRAND_SHORT__."
        path="/marca"
      />
      <PageHeader
        badge="Manual da Marca __BRAND_SHORT__ · Set/2024"
        title="Marca __BRAND_SHORT__"
        description="Diretrizes oficiais de uso do logotipo __BRAND_SHORT__ — versões, área de proteção, redução máxima, jeitos de assinar, parcerias e usos indevidos. Baseado no Manual da Marca __BRAND_SHORT__ (Setembro 2024)."
      />

      {/* 1. Assinatura simples */}
      <SectionHeader
        id="assinatura-simples"
        badge="Logo solto"
        title="Assinatura simples"
        description="Pode me chamar de __BRAND_SHORT__! Versão usada na comunicação direta com o público — redes sociais, anúncios direcionados e publicações internas. Cria proximidade e cumplicidade."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <LogoFrame src={LOGO_COR} alt="Logotipo __BRAND_SHORT__ em azul." imgClassName="h-32" />
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Tipografia</p>
              <p className="font-medium">Univers Extra Bold Italic</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cor</p>
              <p className="font-medium">Azul __BRAND_SHORT__ · Pantone 2935 C · #2A4FDA</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A tipografia, as proporções e o posicionamento dos elementos nunca devem ser alterados. Use sempre os arquivos fechados com as fontes em curvas.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Assinaturas compostas */}
      <SectionHeader
        id="assinaturas-compostas"
        badge="Formal"
        title="Assinaturas compostas"
        description="Para palestras, artigos e publicações científicas, eventos corporativos e apresentações para investidores. Três diagramações disponíveis — escolha a que melhor se encaixa nas proporções do layout."
      />
      <div className="brand-card mb-8">
        <div className="space-y-3">
            {[
              { n: 1, label: "Versão 1", desc: "Ideal para formatos quadrados ou verticais." },
              { n: 2, label: "Versão 2", desc: "Ideal para formatos horizontais." },
              { n: 3, label: "Versão 3", desc: "Ideal para formatos muito horizontais ou com limite de altura." },
            ].map((v) => (
              <div key={v.n} className="rounded-lg border border-border bg-muted/30 p-3 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-card-icon text-card-icon-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {v.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{v.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Disponível também em <strong>Inglês</strong> e <strong>Espanhol</strong> para aplicações internacionais.
            </p>
        </div>
      </div>

      {/* 3. Versões alternativas */}
      <SectionHeader
        id="versoes-alternativas"
        badge="Positivo / Negativo"
        title="Versões alternativas"
        description="Todas as assinaturas possuem versões em positivo (azul/preto) e negativo (branco) para diferentes contextos de aplicação."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <LogoFrame src={LOGO_COR} alt="Logo __BRAND_SHORT__ em azul (positivo)." imgClassName="h-16" />
            <p className="text-xs font-semibold text-foreground">Positivo · Cor</p>
            <p className="text-xs text-muted-foreground">Versão padrão sobre fundos claros.</p>
          </div>
          <div className="space-y-2">
            <div
              className="border border-border rounded-lg overflow-hidden flex items-center justify-center p-6"
              style={{ backgroundColor: BRAND_PRIMARY }}
            >
              <img src={LOGO_WHITE} alt="Logo __BRAND_SHORT__ em branco (negativo)." className="h-16 w-auto object-contain" />
            </div>
            <p className="text-xs font-semibold text-foreground">Negativo · Branco</p>
            <p className="text-xs text-muted-foreground">Sobre o azul institucional ou fundos escuros.</p>
          </div>
          <div className="space-y-2">
            <LogoFrame src={LOGO_BLACK} alt="Logo __BRAND_SHORT__ em preto (uso restrito)." imgClassName="h-16" />
            <p className="text-xs font-semibold text-foreground">Restrita · Preto</p>
            <p className="text-xs text-muted-foreground">Apenas para impressões com limitação técnica.</p>
          </div>
        </div>
        <div className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Positivo</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Versão padrão em azul __BRAND_SHORT__. A variação em preto é restrita a usos com limitação de impressão.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Negativo</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aplicada sobre o azul institucional ou como alternativa em fundos coloridos que não tenham contraste com a versão em azul.
              </p>
            </div>
        </div>
      </div>

      {/* 4. Área de proteção */}
      <SectionHeader
        id="area-protecao"
        badge="Margem de segurança"
        title="Área de Proteção"
        description="Área ao redor do logotipo que nenhum outro elemento pode invadir. Garante integridade e boa percepção em qualquer circunstância."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="border border-border rounded-lg bg-white p-8 flex items-center justify-center">
            <div className="relative inline-block border-2 border-dashed border-primary/60 p-8">
              <img src={LOGO_COR} alt="Logotipo __BRAND_SHORT__ com marcação da área de proteção." className="h-24 w-auto" />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] font-bold uppercase tracking-wider text-primary">X</span>
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 bg-background px-2 text-[10px] font-bold uppercase tracking-wider text-primary">X</span>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Regra</p>
              <p className="font-heading text-2xl font-bold text-foreground mb-2">X = altura da letra S</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Crie um retângulo tangenciando todos os pontos extremos do logotipo. Em seguida, use a altura da letra S como referência para definir a área de proteção.
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vale para <strong>todas as versões</strong> de assinatura (simples e composta). Os arquivos fechados já trazem a margem definida.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Redução máxima */}
      <SectionHeader
        id="reducao-maxima"
        badge="Tamanho mínimo"
        title="Redução Máxima"
        description="Tamanhos mínimos para garantir legibilidade em impressão e ambiente digital (referência: 72 dpi)."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-6">
          <div className="border border-border rounded-lg bg-white p-6 flex items-end justify-around gap-4">
            <div className="flex flex-col items-center gap-2">
              <img src={LOGO_COR} alt="" className="h-24 w-auto" />
              <span className="text-[10px] text-muted-foreground">96 px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={LOGO_COR} alt="" className="h-16 w-auto" />
              <span className="text-[10px] text-muted-foreground">65 px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={LOGO_COR} alt="" className="h-12 w-auto" />
              <span className="text-[10px] text-muted-foreground">50 px</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-3 py-2 font-semibold">Versão</th>
                  <th className="px-3 py-2 font-semibold">Impressão</th>
                  <th className="px-3 py-2 font-semibold">Digital</th>
                </tr>
              </thead>
              <tbody className="bg-background">
                {reducaoRows.map((r) => (
                  <tr key={r.tipo} className="border-t border-border">
                    <td className="px-3 py-2 text-xs">{r.tipo}</td>
                    <td className="px-3 py-2 font-semibold">{r.impressao}</td>
                    <td className="px-3 py-2 font-semibold">{r.digital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Redução extrema</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Exclusivamente para <strong>favicons e avatares</strong>, o logotipo é reduzido a duas barras horizontais posicionadas no centro de um quadrado.
          </p>
        </div>
      </div>

      {/* 6. Como assinamos */}
      <SectionHeader
        id="como-assinamos"
        badge="3 jeitos de assinar"
        title="Como Assinamos"
        description="Gostamos de estar juntos, influenciar, somar. A marca não tem regra pétrea para assinar materiais — a única regra é ter bom senso para garantir sua boa visibilidade."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <div className="border border-border rounded-lg bg-white p-6 flex items-center justify-center h-32">
              <img src={LOGO_COR} alt="Logotipo solto" className="h-12 w-auto" />
            </div>
            <p className="text-xs font-semibold mt-2">1 · Logotipo solto</p>
          </div>
          <div>
            <div className="rounded-lg p-6 flex items-center justify-center h-32" style={{ backgroundColor: BRAND_PRIMARY }}>
              <img src={LOGO_WHITE} alt="Logotipo protegido em bloco azul" className="h-12 w-auto" />
            </div>
            <p className="text-xs font-semibold mt-2">2 · Logotipo protegido</p>
          </div>
          <div>
            <div className="border-2 rounded-lg bg-white p-6 flex items-center justify-center h-32" style={{ borderColor: BRAND_PRIMARY }}>
              <img src={LOGO_COR} alt="Janela aberta __BRAND_SHORT__" className="h-12 w-auto" />
            </div>
            <p className="text-xs font-semibold mt-2">3 · Janela aberta</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-6">
            {tresJeitos.map((j) => (
              <div key={j.n} className="rounded-lg border border-border bg-muted/30 p-3 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-card-icon text-card-icon-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {j.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{j.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{j.desc}</p>
                </div>
              </div>
            ))}
        </div>

        <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Árvore de decisão</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Critérios para escolher o jeito certo de assinar.
        </p>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm overflow-x-auto mb-6">
          <pre className="font-mono text-xs leading-relaxed text-foreground whitespace-pre">{`Posição
├─ Esquerda
└─ Direita
    └─ Fundo
        ├─ Cor chapada
        └─ Fotográfico
            └─ Tem contraste?
                ├─ Sim  →  Logotipo solto
                └─ Não  →  Logotipo protegido`}</pre>
        </div>

        <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Regras da janela aberta</h4>
        <ul className="space-y-2 mb-6">
          {janelaRegras.map((r) => (
            <li key={r} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Vinheta</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Em vídeos, animações e aplicações digitais, as barras do logotipo se movimentam e formam grafismos. Na cena final, as barras devem <strong>sempre retornar</strong> à assinatura clássica do __BRAND_SHORT__.
          </p>
        </div>
      </div>

      {/* 7. Assinaturas compartilhadas */}
      <SectionHeader
        id="assinaturas-compartilhadas"
        badge="Parcerias"
        title="Assinaturas Compartilhadas"
        description="Caminhamos juntos, lado a lado, nos colocando sempre como parceiros e não como autoridade."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="border border-border rounded-lg bg-white p-6 flex items-center justify-center gap-6">
            <img src={LOGO_COR} alt="Logotipo __BRAND_SHORT__" className="h-12 w-auto" />
            <div className="w-px h-12 bg-border" />
            <div className="h-10 w-24 rounded bg-muted flex items-center justify-center text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Parceiro
            </div>
          </div>
          <ul className="space-y-2">
            {compartilhadasRegras.map((r) => (
              <li key={r} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 8. Usos indevidos */}
      <SectionHeader
        id="usos-indevidos"
        badge="Não faça"
        title="Usos Indevidos"
        description="Exemplos do que nunca fazer com a marca __BRAND_SHORT__."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {[
            { style: { filter: "hue-rotate(120deg) saturate(2)" }, label: "Não mudar a cor" },
            { style: { transform: "scaleX(1.6)" }, label: "Não distorcer" },
            { style: { transform: "rotate(-12deg)" }, label: "Não rotacionar" },
            { style: { opacity: 0.35 }, label: "Não desbotar" },
            { style: { filter: "drop-shadow(2px 4px 0 rgba(0,0,0,.5))" }, label: "Não aplicar efeitos" },
          ].map((u) => (
            <div key={u.label} className="space-y-2">
              <div className="relative border border-destructive/30 rounded-lg bg-white p-4 h-24 flex items-center justify-center overflow-hidden">
                <img src={LOGO_COR} alt="" className="h-8 w-auto" style={u.style} />
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold">✗</span>
              </div>
              <p className="text-[11px] text-center text-muted-foreground leading-tight">{u.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {usosIndevidosRegras.map((r, i) => (
              <div
                key={r}
                className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 flex gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="text-xs text-foreground leading-relaxed self-center">{r}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Manual oficial — download */}
      <SectionHeader
        id="manual-oficial"
        badge="Documento de referência"
        title="Downloads"
        description="Logotipos oficiais em SVG e o manual completo da marca __BRAND_SHORT__ (Setembro/2024)."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {downloads.map((d) => (
          <a
            key={d.file}
            href={d.url}
            download={d.file}
            target="_blank"
            rel="noreferrer"
            className="brand-card flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-card-icon text-card-icon-foreground flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{d.label}</p>
                <p className="text-xs text-muted-foreground truncate">{d.file}</p>
              </div>
            </div>
            <Download size={16} className="text-primary shrink-0" />
          </a>
        ))}
        <a
          href={MANUAL_PDF_URL}
          target="_blank"
          rel="noreferrer"
          className="brand-card flex items-center justify-between gap-3 hover:border-primary/40 transition-colors md:col-span-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Manual da Marca __BRAND_SHORT__ · Setembro 2024</p>
              <p className="text-xs text-muted-foreground">PDF oficial · __BRAND_SHORT__ Nacional</p>
            </div>
          </div>
          <Download size={16} className="text-primary shrink-0" />
        </a>
      </div>
    </div>
  );
}
