import { ICONES_NEUMORFISMO } from "./neumorfismo-icones-dados";

/**
 * Seção "Ícones" do estilo Neumorfismo (componente Icon do pacote Neumorphic UI v3.2.0): os 96 ícones de
 * linha do pacote, cada um num quadrado de cantos suaves convexo, e os tamanhos e o giro de carregamento.
 * Só é usada quando ESTILO.id === "neumorfismo" (ComponentesPage); a camada src/styles/estilo.css dá o relevo.
 */

export const NOMES_ICONES = Object.keys(ICONES_NEUMORFISMO);

interface IconeProps {
  name: string;
  size?: number;
  label?: string;
  spin?: boolean;
  className?: string;
}

/** Ícone de linha: traço de 2px, pontas redondas, na cor do texto (currentColor). Com `label`, vira imagem com nome acessível. */
export function Icone({ name, size = 18, label, spin = false, className }: IconeProps) {
  return (
    <svg
      className={["neu-icon", spin ? "neu-spin" : "", className ?? ""].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: ICONES_NEUMORFISMO[name] ?? "" }}
    />
  );
}

export default function NeumorfismoIcones() {
  return (
    <div className="neu-stack">
      <ul className="neu-icones" aria-label={`${NOMES_ICONES.length} ícones do sistema`}>
        {NOMES_ICONES.map((nome) => (
          <li key={nome} className="neu-icones__item" title={nome}>
            <Icone name={nome} />
            <span className="sr-only">{nome}</span>
          </li>
        ))}
      </ul>
      <div className="neu-icones__tamanhos">
        {[
          { tamanho: 14, uso: "14px · breadcrumb" },
          { tamanho: 16, uso: "16px · linhas densas e campos" },
          { tamanho: 18, uso: "18px · padrão" },
          { tamanho: 22, uso: "20–22px · quadrado de KPI" },
        ].map((t) => (
          <div key={t.tamanho} className="neu-icones__tamanho">
            <span className="neu-icones__item" aria-hidden="true">
              <Icone name="search" size={t.tamanho} />
            </span>
            <span>{t.uso}</span>
          </div>
        ))}
        <div className="neu-icones__tamanho">
          <span className="neu-icones__item neu-icones__item--ativo">
            <Icone name="loader-2" spin label="Carregando" />
          </span>
          <span>spin · carregamento; cor da marca só no ícone ativo</span>
        </div>
      </div>
    </div>
  );
}
