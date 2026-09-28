import JSZip from "jszip";
import { saveAs } from "file-saver";

import farolPageSource from "@/pages/FarolEstrategicoPage.tsx?raw";
import farolDataSource from "@/data/farolEstrategico.ts?raw";
import biSkeletonsSource from "@/components/bi/BISkeletons.tsx?raw";
import indexCssSource from "@/index.css?raw";
import {
  despesasMensais, trimestresTotais, despesasPorNatureza,
  kpiDespesas, kpiReceitas, kpiAtendimento,
} from "@/data/farolEstrategico";

const DS_URL = "https://__DS_DOMAIN__";
const TEMPLATE_PATH = "/templates/farol-estrategico";

/* ─────────── READMEs ─────────── */
function readmeReact() {
  return `# Farol Estratégico — Versão React

Template do **Design System __BRAND_NAME__** inspirado em painéis Power BI para
acompanhamento orçamentário e indicadores estratégicos.

> 🔗 **Referência viva:** ${DS_URL}${TEMPLATE_PATH}
> 📚 **Documentação:** ${DS_URL}${TEMPLATE_PATH}/docs
> ℹ️ A URL pode mudar no futuro — confirme com o time do DS.

## Stack
- React 18 + TypeScript · Vite
- Tailwind CSS (tokens HSL do DS)
- Recharts · lucide-react

## Instalação
\`\`\`bash
npm install
npm run dev
\`\`\`
Acesse \`http://localhost:5173\`.

## Estrutura
\`\`\`
farol-estrategico/
├── index.html
├── package.json · vite.config.ts · tsconfig.json
├── tailwind.config.ts · postcss.config.js
└── src/
    ├── main.tsx · App.tsx · index.css
    ├── pages/FarolEstrategicoPage.tsx
    ├── data/farolEstrategico.ts
    ├── components/bi/BISkeletons.tsx
    └── hooks/  ·  assets/brand.ts
\`\`\`

## Customização
- **Dados:** edite \`src/data/farolEstrategico.ts\` ou troque por chamada de API.
- **Tokens:** todos os valores visuais vêm de \`src/index.css\` — nunca use cores hardcoded.

---
Gerado em ${new Date().toISOString().slice(0, 10)} a partir de ${DS_URL}.
`;
}

function readmeVanilla() {
  return `# Farol Estratégico — Versão HTML/CSS/JS

Versão **estática** (sem build) do template. Abre direto em qualquer navegador moderno.

> 🔗 **Referência viva:** ${DS_URL}${TEMPLATE_PATH}
> 📚 **Documentação:** ${DS_URL}${TEMPLATE_PATH}/docs
> ℹ️ A URL pode mudar no futuro — confirme com o time do DS.

## Como usar
1. Descompacte o ZIP.
2. Abra \`index.html\` no navegador (ou sirva com \`npx serve .\` para evitar CORS no \`fetch\`).

## Estrutura
\`\`\`
farol-estrategico/
├── index.html   (markup)
├── styles.css   (tokens HSL + utilitários)
├── app.js       (filtros, KPIs e gráficos via Chart.js CDN)
└── data.json    (datasets de exemplo)
\`\`\`

## Customização
- **Cores:** variáveis CSS em \`:root\` de \`styles.css\`.
- **Dados:** edite \`data.json\` ou troque por \`fetch\` de API real.
- **Gráficos:** Chart.js 4 via CDN.

> ⚠️ Sem reatividade do React — manipulação via DOM. Para a versão completa, use o pacote React.

---
Gerado em ${new Date().toISOString().slice(0, 10)} a partir de ${DS_URL}.
`;
}

/* ─────────── Opção A — React ─────────── */
const packageJsonReact = `{
  "name": "farol-estrategico",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "tsc -b && vite build", "preview": "vite preview" },
  "dependencies": {
    "lucide-react": "^0.462.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.8.3",
    "vite": "^5.4.20"
  }
}
`;

const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
`;

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020", "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext", "moduleResolution": "Bundler",
    "jsx": "react-jsx", "strict": true, "skipLibCheck": true,
    "esModuleInterop": true, "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true, "isolatedModules": true,
    "baseUrl": ".", "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
`;

