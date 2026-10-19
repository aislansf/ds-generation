import { useState } from "react";
import { PageHeader, SectionHeader, CodeBlock } from "@/components/DSComponents";
import { Monitor, Tablet, Smartphone, Settings2, RotateCcw, Copy, Check } from "lucide-react";
import brandLogoWhiteAsset from "@/assets/brand-white-v2.svg.asset.json";
const brandLogoWhite = brandLogoWhiteAsset.url;

export default function HeaderPlaygroundPage() {
  const [tokens, setTokens] = useState({
    gradStart: "#053665",
    gradEnd: "#05549e",
    height: 135,
    px: 32,
    py: 20,
    gap: 24,
    titleFs: 27,
    logoH: 57.5,
  });

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  const resetTokens = () => {
    setTokens({
      gradStart: "#053665",
      gradEnd: "#05549e",
      height: 135,
      px: 32,
      py: 20,
      gap: 24,
      titleFs: 27,
      logoH: 57.5,
    });
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };

  const isMobile = viewport === "mobile";

  const generateCSS = () => {
    return `:root {
  --brand-header-grad-start: ${tokens.gradStart};
  --brand-header-grad-end: ${tokens.gradEnd};
  --brand-header-height: ${tokens.height}px;
  --brand-header-px: ${tokens.px}px;
  --brand-header-py: ${tokens.py}px;
  --brand-header-gap: ${tokens.gap}px;
  --brand-header-title-fs: ${tokens.titleFs / 16}rem;
  --brand-header-logo-h: ${tokens.logoH}px;
}`;
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-20">
      <PageHeader
        badge="Ferramentas · Design System"
        title="Playground do Header"
        description="Ajuste os tokens visuais do Header Degradê em tempo real e simule o comportamento responsivo em diferentes dispositivos."
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Controls Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="brand-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Settings2 size={16} className="text-primary" />
                Ajustar Tokens
              </h3>
              <button 
                onClick={resetTokens}
                className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                title="Resetar para o padrão"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Cores do Degradê</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="color" 
                    value={tokens.gradStart}
                    onChange={(e) => setTokens({ ...tokens, gradStart: e.target.value })}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                  <input 
                    type="color" 
                    value={tokens.gradEnd}
                    onChange={(e) => setTokens({ ...tokens, gradEnd: e.target.value })}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Altura (px): {tokens.height}</label>
                <input 
                  type="range" min="100" max="250" 
                  value={tokens.height}
                  onChange={(e) => setTokens({ ...tokens, height: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Padding X (px): {tokens.px}</label>
                <input 
                  type="range" min="8" max="64" 
                  value={tokens.px}
                  onChange={(e) => setTokens({ ...tokens, px: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Padding Y (px): {tokens.py}</label>
                <input 
                  type="range" min="8" max="40" 
                  value={tokens.py}
                  onChange={(e) => setTokens({ ...tokens, py: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Gap Interno (px): {tokens.gap}</label>
                <input 
                  type="range" min="8" max="48" 
                  value={tokens.gap}
                  onChange={(e) => setTokens({ ...tokens, gap: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Fonte Título (px): {tokens.titleFs}</label>
                <input 
                  type="range" min="16" max="40" 
                  value={tokens.titleFs}
                  onChange={(e) => setTokens({ ...tokens, titleFs: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Altura Logo (px): {tokens.logoH}</label>
                <input 
                  type="range" min="30" max="80" 
                  value={tokens.logoH}
                  onChange={(e) => setTokens({ ...tokens, logoH: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="brand-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">CSS Gerado</h3>
              <button 
                onClick={copyCSS}
                className="text-[10px] flex items-center gap-1 text-primary font-bold uppercase hover:underline"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <pre className="text-[10px] font-mono bg-muted p-3 rounded overflow-x-auto leading-relaxed text-muted-foreground">
              {generateCSS()}
            </pre>
          </div>
        </div>

        {/* Preview Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-center gap-4 bg-muted/50 p-2 rounded-lg border border-border">
            <button 
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${viewport === "desktop" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"}`}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button 
              onClick={() => setViewport("tablet")}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${viewport === "tablet" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"}`}
            >
              <Tablet size={14} /> Tablet
            </button>
            <button 
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${viewport === "mobile" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"}`}
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>

          <div className="relative border border-border rounded-xl bg-muted/20 overflow-hidden flex justify-center items-start min-h-[500px] transition-all duration-300">
            <div 
              className="bg-background shadow-2xl transition-all duration-300 overflow-hidden"
              style={{ width: getViewportWidth(), marginTop: "40px" }}
            >
              {/* Header Implementation for Playground */}
              <div 
                className="transition-all duration-300"
                style={{
                  minHeight: isMobile ? "auto" : `${tokens.height}px`,
                  background: `linear-gradient(90deg, ${tokens.gradStart} 0%, ${tokens.gradEnd} 100%)`,
                  padding: isMobile ? "20px 16px" : `${tokens.py}px ${tokens.px}px`,
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  justifyContent: isMobile ? "flex-start" : "space-between",
                  color: "#fff",
                  gap: isMobile ? "16px" : `${tokens.gap}px`
                }}
              >
                <div className="flex items-center" style={{ gap: `${tokens.gap}px` }}>
                  <img 
                    src={brandLogoWhite} 
                    alt="__BRAND_SHORT__" 
                    className="transition-all"
                    style={{ height: isMobile ? "40px" : `${tokens.logoH}px` }} 
                  />
                  <div 
                    className="bg-white/40 shrink-0" 
                    style={{ 
                      width: "1px", 
                      height: isMobile ? "40px" : `${tokens.height - (tokens.py * 2)}px`,
                      maxHeight: "60px"
                    }} 
                  />
                  <h1 
                    className="font-light tracking-[0.2px] leading-tight transition-all"
                    style={{ fontSize: isMobile ? "20px" : `${tokens.titleFs}px` }}
                  >
                    Dashboard Estratégico
                  </h1>
                </div>

                <div 
                  className="flex transition-all" 
                  style={{ 
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? "12px" : `${tokens.gap}px`,
                    marginLeft: isMobile ? "0" : "auto",
                    width: isMobile ? "100%" : "auto",
                    paddingTop: isMobile ? "16px" : "0",
                    borderTop: isMobile ? "1px solid rgba(255,255,255,0.2)" : "none"
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Última atualização</span>
                    <span className="text-xs font-bold">14/07/2026 08:00</span>
                  </div>
                  
                  {!isMobile && <div className="w-px h-10 bg-white/40 shrink-0" />}

                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Próxima atualização</span>
                    <span className="text-xs font-bold">Amanhã, 07:00</span>
                  </div>
                </div>
              </div>

              {/* Sample Content */}
              <div className="p-8 space-y-4">
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-muted rounded animate-pulse" />
                  <div className="h-32 bg-muted rounded animate-pulse" />
                  <div className="h-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
              </div>
            </div>

            {/* Viewport Info Overlay */}
            <div className="absolute top-2 right-4 text-[10px] font-mono text-muted-foreground bg-background/80 px-2 py-1 rounded border border-border">
              Largura Simulada: {getViewportWidth()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
