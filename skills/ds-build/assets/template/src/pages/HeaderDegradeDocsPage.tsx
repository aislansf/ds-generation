import { PageHeader, SectionHeader, CodeBlock, ComponentPreview } from "@/components/DSComponents";
import { Info, Smartphone, Tablet, Monitor, Move, Layout, Maximize2 } from "lucide-react";
import brandLogoWhiteAsset from "@/assets/brand-white-v2.svg.asset.json";
const brandLogoWhite = brandLogoWhiteAsset.url;

export default function HeaderDegradeDocsPage() {
  const headerCode = `<!-- Header __BRAND_NAME__: Degradê Novo __BRAND_SHORT__ -->
<header class="brand-header" style="min-height: var(--brand-header-height); background: linear-gradient(90deg, var(--brand-header-grad-start) 0%, var(--brand-header-grad-end) 100%); display: flex; flex-direction: column; justify-content: center; padding: var(--brand-header-py) var(--brand-header-px); box-sizing: border-box; color: #fff; font-family: 'Poppins', sans-serif;">
  <div class="brand-header__top" style="display: flex; align-items: center; gap: var(--brand-header-gap); flex-wrap: wrap;">
    <div style="display: flex; align-items: center; gap: var(--brand-header-gap);">
      <img src="/assets/brand-white.svg" alt="__BRAND_SHORT__" style="height: var(--brand-header-logo-h); width: auto;" />
      <div style="width: 1px; height: var(--brand-header-divider-h); background: var(--brand-header-divider);"></div>
      <h1 style="font-weight: 300; font-size: var(--brand-header-title-fs); color: var(--brand-header-title-color); letter-spacing: 0.2px; margin: 0;">Título do Sistema</h1>
    </div>
  </div>

  <div class="brand-header__bottom" style="display: flex; align-items: center; gap: var(--brand-header-gap); margin-top: var(--brand-header-py); flex-wrap: wrap;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.9;">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <div>
        <p style="font-size: var(--brand-header-label-fs); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--brand-header-label-color); margin: 0 0 2px 0;">Última atualização</p>
        <p style="font-size: var(--brand-header-value-fs); font-weight: 700; color: #fff; margin: 0;">14/07/2026 08:00</p>
      </div>
    </div>
    <div class="brand-header__divider" style="width: 1px; height: var(--brand-header-divider-h); background: var(--brand-header-divider);"></div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.9;">
        <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>
      </svg>
      <div>
        <p style="font-size: var(--brand-header-label-fs); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--brand-header-label-color); margin: 0 0 2px 0;">Próxima atualização</p>
        <p style="font-size: var(--brand-header-value-fs); font-weight: 700; color: #fff; margin: 0;">Amanhã, às 07:00</p>
      </div>
    </div>
  </div>
</header>`;

  return (
    <div className="pb-20">
      <PageHeader
        badge="Documentação · Componente"
        title="Header Degradê Novo __BRAND_SHORT__"
        description="O Header Degradê Novo __BRAND_SHORT__ é um componente institucional de alto impacto, projetado para Dashboards e Painéis Estratégicos. Utiliza tokens semânticos e garante responsividade em todos os dispositivos."
      />

      <SectionHeader
        id="visual-preview"
        title="Visualização e Estados"
        description="O componente adapta seu layout automaticamente com base na largura da tela, stackando elementos verticalmente em dispositivos móveis."
        badge="Preview"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="brand-card">
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={18} className="text-primary" />
            <h4 className="font-semibold text-sm">Desktop (≥ 768px)</h4>
          </div>
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="min-h-[135px] bg-gradient-to-r from-[#053665] to-[#05549e] flex items-center justify-between px-8 text-white">
              <div className="flex items-center gap-6">
                <img src={brandLogoWhite} alt="__BRAND_SHORT__" className="h-[57.5px] w-auto" />
                <div className="w-px h-[60px] bg-white/40" />
                <h1 className="text-[27px] font-light text-white/90 tracking-[0.2px]">Dashboard Institucional</h1>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white/70 uppercase">Última atualização</span>
                    <span className="text-xs font-bold text-white">14/07/2026 08:00</span>
                  </div>
                </div>
                <div className="w-px h-[60px] bg-white/40" />
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white/70 uppercase">Próxima atualização</span>
                    <span className="text-xs font-bold text-white">Amanhã, 07:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">Layout horizontal com divisores verticais e tipografia completa.</p>
        </div>

        <div className="brand-card">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone size={18} className="text-primary" />
            <h4 className="font-semibold text-sm">Mobile (&lt; 768px)</h4>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[320px] rounded-lg overflow-hidden border border-border">
              <div className="bg-gradient-to-r from-[#053665] to-[#05549e] p-5 text-white flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <img src={brandLogoWhite} alt="__BRAND_SHORT__" className="h-[40px] w-auto" />
                  <div className="w-px h-[40px] bg-white/40" />
                  <h1 className="text-xl font-light text-white/90">Dashboard</h1>
                </div>
                <div className="flex flex-col gap-3 pt-2 border-t border-white/20">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white/70 uppercase">Última atualização</span>
                    <span className="text-xs font-bold text-white">14/07/2026 08:00</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white/70 uppercase">Próxima atualização</span>
                    <span className="text-xs font-bold text-white">Amanhã, 07:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">Empilhamento vertical, fontes reduzidas e divisores horizontais.</p>
        </div>
      </div>

      <SectionHeader
        id="guidelines"
        title="Diretrizes de Implementação"
        description="Especificações técnicas de espaçamento, cores e responsividade baseadas em tokens."
        badge="Guidelines"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="brand-card">
          <div className="flex items-center gap-2 mb-3">
            <Layout size={18} className="text-primary" />
            <h4 className="font-semibold text-sm">Responsividade</h4>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li>• <strong>Mobile:</strong> Altura automática (`height: auto`), padding 16px, `flex-direction: column`.</li>
            <li>• <strong>Desktop:</strong> Altura mínima 135px, padding 32px, `flex-direction: row`.</li>
            <li>• <strong>Quebra:</strong> O layout deve transicionar no breakpoint de 768px (md).</li>
          </ul>
        </div>
        <div className="brand-card">
          <div className="flex items-center gap-2 mb-3">
            <Move size={18} className="text-primary" />
            <h4 className="font-semibold text-sm">Espaçamentos</h4>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li>• <strong>Padding X:</strong> `var(--brand-header-px)` (32px).</li>
            <li>• <strong>Padding Y:</strong> `var(--brand-header-py)` (20px).</li>
            <li>• <strong>Gap entre blocos:</strong> `var(--brand-header-gap)` (24px).</li>
            <li>• <strong>Gap ícone/texto:</strong> 10px fixos.</li>
          </ul>
        </div>
        <div className="brand-card">
          <div className="flex items-center gap-2 mb-3">
            <Maximize2 size={18} className="text-primary" />
            <h4 className="font-semibold text-sm">Tipografia</h4>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li>• <strong>Título:</strong> `var(--brand-header-title-fs)` (27px) | Peso 300 (Light).</li>
            <li>• <strong>Labels:</strong> `var(--brand-header-label-fs)` (13px) | Peso 600 (Semibold).</li>
            <li>• <strong>Valores:</strong> `var(--brand-header-value-fs)` (15px) | Peso 700 (Bold).</li>
          </ul>
        </div>
      </div>

      <SectionHeader
        id="tokens-ref"
        title="Referência de Tokens"
        description="Variáveis CSS utilizadas no componente para garantir consistência."
        badge="Tokens"
      />
      
      <div className="brand-card p-0 overflow-hidden mb-12">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Token</th>
              <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Valor Padrão</th>
              <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Descrição</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { token: "--brand-header-grad-start", value: "#053665", desc: "Cor inicial do degradê institucional." },
              { token: "--brand-header-grad-end", value: "#05549e", desc: "Cor final do degradê institucional." },
              { token: "--brand-header-height", value: "135px", desc: "Altura base do header em desktop." },
              { token: "--brand-header-px", value: "32px", desc: "Padding horizontal lateral." },
              { token: "--brand-header-divider", value: "rgba(255,255,255,0.4)", desc: "Cor da linha divisória vertical/horizontal." },
              { token: "--brand-header-logo-h", value: "57.5px", desc: "Altura da marca __BRAND_SHORT__ em desktop." },
            ].map((t) => (
              <tr key={t.token} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono text-[11px] text-primary">{t.token}</td>
                <td className="px-6 py-4 text-xs font-medium">{t.value}</td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{t.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader
        id="usage-code"
        title="Exemplo de Uso (HTML/CSS)"
        description="Código consolidado para uso externo ou integração com Power BI."
        badge="Código"
      />
      
      <div className="mb-8">
        <CodeBlock code={headerCode} title="Header Degradê Novo __BRAND_SHORT__ (Standard)" />
      </div>

      <div className="brand-card bg-info/5 border-info/20">
        <div className="flex gap-3">
          <Info className="text-info shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-info mb-1">Nota de Integração</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao utilizar este header fora do ambiente React, certifique-se de incluir as variáveis CSS no seu escopo global ou substituir os `var()` pelos valores absolutos. A responsividade baseada em `md:flex-row` deve ser emulada via Media Queries convencionais no seu arquivo de estilos externo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
