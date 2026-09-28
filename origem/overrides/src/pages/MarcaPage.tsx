import { PageHeader, SectionHeader } from "@/components/DSComponents";
import { SEO } from "@/components/SEO";
import { Download, FileText, Info } from "lucide-react";
import brandCorAsset from "@/assets/marca/brand-cor.svg.asset.json";
import brandBlackAsset from "@/assets/marca/brand-black.svg.asset.json";
import brandWhiteAsset from "@/assets/marca/brand-white.svg.asset.json";

// MODELO: página de marca genérica do ds-build. Os valores abaixo são referências de mercado;
// substitua cada um pelas regras do manual da marca (briefing: conteudo.regras_de_marca) e apague os comentários MODELO.

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

// MODELO: tamanhos mínimos de referência. Use os do manual da marca.
const reducaoRows = [
  { tipo: "Logotipo completo", impressao: "15 mm", digital: "80 px" },
  { tipo: "Logotipo reduzido (sem descritivo)", impressao: "10 mm", digital: "50 px" },
  { tipo: "Símbolo isolado", impressao: "6 mm", digital: "24 px" },
];

const jeitosDeAplicar = [
  {
    n: 1,
    title: "Logotipo solto",
    desc: "Aplicação direta sobre fundos claros ou na cor primária, sempre com contraste suficiente com o logotipo.",
  },
  {
    n: 2,
    title: "Logotipo protegido",
    desc: "Sobre um bloco na cor primária quando o fundo original (cor chapada ou fotografia) não oferece contraste.",
  },
];