const tailwindConfig = `import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Poppins", "system-ui", "sans-serif"] },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
`;

const postcssConfig = `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
`;

const indexHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Farol Estratégico — __BRAND_NAME__</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const mainTsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter><App /></BrowserRouter>
  </StrictMode>,
);
`;

const appTsx = `import FarolEstrategicoPage from "./pages/FarolEstrategicoPage";
export default function App() { return <FarolEstrategicoPage />; }
`;

const useMobileHook = `import { useEffect, useState } from "react";
const BP = 768;
export function useIsMobile() {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth < BP : false);
  useEffect(() => {
    const onChange = () => setM(window.innerWidth < BP);
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  }, []);
  return m;
}
`;

const useThemeHook = `import { useEffect, useState } from "react";
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggleTheme: () => setTheme(t => (t === "light" ? "dark" : "light")) };
}
`;

const brandAssetsStub = `// Substitua pelos arquivos oficiais de marca em assets/ se necessário.
const ph = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="28" font-family="Poppins,sans-serif" font-size="22" font-weight="700" fill="#003366">__BRAND_SHORT__</text></svg>'
);
export const brandCor = ph;
export const brandWhite = ph;
`;

export async function downloadFarolReact() {
  const zip = new JSZip();
  const root = zip.folder("farol-estrategico")!;
  root.file("README.md", readmeReact());
  root.file("package.json", packageJsonReact);
  root.file("vite.config.ts", viteConfig);
  root.file("tsconfig.json", tsconfig);
  root.file("tailwind.config.ts", tailwindConfig);
  root.file("postcss.config.js", postcssConfig);
  root.file("index.html", indexHtml);
  root.file(".gitignore", "node_modules\ndist\n.DS_Store\n");

  const src = root.folder("src")!;
  src.file("main.tsx", mainTsx);
  src.file("App.tsx", appTsx);
  src.file("index.css", indexCssSource);
  src.file("pages/FarolEstrategicoPage.tsx", farolPageSource);
  src.file("data/farolEstrategico.ts", farolDataSource);
  src.file("components/bi/BISkeletons.tsx", biSkeletonsSource);
  src.file("hooks/use-mobile.tsx", useMobileHook);
  src.file("hooks/useTheme.ts", useThemeHook);
  src.file("assets/brand.ts", brandAssetsStub);

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  saveAs(blob, "farol-estrategico-react.zip");
}

/* ─────────── Opção B — Vanilla ─────────── */
function buildDataJson() {
  return JSON.stringify({
    kpis: { despesas: kpiDespesas, receitas: kpiReceitas, atendimento: kpiAtendimento },
    despesasMensais, trimestresTotais, despesasPorNatureza,
  }, null, 2);
}

const vanillaHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farol Estratégico — __BRAND_NAME__</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" defer></script>
  <script src="app.js" defer></script>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <span class="brand-dot"></span>
      <div><strong>Farol Estratégico</strong><small>Painel Institucional · __BRAND_NAME__</small></div>
    </div>
    <nav class="breadcrumb" aria-label="Navegação">
      <a href="#">Início</a> › <a href="#">Painéis Estratégicos</a> › <span aria-current="page">Farol Estratégico</span>
    </nav>
  </header>

  <main class="layout">
    <section class="filters" id="filters" aria-label="Filtros do painel"></section>
    <section class="kpis" id="kpis" aria-label="Indicadores"></section>

    <section class="card">
      <header class="card-head">
        <h2>Despesas Planejada × Executada — Mensal</h2>
        <button id="refresh" class="btn-secondary">Atualizar</button>
      </header>
      <div class="chart-wrap"><canvas id="chartMensal"></canvas></div>
    </section>

    <section class="grid-2">
      <div class="card"><h2>Totais por Trimestre</h2><div class="chart-wrap small"><canvas id="chartTrimestre"></canvas></div></div>
      <div class="card"><h2>Despesas por Natureza</h2><div class="chart-wrap small"><canvas id="chartNatureza"></canvas></div></div>
    </section>

    <section class="card">
      <h2>Detalhamento por Natureza</h2>
      <div class="table-wrap">
        <table id="tabelaNatureza">
          <thead><tr><th>Natureza</th><th>Planejada</th><th>Executada</th><th>% Exec.</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  </main>

  <footer class="bottom"><span>Farol Estratégico · Painel Institucional v.1.0</span></footer>
</body>
</html>
`;

