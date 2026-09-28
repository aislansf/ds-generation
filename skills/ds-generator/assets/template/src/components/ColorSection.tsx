import { useState, useCallback } from "react";
import { Check, Copy, Droplets, Palette, SwatchBook, Layers } from "lucide-react";
import { CodeBlock } from "@/components/DSComponents";

/* ------------------------------------------------------------------ */
/*  Helper: copy to clipboard with visual feedback                     */
/* ------------------------------------------------------------------ */
function CopyHex({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-1.5 py-0.5 rounded transition-colors"
      title={`Copiar ${value}`}
      aria-label={`Copiar código hexadecimal ${value}`}
    >
      {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
      {value}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Color swatch card                                                  */
/* ------------------------------------------------------------------ */
interface ColorSwatchProps {
  name: string;
  hex: string;
  darkHex?: string;
  token: string;
  description?: string;
  large?: boolean;
}

function ColorSwatch({ name, hex, darkHex, token, description, large }: ColorSwatchProps) {
  return (
    <div className="group">
      <div
        className={`${large ? "h-24" : "h-16"} rounded-lg border border-border mb-2 transition-transform group-hover:scale-[1.02]`}
        style={{ backgroundColor: hex }}
      />
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <div className="flex flex-wrap items-center gap-1.5 mt-1">
        <CopyHex value={hex} />
        {darkHex && (
          <span className="text-[10px] text-muted-foreground">
            Dark: <CopyHex value={darkHex} />
          </span>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">var(--{token})</p>
      {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gradient card                                                      */
/* ------------------------------------------------------------------ */
interface GradientCardProps {
  name: string;
  css: string;
  colors: string[];
  description: string;
}

function GradientCard({ name, css, colors, description }: GradientCardProps) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [css]);

  return (
    <div className="group">
      <div
        className="h-20 rounded-lg border border-border mb-2 transition-transform group-hover:scale-[1.02]"
        style={{ background: css }}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-1.5 py-0.5 rounded transition-colors"
          title="Copiar CSS do gradiente"
          aria-label={`Copiar CSS do gradiente ${name}`}
        >
          {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
          Copiar CSS
        </button>
      </div>
      <div className="flex flex-wrap gap-1 mt-1">
        {colors.map(c => <CopyHex key={c} value={c} />)}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */
export default function ColorSection() {
  return (
    <>
      {/* ===== PALETA PRINCIPAL ===== */}
      <div className="brand-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={18} className="text-primary" />
          <h4 className="text-sm font-semibold">Paleta principal — Azul Céu Brasileiro</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Cor primária <strong>#5BA3D9</strong> — inspirada no azul do céu brasileiro presente na
          identidade visual “Nós representamos todo o Brasil”. A partir dela é construída toda a escala
          cromática, secundárias, complementares, semânticas e gradientes do sistema.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {[
            { name: "Azul Profundo",  hex: "#005EB8", token: "blue-profundo" },
            { name: "Azul Marinho",   hex: "#0024A9", token: "blue-marinho"  },
            { name: "Azul Cobalto",   hex: "#0041D9", token: "blue-cobalto"  },
            { name: "Azul Royal",     hex: "#3B4AFF", token: "blue-royal"    },
            { name: "Azul Céu",       hex: "#40BBFF", token: "blue-ceu"      },
          ].map((c) => (
            <ColorSwatch key={c.hex} name={c.name} hex={c.hex} token={c.token} />
          ))}
        </div>

        {/* Escala do azul */}
        <h4 className="text-sm font-semibold mb-1">Escala cromática do Azul Primário</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Escala 50–950 derivada do matiz de <strong>#5BA3D9</strong> (~204°). Use 50–200 para superfícies,
          300–500 para componentes e brand, 600–800 para texto/contraste e 900–950 para dark mode.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2 mb-6">
          {[
            { name: "50",  hex: "#F0F7FC", token: "blue-50"  },
            { name: "100", hex: "#DCEBF6", token: "blue-100" },
            { name: "200", hex: "#B8D7ED", token: "blue-200" },
            { name: "300", hex: "#8FC0E2", token: "blue-300" },
            { name: "400", hex: "#5BA3D9", token: "blue-400" },
            { name: "500", hex: "#3D8DC8", token: "blue-500" },
            { name: "600", hex: "#2A75AE", token: "blue-600" },
            { name: "700", hex: "#1F5C8A", token: "blue-700" },
            { name: "800", hex: "#163F5F", token: "blue-800" },
            { name: "900", hex: "#0E2638", token: "blue-900" },
            { name: "950", hex: "#06141F", token: "blue-950" },
          ].map(c => (
            <div key={c.token} className="text-center">
              <div className="h-12 rounded-lg border border-border mb-1" style={{ backgroundColor: c.hex }} />
              <p className="text-[10px] font-semibold">{c.name}</p>
              <CopyHex value={c.hex} />
            </div>
          ))}
        </div>

        {/* Secundárias — Família Brasil */}
        <h4 className="text-sm font-semibold mb-1">Cores Secundárias — Família Brasil</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Extraídas da paleta de referência (Pantone). Uso em destaques institucionais, categorias e
          ilustrações que dialogam com o azul primário.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: "Azul Profundo", hex: "#0041D9", token: "brand-deep",    pantone: "Pantone 2728C" },
            { name: "Azul Royal",    hex: "#3B4AFF", token: "brand-royal",   pantone: "Pantone 2726C" },
            { name: "Ciano Vibrante",hex: "#40BBFF", token: "cyan",          pantone: "Pantone 298C"  },
            { name: "Verde Tropical",hex: "#84F4BC", token: "green-tropical",pantone: "Pantone 3375C" },
            { name: "Amarelo Sol",   hex: "#FFED69", token: "yellow-sun",    pantone: "Pantone 100C"  },
          ].map(c => (
            <div key={c.token} className="text-center">
              <div className="h-14 rounded-lg border border-border mb-1" style={{ backgroundColor: c.hex }} />
              <p className="text-xs font-semibold">{c.name}</p>
              <p className="text-[10px] text-muted-foreground">{c.pantone}</p>
              <CopyHex value={c.hex} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== CORES COMPLEMENTARES DO MANUAL ===== */}
      <div className="brand-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <SwatchBook size={18} className="text-primary" />
          <h4 className="text-sm font-semibold">Cores Complementares — Acentos</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Acentos quentes e análogos complementares ao azul primário. Uso em CTAs secundários,
          ilustrações, categorias de dataviz e destaques editoriais.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: "Coral Carnaval", hex: "#F4455A", token: "coral",           pantone: "Pantone 1785C" },
            { name: "Rosa Suave",     hex: "#FFABAB", token: "pink-soft",       pantone: "Pantone 169C"  },
            { name: "Laranja Manga",  hex: "#FFB380", token: "orange-mango",    pantone: "Pantone 7410C" },
            { name: "Roxo Festival",  hex: "#9285F9", token: "purple-festival", pantone: "Pantone 2715C" },
            { name: "Magenta",        hex: "#CD5BE8", token: "magenta",         pantone: "Pantone 252C"  },
          ].map(c => (
            <div key={c.token} className="text-center">
              <div className="h-14 rounded-lg border border-border mb-1" style={{ backgroundColor: c.hex }} />
              <p className="text-xs font-semibold">{c.name}</p>
              <p className="text-[10px] text-muted-foreground">{c.pantone}</p>
              <CopyHex value={c.hex} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== CORES SEMÂNTICAS ===== */}
      <div className="brand-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-primary" />
          <h4 className="text-sm font-semibold">Cores semânticas (feedback)</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Derivadas da paleta Brasil, ajustadas para contraste AA. Cada cor possui par “base + soft”
          para garantir legibilidade entre texto e fundo em modo claro e escuro.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "Success",
              hex: "#2BA86B",
              darkHex: "#34D399",
              bgHex: "#DFF5E8",
              darkBgHex: "#052E16",
              fgHex: "#FFFFFF",
              token: "success",
              desc: "Confirmações, ações concluídas, validações positivas. Deriva do Verde Tropical.",
            },
            {
              name: "Warning",
              hex: "#F2A93B",
              darkHex: "#FBBF24",
              bgHex: "#FFF1D6",
              darkBgHex: "#422006",
              fgHex: "#4A2F06",
              token: "warning",
              desc: "Alertas, atenção necessária. Deriva do Amarelo Sol e Laranja Manga.",
            },
            {
              name: "Danger",
              hex: "#E23D4F",
              darkHex: "#F87171",
              bgHex: "#FBE0E3",
              darkBgHex: "#450A0A",
              fgHex: "#FFFFFF",
              token: "danger",
              desc: "Erros, falhas, ações destrutivas. Deriva do Coral Carnaval.",
            },
            {
              name: "Info",
              hex: "#3D8DC8",
              darkHex: "#5BA3D9",
              bgHex: "#DCEBF6",
              darkBgHex: "#1E3A5F",
              fgHex: "#FFFFFF",
              token: "info",
              desc: "Informações contextuais, dicas. Deriva do Azul Primário.",
            },
          ].map(c => (
            <div key={c.token} className="border border-border rounded-lg overflow-hidden">
              <div className="h-12" style={{ backgroundColor: c.hex }} />
              <div className="h-8" style={{ backgroundColor: c.bgHex }} />
              <div className="p-3">
                <p className="text-sm font-semibold mb-1">{c.name}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Base</span>
                    <CopyHex value={c.hex} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Dark</span>
                    <CopyHex value={c.darkHex} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Fundo (light)</span>
                    <CopyHex value={c.bgHex} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Fundo (dark)</span>
                    <CopyHex value={c.darkBgHex} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SUPERFÍCIES ===== */}
      <div className="brand-card mb-6">
        <h4 className="text-sm font-semibold mb-3">Superfícies e fundos</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Superfícies neutras com leve tinta do azul primário, garantindo coerência cromática em todo o sistema.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Background", hex: "#F5F7FA", darkHex: "#06141F", token: "background", cls: "bg-background border" },
            { label: "Card",       hex: "#FFFFFF", darkHex: "#0E2638", token: "card",       cls: "bg-card border" },
            { label: "Muted",      hex: "#F0F7FC", darkHex: "#163F5F", token: "muted",      cls: "bg-muted" },
            { label: "Accent",     hex: "#DCEBF6", darkHex: "#1F5C8A", token: "accent",     cls: "bg-accent" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`h-14 rounded-lg mb-1 ${s.cls} border-border`} />
              <p className="text-xs font-semibold">{s.label}</p>
              <div className="mt-1 space-y-0.5">
                <div className="flex justify-center gap-1">
                  <span className="text-[9px] text-muted-foreground">L:</span>
                  <CopyHex value={s.hex} />
                </div>
                <div className="flex justify-center gap-1">
                  <span className="text-[9px] text-muted-foreground">D:</span>
                  <CopyHex value={s.darkHex} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== GRADIENTES ===== */}
      <div className="brand-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={18} className="text-primary" />
          <h4 className="text-sm font-semibold">Gradientes do sistema</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Combinações construídas a partir do azul primário e da paleta Brasil. Use em headers, hero
          sections, cards de destaque, campanhas e dataviz. Clique para copiar o CSS.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <GradientCard
            name="Primary"
            css="linear-gradient(135deg, #5BA3D9 0%, #2A75AE 100%)"
            colors={["#5BA3D9", "#2A75AE"]}
            description="Botões premium, hover de cards, hero institucional."
          />
          <GradientCard
            name="Brand Deep"
            css="linear-gradient(135deg, #3B4AFF 0%, #0041D9 100%)"
            colors={["#3B4AFF", "#0041D9"]}
            description="Headers institucionais, splash, telas de autenticação."
          />
          <GradientCard
            name="Sky to Ocean"
            css="linear-gradient(90deg, #005EB8 0%, #40BBFF 100%)"
            colors={["#40BBFF", "#5BA3D9", "#1F5C8A"]}
            description="Dashboards, covers de seção, painéis de indicadores."
          />
          <GradientCard
            name="Brasil Sunset"
            css="linear-gradient(120deg, #FFED69 0%, #FFB380 50%, #F4455A 100%)"
            colors={["#FFED69", "#FFB380", "#F4455A"]}
            description="Campanhas, banners de evento, comunicação calorosa."
          />
          <GradientCard
            name="Tropical"
            css="linear-gradient(120deg, #84F4BC 0%, #40BBFF 100%)"
            colors={["#84F4BC", "#40BBFF"]}
            description="Ilustrações, ambientes leves, ações de sustentabilidade."
          />
          <GradientCard
            name="Carnaval"
            css="linear-gradient(120deg, #9285F9 0%, #CD5BE8 50%, #F4455A 100%)"
            colors={["#9285F9", "#CD5BE8", "#F4455A"]}
            description="Destaques editoriais, capas de conteúdo, comunicação cultural."
          />
          <GradientCard
            name="Surface Soft"
            css="linear-gradient(180deg, #F0F7FC 0%, #FFFFFF 100%)"
            colors={["#F0F7FC", "#FFFFFF"]}
            description="Fundos de seção, separação suave de áreas. Modo claro."
          />
        </div>
      </div>

      {/* ===== UTILIZAÇÃO SISTÊMICA ===== */}
      <div className="brand-card mb-6">
        <h4 className="text-sm font-semibold mb-4">Utilização sistêmica das cores</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Distribuição recomendada <strong>60-30-10</strong>:
          <span className="text-foreground"> 60% neutros</span> (background, blue-50/100) para superfícies,
          <span className="text-foreground"> 30% primário</span> (#5BA3D9 + escala 400–800) para navegação e
          interação, <span className="text-foreground">10% acentos</span> (complementares + gradientes)
          para destaques pontuais.
        </p>
        <ul className="text-xs text-muted-foreground list-disc pl-5 mb-4 space-y-1">
          <li><strong>Botão primário:</strong> <code className="bg-muted px-1 rounded">blue-400</code> fundo, texto branco · hover <code className="bg-muted px-1 rounded">blue-500</code> · pressed <code className="bg-muted px-1 rounded">blue-600</code>.</li>
          <li><strong>Botão secundário:</strong> outline <code className="bg-muted px-1 rounded">blue-600</code>, texto <code className="bg-muted px-1 rounded">blue-700</code>, hover preenche <code className="bg-muted px-1 rounded">blue-50</code>.</li>
          <li><strong>CTA promocional:</strong> gradiente <em>Primary</em> ou <em>Brasil Sunset</em>.</li>
          <li><strong>Links:</strong> <code className="bg-muted px-1 rounded">blue-600</code> · hover <code className="bg-muted px-1 rounded">blue-700</code> · visited <code className="bg-muted px-1 rounded">blue-800</code>.</li>
          <li><strong>Dark mode:</strong> background <code className="bg-muted px-1 rounded">blue-950</code>, surface <code className="bg-muted px-1 rounded">blue-900</code>, primary mantém <code className="bg-muted px-1 rounded">blue-400</code>.</li>
          <li><strong>Dataviz (sequência fixa):</strong> #5BA3D9 → #F4455A → #84F4BC → #FFED69 → #9285F9 → #FFB380 → #40BBFF → #CD5BE8.</li>
          <li><strong>Acessibilidade:</strong> texto sobre <code className="bg-muted px-1 rounded">blue-400</code> sempre branco (AA ≥ 4.5:1). Evite texto branco sobre <code className="bg-muted px-1 rounded">blue-50/100/200</code>.</li>
        </ul>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3 font-semibold">Contexto</th>
                <th className="text-left py-2 pr-3 font-semibold">Token CSS</th>
                <th className="text-left py-2 pr-3 font-semibold">Hex (Light)</th>
                <th className="text-left py-2 pr-3 font-semibold">Hex (Dark)</th>
                <th className="text-left py-2 font-semibold">Onde usar</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ctx: "Fundo da página",   token: "--background",         light: "#F5F7FA", dark: "#06141F", use: "Body, fundo geral" },
                { ctx: "Cards e painéis",   token: "--card",               light: "#FFFFFF", dark: "#0E2638", use: "Cards, modais, drawers" },
                { ctx: "Texto principal",   token: "--foreground",         light: "#0E2638", dark: "#F0F7FC", use: "Títulos e corpo" },
                { ctx: "Texto secundário",  token: "--muted-foreground",   light: "#1F5C8A", dark: "#8FC0E2", use: "Labels, descrições" },
                { ctx: "Ação primária",     token: "--primary",            light: "#5BA3D9", dark: "#5BA3D9", use: "Botões, links, foco" },
                { ctx: "Ação secundária",   token: "--secondary",          light: "#0041D9", dark: "#3B4AFF", use: "Headers, ações de apoio" },
                { ctx: "Acento quente",     token: "--coral",              light: "#F4455A", dark: "#F4455A", use: "CTAs secundários, destaques" },
                { ctx: "Bordas",            token: "--border",             light: "#DCEBF6", dark: "#163F5F", use: "Divisores, inputs" },
                { ctx: "Fundo muted",       token: "--muted",              light: "#F0F7FC", dark: "#163F5F", use: "Áreas de destaque sutil" },
                { ctx: "Sucesso",           token: "--success",            light: "#2BA86B", dark: "#34D399", use: "Confirmações, validações" },
                { ctx: "Alerta",            token: "--warning",            light: "#F2A93B", dark: "#FBBF24", use: "Avisos, atenção" },
                { ctx: "Erro",              token: "--danger",             light: "#E23D4F", dark: "#F87171", use: "Erros, exclusões" },
                { ctx: "Informação",        token: "--info",               light: "#3D8DC8", dark: "#5BA3D9", use: "Dicas, informações" },
              ].map(row => (
                <tr key={row.token} className="border-b border-border last:border-0">
                  <td className="py-2 pr-3 font-medium">{row.ctx}</td>
                  <td className="py-2 pr-3">
                    <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{row.token}</code>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded border border-border shrink-0" style={{ backgroundColor: row.light }} />
                      <CopyHex value={row.light} />
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded border border-border shrink-0" style={{ backgroundColor: row.dark }} />
                      <CopyHex value={row.dark} />
                    </div>
                  </td>
                  <td className="py-2 text-muted-foreground">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== CÓDIGO DE EXEMPLO ===== */}
      <CodeBlock
        title="Uso dos tokens de cor no CSS"
        language="css"
        code={`/* Sempre use tokens CSS — nunca hex diretamente */
.card {
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
}

.btn-primary {
  background-color: hsl(var(--primary));       /* #5BA3D9 — Azul Céu */
  color: hsl(var(--primary-foreground));        /* #FFFFFF */
}

.btn-primary:hover  { background-color: #3D8DC8; }  /* blue-500 */
.btn-primary:active { background-color: #2A75AE; }  /* blue-600 */

.btn-secondary {
  background-color: hsl(var(--secondary));      /* #0041D9 — Azul Profundo */
  color: hsl(var(--secondary-foreground));      /* #FFFFFF */
}

/* Gradientes do sistema */
.hero-banner    { background: linear-gradient(135deg, #5BA3D9 0%, #2A75AE 100%); }
.brand-deep     { background: linear-gradient(135deg, #3B4AFF 0%, #0041D9 100%); }
.brasil-sunset  { background: linear-gradient(120deg, #FFED69 0%, #FFB380 50%, #F4455A 100%); }

/* Feedback semântico */
.alert-success {
  background-color: hsl(var(--success-bg));
  color: hsl(var(--success));
  border-left: 3px solid hsl(var(--success));
}`}
      />

      <CodeBlock
        title="Uso dos tokens de cor no Tailwind"
        language="tsx"
        code={`{/* Botões usando tokens — se adaptam ao tema automaticamente */}
<button className="bg-primary text-primary-foreground">Ação principal</button>
<button className="bg-secondary text-secondary-foreground">Ação secundária</button>

{/* Feedback */}
<div className="bg-success/10 text-success border-l-3 border-success p-4">
  Operação concluída com sucesso.
</div>

{/* Gradientes no Tailwind */}
<div className="bg-gradient-to-r from-[#2A4FDA] via-[#1E5F8C] to-[#4A8DC2]">
  Banner institucional
</div>

{/* Nunca faça isso ❌ */}
<div className="bg-[#2A4FDA] text-white">Evite hex direto</div>

{/* Faça isso ✅ */}
<div className="bg-primary text-primary-foreground">Use tokens</div>`}
      />
    </>
  );
}