// MODELO: regras comuns de coassinatura. Confirme a hierarquia definida pela marca.
const compartilhadasRegras = [
  "Marcas lado a lado, com a mesma altura visual e separadas por um fio ou pela área de proteção.",
  "Em parcerias institucionais, a ordem segue o acordo entre as partes; na falta dele, quem produz o material vem primeiro.",
  "Materiais formais (editais, documentos, relatórios): usar a versão completa de todas as marcas.",
  "Materiais de comunicação (redes sociais, anúncios): usar a versão reduzida de todas as marcas.",
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
        description="Diretrizes de uso da marca __BRAND_SHORT__: versões do logotipo, área de proteção, redução mínima, aplicação sobre fundos, coassinaturas e usos indevidos."
        path="/marca"
      />
      <PageHeader
        badge="Diretrizes da marca"
        title="Marca __BRAND_SHORT__"
        description="Como usar o logotipo da marca __BRAND_SHORT__ em produtos digitais — versões, área de proteção, redução máxima, aplicação sobre fundos, parcerias e usos indevidos."
      />

      {/* MODELO: aviso visível até as regras do manual substituírem as referências desta página */}
      <div className="brand-card mb-8 flex gap-3 items-start border-primary/30 bg-primary/5">
        <Info size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Valores de referência. Medidas, área de proteção e regras de coassinatura devem seguir o manual oficial da marca __BRAND_SHORT__.
        </p>
      </div>

      {/* 1. Assinatura principal */}
      <SectionHeader
        id="assinatura-simples"
        badge="Logo principal"
        title="Assinatura principal"
        description="Versão usada na maior parte das aplicações digitais: cabeçalhos, telas de acesso, rodapés e materiais de comunicação."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <LogoFrame src={LOGO_COR} alt="Logotipo __BRAND_SHORT__ na cor primária." imgClassName="h-32" />
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Arquivos</p>
              <p className="font-medium">SVG oficial, com textos convertidos em curvas</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cor</p>
              <p className="font-medium">Primária · #2A4FDA</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A tipografia, as proporções e o posicionamento dos elementos nunca devem ser alterados. Use sempre os arquivos oficiais, sem redesenhar ou recompor o logotipo.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Versões alternativas */}
      <SectionHeader
        id="versoes-alternativas"
        badge="Positivo / Negativo"
        title="Versões alternativas"
        description="O logotipo tem versões em positivo (cor e preto) e negativo (branco) para diferentes contextos de aplicação."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <LogoFrame src={LOGO_COR} alt="Logo __BRAND_SHORT__ na cor primária (positivo)." imgClassName="h-16" />
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
            <p className="text-xs text-muted-foreground">Sobre a cor primária ou fundos escuros.</p>
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
                Versão padrão na cor primária. A variação em preto é restrita a usos com limitação de impressão.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Negativo</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aplicada sobre a cor primária ou como alternativa em fundos coloridos que não tenham contraste com a versão em cor.
              </p>
            </div>
        </div>
      </div>

      {/* 3. Área de proteção */}
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
              {/* MODELO: medida de referência. Use a do manual da marca. */}
              <p className="font-heading text-2xl font-bold text-foreground mb-2">X = altura do símbolo</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Crie um retângulo tangenciando todos os pontos extremos do logotipo. Em seguida, use a medida X como margem mínima em todos os lados.
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vale para <strong>todas as versões</strong> do logotipo. Os arquivos oficiais já trazem a margem definida.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Redução máxima */}
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
              <span className="text-[10px] text-muted-foreground">64 px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={LOGO_COR} alt="" className="h-12 w-auto" />
              <span className="text-[10px] text-muted-foreground">48 px</span>
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
            Em <strong>favicons e avatares</strong>, use apenas o símbolo, centralizado num quadrado com a área de proteção preservada.
          </p>
        </div>
      </div>

      {/* 5. Aplicação sobre fundos */}
      <SectionHeader
        id="como-assinamos"
        badge="Fundos"
        title="Aplicação sobre fundos"
        description="O logotipo precisa estar sempre legível. Escolha a forma de aplicação pelo contraste com o fundo."
      />
      <div className="brand-card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="border border-border rounded-lg bg-white p-6 flex items-center justify-center h-32">
              <img src={LOGO_COR} alt="Logotipo solto" className="h-12 w-auto" />
            </div>
            <p className="text-xs font-semibold mt-2">1 · Logotipo solto</p>
          </div>
          <div>
            <div className="rounded-lg p-6 flex items-center justify-center h-32" style={{ backgroundColor: BRAND_PRIMARY }}>
              <img src={LOGO_WHITE} alt="Logotipo protegido em bloco na cor primária" className="h-12 w-auto" />
            </div>
            <p className="text-xs font-semibold mt-2">2 · Logotipo protegido</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-6">
            {jeitosDeAplicar.map((j) => (
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
          Critérios para escolher a forma de aplicação.
        </p>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm overflow-x-auto mb-6">
          <pre className="font-mono text-xs leading-relaxed text-foreground whitespace-pre">{`Fundo
├─ Cor chapada
└─ Fotográfico
    └─ Tem contraste?
        ├─ Sim  →  Logotipo solto
        └─ Não  →  Logotipo protegido`}</pre>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Animação</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Em vídeos, animações e aplicações digitais, o logotipo pode entrar com movimento, mas a cena final sempre mostra a <strong>assinatura completa e estática</strong>.
          </p>
        </div>
      </div>

      {/* 6. Assinaturas compartilhadas */}
      <SectionHeader
        id="assinaturas-compartilhadas"
        badge="Parcerias"
        title="Assinaturas Compartilhadas"
        description="Como aplicar o logotipo ao lado de marcas parceiras sem que uma se sobreponha à outra."
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

      {/* 7. Usos indevidos */}
      <SectionHeader
        id="usos-indevidos"
        badge="Não faça"
        title="Usos Indevidos"
        description="Exemplos do que nunca fazer com o logotipo."
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
        description="Logotipos oficiais em SVG e o manual completo da marca __BRAND_SHORT__."
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
              <p className="text-sm font-semibold text-foreground">Manual da marca __BRAND_SHORT__</p>
              <p className="text-xs text-muted-foreground">Documento oficial</p>
            </div>
          </div>
          <Download size={16} className="text-primary shrink-0" />
        </a>
      </div>
    </div>
  );
}