const vanillaCss = `/* Tokens HSL do Design System __BRAND_NAME__ */
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --primary: 207 100% 20%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --ring: 207 100% 20%;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: "Poppins", system-ui, sans-serif;
  background: hsl(var(--background)); color: hsl(var(--foreground));
  font-size: 14px; line-height: 1.5;
}
.topbar { display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; background: hsl(var(--card)); border-bottom: 1px solid hsl(var(--border)); }
.brand { display: flex; align-items: center; gap: 10px; }
.brand-dot { width: 28px; height: 28px; border-radius: 6px; background: hsl(var(--primary)); }
.brand small { display: block; color: hsl(var(--muted-foreground)); font-size: 11px; }
.breadcrumb { font-size: 12px; color: hsl(var(--muted-foreground)); }
.breadcrumb a { color: inherit; text-decoration: none; }
.breadcrumb a:hover { color: hsl(var(--primary)); }

.layout { padding: 20px; display: grid; gap: 16px; max-width: 1400px; margin: 0 auto; }

.filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px; padding: 14px; background: hsl(var(--card));
  border: 1px solid hsl(var(--border)); border-radius: 8px; }
.filters label { font-size: 11px; color: hsl(var(--muted-foreground));
  display: block; margin-bottom: 4px; font-weight: 500; }
.filters select { width: 100%; padding: 6px 8px; font-size: 12px; border-radius: 6px;
  border: 1px solid hsl(var(--border)); background: hsl(var(--background));
  color: hsl(var(--foreground)); font-family: inherit; }
.filters select:focus-visible { outline: 2px solid hsl(var(--ring)); outline-offset: 1px; }

.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.kpi { background: hsl(var(--card)); border: 1px solid hsl(var(--border));
  border-radius: 8px; padding: 14px; }
.kpi .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
  color: hsl(var(--muted-foreground)); }
.kpi .value { font-size: 22px; font-weight: 700; margin-top: 6px; color: hsl(var(--primary)); }
.kpi .delta { font-size: 11px; margin-top: 4px; color: hsl(var(--muted-foreground)); }

.card { background: hsl(var(--card)); border: 1px solid hsl(var(--border));
  border-radius: 8px; padding: 16px; }
.card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.card h2 { font-size: 14px; font-weight: 600; margin: 0 0 8px; color: hsl(var(--foreground)); }

.btn-secondary { padding: 6px 12px; font-size: 12px; border-radius: 6px;
  border: 1px solid hsl(var(--border)); background: hsl(var(--card));
  color: hsl(var(--foreground)); cursor: pointer; font-family: inherit; }
.btn-secondary:hover { background: hsl(var(--muted)); }

.chart-wrap { position: relative; height: 320px; }
.chart-wrap.small { height: 240px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead { background: hsl(var(--muted)); color: hsl(var(--muted-foreground));
  text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid hsl(var(--border)); }

.bottom { text-align: center; padding: 16px; font-size: 11px;
  color: hsl(var(--muted-foreground)); border-top: 1px solid hsl(var(--border)); }
`;

const vanillaJs = `/* Farol Estratégico — versão vanilla. Sem build. */
(async function () {
  const data = await fetch("data.json").then(r => r.json());
  const fmtBRL = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const fmtPct = v => (v ?? 0).toFixed(0) + "%";

  const filterDefs = [
    { key: "ppa", label: "PPA", options: ["Todos", "2024-2027", "2020-2023"] },
    { key: "iniciativa", label: "Iniciativa", options: ["Todas", "Capacita +", "Inovação CE"] },
    { key: "acao", label: "Ação", options: ["Todas", "Atendimento", "Capacitação", "Mentoria"] },
    { key: "natureza", label: "Natureza", options: ["Todas", "Custeio", "Investimento"] },
    { key: "unidade", label: "Unidade", options: ["Todas", "Sede", "Regional Cariri"] },
    { key: "eixo", label: "Eixo Estratégico", options: ["Todos", "Educação", "Competitividade"] },
    { key: "programa", label: "Programa", options: ["Todos", "MEI", "Pequenos Negócios"] },
    { key: "gestor", label: "Gestor", options: ["Todos", "Diretoria", "Superintendência"] },
  ];
  const filters = document.getElementById("filters");
  filterDefs.forEach(f => {
    const wrap = document.createElement("div");
    wrap.innerHTML = '<label for="f-' + f.key + '">' + f.label + '</label>' +
      '<select id="f-' + f.key + '">' + f.options.map(o => '<option>' + o + '</option>').join("") + '</select>';
    filters.appendChild(wrap);
  });

  const kpiBox = document.getElementById("kpis");
  [
    { label: "Despesas Planejadas", value: fmtBRL(data.kpis.despesas.planejada), delta: "Anual" },
    { label: "Despesas Executadas", value: fmtBRL(data.kpis.despesas.executada), delta: fmtPct(data.kpis.despesas.percentual) + " do planejado" },
    { label: "Receitas Previstas", value: fmtBRL(data.kpis.receitas.prevista), delta: "Anual" },
    { label: "Atendimentos", value: data.kpis.atendimento.total.toLocaleString("pt-BR"), delta: "Acumulado" },
  ].forEach(k => {
    const el = document.createElement("article");
    el.className = "kpi";
    el.innerHTML = '<div class="label">' + k.label + '</div><div class="value">' + k.value + '</div><div class="delta">' + k.delta + '</div>';
    kpiBox.appendChild(el);
  });

  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const hsl = (t, a = 1) => "hsl(" + cssVar(t) + " / " + a + ")";
  const primary = hsl("--primary");
  const primarySoft = hsl("--primary", 0.35);

  new Chart(document.getElementById("chartMensal"), {
    type: "bar",
    data: {
      labels: data.despesasMensais.map(d => d.mes.slice(0, 3)),
      datasets: [
        { label: "Planejada", data: data.despesasMensais.map(d => d.planejada), backgroundColor: primarySoft },
        { label: "Executada", data: data.despesasMensais.map(d => d.executada), backgroundColor: primary },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { ticks: { callback: v => fmtBRL(v) } } } },
  });

  new Chart(document.getElementById("chartTrimestre"), {
    type: "bar",
    data: {
      labels: data.trimestresTotais.map(t => t.label),
      datasets: [{ label: "Total", data: data.trimestresTotais.map(t => t.total), backgroundColor: primary }],
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: v => fmtBRL(v) } } } },
  });

  new Chart(document.getElementById("chartNatureza"), {
    type: "bar",
    data: {
      labels: data.despesasPorNatureza.map(n => n.natureza),
      datasets: [
        { label: "Planejada", data: data.despesasPorNatureza.map(n => n.planejada), backgroundColor: primarySoft },
        { label: "Executada", data: data.despesasPorNatureza.map(n => n.executada), backgroundColor: primary },
      ],
    },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } } },
  });

  const tbody = document.querySelector("#tabelaNatureza tbody");
  data.despesasPorNatureza.forEach(n => {
    const pct = n.planejada ? (n.executada / n.planejada) * 100 : 0;
    const tr = document.createElement("tr");
    tr.innerHTML = '<td>' + n.natureza + '</td><td>' + fmtBRL(n.planejada) + '</td><td>' + fmtBRL(n.executada) + '</td><td>' + fmtPct(pct) + '</td>';
    tbody.appendChild(tr);
  });

  document.getElementById("refresh").addEventListener("click", () => location.reload());
})();
`;

export async function downloadFarolVanilla() {
  const zip = new JSZip();
  const root = zip.folder("farol-estrategico")!;
  root.file("README.md", readmeVanilla());
  root.file("index.html", vanillaHtml);
  root.file("styles.css", vanillaCss);
  root.file("app.js", vanillaJs);
  root.file("data.json", buildDataJson());
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  saveAs(blob, "farol-estrategico-vanilla.zip");
}
